export type AbuseErrorCode =
  | "RATE_LIMIT"
  | "SPAM"
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "INSUFFICIENT_CREDITS"
  | "PAYLOAD_TOO_LARGE";

export class AbuseError extends Error {
  readonly code: AbuseErrorCode;
  readonly statusCode: number;
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    code: AbuseErrorCode,
    statusCode: number,
    retryAfterMs?: number
  ) {
    super(message);
    this.name = "AbuseError";
    this.code = code;
    this.statusCode = statusCode;
    this.retryAfterMs = retryAfterMs;
  }
}

export function isAbuseError(error: unknown): error is AbuseError {
  return error instanceof AbuseError;
}
