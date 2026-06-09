import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/seo/json-ld";
import { getLandingStructuredData } from "@/lib/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingSection } from "@/components/landing/pricing-section";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return createMetadata({
    locale,
    path: "/",
    description: t("description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const structuredData = await getLandingStructuredData(locale);

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="flex min-h-screen flex-col">
        <LandingNav isLoggedIn={isLoggedIn} />
        <main>
          <HeroSection isLoggedIn={isLoggedIn} />
          <FeaturesSection />
          <HowItWorksSection />
          <PricingSection isLoggedIn={isLoggedIn} />
          <FaqSection />
          <CtaSection isLoggedIn={isLoggedIn} />
        </main>
        <LandingFooter />
      </div>
    </>
  );
}
