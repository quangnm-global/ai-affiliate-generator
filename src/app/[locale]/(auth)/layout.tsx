import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const auth = await getTranslations({ locale, namespace: "auth" });

  return createMetadata({
    locale,
    title: auth("signInTitle"),
    description: t("signInDescription"),
    path: "/login",
    noIndex: true,
  });
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      {children}
    </div>
  );
}
