# Twelve Skies - Gemini Project Rules

## MANDATORY AGENT PROTOCOL: SKILLS & PROCESS INTEGRATION

Whenever you are coding, debugging, planning, or executing any task in this project:
1. **Never skip or bypass skills.** Invoke relevant skills BEFORE proposing solutions or editing files:
   - For UI / Frontend work: Consult `.agents/skills/antislop-ui/SKILL.md`, `.agents/skills/frontend-ui-engineering/SKILL.md`, `hallmark`, `impeccable`.
   - For Bug Fixes: Consult `.agents/skills/systematic-debugging/SKILL.md` (root-cause tracing, no guessing).
   - For Logic / Feature Implementation: Consult `.agents/skills/test-driven-development/SKILL.md` (write failing test first, make it green, then refactor).
   - For Multi-step Tasks: Consult `.agents/skills/writing-plans/SKILL.md` and track tasks using a task artifact.
   - Before Completing: Consult `.agents/skills/verification-before-completion/SKILL.md` (run verification commands and confirm output before claiming done).
2. **Global Skills Location:** All skills are placed in both `.agents/skills/` (workspace) and `~/.gemini/skills/` (machine-wide).

<!-- antislop:start -->
## antislop: Mandatory AI Slop Filter (ALWAYS ACTIVE)

`antislop active: during (global preference).` is permanently enabled.
Follow these rules whenever generating or modifying UI, copy, design, or code. The result must feel **crafted by a bespoke designer**, never like generic AI output.

### 1. Hard Gates (Zero-Tolerance Violations)
- **No Em Dashes (`—`):** Never use em dashes in text copy or headings (violates R-02). Use commas, periods, colons, or clean parentheses instead.
- **No Raw Unicode Astrological / Emoticon Glyphs in Text:** Never sprinkle raw emoji or Unicode astrological symbols (`♌`, `♐`, `♑`, `♋`, `♊`, `✨`, etc.) in headings, badges, or buttons (violates R-16/R-20). Use custom SVGs (`ZodiacGlyph.tsx`) only when iconography is strictly required.
- **No Generic AI Jargon:** Ban generic AI buzzwords ("unleash", "elevate", "cutting-edge", "seamless", "tapestry", "nestled", "delve", "testament").
- **No Floating Capsule Pill Badges:** Never park decorative pill badges with sparkle icons above headings as an AI decoration.
- **No Decorative Arrow Overuse:** Do not slap `→` or chevron arrows on every single button, card, or link without functional navigation necessity.

### 2. Visual Identity & Surface Craft
- **True Translucent Glassmorphism:** Never use heavy solid black gradient overlays that block the cosmic starfield background. Card surfaces must be genuine frosted glass (`bg-white/[0.02]` to `bg-space-navy/15`, `backdrop-blur-md`, subtle border `border-white/10 hover:border-cyan-glow/40`). The 3D stars must be visible through the glass.
- **The Purpose Test:** Every visual element, color, gradient, card, and animation must have a written purpose. If the only reason is "it looks modern / AI", remove or redesign it.
- **Liveliness & Soul:** Do not fall into sterile lifeless defaults. Infuse celestial atmosphere, bespoke typography, intentional rhythm, and unique personality.

### 3. Antislop Skill Mapping
- UI / visual: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `.agents/skills/antislop-copywriting/SKILL.md`
- Accessibility & Human: `.agents/skills/antislop-human/SKILL.md`
- Mobile & Responsive: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code Comments: `.agents/skills/antislop-code/SKILL.md`
<!-- antislop:end -->

## Project Architecture & Business Logic (Twelve Skies)
- **Database Layer:** Strict Prisma-only layer (`prisma/schema.prisma`). All database operations must go through Prisma Client in Next.js Server API Routes. Never query Supabase database directly.
- **Supabase Usage:** Strictly for Supabase Auth and Supabase Storage (`sky-memories` bucket).
- **Client-Side Image Optimization:** Images uploaded to Supabase Storage must be compressed on client (max width 1920px, quality 82%, WebP/JPEG).
- **Date Mapping Single Source of Truth:** `getConstellationAndNode(date: Date)` determines exact constellation and node distribution.

## Git Commit Guidelines
- Always write commit messages in English.
- Keep commit messages very brief, concise, and high-level (do not provide overly detailed descriptions).
- Standard formats:
  - `feat: add feature`
  - `fix: bug fixes`
  - `update: ui improvements`
  - `refactor: clean up`
  - `chore: update config`
