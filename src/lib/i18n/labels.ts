import type { ContentType } from "@/types/database";
import type { Tone } from "@/types/generation";

export const CONTENT_TYPE_KEYS: Record<ContentType, string> = {
  product_review: "productReview",
  comparison: "comparison",
  buying_guide: "buyingGuide",
  social_post: "socialPost",
};

export const TONE_KEYS: Record<Tone, string> = {
  professional: "professional",
  casual: "casual",
  enthusiastic: "enthusiastic",
  informative: "informative",
};

export const GENERATION_STATUS_KEYS = {
  pending: "pending",
  completed: "completed",
  failed: "failed",
} as const;
