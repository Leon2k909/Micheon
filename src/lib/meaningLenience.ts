/**
 * How strictly to mark the language the learner is NOT learning.
 *
 * A lesson asks for two different things and marks them with one standard. The
 * target side is the answer: spelling is part of knowing the word, and a
 * missed umlaut or a wrong article is exactly what a lesson exists to catch.
 * The meaning side is only there to show the sentence was understood, and it
 * is typed in a language the learner already has. Judging a slip there as a
 * failed recall marks something the lesson never set out to teach.
 *
 * Forgiving is the default because that is the honest reading of what the
 * meaning box is for, and because the cost of the two mistakes is not
 * symmetric: wrongly accepting a typo teaches nothing bad, while wrongly
 * rejecting one interrupts a lesson to argue about a language the learner is
 * not being tested on. Strict stays available for anyone learning both
 * directions who wants both marked the same way.
 */
export type MeaningLenience = "forgiving" | "strict";

const KEY = "gl-meaning-lenience-v1";

export const DEFAULT_MEANING_LENIENCE: MeaningLenience = "forgiving";

export function getMeaningLenience(): MeaningLenience {
  try {
    const value = window.localStorage.getItem(KEY);
    if (value === "strict" || value === "forgiving") return value;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_MEANING_LENIENCE;
}

export function setMeaningLenience(value: MeaningLenience): MeaningLenience {
  const next = value === "strict" ? "strict" : "forgiving";
  try {
    window.localStorage.setItem(KEY, next);
  } catch { /* keep lessons usable */ }
  return next;
}
