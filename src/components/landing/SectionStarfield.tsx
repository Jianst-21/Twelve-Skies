type SectionStarfieldVariant = "hero" | "nebula-down" | "nebula-up";

interface SectionStarfieldProps {
  variant: SectionStarfieldVariant;
}

const VARIANT_STYLES: Record<
  SectionStarfieldVariant,
  { baseClass: string; textureUrl: string }
> = {
  hero: {
    baseClass: "bg-space-black",
    textureUrl: "/images/neowise/10-star-mini.jpg",
  },
  "nebula-down": {
    baseClass: "bg-neowise-nebula-down",
    textureUrl: "/images/neowise/2-star-mini.jpg",
  },
  "nebula-up": {
    baseClass: "bg-neowise-nebula-up",
    textureUrl: "/images/neowise/2-star-mini.jpg",
  },
};

/**
 * Per-section scrolling starfield backdrop modeled after the Neowise layout:
 * each section owns its gradient ground and 50%-opacity starfield overlay so
 * the cosmos scrolls naturally alongside content instead of staying fixed.
 */
export default function SectionStarfield({ variant }: SectionStarfieldProps) {
  const { baseClass, textureUrl } = VARIANT_STYLES[variant];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${baseClass}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url('${textureUrl}')` }}
      />
    </div>
  );
}
