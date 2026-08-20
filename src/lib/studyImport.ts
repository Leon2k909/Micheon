import { buildCatalog } from "@/session";
import { buildWordCatalog } from "@/lib/wordSession";
import { frequencyRank } from "@/lib/wordFrequency";

/**
 * Everything the app knows, in one list you can filter.
 *
 * The import tab started by searching buildCatalog, which sounds like "the
 * catalogue" and is not: it holds the 16,308 phrases and dialogues, and none
 * of the 7,006 vocabulary WORDS, which live in buildWordCatalog. Someone
 * searching for a noun to put on a card found sentences containing it and no
 * way to add the word itself.
 *
 * So both are merged here, tagged with everything worth filtering on — level,
 * part of speech, pack, and how common the word is — because picking cards
 * one at a time out of 23,000 is not a feature, it is a chore. The filters are
 * what turn this into "give me the A1 nouns" or "the 200 most common verbs".
 */

export type ImportKind = "word" | "phrase";

export type ImportItem = {
  id: string;
  de: string;
  en: string;
  kind: ImportKind;
  /** CEFR level as the data states it — may be a range like "A2-B2". */
  level?: string;
  /** Part of speech, words only. */
  pos?: string;
  packKey?: string;
  packLabel?: string;
  /** Usage note or context, carried onto the card as its hint. */
  hint?: string;
  /** Corpus frequency rank; Infinity when the word is not in the list. */
  rank: number;
  /** Lower-cased haystack, built once so filtering never rebuilds it. */
  search: string;
};

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

/** The ranks the app already treats as "core" vocabulary elsewhere. */
export const COMMON_RANK_LIMIT = 1200;

export const IMPORT_POS_GROUPS: { id: string; label: string; match: RegExp }[] = [
  { id: "noun", label: "Nouns", match: /\bnoun\b/i },
  // "adverb" contains "verb", which is exactly the bug that once routed every
  // adverb into the verb bucket. Word boundary on both sides, and adverbs get
  // their own group rather than being swept in.
  { id: "verb", label: "Verbs", match: /(^|\s)verbs?\b/i },
  { id: "adjective", label: "Adjectives", match: /\badjectives?\b/i },
  { id: "adverb", label: "Adverbs", match: /\badverbs?\b/i },
  { id: "phraseish", label: "Phrases and idioms", match: /\b(phrase|idiom|reaction|connector)\b/i },
];

/**
 * Does a stated level satisfy a filter?
 *
 * The data is not uniformly a single letter-digit: nine entries carry ranges
 * like "A2-B2", and dropping those from an A2 filter would quietly hide
 * material the learner asked for. A range matches every level inside it.
 */
export function levelMatches(stated: string | undefined, wanted: CefrLevel): boolean {
  if (!stated) return false;
  const value = stated.trim().toUpperCase();
  if (value === wanted) return true;
  const range = /^([ABC][12])\s*[-–]\s*([ABC][12])$/.exec(value);
  if (!range) return false;
  const order = CEFR_LEVELS as readonly string[];
  const from = order.indexOf(range[1]);
  const to = order.indexOf(range[2]);
  const target = order.indexOf(wanted);
  if (from < 0 || to < 0 || target < 0) return false;
  return target >= Math.min(from, to) && target <= Math.max(from, to);
}

export function buildImportPool(apiParts: Record<string, unknown>): ImportItem[] {
  const pool: ImportItem[] = [];

  for (const word of buildWordCatalog(apiParts as Record<string, never>)) {
    const entry = word as unknown as {
      id: string; de: string; en: string; lookup?: string; pos?: string;
      use?: string; level?: string; partKey?: string;
    };
    if (!entry.de || !entry.en) continue;
    pool.push({
      id: `w:${entry.id}`,
      de: entry.de,
      en: entry.en,
      kind: "word",
      level: entry.level,
      pos: entry.pos,
      packKey: entry.partKey,
      hint: entry.use,
      rank: frequencyRank(entry.lookup || entry.de),
      search: `${entry.de} ${entry.en} ${entry.use ?? ""} ${entry.pos ?? ""}`.toLocaleLowerCase(),
    });
  }

  for (const item of buildCatalog(apiParts as Record<string, never>)) {
    if (!item.de || !item.en) continue;
    pool.push({
      id: `p:${item.id}`,
      de: item.de,
      en: item.en,
      kind: "phrase",
      level: item.level,
      packKey: item.partKey,
      packLabel: item.partLabel,
      hint: item.use || item.when,
      rank: frequencyRank(item.lookup || item.de),
      search: `${item.de} ${item.en} ${item.use ?? ""} ${item.partLabel ?? ""}`.toLocaleLowerCase(),
    });
  }

  return pool;
}

export type ImportFilters = {
  query: string;
  kind: ImportKind | "all";
  level: CefrLevel | "all";
  pos: string | "all";
  pack: string | "all";
  commonOnly: boolean;
};

export const EMPTY_FILTERS: ImportFilters = {
  query: "",
  kind: "all",
  level: "all",
  pos: "all",
  pack: "all",
  commonOnly: false,
};

export function filtersAreEmpty(filters: ImportFilters): boolean {
  return (
    !filters.query.trim()
    && filters.kind === "all"
    && filters.level === "all"
    && filters.pos === "all"
    && filters.pack === "all"
    && !filters.commonOnly
  );
}

/**
 * Apply the filters.
 *
 * Sorted most-common-first, which is the order somebody building a set
 * actually wants: "the A1 nouns" should start with the A1 nouns they will
 * meet first, not alphabetically at Abend.
 */
export function filterImportPool(pool: ImportItem[], filters: ImportFilters): ImportItem[] {
  const needle = filters.query.trim().toLocaleLowerCase();
  const posGroup = IMPORT_POS_GROUPS.find((group) => group.id === filters.pos);

  const out = pool.filter((item) => {
    if (filters.kind !== "all" && item.kind !== filters.kind) return false;
    if (filters.level !== "all" && !levelMatches(item.level, filters.level)) return false;
    if (filters.commonOnly && item.rank > COMMON_RANK_LIMIT) return false;
    if (posGroup && !posGroup.match.test(item.pos ?? "")) return false;
    if (filters.pack !== "all" && item.packKey !== filters.pack) return false;
    if (needle && !item.search.includes(needle)) return false;
    return true;
  });

  return out.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.de.localeCompare(b.de, "de");
  });
}

/** Packs present in the pool, for the theme picker. */
export function importPacks(pool: ImportItem[]): { key: string; label: string; count: number }[] {
  const packs = new Map<string, { key: string; label: string; count: number }>();
  for (const item of pool) {
    if (!item.packKey) continue;
    const existing = packs.get(item.packKey);
    if (existing) existing.count += 1;
    else packs.set(item.packKey, { key: item.packKey, label: item.packLabel || item.packKey, count: 1 });
  }
  return [...packs.values()].sort((a, b) => b.count - a.count);
}

/**
 * How many a single "add all" may take.
 *
 * A filter can match seven thousand items and adding them all would make a
 * set nobody can study and a page nobody can scroll. The button says the
 * number it will actually add, so the cap is never a surprise.
 */
export const ADD_ALL_LIMIT = 250;
