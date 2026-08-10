const fs = require("fs");
const path = require("path");
const { clampZoomFactor } = require("./zoom-steps.cjs");

const DEFAULT_DESKTOP_SETTINGS = Object.freeze({
  closeBehavior: "exit",
  zoomFactor: 1,
  // The RESOLVED theme, remembered only so the native window can open in the
  // right colour. The learner's actual preference (which may be "system")
  // lives in the synced profile store; this is a paint hint, not the setting.
  //
  // Dark, to match the app's own default. While this said "light" the native
  // window opened white and the page painted dark over it — a white flash on
  // every cold start for anyone who had never opened Appearance.
  theme: "dark",
  // How updates arrive. "auto" downloads and installs on quit as before;
  // "ask" checks but waits to be told; "manual" only checks when asked.
  updateMode: "auto",
  // Epoch ms until which the updater stays quiet. Postponing does not cancel
  // an update, it just stops it pestering — the next check after this passes
  // picks it straight back up.
  updateSnoozeUntil: 0,
  // Hide the in-app update panel entirely. The update still happens; it just
  // stops narrating.
  updateNoticesHidden: false,
  // Offline speaking practice is part of Micheon, not an add-on. The native
  // model installs itself on first launch and stays available until the learner
  // explicitly removes it from Settings.
});

const CLOSE_BEHAVIORS = new Set(["exit", "tray"]);
const THEMES = new Set(["light", "dark"]);
const UPDATE_MODES = new Set(["auto", "ask", "manual"]);
/** A snooze longer than this is almost certainly a corrupt file, not a wish. */
const MAX_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

function normalizeSnooze(value) {
  const until = Number(value);
  if (!Number.isFinite(until) || until <= 0) return 0;
  // Clamped rather than trusted: a bad value here would silence updates for
  // ever, which is exactly the failure nobody would ever notice.
  return Math.min(until, Date.now() + MAX_SNOOZE_MS);
}

function normalizeDesktopSettings(value) {
  return {
    closeBehavior: CLOSE_BEHAVIORS.has(value?.closeBehavior)
      ? value.closeBehavior
      : DEFAULT_DESKTOP_SETTINGS.closeBehavior,
    // Clamped to the zoom ladder's range so a corrupt or hand-edited file can
    // never boot the window at an unusable size.
    zoomFactor: clampZoomFactor(value?.zoomFactor ?? DEFAULT_DESKTOP_SETTINGS.zoomFactor),
    theme: THEMES.has(value?.theme) ? value.theme : DEFAULT_DESKTOP_SETTINGS.theme,
    updateMode: UPDATE_MODES.has(value?.updateMode) ? value.updateMode : DEFAULT_DESKTOP_SETTINGS.updateMode,
    updateSnoozeUntil: normalizeSnooze(value?.updateSnoozeUntil),
    updateNoticesHidden: value?.updateNoticesHidden === true,
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
