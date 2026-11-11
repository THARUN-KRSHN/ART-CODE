"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Loader2,
  Lock,
  MessageSquareHeart,
  Pencil,
} from "lucide-react";
import { CulturalDivider } from "@/components/art/CulturalMotifs";
import {
  FEEDBACK_QUESTIONS,
  FEEDBACK_SECTIONS,
  FeedbackAnswers,
  FeedbackQuestion,
} from "@/lib/feedback-questions";

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Satisfactory",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function FeedbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<FeedbackAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (!session?.user) {
          router.replace("/login?next=/feedback");
          return;
        }

        const fbRes = await fetch("/api/feedback");
        const fb = await fbRes.json();
        if (!fbRes.ok && fb.error) {
          setError(fb.error);
        }

        const prefills: FeedbackAnswers = {};
        const u = session.user;
        if (u?.name) prefills.q_name = u.name;
        if (u?.institution) prefills.q_college = u.institution;
        if (u?.department) prefills.q_department = u.department;
        try {
          const teamRes = await fetch("/api/teams");
          const teamData = await teamRes.json();
          if (teamData.team?.name) prefills.q_team = teamData.team.name;
        } catch {
          // Team name stays blank if it cannot be loaded.
        }

        if (fb.submitted) {
          setAnswers({ ...prefills, ...(fb.answers || {}) });
          setSubmitted(true);
          setSubmittedAt(fb.submittedAt || null);
        } else {
          setAnswers((prev) => ({ ...prefills, ...prev }));
        }
      } catch (err: any) {
        setError(err.message || "Could not load the feedback form.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [router]);

  useEffect(() => {
    if (!submitted || editing) return;
    const next = new URLSearchParams(window.location.search).get("next");
    if (!advanced && !next) return;
    const t = setTimeout(() => router.push(next || "/certificate"), 1800);
    return () => clearTimeout(t);
  }, [submitted, editing, advanced, router]);

  const isAnswered = (q: FeedbackQuestion) => {
    const v = answers[q.id];
    return v !== undefined && v !== null && String(v).trim() !== "";
  };

  const missingRequired = FEEDBACK_QUESTIONS.filter((q) => q.required && !isAnswered(q));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (missingRequired.length > 0) {
      setError(`Please answer: ${missingRequired[0].label}`);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit feedback.");
      setSubmittedAt(data.submittedAt || new Date().toISOString());
      setSubmitted(true);
      setEditing(false);
      setAdvanced(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-vermilion mx-auto" />
          <p className="text-xs font-mono text-ink/70">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (submitted && !editing) {
    return (
      <div className="min-h-screen bg-cream bg-mandala-grid py-16 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-paleCream/95 p-8 sm:p-12 rounded-2xl border-2 border-mutedGold/60 shadow-elevated text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cream border-2 border-mutedGold/60 flex items-center justify-center text-vermilion mx-auto">
            <CheckCircle2 size={30} />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              Feedback Recorded
            </span>
            <h1 className="font-editorial text-3xl text-ink font-bold">Thank you!</h1>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              Your responses have been saved
              {submittedAt
                ? ` on ${new Date(submittedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} IST`
                : ""}
              . Your certificate is now unlocked — taking you there in a moment.
            </p>
          </div>

          <Link
            href="/certificate"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors shadow-subtle"
          >
            <Award size={15} className="text-accentGold" />
            Go to Certificate
            <ArrowRight size={14} />
          </Link>

          <button
            onClick={() => setEditing(true)}
            className="block w-full text-[11px] font-mono text-ink/60 hover:text-vermilion inline-flex items-center justify-center gap-1.5"
          >
            <Pencil size={12} /> Edit my responses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream bg-mandala-grid py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-paleCream border-2 border-mutedGold/60 flex items-center justify-center text-vermilion">
              <MessageSquareHeart size={22} />
            </div>
            <div>
              <h1 className="font-editorial text-2xl font-bold text-ink">Event Feedback</h1>
              <p className="text-xs text-ink/70">
                Required before certificates unlock — takes about two minutes.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-mono font-bold text-darkRed hover:text-vermilion hidden sm:inline-flex"
          >
            Dashboard
          </Link>
        </div>

        <CulturalDivider />

        {error && (
          <div className="p-4 rounded-xl border-2 border-vermilion/50 bg-vermilion/10 text-xs font-bold text-vermilion">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-paleCream/95 p-6 sm:p-8 rounded-2xl border-2 border-mutedGold/60 shadow-sm space-y-6"
        >
          <div className="border-b border-mutedGold/60 pb-3 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-darkRed">
              ART//CODE 2026 · Participant Feedback
            </span>
            <span className="text-[10px] font-mono text-ink/50">
              {FEEDBACK_QUESTIONS.filter((q) => q.required).length} required questions
            </span>
          </div>

          {FEEDBACK_SECTIONS.map((section, si) => (
            <div
              key={section.id}
              className={`space-y-4 ${si > 0 ? "pt-5 border-t border-mutedGold/40" : ""}`}
            >
              <div className="space-y-1">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-darkRed">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-[11px] text-ink/70 leading-relaxed">{section.description}</p>
                )}
                {section.note && (
                  <p className="text-[10px] font-mono text-vermilion/90">{section.note}</p>
                )}
              </div>

              {section.questions.map((q, index) => (
                <div key={q.id} className="space-y-2">
                  <label className="block text-xs font-bold text-ink leading-relaxed">
                    {section.numbered && (
                      <span className="font-mono text-darkRed mr-1.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    {q.label}
                    {q.required && <span className="text-vermilion"> *</span>}
                  </label>
                  {q.help && <p className="text-[11px] text-ink/60 leading-relaxed">{q.help}</p>}

                  {q.type === "rating" && (
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: q.max || 5 }, (_, i) => i + 1).map((n) => {
                        const active = answers[q.id] === n;
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: n }))}
                            className={`min-h-10 px-3.5 rounded-xl text-xs font-bold border transition-colors ${
                              active
                                ? "bg-vermilion text-cream border-vermilion shadow-subtle"
                                : "bg-cream text-ink-secondary border-mutedGold hover:bg-paleCream hover:text-darkRed"
                            }`}
                          >
                            {n}
                            <span className="hidden sm:inline font-normal opacity-80 ml-1.5">
                              {ratingLabels[n] || ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "choice" && (
                    <div className="flex flex-wrap gap-2">
                      {(q.options || []).map((opt) => {
                        const active = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                            className={`min-h-10 px-4 rounded-xl text-xs font-bold border transition-colors ${
                              active
                                ? "bg-vermilion text-cream border-vermilion shadow-subtle"
                                : "bg-cream text-ink-secondary border-mutedGold hover:bg-paleCream hover:text-darkRed"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "text" && (
                    <input
                      type="text"
                      value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={q.placeholder || "Type your answer..."}
                      className="w-full min-h-10 px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
                    />
                  )}

                  {q.type === "textarea" && (
                    <textarea
                      rows={q.rows || 4}
                      value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={q.placeholder || "Type your answer..."}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion resize-y"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="pt-4 border-t border-mutedGold/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-ink/60">
              {missingRequired.length > 0
                ? `${missingRequired.length} required question(s) remaining`
                : "All required questions answered"}
            </span>
            <div className="flex flex-wrap gap-3 justify-end">
              {editing && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-mutedGold bg-cream text-ink text-xs font-bold uppercase tracking-wider hover:bg-paleCream shrink-0"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || missingRequired.length > 0}
                className="px-6 py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed inline-flex items-center gap-2 disabled:opacity-50 shrink-0 shadow-subtle"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback <ArrowRight size={14} className="text-accentGold" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-[11px] text-ink/60 text-center flex items-center justify-center gap-1.5">
          <Lock size={11} /> Certificates open only after this form is submitted.
        </p>
      </div>
    </div>
  );
}
