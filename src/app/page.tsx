"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONSTELLATIONS } from "@/data/constellations";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

export default function LandingPage() {
  // Interactive state for Hero constellation preview
  const [activeHeroConstellation, setActiveHeroConstellation] = useState<
    "leo" | "sagittarius" | "capricorn"
  >("leo");

  // Constellation data for the interactive canvas preview (no emoji symbols)
  const heroConstellationPreviews = {
    leo: {
      name: "Leo",
      period: "Jul 23 to Aug 22",
      glowColor: "#F59E0B",
      nodeCount: 9,
      featuredMemory: {
        title: "Perseid Meteor Watch from the Summit",
        location: "Mount Bromo Crater, East Java",
        date: "August 14, 2025",
        image: "/images/vault/memory-mountain.jpg",
        caption:
          "Wrapped in blankets at 2,300 meters, tracking shooting stars through the galactic core of the Milky Way.",
        nodeIndex: "04",
        coordinates: "RA 10h 08m / Dec +11°58'",
      },
    },
    sagittarius: {
      name: "Sagittarius",
      period: "Nov 22 to Dec 21",
      glowColor: "#818CF8",
      nodeCount: 11,
      featuredMemory: {
        title: "Campfire Beneath the Arch of the Galaxy",
        location: "Altyn-Emel National Park",
        date: "December 05, 2025",
        image: "/images/vault/stargazing-camp.jpg",
        caption:
          "Quiet warmth in the winter desert as the archer's constellation pointed toward the galactic center.",
        nodeIndex: "07",
        coordinates: "RA 19h 05m / Dec -25°12'",
      },
    },
    capricorn: {
      name: "Capricorn",
      period: "Dec 22 to Jan 19",
      glowColor: "#34D399",
      nodeCount: 6,
      featuredMemory: {
        title: "Midnight Aurora over the Arctic Fjords",
        location: "Tromsø, Norway",
        date: "January 08, 2025",
        image: "/images/vault/memory-aurora.jpg",
        caption:
          "The emerald curtains of the northern lights reflected over mirror-still fjord waters at sub-zero temperatures.",
        nodeIndex: "02",
        coordinates: "RA 21h 02m / Dec -17°30'",
      },
    },
  };

  const activePreview = heroConstellationPreviews[activeHeroConstellation];

  return (
    <div className="relative min-h-screen bg-space-black text-white selection:bg-cyan-glow selection:text-space-navy overflow-x-hidden">
      {/* 
        ========================================================================
        AUTHENTIC CONTINUOUS COSMIC BACKGROUND LAYERS
        ========================================================================
      */}
      {/* Layer 1: Primary High-Density Starfield (Fixed Cover) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-screen"
        style={{
          backgroundImage: "url('/images/neowise/10-star-mini.jpg')",
        }}
      />

      {/* Layer 2: Deep Space Nebulae & Navy/Black Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-space-black via-space-navy/35 to-space-black opacity-90" />

      {/* Layer 3: Secondary Star Dust & Constellation Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-top opacity-30 mix-blend-lighten"
        style={{
          backgroundImage: "url('/images/neowise/2-star-mini.jpg')",
        }}
      />

      {/* Layer 4: Ambient Radial Cosmic Lighting Orbs */}
      <div className="pointer-events-none fixed -top-40 -left-40 z-0 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[140px]" />
      <div className="pointer-events-none fixed top-1/3 -right-40 z-0 w-[650px] h-[650px] rounded-full bg-space-navy/60 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-1/4 left-1/4 z-0 w-[550px] h-[550px] rounded-full bg-cyan-glow/5 blur-[130px]" />

      {/* ========================================================================
          HEADER / NAVBAR (Minimal, Transparent Glass)
          ======================================================================== */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 pt-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl border border-cyan-glow/30 bg-white/[0.04] flex items-center justify-center text-cyan-glow transition-colors group-hover:border-cyan-glow">
              <CelestialLogo size={22} />
            </div>
            <div>
              <span className="font-display text-base sm:text-lg font-bold tracking-[0.16em] uppercase text-white block leading-tight">
                Twelve Skies
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-glow uppercase block">
                Celestial Photo Vault
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-nebula-silver">
            <a
              href="#overview"
              className="hover:text-white transition-colors"
            >
              Overview
            </a>
            <a
              href="#architecture"
              className="hover:text-white transition-colors"
            >
              Architecture
            </a>
            <a
              href="#constellations"
              className="hover:text-white transition-colors"
            >
              12 Constellations
            </a>
            <a
              href="#memories"
              className="hover:text-white transition-colors"
            >
              Vault Gallery
            </a>
          </nav>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-xs font-medium text-white hover:border-cyan-glow/60 hover:bg-white/[0.07] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/sky"
              className="px-5 py-2.5 rounded-xl bg-cyan-glow text-space-navy text-xs font-bold shadow-[0_0_20px_rgba(124,222,228,0.3)] hover:bg-white transition-all"
            >
              Explore 3D Sky
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================
          HERO SECTION: REFINED CELESTIAL PHOTO VAULT
          ======================================================================== */}
      <section
        id="overview"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Clear Typographic Presentation */}
          <div className="lg:col-span-6 text-left">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow block mb-4">
              3D Astronomical Memory Archive
            </span>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-[1.08] mb-6">
              Your Life Memories, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow via-white to-amber-star">
                Written in the Stars
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="font-body text-nebula-silver text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Twelve Skies replaces flat photo grids with an interactive 360-degree
              celestial dome. Each photograph is mathematically mapped into 12
              zodiac constellations according to the exact calendar day it occurred.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/sky"
                className="px-8 py-3.5 rounded-xl bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(124,222,228,0.35)] hover:bg-white transition-all text-center"
              >
                Launch 3D Sky Dome
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-xl border border-white/20 bg-white/[0.03] backdrop-blur-md text-white font-medium text-xs uppercase tracking-wider hover:border-cyan-glow/60 hover:bg-white/[0.08] transition-all text-center"
              >
                Access Private Vault
              </Link>
            </div>

            {/* Factual Specification Details */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-nebula-silver font-mono pt-4 border-t border-white/10">
              <div>
                <span className="text-white font-semibold">12</span> Zodiac Sectors
              </div>
              <span className="text-white/20">/</span>
              <div>
                <span className="text-white font-semibold">360°</span> Free Orbit
              </div>
              <span className="text-white/20">/</span>
              <div>
                <span className="text-white font-semibold">B = ⌊D/N⌋</span> Exact Mapping
              </div>
              <span className="text-white/20">/</span>
              <div>
                <span className="text-white font-semibold">Encrypted</span> Private Storage
              </div>
            </div>
          </div>

          {/* Right Column: Luminous, Transparent Canvas Mockup */}
          <div className="lg:col-span-6 relative">
            {/* Luminous, Transparent Container */}
            <div className="relative rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Header Status Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs font-mono">
                <div className="text-cyan-glow uppercase tracking-wider">
                  Celestial Sphere Viewport
                </div>
                <div className="text-nebula-silver">
                  Epoch: 2025 - 2026
                </div>
              </div>

              {/* Viewport Simulation: Transparent Window Over Stargazer Photography */}
              <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src="/images/vault/hero-stargazer.jpg"
                  alt="Celestial night sky over mountains"
                  fill
                  className="object-cover opacity-60 filter brightness-90"
                  priority
                />

                {/* Subtle soft transparent vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-space-black/70 via-transparent to-transparent pointer-events-none" />

                {/* SVG Simulated Constellation Geometry */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 60,180 L 130,120 L 220,110 L 290,160 L 340,210 M 130,120 L 210,190 L 290,160 M 220,110 L 210,190"
                    stroke={activePreview.glowColor}
                    strokeWidth="1.6"
                    strokeOpacity="0.65"
                    strokeDasharray="4 2"
                  />

                  {[
                    [60, 180],
                    [130, 120],
                    [220, 110],
                    [210, 190],
                    [290, 160],
                    [340, 210],
                  ].map(([x, y], idx) => (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={idx === 4 ? 6 : 3.5}
                        fill="#FFFFFF"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={idx === 4 ? 12 : 7}
                        fill={activePreview.glowColor}
                        fillOpacity={idx === 4 ? 0.5 : 0.25}
                      />
                    </g>
                  ))}
                </svg>

                {/* Anchored Transparent Memory Card (Node 04) */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-xl border border-white/20 bg-space-navy/40 backdrop-blur-xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/30 shrink-0">
                      <Image
                        src={activePreview.featuredMemory.image}
                        alt={activePreview.featuredMemory.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider">
                        {activePreview.name} / Node {activePreview.featuredMemory.nodeIndex}
                      </div>
                      <h4 className="text-xs font-display font-bold text-white truncate mt-0.5">
                        {activePreview.featuredMemory.title}
                      </h4>
                      <p className="text-[11px] text-nebula-silver truncate mt-0.5">
                        {activePreview.featuredMemory.location}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-nebula-silver">
                    <span>{activePreview.featuredMemory.date}</span>
                    <span className="text-cyan-glow">Archived</span>
                  </div>
                </div>
              </div>

              {/* Constellation Selector Tabs (Pure Typographic Names, No Emojis) */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-nebula-silver">
                  Select Constellation:
                </span>
                <div className="flex items-center gap-2">
                  {(["leo", "sagittarius", "capricorn"] as const).map((key) => {
                    const c = heroConstellationPreviews[key];
                    const isActive = activeHeroConstellation === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveHeroConstellation(key)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
                          isActive
                            ? "bg-white/15 border border-cyan-glow text-white shadow-[0_0_10px_rgba(124,222,228,0.25)]"
                            : "bg-white/[0.03] border border-white/10 text-nebula-silver hover:text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 1: ASYMMETRIC SYSTEM ARCHITECTURE (TRANSPARENT GLASS PANELS)
          ======================================================================== */}
      <section
        id="architecture"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
      >
        <div className="text-left max-w-2xl mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow block mb-3">
            System Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            How Twelve Skies Operates
          </h2>
          <p className="font-body text-nebula-silver text-base leading-relaxed">
            A purposeful combination of real-time Three.js 3D rendering and
            proportional temporal mathematics.
          </p>
        </div>

        {/* Asymmetrical Layout: Flagship Canvas Showcase (Wide Top) + 3 Supporting Pillars */}
        <div className="space-y-6">
          {/* Flagship Feature: 360° Free Stargazing Canvas */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 relative aspect-16/9 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src="/images/vault/celestial-dome.jpg"
                  alt="360 degree celestial sphere"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-6">
                <span className="font-mono text-[11px] text-cyan-glow uppercase tracking-wider block mb-2">
                  Spatial Navigation
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Unbounded 360-Degree Stargazing Canvas
                </h3>
                <p className="font-body text-nebula-silver text-sm leading-relaxed mb-6">
                  Stand at the center of a celestial dome rendered in real time.
                  Orbit, pan, and zoom through cosmic space powered by Three.js and
                  React Three Fiber. Camera fly-to animations transition smoothly
                  between constellations, paired with a persistent bottom
                  pagination bar for fast sector jumps.
                </p>
                <div className="text-xs font-mono text-nebula-silver">
                  Feature: OrbitControls / Smooth Camera Interpolation
                </div>
              </div>
            </div>
          </div>

          {/* 3 Supporting Pillars: Transparent Glass Cards in a 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 2: Algorithmic Temporal Mapping */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between">
              <div>
                <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-white/10 mb-5">
                  <Image
                    src="/images/vault/mathematical-sky.jpg"
                    alt="Mathematical date distribution"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-mono text-[10px] text-amber-star uppercase tracking-wider block mb-1.5">
                  Temporal Calculation
                </span>
                <h4 className="font-display text-xl font-bold text-white mb-2.5">
                  Zero-Gap Date Distribution
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Our exact mathematical formula divides calendar days
                  proportionally across each constellation&apos;s physical star
                  nodes. Photos are placed automatically without gaps or clumping.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[11px] text-nebula-silver">
                Formula: B = ⌊D/N⌋, R = D mod N
              </div>
            </div>

            {/* Pillar 3: 4-Point Sparkle Nodes & Radial Reveal */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between">
              <div>
                <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-white/10 mb-5">
                  <Image
                    src="/images/vault/stargazing-camp.jpg"
                    alt="Radial star hover reveal"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-mono text-[10px] text-cyan-glow uppercase tracking-wider block mb-1.5">
                  Visual Feedback
                </span>
                <h4 className="font-display text-xl font-bold text-white mb-2.5">
                  4-Point Sparkle Nodes & Radial Reveal
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Each coordinate is marked by a custom four-pointed star that
                  pulses with its constellation&apos;s glow hue. Hovering over a
                  star expands a circular preview of your latest memory.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[11px] text-nebula-silver">
                Interaction: 280ms Spring Expansion
              </div>
            </div>

            {/* Pillar 4: Split-View Storytelling Gallery */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between">
              <div>
                <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-white/10 mb-5">
                  <Image
                    src="/images/vault/splitview-preview.jpg"
                    alt="Split view storytelling gallery"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block mb-1.5">
                  Storytelling Panel
                </span>
                <h4 className="font-display text-xl font-bold text-white mb-2.5">
                  Split-View Memory Journal
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Selecting a star slides the 3D canvas to a 55% viewport while
                  opening a frosted glass panel on the right with full-resolution
                  slideshows, location tags, and journal entries.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[11px] text-nebula-silver">
                Layout: 55% 3D Dome / 45% Frosted Story Panel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: 12 CONSTELLATIONS GRID (CLEAN SVG GLYPHS, NO EMOJIS)
          ======================================================================== */}
      <section
        id="constellations"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
      >
        <div className="text-left max-w-2xl mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow block mb-3">
            Celestial Houses
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            The Twelve Zodiac Constellations
          </h2>
          <p className="font-body text-nebula-silver text-base leading-relaxed">
            Each constellation carries custom node geometry, calendar dates,
            and an authentic spectral glow calibrated for dark space.
          </p>
        </div>

        {/* 12 Constellations Grid (Clean Translucent Glass) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CONSTELLATIONS.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-glow/50 hover:bg-white/[0.05] backdrop-blur-md transition-all duration-300 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            >
              {/* Clean SVG Glyph Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{
                  backgroundColor: `${c.glowColor}15`,
                  color: c.glowColor,
                  border: `1px solid ${c.glowColor}35`,
                }}
              >
                <ZodiacGlyph id={c.id} size={24} />
              </div>

              {/* Constellation Name */}
              <span className="font-display text-sm font-bold tracking-wide text-white">
                {c.name}
              </span>

              {/* Date Period */}
              <span className="text-[11px] text-nebula-silver mt-1 font-mono">
                {c.periodText}
              </span>

              {/* Star Node Count */}
              <span
                className="mt-3 px-2 py-0.5 rounded text-[10px] font-mono"
                style={{
                  backgroundColor: `${c.glowColor}10`,
                  color: c.glowColor,
                }}
              >
                {c.nodes.length} Star Nodes
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/sky"
            className="inline-block px-7 py-3 rounded-xl bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(124,222,228,0.3)]"
          >
            Navigate All 12 Constellations in 3D
          </Link>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: REAL MEMORIES SHOWCASE (NO EMOJIS, TRANSLUCENT CARDS)
          ======================================================================== */}
      <section
        id="memories"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
      >
        <div className="text-left max-w-2xl mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow block mb-3">
            Vault Gallery
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Living Moments in the Stars
          </h2>
          <p className="font-body text-nebula-silver text-base leading-relaxed">
            Exemplars of real travels and life milestones anchored into their
            governing constellation coordinates.
          </p>
        </div>

        {/* 4 Clean Transparent Memory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Memory 1: Tromsø Aurora */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-emerald-400/50 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.35)] flex flex-col justify-between p-4">
            <div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 mb-4">
                <Image
                  src="/images/vault/memory-aurora.jpg"
                  alt="Aurora borealis over fjords"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Capricorn / Star Node 02
              </div>
              <h4 className="font-display text-base font-bold text-white mb-1.5 leading-snug">
                Midnight Aurora over Arctic Fjords
              </h4>
              <p className="font-body text-nebula-silver text-xs leading-relaxed mb-3">
                Emerald ribbons reflecting over fjord waters at sub-zero
                temperatures. A memory preserved under winter stars.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
              <span>Tromsø, Norway</span>
              <span className="text-emerald-400">January 08</span>
            </div>
          </div>

          {/* Memory 2: Maldives Ocean */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.35)] flex flex-col justify-between p-4">
            <div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 mb-4">
                <Image
                  src="/images/vault/memory-ocean.jpg"
                  alt="Phosphorescent tide"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider mb-1">
                Cancer / Star Node 05
              </div>
              <h4 className="font-display text-base font-bold text-white mb-1.5 leading-snug">
                Phosphorescent Tides at Midnight
              </h4>
              <p className="font-body text-nebula-silver text-xs leading-relaxed mb-3">
                Walking along the shoreline as bioluminescent waves sparked with
                electric blue whenever the water broke.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
              <span>Baa Atoll, Maldives</span>
              <span className="text-cyan-glow">July 12</span>
            </div>
          </div>

          {/* Memory 3: Sahara Desert */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-amber-star/50 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.35)] flex flex-col justify-between p-4">
            <div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 mb-4">
                <Image
                  src="/images/vault/memory-desert.jpg"
                  alt="Twilight horizons in Sahara"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-[10px] font-mono text-amber-star uppercase tracking-wider mb-1">
                Gemini / Star Node 03
              </div>
              <h4 className="font-display text-base font-bold text-white mb-1.5 leading-snug">
                Twilight Horizons and Desert Dunes
              </h4>
              <p className="font-body text-nebula-silver text-xs leading-relaxed mb-3">
                Watching the golden desert sunset dissolve into an indigo canopy
                as the first evening planets illuminated the sands.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
              <span>Sahara Edge, Morocco</span>
              <span className="text-amber-star">June 04</span>
            </div>
          </div>

          {/* Memory 4: Mount Bromo Meteor */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.35)] flex flex-col justify-between p-4">
            <div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 mb-4">
                <Image
                  src="/images/vault/memory-mountain.jpg"
                  alt="Perseid meteor watch"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider mb-1">
                Leo / Star Node 04
              </div>
              <h4 className="font-display text-base font-bold text-white mb-1.5 leading-snug">
                Perseid Meteor Watch from Summit
              </h4>
              <p className="font-body text-nebula-silver text-xs leading-relaxed mb-3">
                Wrapped in wool blankets at 2,300 meters, counting shooting
                stars as the galactic core arced directly overhead.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
              <span>Mount Bromo, East Java</span>
              <span className="text-cyan-glow">August 14</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: PRIVACY & SANCTUARY (INTIMATE ARCHIVE)
          ======================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-xl overflow-hidden p-8 sm:p-12 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow block mb-3">
                Private Vault Guarantee
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                Designed for Reflection, <br />
                Not Social Validation
              </h2>
              <p className="font-body text-nebula-silver text-base leading-relaxed mb-8">
                Twelve Skies is deliberately built without vanity metrics, like
                counters, or public feeds. It is your private sanctuary in the
                cosmos, a dedicated place to preserve the people, places, and
                milestones that shaped your life.
              </p>

              <div className="space-y-4 mb-8">
                <div className="pb-3 border-b border-white/10">
                  <h5 className="font-display text-sm font-bold text-white mb-1">
                    Strict Vault Security
                  </h5>
                  <p className="text-xs text-nebula-silver leading-relaxed">
                    Protected by Supabase Auth encryption and server-side Prisma
                    ORM database boundaries. Only you possess the keys to your
                    sky.
                  </p>
                </div>

                <div>
                  <h5 className="font-display text-sm font-bold text-white mb-1">
                    High-Fidelity Archival
                  </h5>
                  <p className="text-xs text-nebula-silver leading-relaxed">
                    Lossless presentation with modern client-side WebP
                    optimization ensures your photographs stay sharp for
                    decades.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="px-7 py-3 rounded-xl bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(124,222,228,0.3)]"
                >
                  Create or Unlock Your Vault
                </Link>
                <Link
                  href="/sky"
                  className="px-7 py-3 rounded-xl border border-white/20 bg-white/[0.03] text-white font-medium text-xs uppercase tracking-wider hover:border-cyan-glow/60 transition-all"
                >
                  Preview 3D Canvas
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border border-white/15">
                <Image
                  src="/images/vault/sanctuary-cabin.jpg"
                  alt="Cozy cabin under starry night sky"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          FOOTER (CLEAN, MINIMALIST, TRANSPARENT)
          ======================================================================== */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-8">
        <div className="rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-xl p-8 sm:p-12 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
            {/* Left: Brand Identity */}
            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl border border-cyan-glow/30 bg-white/[0.04] flex items-center justify-center text-cyan-glow">
                  <CelestialLogo size={20} />
                </div>
                <div>
                  <span className="font-display text-base font-bold tracking-[0.16em] uppercase text-white block leading-tight">
                    Twelve Skies
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-glow uppercase block">
                    Celestial Photo Vault
                  </span>
                </div>
              </div>
              <p className="text-xs text-nebula-silver leading-relaxed mb-6 max-w-sm">
                A personal 3D celestial gallery web application. Transforming
                life milestones into permanent constellations across an
                interactive 360-degree cosmic dome.
              </p>
              <div className="text-xs text-nebula-silver font-mono">
                Stack: Next.js App Router, Three.js, Prisma ORM, Supabase
              </div>
            </div>

            {/* Center: Navigation */}
            <div className="md:col-span-3">
              <h4 className="font-display text-xs uppercase tracking-wider text-cyan-glow font-bold mb-4">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-nebula-silver font-medium">
                <li>
                  <Link href="/sky" className="hover:text-white transition-colors">
                    3D Sky Dome
                  </Link>
                </li>
                <li>
                  <a href="#architecture" className="hover:text-white transition-colors">
                    Architecture
                  </a>
                </li>
                <li>
                  <a href="#constellations" className="hover:text-white transition-colors">
                    12 Constellations
                  </a>
                </li>
                <li>
                  <a href="#memories" className="hover:text-white transition-colors">
                    Vault Gallery
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Account Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right: Architecture & Tech Details */}
            <div className="md:col-span-3">
              <h4 className="font-display text-xs uppercase tracking-wider text-cyan-glow font-bold mb-4">
                Core Specifications
              </h4>
              <div className="space-y-2.5 text-xs text-nebula-silver">
                <p className="leading-relaxed">
                  <strong className="text-white block font-sans">Temporal Distribution:</strong>
                  Mathematical subdivision maps capture timestamps to star nodes without gaps.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white block font-sans">Private Vault:</strong>
                  Server-side Prisma ORM database transactions ensure your photos remain private.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-nebula-silver/70 gap-3">
            <p>&copy; 2026 Twelve Skies. All rights reserved.</p>
            <p className="font-mono text-[11px] text-cyan-glow/80">
              Personal 3D Constellation Stargazing Gallery
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
