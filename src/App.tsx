import { useInterfaceLanguage } from "@/lib/interfaceLanguage";
import React, { lazy, Suspense, useEffect, useState } from "react";

import { applyAccentColour } from "@/lib/accentColour";
import { CodexPetHistoryWindow } from "./components/codexPets/CodexPetHistoryWindow";
import { CodexPetLayer } from "./components/codexPets/CodexPetLayer";
import { CodexPetProvider, useCodexPets } from "./components/codexPets/CodexPetProvider";
import { startFriendPeer, stopFriendPeer } from "@/lib/friendPeer";
import { primeSharedPhoto, readOwnFriendProfile } from "@/lib/friendPresence";
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
import { mirrorStoredPetPositions } from "./lib/petPosition";
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
      // Where the pets are is restored from the shared mirror below, so this
      // machine's own spots have to be in it first — see mirrorStoredPetPositions.
      await mirrorStoredPetPositions();
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
            <Suspense fallback={<LessonSkeleton />}>
              <GuidedLearningSession />
            </Suspense>
          ) : (
            <Suspense fallback={<MainSkeleton />}>
              <MicheonMain profile={user} onRequestSignIn={() => setShowLogin(true)} />
            </Suspense>
          )}
          <MainWindowPetSurface signedIn={Boolean(user)} />
          {user ? <FriendReachability user={user} /> : null}
        </CodexPetProvider>
      )}
    </>
  );
}

/**
 * Reachable to friends for as long as the app is open.
 *
 * The peer used to be started by the Friends panel and destroyed when it
 * closed, which made two apps able to reach each other only while BOTH were
 * sitting on that one screen. Any other time a friend was told "could not
 * connect", and their figures stayed at whenever the two screens last
 * happened to be open together — which reads as a friend who has not opened
 * the app in days.
 *
 * Being reachable is not the same as being open to anyone. An unknown peer
 * still earns a question and nothing else: nothing is stored, and the
 * connection waits until somebody answers it in Friends. That rule lives in
 * decideIncoming and is untouched by this.
 *
 * Renders nothing. It is here for its lifetime, not its output.
 */
function FriendReachability({ user }: { user: { name?: string; avatar?: string } }) {
  useEffect(() => {
    let live = true;
    void primeSharedPhoto(user?.avatar).finally(() => {
      if (!live) return;
      void startFriendPeer(() => readOwnFriendProfile(user));
    });
    return () => { live = false; };
    // The photo is the only part that has to be prepared in advance; the
    // figures are read fresh on every send.
  }, [user?.avatar, user?.name]);
  useEffect(() => () => stopFriendPeer(), []);
  return null;
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
/**
 * What fills the window while the LESSON chunk loads.
 *
 * The dashboard skeleton was standing in for both routes, so opening a lesson
 * showed a sidebar and stat chips for a moment and then replaced them with
 * something entirely different. A skeleton is only worth having if it is the
 * shape of what arrives: header with its progress bar, the step track, the
 * sentence panel, the continue button.
 */
function LessonSkeleton() {
  return (
    <div className="lesson-skeleton" aria-hidden="true">
      <div className="lesson-skeleton-topbar">
        <div className="lesson-skeleton-brand" />
        <div className="lesson-skeleton-progress" />
        <div className="lesson-skeleton-tools" />
      </div>
      <div className="lesson-skeleton-card">
        <div className="lesson-skeleton-steps">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((step) => (
            <div className="lesson-skeleton-step" key={step} />
          ))}
        </div>
        <div className="lesson-skeleton-prompt" />
        <div className="lesson-skeleton-sentence" />
        <div className="lesson-skeleton-cta" />
      </div>
    </div>
  );
}

function MainSkeleton() {
  return (
    <div className="main-skeleton" aria-hidden="true">
      <div className="main-skeleton-rail">
        <div className="main-skeleton-brand" />
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div className="main-skeleton-nav" key={row} />
        ))}
      </div>
      <div className="main-skeleton-body">
        <div className="main-skeleton-topline">
          <div className="main-skeleton-greeting" />
          <div className="main-skeleton-chips">
            {[0, 1, 2].map((chip) => (
              <div className="main-skeleton-chip" key={chip} />
            ))}
          </div>
        </div>
        <div className="main-skeleton-columns">
          <div className="main-skeleton-main">
            <div className="main-skeleton-hero" />
            <div className="main-skeleton-cta" />
            <div className="main-skeleton-cta is-short" />
          </div>
          <div className="main-skeleton-rail-right" />
        </div>
      </div>
    </div>
  );
}

