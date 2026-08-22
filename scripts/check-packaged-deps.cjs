#!/usr/bin/env node
/**
 * The packaged app has to carry every module it will import at runtime.
 *
 * A shipped build died on its first line with "Cannot find package 'uuid'".
 * The asar held four packages — the three production dependencies and one of
 * their children — and none of the rest of the tree: uuid, axios, ws,
 * cross-fetch, everything edge-tts-universal imports. Nothing in the build
 * chain could see it, because the chain ends at `vite build` and this is
 * decided afterwards, by electron-builder walking node_modules.
 *
 * It walked a JUNCTION. Packaging ran in a throwaway worktree whose
 * node_modules was a link to another checkout's, so every real path lay
 * outside the project root; the top level survived and the nested packages
 * did not. A real install in the directory being packaged is the fix, and
 * this is how that stays true.
 *
 * Run after electron-builder, against the asar it produced:
 *     node scripts/check-packaged-deps.cjs "release/win-unpacked/resources/app.asar"
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const target = process.argv[2] || path.join(root, "release", "win-unpacked", "resources", "app.asar");
assert.ok(fs.existsSync(target), `no packaged app at ${target} — build one before checking it`);

/** An asar begins with a JSON directory listing; no unpacking needed to read it. */
function asarPackages(file) {
  const handle = fs.openSync(file, "r");
  const head = Buffer.alloc(16);
  fs.readSync(handle, head, 0, 16, 0);
  const size = head.readUInt32LE(12);
  const json = Buffer.alloc(size);
  fs.readSync(handle, json, 0, size, 16);
  fs.closeSync(handle);
  const header = JSON.parse(json.toString("utf8").replace(/\0+$/, ""));
  const found = new Set();
  const walk = (node, prefix) => {
    for (const [name, entry] of Object.entries(node.files || {})) {
      if (!entry.files) continue;
      if (name.startsWith("@")) { walk(entry, `${name}/`); continue; }
      found.add(prefix + name);
      // A nested node_modules is how npm resolves a version conflict.
      if (entry.files.node_modules) walk(entry.files.node_modules, "");
    }
  };
  if (header.files.node_modules) walk(header.files.node_modules, "");
  return found;
}

/**
 * Everything the app can reach at runtime: the production dependencies and,
 * transitively, theirs. optionalDependencies are excluded — they are allowed
 * to be absent, which is what makes them optional.
 */
function requiredClosure() {
  const seen = new Set();
  const missingLocally = [];
  const visit = (name, from) => {
    if (seen.has(name)) return;
    seen.add(name);
    // Resolve the way node does: nearest node_modules, then upwards.
    let dir = from;
    let manifest = null;
    while (dir) {
      const candidate = path.join(dir, "node_modules", name, "package.json");
      if (fs.existsSync(candidate)) { manifest = candidate; break; }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    if (!manifest) { missingLocally.push(name); return; }
    const pkg = JSON.parse(fs.readFileSync(manifest, "utf8"));
    for (const child of Object.keys(pkg.dependencies || {})) {
      visit(child, path.dirname(path.dirname(path.dirname(manifest))));
    }
  };
  const own = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  for (const name of Object.keys(own.dependencies || {})) visit(name, root);
  return { closure: seen, missingLocally };
}

const { closure, missingLocally } = requiredClosure();
assert.deepStrictEqual(missingLocally, [],
  `not installed here, so packaging cannot include them: ${missingLocally.join(", ")}`);

const shipped = asarPackages(target);
const absent = [...closure].filter((name) => !shipped.has(name)).sort();

assert.deepStrictEqual(absent, [],
  `${absent.length} module(s) the app imports are missing from the package, so it dies on launch:\n`
  + `  ${absent.join(", ")}\n`
  + "  The usual cause is packaging a directory whose node_modules is a symlink or junction.\n"
  + "  Run a real npm ci in the directory being packaged and build again.");

console.log(
  `check-packaged-deps: all ${closure.size} runtime modules are inside the package `
  + `(${shipped.size} bundled in total)`
);
