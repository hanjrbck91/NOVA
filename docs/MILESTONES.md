# Milestones

| ID  | Name                         | Status      | Detail                              |
| --- | ---------------------------- | ----------- | ----------------------------------- |
| M01 | Foundation                   | Done        | [M01](milestones/M01-foundation.md) |
| M02 | 3D Scene                     | Done        | [M02](milestones/M02-3d-scene.md)   |
| M03 | Scroll-driven Animation      | Done        | [M03](milestones/M03-scroll-driven-animation.md) |
| M04 | Interaction & Polish         | In progress (motion pass done) | [M04 motion](milestones/M04-motion-quality.md) |
| M05 | Final Prototype / Deployment | Not started | —                                   |

## M01 — Foundation
Next.js + TypeScript + Tailwind app, 3D/animation deps installed, source
structure in place, placeholder page, docs created.

## M02 — 3D Scene
Fixed R3F `<Canvas>`, a real product model (GLB) in `public/models`, camera,
and studio-style lighting. Static — no scroll yet.

## M03 — Scroll-driven Animation
Three chapters (Hero, Precision, Final) on a sticky stage; one GSAP
ScrollTrigger timeline drives camera, watch rotation and DOM text.

## M04 — Interaction & Polish
Part 1 (done, in review): motion quality pass — Lenis wheel smoothing,
`scrub: true`, longer chapters, calmer pointer. Part 2 (not started): loading
state, small-desktop layout, CTA, typography/timing polish.

## M05 — Final Prototype / Deployment
Final review, production build, deployment, and a short retrospective of the
workflow learned.
