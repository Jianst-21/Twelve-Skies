import Link from "next/link";
import CelestialLogo from "@/components/ui/CelestialLogo";

export default function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/12 bg-space-black">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg border border-cyan-glow/30 bg-space-abyss flex items-center justify-center text-cyan-glow shrink-0">
            <CelestialLogo size={21} />
          </span>
          <div>
            <span className="font-display text-sm font-bold tracking-[0.12em] uppercase text-ink-primary block">
              Twelve Skies
            </span>
            <span className="text-xs text-ink-secondary">
              Private 3D photo vault arranged by calendar date
            </span>
          </div>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-secondary"
        >
          <a href="#capabilities" className="hover:text-ink-primary transition-colors py-1">
            How it works
          </a>
          <a href="#sanctuary" className="hover:text-ink-primary transition-colors py-1">
            Privacy
          </a>
          <Link href="/login" className="hover:text-ink-primary transition-colors py-1">
            Sign In
          </Link>
          <Link href="/sky" className="hover:text-ink-primary transition-colors py-1">
            Open 3D Sky
          </Link>
        </nav>
      </div>
    </footer>
  );
}
