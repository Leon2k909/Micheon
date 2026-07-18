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
// Monotonic token: every new top-level play call bumps this so any in-flight
// playback or fetch from a previous call knows to bail (mirrors speechSynthesis.cancel).
let playSeq = 0;

// Cache object URLs by text+lang+rate so repeated sentences play instantly.
const urlCache = new Map<string, string>();

function hardStop() {
  emitSpeaking(false);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Muting mid-playback cuts the current voice off immediately.
if (typeof window !== "undefined") {
  window.addEventListener(AUDIO_MUTE_EVENT, () => {
    if (isAudioMuted()) {
      playSeq += 1; // invalidate in-flight sequences
      hardStop();
    }
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

async function getAudioUrl(text: string, rate: number, lang: string): Promise<string> {
  const key = `${lang}|${rate}|${text}`;
  const cached = urlCache.get(key);
  if (cached) return cached;
  const qs = `text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&rate=${rate}`;
  const resp = await fetch(`/api/tts?${qs}`);
  if (!resp.ok) throw new Error(`tts http ${resp.status}`);
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  urlCache.set(key, url);
  return url;
}

function playUrl(url: string, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (token !== playSeq) return resolve();
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onplaying = () => { if (token === playSeq) emitSpeaking(true); };
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

async function playOne(item: SeqItem, token: number): Promise<void> {
  const { text, lang } = item;
  const rate = item.rate ?? DEFAULT_RATE;
  if (!text) return;
  try {
    const url = await getAudioUrl(text, rate, lang);
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
  return playOne({ text, rate, lang }, token).finally(() => {
    if (token === playSeq) emitSpeaking(false);
  });
}

/** Speak several phrases back-to-back (e.g. German then French on the Listen step). No-op while muted. */
export function ttsSequence(items: SeqItem[]): Promise<void> {
  if (isAudioMuted()) return Promise.resolve();
  hardStop();
  const token = ++playSeq;
  return (async () => {
    for (const item of items) {
      if (token !== playSeq) break;
      await playOne(item, token);
    }
  })().finally(() => {
    if (token === playSeq) emitSpeaking(false);
  });
}

/** Warm the cache for a phrase without playing it (optional, for snappier UX). */
export function preloadTts(text: string, rate = DEFAULT_RATE, lang = "de-DE"): void {
  if (!text) return;
  getAudioUrl(text, rate, lang).catch(() => {});
}
