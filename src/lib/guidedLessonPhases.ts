/**
 * Sentence-practice stages live here so the route can be changed without
 * duplicating stage names in the lesson UI and its regression checks.
 */
export const SENTENCE_PHASES = [
  "Read",
  "MeaningPick",
  "MeaningSelect",
  "ListenPick",
  "MissingWord",
  "Type",
  "Translate",
  "TypeAgain",
  "TranslateAgain",
  "Gap",
  "Order",
  "WriteFromMemory",
  "RecallTarget",
  "RecallMeaning",
  "RecallBoth",
] as const;

export type SentencePhase = typeof SENTENCE_PHASES[number] | "French" | "Memory";

export const BILINGUAL_SENTENCE_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningPick",
  "MeaningSelect",
  "ListenPick",
  "MissingWord",
  "Type",
  "French",
  "Memory",
];

export const MASTERED_SENTENCE_PHASES: readonly SentencePhase[] = [
  "RecallTarget",
  "RecallMeaning",
  "RecallBoth",
];

/** These stages cannot be completed fairly without hearing the target audio. */
export const AUDIO_REQUIRED_SENTENCE_PHASES: readonly SentencePhase[] = [
  "ListenPick",
  "MissingWord",
];

const AUDIO_REQUIRED_PHASE_SET = new Set<SentencePhase>(AUDIO_REQUIRED_SENTENCE_PHASES);

export interface SentencePhaseRouteOptions {
  mastered: boolean;
  bilingual: boolean;
  audioMuted: boolean;
}

export function buildSentencePhaseRoute({
  mastered,
  bilingual,
  audioMuted,
}: SentencePhaseRouteOptions): SentencePhase[] {
  const route: readonly SentencePhase[] = mastered
    ? MASTERED_SENTENCE_PHASES
    : bilingual
      ? BILINGUAL_SENTENCE_PHASES
      : SENTENCE_PHASES;

  return audioMuted
    ? route.filter((phase) => !AUDIO_REQUIRED_PHASE_SET.has(phase))
    : [...route];
}

/**
 * If sound is muted during an audio-only stage, continue at the first stage
 * after it that can still be completed. Falling back backwards keeps this
 * helper safe if an audio-only stage is ever placed at the end of a route.
 */
export function replacementSentencePhaseWhenMuted(
  current: SentencePhase,
  options: Omit<SentencePhaseRouteOptions, "audioMuted">
): SentencePhase | null {
  const fullRoute = buildSentencePhaseRoute({ ...options, audioMuted: false });
  const mutedRoute = buildSentencePhaseRoute({ ...options, audioMuted: true });
  if (mutedRoute.includes(current)) return current;

  const currentIndex = fullRoute.indexOf(current);
  if (currentIndex < 0) return mutedRoute[0] ?? null;

  return fullRoute.slice(currentIndex + 1).find((phase) => mutedRoute.includes(phase))
    ?? fullRoute.slice(0, currentIndex).reverse().find((phase) => mutedRoute.includes(phase))
    ?? mutedRoute[0]
    ?? null;
}
