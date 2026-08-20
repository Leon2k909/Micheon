/**
 * Does an example sentence actually show the meaning the card claims?
 *
 * Leon hovered "Profil" on x.com and the card said:
 *
 *     profile
 *     Wie sieht das Profil aus? — How does the tread look?
 *
 * Both halves are correct on their own. Together they are nonsense. Profil is
 * the tread of a tyre in that sentence and the profile of an account in the
 * gloss, and the card gives the reader no way to tell which word they just
 * learned. Six of our phrases contain "Profil"; three are about profiles and
 * three about tyres, and the picker took the SHORTEST, which was a tyre.
 *
 * So the picker needs to read the English. If the English side of the example
 * shows the word we glossed, the card demonstrates the word. If it shows
 * something else, the card teaches the wrong sense — and a hover card with no
 * example is better than one that argues with itself.
 *
 * The test is deliberately generous, because a good translation is not a
 * word-for-word one: any inflected shape counts, any of the alternatives the
 * gloss itself lists counts, and irregular verbs are spelled out rather than
 * guessed at. What it will not do is invent a thesaurus — "city" is not
 * matched by "town" — so a false alarm costs us a better-ranked example and
 * never a wrong one.
 */

/**
 * Function words are noise inside a multi-word gloss and the entire point of
 * a one-word one. "to go" must still be tested on "go"; "a piece of cake"
 * must not be tested on "of".
 */
const FUNCTION_WORDS = new Set([
  "the", "a", "an", "to", "of", "for", "in", "on", "at", "by", "with", "and",
  "or", "as", "it", "its", "this", "that", "these", "those", "one", "some",
  "any", "be", "is", "are", "was", "were", "been", "am", "do", "does", "did",
  "have", "has", "had", "not", "no", "you", "your", "we", "our", "they",
  "their", "he", "she", "his", "her", "him", "them", "i", "me", "my", "s",
  "something", "someone", "somebody", "oneself", "sth", "sb",
]);

/** Verbs English refuses to inflect by rule. Base first, then its shapes. */
const IRREGULAR = [
  ["be", "am", "is", "are", "was", "were", "been", "being"],
  ["become", "became", "becoming"],
  ["begin", "began", "begun", "beginning"],
  ["bring", "brought", "bringing"],
  ["build", "built", "building"],
  ["buy", "bought", "buying"],
  ["catch", "caught", "catching"],
  ["choose", "chose", "chosen", "choosing"],
  ["come", "came", "coming"],
  ["cost", "costing"],
  ["cut", "cutting"],
  ["do", "does", "did", "done", "doing"],
  ["draw", "drew", "drawn", "drawing"],
  ["drink", "drank", "drunk", "drinking"],
  ["drive", "drove", "driven", "driving"],
  ["eat", "ate", "eaten", "eating"],
  ["fall", "fell", "fallen", "falling"],
  ["feel", "felt", "feeling"],
  ["fight", "fought", "fighting"],
  ["find", "found", "finding"],
  ["fly", "flew", "flown", "flying"],
  ["forget", "forgot", "forgotten", "forgetting"],
  ["forgive", "forgave", "forgiven", "forgiving"],
  ["get", "got", "gotten", "getting"],
  ["give", "gave", "given", "giving"],
  ["go", "goes", "went", "gone", "going"],
  ["grow", "grew", "grown", "growing"],
  ["hang", "hung", "hanging"],
  ["have", "has", "had", "having"],
  ["hear", "heard", "hearing"],
  ["hide", "hid", "hidden", "hiding"],
  ["hit", "hitting"],
  ["hold", "held", "holding"],
  ["hurt", "hurting"],
  ["keep", "kept", "keeping"],
  ["know", "knew", "known", "knowing"],
  ["lay", "laid", "laying"],
  ["lead", "led", "leading"],
  ["learn", "learnt", "learned", "learning"],
  ["leave", "left", "leaving"],
  ["lend", "lent", "lending"],
  ["let", "letting"],
  ["lie", "lay", "lain", "lying"],
  ["lose", "lost", "losing"],
  ["make", "made", "making"],
  ["mean", "meant", "meaning"],
  ["meet", "met", "meeting"],
  ["pay", "paid", "paying"],
  ["put", "putting"],
  ["read", "reading"],
  ["ride", "rode", "ridden", "riding"],
  ["ring", "rang", "rung", "ringing"],
  ["rise", "rose", "risen", "rising"],
  ["run", "ran", "running"],
  ["say", "said", "saying"],
  ["see", "saw", "seen", "seeing"],
  ["sell", "sold", "selling"],
  ["send", "sent", "sending"],
  ["set", "setting"],
  ["shoot", "shot", "shooting"],
  ["show", "showed", "shown", "showing"],
  ["shut", "shutting"],
  ["sing", "sang", "sung", "singing"],
  ["sit", "sat", "sitting"],
  ["sleep", "slept", "sleeping"],
  ["speak", "spoke", "spoken", "speaking"],
  ["spend", "spent", "spending"],
  ["stand", "stood", "standing"],
  ["steal", "stole", "stolen", "stealing"],
  ["swim", "swam", "swum", "swimming"],
  ["take", "took", "taken", "taking"],
  ["teach", "taught", "teaching"],
  ["tell", "told", "telling"],
  ["think", "thought", "thinking"],
  ["throw", "threw", "thrown", "throwing"],
  ["understand", "understood", "understanding"],
  ["wake", "woke", "woken", "waking"],
  ["wear", "wore", "worn", "wearing"],
  ["win", "won", "winning"],
  ["write", "wrote", "written", "writing"],
];

