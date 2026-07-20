import { syncLocalStorageItem } from "@/lib/profileStorage";

// Which offline Whisper model the desktop app uses for dictation.
//
// Measured on the app's own TTS sentences degraded to laptop-mic conditions
// (quieter, room echo, pink-noise hiss), word error rate:
//
//   whisper-tiny  fp32  147MB   15.4%  (harsh: 29.1%)   ← the old default
//   whisper-base  q8     76MB    0.0%  (harsh: 11.7%)   ← default now
//   whisper-small q8    240MB    0.0%  (harsh:  4.2%)   ← opt-in
//
// base is smaller AND far more accurate than the old tiny/fp32 pairing, so it
// is the default. small is offered for people who want maximum accuracy and
// don't mind a bigger one-time download and roughly double the transcribe time.
const KEY = "gl-voice-model";

export type VoiceModelChoice = "balanced" | "accurate";

export const VOICE_MODELS: Record<VoiceModelChoice, { repo: string; dtype: string; label: string; note: string }> = {
  balanced: {
    repo: "onnx-community/whisper-base",
    dtype: "q8",
    label: "Balanced",
    note: "~76 MB one-time download. Fast and accurate for everyday speech.",
  },
  accurate: {
    repo: "onnx-community/whisper-small",
    dtype: "q8",
    label: "Most accurate",
    note: "~240 MB one-time download. Better in noisy rooms; about twice as slow.",
  },
};

export function getVoiceModel(): VoiceModelChoice {
  if (typeof window === "undefined") return "balanced";
  try {
    return localStorage.getItem(KEY) === "accurate" ? "accurate" : "balanced";
  } catch {
    return "balanced";
  }
}

export function setVoiceModel(choice: VoiceModelChoice) {
  try { localStorage.setItem(KEY, choice); } catch { /* ignore */ }
  syncLocalStorageItem(KEY, choice);
}

export function voiceModelConfig() {
  return VOICE_MODELS[getVoiceModel()];
}
