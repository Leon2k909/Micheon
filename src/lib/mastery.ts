/**
 * Utility for tracking unique German words mastered through gameplay.
 * Persists to localStorage and the shared desktop/web progress store.
 */

import { syncLocalStorageItem } from "@/lib/profileStorage";

const MASTERY_STORAGE_KEY = "germ-mastery-set";

export function recordWordMastery(word: string) {
  if (!word) return;
  const normalized = word.toLowerCase().trim();
  const mastered = getMasteredWords();
  
  if (!mastered.includes(normalized)) {
    mastered.push(normalized);
    try {
      const raw = JSON.stringify(mastered);
      localStorage.setItem(MASTERY_STORAGE_KEY, raw);
      syncLocalStorageItem(MASTERY_STORAGE_KEY, raw);
      // Dispatch a custom event so the dashboard can update in real-time
      window.dispatchEvent(new CustomEvent("vocab-mastery-updated", { detail: { count: mastered.length } }));
    } catch (e) {
      console.error("Failed to save mastery data", e);
    }
  }
}

export function getMasteredWords(): string[] {
  try {
    const data = localStorage.getItem(MASTERY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getMasteredCount(): number {
  return getMasteredWords().length;
}
