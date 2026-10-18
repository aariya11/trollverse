import type { Metadata } from "next";
import { Suspense } from "react";
import { DoodleStudio } from "@/components/draw/DoodleStudio";
import { Skeleton } from "@/components/ui/Bits";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Doodle Studio — 60-Second Art Battles",
  description:
    "A tiny drawing studio with a fight club attached: random prompts, a 60-second battle timer, full canvas tools and PNG export. All local, all yours.",
  path: "/draw",
});

async function StudioLoader({ searchParams }: { searchParams: PageProps<"/draw">["searchParams"] }) {
  const params = await searchParams;
  const rawPrompt = typeof params.prompt === "string" ? params.prompt : null;
  const prompt = rawPrompt ? rawPrompt.slice(0, 160).trim() || null : null;
  const battle = params.mode === "battle";
  return <DoodleStudio initialPrompt={prompt} battle={battle} />;
}

export default function DrawPage(props: PageProps<"/draw">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Doodle studio</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">
          Draw first, question later
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Random prompts, a no-frills canvas and a battle mode for when friendship needs a little
          friendly war. Sixty seconds per masterpiece, no takebacks.
        </p>
      </header>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <Skeleton className="h-96 w-full rounded-3xl" />
              <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
          }
        >
          <StudioLoader searchParams={props.searchParams} />
        </Suspense>
      </div>

      <p className="mt-10 max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
        Every stroke lives in this tab and nowhere else. Export a PNG when you are proud of it,
        clear when you are not. No accounts, no galleries, no judgment — visible.
      </p>
    </div>
  );
}
