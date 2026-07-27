import { tts } from "@/lib/voice";

/**
 * Backwards-compatible game helper. Keeping it routed through the shared TTS
 * player means the selected voice, master volume, and German mute all apply.
 */
export function speakGerman(text: string, rate = 0.88, _pitch = 1): void {
  void tts(text, rate, "de-DE");
}
