export const openAIConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  maxRetries: Number(process.env.OPENAI_MAX_RETRIES ?? 3),
  timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS ?? 60_000),
  rateLimit: {
    maxRequests: Number(process.env.OPENAI_RATE_LIMIT_RPM ?? 60),
    windowMs: 60_000,
  },
  retry: {
    baseDelayMs: Number(process.env.OPENAI_RETRY_BASE_MS ?? 1_000),
    maxDelayMs: Number(process.env.OPENAI_RETRY_MAX_MS ?? 30_000),
  },
} as const;

import { OpenAIServiceError } from "@/lib/openai/errors";

export function assertOpenAIConfig() {
  if (!openAIConfig.apiKey) {
    throw new OpenAIServiceError(
      "OPENAI_API_KEY is not configured",
      "CONFIG_ERROR",
      { retryable: false }
    );
  }
}
