import { useEffect, useState } from "react";
import { Check, Download, FolderOpen, Headphones, ListChecks, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

interface ExtensionBrowser {
  id: string;
  name: string;
}

interface ExtensionInfo {
  bundledVersion: string | null;
  copiedVersion: string | null;
  path: string;
}

interface ExtensionInstallResult {
  ok: boolean;
  path: string | null;
  address: string | null;
  version: string | null;
  previousVersion: string | null;
  updated: boolean;
}

interface ExtensionDesktopApi {
  installBrowserExtension?: (browserId?: string | null) => Promise<ExtensionInstallResult>;
  getBrowserExtensionInfo?: () => Promise<ExtensionInfo>;
  listExtensionBrowsers?: () => Promise<ExtensionBrowser[]>;
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
 * missing-vocabulary collection, YouTube dub automation, pronunciation)
 * runs offline from a snapshot of Micheon's own word list.
 *
 * No browser lets an outside program install an extension for it -- that
 * restriction is deliberate, and it also refuses scheme://extensions as a
 * launch URL (verified against current Chrome, Edge and Brave). What the
 * desktop app CAN do per browser: copy the unpacked extension to a stable
 * folder, open that browser, put the extensions-page address in the
 * clipboard ready to paste, and open the folder in Explorer. Developer
 * mode and Load unpacked stay the learner's own clicks, on purpose.
 */
export function BrowserExtension() {
  const desktopApi = getExtensionApi();
  const [browsers, setBrowsers] = useState<ExtensionBrowser[]>([]);
  const [info, setInfo] = useState<ExtensionInfo | null>(null);
  const [state, setState] = useState<{
    status: "idle" | "working" | "done" | "error";
    path?: string;
    address?: string;
    browser?: string;
    version?: string;
    previousVersion?: string | null;
    updated?: boolean;
  }>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      desktopApi?.listExtensionBrowsers?.(),
      desktopApi?.getBrowserExtensionInfo?.(),
    ]).then(([list, extensionInfo]) => {
      if (cancelled) return;
      if (Array.isArray(list)) setBrowsers(list);
      if (extensionInfo) setInfo(extensionInfo);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
    // The bridge is a stable window global; re-querying it on re-render
    // would only re-run the same IPC.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUp = async (browser?: ExtensionBrowser) => {
    if (!desktopApi?.installBrowserExtension) return;
    setState({ status: "working", browser: browser?.name });
    try {
      const result = await desktopApi.installBrowserExtension(browser?.id ?? null);
      setState(result.ok && result.path && result.version
        ? {
            status: "done",
            path: result.path,
            address: result.address ?? undefined,
            browser: browser?.name,
            version: result.version,
            previousVersion: result.previousVersion,
            updated: result.updated,
          }
        : { status: "error" });
      if (result.ok && result.path && result.version) {
        setInfo({ bundledVersion: result.version, copiedVersion: result.version, path: result.path });
      }
    } catch {
      setState({ status: "error" });
    }
  };

  return (
    <div className="mt-3 space-y-4">
      <p className="text-sm font-semibold leading-6 text-[var(--text-2)]">
        {ui("A small extension for Chrome, Edge and Brave that keeps teaching you while you browse: it highlights German words you already know on any page, quietly collects the ones it doesn't recognise (with the sentence they appeared in) so the word bank can grow from real usage, and switches YouTube to its German dub with English captions when a video has one.")}
      </p>

      {info?.bundledVersion && (
        <p className="text-xs font-bold text-[var(--text-3)]">
          {ui("Included with this Micheon version")}: <span className="text-[var(--text-1)]">v{info.bundledVersion}</span>
          {info.copiedVersion && (
            <> · {ui("Extension folder")}: <span className="text-[var(--text-1)]">v{info.copiedVersion}</span></>
          )}
        </p>
      )}

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
          <>
            {browsers.map((browser) => (
              <button
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-black transition-opacity",
                  state.status === "done" && state.browser === browser.name
                    ? "bg-emerald-500 text-white"
                    : "bg-[var(--accent)] text-white hover:opacity-90"
                )}
                disabled={state.status === "working"}
                key={browser.id}
                onClick={() => void setUp(browser)}
                type="button"
              >
                {state.status === "done" && state.browser === browser.name
                  ? <Check className="h-4 w-4" />
                  : <FolderOpen className="h-4 w-4" />}
                {ui("Set up for")} {browser.name}
              </button>
            ))}
            {browsers.length === 0 && (
              <button
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-black transition-opacity",
                  state.status === "done" ? "bg-emerald-500 text-white" : "bg-[var(--accent)] text-white hover:opacity-90"
                )}
                disabled={state.status === "working"}
                onClick={() => void setUp()}
                type="button"
              >
                {state.status === "done" ? <Check className="h-4 w-4" /> : <FolderOpen className="h-4 w-4" />}
                {ui("Set up the extension folder")}
              </button>
            )}
            <a
              className="text-xs font-bold text-[var(--text-3)] underline decoration-dotted hover:text-[var(--text-2)]"
              download="micheon-immersion-extension.zip"
              href="/micheon-immersion-extension.zip"
            >
              {ui("or download the .zip instead")}
            </a>
          </>
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
      </div>

      {state.status === "error" && (
        <p className="text-xs font-bold text-rose-500">
          {ui("Couldn't set that up automatically — use the .zip download above instead.")}
        </p>
      )}
      {state.status === "done" && state.path && (
        <div className="rounded-[16px] bg-emerald-500/10 p-3 text-xs font-semibold leading-5 text-[var(--text-2)]">
          <p className="font-black text-emerald-700 dark:text-emerald-300">
            {ui("Micheon Immersion copied")}{state.version ? ` · v${state.version}` : ""}
            {state.updated && state.previousVersion ? ` (${ui("updated from")} v${state.previousVersion})` : ""}
          </p>
          {state.address ? (
            <p className="mt-1">
              {ui("Your browser is opening. Its extensions-page address is already in your clipboard — paste it into the address bar")}
              {" "}(<code className="font-black">{state.address}</code>),{" "}
              {ui("then use Load unpacked for a first install, or click Reload on the existing Micheon Immersion card after an update. Refresh pages that were already open.")}
            </p>
          ) : (
            <p className="mt-1">
              {ui("Folder opened — ready to load")} · {ui("Saved to")} {state.path}
            </p>
          )}
        </div>
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
              ? ui("For a first install, click “Load unpacked” and select the folder that just opened. After an app update, click Reload on the existing Micheon Immersion card instead.")
              : ui("Click “Load unpacked” and select the unzipped folder.")}
          </li>
          <li>{ui("Refresh browser pages that were already open so they use the new extension files.")}</li>
        </ol>
      </div>
    </div>
  );
}

export const BROWSER_EXTENSION_ICON = Puzzle;
