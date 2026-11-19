"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CONSTELLATIONS } from "@/data/constellations";
import { projectConstellation2D } from "@/lib/constellationProjection";
import { getConstellationBuckets } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

export default function ConstellationLedger() {
  const [activeId, setActiveId] = useState<string>("capricorn");

  const active = useMemo(
    () => CONSTELLATIONS.find((c) => c.id === activeId) || CONSTELLATIONS[0],
    [activeId]
  );

  const projection = useMemo(
    () => projectConstellation2D(active, 440, 290, 38),
    [active]
  );

  const buckets = useMemo(() => getConstellationBuckets(active.id), [active.id]);

  return (
    <section
      id="constellations"
      className="relative z-10 border-b border-white/10 py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary mb-3">
            The Twelve Astronomical Houses
          </h2>
          <p className="text-base text-ink-secondary leading-relaxed">
            Every house carries its own 3D star coordinates, calendar span, and calibrated
            spectral hue designed to stay legible against dark space.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 12-Row Interactive Astronomical Ledger */}
          <div className="lg:col-span-7 rounded-xl border border-white/15 bg-black/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 grid grid-cols-12 text-xs text-ink-muted font-medium">
              <div className="col-span-5">Constellation</div>
              <div className="col-span-5 sm:col-span-4">Calendar Span</div>
              <div className="col-span-2 sm:col-span-3 text-right">Nodes</div>
            </div>

            <div role="listbox" aria-label="Twelve zodiac constellations">
              {CONSTELLATIONS.map((c) => {
                const isSelected = c.id === active.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full min-h-[48px] px-4 py-2.5 grid grid-cols-12 items-center text-left border-b border-white/5 last:border-b-0 transition-colors ${
                      isSelected
                        ? "bg-space-abyss text-ink-primary"
                        : "hover:bg-white/[0.03] text-ink-secondary"
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: c.glowColor }}
                        aria-hidden="true"
                      />
                      <span style={{ color: c.glowColor }} className="shrink-0">
                        <ZodiacGlyph id={c.id} size={16} />
                      </span>
                      <span className="font-display font-semibold text-sm text-ink-primary truncate">
                        {c.name}
                      </span>
                    </div>
                    <div className="col-span-5 sm:col-span-4 font-mono text-[11px] sm:text-xs text-ink-secondary whitespace-nowrap">
                      {c.periodText}
                    </div>
                    <div className="col-span-2 sm:col-span-3 font-mono text-xs text-right text-ink-primary whitespace-nowrap">
                      <span className="sm:hidden">{c.nodes.length}</span>
                      <span className="hidden sm:inline">{c.nodes.length} nodes</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active House Geometry Plate & Bucket Spec */}
          <div className="lg:col-span-5 rounded-xl border border-white/15 bg-space-abyss/75 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span style={{ color: active.glowColor }}>
                  <ZodiacGlyph id={active.id} size={22} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-primary">
                    {active.name}
                  </h3>
                  <p className="font-mono text-xs text-ink-secondary">
                    {active.periodText}
                  </p>
                </div>
              </div>
              <span
                className="font-mono text-xs px-2.5 py-1 rounded border"
                style={{
                  borderColor: `${active.glowColor}50`,
                  color: active.glowColor,
                }}
              >
                {active.nodes.length} Stars
              </span>
            </div>

            {/* Projected 3D Star Geometry */}
            <div className="my-5 rounded-lg border border-white/10 bg-black/70 overflow-hidden">
              <svg
                viewBox="0 0 440 290"
                className="w-full h-56 block"
                role="img"
                aria-label={`${active.name} projected constellation diagram`}
              >
                {projection.lines.map((seg, i) => (
                  <line
                    key={i}
                    x1={seg.from.x}
                    y1={seg.from.y}
                    x2={seg.to.x}
                    y2={seg.to.y}
                    stroke={active.glowColor}
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                  />
                ))}
                {projection.nodes.map((node) => (
                  <g key={node.index} transform={`translate(${node.x}, ${node.y})`}>
                    <circle r="7" fill={active.glowColor} fillOpacity="0.22" />
                    <path
                      d="M0 -8 C0 -3.5 -3.5 0 -8 0 C-3.5 0 0 3.5 0 8 C0 3.5 3.5 0 8 0 C3.5 0 0 -3.5 0 -8 Z"
                      fill="#ffffff"
                    />
                    <text
                      x="10"
                      y="4"
                      fill="#9fb2cc"
                      fontSize="10"
                      fontFamily="var(--font-jetbrains-mono), monospace"
                    >
                      {String(node.index + 1).padStart(2, "0")}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bucket Sequence Summary */}
            <div className="text-xs text-ink-secondary mb-5">
              <div className="font-medium text-ink-primary mb-2">
                Proportional day allocation across {active.nodes.length} nodes:
              </div>
              <div className="font-mono text-cyan-glow">
                {buckets.map((b) => `${b.days}d`).join(" / ")}
              </div>
            </div>

            <Link
              href="/sky"
              className="min-h-[44px] w-full inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors"
            >
              Navigate {active.name} in 3D Sky
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
