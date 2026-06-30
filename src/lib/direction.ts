const KEY = "gl-direction";

// Which language the learner is studying. "learn-de" is the app's original mode
// (English speaker learning German). "learn-en" flips it so a German speaker
// learns English — the same content shown the other way round (English becomes
// the target you read/hear/type, German becomes the meaning).
export type LearningDirection = "learn-de" | "learn-en";

export function getLearningDirection(): LearningDirection {
  if (typeof window === "undefined") return "learn-de";
  return localStorage.getItem(KEY) === "learn-en" ? "learn-en" : "learn-de";
}

export function setLearningDirection(d: LearningDirection) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, d);
}

export function learningEnglish(): boolean {
  return getLearningDirection() === "learn-en";
}

/** BCP-47 tag of the language being learned — used for TTS voice + speech recognition. */
export function targetLangTag(): string {
  return getLearningDirection() === "learn-en" ? "en-US" : "de-DE";
}
