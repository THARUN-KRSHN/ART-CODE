"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Team, UserProfile } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  UserPlus,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function TeamFormationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadTeamData = async () => {
    try {
      const res = await fetch("/api/teams");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setCurrentUser(data.user);
      setCurrentTeam(data.team);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || teamName.length < 3) {
      setErrorMsg("Team name must be at least 3 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentTeam(data.team);
        setSuccessMsg(`Team "${data.team.name}" created! Share the code to invite your teammate.`);
      } else {
        setErrorMsg(data.error || "Failed to create team");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setErrorMsg("Please enter an invitation code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationCode: inviteCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentTeam(data.team);
        setSuccessMsg(`Successfully joined team "${data.team.name}"!`);
      } else {
        setErrorMsg(data.error || "Failed to join team");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-xs font-mono text-ink-muted">Loading team status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono tracking-widest text-indigo uppercase">
            Team Architecture // ART//CODE 2026
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-ink leading-tight">
            Team Formation & Membership
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            Each team must consist of <strong>exactly two registered members</strong> to become eligible for project submission. You can either create a new team as leader or join an existing team via an invite code.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl border border-status-error/40 bg-red-50 text-status-error text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl border border-sage-200 bg-sage-50 text-status-success text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STATE 1: ALREADY BELONGS TO A TEAM */}
        {currentTeam ? (
          <div className="space-y-8">
            <div className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
                <div>
                  <div className="text-xs font-mono text-ink-muted uppercase">Registered Team</div>
                  <h2 className="text-2xl font-bold text-ink mt-1">{currentTeam.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={currentTeam.status === "complete" ? "complete" : "incomplete"}
                  />
                  <span className="text-xs font-mono text-ink-muted">
                    {currentTeam.members.length}/2 Members
                  </span>
                </div>
              </div>

              {/* Invitation Code Banner (Leader view or if incomplete) */}
              <div className="p-5 rounded-xl border border-border bg-ivory-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta font-semibold">
                    Team Invitation Code:
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xl font-mono font-bold text-ink tracking-wider bg-white px-3 py-1 rounded-lg border border-border">
                      {currentTeam.invitationCode}
                    </span>
                    <button
                      onClick={() => copyCode(currentTeam.invitationCode)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-ivory-100 text-xs font-medium text-ink flex items-center gap-1.5 shadow-subtle transition-colors"
                    >
                      {copied ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
                      <span>{copied ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-ink-secondary sm:text-right max-w-xs">
                  {currentTeam.status === "complete" ? (
                    <span className="text-status-success font-medium">
                      Both member slots are filled. Your team is officially eligible to submit!
                    </span>
                  ) : (
                    <span className="text-saffron-600 font-medium">
                      One more member needed. Share this code with your partner to complete registration.
                    </span>
                  )}
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-ink font-bold">
                  Registered Members (2 Slots)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slot 1: Leader */}
                  {currentTeam.members[0] && (
                    <div className="p-5 rounded-xl border border-border bg-ivory-50/60 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-terracotta-50 text-terracotta border border-terracotta-200 font-bold">
                          {currentTeam.members[0].role === "leader" ? "Team Leader" : "Teammate"}
                        </span>
                        {currentUser?.id === currentTeam.members[0].userId && (
                          <span className="text-[10px] font-mono text-ink-muted">You</span>
                        )}
                      </div>
                      <div className="font-bold text-ink text-sm mt-1">{currentTeam.members[0].name}</div>
                      <div className="text-xs text-ink-secondary">{currentTeam.members[0].email}</div>
                      <div className="text-[11px] text-ink-muted">{currentTeam.members[0].institution}</div>
                    </div>
                  )}

                  {/* Slot 2: Teammate or Empty Slot */}
                  {currentTeam.members[1] ? (
                    <div className="p-5 rounded-xl border border-border bg-ivory-50/60 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-sage-50 text-status-success border border-sage-200 font-bold">
                          Teammate
                        </span>
                        {currentUser?.id === currentTeam.members[1].userId && (
                          <span className="text-[10px] font-mono text-ink-muted">You</span>
                        )}
                      </div>
                      <div className="font-bold text-ink text-sm mt-1">{currentTeam.members[1].name}</div>
                      <div className="text-xs text-ink-secondary">{currentTeam.members[1].email}</div>
                      <div className="text-[11px] text-ink-muted">{currentTeam.members[1].institution}</div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl border-2 border-dashed border-border bg-white flex flex-col justify-center items-center text-center space-y-2 text-ink-muted py-8">
                      <Users size={24} className="text-ink-muted opacity-60" />
                      <div className="text-xs font-semibold text-ink">Slot 02 Available</div>
                      <div className="text-[11px] text-ink-muted max-w-xs">
                        Awaiting second member. Share invitation code{" "}
                        <strong className="text-ink font-mono">{currentTeam.invitationCode}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/team/workspace"
                  className="px-4 py-2.5 rounded-lg border border-border bg-ivory-100 hover:bg-ivory-200 text-ink text-xs font-semibold transition-colors"
                >
                  View Team Workspace
                </Link>

                <Link
                  href="/submission"
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                    currentTeam.status === "complete"
                      ? "bg-ink text-white hover:bg-ink-pure shadow-subtle"
                      : "bg-ivory-300 text-ink-muted cursor-not-allowed"
                  }`}
                >
                  <span>Go to Submission Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* STATE 2: NO TEAM YET - DISPLAY CREATE OR JOIN CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Create a Team */}
            <div className="p-8 rounded-card border border-border bg-white shadow-subtle flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold text-ink">Create a Team</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Establish a new team as the designated Team Leader. You will receive an invitation code to onboard your partner.
                </p>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Unique Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team KalaKriti"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-ivory-50 text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? "Creating..." : "Create Team as Leader"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Card 2: Join a Team */}
            <div className="p-8 rounded-card border border-border bg-white shadow-subtle flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-xl font-bold text-ink">Join Existing Team</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Already invited by your project partner? Enter their 8-character invitation code to join their team.
                </p>
              </div>

              <form onSubmit={handleJoinTeam} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Invitation Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ART-4491"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 text-xs font-mono uppercase rounded-xl border border-border bg-ivory-50 text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl border border-border bg-ivory-100 hover:bg-ivory-200 text-ink text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? "Verifying..." : "Join Team via Code"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
