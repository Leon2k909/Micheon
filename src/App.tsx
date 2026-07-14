import React, { useState, useEffect } from "react";
import GermanLearningLab from "./german_learning_lab";
import { LoginScreen } from "./components/LoginScreen";
import { TitleBar } from "./components/TitleBar";
import { getAuthUser, hydrateLocalStorageFromSharedStorage, recordKnownProfile, UserProfile } from "./lib/profileStorage";
import { applyThemeToDom, getTheme } from "./lib/theme";
import { MicheonMark, MicheonWordmark } from "./components/MicheonLogo";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate the shared desktop/web progress store before creating any default profile.
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      await hydrateLocalStorageFromSharedStorage();
      if (cancelled) return;
      // Hydration may have pulled a synced theme; repaint so the DOM matches
      // the stored preference and dark mode survives restarts.
      applyThemeToDom(getTheme());
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
      {!ready ? (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-[var(--bg)] text-[var(--text-1)]">
          <MicheonMark size={76} className="animate-pulse" />
          <MicheonWordmark height={22} />
        </div>
      ) : user ? (
        <GermanLearningLab />
      ) : (
        <LoginScreen onLogin={(authenticated) => setUser(authenticated)} />
      )}
    </>
  );
}
