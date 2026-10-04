import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Vector3 } from "three";

const MODEL_URL = "/models/nova-product.glb";

// World-space height the watch is normalized to. Camera framing in
// Experience.tsx is tuned against this value.
const TARGET_HEIGHT = 2;

// Loads the GLB and normalizes it: centered on the origin, fixed height.
// The loaded scene's own transform is never touched; offset and scale live
// on wrapper groups so the cached scene stays pristine across remounts.
export function WatchModel() {
  const { scene } = useGLTF(MODEL_URL, false);

  const { offset, scale } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    return { offset: center.negate(), scale: TARGET_HEIGHT / size.y };
  }, [scene]);

  return (
    <group scale={scale}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL, false);
