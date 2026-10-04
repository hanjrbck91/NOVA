"use client";

import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";
import { startSmoothScroll } from "@/animation/smoothScroll";
import { STORY_HEIGHT_CLASS } from "@/animation/storyConfig";
import { Experience } from "./scene/Experience";
import { StoryOverlay } from "./ui/StoryOverlay";

// Scroll architecture:
//   tall container (scroll length, ScrollTrigger trigger)
//   └── sticky viewport-sized stage (stays pinned while the container scrolls)
//       ├── WebGL canvas  (Experience)
//       └── DOM chapters  (StoryOverlay)
// Wheel input is smoothed by Lenis; sticky does the pinning; ScrollTrigger
// only reads progress.
export function Story() {
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => startSmoothScroll(), []);

  return (
    <div ref={storyRef} className={`relative ${STORY_HEIGHT_CLASS}`}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <Experience story={storyRef} />
        <StoryOverlay />
      </div>
    </div>
  );
}
