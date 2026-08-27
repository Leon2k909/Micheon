import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, Download, HardDrive, RefreshCw, Trash2, Upload } from "lucide-react";
import { availablePacks, removePack } from "@/lib/contentPacks";
import { ui, uiFmt } from "@/lib/i18n";
import {
  clearAllData,
  clearDataCategory,
  formatBytes,
  measureDataUsage,
  type DataCategoryId,
  type DataUsage,
} from "@/lib/dataUsage";
import {
  applyDataImport,
  assertDataImportMatchesProfile,
  collectDataExport,
  MAX_DATA_EXPORT_BYTES,
  parseDataExport,
  serializeDataExport,
} from "@/lib/dataTransfer";
import { getAuthUser } from "@/lib/profileStorage";
import { collectPortablePetBundles, importPortablePetBundles } from "@/lib/petTransfer";

type DiskUsage = {
  installBytes: number;
  installComplete: boolean;
  cacheBytes: number;
  savedBytes: number;
  version: string;
};

/**
 * What Micheon is keeping, and how to get rid of it.
 *
 * Deleting learning progress is not undoable, so nothing here fires on one
 * click: a destructive button arms first and says exactly what will go. The
 * disk figures are split into the part you can do something about and the part
 * you cannot — the German course is compiled into the program, so pretending
 * it is an uninstallable "language pack" would be a lie with a button on it.
 */
