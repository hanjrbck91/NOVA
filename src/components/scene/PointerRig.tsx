import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import { MathUtils, type Group } from "three";

// Max rotation (radians) at the viewport edge, and damping speed
// (MathUtils.damp lambda; time constant = 1 / SMOOTHING s).
// M04: halved and made snappier (was 0.12 / 3 ≈ 1 s drift) so the pointer
// reads as a small, precise response instead of a floating object.
const STRENGTH = 0.06;
const SMOOTHING = 6;

// Subtly rotates its children toward the pointer. Mutates the group in
// useFrame (no React state), so pointer movement never re-renders React.
export function PointerRig({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    const { x, y } = state.pointer; // -1..1, relative to the canvas
    group.rotation.y = MathUtils.damp(group.rotation.y, x * STRENGTH, SMOOTHING, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, -y * STRENGTH, SMOOTHING, delta);
  });

  return <group ref={ref}>{children}</group>;
}
