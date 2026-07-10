// Guided session engine — every step is a full sentence exercise

import { isDueForReview, overdueBy, REVIEWS_PER_SESSION } from "@/lib/memoryStrength";

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
 * For each vocab word we use its example sentence when available,
 * otherwise we wrap the word in a simple carrier sentence.
 * Phrases and dialogue lines are used as-is.
 */
export function buildSession(part: any, studyItems: any[], reviewState: any, _reviewStep: number) {
  const partKey = part.partKey ?? "part";
  const vocab: any[]     = part.vocab     ?? [];
  const phrases: any[]   = part.phrases   ?? [];
  const dialogues: any[] = part.dialogues ?? [];

  const queue: any[] = [];
  const usedSentences = new Set<string>();

  const addSentence = (de: string, en: string, id: string, aliases: string[] = [], fr?: string) => {
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
      queue.push({ type: EX.SENTENCE, review: true, overdue: overdueBy(rec), item: { id, de, en, fr } });
      return;                                            // due — back in as a review
    }
    queue.push({ type: EX.SENTENCE, item: { id, de, en, fr } });
  };

  // ── Vocab words ──────────────────────────────────────────────
  vocab.forEach((word, i) => {
    const id = getVocabId(partKey, word, i);
    const aliases = [`${partKey}-vocab-${i}`];
    if (hasSentenceShape(word.example) &&
        word.example.trim().toLowerCase() !== word.de.trim().toLowerCase()) {
      // Use the example sentence with its own English translation when available.
      // Fall back to building a carrier so item.en is always a full sentence, never a single word.
      const exEn = word.exampleEn?.trim()
        ? word.exampleEn
        : buildCarrier(word.de, word.en, word.tip).en;
      addSentence(word.example, exEn, id, aliases, word.exampleFr);
    } else {
      const carrier = buildCarrier(word.de, word.en, word.tip);
      addSentence(carrier.de, carrier.en, id, aliases, word.fr);
    }
  });

  // ── Phrases ──────────────────────────────────────────────────
  phrases.forEach((ph, i) => {
    if (!hasSentenceShape(ph.de)) return;
    addSentence(ph.de, ph.en, `${partKey}-phrase-${i}`, [], ph.fr);
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
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`], line.fr);
      });
    } else {
      usable.forEach((line: any) => {
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`], line.fr);
      });
    }
  });

  // ── Cap reviews so a due backlog never floods the session ────
  // Most-overdue first — those are the items closest to being forgotten.
  const reviews = queue
    .filter((s) => s.review)
    .sort((a, b) => (b.overdue ?? 0) - (a.overdue ?? 0))
    .slice(0, REVIEWS_PER_SESSION);
  const fresh = queue.filter((s) => !s.review);

  // ── Shuffle for variety, keep COMPLETE at end ────────────────
  const shuffled = shuffle([...fresh, ...reviews]);
  shuffled.push({ type: EX.COMPLETE });
  return shuffled;
}

// ── Carrier sentence templates ────────────────────────────────
function buildCarrier(de: string, en: string, tip?: string): { de: string; en: string } {
  // Many word-bank entries carry multiple glosses ("be, exist") — baking them
  // all into the carrier would make the English answer key untypeable. Use the
  // first gloss only.
  const gloss = String(en ?? "").split(/[,;/]/)[0].trim();
  const t = (tip ?? "").toLowerCase();
  if (t === "verb") {
    return { de: `Ich kann ${de}.`, en: `I can ${gloss.replace(/^to /, "")}.` };
  }
  if (t === "adjective") {
    return { de: `Das ist ${de}.`, en: `That is ${gloss}.` };
  }
  if (t === "adverb") {
    return { de: `Ich lerne ${de}.`, en: `I am learning ${gloss}.` };
  }
  // noun / default. "sehen" takes the accusative: der Mann -> Ich sehe DEN Mann.
  const deAccusative = de.replace(/^der /i, "den ");
  return { de: `Ich sehe ${deAccusative}.`, en: `I see ${gloss.replace(/^(a|an|the) /i, "")}.` };
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

  const push = (de: string, en: string, id: string, kind: CatalogItem["kind"], lookup?: string, aliases: string[] = []) => {
    const key = de.trim().toLowerCase();
    if (!de.trim() || seen.has(key)) return;
    seen.add(key);
    out.push({ id, aliases, de, en, kind, partKey, partLabel, level, lookup });
  };

  vocab.forEach((word, i) => {
    const id = getVocabId(partKey, word, i);
    const aliases = [`${partKey}-vocab-${i}`];
    if (hasSentenceShape(word.example) &&
        word.example.trim().toLowerCase() !== word.de.trim().toLowerCase()) {
      const exEn = word.exampleEn?.trim() ? word.exampleEn : buildCarrier(word.de, word.en, word.tip).en;
      push(word.example, exEn, id, "vocab", word.lookup ?? word.de, aliases);
    } else {
      const carrier = buildCarrier(word.de, word.en, word.tip);
      push(carrier.de, carrier.en, id, "vocab", word.lookup ?? word.de, aliases);
    }
  });

  phrases.forEach((ph, i) => {
    if (!hasSentenceShape(ph.de)) return;
    push(ph.de, ph.en, `${partKey}-phrase-${i}`, "phrase");
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
