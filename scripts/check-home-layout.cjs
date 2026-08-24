#!/usr/bin/env node
/**
 * The home page is built to a supplied drawing, using the supplied pictures.
 *
 * She was explicit about the pictures: "Ganz wichtig: Meine drei
 * bereitgestellten Bilder sollen tatsächlich verwendet werden. Keine
 * Ersatzbilder, keine Stockbilder und keine neu generierten Bilder." So this
 * checks that the files are still in the tree, still imported, and still
 * used in the places she named — the banner behind the mascot, the face of
 * the language card, the face of the country card. Swapping one for a
 * stand-in is the failure this exists to catch.
 *
 * The country card carries two pictures rather than one, because she asked
 * for its artwork to follow the country you pick.
 *
 * And the order, which is the other half of the brief: banner, question, the
 * two cards, then the figures.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r/g, "");
const shell = read("src/prototype/NewUiPrototype.tsx");
const css = read("src/prototype/new-ui-prototype.css");
const i18n = read("src/lib/i18n.ts");

// ── her three pictures, present and used where she put them ───────────────

// Stored as WebP: the same pictures, re-encoded through the browser's own
// encoder because the startup guard rightly refuses megabyte PNGs on the
// first screen — 6.4MB of source became 327KB with the artwork unchanged.
// The country card is not in this table any more: it draws one of two
// pictures depending on the country selected, so it is pinned below.
const PICTURES = [
  ["home-banner-sunrise-v1.webp", "homeBannerImage", "np-home-banner-sky"],
  ["home-languages-de-v2.webp", "homeLanguagesImage", "np-course-art"],
];

/** In the tree, the real thing rather than a placeholder, and imported. */
function pinPicture(file, binding) {
  const full = path.join(root, "src/prototype/assets", file);
  assert.ok(fs.existsSync(full), file + " is missing — the home page would fall back to nothing");
  // Around 100KB each once encoded. A file that suddenly weighs a few
  // kilobytes is a placeholder that got committed.
  assert.ok(
    fs.statSync(full).size > 40_000,
    file + " is only " + Math.round(fs.statSync(full).size / 1024) + "KB — that is not the picture that was supplied"
  );
  assert.ok(
    shell.includes("import " + binding + ' from "./assets/' + file + '"'),
    file + " is in the tree but nothing imports it"
  );
}

for (const [file, binding, className] of PICTURES) {
  pinPicture(file, binding);
  assert.ok(
    new RegExp(`className="${className}"[^>]*src=\\{${binding}\\}|src=\\{${binding}\\}[^>]*className="${className}"`).test(shell),
    `${binding} is imported but not drawn as ${className}`
  );
}

// ── the country card wears the country you picked ─────────────────────────
// One picture served both countries and it draws Berlin — the Brandenburg
// Gate, the Fernsehturm, a yellow Deutsche Post box — so choosing the United
// Kingdom left that scene sitting under a Union Jack. Pinned as a mapping
// rather than as two loose files, because the failure worth catching is not
// a missing picture but a card that has stopped following the selection.
pinPicture("home-country-de-v1.webp", "homeCountryArtDe");
pinPicture("home-country-uk-v1.webp", "homeCountryArtUk");
for (const line of [
  "const COUNTRY_ART: Record<CountryId, string> = {",
  "  de: homeCountryArtDe,",
  "  uk: homeCountryArtUk,",
]) {
  assert.ok(
    shell.includes(line),
    "COUNTRY_ART no longer maps each country to its own artwork: " + line
  );
}
assert.ok(
  shell.includes('className="np-home-choice-art" decoding="async" loading="eager" src={COUNTRY_ART[pack.id]}'),
  "the country card is not drawing COUNTRY_ART[pack.id] — its picture has stopped following the selected country"
);

// ── the banner is the picture, the wash and the quote ───────────────────
// The mascot stood in front of the skyline until she asked for him to come
// off. Pinned as an absence, because he was a separate layer and putting one
// back is a one-line change that nothing else would notice.
assert.ok(
  !/np-home-banner-mascot/.test(shell) && !/np-home-banner-mascot/.test(css),
  "the mascot is back on the banner — she asked for it to come off"
);
assert.ok(
  !/micheon-monkey-v1\.webp/.test(shell),
  "the banner imports the mascot artwork again"
);

// ── the order she listed ──────────────────────────────────────────────────
const home = /<div className="np-home-view">([\s\S]*?)\n    <\/div>\n  \);/.exec(shell)?.[1] ?? shell;
// The figures strip and the next-lesson strip are both gone at her word —
// "du kannst diese beiden dinge vollständig entfernen" — so the cards run
// straight into the outlook. The same three figures are still in the header
// above, which is what made the strip a repeat of something already on screen.
const order = ["<HomeBanner />", "np-home-question", "np-home-choices", "<FluencyOutlook"];
// Three sections have come off this page at her word: the figures strip and
// the next-lesson strip ("du kannst diese beiden dinge vollständig
// entfernen"), and the lesson path ("entfern das vorerst"). Pinned as
// absences so none of them drifts back without her asking. The LessonPath
// component itself is left in the file — vorerst — so restoring it is a line.
assert.ok(
  !home.includes("<HomeStats") && !home.includes("np-course-launch") && !home.includes("<LessonPath"),
  "none of the removed sections comes back without her asking"
);
let at = -1;
for (const marker of order) {
  const next = home.indexOf(marker, at + 1);
  assert.ok(next > at, `"${marker}" is missing from the home page, or out of order`);
  at = next;
}

// ── the cards say what she listed, in the app's language ──────────────────
for (const key of [
  "Small steps every day add up to big results.",
  "What would you like to learn {today}?",
  "Selected country",
  "United Kingdom",
]) {
  assert.ok(i18n.includes(`"${key}":`), `"${key}" has no German, so the home page would show it in English`);
}
assert.ok(
  /ui\("Language learning"\)/.test(shell) && /ui\("Country studies"\)/.test(shell),
  "both cards are titled through ui(), so they follow the app language"
);

// The picture has to stay visible under the text — "Das Bild soll dabei gut
// sichtbar bleiben und nicht komplett von einer undurchsichtigen Fläche
// verdeckt werden."
// Mixed from the theme's own surface rather than a literal cream, so the
// card is dark when the app is — the reference mockup is a light one, and
// built from it literally these cards stayed white in dark mode.
const wash = /\.np-home-choice-wash \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
assert.ok(/linear-gradient/.test(wash), "the card wash must be a gradient, not a flat cover");
assert.ok(/var\(--surface\)/.test(wash), "the wash must come from the theme surface, or the card ignores dark mode");
const stops = [...wash.matchAll(/var\(--surface\)\s+(\d+)%/g)].map((m) => Number(m[1]));
assert.ok(stops.length >= 3, `expected a gradient of at least three stops, read ${stops.length}`);
assert.ok(Math.min(...stops) <= 20, "the top of the card must be nearly clear, or the picture is hidden");
assert.ok(Math.max(...stops) < 100, "no stop may be fully opaque");

console.log(
  "check-home-layout: her pictures are used where she put them, the country card follows the country, the banner carries no mascot, "
  + "the page runs banner → question → cards → figures, and the cards let their pictures show"
);
