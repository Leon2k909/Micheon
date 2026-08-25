import { targetLangTag } from "@/lib/direction";
import { courseSides } from "@/lib/courseLanguages";
import { frenchFor } from "@/lib/frenchCourse";
import type { CatalogItem } from "@/session";

/**
 * One multiple-choice question for the practice card.
 *
 * The card used to hold three questions written into the source, cycled with
 * `(index + 1) % 3`, so the fourth question was the first one again. These
 * are built from the same catalogue the lessons
 * are served from, so the supply is the whole course rather than three.
 */
export type PracticeOption = {
  correct: boolean;
  /** The same phrase in the language the learner already has. */
  meaning: string;
  text: string;
};

export type PracticeQuestion = {
  /** BCP-47 tag for reading the answer aloud — the language being learned. */
  answerLangTag: string;
  /** Where the phrase is used, e.g. "Everyday conversation". */
  context: string;
  id: string;
  options: PracticeOption[];
  prompt: string;
  /** Translation key for the prompt's language: "German" or "English". */
  /** The name of the language the prompt is written in, for the chip above it. */
  promptLanguageKey: string;
};

/**
 * Long enough to be a sentence, short enough to fit an answer button.
 *
 * A 140-character phrase wraps to four lines in the answer list and pushes the
 * feedback panel off the card.
 */
const MAX_LENGTH = 78;
const MIN_LENGTH = 4;
const OPTION_COUNT = 4;
/**
 * The line under the prompt is a label, not a lesson.
 *
 * A catalogue `use` field can run to a paragraph — the advent-calendar phrase
 * carries 180 characters about diminutives and who eats the chocolate — and
 * that pushed the answer buttons off the card. Anything longer than a label
 * falls back to the pack name.
 */
const MAX_CONTEXT_LENGTH = 42;

export type PracticeCandidate = {
  /** The language being learned — what the buttons offer. */
  answer: string;
  context: string;
  id: string;
  /** The language the learner already has — what the card asks in. */
  prompt: string;
};

function shortContext(item: CatalogItem): string {
  const use = item.use?.trim();
  if (use && use.length <= MAX_CONTEXT_LENGTH) return use;
  return item.partLabel?.trim() ?? "";
}

/**
 * One phrase per answer.
 *
 * The catalogue stores alternatives inline — "Now I know what you mean. / Now
 * I see what you mean." — which is useful in a lesson and unreadable on a
 * button. The first wording is the one taught first.
 */
function firstWording(text: string): string {
  const [first] = text.split(" / ");
  return (first ?? text).trim();
}

function usable(text: unknown): text is string {
  if (typeof text !== "string") return false;
  const trimmed = text.trim();
  return trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH;
}

/**
 * Turn the catalogue into askable phrases, the right way round.
 *
 * Which side is the question and which side is the answer follows the course:
 * a German speaker learning English is asked in German and picks the English,
 * and an English speaker learning German gets exactly the reverse. The card
 * had this fixed the German-learning way, so a learner going the other way —
 * learning English — was shown the English sentence and asked to pick the
 * German one, which practises the language they already have.
 */
export function practiceCandidates(items: readonly CatalogItem[]): PracticeCandidate[] {
  const sides = courseSides();
  const toEnglish = sides.target.code === "en";
  const toFrench = sides.target.code === "fr";
  const seen = new Set<string>();
  const out: PracticeCandidate[] = [];
  for (const item of items) {
    if (!item || (item.kind !== "phrase" && item.kind !== "dialogue")) continue;
    // The catalogue is German either way round, so the French course looks the
    // answer up. A card the tables do not reach is not askable here.
    const french = toFrench ? frenchFor(item.de ?? "", item.fr) : null;
    if (toFrench && !french) continue;
    const answer = firstWording(french ?? ((toEnglish ? item.en : item.de) ?? ""));
    const prompt = firstWording((sides.meaning.code === "de" ? item.de : item.en) ?? "");
    if (!usable(answer) || !usable(prompt)) continue;
    // Same wording on both sides teaches nothing and reads as a bug.
    if (answer.toLowerCase() === prompt.toLowerCase()) continue;
    const key = answer.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ answer, context: shortContext(item), id: item.id, prompt });
  }
  return out;
}

/**
 * Three wrong answers that are wrong for the right reason.
 *
 * Picked at a similar length to the correct one: a four-word answer among
 * three one-word ones is findable without reading any of them, and a learner
 * who spots that has practised nothing.
 */
function distractorsFor(
  answer: PracticeCandidate,
  pool: readonly PracticeCandidate[],
  random: () => number
): PracticeCandidate[] {
  const taken = new Set([answer.answer.toLowerCase()]);
  const byCloseness = pool
    .filter((candidate) => {
      if (candidate.id === answer.id) return false;
      const text = candidate.answer.toLowerCase();
      if (taken.has(text)) return false;
      return true;
    })
    .map((candidate) => ({
      candidate,
      // Length difference first, then a stable-per-draw shuffle so the same
      // phrase does not always arrive with the same three neighbours.
      score: Math.abs(candidate.answer.length - answer.answer.length) + random() * 12,
    }))
    .sort((a, b) => a.score - b.score);

  const chosen: PracticeCandidate[] = [];
  for (const { candidate } of byCloseness) {
    const text = candidate.answer.toLowerCase();
    if (taken.has(text)) continue;
    taken.add(text);
    chosen.push(candidate);
    if (chosen.length === OPTION_COUNT - 1) break;
  }
  return chosen;
}

export function buildPracticeQuestion(
  answer: PracticeCandidate,
  pool: readonly PracticeCandidate[],
  random: () => number = Math.random
): PracticeQuestion | null {
  const distractors = distractorsFor(answer, pool, random);
  if (distractors.length < OPTION_COUNT - 1) return null;

  const options: PracticeOption[] = [
    { correct: true, meaning: answer.prompt, text: answer.answer },
    ...distractors.map((candidate) => ({
      correct: false,
      meaning: candidate.prompt,
      text: candidate.answer,
    })),
  ];
  // Fisher-Yates: the correct answer must not always be first.
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [options[index], options[swap]] = [options[swap], options[index]];
  }

  return {
    answerLangTag: targetLangTag(),
    context: answer.context,
    id: answer.id,
    options,
    prompt: answer.prompt,
    promptLanguageKey: courseSides().meaning.label,
  };
}
