// Two promises to the person on an old laptop.
//
//  1. Effects start off on a slow machine. The glows and continuous animations
//     are pleasant on a desktop and miserable on weak hardware, and that is
//     exactly the person least likely to go looking for the switch.
//  2. The vocabulary library does not hold the main thread while it opens.
//     Preparing it measured 734 ms on a fast desktop — roughly 2.5 s on a slow
//     laptop — and 553 ms of that was building search text for all 16k items
//     that nobody needs until they type a query.
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const effectsSource = read("src/lib/effects.ts");
const mainSource = read("src/main.tsx");
const gamification = read("src/Gamification.tsx");
const tracker = read("src/components/lab/VocabTracker.tsx");
const wordsTracker = read("src/components/lab/WordsTracker.tsx");
const appStyles = read("src/index.css");
const voice = read("src/lib/voice.ts");
const guided = read("src/GuidedSession.tsx");
const electronMainSource = read("electron/main.js");
const petLayer = read("src/components/codexPets/CodexPetLayer.tsx");
const petSprite = read("src/components/codexPets/CodexPetSprite.tsx");
const preloadSource = read("electron/preload.cjs");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── the effects default actually looks at the device ───────────────────────
const built = esbuild.buildSync({
  stdin: {
    contents: `export { getEffects, prefersReducedEffects, applyEffects, setEffects } from "./src/lib/effects.ts";`,
    resolveDir: root,
    sourcefile: "slow-device-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const compiled = new Module("slow-device-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "slow-device-check.cjs"));
const { getEffects, prefersReducedEffects } = compiled.exports;

/** Stand in for a browser with the given device hints and stored choice. */
function withDevice({ memory, cores, saveData, reduceMotion, stored }, run) {
  const store = new Map(stored === undefined ? [] : [["gl-effects", stored]]);
  global.window = {
    matchMedia: (q) => ({ matches: Boolean(reduceMotion) && q.includes("reduced-motion") }),
    localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v) },
  };
  global.localStorage = global.window.localStorage;
  // Node 21+ ships its own read-only `navigator`, so a plain assignment is
  // silently dropped and the check would quietly read Node's real core count
  // instead of the device being simulated.
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    value: { deviceMemory: memory, hardwareConcurrency: cores, connection: { saveData } },
    configurable: true,
    writable: true,
  });
  try {
    return run();
  } finally {
    delete global.window; delete global.localStorage;
    if (previousNavigator) Object.defineProperty(globalThis, "navigator", previousNavigator);
    else delete globalThis.navigator;
  }
}

check(
  "a low-memory machine starts with effects off",
  withDevice({ memory: 4, cores: 4 }, () => getEffects()) === "lite"
);
check(
  "a capable machine keeps its effects",
  withDevice({ memory: 16, cores: 12 }, () => getEffects()) === "full"
);
check(
  "asking the OS for less motion turns them off too",
  withDevice({ memory: 16, cores: 12, reduceMotion: true }, () => prefersReducedEffects()) === true
);
check(
  "data saver turns them off",
  withDevice({ memory: 16, cores: 12, saveData: true }, () => getEffects()) === "lite"
);
check(
  "with no device hints at all, nothing is assumed",
  withDevice({}, () => prefersReducedEffects()) === false
);
// The learner's own decision has to survive, in both directions.
check(
  "choosing full on a slow machine sticks",
  withDevice({ memory: 2, cores: 2, stored: "full" }, () => getEffects()) === "full"
);
check(
  "choosing lite on a fast machine sticks",
  withDevice({ memory: 32, cores: 16, stored: "lite" }, () => getEffects()) === "lite"
);
check(
  "start-up paints the value without writing it down",
  /export function applyEffects\(mode: Effects, persist = false\)/.test(effectsSource)
    && /if \(persist && typeof window !== "undefined"\)/.test(effectsSource)
    && mainSource.includes("applyEffects(getEffects());"),
  "persisting at boot would freeze the first-launch default forever"
);
check(
  "the settings toggle persists the choice",
  gamification.includes("setEffects(next);") && !gamification.includes("applyEffects(next);")
);

