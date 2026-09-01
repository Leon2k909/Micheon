import { meaningLanguageFor } from "@/lib/courseLanguages";

import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The Italian course: the same catalogue, read a sixth way.
 *
 * HOW IT WORKS AT ALL. This is the Spanish course's shape with a different
 * table behind it — see frenchCourse.ts, which explains the trick, and
 * spanishCourse.ts, which is the version this one is closest to. The Italian
 * text is not on the entry; it lives in the translation table keyed by the
 * German (translations.ts), so the swap looks it up. `de` on a step is always
 * "the language being learned", so after the swap it holds the Italian, and
 * `en` is always "the meaning", so it holds German or English.
 *
 * NOTHING IS DROPPED, THE SAME AS SPANISH. French covers about a third of the
 * catalogue and Polish about a quarter, so both are NARROWED — a lesson of six
 * cards where four are blank is not a lesson. Italian covers all of it: 9,000
 * word cards, 12,000 sentences and 3,482 dialogue lines, which is every entry
 * the German course has, and it reads the same numbers Spanish does to the
 * card. The filters below therefore pass everything today.
 *
 * THEY ARE STILL HERE ON PURPOSE. The alternative to filtering is trusting
 * that the table stays complete, and the way it stops being complete is
 * somebody adding a pack entry — which is a normal thing to do and touches
 * nothing here. Without the filter that entry would appear in the Italian
 * course as a German card, which is a worse failure than its absence and a
 * silent one. check-italian-course.cjs asserts the coverage separately, so a
 * gap is reported rather than merely absorbed.
 *
 * WHY IT IS ITS OWN FILE RATHER THAN A PARAMETER ON THE SPANISH ONE. Almost
 * everything below IS the same, and the two could share a generic. The parts
 * that differ live in italianTextMatch.ts rather than here, and one of them is
 * a real difference rather than a list swap: Spanish folds every accent it
 * has, and Italian cannot, because "e" and "è" are both words. The article
 * decision does come out the same, and for the same reason — an Italian noun
 * has its OWN article, already inside the table's value: "Abfluss" answers
 * "lo scarico", article included. A der/die/das chip beside it would be
 * teaching the German gender on an Italian card.
 */

/**
 * Which language the Italian course explains itself in.
 *
 * Same rule as every other course: the app's own language, because that is the
 * one thing the learner has already told us they read comfortably. It narrows
 * to German or English here because nothing in the catalogue explains Italian
 * in French or Polish, and because those are the two columns every entry
 * carries.
 */
export function italianMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("it") === "de" ? "de" : "en";
}

/**
 * The Italian for a German string, or null when the catalogue has none.
 *
 * There is no inline column for Italian the way there is for French — nothing
 * in the packs carries an `it:` field — so this is the table and nothing else.
 */
export function italianFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "it");
  return value && value.trim() ? value.trim() : null;
}

/** Does this entry exist in Italian? The question every filter below asks. */
export function hasItalian(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return italianFor(entry.de) !== null;
}

/**
 * Coaching notes are written in one language, and after the swap it may not be
 * one the learner is reading any more. Same rule as the French course.
 */
function coachingSurvives(coachingLanguage: unknown, meaning: "de" | "en"): boolean {
  const written = coachingLanguage === "de" || coachingLanguage === "both" ? coachingLanguage : "en";
  if (written === "both") return true;
  return written === meaning;
}

/**
 * Fields that describe the GERMAN and mean nothing beside an Italian card.
 *
 * `article` is on this list for the reason given at the top: the Italian
 * article is already inside the answer. `synonyms` goes because the synonym
 * lists are German words. `fr` goes because a French gloss on an Italian card
 * is a third language nobody asked for.
 */
const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

/**
 * Turn one built step into its Italian form, or return null when there is no
 * Italian for it.
 *
 * The German is kept in `originalDe`, which the session already uses to key
 * chains and legacy progress — without it, an Italian card could not find the
 * sentence it extends.
 */
export function swapStepForItalian(step: any, meaning: "de" | "en" = italianMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForItalian(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForItalian(line, meaning))
      .filter(Boolean);
    // A dialogue is an exchange. One surviving line is not one, and showing it
    // as a conversation would be a lie about what the learner is reading.
    if (lines.length < 2) return null;
    return { ...step, dialogue: { ...step.dialogue, coachingLanguage: undefined, lines } };
  }

  return step;
}

function swapItemForItalian(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const italian = italianFor(german) ?? italianFor(String(item?.de ?? ""));
  if (!italian) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: italian,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

// ── Keeping the catalogue honest ────────────────────────────────────────────

function italianPhrase(phrase: Phrase): boolean {
  return hasItalian(phrase);
}

function italianVocab(word: VocabItem): boolean {
  // A word card is taught by its gloss, and its example sentence is a separate
  // card built from `example`. The word itself is what decides.
  return hasItalian(word);
}

function italianDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasItalian(line));
  return lines.length >= 2 ? { ...dialogue, lines } : null;
}

/**
 * One pack in Italian — or null in the case that should not arise.
 *
 * Two German entries can land on one Italian one: "Guten Morgen" and "Guten
 * Tag" would both be "Buongiorno" if the table wrote them that way, which is
 * the truth about Italian rather than a mistake. The catalogue would quietly
 * drop the second card and take its meaning with it, so the meanings are
 * joined here instead — one card that says Good morning / Good day, which is
 * what the phrase covers.
 */
export function italianPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter(italianVocab).map((word) => (
    hasItalian({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!italianPhrase(phrase)) continue;
    const italian = italianFor(phrase.de)!;
    const existing = kept.get(italian);
    if (!existing) {
      // A copy, because the meanings are merged onto it below and the pack
      // objects are shared with the German course in the same session.
      kept.set(italian, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }
  const phrases = [...kept.values()];

  const dialogues = (part.dialogues ?? [])
    .map(italianDialogue)
    .filter((dialogue): dialogue is Dialogue => dialogue !== null);

  if (vocab.length === 0 && phrases.length === 0 && dialogues.length === 0) return null;

  return {
    ...part,
    vocab,
    phrases,
    dialogues,
    // Written as "Translate: <English>" against a German answer, and as
    // der/die/das against a German noun. Neither side is this course's, so the
    // pack keeps its lessons and loses these.
    translationQuestions: [],
    articleQuestions: [],
  };
}

/** "Good morning" and "Good day" on one card, without repeating either. */
function mergeMeanings(existing: string, extra: string): string {
  const seen = new Set(
    String(existing ?? "").split(" / ").map((value) => value.trim().toLocaleLowerCase("en-GB"))
  );
  const additions = String(extra ?? "")
    .split(" / ")
    .map((value) => value.trim())
    .filter((value) => value && !seen.has(value.toLocaleLowerCase("en-GB")));
  return additions.length ? [existing, ...additions].join(" / ") : existing;
}

/** Every pack the Italian course has anything to teach from — today, all of them. */
export function italianParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = italianPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}

/** True when the Italian course is the one being studied right now. */
