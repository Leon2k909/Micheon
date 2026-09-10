#!/usr/bin/env node
/**
 * A practice question shows four options one under the other, and a reader
 * compares them before choosing. That comparison is not only about meaning:
 * three options that open the same way and a fourth that does not make the
 * fourth the one the eye stops on. When the fourth is the correct answer, the
 * question can be answered without knowing anything.
 *
 * Russian makes this easy to get wrong, because an option is translated on
 * its own and the case it needs comes from the question. "Con la fiscalità
 * generale" is faithfully "из общих налогов" — but its three siblings are
 * instrumental, so it stood out, and it was the answer.
 *
 * It is easy to get wrong a second way too: every Russian table is spread
 * into ONE object, so a string translated for the British bank also answers
 * the German question that uses it. A shape chosen for one question travels
 * to every other question that shares the string, and a course table can
 * decide the shape of a bank option it never saw.
 *
 * This gate walks all six banks, renders the four options through
 * translateCourseText — the lookup a reader's tap actually goes through — and
 * refuses any question where the minority shape sits on exactly the answer.
 *
 * ACCEPTED holds the ones that cannot be repaired from a bank table, each
 * with the reason. Anything not on that list fails the build; an entry on the
 * list that is no longer a finding fails it too, so the list cannot rot.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const BANKS_META = [
  ["UK_QUESTIONS", "ukQuestionBank", "Life in the UK"],
  ["DE_QUESTIONS", "deQuestionBank", "Leben in Deutschland"],
  ["FR_QUESTIONS", "frQuestionBank", "Vivre en France"],
  ["IT_QUESTIONS", "itQuestionBank", "Vivere in Italia"],
  ["PL_QUESTIONS", "plQuestionBank", "Zycie w Polsce"],
  ["ES_QUESTIONS", "esQuestionBank", "Vivir en Espana"],
];

const built = esbuild.buildSync({
  stdin: {
    contents:
      BANKS_META.map(([symbol, file]) =>
        'export { ' + symbol + ' } from "./src/lib/' + file + '.ts";'
      ).join("\n") +
      '\nexport { translateCourseText } from "./src/lib/courseTranslation.ts";',
    resolveDir: root,
    sourcefile: "ru-bank-option-shape-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("ru-bank-option-shape-check", module);
compiled.filename = path.join(root, ".ru-bank-option-shape-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const M = compiled.exports;
const { translateCourseText } = M;

/**
 * An option that begins with one of these is a phrase; one that does not is a
 * bare noun or a clause. Only the leading word counts: "Только в Англии" and
 * "Повсюду в Соединённом Королевстве" are locative too, and lumping them in
 * would accuse questions that read perfectly well.
 */
const OPENERS = /^(Со|Во|Ко|Обо|Ото|У|С|В|На|От|До|За|По|Из|Под|При|Через|Об)\s/;

/**
 * The findings that cannot be repaired by translating a bank string, with the
 * reason each one is stuck. Keyed by question id, which is stable — the text
 * of a question may be reworded, the id is not.
 */
const ACCEPTED = new Map([
  [
    "ddr-6",
    "The option is the German string \"Gar nicht\", which LEBEN_IN_DEUTSCHLAND_RU " +
      "already answers with \"Вовсе не платит\" for a lesson card about paying " +
      "nothing. One key, one answer: the bank cannot give it a second wording.",
  ],
  [
    "giu-5",
    "The option is the Italian string \"Tre\", which VIVERE_IN_ITALIA_RU answers " +
      "with \"У трёх\" — the case its own question \"У скольких областей особый " +
      "устав?\" demanded. It governs nine bank questions from outside the bank " +
      "table, and its three siblings here are bare in every other question.",
  ],
  [
    "edu-6",
    "Not a defect: all four options are locative. \"Повсюду в Соединённом " +
      "Королевстве\" and \"Только в Англии\" put an adverb in front of the same " +
      "preposition, which this measure counts as bare.",
  ],
  [
    "sym-3",
    "Not a defect: three options open with \"Только\", the fourth does not, and " +
      "that is how the French reads. All four are locative.",
  ],
  [
    "eco-11",
    "Not a defect: \"Вдоль Эмилиевой дороги\" is locative like the other three. " +
      "It is the answer, and it is the only one that names a road rather than a " +
      "region — but that is the question, not the translation.",
  ],
]);

const found = new Map();
for (const [symbol, , label] of BANKS_META) {
  for (const question of M[symbol]) {
    const shown = question.options.map((option) => translateCourseText(option, "ru") || option);
    // A long option is a sentence, and a sentence may begin with anything.
    if (shown.some((text) => text.split(/\s+/).length > 6)) continue;
    const opens = shown.map((text) => OPENERS.test(text));
    const count = opens.filter(Boolean).length;
    if (count === 0 || count === shown.length) continue;
    const minority = count * 2 < shown.length;
    const odd = opens.map((o, i) => (o === minority ? i : -1)).filter((i) => i >= 0);
    if (odd.length !== 1 || odd[0] !== question.answer) continue;
    found.set(question.id, { label, question, shown });
  }
}

const failures = [];
for (const [id, { label, question, shown }] of found) {
  if (ACCEPTED.has(id)) continue;
  failures.push(
    label + " — " + id + ": " + JSON.stringify(String(question.q).slice(0, 80)) + "\n" +
    shown
      .map((text, i) =>
        "      " + "ABCD"[i] + (i === question.answer ? "*" : " ") + " " + JSON.stringify(text)
      )
      .join("\n") +
    "\n      The answer is the only option shaped differently. Give it the shape\n" +
    "      the other three carry, or add it to ACCEPTED with the reason it cannot\n" +
    "      be repaired from a bank table."
  );
}

for (const id of ACCEPTED.keys()) {
  if (found.has(id)) continue;
  failures.push(
    id + " is listed in ACCEPTED but no longer reads that way. Delete the entry,\n" +
    "      so the list keeps saying what is true."
  );
}

if (failures.length) {
  console.error("FAIL check-ru-bank-option-shape");
  for (const failure of failures) console.error("  " + failure);
  process.exit(1);
}

console.log(
  "check-ru-bank-option-shape: no question in the six banks puts the answer in a " +
    "shape of its own, apart from the " + ACCEPTED.size + " that cannot be repaired from a bank table"
);
process.exit(0);
