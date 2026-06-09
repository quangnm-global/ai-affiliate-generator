import type { Metadata } from "next";

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

export const metadata: Metadata = createMetadata({
  path: "/",
});

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <>
      <JsonLd data={getLandingStructuredData()} />
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
