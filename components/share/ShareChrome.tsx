import Link from "next/link";

export function ShareBanner({ kindLabel }: { kindLabel: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border-2 border-ink bg-paper px-4 py-2 text-center text-xs text-ink-soft">
        <span className="label-mono text-rose-deep">{kindLabel}</span>
        <span>Created with Troll Lab. It collects nothing, asks for nothing and never downloads files.</span>
        <Link href="/t" className="link-underline font-semibold text-ink">
          How this works
        </Link>
      </p>
    </div>
  );
}

export function BrokenLink() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="rounded-3xl border-2 border-ink bg-paper p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
        <p className="font-display text-6xl">:(</p>
        <h1 className="mt-4 text-3xl">This prank link is broken</h1>
        <p className="mt-3 text-sm text-ink-soft">
          The link may have been copied incompletely, edited, or made up entirely. No harm done —
          nobody saw your secret plan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/troll-lab" className="btn btn-sm btn-primary">
            Make your own prank
          </Link>
          <Link href="/" className="btn btn-sm btn-paper">
            Back to the chaos
          </Link>
        </div>
      </div>
    </div>
  );
}

export function YourTurn({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 rounded-3xl border-2 border-ink bg-cream-deep/60 p-6 text-center" style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}>
      <p className="label-mono text-rose-deep">Your turn, creator</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{children}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link href="/troll-lab" className="btn btn-sm btn-accent">
          Open the Troll Lab
        </Link>
        <Link href="/chaos?spin=1" className="btn btn-sm btn-paper">
          Or spin the chaos engine
        </Link>
      </div>
    </div>
  );
}
