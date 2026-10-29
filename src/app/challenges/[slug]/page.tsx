"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProblemStatement, Team } from "@/types";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function ChallengeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [challenge, setChallenge] = useState<ProblemStatement | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [canSelect, setCanSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/challenges/${slug}`);
      const data = await res.json();
      if (res.ok) {
        setChallenge(data.challenge);
        setTeam(data.team);
        setIsSelected(data.isSelectedByTeam);
        setCanSelect(data.canSelect);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleSelectChallenge = async () => {
    setIsSubmitting(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/challenges/${slug}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsSelected(true);
        setActionMessage(data.message || "Challenge selected for your team!");
      } else {
        setActionMessage(data.error || "Failed to select challenge");
      }
    } catch (e: any) {
      setActionMessage(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-darkRed">Loading challenge brief...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md bg-paleCream p-8 rounded-card border-2 border-mutedGold">
          <h2 className="text-2xl font-bold text-darkRed">Challenge Not Found</h2>
          <p className="text-xs text-ink-secondary">The requested challenge statement does not exist.</p>
          <Link href="/challenges" className="inline-flex items-center gap-2 text-xs font-bold text-vermilion uppercase font-mono">
            <ArrowLeft size={14} /> Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb (Panel 07 Style) */}
        <div className="flex items-center justify-between">
          <Link
            href="/challenges"
            className="text-xs font-mono font-bold uppercase tracking-wider text-secondaryRed hover:text-vermilion inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Challenges
          </Link>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-paleCream border border-mutedGold text-darkRed">
            {challenge.code}
          </span>
        </div>

        {/* Challenge Header Card */}
        <div className="p-8 sm:p-10 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-vermilion text-cream font-bold">
                  {challenge.code}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-accentGold text-darkRed font-bold">
                  {challenge.category}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-cream text-darkRed border border-mutedGold font-bold">
                  {challenge.difficulty}
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl text-darkRed leading-tight">
                {challenge.title}
              </h1>
            </div>
            <ChallengeMotif category={challenge.category} size={70} className="flex-shrink-0" />
          </div>

          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed border-t border-mutedGold/60 pt-6">
            {challenge.shortDescription}
          </p>
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-muted mt-2">{challenge.domain}</div>

          {/* Action / Selection Box */}
          <div className="p-5 rounded-xl border-2 border-mutedGold bg-cream flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {isSelected ? (
                <div className="flex items-center gap-2 text-xs font-bold text-status-success font-mono">
                  <CheckCircle2 size={16} />
                  <span>Assigned to your team: {team?.name}</span>
                </div>
              ) : team ? (
                <div className="text-xs text-ink-secondary">
                  Team: <strong className="text-darkRed font-semibold">{team.name}</strong>{" "}
                  {canSelect ? "(You can assign this challenge to your team)" : "(Only the team leader can change challenge)"}
                </div>
              ) : (
                <div className="text-xs text-ink-secondary">
                  Sign in and form a team to choose this challenge for your submission.
                </div>
              )}
            </div>

            {canSelect && !isSelected && (
              <button
                onClick={handleSelectChallenge}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors disabled:opacity-50 shadow-subtle"
              >
                {isSubmitting ? "Selecting..." : "Select for My Team"}
              </button>
            )}

            {isSelected && (
              <Link
                href="/submission"
                className="px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors inline-flex items-center gap-1.5 shadow-subtle"
              >
                <span>Go to Submission Draft</span>
                <ArrowRight size={13} className="text-accentGold" />
              </Link>
            )}
          </div>

          {actionMessage && (
            <p className="text-xs font-semibold text-vermilion text-center">{actionMessage}</p>
          )}
        </div>

        {/* 1. Context & Background */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
            <RhombusMotif size={14} />
            <span>01 // Cultural Background & Context</span>
          </div>
          <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle">
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {challenge.background}
            </p>
          </div>
        </section>

        {/* 2. Problem Statement Description */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
            <RhombusMotif size={14} />
            <span>02 // Problem Description</span>
          </div>
          <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle">
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {challenge.problemDescription}
            </p>
          </div>
        </section>

        {/* 3. Objectives & Expected Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-darkRed font-bold">
              <RhombusMotif size={12} color="#F1B321" />
              <span>03 // Required Objectives</span>
            </div>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              {challenge.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed text-ink">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-darkRed font-bold">
              <RhombusMotif size={12} color="#F1B321" />
              <span>04 // Expected Deliverables</span>
            </div>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              {challenge.expectedOutcomes.map((out, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-vermilion mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed text-ink">{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Submission Guidance */}
        <section className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-darkRed font-bold flex items-center gap-2">
            <RhombusMotif size={14} />
            <span>05 // Submission Guidance & Constraints</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">{challenge.submissionGuidance}</p>
        </section>

        {/* Additional Sections from Statement */}
        {challenge.mvp && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              <RhombusMotif size={14} />
              <span>06 // Minimum Viable Prototype</span>
            </div>
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle">
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">{challenge.mvp}</p>
            </div>
          </section>
        )}

        {challenge.successCriteria && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              <RhombusMotif size={14} />
              <span>07 // Success Criteria</span>
            </div>
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle">
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">{challenge.successCriteria}</p>
            </div>
          </section>
        )}

        {challenge.constraints && challenge.constraints.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              <RhombusMotif size={14} />
              <span>08 // Scope Limitations</span>
            </div>
            <ul className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-2 text-xs sm:text-sm text-ink-secondary">
              {challenge.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-1.5 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {challenge.researchConnection && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              <RhombusMotif size={14} />
              <span>09 // Research Connection</span>
            </div>
            <div className="p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle">
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">{challenge.researchConnection}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
