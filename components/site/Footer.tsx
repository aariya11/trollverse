import Link from "next/link";
import { Logo } from "./Logo";
import { SoundToggle } from "./SoundToggle";
import { CurrentYear } from "./CurrentYear";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Play",
    links: [
      { href: "/chaos", label: "Random Chaos" },
      { href: "/troll-lab", label: "Troll Lab" },
      { href: "/meme-studio", label: "Meme Studio" },
      { href: "/draw", label: "Draw Together" },
      { href: "/games", label: "Mini Games" },
      { href: "/daily", label: "Daily Chaos" },
    ],
  },
  {
    title: "The Site",
    links: [
      { href: "/explore", label: "Explore Everything" },
      { href: "/t", label: "Prank Links" },
      { href: "/profile", label: "Your Profile" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Trust & Safety",
    links: [
      { href: "/community-guidelines", label: "Community Guidelines" },
      { href: "/safety", label: "Safety Center" },
      { href: "/report", label: "Report Abuse" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookie-preferences", label: "Cookie Preferences" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="[&_span]:text-cream" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/75">
              The internet has lost its mind. A playground for harmless chaos, questionable jokes
              and unexpectedly good drawings.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SoundToggle />
              <span className="font-mono text-[0.68rem] tracking-[0.14em] text-cream/60 uppercase">
                Sound effects
              </span>
            </div>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="label-mono mb-4 text-rose">{column.title}</h2>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/80 transition-colors hover:text-blush"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/15 pt-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> TROLLVERSE — a made-up universe. All community sections
            currently show house content, clearly labeled.
          </p>
          <p className="font-mono tracking-wide uppercase">
            No fake countdowns. No dark patterns. Just nonsense.
          </p>
        </div>
      </div>
    </footer>
  );
}
