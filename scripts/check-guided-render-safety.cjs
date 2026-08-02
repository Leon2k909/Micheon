const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.resolve(__dirname, "../src/GuidedSession.tsx"), "utf8");
const renderTimeAdvance = /if\s*\(\s*!line\s*\)\s*\{\s*onNext\(\);\s*return null;\s*\}/u;

if (renderTimeAdvance.test(source)) {
  console.error("FAIL an empty dialogue advances the parent during React render");
  process.exit(1);
}

const requiredGuards = [
  ["empty dialogues advance from an effect", "missingLineHandled.current = true;\n    onNext();"],
  ["empty dialogues render no exercise UI", "if (!line) return null;"],
  ["the delayed focus timer is cleaned up", "return () => window.clearTimeout(timer);"],
];

let failed = false;
for (const [label, marker] of requiredGuards) {
  if (source.includes(marker)) {
    console.log(`ok   ${label}`);
  } else {
    failed = true;
    console.error(`FAIL ${label}`);
  }
}

if (failed) process.exit(1);
console.log("Guided-session render safety check passed.");
