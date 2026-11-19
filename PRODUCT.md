# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Private individuals archiving personal photographs and written reflections over time, seeking a calm, enduring space to revisit memories without social feeds, likes, or public timelines.

## Product Purpose

Twelve Skies is a private 3D celestial photo archive that maps personal memories into the twelve zodiac constellations inside an interactive 360-degree astronomical dome. Every uploaded photograph is positioned by its capture date onto a specific star node, turning chronological life moments into a navigable night sky.

## Positioning

Unlike flat chronological photo grids or social galleries, Twelve Skies uses a proportional astronomical date-distribution algorithm (`getConstellationAndNode`: base `floor(D/N)` days per star node with remainder `D mod N` distributed across the first `R` nodes) so every calendar date resolves deterministically to a 3D star coordinate with zero gaps and zero overlapping clusters.

## Operating Context

- **Public entry (`/`):** Introduces the astronomical concept, interactive constellation preview, and illustrative sample memories, leading visitors to sign in or launch the 3D dome.
- **Authentication (`/login`, `/auth/callback`):** Email and password sign-up/sign-in and session verification via Supabase Auth.
- **Private 3D Sky Vault (`/sky`):** Protected interactive 3D dome built with React Three Fiber / Three.js where the owner orbits 360 degrees, selects or cycles through all 12 constellations, hovers 4-point star nodes for a radial thumbnail preview, opens a split-view memory journal (55% 3D dome / 45% slideshow + timeline cards), and uploads, edits, or deletes memories.
- **Language:** English across the entire application (`/`, `/login`, `/sky`, modals, and notifications).

## Capabilities and Constraints

- **Database boundary:** Strict Prisma ORM (`prisma/schema.prisma` `Memory` model) in Next.js API Route Handlers (`/api/memories`, `/api/memories/[id]`). Never query Supabase database tables directly from client or server.
- **Supabase scope:** Strictly Supabase Auth and Supabase Storage (`sky-memories` bucket).
- **Client-side image optimization:** Photos are compressed in the browser before upload (max dimension 1920px, WebP, quality 0.82).
- **Single source of truth:** `getConstellationAndNode(date)` in `src/lib/dateDistributor.ts` and `CONSTELLATIONS` in `src/data/constellations.ts` govern all constellation and node assignments.
- **Existing tech stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Three.js / React Three Fiber / Drei, Prisma, Supabase SSR/JS, Lucide React.

## Brand Commitments

- **Name:** Twelve Skies (Celestial Photo Vault).
- **Core theme:** Nocturnal celestial observatory and deep-space starfield aesthetic (`Space Black #000000`, `Midnight Navy #03045E`, `Electric Cyan #7CDEE4`, `Stellar Amber #FEC42D`, `Nebula Silver #A0AEC0`, plus the 12 calibrated constellation glow hues).
- **Signature geometry:** 4-point sparkle star nodes (`StarNode`), custom astronomical vector glyphs (`ZodiacGlyph.tsx`), and the armillary-inspired emblem (`CelestialLogo.tsx`). No raw Unicode astrological emojis in UI headings or controls.
- **Privacy stance:** No public feeds, no like counters, no vanity metrics, no fabricated testimonials or statistics.

## Evidence on Hand

- Real 3D constellation coordinate dataset (`src/data/constellations.ts`) covering all 12 zodiac constellations (Capricorn through Sagittarius) with calibrated colors and astronomical node layouts.
- Real date distribution engine (`src/lib/dateDistributor.ts`) and Prisma-backed memory CRUD API (`src/app/api/memories/**`).
- Existing photographic assets in `public/images/vault/` (e.g., `hero-stargazer.jpg`, `celestial-dome.jpg`, `mathematical-sky.jpg`, `memory-aurora.jpg`, `memory-ocean.jpg`, `memory-desert.jpg`, `memory-mountain.jpg`, `sanctuary-cabin.jpg`, `splitview-preview.jpg`, `stargazing-camp.jpg`) and `public/images/neowise/` starfield textures (`10-star-mini.jpg`, `2-star-mini.jpg`).
- Landing page sample memories are **illustrative sample entries** and must be clearly labeled as illustrative previews rather than real user counts or testimonials.

## Product Principles

1. **Sky first, chrome second:** The 3D starfield and constellation geometry remain visible and atmospheric; UI surfaces use restrained translucency rather than opaque walls or heavy blur stacks.
2. **Deterministic poetic mapping:** Every memory has an exact mathematical home in time and 3D space without manual tagging overhead.
3. **Honest private sanctuary:** Zero social vanity metrics, zero fabricated statistics, and clear separation between illustrative public previews and private authenticated data.
4. **Full operational resilience:** Every asynchronous surface provides explicit loading, empty, and error states, full keyboard accessibility, and responsive behavior across mobile and desktop.

## Accessibility & Inclusion

- WCAG 2.1 AA contrast compliance across dark cosmic surfaces, translucent panels, and constellation-colored text.
- Full keyboard navigation (`Tab`, `Enter`, `Space`, `Escape` to close modals and split panels) and `prefers-reduced-motion` respect for starfield/UI motion.
