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

// ── Same-meaning pairs taught in the app ─────────────────────────────────
// When two taught words mean the same thing, the chip names the sibling
// instead of a bare tier: "less common than Gegner" beats "less common".
// Only pairs with a clear-cut preference are listed — beginnen/anfangen
// (written rank favours beginnen, speech favours anfangen) is deliberately
// absent, because a wrong "more common" claim is worse than none.
const SYNONYM_PAIRS: { common: string; rare: string; context?: string }[] = [
  { common: "Gegner", rare: "Feind", context: "in games & everyday talk" },
  { common: "Auto", rare: "Wagen" },
  { common: "schnell", rare: "rasch" },
];

export type SynonymNote = { kind: "common" | "rare" | "also"; label: string; hint: string } | null;

// Native-verified loanword/sibling pairs (see scratch/loanword-workflow):
// which anglicism or synonym Germans really use alongside the taught word.
// prefer: which side everyday speech reaches for ("either" = both common).
import loanwordPairs from "@/lib/loanwordPairs.json";
const bare = (s: string) => String(s ?? "").toLowerCase().trim().replace(/^(der|die|das)\s+/, "");

/** Comparative note when a taught same-meaning sibling exists. */
export function synonymNote(word: string | undefined): SynonymNote {
  if (!word) return null;
  const key = bare(word);
  for (const pair of SYNONYM_PAIRS) {
    if (pair.rare.toLowerCase() === key) {
      return {
        kind: "rare",
        label: `less common than ${pair.common}`,
        hint: `Germans usually say ${pair.common}${pair.context ? ` ${pair.context}` : ""}`,
      };
    }
    if (pair.common.toLowerCase() === key) {
      return {
        kind: "common",
        label: `more common than ${pair.rare}`,
        hint: `Prefer this over ${pair.rare}`,
      };
    }
  }
  // Loanword siblings: tell the learner what Germans actually say day to day.
  for (const p of loanwordPairs as { taught: string; alt: string; prefer: string; note: string }[]) {
    const t = bare(p.taught), a = bare(p.alt);
    if (key !== t && key !== a) continue;
    const other = key === t ? p.alt : p.taught;
    const viewedPreferred =
      p.prefer === "either" || (key === t ? p.prefer === "taught" : p.prefer === "alt");
    if (p.prefer !== "either" && !viewedPreferred) {
      return { kind: "rare", label: `Germans usually say ${other}`, hint: p.note };
    }
    return { kind: "also", label: `also: ${other}`, hint: p.note };
  }
  return null;
}
