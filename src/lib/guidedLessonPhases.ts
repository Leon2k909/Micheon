/**
 * Sentence-practice stages live here so the route can be changed without
 * duplicating stage names in the lesson UI and its regression checks.
 *
 * There used to be a stage before MeaningSelect that asked the same question
 * the other way round: here is the English, pick the German. It went because
 * the two were one recognition check charged twice, off the same distractor
 * pool, before a single word had been produced. MeaningSelect is the harder
 * of the pair to guess at, so it is the one that stayed.
 */
export const SENTENCE_PHASES = [
  "Read",
  "MeaningSelect",
  "ListenPick",
  "MissingWord",
  "Type",
  "Translate",
  "Gap",
  "Order",
  "WriteFromMemory",
  "RecallBoth",
] as const;

/**
 * This is the FULL route, and it is what missing the typing test costs.
 *
 * It asked for the same sentence to be written out nine times before: Type
 * and Translate, then both again verbatim, then the gap, then from memory,
 * then three closed-book stages of which the third asked for both languages
 * the first two had just asked for one at a time. The two Again stages and
 * the two single-direction recalls have gone — each was a question re-asked
 * with nothing changed between the asks.
 *
 * Six writing stages remain here, which is still a lot; that is the point.
 * Nobody meets this route by default any more. LEAN_SENTENCE_PHASES below is
 * what a new phrase gets, and this is what it becomes when the one test in it
 * is failed.
 */
/**
 * What a new phrase asks for when the one typing test is passed.
 *
 * The full route above writes the same sentence out six times: from audio,
 * then copied off the screen, then translated, then half-copied into gaps,
 * then from memory, then from memory again in both languages. Only the first
 * of those is a test — after it, the answer has been produced once and the
 * rest is transcription, and transcription is the slowest thing the app asks
 * for. Time spent copying a phrase you have already written correctly is time
 * not spent meeting the next one.
 *
 * So the typing stages come out and Hear & write stays, because it is the
 * strongest single test there is: nothing on screen to copy, so passing it
 * proves the sound, the spelling and the production together. Recognition is
 * untouched — nothing here is replaced by a multiple choice, the choice
 * stages are the ones that were always there.
 *
 * Closed-book recall moves to the review, where it is a real test. Asking for
 * it ninety seconds after teaching the phrase was measuring the short-term
 * memory of someone who had just read the answer four times.
 */
export const LEAN_SENTENCE_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "ListenPick",
  "MissingWord",
  "Order",
];

/** The same bargain for a single word, which never had the gap or the order. */
export const LEAN_WORD_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "ListenPick",
];

export type SentencePhase = typeof SENTENCE_PHASES[number] | "French" | "Memory";

export const BILINGUAL_SENTENCE_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "ListenPick",
  "MissingWord",
  "Type",
  "French",
  "Memory",
];

/**
 * A phrase the learner already holds: type both, closed book, once.
 *
 * This was three stages — recall the German, recall the meaning, then recall
 * both — which is the same sentence typed out three times to answer one
 * question. The third asks for everything the first two did, so it is the one
 * that stayed. Getting it right is the fastest possible way through a phrase
 * you know, which is the whole point of knowing it; getting it wrong puts the
 * full route back, which is what the mistake is for.
 */
export const MASTERED_SENTENCE_PHASES: readonly SentencePhase[] = [
  "RecallBoth",
];

/**
 * A new word gets one recognition check, a listening check, written production
 * in both languages, then one closed-book retrieval. Sentence-only mechanics
 * such as word ordering and gap fill still stay out of this route.
 */
export const WORD_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "ListenPick",
  "Type",
  "Translate",
  "RecallBoth",
];

/** A word the learner already holds: both directions, in one answer. */
export const MASTERED_WORD_PHASES: readonly SentencePhase[] = [
  "RecallBoth",
];

/**
 * An extension of a sentence taught minutes earlier in the same sitting:
 * "Ich arbeite." then "Ich arbeite heute im Homeoffice."
 *
 * The recognition scaffolding — pick the meaning, pick it back, pick what you
 * heard, fill the missing word — exists to introduce material the learner has
 * never seen. Here every word but the new tail was just learned, so repeating
 * that whole march teaches nothing and makes the pair feel like a punishment
 * for the app's own idea. The route keeps reading it, producing it in both
 * languages, and one closed-book recall.
 */
export const CHAINED_SENTENCE_PHASES: readonly SentencePhase[] = [
  "Read",
  "Type",
  "Translate",
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
  /** True for a single-word item from a vocabulary sitting. */
  word?: boolean;
  /** False for a phrase of two words or fewer: dragging two tiles has only
   *  one possible swap, so the stage tests nothing and is dropped from the
   *  route entirely rather than shown as a one-move formality. */
  orderable?: boolean;
  /** True when this sentence extends one taught earlier in the same sitting,
   *  so the introduce-from-cold stages are already spent. */
  chained?: boolean;
  /**
   * True once the learner has missed this phrase's typing test, or taken the
   * options instead of typing it.
   *
   * That is the only thing that buys the writing stages back. They are not
   * removed from the app — they are what a wrong answer is for.
   */
  typingFailed?: boolean;
}

export function buildSentencePhaseRoute({
  mastered,
  bilingual,
  audioMuted,
  word = false,
  orderable = true,
  chained = false,
  typingFailed = false,
}: SentencePhaseRouteOptions): SentencePhase[] {
  const route: readonly SentencePhase[] = word
    ? (mastered ? MASTERED_WORD_PHASES : typingFailed ? WORD_PHASES : LEAN_WORD_PHASES)
    : mastered
    ? MASTERED_SENTENCE_PHASES
    : chained
      ? CHAINED_SENTENCE_PHASES
      : bilingual
        ? BILINGUAL_SENTENCE_PHASES
        : typingFailed
          ? SENTENCE_PHASES
          : LEAN_SENTENCE_PHASES;

  return route.filter((phase) => {
    if (audioMuted && AUDIO_REQUIRED_PHASE_SET.has(phase)) return false;
    if (!orderable && phase === "Order") return false;
    return true;
  });
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
