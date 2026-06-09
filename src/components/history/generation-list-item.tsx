"use client";

import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { CONTENT_TYPE_KEYS } from "@/lib/i18n/labels";
import { cn } from "@/lib/utils";
import type { Generation } from "@/types/database";

interface GenerationListItemProps {
  generation: Generation;
  showMeta?: boolean;
}

const statusStyles: Record<Generation["status"], string> = {
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  failed: "bg-destructive/10 text-destructive",
};

export function GenerationListItem({
  generation,
  showMeta = true,
}: GenerationListItemProps) {
  const tStatus = useTranslations("status");
  const tTypes = useTranslations("contentTypes");
  const locale = useLocale();

  const date = new Date(generation.created_at).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Link
      href={`/history/${generation.id}`}
      className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium group-hover:text-primary">
          {generation.title}
        </p>
        {showMeta && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {generation.product_name} ·{" "}
            {tTypes(CONTENT_TYPE_KEYS[generation.content_type])}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Badge
          variant="secondary"
          className={cn("text-xs font-normal", statusStyles[generation.status])}
        >
          {tStatus(generation.status)}
        </Badge>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {date}
        </span>
        <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
