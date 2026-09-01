import { ukCategoryStrength, ukMistakes, type UkQuizState } from "@/lib/ukQuizProgress";
import { ukChapters, ukQuestionsForChapter } from "@/lib/ukQuestionBank";
import { UK_PASS_PERCENT } from "@/lib/lifeInTheUkTests";

/**
 * What to tell someone about where they stand.
 *
 * Deliberately quiet until there is something to go on. Advice generated from
 * two answered questions is noise dressed as insight, and a learner told their
 * weakest topic before they have attempted any of them will reasonably stop
 * believing the next thing the app says.
 *
 * Built on the existing per-topic strength rather than a second tally, so what
 * the advice says and what the progress screen shows can never disagree.
 */
type UkAdvice = {
  id: string;
  tone: "praise" | "warn" | "info";
  text: string;
  /** A chapter to open if the learner acts on it. */
  chapter?: string;
};

function chapterTotals(state: UkQuizState) {
  const byChapter = new Map<string, { answered: number; correct: number }>();
  const lessonChapter = new Map<string, string>();
  for (const chapter of ukChapters()) {
    for (const question of ukQuestionsForChapter(chapter)) lessonChapter.set(question.lesson, chapter);
  }
  for (const strength of ukCategoryStrength(state)) {
    const chapter = lessonChapter.get(strength.id);
    if (!chapter) continue;
    const entry = byChapter.get(chapter) ?? { answered: 0, correct: 0 };
    entry.answered += strength.answered;
    entry.correct += strength.correct;
    byChapter.set(chapter, entry);
  }
  return byChapter;
}

export function ukAdvice(state: UkQuizState): UkAdvice[] {
  const out: UkAdvice[] = [];
  const totals = chapterTotals(state);
  const answered = [...totals.values()].reduce((sum, entry) => sum + entry.answered, 0);

  if (answered === 0) {
    return [{
      id: "start",
      tone: "info",
      text: "Start with a quick quiz to see where you stand. Nothing is recorded until you answer something.",
    }];
  }

  // The question a learner actually has is "am I ready?", so three passed
  // exams in a row is the headline when it happens.
  const exams = [...state.tests].reverse().filter((test) => test.mode === "exam");
  const lastThree = exams.slice(0, 3);
  if (lastThree.length === 3 && lastThree.every((test) => test.passed)) {
    out.push({ id: "ready", tone: "praise", text: "You have passed three exam simulations in a row. You are well prepared." });
  } else if (exams.length > 0 && exams[0].passed) {
    out.push({
      id: "passed-last",
      tone: "praise",
      text: `You passed your last exam simulation with ${exams[0].score}/${exams[0].total}. Two more passes and you are ready.`,
    });
  }

  const ranked = [...totals.entries()]
    .filter(([, entry]) => entry.answered >= 4)
    .map(([chapter, entry]) => ({ chapter, accuracy: Math.round((entry.correct / entry.answered) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy);

  if (ranked.length >= 2) {
    const weakest = ranked[0];
    if (weakest.accuracy < UK_PASS_PERCENT) {
      out.push({
        id: `weakest-${weakest.chapter}`,
        tone: "warn",
        text: `${weakest.chapter} is currently your weakest area, at ${weakest.accuracy}%.`,
        chapter: weakest.chapter,
      });
    }
    const strongest = ranked[ranked.length - 1];
    if (strongest.accuracy >= 90 && strongest.chapter !== weakest.chapter) {
      out.push({
        id: `strongest-${strongest.chapter}`,
        tone: "praise",
        text: `${strongest.chapter} is your strongest area, at ${strongest.accuracy}%.`,
        chapter: strongest.chapter,
      });
    }
  }

  // Outstanding mistakes counted per chapter, so the advice names a topic
  // rather than only a number.
  const lessonChapter = new Map<string, string>();
  for (const chapter of ukChapters()) {
    for (const question of ukQuestionsForChapter(chapter)) lessonChapter.set(question.lesson, chapter);
  }
  const mistakesByChapter = new Map<string, number>();
  for (const mistake of ukMistakes(state)) {
    const chapter = lessonChapter.get(mistake.question.lesson);
    if (!chapter) continue;
    mistakesByChapter.set(chapter, (mistakesByChapter.get(chapter) ?? 0) + 1);
  }
  const worst = [...mistakesByChapter.entries()].sort((a, b) => b[1] - a[1])[0];
  if (worst && worst[1] >= 3) {
    out.push({
      id: `mistakes-${worst[0]}`,
      tone: "warn",
      text: `You have answered ${worst[1]} questions on ${worst[0]} incorrectly. We recommend revisiting this topic.`,
      chapter: worst[0],
    });
  }

  const untouched = ukChapters().filter((chapter) => (totals.get(chapter)?.answered ?? 0) === 0);
  if (untouched.length > 0 && answered >= 10) {
    out.push({
      id: "untouched",
      tone: "info",
      text: `You have not answered anything on ${untouched.join(", ")} yet.`,
      chapter: untouched[0],
    });
  }

  if (exams.length === 0 && answered >= 20) {
    out.push({
      id: "try-exam",
      tone: "info",
      text: "You have practised enough to try a full exam simulation — 24 questions in 45 minutes.",
    });
  }

  return out;
}
