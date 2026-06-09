import type { SupabaseClient } from "@supabase/supabase-js";

import { assertCanGenerate } from "@/lib/credits/check";
import { GENERATION_CREDIT_COST } from "@/lib/credits/constants";
import { mapCreditRpcError } from "@/lib/credits/errors";
import type { CreateGenerationInput } from "@/lib/validations/generation";

interface DeductCreditParams {
  supabase: SupabaseClient;
  userId: string;
  input: CreateGenerationInput;
  prompt: string;
}

/**
 * Atomically deduct 1 credit and create a pending generation record.
 * Uses PostgreSQL FOR UPDATE + single transaction via RPC.
 */
export async function deductCreditAndCreateGeneration({
  supabase,
  userId,
  input,
  prompt,
}: DeductCreditParams) {
  // Fast-fail before RPC (UX); RPC is the authoritative guard
  await assertCanGenerate(supabase, userId);

  const { data, error } = await supabase.rpc("create_generation_with_credit", {
    p_user_id: userId,
    p_title: input.title,
    p_content_type: input.contentType,
    p_product_name: input.productName,
    p_affiliate_url: input.affiliateUrl || null,
    p_keywords: input.keywords ?? null,
    p_tone: input.tone,
    p_prompt: prompt,
  });

  if (error) {
    mapCreditRpcError(error);
  }

  return {
    generationId: data as string,
    creditsCost: GENERATION_CREDIT_COST,
  };
}

/**
 * Refund 1 credit when generation fails after deduction.
 * Called only from server-side code.
 */
export async function refundGenerationCredit(
  supabase: SupabaseClient,
  userId: string,
  generationId: string
) {
  const { error } = await supabase.rpc("refund_generation_credit", {
    p_user_id: userId,
    p_generation_id: generationId,
  });

  if (error) {
    const { logger } = await import("@/lib/logging");
    logger.error("Credit refund failed", {
      service: "credits",
      metadata: { message: error.message, generationId },
    });
  }
}
