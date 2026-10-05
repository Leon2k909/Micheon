/**
 * The return of a phrase taught a couple of cards earlier in the same sitting.
 *
 * A copy of the taught step, stamped secondShowing so it takes the tap-only
 * return route, and kept at mastery strong so everything downstream that
 * reads a repeat off the copy still sees what it always saw. Marked as
 * reinforcement: it is practice, so it neither climbs the ladder nor moves
 * the due date.
 */
export function secondShowingOf(step: any): any {
  return {
    ...step,
    reinforcement: true,
    secondShowing: true,
    reviewReason: "second-showing",
    item: { ...step.item, mastery: "strong", secondShowing: true },
  };
}

/**
 * Put a replacement phrase everywhere a phrase stood in the sitting.
 *
 * A phrase is in a sitting twice: where it is taught, and two phrases later
 * where it comes back. Replacing only the first left the return behind, and
 * the preview, which shows each phrase where it first appears, then showed
 * the phrase just marked known again in a later slot; the lesson would have
 * drilled it as well. Every copy goes, and a return comes back as the return
 * of the replacement, so the new phrase is taught and comes back on the same
 * beat the old one would have.
 */
export function replacePhraseSteps(steps: any[], itemId: string, replacement: any): any[] {
  return steps.map((step) => {
    if (step?.type !== "sentence" || step.item?.id !== itemId) return step;
    return step.secondShowing ? secondShowingOf(replacement) : replacement;
  });
}
