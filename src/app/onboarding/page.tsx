"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types";
import { ArrowRight, CheckCircle2, User, Building, Phone, GraduationCap, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("Christ College of Engineering (Autonomous), Irinjalakuda");
  const [department, setDepartment] = useState("Computer Science & Engineering (Data Science)");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          if (data.user.institution) setInstitution(data.user.institution);
          if (data.user.department) setDepartment(data.user.department);
          if (data.user.yearOfStudy) setYearOfStudy(data.user.yearOfStudy);
        } else {
          router.push("/login");
        }
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Contact phone number is required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          institution,
          department,
          yearOfStudy,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Direct to team formation
        router.push("/team");
      } else {
        setErrorMsg(data.error || "Failed to update profile");
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream bg-mandala-grid py-12 md:py-20 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-paleCream/95 backdrop-blur-sm rounded-2xl border-2 border-mutedGold/60 shadow-elevated p-8 sm:p-10 space-y-8">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-ink/70 font-semibold">
            <span>Step 01 of 02 // Profile Setup</span>
            <span className="text-vermilion font-bold">50% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden border border-mutedGold/40">
            <div className="h-full bg-vermilion w-1/2 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono tracking-widest text-vermilion uppercase font-bold">
            DELTA // Registration Registry
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
            Complete Your Participant Profile
          </h1>
          <p className="text-xs text-ink/80 leading-relaxed font-sans">
            Please provide your academic and contact details. This information is required for team verification, evaluation eligibility, and merit certificates.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl border border-vermilion/50 bg-vermilion/10 text-vermilion text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-vermilion" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Registered Email (Account Identity)
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold/40 bg-mutedGold/20 text-ink/60 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
              <Phone size={13} className="text-vermilion" />
              <span>Contact Phone Number *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98471 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
              <Building size={13} className="text-darkRed" />
              <span>Institution / College *</span>
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">Department</label>
              <input
                type="text"
                placeholder="e.g. Data Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-accentGold" />
                <span>Year of Study</span>
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
              >
                <option value="1st Year">1st Year (Undergraduate)</option>
                <option value="2nd Year">2nd Year (Undergraduate)</option>
                <option value="3rd Year">3rd Year (Undergraduate)</option>
                <option value="4th Year">4th Year (Undergraduate)</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-vermilion text-cream text-xs font-bold hover:bg-darkRed transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isLoading ? "Saving Profile..." : "Save & Proceed to Team Formation"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
