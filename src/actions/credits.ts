"use server";

import { getCreditBalance, canGenerate } from "@/lib/credits/check";
import { createClient } from "@/lib/supabase/server";

export async function getCredits() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { credits: 0, canGenerate: false, error: "Unauthorized" };
  }

  const credits = await getCreditBalance(supabase, user.id);

  return {
    credits,
    canGenerate: canGenerate(credits),
    error: null,
  };
}

export async function getCreditTransactions(limit = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data ?? [], error: error?.message ?? null };
}
