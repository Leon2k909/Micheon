const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const prototype = read("src/prototype/NewUiPrototype.tsx");
const dashboardArtwork = [
  "src/prototype/assets/micheon-hero-v3.webp",
  "src/prototype/assets/achievements-v1/achievement-atlas-v3.webp",
  "src/prototype/assets/rewards-v3/backpack.webp",
  "src/prototype/assets/rewards-v3/flame.webp",
  "src/prototype/assets/rewards-v3/heart.webp",
  "src/prototype/assets/rewards-v3/star.webp",
  "src/prototype/assets/rewards-v3/trophy.webp",
];

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const staticImports = prototype
  .split(/\r?\n/)
  .filter((line) => /^import\s/.test(line));

check(
  "the dashboard does not statically import the full lesson catalogue",
  !staticImports.some((line) => /@\/lib\/(data|contentBank|curriculum|customContent|api)/.test(line)),
);
check(
  "lesson data is requested only after a catalogue feature is opened",
  prototype.includes("function usePrototypeParts(requested: boolean)")
    && prototype.includes('import("@/lib/data")')
    && prototype.includes('import("@/lib/contentBank")')
    && prototype.includes("const [partsRequested, setPartsRequested] = useState(false)"),
);
check(
  "global search explicitly requests the lesson catalogue",
  prototype.includes("onSearchOpen={() => setPartsRequested(true)}")
    && prototype.includes("searchCatalogLoading={partsRequested && !partsReady}"),
);
check(
  "large feature views are split behind React lazy boundaries",
  ["Gamification", "LearnView", "TestsView", "GamesView", "ClozeTabContent", "GrammarTabContent"]
    .every((moduleName) => prototype.includes(`lazy(() => import(`) && prototype.includes(moduleName)),
);
check(
  "lazy feature views have an accessible loading surface",
  prototype.includes("<Suspense fallback={<FeatureLoading />}")
    && prototype.includes('aria-label="Loading learning content"'),
);
check(
  "the course hero remains the intentional high-priority image",
  prototype.includes('fetchPriority="high"')
    && prototype.includes('decoding="async"')
    && prototype.includes('height={724}')
    && prototype.includes('width={2172}'),
);
check(
  "homepage artwork uses efficient WebP assets",
  dashboardArtwork.every((file) => fs.existsSync(path.join(root, file)))
    && !/^import .*assets\/.+\.png";/m.test(prototype),
);
check(
  "homepage artwork stays within its startup transfer budget",
  dashboardArtwork.reduce((total, file) => total + fs.statSync(path.join(root, file)).size, 0) < 300_000,
);
check(
  "the main navigation uses lightweight progress maths",
  prototype.includes('@/lib/gamificationProgress'),
);

if (failures) {
  console.error(`\n${failures} startup performance regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nThe prototype dashboard keeps heavy lesson and feature modules out of startup");
