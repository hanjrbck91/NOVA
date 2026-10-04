import { useThree } from "@react-three/fiber";
import { PointerRig } from "./PointerRig";
import { StudioLighting } from "./StudioLighting";
import { WatchModel } from "./WatchModel";

// Hero pose: slight three-quarter angle so the bezel depth reads.
const HERO_ROTATION: [number, number, number] = [0.15, -0.35, 0];

// Below this visible world width (at the origin) the model shrinks so it
// isn't cropped on narrow viewports. Leaves the camera free for M03.
const MIN_VISIBLE_WIDTH = 3.2;

export function Scene() {
  const viewportWidth = useThree((state) => state.viewport.width);
  const fit = Math.min(1, viewportWidth / MIN_VISIBLE_WIDTH);

  return (
    <>
      <StudioLighting />
      <PointerRig>
        <group scale={fit} rotation={HERO_ROTATION}>
          <WatchModel />
        </group>
      </PointerRig>
    </>
  );
}
