import type { ContentType } from "@/types/database";
import type { Tone } from "@/types/generation";

interface BuildPromptInput {
  contentType: ContentType;
  productName: string;
  affiliateUrl?: string;
  keywords?: string[];
  tone: Tone;
}

const CONTENT_INSTRUCTIONS: Record<ContentType, string> = {
  product_review:
    "Write a compelling affiliate product review with pros, cons, and a clear recommendation.",
  comparison:
    "Write a comparison article highlighting key differences and helping readers choose.",
  buying_guide:
    "Write a comprehensive buying guide with sections, tips, and a final recommendation.",
  social_post:
    "Write a short, engaging social media post with a hook and call-to-action.",
};

export function buildPrompt(input: BuildPromptInput): string {
  const keywords = input.keywords?.length
    ? `Target keywords: ${input.keywords.join(", ")}.`
    : "";

  const affiliate = input.affiliateUrl
    ? `Include a natural call-to-action linking to: ${input.affiliateUrl}`
    : "Include a placeholder [AFFILIATE_LINK] for the affiliate URL.";

  return [
    `You are an expert affiliate content writer.`,
    CONTENT_INSTRUCTIONS[input.contentType],
    `Product: ${input.productName}`,
    `Tone: ${input.tone}`,
    keywords,
    affiliate,
    `Output in Markdown. Do not include disclaimers about being an AI.`,
  ]
    .filter(Boolean)
    .join("\n");
}
