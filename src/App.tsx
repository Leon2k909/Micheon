import React, { useState, useEffect } from "react";
import GermanLearningLab from "./german_learning_lab";
import { LoginScreen } from "./components/LoginScreen";
import { TitleBar } from "./components/TitleBar";
import { getAuthUser, getOrCreateDefaultAuthUser, UserProfile } from "./lib/profileStorage";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getOrCreateDefaultAuthUser());

  // Handle re-verification of "sessions"
  useEffect(() => {
    const active = getAuthUser();
    if (active) setUser(active);
  }, []);

  // TitleBar renders only inside the Electron desktop build (no-op on the website).
  return (
    <>
      <TitleBar />
      {user ? (
        <GermanLearningLab />
      ) : (
        <LoginScreen onLogin={(authenticated) => setUser(authenticated)} />
      )}
    </>
  );
}
