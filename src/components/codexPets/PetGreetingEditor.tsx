import { useEffect, useState } from "react";
import { MessageSquare, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import {
  DEFAULT_PREFIX_CHANCE,
  MAX_GREETING,
  MAX_GREETING_LINES,
  getPetGreeting,
  petHasBuiltInVoice,
  resetPetGreeting,
  setPetGreeting,
} from "@/lib/petGreetings";

/** Percentages, in words. A pet's mood is not something you tune numerically. */
const CHANCES: { label: string; value: number }[] = [
  { label: "Every message", value: 100 },
  { label: "Most messages", value: 75 },
  { label: "About half", value: 50 },
  { label: "Now and then", value: 25 },
  { label: "Rarely", value: 10 },
  { label: "Never", value: 0 },
];

/** Stored values need not be one of the presets, so show the nearest. */
function nearestChance(value: number): number {
  return CHANCES.reduce((best, option) =>
    Math.abs(option.value - value) < Math.abs(best - value) ? option.value : best,
  CHANCES[0].value);
}

/**
 * Edit what one pet says: its catchphrases, how often it uses them, and the
 * hellos it opens with.
 *
 * All three were previously fixed — the hellos in an array in the source, and
 * one pet's catchphrase in an `if` on its key. This is the same dials, exposed.
 */
export function PetGreetingEditor({
  onClose,
  petKey,
  petName,
}: {
  onClose: () => void;
  petKey: string;
  petName: string;
}) {
  const [prefixes, setPrefixes] = useState<string[]>([""]);
  const [chance, setChance] = useState(DEFAULT_PREFIX_CHANCE);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const stored = getPetGreeting(petKey);
    setPrefixes(stored.prefixes?.length ? stored.prefixes : [""]);
    setChance(stored.prefixChance ?? DEFAULT_PREFIX_CHANCE);
    setLines(stored.lines?.length ? stored.lines : [""]);
  }, [petKey]);

  const save = (nextPrefixes: string[], nextChance: number, nextLines: string[]) => {
    setPetGreeting(petKey, {
      lines: nextLines.filter((line) => line.trim()),
      prefixChance: nextChance,
      prefixes: nextPrefixes.filter((one) => one.trim()),
    });
  };

  const updatePrefix = (index: number, value: string) => {
    const next = prefixes.map((one, at) => (at === index ? value : one));
    setPrefixes(next);
    save(next, chance, lines);
  };

  const updateLine = (index: number, value: string) => {
    const next = lines.map((line, at) => (at === index ? value : line));
    setLines(next);
    save(prefixes, chance, next);
  };

  const filledPrefixes = prefixes.filter((one) => one.trim());
  const sample = filledPrefixes[0]?.trim();

  return (
    <div className="mt-3 rounded-[14px] border border-[var(--accent)]/40 bg-[var(--surface-2)] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black text-[var(--text-1)]">
          {ui("What")} {petName} {ui("says")}
        </p>
        <button
          aria-label={ui("Close")}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-3)] hover:text-[var(--text-1)]"
          onClick={onClose}
          type="button"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Catchphrases ───────────────────────────────────────────────── */}
      <div className="mt-2">
        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
          {ui("Catchphrases")}
        </span>
        <div className="mt-1 space-y-1.5">
          {prefixes.map((one, index) => (
            <div className="flex items-center gap-1.5" key={index}>
              <input
                className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                maxLength={MAX_GREETING}
                onBlur={() => save(prefixes, chance, lines)}
                onChange={(event) => updatePrefix(index, event.target.value)}
                placeholder={ui("e.g. Hello darling.")}
                value={one}
              />
              <button
                aria-label={ui("Remove")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-3)] hover:text-rose-500"
                onClick={() => {
                  const next = prefixes.filter((_, at) => at !== index);
                  setPrefixes(next.length ? next : [""]);
                  save(next, chance, lines);
                }}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          className={cn(
            "mt-2 inline-flex h-8 items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 text-[11px] font-black text-[var(--text-2)] hover:text-[var(--text-1)]",
            prefixes.length >= MAX_GREETING_LINES && "opacity-40"
          )}
          disabled={prefixes.length >= MAX_GREETING_LINES}
          onClick={() => setPrefixes([...prefixes, ""])}
          type="button"
        >
          <Plus className="h-3 w-3" />
          {ui("Add a catchphrase")}
        </button>
        <span className="mt-1.5 block text-[10px] font-semibold text-[var(--text-3)]">
          {filledPrefixes.length > 1
            ? ui("Said in front of what this pet says — a different one each time.")
            : ui("Said in front of everything this pet says. Add more for variety.")}
        </span>
      </div>

      {/* ── How often ──────────────────────────────────────────────────── */}
      <label className="mt-3 block">
        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
          {ui("How often")}
        </span>
        <select
          className="mt-1 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => {
            const next = Number(event.target.value);
            setChance(next);
            save(prefixes, next, lines);
          }}
          value={nearestChance(chance)}
        >
          {CHANCES.map((option) => (
            <option key={option.value} value={option.value}>{ui(option.label)}</option>
          ))}
        </select>
        <span className="mt-1 block text-[10px] font-semibold text-[var(--text-3)]">
          {ui("How often a message gets a catchphrase at all.")}
        </span>
      </label>

      {/* ── Hellos ─────────────────────────────────────────────────────── */}
      <div className="mt-3">
        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
          {ui("Hellos")}
        </span>
        <div className="mt-1 space-y-1.5">
          {lines.map((line, index) => (
            <div className="flex items-center gap-1.5" key={index}>
              <input
                className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                maxLength={MAX_GREETING}
                onBlur={() => save(prefixes, chance, lines)}
                onChange={(event) => updateLine(index, event.target.value)}
                placeholder={ui("e.g. Ready when you are.")}
                value={line}
              />
              <button
                aria-label={ui("Remove")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-3)] hover:text-rose-500"
                onClick={() => {
                  const next = lines.filter((_, at) => at !== index);
                  setLines(next.length ? next : [""]);
                  save(prefixes, chance, next);
                }}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 text-[11px] font-black text-[var(--text-2)] hover:text-[var(--text-1)]",
              lines.length >= MAX_GREETING_LINES && "opacity-40"
            )}
            disabled={lines.length >= MAX_GREETING_LINES}
            onClick={() => setLines([...lines, ""])}
            type="button"
          >
            <Plus className="h-3 w-3" />
            {ui("Add a hello")}
          </button>
          <button
            className="inline-flex h-8 items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 text-[11px] font-black text-[var(--text-2)] hover:text-[var(--text-1)]"
            onClick={() => {
              // Forget the overrides rather than saving blanks, so a pet with a
              // built-in catchphrase gets it back instead of falling silent.
              resetPetGreeting(petKey);
              const restored = getPetGreeting(petKey);
              setPrefixes(restored.prefixes?.length ? restored.prefixes : [""]);
              setChance(restored.prefixChance ?? DEFAULT_PREFIX_CHANCE);
              setLines(restored.lines?.length ? restored.lines : [""]);
            }}
            type="button"
          >
            <RotateCcw className="h-3 w-3" />
            {ui(petHasBuiltInVoice(petKey) ? "Back to this pet's own words" : "Back to default")}
          </button>
        </div>
        <span className="mt-1.5 block text-[10px] font-semibold text-[var(--text-3)]">
          {ui("Used when this pet first appears. Empty means the app's own greetings.")}
        </span>
      </div>

      <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-[var(--surface)] px-2.5 py-2 text-[11px] font-semibold text-[var(--text-3)]">
        <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          {sample && chance > 0
            ? `${sample} ${ui("Ready when you are.")}`
            : ui("Ready when you are.")}
        </span>
      </p>
    </div>
  );
}
