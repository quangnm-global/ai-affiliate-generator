"use server";

import { revalidatePath } from "next/cache";

import {
  deductCreditAndCreateGeneration,
  refundGenerationCredit,
} from "@/lib/credits/deduct";
import { isInsufficientCreditsError } from "@/lib/credits/errors";
import {
  PipelineParseError,
  PipelineValidationError,
  runTikTokContentPipeline,
} from "@/lib/openai/tiktok-pipeline";
import { isOpenAIServiceError } from "@/lib/openai";
import { buildTikTokUserPrompt, TIKTOK_SYSTEM_PROMPT } from "@/lib/openai/tiktok-prompts";
import { createClient } from "@/lib/supabase/server";
import {
  tiktokContentInputSchema,
  type TikTokContentInputParsed,
} from "@/lib/validations/tiktok-content";
import type { TikTokContentOutput } from "@/types/tiktok-content";

export async function generateTikTokContent(rawInput: TikTokContentInputParsed) {
  const parsed = tiktokContentInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const input = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const prompt = [
    "=== SYSTEM ===",
    TIKTOK_SYSTEM_PROMPT,
    "=== USER ===",
    buildTikTokUserPrompt(input),
  ].join("\n\n");

  let generationId: string;

  try {
    const result = await deductCreditAndCreateGeneration({
      supabase,
      userId: user.id,
      input: {
        title: `TikTok: ${input.productName}`,
        contentType: "social_post",
        productName: input.productName,
        tone: "enthusiastic",
      },
      prompt,
    });
    generationId = result.generationId;
  } catch (err) {
    if (isInsufficientCreditsError(err)) {
      return { error: err.message, code: "INSUFFICIENT_CREDITS" as const };
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }

  try {
    const pipeline = await runTikTokContentPipeline(input, {
      rateLimitKey: user.id,
    });
    const outputJson = JSON.stringify(pipeline.data, null, 2);

    await supabase
      .from("generations")
      .update({
        output: outputJson,
        tokens_used: pipeline.tokensUsed,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", generationId);

    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath(`/history/${generationId}`);

    return {
      id: generationId,
      data: pipeline.data as TikTokContentOutput,
      tokensUsed: pipeline.tokensUsed,
      model: pipeline.model,
      error: null,
    };
  } catch (err) {
    let message = "Generation failed";
    if (err instanceof PipelineParseError || err instanceof PipelineValidationError) {
      message = err.message;
    } else if (isOpenAIServiceError(err)) {
      message = err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    await supabase
      .from("generations")
      .update({ status: "failed", error_message: message })
      .eq("id", generationId);

    await refundGenerationCredit(supabase, user.id, generationId);

    revalidatePath("/dashboard");

    return { error: message };
  }
}
