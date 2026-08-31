import { meaningLanguageFor } from "@/lib/courseLanguages";
import { getLearningDirection } from "@/lib/direction";
import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The Russian course is the shared catalogue narrowed to translated entries —
 * the same shape as frenchCourse, polishCourse and portugueseCourse, with its
 * own vocabulary.
 *
 * WHAT IS DIFFERENT ABOUT THIS ONE. Every other course swaps German text for
 * text in the same alphabet. Russian arrives in Cyrillic, and what a learner
 * SEES may be one of five Latin transcriptions instead — see russianScript.ts.
 * None of that belongs here: this file produces the card, and the card is
 * always Cyrillic. The transcription happens on the way to the screen and
 * nowhere else, which is what keeps progress, grades and reviews hanging off
 * one spelling rather than six.
 *
 * HOW SHORT IT IS. The table covers a small fraction of the catalogue, so this
 * narrowing drops most of it — a Russian lesson is short today and grows with
 * every block written into russianTranslations.ts. That is the same road
 * Portuguese is on, and it is honest: a card without a Russian answer is left
 * out rather than shown in German.
 */
export function russianMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("ru") === "de" ? "de" : "en";
}

export function russianFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "ru");
  return value && value.trim() ? value.trim() : null;
}

export function hasRussian(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return russianFor(entry.de) !== null;
}

function coachingSurvives(coachingLanguage: unknown, meaning: "de" | "en"): boolean {
  const written = coachingLanguage === "de" || coachingLanguage === "both" ? coachingLanguage : "en";
  if (written === "both") return true;
  return written === meaning;
}

const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

export function swapStepForRussian(step: any, meaning: "de" | "en" = russianMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForRussian(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForRussian(line, meaning))
      .filter(Boolean);
    if (lines.length < 2) return null;
    return { ...step, dialogue: { ...step.dialogue, coachingLanguage: undefined, lines } };
  }

  return step;
}

function swapItemForRussian(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const russian = russianFor(german) ?? russianFor(String(item?.de ?? ""));
  if (!russian) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: russian,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

function russianDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasRussian(line));
  return lines.length >= 2 ? { ...dialogue, lines } : null;
}

export function russianPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter((word: VocabItem) => hasRussian(word)).map((word) => (
    hasRussian({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!hasRussian(phrase)) continue;
    const russian = russianFor(phrase.de)!;
    const existing = kept.get(russian);
    if (!existing) {
      kept.set(russian, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }

  const dialogues = (part.dialogues ?? [])
    .map(russianDialogue)
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

export function russianParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = russianPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}

export function russianCourseActive(): boolean {
  return getLearningDirection() === "learn-ru";
}
