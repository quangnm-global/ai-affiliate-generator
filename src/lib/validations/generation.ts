import { z } from "zod";

import { TONE_OPTIONS } from "@/types/generation";
import type { ContentType } from "@/types/database";

const contentTypes = [
  "product_review",
  "comparison",
  "buying_guide",
  "social_post",
] as const satisfies readonly ContentType[];

export const createGenerationSchema = z.object({
  title: z.string().min(3).max(200),
  contentType: z.enum(contentTypes),
  productName: z.string().min(2).max(200),
  affiliateUrl: z
    .string()
    .url()
    .refine((url) => url.startsWith("https://"), "URL must use HTTPS")
    .optional()
    .or(z.literal("")),
  keywords: z.array(z.string().min(1).max(50)).max(10).optional(),
  tone: z.enum(TONE_OPTIONS).default("professional"),
});

export type CreateGenerationInput = z.infer<typeof createGenerationSchema>;

/** Every generation costs exactly 1 credit */
export function getCreditCost() {
  return 1;
}
