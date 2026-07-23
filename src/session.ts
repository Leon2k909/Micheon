// Guided session engine — every step is a full sentence exercise

import { isDueForReview, overdueBy } from "@/lib/memoryStrength";
import { frequencyRank } from "@/lib/wordFrequency";
import { packMeta } from "@/lib/curriculum";
import { getLearningMode, phraseForLearningMode } from "@/lib/learningMode";

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
    if (rec?.lastGrade === "know") {
      if (!isDueForReview(rec)) return;                 // still remembered — skip
      // interval = how many days it's currently spaced by (1 = learned ~a day
      // ago and weakest; larger = higher mastery). The review picker uses it to
      // favour recent phrases and mix in one older one.
      queue.push({ type: EX.SENTENCE, review: true, overdue: overdueBy(rec), interval: rec.intervalDays ?? 1, item: { id, de, en, fr, use, lookup, tierNote, short, when, say, long, group } });
      return;                                            // due — back in as a review
    }
    queue.push({ type: EX.SENTENCE, item: { id, de, en, fr, use, lookup, tierNote, short, when, say, long, group } });
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
      `${partKey}-phrase-${i}`,
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
        return !isKnownItem(reviewState, line.id, [legacyDialogueId]);
      });
    if (usable.length >= 2) {
      // First show the full dialogue for context
      queue.push({ type: EX.DIALOGUE, dialogue: { ...d, lines: usable } });
      // Then drill each line as a sentence exercise
      usable.forEach((line: any) => {
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`], line.fr, line.use, undefined, line.short, line.when, line.say, line.long, line.group);
      });
    } else {
      usable.forEach((line: any) => {
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`], line.fr, line.use, undefined, line.short, line.when, line.say, line.long, line.group);
      });
    }
  });

  // ── New phrases: 3 per lesson, most common first, no in-lesson repeat ──
  // A phrase is shown ONCE when new. Its repetition now happens ACROSS
  // lessons: it returns tomorrow as an "old" review, and the spaced-repetition
  // ladder pushes it further out each time you recall it (1, 3, 10, 30, 180
  // days) — so it takes longer and longer to come back as you master it.
  const freshSentences = pickFresh(
    shuffle(queue.filter((s) => s.type === EX.SENTENCE && !s.review))
      .sort((a, b) => frequencyRank(a.item?.lookup) - frequencyRank(b.item?.lookup)),
    NEW_PER_LESSON
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

  // ── Old phrases: up to 3 due reviews — mostly recent, plus one older ──
  const reviews = pickReviews(queue.filter((s) => s.review), OLD_PER_LESSON);

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
 * When a selected phrase belongs to a related set, keep the rest of the lesson
 * in that set where possible. This teaches contrasts such as Bis gleich / Bis
 * später / Bis bald together instead of scattering them across the course.
 */
export function pickFresh(fresh: any[], n: number): any[] {
  if (fresh.length <= n) return fresh;
  const first = fresh[0];
  const group = first?.item?.group;
  if (!group) return fresh.slice(0, n);

  const related = fresh.filter((step) => step.item?.group === group);
  const others = fresh.filter((step) => step.item?.group !== group);
  return [...related, ...others].slice(0, n);
}

/**
 * Choose which due reviews to show. Favours the WEAKEST memories (shortest
 * spacing interval — usually phrases learned a day or two ago) for most of the
 * slots, and reserves one slot for a more-mastered OLDER phrase, so a lesson's
 * "old" half is mostly recent with an occasional long-tail review. Deduped by
 * German text; ties broken by most-overdue.
 */
export function pickReviews(due: any[], n: number): any[] {
  if (due.length <= n) return due;
  const weakestFirst = [...due].sort((a, b) => (a.interval ?? 1) - (b.interval ?? 1) || (b.overdue ?? 0) - (a.overdue ?? 0));
  
  const firstGroup = weakestFirst[0]?.item?.group;
  if (firstGroup) {
    const groupMatches = weakestFirst.filter((r) => r.item?.group === firstGroup);
    if (groupMatches.length > 1) {
      const picks: any[] = [];
      for (const r of groupMatches) {
        if (picks.length >= n) break;
        picks.push(r);
      }
      for (const r of weakestFirst) {
        if (picks.length >= n) break;
        if (!picks.some((p) => p.item?.de === r.item?.de)) picks.push(r);
      }
      return picks.slice(0, n);
    }
  }

  const picks: any[] = weakestFirst.slice(0, Math.max(0, n - 1));   // n-1 most-recent/weakest
  const has = (r: any) => picks.some((p) => p.item?.de === r.item?.de);
  const older = [...due]
    .sort((a, b) => (b.interval ?? 1) - (a.interval ?? 1) || (b.overdue ?? 0) - (a.overdue ?? 0))
    .find((r) => !has(r));                                          // one most-mastered, not already picked
  if (older) picks.push(older);
  for (const r of weakestFirst) { if (picks.length >= n) break; if (!has(r)) picks.push(r); }  // backfill
  return picks.slice(0, n);
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
  const out: CatalogItem[] = [];
  const seen = new Set<string>();
  const learningMode = getLearningMode();

  const push = (de: string, en: string, id: string, kind: CatalogItem["kind"], lookup?: string, aliases: string[] = [], use?: string) => {
    const key = de.trim().toLowerCase();
    if (!de.trim() || seen.has(key)) return;
    seen.add(key);
    out.push({ id, aliases, de, en, kind, partKey, partLabel, level, lookup, use });
  };

  // Hand-written examples only — mirrors buildSession, so the tracker
  // never lists a sentence the lessons cannot teach.
  vocab.forEach((word, i) => {
    const id = getVocabId(partKey, word, i);
    const aliases = [`${partKey}-vocab-${i}`];
    if (hasSentenceShape(word.example) &&
        word.example.trim().toLowerCase() !== word.de.trim().toLowerCase() &&
        word.exampleEn?.trim()) {
      push(word.example, word.exampleEn, id, "vocab", word.lookup ?? word.de, aliases, word.use);
    }
  });

  phrases.forEach((ph, i) => {
    if (!hasSentenceShape(ph.de)) return;
    const catalogPhrase = phraseForLearningMode(ph, learningMode);
    push(catalogPhrase.de, catalogPhrase.en, `${partKey}-phrase-${i}`, "phrase", undefined, [], catalogPhrase.use);
  });

  dialogues.forEach((d, di) => {
    (d.lines ?? []).forEach((line: any, li: number) => {
      if (!hasSentenceShape(line.de)) return;
      const catalogLine = phraseForLearningMode(line, learningMode);
      const id = line?.id ?? `${partKey}-dlg-${di}-${li}`;
      const legacyDialogueId = `dialogue-${d?.title ?? "line"}-${li}-${line?.de ?? ""}`;
      push(catalogLine.de, catalogLine.en, id, "dialogue", undefined, [`${partKey}-dlg-${di}-${li}`, legacyDialogueId], catalogLine.use);
    });
  });

  return out;
}

export function buildCatalog(apiParts: Record<string, any>): CatalogItem[] {
  const out: CatalogItem[] = [];
  for (const [partKey, part] of Object.entries(apiParts ?? {})) {
    out.push(...buildPartCatalog({ ...part, partKey }, partKey));
  }
  return out;
}
