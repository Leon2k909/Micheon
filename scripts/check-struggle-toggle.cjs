#!/usr/bin/env node
/**
 * Struggle is a decision you can see and take back.
 *
 * Two things were wrong. In Listen, pressing Struggle wrote a grade and slid
 * to the next card with no notice and no Undo — a mis-tap while half
 * listening was unrecoverable, and there was no sign anything had happened.
 * Everywhere else the button did flash a mark, but the mark's only visible
 * home was the undo notice, which clears itself after a few seconds; once it
 * went, Struggle looked unpressed while the item was still marked.
 *
 * So the contract is:
 *
 *   1. the button carries the mark, not the notice. It stays lit, says
 *      "Struggling" rather than "Struggle", and reports aria-pressed.
 *   2. pressing a lit button takes the mark off — the same restore Undo
 *      performs, reached from the control that made it.
 *   3. Listen offers Undo like every other surface, which means its grade
 *      writer has to hand back something that can be undone.
 *
 * Point 3 is checked by running the real store round-trip, because "returns a
 * snapshot" is worthless if the snapshot does not restore. Points 1 and 2 are
 * checked by rendering the real sentence exercise both ways, and by pinning
 * the handlers on the surfaces that are too costly to mount.
 */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n?/gu, "\n");

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

// ── a browser-shaped world, before anything loads ───────────────────────
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.CustomEvent = dom.window.CustomEvent;
// The grade store announces every write so open screens can refresh. jsdom
// rejects the app's event objects and nothing here is listening anyway, so
// the announcement is swallowed rather than faked.
dom.window.dispatchEvent = () => true;
global.dispatchEvent = dom.window.dispatchEvent;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
global.matchMedia = dom.window.matchMedia;
global.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [], addEventListener() {}, removeEventListener() {} };
global.SpeechSynthesisUtterance = function () {};
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

function load(entry) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: "struggle-entry.tsx", loader: "tsx" },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    jsx: "automatic",
    define: {
      "import.meta.env.DEV": "false",
      "import.meta.env.PROD": "true",
      "import.meta.env.MODE": '"production"',
    },
    loader: { ".css": "empty", ".png": "dataurl", ".svg": "dataurl", ".json": "json" },
    write: false,
    logLevel: "silent",
  });
  const compiled = new Module("struggle-check", module);
  compiled.filename = path.join(root, ".struggle-check.cjs");
  compiled.paths = Module._nodeModulePaths(root);
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  return compiled.exports;
}

// ── Listen: the mark must actually be reversible ────────────────────────
const listen = load([
  'export { recordListenGrade, undoListenReviewChange } from "./src/lib/listenMode.ts";',
  'export { loadGradeStore, setItemStatus, statusForId } from "./src/lib/activity.ts";',
].join("\n"));
const { recordListenGrade, undoListenReviewChange, loadGradeStore, setItemStatus, statusForId } = listen;

const item = { id: "check-listen-1", aliases: [] };
const statusNow = () => statusForId(loadGradeStore(null), item.id, item.aliases);

// From nothing: mark a struggle, then take it back. The item must end up
// exactly as untouched as it started — not "new-ish", not carrying a listen
// count that survived the undo.
{
  localStorage.clear();
  check("an unmarked item starts unmarked", statusNow() === "new");
  const undo = recordListenGrade(item, "difficult", null);
  check("Struggle in Listen marks the item", statusNow() === "struggle");
  check("and hands back something to undo with", Boolean(undo && Array.isArray(undo.entries)));
  undoListenReviewChange(undo, null);
  check("undoing it leaves no trace of the mark", statusNow() === "new");
  check("and no leftover record either", loadGradeStore(null)[item.id] === undefined);
}

// From a real prior: undo must restore THAT, not wipe the item.
{
  localStorage.clear();
  setItemStatus(item.id, "known", null, item.aliases);
  const before = JSON.stringify(loadGradeStore(null)[item.id]);
  check("a known item reads as known", statusNow() === "known");
  const undo = recordListenGrade(item, "difficult", null);
  undoListenReviewChange(undo, null);
  check("undoing a mark on a known item puts the record back byte for byte",
    JSON.stringify(loadGradeStore(null)[item.id]) === before);
}

// Know it is undoable on the same terms.
{
  localStorage.clear();
  const undo = recordListenGrade(item, "know", null);
  check("Know it in Listen is undoable too", Boolean(undo && undo.entries.length));
  undoListenReviewChange(undo, null);
  check("and leaves nothing behind", loadGradeStore(null)[item.id] === undefined);
}
localStorage.clear();

// ── the button carries the mark ─────────────────────────────────────────
// Rendered from a copy of the real component with the internal exercise
// exported. Everything else is the shipped code.
const guided = read("src/GuidedSession.tsx");
const tempFile = path.join(root, "src", "__struggle-toggle-check.tsx");

