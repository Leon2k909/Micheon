/**
 * The word lists behind "the course never decides the learner's gender".
 *
 * WHY THEY LIVE HERE RATHER THAN IN THE GATE THAT FIRST NEEDED THEM. Two gates
 * enforce that rule now — check-russian-script.cjs over the translation table,
 * check-russian-own-cards.cjs over the Russian-only packs — and a rule that is
 * spelled out twice is a rule that will be true in one place and stale in the
 * other. One list, both readers.
 *
 * WHY LISTS RATHER THAN A PATTERN. The obvious version matches a past tense on
 * the -л ending and is wrong within one word: стол is a table, пол is a floor,
 * угол is a corner. Every entry below is a word that actually agrees with the
 * person speaking, so a hit is a real decision about them and not a noun that
 * happens to end the same way. The same trap in reverse ate the first version
 * of the own-cards gate, which matched \w+л — and \w in JavaScript is ASCII, so
 * it never matched a Cyrillic letter at all and the check silently passed
 * everything for as long as it existed.
 */

/** Pronouns that put somebody else in the sentence, so the agreement is theirs. */
const THIRD_PERSON = ["он", "она", "оно", "они", "его", "её", "их", "ему", "ей", "им"];

const MASCULINE_SHORT = [
  "свободен", "занят", "готов", "уверен", "рад", "должен", "согласен",
  "болен", "голоден", "прав", "доволен", "женат", "здоров", "виноват",
  // Found by a card in block 58: "если ты заразен" decides it just as surely.
  "заразен", "простужен", "занят", "уверен",
  // Not a short adjective but agrees exactly like one, and just as invisible:
  // "срок ты выбираешь сам" picks a gender for whoever is reading.
  "сам",
];

/**
 * And the feminine, because the rule is that the course does not DECIDE, not
 * that it prefers the masculine.
 */
const FEMININE_SHORT = [
  "свободна", "занята", "готова", "уверена", "рада", "должна", "согласна",
  "больна", "голодна", "права", "довольна", "замужем", "здорова", "виновата",
  "заразна", "простужена",
  "сама",
];

/** Masculine past tense. Listed, not matched on -л, because стол is a table. */
const MASCULINE_PAST = [
  "понял", "хотел", "сделал", "сказал", "видел", "думал", "забыл", "знал",
  "пришёл", "ушёл", "нашёл", "был", "смог", "взял", "дал", "мог", "писал",
  "читал", "работал", "жил", "ел", "пил", "спал", "играл", "купил", "спросил",
  "ответил", "решил", "начал", "закончил", "успел", "устал", "проспал",
];

const FEMININE_PAST = MASCULINE_PAST
  .map((word) => word.replace(/ёл$/, "ла").replace(/л$/, "ла").replace(/г$/, "гла"))
  .filter((word) => word.endsWith("ла"));

/**
 * Split a Russian line into comparable words: lower-cased, punctuation gone.
 * Both gates need the same splitting or the same list would still disagree.
 */
function wordsOf(russian) {
  return String(russian)
    .toLowerCase()
    .replace(/[.,!?;:—–-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

module.exports = {
  THIRD_PERSON,
  MASCULINE_SHORT,
  FEMININE_SHORT,
  MASCULINE_PAST,
  FEMININE_PAST,
  wordsOf,
};
