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
- Lighting: studio look — soft key from upper right, dim fill left, two rim
  strips behind for bezel edge highlights, top strip.
- Interaction: the watch turns gently toward the pointer (max ~7°).
- The asset's default materials are kept (gold bezel, black band).
- Narrow viewports: watch scales down to fit; text stacks below.

## Planned sections (draft)

1. Hero — product reveal, product name.
2. Detail — camera moves close to a feature.
3. Rotation — product turns to show form.
4. Closing — product settles, final call to action.
