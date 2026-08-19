import {
  getAuthUser,
  type UserProfile,
} from "@/lib/profileStorage";
import {
  loadActivitySessions,
  recordActivitySession,
  type ActivitySession,
} from "@/lib/activity";

export const LEARNING_TIME_UPDATED_EVENT = "learning-time-updated";

const STATS_VERSION = 1;
const MAX_SAMPLES = 60;
const MAX_SESSION_MS = 2 * 60 * 60 * 1000;
const MIN_SESSION_MS = 1_000;
const MAX_PROGRESS_PER_LESSON = 250;

export type LearningTimeSample = {
  completedAt: number;
  activeMs: number;
  progressBefore: number;
  progressAfter: number;
  progressGained: number;
  lessonId?: string;
};

export type LearningTimeStats = {
  version: 1;
  totalActiveMs: number;
  completedLessons: number;
  totalProgressGained: number;
  samples: LearningTimeSample[];
};

export type CompletedLearningSession = {
  activeMs: number;
  progressBefore: number;
  progressAfter: number;
  completedAt?: number;
  lessonId?: string;
  sentences?: number;
  dialogues?: number;
};

export type FluencyTimeEstimate = {
  /** Rounded up deliberately: this is a planning estimate, not a countdown. */
  hoursRemaining: number;
  unitsPerHour: number;
  observedUnitsPerHour: number | null;
  timedHours: number;
  sampleCount: number;
  progressUnitsObserved: number;
  confidence: "baseline" | "developing" | "personalized";
};

export type FluencyEstimateOptions = {
  /** Conservative starting pace while the learner builds their own history. */
  baselineUnitsPerHour?: number;
  minUnitsPerHour?: number;
  maxUnitsPerHour?: number;
  /** Prior weight prevents one unusually quick lesson distorting the result. */
  priorHours?: number;
  /**
   * Items the learner already knows. Raises the starting pace, because
   * someone who already knows a lot of German demonstrably acquires the
   * rest faster than a beginner — and tracker declarations, which is how
   * much of that knowledge is recorded, leave no timing samples behind.
   */
  knownUnits?: number;
};

function finiteNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function nonNegative(value: unknown, fallback = 0) {
  return Math.max(0, finiteNumber(value, fallback));
}

function boundedInteger(value: unknown, max = Number.MAX_SAFE_INTEGER) {
  return Math.min(max, Math.floor(nonNegative(value)));
}

function emptyStats(): LearningTimeStats {
  return {
    version: STATS_VERSION,
    totalActiveMs: 0,
    completedLessons: 0,
    totalProgressGained: 0,
    samples: [],
  };
}

function normalizeSample(value: unknown): LearningTimeSample | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<LearningTimeSample>;
  const activeMs = Math.min(MAX_SESSION_MS, boundedInteger(raw.activeMs, MAX_SESSION_MS));
  if (activeMs < MIN_SESSION_MS) return null;

  const progressBefore = boundedInteger(raw.progressBefore);
  const progressAfter = boundedInteger(raw.progressAfter);
  const calculatedGain = Math.max(0, progressAfter - progressBefore);
  const progressGained = Math.min(
    MAX_PROGRESS_PER_LESSON,
    boundedInteger(raw.progressGained, MAX_PROGRESS_PER_LESSON) || calculatedGain
  );
  const completedAt = boundedInteger(raw.completedAt) || Date.now();
  const lessonId = typeof raw.lessonId === "string"
    ? raw.lessonId.trim().slice(0, 160) || undefined
    : undefined;

  return {
    completedAt,
    activeMs,
    progressBefore,
    progressAfter,
    progressGained,
    ...(lessonId ? { lessonId } : {}),
  };
}

/** Accepts old, partial, or manually-corrupted storage without leaking NaN. */
export function normalizeLearningTimeStats(value: unknown): LearningTimeStats {
  if (!value || typeof value !== "object" || Array.isArray(value)) return emptyStats();
  const raw = value as Partial<LearningTimeStats>;
  const samples = (Array.isArray(raw.samples) ? raw.samples : [])
    .map(normalizeSample)
    .filter((sample): sample is LearningTimeSample => Boolean(sample))
    .slice(-MAX_SAMPLES);
  const sampledActiveMs = samples.reduce((sum, sample) => sum + sample.activeMs, 0);
  const sampledProgress = samples.reduce((sum, sample) => sum + sample.progressGained, 0);

  return {
    version: STATS_VERSION,
    // Lifetime totals can exceed the capped rolling sample window.
    totalActiveMs: Math.max(sampledActiveMs, boundedInteger(raw.totalActiveMs)),
    completedLessons: Math.max(samples.length, boundedInteger(raw.completedLessons)),
    totalProgressGained: Math.max(sampledProgress, boundedInteger(raw.totalProgressGained)),
    samples,
  };
}

