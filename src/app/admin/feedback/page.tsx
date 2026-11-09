"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MessageSquareHeart, Search, Users } from "lucide-react";
import { FEEDBACK_SECTIONS, FeedbackQuestion } from "@/lib/feedback-questions";

const SCALE_LABELS = ["Poor", "Satisfactory", "Good", "Very Good", "Excellent"];

type FeedbackResponse = {
  id: string;
  userId: string;
  name: string;
  email: string;
  teamName: string;
  answers: Record<string, string | number>;
  questionSetVersion: string;
  submittedAt: string;
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function renderAnswer(q: FeedbackQuestion, value: string | number | undefined) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return <span className="text-ink/40">Not answered</span>;
  }
  if (q.type === "rating") {
    const max = q.max || 5;
    const label = SCALE_LABELS[Number(value) - 1];
    return (
      <span className="font-mono font-bold text-darkRed">
        {value} / {max}
        {label ? ` · ${label}` : ""}
      </span>
    );
  }
  return <span className="text-ink">{String(value)}</span>;
}

export default function AdminFeedbackPage() {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/feedback");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load feedback.");
        setResponses(data.responses || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return responses;
    return responses.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.teamName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }, [responses, query]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink/70">Loading feedback responses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-editorial text-2xl font-bold text-ink">Participant Feedback</h1>
          <p className="text-xs text-ink/80 mt-0.5">
            Responses submitted before certificate access. One entry per participant.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 min-h-10 rounded-xl bg-accentGold/20 border border-accentGold/50 text-darkRed text-xs font-mono font-bold">
          <Users size={14} className="text-vermilion" />
          {responses.length} response{responses.length === 1 ? "" : "s"}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border-2 border-vermilion/50 bg-vermilion/10 text-xs font-bold text-vermilion">
          {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-darkRed" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by participant, team or email..."
          className="w-full min-h-10 pl-9 pr-4 py-2 text-xs rounded-xl border border-mutedGold bg-paleCream text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 text-center space-y-3">
          <MessageSquareHeart size={28} className="text-vermilion mx-auto" />
          <p className="text-xs font-mono text-ink/70">
            {responses.length === 0 ? "No feedback submitted yet." : "No responses match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-mutedGold/60 pb-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink truncate">{r.name}</div>
                  <div className="text-[11px] font-mono text-ink/60 truncate">
                    {r.teamName} • {r.email}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-darkRed shrink-0">{formatDate(r.submittedAt)}</div>
              </div>

              {FEEDBACK_SECTIONS.map((section) => (
                <div key={section.id} className="space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-vermilion border-b border-mutedGold/40 pb-1">
                    {section.title}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {section.questions.map((q, i) => (
                      <div key={q.id} className="space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-darkRed">
                          {section.numbered ? `${String(i + 1).padStart(2, "0")} · ` : ""}
                          {q.label}
                        </div>
                        <div className="text-xs leading-relaxed break-words">
                          {renderAnswer(q, r.answers?.[q.id])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
