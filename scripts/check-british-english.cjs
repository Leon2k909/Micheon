#!/usr/bin/env node
/**
 * The course is written in British English, and stays that way.
 *
 * normalizeEnglishSpelling converts the content TO American for a learner who
 * picks that variant, and it only runs in that direction. So an American form
 * in the source is stuck there: the British learner sees "behavior" and no
 * setting in the app can turn it back. Seventy-five of them had accumulated —
 * behaviour, honour, favour, neighbour, defence, mould, fibre, nappies, and a
 * handful of words nobody here says at all: so-so, drugstore, freeway.
 *
 * Three things are deliberately NOT leaks, and each earned its exemption by
 * turning up in that first sweep:
 *
 *   · a card teaching the difference, either by naming it ("American", "in
 *     the US") or by carrying both forms — "colour / color" is the lesson,
 *     not a mistake;
 *   · a German word quoted inside an English note — der Meter, zwei Liter,
 *     die Mailbox — which is German and stays German;
 *   · an idiom that is English everywhere: trash talk, a cookie banner,
 *     candy floss, a computer program.
 *
 * A card that lists both, British first, is how the app already teaches a
 * regional pair ("accelerator / gas pedal"), so the British form's presence
 * in the same field is what makes it legitimate.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "british-english-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.window = { addEventListener() {}, removeEventListener() {}, localStorage: global.localStorage, setTimeout, clearTimeout };
global.document = { addEventListener() {}, removeEventListener() {}, visibilityState: "visible" };
global.navigator = { language: "en-GB", onLine: true };

const compiled = new Module("british-english-check", module);
compiled.filename = path.join(root, ".british-english-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildBundledParts, buildTatoebaParts } = compiled.exports;

const parts = {
  ...Object.fromEntries(Object.entries(allPartBlueprints).map(([key, blueprint]) => [key, buildApiPartFromResolved(blueprint, {})])),
  ...buildBundledParts(),
  ...buildTatoebaParts(),
};

/**
 * [american, british] — `british` is both the correction and the exemption:
 * a field carrying the British form as well is teaching the pair.
 */
const AMERICAN = [
  // Written out rather than stemmed. The stems missed the long ones —
  // "endeavored" survived the first sweep because \bend + or never reaches
  // the "or" in endeavor, and humour, armour and vapour were not stems at
  // all. A word each is longer and cannot quietly fail to match.
  [/\b(col|fav|hon|lab|behavi|neighb|flav|rum|harb|endeav|hum|vap|vig|od|arm|savi|splend|clam|tum|cand|demean|ferv|glam|val|parl|rig|end)or(s|ed|ing|less|able|ite|ites)?\b/g, "our"],
  [/\b(cent|theat|fib)er(s)?\b/g, "re"],
  [/\b(travel|cancel|label|signal|model|marvel|fuel)(ed|ing|er|ers)\b/g, "ll"],
  [/\b(organiz|recogniz|apologiz|realiz|memoriz|criticiz|specializ|prioritiz|summariz)(e|es|ed|ing|ation)\b/g, "is"],
  [/\bdefense(s)?\b/g, "defence"],
  [/\boffense(s)?\b/g, "offence"],
  [/\b(anal|dial|catal|mon)og\b/g, "ogue"],
  [/\bgray(er|est|ing|ed|ish)?\b/g, "grey"],
  [/\bpediatric(s)?\b/g, "paediatric"],
  [/\bmaneuver(s|ed|ing)?\b/g, "manoeuvre"],
  [/\bplow(s|ed|ing)?\b/g, "plough"],
  [/\bmold(s|y|ed|ing)?\b/g, "mould"],
  [/\bsavor(y|ed|ing|s)?\b/g, "savour"],
  [/\bcozy\b/g, "cosy"],
  [/\bmustache(s)?\b/g, "moustache"],
  [/\bapartment(s)?\b/g, "flat"],
  [/\belevator(s)?\b/g, "lift"],
  [/\bsidewalk(s)?\b/g, "pavement"],
  [/\b(trash|garbage)\b/g, "rubbish"],
  [/\bcell ?phone(s)?\b/g, "mobile"],
  [/\bsoccer\b/g, "football"],
  [/\bdiaper(s)?\b/g, "nappy"],
  [/\bvacation(s)?\b/g, "holiday"],
  [/\bmovie theater(s)?\b/g, "cinema"],
  [/\bzip code(s)?\b/g, "postcode"],
  [/\bmath\b/g, "maths"],
  [/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th)) grade\b/g, "Year"],
  [/\brestroom(s)?\b/g, "toilet"],
  [/\bfaucet(s)?\b/g, "tap"],
  [/\bstroller(s)?\b/g, "pushchair"],
  [/\bdrugstore(s)?\b/g, "chemist"],
  [/\brealtor(s)?\b/g, "estate agent"],
  [/\bgotten\b/g, "got"],
  [/\bgas pedal(s)?\b/g, "accelerator"],
  [/\bgas station(s)?\b/g, "petrol station"],
  [/\bin the fall\b/g, "in autumn"],
  [/\bfrench fries\b/g, "chips"],
  [/\bsneakers\b/g, "trainers"],
  [/\b(freeway|highway)(s)?\b/g, "motorway"],
  [/\bmailman\b/g, "postman"],
  [/\bso-so\b/g, "not said here — could be better, middling"],
  [/\bhow's tricks\b/g, "not said here"],
  [/\bfroze (me|him|her|them|us) out\b/g, "shut out"],
  [/\bdifferent than\b/g, "different from"],
  [/\bcould care less\b/g, "couldn't care less"],
];

