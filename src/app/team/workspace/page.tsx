"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Team, UserProfile, ProjectSubmission, ProblemStatement } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import {
  Users,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  FileCode,
  AlertCircle,
} from "lucide-react";

export default function TeamWorkspacePage() {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [challenge, setChallenge] = useState<ProblemStatement | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const teamRes = await fetch("/api/teams");
        if (teamRes.status === 401) {
          router.push("/login");
          return;
        }
        const teamData = await teamRes.json();
        setUser(teamData.user);
        setTeam(teamData.team);

        if (teamData.team) {
          // Fetch submission
          const subRes = await fetch("/api/submissions");
          const subData = await subRes.json();
          setSubmission(subData.submission);

          // Fetch selected challenge
          if (teamData.team.selectedChallengeId) {
            const chRes = await fetch(`/api/challenges/${teamData.team.selectedChallengeId}`);
            const chData = await chRes.json();
            setChallenge(chData.challenge);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWorkspace();
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
          <p className="text-xs font-mono text-ink-muted">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-card border border-border shadow-subtle">
          <h2 className="text-xl font-bold text-ink">No Active Team Found</h2>
          <p className="text-xs text-ink-secondary">
            You have not created or joined a team yet. Form a team to access the workspace.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white text-xs font-semibold"
          >
            Go to Team Formation
          </Link>
        </div>
      </div>
    );
  }

  const isLeader = team.leaderId === user?.id;

  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Workspace Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-indigo uppercase font-semibold">
              Team Workspace // ART//CODE 2026
            </div>
            <h1 className="text-3xl font-bold text-ink">{team.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={team.status} />
            {submission && (
              <StatusBadge
                status={submission.isLocked ? "submitted" : "draft"}
                label={submission.isLocked ? "Submission Locked" : "Draft Saved"}
              />
            )}
          </div>
        </div>

        {/* 3-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1: Team Members */}
            <div className="p-6 sm:p-8 rounded-card border border-border bg-white shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
                  Team Members ({team.members.length}/2 Active)
                </h2>
                <span className="text-xs text-ink-muted">
                  Strict Pair Dynamic
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.members.map((member, i) => (
                  <div
                    key={member.userId}
                    className="p-5 rounded-xl border border-border bg-ivory-50/70 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold border ${
                          member.role === "leader"
                            ? "bg-terracotta-50 text-terracotta border-terracotta-200"
                            : "bg-sage-50 text-status-success border-sage-200"
                        }`}
                      >
                        {member.role === "leader" ? "Team Leader" : "Teammate"}
                      </span>
                      {user?.id === member.userId && (
                        <span className="text-[10px] font-mono text-terracotta font-semibold">You</span>
                      )}
                    </div>
                    <div className="font-bold text-ink text-sm">{member.name}</div>
                    <div className="text-xs text-ink-secondary">{member.email}</div>
                    <div className="text-[11px] text-ink-muted">{member.institution}</div>
                  </div>
                ))}

                {team.members.length < 2 && (
                  <div className="p-5 rounded-xl border-2 border-dashed border-border bg-white flex flex-col justify-center items-center text-center space-y-2 text-ink-muted py-6">
                    <Users size={22} className="opacity-50" />
                    <div className="text-xs font-semibold text-ink">Second Slot Open</div>
                    <div className="text-[11px] text-ink-muted">
                      Invite code: <strong className="font-mono text-ink">{team.invitationCode}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Selected Challenge */}
            <div className="p-6 sm:p-8 rounded-card border border-border bg-white shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
                  Assigned Problem Statement
                </h2>
                {isLeader && (
                  <Link
                    href="/challenges"
                    className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    <span>Change Challenge</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>

              {challenge ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-ivory-50">
                  <div className="flex items-center gap-4">
                    <ChallengeMotif
                      category={challenge.category}
                      accent={challenge.accentColor}
                      size={48}
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold">
                        {challenge.code} // {challenge.category}
                      </span>
                      <h3 className="text-sm font-bold text-ink mt-0.5">{challenge.title}</h3>
                    </div>
                  </div>
                  <Link
                    href={`/challenges/${challenge.slug}`}
                    className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-ivory-100 text-xs font-medium text-ink flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>View Brief</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-3">
                  <p className="text-xs text-ink-secondary">
                    No problem statement has been assigned to this team yet.
                  </p>
                  <Link
                    href="/challenges"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-white text-xs font-semibold"
                  >
                    Select a Challenge
                  </Link>
                </div>
              )}
            </div>

            {/* Section 3: Project Submission Status */}
            <div className="p-6 sm:p-8 rounded-card border border-border bg-white shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
                  Project Submission Status
                </h2>
                <span className="text-xs text-ink-muted">Deadline: 8 Nov 2026</span>
              </div>

              {submission ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-ivory-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-ink-muted uppercase">
                        Reference: {submission.referenceId || "Draft in progress"}
                      </div>
                      <h4 className="text-base font-bold text-ink mt-0.5">
                        {submission.projectTitle || "Untitled Project Draft"}
                      </h4>
                      <p className="text-xs text-ink-secondary line-clamp-1 mt-1">
                        {submission.shortDescription || "No description drafted yet."}
                      </p>
                    </div>

                    <StatusBadge
                      status={submission.isLocked ? "submitted" : "draft"}
                      label={submission.isLocked ? "Locked & Finalized" : "Draft"}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {submission.isLocked ? (
                      <Link
                        href="/submission/confirmation"
                        className="px-4 py-2 rounded-lg bg-sage-50 text-status-success border border-sage-200 text-xs font-semibold inline-flex items-center gap-2"
                      >
                        <ShieldCheck size={14} />
                        <span>View Official Confirmation</span>
                      </Link>
                    ) : (
                      <Link
                        href="/submission"
                        className="px-5 py-2.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors inline-flex items-center gap-2"
                      >
                        <span>{isLeader ? "Continue Editing Draft" : "View Team Draft"}</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}

                    {submission.githubUrl && (
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-ink-secondary hover:text-ink inline-flex items-center gap-1"
                      >
                        <FileCode size={13} />
                        <span>GitHub Repository</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-3">
                  <p className="text-xs text-ink-secondary">
                    Your team hasn't initiated a submission draft yet.
                  </p>
                  {team.status === "complete" ? (
                    <Link
                      href="/submission"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink text-white text-xs font-semibold"
                    >
                      <span>Start Submission Draft</span>
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <p className="text-xs text-saffron-600 font-medium">
                      Submission portal unlocks once your 2nd teammate joins.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Invitation Code Widget */}
            <div className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold">
                Invitation Code
              </span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-ivory-100 border border-border">
                <span className="text-lg font-mono font-bold text-ink tracking-wider">
                  {team.invitationCode}
                </span>
                <button
                  onClick={() => copyCode(team.invitationCode)}
                  className="p-2 rounded-lg bg-white border border-border hover:bg-ivory-50 text-ink shadow-subtle transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                Provide this code to your partner. Entering this code on the Join Team screen immediately enrolls them into {team.name}.
              </p>
            </div>

            {/* Quick Milestone Notice */}
            <div className="p-6 rounded-card border border-border bg-ivory-50 shadow-subtle space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Clock size={15} className="text-terracotta" />
                <span>Next Milestone</span>
              </div>
              <div className="text-sm font-bold text-ink">Submission Deadline</div>
              <p className="text-xs text-ink-secondary">
                8 November 2026, 11:59 PM IST. Ensure both member slots and all links are ready well before locking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

