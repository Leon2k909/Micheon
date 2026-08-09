// Three small promises about the lesson card.
//
//  1. The sentence is ordinary selectable text. Each word is a tap target, and
//     when those were <button>s a mousedown started a press rather than a
//     selection — so dragging across them to highlight the sentence fought the
//     browser the whole way.
//  2. "Hear it" is a button and should look like the buttons beside it. It was
//     listed with the boards and panels, which gave it their deeper 5px lip.
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

// ── 2. "Hear it" matches its neighbours ────────────────────────────────────
const panelGroup = css.slice(css.indexOf(".fs-match-direction,"), css.indexOf(".fs-recall-board\n)"));
check(
  '"Hear it" is not styled as a board or panel',
  !/^\s*\.fs-listen,\s*$/m.test(panelGroup),
  "fs-listen is still inside the panel :is() group"
);
const listenRule = css.slice(css.indexOf(".guided-session.fs-app.prototype-guided-session .fs-listen {"));
const listenBlock = listenRule.slice(0, listenRule.indexOf("}"));
const gradeRule = css.slice(css.indexOf(".guided-session.fs-app.prototype-guided-session .grade-btn {"));
const gradeBlock = gradeRule.slice(0, gradeRule.indexOf("}"));
const lip = (block) => (block.match(/0 (\d+)px 0 rgba\(([^)]+)\)/) ?? []).slice(1).join("/");
check(
  "it sits on the same bottom lip as the buttons beside it",
  lip(listenBlock) === lip(gradeBlock) && lip(listenBlock) !== "",
  `Hear it ${lip(listenBlock) || "none"} vs grade-btn ${lip(gradeBlock) || "none"}`
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
    && /\.fs-speed-menu \{[\s\S]{0,220}?flex-wrap: wrap;/.test(css)
);

if (failures) {
  console.error(`\n${failures} lesson-control regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nthe sentence selects, the buttons match, and the speeds are real");
