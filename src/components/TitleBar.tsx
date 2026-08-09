import { useEffect, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";

// Window-control API injected by the Electron preload (electron/preload.cjs).
// On the website this is undefined, so the title bar renders nothing.
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

/**
 * Custom window title bar for the Electron desktop build. Frameless window +
 * our own draggable bar and min/maximize/close buttons, themed via the app's
 * CSS variables so it matches light/dark automatically. No-op on the website.
 */
type TitleBarProps = {
  variant?: "default" | "prototype";
};

export function TitleBar({ variant = "default" }: TitleBarProps) {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!desktop) return;
    desktop.isMaximized().then(setMaximized).catch(() => {});
    return desktop.onMaximizeChange(setMaximized);
  }, []);

  if (!desktop) return null;

  return (
    <div
      className={`titlebar${variant === "prototype" ? " titlebar--prototype" : ""}`}
      data-maximized={maximized ? "true" : "false"}
    >
      <div className="titlebar-drag" onDoubleClick={() => desktop.toggleMaximize()}>
        {variant === "prototype" && (
          <span className="titlebar-appmark" aria-hidden="true">
            <img alt="" className="titlebar-logo" draggable="false" src="/icon-64.png" />
          </span>
        )}
        <span className="titlebar-title">Micheon</span>
      </div>
      <div className="titlebar-controls">
        <button className="titlebar-btn" onClick={() => desktop.minimize()} aria-label="Minimize">
          <Minus className="h-3.5 w-3.5" strokeWidth={1.4} />
        </button>
        <button className="titlebar-btn" onClick={() => desktop.toggleMaximize()} aria-label="Maximize">
          {maximized
            ? <Copy className="h-3 w-3" strokeWidth={1.45} />
            : <Square className="h-3 w-3" strokeWidth={1.45} />}
        </button>
        <button className="titlebar-btn titlebar-close" onClick={() => desktop.close()} aria-label="Close">
          <X className="h-3.5 w-3.5" strokeWidth={1.4} />
        </button>
      </div>
    </div>
  );
}
