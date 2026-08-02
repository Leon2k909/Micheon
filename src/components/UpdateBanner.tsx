import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleCheck, Download, Power, RefreshCw, TriangleAlert } from "lucide-react";
import {
  normaliseUpdatePercent,
  UPDATE_INSTALL_REQUEST_EVENT,
  updatePanelIsUseful,
  updateStatusKey,
  type UpdateState,
  type UpdateStatus,
} from "@/lib/updateStatus";
import { ui, uiIsGerman } from "@/lib/i18n";
import { MicheonLogo } from "@/components/MicheonLogo";

// Desktop bridge (electron/preload.cjs). Undefined on the website.
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

function developmentPreview(): UpdateStatus | null {
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  const search = new URLSearchParams(window.location.search);
  const requestedState = search.get("update-preview");
  const state = (requestedState === "installing" ? "ready" : requestedState) as UpdateState | null;
  if (!state || !["downloading", "ready", "error"].includes(state)) return null;
  return {
    state,
    version: search.get("update-version") || "1.2.66",
    currentVersion: "1.2.65",
    checkedAt: Date.now(),
    supported: true,
    percent: state === "ready" ? 100 : Number(search.get("update-percent") || 46),
  };
}

const previewStatus = developmentPreview();
const previewInstalling = import.meta.env.DEV
  && typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("update-preview") === "installing";

function panelCopy(status: UpdateStatus): string {
  if (status.state === "downloading") {
    return uiIsGerman()
      ? "Lerne weiter, während Micheon die neue Version vorbereitet."
      : "Keep learning while Micheon prepares the new version.";
  }
  if (status.state === "ready") {
    const version = status.version ? ` v${status.version}` : "";
    return uiIsGerman()
      ? `Starte Micheon neu, um das Update${version} zu installieren. Du kannst auch weiterlernen.`
      : `Restart Micheon to install update${version}. You can also keep learning.`;
  }
  return uiIsGerman()
    ? "Micheon konnte den Update-Dienst nicht erreichen. Wir versuchen es automatisch erneut."
    : "Micheon couldn't reach the update service. We'll try again automatically.";
}

function panelTitle(state: UpdateState): string {
  if (state === "downloading") return ui("Downloading update");
  if (state === "ready") return ui("Your update is ready");
  return ui("Couldn't check for updates");
}

function UpdateInstallTakeover({
  reduceMotion,
  status,
}: {
  reduceMotion: boolean;
  status: UpdateStatus | null;
}) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-labelledby="micheon-install-title"
      aria-modal="true"
      className="micheon-update-takeover fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden p-5"
      data-testid="update-install-takeover"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      role="dialog"
      transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
    >
      <motion.section
        animate={{ scale: 1, y: 0 }}
        className="micheon-update-install-card relative w-full max-w-[590px] overflow-hidden rounded-[32px] p-6 sm:p-9"
        initial={reduceMotion ? undefined : { scale: 0.975, y: 18 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <div aria-hidden="true" className="micheon-update-install-accent absolute inset-x-0 top-0 h-1" />

        <div className="flex items-center justify-between gap-4">
          <div className="micheon-update-install-lockup">
            <MicheonLogo className="micheon-update-install-logo micheon-update-install-logo--light max-w-[150px]" height={34} theme="light" />
            <MicheonLogo className="micheon-update-install-logo micheon-update-install-logo--dark max-w-[150px]" height={34} theme="dark" />
          </div>
          <span className="micheon-update-install-badge rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]">
            {ui("Micheon update")}
          </span>
        </div>

        <div className="micheon-update-install-icon-shell relative mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-[30px]">
          <div aria-hidden="true" className="micheon-update-install-icon-well absolute inset-2 rounded-[23px]" />
          <img
            alt=""
            className="micheon-update-install-app-icon relative h-14 w-14 rounded-[18px]"
            src="/icon-64.png"
          />
          <div className="micheon-update-install-check absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-[11px] border-2">
            <CircleCheck aria-hidden="true" className="h-4.5 w-4.5" strokeWidth={3} />
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-[460px] text-center">
          <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--install-text)] sm:text-[34px]" id="micheon-install-title">
            {ui("Installing your update")}
          </h1>
          <p className="mx-auto mt-3 max-w-[420px] text-sm font-semibold leading-6 text-[var(--install-copy)]">
            {ui("Micheon will close for a moment and reopen automatically.")}
          </p>

          {(status?.currentVersion || status?.version) && (
            <div className="micheon-update-install-version mt-5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black tabular-nums">
              <span>{status?.currentVersion ? `v${status.currentVersion}` : ui("Current")}</span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-[var(--install-accent)]" />
              <span className="text-[var(--install-text)]">{status?.version ? `v${status.version}` : ui("Update ready")}</span>
            </div>
          )}
        </div>

        <div
          aria-live="polite"
          className="micheon-update-install-status mt-8 rounded-[18px] p-4"
          data-testid="update-install-steps"
          role="status"
        >
          <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-[var(--install-muted)]">
            <span>{ui("Preparing restart")}</span>
            <span>{ui("Just a moment")}</span>
          </div>
          <div aria-hidden="true" className="grid grid-cols-3 gap-2">
            <span className="micheon-update-install-step micheon-update-install-step--done h-2 rounded-full" />
            <motion.span
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              className="micheon-update-install-step micheon-update-install-step--active h-2 rounded-full"
              transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
            />
            <span className="micheon-update-install-step h-2 rounded-full" />
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="micheon-update-install-state flex items-center gap-2.5 rounded-[13px] px-3.5 py-3 text-xs font-bold">
              <CircleCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--install-accent)]" />
              {ui("Download complete")}
            </div>
            <div className="micheon-update-install-state micheon-update-install-state--active flex items-center gap-2.5 rounded-[13px] px-3.5 py-3 text-xs font-bold">
              <Power aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--install-accent-strong)]" />
              {ui("Restarting Micheon")}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

