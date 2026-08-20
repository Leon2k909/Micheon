import {
  UK_QUESTIONS,
  ukChapters,
  ukQuestionsForChapter,
  type UkQuestion,
} from "@/lib/ukQuestionBank";
import {
  ukCategoryStrength,
  ukFavouriteQuestions,
  ukMistakes,
  type UkQuizState,
} from "@/lib/ukQuizProgress";

/**
 * The seven ways to sit a test, and the one that counts.
 *
 * This sits on top of the existing question bank and quiz progress rather
 * than beside them — one pool, one record of what you have answered, one set
 * of favourites. What it adds is the thing the practice screens do not have:
 * a real exam. 24 questions, 45 minutes, 18 to pass, drawn across the whole
 * syllabus rather than from whatever you were last revising.
 *
 * Only the exam is timed. A clock on a ten-question warm-up teaches panic
 * rather than citizenship.
 */
export type UkTestMode =
  | "exam"
  | "category"
  | "mixed"
  | "weakness"
  | "mistakes"
  | "favourites"
  | "quick";

/** The official test. These four numbers are the whole point of the feature. */
export const UK_EXAM_QUESTION_COUNT = 24;
export const UK_EXAM_DURATION_MS = 45 * 60 * 1000;
export const UK_EXAM_PASS_MARK = 18;
/** 18/24. Derived, so the two can never drift apart. */
export const UK_PASS_PERCENT = Math.round((UK_EXAM_PASS_MARK / UK_EXAM_QUESTION_COUNT) * 100);

export const UK_TEST_MODES: {
  mode: UkTestMode;
  title: string;
  blurb: string;
  count: number | null;
  timed: boolean;
}[] = [
  { mode: "exam", title: "Full exam simulation", blurb: "24 questions, 45 minutes, 18 to pass — exactly like the real test.", count: UK_EXAM_QUESTION_COUNT, timed: true },
  { mode: "quick", title: "Quick quiz", blurb: "Ten questions from anywhere. No timer.", count: 10, timed: false },
  { mode: "mixed", title: "Mixed test", blurb: "24 questions spread across every chapter, untimed.", count: 24, timed: false },
  { mode: "category", title: "Category test", blurb: "Drill one chapter of the syllabus at a time.", count: 20, timed: false },
  { mode: "weakness", title: "Weakness test", blurb: "Built from the topics you get wrong most.", count: 20, timed: false },
  { mode: "mistakes", title: "Mistakes test", blurb: "Only the questions you have answered incorrectly.", count: 20, timed: false },
  { mode: "favourites", title: "Favourites test", blurb: "The questions you starred to come back to.", count: null, timed: false },
];

export type UkTest = {
  mode: UkTestMode;
  /** One of the five official chapters, or null for a spread. */
  chapter: string | null;
  questions: UkQuestion[];
  /** null means untimed. */
  durationMs: number | null;
  /** How many right answers count as a pass for THIS test. */
  passMark: number;
};

export type UkExamAnswer = {
  questionId: string;
  /** null when left unanswered — the exam allows that, and marks it wrong. */
  chosen: number | null;
  correct: boolean;
};

export type UkExamOutcome = {
  mode: UkTestMode;
  chapter: string | null;
  at: number;
  total: number;
  correct: number;
  percent: number;
  passed: boolean;
  passMark: number;
  answers: UkExamAnswer[];
  elapsedMs: number;
};

/**
 * A shuffle that takes its randomness as an argument.
 *
 * Passing `random` in is what lets a check run a draw with a fixed seed and
 * assert the spread, rather than running a shuffle and hoping.
 */
function shuffle<T>(items: T[], random: () => number): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

function chapterOf(question: UkQuestion, lessonChapter: Map<string, string>): string {
  return lessonChapter.get(question.lesson) ?? "";
}

function lessonChapterMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const chapter of ukChapters()) {
    for (const question of ukQuestionsForChapter(chapter)) map.set(question.lesson, chapter);
  }
  return map;
}

/**
 * Take `count` questions spread across the chapters rather than drawn flat.
 *
 * A flat random draw from a pool weighted towards history hands out exams
 * weighted towards history, and the real test covers the whole handbook. This
 * walks the chapters in turn, taking one from each until the quota is filled.
 */
