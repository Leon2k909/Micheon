/**
 * Grading a typed GREEK answer.
 *
 * Greek is the second course in an alphabet of its own, and it inherits the
 * question Russian had to answer first: what does a learner type WITH? Every
 * other course asks for a handful of letters a foreign keyboard cannot reach.
 * Greek asks for all of them. So three things count as a slip rather than a
 * mistake, each passing with a spelling note instead of a red answer:
 *
 *   - A MISSING ACCENT. Monotonic Greek writes one tonos per word, and a
 *     learner who types καλημερα has the word; the note shows καλημέρα. The
 *     diaeresis (ϊ, ϋ) is folded the same way.
 *   - A σ AT THE END OF A WORD. Final sigma is spelling, not vocabulary, and
 *     on the on-screen row it is one key away.
 *   - THE LATIN ALPHABET. A learner without a Greek keyboard types what Greeks
 *     themselves type on one: Greeklish — kalimera, efxaristo, 8elw. That is
 *     the word, written in the letters the keyboard has, so it is graded as
 *     the word. What it cannot be is a DIFFERENT word, which is why the
 *     comparison below walks the target letter by letter and only lets each
 *     Greek letter be written the ways Greeks actually write it in Latin.
 *
 * Case works the way it does in the other courses: a sentence may start in
 * lower case, but a name in the middle written small is a capitalisation
 * error, because in Greek as in German that is a real rule.
 */
export type GreekMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘]/g;
// The Greek question mark is a semicolon, and the ano teleia is a raised dot;
// both are punctuation here, never part of a word.
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…··;]/g;
const THIN_SPACES = /[    ]/g;

