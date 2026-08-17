#!/usr/bin/env node
/**
 * Exercise the portable data archive against a localStorage that contains
 * multiple Micheon profiles. The important contract is that an import moves
 * the current profile's data without taking over the account session or
 * touching another profile's records.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.join(__dirname, "..");
const failures = [];
const store = new Map();
const fetchBodies = [];

function fail(message) { failures.push(message); }
function expect(condition, message) { if (!condition) fail(message); }
function expectThrows(fn, message) {
  try {
    fn();
    fail(message);
  } catch {
    // Expected validation failure.
  }
}

global.window = {
  localStorage: {
    get length() { return store.size; },
    key: (index) => [...store.keys()][index] ?? null,
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  addEventListener() {},
  removeEventListener() {},
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
};
global.fetch = async (url, init = {}) => {
  if (url === "/api/storage" && init.method === "POST") {
    fetchBodies.push(JSON.parse(init.body));
  }
  return { ok: true, status: 200 };
};

const built = esbuild.buildSync({
  stdin: {
    contents: `export { applyDataImport, collectDataExport, parseDataExport, serializeDataExport, validateDataExport } from "./src/lib/dataTransfer.ts";`,
    resolveDir: root,
    sourcefile: "data-transfer-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const mod = new Module(path.join(root, "check-data-transfer.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-data-transfer.entry.cjs"));
const {
  applyDataImport,
  collectDataExport,
  parseDataExport,
  serializeDataExport,
  validateDataExport,
} = mod.exports;

async function main() {
const source = {
  id: "source--person-example-com",
  name: "Person",
  email: "person@example.com",
  joinedAt: "2026-01-01T00:00:00.000Z",
  externalWordsLearned: 12,
};
const target = {
  id: "target--person-example-com",
  name: "Person",
  email: "person@example.com",
  joinedAt: "2026-01-02T00:00:00.000Z",
  externalWordsLearned: 0,
};
const other = {
  id: "other--someone-example-com",
  name: "Other",
  email: "someone@example.com",
  joinedAt: "2026-01-03T00:00:00.000Z",
  externalWordsLearned: 4,
};

function seed() {
  store.clear();
  fetchBodies.length = 0;
  store.set("german-arena-known-profiles", JSON.stringify({
    [source.email]: source,
    [target.email]: target,
    [other.email]: other,
  }));
  store.set("german-arena-auth", JSON.stringify(source));
  store.set("session-completed:" + source.id, JSON.stringify({ lesson: 9 }));
  store.set("activity-log:" + source.id, JSON.stringify([{ id: "a1" }]));
  store.set("streak:" + source.id, "7");
  store.set("gl-custom-content-v1", JSON.stringify({ packs: [{ name: "Mine" }] }));
  store.set("gl-theme", "dark");
  store.set("english-variant", "british");
  store.set("germ-notifications-muted", "1");
  store.set("germ-mastery-set", JSON.stringify(["machen"]));
  store.set("snake-hs", "4200");
  store.set("micheon-listen-speed", "1.25");
  store.set("session-completed:" + target.id, JSON.stringify({ stale: true }));
  store.set("session-completed:" + other.id, JSON.stringify({ other: true }));
  store.set("german-lab-dict-cache-v1", JSON.stringify({ cached: true }));
  store.set("gl-crash-reports", JSON.stringify([{ error: "old" }]));
  store.set("random-unsynced-key", "leave-me");
}

seed();
const archive = collectDataExport(source);
expect(Array.isArray(archive.pets) && archive.pets.length === 0, "a local export did not reserve the portable pet bundle field");
const profileKeys = archive.profileItems.map((item) => item.key);
const globalKeys = archive.globalItems.map((item) => item.key);
expect(profileKeys.includes("session-completed:" + source.id), "export omitted scoped progress");
expect(profileKeys.includes("activity-log:" + source.id), "export omitted scoped activity");
expect(globalKeys.includes("gl-custom-content-v1"), "export omitted custom content");
expect(globalKeys.includes("germ-mastery-set"), "export omitted mastery");
expect(globalKeys.includes("micheon-listen-speed"), "export omitted listen settings");
expect(globalKeys.includes("english-variant"), "export omitted the English variant setting");
expect(globalKeys.includes("germ-notifications-muted"), "export omitted notification preferences");
expect(!profileKeys.some((key) => key.endsWith(":" + other.id)), "export included another profile's data");
expect(!globalKeys.includes("german-arena-auth"), "export included the active session");
expect(!globalKeys.includes("german-arena-known-profiles"), "export included the profile index");
expect(!globalKeys.includes("german-lab-dict-cache-v1"), "export included the dictionary cache");
expect(!globalKeys.includes("gl-crash-reports"), "export included crash diagnostics");
expect(!globalKeys.includes("random-unsynced-key"), "export included an unknown machine key");

const roundTrip = parseDataExport(serializeDataExport(archive));
expect(roundTrip.profile.id === source.id, "serialized archive changed its source profile");
expect(roundTrip.profileItems.length === archive.profileItems.length, "serialized archive lost scoped data");
expect(roundTrip.globalItems.length === archive.globalItems.length, "serialized archive lost global data");
const petRoundTrip = parseDataExport(serializeDataExport({
  ...archive,
  pets: [{
    source: "micheon-custom",
    id: "gallery-cat",
    manifest: { id: "gallery-cat", spritesheetPath: "spritesheet.webp" },
    spritesheetName: "spritesheet.webp",
    spritesheetBase64: Buffer.from([1, 2, 3]).toString("base64"),
  }],
}));
expect(petRoundTrip.pets.length === 1 && petRoundTrip.pets[0].id === "gallery-cat", "serialized archive lost a portable pet bundle");

seed();
store.set("gl-target-only", "remove-me");
await applyDataImport(archive, target);
expect(store.get("session-completed:" + target.id) === JSON.stringify({ lesson: 9 }), "import did not remap scoped progress");
expect(store.get("activity-log:" + target.id) === JSON.stringify([{ id: "a1" }]), "import did not remap scoped activity");
expect(store.get("streak:" + target.id) === "7", "import did not remap the streak");
expect(store.get("gl-custom-content-v1") === JSON.stringify({ packs: [{ name: "Mine" }] }), "import did not restore custom content");
expect(!store.has("gl-target-only"), "import did not remove stale portable data for the target profile");
expect(store.get("session-completed:" + other.id) === JSON.stringify({ other: true }), "import touched another profile");
expect(store.get("german-arena-auth") === JSON.stringify(source), "import changed the active session");
expect(store.has("german-lab-dict-cache-v1"), "import removed the dictionary cache");
expect(store.has("gl-crash-reports"), "import removed crash diagnostics");
expect(store.get("random-unsynced-key") === "leave-me", "import changed an unknown machine key");
expect(fetchBodies.length > 0, "import did not flush shared-storage updates");
expect(Object.prototype.hasOwnProperty.call(fetchBodies.at(-1).items, "gl-target-only"), "flush omitted a portable deletion");

const beforeRejected = [...store.entries()];
expectThrows(
  () => validateDataExport({ ...archive, profile: { ...archive.profile, email: "not-an-email" } }),
  "an archive with an invalid profile identity was accepted"
);
expectThrows(
  () => validateDataExport({ ...archive, globalItems: [...archive.globalItems, archive.globalItems[0]] }),
  "an archive with duplicate keys was accepted"
);
expectThrows(
  () => validateDataExport({ ...archive, globalItems: [...archive.globalItems, { key: "machine-secret", value: "x" }] }),
  "an unknown global key was accepted"
);
expectThrows(
  () => validateDataExport({ ...archive, profileItems: [...archive.profileItems, { key: "session-completed:other--someone-example-com", value: "x" }] }),
  "a profile item belonging to another profile was accepted"
);

try {
  await applyDataImport(archive, { ...target, email: "wrong@example.com" });
  fail("import accepted an archive for a different email");
} catch {
  // Expected account guard.
}
expect(JSON.stringify([...store.entries()]) === JSON.stringify(beforeRejected), "rejected import changed localStorage");

const ui = fs.readFileSync(path.join(root, "src/components/DataAndStorage.tsx"), "utf8");
expect(/Export data/.test(ui) && /Import data/.test(ui), "Data & storage is missing transfer controls");
expect(/Other profiles are untouched/.test(ui), "transfer UI does not state the profile boundary");
expect(/collectPortablePetBundles/.test(ui) && /importPortablePetBundles/.test(ui), "Data & storage does not transfer pet bundles");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
expect(packageJson.scripts["check:data-transfer"], "package.json does not expose the transfer check");
expect(packageJson.scripts.build.includes("check:data-transfer"), "the build does not run the transfer check");

if (failures.length) {
  console.error("FAIL check-data-transfer");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-data-transfer: export/import remaps the active profile, preserves other profiles and protected keys, validates archives, and flushes shared storage");
}

main().catch((error) => {
  console.error("FAIL check-data-transfer");
  console.error("  " + (error?.stack || error));
  process.exit(1);
});
