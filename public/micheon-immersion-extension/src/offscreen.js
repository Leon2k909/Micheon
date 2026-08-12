/**
 * Offscreen audio player. Two voices, tried in order:
 *
 *   1. The Micheon desktop app's own TTS server (the same premium voice the
 *      app itself uses), if the app is running on this machine. The port is
 *      the app's default; a short timeout means "app not running" costs
 *      barely anything.
 *   2. The browser's built-in German speech synthesis, so pronunciation
 *      still works with the desktop app closed.
 *
 * Playing here rather than in the page keeps every website's own security
 * policy out of the picture entirely.
 */
const MICHEON_TTS = "http://127.0.0.1:41730/api/tts";

let currentUrl = null;
let currentAudio = null;
let currentFetch = null;
let playbackRequest = 0;

function stopCurrentPlayback() {
  currentFetch?.abort();
  currentFetch = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.removeAttribute("src");
    currentAudio.load();
    currentAudio = null;
  }
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
  speechSynthesis.cancel();
}

async function playFromMicheon(text, requestId) {
  const controller = new AbortController();
  currentFetch = controller;
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${MICHEON_TTS}?text=${encodeURIComponent(text)}&lang=de-DE`, {
      signal: controller.signal,
    });
    if (!res.ok) return false;
    const blob = await res.blob();
    if (requestId !== playbackRequest) return false;
    currentUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(currentUrl);
    await currentAudio.play();
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
    if (currentFetch === controller) currentFetch = null;
  }
}

function playFromBrowser(text, requestId) {
  if (requestId !== playbackRequest) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.95;
  const german = speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith("de"));
  if (german) utterance.voice = german;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "micheon-tts-play") return undefined;
  const text = String(message.text || "").slice(0, 200);
  if (!text) return undefined;
  const requestId = ++playbackRequest;
  // Latest request wins. This stops an already-playing word and aborts an
  // older local-TTS fetch, so rapid pointer movement can never layer voices.
  stopCurrentPlayback();
  void playFromMicheon(text, requestId).then((played) => {
    if (!played) playFromBrowser(text, requestId);
  });
  return undefined;
});

// Chromium loads voices asynchronously; touching the list once warms it up
// so the first real pronunciation doesn't fall back to a non-German voice.
speechSynthesis.getVoices();
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
