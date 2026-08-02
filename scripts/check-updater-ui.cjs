const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const main = read("electron/main.js");
const preload = read("electron/preload.cjs");
const banner = read("src/components/UpdateBanner.tsx");
const styles = read("src/index.css");
const card = read("src/components/UpdateStatusCard.tsx");
const updateStatus = read("src/lib/updateStatus.ts");
const releaseWorkflow = read(".github/workflows/release.yml");

const result = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/updateStatus.ts";`,
    resolveDir: root,
    sourcefile: "updater-ui-check-entry.ts",
  },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("updater-ui-check", module);
compiled.filename = path.join(root, ".updater-ui-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  normaliseUpdatePercent,
  updatePanelIsUseful,
  updateStatusKey,
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

check("update percentages clamp below zero", normaliseUpdatePercent(-5) === 0);
check("update percentages round for display", normaliseUpdatePercent(47.6) === 48);
check("update percentages clamp above one hundred", normaliseUpdatePercent(105) === 100);
check("invalid update percentages fall back to zero", normaliseUpdatePercent("not-a-number") === 0);
check("download, ready and error states open the panel", ["downloading", "ready", "error"].every((state) => updatePanelIsUseful({ state })));
check("quiet updater states stay out of the learner's way", ["idle", "checking", "current", "unsupported"].every((state) => !updatePanelIsUseful({ state })));
check("dismissal keys change with state and version", updateStatusKey({ state: "downloading", version: "1.2.59" }) !== updateStatusKey({ state: "ready", version: "1.2.59" }));

check("startup uses the in-app updater path", /autoUpdater\.checkForUpdates\(\)/.test(main));
check("startup does not invoke the native notification updater", !/autoUpdater\.checkForUpdatesAndNotify\s*\(/.test(main));
check("Electron publishes live download progress", /download-progress[\s\S]*setUpdateStatus\("downloading"[\s\S]*percent:\s*p\.percent/.test(main));
check("preload exposes status, manual checking and installation", ["getUpdateStatus", "checkForUpdateNow", "onUpdateStatus", "installUpdate"].every((name) => preload.includes(name)));
check("the themed panel restores the current state on mount", banner.includes("desktop.getUpdateStatus()"));
check("the themed panel listens for every updater state", banner.includes("desktop.onUpdateStatus?."));
check("the themed panel includes accessible progress", banner.includes('role="progressbar"') && banner.includes("aria-valuenow={percent}"));
check("the themed panel includes restart and retry actions", banner.includes('ui("Restart Micheon")') && banner.includes('ui("Try again")'));
check("account settings mirror download progress", card.includes('role="progressbar"') && card.includes("normaliseUpdatePercent"));
check("explicit updates keep the generic NSIS window hidden", /autoUpdater\.quitAndInstall\(\s*true\s*,\s*true\s*\)/.test(main));
check("the branded install takeover owns the visible restart phase", banner.includes('data-testid="update-install-takeover"') && banner.includes('aria-modal="true"') && banner.includes('ui("Installing your update")'));
check("the custom install screen uses calm staged restart feedback", banner.includes('data-testid="update-install-steps"') && banner.includes('ui("Download complete")') && banner.includes('ui("Restarting Micheon")'));
check("development builds expose the complete install takeover for visual QA", banner.includes('get("update-preview") === "installing"') && banner.includes("useState(previewInstalling)"));
check("updater surfaces do not use rotating spinner indicators", !banner.includes("animate-spin") && !banner.includes("rotate: 360") && !card.includes("animate-spin"));
check("the compact updater uses the current tactile Micheon surface", banner.includes("micheon-update-panel__main") && banner.includes("micheon-update-actions") && styles.includes("--accent: #39aa45;") && styles.includes("0 3px 0 rgba(58, 104, 48, 0.12)"));
check("the compact updater has state-aware warning treatment", banner.includes("micheon-update-icon--${status.state}") && styles.includes(".micheon-update-icon--error"));
check("the updater error copy explains the failed check plainly", banner.includes('ui("Couldn\'t check for updates")') && !banner.includes('ui("Update paused")'));
check("the compact updater keeps both actions inside the card", styles.includes(".micheon-update-actions") && styles.includes("grid-template-columns: minmax(0, 1fr) auto"));
check("the updater has an explicit dark-theme treatment", styles.includes('html[data-theme="dark"] .micheon-update-panel'));
check("the install takeover uses the cream-and-green dashboard surface", banner.includes("micheon-update-takeover") && styles.includes(".micheon-update-takeover") && styles.includes("--install-accent: #46bd50;"));
check("the install takeover keeps the full-screen background calm and neutral", !banner.includes("micheon-update-takeover-glow") && styles.includes("--install-page: #eef0ec;") && styles.includes("linear-gradient(180deg, #f5f6f3 0%, var(--install-page) 100%)") && !styles.includes("background-size: 42px 42px"));
check("the install takeover avoids expensive decorative blur layers", !banner.includes("blur-[110px]") && !banner.includes("blur-[120px]") && !banner.includes("backdrop-blur-xl"));
check("the install takeover follows the learner's dark-theme setting", styles.includes('html[data-theme="dark"] .micheon-update-takeover') && styles.includes("--install-accent: #65d466;"));
check("the install takeover no longer hardcodes the old dark purple shell", !banner.includes('bg-[#0e1710]') && !banner.includes('bg-[#172019]'));
check("the updater no longer ships legacy purple accents", !/(#7834f7|#a177ff|rgba\(161,\s*119,\s*255)/i.test(banner));
check("all restart buttons route through one install takeover", updateStatus.includes("UPDATE_INSTALL_REQUEST_EVENT") && card.includes("requestUpdateInstall()") && !card.includes("desktop?.installUpdate?.()"));
check("an incomplete existing release rebuilds its missing updater assets", releaseWorkflow.includes('ASSET_COUNT="$(gh release view') && releaseWorkflow.includes('[ "$ASSET_COUNT" -lt 2 ]'));

if (failures) {
  console.error(`\n${failures} updater UI regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nThe Electron updater and both themed updater surfaces are guarded");
