/**
 * What two sentences have to share to count as "similar".
 *
 * The learner's own example was every sentence that starts "Ich möchte", and
 * that is the right grain: German sentences that open the same way are the
 * same shape — "Ich möchte einen Kaffee", "Ich möchte bezahlen", "Ich möchte
 * nach Hause" drill one pattern with three endings, which is how a phrase
 * becomes a thing you can produce rather than three things you recognised.
 *
 * So the pattern is the first two words, lowercased, with punctuation gone.
 * Not one word: "ich" opens a third of the course and groups nothing. Not
 * three: "ich möchte einen" and "ich möchte bezahlen" are the same pattern to
 * anybody learning it. A single-word card is its own pattern — a word has no
 * shape to share — and sorts as a group of one.
 */
export function sentencePattern(text: unknown): string {
  const words = String(text ?? "")
    .toLocaleLowerCase("de-DE")
    .replace(/[^\p{L}\p{N}\s'’-]/gu, " ")
    .split(/\s+/u)
    .filter(Boolean);
  return words.slice(0, 2).join(" ");
}

/** True when two cards open the same way and neither is a single word. */
export function sharesPattern(a: unknown, b: unknown): boolean {
  const left = sentencePattern(a);
  return Boolean(left) && left.includes(" ") && left === sentencePattern(b);
}
