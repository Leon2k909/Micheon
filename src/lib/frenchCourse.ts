import { meaningLanguageFor } from "@/lib/courseLanguages";
import { getLearningDirection } from "@/lib/direction";
import { translate } from "@/lib/translations";
import type { Dialogue, Part, Phrase, VocabItem } from "@/lib/types";

/**
 * The French course: the same catalogue, read a third way.
 *
 * HOW IT WORKS AT ALL. German and English are one body of material served both
 * ways round — learn-en swaps `de` and `en` on the built step and everything
 * downstream carries on unchanged. French is the same trick with one extra
 * move: the French text is not on the entry, it is in the translation table
 * keyed by the German (see translations.ts), so the swap looks it up.
 *
 * WHAT THE LEARNER SEES. `de` on a step is always "the language being
 * learned", so after the swap it holds the French; `en` is always "the
 * meaning", so it holds German or English.
 *
 * WHICH ONE IS THE MEANING. The language the app itself is written in. It is
 * the only thing the learner has already told us about what they read
 * comfortably, and it is a setting they can change — German interface, German
 * meanings; English interface, English meanings. Both pairings are honest:
 * every entry carries its own English, and the French was written against the
 * German in the first place.
 *
 * WHAT IS LEFT OUT. Roughly two entries in three have no French, and a lesson
 * of six cards where four are blank is not a lesson. So the French course is
 * NARROWED rather than gapped: frenchPart() drops what French does not cover
 * before any of it reaches a lesson, a test, the tracker or a game, and a pack
 * with nothing left disappears from the course entirely. What remains is
 * around seven thousand entries — a real course, and every card in it has an
 * answer.
 */

/**
 * Which language the French course explains itself in.
 *
 * The rule is no longer this course's own: every course now explains itself
 * in the app's language, so it is asked in courseLanguages.ts and answered
 * the same way for all three. This narrows the type back down, because for a
 * French target the fallback rules French out — an interface in French says
 * nothing about which language to explain French in.
 */
export function frenchMeaningLanguage(): "de" | "en" {
  return meaningLanguageFor("fr") === "de" ? "de" : "en";
}

/**
 * The French for a German string, or null when the catalogue has none.
 *
 * `inline` is whatever the entry itself carries, and it always wins — it was
 * written against one specific sentence, where the table only knows the words.
 */
export function frenchFor(german: string, inline?: string | null): string | null {
  const source = String(german ?? "").trim();
  if (!source) return null;
  const value = translate(source, "fr", inline);
  return value && value.trim() ? value.trim() : null;
}

/** Does this entry exist in French? The question every filter below asks. */
export function hasFrench(entry: { de?: string; fr?: string | null } | null | undefined): boolean {
  if (!entry?.de) return false;
  return frenchFor(entry.de, entry.fr ?? null) !== null;
}

/**
 * Coaching notes are written in one language, and after the swap it may not be
 * one the learner is reading any more.
 *
 * `use`, `when` and `tierNote` explain the entry in prose. A pack says which
 * language that prose is in (default English). Keeping a German note on a card
 * whose meaning column is English — or the reverse — puts a language on screen
 * the learner did not ask for, so it is dropped rather than shown.
 */
function coachingSurvives(coachingLanguage: unknown, meaning: "de" | "en"): boolean {
  const written = coachingLanguage === "de" || coachingLanguage === "both" ? coachingLanguage : "en";
  if (written === "both") return true;
  return written === meaning;
}

/** Fields that describe the GERMAN and mean nothing beside a French card. */
const GERMAN_ONLY_FIELDS = ["say", "short", "shortLabel", "shortEn", "long", "synonyms"] as const;

/**
 * Turn one built step into its French form, or return null when there is no
 * French for it.
 *
 * The German is kept in `originalDe`, which the session already uses to key
 * chains and legacy progress — without it, a French card could not find the
 * sentence it extends, and the "serve the base before the extension" ordering
 * would silently stop working in this course alone.
 */
export function swapStepForFrench(step: any, meaning: "de" | "en" = frenchMeaningLanguage()): any | null {
  if (step?.type === "sentence" && step.item) {
    const item = swapItemForFrench(step.item, meaning);
    return item ? { ...step, item } : null;
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const lines = step.dialogue.lines
      .map((line: any) => swapItemForFrench(line, meaning))
      .filter(Boolean);
    // A dialogue is an exchange. One surviving line is not one, and showing it
    // as a conversation would be a lie about what the learner is reading.
    if (lines.length < 2) return null;
    return { ...step, dialogue: { ...step.dialogue, coachingLanguage: undefined, lines } };
  }

  return step;
}

function swapItemForFrench(item: any, meaning: "de" | "en"): any | null {
  const german = String(item?.originalDe ?? item?.de ?? "");
  const french = frenchFor(german, item?.fr) ?? frenchFor(String(item?.de ?? ""), item?.fr);
  if (!french) return null;

  const next: any = { ...item };
  for (const field of GERMAN_ONLY_FIELDS) delete next[field];
  if (!coachingSurvives(item?.coachingLanguage, meaning)) {
    for (const field of ["use", "when", "tierNote"]) delete next[field];
  }
  delete next.coachingLanguage;
  // Already the French text — leaving it would offer the answer as a footnote.
  delete next.fr;

  return {
    ...next,
    de: french,
    en: meaning === "de" ? String(item?.de ?? "") : String(item?.en ?? ""),
    originalDe: german || undefined,
  };
}

// ── Narrowing the catalogue ─────────────────────────────────────────────────

function frenchPhrase(phrase: Phrase): boolean {
  return hasFrench(phrase);
}

function frenchVocab(word: VocabItem): boolean {
  // A word card is taught by its gloss, and its example sentence is a separate
  // card built from `example`/`exampleFr`. The word itself is what decides.
  return hasFrench(word);
}

function frenchDialogue(dialogue: Dialogue): Dialogue | null {
  const lines = (dialogue.lines ?? []).filter((line) => hasFrench(line));
  return lines.length >= 2 ? { ...dialogue, lines } : null;
}

/**
 * One pack, narrowed to what French covers — or null when nothing is left.
 *
 * Example sentences on a vocabulary card are dropped along with any French
 * they lack, because buildSession turns each into its own sentence card and a
 * card with no answer cannot be shown.
 */
export function frenchPart<T extends Part>(part: T): T | null {
  const vocab = (part.vocab ?? []).filter(frenchVocab).map((word) => (
    hasFrench({ de: word.example, fr: word.exampleFr })
      ? word
      : { ...word, example: "", exampleEn: "", exampleFr: undefined }
  ));
  const phrases = (part.phrases ?? []).filter(frenchPhrase);
  const dialogues = (part.dialogues ?? [])
    .map(frenchDialogue)
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

/** Every pack the French course has anything to teach from. */
export function frenchParts<T extends Part>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, part] of Object.entries(parts)) {
    const narrowed = frenchPart(part);
    if (narrowed) out[key] = narrowed;
  }
  return out;
}

/** True when the French course is the one being studied right now. */
export function frenchCourseActive(): boolean {
  return getLearningDirection() === "learn-fr";
}
