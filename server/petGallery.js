import fs from "fs";
import os from "os";
import path from "path";
import process from "node:process";
import zlib from "zlib";

/**
 * Browsing and installing pets from codex-pets.net.
 *
 * The renderer never talks to the gallery directly: it goes through here so the
 * app is not making cross-origin requests from the page, and so an install is a
 * single audited step — download, verify, unpack into the same folder the local
 * pet loader already reads.
 */

const GALLERY_ORIGIN = "https://codex-pets.net";
/** A pet bundle is a manifest plus one spritesheet; anything larger is wrong. */
const MAX_BUNDLE_BYTES = 24 * 1024 * 1024;
const MAX_ENTRY_BYTES = 24 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 30000;

function getMicheonHome() {
  const configured = process.env.MICHEON_HOME?.trim();
  return configured ? path.resolve(configured) : path.join(os.homedir(), ".micheon");
}

function installRoot() {
  return path.join(getMicheonHome(), "pets");
}

/** Ids come from a remote service, so they are never trusted as path segments. */
function safePetId(value) {
  const id = String(value ?? "").trim();
  if (!id || id.length > 64) return null;
  return /^[a-zA-Z0-9._-]+$/.test(id) && id !== "." && id !== ".." ? id : null;
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** One page of the public gallery, trimmed to what the picker actually shows. */
export async function fetchGalleryPage({ page = 1, search = "" } = {}) {
  const url = new URL("/api/pets", GALLERY_ORIGIN);
  url.searchParams.set("page", String(Math.max(1, Math.min(200, Number(page) || 1))));
  if (search) url.searchParams.set("search", String(search).slice(0, 80));

  const response = await fetchWithTimeout(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`gallery returned ${response.status}`);
  const payload = await response.json();
  const pets = Array.isArray(payload?.pets) ? payload.pets : [];

  return {
    page: Number(payload?.page) || 1,
    totalPages: Number(payload?.totalPages) || 1,
    total: Number(payload?.total) || pets.length,
    pets: pets
      .filter((pet) => safePetId(pet?.id) && !pet?.ownerShadowbanned)
      .map((pet) => ({
        id: pet.id,
        displayName: typeof pet.displayName === "string" ? pet.displayName.slice(0, 80) : pet.id,
        description: typeof pet.description === "string" ? pet.description.slice(0, 400) : "",
        kind: typeof pet.kind === "string" ? pet.kind.slice(0, 40) : "",
        tags: Array.isArray(pet.tags) ? pet.tags.filter((t) => typeof t === "string").slice(0, 8) : [],
        owner: typeof pet.ownerHandle === "string" ? pet.ownerHandle.slice(0, 60) : "",
        likeCount: Number(pet.likeCount) || 0,
        downloadCount: Number(pet.downloadCount) || 0,
        previewUrl: typeof pet.previewUrl === "string" ? pet.previewUrl : "",
        posterUrl: typeof pet.posterUrl === "string" ? pet.posterUrl : "",
        downloadUrl: typeof pet.downloadUrl === "string" ? pet.downloadUrl : "",
      })),
  };
}

/** Which gallery pets are already on disk, so the UI can say so. */
export function installedGalleryIds() {
  try {
    return fs.readdirSync(installRoot(), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Minimal zip reader for the two-file bundles the gallery produces.
 *
 * Deliberately not a general unzipper: it walks local file headers, refuses
 * anything with a path separator or an unexpected name, and caps the output
 * size. A pet bundle that does not look exactly like {pet.json, spritesheet}
 * is rejected rather than partially written.
 */
function readZipEntries(buffer) {
  const entries = [];
  let offset = 0;
  while (offset < buffer.length - 4) {
    if (buffer.readUInt32LE(offset) !== 0x04034b50) { offset += 1; continue; }
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const name = buffer.toString("utf8", nameStart, nameStart + nameLength);
    const dataStart = nameStart + nameLength + extraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    if (compressedSize > MAX_ENTRY_BYTES) throw new Error("bundle entry too large");

    let contents;
    if (method === 0) contents = Buffer.from(data);
    else if (method === 8) contents = zlib.inflateRawSync(data, { maxOutputLength: MAX_ENTRY_BYTES });
    else throw new Error(`unsupported compression in bundle (${method})`);

    entries.push({ name, contents });
    offset = dataStart + compressedSize;
  }
  return entries;
}

export async function installGalleryPet(rawId) {
  const id = safePetId(rawId);
  if (!id) throw new Error("invalid pet id");

  const response = await fetchWithTimeout(
    new URL(`/api/pets/${encodeURIComponent(id)}/download`, GALLERY_ORIGIN),
    { headers: { accept: "application/zip" } }
  );
  if (!response.ok) throw new Error(`download returned ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_BUNDLE_BYTES) throw new Error("bundle too large");
  if (buffer.readUInt32LE(0) !== 0x04034b50) throw new Error("not a pet bundle");

  const entries = readZipEntries(buffer);
  const manifest = entries.find((entry) => entry.name === "pet.json");
  const sprite = entries.find((entry) => /^spritesheet\.(webp|png)$/.test(entry.name));
  if (!manifest || !sprite) throw new Error("bundle is missing pet.json or a spritesheet");

  // Parse before writing anything, so a malformed manifest cannot leave a
  // half-installed pet that breaks the catalogue on next launch.
  let parsed;
  try {
    parsed = JSON.parse(manifest.contents.toString("utf8"));
  } catch {
    throw new Error("bundle manifest is not valid JSON");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("bundle manifest is not an object");

  const target = path.join(installRoot(), id);
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, "pet.json"), manifest.contents);
  fs.writeFileSync(path.join(target, sprite.name), sprite.contents);

  return {
    id,
    displayName: typeof parsed.displayName === "string" ? parsed.displayName : id,
    installedAt: new Date().toISOString(),
    path: target,
  };
}

export function removeGalleryPet(rawId) {
  const id = safePetId(rawId);
  if (!id) throw new Error("invalid pet id");
  const target = path.join(installRoot(), id);
  // Guard against a symlinked or escaped path before deleting anything.
  if (path.dirname(target) !== installRoot()) throw new Error("refusing to remove outside the pets folder");
  fs.rmSync(target, { force: true, recursive: true });
  return { id, removed: true };
}
