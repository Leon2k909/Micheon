import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Upload, X as XIcon, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui, uiFmt } from "@/lib/i18n";
import {
  addCustomEntries,
  createCustomPack,
  deleteCustomPack,
  getCustomPacks,
  parseBulkEntries,
  removeCustomEntry,
  renameCustomPack,
  CUSTOM_CONTENT_EVENT,
  MAX_CUSTOM_ENTRIES,
  type CustomPack,
} from "@/lib/customContent";

/**
 * The CEFR bands, said in words.
 *
 * "B2" means nothing to someone adding their own phrases — it is a standard
 * for grading language ability, not something you would know unless you had
 * met it. The label is what the picker shows; the description is what it is
 * actually asking, in terms of what you can DO at that level. This only
 * decides when the pack gets served, so an honest guess is enough.
 */
// blurb is English and a dictionary key both, so a third language is a
// column in the table rather than a field here.
const LEVELS: { value: string; label: string; blurb: string }[] = [
  {
    value: "A1-A2",
    label: "A1–A2 · Beginner",
    blurb: "Everyday basics: greetings, ordering, simple questions about yourself.",
  },
  {
    value: "B1",
    label: "B1 · Getting by",
    blurb: "Handling ordinary situations alone — appointments, plans, opinions in short.",
  },
  {
    value: "B2",
    label: "B2 · Conversational",
    blurb: "Keeping up with natives on familiar topics, and arguing a point.",
  },
  {
    value: "C1",
    label: "C1 · Advanced",
    blurb: "Fluent and precise, including work, study and abstract subjects.",
  },
  {
    value: "C2",
    label: "C2 · Near-native",
    blurb: "Anything a native handles: idiom, nuance, humour, fast speech.",
  },
];

const BULK_PLACEHOLDER = `Guten Rutsch! = Happy new year!
Der Kühlschrank ist leer, Feierabend, time to knock off
Ich bin gleich zurück — I'll be right back`;

/**
 * The learner's own words and phrases.
 *
 * Everything typed here becomes a pack like any other, so it turns up in
 * Continue learning, in lessons, in search and in tests — there is no separate
 * "my list" that quietly never gets taught.
 */
