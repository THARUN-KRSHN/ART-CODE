"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProfile, Team, ProjectSubmission, NotificationItem } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Clock,
  FileCode,
  Bell,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
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
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading participant dashboard...</p>
        </div>
      </div>
    );
  }

  const isLeader = team && user && team.leaderId === user.id;

  return (
    <div className="min-h-screen bg-ivory py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Welcome Panel */}
        <div className="p-8 rounded-card border border-border bg-white shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta font-semibold">
                Participant Portal // {user?.institution}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary">
              {team ? (
                <>
                  Active in <strong className="text-ink">{team.name}</strong> • Role:{" "}
                  <span className="capitalize font-medium text-ink">{isLeader ? "Team Leader" : "Teammate"}</span>
                </>
              ) : (
                "You haven't formed or joined a team yet."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {team ? (
              <StatusBadge status={team.status} />
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-ivory-200 text-ink border border-border">
                No Team Assigned
              </span>
            )}
            {submission && (
              <StatusBadge
                status={submission.isLocked ? "submitted" : "draft"}
                label={submission.isLocked ? "Submission Locked" : "Draft in Progress"}
              />
            )}
          </div>
        </div>

        {/* 4 Overview Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Team Status */}
          <div className="p-6 rounded-card border border-border bg-white shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-ink-muted">Team Status</span>
                <Users size={18} className="text-indigo" />
              </div>
              <div className="text-lg font-bold text-ink">
                {team ? team.name : "Unassigned"}
              </div>
              <p className="text-xs text-ink-secondary mt-1">
                {team
                  ? `${team.members.length} of 2 registered members`
                  : "Create or join a team to submit."}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/60">
              {team ? (
                <Link
                  href="/team/workspace"
                  className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Team Workspace</span>
                  <ArrowRight size={12} />
                </Link>
              ) : (
                <Link
                  href="/team"
                  className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Form Team Now</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </div>

          {/* Card 2: Next Deadline */}
          <div className="p-6 rounded-card border border-border bg-white shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-ink-muted">Key Deadline</span>
                <Clock size={18} className="text-terracotta" />
              </div>
              <div className="text-lg font-bold text-ink">08 Nov 2026</div>
              <p className="text-xs text-ink-secondary mt-1">
                11:59 PM IST (Submission Gateway Closes)
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/60">
              <span className="text-xs font-medium text-ink-muted">Indian Standard Time</span>
            </div>
          </div>

          {/* Card 3: Submission Status */}
          <div className="p-6 rounded-card border border-border bg-white shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-ink-muted">Submission</span>
                <FileCode size={18} className="text-saffron-600" />
              </div>
              <div className="text-lg font-bold text-ink">
                {submission
                  ? submission.isLocked
                    ? "Locked & Finalized"
                    : "Draft in Progress"
                  : team && team.status === "complete"
                  ? "Ready to Start"
                  : "Requires 2 Members"}
              </div>
              <p className="text-xs text-ink-secondary mt-1 line-clamp-1">
                {submission?.referenceId || "Awaiting final submission"}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/60">
              <Link
                href="/submission"
                className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
              >
                <span>{submission?.isLocked ? "View Confirmation" : "Open Portal"}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 4: Unread Notifications */}
          <div className="p-6 rounded-card border border-border bg-white shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-ink-muted">Announcements</span>
                <Bell size={18} className="text-sage-600" />
              </div>
              <div className="text-lg font-bold text-ink">
                {notifications.length} Published
              </div>
              <p className="text-xs text-ink-secondary mt-1">
                From the DELTA Organizing Committee
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/60">
              <Link
                href="/notifications"
                className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
              >
                <span>View All Notices</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Split: Left (Team & Submission Focus), Right (Quick Actions & Notices) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* If no team, big call to action banner */}
            {!team && (
              <div className="p-8 rounded-card border-2 border-dashed border-terracotta/60 bg-white shadow-subtle space-y-4">
                <div className="flex items-center gap-2 text-terracotta font-bold text-sm font-mono uppercase">
                  <Sparkles size={16} />
                  <span>Immediate Action Required</span>
                </div>
                <h3 className="text-xl font-bold text-ink">
                  You are not yet part of an active team.
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Project submission is strictly limited to two-member teams. Create a team and share your invitation code with a fellow student, or join an existing team.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/team"
                    className="px-5 py-2.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors inline-flex items-center gap-2"
                  >
                    <span>Create or Join Team</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* If incomplete team (1 member) */}
            {team && team.status === "incomplete" && (
              <div className="p-6 sm:p-8 rounded-card border border-saffron-300 bg-saffron-50/50 shadow-subtle space-y-4">
                <div className="flex items-center gap-2 text-saffron-700 font-bold text-sm">
                  <AlertTriangle size={18} />
                  <span>One more member needed!</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Your team <strong>{team.name}</strong> currently has 1 member. According to ART//CODE 2026 regulations, the project submission gateway remains locked until your partner joins.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-muted">
                      Your Invitation Code:
                    </span>
                    <div className="text-base font-mono font-bold text-ink mt-0.5">
                      {team.invitationCode}
                    </div>
                  </div>
                  <button
                    onClick={() => copyCode(team.invitationCode)}
                    className="px-4 py-2 rounded-lg bg-ivory-100 hover:bg-ivory-200 border border-border text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
                    <span>{copied ? "Code Copied!" : "Copy Invitation Code"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submission Gateway Preview */}
            {team && (
              <div className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-6">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <h3 className="text-base font-bold text-ink">Project Submission Gateway</h3>
                  <span className="text-xs font-mono text-ink-muted">
                    {submission?.isLocked ? "Locked" : "Editable"}
                  </span>
                </div>

                {submission ? (
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl border border-border bg-ivory-50/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-terracotta">
                          {submission.referenceId || "Draft"}
                        </span>
                        <StatusBadge
                          status={submission.isLocked ? "submitted" : "draft"}
                          label={submission.isLocked ? "Officially Submitted" : "Saved Draft"}
                        />
                      </div>
                      <h4 className="text-lg font-bold text-ink">{submission.projectTitle}</h4>
                      <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                        {submission.shortDescription}
                      </p>
                      <div className="text-[11px] font-mono text-ink-muted pt-1">
                        Track: {submission.challengeTitle}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {submission.isLocked ? (
                        <Link
                          href="/submission/confirmation"
                          className="px-4 py-2 rounded-lg bg-sage-50 text-status-success border border-sage-200 text-xs font-semibold inline-flex items-center gap-2"
                        >
                          <ShieldCheck size={14} />
                          <span>View Official Confirmation Receipt</span>
                        </Link>
                      ) : (
                        <Link
                          href="/submission"
                          className="px-5 py-2.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors inline-flex items-center gap-2"
                        >
                          <span>{isLeader ? "Continue Editing Draft" : "View Team Submission"}</span>
                          <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
                      {team.status === "complete"
                        ? "Both member slots are filled! You can now draft your project details, architecture, and links."
                        : "Submission portal unlocks as soon as your second teammate joins."}
                    </p>
                    {team.status === "complete" && (
                      <Link
                        href="/submission"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors shadow-subtle"
                      >
                        <span>Start Project Draft</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold">
                Quick Shortcuts
              </span>
              <div className="space-y-1.5 pt-1">
                <Link
                  href="/challenges"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-ink hover:bg-ivory-100 transition-colors"
                >
                  <span>Explore Problem Statements</span>
                  <ArrowRight size={13} className="text-ink-muted" />
                </Link>

                <Link
                  href="/guidelines"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-ink hover:bg-ivory-100 transition-colors"
                >
                  <span>Rules & Rubrics</span>
                  <ArrowRight size={13} className="text-ink-muted" />
                </Link>

                <Link
                  href="/onboarding"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-ink hover:bg-ivory-100 transition-colors"
                >
                  <span>Edit Participant Profile</span>
                  <ArrowRight size={13} className="text-ink-muted" />
                </Link>
              </div>
            </div>

            {/* Recent Notifications Widget */}
            <div className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-ink font-bold">
                  Recent Bulletins
                </span>
                <Link href="/notifications" className="text-[11px] text-terracotta hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="p-3 rounded-lg bg-ivory-50 border border-border/70 space-y-1">
                    <div className="text-xs font-bold text-ink">{notif.title}</div>
                    <p className="text-[11px] text-ink-secondary line-clamp-2 leading-relaxed">
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

