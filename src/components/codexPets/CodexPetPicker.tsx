import { EyeOff, RefreshCw } from "lucide-react";

import { CodexPetSprite } from "@/components/codexPets/CodexPetSprite";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { codexPetKey } from "@/lib/codexPets";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

export function CodexPetPicker() {
  const {
    error,
    isLoading,
    pets,
    refresh,
    selectedKey,
    selectPet,
    togglePetVisibility,
    visibleKeys,
  } = useCodexPets();

  return (
    <section className="mt-5 border-t border-[var(--border)] pt-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Desktop mascot")}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Choose one pet to speak. Keep additional pets visible with Show.")}
          </p>
        </div>
        <button
          aria-label={ui("Refresh Codex pets")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-2)] transition-colors hover:text-[var(--accent)] disabled:opacity-50"
          disabled={isLoading}
          onClick={() => void refresh()}
          title={ui("Refresh Codex pets")}
          type="button"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <button
          aria-pressed={selectedKey === "off"}
          className={cn(
            "flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[16px] border bg-[var(--surface)] px-2 py-3 text-center transition-colors",
            selectedKey === "off"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--text-3)]"
          )}
          onClick={() => selectPet("off")}
          type="button"
        >
          <EyeOff className="h-6 w-6" />
          <span className="text-xs font-black">{ui("Off")}</span>
        </button>

        {pets.map((pet) => {
          const key = codexPetKey(pet);
          const selected = selectedKey === key;
          const visible = visibleKeys.includes(key);
          return (
            <div
              className={cn(
                "flex min-h-[104px] flex-col overflow-hidden rounded-[16px] border bg-[var(--surface)] text-center transition-colors",
                selected
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-2)]"
              )}
              key={key}
              title={pet.description || pet.displayName}
            >
              <button
                aria-label={`${ui("Make")} ${pet.displayName} ${ui("the talking pet")}`}
                aria-pressed={selected}
                className="flex min-h-[76px] flex-1 flex-col items-center justify-end px-2 pb-1 pt-1 hover:bg-[var(--surface-2)]"
                onClick={() => selectPet(key)}
                type="button"
              >
                <CodexPetSprite animation="idle" pet={pet} size={54} />
                <span className="mt-1 line-clamp-1 max-w-full text-xs font-black">{pet.displayName}</span>
              </button>
              <label className="flex h-7 items-center justify-center gap-1 border-t border-[var(--border)] text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
                <input
                  checked={visible}
                  disabled={selected}
                  onChange={() => togglePetVisibility(key)}
                  type="checkbox"
                />
                {ui("Show")}
              </label>
            </div>
          );
        })}
      </div>

      {!isLoading && pets.length === 0 && (
        <p className="mt-3 text-xs font-semibold text-[var(--text-3)]">
          {error ? ui(error) : ui("No mascot pets are available.")}
        </p>
      )}
    </section>
  );
}
