// CC BY 4.0 credit for the product model. Wording comes from D008 in
// docs/DECISIONS.md; keep the two in sync.
export function Attribution() {
  return (
    <p className="max-w-md text-[11px] leading-relaxed text-foreground/50">
      3D model:{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground/70"
        href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ChronographWatch"
      >
        &ldquo;Chronograph Watch&rdquo;
      </a>{" "}
      &copy; 2025 Darmstadt Graphics Group GmbH, adapted by Eric Chadwick,{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground/70"
        href="https://creativecommons.org/licenses/by/4.0/"
      >
        CC BY 4.0
      </a>
      . Based on{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground/70"
        href="https://skfb.ly/oAsPA"
      >
        &ldquo;Chronograph Watch Mudmaster&rdquo;
      </a>{" "}
      by graphiccompressor, CC BY 4.0. Khronos and DGG logos are trademarks of
      their owners.
    </p>
  );
}
