const KEY = "gl-audio-muted";
export const AUDIO_MUTE_EVENT = "gl-audio-mute-changed";

/** Global app-audio mute: silences TTS voices and game-feel sounds. */
export function isAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function setAudioMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, muted ? "1" : "0");
  window.dispatchEvent(new Event(AUDIO_MUTE_EVENT));
}

export function toggleAudioMuted(): boolean {
  const next = !isAudioMuted();
  setAudioMuted(next);
  return next;
}
