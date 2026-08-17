import fs from "fs";
import os from "os";
import path from "path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const MAX_MANIFEST_BYTES = 64 * 1024;
const MAX_FRAMES = 256;
const MAX_FPS = 60;
const MAX_TRANSFER_PETS = 32;
const MAX_TRANSFER_SPRITE_BYTES = 24 * 1024 * 1024;
const MAX_TRANSFER_TOTAL_SPRITE_BYTES = 48 * 1024 * 1024;
const SAFE_TRANSFER_PET_ID = /^[a-zA-Z0-9._-]{1,128}$/;
const PORTABLE_PET_SOURCES = new Set(["custom", "micheon-custom"]);
const BUNDLED_PETS_ROOT = fileURLToPath(new URL("./bundled-pets", import.meta.url));
const PET_LIST_CACHE_MS = 5000;
let cachedPetList = null;
let cachedPetListUntil = 0;

const BUILTIN_PETS = [
  ["codex", "Codex"],
  ["dewey", "Dewey"],
  ["fireball", "Fireball"],
  ["rocky", "Rocky"],
  ["seedy", "Seedy"],
  ["stacky", "Stacky"],
  ["bsod", "BSOD"],
  ["null-signal", "Null Signal"],
];

const DEFAULT_FRAME = {
  width: 192,
  height: 208,
  columns: 8,
  rows: 9,
};

const V2_FRAME_ROWS = 11;

const DEFAULT_ANIMATIONS = {
  idle: { frames: [0, 1, 2, 3, 4, 5], fps: 3, loop: true },
  "running-right": { frames: [8, 9, 10, 11, 12, 13, 14, 15], fps: 10, loop: true },
  "running-left": { frames: [16, 17, 18, 19, 20, 21, 22, 23], fps: 10, loop: true },
  waving: { frames: [24, 25, 26, 27], fps: 7, loop: false, fallback: "idle" },
  jumping: { frames: [32, 33, 34, 35, 36], fps: 8, loop: false, fallback: "idle" },
  failed: { frames: [40, 41, 42, 43, 44, 45, 46, 47], fps: 7, loop: false, fallback: "idle" },
  waiting: { frames: [48, 49, 50, 51, 52, 53], fps: 4, loop: true },
  running: { frames: [56, 57, 58, 59, 60, 61], fps: 7, loop: true },
  review: { frames: [64, 65, 66, 67, 68, 69], fps: 5, loop: true },
};

const ANIMATION_ALIASES = {
  move_right: "running-right",
  move_left: "running-left",
  wave: "waving",
  bounce: "jumping",
  sad: "failed",
};

function getCodexHome() {
  const configured = process.env.CODEX_HOME?.trim();
  return configured ? path.resolve(configured) : path.join(os.homedir(), ".codex");
}

function getMicheonHome() {
  const configured = process.env.MICHEON_HOME?.trim();
  return configured ? path.resolve(configured) : path.join(os.homedir(), ".micheon");
}

function getSelectedCodexPetKey(codexHome) {
  const configPath = path.join(codexHome, "config.toml");
  try {
    const stats = fs.statSync(configPath);
    if (!stats.isFile() || stats.size > 1024 * 1024) return null;
    const config = fs.readFileSync(configPath, "utf8");
    const match = config.match(/^\s*selected-avatar-id\s*=\s*"([^"]+)"\s*$/m);
    return match?.[1]?.trim() || null;
  } catch {
    return null;
  }
}

