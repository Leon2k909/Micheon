import { loadScopedJson, saveScopedJson, getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { loadCourseProgress } from "@/lib/courses";
import type { CountryLevel, CountryPack, CountryQuestion } from "@/lib/countryStudies";
import { packCategories } from "@/lib/countryPacks";

/**
 * What a learner has done with one country's question bank.
 *
 * Same engine as ukQuizProgress, with the country passed in rather than
 * imported. Everything that file decides — how heavily a wrong answer is
 * weighted, when a question counts as mastered, how the streak rolls over —
 * is reproduced here exactly, because Michelle asked for Germany to work by
 * the same logic and not by a second set of rules invented for it.
 *
 * ukQuizProgress is left alone. Pointing it at this file would have been the
 * tidier end state, but it is the busiest file in the feature and Leon is in
 * it; a rewrite of it to add a country he is not working on would collide for
 * no gain the learner can see. When his work lands, its exports can become
 * thin calls to countryProgress(UK_PACK) with no change to any caller.
 *
 * Storage is per country — DE_PACK.storeKey is "de-quiz-v1" — so a wrong
 * answer about the Bundesrat never turns up in the UK mistake list, and
 * neither streak resets the other.
 *
 * Days are LOCAL, not UTC: a daily quiz that rolls over at 1am because the
 * user is in CEST is a bug the user experiences as the app forgetting a streak.
 */

export type CountryAnswerStat = {
  correct: number;
  wrong: number;
  lastSeen: number;
  lastWrong: number;
  /** The option index chosen the last time it was got WRONG, for "Meine Fehler". */
  lastWrongChoice: number;
};

export type CountryTestResult = {
  at: number;
  score: number;
  total: number;
  scope: string;
  mode?: string;
  percent?: number;
  passed?: boolean;
  passMark?: number;
  elapsedMs?: number;
  answers?: { questionId: string; chosen: number | null; correct: boolean }[];
};

export type CountryDailyState = {
  day: string;
  ids: string[];
  answered: Record<string, boolean>;
  previousIds: string[];
};

export type CountryQuizState = {
  stats: Record<string, CountryAnswerStat>;
  favourites: string[];
  tests: CountryTestResult[];
  daily: CountryDailyState;
  streak: number;
  streakDay: string;
  dailyGoal: number;
};

export const COUNTRY_DAILY_SIZE = 10;

export type CountryMistake = {
  question: CountryQuestion;
  yourAnswer: number;
  wrongCount: number;
  lastWrong: number;
};

export type CountryPickOptions = {
  lesson?: string;
  chapter?: string;
  levels?: CountryLevel[];
  count?: number;
  mistakesOnly?: boolean;
  favouritesOnly?: boolean;
  exclude?: string[];
};

export type CountryCategoryStrength = {
  id: string;
  title: string;
  chapter: string;
  seen: number;
  total: number;
  correct: number;
  wrong: number;
  answered: number;
  percent: number;
};

export type CountryProgressSummary = {
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

function emptyState(): CountryQuizState {
  return {
    stats: {},
    favourites: [],
    tests: [],
    daily: { day: "", ids: [], answered: {}, previousIds: [] },
    streak: 0,
    streakDay: "",
    dailyGoal: COUNTRY_DAILY_SIZE,
  };
}

/** Local calendar day, not UTC. See the note at the top of the file. */
export function countryToday(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalise(raw: unknown): CountryQuizState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const value = raw as Partial<CountryQuizState>;
  const stats: Record<string, CountryAnswerStat> = {};
  if (value.stats && typeof value.stats === "object") {
    for (const [id, entry] of Object.entries(value.stats)) {
      if (!entry || typeof entry !== "object") continue;
      const stat = entry as Partial<CountryAnswerStat>;
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
      ? value.tests.filter((t): t is CountryTestResult => Boolean(t) && typeof t === "object").slice(-200)
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
    dailyGoal: Number(value.dailyGoal) || COUNTRY_DAILY_SIZE,
  };
}

/**
 * How badly this question needs to be asked again.
 *
 * Higher wins. Getting something wrong raises it a lot and recently wrong
 * raises it further; every correct answer lowers it, with diminishing effect
 * so a question is never buried permanently; anything untouched or long unseen
 * drifts back up so the pool keeps circulating rather than narrowing to a
 * favourite few. The numbers match ukQuestionWeight exactly.
 */
export function countryQuestionWeight(stat: CountryAnswerStat, now: number = Date.now()): number {
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
    weight += 8; // nie gestellt — einmal zeigen lohnt sich
  } else {
    const daysSinceSeen = (now - stat.lastSeen) / 86_400_000;
    weight += Math.min(daysSinceSeen, 30) * 0.6;
  }
  return Math.max(1, weight);
}

const emptyStat = (): CountryAnswerStat =>
  ({ correct: 0, wrong: 0, lastSeen: 0, lastWrong: 0, lastWrongChoice: -1 });

/**
 * The progress engine for one country.
 *
 * A factory rather than a module of free functions, so the country is bound
 * once at the call site and every method below is spared a parameter that
 * would be the same on every call.
 */
export function countryProgress(pack: CountryPack) {
  const questionById = (id: string): CountryQuestion | undefined =>
    pack.questions.find((question) => question.id === id);

  const questionsForLesson = (lessonId: string): CountryQuestion[] =>
    pack.questions.filter((question) => question.lesson === lessonId);

  function load(profile: UserProfile | null = getAuthUser()): CountryQuizState {
    return normalise(loadScopedJson<unknown>(pack.storeKey, null, profile));
  }

  function save(state: CountryQuizState, profile: UserProfile | null = getAuthUser()) {
    saveScopedJson(pack.storeKey, state, profile);
  }

  function statFor(state: CountryQuizState, id: string): CountryAnswerStat {
    return state.stats[id] ?? emptyStat();
  }

  function recordAnswer(
    questionId: string,
    chosenIndex: number,
    correct: boolean,
    profile: UserProfile | null = getAuthUser(),
    state: CountryQuizState = load(profile)
  ): CountryQuizState {
    const now = Date.now();
    const previous = statFor(state, questionId);
    const next: CountryQuizState = {
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
    save(next, profile);
    return next;
  }

  function toggleFavourite(
    questionId: string,
    profile: UserProfile | null = getAuthUser(),
    state: CountryQuizState = load(profile)
  ): CountryQuizState {
    const has = state.favourites.includes(questionId);
    const next: CountryQuizState = {
      ...state,
      favourites: has
        ? state.favourites.filter((id) => id !== questionId)
        : [...state.favourites, questionId],
    };
    save(next, profile);
    return next;
  }

  function recordTest(
    result: CountryTestResult,
    profile: UserProfile | null = getAuthUser(),
    state: CountryQuizState = load(profile)
  ): CountryQuizState {
    const next: CountryQuizState = { ...state, tests: [...state.tests, result].slice(-200) };
    save(next, profile);
    return next;
  }

  /** Everything ever answered wrongly, worst and most recent first. */
  function mistakes(state: CountryQuizState): CountryMistake[] {
    const out: CountryMistake[] = [];
    for (const [id, stat] of Object.entries(state.stats)) {
      if (stat.wrong <= 0) continue;
      const question = questionById(id);
      if (!question) continue; // eine aus dem Pool entfernte Frage
      out.push({
        question,
        yourAnswer: stat.lastWrongChoice,
        wrongCount: stat.wrong,
        lastWrong: stat.lastWrong,
      });
    }
    return out.sort((a, b) => (b.wrongCount - a.wrongCount) || (b.lastWrong - a.lastWrong));
  }

  function favouriteQuestions(state: CountryQuizState): CountryQuestion[] {
    return state.favourites.map(questionById).filter((q): q is CountryQuestion => Boolean(q));
  }

  function weightedSample(
    pool: CountryQuestion[],
    count: number,
    state: CountryQuizState,
    now: number
  ): CountryQuestion[] {
    const remaining = [...pool];
    const picked: CountryQuestion[] = [];
    while (picked.length < count && remaining.length > 0) {
      const weights = remaining.map((q) => countryQuestionWeight(statFor(state, q.id), now));
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

  function pickQuestions(
    options: CountryPickOptions,
    state: CountryQuizState,
    now: number = Date.now()
  ): CountryQuestion[] {
    const chapterLessons = options.chapter
      ? new Set(
          (pack.course.lessons ?? [])
            .filter((l) => l.section === options.chapter)
            .map((l) => l.id)
        )
      : null;
    const exclude = new Set(options.exclude ?? []);
    const favourites = new Set(state.favourites);

    let pool = pack.questions.filter((question) => {
      if (exclude.has(question.id)) return false;
      if (options.lesson && question.lesson !== options.lesson) return false;
      if (chapterLessons && !chapterLessons.has(question.lesson)) return false;
      if (options.levels && options.levels.length > 0 && !options.levels.includes(question.level)) return false;
      if (options.favouritesOnly && !favourites.has(question.id)) return false;
      if (options.mistakesOnly && statFor(state, question.id).wrong <= 0) return false;
      return true;
    });

    // Das Auslassen der gestrigen Fragen darf nie dazu führen, dass gar nichts
    // übrig bleibt. Lieber die Ausnahme fallen lassen als das Quiz.
    if (pool.length === 0 && exclude.size > 0) {
      pool = pickQuestions({ ...options, exclude: [] }, state, now);
    }

    const count = Math.min(options.count ?? 10, pool.length);
    return weightedSample(pool, count, state, now);
  }

  function categoryStrength(state: CountryQuizState): CountryCategoryStrength[] {
    return packCategories(pack).map((category) => {
      const questions = questionsForLesson(category.id);
      let correct = 0;
      let wrong = 0;
      let seen = 0;
      for (const question of questions) {
        const stat = statFor(state, question.id);
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

  /** Die Bereiche, die eine Wiederholung verdienen — schwächster zuerst. */
  function weakCategories(state: CountryQuizState, threshold = 75): CountryCategoryStrength[] {
    return categoryStrength(state)
      .filter((row) => row.answered >= 3 && row.percent < threshold)
      .sort((a, b) => a.percent - b.percent);
  }

  /**
   * Die Wiederholungsliste, in der verlangten Reihenfolge: oft falsch, dann
   * zuletzt falsch, dann schwache Bereiche, dann am längsten nicht gesehen.
   */
  function reviewQueue(
    state: CountryQuizState,
    count = 15,
    now: number = Date.now()
  ): CountryQuestion[] {
    const weak = new Set(
      categoryStrength(state)
        .filter((row) => row.answered >= 3 && row.percent < 70)
        .map((row) => row.id)
    );
    const scored = pack.questions
      .map((question) => {
        const stat = statFor(state, question.id);
        let score = 0;
        score += stat.wrong * 1000;                                   // 1. oft falsch
        if (stat.lastWrong > 0) {                                     // 2. zuletzt falsch
          const days = (now - stat.lastWrong) / 86_400_000;
          score += Math.max(0, 500 - days * 10);
        }
        if (weak.has(question.lesson)) score += 200;                  // 3. schwacher Bereich
        const daysSinceSeen = stat.lastSeen === 0 ? 60 : (now - stat.lastSeen) / 86_400_000;
        score += Math.min(daysSinceSeen, 60);                         // 4. lange nicht gesehen
        return { question, score };
      })
      .filter((row) => row.score > 60) // nie berührt und nie falsch ist keine "Wiederholung"
      .sort((a, b) => b.score - a.score);

    const queue = scored.slice(0, count).map((row) => row.question);
    // Auch wer nichts falsch gemacht hat, darf wiederholen.
    if (queue.length === 0) return pickQuestions({ count }, state, now);
    return queue;
  }

  function progressSummary(
    state: CountryQuizState,
    profile: UserProfile | null = getAuthUser()
  ): CountryProgressSummary {
    let seen = 0;
    let mastered = 0;
    let correct = 0;
    let wrong = 0;
    for (const question of pack.questions) {
      const stat = statFor(state, question.id);
      correct += stat.correct;
      wrong += stat.wrong;
      if (stat.lastSeen > 0) seen += 1;
      // "Sitzt" braucht einen Beleg, nicht einen glücklichen Treffer.
      if (stat.correct >= 2 && stat.correct > stat.wrong) mastered += 1;
    }
    const answered = correct + wrong;
    const strengths = categoryStrength(state);
    const lessons = pack.course.lessons ?? [];
    const done = loadCourseProgress(pack.course.id, profile);
    const percents = state.tests.map((t) => (t.total > 0 ? Math.round((t.score / t.total) * 100) : 0));

    return {
      overallPercent: pack.questions.length > 0 ? Math.round((mastered / pack.questions.length) * 100) : 0,
      questionsSeen: seen,
      questionsTotal: pack.questions.length,
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
      mistakeCount: mistakes(state).length,
      favouriteCount: favouriteQuestions(state).length,
      streak: state.streak,
      dailyGoal: state.dailyGoal,
    };
  }

  /**
   * Das heutige Set — einmal erzeugt und dann für den Rest des Tages stabil.
   *
   * Bei jedem Rendern neu zu würfeln hieße, dass sich die Fragen unter jemandem
   * ändern, der die Seite verlassen und wieder geöffnet hat.
   */
  function ensureDaily(
    state: CountryQuizState,
    profile: UserProfile | null = getAuthUser(),
    now: Date = new Date()
  ): CountryQuizState {
    const today = countryToday(now);
    if (state.daily.day === today && state.daily.ids.length > 0) return state;

    const picked = pickQuestions(
      { count: COUNTRY_DAILY_SIZE, exclude: state.daily.ids },
      state,
      now.getTime()
    );
    const next: CountryQuizState = {
      ...state,
      daily: {
        day: today,
        ids: picked.map((question) => question.id),
        answered: {},
        previousIds: state.daily.ids,
      },
    };
    save(next, profile);
    return next;
  }

  function recordDailyAnswer(
    questionId: string,
    chosenIndex: number,
    correct: boolean,
    profile: UserProfile | null = getAuthUser(),
    state: CountryQuizState = load(profile),
    now: Date = new Date()
  ): CountryQuizState {
    const afterAnswer = recordAnswer(questionId, chosenIndex, correct, profile, state);
    const daily: CountryDailyState = {
      ...afterAnswer.daily,
      answered: { ...afterAnswer.daily.answered, [questionId]: correct },
    };
    let streak = afterAnswer.streak;
    let streakDay = afterAnswer.streakDay;

    const finished = daily.ids.length > 0 && daily.ids.every((id) => id in daily.answered);
    const today = countryToday(now);
    if (finished && streakDay !== today) {
      const yesterday = countryToday(new Date(now.getTime() - 86_400_000));
      streak = streakDay === yesterday ? streak + 1 : 1;
      streakDay = today;
    }

    const next: CountryQuizState = { ...afterAnswer, daily, streak, streakDay };
    save(next, profile);
    return next;
  }

  function dailyQuestions(state: CountryQuizState): CountryQuestion[] {
    return state.daily.ids.map(questionById).filter((q): q is CountryQuestion => Boolean(q));
  }

  function dailyComplete(state: CountryQuizState): boolean {
    return state.daily.ids.length > 0 && state.daily.ids.every((id) => id in state.daily.answered);
  }

  function setDailyGoal(
    goal: number,
    profile: UserProfile | null = getAuthUser(),
    state: CountryQuizState = load(profile)
  ): CountryQuizState {
    const next: CountryQuizState = { ...state, dailyGoal: Math.max(1, Math.min(50, Math.round(goal))) };
    save(next, profile);
    return next;
  }

  return {
    pack,
    questionById,
    questionsForLesson,
    load,
    save,
    statFor,
    recordAnswer,
    toggleFavourite,
    recordTest,
    mistakes,
    favouriteQuestions,
    pickQuestions,
    categoryStrength,
    weakCategories,
    reviewQueue,
    progressSummary,
    ensureDaily,
    recordDailyAnswer,
    dailyQuestions,
    dailyComplete,
    setDailyGoal,
  };
}

export type CountryProgress = ReturnType<typeof countryProgress>;
