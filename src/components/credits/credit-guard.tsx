"use client";

import { Coins, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { canGenerate } from "@/lib/credits/check";
import { GENERATION_CREDIT_COST } from "@/lib/credits/constants";

interface NoCreditsBannerProps {
  credits: number;
}

export function NoCreditsBanner({ credits }: NoCreditsBannerProps) {
  if (canGenerate(credits)) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <div className="flex items-start gap-3">
        <Coins className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <p className="font-medium text-amber-800 dark:text-amber-300">
            Hết credits
          </p>
          <p className="mt-0.5 text-muted-foreground">
            Bạn cần ít nhất {GENERATION_CREDIT_COST} credit để tạo nội dung.
            Hiện tại: {credits} credits.
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
  const disabled = loading || !canGenerate(credits);

  return (
    <Button type="submit" disabled={disabled} size="lg" className="gap-2">
      <Sparkles className="size-4" />
      {loading
        ? "Generating..."
        : !canGenerate(credits)
          ? "No credits left"
          : `Generate · ${GENERATION_CREDIT_COST} credit`}
    </Button>
  );
}

interface CreditInfoProps {
  credits: number;
}

export function CreditInfo({ credits }: CreditInfoProps) {
  return (
    <p className="text-xs text-muted-foreground">
      {credits} credit{credits !== 1 ? "s" : ""} remaining ·{" "}
      {GENERATION_CREDIT_COST} credit per generation
    </p>
  );
}
