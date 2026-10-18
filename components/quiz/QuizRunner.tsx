"use client";

import { useState } from "react";
import { scoreToResultIndex, type QuizPack } from "@/lib/content/quizzes";
import { Glyph } from "@/components/ui/Glyph";
import { useSound } from "@/components/providers/SoundProvider";

export function QuizRunner({
  pack,
  playerLabel = "You",
  onDone,
}: {
  pack: QuizPack;
  playerLabel?: string;
  onDone?: (resultIndex: number, score: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const sound = useSound();

  const question = pack.questions[step];
  const resultIndex = scoreToResultIndex(pack, score);
  const result = pack.results[resultIndex];

  const answer = (weight: number) => {
    sound.play("click");
    const nextScore = score + weight;
    setScore(nextScore);
    if (step + 1 >= pack.questions.length) {
      setDone(true);
      sound.play("win");
      onDone?.(scoreToResultIndex(pack, nextScore), nextScore);
    } else {
      setStep(step + 1);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border-2 border-ink bg-blush p-6 text-center animate-pop" style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}>
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-paper">
          <Glyph name={result.glyph} className="h-7 w-7" />
        </span>
        <p className="label-mono text-rose-deep">{playerLabel}&apos;s result</p>
        <h3 className="mt-2 text-2xl">{result.title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{result.desc}</p>
        <p className="mt-4 font-mono text-xs text-ink-faint">score {score} / {pack.questions.length * 3} · result is scientifically meaningless</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-ink bg-paper p-6" style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}>
      <div className="flex items-center justify-between gap-4">
        <p className="label-mono text-rose-deep">{pack.title}</p>
        <p className="label-mono text-ink-faint">
          {step + 1} / {pack.questions.length}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full border border-ink/30 bg-cream">
        <div
          className="h-full bg-rose transition-[width] duration-300"
          style={{ width: `${(step / pack.questions.length) * 100}%` }}
        />
      </div>
      <h3 className="mt-5 text-xl leading-snug">{question.q}</h3>
      <div className="mt-4 grid gap-2.5">
        {question.options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => answer(option.weight)}
            className="rounded-2xl border-2 border-ink/25 bg-cream px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-ink hover:bg-blush/70"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
