import { HEADLINE, LABEL } from "./typography";

// DOM layer for the three chapters. Each chapter block carries a
// data-chapter attribute; createStoryTimeline finds and animates them
// (opacity + translate). Animated blocks have no CSS transforms of their
// own — positioning is done by non-animated wrappers.
// pointer-events-none lets pointer moves reach the canvas; links opt back in.
export function StoryOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between gap-6 p-6 sm:p-10 lg:p-14">
      <header className="font-mono text-xs uppercase tracking-[0.5em]">NOVA</header>

      <div className="relative flex-1">
        {/* Chapter 1 — Hero: bottom left */}
        <div className="absolute inset-0 flex items-end">
          <section data-chapter="hero" className="flex flex-col gap-4">
            <p className={LABEL}>NOVA Chronograph</p>
            <h1 className={HEADLINE}>
              The future
              <br />
              of time.
            </h1>
          </section>
        </div>

        {/* Chapter 2 — Precision: right middle (bottom below xl) */}
        <div className="absolute inset-0 flex items-end xl:items-center xl:justify-end">
          <section data-chapter="precision" className="flex flex-col gap-4 opacity-0 xl:items-end xl:text-right">
            <p className={LABEL}>02 — Craft</p>
            <h2 className={HEADLINE}>
              Precision
              <br />
              in motion.
            </h2>
          </section>
        </div>

        {/* Chapter 3 — Final: left middle (bottom below xl) */}
        <div className="absolute inset-0 flex items-end xl:items-center">
          <section data-chapter="final" className="flex flex-col gap-8 opacity-0">
            <div className="flex flex-col gap-4">
              <p className={LABEL}>03 — NOVA</p>
              <h2 className={HEADLINE}>
                Experience
                <br />
                NOVA.
              </h2>
            </div>
            {/* Lenis (anchors: true) turns this into a smooth scroll. */}
            <a
              href="#specs"
              className="pointer-events-auto w-fit border-b border-foreground/50 pb-1.5 font-mono text-xs uppercase tracking-[0.35em] transition-colors hover:border-foreground focus-visible:outline-offset-4"
            >
              Discover →
            </a>
          </section>
        </div>
      </div>

      <footer className="flex items-end justify-between">
        <p data-scroll-indicator className={LABEL}>
          Scroll ↓
        </p>
      </footer>
    </div>
  );
}
