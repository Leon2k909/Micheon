#!/usr/bin/env node
/**
 * A crash has to leave evidence and a way out.
 *
 * Two mid-lesson failures arrived as "something is causing an app crash" and a
 * screenshot of an empty window: no OS event, no dump, no log, no boundary —
 * nothing to debug from. The blank screen was the entire bug report. This
 * gate holds the machinery that turns the next one into a stack trace:
 * global hooks, a root error boundary, a main-process log for a dead
 * renderer, and the guided session's refusal to sit on a phase that renders
 * nothing.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

// ── the reporter itself works, and survives a broken store ────────────────
const built = esbuild.buildSync({
  entryPoints: [path.join(root, "src/lib/crashReport.ts")],
  bundle: true, format: "cjs", platform: "node", write: false, logLevel: "silent",
  alias: { "@": path.join(root, "src") },
});
const compiled = new Module("crash-check", module);
compiled.filename = path.join(root, ".crash-check.cjs");
compiled.paths = Module._nodeModulePaths(root);

const store = new Map();
global.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { recordCrash, readCrashReports } = compiled.exports;

// The reporter mirrors every record to console.error; that is thirty lines of
// noise in a gate run, and none of it is this gate's verdict.
const realConsoleError = console.error;
console.error = () => {};

recordCrash({ kind: "render", message: "first", stack: "Error: first\n  at x" });
recordCrash({ kind: "error", message: "second" });
const reports = readCrashReports();
assert.equal(reports.length, 2);
assert.equal(reports[0].message, "second", "newest report must come first");
assert.equal(reports[1].stack, "Error: first\n  at x");
assert(reports.every((r) => typeof r.at === "string" && !Number.isNaN(Date.parse(r.at))));

// Twenty reports, then the oldest fall off — a crash loop must not eat storage.
for (let i = 0; i < 30; i += 1) recordCrash({ kind: "error", message: `loop ${i}` });
assert.equal(readCrashReports().length, 20, "the report list must stay bounded");

// A reporter that throws erases the evidence it exists to keep.
global.localStorage = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
assert.doesNotThrow(() => recordCrash({ kind: "error", message: "storage down" }));
assert.deepEqual(readCrashReports(), []);
delete global.localStorage;
console.error = realConsoleError;

// ── the boundary wraps the whole app, and the hooks are installed ─────────
const main = read("src/main.tsx");
assert(/<AppErrorBoundary>[\s\S]*<App \/>[\s\S]*<\/AppErrorBoundary>/.test(main),
  "the error boundary does not wrap the app, so a render throw still blanks the window");
assert(main.includes("installGlobalCrashHooks()"), "nothing catches errors outside React");

const boundary = read("src/components/AppErrorBoundary.tsx");
assert(boundary.includes("getDerivedStateFromError"), "the boundary cannot enter its failed state");
assert(boundary.includes("componentDidCatch") && boundary.includes("recordCrash"),
  "a caught render error is not recorded, so the crash screen destroys the evidence");
assert(boundary.includes("window.location.reload()"), "the crash screen offers no way out");
// Bilingual by hand: the i18n layer belongs to the app that just failed, so
// the boundary must not import it (or anything beyond React and the reporter).
assert(boundary.includes("Etwas ist schiefgelaufen"), "the crash screen lost its German half");
const boundaryImports = [...boundary.matchAll(/from "([^"]+)"/g)].map((m) => m[1]);
assert.deepEqual(
  boundaryImports.filter((s) => s !== "react" && s !== "@/lib/crashReport"),
  [],
  "the crash screen depends on the app it is standing in for"
);

// The screen must not lean on tokens scoped to a shell that may be the thing
// that failed — the same mistake that once made the loading screen flash.
const css = read("src/index.css");
const crashRules = [...css.matchAll(/\.app-crash[^{]*\{([^}]*)\}/g)].map((m) => m[1]);
assert(crashRules.length >= 6, "the crash screen has no styling");
for (const body of crashRules) {
  assert(!body.includes("var(--"), "the crash screen uses a token that may not exist where it renders");
}
assert(/html\[data-theme="dark"\][^{]*\.app-crash/.test(css), "the crash screen has no dark variant");

// ── a dead renderer is logged and reloaded, not left as a frozen window ───
const electronMain = read("electron/main.js");
const gone = electronMain.indexOf('mainWindow.webContents.on("render-process-gone"');
assert(gone !== -1, "the main window still has no render-process-gone handler — only the pet overlay ever did");
const handler = electronMain.slice(gone, gone + 900);
assert(handler.includes("renderer-crash.log"), "a dead renderer leaves no log line");
assert(handler.includes("webContents.reload()"), "a dead renderer leaves a frozen window");
assert(electronMain.includes('"unresponsive"'), "a hung renderer is not even logged");

// ── the guided session cannot sit on a phase that renders nothing ─────────
const guided = read("src/GuidedSession.tsx");
assert(guided.includes("route.includes(phase)") && guided.includes("is not in the current route"),
  "an impossible phase still renders a blank stage with a live header");

console.log("check-crash-visibility: the next crash leaves a report, shows a recovery screen in both themes, and a dead renderer reloads instead of freezing");
