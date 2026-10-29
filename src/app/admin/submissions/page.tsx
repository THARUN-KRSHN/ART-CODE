"use client";

import React, { useState, useEffect } from "react";
import { ProjectSubmission } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Search,
  ExternalLink,
  Github,
  Unlock,
  Lock,
  Eye,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState<ProjectSubmission | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleReopenOrLock = async (submissionId: string, action: "reopen" | "lock") => {
    if (action === "reopen" && !actionReason.trim()) {
      alert("Please provide an administrative justification/reason to reopen this submission.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          submissionId,
          reason: actionReason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setSelectedSub(null);
        setActionReason("");
        loadSubmissions();
      } else {
        alert(data.error || "Action failed");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = submissions.filter((s) => {
    return (
      s.teamName.toLowerCase().includes(search.toLowerCase()) ||
      s.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      (s.referenceId || "").toLowerCase().includes(search.toLowerCase()) ||
      s.challengeTitle.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink-muted">Loading submissions repository...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Project Submissions</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Total {submissions.length} project submissions (inspect code, Drive links, and audit locks)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl border border-border bg-white shadow-subtle">
        <div className="relative w-full sm:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search by team, title, reference ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-card border border-border bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 border-b border-border text-[11px] font-mono uppercase text-ink-muted">
              <tr>
                <th className="py-3 px-4">Ref & Team</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Challenge Track</th>
                <th className="py-3 px-4">Status & Lock</th>
                <th className="py-3 px-4">Submitted (IST)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-ink-secondary">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold text-terracotta block">
                      {s.referenceId || "Draft"}
                    </span>
                    <span className="font-bold text-ink">{s.teamName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-ink max-w-xs truncate">
                    {s.projectTitle || "Untitled Draft"}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-[11px]">
                    {s.challengeTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={s.isLocked ? "submitted" : "draft"}
                      label={s.isLocked ? "Locked" : "Draft"}
                    />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-ink-muted">
                    {s.submittedAt
                      ? new Date(s.submittedAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not finalized"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedSub(s)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-ivory-100 hover:bg-ivory-200 text-xs font-semibold text-ink inline-flex items-center gap-1.5"
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Inspection Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-card border border-border shadow-elevated p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-mono text-terracotta uppercase font-bold">
                  Submission Ref: {selectedSub.referenceId || "Draft"}
                </span>
                <h2 className="text-xl font-bold text-ink mt-0.5">{selectedSub.projectTitle}</h2>
                <div className="text-xs text-ink-secondary">
                  Team: <strong>{selectedSub.teamName}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-ivory-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-ink-muted font-mono uppercase text-[10px]">Challenge Track:</span>
                <p className="font-medium text-ink mt-0.5">{selectedSub.challengeTitle}</p>
              </div>

              <div>
                <span className="text-ink-muted font-mono uppercase text-[10px]">Short Abstract:</span>
                <p className="text-ink-secondary mt-0.5 leading-relaxed">{selectedSub.shortDescription}</p>
              </div>

              <div>
                <span className="text-ink-muted font-mono uppercase text-[10px]">Problem & Motivation:</span>
                <p className="text-ink-secondary mt-0.5 leading-relaxed">{selectedSub.problemDescription}</p>
              </div>

              <div>
                <span className="text-ink-muted font-mono uppercase text-[10px]">Proposed Solution:</span>
                <p className="text-ink-secondary mt-0.5 leading-relaxed">{selectedSub.proposedSolution}</p>
              </div>

              <div>
                <span className="text-ink-muted font-mono uppercase text-[10px]">Tech Stack:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(selectedSub.techStack || []).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-ivory-200 text-ink font-mono text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-ink-muted font-mono uppercase text-[10px]">Cultural Innovation & Impact:</span>
                <p className="text-ink-secondary mt-0.5 leading-relaxed">{selectedSub.innovationAndImpact}</p>
              </div>

              {/* Links */}
              <div className="p-4 rounded-xl border border-border bg-ivory-50 space-y-2">
                <span className="text-ink font-bold block text-[11px]">Submitted Deliverables:</span>
                <div className="space-y-1.5">
                  <div>
                    GitHub:{" "}
                    <a
                      href={selectedSub.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-terracotta hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>{selectedSub.githubUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <div>
                    Google Drive (Video & Presentation):{" "}
                    <a
                      href={selectedSub.googleDriveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>{selectedSub.googleDriveUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  {selectedSub.liveUrl && (
                    <div>
                      Live Demo:{" "}
                      <a
                        href={selectedSub.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sage-600 hover:underline font-mono inline-flex items-center gap-1"
                      >
                        <span>{selectedSub.liveUrl}</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Administrative Lock / Unlock Controls */}
              <div className="p-4 rounded-xl border border-terracotta/30 bg-terracotta-50/30 space-y-3 pt-3">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <ShieldCheck size={14} className="text-terracotta" />
                  <span>Administrative Submission Control</span>
                </div>
                <p className="text-[11px] text-ink-secondary">
                  Per FR-19, only authorized administrators may reopen a finalized submission under controlled circumstances. All actions are saved to the audit log.
                </p>

                {selectedSub.isLocked ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Mandatory Reason for unlocking submission (e.g. Broken link resolution)..."
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-white text-ink"
                    />
                    <button
                      onClick={() => handleReopenOrLock(selectedSub.id, "reopen")}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-semibold hover:bg-terracotta-600 transition-colors flex items-center gap-1.5"
                    >
                      <Unlock size={13} />
                      <span>{isProcessing ? "Processing..." : "Reopen Submission (Unlock for Leader)"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleReopenOrLock(selectedSub.id, "lock")}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors flex items-center gap-1.5"
                  >
                    <Lock size={13} />
                    <span>{isProcessing ? "Processing..." : "Enforce Final Locking"}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 rounded-lg bg-ivory-200 text-ink text-xs font-semibold hover:bg-ivory-300"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

