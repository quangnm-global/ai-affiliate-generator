import { getTranslations } from "next-intl/server";

import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";

interface SeoCopy {
  description: string;
  tagline: string;
  freeOffer: string;
}

async function getSeoCopy(locale: string): Promise<SeoCopy> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const common = await getTranslations({ locale, namespace: "common" });
  return {
    description: t("description"),
    tagline: common("tagline"),
    freeOffer: t("freeOffer"),
  };
}

export async function getOrganizationJsonLd(locale: string) {
  const siteUrl = getSiteUrl();
  const { description } = await getSeoCopy(locale);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/icon`,
    description,
    sameAs: [],
  };
}

export async function getWebSiteJsonLd(locale: string) {
  const siteUrl = getSiteUrl();
  const { description } = await getSeoCopy(locale);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${siteUrl}/${locale}`,
    description,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${siteUrl}/${locale}`,
    },
  };
}

export async function getSoftwareApplicationJsonLd(locale: string) {
  const siteUrl = getSiteUrl();
  const { description, freeOffer } = await getSeoCopy(locale);
  const t = await getTranslations({ locale, namespace: "landing.features.items" });

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/${locale}`,
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: freeOffer,
    },
    featureList: [
      t("aiContent.title"),
      t("tiktok.title"),
      t("history.title"),
      t("credits.title"),
    ],
  };
}

export async function getLandingPageJsonLd(locale: string) {
  const siteUrl = getSiteUrl();
  const { description, tagline } = await getSeoCopy(locale);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} — ${tagline}`,
    url: `${siteUrl}/${locale}`,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${siteUrl}/${locale}`,
    },
    about: {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
    },
  };
}

export function getFaqJsonLd(
  faqs: ReadonlyArray<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export async function getLandingFaqs(locale: string) {
  const t = await getTranslations({ locale, namespace: "landing.faq.items" });
  return [
    { question: t("what.question"), answer: t("what.answer") },
    { question: t("credits.question"), answer: t("credits.answer") },
    { question: t("types.question"), answer: t("types.answer") },
    { question: t("vietnamese.question"), answer: t("vietnamese.answer") },
    { question: t("card.question"), answer: t("card.answer") },
  ] as const;
}

export async function getLandingStructuredData(locale: string) {
  const faqs = await getLandingFaqs(locale);
  return [
    await getSoftwareApplicationJsonLd(locale),
    await getLandingPageJsonLd(locale),
    getFaqJsonLd(faqs),
  ];
}
