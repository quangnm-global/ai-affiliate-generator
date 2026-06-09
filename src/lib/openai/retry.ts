import { openAIConfig } from "@/lib/openai/config";
import { isRetryableOpenAIError } from "@/lib/openai/errors";
import { openAILogger } from "@/lib/openai/logger";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateBackoff(attempt: number): number {
  const { baseDelayMs, maxDelayMs } = openAIConfig.retry;
  const exponential = baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseDelayMs * 0.5;
  return Math.min(exponential + jitter, maxDelayMs);
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options?: {
    maxRetries?: number;
    operation?: string;
    metadata?: Record<string, string | number | boolean>;
  }
): Promise<{ result: T; attempts: number }> {
  const maxRetries = options?.maxRetries ?? openAIConfig.maxRetries;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn(attempt);
      return { result, attempts: attempt + 1 };
    } catch (error) {
      lastError = error;

      if (attempt >= maxRetries || !isRetryableOpenAIError(error)) {
        throw error;
      }

      const delayMs = calculateBackoff(attempt);

      openAILogger.warn("Retrying OpenAI request", {
        operation: options?.operation ?? "unknown",
        attempt: attempt + 1,
        metadata: {
          ...options?.metadata,
          delayMs,
          error: error instanceof Error ? error.message : "unknown",
        },
      });

      await sleep(delayMs);
    }
  }

  throw lastError;
}
