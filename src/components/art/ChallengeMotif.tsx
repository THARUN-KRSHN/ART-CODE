import React from "react";

interface ChallengeMotifProps {
  category?: string;
  className?: string;
  size?: number;
}

export function ChallengeMotif({
  category = "Heritage & AI",
  className = "",
  size = 56,
}: ChallengeMotifProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl p-2 border border-mutedGold bg-paleCream shadow-subtle ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {category.includes("Heritage") && (
          // Temple Gopuram / Mural Archway Motif
          <>
            <path d="M 40 10 L 65 35 L 60 70 L 20 70 L 15 35 Z" fill="#FDF4E4" stroke="#A32516" strokeWidth="2" />
            <path d="M 28 70 L 28 45 Q 40 38 52 45 L 52 70 Z" fill="#A32516" />
            <circle cx="40" cy="26" r="6" fill="#F1B321" stroke="#A32516" strokeWidth="1.5" />
            <line x1="15" y1="35" x2="65" y2="35" stroke="#F1B321" strokeWidth="2" />
          </>
        )}

        {category.includes("Performing") && (
          // Classical Mudra (Hastas & Dance Rhythm)
          <>
            <circle cx="40" cy="40" r="28" stroke="#D9B88A" strokeWidth="3" strokeDasharray="3 4" />
            <path d="M 25 55 Q 40 18 55 55" stroke="#A32516" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="38" r="7" fill="#F1B321" stroke="#A32516" strokeWidth="1.5" />
            <circle cx="28" cy="52" r="3.5" fill="#8C3D20" />
            <circle cx="52" cy="52" r="3.5" fill="#8C3D20" />
          </>
        )}

        {category.includes("Calligraphy") && (
          // Iron Stylus (Narayam) & Fluid Palm-Leaf Ligature
          <>
            <line x1="20" y1="65" x2="65" y2="20" stroke="#F1B321" strokeWidth="5" strokeLinecap="round" />
            <path d="M 22 62 C 30 35, 50 35, 60 22" stroke="#A32516" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="40" r="10" stroke="#8C3D20" strokeWidth="2" fill="none" />
            <rect x="58" y="16" width="8" height="8" transform="rotate(45 62 20)" fill="#1F1A14" />
          </>
        )}

        {category.includes("Craftsmanship") && (
          // Kasavu Handloom Warp / Weft Matrix
          <>
            <rect x="18" y="18" width="44" height="44" rx="6" fill="#FAF3E3" stroke="#A32516" strokeWidth="1.8" />
            <line x1="32" y1="18" x2="32" y2="62" stroke="#A32516" strokeWidth="2" />
            <line x1="48" y1="18" x2="48" y2="62" stroke="#A32516" strokeWidth="2" />
            <line x1="18" y1="32" x2="62" y2="32" stroke="#F1B321" strokeWidth="2" />
            <line x1="18" y1="48" x2="62" y2="48" stroke="#F1B321" strokeWidth="2" />
            <circle cx="40" cy="40" r="5" fill="#8C3D20" />
          </>
        )}

        {category.includes("Interactive") && (
          // Sacred Resonance / Stone Acoustic Chamber
          <>
            <circle cx="40" cy="40" r="28" fill="#FAF3E3" stroke="#A32516" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="20" stroke="#F1B321" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="40" cy="40" r="10" fill="#A32516" />
            <polygon points="40,14 44,22 36,22" fill="#F1B321" />
            <polygon points="40,66 44,58 36,58" fill="#F1B321" />
          </>
        )}

        {!category.includes("Heritage") &&
          !category.includes("Performing") &&
          !category.includes("Calligraphy") &&
          !category.includes("Craftsmanship") &&
          !category.includes("Interactive") && (
            <>
              <circle cx="40" cy="40" r="24" fill="#FAF3E3" stroke="#A32516" strokeWidth="2" />
              <rect x="30" y="30" width="20" height="20" transform="rotate(45 40 40)" fill="#F1B321" stroke="#A32516" strokeWidth="1" />
              <circle cx="40" cy="40" r="4" fill="#6B2B12" />
            </>
          )}
      </svg>
    </div>
  );
}
