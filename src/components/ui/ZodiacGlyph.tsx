import React from "react";

interface ZodiacGlyphProps {
  id: string;
  className?: string;
  size?: number;
}

/**
 * ZodiacGlyph - Crisp, authentic astronomical vector glyphs for the 12 zodiac signs.
 * Replaces OS raw unicode emojis (which render as colorful cartoon emojis)
 * with sharp, scalable SVG celestial line art.
 */
export default function ZodiacGlyph({ id, className = "", size = 20 }: ZodiacGlyphProps) {
  const normId = id.toLowerCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={`${id} astronomical symbol`}
    >
      {normId === "aries" && (
        <>
          <path d="M12 21V9" />
          <path d="M12 9C12 5.5 8.5 3.5 5 5C3.5 6 3 8 4 9.5" />
          <path d="M12 9C12 5.5 15.5 3.5 19 5C20.5 6 21 8 20 9.5" />
        </>
      )}

      {normId === "taurus" && (
        <>
          <circle cx="12" cy="15" r="5.5" />
          <path d="M5 4.5C6.5 7.5 9 8.5 12 8.5C15 8.5 17.5 7.5 19 4.5" />
        </>
      )}

      {normId === "gemini" && (
        <>
          <path d="M4 4C8 6 16 6 20 4" />
          <path d="M4 20C8 18 16 18 20 20" />
          <line x1="8.5" y1="5.2" x2="8.5" y2="18.8" />
          <line x1="15.5" y1="5.2" x2="15.5" y2="18.8" />
        </>
      )}

      {normId === "cancer" && (
        <>
          <circle cx="7.5" cy="9.5" r="2.5" />
          <path d="M7.5 7C14 7 17.5 9.5 17.5 12" />
          <circle cx="16.5" cy="14.5" r="2.5" />
          <path d="M16.5 17C10 17 6.5 14.5 6.5 12" />
        </>
      )}

      {normId === "leo" && (
        <>
          <circle cx="6.5" cy="15.5" r="2.5" />
          <path d="M7.5 13.5C7.5 9 10 5 14 5C17.5 5 19 7.5 18 10.5C17 13.5 14 17 18 19C19.5 19.8 21 18.5 21 17" />
        </>
      )}

      {normId === "virgo" && (
        <>
          <path d="M4 7V17" />
          <path d="M4 10C5 7.5 8 7.5 9 10V17" />
          <path d="M9 10C10 7.5 13 7.5 14 10V17C14 19 16 20 18 18C19.5 16.5 19 13.5 16 13.5C14 13.5 13 15 14 17L18.5 21.5" />
        </>
      )}

      {normId === "libra" && (
        <>
          <line x1="4" y1="20" x2="20" y2="20" />
          <path d="M4 14H8C8 11.8 9.8 10 12 10C14.2 10 16 11.8 16 14H20" />
        </>
      )}

      {normId === "scorpio" && (
        <>
          <path d="M4 7V17" />
          <path d="M4 10C5 7.5 8 7.5 9 10V17" />
          <path d="M9 10C10 7.5 13 7.5 14 10V17C14 19 16 20 19 19L21 21" />
          <path d="M21 17V21H17" />
        </>
      )}

      {normId === "sagittarius" && (
        <>
          <line x1="5" y1="19" x2="19" y2="5" />
          <path d="M12 5H19V12" />
          <line x1="8.5" y1="11.5" x2="12.5" y2="15.5" />
        </>
      )}

      {normId === "capricorn" && (
        <>
          <path d="M4 7V15C4 16.5 5.5 17.5 7 16.5L12 7V15C12 18.5 16 19.5 17.5 17C18.5 15.5 17 13.5 15 14.5C13.5 15.5 14.5 18.5 16.5 18.5" />
        </>
      )}

      {normId === "aquarius" && (
        <>
          <path d="M3 9L6.5 6L10 9L13.5 6L17 9L20.5 6" />
          <path d="M3 17L6.5 14L10 17L13.5 14L17 17L20.5 14" />
        </>
      )}

      {normId === "pisces" && (
        <>
          <path d="M6 4C9 8 9 16 6 20" />
          <path d="M18 4C15 8 15 16 18 20" />
          <line x1="4.5" y1="12" x2="19.5" y2="12" />
        </>
      )}
    </svg>
  );
}
