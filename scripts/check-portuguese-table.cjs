#!/usr/bin/env node
/**
 * The Portuguese table, held to the rule it is being written under.
 *
 * WHY THIS EXISTS. Portuguese is the one language in the catalogue with two
 * standard written varieties in daily use, and this course teaches the
 * European one. That is not a preference: a table half in one variety and half
 * in the other teaches a learner to switch mid-sentence, and they cannot hear
 * that they are doing it. The failure is quiet — every line looks like correct
 * Portuguese, because every line IS correct Portuguese, somewhere else.
 *
 * It is also the easiest rule in the file to break by accident. Brazilian
 * forms are what most reference material and most training data reach for
 * first, so trem, ônibus, sorvete and café da manhã arrive without anybody
 * deciding to write them. So they are listed below and the build refuses them.
 *
 * WHAT IS DELIBERATELY NOT LISTED. A word that exists in both varieties proves
 * nothing about which one was being written, so it cannot be evidence:
 *   banheiro   is a lifeguard in Portugal;
 *   cachorro   is a puppy, and half of cachorro-quente;
 *   grama      is the unit of mass;
 *   senha      is the ticket you take to join a queue;
 *   tela       is the canvas a painting is on;
 *   arquivo    is an archive;
 *   menina     is an ordinary word for a girl, and a polite address;
 *   entender, dirigir, moto, parada, cinza, biscoito — all everyday European
 *   Portuguese with meanings of their own.
 * Each of those was considered and left out. A gate that cries wolf gets
 * ignored, and then it protects nothing.
 *
 * THE PROGRESSIVE is the one structural marker worth pinning. European
 * Portuguese says estar a + infinitive where Brazilian says estar + gerund, so
 * "estou a fazer" and not "estou fazendo". A word list cannot catch that,
 * because every word in "estou fazendo" is a European Portuguese word.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const FILES = ["src/lib/portugueseTranslations.ts", "src/lib/portugueseAdvancedTranslations.ts"];

const pairs = [];
for (const file of FILES) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of source.matchAll(/^ {2}"((?:[^"\\]|\\.)*)": "((?:[^"\\]|\\.)*)",$/gm)) {
    pairs.push({ german: match[1], portuguese: match[2], file });
  }
}

const failures = [];
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures.push(what); }
}

check(`the table parses and has entries (${pairs.length.toLocaleString("en-GB")})`, pairs.length > 2000);

/**
 * No German key answered twice — across BOTH files, because the main table
 * spreads the advanced one into itself. A key written in both would take the
 * main file's reading and drop the other silently, which is the one kind of
 * duplicate nobody would ever see.
 */
const seen = new Map();
const repeated = [];
for (const { german, file } of pairs) {
  if (seen.has(german)) repeated.push(`${german} (${seen.get(german)} and ${file})`);
  else seen.set(german, file);
}
check(`no German key appears twice${repeated.length ? ` — ${repeated[0]}` : ""}`, repeated.length === 0);

// ── nothing empty, nothing left as the German ──────────────────────────────
const blank = pairs.filter((row) => !row.portuguese.trim());
check(`no card has an empty Portuguese side${blank.length ? ` — ${blank[0].german}` : ""}`, blank.length === 0);

/**
 * An umlaut or an ß on the Portuguese side almost always means a line was
 * never translated. Two things are allowed to carry one.
 *
 * Names, because Portuguese does not respell them — Herr Müller stays Herr
 * Müller — and the offices keep the name written on the door, since that is
 * the word somebody has to say at the counter.
 *
 * And the regional greetings, which the card is ABOUT: the pack teaches that
 * the north says Moin and Bavaria says Servus, so a line that translated them
 * away would have nothing left to teach. The greeting stays German and the
 * sentence around it is Portuguese.
 */
