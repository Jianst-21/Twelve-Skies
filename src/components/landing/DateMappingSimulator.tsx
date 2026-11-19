"use client";

import { useMemo, useState } from "react";
import { getConstellationAndNode, getConstellationBuckets } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import SectionStarfield from "@/components/landing/SectionStarfield";

const PRESET_DATES = [
  { label: "Jan 08 · Arctic Fjord", date: "2025-01-08" },
  { label: "Jun 04 · Sahara Dusk", date: "2025-06-04" },
  { label: "Jul 12 · Baa Atoll", date: "2025-07-12" },
  { label: "Aug 14 · Mount Bromo", date: "2025-08-14" },
];

export default function DateMappingSimulator() {
  const [dateInput, setDateInput] = useState<string>("2025-08-14");

  const mapping = useMemo(() => {
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(dateInput);
    return getConstellationAndNode(valid ? dateInput : "2025-08-14");
  }, [dateInput]);

  const buckets = useMemo(
    () => getConstellationBuckets(mapping.constellation.id, mapping.nodeStartDate.getFullYear()),
    [mapping.constellation.id, mapping.nodeStartDate]
  );

  const baseDays = Math.floor(mapping.totalDays / mapping.totalNodes);
  const remainderDays = mapping.totalDays % mapping.totalNodes;

  return (
    <section
      id="date-engine"
      className="relative border-b border-white/10 py-16 sm:py-24"
    >
      <SectionStarfield variant="nebula-down" />
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Explanation & Live Date Picker */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary mb-4">
              Every Date Has Its Own Star
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Pick the day a photograph was taken, and Twelve Skies places it inside that season&apos;s
              constellation. Days flow evenly across the stars so no moment gets lost or crowded.
            </p>

            {/* Real Interactive Date Input */}
            <div className="rounded-xl border border-white/15 bg-space-abyss/75 p-5">
              <label
                htmlFor="simulator-date"
                className="block text-sm font-medium text-ink-primary mb-2"
              >
                Try any memory date
              </label>
              <input
                id="simulator-date"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/60 border border-cyan-glow/30 text-ink-primary font-mono text-sm focus:outline-none focus:border-cyan-glow"
              />

              <div className="mt-4">
                <span className="block text-xs text-ink-muted mb-2">
                  Jump to a sample date:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_DATES.map((preset) => {
                    const isSelected = dateInput === preset.date;
                    return (
                      <button
                        key={preset.date}
                        type="button"
                        onClick={() => setDateInput(preset.date)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? "border-cyan-glow bg-cyan-glow/15 text-cyan-glow"
                            : "border-white/10 bg-white/[0.02] text-ink-secondary hover:border-white/25 hover:text-ink-primary"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Deterministic Formula Readout & Proportional Bucket Strip */}
          <div className="lg:col-span-7 rounded-xl border border-white/15 bg-black/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{
                    borderColor: `${mapping.constellation.glowColor}55`,
                    backgroundColor: `${mapping.constellation.glowColor}14`,
                    color: mapping.constellation.glowColor,
                  }}
                >
                  <ZodiacGlyph id={mapping.constellation.id} size={24} />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-ink-primary">
                    {mapping.constellation.name}
                  </div>
                  <div className="font-mono text-xs text-ink-secondary">
                    {mapping.constellation.periodText} · {mapping.totalDays} days total
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-mono text-xs text-ink-muted">Destination Star</div>
                <div className="font-mono text-lg font-semibold text-cyan-glow">
                  Star #{String(mapping.nodeIndex + 1).padStart(2, "0")} in {mapping.constellation.name}
                </div>
                <div className="font-mono text-xs text-ink-secondary">
                  Dates: {mapping.formattedRange}
                </div>
              </div>
            </div>

            {/* Season & Star Span Summary */}
            <div className="grid grid-cols-3 gap-4 py-5 border-b border-white/10 font-mono text-xs">
              <div>
                <div className="text-ink-muted mb-1">Season Length</div>
                <div className="text-base text-ink-primary font-semibold">
                  {mapping.totalDays} days
                </div>
              </div>
              <div>
                <div className="text-ink-muted mb-1">Constellation Stars</div>
                <div className="text-base text-ink-primary font-semibold">
                  {mapping.totalNodes} stars
                </div>
              </div>
              <div>
                <div className="text-ink-muted mb-1">Days Per Star</div>
                <div className="text-base text-amber-star font-semibold">
                  {remainderDays > 0 ? `${baseDays} to ${baseDays + 1} days` : `${baseDays} days`}
                </div>
              </div>
            </div>

            {/* Date Windows Across Stars */}
            <div className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                <span className="text-ink-secondary font-medium">
                  Date windows across {mapping.constellation.name}
                </span>
                <span className="font-mono text-ink-muted">
                  Matching star highlighted
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {buckets.map((bucket) => {
                  const isTarget = bucket.nodeIndex === mapping.nodeIndex;
                  return (
                    <div
                      key={bucket.nodeIndex}
                      className={`p-3 rounded-lg border transition-colors ${
                        isTarget
                          ? "border-cyan-glow bg-space-abyss text-ink-primary"
                          : "border-white/10 bg-white/[0.02] text-ink-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs mb-1">
                        <span className={isTarget ? "text-cyan-glow font-bold" : "text-ink-primary"}>
                          Star {String(bucket.nodeIndex + 1).padStart(2, "0")}
                        </span>
                        <span>{bucket.days}d</span>
                      </div>
                      <div className="font-mono text-[11px] text-ink-muted truncate">
                        {bucket.formattedRange}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
