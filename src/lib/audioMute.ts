import { syncLocalStorageItem } from "@/lib/profileStorage";

const LEGACY_MUTE_KEY = "gl-audio-muted";
const SETTINGS_KEY = "gl-audio-settings-v1";

export const AUDIO_MUTE_EVENT = "gl-audio-mute-changed";
export const AUDIO_SETTINGS_EVENT = AUDIO_MUTE_EVENT;

export type TtsAudioLanguage = "english" | "german";

export interface AudioSettings {
  muted: boolean;
  masterVolume: number;
  englishVolume: number;
  germanVolume: number;
  englishMuted: boolean;
  germanMuted: boolean;
}

type StoredAudioSettings = Omit<AudioSettings, "muted">;

const DEFAULT_SETTINGS: StoredAudioSettings = {
  masterVolume: 1,
  englishVolume: 1,
  germanVolume: 1,
  englishMuted: false,
  germanMuted: false,
};

function clampVolume(value: unknown, fallback = 1): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number));
}

function readStoredSettings(): StoredAudioSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<StoredAudioSettings> | null;
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_SETTINGS };
    return {
      masterVolume: clampVolume(parsed.masterVolume, DEFAULT_SETTINGS.masterVolume),
      englishVolume: clampVolume(parsed.englishVolume, DEFAULT_SETTINGS.englishVolume),
      germanVolume: clampVolume(parsed.germanVolume, DEFAULT_SETTINGS.germanVolume),
      englishMuted: parsed.englishMuted === true,
      germanMuted: parsed.germanMuted === true,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeStoredSettings(settings: StoredAudioSettings) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(settings);
  try { window.localStorage.setItem(SETTINGS_KEY, raw); } catch { /* keep audio usable */ }
  syncLocalStorageItem(SETTINGS_KEY, raw);
}

function writeMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  const value = muted ? "1" : "0";
  try { window.localStorage.setItem(LEGACY_MUTE_KEY, value); } catch { /* keep audio usable */ }
  syncLocalStorageItem(LEGACY_MUTE_KEY, value);
}

function emitAudioSettingsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUDIO_SETTINGS_EVENT));
  }
}

/** All persisted app-audio controls, including the legacy global mute flag. */
export function getAudioSettings(): AudioSettings {
  return { muted: isAudioMuted(), ...readStoredSettings() };
}

/** Global app-audio mute: silences TTS voices and game-feel sounds. */
export function isAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(LEGACY_MUTE_KEY) === "1"; }
  catch { return false; }
}

export function setAudioMuted(muted: boolean) {
  const stored = readStoredSettings();
  // A master slider left at zero should not make “unmute” appear broken.
  if (!muted && stored.masterVolume <= 0) {
    writeStoredSettings({ ...stored, masterVolume: 0.8 });
  }
  writeMuted(muted);
  emitAudioSettingsChanged();
}

export function toggleAudioMuted(): boolean {
  const settings = getAudioSettings();
  const currentlySilent = settings.muted || settings.masterVolume <= 0;
  setAudioMuted(!currentlySilent);
  return !currentlySilent;
}

/** Effective volume for non-language-specific app sounds. */
export function getMasterAudioVolume(): number {
  const settings = getAudioSettings();
  return settings.muted ? 0 : settings.masterVolume;
}

export function setMasterAudioVolume(volume: number) {
  const stored = readStoredSettings();
  const nextVolume = clampVolume(volume);
  writeStoredSettings({ ...stored, masterVolume: nextVolume });
  // Moving a silent slider up is an explicit request to hear audio again.
  if (nextVolume > 0 && isAudioMuted()) writeMuted(false);
  emitAudioSettingsChanged();
}

export function audioLanguageFromTag(lang: string): TtsAudioLanguage | null {
  const base = String(lang || "").trim().toLowerCase().split(/[-_]/)[0];
  if (base === "en") return "english";
  if (base === "de") return "german";
  return null;
}

export function isTtsLanguageMuted(language: TtsAudioLanguage): boolean {
  const settings = readStoredSettings();
  return language === "english"
    ? settings.englishMuted || settings.englishVolume <= 0
    : settings.germanMuted || settings.germanVolume <= 0;
}

export function setTtsLanguageMuted(language: TtsAudioLanguage, muted: boolean) {
  const stored = readStoredSettings();
  if (language === "english") {
    writeStoredSettings({
      ...stored,
      englishMuted: muted,
      englishVolume: !muted && stored.englishVolume <= 0 ? 0.8 : stored.englishVolume,
    });
  } else {
    writeStoredSettings({
      ...stored,
      germanMuted: muted,
      germanVolume: !muted && stored.germanVolume <= 0 ? 0.8 : stored.germanVolume,
    });
  }
  emitAudioSettingsChanged();
}

export function toggleTtsLanguageMuted(language: TtsAudioLanguage): boolean {
  const next = !isTtsLanguageMuted(language);
  setTtsLanguageMuted(language, next);
  return next;
}

export function setTtsLanguageVolume(language: TtsAudioLanguage, volume: number) {
  const stored = readStoredSettings();
  const nextVolume = clampVolume(volume);
  const next = language === "english"
    ? { ...stored, englishVolume: nextVolume, englishMuted: nextVolume > 0 ? false : stored.englishMuted }
    : { ...stored, germanVolume: nextVolume, germanMuted: nextVolume > 0 ? false : stored.germanMuted };
  writeStoredSettings(next);
  emitAudioSettingsChanged();
}

/** Effective volume for a spoken language after master and language controls. */
export function getTtsAudioVolume(lang: string): number {
  const settings = getAudioSettings();
  if (settings.muted || settings.masterVolume <= 0) return 0;
  const language = audioLanguageFromTag(lang);
  if (language === "english") {
    return settings.englishMuted ? 0 : settings.masterVolume * settings.englishVolume;
  }
  if (language === "german") {
    return settings.germanMuted ? 0 : settings.masterVolume * settings.germanVolume;
  }
  return settings.masterVolume;
}

// The desktop pet is rendered in a separate Electron window. Bridge native
// storage changes (and the app's shared-storage hydration event) into the same
// event used by components in the current window.
if (typeof window !== "undefined") {
  const bridgedWindow = window as Window & { __micheonAudioStorageBridge?: boolean };
  if (!bridgedWindow.__micheonAudioStorageBridge) {
    bridgedWindow.__micheonAudioStorageBridge = true;
    window.addEventListener("storage", (event) => {
      if (event.key === LEGACY_MUTE_KEY || event.key === SETTINGS_KEY) {
        emitAudioSettingsChanged();
      }
    });
    window.addEventListener("storage-sync-completed", emitAudioSettingsChanged);
  }
}
