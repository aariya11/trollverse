import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Community Guidelines",
  description:
    "The ten rules of the Trollverse playground. Funny is the goal, harm is never. Read these before you send a prank to anyone.",
  path: "/community-guidelines",
});

const RULES: Array<{ title: string; body: string }> = [
  {
    title: "Punch situations, never people",
    body: "The comedy is in the predicament — a fake loading screen, a silly award, an absurd quiz. If the joke requires a victim to feel genuinely bad, it is not a joke we host.",
  },
  {
    title: "Both of you should laugh in the end",
    body: "The correct test for a prank link: when the reveal lands, would the recipient laugh and want to prank back? If you are not sure, pick a gentler prank.",
  },
  {
    title: "No fear, no fake emergencies",
    body: "No fake police, hospital, bank, delivery-service, security-breach or emergency messaging. Ever. Not as a joke, not as a test, not as an experiment.",
  },
  {
    title: "No impersonation of real people",
    body: "Do not sign pranks as someone real in a way that misleads. Nicknames, characters and honest mystery are all fine — identity deception is not.",
  },
  {
    title: "No money, no data",
    body: "Never use the tools to ask anyone for payments, passwords, card details or personal documents. Every Trollverse page is designed to have nothing to steal.",
  },
  {
    title: "Keep it publishable",
    body: "No sexual content, no hate, no threats, no harassment, nothing targeting minors, no illegal activity.",
  },
  {
    title: "Sharing happens on your side",
    body: "Pranks live in links that you send. That means you own the outcome in your social circle. Sending to a group chat you are not part of is a bad start.",
  },
  {
    title: "Respect the reveal",
    body: "Every prank ends with an honest reveal and a way to prank back. Do not rebuild these tools to hide the reveal — that defeats the entire site.",
  },
  {
    title: "One prank per friend per day, ideally",
    body: "Economy matters. A friend who is delighted by your third prank of the morning is rarer than a friend who is tired. Read the room.",
  },
  {
    title: "When in doubt, ask",
    body: "If a prank idea feels borderline, it probably is. Choose another one from the lab. There is an endless supply, and every single one is harmless by design.",
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Community</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Community guidelines</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Ten rules, one test, zero tolerance for cruelty. These guidelines are part of the fun, not
          a legal appendix.
        </p>
      </header>

      <ol className="mt-10 space-y-4">
        {RULES.map((rule, index) => (
          <li key={rule.title} className="flex gap-4 rounded-3xl border-2 border-ink/15 bg-paper p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-rose font-mono text-sm font-bold">
              {index + 1}
            </span>
            <div>
              <h2 className="text-lg font-bold">{rule.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{rule.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-ink-soft">
        Saw something that violates these rules? The <Link href="/report" className="link-underline">report page</Link>{" "}
        exists precisely for that. And if you are unsure whether your idea is fine, the{" "}
        <Link href="/safety" className="link-underline">safety guide</Link> walks through real examples.
      </p>
    </div>
  );
}
