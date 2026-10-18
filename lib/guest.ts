"use client";

import { seedFrom, mulberry32, pick } from "./rng";
import { readStore, writeStore, STORE_KEYS } from "./storage";

export interface GuestIdentity {
  handle: string;
  seed: number;
  createdAt: number;
}

const ADJECTIVES = [
  "Chaotic",
  "Mild",
  "Suspicious",
  "Premium",
  "Gentle",
  "Feral",
  "Certified",
  "Anonymous",
  "Wobbly",
  "Unbothered",
  "Microwave",
  "Legendary",
];

const NOUNS = [
  "Goblin",
  "Toaster",
  "Pigeon",
  "Wizard",
  "Snack",
  "Menace",
  "Noodle",
  "Panda",
  "Muffin",
  "Comet",
  "Pickle",
  "Ghost",
];

export function generateGuest(): GuestIdentity {
  const seed = Math.floor(Math.random() * 2 ** 31);
  const rng = mulberry32(seed);
  const adjective = pick(rng, ADJECTIVES);
  const noun = pick(rng, NOUNS);
  const digits = Math.floor(rng() * 9000 + 1000);
  return {
    handle: `${adjective}${noun}#${digits}`,
    seed,
    createdAt: Date.now(),
  };
}

export function readGuest(): GuestIdentity | null {
  return readStore<GuestIdentity | null>(STORE_KEYS.guest, null);
}

export function ensureGuest(): GuestIdentity {
  const existing = readGuest();
  if (existing?.handle) return existing;
  const guest = generateGuest();
  writeStore(STORE_KEYS.guest, guest);
  return guest;
}

export interface AvatarSpec {
  bg: string;
  face: "smile" | "wink" | "zigzag" | "surprised";
  accessory: "none" | "antenna" | "hat" | "glasses";
}

export function avatarFor(seed: number): AvatarSpec {
  const rng = mulberry32(seedFrom("avatar", seed));
  const backgrounds = ["#c68a8c", "#8ca36b", "#f6d9e0", "#eae2c2", "#a2636a", "#61793f"];
  const faces = ["smile", "wink", "zigzag", "surprised"] as const;
  const accessories = ["none", "antenna", "hat", "glasses"] as const;
  return {
    bg: pick(rng, backgrounds),
    face: pick(rng, faces),
    accessory: pick(rng, accessories),
  };
}
