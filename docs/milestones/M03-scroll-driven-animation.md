# M03 — Scroll-driven Animation

**Status:** Done (2026-10-04)

## Objective

Turn the static M02 hero into a three-chapter, scroll-driven cinematic
sequence:

```
user scroll → scroll progress → ScrollTrigger → GSAP timeline
            → camera / watch transforms + DOM text → rendered frame
```

## Where things live (learning map)

| Question | Answer |
| --- | --- |
| Where is ScrollTrigger configured? | `src/animation/createStoryTimeline.ts` — the `scrollTrigger` option on the single timeline |
| Where is the timeline created? | Same file, `createStoryTimeline()` |
| Which scroll range controls each chapter? | `CHAPTER` + `STORY_LENGTH` in `src/animation/storyConfig.ts` (chapter N = progress N/3 → (N+1)/3) |
| Which camera properties are animated? | `camera.position` (x, y, z) and a `cameraTarget` `Vector3` the camera looks at |
| Which watch properties are animated? | `rotation` (x, y, z) of the watch's scroll group |
| How does DOM text sync? | Text blocks are tweened (opacity + y) **in the same timeline**, positioned with labels |
| What connects React/R3F to the timeline? | `src/components/scene/ScrollDirector.tsx` |
| Where are all the numbers? | `src/animation/storyConfig.ts` |

## Scroll architecture

```
<main>
└── Story ("use client")              tall container, h-[400vh]  ← ScrollTrigger trigger
    └── sticky top-0 h-svh stage      stays pinned while the container scrolls
        ├── Experience  (Canvas)      WebGL, continuous across all chapters
        └── StoryOverlay              DOM chapters stacked on top of each other
```

- **Native scrolling.** No smooth-scroll library.
- **CSS `position: sticky`** pins the stage. ScrollTrigger only reads
  progress; it does not pin (no pin-spacer DOM juggling).
- Scroll distance = 400vh − 100vh = 3 viewports → one viewport per chapter.
- The canvas never unmounts or re-renders during scroll; only three.js object
  properties and DOM inline styles change.

## ScrollTrigger setup

```ts
scrollTrigger: {
  trigger,            // the 400vh Story container
  start: "top top",   // progress 0: container top at viewport top
  end: "bottom bottom", // progress 1: container bottom at viewport bottom
  scrub: 1,           // timeline catches up to scroll over ~1 s
}
```

`scrub: 1` gives the smoothing that cinematic sites usually get from Lenis,
without a dependency. Native scroll + scrub worked without issues, so no
smooth-scroll library was added.

## Timeline structure

One timeline, length 3 "chapter units", labels `hero`, `precision`,
`final`. Default ease `power1.inOut`.

| Timeline | Scroll | Chapter | Tweens |
| --- | --- | --- | --- |
| 0.00–1.00 | 0–33% | 1 Hero | camera.position → `heroPush` (dolly-in) |
| 0.00–0.20 | 0–7% | | scroll indicator fades out |
| 0.50–0.90 | 17–30% | | hero text: opacity 1→0, y 0→−40 |
| 1.00–2.00 | 33–67% | 2 Precision | camera.position → `precision`; cameraTarget → `precision`; watch.rotation → `precision` |
| 1.15–1.45 | 38–48% | | precision text: opacity 0→1, y 40→0 |
| 1.75–2.00 | 58–67% | | precision text: opacity 1→0, y 0→−40 |
| 2.00–2.70 | 67–90% | 3 Final | camera.position, cameraTarget → `final`; watch.rotation → `final` (`power2.out`) |
| 2.40–2.70 | 80–90% | | final text + CTA: opacity 0→1, y 40→0 |
| 2.70–3.00 | 90–100% | | hold (padding `set` at 3) |

Initial state (timeline 0) is applied directly before the timeline is built:
camera at `hero`, target at `hero`, watch at `WATCH_STATES.hero`,
precision/final text hidden.

## Camera states

Desktop (`min-width: 768px`). Camera always looks at `target`
(`camera.lookAt` every frame in `ScrollDirector`).

| State | position | target | Rationale |
| --- | --- | --- | --- |
| A — `hero` | `[0, 0, 7]` | `[0, 0, 0]` | Exactly the M02 framing (~55% viewport height) |
| `heroPush` | `[0, 0.2, 5.6]` | `[0, 0, 0]` | End of chapter 1: slow dolly-in + slight lift; no angle change yet |
| B — `precision` | `[-3.6, 1.7, 4.0]` | `[0.8, 0.15, 0.6]` | Orbit up-left, ~5.6 units out. Target is offset along the camera's screen-right so the watch sits left, clear of the right-aligned text |
| C — `final` | `[0, 0.3, 8.5]` | `[-1.1, 0, 0]` | Pull back beyond the hero; target shifted left so the watch sits right of center, leaving the left for the CTA |

Narrow (`max-width: 767px`) overrides — text is always at the bottom, so the
watch is kept centered horizontally and lifted (target below the watch):

