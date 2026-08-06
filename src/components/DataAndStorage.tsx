import { useCallback, useEffect, useState } from "react";
import { HardDrive, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import { ui, uiIsGerman } from "@/lib/i18n";
import {
  clearAllData,
  clearDataCategory,
  formatBytes,
  measureDataUsage,
  type DataCategoryId,
  type DataUsage,
} from "@/lib/dataUsage";
import { getAuthUser } from "@/lib/profileStorage";

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

  const refresh = useCallback(() => {
    setUsage(measureDataUsage());
    const bridge = (window as any).germDesktop;
    if (typeof bridge?.getStorageUsage !== "function") return;
    bridge.getStorageUsage().then(setDisk).catch(() => setDisk(null));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const say = (english: string, german: string) => setNote(uiIsGerman() ? german : english);

  const remove = (id: DataCategoryId | "all") => {
    if (arming !== id) { setArming(id); setNote(""); return; }
    const profile = getAuthUser();
    const removed = id === "all" ? clearAllData(profile) : clearDataCategory(id, profile);
    setArming(null);
    refresh();
    say(`Deleted ${removed} ${removed === 1 ? "entry" : "entries"}.`,
        `${removed} ${removed === 1 ? "Eintrag" : "Einträge"} gelöscht.`);
    // Progress feeds most of the app; a reload is cleaner than leaving every
    // screen holding numbers that no longer exist.
    if (id === "all" || id === "progress") window.setTimeout(() => window.location.reload(), 900);
  };

  const clearCache = async () => {
    const bridge = (window as any).germDesktop;
    if (typeof bridge?.clearAppCache !== "function") return;
    setBusy(true);
    const ok = await bridge.clearAppCache().catch(() => false);
    setBusy(false);
    refresh();
    say(ok ? "Cache cleared." : "Could not clear the cache.",
        ok ? "Cache geleert." : "Cache konnte nicht geleert werden.");
  };

  return (
    <div className="mt-5 space-y-4">
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
          {uiIsGerman()
            ? "Zu den Sprachen: Der Deutschkurs ist fest in das Programm eingebaut, nicht separat installiert — es gibt also nichts zu deinstallieren, was Platz sparen würde. Die anderen Sprachen sind noch nicht da; sie belegen keinen Platz."
            : "About languages: the German course is built into the program rather than installed separately, so there is nothing to uninstall that would save you space. The other languages are not here yet, and take up nothing."}
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
                      {uiIsGerman() ? row.labelDe : row.label}
                      {row.irreplaceable && (
                        <AlertTriangle aria-label={ui("Cannot be recovered")} className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                      {uiIsGerman() ? row.detailDe : row.detail}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-black text-[var(--text-2)]">{formatBytes(row.bytes)}</span>
                    <button
                      className={arming === row.id
                        ? "rounded-full bg-[var(--red-bg,#3a2026)] px-3 py-1.5 text-xs font-black text-[var(--red-text,#ff8a9b)]"
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
              {uiIsGerman()
                ? "Alles oben, für dieses Konto auf diesem Gerät. Dein Konto bleibt bestehen, andere Profile auf diesem Rechner bleiben unberührt. Das lässt sich nicht rückgängig machen."
                : "Everything above, for this account on this device. Your account stays, and other profiles on this computer are untouched. This cannot be undone."}
            </p>
          </div>
          <button
            className={arming === "all"
              ? "inline-flex items-center gap-2 rounded-full bg-[var(--red-bg,#3a2026)] px-4 py-2.5 text-sm font-black text-[var(--red-text,#ff8a9b)]"
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
