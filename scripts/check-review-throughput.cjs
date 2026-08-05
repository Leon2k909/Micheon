#!/usr/bin/env node
/**
 * Reviews must drain faster than they accumulate.
 *
 * The course audit measured the cost of a flat three-review cap: a learner
 * banking three new phrases per lesson generates future reviews faster than
 * three slots can serve, so 91% of learned material was stranded — taught
 * once, never brought back. The cap now grows with the backlog. This gate
 * simulates a real month and pins the outcome, not the constant.
 */
const path = require("path");
const Module = require("module");
const root = path.join(__dirname, "..");
const esbuild = require("esbuild");

function load(entry, name) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: name + ".ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20",
    write: false, logLevel: "silent",
  });
  const mod = new Module(path.join(root, name + ".cjs"), module);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(built.outputFiles[0].text, path.join(root, name + ".cjs"));
  return mod.exports;
}

const { reviewCapForBacklog, buildSession } = load(
  `export { reviewCapForBacklog, buildSession } from "./src/session.ts";`, "throughput-a");
const { allPartBlueprints } = load(
  `export { allPartBlueprints } from "./src/lib/data.ts";`, "throughput-b");
const { recordSuccess } = load(
  `export { recordSuccess } from "./src/lib/memoryStrength.ts";`, "throughput-c");

const failures = [];

// ── the shape of the cap ───────────────────────────────────────────────────
if (reviewCapForBacklog(0) !== 3) failures.push("a quiet day should stay at three reviews");
if (reviewCapForBacklog(6) !== 3) failures.push("a small queue should not inflate the lesson");
if (reviewCapForBacklog(10) !== 5) failures.push("ten due should serve five");
if (reviewCapForBacklog(15) !== 8) failures.push("fifteen due should serve eight");
if (reviewCapForBacklog(60) !== 8) failures.push("the cap must stop at eight — lessons stay lessons");
if (reviewCapForBacklog(10000) !== 8) failures.push("the ceiling must hold under any backlog");

// ── a simulated month: learn daily, answer well, count what comes back ─────
// One pack studied for 30 daily lessons with correct answers throughout.
// Every new item schedules future reviews (1d, 3d, 10d...); the gate asserts
// the due backlog at each sitting gets SERVED rather than stranded.
{
  const part = { ...allPartBlueprints.part39, partKey: "part39" };
  const review = {};
  const DAY = 24 * 60 * 60 * 1000;
  const start = Date.now();
  let stranded = 0;
  let servedReviews = 0;
  let maxCarriedOver = 0;

  for (let day = 0; day < 30; day += 1) {
    const now = start + day * DAY;
    const originalNow = Date.now;
    Date.now = () => now;
    try {
      const steps = buildSession(part, [], review, 0);
      const served = steps.filter((s) => s.type === "sentence");
      const dueToday = Object.values(review).filter((r) =>
        r?.dueAt && Date.parse(r.dueAt) <= now && !r.permanent).length;
      const reviewsServed = steps.filter((s) => s.type === "sentence" && s.review && !s.reinforcement).length;
      servedReviews += reviewsServed;
      const carried = Math.max(0, dueToday - reviewsServed);
      maxCarriedOver = Math.max(maxCarriedOver, carried);
      if (day === 29) stranded = carried;
      for (const step of served) {
        const id = step.item?.id;
        if (!id) continue;
        review[id] = recordSuccess(review[id], now);
      }
      for (const step of steps) {
        for (const line of step.dialogue?.lines ?? []) {
          if (line?.id && !review[line.id]) review[line.id] = recordSuccess(undefined, now);
        }
      }
    } finally {
      Date.now = originalNow;
    }
  }

  if (servedReviews < 20) {
    failures.push(`a month of daily study served only ${servedReviews} scheduled reviews — the system is still starving`);
  }
  if (maxCarriedOver > 10) {
    failures.push(`the due backlog peaked at ${maxCarriedOver} unserved items in one sitting — reviews are accumulating faster than they drain`);
  }
  if (stranded > 8) {
    failures.push(`after a month, ${stranded} due items were still waiting — the backlog is not draining`);
  }
}

// ── and the component actually uses it ─────────────────────────────────────
const fs = require("fs");
const guided = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
if (!guided.includes("reviewCapForBacklog(requiredReviews.length + globalReviews.length)")) {
  failures.push("Continue Learning no longer scales its review slots with the backlog");
}
const session = fs.readFileSync(path.join(root, "src/session.ts"), "utf8");
if (!session.includes("reviewCapForBacklog(dueSteps.length)")) {
  failures.push("per-pack lessons no longer scale their review slots with the backlog");
}

if (failures.length) {
  console.error("FAIL check-review-throughput");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-review-throughput: the review cap breathes with the backlog and a simulated month drains its due queue");