// ── the library opens without a stall ──────────────────────────────────────
check(
  "search text is built per item on demand, not for all 16k up front",
  tracker.includes("const searchIndex = new Map<CatalogItem, string>();")
    && tracker.includes("const searchTextFor = (item: CatalogItem): string =>")
    && !tracker.includes("new Map(catalog.map((item) => [item, buildCatalogSearchText(item)]))")
);
check(
  "the library starts loading before the learner reaches it",
  /rootMargin: "(\d+)px 0px"/.test(gamification)
    && Number(gamification.match(/rootMargin: "(\d+)px 0px"/)[1]) >= 1000,
  gamification.match(/rootMargin: "[^"]*"/)?.[0]
);
check(
  "the profile screen still does not drag the lesson catalogue in with it",
  !/scheduleProfileIdleWork\([\s\S]{0,200}?onRequestCatalogue/.test(gamification),
  "someone opening Profile to change their name should not pay for the catalogue"
);

// ── "reduce effects" has to actually reduce work ──────────────────────────
const css = read("src/index.css");
const app = read("src/App.tsx");
const mainTsx = read("src/main.tsx");
const runtime = read("src/lib/runtimePerformance.ts");

check(
  "lite mode drops the three things that genuinely cost a weak GPU frames",
  /\[data-fx="lite"\][\s\S]{0,400}?backdrop-filter: none !important;/.test(css)
    && /\[data-fx="lite"\][\s\S]{0,400}?animation: none !important;/.test(css)
    && /\[data-fx="lite"\][\s\S]{0,900}?box-shadow: 0 1px 2px/.test(css),
  "it used to hide two decorations and leave every blur and animation running"
);
check(
  "all of framer-motion is gated in one place, not per file",
  app.includes("<MotionConfig reducedMotion={effects === \"lite\" ? \"always\" : \"user\"}>")
    && mainTsx.includes("<MotionGate>"),
  "only 5 of 29 animating files ever checked the setting themselves"
);
check(
  "the motion gate follows a change without a reload",
  app.includes("EFFECTS_CHANGE_EVENT") && effectsSource.includes("export const EFFECTS_CHANGE_EVENT")
);

// ── adapting to a machine that is busy right now ──────────────────────────
check(
  "frame pacing is sampled at start-up",
  mainTsx.includes("watchRuntimePerformance()") && runtime.includes("requestAnimationFrame")
);
check(
  "a struggling machine is judged on dropped frames, not guesses",
  runtime.includes("export function readsAsStruggling")
    && /frames < 40\) return false;/.test(runtime),
  "too small a sample must never trigger it"
);
check(
  "the watcher never overrides a choice, and never re-enables",
  runtime.includes("if (hasEffectsChoice() || getEffects() === \"lite\") return () => {};")
    && runtime.includes('applyEffects("lite");')
    && !runtime.includes('applyEffects("full")')
);
check(
  "what it decides is not written to storage",
  !/applyEffects\("lite", true\)/.test(runtime) && !runtime.includes("setEffects("),
  "a machine that is only busy today should be back to normal tomorrow"
);

