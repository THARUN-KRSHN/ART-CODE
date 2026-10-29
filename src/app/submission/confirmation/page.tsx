"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectSubmission, Team, UserProfile } from "@/types";
import { CelebrationMotif } from "@/components/art/CelebrationMotif";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ShieldCheck,
  Calendar,
  Clock,
  Github,
  ExternalLink,
  ArrowRight,
  FileText,
  Users,
} from "lucide-react";

export default function SubmissionConfirmationPage() {
  const router = useRouter();
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConfirmation() {
      try {
        const subRes = await fetch("/api/submissions");
        const subData = await subRes.json();
        if (subData.submission) {
          setSubmission(subData.submission);
          setTeam(subData.team);
          setUser(subData.user);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfirmation();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading submission receipt...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="max-w-md bg-white p-8 rounded-card border border-border text-center space-y-4">
          <h2 className="text-lg font-bold text-ink">No Submission Found</h2>
          <p className="text-xs text-ink-secondary">Your team has not finalized a project submission yet.</p>
          <Link href="/dashboard" className="text-xs text-terracotta font-semibold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-card border border-border shadow-elevated p-8 sm:p-12 space-y-8 text-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-mandala-pattern opacity-10 pointer-events-none rounded-full translate-x-20 -translate-y-20" />

        {/* Celebration Artwork */}
        <CelebrationMotif className="mx-auto" />

        <div className="space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 text-status-success border border-sage-200 text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Official Submission Recorded</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl text-ink">
            Submission Confirmed & Locked
          </h1>

          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            Your project has been officially recorded in the DELTA evaluation database. Participant editing is now permanently locked.
          </p>
        </div>

        {/* Official Receipt Card */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-ivory-50/70 text-left space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <span className="text-[10px] font-mono text-ink-muted uppercase">Official Reference ID</span>
              <div className="text-xl font-mono font-bold text-terracotta tracking-wider mt-0.5">
                {submission.referenceId}
              </div>
            </div>
            <StatusBadge status="submitted" label="Officially Submitted" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-ink-muted font-mono uppercase text-[10px]">Project Title:</span>
              <div className="font-bold text-ink mt-0.5">{submission.projectTitle}</div>
            </div>

            <div>
              <span className="text-ink-muted font-mono uppercase text-[10px]">Team Name:</span>
              <div className="font-bold text-ink mt-0.5">{submission.teamName}</div>
            </div>

            <div className="sm:col-span-2">
              <span className="text-ink-muted font-mono uppercase text-[10px]">Assigned Track:</span>
              <div className="font-medium text-ink mt-0.5">{submission.challengeTitle}</div>
            </div>

            <div>
              <span className="text-ink-muted font-mono uppercase text-[10px]">Timestamp (IST):</span>
              <div className="font-mono text-ink mt-0.5">
                {new Date(submission.submittedAt || submission.updatedAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </div>
            </div>

            <div>
              <span className="text-ink-muted font-mono uppercase text-[10px]">Repository:</span>
              <div className="font-mono text-ink truncate mt-0.5">
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <Github size={12} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Information */}
        <div className="max-w-xl mx-auto text-xs text-ink-secondary space-y-1">
          <p>
            The DELTA Evaluation Committee will assess your submission against the 100-point rubric.
          </p>
          <p className="text-ink font-semibold">
            Winner announcement will be published on 14 November 2026.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors shadow-subtle"
          >
            Return to Dashboard
          </Link>

          <Link
            href="/team/workspace"
            className="px-5 py-2.5 rounded-xl border border-border bg-white hover:bg-ivory-100 text-ink text-xs font-semibold transition-colors"
          >
            Team Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

