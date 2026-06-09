import type { Metadata } from "next";

import { signOut } from "@/actions/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/get-user";
import { createMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import type { Generation } from "@/types/database";

export const metadata: Metadata = createMetadata({
  title: "Dashboard",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile }, { data: recentGenerations }] = await Promise.all([
    supabase
      .from("profiles")
      .select("credits, email, full_name")
      .eq("id", user.id)
      .single(),
    supabase
      .from("generations")
      .select("id, title, content_type, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const sidebarUser = {
    email: profile?.email ?? user.email ?? "",
    fullName: (profile?.full_name as string | null) ?? null,
    credits: (profile?.credits as number | undefined) ?? 0,
  };

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          user={sidebarUser}
          recentGenerations={(recentGenerations ?? []) as Generation[]}
          signOutAction={signOut}
        />
      }
    >
      {children}
    </DashboardShell>
  );
}
