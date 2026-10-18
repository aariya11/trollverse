import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "How to reach the Trollverse project: bugs, ideas, press, or just a good joke you think belongs in the library.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Contact</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Say something nice, or useful</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Trollverse is a small indie project. There is no support ticket system and no chatbot —
          just a human on the other side of a form that does not exist yet.
        </p>
      </header>

      <div className="legal mt-8">
        <h2>How to reach us, honestly</h2>
        <p>
          This site intentionally ships without a contact form, because a form implies a backend
          that stores what you type — and the whole project is built to store nothing. Until a
          deliberately minimal contact channel exists, this page documents what to do instead:
        </p>
        <ul>
          <li>
            <strong>Found a bug?</strong> Note the page and roughly what happened. A screenshot of
            the weirdness helps. Bugs in generators usually come down to a specific prompt or seed —
            include the link you were on if you can.
          </li>
          <li>
            <strong>Have a joke or prompt for the library?</strong> Keep your best one warm. A
            submission channel is planned; when it opens it will be listed here first.
          </li>
          <li>
            <strong>Something felt unsafe or crossed a line?</strong> That is urgent and has a
            dedicated path: the <Link href="/report">report page</Link>.
          </li>
        </ul>

        <h2>What we will never ask you for</h2>
        <ul>
          <li>Your password, from any system, ever.</li>
          <li>Money, in any form, from any page of this site.</li>
          <li>Personal documents, ID numbers or payment details.</li>
        </ul>
        <p>
          If anything claiming to be Trollverse asks for these things, it is not us. That is worth
          remembering in general, not just here.
        </p>

        <h2>While you wait</h2>
        <p>
          The fastest way to improve Trollverse is to use it and enjoy it. The second fastest is to
          read the <Link href="/community-guidelines">community guidelines</Link> and prank someone
          responsibly today.
        </p>
      </div>
    </div>
  );
}
