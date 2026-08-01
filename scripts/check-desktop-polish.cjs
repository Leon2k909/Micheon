const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const electronMain = read("electron/main.js");
const prototype = read("src/prototype/NewUiPrototype.tsx");
const styles = read("src/prototype/new-ui-prototype.css");
const mastery = read("src/components/lab/MasteryCard.tsx");
const readme = read("README.md");

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

check("course progress is exposed as a progressbar", prototype.includes('role="progressbar"') && prototype.includes("aria-valuenow={pct}"));
check("course progress animates from empty", prototype.includes("<motion.span") && prototype.includes("scaleX: pct / 100") && prototype.includes("scaleX: 0"));
check("course progress respects reduced-motion preferences", prototype.includes("const reduceMotion = useReducedMotion();") && prototype.includes("initial={reduceMotion ? false"));
check("search focus uses one clean outer ring", styles.includes(".np-search-field:focus-within") && styles.includes(".np-search-field input:focus-visible"));
check("the search input suppresses the nested browser outline", styles.includes("outline: 0 !important;") && styles.includes("box-shadow: none !important;"));
check("the hero progress bar has a dimensional orange gradient", styles.includes("#ffe16a 0%, #ffc43b 52%, #ff9f1f 100%") && styles.includes(".np-progress-track--hero > span::after"));
check("the mastery ring halo always has a valid radius", mastery.includes('r={dotR * 1.1}'));

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