function readDirectory(directory) {
  try {
    return fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
}

function readManifest(manifestPath) {
  try {
    const stats = fs.statSync(manifestPath);
    if (!stats.isFile() || stats.size > MAX_MANIFEST_BYTES) return null;
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function positiveInteger(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) return fallback;
  return Math.min(number, maximum);
}

function normaliseSpriteVersion(value) {
  return Number(value) === 2 ? 2 : 1;
}

function normaliseFrame(frame, spriteVersionNumber = 1) {
  return {
    width: positiveInteger(frame?.width, DEFAULT_FRAME.width, 4096),
    height: positiveInteger(frame?.height, DEFAULT_FRAME.height, 4096),
    columns: positiveInteger(frame?.columns, DEFAULT_FRAME.columns, 32),
    // Codex v2 pets are always 8x11 atlases. Older manifests commonly omit
    // `frame`, so defaulting every pet to nine rows makes CSS sprite renderers
    // compress the last two rows into the first nine and expose the next pose.
    rows: spriteVersionNumber === 2
      ? V2_FRAME_ROWS
      : positiveInteger(frame?.rows, DEFAULT_FRAME.rows, 32),
  };
}

function normaliseAnimation(value, fallback) {
  if (!value || typeof value !== "object") return { ...fallback };
  const frames = Array.isArray(value.frames)
    ? value.frames
        .map(Number)
        .filter((frame) => Number.isInteger(frame) && frame >= 0)
        .slice(0, MAX_FRAMES)
    : [];

  return {
    frames: frames.length ? frames : [...fallback.frames],
    fps: Math.min(MAX_FPS, Math.max(1, Number(value.fps) || fallback.fps)),
    loop: typeof value.loop === "boolean" ? value.loop : fallback.loop,
    ...(typeof value.fallback === "string" ? { fallback: value.fallback } : fallback.fallback ? { fallback: fallback.fallback } : {}),
  };
}

function normaliseAnimations(animations) {
  const result = {};
  for (const [name, fallback] of Object.entries(DEFAULT_ANIMATIONS)) {
    result[name] = normaliseAnimation(animations?.[name], fallback);
  }
  for (const [alias, target] of Object.entries(ANIMATION_ALIASES)) {
    result[alias] = normaliseAnimation(animations?.[alias], result[target]);
  }
  return result;
}

function resolveInside(directory, relativePath) {
  if (typeof relativePath !== "string" || !relativePath.trim()) return null;
  const resolved = path.resolve(directory, relativePath);
  const relative = path.relative(directory, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return resolved;
}

function isImageFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function fileVersion(filePath) {
  try {
    return Math.floor(fs.statSync(filePath).mtimeMs);
  } catch {
    return 0;
  }
}

function publicPet(pet) {
  return {
    id: pet.id,
    displayName: pet.displayName,
    description: pet.description,
    source: pet.source,
    spriteVersionNumber: pet.spriteVersionNumber,
    frame: pet.frame,
    animations: pet.animations,
    spritesheetUrl: `/api/codex-pets/${encodeURIComponent(pet.source)}/${encodeURIComponent(pet.id)}/spritesheet?v=${fileVersion(pet.spritesheetPath)}`,
  };
}

function loadManifestPets(root, manifestName, source) {
  return readDirectory(root)
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const directory = path.join(root, entry.name);
      const manifest = readManifest(path.join(directory, manifestName));
      if (!manifest) return [];

      const id = typeof manifest.id === "string" && manifest.id.trim() ? manifest.id.trim() : entry.name;
      const spritesheetPath = resolveInside(
        directory,
        typeof manifest.spritesheetPath === "string" ? manifest.spritesheetPath : "spritesheet.webp"
      );
      if (!spritesheetPath || !isImageFile(spritesheetPath)) return [];

      const spriteVersionNumber = normaliseSpriteVersion(manifest.spriteVersionNumber);

      return [{
        id,
        displayName: typeof manifest.displayName === "string" && manifest.displayName.trim()
          ? manifest.displayName.trim()
          : id,
        description: typeof manifest.description === "string" ? manifest.description.trim() : "",
        source,
        spriteVersionNumber,
        frame: normaliseFrame(manifest.frame, spriteVersionNumber),
        animations: normaliseAnimations(manifest.animations),
        spritesheetPath,
      }];
    });
}

function loadBuiltInPets(codexHome) {
  const root = path.join(codexHome, "cache", "tui-pets", "v1", "assets");
  const files = readDirectory(root).filter((entry) => entry.isFile() && /\.webp$/i.test(entry.name));

  return BUILTIN_PETS.flatMap(([id, displayName]) => {
    const exact = files.find((entry) => entry.name === `${id}-spritesheet-v4.webp`);
    const compatible = exact ?? files.find((entry) => entry.name.startsWith(`${id}-spritesheet-`));
    if (!compatible) return [];

    return [{
      id,
      displayName,
      description: "Built-in Codex pet",
      source: "builtin",
      spriteVersionNumber: 1,
      frame: { ...DEFAULT_FRAME },
      animations: normaliseAnimations(),
      spritesheetPath: path.join(root, compatible.name),
    }];
  });
}

export function listCodexPets({ fresh = false } = {}) {
  if (!fresh && cachedPetList && Date.now() < cachedPetListUntil) {
    return cachedPetList;
  }
  const codexHome = getCodexHome();
  const micheonCustom = loadManifestPets(
    path.join(getMicheonHome(), "pets"),
    "pet.json",
    "micheon-custom"
  );
  const custom = loadManifestPets(path.join(codexHome, "pets"), "pet.json", "custom");
  const legacy = loadManifestPets(path.join(codexHome, "avatars"), "avatar.json", "legacy");
  const builtIn = loadBuiltInPets(codexHome);
  const codexPets = [...custom, ...legacy, ...builtIn];
  const micheonIds = new Set(micheonCustom.map((pet) => pet.id));
  const external = [
    ...micheonCustom,
    ...codexPets.filter((pet) => !micheonIds.has(pet.id)),
  ];
  const externalIds = new Set(external.map((pet) => pet.id));
  const bundled = loadManifestPets(BUNDLED_PETS_ROOT, "pet.json", "micheon")
    .filter((pet) => !externalIds.has(pet.id));

  cachedPetList = [...external, ...bundled].sort((a, b) =>
    a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" })
  );
  cachedPetListUntil = Date.now() + PET_LIST_CACHE_MS;
  return cachedPetList;
}

export function getCodexPetCatalog({ fresh = false } = {}) {
  const codexHome = getCodexHome();
  return {
    pets: listCodexPets({ fresh }).map(publicPet),
    source: "micheon-and-codex",
    selectedPetKey: getSelectedCodexPetKey(codexHome),
  };
}

export function resolveCodexPetSpritesheet(source, id) {
  const pet = listCodexPets().find((entry) => entry.source === source && entry.id === id);
  return pet?.spritesheetPath ?? null;
}

function portablePetRoot(source) {
  if (!PORTABLE_PET_SOURCES.has(source)) return null;
  return path.resolve(source === "custom"
    ? path.join(getCodexHome(), "pets")
    : path.join(getMicheonHome(), "pets"));
}

function safeTransferPetId(value) {
  const id = String(value ?? "").trim();
  return SAFE_TRANSFER_PET_ID.test(id) ? id : null;
}

function normaliseTransferManifest(manifest, id, spritesheetName) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("pet manifest is not an object");
  }
  const raw = JSON.stringify(manifest);
  if (!raw || Buffer.byteLength(raw, "utf8") > MAX_MANIFEST_BYTES) {
    throw new Error("pet manifest is too large");
  }
  return {
    ...manifest,
    id,
    spritesheetPath: spritesheetName,
  };
}

