export const abuseConfig = {
  api: {
    maxRequestsPerMinute: Number(process.env.ABUSE_API_RATE_LIMIT_RPM ?? 60),
    maxGetRequestsPerMinute: Number(
      process.env.ABUSE_API_GET_RATE_LIMIT_RPM ?? 120
    ),
  },
  generation: {
    maxRequestsPerMinute: Number(
      process.env.ABUSE_GENERATION_RATE_LIMIT_RPM ?? 10
    ),
    cooldownMs: Number(process.env.ABUSE_GENERATION_COOLDOWN_MS ?? 5_000),
    burstMax: Number(process.env.ABUSE_BURST_MAX ?? 3),
    burstWindowMs: Number(process.env.ABUSE_BURST_WINDOW_MS ?? 10_000),
    duplicateWindowMs: Number(process.env.ABUSE_DUPLICATE_WINDOW_MS ?? 60_000),
  },
  request: {
    maxBodyBytes: Number(process.env.ABUSE_MAX_BODY_BYTES ?? 65_536),
  },
} as const;

export const GENERATION_API_PATHS = [
  "/api/generations",
  "/api/tiktok/generate",
] as const;

export const ABUSE_EXEMPT_PATHS = ["/api/health"] as const;
