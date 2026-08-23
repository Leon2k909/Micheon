import React, { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Layers,
  Pencil,
  Plus,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Folder as FolderIcon,
  FolderPlus,
  GripVertical,
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
  insertCopyAfterSource,
  loadStudyFolders,
  loadStudyProgress,
  loadStudySets,
  makeFolder,
  makeSet,
  moveStudyItem,
  resetStudyProgress,
  resolvedFolderId,
  saveStudyFolders,
  saveStudySets,
  setIsStudiable,
  studiableCards,
  summariseProgress,
  studyId,
  unfileFolder,
  type StudyFolder,
  type StudySet,
} from "@/lib/studySets";
import { isSetDrag, readSetDrag, startSetDrag } from "@/lib/setDrag";
import { SetEditor } from "@/components/create/SetEditor";
import { SetStudy, type StudyMode } from "@/components/create/SetStudy";

/**
 * The "not in a folder" drop zone, named so it cannot collide with a folder id.
 *
 * Only ever compared against, never stored — the absence of a folderId is what
 * unfiled means on disk.
 */
const UNFILED = "unfiled-zone";

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
  const [folders, setFolders] = useState<StudyFolder[]>(() => loadStudyFolders());
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameTo, setRenameTo] = useState("");
  const [confirmFolder, setConfirmFolder] = useState<string | null>(null);
  /** Which zone the pointer is over mid-drag, so exactly one lights up. */
  const [dropFolder, setDropFolder] = useState<string | null>(null);

  const persist = useCallback((next: StudySet[]) => {
    setSets(next);
    saveStudySets(next);
  }, []);

  const persistFolders = useCallback((next: StudyFolder[]) => {
    setFolders(next);
    saveStudyFolders(next);
  }, []);

  const addFolder = useCallback(() => {
    const folder = makeFolder("Untitled folder", Date.now());
    persistFolders([...folders, folder]);
    // Straight into rename: a folder called "Untitled folder" is not a folder
    // anybody meant to make, and naming it later is a step most people skip.
    setRenaming(folder.id);
    setRenameTo(folder.name);
  }, [folders, persistFolders]);

  const commitRename = useCallback((id: string) => {
    const at = new Date().toISOString();
    persistFolders(folders.map((folder) => (folder.id === id
      ? { ...folder, name: renameTo.trim() || folder.name, updatedAt: at }
      : folder)));
    setRenaming(null);
  }, [folders, persistFolders, renameTo]);

  /**
   * Delete the folder, keep the sets.
   *
   * The sets are written FIRST. Interrupted between the two writes, the worst
   * case is an empty folder that still exists — never a set filed under a
   * folder that no longer does.
   */
  const removeFolder = useCallback((id: string) => {
    const next = unfileFolder(sets, folders, id, Date.now());
    persist(next.sets);
    persistFolders(next.folders);
    setConfirmFolder(null);
  }, [folders, persist, persistFolders, sets]);

  /** File a set into a folder, or out of every folder when given undefined. */
  const fileInto = useCallback((setId: string, folderId: string | undefined) => {
    const at = new Date().toISOString();
    persist(sets.map((entry) => (entry.id === setId
      ? { ...entry, folderId, updatedAt: at }
      : entry)));
  }, [persist, sets]);

  /**
   * Move a set one place within the list it is drawn in.
   *
   * Order is the array's, and a scope is a slice of it, so a move inside a
   * folder has to be translated back into a move within the whole array —
   * otherwise reordering one folder would silently reshuffle the rest.
   */
  const moveWithinScope = useCallback((scope: string | null, at: number, to: number) => {
    const inScope = sets.filter((entry) => (resolvedFolderId(entry, folders) ?? null) === scope);
    if (to < 0 || to >= inScope.length) return;
    const reordered = moveStudyItem(inScope, at, to);
    // Put the reordered slice back into the positions the scope occupied.
    let take = 0;
    persist(sets.map((entry) => ((resolvedFolderId(entry, folders) ?? null) === scope
      ? reordered[take++]
      : entry)));
  }, [folders, persist, sets]);

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
    persist(insertCopyAfterSource(sets, source.id, copy));
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

  /** Everything the search matched that is not inside a folder. */
  const unfiled = useMemo(
    () => filtered.filter((set) => resolvedFolderId(set, folders) === null),
    [filtered, folders]
  );

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

  /**
   * One set's card, defined once and drawn in both places.
   *
   * A folder's contents and the unfiled list are the same card in a
   * different scope, so this is a closure rather than a component: it
   * already sees picked, confirmDelete, setScreen and the rest, and lifting
   * it out would mean threading ten props to move nothing.
   *
   * `scope` is the list this card is being drawn inside — a folder's id, or
   * null for the unfiled list. Reordering happens WITHIN a scope, so the
   * arrows need to know which list they are walking.
   */
  const renderCard = (set: StudySet, scope: string | null, at: number, ofScope: number) => {
          const progress = loadStudyProgress(set.id);
          const summary = summariseProgress(set, progress);
          const ready = setIsStudiable(set);
          return (
            <div
              className={cn(
                "card create-set flex flex-col p-5 transition-shadow",
                picked.has(set.id) && "ring-1 ring-[var(--accent)]"
              )}
              draggable
              key={set.id}
              onDragEnd={() => setDropFolder(null)}
              onDragStart={(event) => startSetDrag(event.dataTransfer, set.id, scope ? "folder" : "unfiled")}
            >
              {/*
                Three ways to move one set, because they are not the same job
                and one of them must not need a pointer. The handle and the
                arrows change its place in this list; the select changes which
                list it is in. Native drag never fires from touch, so the
                arrows and the select — not the handle — are the paths that
                always work, at every width.
              */}
              <div className="create-set__move">
                <GripVertical
                  aria-hidden="true"
                  className="create-set__grip h-3.5 w-3.5"
                />
                <button
                  aria-label={ui("Move up")}
                  className="create-set__nudge"
                  disabled={at === 0}
                  onClick={() => moveWithinScope(scope, at, at - 1)}
                  type="button"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  aria-label={ui("Move down")}
                  className="create-set__nudge"
                  disabled={at >= ofScope - 1}
                  onClick={() => moveWithinScope(scope, at, at + 1)}
                  type="button"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {folders.length > 0 && (
                  <select
                    aria-label={ui("Move to folder")}
                    className="create-set__folder"
                    /*
                      Bound to the RESOLVED folder, never to set.folderId. A set
                      carrying the id of a deleted folder has no matching
                      option, and a select with no matching option shows its
                      first one — which would claim the set is somewhere it is
                      not, and re-file it there on the next change event.
                    */
                    onChange={(event) => fileInto(set.id, event.target.value === "none" ? undefined : event.target.value)}
                    value={resolvedFolderId(set, folders) ?? "none"}
                  >
                    <option value="none">{ui("No folder")}</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                )}
              </div>
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
                  Match behind a menu nobody had a reason to open, so only
                  Practice was visible and the tests were not. They are
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
  };

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
          <div className="flex shrink-0 items-center gap-2">
            {/* Secondary, and only worth offering once there is something to
                file: a folder button on an empty page is a chore before the
                thing it organises exists. */}
            {sets.length > 0 && (
              <button
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                onClick={addFolder}
                type="button"
              >
                <FolderPlus className="h-4 w-4" />
                {ui("New folder")}
              </button>
            )}
            <button type="button" onClick={createSet} className="accent-btn inline-flex h-11 shrink-0 items-center gap-2 px-5 text-sm">
              <Plus className="h-4 w-4" />
              {ui("New set")}
            </button>
          </div>
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

        {/*
          Folders first, then everything unfiled. Grouping walks `filtered`
          rather than `sets`, so a search still searches everything and just
          shows fewer cards under each heading; a folder none of whose sets
          match draws no header at all rather than an empty box.

          With no folders made, none of this layer renders and the page is
          the flat grid it has always been — except for the reorder arrows,
          which are on every card either way, because reordering is half the
          ask and has nothing to do with whether anybody uses folders.
        */}
        {folders.map((folder) => {
          const mine = filtered.filter((set) => resolvedFolderId(set, folders) === folder.id);
          if (query.trim() && mine.length === 0) return null;
          return (
            <section
              className={cn("create-folder", dropFolder === folder.id && "is-drop-target")}
              key={folder.id}
              onDragLeave={() => setDropFolder(null)}
              onDragOver={(event) => {
                if (!isSetDrag(event.dataTransfer)) return;
                event.preventDefault();
                setDropFolder(folder.id);
              }}
              onDrop={(event) => {
                const id = readSetDrag(event.dataTransfer);
                setDropFolder(null);
                if (!id) return;
                event.preventDefault();
                fileInto(id, folder.id);
              }}
            >
              <header className="create-folder__head">
                {renaming === folder.id ? (
                  <form
                    className="create-folder__rename"
                    onSubmit={(event) => { event.preventDefault(); commitRename(folder.id); }}
                  >
                    <input
                      aria-label={ui("Folder name")}
                      autoFocus
                      className="create-folder__input"
                      onChange={(event) => setRenameTo(event.target.value)}
                      onKeyDown={(event) => { if (event.key === "Escape") setRenaming(null); }}
                      value={renameTo}
                    />
                    <button className="create-folder__btn" type="submit">{ui("Save")}</button>
                    <button className="create-folder__btn" onClick={() => setRenaming(null)} type="button">
                      {ui("Cancel")}
                    </button>
                  </form>
                ) : (
                  <>
                    <FolderIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                    <h3 className="create-folder__name">{folder.name}</h3>
                    <span className="create-folder__count">
                      {mine.length} {ui(mine.length === 1 ? "set" : "sets")}
                    </span>
                    <button
                      aria-label={ui("Rename folder")}
                      className="create-folder__btn"
                      onClick={() => { setRenaming(folder.id); setRenameTo(folder.name); }}
                      type="button"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label={ui("Delete folder")}
                      className="create-folder__btn"
                      onClick={() => setConfirmFolder(folder.id)}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </header>

              {confirmFolder === folder.id && (
                <div className="mt-3 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-3.5">
                  <p className="flex items-center gap-2 text-xs font-black text-[var(--danger-text)]">
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                    {ui("Delete this folder? Its sets move to the top level.")}
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <button
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--danger-text)] text-xs font-black text-[var(--surface)] transition-transform hover:brightness-110 active:scale-[0.98]"
                      onClick={() => removeFolder(folder.id)}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {ui("Delete")}
                    </button>
                    <button
                      className="inline-flex h-9 flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-2)]"
                      onClick={() => setConfirmFolder(null)}
                      type="button"
                    >
                      {ui("Keep")}
                    </button>
                  </div>
                </div>
              )}

              {mine.length === 0 ? (
                <p className="create-folder__empty">
                  {ui("Empty. Drag a set here, or use \"Move to folder\" on any card.")}
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {mine.map((set, at) => renderCard(set, folder.id, at, mine.length))}
                </div>
              )}
            </section>
          );
        })}

        {folders.length > 0 && unfiled.length > 0 && (
          <h3 className="create-folder__label">{ui("Not in a folder")}</h3>
        )}
        <section
          className={cn("grid gap-3 sm:grid-cols-2", dropFolder === UNFILED && "create-unfiled--over")}
          onDragLeave={() => setDropFolder(null)}
          onDragOver={(event) => {
            if (!isSetDrag(event.dataTransfer, "folder")) return;
            event.preventDefault();
            setDropFolder(UNFILED);
          }}
          onDrop={(event) => {
            const id = readSetDrag(event.dataTransfer, "folder");
            setDropFolder(null);
            if (!id) return;
            event.preventDefault();
            fileInto(id, undefined);
          }}
        >
          {unfiled.map((set, at) => renderCard(set, null, at, unfiled.length))}
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
