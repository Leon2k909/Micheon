// Guided session engine — every step is a full sentence exercise

import { isDueForReview, overdueBy } from "@/lib/memoryStrength";
import { frequencyRank } from "@/lib/wordFrequency";
import { packMeta } from "@/lib/curriculum";
import { getLearningMode, phraseForLearningMode } from "@/lib/learningMode";
import { matchingVisibleKeys, takeMatchingSafe } from "@/lib/germanTextMatch";
import {
  adaptiveRepeatPriority,
  isAdaptiveReinforcementEligible,
  isAttemptedPracticeEligible,
} from "@/lib/adaptivePractice";

export const EX = {
  SENTENCE: "sentence",   // read + listen + speak + type a full sentence
  DIALOGUE: "dialogue",   // line-by-line conversation practice
  COMPLETE: "complete",
};

function shuffle(arr: any[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hasSentenceShape(text: string) {
  return String(text ?? "").trim().split(/\s+/).filter(Boolean).length >= 1;
}

function stableIdPart(value: any) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function getVocabId(partKey: string, word: any, index: number) {
  if (word?.id) return String(word.id);
  const semanticKey = word?.lookup || word?.de || word?.word || index;
  return `${partKey}-vocab-${stableIdPart(semanticKey)}`;
}

function findRecord(reviewState: any, itemId: string, aliases: string[] = []) {
  for (const id of [itemId, ...aliases]) {
    const rec = reviewState?.[id];
    if (rec?.lastGrade) return rec;
  }
  return undefined;
}

// "Known" only holds until the item's spaced-repetition review comes due —
// then it re-enters lessons as a review.
function isKnownItem(reviewState: any, itemId: string, aliases: string[] = []) {
  const rec = findRecord(reviewState, itemId, aliases);
  return rec?.lastGrade === "know" && !isDueForReview(rec);
}

/**
 * Build a session where every step is a full-sentence exercise.
 * Every sentence is hand-written: vocab words appear only through their
 * predefined example sentences; phrases and dialogue lines are used as-is.
 */
export function buildSession(part: any, studyItems: any[], reviewState: any, _reviewStep: number) {
  const partKey = part.partKey ?? "part";
  const vocab: any[]     = part.vocab     ?? [];
  const phrases: any[]   = part.phrases   ?? [];
  const dialogues: any[] = part.dialogues ?? [];
  const learningMode = getLearningMode();

  const queue: any[] = [];
  const usedSentences = new Set<string>();
  // Niche/casual packs label every item so uncommon German is never
  // mistaken for the everyday thing to say.
  const tierNote = packMeta(partKey).note;
  const coachingLanguage = part.coachingLanguage;

  /**
   * How well this phrase is already known, so a lesson can stop drilling
   * something the learner has recalled correctly several times running.
   *
   * "strong" needs BOTH a real run of successes and a spacing interval that
   * only comes from surviving earlier reviews — one lucky "Know it" click
   * cannot reach it, and a struggle resets the run to zero (see recordSuccess).
   */
  const masteryOf = (rec: any): "new" | "learning" | "strong" => {
    if (!rec || rec.lastGrade !== "know") return rec ? "learning" : "new";
    const successes = Number(rec.successes) || 0;
    const interval = Number(rec.intervalDays) || 0;
    if (successes >= 3 && interval >= 10) return "strong";
    return "learning";
  };

  const addSentence = (de: string, en: string, id: string, aliases: string[] = [], fr?: string, use?: string, lookup?: string, short?: string, when?: string, say?: string, long?: string, group?: string) => {
    const key = de.trim().toLowerCase();
    if (usedSentences.has(key)) return;
    // Claim this sentence text up front, even if we're about to skip it for being
    // known. The same German sentence appears in the data under several ids (e.g.
    // as a vocab example AND a phrase). Without claiming it here, marking one copy
    // "known" would skip that id but let an identical sentence with a different id
    // slip back in on the next session.
    usedSentences.add(key);
    const rec = findRecord(reviewState, id, aliases);
    const progressRecord = findProgressRecord(reviewState, id, aliases);
    const item = {
      id, aliases, de, en, fr, use, lookup, tierNote, coachingLanguage,
      short, when, say, long, group, level: part.level, mastery: masteryOf(progressRecord),
    };
    if (isAttemptedPracticeEligible(progressRecord)) {
      // Reaching and answering a sentence makes it familiar, even when the
      // learner skips before earning a grade. Bring it back quickly without
      // spending one of the lesson's three genuinely new slots.
      queue.push({
        type: EX.SENTENCE,
        review: true,
        reviewReason: "attempted",
        optionalPractice: true,
        repeatPriority: adaptiveRepeatPriority(progressRecord, item),
        interval: 0,
        item,
      });
      return;
    }
    if (rec?.lastGrade === "struggle") {
      queue.push({ type: EX.SENTENCE, review: true, reviewReason: "struggle", interval: 0, item });
      return;
    }
    if (rec?.lastGrade === "know") {
      if (!isDueForReview(rec)) {
        if (!isAdaptiveReinforcementEligible(rec, item)) return;
        // Difficult sentences and phrases with repeated wrong attempts can use
        // a familiar slot before their formal SRS date. This is optional
        // reinforcement only: it never moves the mastery due date.
        queue.push({
          type: EX.SENTENCE,
          review: true,
          reviewReason: "adaptive",
          reinforcement: true,
          repeatPriority: adaptiveRepeatPriority(rec, item),
          interval: rec.intervalDays ?? 1,
          item,
        });
        return;
      }
      // interval = how many days it's currently spaced by (1 = learned ~a day
      // ago and weakest; larger = higher mastery). The review picker uses it to
      // favour recent phrases and mix in one older one.
      queue.push({ type: EX.SENTENCE, review: true, overdue: overdueBy(rec), interval: rec.intervalDays ?? 1, item });
      return;                                            // due — back in as a review
    }
    queue.push({ type: EX.SENTENCE, item });
  };

  // ── Vocab words ──────────────────────────────────────────────
  // Hand-written example sentences ONLY. Words without a predefined example
  // (and its predefined translation) are skipped — no fabricated carrier
  // drills ("Ich sehe den …"), no guessed translations.
  vocab.forEach((word, i) => {
    const id = getVocabId(partKey, word, i);
    const aliases = [`${partKey}-vocab-${i}`];
    if (hasSentenceShape(word.example) &&
        word.example.trim().toLowerCase() !== word.de.trim().toLowerCase() &&
        word.exampleEn?.trim()) {
      addSentence(word.example, word.exampleEn, id, aliases, word.exampleFr, word.use, word.lookup ?? word.de);
    }
  });

  // ── Phrases ──────────────────────────────────────────────────
  phrases.forEach((ph, i) => {
    if (!hasSentenceShape(ph.de)) return;
    const lessonPhrase = phraseForLearningMode(ph, learningMode);
    addSentence(
      lessonPhrase.de,
      lessonPhrase.en,
      // Bundled phrases have no id and stay index-keyed. Learner-added ones
      // carry their own, because deleting one from the middle of a custom pack
      // would otherwise shift every id after it onto the wrong word, handing
      // them somebody else's grade history.
      ph.id ?? `${partKey}-phrase-${i}`,
      [],
      lessonPhrase.fr,
      lessonPhrase.use,
      undefined,
      lessonPhrase.short,
      lessonPhrase.when,
      lessonPhrase.say,
      lessonPhrase.long,
      lessonPhrase.group
    );
  });

  // ── Dialogue lines ───────────────────────────────────────────
  dialogues.forEach((d, di) => {
    const usable = (d.lines ?? [])
      .map((line: any, li: number) => ({
        ...phraseForLearningMode(line, learningMode),
        originalIndex: li,
        id: line?.id ?? `${partKey}-dlg-${di}-${li}`,
      }))
      .filter((line: any, li: number) => {
        if (!hasSentenceShape(line.de)) return false;
        const legacyDialogueId = `dialogue-${d?.title ?? "line"}-${li}-${line?.de ?? ""}`;
        if (!isKnownItem(reviewState, line.id, [legacyDialogueId])) return true;
        const rec = findRecord(reviewState, line.id, [legacyDialogueId]);
        return isAdaptiveReinforcementEligible(rec, { ...line, level: part.level });
      });
    const newDialogueLines = usable.filter((line: any) => {
      const legacyDialogueId = `dialogue-${d?.title ?? "line"}-${line.originalIndex}-${line?.de ?? ""}`;
      const progressRecord = findProgressRecord(reviewState, line.id, [legacyDialogueId]);
      // Dialogue capstones only contain genuinely unseen lines. Attempted,
      // struggling and adaptive-known lines still receive their individual
      // sentence drill, but completing a fresh dialogue must not accidentally
      // promote their spaced-review grade.
      return !progressRecord?.lastGrade && !isAttemptedPracticeEligible(progressRecord);
    });
    if (newDialogueLines.length >= 2) {
      // First show the full dialogue for context
      // A difficult known line may return as an individual adaptive review,
      // but it must not be smuggled into a fresh-dialogue capstone: completing
      // that dialogue would otherwise advance its formal SRS schedule.
      queue.push({ type: EX.DIALOGUE, dialogue: { ...d, coachingLanguage, lines: newDialogueLines } });
    }
    // Then drill each new or adaptively selected line as a sentence exercise.
    usable.forEach((line: any) => {
      const legacyDialogueId = `dialogue-${d?.title ?? "line"}-${line.originalIndex}-${line?.de ?? ""}`;
      addSentence(
        line.de,
        line.en,
        line.id,
        [`${partKey}-dlg-${di}-${line.originalIndex}`, legacyDialogueId],
        line.fr,
        line.use,
        undefined,
        line.short,
        line.when,
        line.say,
        line.long,
        line.group
      );
    });
  });

  // ── New phrases: 3 per lesson, most common first, no in-lesson repeat ──
  // A phrase is shown ONCE when new. Its repetition now happens ACROSS
  // lessons: it returns tomorrow as an "old" review, and the spaced-repetition
  // ladder pushes it further out each time you recall it (1, 3, 10, 30, 180
  // days) — so it takes longer and longer to come back as you master it.
  // Reviews win a visible-answer collision because their schedule is
  // time-sensitive. Fresh selection then scans farther down the pack to fill
  // its slots without producing an impossible Quick Match round.
  const reviews = pickReviews(queue.filter((s) => s.review), OLD_PER_LESSON);
  const reviewKeys = reviews.flatMap(matchingKeysForStep);
  const freshSentences = pickFresh(
    shuffle(queue.filter((s) => s.type === EX.SENTENCE && !s.review))
      .sort((a, b) => {
        return frequencyRank(a.item?.lookup) - frequencyRank(b.item?.lookup);
      }),
    NEW_PER_LESSON,
    reviewKeys
  );
  const servedDe = new Set(freshSentences.map((s) => String(s.item?.de ?? "").trim().toLowerCase()));

  // ── Dialogues are capstones, placed right after their lines are drilled ──
  // Only run a dialogue when a line of it was drilled this lesson, so a capped
  // lesson never opens a conversation whose lines you haven't seen.
  const newBlock: any[] = [...freshSentences];
  const dialogueSteps = queue
    .filter((s) => s.type === EX.DIALOGUE)
    .filter((d: any) => (d.dialogue?.lines ?? []).some((l: any) => servedDe.has(String(l.de ?? "").trim().toLowerCase())));
  for (const d of dialogueSteps) {
    const lineTexts = new Set(
      (d.dialogue?.lines ?? []).map((l: any) => String(l.de ?? "").trim().toLowerCase())
    );
    let lastIdx = -1;
    newBlock.forEach((s, i) => {
      if (s.type === EX.SENTENCE && lineTexts.has(String(s.item?.de ?? "").trim().toLowerCase())) lastIdx = i;
    });
    if (lastIdx === -1) newBlock.push(d);
    else newBlock.splice(lastIdx + 1, 0, d);
  }

  // 3 new, then 3 old.
  const ordered = [...newBlock, ...reviews];
  ordered.push({ type: EX.COMPLETE });
  return ordered;
}

/** At most NEW_PER_LESSON brand-new phrases per lesson. */
const NEW_PER_LESSON = 3;
/** At most OLD_PER_LESSON due reviews per lesson. */
export const OLD_PER_LESSON = 3;

/**
 * A newly learned phrase may return in the familiar half before tomorrow's
 * formal review, but only while it is still on the first two ladder rungs.
 * Items explicitly declared known start near the top of the ladder, so this
 * deliberately honours "Know it" and leaves those items alone until due.
 */
export function isReinforcementEligible(record: any, now = Date.now()): boolean {
  if (!record || record.lastGrade !== "know" || record.permanent || isDueForReview(record, now)) return false;
  // Old installs stored only { lastGrade, updatedAt }. There is no evidence
  // that those items were explicitly skipped, so let them occupy the familiar
  // half and rotate without changing their inferred review schedule.
  if (record.successes == null && record.intervalDays == null) return true;
  const successes = Number(record.successes);
  const intervalDays = Number(record.intervalDays);
  return Number.isFinite(successes)
    && Number.isFinite(intervalDays)
    && successes > 0
    && successes <= 2
    && intervalDays <= 3;
}

function findProgressRecord(reviewState: any, itemId: string, aliases: string[] = []) {
  const ids = [itemId, ...aliases];
  const graded = ids.map((id) => reviewState?.[id]).find((rec) => rec?.lastGrade);
  return graded ?? ids.map((id) => reviewState?.[id]).find((rec) => rec && typeof rec === "object");
}

/**
 * When a selected phrase belongs to a related set, keep the rest of the lesson
 * in that set where possible. This teaches contrasts such as Bis gleich / Bis
 * später / Bis bald together instead of scattering them across the course.
 */
const matchingPairForStep = (step: any) => ({
  german: String(step?.item?.de ?? ""),
  english: String(step?.item?.en ?? ""),
});

const matchingKeysForStep = (step: any) => {
  const pair = matchingPairForStep(step);
  return matchingVisibleKeys(pair.german, pair.english);
};

export function pickFresh(fresh: any[], n: number, blockedKeys: Iterable<string> = []): any[] {
  const first = fresh[0];
  const group = first?.item?.group;
  if (!group) return takeMatchingSafe(fresh, n, matchingPairForStep, blockedKeys);

  const related = fresh.filter((step) => step.item?.group === group);
  const others = fresh.filter((step) => step.item?.group !== group);
  return takeMatchingSafe([...related, ...others], n, matchingPairForStep, blockedKeys);
}

/**
 * Choose which due reviews to show. Favours the WEAKEST memories (shortest
 * spacing interval — usually phrases learned a day or two ago) for most of the
 * slots, and reserves one slot for a more-mastered OLDER phrase, so a lesson's
 * "old" half is mostly recent with an occasional long-tail review. Deduped by
 * both visible matching columns; ties are broken by most-overdue.
 */
export function pickReviews(
  due: any[],
  n: number,
  blockedKeys: Iterable<string> = []
): any[] {
  const isOptionalFamiliar = (step: any) => Boolean(
    step?.reinforcement || step?.optionalPractice || step?.reviewReason === "attempted"
  );
  const weakestFirst = [...due].sort((a, b) =>
    Number(isOptionalFamiliar(a)) - Number(isOptionalFamiliar(b))
    || (a.interval ?? 1) - (b.interval ?? 1)
    || (b.repeatPriority ?? 0) - (a.repeatPriority ?? 0)
    || (b.overdue ?? 0) - (a.overdue ?? 0)
  );
  const uniquePool = takeMatchingSafe(
    weakestFirst,
    weakestFirst.length,
    matchingPairForStep,
    blockedKeys
  );
  // Optional adaptive/attempted reps never displace formal due reviews.
  const formalReviews = uniquePool.filter((step) => !isOptionalFamiliar(step));
  const uniqueWeakest = formalReviews.length >= n ? formalReviews : uniquePool;
  if (uniqueWeakest.length <= n) return uniqueWeakest;
  
  const firstGroup = uniqueWeakest[0]?.item?.group;
  if (firstGroup) {
    const groupMatches = uniqueWeakest.filter((r) => r.item?.group === firstGroup);
    if (groupMatches.length > 1) {
      const rest = uniqueWeakest.filter((r) => r.item?.group !== firstGroup);
      return [...groupMatches, ...rest].slice(0, n);
    }
  }

  const picks: any[] = uniqueWeakest.slice(0, Math.max(0, n - 1));   // n-1 most-recent/weakest
  const has = (r: any) => picks.includes(r);
  const older = [...uniqueWeakest]
    .sort((a, b) => (b.interval ?? 1) - (a.interval ?? 1) || (b.overdue ?? 0) - (a.overdue ?? 0))
    .find((r) => !has(r));                                          // one most-mastered, not already picked
  if (older) picks.push(older);
  for (const r of uniqueWeakest) { if (picks.length >= n) break; if (!has(r)) picks.push(r); }  // backfill
  return picks.slice(0, n);
}

/** Urgent attempts first; within each kind, rotate the least-recently seen. */
export function rankReinforcementCandidates<T extends { successes: number; lastPractised: number; index: number; practiceUrgency?: number; repeatPriority?: number }>(
  candidates: T[]
): T[] {
  return [...candidates].sort((a, b) =>
    (b.practiceUrgency ?? 0) - (a.practiceUrgency ?? 0)
    || a.lastPractised - b.lastPractised
    || (b.repeatPriority ?? 0) - (a.repeatPriority ?? 0)
    || a.successes - b.successes
    || a.index - b.index
  );
}

/**
 * Build Continue Learning's review and fresh halves without letting a weak
 * backlog consume the whole lesson. Explicit struggles own the first review
 * slots, ordinary due reviews come next, and weak recently learned phrases
 * backfill any remaining familiar slots. Genuinely new phrases are selected
 * independently. Visible primary answers are deduped across BOTH languages,
 * because Quick Match can be flipped in either direction.
 */
export function selectContinueLearningMix(
  rankedFresh: any[],
  struggling: any[],
  due: any[],
  freshLimit = NEW_PER_LESSON,
  reviewLimit = OLD_PER_LESSON,
  reinforcement: any[] = [],
  _targetField: "de" | "en" = "de"
): { fresh: any[]; reviews: any[] } {
  const takeUnique = (steps: any[], limit: number, blocked = new Set<string>()) => {
    return takeMatchingSafe(steps, limit, matchingPairForStep, blocked);
  };

  const priorityReviews = takeUnique(struggling, reviewLimit);
  const selectedReviewKeys = new Set(priorityReviews.flatMap(matchingKeysForStep));
  const duePool = takeUnique(due, due.length, selectedReviewKeys);
  const dueReviews = pickReviews(
    duePool,
    Math.max(0, reviewLimit - priorityReviews.length),
    selectedReviewKeys
  );
  const scheduledReviews = [...priorityReviews, ...dueReviews];
  const scheduledReviewKeys = new Set(scheduledReviews.flatMap(matchingKeysForStep));
  const reinforcementReviews = takeUnique(
    reinforcement,
    Math.max(0, reviewLimit - scheduledReviews.length),
    scheduledReviewKeys
  );
  const reviews = [...scheduledReviews, ...reinforcementReviews];
  const reviewKeys = new Set(reviews.flatMap(matchingKeysForStep));
  const fresh = takeUnique(rankedFresh, freshLimit, reviewKeys);

  return { fresh, reviews };
}

/**
 * Replace a preview card without introducing German or English text already
 * visible in another card. Candidates remain curriculum-ranked; the active
 * pack wins when it has a safe replacement, then the global list backfills it.
 */
export function pickPreviewReplacement(
  candidates: any[],
  blockedPairs: Iterable<{ de: string; en: string }>,
  preferredPart?: string
) {
  const blocked = new Set(
    Array.from(blockedPairs).flatMap((pair) => matchingVisibleKeys(pair.de, pair.en))
  );
  const available = takeMatchingSafe(
    candidates,
    candidates.length,
    (item) => ({ german: String(item?.de ?? ""), english: String(item?.en ?? "") }),
    blocked
  );
  return available.find((item) => item.partKey === preferredPart) ?? available[0];
}

// ── Catalog of every learnable item (for the word/sentence tracker) ──
export type CatalogItem = {
  id: string;
  aliases?: string[];
  de: string;
  en: string;
  kind: "vocab" | "phrase" | "dialogue";
  partKey: string;
  partLabel: string;
  level?: string;
  lookup?: string;
  /** usage context from the data, e.g. "Informal", "Asking the time" */
  use?: string;
  fr?: string;
  short?: string;
  when?: string;
  say?: string;
  long?: string;
  group?: string;
  lessonPriority?: number;
  tierNote?: string;
  coachingLanguage?: "de" | "en" | "both";
};

/**
 * Produce every learnable item for a part using the SAME stable IDs that
 * buildSession assigns, so the tracker and the lesson engine stay in sync.
 */
export function buildPartCatalog(part: any, partKey: string): CatalogItem[] {
  const vocab: any[]     = part?.vocab     ?? [];
  const phrases: any[]   = part?.phrases   ?? [];
  const dialogues: any[] = part?.dialogues ?? [];
  const partLabel = part?.theme ?? part?.label ?? partKey;
  const level = part?.level;
  const tierNote = packMeta(partKey).note;
  const out: CatalogItem[] = [];
  const seen = new Set<string>();
  const learningMode = getLearningMode();

  const push = (
    de: string,
    en: string,
    id: string,
    kind: CatalogItem["kind"],
    lookup?: string,
    aliases: string[] = [],
    use?: string,
    coaching: Partial<Pick<CatalogItem, "fr" | "short" | "when" | "say" | "long" | "group" | "lessonPriority">> = {}
  ) => {
    const key = de.trim().toLowerCase();
    if (!de.trim() || seen.has(key)) return;
    seen.add(key);
    out.push({ id, aliases, de, en, kind, partKey, partLabel, level, lookup, use, tierNote, coachingLanguage: part?.coachingLanguage, ...coaching });
  };

  // Hand-written examples only — mirrors buildSession, so the tracker
  // never lists a sentence the lessons cannot teach.
  vocab.forEach((word, i) => {
    const id = getVocabId(partKey, word, i);
    const aliases = [`${partKey}-vocab-${i}`];
    if (hasSentenceShape(word.example) &&
        word.example.trim().toLowerCase() !== word.de.trim().toLowerCase() &&
        word.exampleEn?.trim()) {
      push(word.example, word.exampleEn, id, "vocab", word.lookup ?? word.de, aliases, word.use, {
        fr: word.exampleFr,
      });
    }
  });

  phrases.forEach((ph, i) => {
    if (!hasSentenceShape(ph.de)) return;
    const catalogPhrase = phraseForLearningMode(ph, learningMode);
    push(catalogPhrase.de, catalogPhrase.en, ph.id ?? `${partKey}-phrase-${i}`, "phrase", undefined, [], catalogPhrase.use, {
      fr: catalogPhrase.fr,
      short: catalogPhrase.short,
      when: catalogPhrase.when,
      say: catalogPhrase.say,
      long: catalogPhrase.long,
      group: catalogPhrase.group,
      lessonPriority: catalogPhrase.lessonPriority,
    });
  });

  dialogues.forEach((d, di) => {
    (d.lines ?? []).forEach((line: any, li: number) => {
      if (!hasSentenceShape(line.de)) return;
      const catalogLine = phraseForLearningMode(line, learningMode);
      const id = line?.id ?? `${partKey}-dlg-${di}-${li}`;
      const legacyDialogueId = `dialogue-${d?.title ?? "line"}-${li}-${line?.de ?? ""}`;
      push(catalogLine.de, catalogLine.en, id, "dialogue", undefined, [`${partKey}-dlg-${di}-${li}`, legacyDialogueId], catalogLine.use, {
        fr: catalogLine.fr,
        short: catalogLine.short,
        when: catalogLine.when,
        say: catalogLine.say,
        long: catalogLine.long,
        group: catalogLine.group,
      });
    });
  });

  return out;
}

/**
 * One catalogue per parts map, shared by everyone who asks for it.
 *
 * Four separate places build this from the same object — the word tracker, the
 * tests bank, the games deck and the mascot's quiz pool — and each was walking
 * all 8,000 items again. The parts map is built once and then never mutated, so
 * its identity is a safe key; a WeakMap means it is collected with the map
 * rather than pinning the whole course in memory.
 *
 * The array is returned as-is rather than copied. Callers already treat it as
 * read-only (they filter and map, which allocate their own arrays), and copying
 * 8,000 items on every call would give back most of what the cache saves.
 */
const catalogCache = new WeakMap<object, { mode: string; items: CatalogItem[] }>();

export function buildCatalog(apiParts: Record<string, any>): CatalogItem[] {
  // The learning mode is part of the answer, not just of the input: it decides
  // whether a phrase is taught in its short spoken form or its full one. Keying
  // on the parts map alone would keep serving the old wording after the setting
  // changed, which is a far worse bug than the one being fixed.
  const mode = String(getLearningMode());
  const cacheable = Boolean(apiParts) && typeof apiParts === "object";
  if (cacheable) {
    const cached = catalogCache.get(apiParts);
    if (cached && cached.mode === mode) return cached.items;
  }
  const out: CatalogItem[] = [];
  for (const [partKey, part] of Object.entries(apiParts ?? {})) {
    out.push(...buildPartCatalog({ ...part, partKey }, partKey));
  }
  if (cacheable) catalogCache.set(apiParts, { mode, items: out });
  return out;
}
