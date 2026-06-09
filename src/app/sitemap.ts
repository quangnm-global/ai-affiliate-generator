import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getSiteUrl, PUBLIC_ROUTES } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return routing.locales.flatMap((locale) =>
    PUBLIC_ROUTES.map((route) => ({
      url: `${siteUrl}/${locale}${route.path === "/" ? "" : route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [
            loc,
            `${siteUrl}/${loc}${route.path === "/" ? "" : route.path}`,
          ])
        ),
      },
    }))
  );
}
