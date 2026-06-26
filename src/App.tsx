import React, { useState, useEffect } from "react";
import GermanLearningLab from "./german_learning_lab";
import { LoginScreen } from "./components/LoginScreen";
import { getAuthUser, getOrCreateDefaultAuthUser, UserProfile } from "./lib/profileStorage";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getOrCreateDefaultAuthUser());

  // Handle re-verification of "sessions"
  useEffect(() => {
    const active = getAuthUser();
    if (active) setUser(active);
  }, []);

  if (!user) {
    return <LoginScreen onLogin={(authenticated) => setUser(authenticated)} />;
  }

  return <GermanLearningLab />;
}
