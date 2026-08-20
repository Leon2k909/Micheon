#!/usr/bin/env node
/**
 * Tatoeba example sentences, filtered the way they should have been.
 *
 * Micheon used Tatoeba once before and it went badly. The export kept only
 * de, en and level — the sentence ids, the owner and the approval flags were
 * all thrown away — so it could never be re-filtered on quality and there was
 * no record that it ever had been. It shipped 65 sentences spelling "die
 * Einzige" as "die einzige" and taught them as correct German.
 *
 * This does the opposite. Tatoeba publishes exactly the signals needed to
 * tell a good sentence from a bad one, and all of them are used:
 *
 *   deu_sentences_detailed.tsv   id, lang, text, OWNER
 *   user_languages.csv           lang, SKILL LEVEL, username   (5 = native)
 *   users_sentences.csv          username, sentence id, RATING (1 = OK)
 *   deu-eng_links.tsv            which English sentence translates which
 *
 * A sentence has to clear every one of these:
 *
 *   1. it has an owner — orphaned sentences answer to nobody;
 *   2. that owner declares German at native level (5);
 *   3. somebody OTHER than the owner rated it OK — self-rating is not review;
 *   4. nobody rated it badly (-1), however many liked it;
 *   5. its English translation clears 2 and 3 for English as well;
 *   6. it passes our OWN orthography and punctuation rules, the same ones
 *      that caught the 65 bad sentences last time;
 *   7. it fits a hover card and actually contains the word it illustrates.
 *
 * Output goes only to the extension glossary, for the ~3,479 words our own
 * catalogue has no sentence for. The taught course is not touched.
 *
 * Tatoeba is CC BY 2.0 FR, which covers adaptations, so the credit stays.
 *
 * Usage: node scripts/build-tatoeba-examples.cjs <exports-dir>
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = path.resolve(__dirname, "..");
const exportsDir = process.argv[2];
/**
 * How hard to filter.
 *
 * "rated" wants somebody other than the author to have marked the sentence
 * OK. It is the strictest reading of "verified" and it leaves almost nothing:
 * Tatoeba rates only a small fraction of what it holds.
 *
 * "native" drops that one requirement and keeps every other: owned by a
 * declared native on both sides, never objected to, and passed through our
 * own orthography and punctuation rules. That is still far more filtering
 * than the import that went wrong, which did none.
 */
const tier = process.argv[3] === "native" ? "native" : "rated";
if (!exportsDir) {
  console.error("usage: node scripts/build-tatoeba-examples.cjs <exports-dir>");
  process.exit(2);
}

const NATIVE = "5";
const MAX_LEN = 90;
const MIN_LEN = 8;

async function eachLine(file, onLine) {
  const stream = fs.createReadStream(path.join(exportsDir, file), { encoding: "utf8" });
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of lines) if (line) onLine(line);
}

/**
 * Our own rules, applied to somebody else's sentences.
 *
 * These mirror check-german-orthography and check-german-punctuation. The
 * point of running them here is that a sentence which would fail our gates is
 * not fit to teach from just because a stranger approved it.
 */
