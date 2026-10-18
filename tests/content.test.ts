import { describe, expect, it } from "vitest";
import { QUIZ_PACKS, getQuizPack, maxScore, scoreToResultIndex } from "@/lib/content/quizzes";
import { JOKES } from "@/lib/content/jokes";
import { WOULD_YOU_RATHER } from "@/lib/content/wyr";
import { CHALLENGES } from "@/lib/content/challenges";
import { DRAW_PROMPTS } from "@/lib/content/prompts";
import { COMPLIMENT_TEMPLATES } from "@/lib/content/compliments";
import { AWARD_TITLES, AWARD_REASONS } from "@/lib/content/awards";

describe("quiz packs", () => {
  it("all packs have unique ids, valid questions, thresholds and results", () => {
    const ids = new Set<string>();
    for (const pack of QUIZ_PACKS) {
      expect(pack.id.length).toBeGreaterThan(0);
      expect(ids.has(pack.id)).toBe(false);
      ids.add(pack.id);
      expect(pack.questions.length).toBeGreaterThanOrEqual(4);
      for (const question of pack.questions) {
        expect(question.q.length).toBeGreaterThan(0);
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        for (const option of question.options) {
          expect(option.label.length).toBeGreaterThan(0);
          expect(Number.isInteger(option.weight)).toBe(true);
          expect(option.weight).toBeGreaterThanOrEqual(0);
        }
      }
      expect(pack.results.length).toBeGreaterThanOrEqual(2);
      expect(pack.thresholds.length).toBe(pack.results.length - 1);
      const sorted = [...pack.thresholds].sort((a, b) => a - b);
      expect(pack.thresholds).toEqual(sorted);
    }
  });

  it("getQuizPack falls back to the first pack for unknown ids", () => {
    expect(getQuizPack("does-not-exist")).toBe(QUIZ_PACKS[0]);
    expect(getQuizPack(null)).toBe(QUIZ_PACKS[0]);
    expect(getQuizPack(undefined)).toBe(QUIZ_PACKS[0]);
  });

  it("scoreToResultIndex is clamped and monotonic", () => {
    for (const pack of QUIZ_PACKS) {
      const topIndex = pack.thresholds.length;
      expect(scoreToResultIndex(pack, -1)).toBe(0);
      expect(scoreToResultIndex(pack, maxScore(pack) + 1000)).toBe(topIndex);
      const topScore = maxScore(pack);
      expect(topScore).toBeGreaterThan(0);
      let previous = 0;
      for (let score = 0; score <= topScore; score++) {
        const index = scoreToResultIndex(pack, score);
        expect(index).toBeGreaterThanOrEqual(previous);
        expect(index).toBeLessThanOrEqual(topIndex);
        previous = index;
      }
    }
  });
});

describe("content pools", () => {
  it("pools are non-empty and free of empty strings", () => {
    const pools: Array<[string, readonly string[]]> = [
      ["jokes", JOKES.flatMap((joke) => [joke.setup, joke.punchline])],
      ["wyr options", WOULD_YOU_RATHER.flatMap((entry) => [entry.a, entry.b])],
      ["challenges", CHALLENGES.map((entry) => entry.text)],
      ["prompts", DRAW_PROMPTS],
      ["compliments", COMPLIMENT_TEMPLATES],
      ["award titles", AWARD_TITLES],
      ["award reasons", AWARD_REASONS],
    ];
    for (const [name, pool] of pools) {
      expect(pool.length, name).toBeGreaterThan(0);
      for (const entry of pool) {
        expect(entry.trim().length, `${name} entry`).toBeGreaterThan(0);
      }
    }
  });

  it("challenges all carry a valid kind", () => {
    for (const challenge of CHALLENGES) {
      expect(["text", "draw", "friends", "silly"]).toContain(challenge.kind);
    }
  });

  it("compliment templates render as-is (no unresolved slot placeholders)", () => {
    for (const template of COMPLIMENT_TEMPLATES) {
      expect(template).not.toContain("{");
    }
  });
});
