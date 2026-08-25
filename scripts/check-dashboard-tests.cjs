const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dashboard = fs.readFileSync(
  path.join(root, "src/prototype/NewUiPrototype.tsx"),
  "utf8"
);
const testsView = fs.readFileSync(
  path.join(root, "src/components/tests/TestsView.tsx"),
  "utf8"
);

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

check(
  // Formatted through uiNumber now rather than a bare toLocaleString, which
  // followed the machine's locale and wrote an English dashboard's totals the
  // German way — "18.935 XP" where an English reader expects "18,935".
  // The figure is days learned rather than days in a row: a streak reads 0 the
  // morning after one missed evening and erases the months behind it, which is
  // the opposite of what a dashboard opening with a greeting should say.
  "the dashboard names its day count rather than showing an unexplained number",
  dashboard.includes('label={ui("Days learned")}')
    && dashboard.includes("uiNumber(stats.learningDays)")
);
check(
  "the retired schedule is absent from the main dashboard",
  !dashboard.includes("My schedule")
);
check(
  "Tests and Grammar are grouped inside Practice instead of the sidebar",
  dashboard.includes('function PracticeHub')
    && dashboard.includes('label: ui("Tests")')
    && dashboard.includes('label: ui("Grammar")')
    && !/const NAVIGATION:[\s\S]*?\];/.exec(dashboard)?.[0].includes('id: "tests"')
    && !/const NAVIGATION:[\s\S]*?\];/.exec(dashboard)?.[0].includes('id: "grammar"')
);
check(
  "the Tests library has an accessible search field",
  testsView.includes('aria-label={ui("Search test types")}')
    && testsView.includes('placeholder={ui("Search test types…")}')
    && testsView.includes('type="search"')
    && testsView.includes("matchesTestSearch(preset, testSearch)")
);
check(
  "test search covers the title, description, category and translated labels",
  testsView.includes("[preset.title, preset.description, preset.eyebrow]")
    && testsView.includes(".flatMap((value) => [value, ui(value)])")
);
check(
  "the Tests library exposes all, practice, exam and advanced filters",
  [
    '{ id: "all", label: "All tests" }',
    '{ id: "practice", label: "Practice" }',
    '{ id: "exam", label: "Exams" }',
    '{ id: "advanced", label: "Advanced" }',
  ].every((fixture) => testsView.includes(fixture))
    && testsView.includes('role="group"')
    && testsView.includes('aria-pressed={libraryFilter === filter.id}')
);
check(
  "only matching test cards render and a clear empty state remains",
  testsView.includes("{visiblePresets.map((preset) => (")
    && !testsView.includes("{PRESETS.map((preset) => (")
    && testsView.includes("visiblePresets.length === 0")
    && testsView.includes('setLibraryFilter("all")')
    && testsView.includes('setTestSearch("")')
);

// ── the progress panel folds ──────────────────────────────────────────────
//
// It folds the way the sidebar's sections do: the whole panel from its own
// heading, and the two blocks inside that have headings of their own on
// their own on their own. The trap is the achievements heading, which already
// held a "View all" button — folding from it would have put a button inside a
// button, which is invalid and which screen readers flatten.
//
// The progress screen is the exception. The panel IS the page there, with
// nothing beside it to hand the width back to, so the heading is only a
// heading and the content is always open.
check(
  "the panel folds from its own heading",
  /aria-expanded=\{sections\.panel\}/.test(dashboard)
    && /className="np-progress-title"/.test(dashboard)
    && /\{panelOpen && \(/.test(dashboard)
    && /const panelOpen = standalone \|\| sections\.panel;/.test(dashboard)
);
check(
  "on its own screen it does not fold, and its heading is not a control",
  dashboard.includes('<div className="np-progress-title">{heading}</div>')
);
check(
  "achievements and recently-completed fold on their own",
  /aria-expanded=\{sections\.achievements\}/.test(dashboard)
    && /aria-expanded=\{sections\.recent\}/.test(dashboard)
    && /\{sections\.achievements && \(/.test(dashboard)
    && /\{sections\.recent && recentSessions\.map/.test(dashboard)
);
check(
  "the fold control and View all are siblings, not one inside the other",
  /<button\s+aria-expanded=\{sections\.achievements\}[\s\S]{0,400}<\/button>\s*\{standalone \?/.test(dashboard)
    && !/np-block-toggle[^>]*>[\s\S]{0,200}onClick=\{onViewAllAchievements\}/.test(dashboard)
);
// Sideways, not downwards: it folds to the side rather than collapsing from
// top to bottom. Folded, the column hands its
// width back to the page and keeps a 58px rail with the heading turned on its
// side, so the thing you press to get it back still says what it is.
const dashboardCss = fs.readFileSync(
  path.join(root, "src/prototype/new-ui-prototype.css"),
  "utf8"
);
check(
  "folding it closes the column sideways rather than collapsing it downwards",
  /\.np-content-grid:has\(\.np-progress-panel\.is-folded\) \{[^}]*grid-template-columns: minmax\(0, 1fr\) 58px/.test(dashboardCss)
);
check(
  "the folded rail keeps its heading readable, turned on its side",
  /\.np-progress-panel\.is-folded \.np-progress-title h2 \{[^}]*writing-mode: vertical-rl/.test(dashboardCss)
);
// Full bleed on its own screen: the column it sits in, the same width as the
// header above it, rather than a narrow card floating in the middle of it.
check(
  "the progress screen fills its column rather than sitting in the middle of it",
  !/\.np-progress-panel--standalone \{[^}]*max-width/.test(dashboardCss)
    && !/\.np-progress-extras \{[^}]*max-width/.test(dashboardCss)
);
check(
  "the arrow points the way the panel will move, by swapping icon rather than rotating one",
  /sections\.panel[\s\S]{0,40}<ChevronRight[\s\S]{0,140}<ChevronLeft/.test(dashboard)
);

check(
  "how it was left is remembered, per profile",
  /saveScopedJson\(PROGRESS_SECTIONS_KEY, next, profile\)/.test(dashboard)
    && /stored\?\.panel !== false/.test(dashboard)
);

// A pack fills the topic field with a whole lesson headline rather than the
// two or three words it was built for, and the line sat bare under the
// instruction in the same weight and colour: on a card whose job is
// translating German sentences, an unlabelled German sentence is a question.
check(
  "the sentence says which lesson it came from, rather than printing the name bare",
  (() => {
    const label = testsView.indexOf('ui("Lesson")');
    const topic = testsView.indexOf("currentQuestion.item.topic");
    return label >= 0 && topic > label && topic - label < 260;
  })()
);

if (failures) {
  console.error(`\n${failures} dashboard/test-library regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nDashboard clarity and Tests discovery are guarded");
