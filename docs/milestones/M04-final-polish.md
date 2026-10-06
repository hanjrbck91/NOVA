# M04 — Interaction & Polish (part 2: final cosmetic polish)

**Status:** Done (2026-10-04). Part 1 (motion pass) is in
[M04-motion-quality.md](M04-motion-quality.md).

## Objective

Make NOVA a finished, presentable prototype without adding technology:
loading state, typography/spacing, a working CTA with an information
section, attribution placement, and responsive cleanup. Motion architecture
(Lenis → ScrollTrigger `scrub: true` → single timeline) preserved.

## Loading

**Signal (real, not simulated):** `ready` flips once, when `ScrollDirector`'s
layout effect runs. That effect lives in the same `<Suspense>` boundary as
`WatchModel`, so it only runs after the 7.4 MB GLB is loaded and parsed, the
watch is mounted, and the scroll timeline is built. `ScrollDirector` calls
`onReady` (a stable `useCallback`) → `Story` sets `ready = true`. One React
state update in the whole lifecycle.

**While not ready:**
- `Loader` covers the page: `NOVA` wordmark, a hairline with a travelling
  highlight (indeterminate — no fake percentage), "Preparing chronograph".
- Native scrolling locked (`html.nova-loading { overflow: hidden }`), and
  Lenis isn't started yet — wheel, touch and keys can't move an incomplete
  scene.
- `history.scrollRestoration = "manual"` + `scrollTo(0, 0)`: the story
  always starts at the hero.

**On ready:** Lenis starts; the loader fades out (700 ms opacity, then
`visibility: hidden`, `aria-hidden`), its CSS animation class is removed.

**Reduced motion:** loader bar static (CSS media query), fade instant
(`motion-reduce:duration-0`).

## CTA → information section

- `DISCOVER →` is a real link: `<a href="#specs">`, `pointer-events-auto`
  inside the pass-through overlay. Only focusable/clickable when the final
  chapter is visible (GSAP `autoAlpha` sets `visibility: hidden` otherwise).
- Lenis `anchors: true` turns in-page links into Lenis scrolls, so the
  remaining story plays out on the way (no jump, no second smoothing layer;
  instant under reduced motion).
- `Specs` (`#specs`) sits after the story container in normal flow: as you
  reach it, the sticky stage scrolls away naturally. Content: label, two-line
  headline ("Precision engineering. / Designed for movement."), one line of
  copy, six attributes taken from what the model actually shows (case, face,
  display, 24-city bezel ring, strap, the four built-in finishes), and a
  footer with "NOVA — concept prototype" + the CC BY attribution. Static
  Server Component, no backend.

## Visual / typography changes

| Element | Before | After |
| --- | --- | --- |
| Headlines | `text-4xl sm:text-6xl font-semibold tracking-tight` | Shared `HEADLINE`: `clamp(2.25rem, 5.2vw, 4.75rem)`, `font-medium`, `leading-[0.95]`, `-0.02em` — fluid, lighter, supports the watch |
| Labels | `text-xs tracking-[0.3em] /50` | Shared `LABEL`: 11px mono, `0.35em`, `/55` |
| Chapter labels | hero + precision only | `NOVA Chronograph`, `02 — Craft`, `03 — NOVA` (consistent rhythm) |
| CTA | `<span>` with border | `<a>` with hover border, focus offset, 12px mono `0.35em` |
| Stage padding | `p-6 sm:p-10` | `p-6 sm:p-10 lg:p-14` |
| Wordmark | `0.4em` tracking | `0.5em` |
| Attribution | Stage bottom-right, 10px `/40` | Page footer (Specs), 11px `/50`, links underlined |

Type styles live in `src/components/ui/typography.ts` (two class strings,
not a design system).

## Responsive decisions

Measured, not eyeballed: a temporary dev hook projected the watch meshes'
bounding boxes to screen pixels at each chapter and compared them with the
chapter text rects (hook removed afterwards). Bounding boxes are
conservative (larger than the silhouette).

**Changes:**
1. **Layout/camera breakpoint 768 → 1280px.** `NARROW_QUERY` is now
   `(max-width: 1279px)` and StoryOverlay positions text with `xl:` instead
   of `sm:`. Below 1280px all chapter text sits bottom-left and the narrow
   camera states keep the watch centered above it. Reason: the side-by-side
   desktop composition overlapped at 1024×768 (hero 103×76px, precision
   48×134px) and 768×1024 (precision 65×76px).
