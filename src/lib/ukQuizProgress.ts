import { loadScopedJson, saveScopedJson, getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { loadCourseProgress } from "@/lib/courses";
import { lifeInTheUkCourse } from "@/lib/lifeInTheUkCourse";
import {
  UK_QUESTIONS,
  ukCategories,
  ukQuestionById,
  ukQuestionsForLesson,
  type UkLevel,
  type UkQuestion,
} from "@/lib/ukQuestionBank";

/**
 * What the learner has done with the Life in the UK question bank.
 *
 * One record per question rather than a running total, because every feature
 * asked of this file needs per-question history: which to show less often,
 * which to drill, what went wrong last time and how often. A pair of counters
 * would answer none of those.
 *
 * Timestamps are milliseconds. Days are stored as "YYYY-MM-DD" in LOCAL time,
 * not UTC — a daily quiz that rolls over at 1am because the user is in CEST
 * would be a bug the user experiences as the app forgetting their streak.
 */

const STORE_KEY = "uk-quiz-v1";

export type UkAnswerStat = {
  /** Times answered correctly, ever. */
  correct: number;
  /** Times answered wrongly, ever. */
  wrong: number;
  /** When it was last put in front of the learner. */
  lastSeen: number;
  /** When it was last got wrong. 0 means never. */
  lastWrong: number;
  /** The option index chosen the last time it was got WRONG, for "my mistakes". */
  lastWrongChoice: number;
};

export type UkTestResult = {
  at: number;
  score: number;
  total: number;
  /** Lesson id, chapter name, or a mode name like "daily" / "review". */
  scope: string;
};

export type UkDailyState = {
  /** Local YYYY-MM-DD the current set was generated for. */
  day: string;
  ids: string[];
  /** questionId -> was it answered correctly */
  answered: Record<string, boolean>;
  /** Ids served yesterday, so today can avoid repeating them. */
  previousIds: string[];
};

export type UkQuizState = {
  stats: Record<string, UkAnswerStat>;
  favourites: string[];
  tests: UkTestResult[];
  daily: UkDailyState;
  /** Consecutive days the daily quiz was finished. */
  streak: number;
  /** Last local day the daily quiz was completed. */
  streakDay: string;
  /** How many questions a day the learner is aiming for. */
  dailyGoal: number;
};

export const UK_DAILY_SIZE = 10;

function emptyState(): UkQuizState {
  return {
    stats: {},
    favourites: [],
    tests: [],
    daily: { day: "", ids: [], answered: {}, previousIds: [] },
    streak: 0,
    streakDay: "",
    dailyGoal: UK_DAILY_SIZE,
  };
}

/** Local calendar day, not UTC. See the note at the top of the file. */
export function ukToday(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalise(raw: unknown): UkQuizState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const value = raw as Partial<UkQuizState>;
  const stats: Record<string, UkAnswerStat> = {};
  if (value.stats && typeof value.stats === "object") {
    for (const [id, entry] of Object.entries(value.stats)) {
      if (!entry || typeof entry !== "object") continue;
      const stat = entry as Partial<UkAnswerStat>;
      stats[id] = {
        correct: Number(stat.correct) || 0,
        wrong: Number(stat.wrong) || 0,
        lastSeen: Number(stat.lastSeen) || 0,
        lastWrong: Number(stat.lastWrong) || 0,
        lastWrongChoice: Number.isInteger(stat.lastWrongChoice) ? Number(stat.lastWrongChoice) : -1,
      };
    }
  }
  return {
    stats,
    favourites: Array.isArray(value.favourites) ? value.favourites.filter((id) => typeof id === "string") : [],
    tests: Array.isArray(value.tests)
      ? value.tests.filter((t): t is UkTestResult => Boolean(t) && typeof t === "object").slice(-200)
      : [],
    daily: value.daily && typeof value.daily === "object"
      ? {
          day: String(value.daily.day ?? ""),
          ids: Array.isArray(value.daily.ids) ? value.daily.ids : [],
          answered: (value.daily.answered && typeof value.daily.answered === "object") ? value.daily.answered : {},
          previousIds: Array.isArray(value.daily.previousIds) ? value.daily.previousIds : [],
        }
      : base.daily,
    streak: Number(value.streak) || 0,
    streakDay: String(value.streakDay ?? ""),
    dailyGoal: Number(value.dailyGoal) || UK_DAILY_SIZE,
  };
}

export function loadUkQuiz(profile: UserProfile | null = getAuthUser()): UkQuizState {
  return normalise(loadScopedJson<unknown>(STORE_KEY, null, profile));
}

export function saveUkQuiz(state: UkQuizState, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(STORE_KEY, state, profile);
}

export function ukStatFor(state: UkQuizState, id: string): UkAnswerStat {
  return state.stats[id] ?? { correct: 0, wrong: 0, lastSeen: 0, lastWrong: 0, lastWrongChoice: -1 };
}

/**
 * Record one answer.
 *
 * Returns the updated state so a caller can render from it without a reload —
 * the store is written here, but React needs the new object to re-render.
 */
export function recordUkAnswer(
  questionId: string,
  chosenIndex: number,
  correct: boolean,
  profile: UserProfile | null = getAuthUser(),
  state: UkQuizState = loadUkQuiz(profile)
): UkQuizState {
  const now = Date.now();
  const previous = ukStatFor(state, questionId);
  const next: UkQuizState = {
    ...state,
    stats: {
      ...state.stats,
      [questionId]: {
        correct: previous.correct + (correct ? 1 : 0),
        wrong: previous.wrong + (correct ? 0 : 1),
        lastSeen: now,
        lastWrong: correct ? previous.lastWrong : now,
        lastWrongChoice: correct ? previous.lastWrongChoice : chosenIndex,
      },
    },
  };
  saveUkQuiz(next, profile);
  return next;
}

export function toggleUkFavourite(
  questionId: string,
  profile: UserProfile | null = getAuthUser(),
  state: UkQuizState = loadUkQuiz(profile)
): UkQuizState {
  const has = state.favourites.includes(questionId);
  const next: UkQuizState = {
    ...state,
    favourites: has ? state.favourites.filter((id) => id !== questionId) : [...state.favourites, questionId],
  };
  saveUkQuiz(next, profile);
  return next;
}

export function recordUkTest(
  result: UkTestResult,
  profile: UserProfile | null = getAuthUser(),
  state: UkQuizState = loadUkQuiz(profile)
): UkQuizState {
  const next: UkQuizState = { ...state, tests: [...state.tests, result].slice(-200) };
  saveUkQuiz(next, profile);
  return next;
}

// ── Mistakes ──────────────────────────────────────────────────────────────

export type UkMistake = {
  question: UkQuestion;
  /** The option index chosen the last time it was wrong; -1 if unknown. */
  yourAnswer: number;
  wrongCount: number;
  lastWrong: number;
};

/** Everything ever answered wrongly, worst and most recent first. */
export function ukMistakes(state: UkQuizState): UkMistake[] {
  const out: UkMistake[] = [];
  for (const [id, stat] of Object.entries(state.stats)) {
    if (stat.wrong <= 0) continue;
    const question = ukQuestionById(id);
    if (!question) continue; // a question retired from the bank
    out.push({ question, yourAnswer: stat.lastWrongChoice, wrongCount: stat.wrong, lastWrong: stat.lastWrong });
  }
  return out.sort((a, b) => (b.wrongCount - a.wrongCount) || (b.lastWrong - a.lastWrong));
}

export function ukFavouriteQuestions(state: UkQuizState): UkQuestion[] {
  return state.favourites.map(ukQuestionById).filter((q): q is UkQuestion => Boolean(q));
}

// ── Selection ─────────────────────────────────────────────────────────────

/**
 * How badly this question needs to be asked again.
 *
 * Higher wins. The shape of it: getting something wrong raises it a lot and
 * recently wrong raises it further; every correct answer lowers it, with
 * diminishing effect so a question is never buried permanently; and anything
 * untouched or long unseen drifts back up so the pool keeps circulating rather
 * than narrowing to a favourite few.
 */
export function ukQuestionWeight(stat: UkAnswerStat, now: number = Date.now()): number {
  let weight = 10;
  weight += stat.wrong * 12;
  weight -= Math.min(stat.correct, 6) * 3;
  if (stat.lastWrong > 0) {
    const daysSinceWrong = (now - stat.lastWrong) / 86_400_000;
    if (daysSinceWrong < 1) weight += 20;
    else if (daysSinceWrong < 7) weight += 10;
    else if (daysSinceWrong < 30) weight += 4;
  }
  if (stat.lastSeen === 0) {
    weight += 8; // never asked — worth seeing once
  } else {
    const daysSinceSeen = (now - stat.lastSeen) / 86_400_000;
    weight += Math.min(daysSinceSeen, 30) * 0.6;
  }
  return Math.max(1, weight);
}

function weightedSample(pool: UkQuestion[], count: number, state: UkQuizState, now: number): UkQuestion[] {
  const remaining = [...pool];
  const picked: UkQuestion[] = [];
  while (picked.length < count && remaining.length > 0) {
    const weights = remaining.map((q) => ukQuestionWeight(ukStatFor(state, q.id), now));
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * total;
    let index = 0;
    for (; index < remaining.length - 1; index += 1) {
      roll -= weights[index];
      if (roll <= 0) break;
    }
    picked.push(remaining[index]);
    remaining.splice(index, 1);
  }
  return picked;
}

export type UkPickOptions = {
  /** Restrict to one lesson id. */
  lesson?: string;
  /** Restrict to one of the five chapters. */
  chapter?: string;
  levels?: UkLevel[];
  count?: number;
  /** Only questions the learner has got wrong at least once. */
  mistakesOnly?: boolean;
  /** Only favourites. */
  favouritesOnly?: boolean;
  /** Ids to leave out — used by the daily quiz to avoid yesterday's set. */
  exclude?: string[];
};

export function ukPickQuestions(
  options: UkPickOptions,
  state: UkQuizState,
  now: number = Date.now()
): UkQuestion[] {
  const chapterLessons = options.chapter
    ? new Set((lifeInTheUkCourse.lessons ?? []).filter((l) => l.section === options.chapter).map((l) => l.id))
    : null;
  const exclude = new Set(options.exclude ?? []);
  const favourites = new Set(state.favourites);

  let pool = UK_QUESTIONS.filter((question) => {
    if (exclude.has(question.id)) return false;
    if (options.lesson && question.lesson !== options.lesson) return false;
    if (chapterLessons && !chapterLessons.has(question.lesson)) return false;
    if (options.levels && options.levels.length > 0 && !options.levels.includes(question.level)) return false;
    if (options.favouritesOnly && !favourites.has(question.id)) return false;
    if (options.mistakesOnly && ukStatFor(state, question.id).wrong <= 0) return false;
    return true;
  });

  // Excluding yesterday's questions must never leave someone with nothing to
  // do. If the filter emptied the pool, drop the exclusion rather than the quiz.
  if (pool.length === 0 && exclude.size > 0) {
    pool = ukPickQuestions({ ...options, exclude: [] }, state, now);
  }

  const count = Math.min(options.count ?? 10, pool.length);
  return weightedSample(pool, count, state, now);
}

/**
 * The review queue, in the priority the learner asked for:
 * often wrong, then recently wrong, then weak categories, then longest unseen.
 */
export function ukReviewQueue(state: UkQuizState, count = 15, now: number = Date.now()): UkQuestion[] {
  const weak = new Set(
    ukCategoryStrength(state)
      .filter((row) => row.answered >= 3 && row.percent < 70)
      .map((row) => row.id)
  );
  const scored = UK_QUESTIONS.map((question) => {
    const stat = ukStatFor(state, question.id);
    let score = 0;
    // 1. often wrong
    score += stat.wrong * 1000;
    // 2. recently wrong
    if (stat.lastWrong > 0) {
      const days = (now - stat.lastWrong) / 86_400_000;
      score += Math.max(0, 500 - days * 10);
    }
    // 3. from a weak category
    if (weak.has(question.lesson)) score += 200;
    // 4. longest since last seen
    const daysSinceSeen = stat.lastSeen === 0 ? 60 : (now - stat.lastSeen) / 86_400_000;
    score += Math.min(daysSinceSeen, 60);
    return { question, score };
  })
    .filter((row) => row.score > 60) // untouched-and-never-wrong questions are not "review"
    .sort((a, b) => b.score - a.score);

  const queue = scored.slice(0, count).map((row) => row.question);
  // A learner with a clean record still deserves a review session.
  if (queue.length === 0) return ukPickQuestions({ count }, state, now);
  return queue;
}

// ── Analysis ──────────────────────────────────────────────────────────────

export type UkCategoryStrength = {
  id: string;
  title: string;
  chapter: string;
  /** Questions in this category that have been answered at least once. */
  seen: number;
  total: number;
  correct: number;
  wrong: number;
  /** Total answers given in this category. */
  answered: number;
  /** Correct as a percentage of answered; 0 when nothing has been answered. */
  percent: number;
};

export function ukCategoryStrength(state: UkQuizState): UkCategoryStrength[] {
  return ukCategories().map((category) => {
    const questions = ukQuestionsForLesson(category.id);
    let correct = 0;
    let wrong = 0;
    let seen = 0;
    for (const question of questions) {
      const stat = ukStatFor(state, question.id);
      correct += stat.correct;
      wrong += stat.wrong;
      if (stat.lastSeen > 0) seen += 1;
    }
    const answered = correct + wrong;
    return {
      id: category.id,
      title: category.title,
      chapter: category.chapter,
      seen,
      total: questions.length,
      correct,
      wrong,
      answered,
      percent: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    };
  });
}

/** The categories worth revising, weakest first. Only ones with real evidence. */
export function ukWeakCategories(state: UkQuizState, threshold = 75): UkCategoryStrength[] {
  return ukCategoryStrength(state)
    .filter((row) => row.answered >= 3 && row.percent < threshold)
    .sort((a, b) => a.percent - b.percent);
}

export type UkProgressSummary = {
  /** Percentage of the whole bank answered correctly at least once. */
  overallPercent: number;
  questionsSeen: number;
  questionsTotal: number;
  questionsMastered: number;
  totalCorrect: number;
  totalWrong: number;
  totalAnswered: number;
  successRate: number;
  lessonsDone: number;
  lessonsTotal: number;
  categoriesComplete: number;
  categoriesTotal: number;
  testsTaken: number;
  bestTestPercent: number;
  averageTestPercent: number;
  mistakeCount: number;
  favouriteCount: number;
  streak: number;
  dailyGoal: number;
};

export function ukProgressSummary(
  state: UkQuizState,
  profile: UserProfile | null = getAuthUser()
): UkProgressSummary {
  let seen = 0;
  let mastered = 0;
  let correct = 0;
  let wrong = 0;
  for (const question of UK_QUESTIONS) {
    const stat = ukStatFor(state, question.id);
    correct += stat.correct;
    wrong += stat.wrong;
    if (stat.lastSeen > 0) seen += 1;
    // "Mastered" needs evidence, not one lucky guess.
    if (stat.correct >= 2 && stat.correct > stat.wrong) mastered += 1;
  }
  const answered = correct + wrong;
  const strengths = ukCategoryStrength(state);
  const lessons = lifeInTheUkCourse.lessons ?? [];
  const done = loadCourseProgress(lifeInTheUkCourse.id, profile);
  const percents = state.tests.map((t) => (t.total > 0 ? Math.round((t.score / t.total) * 100) : 0));

  return {
    overallPercent: UK_QUESTIONS.length > 0 ? Math.round((mastered / UK_QUESTIONS.length) * 100) : 0,
    questionsSeen: seen,
    questionsTotal: UK_QUESTIONS.length,
    questionsMastered: mastered,
    totalCorrect: correct,
    totalWrong: wrong,
    totalAnswered: answered,
    successRate: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    lessonsDone: lessons.filter((lesson) => done.includes(lesson.id)).length,
    lessonsTotal: lessons.length,
    categoriesComplete: strengths.filter((row) => row.total > 0 && row.seen === row.total && row.percent >= 75).length,
    categoriesTotal: strengths.length,
    testsTaken: state.tests.length,
    bestTestPercent: percents.length > 0 ? Math.max(...percents) : 0,
    averageTestPercent: percents.length > 0 ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length) : 0,
    mistakeCount: ukMistakes(state).length,
    favouriteCount: ukFavouriteQuestions(state).length,
    streak: state.streak,
    dailyGoal: state.dailyGoal,
  };
}

