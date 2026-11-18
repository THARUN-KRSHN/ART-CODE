"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ShowcaseProject } from "@/types";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import {
  Search,
  Github,
  ExternalLink,
  X,
  Users,
  Layers,
  FolderKanban,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";

function visitorId(): string {
  if (typeof window === "undefined") return "";
  const key = "artcode_visitor_id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selected, setSelected] = useState<ShowcaseProject | null>(null);
  const [likeBusy, setLikeBusy] = useState<string | null>(null);

  const toggleLike = async (project: ShowcaseProject) => {
    if (likeBusy) return;
    setLikeBusy(project.id);
    const wasLiked = project.liked;
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? { ...p, liked: !wasLiked, likeCount: p.likeCount + (wasLiked ? -1 : 1) }
          : p
      )
    );
    try {
      const res = await fetch("/api/projects/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-visitor-id": visitorId(),
        },
        body: JSON.stringify({ submissionId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Revert on failure
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id
              ? { ...p, liked: wasLiked, likeCount: p.likeCount + (wasLiked ? 1 : -1) }
              : p
          )
        );
        if (res.status === 503) console.warn(data.error);
        return;
      }
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, liked: data.liked, likeCount: data.likeCount }
            : p
        )
      );
    } catch {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, liked: wasLiked, likeCount: p.likeCount + (wasLiked ? 1 : -1) }
            : p
        )
      );
    } finally {
      setLikeBusy(null);
    }
  };

  useEffect(() => {
    fetch("/api/projects", { headers: { "x-visitor-id": visitorId() } })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(projects.map((p) => p.challengeCategory).filter(Boolean))
    );
    return ["All", ...cats];
  }, [projects]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      teams: new Set(projects.map((p) => p.teamName)).size,
      challenges: new Set(projects.map((p) => p.challengeId)).size,
    }),
    [projects]
  );

  const filtered = projects.filter((p) => {
    const matchesCat =
      selectedCategory === "All" || p.challengeCategory === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.projectTitle.toLowerCase().includes(q) ||
      p.teamName.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.challengeTitle.toLowerCase().includes(q) ||
      p.techStack.join(" ").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink/70">Loading showcase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold">
            <RhombusMotif size={14} />
            <span>Project Showcase // ART//CODE 2026</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-darkRed leading-tight">
            What the Teams Built
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            Every submitted project from the hackathon — ideas where art, culture,
            heritage and code meet. Browse by domain, peek into the solution, and
            open the repos.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <StatChip icon={<FolderKanban size={14} />} label="Projects" value={stats.total} />
          <StatChip icon={<Users size={14} />} label="Teams" value={stats.teams} />
          <StatChip icon={<Layers size={14} />} label="Challenges" value={stats.challenges} />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border-2 border-mutedGold bg-paleCream shadow-subtle">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center min-h-10 px-3.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? "bg-vermilion text-cream shadow-subtle"
                    : "bg-cream text-ink-secondary border border-mutedGold hover:bg-paleCream hover:text-darkRed"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-darkRed"
            />
            <input
              type="text"
              placeholder="Search projects, teams, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-10 pl-9 pr-4 py-2 text-xs rounded-lg border border-mutedGold bg-cream text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        {filtered.length === 0 ? (
          <div className="p-10 rounded-card border-2 border-mutedGold bg-paleCream text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cream border-2 border-mutedGold flex items-center justify-center text-vermilion mx-auto">
              <Sparkles size={26} />
            </div>
            <h2 className="font-editorial text-2xl text-ink font-bold">
              {projects.length === 0 ? "Showcase is warming up" : "No projects match"}
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 max-w-md mx-auto leading-relaxed">
              {projects.length === 0
                ? "Projects appear here as soon as teams finalize their submissions. Check back after the submission deadline."
                : "Try a different category or clear the search to see more projects."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors shadow-subtle"
              >
                <span>Browse Challenges</span>
                <ArrowRight size={13} className="text-accentGold" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between p-6 rounded-card border-2 border-mutedGold bg-paleCream hover:border-vermilion hover:shadow-elevated transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <ChallengeMotif category={project.challengeCategory} size={52} />
                    <div className="flex items-center gap-2">
                      {project.challengeCode && (
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cream text-darkRed border border-mutedGold">
                          {project.challengeCode}
                        </span>
                      )}
                      <button
                        onClick={() => toggleLike(project)}
                        disabled={likeBusy === project.id}
                        aria-label={project.liked ? "Unlike project" : "Like project"}
                        aria-pressed={project.liked}
                        className={`group/like inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-full border text-xs font-bold transition-all active:scale-95 disabled:opacity-60 ${
                          project.liked
                            ? "border-vermilion bg-vermilion text-cream shadow-subtle"
                            : "border-mutedGold bg-cream text-ink-secondary hover:border-vermilion hover:text-vermilion"
                        }`}
                      >
                        <Heart
                          size={13}
                          className={`transition-transform ${
                            project.liked ? "fill-cream text-cream" : "group-hover/like:scale-110"
                          }`}
                        />
                        <span className="font-mono tabular-nums">{project.likeCount}</span>
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-vermilion font-bold">
                    {project.challengeCategory || "Project"}
                  </span>

                  <h3 className="text-lg font-bold text-darkRed mt-2 group-hover:text-vermilion transition-colors line-clamp-2 leading-snug">
                    {project.projectTitle}
                  </h3>

                  <div className="text-[11px] font-mono text-ink/70 mt-1.5">
                    {project.teamName}
                    {project.members.length > 0 && (
                      <span className="text-ink/50"> · {project.members.join(" & ")}</span>
                    )}
                  </div>

                  <p className="text-xs text-ink-secondary mt-3 line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.techStack.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-cream border border-mutedGold/60 text-darkRed font-mono text-[10px] font-bold"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-0.5 rounded bg-cream border border-mutedGold/60 text-ink/60 font-mono text-[10px] font-bold">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-mutedGold/60 flex items-center gap-2">
                  <button
                    onClick={() => setSelected(project)}
                    className="flex-1 py-2.5 rounded-xl bg-cream hover:bg-vermilion hover:text-cream text-xs font-bold uppercase tracking-wider text-darkRed transition-colors flex items-center justify-center gap-1.5 border border-mutedGold"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} className="text-accentGold" />
                  </button>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub repository"
                    className="p-2.5 rounded-xl border border-mutedGold bg-cream text-darkRed hover:bg-vermilion hover:text-cream transition-colors"
                  >
                    <Github size={14} />
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live demo"
                      className="p-2.5 rounded-xl border border-mutedGold bg-cream text-darkRed hover:bg-vermilion hover:text-cream transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="p-8 rounded-card border-2 border-vermilion bg-cream shadow-poster flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-darkRed font-display">
              Think your idea belongs up here?
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Form your two-member team, pick a challenge, and ship it before the deadline.
            </p>
          </div>
          <Link
            href="/challenges"
            className="px-6 py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors inline-flex items-center gap-2 shadow-subtle flex-shrink-0"
          >
            <span>Pick a Challenge</span>
            <ArrowRight size={14} className="text-accentGold" />
          </Link>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col bg-paleCream rounded-2xl border-2 border-mutedGold/70 shadow-elevated overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-mutedGold/50 p-6 pb-4 sm:px-8 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-vermilion uppercase font-bold tracking-wider">
                  {selected.challengeCode ? `${selected.challengeCode} // ` : ""}
                  {selected.challengeCategory}
                </span>
                <h2 className="font-editorial text-2xl font-bold text-ink mt-0.5">
                  {selected.projectTitle}
                </h2>
                <div className="text-xs text-ink/80 mt-0.5">
                  Team: <strong>{selected.teamName}</strong>
                  {selected.members.length > 0 && (
                    <span className="text-ink/60"> — {selected.members.join(", ")}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2.5 rounded-xl text-ink/60 hover:text-vermilion hover:bg-cream"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs p-6 sm:px-8 overflow-y-auto overscroll-contain flex-1 min-h-0">
              <div>
                <span className="text-ink/60 font-mono uppercase text-[10px] font-bold">
                  Challenge Track:
                </span>
                <p className="font-bold text-ink mt-0.5">{selected.challengeTitle}</p>
              </div>

              <div>
                <span className="text-ink/60 font-mono uppercase text-[10px] font-bold">
                  Abstract:
                </span>
                <p className="text-ink/80 mt-0.5 leading-relaxed">
                  {selected.shortDescription}
                </p>
              </div>

              <div>
                <span className="text-ink/60 font-mono uppercase text-[10px] font-bold">
                  Proposed Solution:
                </span>
                <p className="text-ink/80 mt-0.5 leading-relaxed">
                  {selected.proposedSolution}
                </p>
              </div>

              {selected.keyFeatures.length > 0 && (
                <div>
                  <span className="text-ink/60 font-mono uppercase text-[10px] font-bold">
                    Key Features:
                  </span>
                  <ul className="mt-1.5 space-y-1 text-ink/80">
                    {selected.keyFeatures.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-ink/60 font-mono uppercase text-[10px] font-bold">
                  Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selected.techStack.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-cream border border-mutedGold/60 text-darkRed font-mono text-[10px] font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-ink/60 font-mono uppercase text-[10px] font-bold">
                  Cultural Innovation & Impact:
                </span>
                <p className="text-ink/80 mt-0.5 leading-relaxed">
                  {selected.innovationAndImpact}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-mutedGold/60 bg-cream/80 flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => toggleLike(selected)}
                  disabled={likeBusy === selected.id}
                  aria-pressed={selected.liked}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-colors disabled:opacity-60 ${
                    selected.liked
                      ? "bg-vermilion text-cream"
                      : "border border-mutedGold bg-paleCream text-darkRed hover:bg-cream"
                  }`}
                >
                  <Heart size={13} className={selected.liked ? "fill-cream" : ""} />
                  <span>{selected.liked ? "Liked" : "Like"} · {selected.likeCount}</span>
                </button>
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-darkRed text-cream text-[11px] font-bold hover:bg-vermilion transition-colors"
                >
                  <Github size={13} />
                  <span>GitHub Repository</span>
                </a>
                {selected.liveUrl && (
                  <a
                    href={selected.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-mutedGold bg-cream text-darkRed text-[11px] font-bold hover:bg-paleCream transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 border-mutedGold bg-paleCream shadow-subtle">
      <span className="w-8 h-8 rounded-lg bg-cream border border-mutedGold flex items-center justify-center text-vermilion">
        {icon}
      </span>
      <span className="leading-none">
        <span className="block font-editorial text-lg font-bold text-ink">{value}</span>
        <span className="block text-[10px] font-mono uppercase tracking-wider text-ink/60">
          {label}
        </span>
      </span>
    </div>
  );
}
