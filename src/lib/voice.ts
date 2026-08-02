// Front-end TTS playback.
//
// Primary path: fetch an MP3 from our /api/tts server, which generates the exact
// Microsoft neural voices using edge-tts. This sounds identical in every browser
// (Chrome, Firefox, Safari, mobile), not just Edge.
//
// Fallback path: if the server is unreachable (offline, not running, upstream
// blocked), we fall back to the browser's built-in speechSynthesis so audio never
// goes fully silent — it just won't be the premium voice.

import { AUDIO_SETTINGS_EVENT, getTtsAudioVolume } from "@/lib/audioMute";
import {
  smoothSpeechLevel,
  speechLevelFromPcm,
  speechSpectrumFromFft,
} from "@/lib/audioLevel";
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

/** Real audio energy from the premium MP3 path. Browser speechSynthesis cannot
 * expose PCM, so it deliberately reports available=false rather than faking it. */
export const TTS_AUDIO_LEVEL_EVENT = "tts-audio-level";
export type TtsAudioLevelDetail = {
  level: number;
  available: boolean;
  /** Low-to-high real frequency energy from the currently playing TTS clip. */
  spectrum: number[];
};
function emitAudioLevel(level: number, available: boolean, spectrum: number[] = []) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<TtsAudioLevelDetail>(TTS_AUDIO_LEVEL_EVENT, {
      detail: { level, available, spectrum },
    }));
  }
}

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;
let currentAudioResolve: (() => void) | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentUtteranceResolve: (() => void) | null = null;
let currentPlaybackLang: string | null = null;
let currentFetchController: AbortController | null = null;
let sharedAudioContext: AudioContext | null = null;
let currentAudioSource: MediaElementAudioSourceNode | null = null;
let currentAudioAnalyser: AnalyserNode | null = null;
let currentAudioLevelFrame: number | null = null;
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

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    sharedAudioContext ??= new AudioContextClass();
    return sharedAudioContext;
  } catch {
    return null;
  }
}

function stopAudioAnalysis(reset = true) {
  if (currentAudioLevelFrame !== null && typeof window !== "undefined") {
    window.cancelAnimationFrame(currentAudioLevelFrame);
  }
  currentAudioLevelFrame = null;
  try { currentAudioSource?.disconnect(); } catch { /* already disconnected */ }
  try { currentAudioAnalyser?.disconnect(); } catch { /* already disconnected */ }
  currentAudioSource = null;
  currentAudioAnalyser = null;
  if (reset) emitAudioLevel(0, false);
}

async function attachAudioAnalysis(audio: HTMLAudioElement, token: number) {
  const context = getSharedAudioContext();
  if (!context) return null;
  if (context.state === "suspended") {
    try { await context.resume(); } catch { return null; }
  }
  // Never reroute an audible media element into a context that autoplay policy
  // left suspended: direct HTMLAudio playback is more important than the meter.
  if (context.state !== "running" || token !== playSeq || currentAudio !== audio) return null;

  let source: MediaElementAudioSourceNode | null = null;
  try {
    source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    // 1024 gives speech fundamentals and consonants visibly separate bars
    // without adding meaningful work at the 25 Hz UI sampling rate.
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.58;
    source.connect(analyser);
    analyser.connect(context.destination);
    currentAudioSource = source;
    currentAudioAnalyser = analyser;
    return analyser;
  } catch {
    // If creating the source succeeded but the analyser graph did not, keep the
    // clip audible through a direct connection and report no measured levels.
    if (source) {
      try {
        source.disconnect();
        source.connect(context.destination);
        currentAudioSource = source;
      } catch { /* audio.play() will use its normal fallback where possible */ }
    }
    emitAudioLevel(0, false);
    return null;
  }
}

function startAudioAnalysis(
  audio: HTMLAudioElement,
  analyser: AnalyserNode,
  token: number
) {
  const samples = new Uint8Array(analyser.fftSize);
  const frequencySamples = new Uint8Array(analyser.frequencyBinCount);
  let smoothedLevel = 0;
  let smoothedSpectrum = Array.from({ length: 12 }, () => 0);
  let lastSampleAt = 0;

  const sample = (now: number) => {
    if (
      token !== playSeq
      || currentAudio !== audio
      || currentAudioAnalyser !== analyser
    ) return;

    currentAudioLevelFrame = window.requestAnimationFrame(sample);
    if (now - lastSampleAt < 40) return;
    lastSampleAt = now;
    analyser.getByteTimeDomainData(samples);
    analyser.getByteFrequencyData(frequencySamples);
    smoothedLevel = smoothSpeechLevel(smoothedLevel, speechLevelFromPcm(samples));
    const measuredSpectrum = speechSpectrumFromFft(
      frequencySamples,
      analyser.context.sampleRate,
      analyser.fftSize,
      smoothedSpectrum.length
    );
    // The RMS gate lets genuine frequency shape through while dropping the
    // analyser's low-level MP3/noise floor between spoken syllables.
    const levelGate = smoothedLevel <= 0.012
      ? 0
      : Math.min(1, 0.32 + smoothedLevel * 1.9);
    smoothedSpectrum = measuredSpectrum.map((band, index) => (
      smoothSpeechLevel(smoothedSpectrum[index], band * levelGate)
    ));
    emitAudioLevel(smoothedLevel, true, smoothedSpectrum);
  };

  if (currentAudioLevelFrame !== null) {
    window.cancelAnimationFrame(currentAudioLevelFrame);
  }
  currentAudioLevelFrame = window.requestAnimationFrame(sample);
}

