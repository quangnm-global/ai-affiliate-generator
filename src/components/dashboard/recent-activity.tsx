import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";

import { GenerationListItem } from "@/components/history/generation-list-item";
import { Link } from "@/i18n/navigation";
import type { Generation } from "@/types/database";

interface RecentActivityProps {
  generations: Generation[];
}

export async function RecentActivity({ generations }: RecentActivityProps) {
  const t = await getTranslations("dashboard");

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t("recentActivity")}</h3>
        {generations.length > 0 && (
          <Link
            href="/history"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
            <ChevronRight className="size-3" />
          </Link>
        )}
      </div>

      {generations.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">{t("noContentYet")}</p>
          <Link
            href="/generate"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("createFirstLink")}
          </Link>
        </div>
      ) : (
        <div className="divide-y rounded-xl border">
          {generations.map((gen) => (
            <GenerationListItem key={gen.id} generation={gen} />
          ))}
        </div>
      )}
    </section>
  );
}
