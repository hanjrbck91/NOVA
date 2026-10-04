# M04 — Interaction & Polish (part 1: motion quality pass)

**Status:** Motion pass done (2026-10-04), awaiting review. Cosmetic polish
not started.

## Original problem (user feedback on M03)

1. Scrolling felt too fast between chapters.
2. The watch movement felt floaty rather than cinematic.
3. Suspected cause: native scroll + ScrollTrigger scrub + pointer smoothing
   stacking up.

## Diagnosis

Measured in the browser by sampling `scrollY` and timeline progress every
frame (temporary dev hook, removed afterwards).

| Layer (M03) | Measured / known behavior | Effect |
| --- | --- | --- |
| Native wheel | Chrome animates each notch ~150–250 ms; 100 px/notch | Scroll itself already smoothed once |
| ScrollTrigger `scrub: 1` | After an instant 500 px scroll step: 54% of the move in 115 ms, 77% at 220 ms, 91% at 440 ms, settled ≈ 590 ms, faint drift to ~1 s | **Main cause of floatiness**: a second smoothing layer with a fast start and long tail, so the 3D keeps gliding ~1 s after input stops |
| Chapter length 100vh | 900 px per chapter at 1440×900 ≈ 9 wheel notches; 5 notches = half a chapter | **Main cause of "too fast"** |
| `PointerRig` λ = 3, ±0.12 rad | Time constant 333 ms, ~1 s to settle, ±7° | Watch drifts after the mouse stops; large enough to read as the object floating |

So the softness came from **double smoothing** (native wheel animation +
scrub catch-up), with the pointer rig adding a third, independent drift. The
timeline's easing and camera interpolation were not the problem.

## Decision: Lenis — used

Native scroll with `scrub: true` (no lag) would remove the tail, but leaves
Chrome's per-notch stepping and makes the 3D follow it exactly; native wheel
smoothing differs per browser/OS and can't be tuned. Lenis gives one
controllable, frame-rate-independent smoothing layer for wheel input, and the
timeline can then follow scroll exactly. Tested and kept.

## Final motion architecture

```
wheel ─► Lenis (lerp 0.1, wheelMultiplier 0.8) ─┐
touch ─► native scroll + OS momentum ───────────┼─► window scroll ─► ScrollTrigger (scrub: true)
keys / scrollbar ─► native ─────────────────────┘                     └─► story timeline ─► camera / watch / DOM

pointer ─► PointerRig (±0.06 rad, λ 6) ─► separate transform, additive
```

- **Exactly one smoothing layer per input**: Lenis for wheel, the OS for
  touch. The timeline adds none (`scrub: true`).
- **One loop**: Lenis is driven by `gsap.ticker` (`autoRaf: false`) and calls
  `ScrollTrigger.update` on scroll, so smoothing, ScrollTrigger and the
  timeline update in the same frame. `gsap.ticker.lagSmoothing(0)` so Lenis
  gets real frame deltas. R3F keeps its own render loop (unchanged).
- **Cleanup**: `startSmoothScroll()` returns a function that removes the
  ticker callback, restores GSAP lag smoothing defaults and destroys Lenis;
  called from `Story`'s effect cleanup.
- The story timeline, camera states, scene and lighting are unchanged.

### Files

| File | Change |
| --- | --- |
| `src/animation/smoothScroll.ts` | **New.** Lenis setup + GSAP ticker / ScrollTrigger sync + cleanup |
| `src/animation/storyConfig.ts` | `STORY_HEIGHT_CLASS` 400vh → 550vh; new `SCRUB` and `SMOOTH_SCROLL` |
| `src/animation/createStoryTimeline.ts` | `scrub: 1` → `scrub: SCRUB` (`true`) |
| `src/components/Story.tsx` | Starts/stops smooth scroll; imports `lenis/dist/lenis.css` |
| `src/components/scene/PointerRig.tsx` | `STRENGTH` 0.12 → 0.06, `SMOOTHING` 3 → 6 |
| `package.json` | + `lenis` 1.3.26 |

## Tuning values

