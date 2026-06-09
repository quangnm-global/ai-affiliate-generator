"use client";

import { Coins, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { canGenerate } from "@/lib/credits/check";
import { GENERATION_CREDIT_COST } from "@/lib/credits/constants";

interface NoCreditsBannerProps {
  credits: number;
}

export function NoCreditsBanner({ credits }: NoCreditsBannerProps) {
  const t = useTranslations("credits");

  if (canGenerate(credits)) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <div className="flex items-start gap-3">
        <Coins className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <p className="font-medium text-amber-800 dark:text-amber-300">
            {t("outOfCredits")}
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {t("needCredits", {
              cost: GENERATION_CREDIT_COST,
              credits,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

interface GenerateButtonProps {
  credits: number;
  loading: boolean;
}

export function GenerateButton({ credits, loading }: GenerateButtonProps) {
  const t = useTranslations("generate");
  const errors = useTranslations("errors");
  const disabled = loading || !canGenerate(credits);

  return (
    <Button type="submit" disabled={disabled} size="lg" className="gap-2">
      <Sparkles className="size-4" />
      {loading
        ? t("generating")
        : !canGenerate(credits)
          ? errors("noCreditsLeft")
          : t("generateButton", { cost: GENERATION_CREDIT_COST })}
    </Button>
  );
}

interface CreditInfoProps {
  credits: number;
}

export function CreditInfo({ credits }: CreditInfoProps) {
  const t = useTranslations("generate");

  return (
    <p className="text-xs text-muted-foreground">
      {t("creditsRemaining", {
        count: credits,
        cost: GENERATION_CREDIT_COST,
      })}
    </p>
  );
}
