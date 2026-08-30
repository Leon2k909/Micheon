#!/usr/bin/env node
/**
 * Portuguese is wired up, and it stays EUROPEAN Portuguese.
 *
 * Coverage is check-interface-coverage's job and Portuguese is held to the
 * same bar there as the other four, with no exemption of its own. What that
 * check cannot see is which Portuguese this is. The course teaches pt-PT and
 * speaks it with a Portuguese voice, so the app around it saying "tela" and
 * "você" would be teaching one variety in a frame written in another — and
 * every string of it would still be a valid entry with a valid key, invisible
 * to a coverage count.
 *
 * That is the failure this exists for, and it is a drift failure rather than
 * a one-off: the table is right today, and the next hundred strings get
 * written by whoever is nearest, from whichever Portuguese they know. The
 * whole cost of being wrong lands on the reader, who cannot tell a house
 * style from a mistake and has no way to report it.
 *
 * The pairs below are not a claim that Brazilian forms are wrong. They are a
 * claim that this file is not where they go.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

function readTable(rel, marker) {
  const src = read(rel);
  const start = src.indexOf("{", src.indexOf(marker));
  const end = src.indexOf("\n};", start);
  if (start < 0 || end < 0) throw new Error(`could not read the table in ${rel}`);
  return Function("return " + src.slice(start, end + 2))();
}

const PT = readTable("src/lib/i18nPt.ts", "export const PT");
const i18n = read("src/lib/i18n.ts");
const languages = read("src/lib/interfaceLanguage.ts");

let failures = 0;
const check = (name, condition, detail) => {
  if (condition) { console.log(`ok   ${name}`); return; }
  failures += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const entries = Object.entries(PT);
check(`the table is a whole app, not a shell (${entries.length} strings)`, entries.length > 1500,
  `only ${entries.length} strings — a shell-sized table means most of the app falls back to English`);

/**
 * Brazilian forms, with the European one this app uses.
 *
 * Only words whose two forms are genuinely different words, never spelling
 * preferences: a reader in Brazil understands "ecrã" perfectly well, and the
 * point is not to keep them out but to keep ONE variety, the one the course
 * teaches, throughout.
 */
const BRAZILIAN = [
  ["você", "tu"],
  ["tela", "ecrã"],
  ["celular", "telemóvel"],
  ["arquivo", "ficheiro"],
  ["usuário", "utilizador"],
  ["salvar", "guardar"],
  ["baixar", "transferir"],
  ["mouse", "rato"],
  ["ônibus", "autocarro"],
  ["esporte", "desporto"],
  ["trem", "comboio"],
  ["xícara", "chávena"],
  ["cadastro", "registo"],
  ["deletar", "eliminar"],
  ["aplicativo", "aplicação"],
  ["bilhão", "mil milhões"],
];

/**
 * Bounded by \p{L}, never by \b.
 *
 * JavaScript's \b is ASCII-only, so \bvocê\b cannot match anything: ê is not
 * a word character, and the trailing boundary therefore never holds. Written
 * that way this loop silently skipped você, usuário, ônibus and xícara —
 * including the one word the whole check exists for — and passed on a table
 * containing them. It is the failure mode a word-list check is most prone to,
 * because a check that finds nothing looks exactly like a clean table.
 */
const wrongVariety = [];
for (const [key, value] of entries) {
  for (const [brazilian, european] of BRAZILIAN) {
    if (new RegExp(`(?<!\\p{L})${brazilian}(?!\\p{L})`, "iu").test(value)) {
      wrongVariety.push(`${JSON.stringify(key.slice(0, 40))} says "${brazilian}" where this app says "${european}"`);
    }
  }
}
check("the vocabulary is European throughout", wrongVariety.length === 0,
  wrongVariety.slice(0, 5).join("\n     "));

/**
 * "está a fazer", not "está fazendo".
 *
 * The continuous is the tell that no word list catches, because every word in
 * "está carregando" is a word European Portuguese uses. It is the
 * CONSTRUCTION that belongs to the other variety, and this app is full of
 * progressives — every loading message is one.
 */
const gerundProgressive = entries
  .filter(([, value]) => /\best(á|ão|ava|avam|ou|ar|iver)\s+\w{2,}ndo\b/iu.test(value))
  .map(([key]) => JSON.stringify(key.slice(0, 40)));
check("the continuous is estar + a + infinitive, not estar + gerund", gerundProgressive.length === 0,
  `${gerundProgressive.length} string(s) use the Brazilian continuous: ${gerundProgressive.slice(0, 4).join(", ")}`);

/**
 * The app addresses one person as tu, matching the German table's du.
 *
 * Portuguese can hide the pronoun, so the verb ending is what actually
 * carries this. A você table reads as a form to fill in; that is not the
 * relationship an app has with somebody who chose to open it.
 */
const formal = entries
  .filter(([, value]) => /\b(o senhor|a senhora|vossa excelência)\b/iu.test(value))
  .map(([key]) => JSON.stringify(key.slice(0, 40)));
check("nobody is addressed as o senhor", formal.length === 0, formal.slice(0, 4).join(", "));

