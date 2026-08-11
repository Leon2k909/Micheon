// Minimal service worker: seeds default settings on install so the popup
// and content scripts never have to guess at an unset value.
const DEFAULT_SETTINGS = {
  glossEnabled: true,
  collectMissingVocab: true,
  youtubeAutoDub: true,
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get("settings");
  if (!existing.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
});
