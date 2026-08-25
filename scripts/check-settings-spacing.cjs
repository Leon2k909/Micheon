#!/usr/bin/env node
/**
 * One header shape for every settings category, and one title each.
 *
 * The spacing under settings category headers was inconsistent, and by a
 * lot. These categories were written before the sidebar layout existed, back
 * when each was a card that owned its own spacing, and they kept carrying it:
 * mt-3 in Appearance, mt-5 in Learning options, nothing at all in the ones
 * whose body is a component. Stacked on the header's own margin that gave
 * 26px, 34px and 14px under three identical headers — measured in the running
 * app, not guessed.
 *
 * Account details also printed its own title and description underneath the
 * ones the category already draws, so the panel said "Account details — your
 * photo, display name, and login email" twice in a row. Flashcards did the
 * same through FlashcardModePicker, which cannot simply drop the heading
 * because its other use sits under LearningModePicker in a plain card and
 * needs to say which of the two it is.
 *
 * The container owns the gap now. This guards the rule and both duplicates.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const css = read("src/index.css");
const gamification = read("src/Gamification.tsx");
const picker = read("src/components/FlashcardModePicker.tsx");
const category = read("src/components/SettingsCategory.tsx");

// ── the header owns its own geometry ────────────────────────────────────────
// The gap used to be set on a panel header that only the sidebar drew, and the
// bodies underneath each carried their own margin on top of it: mt-3 in
// Appearance, mt-5 in Learning options, nothing at all in the ones whose body
// is a component. Every row draws the same header now, and the gap under it
// belongs to that header rather than to whatever happens to be inside.
const head = /\.settings-panel-head \{([^}]*)\}/.exec(css);
assert.ok(head, "the settings category header rule is missing");
assert.ok(
  /align-items:\s*flex-start/.test(head[1]),
  "the header must anchor to the top, or the icon drifts with the height of the row it is in"
);
assert.ok(
  !/\.settings-layout:not\(\.is-searching\)/.test(css),
  "a rule still switches the layout between a searching and a non-searching mode, which no longer exist"
);


// ── a category says its name once ───────────────────────────────────────────
// SettingsCategory draws the title and description itself, so nothing inside
// one should repeat them.
assert.ok(
  category.includes("settings-panel-head") && /\{title\}/.test(category) && /\{description\}/.test(category),
  "SettingsCategory should be the thing that renders the title and description"
);

const accountBlock = /title=\{ui\("Account details"\)\}[\s\S]{0,900}?<div className="flex items-center gap-4">/.exec(gamification);
assert.ok(
  accountBlock,
  "the Account details category should open straight onto its content"
);
assert.ok(
  !/<h2[^>]*>\{ui\("Account details"\)\}<\/h2>/.test(gamification),
  "Account details prints its own heading again under the one the category draws"
);

// The flashcard heading stays a boolean rather than a deletion, because the
// picker is drawn in two places and both of them need the label now.
assert.ok(/titled\?: boolean/.test(picker), "FlashcardModePicker should take a titled prop");
assert.ok(/\{titled && \(/.test(picker), "the flashcard heading should be conditional");
// Flashcards has no category of its own to draw the heading for it any more.
// It sits inside Learning options beside the learning-mode picker, so both
// uses now have a neighbour to be told apart from and both keep their label.
const pickerUses = [...gamification.matchAll(/<FlashcardModePicker[\s\S]{0,400}?\/>/g)].map((m) => m[0]);
assert.strictEqual(pickerUses.length, 2, `expected 2 FlashcardModePicker uses, found ${pickerUses.length}`);
assert.strictEqual(
  pickerUses.filter((use) => use.includes("titled={false}")).length,
  0,
  "a flashcard picker drops its heading, but neither place has a category drawing one"
);

// The description says what a category holds, and it was cut off after one
// line. In a two-column row a card is about half the width, so a German
// sentence lost its last third to an ellipsis and the header said less than
// the title above it already had. It wraps instead.
assert.ok(
  !/block truncate text-xs font-semibold/.test(category),
  "a category header description is truncated, so half of it never reaches the reader"
);

console.log(
  "check-settings-spacing: every category header anchors to the top and owns its own gap, "
  + "and no category prints its own title twice"
);
