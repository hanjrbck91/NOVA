"use client";

import { useRef } from "react";
import { STORY_HEIGHT_CLASS } from "@/animation/storyConfig";
import { Experience } from "./scene/Experience";
import { StoryOverlay } from "./ui/StoryOverlay";

// Scroll architecture:
//   tall container (scroll length, ScrollTrigger trigger)
//   └── sticky viewport-sized stage (stays pinned while the container scrolls)
//       ├── WebGL canvas  (Experience)
//       └── DOM chapters  (StoryOverlay)
// Native scrolling; sticky does the pinning, ScrollTrigger only reads progress.
export function Story() {
  const storyRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={storyRef} className={`relative ${STORY_HEIGHT_CLASS}`}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <Experience story={storyRef} />
        <StoryOverlay />
      </div>
    </div>
  );
}
