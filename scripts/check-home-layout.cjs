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
const i18n = read("src/lib/i18n.ts")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + read("src/lib/i18nDe.ts");

// ── her three pictures, present and used where she put them ───────────────

// Stored as WebP: the same pictures, re-encoded through the browser's own
// encoder because the startup guard rightly refuses megabyte PNGs on the
// first screen — 6.4MB of source became 327KB with the artwork unchanged.
// Neither card is in this table any more. Each draws one of two pictures -
// the country card by the country selected, the language card by the
// language being learned - so both are pinned below as mappings.
const PICTURES = [
  ["home-banner-sunrise-v1.webp", "homeBannerImage", "np-home-banner-sky"],
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
    new RegExp(`className="${className}"[^>]*src=\\{${binding}\\}|src=\\{${binding}\\}[^>]*className="${className}"`).test(shell)
      // The banner draws the chosen scenery and falls back to this one.
      || (className === "np-home-banner-sky" && /className="np-home-banner-sky"[\s\S]{0,160}src=\{scenery\.src\}/.test(shell)
        && shell.includes(`?? { src: ${binding} };`)),
    `${binding} is imported but not drawn as ${className}`
  );
}

/**
 * The banner wears the scenery chosen for a lesson.
 *
 * "aber der banner wechselt sich nicht. das müsste sich wechseln." Four scenes
 * lend it their picture; plain canvas and monkey world do not — the first
 * because it is the option for having no scenery, the second because the
 * mascot is painted into that artwork and he was taken off this banner at her
 * word. Pinned as a mapping, since the failure worth catching is a banner that
 * has stopped following the choice, not a missing file.
 */
for (const [scene, binding] of [
  ["bubbles", "scenerySpeechBubbles"],
  ["atlas", "sceneryFlightPath"],
  ["garden", "sceneryFlowerGarden"],
  ["dawn", "scenerySoftDawn"],
  // Monkey world was the one scene held back, because its artwork was the
  // app's own mascot and she had had him taken off this banner. She has
  // supplied a jungle of her own for the scene and named the file for the
  // banner, so it lends its picture like the rest.
  ["monkey", "sceneryMonkeyWorld"],
]) {
  assert.ok(
    new RegExp(`^  ${scene}: \\{ src: ${binding}, frame: "[^"]+" \\},$`, "m").test(shell),
    `the ${scene} scene no longer lends the banner its picture, framed`
  );
}

/**
 * The globe scene is anchored where its subject is.
 *
 * "achte drauf das es im kleinen fenster auch gut aussieht." In a narrow
 * window the banner stops being a long strip and starts trimming the picture's
 * SIDES rather than its height. Measured at four widths: at 1920 nothing is
 * cut, at 1400 it is 11% off each end, at 1100 21%, and at 900 only 43% of the
 * width survives — 29% gone from each side.
 *
 * This picture keeps its aeroplane and its globe in the right half and empty
 * sky in the left, so a centred trim took the aeroplane away entirely and left
 * a piece of ocean. Anchored right the trim comes off the sky, and both are
 * still there at 900px. The other three are landscapes that read from any part
 * of themselves, and stay centred.
 */
assert.ok(
  /atlas: \{ src: sceneryFlightPath, frame: "right center" \}/.test(shell),
  "the globe scene is centred again. A narrow window trims both ends of the picture, and this one "
    + "holds its aeroplane in the right half — centred, a 900px window loses it entirely"
);

/**
 * The banner is shaped for what is in it.
 *
 * "die banner müssen alle angepasst werden. die größe ist nicht gut." At the
 * 4.6:1 this box used to be, cover threw away 57% of a 2:1 picture's height
 * and the plane came out as a fragment. Nothing about that reads as broken —
 * it looks like a picture somebody chose badly.
 */
const bannerBox = /\.np-home-banner \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
assert.ok(
  !/aspect-ratio/.test(bannerBox),
  "the banner grows with the window again. A ratio was tried so a picture would stop being cropped, "
    + "and on a wide screen it made the banner over 500px tall. The pictures carry the banner's shape "
    + "instead, so the box can stay the height it has always been"
);
// Each file has the banner's proportions, so cover has almost nothing to throw
// away. A 2:1 illustration in a strip this wide comes out as a band of empty
// sky; contained instead, it shrinks into a corner and leaves the rest flat.
for (const scenery of [
  "guided-speech-bubbles-v1",
  "guided-flight-path-v1",
  "guided-flower-garden-v1",
  "guided-soft-dawn-v1",
]) {
  const full = path.join(root, "src/prototype/assets", scenery + ".webp");
  assert.ok(fs.existsSync(full), scenery + " is missing, so a scene has no picture to lend the banner");
}
assert.ok(
  /style=\{scenery\.frame/.test(shell),
  "the banner ignores each picture's framing, so cover falls back to one placement for all of them"
);
assert.ok(
  !/^  plain:/m.test(/const BANNER_SCENERY[^}]*\}/.exec(shell)?.[0] ?? ""),
  "plain canvas is lending the banner a picture, which is the one thing that option promises not to do"
);
assert.ok(
  shell.includes("window.addEventListener(GUIDED_BACKGROUND_EVENT, refresh)"),
  "the banner no longer hears the scenery change, so it would only follow after a restart"
);

