import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flame,
  GraduationCap,
  Headphones,
  Languages,
  MessageCircle,
  PenLine,
  RotateCcw,
  Shuffle,
  Sparkles,
  Sprout,
  Trophy,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { loadGradeStore, setItemStatus, statusForId, type ItemStatus } from "@/lib/activity";
import { learningEnglish } from "@/lib/direction";
import { matchEnglishPhrase, matchGermanSentence, matchParagraphAnswer } from "@/lib/germanTextMatch";
import { ui, uiIsGerman } from "@/lib/i18n";
import type { UserProfile } from "@/lib/profileStorage";
import type { Part } from "@/lib/types";
import { tts } from "@/lib/voice";
import { buildCatalog, type CatalogItem } from "@/session";
import { MarkableText, normalizeMarkWord } from "@/components/tests/MarkableText";

// One test per kind, taken at whichever difficulty you choose, rather than a
// separate card for the easy and hard half of each.
type TestPresetId =
  | "vocabulary"
  | "phrases"
  | "paragraphs"
  | "mixed"
  | "weak-spots"
  | "exam-listening"
  | "exam-marathon"
  | "exam-gauntlet"
  | "exam-production"
  | "exam-c1"
  | "exam-longform"
  | "exam-precision"
  | "exam-foundation"
  | "exam-intermediate";

type Difficulty = "easy" | "medium" | "hard" | "expert";

type TestDirection = "course" | "reverse" | "mixed";
type AnswerLanguage = "de" | "en";

type TestItem = {
  id: string;
  aliases?: string[];
  de: string;
  en: string;
  kind: "vocabulary" | "phrase" | "paragraph";
  level: string;
  topic: string;
  /** Kept as the coarse split some presets still want. */
  hard: boolean;
  difficulty: Difficulty;
  status: ItemStatus;
  due: boolean;
};

type TestQuestion = {
  item: TestItem;
  answerLanguage: AnswerLanguage;
};

type TestResult = {
  question: TestQuestion;
  answer: string;
  correct: boolean;
  skipped: boolean;
  spellingNote?: boolean;
  phrasingNote?: boolean;
};

type TestPreset = {
  id: TestPresetId;
  title: string;
  description: string;
  eyebrow: string;
  icon: typeof Sprout;
  tone: "accent" | "yellow" | "green" | "orange" | "ink" | "rose";
  filter: (item: TestItem) => boolean;
  /** False for presets that pick their own items, e.g. weak spots. */
  gradable?: boolean;
  /** Exams run at a fixed length and cannot be shortened. */
  fixedLength?: number;
  /** Exams force a direction so they stay comparable between attempts. */
  fixedDirection?: TestDirection;
  /** Marks the harder, longer formats for learners who want a real challenge. */
  exam?: boolean;
  /** Percentage needed to pass, for exam formats. */
  passMark?: number;
};

const TEST_LENGTHS = [10, 20, 30] as const;

const DIFFICULTIES: { id: Difficulty; label: string; blurb: string }[] = [
  { id: "easy", label: "Easy", blurb: "A1-A2 basics, short and high frequency." },
  { id: "medium", label: "Medium", blurb: "A2-B1, longer words and fuller sentences." },
  { id: "hard", label: "Hard", blurb: "B1-B2, precision and word order matter." },
  { id: "expert", label: "Expert", blurb: "B2-C1, nuance, connectors and long compounds." },
];

