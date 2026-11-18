"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONSTELLATIONS } from "@/data/constellations";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import {
  Sparkles,
  Calendar,
  Compass,
  ShieldCheck,
  ArrowRight,
  Eye,
  Layers,
  Lock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Share2,
} from "lucide-react";

export default function LandingPage() {
  // Interactive state for Hero interactive constellation preview
  const [activeHeroConstellation, setActiveHeroConstellation] = useState<
    "leo" | "sagittarius" | "capricorn"
  >("leo");

  // Hero constellations data for the interactive canvas preview
  const heroConstellationPreviews = {
    leo: {
      name: "Leo",
      symbol: "♌",
      period: "Jul 23 – Aug 22",
      glowColor: "#F59E0B",
      nodeCount: 9,
      featuredMemory: {
        title: "Perseid Meteor Watch from the Summit",
        location: "Mount Bromo Crater (2,329m)",
        date: "August 14, 2025",
        image: "/images/vault/memory-mountain.jpg",
        caption:
          "Wrapped in blankets at 2,300m, tracking shooting stars through the galactic core of the Milky Way.",
        nodeIndex: 4,
        coordinates: "RA 10h 08m / Dec +11°58'",
      },
    },
    sagittarius: {
      name: "Sagittarius",
      symbol: "♐",
      period: "Nov 22 – Dec 21",
      glowColor: "#818CF8",
      nodeCount: 11,
      featuredMemory: {
        title: "Campfire Beneath the Arch of the Galaxy",
        location: "Altyn-Emel National Park",
        date: "December 05, 2025",
        image: "/images/vault/stargazing-camp.jpg",
        caption:
          "Quiet warmth in the winter desert as the archer's arrow pointed toward the galactic center.",
        nodeIndex: 7,
        coordinates: "RA 19h 05m / Dec -25°12'",
      },
    },
    capricorn: {
      name: "Capricorn",
      symbol: "♑",
      period: "Dec 22 – Jan 19",
      glowColor: "#34D399",
      nodeCount: 6,
      featuredMemory: {
        title: "Midnight Aurora over the Arctic Fjords",
        location: "Tromsø, Norway",
        date: "January 08, 2025",
        image: "/images/vault/memory-aurora.jpg",
        caption:
          "The emerald curtains of the northern lights reflected over mirror-still fjord waters at sub-zero temperatures.",
        nodeIndex: 2,
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
          HEADER / NAVBAR
          ======================================================================== */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 pt-6">
        <div className="rounded-full border border-white/10 bg-space-navy/35 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-cyan-glow/40 bg-space-navy/80 flex items-center justify-center text-cyan-glow shadow-[0_0_15px_rgba(124,222,228,0.25)] group-hover:scale-105 transition-transform">
              <CelestialLogo size={22} />
            </div>
            <div>
              <span className="font-display text-base sm:text-lg font-bold tracking-[0.18em] uppercase text-white block leading-tight">
                Twelve Skies
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-cyan-glow uppercase block">
                Celestial Photo Vault
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-nebula-silver">
            <a
              href="#overview"
              className="hover:text-cyan-glow transition-colors"
            >
              Overview
            </a>
            <a
              href="#features"
              className="hover:text-cyan-glow transition-colors"
            >
              How It Works
            </a>
            <a
              href="#constellations"
              className="hover:text-cyan-glow transition-colors"
            >
              12 Constellations
            </a>
            <a
              href="#memories"
              className="hover:text-cyan-glow transition-colors"
            >
              Vault Gallery
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/15 bg-white/5 text-xs sm:text-sm font-medium text-white hover:border-cyan-glow/60 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Lock size={13} className="text-cyan-glow" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/sky"
              className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-cyan-glow text-space-navy text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(124,222,228,0.35)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all flex items-center gap-1.5"
            >
              <span>Explore 3D Sky</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================
          HERO SECTION: THE CELESTIAL PHOTO VAULT
          ======================================================================== */}
      <section
        id="overview"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Narrative & CTAs */}
          <div className="lg:col-span-6 text-left">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow text-xs font-mono uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(124,222,228,0.15)]">
              <Sparkles size={13} className="text-amber-star" />
              <span>3D Astronomical Memory Archive</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-[1.08] mb-6">
              Your Life Memories, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow via-white to-amber-star">
                Written in the Stars
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="font-body text-nebula-silver text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Twelve Skies transcends flat photo galleries by anchoring your
              photographs across an interactive 360° celestial sphere. Every
              treasured moment is mathematically plotted into 12 zodiac
              constellations according to the exact calendar day it occurred.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <Link
                href="/sky"
                className="px-8 py-4 rounded-full bg-cyan-glow text-space-navy font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(124,222,228,0.4)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.7)] transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Launch 3D Sky Dome</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-full border border-white/20 bg-space-navy/40 backdrop-blur-md text-white font-semibold text-sm tracking-wider uppercase hover:border-cyan-glow/60 hover:bg-space-navy/60 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Lock size={15} className="text-cyan-glow" />
                <span>Access Private Vault</span>
              </Link>
            </div>

            {/* Feature Badges Pill */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-nebula-silver pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
                <span className="font-medium text-white">
                  12 Zodiac Constellations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-star" />
                <span className="font-medium text-white">
                  Mathematical Date Mapping
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium text-white">
                  Private & Encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Constellation & Memory Vault Canvas Preview */}
          <div className="lg:col-span-6 relative">
            {/* Ambient Background Aura behind mockup */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-glow/15 via-space-navy/40 to-amber-star/10 blur-2xl pointer-events-none" />

            {/* Translucent Glass Canvas Preview Card */}
            <div className="relative rounded-3xl border border-cyan-glow/30 bg-space-navy/35 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
              {/* Canvas Header / Coordinate Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-glow">
                  <Compass size={14} />
                  <span>360° CELESTIAL SPHERE</span>
                </div>
                <div className="flex items-center gap-2 text-nebula-silver">
                  <span>EPOCH: 2025–2026</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Viewport Simulation: Photographic Night Sky + Interactive Constellation Overlay */}
              <div className="relative h-72 sm:h-84 rounded-2xl overflow-hidden border border-white/10 bg-space-black">
                {/* Real Mountain Night Sky Backdrop */}
                <Image
                  src="/images/vault/hero-stargazer.jpg"
                  alt="Celestial night sky over mountains"
                  fill
                  className="object-cover opacity-60 filter brightness-90"
                  priority
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-space-black/90 via-space-black/30 to-transparent" />

                {/* SVG Simulated Constellation Geometry */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Constellation Connecting Lines */}
                  <path
                    d="M 60,180 L 130,120 L 220,110 L 290,160 L 340,210 M 130,120 L 210,190 L 290,160 M 220,110 L 210,190"
                    stroke={activePreview.glowColor}
                    strokeWidth="1.6"
                    strokeOpacity="0.6"
                    strokeDasharray="4 2"
                  />

                  {/* Node Stars */}
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
                        fillOpacity={idx === 4 ? 0.45 : 0.25}
                      />
                    </g>
                  ))}
                </svg>

                {/* Active Hover Memory Popup Tooltip (Anchored to Node #4) */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-2xl border border-cyan-glow/40 bg-space-navy/75 backdrop-blur-xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <div className="flex gap-3 items-center">
                    {/* Radial thumbnail photo */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-glow shadow-[0_0_15px_rgba(124,222,228,0.4)] shrink-0">
                      <Image
                        src={activePreview.featuredMemory.image}
                        alt={activePreview.featuredMemory.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-glow">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: activePreview.glowColor,
                          }}
                        />
                        <span>
                          {activePreview.name} ({activePreview.symbol}) · Node #
                          {activePreview.featuredMemory.nodeIndex}
                        </span>
                      </div>
                      <h4 className="text-xs font-display font-bold text-white truncate mt-0.5">
                        {activePreview.featuredMemory.title}
                      </h4>
                      <p className="text-[11px] text-nebula-silver flex items-center gap-1 mt-0.5 truncate">
                        <MapPin size={10} className="text-amber-star shrink-0" />
                        <span>{activePreview.featuredMemory.location}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-nebula-silver">
                    <span>{activePreview.featuredMemory.date}</span>
                    <span className="text-cyan-glow">Mapped & Preserved</span>
                  </div>
                </div>
              </div>

              {/* Constellation Selector Tabs */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-nebula-silver">
                  Select Constellation:
                </span>
                <div className="flex items-center gap-1.5">
                  {(["leo", "sagittarius", "capricorn"] as const).map(
                    (key) => {
                      const c = heroConstellationPreviews[key];
                      const isActive = activeHeroConstellation === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveHeroConstellation(key)}
                          className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? "bg-white/15 border border-cyan-glow text-white shadow-[0_0_10px_rgba(124,222,228,0.3)]"
                              : "bg-white/5 border border-white/10 text-nebula-silver hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <span style={{ color: c.glowColor }}>{c.symbol}</span>
                          <span>{c.name}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 1: THE FOUR PILLARS / HOW THE VAULT WORKS
          ======================================================================== */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
      >
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-cyan-glow" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">
              System Architecture
            </span>
            <span className="h-[1px] w-8 bg-cyan-glow" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            How Twelve Skies Preserves Your Journey
          </h2>
          <p className="font-body text-nebula-silver text-base leading-relaxed">
            Every feature is engineered to blend precision astronomical
            mathematics with immersive 3D spatial design, creating a sanctuary
            for the memories that define who you are.
          </p>
        </div>

        {/* 4 Feature Cards with Real High-Res Photography and Translucent Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1: 360° Stargazing Canvas */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src="/images/vault/celestial-dome.jpg"
                alt="360 degree celestial sphere"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-space-navy/80 backdrop-blur-md border border-cyan-glow/40 text-[11px] font-mono text-cyan-glow uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={12} />
                <span>360° Canvas Exploration</span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  Unbounded 3D Stargazing Canvas
                </h3>
                <p className="font-body text-nebula-silver text-sm leading-relaxed mb-6">
                  Stand at the center of an unbounded celestial dome rendered in
                  real time with Three.js and React Three Fiber. Smoothly drag,
                  orbit, and zoom across all 12 zodiac sectors with responsive
                  astronomical camera fly-to transitions and quick pagination
                  controls.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-glow">
                <span>Free Orbit & Zoom Navigation</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 2: Algorithmic Temporal Mapping */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src="/images/vault/mathematical-sky.jpg"
                alt="Mathematical date distribution"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-space-navy/80 backdrop-blur-md border border-amber-star/40 text-[11px] font-mono text-amber-star uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} />
                <span>Algorithmic Mapping</span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  Zero-Gap Date Distribution Engine
                </h3>
                <p className="font-body text-nebula-silver text-sm leading-relaxed mb-6">
                  Say goodbye to tedious manual sorting. Our proportional
                  mathematical algorithm extracts each photo&apos;s capture
                  date, calculates the ruling zodiac period, and divides
                  temporal ranges evenly ($B = \lfloor D/N \rfloor$) across each
                  constellation&apos;s physical star nodes.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-amber-star">
                <span>Automatic Temporal Sorting</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 3: 4-Point Sparkle Nodes & Radial Reveal */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src="/images/vault/stargazing-camp.jpg"
                alt="Radial star hover reveal"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-space-navy/80 backdrop-blur-md border border-cyan-glow/40 text-[11px] font-mono text-cyan-glow uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Radial Hover Reveal</span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  4-Point Sparkle Nodes & Live Bloom
                </h3>
                <p className="font-body text-nebula-silver text-sm leading-relaxed mb-6">
                  Every celestial coordinate is rendered as a sharp four-pointed
                  sparkle star pulsing with its constellation&apos;s custom
                  luminous hue. Hovering over a star triggers a fluid radial
                  expansion, blooming a circular preview of the latest memory
                  anchored to that node.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-glow">
                <span>Fluid Spring Animations</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 4: Split-View Storytelling Gallery */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src="/images/vault/splitview-preview.jpg"
                alt="Split view storytelling gallery"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-space-navy/80 backdrop-blur-md border border-emerald-400/40 text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={12} />
                <span>Split-View Journal</span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  Split-View Cinematic Memory Journal
                </h3>
                <p className="font-body text-nebula-silver text-sm leading-relaxed mb-6">
                  Clicking any star glides the 3D celestial canvas into a 55%
                  focused viewport while sliding in a frosted glass panel on the
                  right. Experience full-resolution image slideshows, geotagged
                  locations, and heartfelt journal notes detailing the story
                  behind each photograph.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>Full-Resolution Storytelling</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: 12 CONSTELLATIONS INTERACTIVE GRID
          ======================================================================== */}
      <section
        id="constellations"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-cyan-glow" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">
              Celestial Sectors
            </span>
            <span className="h-[1px] w-8 bg-cyan-glow" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            The Twelve Cosmic Houses
          </h2>
          <p className="font-body text-nebula-silver text-base leading-relaxed">
            From the mountain emerald of Capricorn to the solar gold of Leo, each
            zodiac constellation features an authentic node topology, precise
            calendar epoch, and a bespoke spectral glow calibrated for dark space.
          </p>
        </div>

        {/* 12 Constellations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CONSTELLATIONS.map((c) => (
            <div
              key={c.id}
              className="group relative p-5 rounded-2xl bg-space-navy/30 border border-white/10 hover:border-cyan-glow/50 backdrop-blur-md transition-all duration-300 flex flex-col items-center text-center shadow-[0_8px_25px_rgba(0,0,0,0.35)] hover:-translate-y-1"
            >
              {/* Glyph Icon with Constellation Glow Color */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{
                  backgroundColor: `${c.glowColor}15`,
                  color: c.glowColor,
                  border: `1px solid ${c.glowColor}40`,
                }}
              >
                <ZodiacGlyph id={c.id} size={24} />
              </div>

              {/* Constellation Name */}
              <span className="font-display text-sm font-bold tracking-wide text-white group-hover:text-cyan-glow transition-colors">
                {c.name}
              </span>

              {/* Date Period */}
              <span className="text-[11px] text-nebula-silver mt-1">
                {c.periodText}
              </span>

              {/* Star Node Count Badge */}
              <div
                className="mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider"
                style={{
                  backgroundColor: `${c.glowColor}12`,
                  color: c.glowColor,
                  border: `1px solid ${c.glowColor}25`,
                }}
              >
                {c.nodes.length} Star Nodes
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Constellations CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/sky"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(124,222,228,0.3)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all"
          >
            <span>Navigate All 12 Constellations in 3D</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: CURATED MEMORIES IN THE STARS (REAL PHOTOGRAPHY CARDS)
          ======================================================================== */}
      <section
        id="memories"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-cyan-glow" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">
              Living Moments
            </span>
            <span className="h-[1px] w-8 bg-cyan-glow" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Moments Preserved Across Cosmic Time
          </h2>
          <p className="font-body text-nebula-silver text-base leading-relaxed">
            See how real life milestones, peaceful expeditions, and quiet
            evenings look when anchored into the stars of your celestial vault.
          </p>
        </div>

        {/* 4 Sample Memory Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Memory 1: Tromsø Aurora */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-emerald-400/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/vault/memory-aurora.jpg"
                alt="Aurora borealis over fjords"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-space-navy/85 backdrop-blur-md border border-emerald-400/40 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span>♑ Capricorn · Node #02</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-nebula-silver mb-1.5">
                  <MapPin size={11} className="text-amber-star shrink-0" />
                  <span>Tromsø, Norway</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  Midnight Aurora over Arctic Fjords
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Emerald ribbons reflecting over mirror-still fjord waters at
                  sub-zero temperatures. A memory frozen under winter stars.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
                <span>January 08</span>
                <span className="text-emerald-400">Captured in Vault</span>
              </div>
            </div>
          </div>

          {/* Memory 2: Maldives Bioluminescence */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/vault/memory-ocean.jpg"
                alt="Phosphorescent tide"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-space-navy/85 backdrop-blur-md border border-cyan-glow/40 text-[10px] font-mono text-cyan-glow flex items-center gap-1.5">
                <span>♋ Cancer · Node #05</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-nebula-silver mb-1.5">
                  <MapPin size={11} className="text-amber-star shrink-0" />
                  <span>Baa Atoll, Maldives</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  Phosphorescent Tides at Midnight
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Walking along the shoreline as bioluminescent waves sparked
                  with electric blue sparks with every breaking crest.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
                <span>July 12</span>
                <span className="text-cyan-glow">Captured in Vault</span>
              </div>
            </div>
          </div>

          {/* Memory 3: Sahara Dunes */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-amber-star/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/vault/memory-desert.jpg"
                alt="Twilight horizons in Sahara"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-space-navy/85 backdrop-blur-md border border-amber-star/40 text-[10px] font-mono text-amber-star flex items-center gap-1.5">
                <span>♊ Gemini · Node #03</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-nebula-silver mb-1.5">
                  <MapPin size={11} className="text-amber-star shrink-0" />
                  <span>Sahara Edge, Morocco</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  Twilight Horizons & Desert Dunes
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Watching the golden desert sunset dissolve into an indigo
                  canopy as the first evening planets illuminated the sands.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
                <span>June 04</span>
                <span className="text-amber-star">Captured in Vault</span>
              </div>
            </div>
          </div>

          {/* Memory 4: Mount Bromo Meteor */}
          <div className="group rounded-3xl border border-white/10 bg-space-navy/30 backdrop-blur-xl overflow-hidden hover:border-cyan-glow/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/vault/memory-mountain.jpg"
                alt="Perseid meteor watch"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-space-navy/85 backdrop-blur-md border border-cyan-glow/40 text-[10px] font-mono text-cyan-glow flex items-center gap-1.5">
                <span>♌ Leo · Node #04</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-nebula-silver mb-1.5">
                  <MapPin size={11} className="text-amber-star shrink-0" />
                  <span>Mount Bromo, East Java</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  Perseid Meteor Watch from Summit
                </h4>
                <p className="font-body text-nebula-silver text-xs leading-relaxed">
                  Wrapped in wool blankets at 2,300 meters, counting shooting
                  stars as the galactic core arced directly overhead.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-nebula-silver">
                <span>August 14</span>
                <span className="text-cyan-glow">Captured in Vault</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: PRIVACY & SANCTUARY (BUILT FOR INTIMACY)
          ======================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="relative rounded-3xl border border-white/15 bg-space-navy/35 backdrop-blur-xl overflow-hidden p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-glow/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow text-xs font-mono uppercase tracking-wider mb-4">
                <ShieldCheck size={14} />
                <span>Private & Intimate Archive</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                Designed for Reflection, <br />
                Not Social Validation
              </h2>
              <p className="font-body text-nebula-silver text-base leading-relaxed mb-8">
                Twelve Skies is intentionally free from public vanity metrics,
                like counters, and algorithm-driven feeds. It is your private
                refuge in the cosmos—a dedicated place to reminisce over the
                people, places, and milestones that shaped your life.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center text-cyan-glow shrink-0 mt-0.5">
                    <Lock size={12} />
                  </div>
                  <div>
                    <h5 className="font-display text-sm font-bold text-white">
                      Strict Private Vault Security
                    </h5>
                    <p className="text-xs text-nebula-silver leading-relaxed">
                      Protected by Supabase Auth encryption and server-side
                      Prisma ORM database boundaries. Only you have the keys to
                      your sky.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center text-cyan-glow shrink-0 mt-0.5">
                    <Layers size={12} />
                  </div>
                  <div>
                    <h5 className="font-display text-sm font-bold text-white">
                      High-Fidelity Archival
                    </h5>
                    <p className="text-xs text-nebula-silver leading-relaxed">
                      Lossless presentation with modern client-side WebP
                      optimization ensures your photographs stay sharp for
                      decades.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-full bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(124,222,228,0.35)] hover:bg-white transition-all flex items-center gap-2"
                >
                  <Lock size={14} />
                  <span>Create or Unlock Your Vault</span>
                </Link>
                <Link
                  href="/sky"
                  className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-semibold text-xs uppercase tracking-wider hover:border-cyan-glow/60 transition-colors"
                >
                  <span>Preview 3D Canvas</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/vault/sanctuary-cabin.jpg"
                  alt="Cozy cabin under starry night sky"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-black/85 via-space-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-space-navy/70 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-display font-semibold text-white">
                    &ldquo;In the quiet expanse of the night, every memory finds its
                    place.&rdquo;
                  </p>
                  <p className="text-[10px] font-mono text-cyan-glow mt-1">
                    Twelve Skies · Private Celestial Archive
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          FOOTER (AUTHENTIC TWELVE SKIES FLOATING GLASS CARD)
          ======================================================================== */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-8">
        <div className="rounded-3xl border border-white/15 bg-space-navy/35 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
            {/* Left: Brand Identity */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-cyan-glow/40 bg-space-navy/80 flex items-center justify-center text-cyan-glow">
                  <CelestialLogo size={22} />
                </div>
                <div>
                  <span className="font-display text-lg font-bold tracking-[0.15em] uppercase text-white block leading-tight">
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
                interactive 360° cosmic dome.
              </p>
              <div className="flex items-center gap-3 text-xs text-nebula-silver font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-glow" />
                <span>Next.js App Router · Three.js · Prisma · Supabase</span>
              </div>
            </div>

            {/* Center: Navigation */}
            <div className="md:col-span-3">
              <h4 className="font-display text-xs uppercase tracking-wider text-cyan-glow font-bold mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs text-nebula-silver">
                <li>
                  <Link
                    href="/sky"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-cyan-glow" />
                    <span>3D Sky Dome</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-cyan-glow" />
                    <span>How It Works</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#constellations"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-cyan-glow" />
                    <span>12 Constellations</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#memories"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-cyan-glow" />
                    <span>Vault Gallery</span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-cyan-glow" />
                    <span>Account Login</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right: Architecture & Tech Details */}
            <div className="md:col-span-4">
              <h4 className="font-display text-xs uppercase tracking-wider text-cyan-glow font-bold mb-4">
                Architecture Pillars
              </h4>
              <div className="space-y-3 text-xs text-nebula-silver">
                <p className="leading-relaxed">
                  <strong className="text-white block">Temporal Algorithm:</strong>
                  Mathematical distribution distributes dates seamlessly across
                  authentic constellation star nodes without overlap.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white block">Private & Isolated:</strong>
                  Strict server-side Prisma ORM database transactions ensure your
                  personal gallery remains exclusively yours.
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
