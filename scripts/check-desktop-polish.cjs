const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const electronMain = read("electron/main.js");
const app = read("src/App.tsx");
const appStyles = read("src/index.css");
const guidedSession = read("src/GuidedSession.tsx");
const prototype = read("src/prototype/NewUiPrototype.tsx");
const styles = read("src/prototype/new-ui-prototype.css");
const theme = read("src/lib/theme.ts");
const mastery = read("src/components/lab/MasteryCard.tsx");
const learnView = read("src/components/lab/LearnView.tsx");
const testsView = read("src/components/tests/TestsView.tsx");
const readme = read("README.md");
const primaryNavigation = (/const NAVIGATION:[\s\S]*?\n\];/.exec(prototype) || [""])[0];
const petReassertion = (/function reassertPetSurfacesAfterAppDeactivation\(\)[\s\S]*?^}/m.exec(electronMain) || [""])[0];

let failures = 0;

function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }

  failures += 1;
  console.error(`FAIL ${name}`);
}

function pngSize(relativePath) {
  const file = fs.readFileSync(path.join(root, relativePath));
  const signature = file.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") return null;
  return {
    bytes: file.length,
    height: file.readUInt32BE(20),
    width: file.readUInt32BE(16),
  };
}

check("Electron imports the native Menu API", /import \{[^}]*\bMenu\b[^}]*\} from "electron";/.test(electronMain));
check("desktop text selections open a context menu", electronMain.includes('window.webContents.on("context-menu"'));
check("the desktop context menu supports Copy", electronMain.includes('{ role: "copy"'));
check("editable fields receive the standard editing actions", ["undo", "redo", "cut", "paste", "selectAll"].every((role) => electronMain.includes(`role: "${role}"`)));
check("custom non-text right-click controls stay untouched", electronMain.includes("if (!params.isEditable && !hasSelection) return;"));
check("the text menu is installed on the main app window", electronMain.includes("installTextContextMenu(mainWindow);"));
check("pet overlays use the highest supported ordinary Windows window level", electronMain.includes('process.platform === "win32" ? "screen-saver" : "floating"'));
check("pet overlays reassert their z-order after Micheon deactivates", electronMain.includes('mainWindow.on("blur", reassertPetSurfacesAfterAppDeactivation)') && electronMain.includes('mainWindow.on("minimize", reassertPetSurfacesAfterAppDeactivation)'));
check("pet z-order recovery is bounded rather than a permanent polling loop", petReassertion.includes("for (const delay of [80, 700])") && petReassertion.includes("setTimeout") && !petReassertion.includes("setInterval"));

