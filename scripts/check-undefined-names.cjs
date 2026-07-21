#!/usr/bin/env node
// Fails the build on "Cannot find name" errors (TS2304 / TS2552).
//
// Why this exists: a missing `Mic2` import shipped in v1.0.32. It rendered
// only inside Electron, so the browser preview never hit it, and
// `tsc --noEmit` was silently verifying NOTHING — TypeScript was aborting on
// two config-deprecation errors before it checked any source file. The result
// was a blank Profile settings page for every desktop user.
//
// The project still carries ~700 legacy type errors (mostly implicit any), so
// a plain "tsc must be clean" gate is not yet realistic. This narrows the gate
// to the one class that reliably breaks the app at runtime: an identifier that
// does not exist.
const { execFileSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
let out = "";
try {
  out = execFileSync("npx", ["tsc", "--noEmit"], { cwd: ROOT, encoding: "utf8", shell: true });
} catch (e) {
  out = String(e.stdout || "") + String(e.stderr || "");
}

// A config-level abort means tsc checked nothing at all — treat as failure.
const aborted = /error TS5(10[0-9]|1[0-9]{2})/.test(out) && !/^src\//m.test(out);
if (aborted) {
  console.error("tsc aborted on config errors before checking any source file:");
  console.error(out.split("\n").slice(0, 6).join("\n"));
  process.exit(1);
}

const bad = out.split("\n").filter((l) => /error TS(2304|2552):/.test(l));
if (bad.length) {
  console.error(`${bad.length} undefined-name error(s) — these crash at runtime:`);
  bad.forEach((l) => console.error("  " + l.trim()));
  process.exit(1);
}
console.log("no undefined-name errors");
