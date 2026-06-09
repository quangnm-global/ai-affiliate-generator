import { getTranslations, setRequestLocale } from "next-intl/server";

import { GenerationForm } from "@/components/generate/generation-form";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { createClient } from "@/lib/supabase/server";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("generate");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user!.id)
    .single();

  return (
    <PageContainer>
      <PageHeader
        title={t("title")}
        description={t("descriptionWithCredit")}
      />
      <GenerationForm initialCredits={(profile?.credits as number) ?? 0} />
    </PageContainer>
  );
}
