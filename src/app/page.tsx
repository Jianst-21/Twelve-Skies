import Link from "next/link";
import Image from "next/image";
import { CONSTELLATIONS } from "@/data/constellations";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import CurvedText from "@/components/ui/CurvedText";
import {
  Rocket,
  Sparkles,
  Calendar,
  Compass,
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-space-black text-white selection:bg-cyan-glow selection:text-space-navy overflow-x-hidden">
      {/* 
        ========================================================================
        AUTHENTIC NEOWISE CONTINUOUS COSMIC BACKGROUND LAYERS
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
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-space-black via-space-navy/35 to-space-black opacity-90"
      />

      {/* Layer 3: Secondary Star Dust & Constellation Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-top opacity-30 mix-blend-lighten"
        style={{
          backgroundImage: "url('/images/neowise/2-star-mini.jpg')",
        }}
      />

      {/* Layer 4: Ambient Radial Cosmic Lighting Orbs */}
      <div className="pointer-events-none fixed -top-40 -left-40 z-0 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[130px]" />
      <div className="pointer-events-none fixed top-1/3 -right-40 z-0 w-[650px] h-[650px] rounded-full bg-space-navy/60 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-10 left-1/4 z-0 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[120px]" />

      {/* ========================================================================
          HEADER / NAVBAR
          ======================================================================== */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 py-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-cyan-glow/40 bg-space-navy/80 flex items-center justify-center text-cyan-glow shadow-[0_0_15px_rgba(124,222,228,0.25)]">
            <CelestialLogo size={22} />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-[0.15em] uppercase text-white block leading-tight">
              Twelve Skies
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-cyan-glow/90 uppercase block">
              Celestial Photo Vault
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-nebula-silver">
          <a href="#about" className="hover:text-cyan-glow transition-colors">
            Tentang
          </a>
          <a href="#innovations" className="hover:text-cyan-glow transition-colors">
            Inovasi
          </a>
          <a href="#constellations" className="hover:text-cyan-glow transition-colors">
            12 Rasi Bintang
          </a>
          <a href="#workflow" className="hover:text-cyan-glow transition-colors">
            Cara Kerja
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-xs sm:text-sm font-medium text-white hover:border-cyan-glow/70 hover:bg-white/10 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/sky"
            className="px-6 py-2.5 rounded-full bg-cyan-glow text-space-navy text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(124,222,228,0.4)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all"
          >
            Buka Langit 3D
          </Link>
        </div>
      </header>

      {/* ========================================================================
          HERO SECTION (Matching Neowise Hero with Astronaut & Cosmic Horizon)
          ======================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-20 lg:pt-12 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Astronaut Visual (Authentic Neowise Element) */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1">
            {/* Atmospheric Curved Glow / Planetary Rim Light behind astronaut */}
            <div className="absolute -top-10 -left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-glow/20 via-space-navy/50 to-transparent blur-3xl pointer-events-none" />

            {/* Astronaut Image with subtle cosmic float animation */}
            <div className="relative w-full max-w-[420px] lg:max-w-none animate-float-slow">
              <Image
                src="/images/neowise/astronot-crop1.png"
                alt="Astronaut exploring cosmic memories"
                width={663}
                height={608}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(3,4,94,0.8)] filter brightness-105"
              />
            </div>
          </div>

          {/* Right Column: Hero Typography & Actions */}
          <div className="lg:col-span-7 text-left order-1 lg:order-2 lg:pl-6">
            {/* Neowise-style Eyebrow with divider line */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-cyan-glow" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow font-medium">
                To The Space
              </span>
            </div>

            {/* Huge Headline in Titillium Web */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.08em] uppercase text-white leading-[1.05] mb-6">
              TWELVE <span className="text-cyan-glow">SKIES</span>
            </h1>

            <p className="font-body text-nebula-silver text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              Kubah arsip memori abadi di bawah naungan 12 rasi bintang kosmik. Setiap potret
              kenangan Anda dipetakan secara matematis ke koordinat kubah antariksa 3D
              berdasarkan tanggal momen berlangsung.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/sky"
                className="px-8 py-4 rounded-full bg-cyan-glow text-space-navy font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(124,222,228,0.45)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.7)] transition-all text-center flex items-center justify-center gap-2"
              >
                Jelajahi Kubah Langit
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-full border border-white/20 bg-space-navy/50 text-white font-semibold text-sm tracking-wider uppercase hover:border-cyan-glow/60 hover:bg-space-navy/70 transition-colors text-center"
              >
                Akses Akun Pribadi
              </Link>
            </div>
          </div>
        </div>

        {/* Neowise-style Translucent Pill Bar (Feature Badges / Sponsor Bar) */}
        <div className="mt-16 rounded-[28px] border border-cyan-glow/25 bg-space-navy-glass backdrop-blur-md px-6 py-4 sm:py-5 flex items-center justify-around flex-wrap gap-4 text-xs font-medium text-nebula-silver shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            <span className="font-display tracking-wider uppercase text-white font-semibold">
              12 Rasi Zodiak Presisi
            </span>
          </div>
          <div className="hidden sm:block w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <Sparkles size={15} className="text-amber-star" />
            <span className="font-display tracking-wider uppercase text-white font-semibold">
              Pemetaan Tanggal Matematis
            </span>
          </div>
          <div className="hidden sm:block w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <Compass size={15} className="text-cyan-glow" />
            <span className="font-display tracking-wider uppercase text-white font-semibold">
              Navigasi Langit 360° 3D
            </span>
          </div>
          <div className="hidden sm:block w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span className="font-display tracking-wider uppercase text-white font-semibold">
              Arsip Foto Terenkripsi
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: ABOUT / CIRCULAR VIEWPORT (Matching Neowise Section 2)
          ======================================================================== */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Circular Viewport with Rotating Curved Text */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Rotating Circular Text SVG */}
              <CurvedText
                text="SPACE ASTRONOMY · INFINITE POSSIBILITIES · TWELVE SKIES · "
                size={340}
                fontSize={10.5}
                letterSpacing={3.5}
              />

              {/* Inner Circular Masked Image */}
              <div className="w-60 h-60 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-cyan-glow/50 shadow-[0_0_30px_rgba(124,222,228,0.3)] relative">
                <Image
                  src="/images/neowise/car-mini-crop.jpg"
                  alt="Astronomy observation car under night stars"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-7 text-left lg:pl-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-10 bg-cyan-glow" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow font-medium">
                About Twelve Skies
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
              Get To Know More About Twelve Skies
            </h2>

            <p className="font-body text-nebula-silver text-base leading-relaxed mb-6">
              Twelve Skies dirancang untuk mengubah cara manusia menyimpan kenangan hidup.
              Bukan sekadar galeri grid biasa di layar datar, melainkan sebuah kubah kosmik
              3D di mana setiap foto Anda ditempatkan pada rasi bintang zodiak yang bersesuaian.
            </p>

            <p className="font-body text-nebula-silver text-sm leading-relaxed mb-8">
              Dengan membagi 365 hari dalam setahun ke dalam 12 rasi zodiak kuno, momen berharga
              Anda abadi sebagai bintang pemandu di dalam semesta pribadi Anda.
            </p>

            <Link
              href="/sky"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              Lihat Kubah Langit
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: NEO INNOVATIONS & STATS CARD (Matching Neowise Section 3)
          ======================================================================== */}
      <section id="innovations" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-cyan-glow" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">
              Neo Innovations
            </span>
            <span className="h-[1px] w-8 bg-cyan-glow" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Achieving the Future with Neo Innovations
          </h2>
        </div>

        {/* Large Rounded Dark Glassmorphism Card */}
        <div className="relative rounded-[36px] border border-cyan-glow/30 bg-gradient-to-br from-space-navy/70 via-space-black/90 to-space-navy/40 backdrop-blur-xl p-8 sm:p-14 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Floating Vector Rockets on edges (Authentic Neowise detail) */}
          <div className="absolute top-6 right-8 opacity-75 animate-float-slow pointer-events-none">
            <Rocket size={48} className="text-white transform rotate-45" />
          </div>
          <div className="absolute bottom-6 left-8 opacity-70 animate-float-slow pointer-events-none delay-1000">
            <Rocket size={38} className="text-cyan-glow transform -rotate-135" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            {/* Left Column Stats */}
            <div className="flex flex-col gap-8 text-center md:text-left">
              <div>
                <span className="font-display text-4xl sm:text-6xl font-bold text-white block">
                  12
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-nebula-silver">
                  Rasi Bintang Zodiak
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-6xl font-bold text-cyan-glow block">
                  365+
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-nebula-silver">
                  Hari Distribusi Temporal
                </span>
              </div>
            </div>

            {/* Center Realistic 3D Moon Graphic */}
            <div className="relative flex items-center justify-center py-4">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 animate-float-slow">
                {/* Moon Glow Aura */}
                <div className="absolute inset-0 rounded-full bg-cyan-glow/20 blur-2xl pointer-events-none" />
                <Image
                  src="/images/neowise/moon-png-1.png"
                  alt="Realistic 3D Moon"
                  fill
                  className="object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>

            {/* Right Column Stats */}
            <div className="flex flex-col gap-8 text-center md:text-right">
              <div>
                <span className="font-display text-4xl sm:text-6xl font-bold text-white block">
                  360°
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-nebula-silver">
                  Kubah Langit Interaktif
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-6xl font-bold text-amber-star block">
                  100%
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-nebula-silver">
                  Penyimpanan Terenkripsi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: EARTH & 12 CONSTELLATIONS (Matching Neowise Section 4)
          ======================================================================== */}
      <section id="constellations" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Column: Description */}
          <div className="lg:col-span-7 text-left">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-10 bg-cyan-glow" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow font-medium">
                Celestial Mechanics
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
              Bagaimana Foto Menemukan Titik Bintangnya?
            </h2>

            <p className="font-body text-nebula-silver text-base leading-relaxed mb-6">
              Sistem Twelve Skies menggunakan formula pembagian temporal matematis. Tanggal pada
              foto Anda langsung dianalisis untuk menentukan rasi bintang zodiak yang berkuasa,
              lalu dipetakan ke titik bintang (node) yang tepat tanpa perlu kurasi manual.
            </p>

            <Link
              href="/sky"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              Coba Navigasi Rasi
            </Link>
          </div>

          {/* Right Column: Realistic Earth with Rotating Circular Text */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Rotating Circular Text SVG around Earth */}
              <CurvedText
                text="12 CONSTELLATIONS · CELESTIAL VAULT · EARTH PERSPECTIVE · "
                size={340}
                fontSize={10.5}
                letterSpacing={3.5}
              />

              {/* Realistic 3D Earth Image */}
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                <Image
                  src="/images/neowise/earth2-mini-2.png"
                  alt="Realistic 3D Earth Atmosphere"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 12 Constellations Grid Showcase with authentic SVG glyphs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {CONSTELLATIONS.map((c) => (
            <div
              key={c.id}
              className="group relative p-4 rounded-2xl bg-space-navy/35 border border-white/10 hover:border-cyan-glow/50 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-sm hover:shadow-[0_8px_25px_rgba(124,222,228,0.2)]"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${c.glowColor}18`,
                  color: c.glowColor,
                }}
              >
                <ZodiacGlyph id={c.id} size={22} />
              </div>
              <span className="font-display text-sm font-bold tracking-wide text-white">
                {c.name}
              </span>
              <span className="text-[11px] text-nebula-silver mt-0.5">{c.periodText}</span>
              <div className="mt-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan-glow/90 bg-cyan-glow/10 border border-cyan-glow/20">
                {c.nodes.length} Titik Bintang
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================
          SECTION 5: TELESCOPE & WORKFLOW (Matching Neowise Section 5)
          ======================================================================== */}
      <section id="workflow" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Circular Viewport with Kids / Telescope & Progress Bars */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-6">
              {/* Rotating Circular Text SVG */}
              <CurvedText
                text="CREATING STARS · EXPLORING REMOTE WORLDS · "
                size={340}
                fontSize={10.5}
                letterSpacing={3.5}
              />

              {/* Masked Circular Image */}
              <div className="w-60 h-60 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-cyan-glow/40 shadow-[0_0_35px_rgba(124,222,228,0.25)] relative">
                <Image
                  src="/images/neowise/kids-telescope-crop.jpg"
                  alt="Astronomy observation and learning"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Neowise Progress Indicators */}
            <div className="w-full max-w-xs space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono text-nebula-silver mb-1">
                  <span>Akurasi Distribusi Tanggal</span>
                  <span className="text-cyan-glow">100%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-glow rounded-full w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-nebula-silver mb-1">
                  <span>Resolusi Kubah Antariksa</span>
                  <span className="text-cyan-glow">Ultra HD</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-glow rounded-full w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Features */}
          <div className="lg:col-span-7 text-left lg:pl-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-10 bg-cyan-glow" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow font-medium">
                Our Features
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
              Where Quality Meets Cosmic Innovation
            </h2>

            <p className="font-body text-nebula-silver text-base leading-relaxed mb-8">
              Twelve Skies memadukan teknologi grafis 3D mutakhir dengan sistem database Prisma
              dan penyimpanan aman untuk menghadirkan pengalaman mengenang masa lalu yang magis.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center text-cyan-glow shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <span className="text-sm text-white font-medium">
                  Pemetaan Otomatis Berdasarkan Tanggal Momen Tanpa Perlu Kurasi Manual
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center text-cyan-glow shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <span className="text-sm text-white font-medium">
                  Navigasi 3D Real-time 360 Derajat Berbasis Three.js & React Three Fiber
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center text-cyan-glow shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <span className="text-sm text-white font-medium">
                  Panel Terpisah (Split-View) dengan Slideshow Foto Resolusi Penuh & Linimasa Cerita
                </span>
              </li>
            </ul>

            <Link
              href="/sky"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              Mulai Eksplorasi
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 6: UPCOMING CAPABILITIES / CARDS (Matching Neowise Section 6)
          ======================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-cyan-glow" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">
              Archive Vault
            </span>
            <span className="h-[1px] w-8 bg-cyan-glow" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Tahapan Menghidupkan Kenangan Anda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[28px] border border-cyan-glow/20 bg-space-navy/40 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-glow mb-4">
              <Calendar size={14} />
              <span>LANGKAH 01</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Unggah Foto & Tentukan Tanggal
            </h3>
            <p className="text-xs sm:text-sm text-nebula-silver leading-relaxed">
              Pilih foto momen terbaik Anda. Sistem langsung mengekstrak tanggal untuk
              mengkalkulasikan zodiak yang tepat serta nomor titik bintangnya.
            </p>
          </div>

          <div className="p-8 rounded-[28px] border border-cyan-glow/20 bg-space-navy/40 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-star mb-4">
              <Sparkles size={14} />
              <span>LANGKAH 02</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Bintang Anda Menyala di Langit
            </h3>
            <p className="text-xs sm:text-sm text-nebula-silver leading-relaxed">
              Setiap kali Anda menyorot titik bintang pada rasi, foto pratinjau lingkaran muncul
              seketika. Klik bintang untuk membuka galeri dan linimasa memori.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================
          FOOTER (Matching Neowise Glassmorphic Floating Footer Card)
          ======================================================================== */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-8">
        <div className="rounded-[32px] border border-cyan-glow/25 bg-gradient-to-br from-space-navy/80 via-space-black/90 to-space-navy/60 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
            {/* Left: Brand & Newsletter */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full border border-cyan-glow/40 bg-space-navy/80 flex items-center justify-center text-cyan-glow">
                  <CelestialLogo size={20} />
                </div>
                <span className="font-display text-lg font-bold tracking-wider uppercase text-white">
                  Twelve Skies
                </span>
              </div>
              <p className="text-xs text-nebula-silver leading-relaxed mb-5 max-w-sm">
                Arsip foto pribadi berbasis kubah langit 3D interaktif. Abadikan setiap momen hidup
                Anda di bawah gemerlap 12 rasi bintang zodiak.
              </p>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  className="w-full px-4 py-2.5 rounded-full border border-white/20 bg-white/5 text-xs text-white placeholder-nebula-silver/60 focus:outline-none focus:border-cyan-glow"
                />
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-cyan-glow text-space-navy text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shrink-0"
                >
                  Kirim
                </button>
              </div>
            </div>

            {/* Center: Quick Links */}
            <div className="md:col-span-3">
              <h4 className="font-display text-xs uppercase tracking-wider text-cyan-glow font-bold mb-4">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-xs text-nebula-silver">
                <li>
                  <Link href="/sky" className="hover:text-white transition-colors">
                    Kubah Langit 3D
                  </Link>
                </li>
                <li>
                  <a href="#constellations" className="hover:text-white transition-colors">
                    12 Rasi Bintang
                  </a>
                </li>
                <li>
                  <a href="#workflow" className="hover:text-white transition-colors">
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Masuk Akun
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right: Contact info */}
            <div className="md:col-span-4">
              <h4 className="font-display text-xs uppercase tracking-wider text-cyan-glow font-bold mb-4">
                Kontak & Arsip
              </h4>
              <p className="text-xs text-nebula-silver leading-relaxed mb-2">
                info@twelveskies.com
              </p>
              <p className="text-xs text-nebula-silver leading-relaxed mb-2">
                Observatorium Kosmik Virtual
              </p>
              <p className="text-xs text-nebula-silver/60 leading-relaxed">
                Setiap momen diabadikan pada koordinat kosmik yang abadi.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-nebula-silver/70 gap-3">
            <p>&copy; 2026 Twelve Skies. All rights reserved.</p>
            <p className="font-mono text-[11px] text-cyan-glow/80">
              Inspired by Neowise Astronomy Visual Language
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
