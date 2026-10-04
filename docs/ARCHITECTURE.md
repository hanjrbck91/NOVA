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

## Component tree (as of M03)

```
app/page.tsx                      Server Component
└── <Story>                       "use client" — tall scroll container (400vh), ScrollTrigger trigger
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
| `storyConfig` | All chapter ranges, camera/watch states, breakpoints | `animation/storyConfig.ts` |
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

## Scroll data flow (M03)

1. The user scrolls natively; the 400vh `Story` container moves, the sticky
   stage stays put.
2. One ScrollTrigger (`top top` → `bottom bottom`, `scrub: 1`) maps the
   container's scroll progress to the timeline's progress.
3. The timeline tweens `camera.position`, a `cameraTarget` vector, the watch
   group's `rotation`, and DOM chapter opacity/translate — directly, no React
   state.
4. Each frame, `ScrollDirector` calls `camera.lookAt(cameraTarget)`;
   `PointerRig` damps its rotation; R3F renders.

Details: [M03 doc](milestones/M03-scroll-driven-animation.md).
