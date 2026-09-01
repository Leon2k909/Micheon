#!/usr/bin/env node
/**
 * Nothing is kept that nothing uses.
 *
 * The compiler now refuses an unused local, parameter or import — that is
 * noUnusedLocals and noUnusedParameters in tsconfig, and it is the guarantee
 * for everything inside a file. This holds the two things the compiler cannot
 * see across files:
 *
 *   1. A package in package.json that nothing imports. Five had accumulated —
 *      three Radix primitives, a grid layout and its types — installed for
 *      something that was later removed, and shipped in every install since.
 *
 *   2. An export in src/ that nothing imports. The compiler is silent on these
 *      because an export is, by definition, "used" from its own module's
 *      point of view. 255 of them had accumulated, and once the export was
 *      taken off, 107 turned out to be used by nothing at all — two data
 *      tables, five remote fetchers in an offline app, ten functions of a
 *      quiz feature no screen calls.
 *
 * "Used" is measured across src/, scripts/, electron/ and server/, because
 * the gate's checks bundle src/ through esbuild and the Electron main loads
 * the server — both are real consumers, and a scanner that cannot see them
 * calls 179 live exports dead. A re-export list, a default export and an
 * entry point are out of scope on purpose: each is a module shape, not a
 * symbol, and un-exporting one is a decision.
 *
 * The tree is read ONCE into a word index. The first draft ran one grep per
 * export — two thousand process spawns — and timed out before it reported.
 */
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// ── one pass over the tree ──────────────────────────────────────────────────
const CODE = /\.(ts|tsx|cjs|mjs|js|json)$/u;
const walk = (dir, out = []) => {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel, out);
    else if (CODE.test(e.name)) out.push(rel);
  }
  return out;
};
const files = [...walk("src"), ...walk("scripts"), ...walk("electron"), ...walk("server")];
const wordsOf = new Map(); // file -> Set of identifier-shaped words
const textOf = new Map();
for (const rel of files) {
  const text = read(rel);
  textOf.set(rel, text);
  wordsOf.set(rel, new Set(text.match(/[A-Za-z_$][\w$]*/gu) ?? []));
}
const usedOutside = (name, own) => {
  for (const [rel, words] of wordsOf) if (rel !== own && words.has(name)) return true;
  return false;
};

// ── 1. every package is imported somewhere ──────────────────────────────────
const pkg = JSON.parse(read("package.json"));
const scriptsText = Object.values(pkg.scripts ?? {}).join("\n");
const configText = [
  "vite.config.ts", "vite.config.mts", "vite.config.js", "tailwind.config.js", "tailwind.config.ts",
  "postcss.config.js", "postcss.config.cjs", "eslint.config.js", "eslint.config.mjs", "electron-builder.yml", "electron-builder.json",
].filter((f) => fs.existsSync(path.join(root, f))).map(read).join("\n");
/** Consumed by a tool by name rather than by an import statement. */
const TOOLING = new Set([
  "typescript", "vite", "electron", "electron-builder", "esbuild", "tailwindcss", "postcss", "autoprefixer",
  "@vitejs/plugin-react", "concurrently", "wait-on", "cross-env", "eslint", "globals",
]);
const allText = [...textOf.values()].join("\n");
/**
 * Consumed by PATH rather than by an import string, so no "name" appears to
 * find. Each entry names the consumer, and the consumer is asserted to still
 * mention the package — an allowance that outlives its reason is how an
 * unused package gets back in.
 */
const BY_PATH = {
  "@twemoji/svg": { consumer: "scripts/build-word-pictures.cjs", mentions: "twemoji" },
};
for (const [dep, { consumer, mentions }] of Object.entries(BY_PATH)) {
  const text = textOf.get(consumer) ?? "";
  check(`${dep} is still consumed by ${consumer}`, text.includes(mentions),
    `the allowance for ${dep} names a consumer that no longer mentions it — drop the package or the allowance`);
}
const unusedPackages = [];
for (const dep of Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) })) {
  if (TOOLING.has(dep) || BY_PATH[dep] || dep.startsWith("@types/") || dep.startsWith("eslint-") || dep.startsWith("@eslint/")) continue;
  if (scriptsText.includes(dep) || configText.includes(dep)) continue;
  // Imported or required as "dep" or "dep/…", or named in data (an asset source).
  const quoted = new RegExp(`["'\`]${dep.replace(/[.*+?^${}()|[\]\\/]/gu, "\\$&")}(/[^"'\`]*)?["'\`]`, "u");
  if (!quoted.test(allText)) unusedPackages.push(dep);
}
check("every package in package.json is imported, run, or configured by something",
  unusedPackages.length === 0,
  `installed for nothing: ${unusedPackages.join(", ")}`);

// ── 2. every named export is used by another file ───────────────────────────
const ENTRY = new Set(["src/main.tsx", "src/App.tsx"]);
const deadExports = [];
let exportsSeen = 0;
for (const rel of files) {
  if (!rel.startsWith("src/") || !/\.tsx?$/u.test(rel) || ENTRY.has(rel)) continue;
  const re = /^export (?:async )?(?:function|const|let|class|type|interface|enum|abstract class) ([A-Za-z_$][\w$]*)/gmu;
  let m;
  while ((m = re.exec(textOf.get(rel)))) {
    exportsSeen += 1;
    if (!usedOutside(m[1], rel)) deadExports.push(`${rel}:${m[1]}`);
  }
}
check(`every one of the ${exportsSeen} named exports in src/ is used by another file`,
  deadExports.length === 0,
  `exported to nobody (${deadExports.length}): ${deadExports.slice(0, 10).join(", ")}${deadExports.length > 10 ? " …" : ""}`);

// ── 3. and the compiler's half of the guarantee stays switched on ───────────
const tsconfig = read("tsconfig.json");
check("the compiler refuses unused locals and parameters",
  /"noUnusedLocals":\s*true/u.test(tsconfig) && /"noUnusedParameters":\s*true/u.test(tsconfig),
  "the flags are off, so the next unused symbol is a habit rather than an error");

if (failed) {
  console.error(`\n${failed} dead-code check(s) failed.`);
  process.exit(1);
}
console.log(`check-no-dead-code: every package is used, all ${exportsSeen} named exports have a consumer across ${files.length} files, and the compiler enforces the rest`);
process.exit(0);
