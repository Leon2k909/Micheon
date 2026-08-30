import { meaningLanguageFor } from "@/lib/courseLanguages";
import { getLearningDirection } from "@/lib/direction";
import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The Spanish course: the same catalogue, read a fifth way.
 *
 * HOW IT WORKS AT ALL. This is the Polish course's shape with a different
 * table behind it — see frenchCourse.ts, which explains the trick, and
 * polishCourse.ts, which is the version this one is closest to. The Spanish
 * text is not on the entry; it lives in the translation table keyed by the
 * German (translations.ts), so the swap looks it up. `de` on a step is always
 * "the language being learned", so after the swap it holds the Spanish, and
 * `en` is always "the meaning", so it holds German or English.
 *
 * WHAT IS DIFFERENT FROM POLISH, AND IT IS ONE THING: NOTHING IS DROPPED.
 * French covers about a third of the catalogue and Polish about a quarter, so
 * both are NARROWED — a lesson of six cards where four are blank is not a
 * lesson, so the entries without a translation are removed before any of it
 * reaches a learner. Spanish covers all of it: 9,000 word cards, 12,000
 * sentences and 3,482 dialogue lines, which is every entry the German course
 * has. The filters below therefore pass everything today.
 *
 * THEY ARE STILL HERE ON PURPOSE. The alternative to filtering is trusting
 * that the table stays complete, and the way it stops being complete is
 * somebody adding a pack entry — which is a normal thing to do and touches
 * nothing here. Without the filter that entry would appear in the Spanish
 * course as a German card, which is a worse failure than its absence and a
 * silent one. check-spanish-course.cjs asserts the coverage separately, so a
 * gap is reported rather than merely absorbed.
 *
 * WHY IT IS ITS OWN FILE RATHER THAN A PARAMETER ON THE POLISH ONE. Almost
 * everything below IS the same, and the two could share a generic. The parts
 * that differ are the parts that matter: the pronoun list, the accent folding
 * and the alphabet all live in spanishTextMatch.ts rather than here, but the
 * article decision lives here — and it comes out the same as Polish for the
 * opposite reason. Polish drops `article` because a Polish noun has none.
 * Spanish drops it because a Spanish noun has its OWN, and it is already in
 * the table's value: "Abfluss" answers "el desagüe", article included. A
 * der/die/das chip beside it would be teaching the German gender on a Spanish
 * card. Merging the two files would put that behind a flag.
 */

/**
 * Which language the Spanish course explains itself in.
 *
 * Same rule as every other course: the app's own language, because that is the
 * one thing the learner has already told us they read comfortably. It narrows
 * to German or English here because nothing in the catalogue explains Spanish
 * in French or Polish, and because those are the two columns every entry
 * carries.
 */
export function spanishMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("es") === "de" ? "de" : "en";
}

/**
 * The Spanish for a German string, or null when the catalogue has none.
 *
 * There is no inline column for Spanish the way there is for French — nothing
 * in the packs carries an `es:` field — so this is the table and nothing else.
 */
export function spanishFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "es");
  return value && value.trim() ? value.trim() : null;
}

/** Does this entry exist in Spanish? The question every filter below asks. */
export function hasSpanish(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return spanishFor(entry.de) !== null;
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
 * Fields that describe the GERMAN and mean nothing beside a Spanish card.
 *
 * `article` is on this list for the reason given at the top: the Spanish
 * article is already inside the answer. `synonyms` goes because the synonym
 * lists are German words. `fr` goes because a French gloss on a Spanish card
 * is a third language nobody asked for.
 */
const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

/**
 * Turn one built step into its Spanish form, or return null when there is no
 * Spanish for it.
 *
 * The German is kept in `originalDe`, which the session already uses to key
 * chains and legacy progress — without it, a Spanish card could not find the
 * sentence it extends.
 */
export function swapStepForSpanish(step: any, meaning: "de" | "en" = spanishMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForSpanish(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForSpanish(line, meaning))
      .filter(Boolean);
    // A dialogue is an exchange. One surviving line is not one, and showing it
    // as a conversation would be a lie about what the learner is reading.
    if (lines.length < 2) return null;
    return { ...step, dialogue: { ...step.dialogue, coachingLanguage: undefined, lines } };
  }

  return step;
}

function swapItemForSpanish(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const spanish = spanishFor(german) ?? spanishFor(String(item?.de ?? ""));
  if (!spanish) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: spanish,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

// ── Keeping the catalogue honest ────────────────────────────────────────────

function spanishPhrase(phrase: Phrase): boolean {
  return hasSpanish(phrase);
}

function spanishVocab(word: VocabItem): boolean {
  // A word card is taught by its gloss, and its example sentence is a separate
  // card built from `example`. The word itself is what decides.
  return hasSpanish(word);
}

function spanishDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasSpanish(line));
  return lines.length >= 2 ? { ...dialogue, lines } : null;
}

/**
 * One pack in Spanish — or null in the case that should not arise.
 *
 * Two German entries can land on one Spanish one: "Guten Morgen" and "Guten
 * Tag" would both be "Buenos días" if the table wrote them that way, which is
 * the truth about Spanish rather than a mistake. The catalogue would quietly
 * drop the second card and take its meaning with it, so the meanings are
 * joined here instead — one card that says Good morning / Good day, which is
 * what the phrase covers.
 */
export function spanishPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter(spanishVocab).map((word) => (
    hasSpanish({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!spanishPhrase(phrase)) continue;
    const spanish = spanishFor(phrase.de)!;
    const existing = kept.get(spanish);
    if (!existing) {
      // A copy, because the meanings are merged onto it below and the pack
      // objects are shared with the German course in the same session.
      kept.set(spanish, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }
  const phrases = [...kept.values()];

  const dialogues = (part.dialogues ?? [])
    .map(spanishDialogue)
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

/** Every pack the Spanish course has anything to teach from — today, all of them. */
export function spanishParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = spanishPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}

/** True when the Spanish course is the one being studied right now. */
export function spanishCourseActive(): boolean {
  return getLearningDirection() === "learn-es";
}
