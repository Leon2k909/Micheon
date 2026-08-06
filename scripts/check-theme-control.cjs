#!/usr/bin/env node
/**
 * Dark mode has to be reachable, and it has to survive a restart.
 *
 * The theme engine shipped complete — storage, sync, DOM painting, a full
 * dark palette in both stylesheets — but nothing in the app ever called
 * setTheme, and the main shell pinned itself to light on boot. Dark mode
 * existed and could not be turned on. These are the four joints that made it
 * unreachable; each one alone puts it back in the drawer.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const failures = [];

// ── 1. a control exists, and it can pick all three ────────────────────────
const profile = read("src/Gamification.tsx");
if (!/setTheme\(value\)/.test(profile)) {
  failures.push("Profile settings has no control that calls setTheme — dark mode is unreachable again");
}
for (const option of ['"light", "Light"', '"dark", "Dark"', '"system", "Match system"']) {
  if (!profile.includes(option)) {
    failures.push(`Profile settings is missing the ${option.split(",")[0]} theme option`);
  }
}
if (!/App theme/.test(profile)) failures.push("the theme control lost its label");
// It must live in Appearance, not somewhere a learner has to hunt for.
const appearanceAt = profile.indexOf('title={ui("Appearance")}');
const controlAt = profile.indexOf("App theme");
const nextCategoryAt = profile.indexOf("SettingsCategory", appearanceAt + 1);
if (appearanceAt < 0 || controlAt < appearanceAt || (nextCategoryAt > 0 && controlAt > nextCategoryAt)) {
  failures.push("the theme control is not inside the Appearance category");
}

// ── 2. the first paint honours the choice ─────────────────────────────────
const main = read("src/main.tsx");
if (/applyThemeToDom\(isMainShell/.test(main)) {
  failures.push("main.tsx still pins the shell to light — a dark-mode learner watches it load white");
}
if (!/const bootTheme = resolveTheme\(\)/.test(main) || !/applyThemeToDom\(bootTheme\)/.test(main)) {
  failures.push("main.tsx no longer paints the stored theme before first render");
}
if (!/bootTheme === "dark"/.test(main)) {
  failures.push("the inline light background in index.html will beat the stylesheet for dark-mode learners");
}

// ── 3. the theme layer resolves "system" ──────────────────────────────────
const theme = read("src/lib/theme.ts");
for (const [what, needle] of [
  ["a preference type", "export type ThemePreference"],
  ["system resolution", "prefers-color-scheme: dark"],
  ["a resolver", "export function resolveTheme"],
  ["an OS watcher", "export function watchSystemTheme"],
]) {
  if (!theme.includes(needle)) failures.push(`theme.ts lost ${what}`);
}
const app = read("src/App.tsx");
if (!/watchSystemTheme\(\)/.test(app)) {
  failures.push('App.tsx does not follow the OS, so "Match system" freezes at whatever it was on boot');
}

// ── 4. the native window opens in the right colour ────────────────────────
const electron = read("electron/main.js");
if (!/getDesktopSettings\(\)\.theme === "dark"/.test(electron)) {
  failures.push("the Electron window still opens light — dark mode flashes white on every launch");
}
const settings = read("electron/desktop-settings.cjs");
if (!/THEMES/.test(settings) || !/theme: "light"/.test(settings)) {
  failures.push("desktop-settings.cjs does not persist (or validate) the paint hint");
}
const preload = read("electron/preload.cjs");
if (!/setDesktopTheme/.test(preload)) {
  failures.push("the preload bridge cannot pass the theme to the main process");
}
// ── dark is the default, but never over a real choice ────────────────────
if (!/return "dark";/.test(theme) || /stored === "system" \? stored : "light"/.test(theme)) {
  failures.push("theme.ts no longer defaults to dark");
}
if (!/THEME_CHOSEN_KEY/.test(theme) || !/migrateToDarkThemeDefault/.test(theme)) {
  failures.push("nothing separates an install that never chose from one that picked light — the migration would overwrite a real choice");
}
if (!/localStorage\.setItem\(THEME_CHOSEN_KEY, "1"\)/.test(theme)) {
  failures.push("setTheme does not record that the learner chose, so the next default migration would overwrite them");
}
if (!/migrateToDarkThemeDefault\(\)/.test(app)) {
  failures.push("App.tsx never runs the dark default migration");
}

if (!/germDesktop\?\.setDesktopTheme/.test(theme)) {
  failures.push("setTheme never tells the desktop shell, so the hint is never written");
}

// ── 5. dark is genuinely neutral, not green-black ─────────────────────────
// The light theme's readability problem was accent-tinted surfaces; dark
// carried the identical mistake and must not drift back.
const proto = read("src/prototype/new-ui-prototype.css");
const darkAt = proto.indexOf('html[data-theme="dark"] .new-ui-prototype {');
if (darkAt < 0) {
  failures.push("the dark palette block has moved — this gate can no longer see it");
} else {
  const block = proto.slice(darkAt, proto.indexOf("}", darkAt));
  for (const match of block.matchAll(/--(?:np-)?(?:bg|shell|surface|surface-soft|surface-2|surface-3):\s*#([0-9a-f]{6})/gi)) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16));
    // A surface may lean, but green must not exceed the other channels by
    // more than a whisper or the whole page reads as tinted.
    if (g - Math.max(r, b) > 6) {
      failures.push(`dark surface #${match[1]} is green-tinted (g ${g} vs r ${r}/b ${b}) — surfaces stay neutral, green is the accent`);
    }
  }
}

// ── and no COMPONENT rule keeps the old olive cast either ────────────────
// The token block going neutral was only half the job: about seventy rules
// paint their own dark, and the sidebar kept an olive-black that read green
// against a slate page. Accent tints (correct answers, active tabs) are
// meant to be green and lead by a wide margin; a surface that leads by a
// whisker is the old cast left behind.
{
  const sheets = [
    ["src/prototype/new-ui-prototype.css", proto],
    ["src/index.css", fs.readFileSync(path.join(root, "src/index.css"), "utf8")],
  ];
  for (const [name, css] of sheets) {
    const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const rule of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = rule[1].replace(/\s+/g, " ").trim();
      if (!selector.includes('[data-theme="dark"]')) continue;
      for (const decl of rule[2].split(";")) {
        if (!/^\s*background(-color)?\s*:/.test(decl)) continue;
        for (const colour of decl.matchAll(/#([0-9a-f]{6})|rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/gi)) {
          const ch = colour[1]
            ? [0, 2, 4].map((i) => parseInt(colour[1].slice(i, i + 2), 16))
            : [colour[2], colour[3], colour[4]].map(Number);
          if (Math.max(...ch) > 90) continue;          // not a dark surface
          const lead = ch[1] - Math.max(ch[0], ch[2]);
          if (lead > 0 && lead <= 12) {
            failures.push(`${name}: "${selector.slice(0, 60)}" paints a faintly olive dark (r${ch[0]} g${ch[1]} b${ch[2]}) — surfaces are slate, green is the accent`);
          }
        }
      }
    }
  }
}

if (failures.length) {
  console.error("FAIL check-theme-control");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-theme-control: dark mode is reachable from Appearance, paints from the first frame, follows the OS, and its surfaces stay neutral");
