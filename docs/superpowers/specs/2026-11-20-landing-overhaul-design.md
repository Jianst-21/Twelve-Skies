# Design Spec: Twelve Skies Landing Page Overhaul (Unified 3D Observatory)

**Date:** 2026-11-20
**Target:** Public landing page (`src/app/page.tsx` and `src/components/landing/*`), plus synced design documentation (`DESIGN.md`, `.impeccable/surfaces/landing.md`).
**Out of Scope (for this pass):** `/sky` core 3D vault behavior, `/login` authentication flow (stays functional on its existing backdrop unless scheduled as a follow-up), Prisma schema, and API routes.

---

## 1. Intent & Why

The `/sky` 3D vault already delivers a strong, atmospheric visual world (`SpaceDome.tsx` procedural Milky Way shader, 4,200 J2000 spectral catalog stars, delicate armillary parallels, and 4-point diffraction-spike `StarNode`s). By contrast, the current landing page (`/`) feels disconnected and crowded:

1. **Visual disconnect:** `/` renders flat tiled JPEG starfields (`SectionStarfield.tsx`) over abrupt alternating `#03045e` CSS gradients and a 2D cursor-wake dot canvas (`WakeStarfieldBackground.tsx`), which looks jarring next to `/sky`.
2. **Content clutter & duplication:** The current landing page repeats the 12-zodiac list, 2D SVG maps, and date-bucket grids across three heavy sections (`HeroObservatory`, `DateMappingSimulator`, `ConstellationLedger`) while obscuring what users can actually do inside the app.

**Goal:** Rebuild `/` as one unified, calm, breathable window into the real 3D `SpaceDome` sky, focused directly on what users can do in Twelve Skies:
- Place a personal photo and journal note onto its date's constellation star automatically.
- Orbit a private 360-degree 3D night sky across 12 constellations and hover stars to glimpse memories.
- Open any star's split-view memory journal (slideshow, notes, edit, chronological Vault Index) in complete privacy.

**Non-Goals & Anti-Goals:**
- No tiled Neowise JPEG starfield bands or alternating CSS navy gradients on `/`.
- No 2D cursor-wake particle overlay on `/`.
- No duplicated 12-zodiac tables, 2D SVG constellation widgets, or 9-card math-bucket grids.
- No fabricated metrics, testimonials, floating eyebrow pills, raw Unicode zodiac glyphs, or em dashes.
- No scroll-trapping 3D orbit controls on `/` that fight vertical page scrolling on mobile or desktop.

---

## 2. Approaches Considered

| Approach | Summary | Trade-off | Decision |
|---|---|---|---|
| **Option 1: Unified Live 3D Sky Backdrop + Focused 3-Act Flow** | Fixed WebGL `SpaceDome` + real 3D constellations run continuously behind `/`, drifting gently on scroll and panning when the visitor previews a sample star or tests a date. Content is trimmed to an open-sky hero, 3 real capability demonstrations, a quiet privacy closing band, and a lean footer. | Single lightweight WebGL canvas already proven in `/sky`; full visual continuity into `/sky` with zero scroll-trapping. | **Selected** |
| **Option 2: Full-Screen Interactive Sandbox Hero** | Immediate 100dvh draggable 3D sky demo with floating intro overlay and minimal scroll content. | Strong immediacy, but feels like a demo app rather than a clear introduction and risks touch-drag vs. scroll conflicts on mobile. | Rejected |
| **Option 3: Non-Interactive 3D Sky Backdrop + Pure Editorial Scroll** | Background-only `SpaceDome` with `pointer-events: none` and static editorial product previews. | Zero interaction friction, but visitors cannot interact with the 3D sky or see live constellation panning before entering `/sky`. | Rejected |

---

## 3. Design Direction & Antislop Dials

- **Mode:** Persuade & Experience (landing `/`).
- **Dials:** `ENERGY 2` (composed, luminous), `RHYTHM 3` (asymmetric, varied section compositions with open sky breathing room), `MOTION 2` (gentle scroll-linked 3D camera drift and interactive star-focus pan; respects `prefers-reduced-motion: reduce`).
- **Palette:** Space Black (`#000000`) and Space Abyss (`#04091e`) cosmic grounds; Cosmic White (`#f8fafc`) and Nebula Silver (`#9fb2cc`) ink; Electric Cyan (`#7cdee4`) strictly for primary interactive intent (`Open 3D Sky`, active focus, matched star highlight); twelve calibrated constellation colors reserved for star geometry and glyphs only.
- **Typography:** `Titillium Web` (display), `Manrope` (body, `>= 16px`), `JetBrains Mono` (strictly for astronomical dates and star node labels). No uppercase tracked eyebrow pills above headings.
- **Glassmorphism & Glow Cap:** Genuine frosted glass (`backdrop-blur-md`, `bg-space-abyss/50`, `border-white/15`) capped to 2 focal surfaces on `/` (the hero active sample lens and the split-view journal preview). All other containers sit clean and open so the 3D starfield stays visible behind them.

