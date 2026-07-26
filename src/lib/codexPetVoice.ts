import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_VOICE_ENABLED_KEY = "gl-codex-pet-voice-enabled-v1";
export const CODEX_PET_VOICE_ENABLED_EVENT = "codex-pet-voice-enabled-changed";

/** Pet narration is deliberately opt-in: a missing preference always means off. */
export function getCodexPetVoiceEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CODEX_PET_VOICE_ENABLED_KEY) === "1";
}

export function setCodexPetVoiceEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  const value = enabled ? "1" : "0";
  window.localStorage.setItem(CODEX_PET_VOICE_ENABLED_KEY, value);
  syncLocalStorageItem(CODEX_PET_VOICE_ENABLED_KEY, value);
  window.dispatchEvent(new CustomEvent(CODEX_PET_VOICE_ENABLED_EVENT, {
    detail: { enabled },
  }));
}
