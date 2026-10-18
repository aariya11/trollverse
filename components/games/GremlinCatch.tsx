"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { unlock, type AchievementGlyph } from "@/lib/achievements";
import { Glyph } from "@/components/ui/Glyph";
import { useClientValue } from "@/lib/hooks";

const ROUND_SECONDS = 30;
const GRID_CELLS = 9;
const GLYPHS: Array<AchievementGlyph> = ["blob", "spiral", "zigzag", "bolt", "flower", "star"];
const CELL_TINTS = ["bg-paper", "bg-cream", "bg-blush/60", "bg-sage-tint", "bg-paper", "bg-cream"];

interface Gremlin {
  id: number;
  cell: number;
  glyph: AchievementGlyph;
}

type Phase = "idle" | "playing" | "over";

function gradeFor(score: number): string {
  if (score >= 15) return "Gremlin whisperer. They recognize you now.";
  if (score >= 10) return "Certified wrangler. The gremlins respect the hustle.";
  if (score >= 5) return "Solid effort. The gremlins are merely annoyed.";
  return "The gremlins won this round. They send their regards.";
}

export function GremlinCatch() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [gremlins, setGremlins] = useState<Gremlin[]>([]);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [missCell, setMissCell] = useState<number | null>(null);
  const best = useClientValue<number>(
    () => readStore<Record<string, number>>(STORE_KEYS.gameScores, {}).gremlin ?? 0,
    () => 0,
  );
  const gremlinIdRef = useRef(0);
  const scoreRef = useRef(0);
  const secondsRef = useRef(ROUND_SECONDS);
  const activeRef = useRef(0);
  const timeoutsRef = useRef<Map<number, number>>(new Map());
  const intervalRefs = useRef<number[]>([]);
  const toast = useToast();
  const confetti = useConfetti();
  const sound = useSound();

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current.clear();
    intervalRefs.current.forEach((interval) => window.clearInterval(interval));
    intervalRefs.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const removeGremlin = useCallback((id: number) => {
    activeRef.current = Math.max(0, activeRef.current - 1);
    setGremlins((prev) => prev.filter((gremlin) => gremlin.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const spawnGremlin = useCallback(() => {
    if (activeRef.current >= 3) return;
    activeRef.current += 1;
    const id = ++gremlinIdRef.current;
    const cell = Math.floor(Math.random() * GRID_CELLS);
    const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    setGremlins((prev) => [...prev, { id, cell, glyph }]);
    const timeout = window.setTimeout(() => removeGremlin(id), 950 + Math.random() * 650);
    timeoutsRef.current.set(id, timeout);
  }, [removeGremlin]);

  const endRound = useCallback(
    (finalScore: number) => {
      clearTimers();
      activeRef.current = 0;
      setGremlins([]);
      setPhase("over");
      sound.play("drumroll");

      const scores = readStore<Record<string, number>>(STORE_KEYS.gameScores, {});
      if (finalScore > (scores.gremlin ?? 0)) {
        scores.gremlin = finalScore;
        writeStore(STORE_KEYS.gameScores, scores);
      }

      if (finalScore >= 10) {
        unlock("gremlin-wrangler");
        confetti.burst();
        sound.play("win");
        toast.push({ title: `Caught ${finalScore} gremlins`, desc: "Double digits. They will tell stories about you.", tone: "success" });
      } else {
        toast.push({ title: `Round over — ${finalScore} gremlins caught`, desc: gradeFor(finalScore), tone: "info" });
      }
    },
    [clearTimers, confetti, sound, toast],
  );

  const startRound = useCallback(() => {
    clearTimers();
    gremlinIdRef.current = 0;
    scoreRef.current = 0;
    secondsRef.current = ROUND_SECONDS;
    activeRef.current = 0;
    setScore(0);
    setSecondsLeft(ROUND_SECONDS);
    setGremlins([]);
    setMissCell(null);
    setPhase("playing");
    sound.play("whoosh");

    const spawnInterval = window.setInterval(spawnGremlin, 620);
    intervalRefs.current.push(spawnInterval);
  }, [clearTimers, spawnGremlin, sound]);

  useEffect(() => {
    if (phase !== "playing") return;
    const tick = window.setInterval(() => {
      const next = Math.max(0, secondsRef.current - 1);
      secondsRef.current = next;
      setSecondsLeft(next);
      if (next === 0) {
        window.clearInterval(tick);
        endRound(scoreRef.current);
      }
    }, 1000);
    return () => window.clearInterval(tick);
  }, [phase, endRound]);

  const catchGremlin = (cell: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (phase !== "playing") return;
    const target = gremlins.find((gremlin) => gremlin.cell === cell);
    if (target) {
      removeGremlin(target.id);
      scoreRef.current += 1;
      setScore(scoreRef.current);
      sound.play("pop");
      confetti.burst({ x: event.clientX, y: event.clientY, count: 14 });
    } else {
      sound.play("boop");
      setMissCell(cell);
      window.setTimeout(() => setMissCell(null), 320);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-mono text-rose-deep">Gremlin catch</p>
          <h2 className="mt-2 text-2xl sm:text-3xl">Thirty seconds. Three gremlins max.</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Gremlins pop out of the tiles. Tap them before they vanish. They are harmless, chaotic
            and mildly judgmental.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2 text-center">
            <p className="label-mono text-ink-soft">Score</p>
            <p className="font-mono text-xl font-bold tabular-nums">{score}</p>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-sage-tint px-4 py-2 text-center">
            <p className="label-mono text-ink-soft">Best</p>
            <p className="font-mono text-xl font-bold tabular-nums">{best}</p>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-blush px-4 py-2 text-center" aria-live="polite">
            <p className="label-mono text-ink-soft">Time</p>
            <p className="font-mono text-xl font-bold tabular-nums">{secondsLeft}s</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: GRID_CELLS }, (_, cell) => {
            const gremlin = gremlins.find((entry) => entry.cell === cell);
            return (
              <button
                key={cell}
                type="button"
                onClick={(event) => catchGremlin(cell, event)}
                aria-label={gremlin ? "Catch this gremlin" : "Empty tile"}
                className={`flex aspect-square items-center justify-center rounded-2xl border-2 border-ink transition-transform duration-100 ${
                  CELL_TINTS[cell]
                } ${gremlin ? "hover:-translate-y-0.5" : ""} ${missCell === cell ? "animate-shake bg-rose-tint" : ""}`}
                style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
              >
                {gremlin ? (
                  <span className="animate-pop text-rose-deep">
                    <Glyph name={gremlin.glyph} className="h-10 w-10 sm:h-14 sm:w-14" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {phase !== "playing" ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-ink/50 p-4">
            <div className="max-w-sm rounded-3xl border-2 border-ink bg-paper p-6 text-center animate-pop" style={{ boxShadow: "5px 5px 0 0 var(--color-ink)" }}>
              {phase === "idle" ? (
                <>
                  <p className="label-mono text-rose-deep">Ready?</p>
                  <p className="mt-2 text-lg font-bold">Tap gremlins. Avoid dignity loss.</p>
                </>
              ) : (
                <>
                  <p className="label-mono text-rose-deep">Round over</p>
                  <p className="mt-2 text-lg font-bold">{score} gremlins caught</p>
                  <p className="mt-1 text-sm text-ink-soft">{gradeFor(score)}</p>
                </>
              )}
              <button type="button" className="btn btn-sm btn-primary mt-5" onClick={startRound}>
                {phase === "idle" ? "Start the round" : "Play again"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
