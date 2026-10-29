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
        <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink-muted">Loading administrative metrics...</p>
      </div>
    );
  }

  const { stats, challengeStats, recentActivity, settings } = overviewData;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-card border border-border bg-white shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Administrative Command Center</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            DELTA Hackathon Operations // Christ College of Engineering (Autonomous)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-ivory-200 border border-border text-ink">
            Deadline: 8 Nov 2026, 11:59 PM IST
          </span>
        </div>
      </div>

      {/* 6 Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-border bg-white shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-muted">Participants</span>
          <div className="text-2xl font-bold text-ink mt-1">{stats.totalParticipants}</div>
          <span className="text-[10px] text-ink-secondary">Registered students</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-white shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-ink-muted">Total Teams</span>
          <div className="text-2xl font-bold text-ink mt-1">{stats.totalTeams}</div>
          <span className="text-[10px] text-ink-secondary">Created entities</span>
        </div>

        <div className="p-4 rounded-xl border border-sage-200 bg-sage-50/50 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-status-success font-semibold">Complete</span>
          <div className="text-2xl font-bold text-status-success mt-1">{stats.completeTeams}</div>
          <span className="text-[10px] text-ink-secondary">Exactly 2 members</span>
        </div>

        <div className="p-4 rounded-xl border border-saffron-200 bg-saffron-50/50 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-saffron-700 font-semibold">Incomplete</span>
          <div className="text-2xl font-bold text-saffron-700 mt-1">{stats.incompleteTeams}</div>
          <span className="text-[10px] text-ink-secondary">Only 1 member</span>
        </div>

        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-indigo font-semibold">Drafts</span>
          <div className="text-2xl font-bold text-indigo mt-1">{stats.draftSubmissions}</div>
          <span className="text-[10px] text-ink-secondary">Unfinished drafts</span>
        </div>

        <div className="p-4 rounded-xl border border-terracotta-200 bg-terracotta-50/50 shadow-subtle">
          <span className="text-[10px] font-mono uppercase text-terracotta font-semibold">Finalized</span>
          <div className="text-2xl font-bold text-terracotta mt-1">{stats.finalSubmissions}</div>
          <span className="text-[10px] text-ink-secondary">Locked submissions</span>
        </div>
      </div>

      {/* Challenge Breakdown & Audit Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Challenge Distribution (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
              Submissions by Problem Statement
            </h2>
            <Link href="/challenges" className="text-xs text-terracotta hover:underline font-medium">
              View Challenges
            </Link>
          </div>

          <div className="space-y-3">
            {challengeStats.map((item: any) => (
              <div key={item.challengeId} className="p-3.5 rounded-xl border border-border bg-ivory-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-terracotta">{item.code}</span>
                    <span className="text-xs font-bold text-ink line-clamp-1">{item.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-ink flex-shrink-0">
                    {item.count} Teams
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>Category: {item.category}</span>
                  <span>{item.finalCount} Final Locked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Administrative Activity Log (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
              Recent System Audit Log
            </h2>
            <span className="text-[11px] font-mono text-ink-muted">Server Audited</span>
          </div>

          <div className="space-y-3">
            {recentActivity.map((log: any) => (
              <div key={log.id} className="p-3 rounded-lg border border-border/60 bg-ivory-50 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span className="text-terracotta font-semibold">{log.action}</span>
                  <span>
                    {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="font-semibold text-ink">{log.actorName}</div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

