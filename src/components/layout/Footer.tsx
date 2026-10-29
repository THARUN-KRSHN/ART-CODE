import React from "react";
import Link from "next/link";
import { RhombusMotif } from "@/components/art/CulturalMotifs";

export function Footer() {
  return (
    <footer className="border-t-2 border-mutedGold bg-darkRed text-cream pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-mutedGold/40">
          {/* Column 1: Event Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-tight text-2xl text-cream">
                ART<span className="text-accentGold font-editorial font-normal italic px-0.5">//</span>CODE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vermilion text-cream border border-mutedGold/40 font-bold">
                2026
              </span>
            </div>
            <p className="font-editorial text-sm text-accentGold italic leading-snug">
              Where Creativity Meets Technology.
            </p>
            <p className="text-xs text-cream/80 leading-relaxed">
              A virtual hackathon celebrating Indian art, culture, heritage, and creative technology. Organised by DELTA.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accentGold font-mono flex items-center gap-2">
              <RhombusMotif size={12} color="#F1B321" />
              <span>Explore Event</span>
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>
                <Link href="/event" className="hover:text-accentGold transition-colors">
                  About ART//CODE
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-accentGold transition-colors">
                  Problem Statements
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-accentGold transition-colors">
                  Rules & Evaluation Rubric
                </Link>
              </li>
              <li>
                <Link href="/#prizes" className="hover:text-accentGold transition-colors">
                  Prizes & Citations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Participant Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accentGold font-mono flex items-center gap-2">
              <RhombusMotif size={12} color="#F1B321" />
              <span>Participants</span>
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>
                <Link href="/dashboard" className="hover:text-accentGold transition-colors">
                  Participant Dashboard
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-accentGold transition-colors">
                  Team Formation (2 Members)
                </Link>
              </li>
              <li>
                <Link href="/submission" className="hover:text-accentGold transition-colors">
                  Project Submission Gateway
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-accentGold transition-colors">
                  Official Bulletins
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Organisers & Institution */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accentGold font-mono flex items-center gap-2">
              <RhombusMotif size={12} color="#F1B321" />
              <span>Organised By</span>
            </h4>
            <p className="text-xs text-cream font-bold">
              DELTA — Department of Computer Science & Engineering (Data Science)
            </p>
            <p className="text-xs text-cream/80">
              Christ College of Engineering (Autonomous)
            </p>
            <p className="text-xs text-cream/70">
              Irinjalakuda, Thrissur, Kerala — 680125
            </p>
            <p className="text-xs font-mono text-accentGold pt-1">
              Contact: delta@cce.edu.in
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream/70 gap-4">
          <p>© 2026 DELTA, Christ College of Engineering. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono">
            <span>Contemporary Indian Cultural Editorial Design</span>
            <span>•</span>
            <span className="text-accentGold font-semibold">ART × CULTURE × CODE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
