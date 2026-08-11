# Micheon Immersion

A companion browser extension for [Micheon](../germ), not a translator. Everything
runs offline against Micheon's own bundled word list (`data/words.json`,
regenerated from the app's real catalogue) — no translation API, no network
call beyond loading that one local file and, when the Micheon desktop app is
running, its own local TTS server.

## What it does

1. **Word glossing, everywhere.** A word already in Micheon's word list gets
   a dotted underline and a hover/focus tooltip with its translation. On a
   German page that's an English gloss (reinforcement of what you're
   learning); on any other page it's the reverse — an English word with a
   taught German equivalent gets a German gloss on hover, so pages you'd
   otherwise read in English still teach. The tooltip has a speaker button
   that pronounces the German: through the Micheon desktop app's own TTS
   voice when the app is running, through the browser's built-in German
   voice when it isn't.
2. **Missing-vocabulary collection.** In German text, a real-looking German
   word that ISN'T in the list gets counted, along with one real sentence it
   appeared in. This is a *candidate* list for a human (or a future
   authoring pass) to review — the same authored-and-verified bar as every
   pack already in Micheon, never auto-added. Export it from the popup as
   JSON. Names, cities, brands, web fragments, English filler, mixed-case
   brand words (YouTube, iPhone) and apostrophe contractions are filtered.
3. **YouTube, scoped on purpose.** On watch pages it reads the video's
   title and description — the page around them follows your ACCOUNT's
   interface language and is never scanned. Whether the video is German is
   judged once from the richest text present (the full description text,
   even while collapsed), and words are only collected when their own
   sentence reads as German, because German-learning channels routinely mix
   English paragraphs into the same description. And when a video has an
   official German audio track, it switches to it and turns on English
   captions automatically; it never touches a video that has no German
   track.
4. **The popup says what's happening on this exact tab** — "reads as
   German", "reads as English", "no German in this video", "extensions
   can't run here" — plus separate counts of new words spotted and how many
   carry a real example sentence. A bare 0 that might mean "broken" is
   exactly what it's there to avoid.

## Installing (unpacked, for now — not published)

1. `edge://extensions`, `chrome://extensions` or `brave://extensions`.
2. Turn on **Developer mode** (top right).
3. **Load unpacked** → select this folder.
4. Pin it from the extensions toolbar icon if you want the popup handy.

After updating the folder's files, press the reload arrow on the extension's
card on that page — browsers don't re-read the files on their own.

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
- **Reverse (English→German) glossing skips verbs.** Stripping the "to "
  from verb entries made the English word "date" — nearly always the
  calendar noun in real text — gloss as "daten" (to date someone). Verb
  entries stay out of the reverse map entirely, and when two entries share
  an English word, a noun (der/die/das) wins. A missed gloss is silent; a
  wrong one teaches something false.
- **The YouTube audio-track/caption API is undocumented.** It was verified
  directly against production youtube.com before writing the script (not
  assumed from memory), but YouTube can change it without notice. If dub
  switching silently stops working, that's the first thing to check —
  `trackMeta()` in `content-youtube.js` has one deliberate fallback for a
  renamed property, but not infinite resilience. The same goes for the
  title/description container selectors the glossing scan uses.
- **Missing-vocabulary candidates are noisy by design, not by accident.**
  The name/brand/English filters cut the worst of it, but site-specific UI
  terms and rare proper nouns will still appear alongside genuine gaps.
  Common function words (articles, personal pronouns, conjunctions, basic
  prepositions, auxiliary-verb forms) are filtered — Micheon teaches those
  through sentences, not as standalone entries, so flagging them just
  buries real candidates. Everything else is a candidate for review, not a
  verdict.
- **Not a general-purpose page translator.** It can only gloss the ~4,478
  words Micheon already teaches. It will never turn an arbitrary paragraph
  into fluent German — that needs a real translation engine, which this
  deliberately doesn't use (offline, zero cost, zero external dependency
  was the whole point).
