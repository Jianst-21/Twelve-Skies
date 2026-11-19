# Twelve Skies Full Website Overhaul Plan

**Goal:** Completely overhaul the Twelve Skies web application (`/`, `/login`, `/sky`) into a cohesive, accessible, high-craft English astronomical observatory experience while preserving the cosmic Neowise deep-space background, the 3D zodiac constellation dome, and all backend/database contracts.

**Visual Direction:** Bioluminescent Wake Starfield (`reefs-bioluminescent-nocturnal-plankton-wake-stars`, `seed:cd1b5f73e70bdff4`) fused with the user-specified Neowise deep-space starfield background (`10-star-mini.jpg`, `2-star-mini.jpg`, `#000000` -> `#03045E`).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Three.js / React Three Fiber / Drei, Prisma ORM, Supabase Auth & Storage.

## Global Constraints
- **Database:** Strict Prisma ORM in Server API Routes (`/api/memories`, `/api/memories/[id]`). Never query Supabase DB directly.
- **Supabase:** Auth and Storage (`sky-memories` bucket) only.
- **Image Compression:** Client-side WebP compression (`maxDim: 1920`, quality `0.82`) preserved in `UploadPhotoModal`.
- **Single Source of Truth:** `getConstellationAndNode(date)` in `src/lib/dateDistributor.ts` and `CONSTELLATIONS` in `src/data/constellations.ts`.
- **Language:** Unified English across `/`, `/login`, `/sky`, modals, and error/empty/loading states.
- **Antislop & Craft Floor:** Zero em dashes (`—`), zero raw Unicode zodiac/emoji glyphs in UI, zero eyebrow capsule pills, zero gradient text on H1, zero blurred radial glow blobs, dose-capped glassmorphism, explicit loading/empty/error states, WCAG AA contrast, keyboard accessibility (`Escape`, `Tab`, `:focus-visible`), `prefers-reduced-motion` support.

## Tasks
1. **Design Tokens, Fonts & Neowise Bioluminescent Starfield Background:**
   - Update `src/app/layout.tsx` (`Titillium Web`, `Manrope`, `JetBrains Mono`) and `src/app/globals.css` (color tokens, focus-visible, custom scrollbar, selection, `overflow-x: clip`, keyframes, `prefers-reduced-motion`).
   - Create `src/components/canvas/WakeStarfieldBackground.tsx` combining Neowise starfield layers with a 60fps pointer-reactive bioluminescent star-wake canvas.
   - Update `src/data/constellations.ts` period labels to clean English (`Dec 22 - Jan 19`, etc.) and `src/lib/dateDistributor.ts` month names to English (`Jan..Dec`) while preserving exact day math.
2. **Landing Page Overhaul (`/`):**
   - Build `src/components/landing/LandingHeader.tsx` (responsive flat horizon nav with mobile drawer).
   - Build `src/components/landing/HeroObservatory.tsx` (interactive SVG/canvas 12-constellation star dome, tethered frosted inspection lens with `Illustrative Preview`, 12-zodiac horizon meridian selector).
   - Build `src/components/landing/DateMappingSimulator.tsx` (live `getConstellationAndNode` calculator showing `B = floor(D/N)` bucket breakdown).
   - Build `src/components/landing/ConstellationLedger.tsx` (interactive 12-constellation astronomical index + projected star map).
   - Build `src/components/landing/ArchivePlatesSection.tsx` & `LandingFooter.tsx` (clearly labeled illustrative archive plates, private sanctuary covenant, concise footer).
   - Refactor `src/app/page.tsx` to compose these components cleanly.
3. **Login Page Overhaul (`/login`):**
   - Overhaul `src/app/login/page.tsx` in English with Neowise + Bioluminescent background, accessible labels, password visibility toggle, observatory gate styling, and clean validation/error/success states.
4. **3D Sky Vault Overhaul (`/sky` & Components):**
   - Update `src/components/canvas/Constellation.tsx` (replace raw Unicode symbol with `ZodiacGlyph`, show real memory count indicator).
   - Update `src/components/canvas/StarNode.tsx` (keyboard-accessible button node, fix missing `animate-in` classes, crisp radial thumbnail reveal).
   - Update `src/components/ui/Navbar.tsx` (English copy, real vault memory counter, quick date/memory jump trigger).
   - Update `src/components/ui/BottomPagination.tsx` (English copy, accessible aria states).
   - Update `src/components/ui/NodeSplitPanel.tsx` (English copy, inline 2-step delete confirmation replacing `confirm()`, real slide-in CSS, keyboard accessibility).
   - Update `src/components/ui/UploadPhotoModal.tsx` (English copy, `Escape` key + backdrop close, accessible labels, consistent observatory styling).
   - Update `src/app/sky/page.tsx` (English copy, replace raw `✨`/`✕` emojis, explicit loading/error/retry/empty states, `Escape` and `ArrowLeft`/`ArrowRight` keyboard shortcuts, quick memory index drawer).
   - Update `src/app/auth/callback/route.ts` error message to English.
5. **Verification & Documentation:**
   - Run `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `impeccable detect --json`.
   - Start dev server and inspect rendered desktop & mobile screenshots via `impeccable first-viewport` / `impeccable shot` and browser verification across `/`, `/login`, and `/sky` (checking console errors, responsive layout, and interactive states).
   - Write `DESIGN.md` and `.impeccable/design.json` via `impeccable` documenter flow.
