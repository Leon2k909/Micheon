import { useEffect, useState } from "react";
import { Minus, Plus, ZoomIn } from "lucide-react";
import { ui } from "@/lib/i18n";

interface ZoomApi {
  getZoomFactor?: () => Promise<number>;
  setZoomFactor?: (factor: number) => Promise<number>;
  stepZoom?: (direction: number) => Promise<number>;
  onZoomChanged?: (cb: (factor: number) => void) => () => void;
}

function getZoomApi(): ZoomApi | undefined {
  if (typeof window === "undefined") return undefined;
  const api = (window as typeof window & { germDesktop?: ZoomApi }).germDesktop;
  return api?.getZoomFactor ? api : undefined;
}

/**
 * Zoom for the whole desktop window. Renders nothing in a plain browser,
 * where the browser's own zoom already does this. Every change goes through
 * the main process, so this row, Ctrl+= / Ctrl+-, and Ctrl+wheel all walk the
 * same ladder and stay in sync.
 */
export function AppZoomControl() {
  const [factor, setFactor] = useState<number | null>(null);

  useEffect(() => {
    const api = getZoomApi();
    if (!api) return undefined;
    let active = true;
    void api.getZoomFactor?.().then((value) => {
      if (active && Number.isFinite(value)) setFactor(value);
    }).catch(() => {});
    const unsubscribe = api.onZoomChanged?.((value) => {
      if (Number.isFinite(value)) setFactor(value);
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  if (factor === null) return null;

  const percent = Math.round(factor * 100);
  const step = (direction: number) => {
    void getZoomApi()?.stepZoom?.(direction).then((value) => {
      if (Number.isFinite(value)) setFactor(value);
    }).catch(() => {});
  };
  const reset = () => {
    void getZoomApi()?.setZoomFactor?.(1).then((value) => {
      if (Number.isFinite(value)) setFactor(value);
    }).catch(() => {});
  };

  return (
    <div className="mt-3 rounded-[18px] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-2">
        <ZoomIn aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
        <div>
          <p className="text-sm font-black text-[var(--text-1)]">{ui("App zoom")}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Make everything bigger or smaller. Ctrl and + or - works anywhere, and Ctrl and 0 resets.")}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={ui("App zoom")}>
        <div className="flex items-center gap-1 rounded-[14px] bg-[var(--surface-2)] p-1">
          <button
            aria-label={ui("Zoom out")}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--text-2)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-1)] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={factor <= 0.5}
            onClick={() => step(-1)}
            type="button"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="min-w-14 text-center text-sm font-black tabular-nums text-[var(--text-1)]">
            {percent}%
          </span>
          <button
            aria-label={ui("Zoom in")}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--text-2)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-1)] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={factor >= 2}
            onClick={() => step(1)}
            type="button"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        {percent !== 100 && (
          <button className="ghost-btn h-9 px-3 text-xs" onClick={reset} type="button">
            {ui("Reset to 100%")}
          </button>
        )}
      </div>
    </div>
  );
}