function renderExercise(markedLevel) {
  fs.writeFileSync(tempFile, `${guided}\nexport { SentenceExercise as __Exercise };\n`);
  try {
    const { __Exercise, renderToStaticMarkup, createElement } = load([
      'export { __Exercise } from "./src/__struggle-toggle-check.tsx";',
      'export { renderToStaticMarkup } from "react-dom/server";',
      'export { createElement } from "react";',
    ].join("\n"));
    return renderToStaticMarkup(createElement(__Exercise, {
      item: { id: "check-1", kind: "sentence", de: "Ich hab es.", en: "I've got it.", lookup: "hab" },
      listeningChoicePool: ["Ich hab es."],
      translationChoicePool: ["I've got it."],
      markedLevel,
      onClearMark() {},
      onNext() {}, onSkip() {}, onGradeItem() {}, onReviewLevel() {}, onSnooze() {}, onAnswer() {},
    }));
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
}

const unmarked = renderExercise(null);
const marked = renderExercise("struggle");

check("an unmarked item offers Struggle",
  unmarked.includes(">Struggle<") && !unmarked.includes(">Struggling<"));
check("and says so to a screen reader",
  /aria-pressed="false"[^>]*class="[^"]*grade-btn-struggle/.test(unmarked)
  || /grade-btn-struggle[^"]*"[^>]*aria-pressed="false"/.test(unmarked));
check("an unmarked button is not lit", !unmarked.includes("grade-btn-struggle is-marked"));

check("a marked item says Struggling instead",
  marked.includes(">Struggling<") && !marked.includes(">Struggle<"));
check("the button is lit", marked.includes("grade-btn-struggle is-marked"));
check("and reports itself pressed", /aria-pressed="true"/.test(marked));
check("with a label that says pressing it again removes the mark",
  /Press to take the mark off/.test(marked));

// The banner is the OTHER face of the mark and must stay tied to the notice —
// a persistent mark that also pins a permanent banner to the card is the bug
// this replaced, in the opposite direction.
check("a standing mark does not pin the undo banner to the card for ever",
  !marked.includes("This item will stay in practice"));

// ── pressing a lit button takes the mark off ────────────────────────────
check("the sentence exercise toggles rather than re-marking",
  /const markStruggle = \(\) => \{[\s\S]{0,400}?if \(isStruggling\) \{[\s\S]{0,120}?onClearMark\?\.\(\)/.test(guided));
check("the dialogue exercise toggles the same way",
  /if \(isStruggling\) \{[\s\S]{0,120}?onClearMark\?\.\(lineGradeId\)/.test(guided));
check("Alt S sees the current mark instead of a stale closure",
  /\}, \[item\?\.id, onGradeItem, isStruggling, onClearMark\]\);/.test(guided)
  && /\}, \[lineGradeId, onGradeItem, isStruggling, onClearMark\]\);/.test(guided));
check("clearing a mark restores the grade rather than only hiding the light",
  /const clearManualMark = useCallback\(\(itemId: string\) => \{[\s\S]{0,200}?onUndoGradeItem\?\.\(id\)/.test(guided));
check("the mark outlives its notice — it is parent state, not the banner's",
  /const \[manualMarks, setManualMarks\] = useState<Record<string, GuidedReviewLevel>>\(\{\}\)/.test(guided));
check("and Undo unlights the button as well as restoring the grade",
  /if \(!restored\) return;[\s\S]{0,300}?setManualMarks\(\(current\) => \{/.test(guided));

const listenView = read("src/components/listen/ListenView.tsx");
check("Listen shows an undo for a plain grade, not only for a level change",
  /const undo = recordListenGrade\(item, verdict, profile\)|const fresh = recordListenGrade\(item, verdict, profile\)/.test(listenView)
  && /undo: \{ change: undo, item: target \}/.test(listenView));
check("pressing the lit button in Listen takes the mark off instead of re-marking",
  /if \(sessionMarks\.get\(item\.id\)\?\.verdict === verdict\) \{[\s\S]{0,120}?clearMark\(item\)/.test(listenView));
check("un-marking in Listen stays on the card rather than sliding to the next one",
  /clearMark\(item\);\n\s*return;/.test(listenView));
check("Listen's buttons read the mark, not the 350ms flash",
  /graded === "difficult" \|\| itemMark === "difficult"/.test(listenView)
  && /itemMark === "difficult" \? "Struggling" : "Struggle"/.test(listenView));
check("Listen's Undo link unlights the button too",
  /undoListenReviewChange\(pending\.change, profile\);[\s\S]{0,300}?setSessionMarks\(/.test(listenView));

const tests = read("src/components/tests/TestsView.tsx");
check("the test screens toggle their Struggle button off",
  /const toggleTrackedStatus = \([\s\S]{0,300}?current === status \? "new" : status/.test(tests));
check("and both of them use it",
  (tests.match(/toggleTrackedStatus\([^)]*"struggle"/g) ?? []).length === 2);
check("the test screens rename the button when it is marked",
  (tests.match(/trackedStatus === "struggle" \? "Struggling" : "Struggle"/g) ?? []).length === 2);

// The trackers had this right all along — they are the precedent, so they
// must not regress into a one-way button.
const vocab = read("src/components/lab/VocabTracker.tsx");
const words = read("src/components/lab/WordsTracker.tsx");
check("the vocabulary tracker still toggles its Struggle status",
  /status === "struggle" \? "new" : "struggle"/.test(vocab));
check("and so does the words tracker",
  /status === "struggle" \? "new" : "struggle"/.test(words));

// ── the lit state has to be visible ─────────────────────────────────────
const styles = read("src/index.css");
check("a lit Struggle button is filled, not just differently outlined",
  /\.grade-btn-struggle\.is-marked[\s\S]{0,160}?background: rgb\(225 29 72\)/.test(styles));
check("and the session skin says so again, where the pills are neutral by default",
  /\.guided-session \.grade-btn-struggle\.is-marked/.test(styles));
check("the shortcut chip stays readable against the fill",
  /\.grade-btn\.is-marked \.grade-kbd/.test(styles));

// jsdom keeps timers and its own handles alive, so a gate script that mounts
// one has to say when it is finished or the build waits for ever.
dom.window.close();

if (failures) {
  console.error(`\ncheck-struggle-toggle: ${failures} failed`);
  process.exit(1);
}
console.log("\ncheck-struggle-toggle: every Struggle button shows the mark it made, "
  + "presses off again, and Listen can be undone like everywhere else");
process.exit(0);
