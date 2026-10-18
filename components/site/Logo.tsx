import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Trollverse logo">
      <circle
        cx="24"
        cy="24"
        r="21.5"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeDasharray="4 5"
        className="animate-spin-slow origin-center"
      />
      <circle cx="24" cy="24" r="15" fill="var(--color-rose)" stroke="var(--color-ink)" strokeWidth="2.4" />
      <circle cx="18.5" cy="21" r="2.6" fill="var(--color-ink)" />
      <circle cx="29.5" cy="21" r="2.6" fill="var(--color-ink)" />
      <path
        d="M16.5 28.5c2.2 3 5 4.4 7.5 4.4s5.3-1.4 7.5-4.4"
        stroke="var(--color-ink)"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M10 36.5c1.6-1.2 3.2-1.2 4.8 0" stroke="var(--color-sage-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Trollverse home"
    >
      <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:rotate-12" />
      <span className="font-display text-xl font-extrabold tracking-tight">
        TROLL<span className="text-rose-deep">VERSE</span>
      </span>
    </Link>
  );
}
