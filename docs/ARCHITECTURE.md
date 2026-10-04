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

## High-level shape

```
page (Server Component)
├── <Experience>            client component, fixed full-viewport layer
│   └── <Canvas>            R3F WebGL canvas
│       ├── camera
│       ├── lights / environment
│       └── <Product>       loaded GLB model
└── <Sections>              normal DOM content that scrolls
    └── typography blocks   these define the scroll timeline
```

- The **WebGL canvas is fixed** behind the page. The **DOM scrolls** over it.
- **Scroll position drives animation**: GSAP ScrollTrigger maps scroll progress
  of the DOM sections to a timeline that tweens camera/model properties.
- Text stays in the **DOM**, not in WebGL, for crispness and accessibility.
- Everything touching `window`, WebGL or GSAP is a **Client Component**
  (`"use client"`). The page itself stays a Server Component.

## Source structure

```
src/
├── app/                 routes, root layout, global CSS
├── components/
│   ├── ui/              DOM / typography components
│   └── scene/           R3F components (Canvas, model, lights, camera)
└── animation/           GSAP timelines and ScrollTrigger setup
public/
└── models/              3D assets (.glb), served statically
```

## Data flow (planned)

1. DOM sections render and define scroll length.
2. ScrollTrigger reports progress for those sections.
3. A GSAP timeline tweens values on three.js objects (camera position,
   model rotation, etc.) directly via refs — not through React state, to
   avoid re-rendering every frame.
4. R3F renders the scene each frame.

This is the intended design; details are confirmed in the milestone that
implements each part (M02 scene, M03 scroll animation).
