import { matchingVisibleKey } from "@/lib/germanTextMatch";
import type { ListenItem } from "@/lib/listenMode";

/**
 * A quick test over what you have just been listening to.
 *
 * Listen is passive by design: it plays, you half-attend, and nothing it does
 * moves your lesson queue. That leaves one question it could never answer —
 * how much of it stuck. This is that question, asked over the items this
 * sitting actually played rather than over the course at large.
 *
 * It reports and does not grade, for the same reason Listen does not: choosing
 * an answer from four is recognition, and the app draws a hard line between
 * recognising a word and being able to produce it. A score here is a
 * measurement, not a promotion.
 */
type ListenTestQuestion = {
  id: string;
  /** The side the card leads with, which is the side you have been hearing. */
  prompt: string;
  answer: string;
  /** The answer and its distractors, in a fixed order. */
  options: string[];
  kind: "sentence" | "word";
};

export const LISTEN_TEST_OPTIONS = 4;
export const LISTEN_TEST_MAX_QUESTIONS = 12;
/** Below this there are not enough distractors to ask a fair question. */
export const LISTEN_TEST_MIN_HEARD = 2;

/**
 * Deterministic shuffling.
 *
 * A test that re-deals on every render moves the option under the cursor
 * between the press and the click, which scores the wrong answer through no
 * fault of the learner. Everything here is derived from the ids, so the same
 * set of heard items always produces the same paper.
 */
function seededShuffle<T>(list: T[], seed: number): T[] {
  const out = [...list];
  let state = (seed % 2147483647) + 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const seedFor = (items: ListenItem[]): number =>
  items.reduce((total, item, index) => total + item.id.length * (index + 7) + item.de.length, 13);

/**
 * One question per heard item, with distractors that could plausibly be
 * confused for the answer.
 *
 * Distractors come from the rest of the sitting first and from the wider queue
 * only to make the numbers up, because the interesting mistake is mixing up
 * two things you heard in the same ten minutes. They are filtered by what they
 * LOOK like rather than by id: two entries reading the same on screen make a
 * question with two right answers, which marks the learner wrong for being
 * right — the same trap the matching board is built to avoid.
 */
export function buildListenTest(
  heard: ListenItem[],
  pool: ListenItem[] = [],
  maxQuestions: number = LISTEN_TEST_MAX_QUESTIONS
): ListenTestQuestion[] {
  /*
   * Paragraphs are heard but not tested.
   *
   * A question here is four options and one right answer, which works because
   * the options are short enough to hold in the head at once. Four paragraphs
   * is not that question: it is a reading-comprehension exercise where the
   * work is re-reading the choices rather than remembering the card, and the
   * distractors would be four passages that look alike at a glance whatever
   * they say. Listen plays them; Passages is where they are answered.
   */
  // Narrowed rather than merely filtered, so a question's kind is the two
  // this paper can actually ask about.
  const usable = heard.filter((item): item is ListenItem & { kind: "sentence" | "word" } =>
    item.kind !== "passage" && Boolean(item.de.trim()) && Boolean(item.en.trim()));
  if (usable.length < LISTEN_TEST_MIN_HEARD) return [];

  const seed = seedFor(usable);
  // The most recent first, so a long sitting is tested on what it just played
  // rather than on whatever it opened with an hour ago.
  const asked = seededShuffle([...usable].reverse().slice(0, Math.max(1, maxQuestions)), seed);

  const questions: ListenTestQuestion[] = [];
  asked.forEach((item, index) => {
    const answerKey = matchingVisibleKey(item.en, "en");
    const taken = new Set([answerKey]);
    const distractors: string[] = [];

    const consider = (candidate: ListenItem) => {
      if (distractors.length >= LISTEN_TEST_OPTIONS - 1) return;
      if (candidate.id === item.id) return;
      if (candidate.kind !== item.kind) return;
      const key = matchingVisibleKey(candidate.en, "en");
      if (!key || taken.has(key)) return;
      taken.add(key);
      distractors.push(candidate.en);
    };

    // Same sitting first, then the queue, each walked from a different offset
    // so every question does not draw the same three neighbours.
    const others = seededShuffle(usable, seed + index * 31);
    for (const candidate of others) consider(candidate);
    if (distractors.length < LISTEN_TEST_OPTIONS - 1) {
      for (const candidate of seededShuffle(pool.filter((entry) => entry.kind !== "passage"), seed + index * 17)) consider(candidate);
    }
    // A question with nothing to choose between is not a question.
    if (!distractors.length) return;

    questions.push({
      id: item.id,
      prompt: item.de,
      answer: item.en,
      options: seededShuffle([item.en, ...distractors], seed + index),
      kind: item.kind,
    });
  });

  return questions;
}

export type ListenTestVerdict = { id: string; prompt: string; answer: string; chosen: string };

export function listenTestScore(verdicts: ListenTestVerdict[]): { right: number; total: number } {
  const right = verdicts.filter((verdict) => verdict.chosen === verdict.answer).length;
  return { right, total: verdicts.length };
}
