import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyTheme, getTheme } from "./lib/theme";
import { applyEffects, getEffects } from "./lib/effects";

// Apply saved theme + effects preference before first render to avoid flash
applyTheme(getTheme());
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
