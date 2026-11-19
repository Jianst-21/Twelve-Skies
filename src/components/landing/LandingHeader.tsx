"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import CelestialLogo from "@/components/ui/CelestialLogo";

const NAV_LINKS = [
  { href: "#observatory", label: "Observatory" },
  { href: "#date-engine", label: "Date Engine" },
  { href: "#constellations", label: "12 Houses" },
  { href: "#archive", label: "Archive" },
];

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    closeRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group min-h-[44px]">
          <span className="w-9 h-9 rounded-lg border border-cyan-glow/30 bg-space-abyss flex items-center justify-center text-cyan-glow group-hover:border-cyan-glow transition-colors">
            <CelestialLogo size={20} />
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-[0.14em] uppercase text-ink-primary">
            Twelve Skies
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="min-h-[44px] px-4 inline-flex items-center justify-center rounded-lg border border-white/15 text-sm font-medium text-ink-primary hover:border-cyan-glow/60 hover:bg-white/[0.04] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sky"
            className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy text-sm font-bold hover:bg-white transition-colors"
          >
            Open 3D Sky
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="sm:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-white/15 text-ink-primary hover:border-cyan-glow transition-colors"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 bg-black/90 p-6 flex flex-col justify-between sm:hidden"
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="font-display text-base font-bold tracking-[0.14em] uppercase text-ink-primary">
                Twelve Skies
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close navigation menu"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-white/15 text-ink-primary"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile links" className="mt-6 flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="min-h-[44px] px-3 flex items-center text-base font-medium text-ink-secondary hover:text-ink-primary border-b border-white/5"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] w-full inline-flex items-center justify-center rounded-lg border border-white/20 text-sm font-medium text-ink-primary"
            >
              Sign In
            </Link>
            <Link
              href="/sky"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] w-full inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy text-sm font-bold"
            >
              Open 3D Sky
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
