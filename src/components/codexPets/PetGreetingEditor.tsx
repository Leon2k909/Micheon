import { useEffect, useState } from "react";
import { MessageSquare, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import {
  MAX_GREETING,
  MAX_GREETING_LINES,
  getPetGreeting,
  resetPetGreeting,
  setPetGreeting,
} from "@/lib/petGreetings";

/**
 * Edit what one pet says: its catchphrase, and the hellos it opens with.
 *
 * Both were previously fixed — the hellos in an array in the source, and one
 * pet's catchphrase in an `if` on its key. This is the same two dials, exposed.
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
  const [prefix, setPrefix] = useState("");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const stored = getPetGreeting(petKey);
    setPrefix(stored.prefix ?? "");
    setLines(stored.lines?.length ? stored.lines : [""]);
  }, [petKey]);

  const save = (nextPrefix: string, nextLines: string[]) => {
    setPetGreeting(petKey, { lines: nextLines.filter((line) => line.trim()), prefix: nextPrefix });
  };

  const updateLine = (index: number, value: string) => {
    const next = lines.map((line, at) => (at === index ? value : line));
    setLines(next);
    save(prefix, next);
  };

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

      <label className="mt-2 block">
        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
          {ui("Catchphrase")}
        </span>
        <input
          className="mt-1 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          maxLength={MAX_GREETING}
          onBlur={() => save(prefix, lines)}
          onChange={(event) => setPrefix(event.target.value)}
          placeholder={ui("e.g. Hello darling.")}
          value={prefix}
        />
        <span className="mt-1 block text-[10px] font-semibold text-[var(--text-3)]">
          {ui("Said in front of everything this pet says. Leave empty for none.")}
        </span>
      </label>

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
                onBlur={() => save(prefix, lines)}
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
                  save(prefix, next);
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
              setPrefix(restored.prefix ?? "");
              setLines(restored.lines?.length ? restored.lines : [""]);
            }}
            type="button"
          >
            <RotateCcw className="h-3 w-3" />
            {ui("Back to default")}
          </button>
        </div>
        <span className="mt-1.5 block text-[10px] font-semibold text-[var(--text-3)]">
          {ui("Used when this pet first appears. Empty means the app's own greetings.")}
        </span>
      </div>

      <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-[var(--surface)] px-2.5 py-2 text-[11px] font-semibold text-[var(--text-3)]">
        <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          {prefix.trim()
            ? `${prefix.trim()} ${ui("Ready when you are.")}`
            : ui("Ready when you are.")}
        </span>
      </p>
    </div>
  );
}
