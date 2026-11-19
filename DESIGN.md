---
name: Twelve Skies
description: Private 3D zodiac photo observatory built directly over a unified procedural Milky Way SpaceDome and real 3D constellation star shaders.
colors:
  space-black: "#000000"
  space-abyss: "#04091e"
  space-navy: "#03045e"
  cyan-glow: "#7cdee4"
  cyan-wake: "#38bdf8"
  amber-star: "#fec42d"
  ink-primary: "#f8fafc"
  ink-secondary: "#9fb2cc"
  ink-muted: "#788ca8"
typography:
  display:
    fontFamily: "Titillium Web, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.cyan-glow}"
    textColor: "{colors.space-navy}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink-primary}"
    textColor: "{colors.space-navy}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  input-field:
    backgroundColor: "{colors.space-black}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
---

# Design System: Twelve Skies

## Overview

**Creative North Star: "The Unified 3D Celestial Observatory"**

Twelve Skies renders the same procedural WebGL `SpaceDome` (Milky Way galactic plane, 4,200 J2000 spectral catalog stars, and delicate armillary sphere rings) and real 3D `Constellation` + `StarNode` diffraction-spike star shaders across both the landing page (`/`) and the interactive 3D vault (`/sky`). UI surfaces step back into restrained midnight-abyss containers ruled by crisp hairlines, allowing real 3D constellations and personal photography to lead without visual clutter.

We explicitly reject tiled starfield JPEGs, alternating CSS section gradients, duplicated 2D zodiac tables, glowing gradient orbs, decorative capsule eyebrows above headings, and opaque walls that conceal the 3D night sky.

**Key Characteristics:**
- Continuous live 3D `SpaceDome` sky (`#000000` void to subtle `#04091e` ecliptic horizon wash) shared between `/` and `/sky`.
- Geometric `Titillium Web` display headings paired with `Manrope` body prose and `JetBrains Mono` reserved strictly for astronomical coordinates and dates.
- Restraint in frosted glass (`backdrop-blur-md` capped to at most 2 focal lenses on `/`, plus floating `/sky` drawers and modals).
- Twelve spectral constellation colors reserved for astronomical geometry, glyphs, and star beacons.

## Colors

The active UI palette holds to two dark cosmic grounds, crisp luminous ink, and one primary electric-cyan action accent, leaving room for the twelve calibrated zodiac starlight hues.

### Primary
- **Electric Cyan** (`#7cdee4`): Primary action buttons (`Open 3D Sky`, `Add Photo`, `Create Account`), active focus rings, and excited bioluminescent star wakes.
- **Space Navy** (`#03045e`): High-contrast dark ink on primary cyan buttons and deep-space atmospheric depth.

### Secondary
- **Wake Sky Blue** (`#38bdf8`): Fading outer particle wake trails and secondary astronomical highlights.
- **Stellar Amber** (`#fec42d`): Location markers, mathematical remainder callouts, and golden solar star highlights.

### Neutral
- **Space Black** (`#000000`): Primary document ground and 3D dome void.
- **Space Abyss** (`#04091e`): Elevated observatory panel surface behind thin hairlines.
- **Cosmic White** (`#f8fafc`): Display headlines, active controls, and primary readable copy.
- **Nebula Silver** (`#9fb2cc`): Secondary body prose, sub-labels, and calendar spans (WCAG AA compliant against `#000000` and `#04091e`).
- **Muted Slate** (`#788ca8`): Quiet metadata, field placeholders, and secondary timestamps.

**The Chromatic Sky Rule.** Never apply gradient fills to display text or flood sections with decorative cyan glow. Electric cyan marks interactive intent; constellation spectral hues mark astronomical houses only.

## Typography

**Display Font:** `Titillium Web` (with `system-ui, sans-serif` fallback)
**Body Font:** `Manrope` (with `system-ui, sans-serif` fallback)
**Label/Mono Font:** `JetBrains Mono` (with `ui-monospace, monospace` fallback)

**Character:** Precision astronomical instrument meets calm editorial journal. Tight geometric display headings carry spatial presence without relying on uppercase tracking pills or eyebrows.

### Hierarchy
- **Display** (700, `3.5rem`, line-height `1.05`, tracking `-0.025em`): Landing hero thesis headline.
- **Headline** (700, `2.25rem`, line-height `1.15`): Major section headings (`Date Engine`, `12 Astronomical Houses`, `Illustrative Memory Plates`).
- **Title** (700, `1.25rem` to `1.5rem`, line-height `1.3`): Split-view headers, modal titles, and featured plates.
- **Body** (400/500, `1rem`, line-height `1.6`, max measure `60ch`): Narrative copy and memory journal stories.
- **Mono Telemetry** (500, `0.75rem`, line-height `1.4`): Calendar windows, `B = floor(D/N)` formula outputs, and star node indices.

