const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");

const result = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/socialPreview.ts";`,
    resolveDir: root,
    sourcefile: "social-preview-check-entry.ts",
  },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("social-preview-check", module);
compiled.filename = path.join(root, ".social-preview-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { LEON_SOCIAL_PREVIEW_EMAIL, hasLeonSocialPreview } = compiled.exports;
let failures = 0;

function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

check("the preview is assigned to Leon's requested login", LEON_SOCIAL_PREVIEW_EMAIL === "leon@ordifydirect.com");
check("the exact Leon email unlocks social UI", hasLeonSocialPreview("leon@ordifydirect.com"));
check("email matching tolerates casing and surrounding spaces", hasLeonSocialPreview("  LEON@ORDIFYDIRECT.COM  "));
check("the logged-out prototype account stays locked", !hasLeonSocialPreview("preview@micheon.app"));
check("similar and aliased addresses stay locked", [
  "leon+friends@ordifydirect.com",
  "leon@ordifydirect.co",
  "other@ordifydirect.com",
  null,
  undefined,
].every((email) => !hasLeonSocialPreview(email)));

check("the current profile email is the single feature gate", source.includes("const socialPreviewUnlocked = hasLeonSocialPreview(profile?.email);"));
check("the Friends sidebar item is inserted only when unlocked", source.includes("socialPreviewUnlocked\n    ? [...NAVIGATION.slice(0, 4), SOCIAL_NAVIGATION_ITEM"));
check("global search includes social only when unlocked", source.includes("...(socialPreviewUnlocked ? [LEON_SOCIAL_SEARCH_PAGE] : [])"));
check("the social page renderer also checks the gate", source.includes('activeView === "social" && socialPreviewUnlocked'));
check("mobile navigation routes Leon through More", source.includes('["social", "tests", "grammar", "shop", "progress", "profile"]'));
check("the account menu exposes the gated destination", source.includes("{socialPreviewUnlocked && (") && source.includes("Your private social preview"));

const socialStart = source.indexOf("function SocialView");
const socialEnd = source.indexOf("function MoreView", socialStart);
const socialSource = source.slice(socialStart, socialEnd);
check("the social presentation contains Friends and Leaderboard sections", socialSource.includes('"friends" | "leaderboard"') && socialSource.includes("Friends league"));
check("preview actions provide honest feedback", socialSource.includes("UI preview only") && socialSource.includes("Nothing was sent or changed."));
check("preview actions do not call storage, desktop, or network APIs", !/(fetch\s*\(|axios|saveScopedJson|localStorage|window\.desktop)/.test(socialSource));
check("the social presentation has responsive container rules", styles.includes("@container np-social (max-width: 900px)") && styles.includes("@container np-social (max-width: 520px)"));
check("the social presentation has a complete dark theme", styles.includes('html[data-theme="dark"] .np-social-hero') && styles.includes('html[data-theme="dark"] .np-leaderboard-podium'));

if (failures) {
  console.error(`\n${failures} social-preview regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nLeon-only Friends and Leaderboard UI is guarded");
