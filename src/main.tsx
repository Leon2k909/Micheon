import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@astryxdesign/core/astryx.css";
import App from "./App";
import {
  applyThemePresetToDom,
  applyThemeToDom,
  getTheme,
  getThemePreset,
} from "./lib/theme";
import { applyEffects, getEffects } from "./lib/effects";
import { applyCustomTheme } from "./lib/customTheme";
import { AppThemeProvider } from "./components/AppThemeProvider";

// Paint saved theme + effects preference before first render to avoid flash.
// Paint-only (no sync) so it can't clobber the shared value hydrate will load.
applyThemeToDom(getTheme());
applyThemePresetToDom(getThemePreset());
applyEffects(getEffects());
applyCustomTheme();

// Flag the desktop (Electron) build so the custom title bar + height offset apply.
if ((window as any).germDesktop) document.documentElement.classList.add("is-electron");

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </StrictMode>
  );
}
