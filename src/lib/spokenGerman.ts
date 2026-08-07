/**
 * The spoken ich-form, derived rather than authored.
 *
 * Germans drop the -e off the ich-form constantly: "So hab ich das noch nicht
 * gesehen", not "So habe ich…". Conversation mode promises "the short, natural
 * forms people use", but it could only deliver that where a pack author had
 * hand-written a `short` AND a `shortEn` — 101 of 17,648 taught lines. For the
 * other 99.4% the promise silently did nothing.
 *
 * Dropping this -e is meaning-preserving, which is what makes it safe to
 * derive for the whole catalogue: unlike a genuinely different short phrasing
 * ("Zu teuer." for "I don't want to buy that, it's too expensive."), the
 * English stays exactly as true of the contracted sentence as of the full one,
 * so there is no card that lies.
 *
 * Two deliberate limits:
 *
 *  1. Only where the -e is unambiguously a first-person ending: next to
 *     "ich" in either order, or last in a clause that opened with a
 *     subordinating conjunction plus "ich". The -e
 *     is only droppable because it is the first-person ending; nothing else in
 *     the sentence is touched, so no noun can be mangled.
 *  2. Only verbs whose stem survives without the -e. Stems ending in -t or -d
 *     keep it in real German — "ich arbeite", "ich rede", "ich finde",
 *     "ich warte" — so those are absent here on purpose. The answer matcher is
 *     deliberately more permissive than this list: accepting "ich arbeit" from
 *     a learner is kindness, printing it as the model sentence is not.
 */

/** ich-forms that genuinely lose their -e in speech. */
const SPOKEN_STEMS = [
  "hab", "geh", "mach", "sag", "komm", "nehm", "seh", "steh", "glaub",
  "denk", "schau", "spiel", "such", "versteh", "zeig", "h(?:ö|oe)r", "kauf",
  "leb", "lern", "leg", "freu", "frag", "mein", "schreib", "trink",
  "f(?:ü|ue)hl", "werd", "bleib", "bring", "krieg", "setz", "hol", "brauch",
  // "geb" was missing, which is how a sentence beginning "Ich gebe zu" was
  // printed in full while "ich hab" beside it was contracted.
  "geb", "les", "ess", "fahr", "lass", "hoff", "zieh", "trag", "lieg",
  // "lieb" is deliberately absent: "ich lieb dich" is said, but "Ich lieb
  // meine Mutter" reads as marked, and the bar for PRINTING a model sentence
  // is higher than for accepting one.
  "zahl", "schick", "schaff", "sitz", "erkl(?:ä|ae)r", "erinner",
  "probier", "versuch", "ruf", "kenn", "wohn", "helf", "lauf", "sing",
];

const STEMS = SPOKEN_STEMS.join("|");
// "ich habe" -> "ich hab"
const AFTER_ICH = new RegExp(`\\b(ich\\s+)(${STEMS})e\\b`, "gi");
// "habe ich" -> "hab ich" (inversion, questions, and anything fronted)
const BEFORE_ICH = new RegExp(`\\b(${STEMS})e(\\s+ich\\b)`, "gi");
// "..., dass ich es nicht verstehe" -> "... versteh". German puts the verb
// last after dass/weil/wenn, which is nowhere near "ich", so neither rule
// above ever reached it. Sentences came out half-contracted as a result:
// "Ich bleib hier, weil ich noch etwas mache."
//
// Safe without an "ich" next to it because of the two anchors: the clause
// must open with a subordinating conjunction plus "ich", and the word must
// be the LAST thing in the clause. Subordinate clauses end on their verb, so
// a noun cannot occupy that slot -- which is what keeps "weil ich die Frage
// nicht verstehe" and "dass ich die Kriege nicht verstehe" intact.
const SUBORDINATORS = "dass|weil|wenn|ob|obwohl|damit|bevor|nachdem|w(?:ä|ae)hrend|falls|solange|sobald";
const CLAUSE_FINAL = new RegExp(
  `\\b(?:${SUBORDINATORS})\\s+ich\\b[^,.;!?]*?\\b(${STEMS})e(?=[,.;!?]|$)`,
  "gi",
);

/**
 * The everyday spoken rendering of a sentence. Returns the input unchanged
 * when nothing applies, so callers can compare by identity to find out
 * whether a sentence has a distinct spoken form at all.
 */
export function toSpokenGerman(sentence: string): string {
  const text = String(sentence ?? "");
  if (!text) return text;
  // Only the -e is removed, so the original capitalisation of every word
  // survives: "Habe ich das gesagt?" -> "Hab ich das gesagt?".
  return text
    .replace(AFTER_ICH, (_match, lead: string, stem: string) => `${lead}${stem}`)
    .replace(BEFORE_ICH, (_match, stem: string, tail: string) => `${stem}${tail}`)
    // Only the trailing -e goes; the rest of the clause is handed back as it
    // came in, so nothing between the conjunction and the verb is touched.
    .replace(CLAUSE_FINAL, (match: string) => match.replace(/e$/, ""));
}

/** True when the sentence reads differently once spoken. */
export function hasSpokenForm(sentence: string): boolean {
  return toSpokenGerman(sentence) !== String(sentence ?? "");
}
