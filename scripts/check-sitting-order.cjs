/**
 * Continue learning can be told how to put a sitting together, and Listen can
 * be told to play similar sentences together.
 *
 * The guided session had one fixed answer — the course's pick — while Listen
 * had a whole panel of orders. Now both read the same idea: an order decides
 * what comes first and still teaches everything; levels decide what a sitting
 * draws on at all. And "similar sentences together" is one shape at a time —
 * every "Ich möchte …", then every "Kannst du …" — in both places.
 *
 * Checked against the real modules and the real catalogue, not a copy.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

// A browser-shaped corner for the modules that keep settings in storage.
const store = new Map();
global.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
global.window = { localStorage: global.localStorage, addEventListener() {}, removeEventListener() {}, setTimeout, clearTimeout };
global.document = { addEventListener() {}, removeEventListener() {}, visibilityState: "visible" };
global.navigator = { language: "en-GB", onLine: true };

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export * as order from "./src/lib/sittingOrder.ts";',
      'export { sentencePattern, sharesPattern } from "./src/lib/sentencePattern.ts";',
      'export { buildExchangeIndex, exchangeChain, exchangeKey, exchangePlace, repliesTo } from "./src/lib/exchanges.ts";',
      'export { buildListenQueue, LISTEN_QUEUE_ORDERS } from "./src/lib/listenMode.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "sitting-order-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("sitting-order-check", module);
compiled.filename = path.join(root, ".sitting-order-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { order: O, sentencePattern, sharesPattern, buildExchangeIndex, exchangeChain, exchangeKey, exchangePlace, repliesTo, buildListenQueue, LISTEN_QUEUE_ORDERS, allPartBlueprints, buildApiPartFromResolved, buildBundledParts } = compiled.exports;

const failures = [];
const check = (name, ok, detail = "") => {
  if (ok) console.log(`ok   ${name}`);
  else { console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`); failures.push(name); }
};

// ── what "similar" means ────────────────────────────────────────────────────
check("the pattern is the first two words, lowercased, without punctuation",
  sentencePattern("Ich möchte einen Kaffee, bitte.") === "ich möchte"
  && sentencePattern("Kannst du mir helfen?") === "kannst du"
  && sentencePattern("  Wo   ist der Bahnhof? ") === "wo ist");
check("a single word is its own pattern and shares it with nobody",
  sentencePattern("Danke") === "danke" && !sharesPattern("Danke", "Danke") && !sharesPattern("Danke!", "Danke."));
check("two sentences that open the same way share a pattern, and two that do not, do not",
  sharesPattern("Ich möchte zahlen.", "Ich möchte nach Hause.") && !sharesPattern("Ich möchte zahlen.", "Ich habe Hunger."));

// ── the orders the sitting can be given ─────────────────────────────────────
const panel = read("src/components/duo/ContinueLearningSettings.tsx");
const choices = [...panel.matchAll(/\[\s*"([a-z]+)",\s*"([^"]+)"\s*\]/gu)].map((m) => [m[1], m[2]]);
check("every order the panel offers is one the library keeps",
  choices.length >= 6 && choices.every(([value]) => O.SITTING_ORDERS.includes(value)),
  `on screen but rejected: ${choices.filter(([v]) => !O.SITTING_ORDERS.includes(v)).map(([v]) => v).join(", ")}`);
check("every order the library keeps has a button",
  O.SITTING_ORDERS.every((value) => choices.some(([v]) => v === value)),
  `accepted but unreachable: ${O.SITTING_ORDERS.filter((v) => !choices.some(([c]) => c === v)).join(", ")}`);
const explanation = panel.slice(panel.indexOf('ui("The course\'s pick'), panel.indexOf('aria-label={ui("Order")}'));
for (const [, label] of choices) {
  const name = label.replace(/\s*\(.*\)$/u, "");
  check(`the order text explains "${name}"`, explanation.includes(name), "the panel offers it and never says what it does");
}

// ── what each order does ────────────────────────────────────────────────────
const c = (score, index, level, de, commonality) => ({ score, index, level, de, commonality });
const a1worse = c(300, 0, "A1", "Ich möchte einen Tee.", 2);
const b1best = c(100, 1, "B1", "Ich möchte mich beschweren.", 1);
const common = c(200, 2, "A2", "Ich habe Hunger.", 9);
const short = c(250, 3, "A2", "Danke.", 3);
const cands = [b1best, common, short, a1worse];
const by = (name) => [...cands].sort(O.sittingComparator(name)).map((x) => x.de);
check("the course's pick is the score", by("course")[0] === b1best.de);
check("easiest first takes a worse-scoring A1 before the best-scoring B1",
  by("level")[0] === a1worse.de && by("level").indexOf(b1best.de) === cands.length - 1);
check("most common first ignores level and score", by("common")[0] === common.de);
check("shortest first and longest first go by length",
  by("shortest")[0] === short.de && by("longest")[0] === b1best.de);
check("similar leads with the course's pick", by("similar")[0] === b1best.de);
const mates = O.similarMates(b1best, cands).map((x) => x.de);
check("and its mates are the cards that open the same way, and only those",
  mates.length === 1 && mates[0] === a1worse.de);
check("a single-word lead has no mates", O.similarMates(short, cands).length === 0);

// ── what sticks ─────────────────────────────────────────────────────────────
check("the order is remembered per course, and an unknown value falls back",
  O.setSittingOrder("level", "de-en") === "level" && O.getSittingOrder("de-en") === "level"
  && O.getSittingOrder("pl-en") === O.DEFAULT_SITTING_ORDER
  && O.setSittingOrder("nonsense", "de-en") === O.DEFAULT_SITTING_ORDER);
const kept = O.setSittingLevelFilters(["a1", "b2", "zz"], "de-en");
check("levels are remembered as a set, filtered to real steps",
  kept.size === 2 && kept.has("a1") && kept.has("b2") && O.getSittingLevelFilters("de-en").has("b2"));
check("no levels chosen means every level; chosen levels admit only their own",
  O.passesSittingLevel("B1", new Set()) && O.passesSittingLevel("A1", kept) && !O.passesSittingLevel("B1", kept));

// ── the sitting reads it ────────────────────────────────────────────────────
const sitting = read("src/guided_learning_session.tsx");
check("the sitting sorts its fresh candidates by the chosen order",
  /candidates\.sort\(sittingComparator\(sittingOrder\)\)/u.test(sitting));
check("and drops fresh material outside the chosen levels before scoring it",
  /passesSittingLevel\(item\.level \?\? p\.level, sittingLevels\)/u.test(sitting));
check("similar sentences follow the lead ahead of its pack-mates",
  /similarMates\(lead, candidates\)/u.test(sitting) && /\.\.\.patternMates,\s*\n\s*(?:\.\.\.exchangeMates,\s*\n\s*)?(?:\/\/[^\n]*\n\s*)*\.\.\.candidates\.filter/u.test(sitting));

// ── and both doors show the panel ───────────────────────────────────────────
const session = read("src/GuidedSession.tsx");
check("the session header has the gear beside mute and close",
  /<MuteButton[\s\S]{0,400}data-testid="session-settings-button"[\s\S]{0,600}aria-label=\{ui\("Close lesson"\)\}/u.test(session));
check("and the gear opens the same panel the Learn page shows",
  /<ContinueLearningSettings\b/u.test(session) && read("src/components/duo/DuoPathView.tsx").includes("<ContinueLearningSettings />"));
// A change rebuilds the sitting on the spot. The learner pressed an order to
// see it; "applies from your next sitting" was the panel not doing its job.
check("the panel says a change rebuilds the sitting, and does",
  session.includes('ui("Changing this rebuilds the sitting from the start.")')
  && /<ContinueLearningSettings onChange=\{\(\) => \{[^}]*onRebuildSitting\?\.\(\);/u.test(session)
  && /onRebuildSitting=\{\(\) => \{[\s\S]{0,400}startSessionRef\.current\(lastRequestedPartRef\.current\)/u.test(sitting));
check("the panel hangs under the header wherever the header ends, not at a fixed offset",
  /sessionHeaderRef\.current\?\.getBoundingClientRect\(\)\.bottom/u.test(session)
  && /style=\{\{ top: sessionSettingsTop \}\}/u.test(session)
  && /<header className="fs-topbar" ref=\{sessionHeaderRef\}>/u.test(session));

// ── Listen plays similar sentences together ─────────────────────────────────
check("Listen accepts the order", LISTEN_QUEUE_ORDERS.includes("similar"));
const view = read("src/components/listen/ListenView.tsx");
check("Listen's picker offers it and its explanation names it",
  /"similar", "Similar sentences together",/u.test(view)
  && /Similar sentences together plays sentences that start the same way/u.test(view));
const parts = {
  ...Object.fromEntries(Object.entries(allPartBlueprints).map(([k, bp]) => [k, buildApiPartFromResolved(bp, {})])),
  ...buildBundledParts(),
};
const queue = buildListenQueue(parts, {}, { order: "similar", within: "common", contentSource: ["phrases"] });
const patterns = queue.map((item) => sentencePattern(item.de));
const members = new Map();
for (const p of patterns) if (p.includes(" ")) members.set(p, (members.get(p) ?? 0) + 1);
const grouped = queue.map((item, i) => (members.get(patterns[i]) ?? 0) > 1);
const lastGrouped = grouped.lastIndexOf(true), firstSingle = grouped.indexOf(false);
check(`the queue (${queue.length} sentences) plays every shared shape before any one-off`,
  lastGrouped >= 0 && (firstSingle < 0 || firstSingle > lastGrouped),
  `a one-off at ${firstSingle + 1} sits before the last shape at ${lastGrouped + 1}`);
const starts = [];
for (let i = 0; i <= lastGrouped; i++) if (i === 0 || patterns[i] !== patterns[i - 1]) starts.push(i);
const seen = new Set(), split = starts.filter((i) => { const p = patterns[i]; if (seen.has(p)) return true; seen.add(p); return false; });
check("each shape plays in one run, never split", split.length === 0,
  `${split.length} shape(s) come back after another started, e.g. "${patterns[split[0]]}" at ${split[0] + 1}`);
const sizes = starts.map((i) => members.get(patterns[i]));
check("the biggest shape plays first and shapes never grow along the queue",
  sizes.every((n, i) => i === 0 || n <= sizes[i - 1]),
  `sizes along the queue: ${sizes.slice(0, 8).join(", ")}`);
check("the first shape really is a run of one opening",
  starts.length > 3 && sizes[0] >= 5 && patterns[0] === patterns[1],
  `first shape "${patterns[0]}" ×${sizes[0]}`);

// ── conversation order: a question, then the answer that fits it ────────────
// The only honest source of "what answers what" is the packs' dialogues,
// which are turns in sequence. The index is built from them by sentence,
// so a line a pack also teaches as a phrase still knows its place.
const exchanges = buildExchangeIndex(parts);
check(`the dialogues are indexed (${exchanges.dialogues} of them, ${exchanges.follows.size} lines with a reply)`,
  exchanges.dialogues > 500 && exchanges.follows.size > 2000);
const wieHeisst = repliesTo("Wie heißt du?", exchanges).map((key) => key);
check("\"Wie heißt du?\" is answered by a name",
  wieHeisst.some((key) => key.startsWith("ich heiße")), `replies: ${wieHeisst.slice(0, 3).join(" | ")}`);
const chain = exchangeChain("Hallo! Was möchtest du?", exchanges, () => true, 3);
check("an exchange follows the dialogue turn by turn",
  chain.length >= 1 && chain[0] === exchangeKey("Ich möchte einen Kaffee, bitte."), `chain: ${chain.join(" → ")}`);
check("and stops at the first turn nobody has",
  exchangeChain("Hallo! Was möchtest du?", exchanges, (key) => key !== exchangeKey("Ich möchte einen Kaffee, bitte."), 3).length === 0);
check("the sitting leads with a card that has a reply, and its reply follows it",
  /exchangeChain\(candidate\.de, exchanges, \(key\) => candidateByKey\.has\(key\), 1\)\.length > 0/u.test(sitting)
  && /exchangeChain\(lead\.de, exchanges, \(key\) => candidateByKey\.has\(key\), NEW_PER_LESSON_TARGET\)/u.test(sitting)
  && /\.\.\.exchangeMates,/u.test(sitting));
check("Listen accepts conversation order and its picker offers it",
  LISTEN_QUEUE_ORDERS.includes("conversation") && /"conversation", "Conversation order",/u.test(view)
  && /Conversation order plays the course's dialogues as exchanges/u.test(view));
const talk = buildListenQueue(parts, {}, { order: "conversation", within: "common", contentSource: ["phrases"] });
const places = talk.map((item) => exchangePlace(item.de, exchanges));
const lastInDialogue = places.map((p) => Boolean(p)).lastIndexOf(true), firstAlone = places.findIndex((p) => !p);
check(`Listen plays every dialogue line (${places.filter(Boolean).length}) before anything that stands alone`,
  lastInDialogue >= 0 && (firstAlone < 0 || firstAlone > lastInDialogue),
  `a lone card at ${firstAlone + 1} before the last dialogue line at ${lastInDialogue + 1}`);
let broken = 0, splitDialogues = 0;
const seenDialogues = new Set();
for (let i = 0; i <= lastInDialogue; i++) {
  const here = places[i], before = places[i - 1];
  if (!before || before.dialogue !== here.dialogue) {
    if (seenDialogues.has(here.dialogue)) splitDialogues++;
    seenDialogues.add(here.dialogue);
  } else if (here.line < before.line) broken++;
}
check("each dialogue plays whole, in turn order, and is never split",
  broken === 0 && splitDialogues === 0, `${broken} turn(s) out of order, ${splitDialogues} dialogue(s) split`);
check("the first exchange really is a question and its reply",
  places[0]?.line === 0 && places[1]?.dialogue === places[0]?.dialogue && places[1]?.line === 1,
  `queue opens: ${talk.slice(0, 2).map((item) => item.de).join("  →  ")}`);

if (failures.length) {
  console.error(`\n${failures.length} sitting-order check(s) failed`);
  process.exit(1);
}
console.log(`check-sitting-order: Continue learning takes ${O.SITTING_ORDERS.length} orders and a level filter, the session and the Learn page both show the panel, and Listen's similar order plays ${starts.length} shapes in runs, the biggest ("${patterns[0]}" ×${sizes[0]}) first.`);
