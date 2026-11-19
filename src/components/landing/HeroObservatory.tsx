"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONSTELLATIONS } from "@/data/constellations";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import { projectConstellation2D } from "@/lib/constellationProjection";
import { getConstellationBuckets } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import SectionStarfield from "@/components/landing/SectionStarfield";

export default function HeroObservatory() {
  // Default to Leo and the exact computed node for the Mount Bromo illustrative entry
  const defaultMemory = ILLUSTRATIVE_MEMORIES[3];
  const [selectedId, setSelectedId] = useState<string>(defaultMemory.constellationId);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(defaultMemory.nodeIndex);

  const activeConstellation = useMemo(
    () => CONSTELLATIONS.find((c) => c.id === selectedId) || CONSTELLATIONS[7],
    [selectedId]
  );

  const projection = useMemo(
    () => projectConstellation2D(activeConstellation, 560, 340, 44),
    [activeConstellation]
  );

  const buckets = useMemo(
    () => getConstellationBuckets(activeConstellation.id),
    [activeConstellation.id]
  );

  const handleSelectConstellation = (id: string) => {
    setSelectedId(id);
    const matchingMemory = ILLUSTRATIVE_MEMORIES.find((m) => m.constellationId === id);
    setSelectedNodeIdx(matchingMemory ? matchingMemory.nodeIndex : 0);
  };

  const activeBucket = buckets[selectedNodeIdx] || buckets[0];
  const activePoint = projection.nodes[selectedNodeIdx] || projection.nodes[0];

  // Find illustrative memory attached to this constellation/node if available
  const matchedMemory =
    ILLUSTRATIVE_MEMORIES.find(
      (m) => m.constellationId === activeConstellation.id && m.nodeIndex === selectedNodeIdx
    ) ||
    ILLUSTRATIVE_MEMORIES.find((m) => m.constellationId === activeConstellation.id) ||
    ILLUSTRATIVE_MEMORIES[3]; // Fallback illustrative plate with clear provenance

  return (
    <section
      id="observatory"
      className="relative border-b border-white/10"
    >
      <SectionStarfield variant="hero" />
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-8 lg:pt-14 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Opening Thesis & Actions */}
          <div className="lg:col-span-5">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.025em] text-ink-primary leading-[1.05] mb-5">
              Disturb the Dark, Find Your Stars
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-[46ch] mb-7">
              Twelve Skies maps personal photographs into twelve 3D zodiac constellations,
              placing every moment on its exact star coordinate by calendar date.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <Link
                id="hero-primary-cta"
                href="/sky"
                className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors"
              >
                Open 3D Sky
              </Link>
              <Link
                href="/login"
                className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg border border-white/20 text-ink-primary font-medium text-sm hover:border-cyan-glow/60 hover:bg-white/[0.04] transition-colors"
              >
                Sign In to Vault
              </Link>
            </div>

            {/* Technical Observatory Coordinates (Factual Architecture Specs) */}
            <dl className="grid grid-cols-3 gap-4 pt-5 border-t border-white/10 text-xs">
              <div>
                <dt className="text-ink-muted mb-1">Dome Geometry</dt>
                <dd className="font-mono text-ink-primary font-medium">360 deg Orbit</dd>
              </div>
              <div>
                <dt className="text-ink-muted mb-1">Mapping Law</dt>
                <dd className="font-mono text-ink-primary font-medium">B = floor(D/N)</dd>
              </div>
              <div>
                <dt className="text-ink-muted mb-1">Privacy Mode</dt>
                <dd className="font-mono text-ink-primary font-medium">Private Only</dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Interactive Bioluminescent Constellation Viewport + Single Frosted Lens */}
          <div className="lg:col-span-7">
            <div className="relative rounded-xl border border-cyan-glow/20 bg-space-abyss/40 overflow-hidden">
              {/* Top Coordinate Readout Bar */}
              <div className="px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span style={{ color: activeConstellation.glowColor }}>
                    <ZodiacGlyph id={activeConstellation.id} size={16} />
                  </span>
                  <span className="font-display font-semibold text-ink-primary">
                    {activeConstellation.name}
                  </span>
                  <span className="font-mono text-ink-muted">
                    {activeConstellation.periodText}
                  </span>
                </div>
                <span className="font-mono text-cyan-glow">
                  Node {String(selectedNodeIdx + 1).padStart(2, "0")} of{" "}
                  {String(activeConstellation.nodes.length).padStart(2, "0")} ({activeBucket.formattedRange})
                </span>
              </div>

              {/* Interactive Star Constellation Canvas */}
              <div className="relative h-[300px] sm:h-[340px]">
                <svg
                  viewBox="0 0 560 340"
                  className="w-full h-full block"
                  role="img"
                  aria-label={`${activeConstellation.name} constellation interactive star map`}
                >
                  {/* Subtle equatorial reticle */}
                  <circle
                    cx="280"
                    cy="170"
                    r="142"
                    fill="none"
                    stroke="rgba(124, 222, 228, 0.08)"
                    strokeDasharray="3 5"
                  />
                  <line
                    x1="28"
                    y1="170"
                    x2="532"
                    y2="170"
                    stroke="rgba(255, 255, 255, 0.05)"
                  />

                  {/* Connecting filaments */}
                  {projection.lines.map((seg, i) => (
                    <line
                      key={i}
                      x1={seg.from.x}
                      y1={seg.from.y}
                      x2={seg.to.x}
                      y2={seg.to.y}
                      stroke={activeConstellation.glowColor}
                      strokeOpacity="0.65"
                      strokeWidth="1.6"
                    />
                  ))}

                  {/* Hairline leader connecting active star node toward the inspection lens */}
                  {activePoint && (
                    <line
                      x1={activePoint.x}
                      y1={activePoint.y}
                      x2={395}
                      y2={252}
                      stroke="#7cdee4"
                      strokeOpacity="0.5"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Clickable 4-point sparkle star nodes */}
                  {projection.nodes.map((node) => {
                    const isActive = node.index === selectedNodeIdx;
                    const scale = isActive ? 1.4 : 0.9;
                    return (
                      <g
                        key={node.index}
                        transform={`translate(${node.x}, ${node.y})`}
                        className="cursor-pointer"
                        onClick={() => setSelectedNodeIdx(node.index)}
                      >
                        {/* Generous invisible hit area */}
                        <circle r="18" fill="transparent" />

                        {/* Outer active ring */}
                        {isActive && (
                          <circle
                            r="15"
                            fill="none"
                            stroke="#7cdee4"
                            strokeWidth="1.2"
                            strokeOpacity="0.85"
                          />
                        )}

                        {/* Luminous halo */}
                        <circle
                          r={isActive ? 10 : 6}
                          fill={activeConstellation.glowColor}
                          fillOpacity={isActive ? 0.36 : 0.2}
                        />

                        {/* 4-point sparkle star */}
                        <path
                          d="M0 -10 C0 -4.5 -4.5 0 -10 0 C-4.5 0 0 4.5 0 10 C0 4.5 4.5 0 10 0 C4.5 0 0 -4.5 0 -10 Z"
                          transform={`scale(${scale})`}
                          fill="#ffffff"
                        />
                        <circle
                          r="2.2"
                          fill={isActive ? "#7cdee4" : activeConstellation.glowColor}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Single Dose-Capped Frosted Inspection Lens (Illustrative Preview) */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-[336px] rounded-xl border border-cyan-glow/35 bg-space-abyss/80 backdrop-blur-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-md overflow-hidden border border-white/15 shrink-0">
                      <Image
                        src={matchedMemory.image}
                        alt={matchedMemory.imageAlt}
                        fill
                        sizes="64px"
                        priority
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                        <span className="text-cyan-glow whitespace-nowrap">
                          {matchedMemory.constellationName} · {matchedMemory.nodeNumberLabel}
                        </span>
                        <span className="text-ink-muted whitespace-nowrap">
                          Illustrative Preview
                        </span>
                      </div>
                      <p className="font-display text-sm font-semibold text-ink-primary truncate mt-0.5">
                        {matchedMemory.title}
                      </p>
                      <p className="text-xs text-ink-secondary truncate">
                        {matchedMemory.location} · {matchedMemory.displayDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Node Bucket Switcher Bar */}
              <div className="px-4 py-2.5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-ink-muted">Select star node:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {buckets.map((bucket) => {
                    const isActive = bucket.nodeIndex === selectedNodeIdx;
                    return (
                      <button
                        key={bucket.nodeIndex}
                        type="button"
                        onClick={() => setSelectedNodeIdx(bucket.nodeIndex)}
                        aria-label={`Inspect Star Node ${bucket.nodeIndex + 1} (${bucket.formattedRange})`}
                        className={`min-w-[32px] h-7 px-2 rounded font-mono text-[11px] transition-colors ${
                          isActive
                            ? "bg-cyan-glow text-space-navy font-bold"
                            : "bg-white/[0.04] text-ink-secondary hover:text-ink-primary hover:bg-white/[0.1]"
                        }`}
                      >
                        {String(bucket.nodeIndex + 1).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Constellation Ecliptic Meridian Horizon Strip */}
        <div className="mt-8 pt-5 border-t border-white/10">
          <div
            role="tablist"
            aria-label="Select constellation preview"
            className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5"
          >
            {CONSTELLATIONS.map((c) => {
              const isSelected = c.id === activeConstellation.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectConstellation(c.id)}
                  className={`min-h-[44px] px-2 py-2 rounded-lg border text-left transition-colors flex items-center justify-center lg:justify-start gap-1.5 ${
                    isSelected
                      ? "border-cyan-glow bg-space-abyss text-ink-primary"
                      : "border-white/5 bg-white/[0.01] text-ink-secondary hover:border-white/20 hover:text-ink-primary"
                  }`}
                >
                  <span
                    className="shrink-0"
                    style={{ color: isSelected ? c.glowColor : "currentColor" }}
                  >
                    <ZodiacGlyph id={c.id} size={14} />
                  </span>
                  <span className="text-[11px] font-medium whitespace-nowrap">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
