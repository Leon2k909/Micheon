import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { getFluency, FLUENCY_STAGES } from "@/lib/fluency";
import { UiText } from "@/components/UiText";
import { ui, uiNumber } from "@/lib/i18n";
import { estimateFluencyHours, loadLearningTimeStats } from "@/lib/learningTime";

function CompactStudyTimeEstimate({ remainingUnits }: { remainingUnits: number }) {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("activity-updated", refresh);
    return () => window.removeEventListener("activity-updated", refresh);
  }, []);

  const estimate = useMemo(
    () => estimateFluencyHours(remainingUnits, loadLearningTimeStats()),
    [remainingUnits, revision]
  );
  const explanation = estimate.confidence === "baseline"
    ? ui("Starting estimate — complete a timed lesson to personalise it.")
    : estimate.confidence === "personalized"
      ? ui("Based on your active lesson pace.")
      : ui("Learning your pace from timed lessons.");

  return (
    <div
      className="mt-1 inline-flex max-w-[220px] items-start justify-end gap-1.5 text-right"
      title={explanation}
    >
      <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-[var(--accent)]" />
      <div>
        <p className="text-[11px] font-black leading-4 text-[var(--text-2)]">
          ≈ {uiNumber(estimate.hoursRemaining)} {ui("study hours left")}
        </p>
        <p className="text-[9px] font-semibold leading-3 text-[var(--text-3)]">{explanation}</p>
      </div>
    </div>
  );
}

/**
 * Honest "how far to fluency" meter. `vocab` = distinct items the learner
 * actually knows (see lib/fluency). Shows the current ability stage, the words
 * left to the next stage, and overall progress toward real fluency — never a
 * fake "100%" from a practice counter.
 */
export function FluencyMeter({
  vocab,
  compact,
  showStudyTimeEstimate = false,
}: {
  vocab: number;
  compact?: boolean;
  showStudyTimeEstimate?: boolean;
}) {
  const f = getFluency(vocab);

  if (compact) {
    return (
      <div className="rounded-[18px] bg-[var(--surface-2)] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-black text-[var(--text-1)]">{ui(f.cur.label)}</p>
          <div className="shrink-0 text-right">
            <p className="text-xs font-black text-[var(--text-3)]">{f.overallPct}% {ui("to fluent")}</p>
            {showStudyTimeEstimate && f.next && <CompactStudyTimeEstimate remainingUnits={f.toFluent} />}
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
          <div className="h-full rounded-full" style={{ width: `${Math.max(4, f.overallPct)}%`, background: "var(--feature-gradient)" }} />
        </div>
        <p className="mt-2 text-[11px] font-semibold leading-4 text-[var(--text-3)]">
          {f.next
            ? <><span className="font-black text-[var(--text-2)]">{uiNumber(f.toFluent)}</span> {ui("more to go until you're fully fluent")}</>
            : ui("You've reached fluent — keep it sharp.")}
        </p>
      </div>
    );
  }

  return (
    // A container query rather than a screen one: how wide this card is has
    // little to do with how wide the window is. Beside a widened sidebar the
    // profile page's two-column row leaves it about 250px, and at that size
    // the stage name was cut to an ellipsis while the sentence under it broke
    // to one word a line. Below 288px the figure drops beneath the text and
    // both get the full width of the card.
    <div className="@container rounded-[24px] bg-[var(--surface-2)] p-4">
      <div className="flex items-start justify-between gap-4 @max-[18rem]:flex-col @max-[18rem]:gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-[var(--text-3)]">{ui("You're at")}</p>
          {/* Wrapping, not truncating. The stage name is the answer the card
              exists to give, and an ellipsis is the one thing it must not do
              to it. */}
          <p className="mt-1 text-lg font-black text-[var(--text-1)]">{ui(f.cur.label)}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{ui(f.cur.blurb)}</p>
        </div>
        <div className="shrink-0 self-start rounded-2xl bg-[var(--surface)] px-3 py-2 text-right shadow-[inset_0_0_0_1px_var(--border)] @max-[18rem]:self-end">
          <p className="text-2xl font-black leading-none text-[var(--text-1)]">{f.overallPct}%</p>
          <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">{ui("to fluent")}</p>
        </div>
      </div>

      {/* Milestone track: a dot per stage, filled up to the current one */}
      <div className="mt-4 flex items-center gap-1.5">
        {FLUENCY_STAGES.map((s, idx) => (
          <div
            key={s.label}
            title={ui(s.label)}
            className="h-1.5 flex-1 rounded-full"
            style={idx <= f.index ? { background: "var(--feature-gradient)" } : { background: "var(--surface)" }}
          />
        ))}
      </div>

      <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
        {f.next ? (
          <>
            <UiText
              text="{count} more words & phrases until you're {fluent} — able to keep up with real natives. Next stage: “{stage}”."
              values={{
                count: <span className="font-black text-[var(--text-1)]">{uiNumber(f.toFluent)}</span>,
                fluent: <span className="font-black text-[var(--text-2)]">{ui("fully fluent")}</span>,
                stage: ui(f.next.label),
              }}
            />
          </>
        ) : (
          ui("You've reached fluent — keep it sharp with daily review.")
        )}
      </p>
    </div>
  );
}
