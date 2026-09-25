import { meaningLanguageFor } from "@/lib/courseLanguages";

import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The Albanian course is the shared catalogue narrowed to translated entries —
 * the same shape as the Portuguese course, over albanianTranslations.ts.
 *
 * WHAT IS DIFFERENT ABOUT THIS ONE. Albanian is written in the Latin alphabet
 * with two letters of its own, ë and ç, and a word card names a noun the way
 * the German card does: with its article, which in Albanian is an ending —
 * das Haus is shtëpia, the house, not shtëpi. The two letters are what a
 * foreign keyboard cannot reach, so albanianTextMatch.ts lets e for ë and c
 * for ç through as a slip, and the lesson offers them as keys.
 *
 * A card the table cannot answer is left out rather than shown in German, so
 * the course is exactly as long as the table is complete.
 */
export function albanianMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("sq") === "de" ? "de" : "en";
}

export function albanianFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "sq");
  return value && value.trim() ? value.trim() : null;
}

function hasAlbanian(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return albanianFor(entry.de) !== null;
}

function coachingSurvives(coachingLanguage: unknown, meaning: "de" | "en"): boolean {
  const written = coachingLanguage === "de" || coachingLanguage === "both" ? coachingLanguage : "en";
  if (written === "both") return true;
  return written === meaning;
}

const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

export function swapStepForAlbanian(step: any, meaning: "de" | "en" = albanianMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForAlbanian(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForAlbanian(line, meaning))
      .filter(Boolean);
    if (lines.length < 2) return null;
    // The title too: it is drawn in a badge above the conversation, and an
    // Albanian conversation under a German heading reads as unfinished.
    const title = step.dialogue.title ? albanianFor(step.dialogue.title) : null;
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

function swapItemForAlbanian(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const albanian = albanianFor(german) ?? albanianFor(String(item?.de ?? ""));
  if (!albanian) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: albanian,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

function albanianDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasAlbanian(line));
  if (lines.length < 2) return null;
  // Both paths that build an Albanian conversation carry the title across, or
  // one of them shows a German heading over Albanian lines.
  const title = dialogue.title ? albanianFor(dialogue.title) : null;
  return { ...dialogue, ...(title ? { title } : {}), lines };
}

function albanianPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter((word: VocabItem) => hasAlbanian(word)).map((word) => (
    hasAlbanian({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!hasAlbanian(phrase)) continue;
    const albanian = albanianFor(phrase.de)!;
    const existing = kept.get(albanian);
    if (!existing) {
      kept.set(albanian, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }

  const dialogues = (part.dialogues ?? [])
    .map(albanianDialogue)
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

export function albanianParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = albanianPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}
