"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarRecent } from "@/components/layout/sidebar-recent";
import { UserMenu } from "@/components/layout/user-menu";
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

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "New Generation", icon: Sparkles },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ user, recentGenerations, signOutAction }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <Link href="/dashboard" className="font-semibold tracking-tight">
          Affiliate AI
        </Link>
      </div>

      <div className="px-3 pb-2">
        <Button
          className="w-full justify-start gap-2 shadow-none"
          variant="outline"
          render={<Link href="/generate" />}
        >
          <Plus className="size-4" />
          New Generation
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
