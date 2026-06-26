import React, { useMemo } from "react";

// Returns last N days as YYYY-MM-DD strings
function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getIntensity(count) {
  if (!count) return 0;
  if (count < 5) return 1;
  if (count < 15) return 2;
  if (count < 30) return 3;
  return 4;
}

const INTENSITY_CLASSES = [
  "bg-slate-100",
  "bg-violet-200",
  "bg-violet-400",
  "bg-violet-600",
  "bg-violet-800",
];

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["","M","","W","","F",""];

export default function Heatmap({ activityLog }) {
  // activityLog: { "2026-03-01": 12, "2026-03-02": 5, ... }
  const days = useMemo(() => getLastNDays(105), []); // 15 weeks

  // Group into weeks
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  // Month labels — show when month changes
  const monthMarkers = useMemo(() => {
    const markers = {};
    weeks.forEach((week, wi) => {
      const firstDay = week[0];
      const month = new Date(firstDay).getMonth();
      const prevWeekFirst = wi > 0 ? weeks[wi - 1][0] : null;
      const prevMonth = prevWeekFirst ? new Date(prevWeekFirst).getMonth() : -1;
      if (month !== prevMonth) markers[wi] = MONTH_LABELS[month];
    });
    return markers;
  }, [weeks]);

  const totalDays = days.filter(d => activityLog[d] > 0).length;
  const totalActions = Object.values(activityLog).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1 overflow-x-auto pb-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((l, i) => (
            <div key={i} className="h-3 w-4 text-[10px] text-slate-400 leading-3">{l}</div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {/* Month label above */}
            <div className="h-3 text-[10px] text-slate-400 leading-3 whitespace-nowrap">
              {monthMarkers[wi] ?? ""}
            </div>
            {week.map(day => {
              const count = activityLog[day] ?? 0;
              const intensity = getIntensity(count);
              return (
                <div
                  key={day}
                  title={`${day}: ${count} actions`}
                  className={`h-3 w-3 rounded-sm ${INTENSITY_CLASSES[intensity]} transition-colors`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{totalDays} active days · {totalActions} total actions</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {INTENSITY_CLASSES.map((cls, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