/** Irregular plurals, for the noun half of the glossary. */
const IRREGULAR_PLURALS = [
  ["child", "children"], ["man", "men"], ["woman", "women"], ["person", "people"],
  ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"], ["goose", "geese"],
  ["life", "lives"], ["knife", "knives"], ["wife", "wives"], ["leaf", "leaves"],
  ["loaf", "loaves"], ["shelf", "shelves"], ["thief", "thieves"], ["half", "halves"],
];

const FAMILIES = new Map();
for (const family of [...IRREGULAR, ...IRREGULAR_PLURALS]) {
  for (const member of family) {
    const held = FAMILIES.get(member);
    if (held) for (const other of family) held.add(other);
    else FAMILIES.set(member, new Set(family));
  }
}

/**
 * The Atlantic, which our glosses and our sentences do not always cross
 * together. Micheon writes British English; Tatoeba's English is mostly
 * American, and our own translators are inconsistent about it. Without this,
 * "to generalise" is not shown by "I wouldn't generalize it", which is absurd.
 */
function spellingTwin(word) {
  const swaps = [
    [/is(e|es|ed|er|ing|ation|ations)$/, "iz$1"],
    [/iz(e|es|ed|er|ing|ation|ations)$/, "is$1"],
    [/ys(e|es|ed|ing)$/, "yz$1"],
    [/yz(e|es|ed|ing)$/, "ys$1"],
    [/^(col|hon|fav|favour|behavi|neighb|lab|hum|rum|vap|arm|flav|od|val)our(s|ed|ing|ite|ites)?$/, "$1or$2"],
    [/^(col|hon|fav|behavi|neighb|lab|hum|rum|vap|arm|flav|od|val)or(s|ed|ing|ite|ites)?$/, "$1our$2"],
    [/^(cent|met|lit|theat|fib|sombr|calib)re(s|d)?$/, "$1er$2"],
    [/^(cent|met|lit|theat|fib|sombr|calib)er(s|ed)?$/, "$1re$2"],
    [/^(catal|dial|analy|monol|epil|prol)ogue(s|d)?$/, "$1og$2"],
    [/^(catal|dial|analy|monol|epil|prol)og(s|ged)?$/, "$1ogue$2"],
    [/([aeiou])ll(ed|ing|er|ers)$/, "$1l$2"],
    [/([aeiou])l(ed|ing|er|ers)$/, "$1ll$2"],
    [/^grey/, "gray"], [/^gray/, "grey"],
    [/^tyre/, "tire"], [/^tire/, "tyre"],
    [/^practis/, "practic"], [/^practic/, "practis"],
    [/^defenc/, "defens"], [/^defens/, "defenc"],
    [/^licenc/, "licens"], [/^licens/, "licenc"],
    [/^aeroplane/, "airplane"], [/^airplane/, "aeroplane"],
    [/^mum(s|my)?$/, "mom$1"], [/^mom(s|my)?$/, "mum$1"],
    [/^whilst$/, "while"], [/^amongst$/, "among"],
  ];
  const twins = new Set();
  for (const [pattern, replacement] of swaps) {
    if (pattern.test(word)) twins.add(word.replace(pattern, replacement));
  }
  twins.delete(word);
  return twins;
}

