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

export function normaliseUpdatePercent(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

export function updatePanelIsUseful(status: UpdateStatus | null): boolean {
  return status?.state === "downloading"
    || status?.state === "ready"
    || status?.state === "error";
}

export function updateStatusKey(status: UpdateStatus | null): string {
  return `${status?.state ?? "idle"}:${status?.version ?? "current"}`;
}
