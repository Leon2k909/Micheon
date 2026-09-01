import { loadScopedJson, saveScopedJson, getAuthUser, type UserProfile } from "@/lib/profileStorage";

import {
  ukCategories,
  ukQuestionById,
  ukQuestionsForLesson,
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

type UkAnswerStat = {
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

type UkTestResult = {
  at: number;
  score: number;
  total: number;
  /** Lesson id, chapter name, or a mode name like "daily" / "review". */
  scope: string;
  // ── Added for the exam simulation, and optional on purpose ──────────────
  // Every existing caller writes {at, score, total, scope} and keeps working;
  // results already saved before this existed still load. The history list
  // falls back to score/total when these are absent, so an old row shows a
  // score without claiming a pass it never recorded.
  /** Which of the seven modes produced this. */
  mode?: string;
  /** Rounded percentage, stored rather than recomputed so history is stable. */
  percent?: number;
  /** Whether this run reached its pass mark. */
  passed?: boolean;
  /** How many right answers this particular test needed. */
  passMark?: number;
  /** Milliseconds spent, for the history row. */
  elapsedMs?: number;
  /** Per-question record, so a finished exam can still be reviewed. */
  answers?: { questionId: string; chosen: number | null; correct: boolean }[];
};

type UkDailyState = {
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

const UK_DAILY_SIZE = 10;

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

function loadUkQuiz(profile: UserProfile | null = getAuthUser()): UkQuizState {
  return normalise(loadScopedJson<unknown>(STORE_KEY, null, profile));
}

function saveUkQuiz(state: UkQuizState, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(STORE_KEY, state, profile);
}

function ukStatFor(state: UkQuizState, id: string): UkAnswerStat {
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

// ── Mistakes ──────────────────────────────────────────────────────────────

type UkMistake = {
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

// ── Analysis ──────────────────────────────────────────────────────────────

type UkCategoryStrength = {
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

// ── Daily quiz ────────────────────────────────────────────────────────────
