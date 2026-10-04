import { Experience } from "@/components/scene/Experience";
import { Attribution } from "@/components/ui/Attribution";

export default function Home() {
  return (
    <>
      <Experience />
      {/* DOM layer above the canvas. pointer-events-none lets pointer moves
          reach the canvas; links opt back in. */}
      <main className="pointer-events-none relative flex h-dvh flex-col justify-between p-6 sm:p-10">
        <header className="font-mono text-xs uppercase tracking-[0.4em]">
          NOVA
        </header>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
              NOVA Chronograph
            </p>
            <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-6xl">
              The future
              <br />
              of time.
            </h1>
          </div>
          <div className="pointer-events-auto">
            <Attribution />
          </div>
        </div>
      </main>
    </>
  );
}
