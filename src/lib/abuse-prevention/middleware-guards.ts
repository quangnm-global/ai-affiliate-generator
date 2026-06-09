import { type NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { abuseConfig } from "@/lib/abuse-prevention/config";
import {
  getClientIp,
  isAbuseExemptPath,
  isGenerationApiPath,
} from "@/lib/abuse-prevention/client";
import { abuseJsonResponse } from "@/lib/abuse-prevention/responses";
import { checkRateLimit } from "@/lib/abuse-prevention/rate-limiter";

function isApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

export function enforceMiddlewareAbuseGuards(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!isApiPath(pathname) || isAbuseExemptPath(pathname)) {
    return null;
  }

  const ip = getClientIp(request);
  const isGet = request.method === "GET" || request.method === "HEAD";
  const limit = isGet
    ? abuseConfig.api.maxGetRequestsPerMinute
    : abuseConfig.api.maxRequestsPerMinute;

  const result = checkRateLimit(`ip:api:${ip}`, limit, 60_000);
  if (!result.allowed) {
    return abuseJsonResponse(
      429,
      {
        error: "Too many API requests",
        code: "RATE_LIMIT",
      },
      result
    );
  }

  if (isGenerationApiPath(pathname) && request.method === "POST") {
    const generationResult = checkRateLimit(
      `ip:generation:${ip}`,
      abuseConfig.generation.maxRequestsPerMinute,
      60_000
    );

    if (!generationResult.allowed) {
      return abuseJsonResponse(
        429,
        {
          error: "Too many generation requests",
          code: "RATE_LIMIT",
        },
        generationResult
      );
    }
  }

  return null;
}

export function enforceMiddlewareAuthForGeneration(
  request: NextRequest,
  user: User | null
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!isGenerationApiPath(pathname) || request.method !== "POST") {
    return null;
  }

  if (!user) {
    return abuseJsonResponse(401, {
      error: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }

  return null;
}
