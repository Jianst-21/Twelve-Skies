"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getConstellationAndNode } from "@/lib/dateDistributor";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

const QUICK_DATES = [
  { label: "Jan 08", iso: "2025-01-08" },
  { label: "Jun 04", iso: "2025-06-04" },
  { label: "Aug 14", iso: "2025-08-14" },
];

const JOURNAL_SLIDES = [
  ILLUSTRATIVE_MEMORIES[3], // Mount Bromo (Leo)
  ILLUSTRATIVE_MEMORIES[4], // Altyn-Emel (Sagittarius)
];

interface CapabilitiesSectionProps {
  onDateMapped: (constellationId: string, nodeIndex: number) => void;
}

export default function CapabilitiesSection({
  onDateMapped,
}: CapabilitiesSectionProps) {
  const [dateInput, setDateInput] = useState<string>("2025-08-14");
  const [slideIdx, setSlideIdx] = useState<number>(0);

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateInput);

  const mapping = useMemo(() => {
    if (!isValidDate) return null;
    const parsed = new Date(`${dateInput}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;
    return getConstellationAndNode(dateInput);
  }, [dateInput, isValidDate]);

  const handleDateChange = (nextDate: string) => {
    setDateInput(nextDate);
    if (/^\d{4}-\d{2}-\d{2}$/.test(nextDate)) {
      const parsed = new Date(`${nextDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        const mapped = getConstellationAndNode(nextDate);
        onDateMapped(mapped.constellation.id, mapped.nodeIndex);
      }
    }
  };

  const currentSlide = JOURNAL_SLIDES[slideIdx] || JOURNAL_SLIDES[0];
  const hoverSample = ILLUSTRATIVE_MEMORIES[0]; // Tromso Aurora (Capricorn)
  const indexSamples = [ILLUSTRATIVE_MEMORIES[3], ILLUSTRATIVE_MEMORIES[2]];

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative z-10 pointer-events-none py-16 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-20 sm:space-y-28 lg:space-y-32">
        {/* Section Intro */}
        <div className="max-w-2xl pointer-events-auto rounded-xl bg-space-black/88 px-6 py-5 sm:px-7 sm:py-6 border border-white/12">
          <h2
            id="capabilities-heading"
            className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-ink-primary leading-tight mb-3"
          >
            What you can do inside your sky
          </h2>
          <p className="text-base text-ink-secondary leading-relaxed">
            Twelve Skies replaces endless photo folders with one navigable 3D dome.
            Every feature works directly from the calendar date of your memory.
          </p>
        </div>

        {/* Capability 1: Place a memory by date (live 3D sky sync) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 pointer-events-auto rounded-xl bg-space-black/90 p-6 sm:p-7 border border-white/12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink-primary leading-snug mb-3">
              Pick a date, light its star
            </h3>
            <p className="text-base text-ink-secondary leading-relaxed">
              When you upload a photograph, choose the day it happened. Twelve Skies
              automatically assigns it to the matching star inside that season&apos;s
              constellation, so memories spread cleanly across the year without manual
              folders.
            </p>
          </div>

          <div className="lg:col-span-7 pointer-events-auto rounded-xl border border-white/15 bg-space-abyss/92 p-5 sm:p-7">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-6">
                <label
                  htmlFor="landing-date-input"
                  className="block text-sm font-medium text-ink-primary mb-2"
                >
                  Test any memory date
                </label>
                <input
                  id="landing-date-input"
                  type="date"
                  value={dateInput}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-space-black/85 border border-cyan-glow/35 text-ink-primary font-mono text-sm focus:border-cyan-glow"
                />

                <div className="flex flex-wrap gap-2 mt-3.5">
                  {QUICK_DATES.map((preset) => {
                    const isSelected = dateInput === preset.iso;
                    return (
                      <button
                        key={preset.iso}
                        type="button"
                        onClick={() => handleDateChange(preset.iso)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono border transition-colors ${
                          isSelected
                            ? "border-cyan-glow bg-cyan-glow/15 text-cyan-glow font-semibold"
                            : "border-white/15 bg-space-black/50 text-ink-secondary hover:border-white/35 hover:text-ink-primary"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-6 rounded-lg border border-white/10 bg-space-black/70 p-4 sm:p-5">
                {mapping ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                        style={{
                          borderColor: `${mapping.constellation.glowColor}66`,
                          backgroundColor: `${mapping.constellation.glowColor}14`,
                          color: mapping.constellation.glowColor,
                        }}
                        aria-hidden="true"
                      >
                        <ZodiacGlyph id={mapping.constellation.id} size={20} />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xl font-bold text-ink-primary truncate">
                          {mapping.constellation.name}
                        </div>
                        <div className="font-mono text-xs text-ink-secondary">
                          {mapping.constellation.periodText}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-ink-secondary">Assigned star</span>
                        <span className="text-cyan-glow font-semibold">
                          Star {String(mapping.nodeIndex + 1).padStart(2, "0")} of{" "}
                          {String(mapping.totalNodes).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-ink-secondary">Star date window</span>
                        <span className="text-ink-primary">{mapping.formattedRange}</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-secondary mt-3.5 pt-3 border-t border-white/10">
                      The live 3D sky behind this page turns straight to{" "}
                      {mapping.constellation.name}.
                    </p>
                  </>
                ) : (
                  <div role="alert" className="text-sm text-ink-secondary space-y-2">
                    <p className="text-ink-primary font-medium">
                      Enter a valid calendar date
                    </p>
                    <p>
                      Choose a date from the picker or use one of the preset dates to
                      see its constellation star.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Capability 2: Orbit 360 degrees, hover stars & browse Vault Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 pointer-events-auto rounded-xl border border-white/15 bg-space-abyss/92 p-5 sm:p-7">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Signature Star-Bloom Hover Preview */}
              <div className="sm:col-span-5 flex flex-col items-center text-center p-4 rounded-lg border border-white/10 bg-space-black/65">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 p-0.5 bg-space-abyss"
                  style={{ borderColor: hoverSample.glowColor }}
                >
                  <Image
                    src={hoverSample.image}
                    alt={hoverSample.imageAlt}
                    fill
                    sizes="96px"
                    className="object-cover rounded-full"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="w-px h-5 my-1"
                  style={{
                    background: `linear-gradient(to bottom, ${hoverSample.glowColor}, transparent)`,
                  }}
                />
                <div className="font-mono text-xs text-cyan-glow">
                  {hoverSample.constellationName} Star{" "}
                  {String(hoverSample.nodeIndex + 1).padStart(2, "0")}
                </div>
                <div className="text-sm font-medium text-ink-primary mt-0.5">
                  {hoverSample.title}
                </div>
                <div className="font-mono text-xs text-ink-secondary mt-0.5">
                  Sample hover preview
                </div>
              </div>

              {/* Chronological Vault Index Snippet */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-ink-secondary px-1">
                  <span className="font-medium text-ink-primary">Vault Index</span>
                  <span className="font-mono">Sample entries</span>
                </div>
                {indexSamples.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-lg border border-white/10 bg-space-black/65 flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src={entry.image}
                        alt={entry.imageAlt}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span
                          style={{ color: entry.glowColor }}
                          aria-hidden="true"
                        >
                          <ZodiacGlyph id={entry.constellationId} size={12} />
                        </span>
                        <span className="text-cyan-glow truncate">
                          {entry.constellationName} Star{" "}
                          {String(entry.nodeIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm text-ink-primary leading-snug mt-0.5">
                        {entry.title}
                      </p>
                      <p className="font-mono text-xs text-ink-secondary mt-0.5">
                        {entry.displayDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 pointer-events-auto rounded-xl bg-space-black/90 p-6 sm:p-7 border border-white/12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink-primary leading-snug mb-3">
              Orbit 360 degrees and glimpse memories on hover
            </h3>
            <p className="text-base text-ink-secondary leading-relaxed mb-4">
              Drag freely around twelve zodiac constellations arranged across upper,
              equatorial, and lower night skies. Hover any populated star to see its
              photograph bloom directly from the star core, or open the chronological
              Vault Index to fly straight to any saved moment.
            </p>
            <Link
              href="/sky"
              className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-lg border border-cyan-glow/50 text-cyan-glow text-sm font-semibold hover:bg-cyan-glow hover:text-space-navy transition-colors"
            >
              Launch 3D Dome
            </Link>
          </div>
        </div>

        {/* Capability 3: Open any star's split-view memory journal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 pointer-events-auto rounded-xl bg-space-black/90 p-6 sm:p-7 border border-white/12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink-primary leading-snug mb-3">
              Read and edit inside the split-view journal
            </h3>
            <p className="text-base text-ink-secondary leading-relaxed">
              Click any star to slide open its memory drawer right beside the 3D sky.
              Step through photos taken on that star&apos;s dates, write or edit your
              captions and locations, or add another photograph directly to that
              window.
            </p>
          </div>

          {/* Second (and final) dose-capped frosted glass lens */}
          <div className="lg:col-span-7 pointer-events-auto rounded-xl border border-cyan-glow/30 bg-space-abyss/85 backdrop-blur-md overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  style={{ color: currentSlide.glowColor }}
                  aria-hidden="true"
                >
                  <ZodiacGlyph id={currentSlide.constellationId} size={18} />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-base font-bold text-ink-primary truncate">
                    {currentSlide.constellationName} Star{" "}
                    {String(currentSlide.nodeIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="font-mono text-xs text-cyan-glow">
                    Window: {currentSlide.nodeRange}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs text-ink-secondary shrink-0">
                Sample Journal
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-white/10 bg-space-black mb-4">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-display text-lg font-semibold text-ink-primary">
                    {currentSlide.title}
                  </h4>
                  <p className="text-sm text-ink-secondary leading-relaxed mt-1">
                    {currentSlide.caption}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 font-mono text-xs text-ink-secondary">
                    <span>{currentSlide.displayDate}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin
                        className="w-3.5 h-3.5 text-amber-star"
                        aria-hidden="true"
                      />
                      {currentSlide.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setSlideIdx(
                        (prev) =>
                          (prev - 1 + JOURNAL_SLIDES.length) % JOURNAL_SLIDES.length
                      )
                    }
                    aria-label="Previous sample journal photo"
                    className="min-w-[44px] min-h-[44px] rounded-lg border border-white/15 bg-space-black/60 inline-flex items-center justify-center text-ink-primary hover:border-cyan-glow transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSlideIdx((prev) => (prev + 1) % JOURNAL_SLIDES.length)
                    }
                    aria-label="Next sample journal photo"
                    className="min-w-[44px] min-h-[44px] rounded-lg border border-white/15 bg-space-black/60 inline-flex items-center justify-center text-ink-primary hover:border-cyan-glow transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
