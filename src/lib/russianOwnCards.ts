import type { Part, Phrase, VocabItem } from "@/lib/types";

/**
 * Cards that belong to the Russian course and to no other.
 *
 * WHY THIS FILE HAD TO EXIST. Every other course in Micheon is the German
 * catalogue read through a translation table: translate(german, "ru") is keyed
 * by the German string, so a Russian card can only exist where a German card
 * already does. That is fine for "Молоко стоит в холодильнике" and useless for
 * everything Russian that German has no card for. There is no German sentence
 * behind «С лёгким паром!», none behind «Ну, за встречу!», none behind
 * отчество, дача, маршрутка or «Как дела? — Нормально». Under the table those
 * phrases could not be added at all — not badly, not at all — and a course for
 * learning Russian that cannot teach them is teaching German life in Russian.
 *
 * SO THE KEY IS RUSSIAN HERE. These entries arrive already in the shape the
 * swap in russianCourse.ts produces: `de` holds the language being learned,
 * which is the Cyrillic, and `en` holds the meaning. Nothing looks anything up
 * and nothing can go missing, because there is no German original to go
 * missing from.
 *
 * WHY IT CARRIES BOTH MEANINGS. russianMeaningLanguage() answers "de" or "en"
 * depending on the interface the learner set, and the swap picks one. These
 * cards never pass through the swap, so each one states its meaning in both
 * languages and meaningFor() picks at build time. Storing one and translating
 * later would put the same gap back that this file exists to close.
 *
 * WHAT DOES NOT BELONG HERE. Anything a German card already covers. A second
 * Russian home for "Мне нужны новые очки" would make one German card gradeable
 * two ways and split the learner's progress across both, which is exactly what
 * the collision rule in check-russian-script.cjs forbids — and
 * check-russian-own-cards.cjs holds these entries to the same rule.
 */

type OwnPhrase = { ru: string; de: string; en: string; use?: string };
type OwnWord = {
  ru: string;
  de: string;
  en: string;
  pos: string;
  tipDe: string;
  tipEn: string;
  example: string;
  exampleDe: string;
  exampleEn: string;
};

type OwnPack = {
  id: string;
  label: string;
  level: string;
  theme: string;
  descriptionDe: string;
  descriptionEn: string;
  focusDe: string;
  focusEn: string;
  words?: OwnWord[];
  phrases: OwnPhrase[];
};

