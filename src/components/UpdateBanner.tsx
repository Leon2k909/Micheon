import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

// Desktop bridge (electron/preload.cjs). Undefined on the website.
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

/**
 * Floating "update ready" banner, Discord-style. Appears once an update has
 * finished downloading in the background. The button restarts and applies it
 * immediately; if ignored, the update installs automatically next time the app
 * is closed (that reassurance stays in the copy).
 */
export function UpdateBanner() {
  const [version, setVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!desktop?.onUpdateDownloaded) return;
    return desktop.onUpdateDownloaded((v: string) => {
      setVersion(v || "a new version");
      setDismissed(false);
    });
  }, []);

  if (!version || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[2000] w-[330px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_var(--shadow)]">
      <div className="h-1 w-full" style={{ background: "var(--feature-gradient)" }} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "var(--feature-gradient)" }}
          >
            <RefreshCw className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-[var(--text-1)]">Update ready</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[var(--text-3)]">
              Micheon {version} is downloaded. Restart to update now — or it'll apply automatically the next
              time you close the app.
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => desktop?.installUpdate?.()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--feature-gradient)" }}
        >
          <RefreshCw className="h-4 w-4" />
          Restart &amp; update
        </button>
      </div>
    </div>
  );
}
