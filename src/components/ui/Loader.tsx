// Full-screen loading state shown until the watch GLB is loaded and the
// scroll timeline is built (real readiness, no fake percentage).
// Fades out on ready; with prefers-reduced-motion the bar is static and the
// fade is instant.
export function Loader({ ready }: { ready: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={ready}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background transition-[opacity,visibility] duration-700 ease-out motion-reduce:duration-0 ${
        ready ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      <p className="pl-[0.6em] font-mono text-sm uppercase tracking-[0.6em]">NOVA</p>
      <div className="relative h-px w-28 overflow-hidden bg-foreground/15">
        {/* Animation class dropped once ready so nothing keeps running hidden. */}
        <div
          className={`absolute inset-y-0 left-0 w-1/3 bg-foreground/70 ${ready ? "" : "nova-loader-bar"}`}
        />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/40">
        {ready ? "Ready" : "Preparing chronograph"}
      </p>
    </div>
  );
}
