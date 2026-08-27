#!/usr/bin/env node
/**
 * The Friends list holds real people, and only the ones invited.
 *
 * It used to be four invented names with invented streaks, and every button
 * under them admitted the action was a preview. It is now fed by other copies
 * of Micheon, over a direct encrypted channel between two computers. A broker
 * introduces them and sees that two codes want to talk; it is not a party to
 * what they say, and no account or profile is stored anywhere else.
 *
 * That design puts a listening socket on somebody's learning app, so the
 * things worth guarding are the ones that fail SILENTLY and in the wrong
 * direction:
 *
 * 1. A peer id is reachable by anything that speaks WebRTC. Being able to
 *    connect must therefore prove nothing — a stranger gets a question put to
 *    the person, never an automatic exchange, and never a row in the list.
 * 2. What travels is a fixed, small shape. If sending ever became "spread
 *    whatever we have", an email or a lesson history would leave the machine
 *    and nothing on screen would look different.
 * 3. What arrives is input, not data. It is rebuilt field by field with
 *    limits, because the sender is only PROBABLY another copy of this app.
 * 4. Freshness is judged on this machine's clock. A friend whose clock is a
 *    day fast must not read as active tomorrow.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { readFriendProfile, readFriendMessage, initialsFor } from "./src/lib/friendProfile.ts";',
      'export { addFriend, isFriend, loadFriends, presenceFor, recordFriendProfile, removeFriend } from "./src/lib/friendStore.ts";',
      'export { formatFriendCode, getFriendCode, normaliseFriendCode, peerIdForCode } from "./src/lib/friendCode.ts";',
      'export { decideIncoming } from "./src/lib/friendPeer.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "friends-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;
global.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
global.fetch = async () => { throw new Error("no network in a check"); };

const compiled = new Module("friends-check", module);
compiled.filename = path.join(root, ".friends-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { readFriendProfile, readFriendMessage, initialsFor, addFriend, isFriend,
  loadFriends, presenceFor, recordFriendProfile, removeFriend,
  formatFriendCode, getFriendCode, normaliseFriendCode, peerIdForCode,
  decideIncoming } = compiled.exports;

const CODE_A = "ABCDEFGHJKLMNPQRSTU";      // 19 — deliberately one short
const CODE_OK = "ABCDEFGHJKLMNPQRSTUV";    // 20
const CODE_TWO = "VWXYZ23456789ABCDEFG";

// ── the code ────────────────────────────────────────────────────────────────
assert.strictEqual(normaliseFriendCode(CODE_A), "",
  "a code of the wrong length is accepted, so a half-typed one would be tried against the broker");
assert.strictEqual(normaliseFriendCode(CODE_OK), CODE_OK, "a good code was rejected");
assert.strictEqual(normaliseFriendCode(" abcd-efgh-jklm-npqr-stuv "), CODE_OK,
  "the code has to survive being pasted with the groups and spacing it was shown with");
assert.ok(!/[IO01]/.test(formatFriendCode(getFriendCode())),
  "the alphabet contains I, O, 0 or 1 — the four characters people mistype when copying a code "
  + "off one screen into another, which presents as 'I typed it right and it says no such person'");
assert.strictEqual(getFriendCode(), getFriendCode(),
  "the code changes between calls, so a friend would be left holding an address that answers to nobody");
assert.ok(peerIdForCode(CODE_OK).startsWith("micheon-"),
  "the peer id is unprefixed, so it shares a namespace with every other app on the public broker");

// ── what arrives is input, not data ─────────────────────────────────────────
assert.strictEqual(readFriendProfile(null), null, "null was accepted as a profile");
assert.strictEqual(readFriendProfile("hello"), null, "a string was accepted as a profile");
assert.strictEqual(readFriendProfile({ v: 2, code: CODE_OK, name: "A" }), null,
  "a profile from a version this build does not know was accepted anyway");
assert.strictEqual(readFriendProfile({ v: 1, code: CODE_OK }), null, "a nameless profile was accepted");
assert.strictEqual(readFriendProfile({ v: 1, name: "A" }), null, "a codeless profile was accepted");

const hostile = readFriendProfile({
  v: 1,
  code: CODE_OK,
  name: "x".repeat(500),
  level: "y".repeat(500),
  streak: -12,
  totalXp: Number.MAX_SAFE_INTEGER,
  learningDays: "not a number",
  sentAt: 1_000,
  email: "leak@example.com",
  history: [1, 2, 3],
});
assert.ok(hostile, "a profile with hostile values was refused outright rather than cleaned");
assert.ok(hostile.name.length <= 40 && hostile.level.length <= 60,
  "unbounded text from the wire reaches the list, which lets a peer push the layout around");
assert.strictEqual(hostile.streak, 0, "a negative streak survived");
assert.ok(hostile.totalXp <= 100_000_000, "an unbounded XP figure survived");
assert.strictEqual(hostile.learningDays, 0, "a non-numeric count survived as something other than zero");
// The whole wire format, pinned. `photo` was added deliberately and carries
// its own rules in friendPhoto — a thumbnail going out, a proved raster image
// coming back. Everything else here is a figure the home page already shows a
// learner about themselves. Widening this list is the moment to ask whether
// the new field should be leaving the machine at all.
assert.deepStrictEqual(Object.keys(hostile).sort(),
  ["code", "learningDays", "level", "name", "photo", "sentAt", "streak", "totalXp", "v"],
  "fields nobody declared came through from the wire — the profile is being spread rather than rebuilt");
assert.strictEqual(hostile.photo, undefined,
  "a profile with no photo still produced one, so the field is not being read from the wire");

assert.strictEqual(readFriendMessage({ type: "nonsense", profile: {} }), null,
  "an unknown message type was accepted");
assert.ok(readFriendMessage({ type: "pair-request", profile: { v: 1, code: CODE_OK, name: "A" } }),
  "a well-formed pair request was refused");

// ── a stranger gets nothing ─────────────────────────────────────────────────
stored.clear();
assert.strictEqual(recordFriendProfile({ v: 1, code: CODE_OK, name: "Stranger", level: "", streak: 9, totalXp: 9, learningDays: 9, sentAt: 1 }), false,
  "a profile from a code nobody invited was filed. Anyone who reached this peer could then put "
  + "themselves in somebody's Friends list");
assert.strictEqual(loadFriends().length, 0, "the list grew from a message alone");
assert.strictEqual(isFriend(CODE_OK), false, "an uninvited code counts as a friend");

// ── and an invited one is kept ──────────────────────────────────────────────
assert.strictEqual(addFriend(CODE_OK, "Anna Fischer"), true, "an invited code was not added");
assert.strictEqual(addFriend(CODE_OK, "Anna Fischer"), false, "the same person can be added twice");
assert.strictEqual(recordFriendProfile({ v: 1, code: CODE_OK, name: "Anna Fischer", level: "Committed", streak: 14, totalXp: 2840, learningDays: 30, sentAt: 1 }), true,
  "a profile from an accepted friend was refused");
const [saved] = loadFriends();
assert.strictEqual(saved.profile.totalXp, 2840, "the figures did not survive being stored");
assert.ok(saved.seenAt > 0, "nothing recorded when the profile arrived, so freshness cannot be judged");

// The list has to outlive the process, or a friend vanishes on restart.
assert.strictEqual(loadFriends().length, 1, "the list did not persist");
removeFriend(CODE_OK);
assert.strictEqual(loadFriends().length, 0, "removing a friend left them in the list");

// ── freshness is judged here, not there ─────────────────────────────────────
const noon = new Date(2026, 0, 15, 12, 0, 0).getTime();
const DAY = 24 * 60 * 60 * 1000;
const friendAt = (seenAt) => ({ code: CODE_TWO, name: "A", addedAt: 0, seenAt });
assert.strictEqual(presenceFor(friendAt(noon - 60_000), false, noon), "today", "a friend seen an hour ago is not today");
assert.strictEqual(presenceFor(friendAt(noon - DAY), false, noon), "recent", "a friend seen yesterday is not recent");
assert.strictEqual(presenceFor(friendAt(noon - 5 * DAY), false, noon), "away", "a friend seen last week still reads as recent");
assert.strictEqual(presenceFor(friendAt(0), false, noon), "away", "a friend never heard from reads as something other than away");
assert.strictEqual(presenceFor(friendAt(noon - 5 * DAY), true, noon), "online",
  "somebody connected right now does not read as online");
// The sender's own clock must not decide this. A day fast is the realistic
// case — a wildly wrong clock would be caught by the bound on sentAt, and a
// check that only tries the wild one proves nothing about the ordinary one.
const future = { v: 1, code: CODE_TWO, name: "A", level: "", streak: 1, totalXp: 1, learningDays: 1, sentAt: noon + DAY };
addFriend(CODE_TWO, "A");
recordFriendProfile(future, noon - 5 * DAY);
const skewed = loadFriends()[0];
assert.strictEqual(skewed.profile.sentAt, noon + DAY,
  "the sender's timestamp was flattened in storage, so this cannot tell whose clock is being read");
assert.strictEqual(presenceFor(skewed, false, noon), "away",
  "a friend whose clock runs a day fast reads as recently active — freshness is being taken from "
  + "the sender's timestamp rather than from when this machine actually heard from them");

assert.strictEqual(initialsFor("Anna"), "A", "one name should give one initial");
assert.strictEqual(initialsFor("Jonas Weber"), "JW", "two names should give two initials");
assert.strictEqual(initialsFor("   "), "?", "a blank name should still render something");

// ── the screen shows the store, not a table of invented people ──────────────
const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
assert.ok(!shell.includes("const SOCIAL_FRIENDS"),
  "the invented friends are still declared, one edit away from being shown again");
assert.ok(!/Jonas Weber|Sophie Klein|Felix Braun|Emilia Koch/.test(shell),
  "invented people are still named in the shell");
assert.ok(shell.includes("<FriendsPanel"), "the Friends list is not the real one");

// ── and it does not describe itself as a mock-up ────────────────────────────
// The Friends list shares a screen with genuinely unbuilt things — leagues,
// challenges — which announce themselves through a banner headed "UI preview
// only". Its own messages were routed through that same banner, so a working
// feature reported "that code is twenty letters" under a heading saying
// nothing had happened. They are separate channels now, and the real one has
// no such heading.
assert.ok(shell.includes("const [notice, setNotice]"),
  "the Friends list has no message channel of its own again");
assert.ok(shell.includes("onNotice={(message) => setNotice(message)}"),
  "the Friends list reports itself through the preview banner, so a working feature is labelled "
  + "a preview of itself");
{
  const noticeBlock = shell.slice(shell.indexOf("{notice && ("), shell.indexOf("{previewNotice && ("));
  assert.ok(noticeBlock.length > 40, "the two notices could not be told apart");
  assert.ok(!noticeBlock.includes("UI preview only"),
    "the real notice carries the preview heading");
}

// Nothing beside the real list may invent a figure about a real person. The
// four made-up friends were removed for exactly this reason, and a progress
// card quoting a percentage towards a shared target nobody set is the same
// fault in the same aside — worse once the list beside it became true.
assert.ok(!shell.includes("68% of the way to a shared weekly target"),
  "an invented statistic about a named person sits beside the real Friends list");
assert.ok(!/showPreviewNotice\(ui\("Invite friend"\)\)/.test(shell),
  "the invite card still only previews an invite, next to a list that can actually add one");
assert.ok(shell.includes("formatFriendCode(getFriendCode())"),
  "the invite card does not offer the code it is inviting somebody with");

const panel = fs.readFileSync(path.join(root, "src/components/social/FriendsPanel.tsx"), "utf8");
assert.ok(panel.includes("loadFriends()"), "the panel does not read the stored friends");
// A friend who is offline must still appear, with their last figures.
assert.ok(panel.includes("friend.profile?.streak") && panel.includes("friend.profile?.totalXp"),
  "the row does not fall back to the last known figures, so a friend closing their laptop empties "
  + "the list and it reads as having no friends rather than nobody being online");

// ── nothing else travels ────────────────────────────────────────────────────
const profileSource = fs.readFileSync(path.join(root, "src/lib/friendProfile.ts"), "utf8");
// Comments stripped first: this reads the code, and the prose above it is
// free to discuss exactly what must not be sent.
const profileCode = profileSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
for (const word of ["email", "password", "token", "sessions", "grades"]) {
  assert.ok(!new RegExp(`\\b${word}\\b`, "i").test(profileCode),
    `the outgoing payload mentions "${word}", which has no business leaving this machine`);
}

// ── the trust rule itself, run rather than read ─────────────────────────────
// This was a search for the text "isFriend(code)" in the transport. Deleting
// one of its three uses — the one that guards an arriving profile — left the
// string present elsewhere and this green, which is to say a stranger's
// profile would have been filed and nothing here would have noticed. So the
// rule is a function now, and every combination is put through it.
assert.strictEqual(decideIncoming("profile", false), "ignore",
  "a profile from somebody not on the list is acted on. Anyone who can reach this peer could "
  + "write themselves into the Friends list");
assert.strictEqual(decideIncoming("pair-accepted", false), "ignore",
  "an unknown peer claiming to have accepted us is believed");
assert.strictEqual(decideIncoming("pair-request", false), "ask-the-person",
  "a stranger asking to connect is answered without the person ever being asked");
assert.strictEqual(decideIncoming("pair-request", true), "greet-back",
  "a friend saying hello again is treated as a fresh request, so the person is asked to approve "
  + "somebody they already approved");
assert.strictEqual(decideIncoming("profile", true), "accept", "a known friend's figures are ignored");
assert.strictEqual(decideIncoming("pair-accepted", true), "accept", "a known friend's acceptance is ignored");
assert.strictEqual(decideIncoming("pair-declined", true), "ignore", "a decline is treated as data");

const peerSource = fs.readFileSync(path.join(root, "src/lib/friendPeer.ts"), "utf8");
assert.ok(peerSource.includes("decideIncoming(message.type, isFriend(code))"),
  "the transport no longer routes through the trust rule, so the checks above guard a function "
  + "nothing calls");
assert.ok(peerSource.includes("onPairRequest"),
  "an unknown peer is handled without ever asking the person using the app");

console.log(
  "check-friends-p2p: codes are unmistakable and stable, an uninvited peer gets a question and no "
  + "data, arriving profiles are rebuilt with limits, freshness is judged on this machine's clock, "
  + "and the list shows real people or nobody"
);
process.exit(0);
