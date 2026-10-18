export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedFrom(...parts: Array<string | number>): number {
  return hashString(parts.join("::"));
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("pick() needs a non-empty array");
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

export function int(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function chance(rng: Rng, probability: number): boolean {
  return rng() < probability;
}

export function shuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickMany<T>(rng: Rng, arr: readonly T[], count: number): T[] {
  return shuffle(rng, arr).slice(0, Math.min(count, arr.length));
}

export function fillTemplate(rng: Rng, template: string, slots: Record<string, readonly string[]>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const options = slots[key];
    return options ? pick(rng, options) : match;
  });
}
