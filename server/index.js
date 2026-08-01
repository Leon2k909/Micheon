// Small TTS proxy + static server for germ.
//
// Why this exists: the high-quality "Microsoft … Online (Natural)" voices you
// hear in Edge are Azure neural voices streamed from Microsoft's cloud. Browsers
// other than Edge are blocked from connecting to that service (it needs a
// WebSocket header browsers aren't allowed to set). A *server*, however, has full
// control over the connection, so it can generate the exact same audio and hand
// the browser a plain MP3 — which plays identically in every browser and on mobile.
//
// This is free (no API key, no Azure account) but uses Microsoft's Read Aloud
// endpoint unofficially, so treat it as best-effort: the client falls back to the
// browser's built-in speechSynthesis if this server is unavailable.

import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { EdgeTTS } from "edge-tts-universal";
import { getCodexPetCatalog, removeUserManagedPet, resolveCodexPetSpritesheet } from "./codexPets.js";
import { fetchGalleryPage, installGalleryPet, installedGalleryIds, removeGalleryPet } from "./petGallery.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default neural voice per language. Override per-request with ?voice=.
//
// en-GB was missing here, and the miss fell through to DEFAULT_VOICE — so a
// learner who picked British English was read to in GERMAN, by Katja. Every
// language the app can ask for needs an entry, and the fallback below has to
// land on the right LANGUAGE rather than on whatever the default happens to be.
const VOICE_BY_LANG = {
  "de-DE": "de-DE-KatjaNeural",
  "de-AT": "de-AT-IngridNeural",
  "de-CH": "de-CH-LeniNeural",
  de: "de-DE-KatjaNeural",
  "fr-FR": "fr-FR-DeniseNeural",
  fr: "fr-FR-DeniseNeural",
  "en-US": "en-US-AvaNeural",
  "en-GB": "en-GB-SoniaNeural",
  "en-AU": "en-AU-NatashaNeural",
  "en-IE": "en-IE-EmilyNeural",
  en: "en-US-AvaNeural",
};
const DEFAULT_VOICE = "de-DE-KatjaNeural";

/**
 * The voices offered in the app's voice picker.
 *
 * A curated list rather than all 322 Microsoft voices: these are the ones a
 * German/English/French learner would actually want, named the way a person
 * would describe them.
 */
const VOICE_CHOICES = {
  "de-DE": [
    { id: "de-DE-KatjaNeural", label: "Katja", note: "German — female" },
    { id: "de-DE-ConradNeural", label: "Conrad", note: "German — male" },
    { id: "de-DE-AmalaNeural", label: "Amala", note: "German — female" },
    { id: "de-DE-KillianNeural", label: "Killian", note: "German — male" },
    { id: "de-DE-SeraphinaMultilingualNeural", label: "Seraphina", note: "German — female, multilingual" },
    { id: "de-AT-IngridNeural", label: "Ingrid", note: "Austrian German — female" },
    { id: "de-AT-JonasNeural", label: "Jonas", note: "Austrian German — male" },
    { id: "de-CH-LeniNeural", label: "Leni", note: "Swiss German — female" },
    { id: "de-CH-JanNeural", label: "Jan", note: "Swiss German — male" },
  ],
  "en-GB": [
    { id: "en-GB-SoniaNeural", label: "Sonia", note: "British — female" },
    { id: "en-GB-RyanNeural", label: "Ryan", note: "British — male" },
    { id: "en-GB-LibbyNeural", label: "Libby", note: "British — female" },
    { id: "en-GB-ThomasNeural", label: "Thomas", note: "British — male" },
    { id: "en-GB-MaisieNeural", label: "Maisie", note: "British — younger female" },
    { id: "en-IE-EmilyNeural", label: "Emily", note: "Irish — female" },
    { id: "en-IE-ConnorNeural", label: "Connor", note: "Irish — male" },
    { id: "en-AU-NatashaNeural", label: "Natasha", note: "Australian — female" },
    { id: "en-AU-WilliamMultilingualNeural", label: "William", note: "Australian — male" },
  ],
  "en-US": [
    { id: "en-US-AvaNeural", label: "Ava", note: "American — female" },
    { id: "en-US-AndrewNeural", label: "Andrew", note: "American — male" },
    { id: "en-US-EmmaNeural", label: "Emma", note: "American — female" },
    { id: "en-US-BrianNeural", label: "Brian", note: "American — male" },
    { id: "en-US-AriaNeural", label: "Aria", note: "American — female" },
    { id: "en-US-GuyNeural", label: "Guy", note: "American — male" },
  ],
  "fr-FR": [
    { id: "fr-FR-DeniseNeural", label: "Denise", note: "French — female" },
    { id: "fr-FR-HenriNeural", label: "Henri", note: "French — male" },
    { id: "fr-FR-EloiseNeural", label: "Eloise", note: "French — female" },
    { id: "fr-FR-VivienneMultilingualNeural", label: "Vivienne", note: "French — female, multilingual" },
  ],
};

