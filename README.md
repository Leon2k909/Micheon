# Micheon

**A fully offline desktop app for learning German — premium neural voices, spaced repetition, and lessons that actually understand what you type.**

Micheon is a native-feeling desktop language tutor that runs entirely on your machine. There's no subscription, no login server, no cloud calls for content, and no usage limits. You download it once, and everything — thousands of sentences, dialogues, grammar drills, and natural-sounding speech — works on a plane, on the train, or with the Wi-Fi off.

> Repo folder: `germ` · Product name: **Micheon** · Platform: Windows desktop (Electron)

---

## What it is

Micheon teaches German the way you'll actually use it: whole sentences and real conversations, not flashcard word-lists. It bundles a hand-built, natively-verified curriculum and pairs it with a smart answer-checker that accepts the *many* ways a person really phrases something — so you're graded on whether you understood the German, not on hitting one exact string.

It ships as a Windows installer with automatic updates. Under the hood it's a React front-end wrapped in Electron, with a tiny local Express server that generates Microsoft neural TTS audio on demand.

## Who it's for

- **Self-learners** who want to reach confident, conversational — up to roughly university-level — German without paying a monthly fee or handing their data to a cloud service.
- **Offline learners** — commuters, travellers, anyone with unreliable internet. The whole app works with no connection.
- **German speakers learning English.** Set your interface language to Deutsch and the direction flips: the app speaks German to you and teaches the same expressions in English.
- **Privacy-minded people.** Your progress lives in a local store on your machine, not on someone's server.

---

## What you can do

| Feature | What it does |
| --- | --- |
| **Guided lessons** | Learn a batch of new material, then type, translate, or *speak* it back. Correct typed answers auto-advance — no clicking "Check". Each lesson mixes new items with review so nothing fades. |
| **Premium voice** | Every sentence can be read aloud in a natural Microsoft neural voice (via `edge-tts`), generated locally. A waveform reacts while it speaks. |
| **Smart answer matching** | Say it your way. The checker forgives typos, contractions, British/American spelling, articles, word-order-preserving paraphrases, and a large library of synonyms — while still rejecting genuinely wrong answers, wrong tense, and reversed meaning. |
| **Spaced review** | Items you've seen come back on a memory-strength schedule so they stick for the long term. |
| **Vocabulary games** | Eight arcade-style games (Snake, Whack-a-Mole, Falling Letters, Verb Shooter, Minesweeper, and more) that drill vocab without feeling like study. |
| **Grammar drills** | Cloze (fill-in-the-blank) exercises and grammar notes for the patterns behind the sentences. |
| **Fluency meter & gamification** | Track known-word count toward a fluency estimate, earn XP, keep a daily streak, level up, and unlock milestones. |
| **Appearance editor** | Full control of the look: background, cards, accent, text and progress-bar colours, plus a three-stop hero gradient — all live, saved, and synced to your account on this machine. |
| **Learning direction** | Switch between *learn German* and *learn English*; the interface, prompts, and lesson make-up follow the language you pick. |
| **Multiple courses** | German is the flagship; the course registry also carries Spanish and French tracks and a bonus C# course, selectable from the course switcher. |
| **Local accounts** | Per-machine profiles keep each person's progress separate and sync across browser/app restarts — no account server involved. |

---

## Getting started

### Option A — Install the app (recommended)

