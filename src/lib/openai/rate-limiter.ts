import { openAIConfig } from "@/lib/openai/config";
import { OpenAIRateLimitError } from "@/lib/openai/errors";
import type { RateLimitState } from "@/lib/openai/types";

/**
 * In-memory sliding-window rate limiter.
 * Suitable for single-instance MVP. Use Redis/Upstash for multi-instance production.
 */
class InMemoryRateLimiter {
  private buckets = new Map<string, RateLimitState>();

  check(key: string): void {
    const now = Date.now();
    const { maxRequests, windowMs } = openAIConfig.rateLimit;

    let bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
    }

    if (bucket.count >= maxRequests) {
      const retryAfterMs = bucket.resetAt - now;
      throw new OpenAIRateLimitError(
        `Rate limit exceeded. Retry after ${Math.ceil(retryAfterMs / 1000)}s`
      );
    }

    bucket.count += 1;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      if (now >= bucket.resetAt) this.buckets.delete(key);
    }
  }
}

const globalLimiter = new InMemoryRateLimiter();

if (typeof setInterval !== "undefined") {
  setInterval(() => globalLimiter.cleanup(), 60_000);
}

export function checkRateLimit(key = "global"): void {
  globalLimiter.check(key);
}
