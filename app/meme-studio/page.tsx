import type { Metadata } from "next";
import { MemeEditor } from "@/components/studio/MemeEditor";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Meme Studio",
  description:
    "Make memes in a fully local canvas editor: pastel templates, draggable captions, your own uploaded image, one-click PNG export. Nothing is uploaded — everything happens in your browser.",
  path: "/meme-studio",
});

export default function MemeStudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="label-mono text-rose-deep">Meme studio</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">Professionally unserious</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Pick a pastel template, drop captions wherever you like, add your own image if you want,
          and export a crisp PNG. Your image never leaves this device — it is drawn entirely in
          your browser and forgotten the moment you close the tab.
        </p>
      </header>

      <div className="mt-10">
        <MemeEditor />
      </div>

      <p className="mt-10 max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
        Honest limits: the exported PNG is square (1080×1080) so it fits feeds nicely. Caption
        drafts save to this browser only, text-only — uploaded images are too large to keep in
        local storage. There is no cloud, no upload, no account, no drama.
      </p>
    </div>
  );
}
