import React from "react";

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

