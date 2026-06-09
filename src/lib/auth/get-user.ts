import type { User } from "@supabase/supabase-js";
import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { sanitizeRedirectPath } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(loginRedirect?: string): Promise<User> {
  const user = await getUser();

  if (!user) {
    const locale = await getLocale();
    const safePath = sanitizeRedirectPath(loginRedirect, locale);
    redirect({
      href: `/login?redirect=${encodeURIComponent(safePath)}`,
      locale,
    });
    throw new Error("Redirecting to login");
  }

  return user;
}
