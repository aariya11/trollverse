import type { ReactNode } from "react";

export function Chip({
  children,
  tone = "paper",
  className = "",
}: {
  children: ReactNode;
  tone?: "paper" | "rose" | "sage" | "blush" | "ink";
  className?: string;
}) {
  const toneClass =
    tone === "rose"
      ? "bg-rose"
      : tone === "sage"
        ? "bg-sage"
        : tone === "blush"
          ? "bg-blush"
          : tone === "ink"
            ? "bg-ink text-cream"
            : "bg-paper";
  return <span className={`chip ${toneClass} ${className}`}>{children}</span>;
}

export function Sticker({
  children,
  className = "",
  tone = "rose",
}: {
  children: ReactNode;
  className?: string;
  tone?: "rose" | "sage" | "blush" | "ink";
}) {
  const toneClass =
    tone === "sage"
      ? "bg-sage"
      : tone === "blush"
        ? "bg-blush"
        : tone === "ink"
          ? "bg-ink text-cream"
          : "bg-rose";
  return (
    <span
      className={`inline-block -rotate-2 rounded-full border-2 border-ink px-4 py-1.5 font-mono text-xs font-bold tracking-[0.12em] uppercase ${toneClass} ${className}`}
      style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  blurb,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  blurb?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="label-mono mb-3 text-rose-deep">{kicker}</p>
      <h2 className="text-4xl sm:text-5xl">{title}</h2>
      {blurb ? <p className="mt-4 text-base text-ink-soft sm:text-lg">{blurb}</p> : null}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse-soft rounded-2xl border-2 border-ink/10 bg-cream-deep/70 ${className}`}
    />
  );
}

export function EmptyState({
  glyph,
  title,
  body,
  action,
}: {
  glyph?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-ink/30 bg-paper/60 px-6 py-12 text-center">
      {glyph ? <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">{glyph}</div> : null}
      <h3 className="text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
