#!/usr/bin/env node
/**
 * What is still German inside a Portuguese sentence, and should not be.
 *
 * This is a tool, not a gate. It is deliberately NOT named check-*, because it
 * asks a question no build can answer: whether a card is ABOUT Germany. A card
 * about the Bürgeramt keeps every German word in it. A card about buying a
 * train ticket does not, even though both say the same words. Only a person
 * can tell those apart, so this prints the evidence and a person decides.
 *
 * The rules it CAN decide are pinned next door in check-portuguese-table.cjs,
 * which refuses a German given name on the Portuguese side and refuses a
 * second Portuguese answer for a word that already has one. This script is how
 * you find the next batch to send there.
 *
 *   node scripts/portugal-audit.cjs              everything still German
 *   node scripts/portugal-audit.cjs --word Bier  every answer one word got
 *   node scripts/portugal-audit.cjs --rivals     words with two answers in use
 *
 * WHY IT EXISTS. The course was translated before the rule existed that a card
 * not about Germany should carry Portuguese things, so roughly twenty thousand
 * cards were written under the old assumption. Reading them all again is not
 * the way to find the leftovers; this narrows twenty thousand to a few dozen.
 *
 * The first pass found something the rule had not anticipated: the table was
 * answering one German word with several Portuguese ones. The same woman was
 * Anna in eleven cards and Ana in three. A Brötchen was a pãozinho, a
 * papo-seco, a pão and a sandes. Every line was correct on its own. So --word
 * exists, and it is the more useful half of this tool.
 *
 * WHAT IS NOT HERE, AND WHY. The obvious next step is to do that sweep
 * automatically: take every word card, find the sentences using its noun, and
 * report where the sentence does not use the word card's answer. That was
 * written and thrown away. Over the whole table it reports 323 words, and
 * nearly every one is correct: kein Problem is não faz mal, panische Angst is
 * pavor, an der Quelle is na nascente rather than na fonte, and zwei Kaffee is
 * dois cafés, which a search for the singular cannot see. The signal was
 * perhaps one real fault in fifty, and a list like that gets skimmed once and
 * never again.
 *
 * --rivals is that idea with the noise taken out. It only speaks when there is
 * a RIVAL: a second Portuguese word used at least three times for the same
 * German word. An idiom appears once; a translation that has drifted appears
 * again and again. That is what separated creche from infantário, twelve cards
 * to nine, and it found that nobody says felicitação and that the box says
 * pizza. Read the ones where EVERY sentence disagrees with the word card
 * first — those were two real faults out of six.
 *
 * It still finds plenty that is simply polysemy, and that is expected rather
 * than a defect: die Uhr is a relógio and also the o'clock in às sete horas,
 * das Rad is a wheel and a bicycle, ein Stau is an engarrafamento but you are
 * preso no trânsito. The tool cannot tell those from a drift. A person can.
 *
 * A NOTE ON WORD EDGES. A regular expression \b is no use over German text.
 * JavaScript defines a word character as [A-Za-z0-9_], so every umlaut and ß
 * is a word BREAK: \bben\b matches inside üben, and the first version of this
 * search reported the name Ben in thirty-three cards, of which one was a name.
 * Every match below spells its edges out against a Unicode letter class.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const TABLES = [
  "src/lib/portugueseTranslations.ts",
  "src/lib/portugueseAdvancedTranslations.ts",
];

const source = TABLES.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
const pairs = [];
for (const m of source.matchAll(/^ {2}"((?:[^"\\]|\\.)*)": "((?:[^"\\]|\\.)*)",$/gm)) {
  pairs.push({ german: m[1], portuguese: m[2] });
}

const edge = (word) => new RegExp(`(?<![\\p{L}])${word}(?![\\p{L}])`, "u");

/**
 * Which pack a card sits in, and whether that pack is about Germany.
 *
 * This is the part that keeps the audit honest. Read on its own, "Wartet der
 * Anschluss in Hannover?" looks like an ordinary question about a connecting
 * train and Hannover looks like a name to swap. It is not: the pack around it
 * also teaches the Deutschlandticket, the ICE and the fine for riding without
 * a ticket, so the whole pack is about German transport and its places stay
 * German. One line cannot be judged without the pack it belongs to.
 */
