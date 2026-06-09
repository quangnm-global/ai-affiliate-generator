"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  items: NavItem[];
  pathname: string;
}

export function SidebarNav({ items, pathname }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/dashboard" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className="size-4 shrink-0 opacity-70" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
