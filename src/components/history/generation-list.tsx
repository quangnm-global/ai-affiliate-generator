import { getTranslations } from "next-intl/server";

import { GenerationListItem } from "@/components/history/generation-list-item";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { Generation } from "@/types/database";

interface GenerationListProps {
  generations: Generation[];
  query?: string;
}

export async function GenerationList({ generations, query }: GenerationListProps) {
  const t = await getTranslations("history");
  const dashboard = await getTranslations("dashboard");

  if (generations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        {query ? (
          <>
            <p className="text-sm text-muted-foreground">
              {t("noResultsQuery", { query })}
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              render={<Link href="/history" />}
            >
              {t("clearSearch")}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {t("noHistoryYet")}
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              render={<Link href="/generate" />}
            >
              {dashboard("createFirstLink")}
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y overflow-hidden rounded-2xl border">
      {generations.map((gen) => (
        <GenerationListItem key={gen.id} generation={gen} />
      ))}
    </div>
  );
}
