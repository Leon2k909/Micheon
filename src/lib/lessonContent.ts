const KEY = "gl-lesson-content";

/**
 * What a Continue Learning sitting is made of.
 *
 * Some learners want WORDS; the course teaches SENTENCES; some people
 * want a bit of each. Rather than a second button for every combination, the
 * one Continue Learning button carries a picker and remembers the choice:
 *
 *   sentences — the course as it has always been. The only single words are
 *               the authored one-word phrases you'd say on their own
 *               ("Prost!", "Genau!").
 *   words     — vocabulary only: single words with their glosses, most
 *               common first, progress under their own vw- ids.
 *   mixed     — one sitting, both kinds: four sentence slots, two word
 *               slots. Still six.
 *
 * A choice, not a mode switch buried in Settings: it sits on the button it
 * changes, and it persists because "I'm here for vocabulary" is true for
 * weeks at a time, not per press.
 */
export type LessonContent = "sentences" | "words" | "mixed";

export function getLessonContent(): LessonContent {
  if (typeof window === "undefined") return "sentences";
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "words" || stored === "mixed" ? stored : "sentences";
  } catch {
    return "sentences";
  }
}

export function setLessonContent(content: LessonContent) {
  try {
    localStorage.setItem(KEY, content);
  } catch {
    // The picker still works for this page view; it just will not persist.
  }
}
