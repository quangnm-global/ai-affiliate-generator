import type { MetadataRoute } from "next";

import { getSiteUrl, NOINDEX_PATHS } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: NOINDEX_PATHS.map((path) => `${path}/`),
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
