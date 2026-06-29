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
import path from "path";
import { fileURLToPath } from "url";
import { EdgeTTS } from "edge-tts-universal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log(`germ TTS server listening on http://localhost:${PORT}`);
});