const REJECTS = [
  // No \b and no \w around these, deliberately.
  //
  // The first version was /\b\w*(?:daß|muß|…)\w*\b/ and it matched NOTHING:
  // \w is ASCII-only, so it does not match ß, and the trailing \b after a ß
  // can therefore never hold. The filter reported success on every sentence
  // and let the entire class through — which the project's own
  // check-german-orthography then caught in the built glossary. A plain
  // substring match cannot fail the same way.
  [/(?:daß|muß|gewiß|bewußt|Schluß|Fluß|Kuß|häßlich|läßt|paßt|Nuß|Riß|Erdgeschoß|Schoß|Prozeß|Kongreß|Adreß|Eßz|mißver|mißbrauch|Anschluß|Einfluß|Genuß|Verschluß|Überschuß|Zuschuß|Ausschuß)/i, "pre-1996 ß spelling"],
  [/\b(der|die|das|dem|den|ein|eine|einer|eines|einem|einen)\s+einzige[nrs]?\b(?!\s+[A-ZÄÖÜ])/, "substantivised Einzige left lower case"],
  [/\s[.,!?;:](?!\.)/, "space before punctuation"],
  [/\s{2,}/, "double space"],
  [/[«»„“”]{1}.*[«»„“”]{1}.*[«»„“”]/, "tangled quotation marks"],
  [/\b(Zb|zB|usw\.\.)\b/, "malformed abbreviation"],
  [/[A-Za-zÄÖÜäöüß]{28,}/, "implausibly long token"],
  [/(.)\1{3,}/, "a character repeated four times"],
  [/^[a-zäöüß]/, "sentence does not start with a capital"],
  [/https?:\/\//, "contains a URL"],
  [/[0-9]{5,}/, "contains a long number string"],
  // Swiss and lazy ss where post-1996 German takes ß. Only words where the ss
  // is unambiguously wrong: after a long vowel or a diphthong. Words that
  // genuinely take ss are NOT here — schoss, Fluss, muss, dass, Kuss, Masse,
  // Busse are all correct, and an over-eager rule would throw away good
  // sentences while claiming to protect the learner.
  [
    /(?:strasse|heiss|weiss(?!ag)|dreissig|schliess|fliess|geniess|giess|spass|gruss|schmeiss|beiss|reiss|scheiss|aussen|draussen|massnahm|süss|grösse|grosse[nrs]?\b|gross\b|fuss\b|stoss)/i,
    "ss where German takes ß",
  ],
  // ASCII-only umlaut substitutes. "Strasse" is caught above; "Muenchen" and
  // "fuer" are the same habit and just as wrong to teach from.
  [/(?:muenchen|koeln|duesseldorf|\bfuer\b|\bueber\b|\bkoennen\b|\bmoechte\b|\bwaere\b|\bgruen\b)/i, "ASCII umlaut substitute"],
];

/**
 * Tatoeba's house style is to call everybody Tom.
 *
 * It is not wrong German and the sentences are often the clearest ones there,
 * so they are not rejected — but where a sentence without a placeholder name
 * exists for the same word, that one reads better on a hover card.
 */
const PLACEHOLDER_NAME = /\b(Tom|Maria|Mary|Johannes)\b/;

function failsOurRules(text) {
  for (const [pattern, why] of REJECTS) if (pattern.test(text)) return why;
  if (!/[.!?…"'”»]$/.test(text.trim())) return "no final punctuation";
  return null;
}

(async () => {
  // ── 1. who speaks what, natively ─────────────────────────────────────────
  const nativeDe = new Set();
  const nativeEn = new Set();
  await eachLine("user_languages.csv", (line) => {
    const [lang, skill, username] = line.split("\t");
    if (!username || skill !== NATIVE) return;
    if (lang === "deu") nativeDe.add(username);
    if (lang === "eng") nativeEn.add(username);
  });
  console.log(`native German speakers: ${nativeDe.size.toLocaleString()}`);
  console.log(`native English speakers: ${nativeEn.size.toLocaleString()}`);

  // ── 2. German sentences, with their owners ───────────────────────────────
  const german = new Map(); // id -> { text, owner }
  await eachLine("deu_sentences_detailed.tsv", (line) => {
    const [id, lang, text, owner] = line.split("\t");
    if (lang !== "deu" || !text) return;
    if (!owner || owner === "\\N") return;          // orphan: answers to nobody
    if (!nativeDe.has(owner)) return;                // not a native's sentence
    german.set(id, { text: text.trim(), owner });
  });
  console.log(`German sentences owned by a native speaker: ${german.size.toLocaleString()}`);

  // ── 3. ratings ───────────────────────────────────────────────────────────
  // Kept as two sets rather than a map of counts: what matters is whether
  // anyone approved it who was not the author, and whether anyone objected.
  const approvedBy = new Map(); // sentence id -> Set(username)
  const objected = new Set();
  await eachLine("users_sentences.csv", (line) => {
    const [username, sentenceId, rating] = line.split("\t");
    if (!sentenceId) return;
    if (rating === "-1") { objected.add(sentenceId); return; }
    if (rating !== "1") return;
    let set = approvedBy.get(sentenceId);
    if (!set) { set = new Set(); approvedBy.set(sentenceId, set); }
    set.add(username);
  });
  console.log(`sentences with at least one rating: ${approvedBy.size.toLocaleString()}`);

  const reviewedByAnother = (id, owner) => {
    if (objected.has(id)) return false;
    const set = approvedBy.get(id);
    if (!set) return false;
    for (const user of set) if (user !== owner) return true;
    return false;
  };

  // ── 4. English translations ──────────────────────────────────────────────
  const englishIds = new Set();
  const linkFor = new Map(); // german id -> [english ids]
  await eachLine("deu-eng_links.tsv", (line) => {
    const [de, en] = line.split("\t");
    if (!de || !en) return;
    if (!german.has(de)) return;
    englishIds.add(en);
    const list = linkFor.get(de);
    if (list) list.push(en);
    else linkFor.set(de, [en]);
  });

  // The English side needs its own owner and rating, which means reading the
  // English sentences too. Only the ones actually linked to a surviving
  // German sentence are kept, so this stays small.
  const english = new Map();
  const engFile = fs.existsSync(path.join(exportsDir, "eng_sentences_detailed.tsv"))
    ? "eng_sentences_detailed.tsv"
    : null;
  if (engFile) {
    await eachLine(engFile, (line) => {
      const [id, lang, text, owner] = line.split("\t");
      if (lang !== "eng" || !englishIds.has(id) || !text) return;
      if (!owner || owner === "\\N" || !nativeEn.has(owner)) return;
      english.set(id, { text: text.trim(), owner });
    });
    console.log(`linked English sentences owned by a native: ${english.size.toLocaleString()}`);
  } else {
    console.log("eng_sentences_detailed.tsv not present — English side cannot be verified");
  }

  // ── 5. the surviving pairs ───────────────────────────────────────────────
  const rejected = new Map();
  const note = (why) => rejected.set(why, (rejected.get(why) ?? 0) + 1);

  const pairs = [];
  for (const [id, entry] of german) {
    if (objected.has(id)) { note("someone objected to it"); continue; }
    if (tier === "rated" && !reviewedByAnother(id, entry.owner)) { note("no independent OK rating"); continue; }
    if (entry.text.length > MAX_LEN) { note("too long for a hover card"); continue; }
    if (entry.text.length < MIN_LEN) { note("too short to teach anything"); continue; }
    const bad = failsOurRules(entry.text);
    if (bad) { note(`our rules: ${bad}`); continue; }

    const links = linkFor.get(id) ?? [];
    let translation = null;
    for (const enId of links) {
      const en = english.get(enId);
      if (!en) continue;
      if (objected.has(enId)) continue;
      if (tier === "rated" && !reviewedByAnother(enId, en.owner)) continue;
      if (en.text.length > 120) continue;
      translation = en.text;
      break;
    }
    if (!translation) { note("no verified English translation"); continue; }

    pairs.push({ id, de: entry.text, en: translation });
  }

  console.log("");
  console.log(`pairs surviving every filter: ${pairs.length.toLocaleString()}`);
  console.log("rejected because:");
  for (const [why, count] of [...rejected.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(8)}  ${why}`);
  }

  // ── 6. one sentence per word that still needs one ────────────────────────
  //
  // The output is not a corpus dump. It is the smallest possible file: one
  // sentence for each glossary word our own catalogue cannot illustrate, so
  // the build never needs the 300 MB of exports again and the result can be
  // read by a human before it ships.
  const glossary = JSON.parse(
    fs.readFileSync(path.join(root, "public/micheon-immersion-extension/data/words.json"), "utf8")
  );
  const needed = new Map();
  for (const entry of glossary) {
    // Only OUR OWN examples count as covered. A borrowed one is this script's
    // previous output, and treating it as covered would make the second run
    // find nothing to do and quietly erase the file it wrote the first time.
    if (entry.ex && entry.exSrc !== "t") continue;
    needed.set(String(entry.de).toLocaleLowerCase("de-DE"), entry);
  }
  console.log("");
  console.log(`glossary words still without an example: ${needed.size.toLocaleString()}`);

  /**
   * How good is this pair, for this word?
   *
   * Lower is better. Independently rated sentences win outright, because that
   * is the signal the strict tier was built on and there is no reason to
   * ignore it just because it is rare. After that, shorter is better: a hover
   * card has one line, and a short sentence shows the word doing its job.
   */
  const score = (pair, rated) =>
    (rated ? 0 : 10_000)
    + (PLACEHOLDER_NAME.test(pair.de) ? 200 : 0)
    + pair.de.length;

  // A translation that is wildly out of proportion to its German is usually a
  // loose link rather than a translation — "Mit wem ist Tom beisammen?" /
  // "Who's Tom with?" does not render the word being illustrated at all.
  const plausibleTranslation = (de, en) => {
    const ratio = en.length / de.length;
    return ratio >= 0.45 && ratio <= 2.4;
  };

  const best = new Map();
  for (const pair of pairs) {
    if (!plausibleTranslation(pair.de, pair.en)) continue;
    const rated = reviewedByAnother(pair.id, german.get(pair.id)?.owner ?? "");
    const words = new Set(pair.de.toLocaleLowerCase("de-DE").split(/[^\p{L}\p{N}ß]+/u));
    for (const token of words) {
      if (!needed.has(token)) continue;
      const candidate = { ...pair, rated, score: score(pair, rated) };
      const current = best.get(token);
      if (!current || candidate.score < current.score) best.set(token, candidate);
    }
  }

  const rows = [...best.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "de"))
    .map(([word, pair]) => ({
      w: word,
      ex: pair.de,
      exEn: pair.en,
      id: Number(pair.id),
      rated: pair.rated ? 1 : 0,
    }));

  const ratedCount = rows.filter((row) => row.rated).length;
  console.log(`words covered: ${rows.length.toLocaleString()} (${ratedCount.toLocaleString()} independently rated)`);

  const out = path.join(root, "src", "data", "tatoebaExamples.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(rows, null, 0)}\n`);
  console.log(`wrote ${path.relative(root, out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
})();
