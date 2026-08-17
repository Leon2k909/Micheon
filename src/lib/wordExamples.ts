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

/** Function words create accidental matches ("court" and "dish" examples
 * both contain "a" or "the"), so only meaning-bearing English words may
 * disambiguate a German homonym. */
const ENGLISH_STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "but", "by",
  "do", "does", "for", "from", "had", "has", "have", "he", "her", "him", "his",
  "i", "in", "into", "is", "it", "its", "me", "my", "of", "on", "or", "our",
  "out", "she", "so", "some", "something", "that", "the", "their", "them",
  "there", "they", "this", "to", "up", "us", "was", "we", "were", "with",
  "without", "you", "your",
]);

const singularEnglishToken = (token: string): string => {
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && /(?:ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !/(?:ss|us|is)$/.test(token)) return token.slice(0, -1);
  return token;
};

const englishSenseTokens = (text: string): Set<string> => new Set(
  String(text ?? "")
    .toLocaleLowerCase("en-GB")
    .normalize("NFC")
    .split(/[^a-z]+/)
    .filter(Boolean)
    .filter((token) => !ENGLISH_STOPWORDS.has(token))
    .map(singularEnglishToken)
);

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
  /** Meaning-bearing words from the reviewed English translation. */
  senseTokens: Set<string>;
  /** Word count of the German sentence. */
  count: number;
  /** Catalog position — curriculum order breaks ties. */
  order: number;
};

const senseOverlap = (candidate: Candidate, wanted: Set<string>): number => {
  let overlap = 0;
  for (const token of wanted) {
    if (candidate.senseTokens.has(token)) overlap += 1;
  }
  return overlap;
};

const bestForSense = (
  pool: Candidate[],
  wanted: Set<string>
): { candidate: Candidate; overlap: number } | undefined => {
  let best: Candidate | undefined;
  let bestOverlap = -1;
  for (const candidate of pool) {
    const overlap = senseOverlap(candidate, wanted);
    if (overlap > bestOverlap || (overlap === bestOverlap && best && better(candidate, best))) {
      best = candidate;
      bestOverlap = overlap;
    }
  }
  return best ? { candidate: best, overlap: bestOverlap } : undefined;
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
 *    author wrote that sentence for its source sense, so it wins when its
 *    English meaning matches the reviewed standalone card.
 * 2. A reviewed phrase/dialogue sentence containing every lemma token
 *    verbatim (whole-token, case-insensitive) — same words, so the same
 *    inflection caveat as above keeps false matches out. English meaning
 *    words break homonym ties (`Gericht` as court versus dish).
 *
 * A sentence that IS the word (one-word phrases like "Genau!") adds no
 * context and never serves.
 */
export function buildWordExampleIndex(apiParts: Record<string, any>): WordExampleIndex {
  const catalog = buildCatalog(apiParts ?? {});
  const authored = new Map<string, Candidate[]>();
  const candidates: Candidate[] = [];
  const postings = new Map<string, number[]>();

  catalog.forEach((item, order) => {
    const de = String(item.de ?? "").trim();
    const en = String(item.en ?? "").trim();
    if (!de || !en) return;
    const tokens = tokenize(de);
    const candidate: Candidate = {
      de,
      en,
      tokens: new Set(tokens),
      senseTokens: englishSenseTokens(en),
      count: tokens.length,
      order,
    };
    // Vocab-kind catalog entries ARE the authored example sentences: the
    // catalog stores word.example as `de` keyed by the word's lookup.
    if (item.kind === "vocab" && item.lookup) {
      const key = String(item.lookup).toLocaleLowerCase("de-DE");
      const list = authored.get(key);
      if (list) list.push(candidate);
      else authored.set(key, [candidate]);
    }
    if (tokens.length < 2) return; // a bare word is not an example of itself
    const index = candidates.length;
    candidates.push(candidate);
    for (const token of new Set(tokens)) {
      const list = postings.get(token);
      if (list) list.push(index);
      else postings.set(token, [index]);
    }
  });

  const cache = new Map<string, WordExample | null>();

  const exampleFor = (word: Pick<WordItem, "de" | "en" | "lookup">): WordExample | undefined => {
    const lookupKey = String(word.lookup || word.de).toLocaleLowerCase("de-DE");
    // A homonym can be requested under more than one reviewed English sense.
    // Caching only by German lookup made whichever sense was opened first win.
    const cacheKey = `${lookupKey}\u0000${String(word.en ?? "").toLocaleLowerCase("en-GB")}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached ?? undefined;

    const wantedSense = englishSenseTokens(word.en);
    const own = bestForSense(authored.get(lookupKey) ?? [], wantedSense);
    const tokens = lemmaTokens(word);
    let found: WordExample | null = own
      ? { de: own.candidate.de, en: own.candidate.en }
      : null;
    if (tokens.length > 0) {
      // Walk the rarest token's postings and verify the rest — the anchor
      // with the fewest sentences keeps common-word lemmas ("ich") cheap.
      let anchor: number[] | undefined;
      for (const token of tokens) {
        const list = postings.get(token);
        if (!list) { anchor = undefined; break; }
        if (!anchor || list.length < anchor.length) anchor = list;
      }
      const wordFace = String(word.de ?? "").toLocaleLowerCase("de-DE").trim();
      const matching: Candidate[] = [];
      for (const index of anchor ?? []) {
        const candidate = candidates[index];
        if (candidate.count <= tokens.length) continue; // adds no context
        if (candidate.de.toLocaleLowerCase("de-DE").trim() === wordFace) continue;
        if (!tokens.every((token) => candidate.tokens.has(token))) continue;
        matching.push(candidate);
      }
      const phrase = bestForSense(matching, wantedSense);
      // An authored example still wins when it matches this meaning. If the
      // authored source belongs to another sense, a semantically matching
      // reviewed sentence is safer (Gericht = court must not show a dish).
      if (phrase && (!own || (own.overlap === 0 && phrase.overlap > 0))) {
        found = { de: phrase.candidate.de, en: phrase.candidate.en };
      }
    }
    cache.set(cacheKey, found);
    return found ?? undefined;
  };

  return { exampleFor };
}
