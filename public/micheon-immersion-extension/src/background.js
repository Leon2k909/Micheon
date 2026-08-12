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

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get("settings");
  if (!existing.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
});

async function ensureOffscreen() {
  if (chrome.offscreen && !(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: "src/offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Plays the German pronunciation of a hovered word",
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "micheon-tts") return undefined;
  void (async () => {
    try {
      await ensureOffscreen();
      await chrome.runtime.sendMessage({ type: "micheon-tts-play", text: message.text });
    } catch {
      // No offscreen support or no audio path -- pronunciation is a nicety,
      // never worth an error surface.
    }
  })();
  return undefined;
});
