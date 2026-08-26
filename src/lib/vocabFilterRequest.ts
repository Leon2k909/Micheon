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
 * The vocabulary block on the progress page folds shut like the rest of that
 * page. Two things navigate straight to it — the sidebar's own row, and the
 * home page's fading line — and both would otherwise land on a closed box, so
 * they say so here and it opens.
 */
type OpenListener = () => void;

const openListeners = new Set<OpenListener>();
let openPending = false;

/** Ask the progress page to open its vocabulary block. */
export function requestVocabLibraryOpen() {
  if (openListeners.size === 0) {
    openPending = true;
    return;
  }
  for (const listener of openListeners) listener();
}

/** The block, listening while it is on the page. Returns the unsubscribe. */
export function onVocabLibraryOpen(listener: OpenListener) {
  openListeners.add(listener);
  if (openPending) {
    openPending = false;
    listener();
  }
  return () => {
    openListeners.delete(listener);
  };
}

/**
 * Whether the vocabulary card is what was asked for, rather than the progress
 * page it happens to sit on.
 *
 * The panel holding the card loads separately from the page, so it arrives
 * after the page has already drawn its top: measured at 1.5s the first time
 * and 0.85s after that, during which the learner watched the progress panel
 * and then the page jumped 1,189px down to the card. Asked for by name, the
 * card goes first, so there is nothing above it to sit through and nothing to
 * jump past. Arrive any other way and the page keeps its usual order.
 *
 * Taken rather than read: it describes one arrival, not a setting, so the next
 * visit to the progress page is the ordinary one again.
 */
let libraryFirst = false;

/** Say that the vocabulary card is the destination, before navigating. */
export function requestVocabLibraryFirst() {
  libraryFirst = true;
}

/** Answer once, and forget: was the card the destination of this arrival? */
export function takeVocabLibraryFirst() {
  const asked = libraryFirst;
  libraryFirst = false;
  return asked;
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