function readPortablePetBundle(pet) {
  const root = portablePetRoot(pet.source);
  const id = safeTransferPetId(pet.id);
  if (!root || !id) throw new Error(`pet ${pet.id || "(unnamed)"} cannot be moved between computers`);

  const directory = path.resolve(path.dirname(pet.spritesheetPath));
  if (path.dirname(directory) !== root) {
    throw new Error(`refusing to export pet ${id} outside its pets folder`);
  }
  try {
    if (!fs.lstatSync(directory).isDirectory()) throw new Error("pet directory is not a directory");
    const manifestPath = path.join(directory, "pet.json");
    const manifestStats = fs.lstatSync(manifestPath);
    if (!manifestStats.isFile() || manifestStats.size > MAX_MANIFEST_BYTES) {
      throw new Error("pet manifest is missing or too large");
    }
    const spritesheetName = path.basename(pet.spritesheetPath);
    if (!/^spritesheet\.(webp|png)$/i.test(spritesheetName)) {
      throw new Error("pet spritesheet has an unsupported name");
    }
    const spriteStats = fs.lstatSync(pet.spritesheetPath);
    if (!spriteStats.isFile() || spriteStats.size <= 0 || spriteStats.size > MAX_TRANSFER_SPRITE_BYTES) {
      throw new Error("pet spritesheet is missing or too large");
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const safeManifest = normaliseTransferManifest(manifest, id, spritesheetName);
    const spritesheetBase64 = fs.readFileSync(pet.spritesheetPath).toString("base64");
    return {
      source: pet.source,
      id,
      manifest: safeManifest,
      spritesheetName,
      spritesheetBase64,
      spriteBytes: spriteStats.size,
    };
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`pet ${id} has an invalid manifest`, { cause: error });
    throw error;
  }
}

function portablePetEntries() {
  return [
    ...loadManifestPets(path.join(getMicheonHome(), "pets"), "pet.json", "micheon-custom"),
    ...loadManifestPets(path.join(getCodexHome(), "pets"), "pet.json", "custom"),
  ];
}

/** Return only user-managed pet files; bundled and Codex-installed defaults need no copying. */
export function exportUserManagedPetBundles() {
  const pets = [];
  let totalSpriteBytes = 0;
  for (const pet of portablePetEntries()) {
    if (pets.length >= MAX_TRANSFER_PETS) throw new Error("too many custom pets to export");
    const bundle = readPortablePetBundle(pet);
    totalSpriteBytes += bundle.spriteBytes;
    if (totalSpriteBytes > MAX_TRANSFER_TOTAL_SPRITE_BYTES) {
      throw new Error("custom pet files are too large to export together");
    }
    const { spriteBytes: _spriteBytes, ...portable } = bundle;
    pets.push(portable);
  }
  return { schemaVersion: 1, pets };
}

