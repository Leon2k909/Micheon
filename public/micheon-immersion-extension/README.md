# Micheon Immersion

A companion browser extension for [Micheon](../germ), not a translator. Everything
runs offline against Micheon's own bundled word list (`data/words.json`,
regenerated from the app's real catalogue) — no translation API, no network
call beyond loading that one local file.

## What it does

1. **Word glossing, everywhere.** A word already in Micheon's word list gets
   a dotted underline and a hover/focus tooltip with its translation. On a
   German page that's an English gloss (reinforcement of what you're
   learning); on any other page it's the reverse — an English word with a
   taught German equivalent gets a German gloss on hover, so pages you'd
   otherwise read in English still teach.
2. **Missing-vocabulary collection.** On a page detected as German, a
   real-looking German word that ISN'T in the list gets counted, along with
   one real sentence it appeared in. This is a *candidate* list for a human
   (or a future authoring pass) to review — the same authored-and-verified
   bar as every pack already in Micheon, never auto-added. Export it from
   the popup as JSON.
3. **YouTube: auto-German-dub + English captions.** When a video has an
   official German audio track, it switches to it and turns on English
   captions automatically. It never touches a video that has no German
   track — synthesising a dub for a video that doesn't have one is a much
   bigger, separate problem (live caption→translate→TTS pipeline), not
   something this does.

## Installing (unpacked, for now — not published)

1. `edge://extensions` or `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. **Load unpacked** → select this folder.
4. Pin it from the extensions toolbar icon if you want the popup handy.

## Regenerating the word list

`data/words.json` is a snapshot of Micheon's real word catalogue, not hand-written.
Re-export it after adding new packs to the app:

```
node <path-to-export-script> <path-to-germ-repo> data/words.json
```

(the export script lives with this session's scratch tooling; ask for it
regenerated, or it can be rebuilt from `src/lib/wordSession.ts`'s
`buildWordCatalog` the same way the app's own gates do.)

## Known limitations, honestly

- **Glossing is exact-case-first.** German capitalises every noun and
  nothing else, so a word's authored case IS its part-of-speech signal —
  "Daten" (data, a noun) and "daten" (to date someone, a verb) are
  different words that share letters, not the same word twice. Matching
  is exact-case, with a case-insensitive fallback ONLY for ALL-CAPS text
  (headlines/nav, which discard case entirely). A capitalised word this
  list doesn't teach as a noun will not recover to a lowercase-authored
  entry — confirmed on real content that the alternative silently taught
  a wrong meaning, which is worse than missing a gloss.
- **Language detection can be fooled by UI chrome vs. content language**,
  which is exactly why YouTube is excluded from the general gloss script:
  its own navigation/consent-banner text follows your account's YouTube UI
  language, not the video's actual language, and on a browser whose UI
  locale is German that alone was enough to mis-flag an English video's
  page as German. Ordinary sites (news, blogs) don't have this split —
  their nav is in the site's real language — so this is scoped to known
  offenders rather than solved in general.
- **The YouTube audio-track/caption API is undocumented.** It was verified
  directly against production youtube.com before writing the script (not
  assumed from memory), but YouTube can change it without notice. If dub
  switching silently stops working, that's the first thing to check —
  `trackMeta()` in `content-youtube.js` has one deliberate fallback for a
  renamed property, but not infinite resilience.
- **Missing-vocabulary candidates are noisy by design, not by accident.**
  Proper nouns, brand names, and site-specific UI terms ("Merkliste") will
  appear alongside genuine gaps. Common function words (articles, personal
  pronouns, conjunctions, basic prepositions, auxiliary-verb forms) are
  filtered — Micheon teaches those through sentences, not as standalone
  entries, so flagging them just buries real candidates. Everything else
  is a candidate for review, not a verdict.
- **Not a general-purpose page translator.** It can only gloss the ~4,478
  words Micheon already teaches. It will never turn an arbitrary paragraph
  into fluent German — that needs a real translation engine, which this
  deliberately doesn't use (offline, zero cost, zero external dependency
  was the whole point).
