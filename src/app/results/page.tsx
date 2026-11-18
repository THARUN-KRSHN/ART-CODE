"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { EventSettings, ShowcaseProject, WinnerResult } from "@/types";
import { CulturalDivider, RhombusMotif } from "@/components/art/CulturalMotifs";
import {
  Award,
  Clock,
  ArrowLeft,
  ArrowRight,
  Crown,
  ExternalLink,
  Github,
  Trophy,
} from "lucide-react";

const RANK_META = {
  1: {
    place: "First Place",
    ribbon: "★ Grand Winner ★",
    medal: "#F1B321",
    medalDeep: "#CB9414",
    ink: "#6B2B12",
  },
  2: {
    place: "Second Place",
    ribbon: "Silver Merit",
    medal: "#D9D9D9",
    medalDeep: "#9CA3AF",
    ink: "#4A4237",
  },
  3: {
    place: "Third Place",
    ribbon: "Bronze Merit",
    medal: "#C47A3B",
    medalDeep: "#8C5A2B",
    ink: "#6B2B12",
  },
} as const;

const CONFETTI_COLORS = ["#A32516", "#F1B321", "#D9B88A", "#6B2B12", "#FCE9CC", "#8C3D20"];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  color: string;
  width: number;
  height: number;
  radius: number;
}

