"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventSettings, WinnerResult } from "@/types";
import { CulturalDivider } from "@/components/art/CulturalMotifs";
import { Award, Clock, ArrowLeft, Sparkles, Trophy, Medal } from "lucide-react";

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
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink/70">Loading results status...</p>
        </div>
      </div>
    );
  }

  // If results not yet officially published
  if (!settings?.resultsPublished) {
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
              Submissions are currently under rigorous assessment by the DELTA faculty and peer review committee against our 100-point rubric. Official results will be unveiled following deliberation.
            </p>
          </div>

          <div className="p-4 rounded-xl border-2 border-mutedGold/50 bg-cream text-xs text-darkRed inline-block font-mono font-semibold">
            Scheduled Announcement: <strong>14 November 2026</strong> (06:00 PM IST)
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
    <div className="min-h-screen bg-cream bg-mandala-grid py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono tracking-widest text-vermilion uppercase font-bold">
            Official Winner Registry // ART//CODE 2026
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-ink font-bold">
            Prizes & Merit Awards
          </h1>
          <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">
            Total prize pool of ₹3,000 along with participation certificates. Honouring computational craftsmanship and cultural innovation.
          </p>
        </div>

        <CulturalDivider />

        {/* 3 Winning Teams Podium Grid - Panel 09 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {/* 2nd Place */}
          <div className="p-8 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/90 shadow-sm space-y-4 text-center order-2 md:order-1 hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-full bg-cream border border-mutedGold mx-auto flex items-center justify-center text-darkRed">
              <Medal size={24} />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink/70 block">
              2nd Place // Silver Merit
            </span>
            <div className="font-editorial text-4xl font-bold text-ink">
              {mockWinners[1].prizeAmount}
            </div>
            <div className="border-t border-mutedGold/40 pt-4 space-y-1">
              <h3 className="text-base font-bold text-ink">{mockWinners[1].teamName}</h3>
              <p className="text-xs text-vermilion font-bold">
                {mockWinners[1].projectTitle}
              </p>
              <div className="text-[11px] text-ink/60 pt-2 font-mono">
                {mockWinners[1].members.join(", ")}
              </div>
              <div className="text-[10px] text-ink/50 pt-1">
                Score: {mockWinners[1].score} / 100
              </div>
            </div>
          </div>

          {/* 1st Place (Center Podium, elevated, Vermilion & Gold) */}
          <div className="p-10 rounded-2xl border-2 border-vermilion bg-paleCream shadow-elevated space-y-5 text-center order-1 md:order-2 relative -translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-vermilion text-cream text-[10px] font-mono uppercase tracking-widest font-bold shadow-sm">
              ★ Grand Winner ★
            </div>
            <div className="w-16 h-16 rounded-full bg-accentGold/20 border-2 border-accentGold mx-auto flex items-center justify-center text-vermilion shadow-sm">
              <Trophy size={32} />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-vermilion block">
              1st Place // Gold Citation
            </span>
            <div className="font-editorial text-5xl font-bold text-vermilion">
              {mockWinners[0].prizeAmount}
            </div>
            <div className="border-t border-vermilion/30 pt-4 space-y-1">
              <h3 className="text-xl font-bold text-ink">{mockWinners[0].teamName}</h3>
              <p className="text-xs text-vermilion font-bold leading-relaxed">
                {mockWinners[0].projectTitle}
              </p>
              <div className="text-[11px] text-ink/70 pt-2 font-mono font-medium">
                {mockWinners[0].members.join(", ")}
              </div>
              <div className="text-[10px] text-darkRed font-mono font-bold pt-1">
                Score: {mockWinners[0].score} / 100 • Gold Citation & Certificate
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="p-8 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/90 shadow-sm space-y-4 text-center order-3 hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-full bg-cream border border-mutedGold mx-auto flex items-center justify-center text-darkRed">
              <Medal size={24} />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink/70 block">
              3rd Place // Bronze Merit
            </span>
            <div className="font-editorial text-4xl font-bold text-ink">
              {mockWinners[2].prizeAmount}
            </div>
            <div className="border-t border-mutedGold/40 pt-4 space-y-1">
              <h3 className="text-base font-bold text-ink">{mockWinners[2].teamName}</h3>
              <p className="text-xs text-vermilion font-bold">
                {mockWinners[2].projectTitle}
              </p>
              <div className="text-[11px] text-ink/60 pt-2 font-mono">
                {mockWinners[2].members.join(", ")}
              </div>
              <div className="text-[10px] text-ink/50 pt-1">
                Score: {mockWinners[2].score} / 100
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
