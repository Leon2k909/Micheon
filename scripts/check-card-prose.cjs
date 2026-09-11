#!/usr/bin/env node
/**
 * Card prose is translated by usageNote(), and uiOr() must never touch it.
 *
 * Three fields on a card are written prose rather than interface copy: `use`
 * (the note under the card), `when` (the moment you'd say it) and `say` (how
 * it really sounds). Fourteen thousand of them, in their own per-language
 * tables, loaded only by the screens that show a card.
 *
 * uiOr(value, germanFallback) returns
 *
 *     table[value] ?? table[germanFallback] ?? germanFallback
 *
 * and never the value it was handed. That is right for catalogue metadata,
 * whose English is a key in the INTERFACE table. It is fatal for card prose,
 * which is not: usageNote() hands back a sentence already in the reader's
 * language, uiOr looks that sentence up in the interface table, misses, and
 * draws the fallback label instead. The note is not shown in English — it is
 * replaced, and every card says the same thing.
 *
 * That is what the usage chip in the session did, from v1.0.37, which is older
 * than the note tables: in German it drew the literal words "Hinweis zur
 * Verwendung" over every card, and in the other six their translation of it.
 * The when- and say-boxes drew their two fallbacks the same way.
 *
 * So: no uiOr on card prose, and any file that reads a note subscribes to the
 * table landing — a plain lookup during render is stale until something
 * redraws, and a subscription in a child redraws only the child.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = walk(src);
assert.ok(files.length > 50, `only found ${files.length} source files — the scan is looking in the wrong place`);

/** The card fields that carry prose, by the shape they take at a call site. */
const PROSE = ["use", "when", "say", "rawUse", "tip"];
const isProse = (expression) => {
  const text = expression.trim();
  if (text.includes("usageNote(")) return "it is already translated";
  const last = text.split(".").pop();
  if (PROSE.includes(text) || PROSE.includes(last)) return "it is card prose, not interface copy";
  return null;
};

let failed = 0;
let checked = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).split("\\").join("/");
  // uiOr(<first argument>, — the argument is a plain expression at every call
  // site, so stopping at the first comma is enough and stays readable.
  for (const match of text.matchAll(/\buiOr\(\s*([^,()]*(?:\([^()]*\))?[^,()]*),/g)) {
    checked += 1;
    const why = isProse(match[1]);
    if (!why) continue;
    failed += 1;
    const line = text.slice(0, match.index).split("\n").length;
    console.error(`FAIL ${relative}:${line}  uiOr(${match[1].trim()}, …) — ${why}`);
  }
}

assert.ok(checked > 8, `only found ${checked} uiOr call(s) — the scan is not reading the call sites`);

// The other half: a screen that reads a note must redraw when its table lands.
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).split("\\").join("/");
  if (relative === "src/lib/usageNotes.ts") continue;
  if (!/\busageNote\(/.test(text)) continue;
  if (/\buseUsageNotes\(\)/.test(text)) continue;
  failed += 1;
  console.error(`FAIL ${relative} reads a note but never calls useUsageNotes(), so it keeps the English it first painted`);
}

// And the three render sites themselves, named, so a rewrite has to think.
const guided = fs.readFileSync(path.join(src, "GuidedSession.tsx"), "utf8");
for (const needle of ["{usageNote(item.when)}", "{usageNote(item.say)}"]) {
  if (guided.includes(needle)) continue;
  failed += 1;
  console.error(`FAIL GuidedSession.tsx no longer draws ${needle} — the box is back to a fallback label`);
}

if (failed) {
  console.error(
    "\nuiOr never returns the value it was handed. Card prose comes back from usageNote() already\n"
    + "translated, so passing it on means the translation is discarded and every card reads alike."
  );
  process.exit(1);
}

console.log(
  `check-card-prose: none of the ${checked} uiOr call sites is handed card prose, `
  + "and every screen that reads a note subscribes to its table"
);
