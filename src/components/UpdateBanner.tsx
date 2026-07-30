import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleCheck, Download, RefreshCw, TriangleAlert } from "lucide-react";
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
  const state = search.get("update-preview") as UpdateState | null;
  if (!state || !["downloading", "ready", "error"].includes(state)) return null;
  return {
    state,
    version: search.get("update-version") || "1.2.65",
    currentVersion: "1.2.64",
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
      className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden bg-[#0f1018] p-5 text-[#f7f7fb]"
      data-testid="update-install-takeover"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      role="dialog"
      transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.28, 0.48, 0.28], scale: [0.94, 1.08, 0.94] }}
        aria-hidden="true"
        className="absolute -left-24 -top-28 h-[420px] w-[420px] rounded-full bg-[#7834f7]/35 blur-[110px]"
        transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.18, 0.34, 0.18], scale: [1.08, 0.96, 1.08] }}
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 h-[440px] w-[440px] rounded-full bg-[#a177ff]/25 blur-[120px]"
        transition={{ duration: 5.4, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.section
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-[590px] overflow-hidden rounded-[32px] border border-white/10 bg-[#1b1d27]/95 p-6 shadow-[0_36px_110px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-9"
        initial={reduceMotion ? undefined : { scale: 0.975, y: 18 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7834f7] via-[#a177ff] to-[#7834f7]" />

        <div className="flex items-center justify-between gap-4">
          <MicheonLogo className="max-w-[150px]" height={34} theme="dark" />
          <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#c6afff]">
            {ui("Micheon update")}
          </span>
        </div>

        <div className="relative mx-auto mt-10 flex h-24 w-24 items-center justify-center">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            aria-hidden="true"
            className="absolute inset-0 rounded-[30px] border border-[#a177ff]/45 border-t-[#a177ff] shadow-[0_0_38px_rgba(161,119,255,0.22)]"
            transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
          />
          <div className="flex h-[70px] w-[70px] items-center justify-center rounded-[23px] bg-gradient-to-br from-[#a177ff] to-[#7834f7] shadow-[0_16px_38px_rgba(120,52,247,0.38)]">
            <Download aria-hidden="true" className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-[460px] text-center">
          <h1 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-[34px]" id="micheon-install-title">
            {ui("Installing your update")}
          </h1>
          <p className="mx-auto mt-3 max-w-[420px] text-sm font-semibold leading-6 text-[#b7bac9]">
            {ui("Micheon will close for a moment and reopen automatically.")}
          </p>

          {(status?.currentVersion || status?.version) && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#252735] px-3 py-2 text-xs font-black tabular-nums text-[#d2d4df]">
              <span>{status?.currentVersion ? `v${status.currentVersion}` : ui("Current")}</span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-[#a177ff]" />
              <span className="text-white">{status?.version ? `v${status.version}` : ui("Update ready")}</span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-[#8f94a8]">
            <span>{ui("Preparing restart")}</span>
            <span>{ui("Just a moment")}</span>
          </div>
          <div aria-label={ui("Preparing restart")} className="relative h-2.5 overflow-hidden rounded-full bg-[#303344]" role="progressbar">
            <motion.div
              animate={reduceMotion ? { x: "180%" } : { x: ["-130%", "330%"] }}
              className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-gradient-to-r from-[#7834f7] via-[#b799ff] to-[#7834f7] shadow-[0_0_18px_rgba(161,119,255,0.5)]"
              initial={{ x: "-130%" }}
              transition={{ duration: reduceMotion ? 0.01 : 1.15, ease: "easeInOut", repeat: reduceMotion ? 0 : Infinity }}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-3 text-xs font-bold text-[#d2d4df]">
            <CircleCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7ff0ba]" />
            {ui("Download complete")}
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#a177ff]/20 bg-[#a177ff]/[0.08] px-3.5 py-3 text-xs font-bold text-white">
            <RefreshCw aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin text-[#b799ff] motion-reduce:animate-none" />
            {ui("Restarting Micheon")}
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
  const [installing, setInstalling] = useState(false);
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
                  onClick={beginInstall}
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

      <AnimatePresence>
        {installing && (
          <UpdateInstallTakeover reduceMotion={Boolean(reduceMotion)} status={status} />
        )}
      </AnimatePresence>
    </>
  );
}
