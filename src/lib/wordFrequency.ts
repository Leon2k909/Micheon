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

export type FrequencyInfo = { rank: number; label: string; hint: string } | null;

/**
 * Frequency rank for a word (1 = most common). Accepts "Gegner" or
 * "der Gegner". Returns null when the word isn't in the top 2,500 — we
 * stay silent rather than call it rare, because curated slang (digga,
 * zocken) is common in speech but absent from written-corpus lists.
 *
 * The rank is for ORDERING (common words come first in lessons and the
 * tracker); the learner-facing label is plain English — numbers like
 * "top 300" mean nothing to a learner.
 */
export function frequencyInfo(word: string | undefined): FrequencyInfo {
  if (!word) return null;
  const key = String(word).toLowerCase().trim().replace(/^(der|die|das)\s+/, "");
  const rank = rankByWord.get(key);
  if (rank == null) return null;
  if (rank <= 300) return { rank, label: "very common", hint: "Everyday core German — you'll hear this constantly" };
  if (rank <= 1200) return { rank, label: "common", hint: "Solid everyday vocabulary" };
  return { rank, label: "less common", hint: "Useful, but Germans reach for it less often" };
}

/** Sort key: 1 = most common, Infinity = unranked (sentences, slang). */
export function frequencyRank(word: string | undefined): number {
  return frequencyInfo(word)?.rank ?? Infinity;
}