2. **Desktop hero target `[0,0,0]` → `[-0.3,-0.2,0]`** (and `heroPush`): the
   watch sits slightly right of and above center. Cleared the 1440×900 hero
   overlap (61×96px → 0 horizontal) and fixes the M02/M03 "watch slightly
   left of center" limitation. No other camera or watch state changed.

**Results (overlap = text rect ∩ watch bbox; both axes must be > 0):**

| Viewport | Layout | Hero | Precision | Final | Clipped text | Watch on screen | Horizontal overflow |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440×900 | desktop | none | none | none | no | yes | no |
| 1280×800 | desktop | none | none | none | no | yes | no |
| 1024×768 | stacked | none | 3px bbox corner (silhouette clear) | none | no | yes | no |
| 768×1024 | stacked | none | none | none | no | yes | no |
| 547×694 | stacked | none | none | none | no | yes | no |
| 375×812 | stacked | none | none | none | no | yes | no |

## Validation

| # | Check | Result |
| --- | --- | --- |
| 1 | Loading state | Visible on load; `html.nova-loading` (overflow hidden), Lenis not started |
| 2 | Model loads | Loader hidden + `aria-hidden`, Lenis active, at scroll 0 |
| 3 | Hero | Correct at all widths (table above) |
| 4 | Scroll motion | Unchanged M04-A pipeline; 25/50/75 wheel notches step hero → precision → final |
| 5 | Precision chapter | Text visible at mid-story, clear of watch |
| 6 | Final chapter | Text + CTA visible at end |
| 7 | Scroll reversal | 75 fast notches back → hero opacity 1, others 0, y 0 |
| 8 | Pointer | Pointer rig unchanged from M04-A |
| 9–10 | CTA | Real click → hash `#specs`, specs top at 0 px (Lenis smooth scroll) |
| 11 | Attribution | In footer, fully in view at page bottom, 11px |
| 12 | Horizontal overflow | None at any tested width |
| 13 | WebGL | `getError() === 0`, context not lost |
| 14 | App errors | None on fresh loads. Console history holds two one-off HMR artifacts from mid-edit states (`SCRUB is not defined` from M04-A; hook-deps size change when `onReady` was added) — each appears exactly once across 10+ reloads |
| 15–17 | Lint / types / build | Pass |

**Performance sanity:** loops = R3F render loop + GSAP ticker (Lenis runs
inside it) — no duplicates. React state: only `ready` (once); pointer and
scroll never touch React state. Cleanup: Lenis destroyed and GSAP ticker
restored on unmount; `gsap.matchMedia` reverts timeline + ScrollTrigger;
loader animation stops when hidden (`document.getAnimations()` → 0 after
load).

## Files

| File | Change |
| --- | --- |
| `src/components/ui/Loader.tsx` | **New.** Loading overlay |
| `src/components/ui/Specs.tsx` | **New.** Information section + footer with attribution |
| `src/components/ui/typography.ts` | **New.** `LABEL`, `HEADLINE` class strings |
| `src/components/Story.tsx` | `ready` state, scroll lock, start-at-top, Lenis only after ready, renders Loader |
| `src/components/scene/Experience.tsx` / `ScrollDirector.tsx` | `onReady` passed through / called after timeline build |
| `src/components/ui/StoryOverlay.tsx` | Shared type styles, chapter labels, real CTA link, `xl:` layout, attribution removed from stage |
| `src/components/ui/Attribution.tsx` | 11px, `/50`, wider measure |
| `src/animation/smoothScroll.ts` | `anchors: true` |
| `src/animation/storyConfig.ts` | Breakpoint 1280px; hero/heroPush target |
| `src/app/globals.css` | Scroll lock + loader keyframes (reduced-motion aware) |
| `src/app/page.tsx` | Renders `<Specs />` after `<Story />` |

## Known limitations

- **7.4 MB GLB** (uncompressed PNG textures, ~100k triangles): the loader
  can show for several seconds on slow connections. Compression
  (Draco/Meshopt, KTX2) is the obvious next step; deliberately not done.
- No error state if the GLB fails to load (Suspense would never resolve;
  the loader stays).
- `prefers-reduced-motion` handled (Lenis 1:1, static loader, instant
  fade) but not runtime-tested — the browser tool can't emulate it. The
  camera choreography still plays under reduced motion.
- Verified with measurements and a low-fps preview pane; final feel should
  be checked on real hardware.
- Between 1024 and 1279px wide the stacked (tablet) layout is used on
  landscape screens; functional but less cinematic than the desktop
  composition.
- Spec content describes the 3D model; NOVA is a concept, not a product.
- Khronos / 3D Commerce / DGG logos are visible on the model (trademarks).
