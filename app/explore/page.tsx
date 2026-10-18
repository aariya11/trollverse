import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { CHAOS_CATEGORIES, type ChaosCategory } from "@/lib/chaos";
import { JOKES } from "@/lib/content/jokes";
import { HYPOTHETICALS } from "@/lib/content/hypotheticals";
import { WOULD_YOU_RATHER } from "@/lib/content/wyr";
import { RANDOM_QUESTIONS } from "@/lib/content/questions";
import { CHALLENGES } from "@/lib/content/challenges";
import { DRAW_PROMPTS } from "@/lib/content/prompts";
import { COMPLIMENT_TEMPLATES } from "@/lib/content/compliments";

export const metadata: Metadata = pageMeta({
  title: "Explore — All The Worlds",
  description:
    "Browse every corner of Trollverse: jokes, hypotheticals, fake news, would-you-rathers and more, plus the studios, pranks and games. Pick a world and get lost in it.",
  path: "/explore",
});

const COUNTS: Record<ChaosCategory, string> = {
  joke: `${JOKES.length} jokes`,
  hypothetical: `${HYPOTHETICALS.length} questions`,
  personality: "generated fresh",
  excuse: "generated fresh",
  scenario: "generated fresh",
  wyr: `${WOULD_YOU_RATHER.length} dilemmas`,
  question: `${RANDOM_QUESTIONS.length} starters`,
  challenge: `${CHALLENGES.length} missions`,
  prompt: `${DRAW_PROMPTS.length} prompts`,
  compliment: `${COMPLIMENT_TEMPLATES.length} templates`,
};

const ACCENT_CLASS: Record<string, string> = {
  rose: "bg-rose-tint",
  sage: "bg-sage-tint",
  blush: "bg-blush",
  ink: "bg-cream-deep",
};

const SPACES = [
  {
    href: "/chaos",
    title: "Chaos Engine",
    blurb: "One button, all ten worlds, assembled fresh every single spin.",
  },
  {
    href: "/troll-lab",
    title: "Troll Lab",
    blurb: "Build harmless prank links: loaders, awards, fake news, quiz duels, reveal cards.",
  },
  {
    href: "/meme-studio",
    title: "Meme Studio",
    blurb: "Pastel templates, draggable captions, your own images, PNG export. Fully local.",
  },
  {
    href: "/draw?mode=battle",
    title: "Doodle Studio",
    blurb: "Random prompts and 60-second battles because friendship needs friction.",
  },
  {
    href: "/games",
    title: "Mini Games",
    blurb: "A forbidden button and a gremlin arcade. Two minutes of dignity, spent.",
  },
  {
    href: "/daily",
    title: "Daily Challenge",
    blurb: "One tiny absurd mission per day. Streaks tracked locally, fame tracked nowhere.",
  },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Explore</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">Pick a world, get pleasantly lost</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Ten content worlds and six interactive spaces. Every world is focused, hand-labeled and
          honest about how much is inside it — no inflated numbers, no empty categories.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl">The ten chaos worlds</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAOS_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/chaos?cat=${category.id}`}
              className={`tile block ${ACCENT_CLASS[category.accent]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl">{category.label}</h3>
                <span className="chip shrink-0 border-ink bg-paper/80 font-mono text-[0.6rem]">
                  {COUNTS[category.id]}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl">Spaces &amp; studios</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPACES.map((space) => (
            <Link key={space.href} href={space.href} className="tile block">
              <h3 className="text-xl">{space.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{space.blurb}</p>
              <span className="mt-3 inline-block font-mono text-xs font-bold uppercase tracking-[0.14em] text-rose-deep">
                Enter →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-14 max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
        Why these and not more? Because a hundred half-empty categories is not a feature. What is
        here is complete; what is not built (accounts, friend lists, real-time rooms) says so
        plainly on the pages it would live on.
      </p>
    </div>
  );
}
