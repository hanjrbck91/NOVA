import { Attribution } from "./Attribution";

// DOM layer for the three chapters. Each chapter block carries a
// data-chapter attribute; createStoryTimeline finds and animates them
// (opacity + translate). Animated blocks have no CSS transforms of their
// own — positioning is done by non-animated wrappers.
// pointer-events-none lets pointer moves reach the canvas; links opt back in.
export function StoryOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between gap-6 p-6 sm:p-10">
      <header className="font-mono text-xs uppercase tracking-[0.4em]">NOVA</header>

      <div className="relative flex-1">
        {/* Chapter 1 — Hero: bottom left (M02 position) */}
        <div className="absolute inset-0 flex items-end">
          <section data-chapter="hero" className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
              NOVA Chronograph
            </p>
            <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-6xl">
              The future
              <br />
              of time.
            </h1>
          </section>
        </div>

        {/* Chapter 2 — Precision: right middle (bottom on narrow) */}
        <div className="absolute inset-0 flex items-end sm:items-center sm:justify-end">
          <section data-chapter="precision" className="flex flex-col gap-3 opacity-0 sm:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
              02 — Craft
            </p>
            <h2 className="text-4xl font-semibold uppercase tracking-tight sm:text-6xl">
              Precision
              <br />
              in motion.
            </h2>
          </section>
        </div>

        {/* Chapter 3 — Final: left middle (bottom on narrow) */}
        <div className="absolute inset-0 flex items-end sm:items-center">
          <section data-chapter="final" className="flex flex-col gap-6 opacity-0">
            <h2 className="text-4xl font-semibold uppercase tracking-tight sm:text-6xl">
              Experience
              <br />
              NOVA.
            </h2>
            {/* Visual CTA only; destination is out of M03 scope. */}
            <span className="w-fit border-b border-foreground/60 pb-1 font-mono text-sm uppercase tracking-[0.3em]">
              Discover →
            </span>
          </section>
        </div>
      </div>

      <footer className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p
          data-scroll-indicator
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/50"
        >
          Scroll ↓
        </p>
        <div className="pointer-events-auto">
          <Attribution />
        </div>
      </footer>
    </div>
  );
}
