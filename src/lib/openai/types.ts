import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

export type ChatMessage = ChatCompletionMessageParam;

export type ResponseFormat = "text" | "json_object";

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  responseFormat?: ResponseFormat;
  rateLimitKey?: string;
  maxRetries?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatCompletionResult<TContent = string> {
  content: TContent;
  model: string;
  usage: TokenUsage;
  finishReason: string | null;
  attempts: number;
  durationMs: number;
}

export interface ChatCompletionJsonResult<T> extends ChatCompletionResult<T> {
  raw: string;
}

export type OpenAIChatParams = ChatCompletionCreateParamsNonStreaming;
export type OpenAIChatResponse = ChatCompletion;

export interface RateLimitState {
  count: number;
  resetAt: number;
}

export interface LogContext {
  operation: string;
  model?: string;
  rateLimitKey?: string;
  attempt?: number;
  durationMs?: number;
  tokens?: number;
  metadata?: Record<string, string | number | boolean>;
  error?: string;
}
