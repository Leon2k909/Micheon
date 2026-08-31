import { AUDIO_LANGUAGE, courseSides } from "@/lib/courseLanguages";
import { uiSpeechLang } from "@/lib/i18n";
import type { TtsAudioLanguage } from "@/lib/audioMute";
import type { LearningDirection } from "@/lib/direction";

/**
 * The languages this app can currently say something in.
 *
 * The audio panel offered a volume and a speed for all four languages at once,
 * whichever course was open. Somebody learning German from English was given
 * French and Polish controls for voices that will never make a sound, and the
 * two that matter were four rows apart because of it.
 *
 * The rule is not "the course's two languages", which is the tempting version
 * and the wrong one. A control must exist for every voice that can be heard,
 * or somebody ends up with audio they cannot turn down:
 *
 *  - the language being taught, and the language it is taught from;
 *  - the INTERFACE language, because the pet speaks in it. Reading the app in
 *    French while learning German is a real setting, and it makes a French
 *    voice audible in a course with no French in it.
 *
 * The French companion — a second language read out beside the German — would
 * belong here too, but it is switched off in the source and cannot be turned
 * on from anywhere, so including it would be describing a feature rather than
 * a behaviour. If it is ever revived, this is the function it has to come back
 * through, and check-audio-languages-in-play says so.
 */
export function audioLanguagesInPlay(direction?: LearningDirection): TtsAudioLanguage[] {
  const sides = courseSides(direction);
  const inPlay = new Set<TtsAudioLanguage>([
    AUDIO_LANGUAGE[sides.target.code],
    AUDIO_LANGUAGE[sides.meaning.code],
  ]);
  inPlay.add(audioLanguageForVoiceTag(uiSpeechLang()));
  // A stable order rather than the order they happened to be added, so the
  // panel does not rearrange itself when the interface language changes.
  return (["english", "german", "french", "polish", "spanish", "portuguese", "russian"] as TtsAudioLanguage[])
    .filter((language) => inPlay.has(language));
}

function audioLanguageForVoiceTag(tag: string): TtsAudioLanguage {
  if (tag.startsWith("de")) return "german";
  if (tag.startsWith("fr")) return "french";
  if (tag.startsWith("pl")) return "polish";
  if (tag.startsWith("es")) return "spanish";
  if (tag.startsWith("pt")) return "portuguese";
  if (tag.startsWith("ru")) return "russian";
  return "english";
}
