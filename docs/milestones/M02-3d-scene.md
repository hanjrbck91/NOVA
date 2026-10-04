# M02 — 3D Scene

**Status:** Asset selected. Scene implementation not started.

## Objective

Fixed R3F `<Canvas>` with the product model, camera, and studio-style
lighting. Static: no scroll animation (that is M03).

## Asset

**Selected:** Khronos "ChronographWatch" → `public/models/nova-product.glb`
(see D008 in [DECISIONS.md](../DECISIONS.md)).

| Field        | Value |
| ------------ | ----- |
| Source       | Khronos glTF Sample Assets |
| Page         | https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ChronographWatch |
| Download     | https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb |
| Format       | GLB (glTF 2.0 binary), no conversion needed |
| Size         | 7,446,368 bytes (~7.4 MB) |
| SHA-256      | `8e875fcd83efb433afed9ef1c18b2c2b2e075e2bf48371cadfd2a3cf529f1aef` |
| License      | CC BY 4.0 (model and textures) |
| Modified     | No (byte-identical to source) |

**Attribution (must appear on the site):**
"Chronograph Watch" © 2025 Darmstadt Graphics Group GmbH, adapted by Eric
Chadwick, licensed CC BY 4.0. Based on "Chronograph Watch Mudmaster"
(https://skfb.ly/oAsPA) by graphiccompressor, CC BY 4.0. Khronos and DGG
logos are trademarks of their owners.

### Contents

- 13 meshes, 14 nodes, ~100k triangles, 8 textures.
- Materials: brushed metal bezel, carbon-fiber and plastic band, transmissive
  glass face, metal and color watch hands.
- Extensions: `KHR_materials_transmission`, `KHR_materials_variants`,
  `KHR_texture_transform` (all optional; supported by three's GLTFLoader).
- Material variants: Surgical White, Midnight Gold, Commerce Green, Khronos Red.
- One animation clip: `Anim_0` (1 channel).

### Candidates evaluated

| Candidate | Source | License | Size | Suitable because | Problems |
| --- | --- | --- | --- | --- | --- |
| **ChronographWatch** (selected) | Khronos | CC BY 4.0 | 7.4 MB | Premium wearable, rich materials, glass, color variants | Heavy-ish; trademark logos |
| SunglassesKhronos | Khronos | CC BY 4.0 | 0.37 MB | Very light; iridescent lenses | Simple, thin form; weaker hero |
| MaterialsVariantsShoe | Khronos / Shopify | CC BY 4.0 | 7.8 MB | Sneaker; 3 colorways | Scanned single mesh; less "futuristic" |
| AntiqueCamera | Khronos / UX3D | CC0 | 17.5 MB | Camera; CC0 | Antique, heavy, includes tripod |

Not used: Sketchfab (requires an account to download; licenses vary per
asset). No permissively licensed headphones of comparable quality were found
in the time budget.

### Known limitations

- 7.4 MB may slow first load; compression (Draco/KTX2) is possible later but
  would modify the asset. Defer to M04/M05 if needed.
- Transmission glass is relatively expensive to render; watch performance.
- Real-world scale (small); camera framing and scale handled in the scene.

## Implementation

Not started.
