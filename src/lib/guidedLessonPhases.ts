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
  "MeaningFirst",
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
 *
 * MeaningFirst is the one stage added back since, and it adds no writing.
 * Every other stage puts the target language in front of you and asks what it
 * means; this one puts the meaning in front of you and shows how it is said,
 * which is the direction you actually need when you are the one talking. It
 * is an exposure rather than a test — there is nothing to get wrong — so it
 * costs a press and buys the pair in the direction the rest of the route
 * never shows it in.
 */
export const LEAN_SENTENCE_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "MeaningFirst",
  "ListenPick",
  "MissingWord",
  "Order",
];

/** The same bargain for a single word, which never had the gap or the order. */
const LEAN_WORD_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "MeaningFirst",
  "ListenPick",
];

export type SentencePhase = typeof SENTENCE_PHASES[number] | "French" | "Memory";

/**
 * Stages that ask for nothing to be typed.
 *
 * The route is deliberately down to ONE typing test per encounter, and the
 * writing stages are what missing it costs. So a stage added for pacing or
 * for a second angle on the same phrase has to be one of these, or it quietly
 * puts back the thing that was taken out — and it would do it to everyone,
 * not just to the learner who got the test wrong.
 */
export const NON_WRITING_SENTENCE_PHASES: readonly SentencePhase[] = [
  "Read",
  "MeaningSelect",
  "MeaningFirst",
  "MissingWord",
  "Order",
];

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
  "MeaningFirst",
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

/**
 * A phrase coming back a second time inside the sitting that taught it.
 *
 * Nothing here is typed. The point of the return is that it happens often and
 * early enough to interrupt forgetting, which only works if it is cheap: a
 * phrase met two cards ago, tapped through in seconds, three angles on it and
 * out. Asking for it to be written closed-book instead made the return the
 * most expensive card in the sitting, so it could only ever be afforded once,
 * at the very end, where it was a test of the last few minutes rather than a
 * second meeting.
 *
 * Pick the meaning, hear which word is missing, put the words in order: the
 * three stages that ask the learner to choose rather than produce.
 */
export const SECOND_SHOWING_PHASES: readonly SentencePhase[] = [
  "MeaningSelect",
  "MissingWord",
  "Order",
];

/** These stages cannot be completed fairly without hearing the target audio. */
export const AUDIO_REQUIRED_SENTENCE_PHASES: readonly SentencePhase[] = [
  "ListenPick",
  "MissingWord",
];

const AUDIO_REQUIRED_PHASE_SET = new Set<SentencePhase>(AUDIO_REQUIRED_SENTENCE_PHASES);

interface SentencePhaseRouteOptions {
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
  /**
   * A route set by hand in settings, one entry per step — a stage set to run
   * twice appears twice.
   *
   * New material only. A phrase already known, an extension of one taught a
   * few cards ago, and the French companion keep their own shorter routes
   * whatever this says: each is short for a reason a setting about drilling
   * new phrases should not override. The hard limits below apply to it as
   * to everything else.
   */
  custom?: readonly SentencePhase[];
  /**
   * True for the quick return of a phrase taught a couple of cards ago. It
   * outranks every other route, including a hand-set one: this is not the
   * phrase being taught, it is the phrase being come back to.
   */
  secondShowing?: boolean;
}

/**
 * The stages a single word can run: every stage that appears in any of the
 * word routes. Derived from those routes rather than listed again, so a stage
 * that becomes possible for a word becomes choosable for one too.
 */
const WORD_CAPABLE_PHASE_SET = new Set<SentencePhase>([
  ...LEAN_WORD_PHASES,
  ...WORD_PHASES,
  ...MASTERED_WORD_PHASES,
]);

