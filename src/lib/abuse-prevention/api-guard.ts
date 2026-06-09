import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { z } from "zod";

import { abuseConfig } from "@/lib/abuse-prevention/config";
import { assertCreditsForGeneration } from "@/lib/abuse-prevention/credit-guard";
import { AbuseError } from "@/lib/abuse-prevention/errors";
import { abuseJsonResponse } from "@/lib/abuse-prevention/responses";
import { checkRateLimit } from "@/lib/abuse-prevention/rate-limiter";
import { checkGenerationSpam } from "@/lib/abuse-prevention/spam";
import {
  assertJsonContentType,
  parseJsonBody,
  validateBody,
} from "@/lib/abuse-prevention/validation";
import { createClient } from "@/lib/supabase/server";

export interface AuthenticatedContext {
  user: User;
  supabase: SupabaseClient;
}

export async function requireAuthenticatedUser(): Promise<
  AuthenticatedContext | NextResponse
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return abuseJsonResponse(401, {
      error: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }

  return { user, supabase };
}

export function enforceUserApiRateLimit(
  userId: string,
  scope: "read" | "write" = "read"
): void {
  const limit =
    scope === "write"
      ? abuseConfig.api.maxRequestsPerMinute
      : abuseConfig.api.maxGetRequestsPerMinute;

  const result = checkRateLimit(`user:api:${scope}:${userId}`, limit, 60_000);
  if (!result.allowed) {
    throw new AbuseError("API rate limit exceeded", "RATE_LIMIT", 429, result.retryAfterMs);
  }
}

export async function guardGenerationRequest<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ user: User; supabase: SupabaseClient; data: T } | NextResponse> {
  const auth = await requireAuthenticatedUser();
  if (auth instanceof NextResponse) return auth;

  const { user, supabase } = auth;

  try {
    enforceUserApiRateLimit(user.id, "write");
    assertJsonContentType(request);

    const body = await parseJsonBody(request);
    const data = validateBody(body, schema);

    checkGenerationSpam(user.id, data);
    await assertCreditsForGeneration(supabase, user.id);

    return { user, supabase, data };
  } catch (error) {
    if (error instanceof AbuseError) {
      return abuseJsonResponse(error.statusCode, {
        error: error.message,
        code: error.code,
      });
    }
    throw error;
  }
}

export async function guardReadRequest(): Promise<
  AuthenticatedContext | NextResponse
> {
  const auth = await requireAuthenticatedUser();
  if (auth instanceof NextResponse) return auth;

  try {
    enforceUserApiRateLimit(auth.user.id, "read");
    return auth;
  } catch (error) {
    if (error instanceof AbuseError) {
      return abuseJsonResponse(error.statusCode, {
        error: error.message,
        code: error.code,
      });
    }
    throw error;
  }
}
