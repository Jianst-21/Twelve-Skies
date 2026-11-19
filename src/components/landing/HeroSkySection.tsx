"use client";

import Image from "next/image";
import Link from "next/link";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import { CONSTELLATION_MAP } from "@/data/constellations";
import { getNodeDateRange } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

export const HERO_SAMPLE_IDS = [
  "bromo-perseids",
  "aurora-tromso",
  "maldives-tide",
] as const;

interface HeroSkySectionProps {
  activeConstellationId: string;
  activeNodeIndex: number | null;
  activeSampleId: string;
  onSelectSample: (sampleId: string) => void;
}

export default function HeroSkySection({
  activeConstellationId,
  activeNodeIndex,
  activeSampleId,
  onSelectSample,
}: HeroSkySectionProps) {
  const heroSamples = HERO_SAMPLE_IDS.map(
    (id) => ILLUSTRATIVE_MEMORIES.find((m) => m.id === id) || ILLUSTRATIVE_MEMORIES[0]
  );

  const activeSample =
    ILLUSTRATIVE_MEMORIES.find((m) => m.id === activeSampleId) ||
    ILLUSTRATIVE_MEMORIES.find(
      (m) =>
        m.constellationId === activeConstellationId &&
        (activeNodeIndex === null || m.nodeIndex === activeNodeIndex)
    ) ||
    heroSamples[0];

  const activeConstellation =
    CONSTELLATION_MAP[activeConstellationId] ||
    CONSTELLATION_MAP[activeSample.constellationId];

  const activeStarIndex =
    activeNodeIndex !== null ? activeNodeIndex : activeSample.nodeIndex;
  const starDateRange = getNodeDateRange(
    activeConstellation.id,
    activeStarIndex
  ).formattedRange;

  const isMatchedSample =
    activeSample.constellationId === activeConstellation.id &&
    activeSample.nodeIndex === activeStarIndex;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative pointer-events-none lg:min-h-[calc(100dvh-4rem)] flex items-center"
    >
      {/* Localized left-side readability scrim; leaves the right 3D sky unobstructed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-b from-space-black/80 via-space-black/65 to-transparent lg:bg-gradient-to-r lg:from-space-black/88 lg:via-space-black/60 lg:to-transparent"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end lg:items-center">
          {/* Left Column: Direct Thesis, Primary Actions & Accessible 3D Star Switcher */}
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

            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <Link
                id="hero-primary-cta"
                href="/sky"
                className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-ink-primary active:scale-[0.99] transition-colors"
              >
                Open 3D Sky
              </Link>
              <Link
                href="/login"
                className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg border border-white/25 bg-space-black/40 text-ink-primary font-medium text-sm hover:border-cyan-glow hover:bg-white/[0.06] active:scale-[0.99] transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Interactive 3D Sky Sample Focus Controls */}
            <div className="pt-6 border-t border-white/12">
              <p className="text-sm text-ink-secondary mb-3">
                Aim the live 3D sky at a sample memory:
              </p>
              <div
                role="tablist"
                aria-label="Preview sample memories in the 3D sky"
                className="flex flex-wrap gap-2"
              >
                {heroSamples.map((sample) => {
                  const isSelected =
                    activeConstellation.id === sample.constellationId &&
                    activeStarIndex === sample.nodeIndex;
                  const shortDate = sample.displayDate.replace(/, \d{4}$/, "");

                  return (
                    <button
                      key={sample.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => onSelectSample(sample.id)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-lg border text-sm inline-flex items-center gap-2 transition-colors ${
                        isSelected
                          ? "border-cyan-glow bg-space-abyss/92 text-ink-primary font-medium"
                          : "border-white/15 bg-space-black/85 text-ink-secondary hover:border-white/35 hover:text-ink-primary"
                      }`}
                    >
                      <span
                        className="shrink-0"
                        style={{ color: sample.glowColor }}
                        aria-hidden="true"
                      >
                        <ZodiacGlyph id={sample.constellationId} size={15} />
                      </span>
                      <span>
                        {sample.constellationName}, {shortDate}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Open Live 3D Constellation Viewport + Single Frosted Sample Lens */}
          <div className="lg:col-span-7 flex flex-col justify-end lg:min-h-[460px] pointer-events-none">
            <div className="lg:mt-auto lg:ml-auto w-full sm:max-w-md pointer-events-auto">
              <div className="rounded-xl border border-white/15 bg-space-abyss/80 backdrop-blur-md p-4">
                <div className="flex items-center justify-between gap-3 mb-2.5 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      style={{ color: activeConstellation.glowColor }}
                      aria-hidden="true"
                    >
                      <ZodiacGlyph id={activeConstellation.id} size={15} />
                    </span>
                    <span className="font-mono text-cyan-glow truncate">
                      {activeConstellation.name} Star{" "}
                      {String(activeStarIndex + 1).padStart(2, "0")} ({starDateRange})
                    </span>
                  </div>
                  <span className="font-mono text-ink-secondary shrink-0">
                    Sample
                  </span>
                </div>

                {isMatchedSample ? (
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-space-black">
                      <Image
                        src={activeSample.image}
                        alt={activeSample.imageAlt}
                        fill
                        sizes="80px"
                        priority
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-ink-primary leading-snug">
                        {activeSample.title}
                      </p>
                      <p className="text-sm text-ink-secondary leading-snug mt-0.5">
                        {activeSample.location}
                      </p>
                      <p className="font-mono text-xs text-ink-muted mt-1">
                        {activeSample.displayDate}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Empty star window in {activeConstellation.name}. In your private
                    vault, any photo taken during {starDateRange} lights up this star.
                  </p>
                )}
              </div>

              <p className="hidden lg:block text-xs text-ink-secondary text-right mt-2.5 pr-1">
                Hover or click any star in the live 3D sky above
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
