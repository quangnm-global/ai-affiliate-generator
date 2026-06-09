import { getTranslations, setRequestLocale } from "next-intl/server";

import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsGrid, WelcomeBanner } from "@/components/dashboard/welcome-banner";
import {
  PageContainer,
  PageHeader,
} from "@/components/layout/page-container";
import { createMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import type { Generation } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return createMetadata({
    locale,
    title: t("dashboardTitle"),
    noIndex: true,
  });
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: generations }] = await Promise.all([
    supabase
      .from("profiles")
      .select("credits, full_name, email")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const all = (generations ?? []) as Generation[];
  const completed = all.filter((g) => g.status === "completed").length;
  const displayName =
    (profile?.full_name as string | null) ??
    profile?.email?.split("@")[0] ??
    "there";

  const { count: totalCount } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  return (
    <PageContainer size="wide">
      <PageHeader title={t("title")} description={t("description")} />
      <div className="space-y-8">
        <WelcomeBanner
          name={displayName}
          credits={(profile?.credits as number) ?? 0}
        />
        <StatsGrid
          credits={(profile?.credits as number) ?? 0}
          totalGenerations={totalCount ?? all.length}
          completedGenerations={completed}
        />
        <RecentActivity generations={all} />
      </div>
    </PageContainer>
  );
}
