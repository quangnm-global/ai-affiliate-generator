import { OpenAIServiceError } from "@/lib/openai/errors";
import type { z } from "zod";

export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch (error) {
    throw new OpenAIServiceError("Failed to parse JSON response", "PARSE_ERROR", {
      retryable: false,
      cause: error,
    });
  }
}

export function parseJsonResponse<T>(
  raw: string,
  schema: z.ZodType<T>
): T {
  const parsed = extractJson(raw);
  const validated = schema.safeParse(parsed);

  if (!validated.success) {
    throw new OpenAIServiceError(
      validated.error.issues.map((i) => i.message).join("; "),
      "VALIDATION",
      { retryable: false, cause: validated.error }
    );
  }

  return validated.data;
}
