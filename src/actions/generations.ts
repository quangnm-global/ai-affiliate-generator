"use server";

import { revalidatePath } from "next/cache";

import {
  deductCreditAndCreateGeneration,
  refundGenerationCredit,
} from "@/lib/credits/deduct";
import { isInsufficientCreditsError } from "@/lib/credits/errors";
import { chatCompletion, isOpenAIServiceError } from "@/lib/openai";
import { buildPrompt } from "@/lib/openai/prompts";
import { createClient } from "@/lib/supabase/server";
import {
  createGenerationSchema,
  type CreateGenerationInput,
} from "@/lib/validations/generation";
import type { Generation } from "@/types/database";

export async function createGeneration(rawInput: CreateGenerationInput) {
  const parsed = createGenerationSchema.safeParse(rawInput);
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

  const prompt = buildPrompt({
    contentType: input.contentType,
    productName: input.productName,
    affiliateUrl: input.affiliateUrl || undefined,
    keywords: input.keywords,
    tone: input.tone,
  });

  let generationId: string;

  try {
    const result = await deductCreditAndCreateGeneration({
      supabase,
      userId: user.id,
      input,
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
    const result = await chatCompletion({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 2000,
      rateLimitKey: user.id,
      metadata: { generationId, contentType: input.contentType },
    });

    const output = result.content;
    const tokensUsed = result.usage.totalTokens;

    await supabase
      .from("generations")
      .update({
        output,
        tokens_used: tokensUsed,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", generationId);

    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath(`/history/${generationId}`);

    return { id: generationId, output, error: null };
  } catch (err) {
    const message = isOpenAIServiceError(err)
      ? err.message
      : err instanceof Error
        ? err.message
        : "Generation failed";

    await supabase
      .from("generations")
      .update({
        status: "failed",
        error_message: message,
      })
      .eq("id", generationId);

    await refundGenerationCredit(supabase, user.id, generationId);

    revalidatePath("/dashboard");

    return { error: message };
  }
}

export async function getGenerations(limit = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as Generation[], error: error?.message ?? null };
}

export async function getGeneration(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return { data: data as Generation | null, error: error?.message ?? null };
}
