"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CONSTELLATIONS, CONSTELLATION_MAP } from "@/data/constellations";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import { getNodeDateRange } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

interface HeroSkySectionProps {
  activeConstellationId: string;
  activeNodeIndex: number | null;
  onSelectConstellation: (constellationId: string) => void;
}

export default function HeroSkySection({
  activeConstellationId,
  activeNodeIndex,
  onSelectConstellation,
}: HeroSkySectionProps) {
  const activeConstellation =
    CONSTELLATION_MAP[activeConstellationId] || CONSTELLATIONS[7];
  const currentIdx = CONSTELLATIONS.findIndex(
    (c) => c.id === activeConstellation.id
  );

  const handlePrev = () => {
    const prev =
      CONSTELLATIONS[(currentIdx - 1 + CONSTELLATIONS.length) % CONSTELLATIONS.length];
    onSelectConstellation(prev.id);
  };

  const handleNext = () => {
    const next = CONSTELLATIONS[(currentIdx + 1) % CONSTELLATIONS.length];
    onSelectConstellation(next.id);
  };

  const matchedSample =
    activeNodeIndex !== null
      ? ILLUSTRATIVE_MEMORIES.find(
          (m) =>
            m.constellationId === activeConstellation.id &&
            m.nodeIndex === activeNodeIndex
        ) || null
      : ILLUSTRATIVE_MEMORIES.find(
          (m) => m.constellationId === activeConstellation.id
        ) || null;

  const displayStarIndex =
    activeNodeIndex !== null
      ? activeNodeIndex
      : matchedSample
      ? matchedSample.nodeIndex
      : null;

  const starDateRange =
    displayStarIndex !== null
      ? getNodeDateRange(activeConstellation.id, displayStarIndex).formattedRange
      : activeConstellation.periodText;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative pointer-events-none lg:min-h-[calc(100dvh-4rem)] flex items-center"
    >
      {/* Localized left-side readability scrim; leaves the right 3D sky unobstructed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[56%] bg-gradient-to-b from-space-black/80 via-space-black/65 to-transparent lg:bg-gradient-to-r lg:from-space-black/88 lg:via-space-black/60 lg:to-transparent"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end lg:items-center">
          {/* Left Column: Direct Thesis, Primary Actions & All-12 Constellation Switcher */}
          <div className="lg:col-span-5 pointer-events-auto min-w-0">
            <h1
              id="hero-heading"
              className="font-display font-bold text-ink-primary tracking-[-0.025em] leading-[1.06] mb-5 break-words"
              style={{ fontSize: "clamp(2.35rem, 4.6vw, 3.75rem)" }}
            >
              Your memories, mapped to the stars.
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-[44ch] mb-8">
              Upload a photo with its date, and Twelve Skies places it on its
              constellation star inside a private 360-degree 3D night sky.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-9">
              <Link
                id="hero-primary-cta"
                href="/sky"
                className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-ink-primary active:scale-[0.99] transition-colors"
              >
                Open 3D Sky
              </Link>
              <Link
                href="/login"
                className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg border border-white/25 bg-space-black/60 text-ink-primary font-medium text-sm hover:border-cyan-glow hover:bg-white/[0.06] active:scale-[0.99] transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Compact 12-Constellation Live 3D Sky Switcher */}
            <div className="pt-5 border-t border-white/12">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="shrink-0"
                    style={{ color: activeConstellation.glowColor }}
                    aria-hidden="true"
                  >
                    <ZodiacGlyph id={activeConstellation.id} size={16} />
                  </span>
                  <span className="font-display text-sm font-semibold text-ink-primary truncate">
                    {activeConstellation.name}
                  </span>
                  <span className="font-mono text-xs text-ink-secondary whitespace-nowrap">
                    {activeConstellation.periodText}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous constellation"
                    className="min-w-[44px] min-h-[44px] xl:min-w-[38px] xl:min-h-[38px] rounded-lg border border-white/15 bg-space-black/80 inline-flex items-center justify-center text-ink-primary hover:border-cyan-glow transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next constellation"
                    className="min-w-[44px] min-h-[44px] xl:min-w-[38px] xl:min-h-[38px] rounded-lg border border-white/15 bg-space-black/80 inline-flex items-center justify-center text-ink-primary hover:border-cyan-glow transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div
                role="tablist"
                aria-label="Switch between all twelve constellations in the 3D sky"
                className="grid grid-cols-6 md:grid-cols-12 lg:grid-cols-6 xl:grid-cols-12 gap-1.5"
              >
                {CONSTELLATIONS.map((c) => {
                  const isSelected = c.id === activeConstellation.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`${c.name} (${c.periodText})`}
                      title={`${c.name} (${c.periodText})`}
                      onClick={() => onSelectConstellation(c.id)}
                      className={`min-h-[44px] xl:min-h-[40px] rounded-lg border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-cyan-glow bg-space-abyss text-ink-primary"
                          : "border-white/12 bg-space-black/80 text-ink-secondary hover:border-white/35 hover:text-ink-primary"
                      }`}
                    >
                      <span
                        style={{ color: isSelected ? c.glowColor : "currentColor" }}
                        aria-hidden="true"
                      >
                        <ZodiacGlyph id={c.id} size={15} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Open Live 3D Constellation Viewport + Single Frosted Lens */}
          <div className="lg:col-span-7 flex flex-col justify-end lg:min-h-[500px] pointer-events-none">
            <div className="lg:mt-auto lg:ml-auto w-full sm:max-w-md pointer-events-auto">
              <div className="rounded-xl border border-white/15 bg-space-abyss/80 backdrop-blur-md p-4">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2.5 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="shrink-0"
                      style={{ color: activeConstellation.glowColor }}
                      aria-hidden="true"
                    >
                      <ZodiacGlyph id={activeConstellation.id} size={15} />
                    </span>
                    <span className="font-mono text-cyan-glow leading-snug">
                      {displayStarIndex !== null
                        ? `${activeConstellation.name} Star ${String(
                            displayStarIndex + 1
                          ).padStart(2, "0")} (${starDateRange})`
                        : `${activeConstellation.name} (${activeConstellation.nodes.length} stars)`}
                    </span>
                  </div>
                  <span className="font-mono text-ink-secondary shrink-0">
                    {matchedSample ? "Sample" : activeConstellation.periodText}
                  </span>
                </div>

                {matchedSample ? (
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-space-black">
                      <Image
                        src={matchedSample.image}
                        alt={matchedSample.imageAlt}
                        fill
                        sizes="80px"
                        priority
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-ink-primary leading-snug">
                        {matchedSample.title}
                      </p>
                      <p className="text-sm text-ink-secondary leading-snug mt-0.5">
                        {matchedSample.location}
                      </p>
                      <p className="font-mono text-xs text-ink-muted mt-1">
                        {matchedSample.displayDate}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {displayStarIndex !== null
                      ? `Star ${String(displayStarIndex + 1).padStart(
                          2,
                          "0"
                        )} covers ${starDateRange}. In your vault, photos taken in this window light up this star.`
                      : `Covers ${activeConstellation.periodText} across ${activeConstellation.nodes.length} stars. Hover or tap any star above, or add photos from this season in your private vault.`}
                  </p>
                )}
              </div>

              <p className="hidden lg:block text-xs text-ink-secondary text-right mt-2.5 pr-1">
                Hover any star in the 3D sky above to inspect it
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
