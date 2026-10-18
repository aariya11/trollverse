import { mulberry32 } from "../rng";
import { CHALLENGES, type Challenge } from "./challenges";

export type { Challenge };

const EPOCH_UTC = Date.UTC(2024, 0, 1);

export function dayNumber(date: Date = new Date()): number {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utc - EPOCH_UTC) / 86400000);
}

export function dateKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDailyChallenge(date: Date = new Date()): Challenge & { dateKey: string } {
  const day = dayNumber(date);
  const rng = mulberry32(day * 2654435761);
  const challenge = CHALLENGES[Math.floor(rng() * CHALLENGES.length)];
  return { ...challenge, dateKey: dateKey(date) };
}

export function getRecentChallenges(count: number, date: Date = new Date()): Array<Challenge & { dateKey: string }> {
  const out: Array<Challenge & { dateKey: string }> = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(date.getTime() - i * 86400000);
    out.push(getDailyChallenge(d));
  }
  return out;
}

export interface StreakState {
  count: number;
  lastKey: string | null;
  total: number;
}

export const EMPTY_STREAK: StreakState = { count: 0, lastKey: null, total: 0 };

export function applyCompletion(state: StreakState, today: string): StreakState {
  if (state.lastKey === today) return state;
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  const nextCount = state.lastKey === yesterday ? state.count + 1 : 1;
  return { count: nextCount, lastKey: today, total: state.total + 1 };
}

export function currentStreak(state: StreakState): number {
  if (!state.lastKey) return 0;
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  if (state.lastKey === today || state.lastKey === yesterday) return state.count;
  return 0;
}
