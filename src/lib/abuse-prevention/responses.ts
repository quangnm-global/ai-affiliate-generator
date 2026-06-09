import { NextResponse } from "next/server";

import type { AbuseErrorCode } from "@/lib/abuse-prevention/errors";
import type { RateLimitCheckResult } from "@/lib/abuse-prevention/rate-limiter";

interface AbuseResponseBody {
  error: string;
  code: AbuseErrorCode | string;
  details?: unknown;
}

export function abuseJsonResponse(
  status: number,
  body: AbuseResponseBody,
  rateLimit?: RateLimitCheckResult
) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (rateLimit) {
    headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    headers.set("X-RateLimit-Reset", String(Math.ceil(rateLimit.resetAt / 1000)));
  }

  if (body.code === "RATE_LIMIT" || body.code === "SPAM") {
    const retryAfter = rateLimit?.retryAfterMs
      ? Math.ceil(rateLimit.retryAfterMs / 1000)
      : 60;
    headers.set("Retry-After", String(retryAfter));
  }

  return NextResponse.json(body, { status, headers });
}