/** Every voice we are willing to synthesise with, so ?voice= cannot be anything. */
const ALLOWED_VOICES = new Set([
  ...Object.values(VOICE_CHOICES).flat().map((v) => v.id),
  ...Object.values(VOICE_BY_LANG),
]);

/**
 * Pick a voice for a language tag.
 *
 * Falls back along the tag rather than to a fixed default: en-NZ has no entry,
 * but it is English, and an English sentence read by a German voice is worse
 * than one read in the wrong English accent.
 */
function voiceForLang(lang) {
  const tag = String(lang || "").trim();
  if (VOICE_BY_LANG[tag]) return VOICE_BY_LANG[tag];
  const base = tag.split(/[-_]/)[0].toLowerCase();
  return VOICE_BY_LANG[base] || DEFAULT_VOICE;
}

// Convert a SpeechSynthesis-style rate (1.0 = normal) to edge-tts "+N%"/"-N%".
function ratePercent(rate) {
  const r = Number(rate);
  if (!Number.isFinite(r) || r === 1) return "+0%";
  const pct = Math.max(-50, Math.min(100, Math.round((r - 1) * 100)));
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

// Bounded in-memory cache so repeated sentences (very common in a lesson) are
// instant and we don't re-hit Microsoft for the same text. Count alone was not
// enough because clips vary greatly in size, so cap bytes as well.
const CACHE_MAX_ENTRIES = 128;
const CACHE_MAX_BYTES = 32 * 1024 * 1024;
const cache = new Map(); // key -> Buffer
let cacheBytes = 0;
const pendingSynthesis = new Map();
const synthesisQueue = [];
const MAX_CONCURRENT_SYNTHESES = 2;
let activeSyntheses = 0;

function cacheGet(key) {
  const buf = cache.get(key);
  if (buf) {
    cache.delete(key); // refresh recency
    cache.set(key, buf);
  }
  return buf;
}
function cacheSet(key, buf) {
  const existing = cache.get(key);
  if (existing) {
    cache.delete(key);
    cacheBytes -= existing.byteLength;
  }
  cache.set(key, buf);
  cacheBytes += buf.byteLength;
  while (
    cache.size > 1
    && (cache.size > CACHE_MAX_ENTRIES || cacheBytes > CACHE_MAX_BYTES)
  ) {
    const oldestKey = cache.keys().next().value;
    const oldest = cache.get(oldestKey);
    cache.delete(oldestKey);
    cacheBytes -= oldest?.byteLength ?? 0;
  }
}

function withSynthesisSlot(task) {
  return new Promise((resolve, reject) => {
    const run = async () => {
      activeSyntheses += 1;
      try {
        resolve(await task());
      } catch (error) {
        reject(error);
      } finally {
        activeSyntheses -= 1;
        synthesisQueue.shift()?.();
      }
    };
    if (activeSyntheses < MAX_CONCURRENT_SYNTHESES) void run();
    else synthesisQueue.push(run);
  });
}

function synthesizeOnce(key, text, voice, rate) {
  const pending = pendingSynthesis.get(key);
  if (pending) return pending;

  const promise = withSynthesisSlot(async () => {
    const tts = new EdgeTTS(text, voice, { rate, volume: "+0%", pitch: "+0Hz" });
    const result = await tts.synthesize();
    const buf = Buffer.from(await result.audio.arrayBuffer());
    cacheSet(key, buf);
    return buf;
  });
  pendingSynthesis.set(key, promise);
  const release = () => {
    if (pendingSynthesis.get(key) === promise) pendingSynthesis.delete(key);
  };
  void promise.then(release, release);
  return promise;
}

const app = express();
app.use(express.json({ limit: "1mb" }));

const appdataDir = path.join(process.env.APPDATA || os.homedir(), "germ");
const appdataFile = path.join(appdataDir, "shared-progress.json");
const workspaceFile = path.resolve(__dirname, "../shared-progress.json");
// The packaged server lives inside app.asar, which is immutable. Trying to
// mirror progress there failed and logged on every POST; the AppData copy is the
// intended production store. Keep the workspace mirror only for local dev.
const workspaceStorageEnabled = !/[\\/]app\.asar[\\/]/i.test(__dirname);
let sharedStorageCache = null;

function readSharedStorage() {
  if (sharedStorageCache) return sharedStorageCache;
  let appdataData = { items: {} };
  let workspaceData = { items: {} };

  try {
    if (fs.existsSync(appdataFile)) {
      appdataData = JSON.parse(fs.readFileSync(appdataFile, "utf8"));
    }
  } catch (e) {
    console.error("Error reading AppData storage:", e);
  }

  if (workspaceStorageEnabled) {
    try {
      if (fs.existsSync(workspaceFile)) {
        workspaceData = JSON.parse(fs.readFileSync(workspaceFile, "utf8"));
      }
    } catch (e) {
      console.error("Error reading workspace storage:", e);
    }
  }

  const mergedItems = { ...(appdataData.items || {}), ...(workspaceData.items || {}) };
  const appdataTime = appdataData.updatedAt ? new Date(appdataData.updatedAt).getTime() : 0;
  const workspaceTime = workspaceData.updatedAt ? new Date(workspaceData.updatedAt).getTime() : 0;
  let mergedUpdatedAt = appdataData.updatedAt || workspaceData.updatedAt || new Date().toISOString();

  if (appdataTime > workspaceTime) {
    Object.assign(mergedItems, appdataData.items || {});
    mergedUpdatedAt = appdataData.updatedAt;
  } else if (workspaceTime > appdataTime) {
    Object.assign(mergedItems, workspaceData.items || {});
    mergedUpdatedAt = workspaceData.updatedAt;
  }

  sharedStorageCache = {
    items: mergedItems,
    updatedAt: mergedUpdatedAt
  };
  return sharedStorageCache;
}

function writeSharedStorage(next) {
  sharedStorageCache = next;
  const raw = JSON.stringify(next, null, 2);

  try {
    fs.mkdirSync(appdataDir, { recursive: true });
    fs.writeFileSync(appdataFile, raw);
  } catch (e) {
    console.error("Failed to write to AppData storage:", e);
  }

  if (workspaceStorageEnabled) {
    try {
      fs.writeFileSync(workspaceFile, raw);
    } catch (e) {
      console.error("Failed to write to workspace storage:", e);
    }
  }
}

app.get("/api/storage", (_req, res) => {
  res.json(readSharedStorage());
});

app.post("/api/storage", (req, res) => {
  const incoming = req.body?.items;
  if (!incoming || typeof incoming !== "object") {
    return res.status(400).json({ error: "missing items" });
  }

  const current = readSharedStorage();
  const items = { ...(current.items || {}) };
  for (const [key, value] of Object.entries(incoming)) {
    if (typeof key !== "string") continue;
    if (value == null) delete items[key];
    else items[key] = String(value);
  }
  const next = { ...current, items, updatedAt: new Date().toISOString() };
  writeSharedStorage(next);
  res.json({ ok: true, count: Object.keys(items).length });
});

app.get("/api/codex-pets", (_req, res) => {
  res.set("Cache-Control", "no-store");
  // One explicit refresh scans manifests once; the spritesheet requests that
  // immediately follow reuse that result instead of repeating the same disk
  // walk for every thumbnail.
  res.json(getCodexPetCatalog({ fresh: true }));
});

// Browse and install pets from codex-pets.net. Routed through the server so
// the page never makes cross-origin requests and an install is one audited
// step rather than a download the renderer unpacks itself.
app.get("/api/pet-gallery", async (req, res) => {
  try {
    const page = await fetchGalleryPage({ page: req.query.page, search: req.query.search });
    res.set("Cache-Control", "no-store");
    res.json({ ...page, installed: installedGalleryIds() });
  } catch (error) {
    res.status(502).json({ error: String(error?.message ?? error) });
  }
});

app.post("/api/pet-gallery/:id/install", async (req, res) => {
  try {
    res.json(await installGalleryPet(req.params.id));
  } catch (error) {
    res.status(400).json({ error: String(error?.message ?? error) });
  }
});

app.delete("/api/pet-gallery/:id", (req, res) => {
  try {
    res.json(removeGalleryPet(req.params.id));
  } catch (error) {
    res.status(400).json({ error: String(error?.message ?? error) });
  }
});

app.delete("/api/codex-pets/:source/:id", (req, res) => {
  try {
    res.json(removeUserManagedPet(req.params.source, req.params.id));
  } catch (error) {
    res.status(400).json({ error: String(error?.message ?? error) });
  }
});

app.get("/api/codex-pets/:source/:id/spritesheet", (req, res) => {
  const spritesheet = resolveCodexPetSpritesheet(req.params.source, req.params.id);
  if (!spritesheet) return res.status(404).json({ error: "pet not found" });

  res.set("Cache-Control", "private, max-age=3600");
  res.set("Content-Type", "image/webp");
  return res.sendFile(spritesheet, { dotfiles: "allow" });
});

function firstSpokenAlternative(value) {
  const text = String(value || "").trim();
  const separatorIndex = text.search(/\s+\/\s+/u);
  const firstAlternative = separatorIndex === -1
    ? text
    : text.slice(0, separatorIndex).trim();

  return firstAlternative
    .replace(/\band\/or\b/giu, "and or")
    .replace(/\bund\/oder\b/giu, "und oder")
    .replace(/(\p{L}+)\/\p{L}+/gu, "$1");
}

app.get("/api/tts", async (req, res) => {
  const text = firstSpokenAlternative(String(req.query.text || "").slice(0, 600));
  if (!text) return res.status(400).json({ error: "missing text" });

  const lang = String(req.query.lang || "de-DE");
  // A requested voice has to be one we know: it goes straight into an upstream
  // request, and an unknown name would only fail there anyway.
  const asked = String(req.query.voice || "");
  const voice = ALLOWED_VOICES.has(asked) ? asked : voiceForLang(lang);
  const rate = ratePercent(req.query.rate);

  const key = `${voice}|${rate}|${text}`;
  const cached = cacheGet(key);
  if (cached) {
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "private, no-store");
    res.set("X-TTS-Cache", "hit");
    return res.send(cached);
  }

  try {
    const buf = await synthesizeOnce(key, text, voice, rate);
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "private, no-store");
    res.set("X-TTS-Cache", "miss");
    return res.send(buf);
  } catch (err) {
    // Let the browser fall back to local speechSynthesis.
    console.error("[tts] synth failed:", err?.message || err);
    return res.status(502).json({ error: "tts upstream failed" });
  }
});

/** The voices the picker offers, and which one each language uses by default. */
app.get("/api/tts/voices", (_req, res) => {
  res.json({
    choices: VOICE_CHOICES,
    defaults: Object.fromEntries(Object.keys(VOICE_CHOICES).map((lang) => [lang, voiceForLang(lang)])),
  });
});

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  cached: cache.size,
  cachedBytes: cacheBytes,
  queuedSyntheses: synthesisQueue.length,
  synthesizing: activeSyntheses,
}));

// In production, serve the built front-end and let the SPA handle routing.
const dist = path.resolve(__dirname, "../dist");
app.use(express.static(dist));
// Catch-all (Express 5 dropped string "*" routes) — send index.html for any
// non-API GET so client-side routing works on refresh/deep links.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(dist, "index.html"));
});

// Start listening. Returns a promise that resolves once the server is up, so
// callers (e.g. the Electron main process) can wait before loading the window.
export function startServer(port = process.env.PORT || 3001) {
  return new Promise((resolve) => {
    const srv = app.listen(port, () => {
      console.log(`germ TTS server listening on http://localhost:${port}`);
      resolve(srv);
    });
  });
}

// Auto-start when run directly (node server/index.js), but not when imported.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
