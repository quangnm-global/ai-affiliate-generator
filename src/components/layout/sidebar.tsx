"use client";

import {
  History,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarRecent } from "@/components/layout/sidebar-recent";
import { UserMenu } from "@/components/layout/user-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Generation } from "@/types/database";

interface SidebarUser {
  email: string;
  fullName: string | null;
  credits: number;
}

interface SidebarProps {
  user: SidebarUser;
  recentGenerations: Generation[];
  signOutAction: () => Promise<void>;
}

export function Sidebar({ user, recentGenerations, signOutAction }: SidebarProps) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/generate", label: t("newGeneration"), icon: Sparkles },
    { href: "/history", label: t("history"), icon: History },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          {common("appName")}
        </Link>
        <LocaleSwitcher />
      </div>

      <div className="px-3 pb-2">
        <Button
          className="w-full justify-start gap-2 shadow-none"
          variant="outline"
          render={<Link href="/generate" />}
        >
          <Plus className="size-4" />
          {t("newGeneration")}
        </Button>
      </div>

      <SidebarNav items={navItems} pathname={pathname} />

      <Separator className="mx-3" />

      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarRecent generations={recentGenerations} />
      </ScrollArea>

      <div className="mt-auto border-t p-3">
        <UserMenu user={user} signOutAction={signOutAction} />
      </div>
    </div>
  );
}
