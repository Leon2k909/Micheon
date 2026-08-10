export type PronunciationSegment = {
  text: string;
  status: "good" | "needs-work" | "neutral";
};

export type PronunciationFeedback = {
  segments: PronunciationSegment[];
  matchedLetters: number;
  totalLetters: number;
  score: number;
};

type WordToken = { display: string; normalized: string; partIndex: number };

function normalizedWord(value: string): string {
  return value.toLocaleLowerCase("de-DE").replace(/ß/g, "ss").replace(/[’']/g, "");
}

function displayParts(value: string): string[] {
  return value.match(/[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)?|\s+|[^\p{L}\p{N}\s]+/gu) ?? [];
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

export function buildPronunciationFeedback(expectedText: string, heardText: string): PronunciationFeedback {
  const parts = displayParts(expectedText);
  const expectedWords = wordTokens(parts);
  const heardWords = wordTokens(displayParts(heardText));
  const aligned = alignWords(expectedWords, heardWords);
  const wordByPart = new Map(expectedWords.map((word, index) => [word.partIndex, index]));
  const segments: PronunciationSegment[] = [];
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
      matchedLetters += letters.length;
      pushSegment(segments, { text: expectedWord.display, status: "good" });
      return;
    }
    const goodLetters = heardWord ? alignLetters(expectedWord.display, heardWord.display) : letters.map(() => false);
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
    score: totalLetters > 0 ? matchedLetters / totalLetters : 0,
  };
}