const PARAGRAPH_TEST_ITEMS = [
  {
    id: "test-paragraph-easy-morning",
    de: "Ich stehe normalerweise um sieben Uhr auf und mache mir eine Tasse Tee. Danach dusche ich, ziehe mich an und prüfe meinen Kalender, bevor ich mit der Arbeit beginne.",
    en: "I usually get up at seven and make myself a cup of tea. Afterwards, I shower, get dressed, and check my calendar before I start work.",
    level: "A2-B1",
    topic: "Daily routine",
    hard: false,
  },
  {
    id: "test-paragraph-easy-weekend",
    de: "Am Wochenende besuchen wir oft meine Eltern. Wenn das Wetter schön ist, essen wir im Garten und gehen später mit dem Hund spazieren.",
    en: "At the weekend, we often visit my parents. If the weather is nice, we eat in the garden and later take the dog for a walk.",
    level: "A2-B1",
    topic: "Family and weekends",
    hard: false,
  },
  {
    id: "test-paragraph-easy-train",
    de: "Mein Zug hatte heute Morgen zwanzig Minuten Verspätung. Ich schrieb meiner Kollegin eine Nachricht, damit sie wusste, dass ich etwas später ankommen würde.",
    en: "My train was twenty minutes late this morning. I sent my colleague a message so that she knew I would arrive a little later.",
    level: "B1",
    topic: "Travel and work",
    hard: false,
  },
  {
    id: "test-paragraph-easy-cooking",
    de: "Gestern Abend haben wir zusammen das Abendessen gekocht. Ich habe das Gemüse geschnitten, während Michelle die Soße vorbereitet hat.",
    en: "Last night, we cooked dinner together. I chopped the vegetables while Michelle prepared the sauce.",
    level: "A2-B1",
    topic: "Cooking together",
    hard: false,
  },
  {
    id: "test-paragraph-easy-new-city",
    de: "Als ich zum ersten Mal in die Stadt zog, kannte ich niemanden. Nach ein paar Wochen trat ich einem Sportverein bei und fand schnell neue Freunde.",
    en: "When I first moved to the city, I did not know anyone. After a few weeks, I joined a sports club and quickly made new friends.",
    level: "B1",
    topic: "Moving and friendship",
    hard: false,
  },
  {
    id: "test-paragraph-easy-shopping",
    de: "Wir wollten im Supermarkt nur Brot und Milch kaufen. Am Ende nahmen wir jedoch auch Obst, Kaffee und etwas für das Abendessen mit.",
    en: "We only meant to buy bread and milk at the supermarket. However, we ended up getting fruit, coffee, and something for dinner as well.",
    level: "B1",
    topic: "Shopping",
    hard: false,
  },
  {
    id: "test-paragraph-easy-learning",
    de: "Sie übt jeden Tag ein wenig Englisch, auch wenn sie beschäftigt ist. Diese kurzen Einheiten helfen ihr, neue Wörter zu behalten und selbstbewusster zu sprechen.",
    en: "She practises a little English every day, even when she is busy. These short sessions help her remember new words and speak more confidently.",
    level: "B1",
    topic: "Learning habits",
    hard: false,
  },
  {
    id: "test-paragraph-easy-holiday",
    de: "Für unseren nächsten Urlaub möchten wir ans Meer fahren. Wir suchen ein ruhiges Hotel, das nicht zu weit vom Strand entfernt ist.",
    en: "For our next holiday, we would like to go to the seaside. We are looking for a quiet hotel that is not too far from the beach.",
    level: "A2-B1",
    topic: "Holiday plans",
    hard: false,
  },
  {
    id: "test-paragraph-easy-rain",
    de: "Es regnete den ganzen Nachmittag, deshalb blieben wir zu Hause. Wir sahen einen Film, bestellten Pizza und machten es uns im Wohnzimmer gemütlich.",
    en: "It rained all afternoon, so we stayed at home. We watched a film, ordered pizza, and made ourselves comfortable in the living room.",
    level: "A2-B1",
    topic: "Weather and home",
    hard: false,
  },
  {
    id: "test-paragraph-easy-phone",
    de: "Ich konnte mein Handy heute Morgen nicht finden. Schließlich entdeckte ich es unter einem Kissen auf dem Sofa, wo ich es gestern Abend liegen gelassen hatte.",
    en: "I could not find my phone this morning. Eventually, I discovered it under a cushion on the sofa, where I had left it last night.",
    level: "B1",
    topic: "Everyday problems",
    hard: false,
  },
  {
    id: "test-paragraph-easy-meeting",
    de: "Die Besprechung begann pünktlich und dauerte etwa eine Stunde. Jeder teilte seine Ideen mit, und am Ende einigten wir uns auf einen einfachen Plan.",
    en: "The meeting started on time and lasted for about an hour. Everyone shared their ideas, and in the end we agreed on a simple plan.",
    level: "B1",
    topic: "Work and meetings",
    hard: false,
  },
  {
    id: "test-paragraph-easy-neighbour",
    de: "Unsere neue Nachbarin ist letzte Woche eingezogen. Wir brachten ihr einen Kuchen und unterhielten uns eine Weile an der Haustür.",
    en: "Our new neighbour moved in last week. We took her a cake and chatted for a while at the front door.",
    level: "A2-B1",
    topic: "Neighbours",
    hard: false,
  },
  {
    id: "test-paragraph-easy-exercise",
    de: "Ich wollte fitter werden, aber ich hatte keine Lust auf ein Fitnessstudio. Stattdessen begann ich, jeden Abend dreißig Minuten zu laufen.",
    en: "I wanted to get fitter, but I did not fancy joining a gym. Instead, I started walking for thirty minutes every evening.",
    level: "B1",
    topic: "Health and exercise",
    hard: false,
  },
  {
    id: "test-paragraph-easy-book",
    de: "Das Buch war am Anfang etwas langsam, aber bald wurde die Geschichte spannend. Ich las die letzten fünfzig Seiten an einem Abend.",
    en: "The book was a little slow at first, but the story soon became exciting. I read the final fifty pages in one evening.",
    level: "B1",
    topic: "Books and opinions",
    hard: false,
  },
  {
    id: "test-paragraph-easy-restaurant",
    de: "Das Restaurant war voll, als wir ankamen, also mussten wir kurz warten. Das Essen war die Wartezeit wert, und der Service war sehr freundlich.",
    en: "The restaurant was full when we arrived, so we had to wait for a short while. The food was worth the wait, and the service was very friendly.",
    level: "B1",
    topic: "Eating out",
    hard: false,
  },
  {
    id: "test-paragraph-advanced-project",
    de: "Das Team unterschätzte zunächst den Umfang des Projekts. Infolgedessen geriet der Zeitplan unter Druck; dennoch lieferten wir die wichtigsten Funktionen pünktlich und überarbeiteten die übrigen anschließend.",
    en: "The team initially underestimated the scope of the project. Consequently, the schedule came under pressure; nevertheless, we delivered the essential features on time and subsequently revised the remainder.",
    level: "C1",
    topic: "Projects and consequences",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-policy",
    de: "Die neue Richtlinie sollte die Abläufe vereinfachen, wohingegen die vorherige Version unnötige Genehmigungsschritte verlangte. Darüber hinaus gibt sie den Mitarbeitenden mehr Eigenverantwortung und verringert dadurch Verzögerungen.",
    en: "The new policy is intended to streamline operations, whereas the previous version required unnecessary approval stages. Moreover, it gives employees greater autonomy, thereby reducing delays.",
    level: "C1",
    topic: "Policy and contrast",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-research",
    de: "Die ersten Ergebnisse schienen die ursprüngliche Theorie zu bestätigen. Bei genauerer Betrachtung war die Stichprobe jedoch zu klein; folglich müssen weitere Daten erhoben werden, bevor eine verlässliche Schlussfolgerung möglich ist.",
    en: "The initial findings appeared to support the original theory. Upon closer examination, however, the sample was too small; consequently, further data must be collected before a reliable conclusion can be drawn.",
    level: "C1",
    topic: "Research and evidence",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-negotiation",
    de: "Beide Parteien waren grundsätzlich zu einem Kompromiss bereit, obwohl ihre Prioritäten deutlich voneinander abwichen. Letztlich wurde eine Vereinbarung erzielt, sofern bestimmte Schutzmaßnahmen unverändert blieben.",
    en: "Both parties were broadly willing to compromise, although their priorities differed considerably. Ultimately, an agreement was reached, provided that certain safeguards remained unchanged.",
    level: "C1",
    topic: "Negotiation",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-investment",
    de: "Die Investition versprach kurzfristig nur bescheidene Renditen. Langfristig dürfte sie jedoch die Betriebskosten erheblich senken und somit die anfänglichen Ausgaben rechtfertigen.",
    en: "The investment promised only modest returns in the short term. In the long run, however, it was expected to reduce operating costs substantially, thereby justifying the initial expenditure.",
    level: "C1",
    topic: "Finance and investment",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-climate",
    de: "Einzelne Maßnahmen mögen unbedeutend erscheinen, wenn man sie isoliert betrachtet. Zusammengenommen können sie jedoch den Energieverbrauch deutlich verringern; daher sollten Haushalte und Unternehmen gleichermaßen dazu ermutigt werden.",
    en: "Individual measures may appear insignificant when considered in isolation. Collectively, however, they can reduce energy consumption considerably; hence, households and businesses alike should be encouraged to adopt them.",
    level: "C1",
    topic: "Climate and collective action",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-leadership",
    de: "Die Leiterin räumte ein, dass die Entscheidung unpopulär sein würde. Nichtsdestotrotz argumentierte sie, dass Untätigkeit größere Risiken mit sich brächte und die Organisation andernfalls ihre Glaubwürdigkeit verlieren könnte.",
    en: "The director acknowledged that the decision would be unpopular. Nonetheless, she argued that inaction would entail greater risks and that the organisation might otherwise lose its credibility.",
    level: "C1",
    topic: "Leadership and risk",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-technology",
    de: "Die Software automatisiert Aufgaben, die zuvor manuell erledigt wurden. Dadurch können sich die Mitarbeitenden auf komplexere Probleme konzentrieren; gleichzeitig muss das Unternehmen gewährleisten, dass die Ergebnisse sorgfältig überprüft werden.",
    en: "The software automates tasks that were previously completed manually. Consequently, employees can focus on more complex problems; meanwhile, the company must ensure that the results are reviewed carefully.",
    level: "C1",
    topic: "Technology and responsibility",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-education",
    de: "Prüfungen können Wissen effizient messen, erfassen jedoch nicht immer Kreativität oder Urteilsvermögen. Umgekehrt fördern offene Aufgaben eigenständiges Denken, allerdings auf Kosten einer objektiveren Bewertung.",
    en: "Examinations can measure knowledge efficiently, yet they do not always capture creativity or judgement. Conversely, open-ended assignments encourage independent thought, albeit at the cost of more objective assessment.",
    level: "C1",
    topic: "Education and assessment",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-reputation",
    de: "Das Unternehmen reagierte rasch auf die Beschwerde und veröffentlichte anschließend eine ausführliche Erklärung. Im Rückblick verhinderte diese Transparenz vermutlich, dass ein kleiner Fehler zu einer dauerhaften Rufschädigung führte.",
    en: "The company responded promptly to the complaint and subsequently issued a detailed explanation. In retrospect, that transparency probably prevented a minor error from causing lasting reputational damage.",
    level: "C1",
    topic: "Reputation and response",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-healthcare",
    de: "Das neue System soll die Wartezeiten verkürzen, indem dringende Fälle früher erkannt werden. Sofern es konsequent angewendet wird, könnte es die Versorgung verbessern, ohne zusätzliches Personal zu erfordern.",
    en: "The new system aims to shorten waiting times by identifying urgent cases earlier. Provided that it is applied consistently, it could improve care without requiring additional staff.",
    level: "C1",
    topic: "Healthcare systems",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-culture",
    de: "Die beiden Abteilungen verfolgten zwar dasselbe Ziel, arbeiteten jedoch nach völlig unterschiedlichen Prinzipien. Soweit eine Zusammenarbeit möglich war, beruhte sie auf klaren Zuständigkeiten und gegenseitigem Respekt.",
    en: "The two departments pursued the same objective, yet operated according to entirely different principles. Insofar as collaboration was possible, it depended on clear responsibilities and mutual respect.",
    level: "C1",
    topic: "Organisational culture",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-contract",
    de: "Ungeachtet der mündlichen Zusicherungen blieben mehrere Vertragsbedingungen unklar. Dementsprechend bat die Rechtsabteilung um eine schriftliche Präzisierung, bevor weitere Verpflichtungen eingegangen wurden.",
    en: "Notwithstanding the verbal assurances, several contractual terms remained ambiguous. Accordingly, the legal team requested written clarification before any further commitments were made.",
    level: "C1",
    topic: "Contracts and clarity",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-strategy",
    de: "Das Unternehmen wird künftig kleinere, gezieltere Märkte priorisieren. Anschließend soll die Strategie anhand messbarer Ergebnisse bewertet und gegebenenfalls angepasst werden.",
    en: "Henceforth, the company will prioritise smaller, more targeted markets. Thereafter, the strategy will be evaluated against measurable outcomes and adjusted where necessary.",
    level: "C1",
    topic: "Strategy and evaluation",
    hard: true,
  },
  {
    id: "test-paragraph-advanced-media",
    de: "Der Artikel präsentierte eine überzeugende Erzählung, ließ jedoch mehrere widersprüchliche Belege aus. Darüber hinaus unterschied er nicht ausreichend zwischen bestätigten Tatsachen und plausiblen Vermutungen.",
    en: "The article presented a compelling narrative, yet omitted several contradictory pieces of evidence. Furthermore, it failed to distinguish adequately between verified facts and plausible speculation.",
    level: "C1",
    topic: "Media and critical thinking",
    hard: true,
  },
  {
    id: "test-paragraph-basic-cafe",
    de: "Ich gehe fast jeden Morgen in dasselbe Café. Ich nehme einen Kaffee und ein Brötchen und lese ein bisschen Zeitung.",
    en: "I go to the same café almost every morning. I have a coffee and a roll and read the paper a bit.",
    level: "A1-A2",
    topic: "Morning routine",
    hard: false,
  },
  {
    id: "test-paragraph-basic-family",
    de: "Meine Familie ist nicht sehr groß. Ich habe eine Schwester und einen Bruder, und wir wohnen alle in derselben Stadt.",
    en: "My family isn't very big. I have a sister and a brother, and we all live in the same city.",
    level: "A1-A2",
    topic: "Family",
    hard: false,
  },
  {
    id: "test-paragraph-basic-weather",
    de: "Heute ist es kalt und es regnet. Ich bleibe lieber zu Hause und trinke einen Tee.",
    en: "It's cold today and it's raining. I'd rather stay at home and have a tea.",
    level: "A1-A2",
    topic: "Weather",
    hard: false,
  },
  {
    id: "test-paragraph-basic-shopping",
    de: "Am Samstag gehe ich einkaufen. Ich brauche Brot, Milch, Eier und ein bisschen Obst.",
    en: "On Saturday I go shopping. I need bread, milk, eggs and some fruit.",
    level: "A1-A2",
    topic: "Shopping",
    hard: false,
  },
  {
    id: "test-paragraph-basic-work",
    de: "Ich arbeite von neun bis fünf. Mittags mache ich eine Pause und gehe kurz spazieren.",
    en: "I work from nine to five. At lunchtime I take a break and go for a short walk.",
    level: "A1-A2",
    topic: "Work day",
    hard: false,
  },
  {
    id: "test-paragraph-basic-hobby",
    de: "In meiner Freizeit spiele ich gern Fußball. Am Mittwoch trainieren wir immer zusammen.",
    en: "In my free time I like playing football. On Wednesdays we always train together.",
    level: "A1-A2",
    topic: "Hobbies",
    hard: false,
  },
  {
    id: "test-paragraph-basic-flat",
    de: "Meine Wohnung ist klein, aber sehr hell. Sie hat zwei Zimmer, eine Küche und ein Bad.",
    en: "My flat is small but very bright. It has two rooms, a kitchen and a bathroom.",
    level: "A1-A2",
    topic: "Home",
    hard: false,
  },
  {
    id: "test-paragraph-basic-travel",
    de: "Im Sommer fahre ich gern ans Meer. Der Zug dauert vier Stunden, aber das ist mir egal.",
    en: "In summer I like going to the seaside. The train takes four hours, but I don't mind.",
    level: "A1-A2",
    topic: "Travel",
    hard: false,
  },
  {
    id: "test-paragraph-basic-friend",
    de: "Mein Freund heißt Tom. Wir kennen uns seit der Schule und sehen uns fast jede Woche.",
    en: "My friend is called Tom. We've known each other since school and see each other almost every week.",
    level: "A1-A2",
    topic: "Friends",
    hard: false,
  },
  {
    id: "test-paragraph-basic-evening",
    de: "Abends koche ich etwas Einfaches. Danach sehe ich fern oder rufe meine Mutter an.",
    en: "In the evening I cook something simple. After that I watch TV or ring my mum.",
    level: "A1-A2",
    topic: "Evenings",
    hard: false,
  },
  {
    id: "test-paragraph-upper-commute",
    de: "Seit ich näher am Büro wohne, fahre ich mit dem Rad zur Arbeit. Das spart mir jeden Tag fast eine Stunde, und ich komme deutlich wacher an, als wenn ich in der überfüllten Bahn stehe.",
    en: "Since I moved closer to the office I cycle to work. It saves me almost an hour a day, and I arrive far more awake than when I'm standing on a packed train.",
    level: "B2",
    topic: "Commuting",
    hard: true,
  },
  {
    id: "test-paragraph-upper-worklife",
    de: "Mein Arbeitgeber lässt uns weitgehend selbst entscheiden, wann wir im Büro sind. Das klingt bequem, verlangt aber deutlich mehr Disziplin, als die meisten am Anfang erwarten.",
    en: "My employer largely lets us decide for ourselves when we're in the office. That sounds convenient, but it demands considerably more discipline than most people expect at first.",
    level: "B2",
    topic: "Working life",
    hard: true,
  },
  {
    id: "test-paragraph-upper-rent",
    de: "Die Mieten sind in den letzten Jahren so stark gestiegen, dass viele junge Leute gar nicht mehr in die Innenstadt ziehen können. Wer eine bezahlbare Wohnung findet, gibt sie so schnell nicht wieder auf.",
    en: "Rents have risen so sharply in recent years that many young people can no longer move into the city centre at all. Anyone who finds an affordable flat doesn't give it up again in a hurry.",
    level: "B2",
    topic: "Housing",
    hard: true,
  },
  {
    id: "test-paragraph-upper-learning",
    de: "Eine Sprache lernt man nicht dadurch, dass man Vokabeln auswendig lernt, sondern dadurch, dass man sie benutzt, auch wenn man dabei ständig Fehler macht.",
    en: "You don't learn a language by memorising vocabulary, but by using it, even if you're constantly making mistakes while you do.",
    level: "B2",
    topic: "Learning",
    hard: true,
  },
  {
    id: "test-paragraph-upper-news",
    de: "Ich lese morgens bewusst nur kurz die Nachrichten. Sonst beschäftigt mich den ganzen Tag etwas, worauf ich ohnehin keinen Einfluss habe.",
    en: "I deliberately only skim the news in the mornings. Otherwise I spend the whole day preoccupied with something I have no influence over anyway.",
    level: "B2",
    topic: "News and media",
    hard: true,
  },
  {
    id: "test-paragraph-upper-health",
    de: "Nach der Operation musste ich mehrere Wochen kürzertreten. Anfangs fiel mir das schwer, inzwischen bin ich ganz froh, dass mich jemand dazu gezwungen hat.",
    en: "After the operation I had to take things easy for several weeks. At first I found that hard; by now I'm quite glad somebody forced me into it.",
    level: "B2",
    topic: "Health",
    hard: true,
  },
  {
    id: "test-paragraph-upper-money",
    de: "Wir legen jeden Monat einen festen Betrag zur Seite, bevor wir überhaupt anfangen, Geld auszugeben. Anders hätten wir vermutlich nie etwas gespart.",
    en: "We put a fixed amount aside every month before we even start spending anything. Otherwise we'd probably never have saved a thing.",
    level: "B2",
    topic: "Money",
    hard: true,
  },
  {
    id: "test-paragraph-upper-argument",
    de: "Wir streiten uns selten, aber wenn, dann geht es fast nie um das, worüber wir gerade reden. Meistens steckt etwas dahinter, das schon länger nicht angesprochen wurde.",
    en: "We rarely argue, but when we do it's almost never about what we're actually talking about. Usually there's something behind it that hasn't been raised for a while.",
    level: "B2",
    topic: "Relationships",
    hard: true,
  },
  {
    id: "test-paragraph-upper-city",
    de: "Die Stadt hat sich in den letzten zehn Jahren enorm verändert. Manches ist besser geworden, anderes vermisse ich, auch wenn ich nicht behaupten würde, dass früher alles schöner war.",
    en: "The city has changed enormously over the last ten years. Some things have got better, others I miss, even if I wouldn't claim everything used to be nicer.",
    level: "B2",
    topic: "City life",
    hard: true,
  },
  {
    id: "test-paragraph-upper-plans",
    de: "Wir hatten eigentlich vor, im Herbst umzuziehen, aber inzwischen spricht einiges dafür, noch ein Jahr zu warten und in Ruhe zu suchen.",
    en: "We were actually planning to move in the autumn, but by now there's quite a lot to be said for waiting another year and looking without rushing.",
    level: "B2",
    topic: "Plans",
    hard: true,
  },
] as const;

