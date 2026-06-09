import Link from "next/link";
import { ArrowRight, Coins, FileText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  name: string;
  credits: number;
}

export function WelcomeBanner({ name, credits }: WelcomeBannerProps) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
      <h2 className="text-xl font-semibold sm:text-2xl">
        Hello, {name}
      </h2>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
        You have{" "}
        <span className="font-medium text-foreground">{credits} credits</span>{" "}
        remaining. Start a new generation or review your past content.
      </p>
      <Button className="mt-5 gap-2" render={<Link href="/generate" />}>
        New Generation
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

export function StatsGrid({
  credits,
  totalGenerations,
  completedGenerations,
}: StatsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatItem
        label="Credits left"
        value={credits}
        icon={<Coins className="size-5 text-muted-foreground" />}
      />
      <StatItem
        label="Total generations"
        value={totalGenerations}
        icon={<FileText className="size-5 text-muted-foreground" />}
      />
      <StatItem
        label="Completed"
        value={completedGenerations}
        icon={<Sparkles className="size-5 text-muted-foreground" />}
      />
    </div>
  );
}
