import { syncLocalStorageItem } from "@/lib/profileStorage";

const LEGACY_MUTE_KEY = "gl-audio-muted";
const SETTINGS_KEY = "gl-audio-settings-v1";

export const AUDIO_MUTE_EVENT = "gl-audio-mute-changed";
export const AUDIO_SETTINGS_EVENT = AUDIO_MUTE_EVENT;

// Every language the app can speak has its own mute, volume and speed. French
// arrived with the French course and Polish with the Polish one; a voice with
// no controls of its own would have been the one voice you could not turn down.
export type TtsAudioLanguage = "english" | "german" | "french" | "polish" | "spanish" | "portuguese" | "russian";

export interface AudioSettings {
  muted: boolean;
  masterVolume: number;
  sfxVolume: number;
  englishVolume: number;
  germanVolume: number;
  frenchVolume: number;
  polishVolume: number;
  spanishVolume: number;
  portugueseVolume: number;
  russianVolume: number;
  sfxMuted: boolean;
  englishMuted: boolean;
  germanMuted: boolean;
  frenchMuted: boolean;
  polishMuted: boolean;
  spanishMuted: boolean;
  portugueseMuted: boolean;
  russianMuted: boolean;
  /** Legacy shared value retained so older profiles migrate without a reset. */
  speechRate: number;
  englishSpeechRate: number;
  germanSpeechRate: number;
  frenchSpeechRate: number;
  polishSpeechRate: number;
  spanishSpeechRate: number;
  portugueseSpeechRate: number;
  russianSpeechRate: number;
}

type StoredAudioSettings = Omit<AudioSettings, "muted">;

const DEFAULT_SETTINGS: StoredAudioSettings = {
  masterVolume: 1,
  sfxVolume: 1,
  englishVolume: 1,
  germanVolume: 1,
  frenchVolume: 1,
  polishVolume: 1,
  spanishVolume: 1,
  portugueseVolume: 1,
  russianVolume: 1,
  sfxMuted: false,
  englishMuted: false,
  germanMuted: false,
  frenchMuted: false,
  polishMuted: false,
  spanishMuted: false,
  portugueseMuted: false,
  russianMuted: false,
  speechRate: 1,
  englishSpeechRate: 1,
  germanSpeechRate: 1,
  frenchSpeechRate: 1,
  polishSpeechRate: 1,
  spanishSpeechRate: 1,
  portugueseSpeechRate: 1,
  russianSpeechRate: 1,
};

/** Selectable speech-speed multipliers, applied on top of each clip's own pace. */
export const TTS_SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

function clampVolume(value: unknown, fallback = 1): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number));
}

function clampSpeechRate(value: unknown, fallback = 1): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  // 2x is the ceiling the TTS server can render: it converts this to an
  // edge-tts "+N%" and clamps that at +100%. Asking for more would silently
  // come back at 2x anyway.
  return Math.min(2, Math.max(0.5, number));
}

