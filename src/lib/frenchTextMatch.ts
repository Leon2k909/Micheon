/**
 * Grading a typed FRENCH answer.
 *
 * WHY NOT REUSE THE GERMAN MATCHER. matchGermanPhrase() is the app's general
 * comparator, and matchEnglishPhrase() is built on top of it — so the obvious
 * move was to do the same again. It cannot be done: normalizeGermanLenient()
 * folds ae→a, oe→o and ue→u to forgive a missing umlaut, and those sequences
 * are ordinary French. Applied to both sides the folds usually cancel out, but
 * they also collapse pairs that are genuinely different words — "sue" onto
 * "su", "vue" onto "vu", "tue" onto "tu" — so a wrong answer would come back
 * marked right. French gets its own comparator.
 *
 * WHAT COUNTS AS A SLIP RATHER THAN A MISTAKE:
 *   - a missing accent (é è ê ë à â î ï ô ù û ç) — spelling, so it passes with
 *     a note, exactly as a missing umlaut does in German;
 *   - an apostrophe typed as ' or ’ or ` or ´, or left out entirely ("jai" for
 *     "j'ai"), because keyboards differ and the elision is not the lesson;
 *   - the space French sets before ! ? : ; — punctuation is dropped on both
 *     sides before anything is compared, so it can never fail an answer;
 *   - dropping "ne" in a negation, or typing it back in. The catalogue teaches
 *     spoken French ("Je sais pas"), and the written "Je ne sais pas" is the
 *     same sentence.
 *
 * WHAT DOES NOT PASS: a wrong word, a wrong agreement, a wrong tense. Those
 * are what the lesson is for.
 */

export type FrenchMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘]/g;
// Everything French typography puts round a sentence, including the narrow and
// non-breaking spaces it sets before ! ? : ; — those must vanish rather than
// become a word boundary, or "Ça va ?" and "Ça va?" compare as different.
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…]/g;
const THIN_SPACES = /[    ]/g;

/**
 * Case-preserving normalisation: the form both tiers below compare.
 *
 * Hyphens become spaces because French writes the same thing both ways round
 * an inversion ("est-ce que" / "est ce que", "va-t-il" / "va t il") and a
 * learner cannot be expected to place them.
 */
