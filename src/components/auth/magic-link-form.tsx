"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectPath } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/client";
import { magicLinkSchema } from "@/lib/validations/auth";

interface MagicLinkFormProps {
  redirectTo: string;
}

export function MagicLinkForm({ redirectTo }: MagicLinkFormProps) {
  const t = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const parsed = magicLinkSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? tErrors("invalidInput"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(sanitizeRedirectPath(redirectTo))}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
    toast.success(tErrors("magicLinkSent"));
  }

  if (sent) {
    return (
      <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm">
        <p className="font-medium">{t("checkEmailInbox")}</p>
        <p className="mt-1 text-muted-foreground">
          {t("sentTo", { email })}
        </p>
        <Button
          type="button"
          variant="link"
          className="mt-2"
          onClick={() => setSent(false)}
        >
          {t("differentEmail")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-email">{t("email")}</Label>
        <Input
          id="magic-email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <p className="text-sm text-muted-foreground">{t("magicLinkDescription")}</p>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("sending") : t("sendMagicLink")}
      </Button>
    </form>
  );
}