const PROPER_NAMES = [
  "Müller", "Schröder", "Grün", "Björn", "Jürgen", "Günther", "Käthe",
  "München", "Köln", "Düsseldorf", "Nürnberg", "Zürich", "Österreich",
  // Where a German place has a Portuguese name this table uses it — Colónia,
  // Munique, Zurique, Hamburgo. Where it has none, the German name stands,
  // which is also what is written on the platform sign.
  "Göttingen",
  // The offices and the schemes, which keep the name written on the door or
  // on the form. Somebody applying for BAföG says BAföG, in any language.
  "Bürgeramt", "Bürgerbüro", "Ausländerbehörde", "Straße", "Goethestraße",
  "TÜV", "BAföG",
  // The federal states, because half the rules in this course depend on which
  // one you are standing in — the property tax, the dog insurance, the school
  // holidays — and there is no Portuguese unit that maps onto one.
  "Bundesland", "Bundesländer",
  // And the things on the counter that only have a German name. The card
  // about Leberkäse is a joke about the word itself — it contains neither
  // liver nor cheese — so translating the word away takes the card with it.
  "Leberkäse",
  // And the products sold over a German counter under a German name. The
  // postal tiers are prices on a sign at the post office: asking for an
  // Übergabe-Einschreiben by any other name gets you a blank look, and there
  // is no Portuguese service to borrow a name from.
  "Kompaktbrief", "Einwurf-Einschreiben", "Übergabe-Einschreiben",
  // The carnival pack turns on two shouts and one beer. Kölle Alaaf is what
  // Cologne shouts, in Cologne dialect, and the card next to it says shouting
  // the other city's word gets you cut off from the Kölsch. Give either of
  // them a Portuguese form and the rule they teach stops existing. The city
  // itself is still Colónia in the sentence around them.
  "Kölle", "Kölsch",
  // And one word that is quoted rather than used. The card asks how you say
  // fridge in German, so der Kühlschrank is the answer to the question — the
  // Portuguese is the sentence around it, exactly as with the Bürgeramt.
  "Kühlschrank",
];
const KEPT_GREETINGS = ["Grüß dich", "Grüß Gott", "Grüezi", "Tschüss", "Tschüs"];
/**
 * And the formulas a German letter ends with, for the same reason: the pack
 * teaches which one to sign off with and how much warmth each carries, so the
 * formula has to appear as it will be typed. Mit freundlichen Grüßen is the
 * card — a Portuguese rendering of it would be a different card.
 */
const KEPT_FORMULAS = ["Mit freundlichen Grüßen", "Mit besten Grüßen", "Viele Grüße"];
/**
 * And the German words this course quotes AS words. The pack on translation
 * argues that gemütlich does not go over into another language, and the only
 * way to make that argument is to put gemütlich in the sentence. Replacing it
 * with a Portuguese word would refute the card it appears on.
 */
const QUOTED_AS_WORDS = [
  "Gemütlich", "gemütlich",
  // And the reference-letter code, which is a set of German phrases that mean
  // the opposite of what they say. Er bemühte sich looks like praise and means
  // he never managed it — a card that translated the phrase would be handing
  // the reader the answer instead of the trap.
  "Er bemühte sich", "Er war stets bemüht", "Stets bemüht",
  // And the opening line of a German resignation letter, for the same reason
  // as the sign-off formulas: the card is teaching what to type, and two
  // sentences of it are the whole letter.
  "Hiermit kündige ich fristgerecht zum",
];
/**
 * Street names are not worth listing one at a time. Anything ending in
 * -straße is an address, and an address is read out as it is written —
 * Gartenstraße acht is Gartenstraße oito.
 */
const STREET = /\b[A-ZÄÖÜ][\wäöüß-]*straße\b/g;
const stillGerman = pairs.filter((row) => {
  let rest = row.portuguese.replace(STREET, " ");
  for (const name of [...PROPER_NAMES, ...KEPT_GREETINGS, ...KEPT_FORMULAS, ...QUOTED_AS_WORDS]) rest = rest.split(name).join(" ");
  return /[äöüßÄÖÜ]/.test(rest);
});
check(`no Portuguese line still carries an umlaut${stillGerman.length ? ` — "${stillGerman[0].portuguese}"` : ""}`,
  stillGerman.length === 0);

/**
 * Forms that are Brazilian and are not European Portuguese.
 *
 * High-frequency words only, and only ones with no European meaning of their
 * own — see the note at the top of this file for the ones deliberately left
 * out and why.
 */
const BRAZILIAN_ONLY = [
  // everyday nouns
  "trem", "ônibus", "sorvete", "geladeira", "xícara", "açougue", "aluguel",
  "aposentadoria", "sobrenome", "aplicativo", "cardápio", "garçom", "bebê",
  "mamãe", "papai", "maquiagem", "banheira de gelo",
  // colours and numbers
  "marrom", "dezesseis", "dezessete", "dezenove", "quatorze",
  // spellings Portugal does not use
  "bilíngue", "econômico", "gênero", "tênis", "acadêmico", "fenômeno",
  "polêmica", "eletrônico", "quilômetro", "anônimo", "ônus", "cômodo",
];
const MULTI_WORD = ["café da manhã", "carteira de motorista", "ponto de ônibus"];