check("course progress is exposed as a progressbar", prototype.includes('role="progressbar"') && prototype.includes("aria-valuenow={pct}"));
check("course progress animates from empty", prototype.includes("<motion.span") && prototype.includes("scaleX: pct / 100") && prototype.includes("scaleX: 0"));
check("course progress respects reduced-motion preferences", prototype.includes("const reduceMotion = useReducedMotion();") && prototype.includes("initial={reduceMotion ? false"));
check("search focus uses one clean outer ring", styles.includes(".np-search-field:focus-within") && styles.includes(".np-search-field input:focus-visible"));
check("the search input suppresses the nested browser outline", styles.includes("outline: 0 !important;") && styles.includes("box-shadow: none !important;"));
check("lesson-library search uses one focused border", learnView.includes('className="learn-library-search ') && /learn-library-search:focus-visible\s*\{[^}]*outline:\s*0;/s.test(styles));
check("light test cards define the yellow icon tile treatment", testsView.includes("bg-[var(--yellow-dim)]") && /\.np-feature-host\s*\{[^}]*--yellow-dim:\s*#fff1c7;[^}]*--yellow-ink:\s*#986000;/s.test(styles));
check("the hero progress bar uses a labelled mint-on-green treatment", prototype.includes(">Level progress<") && styles.includes("#f5fff6 0%, #dff8e4 100%") && !styles.includes("#fff2a6 0%, #ffdc63 55%, #f6c746 100%") && styles.includes(".np-progress-track--hero > span::after"));
check("the mastery ring halo always has a valid radius", mastery.includes('r={dotR * 1.1}'));
check("the mastery ring halo has a defined first animation frame", mastery.includes('initial={reduce ? false : { r: dotR * 1.1, opacity: 0.55 }}'));
check("the mastery percentage uses its real progress ring on a light tile", /\.np-feature-host \.mastery-ring > svg\s*\{[^}]*display:\s*block;/s.test(styles) && /\.np-feature-host \.mastery-ring::after\s*\{[^}]*display:\s*none;/s.test(styles) && styles.includes("linear-gradient(145deg, #fdfff9 0%, #edf8e8 100%)"));
check("the prototype title bar is one uninterrupted surface", appStyles.includes("background: #fffaf1;") && appStyles.includes(".titlebar--prototype::after") && appStyles.includes("content: none;"));
check("the prototype title bar carries no separator shadow", /\.titlebar--prototype\s*\{[^}]*box-shadow:\s*none;/s.test(appStyles));
check("small prototype type uses the Windows text-optimised face", styles.includes('--np-font-text: "Segoe UI Variable Text"') && /\.new-ui-prototype\s*\{[^}]*font-family:\s*var\(--np-font-text\);/s.test(styles));
check("display type stays reserved for headings and actions", styles.includes(".new-ui-prototype strong,") && styles.includes("font-family: var(--np-font-display);"));
check("small prototype type has a readable desktop scale", styles.includes("--np-type-micro: 12px;") && styles.includes("--np-type-caption: 13px;") && styles.includes("--np-type-small: 14px;"));
check("the production sidebar stays pinned to the viewport on long pages", /\.np-sidebar\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*height:\s*var\(--app-h,\s*100dvh\);/s.test(styles));
check("the sidebar resize handle stays centered in the visible app height", /\.np-sidebar-resizer::after\s*\{[^}]*top:\s*50%;/s.test(styles));
check("the production shell does not trap sticky navigation in hidden overflow", styles.includes("overflow-x: clip;") && /\.np-window\s*\{[^}]*overflow:\s*clip;/s.test(styles));
check("Tests and Grammar live inside Practice instead of the primary sidebar", prototype.includes("function PracticeHub") && prototype.includes('label: "Tests"') && prototype.includes('label: "Grammar"') && !primaryNavigation.includes('id: "tests"') && !primaryNavigation.includes('id: "grammar"'));
check("the retired dashboard switch is not shipped", !prototype.includes("Need the original dashboard") && !app.includes("legacy-dashboard") && !app.includes("guided-theme"));
check("existing installs migrate once to the finished light theme", theme.includes('const LIGHT_DEFAULT_MIGRATION_KEY = "micheon-light-default-v1"') && theme.includes('localStorage.setItem(KEY, "light")') && app.indexOf("await hydrateLocalStorageFromSharedStorage()") < app.indexOf("migrateToLightThemeDefault()"));
check("the prototype guided lesson uses the homepage scene as a restrained focus backdrop", /prototype-guided-session::before\s*\{[^}]*micheon-hero-v3\.webp[^}]*140% auto no-repeat[^}]*opacity:\s*0\.18;[^}]*mask-image:/s.test(appStyles) && /prototype-guided-session::after\s*\{[^}]*rgba\(255,\s*251,\s*244,\s*0\.97\)/s.test(appStyles));
check("light lesson grading controls keep readable hover colours", /prototype-guided-session \.grade-btn-known:hover:not\(:disabled\)[\s\S]*?color:\s*#206c30;/s.test(appStyles) && /prototype-guided-session \.grade-btn-struggle:hover:not\(:disabled\)[\s\S]*?color:\s*#3e3d39;/s.test(appStyles));
check("the prototype guided lesson gets a wider learning canvas", /\.guided-session\.fs-app\.prototype-guided-session main > div\s*\{[^}]*max-width:\s*72rem;/s.test(appStyles));
check("the lesson preview has its own focused surface", guidedSession.includes('inPreview && "fs-card--preview"'));
check("the lesson preview reuses the lightweight homepage course scene", appStyles.includes('url("./prototype/assets/micheon-hero-v3.webp")'));
check("the lesson preview exposes useful phrase and language context", guidedSession.includes('className="fs-preview-summary"') && guidedSession.includes('{cards.length} {ui("Phrases")}'));
check("the lesson preview uses tactile numbered route steps", /prototype-guided-session \.fs-preview-route button\s*\{[^}]*height:\s*38px;[^}]*color:\s*#77786f;/s.test(appStyles));
check("the lesson preview card has a stable content and helper hierarchy", guidedSession.includes('className="fs-flashcard-content"') && guidedSession.includes('className="fs-flashcard-footer"'));
check("the redesigned lesson preview has narrow-screen composition rules", /@media \(max-width: 600px\)\s*\{[^}]*prototype-guided-session main\s*\{[^}]*padding:\s*14px;/s.test(appStyles));

const screenshotPaths = [
  "docs/screenshots/micheon-home.png",
  "docs/screenshots/micheon-guided-lesson.png",
  "docs/screenshots/micheon-lessons.png",
  "docs/screenshots/micheon-games.png",
];

check("the README displays Micheon's app logo", readme.includes('<img src="public/icon.png" alt="Micheon logo"'));
check("the README love line appears once", (readme.match(/Made with love ❤️ by Leon and Michelle\./g) || []).length === 1);
check("the README references every showcase screenshot", screenshotPaths.every((relativePath) => readme.includes(relativePath)));
check("all showcase screenshots are real, full-size PNGs", screenshotPaths.every((relativePath) => {
  const size = pngSize(relativePath);
  return size && size.width >= 1200 && size.height >= 700 && size.bytes > 100_000;
}));

const socialPreview = pngSize("docs/micheon-social-preview.png");
check("the GitHub social preview uses the recommended 1280x640 canvas", socialPreview?.width === 1280 && socialPreview?.height === 640);
check("the GitHub social preview stays below GitHub's 1 MB limit", Boolean(socialPreview && socialPreview.bytes < 1_000_000));

if (failures) {
  console.error(`\n${failures} desktop-polish regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nDesktop polish and repository showcase are guarded");