| State | position | target |
| --- | --- | --- |
| `hero` | `[0, 0, 7.5]` | `[0, -0.7, 0]` |
| `heroPush` | `[0, 0.2, 6.3]` | `[0, -0.6, 0]` |
| `precision` | `[-4.8, 2.3, 5.4]` | `[0.15, -0.5, 0]` |
| `final` | `[0, 0.3, 9.5]` | `[0, -0.9, 0]` |

FOV stays 30° throughout (no zoom; all framing changes are physical camera
moves).

## Object animation (watch)

| State | rotation (x, y, z rad) | Purpose |
| --- | --- | --- |
| `hero` | `[0.15, -0.35, 0]` | M02 three-quarter pose |
| `precision` | `[-0.25, 0.75, 0.08]` | Tips back and turns the opposite way to the camera orbit → reveals case side, buttons, screws and band |
| `final` | `[0.08, -0.2, 0]` | Calm, near-frontal settle |

**Camera choreography vs object animation:** in chapter 2 the camera orbits
to the upper-left (changes *viewpoint*: perspective, framing, parallax of
the lighting) while the watch rotates on its own axis the other way (changes
*what faces the light and lens*). Reflections move differently in each case:
when only the camera moves, the studio reflections slide across the metal
with the view; when the object rotates, reflections stay fixed to the
environment and travel across the surfaces. Combining both reveals more of
the product in less motion than either alone.

## DOM synchronization

- Chapter blocks have `data-chapter="hero|precision|final"`; the scroll
  indicator has `data-scroll-indicator`. The timeline finds them with
  `gsap.utils.selector(trigger)`.
- They are tweened in the same timeline as the 3D, positioned relative to
  chapter labels (e.g. `"precision+=0.15"`), so text and camera can't drift
  apart.
- Only `autoAlpha` (opacity + visibility) and `y` are animated.
- Animated blocks have no CSS transforms of their own; positioning is done
  by non-animated wrapper divs (GSAP owns the transform).
- Precision/final have `opacity-0` in CSS so they don't flash before
  JavaScript runs.

## Components / files

| File | Change |
| --- | --- |
| `src/animation/storyConfig.ts` | **New.** Chapter layout, scroll height, breakpoints, camera states, watch states, fit constants |
| `src/animation/createStoryTimeline.ts` | **New.** ScrollTrigger + the timeline, one block per chapter |
| `src/components/scene/ScrollDirector.tsx` | **New.** Builds the timeline in a `gsap.matchMedia()` context with live camera + watch; `camera.lookAt(target)` every frame |
| `src/components/Story.tsx` | **New.** Client boundary; scroll container + sticky stage |
| `src/components/ui/StoryOverlay.tsx` | **New.** Header, three chapter blocks, scroll indicator, attribution |
| `src/components/scene/Experience.tsx` | Fills the sticky stage (`absolute`), camera from config, hosts `ScrollDirector` in the model's Suspense boundary |
| `src/components/scene/Scene.tsx` | Watch scroll group (`watchRef`) replaces the static hero rotation; fit uses hero distance |
| `src/app/page.tsx` | Renders `<Story />` |
| `src/animation/.gitkeep` | Removed (folder now used) |
| `src/components/scene/StudioLighting.tsx` | Fill + back rim added after visual review (see below) |

Unchanged: `WatchModel`, `PointerRig`, `Attribution`, GLB, dependencies.

## Lighting adjustment (post-review)

**Problem:** the key light (upper right) gave good metallic highlights, but
the side facing away from it fell to near-black. During the Precision orbit
(camera upper-left) the black case top, lugs and upper band merged with the
dark background; in Final the left bezel dropped to brown-black.

**Change** (all in `StudioLighting`, D022):

| Light | Before | After | Role |
| --- | --- | --- | --- |
| Key directional `[3, 4, 5]` | 1.2 | unchanged | Hard highlights, main shading |
| Key Lightformer `[4, 3, 5]` 6×4 | 3 | unchanged | Main metallic reflection |
| Fill directional | — | `[-4, 2, 3]`, 0.4, `#dfe6ff` | Lifts diffuse shading on black non-metal parts; cool tint keeps it subordinate to the key |
| Fill Lightformer | `[-5, 0, 3]`, 4×6, 0.6 | `[-5, 2, 4]`, 8×8, 1.1 | Soft reflection for metal on the dark side; large area → gradient, not a hot spot; positioned near the Precision camera's side so camera-facing surfaces reflect it |
| Back rim directional | — | `[1, 3, -6]`, 0.8 | Separates dark edges from the background |
| Bounce Lightformer | — | `[0, -5, 1]`, 12×12, 0.5 | Reflector card under the product: down- and lower-left-facing surfaces (lower bezel, lugs, band underside) reflect it instead of the empty dark environment |
| Ambient, rim strips, top strip | | unchanged | |

**Why the fill panel moved:** metal shows almost no diffuse light; what it
shows is the environment reflected around the viewing direction. Surfaces
facing the upper-left Precision camera reflect the part of the environment
near that camera, so a fill panel far to the side barely registered there.
Moving it forward/up (still opposite the key) made it visible in Precision
without changing Hero/Final much.

