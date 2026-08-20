#!/usr/bin/env node
/**
 * The speech bubble is only as wide as the message needs.
 *
 * This has now been wrong in both directions, which is why it is pinned by
 * behaviour rather than by reading the source for a number.
 *
 * First it was 240 for everything, and German would not fit: "die
 * Haftpflichtversicherung" broke mid-syllable as "Haftpflichtversicher / ung".
 * So it went to 320 — for everything — and then a four-word question sat in a
 * box built for two paragraphs, which reads as a dialog rather than a remark.
 *
 * The rule is that a message EARNS the width. A newline means Listen's
 * bilingual caption, which formatListenPetCaption builds as `de\n\nen` and
 * which genuinely wants the room. A word too long for the narrow text column
 * means a German compound. Anything else keeps the everyday size.
 *
 * Both halves are checked against real inputs, including the caption built by
 * the real Listen formatter rather than a newline typed in here — if that
 * function ever stops emitting a blank line, this should fail.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { petBubbleMaxWidth } from "./src/components/codexPets/CodexPetLayer.tsx";',
      'export { formatListenPetCaption } from "./src/lib/listenMode.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "pet-bubble-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("pet-bubble", module);
compiled.filename = path.join(root, ".pet-bubble.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { petBubbleMaxWidth, formatListenPetCaption } = compiled.exports;

const NARROW = 240;
const WIDE = 320;

// ── ordinary messages stay narrow ─────────────────────────────────────────
// The first of these is the exact bubble Leon photographed to say it was too
// big. If it ever returns the wide size again, that screenshot is back.
for (const [text, why] of [
  ['Do you remember what "Ihr könnt das." means?', "the reported bubble"],
  ["Nice work!", "a two-word remark"],
  ['Do you remember what "Guten Morgen" means?', "a typical quiz prompt"],
  ["Ich gehe gerne ins Kino.", "an ordinary sentence"],
  ["", "no message at all"],
]) {
  assert.strictEqual(
    petBubbleMaxWidth(text),
    NARROW,
    `${why} should keep the everyday ${NARROW}px bubble — got ${petBubbleMaxWidth(text)}`
  );
}

// ── Listen's bilingual caption earns the width ────────────────────────────
// Built by the real formatter, so this also guards the blank line it emits.
const item = { de: "Ich gehe gerne ins Kino.", en: "I like going to the cinema." };
const bilingual = formatListenPetCaption(item, item.de, true);
assert.ok(bilingual.includes("\n"), "the bilingual Listen caption should still be multi-line");
assert.strictEqual(
  petBubbleMaxWidth(bilingual),
  WIDE,
  "Listen's two-language caption is the case the wide bubble exists for"
);

// ...but the same caption with one language is an ordinary message again.
assert.strictEqual(
  petBubbleMaxWidth(formatListenPetCaption(item, item.de, false)),
  NARROW,
  "a single-language Listen caption is one line and needs no extra width"
);

// ── German compounds earn it too ──────────────────────────────────────────
// These are the exact words that justified widening the bubble originally.
for (const compound of [
  "die Haftpflichtversicherung",
  "Rechtsschutzversicherung",
  "Mindesthaltbarkeitsdatum",
  "Beitragsbemessungsgrenze",
]) {
  assert.strictEqual(
    petBubbleMaxWidth(compound),
    WIDE,
    `"${compound}" does not fit the narrow column and must widen the bubble`
  );
}

console.log(
  "check-pet-bubble: ordinary messages keep 240px; Listen's bilingual caption "
  + "and long German compounds earn 320px"
);
