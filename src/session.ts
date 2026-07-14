// Guided session engine — every step is a full sentence exercise

import { isDueForReview, overdueBy, REVIEWS_PER_SESSION } from "@/lib/memoryStrength";
import { frequencyRank } from "@/lib/wordFrequency";
import { packMeta } from "@/lib/curriculum";

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
  return String(text ?? "").trim().split(/\s+/).filter(Boolean).length >= 2;
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

  const queue: any[] = [];
  const usedSentences = new Set<string>();
  // Niche/casual packs label every item so uncommon German is never
  // mistaken for the everyday thing to say.
  const tierNote = packMeta(partKey).note;

  const addSentence = (de: string, en: string, id: string, aliases: string[] = [], fr?: string, use?: string, lookup?: string) => {
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
      queue.push({ type: EX.SENTENCE, review: true, overdue: overdueBy(rec), item: { id, de, en, fr, use, lookup, tierNote } });
      return;                                            // due — back in as a review
    }
    queue.push({ type: EX.SENTENCE, item: { id, de, en, fr, use, lookup, tierNote } });
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
    addSentence(ph.de, ph.en, `${partKey}-phrase-${i}`, [], ph.fr, ph.use);
  });

  // ── Dialogue lines ───────────────────────────────────────────
  dialogues.forEach((d, di) => {
    const usable = (d.lines ?? [])
      .map((line: any, li: number) => ({
        ...line,
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
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`], line.fr, line.use);
      });
    } else {
      usable.forEach((line: any) => {
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`], line.fr, line.use);
      });
    }
  });

  // ── Cap reviews so a due backlog never floods the session ────
  // Most-overdue first — those are the items closest to being forgotten.
  const reviews = queue
    .filter((s) => s.review)
    .sort((a, b) => (b.overdue ?? 0) - (a.overdue ?? 0))
    .slice(0, REVIEWS_PER_SESSION);

  // ── Common words first ────────────────────────────────────────
  // Shuffle for variety, then stable-sort by frequency rank: ranked vocab
  // comes up most-common-first, while unranked items (phrases, dialogue
  // lines, slang) keep their shuffled order after it. Reviews lead the
  // session — they're the items closest to being forgotten.
  const sorted = shuffle(queue.filter((s) => !s.review))
    .sort((a, b) => frequencyRank(a.item?.lookup) - frequencyRank(b.item?.lookup));

  // ── Dialogues are capstones, not cold-opens ──────────────────
  // The dialogue step asks the learner to TYPE each line, so it must come
  // AFTER the sentence exercises that teach those lines — never before.
  // Lines are matched by text (not id): the same sentence can be drilled
  // under a phrase id when it appears in both places.
  const dialogueSteps = sorted.filter((s) => s.type === EX.DIALOGUE);
  const fresh = sorted.filter((s) => s.type !== EX.DIALOGUE);
  for (const d of dialogueSteps) {
    const lineTexts = new Set(
      (d.dialogue?.lines ?? []).map((l: any) => String(l.de ?? "").trim().toLowerCase())
    );
    let lastIdx = -1;
    fresh.forEach((s, i) => {
      if (s.type === EX.SENTENCE && lineTexts.has(String(s.item?.de ?? "").trim().toLowerCase())) {
        lastIdx = i;
      }
    });
    if (lastIdx === -1) fresh.push(d);            // no teachable lines left — run it last
    else fresh.splice(lastIdx + 1, 0, d);          // right after its final line drill
  }

  // ── In-session reinforcement ─────────────────────────────────
  // One exposure isn't memory. A sentence you just learned comes back as the
  // SAME full exercise — read, listen, speak, type, translate, all five
  // stages again — a few steps later (spaced within the session, not
  // back-to-back). In longer sessions the earliest items — the longest gap
  // since you saw them — get a third full pass at the end, before the
  // day-scale reviews take over. Each repeat is an identical sentence step,
  // so it plays exactly like the first time.
  const isNewSentence = (s: any) => s.type === EX.SENTENCE && !s.review;
  const reinforced: any[] = [];
  const pendingRepeats: { countdown: number; step: any }[] = [];
  for (const s of fresh) {
    reinforced.push(s);
    for (const q of pendingRepeats) q.countdown -= 1;
    while (pendingRepeats.length && pendingRepeats[0].countdown <= 0) {
      reinforced.push(pendingRepeats.shift()!.step);
    }
    if (isNewSentence(s)) {
      pendingRepeats.push({ countdown: 3, step: { type: EX.SENTENCE, item: s.item } });
    }
  }
  pendingRepeats.forEach((q) => reinforced.push(q.step));

  const newItems = fresh.filter(isNewSentence);
  if (newItems.length >= 8) {
    newItems.slice(0, Math.ceil(newItems.length / 3)).forEach((s) => {
      reinforced.push({ type: EX.SENTENCE, item: s.item });
    });
  }

  const ordered = [...reviews, ...reinforced];
  ordered.push({ type: EX.COMPLETE });
  return ordered;
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
    push(ph.de, ph.en, `${partKey}-phrase-${i}`, "phrase", undefined, [], ph.use);
  });

  dialogues.forEach((d, di) => {
    (d.lines ?? []).forEach((line: any, li: number) => {
      if (!hasSentenceShape(line.de)) return;
      const id = line?.id ?? `${partKey}-dlg-${di}-${li}`;
      const legacyDialogueId = `dialogue-${d?.title ?? "line"}-${li}-${line?.de ?? ""}`;
      push(line.de, line.en, id, "dialogue", undefined, [`${partKey}-dlg-${di}-${li}`, legacyDialogueId]);
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
