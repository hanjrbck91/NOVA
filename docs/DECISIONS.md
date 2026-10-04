# Decisions

Format: ID — decision. Why. (Milestone)

## D001 — Next.js App Router with `src/` directory
Scaffolded with `create-next-app` (Next 16.3.8, React 19.2). App Router is
the current default and the stated target; `src/` keeps app code separate
from config files. (M01)

## D002 — Scaffold in a subfolder, then move to the repo root
`create-next-app .` refuses the folder name `NOVA` (npm package names cannot
contain capitals). The app was generated in `nova/` and moved up; package
name is `nova`. (M01)

## D003 — Tailwind CSS v4 via the Next.js template
Tailwind v4 is what the current template ships (`@tailwindcss/postcss`, no
`tailwind.config`). Used for DOM layout/typography only, never for 3D. (M01)

## D004 — Minimal dependency set
Runtime: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`.
Dev: `@types/three` (required for TypeScript types on three.js).
ScrollTrigger ships inside `gsap`, so no extra package. No state library,
no animation library besides GSAP, no UI kit. (M01)

## D005 — Source structure by concern
`components/ui` (DOM), `components/scene` (R3F), `animation` (GSAP),
`public/models` (assets). Empty folders are kept with `.gitkeep` until used.
(M01)

## D006 — Fixed WebGL canvas behind scrolling DOM
The canvas is a fixed full-viewport layer; DOM sections scroll over it and
drive a GSAP ScrollTrigger timeline that mutates three.js objects via refs.
Planned, to be confirmed in M02/M03. See ARCHITECTURE.md.

## D007 — No R3F rendering in M01
M01 only installs the 3D packages; the placeholder page is plain DOM. A real
`<Canvas>` is introduced in M02 rather than adding a throwaway scene now.
(M01)
