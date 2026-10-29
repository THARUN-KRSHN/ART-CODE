"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { UserProfile } from "@/types";
import { Shield, AlertTriangle } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const switchToAdmin = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user-admin" }),
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink/70">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-cream bg-mandala-grid py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-paleCream/95 p-8 rounded-2xl border-2 border-mutedGold/60 shadow-elevated text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-accentGold/20 border border-accentGold/40 text-vermilion flex items-center justify-center mx-auto">
            <Shield size={24} />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-ink">Administrator Access Required</h2>
          <p className="text-xs text-ink/80 leading-relaxed font-sans">
            You are currently signed in as <strong>{currentUser ? currentUser.name : "Public Visitor"}</strong> ({currentUser ? currentUser.role : "unauthenticated"}). The admin portal is restricted to authorized DELTA committee members.
          </p>
          <div className="pt-2">
            <button
              onClick={switchToAdmin}
              className="w-full py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors shadow-sm"
            >
              Switch to Dr. Arun Mohan (Admin Demo Persona)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream bg-mandala-grid py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
