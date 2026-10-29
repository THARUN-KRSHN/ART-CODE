"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileCode,
  Bell,
  Settings,
  Shield,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/participants", label: "Participants", icon: Users },
    { href: "/admin/teams", label: "Teams", icon: FolderKanban },
    { href: "/admin/submissions", label: "Submissions", icon: FileCode },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/80">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-terracotta-50 text-terracotta text-xs font-mono font-bold uppercase tracking-wider mr-2">
        <Shield size={13} />
        <span>Admin Mode</span>
      </div>

      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              isActive
                ? "bg-ink text-white font-semibold shadow-subtle"
                : "text-ink-secondary hover:bg-ivory-200 hover:text-ink"
            }`}
          >
            <Icon size={14} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

