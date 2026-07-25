import React, { lazy, Suspense, useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { TitleBar } from "./components/TitleBar";
import { getAuthUser, hydrateLocalStorageFromSharedStorage, recordKnownProfile, UserProfile } from "./lib/profileStorage";
import { applyStoredThemePreferences, getTheme } from "./lib/theme";
import { applyCustomTheme } from "./lib/customTheme";
import { MicheonLogo } from "./components/MicheonLogo";
import { UpdateBanner } from "./components/UpdateBanner";
import { CodexPetLayer } from "./components/codexPets/CodexPetLayer";
import { CodexPetProvider } from "./components/codexPets/CodexPetProvider";
import { isElectronApp } from "./lib/platform";
import { DIRECTION_CHANGE_EVENT } from "./lib/direction";

// The desktop pet has its own lightweight render path. Loading the complete
// lesson application eagerly made that transparent overlay parse and retain the
// largest bundle even though it never rendered it, doubling a major chunk of
// the app's startup and memory cost whenever the mascot was visible.
const GermanLearningLab = lazy(() => import("./german_learning_lab"));

export default function App() {
  const isPetOverlay = new URLSearchParams(window.location.search).get("pet-overlay") === "1";
  if (isPetOverlay) {
    return (
      <CodexPetProvider>
        <CodexPetLayer />
      </CodexPetProvider>
    );
  }

  return <MicheonApp />;
}

function MicheonApp() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [, setDirectionVersion] = useState(0);

  useEffect(() => {
    const refreshLanguage = () => setDirectionVersion((version) => version + 1);
    window.addEventListener(DIRECTION_CHANGE_EVENT, refreshLanguage);
    return () => window.removeEventListener(DIRECTION_CHANGE_EVENT, refreshLanguage);
  }, []);

  useEffect(() => {
    const desktop = (window as any).germDesktop;
    if (!desktop?.onPetOverlayWheel) return undefined;
    return desktop.onPetOverlayWheel((deltaX: number, deltaY: number) => {
      window.scrollBy({
        behavior: "auto",
        left: Number.isFinite(deltaX) ? deltaX : 0,
        top: Number.isFinite(deltaY) ? deltaY : 0,
      });
    });
  }, []);

  // Hydrate the shared desktop/web progress store before creating any default profile.
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      await hydrateLocalStorageFromSharedStorage();
      if (cancelled) return;
      // Hydration may have pulled a synced theme; repaint so the DOM matches
      // the stored preference and dark mode survives restarts.
      applyStoredThemePreferences();
      // Hydration may have pulled synced appearance overrides; repaint them too.
      applyCustomTheme();
      // No hardcoded default: a device with no signed-in profile shows the
      // sign-in screen, so each person creates their own account. A device that
      // already has a profile (synced via the local shared store) stays signed
      // in across browsers/app restarts and keeps its progress.
      const current = getAuthUser();
      // Keep the email->profile registry seeded with the signed-in account so a
      // future email-only login reconnects to it (and its scoped progress).
      if (current) recordKnownProfile(current);
      setUser(current);
      setReady(true);
    }

    boot();

    // Re-hydrate storage whenever the tab or app window gets focus (for multi-env sync)
    const handleFocus = () => {
      hydrateLocalStorageFromSharedStorage();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // TitleBar renders only inside the Electron desktop build (no-op on the website).
  return (
    <>
      <TitleBar />
      <UpdateBanner />
      {!ready ? (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-[var(--bg)] text-[var(--text-1)]">
          <MicheonLogo theme={getTheme()} height={150} className="animate-pulse" />
        </div>
      ) : (
        <CodexPetProvider>
          {user ? (
            <Suspense
              fallback={(
                <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-[var(--bg)] text-[var(--text-1)]">
                  <MicheonLogo theme={getTheme()} height={150} className="animate-pulse" />
                </div>
              )}
            >
              <GermanLearningLab />
            </Suspense>
          ) : (
            <LoginScreen onLogin={(authenticated) => setUser(authenticated)} />
          )}
          {!isElectronApp() && <CodexPetLayer />}
        </CodexPetProvider>
      )}
    </>
  );
}
