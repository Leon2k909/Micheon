import type { TtsAudioLanguage } from "@/lib/audioMute";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import { frenchMeaningLanguage } from "@/lib/frenchCourse";

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
export type CourseLanguage = "de" | "en" | "fr";

/** Every BCP-47 tag the app asks a voice for. */
export type VoiceTag = "de-DE" | "en-GB" | "en-US" | "fr-FR";

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
};

/** The name the audio mixer knows each language by. */
export const AUDIO_LANGUAGE: Record<CourseLanguage, TtsAudioLanguage> = {
  de: "german",
  en: "english",
  fr: "french",
};

export function courseSide(code: CourseLanguage): CourseSide {
  const englishVoice = resolveEnglishVariant(getEnglishVariant()) === "american" ? "en-US" : "en-GB";
  return {
    code,
    label: LANGUAGE_LABEL[code],
    voice: code === "de" ? "de-DE" : code === "fr" ? "fr-FR" : englishVoice,
    htmlLang: code,
  };
}

export function courseSides(direction: LearningDirection = getLearningDirection()): CourseSides {
  if (direction === "learn-en") return { target: courseSide("en"), meaning: courseSide("de") };
  if (direction === "learn-fr") return { target: courseSide("fr"), meaning: courseSide(frenchMeaningLanguage()) };
  return { target: courseSide("de"), meaning: courseSide("en") };
}
