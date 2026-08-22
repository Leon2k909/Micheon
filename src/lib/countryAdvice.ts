import type { CountryPack } from "@/lib/countryStudies";
import { packChapters } from "@/lib/countryPacks";
import { countryProgress, type CountryQuizState } from "@/lib/countryQuizProgress";
import { countryPassPercent } from "@/lib/countryTests";

/**
 * What to tell someone about where they stand, for whichever country.
 *
 * Deliberately quiet until there is something to go on. Advice generated from
 * two answered questions is noise dressed as insight, and a learner told their
 * weakest topic before they have attempted any of them will reasonably stop
 * believing the next thing the app says.
 *
 * Built on the existing per-topic strength rather than a second tally, so what
 * the advice says and what the progress screen shows can never disagree.
 *
 * Same rules as lifeInTheUkAdvice; the exam's own numbers come from the pack,
 * so the German version says 33 questions in 60 minutes without a second copy
 * of the logic that decides when to say it.
 */

export type CountryAdvice = {
  id: string;
  tone: "praise" | "warn" | "info";
  /**
   * The English sentence, used as the translation key.
   *
   * Kept as text rather than an opaque id so the British reading is the
   * source of truth and a missing translation falls back to something
   * sensible rather than to a key name.
   */
  text: string;
  /** Values for the {placeholders} in text, when it has any. */
  values?: Record<string, string | number>;
  /** A chapter to open if the learner acts on it. */
  chapter?: string;
};

export function countryAdvice(pack: CountryPack, state: CountryQuizState): CountryAdvice[] {
  const progress = countryProgress(pack);
  const chapters = packChapters(pack);

  const lessonChapter = new Map<string, string>();
  for (const lesson of pack.course.lessons ?? []) lessonChapter.set(lesson.id, lesson.section);

  const totals = new Map<string, { answered: number; correct: number }>();
  for (const strength of progress.categoryStrength(state)) {
    const chapter = lessonChapter.get(strength.id);
    if (!chapter) continue;
    const entry = totals.get(chapter) ?? { answered: 0, correct: 0 };
    entry.answered += strength.answered;
    entry.correct += strength.correct;
    totals.set(chapter, entry);
  }

  const out: CountryAdvice[] = [];
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
      text: "You passed your last exam simulation with {score}/{total}. Two more passes and you are ready.",
      values: { score: exams[0].score, total: exams[0].total },
    });
  }

  const passPercent = countryPassPercent(pack);
  const ranked = [...totals.entries()]
    .filter(([, entry]) => entry.answered >= 4)
    .map(([chapter, entry]) => ({ chapter, accuracy: Math.round((entry.correct / entry.answered) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy);

  if (ranked.length >= 2) {
    const weakest = ranked[0];
    if (weakest.accuracy < passPercent) {
      out.push({
        id: `weakest-${weakest.chapter}`,
        tone: "warn",
        text: "{chapter} is currently your weakest area, at {percent}%.",
        values: { chapter: weakest.chapter, percent: weakest.accuracy },
        chapter: weakest.chapter,
      });
    }
    const strongest = ranked[ranked.length - 1];
    if (strongest.accuracy >= 90 && strongest.chapter !== weakest.chapter) {
      out.push({
        id: `strongest-${strongest.chapter}`,
        tone: "praise",
        text: "{chapter} is your strongest area, at {percent}%.",
        values: { chapter: strongest.chapter, percent: strongest.accuracy },
        chapter: strongest.chapter,
      });
    }
  }

  // Outstanding mistakes counted per chapter, so the advice names a topic
  // rather than only a number.
  const mistakesByChapter = new Map<string, number>();
  for (const mistake of progress.mistakes(state)) {
    const chapter = lessonChapter.get(mistake.question.lesson);
    if (!chapter) continue;
    mistakesByChapter.set(chapter, (mistakesByChapter.get(chapter) ?? 0) + 1);
  }
  const worst = [...mistakesByChapter.entries()].sort((a, b) => b[1] - a[1])[0];
  if (worst && worst[1] >= 3) {
    out.push({
      id: `mistakes-${worst[0]}`,
      tone: "warn",
      text: "You have answered {count} questions on {chapter} incorrectly. We recommend revisiting this topic.",
      values: { count: worst[1], chapter: worst[0] },
      chapter: worst[0],
    });
  }

  const untouched = chapters.filter((chapter) => (totals.get(chapter)?.answered ?? 0) === 0);
  if (untouched.length > 0 && answered >= 10) {
    out.push({
      id: "untouched",
      tone: "info",
      text: "You have not answered anything on {chapters} yet.",
      values: { chapters: untouched.join(", ") },
      chapter: untouched[0],
    });
  }

  if (exams.length === 0 && answered >= 20) {
    const minutes = Math.round(pack.exam.durationMs / 60000);
    out.push({
      id: "try-exam",
      tone: "info",
      text: "You have practised enough to try a full exam simulation — {count} questions in {minutes} minutes.",
      values: { count: pack.exam.questionCount, minutes },
    });
  }

  return out;
}
