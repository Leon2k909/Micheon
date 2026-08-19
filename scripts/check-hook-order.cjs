#!/usr/bin/env node
/**
 * No React hook below an early return.
 *
 * This is the bug that took the app down in 1.2.346. A useState was added next
 * to the code that used it, which happened to be below `if (!selectedPet)
 * return null`. With no pet selected the component returned before reaching
 * the hook; with one, it did not. React counts hooks per render, saw the count
 * change, and threw error #310 — "rendered more hooks than during the previous
 * render". The whole screen went to the crash boundary.
 *
 * eslint-plugin-react-hooks is installed and would have caught it, but the
 * config matches src/**\/*.{js,jsx} while this codebase is entirely .ts/.tsx,
 * so the rule has never run on a single application file — and `npm run lint`
 * is not part of the build either. Running typescript-eslint across the whole
 * project is worth doing and is a bigger job than this; until then, this
 * catches the one shape that actually caused a crash.
 *
 * Scope: a component is a top-level function, its body is indented two spaces,
 * and both the guard and the hooks that matter live at that indent. Anything
 * deeper belongs to a nested callback and is a different question — which is
 * exactly the distinction the first version of this check got wrong, so it
 * reported success on the very bug it was written for.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const COMPONENT = /^(?:export\s+)?(?:default\s+)?(?:function|const)\s+[A-Z]\w*/;
const BODY_GUARD = /^ {2}if\s*\(.*\)\s*return\b/;
const BODY_HOOK = /^ {2}(?:const\s*[[{]?[^=]*?=\s*)?(use[A-Z]\w*)\s*\(/;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const problems = [];
for (const file of walk(path.join(root, "src"))) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let guardLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Each top-level component is judged on its own body.
    if (COMPONENT.test(line)) {
      guardLine = 0;
      continue;
    }
    if (!guardLine && BODY_GUARD.test(line)) {
      guardLine = i + 1;
      continue;
    }
    if (!guardLine) continue;

    const hook = BODY_HOOK.exec(line);
    if (!hook) continue;
    problems.push(
      `${path.relative(root, file).replace(/\\/g, "/")}:${i + 1} — ${hook[1]} runs only when the `
      + `guard on line ${guardLine} does not return, so the hook count changes between renders`
    );
  }
}

if (problems.length) {
  console.error("FAIL check-hook-order");
  problems.forEach((p) => console.error("  " + p));
  console.error("\n  Move the hook above the early return. A hook runs on every render of a");
  console.error("  component or on none of them — there is no conditional version.");
  process.exit(1);
}

console.log(`check-hook-order: no React hook sits below an early return`);
