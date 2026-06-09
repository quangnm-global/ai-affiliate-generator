import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface LandingNavProps {
  isLoggedIn: boolean;
}

const navKeys = ["features", "howItWorks", "pricing", "faq"] as const;
const navHrefs: Record<(typeof navKeys)[number], string> = {
  features: "#features",
  howItWorks: "#how-it-works",
  pricing: "#pricing",
  faq: "#faq",
};

export async function LandingNav({ isLoggedIn }: LandingNavProps) {
  const t = await getTranslations("nav");
  const common = await getTranslations("common");

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          {common("appName")}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navKeys.map((key) => (
            <a
              key={key}
              href={navHrefs[key]}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {isLoggedIn ? (
            <Button size="sm" render={<Link href="/dashboard" />}>
              {t("dashboard")}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                render={<Link href="/login" />}
              >
                {t("signIn")}
              </Button>
              <Button size="sm" render={<Link href="/login" />}>
                {t("getStarted")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
