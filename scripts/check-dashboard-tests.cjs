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
  "the dashboard names the streak rather than showing an unexplained day count",
  dashboard.includes('label={ui("Day streak")}')
    && dashboard.includes("uiNumber(stats.streak)")
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

if (failures) {
  console.error(`\n${failures} dashboard/test-library regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nDashboard clarity and Tests discovery are guarded");
