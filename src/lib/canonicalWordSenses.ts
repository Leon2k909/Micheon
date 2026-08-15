/**
 * Reviewed standalone meanings for German words that are genuinely
 * polysemous across Micheon's contextual packs.
 *
 * A lesson about academic writing may correctly teach `belegen` as “to
 * substantiate”, while a course pack may use it for taking a course. Neither
 * contextual meaning should win the global word card merely because its pack
 * was loaded first. These entries are deliberately authored, not generated:
 * they give Word mode, Listen, the tracker and Micheon Immersion one useful
 * everyday-first card while the original packs keep their precise meanings.
 */
export type CanonicalWordSense = {
  de: string;
  en: string;
  use: string;
  level?: string;
  pos?: string;
};

const REVIEWED_WORD_SENSES: Record<string, CanonicalWordSense> = {
  leistung: {
    de: "die Leistung",
    en: "performance or achievement",
    use: "In insurance and public services, Leistung can also mean a benefit or provided service.",
    level: "A2",
    pos: "noun",
  },
  folge: {
    de: "die Folge",
    en: "result or consequence",
    use: "For a television or podcast series, Folge means an episode.",
    level: "A2",
    pos: "noun",
  },
  punkt: {
    de: "der Punkt",
    en: "point",
    use: "Depending on context, Punkt also means a dot, a full stop, or a score point.",
    level: "A1",
    pos: "noun",
  },
  antrag: {
    de: "der Antrag",
    en: "application or formal request",
    use: "In a meeting or parliament, Antrag can also mean a proposal or motion.",
    level: "A2",
    pos: "noun",
  },
  anlage: {
    de: "die Anlage",
    en: "facility or system",
    use: "Anlage can also mean an attachment, an investment, or a stereo system.",
    level: "B1",
    pos: "noun",
  },
  stand: {
    de: "der Stand",
    en: "state or status",
    use: "Stand can also mean a stand, stall, or position, depending on the situation.",
    level: "A2",
    pos: "noun",
  },
  abschließen: {
    de: "abschließen",
    en: "to finish or complete",
    use: "It can also mean to lock something or to take out a contract or insurance policy.",
    level: "A2",
    pos: "verb",
  },
  ankommen: {
    de: "ankommen",
    en: "to arrive",
    use: "Auf etwas ankommen means that something depends on or comes down to that thing.",
    level: "A1",
    pos: "verb",
  },
  reichen: {
    de: "reichen",
    en: "to be enough",
    use: "With an object, reichen can also mean to pass or hand something to someone.",
    level: "A2",
    pos: "verb",
  },
  anmeldung: {
    de: "die Anmeldung",
    en: "registration or sign-up",
    use: "At a hotel, clinic, or office, Anmeldung can also refer to check-in or reception.",
    level: "A2",
    pos: "noun",
  },
  erinnern: {
    de: "sich erinnern",
    en: "to remember",
    use: "Jemanden an etwas erinnern means to remind someone of something.",
    level: "A2",
    pos: "verb",
  },
  belegen: {
    de: "einen Kurs belegen",
    en: "to take a course",
    use: "Belegen also means to occupy or reserve something, support a claim with evidence, or top bread with something.",
    level: "B1",
    pos: "verb",
  },
  ansatz: {
    de: "der Ansatz",
    en: "approach or starting point",
    use: "For hair, Ansatz means the roots; in other contexts it can mean a base or beginning.",
    level: "B1",
    pos: "noun",
  },
  melden: {
    de: "sich melden",
    en: "to get in touch or speak up",
    use: "Without sich, melden can mean to report or register someone or something.",
    level: "A2",
    pos: "verb",
  },
  beschwerde: {
    de: "die Beschwerde",
    en: "complaint",
    use: "The plural Beschwerden can also mean symptoms or physical discomfort.",
    level: "B1",
    pos: "noun",
  },
  beschwerden: {
    de: "die Beschwerden",
    en: "symptoms or physical discomfort",
    use: "Beschwerden can also be the plural of Beschwerde: complaints.",
    level: "B1",
    pos: "noun",
  },
  stimmen: {
    de: "stimmen",
    en: "to be correct",
    use: "Stimmen can also mean to vote or to tune an instrument.",
    level: "A2",
    pos: "verb",
  },
  rezept: {
    de: "das Rezept",
    en: "recipe or prescription",
    use: "The surrounding conversation tells you whether it is for cooking or medicine.",
    level: "A2",
    pos: "noun",
  },
  zunehmen: {
    de: "zunehmen",
    en: "to increase or gain weight",
    use: "The general meaning is to increase; with a person it usually means to gain weight.",
    level: "A2",
    pos: "verb",
  },
  gang: {
    de: "der Gang",
    en: "corridor or aisle",
    use: "Gang can also mean a gear, a course of a meal, or someone's way of walking.",
    level: "A2",
    pos: "noun",
  },
  verlegen: {
    de: "verlegen",
    en: "to misplace or reschedule",
    use: "It can also mean to lay something or publish a book; the adjective verlegen means embarrassed.",
    level: "B1",
    pos: "verb",
  },
  widerspruch: {
    de: "der Widerspruch",
    en: "contradiction or objection",
    use: "In official correspondence, Widerspruch can mean a formal appeal.",
    level: "B1",
    pos: "noun",
  },
  überweisung: {
    de: "die Überweisung",
    en: "bank transfer or medical referral",
    use: "Both meanings are common; the situation makes the intended one clear.",
    level: "A2",
    pos: "noun",
  },
  beitrag: {
    de: "der Beitrag",
    en: "contribution",
    use: "Beitrag can also mean a fee, a social-media post, or a broadcast or article.",
    level: "B1",
    pos: "noun",
  },
  vorstellung: {
    de: "die Vorstellung",
    en: "idea or mental image",
    use: "It can also mean an introduction, a performance, or a cinema showing.",
    level: "B1",
    pos: "noun",
  },
  bewertung: {
    de: "die Bewertung",
    en: "rating or evaluation",
    use: "Use the context to tell whether it is a review score, assessment, or valuation.",
    level: "B1",
    pos: "noun",
  },
  station: {
    de: "die Station",
    en: "station or stop",
    use: "In a hospital, Station means a ward.",
    level: "A2",
    pos: "noun",
  },
  anschluss: {
    de: "der Anschluss",
    en: "connection or port",
    use: "It can be a transport connection, a socket or port, or a social connection.",
    level: "A2",
    pos: "noun",
  },
  absage: {
    de: "die Absage",
    en: "cancellation or rejection",
    use: "The same word is used when an event is cancelled or an application is rejected.",
    level: "B1",
    pos: "noun",
  },
  sicherung: {
    de: "die Sicherung",
    en: "fuse or backup",
    use: "More generally, Sicherung can mean protection or a safeguard.",
    level: "B1",
    pos: "noun",
  },
  übergang: {
    de: "der Übergang",
    en: "transition or crossing",
    use: "In audio, video, or hair styling, Übergang can also mean a fade.",
    level: "B1",
    pos: "noun",
  },
  verarbeiten: {
    de: "verarbeiten",
    en: "to process",
    use: "For a difficult experience, etwas verarbeiten means to cope with or come to terms with it.",
    level: "B1",
    pos: "verb",
  },
  bescheid: {
    de: "der Bescheid",
    en: "official notice or decision",
    use: "Bescheid sagen means to let someone know; Bescheid wissen means to know the situation.",
    level: "B1",
    pos: "noun",
  },
};

const senseKey = (value: string) => String(value ?? "").trim().toLocaleLowerCase("de-DE");

export function canonicalWordSenseFor(lookup: string): CanonicalWordSense | undefined {
  return REVIEWED_WORD_SENSES[senseKey(lookup)];
}

export const REVIEWED_CANONICAL_WORDS = Object.freeze(Object.keys(REVIEWED_WORD_SENSES));
