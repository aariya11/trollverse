export const STORE_PREFIX = "trollverse:v1:";

export const STORE_KEYS = {
  saved: `${STORE_PREFIX}saved`,
  achievements: `${STORE_PREFIX}achievements`,
  streak: `${STORE_PREFIX}streak`,
  sound: `${STORE_PREFIX}sound`,
  guest: `${STORE_PREFIX}guest`,
  dailyDone: `${STORE_PREFIX}daily-done`,
  dailyEntries: `${STORE_PREFIX}daily-entries`,
  reactions: `${STORE_PREFIX}reactions`,
  memeDraft: `${STORE_PREFIX}meme-draft`,
  gameScores: `${STORE_PREFIX}game-scores`,
  doomPresses: `${STORE_PREFIX}doom-presses`,
  spins: `${STORE_PREFIX}spins`,
} as const;

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("trollverse:store", { detail: { key } }));
    return true;
  } catch {
    return false;
  }
}

export function removeStore(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent("trollverse:store", { detail: { key } }));
  } catch {
    /* storage unavailable */
  }
}

export function clearAllTrollverseData(): void {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
    window.dispatchEvent(new CustomEvent("trollverse:store", { detail: { key: "*" } }));
  } catch {
    /* storage unavailable */
  }
}

export function estimateStorageBytes(): number {
  if (typeof window === "undefined") return 0;
  try {
    let total = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORE_PREFIX)) {
        total += key.length + (window.localStorage.getItem(key)?.length ?? 0);
      }
    }
    return total;
  } catch {
    return 0;
  }
}
