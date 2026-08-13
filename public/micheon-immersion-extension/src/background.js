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
  void (async () => {
    try {
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
