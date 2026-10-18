"use client";

import { useState } from "react";
import Link from "next/link";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { getQuizPack } from "@/lib/content/quizzes";
import type { QuizPayload } from "@/lib/share";

export function QuizPrank({ payload }: { payload: QuizPayload }) {
  const pack = getQuizPack(payload.pack);
  const challengedResult = pack.results[Math.min(payload.got, pack.results.length - 1)];
  const [myResult, setMyResult] = useState<number | null>(null);
  const confetti = useConfetti();
  const sound = useSound();

  const verdict =
    myResult === null
      ? null
      : myResult === payload.got
        ? "Identical results. This is either destiny or a group project."
        : Math.abs(myResult - payload.got) >= 2
          ? "Wildly different results. The rivalry starts now."
          : "Close results. One of you is being politely unpredictable.";

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-6">
      <div className="rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
        <p className="label-mono text-rose-deep">A challenge from {payload.from ?? payload.to}</p>
        <h1 className="mt-3 text-3xl">{pack.title}</h1>

        <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/25 bg-cream px-5 py-4">
          <p className="text-sm text-ink-soft">
            {payload.from ? `${payload.from} already took it` : "They already took it"} and got:
          </p>
          <p className="mt-1 font-display text-xl font-bold text-rose-deep">{challengedResult.title}</p>
          <p className="mt-1 text-xs text-ink-faint">{challengedResult.desc}</p>
        </div>

        {myResult === null ? (
          <div className="mt-6">
            <QuizRunner
              pack={pack}
              playerLabel="You"
              onDone={(index) => {
                setMyResult(index);
                confetti.burst();
                sound.play("win");
              }}
            />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-ink bg-blush p-5 text-center animate-pop">
            <p className="label-mono text-rose-deep">Verdict</p>
            <p className="mt-2 text-lg font-bold">{verdict}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/troll-lab?tab=quiz" className="btn btn-sm btn-primary">
                Challenge them back
              </Link>
              <Link href="/chaos?spin=1" className="btn btn-sm btn-paper">
                Spin the chaos engine
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        Results are scientifically meaningless and that is the entire point.
      </p>
    </div>
  );
}
