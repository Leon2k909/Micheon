import type { CountryPack, CountryQuestion } from "@/lib/countryStudies";
import { packChapters } from "@/lib/countryPacks";
import type { CountryQuizState } from "@/lib/countryQuizProgress";
import { countryProgress } from "@/lib/countryQuizProgress";

/**
 * The seven ways to sit a test, for whichever country is being studied.
 *
 * Same seven modes as lifeInTheUkTests, same draw logic, same 75% standard for
 * the untimed ones — with the exam's own numbers coming from the pack instead
 * of being constants. The UK sits 24 questions in 45 minutes needing 18; the
 * German test is 33 in 60 needing 17. Everything else about how a test is
 * built and scored is identical, which is what Michelle asked for.
 *
 * Only the exam is timed. A clock on a ten-question warm-up teaches panic
 * rather than citizenship.
 */

export type CountryTestMode =
  | "exam"
  | "category"
  | "mixed"
  | "weakness"
  | "mistakes"
  | "favourites"
  | "quick";

export type CountryTestModeSpec = {
  mode: CountryTestMode;
  title: string;
  /**
   * A format string, not a finished sentence.
   *
   * The exam modes name the country's own question count, duration and pass
   * mark, and those differ per country — so the view formats it with uiFmt
   * and the translation table holds one entry rather than one per country.
   */
  blurb: string;
  blurbValues?: Record<string, string | number>;
  count: number | null;
  timed: boolean;
};

export type CountryTest = {
  mode: CountryTestMode;
  /** One of the course's chapters, or null for a spread. */
  chapter: string | null;
  questions: CountryQuestion[];
  /** null means untimed. */
  durationMs: number | null;
  /** How many right answers count as a pass for THIS test. */
  passMark: number;
};

export type CountryExamAnswer = {
  questionId: string;
  /** null when left unanswered — the exam allows that, and marks it wrong. */
  chosen: number | null;
  correct: boolean;
};