/**
 * Every file that defines packs, found rather than listed: a hand-written list
 * goes stale the first time somebody adds a file, and a card whose pack cannot
 * be found is reported as generic — which is the wrong way round for a tool
 * whose whole job is to say when a card is allowed to keep its German.
 */
const DEFINES_PACKS = /^ {2}"?part\d+"?: [{[]/m;
const ABOUT_GERMANY = new RegExp(
  [
    // transport
    "Deutschlandticket", "\\bICE\\b", "Alexanderplatz", "Autobahn", "Bundesstraße",
    "Beförderungsentgelt", "Entwerter", "Schienenersatzverkehr", "Deutsche Bahn",
    // offices, money, work
    "Bürgeramt", "Anmeldung", "Krankenkasse", "Schufa", "Minijob", "Steuerklasse",
    "Rundfunkbeitrag", "Hundesteuer", "Elternzeit", "Elterngeld", "Kindergeld",
    "BAföG", "Azubi", "Meisterbrief",
    // school, which is a German system end to end
    "Gymnasium", "Realschule", "Gesamtschule", "Abitur", "Einschulung", "Schultüte",
    // the year, the street, the table
    "Karneval", "Rosenmontag", "Alaaf", "Helau", "Fasching", "Bundesliga",
    "Kfz-Kennzeichen", "\\bNRW\\b", "Kehrwoche", "Hausordnung", "Schrebergarten",
    "Biergarten", "Stammtisch", "Volksfest", "Brotzeit", "Abendbrot", "Pfand",
  ].join("|")
);

/**
 * And the words that are not German at all, however German the spelling looks
 * to a search. A brand keeps its name in every language, an abbreviation is an
 * abbreviation, and an English loanword the German card already borrowed was
 * never translated in the first place. Reporting these would bury the real
 * finds, and a tool that cries wolf gets ignored — the same reason the
 * Brazilian word list next door leaves out banheiro and cachorro.
 */
const NOT_ACTUALLY_GERMAN = new Set([
  "WhatsApp", "Instagram", "Telegram", "Steam", "Twitch", "YouTube", "Netflix",
  "LinkedIn", "Tinder", "Insta", "ChatGPT", "Claude", "Linux", "Siemens",
  "Mario", "Kart", "Godot", "Tourette", "Alive", "Stayin", "Dinner", "Modell",
  "IBAN", "PIN", "PDF", "SIM", "ETF", "QR", "SSD", "FPS", "HUD", "AFK", "DLC",
  "DM", "One", "Early", "Access",
]);

const packs = [];
for (const file of fs.readdirSync(path.join(root, "src/lib")).filter((f) => f.endsWith(".ts"))) {
  const text = fs.readFileSync(path.join(root, "src/lib", file), "utf8");
  if (!DEFINES_PACKS.test(text)) continue;
  const starts = [...text.matchAll(/\n {2}"?(part\d+|cb-[a-z-]+)"?: [{[]/g)];
  for (let i = 0; i < starts.length; i++) {
    const to = i + 1 < starts.length ? starts[i + 1].index : text.length;
    packs.push({ file, id: starts[i][1], body: text.slice(starts[i].index, to) });
  }
}
function placeOf(german) {
  const pack = packs.find((p) => p.body.includes(german));
  if (!pack) return { where: "(pack not found)", german: false };
  const mark = pack.body.match(ABOUT_GERMANY);
  return { where: `${pack.file} ${pack.id}`, german: Boolean(mark), mark: mark && mark[0] };
}

// ── one word, every answer it was given ────────────────────────────────────
const wordFlag = process.argv.indexOf("--word");
if (wordFlag !== -1) {
  const word = process.argv[wordFlag + 1];
  if (!word) {
    console.error("usage: node scripts/portugal-audit.cjs --word <German word>");
    process.exit(2);
  }
  const hits = pairs.filter((row) => edge(word).test(row.german));
  console.log(`${word}: ${hits.length} card(s)\n`);
  for (const row of hits) {
    const pack = placeOf(row.german);
    console.log(`  ${pack.german ? "GERMAN " : "generic"}  ${row.german}`);
    console.log(`            ${row.portuguese}`);
  }
  process.exit(0);
}

// ── one German word, two Portuguese answers, both in use ───────────────────
if (process.argv.includes("--rivals")) {
  // Portuguese words too common to be anybody's translation of anything.
  const STOP = new Set(
    ("o a os as um uma uns umas de do da dos das em no na nos nas por para com sem que se e ou mas não sim já ainda muito mais menos"
      + " é são está estão ser estar tem têm ter vai vão foi era como quando onde quem qual isso isto aquilo eu tu ele ela nós eles elas"
      + " meu minha teu tua seu sua nosso nossa lhe me te nos lá cá aqui ali bem mal também só depois antes agora hoje amanhã ontem"
      + " faz fazer fez pode podem posso quer quero vou vamos vem dia dias ano anos casa coisa coisas gente pessoa favor").split(/\s+/)
  );
  const words = (s) =>
    (s.toLowerCase().match(/[\p{L}][\p{L}-]{3,}/gu) || []).filter((w) => !STOP.has(w));

  const found = [];
  for (const card of pairs) {
    // With or without the article: Kita is a word card too, and the first
    // version of this missed it for having no der/die/das in front.
    const m = /^(?:(?:der|die|das) )?([\p{Lu}][\p{L}]+)$/u.exec(card.german);
    if (!m) continue;
    const answer = card.portuguese.replace(/^(?:o|a|os|as|um|uma) /, "");
    if (/\s/.test(answer) || answer.length < 4) continue;

    const uses = pairs.filter((r) => r.german !== card.german && edge(m[1]).test(r.german));
    if (uses.length < 6) continue;
    const without = uses.filter((r) => !edge(answer).test(r.portuguese));
    if (without.length < 3) continue;

    const tally = new Map();
    for (const r of without) for (const w of new Set(words(r.portuguese))) tally.set(w, (tally.get(w) || 0) + 1);
    const [rival, n] = [...tally].sort((a, b) => b[1] - a[1])[0] || [];
    if (!rival || n < 3) continue;
    // A rival that shares a stem is the same word wearing a different ending.
    if (rival.startsWith(answer.slice(0, 4)) || answer.startsWith(rival.slice(0, 4))) continue;
    found.push({ noun: m[1], answer, rival, n, of: uses.length, sample: without.filter((r) => edge(rival).test(r.portuguese)) });
  }

  found.sort((a, b) => b.n / b.of - a.n / a.of);
  for (const r of found) {
    const every = r.n === r.of ? "  <- every one of them" : "";
    console.log(`\n${r.noun}: the card says ${r.answer}, ${r.n} of ${r.of} sentences say ${r.rival}${every}`);
    for (const s of r.sample.slice(0, 2)) console.log(`   ${s.german}\n     ${s.portuguese}`);
  }
  console.log(`\n${found.length} German word(s) with a rival answer used three times or more.`);
  process.exit(0);
}

// ── everything German still standing on the Portuguese side ────────────────
/**
 * Mid-sentence capitals that also appear in the German key. A German noun
 * carried across rather than translated has exactly that shape. A capital at
 * the start of a sentence proves nothing, so sentences are split first.
 *
 * Plenty of what this finds is deliberate — Bürgeramt, TÜV, Kindergeld,
 * Kehrwoche, Stammtisch, and the regional-word packs that exist to teach that
 * a Berliner is a Krapfen is a Pfannkuchen. The count is the signal: a word in
 * one card is worth a look, a word in six is usually a decision somebody made.
 */
const counts = new Map();
for (const row of pairs) {
  for (const piece of row.portuguese.split(/(?<=[.!?:;—])\s+|^/u)) {
    for (const word of (piece.match(/[\p{Lu}][\p{L}]+/gu) || []).slice(1)) {
      if (!row.german.includes(word)) continue;
      if (NOT_ACTUALLY_GERMAN.has(word)) continue;
      if (!counts.has(word)) counts.set(word, []);
      counts.get(word).push(row.german);
    }
  }
}

const rows = [...counts].sort((a, b) => a[1].length - b[1].length);
let generic = 0;
for (const [word, cards] of rows) {
  const pack = placeOf(cards[0]);
  if (pack.german) continue;
  generic++;
  console.log(`${String(cards.length).padStart(3)}  ${word}  —  ${pack.where}`);
  for (const card of cards.slice(0, 2)) console.log(`       ${card}`);
}
console.log(
  `\n${counts.size} German word(s) on the Portuguese side, ${generic} of them in packs`
  + ` that are not about Germany. Those are the ones to look at.`
);
