#!/usr/bin/env node
/**
 * A friend's picture is a picture, and it is small.
 *
 * The app lets someone put a photo on their own profile and keeps it as the
 * file picker handed it over — a phone camera's several megabytes, as a data
 * URL. Sharing that is two separate problems and this covers both.
 *
 * Going out: what is sent is a thumbnail made from it, not the original. The
 * profile is re-sent whenever the numbers change, and it is stored by every
 * machine that ever paired, so an unshrunk photo would be paid for repeatedly
 * on someone else's disk and someone else's connection.
 *
 * Coming back: it arrives over a channel anything that speaks WebRTC can
 * reach, and it ends in an <img> tag. So it is not a photo until proved one.
 * SVG is refused by name rather than by omission — it is a real image format,
 * an <img src> will happily render it, and it can carry script and fetch from
 * the network. A list of friends is not a place to run somebody's markup.
 *
 * The last assertion here is the one that matters most and is easiest to lose:
 * adding a field to the wire format must stay a deliberate act. The profile
 * carries what the Friends list prints and nothing else, and this pins the
 * whole set so that widening it has to be done on purpose.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { safeSharedPhoto, SHARED_PHOTO_MAX, SHARED_PHOTO_SIZE } from "./src/lib/friendPhoto.ts";',
      'export { readFriendProfile, readFriendMessage } from "./src/lib/friendProfile.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "friend-photo-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("friend-photo-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "friend-photo-entry.cjs"));
const { safeSharedPhoto, SHARED_PHOTO_MAX, readFriendProfile } = loaded.exports;

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

const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==";
const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ==";

check("an ordinary photo is accepted", () => {
  assert.strictEqual(safeSharedPhoto(PNG), PNG);
  assert.strictEqual(safeSharedPhoto(JPEG), JPEG);
  assert.strictEqual(safeSharedPhoto("data:image/webp;base64,UklGRh4AAABXRUJQ"), "data:image/webp;base64,UklGRh4AAABXRUJQ");
});

// Each of these renders, or tries to, if it reaches an <img src>.
const refused = [
  ["SVG, which can carry script", 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0i'],
  ["SVG written out in full", 'data:image/svg+xml,<svg onload="alert(1)"/>'],
  ["markup wearing an image label", 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='],
  ["a script URL", "javascript:alert(1)"],
  ["a remote address, which would phone home when drawn", "https://example.com/tracker.png"],
  ["a bare path", "/etc/passwd"],
  ["base64 with markup smuggled into it", 'data:image/png;base64,abc"onerror="alert(1)'],
  ["a data URL that is not base64 at all", "data:image/png,rawbytes"],
  ["nothing", ""],
  ["a number", 42],
  ["an object", { toString: () => PNG }],
  ["null", null],
];
for (const [label, value] of refused) {
  check(`refused: ${label}`, () => {
    assert.strictEqual(safeSharedPhoto(value), undefined,
      `accepted ${JSON.stringify(String(value)).slice(0, 60)}`);
  });
}

check("a photo past the cap is refused whole, not truncated", () => {
  const huge = "data:image/png;base64," + "A".repeat(SHARED_PHOTO_MAX);
  assert.ok(huge.length > SHARED_PHOTO_MAX, "the test photo is not actually oversized");
  assert.strictEqual(safeSharedPhoto(huge), undefined, "an oversized photo was accepted");
});

check("the cap is small enough that a friends list cannot fill the quota", () => {
  assert.ok(SHARED_PHOTO_MAX <= 64_000, `the cap is ${SHARED_PHOTO_MAX}, which 100 friends would turn into megabytes`);
});

// ── and the profile around it ───────────────────────────────────────────────
const base = { v: 1, code: "ABC123", name: "A Friend", level: "Getting started", streak: 3, totalXp: 40, learningDays: 2, sentAt: 1700000000000 };

check("a friend with no photo is still a friend", () => {
  const profile = readFriendProfile(base);
  assert.ok(profile, "a profile without a photo was dropped");
  assert.strictEqual(profile.photo, undefined);
});

check("a friend with a bad photo keeps their name and figures", () => {
  const profile = readFriendProfile({ ...base, photo: 'data:image/svg+xml,<svg onload="x"/>' });
  assert.ok(profile, "the whole profile was dropped over its photo");
  assert.strictEqual(profile.photo, undefined, "the refused photo was stored anyway");
  assert.strictEqual(profile.name, "A Friend");
  assert.strictEqual(profile.totalXp, 40);
});

check("a friend with a good photo keeps it", () => {
  assert.strictEqual(readFriendProfile({ ...base, photo: PNG }).photo, PNG);
});

check("nothing else rides in on the profile", () => {
  const profile = readFriendProfile({
    ...base,
    photo: PNG,
    email: "someone@example.com",
    words: ["a", "b"],
    history: [{ lesson: 1 }],
    token: "secret",
  });
  assert.deepStrictEqual(
    Object.keys(profile).sort(),
    ["code", "learningDays", "level", "name", "photo", "sentAt", "streak", "totalXp", "v"],
    "the profile gained a field: check it is meant to leave the machine"
  );
});

if (failed) {
  console.error(`\n${failed} friend photo check(s) failed.`);
  process.exit(1);
}
console.log("check-friend-photo: a shared photo is a small raster image, or it is nothing.");
process.exit(0);
