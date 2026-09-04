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
/**
 * "mein" is on the list because "das meine ich" really is said as "das mein
 * ich". But "meine" is also the possessive, and this rule reached that too:
 * "Und wann darf ich meine Figur bewegen?" was being taught as "ich mein
 * Figur", which is not German at all.
 *
 * The two readings are told apart by the word after them, and German makes
 * that easy: a possessive is followed by the thing owned, and a German noun is
 * capitalised. So "ich meine" keeps its -e in front of a capital letter and
 * loses it everywhere else — which is right for "Ich mein ja nur" and for
 * "Das ist genau das, was ich meine." alike. Requiring the end of the clause
 * instead was tried first and was too narrow: it took the -e off nothing and
 * printed "Ich meine ja nur".
 *
 * The other two rules below are left alone. "meine ich" and a clause-final
 * "meine" can only be the verb, because a possessive needs its noun.
 */
const AFTER_ICH_STEMS = SPOKEN_STEMS.filter((stem) => stem !== "mein").join("|");
// "ich habe" -> "ich hab"
const AFTER_ICH = new RegExp(`\\b(ich\\s+)(${AFTER_ICH_STEMS})e\\b`, "gi");
// "ich meine ja nur" -> "ich mein ja nur"; "ich meine Figur" left alone
const AFTER_ICH_MEIN = /\b([Ii]ch\s+)(mein)e\b(?!\s+\p{Lu})/gu;
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
    .replace(AFTER_ICH_MEIN, (_match, lead: string, stem: string) => `${lead}${stem}`)
    .replace(BEFORE_ICH, (_match, stem: string, tail: string) => `${stem}${tail}`)
    // Only the trailing -e goes; the rest of the clause is handed back as it
    // came in, so nothing between the conjunction and the verb is touched.
    .replace(CLAUSE_FINAL, (match: string) => match.replace(/e$/, ""));
}

/**
 * The commas people leave out when they are not writing an exam.
 *
 * German comma rules are strict and Conversation mode was following all of
 * them, which produced a register nobody writes in: the verb clipped the way
 * it is SPOKEN ("Ich glaub") and the punctuation set the way it is EXAMINED
 * ("Ich glaub, wir haben alles, was wir brauchen."). To a native reader that
 * is too many commas. The register is the entire point of this mode — the
 * other one is called Exam and
 * keeps every comma.
 *
 * What goes is the grammar comma: the one before a subordinate or relative
 * clause, which marks a boundary you cannot hear. What stays is any comma you
 * can hear — after an interjection or a name, between list items, before a
 * tag question ("..., oder?") and before a contrast ("..., aber nur kurz").
 *
 * Deliberately conservative in one place. "der", "die" and "das" are relative
 * pronouns AND articles, and "Ich nehm den Salat, den Fisch und das Brot" is a
 * list, not a relative clause. Getting that wrong would mangle a sentence, so
 * only the pronouns that can never be articles are handled. The cost is that a
 * few commas survive that a German would drop; the alternative risks producing
 * something no German would write at all.
 */
const DROPPABLE_BEFORE = [
  // Subordinating conjunctions: the comma before these is pure grammar.
  "dass", "weil", "wenn", "ob", "obwohl", "damit", "bevor", "nachdem",
  "w(?:ä|ae)hrend", "falls", "solange", "sobald", "bis", "seit", "seitdem",
  "sodass", "wobei", "wenngleich",
  // Relative pronouns and interrogatives that are never articles.
  "was", "wo", "wer", "wen", "wem", "wessen", "dessen", "deren",
  "welche(?:r|s|n|m)?", "warum", "wieso", "weshalb", "wohin", "woher",
].join("|");

/**
 * Verbs that introduce a dass-less clause. "Ich glaub, wir haben alles" takes
 * its comma from a clause boundary rather than a pause, and this is the exact
 * shape that started this: a clipped ich-form followed by textbook punctuation.
 */
const MATRIX_VERBS = [
  "glaub", "denk", "mein", "hoff", "find", "sag", "wei(?:ß|ss)", "seh",
  "vermut", "f(?:ü|ue)rcht", "schätz", "sch(?:ä|ae)tz",
].join("|");
const SUBJECTS = "ich|du|er|sie|es|wir|ihr|Sie|man|das|die|der";

/**
 * Words that end a spoken pause rather than a clause. A comma after one of
 * these survives however grammatical the next word looks: greetings, answers,
 * thanks, apologies, fillers and the time-of-day phrases people open with.
 */
const PAUSE_BEFORE = new RegExp(
  "\\b(?:hallo|hi|hey|servus|moin|tsch(?:ü|ue)ss|ja|nein|doch|danke|bitte|"
  + "entschuldigung|sorry|verzeihung|moment|also|na|ach|oh|tja|nun|okay|ok|"
  + "klar|genau|gut|sch(?:ö|oe)n|prost|mahlzeit|hm+|tag|abend|morgen|nacht)"
  + "[!?.…]*\\s*$",
  "i",
);

const GRAMMAR_COMMA = new RegExp(`,(\\s+)(?=(?:${DROPPABLE_BEFORE})\\b)`, "gi");
const DASS_LESS_COMMA = new RegExp(
  `\\b(?:${MATRIX_VERBS})(?:e|st|t)?(?:\\s+(?:ich|du|er|sie|es|wir|ihr|Sie))?\\s*,(\\s+)(?=(?:${SUBJECTS})\\b)`,
  "g",
);

/**
 * The sentence as it would be typed rather than as it would be marked.
 *
 * Display only. Every comparison in the app strips punctuation before it
 * compares, so an answer typed with commas and an answer typed without are
 * already the same answer — this changes what is shown, never what is right.
 *
 * NOTE, for whoever reads this next and reaches for the obvious "fix": the
 * comma before dass/weil/wenn is mandatory in German orthography, and this
 * drops it on purpose, on the judgement of a native reader: "Ich glaub, wir
 * haben alles, was wir brauchen." carries too many commas for the register
 * this mode is written in, and check-spoken-forms pins the result. Exam mode keeps every
 * default mode teaches, not a bug to be quietly corrected.
 */
export function toTextedGerman(sentence: string): string {
  const text = String(sentence ?? "");
  if (!text.includes(",")) return text;
  return text
    .replace(DASS_LESS_COMMA, (match, gap: string) => match.replace(`,${gap}`, gap))
    .replace(GRAMMAR_COMMA, (match: string, gap: string, offset: number, whole: string) =>
      // "Hallo, wer ist da?" is a greeting and a pause, not a clause boundary,
      // and the word after it happens to be a question word. Nobody drops that
      // comma. Keeping one too many reads as slightly formal; dropping this one
      // reads as broken, so the doubt goes to whichever keeps the comma.
      PAUSE_BEFORE.test(whole.slice(0, offset)) ? match : gap
    );
}

/** True when the sentence reads differently once spoken. */
export function hasSpokenForm(sentence: string): boolean {
  return toSpokenGerman(sentence) !== String(sentence ?? "");
}