// A {slot} dropped in translation renders the literal word to the learner.
const slots = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const slotMismatch = entries.filter(([key, value]) => slots(key) !== slots(value)).map(([key]) => JSON.stringify(key));
check("every {slot} survives translation", slotMismatch.length === 0,
  slotMismatch.slice(0, 4).join(", "));

/**
 * A value left as its own key is an untranslated string that counts as
 * translated everywhere else, which is worse than a missing one: the coverage
 * check sees a key with a value and passes it.
 *
 * Three things are legitimately identical and must not be forced to differ. A
 * string that is only slots and punctuation — "{progress} / {target} {unit}"
 * — has nothing in it to translate, so the slots come off before asking
 * whether any words are left. Then two lists.
 *
 * SAME WORD: words Portuguese simply shares or borrowed, and the names of the
 * projects in the credits. Inventing a native-looking alternative for "cache"
 * to satisfy a check would put a word on screen that no Portuguese speaker
 * uses — a real cost paid to make a number look better.
 *
 * MUST STAY ENGLISH: strings whose whole job is to BE English. "colour,
 * practise" is the example under the British-spelling setting; translating it
 * deletes the only information it carries. A check cannot tell these from an
 * oversight, so they are named here rather than left to look like one.
 */
const SAME_WORD = new Set([
  "Cache", "Beta", "XP", "TSV", "CSV", "MICHEON", "Micheon Premium", "Micheon coins",
  "Euro", "Original", "Normal", "Familiar", "Extras", "Lingo",
  "Twemoji", "Tatoeba", "Lucide",
]);
const MUST_STAY_ENGLISH = new Set(["colour, practise", "color, practice"]);
const untouched = entries
  .filter(([key, value]) => key === value)
  .filter(([key]) => !SAME_WORD.has(key) && !MUST_STAY_ENGLISH.has(key))
  .filter(([key]) => /[a-z]{4}/iu.test(key.replace(/\{\w+\}/g, "")))
  .map(([key]) => JSON.stringify(key));
check("no string was left in English while counting as translated", untouched.length === 0,
  `${untouched.length}: ${untouched.slice(0, 5).join(", ")}`);

check("the app can actually load the table",
  i18n.includes('pt: () => import("@/lib/i18nPt").then((m) => m.PT)'),
  "i18n.ts has no loader for Portuguese, so choosing it would leave the app in English");

check("Portuguese is a language the picker offers and storage accepts",
  /\{ value: "pt", label: "Português"/u.test(languages)
    && /ResolvedInterfaceLanguage = (?:"(?:en|de|fr|pl|es|pt)"\s*\|?\s*)*"pt"/u.test(languages)
    && languages.includes("INTERFACE_LANGUAGE_VALUES.has(stored)"),
  "either the option is missing, or \"pt\" is not in ResolvedInterfaceLanguage, or storage validates "
    + "against a hand-written list that would read \"pt\" back as \"auto\"");

/**
 * Found by the names a person would actually type.
 *
 * The list is in endonyms, so somebody hunting for Portuguese in an app
 * currently written in Polish needs "portuguese" to work, and the keyboard
 * that made them want this setting is the one that will not produce ê.
 */
const built = require("child_process").execFileSync(process.execPath, ["-e", `
const esbuild = require(${JSON.stringify(path.join(root, "node_modules/esbuild"))});
const out = esbuild.buildSync({
  stdin: {
    contents: 'export { searchInterfaceLanguages, INTERFACE_LANGUAGES } from "./src/lib/interfaceLanguage.ts";',
    resolveDir: ${JSON.stringify(root)}, sourcefile: "lang.ts", loader: "ts",
  },
  alias: { "@": ${JSON.stringify(path.join(root, "src"))} },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
});
process.stdout.write(out.outputFiles[0].text);
`], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
const Module = require("module");
const langs = new Module("lang", null);
langs.paths = Module._nodeModulePaths(root);
langs._compile(built, path.join(root, "lang.cjs"));
const { searchInterfaceLanguages, INTERFACE_LANGUAGES } = langs.exports;

check(`the picker offers every language with a table (${INTERFACE_LANGUAGES.length})`,
  INTERFACE_LANGUAGES.some((l) => l.value === "pt") && INTERFACE_LANGUAGES.length >= 6);

for (const query of ["portuguese", "portugues", "Português", "portugiesisch", "portugais", "portugalski"]) {
  const found = searchInterfaceLanguages(query).map((l) => l.value);
  check(`"${query}" finds pt`, found.includes("pt"), `found ${found.join(", ") || "nothing"}`);
}
// Portuguese and Polish both begin "pol"/"por" in several of these languages,
// so the one query that could plausibly collide is worth pinning outright.
check('"polish" still finds pl and not pt',
  searchInterfaceLanguages("polish").map((l) => l.value).join() === "pl");

if (failures) {
  console.error(`\n${failures} Portuguese interface check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-portuguese-interface: ${entries.length} strings, European throughout, loadable, and findable `
    + `among the ${INTERFACE_LANGUAGES.length} languages the picker offers`
);
process.exit(0);
