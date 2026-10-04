import { StatusList } from "@/components/ui/StatusList";

// M01 placeholder: proves the App Router, TypeScript, Tailwind and the
// component structure work. The 3D scene arrives in M02.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-center gap-10 px-6 py-24 sm:px-16">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
          Milestone 01 — Foundation
        </p>
        <h1 className="text-5xl font-semibold tracking-tight">NOVA</h1>
        <p className="max-w-md text-foreground/70">
          Development environment is running. The 3D scene will be added in
          M02.
        </p>
      </div>
      <StatusList
        items={[
          { label: "framework", value: "Next.js (App Router)" },
          { label: "language", value: "TypeScript" },
          { label: "styling", value: "Tailwind CSS" },
          { label: "3d", value: "three · @react-three/fiber · drei (installed)" },
          { label: "animation", value: "gsap · ScrollTrigger (installed)" },
        ]}
      />
    </main>
  );
}