const PRESETS: TestPreset[] = [
  {
    id: "vocabulary",
    title: "Vocabulary",
    description: "Single words, from everyday basics up to long compounds.",
    eyebrow: "Words",
    icon: Sprout,
    tone: "green",
    filter: (item) => item.kind === "vocabulary",
    gradable: true,
  },
  {
    id: "phrases",
    title: "Phrases",
    description: "Whole sentences, where word order and case have to be right.",
    eyebrow: "Sentences",
    icon: MessageCircle,
    tone: "yellow",
    filter: (item) => item.kind === "phrase",
    gradable: true,
  },
  {
    id: "paragraphs",
    title: "Paragraphs",
    description: "Connected ideas across several sentences.",
    eyebrow: "Longer texts",
    icon: FileText,
    tone: "orange",
    filter: (item) => item.kind === "paragraph",
    gradable: true,
  },
  {
    id: "mixed",
    title: "Mixed practice",
    description: "Words, sentences and paragraphs from across your whole course.",
    eyebrow: "Everything",
    icon: Shuffle,
    tone: "ink",
    filter: () => true,
    gradable: true,
  },
  {
    id: "weak-spots",
    title: "Weak spots",
    description: "Only what you marked difficult or that is due for review.",
    eyebrow: "Personal review",
    icon: AlertTriangle,
    tone: "rose",
    filter: (item) => item.status === "struggle" || item.due,
  },
  // ── Exams ────────────────────────────────────────────────────────────────
  // Longer, fixed formats for learners who are past daily practice and want
  // something that actually tests them. Fixed length and direction so a score
  // means the same thing every time you sit one.
  {
    id: "exam-listening",
    title: "Listening exam",
    description: "40 questions you hear before you read. Trains the ear, not the eye.",
    eyebrow: "Exam",
    icon: Headphones,
    tone: "accent",
    filter: (item) => item.kind !== "paragraph",
    gradable: true,
    exam: true,
    fixedLength: 40,
    fixedDirection: "course",
    passMark: 70,
  },
  {
    id: "exam-marathon",
    title: "Marathon exam",
    description: "60 questions in both directions, across every level you have met.",
    eyebrow: "Exam",
    icon: Flame,
    tone: "orange",
    filter: () => true,
    exam: true,
    fixedLength: 60,
    fixedDirection: "mixed",
    passMark: 75,
  },
  {
    id: "exam-gauntlet",
    title: "The gauntlet",
    description: "50 of the hardest items you have seen, German to English and back.",
    eyebrow: "Exam",
    icon: Brain,
    tone: "accent",
    filter: (item) => item.difficulty === "hard" || item.difficulty === "expert",
    exam: true,
    fixedLength: 50,
    fixedDirection: "mixed",
    passMark: 80,
  },
  // ── An exam at every level ───────────────────────────────────────────────
  // The advanced exams below are only reachable if you are already strong. A
  // learner still on the basics deserves something to sit too, or "exam" just
  // means "the part of the app that isn't for me".
  {
    id: "exam-foundation",
    title: "Foundation exam",
    description: "30 everyday items at A1-A2. The first exam worth sitting.",
    eyebrow: "Exam",
    icon: Sprout,
    tone: "green",
    filter: (item) => item.difficulty === "easy",
    exam: true,
    fixedLength: 30,
    fixedDirection: "course",
    passMark: 70,
  },
  {
    id: "exam-intermediate",
    title: "Intermediate exam",
    description: "40 B1-level items in both directions, once the basics are solid.",
    eyebrow: "Exam",
    icon: MessageCircle,
    tone: "yellow",
    filter: (item) => item.difficulty === "medium",
    exam: true,
    fixedLength: 40,
    fixedDirection: "mixed",
    passMark: 72,
  },
  // ── For learners who are already good ────────────────────────────────────
  // The exams above test breadth. These test the things that actually separate
  // a confident intermediate from someone who sounds fluent: producing the
  // language rather than recognising it, holding a long sentence together, and
  // handling the top band with no easy items to pad the score.
  {
    id: "exam-production",
    title: "Production exam",
    description: "60 questions, every one answered in the language you're learning. No recognition to hide behind.",
    eyebrow: "Advanced",
    icon: PenLine,
    tone: "orange",
    filter: () => true,
    exam: true,
    fixedLength: 60,
    // "course" answers in the target language — the hard direction. Recognising
    // a phrase is a much lower bar than having to produce it from nothing.
    fixedDirection: "course",
    passMark: 75,
  },
  {
    id: "exam-c1",
    title: "C1 exam",
    description: "40 expert-level items only. Nothing easy is mixed in to soften the score.",
    eyebrow: "Advanced",
    icon: Sparkles,
    tone: "accent",
    filter: (item) => item.difficulty === "expert",
    exam: true,
    fixedLength: 40,
    fixedDirection: "mixed",
    passMark: 80,
  },
  {
    id: "exam-longform",
    title: "Long-form exam",
    description: "10 full paragraphs to translate. Tests whether you can hold a whole text together.",
    eyebrow: "Advanced",
    icon: FileText,
    tone: "ink",
    filter: (item) => item.kind === "paragraph",
    exam: true,
    // Paragraphs are minutes each, not seconds — ten is already a long sitting.
    fixedLength: 10,
    fixedDirection: "mixed",
    passMark: 70,
  },
  {
    id: "exam-precision",
    title: "Precision exam",
    description: "45 hard sentences produced from scratch, where word order and case have to be right.",
    eyebrow: "Advanced",
    icon: Flame,
    tone: "orange",
    filter: (item) =>
      item.kind === "phrase" && (item.difficulty === "hard" || item.difficulty === "expert"),
    exam: true,
    fixedLength: 45,
    fixedDirection: "course",
    passMark: 80,
  },
];

