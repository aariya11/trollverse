import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Report A Problem",
  description:
    "How to report a harmful prank link, a policy violation, or content that crossed the line. What we can act on, what we cannot, and why that distinction is honest.",
  path: "/report",
});

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Report</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Something crossed a line</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Serious reporting, handled seriously. Below is exactly what can be done about what — no
          form theater, no automated void.
        </p>
      </header>

      <div className="legal mt-8">
        <h2>What you can report</h2>
        <ul>
          <li>
            <strong>A prank link that scared or hurt someone:</strong> the most important case.
            Include the link and, in a sentence, how it landed.
          </li>
          <li>
            <strong>A promise this site broke:</strong> anything on Trollverse that impersonated a
            real institution, asked for personal data, or pretended not to be a prank beyond the
            reveal.
          </li>
          <li>
            <strong>Content that violates the guidelines:</strong>{" "}
            <Link href="/community-guidelines">the ten rules</Link> apply to everything the tools
            can produce.
          </li>
          <li>
            <strong>A technical safety problem:</strong> a page that could be misused by someone
            with bad intentions, even if the page itself is innocent.
          </li>
        </ul>

        <h2>What we can actually do — honestly</h2>
        <ul>
          <li>
            <strong>Can:</strong> fix or remove tooling, adjust generators so a harmful pattern
            cannot be produced, and document changes openly.
          </li>
          <li>
            <strong>Can:</strong> block access to specific patterns or shut misuse down at the site
            level.
          </li>
          <li>
            <strong>Cannot:</strong> un-send a link. Pranks live in URLs, decoded on the recipient
            side. Once a link exists, nobody — including us — can recall it.
          </li>
          <li>
            <strong>Cannot:</strong> tell you who made a specific prank. The architecture has no
            record of authorship by design. This trade-off is described plainly on the{" "}
            <Link href="/t">prank links page</Link>.
          </li>
        </ul>

        <h2>If someone is in danger</h2>
        <p>
          If anyone is being threatened, scammed or harassed in real life, contact local emergency
          services or the relevant platform first — a small humor project is not the right
          responder, and no web page is. Then report the link here so the pattern can be removed for
          everyone else.
        </p>

        <h2>How a report lands</h2>
        <p>
          Reports are read by the project&apos;s maintainer. Confirmed generator problems get fixed
          at the source so the same prank cannot be produced again. Confirmed policy violations get
          documented in the moderation notes so the decision-making stays consistent and reviewable.
        </p>

        <p className="font-mono text-xs">
          Deliberately honest limitation: until the dedicated reporting channel ships, reports flow
          through the same minimal contact path described on the <Link href="/contact">contact page</Link>.
          This page exists first so the rules and the reality never drift apart.
        </p>
      </div>
    </div>
  );
}
