import { Calendar, Coins, Hash, Sparkles, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CONTENT_TYPE_LABELS } from "@/types/generation";
import type { Generation } from "@/types/database";
import { cn } from "@/lib/utils";

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

export function GenerationMeta({ generation }: GenerationMetaProps) {
  const created = new Date(generation.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const completed = generation.completed_at
    ? new Date(generation.completed_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Generation details</h2>
        <Badge
          variant="secondary"
          className={cn("capitalize", statusStyles[generation.status])}
        >
          {generation.status}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetaItem icon={Tag} label="Product" value={generation.product_name} />
        <MetaItem
          icon={Sparkles}
          label="Content type"
          value={CONTENT_TYPE_LABELS[generation.content_type]}
        />
        <MetaItem
          icon={Coins}
          label="Credits used"
          value={`${generation.credits_cost} credit${generation.credits_cost !== 1 ? "s" : ""}`}
        />
        <MetaItem icon={Calendar} label="Created" value={created} />
        <MetaItem icon={Calendar} label="Completed" value={completed} />
        {generation.tokens_used != null && (
          <MetaItem
            icon={Hash}
            label="Tokens used"
            value={generation.tokens_used.toLocaleString()}
          />
        )}
      </div>

      {generation.keywords && generation.keywords.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="mb-2 text-xs text-muted-foreground">Keywords</p>
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
          <p className="text-xs text-muted-foreground">Affiliate URL</p>
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
