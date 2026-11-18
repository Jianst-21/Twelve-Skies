"use client";

import React from "react";

interface CurvedTextProps {
  text: string;
  size?: number; // Outer SVG size in px
  fontSize?: number;
  letterSpacing?: number;
  className?: string;
}

export default function CurvedText({
  text,
  size = 320,
  fontSize = 11,
  letterSpacing = 4,
  className = "",
}: CurvedTextProps) {
  const radius = (size - 30) / 2;
  const center = size / 2;
  const pathId = React.useId();

  // Circular path starting at top center and going clockwise
  const pathD = `
    M ${center},${center - radius}
    a ${radius},${radius} 0 1,1 0,${radius * 2}
    a ${radius},${radius} 0 1,1 0,-${radius * 2}
  `;

  return (
    <div
      className={`pointer-events-none select-none absolute inset-0 flex items-center justify-center animate-spin-slow ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          fill="currentColor"
          fontSize={fontSize}
          letterSpacing={letterSpacing}
          className="uppercase font-mono font-medium tracking-widest text-cyan-glow/85"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
