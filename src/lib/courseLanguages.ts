import type { TtsAudioLanguage } from "@/lib/audioMute";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import { resolveInterfaceLanguage } from "@/lib/interfaceLanguage";

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
export type CourseLanguage = "de" | "en" | "fr" | "pl";

/** Every BCP-47 tag the app asks a voice for. */
export type VoiceTag = "de-DE" | "en-GB" | "en-US" | "fr-FR" | "pl-PL";

export type CourseSide = {
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
};

/** The name the audio mixer knows each language by. */
export const AUDIO_LANGUAGE: Record<CourseLanguage, TtsAudioLanguage> = {
  de: "german",
  en: "english",
  fr: "french",
  pl: "polish",
};

export function courseSide(code: CourseLanguage): CourseSide {
  const englishVoice = resolveEnglishVariant(getEnglishVariant()) === "american" ? "en-US" : "en-GB";
  return {
    code,
    label: LANGUAGE_LABEL[code],
    voice: code === "de" ? "de-DE" : code === "fr" ? "fr-FR" : code === "pl" ? "pl-PL" : englishVoice,
    htmlLang: code,
  };
}

/** The language a course teaches. */
export function targetLanguage(direction: LearningDirection = getLearningDirection()): CourseLanguage {
  if (direction === "learn-en") return "en";
  if (direction === "learn-fr") return "fr";
  if (direction === "learn-pl") return "pl";
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

export function courseSides(direction: LearningDirection = getLearningDirection()): CourseSides {
  if (direction === "learn-en") return { target: courseSide("en"), meaning: courseSide("de") };
  if (direction === "learn-fr") return { target: courseSide("fr"), meaning: courseSide(meaningLanguageFor("fr")) };
  if (direction === "learn-pl") {
    // Narrowed to the two columns every entry carries. A French interface
    // would otherwise ask for a French meaning beside a Polish card, and the
    // Polish table is keyed by the German — there is no French to put there,
    // so the row would be labelled French and filled with English.
    const app = meaningLanguageFor("pl");
    return { target: courseSide("pl"), meaning: courseSide(app === "de" ? "de" : "en") };
  }
  return { target: courseSide("de"), meaning: courseSide("en") };
}
