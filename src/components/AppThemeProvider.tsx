import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Theme as AstryxTheme } from "@astryxdesign/core";
import {
  THEME_PREFERENCES_EVENT,
  applyThemePresetToDom,
  applyThemeToDom,
  getTheme,
  getThemePreset,
  type ThemePreferences,
} from "@/lib/theme";
import {
  butterPurpleTheme,
  micheonButterTheme,
} from "@/themes/astryxThemes";

const AppThemePreferencesContext = createContext<ThemePreferences | null>(null);

export function useAppThemePreferences() {
  const preferences = useContext(AppThemePreferencesContext);
  if (!preferences) {
    throw new Error("useAppThemePreferences must be used inside AppThemeProvider");
  }
  return preferences;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ThemePreferences>(() => ({
    theme: getTheme(),
    preset: getThemePreset(),
  }));

  useEffect(() => {
    const update = (event: Event) => {
      const detail = (event as CustomEvent<ThemePreferences>).detail;
      setPreferences(detail ?? { theme: getTheme(), preset: getThemePreset() });
    };
    window.addEventListener(THEME_PREFERENCES_EVENT, update);
    return () => window.removeEventListener(THEME_PREFERENCES_EVENT, update);
  }, []);

  useLayoutEffect(() => {
    applyThemeToDom(preferences.theme);
    applyThemePresetToDom(preferences.preset);
  }, [preferences]);

  const activeTheme = useMemo(() => {
    if (preferences.preset === "butter") return micheonButterTheme;
    if (preferences.preset === "butter-purple") return butterPurpleTheme;
    return null;
  }, [preferences.preset]);

  return (
    <>
      <AppThemePreferencesContext.Provider value={preferences}>
        <Fragment key="micheon-application">{children}</Fragment>
      </AppThemePreferencesContext.Provider>
      {activeTheme && (
        <AstryxTheme key="astryx-runtime" theme={activeTheme} mode={preferences.theme}>
          {null}
        </AstryxTheme>
      )}
    </>
  );
}
