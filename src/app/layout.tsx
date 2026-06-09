import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { VercelMonitoring } from "@/components/monitoring/vercel-monitoring";
import { JsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/json-ld";
import { rootMetadata } from "@/lib/seo/metadata";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={[getOrganizationJsonLd(), getWebSiteJsonLd()]} />
        {children}
        <Toaster />
        <VercelMonitoring />
      </body>
    </html>
  );
}
