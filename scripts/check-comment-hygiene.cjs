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
 * commit messages, which are written after the build runs; CLAUDE.md carries
 * that half.
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
 * A line inside a comment, or the comment part of a line of code.
 *
 * Deliberately simple: a leading //, a leading * inside a block, or a //
 * following code. It does not try to parse strings, so a URL containing "//"
 * can be read as a comment — which costs nothing, because the patterns below
 * do not match URLs.
 */
function commentText(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return trimmed;
  const slashes = line.indexOf("//");
  if (slashes >= 0) return line.slice(slashes);
  return null;
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
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      const text = commentText(line);
      if (!text) return;
      for (const pattern of PATTERNS) {
        if (!pattern.test(text)) continue;
        offenders.push({ where: `${relative}:${index + 1}`, why: pattern.why, text: text.trim().slice(0, 96) });
        return;
      }
    });
  }
}

if (offenders.length) {
  const shown = offenders.slice(0, 20)
    .map((entry) => `  ${entry.where}\n    ${entry.text}\n    ↳ ${entry.why}`)
    .join("\n");
  assert.fail(
    `${offenders.length} comment(s) carry the conversation rather than the reason:\n${shown}`
    + (offenders.length > 20 ? `\n  ... and ${offenders.length - 20} more` : "")
    + "\n\nSee CLAUDE.md — keep the why, drop who said it."
  );
}

// The rule itself has to be written down somewhere a reader will find it, and
// somewhere the next session loads without being asked.
const guidance = fs.readFileSync(path.join(root, "CLAUDE.md"), "utf8");
assert.ok(/Do not put the conversation in the repository/.test(guidance),
  "CLAUDE.md no longer carries the rule this check enforces");
assert.ok(/Comments earn their place/.test(guidance),
  "CLAUDE.md no longer says when a comment is worth writing");

const scanned = ROOTS.reduce((total, from) => total + sourceFiles(from).length, 0);
console.log(
  `check-comment-hygiene: ${scanned} source files carry no names, no quotations `
  + "and no account of how the change was asked for"
);
