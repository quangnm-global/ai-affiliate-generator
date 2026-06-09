import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/auth/routes";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(loginRedirect?: string) {
  const user = await getUser();

  if (!user) {
    const safePath = sanitizeRedirectPath(loginRedirect);
    redirect(`/login?redirect=${encodeURIComponent(safePath)}`);
  }

  return user;
}
