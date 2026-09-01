import React, { useCallback, useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, BookOpen, ClipboardPaste, Check, Share2, Database, GripVertical, CheckSquare, Pencil, Plus, Square, Trash2, X } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CatalogueImport } from "@/components/create/CatalogueImport";
import { DelimitedImport } from "@/components/create/DelimitedImport";
import { ListPager, LongListChoice, ScrollJump, ShowMore } from "@/components/create/LongList";
import {
  CARD_PAGE_SIZE,
  LONG_LIST_THRESHOLD,
  loadLongListMode,
  pageWindow,
  saveLongListMode,
  type LongListMode,
} from "@/lib/longLists";
import type { ImportItem } from "@/lib/studyImport";
import {
  ALL_STAGES,
  MASTERY_TARGET_RANGE,
  ROUND_SIZE_CHOICES,
  DEFAULT_STAGES,
  STUDY_STAGE_BLURBS,
  STUDY_STAGE_LABELS,
  duplicateTerms,
  exportSetToText,
  importSetFromText,
  incompleteCards,
  makeCard,
  parsePastedCards,
  studiableCards,
  type StudyCard,
  type StudySet,
  type StudyStage,
} from "@/lib/studySets";

type Tab = "cards" | "catalogue" | "paste" | "settings" | "share";

export type StudySetUndo = {
  message: string;
  restore: (current: StudySet) => StudySet;
};

const restoreCardsAt = (
  current: StudyCard[],
  removed: { card: StudyCard; index: number }[]
) => {
  const next = [...current];
  for (const { card, index } of [...removed].sort((a, b) => a.index - b.index)) {
    if (next.some((entry) => entry.id === card.id)) continue;
    next.splice(Math.min(index, next.length), 0, card);
  }
  return next;
};