const toneClasses: Record<TestPreset["tone"], { icon: string; chip: string }> = {
  accent: {
    icon: "bg-[var(--accent-dim)] text-[var(--accent)]",
    chip: "bg-[var(--accent-dim)] text-[var(--accent)]",
  },
  yellow: {
    icon: "bg-[var(--yellow-dim)] text-[var(--yellow-ink)]",
    chip: "bg-[var(--yellow-dim)] text-[var(--yellow-ink)]",
  },
  green: {
    icon: "bg-emerald-500/12 text-emerald-500",
    chip: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    icon: "bg-orange-500/12 text-orange-500",
    chip: "bg-orange-500/12 text-orange-600 dark:text-orange-400",
  },
  ink: {
    icon: "bg-[var(--ink)] text-[var(--ink-text)]",
    chip: "bg-[var(--surface-3)] text-[var(--text-2)]",
  },
  rose: {
    icon: "bg-rose-500/12 text-rose-500",
    chip: "bg-rose-500/12 text-rose-600 dark:text-rose-400",
  },
};

function normalizeKey(value: string) {
  return String(value ?? "").trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
}

function isHardLevel(level: string) {
  return /(?:B1|B2|C1|C2)/i.test(level);
}

/**
 * Four difficulty bands, so one Vocabulary test can be taken at the level you
 * want instead of being split into a separate card per level.
 *
 * CEFR leads, because it is what the content is actually tagged with. Length is
 * a tie-breaker within a level: a fifteen-letter compound or a ten-word sentence
 * is genuinely harder to produce than a short one at the same level, and the old
 * boolean already used that signal.
 */
function difficultyFor(level: string, length: number, longThreshold: number): Difficulty {
  const cefr = /C[12]/i.test(level) ? 4 : /B2/i.test(level) ? 3 : /B1/i.test(level) ? 2 : 1;
  const stretched = length >= longThreshold;
  if (cefr >= 4) return "expert";
  if (cefr === 3) return stretched ? "expert" : "hard";
  if (cefr === 2) return stretched ? "hard" : "medium";
  return stretched ? "medium" : "easy";
}

function isDue(item: CatalogItem, grades: ReturnType<typeof loadGradeStore>) {
  const now = Date.now();
  return [item.id, ...(item.aliases ?? [])].some((id) => {
    const dueAt = grades[id]?.dueAt;
    return dueAt ? Date.parse(dueAt) <= now : false;
  });
}

