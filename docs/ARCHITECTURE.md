# Architecture

## Stack

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js 16 (App Router), React 19           |
| Language         | TypeScript                                  |
| Styling          | Tailwind CSS v4                             |
| 3D renderer      | three                                       |
| React ↔ three    | @react-three/fiber                          |
| 3D helpers       | @react-three/drei (model loading, env, etc) |
| Animation        | gsap + ScrollTrigger (ships inside `gsap`)  |
| Smooth scroll    | lenis (wheel only, M04)                     |

## Component tree (as of M03)

```
app/page.tsx                      Server Component
└── <Story>                       "use client" — tall scroll container (550vh), ScrollTrigger trigger; starts Lenis
    └── sticky stage (h-svh)      pinned by CSS while the container scrolls
        ├── <Experience>          WebGL layer (absolute, fills the stage)
        │   └── <Canvas>          camera + renderer + color management
        │       ├── <color background>
        │       └── <Suspense>
        │           ├── <Scene>          lighting + rig + watch groups, responsive fit
        │           │   ├── <StudioLighting>
        │           │   └── <PointerRig> → watch scroll group → fit group → <WatchModel>
        │           └── <ScrollDirector> builds the scroll timeline, aims the camera
        └── <StoryOverlay>        DOM chapters (pointer-events-none), attribution
```

| Component / module | Owns | File |
| --- | --- | --- |
| `Story` | Scroll length, sticky stage, client boundary | `components/Story.tsx` |
| `Experience` | Canvas, camera, renderer settings | `components/scene/Experience.tsx` |
| `Scene` | What is in the scene, transform layers, fit | `components/scene/Scene.tsx` |
| `StudioLighting` | Lights and environment reflections | `components/scene/StudioLighting.tsx` |
| `PointerRig` | Pointer interaction only | `components/scene/PointerRig.tsx` |
| `WatchModel` | Loading and normalizing the GLB only | `components/scene/WatchModel.tsx` |
| `ScrollDirector` | Bridge: live camera/watch → timeline; `lookAt` per frame | `components/scene/ScrollDirector.tsx` |
| `createStoryTimeline` | ScrollTrigger + the one GSAP timeline | `animation/createStoryTimeline.ts` |
| `storyConfig` | All chapter ranges, camera/watch states, breakpoints, motion tuning | `animation/storyConfig.ts` |
| `startSmoothScroll` | Lenis + GSAP ticker / ScrollTrigger sync + cleanup | `animation/smoothScroll.ts` |
| `StoryOverlay` | Chapter text, scroll indicator | `components/ui/StoryOverlay.tsx` |
| `Attribution` | Asset credit | `components/ui/Attribution.tsx` |

## Transform hierarchy (who moves what)

```
camera (+ cameraTarget)     ← scroll timeline (position) + lookAt each frame
PointerRig group            ← pointer rotation (small, damped)
  watch scroll group        ← scroll timeline (rotation)
    fit group               ← responsive scale
      WatchModel scale group  ← normalize height to 2 world units
        offset group          ← center bounding box on origin
          GLTF scene          ← never mutated
```

Each concern writes to its own transform, so the pointer interaction and the
scroll timeline add together instead of fighting.

## Layering

- The **WebGL canvas fills a sticky stage** behind the DOM; the stage stays
  pinned while the 400vh story container scrolls.
- The DOM `<main>` is `relative` and `pointer-events-none`, so pointer moves
  pass through to the canvas (R3F tracks `state.pointer` on the canvas).
  Interactive DOM elements opt back in with `pointer-events-auto`.
- Text stays in the **DOM**, not in WebGL.

## Rendering defaults

- Camera: perspective, fov 30°, starts at `CAMERA_STATES.hero`; afterwards
  owned by the scroll timeline.
- `dpr={[1, 2]}`, antialias on.
- Color management: R3F defaults — sRGB output color space, ACES Filmic tone
  mapping. Background `#0a0a0a` via `<color attach="background">`.
- `frameloop="always"` (default) — needed for damped pointer motion.

## Performance patterns

- Pointer motion mutates the group in `useFrame`; no React state, no
  re-renders per frame.
- Bounding box / scale computed once in `useMemo` per loaded scene.
- `useGLTF` caches the asset; `useGLTF.preload` starts the download as soon
  as the module loads.
- Environment map is rendered once (`frames={1}`), not every frame.
- R3F only raycasts objects with event handlers; the model has none, so pointer
  moves don't trigger raycasts against its ~100k triangles.

## Source structure

```
src/
├── app/                 routes, root layout, global CSS
├── components/
│   ├── ui/              DOM / typography components
│   └── scene/           R3F components (Canvas, model, lights, interaction)
└── animation/           story config + GSAP timeline / ScrollTrigger setup
public/
└── models/              3D assets (.glb), served statically
```

## Scroll data flow (M04)

1. Wheel input is smoothed by Lenis (driven by `gsap.ticker`); touch, keys
   and scrollbar scroll natively. Either way the window scrolls; the 550vh
   `Story` container moves, the sticky stage stays put.
2. Lenis calls `ScrollTrigger.update` on every scroll frame. One
   ScrollTrigger (`top top` → `bottom bottom`, `scrub: true`) maps scroll
   progress directly to timeline progress — no extra lag.
3. The timeline tweens `camera.position`, a `cameraTarget` vector, the watch
   group's `rotation`, and DOM chapter opacity/translate — directly, no React
   state.
4. Each frame, `ScrollDirector` calls `camera.lookAt(cameraTarget)`;
   `PointerRig` damps its (small) rotation; R3F renders.

Exactly one smoothing layer per input. Details:
[M03](milestones/M03-scroll-driven-animation.md),
[M04 motion pass](milestones/M04-motion-quality.md).
