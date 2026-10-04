import { Environment, Lightformer } from "@react-three/drei";

// Studio lighting built from in-scene light panels (no HDRI download).
// The Environment bakes the Lightformers into an env map once (frames={1});
// metals and glass get their reflections from it. Direct lights add readable
// shading on non-metal parts (dial, black band and case).
//
// Hierarchy: key (upper right front) >> fill (left, soft, low) > back rim.
// Fill and rim only lift shadow detail and edge separation; the key alone
// creates the hard metallic highlights.
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.1} />
      {/* Key */}
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      {/* Fill: opposite side to the key, ~1/3 of its intensity, slightly cool */}
      <directionalLight position={[-4, 2, 3]} intensity={0.4} color="#dfe6ff" />
      {/* Back rim: behind and above, separates dark edges from the background */}
      <directionalLight position={[1, 3, -6]} intensity={0.8} />
      <Environment resolution={256} frames={1}>
        {/* Key: large soft box, upper right front */}
        <Lightformer form="rect" intensity={3} position={[4, 3, 5]} scale={[6, 4, 1]} />
        {/* Fill: large, low-intensity panel front-left, opposite the key. Its
            size spreads the reflection into a soft gradient instead of a second
            hot spot; placed near the Precision camera's side so surfaces facing
            that camera pick it up. */}
        <Lightformer form="rect" intensity={1.1} position={[-5, 2, 4]} scale={[8, 8, 1]} />
        {/* Rim: tall strips behind, for edge highlights on the bezel */}
        <Lightformer form="rect" intensity={4} position={[-3, 1, -5]} scale={[1, 8, 1]} />
        <Lightformer form="rect" intensity={4} position={[3, 1, -5]} scale={[1, 8, 1]} />
        {/* Bounce: large, dim card below (like a reflector under a product
            shot). Down- and lower-left-facing surfaces reflect it, so the lower
            bezel, lugs and band don't merge with the dark background. */}
        <Lightformer form="rect" intensity={0.5} position={[0, -5, 1]} scale={[12, 12, 1]} />
        {/* Top strip */}
        <Lightformer form="rect" intensity={1.5} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 1, 1]} />
      </Environment>
    </>
  );
}
