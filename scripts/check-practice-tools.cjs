#!/usr/bin/env node
/**
 * A feature that fills the page has a way back, and Passages is beta only.
 *
 * Tests and Grammar are opened from the Practice hub and then take the whole
 * page. The sidebar keeps Practice lit while you are inside one, so the app
 * already calls them somewhere you went INTO — but there was nothing to come
 * back with. Clicking Practice in the sidebar is a different gesture from
 * undoing the step you just took, and on a narrow window the sidebar is not
 * even on screen.
 *
 * The gate is the half that fails silently. An unfinished feature shown to
 * everybody looks exactly like one shown to nobody, right up until an account
 * outside the allow-list opens it — and beta is only meant for the accounts
 * building the app.
 *
 * Passages used to be a third tool in that hub, gated so that only beta
 * accounts saw the card. It is beta ONLY now: not a Practice tool beta
 * accounts also get, but a beta entry Practice does not mention at all. That
 * is a stronger claim than the gate and is asserted as one, because a card
 * behind a flag is one edit away from being shown again.
 *
 * Moving it left two things still pointing at the old home, and both are the
 * kind nothing else catches — the types are identical either way, and so is
 * the render. A back control captioned "Back to Practice" that lands you
 * Home, and the Practice nav row lighting up for a hub Passages has left.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const view = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");

// ── every feature that fills the page can be left ───────────────────────────
for (const label of ["Tests", "Grammar"]) {
  assert.ok(
    view.includes(`<FeatureBackBar label={ui("${label}")} onBack={() => navigate("practice")} />`),
    `${label} fills the page with no way back to the Practice hub it was opened from`
  );
}
assert.ok(
  view.includes(`<FeatureBackBar back={ui("Back to Home")} label={ui("Passages")} onBack={() => navigate("home")} />`),
  "Passages either has no way back, or still backs out to the Practice hub — which no longer "
  + "offers it, so it would land somewhere with no sign of where you had just been"
);
assert.ok(styles.includes(".np-feature-back__btn {"), "the back control has no styling of its own");

// ── and the control says where it goes ──────────────────────────────────────
// The caption used to be one fixed string, which was true while every bar
// went to the same place. They do not any more. This reads the call sites
// rather than pinning them, so a fourth one added later is held to the rule
// too: go somewhere other than Practice, and you must say so.
const bars = view.match(/<FeatureBackBar\b[\s\S]*?\/>/g) ?? [];
assert.ok(bars.length >= 3, `only ${bars.length} back controls found — this can no longer see them`);
for (const bar of bars) {
  const destination = /navigate\("([a-z-]+)"\)/.exec(bar);
  assert.ok(destination, `a back control goes nowhere: ${bar}`);
  if (destination[1] === "practice") continue;
  assert.ok(bar.includes("back={ui("),
    `this back control goes to "${destination[1]}" but keeps the default "Back to Practice" `
    + `caption, so the one thing on screen claiming to know where you came from is wrong: ${bar}`);
}
assert.ok(view.includes('{back ?? ui("Back to Practice")}'),
  "the back control ignores the caption it is given, so every bar says Back to Practice again");
assert.ok(i18n.includes('"Back to Practice":'), "the back control has no German");
assert.ok(i18n.includes('"Back to Home":'), "the way out of Passages has no German");

// ── Passages is not a Practice tool ─────────────────────────────────────────
// Not "hidden from the hub" — absent from it. The tools array is where a
// Practice card is declared, so a Passages entry there in any form, gated or
// not, is what this refuses.
const toolsAt = view.indexOf("  const tools = [");
assert.ok(toolsAt > 0, "the Practice hub's tool list has moved, so this can no longer read it");
const tools = view.slice(toolsAt, view.indexOf("  ];", toolsAt));
assert.ok(!/passages/i.test(tools),
  "the Practice hub declares a Passages card. Passages is a beta entry now, not a Practice "
  + "tool — and a card behind a flag is one edit away from being shown to everybody");

// The nav decides what is lit from where you are. Passages has a row of its
// own now, which lights itself, so naming it here lights two rows at once —
// and the wrong one is Practice.
const practiceClauses = view.match(/item\.id === "practice" && \([^)]*\)/g) ?? [];
assert.strictEqual(practiceClauses.length, 2,
  `the sidebar and the phone bar each decide when Practice is lit, but ${practiceClauses.length} `
  + "of those clauses were found — one of them has moved out of reach of this check");
for (const clause of practiceClauses) {
  assert.ok(!clause.includes("passages"),
    "the Practice nav row lights up while Passages is open, alongside the Passages row itself. "
    + "Two rows lit, and the one that is wrong is the hub Passages just left");
}

// ── and it is still reachable on a phone ────────────────────────────────────
// Its only other entry is the beta list in the sidebar, and under 760px the
// sidebar is display:none. Leaving the hub therefore cost it every way in on
// a narrow window unless More carries one — which is exactly what Country
// studies does, and for exactly this reason.
const moreAt = view.indexOf("  const features: Array<{");
assert.ok(moreAt > 0, "the More directory has moved, so this can no longer read it");
const moreCards = view.slice(moreAt, view.indexOf("  ];", moreAt));
assert.ok(moreCards.includes('action: () => onNavigate("passages"),'),
  "under 760px the sidebar is hidden and Practice no longer offers Passages, so nothing opens "
  + "it at all — the move made it desktop-only");
assert.ok(moreCards.includes("...(passagesUnlocked ? [{"),
  "the More directory offers Passages to accounts that cannot open it");
assert.ok(/passagesUnlocked \? \[\{[\s\S]*?narrowOnly: true/.test(moreCards),
  "the Passages card shows on wide windows too, where the sidebar already lists it two "
  + "centimetres away");
assert.ok(view.includes('|| (item.id === "more" && activeView === "passages");'),
  "the phone bar lights nothing while Passages is open, though More is how you got there");

// ── Passages is behind the same gate as the rest of beta ────────────────────
// Three places, and all three matter: the entry that opens it, the view that
// renders it, and the redirect for an account already sitting on it.
assert.ok(view.includes("const passagesUnlocked = leonOnlyFeaturesUnlocked;"),
  "Passages is not gated on the accounts that can see beta");
assert.ok(view.includes('activeView === "passages" && passagesUnlocked ?'),
  "the Passages view renders for any account that reaches it, gate or no gate");
assert.ok(view.includes("...(passagesUnlocked ? [PASSAGES_NAVIGATION_ITEM] : []),"),
  "the beta entries do not include Passages, which is now the only way in — so nobody can "
  + "reach it at all");
assert.ok(view.includes('if (!passagesUnlocked && activeView === "passages") setActiveView("home");'),
  "an account that loses Passages is left sitting on a view it cannot use, or is sent to a "
  + "Practice hub that has nothing to do with it");

// The gate has to be the SAME one, not a second list that can drift from it.
assert.ok(!/PASSAGES_PREVIEW_EMAILS|passagesAllowed\s*=/.test(view),
  "Passages has its own allow-list, which will drift from the one beta uses");

// ── and it is not reachable around the gate ─────────────────────────────────
// The search palette navigates straight to a view id, so an entry there would
// walk right past the gate.
const searchBlock = view.slice(view.indexOf("const SEARCH_"), view.indexOf("const SEARCH_") + 4000);
assert.ok(!/id: "passages"/.test(searchBlock),
  "Passages is in the search palette, which navigates straight to it and skips the gate");

console.log(
  "check-practice-tools: Tests and Grammar can each be left, every back control names where it "
  + "goes, and Passages is beta only — out of the hub and out of the Practice nav row, still "
  + "reachable on a phone, and gated for the view, the entry, the redirect and search alike"
);
process.exit(0);
