import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GenerationList } from "@/components/history/generation-list";
import { HistoryPagination } from "@/components/history/history-pagination";
import { HistorySearchForm } from "@/components/history/history-search-form";
import {
  PageContainer,
  PageHeader,
} from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "@/i18n/navigation";
import { requireUser } from "@/lib/auth/get-user";
import { getPaginatedGenerations } from "@/lib/generations/queries";
import { buildHistoryUrl } from "@/lib/validations/history";
import { historySearchParamsSchema } from "@/lib/validations/history";

export const dynamic = "force-dynamic";

interface HistoryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function HistoryPage({
  params,
  searchParams,
}: HistoryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("history");
  const user = await requireUser();
  const rawParams = await searchParams;
  const parsed = historySearchParamsSchema.safeParse(rawParams);

  const pageParams = parsed.success
    ? parsed.data
    : { page: 1, q: undefined };

  const result = await getPaginatedGenerations(user.id, pageParams);

  if (
    pageParams.page > 1 &&
    result.totalPages > 0 &&
    pageParams.page > result.totalPages
  ) {
    redirect({
      href: buildHistoryUrl({
        q: pageParams.q,
        page: result.totalPages,
      }),
      locale,
    });
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        title={t("title")}
        description={
          result.total > 0
            ? t("descriptionCount", { count: result.total })
            : t("descriptionEmpty")
        }
      />

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <HistorySearchForm defaultQuery={pageParams.q} />
        </Suspense>

        <GenerationList generations={result.data} query={pageParams.q} />

        <HistoryPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          query={pageParams.q}
        />
      </div>
    </PageContainer>
  );
}
