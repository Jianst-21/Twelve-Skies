import Link from "next/link";
import CelestialLogo from "@/components/ui/CelestialLogo";

export default function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/12 bg-space-black pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-7xl mx-auto pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
          className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-secondary"
        >
          <a
            href="#capabilities"
            className="min-h-[44px] min-w-[44px] inline-flex items-center hover:text-ink-primary transition-colors"
          >
            How it works
          </a>
          <a
            href="#sanctuary"
            className="min-h-[44px] min-w-[44px] inline-flex items-center hover:text-ink-primary transition-colors"
          >
            Privacy
          </a>
          <Link
            href="/login"
            className="min-h-[44px] min-w-[44px] inline-flex items-center hover:text-ink-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sky"
            className="min-h-[44px] min-w-[44px] inline-flex items-center hover:text-ink-primary transition-colors"
          >
            Open 3D Sky
          </Link>
        </nav>
      </div>
    </footer>
  );
}
