#!/usr/bin/env node
/**
 * The sidebar reads as what is being studied, not as a list of pages.
 *
 * Michelle asked for it in three parts: a folding section per course with the
 * flag of that course on its heading — "[Flagge] Sprachen lernen ▾" — Beta
 * listed flat below them, and "Ausgeblendete Apps" on its own at the foot.
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

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").split("\r\n").join("\n");
const shell = read("src/prototype/NewUiPrototype.tsx");
const css = read("src/prototype/new-ui-prototype.css");
const i18n = read("src/lib/i18n.ts");

// ── two folding sections, each with its own flag ───────────────────────────

// The five rows Michelle listed, in her order. Three are destinations the nav
// already had; Vocabulary reaches the tracker that has always been on the
// profile page; Speaking has nothing behind it yet and says so rather than
// being quietly left out of the section.
const languageBlock = /const LANGUAGE_SECTION_ROWS: LanguageRow\[\] = \[([\s\S]*?)\n\];/.exec(shell)?.[1] ?? "";
const languageOrder = [...languageBlock.matchAll(/kind: "(nav|view|soon)"[^\n]*?(?:id|label): "([^"]+)"/g)]
  .map((match) => match[2]);
assert.deepStrictEqual(
  languageOrder,
  ["learn", "practice", "listen", "Speaking", "Vocabulary library"],
  "language learning lists lessons, practice, listening, speaking and vocabulary, in that order"
);
assert.ok(
  /kind: "view", icon: Languages, label: "Vocabulary library", view: "profile"/.test(languageBlock),
  "vocabulary opens the page the tracker already lives on rather than a new one"
);
assert.ok(
  /kind: "soon", icon: MessageCircleMore, label: "Speaking"/.test(languageBlock)
    && /className="is-soon"[\s\S]{0,220}ui\("Not built yet\."\)/.test(shell),
  "speaking is shown as not built yet, not wired to something it is not"
);
assert.ok(
  shell.includes(`<FlagRoundel id={courseFlagId} />`),
  "the language section's flag comes from the course being learned"
);
assert.ok(
  /courseFlagId=\{activeCourseId\}/.test(shell),
  "and courseFlagId is the active course — not the interface language, which is a separate setting"
);
assert.ok(
  shell.includes(`<FlagRoundel id={COUNTRY_STUDIES_FLAG_ID} />`)
    && /const COUNTRY_STUDIES_FLAG_ID = "english-uk"/.test(shell),
  "country studies flies the flag of the country it covers"
);
assert.ok(
  /ui\("Language learning"\)/.test(shell) && /ui\("Country studies"\)/.test(shell),
  "both headings are translated, so they follow the app language"
);
for (const key of ["Language learning", "Country studies", "Beta category", "Hidden apps"]) {
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
  /onOpenUkSection=\{\(tab\) => \{ setUkTab\(tab\); navigate\("life-in-uk"\); \}\}/.test(shell),
  "a country row switches the course's existing tab rather than introducing a second way in"
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

// ── Beta stays flat, and the way back stays at the foot ────────────────────

assert.ok(
  /ui\("Beta category"\)[\s\S]{0,120}np-nav-section-badge/.test(shell),
  "Beta is a labelled heading with its badge, not a third folding section"
);
assert.ok(
  !/groups\.beta/.test(shell),
  "Beta does not fold — Michelle asked for its entries to stay visible"
);
assert.ok(
  /np-nav-footer[\s\S]*?ui\("Hidden apps"\)/.test(shell),
  "hidden apps sit in the separated footer"
);
// More is not one of the entries Michelle listed, so it is not in the rail —
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
assert.ok(
  /\.np-nav-group-items \{[^}]*border-left/.test(css),
  "the rows under a heading are hung off a line, so they read as belonging to it"
);
assert.ok(
  /\.np-nav-group \+ \.np-nav-group \{[^}]*border-top/.test(css),
  "and the two sections are ruled apart"
);
assert.ok(
  /\.np-nav-footer \{[^}]*border-top/.test(css),
  "as is the footer from the sections above it"
);

console.log(
  "check-sidebar-sections: two folding sections with the right flag each, "
  + "the country course's four halves, Beta flat, hidden apps at the foot, and it all fits the rail"
);
