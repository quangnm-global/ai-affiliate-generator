import { NextResponse } from "next/server";

import { createGeneration } from "@/actions/generations";
import { abuseJsonResponse } from "@/lib/abuse-prevention/responses";
import {
  guardGenerationRequest,
  guardReadRequest,
} from "@/lib/abuse-prevention/api-guard";
import { isInsufficientCreditsError } from "@/lib/credits/errors";
import { createGenerationSchema } from "@/lib/validations/generation";

export async function GET(request: Request) {
  const auth = await guardReadRequest();
  if (auth instanceof NextResponse) return auth;

  const { user, supabase } = auth;
  const { searchParams } = new URL(request.url);
  const rawLimit = Number(searchParams.get("limit") ?? 20);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(1, Math.floor(rawLimit)), 100)
    : 20;

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const guarded = await guardGenerationRequest(request, createGenerationSchema);
  if (guarded instanceof NextResponse) return guarded;

  const result = await createGeneration(guarded.data);

  if (result.error) {
    if (isInsufficientCreditsError(result.error) || result.error.includes("credits")) {
      return abuseJsonResponse(402, {
        error: result.error,
        code: "INSUFFICIENT_CREDITS",
      });
    }

    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
