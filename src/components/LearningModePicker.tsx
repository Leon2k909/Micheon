import { GraduationCap, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningMode } from "@/lib/learningMode";

const OPTIONS: Array<{
  value: LearningMode;
  label: string;
  note: string;
  icon: typeof MessageCircle;
}> = [
  {
    value: "conversation",
    label: "Conversation",
    note: "Practise the short, natural forms people use. Full forms stay visible and count as correct.",
    icon: MessageCircle,
  },
  {
    value: "exam",
    label: "Exam practice",
    note: "Practise complete standard forms for formal writing, listening, speaking, and test answers.",
    icon: GraduationCap,
  },
];

export function LearningModePicker({
  value,
  onChange,
}: {
  value: LearningMode;
  onChange: (value: LearningMode) => void;
}) {
  const selected = OPTIONS.find((option) => option.value === value) ?? OPTIONS[0];

  return (
    <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-[var(--text-1)]">Learning style</p>
        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
          {value === "conversation" ? "Default" : "Full forms"}
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{selected.note}</p>

      <div
        aria-label="Learning style"
        className="mt-3 grid grid-cols-2 gap-2 rounded-[14px] bg-[var(--surface-2)] p-1.5"
        role="radiogroup"
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = option.value === value;
          return (
            <button
              aria-checked={active}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-3 text-xs font-black transition-colors",
                active
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text-1)]"
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              role="radio"
              type="button"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