const removeImportedCards = (ids: string[]): StudySetUndo["restore"] => {
  const imported = new Set(ids);
  return (current) => ({
    ...current,
    cards: current.cards.filter((card) => !imported.has(card.id)),
  });
};

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
  savedAt,
}: {
  set: StudySet;
  onBack: () => void;
  onChange: (set: StudySet, undo?: StudySetUndo) => void;
  onStudy: () => void;
  apiParts?: Record<string, unknown>;
  savedAt: number;
}) {
  const [tab, setTab] = useState<Tab>("cards");
  const [pasteText, setPasteText] = useState("");
  const [shareText, setShareText] = useState("");
  const [copied, setCopied] = useState(false);
  /**
   * Bulk selection.
   *
   * Importing 250 cards and then pruning them one at a time is worse than not
   * importing them. Ids rather than indexes, so a selection survives reorder
   * and deletion instead of silently pointing at whatever moved into the slot.
   */
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cardPage, setCardPage] = useState(1);
  // Same bound as the catalogue: a card row is two inputs, so a set of a few
  // thousand would be far heavier than a list of search results.
  const [cardsLoaded, setCardsLoaded] = useState(CARD_PAGE_SIZE);
  const [cardMode, setCardMode] = useState<LongListMode>(() => loadLongListMode());
  const chooseCardMode = useCallback((next: LongListMode) => {
    setCardMode(next);
    saveLongListMode(next);
    setCardPage(1);
    setCardsLoaded(CARD_PAGE_SIZE);
  }, []);

  const patch = useCallback((changes: Partial<StudySet>, undo?: StudySetUndo) => {
    onChange({ ...set, ...changes, updatedAt: new Date().toISOString() }, undo);
  }, [onChange, set]);

  const updateCard = useCallback((id: string, changes: Partial<StudyCard>) => {
    patch({ cards: set.cards.map((card) => (card.id === id ? { ...card, ...changes } : card)) });
  }, [patch, set.cards]);

  const removeCard = useCallback((id: string) => {
    const index = set.cards.findIndex((card) => card.id === id);
    if (index < 0) return;
    const card = set.cards[index];
    patch(
      { cards: set.cards.filter((entry) => entry.id !== id) },
      {
        message: ui("Card deleted"),
        restore: (current) => ({ ...current, cards: restoreCardsAt(current.cards, [{ card, index }]) }),
      }
    );
  }, [patch, set.cards]);

  const moveCard = useCallback((index: number, delta: number) => {
    const next = [...set.cards];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    patch({ cards: next });
  }, [patch, set.cards]);

  const toggleSelected = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeSelected = useCallback(() => {
    const removed = set.cards.flatMap((card, index) => selected.has(card.id) ? [{ card, index }] : []);
    if (removed.length === 0) return;
    patch(
      { cards: set.cards.filter((card) => !selected.has(card.id)) },
      {
        message: `${removed.length} ${ui(removed.length === 1 ? "card deleted" : "cards deleted")}`,
        restore: (current) => ({ ...current, cards: restoreCardsAt(current.cards, removed) }),
      }
    );
    setSelected(new Set());
  }, [patch, selected, set.cards]);

  const moveSelected = useCallback((toTop: boolean) => {
    const picked = set.cards.filter((card) => selected.has(card.id));
    if (picked.length === 0) return;
    const rest = set.cards.filter((card) => !selected.has(card.id));
    const before = set.cards.map((card) => card.id);
    patch(
      { cards: toTop ? [...picked, ...rest] : [...rest, ...picked] },
      {
        message: `${picked.length} ${ui(picked.length === 1 ? "card moved" : "cards moved")}`,
        restore: (current) => {
          const byId = new Map(current.cards.map((card) => [card.id, card]));
          const restored = before.flatMap((id) => byId.has(id) ? [byId.get(id)!] : []);
          const beforeIds = new Set(before);
          return { ...current, cards: [...restored, ...current.cards.filter((card) => !beforeIds.has(card.id))] };
        },
      }
    );
  }, [patch, selected, set.cards]);

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
    const card = cardFromImport(item);
    patch(
      { cards: [...set.cards, card] },
      { message: ui("1 card imported"), restore: removeImportedCards([card.id]) }
    );
  }, [cardFromImport, patch, set.cards]);

  const addManyFromCatalogue = useCallback((items: ImportItem[]) => {
    const cards = items.map(cardFromImport);
    if (cards.length === 0) return;
    patch(
      { cards: [...set.cards, ...cards] },
      {
        message: `${cards.length} ${ui(cards.length === 1 ? "card imported" : "cards imported")}`,
        restore: removeImportedCards(cards.map((card) => card.id)),
      }
    );
  }, [cardFromImport, patch, set.cards]);
  const commitPaste = useCallback(() => {
    const parsed = parsePastedCards(pasteText, Date.now());
    if (parsed.length === 0) return;
    patch(
      { cards: [...set.cards, ...parsed] },
      {
        message: `${parsed.length} ${ui(parsed.length === 1 ? "card imported" : "cards imported")}`,
        restore: removeImportedCards(parsed.map((card) => card.id)),
      }
    );
    setPasteText("");
    setTab("cards");
  }, [pasteText, patch, set.cards]);

  const commitDelimited = useCallback((cards: StudyCard[]) => {
    patch(
      { cards: [...set.cards, ...cards] },
      {
        message: `${cards.length} ${ui(cards.length === 1 ? "card imported" : "cards imported")}`,
        restore: removeImportedCards(cards.map((card) => card.id)),
      }
    );
    setTab("cards");
  }, [patch, set.cards]);

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

  /**
   * The page of cards on screen, each with the index it has in the set.
   *
   * The index has to be the real one: reorder, the numbering beside each row
   * and moveCard all address the set, not the page. Handing them a
   * page-relative index would silently move the wrong card.
   */
  const cardPages = pageWindow(set.cards.length, cardPage, CARD_PAGE_SIZE);
  const visibleCards = useMemo(() => {
    const withIndex = set.cards.map((card, index) => ({ card, index }));
    if (cardMode === "scroll") return withIndex.slice(0, cardsLoaded);
    return withIndex.slice((cardPages.page - 1) * CARD_PAGE_SIZE, cardPages.page * CARD_PAGE_SIZE);
  }, [set.cards, cardMode, cardPages.page, cardsLoaded]);

  const incomplete = incompleteCards(set);
  const duplicates = duplicateTerms(set);
  const ready = studiableCards(set).length;
  const parsedPreview = pasteText.trim() ? parsePastedCards(pasteText) : [];

  const TABS: [Tab, string, React.ComponentType<{ className?: string }>][] = [
    ["cards", `Cards (${set.cards.length})`, BookOpen],
    ["catalogue", "From catalogue", Database],
    ["paste", "Paste a list", ClipboardPaste],
    ["settings", "How it is studied", GripVertical],
    ["share", "Share", Share2],
  ];

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {ui("All sets")}
            </button>
            <span
              aria-live="polite"
              className="create-save-status"
              data-saved-at={savedAt}
            >
              <Check className="h-3.5 w-3.5" />
              {ui("Saved")}
            </span>
          </div>
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

        {/*
          The title was a borderless input, which looks exactly like a heading
          and so nobody knew it could be renamed. It now carries a pencil and a
          box that shows itself on hover and focus — the affordance has to be
          visible before you touch it, or it may as well not exist.
        */}
        <label className="group mt-4 flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition-colors hover:border-[var(--border)] hover:bg-[var(--surface-2)] focus-within:border-[var(--accent)] focus-within:bg-[var(--surface-2)]">
          <Pencil className="h-4 w-4 shrink-0 text-[var(--text-3)] opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:text-[var(--accent)] group-focus-within:opacity-100" />
          <input
            value={set.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder={ui("Set title")}
            aria-label={ui("Set title — click to rename")}
            className="w-full border-0 bg-transparent p-0 text-2xl font-black tracking-tight text-[var(--text-1)] outline-none placeholder:text-[var(--text-3)]"
          />
        </label>
        <label className="group flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition-colors hover:border-[var(--border)] hover:bg-[var(--surface-2)] focus-within:border-[var(--accent)] focus-within:bg-[var(--surface-2)]">
          <Pencil className="h-3 w-3 shrink-0 text-[var(--text-3)] opacity-0 transition-opacity group-hover:opacity-70 group-focus-within:opacity-100" />
          <input
            value={set.description}
            onChange={(event) => patch({ description: event.target.value })}
            placeholder={ui("Add a description (optional)")}
            aria-label={ui("Set description")}
            className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-[var(--text-3)] outline-none placeholder:text-[var(--text-3)]"
          />
        </label>

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
          {set.cards.length > 1 && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected(
                  selected.size === set.cards.length ? new Set() : new Set(set.cards.map((card) => card.id))
                )}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
              >
                {selected.size === set.cards.length
                  ? <CheckSquare className="h-3.5 w-3.5" />
                  : <Square className="h-3.5 w-3.5" />}
                {ui(selected.size === set.cards.length ? "Select none" : "Select all")}
              </button>

              {selected.size > 0 && (
                <>
                  <span className="text-xs font-black text-[var(--accent)]">
                    {selected.size} {ui("selected")}
                  </span>
                  <button
                    type="button"
                    onClick={() => moveSelected(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                    {ui("To top")}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSelected(false)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                    {ui("To bottom")}
                  </button>
                  <button
                    type="button"
                    onClick={removeSelected}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--danger-bg)] px-3 text-xs font-black text-[var(--danger-text)] transition-colors hover:brightness-110"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {ui("Delete")} {selected.size}
                  </button>
                </>
              )}

              {/* Selecting only the broken ones is the common case after a
                  big paste or import, so it gets its own button. */}
              {incomplete.length > 0 && selected.size === 0 && (
                <button
                  type="button"
                  onClick={() => setSelected(new Set(incomplete.map((card) => card.id)))}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {ui("Select the")} {incomplete.length} {ui("incomplete")}
                </button>
              )}
            </div>
          )}

          {set.cards.length === 0 ? (
            <p className="rounded-2xl bg-[var(--surface-2)] p-6 text-center text-sm font-bold text-[var(--text-3)]">
              {ui("No cards yet. Add one below, pull them from the catalogue, or paste a list.")}
            </p>
          ) : (
            <div className="space-y-2.5">
              {visibleCards.map(({ card, index }) => (
                <div
                  key={card.id}
                  className={cn(
                    "rounded-2xl p-3.5 transition-colors",
                    selected.has(card.id) ? "bg-[var(--accent-dim)] ring-1 ring-[var(--accent)]" : "bg-[var(--surface-2)]"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSelected(card.id)}
                      aria-pressed={selected.has(card.id)}
                      aria-label={`${ui("Select card")} ${index + 1}`}
                      className="mt-1.5 flex w-7 shrink-0 flex-col items-center gap-0.5"
                    >
                      {selected.has(card.id)
                        ? <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
                        : <Square className="h-4 w-4 text-[var(--text-3)] opacity-50" />}
                      <span className="text-[10px] font-black text-[var(--text-3)]">{index + 1}</span>
                    </button>
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
                    {(card.source === "catalogue" || card.source === "file") && (
                      <span className="shrink-0 rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black uppercase text-[var(--accent)]">
                        {ui(card.source === "file" ? "file" : "catalogue")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/*
            A long set is either paged or scrolled, and the reader picks.
            Three hundred cards rendered in one column is a page you scroll
            for a while with no idea how far in you are.
          */}
          {set.cards.length > 0 && (cardMode === "pages"
            ? <ListPager window={cardPages} onPage={setCardPage} />
            : (
              <ShowMore
                shown={visibleCards.length}
                total={set.cards.length}
                onMore={() => setCardsLoaded((value) => value + CARD_PAGE_SIZE * 2)}
              />
            ))}
          <LongListChoice mode={cardMode} onMode={chooseCardMode} total={set.cards.length} />
          <ScrollJump enabled={cardMode === "scroll" && set.cards.length >= LONG_LIST_THRESHOLD} />

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
          <DelimitedImport onImport={commitDelimited} />
        </section>
      )}

      {tab === "share" && (
        <section className="card p-5 sm:p-6">
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Send this set to someone")}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Copy the text below and paste it into a message. Whoever receives it pastes it back in here — it is the same format the paste box already reads.")}
          </p>
          <textarea
            readOnly
            value={exportSetToText(set)}
            rows={8}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5 font-mono text-xs font-semibold text-[var(--text-2)] outline-none"
          />
          <button
            type="button"
            onClick={() => {
              const text = exportSetToText(set);
              void navigator.clipboard?.writeText(text)
                .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); })
                .catch(() => undefined);
            }}
            className="accent-btn mt-3 inline-flex h-11 w-full items-center justify-center gap-2 text-sm"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {ui(copied ? "Copied" : "Copy to clipboard")}
          </button>

          <h3 className="mt-6 text-sm font-black text-[var(--text-1)]">{ui("Receive a set")}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Paste a shared set here to add its cards to this one. The title and description stay as they are.")}
          </p>
          <textarea
            value={shareText}
            onChange={(event) => setShareText(event.target.value)}
            rows={6}
            placeholder={"# Kitchen words\nder Löffel\tspoon\ndie Gabel\tfork"}
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5 font-mono text-xs font-semibold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          />
          {(() => {
            const parsed = shareText.trim() ? importSetFromText(shareText, Date.now()) : null;
            const usable = parsed?.cards.filter((card) => card.term.trim()) ?? [];
            return (
              <button
                type="button"
                disabled={usable.length === 0}
                onClick={() => {
                  if (!parsed) return;
                  patch(
                    {
                      cards: [...set.cards, ...usable],
                      // A received set may name its own ladder. Adopt it only if
                      // this set is still on the default, or the sender would
                      // silently overwrite a ladder you chose on purpose.
                      stages: parsed.stages && set.stages.join() === DEFAULT_STAGES.join()
                        ? parsed.stages
                        : set.stages,
                    },
                    {
                      message: `${usable.length} ${ui(usable.length === 1 ? "card imported" : "cards imported")}`,
                      restore: (current) => ({
                        ...removeImportedCards(usable.map((card) => card.id))(current),
                        stages: set.stages,
                      }),
                    }
                  );
                  setShareText("");
                  setTab("cards");
                }}
                className={cn(
                  "mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition-colors",
                  usable.length > 0
                    ? "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110"
                    : "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-3)]"
                )}
              >
                <Plus className="h-4 w-4" />
                {ui("Add")} {usable.length > 0 ? usable.length : ""} {ui("cards")}
                {parsed?.title ? ` ${ui("from")} “${parsed.title}”` : ""}
              </button>
            );
          })()}
        </section>
      )}

      {tab === "settings" && (
        <section className="card p-5 sm:p-6">
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Stages")}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("A Learn session walks each card up this ladder. Reorder or switch off whichever you like; what it takes to climb is set below.")}
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

          {/*
            Choosing the stages settles what a card is asked. These settle how
            hard it is to get past them, which is the other half of "the
            stages should be more customisable".
          */}
          <h3 className="mt-6 text-sm font-black text-[var(--text-1)]">{ui("How the ladder is climbed")}</h3>

          <div className="mt-3 rounded-2xl bg-[var(--surface-2)] p-3.5">
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Right answers to promote")}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">
              {ui("How many in a row before a card moves up a stage. One is quick; four makes you prove it.")}
            </p>
            <div className="mt-2.5 flex gap-2">
              {Array.from({ length: MASTERY_TARGET_RANGE.max - MASTERY_TARGET_RANGE.min + 1 }, (_, index) =>
                MASTERY_TARGET_RANGE.min + index).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => patch({ masteryTarget: value })}
                  aria-pressed={set.masteryTarget === value}
                  className={cn(
                    "h-9 flex-1 rounded-xl text-xs font-black transition-colors",
                    set.masteryTarget === value
                      ? "bg-[var(--accent)] text-[var(--accent-text)]"
                      : "bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 rounded-2xl bg-[var(--surface-2)] p-3.5">
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Cards per round")}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">
              {ui("How many a Learn session asks before it stops and shows you where you got to.")}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {ROUND_SIZE_CHOICES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => patch({ roundSize: value })}
                  aria-pressed={set.roundSize === value}
                  className={cn(
                    "h-9 min-w-[3rem] flex-1 rounded-xl text-xs font-black transition-colors",
                    set.roundSize === value
                      ? "bg-[var(--accent)] text-[var(--accent-text)]"
                      : "bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => patch({ demoteOnWrong: !set.demoteOnWrong })}
            aria-pressed={set.demoteOnWrong}
            className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5 text-left transition-colors hover:bg-[var(--surface-3)]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-[var(--text-1)]">{ui("A mistake costs a stage")}</span>
              <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-[var(--text-3)]">
                {ui("On: getting one wrong drops the card back down the ladder. Off: it only resets the streak, so a slip never undoes work.")}
              </span>
            </span>
            <span className={cn(
              "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors",
              set.demoteOnWrong ? "bg-[var(--accent)]" : "bg-[var(--surface-3)]"
            )}>
              <span className={cn(
                "h-5 w-5 rounded-full bg-white transition-transform",
                set.demoteOnWrong && "translate-x-5"
              )} />
            </span>
          </button>

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
