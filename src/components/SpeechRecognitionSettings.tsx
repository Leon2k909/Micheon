import { useEffect, useState, useSyncExternalStore } from "react";
import { CheckCircle2, Download, LoaderCircle, Mic2, ShieldCheck, Trash2 } from "lucide-react";
import {
  getSpeechRecognitionSnapshot,
  installSpeechRecognition,
  subscribeSpeechRecognition,
  uninstallSpeechRecognition,
} from "@/lib/desktopSpeechRecognition";
import { isElectronApp } from "@/lib/platform";
import { ui } from "@/lib/i18n";

function megabytes(bytes: number): string {
  return `${Math.round(Math.max(0, bytes) / (1024 * 1024))} MB`;
}

export function SpeechRecognitionSettings() {
  const status = useSyncExternalStore(
    subscribeSpeechRecognition,
    getSpeechRecognitionSnapshot,
    getSpeechRecognitionSnapshot
  );
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isElectronApp() || !status.enabled || status.state !== "missing") return;
    void installSpeechRecognition().catch((reason) => {
      setError(String((reason as Error)?.message ?? reason));
    });
  }, [status.enabled, status.state]);

  if (!isElectronApp()) return null;

  const installing = [
    "checking",
    "missing",
    "downloading-runtime",
    "installing-runtime",
    "downloading-model",
  ].includes(status.state);
  const installed = status.state === "ready" || status.state === "transcribing";

  const install = async () => {
    setBusy(true);
    setError("");
    try {
      await installSpeechRecognition();
    } catch (reason) {
      setError(String((reason as Error)?.message ?? reason));
    } finally {
      setBusy(false);
    }
  };

  const uninstall = async () => {
    setBusy(true);
    setError("");
    try {
      await uninstallSpeechRecognition();
      setConfirming(false);
    } catch (reason) {
      setError(String((reason as Error)?.message ?? reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Mic2 aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Offline speech recognition")}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("Micheon installs and keeps speaking practice ready automatically. Recognition runs privately on this device.")}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black text-[var(--text-2)]">
          {installed ? <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-[var(--accent)]" /> : null}
          {ui(installed ? "Installed" : status.state === "disabled" ? "Uninstalled" : installing ? "Installing" : "Needs attention")}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--surface-2)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-black text-[var(--text-1)]">whisper.cpp · large-v3-turbo-q5_0</p>
            <p className="mt-0.5 text-[11px] font-bold text-[var(--text-3)]">
              {megabytes(status.modelSizeBytes)} · {ui("German and English · works offline after installation")}
            </p>
          </div>
          <ShieldCheck aria-label={ui("Verified downloads")} className="h-5 w-5 text-[var(--accent)]" />
        </div>

        {installing && (
          <div className="mt-4" aria-live="polite">
            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-3)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={status.progress}>
              <span className="block h-full rounded-full bg-[var(--accent)] transition-[width] duration-300" style={{ width: `${Math.max(2, status.progress)}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-bold text-[var(--text-3)]">
              <span>{ui(status.message || "Preparing automatic installation")}</span>
              <span>{status.progress}%</span>
            </div>
          </div>
        )}

        {installed && (
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            {ui("Ready for speaking stages and pronunciation feedback")}
          </p>
        )}

        {(status.state === "error" || error) && (
          <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold leading-5 text-rose-600" role="alert">
            {ui(error || status.message)}
          </p>
        )}
      </div>

      {confirming ? (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
          <p className="text-sm font-black text-[var(--text-1)]">{ui("Uninstall speech recognition?")}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("This removes the offline model and speaking stages. Micheon will not download it again until you choose Reinstall here.")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="ghost-btn h-10 px-4 text-xs" disabled={busy} onClick={() => setConfirming(false)} type="button">{ui("Keep installed")}</button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-black text-white hover:bg-rose-700 disabled:opacity-60" disabled={busy} onClick={() => void uninstall()} type="button">
              {busy ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Trash2 aria-hidden="true" className="h-4 w-4" />}
              {ui("Uninstall")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-[11px] font-semibold leading-4 text-[var(--text-3)]">
            {ui("Downloads are integrity-checked. Audio is deleted immediately after local transcription.")}
          </p>
          {status.state === "disabled" || status.state === "error" ? (
            <button className="accent-btn inline-flex h-10 items-center gap-2 px-4 text-xs" disabled={busy} onClick={() => void install()} type="button">
              {busy ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Download aria-hidden="true" className="h-4 w-4" />}
              {ui(status.state === "disabled" ? "Reinstall" : "Try again")}
            </button>
          ) : installed ? (
            <button className="ghost-btn inline-flex h-10 items-center gap-2 px-4 text-xs text-rose-600" onClick={() => setConfirming(true)} type="button">
              <Trash2 aria-hidden="true" className="h-4 w-4" /> {ui("Uninstall")}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
