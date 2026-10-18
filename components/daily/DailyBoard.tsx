"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Chip, Skeleton } from "@/components/ui/Bits";
import { useToast } from "@/components/ui/Toast";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { copyText } from "@/lib/clipboard";
import {
  applyCompletion,
  currentStreak,
  getDailyChallenge,
  getRecentChallenges,
  type Challenge,
  type StreakState,
} from "@/lib/content/daily";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { ACHIEVEMENTS, getUnlockedMap, unlock } from "@/lib/achievements";
import { useClientValue } from "@/lib/hooks";

type Daily = Challenge & { dateKey: string };

const KIND_LABEL: Record<Challenge["kind"], string> = {
  text: "write it",
  draw: "draw it",
  friends: "bring a friend",
  silly: "be silly",
};

const KIND_TONE: Record<Challenge["kind"], "rose" | "sage" | "blush" | "paper"> = {
  text: "paper",
  draw: "blush",
  friends: "sage",
  silly: "rose",
};

function timeUntilMidnightUtc(): string {
  const now = new Date();
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const diff = Math.max(0, next - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface DailySnapshot {
  today: Daily;
  recent: Daily[];
  streak: number;
  total: number;
  doneToday: boolean;
  trophies: number;
}

export function DailyBoard() {
  const data = useClientValue<DailySnapshot | null>(() => {
    const challenge = getDailyChallenge();
    const state = readStore<StreakState>(STORE_KEYS.streak, { count: 0, lastKey: null, total: 0 });
    return {
      today: challenge,
      recent: getRecentChallenges(7).slice(1),
      streak: currentStreak(state),
      total: state.total,
      doneToday: state.lastKey === challenge.dateKey,
      trophies: Object.keys(getUnlockedMap()).length,
    };
  }, () => null);

  const [countdown, setCountdown] = useState("");
  const toast = useToast();
  const confetti = useConfetti();
  const sound = useSound();

  useEffect(() => {
    const update = () => setCountdown(timeUntilMidnightUtc());
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  const complete = () => {
    if (!data || data.doneToday) return;
    const state = readStore<StreakState>(STORE_KEYS.streak, { count: 0, lastKey: null, total: 0 });
    const next = applyCompletion(state, data.today.dateKey);
    writeStore(STORE_KEYS.streak, next);
    unlock("nonsense-expert");
    if (next.count >= 3) unlock("streak-3");
    confetti.burst();
    sound.play("win");
    toast.push({
      title: `Day ${next.count} of chaos complete`,
      desc: next.count > 1 ? "Streak intact. Suspiciously consistent of you." : "Come back tomorrow for a fresh one.",
      tone: "success",
    });
  };

  const share = async () => {
    if (!data) return;
    const text = `${data.today.text}\n\n— today's Trollverse chaos challenge`;
    const ok = await copyText(text);
    toast.push(
      ok
        ? { title: "Challenge copied", desc: "Send it to someone who needs structure in their life.", tone: "success" }
        : { title: "Couldn't copy", desc: "Clipboard unavailable in this browser.", tone: "warn" },
    );
  };

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
      </div>
    );
  }

  const { today, recent, streak, total, doneToday, trophies } = data;

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={KIND_TONE[today.kind]}>{KIND_LABEL[today.kind]}</Chip>
          <Chip tone="paper">{today.dateKey}</Chip>
          {streak > 0 ? <Chip tone="sage">streak: {streak} days</Chip> : null}
        </div>

        <p className="label-mono mt-5 text-rose-deep">Today&apos;s chaos challenge</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">{today.text}</h2>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" className={`btn ${doneToday ? "btn-sage" : "btn-primary"}`} onClick={complete} disabled={doneToday}>
            {doneToday ? "Done today ✓" : "I did it — mark complete"}
          </button>
          <button type="button" className="btn btn-paper" onClick={share}>
            Copy challenge
          </button>
          {today.kind === "draw" ? (
            <Link href="/draw" className="btn btn-blush">
              Open Doodle Studio →
            </Link>
          ) : null}
          {today.kind === "friends" ? (
            <Link href="/troll-lab" className="btn btn-blush">
              Open Troll Lab →
            </Link>
          ) : null}
        </div>

        <p className="mt-5 font-mono text-xs text-ink-faint">
          Next challenge in {countdown || "--:--:--"} (midnight UTC — a chaos calendar has to pick a timezone).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Current streak</p>
          <p className="mt-2 font-display text-4xl font-bold">{streak}</p>
          <p className="mt-1 text-xs text-ink-faint">days in a row</p>
        </div>
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Total completed</p>
          <p className="mt-2 font-display text-4xl font-bold">{total}</p>
          <p className="mt-1 text-xs text-ink-faint">across all sessions</p>
        </div>
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Trophies</p>
          <p className="mt-2 font-display text-4xl font-bold">
            {trophies}
            <span className="text-xl text-ink-faint">/{ACHIEVEMENTS.length}</span>
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            <Link className="link-underline" href="/profile">see all achievements</Link>
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl">The last week in prompts</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Past challenges, deterministically generated — the same list you would have seen back
          then. Completion is tracked from today only; we do not keep a diary of your misses.
        </p>
        <ul className="mt-5 space-y-3">
          {recent.map((entry) => (
            <li
              key={entry.dateKey}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-faint">{entry.dateKey}</p>
                <p className="mt-1 text-sm font-semibold">{entry.text}</p>
              </div>
              <Chip tone={KIND_TONE[entry.kind]}>{KIND_LABEL[entry.kind]}</Chip>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
