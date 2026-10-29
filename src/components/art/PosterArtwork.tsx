import React from "react";

export function PosterArtwork({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`relative w-full aspect-[4/5] max-w-[460px] mx-auto select-none rounded-2xl border-2 border-mutedGold bg-cream p-4 shadow-poster overflow-hidden ${className}`}>
      {/* Traditional Ornate Border Frame */}
      <div className="absolute inset-2 rounded-xl border border-dashed border-vermilion/50 pointer-events-none" />

      {/* Decorative Corner Flourishes */}
      <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest text-darkRed/80 uppercase">
        PLATE 01 // DELTA.2026
      </div>
      <div className="absolute top-3 right-3 text-[10px] font-mono tracking-widest text-darkRed/80 uppercase">
        CCE.IRINJALAKUDA
      </div>

      {/* Main Classical Performer Vector Artwork inside an Arch Frame */}
      <div className="w-full h-full arch-frame bg-gradient-to-b from-darkRed to-vermilion relative flex items-center justify-center pt-8 overflow-hidden shadow-inner">
        {/* Radiating Traditional Sunburst / Mandala Rays */}
        <svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="sunburst" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#F1B321" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#A32516" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6B2B12" />
            </radialGradient>
            <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCE9CC" />
              <stop offset="30%" stopColor="#F1B321" />
              <stop offset="70%" stopColor="#D9B88A" />
              <stop offset="100%" stopColor="#8C3D20" />
            </linearGradient>
            <pattern id="motifPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="10" y="0" width="14" height="14" transform="rotate(45 10 0)" stroke="#F1B321" strokeWidth="0.8" fill="none" opacity="0.4" />
            </pattern>
          </defs>

          {/* Background Radiant Texture */}
          <rect width="400" height="480" fill="url(#sunburst)" />
          <rect width="400" height="480" fill="url(#motifPattern)" opacity="0.3" />

          {/* Halo / Tirumukham Circle with Ornate Mandala Petals */}
          <circle cx="200" cy="190" r="140" stroke="#F1B321" strokeWidth="2.5" strokeDasharray="4 6" />
          <circle cx="200" cy="190" r="125" stroke="#D9B88A" strokeWidth="1.5" />
          <circle cx="200" cy="190" r="110" fill="#6B2B12" fillOpacity="0.7" stroke="#F1B321" strokeWidth="2" />

          {/* Radiant Halo Rays */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="190"
              x2={200 + 135 * Math.cos((deg * Math.PI) / 180)}
              y2={190 + 135 * Math.sin((deg * Math.PI) / 180)}
              stroke="#F1B321"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
          ))}

          {/* Golden Headgear (Kireedam) - Conical / Tiered Architecture */}
          {/* Base Crown Band */}
          <path d="M 140 160 Q 200 145 260 160 L 255 175 Q 200 160 145 175 Z" fill="url(#goldMetal)" stroke="#1F1A14" strokeWidth="1.5" />
          
          {/* Tier 1 Dome */}
          <path d="M 150 145 Q 200 120 250 145 L 245 125 Q 200 100 155 125 Z" fill="#F1B321" stroke="#6B2B12" strokeWidth="1.5" />
          
          {/* Tier 2 Cone */}
          <path d="M 165 115 Q 200 90 235 115 L 225 80 Q 200 65 175 80 Z" fill="url(#goldMetal)" stroke="#6B2B12" strokeWidth="1.5" />
          
          {/* Top Pinnacle (Kalasam) */}
          <path d="M 185 75 L 200 35 L 215 75 Z" fill="#F1B321" stroke="#6B2B12" strokeWidth="1.5" />
          <circle cx="200" cy="32" r="5" fill="#A32516" stroke="#F1B321" strokeWidth="1" />

          {/* Side Wing Plates (Chevippoo & Kundalas) */}
          <circle cx="130" cy="185" r="22" fill="url(#goldMetal)" stroke="#6B2B12" strokeWidth="1.5" />
          <circle cx="130" cy="185" r="12" fill="#A32516" />
          <circle cx="270" cy="185" r="22" fill="url(#goldMetal)" stroke="#6B2B12" strokeWidth="1.5" />
          <circle cx="270" cy="185" r="12" fill="#A32516" />

          {/* Face Profile / Frontal Iconography */}
          {/* Greenish / Golden Face Mask Foundation (Pacha / Teppu) */}
          <path
            d="M 155 175 C 150 240, 165 295, 200 310 C 235 295, 250 240, 245 175 Z"
            fill="#EED7A8"
            stroke="#6B2B12"
            strokeWidth="2"
          />

          {/* White Ridge (Chutti) Framing the Jawline */}
          <path
            d="M 152 185 C 150 250, 168 305, 200 318 C 232 305, 250 250, 248 185"
            stroke="#FDFBF5"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Forehead Sacred Tilak / Namam in Vermilion & Saffron */}
          <path d="M 194 170 Q 200 155 206 170 L 203 210 Q 200 215 197 210 Z" fill="#A32516" />
          <circle cx="200" cy="165" r="3.5" fill="#F1B321" />

          {/* Expressive Almond Eyes & Kohl Lines (Chuvappu & Kandal) */}
          {/* Left Eye */}
          <path d="M 168 220 Q 182 210 194 222 Q 182 228 168 220 Z" fill="#FDFBF5" stroke="#1F1A14" strokeWidth="1.5" />
          <circle cx="182" cy="220" r="4.5" fill="#1F1A14" />
          <path d="M 162 215 Q 182 202 196 216" stroke="#1F1A14" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Right Eye */}
          <path d="M 206 222 Q 218 210 232 220 Q 218 228 206 222 Z" fill="#FDFBF5" stroke="#1F1A14" strokeWidth="1.5" />
          <circle cx="218" cy="220" r="4.5" fill="#1F1A14" />
          <path d="M 204 216 Q 218 202 238 215" stroke="#1F1A14" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Traditional Nose & Painted Red Lips */}
          <path d="M 200 220 L 198 255 Q 200 260 202 255 Z" stroke="#6B2B12" strokeWidth="1.5" fill="none" />
          <path d="M 190 272 Q 200 266 210 272 Q 200 282 190 272 Z" fill="#A32516" stroke="#6B2B12" strokeWidth="1" />

          {/* Ornate Necklaces & Chest Ornaments (Kazhutharam) */}
          <path d="M 145 320 Q 200 350 255 320 L 265 370 Q 200 410 135 370 Z" fill="url(#goldMetal)" stroke="#6B2B12" strokeWidth="1.5" />
          <path d="M 155 340 Q 200 365 245 340" stroke="#A32516" strokeWidth="4" fill="none" />
          
          {/* Garment Drapes in Deep Vermilion */}
          <path d="M 110 380 Q 200 430 290 380 L 320 480 L 80 480 Z" fill="#A32516" stroke="#6B2B12" strokeWidth="2" />
          {/* Golden Brocade Lines */}
          <path d="M 130 400 L 130 480" stroke="#F1B321" strokeWidth="3" />
          <path d="M 200 415 L 200 480" stroke="#F1B321" strokeWidth="4" />
          <path d="M 270 400 L 270 480" stroke="#F1B321" strokeWidth="3" />
        </svg>

        {/* Small Bottom Exhibition Caption as shown in the Poster */}
        <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-mono tracking-widest text-cream bg-darkRed/90 py-1 uppercase font-semibold">
          TRADITIONAL IDENTITY × DIGITAL CRAFT
        </div>
      </div>
    </div>
  );
}

