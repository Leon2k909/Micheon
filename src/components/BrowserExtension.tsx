import { useState } from "react";
import { Check, Download, FolderOpen, Headphones, ListChecks, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

interface ExtensionDesktopApi {
  installBrowserExtension?: () => Promise<{ ok: boolean; path: string | null }>;
}

function getExtensionApi(): ExtensionDesktopApi | undefined {
  if (typeof window === "undefined") return undefined;
  const api = (window as typeof window & { germDesktop?: ExtensionDesktopApi }).germDesktop;
  return api?.installBrowserExtension ? api : undefined;
}

/**
 * The companion browser extension lives entirely outside this app -- it's a
 * separate Manifest V3 project, not something built from Micheon's own
 * source -- so this card is just the download and install story for it, not
 * a settings surface. Everything the extension itself does (word glossing,
 * missing-vocabulary collection, YouTube dub automation) runs offline from
 * a snapshot of Micheon's own word list, no account, no external service.
 *
 * No browser lets a downloaded file quietly install itself as an extension
 * -- that restriction is deliberate, the same reason a stray .crx can't
 * just double-click its way in, and there is no way around it short of
 * publishing to that browser's own store. What the desktop app CAN do is
 * remove the one step that's actually just busywork: instead of a .zip you
 * have to find and extract yourself, it copies the already-unpacked
 * extension straight to a stable folder and opens it in Explorer. Developer
 * mode and Load unpacked stay a real click in the learner's own browser,
 * on purpose.
 */
export function BrowserExtension() {
  const desktopApi = getExtensionApi();
  const [state, setState] = useState<{ status: "idle" | "working" | "done" | "error"; path?: string }>({ status: "idle" });

  const setUpFolder = async () => {
    if (!desktopApi?.installBrowserExtension) return;
    setState({ status: "working" });
    try {
      const result = await desktopApi.installBrowserExtension();
      setState(result.ok && result.path ? { status: "done", path: result.path } : { status: "error" });
    } catch {
      setState({ status: "error" });
    }
  };

  return (
    <div className="mt-3 space-y-4">
      <p className="text-sm font-semibold leading-6 text-[var(--text-2)]">
        {ui("A small extension for Chrome, Edge and Brave that keeps teaching you while you browse: it highlights German words you already know on any page, quietly collects the ones it doesn't recognise (with the sentence they appeared in) so the word bank can grow from real usage, and switches YouTube to its German dub with English captions when a video has one.")}
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { icon: Puzzle, label: ui("Highlights words you're learning, on any page") },
          { icon: Check, label: ui("Spots new words for the word bank, with real examples") },
          { icon: Headphones, label: ui("Auto-switches YouTube to its German dub + English captions") },
        ].map((item) => (
          <div className="flex items-start gap-2 rounded-[16px] bg-[var(--surface)] p-3" key={item.label}>
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <p className="text-xs font-semibold leading-5 text-[var(--text-2)]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {desktopApi ? (
          <button
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-black transition-opacity",
              state.status === "done" ? "bg-emerald-500 text-white" : "bg-[var(--accent)] text-white hover:opacity-90"
            )}
            disabled={state.status === "working"}
            onClick={setUpFolder}
            type="button"
          >
            {state.status === "done" ? <Check className="h-4 w-4" /> : <FolderOpen className="h-4 w-4" />}
            {state.status === "working"
              ? ui("Setting it up…")
              : state.status === "done"
                ? ui("Folder opened — ready to load")
                : ui("Set up the extension folder")}
          </button>
        ) : (
          <a
            className="accent-btn inline-flex h-11 items-center gap-2 px-5 text-sm"
            download="micheon-immersion-extension.zip"
            href="/micheon-immersion-extension.zip"
          >
            <Download className="h-4 w-4" />
            {ui("Download the extension")}
          </a>
        )}
        {desktopApi && (
          <a
            className="text-xs font-bold text-[var(--text-3)] underline decoration-dotted hover:text-[var(--text-2)]"
            download="micheon-immersion-extension.zip"
            href="/micheon-immersion-extension.zip"
          >
            {ui("or download the .zip instead")}
          </a>
        )}
      </div>

      {state.status === "error" && (
        <p className="text-xs font-bold text-rose-500">
          {ui("Couldn't set that up automatically — use the .zip download above instead.")}
        </p>
      )}
      {state.status === "done" && state.path && (
        <p className="text-[11px] font-semibold text-[var(--text-3)]">
          {ui("Saved to")} {state.path}
        </p>
      )}

      <div className="rounded-[18px] bg-[var(--surface)] p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-[var(--text-3)]" />
          <p className="text-xs font-black text-[var(--text-1)]">{ui("Installing it")}</p>
        </div>
        <p className="mt-1 text-[11px] font-semibold leading-5 text-[var(--text-3)]">
          {ui("Not on the Chrome, Edge or Brave web store yet, so it installs the way any in-development extension does — no browser lets a download install itself, on purpose:")}
        </p>
        <ol className="mt-2 space-y-1 pl-4 text-[11px] font-semibold leading-5 text-[var(--text-3)]" style={{ listStyleType: "decimal" }}>
          {!desktopApi && (
            <li>{ui("Unzip the download somewhere it can stay (deleting the folder later removes the extension).")}</li>
          )}
          <li>{ui("Open your browser's extensions page (type chrome://extensions, edge://extensions or brave://extensions into the address bar).")}</li>
          <li>{ui("Turn on Developer mode.")}</li>
          <li>
            {desktopApi
              ? ui("Click “Load unpacked” and select the folder that just opened (or that you unzipped).")
              : ui("Click “Load unpacked” and select the unzipped folder.")}
          </li>
        </ol>
      </div>
    </div>
  );
}

export const BROWSER_EXTENSION_ICON = Puzzle;