const PACKS: OwnPack[] = [
  {
    id: "ru-own-obrashchenie",
    label: "Обращение",
    level: "A1",
    theme: "Anrede und Begrüßung",
    descriptionDe: "Wie man sich anspricht, wenn niemand übersetzt.",
    descriptionEn: "How people address each other when nobody is translating.",
    focusDe: "Vatersname, Duzen, und warum die Antwort «нормально» lautet",
    focusEn: "The patronymic, switching to ty, and why the answer is 'normal'",
    words: [
      {
        ru: "отчество",
        de: "der Vatersname",
        en: "patronymic",
        pos: "Substantiv",
        tipDe: "Иван Петрович heißt: Iwan, Sohn des Pjotr. Im Beruf ist das die höfliche Anrede — nicht der Nachname.",
        tipEn: "Ivan Petrovich means Ivan, son of Pyotr. At work this is the polite form of address — not the surname.",
        example: "Как вас по отчеству?",
        exampleDe: "Wie ist Ihr Vatersname?",
        exampleEn: "What is your patronymic?",
      },
      {
        ru: "тёзка",
        de: "der Namensvetter",
        en: "namesake",
        pos: "Substantiv",
        tipDe: "Jemand mit demselben Vornamen wie du. Wird sofort als kleine Verbindung behandelt.",
        tipEn: "Someone with the same first name as you. It is treated at once as a small bond.",
        example: "О, мы тёзки!",
        exampleDe: "Oh, wir heißen gleich!",
        exampleEn: "Oh, we have the same name!",
      },
      {
        ru: "земляк",
        de: "der Landsmann",
        en: "fellow countryman",
        pos: "Substantiv",
        tipDe: "Wer aus derselben Stadt oder Gegend kommt. In der Fremde zählt das viel.",
        tipEn: "Someone from the same town or region. Far from home that counts for a lot.",
        example: "Мы с ним земляки.",
        exampleDe: "Wir kommen aus derselben Gegend.",
        exampleEn: "He and I are from the same place.",
      },
    ],
    phrases: [
      {
        ru: "Как дела? — Нормально.",
        de: "Wie geht's? — Normal.",
        en: "How are you? — Normal.",
        use: "«Нормально» ist die übliche Antwort. «Хорошо» klingt schon fast euphorisch.",
      },
      { ru: "Можно на ты?", de: "Können wir uns duzen?", en: "Can we use ty?" },
      { ru: "Давайте на ты.", de: "Lass uns duzen.", en: "Let's use ty." },
      { ru: "Очень приятно.", de: "Sehr angenehm.", en: "Very pleased to meet you." },
      { ru: "Взаимно.", de: "Ganz meinerseits.", en: "Likewise." },
      {
        ru: "Давай!",
        de: "Mach's gut!",
        en: "Take care!",
        use: "Zum Abschied und am Telefon. Wörtlich heißt es «gib».",
      },
      { ru: "Давай, до связи!", de: "Also dann, bis später!", en: "All right, talk soon!" },
      { ru: "Слушай...", de: "Hör mal ...", en: "Listen ..." },
      { ru: "Короче.", de: "Kurz gesagt.", en: "Long story short." },
      { ru: "Ладно, я на связи.", de: "Gut, ich bin erreichbar.", en: "All right, I'm around." },
    ],
  },
  {
    id: "ru-own-zastolye",
    label: "Застолье",
    level: "A2",
    theme: "Zu Tisch und zu Gast",
    descriptionDe: "Der Tisch, die Trinksprüche und das dritte Glas.",
    descriptionEn: "The table, the toasts, and the third glass.",
    focusDe: "Was gesagt wird, bevor jemand trinkt oder isst",
    focusEn: "What gets said before anyone drinks or eats",
    words: [
      {
        ru: "застолье",
        de: "die Tafelrunde",
        en: "the gathering at table",
        pos: "Substantiv",
        tipDe: "Nicht nur das Essen — der ganze Abend am Tisch, mit Trinksprüchen und Reden.",
        tipEn: "Not just the meal — the whole evening at table, with toasts and speeches.",
        example: "Застолье затянулось до ночи.",
        exampleDe: "Die Tafelrunde zog sich bis in die Nacht.",
        exampleEn: "The gathering ran on into the night.",
      },
      {
        ru: "закуска",
        de: "die Beilage zum Trinken",
        en: "the bite that follows a drink",
        pos: "Substantiv",
        tipDe: "Was direkt nach dem Schluck gegessen wird — Gurke, Brot, Hering. Ohne закуска wird nicht getrunken.",
        tipEn: "What is eaten right after the sip — pickle, bread, herring. Nobody drinks without it.",
        example: "Без закуски не пьют.",
        exampleDe: "Ohne etwas dazu trinkt man nicht.",
        exampleEn: "You don't drink without something to follow it.",
      },
    ],
    phrases: [
      { ru: "Садись, чай попьём.", de: "Setz dich, wir trinken Tee.", en: "Sit down, let's have tea." },
      {
        ru: "Чайку?",
        de: "Ein Tässchen Tee?",
        en: "A spot of tea?",
        use: "Die Verkleinerungsform macht das Angebot warm statt förmlich.",
      },
      {
        ru: "Спасибо, я больше не буду.",
        de: "Danke, ich mag nicht mehr.",
        en: "Thank you, I won't have any more.",
      },
      {
        ru: "Ну, за встречу!",
        de: "Also, auf das Wiedersehen!",
        en: "Well then — to our meeting!",
        use: "Der erste Trinkspruch, wenn man sich lange nicht gesehen hat.",
      },
      { ru: "За здоровье!", de: "Auf die Gesundheit!", en: "To your health!" },
      { ru: "За хозяйку дома!", de: "Auf die Gastgeberin!", en: "To the lady of the house!" },
      {
        ru: "Третий тост — не чокаясь.",
        de: "Der dritte Trinkspruch — ohne Anstoßen.",
        en: "The third toast — without clinking.",
        use: "Er gilt denen, die nicht mehr da sind. Dabei wird geschwiegen und nicht angestoßen.",
      },
      {
        ru: "На посошок.",
        de: "Einen für den Weg.",
        en: "One for the road.",
        use: "Das allerletzte Glas, schon im Mantel an der Tür.",
      },
      { ru: "Вкусно как у бабушки.", de: "Schmeckt wie bei Oma.", en: "Tastes like Grandma's." },
      {
        ru: "Дай бог не последняя.",
        de: "So Gott will nicht das letzte Mal.",
        en: "God willing, not the last time.",
        use: "Antwort auf ein Glas oder auf einen schönen Abend.",
      },
      {
        ru: "Ну, будем!",
        de: "Also dann — auf uns!",
        en: "Well then — here's to us!",
        use: "Der kürzeste Trinkspruch. Wenn niemand mehr eine Rede halten will.",
      },
      {
        ru: "С меня причитается.",
        de: "Ich bin dir was schuldig.",
        en: "I owe you one.",
        use: "Heißt fast immer: dafür gebe ich einen aus.",
      },
    ],
  },
  {
    id: "ru-own-doroga",
    label: "Дача и дорога",
    level: "A2",
    theme: "Datscha und unterwegs",
    descriptionDe: "Wohin man am Wochenende fährt und womit.",
    descriptionEn: "Where people go at the weekend, and what they take.",
    focusDe: "Datscha, Vorortzug, Sammeltaxi — und das Hinsetzen vor der Abfahrt",
    focusEn: "The datscha, the suburban train, the minibus — and sitting down before you go",
    words: [
      {
        ru: "дача",
        de: "die Datscha",
        en: "the dacha",
        pos: "Substantiv",
        tipDe: "Das Häuschen außerhalb der Stadt. Halb Garten, halb Wochenendhaus — und für viele der eigentliche Sommer.",
        tipEn: "The little place out of town. Half garden, half weekend house — and for many the real summer.",
        example: "Мы на выходные на дачу.",
        exampleDe: "Wir fahren übers Wochenende auf die Datscha.",
        exampleEn: "We're off to the dacha for the weekend.",
      },
      {
        ru: "сотка",
        de: "hundert Quadratmeter",
        en: "a hundred square metres",
        pos: "Substantiv",
        tipDe: "Grundstücke werden in сотки gerechnet. «Шесть соток» ist das klassische Datschengrundstück.",
        tipEn: "Plots are counted in sotkas. 'Six sotkas' is the classic dacha plot.",
        example: "У нас шесть соток.",
        exampleDe: "Wir haben sechshundert Quadratmeter.",
        exampleEn: "We've got six hundred square metres.",
      },
      {
        ru: "электричка",
        de: "der Vorortzug",
        en: "the suburban train",
        pos: "Substantiv",
        tipDe: "Der langsame Zug ins Umland. Womit man zur Datscha fährt.",
        tipEn: "The slow train out of the city. How you get to the dacha.",
        example: "Поедем на электричке.",
        exampleDe: "Wir nehmen den Vorortzug.",
        exampleEn: "We'll take the suburban train.",
      },
      {
        ru: "маршрутка",
        de: "das Sammeltaxi",
        en: "the minibus",
        pos: "Substantiv",
        tipDe: "Kleinbus auf fester Route, hält auf Zuruf. Schneller als der Bus und billiger als das Taxi.",
        tipEn: "A minibus on a fixed route that stops when you ask. Faster than the bus, cheaper than a taxi.",
        example: "Маршрутка идёт до рынка.",
        exampleDe: "Das Sammeltaxi fährt bis zum Markt.",
        exampleEn: "The minibus goes as far as the market.",
      },
    ],
    phrases: [
      {
        ru: "Остановите на остановке, пожалуйста!",
        de: "Halten Sie bitte an der Haltestelle!",
        en: "Stop at the stop, please!",
        use: "Im Sammeltaxi ruft man das nach vorn zum Fahrer.",
      },
      {
        ru: "Присядем на дорожку.",
        de: "Setzen wir uns noch kurz für den Weg.",
        en: "Let's sit down for the road.",
        use: "Vor der Abfahrt setzen sich alle für einen Moment hin. Auch wenn es eilt.",
      },
      { ru: "Счастливого пути!", de: "Gute Reise!", en: "Safe journey!" },
      {
        ru: "Ни пуха ни пера! — К чёрту!",
        de: "Hals- und Beinbruch! — Zum Teufel!",
        en: "Break a leg! — To the devil!",
        use: "Der Wunsch verlangt die Antwort. Ohne «К чёрту!» gilt er nicht.",
      },
      { ru: "Мы почти приехали.", de: "Wir sind fast da.", en: "We're almost there." },
    ],
  },
  {
    id: "ru-own-banya",
    label: "Баня и здоровье",
    level: "A2",
    theme: "Banja und Gesundheit",
    descriptionDe: "Was man nach dem Dampfbad sagt und wenn jemand niest.",
    descriptionEn: "What to say after the steam and when somebody sneezes.",
    focusDe: "Grüße, die es auf Deutsch so nicht gibt",
    focusEn: "Greetings German has no word for",
    words: [
      {
        ru: "баня",
        de: "die russische Banja",
        en: "the Russian banya",
        pos: "Substantiv",
        tipDe: "Dampfbad mit feuchter Hitze. Kein Wellness-Termin, sondern ein geselliger Nachmittag.",
        tipEn: "A steam bath with wet heat. Not a spa appointment but a sociable afternoon.",
        example: "В субботу идём в баню.",
        exampleDe: "Am Samstag gehen wir in die Banja.",
        exampleEn: "On Saturday we're going to the banya.",
      },
      {
        ru: "веник",
        de: "der Birkenbesen",
        en: "the birch besom",
        pos: "Substantiv",
        tipDe: "Das Bündel Birkenzweige, mit dem in der Banja geschlagen wird. Gehört dazu wie das Wasser.",
        tipEn: "The bundle of birch twigs you get beaten with in the banya. As essential as the water.",
        example: "Веник надо сначала запарить.",
        exampleDe: "Der Besen muss erst eingeweicht werden.",
        exampleEn: "The besom has to be steeped first.",
      },
    ],
    phrases: [
      {
        ru: "С лёгким паром!",
        de: "Wohl bekomm's nach dem Bad!",
        en: "Enjoy the steam!",
        use: "Sagt man jedem, der aus Banja, Bad oder Dusche kommt. Es gibt dafür kein deutsches Wort.",
      },
      {
        ru: "Будь здоров!",
        de: "Gesundheit!",
        en: "Bless you!",
        use: "Nach dem Niesen. Förmlich: «Будьте здоровы!»",
      },
      { ru: "Не болей!", de: "Bleib gesund!", en: "Don't get ill!" },
      { ru: "Выздоравливай!", de: "Gute Besserung!", en: "Get well soon!" },
      { ru: "Как самочувствие?", de: "Wie fühlst du dich?", en: "How are you feeling?" },
    ],
  },
  {
    id: "ru-own-prazdniki",
    label: "Праздники",
    level: "A1",
    theme: "Feste und Glückwünsche",
    descriptionDe: "Gratulieren, und zwar rechtzeitig.",
    descriptionEn: "Congratulating, and doing it in time.",
    focusDe: "Der Gruß vor dem Fest und der am Tag selbst",
    focusEn: "The greeting before the day and the one on the day",
    phrases: [
      { ru: "С праздником!", de: "Frohes Fest!", en: "Happy holiday!" },
      {
        ru: "С наступающим!",
        de: "Guten Rutsch!",
        en: "Happy New Year in advance!",
        use: "In den Tagen VOR Neujahr. Am Tag selbst heißt es «С Новым годом!»",
      },
      { ru: "С Новым годом!", de: "Frohes neues Jahr!", en: "Happy New Year!" },
      { ru: "С днём рождения!", de: "Herzlichen Glückwunsch zum Geburtstag!", en: "Happy birthday!" },
      { ru: "Поздравляю!", de: "Glückwunsch!", en: "Congratulations!" },
      { ru: "Спасибо за поздравления.", de: "Danke für die Glückwünsche.", en: "Thank you for the wishes." },
      { ru: "Желаю всего самого доброго.", de: "Ich wünsche alles Gute.", en: "I wish you all the very best." },
    ],
  },
  {
    id: "ru-own-reakcii",
    label: "Реакции",
    level: "A1",
    theme: "Kurze Reaktionen",
    descriptionDe: "Die kleinen Wörter, die im Gespräch die Arbeit machen.",
    descriptionEn: "The small words that do the work in a conversation.",
    focusDe: "Zustimmen, staunen, abwinken",
    focusEn: "Agreeing, marvelling, waving it off",
    words: [
      {
        ru: "авось",
        de: "auf gut Glück",
        en: "on the off chance",
        pos: "Partikel",
        tipDe: "Die Hoffnung, dass es schon gutgehen wird, ohne etwas dafür zu tun. Ein Wort, das Russen sich selbst gern vorwerfen.",
        tipEn: "The hope that it will work out somehow, without doing anything about it. A word Russians like to accuse themselves of.",
        example: "Авось пронесёт.",
        exampleDe: "Wird schon schiefgehen.",
        exampleEn: "It'll probably be fine.",
      },
    ],
    phrases: [
      { ru: "Ничего себе!", de: "Nicht zu fassen!", en: "Well I never!" },
      { ru: "Да ладно!", de: "Ach komm!", en: "Come off it!" },
      { ru: "Вот это да!", de: "Donnerwetter!", en: "Wow!" },
      { ru: "Ты чего?", de: "Was ist denn mit dir?", en: "What's got into you?" },
      { ru: "Как-то так.", de: "So ungefähr.", en: "Something like that." },
      { ru: "Ну такое...", de: "Na ja, geht so.", en: "Eh, so-so." },
      { ru: "Ну ты даёшь!", de: "Du bist mir einer!", en: "You're something else!" },
      { ru: "Вот те раз.", de: "Da haben wir's.", en: "Well, there you go." },
      { ru: "Однако.", de: "Sieh mal einer an.", en: "Well now." },
      {
        ru: "Была не была!",
        de: "Jetzt oder nie!",
        en: "Here goes nothing!",
        use: "Feste Wendung — sie richtet sich nach niemandem und bleibt immer so.",
      },
      {
        ru: "На здоровье.",
        de: "Wohl bekomm's.",
        en: "You're welcome.",
        use: "Antwort auf ein Dankeschön fürs Essen — nicht auf jedes Dankeschön.",
      },
      { ru: "Сейчас-сейчас.", de: "Sofort, sofort.", en: "Coming, coming." },
      { ru: "Минуточку.", de: "Einen Moment.", en: "Just a moment." },
      { ru: "Тем более.", de: "Umso mehr.", en: "All the more so." },
      { ru: "Ужас какой.", de: "Wie schrecklich.", en: "How awful." },
    ],
  },
];