function stopCurrentMedia() {
  stopAudioAnalysis();
  emitSpeaking(false);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentAudioUrl = null;
  currentAudioResolve?.();
  currentAudioResolve = null;
  if (currentUtterance) {
    currentUtterance = null;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
  currentUtteranceResolve?.();
  currentUtteranceResolve = null;
  currentPlaybackLang = null;
  trimUrlCache();
}

function hardStop() {
  currentFetchController?.abort();
  currentFetchController = null;
  stopCurrentMedia();
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** Cancel the active TTS request/playback, including a fetch that has not resolved yet. */
export function stopTts(): void {
  playSeq += 1;
  hardStop();
}

// Settings apply live. Muting the language currently speaking cuts only that
// item off, allowing a mixed-language sequence to continue with its next item.
if (typeof window !== "undefined") {
  window.addEventListener(AUDIO_SETTINGS_EVENT, () => {
    if (!currentPlaybackLang) return;
    const volume = getTtsAudioVolume(currentPlaybackLang);
    if (volume <= 0) {
      stopCurrentMedia();
      return;
    }
    if (currentAudio) currentAudio.volume = volume;
    if (currentUtterance) currentUtterance.volume = volume;
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
    const context = sharedAudioContext;
    sharedAudioContext = null;
    if (context && context.state !== "closed") void context.close().catch(() => {});
  });
}

function speakFallback(text: string, rate: number, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve();
    const volume = getTtsAudioVolume(lang);
    if (volume <= 0) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.volume = volume;
    const finish = () => {
      if (currentUtterance === u) {
        currentUtterance = null;
        currentUtteranceResolve = null;
        currentPlaybackLang = null;
      }
      resolve();
    };
    currentUtterance = u;
    currentUtteranceResolve = finish;
    currentPlaybackLang = lang;
    u.onstart = () => {
      emitAudioLevel(0, false);
      emitSpeaking(true);
    };
    u.onend = finish;
    u.onerror = finish;
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

function playUrl(url: string, token: number, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (token !== playSeq) return resolve();
    const volume = getTtsAudioVolume(lang);
    if (volume <= 0) return resolve();
    const audio = new Audio(url);
    audio.volume = volume;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (currentAudio === audio) {
        stopAudioAnalysis();
        currentAudio = null;
        currentAudioUrl = null;
        currentPlaybackLang = null;
        trimUrlCache();
      }
      if (currentAudioResolve === finish) currentAudioResolve = null;
      resolve();
    };
    currentAudio = audio;
    currentAudioUrl = url;
    currentAudioResolve = finish;
    currentPlaybackLang = lang;
    audio.onended = finish;
    audio.onerror = finish;
    void (async () => {
      const analyser = await attachAudioAnalysis(audio, token);
      if (token !== playSeq || currentAudio !== audio) return finish();
      audio.onplaying = () => {
        if (token !== playSeq || currentAudio !== audio) return;
        emitSpeaking(true);
        if (analyser && currentAudioAnalyser === analyser) {
          startAudioAnalysis(audio, analyser, token);
        } else {
          emitAudioLevel(0, false);
        }
      };
      audio.play().catch(finish);
    })();
  });
}

async function playOne(item: SeqItem, token: number, signal?: AbortSignal): Promise<void> {
  const { lang } = item;
  const text = firstSpokenAlternative(item.text);
  const rate = item.rate ?? DEFAULT_RATE;
  if (!text || getTtsAudioVolume(lang) <= 0) return;
  try {
    const url = await getAudioUrl(text, rate, lang, signal);
    if (token !== playSeq || getTtsAudioVolume(lang) <= 0) return;
    await playUrl(url, token, lang);
  } catch {
    if (token !== playSeq || getTtsAudioVolume(lang) <= 0) return;
    await speakFallback(text, rate, lang);
  }
}

/** Speak a single phrase. Interrupts whatever is currently playing. No-op while muted. */
export function tts(text: string, rate = DEFAULT_RATE, lang = "de-DE"): Promise<void> {
  if (getTtsAudioVolume(lang) <= 0) return Promise.resolve();
  hardStop();
  const token = ++playSeq;
  const fetchController = new AbortController();
  currentFetchController = fetchController;
  return playOne({ text, rate, lang }, token, fetchController.signal).finally(() => {
    if (token === playSeq) {
      currentFetchController = null;
      emitAudioLevel(0, false);
      emitSpeaking(false);
    }
  });
}

/** Speak several phrases back-to-back (e.g. German then French on the Listen step). No-op while muted. */
export function ttsSequence(items: SeqItem[]): Promise<void> {
  if (!items.some((item) => getTtsAudioVolume(item.lang) > 0)) return Promise.resolve();
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
      emitAudioLevel(0, false);
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
