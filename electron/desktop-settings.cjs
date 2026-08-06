const fs = require("fs");
const path = require("path");
const { clampZoomFactor } = require("./zoom-steps.cjs");

const DEFAULT_DESKTOP_SETTINGS = Object.freeze({
  closeBehavior: "exit",
  zoomFactor: 1,
  // The RESOLVED theme, remembered only so the native window can open in the
  // right colour. The learner's actual preference (which may be "system")
  // lives in the synced profile store; this is a paint hint, not the setting.
  theme: "light",
});

const CLOSE_BEHAVIORS = new Set(["exit", "tray"]);
const THEMES = new Set(["light", "dark"]);

function normalizeDesktopSettings(value) {
  return {
    closeBehavior: CLOSE_BEHAVIORS.has(value?.closeBehavior)
      ? value.closeBehavior
      : DEFAULT_DESKTOP_SETTINGS.closeBehavior,
    // Clamped to the zoom ladder's range so a corrupt or hand-edited file can
    // never boot the window at an unusable size.
    zoomFactor: clampZoomFactor(value?.zoomFactor ?? DEFAULT_DESKTOP_SETTINGS.zoomFactor),
    theme: THEMES.has(value?.theme) ? value.theme : DEFAULT_DESKTOP_SETTINGS.theme,
  };
}

function readDesktopSettings(filePath) {
  try {
    return normalizeDesktopSettings(JSON.parse(fs.readFileSync(filePath, "utf8")));
  } catch {
    return { ...DEFAULT_DESKTOP_SETTINGS };
  }
}

function writeDesktopSettings(filePath, value) {
  const settings = normalizeDesktopSettings(value);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  return settings;
}

module.exports = {
  DEFAULT_DESKTOP_SETTINGS,
  normalizeDesktopSettings,
  readDesktopSettings,
  writeDesktopSettings,
};