export function loadLearningTimeStats(
  profile: UserProfile | null = getAuthUser()
): LearningTimeStats {
  const samples = loadActivitySessions(profile)
    // This marker is important: old ActivitySession records contain raw wall
    // time and must never quietly pollute the active-study pace calculation.
    .filter((session) => session?.activeTimed === true && session.timingVersion === STATS_VERSION)
    .map((session) => normalizeSample({
      activeMs: nonNegative(session.durationSec) * 1_000,
      progressBefore: session.progressBefore,
      progressAfter: session.progressAfter,
      progressGained: session.progressGained,
      completedAt: session.ts,
      lessonId: session.lessonId,
    }))
    .filter((sample): sample is LearningTimeSample => Boolean(sample));

  const totalActiveMs = samples.reduce((sum, sample) => sum + sample.activeMs, 0);
  const totalProgressGained = samples.reduce((sum, sample) => sum + sample.progressGained, 0);
  return {
    version: STATS_VERSION,
    totalActiveMs,
    completedLessons: samples.length,
    totalProgressGained,
    samples: samples.slice(-MAX_SAMPLES),
  };
}

/**
 * Persist one *completed* lesson. Callers should pass ActiveStudyTimer.stop(),
 * plus the known-item count captured before and after completion.
 */
export function recordCompletedLearningSession(
  entry: CompletedLearningSession,
  profile: UserProfile | null = getAuthUser()
): LearningTimeStats {
  const current = loadLearningTimeStats(profile);
  const sample = normalizeSample({
    ...entry,
    progressGained: Math.max(
      0,
      boundedInteger(entry.progressAfter) - boundedInteger(entry.progressBefore)
    ),
    completedAt: entry.completedAt ?? Date.now(),
  });
  if (!sample) return current;

  try {
    const activity: ActivitySession = {
      ts: sample.completedAt,
      durationSec: sample.activeMs / 1_000,
      sentences: boundedInteger(entry.sentences),
      dialogues: boundedInteger(entry.dialogues),
      activeTimed: true,
      timingVersion: STATS_VERSION,
      progressBefore: sample.progressBefore,
      progressAfter: sample.progressAfter,
      progressGained: sample.progressGained,
      ...(sample.lessonId ? { lessonId: sample.lessonId } : {}),
    };
    recordActivitySession(activity, profile);
    const next = loadLearningTimeStats(profile);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(LEARNING_TIME_UPDATED_EVENT, { detail: next }));
    }
    return next;
  } catch {
    // Lesson completion must remain usable in privacy mode/full storage. The
    // caller still receives the in-memory aggregate for its immediate render.
    return {
      version: STATS_VERSION,
      totalActiveMs: current.totalActiveMs + sample.activeMs,
      completedLessons: current.completedLessons + 1,
      totalProgressGained: current.totalProgressGained + sample.progressGained,
      samples: [...current.samples, sample].slice(-MAX_SAMPLES),
    };
  }
}

function roundPlanningHours(hours: number) {
  if (hours <= 10) return Math.ceil(hours * 2) / 2;
  if (hours <= 100) return Math.ceil(hours / 5) * 5;
  return Math.ceil(hours / 10) * 10;
}

/**
 * Estimate remaining *active study* hours from the learner's recent completed
 * lessons. A two-hour baseline prior and bounded rate keep the number honest
 * when history is sparse or one lesson happens to be unusually quick.
 */
