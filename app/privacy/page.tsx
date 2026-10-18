import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "The plain-language version: Trollverse stores your stuff in your browser, collects nothing by default, and cannot see your pranks. Here is exactly how it works.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Privacy</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Privacy policy, briefly and honestly</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Short version: your data stays in your browser. We do not have accounts, so we cannot
          look you up, and we do not want to.
        </p>
      </header>

      <div className="legal mt-8">
        <h2>What we store (in your browser only)</h2>
        <ul>
          <li>Your guest identity (a random handle and avatar seed) so the site feels personal.</li>
          <li>Saved chaos items, achievements, streaks, game scores and studio drafts.</li>
          <li>Your sound preference and similar settings.</li>
        </ul>
        <p>
          This lives in <strong>localStorage</strong> on your device. It is not encrypted (it does
          not need to be — it never leaves), and you can erase all of it from the{" "}
          <Link href="/profile">profile page</Link> in one click.
        </p>

        <h2>What we do not collect</h2>
        <ul>
          <li>No accounts, emails, names or phone numbers.</li>
          <li>No third-party analytics or advertising trackers.</li>
          <li>No cross-site tracking, no fingerprinting, no shadow profiles.</li>
          <li>No content of your pranks: share links carry the joke in the URL, and it is decoded by the recipient&apos;s browser, not our servers.</li>
        </ul>

        <h2>What the server sees</h2>
        <p>
          Like nearly every website, the server that delivers pages may see standard request
          metadata (IP address, user agent) in transit or in host logs. We do not build profiles
          from it and do not combine it with anything else. There is no analytics product wired
          into this site.
        </p>

        <h2>Files you upload (meme studio)</h2>
        <p>
          Images you add in the Meme Studio are processed entirely in your browser and are never
          uploaded anywhere. Same for doodles, exported cards and memes — they are created locally
          and saved only where you choose to save them.
        </p>

        <h2>Cookies</h2>
        <p>
          Trollverse works without tracking cookies. Manage preferences on the{" "}
          <Link href="/cookie-preferences">cookie preferences</Link> page — spoiler: there is
          nothing to opt out of, and we built the page anyway because pretending otherwise is worse.
        </p>

        <h2>Children</h2>
        <p>
          Trollverse is made for general audiences and includes a safety page. We do not knowingly
          collect personal information from anyone, including children, because we do not collect
          personal information at all.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy ever changes in a way that matters, the change will be described here in
          plain language. No burying anything in paragraph 47.
        </p>
      </div>
    </div>
  );
}
