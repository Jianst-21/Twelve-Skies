import Image from "next/image";
import Link from "next/link";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import SectionStarfield from "@/components/landing/SectionStarfield";

export default function ArchivePlatesSection() {
  const featuredPlate = ILLUSTRATIVE_MEMORIES[3]; // Mount Bromo
  const secondaryPlates = [
    ILLUSTRATIVE_MEMORIES[0], // Tromso Aurora
    ILLUSTRATIVE_MEMORIES[2], // Maldives Tide
    ILLUSTRATIVE_MEMORIES[1], // Sahara Dusk
  ];

  return (
    <section id="archive" className="relative py-16 sm:py-24">
      <SectionStarfield variant="nebula-down" />
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 space-y-20">
        {/* Illustrative Archive Plates */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary mb-3">
                Illustrative Memory Plates
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed">
                Sample entries demonstrating how personal photographs and journal notes sit inside
                their governing constellation coordinates. Your own vault stays strictly private.
              </p>
            </div>
            <span className="font-mono text-xs text-ink-muted border border-white/15 rounded-md px-3 py-1.5 self-start sm:self-auto">
              Illustrative Sample Entries
            </span>
          </div>

          {/* Asymmetric Editorial Layout: Large Featured Plate + 3 Stacked/Row Plates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Wide Plate */}
            <article className="lg:col-span-7 rounded-xl border border-white/15 bg-black/65 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10">
                <Image
                  src={featuredPlate.image}
                  alt={featuredPlate.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2">
                    <span style={{ color: featuredPlate.glowColor }}>
                      {featuredPlate.constellationName} / {featuredPlate.nodeNumberLabel} (
                      {featuredPlate.nodeRange})
                    </span>
                    <span className="text-ink-muted">Illustrative Preview</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink-primary mb-2">
                    {featuredPlate.title}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {featuredPlate.caption}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>{featuredPlate.location}</span>
                  <span>{featuredPlate.displayDate}</span>
                </div>
              </div>
            </article>

            {/* Three Companion Plates */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {secondaryPlates.map((plate) => (
                <article
                  key={plate.id}
                  className="rounded-xl border border-white/15 bg-black/65 p-4 flex gap-4 items-center"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-lg overflow-hidden border border-white/15 shrink-0">
                    <Image
                      src={plate.image}
                      alt={plate.imageAlt}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-mono text-[11px] truncate mb-1"
                      style={{ color: plate.glowColor }}
                    >
                      {plate.constellationName} / {plate.nodeNumberLabel}
                    </div>
                    <h3 className="font-display text-base font-bold text-ink-primary truncate">
                      {plate.title}
                    </h3>
                    <p className="text-xs text-ink-secondary line-clamp-2 mt-1">
                      {plate.caption}
                    </p>
                    <div className="mt-2 font-mono text-[11px] text-ink-muted flex items-center justify-between gap-2">
                      <span className="truncate">{plate.location}</span>
                      <span className="shrink-0">{plate.displayDate}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Private Sanctuary Covenant */}
        <div className="rounded-xl border border-cyan-glow/25 bg-space-abyss/70 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary mb-4">
                Built for Quiet Reflection, Never Public Feeds
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed mb-6 max-w-[60ch]">
                Twelve Skies omits follower counts, public timelines, and social algorithms. Sign
                in to keep your photographs, locations, and written notes inside a private sky
                vault arranged solely by your own dates.
              </p>

              <div className="flex flex-wrap gap-3.5">
                <Link
                  href="/login"
                  className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors"
                >
                  Create or Unlock Your Vault
                </Link>
                <Link
                  href="/sky"
                  className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-lg border border-white/20 text-ink-primary font-medium text-sm hover:border-cyan-glow/60 transition-colors"
                >
                  Launch 3D Sky Dome
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/15">
                <Image
                  src="/images/vault/sanctuary-cabin.jpg"
                  alt="Quiet wooden cabin beneath a crisp starry night sky"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
