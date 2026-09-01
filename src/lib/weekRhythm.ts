import type { ActivitySession } from "@/lib/activity";

/**
 * The current week, Monday to Sunday, read out of the activity log.
 *
 * "This week" used to be a heading over lifetime totals: 221 sessions is every
 * session ever recorded, not this week's. These figures start again each
 * Monday, which is what the heading has always claimed.
 *
 * Monday rather than Sunday because the app speaks German first, and a week
 * that starts on Sunday reads as a week that started yesterday. Local time
 * throughout: the reset should land at midnight where she is, not in UTC.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type WeekDay = {
  /** Local midnight of this day. */
  dayStart: number;
  /** 0 = Monday … 6 = Sunday. */
  index: number;
  sessions: number;
  minutes: number;
  /** The day we are in now. */
  isToday: boolean;
  /** Later this week — drawn as an outline rather than a gap. */
  isFuture: boolean;
};

type WeekRhythm = {
  /** Local midnight of this week's Monday. */
  weekStart: number;
  days: WeekDay[];
  /** Days since Monday with at least one session, 0–7. */
  daysPractised: number;
  /** Sessions since Monday. */
  sessions: number;
  /** Minutes since Monday, rounded. */
  minutes: number;
  /** The busiest day's session count, so bars have something to scale against. */
  busiestDay: number;
};

/** Local midnight on the Monday of the week `now` falls in. */
export function startOfWeek(now: number = Date.now()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  // getDay() is 0 for Sunday; shifting by 6 puts Monday at 0 and Sunday at 6.
  const sinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - sinceMonday);
  // Re-flattening matters: a day crossing a daylight-saving change can come
  // back from setDate at 23:00 the evening before.
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Local midnight on the Monday after the one `now` falls in — when this resets. */
export function nextWeekStart(now: number = Date.now()): number {
  const d = new Date(startOfWeek(now));
  d.setDate(d.getDate() + 7);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function weekRhythm(sessions: ActivitySession[], now: number = Date.now()): WeekRhythm {
  const weekStart = startOfWeek(now);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const days: WeekDay[] = Array.from({ length: 7 }, (_, index) => {
    // Built by calendar date rather than by adding 24h seven times, so the
    // week does not drift an hour when the clocks change mid-week.
    const d = new Date(weekStart);
    d.setDate(d.getDate() + index);
    d.setHours(0, 0, 0, 0);
    const dayStart = d.getTime();
    return {
      dayStart,
      index,
      sessions: 0,
      minutes: 0,
      isToday: dayStart === todayStart.getTime(),
      isFuture: dayStart > todayStart.getTime(),
    };
  });

  const endOfWeek = (() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  for (const session of sessions) {
    const ts = Number(session?.ts);
    if (!Number.isFinite(ts) || ts < weekStart || ts >= endOfWeek) continue;
    // Which bucket, by calendar day rather than by division, for the same
    // daylight-saving reason.
    const at = new Date(ts);
    at.setHours(0, 0, 0, 0);
    const index = days.findIndex((day) => day.dayStart === at.getTime());
    if (index < 0) continue;
    days[index].sessions += 1;
    days[index].minutes += Math.max(0, Number(session?.durationSec) || 0) / 60;
  }

  const sessionTotal = days.reduce((sum, day) => sum + day.sessions, 0);
  return {
    weekStart,
    days: days.map((day) => ({ ...day, minutes: Math.round(day.minutes) })),
    daysPractised: days.filter((day) => day.sessions > 0).length,
    sessions: sessionTotal,
    minutes: Math.round(days.reduce((sum, day) => sum + day.minutes, 0)),
    busiestDay: days.reduce((most, day) => Math.max(most, day.sessions), 0),
  };
}

/** Mon…Sun, as translation keys so each language names its own days. */

const DAY_MS_EXPORT = DAY_MS;
export { DAY_MS_EXPORT as WEEK_DAY_MS };
