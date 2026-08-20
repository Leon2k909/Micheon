const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
const normalizedSource = source.replace(/\r\n/g, "\n");
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

const {
  LEON_SOCIAL_PREVIEW_EMAIL,
  MICHELLE_SOCIAL_PREVIEW_EMAIL,
  SOCIAL_PREVIEW_EMAILS,
  hasLeonSocialPreview,
} = compiled.exports;
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
// Michelle asked for everything Leon has. She is on the list, not an
// exception to it, so this is pinned the same way his is.
check("the preview is also assigned to Michelle", MICHELLE_SOCIAL_PREVIEW_EMAIL === "sozialmichelle@gmail.com");
check("Michelle unlocks the same social UI", hasLeonSocialPreview("sozialmichelle@gmail.com"));
check("Michelle's address tolerates casing and spaces too", hasLeonSocialPreview("  SozialMichelle@Gmail.com "));
check("both accounts are on the list and nothing else is", Array.isArray(SOCIAL_PREVIEW_EMAILS) && SOCIAL_PREVIEW_EMAILS.length === 2);
check("the logged-out prototype account stays locked", !hasLeonSocialPreview("preview@micheon.app"));
check("similar and aliased addresses stay locked", [
  "leon+friends@ordifydirect.com",
  "leon@ordifydirect.co",
  "other@ordifydirect.com",
  "michelle@gmail.com",
  "sozialmichelle@gmail.co",
  "sozialmichelle+extra@gmail.com",
  null,
  undefined,
].every((email) => !hasLeonSocialPreview(email)));

check("the current profile email is the single private-feature gate", normalizedSource.includes("const leonOnlyFeaturesUnlocked = hasLeonSocialPreview(profile?.email);"));
check("the Friends sidebar item is inserted only when unlocked", normalizedSource.includes("...(socialPreviewUnlocked ? [SOCIAL_NAVIGATION_ITEM] : [])"));
check("global search includes social only when unlocked", normalizedSource.includes("...(socialPreviewUnlocked ? [LEON_SOCIAL_SEARCH_PAGE] : [])"));
check("the social page renderer also checks the gate", normalizedSource.includes('activeView === "social" && socialPreviewUnlocked'));
check("mobile navigation routes Leon's social preview through More", normalizedSource.includes('["social", "shop", "progress", "profile"]'));
check("the account menu exposes the gated destination", normalizedSource.includes("{socialPreviewUnlocked && (") && normalizedSource.includes("Your private social preview"));

const navigationStart = normalizedSource.indexOf("const NAVIGATION:");
const navigationEnd = normalizedSource.indexOf("const MOBILE_NAVIGATION", navigationStart);
const baseNavigationSource = normalizedSource.slice(navigationStart, navigationEnd);
check("the shared navigation never contains Shop", !baseNavigationSource.includes('id: "shop"'));
check("Shop uses the same exact Leon-only gate", normalizedSource.includes("const shopUnlocked = leonOnlyFeaturesUnlocked;"));
check("the Shop sidebar item is inserted only for Leon", normalizedSource.includes("...(shopUnlocked ? [SHOP_NAVIGATION_ITEM] : [])"));
check("global search includes Shop only for Leon", normalizedSource.includes("...(shopUnlocked ? [LEON_SHOP_SEARCH_PAGE] : [])"));
check("More hides the Shop card from every other account", normalizedSource.includes('...(shopUnlocked ? [{ title: ui("Reward shop")'));
check("direct Shop navigation is rejected when locked", normalizedSource.includes('view === "shop" && !shopUnlocked'));
check("the Shop renderer also checks the gate", normalizedSource.includes('activeView === "shop" && shopUnlocked'));
check("non-Leon profiles cannot display an equipped Shop badge", normalizedSource.includes("equippedBadge={shopUnlocked ? equippedShopBadge : null}"));

const socialStart = normalizedSource.indexOf("function SocialView");
const socialEnd = normalizedSource.indexOf("function MoreView", socialStart);
const socialSource = normalizedSource.slice(socialStart, socialEnd);
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
