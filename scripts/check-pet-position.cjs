/**
 * Where the pets are is a setting, and settings survive a restart.
 *
 * Position was the one pet setting that only ever reached local storage. Every
 * start restores the shared mirror over local storage before the pets render
 * (App.tsx awaits hydrateLocalStorageFromSharedStorage), so the pets came back
 * to whatever spot the mirror was holding — the one frozen there whenever the
 * profile was last transferred — instead of where they were left.
 *
 * The second half of the same promise: the app window opens at 1200x820
 * however large it was left, so the first thing that happens after a restart
 * is a clamp into a smaller window. That clamp must decide where to DRAW a
 * pet, never rewrite where it lives.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// --- a browser just real enough for the storage module -----------------------

const store = new Map();
const localStorageStub = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  key: (index) => [...store.keys()][index] ?? null,
  removeItem: (key) => void store.delete(key),
  setItem: (key, value) => void store.set(key, String(value)),
};
Object.defineProperty(localStorageStub, "length", { get: () => store.size });
const posted = [];
globalThis.window = {
  addEventListener() {},
  localStorage: localStorageStub,
  removeEventListener() {},
};
globalThis.localStorage = localStorageStub;
globalThis.fetch = async (url, options = {}) => {
  if (options.method === "POST") {
    posted.push({ items: JSON.parse(options.body).items, url });
    return { ok: true };
  }
  return { json: async () => ({ items: {} }), ok: true };
};

const result = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/petPosition.ts";
export { flushSharedStorage } from "./src/lib/profileStorage.ts";`,
    resolveDir: root,
    sourcefile: "pet-position-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("pet-position-check", module);
compiled.filename = path.join(root, ".pet-position-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  DESKTOP_PET_POSITION_KEY,
  PET_POSITION_KEY,
  flushSharedStorage,
  mirrorStoredPetPositions,
  readStoredPetPosition,
  savePetPosition,
} = compiled.exports;

// Sources are CRLF; the multi-line assertions below are written plainly.
const CR = String.fromCharCode(13);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").split(CR).join("");

async function run() {
  check(
    "the pet position keys are the ones the profile already syncs",
    PET_POSITION_KEY === "gl-codex-pet-position-v1"
      && DESKTOP_PET_POSITION_KEY === "gl-codex-pet-desktop-position-v2"
  );

  savePetPosition({ x: 1396, y: 774 }, DESKTOP_PET_POSITION_KEY);
  check(
    "a moved pet is written to local storage",
    localStorageStub.getItem(DESKTOP_PET_POSITION_KEY) === '{"x":1396,"y":774}'
  );

  await flushSharedStorage();
  const mirrored = posted.flatMap((request) => Object.entries(request.items));
  check(
    "a moved pet also reaches the shared mirror, which is what a restart reads",
    mirrored.some(([key, value]) => (
      key === DESKTOP_PET_POSITION_KEY && value === '{"x":1396,"y":774}'
    )),
    `mirror received ${JSON.stringify(mirrored)}`
  );

  // Companions are stored one key per pet. Those have to travel too, or the
  // pets arranged apart come back stacked where they used to be.
  posted.length = 0;
  savePetPosition({ x: 923, y: 254 }, `${DESKTOP_PET_POSITION_KEY}:custom:leon`);
  await flushSharedStorage();
  check(
    "a companion's own spot reaches the mirror as well",
    posted.some((request) => (
      request.items[`${DESKTOP_PET_POSITION_KEY}:custom:leon`] === '{"x":923,"y":254}'
    ))
  );

  check(
    "the stored spot is read back exactly, never pre-clamped",
    JSON.stringify(readStoredPetPosition(DESKTOP_PET_POSITION_KEY)) === '{"x":1396,"y":774}'
  );
  store.set(DESKTOP_PET_POSITION_KEY, "not json");
  check(
    "a corrupt spot reads as no spot rather than throwing",
    readStoredPetPosition(DESKTOP_PET_POSITION_KEY) === null
  );
  check(
    "an unknown key reads as no spot",
    readStoredPetPosition("gl-codex-pet-desktop-position-v2:nobody") === null
  );

  // --- the one-time lift, so the first launch after updating is right -------

  store.clear();
  posted.length = 0;
  store.set(DESKTOP_PET_POSITION_KEY, '{"x":1396,"y":774}');
  store.set(`${DESKTOP_PET_POSITION_KEY}:custom:leon`, '{"x":923,"y":254}');
  store.set("gl-codex-pet-size-v1", "140");
  await mirrorStoredPetPositions();
  const lifted = Object.assign({}, ...posted.map((request) => request.items));
  check(
    "positions this machine already has are lifted into the mirror",
    lifted[DESKTOP_PET_POSITION_KEY] === '{"x":1396,"y":774}'
      && lifted[`${DESKTOP_PET_POSITION_KEY}:custom:leon`] === '{"x":923,"y":254}'
  );
  check(
    "the lift touches positions only",
    !Object.prototype.hasOwnProperty.call(lifted, "gl-codex-pet-size-v1")
  );

  posted.length = 0;
  await mirrorStoredPetPositions();
  check(
    "the lift happens once, not on every start",
    posted.length === 0
  );

  // --- the layer keeps the clamp and the stored spot apart -------------------

  const layer = read("src/components/codexPets/CodexPetLayer.tsx");
  const positionStore = read("src/lib/petPosition.ts");

  check(
    "saving a position goes through the store that mirrors it",
    positionStore.includes("syncLocalStorageItem(storageKey, raw)")
      && layer.includes("savePetPosition(position, storageKey);")
      && !layer.includes("localStorage.setItem(storageKey, JSON.stringify(position));")
  );
  check(
    "a pet size is mirrored too, since the size decides how much room the pet needs",
    layer.includes("syncLocalStorageItem(PET_SIZES_KEY, JSON.stringify(sizes));")
  );
  check(
    "the layer keeps the spot a pet belongs in, separate from where it fits",
    layer.includes("const desiredPositionRef = useRef(storedDesiredPosition ?? position);")
      && layer.includes("() => readStoredPetPosition(PET_POSITION_STORAGE_KEY)")
  );
  check(
    "only a deliberate move writes the stored spot",
    layer.includes(`  const commitPosition = useCallback((next: PetPosition) => {
    desiredPositionRef.current = next;
    positionRef.current = next;
    setPosition(next);
    savePosition(next, PET_POSITION_STORAGE_KEY);
  }, []);`)
  );

  // The two clamps — one on window resize, one on size/bounds changes — read
  // the stored spot and must not write it back.
  const resizeStart = layer.indexOf("    const handleResize = () => {");
  const resizeEnd = layer.indexOf('window.addEventListener("resize", handleResize);', resizeStart);
  const resize = layer.slice(resizeStart, resizeEnd);
  check(
    "fitting the pet into a smaller window redraws it without rewriting its spot",
    resizeStart >= 0
      && resize.includes("desiredPositionRef.current,")
      && !resize.includes("savePosition(")
  );

  const clampStart = layer.indexOf(`  useEffect(() => {
    if (dragState.current) return;
    const nextPosition = clampPosition(`);
  const clampEnd = layer.indexOf("  }, [", clampStart);
  const clamp = layer.slice(clampStart, clampEnd);
  check(
    "a size or bounds change re-fits the pet without rewriting its spot",
    clampStart >= 0
      && clamp.includes("desiredPositionRef.current,")
      && !clamp.includes("savePosition(")
  );

  const app = read("src/App.tsx");
  const liftAt = app.indexOf("await mirrorStoredPetPositions();");
  check(
    "the lift runs before the restore that would otherwise overwrite it",
    liftAt >= 0
      && liftAt < app.indexOf("await hydrateLocalStorageFromSharedStorage();")
  );

  const dropStart = layer.indexOf("  const finishActiveDrag = (");
  const dropEnd = layer.indexOf("  const startNativeDrag = (", dropStart);
  const drop = layer.slice(dropStart, dropEnd);
  check(
    "dropping a pet is what stores its spot",
    drop.includes("commitPosition({ ...positionRef.current });")
      && drop.includes("savePosition(next, petPositionKey(PET_POSITION_STORAGE_KEY, key));")
  );

  if (failures > 0) {
    console.error(`\n${failures} pet position check(s) failed.`);
    process.exit(1);
  }
  console.log("\nPet positions survive a restart.");
}

void run();
