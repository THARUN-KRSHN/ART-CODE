import React from "react";

interface ChallengeMotifProps {
  category?: string;
  accent?: "terracotta" | "indigo" | "saffron" | "sage";
  className?: string;
  size?: number;
}

export function ChallengeMotif({
  category = "Heritage & AI",
  accent = "terracotta",
  className = "",
  size = 64,
}: ChallengeMotifProps) {
  const getColors = () => {
    switch (accent) {
      case "indigo":
        return { primary: "#414B75", secondary: "#D7DBED", highlight: "#D5A545" };
      case "saffron":
        return { primary: "#D5A545", secondary: "#F6ECCF", highlight: "#C66A4A" };
      case "sage":
        return { primary: "#82947B", secondary: "#E4E9E2", highlight: "#414B75" };
      case "terracotta":
      default:
        return { primary: "#C66A4A", secondary: "#F5DFD7", highlight: "#414B75" };
    }
  };

  const { primary, secondary, highlight } = getColors();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl p-2 border border-border/80 bg-white/80 shadow-subtle ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {category.includes("Heritage") && (
          // Inpainting / Archival Motif: Arch combined with geometric pixel grid
          <>
            <path
              d="M 20 80 C 20 40, 80 40, 80 80 Z"
              fill={secondary}
              stroke={primary}
              strokeWidth="2"
            />
            <circle cx="50" cy="40" r="16" fill={primary} opacity="0.8" />
            <rect x="42" y="60" width="8" height="8" fill={highlight} />
            <rect x="50" y="60" width="8" height="8" fill="#20201E" />
            <rect x="42" y="68" width="8" height="8" fill="#FAF8F3" stroke="#20201E" strokeWidth="1" />
            <circle cx="50" cy="40" r="5" fill="#FAF8F3" />
          </>
        )}

        {category.includes("Performing") && (
          // Dance & Kinetic Mudra Motif: Overlapping flowing arcs and rhythm pulses
          <>
            <circle cx="50" cy="50" r="34" stroke={secondary} strokeWidth="6" />
            <path
              d="M 25 70 Q 50 15 75 70"
              stroke={primary}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 35 35 C 45 45, 55 25, 65 35"
              stroke={highlight}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="6" fill={primary} />
            <circle cx="35" cy="65" r="4" fill={highlight} />
            <circle cx="65" cy="65" r="4" fill={highlight} />
          </>
        )}

        {category.includes("Calligraphy") && (
          // Stylus & Ligature Motif: Flowing stroke and mathematical angle
          <>
            <line x1="20" y1="80" x2="80" y2="20" stroke={secondary} strokeWidth="8" strokeLinecap="round" />
            <path
              d="M 25 75 C 30 40, 60 40, 75 25"
              stroke={primary}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 35 75 A 20 20 0 1 1 65 60"
              stroke={highlight}
              strokeWidth="2.5"
              fill="none"
            />
            <rect x="70" y="20" width="10" height="10" transform="rotate(45 75 25)" fill="#20201E" />
          </>
        )}

        {category.includes("Craftsmanship") && (
          // Handloom Warp/Weft Matrix
          <>
            <rect x="20" y="20" width="60" height="60" rx="8" fill={secondary} stroke={primary} strokeWidth="1.5" />
            <line x1="35" y1="20" x2="35" y2="80" stroke={primary} strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="80" stroke={primary} strokeWidth="2" strokeDasharray="3 3" />
            <line x1="65" y1="20" x2="65" y2="80" stroke={primary} strokeWidth="2" />
            <line x1="20" y1="35" x2="80" y2="35" stroke={highlight} strokeWidth="2" />
            <line x1="20" y1="50" x2="80" y2="50" stroke={highlight} strokeWidth="2" strokeDasharray="3 3" />
            <line x1="20" y1="65" x2="80" y2="65" stroke={highlight} strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="#20201E" />
          </>
        )}

        {category.includes("Interactive") && (
          // Acoustic Chamber / Spatial Resonance
          <>
            <rect x="25" y="25" width="50" height="50" fill={secondary} rx="4" />
            <circle cx="50" cy="50" r="32" stroke={primary} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="20" stroke={highlight} strokeWidth="2" />
            <circle cx="50" cy="50" r="8" fill={primary} />
            <polygon points="50,15 54,23 46,23" fill="#20201E" />
            <polygon points="50,85 54,77 46,77" fill="#20201E" />
          </>
        )}

        {/* Fallback geometric composition if not matched */}
        {!category.includes("Heritage") &&
          !category.includes("Performing") &&
          !category.includes("Calligraphy") &&
          !category.includes("Craftsmanship") &&
          !category.includes("Interactive") && (
            <>
              <circle cx="50" cy="50" r="30" fill={secondary} stroke={primary} strokeWidth="2" />
              <rect x="35" y="35" width="30" height="30" fill={primary} rx="4" />
              <circle cx="50" cy="50" r="6" fill={highlight} />
            </>
          )}
      </svg>
    </div>
  );
}

