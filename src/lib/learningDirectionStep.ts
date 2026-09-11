import { meaningLanguageFor, targetLanguage } from "@/lib/courseLanguages";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";
import { translate, type TranslationLanguage } from "@/lib/translations";
import { swapStepForFrench } from "@/lib/frenchCourse";
import { swapStepForPolish } from "@/lib/polishCourse";
import { swapStepForPortuguese } from "@/lib/portugueseCourse";
import { swapStepForRussian } from "@/lib/russianCourse";
import { swapStepForSpanish } from "@/lib/spanishCourse";
import { swapStepForItalian } from "@/lib/italianCourse";

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
 * French and Polish can return FEWER steps than they were given: a card the
 * translation tables do not reach has nothing to show, and a blank card is
 * worse than a shorter lesson. The pack narrowing in frenchCourse.ts and
 * polishCourse.ts already removes most of them upstream; this is the backstop
 * for steps built from anywhere else. Spanish covers the whole catalogue and
 * so drops nothing in practice, but it goes through the same filter — the
 * cost is nothing and the alternative is a German card in a Spanish lesson
 * the first time a pack gains an entry.
 */
export function stepsForLearningDirection(
  steps: any[],
  direction: LearningDirection = getLearningDirection()
): any[] {
  // One exit, so the meaning pass below cannot be forgotten by a direction
  // added later — which is exactly how the older half of this file grew.
  const swapped = ((): any[] => {
    if (direction === "learn-en") return steps.map(swapStepForEnglish);
    if (direction === "learn-fr") {
      return steps.map((step) => swapStepForFrench(step)).filter((step) => step !== null);
    }
    if (direction === "learn-pl") {
      return steps.map((step) => swapStepForPolish(step)).filter((step) => step !== null);
    }
    if (direction === "learn-es") {
      return steps.map((step) => swapStepForSpanish(step)).filter((step) => step !== null);
    }
    if (direction === "learn-it") {
      return steps.map((step) => swapStepForItalian(step)).filter((step) => step !== null);
    }
    if (direction === "learn-pt") {
      return steps.map((step) => swapStepForPortuguese(step)).filter((step) => step !== null);
    }
    if (direction === "learn-ru") {
      return steps.map((step) => swapStepForRussian(step)).filter((step) => step !== null);
    }
    return steps;
  })();
  return withMeaningInAppLanguage(swapped, direction);
}

/**
 * Where the German of a card is, whichever course it has been put into.
 *
 * The courses keep it in three different places. A course read out of a table
 * stores it as `originalDe`, because its own `de` now holds the target. The
 * English course swaps the two columns, so its `en` is the German. The German
 * course never moves anything.
 */
function germanOf(item: any, direction: LearningDirection): string {
  const original = String(item?.originalDe ?? "").trim();
  if (original) return original;
  return String((direction === "learn-en" ? item?.en : item?.de) ?? "").trim();
}

/**
 * Write the meaning column in the language the app is written in.
 *
 * The courses hand back a meaning that is German or English, because those
 * are the two columns every card carries. A learner whose app is Polish was
 * therefore reading English meanings in every course — the app spoke Polish
 * to them everywhere except the one line that says what the sentence means.
 *
 * Every table is keyed by the same German, so the meaning in a third language
 * is one lookup away. Where a table does not reach a card the English stays,
 * rather than dropping the card: a course that shrinks by a tenth because of
 * the interface language is a worse trade than a line that is occasionally
 * still English.
 */
function withMeaningInAppLanguage(steps: any[], direction: LearningDirection): any[] {
  const meaning = meaningLanguageFor(targetLanguage(direction));
  if (meaning === "de" || meaning === "en") return steps;

  const rewrite = (item: any): any => {
    const german = germanOf(item, direction);
    // `meaningCode` says what the meaning line is REALLY in, so the chip
    // beside it can read EN on the cards the table did not reach rather than
    // promising a language that is not there. Everything downstream — the
    // label, the chip and which matcher grades a typed answer — follows it.
    if (!german) return { ...item, meaningCode: "en" };
    const written = translate(german, meaning as TranslationLanguage);
    if (!written || !written.trim()) return { ...item, meaningCode: "en" };
    // The word pictures are keyed on the English gloss, so the English has to
    // survive being replaced on screen — it is a lookup key here, not a line
    // the learner reads.
    return {
      ...item,
      en: written.trim(),
      originalEn: item?.originalEn ?? item?.en,
      meaningCode: meaning,
    };
  };

  return steps.map((step) => {
    if (step?.type === "sentence" && step.item) return { ...step, item: rewrite(step.item) };
    if (step?.type === "dialogue" && Array.isArray(step.dialogue?.lines)) {
      return { ...step, dialogue: { ...step.dialogue, lines: step.dialogue.lines.map(rewrite) } };
    }
    return step;
  });
}
