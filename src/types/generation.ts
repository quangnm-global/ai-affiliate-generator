import type { ContentType, Generation, GenerationStatus } from "@/types/database";

export type { ContentType, Generation, GenerationStatus };

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  product_review: "Product Review",
  comparison: "Comparison",
  buying_guide: "Buying Guide",
  social_post: "Social Post",
};

export const TONE_OPTIONS = [
  "professional",
  "casual",
  "enthusiastic",
  "informative",
] as const;

export type Tone = (typeof TONE_OPTIONS)[number];

/** @deprecated Use GENERATION_CREDIT_COST from @/lib/credits/constants */
export const CONTENT_TYPE_CREDIT_COST: Record<ContentType, number> = {
  product_review: 1,
  comparison: 1,
  buying_guide: 1,
  social_post: 1,
};
