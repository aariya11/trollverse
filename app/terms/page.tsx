import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "The rules of the playground, in readable English: use Trollverse for harmless fun, do not weaponize the prank tools, and understand what this free site does and does not promise.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Terms</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Terms of use, minus the fog machine</h1>
      </header>

      <div className="legal mt-8">
        <p>
          By using Trollverse you agree to the following. It is deliberately short, because the
          rules are deliberate: be playful, be harmless, do not be a jerk.
        </p>

        <h2>1. The spirit of the site</h2>
        <p>
          Trollverse is for harmless fun between people who will both laugh. Pranking a friend is
          welcome. Using these tools to deceive, frighten, harass, defraud or harm anyone is
          prohibited and contrary to everything this site is for.
        </p>

        <h2>2. Prohibited uses</h2>
        <ul>
          <li>Impersonating real people, brands, banks, governments, delivery companies, hospitals or security systems in a way that could be believed in the moment.</li>
          <li>Creating content that is threatening, hateful, harassing, sexual, or targets minors.</li>
          <li>Fake emergencies, fake prizes requiring payment, phishing-style pages, or anything designed to extract information or money.</li>
          <li>Using the tools to break any law, including laws against fraud, harassment or computer misuse.</li>
        </ul>

        <h2>3. Your content, your responsibility</h2>
        <p>
          Everything you create is created locally and shared by you. You are responsible for the
          links you send and where you send them. Trollverse cannot see, moderate or recall a link
          once it is out — which is also why you should think before sending.
        </p>

        <h2>4. No promises of perfection</h2>
        <p>
          Trollverse is provided free, as-is and as-available, with no warranty of any kind. It may
          change, break, move or retire at any time without notice. To the maximum extent permitted
          by law, Trollverse and its makers are not liable for any damages arising from your use of
          the site.
        </p>

        <h2>5. Removal</h2>
        <p>
          If Trollverse becomes aware of content or behavior that clearly violates these terms or
          the <Link href="/community-guidelines">community guidelines</Link>, we may block access.
          Because pranks live in links rather than on servers, the main enforcement is access to the
          site itself.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          The written content, designs and code of Trollverse belong to the project. What you make
          with the studios — your memes, doodles, pranks and cards — is yours. Use it anywhere.
        </p>

        <h2>7. Changes to these terms</h2>
        <p>
          These terms may be updated. Material changes will be reflected here with a clear note.
          Continuing to use the site after changes means you accept the updated terms.
        </p>

        <h2>8. Safety and reporting</h2>
        <p>
          Deeply serious stuff has a home here too: the <Link href="/safety">safety guide</Link> and{" "}
          the <Link href="/report">reporting page</Link> explain how the tools are designed to stay
          harmless, and where to raise concerns.
        </p>
      </div>
    </div>
  );
}
