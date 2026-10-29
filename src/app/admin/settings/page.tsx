"use client";

import React, { useState, useEffect } from "react";
import { EventSettings } from "@/types";
import { Save, CheckCircle2, Clock, Calendar, Award, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        setSuccessMsg("Event settings updated successfully. Audit log updated.");
      } else {
        alert(data.error || "Failed to update settings");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink-muted">Loading settings configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Event Configuration & Gateways</h1>
        <p className="text-xs text-ink-secondary mt-0.5">
          Configure official dates, deadlines, prize pools, and toggle winner publication.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-sage-200 bg-sage-50 text-status-success text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Info */}
        <div className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink font-bold border-b border-border/80 pb-3">
            01 // Identity & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Event Name</label>
              <input
                type="text"
                value={settings.eventName}
                onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Organising Body</label>
              <input
                type="text"
                value={settings.organiser}
                onChange={(e) => setSettings({ ...settings, organiser: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Host Institution</label>
              <input
                type="text"
                value={settings.institution}
                onChange={(e) => setSettings({ ...settings, institution: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>
          </div>
        </div>

        {/* Timelines and Deadlines */}
        <div className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink font-bold border-b border-border/80 pb-3">
            02 // Event Deadlines & Windows (IST)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Registration Opens
              </label>
              <input
                type="text"
                value={settings.registrationOpens}
                onChange={(e) => setSettings({ ...settings, registrationOpens: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Submission Window Opens
              </label>
              <input
                type="text"
                value={settings.submissionOpens}
                onChange={(e) => setSettings({ ...settings, submissionOpens: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Submission Deadline (Hard Stop)
              </label>
              <input
                type="text"
                value={settings.submissionDeadline}
                onChange={(e) => setSettings({ ...settings, submissionDeadline: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Winner Announcement Date
              </label>
              <input
                type="text"
                value={settings.winnerAnnouncement}
                onChange={(e) => setSettings({ ...settings, winnerAnnouncement: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-border bg-ivory-50 text-ink"
              />
            </div>
          </div>
        </div>

        {/* Prize Pool and Results Publication */}
        <div className="p-6 rounded-card border border-border bg-white shadow-subtle space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink font-bold border-b border-border/80 pb-3">
            03 // Prize Pool & Results Publication
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">1st Prize</label>
              <input
                type="text"
                value={settings.firstPrize}
                onChange={(e) => setSettings({ ...settings, firstPrize: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold text-terracotta rounded-lg border border-border bg-ivory-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">2nd Prize</label>
              <input
                type="text"
                value={settings.secondPrize}
                onChange={(e) => setSettings({ ...settings, secondPrize: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-border bg-ivory-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">3rd Prize</label>
              <input
                type="text"
                value={settings.thirdPrize}
                onChange={(e) => setSettings({ ...settings, thirdPrize: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-border bg-ivory-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Total Pool</label>
              <input
                type="text"
                value={settings.totalPrizePool}
                onChange={(e) => setSettings({ ...settings, totalPrizePool: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-border bg-ivory-50"
              />
            </div>
          </div>

          {/* Results publication switch */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-ink">Publish Final Winners to Public</div>
              <div className="text-[11px] text-ink-muted">
                Controls whether the public `/results` route displays the winning podium or the pending state.
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.resultsPublished}
                onChange={(e) => setSettings({ ...settings, resultsPublished: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-ivory-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terracotta"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors flex items-center gap-2 shadow-subtle"
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Event Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

