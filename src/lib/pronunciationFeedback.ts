export type PronunciationSegment = {
  text: string;
  status: "good" | "needs-work" | "neutral" | "unclear";
};

export type PronunciationFeedback = {
  segments: PronunciationSegment[];
  matchedLetters: number;
  totalLetters: number;
  score: number;
  /** Words the model got, but only just. Empty when no confidence was given. */
  unclearWords: string[];
};

/** One piece of whisper's output, with how sure it was of that piece. */
export type HeardToken = { text: string; probability: number | null };

/**
 * Below this, a word was not really recognised — it was guessed at.
 *
 * Chosen from measurement rather than taste. Six sentences were synthesised
 * twice: once by a German voice, once by an English voice reading the same
 * German text, which is what a beginner actually sounds like. Then the
 * lowest-confidence word in each clip:
 *
 *   native German   0.539  0.942  0.929  0.825  0.860  0.843
 *   English speaker 0.107  0.239  0.297  0.258  0.256  0.137
 *
 * Every threshold from 0.35 to 0.50 flags nothing in the native clips and
 * something in all six of the others. 0.45 is taken rather than 0.50 because
 * both catch exactly the same fourteen words while 0.45 leaves twice the margin
 * to the worst native word — and a real person is messier than a speech
 * synthesiser, so the margin is the part that has to survive contact.
 */
export const UNCLEAR_BELOW = 0.45;

type WordToken = {
  display: string;
  normalized: string;
  partIndex: number;
  /** null when the recogniser gave no confidence, e.g. the browser fallback. */
  confidence?: number | null;
};

function normalizedWord(value: string): string {
  return value.toLocaleLowerCase("de-DE").replace(/ß/g, "ss").replace(/[’']/g, "");
}

function displayParts(value: string): string[] {
  return value.match(/[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)?|\s+|[^\p{L}\p{N}\s]+/gu) ?? [];
}

/**
 * The words whisper heard, each carrying how sure it was.
 *
 * Whisper emits sub-word pieces and starts every new word with a leading
 * space, so the pieces regroup exactly. A word takes the LOWEST confidence of
 * its pieces: "Harbenerls" arrived as Har/ben/er/ls at 0.54/0.67/0.14/0.74, and
 * the 0.14 is the whole point — averaging it away would hide the syllable that
 * did not land.
 *
 * Fragmentation is itself a signal, incidentally. Clear German comes back as
 * whole words ("glaube", "brauchen"); a guessed accent comes back in pieces.
 */
export function heardWordsWithConfidence(tokens: HeardToken[]): Array<{ text: string; confidence: number | null }> {
  const grouped: Array<{ text: string; probabilities: number[] }> = [];
  for (const token of tokens) {
    const text = String(token?.text ?? "");
    if (!text) continue;
    const probability = typeof token?.probability === "number" ? token.probability : null;
    if (/^\s/.test(text) || grouped.length === 0) {
      grouped.push({ text: text.trim(), probabilities: probability === null ? [] : [probability] });
    } else {
      const current = grouped[grouped.length - 1];
      current.text += text;
      if (probability !== null) current.probabilities.push(probability);
    }
  }
  return grouped
    .filter((word) => /[\p{L}\p{N}]/u.test(word.text))
    .map((word) => ({
      text: word.text,
      confidence: word.probabilities.length ? Math.min(...word.probabilities) : null,
    }));
}

function wordTokens(parts: string[]): WordToken[] {
  const words: WordToken[] = [];
  parts.forEach((part, partIndex) => {
    if (!/[\p{L}\p{N}]/u.test(part)) return;
    words.push({ display: part, normalized: normalizedWord(part), partIndex });
  });
  return words;
}

function alignWords(expected: WordToken[], heard: WordToken[]): Array<number | null> {
  const rows = expected.length + 1;
  const columns = heard.length + 1;
  const costs = Array.from({ length: rows }, () => Array<number>(columns).fill(0));
  const moves = Array.from({ length: rows }, () => Array<"match" | "replace" | "delete" | "insert">(columns).fill("match"));
  for (let row = 1; row < rows; row += 1) { costs[row][0] = row; moves[row][0] = "delete"; }
  for (let column = 1; column < columns; column += 1) { costs[0][column] = column; moves[0][column] = "insert"; }
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const same = expected[row - 1].normalized === heard[column - 1].normalized;
      const replace = costs[row - 1][column - 1] + (same ? 0 : 1);
      const remove = costs[row - 1][column] + 1;
      const insert = costs[row][column - 1] + 1;
      const best = Math.min(replace, remove, insert);
      costs[row][column] = best;
      moves[row][column] = best === replace ? (same ? "match" : "replace") : best === remove ? "delete" : "insert";
    }
  }
  const aligned = Array<number | null>(expected.length).fill(null);
  let row = expected.length;
  let column = heard.length;
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if ((move === "match" || move === "replace") && row > 0 && column > 0) {
      aligned[row - 1] = column - 1;
      row -= 1;
      column -= 1;
    } else if (move === "delete" && row > 0) {
      row -= 1;
    } else if (column > 0) {
      column -= 1;
    } else {
      row -= 1;
    }
  }
  return aligned;
}

