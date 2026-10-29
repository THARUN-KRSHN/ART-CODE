"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { ChevronDown, Shield, Users, User } from "lucide-react";

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-mutedGold bg-cream text-xs font-medium text-ink hover:border-vermilion transition-colors shadow-subtle"
        title="Switch active user role for evaluation"
      >
        <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse" />
        <span className="font-semibold text-secondaryRed">Role:</span>
        <span className="text-ink max-w-[130px] truncate font-medium">
          {currentUser ? `${currentUser.name} (${currentUser.role})` : "Public Visitor"}
        </span>
        <ChevronDown size={14} className="text-ink-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-paleCream border-2 border-mutedGold shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-mutedGold/60">
            <p className="text-xs font-bold text-darkRed uppercase tracking-wider font-mono">Role Simulator</p>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Instantly preview each PRS persona and state
            </p>
          </div>

          <div className="py-1 space-y-1">
            <button
              onClick={() => switchUser(null)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                !currentUser ? "bg-mutedGold/30 font-bold text-darkRed border border-mutedGold" : "text-ink-secondary hover:bg-cream"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={14} className="text-ink-muted" />
                <div>
                  <div className="font-semibold text-ink">Public Visitor</div>
                  <div className="text-[10px] text-ink-muted">Unauthenticated guest</div>
                </div>
              </div>
              {!currentUser && <span className="text-[10px] text-vermilion font-mono font-bold">ACTIVE</span>}
            </button>

            {allUsers.map((u) => {
              const isSelected = currentUser?.id === u.id;
              let roleBadge = "Participant";

              if (u.role === "admin") {
                roleBadge = "Faculty Admin (DELTA)";
              } else if (u.role === "leader") {
                roleBadge = u.teamId === "team-dhwani" ? "Leader (Solo / Incomplete)" : "Leader (Complete Team)";
              } else if (u.role === "participant" && u.teamId) {
                roleBadge = "Teammate";
              }

              return (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                    isSelected ? "bg-mutedGold/30 font-bold text-darkRed border border-mutedGold" : "text-ink-secondary hover:bg-cream"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {u.role === "admin" ? (
                      <Shield size={14} className="text-vermilion flex-shrink-0" />
                    ) : (
                      <Users size={14} className="text-secondaryRed flex-shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="font-semibold text-ink truncate">{u.name}</div>
                      <div className="text-[10px] text-ink-muted truncate">{roleBadge}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-vermilion font-mono font-bold flex-shrink-0">
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
