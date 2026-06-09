import {
  PRODUCTION_REQUIRED_SERVER_VARS,
  serverEnvSchema,
  type ServerEnv,
} from "@/lib/env/schema";

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`
    );
  }

  cached = parsed.data;
  return cached;
}

export function validateProductionEnv(): {
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

  for (const key of PRODUCTION_REQUIRED_SERVER_VARS) {
    if (!process.env[key]) missing.push(key);
  }

  return { ok: missing.length === 0, missing };
}

export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function getDeploymentMeta() {
  return {
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    url: process.env.VERCEL_URL ?? null,
  };
}
