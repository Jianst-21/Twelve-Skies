import React from "react";

interface CelestialLogoProps {
  className?: string;
  size?: number;
}

/**
 * CelestialLogo - Twelve Skies monogram mark.
 * Uses exact Titillium Web Bold vector outlines for "12" with a straight-faceted
 * 8-point astronomical Polaris star, matching the browser favicon across the app.
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
      <path
        d="M20.7 0.5L21.01 2.84L22.01 2.29L21.46 3.29L23.8 3.6L21.46 3.91L22.01 4.91L21.01 4.36L20.7 6.7L20.39 4.36L19.39 4.91L19.94 3.91L17.6 3.6L19.94 3.29L19.39 2.29L20.39 2.84Z"
        fill="#fec42d"
      />
    </svg>
  );
}
