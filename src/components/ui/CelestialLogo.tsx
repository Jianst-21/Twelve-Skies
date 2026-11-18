import React from "react";

interface CelestialLogoProps {
  className?: string;
  size?: number;
}

/**
 * CelestialLogo - Bespoke astronomical emblem for Twelve Skies.
 * Inspired by astronomical armillary spheres and celestial coordinates.
 * Pure vector geometry; rejects generic AI sparkle iconography.
 */
export default function CelestialLogo({
  className = "text-cyan-glow",
  size = 24,
}: CelestialLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Twelve Skies Emblem"
    >
      {/* Outer celestial coordinate meridian ring */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />

      {/* Tilted celestial equator ellipse */}
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.8"
        transform="rotate(-25 12 12)"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* Polar axis */}
      <line
        x1="12"
        y1="1.5"
        x2="12"
        y2="22.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />

      {/* Central zenith coordinate intersection */}
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />

      {/* 4 cardinal celestial coordinate ticks */}
      <line x1="2.5" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19.5" y1="12" x2="21.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="2.5" x2="12" y2="4.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="19.5" x2="12" y2="21.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
