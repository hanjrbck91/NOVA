import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, type RefObject } from "react";
import type { Group } from "three";
import { CAMERA_FOV, CAMERA_STATES } from "@/animation/storyConfig";
import { Scene } from "./Scene";
import { ScrollDirector } from "./ScrollDirector";

// WebGL layer. Fills its (sticky) parent; the DOM overlay sits on top.
// Color management uses R3F defaults: sRGB output, ACES Filmic tone mapping.
type Props = {
  story: RefObject<HTMLElement | null>;
  onReady: () => void; // called once the model is mounted and the timeline built
};

export function Experience({ story, onReady }: Props) {
  const watchRef = useRef<Group>(null);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ fov: CAMERA_FOV, position: CAMERA_STATES.hero.position, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <Suspense fallback={null}>
          <Scene watchRef={watchRef} />
          <ScrollDirector trigger={story} watch={watchRef} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
