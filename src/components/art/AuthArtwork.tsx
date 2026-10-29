import React from "react";

export function AuthArtwork({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full aspect-[4/3] max-w-[420px] mx-auto select-none overflow-hidden rounded-2xl border border-border/70 bg-ivory-50 p-6 ${className}`}>
      <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-ink-muted uppercase">
        PORTAL ACCESS // ART//CODE 2026
      </div>

      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Soft geometric background rings */}
        <circle cx="200" cy="150" r="120" stroke="#E9E5DD" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx="200" cy="150" r="85" stroke="#414B75" strokeWidth="1" strokeOpacity="0.3" />

        {/* Minimal intersecting traditional and algorithmic shapes */}
        <path
          d="M 140 220 C 140 140, 260 140, 260 220 Z"
          fill="#C66A4A"
          opacity="0.85"
        />
        <circle cx="200" cy="115" r="40" fill="#414B75" opacity="0.9" />
        <circle cx="200" cy="115" r="15" fill="#D5A545" />

        <line x1="80" y1="150" x2="320" y2="150" stroke="#82947B" strokeWidth="1.2" strokeDasharray="6 6" />

        <rect x="180" y="200" width="40" height="40" rx="6" fill="#FAF8F3" stroke="#20201E" strokeWidth="1.5" />
        <circle cx="200" cy="220" r="5" fill="#C66A4A" />
      </svg>
    </div>
  );
}

export function CelebrationMotif({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="54" fill="#F3F5F2" stroke="#82947B" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="60" cy="60" r="42" fill="#FAF0EC" />
        <circle cx="60" cy="60" r="30" fill="#347553" />
        <path d="M48 60L56 68L72 52" stroke="#FAF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Abstract radiating celebration dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <circle
            key={deg}
            cx={60 + 50 * Math.cos((deg * Math.PI) / 180)}
            cy={60 + 50 * Math.sin((deg * Math.PI) / 180)}
            r="2.5"
            fill={deg % 90 === 0 ? "#C66A4A" : "#D5A545"}
          />
        ))}
      </svg>
    </div>
  );
}