/** English everywhere, whatever the dictionary says about the parts. */
const IDIOMS = [/\btrash talk(ing|s|ed)?\b/i, /\bcookie banner/i, /\bcandy floss/i, /\btrashy\b/i];
/** A German noun quoted with its article keeps its German spelling. */
const GERMAN_QUOTED = /(?:^|[\s'"„(])(?:der|die|das|ein|eine|einen|einem|zwei|drei|vier|fünf)\s+$/u;
const TEACHES_DIFFERENCE = /\bAmerican|\bU\.?S\.?\b|\bAmerika|\bBritish|\bBritain\b/u;

const FIELDS = ["en", "use", "when", "short", "say", "long", "shortLabel", "tierNote", "description", "focus", "theme", "label"];
const leaks = [];
let scanned = 0;

const inspect = (text, where) => {
  const value = String(text ?? "");
  if (!value) return;
  scanned += 1;
  if (TEACHES_DIFFERENCE.test(value)) return;
  for (const [pattern, british] of AMERICAN) {
    // The pair, taught together, is the lesson rather than the leak.
    if (new RegExp(`\\b\\w*${british.split(" ")[0]}\\w*\\b`, "iu").test(value)) continue;
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(value))) {
      const before = value.slice(0, match.index);
      if (GERMAN_QUOTED.test(before)) continue;
      if (/^[A-Z]/u.test(match[0]) && /\w[\s,;:—-]+$/u.test(before)) continue;
      if (IDIOMS.some((idiom) => idiom.test(value))) continue;
      leaks.push(`${where}: "${match[0]}" — British is ${british}\n      ${value.slice(0, 100)}`);
    }
  }
};

const walk = (item, where) => {
  if (!item || typeof item !== "object") return;
  for (const field of FIELDS) {
    if (typeof item[field] === "string") inspect(item[field], `${where}.${field}`);
  }
};

for (const [key, part] of Object.entries(parts)) {
  walk(part, key);
  for (const list of ["seeds", "vocab", "phrases"]) {
    for (const item of part?.[list] ?? []) walk(item, `${key}/${list}`);
  }
  for (const dialogue of part?.dialogues ?? []) {
    walk(dialogue, `${key}/dialogue`);
    for (const line of dialogue.lines ?? []) walk(line, `${key}/dialogue`);
  }
}

// The scan has to be reading the course, not an empty object.
if (scanned < 20000) {
  console.error(`FAIL check-british-english: only ${scanned} English fields were read — the catalogue did not build`);
  process.exit(1);
}

if (leaks.length) {
  console.error(`FAIL check-british-english: ${leaks.length} American form(s) in the English content`);
  for (const leak of leaks.slice(0, 25)) console.error("  " + leak);
  if (leaks.length > 25) console.error(`  … ${leaks.length - 25} more`);
  console.error("  The variant switch only converts British → American, so these reach the British learner unchanged.");
  process.exit(1);
}
console.log(`check-british-english: ${scanned.toLocaleString("en-GB")} English fields, no American spellings or vocabulary among them`);
