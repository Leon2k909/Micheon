import type { TtsAudioLanguage } from "@/lib/audioMute";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import { resolveInterfaceLanguage } from "@/lib/interfaceLanguage";
import { translate, type TranslationLanguage } from "@/lib/translations";

/**
 * The two sides of a card, named — for every screen that shows both.
 *
 * Lessons, the flashcard preview, Quick Match, Listen, the tests and the
 * trackers all draw one card as two rows, and all of them had "German" and
 * "English" written straight into them. Those were never the names of the two
 * rows: they are the TARGET (what is being learned) and the MEANING (what it
 * says in a language the learner already reads). With two courses the two
 * spellings happened to cover it. With three they do not, and the failure is
 * silent — a French card labelled "German", read aloud by a German voice.
 *
 * So the question is asked in one place. A fourth course is one more case
 * here rather than a hunt through six screens.
 */
export type CourseLanguage = "de" | "en" | "fr" | "pl" | "es" | "it" | "pt" | "ru";

/** Every BCP-47 tag the app asks a voice for. */
export type VoiceTag = "de-DE" | "en-GB" | "en-US" | "fr-FR" | "pl-PL" | "es-ES" | "it-IT" | "pt-PT" | "ru-RU";

type CourseSide = {
  code: CourseLanguage;
  /** English label, passed through ui() by the caller that shows it. */
  label: string;
  /** BCP-47 tag for the voice that reads this side. */
  voice: VoiceTag;
  /** For the `lang` attribute, so screen readers and hyphenation agree. */
  htmlLang: string;
};

export type CourseSides = { target: CourseSide; meaning: CourseSide };

export const LANGUAGE_LABEL: Record<CourseLanguage, string> = {
  de: "German",
  en: "English",
  fr: "French",
  pl: "Polish",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
};

/** The name the audio mixer knows each language by. */
export const AUDIO_LANGUAGE: Record<CourseLanguage, TtsAudioLanguage> = {
  de: "german",
  en: "english",
  fr: "french",
  pl: "polish",
  es: "spanish",
  it: "italian",
  pt: "portuguese",
  ru: "russian",
};

export function courseSide(code: CourseLanguage): CourseSide {
  const englishVoice = resolveEnglishVariant(getEnglishVariant()) === "american" ? "en-US" : "en-GB";
  return {
    code,
    label: LANGUAGE_LABEL[code],
    voice: code === "de" ? "de-DE"
      : code === "fr" ? "fr-FR"
      : code === "pl" ? "pl-PL"
      : code === "es" ? "es-ES"
      : code === "it" ? "it-IT"
      : code === "pt" ? "pt-PT"
      : code === "ru" ? "ru-RU"
      : englishVoice,
    htmlLang: code,
  };
}

/** The language a course teaches. */
export function targetLanguage(direction: LearningDirection = getLearningDirection()): CourseLanguage {
  if (direction === "learn-en") return "en";
  if (direction === "learn-fr") return "fr";
  if (direction === "learn-pl") return "pl";
  if (direction === "learn-es") return "es";
  if (direction === "learn-it") return "it";
  if (direction === "learn-pt") return "pt";
  if (direction === "learn-ru") return "ru";
  return "de";
}

/**
 * The language a card is EXPLAINED in.
 *
 * The learner has already answered this once, by choosing what the app itself
 * is written in. That is the language they read without working at it, and it
 * is a setting rather than something read off the course — which starts to
 * matter now the app speaks a language no course teaches you in. The one
 * answer it cannot give is the language being learned, because nothing
 * explains French in French, so a target that matches falls back to the other
 * half of the pair the catalogue has always carried.
 *
 * Whether a screen can HONOUR this is a separate question, and the answer is
 * whether it can produce the meaning in that language at all. Listen can: its
 * queue is built from the same translation table the French course reads.
 */
export function meaningLanguageFor(
  target: CourseLanguage,
  app: CourseLanguage = resolveInterfaceLanguage()
): CourseLanguage {
  if (app !== target) return app;
  return target === "en" ? "de" : "en";
}

/**
 * Every translation table this setup cannot be built without.
 *
 * The course's own is the obvious one, and direction.ts already answers it:
 * a course read out of a table comes out SHORT without it, because an entry
 * the table does not cover is dropped rather than shown in German.
 *
 * The app's language is the one that was missed. Listen explains a card in
 * whatever the app is written in, and it reads that out of the same tables —
 * so a GERMAN course in a French app needs French, and asking the course
 * alone answers "nothing". The queue then drops every card it cannot
 * translate, which is all of them, and Listen opens empty with nothing on
 * screen to say why.
 *
 * Two at most today, and deduplicated, because the French course in a French
 * app explains itself in English and needs the one table.
 */
export function translationLanguagesNeeded(
  direction: LearningDirection = getLearningDirection()
): Array<"fr" | "pl" | "es" | "it" | "pt" | "ru"> {
  const target = targetLanguage(direction);
  const wanted = new Set<"fr" | "pl" | "es" | "it" | "pt" | "ru">();
  for (const code of [target, meaningLanguageFor(target)]) {
    if (code === "fr" || code === "pl" || code === "es" || code === "it" || code === "pt" || code === "ru") wanted.add(code);
  }
  return [...wanted];
}

/**
 * The two columns of a course: what is being learned, and what it means.
 *
 * Each direction used to answer separately, and five of them narrowed the
 * meaning column back to German or English on the grounds that those are the
 * only two every card carries. That was true of the card and not of the
 * tables: they are all keyed by the same German, so the meaning in a third
 * language is one lookup away, and stepsForLearningDirection now does it.
 * With the narrowing gone every direction gives the same answer, so it is
 * given once — a branch per course is a branch that can drift.
 */
export function courseSides(direction: LearningDirection = getLearningDirection()): CourseSides {
  const target = targetLanguage(direction);
  return { target: courseSide(target), meaning: courseSide(meaningLanguageFor(target)) };
}

/**
 * What a card means, written in the meaning column's own language.
 *
 * Every screen that shows both sides used to write
 * `meaning.code === "de" ? de : en`, which was the whole truth while the
 * column could only be one of those two. It can be any of the eight now, and
 * the shorthand quietly answers English while the label above it and the
 * voice reading it say something else — the one state worse than not
 * following the setting at all.
 *
 * Where a table does not reach the card the English stays, which is the same
 * trade stepsForLearningDirection makes for the lesson.
 */
export function meaningTextFor(
  german: string | null | undefined,
  english: string | null | undefined,
  meaning: CourseLanguage = meaningLanguageFor(targetLanguage())
): string {
  const de = String(german ?? "");
  const en = String(english ?? "");
  if (meaning === "de") return de;
  if (meaning === "en") return en;
  const written = translate(de, meaning as TranslationLanguage);
  return written && written.trim() ? written.trim() : en;
}

