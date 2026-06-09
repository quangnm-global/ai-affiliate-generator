import {
  clientEnvSchema,
  PRODUCTION_REQUIRED_CLIENT_VARS,
  type ClientEnv,
} from "@/lib/env/schema";

let cached: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  if (cached) return cached;

  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid client environment: ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`
    );
  }

  cached = parsed.data;
  return cached;
}

export function validateProductionClientEnv(): {
  ok: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { ok: true, missing };
  }

  for (const key of PRODUCTION_REQUIRED_CLIENT_VARS) {
    if (!process.env[key]) missing.push(key);
  }

  return { ok: missing.length === 0, missing };
}
