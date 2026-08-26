#!/usr/bin/env node
/**
 * A language is downloaded by the people learning it, and nobody else.
 *
 * The translation tables are the biggest thing in the app that most learners
 * never need: French is 443 KB of source and Polish 474 KB, and there are 84
 * languages planned. They used to be two static imports in translations.ts,
 * which put every language into one chunk that the ENTRY chunk pulled in — so
 * a learner doing German alone downloaded all of them at startup, measured at
 * 786 KB, growing by roughly 450 KB with each one added.
 *
 * They are fetched on demand now. One line undoes that: a static import of a
 * table anywhere the app can reach turns it back into part of the bundle, and
 * nothing about the app looks different when it happens — it is simply slower
 * to start, for everyone, for ever.
 *
 * So this reads the built output rather than the intent. The entry chunk is
 * followed through its imports, and the tables must not be reachable from it.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist", "assets");

// ── the source says what it means ───────────────────────────────────────────
// i18nFr is the interface chrome rather than course content, and it is here
// for the same reason: an English app has no use for it and was downloading
// it anyway.
const TABLES = ["frenchTranslations", "polishTranslations", "i18nDe", "i18nFr"];
const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
};
const sources = walk(src);

for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  for (const table of TABLES) {
    const staticImport = new RegExp(`^\\s*import\\s[^\\n]*from\\s+["']@?[./\\w]*${table}["']`, "m");
    assert.ok(!staticImport.test(text),
      `${path.relative(root, file)} imports ${table} statically. That is ~450 KB welded into the `
      + "bundle for every learner, including the ones who will never open that course — use the "
      + "loader in translations.ts, whose import sits inside a function on purpose");
  }
}

// The loaders themselves have to stay inside the arrow, or they resolve at
// build time and the table joins the startup chunk anyway.
// Two kinds of table, loaded from two places: course content is fetched by
// translations.ts, the interface chrome by i18n.ts.
const translations = fs.readFileSync(path.join(src, "lib", "translations.ts"), "utf8");
for (const table of TABLES.filter((t) => !t.startsWith("i18n"))) {
  assert.ok(new RegExp(`\\(\\) => import\\("@/lib/${table}"\\)`).test(translations),
    `${table} has no lazy loader in translations.ts, so nothing fetches it on demand`);
}

const i18n = fs.readFileSync(path.join(src, "lib", "i18n.ts"), "utf8");
for (const table of ["i18nDe", "i18nFr"]) {
  assert.ok(i18n.includes(`() => import("@/lib/${table}")`),
    `the ${table} interface table has no lazy loader in i18n.ts, so every app downloads the chrome `
    + "of a language it is not written in — and ui() is imported by every screen, so there is no "
    + "arrangement of chunks that leaves an inline table out");
}

/**
 * The German table did not lose entries on the way out of i18n.ts.
 *
 * It was moved wholesale, and the file it came from is edited on essentially
 * every commit — so the move can collide with somebody adding a key, and the
 * way that fails is silent: the app falls back to the English source string
 * and looks like a screen somebody forgot to translate. A floor catches a
 * merge that drops a run of them.
 */
// Measured at the move: 2,928 keys went in and 2,928 came out. The margin
// below that leaves room for a string legitimately retired with the feature
// that used it, while a merge dropping a run of them still fails here.
const GERMAN_KEYS_FLOOR = 2880;
const germanKeys = (fs.readFileSync(path.join(src, "lib", "i18nDe.ts"), "utf8")
  .match(/^\s*"(?:[^"\\]|\\.)*"\s*:/gm) || []).length;
assert.ok(germanKeys >= GERMAN_KEYS_FLOOR,
  `the German interface table holds ${germanKeys} keys and ${GERMAN_KEYS_FLOOR} was the floor. `
  + "Entries were lost, which shows as English text in a German app rather than as an error");
assert.ok(fs.readFileSync(path.join(src, "main.tsx"), "utf8").includes("ensureInterfaceStrings"),
  "the app renders before its interface table lands, so a French reader sees a screen of English "
  + "and then watches it change");

// A course cannot be built before its table lands: an entry the table does
// not cover is DROPPED, so the lesson comes out short rather than untranslated.
assert.ok(/export function translationLanguageFor/.test(
  fs.readFileSync(path.join(src, "lib", "direction.ts"), "utf8")),
  "nothing says which table a direction needs, so a catalogue can be built without it");
for (const file of ["prototype/NewUiPrototype.tsx", "guided_learning_session.tsx"]) {
  const text = fs.readFileSync(path.join(src, file), "utf8");
  assert.ok(text.includes("ensureTranslations"),
    `${file} builds a catalogue without waiting for the course's translations, so a French or `
    + "Polish course assembled at startup silently comes out short");
}

/**
 * The desktop search index is only offered for the languages it holds.
 *
 * catalogue.db is built from the catalogue in its default direction: its
 * columns are `de` and `en` and its FTS covers those. Searching it for a
 * French or Polish word returns nothing — measured, for every word tried —
 * and an empty answer is treated as authoritative, because the reason to wait
 * for the index is to avoid running the in-memory search as well.
 *
 * So a French learner on the desktop typing French saw an empty tracker,
 * while the same search in a browser worked. Nothing about that looks like a
 * fault: it reads as a course with no matching words.
 */
const tracker = fs.readFileSync(path.join(src, "components", "lab", "VocabTracker.tsx"), "utf8");
assert.ok(/const indexHolds = sides\.target\.code === "de" \|\| sides\.target\.code === "en";/.test(tracker),
  "the tracker offers the desktop search index to every course. It holds German and English "
  + "only, and an empty result from it is final — so a French or Polish learner searching their "
  + "own language gets an empty tracker rather than the in-memory search that would have worked");
