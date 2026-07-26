import { frequencyRank } from "@/lib/wordFrequency";

/**
 * How common a word or sentence is, for every item in the course.
 *
 * The curated frequency list in wordFrequency.ts is the authority, but it only
 * reaches about 15% of what gets taught — the rest tie at "unranked", which
 * made a sort on it very nearly a no-op. This fills the gap from the course's
 * own text: a word that shows up across many different topic packs is, by
 * definition, one the language leans on. Restaurant German is full of
 * "Rechnung"; only genuinely everyday words appear in the pet pack AND the
 * dentist pack AND the argument pack.
 *
 * Curated rank wins wherever it exists. The corpus estimate only fills in
 * behind it, mapped onto the same scale so the two can be compared.
 */

export type CorpusIndex = {
  /** word -> how many distinct packs it appears in */
  spread: Map<string, number>;
  /** word -> total occurrences */
  count: Map<string, number>;
  packs: number;
};

const STOP = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines",
  "und", "oder", "aber", "ist", "sind", "war", "waren", "bin", "bist", "sein",
  "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "mir", "dich", "dir", "sich",
  "zu", "zum", "zur", "in", "im", "an", "am", "auf", "mit", "von", "vom", "bei", "für", "aus",
  "nicht", "kein", "auch", "noch", "schon", "so", "als", "wie", "wenn", "dass", "man",
]);

function words(text: string): string[] {
  return String(text ?? "")
    .toLocaleLowerCase("de-DE")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Build the index once from the whole course. */
export function buildCorpusIndex(parts: Record<string, { phrases?: { de?: string }[] }>): CorpusIndex {
  const spread = new Map<string, number>();
  const count = new Map<string, number>();
  const keys = Object.keys(parts);
  for (const key of keys) {
    const seen = new Set<string>();
    for (const phrase of parts[key]?.phrases ?? []) {
      for (const word of words(phrase?.de ?? "")) {
        count.set(word, (count.get(word) ?? 0) + 1);
        seen.add(word);
      }
    }
    for (const word of seen) spread.set(word, (spread.get(word) ?? 0) + 1);
  }
  return { spread, count, packs: keys.length };
}

/**
 * Surface forms to try when scoring a word.
 *
 * German is heavily inflected and the frequency list is keyed on lemmas, so a
 * plain lookup misses nearly every verb as it actually appears in a sentence:
 * "gehen" is rank 19, but "gehe" was unranked and scored 3555, which made
 * "Ich gehe nach Hause" look RARER than "unter der Voraussetzung, dass die
 * Rahmenbedingungen stimmen". Trying a few endings fixes the common cases
 * without pretending to be a real morphological analyser.
 */
function lemmaCandidates(key: string): string[] {
  const out = new Set<string>([key]);
  // ich gehe -> gehen, wir mach -> machen
  out.add(`${key}n`);
  out.add(`${key}en`);
  // du gehst / er geht -> gehen
  if (key.endsWith("st") && key.length > 4) out.add(`${key.slice(0, -2)}en`);
  if (key.endsWith("t") && key.length > 3) out.add(`${key.slice(0, -1)}en`);
  // machte / machten -> machen
  if (key.endsWith("te") && key.length > 4) out.add(`${key.slice(0, -2)}en`);
  if (key.endsWith("ten") && key.length > 5) out.add(`${key.slice(0, -3)}en`);
  // Hause -> Haus, Tage -> Tag
  if (key.endsWith("e") && key.length > 3) out.add(key.slice(0, -1));
  // gegangen -> gangen is wrong, but ge- stripping helps participles like
  // gemacht -> macht -> machen via the rule above.
  if (key.startsWith("ge") && key.length > 5) out.add(key.slice(2));
  return [...out];
}

/**
 * A rank-like number for one word: lower means more common. Deliberately on the
 * same scale as the curated list so the two can be mixed in one comparison.
 *
 * The best score across the word's plausible lemmas wins — an inflected form is
 * exactly as common as the word it belongs to.
 */
export function wordCommonality(word: string, index: CorpusIndex | null): number {
  const key = word.toLocaleLowerCase("de-DE").replace(/[^\p{L}\p{N}]/gu, "");
  if (!key) return 5000;
  const candidates = lemmaCandidates(key);

  let best = Infinity;
  for (const candidate of candidates) {
    const curated = frequencyRank(candidate);
    if (Number.isFinite(curated) && curated < best) best = curated;
  }
  if (Number.isFinite(best)) return best;
  if (!index) return 4000;

  // Pool the corpus spread across the forms too, so "gehe", "gehst" and "geht"
  // count as one word rather than three rare ones.
  let spread = 0;
  for (const candidate of candidates) spread = Math.max(spread, index.spread.get(candidate) ?? 0);
  if (!spread) return 5000;
  // Appearing in many packs is the strongest available signal of everyday use.
  // A word in a third of all packs lands near the top; a word in one pack sits
  // out with the rare vocabulary.
  const share = spread / Math.max(1, index.packs);
  return Math.round(400 + (1 - Math.min(1, share * 3)) * 3600);
}

/** How common a whole sentence is — driven by its least common content word. */
export function sentenceCommonality(sentence: string, index: CorpusIndex | null): number {
  const parts = words(sentence);
  if (!parts.length) return 3000;
  const ranks = parts.map((w) => wordCommonality(w, index));
  // The hardest word is what makes a sentence hard to place, so weight the
  // worst one heavily rather than letting a long easy sentence average it away.
  const worst = Math.max(...ranks);
  const mean = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  return Math.round(mean * 0.6 + worst * 0.4);
}