/** Every spelling of an English word we are willing to accept as the same word. */
function wordShapes(word) {
  const shapes = new Set([word]);
  const add = (value) => { if (value.length > 1) shapes.add(value); };
  for (const member of FAMILIES.get(word) ?? []) add(member);
  for (const twin of spellingTwin(word)) {
    add(twin);
    add(`${twin}s`);
    add(`${twin}es`);
    add(`${twin}d`);
    add(`${twin}ed`);
    add(twin.endsWith("e") ? `${twin.slice(0, -1)}ing` : `${twin}ing`);
  }
  add(`${word}s`);
  add(`${word}es`);
  add(`${word}ed`);
  add(`${word}d`);
  add(`${word}ing`);
  add(`${word}n`);
  add(`${word}er`);
  add(`${word}est`);
  add(`${word}ly`);
  if (word.endsWith("e")) {
    const stem = word.slice(0, -1);
    add(`${stem}ing`);
    add(`${stem}ed`);
    add(`${stem}es`);
    add(`${stem}er`);
    add(`${stem}est`);
  }
  if (word.endsWith("y")) {
    const stem = word.slice(0, -1);
    add(`${stem}ies`);
    add(`${stem}ied`);
    add(`${stem}ier`);
    add(`${stem}iest`);
    add(`${stem}ily`);
  }
  // run → running, but not read → readding: only a single vowel between two
  // consonants doubles.
  if (/[^aeiou][aeiou][bdgklmnprt]$/.test(word)) {
    const doubled = word + word.slice(-1);
    add(`${doubled}ing`);
    add(`${doubled}ed`);
    add(`${doubled}er`);
  }
  // English hyphenates as it pleases: a gloss writes "make-up" and the
  // sentence writes "makeup".
  if (word.includes("-")) {
    add(word.replace(/-/g, ""));
    for (const piece of word.split("-")) add(piece);
  }
  // dependence and dependency are the same noun with two endings, and the
  // gloss and the sentence rarely agree on which.
  if (word.endsWith("ence")) add(`${word.slice(0, -4)}ency`);
  if (word.endsWith("ency")) add(`${word.slice(0, -4)}ence`);
  if (word.endsWith("ance")) add(`${word.slice(0, -4)}ancy`);
  if (word.endsWith("ancy")) add(`${word.slice(0, -4)}ance`);
  // And the same journey backwards, so a plural gloss meets a singular
  // sentence: "shoes" is shown by "shoe".
  if (word.endsWith("ies")) add(`${word.slice(0, -3)}y`);
  if (word.endsWith("es")) add(word.slice(0, -2));
  if (word.endsWith("s")) add(word.slice(0, -1));
  if (word.endsWith("ing")) { add(word.slice(0, -3)); add(`${word.slice(0, -3)}e`); }
  if (word.endsWith("ed")) { add(word.slice(0, -2)); add(word.slice(0, -1)); }
  return shapes;
}

/**
 * The meanings a gloss claims, each as the words that carry it.
 *
 * A gloss lists its alternatives with slashes, commas or "or", and qualifies
 * itself in brackets: "to push / shove", "bill or invoice", "together (in one
 * place)". Every alternative is a sense the example may legitimately show.
 */
