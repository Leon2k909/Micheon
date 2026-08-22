#!/usr/bin/env node
/**
 * Every screen that answers "how much German do I know" must answer it the
 * same way.
 *
 * There used to be two formulas. The dashboard outlook and the profile
 * fluency meter counted distinct items the learner can currently produce
 * (countKnownVocab). The games mastery ring, the profile word stat and the
 * word milestones added up `totalReviews` instead — a lifetime tally that
 * grows by half a lesson's steps every time a lesson is finished, counts the
 * same word again on every sitting, and can climb past the number of words in
 * the course. On a real profile the two disagreed by 781.
 *
 * This gate keeps them on one definition.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const failures = [];

// 1. The mastery ring takes the shared count and nothing else.
const mastery = read("src/components/lab/MasteryCard.tsx");
// One count in, nothing derived: `embedded` only drops the chrome for the
// merged profile card and must never become a second source of numbers.
if (!/export function MasteryCard\(\{\s*vocab,\s*embedded[^}]*\}/.test(mastery)) {
  failures.push("MasteryCard should take a single `vocab` count (the shared countKnownVocab number)");
}
if (/totalReviews/.test(mastery)) {
  failures.push("MasteryCard must not reach for totalReviews — that is a practice tally, not a word count");
}

// 2. The card lives on the profile page now (Games is beta, one account), and
//    the profile hands it the same shared count as everything else. Games
//    must not quietly grow its own vocabulary number back.
const games = read("src/games/GamesView.tsx");
if (/totalReviews|gameMasteryCount|MasteryCard/.test(games)) {
  failures.push("GamesView must not hold a vocabulary count — the mastery card moved to Profile & settings");
}
// Merged into the profile's single Mastery card (2026-08-19): "Your German
// progress" and "Vocabulary mastery" answered the same question side by side.
if (!/<MasteryCard vocab=\{vocab\} embedded \/>/.test(read("src/Gamification.tsx"))) {
  failures.push("the profile's Mastery card should embed MasteryCard with the shared vocab count");
}

// 3. The profile shows one number, not two side by side.
const profile = read("src/Gamification.tsx");
if (/const words = \(stats\.totalReviews/.test(profile)) {
  failures.push("Profile still derives a separate `words` figure from totalReviews");
}
if (/words=\{words\}/.test(profile)) {
  failures.push("Profile still passes the old `words` figure to its cards");
}

// 4. The word milestones agree with the meter above them.
for (const rel of ["src/Gamification.tsx", "src/lib/gamificationProgress.ts"]) {
  const source = read(rel);
  const wordMilestones = source.match(/id: "words_\d+"[\s\S]{0,400}?\},/g) || [];
  if (!wordMilestones.length) failures.push(`${rel}: no word milestones found — has this file moved?`);
  for (const block of wordMilestones) {
    if (/totalReviews/.test(block)) {
      failures.push(`${rel}: a "tracked words" milestone still counts totalReviews`);
    }
    if (!/countKnownVocab/.test(block)) {
      failures.push(`${rel}: a "tracked words" milestone should read countKnownVocab`);
    }
  }
}

// 5. The one definition is documented where it lives, so the next person
//    adding a progress surface reads it before inventing a third formula.
const fluency = read("src/lib/fluency.ts");
if (!/THE vocabulary number/.test(fluency)) {
  failures.push("fluency.ts should state that countKnownVocab is the single shared definition");
}

if (failures.length) {
  console.error("FAIL check-progress-consistency");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-progress-consistency: mastery ring, profile stat, milestones and fluency meter all read countKnownVocab");