function decodeTransferSpritesheet(value) {
  if (typeof value !== "string" || !value || value.length % 4 !== 0
    || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) {
    throw new Error("pet spritesheet is not valid base64");
  }
  const buffer = Buffer.from(value, "base64");
  if (!buffer.length || buffer.length > MAX_TRANSFER_SPRITE_BYTES
    || buffer.toString("base64") !== value) {
    throw new Error("pet spritesheet is too large or invalid");
  }
  return buffer;
}

function validateTransferBundles(rawPets) {
  if (rawPets === undefined) return [];
  if (!Array.isArray(rawPets) || rawPets.length > MAX_TRANSFER_PETS) {
    throw new Error("custom pet transfer is missing or too large");
  }
  const seen = new Set();
  let totalSpriteBytes = 0;
  return rawPets.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`custom pet ${index + 1} is invalid`);
    }
    const source = String(raw.source ?? "").trim();
    const id = safeTransferPetId(raw.id);
    if (!PORTABLE_PET_SOURCES.has(source) || !id) {
      throw new Error(`custom pet ${index + 1} has an invalid source or id`);
    }
    const key = `${source}:${id}`;
    if (seen.has(key)) throw new Error(`custom pet ${id} is listed twice`);
    seen.add(key);
    const spritesheetName = String(raw.spritesheetName ?? "");
    if (!/^spritesheet\.(webp|png)$/i.test(spritesheetName)) {
      throw new Error(`custom pet ${id} has an invalid spritesheet name`);
    }
    const manifest = normaliseTransferManifest(raw.manifest, id, spritesheetName);
    const spritesheet = decodeTransferSpritesheet(raw.spritesheetBase64);
    totalSpriteBytes += spritesheet.byteLength;
    if (totalSpriteBytes > MAX_TRANSFER_TOTAL_SPRITE_BYTES) {
      throw new Error("custom pet files are too large to import together");
    }
    return { source, id, manifest, spritesheetName, spritesheet };
  });
}

/** Install validated user-managed bundles without touching other pets or app data. */
export function importUserManagedPetBundles(rawPets) {
  const bundles = validateTransferBundles(rawPets);
  for (const bundle of bundles) {
    const root = portablePetRoot(bundle.source);
    fs.mkdirSync(root, { recursive: true });
    const target = path.resolve(root, bundle.id);
    if (path.dirname(target) !== root) throw new Error("refusing to import outside the pets folder");
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) {
      throw new Error(`refusing to replace symlinked pet ${bundle.id}`);
    }

    const stagingRoot = fs.mkdtempSync(path.join(root, ".micheon-pet-transfer-"));
    const stagingPet = path.join(stagingRoot, bundle.id);
    try {
      fs.mkdirSync(stagingPet, { recursive: true });
      fs.writeFileSync(path.join(stagingPet, "pet.json"), JSON.stringify(bundle.manifest, null, 2));
      fs.writeFileSync(path.join(stagingPet, bundle.spritesheetName), bundle.spritesheet);
      if (fs.existsSync(target)) fs.rmSync(target, { force: false, recursive: true });
      fs.renameSync(stagingPet, target);
    } finally {
      fs.rmSync(stagingRoot, { force: true, recursive: true });
    }
  }
  cachedPetList = null;
  cachedPetListUntil = 0;
  return { imported: bundles.length };
}

/**
 * Remove only pets that the learner placed in a writable pets folder.
 * Bundled, built-in and legacy-avatar sources are deliberately excluded.
 * Resolve the directory from the scanned catalogue instead of assuming the
 * manifest id matches its folder name; hand-installed pets do not always do so.
 */
export function removeUserManagedPet(rawSource, rawId) {
  const source = String(rawSource ?? "").trim();
  const id = String(rawId ?? "").trim();
  if (source !== "custom" && source !== "micheon-custom") {
    throw new Error("only pets in a Codex or Micheon pets folder can be deleted");
  }
  if (!id || id.length > 128) throw new Error("invalid pet id");

  const root = path.resolve(source === "custom"
    ? path.join(getCodexHome(), "pets")
    : path.join(getMicheonHome(), "pets"));
  const pet = listCodexPets({ fresh: true }).find(
    (entry) => entry.source === source && entry.id === id
  );
  if (!pet) throw new Error("pet not found in that pets folder");

  const target = path.resolve(path.dirname(pet.spritesheetPath));
  if (path.dirname(target) !== root) {
    throw new Error("refusing to remove outside the selected pets folder");
  }

  fs.rmSync(target, { force: false, recursive: true });
  cachedPetList = null;
  cachedPetListUntil = 0;
  return { id, removed: true, source };
}
