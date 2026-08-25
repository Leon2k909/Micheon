// Profile & settings organisation + main-window zoom.
//
// Two promises are guarded here. First: the rarely-used settings live behind
// collapsed categories whose children are not mounted until first opened, so
// the profile screen stays fast and tidy. Second: zoom is a real feature —
// Ctrl+= zooms in (the historic bug: only Ctrl+- worked), every zoom path
// walks one fixed ladder, the value survives restarts, and the mascot
// windows (same origin, silently re-zoomed by Chromium's per-origin map) are
// pinned straight back after every change.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const main = read("electron/main.js");
const preload = read("electron/preload.cjs");
const gamification = read("src/Gamification.tsx");
const category = read("src/components/SettingsCategory.tsx");
const zoomControl = read("src/components/AppZoomControl.tsx");
const i18n = read("src/lib/i18n.ts");
const zoomSteps = require(path.join(root, "electron/zoom-steps.cjs"));
const settingsStore = require(path.join(root, "electron/desktop-settings.cjs"));

const profileStart = gamification.indexOf("if (profileOnly)");
const profileEnd = gamification.indexOf("\n  return (", profileStart);
const profile = gamification.slice(profileStart, profileEnd);
// The other standalone render of the same component: the progress screen, which
// holds mastery, totals, the vocabulary tracker and the milestones. All four
// used to be the tail of the settings page, below the last actual setting.
const progressStart = gamification.indexOf("if (progressOnly)");
const progress = progressStart >= 0 ? gamification.slice(progressStart, profileStart) : "";

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

// ── The zoom ladder is sane ────────────────────────────────────────────────
check("a garbage zoom factor falls back to 100%", zoomSteps.clampZoomFactor("nonsense") === 1);
check("zoom factors clamp to the ladder's range", zoomSteps.clampZoomFactor(9) === 2 && zoomSteps.clampZoomFactor(0.1) === 0.5);
check("zooming in from 100% lands on the next rung", zoomSteps.nextZoomStep(1, 1) === 1.1);
check("zooming out from 100% lands on the previous rung", zoomSteps.nextZoomStep(1, -1) === 0.9);
check(
  "a legacy fractional level snaps back onto the ladder in one step",
  zoomSteps.nextZoomStep(0.76, 1) === 0.8 && zoomSteps.nextZoomStep(0.76, -1) === 0.75
);
check("the ladder has hard ends", zoomSteps.nextZoomStep(2, 1) === 2 && zoomSteps.nextZoomStep(0.5, -1) === 0.5);
check(
  "the saved zoom factor is normalised like every other desktop setting",
  settingsStore.normalizeDesktopSettings({ zoomFactor: 9 }).zoomFactor === 2
    && settingsStore.normalizeDesktopSettings({}).zoomFactor === 1
    && settingsStore.DEFAULT_DESKTOP_SETTINGS.zoomFactor === 1
);

// ── Every zoom path goes through one gatekeeper ────────────────────────────
const applyStart = main.indexOf("function applyMainZoom");
const applyEnd = main.indexOf("function currentMainZoom", applyStart);
const applyBody = applyStart >= 0 && applyEnd > applyStart ? main.slice(applyStart, applyEnd) : "";
check(
  "applyMainZoom clamps, persists, broadcasts, and re-pins both mascot windows",
  applyBody.includes("clampZoomFactor(factor)")
    && applyBody.includes("pinPetOverlayZoom(petWindow?.webContents)")
    && applyBody.includes("pinPetOverlayZoom(petHistoryWindow?.webContents)")
    && applyBody.includes("saveDesktopSettings({ zoomFactor: next })")
    && applyBody.includes('send("zoom:changed", next)')
);
check(
  "Ctrl+= zooms in without needing Shift, and Ctrl+- still zooms out",
  main.includes('input.key === "=" || input.key === "+"')
    && main.includes('input.key === "-" || input.key === "_"')
    && main.includes('before-input-event')
);
check(
  "Ctrl+0 resets and the handled keys never double-fire the default menu",
  main.includes('input.key === "0" && !input.shift')
    && (main.match(/event\.preventDefault\(\);\s*\n\s*(stepMainZoom|applyMainZoom)/g) ?? []).length >= 3
);
check(
  "Ctrl+wheel walks the same ladder instead of writing fractional levels",
  main.includes('stepMainZoom(zoomDirection === "in" ? 1 : -1)')
);
check(
  "the saved zoom is restored (and stray levels repaired) at startup",
  main.includes("applyMainZoom(getDesktopSettings().zoomFactor)")
);
check(
  "partial desktop-setting saves merge instead of resetting other keys",
  main.includes("{ ...getDesktopSettings(), ...value }")
);
check(
  "the zoom IPC surface rejects other windows",
  ["zoom:get", "zoom:set", "zoom:step"].every((channel) => main.includes(`"${channel}"`))
    && (main.match(/Untrusted zoom request/g) ?? []).length === 3
);
check(
  "the preload bridge exposes the full zoom API",
  ["getZoomFactor", "setZoomFactor", "stepZoom", "onZoomChanged"].every((name) => preload.includes(name))
);

