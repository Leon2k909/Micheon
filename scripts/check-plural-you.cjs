#!/usr/bin/env node
/**
 * When the German is aimed at a group, the card has to say so.
 *
 * German has three ways to say "you" — du, ihr and Sie — and English has one.
 * "Ist das alles, was ihr zu sagen habt?" shows as "Is that all you have to
 * say?", which is a correct translation and tells you nothing: not that it is
 * aimed at several people, and not which form to produce when typing it back.
 * Sie and du were labelled; ihr was not detected at all.
 *
 * The hard part is that "ihr" is three different words — "you all", "her", and
 * "their" — so it is not evidence on its own. What IS evidence: euch/euer,
 * which exist only in the second person plural, and verb forms whose
 * third-person singular differs (er hat / ihr habt). Both directions matter,
 * so this checks the false positives as carefully as the true ones.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.join(__dirname, "..");
const built = esbuild.buildSync({
  stdin: { contents: `export { detectRegister, REGISTER_LABEL } from "./src/lib/register.ts";`, resolveDir: root, sourcefile: "plural-check.ts" },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("plural-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "plural-check.js"));
const { detectRegister, REGISTER_LABEL } = compiled.exports;

let failures = 0;
const expect = (de, want) => {
  const got = detectRegister(de);
  if (got === want) return void console.log(`ok   ${String(want).padEnd(8)} ${de}`);
  failures += 1;
  console.error(`FAIL expected ${want}, got ${got} — ${de}`);
};

// ── the group, spotted ────────────────────────────────────────────────────
expect("Ist das alles, was ihr zu sagen habt?", "plural");
expect("Ihr seid ein wunderschönes Paar.", "plural");
expect("Wie ist das bei euch?", "plural");
expect("Habt ihr schon Tickets?", "plural");
expect("Was wollt ihr trinken?", "plural");
expect("Nehmt das bitte mit.", "plural");          // imperative to a group
expect("Und, wie war euer Ausflug an den See?", "plural");

// ── "ihr" that is NOT a group ─────────────────────────────────────────────
// This is where a lazy rule would fire and mislabel half the course.
expect("Ich helfe ihr.", null);                     // ihr = to her
expect("Ihr Auto steht dort.", null);               // ihr = her/their
expect("Ihre Mutter kommt morgen.", null);          // ihre = her/their
expect("Er hat ihr das Buch gegeben.", null);       // ihr = to her

// ── and the other two still work ──────────────────────────────────────────
expect("Können Sie mir helfen?", "formal");
expect("Wie geht es dir?", "informal");
expect("Das Wetter ist schön.", null);

// ── the label says which "you" it is ──────────────────────────────────────
if (!/group|you all/i.test(REGISTER_LABEL.plural ?? "")) {
  failures += 1;
  console.error("FAIL the plural label does not say it means a group");
} else {
  console.log("ok   the label names the distinction English cannot show");
}

if (failures) {
  console.error(`\n${failures} plural-you regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log("\nsentences aimed at a group are labelled, and 'ihr' meaning her/their is left alone");
