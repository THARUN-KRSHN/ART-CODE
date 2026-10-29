"use client";

import React, { useState, useEffect } from "react";
import { NotificationItem, NotificationAudience, NotificationPriority } from "@/types";
import { Bell, Send, Plus, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<NotificationItem[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>("normal");
  const [targetAudience, setTargetAudience] = useState<NotificationAudience>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setAnnouncements(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please provide both title and announcement body.");
      return;
    }

    setIsPublishing(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          priority,
          targetAudience,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle("");
        setMessage("");
        setSuccessMsg(`Announcement "${data.notification.title}" broadcast to ${targetAudience}!`);
        loadAnnouncements();
      } else {
        alert(data.error || "Failed to publish announcement");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink/70">Loading announcements system...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-editorial text-2xl font-bold text-ink">Announcement & Notification Management</h1>
        <p className="text-xs text-ink/80 mt-0.5">
          Broadcast official bulletins, reminders, and deadline alerts to target participant cohorts.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-accentGold/60 bg-accentGold/20 text-darkRed text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 size={16} className="text-vermilion" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Create Announcement (Left) + Publication History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-mutedGold/50 pb-3">
            <Plus size={16} className="text-vermilion" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
              Compose Announcement
            </h2>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Announcement Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Final 24-Hour Submission Reminder"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink font-medium"
                >
                  <option value="normal">Normal Bulletin</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent / Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as NotificationAudience)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink font-medium"
                >
                  <option value="all">All Participants</option>
                  <option value="complete_teams">Complete Teams (2 Members)</option>
                  <option value="incomplete_teams">Incomplete Teams (1 Member)</option>
                  <option value="not_submitted">Unsubmitted Teams</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Message Body *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Compose the full message content here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={13} />
              <span>{isPublishing ? "Publishing..." : "Broadcast Announcement"}</span>
            </button>
          </form>
        </div>

        {/* History (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-mutedGold/50 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono">
              Published Bulletins ({announcements.length})
            </h2>
            <span className="text-[11px] font-mono text-ink/60 font-medium">Active Stream</span>
          </div>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-mutedGold/50 bg-cream/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                        item.priority === "urgent"
                          ? "bg-vermilion/15 text-vermilion border-vermilion/40"
                          : item.priority === "important"
                          ? "bg-accentGold/20 text-darkRed border-accentGold/60"
                          : "bg-cream text-ink/70 border-mutedGold/60"
                      }`}
                    >
                      {item.priority}
                    </span>
                    <h3 className="text-xs font-bold text-ink">{item.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-ink/60 font-medium">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>

                <p className="text-xs text-ink/80 leading-relaxed font-sans">{item.message}</p>

                <div className="pt-2 border-t border-mutedGold/30 flex items-center justify-between text-[10px] font-mono text-ink/60">
                  <span>Audience: {item.targetAudience}</span>
                  <span className="text-darkRed font-semibold">Read by {item.readBy?.length || 0} participants</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
