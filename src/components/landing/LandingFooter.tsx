import Link from "next/link";
import CelestialLogo from "@/components/ui/CelestialLogo";
import SectionStarfield from "@/components/landing/SectionStarfield";

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-white/10">
      <SectionStarfield variant="nebula-up" />
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-lg border border-cyan-glow/30 bg-space-abyss flex items-center justify-center text-cyan-glow">
                <CelestialLogo size={18} />
              </span>
              <span className="font-display text-base font-bold tracking-[0.14em] uppercase text-ink-primary">
                Twelve Skies
              </span>
            </div>
            <p className="text-sm text-ink-secondary max-w-md leading-relaxed">
              Personal 3D constellation photo archive mapping calendar memories across an
              interactive 360-degree astronomical dome.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-ink-primary mb-3">Navigate</h3>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <a href="#observatory" className="hover:text-ink-primary transition-colors">
                  Sky Preview
                </a>
              </li>
              <li>
                <a href="#date-engine" className="hover:text-ink-primary transition-colors">
                  By Date
                </a>
              </li>
              <li>
                <a href="#constellations" className="hover:text-ink-primary transition-colors">
                  Constellations
                </a>
              </li>
              <li>
                <a href="#archive" className="hover:text-ink-primary transition-colors">
                  Memories
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-ink-primary mb-3">Vault Access</h3>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <Link href="/login" className="hover:text-ink-primary transition-colors">
                  Sign In or Register
                </Link>
              </li>
              <li>
                <Link href="/sky" className="hover:text-ink-primary transition-colors">
                  Open 3D Sky Vault
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-ink-muted">
          <p>Twelve Skies · Private 3D Memory Archive</p>
          <p>Quiet personal keeping beneath your own sky</p>
        </div>
      </div>
    </footer>
  );
}
