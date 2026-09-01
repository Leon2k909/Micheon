/**
 * When the app dies, it has to say what killed it.
 *
 * Two mid-lesson failures have left a blank screen and no
 * trace: no OS crash event, no dump, nothing in a log, and an app with no
 * error boundary, so a single render throw unmounts the entire tree. The
 * fault could not even be classified, let alone fixed. This module is the
 * difference between "something is causing an app crash" and a stack trace.
 *
 * Reports go to localStorage rather than a file so the web build reports the
 * same way the desktop build does, and so a report survives the restart that
 * follows a crash. Twenty entries, newest first, oldest dropped.
 */

const KEY = "gl-crash-reports";
const LIMIT = 20;

type CrashReport = {
  at: string;
  kind: "render" | "error" | "rejection";
  message: string;
  stack?: string;
  /** Which React subtree died, when a boundary caught it. */
  componentStack?: string;
};

export function readCrashReports(): CrashReport[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordCrash(report: Omit<CrashReport, "at">): void {
  // Nothing in here may throw: this runs while the app is already failing,
  // and a crash reporter that crashes erases the evidence it exists to keep.
  try {
    const entry: CrashReport = { at: new Date().toISOString(), ...report };
    const kept = [entry, ...readCrashReports()].slice(0, LIMIT);
    localStorage.setItem(KEY, JSON.stringify(kept));
  } catch { /* storage full or blocked — the console line below still fires */ }
  try {
    // eslint-disable-next-line no-console
    console.error(`[crash:${report.kind}]`, report.message, report.stack ?? "");
  } catch { /* nothing left to do */ }
}

/** Catch what nothing else catches. Installed once, at boot. */
export function installGlobalCrashHooks(): void {
  window.addEventListener("error", (event) => {
    recordCrash({
      kind: "error",
      message: String(event.message ?? event.error ?? "unknown error"),
      stack: event.error?.stack ? String(event.error.stack).slice(0, 4000) : undefined,
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    recordCrash({
      kind: "rejection",
      message: String(reason?.message ?? reason ?? "unhandled rejection"),
      stack: reason?.stack ? String(reason.stack).slice(0, 4000) : undefined,
    });
  });
}
