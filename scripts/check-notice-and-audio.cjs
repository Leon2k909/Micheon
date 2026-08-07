#!/usr/bin/env node
/**
 * Three small promises the interface makes.
 *
 * 1. The "Marked as …" notice clears itself, but never while it is being
 *    read or aimed at.
 * 2. A play button that produces no sound explains why and offers to fix it,
 *    instead of looking broken.
 * 3. The bell can be filtered and muted, and the badge respects that.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const failures = [];

// ── 1. the self-clearing undo notice ──────────────────────────────────────
const guided = read("src/GuidedSession.tsx");
if (!/const MANUAL_REVIEW_NOTICE_MS = \d+;/.test(guided)) {
  failures.push("GuidedSession: the notice needs a timeout for how long it stays up");
}
if (!/setTimeout\(\(\) => setLastManualReviewChange\(null\), MANUAL_REVIEW_NOTICE_MS\)/.test(guided)) {
  failures.push("GuidedSession: nothing clears the notice when the timeout elapses");
}
if (!/if \(reviewNoticeHeld\) return undefined;/.test(guided)) {
  failures.push("GuidedSession: the countdown must pause while the notice is held");
}
// The notice has two faces: a floating toast and a copy inside the card. The
// in-card one is driven by its own local state, so clearing the parent notice
// on its own left that copy sitting on the card for the rest of the lesson.
if (!/if \(!manualReviewNotice\) setGrade\(null\);/.test(guided)) {
  failures.push("GuidedSession: the in-card banner must clear when the notice does, not outlive it");
}
// Both the floating toast and the in-card note have to hold it, or one of the
// two can still disappear while you are reaching for Undo. The in-card note is
// one component rendered inside every verdict card, so the handlers are
// counted where they are declared rather than per card.
// Sliced rather than matched: the component's own type annotation closes with
// "}) {" at column 0, which a lazy regex stops at, capturing only a signature
// that contains none of the handlers being looked for.
const noteStart = guided.indexOf("function ManualReviewNote");
const noteEnd = noteStart === -1 ? -1 : guided.indexOf("\nfunction ", noteStart + 1);
const noteComponent = noteStart === -1 ? "" : guided.slice(noteStart, noteEnd === -1 ? undefined : noteEnd);
if (!noteComponent) {
  failures.push("GuidedSession: the in-card note component is gone");
}
for (const handler of ["onMouseEnter", "onMouseLeave", "onFocusCapture", "onBlurCapture"]) {
  const onToast = new RegExp(handler + "=\{(holdReviewNotice|releaseReviewNotice)\}").test(guided);
  const onNote = new RegExp(handler + "=\{(onHold|onRelease)\}").test(noteComponent);
  if (!onToast) failures.push(`GuidedSession: ${handler} is missing from the floating toast`);
  if (!onNote) failures.push(`GuidedSession: ${handler} is missing from the in-card note`);
}
// And the note has to live INSIDE the verdict card. As its own banner above
// "Not quite" it read as a second, unrelated thing happening.
// And it needs somewhere to go when there is NO verdict on screen. Marking a
// level or a snooze before answering suppresses the floating toast, so
// without this Undo is simply not rendered anywhere.
if (!/!verdictShowing && \(/.test(guided) || !/fs-standalone-note/.test(guided)) {
  failures.push("GuidedSession: with no verdict card on screen the marked-as note has nowhere to render, so Undo disappears");
}
const cardsWithNote = (guided.match(/<ManualReviewNote /g) || []).length;
const cards = (guided.match(/"fs-result"/g) || []).length;
if (cardsWithNote < cards) {
  failures.push(`GuidedSession: ${cards - cardsWithNote} verdict card(s) do not carry the marked-as note`);
}

// ── 2. the silent play button ─────────────────────────────────────────────
const voice = read("src/lib/voice.ts");
if (!/reportSilencedPlayback\(lang, \(\) => \{ void tts\(/.test(voice)) {
  failures.push("voice.ts: tts() should report silenced playback and carry a replay");
}
if (!/reportSilencedPlayback\(items\[0\]\?\.lang/.test(voice)) {
  failures.push("voice.ts: ttsSequence() should report silenced playback too");
}
const prompt = read("src/lib/audioPrompt.ts");
for (const reason of ["master-muted", "master-volume", "language-muted", "language-volume"]) {
  if (!prompt.includes(`"${reason}"`)) failures.push(`audioPrompt.ts: missing the ${reason} case`);
}
if (!/setAudioMuted\(false\)/.test(prompt) || !/setTtsLanguageMuted\(language, false\)/.test(prompt)) {
  failures.push("audioPrompt.ts: accepting the prompt must actually turn the sound back on");
}
const main = read("src/main.tsx");
if (!/<SilencedAudioPrompt \/>/.test(main)) {
  failures.push("main.tsx: the prompt is not mounted, so no play button can raise it");
}
const promptUi = read("src/components/SilencedAudioPrompt.tsx");
if (!/restoreSilencedPlayback\(prompt\)/.test(promptUi) || !/replay\?\.\(\)/.test(promptUi)) {
  failures.push("SilencedAudioPrompt: saying yes should unmute AND play what was asked for");
}

// ── 3. the bell ───────────────────────────────────────────────────────────
const prefs = read("src/lib/notificationPrefs.ts");
for (const kind of ["reviews", "games", "streak", "progress"]) {
  if (!prefs.includes(`id: "${kind}"`)) failures.push(`notificationPrefs.ts: missing the ${kind} kind`);
}
if (!/saveScopedJson/.test(prefs)) failures.push("notificationPrefs.ts: choices should be saved per profile");

const shell = read("src/prototype/NewUiPrototype.tsx");
if (!/!mutedNotifications\.has\(item\.kind\)/.test(shell)) {
  failures.push("NewUiPrototype: muted kinds are not being filtered out of the list");
}
// The badge counts unread rather than every row; check-notification-actions
// pins that shape, so here just make sure it is never a fixed number.
if (!/<span aria-hidden="true">\{unreadNotifications\.length\}<\/span>/.test(shell)) {
  failures.push("NewUiPrototype: the badge should count what is actually unread, and vanish at zero");
}
if (!/setNotificationKindMuted\(kind\.id, !muted\)/.test(shell)) {
  failures.push("NewUiPrototype: the filter chips do not toggle anything");
}
if (!/np-notification-empty/.test(shell)) {
  failures.push("NewUiPrototype: muting everything should say so, not show a blank panel");
}

if (failures.length) {
  console.error("FAIL check-notice-and-audio");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-notice-and-audio: undo notice self-clears with hold, silent playback explains itself, bell filters and mutes");
