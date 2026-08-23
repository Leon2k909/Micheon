#!/usr/bin/env node
/**
 * The Create tab has to render, not merely compile.
 *
 * typecheck and vite both pass on a component that throws the moment React
 * calls it, and this one is worth checking because its card markup lives in a
 * closure now rather than inline in a map — a change that compiles cleanly and
 * would have failed on the first paint if anything it reads were out of scope.
 *
 * The five states are the ones with somewhere to go wrong: nothing at all, the
 * flat list everybody had before folders existed, a folder with something in
 * it, a set pointing at a folder that has been DELETED, and a folder with
 * nothing in it. The fourth is the one that matters — it is what a profile
 * looks like the moment somebody deletes a folder on another machine.
 *
 * Rendered to static markup rather than driven in a browser: no dev server, no
 * packaged app, and it runs in about a second inside the gate.
 */
const path = require("path");
const Module = require("module");
const root = path.resolve(__dirname, "..");
const esbuild = require(path.join(root, "node_modules/esbuild"));

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { CreateView } from "./src/components/create/CreateView.tsx";',
      'export { makeSet, makeFolder, saveStudySets, saveStudyFolders } from "./src/lib/studySets.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "render-create-entry.tsx",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  jsx: "automatic",
  write: false,
  logLevel: "silent",
  external: ["react", "react-dom", "react/jsx-runtime"],
  loader: { ".css": "empty", ".png": "empty", ".svg": "empty", ".json": "json" },
});

const stored = new Map();
const storage = {
  getItem: (k) => stored.get(k) ?? null,
  setItem: (k, v) => { stored.set(k, String(v)); },
  removeItem: (k) => { stored.delete(k); },
  clear: () => stored.clear(),
};
global.window = {
  localStorage: storage,
  addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  location: { search: "", href: "http://localhost/" },
  navigator: { language: "en-GB" },
};
global.localStorage = storage;
global.document = { documentElement: { dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, contains: () => false } }, addEventListener() {}, removeEventListener() {} };
global.navigator = { language: "en-GB" };

const compiled = new Module("render-create", module);
compiled.filename = path.join(root, ".render-create.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { CreateView, makeSet, makeFolder, saveStudySets, saveStudyFolders } = compiled.exports;

const React = require(path.join(root, "node_modules/react"));
const { renderToStaticMarkup } = require(path.join(root, "node_modules/react-dom/server"));

const scenarios = [
  ["no sets, no folders", () => { stored.clear(); }],
  ["sets, no folders", () => {
    stored.clear();
    const a = makeSet("Verbs", 1), b = makeSet("Food", 2);
    saveStudySets([a, b], null);
  }],
  ["sets in a folder, and one outside", () => {
    stored.clear();
    const f = makeFolder("Verbs", 1);
    const a = { ...makeSet("Strong verbs", 2), folderId: f.id };
    const b = makeSet("Loose", 3);
    saveStudySets([a, b], null);
    saveStudyFolders([f], null);
  }],
  ["a set pointing at a folder that is gone", () => {
    stored.clear();
    const a = { ...makeSet("Orphan", 1), folderId: "folder-that-never-was" };
    saveStudySets([a], null);
    saveStudyFolders([makeFolder("Real", 2)], null);
  }],
  ["an empty folder", () => {
    stored.clear();
    saveStudySets([makeSet("Outside", 1)], null);
    saveStudyFolders([makeFolder("Nothing in here", 2)], null);
  }],
];

let failed = 0;
for (const [name, seed] of scenarios) {
  seed();
  try {
    const html = renderToStaticMarkup(React.createElement(CreateView, { apiParts: {} }));
    const bits = {
      newFolder: html.includes("New folder"),
      moveUp: html.includes("Move up"),
      moveDown: html.includes("Move down"),
      select: html.includes("Move to folder"),
      chars: html.length,
    };
    console.log(`ok   ${name.padEnd(38)} ${bits.chars} chars  folder=${bits.newFolder} arrows=${bits.moveUp && bits.moveDown} select=${bits.select}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${name}`);
    console.log(`     ${String(error && error.message).split("\n")[0]}`);
  }
}
console.log(failed ? `\n${failed} scenario(s) threw` : "\nevery scenario rendered");
process.exit(failed ? 1 : 0);
