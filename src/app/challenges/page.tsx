"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import { getChallenges } from "@/lib/store";
import { ProblemStatement, ChallengeCategory } from "@/types";
import { ArrowRight, Filter, Sparkles, BookOpen } from "lucide-react";

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // In Next.js client component, we can fetch from API or initialize
  const [challenges, setChallenges] = useState<ProblemStatement[]>([]);

  React.useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => setChallenges(data.challenges || []))
      .catch((err) => console.error(err));
  }, []);

  const categories = ["All", "Heritage & AI", "Performing Arts & Tech", "Indigenous Calligraphy", "Digital Craftsmanship", "Interactive Exhibitions"];

  const filtered = challenges.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono tracking-widest text-indigo uppercase">
            Curated Themes // ART//CODE 2026
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-ink leading-tight">
            Problem Statements & Cultural Domains
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            Each challenge addresses an authentic cultural preservation or creative technology dilemma. Examine the objectives, technical constraints, and expected outcomes before selecting a track for your team.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-white shadow-subtle">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-ink-muted mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-ink text-white font-semibold"
                    : "bg-ivory-100 text-ink-secondary hover:bg-ivory-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-border bg-ivory-50 text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
            />
          </div>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((challenge) => (
            <div
              key={challenge.id}
              className="group flex flex-col justify-between p-6 rounded-card border border-border bg-white hover:border-terracotta hover:shadow-elevated transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <ChallengeMotif
                    category={challenge.category}
                    accent={challenge.accentColor}
                    size={52}
                  />
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-ivory-200 text-ink border border-border">
                    {challenge.code}
                  </span>
                </div>

                <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta font-semibold">
                  {challenge.category}
                </span>

                <h3 className="text-lg font-bold text-ink mt-2 group-hover:text-terracotta transition-colors line-clamp-2 leading-snug">
                  {challenge.title}
                </h3>

                <p className="text-xs text-ink-secondary mt-3 line-clamp-3 leading-relaxed">
                  {challenge.shortDescription}
                </p>

                <div className="mt-4 pt-4 border-t border-border/60">
                  <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                    Core Focus:
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-ink-secondary">
                    {challenge.objectives.slice(0, 2).map((obj, idx) => (
                      <li key={idx} className="line-clamp-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                        <span className="truncate">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                <Link
                  href={`/challenges/${challenge.slug}`}
                  className="w-full text-center py-2 rounded-lg bg-ivory-100 hover:bg-terracotta hover:text-white text-xs font-semibold text-ink transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Complete Details</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

