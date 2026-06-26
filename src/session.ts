// Guided session engine — every step is a full sentence exercise

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

function isKnownItem(reviewState: any, itemId: string, aliases: string[] = []) {
  return [itemId, ...aliases].some((id) => Boolean(reviewState?.[id]?.lastGrade === "know"));
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

  const addSentence = (de: string, en: string, id: string, aliases: string[] = []) => {
    const key = de.trim().toLowerCase();
    if (usedSentences.has(key)) return;
    if (isKnownItem(reviewState, id, aliases)) return;
    usedSentences.add(key);
    queue.push({ type: EX.SENTENCE, item: { id, de, en } });
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
      addSentence(word.example, exEn, id, aliases);
    } else {
      const carrier = buildCarrier(word.de, word.en, word.tip);
      addSentence(carrier.de, carrier.en, id, aliases);
    }
  });

  // ── Phrases ──────────────────────────────────────────────────
  phrases.forEach((ph, i) => {
    if (!hasSentenceShape(ph.de)) return;
    addSentence(ph.de, ph.en, `${partKey}-phrase-${i}`);
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
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`]);
      });
    } else {
      usable.forEach((line: any) => {
        addSentence(line.de, line.en, line.id, [`${partKey}-dlg-${di}-${line.originalIndex}`]);
      });
    }
  });

  // ── Shuffle for variety, keep COMPLETE at end ────────────────
  const shuffled = shuffle(queue);
  shuffled.push({ type: EX.COMPLETE });
  return shuffled;
}

// ── Carrier sentence templates ────────────────────────────────
function buildCarrier(de: string, en: string, tip?: string): { de: string; en: string } {
  const t = (tip ?? "").toLowerCase();
  if (t === "verb") {
    return { de: `Ich kann ${de}.`, en: `I can ${en.replace(/^to /, "")}.` };
  }
  if (t === "adjective") {
    return { de: `Das ist ${de}.`, en: `That is ${en}.` };
  }
  if (t === "adverb") {
    return { de: `Ich lerne ${de}.`, en: `I am learning ${en}.` };
  }
  // noun / default
  return { de: `Ich sehe ${de}.`, en: `I see ${en.replace(/^(a|an|the) /i, "")}.` };
}

// ── Catalog of every learnable item (for the word/sentence tracker) ──
export type CatalogItem = {
  id: string;
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

  const push = (de: string, en: string, id: string, kind: CatalogItem["kind"], lookup?: string) => {
    const key = de.trim().toLowerCase();
    if (!de.trim() || seen.has(key)) return;
    seen.add(key);
    out.push({ id, de, en, kind, partKey, partLabel, level, lookup });
  };

  vocab.forEach((word, i) => {
    const id = getVocabId(partKey, word, i);
    if (hasSentenceShape(word.example) &&
        word.example.trim().toLowerCase() !== word.de.trim().toLowerCase()) {
      const exEn = word.exampleEn?.trim() ? word.exampleEn : buildCarrier(word.de, word.en, word.tip).en;
      push(word.example, exEn, id, "vocab", word.lookup ?? word.de);
    } else {
      const carrier = buildCarrier(word.de, word.en, word.tip);
      push(carrier.de, carrier.en, id, "vocab", word.lookup ?? word.de);
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
      push(line.de, line.en, id, "dialogue");
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

