const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export {
        normalizeCatalogSearchText,
        buildCatalogSearchText,
        catalogItemMatchesQuery,
      } from "./src/lib/catalogSearch.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";
      export { buildCatalog } from "./src/session.ts";
      export { toSpokenGerman, toTextedGerman } from "./src/lib/spokenGerman.ts";
    `,
    resolveDir: root,
    sourcefile: "catalog-search-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("catalog-search-check", module);
compiled.filename = path.join(root, ".catalog-search-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  normalizeCatalogSearchText,
  buildCatalogSearchText,
  catalogItemMatchesQuery,
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildCatalog,
  toSpokenGerman,
  toTextedGerman,
} = compiled.exports;

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const fullCatalog = buildCatalog({
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
});

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// The catalogue is built in the default Conversation mode, which now teaches
// the spoken ich-form ("Ich glaub nicht, dass…"). This check is about the
// corrected ENGLISH still being present and searchable, so the German is only
// a lookup key — match it in either form rather than pinning the spelling.
const reportedGerman = "Ich glaube nicht, dass es gut für dich ist, ihn zu sehen.";
const reportedSpoken = toTextedGerman(toSpokenGerman(reportedGerman));
const reported = fullCatalog.find((item) => item.de === reportedGerman || item.de === reportedSpoken);

check(
  "the corrected sentence is present in the full shipped catalog",
  Boolean(reported),
  `catalog contains ${fullCatalog.length.toLocaleString("en-GB")} items`
);

if (reported) {
  check(
    "the catalog search text contains the corrected natural English",
    normalizeCatalogSearchText(buildCatalogSearchText(reported)).includes(
      "i dont think its good for you to see him"
    ),
    reported.en
  );

  const matchingQueries = [
    "i dont think",
    "I don't think it's good for you to see him.",
    "I don’t think it’s good for you to see him!",
    "dont think—its good for you, to see him",
  ];
  for (const query of matchingQueries) {
    check(
      `punctuation/apostrophe-insensitive search finds: ${query}`,
      catalogItemMatchesQuery(reported, query)
    );
  }

  check(
    "an unrelated sentence does not match the corrected item",
    !catalogItemMatchesQuery(reported, "the cave entrance is behind the waterfall")
  );
}

const sharpSItem = fullCatalog.find((item) => item.de === "Ich weiß, dass ich ohne dich nicht leben kann." || item.de === toTextedGerman(toSpokenGerman("Ich weiß, dass ich ohne dich nicht leben kann.")));
check("the ß regression fixture is present", Boolean(sharpSItem));
if (sharpSItem) {
  check(
    "ss keyboard input finds German ß",
    catalogItemMatchesQuery(sharpSItem, "ich weiss dass ich ohne dich nicht leben kann")
  );
}

const umlautItem = fullCatalog.find((item) => item.de === "Ich wünschte, ich könnte das so gut wie du." || item.de === toTextedGerman(toSpokenGerman("Ich wünschte, ich könnte das so gut wie du.")));
check("the umlaut regression fixture is present", Boolean(umlautItem));
if (umlautItem) {
  check(
    "plain-keyboard input finds German umlauts",
    catalogItemMatchesQuery(umlautItem, "ich wunschte ich konnte das so gut wie du")
  );
  check(
    "ae/oe/ue keyboard input finds German umlauts",
    catalogItemMatchesQuery(umlautItem, "ich wuenschte ich koennte das so gut wie du")
  );
}

if (reported) {
  const apostropheFreeMatches = fullCatalog.filter((item) =>
    catalogItemMatchesQuery(item, "i dont think its good for you to see him")
  );
  check(
    "filtering the full catalog returns the corrected item",
    apostropheFreeMatches.some((item) => item.id === reported.id),
    `matched ${apostropheFreeMatches.length} item(s)`
  );
}

const trackerSource = fs.readFileSync(
  path.join(root, "src/components/lab/VocabTracker.tsx"),
  "utf8"
);
check(
  // Still the guarded path, but the text is now derived per item on demand:
  // building all 16k entries up front was three quarters of the time spent
  // opening the library, and none of it was needed until someone searched.
  "the tracker filters the full catalog through the guarded search path",
  trackerSource.includes("catalogItemMatchesQuery(item, q, searchTextFor(item))")
    && trackerSource.includes("text = buildCatalogSearchText(")
);
check(
  "the search index is built lazily, not while the library is opening",
  trackerSource.includes("const searchIndex = new Map<CatalogItem, string>();")
    && !trackerSource.includes("new Map(catalog.map((item) => [item, buildCatalogSearchText(item)]))")
);

const learnViewSource = fs.readFileSync(
  path.join(root, "src/components/lab/LearnView.tsx"),
  "utf8"
);
check(
  "lesson-library search uses the same punctuation-tolerant normalizer",
  learnViewSource.includes("buildCatalogSearchText([")
    && learnViewSource.includes("normalizeCatalogSearchText(query)")
);

if (failures) {
  console.error(`\n${failures} catalog-search regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\nCatalog search passed against ${fullCatalog.length.toLocaleString("en-GB")} shipped items`);
