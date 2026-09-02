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
 * Names, where one survives — see the retired names further down, which is
 * where the question of WHICH name a card should use is settled. This list
 * only says that a name is allowed to carry an umlaut; it does not say the
 * name belongs there. And the offices keep the name written on the door, since
 * that is the word somebody has to say at the counter.
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
  "Göttingen", "Tübingen",
  // The offices and the schemes, which keep the name written on the door or
  // on the form. Somebody applying for BAföG says BAföG, in any language.
  "Bürgeramt", "Bürgerbüro", "Ausländerbehörde", "Straße", "Goethestraße",
  "TÜV", "BAföG",
  // The federal states, because half the rules in this course depend on which
  // one you are standing in — the property tax, the dog insurance, the school
  // holidays — and there is no Portuguese unit that maps onto one.
  "Bundesland", "Bundesländer",
  // And the state-level offices, for the same reason as the federal ones. A
  // Ministerpräsident heads a Bundesland; Portugal has no office that maps
  // onto it, and the person is addressed by the German title whatever language
  // the conversation is in.
  "Ministerpräsident",
  "Oberbürgermeister",
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
  // And the two names in the beer-garden and first-day-of-school packs. Both
  // packs are about Germany end to end — the Stammtisch, the Brezel, the
  // Einschulung — so the names in them stay German, and these are the only two
  // carrying an umlaut or an ß for the check above to trip over.
  "Maß", "Schultüte",
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
  // And one word the course quotes in order to warn about it. The card says
  // that only a particular crowd uses this term, which is the whole lesson.
  // Rendered in Portuguese it would stop being that term and become a neutral
  // description of the press — the opposite of what the card is for.
  "Lügenpresse",
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
  // Adjectives that end the same way and follow estar for entirely innocent
  // reasons. O teu cabelo está lindo is a compliment, not a Brazilian
  // progressive, and findo behaves the same.
  "lindo", "linda", "lindos", "lindas", "findo",
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
 *
 * Part 585 is the third, and it is a capstone conversation rather than a word
 * pack: six lines on whether it is der, die or das Wörterbuch, and on what
 * turns der Tisch into den Tisch. That is German grammar being taught, and
 * Portuguese has neither three genders to guess at nor any cases at all, so
 * there is nothing in it for this course. It is refused whole, the way the
 * note beside the single cards says a dialogue must be carried or dropped.
 */
