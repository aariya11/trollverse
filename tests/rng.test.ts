import { describe, expect, it } from "vitest";
import { int, mulberry32, pick, pickMany, seedFrom, shuffle, fillTemplate, chance } from "@/lib/rng";

describe("mulberry32", () => {
  it("is deterministic for the same seed", () => {
    const a = mulberry32(1234);
    const b = mulberry32(1234);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 500; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("seedFrom", () => {
  it("is stable for identical parts", () => {
    expect(seedFrom("a", 1, "b")).toBe(seedFrom("a", 1, "b"));
  });

  it("differs when parts differ", () => {
    expect(seedFrom("a", 1)).not.toBe(seedFrom("a", 2));
  });
});

describe("pick / int / chance", () => {
  it("pick returns an element of the array", () => {
    const rng = mulberry32(7);
    const arr = ["x", "y", "z"] as const;
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(pick(rng, arr));
    }
  });

  it("int stays within inclusive bounds", () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 200; i++) {
      const value = int(rng, 3, 7);
      expect(value).toBeGreaterThanOrEqual(3);
      expect(value).toBeLessThanOrEqual(7);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("chance is deterministic per seed", () => {
    const a = mulberry32(5);
    const b = mulberry32(5);
    expect(chance(a, 0.5)).toBe(chance(b, 0.5));
  });
});

describe("shuffle / pickMany", () => {
  it("shuffle keeps the same elements and does not mutate the input", () => {
    const rng = mulberry32(21);
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const shuffled = shuffle(rng, input);
    expect(input).toEqual(copy);
    expect([...shuffled].sort((x, y) => x - y)).toEqual([1, 2, 3, 4, 5]);
  });

  it("pickMany returns the requested count without duplicates", () => {
    const rng = mulberry32(3);
    const picked = pickMany(rng, [1, 2, 3, 4, 5, 6], 4);
    expect(picked).toHaveLength(4);
    expect(new Set(picked).size).toBe(4);
  });

  it("pickMany never exceeds the array length", () => {
    const rng = mulberry32(3);
    const picked = pickMany(rng, [1, 2], 10);
    expect(picked.length).toBeLessThanOrEqual(2);
  });
});

describe("fillTemplate", () => {
  it("replaces all provided slots and leaves unknown placeholders", () => {
    const rng = mulberry32(11);
    const output = fillTemplate(rng, "A {color} {animal} met a {stranger}", {
      color: ["small"],
      animal: ["badger"],
    });
    expect(output).toBe("A small badger met a {stranger}");
  });

  it("produces deterministic output for the same seed", () => {
    const slots = { name: ["Ada", "Bob"], place: ["the moon", "a shed"] };
    const a = fillTemplate(mulberry32(8), "{name} went to {place}.", slots);
    const b = fillTemplate(mulberry32(8), "{name} went to {place}.", slots);
    expect(a).toBe(b);
  });
});
