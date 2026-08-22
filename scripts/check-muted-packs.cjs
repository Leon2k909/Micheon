// Pausing a pack must actually keep it out of Continue Learning — every path,
// not just the obvious one.
//
// The catalogue is built from ALL packs, so the fresh-sentence scorer and the
// reinforcement scorer both walk items belonging to paused packs and have to
// drop them explicitly. Miss either and a paused pack keeps serving material,
// which is exactly the failure pausing exists to prevent.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const session = read("src/guided_learning_session.tsx");
const learnView = read("src/components/lab/LearnView.tsx");
const lib = read("src/lib/mutedPacks.ts");
const i18n = read("src/lib/i18n.ts");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── the store ──────────────────────────────────────────────────────────────
check(
  "paused packs are stored per profile, so two learners can differ",
  lib.includes("loadScopedJson") && lib.includes("saveScopedJson")
);
check(
  "pausing never empties the course",
  lib.includes("Object.keys(kept).length > 0 ? kept : parts")
);
check(
  "unpausing is possible and non-destructive (no progress is deleted)",
  lib.includes("export function setPackMuted")
    && lib.includes("export function clearMutedPacks")
    && !/removeItem\(|delete .*grade|clearProgress/i.test(lib)
);

// ── every Continue Learning path filters ───────────────────────────────────
const autoStart = session.indexOf("if (!explicit) {");
const autoEnd = session.indexOf("const { fresh, reviews }", autoStart);
const autoBranch = autoStart >= 0 && autoEnd > autoStart ? session.slice(autoStart, autoEnd) : "";
check(
  "Continue Learning builds its pack list from the unpaused packs only",
  autoBranch.includes("const activeParts = withoutMutedPacks(apiParts)")
    && autoBranch.includes("const keys = Object.keys(activeParts)")
);
check(
  "no path inside Continue Learning still reaches for the unfiltered catalogue",
  autoBranch.length > 0 && !/\bapiParts\[/.test(autoBranch),
  autoBranch.match(/.{0,60}apiParts\[.{0,40}/)?.[0]
);
check(
  "auto-advancing at the end of a pack skips paused packs too",
  session.includes("const advanceParts = withoutMutedPacks(apiParts)")
    && session.includes("const partKeys = Object.keys(advanceParts)")
);

// ── the control the learner actually uses ──────────────────────────────────
check(
  "each pack card carries its own pause control",
  learnView.includes("onClick={() => togglePaused(key)}")
    && learnView.includes("aria-pressed={paused}")
    && learnView.includes('ui(paused ? "Resume" : "Pause")')
);
check(
  "the card stays operable: opening is a real button, not a button inside a button",
  !learnView.includes("<motion.button")
    && learnView.includes("onClick={() => onOpenLesson(key)}")
    && learnView.includes('className="absolute inset-0 z-0')
);
check(
  "paused packs are visibly marked and can be filtered back out of hiding",
  learnView.includes('{ id: "paused", label: "Paused" }')
    && learnView.includes('progressFilter === "paused"')
    && learnView.includes('ui("Paused")')
);
check(
  "the pause wording explains that nothing is lost",
  learnView.includes('Skip this pack in lessons. Nothing is deleted')
    && i18n.includes('"Pause": "Pausieren"')
    && i18n.includes('"Resume": "Fortsetzen"')
);

if (failures) {
  console.error(`\n${failures} paused-pack regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\npausing a pack keeps it out of every Continue Learning path");