const leaked = [];
for (const { german, portuguese } of pairs) {
  const lower = portuguese.toLocaleLowerCase("pt-PT");
  const words = lower.split(/[^a-zà-öø-ÿ]+/u);
  for (const word of BRAZILIAN_ONLY) {
    if (words.includes(word)) leaked.push(`${german} → "${portuguese}" (${word})`);
  }
  for (const phrase of MULTI_WORD) {
    if (lower.includes(phrase)) leaked.push(`${german} → "${portuguese}" (${phrase})`);
  }
}
check(`no Portuguese line uses a Brazilian form${leaked.length ? ` — ${leaked[0]}` : ""}`, leaked.length === 0);

/**
 * The progressive: estar a + infinitive, never estar + gerund.
 *
 * Restricted to estar, because that is where the two varieties actually part.
 * Portuguese uses the gerund freely elsewhere — "continuou, dizendo que…" is
 * ordinary — and flagging every -ndo would refuse correct lines.
 */
const PROGRESSIVE = /\b(?:estou|estás|está|estamos|estão|estava|estavas|estávamos|estavam|estive|esteve|estarei|estará|estaremos)\s+(?:\w+\s+)?(\w+(?:ando|endo|indo))\b/gi;
/**
 * Words that end like a gerund without being one. Portuguese has a handful
 * and they sit in ordinary sentences: o comando is the television remote, and
 * quando is quando. Without this, "Onde está o comando?" would be refused as
 * a Brazilian progressive, which it is not — there is no verb in it at all.
 */
const NOT_A_GERUND = new Set([
  "quando", "comando", "bando", "brando", "tremendo", "estupendo", "horrendo", "reverendo",
]);
const brazilianProgressive = pairs.filter((row) => {
  for (const match of row.portuguese.matchAll(PROGRESSIVE)) {
    if (!NOT_A_GERUND.has(match[1].toLocaleLowerCase("pt-PT"))) return true;
  }
  return false;
});
check(
  `the progressive is estar a + infinitive${brazilianProgressive.length ? ` — "${brazilianProgressive[0].portuguese}"` : ""}`,
  brazilianProgressive.length === 0
);

/**
 * The packs that teach the German writing system stay out of this table.
 *
 * Part 141 is "Alt plus 0228 types ä" and "the letter ß exists only in
 * German"; part 330 is the telephone spelling alphabet, A wie Anton, and what
 * to do about umlauts when the keyboard has none. Both are lessons about how
 * German is written, and a Portuguese course has no use for either — the
 * learner is not going to be spelling their name into a German telephone in
 * Portuguese.
 *
 * The narrowing drops whatever this table does not answer, so the way to keep
 * them out of the course is simply never to translate them. That is a decision
 * somebody can undo by accident on a later pass, working through the
 * curriculum in order and translating what comes next — which is why it is
 * pinned here rather than left as a note.
 *
 * ONLY THE SENTENCES. Part 330 also teaches der Buchstabe, der Punkt and das
 * Leerzeichen, which are ordinary words a Portuguese speaker has every use
 * for, and buchstabieren is a verb like any other. It is the phrases that are
 * about German — "Mit Alt plus 0228 tippe ich ä" — so only the phrases are
 * refused. Part 141 has no seed words at all, so nothing of it survives.
 *
 * Cards a Portuguese speaker really does need about German life — Bürgeramt,
 * Pfand, Anmeldung — are in other packs and this rule does not touch them.
 */
const EXCLUDED_PACKS = { part141: "src/lib/data.ts", part330: "src/lib/expansionPacks.ts" };
const excluded = new Set();
for (const [id, file] of Object.entries(EXCLUDED_PACKS)) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const from = source.indexOf(`\n  ${id}: {`);
  if (from < 0) {
    check(`the excluded pack ${id} is still where this expects it`, false);
    continue;
  }
  const after = source.slice(from + 1);
  const next = after.search(/\n {2}(part\d+|cb-[a-z-]+): \{/);
  const block = next < 0 ? after : after.slice(0, next);
  // The seed words are ordinary vocabulary; it is the sentences that are
  // about how German is written.
  const phrases = block.indexOf("phrases:");
  if (phrases < 0) continue;
  for (const m of block.slice(phrases).matchAll(/\bde:\s*"((?:[^"\\]|\\.)*)"/g)) excluded.add(m[1]);
}
check(`the excluded packs were found and read (${excluded.size} sentences)`, excluded.size > 30);

