#!/usr/bin/env node
/**
 * Hiding a nav entry must always be undoable, and Home must never go.
 *
 * A preference that removes a button with no visible route back is how a nav
 * ends up permanently missing an entry nobody can find again — and the person
 * it happens to has no reason to suspect a setting rather than a bug. So the
 * Hidden control is not decoration: it is the only thing that makes hiding
 * safe, and it has to appear whenever anything is hidden.
 *
 * Home is excluded from hiding for a specific reason rather than tidiness.
 * Several places call navigate("home") when a view becomes unavailable, and
 * the app opens there. A learner who hid it would keep being sent somewhere
 * with no button, which reads as the nav losing track of itself.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: { contents: 'export * from "./src/lib/navPreferences.ts";', resolveDir: root, sourcefile: "nav-entry.ts" },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

// A fake localStorage, so the real store is exercised rather than a copy of
// its logic. Without a window the module short-circuits to its fallbacks and
// every assertion below would pass against nothing.
const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init && init.detail; } };
global.localStorage = global.window.localStorage;

const compiled = new Module("nav-prefs", module);
compiled.filename = path.join(root, ".nav-prefs.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

// ── Home is not hideable ────────────────────────────────────────────────────
assert.ok(M.ALWAYS_VISIBLE_NAV.includes("home"), "Home must be excluded from hiding");
assert.strictEqual(M.canHideNavItem("home"), false);
assert.strictEqual(M.canHideNavItem("listen"), true);
// Asking anyway is ignored rather than obeyed — the guard belongs in the store,
// not only in whichever component happens to render the control.
M.hideNavItem("home");
assert.ok(!M.loadHiddenNav().includes("home"), "hiding Home must be refused by the store itself");
// ...including when it arrives through the bulk setter or from storage that
// already contains it, which a version written before this rule could.
M.saveHiddenNav(["home", "listen"]);
assert.deepStrictEqual(M.loadHiddenNav(), ["listen"], "Home must be stripped, not stored");

// ── hide, list, restore ─────────────────────────────────────────────────────
M.saveHiddenNav([]);
assert.deepStrictEqual(M.loadHiddenNav(), []);
M.hideNavItem("listen");
M.hideNavItem("games");
assert.deepStrictEqual(M.loadHiddenNav().sort(), ["games", "listen"]);
// Hiding the same thing twice must not count it twice, or "Hidden (3)" appears
// with two entries under it.
M.hideNavItem("listen");
assert.deepStrictEqual(M.loadHiddenNav().sort(), ["games", "listen"], "hiding twice should be idempotent");
M.showNavItem("listen");
assert.deepStrictEqual(M.loadHiddenNav(), ["games"]);
M.showAllNavItems();
assert.deepStrictEqual(M.loadHiddenNav(), [], "Show all must clear everything");

// Junk in storage must not take the nav down with it.
store.clear();
store.set([...store.keys()][0] || "gl-nav-hidden-v1", '{"not":"an array"}');
assert.deepStrictEqual(M.loadHiddenNav(), [], "a corrupt preference should read as nothing hidden");

// ── the way back is rendered ────────────────────────────────────────────────
const prototype = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
assert.ok(
  /\{hidden\.length > 0 && \(/.test(prototype),
  "the Hidden control must appear whenever something is hidden — it is the only way back"
);
assert.ok(
  /Hidden \(\{n\}\)/.test(prototype),
  "the Hidden control should say how many, or it is just another mystery button"
);
assert.ok(prototype.includes("showAllNavItems()"), "there should be a Show all");
assert.ok(prototype.includes("ALL_NAV_ITEMS.find"), "the restore list must resolve ids to their labels");

// Both navs read the same preference; the sidebar filters and so does mobile.
assert.ok(
  /navigationItems\.filter\(\(item\) => !isHidden\(item\.id\)\)/.test(prototype),
  "the sidebar must filter hidden items"
);
assert.ok(
  /betaItems\.filter\(\(item\) => !isHidden\(item\.id\)\)/.test(prototype),
  "the Beta section must filter too, or hiding Games leaves an empty Beta heading"
);
assert.ok(
  /!hidden\.includes\(item\.id\)/.test(prototype),
  "the mobile bar must respect the same preference"
);
assert.ok(
  prototype.includes("HIDDEN_NAV_EVENT"),
  "both navs read the same preference, so a change has to be announced"
);

// The hide control is a sibling of the label, not a nested button — a button
// inside a button is invalid and screen readers flatten it.
assert.ok(
  !/<button[^>]*className="np-nav-hide"/.test(prototype),
  "the hide control must not be a nested <button>"
);
// Read each hide control's whole opening tag rather than guessing how many
// characters separate two of its attributes — the aria-label line is long, and
// a window wide enough today is a false pass tomorrow.
const hideTags = [];
for (let at = prototype.indexOf('className="np-nav-hide"'); at !== -1;
     at = prototype.indexOf('className="np-nav-hide"', at + 1)) {
  const open = prototype.lastIndexOf("<span", at);
  assert.ok(open !== -1 && open < at, "a hide control is not on a <span>");
  // To </span>, not to the next ">": the handlers contain arrow functions, and
  // the ">" of "=>" would cut the tag off before onKeyDown.
  const close = prototype.indexOf("</span>", at);
  assert.ok(close !== -1, "a hide control is never closed");
  hideTags.push(prototype.slice(open, close));
}
assert.ok(hideTags.length >= 2, `expected a hide control on both nav lists, found ${hideTags.length}`);
for (const tag of hideTags) {
  assert.ok(/role="button"/.test(tag), "the hide control needs a button role");
  assert.ok(/tabIndex=\{0\}/.test(tag), "the hide control must be reachable by keyboard");
  assert.ok(/aria-label=/.test(tag), "an icon-only control needs a label");
  assert.ok(/onKeyDown=/.test(tag), "a role=button span gets no free Enter/Space — it needs onKeyDown");
}
assert.ok(
  /event\.stopPropagation\(\); setHidden\(hideNavItem/.test(prototype),
  "hiding must not also navigate to the thing being hidden"
);

// ── dragging between the sidebar and More ──────────────────────────────────
// Leon: "i should be able to drag menu items out of stuff on the left into
// more and out". Dragging writes the same preference the cross writes, so
// the rules above still hold — but the drag has rules of its own.
const navDrag = fs.readFileSync(path.join(root, "src/lib/navDrag.ts"), "utf8");

// dragover may only read the TYPE list; the data itself is unreadable until
// the drop. A target that tries to read it early accepts everything, which
// means a word dragged out of a lesson would rearrange the navigation.
assert.ok(/NAV_DRAG_TYPE = "application\/x-micheon-nav"/.test(navDrag),
  "the drag needs a private type, or any dragged text would look like a nav move");
const isNavDragBody = navDrag.slice(
  navDrag.indexOf("export function isNavDrag"),
  navDrag.indexOf("\n}", navDrag.indexOf("export function isNavDrag"))
);
assert.ok(isNavDragBody.includes("transfer.types") && !isNavDragBody.includes("getData"),
  "isNavDrag must decide on the type list alone — getData is empty during dragover");
assert.ok(/setData\("text\/plain"/.test(navDrag),
  "Firefox will not begin a drag unless text/plain is set as well");

// Both directions exist, and each writes the preference rather than local
// state, so the sidebar and More cannot disagree about what is put away.
assert.ok(/acceptDrop\("more", "sidebar", \(id\) => setHidden\(hideNavItem\(id\)\)\)/.test(prototype),
  "dropping a destination on More does not put it away");
assert.ok(/acceptDrop\("nav", "more", \(id\) => setHidden\(showNavItem\(id\)\)\)/.test(prototype),
  "dropping a destination back on the sidebar does not restore it");

// Each zone accepts one direction. dragover bubbles out of the More row into
// the sidebar that contains it, so when both accepted everything, the sidebar
// fired last and took the highlight — and the row being aimed at stayed
// unmarked, which is a drop target you cannot see.
assert.ok(/ORIGIN_TYPE: Record<NavDragOrigin, string>/.test(navDrag),
  "the drag does not say where it started, so neither zone can tell a put-away from a bring-back");
assert.ok(/types\.includes\(ORIGIN_TYPE\[from\]\)/.test(navDrag),
  "the origin must be carried as a TYPE — dragover cannot read data");
assert.ok(/startNavDrag\(event\.dataTransfer, id, "sidebar"\)/.test(prototype)
  && /startNavDrag\(event\.dataTransfer, id, "more"\)/.test(prototype),
  "both ends must declare where the drag started");
assert.ok(/setHiddenNav\(hideNavItem\(id\)\)/.test(prototype)
  && /setHiddenNav\(showNavItem\(id\)\)/.test(prototype),
  "the More page must both accept a dropped destination and hand one back");

// Home is the fallback destination, so it must not be draggable either —
// canHideNavItem is the one gate both routes go through.
assert.ok(/draggable: canHideNavItem\(id\)/.test(prototype),
  "a destination that cannot be hidden must not be draggable to the place that hides it");

// Drag is an addition, never the only way. The cross, the restore list and a
// click on a parked card all still work, and touch has no drag at all.
assert.ok(/onClick=\{\(\) => setHiddenNav\(showNavItem\(id\)\)\}/.test(prototype),
  "a parked destination must restore on click, since a phone cannot drag it");

const stashCss = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");
for (const rule of [".np-more-stash", ".np-more-stash.is-drop-target", ".np-side-nav.is-drop-target"]) {
  assert.ok(stashCss.includes(rule), `${rule} has no styling, so the drop target is invisible`);
}

console.log(
  "check-nav-hiding: any destination but Home can be hidden, the count is shown, "
  + "Show/Show all bring them back, and destinations drag between the sidebar and More"
);
