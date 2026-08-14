// Service worker: seeds default settings on install, and owns the one piece
// of audio plumbing MV3 requires -- a service worker can't play sound, so
// pronunciation requests are forwarded to an offscreen document that can.
const DEFAULT_SETTINGS = {
  glossEnabled: true,
  collectMissingVocab: true,
  ttsOnHover: true,
  ttsOnClick: true,
  youtubeAutoDub: true,
};
let latestTtsRequest = 0;
let lastForwardedText = "";
let lastForwardedAt = 0;
let offscreenCreation = null;
const MICHEON_LISTEN_STATE = "http://127.0.0.1:41730/api/listen-state";
let listenPlayingUntil = 0;   // cheap cache: re-ask at most every second
let listenPlayingCached = false;
let lastPlaybackOk = null;
let lastPlaybackAt = 0;

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get("settings");
  if (!existing.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
});

async function ensureOffscreen() {
  if (!chrome.offscreen || await chrome.offscreen.hasDocument()) return;
  // Several content frames can ask for pronunciation before the first
  // offscreen document finishes opening. Share that creation promise so we
  // never race createDocument() and forward the same hover more than once.
  if (!offscreenCreation) {
    offscreenCreation = chrome.offscreen.createDocument({
      url: "src/offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Plays the German pronunciation of a hovered word",
    }).finally(() => { offscreenCreation = null; });
  }
  await offscreenCreation;
}

// Is the desktop app reading aloud right now? Hovering a word while Listen
// is speaking would put two German voices on top of each other, so the
// extension's own hover pronunciation defers to the app. Clicking a word is
// an explicit request and always plays.
async function listenModeIsSpeaking() {
  const now = Date.now();
  if (now < listenPlayingUntil) return listenPlayingCached;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 400);
  try {
    const res = await fetch(MICHEON_LISTEN_STATE, { signal: controller.signal });
    listenPlayingCached = res.ok ? (await res.json())?.playing === true : false;
  } catch {
    listenPlayingCached = false; // app closed or too old to answer: nothing to clash with
  } finally {
    clearTimeout(timer);
  }
  listenPlayingUntil = Date.now() + 1000;
  return listenPlayingCached;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "micheon-tts-status") {
    sendResponse({ lastPlaybackOk, lastPlaybackAt });
    return undefined;
  }
  if (message?.type !== "micheon-tts") return undefined;
  const text = String(message.text || "").replace(/\s+/g, " ").trim().slice(0, 200);
  if (!text) return undefined;
  const now = Date.now();
  // Content scripts can exist in more than one frame, and reactive pages
  // occasionally render the same visible label twice. Keep this second
  // guard at the central audio boundary so those identical hover requests
  // still become one pronunciation even if they came from different frames.
  if (text === lastForwardedText && now - lastForwardedAt < 1200) return undefined;
  lastForwardedText = text;
  lastForwardedAt = now;
  const requestId = ++latestTtsRequest;
  const reason = message.reason === "click" ? "click" : "hover";
  void (async () => {
    try {
      if (reason === "hover" && await listenModeIsSpeaking()) return;
      await ensureOffscreen();
      // The pointer may have reached another word while the hidden audio
      // page was being created. Only the newest pronunciation is useful.
      if (requestId !== latestTtsRequest) return;
      const reply = await chrome.runtime.sendMessage({ type: "micheon-tts-play", text });
      // Micheon's voice or nothing: record which it was, for the popup.
      lastPlaybackOk = reply?.played === true;
      lastPlaybackAt = Date.now();
    } catch {
      // No offscreen support or no audio path -- pronunciation is a nicety,
      // never worth an error surface.
    }
  })();
  return undefined;
});
