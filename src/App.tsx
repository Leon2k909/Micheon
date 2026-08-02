import React, { lazy, Suspense, useEffect, useState } from "react";

import { CodexPetHistoryWindow } from "./components/codexPets/CodexPetHistoryWindow";
import { CodexPetLayer } from "./components/codexPets/CodexPetLayer";
import { CodexPetProvider, useCodexPets } from "./components/codexPets/CodexPetProvider";
import { LoginScreen } from "./components/LoginScreen";
import { TitleBar } from "./components/TitleBar";
import { UpdateBanner } from "./components/UpdateBanner";
import {
  getAuthUser,
  hydrateLocalStorageFromSharedStorage,
  recordKnownProfile,
  type UserProfile,
} from "./lib/profileStorage";
import {
  applyStoredThemePreferences,
  migrateToLightThemeDefault,
  watchStoredThemePreferences,
} from "./lib/theme";
import { isElectronApp } from "./lib/platform";

// Pet windows keep a tiny render path. The learning catalog and session engine
// are loaded only by the surface that needs them, so a visible mascot does not
// retain the full application bundle.
const GuidedLearningSession = lazy(() => import("./guided_learning_session"));
const MicheonMain = lazy(() => import("./prototype/NewUiPrototype"));

export default function App() {
  const search = new URLSearchParams(window.location.search);
  const isPetOverlay = search.get("pet-overlay") === "1";
  const isPetHistory = search.get("pet-history") === "1";

  if (isPetOverlay) {
    return (
      <CodexPetProvider>
        <PetOverlaySurface />
      </CodexPetProvider>
    );
  }

  if (isPetHistory) {
    return (
      <CodexPetProvider>
        <CodexPetHistoryWindow />
      </CodexPetProvider>
    );
  }

  return <MicheonSurface guided={search.has("guided")} />;
}

function useMicheonProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateProfile() {
      await hydrateLocalStorageFromSharedStorage();
      if (cancelled) return;
      migrateToLightThemeDefault();
      applyStoredThemePreferences();
      const current = getAuthUser();
      if (current) recordKnownProfile(current);
      setUser(current);
      setReady(true);
    }

    const handleFocus = () => {
      void hydrateProfile();
    };

    void hydrateProfile();
    window.addEventListener("focus", handleFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => watchStoredThemePreferences(), []);

  return { ready, setUser, user };
}

function MicheonSurface({ guided }: { guided: boolean }) {
  const { ready, setUser, user } = useMicheonProfile();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <TitleBar variant="prototype" />
      <UpdateBanner />
      {!ready ? (
        <MainSkeleton />
      ) : (
        <CodexPetProvider>
          {!user || showLogin ? (
            <LoginScreen
              onLogin={(authenticated) => {
                setUser(authenticated);
                setShowLogin(false);
              }}
            />
          ) : guided ? (
            <Suspense fallback={<MainSkeleton />}>
              <GuidedLearningSession />
            </Suspense>
          ) : (
            <Suspense fallback={<MainSkeleton />}>
              <MicheonMain profile={user} onRequestSignIn={() => setShowLogin(true)} />
            </Suspense>
          )}
          <MainWindowPetSurface signedIn={Boolean(user)} />
        </CodexPetProvider>
      )}
    </>
  );
}

function PetOverlaySurface() {
  const { petDisplayMode } = useCodexPets();
  if (isElectronApp() && petDisplayMode === "app") return null;
  return <CodexPetLayer />;
}

function MainWindowPetSurface({ signedIn }: { signedIn: boolean }) {
  const { petDisplayMode } = useCodexPets();
  if (isElectronApp()) {
    return petDisplayMode === "app" ? <CodexPetLayer /> : null;
  }
  return signedIn ? <CodexPetLayer /> : null;
}

function MainSkeleton() {
  return (
    <div className="flex min-h-[var(--app-h)] items-center justify-center bg-[#fffaf1] p-6">
      <div className="w-full max-w-sm rounded-[28px] border border-[#e8e0d4] bg-[#fffdf8] p-6 shadow-[0_24px_70px_rgba(82,68,53,0.16)]">
        <div className="h-4 w-24 rounded-full bg-[#eee9df]" />
        <div className="mt-5 h-10 w-3/4 rounded-2xl bg-[#f8f4eb]" />
        <div className="mt-3 h-4 w-1/2 rounded-full bg-[#eee9df]" />
        <div className="mt-8 h-44 rounded-[22px] bg-[#f8f4eb]" />
      </div>
    </div>
  );
}
