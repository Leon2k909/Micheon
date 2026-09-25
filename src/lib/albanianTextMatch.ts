/**
 * Grading a typed ALBANIAN answer.
 *
 * Albanian is written in the Latin alphabet plus two letters of its own, ë
 * and ç, and those two are exactly what Albanians themselves leave out when
 * the keyboard does not offer them: eshte for është, cfare for çfarë. A
 * learner who types that has the word, so it passes with a spelling note
 * that shows the proper spelling, the way a missing accent does in the
 * Portuguese course. What it cannot be is a DIFFERENT word, and it never is:
 * only the two marks are folded, never a letter.
 *
 * Contractions (ç'kemi, s'kam, t'i) are written with an apostrophe that a
 * phone keyboard may curl or drop; it is ignored either way.
 *
 * Case works the way it does in the other courses: a sentence may start in
 * lower case, but a name in the middle written small is a capitalisation
 * error.
 */
type AlbanianMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘]/g;
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…]/g;
const THIN_SPACES = /[    ]/g;

function normalizeAlbanianInput(text: string): string {
  return String(text ?? "")
    .normalize("NFC")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lowerAlbanian(text: string): string {
  return normalizeAlbanianInput(text).toLocaleLowerCase("sq-AL");
}

/** ë read as e and ç as c: the two marks a foreign keyboard cannot reach. */
function lenientAlbanian(text: string): string {
  return lowerAlbanian(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function compare(input: string, target: string): AlbanianMatch | null {
  const strictInput = normalizeAlbanianInput(input);
  const strictTarget = normalizeAlbanianInput(target);
  if (!strictInput) return null;
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerAlbanian(input) === lowerAlbanian(target)) {
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  if (lenientAlbanian(input) === lenientAlbanian(target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchAlbanianPhrase(input: string, target: string): AlbanianMatch {
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((part) => part.trim()).filter(Boolean)) {
      const result = matchAlbanianPhrase(input, segment);
      if (result.ok) return result;
    }
  }
  return compare(input, target) ?? { ok: false, spellingNote: false };
}

/** Sentences and phrases go through the same comparison — one entry, two names. */
export const matchAlbanianSentence = matchAlbanianPhrase;

function albanianMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+(?:ose|apo)\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function matchAlbanianMeaning(input: string, target: string): AlbanianMatch {
  const whole = matchAlbanianPhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of albanianMeaningAlternatives(target)) {
    const result = matchAlbanianPhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}

/** The two letters Albanian adds to the alphabet, small and capital. */
export const ALBANIAN_SPECIAL_CHARACTERS = ["ë", "ç", "Ë", "Ç"];
