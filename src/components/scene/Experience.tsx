"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./Scene";

// Fixed full-viewport WebGL layer that sits behind the DOM.
// Color management uses R3F defaults: sRGB output, ACES Filmic tone mapping.
export function Experience() {
  return (
    <div className="fixed inset-0" aria-hidden="true">
      <Canvas
        camera={{ fov: 30, position: [0, 0, 7], near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
