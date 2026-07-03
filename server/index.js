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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default neural voice per language. Override per-request with ?voice=.
const VOICE_BY_LANG = {
  "de-DE": "de-DE-KatjaNeural",
  de: "de-DE-KatjaNeural",
  "fr-FR": "fr-FR-DeniseNeural",
  fr: "fr-FR-DeniseNeural",
  "en-US": "en-US-AvaNeural",
  en: "en-US-AvaNeural",
};
const DEFAULT_VOICE = "de-DE-KatjaNeural";

// Convert a SpeechSynthesis-style rate (1.0 = normal) to edge-tts "+N%"/"-N%".
function ratePercent(rate) {
  const r = Number(rate);
  if (!Number.isFinite(r) || r === 1) return "+0%";
  const pct = Math.max(-50, Math.min(100, Math.round((r - 1) * 100)));
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

// Bounded in-memory cache so repeated sentences (very common in a lesson) are
// instant and we don't re-hit Microsoft for the same text. Oldest entries are
// evicted once we pass the cap.
const CACHE_MAX = 500;
const cache = new Map(); // key -> Buffer

function cacheGet(key) {
  const buf = cache.get(key);
  if (buf) {
    cache.delete(key); // refresh recency
    cache.set(key, buf);
  }
  return buf;
}
function cacheSet(key, buf) {
  cache.set(key, buf);
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
}

const app = express();
app.use(express.json({ limit: "1mb" }));

const appdataDir = path.join(process.env.APPDATA || os.homedir(), "germ");
const appdataFile = path.join(appdataDir, "shared-progress.json");
const workspaceFile = path.resolve(__dirname, "../shared-progress.json");

function readSharedStorage() {
  let appdataData = { items: {} };
  let workspaceData = { items: {} };

  try {
    if (fs.existsSync(appdataFile)) {
      appdataData = JSON.parse(fs.readFileSync(appdataFile, "utf8"));
    }
  } catch (e) {
    console.error("Error reading AppData storage:", e);
  }

  try {
    if (fs.existsSync(workspaceFile)) {
      workspaceData = JSON.parse(fs.readFileSync(workspaceFile, "utf8"));
    }
  } catch (e) {
    console.error("Error reading workspace storage:", e);
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

  return {
    items: mergedItems,
    updatedAt: mergedUpdatedAt
  };
}

function writeSharedStorage(next) {
  const raw = JSON.stringify(next, null, 2);

  try {
    fs.mkdirSync(appdataDir, { recursive: true });
    fs.writeFileSync(appdataFile, raw);
  } catch (e) {
    console.error("Failed to write to AppData storage:", e);
  }

  try {
    fs.writeFileSync(workspaceFile, raw);
  } catch (e) {
    console.error("Failed to write to workspace storage:", e);
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

app.get("/api/tts", async (req, res) => {
  const text = String(req.query.text || "").slice(0, 600).trim();
  if (!text) return res.status(400).json({ error: "missing text" });

  const lang = String(req.query.lang || "de-DE");
  const voice = String(req.query.voice || VOICE_BY_LANG[lang] || DEFAULT_VOICE);
  const rate = ratePercent(req.query.rate);

  const key = `${voice}|${rate}|${text}`;
  const cached = cacheGet(key);
  if (cached) {
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("X-TTS-Cache", "hit");
    return res.send(cached);
  }

  try {
    const tts = new EdgeTTS(text, voice, { rate, volume: "+0%", pitch: "+0Hz" });
    const result = await tts.synthesize();
    const buf = Buffer.from(await result.audio.arrayBuffer());
    cacheSet(key, buf);
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("X-TTS-Cache", "miss");
    return res.send(buf);
  } catch (err) {
    // Let the browser fall back to local speechSynthesis.
    console.error("[tts] synth failed:", err?.message || err);
    return res.status(502).json({ error: "tts upstream failed" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, cached: cache.size }));

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