function readStoredSettings(): StoredAudioSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<StoredAudioSettings> | null;
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_SETTINGS };
    // Profiles saved before per-language speed existed carry one speechRate.
    // Use it for both voices on first read so upgrading changes no audio.
    const legacySpeechRate = clampSpeechRate(parsed.speechRate, DEFAULT_SETTINGS.speechRate);
    return {
      masterVolume: clampVolume(parsed.masterVolume, DEFAULT_SETTINGS.masterVolume),
      sfxVolume: clampVolume(parsed.sfxVolume, DEFAULT_SETTINGS.sfxVolume),
      englishVolume: clampVolume(parsed.englishVolume, DEFAULT_SETTINGS.englishVolume),
      germanVolume: clampVolume(parsed.germanVolume, DEFAULT_SETTINGS.germanVolume),
      frenchVolume: clampVolume(parsed.frenchVolume, DEFAULT_SETTINGS.frenchVolume),
      polishVolume: clampVolume(parsed.polishVolume, DEFAULT_SETTINGS.polishVolume),
      spanishVolume: clampVolume(parsed.spanishVolume, DEFAULT_SETTINGS.spanishVolume),
      portugueseVolume: clampVolume(parsed.portugueseVolume, DEFAULT_SETTINGS.portugueseVolume),
      russianVolume: clampVolume(parsed.russianVolume, DEFAULT_SETTINGS.russianVolume),
      sfxMuted: parsed.sfxMuted === true,
      englishMuted: parsed.englishMuted === true,
      germanMuted: parsed.germanMuted === true,
      frenchMuted: parsed.frenchMuted === true,
      polishMuted: parsed.polishMuted === true,
      spanishMuted: parsed.spanishMuted === true,
      portugueseMuted: parsed.portugueseMuted === true,
      russianMuted: parsed.russianMuted === true,
      speechRate: legacySpeechRate,
      englishSpeechRate: clampSpeechRate(parsed.englishSpeechRate, legacySpeechRate),
      germanSpeechRate: clampSpeechRate(parsed.germanSpeechRate, legacySpeechRate),
      frenchSpeechRate: clampSpeechRate(parsed.frenchSpeechRate, legacySpeechRate),
      polishSpeechRate: clampSpeechRate(parsed.polishSpeechRate, legacySpeechRate),
      spanishSpeechRate: clampSpeechRate(parsed.spanishSpeechRate, legacySpeechRate),
      portugueseSpeechRate: clampSpeechRate(parsed.portugueseSpeechRate, legacySpeechRate),
      russianSpeechRate: clampSpeechRate(parsed.russianSpeechRate, legacySpeechRate),
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

/** The state represented by the app-wide speaker button. */
export function isMasterAudioSilent(settings: AudioSettings = getAudioSettings()): boolean {
  return settings.muted || settings.masterVolume <= 0;
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

export function isSfxMuted(): boolean {
  const settings = readStoredSettings();
  return settings.sfxMuted || settings.sfxVolume <= 0;
}

export function setSfxMuted(muted: boolean) {
  const stored = readStoredSettings();
  writeStoredSettings({
    ...stored,
    sfxMuted: muted,
    sfxVolume: !muted && stored.sfxVolume <= 0 ? 0.8 : stored.sfxVolume,
  });
  emitAudioSettingsChanged();
}

export function toggleSfxMuted(): boolean {
  const next = !isSfxMuted();
  setSfxMuted(next);
  return next;
}

export function setSfxAudioVolume(volume: number) {
  const stored = readStoredSettings();
  const nextVolume = clampVolume(volume);
  writeStoredSettings({
    ...stored,
    sfxVolume: nextVolume,
    sfxMuted: nextVolume > 0 ? false : stored.sfxMuted,
  });
  emitAudioSettingsChanged();
}

/** Effective answer-sound volume after master and SFX controls. */
export function getSfxAudioVolume(settings: AudioSettings = getAudioSettings()): number {
  if (settings.muted || settings.masterVolume <= 0 || settings.sfxMuted) return 0;
  return settings.masterVolume * settings.sfxVolume;
}

/** The shared value while every voice matches, otherwise there is no single rate. */
export function getMasterTtsSpeechRate(settings: AudioSettings = getAudioSettings()): number | null {
  const rates = [
    settings.englishSpeechRate,
    settings.germanSpeechRate,
    settings.frenchSpeechRate,
    settings.polishSpeechRate,
    settings.spanishSpeechRate,
    settings.portugueseSpeechRate,
  ];
  return rates.every((rate) => Math.abs(rate - rates[0]) < 0.01) ? rates[0] : null;
}

/** Absolute speech speed for one voice. Without a language, return the shared
 * rate when there is one and the legacy master value while the voices differ. */
export function getTtsSpeechRate(lang?: string | TtsAudioLanguage): number {
  const settings = getAudioSettings();
  const language = lang === "english" || lang === "german" || lang === "french" || lang === "polish" || lang === "spanish" || lang === "portuguese"
    ? lang
    : audioLanguageFromTag(lang ?? "");
  if (language === "english") return settings.englishSpeechRate;
  if (language === "german") return settings.germanSpeechRate;
  if (language === "french") return settings.frenchSpeechRate;
  if (language === "polish") return settings.polishSpeechRate;
  if (language === "spanish") return settings.spanishSpeechRate;
  if (language === "portuguese") return settings.portugueseSpeechRate;
  return getMasterTtsSpeechRate(settings) ?? settings.speechRate;
}

/** Master is a batch control, not another multiplier: both voices become the
 * selected absolute speed, so 1.25x never turns into a surprising 1.56x. */
export function setTtsSpeechRate(rate: number) {
  const stored = readStoredSettings();
  const nextRate = clampSpeechRate(rate);
  writeStoredSettings({
    ...stored,
    speechRate: nextRate,
    englishSpeechRate: nextRate,
    germanSpeechRate: nextRate,
    frenchSpeechRate: nextRate,
    polishSpeechRate: nextRate,
    spanishSpeechRate: nextRate,
    portugueseSpeechRate: nextRate,
  });
  emitAudioSettingsChanged();
}

/** The three fields each language owns, so nothing is keyed by an if/else. */
const VOLUME_FIELD = {
  english: "englishVolume",
  german: "germanVolume",
  french: "frenchVolume",
  polish: "polishVolume",
  spanish: "spanishVolume",
  portuguese: "portugueseVolume",
  russian: "russianVolume",
} as const;
const MUTED_FIELD = {
  english: "englishMuted",
  german: "germanMuted",
  french: "frenchMuted",
  polish: "polishMuted",
  spanish: "spanishMuted",
  portuguese: "portugueseMuted",
  russian: "russianMuted",
} as const;
const RATE_FIELD = {
  english: "englishSpeechRate",
  german: "germanSpeechRate",
  french: "frenchSpeechRate",
  polish: "polishSpeechRate",
  spanish: "spanishSpeechRate",
  portuguese: "portugueseSpeechRate",
  russian: "russianSpeechRate",
} as const;

export function setTtsLanguageSpeechRate(language: TtsAudioLanguage, rate: number) {
  const stored = readStoredSettings();
  const nextRate = clampSpeechRate(rate);
  const next = { ...stored, [RATE_FIELD[language]]: nextRate };
  // Keep the old shared field useful to older builds whenever every channel
  // has been brought back to the same value manually.
  if (
    Math.abs(next.englishSpeechRate - next.germanSpeechRate) < 0.01
    && Math.abs(next.englishSpeechRate - next.frenchSpeechRate) < 0.01
    && Math.abs(next.englishSpeechRate - next.polishSpeechRate) < 0.01
    && Math.abs(next.englishSpeechRate - next.spanishSpeechRate) < 0.01
    && Math.abs(next.englishSpeechRate - next.portugueseSpeechRate) < 0.01
  ) {
    next.speechRate = nextRate;
  }
  writeStoredSettings(next);
  emitAudioSettingsChanged();
}

export function audioLanguageFromTag(lang: string): TtsAudioLanguage | null {
  const base = String(lang || "").trim().toLowerCase().split(/[-_]/)[0];
  if (base === "en") return "english";
  if (base === "de") return "german";
  if (base === "fr") return "french";
  if (base === "pl") return "polish";
  if (base === "es") return "spanish";
  if (base === "pt") return "portuguese";
  if (base === "ru") return "russian";
  return null;
}

export function isTtsLanguageMuted(language: TtsAudioLanguage): boolean {
  const settings = readStoredSettings();
  return settings[MUTED_FIELD[language]] || settings[VOLUME_FIELD[language]] <= 0;
}

export function setTtsLanguageMuted(language: TtsAudioLanguage, muted: boolean) {
  const stored = readStoredSettings();
  const volume = stored[VOLUME_FIELD[language]];
  writeStoredSettings({
    ...stored,
    [MUTED_FIELD[language]]: muted,
    // Unmuting a voice whose slider is at zero would look broken.
    [VOLUME_FIELD[language]]: !muted && volume <= 0 ? 0.8 : volume,
  });
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
  writeStoredSettings({
    ...stored,
    [VOLUME_FIELD[language]]: nextVolume,
    [MUTED_FIELD[language]]: nextVolume > 0 ? false : stored[MUTED_FIELD[language]],
  });
  emitAudioSettingsChanged();
}

/** Effective volume for a spoken language after master and language controls. */
export function getTtsAudioVolume(lang: string, settings: AudioSettings = getAudioSettings()): number {
  if (settings.muted || settings.masterVolume <= 0) return 0;
  const language = audioLanguageFromTag(lang);
  if (!language) return settings.masterVolume;
  return settings[MUTED_FIELD[language]]
    ? 0
    : settings.masterVolume * settings[VOLUME_FIELD[language]];
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
