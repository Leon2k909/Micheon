// How common is this word, really?
//
// The bundled word bank is ordered by corpus frequency (index 0 = the most
// common word in German). That ordering lets us show learners which of two
// same-meaning words Germans actually reach for — e.g. "Gegner" is in the
// top 2,500 while "Feind" isn't, which matches how gamers talk.

import bundledWordBank from "@/lib/bundledWordBank.json";

const rankByWord = new Map<string, number>();
(bundledWordBank as any[]).forEach((entry, i) => {
  const lookup = String(entry?.lookup ?? "").toLowerCase();
  const bare = String(entry?.de ?? "").toLowerCase().replace(/^(der|die|das)\s+/, "");
  if (lookup && !rankByWord.has(lookup)) rankByWord.set(lookup, i + 1);
  if (bare && !rankByWord.has(bare)) rankByWord.set(bare, i + 1);
});

export type FrequencyInfo = { rank: number; label: string } | null;

/**
 * Frequency rank for a word (1 = most common). Accepts "Gegner" or
 * "der Gegner". Returns null when the word isn't in the top 2,500 — we
 * stay silent rather than call it rare, because curated slang (digga,
 * zocken) is common in speech but absent from written-corpus lists.
 */
export function frequencyInfo(word: string | undefined): FrequencyInfo {
  if (!word) return null;
  const key = String(word).toLowerCase().trim().replace(/^(der|die|das)\s+/, "");
  const rank = rankByWord.get(key);
  if (rank == null) return null;
  const label =
    rank <= 300 ? "top 300 word" :
    rank <= 1200 ? "top 1,200 word" :
    "top 2,500 word";
  return { rank, label };
}
