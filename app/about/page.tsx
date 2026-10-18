import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Trollverse",
  description:
    "What Trollverse is, who it is for, what it will never do, and an honest list of what is not built yet. Read this before the fun pages.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">About</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">The internet has lost its mind. We made it cozier.</h1>
      </header>

      <div className="legal mt-8">
        <p>
          Trollverse is a playful entertainment site built on a simple belief: silliness is better
          when it is kind. It is a home for harmless pranks between friends, absurd generators, tiny
          games, and creative studios that work entirely in your browser.
        </p>

        <h2>What this is</h2>
        <ul>
          <li>A set of toys: chaos engine, troll lab, meme studio, doodle battles, mini games, daily challenges.</li>
          <li>A no-account zone. Everything you make stays on your device unless you explicitly share a link.</li>
          <li>A written-content library: jokes, hypotheticals, quizzes and more, all labeled as house content.</li>
        </ul>

        <h2>What this will never be</h2>
        <ul>
          <li>No impersonation of real people, brands, banks, governments or emergency services.</li>
          <li>No harassment tools, no scare pranks, no fake emergencies — ever.</li>
          <li>No dark patterns, no surprise subscriptions, no selling data (there is no data to sell).</li>
          <li>No fake numbers to impress you: no invented user counts, ratings or testimonials on this site.</li>
        </ul>

        <h2>What is not built yet, honestly</h2>
        <p>
          Real accounts, friend lists and live multiplayer rooms are not implemented. Rather than
          faking them with impressive-looking mock screens, those surfaces simply say so. If you
          see a feature advertised here, it works.
        </p>

        <h2>The prank philosophy</h2>
        <p>
          A good prank ends with everyone laughing — including the target. Every prank page on
          Trollverse reveals itself, names itself, and points the recipient at the tools to prank
          back. Suspicion should last seconds, not days.
        </p>

        <h2>Who made this</h2>
        <p>
          Trollverse is an indie project — a handmade site with no advertising, no analytics
          tracking you across the web, and no growth-hacking machinery. If it made you laugh once,
          it did its job. Pay it forward: go be silly with someone you like.
        </p>

        <p>
          Questions, bugs or ideas? <Link href="/contact">Say hello</Link> or read the{" "}
          <Link href="/community-guidelines">community guidelines</Link>.
        </p>
      </div>
    </div>
  );
}
