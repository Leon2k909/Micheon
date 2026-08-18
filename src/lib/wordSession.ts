/**
 * Vocabulary sittings: single words, taught on their own.
 *
 * The course has carried thousands of authored words with English glosses
 * since the beginning, and none of them was ever taught: words only entered lessons
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
import { packMeta } from "@/lib/curriculum";
import { wordCommonality, type CorpusIndex } from "@/lib/corpusFrequency";
import { isDueForReview, isSnoozed, overdueBy, type GradeRecord } from "@/lib/memoryStrength";
import { lessonMixForBacklog } from "@/session";
import { canonicalWordSenseFor } from "@/lib/canonicalWordSenses";
import { sentenceIdentityKey } from "@/lib/germanTextMatch";
import {
  extraSynonymGroupKey,
  keepApartTag,
  primaryWordSense,
  wordMeaningKey,
  type WordSynonym,
} from "@/lib/wordSynonymGroups";

export type WordItem = {
  /** `vw-` + the lemma: global, not per pack, so "das Haus" is ONE word
   *  however many packs list it, and its progress follows the word. */
  id: string;
  /** Older ids for the same visible word, retained so progress survives
   * catalogue deduplication and is migrated on the next write. */
  aliases?: string[];
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
  /** Authored as the word's primary sense — see VocabSeed.core. */
  core?: boolean;
  /** False when contextual packs disagree and no standalone meaning has yet
   * been reviewed. Listen omits these rather than teaching an arbitrary
   * first-pack meaning passively. */
  listenSafe?: boolean;
  /** Less common same-meaning words folded into this card, most common first.
   * Their progress ids ride in `aliases`; see wordSynonymGroups.ts. */
  synonyms?: WordSynonym[];
  kind: "word";
  partKey: string;
  /** The owning pack's CEFR level — the ladder reads difficulty from it. */
  level?: string;
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

/** One word, article aside — "die Lüge" yes, "an etwas liegen" no. */
const isBareLemma = (de: string): boolean =>
  !/\s/.test(String(de ?? "").replace(/^(der|die|das)\s+/i, "").trim());

/**
 * Which of two packs' claims on one lemma should own the card.
 *
 * Curriculum order decides by default. It is overruled only when the later
 * claim is plainly the better card for the word itself: a seed marked as the
 * primary sense beats one that is not, and failing that, the bare word beats
 * an idiom built on it. Anything else keeps the incumbent, so this can never
 * turn into "last pack wins".
 */
const beatsExisting = (
  candidate: { de: string; core: boolean },
  existing: { de: string; core?: boolean }
): boolean => {
  if (candidate.core !== Boolean(existing.core)) return candidate.core;
  const candidateIsBare = isBareLemma(candidate.de);
  if (candidateIsBare !== isBareLemma(existing.de)) return candidateIsBare;
  return false;
};

/**
 * Every teachable word across the given packs, most common German first.
 *
 * Deduped by lemma: the same word listed by three packs is one entry, owned by
 * the first pack in the walk order (curriculum order, so early packs win) —
 * except where beatsExisting above hands the card to a better claim.
 * Words without a gloss are skipped rather than guessed at — a flashcard whose
 * back is empty teaches nothing.
 */
