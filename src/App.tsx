import React, { useState, useEffect } from "react";
import GermanLearningLab from "./german_learning_lab";
import { LoginScreen } from "./components/LoginScreen";
import { TitleBar } from "./components/TitleBar";
import { getOrCreateDefaultAuthUser, hydrateLocalStorageFromSharedStorage, UserProfile } from "./lib/profileStorage";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate the shared desktop/web progress store before creating any default profile.
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      await hydrateLocalStorageFromSharedStorage();
      if (cancelled) return;
      setUser(getOrCreateDefaultAuthUser());
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
        <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--bg)] text-[var(--text-1)]">
          <div className="card px-6 py-4 text-sm font-black">Loading Learn German</div>
        </div>
      ) : user ? (
        <GermanLearningLab />
      ) : (
        <LoginScreen onLogin={(authenticated) => setUser(authenticated)} />
      )}
    </>
  );
}
