import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyThemeToDom, getTheme } from "./lib/theme";
import { applyEffects, getEffects } from "./lib/effects";

// Paint saved theme + effects preference before first render to avoid flash.
// Paint-only (no sync) so it can't clobber the shared value hydrate will load.
applyThemeToDom(getTheme());
applyEffects(getEffects());

// Flag the desktop (Electron) build so the custom title bar + height offset apply.
if ((window as any).germDesktop) document.documentElement.classList.add("is-electron");

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
