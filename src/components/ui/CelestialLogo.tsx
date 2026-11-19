import React from "react";

interface CelestialLogoProps {
  className?: string;
  size?: number;
}

/**
 * CelestialLogo - Twelve Skies monogram mark.
 * Uses exact Titillium Web Bold vector outlines for "12" with a warm amber zenith star accent,
 * matching the browser favicon across header, navbar, auth, and modal surfaces.
 */
export default function CelestialLogo({
  className = "",
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
      <path
        d="M8.48 6.07V21H5.36V9.6L2.13 11.68L0.7 9.35L5.63 6.07Z"
        fill="#f8fafc"
      />
      <path
        d="M20.7 21H11.02V18.35L14.21 15.12Q15.9 13.38 16.57 12.45Q17.24 11.52 17.24 10.47Q17.24 9.42 16.68 8.99Q16.13 8.56 15.11 8.56Q13.6 8.56 11.81 8.83L11.27 8.9L11.11 6.48Q13.32 5.8 15.7 5.8Q20.45 5.8 20.45 10.08Q20.45 11.75 19.72 12.97Q19 14.19 17.1 15.93L14.5 18.29H20.7Z"
        fill="#f8fafc"
      />
      <circle cx="21.5" cy="3.6" r="1.75" fill="#fec42d" />
    </svg>
  );
}
