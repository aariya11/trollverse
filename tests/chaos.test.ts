import { describe, expect, it } from "vitest";
import { CHAOS_CATEGORIES, categoryDef, spinChaos, type ChaosCategory } from "@/lib/chaos";

const ALL_CATEGORIES: ChaosCategory[] = [
  "joke",
  "hypothetical",
  "personality",
  "excuse",
  "scenario",
  "wyr",
  "question",
  "challenge",
  "prompt",
  "compliment",
];

describe("CHAOS_CATEGORIES", () => {
  it("has a definition for every category id with non-empty label and blurb", () => {
    for (const category of ALL_CATEGORIES) {
      const def = categoryDef(category);
      expect(def.id).toBe(category);
      expect(def.label.length).toBeGreaterThan(0);
      expect(def.blurb.length).toBeGreaterThan(0);
      expect(["rose", "sage", "blush", "ink"]).toContain(def.accent);
    }
  });

  it("matches the full set of category ids", () => {
    expect(new Set(CHAOS_CATEGORIES.map((entry) => entry.id))).toEqual(new Set(ALL_CATEGORIES));
  });
});

describe("spinChaos", () => {
  for (const category of ALL_CATEGORIES) {
    it(`generates a valid ${category} result`, () => {
      const result = spinChaos(category, 12345);
      expect(result.category).toBe(category);
      expect(result.title.trim().length).toBeGreaterThan(0);
      expect(result.body.trim().length).toBeGreaterThan(0);
      expect(result.seed).toBe(12345);
      expect(result.id.length).toBeGreaterThan(0);
      expect(["rose", "sage", "blush", "ink"]).toContain(result.accent);
    });
  }

  it("resolves 'surprise' to a real category", () => {
    for (let seed = 0; seed < 40; seed++) {
      const result = spinChaos("surprise", seed);
      expect(ALL_CATEGORIES).toContain(result.category);
    }
  });

  it("is deterministic for the same seed and category", () => {
    const a = spinChaos("joke", 77);
    const b = spinChaos("joke", 77);
    expect(a).toEqual(b);
  });

  it("generates a variety of results over many seeds", () => {
    const bodies = new Set<string>();
    for (let seed = 0; seed < 60; seed++) {
      bodies.add(spinChaos("hypothetical", seed).body);
    }
    expect(bodies.size).toBeGreaterThan(5);
  });
});
