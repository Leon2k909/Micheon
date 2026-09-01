/**
 * No stylesheet rule may need a class the source never produces.
 *
 * The dead-CSS pass found 404 of them: phase dots, equaliser bars, the course
 * hero and its launch chip, a right-click speed menu, the language badge's
 * flags — every one styling a component that had already gone, and five
 * checks were pinning some of them as if they were live. This is the rule
 * that keeps the sheets honest from here.
 *
 * Liveness is judged the way the browser will: a rule is live if any of its
 * comma-separated selectors could match. A selector could match when every
 * class in it is one the source can produce, where "produce" means the class
 * appears as a token anywhere in src/, electron/ or index.html, OR it starts
 * with a prefix the source builds a class from (`np-tone-${tone}`,
 * "pdot-" + state). Over-inclusive on purpose: a false live costs nothing, a
 * false dead deletes a rule somebody needed.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");

const walk = (dir, out = []) => {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.name === "node_modules") continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel, out); else out.push(rel);
  }
  return out;
};

const sourceFiles = [...walk("src"), ...walk("electron"), "index.html"]
  .filter((f) => /\.(tsx?|jsx?|html|cjs|mjs)$/u.test(f) && fs.existsSync(path.join(root, f)));
const source = sourceFiles.map(read).join("\n");

// Every identifier-shaped token the source contains could be a class.
const liveTokens = new Set(source.match(/[A-Za-z_][\w-]*/gu) ?? []);
// Classes built at runtime: a template prefix (`foo-${x}`) or a
// concatenation ("foo-" + x). Anything starting with one is live.
const prefixes = new Set();
for (const m of source.matchAll(/([A-Za-z_][\w-]*[-_])\$\{/gu)) prefixes.add(m[1]);
for (const m of source.matchAll(/["'`]([A-Za-z_][\w-]*[-_])["'`]\s*\+/gu)) prefixes.add(m[1]);
const prefixList = [...prefixes];
const isLive = (cls) => liveTokens.has(cls) || prefixList.some((p) => cls.startsWith(p));

const failures = [];

// The index has to be an index of something, or every rule reads as dead.
if (!liveTokens.has("fs-line") || !liveTokens.has("np-side-nav")) {
  failures.push("the source index does not contain classes the app is known to render (fs-line, np-side-nav) — the scan is reading nothing");
}
if (!prefixes.has("np-social-avatar--") || !prefixes.has("uk-event-")) {
  failures.push("runtime prefixes are not being collected (np-social-avatar--${…} and \"uk-event-\" + … are built at runtime and their rules would read as dead)");
}

const sheets = walk("src").filter((f) => f.endsWith(".css"));
const dead = [];
let rules = 0;
for (const rel of sheets) {
  const css = read(rel);
  // Comments blanked, line structure kept, so a report points at a real line.
  const clean = css.replace(/\/\*[\s\S]*?\*\//gu, (c) => c.replace(/[^\n]/gu, " "));
  const re = /([^{}]+)\{/gu;
  let m;
  while ((m = re.exec(clean))) {
    const selector = m[1].trim();
    if (!selector || selector.startsWith("@") || selector.startsWith(":root") || /^\s*(from|to|\d+%)/u.test(selector)) continue;
    rules++;
    const compounds = selector.split(",").map((s) => s.trim());
    const classesOf = (s) => [...s.matchAll(/\.([A-Za-z_][\w-]*)/gu)].map((x) => x[1]);
    if (!compounds.some((s) => classesOf(s).length)) continue;
    // Dead only when EVERY compound needs an unmatched class; `.live, .dead`
    // still matches through .live.
    const allDead = compounds.every((s) => classesOf(s).some((c) => !isLive(c)));
    if (allDead) {
      const line = clean.slice(0, m.index).split("\n").length;
      const unmatched = [...new Set(compounds.flatMap(classesOf).filter((c) => !isLive(c)))];
      dead.push(`${rel}:${line}  ${selector.replace(/\s+/gu, " ").slice(0, 80)}   ← ${unmatched.join(", ")}`);
    }
  }
}
if (sheets.length < 2 || rules < 1000) {
  failures.push(`expected the app's stylesheets (found ${sheets.length} sheets, ${rules} rules) — the scan is not reading them`);
}
if (dead.length) {
  failures.push(`${dead.length} rule(s) whose every selector needs a class the source never produces:`);
  for (const d of dead.slice(0, 25)) failures.push("    " + d);
  if (dead.length > 25) failures.push(`    … ${dead.length - 25} more`);
  failures.push("  delete the rule (and its dark/accent twin), or, if the class is built at runtime, build it from a prefix the scan can see");
}

if (failures.length) {
  console.error("FAIL check-no-dead-css");
  failures.forEach((f) => console.error("  " + f));
  process.exit(1);
}
console.log(`check-no-dead-css: ${rules} rules across ${sheets.length} sheets, every one reachable from a class the source produces (${prefixes.size} runtime prefixes honoured)`);
