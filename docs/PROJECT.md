# NOVA 3D — Project

## Purpose

NOVA 3D is a short (~3 hour) experimental learning project. It builds a
cinematic, scroll-driven 3D product website prototype called **NOVA**.

## Learning objective

Understand the end-to-end workflow behind cinematic 3D websites:

3D asset → WebGL scene → camera → lighting → scroll-driven animation →
DOM typography → interaction → polished presentation

Each step should be built for real and understood, not faked.

## Scope

- A single-page Next.js site.
- One 3D product model rendered with React Three Fiber.
- Camera and model motion driven by page scroll (GSAP ScrollTrigger).
- DOM typography layered over the WebGL canvas.
- Light interaction (e.g. pointer response) and final polish.
- A deployable prototype.

## Non-goals

- Production-grade site (CMS, i18n, analytics, auth, backend).
- Multiple pages or routing beyond the single landing page.
- Custom shaders or post-processing unless a milestone explicitly needs them.
- Fake "3D-looking" effects (CSS tricks, pre-rendered video) in place of real WebGL.
- Libraries beyond the documented stack (see ARCHITECTURE.md).
- Automated test suite — verification is build/lint/typecheck plus manual browser checks.

## Source of truth

The files in `docs/` are the project's source of truth. Read them before
making implementation decisions; record important decisions in
`DECISIONS.md`.
