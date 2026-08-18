import { reportSilencedPlayback } from "@/lib/audioPrompt";
// Front-end TTS playback.
//
// Primary path: fetch an MP3 from our /api/tts server, which generates the exact
// Microsoft neural voices using edge-tts. This sounds identical in every browser
// (Chrome, Firefox, Safari, mobile), not just Edge.
//
// There is deliberately NO fallback to the browser's built-in speechSynthesis.
// It used to stand in whenever the server was unreachable so audio "never went
// silent", but a system voice reciting German sounds nothing like the model
// being taught and the learner cannot tell which one they just heard. A failed
// clip is retried once and then passed over in silence instead.

import { AUDIO_SETTINGS_EVENT, getTtsAudioVolume, getTtsSpeechRate } from "@/lib/audioMute";
import {
  smoothSpeechLevel,
  speechLevelFromPcm,
  speechSpectrumFromFft,
} from "@/lib/audioLevel";
import { firstSpokenAlternative } from "@/lib/spokenText";
import { TTS_VOICE_EVENT, voiceForLang } from "@/lib/ttsVoice";

type SeqItem = {
  text: string;
  rate?: number;
  lang: string;
  /** Runs immediately before this clip starts, used for synced captions. */
  onStart?: () => void;
};

const DEFAULT_RATE = 0.88;

/** Each clip's own authored pace times that language's learner setting. */
function effectiveRate(rate: number, lang: string): number {
  return Math.min(2, Math.max(0.3, rate * getTtsSpeechRate(lang)));
}

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

