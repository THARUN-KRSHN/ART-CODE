"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, MessageSquareHeart, Search, Star, Users } from "lucide-react";
import {
  FEEDBACK_QUESTIONS,
  FEEDBACK_SECTIONS,
  FeedbackQuestion,
  FUTURE_OPTIONS,
} from "@/lib/feedback-questions";

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

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="p-4 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95">
      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-darkRed">{label}</div>
      <div className="mt-1 font-editorial text-2xl font-bold text-ink leading-tight">{value}</div>
      {hint && <div className="text-[11px] text-ink/60 mt-0.5">{hint}</div>}
    </div>
  );
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

  const summary = useMemo(() => {
    const ratingQuestions = FEEDBACK_QUESTIONS.filter((q) => q.type === "rating");
    const ratings = ratingQuestions.map((q) => {
      const values = responses
        .map((r) => Number(r.answers?.[q.id]))
        .filter((v) => Number.isFinite(v) && v >= 1);
      const count = values.length;
      const avg = count ? values.reduce((a, b) => a + b, 0) / count : 0;
      return { question: q, avg, count };
    });

    const allValues = responses.flatMap((r) =>
      ratingQuestions
        .map((q) => Number(r.answers?.[q.id]))
        .filter((v) => Number.isFinite(v) && v >= 1)
    );
    const overallAvg = allValues.length ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
    const overallFavorable = allValues.length
      ? (allValues.filter((v) => v >= 4).length / allValues.length) * 100
      : 0;

    const futureOptions = FEEDBACK_QUESTIONS.find((q) => q.id === "q_future")?.options || FUTURE_OPTIONS;
    const futureCounts = futureOptions.map((label) => ({
      label,
      count: responses.filter((r) => r.answers?.q_future === label).length,
    }));
    const futureTotal = futureCounts.reduce((a, b) => a + b.count, 0);
    const futurePositive = futureCounts
      .filter((f) => f.label === "Definitely Yes" || f.label === "Probably Yes")
      .reduce((a, b) => a + b.count, 0);

    const teams = new Set(responses.map((r) => r.teamName).filter((t) => t && t !== "—")).size;

    return { ratings, overallAvg, overallFavorable, futureCounts, futureTotal, futurePositive, teams };
  }, [responses]);

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

      {responses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-darkRed">
            <BarChart3 size={15} className="text-vermilion" />
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest">Summary</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile
              label="Responses"
              value={String(responses.length)}
              hint={`${summary.teams} team${summary.teams === 1 ? "" : "s"}`}
            />
            <StatTile
              label="Average rating"
              value={`${summary.overallAvg.toFixed(1)} / 5`}
              hint="Across all rating questions"
            />
            <StatTile
              label="Rated 4–5"
              value={`${Math.round(summary.overallFavorable)}%`}
              hint="Positive ratings"
            />
            <StatTile
              label="Would join again"
              value={
                summary.futureTotal
                  ? `${Math.round((summary.futurePositive / summary.futureTotal) * 100)}%`
                  : "—"
              }
              hint={`${summary.futurePositive} of ${summary.futureTotal} say yes`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 space-y-4">
              <div className="flex items-center gap-2">
                <Star size={13} className="text-vermilion" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-darkRed">
                  Rating breakdown
                </span>
              </div>
              <div className="space-y-3">
                {summary.ratings.map(({ question, avg, count }) => (
                  <div key={question.id} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[11px] font-semibold text-ink leading-snug">{question.label}</span>
                      <span className="text-[11px] font-mono font-bold text-darkRed shrink-0">
                        {count ? `${avg.toFixed(1)}/5` : "—"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-mutedGold/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-vermilion"
                        style={{ width: `${(avg / (question.max || 5)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 space-y-4">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-vermilion" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-darkRed">
                  Would they join again?
                </span>
              </div>
              <div className="space-y-2.5">
                {summary.futureCounts.map(({ label, count }) => {
                  const pct = summary.futureTotal ? (count / summary.futureTotal) * 100 : 0;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-28 text-[11px] text-ink shrink-0">{label}</span>
                      <div className="flex-1 h-2 rounded-full bg-mutedGold/30 overflow-hidden">
                        <div className="h-full rounded-full bg-accentGold" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-[11px] font-mono font-bold text-darkRed">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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

      {responses.length > 0 && (
        <div className="flex items-center gap-2 text-darkRed">
          <MessageSquareHeart size={15} className="text-vermilion" />
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest">
            Individual responses
          </h2>
        </div>
      )}

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
