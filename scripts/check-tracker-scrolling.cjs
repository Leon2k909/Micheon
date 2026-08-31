#!/usr/bin/env node
/**
 * The tracker lists must not be a second scroll area.
 *
 * They used to be a 542px window with their own scrollbar, sitting inside a
 * page that scrolls. Two nested scrollers means the wheel goes to whichever
 * one the pointer happens to be over, and `overscroll-contain` stopped it
 * being handed on to the page even when the list reached its end. The result
 * was reported as "sometimes you get stuck and cannot scroll on": with the
 * pointer over the sentence list — 18,000 rows that load more as you go, so
 * it never ends — the page could not be advanced at all. The words list was
 * worse: it has no automatic loading, so it really did stop, and then the
 * wheel did nothing whatsoever.
 *
 * Nothing about that is visible in a screenshot and nothing throws, which is
 * why it is pinned here rather than left to be noticed again.
 *
 * Three things are checked, and the third is the one with teeth:
 *
 *  1. Neither list re-grows a fixed height, an inner overflow, or overscroll
 *     containment.
 *  2. The filter row stays reachable — sticky, and caught at --titlebar-h
 *     rather than 0, because the desktop app puts a 38px title bar above the
 *     shell and 0 would park the row underneath it.
 *  3. The sentence tracker's infinite scroll watches the VIEWPORT. Handing it
 *     an element root again would be silent and catastrophic: an element that
 *     does not scroll does not clip, so its root rect is the whole run of
 *     rows and the sentinel sits inside it permanently. Every fresh observer
 *     reports an initial intersection and the effect builds a fresh one per
 *     page, so it would walk through all 18,000 rows in one synchronous
 *     burst instead of following the scroll.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const FILES = [
  { label: "VocabTracker", rel: "src/components/lab/VocabTracker.tsx", label_aria: 'aria-label={ui("Word & sentence tracker")}' },
  { label: "WordsTracker", rel: "src/components/lab/WordsTracker.tsx", label_aria: 'aria-label={ui("Words tracker")}' },
];

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

for (const { label, rel, label_aria } of FILES) {
  const source = read(rel);

  // ── 1. no second scroll area ────────────────────────────────────────────
  // The list is the element carrying the tracker's aria-label. Take the
  // className that precedes it rather than searching the whole file, so an
  // unrelated scroller elsewhere in the component is not what gets tested.
  const at = source.indexOf(label_aria);
  check(at > 0, `${label}: the list is no longer identifiable by ${label_aria}`);
  if (at > 0) {
    const opening = source.slice(source.lastIndexOf("<div", at), at);
    for (const banned of ["overflow-y-auto", "overscroll-contain", "h-[min(34rem,65vh)]", "min-h-[24rem]"]) {
      check(
        !opening.includes(banned),
        `${label}: the list carries "${banned}" again — that makes it a second scroll area inside a page `
        + "that already scrolls, and the wheel stops reaching the page whenever the pointer is over it"
      );
    }
    check(
      !/tabIndex=\{0\}/.test(opening),
      `${label}: the list is a tab stop again; it was only focusable so it could be scrolled by keyboard, `
      + "and it no longer scrolls"
    );
  }

  // ── 2. the filters stay reachable ───────────────────────────────────────
  const sticky = /className="sticky top-\[var\(--titlebar-h\)\][^"]*"/.exec(source);
  check(
    sticky !== null,
    `${label}: the filter row is not sticky at var(--titlebar-h). With the list running down the page the `
    + "filters scroll away, and catching at 0 instead would park them under the desktop title bar"
  );
  if (sticky) {
    check(
      /bg-\[var\(--surface\)\]/.test(sticky[0]),
      `${label}: the sticky filter row has no background, so the rows travelling under it show through`
    );
    check(
      /\bz-10\b/.test(sticky[0]),
      `${label}: the sticky filter row has no stacking context, so rows can paint over it`
    );
  }
}

// ── 2b. nothing above the filter row turns it back into decoration ────────
// This one was found by looking at a photograph, not at a measurement: the
// row reported position:sticky and still scrolled away. position:sticky is
// measured against the nearest scroll container, and ANY ancestor with
// overflow other than visible or clip becomes one — the fold's card was
// overflow-hidden, so the row was sticking inside a box that never scrolls.
const gamification = read("src/Gamification.tsx");
const fold = /<ProfileFold\s+className="np-vocabulary-anchor([^"]*)"/.exec(gamification);
check(
  fold !== null,
  "the vocabulary fold no longer carries np-vocabulary-anchor, so this gate cannot find the card"
);
if (fold) {
  check(
    /\boverflow-clip\b/.test(fold[1]),
    "the vocabulary card must override the fold's overflow-hidden with overflow-clip. Both clip the same way, "
    + "but `hidden` makes the card a scroll container and position:sticky then measures against a box that does "
    + "not scroll — the filter row computes as sticky and silently never sticks."
  );
}

// ── 3. infinite scroll watches the viewport ───────────────────────────────
const vocab = read("src/components/lab/VocabTracker.tsx");
const observerCall = /new IntersectionObserver\([\s\S]*?\{([^}]*)\}\s*\)/.exec(vocab);
assert.ok(observerCall, "check-tracker-scrolling: the sentence tracker no longer builds an IntersectionObserver");
check(
  !/\broot\b/.test(observerCall[1]),
  "VocabTracker: the load-more observer was given a root again. The list does not scroll, so it does not "
  + "clip: the sentinel would sit inside that root for ever, every fresh observer would report it as "
  + "intersecting, and the whole 18,000-row catalogue would load in one burst instead of page by page."
);
check(
  /rootMargin: "180px 0px"/.test(observerCall[1]),
  "VocabTracker: the load-more margin changed; 180px is what loads the next page before the reader reaches the end"
);

if (failures.length) {
  console.error("FAIL check-tracker-scrolling");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  "check-tracker-scrolling: neither tracker list is a second scroll area, both filter rows stay put under the "
  + "title bar, and the sentence tracker's infinite scroll follows the viewport rather than the list"
);
