import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Camera, Object3D, Vector3 } from "three";
import {
  CAMERA_STATES,
  CAMERA_STATES_NARROW,
  CHAPTER,
  SCRUB,
  STORY_LENGTH,
  WATCH_STATES,
  type Vec3,
} from "./storyConfig";

gsap.registerPlugin(ScrollTrigger);

type StoryTargets = {
  trigger: HTMLElement; // tall scroll container; its scroll range drives the timeline
  camera: Camera;
  cameraTarget: Vector3; // point the camera looks at (applied in ScrollDirector)
  watch: Object3D; // group wrapping the watch model
  isNarrow: boolean;
};

const xyz = ([x, y, z]: Vec3) => ({ x, y, z });

// Builds the single scroll-scrubbed timeline for the whole story.
// Called inside a gsap.matchMedia() context, which kills and reverts it on
// unmount or breakpoint change.
export function createStoryTimeline({
  trigger,
  camera,
  cameraTarget,
  watch,
  isNarrow,
}: StoryTargets) {
  const cam = isNarrow ? { ...CAMERA_STATES, ...CAMERA_STATES_NARROW } : CAMERA_STATES;

  // DOM chapter blocks are found by data attribute inside the container.
  const q = gsap.utils.selector(trigger);
  const text = {
    hero: q('[data-chapter="hero"]'),
    precision: q('[data-chapter="precision"]'),
    final: q('[data-chapter="final"]'),
    indicator: q("[data-scroll-indicator]"),
  };

  // Initial state = start of chapter 1 (the M02 composition).
  camera.position.set(...cam.hero.position);
  cameraTarget.set(...cam.hero.target);
  watch.rotation.set(...WATCH_STATES.hero.rotation);
  gsap.set([text.precision, text.final], { autoAlpha: 0, y: 40 });

  // ScrollTrigger: progress 0 when the container's top hits the viewport
  // top, 1 when its bottom hits the viewport bottom. Smoothing happens before
  // this (Lenis / touch momentum, see smoothScroll.ts), so the timeline
  // follows scroll directly instead of adding its own catch-up lag.
  const tl = gsap.timeline({
    defaults: { ease: "power1.inOut" },
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB,
    },
  });

  // CHAPTER 1 — HERO (timeline 0 → 1)
  // Camera: slow dolly-in. Watch: untouched. Hero text drifts up and out.
  tl.addLabel("hero", CHAPTER.hero)
    .to(camera.position, { ...xyz(cam.heroPush.position), duration: 1 }, "hero")
    .to(text.indicator, { autoAlpha: 0, duration: 0.2 }, "hero")
    .to(text.hero, { autoAlpha: 0, y: -40, duration: 0.4 }, "hero+=0.5");

  // CHAPTER 2 — PRECISION (timeline 1 → 2)
  // Camera orbits up-left (choreography); the watch turns the other way
  // (object animation). Together they reveal the case side and band.
  tl.addLabel("precision", CHAPTER.precision)
    .to(camera.position, { ...xyz(cam.precision.position), duration: 1 }, "precision")
    .to(cameraTarget, { ...xyz(cam.precision.target), duration: 1 }, "precision")
    .to(watch.rotation, { ...xyz(WATCH_STATES.precision.rotation), duration: 1 }, "precision")
    .to(text.precision, { autoAlpha: 1, y: 0, duration: 0.3 }, "precision+=0.15")
    .to(text.precision, { autoAlpha: 0, y: -40, duration: 0.25 }, "precision+=0.75");

  // CHAPTER 3 — FINAL (timeline 2 → 3)
  // Camera pulls back to the final framing; watch settles; CTA appears and
  // holds until the end of the scroll.
  tl.addLabel("final", CHAPTER.final)
    .to(camera.position, { ...xyz(cam.final.position), duration: 0.7 }, "final")
    .to(cameraTarget, { ...xyz(cam.final.target), duration: 0.7 }, "final")
    .to(watch.rotation, { ...xyz(WATCH_STATES.final.rotation), duration: 0.7, ease: "power2.out" }, "final")
    .to(text.final, { autoAlpha: 1, y: 0, duration: 0.3 }, "final+=0.4")
    // Pad the timeline to exactly STORY_LENGTH so chapters map to equal
    // thirds of the scroll; the last 0.3 units hold the final composition.
    .set({}, {}, STORY_LENGTH);

  return tl;
}
