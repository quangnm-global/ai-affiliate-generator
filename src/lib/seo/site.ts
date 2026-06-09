export const SITE_NAME = "Affiliate AI";

export const SITE_TAGLINE = "AI Affiliate Content Generator";

export const SITE_DESCRIPTION =
  "Generate TikTok scripts, product reviews, and sales captions for affiliate marketing. Optimized for TikTok Shop and Vietnamese audiences. Start free with 5 credits.";

export const SITE_KEYWORDS = [
  "affiliate marketing",
  "AI content generator",
  "TikTok Shop",
  "TikTok scripts",
  "product reviews",
  "affiliate content",
  "Vietnamese marketing",
  "social media content",
  "sales captions",
  "content automation",
];

export const SITE_LOCALE = "en_US";

export const TWITTER_HANDLE = "@affiliateai";

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const PUBLIC_ROUTES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/login", changeFrequency: "monthly" as const, priority: 0.5 },
];

export const NOINDEX_PATHS = [
  "/dashboard",
  "/generate",
  "/history",
  "/settings",
  "/auth",
  "/api",
];
