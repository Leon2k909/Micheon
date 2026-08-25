import { getLearningDirection, type LearningDirection } from "@/lib/direction";
import { swapStepForFrench } from "@/lib/frenchCourse";

// Flip a built session step's display fields (de<->en) so English becomes the
// target and German becomes the meaning. IDs and progress metadata stay put.
export function swapStepForEnglish(step: any): any {
  if (step?.type === "sentence" && step.item) {
    const item = { ...step.item };
    const keepEnglishCoaching = item.coachingLanguage === "en" || item.coachingLanguage === "both";
    if (!keepEnglishCoaching) {
      for (const key of ["say", "long", "short", "use", "when", "tierNote"]) delete item[key];
    }
    delete item.coachingLanguage;
    return { ...step, item: { ...item, de: step.item.en, en: step.item.de } };
  }

  if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
    const keepEnglishCoaching = step.dialogue.coachingLanguage === "en"
      || step.dialogue.coachingLanguage === "both";
    return {
      ...step,
      dialogue: {
        ...step.dialogue,
        coachingLanguage: undefined,
        lines: step.dialogue.lines.map((line: any) => {
          const rest = { ...line };
          if (!keepEnglishCoaching) {
            for (const key of ["say", "long", "short", "use", "when", "tierNote"]) delete rest[key];
          }
          return { ...rest, de: line.en, en: line.de };
        }),
      },
    };
  }

  return step;
}

/**
 * Put a finished list of steps into the direction being studied.
 *
 * Every caller used to write `if (learningEnglish()) steps = steps.map(...)`,
 * which is five places that each had to remember a third direction existed.
 * They call this instead, so adding one is editing one function.
 *
 * French can return FEWER steps than it was given: a card the translation
 * tables do not reach has no French to show, and a blank card is worse than a
 * shorter lesson. The pack narrowing in frenchCourse.ts already removes most
 * of them upstream; this is the backstop for steps built from anywhere else.
 */
export function stepsForLearningDirection(
  steps: any[],
  direction: LearningDirection = getLearningDirection()
): any[] {
  if (direction === "learn-en") return steps.map(swapStepForEnglish);
  if (direction === "learn-fr") {
    return steps.map((step) => swapStepForFrench(step)).filter((step) => step !== null);
  }
  return steps;
}
