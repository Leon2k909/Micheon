import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleCheck, Download, RefreshCw, TriangleAlert } from "lucide-react";
import {
  normaliseUpdatePercent,
  updatePanelIsUseful,
  updateStatusKey,
  type UpdateState,
  type UpdateStatus,
} from "@/lib/updateStatus";
import { ui, uiIsGerman } from "@/lib/i18n";

// Desktop bridge (electron/preload.cjs). Undefined on the website.
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

function developmentPreview(): UpdateStatus | null {
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  const search = new URLSearchParams(window.location.search);
  const state = search.get("update-preview") as UpdateState | null;
  if (!state || !["downloading", "ready", "error"].includes(state)) return null;
  return {
    state,
    version: search.get("update-version") || "1.2.60",
    currentVersion: "1.2.59",
    checkedAt: Date.now(),
    supported: true,
    percent: state === "ready" ? 100 : Number(search.get("update-percent") || 46),
  };
}

const previewStatus = developmentPreview();

function panelCopy(status: UpdateStatus): string {
  if (status.state === "downloading") {
    return uiIsGerman()
      ? "Du kannst weiterlernen, während Micheon die neue Version vorbereitet."
      : "Keep learning while Micheon gets the new version ready.";
  }
  if (status.state === "ready") {
    const version = status.version ? ` v${status.version}` : "";
    return uiIsGerman()
      ? `Starte Micheon neu, um das Update${version} zu installieren. Sonst wird es beim Schließen der App installiert.`
      : `Restart Micheon to install update${version}. Otherwise it will install when you close the app.`;
  }
  return uiIsGerman()
    ? "Micheon konnte den Update-Dienst nicht erreichen. Es wird später automatisch erneut versucht."
    : "Micheon couldn't reach the update service. It will try again automatically.";
}

function panelTitle(state: UpdateState): string {
  if (state === "downloading") return ui("Downloading update");
  if (state === "ready") return ui("Your update is ready");
  return ui("Update paused");
}

/**
 * The complete branded updater surface. Electron still handles the secure
 * download and installation, while this panel owns every learner-facing state.
 */
export function UpdateBanner() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<UpdateStatus | null>(previewStatus);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const [installing, setInstalling] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (previewStatus || !desktop?.getUpdateStatus) return undefined;
    let live = true;
    desktop.getUpdateStatus()
      .then((next: UpdateStatus) => { if (live) setStatus(next); })
      .catch(() => {});
    const stop = desktop.onUpdateStatus?.((next: UpdateStatus) => {
      setStatus((current) => ({
        ...(current ?? { version: null, checkedAt: null }),
        ...next,
      }));
    });
    return () => {
      live = false;
      stop?.();
    };
  }, []);

  const key = updateStatusKey(status);
  const open = updatePanelIsUseful(status) && dismissedFor !== key;
  const percent = useMemo(
    () => normaliseUpdatePercent(status?.state === "ready" ? 100 : status?.percent),
    [status?.percent, status?.state]
  );

  const retry = async () => {
    if (!desktop?.checkForUpdateNow || retrying) return;
    setRetrying(true);
    setDismissedFor(null);
    try {
      const next = await desktop.checkForUpdateNow();
      setStatus(next);
    } catch {
      setStatus((current) => ({
        ...(current ?? { version: null, checkedAt: null }),
        state: "error",
      }));
    } finally {
      setRetrying(false);
    }
  };

  const Icon = status?.state === "ready"
    ? CircleCheck
    : status?.state === "error"
      ? TriangleAlert
      : Download;

  return (
    <AnimatePresence>
      {open && status && (
        <motion.section
          animate={{ opacity: 1, y: 0, scale: 1 }}
          aria-labelledby="micheon-update-title"
          aria-live="polite"
          className={[
            "fixed bottom-5 right-5 z-[2000] w-[388px] max-w-[calc(100vw-2.5rem)] overflow-hidden",
            "rounded-[22px] border border-[var(--border)] bg-[var(--surface)]",
            "shadow-[0_22px_58px_var(--shadow)]",
          ].join(" ")}
          data-testid="update-panel"
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
          role="region"
          transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="p-5">
            <div className="flex items-start gap-3.5">
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]",
                  status.state === "error"
                    ? "bg-amber-500/12 text-amber-500"
                    : "bg-[var(--accent-dim)] text-[var(--accent)]",
                ].join(" ")}
              >
                <Icon
                  aria-hidden="true"
                  className={status.state === "downloading" ? "h-5 w-5 animate-pulse motion-reduce:animate-none" : "h-5 w-5"}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--accent)]">
                      {ui("Micheon update")}
                    </p>
                    <h2
                      className="mt-1 text-[17px] font-black leading-tight text-[var(--text-1)]"
                      id="micheon-update-title"
                    >
                      {panelTitle(status.state)}
                    </h2>
                  </div>
                  {status.version && (
                    <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-black tabular-nums text-[var(--text-2)]">
                      v{status.version}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs font-semibold leading-[1.55] text-[var(--text-2)]">
                  {panelCopy(status)}
                </p>
              </div>
            </div>

            {status.state === "downloading" && (
              <div className="mt-4" data-testid="update-progress-wrap">
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] font-black text-[var(--text-3)]">
                  <span>{ui("Downloading")}</span>
                  <span className="tabular-nums text-[var(--text-2)]">{percent}%</span>
                </div>
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
                    data-testid="update-progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              {status.state === "ready" && (
                <button
                  className="h-10 flex-1 rounded-xl bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:translate-y-px disabled:opacity-70"
                  disabled={installing}
                  onClick={() => {
                    setInstalling(true);
                    desktop?.installUpdate?.();
                  }}
                  type="button"
                >
                  {installing ? ui("Restarting…") : ui("Restart Micheon")}
                </button>
              )}

              {status.state === "error" && (
                <button
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:translate-y-px disabled:opacity-70"
                  disabled={retrying}
                  onClick={retry}
                  type="button"
                >
                  <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin motion-reduce:animate-none" : ""}`} />
                  {ui("Try again")}
                </button>
              )}

              <button
                className="h-10 rounded-xl px-3.5 text-sm font-bold text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:translate-y-px"
                onClick={() => setDismissedFor(key)}
                type="button"
              >
                {status.state === "downloading" ? ui("Hide") : status.state === "ready" ? ui("Keep learning") : ui("Dismiss")}
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