export function normalizeFrenchInput(text: string): string {
  return String(text ?? "")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "'")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    // "j' ai" and "j'ai" are one word split two ways by a stray space.
    .replace(/'\s+/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Accents, ligatures and the apostrophe folded away — a spelling slip, not a mistake. */
export function normalizeFrenchLenient(text: string): string {
  return normalizeFrenchInput(text)
    .toLocaleLowerCase("fr-FR")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/'/g, "");
}

/** Lower case only, accents intact — separates a capital slip from an accent slip. */
function lowerFrench(text: string): string {
  return normalizeFrenchInput(text).toLocaleLowerCase("fr-FR");
}

/**
 * Spoken and written French that say the same thing.
 *
 * Applied to BOTH sides, so either form is accepted whichever the card holds.
 * The catalogue writes what people say, which means most cards carry the
 * spoken form and the learner who types the written one has to pass.
 *
 * These run on normalizeFrenchLenient() output: lower case, no accents and no
 * apostrophes, so "n'ai" has already become "nai" by the time they see it.
 */
const FRENCH_EQUIVALENTS: [RegExp, string][] = [
  // Negation. Spoken French drops "ne", written French keeps it; both forms
  // fold to the one WITHOUT it, so the pair collapses either way round.
  [/\bne\s+/g, ""],
  [/\bn(?=(ai|as|a|avons|avez|ont|est|es|etes|etais|etait|y)\b)/g, ""],
  // Elisions people actually speak, expanded to their full form. Written
  // apostrophe-free by the fold above, which is why "jai" appears here.
  [/\btes\b/g, "tu es"],
  [/\bjsuis\b/g, "je suis"],
  [/\bjai\b/g, "je ai"],
  [/\bje\s+ai\b/g, "je ai"],
  [/\bya\b/g, "il y a"],
  [/\bil\s+y\s+a\b/g, "il y a"],
  // A question asked two ways is one question: "Tu viens ?" and "Est-ce que tu
  // viens ?" say the same thing, and which one a card happens to hold is not
  // what is being tested.
  [/\best\s*ce\s*que?\s+/g, ""],
  // Set phrases with a fixed short form everybody writes.
  [/\bs\s*il\s+te\s+plait\b/g, "stp"],
  [/\bs\s*il\s+vous\s+plait\b/g, "svp"],
  [/\bd\s*accord\b/g, "ok"],
  [/\bouais\b/g, "oui"],
];

function applyEquivalents(text: string): string {
  let out = text;
  for (const [pattern, replacement] of FRENCH_EQUIVALENTS) out = out.replace(pattern, replacement);
  return out.replace(/\s+/g, " ").trim();
}

/**
 * A phrasing a French speaker would not use, close enough to coach rather than
 * reject outright. Folded only on the last tier, and only to raise a note —
 * these never make an answer right.
 */
const FRENCH_NEAR_MISS: [RegExp, string][] = [
  // The two auxiliaries learners swap: "j'ai faim", never "je suis faim".
  [/\bje\s+suis\b/g, "je ai"],
  [/\btu\s+es\b/g, "tu as"],
  // Gendered articles. "le table" is a real mistake, and naming it beats a red X.
  [/\b(le|la|les)\b/g, "l"],
  [/\b(un|une|des)\b/g, "un"],
  [/\b(mon|ma|mes)\b/g, "mon"],
  [/\b(ton|ta|tes)\b/g, "ton"],
];

/** The one comparison every tier runs, so the tiers differ only in what they fold. */
function compare(input: string, target: string): FrenchMatch | null {
  const strictInput = normalizeFrenchInput(input);
  const strictTarget = normalizeFrenchInput(target);
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerFrench(input) === lowerFrench(target)) {
    // Same letters and accents, different capitals. French capitalises the
    // start of a sentence and proper nouns and nothing else, so a card whose
    // only difference is its FIRST letter is not a mistake in either
    // direction: cards are written as fragments as often as as sentences
    // ("le chien"), and typing "Le chien" is what a keyboard does on its own.
    // Anything further in is a real capital and worth naming.
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  // Same letters, different accents — spelling, so it passes with a note.
  // Any capital difference riding along is forgiven with it rather than
  // reported instead of it.
  if (normalizeFrenchLenient(input) === normalizeFrenchLenient(target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchFrenchPhrase(input: string, target: string): FrenchMatch {
  // "A / B" answer keys offer alternatives — either side is a right answer.
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((s) => s.trim()).filter(Boolean)) {
      const alternative = matchFrenchPhrase(input, segment);
      if (alternative.ok) return alternative;
    }
  }

  const direct = compare(input, target);
  if (direct?.ok) return direct;
  // Every fold below runs on lower-cased, accent-stripped text, so none of
  // them can tell one capital from another. Letting them answer a question
  // they are blind to turned "Le chien" for "le chien" into a silent pass and
  // hid the note that was already correct.
  if (direct?.capitalizationError) return direct;

  const folded = applyEquivalents(normalizeFrenchLenient(input));
  const foldedTarget = applyEquivalents(normalizeFrenchLenient(target));
  if (folded === foldedTarget) return { ok: true, spellingNote: direct?.spellingNote ?? false };

  const near = (value: string) => {
    let out = applyEquivalents(normalizeFrenchLenient(value));
    for (const [pattern, replacement] of FRENCH_NEAR_MISS) out = out.replace(pattern, replacement);
    return out.replace(/\s+/g, " ").trim();
  };
  if (near(input) === near(target)) return { ok: false, spellingNote: false, phrasingNote: true };

  // A capitalisation note is worth more than a bare "wrong", so it survives
  // the folds above having failed.
  return direct ?? { ok: false, spellingNote: false };
}

/** Sentences and phrases go through the same tiers — one entry point, two names. */
export const matchFrenchSentence = matchFrenchPhrase;

/**
 * A vocabulary card names several equally right senses ("le but / l'objectif",
 * "grand, gros"). They are choices, not a phrase to reproduce in full.
 */
export function frenchMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+ou\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function primaryFrenchMeaning(value: string): string {
  return frenchMeaningAlternatives(value)[0] ?? "";
}

export function matchFrenchMeaning(input: string, target: string): FrenchMatch {
  const whole = matchFrenchPhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of frenchMeaningAlternatives(target)) {
    const result = matchFrenchPhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}