export function buildWordCatalog(apiParts: Record<string, any>): WordItem[] {
  const byLemma = new Map<string, WordItem>();
  const authoredGlosses = new Map<string, Set<string>>();
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
      // Packs conflict when they disagree about the MEANING, not the wording.
      // Comparing full gloss strings withheld 135 words whose packs agree —
      // "to learn" vs "to learn, to study" is one sense written twice, and
      // vielleicht sat out of Listen over exactly that. So the key is the
      // primary sense: the part a card would speak, stripped of alternatives,
      // parentheticals and function words. Motto-class conflicts ("theme" vs
      // "motto") still differ after this and still withhold. The same
      // normalisation decides synonym-card grouping in wordSynonymGroups.ts,
      // which is why it lives there.
      const primarySense = primaryWordSense(en);
      const glossKey = primarySense
        || en.toLocaleLowerCase("en-GB").replace(/[.!?]+$/u, "").replace(/\s+/g, " ");
      // Only seeds that SHOW the word vote on its standalone sense. An idiom
      // built on the lemma can never own the card (beatsExisting), so its
      // meaning must not veto the card either — "auf den Grund gehen" was
      // withholding plain Grund, and "ehrlich gesagt" plain ehrlich. A
      // reflexive form (sich kümmern) is the word shown in its real shape,
      // so it votes; anything longer is an idiom with its own meaning.
      const shown = de.replace(/^(der|die|das)\s+/i, "").replace(/^sich\s+/i, "").trim();
      const showsTheWord = !/\s/.test(shown)
        && shown.toLocaleLowerCase("de-DE") === lookup.replace(/^sich\s+/i, "").trim().toLocaleLowerCase("de-DE");
      if (showsTheWord) {
        if (!authoredGlosses.has(id)) authoredGlosses.set(id, new Set());
        authoredGlosses.get(id)?.add(glossKey);
      }
      // Several packs legitimately claim one lemma, and they do not all show
      // the word itself: a pack about causes lists "an etwas liegen", while the
      // pack that teaches position lists plain "liegen". First-pack-wins handed
      // the card to whichever happened to come first, so the vocabulary card
      // titled "liegen" taught "to be due to something" and the verb's actual
      // meaning was never shown, spoken in Listen, or exported to the
      // extension. Fifteen lemmas were being taught by an idiom this way.
      // A card for the bare word must teach the bare word; the idiom is already
      // taught properly as a sentence. Replacing keeps the Map's original
      // insertion slot, so the word stays where curriculum order put it.
      const existing = byLemma.get(id);
      if (existing && !beatsExisting({ de, core: Boolean(word?.core) }, existing)) continue;
      byLemma.set(id, {
        id, de, en, lookup,
        pos: word?.pos || word?.tip || undefined,
        use: word?.use || undefined,
        core: word?.core || undefined,
        kind: "word",
        partKey,
        level: (part as any)?.level ? String((part as any).level) : undefined,
      });
    }
  }
  const visibleWords = new Map<string, WordItem>();
  const deduped: WordItem[] = [];
  for (const word of byLemma.values()) {
    const reviewed = canonicalWordSenseFor(word.lookup);
    if (reviewed) {
      word.de = reviewed.de;
      word.en = reviewed.en;
      word.use = reviewed.use;
      word.pos = reviewed.pos ?? word.pos;
      word.level = reviewed.level ?? word.level;
      word.core = true;
      word.listenSafe = true;
    } else {
      // A seed explicitly marked `core` has already been reviewed as the
      // standalone sense, so contextual alternatives must not hide it.
      word.listenSafe = Boolean(word.core) || (authoredGlosses.get(word.id)?.size ?? 0) <= 1;
    }

    const visibleKey = sentenceIdentityKey(word.de).toLocaleLowerCase("de-DE");
    const existing = visibleWords.get(visibleKey);
    if (!existing) {
      const canonical = { ...word, aliases: [...(word.aliases ?? [])] };
      visibleWords.set(visibleKey, canonical);
      deduped.push(canonical);
      continue;
    }

    const answers = [...String(existing.en).split(/\s+\/\s+/u), ...String(word.en).split(/\s+\/\s+/u)];
    const seenAnswers = new Set<string>();
    existing.en = answers
      .map((answer) => answer.trim())
      .filter((answer) => {
        const key = sentenceIdentityKey(answer).toLocaleLowerCase("en-GB");
        if (!key || seenAnswers.has(key)) return false;
        seenAnswers.add(key);
        return true;
      })
      .join(" / ");
    existing.aliases = [...new Set([
      ...(existing.aliases ?? []),
      word.id,
      ...(word.aliases ?? []),
    ])].filter((id) => id && id !== existing.id);
    existing.listenSafe = Boolean(existing.listenSafe || word.listenSafe);
  }
  return consolidateSynonymGroups(deduped);
}

