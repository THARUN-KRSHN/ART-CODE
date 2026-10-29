"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PosterArtwork } from "@/components/art/PosterArtwork";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import { Github, ArrowRight } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next") && search.get("next")!.startsWith("/") ? search.get("next")! : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providers, setProviders] = useState<{ email: boolean; google: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((p) => setProviders({ email: !!p.email, google: !!p.google }))
      .catch(() => setProviders({ email: true, google: false }));
  }, []);

  const handleOAuthLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", next: nextPath }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.url) window.location.href = data.url;
        else setErrorMsg("Could not start Google sign-in.");
      } else {
        setErrorMsg(data.error || "Authentication failed");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return setErrorMsg("Enter a valid email address.");
    if (!password || password.length < 8) return setErrorMsg("Enter your password (min 8 chars).");

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(nextPath || "/dashboard");
      } else {
        setErrorMsg(data.error || "Authentication failed");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-paleCream rounded-card border-2 border-mutedGold shadow-poster overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Introduction (Panel 10 Style) */}
        <div className="lg:col-span-5 bg-cream p-8 sm:p-10 border-b lg:border-b-0 lg:border-r-2 border-mutedGold flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-display font-black text-2xl text-ink">
                ART<span className="text-vermilion font-editorial italic px-0.5">//</span>CODE
              </span>
            </Link>
            <h2 className="font-editorial text-3xl text-darkRed leading-snug">
              Welcome to the creative portal.
            </h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Sign in to manage your two-member team, access challenge problem statements, and submit your project draft.
            </p>
          </div>

          <div className="my-auto py-2">
            <PosterArtwork compact className="max-w-[280px]" />
          </div>

          <div className="text-[10px] font-mono text-darkRed uppercase tracking-wider font-bold">
            DELTA • CHRIST COLLEGE OF ENGINEERING
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold mb-1">
              <RhombusMotif size={12} />
              <span>Participant Portal</span>
            </div>
            <h2 className="text-2xl font-bold text-darkRed font-display">Sign In to ART//CODE</h2>
            <p className="text-xs text-ink-secondary mt-1">
              Use Google or your registered email and password.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl border border-vermilion/40 bg-vermilion/10 text-vermilion text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Google OAuth */}
          <div className="space-y-3">
            <button
              onClick={handleOAuthLogin}
              disabled={isLoading || providers?.google === false}
              className="w-full py-3 px-4 rounded-xl border-2 border-mutedGold bg-cream hover:bg-paleCream text-ink text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors shadow-subtle disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-mutedGold"></div>
            <span className="flex-shrink mx-4 text-darkRed text-[10px] uppercase font-mono tracking-widest font-bold">
              Or email sign in
            </span>
            <div className="flex-grow border-t border-mutedGold"></div>
          </div>

          {/* Email + Password */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-darkRed mb-1.5 font-mono uppercase tracking-wider">
                Academic or Personal Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cce.edu.in"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-darkRed mb-1.5 font-mono uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-vermilion hover:bg-darkRed text-cream text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight size={14} className="text-accentGold" />
            </button>
          </form>

          <p className="text-center text-xs text-ink-secondary">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-vermilion font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center p-8"><div className="text-center space-y-3"><div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" /><p className="text-xs font-mono text-ink/70">Loading…</p></div></div>}>
      <LoginInner />
    </Suspense>
  );
}
