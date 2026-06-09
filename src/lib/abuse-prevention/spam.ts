import { abuseConfig } from "@/lib/abuse-prevention/config";
import { AbuseError } from "@/lib/abuse-prevention/errors";
import { checkRateLimit } from "@/lib/abuse-prevention/rate-limiter";

const lastRequestAt = new Map<string, number>();
const recentFingerprints = new Map<string, { fingerprint: string; at: number }[]>();

function fingerprintPayload(payload: unknown): string {
  const normalized =
    typeof payload === "object" && payload !== null
      ? JSON.stringify(payload, Object.keys(payload).sort())
      : JSON.stringify(payload);
  let hash = 0;

  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }

  return hash.toString(36);
}

function pruneFingerprints(userId: string, now: number) {
  const windowMs = abuseConfig.generation.duplicateWindowMs;
  const entries = recentFingerprints.get(userId) ?? [];
  const pruned = entries.filter((entry) => now - entry.at < windowMs);

  if (pruned.length === 0) {
    recentFingerprints.delete(userId);
  } else {
    recentFingerprints.set(userId, pruned);
  }

  return pruned;
}

export function checkGenerationSpam(
  userId: string,
  payload: unknown
): void {
  const now = Date.now();
  const { cooldownMs, burstMax, burstWindowMs, duplicateWindowMs, maxRequestsPerMinute } =
    abuseConfig.generation;

  const lastAt = lastRequestAt.get(userId);
  if (lastAt !== undefined && now - lastAt < cooldownMs) {
    const retryAfterMs = cooldownMs - (now - lastAt);
    throw new AbuseError(
      `Please wait ${Math.ceil(retryAfterMs / 1000)}s before generating again`,
      "SPAM",
      429,
      retryAfterMs
    );
  }

  const burst = checkRateLimit(
    `burst:generation:${userId}`,
    burstMax,
    burstWindowMs
  );
  if (!burst.allowed) {
    throw new AbuseError(
      "Too many generation requests in a short period",
      "SPAM",
      429,
      burst.retryAfterMs
    );
  }

  const perMinute = checkRateLimit(
    `rpm:generation:${userId}`,
    maxRequestsPerMinute,
    60_000
  );
  if (!perMinute.allowed) {
    throw new AbuseError(
      "Generation rate limit exceeded",
      "RATE_LIMIT",
      429,
      perMinute.retryAfterMs
    );
  }

  const fp = fingerprintPayload(payload);
  const recent = pruneFingerprints(userId, now);

  if (recent.some((entry) => entry.fingerprint === fp)) {
    throw new AbuseError(
      "Duplicate request detected. Modify your input before retrying",
      "SPAM",
      429,
      duplicateWindowMs
    );
  }

  recent.push({ fingerprint: fp, at: now });
  recentFingerprints.set(userId, recent);
  lastRequestAt.set(userId, now);
}