function buildTestBank(apiParts: Record<string, Part>, profile: UserProfile): TestItem[] {
  const grades = loadGradeStore(profile);
  const catalog = buildCatalog(apiParts);
  const catalogVocab = new Map<string, CatalogItem>();
  const seen = new Set<string>();
  const bank: TestItem[] = [];

  for (const item of catalog) {
    if (item.kind !== "vocab") continue;
    const lookup = normalizeKey(item.lookup ?? item.de);
    catalogVocab.set(`${item.partKey}::${lookup}`, item);
  }

  const add = (item: TestItem) => {
    if (!item.de.trim() || !item.en.trim()) return;
    const key = `${normalizeKey(item.de)}::${normalizeKey(item.en)}`;
    if (seen.has(key)) return;
    seen.add(key);
    bank.push(item);
  };

  for (const [partKey, part] of Object.entries(apiParts)) {
    const level = part.level ?? "";
    const topic = part.theme ?? part.label ?? partKey;

    (part.vocab ?? []).forEach((word, index) => {
      const source =
        catalogVocab.get(`${partKey}::${normalizeKey(word.lookup ?? word.de)}`) ??
        catalogVocab.get(`${partKey}::${normalizeKey(word.de)}`);
      const id = source?.id ?? `${partKey}-test-vocab-${index}`;
      const aliases = source?.aliases ?? [];
      const status = statusForId(grades, id, aliases);
      const letters = normalizeKey(word.de).replace(/[^a-zäöüß]/gi, "").length;
      const longWord = letters >= 13;
      add({
        id,
        aliases,
        de: word.de,
        en: word.en,
        kind: "vocabulary",
        level,
        topic,
        hard: isHardLevel(level) || longWord,
        difficulty: difficultyFor(level, letters, 13),
        status,
        due: source ? isDue(source, grades) : false,
      });
    });
  }

  for (const item of catalog) {
    if (item.kind === "vocab") continue;
    const wordCount = normalizeKey(item.de).split(" ").filter(Boolean).length;
    add({
      id: item.id,
      aliases: item.aliases,
      de: item.de,
      en: item.en,
      kind: "phrase",
      level: item.level ?? "",
      topic: item.partLabel,
      hard: isHardLevel(item.level ?? "") || wordCount >= 8,
      difficulty: difficultyFor(item.level ?? "", wordCount, 8),
      status: statusForId(grades, item.id, item.aliases),
      due: isDue(item, grades),
    });
  }

  for (const paragraph of PARAGRAPH_TEST_ITEMS) {
    const status = statusForId(grades, paragraph.id);
    const dueAt = grades[paragraph.id]?.dueAt;
    add({
      ...paragraph,
      kind: "paragraph",
      // Paragraphs carry an explicit level, and every one of them is long, so
      // the word-count tie-breaker would push them all to the top band.
      difficulty: difficultyFor(paragraph.level, 0, Number.POSITIVE_INFINITY),
      status,
      due: dueAt ? Date.parse(dueAt) <= Date.now() : false,
    });
  }

  return bank;
}

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function answerLanguageFor(direction: TestDirection, index: number): AnswerLanguage {
  const courseLanguage: AnswerLanguage = learningEnglish() ? "en" : "de";
  if (direction === "course") return courseLanguage;
  if (direction === "reverse") return courseLanguage === "de" ? "en" : "de";
  return index % 2 === 0 ? courseLanguage : courseLanguage === "de" ? "en" : "de";
}

function vocabularyAlternatives(value: string, item: TestItem) {
  if (item.kind !== "vocabulary") return [value.trim()].filter(Boolean);
  return value
    .split(/\s+\/\s+|,\s*/)
    .map((alternative) => alternative.trim())
    .filter(Boolean);
}

function formatTestMeaning(value: string, item: TestItem) {
  const alternatives = vocabularyAlternatives(value, item);
  return alternatives.join(uiIsGerman() ? " ODER " : " OR ");
}

function matchTestAnswer(input: string, target: string, language: AnswerLanguage, item: TestItem) {
  // A paragraph has many correct translations, so comparing the whole string
  // against one reference rejected most good answers. Grade it on meaning.
  if (item.kind === "paragraph") return matchParagraphAnswer(input, target, language);
  const alternatives = vocabularyAlternatives(target, item);
  const matches = alternatives.map((alternative) =>
    language === "de"
      ? matchGermanSentence(input, alternative)
      : matchEnglishPhrase(input, alternative)
  );
  const accepted = matches.find((match) => match.ok);
  if (accepted) return accepted;

  // A standalone vocabulary answer starts its own field, so an initial
  // capital is natural even when the dictionary form is an adjective:
  // "Sauer" must be accepted for "sauer". Sentence exercises still use the
  // strict matcher directly and continue teaching German noun capitalisation.
  if (
    language === "de"
    && item.kind === "vocabulary"
    && matches.some((match) => match.capitalizationError)
  ) {
    return { ok: true, spellingNote: false };
  }

  return matches.find((match) => match.phrasingNote) ?? matches[0];
}

function getQuestionCopy(question: TestQuestion) {
  const answerIsGerman = question.answerLanguage === "de";
  return {
    source: formatTestMeaning(answerIsGerman ? question.item.en : question.item.de, question.item),
    sourceLanguage: answerIsGerman ? "en" : "de",
    target: answerIsGerman ? question.item.de : question.item.en,
    targetLabel: answerIsGerman ? "German" : "English",
  } as const;
}

function directionLabel(direction: TestDirection) {
  const german = ui("German");
  const english = ui("English");
  const course = learningEnglish() ? `${german} → ${english}` : `${english} → ${german}`;
  const reverse = learningEnglish() ? `${english} → ${german}` : `${german} → ${english}`;
  if (direction === "course") return course;
  if (direction === "reverse") return reverse;
  return ui("Both directions");
}

function PresetCard({
  count,
  preset,
  selected,
  onSelect,
}: {
  count: number;
  preset: TestPreset;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = preset.icon;
  const disabled = count === 0;
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "group relative min-h-[188px] overflow-hidden rounded-[22px] border p-5 text-left transition-all",
        selected
          ? "border-[var(--accent)] bg-[var(--accent-dim)] shadow-[0_16px_40px_var(--shadow)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:-translate-y-0.5 hover:border-[var(--border-2)] hover:shadow-[0_16px_38px_var(--shadow)]",
        disabled && "cursor-not-allowed opacity-55 hover:translate-y-0 hover:shadow-none"
      )}
      data-testid={`test-preset-${preset.id}`}
      disabled={disabled}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-[16px]", toneClasses[preset.tone].icon)}>
          <Icon className="h-5 w-5 stroke-[2.1]" />
        </span>
        {selected ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            <Check className="h-4 w-4 stroke-[3]" />
          </span>
        ) : (
          <ChevronRight className="mt-2 h-5 w-5 text-[var(--text-3)] transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
      <span className={cn("mt-5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase", toneClasses[preset.tone].chip)}>
        {ui(preset.eyebrow)}
      </span>
      <h3 className="mt-2 text-lg font-black tracking-tight text-[var(--text-1)]">{ui(preset.title)}</h3>
      <p className="mt-1.5 text-sm font-semibold leading-5 text-[var(--text-3)]">{ui(preset.description)}</p>
      <p className="mt-4 text-xs font-black text-[var(--text-2)]">
        {count.toLocaleString()} {ui(count === 1 ? "question available" : "questions available")}
      </p>
    </button>
  );
}

