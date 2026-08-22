#!/usr/bin/env node
/**
 * Changing language must not freeze the app.
 *
 * Measured on the click that picks a language: one blocked frame of 4,445ms.
 * Broken down by builder, of 3,195ms of it —
 *
 *     buildListenQueue   2,182ms   twice
 *     buildWordCatalog     507ms   twice
 *     rankWordCatalog      332ms   twice
 *     buildCatalog         174ms   four times
 *
 * Two causes. The word catalogue was rebuilt from the packs on every render
 * that wanted a word list, although it is a pure function of the packs and the
 * mode. And the Listen queue — twenty thousand items — was built for a screen
 * nobody was looking at, because ListenView stays mounted on every screen so
 * that playback survives navigating away.
 *
 * After: 1,471ms. This pins both fixes, and the property the second one must
 * not break — once opened, Listen keeps its queue when you navigate away.
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
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "switch-cost-entry.ts",
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

const compiled = new Module("switch-cost-check", module);
compiled.filename = path.join(root, ".switch-cost-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildWordCatalog } = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}

// ── the word catalogue is built once per parts map and mode ─────────────────
const first = buildWordCatalog(parts, "conversation");
assert.ok(first.length > 5000, `only ${first.length} words built`);

const again = buildWordCatalog(parts, "conversation");
assert.strictEqual(again, first,
  "the word catalogue is rebuilt on every call; a language switch does this several times in one frame");

// Timed, because identity could match while the work still happened.
const startedAt = process.hrtime.bigint();
for (let i = 0; i < 20; i += 1) buildWordCatalog(parts, "conversation");
const perCall = Number(process.hrtime.bigint() - startedAt) / 1e6 / 20;
assert.ok(perCall < 5, `a cached word catalogue still costs ${perCall.toFixed(1)}ms a call`);

// The mode is part of the answer: conversation and exam front different words,
// so one must never be served from a cache the other filled.
const exam = buildWordCatalog(parts, "exam");
assert.notStrictEqual(exam, first, "exam mode is being served the conversation catalogue");
assert.strictEqual(buildWordCatalog(parts, "exam"), exam, "the exam catalogue is not cached either");
assert.strictEqual(buildWordCatalog(parts, "conversation"), first,
  "caching one mode evicted the other, so switching modes rebuilds both every time");

// ── Listen builds its queue when opened, not when mounted ───────────────────
const view = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
assert.ok(/const \[everOpened, setEverOpened\] = useState\(active\)/.test(view),
  "ListenView no longer tracks whether it has been opened");
assert.ok(/everOpened\s*\?\s*buildListenQueue\(/.test(view),
  "the Listen queue is built on mount again — that is 2,182ms on every language change, "
  + "for a screen nobody is looking at");
assert.ok(/\[everOpened, apiParts/.test(view),
  "everOpened is not a dependency of the queue, so opening Listen would not build one");

// And the property the laziness must not break: this view is kept mounted so
// that playback survives navigating away, so the queue has to survive too.
assert.ok(/if \(active\) setEverOpened\(true\)/.test(view),
  "nothing latches everOpened, so navigating away would throw the queue away mid-playback");
assert.ok(!/setEverOpened\(false\)/.test(view),
  "everOpened is cleared somewhere, which would drop the queue while it is still playing");

console.log(
  `check-switch-cost: the word catalogue is built once per mode (${perCall.toFixed(2)}ms a call after), `
  + "and Listen builds its queue on first open rather than on mount"
);
process.exit(0);
