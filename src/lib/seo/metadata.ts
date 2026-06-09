import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import {
  getSiteUrl,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  TWITTER_HANDLE,
} from "@/lib/seo/site";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  locale?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function createMetadata({
  title,
  description,
  path = "",
  locale = routing.defaultLocale,
  noIndex = false,
  keywords = SITE_KEYWORDS,
}: CreateMetadataOptions = {}): Metadata {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  const localePath = `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
  const url = `${siteUrl}${localePath}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const ogLocale = locale === "vi" ? "vi_VN" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}${normalizedPath === "/" ? "" : normalizedPath}`,
        ])
      ),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