**The No-Eyebrow Rule.** Never stack tracked uppercase mono pills above display headlines; let heading scale and hierarchy speak directly.

## Layout

Pages share a `max-w-7xl` (`1280px`) centered container with `px-5 sm:px-8` gutters and `overflow-x: clip` on `html` and `body`. The landing page (`/`) opens with an asymmetric open-sky hero framing the live 3D constellation on the right and concise copy plus 3 sample star triggers on the left, followed by three spacious capability demonstrations (live date picker synced to the 3D sky, 360-degree hover bloom and Vault Index preview, interactive split-view journal preview), a quiet private sanctuary closing band, and a single-row footer. The `/sky` route occupies `100vw x 100vh` with floating observatory chrome and a `55vw / 45vw` desktop split-view when inspecting a star node.

## Elevation & Depth

Surfaces rely on crisp `1px` hairlines (`rgba(124, 222, 228, 0.16)` at rest, `rgba(124, 222, 228, 0.55)` when active) and translucent abyss layering (`rgba(4, 9, 30, 0.75)`) rather than heavy drop shadows. Blurred glass (`backdrop-blur-md`) is reserved for focused overlays: the hero star-node inspection lens, floating `/sky` controls, the node split-view drawer, and modals.

**The Starfield Depth Rule.** Never seal panels with opaque muddy greys or large radial glow blobs that block the Neowise cosmic starfield.

## Shapes

Observatory containers use `12px` radii (`--rounded-lg`), while interactive buttons, tabs, and form inputs use `8px` radii (`--rounded-md`) and compact badges use `6px` (`--rounded-sm`). Full pill (`9999px`) silhouettes are reserved strictly for astronomical star-node halos and radial thumbnail previews inside the 3D sky.

## Components

### Buttons
- **Shape:** Subtle observatory corners (`8px` radius), minimum `44px` touch height (`40px` compact toolbar height in `/sky`).
- **Primary:** Solid `#7cdee4` background, `#03045e` bold text, `10px 24px` padding; transitions cleanly to `#f8fafc` on hover.
- **Secondary:** Transparent ground, `1px` `rgba(255, 255, 255, 0.2)` border, `#f8fafc` ink; shifts border to cyan and background to subtle white tint on hover.
- **Focus:** Instant `2px solid #7cdee4` outline with `3px` offset via `:focus-visible`.

### Inputs / Fields
- **Style:** `8px` radius, `#000000` semi-transparent ground, `1px` `rgba(124, 222, 228, 0.28)` border, `#f8fafc` text, `#788ca8` placeholder.
- **Focus:** Border shifts to `#7cdee4` with matching cyan caret color.

### Navigation
- **Landing Header:** Sticky flat observatory bar (`bg-black/75`, `border-b border-white/10`), mobile drawer with `Escape` key dismissal and focus restoration.
- **Sky Vault Chrome:** Floating top observatory bar (`Navbar.tsx`) with live memory count and vault index toggle, paired with a bottom 12-constellation zodiac glyph switcher (`BottomPagination.tsx`).

### Signature Component: 4-Point Sparkle Star Node
- Custom 4-point star vector geometry centered over a subtle point light and spectral constellation halo; hovering or focusing expands a circular `76px` latest-memory thumbnail preview with date window and photo count.

## Do's and Don'ts

### Do:
- **Do** use custom vector glyphs (`ZodiacGlyph.tsx` and `CelestialLogo.tsx`) for all astronomical iconography.
- **Do** mark every public sample memory entry clearly as `Illustrative Preview` or `Illustrative Sample Entries`.
- **Do** provide explicit loading, error-with-retry, and empty states plus `Escape` key handling on all interactive panels and modals.
- **Do** keep `prefers-reduced-motion: reduce` respected across wake canvas animations, panel slides, and smooth scrolling.

### Don't:
- **Don't** render raw Unicode zodiac emojis (`♌`, `✨`) or em dashes (`—`) anywhere in UI copy.
- **Don't** use pill (`rounded-[30px]`) inputs or stack `backdrop-blur` across every landing section card.
- **Don't** invent metrics, testimonials, or unlabelled sample claims.
