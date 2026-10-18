import type { Metadata } from "next";
import { Suspense } from "react";
import { ChaosEngine } from "@/components/chaos/ChaosEngine";
import { Skeleton } from "@/components/ui/Bits";
import { pageMeta } from "@/lib/seo";
import { CHAOS_CATEGORIES, type ChaosCategory } from "@/lib/chaos";

export const metadata: Metadata = pageMeta({
  title: "Random Chaos Engine",
  description:
    "Spin the Trollverse chaos engine for fresh jokes, absurd hypotheticals, fake breaking news, tiny challenges and questionable compliments. Every spin is generated live.",
  path: "/chaos",
});

const validCategories = new Set(CHAOS_CATEGORIES.map((entry) => entry.id));

async function ChaosLoader({ searchParams }: { searchParams: PageProps<"/chaos">["searchParams"] }) {
  const params = await searchParams;
  const spin = params.spin === "1";
  const cat =
    typeof params.cat === "string" && validCategories.has(params.cat as ChaosCategory)
      ? (params.cat as ChaosCategory)
      : null;

  return <ChaosEngine autoSpin={spin} initialCategory={cat} />;
}

export default function ChaosPage(props: PageProps<"/chaos">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Random entertainment engine</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">The chaos engine</h1>
        <p className="mt-4 text-lg text-ink-soft">
          One button, ten flavors of nonsense, zero repeats of the small-joke problem. Generated
          fresh every time from the Trollverse content engine.
        </p>
      </header>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
              <Skeleton className="mx-auto h-40 w-40 rounded-full sm:h-48 sm:w-48" />
              <Skeleton className="h-56 w-full rounded-3xl" />
            </div>
          }
        >
          <ChaosLoader searchParams={props.searchParams} />
        </Suspense>
      </div>

      <p className="mt-10 max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
        How it works: results are assembled live from written content pools and template grammars —
        a modular engine, so new experiences can be added without touching the rest of the app.
        Nothing is ever sent to a server; the whole generator runs in your browser.
      </p>
    </div>
  );
}
