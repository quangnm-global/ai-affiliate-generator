export type OpenAIErrorCode =
  | "AUTH_ERROR"
  | "RATE_LIMIT"
  | "TIMEOUT"
  | "VALIDATION"
  | "API_ERROR"
  | "EMPTY_RESPONSE"
  | "PARSE_ERROR"
  | "CONFIG_ERROR";

export class OpenAIServiceError extends Error {
  readonly code: OpenAIErrorCode;
  readonly statusCode?: number;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(
    message: string,
    code: OpenAIErrorCode,
    options?: {
      statusCode?: number;
      retryable?: boolean;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = "OpenAIServiceError";
    this.code = code;
    this.statusCode = options?.statusCode;
    this.retryable = options?.retryable ?? false;
    this.cause = options?.cause;
  }
}

export class OpenAIRateLimitError extends OpenAIServiceError {
  constructor(message = "OpenAI rate limit exceeded", cause?: unknown) {
    super(message, "RATE_LIMIT", { statusCode: 429, retryable: true, cause });
    this.name = "OpenAIRateLimitError";
  }
}

export class OpenAIAuthError extends OpenAIServiceError {
  constructor(message = "OpenAI authentication failed", cause?: unknown) {
    super(message, "AUTH_ERROR", { statusCode: 401, retryable: false, cause });
    this.name = "OpenAIAuthError";
  }
}

export class OpenAITimeoutError extends OpenAIServiceError {
  constructor(message = "OpenAI request timed out", cause?: unknown) {
    super(message, "TIMEOUT", { retryable: true, cause });
    this.name = "OpenAITimeoutError";
  }
}

export function isOpenAIServiceError(error: unknown): error is OpenAIServiceError {
  return error instanceof OpenAIServiceError;
}

export function isRetryableOpenAIError(error: unknown): boolean {
  if (error instanceof OpenAIServiceError) return error.retryable;
  return false;
}

export function mapSDKError(error: unknown): OpenAIServiceError {
  if (error instanceof OpenAIServiceError) return error;

  const err = error as {
    status?: number;
    message?: string;
    name?: string;
  };

  const message = err.message ?? "OpenAI API error";
  const status = err.status;

  if (status === 401 || status === 403) {
    return new OpenAIAuthError(message, error);
  }

  if (status === 429) {
    return new OpenAIRateLimitError(message, error);
  }

  if (status === 408 || err.name === "AbortError") {
    return new OpenAITimeoutError(message, error);
  }

  if (status !== undefined && status >= 500) {
    return new OpenAIServiceError(message, "API_ERROR", {
      statusCode: status,
      retryable: true,
      cause: error,
    });
  }

  if (status !== undefined && status >= 400) {
    return new OpenAIServiceError(message, "VALIDATION", {
      statusCode: status,
      retryable: false,
      cause: error,
    });
  }

  return new OpenAIServiceError(message, "API_ERROR", {
    retryable: true,
    cause: error,
  });
}