/**
 * The complete branded updater surface. Electron still handles the secure
 * download and installation, while this panel owns every learner-facing state.
 */
export function UpdateBanner() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<UpdateStatus | null>(previewStatus);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const [installing, setInstalling] = useState(previewInstalling);
  const [retrying, setRetrying] = useState(false);
  const installTimer = useRef<number | null>(null);

  const beginInstall = useCallback(() => {
    if (installTimer.current !== null) return;
    setInstalling(true);
    installTimer.current = window.setTimeout(() => {
      desktop?.installUpdate?.();
    }, reduceMotion ? 700 : 1700);
  }, [reduceMotion]);

  useEffect(() => {
    const handleInstallRequest = () => beginInstall();
    window.addEventListener(UPDATE_INSTALL_REQUEST_EVENT, handleInstallRequest);
    return () => {
      window.removeEventListener(UPDATE_INSTALL_REQUEST_EVENT, handleInstallRequest);
      if (installTimer.current !== null) window.clearTimeout(installTimer.current);
    };
  }, [beginInstall]);

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
    <>
      <AnimatePresence>
      {open && status && (
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby="micheon-update-title"
          aria-live="polite"
          className={`micheon-update-panel micheon-update-panel--${status.state} fixed bottom-4 right-4 z-[2000] w-[368px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[20px]`}
          data-testid="update-panel"
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 7 }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          role="region"
          transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="micheon-update-panel__inner">
            <div className="micheon-update-panel__main">
              <div
                className={[
                  "micheon-update-icon",
                  `micheon-update-icon--${status.state}`,
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]",
                ].join(" ")}
              >
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div className="micheon-update-panel__copy">
                <div className="micheon-update-panel__meta">
                  <span>{ui("Micheon update")}</span>
                  {status.version && (
                    <span className="micheon-update-version">
                      v{status.version}
                    </span>
                  )}
                </div>
                <h2 id="micheon-update-title">{panelTitle(status.state)}</h2>
                <p>
                  {panelCopy(status)}
                </p>
              </div>
            </div>

            {status.state === "downloading" && (
              <div className="micheon-update-download" data-testid="update-progress-wrap">
                <div className="micheon-update-download__label">
                  <span>{ui("Downloading")}</span>
                  <span>{percent}%</span>
                </div>
                <div
                  aria-label={ui("Update download progress")}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={percent}
                  className="micheon-update-progress-track"
                  role="progressbar"
                >
                  <div
                    className="micheon-update-progress"
                    data-testid="update-progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="micheon-update-actions">
              {status.state === "ready" && (
                <button
                  className="micheon-update-primary"
                  disabled={installing}
                  onClick={beginInstall}
                  type="button"
                >
                  {installing ? ui("Restarting…") : ui("Restart Micheon")}
                </button>
              )}

              {status.state === "error" && (
                <button
                  className="micheon-update-primary"
                  disabled={retrying}
                  onClick={retry}
                  type="button"
                >
                  <RefreshCw className={`h-4 w-4 ${retrying ? "animate-pulse motion-reduce:animate-none" : ""}`} />
                  {ui("Try again")}
                </button>
              )}

              <button
                className="micheon-update-secondary"
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

      <AnimatePresence>
        {installing && (
          <UpdateInstallTakeover reduceMotion={Boolean(reduceMotion)} status={status} />
        )}
      </AnimatePresence>
    </>
  );
}
