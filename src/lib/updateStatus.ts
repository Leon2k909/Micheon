export type UpdateState =
  | "idle"
  | "checking"
  | "downloading"
  | "ready"
  | "current"
  | "error"
  | "unsupported";

export interface UpdateStatus {
  state: UpdateState;
  version: string | null;
  checkedAt: number | null;
  currentVersion?: string;
  supported?: boolean;
  percent?: number | null;
  transferred?: number | null;
  total?: number | null;
  bytesPerSecond?: number | null;
  /** How updates arrive: download on their own, wait to be told, or only when asked. */
  updateMode?: "auto" | "ask" | "manual";
  /** Epoch ms the updater stays quiet until, or 0. */
  snoozedUntil?: number;
  /** The panel is hidden; the update still happens, it just stops narrating. */
  noticesHidden?: boolean;
}

export const UPDATE_INSTALL_REQUEST_EVENT = "micheon:update-install-request";

/** Route every restart button through the single branded install takeover. */
export function requestUpdateInstall(): void {
  window.dispatchEvent(new Event(UPDATE_INSTALL_REQUEST_EVENT));
}

export function normaliseUpdatePercent(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

/**
 * Only states the learner can act on open the floating panel. A failed
 * background check stays silent: the app retries on its own, and anyone who
 * explicitly checks from settings gets their feedback inline there.
 */
export function updatePanelIsUseful(status: UpdateStatus | null, now = Date.now()): boolean {
  // "Hide update notices" means exactly that: the update still downloads and
  // still installs, it simply stops announcing itself. Settings remains the
  // place to see what is happening.
  if (status?.noticesHidden) return false;
  // Postponed means postponed. Settings could already set this and the panel
  // ignored it, so "remind me in an hour" closed the panel for exactly as long
  // as the window stayed open — which is not postponing anything. main.js
  // reports snoozedUntil as 0 once the time has passed, so nothing here has to
  // remember to forget it.
  if (Number(status?.snoozedUntil) > now) return false;
  // Downloading is not something the learner can act on, and it used to open
  // the panel anyway — so one update announced itself twice: once to report a
  // transfer nobody asked to watch, and again when it was actually ready. The
  // first of those offered no action but Hide, which is the panel asking to be
  // dismissed for having spoken.
  //
  // The transfer is automatic and background; the only moment worth a word is
  // the one the learner can answer. Anyone who wants to watch the bytes has
  // settings, which reports the same download with a real percentage.
  return status?.state === "ready";
}

export function updateStatusKey(status: UpdateStatus | null): string {
  return `${status?.state ?? "idle"}:${status?.version ?? "current"}`;
}