// ── the language card wears the language you are learning ────────────────
// Each course that exists has a picture of its own, and anything else keeps
// the general one, so a language can be listed before anybody has drawn
// anything for it. Six scenes run the other way round: the picture exists
// while the course does not, and they sit in PLANNED_CARD_ART where nothing
// can reach them yet. Pinned all the same. Unreachable code reads as
// something to tidy away, and the tidying would land long before anybody
// remembered it was waiting for a course to open.
// Keyed on the language code rather than
// on a German-or-not flag, because that flag handed French the German scene.
// The failure worth catching is not a missing file but a card that has
// stopped following the course.
pinPicture("home-languages-de-v2.webp", "homeLanguagesImage");
pinPicture("home-languages-german-v1.webp", "homeLanguagesGermanImage");
pinPicture("home-languages-uk-v1.webp", "homeLanguagesUkImage");
pinPicture("home-languages-fr-v1.webp", "homeLanguagesFrImage");
pinPicture("home-languages-pl-v1.webp", "homeLanguagesPlImage");
pinPicture("home-languages-es-v1.webp", "homeLanguagesEsImage");
pinPicture("home-languages-it-v1.webp", "homeLanguagesItImage");
pinPicture("home-languages-pt-v1.webp", "homeLanguagesPtImage");
pinPicture("home-languages-ru-v1.webp", "homeLanguagesRuImage");
pinPicture("home-languages-hi-v1.webp", "homeLanguagesHiImage");
pinPicture("home-languages-zh-v1.webp", "homeLanguagesZhImage");
for (const line of [
  '  if (targetCode === "de") return homeLanguagesGermanImage;',
  '  if (targetCode === "fr") return homeLanguagesFrImage;',
  '  if (targetCode === "pl") return homeLanguagesPlImage;',
  '  if (targetCode === "en") return englishVariant === "american" ? homeLanguagesImage : homeLanguagesUkImage;',
  "  return PLANNED_CARD_ART[targetCode] ?? homeLanguagesImage;",
]) {
  assert.ok(
    shell.includes(line),
    "languageCardArt no longer gives each course its own picture: " + line
  );
}