export function DataAndStorage() {
  const [usage, setUsage] = useState<DataUsage>(() => measureDataUsage());
  const [disk, setDisk] = useState<DiskUsage | null>(null);
  const [arming, setArming] = useState<DataCategoryId | "all" | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [transferBusy, setTransferBusy] = useState<"export" | "import" | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  /**
   * The languages this device has downloaded.
   *
   * A language arrives by opening its course — nobody is asked to install
   * anything — but what arrives can be given back, which is the whole reason
   * the tables are packs rather than part of the app. A chunk, once
   * downloaded, is the browser's to keep.
   */
  const [languages, setLanguages] = useState<Array<{ id: string; name: string; url: string; bytes: number }>>([]);

  const refresh = useCallback(() => {
    setUsage(measureDataUsage());
    void availablePacks()
      .then(({ languages: all, installed }) => {
        setLanguages(all.filter((pack) => installed.some((entry) => entry.endsWith(pack.url))));
      })
      // No manifest means the build emitted no packs, which is a real state:
      // the app runs on its bundled content and there is nothing to remove.
      .catch(() => setLanguages([]));
    const bridge = (window as any).germDesktop;
    if (typeof bridge?.getStorageUsage !== "function") return;
    bridge.getStorageUsage().then(setDisk).catch(() => setDisk(null));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // One argument now: the English is the key, and the dictionary answers for
  // every other language rather than the call site carrying one of each.
  const say = (english: string) => setNote(ui(english));

  const remove = (id: DataCategoryId | "all") => {
    if (arming !== id) { setArming(id); setNote(""); return; }
    const profile = getAuthUser();
    const removed = id === "all" ? clearAllData(profile) : clearDataCategory(id, profile);
    setArming(null);
    refresh();
    setNote(removed === 1
      ? uiFmt("Deleted {count} entry.", { count: removed })
      : uiFmt("Deleted {count} entries.", { count: removed }));
    // Progress feeds most of the app; a reload is cleaner than leaving every
    // screen holding numbers that no longer exist.
    if (id === "all" || id === "progress") window.setTimeout(() => window.location.reload(), 900);
  };

  /**
   * Give a language back.
   *
   * Armed like every other delete on this screen: one press asks, the second
   * does it. Nothing is lost that cannot return — opening the course fetches
   * it again — but it is still a download the learner chose to be rid of, and
   * a stray click should not undo that decision either way.
   */
  const removeLanguage = async (pack: { id: string; name: string; url: string }) => {
    if (arming !== `lang:${pack.id}`) { setArming(`lang:${pack.id}` as never); setNote(""); return; }
    setArming(null);
    setBusy(true);
    const gone = await removePack(pack.url).catch(() => false);
    setBusy(false);
    refresh();
    setNote(gone
      ? uiFmt("{name} removed. Opening the course downloads it again.", { name: ui(pack.name) })
      : uiFmt("Could not remove {name}.", { name: ui(pack.name) }));
  };

  const clearCache = async () => {
    const bridge = (window as any).germDesktop;
    if (typeof bridge?.clearAppCache !== "function") return;
    setBusy(true);
    const ok = await bridge.clearAppCache().catch(() => false);
    setBusy(false);
    refresh();
    say(ok ? "Cache cleared." : "Could not clear the cache.");
  };

  const exportData = async () => {
    setTransferBusy("export");
    try {
      const archive = collectDataExport(getAuthUser());
      const pets = await collectPortablePetBundles();
      const content = serializeDataExport({ ...archive, pets });
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `micheon-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      say("Data exported. Keep this file somewhere safe.");
    } catch {
      say("Could not export your data.");
    } finally {
      setTransferBusy(null);
    }
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setTransferBusy("import");
    try {
      if (file.size > MAX_DATA_EXPORT_BYTES) throw new Error("The selected file is too large.");
      const archive = assertDataImportMatchesProfile(parseDataExport(await file.text()), getAuthUser());
      const confirmed = window.confirm(ui("Import replaces this profile's saved data. Shared preferences and custom words also apply to this computer's local app. Other profiles are untouched. Continue?"));
      if (!confirmed) return;
      await applyDataImport(archive, getAuthUser());
      await importPortablePetBundles(archive.pets);
      say("Data imported. Micheon will reload now.");
      window.setTimeout(() => window.location.reload(), 650);
    } catch {
      say("Could not import that file. Choose a Micheon data export for this profile.");
    } finally {
      setTransferBusy(null);
    }
  };

  return (
    <div className="mt-5 space-y-4">
      {/* ── languages this device has downloaded ────────────────────────── */}
      {languages.length > 0 && (
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm font-black text-[var(--text-1)]">{ui("Downloaded languages")}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("A language downloads itself when you open its course. Remove one to get the space back — opening the course again brings it straight back.")}
          </p>
          <div className="mt-3 space-y-2">
            {languages.map((pack) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5"
                key={pack.id}
              >
                <span className="min-w-0">
                  <strong className="block text-sm font-black text-[var(--text-1)]">{ui(pack.name)}</strong>
                  <small className="block text-xs font-semibold text-[var(--text-3)]">{formatBytes(pack.bytes)}</small>
                </span>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-3)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] hover:opacity-90 disabled:opacity-60"
                  disabled={busy}
                  onClick={() => { void removeLanguage(pack); }}
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {arming === `lang:${pack.id}` ? ui("Tap again to remove") : ui("Remove")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── on disk ─────────────────────────────────────────────────────── */}
      <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-[var(--text-1)]">{ui("Space on this computer")}</p>
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-3)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] hover:opacity-90"
            onClick={refresh}
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {ui("Recheck")}
          </button>
        </div>
        {disk ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Figure
              label={ui("Micheon and the course")}
              value={formatBytes(disk.installBytes) + (disk.installComplete ? "" : "+")}
              note={ui("The program itself. Cannot be removed from in here.")}
            />
            <Figure label={ui("Your saved data")} value={formatBytes(disk.savedBytes)} note={ui("Progress, settings, and your own words.")} />
            <Figure
              label={ui("Cache")}
              value={formatBytes(disk.cacheBytes)}
              note={ui("Temporary files. Safe to clear.")}
              action={disk.cacheBytes > 0
                ? { label: busy ? ui("Clearing…") : ui("Clear cache"), onClick: clearCache, disabled: busy }
                : undefined}
            />
          </div>
        ) : (
          <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Disk figures are only available in the desktop app.")}
          </p>
        )}
        <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
          {ui("About languages: the German course is built into the program rather than installed separately, so there is nothing to uninstall that would save you space. The other languages are not here yet, and take up nothing.")}
        </p>
      </div>

      {/* ── move to another computer ───────────────────────────────────── */}
      <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Move your Micheon data")}</p>
            <p className="mt-1 max-w-2xl text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("Take your progress, settings, custom words, mastery and installed pets to another computer with a private JSON file.")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-3)] px-3 py-2 text-xs font-black text-[var(--text-1)] hover:opacity-90 disabled:opacity-50"
              disabled={transferBusy !== null}
              onClick={exportData}
              type="button"
            >
              <Download className="h-3.5 w-3.5" />
              {transferBusy === "export" ? ui("Exporting…") : ui("Export data")}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-black text-white hover:opacity-90 disabled:opacity-50"
              disabled={transferBusy !== null}
              onClick={() => importInputRef.current?.click()}
              type="button"
            >
              <Upload className="h-3.5 w-3.5" />
              {transferBusy === "import" ? ui("Importing…") : ui("Import data")}
            </button>
            <input
              accept="application/json,.json"
              className="hidden"
              onChange={importData}
              ref={importInputRef}
              type="file"
            />
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
          {ui("Import replaces this profile's saved data. Shared preferences and custom words also apply to this computer's local app. Other profiles are untouched.")}
        </p>
      </div>

      {/* ── your data ───────────────────────────────────────────────────── */}
      <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-[var(--text-1)]">{ui("What Micheon is storing for you")}</p>
          <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
            {formatBytes(usage.totalBytes)}
          </span>
        </div>

        {usage.categories.length === 0 ? (
          <p className="mt-3 text-xs font-semibold text-[var(--text-3)]">{ui("Nothing stored yet.")}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {usage.categories.map((row) => (
              <div className="rounded-[14px] bg-[var(--surface-2)] p-3" key={row.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-black text-[var(--text-1)]">
                      {ui(row.label)}
                      {row.irreplaceable && (
                        <AlertTriangle aria-label={ui("Cannot be recovered")} className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                      {ui(row.detail)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-black text-[var(--text-2)]">{formatBytes(row.bytes)}</span>
                    <button
                      className={arming === row.id
                        ? "rounded-full bg-[var(--red-bg)] px-3 py-1.5 text-xs font-black text-[var(--red-text)]"
                        : "rounded-full bg-[var(--surface-3)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] hover:opacity-90"}
                      onClick={() => remove(row.id)}
                      type="button"
                    >
                      {arming === row.id ? ui("Tap again to delete") : ui("Delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Delete all my data")}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("Everything above, for this account on this device. Your account stays, and other profiles on this computer are untouched. This cannot be undone.")}
            </p>
          </div>
          <button
            className={arming === "all"
              ? "inline-flex items-center gap-2 rounded-full bg-[var(--red-bg)] px-4 py-2.5 text-sm font-black text-[var(--red-text)]"
              : "inline-flex items-center gap-2 rounded-full bg-[var(--surface-3)] px-4 py-2.5 text-sm font-black text-[var(--text-1)] hover:opacity-90"}
            onClick={() => remove("all")}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            {arming === "all" ? ui("Tap again to delete everything") : ui("Delete everything")}
          </button>
        </div>

        {arming && (
          <button
            className="mt-2 text-xs font-black text-[var(--text-3)] underline underline-offset-2"
            onClick={() => setArming(null)}
            type="button"
          >
            {ui("Cancel")}
          </button>
        )}
        {note && <p className="mt-2 text-xs font-black text-[var(--accent)]">{note}</p>}
      </div>
    </div>
  );
}

function Figure({
  action,
  label,
  note,
  value,
}: {
  action?: { label: string; onClick: () => void; disabled?: boolean };
  label: string;
  note: string;
  value: string;
}) {
  return (
    <div className="rounded-[14px] bg-[var(--surface-2)] p-3">
      <p className="text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{label}</p>
      <p className="mt-1 text-lg font-black text-[var(--text-1)]">{value}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{note}</p>
      {action && (
        <button
          className="mt-2 rounded-full bg-[var(--surface-3)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] hover:opacity-90 disabled:opacity-50"
          disabled={action.disabled}
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export const DATA_STORAGE_ICON = HardDrive;
