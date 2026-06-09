import { z } from "zod";

export const HOOK_MAX_WORDS = 12;
export const HOOK_COUNT = 10;
export const HASHTAG_COUNT = 10;

export const tiktokContentInputSchema = z.object({
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be at most 200 characters"),
  productDescription: z
    .string()
    .min(10, "Product description must be at least 10 characters")
    .max(2000, "Product description must be at most 2000 characters"),
});

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const hookSchema = z
  .string()
  .min(5)
  .refine(
    (val) => countWords(val) <= HOOK_MAX_WORDS,
    `Hook must be ${HOOK_MAX_WORDS} words or fewer`
  );

const hashtagSchema = z
  .string()
  .regex(/^#[^\s#]+$/, "Each hashtag must start with # and contain no spaces");

export const tiktokContentOutputSchema = z.object({
  hooks: z.array(hookSchema).length(HOOK_COUNT),
  script: z.string().min(80).max(1500),
  caption: z.string().min(20).max(400),
  hashtags: z.array(hashtagSchema).length(HASHTAG_COUNT),
});

export type TikTokContentInputParsed = z.infer<typeof tiktokContentInputSchema>;
export type TikTokContentOutputParsed = z.infer<typeof tiktokContentOutputSchema>;

export const TIKTOK_OUTPUT_JSON_SCHEMA = {
  hooks: `string[${HOOK_COUNT}] — viral opening hooks in Vietnamese, max ${HOOK_MAX_WORDS} words each`,
  script: "string — full spoken TikTok script, 30–45 seconds, conversational Vietnamese",
  caption: "string — sales caption with natural CTA, max 300 characters",
  hashtags: `string[${HASHTAG_COUNT}] — mix trending VN + niche tags, each starts with #`,
} as const;

export function parseTikTokOutput(raw: unknown) {
  return tiktokContentOutputSchema.safeParse(raw);
}
