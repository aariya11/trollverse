import { readStore, writeStore, STORE_KEYS } from "./storage";
import { fireAchievement } from "./sound";

export type AchievementGlyph = "star" | "spiral" | "blob" | "flower" | "zigzag" | "bolt" | "crown";

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  glyph: AchievementGlyph;
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: "chaos-beginner", name: "Chaos Beginner", desc: "Spun the chaos engine for the first time.", glyph: "spiral" },
  { id: "randomness-enthusiast", name: "Randomness Enthusiast", desc: "Spun the chaos engine 25 times.", glyph: "blob" },
  { id: "meme-architect", name: "Meme Architect", desc: "Exported your first meme from the studio.", glyph: "star" },
  { id: "doodle-goblin", name: "Doodle Goblin", desc: "Finished and exported a doodle.", glyph: "flower" },
  { id: "prankster", name: "Prankster In Training", desc: "Built your first shareable prank link.", glyph: "zigzag" },
  { id: "nonsense-expert", name: "Certified Nonsense Expert", desc: "Completed a daily chaos challenge.", glyph: "crown" },
  { id: "bad-jokes", name: "Master Of Bad Jokes", desc: "Saved 5 chaos results to your stash.", glyph: "star" },
  { id: "button-pressed", name: "You Pressed The Button", desc: "Pressed the forbidden button 5 times.", glyph: "bolt" },
  { id: "button-legend", name: "Button Legend", desc: "Made it to the end of the forbidden button.", glyph: "crown" },
  { id: "gremlin-wrangler", name: "Gremlin Wrangler", desc: "Caught 10 gremlins in one round.", glyph: "blob" },
  { id: "forbidden-word", name: "You Typed The Forbidden Word", desc: "You know what you did.", glyph: "zigzag" },
  { id: "streak-3", name: "Three-Day Streak", desc: "Completed daily chaos three days in a row.", glyph: "flower" },
  { id: "sound-on", name: "Sound Check", desc: "Turned on the sound effects. Excellent taste.", glyph: "bolt" },
];

const achievementMap = new Map(ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]));

export function getAchievement(id: string): AchievementDef | undefined {
  return achievementMap.get(id);
}

export function getUnlockedMap(): Record<string, number> {
  return readStore<Record<string, number>>(STORE_KEYS.achievements, {});
}

export function isUnlocked(id: string): boolean {
  return Boolean(getUnlockedMap()[id]);
}

export function unlock(id: string): boolean {
  const def = achievementMap.get(id);
  if (!def || typeof window === "undefined") return false;
  const unlocked = getUnlockedMap();
  if (unlocked[id]) return false;
  unlocked[id] = Date.now();
  writeStore(STORE_KEYS.achievements, unlocked);
  fireAchievement(def.id, def.name, def.desc);
  return true;
}