**Second pass (after user review of the narrow layout):** the lower-left
bezel, left shoulder and the lugs/band under the case still went
olive-black at the start of Precision. Those surfaces reflect directions
down and to the lower left, where the environment was empty, so a large dim
bounce card was added below the watch. Tried 0.7 first: fixed separation
but made the lower bezel as bright as the key side (too even); settled on
0.5 to keep the falloff.

**Result:** Hero — black band top shows a soft grey gradient against the
background. Precision — black case top, lugs and band edges separate from
the background with a soft sheen; no new hard highlight. Final — left bezel
keeps its gold instead of falling off to near-black. Key highlights and the
dark band keep the scene contrasty rather than evenly lit. Tested at 820×620
(desktop breakpoint) at 0%, 58% and 100% scroll, and after the bounce card at
547×694 (narrow) at 0%, 42%, 60% and 100%; WebGL error-free.

## Pointer interaction

`PointerRig` is unchanged and wraps the scroll group, so its small rotation
(±0.12 rad) is added on top of the scroll pose on a separate transform. No
conflict was observed, so its influence was not reduced.

## Responsive considerations

- `gsap.matchMedia()` builds the timeline with desktop or narrow camera
  states and rebuilds it when the breakpoint is crossed.
- Desktop text: hero bottom-left, precision right-middle, final left-middle.
  Narrow: all chapters bottom-left.
- Model fit (`Scene`) is computed from the **hero** distance and aspect, not
  R3F's `viewport` (which depends on the live camera distance and would
  change with scroll).
- Stage uses `h-svh` so mobile URL-bar changes don't resize it during scroll.

## Validation results

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass, `/` static |
| Desktop scroll (1440×900) | Hero at 0%, dolly-in visible at 20–34%, precision orbit at 50–62%, final composition at 100% |
| Continuous 3D | Canvas stays mounted and pinned (sticky rect 0–900 at every position); camera/watch change smoothly with scrub |
| Chapter transitions | DOM inline styles confirm: hero fading at 20% (opacity 0.875), hidden by 34%; precision visible 38–58%; final visible at 100% |
| Camera movement | Dolly-in, orbit, pull-back observed in screenshots |
| Watch rotation | Case side, buttons and band revealed in chapter 2; settles in chapter 3 |
| Reverse scroll | Back at 0%: hero opacity 1 / y 0, other chapters hidden, indicator visible |
| Pointer interaction | Still works mid-story (precision), visibly different pose between opposite pointer corners, subtle |
| Narrow viewport (375×812, 684×868, 547 wide) | Hero, precision, final all uncropped and clear of text after narrow states were added |
| Console | No app errors; only the known `THREE.Clock` deprecation warning (R3F internals). Transient HMR "export not found" errors appeared during a two-step edit and stopped after recompile |
| WebGL | `gl.getError() === 0`, context not lost |
| Dependencies | `package.json` / lockfile unchanged; GLB unchanged |
| No manual scroll listeners | None in `src/` |

## Problems encountered and solutions

| Problem | Solution |
| --- | --- |
| Precision shot too close; watch sat under the right-aligned text | Pulled camera back and offset the look-at target along screen-right so the watch sits left |
| On narrow screens the precision target offset pushed the watch off-screen | Narrow camera overrides (`CAMERA_STATES_NARROW`) keep it centered |
| On portrait tablet width the hero watch overlapped the bottom headline | Narrow `hero`/`heroPush` look below the watch, lifting it above the text |
| Watch group must exist before the timeline is built, but the GLB suspends | `ScrollDirector` sits in the same `<Suspense>` as the model, so its layout effect runs after the watch mounts |
| R3F `viewport` changes with camera distance, which would make the fit drift during scroll / on resize | Fit computed from the fixed hero distance |
| Browser-pane screenshots lagged behind the 1 s scrub (stale frames) | Verified state via DOM inline styles and repeated screenshots; not an app issue |

## Known limitations

- Until the 7.4 MB GLB loads, the timeline isn't built: scrolling moves
  nothing and the hero text stays. Once loaded, it jumps to the current
  scroll position.
- `DISCOVER →` is a visual CTA without a destination.
- The pointer rig and scrub both add easing; in fast scroll the watch can
  feel slightly "floaty".
- Breakpoint change rebuilds the timeline (`matchMedia` revert + rebuild);
  smooth enough, but it's a hard reset rather than a blend.
- Narrow choreography is serviceable, not tuned.
- Bounding-box centering still includes the rear band, so the hero watch
  sits slightly left of exact center (as in M02).

## Performance considerations

- No React state during scroll; GSAP writes to three.js objects and DOM
  inline styles directly.
- One ScrollTrigger, one timeline.
- `camera.lookAt` once per frame is negligible.
- Unchanged from M02: GLB size, transmission pass, always-on frameloop.

## What M04 will explore

- Interaction & polish: loading state for the GLB, CTA destination,
  timing/easing refinement, typography polish.
- Possibly using the asset's material variants or the seconds-hand animation
  (D014).
- Responsive refinement and performance (frameloop on demand, asset
  compression decision).
