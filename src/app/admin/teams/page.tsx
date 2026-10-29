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
        <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink/70">Loading team roster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-bold text-ink">Team Management</h1>
          <p className="text-xs text-ink/80 mt-0.5">
            Total {teams.length} teams registered (Rule: exactly 2 members per team required)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedGold" />
          <input
            type="text"
            placeholder="Search by team name, code, or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter size={14} className="text-mutedGold" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream font-medium"
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
          <div key={t.id} className="p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm space-y-4 hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between gap-2 border-b border-mutedGold/40 pb-3">
              <div>
                <h3 className="text-lg font-bold text-ink">{t.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono font-bold text-darkRed bg-cream px-2.5 py-0.5 rounded-lg border border-mutedGold/60">
                    Code: {t.invitationCode}
                  </span>
                  <button
                    onClick={() => handleCopy(t.invitationCode)}
                    className="p-1 rounded text-ink/60 hover:text-vermilion"
                    title="Copy invite code"
                  >
                    {copiedCode === t.invitationCode ? <Check size={13} className="text-darkRed" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
              <StatusBadge status={t.status} />
            </div>

            {/* Track Info */}
            <div className="text-xs">
              <span className="text-ink/60 font-mono uppercase text-[10px] font-semibold">Assigned Challenge:</span>
              <div className="font-bold text-ink line-clamp-1 mt-0.5">
                {t.challengeTitle}
              </div>
            </div>

            {/* Members */}
            <div className="space-y-2 pt-2 border-t border-mutedGold/30">
              <span className="text-[10px] font-mono uppercase text-ink/60 font-semibold">
                Members ({t.members.length}/2):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {t.members.map((m: any) => (
                  <div key={m.userId} className="p-2.5 rounded-xl bg-cream/80 border border-mutedGold/50 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink truncate">{m.name}</span>
                      <span className="text-[9px] font-mono uppercase text-vermilion font-bold">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink/70 truncate">{m.email}</div>
                  </div>
                ))}
                {t.members.length < 2 && (
                  <div className="p-2.5 rounded-xl border border-dashed border-mutedGold/80 bg-cream/30 text-ink/60 text-center flex items-center justify-center text-[11px] italic">
                    Waiting for Teammate
                  </div>
                )}
              </div>
            </div>

            {/* Submission Status Footer */}
            <div className="pt-3 border-t border-mutedGold/30 flex items-center justify-between text-xs">
              <span className="text-ink/70">
                Submission: <strong className="text-ink font-bold">{t.submissionStatus}</strong>
              </span>
              {t.submissionRef && (
                <span className="font-mono text-[11px] text-vermilion font-bold">
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
