const fs = require("fs");
const path = require("path");
const { clampZoomFactor } = require("./zoom-steps.cjs");

const DEFAULT_DESKTOP_SETTINGS = Object.freeze({
  closeBehavior: "exit",
  zoomFactor: 1,
});

const CLOSE_BEHAVIORS = new Set(["exit", "tray"]);

function normalizeDesktopSettings(value) {
  return {
    closeBehavior: CLOSE_BEHAVIORS.has(value?.closeBehavior)
      ? value.closeBehavior
      : DEFAULT_DESKTOP_SETTINGS.closeBehavior,
    // Clamped to the zoom ladder's range so a corrupt or hand-edited file can
    // never boot the window at an unusable size.
    zoomFactor: clampZoomFactor(value?.zoomFactor ?? DEFAULT_DESKTOP_SETTINGS.zoomFactor),
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
