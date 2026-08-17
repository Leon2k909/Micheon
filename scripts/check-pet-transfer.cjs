#!/usr/bin/env node
/**
 * Exercise the portable pet bundle boundary with isolated Micheon/Codex homes.
 * This keeps the filesystem contract honest without touching a developer's
 * actual pet folders.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");

const root = path.join(__dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "micheon-pet-transfer-"));
const micheonHome = path.join(tempRoot, "micheon");
const codexHome = path.join(tempRoot, "codex");
process.env.MICHEON_HOME = micheonHome;
process.env.CODEX_HOME = codexHome;

function writePet(home, id, source, bytes) {
  const directory = path.join(home, "pets", id);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "pet.json"), JSON.stringify({
    id,
    displayName: `${source} ${id}`,
    spritesheetPath: "spritesheet.webp",
  }));
  fs.writeFileSync(path.join(directory, "spritesheet.webp"), Buffer.from(bytes));
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  writePet(micheonHome, "gallery-cat", "micheon", [1, 2, 3, 4]);
  writePet(codexHome, "codex-dog", "codex", [5, 6, 7, 8]);
  fs.mkdirSync(path.join(micheonHome, "pets", "keep-me"), { recursive: true });
  fs.writeFileSync(path.join(micheonHome, "pets", "keep-me", "notes.txt"), "unrelated");

  const pets = await import(pathToFileURL(path.join(root, "server/codexPets.js")).href + `?check=${Date.now()}`);
  const exported = pets.exportUserManagedPetBundles();
  expect(exported.pets.length === 2, "export did not include both user-managed pets");
  expect(exported.pets.every((pet) => pet.spritesheetBase64 && pet.manifest.spritesheetPath === "spritesheet.webp"), "export omitted a portable sprite or normalized manifest");
  expect(!exported.pets.some((pet) => pet.source === "builtin"), "export included a non-portable built-in pet");

  fs.rmSync(path.join(micheonHome, "pets", "gallery-cat"), { recursive: true, force: true });
  fs.rmSync(path.join(codexHome, "pets", "codex-dog"), { recursive: true, force: true });
  const result = pets.importUserManagedPetBundles(exported.pets);
  expect(result.imported === 2, "import did not report both pets");
  expect(fs.existsSync(path.join(micheonHome, "pets", "gallery-cat", "spritesheet.webp")), "Micheon pet was not restored");
  expect(fs.existsSync(path.join(codexHome, "pets", "codex-dog", "spritesheet.webp")), "Codex pet was not restored");
  expect(fs.readFileSync(path.join(micheonHome, "pets", "keep-me", "notes.txt"), "utf8") === "unrelated", "import touched another pet folder");

  const server = await import(pathToFileURL(path.join(root, "server/index.js")).href + `?check=${Date.now()}`);
  const listener = await server.startServer(0);
  try {
    const port = listener.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/codex-pets/transfer`);
    const payload = await response.json();
    expect(response.ok && payload.pets.length === 2, "pet transfer GET route did not expose the local bundles");
    const imported = await fetch(`http://127.0.0.1:${port}/api/codex-pets/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pets: exported.pets }),
    });
    expect(imported.ok, "pet transfer POST route rejected a valid bundle");
  } finally {
    await new Promise((resolve) => listener.close(resolve));
  }

  try {
    pets.importUserManagedPetBundles([{
      source: "custom",
      id: "../outside",
      manifest: {},
      spritesheetName: "spritesheet.webp",
      spritesheetBase64: Buffer.from([1]).toString("base64"),
    }]);
    throw new Error("path traversal pet was accepted");
  } catch (error) {
    expect(/invalid source or id|outside/.test(String(error?.message)), "path traversal failure was not validation-related");
  }

  fs.rmSync(tempRoot, { recursive: true, force: true });
  console.log("check-pet-transfer: user-managed Micheon and Codex pets export/import with path and size guards");
}

main().catch((error) => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  console.error("FAIL check-pet-transfer");
  console.error("  " + (error?.stack || error));
  process.exit(1);
});
