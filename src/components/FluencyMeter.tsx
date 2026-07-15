import { getFluency, FLUENCY_STAGES } from "@/lib/fluency";

/**
 * Honest "how far to fluency" meter. `vocab` = distinct items the learner
 * actually knows (see lib/fluency). Shows the current ability stage, the words
 * left to the next stage, and overall progress toward real fluency — never a
 * fake "100%" from a practice counter.
 */
export function FluencyMeter({ vocab, compact }: { vocab: number; compact?: boolean }) {
  const f = getFluency(vocab);

  if (compact) {
    return (
      <div className="rounded-[18px] bg-[var(--surface-2)] p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-black text-[var(--text-1)]">{f.cur.label}</p>
          <p className="text-xs font-black text-[var(--text-3)]">{f.overallPct}% to fluent</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
          <div className="h-full rounded-full" style={{ width: `${Math.max(4, f.overallPct)}%`, background: "var(--feature-gradient)" }} />
        </div>
        <p className="mt-2 text-[11px] font-semibold leading-4 text-[var(--text-3)]">
          {f.next
            ? <><span className="font-black text-[var(--text-2)]">{f.toNext.toLocaleString()}</span> more learned to reach “{f.next.label}”</>
            : "You've reached fluent — keep it sharp."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-[var(--surface-2)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black text-[var(--text-3)]">You're at</p>
          <p className="mt-1 truncate text-lg font-black text-[var(--text-1)]">{f.cur.label}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{f.cur.blurb}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-[var(--surface)] px-3 py-2 text-right shadow-[inset_0_0_0_1px_var(--border)]">
          <p className="text-2xl font-black leading-none text-[var(--text-1)]">{f.overallPct}%</p>
          <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">to fluent</p>
        </div>
      </div>

      {/* Milestone track: a dot per stage, filled up to the current one */}
      <div className="mt-4 flex items-center gap-1.5">
        {FLUENCY_STAGES.map((s, idx) => (
          <div
            key={s.label}
            title={s.label}
            className="h-1.5 flex-1 rounded-full"
            style={idx <= f.index ? { background: "var(--feature-gradient)" } : { background: "var(--surface)" }}
          />
        ))}
      </div>

      <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
        {f.next ? (
          <>
            <span className="font-black text-[var(--text-1)]">{f.toNext.toLocaleString()}</span> more words &amp; phrases
            until <span className="font-black text-[var(--text-2)]">“{f.next.label}”</span> — {f.next.blurb.toLowerCase()}
          </>
        ) : (
          "You've reached fluent — keep it sharp with daily review."
        )}
      </p>
    </div>
  );
}
