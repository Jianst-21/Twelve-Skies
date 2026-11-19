# Twelve Skies Landing Page Overhaul Implementation Plan

> **For agentic workers:** Implementing directly in this session following the approved spec. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/` (`src/app/page.tsx`) over the exact same WebGL 3D `SpaceDome` and 12-constellation star shaders used in `/sky`, eliminating the Neowise JPG/gradient backdrop and duplicate zodiac widgets while highlighting what users can actually do inside Twelve Skies.

**Architecture:** Extract the shared 3D dome constellation layout (`DOME_CONSTELLATIONS`) so `/` and `/sky` share identical 3D geometry. Mount a single fixed, non-scroll-trapping WebGL `LandingSkyBackdrop` (`SpaceDome` + `Constellation` + `StarNode`) synchronized via `LandingExperience` with an open-sky `HeroSkySection`, a focused 3-part `CapabilitiesSection` (interactive date-to-star panning, 360-degree orbit & hover preview, split-view journal preview), a quiet `SanctuaryClosing`, and lean header/footer.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Three.js / React Three Fiber / Drei, Node native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-20-landing-overhaul-design.md`

## Global Constraints

- Exact 3D parity: `/` uses `SpaceDome`, `Constellation`, `StarNode`, and `computeDomeConstellations` with identical parameters (`sphereRadius: 52`, `waveElevationDeg: 46`, `minIntraDistance: 4.8`) as `/sky`.
- English UI copy across all routes; zero em dashes, zero raw Unicode zodiac glyphs, zero AI buzzwords, zero fabricated metrics/testimonials, zero eyebrow pills above headings.
- True frosted glass (`backdrop-blur-md`) capped to at most 2 focal surfaces on `/`; open starfield remains visible.
- Full keyboard accessibility (`Tab`, `Enter`, `Space`, `Escape` on mobile drawer), `>= 44px` touch targets, WCAG AA contrast (`>= 4.5:1`), `prefers-reduced-motion` support, and zero scroll-trapping from WebGL on mobile/desktop.
- `/sky` and `/login` stay fully functional without regression.

## Review Focus

- **Scroll-blocking WebGL canvas:** Canvas must never capture vertical wheel/touch scroll on `/` (`OrbitControls` disabled, `touch-action: pan-y`).
- **Floating HTML nameplates colliding with copy:** `Constellation` must accept `showNameplate?: boolean` (default `true`) so `/` hides 12 floating labels while `/sky` keeps them unchanged.
- **Invalid/empty date input in live date picker:** Clearing or typing a partial date must never crash `getConstellationAndNode` (graceful fallback with clear inline message).
- **Readable text over bright Milky Way / stars:** Left hero column and prose bands must carry subtle localized dark radial/linear scrims so contrast never drops below 4.5:1 over bright stars.
- **Mobile & tablet reflow:** Zero horizontal overflow at 390px, 768px, and 1440px; hover-only star preview has explicit tap/keyboard controls.

---

### Task 1: Shared 3D Dome Constellations & Non-Breaking `Constellation` Props
**Files:**
- Create: `src/components/canvas/domeConstellations.ts`
- Modify: `src/components/canvas/SkyCanvas.tsx`
- Modify: `src/components/canvas/Constellation.tsx`
- Modify: `src/components/canvas/celestialMath.ts` (add pure helper `computeLandingCameraDirection` for offset + scroll drift)
- Test: `tests/celestialMath.test.mjs`

- [ ] Add failing unit tests in `tests/celestialMath.test.mjs` for `computeLandingCameraDirection` (right-framing offset so constellations frame in open sky on desktop, zero offset on mobile, bounded scroll yaw/pitch drift, unit-length normalized output).
- [ ] Run `node --test tests/celestialMath.test.mjs` to verify failure.
- [ ] Implement `computeLandingCameraDirection` in `src/components/canvas/celestialMath.ts`, extract `DOME_CONSTELLATIONS` & `DOME_CONSTELLATION_MAP` into `src/components/canvas/domeConstellations.ts`, update `SkyCanvas.tsx` to import it, and add optional `showNameplate = true` and `interactive = true` props to `Constellation.tsx`.
- [ ] Run `node --test tests/celestialMath.test.mjs` to verify pass.

