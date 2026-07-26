import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ui } from "@/lib/i18n";
import {
  DEFAULT_TIMINGS,
  getCodexPetTimings,
  setCodexPetTimings,
  type CodexPetTimings,
} from "@/lib/codexPetCoaching";

/**
 * How long the pet's messages stay up, and how long until the next one.
 *
 * These were fixed numbers in the code. "How long does it stay on screen" is
 * either right or maddening, and one person's right is another's maddening.
 */
export function PetTimingEditor({ customCadence }: { customCadence: boolean }) {
  const [timings, setTimings] = useState<CodexPetTimings>(getCodexPetTimings);

  const update = (field: keyof CodexPetTimings, raw: string) => {
    const value = Number(raw);
    const next = { ...timings, [field]: Number.isFinite(value) ? value : timings[field] };
    setTimings(next);
    setCodexPetTimings({ [field]: next[field] });
  };

  const field = (
    key: keyof CodexPetTimings,
    label: string,
    hint: string,
    step = 1
  ) => (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
        {ui(label)}
      </span>
      <div className="mt-1 flex items-center gap-2">
        <input
          className="h-9 w-24 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          // Corrected on save rather than while typing, so clearing the box to
          // retype a number does not fight the clamp mid-keystroke.
          onBlur={() => setTimings(getCodexPetTimings())}
          onChange={(event) => update(key, event.target.value)}
          step={step}
          type="number"
          value={timings[key]}
        />
        <span className="text-[11px] font-semibold text-[var(--text-3)]">{ui(hint)}</span>
      </div>
    </label>
  );

  return (
    <div className="mt-3 rounded-[14px] bg-[var(--surface-2)] p-3">
      <p className="text-xs font-black text-[var(--text-1)]">{ui("Timing")}</p>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {field("messageSeconds", "A remark stays for", "seconds", 0.5)}
        {field("questionSeconds", "A question stays for", "seconds")}
      </div>

      {/* Only meaningful once a frequency is actually set to Custom. */}
      {customCadence && (
        <div className="mt-3 grid gap-3 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
          {field("questionsFirstSeconds", "First question after", "seconds")}
          {field("questionsEverySeconds", "Then a question every", "seconds")}
          {field("tipsFirstSeconds", "First tip after", "seconds")}
          {field("tipsEverySeconds", "Then a tip every", "seconds")}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold text-[var(--text-3)]">
          {customCadence
            ? ui("Set a frequency to Custom to use your own gaps.")
            : ui("Choose Custom above to set your own gaps between messages.")}
        </p>
        <button
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 text-[11px] font-black text-[var(--text-2)] hover:text-[var(--text-1)]"
          onClick={() => {
            setCodexPetTimings(DEFAULT_TIMINGS);
            setTimings(getCodexPetTimings());
          }}
          type="button"
        >
          <RotateCcw className="h-3 w-3" />
          {ui("Back to default")}
        </button>
      </div>
    </div>
  );
}
