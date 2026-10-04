# M01 — Foundation

**Status:** Done (2026-10-04)

## Objective

Set up a clean, minimal development environment for the later 3D experience.
No final design, no 3D rendering yet.

## Implementation completed

- Scaffolded Next.js with `create-next-app` (TypeScript, App Router, Tailwind,
  ESLint, `src/` dir, `@/*` import alias), then moved it to the repo root
  (see D002).
- Installed 3D and animation dependencies (see below).
- Created the source structure:
  - `src/components/ui/` — DOM components (`StatusList.tsx`)
  - `src/components/scene/` — R3F components (empty, `.gitkeep`)
  - `src/animation/` — GSAP code (empty, `.gitkeep`)
  - `public/models/` — 3D assets (empty, `.gitkeep`)
- Replaced the template page with a minimal placeholder (`src/app/page.tsx`)
  showing the milestone and stack status.
- Set page metadata title to "NOVA"; made `body` use the Geist font variable
  (the template's CSS overrode it with Arial).
- Removed unused template SVGs from `public/`.
- Added `.claude/launch.json` (dev server config for local preview tooling).
- Created `docs/` documentation set.

## Dependencies

| Package               | Version | Type    |
| --------------------- | ------- | ------- |
| next                  | 16.3.8  | runtime |
| react / react-dom     | 19.2.8  | runtime |
| three                 | 0.186.1 | runtime |
| @react-three/fiber    | 9.8.1   | runtime |
| @react-three/drei     | 10.7.9  | runtime |
| gsap                  | 3.15.0  | runtime |
| @types/three          | 0.186.0 | dev     |
| tailwindcss           | 4.x     | dev     |
| typescript            | 5.x     | dev     |

Environment: Node 20.16.0, npm 10.8.2, Windows 11.

## Architecture decisions

D001–D007 in [DECISIONS.md](../DECISIONS.md). Key points: App Router + `src/`,
Tailwind v4 as shipped, minimal deps, structure by concern, fixed canvas
behind scrolling DOM (planned), no R3F rendering until M02.

## Verification performed

- `npm run build` — compiled successfully, `/` prerendered as static.
- `npx tsc --noEmit` — no errors (after build generated `.next` types).
- `npm run lint` — no errors.
- `npm audit --omit=dev` — 0 vulnerabilities in runtime dependencies.
- `npm run dev` — page loaded at `http://localhost:3000`, rendered correctly,
  no browser console errors.

## Known issues

- `npm audit` reports 5 high-severity issues in **dev** dependencies from the
  template toolchain; runtime deps are clean. Not addressed (would require
  `--force` breaking upgrades).
- Standalone `tsc --noEmit` fails on a fresh clone until `next dev`/`next build`
  has run once, because `LayoutProps` comes from generated `.next/types`.
- `drei` pulls a nested `three@0.170.0` via `stats-gl` (dev stats helper only);
  harmless unless `<Stats>` is used.
- R3F/drei are installed and type-check but have not rendered a `<Canvas>`
  yet; runtime compatibility with React 19.2 is confirmed in M02.
- Next.js telemetry is enabled by default (not changed).

## Next milestone

**M02 — 3D Scene:** fixed R3F canvas, real GLB product model, camera and
lighting. Requires choosing a product model asset first.
