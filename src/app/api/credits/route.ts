import { NextResponse } from "next/server";

import { getCredits } from "@/actions/credits";
import { guardReadRequest } from "@/lib/abuse-prevention/api-guard";
import { abuseJsonResponse } from "@/lib/abuse-prevention/responses";

export async function GET() {
  const auth = await guardReadRequest();
  if (auth instanceof NextResponse) return auth;

  const result = await getCredits();

  if (result.error === "Unauthorized") {
    return abuseJsonResponse(401, {
      error: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }

  return NextResponse.json({
    credits: result.credits,
    canGenerate: result.canGenerate,
  });
}
