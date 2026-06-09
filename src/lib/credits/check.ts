import type { SupabaseClient } from "@supabase/supabase-js";

import {
  GENERATION_CREDIT_COST,
  MIN_CREDITS_TO_GENERATE,
} from "@/lib/credits/constants";
import { InsufficientCreditsError } from "@/lib/credits/errors";

export async function getCreditBalance(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return 0;
  }

  return data.credits as number;
}

export async function assertCanGenerate(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const balance = await getCreditBalance(supabase, userId);

  if (balance < MIN_CREDITS_TO_GENERATE) {
    throw new InsufficientCreditsError(balance);
  }

  return balance;
}

export function canGenerate(credits: number): boolean {
  return credits >= GENERATION_CREDIT_COST;
}
