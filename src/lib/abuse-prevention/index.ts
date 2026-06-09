export { abuseConfig, GENERATION_API_PATHS, ABUSE_EXEMPT_PATHS } from "@/lib/abuse-prevention/config";
export { AbuseError, isAbuseError } from "@/lib/abuse-prevention/errors";
export type { AbuseErrorCode } from "@/lib/abuse-prevention/errors";
export { checkRateLimit } from "@/lib/abuse-prevention/rate-limiter";
export type { RateLimitCheckResult } from "@/lib/abuse-prevention/rate-limiter";
export { checkGenerationSpam } from "@/lib/abuse-prevention/spam";
export {
  assertContentLength,
  assertJsonContentType,
  parseJsonBody,
  validateBody,
  rejectHoneypot,
} from "@/lib/abuse-prevention/validation";
export { assertCreditsForGeneration } from "@/lib/abuse-prevention/credit-guard";
export { abuseJsonResponse } from "@/lib/abuse-prevention/responses";
export {
  getClientIp,
  isGenerationApiPath,
  isAbuseExemptPath,
} from "@/lib/abuse-prevention/client";
export {
  enforceMiddlewareAbuseGuards,
  enforceMiddlewareAuthForGeneration,
} from "@/lib/abuse-prevention/middleware-guards";
export {
  requireAuthenticatedUser,
  enforceUserApiRateLimit,
  guardGenerationRequest,
  guardReadRequest,
} from "@/lib/abuse-prevention/api-guard";
export type { AuthenticatedContext } from "@/lib/abuse-prevention/api-guard";