const EXCLUDED_PACKS = {
  part141: "src/lib/data.ts",
  part330: "src/lib/expansionPacks.ts",
  part585: "src/lib/capstoneDialogues.ts",
};
const excluded = new Set();
for (const [id, file] of Object.entries(EXCLUDED_PACKS)) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  // The word packs write an object, the capstone conversations an array under
  // a quoted key. Both shapes have to be findable by the same pack name.
  const from = Math.max(source.indexOf(`\n  ${id}: {`), source.indexOf(`\n  "${id}": [`));
  if (from < 0) {
    check(`the excluded pack ${id} is still where this expects it`, false);
    continue;
  }
  const after = source.slice(from + 1);
  const next = after.search(/\n {2}"?(part\d+|cb-[a-z-]+)"?: [{[]/);
  const block = next < 0 ? after : after.slice(0, next);
  // In a word pack the seed words are ordinary vocabulary and it is the
  // sentences that are about how German is written, so the search starts at
  // the phrases. A capstone pack has no phrases section and is nothing but
  // the conversation, so the whole block goes.
  const phrases = block.indexOf("phrases:");
  const lines = phrases < 0 ? block : block.slice(phrases);
  for (const m of lines.matchAll(/\bde:\s*"((?:[^"\\]|\\.)*)"/g)) excluded.add(m[1]);
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
  // part29 — the two meanings of one German word. Schwanz is an animal's tail
  // and, of a man, something vulgar, and these cards exist to say so. No
  // Portuguese word carries both, so there is nothing for the lesson to be
  // about. The idioms built on it are NOT here and are translated: den
  // Schwanz einziehen is meter o rabo entre as pernas, and da war kein
  // Schwanz is não estava lá vivalma. Portugal has its own pictures for those.
  "der Schwanz",
  "Bei Tieren ist das Wort völlig neutral.",
  "Und was heißt: Jetzt zieht er den Schwanz ein?",
  "Das heißt, dass er plötzlich zurückweicht.",
  "Und wenn es um einen Mann geht?",
  "Dann kann Schwanz ein vulgäres Wort für Penis sein.",
  "Bei einem Mann ist das Wort Schwanz eine vulgäre Bezeichnung für den Penis.",
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
  // advancedWordPacks2 — the one card in a linguistics pack that is about
  // German rather than about language. Its own note in the pack says the
  // sentence performs the rule it states, and the rule is that a German main
  // clause puts the verb second. Portuguese does not, and a learner of
  // Portuguese has no use for the fact.
  //
  // The rest of that pack is kept and translated, because it is ordinary
  // linguistic vocabulary that any language needs: die Betonung is a tónica,
  // die Wortart is a classe de palavras, die Zeichensetzung is a pontuação.
  // The line is between a word about language and a rule about German.
  "Der deutsche Satzbau stellt das Verb an die zweite Stelle.",
  // phrasebank — two cards about how German is spelled, sitting in a pack that
  // is otherwise about spelling a name aloud in any language. The umlaut and
  // the sharp S exist only in German, so a Portuguese course has nothing to
  // put on the answer side. The cards around them are kept and translated: how
  // do you write your name, how many letters has the alphabet, capital or
  // lower case.
  "Mein Name schreibt sich mit einem Umlaut.",
  "Man schreibt das mit einem scharfen S.",
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
  // The single-card exclusions are not all in the two big pack files. The one
  // about German word order sits in the advanced sentence bank, and without
  // this line the check above would report it as vanished on every build.
  fs.readFileSync(path.join(root, "src/lib/advancedWordPacks2.ts"), "utf8"),
  // And the everyday phrasebank, which holds two of the single-card
  // exclusions of its own.
  fs.readFileSync(path.join(root, "src/lib/phrasebank.ts"), "utf8"),
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

/**
 * ONE GERMAN WORD, ONE PORTUGUESE ANSWER.
 *
 * These two checks exist because the table had already broken both rules
 * before anybody looked. The same woman was Anna in eleven cards and Ana in
 * three, Tom introduced himself as Tom in one line of a conversation and as
 * Tomás in the next, a Brötchen was a pãozinho, a papo-seco, a pão and a
 * sandes, and a Pfand was a depósito seven times and a Pfand once. Every one
 * of those lines was correct Portuguese on its own. Only reading them together
 * showed the learner was being taught two words for one thing.
 *
 * That is exactly the kind of fault that comes back, because each card is
 * written on its own and looks right on its own. So the rules are pinned here
 * rather than merely fixed.
 *
 * A NOTE ON WORD EDGES. \b is no use in this file. JavaScript counts ü as a
 * non-word character, so \bben\b matches inside üben, and a first pass of this
 * work reported the name Ben in thirty-three cards, of which one was a name.
 * The edges have to be spelled out against a Unicode letter class.
 */
const edge = (word) => new RegExp(`(?<![\\p{L}])${word}(?![\\p{L}])`, "u");

/**
 * THE PEOPLE. The course is for Portuguese speakers, so the people in it have
 * Portuguese names, and a German name on the Portuguese side means a card was
 * carried across rather than translated. The rule only bites where the German
 * side names the person too, so an ordinary Portuguese word that happens to
 * look like a German name — o tom, a paul, uma superfície lisa — cannot fail
 * it.
 */
const RETIRED_NAMES = {
  Anna: "Ana",
  Tom: "Tomás",
  Jonas: "João",
  Lena: "Leonor",
  Emma: "Ema",
  Ben: "Bruno",
  Paul: "Paulo",
  Lisa: "Luísa",
  Sabine: "Sofia",
  Klaus: "Carlos",
  Julia: "Joana",
  Berger: "Bernardes",
  Weber: "Ferreira",
  Müller: "Silva",
  Wagner: "Almeida",
  Klein: "Costa",
  Krause: "Rocha",
  Meyer: "Baptista",
  Jana: "Inês",
  Miri: "Bia",
  // A street, for the same reason as the people. Gartenstraße is an address
  // being read out to an ambulance, so it becomes one an ambulance in Portugal
  // could drive to. Goethestraße is NOT here: that card sits in the pack about
  // German transport, next to the Schienenersatzverkehr and the connection at
  // Hannover, and its street stays German with the rest of them.
  Gartenstraße: "Rua do Jardim",
  // The colleague who offers his condolences has a Turkish surname in the
  // German, because that is who a German office holds. The Portuguese course
  // keeps the point and moves it: Semedo is as ordinary in Lisbon as Yilmaz is
  // in Cologne.
  Yilmaz: "Semedo",
};
/**
 * Except in the cards that teach how a German letter is addressed. There the
 * name is part of the German being taught, like the salutation around it, and
 * a Portuguese surname in the middle of Sehr geehrte Frau Doktor would be
 * teaching a form nobody writes.
 */
const KEEPS_ITS_GERMAN_NAME = new Set([
  "Zu Händen Frau Weber — kurz: z. Hd.",
  "Sehr geehrte Frau Doktor Weber — Titel gehören in die Anrede.",
  "Liebe Frau Weber passt, sobald man sich kennt.",
]);
const germanNames = [];
for (const [german, portuguese] of Object.entries(RETIRED_NAMES)) {
  for (const row of pairs) {
    if (KEEPS_ITS_GERMAN_NAME.has(row.german)) continue;
    if (!edge(german).test(row.german)) continue;
    if (!edge(german).test(row.portuguese)) continue;
    germanNames.push(`${german} should be ${portuguese} — ${row.german}`);
  }
}
check(
  `the people in this course have Portuguese names${germanNames.length ? ` — ${germanNames[0]}` : ""}`,
  germanNames.length === 0
);

/**
 * THE THINGS. One German word gets one Portuguese answer, and where a card is
 * allowed a different one the reason is written next to it.
 */
const ONE_ANSWER = [
  {
    german: "Brötchen",
    answer: /papo-seco/,
    unless: {
      "Das Bordbistro hat auch belegte Brötchen.": "a filled roll is a sandes",
      "Welche Brötchen sind noch warm?": "the line before it already named them",
    },
  },
  { german: "Pfand", answer: /depósito/, unless: {} },
  {
    german: "Schnitzel",
    answer: /escalope/,
    unless: {
      "Was gibt es heute? — Schnitzel, wie jeden Donnerstag.":
        "the German canteen, where the dish keeps its name",
    },
  },
  { german: "Brezel", answer: /Brezel/, unless: {} },
  /**
   * A Kita is a creche. Portugal separates the two halves of what one German
   * word covers — a creche takes them to three, an infantário from three to
   * six — and the table had drifted into using both, twelve cards to nine, for
   * the same German word. The word card says creche, so creche it is
   * throughout, and the nursery in the phone call is called Girassol like the
   * other one is called Raio de Sol.
   */
  { german: "Kita", answer: /creche/, unless: {} },
  /**
   * Glückwunsch was a felicitação on its own card and os parabéns in all
   * fourteen sentences that use it, which is the right way round: nobody says
   * felicitação out loud. It could not simply take os parabéns, because das
   * Ständchen had it — in Portugal the birthday song IS os parabéns — so
   * Ständchen moved to a serenata and the everyday word went to the everyday
   * German word.
   */
  { german: "Glückwunsch", answer: /parabéns/, unless: {} },
  // And the spelling of the thing itself: piza on the card, pizza in all eight
  // sentences, and pizza on every box in Portugal.
  { german: "Pizza", answer: /pizza/, unless: {} },
  { german: "Radler", answer: /panaché/, unless: {} },
  { german: "Apfelschorle", answer: /sumo de maçã com água com gás/, unless: {} },
];
const twoAnswers = [];
for (const { german, answer, unless } of ONE_ANSWER) {
  // Case-insensitively: the answer is a word, and a word at the start of a
  // sentence is capitalised. Parabéns! opens fourteen of its own cards, and a
  // case-sensitive test called every one of them a second answer.
  const answers = new RegExp(answer.source, answer.flags.includes("i") ? answer.flags : answer.flags + "i");
  for (const row of pairs) {
    if (!edge(german).test(row.german)) continue;
    if (unless[row.german] || answers.test(row.portuguese)) continue;
    twoAnswers.push(`${german} is not ${answer.source} here — ${row.german}`);
  }
}
check(
  `one German word gets one Portuguese answer${twoAnswers.length ? ` — ${twoAnswers[0]}` : ""}`,
  twoAnswers.length === 0
);

/**
 * THE PLACES.
 *
 * A card that is not about Germany does not send anybody to Berlin. This is
 * the rule the course was written under from the moment it was asked for, and
 * the cards that shipped before it have now been brought into line: a ticket
 * is to Coimbra, a cancelled flight was to Funchal, the polytechnic is in
 * Porto, the cousin nobody has met is from Faro.
 *
 * WHY AN EXPLICIT LIST RATHER THAN A RULE. Whether a card is ABOUT Germany is
 * not a property of the sentence. "Wartet der Anschluss in Hannover?" reads
 * like an ordinary question about a connecting train; it sits in a pack that
 * also teaches the Deutschlandticket, the ICE and the fine for riding without
 * a ticket, so its places stay German with the rest of them. No pattern can
 * see that. Guessing it from the pack was tried — scripts/portugal-audit.cjs
 * still does, for finding candidates — but a guess is not something to fail a
 * build on. So the thirty cards allowed to keep a German place are listed, each
 * having been read, and a thirty-first has to be argued for here.
 */
const GERMAN_PLACES = [
  "Berlim", "Munique", "Hamburgo", "Colónia", "Frankfurt", "Estugarda",
  "Dresden", "Leipzig", "Bona", "Bremen", "Hanôver", "Nuremberga", "Mannheim",
  "Mainz", "Kassel", "Potsdam", "Tübingen", "Göttingen", "Düsseldorf",
  "Baviera", "Renânia", "Vestefália", "Flensburg", "Gartenstraße",
  "Goethestraße", "Alexanderplatz",
];
const KEEPS_ITS_GERMAN_PLACE = new Set([
  // German rail, end to end: the ticket that is not valid on an ICE, the
  // replacement bus, the connection that may or may not wait, the platform
  // announcement. Move one of these to Portugal and the pack teaches nothing.
  "Der ICE nach Berlin fällt heute aus.",
  "Der Anschluss in Mannheim ist knapp, nur acht Minuten.",
  "Wir haben nur acht Minuten in Mannheim.",
  "Ab Göttingen wird es meistens leerer.",
  "Nächster Halt: Alexanderplatz. Ausstieg in Fahrtrichtung rechts.",
  "Einmal nach Köln und zurück, bitte.",
  "Wartet der Anschluss in Hannover?",
  "Wissen Sie zufällig, wo die Goethestraße ist?",
  "Wir müssen in Hannover umsteigen.",
  "Ab Kassel ist Schienenersatzverkehr.",
  "Doch! Ab Potsdam. Um Mitternacht waren wir zu Hause. Aber hey, das Deutschlandticket hat sich gelohnt.",
  "Die Mitfahrgelegenheit nach Berlin kostet fünfzehn Euro.",
  "Wir fahren doch beide jeden Tag nach Mainz.",
  // The German roads, which are named the way German roads are named.
  "A7 Richtung Hamburg, kurz nach der Raststätte.",
  "Wir sind auf der B27, kurz vor der Ausfahrt Tübingen.",
  // Carnival, which is a different festival with a different shout in each
  // city, and the pack is about exactly that difference.
  "In Köln ruft man Alaaf, in Düsseldorf Helau.",
  "Im Rheinland steht die Stadt an Rosenmontag still.",
  "In Bayern heißt das Ganze Fasching.",
  "Der Krapfen mit Senf ist der klassische Streich.",
  "Kommst du am Rosenmontag mit nach Köln? Karneval!",
  "Als Pirat, wie immer. Eine Regel musst du kennen: In Köln rufst du 'Alaaf'. Niemals 'Helau'.",
  "'Helau' ist Düsseldorf. Damit outest du dich sofort — im schlimmsten Fall kriegst du kein Kölsch mehr.",
  "Kölle Alaaf!",
  // The doughnut that is called something different in every region, which is
  // the joke the card is made of. A bola de Berlim is the Portuguese name for
  // the thing, so it names Berlin whichever way round it is read.
  "der Krapfen",
  "der Berliner",
  // The registers a German keeps: the plate that says where a car is from, the
  // state you live in, the points that accumulate in Flensburg, the trophy
  // that goes to Munich.
  "Das Kfz-Kennzeichen ist aus München.",
  "Wir wohnen in NRW.",
  "Punkte kommen nach Flensburg.",
  "Ich habe einen Punkt in Flensburg bekommen.",
  // And the conversation those two sit in, by its name. A letter from
  // Flensburg is not post from a town: it is the notice from the register,
  // and the register is in Flensburg the way the points are.
  "The letter from Flensburg",
  "Die Schale geht dieses Jahr wohl wieder nach München.",
]);
const strayPlaces = pairs.filter(
  (row) =>
    !KEEPS_ITS_GERMAN_PLACE.has(row.german) &&
    GERMAN_PLACES.some((place) => edge(place).test(row.portuguese))
);
check(
  `no card outside Germany sends anybody to a German place${strayPlaces.length ? ` — ${strayPlaces[0].german}` : ""}`,
  strayPlaces.length === 0
);
/**
 * And the list stays honest. An entry for a card that no longer names a place
 * — or no longer exists — reads like a decision somebody made and is not one,
 * which is how an allow-list quietly turns into a place to hide things.
 */
const stalePlaces = [...KEEPS_ITS_GERMAN_PLACE].filter((german) => {
  const row = pairs.find((r) => r.german === german);
  return !row || !GERMAN_PLACES.some((place) => edge(place).test(row.portuguese));
});
check(
  `every card allowed a German place still has one${stalePlaces.length ? ` — ${stalePlaces[0]}` : ""}`,
  stalePlaces.length === 0
);

/**
 * NO CONVERSATION IS HALF TRANSLATED.
 *
 * A dialogue is carried whole or not at all — the note beside the excluded
 * packs says so — but nothing enforced it, and one line of a five-line
 * conversation went out in German for weeks. Nobody reading the app would
 * report that as a hole: it reads as one German line among Portuguese ones,
 * which looks like a card that happens to be in German.
 *
 * It survived because the tool that lists untranslated work paired a card with
 * its article-less form, so "der Hafen" and "Hafen" counted as one. Applied to
 * a sentence that starts with an article, "Das ist, gelinde gesagt,
 * unglücklich formuliert." and "Der ist, gelinde gesagt, unglücklich
 * formuliert." collapse onto the same string, and the translated one vouched
 * for the untranslated one. A tool that can be wrong is exactly why this
 * belongs in the build instead.
 *
 * WHY HALF AND NOT ALL. Requiring every spoken line to have Portuguese would
 * make adding a German conversation conditional on translating it, and turn
 * main red on whoever wrote the German. That is the trade
 * check-translation-coverage refuses in its own header, for good reason, and
 * this file does not get to make it either. A conversation nobody has started
 * translating is ordinary untranslated work. A conversation that is PART
 * translated is the fault: somebody meant to carry it whole and a line was
 * lost on the way.
 *
 * A dialogue line is written with a speaker beside it, which is what tells it
 * apart from a word card, and the lines of one conversation are consecutive.
 */
const SPOKEN = /\{\s*speaker:\s*"[^"]*",\s*de:\s*"((?:[^"\\]|\\.)*)"/g;

/**
 * Is this conversation's name German?
 *
 * The first version of this asked whether the title STARTED with an article,
 * and so passed In der Hausarztpraxis, Klatsch und Tratsch beim Kaffee and a
 * dozen more straight through. A German function word anywhere is the better
 * test, and it is safe here because the string being judged is the SOURCE
 * title: English or German, never Portuguese, so das and de colliding with
 * Portuguese prepositions does not arise.
 *
 * Words that are also English are left out — war, am, in, on, be — because an
 * English title containing one would be asked for a Portuguese name it does
 * not need.
 */
/**
 * This used to ask whether a title was GERMAN, and only then demand a
 * Portuguese name for it. That test was wrong twice over and both times
 * quietly: first it only looked at the FIRST word, so In der Hausarztpraxis
 * and Klatsch und Tratsch beim Kaffee walked past it; widened to a German
 * word anywhere, it still missed Kontakt!, Zockernacht and Verliebt, which
 * contain no function word at all.
 *
 * The question was wrong, not the word list. A conversation the Portuguese
 * course carries is drawn under its title whatever language that title is
 * written in, and the older packs name their scenes in English. So the rule is
 * now the simple one — every carried conversation has a Portuguese name — and
 * there is no list of German words left to keep correct.
 */
const answered = new Set(pairs.map((row) => row.german));
/**
 * And the same keys unescaped, for comparing against titles.
 *
 * pairs holds what the source file says between the quotes, which for a key
 * that quotes somebody still carries its backslashes. The titles below are
 * parsed before they are compared, so they must be compared against parsed
 * keys — otherwise a finished translation of "Wie ist das bei euch?" reads as
 * missing. pairs itself is left alone: every other check on this page compares
 * it against source text that is raw in the same way.
 */
const answeredParsed = new Set(
  [...answered].map((key) => {
    try {
      return JSON.parse(`"${key}"`);
    } catch {
      return key;
    }
  })
);
const halfDone = [];
const germanTitles = [];
let spokenCount = 0;
for (const file of fs.readdirSync(path.join(root, "src/lib"))) {
  if (!file.endsWith(".ts") || /Translations|i18n/.test(file)) continue;
  const text = fs.readFileSync(path.join(root, "src/lib", file), "utf8");
  // One conversation at a time: its title, then the lines: [...] it opens.
  for (const block of text.split(/title: "/).slice(1)) {
    /**
     * The title, escapes and all. Slicing to the first quote cuts a title that
     * quotes somebody in half — Confiding in a friend: "Sie ist fremdgegangen"
     * came back as everything up to the backslash — and the halved string then
     * matches nothing in the table. The value is unescaped too, because the
     * table holds parsed strings: a key written with the backslash still in it
     * never matches what the app looks up.
     */
    const titleMatch = /^((?:[^"\\]|\\.)*)"/.exec(block);
    if (!titleMatch) continue;
    let title = titleMatch[1];
    try {
      title = JSON.parse(`"${title}"`);
    } catch {
      // Leave it as written. A title this cannot parse is one to go and look at.
    }
    const lines = [...block.slice(0, block.indexOf("],")).matchAll(SPOKEN)].map((m) => m[1]);
    if (lines.length < 2) continue;
    spokenCount += lines.length;
    const silent = lines.filter((l) => !answered.has(l) && !excluded.has(l));
    if (silent.length && silent.length < lines.length) {
      halfDone.push(`${silent[0]} (${lines.length - silent.length} of ${lines.length} lines carried)`);
    }
    /**
     * And its name. A conversation reaches the Portuguese course when two of
     * its lines are answered — that is the rule in portugueseCourse.ts — and
     * the title is drawn in a badge above it. One that arrives without a
     * Portuguese name runs under a German heading.
     *
     * Only German titles are asked for. The older packs name their
     * conversations in English, which is a different question and not one this
     * file gets to decide on its own.
     *
     * Counting ANSWERED lines rather than not-silent ones matters: a refused
     * pack's lines are neither answered nor silent, so measuring the gap would
     * have called Der, die oder das a carried conversation and asked for a
     * Portuguese name for the one conversation this course refuses whole.
     */
    const carried = lines.filter((l) => answered.has(l)).length;
    if (carried >= 2 && !answeredParsed.has(title) && !excluded.has(title)) {
      germanTitles.push(title);
    }
  }
}
check(`the course has conversations to check (${spokenCount.toLocaleString("en-GB")} spoken lines)`, spokenCount > 3000);
check(
  `no conversation is half translated${halfDone.length ? ` — ${halfDone[0]}` : ""}`,
  halfDone.length === 0
);
check(
  `every conversation the course carries has a Portuguese name${germanTitles.length ? ` — ${germanTitles[0]}` : ""}`,
  germanTitles.length === 0
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
