import { useEffect, useState } from "react";
import { ArrowUpCircle, Check, Download, RefreshCw, TriangleAlert } from "lucide-react";
import { ui } from "@/lib/i18n";
import { normaliseUpdatePercent, requestUpdateInstall, type UpdateStatus } from "@/lib/updateStatus";

const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

/**
 * What version you are on, and whether an update is waiting.
 *
 * Updates download in the background and install when the app closes, which is
 * the right behaviour and completely invisible. The only signal was a toast
 * fired once when a download finished — miss it and there was no way to tell
 * whether the app had ever checked, let alone what it found. This is the answer
 * to "I don't think it's updating", which is a fair thing to think when nothing
 * on screen ever mentions it.
 */
export function UpdateStatusCard() {
  const [status, setStatus] = useState<UpdateStatus | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!desktop?.getUpdateStatus) return undefined;
    let live = true;
    desktop.getUpdateStatus().then((s: UpdateStatus) => { if (live) setStatus(s); }).catch(() => {});
    const stop = desktop.onUpdateStatus?.((s: UpdateStatus) => {
      setStatus((current) => ({ ...(current ?? {}), ...s }));
    });
    return () => { live = false; stop?.(); };
  }, []);

  // The website has no updater at all, so there is nothing honest to show.
  if (!desktop?.getUpdateStatus) return null;

  const state = status?.state ?? "idle";
  const ready = state === "ready";
  const percent = normaliseUpdatePercent(status?.percent);

  const mode = status?.updateMode ?? "auto";
  const snoozedUntil = Number(status?.snoozedUntil) || 0;
  const noticesHidden = status?.noticesHidden === true;

  const savePreferences = async (preferences: Record<string, unknown>) => {
    if (!desktop?.setUpdatePreferences) return;
    try {
      setStatus(await desktop.setUpdatePreferences(preferences));
    } catch {
      /* the panel keeps showing the last known state rather than blanking */
    }
  };

  const check = async () => {
    setBusy(true);
    try {
      const next = await desktop.checkForUpdateNow();
      setStatus(next);
    } catch {
      setStatus((current) => ({ ...(current ?? { version: null, checkedAt: null }), state: "error" }));
    } finally {
      setBusy(false);
    }
  };

  const line = () => {
    switch (state) {
      case "checking": return ui("Checking…");
      case "downloading": return `${ui("Downloading the update…")} ${percent}%`;
      case "ready": return ui("Update ready. It installs when you close the app.");
      case "current": return ui("You're on the latest version.");
      // "Unreachable" almost always means a new version is being published at
      // this exact moment: the check lands in the minute where the release's
      // files are still uploading, fails once, and the retry finds the new
      // version. Leon watched this happen on every release day. Saying
      // "couldn't reach the service" for that reads as something being broken
      // when the truth is the opposite — so the two causes get their own
      // lines, split on the only signal the renderer has.
      case "error": return typeof navigator !== "undefined" && navigator.onLine === false
        ? ui("You're offline. Updates resume when you're back on the internet.")
        : ui("The update service didn't answer — usually that means a new version is being published right now. Micheon retries in a moment.");
      case "unsupported": return ui("Updates only apply to the installed app.");
      default: return ui("Checks on start and every fifteen minutes.");
    }
  };

  const Icon = state === "downloading" ? Download
    : state === "checking" || busy ? RefreshCw
      : ready ? ArrowUpCircle
        : state === "error" ? TriangleAlert
          : Check;

  return (
    <div className="mt-5 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-[var(--text-1)]">{ui("Updates")}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold leading-5 text-[var(--text-3)]">
            <Icon
              aria-hidden="true"
              className={[
                "h-3.5 w-3.5 shrink-0",
                (state === "checking" || busy) ? "animate-pulse motion-reduce:animate-none" : "",
                ready ? "text-[var(--accent)]" : state === "error" ? "text-amber-600" : "",
              ].join(" ")}
            />
            {line()}
          </p>
        </div>
        {status?.currentVersion && (
          <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black tabular-nums text-[var(--text-2)]">
            v{status.currentVersion}
          </span>
        )}
      </div>

      {state === "downloading" && (
        <div className="mt-3">
          <div
            aria-label={ui("Update download progress")}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={percent}
            className="h-2 overflow-hidden rounded-full bg-[var(--surface-3)]"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-1)] transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={busy || state === "checking" || state === "downloading"}
          onClick={check}
          type="button"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-pulse motion-reduce:animate-none" : ""}`} />
          {ui("Check for updates")}
        </button>

        {/* Only offered when there is genuinely something to restart into. */}
        {ready && (
          <button
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-xs font-black text-[var(--accent-text)] transition-opacity hover:opacity-90"
            onClick={() => requestUpdateInstall()}
            type="button"
          >
            <ArrowUpCircle className="h-3.5 w-3.5" />
            {ui("Restart now")}
            {status?.version ? ` (${status.version})` : ""}
          </button>
        )}
      </div>

        {/* How updates should arrive. "auto" is the default and stays the
            default; the others exist for a metered connection, or for someone
            who would rather not be interrupted mid-lesson. */}
        <div className="update-prefs">
          <p className="update-prefs__label">{ui("How updates arrive")}</p>
          <div aria-label={ui("How updates arrive")} className="update-prefs__modes" role="radiogroup">
            {([
              ["auto", "Automatic", "Download and install on quit"],
              ["ask", "Ask first", "Check, then wait for you"],
              ["manual", "Only when I ask", "No background checks"],
            ] as const).map(([value, label, note]) => (
              <button
                aria-checked={mode === value}
                className={mode === value ? "is-active" : ""}
                key={value}
                onClick={() => savePreferences({ updateMode: value })}
                role="radio"
                type="button"
              >
                <strong>{ui(label)}</strong>
                <small>{ui(note)}</small>
              </button>
            ))}
          </div>

          <div className="update-prefs__row">
            {snoozedUntil > 0 ? (
              <>
                <span className="update-prefs__snoozed">
                  {ui("Postponed until")} {new Date(snoozedUntil).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
                <button
                  className="update-prefs__link"
                  onClick={() => savePreferences({ snoozeHours: 0 })}
                  type="button"
                >
                  {ui("Resume updates")}
                </button>
              </>
            ) : (
              <>
                <span className="update-prefs__label">{ui("Postpone for")}</span>
                {([["1 hour", 1], ["Today", 8], ["A week", 168]] as const).map(([label, hours]) => (
                  <button
                    className="update-prefs__chip"
                    key={label}
                    onClick={() => savePreferences({ snoozeHours: hours })}
                    type="button"
                  >
                    {ui(label)}
                  </button>
                ))}
              </>
            )}
          </div>

          <label className="update-prefs__toggle">
            <input
              checked={noticesHidden}
              onChange={(event) => savePreferences({ noticesHidden: event.target.checked })}
              type="checkbox"
            />
            <span>
              <strong>{ui("Hide update notices")}</strong>
              <small>{ui("Updates still install. This panel and the ready banner stay out of the way.")}</small>
            </span>
          </label>
        </div>
    </div>
  );
}