// ── The settings screen stays organised and lazy ───────────────────────────
check(
  "collapsed categories do not mount their children until first opened",
  category.includes("const [everOpened, setEverOpened] = useState(defaultOpen)")
    && category.includes("{(everOpened || forceOpen) && (")
    && category.includes("hidden={!isOpen}")
);
check(
  "categories are accessible disclosures",
  category.includes("aria-expanded={isOpen}") && category.includes("aria-controls={panelId}")
);
// Search opens a category without overwriting the learner's own collapsed
// state, so clearing the search puts everything back as they left it.
check(
  "search can open a category without changing what the learner collapsed",
  category.includes("const isOpen = open || forceOpen;") && category.includes("if (hidden) return null;")
);
// Counted by the SETTINGS they contain, not by uses of the component: the same
// collapsible now also holds Milestones, which is not a setting. Pinning the
// raw count meant adding a collapsible anywhere on the page broke this.
const settingsCategoryTitles = [
  "Appearance", "Accessibility", "Desktop app & updates",
  "Learning options", "Language & voice", "Pet & mascot",
  "Data & storage",
];
check(
  "the profile screen groups the rarely-used settings into categories",
  settingsCategoryTitles.filter((t) => profile.includes('title={ui("' + t + '")}')).length === settingsCategoryTitles.length
    && !profile.includes("defaultOpen")
);
// Milestones is worth having and not worth the top of the screen, so it uses
// the same collapsible and starts closed like everything else here — on the
// progress screen now, beside the rest of what "Your progress" promises.
check(
  "milestones are collapsed rather than filling the screen",
  progress.includes('title={ui("Milestones")}')
    && !/<h2[^>]*>\{ui\("Milestones"\)\}/.test(progress)
    && !profile.includes('title={ui("Milestones")}')
);
check(
  "progress holds mastery, totals and the vocabulary tracker, and settings does not",
  ['title={ui("Your progress")}', 'title={ui("Totals")}', 'title={ui("Vocabulary library")}']
    .every((marker) => progress.includes(marker) && !profile.includes(marker))
);
check(
  "appearance, accessibility, desktop, learning, language, and pet all have a category",
  ['title={ui("Appearance")}', 'title={ui("Accessibility")}', 'title={ui("Desktop app & updates")}',
    'title={ui("Learning options")}', 'title={ui("Language & voice")}',
    'title={ui("Pet & mascot")}']
    .every((marker) => profile.includes(marker))
);
// Flashcards is not a category any more. Two controls stood at the rank of
// Appearance and Data & storage while answering the question the learning
// options already ask, so they moved in there - which only helps if they
// really are inside that category rather than loose on the page below it.
const learningBlock = /title=\{ui\("Learning options"\)\}[\s\S]*?<\/SettingsCategory>/.exec(profile);
check(
  "the flashcard picker sits inside Learning options, not in a category of its own",
  !profile.includes('title={ui("Flashcards")}')
    && !!learningBlock && learningBlock[0].includes("<FlashcardModePicker")
);
check(
  "the pet picker only loads once its category is opened",
  /<SettingsCategory\r?\n[^<]*?description=\{ui\("Pick a desk pet[\s\S]*?<Suspense[\s\S]*?<CodexPetPicker/.test(profile)
);
check(
  "the zoom control lives in the Appearance category",
  profile.indexOf('title={ui("Appearance")}') < profile.indexOf("<AppZoomControl />")
    && profile.indexOf("<AppZoomControl />") < profile.indexOf('title={ui("Desktop app & updates")}')
);
check(
  "the zoom control hides in the browser, where the browser's own zoom rules",
  zoomControl.includes("api?.getZoomFactor ? api : undefined")
    && zoomControl.includes("if (factor === null) return null;")
);
check(
  "the zoom control is a labelled group with reachable buttons and a reset",
  zoomControl.includes('aria-label={ui("Zoom in")}')
    && zoomControl.includes('aria-label={ui("Zoom out")}')
    && zoomControl.includes('ui("Reset to 100%")')
    && zoomControl.includes('role="group"')
);
check(
  "the new settings strings are translated for German-first learners",
  ['"App zoom":', '"Desktop app & updates":', '"Learning options":', '"Language & voice":',
    '"Pet & mascot":', '"More settings":', '"Zoom in":', '"Zoom out":', '"Show":',
    '"Accessibility":', '"High contrast":']
    .every((key) => i18n.includes(key))
);

// ── Accessibility: legible by default, stronger on demand ──────────────────
const npCss = read("src/prototype/new-ui-prototype.css");
const appCss = read("src/index.css");
const highContrastLib = read("src/lib/highContrast.ts");
const mainTsx = read("src/main.tsx");
check(
  "the washed-out light palette is gone from the dashboard and settings",
  !npCss.includes("--text-3: #7f7972;") && !npCss.includes("--text-2: #5f5a55;")
    && !appCss.includes("--text-3: #7f7972;")
);
check(
  "high contrast overrides exist for light and dark, dashboard and lesson",
  npCss.includes('html[data-contrast="high"] .new-ui-prototype')
    && npCss.includes('html[data-theme="dark"][data-contrast="high"] .new-ui-prototype')
    && appCss.includes('html[data-contrast="high"] .guided-session.fs-app.prototype-guided-session')
);
check(
  "the high-contrast preference applies as a root attribute and persists",
  highContrastLib.includes('setAttribute("data-contrast", "high")')
    && highContrastLib.includes('removeAttribute("data-contrast")')
    && highContrastLib.includes("localStorage.setItem(KEY")
);
check(
  "the stored contrast preference paints at boot like theme and effects",
  mainTsx.includes("applyHighContrast(getHighContrast())")
);
check(
  "the Accessibility category offers contrast, motion, and speech controls",
  profile.includes('title={ui("Accessibility")}')
    && profile.indexOf('ui("High contrast")') > profile.indexOf('title={ui("Accessibility")}')
    && profile.indexOf('ui("Reduce effects")') > profile.indexOf('title={ui("Accessibility")}')
    && profile.indexOf('testId="accessibility-speech-speed"') > profile.indexOf('title={ui("Accessibility")}')
    && profile.includes("<SpeechSpeedControl")
    && profile.includes("aria-pressed={highContrast}")
);

if (failures) {
  console.error(`\n${failures} profile organisation regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nprofile organisation and app zoom are guarded");
