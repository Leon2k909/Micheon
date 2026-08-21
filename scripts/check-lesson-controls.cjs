// Three small promises about the lesson card.
//
//  1. The sentence is ordinary selectable text. Each word is a tap target, and
//     when those were <button>s a mousedown started a press rather than a
//     selection — so dragging across them to highlight the sentence fought the
//     browser the whole way.
//  2. There is no separate "Hear it" replay button: tapping any word speaks
//     it, and Leon had the second door to the same audio removed. The speed
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
const tappable = guided.slice(guided.indexOf("function TappableSentence("));
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
  "the words are explicitly selectable and not draggable",
  /\.guided-session \.fs-word \{[\s\S]{0,320}?user-select: text;[\s\S]{0,120}?-webkit-user-drag: none;/.test(css)
);
check(
  "copying a selection still puts the spaces back",
  guided.includes("copySelectionWithSpaces")
    && guided.includes('querySelectorAll<HTMLElement>(".fs-word")')
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
  guided.includes('? "English is ready to type. You can answer either box first; a correct English answer moves focus to German."')
    && guided.includes(': "German is ready to type. You can answer either box first; a correct German answer moves focus to English."')
);
check(
  "two correct recall answers advance without a Check both click",
  guided.includes('phase !== "RecallBoth"')
    && guided.includes("recallCompletionScheduledRef.current = true")
    && guided.includes("if (recallCompletionScheduledRef.current) onNext()")
    && guided.includes('this effect is their single')
);

// ── The quick path grades a choice on the tap ───────────────────────────────
// Picking an answer and then reaching for Check underneath it was two actions
// where one would do, and the second never told us anything the first had not.
const duo = read("src/components/duo/DuoLesson.tsx");
// index.css is already read above as `css`.
check(
  "tapping a multiple-choice option grades it there and then",
  duo.includes("onClick={() => { setPicked(optionIndex); submit(optionIndex); }}")
    // The index has to travel as an argument: setPicked is asynchronous, so
    // reading `picked` inside submit would grade the previous selection.
    && duo.includes("const submit = useCallback((choice?: number)")
    && duo.includes("const chosen = choice ?? picked;")
);
check(
  "...so no Check button sits under a question that already graded itself",
  duo.includes("{!verdict && !exercise.options && (")
);
check(
  "an unanswered question is not marked wrong by a stray Return",
  duo.includes("if (chosen == null) return;")
);
check(
  "the quick path's Check button is the guided session's raised key",
  duo.includes('className="np-check-3d w-full"')
    && css.includes(".np-check-3d {")
    // Edge and ink from the accent, not the hardcoded gold this was copied
    // from — on a purple accent that edge rendered olive under a violet face.
    && /\.np-check-3d \{[^}]*0 5px 0 var\(--accent-pressed\)/s.test(css)
    && /\.np-check-3d \{[^}]*color: var\(--accent-text\)/s.test(css)
);
check(
  "...and the guided session's own key follows the accent too, so they match",
  css.includes("0 5px 0 var(--accent-pressed, #a77b00)")
);

// ── the flag is the switch ──────────────────────────────────────────────────
// Leon: "i should be able to click this to switch to eng uk or usa in
// guidedsession". The flag on the typing prompt already says which variant
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
