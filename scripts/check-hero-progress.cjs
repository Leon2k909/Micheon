#!/usr/bin/env node
/**
 * The course hero answers "how much longer on this pack?", not "how much XP?".
 *
 * The hero used to show progress to the next XP level — a number the right
 * rail already displays twice on the same screen, and one that answers a
 * question nobody asks mid-lesson. It now reports the pack actually being
 * worked through, in the units the app runs on: phrases, and sittings of three.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");

const failures = [];

const built = esbuild.buildSync({
  stdin: {
    contents: `export { activePackProgress } from "./src/lib/packProgress.ts";`,
    resolveDir: root,
    sourcefile: "hero-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-hero.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
global.window = undefined;
mod._compile(built.outputFiles[0].text, path.join(root, "check-hero.entry.cjs"));
const { activePackProgress } = mod.exports;

// ── it survives having nothing to say ─────────────────────────────────────
if (activePackProgress({}, null) !== null) {
  failures.push("with no catalogue loaded it must return null so the hero falls back rather than showing zeroes");
}
if (activePackProgress(null, null) !== null) {
  failures.push("a missing catalogue should not throw");
}

// ── and reports the first unfinished pack, in curriculum order ────────────
const parts = {
  "cb-greetings": {
    theme: "Greetings & politeness", level: "A1",
    phrases: [
      { de: "Hallo.", en: "Hello." },
      { de: "Guten Morgen.", en: "Good morning." },
      { de: "Bis später.", en: "See you later." },
      { de: "Danke schön.", en: "Thank you." },
    ],
  },
};
const fresh = activePackProgress(parts, null);
if (!fresh) {
  failures.push("a pack with unlearned phrases should be reported as the active one");
} else {
  if (fresh.title !== "Greetings & politeness") {
    failures.push(`the hero would name the pack "${fresh.title}" instead of its own title`);
  }
  if (fresh.total !== 4 || fresh.done !== 0) {
    failures.push(`counted ${fresh.done}/${fresh.total} in a 4-phrase pack nothing has been learned from`);
  }
  if (fresh.percent !== 0) failures.push("an untouched pack should read 0%");
  // Four phrases at three new a sitting is two sittings, not one and not four.
  if (fresh.sittingsLeft !== 2) {
    failures.push(`4 phrases at 3 a sitting should be 2 sittings, got ${fresh.sittingsLeft}`);
  }
}

// ── the hero actually uses it, and the XP line is gone ────────────────────
const proto = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
if (!/activePackProgress\(apiParts, profile\)/.test(proto)) {
  failures.push("nothing computes the pack progress, so the hero has nothing to show");
}
if (!/packProgress\.sittingsLeft/.test(proto) || !/packProgress\.total/.test(proto)) {
  failures.push("the hero never says how many phrases or sittings are left");
}
if (!/packProgress\s*\?\s*packProgress\.percent\s*:\s*pct/.test(proto)) {
  failures.push("the bar still fills from XP rather than from the pack");
}
// The fallback has to survive: before the catalogue loads there is no pack.
if (!/of \$\{needed\.toLocaleString\(\)\} XP/.test(proto)) {
  failures.push("the XP fallback was removed, so the hero shows nothing at all before the catalogue loads");
}

if (failures.length) {
  console.error("FAIL check-hero-progress");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-hero-progress: the hero names the pack in progress and counts down in phrases and sittings (${fresh.total} phrases -> ${fresh.sittingsLeft} sittings), with the XP line kept only as a fallback`);
