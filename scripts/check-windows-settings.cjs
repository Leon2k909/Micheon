const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const main = read("electron/main.js");
const preload = read("electron/preload.cjs");
const profile = read("src/Gamification.tsx");
const settingsUi = read("src/components/WindowsAppSettings.tsx");
const settingsStore = require(path.join(root, "electron/desktop-settings.cjs"));

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

check("invalid close behaviour falls back to exiting", settingsStore.normalizeDesktopSettings({ closeBehavior: "hide-forever" }).closeBehavior === "exit");
check("tray close behaviour survives normalisation", settingsStore.normalizeDesktopSettings({ closeBehavior: "tray" }).closeBehavior === "tray");
check("Windows startup uses Electron's login-item API", main.includes("app.getLoginItemSettings()") && main.includes("app.setLoginItemSettings({ openAtLogin: Boolean(enabled) })"));
check("startup registration is limited to installed Windows builds", main.includes('process.platform !== "win32" || !app.isPackaged'));
check("closing to tray hides rather than destroys the main window", main.includes('getDesktopSettings().closeBehavior !== "tray"') && main.includes("event.preventDefault();") && main.includes("mainWindow.hide();"));
check("the tray always offers Open and Quit", main.includes('label: "Open Micheon"') && main.includes('label: "Quit Micheon"'));
check("actual application quits bypass close-to-tray", main.includes('app.on("before-quit"') && main.includes("appIsQuitting = true;"));
check("the preload bridge exposes all Windows settings actions", ["getWindowsSettings", "setLaunchAtLogin", "setCloseBehavior"].every((name) => preload.includes(name)));
check("Profile and settings renders the Windows controls", profile.includes("<WindowsAppSettings />"));
check("launch at sign-in is an accessible switch", settingsUi.includes('role="switch"') && settingsUi.includes("aria-checked={settings.launchAtLogin}"));
check("close behaviour presents explicit Exit and tray choices", settingsUi.includes('ui("Exit Micheon")') && settingsUi.includes('ui("Minimize to tray")'));
check("browser previews explain that the controls need the installed app", settingsUi.includes('ui("These controls are available in the installed Windows app.")'));

if (failures) {
  console.error(`\n${failures} Windows settings regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nWindows startup and close behaviour are guarded");