/** Every English alternative once, first spelling wins — the same join the visible-word dedup uses. */
const mergeEnglishAlternatives = (values: string[]): string => {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const answer of values.flatMap((value) => String(value ?? "").split(/\s+\/\s+/u))) {
    const trimmed = answer.trim();
    const key = sentenceIdentityKey(trimmed).toLocaleLowerCase("en-GB");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(trimmed);
  }
  return merged.join(" / ");
};

/**
 * Combine same-meaning words into one card: the most common word fronts it,
 * the rest stay visible as its `synonyms`, most common first, and every
 * merged progress id becomes an alias so grades survive the fold. The rules
 * for what counts as "same meaning" — and the words deliberately kept apart —
 * live in wordSynonymGroups.ts.
 *
 * The combined card takes the EARLIEST member's slot, so curriculum order
 * still decides when the meaning is first met; within the group, frequency
 * rank decides who fronts the card (curriculum order breaks ties).
 */
function consolidateSynonymGroups(words: WordItem[]): WordItem[] {
  const groupKeyFor = (word: WordItem): string | null => {
    const extra = extraSynonymGroupKey(word.lookup || word.de);
    if (extra) return extra;
    // Only words shown as themselves merge; an idiom keeps its own card.
    const shown = word.de.replace(/^(der|die|das)\s+/i, "").replace(/^sich\s+/i, "").trim();
    if (!shown || /\s/.test(shown)) return null;
    const key = wordMeaningKey(word.en, word.de);
    if (!key) return null;
    const apart = keepApartTag(word.lookup || word.de);
    return apart ? `${key} ${apart}` : key;
  };

  const groups = new Map<string, number[]>();
  words.forEach((word, index) => {
    const key = groupKeyFor(word);
    if (!key) return;
    const members = groups.get(key) ?? [];
    members.push(index);
    groups.set(key, members);
  });

  const dropped = new Set<number>();
  const combinedAt = new Map<number, WordItem>();
  // Neutral everyday German fronts the card. The frequency bank decides, but
  // it does not rank slang — and the slang packs sit EARLY in the curriculum,
  // so curriculum order alone put "pennen" in front of "schlafen". A word
  // from a tier-note pack (niche/casual — always labelled) must never front
  // a standard word it happens to tie with.
  const tierNoted = (word: WordItem): number => (packMeta(word.partKey).note ? 1 : 0);
  for (const indexes of groups.values()) {
    if (indexes.length < 2) continue;
    const ordered = [...indexes].sort((a, b) =>
      frequencyRank(words[a].lookup || words[a].de) - frequencyRank(words[b].lookup || words[b].de)
      || tierNoted(words[a]) - tierNoted(words[b])
      || a - b
    );
    const face = words[ordered[0]];
    const rest = ordered.slice(1).map((index) => words[index]);
    const combined: WordItem = {
      ...face,
      en: mergeEnglishAlternatives([face.en, ...rest.map((word) => word.en)]),
      aliases: [...new Set([
        ...(face.aliases ?? []),
        ...rest.flatMap((word) => [word.id, ...(word.aliases ?? [])]),
      ])].filter((id) => id && id !== face.id),
      synonyms: [
        ...(face.synonyms ?? []),
        ...rest.map((word): WordSynonym => ({
          id: word.id,
          de: word.de,
          en: word.en,
          lookup: word.lookup,
          pos: word.pos,
          use: word.use,
          partKey: word.partKey,
          level: word.level,
        })),
      ],
    };
    const slot = Math.min(...indexes);
    for (const index of indexes) {
      if (index !== slot) dropped.add(index);
    }
    combinedAt.set(slot, combined);
  }
  if (!combinedAt.size) return words;
  return words.flatMap((word, index) => {
    const combined = combinedAt.get(index);
    if (combined) return [combined];
    return dropped.has(index) ? [] : [word];
  });
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

/**
 * The difficulty ladder, and how a sitting decides which rung to serve from.
 *
 * Michelle kept being handed "to be" and "to have" because words are served
 * most-common-first — right for a beginner, insulting for someone who reads
 * B2 English for fun. Leon's rule: if the learner keeps saying "Kann ich",
 * the words get harder. And later, once the hard tiers run dry, sittings
 * come BACK for the easy words that were skipped over — climbing must never
 * mean words go missing, only that they wait.
 *
 * Every word sits on a rung derived from its pack's CEFR level, with the
 * frequency bank splitting the beginner mass. The learner's own rung is
 * counted from their word grades: each known word is a step up (a "Kann ich"
 * press writes exactly such a grade, so mass-skipping basics climbs fast),
 * and each struggling word pulls DOWN twice as hard, because struggling at a
 * rung is the clearest sign it is high enough. Five knowns per rung — Leon
 * judged fifteen too slow, and the failure mode he was guarding against is
 * real: someone skipping easy material should feel the sittings harden
 * within one preview's worth of "Kann ich", not three. A genuine beginner
 * still climbs slowly, because earning five knowns takes days while
 * declaring five takes seconds — that difference is precisely what the
 * ladder exists to detect.
 *
 * Serving order is a PREFERENCE, never a filter: at-or-above the learner's
 * rung first (nearest rung first, most common first within it), then below,
 * nearest first. Every word remains reachable in every state of progress.
 */
export function wordLadderRung(word: Pick<WordItem, "level" | "lookup" | "de">): number {
  const level = String(word.level ?? "").toUpperCase();
  if (/^C/.test(level)) return 6;
  if (level.startsWith("B2-C")) return 5;
  if (level.startsWith("B2")) return 4;
  if (level.startsWith("B1")) return 3;
  // The A1-B1 mass is where nearly everything lives; the frequency bank is
  // what separates "sein" from a mid-pack A2 noun.
  const rank = frequencyRank(word.lookup || word.de);
  if (rank <= 300) return 1;
  if (rank <= 1200) return 2;
  return level.startsWith("A1") ? 1 : level.startsWith("A2") ? 2 : 3;
}

/** Where the learner currently stands, read from their word grades alone. */
export function learnerWordRung(
  grades: Record<string, GradeRecord | undefined>,
  now = Date.now()
): number {
  let known = 0;
  let struggling = 0;
  for (const [id, record] of Object.entries(grades ?? {})) {
    if (!id.startsWith(WORD_ID_PREFIX) || !record) continue;
    if (record.lastGrade === "know") known += 1;
    else if (record.lastGrade === "struggle" && !isSnoozed(record, now)) struggling += 1;
  }
  const score = known - struggling * 2;
  return Math.max(1, Math.min(6, 1 + Math.floor(score / 5)));
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
  const recordFor = (word: WordItem) => {
    for (const id of [word.id, ...(word.aliases ?? [])]) {
      const record = grades?.[id];
      if (record) return record;
    }
    return undefined;
  };

  const struggles: WordItem[] = [];
  const due: WordItem[] = [];
  let fresh: WordItem[] = [];
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

  // The ladder: serve new words from the learner's rung upward, nearest rung
  // first, most common first within a rung — then wrap DOWN to whatever was
  // skipped, so finishing the hard tiers brings the easy ones back. Stable
  // sort over the frequency-ranked input keeps in-rung order.
  const rung = learnerWordRung(grades, now);
  fresh = fresh
    .map((word, index) => ({ word, index, wordRung: wordLadderRung(word) }))
    .sort((a, b) =>
      (a.wordRung >= rung ? 0 : 1) - (b.wordRung >= rung ? 0 : 1)
      || Math.abs(a.wordRung - rung) - Math.abs(b.wordRung - rung)
      || a.index - b.index
    )
    .map((entry) => entry.word);
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
