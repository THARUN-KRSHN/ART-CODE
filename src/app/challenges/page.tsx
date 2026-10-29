"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import { ProblemStatement } from "@/types";
import { ArrowRight, Search, Filter } from "lucide-react";

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [challenges, setChallenges] = useState<ProblemStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => setChallenges(data.challenges || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(challenges.map((c) => c.category)));
    return ["All", ...cats];
  }, [challenges]);

  const filtered = challenges.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cream text-ink py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header (Panel 06 Style) */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold">
            <RhombusMotif size={14} />
            <span>Problem Statements // ART//CODE 2026</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-darkRed leading-tight">
            Problem Statements & Cultural Domains
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            Explore diverse challenges inspired by art, culture, heritage, and creative technology. Choose a challenge for your two-member team.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border-2 border-mutedGold bg-paleCream shadow-subtle">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? "bg-vermilion text-cream shadow-subtle"
                    : "bg-cream text-ink-secondary border border-mutedGold hover:bg-paleCream hover:text-darkRed"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-darkRed" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-mutedGold bg-cream text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
            />
          </div>
        </div>

        {/* Challenge Cards Grid (Panel 06 Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((challenge) => (
            <div
              key={challenge.id}
              className="group flex flex-col justify-between p-6 rounded-card border-2 border-mutedGold bg-paleCream hover:border-vermilion hover:shadow-elevated transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <ChallengeMotif category={challenge.category} size={52} />
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cream text-darkRed border border-mutedGold">
                    {challenge.code}
                  </span>
                </div>

                <span className="text-[11px] font-mono uppercase tracking-wider text-vermilion font-bold">
                  {challenge.category}
                </span>

                <h3 className="text-lg font-bold text-darkRed mt-2 group-hover:text-vermilion transition-colors line-clamp-2 leading-snug">
                  {challenge.title}
                </h3>

                <p className="text-xs text-ink-secondary mt-3 line-clamp-3 leading-relaxed">
                  {challenge.shortDescription}
                </p>

                <div className="mt-4 pt-4 border-t border-mutedGold/60">
                  <div className="text-[10px] font-mono text-darkRed uppercase tracking-wider font-bold">
                    Core Objectives:
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-ink-secondary">
                    {challenge.objectives.slice(0, 2).map((obj, idx) => (
                      <li key={idx} className="line-clamp-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-vermilion flex-shrink-0" />
                        <span className="truncate">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-mutedGold/60">
                <Link
                  href={`/challenges/${challenge.slug}`}
                  className="w-full text-center py-2.5 rounded-xl bg-cream hover:bg-vermilion hover:text-cream text-xs font-bold uppercase tracking-wider text-darkRed transition-colors flex items-center justify-center gap-1.5 border border-mutedGold"
                >
                  <span>View Details</span>
                  <ArrowRight size={13} className="text-accentGold" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Registration CTA (Section 4 Rule) */}
        <div className="p-8 rounded-card border-2 border-vermilion bg-cream shadow-poster flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-darkRed font-display">
              Found your challenge? Bring your idea to life.
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Form your two-member team and register for ART//CODE 2026.
            </p>
          </div>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors inline-flex items-center gap-2 shadow-subtle flex-shrink-0"
          >
            <span>Register Now</span>
            <ArrowRight size={14} className="text-accentGold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
