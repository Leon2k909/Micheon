#!/usr/bin/env node
/**
 * The pet's history has to show the conversation that actually happened.
 *
 * Answering "yes" to "do you remember this?" makes the pet reveal the answer
 * and ask again -- "It's 'Mach ich.' — did you have it?" -- because the first
 * yes is a guess about your own memory. That follow-up is a separate message.
 *
 * It was not treated as one. Repeat messages fold together inside a
 * half-hour window so the log does not fill with the same line, and the key
 * that decides "same message" was item + language only. The follow-up carries
 * the same item and language as the question it follows, so it folded straight
 * into it: one row instead of two, and the row inherited the earlier answer,
 * which meant the follow-up was recorded as answered before it was asked.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.join(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `export { appendPetMessage, messageSemanticKey } from "./src/components/codexPets/CodexPetProvider.tsx";`,
    resolveDir: root, sourcefile: "pet-history-check.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent", jsx: "automatic",
});
const compiled = new Module("pet-history-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "pet-history-check.js"));
const { appendPetMessage, messageSemanticKey } = compiled.exports;

let failures = 0;
const check = (name, ok, detail) => {
  if (ok) return void console.log("ok   " + name);
  failures += 1;
  console.error("FAIL " + name + (detail ? " — " + detail : ""));
};

const q = { itemId: "cb-mach-ich", answerLanguage: "de", de: "Mach ich.", en: "Will do." };
const T = 1770000000000;

// The exchange, exactly as the provider drives it.
let history = [];
history = appendPetMessage(history, {
  id: "1", createdAt: T, text: "Do you remember how to say “Will do.” in German?", question: { ...q },
});
history = appendPetMessage(history, { ...history[0], answer: "yes", answeredAt: T + 1500 });
const beforeAnswering = appendPetMessage(history, {
  id: "2", createdAt: T + 1700, text: "It’s “Mach ich.” — did you have it?", question: { ...q, confirm: true },
});

check(
  "the reveal-and-confirm follow-up is its own entry in the history",
  beforeAnswering.length === 2 && beforeAnswering.some((m) => m.question?.confirm),
  `${beforeAnswering.length} row(s)`
);
check(
  "the question it followed up is still there too",
  beforeAnswering.some((m) => m.question && !m.question.confirm),
);
const confirmRow = beforeAnswering.find((m) => m.question?.confirm);
check(
  "the follow-up arrives unanswered, rather than inheriting the earlier yes",
  confirmRow && confirmRow.answer === undefined,
  confirmRow ? `answer=${confirmRow.answer}` : "missing"
);
check(
  "asking and confirming are different messages",
  messageSemanticKey({ text: "", question: { ...q } })
    !== messageSemanticKey({ text: "", question: { ...q, confirm: true } }),
);

// The folding this key exists for still works.
let repeat = [];
repeat = appendPetMessage(repeat, { id: "a", createdAt: T, text: "Do you remember X?", question: { ...q } });
repeat = appendPetMessage(repeat, { id: "b", createdAt: T + 60_000, text: "Do you remember X?", question: { ...q } });
check("the same question asked twice in a row still folds into one entry", repeat.length === 1, `${repeat.length} rows`);

let later = [];
later = appendPetMessage(later, { id: "a", createdAt: T, text: "Do you remember X?", question: { ...q } });
later = appendPetMessage(later, { id: "b", createdAt: T + 31 * 60_000, text: "Do you remember X?", question: { ...q } });
check("the same question asked again much later is a new entry", later.length === 2, `${later.length} rows`);

let plain = [];
plain = appendPetMessage(plain, { id: "a", createdAt: T, text: "You did it!" });
plain = appendPetMessage(plain, { id: "b", createdAt: T + 5_000, text: "You did it!" });
check("repeated praise still folds", plain.length === 1, `${plain.length} rows`);

if (failures) {
  console.error(`\n${failures} pet-history regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log("\nthe pet's history records the exchange as it happened");
