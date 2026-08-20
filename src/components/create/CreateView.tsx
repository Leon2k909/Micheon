import React, { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Layers,
  Pencil,
  Plus,
  CheckSquare,
  Search,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  loadStudyProgress,
  loadStudySets,
  makeSet,
  resetStudyProgress,
  saveStudySets,
  setIsStudiable,
  studiableCards,
  summariseProgress,
  studyId,
  type StudySet,
} from "@/lib/studySets";
import { SetEditor } from "@/components/create/SetEditor";
import { SetStudy } from "@/components/create/SetStudy";

type Screen =
  | { name: "list" }
  | { name: "edit"; setId: string }
  | { name: "study"; setId: string };

/**
 * Create — your own sets, studied with our engine.
 *
 * The rest of Micheon teaches a course somebody else wrote. This is the part
 * where you write it: a set is a title and a list of two-sided cards, and the
 * study modes are different ways of walking that list. Quizlet's shape,
 * because it is the one people already know and do not need explaining.
 *
 * The thing that makes it worth having inside this app rather than beside it
 * is the catalogue import — 23,000 words and phrases we already hold, with
 * their genders, glosses and usage notes, one search away. Typing out
 * vocabulary you already own would be the whole cost of using it.
 */
export function CreateView({ apiParts }: { apiParts?: Record<string, unknown> }) {
  const [sets, setSets] = useState<StudySet[]>(() => loadStudySets());
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  // Selecting sets, for when several want deleting at once.
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const persist = useCallback((next: StudySet[]) => {
    setSets(next);
    saveStudySets(next);
  }, []);

  const updateSet = useCallback((updated: StudySet) => {
    setSets((current) => {
      const next = current.map((entry) => (entry.id === updated.id ? updated : entry));
      saveStudySets(next);
      return next;
    });
  }, []);

  const createSet = useCallback(() => {
    const now = Date.now();
    const created = makeSet("Untitled set", now);
    persist([created, ...sets]);
    setScreen({ name: "edit", setId: created.id });
  }, [persist, sets]);

  const duplicateSet = useCallback((source: StudySet) => {
    const now = Date.now();
    const at = new Date(now).toISOString();
    const copy: StudySet = {
      ...source,
      id: studyId("set", now),
      title: `${source.title} (copy)`,
      createdAt: at,
      updatedAt: at,
      // New ids, or the copy would share progress with the original.
      cards: source.cards.map((card, index) => ({ ...card, id: studyId(`card${index}`, now) })),
    };
    persist([copy, ...sets]);
  }, [persist, sets]);

  const deleteSet = useCallback((id: string) => {
    resetStudyProgress(id);
    persist(sets.filter((entry) => entry.id !== id));
    setConfirmDelete(null);
  }, [persist, sets]);

  const togglePicked = useCallback((id: string) => {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const deletePicked = useCallback(() => {
    picked.forEach((id) => resetStudyProgress(id));
    persist(sets.filter((entry) => !picked.has(entry.id)));
    setPicked(new Set());
  }, [persist, picked, sets]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return sets;
    return sets.filter((set) =>
      [set.title, set.description, ...set.cards.slice(0, 40).map((card) => `${card.term} ${card.definition}`)]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle)
    );
  }, [sets, query]);

  const active = screen.name === "list" ? null : sets.find((entry) => entry.id === screen.setId);

  if (screen.name === "edit" && active) {
    return (
      <SetEditor
        set={active}
        onBack={() => setScreen({ name: "list" })}
        onChange={updateSet}
        onStudy={() => setScreen({ name: "study", setId: active.id })}
        apiParts={apiParts}
      />
    );
  }

  if (screen.name === "study" && active) {
    return (
      <SetStudy
        set={active}
        onBack={() => setScreen({ name: "list" })}
        onEdit={() => setScreen({ name: "edit", setId: active.id })}
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Create")}</h2>
            <p className="mt-1 max-w-lg text-sm font-semibold leading-6 text-[var(--text-3)]">
              {ui("Your own flashcards, studied with the same engine as the course. Type them, paste them, or pull them straight from our catalogue.")}
            </p>
          </div>
          <button type="button" onClick={createSet} className="accent-btn inline-flex h-11 shrink-0 items-center gap-2 px-5 text-sm">
            <Plus className="h-4 w-4" />
            {ui("New set")}
          </button>
        </div>

        {sets.length > 3 && (
          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui("Search your sets")}
              className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-4 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
              type="search"
            />
          </label>
        )}
      </section>

      {filtered.length === 0 ? (
        <section className="card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-black text-[var(--text-1)]">
            {sets.length === 0 ? ui("No sets yet") : ui("Nothing matches that")}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-[var(--text-3)]">
            {sets.length === 0
              ? ui("Make a set for whatever keeps slipping — irregular verbs, words from a conversation, anything. You can pull cards from the catalogue instead of typing them.")
              : ui("Try a different word, or clear the search.")}
          </p>
          {sets.length === 0 && (
            <button type="button" onClick={createSet} className="accent-btn mt-5 inline-flex h-11 items-center gap-2 px-5 text-sm">
              <Plus className="h-4 w-4" />
              {ui("Make your first set")}
            </button>
          )}
        </section>
      ) : (
        <>
        {filtered.length > 1 && (
          <section className="card flex flex-wrap items-center gap-2 p-4">
            <button
              type="button"
              onClick={() => setPicked(
                picked.size === filtered.length ? new Set() : new Set(filtered.map((entry) => entry.id))
              )}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
            >
              {picked.size === filtered.length
                ? <CheckSquare className="h-3.5 w-3.5" />
                : <Square className="h-3.5 w-3.5" />}
              {ui(picked.size === filtered.length ? "Select none" : "Select all")}
            </button>
            {picked.size > 0 && (
              <>
                <span className="text-xs font-black text-[var(--accent)]">
                  {picked.size} {ui("selected")}
                </span>
                <button
                  type="button"
                  onClick={deletePicked}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--danger-bg)] px-3 text-xs font-black text-[var(--danger-text)] transition-colors hover:brightness-110"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {ui("Delete")} {picked.size} {ui("sets and their progress")}
                </button>
              </>
            )}
          </section>
        )}

        <section className="grid gap-3 sm:grid-cols-2">
          {filtered.map((set) => {
            const progress = loadStudyProgress(set.id);
            const summary = summariseProgress(set, progress);
            const ready = setIsStudiable(set);
            return (
              <div
                key={set.id}
                className={cn(
                  "card flex flex-col p-5 transition-shadow",
                  picked.has(set.id) && "ring-1 ring-[var(--accent)]"
                )}
              >
                {filtered.length > 1 && (
                  <button
                    type="button"
                    onClick={() => togglePicked(set.id)}
                    aria-pressed={picked.has(set.id)}
                    aria-label={ui("Select set")}
                    className="mb-2 self-start"
                  >
                    {picked.has(set.id)
                      ? <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
                      : <Square className="h-4 w-4 text-[var(--text-3)] opacity-50" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (ready ? setScreen({ name: "study", setId: set.id }) : setScreen({ name: "edit", setId: set.id }))}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-base font-black text-[var(--text-1)]">{set.title}</p>
                  <p className="mt-1 text-xs font-bold text-[var(--text-3)]">
                    {studiableCards(set).length} {ui("cards")}
                    {set.description ? ` · ${set.description}` : ""}
                  </p>

                  {summary.total > 0 && (
                    <div className="mt-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-all"
                          style={{ width: `${summary.percent}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] font-bold text-[var(--text-3)]">
                        {summary.mastered} {ui("mastered")} · {summary.learning} {ui("learning")} · {summary.untouched} {ui("new")}
                      </p>
                    </div>
                  )}
                </button>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!ready}
                    onClick={() => setScreen({ name: "study", setId: set.id })}
                    className={cn(
                      "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition-colors",
                      ready
                        ? "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110"
                        : "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-3)]"
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {ui("Practice")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreen({ name: "edit", setId: set.id })}
                    aria-label={ui("Edit set")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateSet(set)}
                    aria-label={ui("Duplicate set")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(set.id)}
                    aria-label={ui("Delete set")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-3)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Deleting takes the progress with it, so it asks first. */}
                {confirmDelete === set.id && (
                  <div className="mt-3 rounded-2xl bg-[var(--danger-bg)] p-3.5">
                    <p className="text-xs font-black text-[var(--danger-text)]">
                      {ui("Delete this set and its progress?")}
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => deleteSet(set.id)}
                        className="h-8 flex-1 rounded-lg bg-[var(--danger-text)] text-xs font-black text-white"
                      >
                        {ui("Delete")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="h-8 flex-1 rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--text-2)]"
                      >
                        {ui("Keep")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
        </>
      )}

      {sets.length > 0 && (
        <section className="card flex items-start gap-3 p-5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <p className="text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Tip: in the editor, \"From catalogue\" searches every word and phrase the app already knows — genders, glosses and usage notes come with them, so you rarely have to type a card yourself.")}
          </p>
        </section>
      )}
    </div>
  );
}
