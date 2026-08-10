/**
 * Vocabulary sittings: single words, taught on their own.
 *
 * The course has carried 3,961 authored words with English glosses since the
 * beginning, and none of them was ever taught: words only entered lessons
 * through hand-written example sentences, and no word has one. That gate is
 * deliberate — an isolated word is not a sentence, and the sentence course
 * must never pad itself with flashcards. It stays. This module is the OTHER
 * door: a sitting made only of words, started from its own button, tracked
 * under its own ids.
 *
 * ISOLATION IS THE CONTRACT HERE. Word progress lives under a `vw-` id
 * namespace that no sentence path constructs or looks up, so a word graded
 * here can never surface as a due review in a sentence sitting, and a
 * sentence grade can never mark a word learned. The only single words a
 * sentence sitting may contain remain the authored one-word PHRASES —
 * "Prost!", "Genau!" — which are sentences by intent: things you say on
 * their own.
 */
import { frequencyRank } from "@/lib/wordFrequency";
import { wordCommonality, type CorpusIndex } from "@/lib/corpusFrequency";
import { isDueForReview, isSnoozed, overdueBy, type GradeRecord } from "@/lib/memoryStrength";
import { lessonMixForBacklog } from "@/session";

export type WordItem = {
  /** `vw-` + the lemma: global, not per pack, so "das Haus" is ONE word
   *  however many packs list it, and its progress follows the word. */
  id: string;
  /** "das Haus" — the display form, article kept, always German. */
  de: string;
  /** "house" — the authored gloss. Direction handling is the session's job,
   *  same as for sentences: `de` is German, `en` is English, whichever the
   *  learner is producing. */
  en: string;
  /** Bare lemma, for frequency lookups and dictionary joins. */
  lookup: string;
  /** "noun" | "verb" | ... when the author said so. */
  pos?: string;
  use?: string;
  kind: "word";
  partKey: string;
};

const wordIdPart = (value: string) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "word";

export const WORD_ID_PREFIX = "vw-";

export function wordProgressId(lookupOrDe: string): string {
  return WORD_ID_PREFIX + wordIdPart(lookupOrDe);
}

/**
 * Every teachable word across the given packs, most common German first.
 *
 * Deduped by lemma: the same word listed by three packs is one entry, owned by
 * the first pack in the walk order (curriculum order, so early packs win).
 * Words without a gloss are skipped rather than guessed at — a flashcard whose
 * back is empty teaches nothing.
 */
export function buildWordCatalog(apiParts: Record<string, any>): WordItem[] {
  const byLemma = new Map<string, WordItem>();
  for (const [partKey, part] of Object.entries(apiParts ?? {})) {
    for (const word of (part as any)?.vocab ?? []) {
      const de = String(word?.de ?? "").trim();
      const en = String(word?.en ?? "").trim();
      const lookup = String(word?.lookup ?? de).trim();
      if (!de || !en) continue;
      // A handful of seeds are broken or misfiled, found by reading the
      // outliers rather than assumed: glosses that just repeat the German
      // ("das Haar in der Suppe" = "Haar in der Suppe"), and full sentences
      // parked in a vocab array. A card whose back repeats its front teaches
      // nothing, and sentences belong to the sentence course.
      const bareDe = de.toLowerCase().replace(/^(der|die|das)\s+/, "").replace(/[.!?]+$/, "");
      const bareEn = en.toLowerCase().replace(/^(der|die|das)\s+/, "").replace(/[.!?]+$/, "");
      if (bareDe === bareEn) continue;
      if (/[.!?]$/.test(de)) continue;
      const id = wordProgressId(lookup || de);
      if (byLemma.has(id)) continue;
      byLemma.set(id, {
        id, de, en, lookup,
        pos: word?.pos || word?.tip || undefined,
        use: word?.use || undefined,
        kind: "word",
        partKey,
      });
    }
  }
  return [...byLemma.values()];
}

