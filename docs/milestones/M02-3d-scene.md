# M02 — 3D Scene

**Status:** Done (2026-10-04)

## Objective

Fixed R3F `<Canvas>` with the product model, camera, and studio-style
lighting. Static: no scroll animation (that is M03).

## Asset

**Selected:** Khronos "ChronographWatch" → `public/models/nova-product.glb`
(see D008 in [DECISIONS.md](../DECISIONS.md)).

| Field        | Value |
| ------------ | ----- |
| Source       | Khronos glTF Sample Assets |
| Page         | https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ChronographWatch |
| Download     | https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb |
| Format       | GLB (glTF 2.0 binary), no conversion needed |
| Size         | 7,446,368 bytes (~7.4 MB) |
| SHA-256      | `8e875fcd83efb433afed9ef1c18b2c2b2e075e2bf48371cadfd2a3cf529f1aef` |
| License      | CC BY 4.0 (model and textures) |
| Modified     | No (byte-identical to source) |

**Attribution (must appear on the site):**
"Chronograph Watch" © 2025 Darmstadt Graphics Group GmbH, adapted by Eric
Chadwick, licensed CC BY 4.0. Based on "Chronograph Watch Mudmaster"
(https://skfb.ly/oAsPA) by graphiccompressor, CC BY 4.0. Khronos and DGG
logos are trademarks of their owners.

### Contents

- 13 meshes, 14 nodes, ~100k triangles, 8 textures.
- Materials: brushed metal bezel, carbon-fiber and plastic band, transmissive
  glass face, metal and color watch hands.
- Extensions: `KHR_materials_transmission`, `KHR_materials_variants`,
  `KHR_texture_transform` (all optional; supported by three's GLTFLoader).
- Material variants: Surgical White, Midnight Gold, Commerce Green, Khronos Red.
- One animation clip: `Anim_0` (1 channel).

### Candidates evaluated

| Candidate | Source | License | Size | Suitable because | Problems |
| --- | --- | --- | --- | --- | --- |
| **ChronographWatch** (selected) | Khronos | CC BY 4.0 | 7.4 MB | Premium wearable, rich materials, glass, color variants | Heavy-ish; trademark logos |
| SunglassesKhronos | Khronos | CC BY 4.0 | 0.37 MB | Very light; iridescent lenses | Simple, thin form; weaker hero |
| MaterialsVariantsShoe | Khronos / Shopify | CC BY 4.0 | 7.8 MB | Sneaker; 3 colorways | Scanned single mesh; less "futuristic" |
| AntiqueCamera | Khronos / UX3D | CC0 | 17.5 MB | Camera; CC0 | Antique, heavy, includes tripod |

Not used: Sketchfab (requires an account to download; licenses vary per
asset). No permissively licensed headphones of comparable quality were found
in the time budget.

### Known limitations

- 7.4 MB may slow first load; compression (Draco/KTX2) is possible later but
  would modify the asset. Defer to M04/M05 if needed.
- Transmission glass is relatively expensive to render; watch performance.
- Real-world scale (small); camera framing and scale handled in the scene.

## Implementation

### What was implemented

- First real WebGL scene: R3F `<Canvas>` fixed behind the DOM, rendering the
  ChronographWatch GLB with camera, studio lighting and environment
  reflections.
- One subtle pointer interaction (model rotation).
- M01 placeholder replaced with a minimal hero: `NOVA` wordmark, `NOVA
  Chronograph` label, `THE FUTURE OF TIME.` headline, and the CC BY
  attribution.
- Theme made dark-only (see D013).

### Components created

| File | Role |
| --- | --- |
| `src/components/scene/Experience.tsx` | Client boundary. Fixed full-viewport `<Canvas>`, camera, renderer settings, background, `<Suspense>` |
| `src/components/scene/Scene.tsx` | Composition: lighting + rig + model, hero pose, responsive fit |
| `src/components/scene/StudioLighting.tsx` | Ambient + directional key + `<Environment>` built from `<Lightformer>`s |
| `src/components/scene/PointerRig.tsx` | Pointer interaction only (damped group rotation) |
| `src/components/scene/WatchModel.tsx` | GLB loading + normalization only |
| `src/components/ui/Attribution.tsx` | CC BY 4.0 credit (wording from D008) |

Modified: `src/app/page.tsx` (hero), `src/app/globals.css` (dark-only tokens).
Removed: `src/components/ui/StatusList.tsx` (M01 placeholder),
`src/components/scene/.gitkeep`.

### Scene architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the tree and transform
hierarchy. Summary: `page` (server) → `Experience` (client, Canvas) →
`Scene` → `StudioLighting` + `PointerRig` → fit/hero group → `WatchModel`.
Each transform layer has a single owner; the camera is owned by nobody yet.

### GLB loading approach

- `useGLTF("/models/nova-product.glb", false)` from drei (Draco off; asset
  isn't Draco-compressed). `useGLTF.preload` at module level.
- Rendered with `<primitive object={scene} />` — original materials,
  textures and extensions (transmission, texture transform) preserved.
- Normalization in `useMemo`: `Box3.setFromObject` → center offset and
  `scale = 2 / height`, applied on wrapper groups (D010).
- Loading state: `<Suspense fallback={null}>` — the dark stage and DOM text
  show immediately; the watch appears when the GLB is parsed.

### Camera setup

- Perspective, fov 30° (long-lens product look, little distortion),
  position `[0, 0, 7]`, near 0.1, far 100, looking at origin.
- At this distance a 2-unit-tall model fills ~55% of viewport height.
- The camera is not animated or controlled by anything in M02 (D011, D012),
  so M03 can take ownership of it.

### Lighting approach

- `<Environment resolution={256} frames={1}>` with five Lightformers: large
  soft key (upper right front), dim fill (left), two tall rim strips
  (behind), top strip. Provides reflections for metal/glass; baked once.
- `directionalLight` (intensity 1.2) for readable face shading,
  `ambientLight` (0.1) to lift the blacks slightly.
- No shadows, no HDRI download (D009).

### Interaction approach

- `PointerRig` reads `state.pointer` (−1..1) in `useFrame` and damps group
  rotation toward `pointer × 0.12 rad` with `MathUtils.damp` (λ = 3).
- No React state; nothing re-renders on pointer move.
- DOM overlay is `pointer-events-none` so moves reach the canvas (D013).

### Validation results

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, no warnings |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass, `/` prerendered static |
| Dev server + browser | Page loads; `nova-product.glb` → 200 OK |
| Watch renders | Yes, WebGL2 context, `gl.getError() === 0`, context not lost |
| Materials/textures | Gold bezel, black band, dial print, hands, glass all render as authored |
| Composition (1440×900) | Watch centered, ~55% height, uncropped, clear of text |
| Composition (375×812) | Watch scaled to fit, uncropped; text stacks below |
| Pointer interaction | Visible, restrained rotation between top-left/bottom-right pointer; also works with cursor over DOM text |
| Console | No app/WebGL errors (see known limitations for benign warnings) |
| Attribution | Present in DOM, bottom-right, with source and license links |
| No scroll animation | Confirmed: no `gsap`/`ScrollTrigger` import in `src/`; page does not scroll |
| Dependencies | Unchanged (`package.json`, lockfile untouched) |

### Problems encountered and solutions

| Problem | Solution |
| --- | --- |
| Template light theme: dark foreground text would be invisible over the dark canvas in OS light mode | Made tokens dark-only (D013) |
| DOM overlay above the canvas would block pointer events from reaching R3F | `pointer-events-none` on the overlay, `pointer-events-auto` on links |
| Normalizing by mutating the cached GLTF scene would break on remount/HMR | Offset/scale on wrapper groups; scene transform untouched |
| drei environment presets fetch HDRIs from an external CDN | Built the environment from local Lightformers (D009) |
| Narrow viewports would crop the watch | Scale model by visible world width (D012) |

### Known limitations

- **Asset size:** 7.4 MB GLB (PNG textures, ~100k triangles). First load
  shows the empty stage until it arrives; no loading indicator yet.
- **Off-center feel:** the bounding box includes the band curving behind the
  case, so with the hero rotation the face sits slightly left of center.
- **Console warnings (not errors):** `THREE.Clock … deprecated` comes from
  R3F 9.8 internals with three 0.186; `X4122 … double precision` is an ANGLE
  / D3D shader-compiler info message on Windows. Neither is from project code.
- Watch is lit but casts no shadow; no ground/contact shadow.
- Pointer rig ignores touch-only devices beyond tap position (acceptable).
- `Anim_0` and material variants unused (D014).

### Performance considerations

- 7.4 MB download dominates load time. Compression (Draco/Meshopt, KTX2/WebP
  textures) would modify the asset — deferred to M04/M05.
- Transmission glass forces an extra transmission render pass per frame.
- `frameloop="always"` renders every frame even when idle; acceptable for
  now, could switch to `demand` with invalidation later.
- No per-frame React work; env map rendered once; no raycasting on the model.

### What M03 will change

- Add DOM sections (shots) so the page scrolls; the canvas stays fixed.
- Add GSAP + ScrollTrigger code in `src/animation/`, animating the camera
  (currently unowned) and/or a dedicated scroll group around `PointerRig`.
- The hero pose in `Scene` becomes the first keyframe of the timeline.
- Pointer rig stays as an independent, additive layer.
