import React from "react";

// Traditional Indian rhombus / lotus motif from Panel 01 of the Design Guide
export function RhombusMotif({ className = "", size = 24, color = "#A32516" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="20" y="2" width="25" height="25" transform="rotate(45 20 2)" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="8" width="16" height="16" transform="rotate(45 20 8)" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1" />
      <circle cx="20" cy="20" r="3" fill="#F1B321" stroke={color} strokeWidth="1" />
      {/* 4 Cardinal Petals */}
      <circle cx="20" cy="11" r="1.5" fill={color} />
      <circle cx="20" cy="29" r="1.5" fill={color} />
      <circle cx="11" cy="20" r="1.5" fill={color} />
      <circle cx="29" cy="20" r="1.5" fill={color} />
    </svg>
  );
}

// Ornate Indian Corner Flourish
export function CornerFlourish({ className = "", size = 48, color = "#A32516" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M 4 56 L 4 4 L 56 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 10 50 L 10 10 L 50 10" stroke="#F1B321" strokeWidth="1" strokeLinecap="round" />
      <circle cx="4" cy="4" r="3" fill="#A32516" />
      <circle cx="14" cy="14" r="2" fill="#F1B321" />
      <path d="M 10 24 C 18 24 24 18 24 10" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

// Traditional Section Divider with Mandala Core
export function CulturalDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-mutedGold" />
      <RhombusMotif size={20} color="#A32516" />
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-mutedGold" />
    </div>
  );
}

