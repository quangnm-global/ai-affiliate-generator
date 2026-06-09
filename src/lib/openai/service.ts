import OpenAI from "openai";
import type { z } from "zod";

import { assertOpenAIConfig, openAIConfig } from "@/lib/openai/config";
import {
  mapSDKError,
  OpenAIServiceError,
} from "@/lib/openai/errors";
import { parseJsonResponse } from "@/lib/openai/json";
import { openAILogger } from "@/lib/openai/logger";
import { checkRateLimit } from "@/lib/openai/rate-limiter";
import { withRetry } from "@/lib/openai/retry";
import type {
  ChatCompletionJsonResult,
  ChatCompletionOptions,
  ChatCompletionResult,
  TokenUsage,
} from "@/lib/openai/types";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  assertOpenAIConfig();
  if (!client) {
    client = new OpenAI({
      apiKey: openAIConfig.apiKey,
      timeout: openAIConfig.timeoutMs,
      maxRetries: 0,
    });
  }
  return client;
}

function mapUsage(
  usage: OpenAI.Chat.Completions.ChatCompletion["usage"]
): TokenUsage {
  return {
    promptTokens: usage?.prompt_tokens ?? 0,
    completionTokens: usage?.completion_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0,
  };
}

function buildRequestParams(options: ChatCompletionOptions) {
  const model = options.model ?? openAIConfig.defaultModel;

  return {
    model,
    messages: options.messages,
    max_tokens: options.maxTokens,
    temperature: options.temperature,
    ...(options.responseFormat === "json_object"
      ? { response_format: { type: "json_object" as const } }
      : {}),
  };
}

export async function chatCompletion(
  options: ChatCompletionOptions
): Promise<ChatCompletionResult<string>> {
  const model = options.model ?? openAIConfig.defaultModel;
  const rateLimitKey = options.rateLimitKey ?? "global";
  const start = Date.now();

  checkRateLimit(rateLimitKey);

  openAILogger.info("Chat completion started", {
    operation: "chatCompletion",
    model,
    rateLimitKey,
    metadata: options.metadata,
  });

  const { result, attempts } = await withRetry(
    async () => {
      try {
        const response = await getClient().chat.completions.create(
          buildRequestParams(options)
        );

        const content = response.choices[0]?.message?.content;

        if (!content) {
          throw new OpenAIServiceError(
            "OpenAI returned an empty response",
            "EMPTY_RESPONSE",
            { retryable: true }
          );
        }

        return {
          content,
          model: response.model,
          usage: mapUsage(response.usage),
          finishReason: response.choices[0]?.finish_reason ?? null,
        };
      } catch (error) {
        throw mapSDKError(error);
      }
    },
    {
      maxRetries: options.maxRetries,
      operation: "chatCompletion",
      metadata: { ...options.metadata, model, rateLimitKey },
    }
  );

  const durationMs = Date.now() - start;

  openAILogger.info("Chat completion succeeded", {
    operation: "chatCompletion",
    model: result.model,
    rateLimitKey,
    attempt: attempts,
    durationMs,
    tokens: result.usage.totalTokens,
    metadata: options.metadata,
  });

  return {
    content: result.content,
    model: result.model,
    usage: result.usage,
    finishReason: result.finishReason,
    attempts,
    durationMs,
  };
}

export async function chatCompletionJson<T>(
  options: ChatCompletionOptions,
  schema: z.ZodType<T>
): Promise<ChatCompletionJsonResult<T>> {
  const result = await chatCompletion({
    ...options,
    responseFormat: "json_object",
  });

  const parsed = parseJsonResponse(result.content, schema);

  return {
    ...result,
    content: parsed,
    raw: result.content,
  };
}

export { openAIConfig, assertOpenAIConfig };
