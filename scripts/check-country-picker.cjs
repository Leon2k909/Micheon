#!/usr/bin/env node
/**
 * Country studies is chosen exactly the way a language is.
 *
 * Identically, which means the same dialog rather than a second control
 * shaped like it: the Change button on the country card opens the course
 * chooser the language card opens, and the country rows in it behave like
 * every other row.
 *
 * Three failures this exists to stop coming back.
 *
 * The card used to name the country with a conditional — Germany, or else the
 * United Kingdom. Correct for exactly as long as there were two countries.
 * France arrived and the card showed a French flag, a French course, and the
 * words "United Kingdom" between them.
 *
 * The card then grew a dropdown of its own, which is not what she asked for.
 *
 * And picking a country row in the chooser used to set the active COURSE id,
 * which is what the language card reads for its flag and lesson count — so
 * choosing Germany there left the language side of the home page counting
 * through a citizenship course.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r/g, "");
const shell = read("src/prototype/NewUiPrototype.tsx");
const switcher = read("src/components/course/CourseSwitcher.tsx");
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
  'a country name is being deduced from a pack id again — that is what put "United Kingdom" under a French flag'
);

// ── both cards change the same way, through the same dialog ───────────────
const CHANGE = /<button className="np-home-choice-change" onClick=\{(\w+)\} type="button">/g;
const handlers = [...shell.matchAll(CHANGE)].map((m) => m[1]);
assert.ok(
  handlers.includes("onSwitchCourse") && handlers.includes("onChangeCountry"),
  "the two cards no longer carry the same plain Change button: found " + JSON.stringify(handlers)
);
assert.ok(
  /onChangeCountry=\{\(\) => openCourseSwitcher\("country"\)\}/.test(shell),
  "the country card's Change no longer opens the course chooser on the country courses"
);
assert.ok(
  /onSwitchCourse=\{\(\) => openCourseSwitcher\("all"\)\}/.test(shell),
  "the language card's Change no longer opens the course chooser on the whole catalogue"
);
// Every opener states its scope. One that did not would inherit whichever
// scope was set last — ask to change your language from another screen after
// changing a country, and you would be handed the country list.
const opens = (shell.match(/setCourseSwitcherOpen\(true\)/g) || []).length;
assert.strictEqual(
  opens, 1,
  `the chooser is opened from ${opens} places instead of the one helper that sets a scope first`
);
assert.ok(
  /const openCourseSwitcher = useCallback\(\(next: "all" \| "country"\) => \{\s*setCourseSwitcherScope\(next\);\s*setCourseSwitcherOpen\(true\);/.test(shell),
  "the one opener does not set the scope before opening"
);
assert.ok(
  /scope=\{courseSwitcherScope\}/.test(shell),
  "the chooser is not told which scope to open on"
);

// ── and the country scope really does hide the languages ─────────────────
assert.ok(
  /scope: "all" \| "country";/.test(switcher),
  "the chooser has no scope, so opening it to change a country lists every language first"
);
assert.ok(
  /const countryOnly = scope === "country";/.test(switcher),
  "the chooser does not work out whether it is showing countries only"
);
for (const [guard, what] of [
  [/\{!countryOnly && languageRowCount > 0 && \(/, "the language section"],
  [/\{!countryOnly && programming\.length > 0 && \(/, "the programming section"],
]) {
  assert.ok(
    guard.test(switcher),
    `${what} still shows when the chooser was opened to change a country — which is how "change the country" ends up changing the language`
  );
}
assert.ok(
  !/np-home-content-menu--country/.test(shell),
  "the country card has grown a dropdown of its own again instead of using the dialog"
);

// ── a country row in the dialog picks a country, not a language course ────
assert.ok(
  /const country = COUNTRY_PACKS\.find\(\(entry\) => entry\.course\.id === courseId\);/.test(shell),
  "selectCourse no longer recognises a country course, so choosing one would overwrite the language course"
);
const chosen = /const country = COUNTRY_PACKS[\s\S]{0,400}?\n {4}\}/.exec(shell)?.[0] ?? "";
assert.ok(
  /pickCountry\(country\.id\)/.test(chosen) && /return;/.test(chosen),
  "a country course is not routed to the country choice and returned from early"
);

// ── and the dialog ticks the country you are on ───────────────────────────
assert.ok(
  /activeCountryCourseId=\{activePack\.course\.id\}/.test(shell),
  "the dialog is not told which country course is current, so no country row would ever be ticked"
);
assert.ok(
  /const active = id === activeCourseId \|\| id === activeCountryCourseId;/.test(switcher),
  "the dialog marks the active row from the language course alone again"
);

// ── and flies its own flag there ─────────────────────────────────────────
// The artwork picks by course id. A country course's id is in neither the
// gradient list nor the flag art keyed by language, so all three rows fell
// through to the globe placeholder — three identical rows for three
// countries, in a dialog whose whole job is telling them apart.
assert.ok(
  /const countryFlagId = COUNTRY_PACKS\.find\(\(entry\) => entry\.course\.id === id\)\?\.flagId;/.test(switcher)
  && /if \(countryFlagId\) return <FlagRoundel id=\{countryFlagId\} \/>;/.test(switcher),
  "a country row in the dialog no longer takes its flag from the pack, so it would show a globe"
);
const flagIds = [...packs.matchAll(/\n {2}flagId: "([a-z-]+)",/g)].map((m) => m[1]);
assert.strictEqual(
  flagIds.length, ids.length,
  `${ids.length} country packs but ${flagIds.length} flags — a country would fall back to the globe`
);
const flagArt = read("src/components/course/FlagRoundel.tsx");
for (const flagId of flagIds) {
  assert.ok(
    new RegExp(`\\n {2}"?${flagId}"?:`).test(flagArt),
    `"${flagId}" has no flag drawing, so that country would show a globe instead`
  );
}

console.log(
  `check-country-picker: ${ids.length} countries, each named by its own pack and translated, `
  + "flying its own flag in the dialog, changed through the same dialog as a language, "
  + "ticked there, and routed to the country choice rather than the language course"
);
