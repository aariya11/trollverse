import type { Metadata } from "next";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Your Guest Profile",
  description:
    "Your local Trollverse identity: achievements, saved chaos, streaks and game scores — all stored in your browser, exportable to nothing, deletable in one click.",
  path: "/profile",
});

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Your corner of the void</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">Guest profile</h1>
        <p className="mt-4 text-lg text-ink-soft">
          No sign-up, no email, no password to forget. Your identity here is a randomized handle, an
          avatar, and whatever nonsense you have collected along the way.
        </p>
      </header>

      <div className="mt-10">
        <ProfilePanel />
      </div>
    </div>
  );
}
