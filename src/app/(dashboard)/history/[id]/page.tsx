import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GenerationPreview } from "@/components/generate/generation-preview";
import { GenerationMeta } from "@/components/history/generation-meta";
import {
  PageContainer,
  PageHeader,
} from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { getGenerationById } from "@/lib/generations/queries";
import { requireUser } from "@/lib/auth/get-user";
import { CONTENT_TYPE_LABELS } from "@/types/generation";

export const dynamic = "force-dynamic";

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({
  params,
}: HistoryDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const generation = await getGenerationById(user.id, id);

  if (!generation) notFound();

  return (
    <PageContainer size="wide">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          render={<Link href="/history" />}
        >
          <ArrowLeft className="size-4" />
          Back to history
        </Button>
      </div>

      <PageHeader
        title={generation.title}
        description={`${generation.product_name} · ${CONTENT_TYPE_LABELS[generation.content_type]}`}
      />

      <div className="space-y-6">
        <GenerationMeta generation={generation} />

        <section className="space-y-3">
          <h2 className="text-sm font-medium">Generated content</h2>
          <GenerationPreview
            title={generation.title}
            output={generation.output}
            status={generation.status}
            errorMessage={generation.error_message}
          />
        </section>
      </div>
    </PageContainer>
  );
}