/**
 * And the single cards, scattered through packs this course otherwise keeps.
 *
 * Two whole packs could be refused by name above. These cannot: they sit
 * inside packs full of cards a Portuguese speaker wants, and only the
 * individual line is dead. Left as a note they would be translated on the
 * next pass through the curriculum by somebody working in order, so they are
 * listed here and the build refuses them.
 *
 * THE GERMAN ARTICLE. Der Kühlschrank — der, nicht das is a lesson in German
 * gender and nothing else. There is no Portuguese in it to write.
 *
 * THE ENGLISH TRAPS. The rest are word-forms that catch English speakers and
 * nobody else. Gift is a present in English and poison in German; eventuell
 * looks like eventually; bekommen looks like become; sensibel looks like
 * sensible. Portuguese has none of those look-alikes — there is no become and
 * no sensible — so the card explains a mistake the learner was never going to
 * make, and the joke lands on nobody. Cards about German words being hard to
 * carry into English are a different thing and are kept: gemütlich really is
 * hard to carry, and that is a fact about German.
 */
const NOT_FOR_PORTUGUESE = new Set([
  // part57 — the German article, asked as a quiz with no Portuguese answer.
  // Only the standalone card. Two more sentences of this pack were once listed
  // here and are not any more: they are the middle of a conversation, and
  // taking them out left the partner praising an answer nobody had given. A
  // dialogue is carried whole or not at all, so they went back in — see the
  // note beside them in the table.
  "Der, die oder das?",
  // part174 — Gift and eventuell, traps for English speakers
  "Eventuell? Also ja oder nein?",
  "Wahrscheinlich ja! Eventuell heißt vielleicht, oder?",
  "Genau. Auf Englisch klingt es nur ganz anders.",
  "Ich habe ein Gift für dich!",
  "Ein Gift?! Du meinst hoffentlich ein Geschenk.",
  "Oh nein. Gift heißt Poison, stimmt's?",
  "Stimmt. Das Geschenk nehme ich trotzdem gern.",
  // part317 — bekommen against become, sensibel against sensible
  "Bekommen heißt nicht become, sondern to get.",
  "Ich verwechsle ständig sensibel und sensible.",
  "Ich möchte ein Steak bekommen — sagt man das so?",
  "Ja. Aber sag bloß nicht: I become a steak.",
  "Warum? — Oh. Weil become werden heißt.",
  "Genau. Klassischer falscher Freund.",
]);
/**
 * A list of sentences protects nothing if one of them has a typo in it, or if
 * a card gets reworded upstream — the entry would quietly stop matching and
 * the card would slip back into the course with nobody noticing. So each one
 * is looked for in the curriculum first, and the build says which is missing.
 */
const curriculum = [
  fs.readFileSync(path.join(root, "src/lib/data.ts"), "utf8"),
  fs.readFileSync(path.join(root, "src/lib/expansionPacks.ts"), "utf8"),
].join("\n");
const vanished = [...NOT_FOR_PORTUGUESE].filter((german) => !curriculum.includes(`"${german}"`));
check(
  `every excluded card still exists to be excluded${vanished.length ? ` — ${vanished[0]}` : ""}`,
  vanished.length === 0
);
for (const german of NOT_FOR_PORTUGUESE) excluded.add(german);

const shouldNotBeHere = pairs.filter((row) => excluded.has(row.german));
check(
  `no card this course leaves out is translated${shouldNotBeHere.length ? ` — ${shouldNotBeHere[0].german}` : ""}`,
  shouldNotBeHere.length === 0
);

if (failures.length) {
  console.error(`\n${failures.length} Portuguese table problem${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

const distinct = new Set(pairs.map((row) => row.portuguese)).size;
console.log(
  `\ncheck-portuguese-table: ${pairs.length.toLocaleString("en-GB")} entries, `
  + `${distinct.toLocaleString("en-GB")} distinct Portuguese lines — European throughout.`
);
