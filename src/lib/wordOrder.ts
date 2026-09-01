type VisibleWordToken = { text: string };

function sentenceOrderWords(sentence: string): string[] {
  return String(sentence ?? "").trim().split(/\s+/).filter(Boolean);
}

/**
 * Grade the sentence the learner can see, not the hidden identity of a tile.
 *
 * Repeated words create separate draggable tiles, but exchanging two identical
 * tiles must not turn a visibly correct sentence into a wrong answer.
 */
export function wordOrderTokensMatchSentence(
  tokens: readonly VisibleWordToken[],
  sentence: string
): boolean {
  const answer = sentenceOrderWords(sentence);
  return tokens.length > 0
    && tokens.length === answer.length
    && tokens.every((token, index) => token.text === answer[index]);
}
