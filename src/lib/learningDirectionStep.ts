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
