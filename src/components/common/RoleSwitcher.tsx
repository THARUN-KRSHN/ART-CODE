"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { UserCheck, ChevronDown, Shield, Users, User, ArrowRight } from "lucide-react";

export function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setCurrentUser(data.user);
      setAllUsers(data.allUsers || []);
    } catch (e) {
      console.error("Failed to load session", e);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const switchUser = async (userId: string | null) => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      await fetchSession();
      setIsOpen(false);
      window.location.reload();
    } catch (e) {
      console.error("Failed to switch role", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-ink hover:border-terracotta/50 transition-colors shadow-subtle"
        title="Switch active user role for evaluation"
      >
        <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
        <span className="font-semibold text-ink-secondary">Role:</span>
        <span className="text-ink max-w-[130px] truncate">
          {currentUser ? `${currentUser.name} (${currentUser.role})` : "Public Visitor"}
        </span>
        <ChevronDown size={14} className="text-ink-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-border shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-border/60">
            <p className="text-xs font-semibold text-ink">Role Simulator (Evaluation Tool)</p>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Switch roles instantly to inspect each PRS persona
            </p>
          </div>

          <div className="py-1 space-y-1">
            <button
              onClick={() => switchUser(null)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                !currentUser ? "bg-ivory-200 font-semibold text-ink" : "text-ink-secondary hover:bg-ivory-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={14} className="text-ink-muted" />
                <div>
                  <div className="font-medium text-ink">Public Visitor</div>
                  <div className="text-[10px] text-ink-muted">Unauthenticated guest</div>
                </div>
              </div>
              {!currentUser && <span className="text-[10px] text-terracotta font-mono font-bold">ACTIVE</span>}
            </button>

            {allUsers.map((u) => {
              const isSelected = currentUser?.id === u.id;
              let roleBadge = "Participant";
              let badgeColor = "bg-indigo-50 text-indigo-700";

              if (u.role === "admin") {
                roleBadge = "Administrator";
                badgeColor = "bg-terracotta-50 text-terracotta";
              } else if (u.role === "leader") {
                roleBadge = u.teamId === "team-dhwani" ? "Leader (Solo/Incomplete)" : "Leader (Complete Team)";
                badgeColor = "bg-saffron-50 text-saffron-600";
              } else if (u.role === "participant" && u.teamId) {
                roleBadge = "Teammate";
                badgeColor = "bg-sage-50 text-sage-600";
              }

              return (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                    isSelected ? "bg-ivory-200 font-semibold text-ink" : "text-ink-secondary hover:bg-ivory-100"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {u.role === "admin" ? (
                      <Shield size={14} className="text-terracotta flex-shrink-0" />
                    ) : (
                      <Users size={14} className="text-indigo flex-shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="font-medium text-ink truncate">{u.name}</div>
                      <div className="text-[10px] text-ink-muted truncate">{roleBadge}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-terracotta font-mono font-bold flex-shrink-0">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

