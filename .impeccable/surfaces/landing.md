# Surface Brief: Twelve Skies Landing & Web Experience

- **Target:** `src/app/page.tsx` (and companion routes `src/app/login/page.tsx`, `src/app/sky/page.tsx`)
- **Mode:** Persuade and Experience (landing `/`) and Operate (`/login`, `/sky`)
- **Audience:** Private individuals archiving personal photographs chronologically without social feeds or public timelines.
- **Action:** Understand what you can do in Twelve Skies immediately (date-mapped stars, 360-degree 3D dome, split-view memory journal) and step directly into `/sky` or `/login`.

## Direction contract

- **THESIS:** Unify `/` and `/sky` into one continuous 3D astronomical dome (`SpaceDome` procedural Milky Way shader, 4,200 J2000 spectral catalog stars, armillary parallels, and real 3D `Constellation` + `StarNode` shaders). Remove tiled starfield JPEGs, alternating CSS navy gradients, and duplicated 2D zodiac widgets so the live 3D sky and actual app workflows lead.
- **OWN-WORLD:** Pure Space Black (`#000000`) and Space Abyss (`#04091e`), Electric Cyan (`#7cdee4`) strictly for primary interactive intent, calibrated spectral glow colors exclusively for the twelve constellations, `Titillium Web` display typography, `Manrope` body copy, `JetBrains Mono` strictly for dates and star coordinates, and dose-capped frosted glass (`backdrop-blur-md` on at most 2 focal surfaces on `/`).
- **STORY:** Open-sky hero over live 3D constellations with interactive sample star focus -> 3 focused capability demonstrations (live date-to-star sky panning, 360-degree hover bloom + Vault Index, interactive split-view journal preview) -> quiet private sanctuary closing -> lean single-band footer.
- **FIRST VIEWPORT:** Minimal edge-to-edge header (`Twelve Skies`, `How it works`, `Privacy`, `Sign In`, `Open 3D Sky`), left-aligned display headline (`Your memories, mapped to the stars.`), one clear sentence, primary/secondary actions, 3 sample star focus controls, and an unobstructed right-hand view of the live 3D constellation with one compact frosted `Sample` lens.
- **FINISH:** Verified via automated tests, TypeScript check, ESLint, production build, and live desktop/tablet/mobile browser visual inspection.