export function estimateFluencyHours(
  remainingUnits: number,
  statsValue: LearningTimeStats | unknown,
  options: FluencyEstimateOptions = {}
): FluencyTimeEstimate {
  const stats = normalizeLearningTimeStats(statsValue);
  const remaining = boundedInteger(remainingUnits);
  // What the learner already knows is evidence about how fast they learn.
  //
  // Michelle has marked a large part of the tracker as known and was still
  // quoted 210 hours, because knowing things produces no TIMED lesson
  // samples — declarations are instant — so her pace stayed pinned to the
  // absolute-beginner prior of 12 items an hour. That prior is right for
  // someone meeting German cold and wrong for someone who already reads
  // most of a sentence: their remaining items are largely confirmations,
  // not first encounters.
  //
  // So the prior itself scales with demonstrated knowledge. The slope is
  // calibrated, not invented: at Leon's ~2,300 known it predicts ~25 items
  // an hour, which is what his timed lessons actually measure. It stays a
  // PRIOR — real timing history still outweighs it as samples accumulate.
  const knowledgeBoost = Math.min(28, Math.max(0, finiteNumber(options.knownUnits, 0)) / 180);
  const baseline = Math.max(0.1, finiteNumber(options.baselineUnitsPerHour, 12) + knowledgeBoost);
  const minRate = Math.max(0.1, finiteNumber(options.minUnitsPerHour, 4));
  // The ceiling was 24/hour and Leon's real pace sat pinned against it, so
  // "About 330 hours" was the CAP talking, not his history. A learner who
  // moves fast — Kann-ich declarations, words banked six a sitting, Listen
  // pre-exposure making lessons quicker — earns the number their pace
  // implies; the two-hour baseline prior in the blend still keeps one
  // freak-fast lesson from swinging the estimate.
  const maxRate = Math.max(minRate, finiteNumber(options.maxUnitsPerHour, 60));
  const priorHours = Math.max(0.25, finiteNumber(options.priorHours, 2));

  const activeMs = stats.samples.reduce((sum, sample) => sum + sample.activeMs, 0);
  const progress = stats.samples.reduce((sum, sample) => sum + sample.progressGained, 0);
  const timedHours = activeMs / 3_600_000;
  const observedUnitsPerHour = timedHours > 0 ? progress / timedHours : null;
  const blendedRate = timedHours > 0
    ? (progress + baseline * priorHours) / (timedHours + priorHours)
    : baseline;
  const unitsPerHour = Math.max(minRate, Math.min(maxRate, blendedRate));
  const confidence = stats.samples.length === 0
    ? "baseline"
    : stats.samples.length >= 3 && timedHours >= 0.5
      ? "personalized"
      : "developing";

  return {
    hoursRemaining: remaining === 0 ? 0 : roundPlanningHours(remaining / unitsPerHour),
    unitsPerHour,
    observedUnitsPerHour,
    timedHours,
    sampleCount: stats.samples.length,
    progressUnitsObserved: progress,
    confidence,
  };
}

type TimerHandle = ReturnType<typeof globalThis.setTimeout>;

export type ActiveStudyTimerEnvironment = {
  now?: () => number;
  windowTarget?: EventTarget | null;
  documentTarget?: Document | null;
  setTimeoutFn?: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimeoutFn?: (handle: TimerHandle) => void;
};

export type ActiveStudyTimerOptions = ActiveStudyTimerEnvironment & {
  idleAfterMs?: number;
};

/**
 * Low-overhead lesson clock. It uses one idle timeout and interaction events —
 * never a polling interval — and excludes hidden, blurred, and idle periods.
 */
export class ActiveStudyTimer {
  private readonly now: () => number;
  private readonly windowTarget: EventTarget | null;
  private readonly documentTarget: Document | null;
  private readonly setTimeoutFn: (callback: () => void, delayMs: number) => TimerHandle;
  private readonly clearTimeoutFn: (handle: TimerHandle) => void;
  private readonly idleAfterMs: number;
  private running = false;
  private listening = false;
  private accumulatedMs = 0;
  private segmentStartedAt: number | null = null;
  private lastActivityAt = 0;
  private idleHandle: TimerHandle | null = null;

  constructor(options: ActiveStudyTimerOptions = {}) {
    this.now = options.now ?? (() => Date.now());
    this.windowTarget = options.windowTarget
      ?? (typeof window !== "undefined" ? window : null);
    this.documentTarget = options.documentTarget
      ?? (typeof document !== "undefined" ? document : null);
    this.setTimeoutFn = options.setTimeoutFn ?? ((callback, delayMs) => globalThis.setTimeout(callback, delayMs));
    this.clearTimeoutFn = options.clearTimeoutFn ?? ((handle) => globalThis.clearTimeout(handle));
    this.idleAfterMs = Math.max(5_000, finiteNumber(options.idleAfterMs, 120_000));
  }

