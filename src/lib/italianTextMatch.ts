/**
 * Grading a typed ITALIAN answer.
 *
 * WHY NOT REUSE THE SPANISH MATCHER. It is the right shape — fold the marks a
 * foreign keyboard cannot reach, keep the letters that are letters — and its
 * pronoun rule is very nearly Italian's. One thing stops it working here, and
 * it is the whole design problem below: Spanish can fold every accent it has,
 * because "cancion" is not a Spanish word and "canción" is. Italian cannot.
 * Half a dozen of the commonest words in the language are an accent apart from
 * another common word, and folding the accent would mark the wrong one right.
 *
 * SO ACCENTS ARE FORGIVEN EVERYWHERE EXCEPT WHERE THE ACCENT IS THE WORD.
 * The general rule is Spanish's: à è é ì ò ù are not on a keyboard bought in
 * Britain or Germany, the learner who types "perche" or "citta" or "caffe"
 * knew the word, and that is a spelling slip with a note, exactly as a missing
 * umlaut is in German. The exception is the short list in ACCENT_PAIRS: the
 * monosyllables where dropping the mark lands on a different, equally common
 * word. "e" is and, "è" is is. "si" is if, "sì" is yes. "da" is from, "dà"
 * gives. Those are not spellings of one word, and a learner writing "lui e
 * stanco" has written something Italian, just not this. Marking it right and
 * saying nothing is the one failure a grader cannot come back from.
 *
 * WHAT ELSE COUNTS AS A SLIP RATHER THAN A MISTAKE: punctuation and case,
 * dropped before anything is compared. Italian capitalises less than German —
 * not months, days, languages or nationalities — which is exactly where a
 * German speaker over-capitalises, so a first letter that disagrees is a
 * keyboard doing its own thing rather than a mistake.
 *
 * WHAT EARNS A NOTE RATHER THAN A PASS: a spare subject pronoun. Italian
 * leaves "io", "tu", "noi" out unless it is stressing them — the ending
 * already says who — so "io vado" for "vado" is grammatical and not what
 * anyone says. The learner produced the language and over-produced the
 * pronoun, which is worth telling them rather than crossing.
 *
 * WHAT IS DELIBERATELY NOT FORGIVEN, AND WHY:
 *   - a doubled consonant. This is the one an English or German speaker gets
 *     wrong most often and the one Italian least tolerates: nonno/nono,
 *     cane/canne, casa/cassa, sete/sette, copia/coppia, pena/penna. The double
 *     is a longer sound, not a spelling convention, and every pair there is
 *     two everyday words;
 *   - the elision apostrophe. "l'ora" and "un'ora" carry it because the vowel
 *     really is gone; "un ora" is not a lighter spelling of "un'ora", it is
 *     the masculine article on a feminine noun;
 *   - gli against li, gn against ni, sc against sh. Each is a sound Italian
 *     spells one way.
 * Accepting either side of any of those would mark a wrong word right and
 * never say so, which is worse than a red cross on a spelling the learner can
 * see is wrong.
 *
 * WHAT ELSE DOES NOT PASS: a wrong gender, a wrong tense, essere for stare, a
 * wrong word. Those are what the lesson is for.
 */

type ItalianMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ`´‘]/g;
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…]/g;
const THIN_SPACES = /[    ]/g;

/**
 * Case-preserving normalisation: the form every tier below compares.
 *
 * The straight apostrophe is NOT in APOSTROPHES and is not stripped here: it
 * is a letter's worth of meaning in Italian, and the curly ones are folded
 * onto it rather than away, so a learner whose keyboard produces ’ is not
 * marked down for it.
 */
function normalizeItalianInput(text: string): string {
  return String(text ?? "")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "'")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The words where the accent is the word, and folding it would be a lie.
 *
 * Every one is a monosyllable, and that is not a coincidence: Italian writes
 * the grave on a final stressed syllable, so on a long word it marks stress
 * that the reader could have guessed, and on a short one it is all that
 * separates two words. The list is closed rather than growing — these are the
 * pairs where both sides are common enough for a learner to mean either.
 */
const ACCENT_PAIRS: Array<[string, string]> = [
  ["è", "e"],   // is / and
  ["sì", "si"], // yes / if, oneself
  ["dà", "da"], // gives / from
  ["né", "ne"], // nor / of it
  ["sé", "se"], // oneself / if
  ["tè", "te"], // tea / you
  ["lì", "li"], // there / them
  ["là", "la"], // there / the
  ["dì", "di"], // day / of
];
const PROTECTED = new Set(ACCENT_PAIRS.flat());

/** Every accent Italian writes, folded onto its bare vowel. */
const ACCENTS: Array<[RegExp, string]> = [
  [/[àá]/g, "a"],
  [/[èé]/g, "e"],
  [/[ìí]/g, "i"],
  [/[òó]/g, "o"],
  [/[ùú]/g, "u"],
];

function foldAccents(word: string): string {
  let value = word;
  for (const [pattern, replacement] of ACCENTS) value = value.replace(pattern, replacement);
  return value;
}

/**
 * Lower case, accents folded — except on the words in ACCENT_PAIRS, which keep
 * theirs so that the two sides of each pair stay two words.
 */
function normalizeItalianLenient(text: string): string {
  return normalizeItalianInput(text)
    .toLocaleLowerCase("it-IT")
    .split(" ")
    .map((word) => (PROTECTED.has(word) ? word : foldAccents(word)))
    .join(" ");
}

/** Lower case only, accents intact — separates a capital slip from an accent slip. */
function lowerItalian(text: string): string {
  return normalizeItalianInput(text).toLocaleLowerCase("it-IT");
}

/**
 * Subject pronouns Italian leaves out unless it is stressing them.
 *
 * "lei" is not on the list, and for the same reason "usted" is missing from
 * the Spanish one: written with a capital it is the polite you, said in full
 * every time, and by the point this runs the text is lower case and the two
 * are indistinguishable. Dropping it would change the register rather than
 * tidy the sentence.
 */
const REDUNDANT_SUBJECT = /^(io|tu|lui|noi|voi|loro|egli|ella|essi|esse)\s+/;

/** One comparison, so the tiers differ only in what they fold. */
function compare(input: string, target: string): ItalianMatch | null {
  const strictInput = normalizeItalianInput(input);
  const strictTarget = normalizeItalianInput(target);
  if (!strictInput) return null;
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerItalian(input) === lowerItalian(target)) {
    // Same letters, different capitals. Cards are written as fragments ("il
    // cane") as often as as sentences, so a difference in the FIRST letter is
    // what a keyboard does on its own rather than a mistake.
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  if (normalizeItalianLenient(input) === normalizeItalianLenient(target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchItalianPhrase(input: string, target: string): ItalianMatch {
  // "A / B" answer keys offer alternatives — either side is a right answer.
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((part) => part.trim()).filter(Boolean)) {
      const alternative = matchItalianPhrase(input, segment);
      if (alternative.ok) return alternative;
    }
  }

  const direct = compare(input, target);
  if (direct?.ok) return direct;
  // The pronoun fold below runs on lower-cased text and is blind to capitals,
  // so a capitalisation note has to be returned before it gets a chance to
  // turn one into something else.
  if (direct?.capitalizationError) return direct;

  const lenientInput = normalizeItalianLenient(input);
  const lenientTarget = normalizeItalianLenient(target);
  const withoutSubject = lenientInput.replace(REDUNDANT_SUBJECT, "");
  if (withoutSubject !== lenientInput && withoutSubject === lenientTarget) {
    return { ok: false, spellingNote: false, phrasingNote: true };
  }

  return direct ?? { ok: false, spellingNote: false };
}

/** Sentences and phrases go through the same tiers — one entry point, two names. */
export const matchItalianSentence = matchItalianPhrase;

/**
 * A vocabulary card names several equally right senses ("la casa, l'abitazione").
 * They are choices, not a phrase to reproduce in full.
 */
function italianMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+o\s+|\s+oppure\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function matchItalianMeaning(input: string, target: string): ItalianMatch {
  const whole = matchItalianPhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of italianMeaningAlternatives(target)) {
    const result = matchItalianPhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}

/**
 * The letters an English, German or French keyboard cannot reach.
 *
 * è leads because it is the one the matcher does not forgive — it is the verb
 * "is", and "e" is "and". The rest pass with a spelling note if they are
 * missed, and are here so they can be typed rather than guessed at. é is
 * separate from è because Italian writes both and means different sounds by
 * them: "perché" takes the acute, "caffè" the grave.
 */
export const ITALIAN_SPECIAL_CHARACTERS = [
  "è", "é", "à", "ì", "ò", "ù", "«", "»",
  "È", "É", "À", "Ì", "Ò", "Ù",
];
