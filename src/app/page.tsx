import Link from "next/link";
import { CONSTELLATIONS } from "@/data/constellations";
import { Sparkles, Compass, Eye, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-space-black text-white selection:bg-cyan-glow selection:text-space-navy overflow-hidden">
      {/* Cosmic background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-space-navy/40 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -left-48 w-[500px] h-[500px] bg-cyan-glow/10 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 -right-48 w-[600px] h-[600px] bg-space-navy/50 rounded-full blur-[150px]" />

      {/* Header / Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-cyan-glow/40 bg-space-navy/60 flex items-center justify-center text-cyan-glow shadow-[0_0_15px_rgba(124,222,228,0.25)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-wider uppercase text-white">
              Twelve Skies
            </span>
            <span className="block text-[10px] tracking-[0.2em] text-cyan-glow uppercase -mt-0.5">
              Celestial Vault
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full border border-cyan-glow/30 bg-space-navy/40 text-sm font-medium text-white hover:bg-white hover:text-space-navy transition-all duration-300"
          >
            Masuk
          </Link>
          <Link
            href="/sky"
            className="px-6 py-2.5 rounded-full bg-cyan-glow text-space-navy text-sm font-semibold hover:bg-transparent hover:text-white hover:border hover:border-white transition-all duration-300 shadow-[0_0_20px_rgba(124,222,228,0.3)]"
          >
            Buka Langit 3D
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Eyebrow signature Neowise style */}
        <div className="inline-flex items-center gap-4 mb-6">
          <span className="w-10 sm:w-16 h-[1px] bg-cyan-glow/60" />
          <span className="text-cyan-glow text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase font-display">
            A r s i p &bull; K e n a n g a n &bull; K o s m i k
          </span>
          <span className="w-10 sm:w-16 h-[1px] bg-cyan-glow/60" />
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto mb-8">
          Abadikan Setiap Momen di Bawah{" "}
          <span className="bg-gradient-to-r from-cyan-glow via-white to-amber-star bg-clip-text text-transparent">
            12 Rasi Bintang
          </span>
        </h1>

        <p className="font-body text-nebula-silver text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Galeri foto pribadi berbasis kubah langit 3D interaktif. Setiap kenangan Anda
          ditempatkan secara otomatis pada titik bintang zodiak sesuai tanggal pengambilan momen.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/sky"
            className="w-full sm:w-auto px-8 py-4 rounded-[30px] bg-cyan-glow text-space-navy font-bold text-base hover:bg-transparent hover:text-white hover:border hover:border-white transition-all duration-300 shadow-[0_0_30px_rgba(124,222,228,0.35)] flex items-center justify-center gap-2 group"
          >
            <span>Mulai Jelajahi Langit</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-[30px] bg-space-navy/50 border border-cyan-glow/30 text-white font-medium text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
          >
            Akses Akun Pribadi
          </Link>
        </div>

        {/* 12 Zodiac Constellations Grid Showcase */}
        <div className="mt-12 pt-12 border-t border-cyan-glow/15">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold tracking-wider uppercase mb-2">
              12 Rasi Bintang Zodiak
            </h2>
            <p className="text-xs sm:text-sm text-nebula-silver">
              Jelajahi titik bintang dan spektrum warna kosmik setiap periode
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {CONSTELLATIONS.map((c) => (
              <div
                key={c.id}
                className="group relative p-4 rounded-2xl bg-space-navy/30 border border-white/5 hover:border-cyan-glow/40 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm flex flex-col items-center text-center overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: c.glowColor }}
                />
                <span
                  className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: c.glowColor }}
                >
                  {c.symbol}
                </span>
                <span className="font-display text-sm font-bold tracking-wide text-white">
                  {c.name}
                </span>
                <span className="text-[11px] text-nebula-silver mt-1">{c.periodText}</span>
                <div
                  className="mt-3 px-2 py-0.5 rounded-full text-[10px] font-mono border"
                  style={{
                    borderColor: `${c.glowColor}40`,
                    color: c.glowColor,
                    backgroundColor: `${c.glowColor}10`,
                  }}
                >
                  {c.nodes.length} Titik Bintang
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-[28px] bg-space-navy/40 border border-cyan-glow/20 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Kubah Langit 360° Bebas
            </h3>
            <p className="text-sm text-nebula-silver leading-relaxed">
              Jelajahi angkasa secara mulus dengan kontrol kamera putar, zoom, dan navigasi cepat
              ke seluruh penjuru 12 rasi zodiak.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-space-navy/40 border border-cyan-glow/20 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-star/10 border border-amber-star/30 text-amber-star flex items-center justify-center mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Split-View & Sparkle Node
            </h3>
            <p className="text-sm text-nebula-silver leading-relaxed">
              Arahkan kursor untuk pratinjau instan (*radial expand*) atau klik untuk membuka panel
              slideshow dan linimasa cerita momen Anda.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-space-navy/40 border border-cyan-glow/20 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Privasi & Keamanan Penuh
            </h3>
            <p className="text-sm text-nebula-silver leading-relaxed">
              Kubah galeri foto Anda dilindungi enkripsi Supabase Auth dan Prisma ORM database layer
              khusus untuk memori pribadi Anda.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-cyan-glow/15 flex flex-col sm:flex-row items-center justify-between text-xs text-nebula-silver gap-4">
        <p>&copy; 2026 Twelve Skies. Seluruh hak cipta dilindungi.</p>
        <p className="font-mono text-[11px] text-cyan-glow/70">
          Dirancang dengan estetika antariksa kosmik Neowise
        </p>
      </footer>
    </div>
  );
}
