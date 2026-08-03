const fs = require("fs");
const path = require("path");

const DEFAULT_DESKTOP_SETTINGS = Object.freeze({
  closeBehavior: "exit",
});

const CLOSE_BEHAVIORS = new Set(["exit", "tray"]);

function normalizeDesktopSettings(value) {
  return {
    closeBehavior: CLOSE_BEHAVIORS.has(value?.closeBehavior)
      ? value.closeBehavior
      : DEFAULT_DESKTOP_SETTINGS.closeBehavior,
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
