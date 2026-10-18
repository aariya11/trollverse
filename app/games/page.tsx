import type { Metadata } from "next";
import { DoomButton } from "@/components/games/DoomButton";
import { GremlinCatch } from "@/components/games/GremlinCatch";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Mini Games — Forbidden Button & Gremlin Catch",
  description:
    "Two tiny games with big attitude: press the button that should not be pressed, and catch gremlins in a 30-second arcade round. High scores stay on your device.",
  path: "/games",
});

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Mini games</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">Two-minute diversions</h1>
        <p className="mt-4 text-lg text-ink-soft">
          No downloads, no logins, no dark patterns asking for your soul. Just two small games
          with the exact amount of nonsense the name Trollverse promises.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <DoomButton />
        <GremlinCatch />
      </div>

      <p className="mt-10 max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
        Honest note: this is not a labor of game design — it is dessert. Boutique arcade energy,
        zero monetization, best scores stored in your own browser only.
      </p>
    </div>
  );
}
