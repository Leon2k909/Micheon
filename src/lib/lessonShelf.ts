/**
 * Putting finished lessons away, and taking them back out.
 *
 * A library that only grows is a library you stop scrolling. Once a lesson is
 * finished it is still worth keeping — you may want to re-read it, and its
 * words are still counted — but it does not need to sit between you and the
 * ones you have not done yet.
 *
 * Two rules make the shelf safe to use:
 *
 *   1. NOTHING IS DELETED, and the way back is the same control that put them
 *      away. The button carries the count, so a shelf with forty lessons on it
 *      says so rather than leaving you to wonder where they went.
 *   2. A FINISHED LESSON THAT HAS STARTED TO FADE COMES BACK. "Finished" is a
 *      claim about the past; the memory model says what you are assumed to
 *      recall today, and the two disagree the moment a review falls due. If
 *      the shelf hid those too, the fading signal would be invisible exactly
 *      where it matters most — on the lessons you finished long enough ago to
 *      have forgotten.
 *
 * Asking for finished lessons explicitly (the "Finished" progress filter) is a
 * stronger statement than the standing preference, so it wins outright.
 */

import { statusForId, type GradeStore } from "@/lib/activity";
import { recallDetail } from "@/lib/memoryStrength";

const KEY = "gl-hide-finished-lessons";

export type LessonProgress = {
  /** items graded "know" */
  done: number;
  total: number;
  /** items past their review date, so worth less than a whole item today */
  fading: number;
};

/**
 * What a lesson is worth, learned and today.
 *
 * Here rather than in the view because "done" and "fading" have to be counted
 * off the same items with the same ids — count them in two places and they
 * drift, which shows up as a lesson claiming eleven learned and fourteen
 * fading. The decay is the tracker's own `recallDetail`, not a second curve
 * that happens to agree today.
 *
 * The id fallback matches the one lessons have always graded against, so old
 * progress keeps counting.
 */
export function lessonProgress(
  key: string,
  phrases: { id?: string }[],
  grades: GradeStore,
  now = Date.now()
): LessonProgress {
  let done = 0;
  let fading = 0;
  phrases.forEach((phrase, index) => {
    const id = phrase.id ?? `${key}-phrase-${index}`;
    if (statusForId(grades, id) !== "known") return;
    done += 1;
    if (recallDetail(grades[id], now).fading) fading += 1;
  });
  return { done, total: phrases.length, fading };
}

/** A lesson is finished when everything in it has been learned at least once. */
export function isFinishedLesson(progress: LessonProgress): boolean {
  return progress.total > 0 && progress.done >= progress.total;
}

/** Finished, but its memory has started to go — so it is worth seeing again. */
export function isFadingLesson(progress: LessonProgress): boolean {
  return progress.fading > 0;
}

/**
 * Does this lesson survive the shelf?
 *
 * Split out from the view so the rule can be run rather than read. The
 * interesting cases are the ones nobody looks at on screen: a finished lesson
 * with fading items, and an explicit request for finished lessons while the
 * shelf is on.
 */
export function passesFinishedShelf(
  progress: LessonProgress,
  { hideFinished, askedForFinished }: { hideFinished: boolean; askedForFinished: boolean }
): boolean {
  if (!hideFinished) return true;
  if (askedForFinished) return true;
  if (!isFinishedLesson(progress)) return true;
  return isFadingLesson(progress);
}

/** How many lessons the shelf is holding, and how many it handed back. */
export function shelfCounts(all: LessonProgress[]): { finished: number; returned: number } {
  let finished = 0;
  let returned = 0;
  for (const progress of all) {
    if (!isFinishedLesson(progress)) continue;
    finished += 1;
    if (isFadingLesson(progress)) returned += 1;
  }
  return { finished, returned };
}

export function getHideFinishedLessons(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    // Storage blocked: show everything rather than hide work behind a
    // preference that cannot be read back or turned off.
    return false;
  }
}

export function setHideFinishedLessons(hide: boolean): boolean {
  try {
    if (hide) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    // Keep the library usable; the choice just does not outlive the session.
  }
  return hide;
}
