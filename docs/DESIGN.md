# Design Direction — NOVA

Initial direction only; refined in M02–M04.

## Concept

NOVA is a fictional premium product presented like a film. The product is
the hero; the page is a slow camera move around it, with short lines of text
appearing as the story progresses.

## Principles

- **One subject.** A single product model, centered, given room to breathe.
- **Dark stage.** Near-black background, the product lit like a studio shot.
- **Cinematic pacing.** Each scroll section is one "shot": one camera move,
  one idea, one headline.
- **Restrained typography.** Large, tight headlines; small mono labels.
  Few words per section.
- **Motion with purpose.** Every animation either reveals the product or
  moves the story forward. No decorative motion.

## Tokens

- Background: near-black (`#0a0a0a`), used by both the page and the WebGL
  clear color so the canvas edge is invisible.
- Foreground: off-white (`#ededed`); secondary text uses opacity
  (`/50`, `/40`).
- Dark-only: no light theme (the DOM always sits on the dark stage).
- Fonts: Geist Sans (headlines/body), Geist Mono (labels).

## Hero composition (M02)

- Watch centered in the viewport, ~55% of viewport height on desktop, in a
  slight three-quarter pose (tilted up ~9°, turned ~20°) so bezel depth reads.
- Corner-anchored DOM: wordmark `NOVA` top-left (mono, wide tracking);
  label `NOVA Chronograph` + headline `THE FUTURE OF TIME.` bottom-left
  (uppercase, tight, large); attribution bottom-right, small and dim.
- Lighting: studio look — soft key from upper right (the only source of hard
  metallic highlights), large low soft fill front-left (cool, ~1/3 key),
  dim back rim plus two rim strips behind for edge separation, dim bounce
  card below, top strip.
  Contrast stays high; fill only keeps dark parts from merging with the
  background (D022).
- Interaction: the watch turns gently toward the pointer (max ~7°).
- The asset's default materials are kept (gold bezel, black band).
- Narrow viewports: watch scales down to fit; text stacks below.

## Chapters (M03)

| # | Chapter | Shot | DOM |
| --- | --- | --- | --- |
| 1 | Hero | M02 framing, slow dolly-in | `NOVA Chronograph` / `THE FUTURE OF TIME.` bottom-left; `Scroll ↓` indicator; text drifts up and fades |
| 2 | Precision | Camera orbits up-left, closer; watch turns the other way, revealing case side, buttons, band | `02 — Craft` / `PRECISION IN MOTION.` right-middle |
| 3 | Final | Camera pulls back; watch settles near-frontal, right of center | `EXPERIENCE NOVA.` + `DISCOVER →` left-middle |

Motion: one chapter per viewport of scroll, `power1.inOut` easing, `scrub: 1`
smoothing. Text only fades and moves 40px vertically. On narrow screens all
text sits bottom-left and the watch stays centered above it.

The earlier 4-section draft (separate "detail" and "rotation" shots) was
condensed into 3 chapters: Precision covers both.

## Final polish (M04)

- **Loader:** black screen, `NOVA` wordmark (mono, 0.6em tracking), 112px
  hairline with a travelling highlight, "Preparing chronograph" caption.
  Fades into the hero; static under reduced motion.
- **Type:** `HEADLINE` fluid `clamp(2.25rem, 5.2vw, 4.75rem)`, medium
  weight, leading 0.95, −0.02em; `LABEL` 11px mono, 0.35em, 55% opacity.
  Every chapter has a label (`NOVA Chronograph`, `02 — Craft`,
  `03 — NOVA`).
- **Layout:** side-by-side composition at ≥1280px (hero bottom-left,
  precision right-middle, final left-middle); stacked bottom-left text with
  the watch centered above below 1280px. Desktop hero watch sits slightly
  right of and above center.
- **CTA:** `DISCOVER →` underlined mono link → information section.
- **Specs section:** two-column (≥1024px) — label + headline ("Precision
  engineering." / dimmed "Designed for movement.") + one line of copy; a
  2-column definition list of six attributes with hairline separators.
  Footer: "NOVA — concept prototype" + attribution.
