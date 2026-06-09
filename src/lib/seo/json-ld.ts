import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo/site";

export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    description: SITE_DESCRIPTION,
    sameAs: [],
  };
}

export function getWebSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function getSoftwareApplicationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with 5 credits on signup",
    },
    featureList: [
      "AI content generation",
      "TikTok Shop scripts",
      "Product reviews",
      "Sales captions",
      "Generation history",
      "Credit-based pricing",
    ],
  };
}

export function getLandingPageJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
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

export const LANDING_FAQS = [
  {
    question: "What is Affiliate AI?",
    answer:
      "Affiliate AI is an AI-powered content generator built for affiliate marketers. It creates TikTok scripts, product reviews, sales captions, and hashtags optimized for TikTok Shop and Vietnamese audiences.",
  },
  {
    question: "How do credits work?",
    answer:
      "Each content generation costs 1 credit. New users receive 5 free credits on signup. When your credits run out, you can upgrade to a paid plan.",
  },
  {
    question: "What content types can I generate?",
    answer:
      "You can generate TikTok Shop scripts, product reviews, comparison articles, buying guides, and social media posts.",
  },
  {
    question: "Is the content in Vietnamese?",
    answer:
      "Yes. TikTok content is optimized for Vietnamese audiences with natural, conversational language.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. Sign up for free and get 5 credits instantly. No credit card required.",
  },
] as const;

export function getLandingStructuredData() {
  return [
    getSoftwareApplicationJsonLd(),
    getLandingPageJsonLd(),
    getFaqJsonLd(LANDING_FAQS),
  ];
}
