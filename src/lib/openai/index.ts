export { openAIConfig, assertOpenAIConfig } from "@/lib/openai/config";
export {
  OpenAIServiceError,
  OpenAIRateLimitError,
  OpenAIAuthError,
  OpenAITimeoutError,
  isOpenAIServiceError,
  isRetryableOpenAIError,
  mapSDKError,
} from "@/lib/openai/errors";
export { openAILogger } from "@/lib/openai/logger";
export { checkRateLimit } from "@/lib/openai/rate-limiter";
export { chatCompletion, chatCompletionJson } from "@/lib/openai/service";
export type {
  ChatMessage,
  ChatCompletionOptions,
  ChatCompletionResult,
  ChatCompletionJsonResult,
  TokenUsage,
  LogContext,
} from "@/lib/openai/types";
