import { getTranslations } from "next-intl/server";
import { ArrowRight, Coins, FileText, Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  name: string;
  credits: number;
}

export async function WelcomeBanner({ name, credits }: WelcomeBannerProps) {
  const t = await getTranslations("dashboard");
  const nav = await getTranslations("nav");

  return (
    <div className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
      <h2 className="text-xl font-semibold sm:text-2xl">
        {t("hello", { name })}
      </h2>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
        {t("creditsRemaining", { credits })}
      </p>
      <Button className="mt-5 gap-2" render={<Link href="/generate" />}>
        {nav("newGeneration")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface StatsGridProps {
  credits: number;
  totalGenerations: number;
  completedGenerations: number;
}

export async function StatsGrid({
  credits,
  totalGenerations,
  completedGenerations,
}: StatsGridProps) {
  const t = await getTranslations("dashboard");

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatItem
        label={t("creditsLeft")}
        value={credits}
        icon={<Coins className="size-5 text-muted-foreground" />}
      />
      <StatItem
        label={t("totalGenerations")}
        value={totalGenerations}
        icon={<FileText className="size-5 text-muted-foreground" />}
      />
      <StatItem
        label={t("completed")}
        value={completedGenerations}
        icon={<Sparkles className="size-5 text-muted-foreground" />}
      />
    </div>
  );
}
