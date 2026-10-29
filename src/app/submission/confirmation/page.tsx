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
  CheckCircle,
  Sparkles,
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
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink/70">Retrieving official submission receipt...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="max-w-md bg-paleCream/90 p-8 rounded-2xl border-2 border-mutedGold/50 text-center space-y-4 shadow-elevated">
          <h2 className="text-lg font-bold text-ink">No Submission Found</h2>
          <p className="text-xs text-ink/80">Your team has not finalized a project submission yet.</p>
          <Link href="/dashboard" className="text-xs text-vermilion font-bold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream bg-mandala-grid py-12 md:py-20 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-paleCream/95 backdrop-blur-sm rounded-2xl border-2 border-mutedGold/60 shadow-elevated p-8 sm:p-12 space-y-8 text-center relative overflow-hidden">
        {/* Cultural corner ornamentation */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-mandala-pattern opacity-10 pointer-events-none rounded-full translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-mandala-pattern opacity-10 pointer-events-none rounded-full -translate-x-10 translate-y-10" />

        {/* Celebration Artwork */}
        <CelebrationMotif className="mx-auto" />

        <div className="space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accentGold/20 text-darkRed border border-accentGold/50 text-xs font-bold font-mono uppercase tracking-wider">
            <ShieldCheck size={14} className="text-vermilion" />
            <span>Official Submission Sealed</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl text-vermilion font-bold">
            Submission Confirmed & Locked
          </h1>

          <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">
            Your project has been officially recorded in the DELTA evaluation database. Participant editing is now permanently locked per hackathon guidelines.
          </p>
        </div>

        {/* Official Receipt Card */}
        <div className="p-6 sm:p-8 rounded-xl border-2 border-mutedGold/60 bg-cream/70 text-left space-y-5 max-w-2xl mx-auto shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mutedGold/50 pb-4">
            <div>
              <span className="text-[10px] font-mono text-darkRed/80 uppercase tracking-widest font-bold">
                Official Reference ID
              </span>
              <div className="text-2xl font-mono font-bold text-vermilion tracking-wider mt-0.5">
                {submission.referenceId}
              </div>
            </div>
            <StatusBadge status="submitted" label="Officially Submitted" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-ink/60 font-mono uppercase text-[10px] font-semibold">Project Title:</span>
              <div className="font-bold text-ink mt-0.5 text-sm">{submission.projectTitle}</div>
            </div>

            <div>
              <span className="text-ink/60 font-mono uppercase text-[10px] font-semibold">Team Name:</span>
              <div className="font-bold text-ink mt-0.5 text-sm">{submission.teamName}</div>
            </div>

            <div className="sm:col-span-2">
              <span className="text-ink/60 font-mono uppercase text-[10px] font-semibold">Assigned Track:</span>
              <div className="font-medium text-ink mt-0.5">{submission.challengeTitle}</div>
            </div>

            <div>
              <span className="text-ink/60 font-mono uppercase text-[10px] font-semibold">Timestamp (IST):</span>
              <div className="font-mono text-ink mt-0.5 font-medium">
                {new Date(submission.submittedAt || submission.updatedAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </div>
            </div>

            <div>
              <span className="text-ink/60 font-mono uppercase text-[10px] font-semibold">Repository:</span>
              <div className="font-mono text-ink truncate mt-0.5">
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-vermilion hover:underline font-bold inline-flex items-center gap-1"
                >
                  <Github size={13} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Information */}
        <div className="max-w-xl mx-auto text-xs text-ink/80 space-y-1.5 border-t border-mutedGold/40 pt-6">
          <p>
            The DELTA Evaluation Committee will assess your submission against the 100-point rubric.
          </p>
          <p className="text-darkRed font-bold flex items-center justify-center gap-1.5">
            <Sparkles size={13} className="text-accentGold" />
            <span>Winner announcement will be published on 14 November 2026.</span>
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>Return to Dashboard</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/team/workspace"
            className="px-5 py-2.5 rounded-xl border border-mutedGold/70 bg-cream/80 hover:bg-cream text-darkRed text-xs font-bold transition-colors"
          >
            Team Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
