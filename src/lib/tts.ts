/**
 * Speak text in German using the best available TTS voice.
 * Priority: Microsoft Edge neural voices → any de-DE voice → any de voice → fallback.
 */

// Voice preference order — Edge neural voices first, then standard Windows voices
const PREFERRED_VOICES = [
  "Microsoft Conrad Online (Natural) - German (Germany)",
  "Microsoft Katja Online (Natural) - German (Germany)",
  "Microsoft Conrad - German (Germany)",
  "Microsoft Katja - German (Germany)",
  "Microsoft Hedda - German (Germany)",
];

function pickGermanVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // 1. Try preferred list in order
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }

  // 2. Any de-DE voice
  const deDE = voices.find((v) => v.lang === "de-DE");
  if (deDE) return deDE;

  // 3. Any German voice
  const de = voices.find((v) => v.lang.startsWith("de"));
  if (de) return de;

  return null;
}

export function speakGerman(text: string, rate = 0.88, pitch = 1): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "de-DE";
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = 1;

  // Voices may not be loaded yet — try immediately, retry after load
  const voice = pickGermanVoice();
  if (voice) {
    utter.voice = voice;
    window.speechSynthesis.speak(utter);
  } else {
    // Voices not loaded yet (common on first call)
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      const v = pickGermanVoice();
      if (v) utter.voice = v;
      window.speechSynthesis.speak(utter);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Fallback: speak without a specific voice after 300ms if event never fires
    setTimeout(() => {
      if (!utter.voice) window.speechSynthesis.speak(utter);
    }, 300);
  }
}
