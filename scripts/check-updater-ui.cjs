const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const main = read("electron/main.js");
const preload = read("electron/preload.cjs");
const banner = read("src/components/UpdateBanner.tsx");
const card = read("src/components/UpdateStatusCard.tsx");
const updateStatus = read("src/lib/updateStatus.ts");

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
check("updater surfaces do not use rotating spinner indicators", !banner.includes("animate-spin") && !banner.includes("rotate: 360") && !card.includes("animate-spin"));
check("all restart buttons route through one install takeover", updateStatus.includes("UPDATE_INSTALL_REQUEST_EVENT") && card.includes("requestUpdateInstall()") && !card.includes("desktop?.installUpdate?.()"));

if (failures) {
  console.error(`\n${failures} updater UI regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nThe Electron updater and both themed updater surfaces are guarded");