/** Frequency-ranked: the words people actually meet come first. */
export function rankWordCatalog(catalog: WordItem[], corpusIndex: CorpusIndex | null = null): WordItem[] {
  return [...catalog]
    .map((word, index) => ({
      word,
      index,
      rank: frequencyRank(word.lookup || word.de),
      commonality: wordCommonality(word.lookup || word.de, corpusIndex),
    }))
    .sort((a, b) =>
      a.rank - b.rank
      || a.commonality - b.commonality
      || a.index - b.index
    )
    .map((entry) => entry.word);
}

export type WordStep = {
  type: "sentence";
  review?: boolean;
  reviewReason?: "struggle" | "due";
  interval?: number;
  overdue?: number;
  item: WordItem & { level?: string; mastery: "new" | "learning" | "strong" };
};

/**
 * One vocabulary sitting: at most six words, reviews first serving the same
 * promise sentences make — a due backlog trades new slots for review slots,
 * and the sitting never grows. Snooze is the learner's decision and outranks
 * everything, exactly as it does for sentences.
 *
 * Two words with the same gloss never share a sitting: the meaning-pick stage
 * builds its wrong answers from the other words on the table, and offering
 * "city" twice would make one of the two right answers "wrong".
 */
export function buildWordSitting(
  ranked: WordItem[],
  grades: Record<string, GradeRecord | undefined>,
  now = Date.now(),
  /** Mixed sittings hand words a smaller budget; alone, words get the full
   *  six-slot mix. Unused slots of either kind fall to the other, so two
   *  slots are two WORDS whenever two teachable words exist. */
  slots?: { reviewSlots: number; freshSlots: number }
): WordStep[] {
  const recordFor = (word: WordItem) => grades?.[word.id];

  const struggles: WordItem[] = [];
  const due: WordItem[] = [];
  const fresh: WordItem[] = [];
  for (const word of ranked) {
    const record = recordFor(word);
    if (isSnoozed(record, now)) continue;
    if (record?.lastGrade === "struggle") struggles.push(word);
    else if (record?.lastGrade === "know") {
      if (isDueForReview(record, now)) due.push(word);
      // Known and not due: resting. Words rest until their date, full stop —
      // there is no adaptive early recall here to keep the mode simple and
      // the promise legible.
    } else fresh.push(word);
  }
  due.sort((a, b) => overdueBy(recordFor(b), now) - overdueBy(recordFor(a), now));

  const mix = slots ?? lessonMixForBacklog(struggles.length + due.length);
  const usedGlosses = new Set<string>();
  const usedDe = new Set<string>();
  const claim = (word: WordItem) => {
    const gloss = word.en.trim().toLowerCase();
    const face = word.de.trim().toLowerCase();
    if (usedGlosses.has(gloss) || usedDe.has(face)) return false;
    usedGlosses.add(gloss);
    usedDe.add(face);
    return true;
  };

  const take = (pool: WordItem[], limit: number) => {
    const out: WordItem[] = [];
    for (const word of pool) {
      if (out.length >= limit) break;
      if (claim(word)) out.push(word);
    }
    return out;
  };

  const reviewPicks = take([...struggles, ...due], mix.reviewSlots);
  const freshPicks = take(fresh, mix.freshSlots + (mix.reviewSlots - reviewPicks.length));

  const asStep = (word: WordItem, review: boolean): WordStep => {
    const record = recordFor(word);
    return {
      type: "sentence",
      ...(review
        ? {
            review: true,
            reviewReason: record?.lastGrade === "struggle" ? "struggle" : "due",
            interval: Number(record?.intervalDays) || 1,
            overdue: overdueBy(record, now),
          }
        : {}),
      item: { ...word, mastery: review ? "learning" : "new" },
    };
  };

  // New words first, then reviews — the same order a sentence sitting uses.
  return [
    ...freshPicks.map((word) => asStep(word, false)),
    ...reviewPicks.map((word) => asStep(word, true)),
  ];
}
