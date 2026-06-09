import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import {
  chatCompletion,
  isOpenAIServiceError,
} from "@/lib/openai";
import { parseJsonResponse } from "@/lib/openai/json";
import {
  buildTikTokUserPrompt,
  TIKTOK_RETRY_PROMPT,
  TIKTOK_SYSTEM_PROMPT,
} from "@/lib/openai/tiktok-prompts";
import {
  tiktokContentOutputSchema,
  type TikTokContentInputParsed,
} from "@/lib/validations/tiktok-content";
import type {
  TikTokContentOutput,
  TikTokPipelineResult,
} from "@/types/tiktok-content";

const MAX_VALIDATION_RETRIES = 2;

function buildMessages(
  input: TikTokContentInputParsed,
  previousInvalidResponse?: string
): ChatCompletionMessageParam[] {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: TIKTOK_SYSTEM_PROMPT },
    { role: "user", content: buildTikTokUserPrompt(input) },
  ];

  if (previousInvalidResponse) {
    messages.push(
      { role: "assistant", content: previousInvalidResponse },
      { role: "user", content: TIKTOK_RETRY_PROMPT }
    );
  }

  return messages;
}

export async function runTikTokContentPipeline(
  input: TikTokContentInputParsed,
  options?: { rateLimitKey?: string }
): Promise<TikTokPipelineResult> {
  let lastRaw = "";
  let totalTokens = 0;
  let model = "";

  for (let attempt = 0; attempt <= MAX_VALIDATION_RETRIES; attempt++) {
    try {
      const result = await chatCompletion({
        messages: buildMessages(input, attempt > 0 ? lastRaw : undefined),
        responseFormat: "json_object",
        temperature: 0.85,
        maxTokens: 3500,
        rateLimitKey: options?.rateLimitKey,
        metadata: {
          pipeline: "tiktok",
          validationAttempt: attempt,
        },
      });

      totalTokens += result.usage.totalTokens;
      model = result.model;
      lastRaw = result.content;

      const data = parseJsonResponse(result.content, tiktokContentOutputSchema);

      return {
        data: data as TikTokContentOutput,
        tokensUsed: totalTokens,
        model,
      };
    } catch (error) {
      if (isOpenAIServiceError(error)) {
        if (
          (error.code === "VALIDATION" || error.code === "PARSE_ERROR") &&
          attempt < MAX_VALIDATION_RETRIES
        ) {
          continue;
        }

        if (error.code === "VALIDATION") {
          throw new PipelineValidationError(error.message);
        }
        if (error.code === "PARSE_ERROR") {
          throw new PipelineParseError(error.message);
        }
        throw error;
      }

      if (attempt === MAX_VALIDATION_RETRIES) {
        throw new PipelineParseError(
          error instanceof Error ? error.message : "Failed to parse AI response"
        );
      }
    }
  }

  throw new PipelineParseError("Pipeline exhausted retries");
}

export class PipelineParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PipelineParseError";
  }
}

export class PipelineValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PipelineValidationError";
  }
}
