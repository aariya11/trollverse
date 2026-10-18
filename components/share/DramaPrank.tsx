"use client";

import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { downloadCardImage } from "@/lib/cardImage";
import { copyText } from "@/lib/clipboard";
import type { DramaPayload } from "@/lib/share";
import { YourTurn } from "./ShareChrome";

export function DramaPrank({ payload }: { payload: DramaPayload }) {
  const toast = useToast();
  const sound = useSound();

  const download = async () => {
    await downloadCardImage(
      {
        variant: "drama",
        kicker: payload.kicker,
        title: payload.headline,
        body: payload.sub,
        quote: payload.quote,
        byline: payload.byline,
      },
      "trollverse-breaking.png",
    );
    sound.play("pop");
    toast.push({ title: "News graphic downloaded", desc: "Breaking news deserves to be framed.", tone: "success" });
  };

  const copyHeadline = async () => {
    await copyText(`${payload.kicker}\n${payload.headline}\n${payload.sub}`);
    toast.push({ title: "Headline copied", desc: "Breaking news travels fast.", tone: "success" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-ink text-cream" style={{ boxShadow: "8px 8px 0 0 var(--color-rose)" }}>
        <div className="flex items-center justify-between border-b border-cream/15 px-6 py-3">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-rose">
            <span className="h-2.5 w-2.5 animate-blink rounded-full bg-rose" aria-hidden="true" />
            live · developing · completely fictional
          </p>
          <p className="font-mono text-xs text-cream/50">TROLLVERSE NEWS NETWORK</p>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-sage">
            {payload.kicker}
          </p>
          <h1 className="mt-4 text-3xl leading-tight sm:text-5xl">{payload.headline}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/80">{payload.sub}</p>
          <blockquote className="mt-6 border-l-4 border-rose pl-4 text-sage">{payload.quote}</blockquote>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-cream/50">
            {payload.byline}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-cream/15 px-6 py-4">
          <button type="button" className="btn btn-sm btn-accent" onClick={download}>
            Download news graphic
          </button>
          <button type="button" className="btn btn-sm btn-sage" onClick={copyHeadline}>
            Copy headline
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        This broadcast is 100% fabricated. No real events, people or organizations are described.
      </p>

      <YourTurn>
        Somebody will absolutely believe this for ten whole seconds. You can manufacture that
        experience for anyone, free, in the Troll Lab.
      </YourTurn>
    </div>
  );
}
