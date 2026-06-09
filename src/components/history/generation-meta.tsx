import { getLocale, getTranslations } from "next-intl/server";
import { Calendar, Coins, Hash, Sparkles, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CONTENT_TYPE_KEYS } from "@/lib/i18n/labels";
import { cn } from "@/lib/utils";
import type { Generation } from "@/types/database";

interface GenerationMetaProps {
  generation: Generation;
}

const statusStyles: Record<Generation["status"], string> = {
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  failed: "bg-destructive/10 text-destructive",
};

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export async function GenerationMeta({ generation }: GenerationMetaProps) {
  const t = await getTranslations("history");
  const tStatus = await getTranslations("status");
  const tTypes = await getTranslations("contentTypes");
  const locale = await getLocale();
  const dateLocale = locale === "vi" ? "vi-VN" : "en-US";

  const created = new Date(generation.created_at).toLocaleString(dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const completed = generation.completed_at
    ? new Date(generation.completed_at).toLocaleString(dateLocale, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">{t("detailTitle")}</h2>
        <Badge
          variant="secondary"
          className={cn(statusStyles[generation.status])}
        >
          {tStatus(generation.status)}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetaItem icon={Tag} label={t("product")} value={generation.product_name} />
        <MetaItem
          icon={Sparkles}
          label={t("contentType")}
          value={tTypes(CONTENT_TYPE_KEYS[generation.content_type])}
        />
        <MetaItem
          icon={Coins}
          label={t("creditsUsed")}
          value={`${generation.credits_cost}`}
        />
        <MetaItem icon={Calendar} label={t("createdAt")} value={created} />
        <MetaItem icon={Calendar} label={t("completedAt")} value={completed} />
        {generation.tokens_used != null && (
          <MetaItem
            icon={Hash}
            label={t("tokensUsed")}
            value={generation.tokens_used.toLocaleString(dateLocale)}
          />
        )}
      </div>

      {generation.keywords && generation.keywords.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="mb-2 text-xs text-muted-foreground">
            {t("keywordsLabel")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {generation.keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs font-normal">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {generation.affiliate_url && (
        <div className="mt-4 border-t pt-4">
          <p className="text-xs text-muted-foreground">{t("affiliateUrlLabel")}</p>
          <a
            href={generation.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 block truncate text-sm text-primary hover:underline"
          >
            {generation.affiliate_url}
          </a>
        </div>
      )}
    </div>
  );
}
