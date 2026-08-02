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
export function updatePanelIsUseful(status: UpdateStatus | null): boolean {
  return status?.state === "downloading"
    || status?.state === "ready";
}

export function updateStatusKey(status: UpdateStatus | null): string {
  return `${status?.state ?? "idle"}:${status?.version ?? "current"}`;
}
