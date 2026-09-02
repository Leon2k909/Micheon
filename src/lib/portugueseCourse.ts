import { meaningLanguageFor } from "@/lib/courseLanguages";

import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/** The Portuguese course is the shared catalogue narrowed to translated entries. */
export function portugueseMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("pt") === "de" ? "de" : "en";
}

export function portugueseFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "pt");
  return value && value.trim() ? value.trim() : null;
}

function hasPortuguese(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return portugueseFor(entry.de) !== null;
}

function coachingSurvives(coachingLanguage: unknown, meaning: "de" | "en"): boolean {
  const written = coachingLanguage === "de" || coachingLanguage === "both" ? coachingLanguage : "en";
  if (written === "both") return true;
  return written === meaning;
}

const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

export function swapStepForPortuguese(step: any, meaning: "de" | "en" = portugueseMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForPortuguese(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForPortuguese(line, meaning))
      .filter(Boolean);
    if (lines.length < 2) return null;
    /**
     * The title too. It is drawn in a badge above the conversation, and
     * spreading the dialogue carried it across in German — so a Portuguese
     * conversation ran under a German heading. Untranslated titles keep the
     * German, which is what every other language still shows.
     */
    const title = step.dialogue.title ? portugueseFor(step.dialogue.title) : null;
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

function swapItemForPortuguese(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const portuguese = portugueseFor(german) ?? portugueseFor(String(item?.de ?? ""));
  if (!portuguese) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: portuguese,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

function portugueseDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasPortuguese(line));
  if (lines.length < 2) return null;
  // The name too, for the same reason as in swapStepForPortuguese: the badge
  // above the conversation is drawn from it, and spreading the dialogue
  // carried it across in German. There are two paths that build a Portuguese
  // dialogue and both have to do this, or one of them shows a German heading.
  const title = dialogue.title ? portugueseFor(dialogue.title) : null;
  return { ...dialogue, ...(title ? { title } : {}), lines };
}

function portuguesePart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter((word: VocabItem) => hasPortuguese(word)).map((word) => (
    hasPortuguese({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!hasPortuguese(phrase)) continue;
    const portuguese = portugueseFor(phrase.de)!;
    const existing = kept.get(portuguese);
    if (!existing) {
      kept.set(portuguese, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }

  const dialogues = (part.dialogues ?? [])
    .map(portugueseDialogue)
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

export function portugueseParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = portuguesePart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}
