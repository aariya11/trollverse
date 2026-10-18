"use client";

import { useState } from "react";
import { useConfetti } from "@/components/ui/Confetti";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { downloadCardImage } from "@/lib/cardImage";
import { copyText } from "@/lib/clipboard";
import type { AwardPayload } from "@/lib/share";
import { YourTurn } from "./ShareChrome";

export function AwardPrank({ payload }: { payload: AwardPayload }) {
  const [claimed, setClaimed] = useState(false);
  const confetti = useConfetti();
  const sound = useSound();
  const toast = useToast();

  const claim = () => {
    setClaimed(true);
    confetti.burst();
    sound.play("win");
  };

  const download = async () => {
    await downloadCardImage(
      {
        variant: "award",
        kicker: "official-ish certificate",
        title: payload.to,
        body: `${payload.award}.\n${payload.reason}`,
        from: payload.from,
      },
      "trollverse-award.png",
    );
    sound.play("pop");
    toast.push({ title: "PNG downloaded", desc: "Frame it. Laminate it. You've earned this, sort of.", tone: "success" });
  };

  const copy = async () => {
    await copyText(`${payload.to} is officially: ${payload.award} — ${payload.reason}`);
    toast.push({ title: "Citation copied", desc: "Paste it wherever the recognition is needed.", tone: "success" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <div
        className={`relative overflow-hidden rounded-3xl border-2 border-ink bg-blush p-6 text-center sm:p-10 ${claimed ? "" : "cursor-pointer"}`}
        style={{ boxShadow: "8px 8px 0 0 var(--color-ink)" }}
        onClick={!claimed ? claim : undefined}
      >
        <div aria-hidden="true" className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-rose/30 blur-xl" />
        <div aria-hidden="true" className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full bg-sage/30 blur-xl" />

        <p className="label-mono text-rose-deep">Official-ish certificate of excellence</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">An award for {payload.to}</h1>

        {!claimed ? (
          <>
            <p className="mx-auto mt-4 max-w-sm text-sm text-ink-soft">
              The Bureau of Extremely Specific Recognition has reviewed your case. Tap the
              certificate to claim it.
            </p>
            <button type="button" className="btn btn-accent mt-6" onClick={claim}>
              Claim my award
            </button>
          </>
        ) : (
          <div className="animate-pop">
            <p className="mt-6 font-display text-3xl font-extrabold text-rose-deep sm:text-4xl">
              {payload.award}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">{payload.reason}</p>
            <p className="mt-5 font-mono text-xs text-ink-faint">
              {payload.from ? `Awarded by ${payload.from}` : "Awarded by an anonymous menace"} · fully
              made up · completely deserved
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn btn-sm btn-primary" onClick={download}>
                Download PNG
              </button>
              <button type="button" className="btn btn-sm btn-paper" onClick={copy}>
                Copy citation
              </button>
            </div>
          </div>
        )}
      </div>

      {claimed ? (
        <YourTurn>
          This certificate was generated from a link, with zero accounts involved. Return the favor
          — someone you know is secretly a Professional Overthinker.
        </YourTurn>
      ) : null}
    </div>
  );
}