assert.ok(tracker.includes("if (!indexHolds) return null;"),
  "the index is still reached for a course it cannot answer for");

/**
 * A language is something a device HAS, and can give back.
 *
 * The tables ship as content packs — the same data as JSON, built by
 * build-content-packs and verified byte-identical to the bundled copy. Reading
 * the pack rather than importing the module is what makes a language
 * removable: a JavaScript chunk, once downloaded, is the browser's to keep.
 *
 * Nobody is asked to install anything. Opening the course fetches its pack and
 * keeps it; the bundled copy answers if the pack cannot be had at all, so a
 * first run with no network still teaches.
 */
assert.ok(translations.includes("fromPackOrBundle"),
  "the tables are imported rather than read from their pack, so a language is part of the app "
  + "again and cannot be removed");
assert.ok(/packs\.installPack\(pack\.url\)/.test(translations),
  "the pack is read but never kept, so every start downloads the language again");
assert.ok(/return BUNDLED\[language\]\(\)/.test(translations),
  "there is no fallback to the bundled table, so a first run with no network has no course");

// Removable from BOTH places somebody would look: the screen about storage,
// and the picker where the course was chosen in the first place.
const storage = fs.readFileSync(path.join(src, "components", "DataAndStorage.tsx"), "utf8");
assert.ok(storage.includes("removePack") && storage.includes("Downloaded languages"),
  "Data and storage lists what is on the device but cannot remove a language from it");
const picker = fs.readFileSync(path.join(src, "components", "course", "CourseSwitcher.tsx"), "utf8");
assert.ok(picker.includes("removePack") && picker.includes("DownloadedBadge"),
  "the course picker cannot remove a download, so the only way to undo one is elsewhere in "
  + "settings");
// Every delete on the storage screen arms first; this is a delete too.
for (const [where, text, armed] of [
  ["Data and storage", storage, `arming !== \`lang:\${pack.id}\``],
  ["the course picker", picker, "const asking = removing === id;"],
]) {
  assert.ok(text.includes(armed),
    `${where} removes a language on a single click. Every other delete in this app asks first, `
    + "and this one sits beside the button that chooses the course");
}

// primeTranslations is the synchronous door for build scripts. The app must
// never take it, or the tables are back in the bundle by another name.
for (const file of sources) {
  if (file.endsWith(path.join("lib", "translations.ts"))) continue;
  assert.ok(!fs.readFileSync(file, "utf8").includes("primeTranslations"),
    `${path.relative(root, file)} calls primeTranslations, which is for the gate and the build `
    + "scripts — in the app it means handing in a table that had to be bundled to be handed in");
}

// ── and the build agrees ────────────────────────────────────────────────────
// Intent is not enough: a re-export somewhere else can drag a table back into
// the startup path without a static import ever appearing above.
if (!fs.existsSync(dist)) {
  console.log("check-language-loading: source is correct; no dist to measure (run the build first)");
  process.exit(0);
}
const html = fs.readFileSync(path.join(root, "dist", "index.html"), "utf8");
const entry = [...html.matchAll(/assets\/([A-Za-z0-9_-]+\.js)/g)].map((m) => m[1]);
assert.ok(entry.length > 0, "no entry scripts found in dist/index.html");

const chunkText = new Map();
const read = (name) => {
  if (!chunkText.has(name)) {
    const full = path.join(dist, name);
    chunkText.set(name, fs.existsSync(full) ? fs.readFileSync(full, "utf8") : "");
  }
  return chunkText.get(name);
};

/** Everything the entry can reach without a user doing anything. */
const reachable = new Set();
const queue = [...entry];
while (queue.length) {
  const name = queue.pop();
  if (reachable.has(name)) continue;
  reachable.add(name);
  const text = read(name);
  for (const match of text.matchAll(/["'.\/]([A-Za-z0-9_-]+-[A-Za-z0-9_]{8}\.js)["']/g)) {
    if (!reachable.has(match[1])) queue.push(match[1]);
  }
}

/**
 * A phrase from inside each table, not the name of its export.
 *
 * "POLISH_BY_GERMAN" was tried first and it reports the wrong thing: the
 * loader reads that property off the module it fetches, so the name is
 * written into the chunk holding the LOADER, which is exactly the chunk that
 * is supposed to be reachable. Only the content proves the table itself came
 * along.
 */
const FINGERPRINTS = [
  ["French content", "Qu'est-ce que tu veux"],
  ["Polish content", "przynajmniej"],
  // The INTERFACE tables are the same fault a layer up: English is the source
  // key and needs no table at all, yet an English app was downloading every
  // other language's chrome — 235 KB of German and 227 KB of French, on every
  // start, growing by roughly 230 KB with each interface language added.
  ["German interface", "Geordie-Grundlagen"],
  ["French interface", "L'essentiel du geordie"],
];
const carrying = [];
for (const name of reachable) {
  const text = read(name);
  for (const [language, needle] of FINGERPRINTS) {
    // data-*.js legitimately holds inline French written onto entries; it is
    // the TABLE that must not be reachable.
    if (name.startsWith("data-")) continue;
    if (text.includes(needle)) carrying.push(`${language} in ${name}`);
  }
}
assert.deepStrictEqual(carrying, [],
  "a translation table is reachable from the entry chunk, so every learner downloads it at "
  + `startup whatever course they are taking: ${carrying.join(", ")}`);

const startup = [...reachable].reduce((total, name) => {
  const full = path.join(dist, name);
  return total + (fs.existsSync(full) ? fs.statSync(full).size : 0);
}, 0);

console.log(
  `check-language-loading: no table is imported statically, each has a loader, both catalogue `
  + `boots wait for it, and none of the ${reachable.size} chunks reachable at startup `
  + `(${(startup / 1024).toFixed(0)} KB) carries one`
);
process.exit(0);
