import type { Metadata } from "next";
import { DailyBoard } from "@/components/daily/DailyBoard";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Daily Chaos Challenge",
  description:
    "One absurd challenge per day, every day: write it, draw it, or drag a friend into it. Keep the streak alive — everything is tracked locally, no accounts required.",
  path: "/daily",
});

export default function DailyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Daily chaos</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">One challenge, every day</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Tiny, absurd, achievable in under ten minutes. The challenge changes at midnight UTC and
          rotates through the entire library, so you will not see the same nonsense twice in a
          while.
        </p>
      </header>

      <div className="mt-10">
        <DailyBoard />
      </div>
    </div>
  );
}
