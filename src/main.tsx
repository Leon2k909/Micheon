import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyThemeToDom, getTheme } from "./lib/theme";
import { applyEffects, getEffects } from "./lib/effects";

const initialParams = new URLSearchParams(window.location.search);
const isMainShell = (
  initialParams.get("pet-overlay") !== "1"
  && initialParams.get("pet-history") !== "1"
  && !initialParams.has("guided")
);
if (isMainShell) {
  document.documentElement.classList.add("is-prototype-shell");
}
if (initialParams.has("guided")) {
  document.documentElement.classList.add("is-prototype-guided-launch");
}

// Paint saved theme + effects preference before first render to avoid flash.
// Paint-only (no sync) so it can't clobber the shared value hydrate will load.
applyThemeToDom(isMainShell || initialParams.has("guided") ? "light" : getTheme());
applyEffects(getEffects());

// Flag the desktop (Electron) build so the custom title bar + height offset apply.
if ((window as any).germDesktop) document.documentElement.classList.add("is-electron");
if (initialParams.get("pet-overlay") === "1") {
  document.documentElement.classList.add("is-pet-overlay");
  document.title = "Micheon mascot";
}
if (initialParams.get("pet-history") === "1") {
  document.documentElement.classList.add("is-pet-history");
  document.title = "Micheon pet messages";
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
