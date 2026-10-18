import { readStore, writeStore, STORE_KEYS } from "./storage";
import { unlock } from "./achievements";

export interface SavedItem {
  id: string;
  kind: string;
  category: string;
  title: string;
  body: string;
  extra?: string;
  savedAt: number;
}

const MAX_SAVED = 60;

export function listSaved(): SavedItem[] {
  return readStore<SavedItem[]>(STORE_KEYS.saved, []);
}

export function saveItem(item: Omit<SavedItem, "savedAt">): "saved" | "exists" | "full" {
  const current = listSaved();
  if (current.some((entry) => entry.id === item.id)) return "exists";
  if (current.length >= MAX_SAVED) return "full";
  const next = [{ ...item, savedAt: Date.now() }, ...current];
  writeStore(STORE_KEYS.saved, next);
  if (next.length >= 5) unlock("bad-jokes");
  return "saved";
}

export function removeSaved(id: string): void {
  writeStore(
    STORE_KEYS.saved,
    listSaved().filter((entry) => entry.id !== id),
  );
}

export function clearSaved(): void {
  writeStore(STORE_KEYS.saved, []);
}