function alignLetters(expected: string, heard: string): boolean[] {
  const expectedLetters = Array.from(expected);
  const heardLetters = Array.from(heard);
  const rows = expectedLetters.length + 1;
  const columns = heardLetters.length + 1;
  const costs = Array.from({ length: rows }, () => Array<number>(columns).fill(0));
  const moves = Array.from({ length: rows }, () => Array<"match" | "replace" | "delete" | "insert">(columns).fill("match"));
  for (let row = 1; row < rows; row += 1) { costs[row][0] = row; moves[row][0] = "delete"; }
  for (let column = 1; column < columns; column += 1) { costs[0][column] = column; moves[0][column] = "insert"; }
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const same = normalizedWord(expectedLetters[row - 1]) === normalizedWord(heardLetters[column - 1]);
      const replace = costs[row - 1][column - 1] + (same ? 0 : 1);
      const remove = costs[row - 1][column] + 1;
      const insert = costs[row][column - 1] + 1;
      const best = Math.min(replace, remove, insert);
      costs[row][column] = best;
      moves[row][column] = best === replace ? (same ? "match" : "replace") : best === remove ? "delete" : "insert";
    }
  }
  const good = Array<boolean>(expectedLetters.length).fill(false);
  let row = expectedLetters.length;
  let column = heardLetters.length;
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if ((move === "match" || move === "replace") && row > 0 && column > 0) {
      good[row - 1] = move === "match";
      row -= 1;
      column -= 1;
    } else if (move === "delete" && row > 0) {
      row -= 1;
    } else if (column > 0) {
      column -= 1;
    } else {
      row -= 1;
    }
  }
  return good;
}

function pushSegment(segments: PronunciationSegment[], next: PronunciationSegment) {
  const previous = segments[segments.length - 1];
  if (previous?.status === next.status) previous.text += next.text;
  else segments.push(next);
}

/**
 * How much of the sentence came through, and which parts only just did.
 *
 * Matching the text alone is not enough, and the reason is the whole problem
 * with using whisper for this: it is a language model, so it REPAIRS a speaker.
 * "Das Wetter ist heute wirklich schön" read in an English accent came back as
 * near-perfect text — 97% by letters — while the model was 0.26 sure of
 * "heute" and 0.35 sure of "wirklich". The words it printed were right. It had
 * barely heard them.
 *
 * So a word only counts as clear if the text matches AND the model was sure. A
 * word it guessed at scores half, because "recognised, but only just" is
 * genuinely between right and wrong, and is exactly the part worth saying
 * again.
 */
export function buildPronunciationFeedback(
  expectedText: string,
  heardText: string,
  heardTokens: HeardToken[] = []
): PronunciationFeedback {
  const parts = displayParts(expectedText);
  const expectedWords = wordTokens(parts);
  const confident = heardWordsWithConfidence(heardTokens);
  const heardWords = wordTokens(displayParts(heardText));
  // The tokens and the transcript are the same words, so they line up by
  // position. If a recogniser ever disagrees with itself, confidence is simply
  // dropped rather than attached to the wrong word.
  if (confident.length === heardWords.length) {
    heardWords.forEach((word, index) => { word.confidence = confident[index].confidence; });
  }
  const aligned = alignWords(expectedWords, heardWords);
  const wordByPart = new Map(expectedWords.map((word, index) => [word.partIndex, index]));
  const segments: PronunciationSegment[] = [];
  const unclearWords: string[] = [];
  let matchedLetters = 0;
  let totalLetters = 0;

  parts.forEach((part, partIndex) => {
    const expectedWordIndex = wordByPart.get(partIndex);
    if (expectedWordIndex === undefined) {
      pushSegment(segments, { text: part, status: "neutral" });
      return;
    }
    const heardWordIndex = aligned[expectedWordIndex];
    const expectedWord = expectedWords[expectedWordIndex];
    const heardWord = heardWordIndex === null ? null : heardWords[heardWordIndex];
    const letters = Array.from(expectedWord.display);
    totalLetters += letters.length;
    if (heardWord && expectedWord.normalized === heardWord.normalized) {
      const guessed = typeof heardWord.confidence === "number" && heardWord.confidence < UNCLEAR_BELOW;
      if (guessed) {
        unclearWords.push(expectedWord.display);
        matchedLetters += letters.length / 2;
        pushSegment(segments, { text: expectedWord.display, status: "unclear" });
        return;
      }
      matchedLetters += letters.length;
      pushSegment(segments, { text: expectedWord.display, status: "good" });
      return;
    }
    // Letter-by-letter credit assumes a near miss: "schön" heard as "schon" is
    // four fifths right and should read that way. But when the recogniser was
    // ALSO unsure, it was not a near miss, it was a guess — "wie viel" came
    // back as "we will" at 0.42 and 0.14, and sharing letters with the right
    // answer earned it 90%. A guess earns nothing.
    const guessedWrong = heardWord
      && typeof heardWord.confidence === "number"
      && heardWord.confidence < UNCLEAR_BELOW;
    const goodLetters = heardWord && !guessedWrong
      ? alignLetters(expectedWord.display, heardWord.display)
      : letters.map(() => false);
    letters.forEach((letter, index) => {
      const good = goodLetters[index] === true;
      if (good) matchedLetters += 1;
      pushSegment(segments, { text: letter, status: good ? "good" : "needs-work" });
    });
  });

  return {
    matchedLetters,
    segments,
    totalLetters,
    unclearWords,
    score: totalLetters > 0 ? matchedLetters / totalLetters : 0,
  };
}
