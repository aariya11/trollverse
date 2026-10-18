import { Button } from "@/components/ui/Button";
import { ChaosOrb } from "./ChaosOrb";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-blush/70 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-sage/25 blur-2xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-20">
        <div>
          <span
            className="inline-block -rotate-2 rounded-full border-2 border-ink bg-paper px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em]"
            style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
          >
            A playground for harmless nonsense
          </span>

          <h1 className="mt-6 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            Boring internet?{" "}
            <span className="relative inline-block text-rose-deep">
              not anymore.
              <svg
                viewBox="0 0 300 18"
                className="absolute -bottom-3 left-0 w-full"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 12C60 4 120 4 150 9s90 6 146-2"
                  fill="none"
                  stroke="var(--color-sage)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            Random chaos, questionable jokes, unexpected friends, and the kind of nonsense you
            didn&apos;t know you needed. Every button here does something. That&apos;s a promise
            and a warning.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/chaos?spin=1" variant="primary" size="lg">
              Unleash the chaos
            </Button>
            <Button href="#launcher" variant="paper" size="lg">
              I&apos;m just looking
            </Button>
          </div>

          <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft">
            No sign-up required · everything stays in your browser · zero ads, zero trackers
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 mx-auto my-auto h-64 w-64 rounded-[46%_54%_52%_48%/52%_46%_54%_48%] bg-rose/20 animate-blob" />
          <ChaosOrb />
        </div>
      </div>
    </section>
  );
}