function drawAcrossChapters(count: number, random: () => number, pool = UK_QUESTIONS): UkQuestion[] {
  const map = lessonChapterMap();
  const chapters = ukChapters();
  const buckets = chapters
    .map((chapter) => shuffle(pool.filter((question) => chapterOf(question, map) === chapter), random))
    .filter((bucket) => bucket.length > 0);
  if (buckets.length === 0) return shuffle(pool, random).slice(0, count);

  const picked: UkQuestion[] = [];
  let index = 0;
  while (picked.length < count) {
    const bucket = buckets[index % buckets.length];
    const next = bucket.pop();
    if (next) picked.push(next);
    index += 1;
    if (buckets.every((entry) => entry.length === 0)) break;
  }
  return shuffle(picked, random);
}

/** Chapters ordered worst-first, using the existing per-topic strength. */
export function ukWeakestChapters(state: UkQuizState): string[] {
  const map = lessonChapterMap();
  const totals = new Map<string, { seen: number; correct: number }>();
  for (const strength of ukCategoryStrength(state)) {
    const chapter = map.get(strength.id);
    if (!chapter || strength.answered === 0) continue;
    const entry = totals.get(chapter) ?? { seen: 0, correct: 0 };
    entry.seen += strength.answered;
    entry.correct += strength.correct;
    totals.set(chapter, entry);
  }
  return [...totals.entries()]
    .sort((a, b) => (a[1].correct / a[1].seen) - (b[1].correct / b[1].seen))
    .map(([chapter]) => chapter);
}

export function buildUkTest(
  mode: UkTestMode,
  state: UkQuizState,
  options: { chapter?: string | null; random?: () => number } = {}
): UkTest {
  const random = options.random ?? Math.random;
  const spec = UK_TEST_MODES.find((entry) => entry.mode === mode);
  let questions: UkQuestion[] = [];
  let chapter: string | null = options.chapter ?? null;

  switch (mode) {
    case "exam":
      questions = drawAcrossChapters(UK_EXAM_QUESTION_COUNT, random);
      chapter = null;
      break;
    case "mixed":
      questions = drawAcrossChapters(24, random);
      chapter = null;
      break;
    case "quick":
      questions = drawAcrossChapters(10, random);
      chapter = null;
      break;
    case "category": {
      const chosen = chapter ?? ukChapters()[0];
      chapter = chosen;
      questions = shuffle(ukQuestionsForChapter(chosen), random).slice(0, 20);
      break;
    }
    case "weakness": {
      const weakest = ukWeakestChapters(state).slice(0, 2);
      // Nothing answered yet: a weakness test cannot know your weakness, so it
      // falls back to a spread rather than pretending or returning nothing.
      const map = lessonChapterMap();
      const pool = weakest.length
        ? UK_QUESTIONS.filter((question) => weakest.includes(chapterOf(question, map)))
        : UK_QUESTIONS;
      questions = drawAcrossChapters(20, random, pool);
      chapter = weakest[0] ?? null;
      break;
    }
    case "mistakes":
      questions = shuffle(ukMistakes(state).map((entry) => entry.question), random).slice(0, 20);
      chapter = null;
      break;
    case "favourites":
      questions = shuffle(ukFavouriteQuestions(state), random);
      chapter = null;
      break;
  }

  return {
    mode,
    chapter,
    questions,
    durationMs: spec?.timed ? UK_EXAM_DURATION_MS : null,
    // The exam's 18 is fixed. Everything else applies the same 75% standard to
    // however many questions it actually has, so a 10-question quiz needs 8
    // rather than an impossible 18.
    passMark: mode === "exam"
      ? UK_EXAM_PASS_MARK
      : Math.ceil(questions.length * (UK_EXAM_PASS_MARK / UK_EXAM_QUESTION_COUNT)),
  };
}

export function scoreUkTest(
  test: UkTest,
  chosen: Record<string, number | null>,
  meta: { at: number; elapsedMs: number }
): UkExamOutcome {
  const answers: UkExamAnswer[] = test.questions.map((question) => {
    const pick = chosen[question.id] ?? null;
    return { questionId: question.id, chosen: pick, correct: pick !== null && pick === question.answer };
  });
  const correct = answers.filter((answer) => answer.correct).length;
  const total = test.questions.length;
  return {
    mode: test.mode,
    chapter: test.chapter,
    at: meta.at,
    total,
    correct,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    passed: correct >= test.passMark,
    passMark: test.passMark,
    answers,
    elapsedMs: meta.elapsedMs,
  };
}

export function ukModeTitle(mode: UkTestMode): string {
  return UK_TEST_MODES.find((entry) => entry.mode === mode)?.title ?? mode;
}
