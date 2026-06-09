import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";

export async function LandingFooter() {
  const t = await getTranslations("nav");
  const common = await getTranslations("common");

  return (
    <footer className="border-t px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" />
          </div>
          {common("appName")}
        </Link>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">
            {t("features")}
          </a>
          <a href="#pricing" className="hover:text-foreground">
            {t("pricing")}
          </a>
          <a href="#faq" className="hover:text-foreground">
            {t("faq")}
          </a>
          <Link href="/login" className="hover:text-foreground">
            {t("signIn")}
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {common("appName")}
        </p>
      </div>
    </footer>
  );
}
