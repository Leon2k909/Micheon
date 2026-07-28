import { normalizeGermanLenient } from "./germanTextMatch";

/**
 * Remove sentence punctuation while keeping punctuation that belongs inside a
 * word. In particular, EU-Recht must stay hyphenated, E-Mail/T-Shirt must keep
 * their separators and gibt's must keep its apostrophe until the shared answer
 * normaliser compares it.
 */
export function spokenWord(token: string): string {
  return String(token ?? "")
    .replace(/^[^\p{L}\p{N}]+/gu, "")
    .replace(/[^\p{L}\p{N}]+$/gu, "");
}

export type GapPrompt = {
  display: string;
  words: string[];
};

/**
 * Blank one or two useful words while preserving how those words are really
 * written. Ranking ignores an internal hyphen/apostrophe, but the learner-facing
 * answer does not: "EU-Recht" must never be displayed as the invalid "EURecht".
 */
export function computeGap(sentence: string): GapPrompt {
  const tokens = String(sentence ?? "").trim().split(/\s+/).filter(Boolean);
  const ranked = tokens
    .map((token, index) => ({
      index,
      answer: spokenWord(token),
      letterCount: spokenWord(token).replace(/[^\p{L}\p{N}]/gu, "").length,
    }))
    .filter(({ answer, letterCount }) => answer.length > 0 && letterCount >= 3)
    .sort((a, b) => b.letterCount - a.letterCount);
  const howMany = tokens.length >= 6 ? 2 : 1;
  const blanks = new Set(ranked.slice(0, howMany).map(({ index }) => index));
  if (blanks.size === 0 && tokens.length) blanks.add(0);

  return {
    words: tokens.filter((_, index) => blanks.has(index)).map(spokenWord),
    display: tokens.map((token, index) => (blanks.has(index) ? "____" : token)).join(" "),
  };
}

/** Missing words may be supplied in either order, matching the existing UI. */
export function matchesGapInput(input: string, words: string[]): boolean {
  const typedTokens = normalizeGermanLenient(input).split(" ").filter(Boolean);
  const expectedSequences = words
    .map((word) => normalizeGermanLenient(word).split(" ").filter(Boolean))
    .sort((a, b) => b.length - a.length);
  if (expectedSequences.length === 0 || expectedSequences.some((tokens) => tokens.length === 0)) return false;

  // A token occurrence can satisfy only one blank. The tiny backtracking search
  // matters when both blanks contain the same word or when one expected answer
  // is also part of a hyphenated, multi-token answer.
  const placeSequence = (sequenceIndex: number, used: Set<number>): boolean => {
    if (sequenceIndex >= expectedSequences.length) return true;
    const expected = expectedSequences[sequenceIndex];
    for (let start = 0; start <= typedTokens.length - expected.length; start += 1) {
      const positions = expected.map((_, offset) => start + offset);
      if (positions.some((position) => used.has(position))) continue;
      if (!expected.every((token, offset) => typedTokens[start + offset] === token)) continue;
      const nextUsed = new Set(used);
      positions.forEach((position) => nextUsed.add(position));
      if (placeSequence(sequenceIndex + 1, nextUsed)) return true;
    }
    return false;
  };

  return placeSequence(0, new Set());
}