### Task 2: Unified 3D Landing Backdrop (`LandingSkyBackdrop.tsx`)
**Files:**
- Create: `src/components/landing/LandingSkyBackdrop.tsx`

- [ ] Build `LandingSkyBackdrop` mounting the exact `SpaceDome` + all 12 `DOME_CONSTELLATIONS` via `Constellation` (with `showNameplate={false}`, `interactive={false}` on non-focused constellations or controlled hover/click on the active hero constellation).
- [ ] Implement `LandingCameraRig` using `computeLandingCameraDirection` to smoothly slerp toward `focusedConstellationId` + `focusedNodeIndex` with gentle scroll-driven drift read from `window.scrollY` inside `useFrame` (paused under `prefers-reduced-motion: reduce`), plus desktop horizontal offset so the focused constellation glows cleanly in open space.
- [ ] Provide WebGL error/loading fallback (clean `#000000` cosmic void, zero Neowise JPGs).

### Task 3: Focused Landing Sections & Header/Footer Overhaul
**Files:**
- Create: `src/components/landing/LandingExperience.tsx`
- Create: `src/components/landing/HeroSkySection.tsx`
- Create: `src/components/landing/CapabilitiesSection.tsx`
- Create: `src/components/landing/SanctuaryClosing.tsx`
- Modify: `src/components/landing/LandingHeader.tsx`
- Modify: `src/components/landing/LandingFooter.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] Update `LandingHeader.tsx` (brand mark, `How it works`, `Privacy`, `Sign In`, `Open 3D Sky`, labeled mobile `Menu` button with `Escape` + focus restoration).
- [ ] Build `HeroSkySection.tsx` (open-sky hero with subtle left-side readability scrim, headline, 1 clear sentence, 2 specific CTAs, 3 accessible sample-star selector buttons that pan the live 3D sky, and 1 frosted `Sample Memory` inspection lens).
- [ ] Build `CapabilitiesSection.tsx` (3 asymmetric, varied demonstrations: live date-to-star picker synced with the 3D sky, 360-degree orbit & star-bloom hover showcase, and split-view memory journal showcase).
- [ ] Build `SanctuaryClosing.tsx` and slim `LandingFooter.tsx`.
- [ ] Wire `LandingExperience.tsx` into `src/app/page.tsx` and remove unused `.bg-neowise-nebula-*` rules from `src/app/globals.css`.

### Task 4: Cleanup Obsolete Components & Sync Design Docs
**Files:**
- Delete: `src/components/landing/HeroObservatory.tsx`
- Delete: `src/components/landing/DateMappingSimulator.tsx`
- Delete: `src/components/landing/ConstellationLedger.tsx`
- Delete: `src/components/landing/ArchivePlatesSection.tsx`
- Delete: `src/components/landing/SectionStarfield.tsx`
- Modify: `DESIGN.md`
- Modify: `.impeccable/surfaces/landing.md`

- [ ] Remove the 5 obsolete landing components after confirming zero remaining imports.
- [ ] Update `DESIGN.md` and `.impeccable/surfaces/landing.md` to document the unified 3D `SpaceDome` world accurately.

### Task 5: Full Verification, Visual Inspection, Commit & Push
- [ ] Run `node --test tests/celestialMath.test.mjs`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- [ ] Verify rendered `/` on desktop (1440x900), tablet (768x1024), and mobile (390x844) in real browser—check 3D `SpaceDome` & constellation parity, interactive sample chips, date picker panning, mobile menu, contrast, console errors, and `/sky` + `/login` health.
- [ ] Commit cleanly (brief English message per project Git guidelines) and push to remote.
