#!/usr/bin/env node
/**
 * What a user says to their assistant stays out of the public repository —
 * commit messages included.
 *
 * check-comment-hygiene has guarded the FILES for this from the start: no
 * names, no quoted requests, keep the reason and drop the source. Commit
 * messages never pass through it, because the gate reads the tree and a
 * message is not in the tree. So the rule everyone thought was enforced had a
 * door standing open, and through it went the users' names and, worse, their
 * literal words — a message on public main quoted a user's sentence verbatim,
 * attributed. Measured on the day this check was written: 120 public messages
 * carried one name, 64 the other.
 *
 * This scans the messages of every commit that exists locally but not on
 * origin/main — the ones the next push would publish. History is not scanned:
 * it already fails, and a gate that fails on the past can never pass again.
 * What is already public is a separate, deliberate operation (a history
 * rewrite), not something a check can quietly fix.
 *
 * A refused commit is REWORDED (git commit --amend, or a rebase for an older
 * one), never bypassed: the moment the message is pushed, no amend can ever
 * fully take it back.
 */
const { execFileSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

let range;
try {
  git("rev-parse", "--verify", "origin/main");
  range = "origin/main..HEAD";
} catch {
  // A checkout with no origin/main (a bare CI clone of one SHA) has nothing
  // outgoing to scan. Say so rather than silently passing.
  console.log("check-commit-privacy: no origin/main here, nothing outgoing to scan");
  process.exit(0);
}

const SEP = "\u0000";
const raw = git("log", "--format=%H%x00%B%x00%x00", range);
const commits = raw
  .split(`${SEP}${SEP}`)
  .map((entry) => entry.replace(/^\s+/, ""))
  .filter(Boolean)
  .map((entry) => {
    const [hash, ...rest] = entry.split(SEP);
    return { hash: (hash ?? "").trim().slice(0, 10), message: rest.join(SEP) ?? "" };
  })
  .filter((commit) => commit.hash);

/**
 * The same people check-comment-hygiene refuses in files. Word-bounded for
 * the same reason it gives: a variable named leonardo is nobody's name.
 */
const PEOPLE = [/\bLeon\b/u, /\bMichelle\b/u, /\bLeon2k909\b/iu, /\bMichelle0298\b/iu];

/**
 * The quoted segments of a message, paired shortest-first.
 *
 * Pairing matters more than it looks: two single-word quotes on one line —
 * a gloss here, a gloss there — must not have the prose BETWEEN them read as
 * one long quotation, which is what a greedy match does the moment a line
 * carries two of them. This check refused its own author's message that way
 * on its first day. Lazy pairing takes each opening quote to the nearest
 * closer, so every segment is what a reader would call the quote.
 */
function quotedSegments(message) {
  return [...message.matchAll(/["“]([^"“”\n]{0,300}?)["”]/gu)].map((match) => match[1]);
}

/**
 * A quoted sentence of real length. Messages here legitimately quote a word
 * or a short phrase — a gloss, a UI label — so short quotes pass. Five or
 * more words inside one pair of quotes is somebody's sentence, and in this
 * repository's history every such sentence was a user's message.
 */
function quotesASentence(message) {
  return quotedSegments(message).some((segment) => segment.trim().split(/\s+/).filter(Boolean).length >= 5);
}

/** The tell of an attributed quote, whatever its length: `someone: "..."`. */
const ATTRIBUTED = /\w:\s*["“][^"“”\n]{8,}?["”]/u;

const offenders = [];
for (const commit of commits) {
  const why = [];
  for (const person of PEOPLE) {
    if (person.test(commit.message)) why.push(`names a person (${person.source})`);
  }
  if (quotesASentence(commit.message)) why.push("quotes a sentence — keep the reason, drop the source");
  if (ATTRIBUTED.test(commit.message)) why.push("attributes a quote to someone");
  if (why.length) offenders.push({ hash: commit.hash, subject: commit.message.split("\n")[0].slice(0, 72), why });
}

if (offenders.length) {
  console.error("FAIL check-commit-privacy: outgoing commit messages carry conversation");
  for (const offender of offenders) {
    console.error(`  ${offender.hash}  ${offender.subject}`);
    for (const why of offender.why) console.error(`      - ${why}`);
  }
  console.error(
    "  Reword before pushing (git commit --amend for the tip, git rebase for older ones).\n"
    + "  The repository is public: describe the fault and the fix, never who reported it or what they said."
  );
  process.exit(1);
}

console.log(
  `check-commit-privacy: ${commits.length} outgoing message(s) carry no names and no quoted speech`
);
process.exit(0);
