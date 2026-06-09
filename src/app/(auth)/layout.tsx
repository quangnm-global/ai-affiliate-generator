import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Sign in",
  description:
    "Sign in to Affiliate AI to generate TikTok scripts, product reviews, and affiliate content.",
  path: "/login",
  noIndex: true,
});

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
