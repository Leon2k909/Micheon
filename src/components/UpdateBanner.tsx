import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import { ui, uiIsGerman } from "@/lib/i18n";

// Desktop bridge (electron/preload.cjs). Undefined on the website.
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

/**
 * "Update ready" toast, shown once an update has finished downloading in the
 * background.
 *
 * Restraint is the point here. An earlier version stacked the brand gradient
 * three times — a top bar, an icon tile and the button — and repeated the same
 * refresh icon in the tile and the button, which reads as decoration rather
 * than as a piece of the product. The accent now appears once, on the primary
 * action, which is also the only thing in the toast the user has to decide
 * about. Everything else is surface, border and text.
 */
export function UpdateBanner() {
  const [version, setVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (!desktop?.onUpdateDownloaded) return;
    return desktop.onUpdateDownloaded((v: string) => {
      setVersion(v || "");
      setDismissed(false);
      setInstalling(false);
    });
  }, []);

  const open = Boolean(version) && !dismissed;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Conveys arrival, nothing more: a short rise from below the corner
          // it appears in. Reduced motion gets the same toast without travel.
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
          className={[
            "fixed bottom-5 right-5 z-[2000] w-[336px] max-w-[calc(100vw-2.5rem)]",
            "motion-reduce:transition-none",
            "rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
            "p-4 shadow-[0_18px_44px_var(--shadow)]",
          ].join(" ")}
          role="status"
        >
          <div className="flex items-baseline gap-2">
            <ArrowUpCircle
              aria-hidden="true"
              className="h-[15px] w-[15px] shrink-0 translate-y-[2px] text-[var(--accent)]"
            />
            <h2 className="text-sm font-black leading-none text-[var(--text-1)]">
              {ui("Update ready")}
            </h2>
            {version && (
              <span className="ml-auto text-xs font-bold tabular-nums text-[var(--text-3)]">
                {version}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs font-semibold leading-relaxed text-[var(--text-2)]">
            {uiIsGerman()
              ? "Neu starten, um es jetzt zu installieren. Sonst passiert es automatisch, wenn du die App schließt."
              : "Restart to install it now. Otherwise it happens on its own when you close the app."}
          </p>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              className={[
                "h-9 flex-1 rounded-xl bg-[var(--accent)] text-sm font-black text-[var(--accent-text)]",
                "transition-colors duration-150",
                "hover:bg-[var(--accent-hover)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                "active:brightness-95 disabled:opacity-70",
              ].join(" ")}
              disabled={installing}
              onClick={() => {
                setInstalling(true);
                desktop?.installUpdate?.();
              }}
              type="button"
            >
              {installing ? ui("Restarting…") : ui("Restart now")}
            </button>
            <button
              className={[
                "h-9 rounded-xl px-3.5 text-sm font-bold text-[var(--text-3)]",
                "transition-colors duration-150",
                "hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
              ].join(" ")}
              onClick={() => setDismissed(true)}
              type="button"
            >
              {ui("Later")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
