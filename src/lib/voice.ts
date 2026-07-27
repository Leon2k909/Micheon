// Front-end TTS playback.
//
// Primary path: fetch an MP3 from our /api/tts server, which generates the exact
// Microsoft neural voices using edge-tts. This sounds identical in every browser
// (Chrome, Firefox, Safari, mobile), not just Edge.
//
// Fallback path: if the server is unreachable (offline, not running, upstream
// blocked), we fall back to the browser's built-in speechSynthesis so audio never
// goes fully silent — it just won't be the premium voice.

import { AUDIO_MUTE_EVENT, isAudioMuted } from "@/lib/audioMute";
import { firstSpokenAlternative } from "@/lib/spokenText";
import { TTS_VOICE_EVENT, voiceForLang } from "@/lib/ttsVoice";

type SeqItem = { text: string; rate?: number; lang: string };

const DEFAULT_RATE = 0.88;

/** Fired on window with detail=true when speech starts and detail=false when it
 *  ends or is interrupted — lets the UI (lesson waveform) react to the voice. */
export const TTS_SPEAKING_EVENT = "tts-speaking";
function emitSpeaking(on: boolean) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TTS_SPEAKING_EVENT, { detail: on }));
  }
}

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;
let currentAudioResolve: (() => void) | null = null;
let currentFetchController: AbortController | null = null;
// Monotonic token: every new top-level play call bumps this so any in-flight
// playback or fetch from a previous call knows to bail (mirrors speechSynthesis.cancel).
let playSeq = 0;

type CachedAudioUrl = { bytes: number; url: string };

// Cache object URLs by text+lang+rate so repeated sentences play instantly,
// but cap both count and bytes. A long session can encounter hundreds of
// unique phrases, and Blob URLs keep their backing MP3 alive until explicitly
// revoked.
const URL_CACHE_MAX_ENTRIES = 64;
const URL_CACHE_MAX_BYTES = 24 * 1024 * 1024;
const urlCache = new Map<string, CachedAudioUrl>();
let urlCacheBytes = 0;

function trimUrlCache() {
  while (
    urlCache.size > 1
    && (urlCache.size > URL_CACHE_MAX_ENTRIES || urlCacheBytes > URL_CACHE_MAX_BYTES)
  ) {
    let evicted = false;
    for (const [key, entry] of urlCache) {
      // Never revoke the URL currently being played. Once playback ends the
      // trim runs again and can reclaim it if it is now the oldest entry.
      if (entry.url === currentAudioUrl) continue;
      urlCache.delete(key);
      urlCacheBytes -= entry.bytes;
      URL.revokeObjectURL(entry.url);
      evicted = true;
      break;
    }
    if (!evicted) break;
  }
}

function cachedAudioUrl(key: string) {
  const entry = urlCache.get(key);
  if (!entry) return null;
  // Map insertion order gives us a tiny LRU without another data structure.
  urlCache.delete(key);
  urlCache.set(key, entry);
  return entry.url;
}

function cacheAudioBlob(key: string, blob: Blob) {
  const previous = urlCache.get(key);
  if (previous) {
    urlCache.delete(key);
    urlCacheBytes -= previous.bytes;
    URL.revokeObjectURL(previous.url);
  }
  const entry = { bytes: blob.size, url: URL.createObjectURL(blob) };
  urlCache.set(key, entry);
  urlCacheBytes += entry.bytes;
  trimUrlCache();
  return entry.url;
}

function clearUrlCache() {
  for (const entry of urlCache.values()) URL.revokeObjectURL(entry.url);
  urlCache.clear();
  urlCacheBytes = 0;
}

