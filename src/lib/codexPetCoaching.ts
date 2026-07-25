import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_QUESTION_FREQUENCY_KEY = "gl-codex-pet-question-frequency-v1";
export const CODEX_PET_TIP_FREQUENCY_KEY = "gl-codex-pet-tip-frequency-v1";
export const CODEX_PET_COACHING_FREQUENCY_EVENT = "codex-pet-coaching-frequency-changed";

export type CodexPetCoachingKind = "questions" | "tips";
export type CodexPetFrequency = "off" | "low" | "normal" | "high";

export type CodexPetCadence = {
  initialDelayMs: number;
  intervalMs: number;
};

const DEFAULT_FREQUENCY: CodexPetFrequency = "normal";
const VALID_FREQUENCIES = new Set<CodexPetFrequency>(["off", "low", "normal", "high"]);

const CADENCES: Record<
  CodexPetCoachingKind,
  Record<Exclude<CodexPetFrequency, "off">, CodexPetCadence>
> = {
  questions: {
    low: { initialDelayMs: 2 * 60_000, intervalMs: 10 * 60_000 },
    normal: { initialDelayMs: 30_000, intervalMs: 2 * 60_000 },
    high: { initialDelayMs: 15_000, intervalMs: 60_000 },
  },
  tips: {
    low: { initialDelayMs: 3 * 60_000, intervalMs: 10 * 60_000 },
    normal: { initialDelayMs: 45_000, intervalMs: 60_000 },
    high: { initialDelayMs: 20_000, intervalMs: 30_000 },
  },
};

function storageKey(kind: CodexPetCoachingKind) {
  return kind === "questions"
    ? CODEX_PET_QUESTION_FREQUENCY_KEY
    : CODEX_PET_TIP_FREQUENCY_KEY;
}

function validFrequency(value: string | null): CodexPetFrequency {
  return value && VALID_FREQUENCIES.has(value as CodexPetFrequency)
    ? value as CodexPetFrequency
    : DEFAULT_FREQUENCY;
}

export function getCodexPetFrequency(kind: CodexPetCoachingKind): CodexPetFrequency {
  if (typeof window === "undefined") return DEFAULT_FREQUENCY;
  try {
    return validFrequency(window.localStorage.getItem(storageKey(kind)));
  } catch {
    return DEFAULT_FREQUENCY;
  }
}

export function setCodexPetFrequency(
  kind: CodexPetCoachingKind,
  frequency: CodexPetFrequency
) {
  if (typeof window === "undefined" || !VALID_FREQUENCIES.has(frequency)) return;
  const key = storageKey(kind);
  try {
    if (window.localStorage.getItem(key) === frequency) return;
    window.localStorage.setItem(key, frequency);
  } catch {
    // Keep the live preference usable even when storage is unavailable.
  }
  syncLocalStorageItem(key, frequency);
  window.dispatchEvent(new CustomEvent(CODEX_PET_COACHING_FREQUENCY_EVENT, {
    detail: { frequency, kind },
  }));
}

export function getCodexPetCadence(
  kind: CodexPetCoachingKind,
  frequency: CodexPetFrequency
): CodexPetCadence | null {
  if (frequency === "off") return null;
  return CADENCES[kind][frequency];
}
