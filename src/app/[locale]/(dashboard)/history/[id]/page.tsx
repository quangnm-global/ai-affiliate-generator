import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { GenerationPreview } from "@/components/generate/generation-preview";
import { GenerationMeta } from "@/components/history/generation-meta";
import {
  PageContainer,
  PageHeader,
} from "@/components/layout/page-container";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/get-user";
import { getGenerationById } from "@/lib/generations/queries";
import { CONTENT_TYPE_KEYS } from "@/lib/i18n/labels";

export const dynamic = "force-dynamic";

interface HistoryDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function HistoryDetailPage({
  params,
}: HistoryDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("history");
  const tTypes = await getTranslations("contentTypes");
  const common = await getTranslations("common");
  const user = await requireUser();
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
          {common("back")} {t("title").toLowerCase()}
        </Button>
      </div>

      <PageHeader
        title={generation.title}
        description={`${generation.product_name} · ${tTypes(CONTENT_TYPE_KEYS[generation.content_type])}`}
      />

      <div className="space-y-6">
        <GenerationMeta generation={generation} />

        <section className="space-y-3">
          <h2 className="text-sm font-medium">{t("detailTitle")}</h2>
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