1. Go to the [Releases](https://github.com/Leon2k909/Micheon/releases) page.
2. Download the latest `Micheon-Setup-x.y.z.exe`.
3. Run it. Micheon installs, creates a Start-menu entry, and launches.
4. Create a local profile, pick your course, and start your first daily lesson.

The app checks for updates on its own and installs them the next time you close it.

### Option B — Run from source

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/Leon2k909/Micheon.git
cd Micheon        # (the working folder is named "germ")
npm install

# Web dev server + local TTS server together, with hot reload:
npm run dev

# Or run it as the actual desktop app:
npm run electron
```

`npm run dev` starts Vite (the UI) and the Express TTS server side by side. Open the printed local URL in your browser, or use `npm run electron` for the full desktop experience with the title bar and auto-update wiring.

---

## How to use it, day to day

1. **Pick up where you left off.** The dashboard's *Continue learning* card drops you into the next lesson.
2. **Work through a lesson.** You'll see the German sentence and its meaning. Depending on the step you'll type the answer, translate it, fill a gap, or say it aloud. Tap **Hear it** any time to hear a native voice. Get a typed answer right and it moves on automatically.
3. **Do your reviews.** Older items resurface on schedule — keeping up with them is what turns short-term recall into fluency.
4. **Play a game or two.** When you want a break that's still practice, the Games tab drills your current vocabulary.
5. **Make it yours.** In *Profile settings → Appearance*, recolour anything and tune the gradient; in *Preferences*, toggle light/dark and switch learning direction.

---

## How it works (architecture)

Micheon is deliberately simple and self-contained:

- **UI** — React 19 + TypeScript + Vite, styled with Tailwind CSS and animated with Framer Motion. Components live in `src/`.
- **Content** — bundled as data in `src/lib/` (`data.ts` for authored lessons, plus phrasebank packs). No content is fetched at runtime, and no paid APIs are used. The curriculum is assembled and ordered in `src/lib/curriculum.ts`.
- **Answer matching** — `src/lib/germanTextMatch.ts` runs a tiered comparison: exact → contractions → articles-ignored → synonym/paraphrase canonicalisation → compound-spacing → typo tolerance → meaning-reduced ordered match. It's tuned to accept how real people phrase things while still failing wrong answers.
- **Speech** — `server/index.js` is a small Express server that turns text into Microsoft neural-voice audio with `edge-tts-universal`, served locally (default port `41730`). Speech recognition for the "speak it" steps runs on-device.
- **Desktop shell** — `electron/main.js` wraps the UI, hosts the TTS server, provides the custom title bar, and handles automatic updates via `electron-updater`.
- **Accounts & sync** — profiles and progress are stored in the browser's `localStorage`, backed by a machine-local shared store so the same profile follows you across app restarts. Appearance overrides and preferences sync the same way.

### Project layout

```
src/
  german_learning_lab.tsx   Main app shell & tab routing
  GuidedSession.tsx         The lesson-taking experience
  Gamification.tsx          Profile, stats, milestones, Appearance editor
  components/               UI (TopNav, dashboard, lab views, editors)
  games/                    The eight vocabulary games
  lib/
    data.ts                 Authored lesson content
    curriculum.ts           Curriculum ordering
    germanTextMatch.ts      Smart answer checker
    voice.ts / tts.ts       Text-to-speech client
    customTheme.ts          Appearance override engine
    direction.ts / i18n.ts  Learning direction & interface language
    ...
server/index.js             Local Express TTS server (edge-tts)
electron/main.js            Electron desktop wrapper + auto-update
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite UI + local TTS server together (hot reload). |
| `npm run dev:web` | UI only. |
| `npm run server` | TTS server only. |
| `npm run build` | Production build of the UI. |
| `npm run electron` | Build, then launch the desktop app. |
| `npm run electron:dist` | Build and package a Windows installer with electron-builder. |
| `npm run lint` | ESLint. |

## Building a release

`npm run electron:dist` produces the installer under `dist/`. A release is published by uploading the `Micheon-Setup-x.y.z.exe` and `latest.yml` to a GitHub release; existing installs then pick up the update automatically on next launch.

---

## Design principles

- **Offline first, free forever.** Content is bundled; no subscriptions, no per-request AI costs, no telemetry.
- **Sentences, not word-lists.** Coverage grows through verified sentence and dialogue packs so you're rarely surprised in real conversation.
- **Natively verified content.** New material is checked by native-speaker review before it ships.
- **Understanding over exact strings.** If what you typed means the same thing, it counts.

---

*Micheon — learn German properly, on your own machine.*
