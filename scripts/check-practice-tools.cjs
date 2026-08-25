#!/usr/bin/env node
/**
 * A Practice tool has a way back, and Passages is beta.
 *
 * Tests, Grammar and Passages are opened from the Practice hub and then take
 * the whole page. The sidebar keeps Practice lit while you are inside one, so
 * the app already calls them somewhere you went INTO — but there was nothing
 * to come back with. Clicking Practice in the sidebar is a different gesture
 * from undoing the step you just took, and on a narrow window the sidebar is
 * not even on screen.
 *
 * The gate is the half that fails silently. An unfinished feature shown to
 * everybody looks exactly like one shown to nobody, right up until an account
 * outside the allow-list opens it — and beta is only meant for the accounts
 * building the app.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const view = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");

// ── every Practice tool can be left ─────────────────────────────────────────
for (const label of ["Tests", "Grammar", "Passages"]) {
  assert.ok(
    view.includes(`<FeatureBackBar label={ui("${label}")} onBack={() => navigate("practice")} />`),
    `${label} fills the page with no way back to the Practice hub it was opened from`
  );
}
assert.ok(view.includes('{ui("Back to Practice")}'), "the back control has no label");
assert.ok(i18n.includes('"Back to Practice":'), "the back control has no German");
assert.ok(styles.includes(".np-feature-back__btn {"), "the back control has no styling of its own");

// ── Passages is behind the same gate as the rest of beta ────────────────────
// Three places, and all three matter: the card that opens it, the view that
// renders it, and the redirect for an account already sitting on it.
assert.ok(view.includes("const passagesUnlocked = leonOnlyFeaturesUnlocked;"),
  "Passages is not gated on the accounts that can see beta");
assert.ok(view.includes('activeView === "passages" && passagesUnlocked ?'),
  "the Passages view renders for any account that reaches it, gate or no gate");
assert.ok(view.includes("passagesUnlocked ? [{"),
  "the Practice hub still offers a Passages card to accounts that cannot open it");
assert.ok(view.includes("...(passagesUnlocked ? [PASSAGES_NAVIGATION_ITEM] : []),"),
  "Passages is hidden from the hub but never appears in beta, so nobody can reach it at all");
assert.ok(view.includes('if (!passagesUnlocked && activeView === "passages") setActiveView("practice");'),
  "an account that loses Passages is left sitting on a view it cannot use");

// The gate has to be the SAME one, not a second list that can drift from it.
assert.ok(!/PASSAGES_PREVIEW_EMAILS|passagesAllowed\s*=/.test(view),
  "Passages has its own allow-list, which will drift from the one beta uses");

// ── and it is not reachable around the gate ─────────────────────────────────
// The search palette navigates straight to a view id, so an entry there would
// walk right past the hub.
const searchBlock = view.slice(view.indexOf("const SEARCH_"), view.indexOf("const SEARCH_") + 4000);
assert.ok(!/id: "passages"/.test(searchBlock),
  "Passages is in the search palette, which navigates straight to it and skips the gate");

console.log(
  "check-practice-tools: Tests, Grammar and Passages can each be left, and Passages is "
  + "gated for the hub, the view, the redirect and search alike"
);
process.exit(0);
