const DEFAULT_SETTINGS = {
  glossEnabled: true,
  collectMissingVocab: true,
  ttsOnHover: true,
  ttsOnClick: true,
  youtubeAutoDub: true,
};

const checkboxIds = ["glossEnabled", "collectMissingVocab", "ttsOnHover", "ttsOnClick", "youtubeAutoDub"];

async function loadState() {
  const { settings, missingVocab } = await chrome.storage.local.get(["settings", "missingVocab"]);
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  for (const id of checkboxIds) {
    document.getElementById(id).checked = Boolean(merged[id]);
  }
  const entries = Object.values(missingVocab || {});
  document.getElementById("missingCount").textContent = entries.length;
  // Words and sentences are different numbers: many words share one
  // sentence, so counting "entries with an example" just repeated the word
  // count and read as a bug.
  document.getElementById("sentenceCount").textContent = new Set(entries.map((e) => e?.example).filter(Boolean)).size;
}

// A bare "0" reads as "broken". Say what this extension is actually doing
// (or deliberately not doing) on the tab that's open right now.
async function loadPageStatus() {
  const el = document.getElementById("pageStatus");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || "";

  if (!/^https?:/.test(url)) {
    el.textContent = "Browsers don't let extensions run on this page (browser-internal pages and the web store).";
    return;
  }

  let status = null;
  try {
    status = await chrome.tabs.sendMessage(tab.id, { type: "micheon-page-status" });
  } catch {
    // No content script in the tab -- page predates the extension install
    // or reload, or the site is excluded.
  }

  if (!status?.ok) {
    el.textContent = "Not active on this tab yet — reload the page to start.";
    return;
  }

  if (status.youtube) {
    if (!status.watchPage) {
      el.textContent = "YouTube: open a video — words are read from its title, description and German comments, and German dubs switch automatically.";
    } else if (status.german) {
      el.textContent = `Reading the German on this video — ${status.glossed} known ${status.glossed === 1 ? "word" : "words"} highlighted in the title, description and German comments.`;
    } else {
      el.textContent = "No German found on this video yet — comments are checked as they load. Dub and caption switching still runs.";
    }
    return;
  }

  if (status.german) {
    el.textContent = `This page reads as German — ${status.glossed} known ${status.glossed === 1 ? "word" : "words"} highlighted, new words collected with their sentence.`;
  } else {
    el.textContent = `This page reads as English — ${status.glossed} ${status.glossed === 1 ? "word" : "words"} you're learning highlighted. German words are only collected from German text.`;
  }
}

async function saveSettings() {
  const settings = {};
  for (const id of checkboxIds) {
    settings[id] = document.getElementById(id).checked;
  }
  await chrome.storage.local.set({ settings });
}

function download(filename, dataObj) {
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportList() {
  const { missingVocab = {} } = await chrome.storage.local.get("missingVocab");
  const ranked = Object.entries(missingVocab)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([word, { count, example }]) => ({ word, count, example }));
  download(`micheon-missing-vocab-${new Date().toISOString().slice(0, 10)}.json`, ranked);
}

async function clearList() {
  await chrome.storage.local.remove("missingVocab");
  document.getElementById("missingCount").textContent = "0";
  document.getElementById("sentenceCount").textContent = "0";
}

for (const id of checkboxIds) {
  document.getElementById(id).addEventListener("change", saveSettings);
}
document.getElementById("exportBtn").addEventListener("click", exportList);
document.getElementById("clearBtn").addEventListener("click", clearList);

// Which build is ACTUALLY loaded -- the folder on disk can be newer than
// what the browser is running until its reload arrow is pressed.
document.getElementById("extVersion").textContent = `v${chrome.runtime.getManifest().version}`;

loadState();
loadPageStatus();
