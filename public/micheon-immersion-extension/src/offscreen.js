/**
 * Offscreen audio player. ONE voice, on purpose: the Micheon desktop app's
 * own TTS server -- the same premium voice the app itself uses -- reached on
 * the app's default local port. A short timeout means "app not running"
 * costs barely anything.
 *
 * There is deliberately NO fallback to the browser's built-in speech
 * synthesis. It existed so pronunciation "still worked" with the app closed,
 * but a system voice reciting German teaches a pronunciation the learner
 * cannot tell apart from the real model, and practising that is worse than
 * hearing nothing. With Micheon shut the extension stays silent and the
 * popup explains why.
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "micheon-tts-play") return undefined;
  const text = String(message.text || "").slice(0, 200);
  if (!text) return undefined;
  const requestId = ++playbackRequest;
  // Latest request wins. This stops an already-playing word and aborts an
  // older local-TTS fetch, so rapid pointer movement can never layer voices.
  stopCurrentPlayback();
  void playFromMicheon(text, requestId).then((played) => {
    // Report whether Micheon's voice actually answered, so the popup can say
    // "open Micheon" instead of leaving silence looking like a fault.
    try { sendResponse({ played }); } catch { /* channel already closed */ }
  });
  return true; // keep the channel open for the async reply
});
