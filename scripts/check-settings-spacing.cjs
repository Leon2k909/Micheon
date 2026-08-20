#!/usr/bin/env node
/**
 * One gap under every settings category header, and one title.
 *
 * Leon: "the settings categories spacing is inconsistent". It was, and by a
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

// ── the container owns the gap ──────────────────────────────────────────────
assert.ok(
  /section\.settings-category > div > :first-child \{[^}]*margin-top:\s*0/.test(css),
  "the category body's first child must not add its own top margin — that is what made the gap "
  + "depend on which category you opened"
);
// Scoped to `section` on purpose: search results still render the older card,
// where the body does need a gap from the button above it.
assert.ok(
  !/^\.settings-category > div > :first-child/m.test(css),
  "the rule must stay scoped to section.settings-category, or it also flattens the search-result cards"
);
const head = /\.settings-panel-head \{([^}]*)\}/.exec(css);
assert.ok(head, "the settings panel header rule is missing");
assert.ok(
  /margin-bottom:\s*14px/.test(head[1]),
  "the header should carry the whole gap in one place"
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

// Flashcards keeps its heading for the standalone use and drops it in the
// category — a boolean, not a deletion.
assert.ok(/titled\?: boolean/.test(picker), "FlashcardModePicker should take a titled prop");
assert.ok(/\{titled && \(/.test(picker), "the flashcard heading should be conditional");
assert.ok(
  /<FlashcardModePicker[\s\S]{0,400}?titled=\{false\}/.test(gamification),
  "the Flashcards settings category must pass titled={false}, or it says Flashcards twice"
);
// ...and the other use must NOT pass it, or that card loses the label that
// distinguishes it from the learning-mode picker above it.
const pickerUses = [...gamification.matchAll(/<FlashcardModePicker[\s\S]{0,400}?\/>/g)].map((m) => m[0]);
assert.strictEqual(pickerUses.length, 2, `expected 2 FlashcardModePicker uses, found ${pickerUses.length}`);
assert.strictEqual(
  pickerUses.filter((use) => use.includes("titled={false}")).length,
  1,
  "exactly one use is inside a settings category; the standalone card keeps its heading"
);

console.log(
  "check-settings-spacing: one 14px gap under every category header, "
  + "and no category prints its own title twice"
);
