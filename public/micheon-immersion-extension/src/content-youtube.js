/**
 * YouTube: when a video has a German dub track, switch to it and turn on
 * English captions. Never touches a video that has no German track --
 * that's a much bigger, separate problem (see the extension's README).
 *
 * The player exposes getAvailableAudioTracks()/setAudioTrack() and
 * getOption/setOption("captions", ...) as real instance methods on
 * #movie_player -- verified directly against production youtube.com before
 * writing this, not assumed from memory, because YouTube's player internals
 * are undocumented and do shift between deploys. trackMeta() below is the
 * one deliberately defensive spot: it tries the property name observed at
 * verification time first, and falls back to scanning for a same-shaped
 * object if that name ever moves, rather than throwing.
 */
(() => {
  let lastVideoId = null;
  let settings = { youtubeAutoDub: true };

  function log(...args) {
    console.debug("[Micheon]", ...args);
  }

  function trackMeta(track) {
    if (!track) return null;
    if (track.VB && typeof track.VB.id === "string") return track.VB;
    for (const value of Object.values(track)) {
      if (value && typeof value === "object" && typeof value.id === "string" && "isDefault" in value) {
        return value;
      }
    }
    return null;
  }

  function languageOf(meta) {
    // "de.3" -> "de"; defensive against an id with no dot too.
    return (meta?.id || "").split(".")[0].toLowerCase();
  }

  async function waitForPlayer(timeoutMs = 45000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const player = document.querySelector("#movie_player");
      if (player && typeof player.getAvailableAudioTracks === "function") {
        const tracks = player.getAvailableAudioTracks();
        if (Array.isArray(tracks) && tracks.length > 0) return player;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    return null;
  }

  function currentVideoId() {
    return new URLSearchParams(location.search).get("v");
  }

  function applyCaptions(player, track) {
    const englishCaptions = (track.captionTracks || []).find((c) => c.languageCode === "en");
    if (!englishCaptions) return false;
    player.setOption("captions", "track", englishCaptions);
    return true;
  }

  async function applyGermanDub() {
    if (!settings.youtubeAutoDub) return;
    const videoId = currentVideoId();
    if (!videoId || videoId === lastVideoId) return;
    lastVideoId = videoId;

    // Genuinely slow to appear on a cold load in testing (a stone-cold
    // browser launch straight to a video, competing with everything else
    // running on the machine, took over 30s once) -- generous on purpose,
    // since a late silent switch costs nothing a real viewer would notice.
    const player = await waitForPlayer();
    if (!player) return;

    try {
      const tracks = player.getAvailableAudioTracks() || [];
      const germanTrack = tracks.find((t) => languageOf(trackMeta(t)) === "de");
      if (!germanTrack) {
        log("no German audio track for", videoId);
        return;
      }

      // A one-shot switch here has lost the race before: YouTube's own
      // player keeps settling audio/caption state for a beat after the
      // tracks are already listable (most visibly, restoring whatever
      // track was last explicitly chosen for this video), which can
      // silently revert a switch made the moment tracks appear. Verified
      // on real content -- reloading a video already switched once landed
      // back on English every time despite the initial switch succeeding.
      // Unconditionally re-asserting for a few seconds outlasts that
      // settle window without needing to know exactly when it ends;
      // "looks right this instant" isn't proof it stays right.
      for (let attempt = 0; attempt < 5; attempt += 1) {
        if (videoId !== lastVideoId) return; // navigated away mid-retry
        if (languageOf(trackMeta(player.getAudioTrack?.())) !== "de") {
          player.setAudioTrack(germanTrack);
          log("switched to German dub for", videoId, "(attempt", attempt + 1, ")");
        }
        applyCaptions(player, player.getAudioTrack?.() ?? germanTrack);
        await new Promise((r) => setTimeout(r, 900));
      }
    } catch (err) {
      // Undocumented API: fail quietly, never break the actual video page.
      log("dub/caption automation skipped:", err?.message);
    }
  }

  async function init() {
    const got = await chrome.storage.local.get("settings");
    settings = { ...settings, ...(got.settings || {}) };

    document.addEventListener("yt-navigate-finish", () => { void applyGermanDub(); });
    void applyGermanDub();
  }

  init();
})();
