"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  FolderKanban,
  FileCode,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((data) => setOverviewData(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !overviewData) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink/70">Loading administrative metrics...</p>
      </div>
    );
  }

  const { stats, challengeStats, recentActivity, settings } = overviewData;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-vermilion uppercase font-bold">
            Live Hackathon Control
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">Administrative Command Center</h1>
          <p className="text-xs text-ink/80 mt-0.5">
            DELTA Hackathon Operations // Department of CSE (Data Science), Christ College of Engineering
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3.5 py-1.5 rounded-xl bg-cream border border-mutedGold/70 text-darkRed font-bold">
            Deadline: 8 Nov 2026, 11:59 PM IST
          </span>
        </div>
      </div>

      {/* 6 Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-mutedGold/60 bg-paleCream/90 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-ink/60 font-semibold">Participants</span>
          <div className="text-3xl font-bold text-ink mt-1 font-editorial">{stats.totalParticipants}</div>
          <span className="text-[10px] text-ink/70">Registered students</span>
        </div>

        <div className="p-4 rounded-xl border border-mutedGold/60 bg-paleCream/90 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-ink/60 font-semibold">Total Teams</span>
          <div className="text-3xl font-bold text-ink mt-1 font-editorial">{stats.totalTeams}</div>
          <span className="text-[10px] text-ink/70">Created entities</span>
        </div>

        <div className="p-4 rounded-xl border-2 border-mutedGold/80 bg-cream/90 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-darkRed font-bold">Complete</span>
          <div className="text-3xl font-bold text-darkRed mt-1 font-editorial">{stats.completeTeams}</div>
          <span className="text-[10px] text-ink/70">Exactly 2 members</span>
        </div>

        <div className="p-4 rounded-xl border border-mutedGold/60 bg-paleCream/90 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-secondaryRed font-bold">Incomplete</span>
          <div className="text-3xl font-bold text-secondaryRed mt-1 font-editorial">{stats.incompleteTeams}</div>
          <span className="text-[10px] text-ink/70">Only 1 member</span>
        </div>

        <div className="p-4 rounded-xl border border-mutedGold/60 bg-paleCream/90 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-ink/70 font-bold">Drafts</span>
          <div className="text-3xl font-bold text-ink mt-1 font-editorial">{stats.draftSubmissions}</div>
          <span className="text-[10px] text-ink/70">Unfinished drafts</span>
        </div>

        <div className="p-4 rounded-xl border-2 border-vermilion/50 bg-vermilion/10 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-vermilion font-bold">Finalized</span>
          <div className="text-3xl font-bold text-vermilion mt-1 font-editorial">{stats.finalSubmissions}</div>
          <span className="text-[10px] text-ink/70">Locked submissions</span>
        </div>
      </div>

      {/* Challenge Breakdown & Audit Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Challenge Distribution (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-mutedGold/50 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
              Submissions by Problem Statement
            </h2>
            <Link href="/challenges" className="text-xs text-vermilion hover:underline font-bold">
              View Challenges
            </Link>
          </div>

          <div className="space-y-3">
            {challengeStats.map((item: any) => (
              <div key={item.challengeId} className="p-3.5 rounded-xl border border-mutedGold/50 bg-cream/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-vermilion">{item.code}</span>
                    <span className="text-xs font-bold text-ink line-clamp-1">{item.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-darkRed flex-shrink-0">
                    {item.count} Teams
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink/70 font-mono">
                  <span>Category: {item.category}</span>
                  <span className="font-bold text-vermilion">{item.finalCount} Final Locked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Administrative Activity Log (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-mutedGold/50 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
              System Audit Trail
            </h2>
            <span className="text-[11px] font-mono text-ink/60 font-medium">Server Audited</span>
          </div>

          <div className="space-y-3">
            {recentActivity.map((log: any) => (
              <div key={log.id} className="p-3 rounded-xl border border-mutedGold/40 bg-cream/70 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-ink/60">
                  <span className="text-vermilion font-bold">{log.action}</span>
                  <span>
                    {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="font-bold text-ink">{log.actorName}</div>
                <p className="text-[11px] text-ink/80 leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
