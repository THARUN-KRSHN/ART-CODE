"use client";

import React, { useState, useEffect } from "react";
import { Team } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Search, Filter, Users, Shield, Copy, Check } from "lucide-react";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data.teams || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.invitationCode.toLowerCase().includes(search.toLowerCase()) ||
      t.members.some((m: any) => m.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink-muted">Loading team roster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Team Management</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Total {teams.length} teams registered (Limit: exactly 2 members per team)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl border border-border bg-white shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search by team name, code, or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter size={14} className="text-ink-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink focus:bg-white"
          >
            <option value="all">All Statuses ({teams.length})</option>
            <option value="complete">Complete (2 Members)</option>
            <option value="incomplete">Incomplete (1 Member)</option>
          </select>
        </div>
      </div>

      {/* Teams Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((t) => (
          <div key={t.id} className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-border/80 pb-3">
              <div>
                <h3 className="text-lg font-bold text-ink">{t.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono font-bold text-ink bg-ivory-200 px-2 py-0.5 rounded border border-border">
                    Code: {t.invitationCode}
                  </span>
                  <button
                    onClick={() => handleCopy(t.invitationCode)}
                    className="p-1 rounded text-ink-muted hover:text-ink"
                    title="Copy invite code"
                  >
                    {copiedCode === t.invitationCode ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
              <StatusBadge status={t.status} />
            </div>

            {/* Track Info */}
            <div className="text-xs">
              <span className="text-ink-muted font-mono uppercase text-[10px]">Assigned Challenge:</span>
              <div className="font-semibold text-ink line-clamp-1 mt-0.5">
                {t.challengeTitle}
              </div>
            </div>

            {/* Members */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-[10px] font-mono uppercase text-ink-muted">
                Members ({t.members.length}/2):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {t.members.map((m: any) => (
                  <div key={m.userId} className="p-2.5 rounded-lg bg-ivory-50 border border-border space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink truncate">{m.name}</span>
                      <span className="text-[9px] font-mono uppercase text-terracotta font-semibold">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-secondary truncate">{m.email}</div>
                  </div>
                ))}
                {t.members.length < 2 && (
                  <div className="p-2.5 rounded-lg border border-dashed border-border bg-white text-ink-muted text-center flex items-center justify-center text-[11px]">
                    Waiting for Teammate
                  </div>
                )}
              </div>
            </div>

            {/* Submission Status Footer */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-secondary">
                Submission: <strong className="text-ink">{t.submissionStatus}</strong>
              </span>
              {t.submissionRef && (
                <span className="font-mono text-[11px] text-terracotta font-bold">
                  Ref: {t.submissionRef}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

