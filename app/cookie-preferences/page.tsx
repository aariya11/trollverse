import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Cookie Preferences",
  description:
    "Trollverse uses no tracking cookies. This page exists anyway, so you can see exactly what is stored in your browser and clear it in one click.",
  path: "/cookie-preferences",
});

export default function CookiePreferencesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="label-mono text-rose-deep">Cookies</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Cookie preferences, refreshingly short</h1>
      </header>

      <div className="legal mt-8">
        <h2>The full inventory</h2>
        <ul>
          <li>
            <strong>Tracking cookies:</strong> none. Not one.
          </li>
          <li>
            <strong>Advertising cookies:</strong> none. No ads exist to require them.
          </li>
          <li>
            <strong>Analytics cookies:</strong> none. No analytics product is loaded.
          </li>
          <li>
            <strong>Essential storage:</strong> your browser&apos;s localStorage, used to remember
            your guest identity, saved chaos, streaks, achievements, scores and studio drafts. This
            is not a cookie, is never transmitted, and exists purely so the site works as expected
            between visits.
          </li>
        </ul>

        <h2>Why this page exists at all</h2>
        <p>
          Because pretending to offer choices you do not have is a small dishonesty, and doing the
          opposite — offering no transparency because there is nothing to disclose — is also worse
          than just saying it plainly. You are reading the whole policy right now. That is it.
        </p>

        <h2>How to clear your local storage</h2>
        <p>
          Two ways, both instant:
        </p>
        <ul>
          <li>
            Use the erase button on your <Link href="/profile">profile page</Link>, which removes
            everything Trollverse has stored in this browser.
          </li>
          <li>
            Or use your browser&apos;s own site-data settings — clearing site data for this domain
            achieves the same thing, with the same result.
          </li>
        </ul>

        <h2>What happens after clearing</h2>
        <p>
          You get a fresh guest identity, empty achievements, empty stash and a clean streak. No
          account, no email, no &ldquo;are you sure you want to lose your progress&rdquo; ceremony.
          It is your data, so deleting it is your call, done at your speed — immediately.
        </p>
      </div>
    </div>
  );
}
