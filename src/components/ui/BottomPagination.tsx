"use client";

import { CONSTELLATIONS } from "@/data/constellations";
import { ConstellationData } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 select-none">
      {/* 12 Zodiac Astronomical Glyphs Quick Selector */}
      <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-space-black/80 border border-cyan-glow/20 backdrop-blur-md">
        {CONSTELLATIONS.map((c) => {
          const isActive = c.id === currentConstellation.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectConstellation(c)}
              title={`${c.name} (${c.periodText})`}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-cyan-glow text-space-navy font-bold scale-105"
                  : "text-nebula-silver/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <ZodiacGlyph id={c.id} size={14} />
            </button>
          );
        })}
      </div>

      {/* Main Bottom Pagination Pill */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full bg-space-navy/70 border border-cyan-glow/30 backdrop-blur-xl shadow-lg shadow-black/50">
        {/* Prev Button */}
        <button
          type="button"
          onClick={handlePrev}
          title="Rasi Sebelumnya"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-cyan-glow/20 text-white hover:bg-cyan-glow hover:text-space-navy hover:border-cyan-glow transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Current Constellation Info */}
        <div className="px-3 sm:px-5 py-1 text-center min-w-[150px] sm:min-w-[200px]">
          <div className="flex items-center justify-center gap-2">
            <span
              className="flex items-center justify-center"
              style={{ color: currentConstellation.glowColor }}
            >
              <ZodiacGlyph id={currentConstellation.id} size={18} />
            </span>
            <span className="font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase">
              {currentConstellation.name}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-nebula-silver block mt-0.5 font-medium">
            {currentConstellation.periodText}
          </span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          title="Rasi Berikutnya"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-cyan-glow/20 text-white hover:bg-cyan-glow hover:text-space-navy hover:border-cyan-glow transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
