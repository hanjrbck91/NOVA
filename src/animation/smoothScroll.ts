import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { SMOOTH_SCROLL } from "./storyConfig";

gsap.registerPlugin(ScrollTrigger);

// Input smoothing layer: wheel → Lenis → (window scroll) → ScrollTrigger.
// Lenis is driven by GSAP's ticker, so scroll smoothing, ScrollTrigger and
// the story timeline all update in the same frame from one loop.
// Touch keeps native scrolling (syncTouch: false). With
// prefers-reduced-motion, Lenis tracks input 1:1 (respectReducedMotion).
// Returns a cleanup function.
export function startSmoothScroll() {
  const lenis = new Lenis({
    lerp: SMOOTH_SCROLL.lerp,
    wheelMultiplier: SMOOTH_SCROLL.wheelMultiplier,
    syncTouch: false,
    respectReducedMotion: true,
    autoRaf: false,
    // In-page links (DISCOVER → #specs) scroll through Lenis, so the story
    // timeline plays through on the way instead of jumping.
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000); // GSAP time is in seconds
  gsap.ticker.add(tick);
  // Lenis needs real frame deltas; GSAP's lag smoothing would fake them.
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33); // GSAP defaults
    lenis.destroy();
  };
}
