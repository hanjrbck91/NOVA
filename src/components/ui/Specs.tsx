import { Attribution } from "./Attribution";
import { HEADLINE, LABEL } from "./typography";

// Attributes describe what the 3D model actually shows (and its four
// built-in material variants). NOVA itself is a concept, not a product.
const SPECS = [
  { term: "Case", detail: "Faceted metal bezel with exposed screws" },
  { term: "Face", detail: "Transmissive glass over an analog-digital dial" },
  { term: "Display", detail: "Analog hands, digital sub-display" },
  { term: "Bezel ring", detail: "24-city world time" },
  { term: "Strap", detail: "Carbon-fibre composite" },
  { term: "Finishes", detail: "Surgical White · Midnight Gold · Commerce Green · Khronos Red" },
];

// Final information section; target of the DISCOVER → CTA.
export function Specs() {
  return (
    <section
      id="specs"
      className="relative border-t border-foreground/10 bg-background px-6 pt-24 pb-10 sm:px-10 lg:px-14 lg:pt-36"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div className="flex flex-col gap-6">
          <p className={LABEL}>NOVA Chronograph</p>
          <h2 className={HEADLINE}>
            Precision engineering.
            <br />
            <span className="text-foreground/45">Designed for movement.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/60">
            A concept chronograph and real-time 3D study: every view on this
            page is rendered live in the browser.
          </p>
        </div>

        <dl className="grid content-start gap-x-10 sm:grid-cols-2">
          {SPECS.map((spec) => (
            <div key={spec.term} className="flex flex-col gap-2 border-t border-foreground/10 py-5">
              <dt className={LABEL}>{spec.term}</dt>
              <dd className="text-sm leading-relaxed text-foreground/85">{spec.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="mx-auto mt-24 flex max-w-6xl flex-col gap-6 border-t border-foreground/10 pt-8 sm:flex-row sm:items-end sm:justify-between lg:mt-36">
        <p className={LABEL}>NOVA — concept prototype</p>
        <Attribution />
      </footer>
    </section>
  );
}
