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

## Component tree (as of M02)

```
app/page.tsx                    Server Component
├── <Experience>                "use client" — fixed full-viewport layer
│   └── <Canvas>                R3F: camera, renderer, color management
│       ├── <color background>
│       └── <Suspense>
│           └── <Scene>         composition: responsive fit + hero pose
│               ├── <StudioLighting>   ambient + key light + Environment(Lightformers)
│               └── <PointerRig>       pointer-driven rotation (interaction)
│                   └── <group fit/hero pose>
│                       └── <WatchModel>   GLB load + normalization
└── <main>                      DOM layer (pointer-events-none)
    ├── header / headline
    └── <Attribution>           CC BY credit (links are pointer-events-auto)
```

Responsibilities are separated:

| Component        | Owns                                           | File |
| ---------------- | ---------------------------------------------- | ---- |
| `Experience`     | Canvas + camera + renderer settings            | `components/scene/Experience.tsx` |
| `Scene`          | What is in the scene, composition, fit         | `components/scene/Scene.tsx` |
| `StudioLighting` | Lights and environment reflections             | `components/scene/StudioLighting.tsx` |
| `PointerRig`     | Pointer interaction only                       | `components/scene/PointerRig.tsx` |
| `WatchModel`     | Loading and normalizing the GLB only           | `components/scene/WatchModel.tsx` |
| `Attribution`    | Asset credit                                   | `components/ui/Attribution.tsx` |

## Transform hierarchy (who moves what)

```
camera                      ← reserved for M03 scroll choreography
PointerRig group            ← pointer rotation (small, damped)
  fit/hero group            ← responsive scale + static hero angle
    WatchModel scale group  ← normalize height to 2 world units
      offset group          ← center bounding box on origin
        GLTF scene          ← never mutated
```

Each concern writes to its own transform, so later layers (scroll timeline in
M03) can animate the camera or add another group without fighting existing
code.

## Layering

- The **WebGL canvas is fixed** (`fixed inset-0`) behind the DOM.
- The DOM `<main>` is `relative` and `pointer-events-none`, so pointer moves
  pass through to the canvas (R3F tracks `state.pointer` on the canvas).
  Interactive DOM elements opt back in with `pointer-events-auto`.
- Text stays in the **DOM**, not in WebGL.

## Rendering defaults

- Camera: perspective, fov 30°, position `[0, 0, 7]`, looking at origin.
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
└── animation/           GSAP timelines and ScrollTrigger setup (M03, empty)
public/
└── models/              3D assets (.glb), served statically
```

## Data flow for scroll (planned, M03)

1. DOM sections render and define scroll length.
2. ScrollTrigger reports progress for those sections.
3. A GSAP timeline tweens the camera (and/or a dedicated group) via refs —
   not through React state.
4. R3F renders the scene each frame.
