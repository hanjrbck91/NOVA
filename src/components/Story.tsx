"use client";

import "lenis/dist/lenis.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { startSmoothScroll } from "@/animation/smoothScroll";
import { STORY_HEIGHT_CLASS } from "@/animation/storyConfig";
import { Experience } from "./scene/Experience";
import { Loader } from "./ui/Loader";
import { StoryOverlay } from "./ui/StoryOverlay";

// Scroll architecture:
//   tall container (scroll length, ScrollTrigger trigger)
//   └── sticky viewport-sized stage (stays pinned while the container scrolls)
//       ├── WebGL canvas  (Experience)
//       └── DOM chapters  (StoryOverlay)
// Wheel input is smoothed by Lenis; sticky does the pinning; ScrollTrigger
// only reads progress.
//
// Loading: `ready` flips once, when the GLB is loaded and the timeline is
// built (ScrollDirector → onReady). Until then the Loader covers the page,
// native scrolling is locked (html.nova-loading) and Lenis isn't started.
export function Story() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // The story always starts at the hero.
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("nova-loading", !ready);
    if (!ready) return;
    return startSmoothScroll();
  }, [ready]);

  return (
    <>
      <Loader ready={ready} />
      <div ref={storyRef} className={`relative ${STORY_HEIGHT_CLASS}`}>
        <div className="sticky top-0 h-svh overflow-hidden">
          <Experience story={storyRef} onReady={handleReady} />
          <StoryOverlay />
        </div>
      </div>
    </>
  );
}
