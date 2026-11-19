import Link from "next/link";

export default function SanctuaryClosing() {
  return (
    <section
      id="sanctuary"
      aria-labelledby="sanctuary-heading"
      className="relative z-10 pointer-events-none py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl pointer-events-auto rounded-xl border border-white/12 bg-space-black/90 p-7 sm:p-10">
          <h2
            id="sanctuary-heading"
            className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-ink-primary leading-tight mb-4"
          >
            Private by design.
          </h2>
          <p className="text-base text-ink-secondary leading-relaxed mb-7">
            Twelve Skies has no public feeds, no follower counts, and no social
            algorithms. Sign in to keep your photographs, locations, and notes inside
            a quiet 3D sky vault visible only to you.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/login"
              className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-ink-primary transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/sky"
              className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg border border-white/25 text-ink-primary font-medium text-sm hover:border-cyan-glow hover:bg-white/[0.06] transition-colors"
            >
              Open 3D Sky
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
