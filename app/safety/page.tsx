import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Safety Guide",
  description:
    "How Trollverse pranks are designed to stay harmless, how to spot a prank link, what to do if a prank lands badly, and how to prank back kind.",
  path: "/safety",
});

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Safety</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Pranks that end in laughter</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Safety is not the opposite of fun. It is the thing that lets the fun stay fun. Here is
          how Trollverse works, and how to keep it working.
        </p>
      </header>

      <div className="legal mt-8">
        <h2>How the tools keep pranks harmless by design</h2>
        <ul>
          <li>Every prank page names itself as a prank at the moment of reveal. The mystery lasts seconds, never hours.</li>
          <li>No fake banks, governments, hospitals, delivery services or security alerts — the generators simply do not produce them.</li>
          <li>No forms anywhere. Prank pages cannot ask for passwords, payments or personal details even if someone wanted them to.</li>
          <li>No accounts to compromise, no server storage to leak. Links carry the joke; nothing else is kept.</li>
          <li>The Troll Lab shows house rules right above the creators, not hidden in a footer.</li>
        </ul>

        <h2>Spotting a Trollverse prank link</h2>
        <p>
          Prank links look like <code className="font-mono text-xs">trollverse.example/t/award?d=…</code>{" "}
          — long, encoded and obviously full of junk. A real damning document would never arrive as
          a 600-character link from this domain. When in doubt, open it on a device you are relaxed
          about and read the reveal.
        </p>

        <h2>Before you send a prank</h2>
        <ul>
          <li>Ask: will this person laugh? If you have to think about it, choose a gentler prank.</li>
          <li>Context matters: pranks belong between people who know each other, not with strangers, not at work about work-critical things.</li>
          <li>Timing matters: never during someone&apos;s exam, interview, grief or Monday morning disaster.</li>
          <li>One prank at a time. A barrage stops being funny at prank two.</li>
        </ul>

        <h2>If a prank lands badly</h2>
        <ul>
          <li>Say the honest sentence immediately: &ldquo;That was a prank — I made it, I am sorry it landed wrong.&rdquo;</li>
          <li>Do not double down with &ldquo;it was just a joke&rdquo;. The move is ownership, not defense.</li>
          <li>Give them the reveal link so they can see there was never anything real to worry about.</li>
          <li>If they ask you to stop pranking them generally, that is a complete and final answer.</li>
        </ul>

        <h2>If a prank is used against you</h2>
        <ul>
          <li>Remember the reveal is always inside the link: a Trollverse prank cannot actually access your accounts, files or money — there are no forms and no downloads.</li>
          <li>If it pretended to be a bank or an emergency, it was not made with our generators; report it via the <Link href="/report">report page</Link>.</li>
          <li>Feeling shaken is fair. Close the tab. The page was designed to fail to be real.</li>
        </ul>

        <h2>For parents and teachers</h2>
        <p>
          Trollverse collects no personal information, has no chat or messaging, and cannot contact
          your kids — there is nothing to contact them with. The prank tools are visible in full
          above the safety rules on the <Link href="/troll-lab">Troll Lab</Link> page, so nothing
          about this site is hidden from you that is not hidden from everyone equally.
        </p>

        <h2>The one-sentence version</h2>
        <p>
          Prank like someone who has to sit next to the person at lunch tomorrow.
        </p>
      </div>
    </div>
  );
}
