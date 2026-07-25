import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_MESSAGES_MUTED_KEY = "gl-codex-pet-messages-muted-v1";
export const CODEX_PET_MESSAGES_MUTED_EVENT = "codex-pet-messages-muted-changed";

export function getCodexPetMessagesMuted() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CODEX_PET_MESSAGES_MUTED_KEY) === "1";
}

export function setCodexPetMessagesMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  const value = muted ? "1" : "0";
  window.localStorage.setItem(CODEX_PET_MESSAGES_MUTED_KEY, value);
  syncLocalStorageItem(CODEX_PET_MESSAGES_MUTED_KEY, value);
  window.dispatchEvent(new CustomEvent(CODEX_PET_MESSAGES_MUTED_EVENT, {
    detail: { muted },
  }));
}
