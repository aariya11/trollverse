"use client";

import { useState } from "react";
import { useConfetti } from "@/components/ui/Confetti";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { Glyph } from "@/components/ui/Glyph";
import { downloadCardImage } from "@/lib/cardImage";
import type { CardPayload } from "@/lib/share";
import { YourTurn } from "./ShareChrome";

export function CardPrank({ payload }: { payload: CardPayload }) {
  const [open, setOpen] = useState(false);
  const confetti = useConfetti();
  const sound = useSound();
  const toast = useToast();
  const isCompliment = payload.tone === "compliment";

  const reveal = () => {
    setOpen(true);
    confetti.burst();
    sound.play(isCompliment ? "win" : "pop");
  };

  const download = async () => {
    await downloadCardImage(
      {
        variant: isCompliment ? "compliment" : "card",
        kicker: isCompliment ? "a nice thing" : "a message from the void",
        title: payload.title,
        body: payload.body,
        extra: payload.extra,
        from: payload.from,
      },
      "trollverse-card.png",
    );
    toast.push({ title: "Card downloaded", desc: "Screenshot culture, but classier.", tone: "success" });
  };

  if (!open) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-16 pt-6">
        <button
          type="button"
          onClick={reveal}
          className={`group relative w-full overflow-hidden rounded-3xl border-2 border-ink p-10 text-center transition-transform duration-200 hover:-translate-y-1 ${
            isCompliment ? "bg-sage-tint" : "bg-blush"
          }`}
          style={{ boxShadow: "8px 8px 0 0 var(--color-ink)" }}
        >
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-paper">
            <Glyph name={isCompliment ? "flower" : "orb"} className="h-8 w-8" />
          </span>
          <span className="block font-display text-2xl font-bold">
            {isCompliment ? "Someone sent you a nice thing" : "A card has arrived for you"}
          </span>
          <span className="mt-3 block text-sm text-ink-soft">
            Tap to open it. It is sealed with the finest pretend wax.
          </span>
          <span className="mt-6 inline-block rounded-full border-2 border-ink bg-paper px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-transform group-hover:scale-105">
            Open the card
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-6">
      <div
        className={`overflow-hidden rounded-3xl border-2 border-ink p-8 text-center animate-flip ${
          isCompliment ? "bg-sage-tint" : "bg-paper"
        }`}
        style={{ boxShadow: "8px 8px 0 0 var(--color-ink)" }}
      >
        <p className="label-mono text-rose-deep">
          {isCompliment ? "a nice thing, verified" : "the card reveals itself"}
        </p>
        <h1 className="mt-4 text-3xl">{payload.title}</h1>
        <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-base leading-relaxed text-ink-soft">
          {payload.body}
        </p>
        {payload.extra ? (
          <p className="mt-5 font-mono text-xs text-ink-faint">{payload.extra}</p>
        ) : null}
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
          {payload.from ? `from ${payload.from}` : "from a friend in the trollverse"}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-sm btn-primary" onClick={download}>
            Download as PNG
          </button>
          <button type="button" className="btn btn-sm btn-paper" onClick={reveal}>
            Send some confetti again
          </button>
        </div>
      </div>

      <YourTurn>
        {isCompliment
          ? "Kindness costs nothing and travels by link. Return the favor for someone who needs it today."
          : "You could make someone else open a mysterious card today. It takes about forty seconds in the Troll Lab."}
      </YourTurn>
    </div>
  );
}
