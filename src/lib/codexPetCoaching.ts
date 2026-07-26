import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_QUESTION_FREQUENCY_KEY = "gl-codex-pet-question-frequency-v1";
export const CODEX_PET_TIP_FREQUENCY_KEY = "gl-codex-pet-tip-frequency-v1";
export const CODEX_PET_COACHING_FREQUENCY_EVENT = "codex-pet-coaching-frequency-changed";

export type CodexPetCoachingKind = "questions" | "tips";
export type CodexPetFrequency = "off" | "low" | "normal" | "high" | "custom";

export type CodexPetCadence = {
  initialDelayMs: number;
  intervalMs: number;
};

const DEFAULT_FREQUENCY: CodexPetFrequency = "normal";
const VALID_FREQUENCIES = new Set<CodexPetFrequency>(["off", "low", "normal", "high", "custom"]);

const CADENCES: Record<
  CodexPetCoachingKind,
  Record<Exclude<CodexPetFrequency, "off" | "custom">, CodexPetCadence>
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
  if (frequency === "custom") {
    const timings = getCodexPetTimings();
    return kind === "questions"
      ? {
          initialDelayMs: timings.questionsFirstSeconds * 1000,
          intervalMs: timings.questionsEverySeconds * 1000,
        }
      : {
          initialDelayMs: timings.tipsFirstSeconds * 1000,
          intervalMs: timings.tipsEverySeconds * 1000,
        };
  }
  return CADENCES[kind][frequency];
}

// ── Custom timings ──────────────────────────────────────────────────────────
// The presets above cover most people, but "how long until the next one" and
// "how long does it stay up" are exactly the sort of thing that is either right
// or maddening, and one person's right is another's maddening. So both are
// settable outright.

export const CODEX_PET_TIMINGS_KEY = "gl-codex-pet-timings-v1";

export type CodexPetTimings = {
  /** Seconds a plain remark stays on screen. */
  messageSeconds: number;
  /** Seconds a question stays up — it needs long enough to actually answer. */
  questionSeconds: number;
  /** Custom cadence, used when a frequency is set to "custom". */
  questionsFirstSeconds: number;
  questionsEverySeconds: number;
  tipsFirstSeconds: number;
  tipsEverySeconds: number;
};

/** Matches the previous hardcoded behaviour, so nothing moves until asked. */
export const DEFAULT_TIMINGS: CodexPetTimings = {
  messageSeconds: 3.2,
  questionSeconds: 18,
  questionsFirstSeconds: 30,
  questionsEverySeconds: 120,
  tipsFirstSeconds: 45,
  tipsEverySeconds: 60,
};

/** Wide enough to be useful, bounded so a typo cannot wedge the pet. */
const TIMING_BOUNDS: Record<keyof CodexPetTimings, [number, number]> = {
  messageSeconds: [1, 60],
  questionSeconds: [3, 300],
  questionsFirstSeconds: [5, 3600],
  questionsEverySeconds: [10, 3600],
  tipsFirstSeconds: [5, 3600],
  tipsEverySeconds: [10, 3600],
};

function clampTiming(field: keyof CodexPetTimings, value: unknown): number {
  const [min, max] = TIMING_BOUNDS[field];
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_TIMINGS[field];
  return Math.min(max, Math.max(min, numeric));
}

export function getCodexPetTimings(): CodexPetTimings {
  if (typeof window === "undefined") return { ...DEFAULT_TIMINGS };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CODEX_PET_TIMINGS_KEY) ?? "{}");
    const out = { ...DEFAULT_TIMINGS };
    if (parsed && typeof parsed === "object") {
      for (const field of Object.keys(DEFAULT_TIMINGS) as (keyof CodexPetTimings)[]) {
        if (field in parsed) out[field] = clampTiming(field, (parsed as any)[field]);
      }
    }
    return out;
  } catch {
    return { ...DEFAULT_TIMINGS };
  }
}

export function setCodexPetTimings(next: Partial<CodexPetTimings>) {
  if (typeof window === "undefined") return;
  const merged = { ...getCodexPetTimings() };
  for (const field of Object.keys(DEFAULT_TIMINGS) as (keyof CodexPetTimings)[]) {
    if (field in next) merged[field] = clampTiming(field, next[field]);
  }
  const raw = JSON.stringify(merged);
  try {
    window.localStorage.setItem(CODEX_PET_TIMINGS_KEY, raw);
  } catch {
    // Keep the live preference usable even when storage is unavailable.
  }
  syncLocalStorageItem(CODEX_PET_TIMINGS_KEY, raw);
  window.dispatchEvent(new CustomEvent(CODEX_PET_COACHING_FREQUENCY_EVENT, {
    detail: { kind: "timings" },
  }));
}

export function resetCodexPetTimings() {
  setCodexPetTimings(DEFAULT_TIMINGS);
}