export type CountryExamOutcome = {
  mode: CountryTestMode;
  chapter: string | null;
  at: number;
  total: number;
  correct: number;
  percent: number;
  passed: boolean;
  passMark: number;
  answers: CountryExamAnswer[];
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

/** The exam's pass ratio, used as the standard for every untimed mode too. */
function passRatio(pack: CountryPack): number {
  return pack.exam.passMark / pack.exam.questionCount;
}

export function countryPassPercent(pack: CountryPack): number {
  return Math.round(passRatio(pack) * 100);
}

export function countryTestModes(pack: CountryPack): CountryTestModeSpec[] {
  const { questionCount, passMark } = pack.exam;
  const minutes = Math.round(pack.exam.durationMs / 60000);
  return [
    {
      mode: "exam",
      title: "Full exam simulation",
      blurb: "{count} questions, {minutes} minutes, {pass} to pass — exactly like the real test.",
      blurbValues: { count: questionCount, minutes, pass: passMark },
      count: questionCount,
      timed: true,
    },
    { mode: "quick", title: "Quick quiz", blurb: "Ten questions from anywhere. No timer.", count: 10, timed: false },
    {
      mode: "mixed",
      title: "Mixed test",
      blurb: "{count} questions spread across every chapter, untimed.",
      blurbValues: { count: questionCount },
      count: questionCount,
      timed: false,
    },
    { mode: "category", title: "Category test", blurb: "Drill one chapter of the syllabus at a time.", count: 20, timed: false },
    { mode: "weakness", title: "Weakness test", blurb: "Built from the topics you get wrong most.", count: 20, timed: false },
    { mode: "mistakes", title: "Mistakes test", blurb: "Only the questions you have answered incorrectly.", count: 20, timed: false },
    { mode: "favourites", title: "Favourites test", blurb: "The questions you starred to come back to.", count: null, timed: false },
  ];
}

export function countryModeTitle(pack: CountryPack, mode: CountryTestMode): string {
  return countryTestModes(pack).find((entry) => entry.mode === mode)?.title ?? mode;
}

/** The test engine for one country. */
export function countryTests(pack: CountryPack) {
  const progress = countryProgress(pack);
  const chapters = () => packChapters(pack);

  function questionsForChapter(chapter: string): CountryQuestion[] {
    const lessonIds = new Set(
      (pack.course.lessons ?? []).filter((lesson) => lesson.section === chapter).map((lesson) => lesson.id)
    );
    return pack.questions.filter((question) => lessonIds.has(question.lesson));
  }

  function lessonChapterMap(): Map<string, string> {
    const map = new Map<string, string>();
    for (const lesson of pack.course.lessons ?? []) map.set(lesson.id, lesson.section);
    return map;
  }

  const chapterOf = (question: CountryQuestion, map: Map<string, string>): string =>
    map.get(question.lesson) ?? "";

  /**
   * Take `count` questions spread across the chapters rather than drawn flat.
   *
   * A flat random draw from a pool weighted towards history hands out exams
   * weighted towards history, and the real test covers the whole syllabus.
   * This walks the chapters in turn, taking one from each until the quota is
   * filled.
   */
  function drawAcrossChapters(
    count: number,
    random: () => number,
    pool: CountryQuestion[] = pack.questions
  ): CountryQuestion[] {
    const map = lessonChapterMap();
    const buckets = chapters()
      .map((chapter) => shuffle(pool.filter((question) => chapterOf(question, map) === chapter), random))
      .filter((bucket) => bucket.length > 0);
    if (buckets.length === 0) return shuffle(pool, random).slice(0, count);

    const picked: CountryQuestion[] = [];
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
  function weakestChapters(state: CountryQuizState): string[] {
    const map = lessonChapterMap();
    const totals = new Map<string, { seen: number; correct: number }>();
    for (const strength of progress.categoryStrength(state)) {
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

  function build(
    mode: CountryTestMode,
    state: CountryQuizState,
    options: { chapter?: string | null; random?: () => number } = {}
  ): CountryTest {
    const random = options.random ?? Math.random;
    const spec = countryTestModes(pack).find((entry) => entry.mode === mode);
    let questions: CountryQuestion[] = [];
    let chapter: string | null = options.chapter ?? null;

    switch (mode) {
      case "exam":
        questions = drawAcrossChapters(pack.exam.questionCount, random);
        chapter = null;
        break;
      case "mixed":
        questions = drawAcrossChapters(pack.exam.questionCount, random);
        chapter = null;
        break;
      case "quick":
        questions = drawAcrossChapters(10, random);
        chapter = null;
        break;
      case "category": {
        const chosen = chapter ?? chapters()[0];
        chapter = chosen;
        questions = shuffle(questionsForChapter(chosen), random).slice(0, 20);
        break;
      }
      case "weakness": {
        const weakest = weakestChapters(state).slice(0, 2);
        // Nothing answered yet: a weakness test cannot know your weakness, so
        // it falls back to a spread rather than pretending or returning nothing.
        const map = lessonChapterMap();
        const pool = weakest.length
          ? pack.questions.filter((question) => weakest.includes(chapterOf(question, map)))
          : pack.questions;
        questions = drawAcrossChapters(20, random, pool);
        chapter = weakest[0] ?? null;
        break;
      }
      case "mistakes":
        questions = shuffle(progress.mistakes(state).map((entry) => entry.question), random).slice(0, 20);
        chapter = null;
        break;
      case "favourites":
        questions = shuffle(progress.favouriteQuestions(state), random);
        chapter = null;
        break;
    }

    return {
      mode,
      chapter,
      questions,
      durationMs: spec?.timed ? pack.exam.durationMs : null,
      // The exam's own pass mark is fixed. Everything else applies the same
      // ratio to however many questions it actually has, so a 10-question quiz
      // needs 8 rather than an impossible 18.
      passMark: mode === "exam"
        ? pack.exam.passMark
        : Math.ceil(questions.length * passRatio(pack)),
    };
  }

  function score(
    test: CountryTest,
    chosen: Record<string, number | null>,
    meta: { at: number; elapsedMs: number }
  ): CountryExamOutcome {
    const answers: CountryExamAnswer[] = test.questions.map((question) => {
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

  return {
    pack,
    modes: () => countryTestModes(pack),
    chapters,
    questionsForChapter,
    weakestChapters,
    build,
    score,
    modeTitle: (mode: CountryTestMode) => countryModeTitle(pack, mode),
  };
}
