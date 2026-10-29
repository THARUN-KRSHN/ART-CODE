"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Team, UserProfile, ProjectSubmission, ProblemStatement } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import {
  Users,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  FileCode,
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
          const subRes = await fetch("/api/submissions");
          const subData = await subRes.json();
          setSubmission(subData.submission);

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
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-darkRed">Loading team workspace...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md bg-paleCream p-8 rounded-card border-2 border-mutedGold shadow-subtle">
          <h2 className="text-xl font-bold text-darkRed">No Active Team Found</h2>
          <p className="text-xs text-ink-secondary">
            You have not created or joined a team yet. Form a team to access the workspace.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase font-mono"
          >
            Go to Team Formation
          </Link>
        </div>
      </div>
    );
  }

  const isLeader = team.leaderId === user?.id;

  return (
    <div className="min-h-screen bg-cream text-ink py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Workspace Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-mutedGold pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-vermilion uppercase font-bold flex items-center gap-1.5">
              <RhombusMotif size={12} color="#A32516" />
              <span>Team Workspace // ART//CODE 2026</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-darkRed">{team.name}</h1>
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
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-mutedGold pb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-darkRed font-mono flex items-center gap-2">
                  <RhombusMotif size={12} color="#A32516" />
                  <span>Team Members ({team.members.length}/2 Active)</span>
                </h2>
                <span className="text-xs text-ink-muted font-mono font-semibold">Strict Pair Dynamic</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.members.map((member) => (
                  <div key={member.userId} className="p-5 rounded-xl border border-mutedGold bg-cream space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                          member.role === "leader"
                            ? "bg-vermilion text-cream"
                            : "bg-accentGold text-darkRed"
                        }`}
                      >
                        {member.role === "leader" ? "Team Leader" : "Teammate"}
                      </span>
                      {user?.id === member.userId && (
                        <span className="text-[10px] font-mono text-vermilion font-bold">You</span>
                      )}
                    </div>
                    <div className="font-bold text-darkRed text-sm">{member.name}</div>
                    <div className="text-xs text-ink-secondary">{member.email}</div>
                    <div className="text-[11px] text-ink-muted">{member.institution}</div>
                  </div>
                ))}

                {team.members.length < 2 && (
                  <div className="p-5 rounded-xl border-2 border-dashed border-mutedGold bg-cream flex flex-col justify-center items-center text-center space-y-2 text-ink-muted py-6">
                    <Users size={22} className="text-darkRed opacity-50" />
                    <div className="text-xs font-bold text-darkRed">Second Slot Open</div>
                    <div className="text-[11px] text-ink-muted">
                      Invite code: <strong className="font-mono text-darkRed">{team.invitationCode}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Selected Challenge */}
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-mutedGold pb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-darkRed font-mono flex items-center gap-2">
                  <RhombusMotif size={12} color="#A32516" />
                  <span>Assigned Problem Statement</span>
                </h2>
                {isLeader && (
                  <Link
                    href="/challenges"
                    className="text-xs font-bold uppercase font-mono text-vermilion hover:underline inline-flex items-center gap-1"
                  >
                    <span>Change Track</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>

              {challenge ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-mutedGold bg-cream">
                  <div className="flex items-center gap-4">
                    <ChallengeMotif category={challenge.category} size={48} />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-vermilion font-bold">
                        {challenge.code} // {challenge.category}
                      </span>
                      <h3 className="text-sm font-bold text-darkRed mt-0.5">{challenge.title}</h3>
                    </div>
                  </div>
                  <Link
                    href={`/challenges/${challenge.slug}`}
                    className="px-3.5 py-1.5 rounded-lg border border-mutedGold bg-paleCream hover:bg-cream text-xs font-bold uppercase font-mono text-darkRed flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>View Brief</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-mutedGold text-center space-y-3 bg-cream">
                  <p className="text-xs text-ink-secondary">
                    No problem statement has been assigned to this team yet.
                  </p>
                  <Link
                    href="/challenges"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase font-mono shadow-subtle"
                  >
                    Select Challenge
                  </Link>
                </div>
              )}
            </div>

            {/* Section 3: Project Submission Status */}
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-mutedGold pb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-darkRed font-mono flex items-center gap-2">
                  <RhombusMotif size={12} color="#A32516" />
                  <span>Project Submission Status</span>
                </h2>
                <span className="text-xs font-mono text-darkRed font-semibold">Deadline: 8 Nov 2026</span>
              </div>

              {submission ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-mutedGold bg-cream flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-darkRed uppercase font-bold">
                        Ref: {submission.referenceId || "Draft in progress"}
                      </div>
                      <h4 className="text-base font-bold text-darkRed mt-0.5">
                        {submission.projectTitle || "Untitled Project Draft"}
                      </h4>
                      <p className="text-xs text-ink-secondary line-clamp-1 mt-1">
                        {submission.shortDescription || "No description drafted yet."}
                      </p>
                    </div>

                    <StatusBadge
                      status={submission.isLocked ? "submitted" : "draft"}
                      label={submission.isLocked ? "Locked" : "Draft"}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {submission.isLocked ? (
                      <Link
                        href="/submission/confirmation"
                        className="px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-subtle"
                      >
                        <ShieldCheck size={14} className="text-accentGold" />
                        <span>View Official Confirmation</span>
                      </Link>
                    ) : (
                      <Link
                        href="/submission"
                        className="px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors inline-flex items-center gap-2 shadow-subtle"
                      >
                        <span>{isLeader ? "Continue Editing Draft" : "View Team Draft"}</span>
                        <ArrowRight size={14} className="text-accentGold" />
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-mutedGold text-center space-y-3 bg-cream">
                  <p className="text-xs text-ink-secondary">
                    Your team hasn't initiated a submission draft yet.
                  </p>
                  {team.status === "complete" ? (
                    <Link
                      href="/submission"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase font-mono shadow-subtle"
                    >
                      <span>Start Submission Draft</span>
                      <ArrowRight size={14} className="text-accentGold" />
                    </Link>
                  ) : (
                    <p className="text-xs text-vermilion font-bold font-mono">
                      Submission portal unlocks once your 2nd teammate joins.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-darkRed font-bold flex items-center gap-1.5">
                <RhombusMotif size={12} color="#A32516" />
                <span>Invitation Code</span>
              </span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream border border-mutedGold">
                <span className="text-lg font-mono font-bold text-darkRed tracking-wider">
                  {team.invitationCode}
                </span>
                <button
                  onClick={() => copyCode(team.invitationCode)}
                  className="p-2 rounded-lg bg-paleCream border border-mutedGold hover:bg-cream text-darkRed shadow-subtle transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                Provide this code to your partner. Entering this code on the Join Team screen immediately enrolls them into {team.name}.
              </p>
            </div>

            <div className="p-6 rounded-card border-2 border-vermilion bg-cream shadow-subtle space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-darkRed font-mono uppercase">
                <Clock size={15} className="text-vermilion" />
                <span>Next Milestone</span>
              </div>
              <div className="text-sm font-bold text-darkRed">Submission Hard Stop</div>
              <p className="text-xs text-ink-secondary">
                8 November 2026, 11:59 PM IST. Ensure both members and deliverables are confirmed well in advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
