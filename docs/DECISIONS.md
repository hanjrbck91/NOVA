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

## D008 — Product asset: Khronos "ChronographWatch" (CC BY 4.0)
Selected `ChronographWatch.glb` from the Khronos glTF Sample Assets repo,
copied unmodified (byte-identical, SHA-256 `8e875fcd…1aef`) to
`public/models/nova-product.glb`.

- Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ChronographWatch
- File: https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb
- License: CC BY 4.0 (model and textures) — https://creativecommons.org/licenses/by/4.0/
- Required attribution: "Chronograph Watch" © 2025 Darmstadt Graphics Group
  GmbH, adapted by Eric Chadwick, CC BY 4.0. Based on "Chronograph Watch
  Mudmaster" (https://skfb.ly/oAsPA) by graphiccompressor, CC BY 4.0.
  (Also embedded in the GLB's `asset.copyright` field.)
- Logos on the model (Khronos, 3D Commerce, DGG) are trademarks, not covered
  by CC BY.

Why: a premium wearable device (preference #3; no permissively licensed
headphones or camera of comparable quality was found quickly). Single
product, strong silhouette, rich PBR materials (brushed metal, carbon fiber,
transmissive glass), and four built-in color variants usable later for
interaction. Reputable source with machine-readable license metadata.

Alternatives considered: SunglassesKhronos (CC BY 4.0, 0.37 MB, simpler
form), MaterialsVariantsShoe (Shopify, CC BY 4.0, 7.8 MB, scanned-look
single mesh), AntiqueCamera (CC0, 17.5 MB, antique rather than premium).

Limitations: 7.4 MB (heavy-ish for web, uncompressed textures); visible
trademark logos; ships an animation clip (`Anim_0`) and 29 materials incl.
variants. Credit must be shown on the site (M05). (M02)
