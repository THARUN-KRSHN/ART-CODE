"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NotificationItem, UserProfile } from "@/types";
import {
  Bell,
  CheckCheck,
  Check,
  Filter,
  AlertCircle,
  Clock,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      setCurrentUser(sessionData.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (!filterUnreadOnly) return true;
    return currentUser ? !n.readBy.includes(currentUser.id) : true;
  });

  const unreadCount = currentUser
    ? notifications.filter((n) => !n.readBy.includes(currentUser.id)).length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading bulletins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-ink-secondary hover:text-terracotta inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <span className="text-xs font-mono text-ink-muted">
            {unreadCount} Unread Announcements
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-indigo uppercase font-semibold">
              Official Bulletins // ART//CODE 2026
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink">
              Announcements & Updates
            </h1>
          </div>

          {currentUser && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-ivory-100 text-xs font-semibold text-ink flex items-center gap-2 shadow-subtle transition-colors self-start sm:self-auto"
            >
              <CheckCheck size={14} className="text-status-success" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUnreadOnly(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !filterUnreadOnly
                ? "bg-ink text-white font-semibold"
                : "bg-white border border-border text-ink-secondary hover:bg-ivory-100"
            }`}
          >
            All Announcements ({notifications.length})
          </button>
          <button
            onClick={() => setFilterUnreadOnly(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterUnreadOnly
                ? "bg-ink text-white font-semibold"
                : "bg-white border border-border text-ink-secondary hover:bg-ivory-100"
            }`}
          >
            Unread Only ({unreadCount})
          </button>
        </div>

        {/* List of Notifications */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 rounded-card border border-border bg-white text-center space-y-2">
              <Bell size={24} className="mx-auto text-ink-muted opacity-40" />
              <h3 className="text-sm font-bold text-ink">No announcements to display</h3>
              <p className="text-xs text-ink-secondary">
                {filterUnreadOnly ? "You have read all available updates." : "No bulletins have been published yet."}
              </p>
            </div>
          ) : (
            filtered.map((n) => {
              const isRead = currentUser ? n.readBy.includes(currentUser.id) : true;
              let badgeColor = "bg-ivory-200 text-ink-secondary border-border";
              if (n.priority === "urgent") badgeColor = "bg-terracotta-50 text-terracotta border-terracotta-200 font-bold";
              if (n.priority === "important") badgeColor = "bg-saffron-50 text-saffron-600 border-saffron-200 font-bold";

              return (
                <div
                  key={n.id}
                  className={`p-6 rounded-card border transition-all ${
                    isRead
                      ? "border-border bg-white shadow-subtle"
                      : "border-terracotta/40 bg-white shadow-elevated"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}
                      >
                        {n.priority}
                      </span>
                      <h3 className="text-base font-bold text-ink">{n.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-muted">
                      <span className="font-mono text-[11px]">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {currentUser && !isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[11px] font-medium text-terracotta hover:underline inline-flex items-center gap-1"
                        >
                          <Check size={12} /> Mark read
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                    {n.message}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Target Audience: {n.targetAudience}</span>
                    <span>Organising Committee (DELTA)</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

