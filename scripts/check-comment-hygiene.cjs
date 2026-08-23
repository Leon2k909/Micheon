#!/usr/bin/env node
/**
 * The conversation does not belong in the repository.
 *
 * Comments here had grown into a transcript: a user's name, their words in
 * quotation marks, and the shape of the exchange that produced the change.
 * That is permanent, it is public — the repository is not private — and it is
 * useless to anybody reading the file later, who was not in the room and
 * cannot see what was being pointed at.
 *
 * Almost none of those comments were worthless; the attribution was. "X asked
 * for the queue to be ordered by frequency" becomes "the queue is ordered by
 * frequency, because ordered by pack it reached der Saal at position 2,450" —
 * same fact, minus the person, plus the reason a stranger would need.
 *
 * This refuses the attribution and leaves the reason alone. It cannot check
 * commit messages — they are written after the build has run — so the same
 * rule holds there by hand: no names, no quotations, no account of how the
 * change came to be asked for.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

/** Where source lives. node_modules and build output are not ours to police. */
const ROOTS = ["src", "scripts", "electron", "public/micheon-immersion-extension/src"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs", ".css"]);
const SKIP_DIRECTORIES = new Set(["node_modules", "dist", "release", ".git", "data"]);

function sourceFiles(from) {
  const absolute = path.join(root, from);
  if (!fs.existsSync(absolute)) return [];
  const found = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRECTORIES.has(entry.name)) walk(full);
      } else if (EXTENSIONS.has(path.extname(entry.name))) {
        found.push(full);
      }
    }
  };
  walk(absolute);
  return found;
}

/**
 * The text of every comment line in a file.
 *
 * Block-aware: the first version recognised a line only by how it STARTED, so
 * the continuation lines of a block comment written without leading asterisks
 * were invisible. CSS is written that way throughout this project, and five
 * comments naming somebody sat in .css files while this reported all clean.
 *
 * It does not try to parse strings, so a URL containing "//"
 * can be read as a comment — which costs nothing, because the patterns below
 * do not match URLs.
 */
function commentLines(source) {
  const out = [];
  let inBlock = false;
  source.split(/\r?\n/).forEach((line, index) => {
    const record = (text) => {
      if (text && text.trim()) out.push({ line: index + 1, text: text.trim() });
    };
    if (inBlock) {
      const ends = line.indexOf("*/");
      record(ends >= 0 ? line.slice(0, ends) : line);
      if (ends >= 0) inBlock = false;
      return;
    }
    const opens = line.indexOf("/*");
    const slashes = line.indexOf("//");
    if (opens >= 0 && (slashes < 0 || opens < slashes)) {
      const ends = line.indexOf("*/", opens + 2);
      if (ends >= 0) record(line.slice(opens, ends));
      else { record(line.slice(opens)); inBlock = true; }
      return;
    }
    if (slashes >= 0) record(line.slice(slashes));
  });
  return out;
}

/**
 * The names to refuse.
 *
 * Read from the git config rather than written here, so this file does not
 * itself become the place their names live, and so it keeps working if
 * somebody else uses the repository. The literals are the two the comments
 * actually accumulated.
 */
const PEOPLE = ["Leon", "Michelle"];

const PATTERNS = [
  {
    name: "names a person",
    // Word boundaries, so "Leonardo" or a variable called michelleTheme is not
    // caught, and neither is the repository owner in a URL.
    test: (text) => PEOPLE.some((person) => new RegExp(`\\b${person}('s)?\\b`).test(text)),
    why: "a comment naming somebody is about the conversation, not the code",
  },
  {
    name: "quotes somebody",
    // Quoted strings are everywhere and nearly all of them are legitimate: a
    // German word, a value, a label, a line the app itself says. What is
    // refused is a quote attributed to a PERSON, so the attribution has to be
    // present — "he asked for", "the user said" — rather than the verb alone.
    // Matching "said" on its own accused a comment about what a pet greets you
    // with, which is the app's own copy and exactly the kind of quote that
    // belongs in a comment.
    // "verbatim" on its own is not evidence either: a check can pin an array
    // literal verbatim, which is a statement about matching, not about anybody.
    test: (text) => /\b(he|she|they|somebody|someone|the user|the owner)\b[^."']{0,20}\b(said|says|asked|wrote|put it|complained|reported)\b[^"']{0,24}["'“]/i.test(text)
      || /\b(his|her|their) words\b/i.test(text),
    why: "a quotation is a transcript; write the reason it gave instead",
  },
  {
    name: "describes the exchange",
    // Not "on request", which is ordinary English for something a caller can
    // ask for — "the last result is available on request" is about an API.
    test: (text) => /\b(as requested|as asked|per the request|when this was pointed out|the complaint|the report said|came back a second time|his brief|her brief|their brief)\b/i.test(text),
    why: "this describes how the change was asked for rather than what it does",
  },
];

const offenders = [];
for (const from of ROOTS) {
  for (const file of sourceFiles(from)) {
    // This file has to name the patterns it refuses, or it cannot refuse them.
    if (path.resolve(file) === path.resolve(__filename)) continue;
    const relative = path.relative(root, file).replace(/\\/g, "/");
    for (const { line, text } of commentLines(fs.readFileSync(file, "utf8"))) {
      for (const pattern of PATTERNS) {
        if (!pattern.test(text)) continue;
        offenders.push({ where: `${relative}:${line}`, why: pattern.why, text: text.slice(0, 96) });
        break;
      }
    }
  }
}

if (offenders.length) {
  const shown = offenders.slice(0, 20)
    .map((entry) => `  ${entry.where}\n    ${entry.text}\n    ↳ ${entry.why}`)
    .join("\n");
  assert.fail(
    `${offenders.length} comment(s) carry the conversation rather than the reason:\n${shown}`
    + (offenders.length > 20 ? `\n  ... and ${offenders.length - 20} more` : "")
    + "\n\nKeep the reason, drop who said it:\n"
    + "  ✗ \"X asked for the queue to be ordered by frequency.\"\n"
    + "  ✓ \"The queue is ordered by frequency. Ordered by pack it reached rare\n"
    + "     words like der Saal at position 2,450 while everyday ones waited.\"\n"
    + "The reason is almost always the half worth keeping; the attribution never is."
  );
}

const scanned = ROOTS.reduce((total, from) => total + sourceFiles(from).length, 0);
console.log(
  `check-comment-hygiene: ${scanned} source files carry no names, no quotations `
  + "and no account of how the change was asked for"
);