export default function ResultsPage() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [winners, setWinners] = useState<WinnerResult[]>([]);
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [published, setPublished] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/results").then((res) => res.json()),
      fetch("/api/projects")
        .then((res) => res.json())
        .catch(() => ({ projects: [] })),
    ])
      .then(([results, showcase]) => {
        setSettings(results.settings || null);
        setWinners(results.winners || []);
        setPublished(Boolean(results.resultsPublished));
        setProjects(showcase.projects || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!published) return;
    const pieces: ConfettiPiece[] = Array.from({ length: 64 }, (_, id) => ({
      id,
      left: Math.random() * 100,
      delay: Math.random() * 7,
      duration: 6 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 160,
      color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
      width: 5 + Math.random() * 7,
      height: 8 + Math.random() * 9,
      radius: Math.random() > 0.55 ? 999 : 1,
    }));
    setConfetti(pieces);
  }, [published]);

  const byRank = (r: 1 | 2 | 3) => winners.find((w) => w.rank === r) || null;

  const projectFor = (w: WinnerResult | null) => {
    if (!w) return null;
    const target = w.projectTitle.trim().toLowerCase();
    return (
      projects.find((p) => p.projectTitle.trim().toLowerCase() === target) || null
    );
  };

  const ordered = useMemo(
    () => ([byRank(2), byRank(1), byRank(3)] as (WinnerResult | null)[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [winners]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink/70">Unrolling the announcement...</p>
        </div>
      </div>
    );
  }

  if (!published) {
    return (
      <div className="min-h-screen bg-cream bg-mandala-grid py-16 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-paleCream/95 p-8 sm:p-12 rounded-2xl border-2 border-mutedGold/60 shadow-elevated text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cream border-2 border-mutedGold/60 flex items-center justify-center text-vermilion mx-auto shadow-sm">
            <Clock size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              Evaluation in Progress
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-bold">
              Results Pending Publication
            </h1>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              Submissions are currently under rigorous assessment by the DELTA faculty
              and peer review committee against our 100-point rubric. Official results
              will be unveiled following deliberation.
            </p>
          </div>

          <div className="p-4 rounded-xl border-2 border-mutedGold/50 bg-cream text-xs text-darkRed inline-block font-mono font-semibold">
            Scheduled Announcement:{" "}
            <strong>
              {new Date(settings?.winnerAnnouncement || "").toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                }
              )}
            </strong>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Back to Event Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream bg-mandala-grid text-ink relative overflow-x-hidden">
      {/* Falling confetti */}
      <div className="confetti-layer" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              width: c.width,
              height: c.height,
              background: c.color,
              borderRadius: c.radius,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              ["--drift" as string]: `${c.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        {/* Poster-style masthead */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold">
            <RhombusMotif size={14} />
            <span>Official Result Announcement // ART//CODE 2026</span>
            <RhombusMotif size={14} />
          </div>

          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl text-darkRed leading-[1.05]">
            And the winners
            <span className="block text-vermilion italic">are&hellip;</span>
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-accentGold bg-accentGold/15 text-[11px] font-mono font-bold uppercase tracking-widest text-darkRed">
            <Trophy size={13} className="text-vermilion" />
            <span>Total prize pool {settings?.totalPrizePool || "₹3,000"}</span>
          </div>

          <p className="text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto">
            Three teams. Three bold ideas where art, culture, heritage and code
            collide. Honouring computational craftsmanship and cultural innovation
            from this year&apos;s cohort.
          </p>

          {settings?.winnerAnnouncement && (
            <p className="text-[11px] font-mono text-ink/60 uppercase tracking-wider">
              Unveiled{" "}
              {new Date(settings.winnerAnnouncement).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
                timeZoneName: "short",
              })}
            </p>
          )}
        </header>

        <CulturalDivider />

        {/* Podium — 2 · 1 · 3 */}
        <section aria-label="Winners podium" className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-end pt-6">
          {ordered.map((w, i) => {
            const rank = (w?.rank ?? (i === 0 ? 2 : i === 1 ? 1 : 3)) as 1 | 2 | 3;
            const meta = RANK_META[rank];
            const project = projectFor(w);
            const isFirst = rank === 1;
            const orderClass =
              rank === 1
                ? "order-1 md:order-2"
                : rank === 2
                  ? "order-2 md:order-1"
                  : "order-3";

            return (
              <article
                key={rank}
                className={[
                  "relative flex flex-col text-center rounded-3xl border-2 transition-shadow",
                  orderClass,
                  isFirst
                    ? "md:-translate-y-6 p-8 sm:p-10 border-vermilion bg-paleCream shadow-poster"
                    : "p-6 sm:p-8 border-mutedGold/70 bg-paleCream/90 shadow-sm hover:shadow-elevated",
                  !w && "opacity-60",
                ].join(" ")}
              >
                {isFirst && (
                  <>
                    <span className="podium-halo absolute -inset-3 rounded-[28px] border-2 border-dashed border-accentGold/70 pointer-events-none" aria-hidden="true" />
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-vermilion text-cream text-[10px] font-mono uppercase tracking-[0.2em] font-bold shadow-subtle">
                      <Crown size={12} className="text-accentGold crown-bob" />
                      {meta.ribbon}
                    </span>
                  </>
                )}

                {!isFirst && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink/60 block mb-4">
                    {meta.ribbon}
                  </span>
                )}

                {/* Rank medallion */}
                <div className="relative mx-auto mb-4" style={{ width: isFirst ? 118 : 84, height: isFirst ? 118 : 84 }}>
                  {isFirst && (
                    <LaurelWreath className="absolute inset-0 w-full h-full" color="#CB9414" />
                  )}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center border-[3px] shadow-subtle"
                    style={{
                      width: isFirst ? 78 : 58,
                      height: isFirst ? 78 : 58,
                      background: `radial-gradient(circle at 32% 28%, #fff8, ${meta.medal} 46%, ${meta.medalDeep})`,
                      borderColor: meta.ink,
                    }}
                  >
                    <span
                      className="font-editorial font-bold leading-none"
                      style={{
                        fontSize: isFirst ? 40 : 28,
                        color: rank === 2 ? "#4A4237" : "#6B2B12",
                        textShadow: "0 1px 0 #ffffff66",
                      }}
                    >
                      {rank}
                    </span>
                  </div>
                </div>

                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-widest block"
                  style={{ color: meta.ink }}
                >
                  {meta.place}
                </span>

                <div
                  className="font-editorial font-bold leading-none mt-2"
                  style={{
                    fontSize: isFirst ? "3rem" : "2.25rem",
                    color: isFirst ? "#A32516" : "#1F1A14",
                  }}
                >
                  {w?.prizeAmount || "—"}
                </div>

                <div
                  className="border-t mt-4 pt-4 space-y-1.5"
                  style={{ borderColor: isFirst ? "rgba(163,37,22,.3)" : "rgba(217,184,138,.6)" }}
                >
                  <h2 className={isFirst ? "text-xl font-bold text-ink" : "text-base font-bold text-ink"}>
                    {w?.teamName || "To be announced"}
                  </h2>
                  <p className={`text-vermilion font-bold leading-snug ${isFirst ? "text-sm" : "text-xs"}`}>
                    {w?.projectTitle}
                  </p>
                  {w && w.members.length > 0 && (
                    <p className="text-[11px] text-ink/70 font-mono pt-1">{w.members.join(" · ")}</p>
                  )}
                  {w?.institution && (
                    <p className="text-[10px] text-ink/50 leading-snug">{w.institution}</p>
                  )}
                  {Boolean(w?.score) && (
                    <p className="text-[10px] font-mono font-bold text-darkRed pt-1">
                      Score: {w?.score} / 100
                    </p>
                  )}
                </div>

                {project && (
                  <div className="flex flex-wrap justify-center gap-2 pt-5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-vermilion text-cream text-[10px] font-bold uppercase tracking-wider hover:bg-darkRed transition-colors"
                      >
                        <ExternalLink size={12} className="text-accentGold" />
                        Live Demo
                      </a>
                    )}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-mutedGold bg-cream text-darkRed text-[10px] font-bold uppercase tracking-wider hover:bg-paleCream transition-colors"
                    >
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {/* Winner showcase strips */}
        <section aria-label="Winning projects" className="space-y-5 pt-4">
          <div className="flex items-center gap-3">
            <h2 className="font-editorial text-2xl sm:text-3xl text-darkRed font-bold shrink-0">
              The Winning Work
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-mutedGold to-transparent" />
          </div>

          {winners
            .slice()
            .sort((a, b) => a.rank - b.rank)
            .map((w) => {
              const meta = RANK_META[w.rank];
              const project = projectFor(w);
              return (
                <article
                  key={w.rank}
                  className="group grid grid-cols-[auto_1fr] sm:grid-cols-[110px_1fr] gap-4 sm:gap-6 items-start p-5 sm:p-7 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/85 hover:border-vermilion hover:shadow-elevated transition-all"
                >
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                    <span
                      className="font-editorial font-bold leading-none select-none"
                      style={{
                        fontSize: "3.5rem",
                        color: "transparent",
                        WebkitTextStroke: `2px ${meta.medalDeep}`,
                      }}
                      aria-hidden="true"
                    >
                      {w.rank}
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded"
                      style={{ background: meta.medal, color: rankInk(w.rank) }}
                    >
                      {ordinal(w.rank)}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {project?.challengeCode && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cream text-darkRed border border-mutedGold">
                          {project.challengeCode}
                        </span>
                      )}
                      {project?.challengeCategory && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-vermilion font-bold">
                          {project.challengeCategory}
                        </span>
                      )}
                    </div>

                    <h3 className="font-editorial text-xl sm:text-2xl text-ink font-bold leading-snug group-hover:text-vermilion transition-colors">
                      {w.projectTitle}
                    </h3>

                    <p className="text-xs text-ink/70">
                      <strong className="text-darkRed">{w.teamName}</strong>
                      {w.members.length > 0 && <> — {w.members.join(", ")}</>}
                      {project?.shortDescription && (
                        <span className="block text-ink-secondary mt-1.5 leading-relaxed line-clamp-2">
                          {project.shortDescription}
                        </span>
                      )}
                    </p>

                    {project && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {project.techStack.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-cream border border-mutedGold/60 text-darkRed font-mono text-[10px] font-bold"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="px-2 py-0.5 rounded bg-cream border border-mutedGold/60 text-ink/60 font-mono text-[10px] font-bold">
                            +{project.techStack.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
                        {meta.place} · {w.prizeAmount}
                      </span>
                      {project?.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-vermilion hover:text-darkRed"
                        >
                          Live <ArrowRight size={11} />
                        </a>
                      )}
                      {project?.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-darkRed hover:text-vermilion"
                        >
                          <Github size={11} /> Repo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
        </section>

        {/* Closing note */}
        <section className="relative p-8 sm:p-10 rounded-3xl border-2 border-vermilion bg-cream shadow-poster text-center space-y-4 overflow-hidden">
          <div className="absolute inset-0 bg-ornate-weave pointer-events-none" aria-hidden="true" />
          <div className="relative space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accentGold/20 border-2 border-accentGold text-vermilion mx-auto">
              <Award size={26} />
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-darkRed font-bold">
              Every team left a mark
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-lg mx-auto leading-relaxed">
              The podium only fits three — but the showcase carries all of them.
              Revisit every submission from ART//CODE 2026, or head back home for
              the full event story.
            </p>
          </div>
          <div className="relative flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors shadow-subtle"
            >
              <span>Browse All Projects</span>
              <ArrowRight size={14} className="text-accentGold" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-mutedGold bg-paleCream text-darkRed text-xs font-bold uppercase tracking-wider hover:bg-cream transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Event Home</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ordinal(rank: number) {
  return rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd";
}

function rankInk(rank: 1 | 2 | 3) {
  return rank === 2 ? "#1F1A14" : "#6B2B12";
}

function LaurelWreath({ className = "", color = "#CB9414" }: { className?: string; color?: string }) {
  const leaves = useMemo(() => {
    const p0 = { x: 60, y: 112 };
    const p1 = { x: 8, y: 84 };
    const p2 = { x: 26, y: 24 };
    return Array.from({ length: 8 }, (_, i) => {
      const t = (i + 0.5) / 8;
      const mt = 1 - t;
      const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
      const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
      const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + (i % 2 === 0 ? -34 : 34);
      return { x, y, angle, scale: 1 - t * 0.35 };
    });
  }, []);

  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? "translate(120,0) scale(-1,1)" : undefined}>
          <path
            d="M60 112 C18 92 6 66 26 24"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          {leaves.map((leaf, i) => (
            <ellipse
              key={i}
              cx={leaf.x}
              cy={leaf.y}
              rx={8 * leaf.scale}
              ry={3.6 * leaf.scale}
              fill={color}
              opacity={0.85}
              transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
