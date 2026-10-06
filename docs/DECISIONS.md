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
Runtime: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`
(+ `lenis` from M04, see D023).
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
Fixed canvas implemented in M02; in M03 refined to a sticky stage inside the
scroll container (D015). See ARCHITECTURE.md.

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

## D015 — Native scroll + CSS sticky stage; no GSAP pin, no Lenis
*Lenis part superseded by D023 (M04); sticky stage still applies.*
A 400vh container with a `sticky top-0 h-svh` stage holding canvas and DOM.
ScrollTrigger only reads progress. Sticky avoids pin-spacer DOM changes;
`scrub: 1` provides smoothing, and native scroll showed no problem that would
justify a smooth-scroll dependency. (M03)

## D016 — One timeline, one ScrollTrigger, chapters as labels
The whole story is a single scrubbed timeline measured in chapter units
(3 total); chapters are labels. DOM text tweens live in the same timeline so
text and 3D cannot drift apart. Chosen over per-section triggers/callbacks
for readability. (M03)

## D017 — GSAP tweens three.js objects directly; camera aimed via lookAt
Tweens target `camera.position`, a `cameraTarget` `Vector3`, and the watch
group's `rotation`. `ScrollDirector` calls `camera.lookAt(cameraTarget)`
each frame. A look-at point is easier to reason about and tune than camera
rotation angles. No React state involved. (M03)

## D018 — Config / timeline / bridge split
`animation/storyConfig.ts` (all numbers), `animation/createStoryTimeline.ts`
(ScrollTrigger + timeline, plain TS), `components/scene/ScrollDirector.tsx`
(R3F bridge). Keeps the choreography readable and tunable without touching
components. (M03)

## D019 — gsap.matchMedia for breakpoints and cleanup
Builds the timeline with desktop or narrow camera states
(`CAMERA_STATES_NARROW`) and reverts everything (tweens, ScrollTrigger,
inline styles) on breakpoint change or unmount. Avoids adding
`@gsap/react`. (M03)

## D020 — Pointer rig unchanged, additive to scroll
`PointerRig` wraps the watch scroll group, so pointer and scroll rotations
compose on separate transforms. No conflict observed; influence not
reduced. (M03)

## D021 — Responsive fit from hero distance (refines D012)
`Scene` computes fit from the hero camera distance and aspect instead of R3F
`viewport` (which tracks the live camera distance and would drift during
scroll). Still scales the model, not the camera. (M03)

## D022 — Fill + back rim to keep dark geometry separated during scroll
After visual review, the black/gold geometry facing away from the key fell
to near-black during the Precision orbit. Added inside `StudioLighting`:
a cool directional fill opposite the key (`[-4, 2, 3]`, 0.4 ≈ 1/3 of key), a
directional back rim (`[1, 3, -6]`, 0.8), and replaced the small env fill
panel (`[-5, 0, 3]`, 4×6, 0.6) with a large soft one (`[-5, 2, 4]`, 8×8, 1.1)
placed where the Precision camera's reflections pick it up, and a large dim
bounce card below (`[0, -5, 1]`, 12x12, 0.5) for down/lower-left-facing
surfaces (lower bezel, lugs, band underside). Large areas = soft gradients,
not second hot spots. Key light and key panel unchanged; no camera/timeline
changes. (M03)

## D023 — Lenis for wheel smoothing (supersedes "no Lenis" in D015)
User review found M03 scrolling too fast and the 3D floaty. Measurement
showed double smoothing (Chrome's per-notch wheel animation + `scrub: 1`
catch-up, ~1 s tail). Lenis (`lerp 0.1`, `wheelMultiplier 0.8`,
`syncTouch: false`, `respectReducedMotion: true`) becomes the single
smoothing layer for wheel input. Driven by `gsap.ticker` with
`ScrollTrigger.update` on scroll — one loop, no competing rAF. Touch stays
native. (M04)

## D024 — scrub: true (timeline follows scroll exactly)
With smoothing done before ScrollTrigger, the timeline no longer adds its own
lag (`SCRUB = true` in storyConfig). Removes the ~1 s glide after input
stops. (M04)

## D025 — 150vh of scroll per chapter
Story container 400vh → 550vh: ~17 wheel notches per chapter instead of ~9.
Timeline unchanged (still 3 chapter units). (M04)

## D026 — Pointer rig: smaller and snappier
`STRENGTH` 0.12 → 0.06 rad, `SMOOTHING` λ 3 → 6. The pointer stays a subtle,
precise secondary response; scroll owns the major pose. (M04)

## D027 — Loader driven by real scene readiness
`ready` flips once when `ScrollDirector` (same Suspense boundary as the
model) has built the timeline — i.e. GLB loaded and mounted. Until then: a
branded overlay with an indeterminate hairline (no fake percentage), native
scroll locked via `html.nova-loading`, Lenis not started. No loading
library; drei's `useProgress` not used because item-count progress for a
single file is effectively 0 → 100. (M04)

## D028 — CTA is an in-page anchor scrolled by Lenis
`DISCOVER →` = `<a href="#specs">`; Lenis `anchors: true` handles it, so the
rest of the story plays during the scroll and reduced motion gets an instant
jump. The target is a static `Specs` section after the story. (M04)

## D029 — Attribution moved from the stage to the page footer
Credits in the footer of the specs section (11px, 50% opacity, links), fully
visible without interaction. Frees the stage on narrow screens. Wording
unchanged from D008. (M04)

## D030 — Stacked layout below 1280px; desktop hero nudged
Measured text/watch overlap at 1024 and 768px with the side-by-side
composition, so the narrow camera states and stacked text now apply below
1280px (`NARROW_QUERY`, `xl:` in StoryOverlay; supersedes the 768px
breakpoint from M03). Desktop hero/heroPush target `[0,0,0]` →
`[-0.3,-0.2,0]` to clear the bottom-left headline at 1440×900; also fixes
the off-center hero noted in M02/M03. (M04)

## D031 — Two shared type styles, no design system
`LABEL` and `HEADLINE` in `components/ui/typography.ts`. Headline is fluid
(`clamp(2.25rem, 5.2vw, 4.75rem)`), medium weight, tight leading, so it
supports rather than competes with the watch. (M04)
