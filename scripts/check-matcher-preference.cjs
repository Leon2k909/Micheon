#!/usr/bin/env node
/**
 * The Matcher opens on the list you were last using.
 *
 * Each list already kept its own place, its own misses and its own streak, so
 * the mode looked like it remembered everything — but not which list was open.
 * It opened on Words every time, and anyone working through the sentences had
 * to say so again on every visit.
 *
 * Checked by running the real store rather than by reading the source: what
 * matters is that a written preference comes back, including across the
 * separations that already exist here — one course must not answer for
 * another, and one profile must not answer for another.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { getMatcherKind, setMatcherKind, getMatcherCursor, setMatcherCursor } from "./src/lib/matcher.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "matcher-preference-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("matcher-preference-check", module);
compiled.filename = path.join(root, ".matcher-preference-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { getMatcherKind, setMatcherKind } = compiled.exports;

// Scoped on profile.id, which is what getScopedKey reads.
const learner = { id: "one", email: "one@example.com" };
const other = { id: "two", email: "two@example.com" };

// Nothing chosen yet: Words, because a first visit has to open on something.
stored.clear();
assert.strictEqual(getMatcherKind("learn-de", learner), "words",
  "the first visit should open on Words");

// The whole point.
setMatcherKind("sentences", "learn-de", learner);
assert.strictEqual(getMatcherKind("learn-de", learner), "sentences",
  "choosing Sentences does not survive, which is the bug this exists for");

// And back again, so it is a preference rather than a one-way door.
setMatcherKind("words", "learn-de", learner);
assert.strictEqual(getMatcherKind("learn-de", learner), "words", "choosing Words back does not survive");

// One course must not answer for another: somebody learning German through
// sentences and English through words wants both remembered.
setMatcherKind("sentences", "learn-de", learner);
setMatcherKind("words", "learn-en", learner);
assert.strictEqual(getMatcherKind("learn-de", learner), "sentences", "the other course overwrote this one");
assert.strictEqual(getMatcherKind("learn-en", learner), "words", "the two courses share one preference");

// Nor one profile for another — this app is shared.
assert.strictEqual(getMatcherKind("learn-de", other), "words",
  "one profile's choice leaked into another's");
setMatcherKind("sentences", "learn-de", other);
assert.strictEqual(getMatcherKind("learn-de", learner), "sentences", "the second profile overwrote the first");

// A corrupted or unknown value is the default, not a crash and not a blank
// screen — the same rule every other preference here follows.
stored.set("gl-matcher-kind-v1:learn-de:one", JSON.stringify("phrases"));
assert.strictEqual(getMatcherKind("learn-de", learner), "words", "an unknown stored value should read as the default");
stored.set("gl-matcher-kind-v1:learn-de:one", "{not json");
assert.strictEqual(getMatcherKind("learn-de", learner), "words", "a corrupt preference should read as the default");

// ── and the view has to actually use it ─────────────────────────────────────
const view = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
assert.ok(/useState<MatcherKind>\(\(\) => getMatcherKind\(/.test(view),
  "the view still opens on a hardcoded list, or reads the preference too late to matter");
assert.ok(/setMatcherKind\(next, direction, profile\)/.test(view),
  "switching lists does not write the preference, so it is forgotten again");
// Resolved during the first render, not in an effect: an effect would draw
// Words first and swap, which flashes the wrong list on every visit.
assert.ok(!/useEffect\([^)]*setKind\(getMatcherKind/.test(view),
  "the preference is applied after the first paint, which flashes the wrong list");

console.log(
  "check-matcher-preference: the chosen list survives a restart, per course and per profile, "
  + "and a corrupt value reads as Words"
);

// Writing a scoped preference schedules the shared-items sync, which outside a
// browser fails and retries on a growing delay — it would keep the build
// waiting for ever. The check is finished; say so rather than letting the
// event loop decide. check-matcher ends the same way, for the same reason.
process.exit(0);
