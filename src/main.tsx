import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App, { MotionGate } from "./App";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { installGlobalCrashHooks } from "./lib/crashReport";
import { SilencedAudioPrompt } from "./components/SilencedAudioPrompt";
import { applyThemeToDom, resolveTheme } from "./lib/theme";
import { applyAccentColour } from "./lib/accentColour";
import { applyEffects, getEffects } from "./lib/effects";
import { applyHighContrast, getHighContrast } from "./lib/highContrast";
import { watchRuntimePerformance } from "./lib/runtimePerformance";

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
// Every surface honours the stored choice — the main shell used to be pinned
// to light here, which meant a learner in dark mode watched the app load
// white and then flip.
const bootTheme = resolveTheme();
applyThemeToDom(bootTheme);
if (bootTheme === "dark") {
  // index.html carries a light background inline so the first frame is not
  // bare white; inline styles beat the stylesheet, so dark has to say so.
  document.documentElement.style.background = "#0b0e13";
  document.body.style.background = "#0b0e13";
}
// Paint only — persisting here would pin the first-launch default forever
// and stop the slow-device check from ever being consulted again.
applyEffects(getEffects());
// After the theme, because the dark shades are derived from a lifted base.
applyAccentColour();
applyHighContrast(getHighContrast());

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

// Hardware hints describe the machine; they cannot see how busy it is right
// now. Watch real frame pacing for a few seconds and calm the effects down if
// the app is genuinely stuttering. Never overrides a choice the learner made.
watchRuntimePerformance();

// Two mid-lesson blank screens arrived with no trace to debug from. Anything
// that escapes React lands here; anything that kills a React tree is caught by
// the boundary below and shows a way out instead of an empty window.
installGlobalCrashHooks();

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <AppErrorBoundary>
        <MotionGate>
          <App />
          {/* One explanation for every play button in the app. */}
          <SilencedAudioPrompt />
        </MotionGate>
      </AppErrorBoundary>
    </StrictMode>
  );
}
