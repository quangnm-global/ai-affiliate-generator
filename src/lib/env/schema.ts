import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_MAX_RETRIES: z.coerce.number().int().min(0).max(10).default(3),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().min(1_000).default(60_000),
  OPENAI_RATE_LIMIT_RPM: z.coerce.number().int().min(1).default(60),
  OPENAI_RETRY_BASE_MS: z.coerce.number().int().min(100).default(1_000),
  OPENAI_RETRY_MAX_MS: z.coerce.number().int().min(1_000).default(30_000),
  GENERATION_CREDIT_COST: z.coerce.number().int().min(1).default(1),
  SIGNUP_BONUS_CREDITS: z.coerce.number().int().min(0).default(5),
  ABUSE_API_RATE_LIMIT_RPM: z.coerce.number().int().min(1).default(60),
  ABUSE_API_GET_RATE_LIMIT_RPM: z.coerce.number().int().min(1).default(120),
  ABUSE_GENERATION_RATE_LIMIT_RPM: z.coerce.number().int().min(1).default(10),
  ABUSE_GENERATION_COOLDOWN_MS: z.coerce.number().int().min(0).default(5_000),
  ABUSE_BURST_MAX: z.coerce.number().int().min(1).default(3),
  ABUSE_BURST_WINDOW_MS: z.coerce.number().int().min(1_000).default(10_000),
  ABUSE_DUPLICATE_WINDOW_MS: z.coerce.number().int().min(1_000).default(60_000),
  ABUSE_MAX_BODY_BYTES: z.coerce.number().int().min(1_024).default(65_536),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  VERCEL_URL: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const PRODUCTION_REQUIRED_SERVER_VARS = [
  "OPENAI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export const PRODUCTION_REQUIRED_CLIENT_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
] as const;
