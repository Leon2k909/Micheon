const ALTERNATIVE_SEPARATOR = /\s+\/\s+/u;
const PARENTHETICAL_ANNOTATION = /\s*\([^()]*\)/gu;

function removeParentheticalAnnotations(value: string): string {
  let result = value;
  let previous = "";

  // Repeat so a nested note is removed one balanced level at a time. The
  // catalogue uses simple notes today, but leaving unmatched parentheses
  // untouched is safer than guessing how to rewrite ordinary prose.
  while (result !== previous) {
    previous = result;
    result = result.replace(PARENTHETICAL_ANNOTATION, "");
  }

  return result.replace(/\s{2,}/gu, " ").trim();
}

/**
 * "wind" the verb, told apart from "wind" the weather.
 *
 * One spelling, two words: the breeze rhymes with tinned, winding something
 * up rhymes with mind, and the synthesiser has to guess from the sentence.
 * It guessed wrong on "things that wind me up", which came out as the
 * weather and left the line meaningless. Edge's endpoint rejects custom SSML,
 * so there is no phoneme tag to reach for — the lever available is the
 * spelling sent to it, and wynd is an ordinary English word with exactly the
 * sound wanted.
 *
 * Matched by construction rather than by guessing at the sense: the verb
 * takes an object and a particle (wind me up, wind it back down, wind down),
 * or the fixed "wind your neck in", or the hyphenated wind-up. The weather
 * never does — "the wind whistles up top" and "wind force eight" both stay as
 * they are, which is why the words allowed to sit between are listed rather
 * than left as "any two words".
 */
const WIND_VERB = new RegExp(
  String.raw`\bwind(s|ing)?\b(?=`
  + String.raw`(?:\s+(?:me|him|her|it|us|them|you|myself|yourself|himself|herself|ourselves|themselves|someone|somebody|people))?`
  + String.raw`(?:\s+(?:right|back|really|properly|slowly|down|up))*`
  + String.raw`\s+(?:up|down)\b`
  + String.raw`|\s+your\s+neck\s+in\b`
  + String.raw`|-up\b)`,
  "giu"
);

/**
 * "cursed", said the way people say it now.
 *
 * The adjective carries an old two-syllable reading — the cursèd earth, in
 * hymns and in Shakespeare — and the voice reaches for it, so the gloss on
 * verflucht came out as curs-id: poetry, where the card wants the ordinary
 * word. Modern English says the adjective and the verb alike as one
 * syllable, so nothing is lost by fixing it there. Edge's endpoint rejects
 * custom SSML, so the only lever is the spelling sent to it, and curst is
 * the attested one-syllable form.
 *
 * Word-bounded, so accursed keeps its own three syllables.
 */
const CURSED_ADJECTIVE = /\bcursed\b/giu;

function applyPronunciationOverrides(value: string): string {
  // Microsoft's German neural voices can over-articulate the doubled "st"
  // seam in selbstständig. The accepted spelling selbständig has the same
  // meaning and pronunciation, but gives the synthesiser a clean word shape.
  // This is speech-only: learner-facing catalogue text stays untouched.
  return value
    .replace(/selbstständig/giu, (match) =>
      match.startsWith("S") ? "Selbständig" : "selbständig"
    )
    .replace(WIND_VERB, (match) =>
      (match.startsWith("W") ? "Wynd" : "wynd") + match.slice(4)
    )
    .replace(CURSED_ADJECTIVE, (match) =>
      match.startsWith("C") ? "Curst" : "curst"
    );
}

/**
 * Learning content can show several accepted translations separated by a
 * spaced slash. Speech should model one natural answer, not read the separator
 * or recite every alternative.
 */
export function firstSpokenAlternative(text: string): string {
  const value = String(text ?? "").trim();
  if (!value) return "";

  const separatorIndex = value.search(ALTERNATIVE_SEPARATOR);
  const firstAlternative = separatorIndex === -1
    ? value
    : value.slice(0, separatorIndex).trim();

  return applyPronunciationOverrides(removeParentheticalAnnotations(firstAlternative)
    .replace(/\band\/or\b/giu, "and or")
    .replace(/\bund\/oder\b/giu, "und oder")
    .replace(/(\p{L}+)\/\p{L}+/gu, "$1")
    .trim());
}
