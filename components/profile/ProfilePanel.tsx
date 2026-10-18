"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/site/Avatar";
import { Chip, EmptyState, Skeleton } from "@/components/ui/Bits";
import { Glyph } from "@/components/ui/Glyph";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { ACHIEVEMENTS, getUnlockedMap } from "@/lib/achievements";
import { ensureGuest, generateGuest, readGuest, type GuestIdentity } from "@/lib/guest";
import { listSaved, removeSaved, type SavedItem } from "@/lib/saves";
import { currentStreak, type StreakState } from "@/lib/content/daily";
import {
  clearAllTrollverseData,
  estimateStorageBytes,
  readStore,
  STORE_KEYS,
  writeStore,
} from "@/lib/storage";
import { useClientValue } from "@/lib/hooks";

interface ProfileSnapshot {
  guest: GuestIdentity | null;
  unlocked: Record<string, number>;
  saved: SavedItem[];
  streak: number;
  total: number;
  bestGremlins: number;
  doomPresses: number;
  bytes: number;
}

export function ProfilePanel() {
  const data = useClientValue<ProfileSnapshot | null>(() => {
    const streakState = readStore<StreakState>(STORE_KEYS.streak, { count: 0, lastKey: null, total: 0 });
    const scores = readStore<Record<string, number>>(STORE_KEYS.gameScores, {});
    return {
      guest: readGuest(),
      unlocked: getUnlockedMap(),
      saved: listSaved(),
      streak: currentStreak(streakState),
      total: streakState.total,
      bestGremlins: scores.gremlin ?? 0,
      doomPresses: readStore<number>(STORE_KEYS.doomPresses, 0),
      bytes: estimateStorageBytes(),
    };
  }, () => null);

  const [confirmErase, setConfirmErase] = useState(false);
  const toast = useToast();
  const sound = useSound();

  useEffect(() => {
    if (data && !data.guest) {
      ensureGuest();
    }
  }, [data]);

  const rerollIdentity = useCallback(() => {
    const next = generateGuest();
    writeStore(STORE_KEYS.guest, next);
    sound.play("pop");
    toast.push({
      title: `Hello, ${next.handle}`,
      desc: "Fresh identity, same excellent taste in websites.",
      tone: "success",
    });
  }, [sound, toast]);

  const eraseAll = () => {
    if (!confirmErase) {
      setConfirmErase(true);
      window.setTimeout(() => setConfirmErase(false), 4000);
      return;
    }
    clearAllTrollverseData();
    setConfirmErase(false);
    sound.play("whoosh");
    toast.push({
      title: "All local data erased",
      desc: "Achievements, saved chaos, streaks and scores — gone. A clean slate.",
      tone: "info",
    });
  };

  if (!data || !data.guest) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  const { guest, unlocked, saved, streak, total, bestGremlins, doomPresses, bytes } = data;
  const unlockedCount = Object.keys(unlocked).length;

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
        <div className="flex flex-wrap items-center gap-5">
          <Avatar seed={guest.seed} size={84} />
          <div className="min-w-0 flex-1">
            <p className="label-mono text-rose-deep">Guest identity</p>
            <h2 className="mt-1 break-words text-2xl sm:text-3xl">{guest.handle}</h2>
            <p className="mt-1 font-mono text-xs text-ink-faint">
              Created {new Date(guest.createdAt).toLocaleDateString()} · lives in this browser only
            </p>
          </div>
          <button type="button" className="btn btn-sm btn-paper" onClick={rerollIdentity}>
            Reroll identity
          </button>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">
          This is a local placeholder, not an account: no email, no password, and nothing is ever
          sent to a server. Real accounts and friend lists are not built — this space intentionally
          says so instead of pretending.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Current streak</p>
          <p className="mt-2 font-display text-4xl font-bold">{streak}</p>
          <p className="mt-1 text-xs text-ink-faint">days · {total} total challenges</p>
        </div>
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Gremlin best</p>
          <p className="mt-2 font-display text-4xl font-bold">{bestGremlins}</p>
          <p className="mt-1 text-xs text-ink-faint">
            <Link className="link-underline" href="/games">play again</Link>
          </p>
        </div>
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Button presses</p>
          <p className="mt-2 font-display text-4xl font-bold">{doomPresses}</p>
          <p className="mt-1 text-xs text-ink-faint">across all timelines</p>
        </div>
        <div className="tile text-center">
          <p className="label-mono text-rose-deep">Saved chaos</p>
          <p className="mt-2 font-display text-4xl font-bold">{saved.length}</p>
          <p className="mt-1 text-xs text-ink-faint">items in your stash</p>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl">Achievements</h2>
          <Chip tone="sage">
            {unlockedCount}/{ACHIEVEMENTS.length} unlocked
          </Chip>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((achievement) => {
            const at = unlocked[achievement.id];
            return (
              <li
                key={achievement.id}
                className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3 ${
                  at ? "border-ink bg-sage-tint" : "border-ink/20 bg-paper/70 opacity-70"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                    at ? "border-ink bg-rose" : "border-ink/30 bg-cream"
                  }`}
                  aria-hidden="true"
                >
                  <Glyph name={achievement.glyph} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold">{achievement.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{achievement.desc}</p>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
                    {at ? `unlocked ${new Date(at).toLocaleDateString()}` : "locked"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl">Saved chaos stash</h2>
        {saved.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              glyph={<Glyph name="orb" className="h-10 w-10 text-rose-deep" />}
              title="Nothing saved yet"
              body="Spin the chaos engine and hit Save on anything worth keeping. Your stash lives here, in this browser."
              action={
                <Link href="/chaos" className="btn btn-sm btn-primary">
                  Go cause some chaos
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {saved.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
                    {item.kind} · {item.category} · {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{item.body}</p>
                </div>
                <button
                  type="button"
                  className="chip bg-paper hover:bg-rose-tint"
                  onClick={() => removeSaved(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border-2 border-rose-deep bg-rose-tint p-6" style={{ boxShadow: "4px 4px 0 0 var(--color-rose-deep)" }}>
        <h2 className="text-2xl">Danger zone, mild edition</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Everything Trollverse knows about you is stored in this browser ({Math.max(1, Math.round(bytes / 1024))} KB right now).
          Erasing it is instant and permanent — which is also the point.
        </p>
        <button
          type="button"
          className={`btn mt-4 ${confirmErase ? "btn-accent" : "btn-paper"}`}
          onClick={eraseAll}
        >
          {confirmErase ? "Click again to really erase everything" : "Erase all local data"}
        </button>
      </section>
    </div>
  );
}
