import { AccountInfo, SettingsSection } from "@/components/settings/settings-section";
import { ProfileForm } from "@/components/settings/profile-form";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, email, full_name, created_at")
    .eq("id", user!.id)
    .single();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at as string).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />
      <div className="space-y-6">
        <SettingsSection
          title="Profile"
          description="Update your personal information"
        >
          <ProfileForm
            fullName={(profile?.full_name as string | null) ?? null}
            email={(profile?.email as string) ?? user!.email ?? ""}
          />
        </SettingsSection>

        <SettingsSection
          title="Account"
          description="Your account details and usage"
        >
          <AccountInfo
            email={(profile?.email as string) ?? user!.email ?? ""}
            credits={(profile?.credits as number) ?? 0}
            memberSince={memberSince}
          />
        </SettingsSection>
      </div>
    </PageContainer>
  );
}
