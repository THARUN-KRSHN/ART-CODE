"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProfile, Team, ProjectSubmission, NotificationItem } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import {
  Users,
  Clock,
  FileCode,
  Bell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  User,
  LayoutDashboard,
  FolderKanban,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (!sessionData.user) {
          router.push("/login");
          return;
        }
        setUser(sessionData.user);

        // Fetch team & submission
        if (sessionData.user.teamId) {
          const teamRes = await fetch("/api/teams");
          const teamData = await teamRes.json();
          setTeam(teamData.team);

          const subRes = await fetch("/api/submissions");
          const subData = await subRes.json();
          setSubmission(subData.submission);
        }

        // Fetch notifications
        const notifRes = await fetch("/api/notifications");
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-darkRed">Loading participant dashboard...</p>
        </div>
      </div>
    );
  }

  const isLeader = team && user && team.leaderId === user.id;

  const sidebarLinks = [
    { label: "Overview", href: "/dashboard", active: true, icon: LayoutDashboard },
    { label: "My Team", href: "/team/workspace", icon: Users },
    { label: "Challenges", href: "/challenges", icon: FolderKanban },
    { label: "Submission", href: "/submission", icon: FileCode },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/onboarding", icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout with Left Sidebar as shown in Panel 11 of the Design Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Panel 11 Style) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-darkRed px-3 py-1 flex items-center gap-1.5">
                <RhombusMotif size={12} color="#A32516" />
                <span>Navigation</span>
              </div>
              <nav className="flex flex-col space-y-1">
                {sidebarLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        item.active
                          ? "bg-accentGold text-darkRed shadow-subtle font-extrabold border border-mutedGold"
                          : "text-ink-secondary hover:bg-cream hover:text-darkRed"
                      }`}
                    >
                      <Icon size={15} className={item.active ? "text-vermilion" : "text-darkRed"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Team Code Card if user has team */}
            {team && (
              <div className="p-4 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-darkRed">
                  Team Invitation Code
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-paleCream border border-mutedGold">
                  <span className="text-base font-mono font-bold text-darkRed">{team.invitationCode}</span>
                  <button
                    onClick={() => copyCode(team.invitationCode)}
                    className="p-1 rounded text-darkRed hover:text-vermilion"
                    title="Copy code"
                  >
                    {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Main Dashboard Area (Panel 11 Style) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Welcome Header */}
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-vermilion text-cream flex items-center justify-center font-bold text-xs">
                    {user?.name.charAt(0)}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-darkRed">
                    Hello, {user?.name}!
                  </h1>
                </div>
                <p className="text-xs text-ink-secondary">
                  {user?.institution} • Role:{" "}
                  <span className="capitalize font-bold text-vermilion">{user?.role}</span>
                </p>
              </div>

              <div>
                {team ? (
                  <div className="p-3 rounded-xl bg-cream border border-mutedGold flex items-center gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-darkRed font-bold">Team:</div>
                      <div className="text-sm font-bold text-ink">{team.name}</div>
                      <div className="text-[10px] text-ink-muted">{team.members.length}/2 active members</div>
                    </div>
                    <StatusBadge status={team.status} />
                  </div>
                ) : (
                  <Link
                    href="/team"
                    className="px-4 py-2 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors shadow-subtle inline-block"
                  >
                    Form a Team
                  </Link>
                )}
              </div>
            </div>

            {/* 2 Main Status Cards (Panel 11 Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Submission Status Card */}
              <div className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-darkRed font-bold flex items-center gap-1.5">
                      <FileCode size={14} className="text-vermilion" />
                      <span>Submission Status</span>
                    </span>
                    <StatusBadge
                      status={submission?.isLocked ? "submitted" : submission ? "draft" : "incomplete"}
                      label={submission?.isLocked ? "Locked" : submission ? "Draft Saved" : "In Progress"}
                    />
                  </div>
                  <div className="text-lg font-bold text-ink pt-2">
                    {submission?.isLocked
                      ? "Officially Submitted"
                      : submission
                      ? submission.projectTitle
                      : team?.status === "complete"
                      ? "Ready to Draft"
                      : "Awaiting 2nd Teammate"}
                  </div>
                  <p className="text-xs text-ink-secondary">
                    {submission?.referenceId
                      ? `Ref: ${submission.referenceId}`
                      : "Submission portal opens 30 October 2026"}
                  </p>
                </div>

                <div className="pt-3 border-t border-mutedGold/60">
                  <Link
                    href="/submission"
                    className="text-xs font-bold uppercase font-mono text-vermilion hover:text-darkRed inline-flex items-center gap-1"
                  >
                    <span>{submission?.isLocked ? "View Confirmation" : "Open Submission Portal"}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Next Deadline Card */}
              <div className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-darkRed font-bold flex items-center gap-1.5">
                      <Clock size={14} className="text-accentGold" />
                      <span>Next Deadline</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accentGold text-darkRed">
                      11:59 PM IST
                    </span>
                  </div>
                  <div className="text-xl font-bold text-vermilion pt-2">8 Nov 2026</div>
                  <p className="text-xs text-ink-secondary">
                    Submission Gateway Hard Stop. All participant editing locks permanently.
                  </p>
                </div>

                <div className="pt-3 border-t border-mutedGold/60 text-xs font-mono text-darkRed font-bold">
                  Time Remaining: ~10 Days
                </div>
              </div>
            </div>

            {/* Contextual Banner: Incomplete Team */}
            {team && team.status === "incomplete" && (
              <div className="p-6 rounded-card border-2 border-accentGold bg-paleCream shadow-subtle space-y-3">
                <div className="flex items-center gap-2 text-vermilion font-bold text-sm">
                  <AlertTriangle size={18} />
                  <span>One more member needed!</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Your team <strong>{team.name}</strong> currently has 1 member. According to ART//CODE 2026 regulations, the project submission gateway remains locked until your partner joins.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-mono font-bold bg-cream px-3 py-1.5 rounded-lg border border-mutedGold">
                    Code: {team.invitationCode}
                  </span>
                  <button
                    onClick={() => copyCode(team.invitationCode)}
                    className="px-3.5 py-1.5 rounded-lg bg-vermilion text-cream text-xs font-bold uppercase font-mono shadow-subtle"
                  >
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
            )}

            {/* Recent Announcements (Panel 11 Style) */}
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-mutedGold pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-darkRed font-mono flex items-center gap-2">
                  <RhombusMotif size={12} color="#A32516" />
                  <span>Recent Announcements</span>
                </h3>
                <Link href="/notifications" className="text-xs font-bold uppercase font-mono text-vermilion hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="p-3.5 rounded-xl bg-cream border border-mutedGold space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-darkRed">{notif.title}</span>
                      <span className="text-[10px] font-mono text-ink-muted">
                        {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
