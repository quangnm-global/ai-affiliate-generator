import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sanitizeRedirectPath } from "@/lib/auth/routes";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { locale } = await params;
  const routeParams = await searchParams;
  const t = await getTranslations("auth");
  const errors = await getTranslations("errors");

  const redirectTo = sanitizeRedirectPath(routeParams.redirect, locale);

  const authErrors: Record<string, string> = {
    auth: errors("generic"),
    session_expired: errors("unauthorized"),
  };
  const errorMessage = routeParams.error
    ? authErrors[routeParams.error] ?? errors("generic")
    : null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("signInTitle")}</CardTitle>
        <CardDescription>{t("signInDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        <LoginForm redirectTo={redirectTo} />
      </CardContent>
    </Card>
  );
}
