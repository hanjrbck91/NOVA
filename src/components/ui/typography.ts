// Shared type styles so every chapter and the specs section use the same
// hierarchy. Full class strings (not composed) so Tailwind can detect them.

// Small mono label above headings.
export const LABEL = "font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/55";

// Chapter headline: fluid size, tight leading, medium weight so it
// supports the watch instead of competing with it.
export const HEADLINE =
  "text-[clamp(2.25rem,5.2vw,4.75rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em]";
