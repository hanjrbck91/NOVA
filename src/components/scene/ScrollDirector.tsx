import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useLayoutEffect, useMemo, type RefObject } from "react";
import { Vector3, type Object3D } from "three";
import { createStoryTimeline } from "@/animation/createStoryTimeline";
import { NARROW_QUERY, WIDE_QUERY } from "@/animation/storyConfig";

type Props = {
  trigger: RefObject<HTMLElement | null>;
  watch: RefObject<Object3D | null>;
};

// Connects the scroll timeline to the live three.js objects. Renders nothing.
// Must sit in the same Suspense boundary as the watch so the watch group
// exists when the timeline is built.
export function ScrollDirector({ trigger, watch }: Props) {
  const camera = useThree((state) => state.camera);
  const cameraTarget = useMemo(() => new Vector3(), []);

  useLayoutEffect(() => {
    const triggerEl = trigger.current;
    const watchObj = watch.current;
    if (!triggerEl || !watchObj) return;

    // matchMedia builds the timeline for the current breakpoint and reverts
    // it (tweens + ScrollTrigger + inline styles) on change or unmount.
    const mm = gsap.matchMedia();
    mm.add({ isNarrow: NARROW_QUERY, isWide: WIDE_QUERY }, (context) => {
      createStoryTimeline({
        trigger: triggerEl,
        camera,
        cameraTarget,
        watch: watchObj,
        isNarrow: Boolean(context.conditions?.isNarrow),
      });
    });
    return () => mm.revert();
  }, [camera, cameraTarget, trigger, watch]);

  // GSAP moves camera.position and cameraTarget; aim the camera every frame.
  useFrame(() => camera.lookAt(cameraTarget));

  return null;
}
