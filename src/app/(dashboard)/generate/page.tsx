import { GenerationForm } from "@/components/generate/generation-form";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { createClient } from "@/lib/supabase/server";

export default async function GeneratePage() {
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
        title="New Generation"
        description="Create affiliate content powered by AI · 1 credit per generation"
      />
      <GenerationForm initialCredits={(profile?.credits as number) ?? 0} />
    </PageContainer>
  );
}
