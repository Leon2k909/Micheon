/**
 * A handoff between the home page's "items are fading" line and the vocabulary
 * tracker's filter.
 *
 * It lives in its own module so the home page can ask for a filter without
 * importing the tracker itself, which is lazy-loaded and should stay out of the
 * first bundle — importing it for one function would pull the whole catalogue
 * back into the opening screen.
 */
export type VocabFilterRequest = "all" | "known" | "fading" | "struggle" | "new";

type Listener = (key: VocabFilterRequest) => void;

const listeners = new Set<Listener>();

/**
 * A request made before the tracker mounted. The profile page is lazy twice
 * over, so a click can land several seconds ahead of the card that answers it;
 * the request waits here rather than being dropped.
 */
let pending: VocabFilterRequest | null = null;

/** Ask the tracker to show one filter, whether or not it is on screen yet. */
export function requestVocabFilter(key: VocabFilterRequest) {
  if (listeners.size === 0) {
    pending = key;
    return;
  }
  for (const listener of listeners) listener(key);
}

/**
 * The tracker listens while it is mounted, and picks up a waiting request on
 * the way in. Returns the unsubscribe.
 */
export function onVocabFilterRequest(listener: Listener) {
  listeners.add(listener);
  if (pending !== null) {
    const key = pending;
    pending = null;
    listener(key);
  }
  return () => {
    listeners.delete(listener);
  };
}
