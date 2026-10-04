import { Environment, Lightformer } from "@react-three/drei";

// Studio lighting built from in-scene light panels (no HDRI download).
// The Environment bakes the Lightformers into an env map once (frames={1});
// metals and glass get their reflections from it. One directional key light
// adds readable shading on the face.
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <Environment resolution={256} frames={1}>
        {/* Key: large soft box, upper right front */}
        <Lightformer form="rect" intensity={3} position={[4, 3, 5]} scale={[6, 4, 1]} />
        {/* Fill: dim panel, left */}
        <Lightformer form="rect" intensity={0.6} position={[-5, 0, 3]} scale={[4, 6, 1]} />
        {/* Rim: tall strips behind, for edge highlights on the bezel */}
        <Lightformer form="rect" intensity={4} position={[-3, 1, -5]} scale={[1, 8, 1]} />
        <Lightformer form="rect" intensity={4} position={[3, 1, -5]} scale={[1, 8, 1]} />
        {/* Top strip */}
        <Lightformer form="rect" intensity={1.5} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 1, 1]} />
      </Environment>
    </>
  );
}
