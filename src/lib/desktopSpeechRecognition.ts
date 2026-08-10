import { isElectronApp } from "@/lib/platform";

export type SpeechRecognitionState =
  | "checking"
  | "missing"
  | "downloading-runtime"
  | "installing-runtime"
  | "downloading-model"
  | "ready"
  | "transcribing"
  | "disabled"
  | "unsupported"
  | "error";

export type SpeechRecognitionStatus = {
  enabled: boolean;
  state: SpeechRecognitionState;
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  modelName: string;
  modelSizeBytes: number;
  runtimeVersion: string;
  message: string;
};

export type SpeechTranscription = {
  text: string;
  language: string;
  durationMs: number;
  tokens: Array<{ text: string; probability: number | null }>;
};

type SpeechRecognitionBridge = {
  getSpeechRecognitionStatus: () => Promise<SpeechRecognitionStatus>;
  installSpeechRecognition: () => Promise<SpeechRecognitionStatus>;
  uninstallSpeechRecognition: () => Promise<SpeechRecognitionStatus>;
  transcribeSpeech: (audio: ArrayBuffer, language: string) => Promise<SpeechTranscription>;
  onSpeechRecognitionStatus: (callback: (status: SpeechRecognitionStatus) => void) => () => void;
};

const listeners = new Set<() => void>();
let removeBridgeListener: (() => void) | null = null;
let refreshPromise: Promise<SpeechRecognitionStatus> | null = null;
let currentStatus: SpeechRecognitionStatus = {
  enabled: isElectronApp(),
  state: isElectronApp() ? "checking" : "unsupported",
  progress: 0,
  downloadedBytes: 0,
  totalBytes: 574041195,
  modelName: "large-v3-turbo-q5_0",
  modelSizeBytes: 574041195,
  runtimeVersion: "1.9.2",
  message: "",
};

function bridge(): SpeechRecognitionBridge | null {
  if (typeof window === "undefined") return null;
  return ((window as Window & typeof globalThis & { germDesktop?: Partial<SpeechRecognitionBridge> }).germDesktop
    ?? null) as SpeechRecognitionBridge | null;
}

function setStatus(status: SpeechRecognitionStatus) {
  currentStatus = { ...currentStatus, ...status };
  listeners.forEach((listener) => listener());
}

function ensureSubscription() {
  const api = bridge();
  if (!api?.onSpeechRecognitionStatus || removeBridgeListener) return;
  removeBridgeListener = api.onSpeechRecognitionStatus(setStatus);
}

export function getSpeechRecognitionSnapshot(): SpeechRecognitionStatus {
  return currentStatus;
}

export function subscribeSpeechRecognition(listener: () => void): () => void {
  listeners.add(listener);
  ensureSubscription();
  void refreshSpeechRecognitionStatus();
  return () => listeners.delete(listener);
}

export function refreshSpeechRecognitionStatus(): Promise<SpeechRecognitionStatus> {
  const api = bridge();
  if (!api?.getSpeechRecognitionStatus) return Promise.resolve(currentStatus);
  ensureSubscription();
  if (!refreshPromise) {
    refreshPromise = api.getSpeechRecognitionStatus()
      .then((status) => {
        setStatus(status);
        return currentStatus;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function installSpeechRecognition(): Promise<SpeechRecognitionStatus> {
  const api = bridge();
  if (!api?.installSpeechRecognition) throw new Error("Speech recognition is only installed in the Micheon desktop app.");
  const status = await api.installSpeechRecognition();
  setStatus(status);
  return status;
}

export async function uninstallSpeechRecognition(): Promise<SpeechRecognitionStatus> {
  const api = bridge();
  if (!api?.uninstallSpeechRecognition) throw new Error("Speech recognition is only installed in the Micheon desktop app.");
  const status = await api.uninstallSpeechRecognition();
  setStatus(status);
  return status;
}

export async function transcribeSpeech(audio: ArrayBuffer, language: string): Promise<SpeechTranscription> {
  const api = bridge();
  if (!api?.transcribeSpeech) throw new Error("Desktop speech recognition is not available.");
  return api.transcribeSpeech(audio, language);
}

