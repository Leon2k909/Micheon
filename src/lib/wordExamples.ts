/**
 * Contextual example sentences for the Words tracker.
 *
 * A gloss tells the learner what a word maps to; it does not tell them when
 * the word is actually used — "aufheben" is "to pick up" until it means "to
 * abolish". The tracker therefore shows each word inside one REVIEWED course
 * sentence, with its translation, so the context travels with the card.
 *
 * Sources are strictly the sentences the course already teaches, read through
 * buildCatalog so learning-mode rewrites and the hand-written-examples-only
 * gate apply here exactly as they do in lessons. Nothing is fabricated: a
 * word whose lemma never appears verbatim in a reviewed sentence simply shows
 * no example. Inflected forms are NOT chased ("Häuser" does not serve
 * "das Haus") — a wrong-sense or wrong-form match would teach worse than
 * no match, and this surface has no reviewer.
 *
 * This module only READS the catalog. It must never feed sentences back into
 * lessons or Listen — the word/sentence isolation contract in wordSession.ts
 * stays intact.
 */
import { buildCatalog } from "@/session";
import type { WordItem } from "@/lib/wordSession";

export type WordExample = {
  /** The reviewed German sentence containing the word. */
  de: string;
  /** Its authored English translation. */
  en: string;
};

/** Placeholder tokens in idiom lemmas ("an etwas liegen") that name a slot,
 *  not a word — a real usage fills the slot, so they must not be required. */
const PLACEHOLDERS = new Set(["etwas", "etw", "jemand", "jemanden", "jemandem", "jdn", "jdm", "sich"]);

const tokenize = (text: string): string[] =>
  String(text ?? "")
    .toLocaleLowerCase("de-DE")
    .normalize("NFC")
    .split(/[^a-zäöüß]+/)
    .filter(Boolean);

/** The lemma as it would appear inside a sentence: article and reflexive
 *  marker dropped, placeholder slot-words dropped. */
const lemmaTokens = (word: Pick<WordItem, "de" | "lookup">): string[] =>
  tokenize(
    String(word.lookup || word.de).replace(/^(der|die|das)\s+/i, "")
  ).filter((token) => !PLACEHOLDERS.has(token));

type Candidate = {
  de: string;
  en: string;
  tokens: Set<string>;
  /** Word count of the German sentence. */
  count: number;
  /** Catalog position — curriculum order breaks ties. */
  order: number;
};

/**
 * Shorter reads better, but a two-word fragment shows little context. Prefer
 * a sentence of 3–12 words, then the shortest, then curriculum order.
 */
const better = (a: Candidate, b: Candidate): boolean => {
  const aIdeal = a.count >= 3 && a.count <= 12 ? 0 : 1;
  const bIdeal = b.count >= 3 && b.count <= 12 ? 0 : 1;
  if (aIdeal !== bIdeal) return aIdeal < bIdeal;
  if (a.count !== b.count) return a.count < b.count;
  return a.order < b.order;
};

export type WordExampleIndex = {
  exampleFor(word: Pick<WordItem, "de" | "en" | "lookup">): WordExample | undefined;
};

/**
 * One index per parts map. Two tiers, in order of trust:
 *
 * 1. The word's OWN hand-written example (`vocab.example`/`exampleEn`) — the
 *    author wrote that sentence for exactly this sense, so it always wins.
 * 2. A reviewed phrase/dialogue sentence containing every lemma token
 *    verbatim (whole-token, case-insensitive) — same words, so the same
 *    inflection caveat as above keeps false matches out.
 *
 * A sentence that IS the word (one-word phrases like "Genau!") adds no
 * context and never serves.
 */
export function buildWordExampleIndex(apiParts: Record<string, any>): WordExampleIndex {
  const catalog = buildCatalog(apiParts ?? {});
  const authored = new Map<string, WordExample>();
  const candidates: Candidate[] = [];
  const postings = new Map<string, number[]>();

  catalog.forEach((item, order) => {
    const de = String(item.de ?? "").trim();
    const en = String(item.en ?? "").trim();
    if (!de || !en) return;
    // Vocab-kind catalog entries ARE the authored example sentences: the
    // catalog stores word.example as `de` keyed by the word's lookup.
    if (item.kind === "vocab" && item.lookup) {
      const key = String(item.lookup).toLocaleLowerCase("de-DE");
      if (!authored.has(key)) authored.set(key, { de, en });
    }
    const tokens = tokenize(de);
    if (tokens.length < 2) return; // a bare word is not an example of itself
    const index = candidates.length;
    candidates.push({ de, en, tokens: new Set(tokens), count: tokens.length, order });
    for (const token of new Set(tokens)) {
      const list = postings.get(token);
      if (list) list.push(index);
      else postings.set(token, [index]);
    }
  });

  const cache = new Map<string, WordExample | null>();

  const exampleFor = (word: Pick<WordItem, "de" | "en" | "lookup">): WordExample | undefined => {
    const cacheKey = String(word.lookup || word.de).toLocaleLowerCase("de-DE");
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached ?? undefined;

    const own = authored.get(cacheKey);
    const tokens = lemmaTokens(word);
    let found: WordExample | null = own ?? null;
    if (!found && tokens.length > 0) {
      // Walk the rarest token's postings and verify the rest — the anchor
      // with the fewest sentences keeps common-word lemmas ("ich") cheap.
      let anchor: number[] | undefined;
      for (const token of tokens) {
        const list = postings.get(token);
        if (!list) { anchor = undefined; break; }
        if (!anchor || list.length < anchor.length) anchor = list;
      }
      const wordFace = String(word.de ?? "").toLocaleLowerCase("de-DE").trim();
      let best: Candidate | undefined;
      for (const index of anchor ?? []) {
        const candidate = candidates[index];
        if (candidate.count <= tokens.length) continue; // adds no context
        if (candidate.de.toLocaleLowerCase("de-DE").trim() === wordFace) continue;
        if (!tokens.every((token) => candidate.tokens.has(token))) continue;
        if (!best || better(candidate, best)) best = candidate;
      }
      if (best) found = { de: best.de, en: best.en };
    }
    cache.set(cacheKey, found);
    return found ?? undefined;
  };

  return { exampleFor };
}
