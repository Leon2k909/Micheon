#!/usr/bin/env node
/**
 * Every CSS variable a stylesheet or component reads must actually exist.
 *
 * An undefined custom property does not error, warn, or fall back to anything
 * useful — `background: var(--danger-bg)` with no --danger-bg is simply
 * transparent, and `color-mix(in srgb, var(--border-strong) 48%, transparent)`
 * makes the whole box-shadow invalid and drops it. The result looks like a
 * design decision rather than a bug, which is why these survived: the delete
 * confirmation on a study set rendered as two lines of bare text on a panel
 * the same colour as the card, and read as a flat style rather than as three
 * missing tokens.
 *
 * Uses with a fallback — var(--x, #fff) — are fine by construction and are not
 * checked. Properties set from JavaScript count as defined, because that is
 * where the accent colour and the pet positions come from.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "src");

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|css)$/.test(entry.name)) files.push(full);
  }
})(source);

const defined = new Set();
const used = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  // Declared in a stylesheet, or in an inline style object, or set at runtime.
  for (const match of text.matchAll(/(--[a-z0-9][a-z0-9-]*)\s*:/gi)) defined.add(match[1]);
  for (const match of text.matchAll(/setProperty\(\s*[`'"](--[a-z0-9-]+)/gi)) defined.add(match[1]);
  for (const match of text.matchAll(/[`'"](--[a-z0-9-]+)[`'"]\s*:/gi)) defined.add(match[1]);
  // Read WITHOUT a fallback. var(--x, something) survives a missing token.
  for (const match of text.matchAll(/var\((--[a-z0-9][a-z0-9-]*)\s*([,)])/gi)) {
    if (match[2] === ",") continue;
    const list = used.get(match[1]) ?? [];
    list.push(path.relative(root, file));
    used.set(match[1], list);
  }
}

/**
 * Debt this check found rather than caused, left named instead of quietly
 * allowed. Every one of these renders as nothing today; they are in files
 * this change did not touch, so they are recorded rather than guessed at.
 */
const KNOWN_MISSING = new Set([
  "--accent-hover-rgb", "--accent-ink", "--accent-rgb",
  "--border-1", "--h", "--i",
]);

const missing = [...used.keys()].filter((token) => !defined.has(token)).sort();
const fresh = missing.filter((token) => !KNOWN_MISSING.has(token));

assert.deepStrictEqual(
  fresh.map((token) => `${token} (read in ${[...new Set(used.get(token))].join(", ")})`),
  [],
  "a CSS variable is read with no fallback and never defined — it renders as nothing"
);

// And the debt must shrink rather than be topped up: a token that gets defined
// should leave the list, not sit on it forever.
const stale = [...KNOWN_MISSING].filter((token) => !missing.includes(token));
assert.deepStrictEqual(stale, [],
  "these are on the known-missing list but are now defined — take them off it");

// The pair that started this, pinned by name in every theme that has colours.
const css = fs.readFileSync(path.join(source, "index.css"), "utf8");
const successBlocks = (css.match(/--success-bg:/g) ?? []).length;
for (const token of ["--danger-bg", "--danger-text", "--danger-border"]) {
  const count = (css.match(new RegExp(`${token}:`, "g")) ?? []).length;
  assert.strictEqual(count, successBlocks,
    `${token} is defined ${count} times but --success-bg ${successBlocks} — every theme needs both`);
}

console.log(
  `check-css-tokens: ${used.size} variables read across ${files.length} files, `
  + `all defined (${KNOWN_MISSING.size} known-missing still to clear)`
);