function phraseFor(entry: OwnPhrase, meaning: "de" | "en"): Phrase {
  const phrase: Phrase = {
    de: entry.ru,
    en: meaning === "de" ? entry.de : entry.en,
  };
  // A usage note is written for a German-speaking reader, so it only rides
  // along when German is the meaning language the learner asked for.
  if (entry.use && meaning === "de") phrase.use = entry.use;
  return phrase;
}

function wordFor(entry: OwnWord, meaning: "de" | "en"): VocabItem {
  return {
    de: entry.ru,
    en: meaning === "de" ? entry.de : entry.en,
    tip: meaning === "de" ? entry.tipDe : entry.tipEn,
    lookup: entry.ru,
    example: entry.example,
    exampleEn: meaning === "de" ? entry.exampleDe : entry.exampleEn,
    pos: entry.pos,
  };
}

/**
 * The Russian-only packs, in the shape russianParts() hands on. Built fresh
 * per call because the meaning language can change while the app is running.
 */
export function russianOwnParts(meaning: "de" | "en"): Record<string, Part> {
  const out: Record<string, Part> = {};
  for (const pack of PACKS) {
    out[pack.id] = {
      label: pack.label,
      level: pack.level,
      theme: pack.theme,
      description: meaning === "de" ? pack.descriptionDe : pack.descriptionEn,
      focus: meaning === "de" ? pack.focusDe : pack.focusEn,
      vocab: (pack.words ?? []).map((word) => wordFor(word, meaning)),
      articleQuestions: [],
      translationQuestions: [],
      dialogues: [],
      phrases: pack.phrases.map((phrase) => phraseFor(phrase, meaning)),
      learningDirections: ["learn-ru"],
    };
  }
  return out;
}

/** Every Russian line these packs teach — the gate reads this. */
export function russianOwnLines(): string[] {
  const lines: string[] = [];
  for (const pack of PACKS) {
    for (const word of pack.words ?? []) lines.push(word.ru, word.example);
    for (const phrase of pack.phrases) lines.push(phrase.ru);
  }
  return lines;
}

export function russianOwnCardCount(): number {
  return PACKS.reduce((sum, pack) => sum + (pack.words?.length ?? 0) + pack.phrases.length, 0);
}