export function buildSentencePhaseRoute({
  mastered,
  bilingual,
  audioMuted,
  word = false,
  orderable = true,
  chained = false,
  typingFailed = false,
  custom,
  secondShowing = false,
}: SentencePhaseRouteOptions): SentencePhase[] {
  // A word never takes the chained or bilingual routes, so for a word only
  // being known keeps the hand-set route away.
  const customApplies = !mastered && !secondShowing && (word || (!chained && !bilingual));
  // A sentence-only stage chosen in settings is skipped for a single word,
  // which has no gap to fill and nothing to reorder.
  const customRoute = customApplies && custom?.length
    ? custom.filter((phase) => !word || WORD_CAPABLE_PHASE_SET.has(phase))
    : [];
  const useCustom = customRoute.length > 0;
  const route: readonly SentencePhase[] = secondShowing
    ? SECOND_SHOWING_PHASES.filter((phase) => !word || WORD_CAPABLE_PHASE_SET.has(phase))
    : useCustom
    ? customRoute
    : word
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

  /**
   * With the sound off, a stage that needs it is REPLACED, not removed.
   *
   * Removing it was the rule, and it left a new word with three stages and
   * no test at all: Read, pick the meaning, see it the other way round, done.
   * The one typing test a new item gets was Hear & write, so muting took the
   * test away with the audio and nothing stood in for it. Now Hear & write
   * becomes Read & write, the spoken gap fill becomes the written one, and a
   * word — which has no gap and no ordering to fall back on — gets the
   * written trio in place of its one listening test, so a sitting with the
   * sound off is at least as long as one with it on, never shorter.
   *
   * A replacement already somewhere in the route is not added twice: the
   * full route has Type and Gap of its own, so muting it still just drops
   * the two audio stages and moves nothing else.
   */
  const standIn = (phase: SentencePhase): SentencePhase[] => {
    // The return is tap-only by design, so with the sound off its listening
    // stage is dropped rather than swapped for the written one. The stand-ins
    // exist so muting never removes the one test a new phrase gets; the return
    // is not that test, and it still leads with picking the meaning.
    if (secondShowing) return [];
    if (phase === "ListenPick") return word ? ["Type", "Translate", "RecallBoth"] : ["Type"];
    if (phase === "MissingWord") return word ? [] : ["Gap"];
    return [];
  };
  const seen = new Set<SentencePhase>();
  return route
    .flatMap((phase) => {
      if (!audioMuted || !AUDIO_REQUIRED_PHASE_SET.has(phase)) return [phase];
      return standIn(phase).filter((replacement) => !route.includes(replacement));
    })
    .filter((phase) => {
      if (!orderable && phase === "Order") return false;
      // The de-duplication exists so a stand-in never lands on a stage the
      // route already has. In a hand-set route a stage appearing twice is the
      // setting working, not a collision — and stand-ins are already kept off
      // stages the route contains, above.
      if (useCustom) return true;
      if (seen.has(phase)) return false;
      seen.add(phase);
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

  // The stage that stands in for this one, where the muted route has one:
  // Hear & write hands over to Read & write, the spoken gap to the written.
  const standIn = current === "ListenPick" ? "Type" : current === "MissingWord" ? "Gap" : null;
  if (standIn && mutedRoute.includes(standIn)) return standIn;

  const currentIndex = fullRoute.indexOf(current);
  if (currentIndex < 0) return mutedRoute[0] ?? null;

  return fullRoute.slice(currentIndex + 1).find((phase) => mutedRoute.includes(phase))
    ?? fullRoute.slice(0, currentIndex).reverse().find((phase) => mutedRoute.includes(phase))
    ?? mutedRoute[0]
    ?? null;
}

/**
 * The short name a stage goes by — on the stage bar during a lesson, and in
 * settings when choosing the route. One list, so the two cannot drift apart
 * and a stage is never called one thing in the lesson and another in the
 * place you switch it off.
 */
export function sentenceStageLabel(phase: SentencePhase): string {
  switch (phase) {
    case "MeaningSelect": return "Select";
    case "MeaningFirst": return "Meaning first";
    case "ListenPick": return "Hear & write";
    case "MissingWord": return "Missing word";
    case "Gap": return "Fill in";
    case "Order": return "Reorder";
    case "WriteFromMemory": return "Write it";
    case "RecallBoth": return "Recall both";
    default: return phase;
  }
}

/** What a stage asks for, as the lesson's big heading puts it. */
export function sentenceStageHeading(phase: SentencePhase): string {
  switch (phase) {
    case "Read": return "Read & listen";
    case "MeaningSelect": return "Select the correct meaning";
    // No language names in here on purpose. An interpolated heading is baked
    // out into the tables one combination at a time — "Recall the German",
    // "Recall the French" — and this one would need every meaning-to-target
    // pair the courses can make. The instruction underneath names the
    // language through a slot, which costs one key instead of dozens.
    case "MeaningFirst": return "Now the other way round";
    case "ListenPick": return "Write what you hear";
    case "MissingWord": return "Listen for the missing word";
    case "Type": return "Type the sentence";
    case "Translate": return "Translate this sentence";
    case "Gap": return "Fill the blank";
    case "Order": return "Reorder the sentence";
    case "WriteFromMemory": return "Build from memory";
    case "RecallBoth": return "Recall both sides";
    case "French": return "Type the French";
    case "Memory": return "Recall both languages";
    default: return "Sentence practice";
  }
}