// The scenes that have no course yet. Read out of the table rather than
// listed as branches, so a seventh means one line in the app and one here,
// not a third place to remember.
for (const [code, binding] of [
  ["es", "homeLanguagesEsImage"],
  ["it", "homeLanguagesItImage"],
  ["pt", "homeLanguagesPtImage"],
  ["ru", "homeLanguagesRuImage"],
  ["hi", "homeLanguagesHiImage"],
  ["zh", "homeLanguagesZhImage"],
]) {
  assert.ok(
    shell.includes("  " + code + ": " + binding + ","),
    "the scene drawn for " + code + " has fallen out of PLANNED_CARD_ART, so that course would open wearing the German picture"
  );
}
assert.ok(
  (shell.match(/src=\{languageCardArt\(/g) || []).length === 2,
  "both language cards should draw languageCardArt — one of them has gone back to a fixed picture"
);

/**
 * The flag survives the card being narrow.
 *
 * These paintings hang the flag in the last tenth of the canvas. Cover trims
 * from both sides, so a centred one loses the flag first — and the failure is
 * quiet: a card that looks fine until the window is a little narrower.
 *
 * Pinned as the DEFAULT rather than as a list of languages. It was a list
 * once, naming Polish, and every language painted after it had its flag cut
 * until somebody noticed and added it. What is checked here is that the rule
 * needs no maintenance when the twelfth painting arrives.
 */
const courseArt = /\.np-course-art \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
assert.ok(
  /object-position:\s*100%/.test(courseArt),
  "the language card's painting is not anchored right any more. Every one of them keeps its flag at "
    + "the right edge, so a centred trim takes the flag off first"
);

// ── the country card wears the country you picked ─────────────────────────
// One picture served both countries and it draws Berlin — the Brandenburg
// Gate, the Fernsehturm, a yellow Deutsche Post box — so choosing the United
// Kingdom left that scene sitting under a Union Jack.
//
// Read out of COUNTRY_ART rather than listed here. Listed, it named two of
// the three countries and France went unchecked for as long as it existed —
// which is the same shape of mistake as the card naming the country with a
// conditional. Every entry is followed to its file, and every country pack
// must have one.
const artBlock = /const COUNTRY_ART: Record<CountryId, string> = \{([\s\S]*?)\n\};/.exec(shell);
assert.ok(artBlock, "COUNTRY_ART is gone, so nothing decides which picture a country card draws");
const art = new Map(
  [...artBlock[1].matchAll(/\n {2}([a-z]+): (\w+),/g)].map((m) => [m[1], m[2]])
);
const packIds = [...read("src/lib/countryPacks.ts").matchAll(/\n {2}id: "([a-z]+)",/g)].map((m) => m[1]);
assert.ok(packIds.length >= 3, `expected at least three country packs, found ${packIds.length}`);
for (const id of packIds) {
  const binding = art.get(id);
  assert.ok(binding, `${id} has a country pack but no picture in COUNTRY_ART`);
  const imported = new RegExp(`import ${binding} from "\\./assets/([\\w.-]+)"`).exec(shell);
  assert.ok(imported, `${binding} is named in COUNTRY_ART but nothing imports it`);
  pinPicture(imported[1], binding);
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
// The rail is decided in the shell rather than inside HomeView, so this reads
// the whole file: the condition must not name the home view again.
const railCondition = (shell.match(/const showRightRail = [^;]+;/) || [""])[0];
assert.ok(railCondition, "the right rail's condition has moved or gone");
assert.ok(
  !/activeView === "home"/.test(railCondition),
  "the progress rail is back on the home page"
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

// ── the two cards fold outwards ───────────────────────────────────────────
/**
 * "sodass sprachenlernen nach links zuklappbar ist. und landeskunde nach
 * rechts. der knopf dafür soll bei sprachen lernen links oben in der ecke und
 * bei landeskunde rechts oben in der ecke sein."
 *
 * Which corner the handle sits in IS the feature: it says which way the card
 * will go before you press it. Swapped, nothing errors and nothing looks
 * broken — the cards simply fold the wrong way.
 */
assert.ok(
  /\.np-home-choice--language \.np-home-choice-fold \{ left: /.test(css)
    && /\.np-home-choice--country \.np-home-choice-fold \{ right: /.test(css),
  "the fold handles are not in the outer corners: language left, country right"
);

// A flex row, not the auto-fit grid it replaced. auto-fit gives every column
// the same width by definition, so a folded card would be as wide as the one
// it just made room for.
const choices = /\.np-home-choices \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
assert.ok(
  /display: flex/.test(choices) && !/grid-template-columns/.test(choices),
  "the cards are back in a grid of equal columns, so folding one cannot narrow it"
);
// Folded, the country rail sits at the RIGHT edge even when the language card
// is folded too — with both shut there is no open card to push it there, and
// the two rails stood side by side at the left.
assert.ok(
  /\.np-home-choice--country\.is-folded \{\s*margin-left: auto;/.test(css),
  "a folded country card no longer keeps to the right edge, so with both cards shut the two rails "
  + "stand together at the left with the page empty beside them"
);
const railBasis = /\.np-home-choice\.is-folded \{\s*flex: 0 0 (\d+)px/.exec(css);
assert.ok(railBasis, "a folded card has no width of its own — it would stay as wide as an open one");
assert.ok(
  Number(railBasis[1]) < 200,
  `a folded card is ${railBasis[1]}px wide, which is a card rather than the rail it folds down to`
);

// Both handles, and the label that stays on the rail. A folded card with
// nothing on it is a strip to work out rather than a thing to recognise.
for (const needed of ["np-home-choice-fold", "np-home-choice-spine"]) {
  assert.ok(shell.includes(needed), `the home cards no longer render ${needed}`);
}
assert.ok(
  /getHomeCardOpen\("language"\)/.test(shell) && /getHomeCardOpen\("country"\)/.test(shell),
  "the cards no longer read how they were left, so folding one is forgotten on the next start"
);
for (const key of ["Fold this card away", "Open this card"]) {
  assert.ok(i18n.includes(`"${key}":`), `"${key}" has no German, so the handle would say it in English`);
}