---

## 4. Architecture & Layout Structure

### A. Unified 3D Background (`src/components/landing/LandingSkyBackdrop.tsx`)
- Dynamically imported with `ssr: false` (fallback: clean `#000000` cosmic void so zero layout shift occurs).
- Fixed full-viewport `<Canvas>` (`fixed inset-0 z-0`) reusing `SpaceDome` and `DOME_CONSTELLATIONS` (`computeDomeConstellations` from `celestialMath.ts`).
- **Camera Rig (No Scroll Trapping):**
  - No `OrbitControls` wheel/drag capture; vertical scroll works natively on desktop and touch devices.
  - Camera aims at the currently focused constellation (default: `Leo` for the opening sample memory, offset subtly so the glowing constellation sits cleanly in the right/open half of desktop viewports while the left side stays dark and readable behind the hero headline).
  - Scrolling smoothly adds a gentle longitudinal yaw/pitch drift across the celestial sphere (read via `window.scrollY` inside `useFrame`, zero React state updates per scroll frame).
  - When the user picks a sample memory chip in the hero OR chooses a date in the Date-to-Star preview, the camera smoothly slerps to face that exact constellation and highlights its matching star node.
  - Under `prefers-reduced-motion: reduce`, scroll drift pauses and camera transitions snap cleanly.
- **Non-Breaking Extension to `Constellation.tsx`:**
  - Add optional `showNameplate?: boolean` (default `true`) and `interactive?: boolean` (default `true`) props so `/sky` remains 100% unchanged while `/` suppresses floating background HTML nameplates that would otherwise collide with landing copy.

### B. Coordinator (`src/components/landing/LandingExperience.tsx`)
- Client wrapper coordinating shared state between `LandingSkyBackdrop`, `HeroSkySection`, and `CapabilitiesSection`:
  - `activeConstellationId` (string, default from featured sample `bromo-perseids` in Leo)
  - `activeNodeIndex` (number | null)
  - `activeSampleId` (string)
- Keeps the live 3D sky synchronized with user interactions on the page.

### C. Section Flow (Lean, Purposeful, ~260-320 Visible Words)

```text
+------------------------------------------------------------------+
| [Logo] TWELVE SKIES         How it works   Privacy   [Sign In] [Open 3D Sky] |
+------------------------------------------------------------------+
|                                                                  |
|  Your memories,                     *   *  (Live 3D Leo stars    |
|  mapped to the stars.                \ /    glowing in SpaceDome)|
|                                       *                          |
|  Upload a photo with its date,                                   |
|  and Twelve Skies places it on      +-------------------------+  |
|  its constellation star inside      | [img] Sample Memory     |  |
|  a private 3D night sky.            | Perseid Meteor Watch    |  |
|                                     | Leo / Star 07 · Aug 14  |  |
|  [Open 3D Sky]  [Sign In]           +-------------------------+  |
|                                                                  |
|  Preview a star:  [Aug 14 · Leo] [Jan 08 · Cap] [Jul 12 · Can]   |
+------------------------------------------------------------------+
|  #capabilities — What you do inside Twelve Skies                 |
|                                                                  |
|  01  Pick a date, light its star         [ Date Picker -> Live   |
|      (Short 2-sentence explanation)        Constellation + Star  |
|                                            readout; pans 3D sky] |
|                                                                  |
|  [ Star Hover & 360° Sky Preview ]   02  Orbit 360° and glimpse  |
|  (Sample star bloom + Vault Index)       (Short explanation)     |
|                                                                  |
|  03  Open any star's split-view      [ Clean Split-View Journal  |
|      memory journal                    preview: photo slideshow, |
|      (Short explanation)               caption, date, location]  |
+------------------------------------------------------------------+
|  #sanctuary — Quiet Private Closing Band                         |
|  Private by design. No feeds, no likes, no public timelines.     |
|  [Create Free Account]  [Open 3D Sky]                            |
+------------------------------------------------------------------+
|  [Logo] TWELVE SKIES     How it works · Privacy · Sign In · Sky  |
+------------------------------------------------------------------+
```

1. **Header (`LandingHeader.tsx`):**
   - Sticky compact bar (`h-16`, `bg-space-black/50 backdrop-blur-sm border-b border-white/10`).
   - Brand mark + 2 real anchor links (`How it works` -> `#capabilities`, `Privacy` -> `#sanctuary`) + `Sign In` (`/login`) + `Open 3D Sky` (`/sky`).
   - Mobile: labeled `Menu` button (`>= 44px`) opening a clean drawer with `Escape` key dismissal and focus restoration.