  private isEnvironmentActive() {
    if (this.documentTarget?.visibilityState === "hidden") return false;
    try {
      if (this.documentTarget?.hasFocus && !this.documentTarget.hasFocus()) return false;
    } catch {
      // Some embedded webviews do not implement hasFocus reliably. Visibility
      // and blur events still protect the timer in that environment.
    }
    return true;
  }

  private clearIdleTimeout() {
    if (this.idleHandle === null) return;
    this.clearTimeoutFn(this.idleHandle);
    this.idleHandle = null;
  }

  private closeSegment(at: number) {
    if (this.segmentStartedAt === null) return;
    const idleDeadline = this.lastActivityAt + this.idleAfterMs;
    const end = Math.max(this.segmentStartedAt, Math.min(at, idleDeadline));
    this.accumulatedMs += end - this.segmentStartedAt;
    this.segmentStartedAt = null;
  }

  private scheduleIdleTimeout() {
    this.clearIdleTimeout();
    if (!this.running || this.segmentStartedAt === null) return;
    const deadline = this.lastActivityAt + this.idleAfterMs;
    const delay = Math.max(0, deadline - this.now());
    this.idleHandle = this.setTimeoutFn(() => {
      this.idleHandle = null;
      if (!this.running) return;
      this.closeSegment(deadline);
    }, delay);
  }

  private pauseForEnvironment = () => {
    if (!this.running) return;
    this.closeSegment(this.now());
    this.clearIdleTimeout();
  };

  private resumeForEnvironment = () => {
    if (!this.running || !this.isEnvironmentActive()) return;
    const at = this.now();
    this.lastActivityAt = at;
    if (this.segmentStartedAt === null) this.segmentStartedAt = at;
    this.scheduleIdleTimeout();
  };

  private onVisibilityChange = () => {
    if (this.documentTarget?.visibilityState === "hidden") this.pauseForEnvironment();
    else this.resumeForEnvironment();
  };

  private onActivity = () => {
    if (!this.running || !this.isEnvironmentActive()) return;
    const at = this.now();
    // Activity after the idle deadline starts a fresh segment; the idle gap is
    // never back-filled just because the learner returned.
    this.closeSegment(Math.min(at, this.lastActivityAt + this.idleAfterMs));
    if (this.segmentStartedAt === null) this.segmentStartedAt = at;
    this.lastActivityAt = at;
    this.scheduleIdleTimeout();
  };

  private attachListeners() {
    if (this.listening) return;
    this.listening = true;
    this.windowTarget?.addEventListener("blur", this.pauseForEnvironment);
    this.windowTarget?.addEventListener("focus", this.resumeForEnvironment);
    for (const type of ["pointerdown", "keydown", "touchstart", "wheel", "input"]) {
      this.windowTarget?.addEventListener(type, this.onActivity);
    }
    this.documentTarget?.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  private detachListeners() {
    if (!this.listening) return;
    this.listening = false;
    this.windowTarget?.removeEventListener("blur", this.pauseForEnvironment);
    this.windowTarget?.removeEventListener("focus", this.resumeForEnvironment);
    for (const type of ["pointerdown", "keydown", "touchstart", "wheel", "input"]) {
      this.windowTarget?.removeEventListener(type, this.onActivity);
    }
    this.documentTarget?.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  start() {
    if (this.running) return this;
    this.running = true;
    this.attachListeners();
    if (this.isEnvironmentActive()) {
      const at = this.now();
      this.lastActivityAt = at;
      this.segmentStartedAt = at;
      this.scheduleIdleTimeout();
    }
    return this;
  }

  /** Count a meaningful app interaction when integration has its own event. */
  markActivity() {
    this.onActivity();
  }

  getActiveMs() {
    if (!this.running || this.segmentStartedAt === null) return Math.round(this.accumulatedMs);
    const at = this.now();
    const liveEnd = Math.max(
      this.segmentStartedAt,
      Math.min(at, this.lastActivityAt + this.idleAfterMs)
    );
    return Math.round(this.accumulatedMs + liveEnd - this.segmentStartedAt);
  }

  stop() {
    if (this.running) this.closeSegment(this.now());
    this.running = false;
    this.clearIdleTimeout();
    this.detachListeners();
    return Math.round(this.accumulatedMs);
  }

  dispose() {
    return this.stop();
  }
}