function glossSenses(gloss) {
  const senses = [];
  const parts = String(gloss)
    .toLocaleLowerCase("en")
    .replace(/\([^)]*\)/g, " ")
    .split(/[,;/]|\bor\b/);
  for (const part of parts) {
    const all = part.split(/[^a-z'-]+/).filter(Boolean);
    const carrying = all.filter((word) => word.length > 1 && !FUNCTION_WORDS.has(word));
    // "to be" and "the one" carry their meaning in the very words this would
    // throw away, so an emptied sense keeps what it started with.
    const words = carrying.length > 0 ? carrying : all.filter((word) => word !== "to");
    if (words.length > 0) senses.push(words);
  }
  return senses;
}

/** The words of an English sentence, with the possessive 's taken off. */
function englishTokens(sentence) {
  const tokens = new Set();
  for (const raw of String(sentence).toLocaleLowerCase("en").split(/[^a-z'-]+/)) {
    if (!raw) continue;
    tokens.add(raw);
    tokens.add(raw.replace(/'(s|re|ve|ll|d|m)$/, ""));
    for (const piece of raw.split("-")) if (piece) tokens.add(piece);
  }
  tokens.delete("");
  return tokens;
}

/**
 * Particles carry no meaning on their own, so a sense that ends in one has to
 * turn up whole: "to come across" is not shown by a sentence that merely says
 * "come", and certainly not by one that says "after".
 */
const PARTICLES = new Set([
  "across", "after", "along", "apart", "around", "aside", "away", "back",
  "down", "forward", "into", "off", "onto", "out", "over", "through",
  "together", "under", "up", "upon", "about",
]);

/**
 * Verbs so general that matching one proves nothing. "to take a course" is
 * not shown by a sentence that merely says "take".
 */
const WEAK_HEADS = new Set([
  "take", "get", "make", "put", "have", "be", "do", "go", "come", "give",
  "keep", "let", "set", "run", "turn", "look", "feel", "become", "hold",
  "thing", "way", "one", "kind", "sort", "bit",
]);

/**
 * Does this English sentence show any of these senses?
 *
 * English compounds put the meaning last — a "female friend" is a friend, a
 * "tax return" is a return — so the head word is what usually has to appear.
 * But the modifier carries it often enough that the head alone is too strict:
 * "penalty kick" is shown by "that was a clear penalty", "to leave an
 * organisation" by "you can leave at the registry office". So the first word
 * counts too, unless it is one of the do-everything verbs that would match
 * any sentence at all.
 */
function sentenceShowsSense(senses, englishSentence) {
  const present = englishTokens(englishSentence);
  const shows = (word) => {
    for (const shape of wordShapes(word)) if (present.has(shape)) return true;
    return false;
  };
  for (const sense of senses) {
    if (sense.length === 1) {
      if (shows(sense[0])) return true;
      continue;
    }
    // A particle at the end is sometimes the whole meaning and sometimes
    // just emphasis. "come across" is a different verb from "come", but "to
    // charge up" is what "charge my phone" does. The difference is whether
    // the verb in front carries meaning on its own: the do-everything verbs
    // need their particle, the specific ones do not.
    if (PARTICLES.has(sense[sense.length - 1])) {
      if (sense.every(shows)) return true;
      if (WEAK_HEADS.has(sense[0])) continue;
      if (sense.filter((word) => !PARTICLES.has(word)).every(shows)) return true;
      continue;
    }
    if (shows(sense[sense.length - 1])) return true;
    if (!WEAK_HEADS.has(sense[0]) && shows(sense[0])) return true;
  }
  return false;
}

/** Does the English sentence show the meaning this gloss states? */
function exampleShowsGloss(gloss, englishSentence) {
  return sentenceShowsSense(glossSenses(gloss), englishSentence);
}

/**
 * Is the sentence about a different verb wearing this one's letters?
 *
 * German sends the prefix of a separable verb to the end of the clause, so
 * "Wann stoßen wir auf den neuen Job an?" contains the word stoßen and means
 * anstoßen, to raise a glass. Matching by token alone cannot tell, and the
 * card that came out of it glossed stoßen as "to push" and illustrated it
 * with people toasting a new job.
 *
 * Two things have to hold before we say so, and together they make this
 * accurate enough to act on: the prefix must come AFTER the verb, which is
 * where a separated prefix goes and where a preposition governing a noun does
 * not — "lass uns an den See fahren" is safe — and the joined-up verb must be
 * a word we actually teach, so the guess is checked against our own glossary.
 */
const SEPARABLE_PREFIXES = [
  "ab", "an", "auf", "aus", "bei", "durch", "ein", "fest", "her", "hin", "los",
  "mit", "nach", "um", "vor", "weg", "zu", "zurück", "zusammen", "über",
  "raus", "rein", "rüber", "runter", "hoch", "fort", "frei", "vorbei", "statt",
];

function showsADifferentVerb(headword, germanSentence, knows) {
  const bare = String(headword).trim().toLocaleLowerCase("de-DE");
  if (!/^[a-zäöüß]{3,}n$/.test(bare)) return false;
  const tokens = String(germanSentence)
    .toLocaleLowerCase("de-DE")
    .split(/[^\p{L}ß]+/u)
    .filter(Boolean);
  const verbAt = tokens.indexOf(bare);
  if (verbAt < 0) return false;
  for (let index = verbAt + 1; index < tokens.length; index += 1) {
    if (!SEPARABLE_PREFIXES.includes(tokens[index])) continue;
    if (knows(tokens[index] + bare)) return true;
  }
  return false;
}

/**
 * How well does this example serve the card? Lower is better.
 *
 *   0  shows the meaning printed on the card
 *   1  shows another meaning the gloss itself lists
 *   2  shows the word, but its English never says so
 *   3  is not this word at all — a separable verb that only looks like it
 *
 * Rank 0 outranks the separable-verb test on purpose: "Zieh den Stecker raus"
 * is rausziehen, and it still shows you what ziehen means, because the English
 * says "pull". Rank 1 does not get that protection — it was rank 1 that let
 * "Wir ziehen Ende des Monats um" onto the card for ziehen, glossed "to pull",
 * on the strength of a second authored sense the card never prints.
 *
 * There was another rank 3 here once, for a lower-case headword found
 * capitalised mid-sentence — German capitalises nouns, so that is the noun and
 * not the verb. It was deleted: "beim Grinden", "zum Braten" and "das Pendeln"
 * are the verb itself doing duty as a noun and illustrate it perfectly, while
 * the impostors it was meant to catch — Erben the heirs, Haken the catch —
 * fail the English test anyway, and on better evidence.
 */
function exampleRank({ cardGloss, fullGloss, de, en, headword, knows }) {
  if (sentenceShowsSense(glossSenses(cardGloss), en)) return 0;
  if (knows && headword && showsADifferentVerb(headword, de, knows)) return 3;
  if (fullGloss && fullGloss !== cardGloss && sentenceShowsSense(glossSenses(fullGloss), en)) return 1;
  return 2;
}

module.exports = {
  exampleShowsGloss,
  exampleRank,
  showsADifferentVerb,
  glossSenses,
  sentenceShowsSense,
  englishTokens,
  wordShapes,
};
