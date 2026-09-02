/**
 * The Russian-only packs answer to the same rules as the translation table.
 *
 * WHY THIS FILE EXISTS SEPARATELY FROM check-russian-script.cjs. That one reads
 * russianTranslations.ts, which is keyed by German. These cards are keyed by
 * Russian and never pass through translate(), so nothing that guards the table
 * reaches them. They are the one place in the course where a card can be added
 * without a German original, which is exactly why they need their own gate:
 * without it, the rules that hold everywhere else would stop at this file.
 *
 * WHAT IT HOLDS THEM TO
 *   - Cyrillic only. A Latin letter in a Russian answer is a typo the learner
 *     cannot type and the grader will not forgive.
 *   - No collision with the table. Two German cards may not share one Russian
 *     line, and neither may a table entry and an own card — that would make one
 *     German card gradeable two ways and split the learner's progress.
 *   - No collision inside the packs either.
 *   - Every card carries both meanings, so switching the interface language
 *     cannot leave a card blank.
 *   - The course never decides the learner's gender: no gendered past tense or
 *     short adjective in a sentence that says я or ты.
 */
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { buildSync } = require("esbuild");
const {
  THIRD_PERSON, MASCULINE_SHORT, FEMININE_SHORT, MASCULINE_PAST, FEMININE_PAST, wordsOf,
} = require("./russian-gender-words.cjs");

const root = path.join(__dirname, "..");
const ownFile = path.join(root, "src", "lib", "russianOwnCards.ts");
const tableFile = path.join(root, "src", "lib", "russianTranslations.ts");

function load(file, exports) {
  const out = buildSync({
    stdin: {
      contents: `export * from ${JSON.stringify(file.replace(/\\/g, "/"))};`,
      resolveDir: root,
      loader: "ts",
    },
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    logLevel: "silent",
  });
  const module = { exports: {} };
  new Function("module", "exports", "require", out.outputFiles[0].text)(
    module,
    module.exports,
    require,
  );
  for (const name of exports) {
    assert.ok(typeof module.exports[name] === "function", `${name} is not exported`);
  }
  return module.exports;
}

const own = load(ownFile, ["russianOwnParts", "russianOwnLines", "russianOwnCardCount"]);

const results = [];
function check(title, fn) {
  try {
    fn();
    results.push(["ok", title]);
  } catch (error) {
    results.push(["FAIL", title, error.message]);
  }
}

const partsDe = own.russianOwnParts("de");
const partsEn = own.russianOwnParts("en");
const lines = own.russianOwnLines();
const count = own.russianOwnCardCount();

check("the packs carry cards at all", () => {
  assert.ok(count > 0, "no own cards");
  assert.ok(Object.keys(partsDe).length > 0, "no own packs");
});

check("every Russian line is Cyrillic alone", () => {
  const latin = lines.filter((line) => /[A-Za-z]/.test(line));
  assert.deepStrictEqual(
    latin,
    [],
    `a Russian answer cannot carry Latin letters: ${latin.join(" | ")}`,
  );
});

check("no own card repeats another own card", () => {
  const seen = new Map();
  const clashes = [];
  for (const line of lines) {
    if (seen.has(line)) clashes.push(line);
    seen.set(line, true);
  }
  assert.deepStrictEqual(clashes, [], `two own cards share one line: ${clashes.join(" | ")}`);
});

check("no own card repeats a line the table already teaches", () => {
  const table = new Set();
  for (const line of fs.readFileSync(tableFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^  ("(?:[^"\\]|\\.)*"): ("(?:[^"\\]|\\.)*"),$/);
    if (m) table.add(JSON.parse(m[2]));
  }
  const clashes = lines.filter((line) => table.has(line));
  assert.deepStrictEqual(
    clashes,
    [],
    `an own card and a translated card share one Russian line, so one German card would be gradeable two ways: ${clashes.join(" | ")}`,
  );
});

check("switching the interface language leaves no card blank", () => {
  const blanks = [];
  for (const [key, part] of Object.entries(partsDe)) {
    const other = partsEn[key];
    assert.ok(other, `${key} is missing from the English build`);
    for (const list of ["vocab", "phrases"]) {
      part[list].forEach((card, i) => {
        if (!String(card.en ?? "").trim()) blanks.push(`${key}.${list}[${i}] de-meaning`);
        if (!String(other[list][i]?.en ?? "").trim()) blanks.push(`${key}.${list}[${i}] en-meaning`);
      });
    }
    for (const word of part.vocab) {
      if (!String(word.tip ?? "").trim()) blanks.push(`${key} tip for ${word.de}`);
      if (!String(word.exampleEn ?? "").trim()) blanks.push(`${key} example meaning for ${word.de}`);
    }
  }
  assert.deepStrictEqual(blanks, [], `a card would show empty: ${blanks.join(" | ")}`);
});

