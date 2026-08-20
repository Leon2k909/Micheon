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
  Target,
  Timer,
  Trash2,
  Trophy,
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
import { SetStudy, type StudyMode } from "@/components/create/SetStudy";

type Screen =
  | { name: "list" }
  | { name: "edit"; setId: string }
  | { name: "study"; setId: string; mode?: StudyMode };

/**
 * The four ways to study a set, on the set itself.
 *
 * Learn first and in the accent colour, because it is the only one that moves
 * your progress; the other three are chosen for a reason and should not be
 * dressed as the default.
 */
const STUDY_LAUNCHERS: {
  mode: StudyMode;
  label: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}[] = [
  { mode: "learn", label: "Learn", blurb: "Walks each card up the stages you set. The one that tracks progress.", icon: Target, primary: true },
  { mode: "flashcards", label: "Cards", blurb: "Flip through at your own pace. Nothing is graded.", icon: Layers },
  { mode: "test", label: "Test", blurb: "Answer the whole set, then see a score and every correction.", icon: Trophy },
  { mode: "match", label: "Match", blurb: "Pair terms against definitions, against the clock.", icon: Timer },
];

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
        // Picked on the card, so the mode menu is skipped rather than shown
        // and immediately dismissed. Back still lands on it.
        initialMode={screen.mode}
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

                {/*
                  Every way to study, on the card.
                  A single "Practice" button hid Flashcards, Learn, Test and
                  Match behind a menu nobody had a reason to open — Leon: "i
                  only see practice button, not tests like quizlet". They are
                  four different intentions, so they are four buttons, and
                  Learn leads because it is the one that moves progress.
                */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STUDY_LAUNCHERS.map((launcher) => (
                    <button
                      key={launcher.mode}
                      type="button"
                      disabled={!ready}
                      title={ui(launcher.blurb)}
                      onClick={() => setScreen({ name: "study", setId: set.id, mode: launcher.mode })}
                      className={cn(
                        "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition-colors",
                        !ready && "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-3)]",
                        ready && launcher.primary && "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110",
                        ready && !launcher.primary
                          && "bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)]"
                      )}
                    >
                      <launcher.icon className="h-3.5 w-3.5" />
                      {ui(launcher.label)}
                    </button>
                  ))}
                </div>

                {/*
                  And the three that were icons alone: "it should be more
                  clear what these buttons do". A pencil, two squares and a
                  bin are a guessing game, so they say what they are.
                */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScreen({ name: "edit", setId: set.id })}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--surface-2)] text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {ui("Edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateSet(set)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--surface-2)] text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {ui("Duplicate")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(set.id)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--surface-2)] text-xs font-black text-[var(--text-3)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {ui("Delete")}
                  </button>
                </div>

                {/*
                  Deleting takes the progress with it, so it asks first — and
                  the asking has to look like a choice. It rendered as two
                  lines of bare text on a panel the same colour as the card,
                  because --danger-bg and --danger-text were never defined in
                  any theme; they are now, beside the --success pair they were
                  written to match.
                */}
                {confirmDelete === set.id && (
                  <div className="mt-3 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-3.5">
                    <p className="flex items-center gap-2 text-xs font-black text-[var(--danger-text)]">
                      <Trash2 className="h-3.5 w-3.5 shrink-0" />
                      {ui("Delete this set and its progress?")}
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => deleteSet(set.id)}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--danger-text)] text-xs font-black text-[var(--surface)] transition-transform hover:brightness-110 active:scale-[0.98]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {ui("Delete")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-2)]"
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
