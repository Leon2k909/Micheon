import React, { useCallback, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  ClipboardPaste,
  Database,
  GripVertical,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CatalogueImport } from "@/components/create/CatalogueImport";
import type { ImportItem } from "@/lib/studyImport";
import {
  ALL_STAGES,
  STUDY_STAGE_BLURBS,
  STUDY_STAGE_LABELS,
  duplicateTerms,
  incompleteCards,
  makeCard,
  parsePastedCards,
  studiableCards,
  type StudyCard,
  type StudySet,
  type StudyStage,
} from "@/lib/studySets";

type Tab = "cards" | "catalogue" | "paste" | "settings";

/**
 * The editor.
 *
 * Four ways in, because the cost of a study set is entirely in getting the
 * cards into it: type them, pull them from the catalogue we already have,
 * paste a column out of a spreadsheet, or change how the set is studied.
 *
 * The catalogue tab is the one that earns this feature its place inside
 * Micheon rather than beside it. Everything else here exists elsewhere on the
 * internet; a search across 23,000 German items with their genders, glosses
 * and usage notes attached does not.
 */
export function SetEditor({
  set,
  onBack,
  onChange,
  onStudy,
  apiParts,
}: {
  set: StudySet;
  onBack: () => void;
  onChange: (set: StudySet) => void;
  onStudy: () => void;
  apiParts?: Record<string, unknown>;
}) {
  const [tab, setTab] = useState<Tab>("cards");
  const [pasteText, setPasteText] = useState("");

  const patch = useCallback((changes: Partial<StudySet>) => {
    onChange({ ...set, ...changes, updatedAt: new Date().toISOString() });
  }, [onChange, set]);

  const updateCard = useCallback((id: string, changes: Partial<StudyCard>) => {
    patch({ cards: set.cards.map((card) => (card.id === id ? { ...card, ...changes } : card)) });
  }, [patch, set.cards]);

  const removeCard = useCallback((id: string) => {
    patch({ cards: set.cards.filter((card) => card.id !== id) });
  }, [patch, set.cards]);

  const moveCard = useCallback((index: number, delta: number) => {
    const next = [...set.cards];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    patch({ cards: next });
  }, [patch, set.cards]);

  const addBlank = useCallback(() => {
    patch({ cards: [...set.cards, makeCard("", "", { now: Date.now() })] });
  }, [patch, set.cards]);

  // Cards keep the id the importer gave them, so a set knows what it already
  // holds even across the two catalogues, whose ids can collide.
  const alreadyAdded = useMemo(
    () => new Set(set.cards.map((card) => card.catalogueId).filter(Boolean) as string[]),
    [set.cards]
  );

  const cardFromImport = useCallback((item: ImportItem) => makeCard(item.de, item.en, {
    hint: item.hint,
    source: "catalogue" as const,
    catalogueId: item.id,
    now: Date.now(),
  }), []);

  const addFromCatalogue = useCallback((item: ImportItem) => {
    patch({ cards: [...set.cards, cardFromImport(item)] });
  }, [cardFromImport, patch, set.cards]);

  const addManyFromCatalogue = useCallback((items: ImportItem[]) => {
    patch({ cards: [...set.cards, ...items.map(cardFromImport)] });
  }, [cardFromImport, patch, set.cards]);
  const commitPaste = useCallback(() => {
    const parsed = parsePastedCards(pasteText, Date.now());
    if (parsed.length === 0) return;
    patch({ cards: [...set.cards, ...parsed] });
    setPasteText("");
    setTab("cards");
  }, [pasteText, patch, set.cards]);

  const toggleStage = useCallback((stage: StudyStage) => {
    const has = set.stages.includes(stage);
    // A set with no stages cannot be learned, so the last one cannot be
    // switched off.
    if (has && set.stages.length === 1) return;
    patch({
      stages: has ? set.stages.filter((entry) => entry !== stage) : [...set.stages, stage],
    });
  }, [patch, set.stages]);

  const moveStage = useCallback((index: number, delta: number) => {
    const next = [...set.stages];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    patch({ stages: next });
  }, [patch, set.stages]);

  const incomplete = incompleteCards(set);
  const duplicates = duplicateTerms(set);
  const ready = studiableCards(set).length;
  const parsedPreview = pasteText.trim() ? parsePastedCards(pasteText) : [];

  const TABS: [Tab, string, React.ComponentType<{ className?: string }>][] = [
    ["cards", `Cards (${set.cards.length})`, BookOpen],
    ["catalogue", "From catalogue", Database],
    ["paste", "Paste a list", ClipboardPaste],
    ["settings", "How it is studied", GripVertical],
  ];

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {ui("All sets")}
          </button>
          <button
            type="button"
            disabled={ready === 0}
            onClick={onStudy}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-black transition-colors",
              ready > 0
                ? "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110"
                : "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-3)]"
            )}
          >
            <BookOpen className="h-4 w-4" />
            {ui("Study")} {ready > 0 ? `(${ready})` : ""}
          </button>
        </div>

        <input
          value={set.title}
          onChange={(event) => patch({ title: event.target.value })}
          placeholder={ui("Set title")}
          className="mt-4 w-full border-0 bg-transparent p-0 text-2xl font-black tracking-tight text-[var(--text-1)] outline-none placeholder:text-[var(--text-3)]"
        />
        <input
          value={set.description}
          onChange={(event) => patch({ description: event.target.value })}
          placeholder={ui("Add a description (optional)")}
          className="mt-1.5 w-full border-0 bg-transparent p-0 text-sm font-semibold text-[var(--text-3)] outline-none placeholder:text-[var(--text-3)]"
        />

        {(incomplete.length > 0 || duplicates.length > 0) && (
          <div className="mt-4 space-y-2">
            {incomplete.length > 0 && (
              <p className="flex items-start gap-2 rounded-xl bg-[var(--danger-bg)] p-3 text-xs font-bold text-[var(--danger-text)]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {incomplete.length} {ui("card(s) are missing a side and will be skipped when you study.")}
              </p>
            )}
            {duplicates.length > 0 && (
              <p className="flex items-start gap-2 rounded-xl bg-[var(--surface-2)] p-3 text-xs font-bold text-[var(--text-3)]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {ui("Repeated term(s)")}: {duplicates.slice(0, 4).join(", ")}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-black transition-colors",
                tab === id
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {ui(label)}
            </button>
          ))}
        </div>
      </section>

      {tab === "cards" && (
        <section className="card p-5 sm:p-6">
          {set.cards.length === 0 ? (
            <p className="rounded-2xl bg-[var(--surface-2)] p-6 text-center text-sm font-bold text-[var(--text-3)]">
              {ui("No cards yet. Add one below, pull them from the catalogue, or paste a list.")}
            </p>
          ) : (
            <div className="space-y-2.5">
              {set.cards.map((card, index) => (
                <div key={card.id} className="rounded-2xl bg-[var(--surface-2)] p-3.5">
                  <div className="flex items-start gap-2">
                    <span className="mt-2.5 w-6 shrink-0 text-center text-[11px] font-black text-[var(--text-3)]">
                      {index + 1}
                    </span>
                    <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                      <input
                        value={card.term}
                        onChange={(event) => updateCard(card.id, { term: event.target.value })}
                        placeholder={ui("Term")}
                        className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                      />
                      <input
                        value={card.definition}
                        onChange={(event) => updateCard(card.id, { definition: event.target.value })}
                        placeholder={ui("Definition")}
                        className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveCard(index, -1)}
                        disabled={index === 0}
                        aria-label={ui("Move up")}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-30"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCard(index, 1)}
                        disabled={index === set.cards.length - 1}
                        aria-label={ui("Move down")}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-30"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCard(card.id)}
                      aria-label={ui("Remove card")}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 pl-8">
                    <input
                      value={card.hint ?? ""}
                      onChange={(event) => updateCard(card.id, { hint: event.target.value })}
                      placeholder={ui("Hint or example (optional)")}
                      className="h-8 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 text-xs font-semibold text-[var(--text-3)] outline-none focus:border-[var(--border)] focus:bg-[var(--surface)]"
                    />
                    {card.source === "catalogue" && (
                      <span className="shrink-0 rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black uppercase text-[var(--accent)]">
                        {ui("catalogue")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addBlank}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border-2)] text-sm font-black text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]"
          >
            <Plus className="h-4 w-4" />
            {ui("Add a card")}
          </button>
        </section>
      )}

      {tab === "catalogue" && (
        <CatalogueImport
          apiParts={apiParts}
          alreadyAdded={alreadyAdded}
          onAdd={(item) => addFromCatalogue(item)}
          onAddMany={(items) => addManyFromCatalogue(items)}
        />
      )}
      {tab === "paste" && (
        <section className="card p-5 sm:p-6">
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Paste a list")}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("One card per line. Separate the two sides with a tab, a dash, an equals sign or a colon — a tab is what you get pasting two columns out of a spreadsheet.")}
          </p>
          <textarea
            value={pasteText}
            onChange={(event) => setPasteText(event.target.value)}
            rows={9}
            placeholder={"der Apfel - apple\ndie Stadt - city\nIch hätte gerne… = I would like…"}
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5 font-mono text-xs font-semibold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          />
          {parsedPreview.length > 0 && (
            <div className="mt-3 rounded-2xl bg-[var(--surface-2)] p-3.5">
              <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("Preview")} · {parsedPreview.length} {ui("cards")}
              </p>
              <div className="mt-2 space-y-1">
                {parsedPreview.slice(0, 5).map((card, index) => (
                  <p key={index} className="truncate text-xs font-bold text-[var(--text-2)]">
                    <span className="text-[var(--text-1)]">{card.term}</span>
                    {card.definition ? ` — ${card.definition}` : (
                      <span className="text-[var(--danger-text)]"> — {ui("no second side")}</span>
                    )}
                  </p>
                ))}
                {parsedPreview.length > 5 && (
                  <p className="text-[11px] font-bold text-[var(--text-3)]">
                    + {parsedPreview.length - 5} {ui("more")}
                  </p>
                )}
              </div>
            </div>
          )}
          <button
            type="button"
            disabled={parsedPreview.length === 0}
            onClick={commitPaste}
            className={cn(
              "mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition-colors",
              parsedPreview.length > 0
                ? "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110"
                : "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-3)]"
            )}
          >
            <Plus className="h-4 w-4" />
            {ui("Add")} {parsedPreview.length > 0 ? parsedPreview.length : ""} {ui("cards")}
          </button>
        </section>
      )}

      {tab === "settings" && (
        <section className="card p-5 sm:p-6">
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Stages")}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("A Learn session walks each card up this ladder. Two right in a row promotes it; getting it wrong drops it back one. Reorder or switch off whichever you like.")}
          </p>

          <div className="mt-3 space-y-2">
            {set.stages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-2 rounded-2xl bg-[var(--surface-2)] p-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[11px] font-black text-[var(--accent)]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-[var(--text-1)]">{ui(STUDY_STAGE_LABELS[stage])}</span>
                  <span className="block text-[11px] font-semibold text-[var(--text-3)]">{ui(STUDY_STAGE_BLURBS[stage])}</span>
                </span>
                <button
                  type="button"
                  onClick={() => moveStage(index, -1)}
                  disabled={index === 0}
                  aria-label={ui("Move up")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-30"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStage(index, 1)}
                  disabled={index === set.stages.length - 1}
                  aria-label={ui("Move down")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-30"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleStage(stage)}
                  disabled={set.stages.length === 1}
                  aria-label={ui("Remove stage")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text)] disabled:opacity-30"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {ALL_STAGES.filter((stage) => !set.stages.includes(stage)).length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Add a stage")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_STAGES.filter((stage) => !set.stages.includes(stage)).map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => toggleStage(stage)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border-2)] px-3 py-2 text-xs font-black text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]"
                  >
                    <Plus className="h-3 w-3" />
                    {ui(STUDY_STAGE_LABELS[stage])}
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 className="mt-6 text-sm font-black text-[var(--text-1)]">{ui("Which side is asked")}</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {([["term", "Show the term"], ["definition", "Show the definition"]] as const).map(([side, label]) => (
              <button
                key={side}
                type="button"
                onClick={() => patch({ promptSide: side })}
                aria-pressed={set.promptSide === side}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-xs font-black transition-colors",
                  set.promptSide === side
                    ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                )}
              >
                {ui(label)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => patch({ speak: !set.speak })}
            aria-pressed={set.speak}
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-[var(--surface-2)] px-3.5 py-3 text-left transition-colors hover:bg-[var(--surface-3)]"
          >
            <span>
              <span className="block text-xs font-black text-[var(--text-1)]">{ui("Read cards aloud")}</span>
              <span className="block text-[11px] font-semibold text-[var(--text-3)]">
                {ui("Speaks the German side when a card appears.")}
              </span>
            </span>
            <span className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors",
              set.speak ? "bg-[var(--accent)]" : "bg-slate-600"
            )}>
              <span className={cn(
                "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                set.speak ? "translate-x-4" : "translate-x-0"
              )} />
            </span>
          </button>
        </section>
      )}
    </div>
  );
}
