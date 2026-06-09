import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("notFoundTitle")}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {t("notFoundDescription")}
        </p>
      </div>
      <Button render={<Link href="/" />}>{t("backToHome")}</Button>
    </div>
  );
}
