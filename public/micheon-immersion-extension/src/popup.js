const DEFAULT_SETTINGS = {
  glossEnabled: true,
  collectMissingVocab: true,
  youtubeAutoDub: true,
};

const checkboxIds = ["glossEnabled", "collectMissingVocab", "youtubeAutoDub"];

async function loadState() {
  const { settings, missingVocab } = await chrome.storage.local.get(["settings", "missingVocab"]);
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  for (const id of checkboxIds) {
    document.getElementById(id).checked = Boolean(merged[id]);
  }
  document.getElementById("missingCount").textContent = Object.keys(missingVocab || {}).length;
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
}

for (const id of checkboxIds) {
  document.getElementById(id).addEventListener("change", saveSettings);
}
document.getElementById("exportBtn").addEventListener("click", exportList);
document.getElementById("clearBtn").addEventListener("click", clearList);

loadState();
