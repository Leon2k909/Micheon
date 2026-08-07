#!/usr/bin/env node
/**
 * Press a nav button, slide to another, release on the one you want.
 *
 * The first attempt at this request built the wrong thing — drag-to-SCROLL,
 * which is a different gesture and did nothing useful on a menu that fits.
 * What was asked for is press-and-slide selection: you hold, run down the
 * list, and whatever you release over is what opens.
 *
 * The properties below are the ones that make it usable rather than annoying:
 * an ordinary click must stay an ordinary click, a slide must activate what
 * you released over and NOT what you pressed on, and the list must not turn
 * into a text selection while you drag through it.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const lib = fs.readFileSync(path.join(root, "src/lib/slideSelect.ts"), "utf8");

// ── a press that does not travel is left alone ────────────────────────────
if (!/SLIDE_THRESHOLD_PX/.test(lib) || !/if \(Math\.abs\(event\.clientY - startY\) < SLIDE_THRESHOLD_PX\) return;/.test(lib)) {
  failures.push("there is no travel threshold, so every click would be treated as a slide");
}
if (!/if \(event\.button !== 0\) return;/.test(lib)) {
  failures.push("the gesture is not limited to the left button, so right-click would start it");
}

// ── activate first, then suppress ─────────────────────────────────────────
//
// Arming the suppressor before the click meant the handler swallowed the very
// click it was meant to let through, and the slide silently did nothing.
const finish = lib.slice(lib.indexOf("const finish"), lib.indexOf("const onClickCapture"));
const clickAt = finish.indexOf("target.click()");
const armAt = finish.indexOf("suppressNextClick = true");
if (clickAt < 0 || armAt < 0) {
  failures.push("the release does not activate anything, so a slide would do nothing");
} else if (clickAt > armAt) {
  failures.push("the click suppressor is armed before the activation, so the slide swallows its own click");
}

// ── the one you released over, not the one you pressed ────────────────────
if (!/const target = landedOn \?\? startItem;/.test(finish)) {
  failures.push("the release does not prefer the item under the pointer, so sliding cannot change your mind");
}
if (!/click\.stopPropagation\(\)/.test(lib) || !/click\.preventDefault\(\)/.test(lib)) {
  failures.push("the browser's own click is not suppressed, so the pressed button can open behind the chosen one");
}

// ── and it looks like one control while you drag ──────────────────────────
if (!/is-slide-target/.test(lib)) {
  failures.push("nothing highlights the item under the pointer, so a slide gives no feedback");
}
const proto = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");
// The bubble has to be obviously heavier than hover. A faint tint read as an
// ordinary hover state, so the gesture looked like nothing was happening.
const bubble = /\.np-side-nav button\.is-slide-target \{([^}]*)\}/.exec(proto)?.[1] ?? "";
if (!bubble) {
  failures.push("the highlighted item has no style, so the feedback is invisible");
} else {
  if (!/transform:\s*translateX/.test(bubble) || !/box-shadow:/.test(bubble)) {
    failures.push("the slide target has no lift, so it reads as hover rather than a dragged bubble");
  }
  if (!/--accent-rgb/.test(bubble)) {
    failures.push("the slide bubble is painted a fixed colour instead of the chosen accent");
  }
}
if (!/\.np-side-nav button \{[^}]*transition:[^}]*transform/.test(proto)) {
  failures.push("nothing animates, so the bubble blinks between items instead of travelling");
}
if (!/\.np-sidebar\.is-slide-selecting[\s\S]{0,120}user-select: none/.test(proto)) {
  failures.push("dragging through the menu would select its text instead");
}

// ── the scrollbar down the menu is gone ───────────────────────────────────
const sidebar = proto.slice(proto.indexOf(".np-sidebar {"), proto.indexOf(".np-sidebar {") + 500);
if (!/scrollbar-width: none/.test(sidebar) || !/\.np-sidebar::-webkit-scrollbar \{ display: none; \}/.test(proto)) {
  failures.push("the sidebar still shows a scrollbar down its edge");
}
if (!/overflow-y: auto/.test(sidebar)) {
  failures.push("hiding the scrollbar also made the menu unreachable on a short window");
}

// ── and the gesture it replaced is gone, not merely unused ────────────────
if (fs.existsSync(path.join(root, "src/lib/dragScroll.ts"))) {
  failures.push("the old drag-to-scroll hook is still in the tree");
}
const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
if (!/useSlideSelect\(sidebarRef, "\.np-side-nav button"\)/.test(shell)) {
  failures.push("the sidebar does not use the slide gesture");
}

if (failures.length) {
  console.error("FAIL check-slide-select");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-slide-select: a plain click stays a plain click, a slide opens what you released over, the menu highlights as you pass it, and the scrollbar is gone without making the menu unreachable");
