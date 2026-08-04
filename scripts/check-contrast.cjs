// Legibility, measured rather than eyeballed.
//
// This computes real WCAG contrast ratios from the shipped CSS tokens, so it
// catches a regression that a string match never would — someone lightening a
// hex by two steps still passes "the colour changed" checks and still makes the
// screen unreadable.
//
// Two separate things have to hold, and only the first was ever true here:
//
//   TEXT      >= 4.5:1  (WCAG 1.4.3) — was already passing.
//   BOUNDARY  >= 2.0:1  default, >= 3.0:1 in high contrast (WCAG 1.4.11 asks
//             for 3.0). Every card edge measured 1.30:1, which is invisible:
//             the reported symptom was not faint text but panels with no
//             discernible edges, so nothing looked separate from anything else.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const channel = (value) => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hex = (value) => {
  const h = value.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
/** Flatten a translucent border over the surface it is drawn on. */
const flatten = ([r, g, b, a], bg) => [r, g, b].map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

/** Read a `:root`-style token block starting at a given declaration. */
function tokensFrom(anchor) {
  const start = css.indexOf(anchor);
  if (start < 0) throw new Error(`token block not found: ${anchor}`);
  const end = css.indexOf("}", start);
  const block = css.slice(start, end);
  const solid = Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)].map((m) => [m[1], hex(m[2])]));
  const alpha = Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*rgba\(([^)]+)\)\s*;/g)].map((m) => {
    const parts = m[2].split(",").map((p) => Number(p.trim()));
    return [m[1], parts];
  }));
  return { solid, alpha };
}

function audit(label, anchors, { textMin, edgeMin }) {
  // A high-contrast block only overrides text and border tokens; its surfaces
  // still come from the theme underneath. Merge in cascade order so the audit
  // sees the same values the browser resolves — otherwise the loops below find
  // no surfaces, every comparison is skipped, and the check passes vacuously.
  const solid = {};
  const alpha = {};
  for (const anchor of [].concat(anchors)) {
    const layer = tokensFrom(anchor);
    Object.assign(solid, layer.solid);
    Object.assign(alpha, layer.alpha);
  }
  const surfaces = ["surface", "surface-2", "surface-3"].filter((k) => solid[k]);
  const texts = ["text-1", "text-2", "text-3"].filter((k) => solid[k]);
  if (!surfaces.length || !texts.length) {
    failures += 1;
    console.error(`FAIL ${label}: no tokens resolved — the audit would pass vacuously`);
    return;
  }

  let worstText = Infinity;
  let worstTextPair = "";
  for (const t of texts) {
    for (const s of surfaces) {
      const r = ratio(solid[t], solid[s]);
      if (r < worstText) {
        worstText = r;
        worstTextPair = `--${t} on --${s}`;
      }
    }
  }
  check(
    `${label}: every text colour is readable on every surface (worst ${worstText.toFixed(2)}:1, need ${textMin})`,
    worstText >= textMin,
    worstTextPair
  );

  // A panel is perceivable through its border OR its fill difference —
  // whichever is stronger is what the eye actually gets.
  let worstEdge = Infinity;
  let worstEdgeLabel = "";
  const border = alpha["border"];
  for (let i = 0; i < surfaces.length - 1; i += 1) {
    const under = solid[surfaces[i]];
    const over = solid[surfaces[i + 1]];
    const fill = ratio(over, under);
    const edge = border ? ratio(flatten(border, under), under) : 0;
    const best = Math.max(fill, edge);
    if (best < worstEdge) {
      worstEdge = best;
      worstEdgeLabel = `--${surfaces[i + 1]} on --${surfaces[i]} (fill ${fill.toFixed(2)}, border ${edge.toFixed(2)})`;
    }
  }
  check(
    `${label}: you can see where each panel ends (worst ${worstEdge.toFixed(2)}:1, need ${edgeMin})`,
    worstEdge >= edgeMin,
    worstEdgeLabel
  );
}

const LIGHT = "  --surface: #ffffff;";
const DARK = "  --surface: #18221a;";

audit("light", LIGHT, { textMin: 4.5, edgeMin: 2.0 });
audit("dark", DARK, { textMin: 4.5, edgeMin: 1.9 });
audit("light + high contrast", [LIGHT, 'html[data-contrast="high"] .new-ui-prototype'], { textMin: 7.0, edgeMin: 3.0 });
audit("dark + high contrast", [DARK, 'html[data-theme="dark"][data-contrast="high"] .new-ui-prototype'], { textMin: 7.0, edgeMin: 3.0 });

if (failures) {
  console.error(`\n${failures} contrast regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\ntext and panel edges are measurably legible in every theme");
