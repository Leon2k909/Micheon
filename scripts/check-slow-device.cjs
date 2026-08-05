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

if (failures) {
  console.error(`\n${failures} slow-device regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nweak hardware gets a calm default and a library that opens without stalling");
