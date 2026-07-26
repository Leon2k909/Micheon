import { useState } from "react";
import { EyeOff, MessageSquare, Pencil, RefreshCw } from "lucide-react";

import { CodexPetSprite } from "@/components/codexPets/CodexPetSprite";
import { PetGallery } from "@/components/codexPets/PetGallery";
import { PetGreetingEditor } from "@/components/codexPets/PetGreetingEditor";
import { MAX_PET_NAME, petDisplayName, setPetName } from "@/lib/petNames";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { useCodexPetCoaching } from "@/components/codexPets/useCodexPetCoaching";
import { codexPetKey } from "@/lib/codexPets";
import type { CodexPetCoachingKind, CodexPetFrequency } from "@/lib/codexPetCoaching";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

export function CodexPetPicker() {
  const { frequencies, setFrequency } = useCodexPetCoaching();
  // Which pet is mid-rename, and the text being typed for it.
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  /** Which pet's greetings are open for editing. */
  const [greetingFor, setGreetingFor] = useState<string | null>(null);
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
                <span className="mt-1 line-clamp-1 max-w-full text-xs font-black">
                  {petDisplayName(key, pet.displayName)}
                </span>
              </button>
              {renaming === key ? (
                <input
                  autoFocus
                  className="mx-1 mb-1 h-7 rounded-md border border-[var(--accent)] bg-[var(--surface-2)] px-2 text-[11px] font-bold text-[var(--text-1)] outline-none"
                  maxLength={MAX_PET_NAME}
                  onBlur={() => { setPetName(key, draftName); setRenaming(null); }}
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") { setPetName(key, draftName); setRenaming(null); }
                    if (event.key === "Escape") setRenaming(null);
                  }}
                  placeholder={pet.displayName}
                  value={draftName}
                />
              ) : (
                <button
                  className="mx-1 mb-1 inline-flex h-6 items-center justify-center gap-1 rounded-md text-[10px] font-black text-[var(--text-3)] transition-colors hover:text-[var(--accent)]"
                  onClick={() => { setRenaming(key); setDraftName(petDisplayName(key, "")); }}
                  title={ui("Rename this pet")}
                  type="button"
                >
                  <Pencil className="h-3 w-3" />
                  {ui("Rename")}
                </button>
              )}
              <button
                className="mx-1 mb-1 inline-flex h-6 items-center justify-center gap-1 rounded-md text-[10px] font-black text-[var(--text-3)] transition-colors hover:text-[var(--accent)]"
                onClick={() => setGreetingFor(greetingFor === key ? null : key)}
                title={ui("Change what this pet says")}
                type="button"
              >
                <MessageSquare className="h-3 w-3" />
                {ui("Greeting")}
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

      {greetingFor && (
        <PetGreetingEditor
          onClose={() => setGreetingFor(null)}
          petKey={greetingFor}
          petName={petDisplayName(
            greetingFor,
            pets.find((pet) => codexPetKey(pet) === greetingFor)?.displayName ?? ""
          )}
        />
      )}

      <div className="mt-4 rounded-[18px] bg-[var(--surface)] p-3">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--text-2)]">
          {ui("Pet coaching")}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
          {ui("Choose how often your pet checks your memory and shares language tips.")}
        </p>
        <div className="mt-3 space-y-3">
          <FrequencyControl
            description={ui("Checks words and phrases you've already learned.")}
            kind="questions"
            label={ui("Review questions")}
            onChange={setFrequency}
            value={frequencies.questions}
          />
          <FrequencyControl
            description={ui("Shares useful grammar, word-order, and vocabulary tips.")}
            kind="tips"
            label={ui("Language tips")}
            onChange={setFrequency}
            value={frequencies.tips}
          />
        </div>
      </div>

      {!isLoading && pets.length === 0 && (
        <p className="mt-3 text-xs font-semibold text-[var(--text-3)]">
          {error ? ui(error) : ui("No mascot pets are available.")}
        </p>
      )}
      <PetGallery onInstalled={() => void refresh()} />

    </section>
  );
}

const FREQUENCY_OPTIONS: Array<{ label: string; value: CodexPetFrequency }> = [
  { label: "Off", value: "off" },
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
];

function FrequencyControl({
  description,
  kind,
  label,
  onChange,
  value,
}: {
  description: string;
  kind: CodexPetCoachingKind;
  label: string;
  onChange: (kind: CodexPetCoachingKind, frequency: CodexPetFrequency) => void;
  value: CodexPetFrequency;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-black text-[var(--text-1)]">{label}</legend>
      <p className="mt-0.5 text-[11px] font-semibold leading-4 text-[var(--text-3)]">{description}</p>
      <div className="mt-2 grid grid-cols-4 gap-1 rounded-xl bg-[var(--surface-2)] p-1">
        {FREQUENCY_OPTIONS.map((option) => (
          <button
            aria-pressed={value === option.value}
            className={cn(
              "min-h-8 rounded-lg px-1 text-[11px] font-black transition-colors",
              value === option.value
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-3)] hover:bg-[var(--surface)] hover:text-[var(--text-1)]"
            )}
            key={option.value}
            onClick={() => onChange(kind, option.value)}
            type="button"
          >
            {ui(option.label)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