// Both trackers keep every matching row mounted, because the filters, the
// search, select-all and the counts are promises about the whole catalogue —
// Leon: "i want all the data available". Sixteen thousand rows is only
// survivable if the browser skips the ones nobody can see, and if grading one
// item does not re-render all of them. Measured on this machine: 4,000 rows of
// comparable markup took 566 ms to lay out without content-visibility and
// 35 ms with it.
check(
  "tracker rows opt out of layout and paint while off-screen",
  /\.tracker-row \{[^}]*content-visibility: auto/s.test(appStyles)
);
check(
  "...with an intrinsic size, so the scrollbar is not a lie",
  /\.tracker-row \{[^}]*contain-intrinsic-size:/s.test(appStyles)
);
check(
  "both trackers actually carry the class",
  tracker.includes('className="tracker-row') && wordsTracker.includes('className="tracker-row')
);
check(
  "the sentence tracker row is memoised, so grading one item re-renders one row",
  /const TrackerRow = React\.memo\(/.test(tracker)
);
check(
  "...compared on the record's VALUE, since the store hands back new objects each save",
  tracker.includes("a.recordSignature === b.recordSignature")
);
check(
  "...and its callbacks are stable, or that comparison never holds",
  /const apply = React\.useCallback\(/.test(tracker)
    && /const toggleSelect = React\.useCallback\(/.test(tracker)
    && /const applyStrength = React\.useCallback\(/.test(tracker)
    && /const applyPermanent = React\.useCallback\(/.test(tracker)
);

// A running AudioContext is the most expensive thing an idle Electron app can
// hold. Its thread wakes hundreds of times a second with nothing connected, it
// keeps the audio service process alive, and it makes Chromium treat the page
// as playing audio — which exempts the WHOLE renderer from background
// throttling. Measured before this: 5.8% of a core and 279 MB with the window
// minimised, i.e. the app took the same from the machine whether or not anyone
// was looking at it. Both contexts must go back to sleep between sounds.
check(
  "the voice context is suspended once playback has been over for a moment",
  /function scheduleAudioIdleSuspend\(\)/.test(voice)
    && /context\.suspend\(\)/.test(voice)
    && voice.includes("scheduleAudioIdleSuspend();")
);
check(
  "...and every path that plays something wakes it first",
  /function getSharedAudioContext\(\): AudioContext \| null \{\s*cancelAudioIdleSuspend\(\);/.test(voice)
);
check(
  "the sound-effect context sleeps between dings too",
  /function scheduleSfxIdleSuspend\(\)/.test(guided)
    && /_audioCtx\.suspend\(\)/.test(guided)
    && guided.includes("scheduleSfxIdleSuspend();")
);
check(
  "...and a new tone cancels the pending sleep rather than racing it",
  guided.includes("if (sfxIdleTimer !== null) { clearTimeout(sfxIdleTimer); sfxIdleTimer = null; }")
);

// The mascot overlay defaults to the desktop band, not the screen-saver band.
// Games mode asks Windows to keep the overlay above fullscreen games, which
// stops a game handing its frames straight to the display — felt as input lag.
// It stays available; it is just no longer what you get without choosing.
check(
  "the mascot does not default to overlaying fullscreen games",
  read("src/lib/petDisplayMode.ts").includes('DEFAULT_PET_DISPLAY_MODE: PetDisplayMode = "desktop"')
    && read("electron/main.js").includes('let petDisplayMode = "desktop";')
);
check(
  "...and the games option says what it costs",
  read("src/components/codexPets/CodexPetLayer.tsx").includes("This can add input lag to the game.")
);

// The mascot overlay is a topmost LAYERED window, and Windows will not hand a
// fullscreen game the screen to itself while one of those is up: the game's
// frames go through the desktop compositor and the player pays a frame of
// latency for a mascot hidden behind CS2. Confirmed on Leon's machine by
// enumerating the app's windows — vis=True TOPMOST=True layered=True.
//
// Windows cannot be asked "is a fullscreen game running?" from Electron
// without a native module, so the answer is a switch, and it has to be a
// GLOBAL one or it cannot be reached from inside the game.
check(
  "the mascot can be put away with a global shortcut",
  /const PET_SUSPEND_SHORTCUT = "CommandOrControl\+Alt\+P";/.test(electronMainSource)
    && /globalShortcut\.register\(PET_SUSPEND_SHORTCUT/.test(electronMainSource)
);
check(
  "...registered at startup, not only once a pet is shown",
  /await createWindow\(\);[\s\S]{0,200}registerPetSuspendShortcut\(\);/.test(electronMainSource)
);
check(
  "suspending outranks whatever the app last asked for",
  /const visible = petOverlayWantedVisible && !petOverlaySuspended;/.test(electronMainSource)
);
check(
  "...and the suspension is not persisted, so a pet cannot go missing for ever",
  !/petOverlaySuspended[\s\S]{0,120}(localStorage|writeDesktopSettings|setDesktopSettings)/.test(electronMainSource)
);
check(
  "the shortcut is discoverable where the display mode is chosen",
  petLayer.includes("from anywhere to put the mascot away")
);

// Typing in the tracker's search box re-filtered all 16,308 items on every
// keystroke, and the first keystroke also built the search text for every one
// of them — so "test" did that work four times and the box itself stuttered
// while it happened. Leon: "the app is also a bit laggy when i use the search".
check(
  "the search box types at full speed while the filter runs behind it",
  /const filterQuery = React\.useDeferredValue\(query\);/.test(tracker)
    && /normalizeCatalogSearchText\(filterQuery\)/.test(tracker)
);
check(
  "...and the index is warmed on focus, not on the first letter typed",
  /onFocus=\{\(\) => \{[\s\S]{0,400}searchTextFor\(item\)/.test(tracker)
);

// The mascot is meant to stay ON SCREEN over a game — Leon asked for that
// explicitly — but a repainting overlay makes the compositor redraw the screen
// over the top of whatever is under it. Holding the frame while another app is
// in front keeps the pet visible and stops it costing anything to sit there.
check(
  "the mascot holds its frame while another app is in front",
  /function useAppFocused\(\): boolean/.test(petSprite)
    && /const shouldRun = \(\) => !document\.hidden && appFocused;/.test(petSprite)
);
check(
  "...told so by the main process, which is the only side that knows",
  /function broadcastPetAppFocus\(focused\)/.test(electronMainSource)
    && /app\.on\("browser-window-focus"/.test(electronMainSource)
    && /app\.on\("browser-window-blur"/.test(electronMainSource)
);
check(
  "...over a bridge the overlay renderer can actually reach",
  /onPetAppFocusChange:/.test(preloadSource)
);
check(
  "a freshly created overlay is told the current focus, not left animating",
  /overlay\.webContents\.once\("did-finish-load"[\s\S]{0,220}pet-overlay:app-focused/.test(electronMainSource)
);

if (failures) {
  console.error(`\n${failures} slow-device regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nweak hardware gets a calm default and a library that opens without stalling");
