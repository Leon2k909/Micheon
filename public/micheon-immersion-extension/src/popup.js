const DEFAULT_SETTINGS = {
  glossEnabled: true,
  collectMissingVocab: true,
  ttsOnHover: true,
  ttsOnClick: true,
  youtubeAutoDub: true,
  hoverDelayMs: 200,
};

const checkboxIds = ["glossEnabled", "collectMissingVocab", "ttsOnHover", "ttsOnClick", "youtubeAutoDub"];
/**
 * Settings that are not a yes or a no.
 *
 * Kept as their own list because saveSettings rebuilds the whole object from
 * what the panel shows: a setting missing from these lists is not saved as
 * false, it is dropped entirely, and the next open reads the default back over
 * whatever was chosen.
 */
const choiceIds = ["hoverDelayMs"];

function examplesForEntry(entry) {
  return [...new Set([
    ...(Array.isArray(entry?.examples) ? entry.examples : []),
    entry?.example,
  ].map((value) => String(value || "").trim()).filter(Boolean))];
}

async function reconcileCurrentCatalogue() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !/^https?:/.test(tab.url || "")) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "micheon-reconcile-missing-vocab" });
  } catch {
    // The tab may predate this extension version. Its next reload performs
    // the same reconciliation before collecting anything new.
  }
}

async function loadState() {
  await reconcileCurrentCatalogue();
  const { settings, missingVocab, missingEnglish } = await chrome.storage.local
    .get(["settings", "missingVocab", "missingEnglish"]);
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  for (const id of checkboxIds) {
    document.getElementById(id).checked = Boolean(merged[id]);
  }
  for (const id of choiceIds) {
    document.getElementById(id).value = String(merged[id]);
  }
  const entries = Object.values(missingVocab || {});
  document.getElementById("missingCount").textContent = entries.length;
  // Words and sentences are different numbers: many words share one
  // sentence, so counting "entries with an example" just repeated the word
  // count and read as a bug.
  document.getElementById("sentenceCount").textContent = new Set(entries.flatMap(examplesForEntry)).size;
  document.getElementById("englishCount").textContent = Object.keys(missingEnglish || {}).length;
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
  for (const id of choiceIds) {
    settings[id] = Number(document.getElementById(id).value) || 0;
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

function rank(store, lang) {
  return Object.entries(store)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([word, entry]) => {
      const examples = examplesForEntry(entry);
      return { word, lang, count: entry.count, example: examples[0] || "", examples };
    });
}

async function exportList() {
  await reconcileCurrentCatalogue();
  const { missingVocab = {}, missingEnglish = {} } = await chrome.storage.local
    .get(["missingVocab", "missingEnglish"]);
  // Two lists in one file, each labelled. German is a word the course does
  // not teach; English is a word the reader met and the course cannot say --
  // the same gap seen from the other side, and useless if the two are mixed.
  const ranked = [...rank(missingVocab, "de"), ...rank(missingEnglish, "en")];
  download(`micheon-missing-vocab-${new Date().toISOString().slice(0, 10)}.json`, ranked);
}

async function clearList() {
  await chrome.storage.local.remove(["missingVocab", "missingEnglish"]);
  document.getElementById("missingCount").textContent = "0";
  document.getElementById("sentenceCount").textContent = "0";
  document.getElementById("englishCount").textContent = "0";
}

for (const id of [...checkboxIds, ...choiceIds]) {
  document.getElementById(id).addEventListener("change", saveSettings);
}
document.getElementById("exportBtn").addEventListener("click", exportList);
document.getElementById("clearBtn").addEventListener("click", clearList);

// Which build is ACTUALLY loaded -- the folder on disk can be newer than
// what the browser is running until its reload arrow is pressed.
document.getElementById("extVersion").textContent = `v${chrome.runtime.getManifest().version}`;

// Pronunciation comes from Micheon's own voice and nothing else -- there is
// no browser-voice fallback, by design. With the app closed the extension is
// deliberately silent, so say that rather than let the silence read as a
// broken feature.
async function loadVoiceStatus() {
  const el = document.getElementById("voiceStatus");
  const { settings } = await chrome.storage.local.get("settings");
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  if (!merged.ttsOnHover && !merged.ttsOnClick) {
    el.hidden = true;
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);
  let running = false;
  try {
    const res = await fetch("http://127.0.0.1:41730/api/health", { signal: controller.signal });
    running = res.ok;
  } catch {
    running = false;
  } finally {
    clearTimeout(timer);
  }
  el.hidden = running;
  if (!running) {
    el.textContent = "Micheon isn't running, so words stay silent — its own voice is the only one used, never the browser's robotic one. Open Micheon to hear pronunciation.";
  }
}

loadState();
loadPageStatus();
loadVoiceStatus();

/**
 * Panel size.
 *
 * A browser will not let an extension resize its own popup by dragging, and
 * 300px is tight once the panel carries more than a few toggles. So the width
 * is a stored setting with three steps — and it is remembered, because being
 * asked to pick it on every open would be worse than the fixed size it
 * replaces.
 */
const PANEL_WIDTHS = { s: 300, m: 380, l: 460 };
const sizeButtons = [...document.querySelectorAll(".sizer button")];

function applyPanelSize(size) {
  const width = PANEL_WIDTHS[size] ?? PANEL_WIDTHS.s;
  document.body.style.setProperty("--panel-width", `${width}px`);
  for (const button of sizeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.size === size));
  }
}

chrome.storage.local.get("panelSize").then(({ panelSize }) => {
  applyPanelSize(PANEL_WIDTHS[panelSize] ? panelSize : "s");
});

for (const button of sizeButtons) {
  button.addEventListener("click", () => {
    const size = button.dataset.size;
    applyPanelSize(size);
    void chrome.storage.local.set({ panelSize: size });
  });
}
