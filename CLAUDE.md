# Working on Micheon

## Do not put the conversation in the repository

Commit messages and code comments are permanent, public, and read by people who
were not in the room. The chat that produced a change is none of those things.

**Never write in a commit message or a comment:**

- A quote from the user. Not verbatim, not paraphrased, not "as requested".
- A user's name — no "Leon", no "Michelle", no "she asked for", "he wanted",
  "on his account", "her brief".
- The shape of the conversation: "when this was pointed out", "the complaint
  was", "this came back a second time", "the report said".
- Anything about the session that produced the change: what was tried first,
  which agent found it, how long it took, how many rounds of review.

The repository is `github.com/Leon2k909/Micheon` and it is public. A commit
message quoting somebody by name puts their words and their name in a log that
cannot be edited afterwards.

**Write the reason, not its source.** Almost every one of these comments is
carrying something worth keeping — it is only the attribution that has to go.

```
✗  Leon: "im learning some pretty random advanced words". So the queue is
   now ordered by frequency.
✓  The queue is ordered by frequency. Ordered by pack, it reached rare
   words like der Saal at position 2,450 while everyday ones waited.

✗  Michelle asked for Hidden apps at the foot of the nav, separated from
   the sections above it.
✓  Hidden apps sits at the foot of the nav, separated from the sections
   above, so the way back is always on screen.

✗  Fixed the bug Leon reported where the XP had a full stop in it.
✓  XP is formatted through uiNumber, which follows the interface language
   rather than the OS locale. toLocaleString() with no argument gave
   "18.935" to an English reader.
```

A rule of thumb: if a sentence would not make sense to somebody reading this
file in five years with no access to any chat, it is about the conversation
and not about the code.

`scripts/check-comment-hygiene.cjs` enforces this for comments on every build.
Nothing can enforce it for commit messages, so it is on you.

## Comments earn their place or come out

Volume is not thoroughness. A comment is worth writing when it says something
the code cannot:

- **Why**, when the why is not obvious — a constraint, a rejected alternative,
  a bug this shape prevents, a number that came from measuring something.
- **A trap**, where the obvious change would break something non-locally.
- **A contract** a caller has to honour.

Do not write a comment that restates the line under it, narrates what the
function does step by step, announces a section (`// --- state ---`), or
records that something was changed, fixed or added. Git already knows the last
one, and the others go stale the first time somebody edits the code.

When you touch a file and find a comment that fails this, delete it. That is
not scope creep; leaving it is.

## Everything goes to main

Work on `main`, or on a throwaway worktree branched from it. There is no
review branch and no PR to open. The full chain for a change is:

```
npm run build        # ~105 checks, then vite build — all of it must pass
git commit && push   # to main
npx electron-builder --win --publish never
```

then install the result silently and confirm the change is in the shipped
build, not just in the source.

Another session works in this repository at the same time. Fetch before you
start, and expect `main` to move under you mid-task.

## Checks are the memory

`scripts/check-*.cjs` is where a decision is kept once it is made. If you fix
something a reader would call a bug, add or extend the check that would have
caught it, and prove the check fails without the fix. A check that cannot
fail is worse than no check, because it reads as coverage.

The checks compile the real TypeScript with esbuild and assert on real
behaviour rather than on the text of the source, wherever that is possible.
Some necessarily read the source; those pin behaviour, not formatting, so a
harmless reformat must not fail them.
