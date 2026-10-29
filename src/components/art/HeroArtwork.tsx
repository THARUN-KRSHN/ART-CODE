import React from "react";

export function HeroArtwork({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full aspect-square max-w-[540px] mx-auto select-none overflow-hidden rounded-2xl border border-border/80 bg-white/70 backdrop-blur-sm p-6 shadow-subtle ${className}`}>
      {/* Decorative frame elements mimicking exhibition gallery print */}
      <div className="absolute top-4 left-4 text-[11px] font-mono tracking-widest text-ink-muted uppercase">
        Plate 01 // DELTA.2026
      </div>
      <div className="absolute top-4 right-4 text-[11px] font-mono tracking-widest text-ink-muted uppercase">
        10°17'N 76°12'E
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] font-mono tracking-wider text-ink-muted">
        SYNTHESIS : TRADITION × COMPUTATION
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono tracking-wider text-ink-muted">
        CCE.IRINJALAKUDA
      </div>

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="grad-warm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FAF8F3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F2EFE8" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="grad-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C66A4A" />
            <stop offset="100%" stopColor="#A85235" />
          </linearGradient>
          <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#414B75" />
            <stop offset="100%" stopColor="#2E375C" />
          </linearGradient>
          <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#E9E5DD" />
          </pattern>
          <pattern id="weaveLines" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="16" y2="16" stroke="#C66A4A" strokeWidth="0.8" strokeOpacity="0.3" />
            <line x1="16" y1="0" x2="0" y2="16" stroke="#414B75" strokeWidth="0.8" strokeOpacity="0.2" />
          </pattern>
        </defs>

        {/* Background Subtle Grid Texture */}
        <rect x="25" y="25" width="450" height="450" fill="url(#dotGrid)" rx="16" />

        {/* Outer Circular Mandalas & Radians */}
        <circle cx="250" cy="250" r="190" stroke="#E9E5DD" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="250" cy="250" r="150" stroke="#414B75" strokeWidth="1" strokeOpacity="0.35" />
        <circle cx="250" cy="250" r="110" stroke="#C66A4A" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="2 4" />

        {/* Traditional Geometric Rays (Radial Axis) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="250"
            y1="250"
            x2={250 + 190 * Math.cos((deg * Math.PI) / 180)}
            y2={250 + 190 * Math.sin((deg * Math.PI) / 180)}
            stroke="#D5A545"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
        ))}

        {/* Bold Abstract Curved Forms (Terracotta Cutout) */}
        <path
          d="M 120 340 C 120 220, 220 120, 340 120 C 370 120, 390 140, 380 170 C 340 290, 230 380, 150 370 C 130 365, 120 355, 120 340 Z"
          fill="url(#grad-terracotta)"
          opacity="0.9"
        />

        {/* Deep Indigo Intersection Disc */}
        <circle cx="290" cy="230" r="75" fill="url(#grad-indigo)" opacity="0.88" />

        {/* Saffron Gold Arc */}
        <path
          d="M 170 190 A 100 100 0 0 1 330 310"
          stroke="#D5A545"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Sage Green Organic Leaf/Petal Shape */}
        <path
          d="M 210 280 C 230 220, 300 210, 340 240 C 320 300, 250 310, 210 280 Z"
          fill="#82947B"
          opacity="0.8"
        />

        {/* Textile / Weave Pattern Overlay Block */}
        <rect
          x="150"
          y="230"
          width="110"
          height="110"
          rx="12"
          fill="url(#weaveLines)"
          stroke="#E9E5DD"
          strokeWidth="1.2"
        />

        {/* Digital Pixel Array - Intersection with Traditional Forms */}
        {[
          { x: 310, y: 150, s: 10, fill: "#20201E" },
          { x: 325, y: 150, s: 10, fill: "#C66A4A" },
          { x: 340, y: 150, s: 10, fill: "#D5A545" },
          { x: 310, y: 165, s: 10, fill: "#FAF8F3" },
          { x: 325, y: 165, s: 10, fill: "#414B75" },
          { x: 340, y: 165, s: 10, fill: "#82947B" },
          { x: 310, y: 180, s: 10, fill: "#C66A4A" },
          { x: 325, y: 180, s: 10, fill: "#20201E" },
          { x: 340, y: 180, s: 10, fill: "#FAF8F3" },
        ].map((px, i) => (
          <rect
            key={i}
            x={px.x}
            y={px.y}
            width={px.s}
            height={px.s}
            fill={px.fill}
            stroke="#20201E"
            strokeWidth="0.5"
          />
        ))}

        {/* Center Golden Core Pivot */}
        <circle cx="250" cy="250" r="14" fill="#D5A545" stroke="#FAF8F3" strokeWidth="3" />
        <circle cx="250" cy="250" r="4" fill="#20201E" />
      </svg>
    </div>
  );
}

