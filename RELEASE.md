# Building & auto-updating Micheon

The Windows build is **all-in-one**: one installer contains the app, the built
front-end, and the local TTS server (it runs inside the app — nothing separate
to install). Once installed, the app **auto-updates itself** from GitHub
Releases, so you only ever hand someone the installer once.

## One-time setup

Auto-update reads the GitHub Releases feed of **`Leon2k909/Micheon`**. That repo
must be **public** so the installed app can read releases without a token.
(If it's private, the app can't fetch updates without embedding a secret.)

## Cut a new release (every time you want to push an update)

1. **Bump the version** in `package.json` (`"version"`). It must be higher than
   what's installed — that's how the app knows an update exists. Commit it.

2. **Build + publish** in one step (recommended):

   ```bash
   # A GitHub token with "repo" scope, so electron-builder can upload the release.
   # PowerShell:  $env:GH_TOKEN = "ghp_xxx"
   # Git Bash:    export GH_TOKEN=ghp_xxx
   npm run release
   ```

   With `build.publish.releaseType: "release"` this builds
   `Micheon Setup <version>.exe`, its `.blockmap`, and `latest.yml`, and
   publishes them straight to a **published** GitHub Release tagged `v<version>`
   — not a draft (electron-updater ignores drafts).

3. **Verify the feed is complete.** The `.exe` upload can succeed while the
   `latest.yml`/`.blockmap` upload fails (e.g. a transient error, or a
   "published releases must have a valid tag" 422 if the tag didn't exist yet),
   leaving the release without the file the updater actually reads. Check:

   ```bash
   curl -sL https://github.com/Leon2k909/Micheon/releases/latest/download/latest.yml
   ```

   It must return `version: <the new version>`. If `latest.yml` is missing (404)
   or shows an older version, re-upload the three files from `release/` to the
   release (asset names must match what `latest.yml` lists, e.g.
   `Micheon-Setup-<version>.exe`). Without a correct `latest.yml` on the latest
   release, no installed copy sees the update.

4. Done. Every installed copy checks GitHub on launch (and hourly), downloads the
   new version in the background, and installs it silently the next time the app
   is closed and reopened.

## Giving it to someone the first time

Send them **`Micheon Setup <version>.exe`** (from `release/`, or the GitHub
Release page). It installs per-user in one click. Windows SmartScreen may warn on
first run because the build isn't code-signed — **More info → Run anyway**, once.
After that, updates are automatic; they never re-download by hand.

## How it fits together

- `electron/main.js` — starts the bundled server (`server/index.js`) in-process,
  opens the window, and runs the updater (`setupAutoUpdate`, guarded to the
  packaged app only).
- `package.json` → `build.publish` — points electron-updater at the GitHub repo.
- `build.files` bundles `electron/`, `server/`, `dist/`, and `package.json`;
  production `node_modules` (Express, edge-tts, classic-level) are included and
  the native `classic-level` module is rebuilt for packaging automatically.
- Progress is saved to `%APPDATA%/germ/shared-progress.json` (writable), not
  inside the app, so it survives updates.
