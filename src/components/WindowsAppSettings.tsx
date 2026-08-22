import { useEffect, useState } from "react";
import { LogOut, PanelTopClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

type CloseBehavior = "exit" | "tray";

interface WindowsSettings {
  closeBehavior: CloseBehavior;
  launchAtLogin: boolean;
  launchAtLoginSupported: boolean;
  platform: string;
}

interface WindowsSettingsApi {
  getWindowsSettings?: () => Promise<WindowsSettings>;
  setLaunchAtLogin?: (enabled: boolean) => Promise<WindowsSettings>;
  setCloseBehavior?: (behavior: CloseBehavior) => Promise<WindowsSettings>;
}

function getDesktopApi(): WindowsSettingsApi | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as typeof window & { germDesktop?: WindowsSettingsApi }).germDesktop;
}

export function WindowsAppSettings() {
  const [settings, setSettings] = useState<WindowsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"launch" | "close" | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const desktop = getDesktopApi();
    if (!desktop?.getWindowsSettings) {
      setLoading(false);
      return () => { active = false; };
    }

    void desktop.getWindowsSettings()
      .then((next) => {
        if (active) setSettings(next);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const updateLaunchAtLogin = async () => {
    const desktop = getDesktopApi();
    if (!desktop?.setLaunchAtLogin || !settings || saving) return;
    setSaving("launch");
    setError(false);
    try {
      setSettings(await desktop.setLaunchAtLogin(!settings.launchAtLogin));
    } catch {
      setError(true);
    } finally {
      setSaving(null);
    }
  };

  const updateCloseBehavior = async (closeBehavior: CloseBehavior) => {
    const desktop = getDesktopApi();
    if (!desktop?.setCloseBehavior || !settings || saving || settings.closeBehavior === closeBehavior) return;
    setSaving("close");
    setError(false);
    try {
      setSettings(await desktop.setCloseBehavior(closeBehavior));
    } catch {
      setError(true);
    } finally {
      setSaving(null);
    }
  };

  const available = settings?.platform === "win32";

  // No heading of its own. The category above already reads "Desktop app &
  // updates" with the same Monitor icon and a description that covers this, so
  // the panel opened with two near-identical headers stacked in two different
  // sizes (a 34px icon, then a 40px one) and the real content started lower
  // here than in every other category.
  //
  // This component is only ever rendered inside that category, so the heading
  // was pure duplication.
  return (
    <div className="settings-rule-above">
      {loading ? (
        <div aria-label={ui("Loading Windows settings")} className="space-y-2" role="status">
          <div className="h-16 rounded-[18px] bg-[var(--surface)] motion-safe:animate-pulse" />
          <div className="h-24 rounded-[18px] bg-[var(--surface)] motion-safe:animate-pulse" />
        </div>
      ) : !available ? (
        <p className="rounded-[18px] bg-[var(--surface)] px-4 py-3 text-xs font-bold leading-5 text-[var(--text-3)]">
          {ui("These controls are available in the installed Windows app.")}
        </p>
      ) : (
        <div className="space-y-3">
          {/* Wraps rather than squeezing: on a narrow window the label had a
              few words of width and ran to six lines beside a switch that
              never gave any of it up. Below 12rem of text the switch drops to
              its own line instead. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[18px] bg-[var(--surface)] px-4 py-3.5">
            <div className="min-w-48 flex-1 basis-0">
              <p className="text-sm font-black text-[var(--text-1)]">{ui("Launch when I sign in")}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                {settings.launchAtLoginSupported
                  ? ui("Open Micheon automatically after you sign in to Windows.")
                  : ui("Available after Micheon is installed on Windows.")}
              </p>
            </div>
            <button
              aria-checked={settings.launchAtLogin}
              aria-label={ui("Launch Micheon when I sign in")}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45",
                settings.launchAtLogin
                  ? "border-[var(--accent)] bg-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface-3)]"
              )}
              disabled={!settings.launchAtLoginSupported || saving !== null}
              onClick={updateLaunchAtLogin}
              role="switch"
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  settings.launchAtLogin ? "translate-x-[23px]" : "translate-x-[3px]"
                )}
              />
            </button>
          </div>

          <div className="rounded-[18px] bg-[var(--surface)] p-4">
            <p className="text-sm font-black text-[var(--text-1)]">{ui("Close button")}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
              {settings.closeBehavior === "tray"
                ? ui("Keep Micheon, pets, and updates running in the notification area.")
                : ui("Fully quit Micheon when the window is closed.")}
            </p>
            {/* Two across while they fit, stacked when they do not. Fixed at
                two columns, "Micheon beenden" wrapped inside its own button. */}
            <div className="mt-3 flex flex-wrap gap-2 rounded-[16px] bg-[var(--surface-2)] p-1.5">
              {([
                { behavior: "exit" as const, icon: LogOut, label: ui("Exit Micheon") },
                { behavior: "tray" as const, icon: PanelTopClose, label: ui("Minimize to tray") },
              ]).map(({ behavior, icon: Icon, label }) => {
                const selected = settings.closeBehavior === behavior;
                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "flex min-h-11 min-w-36 flex-1 items-center justify-center gap-2 rounded-[12px] border px-2 text-center text-xs font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60",
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "border-transparent bg-transparent text-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text-1)]"
                    )}
                    disabled={saving !== null}
                    key={behavior}
                    onClick={() => void updateCloseBehavior(behavior)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs font-bold text-rose-600" role="alert">
          {ui("Micheon could not save that Windows setting. Please try again.")}
        </p>
      )}
    </div>
  );
}
