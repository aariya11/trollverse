import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/site/Ticker";
import { ChaosLauncher } from "@/components/home/ChaosLauncher";
import { Trending } from "@/components/home/Trending";
import { DailyCard } from "@/components/home/DailyCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Bits";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "TROLLVERSE — The Internet Has Lost Its Mind",
  description:
    "Random chaos, questionable jokes and unexpectedly good drawings. Spin the chaos engine, troll your friends harmlessly, make memes and play weird little games — no sign-up needed.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <ChaosLauncher />
      <Trending />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            kicker="Daily chaos"
            title="One tiny mission per day"
            blurb="Today's challenge is the same for everyone. Finish it, keep your streak alive, and feel briefly unstoppable. Challenges roll over at midnight UTC."
          />
          <DailyCard />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-ink px-6 py-12 text-center text-cream sm:px-12"
          style={{ boxShadow: "8px 8px 0 0 var(--color-rose)" }}
        >
          <div aria-hidden="true" className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-rose/25 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-sage/25 blur-2xl" />
          <p className="label-mono text-rose">Still bored?</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl sm:text-5xl">
            That&apos;s a you problem we can absolutely fix.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/75">
            Spin the chaos engine until something lands, or go waste time with the gremlins.
            Both are valid life choices.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/chaos?spin=1" variant="accent" size="lg">
              Unleash the chaos
            </Button>
            <Button href="/games" variant="sage" size="lg">
              Play something stupid
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
