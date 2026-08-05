// Setting a review level has to behave the way the words on the menu promise.
//
// Two opposite mistakes are easy to make here, and the app has now made both:
//
//   1. Saying an item is "Mastered" or "Never review" and then being kept on
//      it, still asked to pick its meaning. The choice said "I'm done with
//      this"; the lesson ignored it.
//   2. Undo jumping the learner somewhere they never left, which restarts an
//      exercise at stage one and reads as losing your place.
//
// The rule that satisfies both: a mark moves you on only when it finishes the
// item, and undo returns you only when the mark moved you.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── which levels finish the item ───────────────────────────────────────────
const finishesFn = source.match(/function reviewLevelFinishesItem[\s\S]*?\n}/);
check("there is a single rule for which levels finish an item", Boolean(finishesFn));
if (finishesFn) {
  const body = finishesFn[0];
  check(
    "asking for MORE practice keeps you on the item",
    body.includes('level !== "struggle"') && body.includes('level !== "new"'),
    body.replace(/\s+/g, " ").slice(0, 120)
  );
}

// ── the picker acts on that rule ───────────────────────────────────────────
const picker = source.match(/const applyReviewLevelFromPicker[\s\S]*?\n  };/);
check("the level picker has its own handler", Boolean(picker));
if (picker) {
  const body = picker[0];
  check(
    "a finishing level moves the lesson on, exactly like Know it",
    body.includes("if (finishes) next();"),
    body.replace(/\s+/g, " ").slice(0, 160)
  );
  check(
    "and records where to come back to, but only when it moved you",
    body.includes("finishes ? index : undefined"),
    body.replace(/\s+/g, " ").slice(0, 160)
  );
}

// Both cards must route through it — a dialogue line marked Mastered should
// behave the same as a sentence marked Mastered.
check(
  "both the sentence card and the dialogue card use the picker handler",
  (source.match(/onReviewLevel=\{\([^)]*\) => applyReviewLevelFromPicker\(/g) ?? []).length === 2,
  `found ${(source.match(/applyReviewLevelFromPicker\(/g) ?? []).length} references`
);

// ── undo only travels when the mark travelled ──────────────────────────────
const undo = source.match(/const undoLastManualReviewChange[\s\S]*?\n  };/);
check("undo exists", Boolean(undo));
if (undo) {
  const body = undo[0];
  check(
    "undo returns you to the item the mark moved you off",
    body.includes("const { returnIndex } = lastManualReviewChange")
      && body.includes("setIndex(returnIndex!)"),
    body.replace(/\s+/g, " ").slice(0, 200)
  );
  check(
    "undo guards the index so it can never jump outside the lesson",
    body.includes("Number.isInteger(returnIndex)")
      && body.includes("returnIndex !== index")
      && body.includes("returnIndex! < safeSteps.length")
  );
}

// ── the in-place marks must still stay put ─────────────────────────────────
const markStruggle = source.match(/const markStruggle = \(\) => \{[\s\S]*?\n  \};/);
check(
  "marking Struggling on the card still keeps you on it",
  Boolean(markStruggle) && !markStruggle[0].includes("onNext()"),
  markStruggle ? markStruggle[0].replace(/\s+/g, " ").slice(0, 140) : ""
);
check(
  "Know it still advances",
  /const markKnown = \(\) => \{[\s\S]*?onNext\(\);[\s\S]*?\n  \};/.test(source)
);
// "Mark struggle and continue" is an explicit navigation request, so undoing
// the grade must not drag the learner backwards.
check(
  "an explicit 'continue' records no return index",
  /markStruggleAndContinue[\s\S]*?applyManualReviewChange\(struggleIdsForStep\(current\), "struggle"\);/.test(source)
);

// ── the notice has to say WHAT it is offering to undo ─────────────────────
check(
  "the mark records which phrase it applied to",
  source.includes("const describeMarkedItems") && source.includes("subject: describeMarkedItems(ids)")
);
check(
  "several dialogue lines marked together are summarised, not listed",
  /found\.length === 1 \? found\[0\] : `\$\{found\.length\} lines`/.test(source)
);
check(
  "the notice names the phrase, and so does the Undo control",
  source.includes("lastManualReviewChange.subject ? <> — “{lastManualReviewChange.subject}”</> : null")
    && /aria-label=\{lastManualReviewChange\.subject/.test(source)
);

if (failures) {
  console.error(`\n${failures} review-level flow regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nfinishing an item moves on; undo returns only when the mark moved you");