check("the course never decides the learner's gender", () => {
  /**
   * Same rule and the same word lists as check-russian-script.cjs, because a
   * card that picks a gender picks it whichever file it came from. Read the
   * long argument there for why a short adjective counts when it leads and a
   * past tense counts only beside я or ты.
   *
   * The first version of this check matched /\w+л/ and never fired once: \w in
   * JavaScript is ASCII, so it could not see a Cyrillic letter at all. It
   * passed "Я всё понял." green. Hence the lists.
   */
  const gendered = [];
  for (const line of lines) {
    const words = wordsOf(line);
    if (words.some((word) => THIRD_PERSON.includes(word))) continue;
    const namesReader = words.includes("я") || words.includes("ты");
    const shortAdjective = words.find(
      (word) => MASCULINE_SHORT.includes(word) || FEMININE_SHORT.includes(word),
    );
    if (shortAdjective && (namesReader || words[0] === shortAdjective)) {
      gendered.push(`${line} (${shortAdjective})`);
      continue;
    }
    if (!namesReader) continue;
    const past = words.find(
      (word) => MASCULINE_PAST.includes(word) || FEMININE_PAST.includes(word),
    );
    if (past) gendered.push(`${line} (${past})`);
  }
  assert.deepStrictEqual(
    gendered,
    [],
    `these decide the learner's gender; rewrite them rather than pick one: ${gendered.join(" | ")}`,
  );
});

check("every pack belongs to the Russian course alone", () => {
  const wrong = Object.entries(partsDe)
    .filter(([, part]) => !part.learningDirections?.includes("learn-ru") || part.learningDirections.length !== 1)
    .map(([key]) => key);
  assert.deepStrictEqual(
    wrong,
    [],
    `an own pack would leak into another course: ${wrong.join(" | ")}`,
  );
});

// The lesson card shows uiOr(part.theme, "Konversationsmodul"), and uiOr is
// keyed on the ENGLISH source string. A theme written in German misses every
// table and falls back SILENTLY — all 66 packs once rendered as
// "Konversationsmodul", which no gate saw and only a photograph of the running
// app did. So the theme is pinned here: it must resolve in every interface
// table there is, or the pack has no name on screen.
check("every pack's theme has a name in every interface language", () => {
  const tables = {
    de: "i18nDe.ts", es: "i18nEs.ts", fr: "i18nFr.ts",
    it: "i18nIt.ts", pl: "i18nPl.ts", pt: "i18nPt.ts",
  };
  const missing = [];
  for (const [lang, file] of Object.entries(tables)) {
    const src = fs.readFileSync(path.join(__dirname, "..", "src", "lib", file), "utf8");
    for (const part of Object.values(partsDe)) {
      const theme = String(part.theme ?? "");
      if (!theme) { missing.push(`${lang}: a pack has no theme at all`); continue; }
      if (!src.includes("\n  " + JSON.stringify(theme) + ":")) missing.push(`${lang}: ${theme}`);
    }
  }
  assert.deepStrictEqual(
    missing,
    [],
    `these packs would show "Konversationsmodul" instead of their own name: ${missing.join(" | ")}`,
  );
});

// Two packs sharing one id is not an error anywhere: partsDe is a Record, so
// the second silently REPLACES the first and the course quietly loses a pack.
// It happened once and was caught only because cards inside the two collided.
check("no two packs share an id", () => {
  const ids = [...fs.readFileSync(ownFile, "utf8").matchAll(/id: "(ru-own-[^"]+)"/g)].map((m) => m[1]);
  const twice = [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))];
  assert.deepStrictEqual(
    twice,
    [],
    `one pack would silently overwrite another: ${twice.join(" | ")}`,
  );
});

let failed = 0;
for (const [status, title, message] of results) {
  console.log(`${status === "ok" ? "ok  " : "FAIL"} ${title}`);
  if (message) {
    console.log(`  ${message}`);
    failed += 1;
  }
}
console.log(
  `\ncheck-russian-own-cards: ${count} cards in ${Object.keys(partsDe).length} Russian-only packs, Cyrillic alone, colliding with neither each other nor the table, and readable in both meaning languages`,
);
assert.strictEqual(failed, 0);
