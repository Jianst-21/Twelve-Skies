import Link from "next/link";
import { CONSTELLATIONS } from "@/data/constellations";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-space-black text-white selection:bg-cyan-glow selection:text-space-navy overflow-hidden">
      {/* Subtle deep-space ambient radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(3,4,94,0.35),rgba(0,0,0,1))]" />

      {/* Header / Navbar */}
      <header className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-cyan-glow/30 bg-space-navy/70 flex items-center justify-center text-cyan-glow">
            <CelestialLogo size={22} />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-wider uppercase text-white block leading-tight">
              Twelve Skies
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-glow/80 uppercase block">
              Celestial Vault
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full border border-white/15 bg-white/5 text-xs sm:text-sm font-medium text-white hover:border-cyan-glow/60 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/sky"
            className="px-5 py-2 rounded-full bg-cyan-glow text-space-navy text-xs sm:text-sm font-semibold hover:bg-white transition-colors"
          >
            Buka Langit 3D
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.15] max-w-3xl mx-auto mb-6 text-white">
          Kubah Arsip Memori di Bawah{" "}
          <span className="text-cyan-glow">12 Rasi Bintang</span>
        </h1>

        <p className="font-body text-nebula-silver text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Galeri foto pribadi berbasis kubah langit 3D interaktif. Setiap kenangan Anda
          ditempatkan secara otomatis pada titik bintang zodiak sesuai tanggal momen berlangsung.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
          <Link
            href="/sky"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors text-center"
          >
            Jelajahi Kubah Langit
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-space-navy/60 border border-white/20 text-white font-medium text-sm hover:border-cyan-glow/60 transition-colors text-center"
          >
            Akses Akun Pribadi
          </Link>
        </div>

        {/* 12 Zodiac Constellations Grid Showcase with authentic SVG glyphs */}
        <div className="pt-10 border-t border-white/10">
          <div className="text-center mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider uppercase mb-1.5 text-white">
              12 Rasi Bintang Zodiak
            </h2>
            <p className="text-xs sm:text-sm text-nebula-silver">
              Setiap rasi memetakan periode kalender ke koordinat kubah antariksa
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CONSTELLATIONS.map((c) => (
              <div
                key={c.id}
                className="group relative p-4 rounded-xl bg-space-navy/30 border border-white/10 hover:border-cyan-glow/40 transition-colors flex flex-col items-center text-center"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-colors"
                  style={{
                    backgroundColor: `${c.glowColor}15`,
                    color: c.glowColor,
                  }}
                >
                  <ZodiacGlyph id={c.id} size={20} />
                </div>
                <span className="font-display text-sm font-semibold tracking-wide text-white">
                  {c.name}
                </span>
                <span className="text-[11px] text-nebula-silver mt-0.5">{c.periodText}</span>
                <div className="mt-2.5 px-2 py-0.5 rounded text-[10px] font-mono text-nebula-silver/80 bg-white/5">
                  {c.nodes.length} Titik Bintang
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Product Workflow Breakdown (Replaces generic 3-card template) */}
        <div className="mt-24 pt-12 border-t border-white/10 text-left">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider uppercase text-white mb-2">
              Cara Kerja Twelve Skies
            </h2>
            <p className="text-xs sm:text-sm text-nebula-silver">
              Sistem pengarsipan foto berbasis astronomi dan tanggal kalender
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-space-navy/30 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-cyan-glow uppercase tracking-wider block mb-2">
                  Tahap 01 · Distribusi Temporal
                </span>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Pemetaan Otomatis Berdasarkan Tanggal
                </h3>
                <p className="text-xs text-nebula-silver leading-relaxed">
                  Setiap foto yang Anda unggah memiliki stempel tanggal. Sistem langsung menghitung
                  rasi zodiak dan indeks titik bintang spesifik tanpa perlu penataan manual.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-space-navy/30 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-amber-star uppercase tracking-wider block mb-2">
                  Tahap 02 · Navigasi 3D
                </span>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Kubah Langit 360 Derajat
                </h3>
                <p className="text-xs text-nebula-silver leading-relaxed">
                  Putar, perbesar, dan telusuri kubah langit malam interaktif. Sorot titik bintang
                  untuk melihat pratinjau thumbnail lingkaran secara instan.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-space-navy/30 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-cyan-glow uppercase tracking-wider block mb-2">
                  Tahap 03 · Linimasa Cerita
                </span>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Panel Terpisah & Linimasa Memori
                </h3>
                <p className="text-xs text-nebula-silver leading-relaxed">
                  Klik titik bintang untuk membuka panel detail di sisi layar: telusuri slideshow
                  foto resolusi penuh, catatan kenangan, serta penanda lokasi momen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-nebula-silver gap-4">
        <p>&copy; 2026 Twelve Skies. Arsip Memori Langit Pribadi.</p>
        <p className="font-mono text-[11px] text-nebula-silver/60">
          Setiap momen diabadikan pada koordinat kosmik
        </p>
      </footer>
    </div>
  );
}
