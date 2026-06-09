"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  title?: string;
  description?: string;
  reset?: () => void;
  showDashboardLink?: boolean;
}

export function ErrorFallback({
  title,
  description,
  reset,
  showDashboardLink = true,
}: ErrorFallbackProps) {
  const t = useTranslations("errors");
  const common = useTranslations("common");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {title ?? t("generic")}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {description ?? t("genericDescription")}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {reset ? (
          <Button onClick={reset}>{common("tryAgain")}</Button>
        ) : null}
        {showDashboardLink ? (
          <Button variant="outline" render={<Link href="/dashboard" />}>
            {common("goToDashboard")}
          </Button>
        ) : (
          <Button variant="outline" render={<Link href="/" />}>
            {common("goHome")}
          </Button>
        )}
      </div>
    </div>
  );
}
