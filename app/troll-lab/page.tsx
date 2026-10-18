import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { TrollLab } from "@/components/troll/TrollLab";
import { Skeleton } from "@/components/ui/Bits";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Troll Lab — Harmless Pranks",
  description:
    "Build friendly prank links: fake loading screens with a twist, silly award certificates, breaking-news generators, absurd quizzes and tap-to-open reveal cards. Everything stays playful — no impersonation, no data collection.",
  path: "/troll-lab",
});

const RULES = [
  "No imitation of banks, governments, hospitals, delivery services or security systems.",
  "No forms. Prank pages never ask for passwords, payments or personal details.",
  "No impersonation of real people — the jokes are about situations, not identities.",
  "No fake emergencies, no fear, no lies that outlive the joke.",
  "Every reveal ends with a clear 'this was a prank' message.",
];

async function LabLoader({ searchParams }: { searchParams: PageProps<"/troll-lab">["searchParams"] }) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : undefined;
  const template = typeof params.template === "string" ? params.template : null;
  return <TrollLab initialTab={tab} template={template} />;
}

export default function TrollLabPage(props: PageProps<"/troll-lab">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Friend trolling lab</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">Pranks with a conscience</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Create a harmless, funny experience and send the link to a friend. The whole prank lives
          inside the link itself — no accounts, no server storage, nothing to clean up.
        </p>
      </header>

      <div className="mt-8 rounded-3xl border-2 border-ink bg-blush/60 p-5" style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}>
        <p className="label-mono text-rose-deep">House rules for pranks</p>
        <ul className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span aria-hidden="true" className="text-rose-deep">✦</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-12 w-full max-w-xl rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
          }
        >
          <LabLoader searchParams={props.searchParams} />
        </Suspense>
      </div>

      <p className="mt-10 max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
        Tech note, honestly explained: the prank content is encoded into the link and decoded in
        the recipient&apos;s browser. Trollverse servers never see it, which also means there is
        nothing to delete afterwards. Long pranks make long links — that is the trade-off.{" "}
        <Link href="/t" className="link-underline">
          Learn how prank links work
        </Link>
        .
      </p>
    </div>
  );
}
