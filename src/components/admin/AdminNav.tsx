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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-mutedGold/50">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accentGold/20 text-darkRed border border-accentGold/50 text-xs font-mono font-bold uppercase tracking-wider mr-2 flex-shrink-0">
        <Shield size={13} className="text-vermilion" />
        <span>Admin Console</span>
      </div>

      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              isActive
                ? "bg-vermilion text-cream shadow-sm"
                : "text-darkRed hover:bg-paleCream/80 hover:text-vermilion border border-transparent hover:border-mutedGold/40"
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
