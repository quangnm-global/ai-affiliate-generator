import { NextResponse } from "next/server";

import { generateTikTokContent } from "@/actions/tiktok-content";
import { abuseJsonResponse } from "@/lib/abuse-prevention/responses";
import { guardGenerationRequest } from "@/lib/abuse-prevention/api-guard";
import { isInsufficientCreditsError } from "@/lib/credits/errors";
import { tiktokContentInputSchema } from "@/lib/validations/tiktok-content";

/**
 * POST /api/tiktok/generate
 *
 * Generate TikTok Shop affiliate content (JSON output).
 */
export async function POST(request: Request) {
  const guarded = await guardGenerationRequest(
    request,
    tiktokContentInputSchema
  );
  if (guarded instanceof NextResponse) return guarded;

  const result = await generateTikTokContent(guarded.data);

  if (result.error) {
    if (
      isInsufficientCreditsError(result.error) ||
      result.code === "INSUFFICIENT_CREDITS"
    ) {
      return abuseJsonResponse(402, {
        error: result.error,
        code: "INSUFFICIENT_CREDITS",
      });
    }

    if (result.error === "Unauthorized") {
      return abuseJsonResponse(401, {
        error: result.error,
        code: "UNAUTHORIZED",
      });
    }

    return abuseJsonResponse(500, {
      error: result.error,
      code: "GENERATION_ERROR",
    });
  }

  return NextResponse.json(
    {
      id: result.id,
      data: result.data,
      tokensUsed: result.tokensUsed,
      model: result.model,
    },
    { status: 201 }
  );
}
