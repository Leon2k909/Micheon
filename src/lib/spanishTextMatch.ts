/**
 * Grading a typed SPANISH answer.
 *
 * WHY NOT REUSE THE FRENCH OR POLISH MATCHER. The French one strips every
 * combining mark, which is right for French and wrong here: it would reach ñ
 * and fold it to n, and "año" and "ano" are a real pair a learner would very
 * much like to be told apart. The Polish one is the right SHAPE — fold the
 * marks a foreign keyboard cannot reach, keep the letters that are letters —
 * but its fold list is Polish and its pronoun list is Polish. Spanish gets its
 * own comparator for the same reason Polish did.
 *
 * WHAT COUNTS AS A SLIP RATHER THAN A MISTAKE:
 *   - a missing accent on a vowel (á é í ó ú ü) — spelling, so it passes with
 *     a note, exactly as a missing umlaut does in German. None of them is on a
 *     keyboard bought in Britain or Germany, and the learner who types
 *     "cancion" knew the word. It is worth saying that "él" and "el" are
 *     different words, which is what the note is for;
 *   - the opening ¿ and ¡, which are punctuation and dropped on both sides;
 *   - punctuation and case generally, dropped before anything is compared.
 *
 * WHAT EARNS A NOTE RATHER THAN A PASS: a spare subject pronoun. Spanish
 * leaves "yo", "tú", "él" out unless it is stressing them — the ending already
 * says who — so "yo voy" for "voy" is grammatical and not what anyone says.
 * The learner produced the language and over-produced the pronoun, which is
 * worth telling them rather than crossing.
 *
 * WHAT IS DELIBERATELY NOT FORGIVEN, AND WHY. Spanish spells several sounds
 * more than one way, and folding them looked like the obvious kindness:
 *   - ñ is not n. It is its own letter with its own place in the alphabet, and
 *     "año"/"ano" and "campaña"/"campana" are everyday pairs. It is on the
 *     character bar instead, so it can be typed rather than guessed at;
 *   - b and v sound identical to nearly every speaker, and "bello"/"vello" and
 *     "baca"/"vaca" are still two words each;
 *   - ll and y merge for most of the Spanish-speaking world, and "halla" and
 *     "haya" remain different verbs;
 *   - c, s and z merge across all of Latin America, and "casa"/"caza" and
 *     "cocer"/"coser" remain different words;
 *   - h is silent and "hola"/"ola" and "hecho"/"echo" are both real.
 * Accepting either side of any of those would mark a wrong word right and
 * never say so, which is worse than a red cross on a spelling the learner can
 * see is wrong.
 *
 * WHAT ELSE DOES NOT PASS: a wrong gender, a wrong tense, ser for estar, a
 * wrong word. Those are what the lesson is for.
 */

type SpanishMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘]/g;
const PUNCTUATION = /[.!?¡¿,;:"()\[\]{}“”„«»…]/g;
const THIN_SPACES = /[    ]/g;

/** Case-preserving normalisation: the form every tier below compares. */
function normalizeSpanishInput(text: string): string {
  return String(text ?? "")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The accents folded away.
 *
 * Written as an explicit pair list rather than an NFKD decomposition for one
 * reason: decomposition would take ñ with it. ñ is absent from this list on
 * purpose and stays a letter of its own — see the note at the top.
 */
const ACCENTS: Array<[RegExp, string]> = [
  [/á/g, "a"],
  [/é/g, "e"],
  [/í/g, "i"],
  [/ó/g, "o"],
  [/ú/g, "u"],
  [/ü/g, "u"],
];

function normalizeSpanishLenient(text: string): string {
  let value = normalizeSpanishInput(text).toLocaleLowerCase("es-ES");
  for (const [pattern, replacement] of ACCENTS) value = value.replace(pattern, replacement);
  return value;
}

/** Lower case only, accents intact — separates a capital slip from an accent slip. */
function lowerSpanish(text: string): string {
  return normalizeSpanishInput(text).toLocaleLowerCase("es-ES");
}

/**
 * Subject pronouns Spanish leaves out unless it is stressing them.
 *
 * "usted" and "ustedes" are not on the list: they are the polite forms and are
 * routinely said, so dropping one changes the register rather than tidying the
 * sentence.
 */
const REDUNDANT_SUBJECT = /^(yo|tu|el|ella|nosotros|nosotras|vosotros|vosotras|ellos|ellas)\s+/;

/** One comparison, so the tiers differ only in what they fold. */
function compare(input: string, target: string): SpanishMatch | null {
  const strictInput = normalizeSpanishInput(input);
  const strictTarget = normalizeSpanishInput(target);
  if (!strictInput) return null;
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerSpanish(input) === lowerSpanish(target)) {
    // Same letters, different capitals. Spanish capitalises the start of a
    // sentence and proper nouns and nothing else — not months, days,
    // languages or nationalities, which is where a German or English speaker
    // over-capitalises — and cards are written as fragments ("el perro") as
    // often as as sentences, so a difference in the FIRST letter is what a
    // keyboard does on its own rather than a mistake.
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  if (normalizeSpanishLenient(input) === normalizeSpanishLenient(target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchSpanishPhrase(input: string, target: string): SpanishMatch {
  // "A / B" answer keys offer alternatives — either side is a right answer.
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((part) => part.trim()).filter(Boolean)) {
      const alternative = matchSpanishPhrase(input, segment);
      if (alternative.ok) return alternative;
    }
  }

  const direct = compare(input, target);
  if (direct?.ok) return direct;
  // The pronoun fold below runs on lower-cased, accent-stripped text and is
  // blind to capitals, so a capitalisation note has to be returned before it
  // gets a chance to turn one into something else.
  if (direct?.capitalizationError) return direct;

  const lenientInput = normalizeSpanishLenient(input);
  const lenientTarget = normalizeSpanishLenient(target);
  const withoutSubject = lenientInput.replace(REDUNDANT_SUBJECT, "");
  if (withoutSubject !== lenientInput && withoutSubject === lenientTarget) {
    return { ok: false, spellingNote: false, phrasingNote: true };
  }

  return direct ?? { ok: false, spellingNote: false };
}

/** Sentences and phrases go through the same tiers — one entry point, two names. */
export const matchSpanishSentence = matchSpanishPhrase;

/**
 * A vocabulary card names several equally right senses ("la casa, el hogar").
 * They are choices, not a phrase to reproduce in full.
 */
function spanishMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+o\s+|\s+u\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function matchSpanishMeaning(input: string, target: string): SpanishMatch {
  const whole = matchSpanishPhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of spanishMeaningAlternatives(target)) {
    const result = matchSpanishPhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}

/**
 * The letters an English, German or French keyboard cannot reach.
 *
 * ñ leads because it is the one the matcher does not forgive: everything else
 * on this row passes with a spelling note if it is missed, and that one does
 * not. The opening ¿ and ¡ are here too — they are dropped before grading, so
 * nobody is marked down for their absence, but a learner writing Spanish
 * properly should be able to put them in.
 */
export const SPANISH_SPECIAL_CHARACTERS = [
  "ñ", "á", "é", "í", "ó", "ú", "ü", "¿", "¡",
  "Ñ", "Á", "É", "Í", "Ó", "Ú", "Ü",
];
