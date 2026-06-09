import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HISTORY_PAGE_SIZE } from "@/lib/generations/constants";
import { buildHistoryUrl } from "@/lib/validations/history";

interface HistoryPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  query?: string;
}

export async function HistoryPagination({
  page,
  totalPages,
  total,
  query,
}: HistoryPaginationProps) {
  const t = await getTranslations("history");

  if (total === 0) return null;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const from = (page - 1) * HISTORY_PAGE_SIZE + 1;
  const to = Math.min(page * HISTORY_PAGE_SIZE, total);

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        {from}–{to} / {total}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevPage}
            render={
              prevPage ? (
                <Link href={buildHistoryUrl({ page: prevPage, q: query })} />
              ) : undefined
            }
          >
            <ChevronLeft className="size-4" />
            {t("previous")}
          </Button>

          <span className="px-2 text-sm text-muted-foreground">
            {t("page", { page, total: totalPages })}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!nextPage}
            render={
              nextPage ? (
                <Link href={buildHistoryUrl({ page: nextPage, q: query })} />
              ) : undefined
            }
          >
            {t("next")}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
