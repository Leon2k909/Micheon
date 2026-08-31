#!/usr/bin/env node
/**
 * Every check script on disk is actually run by the build.
 *
 * A check that is not in the chain is worse than one that was never written:
 * the file is there, its name reads like coverage, and it costs nothing and
 * reports nothing. Nobody goes looking for a check that is already present.
 *
 * This is not hypothetical. The chain is one enormous single-line value in
 * package.json, so two branches that each add a check conflict on that line,
 * and every resolution is a choice between two ~9,000-character strings that
 * differ in one place. Resolving it by taking a side silently deletes the
 * other side's check. That has now happened five times. Once, conflict
 * markers were committed into package.json and the repair that followed
 * dropped a language check together with its script definition — the file
 * stayed in the repo, fully written and fully wired to nothing.
 *
 * A merge cannot notice that. A person diffing two 9,000-character strings
 * cannot reliably notice it either. So the invariant is asserted here instead
 * of trusted: if scripts/check-*.cjs exists, the build runs it.
 *
 * check-packaged-deps is the one exception, and it is a real one rather than
 * a convenience: it inspects what electron-builder puts in the asar, which is
 * decided after the chain ends at vite build. It says so in its own header.
 * Any future exception belongs here with its reason, not as a silent absence.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rawPkg = fs.readFileSync(path.join(root, "package.json"), "utf8");

/**
 * Conflict markers first, BEFORE the parse.
 *
 * Written after the JSON.parse below, this test could never run: markers make
 * package.json invalid JSON, so the parse throws and the check dies with a
 * syntax error pointing at a line of angle brackets. That is not nothing —
 * the build does stop — but it reports a malformed file rather than an
 * unresolved merge, and the difference matters when you are looking at it at
 * one in the morning. Conflict markers have reached main here once already.
 */
if (/^(<{7}|={7}|>{7})/mu.test(rawPkg)) {
  console.error("FAIL package.json still contains merge conflict markers — the merge was committed unresolved");
  const line = rawPkg.split("\n").findIndex((l) => /^(<{7}|={7}|>{7})/u.test(l));
  console.error(`     first marker at line ${line + 1}`);
  process.exit(1);
}

const pkg = JSON.parse(rawPkg);
const chain = String(pkg.scripts.build || "");

const EXEMPT = new Map([
  ["check-packaged-deps.cjs", "runs after packaging — it reads the asar, which the chain never produces"],
]);

// Which script files the build actually reaches, following each npm run name
// in the chain to the command it names. A script can run several files.
const reached = new Set();
for (const [name, command] of Object.entries(pkg.scripts)) {
  if (!chain.includes(`npm run ${name}`)) continue;
  for (const m of String(command).matchAll(/scripts\/([\w.-]+)/g)) reached.add(m[1]);
}

const onDisk = fs.readdirSync(path.join(root, "scripts")).filter((f) => /^check-.*\.cjs$/.test(f));
const orphans = onDisk.filter((f) => !reached.has(f) && !EXEMPT.has(f));

let failed = 0;

if (orphans.length) {
  failed += 1;
  console.error(`FAIL ${orphans.length} check script(s) exist but are never run by the build:`);
  for (const f of orphans) {
    const wired = Object.entries(pkg.scripts).find(([, c]) => String(c).includes(`scripts/${f}`));
    console.error(`     scripts/${f}  ${wired ? `has a script entry (${wired[0]}) that the chain never calls` : "has no script entry at all"}`);
  }
  console.error("     Add it to the build chain, or list it in EXEMPT here with the reason.");
} else {
  console.log(`ok   all ${onDisk.length - EXEMPT.size} check scripts are in the build chain`);
}

// The exemptions have to still exist, or the list quietly becomes a lie about
// files that are gone.
for (const [file, why] of EXEMPT) {
  if (!fs.existsSync(path.join(root, "scripts", file))) {
    failed += 1;
    console.error(`FAIL scripts/${file} is exempted here but no longer exists — drop the exemption`);
  } else {
    console.log(`ok   scripts/${file} is exempt: ${why}`);
  }
}

/**
 * And nothing in the chain points at a file that is not there.
 *
 * The mirror of the above: a rename that updates the file but not the chain
 * fails the whole build on a missing module, which is loud — but a rename
 * that updates the chain to a name nothing provides fails identically and is
 * worth naming precisely rather than reading as a Node stack trace.
 */
const dangling = [];
for (const [name, command] of Object.entries(pkg.scripts)) {
  if (!chain.includes(`npm run ${name}`)) continue;
  for (const m of String(command).matchAll(/node\s+(scripts\/[\w.-]+)/g)) {
    if (!fs.existsSync(path.join(root, m[1]))) dangling.push(`${name} -> ${m[1]}`);
  }
}
if (dangling.length) {
  failed += 1;
  console.error(`FAIL the chain names ${dangling.length} script(s) that do not exist: ${dangling.join(", ")}`);
} else {
  console.log("ok   every script the chain names exists on disk");
}

// A name in the chain with no script behind it fails the build with npm's own
// error, which does not say which name — so it is named here.
const undefinedNames = [...chain.matchAll(/npm run ([\w:-]+)/g)]
  .map((m) => m[1])
  .filter((name) => !pkg.scripts[name]);
if (undefinedNames.length) {
  failed += 1;
  console.error(`FAIL the chain runs ${undefinedNames.length} name(s) with no script defined: ${[...new Set(undefinedNames)].join(", ")}`);
} else {
  console.log("ok   every name the chain runs has a script defined");
}

console.log("ok   package.json carries no conflict markers");

if (failed) {
  console.error("\nA check that is not in the chain reports nothing and looks like coverage.");
  process.exit(1);
}
const total = new Set([...chain.matchAll(/npm run (check:[\w-]+)/g)].map((m) => m[1])).size;
console.log(`check-chain-completeness: all ${onDisk.length} check scripts accounted for, and the chain runs ${total} of them`);
process.exit(0);
