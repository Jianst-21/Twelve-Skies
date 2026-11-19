"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CONSTELLATIONS } from "@/data/constellations";
import { ConstellationData } from "@/types";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

interface BottomPaginationProps {
  currentConstellation: ConstellationData;
  onSelectConstellation: (constellation: ConstellationData) => void;
}

export default function BottomPagination({
  currentConstellation,
  onSelectConstellation,
}: BottomPaginationProps) {
  const currentIndex = CONSTELLATIONS.findIndex((c) => c.id === currentConstellation.id);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + CONSTELLATIONS.length) % CONSTELLATIONS.length;
    onSelectConstellation(CONSTELLATIONS[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % CONSTELLATIONS.length;
    onSelectConstellation(CONSTELLATIONS[nextIndex]);
  };

  return (
    <nav
      aria-label="Constellation switcher"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 select-none max-w-[95vw]"
    >
      {/* 12 Zodiac Astronomical Glyphs Quick Selector */}
      <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md">
        {CONSTELLATIONS.map((c) => {
          const isActive = c.id === currentConstellation.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectConstellation(c)}
              aria-label={`Focus ${c.name} (${c.periodText})`}
              aria-current={isActive ? "true" : undefined}
              title={`${c.name} (${c.periodText})`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive
                  ? "bg-cyan-glow text-space-navy font-bold"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/10"
              }`}
            >
              <ZodiacGlyph id={c.id} size={15} />
            </button>
          );
        })}
      </div>

      {/* Main Constellation Pagination Control */}
      <div className="flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 rounded-xl bg-space-abyss/85 border border-cyan-glow/30 backdrop-blur-md">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous constellation"
          title="Previous constellation"
          className="min-w-[40px] min-h-[40px] rounded-lg flex items-center justify-center bg-black/45 border border-white/15 text-ink-primary hover:bg-cyan-glow hover:text-space-navy hover:border-cyan-glow transition-colors"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="px-2 sm:px-5 py-0.5 text-center min-w-[155px] sm:min-w-[210px]">
          <div className="flex items-center justify-center gap-2">
            <span
              className="flex items-center justify-center"
              style={{ color: currentConstellation.glowColor }}
            >
              <ZodiacGlyph id={currentConstellation.id} size={18} />
            </span>
            <span className="font-display text-sm sm:text-base font-bold tracking-wider text-ink-primary uppercase">
              {currentConstellation.name}
            </span>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-ink-secondary block mt-0.5">
            {currentConstellation.periodText}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next constellation"
          title="Next constellation"
          className="min-w-[40px] min-h-[40px] rounded-lg flex items-center justify-center bg-black/45 border border-white/15 text-ink-primary hover:bg-cyan-glow hover:text-space-navy hover:border-cyan-glow transition-colors"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
