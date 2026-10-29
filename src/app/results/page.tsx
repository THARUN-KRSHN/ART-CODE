"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventSettings, WinnerResult } from "@/types";
import { Award, Clock, ArrowLeft, Sparkles, Trophy } from "lucide-react";

export default function ResultsPage() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const mockWinners: WinnerResult[] = [
    {
      rank: 1,
      prizeAmount: "₹1,500",
      teamName: "Team KalaKriti",
      projectTitle: "ChitraPunar: Neural Fresco Inpainting with Mineral Pigment Physics",
      challengeTitle: "Living Archives: Generative AI for Indigenous Mural & Fresco Restoration",
      members: ["Ananya Nair (Leader)", "Rohan Varma (Teammate)"],
      institution: "Christ College of Engineering, Irinjalakuda",
      score: 96.5,
    },
    {
      rank: 2,
      prizeAmount: "₹1,000",
      teamName: "Team MudraTech",
      projectTitle: "KathakaliVision: Real-time Samyutta Hasta Pose Synthesis",
      challengeTitle: "Symphony of Mudras: Real-time Computer Vision for Classical Dance Synthesis",
      members: ["Aditi Menon", "Devika N."],
      institution: "Christ College of Engineering, Irinjalakuda",
      score: 92.0,
    },
    {
      rank: 3,
      prizeAmount: "₹500",
      teamName: "Team Tantu",
      projectTitle: "KasavuMatrix: Algorithmic Cellular Automata Handloom Weaver Assistant",
      challengeTitle: "Woven Geometry: Algorithmic Loom & Pattern Synthesis for Traditional Handloom",
      members: ["Vivek Nair", "Kavya Krishnan"],
      institution: "Christ College of Engineering, Irinjalakuda",
      score: 89.5,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading results status...</p>
        </div>
      </div>
    );
  }

  // If results not yet officially published
  if (!settings?.resultsPublished) {
    return (
      <div className="min-h-screen bg-ivory py-16 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 sm:p-12 rounded-card border border-border shadow-elevated text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-ivory-200 border border-border flex items-center justify-center text-terracotta mx-auto">
            <Clock size={28} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
              Evaluation in Progress
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink">
              Results Pending Publication
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Submissions are currently under evaluation by the DELTA faculty and peer review committee. Official results will be unveiled following deliberation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-ivory-50 text-xs text-ink-secondary inline-block font-mono">
            Scheduled Announcement: <strong>14 November 2026</strong> (06:00 PM IST)
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white text-xs font-semibold"
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
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono tracking-widest text-terracotta uppercase">
            Official Winner Registry // ART//CODE 2026
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-ink">
            Honouring Computational Craftsmanship
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            Congratulations to all participating teams. The organising committee and faculty judges have finalized scores based on our 100-point rubric.
          </p>
        </div>

        {/* 3 Winning Teams Podium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {/* 2nd Place */}
          <div className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 text-center order-2 md:order-1">
            <span className="text-xs font-mono font-bold uppercase text-ink-muted">
              2nd Place // Silver Citation
            </span>
            <div className="font-editorial text-4xl font-bold text-ink">
              {mockWinners[1].prizeAmount}
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-bold text-ink">{mockWinners[1].teamName}</h3>
              <p className="text-xs text-terracotta font-medium mt-1">
                {mockWinners[1].projectTitle}
              </p>
              <div className="text-[11px] text-ink-muted mt-2">
                {mockWinners[1].members.join(", ")}
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="p-10 rounded-card border-2 border-terracotta bg-white shadow-elevated space-y-5 text-center order-1 md:order-2 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-ink text-white text-[10px] font-mono uppercase tracking-widest font-bold">
              Grand Winner
            </div>
            <span className="text-xs font-mono font-bold uppercase text-terracotta">
              1st Place // Gold Citation
            </span>
            <div className="font-editorial text-5xl font-bold text-terracotta">
              {mockWinners[0].prizeAmount}
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-xl font-bold text-ink">{mockWinners[0].teamName}</h3>
              <p className="text-xs text-terracotta font-semibold mt-1">
                {mockWinners[0].projectTitle}
              </p>
              <div className="text-[11px] text-ink-muted mt-2">
                {mockWinners[0].members.join(", ")}
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 text-center order-3">
            <span className="text-xs font-mono font-bold uppercase text-ink-muted">
              3rd Place // Bronze Citation
            </span>
            <div className="font-editorial text-4xl font-bold text-ink">
              {mockWinners[2].prizeAmount}
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-bold text-ink">{mockWinners[2].teamName}</h3>
              <p className="text-xs text-terracotta font-medium mt-1">
                {mockWinners[2].projectTitle}
              </p>
              <div className="text-[11px] text-ink-muted mt-2">
                {mockWinners[2].members.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

