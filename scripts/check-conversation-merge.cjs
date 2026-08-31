#!/usr/bin/env node
/**
 * Conversation is one screen with two halves, reached by one door.
 *
 * It was two features. Somebody speaking to you and you choosing what to say
 * back was a card on the Learn row that rendered inline behind a flag, with a
 * hand-rolled back button. Somebody writing to you and you saying what they
 * meant was Passages, a nav entry of its own. Neither can be passed by
 * recognising a word; both are about following a whole thought; and which of
 * them a learner ever met depended on which door they happened to try.
 *
 * So they are one destination, split only by the honest difference — spoken
 * at you, or written to you — as two views of one place.
 *
 * What this guards is that the merge stays a MERGE. A copy left rendering
 * inside Learn, a second mount of the reading half, or a nav entry still
 * naming one half would all look right on the screen they were opened from,
 * and would quietly be the two-features problem again.
 *
 * It reads text and nothing else, deliberately. These questions used to be
 * asked at the bottom of check-conversation-scenarios, where answering them
 * cost the whole 778-dialogue build — which made proving them by removing the
 * fix a minutes-long job per case, and a check nobody can afford to test is a
 * check nobody has tested.
 */
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// ── the screen holds both halves ────────────────────────────────────────────
const merged = read("src/components/conversation/ConversationAndReading.tsx");
check("the merged screen has the talking half", merged.includes("<ConversationView"),
  "somebody speaking to you is not on the screen that claims to hold it");
check("the merged screen has the reading half", merged.includes("<PassagesView"),
  "somebody writing to you is not on the screen that claims to hold it");
check("the two halves have a labelled switch",
  merged.includes('ui("Talking")') && merged.includes('ui("Reading")'),
  "there is no labelled way to get from one half to the other");
check("the switch says which half is showing",
  /aria-pressed=\{mode === key\}/.test(merged),
  "the buttons do not report their state, so neither a screen reader nor the styling knows");
check("both doors land on the same half",
  /useState<ConversationMode>\("talking"\)/.test(merged),
  "the screen opens differently depending on which door you came through, which is the split again");

// ── Learn points at it rather than keeping a copy ───────────────────────────
const learn = read("src/components/duo/DuoPathView.tsx");
check("the Conversation card has a label", learn.includes('ui("Say something back")'));
check("the Conversation card opens the destination", learn.includes("onClick={onConversation}"),
  "the card opens nothing");
check("Learn keeps no copy of its own",
  !learn.includes("<ConversationView") && !learn.includes("setConversing"),
  "Learn renders Conversation inline as well as pointing at the merged screen");

// ── and the shell has one door, named for what it opens ─────────────────────
const shell = read("src/prototype/NewUiPrototype.tsx");
check("there is no second nav entry",
  !shell.includes("CONVERSATION_NAVIGATION_ITEM") && !shell.includes("conversationUnlocked"),
  "one room, two doors");
check("the nav entry names the whole screen, not the half it used to be",
  /id: "passages", label: "Conversation"/.test(shell),
  "the entry says Passages and opens both halves");
check("the shell mounts the merged screen", shell.includes("<ConversationAndReading"),
  "the route renders something else");
check("the reading half is not also mounted on its own", !shell.includes("<PassagesView"),
  "the merge left a second door straight to the reading half");

/**
 * The talking half reads the catalogue, so the route has to ask for it.
 *
 * It used to be rendered inside the Learn screen, which is in that list. Now
 * it is its own route — and a route that never requests the catalogue shows
 * "0 scenes" and an empty grid, which looks exactly like a broken feature
 * rather than one that is still loading.
 */
check("the route asks for the catalogue its talking half needs",
  /const NEEDS_CATALOGUE: PrototypeView\[\] = \[[^\]]*"passages"/.test(shell),
  "opening Conversation never starts the catalogue, so the scenarios never arrive");

// ── in every language the app offers ────────────────────────────────────────
const TABLES = {
  German: "src/lib/i18nDe.ts",
  French: "src/lib/i18nFr.ts",
  Polish: "src/lib/i18nPl.ts",
  Spanish: "src/lib/i18nEs.ts",
  Italian: "src/lib/i18nIt.ts",
  Portuguese: "src/lib/i18nPt.ts",
};
for (const [language, file] of Object.entries(TABLES)) {
  const table = read(file);
  const missing = ["Talking", "Reading", "Conversation"].filter((key) => !table.includes(`"${key}":`));
  check(`the switch is readable in ${language}`, missing.length === 0,
    missing.length ? `untranslated: ${missing.join(", ")}` : "");
}

if (failed) {
  console.error(`\n${failed} conversation merge check(s) failed.`);
  process.exit(1);
}
console.log(
  "check-conversation-merge: one screen, both halves, one door named for what it opens — and the "
  + "switch between them reads in all six interface languages"
);
process.exit(0);