export function CustomContentEditor() {
  const [open, setOpen] = useState(false);
  const [packs, setPacks] = useState<CustomPack[]>(getCustomPacks);
  const [packId, setPackId] = useState<string>(() => getCustomPacks()[0]?.id ?? "");
  const [de, setDe] = useState("");
  const [en, setEn] = useState("");
  const [note, setNote] = useState("");
  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [newPackName, setNewPackName] = useState("");
  const [newPackLevel, setNewPackLevel] = useState(LEVELS[0].value);
  const [renaming, setRenaming] = useState(false);
  const [renameTo, setRenameTo] = useState("");
  const [status, setStatus] = useState("");

  const refresh = () => setPacks(getCustomPacks());

  useEffect(() => {
    window.addEventListener(CUSTOM_CONTENT_EVENT, refresh);
    return () => window.removeEventListener(CUSTOM_CONTENT_EVENT, refresh);
  }, []);

  // A deleted pack must not leave the form pointing at nothing.
  const activePack = packs.find((pack) => pack.id === packId) ?? packs[0];
  useEffect(() => {
    if (activePack && activePack.id !== packId) setPackId(activePack.id);
  }, [activePack, packId]);

  const preview = useMemo(() => (showBulk ? parseBulkEntries(bulk) : null), [bulk, showBulk]);

  const selectedLevel = LEVELS.find((l) => l.value === newPackLevel) ?? LEVELS[0];
  const say = (english: string) => setStatus(ui(english));

  const addOne = () => {
    if (!de.trim() || !en.trim()) {
      say("Both the German and the English are needed.");
      return;
    }
    const target = activePack ?? createCustomPack("My words");
    const { added, skipped } = addCustomEntries([{ de, en, use: note }], target.id);
    if (added) {
      setDe("");
      setEn("");
      setNote("");
      say("Added — it will come up in Continue learning.");
    } else if (skipped) {
      say("You already have that one.");
    }
    setPackId(target.id);
    refresh();
  };

  const importBulk = () => {
    const parsed = parseBulkEntries(bulk);
    if (!parsed.entries.length) {
      say("Nothing could be read from that.");
      return;
    }
    const target = activePack ?? createCustomPack("My words");
    const { added, skipped } = addCustomEntries(parsed.entries, target.id);
    const bad = parsed.rejected.length;
    setStatus([
      uiFmt("Added {count}.", { count: added }),
      skipped ? uiFmt("{count} already there.", { count: skipped }) : "",
      bad ? uiFmt("{count} line(s) could not be read.", { count: bad }) : "",
    ].filter(Boolean).join(" "));
    if (added) setBulk("");
    setPackId(target.id);
    refresh();
  };

  const addPack = () => {
    const pack = createCustomPack(newPackName || "My words", newPackLevel);
    setNewPackName("");
    setPackId(pack.id);
    refresh();
  };

  const total = packs.reduce((sum, pack) => sum + pack.entries.length, 0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-sm font-black text-white hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        {ui("Add your own words")}
        {total > 0 && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{total}</span>
        )}
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Your own words and phrases")}</h3>
          <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
            {ui("Anything you add here is taught like the rest of the course — it shows up in Continue learning, lessons and tests.")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 rounded-lg p-1.5 text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
          title={ui("Close")}
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {/* ── Which pack ─────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Pack")}</span>
        {packs.length > 0 && !renaming && (
          <>
            <select
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
              onChange={(event) => setPackId(event.target.value)}
              value={activePack?.id ?? ""}
            >
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({pack.entries.length})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rounded-lg p-1.5 text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
              onClick={() => { setRenameTo(activePack?.name ?? ""); setRenaming(true); }}
              title={ui("Rename pack")}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="rounded-lg p-1.5 text-[var(--text-3)] hover:bg-red-500/10 hover:text-red-500"
              onClick={() => {
                if (!activePack) return;
                // Deleting a whole pack throws away work, so it asks first —
                // unlike removing a single entry, which is one click to re-add.
                const ok = window.confirm(
                  uiFmt("Delete “{name}” and its {count} entries?", {
                    name: activePack.name,
                    count: activePack.entries.length,
                  })
                );
                if (!ok) return;
                deleteCustomPack(activePack.id);
                refresh();
              }}
              title={ui("Delete pack")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {renaming && (
          <>
            <input
              autoFocus
              className="h-9 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
              onChange={(event) => setRenameTo(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") { renameCustomPack(activePack!.id, renameTo); setRenaming(false); refresh(); } }}
              value={renameTo}
            />
            <button
              type="button"
              className="rounded-lg p-1.5 text-[var(--accent)] hover:bg-[var(--surface-3)]"
              onClick={() => { if (activePack) renameCustomPack(activePack.id, renameTo); setRenaming(false); refresh(); }}
              title={ui("Save")}
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        <span className="mx-1 h-5 w-px bg-[var(--border)]" />
        <input
          className="h-9 w-40 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => setNewPackName(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") addPack(); }}
          placeholder={ui("New pack name")}
          value={newPackName}
        />
        <select
          className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => setNewPackLevel(event.target.value)}
          title={ui("How hard this pack is, so it is served at the right time.")}
          value={newPackLevel}
        >
          {LEVELS.map((level) => (
            <option key={level.value} value={level.value}>{ui(level.label)}</option>
          ))}
        </select>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-[var(--surface-3)] px-2.5 text-xs font-black text-[var(--text-1)] hover:opacity-90"
          onClick={addPack}
        >
          <Plus className="h-3.5 w-3.5" />
          {ui("New pack")}
        </button>
      </div>

      {/* What the letter you just picked actually means. Shown rather than
          hidden in a tooltip: the whole problem is that nobody knows. */}
      <p className="mt-1.5 text-xs font-semibold leading-relaxed text-[var(--text-3)]">
        <strong className="font-black text-[var(--text-2)]">{ui(selectedLevel.label)}</strong>
        {" — "}
        {ui(selectedLevel.blurb)}
        {" "}
        <span className="opacity-80">
          {ui("This only decides when the pack gets served, so an honest guess is enough.")}
        </span>
      </p>

      {/* ── One at a time ──────────────────────────────────────────────── */}
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input
          className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          lang="de"
          onChange={(event) => setDe(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") addOne(); }}
          placeholder={ui("German")}
          value={de}
        />
        <input
          className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => setEn(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") addOne(); }}
          placeholder={ui("English")}
          value={en}
        />
        <input
          className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") addOne(); }}
          placeholder={ui("Note (optional)")}
          value={note}
        />
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 text-sm font-black text-white hover:opacity-90"
          onClick={addOne}
        >
          <Plus className="h-4 w-4" />
          {ui("Add")}
        </button>
      </div>

      {/* ── Or a whole list at once ────────────────────────────────────── */}
      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-[var(--accent)] hover:underline"
        onClick={() => setShowBulk((value) => !value)}
      >
        <Upload className="h-3.5 w-3.5" />
        {showBulk ? ui("Hide bulk upload") : ui("Upload a whole list")}
      </button>

      {showBulk && (
        <div className="mt-2">
          <textarea
            className="h-32 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs font-semibold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => setBulk(event.target.value)}
            placeholder={BULK_PLACEHOLDER}
            value={bulk}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold text-[var(--text-3)]">
              {ui("One per line: German, then English. Separate them with a tab, a comma, = or a dash.")}
            </p>
            {preview && bulk.trim() && (
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[11px] font-black text-[var(--text-2)]">
                {preview.entries.length} {ui("ready")}
                {preview.rejected.length > 0 && ` · ${preview.rejected.length} ${ui("unreadable")}`}
              </span>
            )}
            <button
              type="button"
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-xs font-black text-white hover:opacity-90 disabled:opacity-40"
              disabled={!preview?.entries.length}
              onClick={importBulk}
            >
              <Upload className="h-3.5 w-3.5" />
              {ui("Import")}
            </button>
          </div>
          {/* Named, not just counted — a silent half-import is worse than a
              refusal, because you only find the gap weeks later. */}
          {preview && preview.rejected.length > 0 && (
            <ul className="mt-2 max-h-24 overflow-y-auto rounded-lg bg-[var(--surface-3)]/50 p-2 text-[11px] font-semibold text-[var(--text-3)]">
              {preview.rejected.slice(0, 8).map((line, index) => (
                <li key={index} className="truncate">· {line.line}</li>
              ))}
              {preview.rejected.length > 8 && (
                <li>{uiFmt("…and {count} more", { count: preview.rejected.length - 8 })}</li>
              )}
            </ul>
          )}
        </div>
      )}

      {status && <p className="mt-3 text-xs font-black text-[var(--accent)]">{status}</p>}

      {/* ── What is in this pack ───────────────────────────────────────── */}
      {activePack && activePack.entries.length > 0 && (
        <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <ul className="divide-y divide-[var(--border)]">
            {activePack.entries.map((entry) => (
              <li key={entry.de} className="flex items-center gap-3 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[var(--text-1)]" lang="de">{entry.de}</p>
                  <p className="truncate text-xs font-semibold text-[var(--text-3)]">{entry.en}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-1.5 text-[var(--text-3)] hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => { removeCustomEntry(activePack.id, entry.de); refresh(); }}
                  title={ui("Remove")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {total >= MAX_CUSTOM_ENTRIES && (
        <p className={cn("mt-2 text-[11px] font-black text-amber-600")}>
          {ui("That is as many as a pack holds.")}
        </p>
      )}
    </div>
  );
}