function normalizeGreekInput(text: string): string {
  return String(text ?? "")
    .normalize("NFC")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lowerGreek(text: string): string {
  return normalizeGreekInput(text).toLocaleLowerCase("el-GR");
}

/** Without accents, diaeresis or the final-sigma distinction. */
function lenientGreek(text: string): string {
  return lowerGreek(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ς/g, "σ");
}

const HAS_GREEK = /[Ͱ-Ͽ]/;
const HAS_LATIN = /[a-z]/i;

/**
 * How each Greek letter may be written in Latin letters.
 *
 * Greeklish has no standard, so this lists what people actually type: the
 * ELOT transliteration, the phonetic spelling, and the keyboard-shape habits
 * (8 for θ, 3 for ξ, w for ω). Pairs come first because they are one sound:
 * ου is u, αι is e, μπ is b. The single-letter spellings stay available too,
 * so ou and oy are accepted alongside u.
 */
const GREEKLISH_PAIRS: Record<string, string[]> = {
  "ου": ["ou", "oy", "u"],
  "αι": ["ai", "ae", "e"],
  "ει": ["ei", "ey", "i"],
  "οι": ["oi", "oy", "i"],
  "υι": ["yi", "ui", "i"],
  "αυ": ["au", "av", "af", "ay"],
  "ευ": ["eu", "ev", "ef", "ey"],
  "μπ": ["mp", "b"],
  "ντ": ["nt", "d"],
  "γκ": ["gk", "gg", "g", "nk"],
  "γγ": ["gg", "ng"],
  "τσ": ["ts"],
  "τζ": ["tz", "dz"],
};

const GREEKLISH_LETTERS: Record<string, string[]> = {
  "α": ["a"],
  "β": ["v", "b"],
  "γ": ["g", "gh", "y"],
  "δ": ["d", "dh"],
  "ε": ["e"],
  "ζ": ["z"],
  "η": ["i", "h", "e"],
  "θ": ["th", "8", "u"],
  "ι": ["i", "j"],
  "κ": ["k", "c"],
  "λ": ["l"],
  "μ": ["m"],
  "ν": ["n"],
  "ξ": ["x", "ks", "3", "cs"],
  "ο": ["o"],
  "π": ["p"],
  "ρ": ["r"],
  "σ": ["s", "c"],
  "τ": ["t"],
  "υ": ["y", "i", "u", "v"],
  "φ": ["f", "ph"],
  "χ": ["x", "ch", "h", "kh"],
  "ψ": ["ps", "4"],
  "ω": ["o", "w"],
};

/**
 * Does a Latin answer spell the Greek target, letter by letter?
 *
 * A walk over both strings at once: at each Greek position, try every way
 * the pair or the single letter may be written, and continue from wherever
 * that leaves the Latin. Memoised, so a sentence is a few thousand steps.
 */
function matchesGreeklish(input: string, target: string): boolean {
  const latin = normalizeGreekInput(input)
    .toLocaleLowerCase("en-GB")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const greek = lenientGreek(target);
  if (!latin || !greek) return false;
  if (HAS_GREEK.test(latin)) return false;

  const seen = new Map<number, boolean>();
  const walk = (i: number, j: number): boolean => {
    if (j === greek.length) return i === latin.length;
    const key = i * 4096 + j;
    const cached = seen.get(key);
    if (cached !== undefined) return cached;
    let result = false;
    const here = greek[j];
    if (here === " ") {
      // a space may be typed or left out between words
      result = (latin[i] === " " && walk(i + 1, j + 1)) || walk(i, j + 1);
    } else if (!HAS_GREEK.test(here)) {
      // digits and letters the target already carries in Latin
      result = latin[i] === here && walk(i + 1, j + 1);
    } else {
      const pair = greek.slice(j, j + 2);
      for (const spelling of GREEKLISH_PAIRS[pair] ?? []) {
        if (latin.startsWith(spelling, i) && walk(i + spelling.length, j + 2)) { result = true; break; }
      }
      if (!result) {
        for (const spelling of GREEKLISH_LETTERS[here] ?? []) {
          if (latin.startsWith(spelling, i) && walk(i + spelling.length, j + 1)) { result = true; break; }
        }
      }
    }
    seen.set(key, result);
    return result;
  };
  return walk(0, 0);
}

function compare(input: string, target: string): GreekMatch | null {
  const strictInput = normalizeGreekInput(input);
  const strictTarget = normalizeGreekInput(target);
  if (!strictInput) return null;
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerGreek(input) === lowerGreek(target)) {
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  if (lenientGreek(input) === lenientGreek(target)) {
    return { ok: true, spellingNote: true };
  }

  if (HAS_LATIN.test(strictInput) && !HAS_GREEK.test(strictInput) && matchesGreeklish(input, target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchGreekPhrase(input: string, target: string): GreekMatch {
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((part) => part.trim()).filter(Boolean)) {
      const result = matchGreekPhrase(input, segment);
      if (result.ok) return result;
    }
  }
  return compare(input, target) ?? { ok: false, spellingNote: false };
}

/** Sentences and phrases go through the same comparison — one entry, two names. */
export const matchGreekSentence = matchGreekPhrase;

function greekMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+ή\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function matchGreekMeaning(input: string, target: string): GreekMatch {
  const whole = matchGreekPhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of greekMeaningAlternatives(target)) {
    const result = matchGreekPhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}

/**
 * The Greek row under the answer box.
 *
 * Like the Russian one, it is not a helper beside the keyboard — it IS the
 * keyboard for anyone without a Greek layout. The accented vowels come first
 * because every word of two syllables carries one, then the alphabet in
 * order with final ς beside σ, then the capitals: Greek capitalises names
 * mid-sentence, and Αθήνα cannot be typed without Α.
 */
export const GREEK_SPECIAL_CHARACTERS = [
  "ά", "έ", "ή", "ί", "ό", "ύ", "ώ", "ϊ", "ϋ", "ΐ", "ΰ",
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ",
  "ν", "ξ", "ο", "π", "ρ", "σ", "ς", "τ", "υ", "φ", "χ", "ψ", "ω",
  "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ",
  "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω",
  "Ά", "Έ", "Ή", "Ί", "Ό", "Ύ", "Ώ",
];
