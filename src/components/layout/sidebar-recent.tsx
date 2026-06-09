"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Generation } from "@/types/database";

interface SidebarRecentProps {
  generations: Generation[];
}

export function SidebarRecent({ generations }: SidebarRecentProps) {
  const t = useTranslations("sidebar");
  const dashboard = useTranslations("dashboard");

  if (generations.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-muted-foreground">
        {dashboard("noGenerations")}
      </p>
    );
  }

  return (
    <div className="space-y-1">
      <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
        {t("recent")}
      </p>
      {generations.map((gen) => (
        <Link
          key={gen.id}
          href={`/history/${gen.id}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
        >
          <MessageSquare className="size-3.5 shrink-0 opacity-50" />
          <span className="truncate">{gen.title}</span>
        </Link>
      ))}
    </div>
  );
}
