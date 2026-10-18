import type { Metadata } from "next";
import Link from "next/link";
import { TABS_INFO } from "./data";

export const metadata: Metadata = {
  title: "Prank Links",
  description:
    "How Trollverse prank links work: the whole joke travels inside the URL, decoded in the recipient's browser. No accounts, no tracking, no storage.",
  robots: { index: false, follow: true },
};

export default function PrankLinksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Troll Lab documentation, human edition</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Prank links, explained honestly</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Every prank you build in the Troll Lab packs itself into the link — like a joke folded
          into an envelope. Open the link, and your browser unfolds the envelope. Simple, private,
          and impossible to leave lying around on a server.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {TABS_INFO.map((tab) => (
          <Link key={tab.href} href={tab.href} className="tile block">
            <h2 className="text-xl">{tab.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tab.blurb}</p>
            <span className="mt-3 inline-block font-mono text-xs font-bold uppercase tracking-[0.14em] text-rose-deep">
              Open example →
            </span>
          </Link>
        ))}
      </div>

      <section className="legal mt-12">
        <h2>What a prank link can never do</h2>
        <ul>
          <li>It never downloads files or installs anything. It is a web page with jokes.</li>
          <li>It never asks for passwords, payments, or personal information. There are no forms.</li>
          <li>It never imitates real banks, governments, hospitals or security systems.</li>
          <li>It never collects analytics about the person who opens it.</li>
          <li>It never impersonates a real person — the humor is in the situation, not the identity.</li>
        </ul>

        <h2>Why the links are so long</h2>
        <p>
          The content lives in the link itself, so a bigger prank means a longer link. That is the
          honest trade-off for storing nothing on a server. Every share page reveals it was a prank
          and points the recipient to the Troll Lab so they can retaliate appropriately.
        </p>

        <h2>What about anonymity?</h2>
        <p>
          You can sign pranks with any name you like, or none at all. We do not claim perfect
          anonymity anywhere on this site — a good friend might recognize your handwriting of
          chaos. Be kind, be funny, and never scare anyone on purpose.
        </p>
      </section>
    </div>
  );
}
