import { useState } from "react";
import { Paintbrush, RotateCcw } from "lucide-react";
import {
  THEME_COLOR_SLOTS,
  GRADIENT_SLOTS,
  getCustomTheme,
  setCustomTheme,
  resetCustomTheme,
  effectiveColor,
  type CustomTheme,
} from "@/lib/customTheme";

/**
 * Full appearance control: every core colour and the hero gradient are live
 * colour pickers. Changes apply instantly, persist, and sync with the account
 * on this machine. Reset returns to the stock light/dark theme.
 */
export function AppearanceEditor() {
  const [overrides, setOverrides] = useState<CustomTheme>(() => getCustomTheme());

  const change = (key: string, value: string) => {
    setOverrides(setCustomTheme({ [key]: value }));
  };

  const reset = () => {
    resetCustomTheme();
    setOverrides({});
  };

  const customized = Object.keys(overrides).length > 0;
  const gradPreview = `linear-gradient(135deg, ${overrides.gradFrom || "#7834f7"} 0%, ${
    overrides.gradVia || overrides.gradFrom || "#8b4cff"
  } 52%, ${overrides.gradTo || "#6b2ee6"} 100%)`;

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--feature-gradient)" }}
          >
            <Paintbrush className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Appearance</h2>
            <p className="mt-0.5 text-sm font-semibold text-[var(--text-3)]">
              Make it yours — every colour applies instantly and stays saved.
            </p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-4 py-2 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] disabled:opacity-40"
          onClick={reset}
          disabled={!customized}
          type="button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to default
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {THEME_COLOR_SLOTS.map((slot) => (
          <label
            key={slot.cssVar}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-[18px] bg-[var(--surface-2)] px-4 py-3"
          >
            <span className="text-sm font-bold text-[var(--text-1)]">{slot.label}</span>
            <input
              type="color"
              value={effectiveColor(slot.cssVar, overrides)}
              onChange={(e) => change(slot.cssVar, e.target.value)}
              className="h-8 w-12 shrink-0 cursor-pointer rounded-md border border-[var(--border)] bg-transparent p-0.5"
              aria-label={`${slot.label} colour`}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-[18px] bg-[var(--surface-2)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-[var(--text-1)]">Hero gradient</p>
          <div className="h-6 w-40 rounded-full" style={{ background: gradPreview }} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {GRADIENT_SLOTS.map((slot) => (
            <label
              key={slot.key}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-[14px] bg-[var(--surface)] px-4 py-2.5"
            >
              <span className="text-xs font-bold text-[var(--text-2)]">{slot.label}</span>
              <input
                type="color"
                value={overrides[slot.key] || slot.fallback}
                onChange={(e) => change(slot.key, e.target.value)}
                className="h-7 w-11 shrink-0 cursor-pointer rounded-md border border-[var(--border)] bg-transparent p-0.5"
                aria-label={`${slot.label} colour`}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
