#!/usr/bin/env node
/**
 * The home card lets you pick a country, and calls it by its own name.
 *
 * Two failures this exists to stop coming back.
 *
 * The card used to name the country with a conditional — Germany, or else the
 * United Kingdom. That was correct for exactly as long as there were two
 * countries. France arrived and the card showed a French flag, a French
 * course, and the words "United Kingdom" between them. So: the name comes off
 * the pack, every pack has one, and no country name is deduced from an id
 * anywhere in the card.
 *
 * And the card used to change country by stepping to the next one. With three
 * that means clicking until the one you want comes round, so it opens a menu
 * over the real list instead — the same shape as the Lesson content menu on
 * the language card beside it.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r/g, "");
const shell = read("src/prototype/NewUiPrototype.tsx");
const packs = read("src/lib/countryPacks.ts");
const type = read("src/lib/countryStudies.ts");
const i18n = read("src/lib/i18n.ts");

// ── every pack says what country it is ────────────────────────────────────
assert.ok(
  /\n {2}country: string;/.test(type),
  "CountryPack has no country field, so the card has nothing to read the name from"
);

const ids = [...packs.matchAll(/\n {2}id: "([a-z]+)",/g)].map((m) => m[1]);
const names = [...packs.matchAll(/\n {2}country: "([^"]+)",/g)].map((m) => m[1]);
assert.ok(ids.length >= 3, `expected at least three country packs, found ${ids.length}`);
assert.strictEqual(
  names.length, ids.length,
  `${ids.length} country packs but ${names.length} country names — a pack would show another country's name`
);

// ── each name reaches the reader in the app's language ────────────────────
for (const name of names) {
  const quoted = i18n.includes(`"${name}":`);
  // Single-word keys are stored unquoted in the table.
  const bare = new RegExp(`\\n {2}${name}: "`).test(i18n);
  assert.ok(
    quoted || bare,
    `"${name}" has no German, so a German app would name that country in English`
  );
}

// ── the card reads the name rather than working it out ────────────────────
assert.ok(
  /<strong>\{ui\(pack\.country\)\}<\/strong>/.test(shell),
  "the card is not naming the country from its pack"
);
assert.ok(
  !/pack\.id === "(?:de|uk|fr)" \? "/.test(shell),
  "a country name is being deduced from a pack id again — that is what put "
  + '"United Kingdom" under a French flag'
);

// ── and offers the whole list rather than the next one ────────────────────
assert.ok(
  !/onSwitchCountry/.test(shell),
  "the card still takes a switch-to-next handler instead of choosing outright"
);
assert.ok(
  /className="np-home-content-menu np-home-content-menu--country"/.test(shell)
  && /role="menu"/.test(shell),
  "the country field no longer opens a menu"
);
const menu = /np-home-content-menu--country[\s\S]{0,900}?\{COUNTRY_PACKS\.map\(\(entry\) => \(([\s\S]*?)\)\)\}/.exec(shell);
assert.ok(menu, "the menu is not built from COUNTRY_PACKS, so a new country would not appear in it");
assert.ok(
  /role="menuitemradio"/.test(menu[1]) && /aria-checked=\{entry\.id === pack\.id\}/.test(menu[1]),
  "the menu does not mark which country is the current one"
);
assert.ok(
  /\{ui\(entry\.country\)\}/.test(menu[1]),
  "the menu names its options in some way other than the pack's own name"
);

// ── the menu can be closed the way every menu is ──────────────────────────
assert.ok(
  /closest\?\.\(".np-home-choice-field--country"\)/.test(shell),
  "clicking outside the country menu no longer closes it"
);
assert.ok(
  /if \(!countryMenuOpen\) return undefined;/.test(shell),
  "the close-on-outside-click effect does not guard on the country menu being open"
);

console.log(
  `check-country-picker: ${ids.length} countries, each named by its own pack and `
  + "translated, offered as a menu rather than stepped through"
);
