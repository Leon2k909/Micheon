#!/usr/bin/env node
/**
 * Two things that were slower, or in the wrong place, than they needed to be.
 *
 * NAV ORDER. "More" is the overflow drawer and reads as the end of the list.
 * Life in the UK sat underneath it, which made a real destination look like a
 * stray. It belongs above.
 *
 * THE GAMES GATE. Clicking Games showed a loading state while a 3.9 MB chunk
 * downloaded and 485 blueprints resolved — measured at ~2.4 s to start and
 * ~3.3 s to finish on the production build. None of that is needed to draw a
 * list of game titles: apiParts is referenced in exactly one place in
 * GamesView, inside GameContentProvider, which wraps the SELECTED game. So the
 * view no longer waits, and the wait moved to opening a game, which genuinely
 * cannot start without vocabulary.
 *
 * The failure this guards against is subtle in both directions: putting the
 * partsReady gate back makes the library slow again, and removing the inner
 * gate is worse than slow — GameContentProvider would build a catalogue from
 * an empty parts map, fall through to the three-item FALLBACK_ITEMS, and start
 * a spelling game with almost nothing in it.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const prototype = read("src/prototype/NewUiPrototype.tsx");
const gamesView = read("src/games/GamesView.tsx");

// ── nav order ───────────────────────────────────────────────────────────────
const navBlock = /const NAVIGATION: NavigationItem\[\] = \[([\s\S]*?)\];/.exec(prototype);
assert.ok(navBlock, "the NAVIGATION list could not be found");
const order = [...navBlock[1].matchAll(/id: "([a-z-]+)"/g)].map((match) => match[1]);
const uk = order.indexOf("life-in-uk");
const more = order.indexOf("more");
assert.ok(uk >= 0, "Life in the UK is not in the sidebar navigation");
assert.ok(more >= 0, "More is not in the sidebar navigation");
assert.ok(
  uk < more,
  `Life in the UK must sit above More in the sidebar — got ${order.join(" → ")}`
);
assert.strictEqual(order[order.length - 1], "more", "More is the overflow drawer and belongs last");

// ── the games library does not wait for the catalogue ───────────────────────
assert.ok(
  /<GamesView apiParts=\{apiParts\} catalogueReady=\{partsReady\} \/>/.test(prototype),
  "GamesView should receive catalogueReady rather than being gated on partsReady upstream"
);
assert.ok(
  !/activeView === "games" && gamesUnlocked \?[\s\S]{0,240}\{partsReady \?/.test(prototype),
  "the games view is gated on partsReady again — the library is a list of titles and needs no catalogue"
);

// ...but a game still does.
assert.ok(
  /catalogueReady \?\s*\(\s*<GameContentProvider/.test(gamesView),
  "GameContentProvider must only mount once the catalogue is ready, or a game starts on FALLBACK_ITEMS"
);
assert.ok(
  /catalogueReady\?: boolean/.test(gamesView),
  "GamesView should accept catalogueReady"
);
// apiParts stays confined to the selected-game branch. If it ever leaks into
// the grid, the upstream gate becomes necessary again and this all unwinds.
// Counting the word would count the comment and the two halves of
// `apiParts={apiParts}`, so what is checked is the position: nothing after the
// grid branch opens may touch it.
const gridBranch = gamesView.indexOf('className="space-y-4"');
assert.ok(gridBranch > 0, "could not locate the games grid branch");
const providerAt = gamesView.indexOf("<GameContentProvider");
assert.ok(providerAt > 0 && providerAt < gridBranch, "GameContentProvider should sit in the selected-game branch");
assert.ok(
  !gamesView.slice(gridBranch).includes("apiParts"),
  "the games grid references apiParts — it must not, or the library has to wait for the catalogue again"
);

// ── prefetch on intent, but never during boot ───────────────────────────────
assert.ok(
  /onPointerEnter=\{\(\) => onPrefetch\(item\.id\)\}/.test(prototype),
  "nav items should prefetch on pointer intent"
);
assert.ok(
  /onFocus=\{\(\) => onPrefetch\(item\.id\)\}/.test(prototype),
  "keyboard focus is intent too — prefetch there as well, or keyboard users get the slow path"
);
assert.ok(
  /if \(document\.readyState !== "complete"\) return;/.test(prototype),
  "prefetch must not fire before load: the catalogue is kept off the first-paint path deliberately, "
  + "and a pointer resting over the sidebar during boot would drag 3.9 MB back into it"
);

// ── the "Soon" pill fits its own word ───────────────────────────────────────
// The nav button is a two-column grid and the pill is its third child, so it
// falls to row 2. Without a column of its own it takes column 1 — the icon
// track — and the pill renders exactly as wide as an icon whatever the word
// says: 24px of bubble around 38.7px of "Bald", measured. Both declarations
// below are what stop that, and neither reads as load-bearing.
const prototypeCss = read("src/prototype/new-ui-prototype.css");
const soonRule = /\.np-nav-soon \{([\s\S]*?)\}/.exec(prototypeCss);
assert.ok(soonRule, "the .np-nav-soon rule could not be found");
assert.ok(
  /grid-column:\s*2/.test(soonRule[1]),
  "the Soon pill needs grid-column: 2, or it falls into the 24px icon track and clips its own word"
);
assert.ok(
  /justify-self:\s*start/.test(soonRule[1]),
  "the Soon pill needs justify-self: start, or it stretches across the label track instead of fitting its word"
);
assert.ok(
  !/\bwidth:\s*\d/.test(soonRule[1]),
  "the Soon pill must not carry a fixed width — the whole point is that it follows whatever the word says"
);

console.log(
  `check-nav-and-games: nav order ${order.join(" → ")}; `
  + "the games library renders without the catalogue and a game still waits for it"
);
