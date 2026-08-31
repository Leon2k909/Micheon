// Three small promises about the lesson card.
//
//  1. The sentence is ordinary selectable text. Each word is a tap target, and
//     when those were <button>s a mousedown started a press rather than a
//     selection — so dragging across them to highlight the sentence fought the
//     browser the whole way.
//  2. There is no separate "Hear it" replay button: tapping any word speaks
//     it, and the second door to the same audio was removed. The speed
//     menu it used to host survives as a header control.
//  3. The speed presets stop where the voice actually stops. The server turns
//     the rate into an edge-tts "+N%" and clamps at +100%, so offering more
//     than 2x would promise something that silently comes back at 2x.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const guided = read("src/GuidedSession.tsx");
const css = read("src/index.css");
const audio = read("src/lib/audioMute.ts");
const speedControl = read("src/components/SpeechSpeedControl.tsx");
const server = read("server/index.js");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── 1. the sentence selects like text ──────────────────────────────────────
// Shared with Listen and the passages now, so it has its own file.
const tappable = fs.readFileSync(path.join(root, "src/components/shared/TappableSentence.tsx"), "utf8");
const wordEl = tappable.slice(0, tappable.indexOf("{popoverOpen && ("));
check(
  "each word is a span, not a button, so a drag starts a selection",
  /<span\s+role="button"\s+tabIndex=\{0\}\s+className=\{cn\("fs-word"/.test(wordEl),
  wordEl.replace(/\s+/g, " ").slice(0, 140)
);
check(
  "it keeps keyboard access now that it is not a real button",
  wordEl.includes("onKeyDown=") && /event\.key !== "Enter" && event\.key !== " "/.test(wordEl)
);
check(
  // The scope was widened when the component moved out of the lesson, so the
  // same rule now also covers Listen and the passages.
  "the words are explicitly selectable and not draggable",
  /:is\(\.guided-session, \.fs-tappable-sentence\) \.fs-word \{[\s\S]{0,320}?user-select: text;[\s\S]{0,120}?-webkit-user-drag: none;/.test(css)
);
check(
  "copying a selection still puts the spaces back",
  tappable.includes("copySelectionWithSpaces")
    && tappable.includes('querySelectorAll<HTMLElement>(".fs-word")')
);

// ── 2. one door to the audio, speed still reachable ───────────────────────
check(
  "the Hear it replay button stays removed — tapping a word is how you hear it",
  // "Hear it" the PHRASE survives as the tap-a-word labels; the BUTTON and
  // its "Tap to replay" subtitle are what must stay gone.
  !guided.includes("HearItButton") && !guided.includes('ui("Tap to replay")')
);
check(
  "the lesson keeps exactly one audio control, the mixer",
  !guided.includes("SpeechSpeedMenuButton")
    && !guided.includes('testId="lesson-speech-speed"')
    && guided.includes("<MuteButton")
);

// ── 2b. word order is presented as a focused reorder exercise ─────────────
check(
  "the word-order stage names the learner's actual task",
  guided.includes('case "Order": return "Reorder the sentence";')
    && guided.includes('if (p === "Order") return "Reorder";')
);
check(
  "reorder shows the meaning cue instead of an anonymous dot placeholder",
  guided.includes('className="fs-reorder-prompt"')
    && guided.includes("{shownEnglish}")
    && !/phase === "Order" && !\(orderChecked && orderIsCorrect\) \? "[^\"]*"/.test(guided)
);
check(
  "reorder remains operable by drag, click, and arrow keys",
  guided.includes("draggable={!orderLocked}")
    && guided.includes("selectOrderToken(tokenIndex)")
    && guided.includes('event.key === "ArrowLeft"')
    && guided.includes('event.key === "ArrowRight"')
);

// ── 2c. a missed listening round retries from the keyboard ─────────────────
// Space, R and → are the "hear it and try again" button without the mouse.
// They ride the same per-phase choice-key handler, in the CAPTURE phase so →
// beats the bubble-phase stage-nav arrows (which skip defaultPrevented events).
check(
  "Space, R and ArrowRight retry a missed listening or missing-word round",
  (guided.match(/event\.key === " " \|\| event\.key === "r" \|\| event\.key === "R" \|\| event\.key === "ArrowRight"/g) || []).length >= 2
    && guided.includes("retryListening();")
    && guided.includes("retryMissingWord();")
);
check(
  "the retry keys outrank the stage-nav arrows",
  (guided.match(/window\.addEventListener\("keydown", handleChoiceKey, true\)/g) || []).length >= 2
);

// ── 2d. the audio round is finishable without a mouse ──────────────────────
// Every other choice round shows its options, so a number key answering with
// one is a considered choice. This round hides them behind audio on purpose —
// telling the three apart by ear IS the task — so the same key was answering
// with an option the learner had not heard, and the play buttons had no
// keyboard route to them at all. A number plays, Enter commits what played.
check(
  "a number key plays a missing-word option instead of answering with it",
  guided.includes("const option = missingWordChoices[Number(event.key) - 1];")
    && /if \(option\) \{\s*\n\s*event\.preventDefault\(\);\s*\n\s*previewMissingWord\(option\);/u.test(guided)
    // The committing path must NOT be reachable straight from a digit.
    && !/const option = missingWordChoices\[Number\(event\.key\) - 1\];[\s\S]{0,400}?setMissingWordChecked\(true\)/u.test(guided)
);
check(
  "Enter commits the option that was played, and only if one was",
  /event\.key === "Enter" && missingWordPreview/u.test(guided)
    && guided.includes("selectMissingWord(missingWordPreview)")
);
check(
  "the armed option stays visible after its audio stops",
  guided.includes('!missingWordChecked && missingWordPreview === choice && "is-armed"')
    && css.includes(".guided-session .fs-missing-audio-option.is-armed")
);
check(
  "and the keys are named where the choosing happens",
  guided.includes('ui("Press 1, 2 or 3 to hear an option again, then Enter to choose it.")')
);
check(
  "the retry keys are shown next to the button",
  (guided.match(/<kbd>\{ui\("Space"\)\}<\/kbd> <kbd>R<\/kbd> <kbd>→<\/kbd>/g) || []).length >= 2
);
// The light-theme cream .bg-zinc-100 override carries !important; the dark
// remap must match its weight or the retry buttons render cream with light
// text in dark mode — unreadable both ways.
check(
  "dark mode wins the retry surface back from the cream !important override",
  /html\[data-theme="dark"\] \.guided-session\.fs-app\.prototype-guided-session \.bg-zinc-100 \{\s*background: #232a35 !important;/.test(css)
    && /html\[data-theme="dark"\] \.guided-session\.fs-app\.prototype-guided-session :is\( \.hover\\:bg-zinc-50,\.hover\\:bg-zinc-100,\.hover\\:bg-zinc-200 \):hover \{\s*background: #173a24 !important;/.test(css)
);

// ── 3. the speed range matches what the voice can render ───────────────────
const presets = JSON.parse(
  (audio.match(/TTS_SPEED_PRESETS = (\[[^\]]+\])/) ?? [])[1].replace(/\s+/g, "")
);
const storedCap = Number((audio.match(/return Math\.min\((\d+(?:\.\d+)?), Math\.max\(0\.5/) ?? [])[1]);
const serverCapPercent = Number((server.match(/Math\.min\((\d+),\s*Math\.round\(\(r - 1\) \* 100\)\)/) ?? [])[1]);
const serverCap = 1 + serverCapPercent / 100;

check("the presets are ordered and start at half speed", presets[0] === 0.5 && presets.every((v, i, a) => i === 0 || v > a[i - 1]));
check(
  `the fastest preset is what the server can actually render (${serverCap}x)`,
  Math.max(...presets) === serverCap,
  `presets max ${Math.max(...presets)} vs server ${serverCap}`
);
check(
  "a stored speed can never exceed what the server renders",
  storedCap === serverCap,
  `stored cap ${storedCap} vs server ${serverCap}`
);
check(
  "the layouts size themselves from the preset list rather than a fixed four",
  css.includes("grid-template-columns: repeat(auto-fit, minmax(52px, 1fr));")
    && speedControl.includes("TTS_SPEED_PRESETS.map")
    // The lesson no longer hosts a speed control of its own (the mixer owns
    // it), and it must never hand-roll speed buttons instead.
    && !guided.includes("fs-speed-option")
);

// ── 4. final bilingual recall prefers the target without locking either box ─
check(
  "Recall both focuses the learning language but keeps both boxes available",
  guided.includes("const checkRecallBothTarget = () =>")
    && guided.includes("autoFocus")
    && (guided.match(/disabled=\{recallCompletionScheduledRef\.current\}/g) || []).length >= 2
    && !guided.includes('disabled={!recallBothTargetReady || recallCompletionScheduledRef.current}')
    && !guided.includes('disabled={recallBothTargetReady || recallCompletionScheduledRef.current}')
    && !guided.includes('!recallBothTargetReady && "is-waiting"')
);
check(
  "a correct first answer moves focus to the second language",
  guided.includes("window.setTimeout(() => recallBothMeaningRef.current?.focus(), 50)")
    && guided.includes('useStickyFocus(recallBothTargetRef, phase === "RecallBoth" && !recallBothTargetReady)')
    && guided.includes("window.setTimeout(() => recallBothTargetRef.current?.focus(), 50)")
);
check(
  "the target-first order follows the selected learning direction",
  guided.includes('"{target} is ready to type. You can answer either box first; a correct {target} answer moves focus to {meaning}."')
    && guided.includes("{ target: ui(targetLabel), meaning: ui(meaningLabel) }")
);
check(
  "two correct recall answers advance without a Check both click",
  guided.includes('phase !== "RecallBoth"')
    && guided.includes("recallCompletionScheduledRef.current = true")
    && guided.includes("if (recallCompletionScheduledRef.current) onNext()")
    && guided.includes('this effect is their single')
);

// ── The session's raised key ──────────────────────────────────────
// The quick path had a Check button of its own, built to match this one, and
// a copy of it in CSS. Both are gone with the mode; what is left is the key
// this check was really about.
check(
  "the guided session's key takes its edge from the accent, not a hardcoded gold",
  css.includes("0 5px 0 var(--accent-pressed, #a77b00)")
);

// ── the route asks for each thing once ───────────────────────────────
// It used to ask for the same sentence in writing nine times, and four of
// those were the same question re-asked with nothing changed between the
// asks: Type then Type again, Translate then Translate again, and two
// single-direction recalls in front of the one that covers both. Repetition
// is the point of the route; asking twice in a row is not repetition.
{
  const phases = read("src/lib/guidedLessonPhases.ts");
  const route = (/export const SENTENCE_PHASES = \[([\s\S]*?)\]/.exec(phases) || ["", ""])[1]
    .match(/"[A-Za-z]+"/g) || [];
  for (const gone of ['"TypeAgain"', '"TranslateAgain"', '"RecallTarget"', '"RecallMeaning"']) {
    check(
      `the sentence route does not ask again with ${gone.replace(/"/g, "")}`,
      !route.includes(gone),
      "a stage that repeats one already in the route is back in it"
    );
  }
  check(
    "and the two Again stages are gone from the lesson entirely, not merely unrouted",
    !guided.includes("TypeAgain") && !guided.includes("TranslateAgain"),
    "the stages still exist with no route reaching them, which is a screen nobody can get to"
  );
  // The closed-book pair still runs for material the learner already holds,
  // where one direction at a time is the right size of ask.
  check(
    "mastered material still recalls one direction at a time",
    /MASTERED_WORD_PHASES[\s\S]{0,160}"RecallTarget"[\s\S]{0,60}"RecallMeaning"/.test(phases)
  );
}

// ── how much course is left ──────────────────────────────────
// The header said where you were inside the sitting and nothing said where
// the sitting was inside the course, so the one question that makes a long
// course feel finite had no answer on screen.
check(
  "the lesson header says how much of the course is still unseen",
  guided.includes('"{phrases} new phrases left \u00b7 about {sittings} more lessons"')
    && guided.includes("sittingsLeft > 0 &&")
);
check(
  "the estimate is sittings, measured by this sitting rather than a fixed number",
  guided.includes("Math.ceil(unseenPhrases / exerciseCount)"),
  "a hardcoded lesson size is wrong for a word sitting and for mastered material"
);
{
  const host = read("src/guided_learning_session.tsx");
  check(
    "and the count is phrases the tracker has never seen, not a percentage",
    /statusForId\(grades, item\.id, item\.aliases\) === "new"/.test(host)
      && host.includes("const unseenPhrases = React.useMemo("),
    "counting anything else makes the number go up when a lesson goes badly"
  );
  check(
    "it is recomputed when a grade lands, so finishing a sitting moves it",
    /const unseenPhrases = React\.useMemo\([\s\S]{0,700}?\[catalog, gradeRevision, user\]/.test(host)
  );
}

// ── a wrong typed answer is written out, not skipped past ───────────────
// Skip used to sit beside Try again, directly under a panel that had just
// printed the sentence. So the cheapest way through a sentence you could not
// write was to read it and press the other button, and the one thing the
// stage exists to make you do was the one thing you could decline. The
// closed-book recall stages never offered that; these are the production
// stages brought into line with them.
for (const [handler, stage] of [
  ["retry", "typing the target"],
  ["retryEn", "translating it back"],
  ["retrySay", "writing it from memory"],
  ["retryGap", "filling the gap"],
  ["retryFr", "typing it in French"],
  ["retryMemory", "recalling both"],
]) {
  const opens = `<Button onClick={${handler}} variant="outline"`;
  const at = guided.indexOf(opens);
  const row = at < 0 ? "" : guided.slice(at, at + 600);
  check(
    `${stage}: a wrong answer is repaired rather than skipped past`,
    at >= 0
      // A lone full-width button, not one half of a pair — and no Skip after it.
      && row.includes("w-full")
      && !row.includes("flex-1")
      && !row.includes('ui("Skip")'),
    at < 0
      ? "the retry button is gone, so this stage no longer offers the repair at all"
      : "Skip is back beside Try again, under a panel that has just printed the answer"
  );
}

// ── the flag is the switch ──────────────────────────────────────────────────
// The flag on the typing prompt already says which variant you are being
// marked against, so it is the obvious thing to press to change it — rather
// you are being marked against, so it is the obvious thing to press — rather
// than leaving the lesson for Settings and coming back to it.
{
  const guided = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
  check(
    "the English flag on the typing prompt is a button",
    /<button[\s\S]{0,220}data-testid="english-variant-switch"/.test(guided),
    "it is still a plain span, so there is nothing to press"
  );
  check(
    "pressing it swaps British for American and back",
    guided.includes('setEnglishVariant(englishVariant === "british" ? "american" : "british")'),
    "the switch does not actually change the variant"
  );
  check(
    "the lesson follows the change while it is open",
    guided.includes("useEnglishVariant()") && !/getEnglishVariant\(\), \[\]\)/.test(guided),
    "the variant is still read once on mount, so switching needs a restart to show"
  );

  const lib = fs.readFileSync(path.join(root, "src/lib/englishVariant.ts"), "utf8");
  check(
    "changing the variant announces itself",
    lib.includes("ENGLISH_VARIANT_EVENT")
      && /dispatchEvent\(new CustomEvent\(ENGLISH_VARIANT_EVENT/.test(lib),
    "nothing on screen can know the setting changed"
  );
}

if (failures) {
  console.error(`\n${failures} lesson-control regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nthe sentence selects, the buttons match, the speeds are real, and the flag switches the English");
