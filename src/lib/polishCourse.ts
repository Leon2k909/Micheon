import { meaningLanguageFor } from "@/lib/courseLanguages";
import { getLearningDirection } from "@/lib/direction";
import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The Polish course: the same catalogue, read a fourth way.
 *
 * HOW IT WORKS AT ALL. This is the French course's shape with a different
 * table behind it — see frenchCourse.ts, which explains the trick. The Polish
 * text is not on the entry; it lives in the translation table keyed by the
 * German (translations.ts), so the swap looks it up. `de` on a step is always
 * "the language being learned", so after the swap it holds the Polish, and
 * `en` is always "the meaning", so it holds German or English.
 *
 * WHY IT IS ITS OWN FILE RATHER THAN A PARAMETER ON THE FRENCH ONE. Almost
 * everything below IS the same, and the two could share a generic. The parts
 * that differ are the parts that matter: French drops `synonyms` because its
 * synonym lists are German words, and so does this — but Polish also has to
 * drop `article`, which French keeps, because a Polish noun has no article to
 * teach and a der/die/das chip beside a Polish word is a wrong lesson rather
 * than a missing one. Merging them would put that difference behind a flag.
 *
 * WHAT IS LEFT OUT. Roughly three entries in four have no Polish, and a lesson
 * of six cards where four are blank is not a lesson. So the Polish course is
 * NARROWED rather than gapped: polishPart() drops what Polish does not cover
 * before any of it reaches a lesson, a test, the tracker or a game, and a pack
 * with nothing left disappears from the course entirely.
 *
 * WHAT SURVIVES THE NARROWING is the opening stretch of the curriculum in
 * full — the packs a learner meets in their first months — plus several
 * thousand words and sentences behind it. Every card in it has an answer.
 */

/**
 * Which language the Polish course explains itself in.
 *
 * Same rule as every other course: the app's own language, because that is the
 * one thing the learner has already told us they read comfortably. It narrows
 * to German or English here because nothing in the catalogue explains Polish
 * in French, and because those are the two columns every entry carries.
 */
export function polishMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("pl") === "de" ? "de" : "en";
}

/**
 * The Polish for a German string, or null when the catalogue has none.
 *
 * There is no inline column for Polish the way there is for French — nothing
 * in the packs carries a `pl:` field — so this is the table and nothing else.
 */
export function polishFor(german: string): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "pl");
  return value && value.trim() ? value.trim() : null;
}

/** Does this entry exist in Polish? The question every filter below asks. */
export function hasPolish(entry: { de?: string } | null | undefined): boolean {
  if (!entry?.de) return false;
  return polishFor(entry.de) !== null;
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
 * Fields that describe the GERMAN and mean nothing beside a Polish card.
 *
 * `article` is on this list and not on the French one: der/die/das is the
 * hard part of a German noun and the point of the French `le`/`la` chip, and
 * Polish nouns have no article at all. `fr` goes too — a French gloss on a
 * Polish card is a third language nobody asked for.
 */
const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms", "article", "fr"] as const;

/**
 * Turn one built step into its Polish form, or return null when there is no
 * Polish for it.
 *
 * The German is kept in `originalDe`, which the session already uses to key
 * chains and legacy progress — without it, a Polish card could not find the
 * sentence it extends.
 */
export function swapStepForPolish(step: any, meaning: "de" | "en" = polishMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForPolish(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForPolish(line, meaning))
      .filter(Boolean);
    // A dialogue is an exchange. One surviving line is not one, and showing it
    // as a conversation would be a lie about what the learner is reading.
    if (lines.length < 2) return null;
    return { ...step, dialogue: { ...step.dialogue, coachingLanguage: undefined, lines } };
  }

  return step;
}

function swapItemForPolish(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const polish = polishFor(german) ?? polishFor(String(item?.de ?? ""));
  if (!polish) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;

  return {
    ...next,
    de: polish,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

// ── Narrowing the catalogue ─────────────────────────────────────────────────

function polishPhrase(phrase: Phrase): boolean {
  return hasPolish(phrase);
}

function polishVocab(word: VocabItem): boolean {
  // A word card is taught by its gloss, and its example sentence is a separate
  // card built from `example`. The word itself is what decides.
  return hasPolish(word);
}

function polishDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasPolish(line));
  return lines.length >= 2 ? { ...dialogue, lines } : null;
}

/**
 * One pack, narrowed to what Polish covers — or null when nothing is left.
 *
 * Two German entries can land on one Polish one: "Guten Morgen" and "Guten
 * Tag" are both "Dzień dobry", which is the truth about Polish rather than a
 * mistake. The catalogue would quietly drop the second card and take its
 * meaning with it, so the meanings are joined here instead — one card that
 * says Good morning / Good day / Hello, which is what the word covers.
 */
export function polishPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter(polishVocab).map((word) => (
    hasPolish({ de: word.example })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));

  const kept = new Map<string, Phrase>();
  for (const phrase of part.phrases ?? []) {
    if (!polishPhrase(phrase)) continue;
    const polish = polishFor(phrase.de)!;
    const existing = kept.get(polish);
    if (!existing) {
      // A copy, because the meanings are merged onto it below and the pack
      // objects are shared with the German course in the same session.
      kept.set(polish, { ...phrase });
      continue;
    }
    existing.en = mergeMeanings(existing.en, phrase.en);
  }
  const phrases = [...kept.values()];

  const dialogues = (part.dialogues ?? [])
    .map(polishDialogue)
    .filter((dialogue): dialogue is Dialogue => dialogue !== null);

  if (vocab.length === 0 && phrases.length === 0 && dialogues.length === 0) return null;

  return {
    ...part,
    vocab,
    phrases,
    dialogues,
    // Built from the German phrases of a pack that no longer has all of them,
    // and written as "Translate: <English>" against a German answer. Neither
    // side is this course's, so the pack keeps its lessons and loses these.
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

/** Every pack the Polish course has anything to teach from. */
export function polishParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = polishPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}

/** True when the Polish course is the one being studied right now. */
export function polishCourseActive(): boolean {
  return getLearningDirection() === "learn-pl";
}
