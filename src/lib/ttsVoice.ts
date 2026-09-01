import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * Which voice reads each language aloud.
 *
 * The app already picked the right language TAG for every situation — German
 * for the target sentence, en-GB or en-US for the learner's own English. What
 * it never let you choose was the voice inside that language: whether German
 * is Katja or Conrad, whether British English is Sonia or Ryan.
 *
 * Stored per language tag. Empty means "whatever the server picks for that
 * language", so someone who never opens this hears exactly what they heard
 * before.
 */
const TTS_VOICE_KEY = "gl-tts-voice-v1";
export const TTS_VOICE_EVENT = "tts-voice-changed";

type VoiceChoice = { id: string; label: string; note: string };
export type VoiceCatalog = {
  choices: Record<string, VoiceChoice[]>;
  defaults: Record<string, string>;
};

type VoiceMap = Record<string, string>;

function read(): VoiceMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TTS_VOICE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: VoiceMap = {};
    for (const [lang, voice] of Object.entries(parsed)) {
      if (typeof voice === "string" && voice.trim()) out[lang] = voice.trim().slice(0, 80);
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * The voice for a language tag, or "" to let the server choose.
 *
 * Falls back along the tag so a choice made for English still applies when the
 * app asks with a regional variant it has no separate setting for.
 */
export function voiceForLang(lang: string): string {
  const map = read();
  const tag = String(lang ?? "").trim();
  if (map[tag]) return map[tag];
  const base = tag.split(/[-_]/)[0].toLowerCase();
  for (const [key, voice] of Object.entries(map)) {
    if (key.split(/[-_]/)[0].toLowerCase() === base) return voice;
  }
  return "";
}

/** Pass an empty voice to go back to the server's own pick for that language. */
export function setVoiceForLang(lang: string, voice: string) {
  if (typeof window === "undefined") return;
  const map = read();
  const trimmed = String(voice ?? "").trim();
  if (trimmed) map[lang] = trimmed;
  else delete map[lang];

  const raw = JSON.stringify(map);
  try {
    window.localStorage.setItem(TTS_VOICE_KEY, raw);
  } catch {
    /* the change still applies in memory */
  }
  syncLocalStorageItem(TTS_VOICE_KEY, raw);
  window.dispatchEvent(new Event(TTS_VOICE_EVENT));
}

let catalogPromise: Promise<VoiceCatalog> | null = null;

/** The voices the server will actually synthesise, fetched once. */
export function loadVoiceCatalog(): Promise<VoiceCatalog> {
  if (!catalogPromise) {
    catalogPromise = fetch("/api/tts/voices")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("voices"))))
      .then((data) => ({
        choices: data?.choices && typeof data.choices === "object" ? data.choices : {},
        defaults: data?.defaults && typeof data.defaults === "object" ? data.defaults : {},
      }))
      .catch(() => {
        // Offline or the server is not up. Let the next open try again rather
        // than caching an empty list forever.
        catalogPromise = null;
        return { choices: {}, defaults: {} };
      });
  }
  return catalogPromise;
}
