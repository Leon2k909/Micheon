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

const { lessonMixForBacklog, buildSession } = load(
  `export { lessonMixForBacklog, buildSession } from "./src/session.ts";`, "throughput-a");
const { allPartBlueprints } = load(
  `export { allPartBlueprints } from "./src/lib/data.ts";`, "throughput-b");
const { recordSuccess } = load(
  `export { recordSuccess } from "./src/lib/memoryStrength.ts";`, "throughput-c");

const failures = [];

// ── the shape of the sitting ───────────────────────────────────────────────
// Leon's rule: a sitting is SIX sentences at most — a backlog trades new
// slots for review slots, it never grows the session.
for (const due of [0, 3, 4, 9, 10, 60, 10000]) {
  const mix = lessonMixForBacklog(due);
  if (mix.reviewSlots + mix.freshSlots > 6) {
    failures.push(`${due} due produced a ${mix.reviewSlots + mix.freshSlots}-sentence sitting — six is the ceiling`);
  }
  if (mix.freshSlots < 1) failures.push(`${due} due left no new-material slot — something new every day, always`);
}
if (JSON.stringify(lessonMixForBacklog(0)) !== JSON.stringify({ reviewSlots: 3, freshSlots: 3 })) {
  failures.push("a quiet day should be the classic 3 reviews + 3 new");
}
if (JSON.stringify(lessonMixForBacklog(6)) !== JSON.stringify({ reviewSlots: 4, freshSlots: 2 })) {
  failures.push("a building queue should trade one new slot for a review slot");
}
if (JSON.stringify(lessonMixForBacklog(20)) !== JSON.stringify({ reviewSlots: 5, freshSlots: 1 })) {
  failures.push("a loaded queue should trade two new slots for review slots");
}

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
      if (served.length > 6) {
        failures.push(`day ${day}: the sitting held ${served.length} sentences — six is the ceiling`);
      }
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
if (!guided.includes("lessonMixForBacklog(requiredReviews.length + globalReviews.length)")) {
  failures.push("Continue Learning no longer trades new slots for review slots with the backlog");
}
const session = fs.readFileSync(path.join(root, "src/session.ts"), "utf8");
if (!session.includes("lessonMixForBacklog(dueSteps.length)")) {
  failures.push("per-pack lessons no longer trade new slots for review slots with the backlog");
}

if (failures.length) {
  console.error("FAIL check-review-throughput");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-review-throughput: the review cap breathes with the backlog and a simulated month drains its due queue");
