import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-ivory-50 text-ink pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/70">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-xl font-sans text-ink">
                ART<span className="text-terracotta font-serif font-normal italic">//</span>CODE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ivory-200 border border-border text-ink-secondary">
                2026
              </span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              A virtual hackathon platform where contemporary digital creativity meets cultural heritage, traditional craftsmanship, and abstract art.
            </p>
            <div className="text-[11px] font-mono text-terracotta font-medium">
              DELTA — Data Science Department Association
            </div>
          </div>

          {/* Column 2: Event Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-mono">
              Event Structure
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/event" className="hover:text-terracotta transition-colors">
                  Overview & Theme
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-terracotta transition-colors">
                  Problem Statements
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-terracotta transition-colors">
                  Rules & Evaluation Rubric
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-terracotta transition-colors">
                  Winner Announcement
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Participant Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-mono">
              Participants
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/dashboard" className="hover:text-terracotta transition-colors">
                  Participant Dashboard
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-terracotta transition-colors">
                  Team Formation (2 Members)
                </Link>
              </li>
              <li>
                <Link href="/submission" className="hover:text-terracotta transition-colors">
                  Project Submission Portal
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-terracotta transition-colors">
                  Announcements & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-mono">
              Organised By
            </h4>
            <p className="text-xs text-ink font-semibold">
              Christ College of Engineering
            </p>
            <p className="text-xs text-ink-secondary">
              (Autonomous) Irinjalakuda, Thrissur, Kerala — 680125
            </p>
            <p className="text-xs text-ink-muted">
              Contact: delta@cce.edu.in
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-muted gap-4">
          <p>© 2026 DELTA, Christ College of Engineering. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with Next.js, TypeScript & Tailwind CSS</span>
            <span className="font-mono text-terracotta font-medium">Where Creativity Meets Technology.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

