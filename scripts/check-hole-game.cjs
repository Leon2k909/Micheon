#!/usr/bin/env node
/**
 * Hole, and the three things that made the old one feel wrong.
 *
 * The first version played nothing like hole.io, which is what it is for.
 * The physics were roughly right; the feel was not, for reasons that are all
 * checkable:
 *
 *  1. THE CAMERA NEVER ZOOMED. It followed at 1:1 forever, so a hole near its
 *     maximum radius was wider than the canvas. This pins that the hole stays
 *     a roughly constant size on screen as it grows, which is the whole
 *     reason growing reads as growing.
 *  2. GROWTH WAS LINEAR. A fixed number of pixels per object means a bottle
 *     moves the needle as much as a bus early on and nothing moves it later.
 *     Growth is area-based now and this proves the curve.
 *  3. THE MAP WAS A GRID. Props were scattered at random over infinite graph
 *     paper. This pins that buildings sit inside blocks and traffic sits on
 *     roads.
 *
 * What it cannot check is the fourth thing — that objects are drawn CLIPPED
 * INSIDE the hole so they sink under the rim rather than fading above it.
 * That is canvas draw order, and it is verified by eye. The source pin at the
 * bottom is the closest thing to a guard for it.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/games/holeCity.ts";',
    resolveDir: root,
    sourcefile: "hole-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("hole-city", module);
compiled.filename = path.join(root, ".hole-city.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

// The values the component uses. Kept in step with HoleGame.tsx by the source
// pins at the end, so this cannot drift into testing numbers nobody ships.
const TARGET_SCREEN_RADIUS = 62;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.9;
const START_RADIUS = 22;
const MAX_RADIUS = 460;
const WORLD_SIZE = 4200;
const ROAD_STEP = 340;
const ROAD_WIDTH = 96;

// ── 1. the camera pulls back ────────────────────────────────────────────────
const zoomAtStart = M.zoomForRadius(START_RADIUS, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM);
const zoomAtMax = M.zoomForRadius(MAX_RADIUS, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM);
assert.ok(zoomAtStart > zoomAtMax, "the camera must zoom OUT as the hole grows, not in");
assert.ok(zoomAtStart > 1, `a new hole should be zoomed in, got ${zoomAtStart}`);
assert.ok(zoomAtMax < 0.35, `a maximum hole should be well zoomed out, got ${zoomAtMax}`);

// Monotonic the whole way, so there is no size at which growing pulls you in.
let previous = Infinity;
for (let radius = START_RADIUS; radius <= MAX_RADIUS; radius += 4) {
  const zoom = M.zoomForRadius(radius, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM);
  assert.ok(zoom <= previous + 1e-9, `zoom increased between radius ${radius - 4} and ${radius}`);
  previous = zoom;
}

// The point of all that: across the band where the zoom is free to move, the
// hole holds the same size on screen. Outside it the clamps take over on
// purpose — zoomed in harder than MAX_ZOOM at the start would show barely a
// block, and out past MIN_ZOOM at the end would turn the city into confetti.
const freeFrom = Math.ceil(TARGET_SCREEN_RADIUS / MAX_ZOOM);
const freeTo = Math.floor(TARGET_SCREEN_RADIUS / MIN_ZOOM);
assert.ok(freeFrom < 40 && freeTo > 290, `the free zoom band is ${freeFrom}..${freeTo}, which is too narrow to matter`);
for (let radius = freeFrom; radius <= freeTo; radius += 6) {
  const onScreen = M.screenRadius(radius, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM);
  assert.ok(
    Math.abs(onScreen - TARGET_SCREEN_RADIUS) < 1,
    `at radius ${radius} the hole measures ${onScreen.toFixed(1)}px on screen, not ~${TARGET_SCREEN_RADIUS}`
  );
}
// Below the band the hole is deliberately clamped, but must still be big
// enough to aim with rather than a dot.
const startOnScreen = M.screenRadius(START_RADIUS, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM);
assert.ok(
  startOnScreen > 30 && startOnScreen <= TARGET_SCREEN_RADIUS,
  `a new hole measures ${startOnScreen.toFixed(1)}px on screen`
);
// The old bug, stated as a test: at 1:1 the hole would be 920px across.
assert.ok(
  M.screenRadius(MAX_RADIUS, TARGET_SCREEN_RADIUS, MIN_ZOOM, MAX_ZOOM) < 120,
  "a full-size hole must still fit comfortably on screen"
);

// ── 2. growth is area-based ─────────────────────────────────────────────────
const carArea = Math.PI * Math.pow(46 / 2, 2) * 0.34;
const growthWhenSmall = M.radiusForArea(M.areaForRadius(START_RADIUS) + carArea) - START_RADIUS;
const growthWhenBig = M.radiusForArea(M.areaForRadius(300) + carArea) - 300;
assert.ok(growthWhenSmall > 0, "eating a car should grow a small hole");
assert.ok(
  growthWhenSmall > growthWhenBig * 5,
  `the same car should matter far more when small (${growthWhenSmall.toFixed(2)}) than when large (${growthWhenBig.toFixed(2)})`
);
assert.ok(
  Math.abs(M.radiusForArea(M.areaForRadius(77)) - 77) < 1e-9,
  "radius and area must round-trip"
);

// Points follow the footprint, so nothing can be quietly mispriced.
const bySize = [...M.PROP_SPECS].sort((a, b) => a.size - b.size);
for (let index = 1; index < bySize.length; index += 1) {
  assert.ok(
    M.propPoints(bySize[index]) >= M.propPoints(bySize[index - 1]),
    `${bySize[index].kind} is bigger than ${bySize[index - 1].kind} but worth no more`
  );
}

// ── 3. what can be swallowed ────────────────────────────────────────────────
assert.ok(!M.canSwallow(START_RADIUS, 230), "a new hole must not swallow a tower block");
assert.ok(M.canSwallow(START_RADIUS, 9), "a new hole should manage a bottle");
assert.ok(M.canSwallow(200, 230), "a large hole should manage a tower block");
// There is a real ladder, not two states: every tier must become available
// later than the one below it.
const tierThresholds = new Map();
for (const spec of M.PROP_SPECS) {
  let radius = 1;
  while (radius < 600 && !M.canSwallow(radius, spec.size)) radius += 1;
  const current = tierThresholds.get(spec.tier) ?? 0;
  tierThresholds.set(spec.tier, Math.max(current, radius));
}
const tiers = [...tierThresholds.keys()].sort((a, b) => a - b);
for (let index = 1; index < tiers.length; index += 1) {
  assert.ok(
    tierThresholds.get(tiers[index]) > tierThresholds.get(tiers[index - 1]),
    `tier ${tiers[index]} unlocks no later than tier ${tiers[index - 1]}`
  );
}

// ── 4. it is a city, not a scatter ──────────────────────────────────────────
const city = M.buildCity({ size: WORLD_SIZE, roadStep: ROAD_STEP, roadWidth: ROAD_WIDTH, seed: 1234 });
assert.ok(city.props.length > 400, `only ${city.props.length} props in the city`);

// Deterministic: the same seed builds the same city, which is what makes any
// of this reproducible when something looks wrong.
const again = M.buildCity({ size: WORLD_SIZE, roadStep: ROAD_STEP, roadWidth: ROAD_WIDTH, seed: 1234 });
assert.strictEqual(again.props.length, city.props.length, "the same seed built a different city");
assert.strictEqual(again.props[10].x, city.props[10].x, "the same seed placed props differently");

// Buildings belong inside blocks; traffic belongs on roads. A tower block in
// the middle of a carriageway looks like a bug even when it is not.
const buildings = city.props.filter((prop) => prop.spec.place === "block");
assert.ok(buildings.length > 40, `only ${buildings.length} buildings`);
for (const building of buildings) {
  assert.ok(
    !M.isOnRoad(building.x, building.y, ROAD_STEP, ROAD_WIDTH),
    `a ${building.spec.kind} was placed on a road at ${Math.round(building.x)},${Math.round(building.y)}`
  );
}
const traffic = city.props.filter((prop) => prop.spec.place === "road");
assert.ok(traffic.length > 40, `only ${traffic.length} vehicles`);
const onRoad = traffic.filter((prop) => M.isOnRoad(prop.x, prop.y, ROAD_STEP, ROAD_WIDTH)).length;
assert.ok(
  onRoad / traffic.length > 0.9,
  `only ${Math.round((onRoad / traffic.length) * 100)}% of vehicles are actually on a road`
);

// Every tier is present, so there is a full ladder to climb in one round.
const tiersPresent = new Set(city.props.map((prop) => prop.spec.tier));
for (const tier of [1, 2, 3, 4, 5, 6]) {
  assert.ok(tiersPresent.has(tier), `the city contains nothing of tier ${tier}`);
}

// Everything teaches a word — that is what this game is doing in a language
// app at all.
for (const spec of M.PROP_SPECS) {
  assert.ok(spec.de && /^(der|die|das)\s/.test(spec.de), `${spec.kind} has no German article`);
  assert.ok(spec.en && spec.en.trim().length > 1, `${spec.kind} has no English gloss`);
}

// ── 5. the source pins ──────────────────────────────────────────────────────
// The numbers above are only meaningful if the component ships them, and the
// clipped draw is the one thing that has to be pinned by reading the source.
const source = fs.readFileSync(path.join(root, "src/games/HoleGame.tsx"), "utf8");
for (const [needle, why] of [
  ["const TARGET_SCREEN_RADIUS = 62;", "the on-screen hole size this check assumes"],
  ["const MIN_ZOOM = 0.2;", "the zoom floor this check assumes"],
  ["const MAX_ZOOM = 1.9;", "the zoom ceiling this check assumes"],
  ["const START_RADIUS = 22;", "the starting radius this check assumes"],
  ["const MAX_RADIUS = 460;", "the maximum radius this check assumes"],
  ["zoomForRadius(player.radius", "the camera must use the zoom function, not a fixed scale"],
]) {
  assert.ok(source.includes(needle), `HoleGame.tsx no longer contains "${needle}" — ${why}`);
}
// Objects sink INSIDE the hole. Without the clip they fade above a black
// disc, which is exactly how the old version looked.
assert.ok(
  /ctx\.arc\(owner\.x, owner\.y, owner\.radius[\s\S]{0,60}ctx\.clip\(\)/.test(source),
  "falling props must be clipped to their hole so they disappear under the rim"
);
assert.ok(
  source.indexOf("for (const hole of holesRef.current) drawHole") < source.indexOf("for (const prop of falling)"),
  "the hole must be drawn BEFORE the things falling into it, or they float on top of the void"
);
assert.ok(source.includes("const ROUND_SECONDS = 120;"), "the round needs a clock to be a game");

console.log(
  `check-hole-game: camera holds the hole at ~${TARGET_SCREEN_RADIUS}px from radius ${START_RADIUS} to 310, `
  + `growth is area-based, and ${city.props.length} props sit on the right part of a ${M.PROP_SPECS.length}-kind city`
);
