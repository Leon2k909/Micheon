#!/usr/bin/env node
/**
 * The sidebar reads as what is being studied, not as a list of pages.
 *
 * It is in three parts: a folding section per course with the flag of that
 * course on its heading, Beta listed flat below them, and Hidden apps on its
 * own at the foot.
 *
 * The part that is easy to get wrong later is which setting feeds which flag.
 * There are three, and they are not the same one: the app language names
 * every row, the course being learned picks the first flag, and the country
 * picks the second. Wiring the first flag to the interface language would
 * look right on a German speaker learning English and be wrong for everybody
 * else, so it is checked here rather than left to be noticed.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").split("\r\n").join("\n");
const shell = read("src/prototype/NewUiPrototype.tsx");
const prototypeCss = read("src/prototype/new-ui-prototype.css");
const css = read("src/prototype/new-ui-prototype.css");
const i18n = read("src/lib/i18n.ts")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + read("src/lib/i18nDe.ts");

// ── two folding sections, each with its own flag ───────────────────────────

// The five rows, in order: three destinations the nav
// already had, Speaking, which has nothing behind it yet and says so rather
// than being quietly left out, and Vocabulary.
//
// Vocabulary went in, came out — "hier muss das wortschatz weg" — and is back,
// because her standing brief for this section asks for it. What she saw the
// first time was a row that dropped her at the top of a long settings page to
// go looking for the tracker; it lands on the tracker itself now. Written down
// with the quote so the round trip is legible rather than looking like
// somebody could not make up their mind.
const languageBlock = /const LANGUAGE_SECTION_ROWS: LanguageRow\[\] = \[([\s\S]*?)\n\];/.exec(shell)?.[1] ?? "";
const languageOrder = [...languageBlock.matchAll(/kind: "(nav|view|soon)"[^\n]*?(?:id|label): "([^"]+)"/g)]
  .map((match) => match[2]);
assert.deepStrictEqual(
  languageOrder,
  ["learn", "practice", "listen", "Speaking", "Vocabulary library"],
  "language learning lists lessons, practice, listening, speaking and vocabulary, in that order"
);
assert.ok(
  // Any icon: which mark it wears is a drawing decision — her crop shows
  // letters in a box rather than the translate glyph — and pinning the name
  // here failed a change that left the behaviour below untouched.
  /kind: "view", icon: \w+, label: "Vocabulary library", view: "progress"/.test(languageBlock)
    && /onNavigate\(row\.view\); scrollToVocabularyLibrary\(\)/.test(shell)
    // The anchor class, whatever else rides along with it: this pins where the
    // jump LANDS, and it read className="np-vocabulary-anchor" with a closing
    // quote, so adding a utility class beside it failed a gate about
    // navigation. What that card's overflow is set to is check-tracker-
    // scrolling's business.
    && /className="np-vocabulary-anchor[^"]*"/.test(read("src/Gamification.tsx")),
  "vocabulary opens the tracker that already exists, and lands on it rather than near it"
);
assert.ok(
  /kind: "soon", icon: MessageCircleMore, label: "Speaking"/.test(languageBlock)
    && /className="is-soon"[\s\S]{0,220}ui\("Not built yet\."\)/.test(shell),
  "speaking is shown as not built yet, not wired to something it is not"
);
assert.ok(
  /className="np-nav-flag is-pressable"[\s\S]{0,400}onSwitchCourse\(\)/.test(shell),
  "pressing the flag opens the course picker rather than folding the section"
);
// The first brief's rule for this section was "Die Auswahl der Lernsprache
// erfolgt separat und nicht über dieses Dropdown", and it still holds: no row
// in the dropdown changes anything about the language. What she asked for
// afterwards was a way IN — "wenn man auf die flagge bei sprachen lernen
// tippt man dort die sprache ändern kann" — so the flag opens the separate
// picker that was already there. The choosing happens in that picker, not in
// this section, which is what the rule was protecting.
assert.ok(
  !languageBlock.includes("onSwitchCourse") && !languageBlock.includes("setActiveCourseId"),
  "no row inside the dropdown selects a language — the picker stays a separate place"
);
assert.ok(
  !/np-nav-group-items[\s\S]{0,1200}onSwitchCourse/.test(shell),
  "and nothing in the opened list reaches the picker either"
);
assert.ok(
  /aria-label=\{ui\("Change the language you are learning"\)\}/.test(shell)
    && /role="button"[\s\S]{0,200}np-nav-flag is-pressable/.test(shell),
  "and it is reachable and named, not a secret hotspot on a decoration"
);
assert.ok(
  /\.np-nav-flag\.is-pressable:hover/.test(css) && /\.np-nav-flag\.is-pressable:focus-visible/.test(css),
  "a flag you can press has to look pressable"
);
assert.ok(
  shell.includes(`<FlagRoundel id={courseFlagId} />`),
  "the language section's flag comes from the language being learned"
);
assert.ok(
  /courseFlagId=\{learningFlagId\(activeCourseId\)\}/.test(shell),
  "and it goes through learningFlagId — the raw course id is the wrong answer for half the people using this"
);

// ── the rule itself, run ───────────────────────────────────────────────────
//
// German and English are one course served both ways round. Two profiles can
// both have active-course "german" while one is learning English and the
// other German, and the DIRECTION is the only thing that says which. Reading
// the course id alone hands them the same flag, which is how a learner ended
// up looking at a globe where their flag should be.
{
  const store = new Map();
  const localStorageStub = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    key: (index) => [...store.keys()][index] ?? null,
    removeItem: (key) => void store.delete(key),
    setItem: (key, value) => void store.set(key, String(value)),
  };
  Object.defineProperty(localStorageStub, "length", { get: () => store.size });
  globalThis.window = {
    addEventListener() {},
    dispatchEvent() {},
    localStorage: localStorageStub,
    removeEventListener() {},
  };
  globalThis.localStorage = localStorageStub;
  globalThis.navigator = { language: "de-DE", languages: ["de-DE"] };
  globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
  globalThis.fetch = async () => ({ json: async () => ({ items: {} }), ok: true });

  const built = esbuild.buildSync({
    stdin: {
      contents: `export { learningFlagId } from "./src/lib/learningFlag.ts";
export { hasFlagArt } from "./src/components/course/FlagRoundel.tsx";
export { setLearningDirection } from "./src/lib/direction.ts";
export { setEnglishVariant } from "./src/lib/englishVariant.ts";`,
      resolveDir: root,
      sourcefile: "learning-flag-check-entry.ts",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    jsx: "transform",
    platform: "node",
    target: "node20",
    write: false,
    logLevel: "silent",
  });
  const compiled = new Module("learning-flag-check", module);
  compiled.filename = path.join(root, ".learning-flag-check.cjs");
  compiled.paths = Module._nodeModulePaths(root);
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  const { hasFlagArt, learningFlagId, setEnglishVariant, setLearningDirection } = compiled.exports;

  // Every finished course has art, or the roundel falls through to a globe.
  for (const id of ["german", "english-uk", "english-us", "spanish", "italian", "french"]) {
    assert.ok(hasFlagArt(id), `"${id}" has no drawn flag, so its heading would show a globe`);
  }

  setEnglishVariant("british");
  setLearningDirection("learn-de");
  assert.strictEqual(learningFlagId("german"), "german", "Leon learns German from the German course");
  assert.strictEqual(learningFlagId("english-uk"), "german", "...and still German if the pair is named the other way");

  setLearningDirection("learn-en");
  assert.strictEqual(learningFlagId("german"), "english-uk", "Michelle learns English from the same course");
  setEnglishVariant("american");
  assert.strictEqual(learningFlagId("german"), "english-us", "and the variant she chose is the flag she gets");
  setEnglishVariant("british");

  // French is the third reading of the same material, so it belongs to the
  // direction like the other two: the stored id may still say "german" on an
  // install that has been through the switcher, and the direction is what says
  // which language is actually being learned.
  setLearningDirection("learn-fr");
  assert.strictEqual(learningFlagId("german"), "french", "the French course flies the French flag");
  assert.strictEqual(learningFlagId("french"), "french", "...whichever of its two names is stored");

  setLearningDirection("learn-it");
  assert.strictEqual(learningFlagId("german"), "italian", "the Italian course flies the Italian flag");
  assert.strictEqual(learningFlagId("italian"), "italian", "...whichever of its two names is stored");

  setLearningDirection("learn-es");
  assert.strictEqual(learningFlagId("german"), "spanish", "the Spanish course flies the Spanish flag");
  assert.strictEqual(learningFlagId("spanish"), "spanish", "...whichever of its two names is stored");

  // A language course of its OWN — one that is not part of the reversible set
  // — names itself, whichever way the set is pointed. Dutch is only planned, so
  // it is nobody's direction and has nothing to follow; the day it becomes a
  // course it joins the block above instead and this line has to move. Italian
  // was the example here until it did exactly that.
  for (const direction of ["learn-de", "learn-en", "learn-fr", "learn-es", "learn-it"]) {
    setLearningDirection(direction);
    assert.strictEqual(learningFlagId("dutch"), "dutch", "Dutch is Dutch either way");
  }

  // And the two courses that are not languages never reach the globe.
  setLearningDirection("learn-en");
  assert.strictEqual(learningFlagId("csharp"), "english-uk", "the programming course falls back to the language");
  assert.strictEqual(learningFlagId("life-in-the-uk"), "english-uk", "so does the citizenship course");
  setLearningDirection("learn-de");
  assert.strictEqual(learningFlagId("csharp"), "german", "and it follows the direction when that changes");
}
// Country studies used to hold one country and fly its flag from a constant.
// It holds two now, so what is pinned is the shape that replaced it: the group
// head shows the SELECTED country's flag, each country row carries its own,
// and the sections sit under the country they belong to. A regression to one
// hard-coded flag fails here.
assert.ok(
  /<FlagRoundel id=\{countryPack\(countryId\)\.flagId/.test(shell),
  "the group head flies the flag of whichever country is selected"
);
assert.ok(
  shell.includes("COUNTRY_PACKS.map((entry)")
    && shell.includes("<FlagRoundel id={entry.flagId} />"),
  "every country is offered with its own flag"
);
// The choice is made AT the flag, not from a row in the list. The flag is a
// button that opens a menu, and the menu is what lists the countries.
assert.ok(
  /aria-label=\{ui\("Choose the country you are studying"\)\}/.test(shell)
    && /className="np-nav-flag is-pressable"/.test(shell)
    && shell.includes('aria-haspopup="menu"'),
  "the country studies flag is not a chooser you can press"
);
assert.ok(
  shell.includes('className="np-nav-country-picker" role="menu"')
    && shell.includes('role="menuitemradio"'),
  "the chooser is not a menu of countries with the current one marked"
);
// One list of sections, for whichever country is selected — not a set per
// country, which is what made the rail six rows deep before.
assert.ok(
  !/className=\{"np-nav-country-section"/.test(shell)
    && !shell.includes("{selected && UK_SECTIONS.map((section)"),
  "the per-country section rows are back, which is the nesting she asked to remove"
);
// The filter in the middle is the learner's own hiding — each of these rows
// can be dragged into Hidden apps on its own — so what is pinned here is that
// the rows still come from ONE list of sections, not that nothing stands
// between that list and the map.
assert.ok(
  /\{UK_SECTIONS(\.filter\([^\n]*\))?\.map\(\(section\) => \{/.test(shell),
  "the group no longer lists the selected country's sections at all"
);
// Opened menus have to be closable, or they strand themselves over the rail.
assert.ok(
  /if \(event\.key === "Escape"\) setCountryMenuOpen\(false\)/.test(shell)
    && /closest\?\.\(".np-nav-country-picker"\)/.test(shell),
  "the country chooser cannot be dismissed by Escape or by clicking away"
);
assert.ok(
  /const COUNTRY_STUDIES_FALLBACK_FLAG_ID = "english-uk"/.test(shell),
  "a pack without a flag still falls back to one rather than rendering nothing"
);
assert.ok(
  /ui\("Language learning"\)/.test(shell) && /ui\("Country studies"\)/.test(shell),
  "both headings are translated, so they follow the app language"
);
for (const key of ["Language learning", "Country studies", "Hidden apps"]) {
  assert.ok(
    i18n.includes(`"${key}":`),
    `"${key}" needs German, or the heading shows in English on a German app`
  );
}

// ── the four halves of the country course ──────────────────────────────────

const ukBlock = /const UK_SECTIONS[\s\S]*?\n\];/.exec(shell)?.[0] ?? "";
for (const [label, tab] of [["Lessons", "learn"], ["Practice", "practice"], ["Tests", "exam"], ["Timeline", "timeline"]]) {
  assert.ok(
    new RegExp(`label: "${label}", tab: "${tab}"`).test(ukBlock),
    `country studies opens ${label} on the course's own "${tab}" tab`
  );
}
assert.ok(
  /onOpenUkSection=\{\(tab, country\) => \{/.test(shell)
    && /setUkTab\(tab\);/.test(shell)
    && /navigate\("life-in-uk"\);/.test(shell),
  "a country row switches the course's existing tab rather than introducing a second way in"
);
assert.ok(
  /if \(country && country !== countryId\) \{[\s\S]*?setCountryId\(country\);[\s\S]*?setUkLessonId\(undefined\);/.test(shell),
  "switching country clears the open lesson, whose id does not exist in the other course"
);
assert.ok(
  /activeView === "life-in-uk" && ukTab === section\.tab/.test(shell),
  "the row for the open half is the one marked as current"
);

// ── the sections fold, and remember ────────────────────────────────────────

assert.ok(/aria-expanded=\{groups\.languages\}/.test(shell), "the heading says whether it is open");
assert.ok(/aria-expanded=\{groups\.country\}/.test(shell), "both headings do");
assert.ok(
  /saveScopedJson\(NAV_GROUPS_KEY, next, profile\)/.test(shell),
  "folding a section is remembered, per profile"
);
assert.ok(
  /!groups\.languages && languageItems\.some\(\(item\) => item\.id === activeView\)/.test(shell),
  "a folded section still shows that the page you are on is inside it"
);

// ── Beta folds too, and the way back stays at the foot ─────────────────────

// It was a violet "Beta" pill, which read as a warning label rather than a
// place to go. The pill is gone and the section is now set in the same type as
// the headings above it — but by its own name. The section is called "Beta";
// the only change wanted was to drop the word "Kategorie" in front of it.
// Renaming it "Extras" went further than that.
// Both the badge class and its stylesheet rule stay gone, so this pins the
// absence too — a reintroduced pill would put the rail back to two kinds of
// heading without anything failing.
assert.ok(
  /<span>\{ui\("Beta"\)\}<\/span>/.test(shell),
  "the section reads Beta, in the same heading type as the sections above it"
);
assert.ok(
  !/np-nav-section-badge/.test(shell) && !/np-nav-section-badge/.test(prototypeCss),
  "the violet section pill is gone from both the markup and the stylesheet"
);
// The first brief said Beta should not fold "vorerst". That was lifted —
// "kannst du das auch als drop down menü machen?" — so all three sections
// fold now, and the badge that marked the section is the control.
assert.ok(
  /aria-expanded=\{groups\.beta\}/.test(shell)
    && /\{groups\.beta && \(/.test(shell),
  "Extras folds from its heading like the two sections above it"
);
assert.ok(
  /stored\?\.beta !== false/.test(shell),
  "and starts open, remembered per profile like the others"
);
assert.ok(
  /!groups\.beta && betaItems\.some\(\(item\) => item\.id === activeView\)/.test(shell),
  "a folded Beta still shows that the page you are on is inside it"
);
assert.ok(
  /np-nav-footer[\s\S]*?ui\("Hidden apps"\)/.test(shell),
  "hidden apps sit in the separated footer"
);
// More is not one of the rail's entries, so it is not there —
// which leaves the drag that used to land on it needing somewhere to go. It
// lands on the row that lists what it put away, which is where it was headed.
assert.ok(
  !/onNavigate\(moreItem\.id\)/.test(shell) && !/const moreItem =/.test(shell),
  "the rail lists what Michelle asked for and nothing else"
);
assert.ok(
  /className=\{`np-nav-hidden-toggle\${dropTarget === "more" \? " is-drop-target" : ""}`\}/.test(shell),
  "dragging a destination onto Hidden apps must show that it will land there"
);

// ── it fits the rail it lives in ───────────────────────────────────────────
//
// A grid track is min-content wide unless told otherwise. The heading's three
// columns — flag, title, chevron — would not fit the sidebar at its narrow
// end, and pushed a horizontal scrollbar through the whole rail before this
// was measured in the running app.
for (const columns of [
  "grid-template-columns: 42px minmax(0, 1fr);",
  "grid-template-columns: 36px minmax(0, 1fr) auto;",
  "grid-template-columns: 30px minmax(0, 1fr);",
]) {
  assert.ok(
    css.includes(columns),
    `the rail needs "${columns}" — a bare 1fr is min-content wide, and a long label widens the sidebar instead of fitting it`
  );
}
// Her four crops hang nothing off the left: a section's rows sit flush under
// its heading, their icons in the same column as the flag above them. The
// guide line and indent here were my reasoning, not hers, and side by side
// they were the thing that still looked unlike her drawing.
assert.ok(
  !/\.np-nav-group-items \{[^}]*border-left/.test(css),
  "a section's rows sit flush under its heading — no rule hanging down the left"
);
assert.ok(
  !/\.np-nav-group-items \{[^}]*margin-left:\s*[1-9]/.test(css),
  "and they are not indented away from it"
);
assert.ok(
  /\.np-nav-group \+ \.np-nav-group \{[^}]*border-top/.test(css),
  "and the two sections are ruled apart"
);
// Home is a row, not a section, so the rule above it never covered the join
// between the two: it sat flush on the first heading, the one division down
// the rail that was not drawn.
assert.ok(
  /\.np-side-nav > button \+ \.np-nav-group \{[^}]*border-top/.test(css),
  "and Home is ruled off from the first section below it"
);
assert.ok(
  /\.np-nav-footer \{[^}]*border-top/.test(css),
  "as is the footer from the sections above it"
);

console.log(
  "check-sidebar-sections: two folding sections with the right flag each, "
  + "the country course's four halves, Beta flat, hidden apps at the foot, and it all fits the rail"
);