export function TestsView({
  apiParts,
  profile,
  onLearnItems,
}: {
  apiParts: Record<string, Part>;
  profile: UserProfile;
  /** Starts a guided lesson built from the words the learner marked. */
  onLearnItems?: (items: { de: string; en: string; id?: string }[]) => void;
}) {
  const [gradeRevision, setGradeRevision] = useState(0);
  const bank = useMemo(() => buildTestBank(apiParts, profile), [apiParts, gradeRevision, profile]);
  const [presetId, setPresetId] = useState<TestPresetId>("vocabulary");
  const [testLength, setTestLength] = useState<(typeof TEST_LENGTHS)[number]>(10);
  const [direction, setDirection] = useState<TestDirection>("course");
  // "all" keeps the old behaviour of drawing from every level at once.
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<TestResult | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [trackedStatuses, setTrackedStatuses] = useState<Record<string, ItemStatus>>({});
  // Words the learner clicked to say "I don't know this", keyed by the
  // normalised word so the same word marked in two sentences counts once.
  // The item it was marked in is kept as the fallback for anything the
  // vocabulary lookup cannot resolve.
  const [markedWords, setMarkedWords] = useState<Record<string, { word: string; item: TestItem }>>({});
  const answerInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const selectedPreset = PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
  // Difficulty only narrows presets that are graded by level. Weak spots and the
  // exams choose their own items on purpose, so a band would fight them.
  const difficultyApplies = Boolean(selectedPreset.gradable) && !selectedPreset.exam;
  const activeDifficulty = difficultyApplies ? difficulty : "all";
  const selectedPool = useMemo(
    () => bank.filter((item) =>
      (item.status !== "known" || item.due)
      && selectedPreset.filter(item)
      && (activeDifficulty === "all" || item.difficulty === activeDifficulty)),
    [bank, selectedPreset, activeDifficulty]
  );
  // How many items each band would give for the current preset, so a band that
  // would leave you with nothing can say so before you start.
  const difficultyCounts = useMemo(() => {
    const base = bank.filter((item) => (item.status !== "known" || item.due) && selectedPreset.filter(item));
    return {
      all: base.length,
      ...Object.fromEntries(DIFFICULTIES.map((d) => [d.id, base.filter((i) => i.difficulty === d.id).length])),
    } as Record<Difficulty | "all", number>;
  }, [bank, selectedPreset]);
  const effectiveLength = selectedPreset.fixedLength ?? testLength;
  const effectiveDirection = selectedPreset.fixedDirection ?? direction;
  const presetCounts = useMemo(
    () => Object.fromEntries(PRESETS.map((preset) => [
      preset.id,
      bank.filter((item) => (item.status !== "known" || item.due) && preset.filter(item)).length,
    ])),
    [bank]
  ) as Record<TestPresetId, number>;
  const currentQuestion = questions[questionIndex];
  const currentCopy = currentQuestion ? getQuestionCopy(currentQuestion) : null;
  const correctCount = results.filter((result) => result.correct).length;
  const scorePercent = results.length ? Math.round((correctCount / results.length) * 100) : 0;

  useEffect(() => {
    if (!currentQuestion || feedback || finished) return undefined;
    const timer = window.setTimeout(() => {
      const input = answerInputRef.current;
      if (!input || input.disabled) return;
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    }, 50);
    return () => window.clearTimeout(timer);
  }, [currentQuestion, feedback, finished]);

  const markedKeys = useMemo(() => new Set(Object.keys(markedWords)), [markedWords]);
  const markedCount = markedKeys.size;

  const toggleMarkedWord = (word: string, item: TestItem) => {
    const key = normalizeMarkWord(word);
    if (!key) return;
    setMarkedWords((current) => {
      if (current[key]) {
        const { [key]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [key]: { word, item } };
    });
  };

  /**
   * Turn marked words into things worth teaching.
   *
   * A marked word is a request, not a lesson: "aufgestellt" on its own teaches
   * nothing. So each word is resolved against the course itself — preferring a
   * vocabulary entry for that exact word, then any phrase short enough to still
   * be about that word — and only falling back to the sentence it was marked in
   * when the course has nothing better. That fallback matters: it is what makes
   * marking a word in a paragraph still produce something teachable.
   */
  const buildLessonFromMarks = () => {
    const catalog = buildCatalog(apiParts);
    const vocabByWord = new Map<string, CatalogItem>();
    const phraseByWord = new Map<string, CatalogItem>();
    for (const entry of catalog) {
      const isVocab = entry.kind === "vocab";
      const head = normalizeMarkWord(entry.lookup ?? entry.de);
      if (isVocab && head && !vocabByWord.has(head)) vocabByWord.set(head, entry);
      if (!isVocab) {
        const words = normalizeKey(entry.de).split(" ").filter(Boolean);
        // Only short phrases stand in for a single word; in a long sentence the
        // marked word is incidental rather than the point.
        if (words.length > 6) continue;
        for (const word of words) {
          const key = normalizeMarkWord(word);
          if (key && !phraseByWord.has(key)) phraseByWord.set(key, entry);
        }
      }
    }

    const out: { de: string; en: string; id?: string }[] = [];
    const seen = new Set<string>();
    const push = (de: string, en: string, id?: string) => {
      const key = normalizeKey(de);
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({ de, en, id });
    };

    for (const [key, { item }] of Object.entries(markedWords)) {
      const match = vocabByWord.get(key) ?? phraseByWord.get(key);
      if (match) push(match.de, match.en, match.id);
      else push(item.de, item.en, item.id);
    }
    return out;
  };

  const learnMarkedWords = () => {
    const items = buildLessonFromMarks();
    if (!items.length) return;
    // Also record them as struggles, so they keep coming back through normal
    // review even after this one lesson.
    for (const { item } of Object.values(markedWords)) {
      setItemStatus(item.id, "struggle", profile, item.aliases);
    }
    onLearnItems?.(items);
  };

  const resetTest = () => {
    setQuestions([]);
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setResults([]);
    setFinished(false);
    setTrackedStatuses({});
    setMarkedWords({});
  };

  const startTest = () => {
    // The gauntlet is meant to hurt: take the hardest items first rather than a
    // random sample, so it is not quietly diluted by whatever shuffled in.
    const pool = selectedPreset.id === "exam-gauntlet"
      ? [...selectedPool].sort((a, b) =>
          (b.difficulty === "expert" ? 1 : 0) - (a.difficulty === "expert" ? 1 : 0))
      : shuffled(selectedPool);
    const picked = pool.slice(0, Math.min(effectiveLength, pool.length));
    setQuestions(
      picked.map((item, index) => ({
        item,
        answerLanguage: answerLanguageFor(effectiveDirection, index),
      }))
    );
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setResults([]);
    setFinished(false);
    setTrackedStatuses({});
    window.requestAnimationFrame(() => window.scrollTo({ behavior: "auto", top: 0 }));
  };

  const gradeAnswer = (skipped = false) => {
    if (!currentQuestion || feedback) return;
    const copy = getQuestionCopy(currentQuestion);
    const match = skipped
      ? { ok: false, spellingNote: false }
      : matchTestAnswer(answer, copy.target, currentQuestion.answerLanguage, currentQuestion.item);
    const result: TestResult = {
      question: currentQuestion,
      answer,
      correct: match.ok,
      skipped,
      spellingNote: match.spellingNote,
      phrasingNote: match.phrasingNote,
    };
    setFeedback(result);
    setResults((current) => [...current, result]);
  };

  const nextQuestion = () => {
    if (!feedback) return;
    if (questionIndex >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((index) => index + 1);
    setAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    if (!currentQuestion || !currentCopy || feedback || !answer.trim()) return;
    const answerMatch = matchTestAnswer(
      answer,
      currentCopy.target,
      currentQuestion.answerLanguage,
      currentQuestion.item
    );
    if (answerMatch.ok && !answerMatch.spellingNote) gradeAnswer();
    // Grade against the current question only when the learner edits the answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  useEffect(() => {
    if (!feedback?.correct) return;
    const timer = window.setTimeout(nextQuestion, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  const markTrackedStatus = (item: TestItem, status: Extract<ItemStatus, "known" | "struggle">) => {
    setItemStatus(item.id, status, profile, item.aliases);
    setTrackedStatuses((current) => ({ ...current, [item.id]: status }));
    setGradeRevision((revision) => revision + 1);
  };

  const markKnownAndAdvance = () => {
    if (!currentQuestion) return;
    markTrackedStatus(currentQuestion.item, "known");

    // "Know it" is an explicit opt-out from testing this item, not a wrong
    // answer or a scored skip. If feedback was already shown, remove that
    // current result before advancing so the score remains fair.
    if (feedback) {
      setResults((current) => current.slice(0, -1));
    }
    setAnswer("");
    setFeedback(null);
    if (questionIndex >= questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex((index) => index + 1);
    }
  };

  const hearPrompt = () => {
    if (!currentCopy) return;
    void tts(
      currentCopy.source,
      0.88,
      currentCopy.sourceLanguage === "de" ? "de-DE" : "en-GB"
    );
  };

  if (finished) {
    const missed = results.filter((result) => !result.correct);
    return (
      <div className="mx-auto max-w-[1120px]" data-testid="test-results">
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_22px_55px_var(--shadow)] sm:p-9">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--accent)]" />
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-dim)] px-3 py-1.5 text-xs font-black text-[var(--accent)]">
                <Trophy className="h-4 w-4" />
                {ui("Test complete")}
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-1)] sm:text-4xl">
                {selectedPreset.passMark !== undefined
                  ? scorePercent >= selectedPreset.passMark
                    ? ui("Passed")
                    : ui("Not passed this time")
                  : scorePercent >= 80
                    ? ui("Strong result")
                    : scorePercent >= 60
                      ? ui("Good progress")
                      : ui("Keep practising")}
              </h1>
              {selectedPreset.passMark !== undefined && (
                <p className="mt-2 text-sm font-black text-[var(--text-2)]">
                  {ui("Pass mark")}: {selectedPreset.passMark}% — {ui("you scored")} {scorePercent}%
                </p>
              )}
              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[var(--text-3)]">
                {ui("Review the answers you missed, then try the same level again or build a different test.")}
              </p>
            </div>
            <div className="flex min-w-[220px] items-center gap-5 rounded-[22px] bg-[var(--surface-2)] p-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-[var(--accent)] bg-[var(--surface)]">
                <span className="text-2xl font-black text-[var(--text-1)]">{scorePercent}%</span>
              </div>
              <div>
                <p className="text-2xl font-black text-[var(--text-1)]">{correctCount}/{results.length}</p>
                <p className="text-xs font-bold text-[var(--text-3)]">{ui("correct answers")}</p>
              </div>
            </div>
          </div>

          {missed.length > 0 ? (
            <div className="mt-8 border-t border-[var(--border)] pt-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[var(--text-1)]">{ui("Answers to review")}</h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("These are worth another quick pass.")}</p>
                </div>
                <span className="rounded-full bg-rose-500/12 px-3 py-1.5 text-xs font-black text-rose-500">
                  {missed.length} {ui("to review")}
                </span>
              </div>
              <div className="mt-4 divide-y divide-[var(--border)] rounded-[20px] border border-[var(--border)] bg-[var(--surface-2)] px-4">
                {missed.slice(0, 8).map((result, index) => {
                  const copy = getQuestionCopy(result.question);
                  const trackedStatus = trackedStatuses[result.question.item.id] ?? result.question.item.status;
                  return (
                    <div className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center sm:gap-4" key={`${result.question.item.id}-${index}`}>
                      <p className="font-bold text-[var(--text-2)]">
                        <MarkableText
                          marked={markedKeys}
                          onToggleWord={(word) => toggleMarkedWord(word, result.question.item)}
                          text={copy.source}
                        />
                      </p>
                      <ArrowRight className="hidden h-4 w-4 text-[var(--text-3)] sm:block" />
                      <p className="font-black text-[var(--text-1)] sm:text-right">
                        <MarkableText
                          marked={markedKeys}
                          onToggleWord={(word) => toggleMarkedWord(word, result.question.item)}
                          text={formatTestMeaning(copy.target, result.question.item)}
                        />
                      </p>
                      <div className="flex gap-2">
                        <button
                          aria-pressed={trackedStatus === "known"}
                          className={cn(
                            "inline-flex h-9 items-center justify-center gap-2 rounded-[12px] border px-3 text-xs font-black transition-colors",
                            trackedStatus === "known"
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400"
                          )}
                          onClick={() => markTrackedStatus(result.question.item, "known")}
                          type="button"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {ui("Know it")}
                        </button>
                        <button
                          aria-pressed={trackedStatus === "struggle"}
                          className={cn(
                            "inline-flex h-9 items-center justify-center rounded-[12px] border px-3 text-xs font-black transition-colors",
                            trackedStatus === "struggle"
                              ? "border-rose-500 bg-rose-500 text-white"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 dark:text-rose-400"
                          )}
                          onClick={() => markTrackedStatus(result.question.item, "struggle")}
                          type="button"
                        >
                          {ui("Struggle")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8 flex items-center gap-3 rounded-[20px] bg-emerald-500/10 p-5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
              <p className="font-black">{ui("Perfect score — every answer was correct.")}</p>
            </div>
          )}

          {/* The learner's own list, gathered by clicking words during the test.
              This is the only thing on this screen that they chose rather than
              the score choosing for them, so it leads. */}
          {markedCount > 0 && (
            <div className="mt-8 rounded-[20px] border border-amber-500/30 bg-amber-400/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[var(--text-1)]">
                    {markedCount} {ui(markedCount === 1 ? "word you marked" : "words you marked")}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                    {ui("Start a lesson on exactly these, and they'll come back in your reviews.")}
                  </p>
                </div>
                <button
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-5 text-sm font-black text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                  data-testid="learn-marked"
                  onClick={learnMarkedWords}
                  type="button"
                >
                  <GraduationCap className="h-4 w-4" />
                  {ui("Continue learning")}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(markedWords).map(([key, { word }]) => (
                  <button
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] hover:text-[var(--text-1)]"
                    key={key}
                    onClick={() =>
                      setMarkedWords((current) => {
                        const { [key]: _removed, ...rest } = current;
                        return rest;
                      })
                    }
                    title={ui("Remove from the list")}
                    type="button"
                  >
                    {word}
                    <X className="h-3 w-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[var(--ink)] px-5 text-sm font-black text-[var(--ink-text)] transition-transform active:scale-[0.98]"
              onClick={startTest}
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              {ui("Retake test")}
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--surface-2)] px-5 text-sm font-black text-[var(--text-1)] hover:bg-[var(--surface-3)]"
              onClick={resetTest}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              {ui("Choose another test")}
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (currentQuestion && currentCopy) {
    const progress = Math.round(((questionIndex + (feedback ? 1 : 0)) / questions.length) * 100);
    const trackedStatus = trackedStatuses[currentQuestion.item.id] ?? currentQuestion.item.status;
    const isParagraph = currentQuestion.item.kind === "paragraph";
    return (
      <div className="mx-auto max-w-[1060px]" data-testid="test-runner">
        <div className="mb-5 flex items-center justify-between gap-4">
          <button
            className="inline-flex items-center gap-2 text-sm font-black text-[var(--text-3)] hover:text-[var(--text-1)]"
            onClick={resetTest}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui("Exit test")}
          </button>
          <p className="text-xs font-black uppercase text-[var(--text-3)]">
            {ui("Question")} {questionIndex + 1} {ui("of")} {questions.length}
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-3)]">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
          />
        </div>

        <section className="mt-5 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[var(--accent-dim)] text-[var(--accent)]">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-[var(--accent)]">{ui(selectedPreset.title)}</p>
                <p className="mt-0.5 text-sm font-bold text-[var(--text-3)]">{directionLabel(direction)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs font-black text-[var(--text-2)]">
                {correctCount} {ui("correct")}
              </span>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs font-black text-[var(--text-2)]">
                {currentQuestion.item.level || ui("Course")}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-5 rounded-[22px] bg-[var(--surface-2)] p-5 sm:p-7">
              <div>
                <p className="text-[11px] font-black uppercase text-[var(--text-3)]">
                  {ui("Translate into")} {ui(currentCopy.targetLabel)}
                </p>
                <h1 className={cn(
                  "mt-4 font-black tracking-tight text-[var(--text-1)]",
                  isParagraph
                    ? "max-w-[72ch] text-lg leading-relaxed sm:text-xl"
                    : "text-2xl leading-tight sm:text-4xl"
                )}>
                  <MarkableText
                    marked={markedKeys}
                    onToggleWord={(word) => toggleMarkedWord(word, currentQuestion.item)}
                    text={currentCopy.source}
                  />
                </h1>
                <p className="mt-3 text-[11px] font-bold text-[var(--text-3)]">
                  {markedCount > 0
                    ? `${markedCount} ${ui(markedCount === 1 ? "word marked to learn" : "words marked to learn")}`
                    : ui("Click any word you don't know — you can learn them all at the end.")}
                </p>
                <p className="mt-3 text-xs font-bold text-[var(--text-3)]">{currentQuestion.item.topic}</p>
              </div>
              <button
                aria-label={ui("Hear prompt")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--accent)] text-white shadow-[0_8px_20px_var(--shadow)] transition-transform hover:scale-105 active:scale-95"
                onClick={hearPrompt}
                title={ui("Hear prompt")}
                type="button"
              >
                <Headphones className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
              <div>
                <p className="text-xs font-black text-[var(--text-1)]">{ui("Review tracker")}</p>
                <p className="mt-0.5 text-xs font-semibold text-[var(--text-3)]">
                  {ui("Choose how soon this should appear in Continue Learning.")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  aria-pressed={trackedStatus === "known"}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-[13px] border px-4 text-xs font-black transition-all active:scale-[0.98]",
                    trackedStatus === "known"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400"
                  )}
                  data-testid="test-mark-known"
                  onClick={markKnownAndAdvance}
                  type="button"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {ui("Know it")}
                </button>
                <button
                  aria-pressed={trackedStatus === "struggle"}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-[13px] border px-4 text-xs font-black transition-all active:scale-[0.98]",
                    trackedStatus === "struggle"
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 dark:text-rose-400"
                  )}
                  data-testid="test-mark-struggle"
                  onClick={() => markTrackedStatus(currentQuestion.item, "struggle")}
                  type="button"
                >
                  {ui("Struggle")}
                </button>
              </div>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-xs font-black uppercase text-[var(--text-3)]">
                {ui("Your answer")}
              </span>
              {isParagraph ? (
                <textarea
                  autoFocus
                  ref={answerInputRef}
                  className={cn(
                    "min-h-40 w-full resize-y rounded-[18px] border-2 bg-[var(--surface)] px-5 py-4 text-base font-bold leading-7 text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-3)]",
                    feedback
                      ? feedback.correct
                        ? "border-emerald-500"
                        : "border-rose-500"
                      : "border-[var(--border-2)] focus:border-[var(--accent)]"
                  )}
                  data-testid="test-answer"
                  disabled={Boolean(feedback)}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder={uiIsGerman() ? `Auf ${ui(currentCopy.targetLabel)} antworten...` : `Answer in ${ui(currentCopy.targetLabel)}...`}
                  value={answer}
                />
              ) : (
                <input
                  autoFocus
                  ref={answerInputRef}
                  className={cn(
                    "h-16 w-full rounded-[18px] border-2 bg-[var(--surface)] px-5 text-lg font-bold text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-3)]",
                    feedback
                      ? feedback.correct
                        ? "border-emerald-500"
                        : "border-rose-500"
                      : "border-[var(--border-2)] focus:border-[var(--accent)]"
                  )}
                  data-testid="test-answer"
                  disabled={Boolean(feedback)}
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    if (feedback) nextQuestion();
                    else if (answer.trim()) gradeAnswer();
                  }}
                  placeholder={uiIsGerman() ? `Auf ${ui(currentCopy.targetLabel)} antworten...` : `Answer in ${ui(currentCopy.targetLabel)}...`}
                  value={answer}
                />
              )}
            </label>

            {feedback && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-4 rounded-[18px] border p-4",
                  feedback.correct
                    ? "border-emerald-500/25 bg-emerald-500/10"
                    : "border-rose-500/25 bg-rose-500/10"
                )}
                initial={{ opacity: 0, y: 5 }}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    feedback.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  )}>
                    {feedback.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className={cn("font-black", feedback.correct ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                      {feedback.correct
                        ? ui(feedback.spellingNote ? "Correct — check the spelling note." : "Correct answer")
                        : ui(feedback.skipped ? "Question skipped" : feedback.phrasingNote ? "Understandable, but not the natural answer." : "Not quite")}
                    </p>
                    {!feedback.correct && (
                      <p className="mt-1 text-sm font-semibold text-[var(--text-2)]">
                        {ui("Accepted answer")}:{" "}
                        <strong className="font-black">
                          {formatTestMeaning(currentCopy.target, currentQuestion.item)}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {!feedback ? (
                <>
                  <button
                    className="h-12 rounded-[16px] px-4 text-sm font-black text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                    onClick={() => gradeAnswer(true)}
                    type="button"
                  >
                    {ui("Skip question")}
                  </button>
                  <button
                    className="inline-flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-6 text-sm font-black text-white shadow-[0_8px_0_var(--accent-pressed)] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
                    data-testid="check-test-answer"
                    disabled={!answer.trim()}
                    onClick={() => gradeAnswer()}
                    type="button"
                  >
                    {ui("Check answer")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="ml-auto flex flex-wrap justify-end gap-3">
                  <button
                    className="inline-flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-[16px] bg-[var(--ink)] px-6 text-sm font-black text-[var(--ink-text)] transition-transform active:scale-[0.98]"
                    data-testid="next-test-question"
                    onClick={nextQuestion}
                    type="button"
                  >
                    {questionIndex === questions.length - 1 ? ui("See results") : ui("Next question")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px]" data-testid="tests-view">
      <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[0_18px_45px_var(--shadow)] sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--accent-dim)] text-[var(--accent)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-[var(--accent)]">
                {ui("Build a focused test")}
              </p>
              <h1 className="mt-1 text-2xl font-black text-[var(--text-1)] sm:text-3xl">{ui("Tests")}</h1>
              <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-[var(--text-3)]">
                {ui("Choose what you want to test, set the challenge, and get a clear score without changing your lesson progress.")}
              </p>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 divide-x divide-y divide-[var(--border)] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] sm:grid-cols-4 sm:divide-y-0 lg:w-auto">
            <div className="min-w-0 px-3 py-3 sm:min-w-[104px] sm:px-4">
              <p className="text-lg font-black text-[var(--text-1)]">{bank.filter((item) => item.kind === "vocabulary").length.toLocaleString()}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase text-[var(--text-3)]">{ui("Words")}</p>
            </div>
            <div className="min-w-0 px-3 py-3 sm:min-w-[104px] sm:px-4">
              <p className="text-lg font-black text-[var(--text-1)]">{bank.filter((item) => item.kind === "phrase").length.toLocaleString()}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase text-[var(--text-3)]">{ui("Phrases")}</p>
            </div>
            <div className="min-w-0 px-3 py-3 sm:min-w-[104px] sm:px-4">
              <p className="text-lg font-black text-[var(--text-1)]">{bank.filter((item) => item.kind === "paragraph").length.toLocaleString()}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase text-[var(--text-3)]">{ui("Paragraphs")}</p>
            </div>
            <div className="min-w-0 px-3 py-3 sm:min-w-[104px] sm:px-4">
              <p className="text-lg font-black text-[var(--text-1)]">{presetCounts["weak-spots"].toLocaleString()}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase text-[var(--text-3)]">{ui("Weak spots")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-[var(--accent)]">{ui("Test library")}</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-1)]">{ui("What do you want to practise?")}</h2>
            </div>
            <p className="hidden text-sm font-bold text-[var(--text-3)] sm:block">{PRESETS.length} {ui("test types")}</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
            {PRESETS.map((preset) => (
              <PresetCard
                count={presetCounts[preset.id]}
                key={preset.id}
                onSelect={() => setPresetId(preset.id)}
                preset={preset}
                selected={presetId === preset.id}
              />
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_45px_var(--shadow)] xl:sticky xl:top-[112px]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[var(--accent-dim)] text-[var(--accent)]">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-[var(--text-3)]">{ui("Test setup")}</p>
              <h2 className="font-black text-[var(--text-1)]">{ui(selectedPreset.title)}</h2>
            </div>
          </div>

          {/* One test per kind now, so the level is a choice rather than a
              separate card. Hidden for weak spots and the exams, which pick
              their own items. */}
          {difficultyApplies && (
            <div className="mt-6">
              <p className="text-xs font-black uppercase text-[var(--text-3)]">{ui("Difficulty")}</p>
              <div className="mt-2 grid gap-1.5">
                {([{ id: "all" as const, label: "Every level", blurb: "Draw from all levels at once." }, ...DIFFICULTIES])
                  .map((band) => {
                    const count = difficultyCounts[band.id] ?? 0;
                    const empty = count === 0;
                    return (
                      <button
                        aria-pressed={difficulty === band.id}
                        className={cn(
                          "flex min-h-11 items-center justify-between gap-3 rounded-[14px] border px-3.5 py-2 text-left transition-colors",
                          difficulty === band.id
                            ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--border-2)]",
                          empty && "opacity-45"
                        )}
                        disabled={empty}
                        key={band.id}
                        onClick={() => setDifficulty(band.id)}
                        title={ui(band.blurb)}
                        type="button"
                      >
                        <span className="text-sm font-black">{ui(band.label)}</span>
                        <span className="text-xs font-bold tabular-nums opacity-70">{count.toLocaleString()}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs font-black uppercase text-[var(--text-3)]">{ui("Number of questions")}</p>
            {selectedPreset.fixedLength ? (
              <p className="mt-2 rounded-[14px] bg-[var(--surface-2)] px-3.5 py-3 text-sm font-bold text-[var(--text-2)]">
                {ui("This exam is a fixed")} {selectedPreset.fixedLength} {ui("questions, so scores stay comparable.")}
                {selectedPreset.passMark !== undefined && (
                  <> {ui("Pass mark")}: <strong className="text-[var(--text-1)]">{selectedPreset.passMark}%</strong>.</>
                )}
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-3 gap-2 rounded-[16px] bg-[var(--surface-2)] p-1.5">
                {TEST_LENGTHS.map((length) => (
                  <button
                    aria-pressed={testLength === length}
                    className={cn(
                      "h-10 rounded-[12px] text-sm font-black transition-colors",
                      testLength === length
                        ? "bg-[var(--surface)] text-[var(--text-1)] shadow-sm"
                        : "text-[var(--text-3)] hover:text-[var(--text-1)]"
                    )}
                    key={length}
                    onClick={() => setTestLength(length)}
                    type="button"
                  >
                    {length}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5">
            <p className="text-xs font-black uppercase text-[var(--text-3)]">{ui("Translation direction")}</p>
            {selectedPreset.fixedDirection ? (
              <p className="mt-2 rounded-[14px] bg-[var(--surface-2)] px-3.5 py-3 text-sm font-bold text-[var(--text-2)]">
                {directionLabel(selectedPreset.fixedDirection)} — {ui("fixed for this exam.")}
              </p>
            ) : (
              <div className="mt-2 grid gap-2">
                {(["course", "reverse", "mixed"] as TestDirection[]).map((option) => (
                  <button
                    aria-pressed={direction === option}
                    className={cn(
                      "flex min-h-11 items-center justify-between gap-3 rounded-[14px] border px-3.5 text-left text-sm font-black transition-colors",
                      direction === option
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--border-2)]"
                    )}
                    key={option}
                    onClick={() => setDirection(option)}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      {option === "mixed" ? <Shuffle className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
                      {directionLabel(option)}
                    </span>
                    {direction === option && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-[16px] bg-[var(--surface-2)] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[var(--text-3)]">{ui("Questions")}</span>
              <strong className="text-sm font-black text-[var(--text-1)]">
                {Math.min(effectiveLength, selectedPool.length)}
              </strong>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[var(--text-3)]">{ui("Available")}</span>
              <strong className="text-sm font-black text-[var(--text-1)]">
                {selectedPool.length.toLocaleString()}
              </strong>
            </div>
          </div>

          <button
            className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[17px] bg-[var(--accent)] px-5 text-sm font-black text-white shadow-[0_8px_0_var(--accent-pressed)] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
            data-testid="start-test"
            disabled={selectedPool.length === 0}
            onClick={startTest}
            type="button"
          >
            {ui("Start test")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
      </div>
    </div>
  );
}
