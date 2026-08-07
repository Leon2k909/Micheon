#!/usr/bin/env node
/**
 * No white rectangle on the way into a lesson, or on the way into the app.
 *
 * The loading screen shown while a lazy chunk arrives fills the whole window.
 * It was a hardcoded cream with no dark variant; the first fix pointed it at
 * --np-shell, which is declared on .new-ui-prototype -- and the skeleton
 * renders ABOVE that element, so the variable was never in scope and every
 * paint still used the light fallback. It looked fixed and was not.
 *
 * The rule this encodes: anything that can cover the whole window before the
 * app shell exists may only use values that are in scope there, and must have
 * a dark variant of its own.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const proto = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

// Which custom properties only exist inside the prototype shell?
const shellBlock = /\.new-ui-prototype \{([\s\S]*?)\n\}/.exec(proto)?.[1] ?? "";
const shellScoped = new Set([...shellBlock.matchAll(/(--[a-z0-9-]+):/g)].map((m) => m[1]));

const rules = [...css.matchAll(/([^{}]*)\{([^{}]*)\}/g)]
  .filter((m) => m[1].includes(".main-skeleton"));
if (!rules.length) failures.push("the loading screen has no styling at all");

for (const [, selector, body] of rules) {
  for (const [, name] of body.matchAll(/var\((--[a-z0-9-]+)/g)) {
    if (shellScoped.has(name)) {
      failures.push(
        `the loading screen uses ${name}, which only exists inside .new-ui-prototype — ` +
        "it renders above that element, so this silently falls back to its light value"
      );
    }
  }
}

// It must have a dark treatment of its own.
if (!/html\[data-theme="dark"\][^{]*\.main-skeleton\b/.test(css)) {
  failures.push("the loading screen has no dark variant, so it flashes light over a dark app");
}

// And it should agree with what index.html paints before React exists, or the
// two swap colours mid-load, which is the same flash by another route.
const bootDark = /background = theme === "dark" \? "(#[0-9a-f]{6})"/i.exec(html)?.[1];
if (bootDark) {
  const darkRule = /html\[data-theme="dark"\][^{]*\.main-skeleton \{([^}]*)\}/.exec(css)?.[1] ?? "";
  if (!darkRule.toLowerCase().includes(bootDark.toLowerCase())) {
    failures.push(
      `the loading screen's dark background does not match index.html's ${bootDark}, ` +
      "so the window changes colour as the app boots"
    );
  }
}

// It also has to look like the thing it is standing in for. A small card in
// the middle of an empty window meant the app appeared to jump from one
// screen to a completely different one when the real layout arrived.
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
for (const piece of ['main-skeleton-rail', 'main-skeleton-chip', 'main-skeleton-hero']) {
  if (!app.includes(piece)) {
    failures.push(`the loading screen has no ${piece.replace('main-skeleton-', '')}, so it does not trace the layout it is standing in for`);
  }
}
// And it must drop the sidebar where the shell drops its own, or it promises
// a layout that never arrives.
if (!/@media \(max-width: 1040px\)[\s\S]{0,320}\.main-skeleton-rail \{ display: none; \}/.test(css)) {
  failures.push("the loading screen keeps its sidebar on a narrow window, where the real shell has none");
}

if (failures.length) {
  console.error("FAIL check-no-flash");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-no-flash: the loading screen uses values that are in scope where it renders, has a dark variant, and matches the colour index.html paints before React exists");