// ── Daily quiz ────────────────────────────────────────────────────────────

/**
 * Today's set, generated once and then stable for the rest of the day.
 *
 * Regenerating on every render would mean the questions changed underneath
 * someone who left the page and came back, and the "answered" record would
 * stop lining up with the set it belongs to.
 */
export function ukEnsureDaily(
  state: UkQuizState,
  profile: UserProfile | null = getAuthUser(),
  now: Date = new Date()
): UkQuizState {
  const today = ukToday(now);
  if (state.daily.day === today && state.daily.ids.length > 0) return state;

  const picked = ukPickQuestions(
    { count: UK_DAILY_SIZE, exclude: state.daily.ids },
    state,
    now.getTime()
  );
  const next: UkQuizState = {
    ...state,
    daily: {
      day: today,
      ids: picked.map((question) => question.id),
      answered: {},
      previousIds: state.daily.ids,
    },
  };
  saveUkQuiz(next, profile);
  return next;
}

export function ukRecordDailyAnswer(
  questionId: string,
  chosenIndex: number,
  correct: boolean,
  profile: UserProfile | null = getAuthUser(),
  state: UkQuizState = loadUkQuiz(profile),
  now: Date = new Date()
): UkQuizState {
  const afterAnswer = recordUkAnswer(questionId, chosenIndex, correct, profile, state);
  const daily: UkDailyState = {
    ...afterAnswer.daily,
    answered: { ...afterAnswer.daily.answered, [questionId]: correct },
  };
  let streak = afterAnswer.streak;
  let streakDay = afterAnswer.streakDay;

  const finished = daily.ids.length > 0 && daily.ids.every((id) => id in daily.answered);
  const today = ukToday(now);
  if (finished && streakDay !== today) {
    const yesterday = ukToday(new Date(now.getTime() - 86_400_000));
    streak = streakDay === yesterday ? streak + 1 : 1;
    streakDay = today;
  }

  const next: UkQuizState = { ...afterAnswer, daily, streak, streakDay };
  saveUkQuiz(next, profile);
  return next;
}

export function ukDailyQuestions(state: UkQuizState): UkQuestion[] {
  return state.daily.ids.map(ukQuestionById).filter((q): q is UkQuestion => Boolean(q));
}

export function ukDailyComplete(state: UkQuizState): boolean {
  return state.daily.ids.length > 0 && state.daily.ids.every((id) => id in state.daily.answered);
}

export function ukSetDailyGoal(
  goal: number,
  profile: UserProfile | null = getAuthUser(),
  state: UkQuizState = loadUkQuiz(profile)
): UkQuizState {
  const next: UkQuizState = { ...state, dailyGoal: Math.max(1, Math.min(50, Math.round(goal))) };
  saveUkQuiz(next, profile);
  return next;
}