function hardStop() {
  emitSpeaking(false);
  currentFetchController?.abort();
  currentFetchController = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentAudioUrl = null;
  currentAudioResolve?.();
  currentAudioResolve = null;
  trimUrlCache();
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** Cancel the active TTS request/playback, including a fetch that has not resolved yet. */
export function stopTts(): void {
  playSeq += 1;
  hardStop();
}

// Muting mid-playback cuts the current voice off immediately.
if (typeof window !== "undefined") {
  window.addEventListener(AUDIO_MUTE_EVENT, () => {
    if (isAudioMuted()) {
      stopTts();
    }
  });

  // Changing voice makes every clip already generated the wrong one. They are
  // keyed by voice so they would never be served again — revoking them hands
  // the memory back instead of holding a whole lesson's audio for nothing.
  window.addEventListener(TTS_VOICE_EVENT, () => {
    stopTts();
    clearUrlCache();
  });

  window.addEventListener("pagehide", () => {
    stopTts();
    clearUrlCache();
  });
}

function speakFallback(text: string, rate: number, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.onstart = () => emitSpeaking(true);
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

async function getAudioUrl(
  text: string,
  rate: number,
  lang: string,
  signal?: AbortSignal
): Promise<string> {
  // The chosen voice is part of the cache key, or switching voice would keep
  // replaying the old one for every sentence already heard.
  const voice = voiceForLang(lang);
  const key = `${lang}|${voice}|${rate}|${text}`;
  const cached = cachedAudioUrl(key);
  if (cached) return cached;
  const qs = `text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&rate=${rate}`
    + (voice ? `&voice=${encodeURIComponent(voice)}` : "");
  const resp = await fetch(`/api/tts?${qs}`, { signal });
  if (!resp.ok) throw new Error(`tts http ${resp.status}`);
  const blob = await resp.blob();
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return cacheAudioBlob(key, blob);
}

function playUrl(url: string, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (token !== playSeq) return resolve();
    const audio = new Audio(url);
    const finish = () => {
      if (currentAudio === audio) {
        currentAudio = null;
        currentAudioUrl = null;
        trimUrlCache();
      }
      if (currentAudioResolve === finish) currentAudioResolve = null;
      resolve();
    };
    currentAudio = audio;
    currentAudioUrl = url;
    currentAudioResolve = finish;
    audio.onplaying = () => { if (token === playSeq) emitSpeaking(true); };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  });
}

async function playOne(item: SeqItem, token: number, signal?: AbortSignal): Promise<void> {
  const { lang } = item;
  const text = firstSpokenAlternative(item.text);
  const rate = item.rate ?? DEFAULT_RATE;
  if (!text) return;
  try {
    const url = await getAudioUrl(text, rate, lang, signal);
    if (token !== playSeq) return;
    await playUrl(url, token);
  } catch {
    if (token !== playSeq) return;
    await speakFallback(text, rate, lang);
  }
}

/** Speak a single phrase. Interrupts whatever is currently playing. No-op while muted. */
export function tts(text: string, rate = DEFAULT_RATE, lang = "de-DE"): Promise<void> {
  if (isAudioMuted()) return Promise.resolve();
  hardStop();
  const token = ++playSeq;
  const fetchController = new AbortController();
  currentFetchController = fetchController;
  return playOne({ text, rate, lang }, token, fetchController.signal).finally(() => {
    if (token === playSeq) {
      currentFetchController = null;
      emitSpeaking(false);
    }
  });
}

/** Speak several phrases back-to-back (e.g. German then French on the Listen step). No-op while muted. */
export function ttsSequence(items: SeqItem[]): Promise<void> {
  if (isAudioMuted()) return Promise.resolve();
  hardStop();
  const token = ++playSeq;
  const fetchController = new AbortController();
  currentFetchController = fetchController;
  return (async () => {
    for (const item of items) {
      if (token !== playSeq) break;
      await playOne(item, token, fetchController.signal);
    }
  })().finally(() => {
    if (token === playSeq) {
      currentFetchController = null;
      emitSpeaking(false);
    }
  });
}

/** Warm the cache for a phrase without playing it (optional, for snappier UX). */
export function preloadTts(text: string, rate = DEFAULT_RATE, lang = "de-DE"): void {
  const spokenText = firstSpokenAlternative(text);
  if (!spokenText) return;
  getAudioUrl(spokenText, rate, lang).catch(() => {});
}
