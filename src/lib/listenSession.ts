/**
 * Whether a Listen session is running, where the rest of the app can see it.
 *
 * Listen already knew this about itself, in a piece of component state that
 * answered two questions — should the small player be on screen, and is
 * anything playing. Both answers were private to the component and both were
 * lost the moment it unmounted.
 *
 * That mattered because opening a lesson is a page navigation, not a change of
 * view: the whole app is torn down and built again around the lesson, so a
 * Listen session did not survive being interrupted by the thing a learner is
 * most likely to do next. And nothing outside Listen could ask whether it was
 * playing, so a lesson would start reading a word aloud over the top of it.
 *
 * So it lives in storage, and says so when it changes. Two facts, deliberately
 * separate: `live` is whether the learner has a session open at all, and
 * `playing` is whether sound is coming out of it right now. A paused session
 * is still a session — its player stays on screen — but a lesson may speak
 * over a pause without talking over anybody.
 */
const LISTEN_SESSION_EVENT = "micheon-listen-session";

const KEY = "gl-listen-session";

type ListenSessionState = {
  /** A session the learner has not closed. Its player belongs on screen. */
  live: boolean;
  /** Sound is coming out right now. */
  playing: boolean;
};

const IDLE: ListenSessionState = { live: false, playing: false };

export function readListenSession(): ListenSessionState {
  if (typeof window === "undefined") return IDLE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return IDLE;
    const parsed = JSON.parse(raw) as Partial<ListenSessionState> | null;
    if (!parsed || typeof parsed !== "object") return IDLE;
    return { live: parsed.live === true, playing: parsed.playing === true };
  } catch {
    return IDLE;
  }
}

/**
 * Record what Listen is doing.
 *
 * Writes only on a real change: this is called from render-adjacent effects on
 * both a play and a pause, and an event on every one of those would have every
 * listener re-reading storage several times a second.
 */
export function writeListenSession(next: ListenSessionState): void {
  if (typeof window === "undefined") return;
  const current = readListenSession();
  if (current.live === next.live && current.playing === next.playing) return;
  try {
    // A closed session is removed rather than stored as false, so a machine
    // that has never used Listen and one that has finished with it look the
    // same to everything downstream.
    if (!next.live && !next.playing) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: the flag is a convenience, not the session */
  }
  window.dispatchEvent(new CustomEvent(LISTEN_SESSION_EVENT));
}

/**
 * Whether something else should keep quiet.
 *
 * The question a lesson asks before speaking on its own. Only a session that
 * is actually PLAYING silences anything: a learner who paused Listen to do a
 * lesson properly wants the lesson to talk.
 */
export function listenIsHoldingAudio(): boolean {
  const state = readListenSession();
  return state.live && state.playing;
}
