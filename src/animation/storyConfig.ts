// All tunable numbers for the scroll story live here.
// See docs/milestones/M03-scroll-driven-animation.md for the rationale.

export type Vec3 = [number, number, number];

// ---------------------------------------------------------------------------
// Timeline layout
// ---------------------------------------------------------------------------
// The timeline is measured in "chapter units": each chapter is 1 unit long.
// One ScrollTrigger scrubs the whole timeline across the story container, so
// chapter N maps to scroll progress [N / 3, (N + 1) / 3].
export const CHAPTER = {
  hero: 0,
  precision: 1,
  final: 2,
} as const;

export const STORY_LENGTH = 3;

// Height of the scroll container. 400vh = 1 viewport visible + 3 viewports
// of scroll distance, i.e. one viewport of scrolling per chapter.
export const STORY_HEIGHT_CLASS = "h-[400vh]";

// Below this width the narrow camera variants are used.
export const NARROW_QUERY = "(max-width: 767px)";
export const WIDE_QUERY = "(min-width: 768px)";

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------
export const CAMERA_FOV = 30;

export type CameraState = {
  position: Vec3; // where the camera is
  target: Vec3; // the point it looks at (applied with camera.lookAt each frame)
};

export const CAMERA_STATES = {
  // A — Hero. Identical to the M02 framing: straight on, 7 units out.
  hero: { position: [0, 0, 7], target: [0, 0, 0] },
  // End of chapter 1: a slow dolly-in plus a slight lift, same target.
  heroPush: { position: [0, 0.2, 5.6], target: [0, 0, 0] },
  // B — Precision. Orbits up and to the left, closer than the hero. The
  // target is offset along the camera's screen-right direction (≈ +x +z
  // from this angle) so the watch sits left of center, clear of the
  // right-aligned chapter text.
  precision: { position: [-3.6, 1.7, 4.0], target: [0.8, 0.15, 0.6] },
  // C — Final. Pulls back further than the hero; target is shifted left so
  // the watch sits right of center, leaving the left side for the CTA.
  final: { position: [0, 0.3, 8.5], target: [-1.1, 0, 0] },
} satisfies Record<string, CameraState>;

// Narrow screens: all chapter text sits at the bottom, so these shots keep
// the watch centered horizontally, push it up instead of sideways, and pull
// back a little further.
export const CAMERA_STATES_NARROW = {
  hero: { position: [0, 0, 7.5], target: [0, -0.7, 0] },
  heroPush: { position: [0, 0.2, 6.3], target: [0, -0.6, 0] },
  precision: { position: [-4.8, 2.3, 5.4], target: [0.15, -0.5, 0] },
  final: { position: [0, 0.3, 9.5], target: [0, -0.9, 0] },
} satisfies Partial<Record<keyof typeof CAMERA_STATES, CameraState>>;

// ---------------------------------------------------------------------------
// Watch (object animation)
// ---------------------------------------------------------------------------
export type WatchState = { rotation: Vec3 };

export const WATCH_STATES = {
  // Same three-quarter pose as M02.
  hero: { rotation: [0.15, -0.35, 0] },
  // Turns the opposite way to the camera orbit and tips back, so the
  // crown/buttons side and the band come into view.
  precision: { rotation: [-0.25, 0.75, 0.08] },
  // Settles to a calm, almost frontal pose.
  final: { rotation: [0.08, -0.2, 0] },
} satisfies Record<string, WatchState>;

// ---------------------------------------------------------------------------
// Responsive fit (used by Scene)
// ---------------------------------------------------------------------------
// Visible world height at the hero distance; times aspect = visible width.
export const HERO_VISIBLE_HEIGHT =
  2 * CAMERA_STATES.hero.position[2] * Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180);

// Below this visible width the model scales down so it isn't cropped.
export const MIN_VISIBLE_WIDTH = 3.2;
