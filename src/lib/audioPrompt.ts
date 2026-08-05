import {
  audioLanguageFromTag,
  getAudioSettings,
  setAudioMuted,
  setMasterAudioVolume,
  setTtsLanguageMuted,
  setTtsLanguageVolume,
  type TtsAudioLanguage,
} from "@/lib/audioMute";

/**
 * Pressing a play button while the audio it needs is switched off used to do
 * nothing at all — no sound, no error, no explanation. The learner is left
 * wondering whether the button is broken, the voice failed to download, or
 * they clicked the wrong thing.
 *
 * Playback now reports itself as silenced, and the app answers the obvious
 * question: this is muted, do you want it back on?
 */
export const SILENCED_PLAYBACK_EVENT = "gl-audio-silenced-playback";

/** Which control is holding the sound back. Order matters: outermost first. */
export type SilencedReason = "master-muted" | "master-volume" | "language-muted" | "language-volume";

export interface SilencedPlayback {
  /** null for a language the app has no separate control for. */
  language: TtsAudioLanguage | null;
  reasons: SilencedReason[];
  /** Play the thing that was asked for, once the sound is back on. */
  replay?: () => void;
}

/** Everything currently silencing this language, or null if it would be heard. */
export function describeSilencedPlayback(lang: string): SilencedPlayback | null {
  const settings = getAudioSettings();
  const language = audioLanguageFromTag(lang);
  const reasons: SilencedReason[] = [];

  if (settings.muted) reasons.push("master-muted");
  else if (settings.masterVolume <= 0) reasons.push("master-volume");

  if (language === "english") {
    if (settings.englishMuted) reasons.push("language-muted");
    else if (settings.englishVolume <= 0) reasons.push("language-volume");
  } else if (language === "german") {
    if (settings.germanMuted) reasons.push("language-muted");
    else if (settings.germanVolume <= 0) reasons.push("language-volume");
  }

  return reasons.length ? { language, reasons } : null;
}

/**
 * Called from the playback path when a request produced silence. Carries the
 * replay so that saying yes actually plays what was asked for, rather than
 * turning the sound on and leaving the learner to press the button again.
 */
export function reportSilencedPlayback(lang: string, replay?: () => void): SilencedPlayback | null {
  const silenced = describeSilencedPlayback(lang);
  if (!silenced || typeof window === "undefined") return silenced;
  window.dispatchEvent(new CustomEvent<SilencedPlayback>(SILENCED_PLAYBACK_EVENT, {
    detail: { ...silenced, replay },
  }));
  return silenced;
}

/** Undo every control that was holding this sound back, and nothing else. */
export function restoreSilencedPlayback(silenced: SilencedPlayback) {
  const { language, reasons } = silenced;
  if (reasons.includes("master-muted")) setAudioMuted(false);
  if (reasons.includes("master-volume")) setMasterAudioVolume(0.8);
  if (language) {
    if (reasons.includes("language-muted")) setTtsLanguageMuted(language, false);
    if (reasons.includes("language-volume")) setTtsLanguageVolume(language, 0.8);
  }
}

/** "German audio", "English audio", or just "Audio" when it is the master control. */
export function describeSilencedLabel(silenced: SilencedPlayback): string {
  const languageLevel = silenced.reasons.some((r) => r.startsWith("language"));
  if (!languageLevel || !silenced.language) return "Audio";
  return silenced.language === "german" ? "German audio" : "English audio";
}
