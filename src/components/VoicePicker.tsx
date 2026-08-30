import { useEffect, useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { ui } from "@/lib/i18n";
import { tts } from "@/lib/voice";
import { resolveEnglishVariant, getEnglishVariant } from "@/lib/englishVariant";
import {
  loadVoiceCatalog,
  setVoiceForLang,
  voiceForLang,
  type VoiceCatalog,
} from "@/lib/ttsVoice";

/**
 * Which voice reads each language out loud.
 *
 * The accent setting decides the language TAG; this decides who speaks it. They
 * are separate on purpose — someone learning British English may still prefer a
 * particular voice, and there was no way to hear the alternatives at all.
 */

/** A line to preview with, in the language being chosen. */
const SAMPLES: Record<string, string> = {
  de: "Guten Tag! Wollen wir anfangen?",
  en: "Hello! Shall we make a start?",
  fr: "Bonjour ! On commence ?",
  pl: "Dzień dobry! Zaczynamy?",
  es: "¡Hola! ¿Empezamos?",
  pt: "Olá! Vamos começar?",
};

const LANGUAGE_LABELS: Record<string, string> = {
  de: "German voice",
  en: "English voice",
  fr: "French voice",
  pl: "Polish voice",
  es: "Spanish voice",
  pt: "Portuguese voice",
};

export function VoicePicker() {
  const [catalog, setCatalog] = useState<VoiceCatalog | null>(null);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState("");

  useEffect(() => {
    let live = true;
    loadVoiceCatalog().then((data) => { if (live) setCatalog(data); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    setChosen({
      de: voiceForLang("de-DE"),
      en: voiceForLang("en-GB"),
      fr: voiceForLang("fr-FR"),
      pl: voiceForLang("pl-PL"),
      es: voiceForLang("es-ES"),
      pt: voiceForLang("pt-PT"),
    });
  }, [catalog]);

  const british = resolveEnglishVariant(getEnglishVariant()) === "british";

  // One row per language, not per regional tag: en-GB and en-US are one choice
  // to a person, and the app asks with whichever tag the accent setting implies.
  const groups = useMemo(() => {
    if (!catalog) return [];
    const choices = catalog.choices ?? {};
    const english = british
      ? [...(choices["en-GB"] ?? []), ...(choices["en-US"] ?? [])]
      : [...(choices["en-US"] ?? []), ...(choices["en-GB"] ?? [])];
    return [
      { lang: "de", voices: choices["de-DE"] ?? [], fallback: catalog.defaults?.["de-DE"] },
      { lang: "en", voices: english, fallback: catalog.defaults?.[british ? "en-GB" : "en-US"] },
      { lang: "fr", voices: choices["fr-FR"] ?? [], fallback: catalog.defaults?.["fr-FR"] },
      { lang: "pl", voices: choices["pl-PL"] ?? [], fallback: catalog.defaults?.["pl-PL"] },
      { lang: "es", voices: choices["es-ES"] ?? [], fallback: catalog.defaults?.["es-ES"] },
      { lang: "pt", voices: choices["pt-PT"] ?? [], fallback: catalog.defaults?.["pt-PT"] },
    ].filter((group) => group.voices.length > 0);
  }, [british, catalog]);

  // Spoken with the tag the app would really use, and the choice is saved
  // before previewing — so what you hear here is what a lesson will sound like.
  const preview = (lang: string) => {
    setPlaying(lang);
    const tag = lang === "en" ? (british ? "en-GB" : "en-US")
      : lang === "de" ? "de-DE"
      : lang === "pl" ? "pl-PL"
      : lang === "es" ? "es-ES"
      : lang === "pt" ? "pt-PT"
      : "fr-FR";
    tts(SAMPLES[lang] ?? SAMPLES.en, 0.95, tag).finally(() => setPlaying(""));
  };

  if (!catalog) return null;
  if (!groups.length) {
    return (
      <p className="mt-2 text-xs font-semibold text-[var(--text-3)]">
        {ui("Voices load when the app's audio service is running.")}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {groups.map((group) => {
        const current = chosen[group.lang] ?? "";
        return (
          <div key={group.lang}>
            <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui(LANGUAGE_LABELS[group.lang] ?? group.lang)}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <select
                className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-2 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                onChange={(event) => {
                  const next = event.target.value;
                  setChosen((prev) => ({ ...prev, [group.lang]: next }));
                  setVoiceForLang(group.lang, next);
                  if (next) preview(group.lang);
                }}
                value={current}
              >
                <option value="">
                  {ui("App default")}
                  {group.fallback ? ` — ${group.voices.find((v) => v.id === group.fallback)?.label ?? group.fallback}` : ""}
                </option>
                {group.voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.label} — {ui(voice.note)}
                  </option>
                ))}
              </select>
              <button
                aria-label={ui("Hear this voice")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--accent)] disabled:opacity-40"
                disabled={playing === group.lang}
                onClick={() => preview(group.lang)}
                title={ui("Hear this voice")}
                type="button"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      <p className="text-[10px] font-semibold text-[var(--text-3)]">
        {ui("The accent above decides how English is written and which accent is spoken; this decides who speaks it.")}
      </p>
    </div>
  );
}