2. **Hero (`HeroSkySection.tsx`):**
   - Open-sky composition (`min-h-[calc(100dvh-4rem)]` on desktop; content-sized natural padding on mobile so nothing overflows or creates dead vertical slabs).
   - Subtle left-edge readability scrim (pure black radial/linear fade only behind the left text column, transparent across the right sky) so WCAG AA contrast (`>= 4.5:1`) holds even if bright Milky Way stars drift behind text.
   - Headline (`Titillium Web`, fluid `clamp(2.25rem, 5vw, 3.75rem)`), 1 clear sentence, 2 specific CTAs (`Open 3D Sky`, `Sign In`), and 3 compact accessible sample-star selector buttons (`Aug 14 · Leo`, `Jan 08 · Capricorn`, `Jul 12 · Cancer`) that pan the live 3D sky behind the hero and update the single frosted sample memory lens (`Sample Memory` label clearly displayed).
3. **Capabilities (`CapabilitiesSection.tsx`, `#capabilities`):**
   - Three spacious, visually distinct demonstrations of actual `/sky` features (alternating asymmetric columns on desktop, single clean stack on mobile, tablet intermediate sizing):
     - **01: Place a photo by date** — Real interactive `<input type="date">` powered by `getConstellationAndNode` (single source of truth). Shows destination constellation glyph, name, star number, and date window, and smoothly pans the live 3D `LandingSkyBackdrop` to that constellation. Includes 3 quick preset date buttons for 1-click exploration.
     - **02: Orbit 360° across twelve constellations** — Explains exploring upper, equatorial, and lower dome tiers, hovering any 4-point sparkle star to preview its photo, and jumping directly to any moment via the chronological Vault Index. Accompanied by a clean composition showing the signature circular hover-bloom preview (`Sample Memory`).
     - **03: Read and edit in split-view** — Explains clicking a star to open the 55/45 split-view memory journal (photo slideshow, written note, location, edit/delete, add another memory to that star). Paired with a faithful translucent preview of the split-view journal panel using an existing sample photo (`ILLUSTRATIVE_MEMORIES`) clearly marked `Sample`.
4. **Private Sanctuary Closing (`SanctuaryClosing.tsx`, `#sanctuary`):**
   - Centered/editorial open band directly over the 3D starfield (no heavy card box, no stock cabin photo).
   - Clear privacy promise + `Create Free Account` (`/login`) and `Open 3D Sky` (`/sky`).
5. **Footer (`LandingFooter.tsx`):**
   - Single-row compact footer with brand mark, real destination links (`How it works`, `Privacy`, `Sign In`, `Open 3D Sky`), and concise tagline.

---

## 5. File Inventory & Cleanup

- **Create:**
  - `src/components/landing/LandingSkyBackdrop.tsx`
  - `src/components/landing/LandingExperience.tsx`
  - `src/components/landing/HeroSkySection.tsx`
  - `src/components/landing/CapabilitiesSection.tsx`
  - `src/components/landing/SanctuaryClosing.tsx`
- **Modify:**
  - `src/app/page.tsx`
  - `src/components/canvas/Constellation.tsx` (optional `showNameplate` and `interactive` props, defaulting to `true`)
  - `src/components/landing/LandingHeader.tsx`
  - `src/components/landing/LandingFooter.tsx`
  - `src/app/globals.css` (remove unused `.bg-neowise-nebula-down` / `.bg-neowise-nebula-up`)
  - `DESIGN.md` and `.impeccable/surfaces/landing.md` (sync design truth)
- **Remove (obsolete landing-only components):**
  - `src/components/landing/HeroObservatory.tsx`
  - `src/components/landing/DateMappingSimulator.tsx`
  - `src/components/landing/ConstellationLedger.tsx`
  - `src/components/landing/ArchivePlatesSection.tsx`
  - `src/components/landing/SectionStarfield.tsx`

---

## 6. Verification Plan

1. **Automated tests & build:** Run existing test suite (`node --test tests/celestialMath.test.mjs`), TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and production build (`npm run build`).
2. **Real browser verification:** Inspect desktop (`1440x900`), tablet (`768x1024`), and mobile (`390x844`) viewports in a live dev server—verifying zero console errors, smooth 3D `SpaceDome` rendering, interactive sample star switching, live date picker panning the 3D sky, keyboard navigation (`Tab`, `Enter`, `Escape` on mobile menu), WCAG AA contrast, zero horizontal overflow, and `/sky` + `/login` remaining unbroken.
