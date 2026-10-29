"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosterArtwork } from "@/components/art/PosterArtwork";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import { Github, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("Christ College of Engineering (Autonomous), Irinjalakuda");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMsg("Please fill in your name and email.");
      return;
    }
    if (!password || password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
          institution: institution.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/onboarding");
      } else {
        setErrorMsg(data.error || "Registration failed");
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", next: "/onboarding" }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-paleCream rounded-card border-2 border-mutedGold shadow-poster overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Illustrated Panel (Panel 10 Style) */}
        <div className="lg:col-span-5 bg-cream p-8 sm:p-10 border-b lg:border-b-0 lg:border-r-2 border-mutedGold flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-display font-black text-2xl text-ink">
                ART<span className="text-vermilion font-editorial italic px-0.5">//</span>CODE
              </span>
            </Link>
            <h2 className="font-editorial text-3xl text-darkRed leading-snug">
              Begin your participant journey.
            </h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Create your account to form a team, get your invite code, and submit your project.
            </p>
          </div>

          <div className="my-auto py-2">
            <PosterArtwork compact className="max-w-[280px]" />
          </div>

          <div className="space-y-1.5 text-xs text-darkRed font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-vermilion" />
              <span>Two-member pair programming</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-vermilion" />
              <span>₹3,000 cash prize pool</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form (Panel 10 Style) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold mb-1">
              <RhombusMotif size={12} />
              <span>Participant Portal</span>
            </div>
            <h2 className="text-2xl font-bold text-darkRed font-display">Participant Registration</h2>
            <p className="text-xs text-ink-secondary mt-1">
              Join ART//CODE 2026. Fast sign up using Google or email.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl border border-vermilion/40 bg-vermilion/10 text-vermilion text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Google sign-up */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleOAuth}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl border-2 border-mutedGold bg-cream hover:bg-paleCream text-ink text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle"
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

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-mutedGold"></div>
            <span className="flex-shrink mx-3 text-darkRed text-[10px] uppercase font-mono tracking-widest font-bold">
              Or direct registration
            </span>
            <div className="flex-grow border-t border-mutedGold"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Nair"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cce.edu.in"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98471 00000"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                Institution
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors flex items-center justify-center gap-2 shadow-subtle pt-2"
            >
              <span>{isLoading ? "Creating Profile..." : "Register & Set Up Profile"}</span>
              <ArrowRight size={14} className="text-accentGold" />
            </button>
          </form>

          <p className="text-center text-xs text-ink-secondary">
            Already registered?{" "}
            <Link href="/login" className="text-vermilion font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
