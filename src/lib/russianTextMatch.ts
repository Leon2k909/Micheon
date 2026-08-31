import { resolveInterfaceLanguage } from "@/lib/interfaceLanguage";
import {
  getRussianScript,
  matchRussianAnswer,
  resolveRussianScript,
  type RussianMatch,
} from "@/lib/russianScript";

/**
 * Grading a typed RUSSIAN answer.
 *
 * WHY THIS FILE IS THIN. Every other language's matcher holds its own rules
 * because the rules are about that language's spelling — which diacritics are
 * a slip, which letter pairs are two real words. Russian's hard question is
 * not spelling, it is WHICH ALPHABET the learner is typing in, and that is
 * already answered in russianScript.ts, where the five transcriptions live.
 * Answering it twice would give the two files room to disagree.
 *
 * So this is the adapter: it reads the two settings the grader needs — the
 * script on screen and the language the app is being read in — and hands them
 * to the comparison. The signature then matches matchPolishSentence and the
 * rest, which is what the lesson expects of a matcher.
 *
 * WHAT COUNTS AS A SLIP RATHER THAN A MISTAKE:
 *   - the other alphabet. A learner reading Cyrillic who types the Latin, or
 *     the reverse, produced the word; the alphabet is a display setting and
 *     not the thing being tested.
 *   - another language's transcription. Somebody who learned "Khorosho" in an
 *     English app and switched the interface to German has not forgotten it,
 *     and "Choroscho is the spelling here" is the whole of what went wrong.
 *   - a missing ï, ż or ł, and a doubled ss written single — the diacritics
 *     belong to the transcription's own language and sit on nobody else's
 *     keyboard, exactly as polishTextMatch.ts already forgives.
 *
 * WHAT IS DELIBERATELY NOT PUNISHED: a Latin form that reads back two ways.
 * German writes both ж and ш as "sch", so "Schena" is Жена or Шена and the
 * transcription itself cannot say which. That is not a defect to grade
 * against — the card carries the Cyrillic as a note instead.
 */
export type { RussianMatch };

export function matchRussianSentence(input: string, target: string): RussianMatch {
  const script = resolveRussianScript(getRussianScript());
  return matchRussianAnswer(input, target, script, resolveInterfaceLanguage());
}

/** Sentences and phrases go through the same comparison — one entry, two names. */
export const matchRussianPhrase = matchRussianSentence;

/**
 * A vocabulary card names several equally right senses. They are choices, not
 * a phrase to reproduce in full — the same rule the Polish matcher applies,
 * with Russian's own "или" beside the comma.
 */
export function russianMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+или\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function primaryRussianMeaning(value: string): string {
  return russianMeaningAlternatives(value)[0] ?? "";
}

export function matchRussianMeaning(input: string, target: string): RussianMatch {
  const whole = matchRussianSentence(input, target);
  if (whole.ok) return whole;
  for (const alternative of russianMeaningAlternatives(target)) {
    const result = matchRussianSentence(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}