// speakFallback was removed: the browser's system voice is never used to
// teach German here. See playOne -- a failed clip retries once, then stays
// silent rather than substitute a voice the learner cannot tell apart.
async function getAudioUrl(
  text: string,
  rate: number,
  lang: string,
  signal?: AbortSignal,
  refresh = false
): Promise<string> {
  // The chosen voice is part of the cache key, or switching voice would keep
  // replaying the old one for every sentence already heard.
  const voice = voiceForLang(lang);
  const key = `${lang}|${voice}|${rate}|${text}`;
  if (!refresh) {
    const cached = cachedAudioUrl(key);
    if (cached) return cached;
  }
  const qs = `text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&rate=${rate}`
    + (voice ? `&voice=${encodeURIComponent(voice)}` : "");
  // Without a deadline this await is unbounded: one synthesis request that
  // never comes back stalls the whole Listen sequence, which is exactly how
  // a card gets stuck after its English half has already played.
  const deadline = new AbortController();
  const timer = setTimeout(() => deadline.abort(), TTS_FETCH_TIMEOUT_MS);
  const onOuterAbort = () => deadline.abort();
  signal?.addEventListener("abort", onOuterAbort);
  let resp: Response;
  try {
    resp = await fetch(`/api/tts?${qs}`, { signal: deadline.signal });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
  if (!resp.ok) throw new Error(`tts http ${resp.status}`);
  const blob = await resp.blob();
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  // A 200 with an empty body is a failed synthesis, not audio. Caching it
  // would replay the silence forever — reject so the retry can refetch.
  if (!blob.size) throw new Error("tts empty audio body");
  return cacheAudioBlob(key, blob);
}

// Deadlines for the two awaits that used to be unbounded. Generous enough
// that a slow synthesis or a long sentence still plays in full, short enough
// that a genuinely stuck clip never freezes a hands-free Listen session.
const TTS_FETCH_TIMEOUT_MS = 9_000;
const PLAYBACK_START_TIMEOUT_MS = 6_000;
const MAX_CLIP_MS = 60_000;

/** Resolves true when the clip audibly started, false when it never played —
 *  callers use that to retry a broken clip instead of skipping it silently.
 *  Deliberate no-plays (interrupted sequence, muted channel) count as true. */
function playUrl(url: string, token: number, lang: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (token !== playSeq) return resolve(true);
    const volume = getTtsAudioVolume(lang);
    if (volume <= 0) return resolve(true);
    const audio = new Audio(url);
    audio.volume = volume;
    let finished = false;
    let started = false;
    let startGuard: ReturnType<typeof setTimeout> | undefined;
    let lengthGuard: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (startGuard) clearTimeout(startGuard);
      if (lengthGuard) clearTimeout(lengthGuard);
      // A clip that never started may still begin later (stalled decode
      // recovering after the watchdog) — silence it before the retry plays.
      if (!started) {
        try { audio.pause(); } catch { /* already unusable */ }
      }
      if (currentAudio === audio) {
        stopAudioAnalysis();
        currentAudio = null;
        currentAudioUrl = null;
        currentPlaybackLang = null;
        trimUrlCache();
      }
      if (currentAudioResolve === finish) currentAudioResolve = null;
      resolve(started);
    };
    currentAudio = audio;
    currentAudioUrl = url;
    currentAudioResolve = finish;
    currentPlaybackLang = lang;
    audio.onended = finish;
    audio.onerror = finish;
    // A media element that never fires `ended` or `error` -- stalled decode,
    // a suspended element, a blob the browser quietly gives up on -- would
    // otherwise leave this promise pending forever and freeze the sequence
    // awaiting it. Two watchdogs: one for playback that never starts, one
    // for a clip that outlives any plausible word or sentence.
    startGuard = setTimeout(() => {
      if (!started) finish();
    }, PLAYBACK_START_TIMEOUT_MS);
    lengthGuard = setTimeout(finish, MAX_CLIP_MS);
    void (async () => {
      const analyser = await attachAudioAnalysis(audio, token);
      if (token !== playSeq || currentAudio !== audio) return finish();
      audio.onplaying = () => {
        if (token !== playSeq || currentAudio !== audio) return;
        started = true;
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
  const rate = effectiveRate(item.rate ?? DEFAULT_RATE, lang);
  if (!text || getTtsAudioVolume(lang) <= 0) return;
  let announced = false;
  const announceStart = () => {
    if (announced) return;
    announced = true;
    try { item.onStart?.(); } catch { /* captions must never break audio */ }
  };
  // Micheon's own voice or nothing. The browser's system voice used to stand
  // in whenever synthesis failed, but it sounds nothing like the model being
  // taught and the learner cannot tell which one they just heard -- so a
  // failure is retried once and then passed over in silence rather than
  // teaching a pronunciation this app never chose.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (token !== playSeq || getTtsAudioVolume(lang) <= 0) return;
    try {
      // The second attempt bypasses the audio cache: if the first clip never
      // produced sound, the cached blob itself may be the broken part.
      const url = await getAudioUrl(text, rate, lang, signal, attempt > 0);
      if (token !== playSeq || getTtsAudioVolume(lang) <= 0) return;
      announceStart();
      const spoke = await playUrl(url, token, lang);
      if (spoke || token !== playSeq || signal?.aborted) return;
    } catch {
      if (signal?.aborted) return;
    }
  }
}

/** Speak a single phrase. Interrupts whatever is currently playing. No-op while muted. */
export function tts(text: string, rate = DEFAULT_RATE, lang = "de-DE"): Promise<void> {
  if (getTtsAudioVolume(lang) <= 0) {
    // Silently doing nothing looks like a broken button. Say what is off and
    // offer to turn it back on, then play what was asked for.
    reportSilencedPlayback(lang, () => { void tts(text, rate, lang); });
    return Promise.resolve();
  }
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
  if (!items.some((item) => getTtsAudioVolume(item.lang) > 0)) {
    reportSilencedPlayback(items[0]?.lang ?? "de-DE", () => { void ttsSequence(items); });
    return Promise.resolve();
  }
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
  // Same multiplier as playback so the warmed cache entry is the one used.
  getAudioUrl(spokenText, effectiveRate(rate, lang), lang).catch(() => {});
}
