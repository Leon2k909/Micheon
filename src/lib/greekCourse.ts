import { meaningLanguageFor } from "@/lib/courseLanguages";

import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The Greek course is the shared catalogue narrowed to translated entries —
 * the same shape as the Portuguese and Italian courses, over greekTranslations.ts.
 *
 * WHAT IS DIFFERENT ABOUT THIS ONE. Like Russian, it is written in another
 * alphabet, and unlike Russian it has no second way of drawing it: the card is
 * Greek and is shown in Greek, because that is what a learner of Greek has to
 * read on every sign in Athens. Typing is the part the alphabet makes hard, and
 * that is answered where answers are graded — greekTextMatch.ts accepts the
 * word typed in Latin letters as a slip, and the lesson offers the whole Greek
 * row as a keyboard.
 *
 * A card the table cannot answer is left out rather than shown in German, so
 * the course is exactly as long as the table is complete.
 */
export function greekMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("el") === "de" ? "de" : "en";
}

export function greekFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "el");
  return value && value.trim() ? value.trim() : null;
}

function hasGreek(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return greekFor(entry.de) !== null;
}

function coachingSurvives(coachingLanguage: unknown, meaning: "de" | "en"): boolean {
  const written = coachingLanguage === "de" || coachingLanguage === "both" ? coachingLanguage : "en";
  if (written === "both") return true;
  return written === meaning;
}

const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

export function swapStepForGreek(step: any, meaning: "de" | "en" = greekMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForGreek(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForGreek(line, meaning))
      .filter(Boolean);
    if (lines.length < 2) return null;
    // The title too: it is drawn in a badge above the conversation, and a
    // Greek conversation under a German heading reads as unfinished.
    const title = step.dialogue.title ? greekFor(step.dialogue.title) : null;
    return {
      ...step,
      dialogue: {
        ...step.dialogue,
        ...(title ? { title } : {}),
        coachingLanguage: undefined,
        lines,
      },
    };
  }

  return step;
}

function swapItemForGreek(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const greek = greekFor(german) ?? greekFor(String(item?.de ?? ""));
  if (!greek) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: greek,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

function greekDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasGreek(line));
  if (lines.length < 2) return null;
  // Both paths that build a Greek conversation carry the title across, or one
  // of them shows a German heading over Greek lines.
  const title = dialogue.title ? greekFor(dialogue.title) : null;
  return { ...dialogue, ...(title ? { title } : {}), lines };
}

function greekPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter((word: VocabItem) => hasGreek(word)).map((word) => (
    hasGreek({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!hasGreek(phrase)) continue;
    const greek = greekFor(phrase.de)!;
    const existing = kept.get(greek);
    if (!existing) {
      kept.set(greek, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }

  const dialogues = (part.dialogues ?? [])
    .map(greekDialogue)
    .filter((dialogue): dialogue is Dialogue => dialogue !== null);

  if (vocab.length === 0 && kept.size === 0 && dialogues.length === 0) return null;
  return {
    ...part,
    vocab,
    phrases: [...kept.values()],
    dialogues,
    translationQuestions: [],
    articleQuestions: [],
  };
}

function mergeMeanings(existing: string, extra: string): string {
  const seen = new Set(String(existing ?? "").split(" / ").map((value) => value.trim().toLocaleLowerCase("en-GB")));
  const additions = String(extra ?? "")
    .split(" / ")
    .map((value) => value.trim())
    .filter((value) => value && !seen.has(value.toLocaleLowerCase("en-GB")));
  return additions.length ? [existing, ...additions].join(" / ") : existing;
}

export function greekParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = greekPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}
