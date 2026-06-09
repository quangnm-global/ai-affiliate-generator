import type { SupabaseClient } from "@supabase/supabase-js";

import { assertCanGenerate } from "@/lib/credits/check";
import { InsufficientCreditsError } from "@/lib/credits/errors";
import { AbuseError } from "@/lib/abuse-prevention/errors";

export async function assertCreditsForGeneration(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  try {
    return await assertCanGenerate(supabase, userId);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      throw new AbuseError(error.message, "INSUFFICIENT_CREDITS", 402);
    }
    throw error;
  }
}
