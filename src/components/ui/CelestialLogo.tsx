import React from "react";

interface CelestialLogoProps {
  className?: string;
  size?: number;
}

/**
 * CelestialLogo - Twelve Skies monogram mark.
 * Uses exact Titillium Web Bold vector outlines for "12" with a crisp straight-faceted
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
        d="M7.32 8.44V21.8H4.52V11.6L1.63 13.46L0.35 11.38L4.77 8.44Z"
        fill="#f8fafc"
      />
      <path
        d="M18.25 21.8H9.58V19.43L12.44 16.54Q13.95 14.98 14.55 14.15Q15.15 13.32 15.15 12.38Q15.15 11.44 14.65 11.05Q14.16 10.67 13.25 10.67Q11.89 10.67 10.29 10.91L9.81 10.97L9.66 8.81Q11.65 8.2 13.77 8.2Q18.02 8.2 18.02 12.03Q18.02 13.52 17.38 14.62Q16.73 15.71 15.03 17.27L12.7 19.37H18.25Z"
        fill="#f8fafc"
      />
      <path
        d="M19 0.4L19.4 4.13L20.77 3.33L19.97 4.7L23.7 5.1L19.97 5.5L20.77 6.87L19.4 6.07L19 9.8L18.6 6.07L17.23 6.87L18.03 5.5L14.3 5.1L18.03 4.7L17.23 3.33L18.6 4.13Z"
        fill="#fec42d"
      />
    </svg>
  );
}
