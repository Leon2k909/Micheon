/**
 * Grading a typed POLISH answer.
 *
 * WHY NOT REUSE THE GERMAN OR FRENCH MATCHER. The German one folds ae→a,
 * oe→o and ue→u to forgive a missing umlaut, and it treats a lower-case noun
 * as a capitalisation mistake — a rule Polish does not have, since Polish
 * capitalises sentence starts and proper nouns and nothing else. The French
 * one strips combining marks, which reaches ą ć ę ń ó ś ź ż but walks past ł
 * entirely: ł is a letter in its own right, not an l with a mark, so "lodka"
 * would never reach "łódka". Polish gets its own comparator.
 *
 * WHAT COUNTS AS A SLIP RATHER THAN A MISTAKE:
 *   - a missing diacritic (ą ć ę ł ń ó ś ź ż) — spelling, so it passes with a
 *     note, exactly as a missing umlaut does in German. All nine are
 *     unreachable on a keyboard bought anywhere else, and the learner who
 *     types "czesc" knew the word;
 *   - punctuation and case, dropped on both sides before anything is compared.
 *
 * WHAT EARNS A NOTE RATHER THAN A PASS: a spare subject pronoun. Polish leaves
 * "ja", "ty", "on" out unless it is stressing them, so "ja idę" for "idę" is
 * grammatical and not what anyone says. The learner produced the language and
 * over-produced the pronoun, which is worth telling them rather than crossing.
 *
 * WHAT IS DELIBERATELY NOT FORGIVEN. Polish has three sounds spelled two ways
 * — ó/u, rz/ż, ch/h — and they are what Polish schoolchildren are drilled on,
 * so folding them looked like the obvious kindness. It is not: "morze" (sea)
 * and "może" (maybe) are a real everyday pair that differ by exactly that
 * fold, as are "bok" and "buk". Accepting one for the other would mark a
 * wrong word right and never say so, which is worse than a red cross on a
 * spelling the learner can see is wrong.
 *
 * WHAT ELSE DOES NOT PASS: a wrong case, a wrong aspect, a wrong word. Those
 * are what the lesson is for.
 */

type PolishMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘]/g;
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…]/g;
const THIN_SPACES = /[    ]/g;

/** Case-preserving normalisation: the form every tier below compares. */
function normalizePolishInput(text: string): string {
  return String(text ?? "")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The diacritics folded away.
 *
 * Written as an explicit pair list rather than an NFKD decomposition, because
 * ł carries no combining mark and decomposition leaves it exactly where it
 * was — which is the whole reason this function is not the French one.
 */
const DIACRITICS: Array<[RegExp, string]> = [
  [/ą/g, "a"],
  [/ć/g, "c"],
  [/ę/g, "e"],
  [/ł/g, "l"],
  [/ń/g, "n"],
  [/ó/g, "o"],
  [/ś/g, "s"],
  [/ź/g, "z"],
  [/ż/g, "z"],
];

function normalizePolishLenient(text: string): string {
  let value = normalizePolishInput(text).toLocaleLowerCase("pl-PL");
  for (const [pattern, replacement] of DIACRITICS) value = value.replace(pattern, replacement);
  return value;
}

/** Lower case only, diacritics intact — separates a capital slip from an accent slip. */
function lowerPolish(text: string): string {
  return normalizePolishInput(text).toLocaleLowerCase("pl-PL");
}

/** Subject pronouns Polish leaves out unless it is stressing them. */
const REDUNDANT_SUBJECT = /^(ja|ty|on|ona|ono|my|wy|oni|one)\s+/;

/** One comparison, so the tiers differ only in what they fold. */
function compare(input: string, target: string): PolishMatch | null {
  const strictInput = normalizePolishInput(input);
  const strictTarget = normalizePolishInput(target);
  if (!strictInput) return null;
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerPolish(input) === lowerPolish(target)) {
    // Same letters, different capitals. Polish capitalises the start of a
    // sentence and proper nouns and nothing else, and cards are written as
    // fragments ("pies") as often as as sentences, so a difference in the
    // FIRST letter is what a keyboard does on its own rather than a mistake.
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  if (normalizePolishLenient(input) === normalizePolishLenient(target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchPolishPhrase(input: string, target: string): PolishMatch {
  // "A / B" answer keys offer alternatives — either side is a right answer.
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((part) => part.trim()).filter(Boolean)) {
      const alternative = matchPolishPhrase(input, segment);
      if (alternative.ok) return alternative;
    }
  }

  const direct = compare(input, target);
  if (direct?.ok) return direct;
  // The pronoun fold below runs on lower-cased, diacritic-stripped text and is
  // blind to capitals, so a capitalisation note has to be returned before it
  // gets a chance to turn one into something else.
  if (direct?.capitalizationError) return direct;

  const lenientInput = normalizePolishLenient(input);
  const lenientTarget = normalizePolishLenient(target);
  const withoutSubject = lenientInput.replace(REDUNDANT_SUBJECT, "");
  if (withoutSubject !== lenientInput && withoutSubject === lenientTarget) {
    return { ok: false, spellingNote: false, phrasingNote: true };
  }

  return direct ?? { ok: false, spellingNote: false };
}

/** Sentences and phrases go through the same tiers — one entry point, two names. */
export const matchPolishSentence = matchPolishPhrase;

/**
 * A vocabulary card names several equally right senses ("dom, mieszkanie").
 * They are choices, not a phrase to reproduce in full.
 */
function polishMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+albo\s+|\s+lub\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function matchPolishMeaning(input: string, target: string): PolishMatch {
  const whole = matchPolishPhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of polishMeaningAlternatives(target)) {
    const result = matchPolishPhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}

/** The letters an English, German or French keyboard cannot reach. */
export const POLISH_SPECIAL_CHARACTERS = [
  "ą", "ć", "ę", "ł", "ń", "ó", "ś", "ź", "ż",
  "Ą", "Ć", "Ę", "Ł", "Ń", "Ó", "Ś", "Ź", "Ż",
];
