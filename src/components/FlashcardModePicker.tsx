import { Layers, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import type { FlashcardFace, FlashcardMode } from "@/lib/flashcardMode";

/**
 * How the lesson preview presents a phrase: both languages at once, or a card
 * you have to turn over. The flip side also chooses which face it opens on,
 * because "see the German, recall the English" and the reverse are different
 * exercises and learners want different ones.
 */
export function FlashcardModePicker({
  face,
  mode,
  onFaceChange,
  onModeChange,
  titled = true,
}: {
  face: FlashcardFace;
  mode: FlashcardMode;
  onFaceChange: (face: FlashcardFace) => void;
  onModeChange: (mode: FlashcardMode) => void;
  /** Off inside a settings category, which already draws the title above it. */
  titled?: boolean;
}) {
  const options: { id: FlashcardMode; icon: typeof Layers; label: string; blurb: string }[] = [
    {
      id: "flip",
      icon: RefreshCw,
      label: "Flip card",
      blurb: "See one side and turn it over. Click the card, or press space.",
    },
    {
      id: "both",
      icon: Layers,
      label: "Both languages",
      blurb: "German and English together — quick to skim before practice.",
    },
  ];

  return (
    <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
      {/* The settings category draws this heading itself, so inside one this
          would print "Flashcards" twice. It stays for the other use, where
          the picker follows LearningModePicker inside a plain card and needs
          to say which of the two it is. */}
      {titled && (
        <>
          <p className="text-sm font-black text-[var(--text-1)]">{ui("Flashcards")}</p>
          <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
            {ui("How today's phrases are shown before sentence practice.")}
          </p>
        </>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = mode === option.id;
          const Icon = option.icon;
          return (
            <button
              aria-pressed={active}
              className={cn(
                "flex items-start gap-3 rounded-[14px] border p-3 text-left transition-colors",
                active
                  ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)]"
              )}
              key={option.id}
              onClick={() => onModeChange(option.id)}
              type="button"
            >
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-[var(--accent)]" : "text-[var(--text-3)]")} />
              <span>
                <span className={cn("block text-sm font-black", active ? "text-[var(--accent)]" : "text-[var(--text-1)]")}>
                  {ui(option.label)}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-[var(--text-3)]">
                  {ui(option.blurb)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Only meaningful once there is a side to start on. */}
      {mode === "flip" && (
        <div className="mt-3">
          <p className="text-xs font-black uppercase text-[var(--text-3)]">{ui("Start each card on")}</p>
          <div className="mt-2 flex gap-2">
            {([
              { id: "target" as const, label: "The language you're learning" },
              { id: "meaning" as const, label: "Your own language" },
            ]).map((option) => (
              <button
                aria-pressed={face === option.id}
                className={cn(
                  "h-9 flex-1 rounded-full px-3 text-xs font-black transition-colors",
                  face === option.id
                    ? "bg-[var(--accent)] text-[var(--accent-text)]"
                    : "bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)]"
                )}
                key={option.id}
                onClick={() => onFaceChange(option.id)}
                type="button"
              >
                {ui(option.label)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
