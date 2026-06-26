import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, ChevronDown, Headphones, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadActivitySessions, loadGradeStore, summarizeActivity } from "@/lib/activity";

type ProgressStats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
};

const RANGE_OPTIONS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
];

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ActivityCard({ progressStats, className }: { progressStats: ProgressStats; className?: string }) {
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("activity-updated", onUpdate);
    return () => window.removeEventListener("activity-updated", onUpdate);
  }, []);

  const summary = useMemo(() => {
    const sessions = loadActivitySessions();
    const grades = loadGradeStore();
    return summarizeActivity(sessions, grades, range.days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.days, version]);

  // Show only the most recent 7 buckets in the bar chart for readability.
  const chartBuckets = summary.buckets.slice(-7);
  const maxMinutes = Math.max(1, ...chartBuckets.map((b) => b.minutes));
  const hasData = summary.hours > 0 || summary.itemsCount > 0;

  const hours = summary.hours.toFixed(1);

  // Real per-type breakdown from graded items in range.
  const knownInRange = summary.knownCount;
  const itemsInRange = summary.itemsCount;

  return (
    <section className={cn("card p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Activity</h2>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight text-[var(--text-1)]">{hours}</span>
            <span className="pb-2 text-xs font-bold leading-4 text-[var(--text-3)]">hours<br />spent</span>
          </div>
        </div>

        <div className="relative">
          <button
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text-2)] transition-colors hover:border-[var(--border-2)] hover:bg-[var(--surface-2)]"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <CalendarDays className="h-4 w-4" />
            {range.label}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-20 w-36 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_18px_45px_rgba(32,34,49,0.16)]">
              {RANGE_OPTIONS.map((option) => (
                <button
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors",
                    option.days === range.days
                      ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                      : "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                  )}
                  key={option.days}
                  onClick={() => {
                    setRange(option);
                    setOpen(false);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-7 h-36">
        {hasData ? (
          <>
            <div className="absolute left-0 top-0 rounded-full bg-[var(--ink)] px-2 py-1 text-[10px] font-bold text-[var(--ink-text)]">
              {summary.activeDays} active {summary.activeDays === 1 ? "day" : "days"}
            </div>
            <div className="flex h-full items-end gap-2 pt-6">
              {chartBuckets.map((bucket, index) => {
                const heightPct = bucket.minutes > 0 ? Math.max(8, (bucket.minutes / maxMinutes) * 100) : 4;
                const isToday = index === chartBuckets.length - 1;
                const weekday = WEEKDAY[new Date(bucket.dayStart).getDay()];
                return (
                  <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={bucket.dayStart}>
                    <div
                      className={cn(
                        "w-full rounded-t-xl transition-all",
                        bucket.minutes === 0
                          ? "bg-[var(--surface-3)]"
                          : isToday
                            ? "bg-[var(--accent)]"
                            : "bg-[#cbbbf8] dark:bg-[#4b3a78]"
                      )}
                      style={{ height: `${heightPct}%` }}
                      title={`${weekday}: ${bucket.minutes.toFixed(0)} min, ${bucket.items} items`}
                    />
                    <span className="text-[10px] font-semibold text-[var(--text-3)]">{weekday}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-black text-[var(--text-2)]">No activity yet</p>
            <p className="text-xs font-semibold text-[var(--text-3)]">Finish a lesson to start tracking real time and progress.</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-[20px] bg-[var(--surface-2)] p-4">
        <p className="text-sm font-black text-[var(--text-1)]">This range</p>
        <div className="mt-4 space-y-4">
          {[
            { label: "Lessons completed", value: `${summary.sessionsCount} ${summary.sessionsCount === 1 ? "session" : "sessions"}`, time: `${summary.hours.toFixed(1)} h`, icon: BookOpen },
            { label: "Words marked known", value: `${knownInRange} ${knownInRange === 1 ? "item" : "items"}`, time: `${itemsInRange} graded`, icon: Headphones },
            { label: "Day streak", value: `${progressStats.streak} ${progressStats.streak === 1 ? "day" : "days"}`, time: `${summary.activeDays} active`, icon: MessageCircle },
          ].map((item) => (
            <div className="flex items-center gap-3" key={item.label}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--text-1)]">{item.label}</p>
                <p className="text-[11px] text-[var(--text-3)]">{item.value}</p>
              </div>
              <p className="text-xs font-black text-[var(--text-1)]">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
