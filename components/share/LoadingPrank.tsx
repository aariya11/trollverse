"use client";

import { useEffect, useRef, useState } from "react";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { useReducedMotion } from "@/lib/hooks";
import { celebrate } from "@/lib/sound";
import type { LoadPayload } from "@/lib/share";
import { YourTurn } from "./ShareChrome";

export function LoadingPrank({ payload }: { payload: LoadPayload }) {
  const [index, setIndex] = useState(0);
  const [stalling, setStalling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const confetti = useConfetti();
  const sound = useSound();
  const reducedMotion = useReducedMotion();
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (revealed) return;

    const stepDelay = reducedMotion ? 380 : 1000;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];

    payload.steps.forEach((_, stepIndex) => {
      timers.current.push(
        window.setTimeout(() => {
          setIndex(stepIndex + 1);
          sound.play("tick");
        }, stepDelay * (stepIndex + 1)),
      );
    });

    const stallAt = stepDelay * payload.steps.length + 600;
    timers.current.push(
      window.setTimeout(() => setStalling(true), stallAt),
    );
    timers.current.push(
      window.setTimeout(
        () => {
          setStalling(false);
          setRevealed(true);
          sound.play("win");
          confetti.burst();
        },
        stallAt + (reducedMotion ? 400 : 2000),
      ),
    );

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, reducedMotion]);

  const progress = revealed ? 100 : stalling ? 91 : Math.min(88, Math.round((index / payload.steps.length) * 82) + 6);

  const skip = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    setIndex(payload.steps.length);
    setStalling(false);
    setRevealed(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <div className="rounded-3xl border-2 border-ink bg-ink p-6 text-cream sm:p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-rose)" }}>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-cream/60">
          Trollverse prank loader v9.2 · preparing something for{" "}
          <span className="text-rose">{payload.to}</span>
        </p>

        <div className="mt-6 h-3.5 overflow-hidden rounded-full border border-cream/25 bg-cream/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose to-sage transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right font-mono text-xs text-cream/60">{progress}%</p>

        <ul className="mt-6 min-h-36 space-y-2" aria-live="polite">
          {payload.steps.slice(0, index).map((step) => (
            <li key={step} className="flex items-start gap-2 font-mono text-xs text-cream/80 animate-rise">
              <span aria-hidden="true" className="text-sage">✓</span>
              {step}
            </li>
          ))}
          {stalling ? (
            <li className="flex items-center gap-2 font-mono text-xs text-rose">
              <span className="h-2 w-2 animate-blink rounded-full bg-rose" aria-hidden="true" />
              one moment… the gremlins are deliberating
            </li>
          ) : null}
        </ul>

        {!revealed ? (
          <button
            type="button"
            onClick={skip}
            className="mt-4 font-mono text-xs text-cream/50 underline underline-offset-4 transition-colors hover:text-cream"
          >
            skip to the reveal →
          </button>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-rose bg-cream p-5 text-ink animate-pop">
            <p className="label-mono text-rose-deep">The reveal</p>
            <h1 className="mt-2 text-2xl sm:text-3xl">{payload.finale.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{payload.finale.body}</p>
            <p className="mt-4 font-mono text-xs text-ink-faint">
              Nothing was downloaded. No files exist. The bar above was honest about being fake.
            </p>
            <button
              type="button"
              className="btn btn-sm btn-sage mt-4"
              onClick={() => {
                celebrate();
                sound.play("drumroll");
              }}
            >
              Celebrate anyway
            </button>
          </div>
        )}
      </div>

      {revealed ? (
        <YourTurn>
          You waited patiently — now it&apos;s your move. Build a prank for someone else, 100% free
          and nothing like those sketchy &quot;prank&quot; sites.
        </YourTurn>
      ) : null}
    </div>
  );
}
