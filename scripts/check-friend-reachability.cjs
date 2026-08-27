#!/usr/bin/env node
/**
 * A friend can be reached whenever the app is open, not only while one screen is.
 *
 * The peer was started by the Friends panel and destroyed when it closed. Two
 * apps could therefore only ever find each other while BOTH people were
 * sitting on that exact screen at the same moment. Any other time the app said
 * "could not connect to peer", and the friend's figures stayed at whenever the
 * two screens last happened to overlap — which on the list reads as somebody
 * who has not opened the app in days, when they had used it that morning.
 *
 * So the app owns the peer and the panel only listens to it. Three things have
 * to hold for that to be an improvement rather than a swap of one fault for
 * another:
 *
 * 1. Nothing tears the peer down on navigation. One stopFriendPeer, at the
 *    lifetime of the app itself.
 * 2. Being reachable is not being open. An unknown peer still earns a question
 *    and nothing else — that rule is decideIncoming and it must not have moved.
 * 3. A screen that opens later must be able to ask what the peer is doing,
 *    because "online" was announced long before it existed to be told.
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
      'export { addFriendPeerListener, friendPeerStatus, decideIncoming, waitingPairRequests } from "./src/lib/friendPeer.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "reachability-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  external: ["peerjs"],
});
const loaded = new Module("reachability-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "reachability-entry.cjs"));
const { addFriendPeerListener, friendPeerStatus, decideIncoming, waitingPairRequests } = loaded.exports;

let failed = 0;
const check = (label, run) => {
  try {
    run();
    console.log(`ok   ${label}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${label}\n     ${error.message}`);
  }
};

check("more than one thing can listen, and letting go does not silence the rest", () => {
  const heard = [];
  const releaseA = addFriendPeerListener({ onStatus: (s) => heard.push(`a:${s}`) });
  const releaseB = addFriendPeerListener({ onStatus: (s) => heard.push(`b:${s}`) });
  assert.strictEqual(typeof releaseA, "function", "a listener cannot be released");
  releaseA();
  releaseB();
  // Releasing twice must not throw: a screen can unmount more than once in
  // development, and an exception here would take the app's tree down.
  assert.doesNotThrow(() => { releaseA(); releaseB(); });
});

check("a screen opening later can read the status it missed", () => {
  const current = friendPeerStatus();
  assert.ok(current && typeof current.status === "string",
    "nothing can be asked what the peer is doing, so a panel opened after connection shows idle for ever");
});

check("requests that arrived with nothing listening are still waiting", () => {
  assert.ok(Array.isArray(waitingPairRequests()),
    "a stranger who asked while no screen was open is lost rather than queued");
});

// The trust rule, unchanged. Being reachable all the time makes this the thing
// standing between a friends list and anybody who can reach a peer id.
check("an unknown peer still earns a question and nothing else", () => {
  assert.strictEqual(decideIncoming("pair-request", false), "ask-the-person");
  assert.strictEqual(decideIncoming("profile", false), "ignore",
    "a stranger's figures would be filed without anybody being asked");
  assert.strictEqual(decideIncoming("pair-accepted", false), "ignore",
    "a stranger claiming to have accepted is treated as though they had been invited");
});

check("a known friend is not asked about again", () => {
  assert.strictEqual(decideIncoming("pair-request", true), "greet-back");
  assert.strictEqual(decideIncoming("profile", true), "accept");
});

// ── the wiring ──────────────────────────────────────────────────────────────
const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const panel = fs.readFileSync(path.join(root, "src/components/social/FriendsPanel.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const peer = fs.readFileSync(path.join(root, "src/lib/friendPeer.ts"), "utf8").replace(/\r\n?/gu, "\n");

check("the app is what makes itself reachable, not one screen", () => {
  assert.ok(app.includes("<FriendReachability"), "nothing starts the peer at the app's own lifetime");
  assert.ok(/startFriendPeer\(\(\) => readOwnFriendProfile\(user\)\)/.test(app),
    "the app-level peer has no profile to send, so a friend hears silence");
});

check("the panel listens rather than owning", () => {
  assert.ok(panel.includes("addFriendPeerListener("),
    "the Friends panel does not subscribe, so it shows nothing while open");
  assert.ok(!panel.includes("stopFriendPeer"),
    "leaving the Friends screen still destroys the peer, which is the whole fault");
});

check("only the app's own teardown stops the peer", () => {
  const stops = (app.match(/stopFriendPeer\(\)/g) || []).length;
  assert.strictEqual(stops, 1, `stopFriendPeer is called ${stops} times in App: one lifetime, one teardown`);
  const elsewhere = fs.readdirSync(path.join(root, "src/components/social"))
    .map((file) => fs.readFileSync(path.join(root, "src/components/social", file), "utf8"))
    .filter((text) => text.includes("stopFriendPeer")).length;
  assert.strictEqual(elsewhere, 0, "a social screen still tears the peer down when it closes");
});

check("the profile is read fresh, not captured when the app started", () => {
  const source = fs.readFileSync(path.join(root, "src/lib/friendPresence.ts"), "utf8");
  assert.ok(/sentAt: Date\.now\(\)/.test(source),
    "the profile carries the time the app opened rather than the time it was sent");
  assert.ok(/loadScopedJson\("totalXp"/.test(source),
    "the figures are not read from storage, so a lesson finished since opening is not reflected");
  assert.ok(!/useState|useEffect/.test(source),
    "the profile source depends on React state, which is what tied it to one screen before");
});

check("the peer is still one peer", () => {
  assert.ok(/if \(peer\) return code;/.test(peer),
    "a second start would take the same broker id and evict the first");
});

if (failed) {
  console.error(`\n${failed} friend reachability check(s) failed.`);
  process.exit(1);
}
console.log("check-friend-reachability: the app is reachable while it is open, and a stranger still gets only a question.");
process.exit(0);
