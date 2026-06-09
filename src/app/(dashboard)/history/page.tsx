import { Suspense } from "react";
import { redirect } from "next/navigation";

import { GenerationList } from "@/components/history/generation-list";
import { HistoryPagination } from "@/components/history/history-pagination";
import { HistorySearchForm } from "@/components/history/history-search-form";
import {
  PageContainer,
  PageHeader,
} from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaginatedGenerations } from "@/lib/generations/queries";
import { requireUser } from "@/lib/auth/get-user";
import { historySearchParamsSchema } from "@/lib/validations/history";

export const dynamic = "force-dynamic";

interface HistoryPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await requireUser();
  const rawParams = await searchParams;
  const parsed = historySearchParamsSchema.safeParse(rawParams);

  const params = parsed.success
    ? parsed.data
    : { page: 1, q: undefined };

  const result = await getPaginatedGenerations(user.id, params);

  if (params.page > 1 && result.totalPages > 0 && params.page > result.totalPages) {
    redirect(
      params.q
        ? `/history?q=${encodeURIComponent(params.q)}&page=${result.totalPages}`
        : `/history?page=${result.totalPages}`
    );
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        title="History"
        description={
          result.total > 0
            ? `${result.total} generation${result.total !== 1 ? "s" : ""} total`
            : "All your past content generations"
        }
      />

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <HistorySearchForm defaultQuery={params.q} />
        </Suspense>

        <GenerationList generations={result.data} query={params.q} />

        <HistoryPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          query={params.q}
        />
      </div>
    </PageContainer>
  );
}
