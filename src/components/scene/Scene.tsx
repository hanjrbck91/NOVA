import { useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group } from "three";
import { HERO_VISIBLE_HEIGHT, MIN_VISIBLE_WIDTH } from "@/animation/storyConfig";
import { PointerRig } from "./PointerRig";
import { StudioLighting } from "./StudioLighting";
import { WatchModel } from "./WatchModel";

// Transform layers, outermost first:
//   PointerRig  — pointer interaction
//   watchRef    — scroll timeline (rotation), owned by createStoryTimeline
//   fit group   — responsive scale
//   WatchModel  — normalization
export function Scene({ watchRef }: { watchRef: RefObject<Group | null> }) {
  const aspect = useThree((state) => state.size.width / state.size.height);
  // Uses the hero distance (not the live camera) so the fit doesn't change
  // when the camera moves during the story.
  const fit = Math.min(1, (HERO_VISIBLE_HEIGHT * aspect) / MIN_VISIBLE_WIDTH);

  return (
    <>
      <StudioLighting />
      <PointerRig>
        <group ref={watchRef}>
          <group scale={fit}>
            <WatchModel />
          </group>
        </group>
      </PointerRig>
    </>
  );
}
