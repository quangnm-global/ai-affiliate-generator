import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { VercelMonitoring } from "@/components/monitoring/vercel-monitoring";
import { JsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return createMetadata({
    locale,
    description: t("description"),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const jsonLdData = await Promise.all([
    getOrganizationJsonLd(locale),
    getWebSiteJsonLd(locale),
  ]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={jsonLdData} />
          {children}
          <Toaster />
          <VercelMonitoring />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
