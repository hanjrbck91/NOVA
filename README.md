<div align="center">

# NOVA

**The future of time — a cinematic, scroll-driven 3D product experience.**

[**▶ View the live site**](https://hanjrbck91.github.io/NOVA/)

[![Deploy to GitHub Pages](https://github.com/hanjrbck91/NOVA/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/hanjrbck91/NOVA/actions/workflows/deploy-pages.yml)

</div>

---

## About

NOVA is a concept product page for a fictional chronograph, presented like a
short product film. Scroll and the camera moves around a real-time 3D watch
through three shots, with short lines of text appearing as the story moves:

1. **The future of time.** The watch is revealed and the camera slowly pushes in.
2. **Precision in motion.** The camera orbits while the watch turns the other
   way, showing the case, buttons and strap.
3. **Experience NOVA.** The camera pulls back to a final composition, and
   **Discover →** leads to a short specifications section.

Everything you see is rendered live in the browser with WebGL. There are no
videos or pre-rendered images. Move your mouse and the watch responds subtly.

It was built as a learning project to understand the full workflow behind
cinematic 3D websites: 3D asset → WebGL scene → camera → lighting →
scroll-driven animation → typography → interaction → polish.

## Built with

| | |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router, static export), React 19, TypeScript |
| 3D | [three.js](https://threejs.org), [React Three Fiber](https://r3f.docs.pmnd.rs), [drei](https://drei.docs.pmnd.rs) |
| Animation | [GSAP](https://gsap.com) + ScrollTrigger: one scroll-scrubbed timeline drives the camera, the watch and the text |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering) (mouse wheel only; touch scrolling stays native) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Hosting | GitHub Pages, deployed by GitHub Actions on every push to `main` |

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

`npm run build` writes a static site to `out/`. To build for a sub-path like
GitHub Pages, set `NEXT_PUBLIC_BASE_PATH` (for example `/NOVA`). The deploy
workflow sets it automatically.

## Project structure

```
src/
├── app/            page, layout, global styles
├── animation/      scroll story config, GSAP timeline, Lenis setup
└── components/
    ├── scene/      3D: canvas, watch model, lighting, camera direction, pointer rig
    └── ui/         text overlay, loader, specs section, attribution
public/models/      the 3D model (.glb)
docs/               architecture, design decisions and milestone notes
```

The design and engineering decisions behind each step are written up in
[`docs/`](docs/).

## Credits

3D model: ["Chronograph Watch"](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ChronographWatch)
© 2025 Darmstadt Graphics Group GmbH, adapted by Eric Chadwick, licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Based on
["Chronograph Watch Mudmaster"](https://skfb.ly/oAsPA) by graphiccompressor,
CC BY 4.0. Khronos and DGG logos are trademarks of their owners.

NOVA is a fictional concept, not a real product.
