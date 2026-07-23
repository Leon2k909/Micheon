import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThemePreset } from "@/lib/theme";

type PresetOption = {
  id: ThemePreset;
  label: string;
  description: string;
  system: string;
  colors: [string, string, string, string];
};

const OPTIONS: PresetOption[] = [
  {
    id: "default",
    label: "Micheon",
    description: "The original focused learning interface.",
    system: "Original",
    colors: ["#d9d9e6", "#ffffff", "#7834f7", "#ffd233"],
  },
  {
    id: "butter",
    label: "Butter",
    description: "Warm surfaces with Butter's blue accent.",
    system: "Astryx",
    colors: ["#fdfbe4", "#ffffff", "#225bff", "#fdee8c"],
  },
  {
    id: "butter-purple",
    label: "Butter Purple",
    description: "Astryx structure with Micheon purple and cyan.",
    system: "Astryx",
    colors: ["#e2e1eb", "#ffffff", "#7834f7", "#1d9dcc"],
  },
];

export function ThemePresetPicker({
  value,
  onChange,
}: {
  value: ThemePreset;
  onChange: (preset: ThemePreset) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--text-1)]">Interface theme</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            Choose the design system separately from light or dark mode.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[10px] font-black text-[var(--accent)]">
          <Sparkles className="h-3 w-3" />
          3 themes
        </span>
      </div>

      <div
        aria-label="Interface theme"
        className="mt-3 grid gap-2 sm:grid-cols-3"
        role="radiogroup"
      >
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              aria-checked={selected}
              className={cn(
                "relative min-w-0 overflow-hidden rounded-[16px] border bg-[var(--surface)] p-2.5 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5",
                selected
                  ? "border-[var(--accent)] shadow-[0_0_0_2px_var(--accent-dim)]"
                  : "border-[var(--border)] hover:border-[var(--border-2)]"
              )}
              key={option.id}
              onClick={() => onChange(option.id)}
              role="radio"
              type="button"
            >
              <span
                aria-hidden="true"
                className="flex h-11 items-center gap-1.5 rounded-[10px] border border-black/5 px-2"
                style={{ backgroundColor: option.colors[0] }}
              >
                <span
                  className="h-7 flex-1 rounded-md border border-black/5"
                  style={{ backgroundColor: option.colors[1] }}
                />
                <span
                  className="h-7 w-7 rounded-md"
                  style={{ backgroundColor: option.colors[2] }}
                />
                <span
                  className="h-7 w-3 rounded-full"
                  style={{ backgroundColor: option.colors[3] }}
                />
              </span>
              <span className="mt-2.5 flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-black text-[var(--text-1)]">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-black uppercase text-[var(--text-3)]">
                    {option.system}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    selected
                      ? "bg-[var(--accent)] text-[var(--accent-text)]"
                      : "bg-[var(--surface-2)] text-transparent"
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
              </span>
              <span className="mt-2 block text-[10px] font-semibold leading-4 text-[var(--text-3)]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] font-semibold leading-4 text-[var(--text-3)]">
        Choosing a preset clears manual colour overrides so the selected design is shown accurately.
      </p>
    </div>
  );
}
