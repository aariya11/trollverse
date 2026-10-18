"use client";

import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { Skeleton, Chip } from "@/components/ui/Bits";
import { copyText } from "@/lib/clipboard";
import {
  applyCompletion,
  currentStreak,
  getDailyChallenge,
  type StreakState,
} from "@/lib/content/daily";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { unlock } from "@/lib/achievements";
import { useClientValue } from "@/lib/hooks";

const KIND_LABEL: Record<"text" | "draw" | "friends" | "silly", string> = {
  text: "write it",
  draw: "draw it",
  friends: "bring a friend",
  silly: "be silly",
};

interface DailySnapshot {
  challenge: ReturnType<typeof getDailyChallenge>;
  streak: number;
  total: number;
  doneToday: boolean;
}

export function DailyCard() {
  const data = useClientValue<DailySnapshot | null>(() => {
    const challenge = getDailyChallenge();
    const state = readStore<StreakState>(STORE_KEYS.streak, { count: 0, lastKey: null, total: 0 });
    return {
      challenge,
      streak: currentStreak(state),
      total: state.total,
      doneToday: state.lastKey === challenge.dateKey,
    };
  }, () => null);
  const toast = useToast();
  const confetti = useConfetti();
  const sound = useSound();

  const complete = () => {
    if (!data || data.doneToday) return;
    const state = readStore<StreakState>(STORE_KEYS.streak, { count: 0, lastKey: null, total: 0 });
    const next = applyCompletion(state, data.challenge.dateKey);
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
    const text = `${data.challenge.text}\n\n— today's Trollverse chaos challenge`;
    const ok = await copyText(text);
    toast.push(
      ok
        ? { title: "Challenge copied", desc: "Send it to someone who needs structure in their life.", tone: "success" }
        : { title: "Couldn't copy", desc: "Clipboard unavailable in this browser.", tone: "warn" },
    );
  };

  if (!data) {
    return (
      <div className="rounded-3xl border-2 border-ink bg-paper p-6" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-8 w-full" />
        <Skeleton className="mt-3 h-8 w-2/3" />
        <Skeleton className="mt-6 h-10 w-40" />
      </div>
    );
  }

  const daily = data.challenge;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8"
      style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blush/70"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="rose">{KIND_LABEL[daily.kind]}</Chip>
          <Chip tone="paper">{daily.dateKey}</Chip>
          {data.streak > 0 ? <Chip tone="sage">streak: {data.streak} days</Chip> : null}
        </div>

        <p className="label-mono mt-5 text-rose-deep">Today&apos;s chaos</p>
        <h3 className="mt-2 text-2xl sm:text-3xl">{daily.text}</h3>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`btn ${data.doneToday ? "btn-sage" : "btn-primary"}`}
            onClick={complete}
            disabled={data.doneToday}
          >
            {data.doneToday ? "Done today ✓" : "I did it — mark complete"}
          </button>
          <button type="button" className="btn btn-paper" onClick={share}>
            Copy challenge
          </button>
          <Link href="/daily" className="btn btn-ghost">
            Full challenge page →
          </Link>
        </div>

        <p className="mt-4 font-mono text-xs text-ink-faint">
          {data.total > 0 ? `${data.total} challenge${data.total === 1 ? "" : "s"} completed so far. ` : ""}
          Streaks live in your browser — no account needed, nothing leaves your device.
        </p>
      </div>
    </div>
  );
}