| Value | M03 | M04 | Why |
| --- | --- | --- | --- |
| Scroll per chapter | 100vh | 150vh (`h-[550vh]`) | ~17 wheel notches per chapter instead of ~9; a fast flick covers most of a chapter instead of racing through it |
| Scroll smoothing | native per-notch animation | Lenis `lerp: 0.1` (~95% in 0.5 s, frame-rate independent) | One tunable layer |
| Wheel step | 100 px | 80 px (`wheelMultiplier: 0.8`) | Finer control per notch |
| ScrollTrigger scrub | `1` (≈1 s catch-up) | `true` (none) | Remove double smoothing; 3D locked to the smoothed scroll |
| Pointer amplitude | ±0.12 rad (7°) | ±0.06 rad (3.4°) | Secondary, not "floating" |
| Pointer damping λ | 3 (95% ≈ 1 s) | 6 (95% ≈ 0.45 s measured) | Precise response, short settle |

Not changed on purpose: timeline easing (`power1.inOut` per chapter — gives
each chapter a "shot" that starts and lands), camera/watch states, text
timing.

## Validation

Measured with dispatched wheel events (100 px per notch, like Chrome on
Windows). The browser pane rendered at ~25–30 fps; Lenis timing is
frame-rate independent.

| Test | Result |
| --- | --- |
| Step response of the timeline | Progress matches scroll in the same frame (0 ms tail; M03: ~590 ms + drift) |
| Slow wheel (3 notches @ 250 ms) | 240 px, 5.9% of story, settles ~0.7 s after last notch (to 1 px), no overshoot |
| Medium (6 @ 80 ms) | 480 px, 11.9%, ~0.8 s, no overshoot |
| Fast forward (15 @ 30 ms) | 1200 px, 29.6% (~0.9 chapter), ~1.0 s, no overshoot |
| Fast backward (15 @ 30 ms) | −1200 px, −29.6%, ~0.9 s, no overshoot — symmetric with forward |
| Tablet 768×1024 | Lenis active, desktop camera states; ±800 px for ±10 notches, symmetric, no overshoot |
| Phone 375×812 (touch emulated) | Native scroll drives the timeline directly (1500 px → progress 0.41, proportional); back to top → 0 |
| Pointer, stationary | Range ±0.056 rad; 63% in ~110 ms, 95% in ~450 ms |
| Pointer while scrolling | Separate transform; small amplitude stays secondary to the scroll pose |
| Full run (30 notches) | Chapter text states correct for progress 0.77; no WebGL errors |
| Console | One transient `SCRUB is not defined` from HMR between two edits; every later load built the timeline correctly |
| Lint / types / build | Pass |
| `npm audit --omit=dev` | 0 vulnerabilities |

"Settles to 1 px" is a strict measure; perceived motion ends earlier
(exponential tail).

## Mobile considerations

- Touch uses native scrolling and OS momentum (`syncTouch: false`) — no
  scroll-jacking on phones; the timeline follows it 1:1.
- `prefers-reduced-motion`: Lenis' `respectReducedMotion` makes scroll track
  input 1:1 (no smoothing). Not runtime-tested (the browser tool can't emulate
  the media query); the camera choreography itself still plays.
- `lenis.css` is imported for Lenis' required html/body rules.

## Remaining limitations

- Motion "feel" was verified by measurements and a low-fps preview pane, not
  on a real 60/120 Hz display with a physical wheel/trackpad — needs a human
  check.
- Scrollbar drag and keyboard jumps are native: with `scrub: true` the 3D
  follows them exactly (an instant jump moves the camera instantly).
- Timeline easing still brings the camera to a brief stop at each chapter
  boundary (intended "shot" feel; could be revisited).
- Pointer rotation is in world space; when the camera orbits, the pointer
  tilt axis doesn't match the view (small at ±3.4°).
- R3F's render loop and GSAP's ticker are separate `requestAnimationFrame`
  loops (stable order, at most one frame of latency).
- Cosmetic M04 items (loading state, small-desktop layout, CTA, typography)
  not started.
