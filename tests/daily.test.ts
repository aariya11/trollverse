import { describe, expect, it } from "vitest";
import {
  applyCompletion,
  currentStreak,
  dateKey,
  dayNumber,
  getDailyChallenge,
  getRecentChallenges,
  type StreakState,
} from "@/lib/content/daily";

const yesterdayKey = () => dateKey(new Date(Date.now() - 86400000));
const todayKey = () => dateKey();

describe("dayNumber", () => {
  it("advances by exactly one per calendar day", () => {
    const a = dayNumber(new Date(Date.UTC(2026, 0, 1)));
    const b = dayNumber(new Date(Date.UTC(2026, 0, 2)));
    expect(b - a).toBe(1);
  });

  it("is stable within the same UTC day regardless of time", () => {
    const morning = dayNumber(new Date(Date.UTC(2026, 4, 10, 1, 0, 0)));
    const evening = dayNumber(new Date(Date.UTC(2026, 4, 10, 23, 59, 59)));
    expect(morning).toBe(evening);
  });
});

describe("dateKey", () => {
  it("formats as YYYY-MM-DD in UTC", () => {
    expect(dateKey(new Date(Date.UTC(2026, 2, 7, 12)))).toBe("2026-03-07");
  });
});

describe("getDailyChallenge", () => {
  it("is deterministic for the same date", () => {
    const date = new Date(Date.UTC(2026, 5, 15));
    const first = getDailyChallenge(date);
    const second = getDailyChallenge(date);
    expect(first).toEqual(second);
  });

  it("includes the date key and non-empty text", () => {
    const challenge = getDailyChallenge(new Date(Date.UTC(2026, 5, 15)));
    expect(challenge.dateKey).toBe("2026-06-15");
    expect(challenge.text.length).toBeGreaterThan(0);
    expect(["text", "draw", "friends", "silly"]).toContain(challenge.kind);
  });

  it("produces a variety across a span of days", () => {
    const texts = new Set<string>();
    for (let offset = 0; offset < 30; offset++) {
      texts.add(getDailyChallenge(new Date(Date.UTC(2026, 6, 1 + offset))).text);
    }
    expect(texts.size).toBeGreaterThan(10);
  });
});

describe("getRecentChallenges", () => {
  it("returns newest first with today included", () => {
    const recent = getRecentChallenges(7, new Date(Date.UTC(2026, 7, 20)));
    expect(recent).toHaveLength(7);
    expect(recent[0].dateKey).toBe("2026-08-20");
    expect(recent[1].dateKey).toBe("2026-08-19");
  });
});

describe("applyCompletion", () => {
  it("starts a streak at one for a fresh state", () => {
    const next = applyCompletion({ count: 0, lastKey: null, total: 0 }, todayKey());
    expect(next).toEqual({ count: 1, lastKey: todayKey(), total: 1 });
  });

  it("does nothing when today is already completed", () => {
    const state: StreakState = { count: 4, lastKey: todayKey(), total: 9 };
    expect(applyCompletion(state, todayKey())).toEqual(state);
  });

  it("extends a streak when yesterday was completed", () => {
    const state: StreakState = { count: 2, lastKey: yesterdayKey(), total: 5 };
    const next = applyCompletion(state, todayKey());
    expect(next.count).toBe(3);
    expect(next.total).toBe(6);
    expect(next.lastKey).toBe(todayKey());
  });

  it("resets the streak after a gap", () => {
    const state: StreakState = { count: 7, lastKey: "2020-01-01", total: 12 };
    const next = applyCompletion(state, todayKey());
    expect(next.count).toBe(1);
    expect(next.total).toBe(13);
  });
});

describe("currentStreak", () => {
  it("returns zero without history", () => {
    expect(currentStreak({ count: 0, lastKey: null, total: 0 })).toBe(0);
  });

  it("counts a current-day streak", () => {
    expect(currentStreak({ count: 3, lastKey: todayKey(), total: 3 })).toBe(3);
  });

  it("counts a streak that ended yesterday", () => {
    expect(currentStreak({ count: 3, lastKey: yesterdayKey(), total: 3 })).toBe(3);
  });

  it("expires older streaks", () => {
    expect(currentStreak({ count: 3, lastKey: "2020-01-01", total: 3 })).toBe(0);
  });
});
