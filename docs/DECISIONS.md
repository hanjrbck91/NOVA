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
Fixed canvas implemented in M02; scroll part to be confirmed in M03. See
ARCHITECTURE.md.

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

## D009 — Studio lighting from Lightformers, not an HDRI preset
`<Environment>` with drei `<Lightformer>` panels, rendered once
(`frames={1}`), plus a low ambient and one directional key light. drei's
`preset` environments download HDRIs from a third-party CDN at runtime;
Lightformers are local, controllable like a real studio, and give the metal
and glass clean reflections. (M02)

## D010 — Normalize the model in code; GLB stays untouched
`WatchModel` computes the bounding box once (`useMemo`) and applies centering
and scale (height = 2 world units) on wrapper groups. The cached GLTF scene's
own transform is never mutated, so remounts/HMR stay correct.
`useGLTF(url, false)` disables Draco: the asset isn't Draco-compressed, and
this avoids attaching a decoder that loads from a CDN. (M02)

## D011 — Pointer interaction rotates the model, not the camera
`PointerRig` wraps the model and damps its rotation toward the pointer
(±0.12 rad) in `useFrame`. The camera is left untouched so M03 can own it for
scroll choreography without conflicts. (M02)

## D012 — Responsive fit scales the model, not the camera
`Scene` scales the model down when the visible world width at the origin is
below 3.2 units. Keeps the camera free for M03. (M02)

## D013 — DOM overlay is pointer-events-none; dark-only theme
The DOM layer passes pointer moves through to the canvas, which is how R3F
receives them; links opt back in. The template's light theme was removed:
light-mode foreground would be invisible on the dark stage. (M02)

## D014 — Asset animation and material variants unused in M02
The GLB's `Anim_0` (seconds hand) and its four material variants are not
used. Default materials render as authored. Possible M04 additions. (M02)
