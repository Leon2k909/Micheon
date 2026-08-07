import { useInterfaceLanguage } from "@/lib/interfaceLanguage";
import React, { lazy, Suspense, useEffect, useState } from "react";

import { applyAccentColour } from "@/lib/accentColour";
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
  migrateToDarkThemeDefault,
  watchStoredThemePreferences,
  watchSystemTheme,
} from "./lib/theme";
import { isElectronApp } from "./lib/platform";
import { MotionConfig } from "framer-motion";
import { EFFECTS_CHANGE_EVENT, getEffects, type Effects } from "./lib/effects";

// Pet windows keep a tiny render path. The learning catalog and session engine
// are loaded only by the surface that needs them, so a visible mascot does not
// retain the full application bundle.
const GuidedLearningSession = lazy(() => import("./guided_learning_session"));
const MicheonMain = lazy(() => import("./prototype/NewUiPrototype"));

/**
 * Every framer-motion animation in the app, gated in one place.
 *
 * Only five of the twenty-nine files that animate ever checked the reduced
 * effects setting, so turning it on left most of the motion running. Motion
 * is driven by script rather than CSS, so no stylesheet can reach it —
 * MotionConfig can, for the whole tree at once.
 */
export function MotionGate({ children }: { children: React.ReactNode }) {
  const [effects, setEffectsState] = useState<Effects>(getEffects);
  useEffect(() => {
    const sync = () => setEffectsState(getEffects());
    window.addEventListener(EFFECTS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(EFFECTS_CHANGE_EVENT, sync);
  }, []);
  return (
    <MotionConfig reducedMotion={effects === "lite" ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

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
  // ui() is a plain lookup read during render, so nothing re-runs by itself
  // when the interface language changes. Subscribing here is what turns the
  // setting into a re-render of the whole tree rather than a reload. Nothing
  // below is memoised, so one root render reaches every ui() call.
  useInterfaceLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateProfile() {
      await hydrateLocalStorageFromSharedStorage();
      if (cancelled) return;
      migrateToDarkThemeDefault();
      applyStoredThemePreferences();
      applyAccentColour();
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
  // Follows the OS while the preference is "system".
  useEffect(() => watchSystemTheme(), []);

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

/**
 * What fills the screen while a lazy route loads.
 *
 * This was a hardcoded cream (#fffaf1) with no dark variant, and it is the
 * fallback for BOTH main routes -- so pressing "Continue learning" in dark
 * mode painted a full-viewport near-white rectangle for as long as the guided
 * chunk took to arrive. That is the flash. It follows the theme now.
 */
function MainSkeleton() {
  return (
    <div className="main-skeleton flex min-h-[var(--app-h)] items-center justify-center p-6">
      <div className="main-skeleton-card w-full max-w-sm rounded-[28px] p-6">
        <div className="main-skeleton-bar h-4 w-24 rounded-full" />
        <div className="main-skeleton-bar mt-5 h-10 w-3/4 rounded-2xl" />
        <div className="main-skeleton-bar mt-3 h-4 w-1/2 rounded-full" />
        <div className="main-skeleton-bar mt-8 h-44 rounded-[22px]" />
      </div>
    </div>
  );
}
