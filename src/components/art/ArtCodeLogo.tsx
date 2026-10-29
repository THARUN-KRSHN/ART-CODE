import React from "react";
import Link from "next/link";

export function ArtCodeLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-vermilion flex items-center justify-center text-accentGold font-bold font-serif text-sm tracking-tighter shadow-subtle group-hover:bg-darkRed transition-colors">
          //
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-display text-lg font-bold tracking-tight text-ink leading-none">
            <span className="text-vermilion">ART</span>
            <span className="text-accentGold font-normal italic px-0.5">//</span>
            <span>CODE</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paleCream text-darkRed border border-mutedGold/60 font-semibold">
              2026
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-ink-muted uppercase">
            DELTA • CCE
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-vermilion font-bold uppercase mb-2">
        <span className="text-accentGold">Δ</span> DELTA PRESENTS // VIRTUAL HACKATHON
      </div>
      <div className="flex flex-wrap items-baseline gap-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-ink leading-none">
        <span className="text-vermilion drop-shadow-sm">ART</span>
        <span className="text-accentGold font-editorial italic font-normal px-1">//</span>
        <span className="text-ink">2026</span>
        <span className="text-vermilion">CODE</span>
      </div>
      <div className="font-editorial text-xl sm:text-2xl text-secondaryRed italic mt-2">
        Where Creativity Meets Technology.
      </div>
    </div>
  );
}

