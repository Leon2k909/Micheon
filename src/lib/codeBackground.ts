const KEY = "gl-code-background";

// Which programming language the learner already knows. The C# course adapts
// its explanations and side-by-side comparisons to speak that language:
//   python → compare against Python (the original course voice)
//   js     → compare against JavaScript
//   new    → no prior language: comparisons collapse to plain C# with
//            beginner-friendly explanations
// null = not asked yet → the course shows a one-time picker.
export type CodeBackground = "python" | "js" | "new";

export const CODE_BACKGROUND_LABEL: Record<CodeBackground, string> = {
  python: "Python",
  js: "JavaScript",
  new: "New to coding",
};

export function getCodeBackground(): CodeBackground | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY);
  return v === "python" || v === "js" || v === "new" ? v : null;
}

export function setCodeBackground(bg: CodeBackground) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, bg);
}
