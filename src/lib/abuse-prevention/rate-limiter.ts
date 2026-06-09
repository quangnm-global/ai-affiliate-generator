import type { RateLimitState } from "@/lib/openai/types";

export interface RateLimitCheckResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
}

class SlidingWindowRateLimiter {
  private buckets = new Map<string, RateLimitState>();

  check(key: string, maxRequests: number, windowMs: number): RateLimitCheckResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
    }

    const remaining = Math.max(0, maxRequests - bucket.count);
    const retryAfterMs = Math.max(0, bucket.resetAt - now);

    if (bucket.count >= maxRequests) {
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAt: bucket.resetAt,
        retryAfterMs,
      };
    }

    bucket.count += 1;

    return {
      allowed: true,
      limit: maxRequests,
      remaining: remaining - 1,
      resetAt: bucket.resetAt,
      retryAfterMs: 0,
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      if (now >= bucket.resetAt) this.buckets.delete(key);
    }
  }
}

const limiter = new SlidingWindowRateLimiter();

if (typeof setInterval !== "undefined") {
  setInterval(() => limiter.cleanup(), 60_000);
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs = 60_000
): RateLimitCheckResult {
  return limiter.check(key, maxRequests, windowMs);
}
