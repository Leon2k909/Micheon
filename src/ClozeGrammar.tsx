import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronRight, Lightbulb, BookOpen, Search } from "lucide-react";
import { ui, uiIsGerman } from "@/lib/i18n";

type GrammarExample = { de: string; en: string };
type GrammarTip = {
  id: string;
  title: string;
  level: string;
  summary: string;
  rules: string[];
  tip: string;
  examples: GrammarExample[];
};
type ClozeExercise = {
  id: string;
  sentence: string;
  answer: string;
  hint: string;
  tip_id: string;
};

// ── Grammar tips data ─────────────────────────────────────────────────────────
export const GRAMMAR_TIPS: GrammarTip[] = [
  {
    id: "articles",
    title: "Nouns and articles: der, die, das",
    level: "A1",
    summary: "German nouns have a grammatical gender: der, die or das. The gender is not always logical, so learn the article as part of the word.",
    rules: [
      "Masculine (der): der Mann, der Hund, der Bahnhof",
      "Feminine (die): die Frau, die Stadt, die Frage",
      "Neuter (das): das Kind, das Haus, das Fenster",
      "The plural definite article is always die: die Männer, die Frauen, die Kinder.",
      "Plural endings vary, so learn the plural too: der Tag → die Tage; das Buch → die Bücher.",
    ],
    tip: "Learn every noun with its article from day one. Say 'der Hund' not just 'Hund'.",
    examples: [
      { de: "Der Mann trinkt Kaffee.", en: "The man drinks coffee." },
      { de: "Die Stadt ist groß.", en: "The city is big." },
      { de: "Das Kind spielt.", en: "The child plays." },
    ],
  },
  {
    id: "basic_word_order",
    title: "Main statements: verb in position 2",
    level: "A1",
    summary: "In a normal German main statement, the changed verb is the second element, not necessarily the second word. Questions and dependent clauses use different patterns.",
    rules: [
      "Subject first: Ich lerne Deutsch.",
      "Time first: Heute lerne ich Deutsch.",
      "Place first: In Berlin lerne ich Deutsch.",
      "If something other than the subject comes first, the subject moves behind the verb.",
      "Yes/no question: Kommst du heute? Dependent clause: ..., weil du heute kommst.",
    ],
    tip: "If you move something to the front, the subject jumps behind the verb.",
    examples: [
      { de: "Ich gehe heute nach Hause.", en: "I am going home today." },
      { de: "Heute gehe ich nach Hause.", en: "Today I am going home." },
    ],
  },
  {
    id: "sein_haben",
    title: "sein vs haben",
    level: "A1",
    summary: "'sein' means 'to be', 'haben' means 'to have'. Both are irregular and used constantly.",
    rules: [
      "ich bin / ich habe",
      "du bist / du hast",
      "er/sie/es ist / er hat",
      "wir sind / wir haben",
      "ihr seid / ihr habt",
      "sie/Sie sind / sie haben",
    ],
    tip: "These two verbs are the backbone of German. Drill them until they're automatic.",
    examples: [
      { de: "Ich bin müde.", en: "I am tired." },
      { de: "Er hat Zeit.", en: "He has time." },
    ],
  },
  {
    id: "negation",
    title: "Negation: nicht & kein",
    level: "A1",
    summary: "Use kein to negate a noun that would normally use ein/eine or no article. Use nicht for verbs, descriptions, names, definite nouns and anything you contrast directly.",
    rules: [
      "Verb negation: Ich gehe nicht. (I am not going.)",
      "Adjective: Das ist nicht gut. (That is not good.)",
      "Noun without a definite article: Ich habe kein Geld. / Das ist keine gute Idee.",
      "Definite noun: Ich nehme nicht den Bus, sondern den Zug.",
      "kein follows the same pattern as ein: kein/keine/kein, then keinen/keinem where needed.",
    ],
    tip: "Use kein when you mean no or not any: kein Geld, keine Zeit, keine Freunde. Use nicht for actions, descriptions, names and definite nouns.",
    examples: [
      { de: "Ich verstehe das nicht.", en: "I do not understand that." },
      { de: "Ich habe keine Zeit.", en: "I have no time." },
    ],
  },
  {
    id: "modal_verbs",
    title: "Modal verbs",
    level: "A1",
    summary: "Words such as können, müssen, wollen, sollen and dürfen say what is possible, necessary, wanted, recommended or allowed. A second verb stays in its basic form at the end.",
    rules: [
      "können: can/to be able to",
      "müssen: must/to have to",
      "wollen: to want to",
      "sollen: should / to be supposed to",
      "dürfen: may/to be allowed to",
      "möchten: would like; this is the everyday polite form used for requests.",
      "With a second verb, that verb goes to the end: Ich kann heute kommen.",
    ],
    tip: "Ich kann Deutsch sprechen. The modal is second and the infinitive is last.",
    examples: [
      { de: "Ich kann das machen.", en: "I can do that." },
      { de: "Du musst jetzt gehen.", en: "You have to go now." },
      { de: "Wir wollen Deutsch lernen.", en: "We want to learn German." },
    ],
  },
  {
    id: "accusative",
    title: "The person or thing directly affected",
    level: "A1",
    summary: "After many everyday verbs, the person or thing directly affected takes the accusative form. The most visible article change is masculine der/ein → den/einen.",
    rules: [
      "Masculine: der → den, ein → einen",
      "Feminine: die stays die, eine stays eine",
      "Neuter: das stays das, ein stays ein",
      "Plural: die stays die",
      "Pronouns also change: mich, dich, ihn, sie, es, uns, euch, sie/Sie.",
    ],
    tip: "For article forms, watch masculine den/einen first. Also learn common verb phrases whole: mich sehen, dir helfen, auf dich warten.",
    examples: [
      { de: "Ich sehe den Mann.", en: "I see the man." },
      { de: "Ich kaufe einen Kaffee.", en: "I am buying a coffee." },
      { de: "Ich lese die Zeitung.", en: "I am reading the newspaper." },
    ],
  },
  {
    id: "separable_verbs",
    title: "Separable verbs",
    level: "A1",
    summary: "In main statements and direct questions, many common verb prefixes split off. In an infinitive or dependent clause, the verb stays together.",
    rules: [
      "aufstehen → Ich stehe auf. (I get up.)",
      "anrufen → Ich rufe dich an. (I call you.)",
      "einkaufen → Wir kaufen ein. (We shop.)",
      "Main statement: Ich rufe dich später an.",
      "Infinitive: Ich will dich später anrufen. Dependent clause: ..., weil ich dich später anrufe.",
    ],
    tip: "When you learn a separable verb, always note which part splits off.",
    examples: [
      { de: "Ich stehe um 7 Uhr auf.", en: "I get up at 7 o'clock." },
      { de: "Ruf mich bitte an!", en: "Please call me!" },
    ],
  },
  {
    id: "present_tense",
    title: "Present tense: who is doing it?",
    level: "A1",
    summary: "The verb ending normally shows who is acting. German present tense covers both 'I work' and 'I am working', and it often describes a planned future too.",
    rules: [
      "Regular pattern: ich mache, du machst, er/sie/es macht, wir machen, ihr macht, sie/Sie machen.",
      "Stems ending in -d or -t often add an e: du arbeitest, er wartet.",
      "Some common verbs change their vowel only with du and er/sie/es: du fährst, er liest, sie spricht.",
      "Context supplies the English tense: Ich arbeite gerade = I am working; Ich arbeite montags = I work on Mondays.",
      "A future time can make the present future: Morgen fahre ich nach Berlin.",
    ],
    tip: "Learn a new verb with its du and er/sie/es forms when they change: fahren, du fährst, er fährt.",
    examples: [
      { de: "Ich koche gerade.", en: "I'm cooking right now." },
      { de: "Sie fährt morgen nach Köln.", en: "She's going to Cologne tomorrow." },
      { de: "Arbeitest du heute?", en: "Are you working today?" },
    ],
  },
  {
    id: "questions",
    title: "Questions without an extra 'do'",
    level: "A1",
    summary: "German forms questions by moving the changed verb or by putting a question word first. It does not add a separate word like English do or does.",
    rules: [
      "Yes/no question: Kommst du heute? Hast du Zeit?",
      "Question word + verb + subject: Wann kommst du? Wo wohnst du?",
      "Use wohin for destination and woher for origin: Wohin fährst du? Woher kommst du?",
      "With a person after a preposition: Mit wem sprichst du? Auf wen wartest du?",
      "In an indirect question, the verb moves to the end: Weißt du, wann er kommt?",
    ],
    tip: "Build the short question first: Wann kommst du? Add details only after that frame feels automatic.",
    examples: [
      { de: "Hast du kurz Zeit?", en: "Have you got a moment?" },
      { de: "Warum bist du so spät?", en: "Why are you so late?" },
      { de: "Weißt du, wo sie ist?", en: "Do you know where she is?" },
    ],
  },
  {
    id: "perfect_past",
    title: "Talking about the past: the spoken perfect",
    level: "A2",
    summary: "In everyday conversation, German usually talks about completed past events with haben or sein plus a past form at the end.",
    rules: [
      "Most verbs use haben: Ich habe gearbeitet. Wir haben das gesehen.",
      "Many changes of place or state use sein: Ich bin gegangen. Sie ist eingeschlafen.",
      "Regular verbs often use ge- + stem + -t: machen → gemacht. Many irregular verbs end in -en: sehen → gesehen.",
      "Separable verbs put ge between the parts: anrufen → angerufen. Verbs ending in -ieren take no ge: studiert.",
      "sein, haben and modal verbs are often simple past even in speech: war, hatte, konnte, musste.",
    ],
    tip: "Learn the helper and past form together: gehen, ist gegangen; sehen, hat gesehen.",
    examples: [
      { de: "Ich habe sie gestern gesehen.", en: "I saw her yesterday." },
      { de: "Wir sind spät angekommen.", en: "We arrived late." },
      { de: "Ich konnte nicht schlafen.", en: "I couldn't sleep." },
    ],
  },
  {
    id: "dative",
    title: "The receiver: mir, dir, dem, der",
    level: "A2",
    summary: "The dative form often marks the receiver or the person affected. Some common verbs and prepositions always require it.",
    rules: [
      "Definite articles: dem Mann, der Frau, dem Kind, den Kindern.",
      "Pronouns: mir, dir, ihm, ihr, ihm, uns, euch, ihnen/Ihnen.",
      "Common verbs: jemandem helfen, danken, gefallen, gehören and fehlen.",
      "Common prepositions: mit, nach, aus, zu, von and bei always take the dative.",
      "Plural nouns normally add -n when possible: mit den Kindern, bei den Freunden.",
    ],
    tip: "Learn the whole phrase, not a case label: Kannst du mir helfen? Das gefällt mir.",
    examples: [
      { de: "Kannst du mir helfen?", en: "Can you help me?" },
      { de: "Ich fahre mit dem Bus.", en: "I'm going by bus." },
      { de: "Das gehört meiner Schwester.", en: "That belongs to my sister." },
    ],
  },
  {
    id: "two_way_prepositions",
    title: "Where it is vs where it goes",
    level: "A2",
    summary: "With an, auf, hinter, in, neben, über, unter, vor and zwischen, use the dative for a location and the accusative for a destination or change of position.",
    rules: [
      "Location (where?): Das Buch liegt auf dem Tisch.",
      "Destination (where to?): Ich lege das Buch auf den Tisch.",
      "Movement alone does not decide it: Ich laufe im Park describes where I am running.",
      "A destination changes the form: Ich laufe in den Park means I run into the park.",
      "Common contractions: im = in dem, am = an dem, ins = in das, ans = an das.",
    ],
    tip: "Ask whether the sentence shows a place or a new destination, not simply whether somebody is moving.",
    examples: [
      { de: "Die Schlüssel liegen in der Tasche.", en: "The keys are in the bag." },
      { de: "Ich stecke die Schlüssel in die Tasche.", en: "I'm putting the keys into the bag." },
      { de: "Wir sitzen vor dem Haus.", en: "We're sitting in front of the house." },
    ],
  },
  {
    id: "commands_requests",
    title: "Commands and friendly requests",
    level: "A2",
    summary: "Direct commands are short, but everyday German often softens them with bitte, mal or a question using können.",
    rules: [
      "du command: Komm! Warte! Nimm das! The du is normally omitted.",
      "ihr command: Kommt! Wartet! Nehmt das!",
      "Formal command: Kommen Sie bitte rein. Warten Sie einen Moment.",
      "Friendly request: Kannst du mir kurz helfen? Könnten Sie das bitte wiederholen?",
      "Separable prefixes remain at the end: Ruf mich bitte an!",
    ],
    tip: "With strangers or staff, a question with könnten plus bitte is safer than a bare command.",
    examples: [
      { de: "Warte bitte kurz.", en: "Please wait a moment." },
      { de: "Könnten Sie das bitte wiederholen?", en: "Could you repeat that, please?" },
      { de: "Kommt gut nach Hause!", en: "Get home safely!" },
    ],
  },
  {
    id: "comparisons",
    title: "Comparing things",
    level: "A2",
    summary: "Use so ... wie for equal comparisons, -er + als for differences, and am ...sten for the strongest form.",
    rules: [
      "Equal: Sie ist so groß wie ich.",
      "Different: Er ist älter als sein Bruder.",
      "Highest degree: Das ist am einfachsten.",
      "Some vowels change: alt → älter, groß → größer, warm → wärmer.",
      "Common irregular forms: gut → besser → am besten; viel → mehr → am meisten; gern → lieber → am liebsten.",
    ],
    tip: "wie means 'as'; als means 'than'. The common learner error is mixing those two frames.",
    examples: [
      { de: "Heute ist es wärmer als gestern.", en: "It's warmer today than yesterday." },
      { de: "Ich fahre lieber mit dem Zug.", en: "I prefer travelling by train." },
      { de: "Das geht am schnellsten.", en: "That's the quickest way." },
    ],
  },
  {
    id: "possessives",
    title: "Saying whose it is",
    level: "A2",
    summary: "mein, dein, sein, ihr, unser, euer and Ihr follow the same basic ending pattern as ein.",
    rules: [
      "mein/dein: my/your; unser/euer: our/your (plural).",
      "sein means his or its; ihr can mean her or their; capital Ihr is formal your.",
      "The ending follows the noun: mein Bruder, meine Schwester, mein Kind, meine Freunde.",
      "Masculine direct object: Ich sehe meinen Bruder.",
      "euer drops its middle e before many endings: eure Wohnung, euren Hund.",
    ],
    tip: "First choose the owner, then let the noun decide the ending: ihr + Bruder = ihr Bruder; ihr + Schwester = ihre Schwester.",
    examples: [
      { de: "Ist das dein Handy?", en: "Is that your phone?" },
      { de: "Ich treffe heute meine Eltern.", en: "I'm meeting my parents today." },
      { de: "Wie ist Ihre Adresse?", en: "What is your address?" },
    ],
  },
  {
    id: "subordinate_clauses",
    title: "Giving reasons and adding detail",
    level: "A2",
    summary: "After weil, dass, wenn, obwohl and ob, the changed verb goes to the end of that clause. This lets you explain reasons, thoughts, conditions and contrasts.",
    rules: [
      "Reason: Ich bleibe zu Hause, weil ich krank bin.",
      "Thought or report: Ich glaube, dass er heute kommt.",
      "Condition or repeated time: Wenn ich Zeit habe, rufe ich dich an.",
      "Contrast: Obwohl es regnet, gehen wir spazieren.",
      "If the dependent clause comes first, the main verb follows the comma: Wenn ich Zeit habe, komme ich mit.",
    ],
    tip: "Keep a comma before the dependent clause and save its changed verb for the end.",
    examples: [
      { de: "Ich komme später, weil ich noch arbeite.", en: "I'm coming later because I'm still working." },
      { de: "Sag mir bitte, ob du kommst.", en: "Please tell me whether you're coming." },
      { de: "Obwohl ich müde bin, gehe ich mit.", en: "Although I'm tired, I'm coming along." },
    ],
  },
  {
    id: "verbs_with_pronouns",
    title: "Verbs with mich, dich and sich",
    level: "A2",
    summary: "Some verbs include a pronoun that points back to the same person: ich freue mich, du erinnerst dich, wir treffen uns.",
    rules: [
      "Forms: ich mich, du dich, er/sie/es sich, wir uns, ihr euch, sie/Sie sich.",
      "Some verbs normally need it: sich beeilen, sich erinnern, sich interessieren.",
      "The meaning can change: Ich stelle die Tasche hin, but Ich stelle mich vor = I introduce myself.",
      "The pronoun may be dative when another object follows: Ich wasche mir die Hände.",
      "Learn any partner preposition too: sich auf etwas freuen, sich an etwas erinnern.",
    ],
    tip: "Store the complete chunk in the ich and du forms: Ich freue mich. Freust du dich?",
    examples: [
      { de: "Ich erinnere mich nicht daran.", en: "I don't remember that." },
      { de: "Beeil dich bitte!", en: "Please hurry up!" },
      { de: "Wir treffen uns um acht.", en: "We're meeting at eight." },
    ],
  },
  {
    id: "verbs_with_prepositions",
    title: "Verbs with a fixed partner word",
    level: "B1",
    summary: "Many common verbs naturally pair with one preposition. Learn the pair as one expression because a direct English translation often chooses the wrong word.",
    rules: [
      "warten auf: Ich warte auf den Bus. / Auf wen wartest du?",
      "denken an: Ich denke oft an dich.",
      "sprechen mit/über: Ich spreche mit ihr über das Problem.",
      "sich freuen auf = look forward to; sich freuen über = be pleased about something already here or known.",
      "For things use wo(r)- / da(r)-: Worauf wartest du? Darauf habe ich gewartet. For people use preposition + wen/wem.",
    ],
    tip: "Never learn only warten or teilnehmen. Learn warten auf and an etwas teilnehmen as complete units.",
    examples: [
      { de: "Worüber redet ihr?", en: "What are you talking about?" },
      { de: "Ich freue mich auf das Wochenende.", en: "I'm looking forward to the weekend." },
      { de: "Daran habe ich nicht gedacht.", en: "I didn't think of that." },
    ],
  },
  {
    id: "relative_clauses",
    title: "Adding 'who', 'that' or 'which'",
    level: "B1",
    summary: "A relative clause adds information about a noun. It starts with a form of der/die/das and sends its changed verb to the end.",
    rules: [
      "The noun supplies gender and number: der Mann, der ...; die Frau, die ...; das Buch, das ....",
      "The role inside the added clause supplies the form: der Mann, den ich kenne; der Mann, dem ich helfe.",
      "The changed verb goes to the end: Das ist die Frau, die mir geholfen hat.",
      "After a preposition keep that preposition: die Firma, bei der ich arbeite.",
      "Use was after alles, etwas, nichts and das: Alles, was du brauchst, ist hier.",
    ],
    tip: "Say the noun again mentally inside the added clause: Ich kenne den Mann → der Mann, den ich kenne.",
    examples: [
      { de: "Das ist der Kollege, der mir geholfen hat.", en: "That's the colleague who helped me." },
      { de: "Wo ist das Buch, das du gekauft hast?", en: "Where is the book you bought?" },
      { de: "Das ist die Firma, bei der ich arbeite.", en: "That's the company I work for." },
    ],
  },
  {
    id: "konjunktiv_two",
    title: "Would, could and polite wishes",
    level: "B1",
    summary: "würde, hätte, wäre and könnte help you make polite requests, give advice and imagine situations that are not currently real.",
    rules: [
      "Polite wish: Ich hätte gern einen Kaffee.",
      "Polite request: Könnten Sie mir helfen? Würdest du kurz warten?",
      "Imagined situation: Wenn ich mehr Zeit hätte, würde ich öfter kochen.",
      "Advice: An deiner Stelle würde ich mit ihr reden.",
      "Common short forms are preferable to würde sein/haben/können: wäre, hätte, könnte.",
    ],
    tip: "For everyday politeness, learn three complete frames first: Ich hätte gern ..., Könnten Sie ...?, An deiner Stelle würde ich ....",
    examples: [
      { de: "Ich hätte gern die Rechnung.", en: "I'd like the bill." },
      { de: "Wenn ich du wäre, würde ich anrufen.", en: "If I were you, I'd call." },
      { de: "Könntest du mir kurz helfen?", en: "Could you help me for a moment?" },
    ],
  },
  {
    id: "zu_infinitive",
    title: "Plans and purposes with zu",
    level: "B1",
    summary: "Many verbs and descriptions lead into zu plus a basic verb. um ... zu explains a purpose when the same person performs both actions.",
    rules: [
      "After common verbs: Ich versuche, früher zu kommen. Ich habe vergessen, dich anzurufen.",
      "After descriptions: Es ist wichtig, genug zu schlafen.",
      "Purpose with the same subject: Ich lerne Deutsch, um in Berlin zu arbeiten.",
      "Separable verb: anzurufen, aufzustehen. Inseparable verb: zu verstehen.",
      "No zu after a modal verb: Ich kann kommen, not ich kann zu kommen.",
    ],
    tip: "With um ... zu, check that the hidden person is the same in both actions. If it changes, use damit instead.",
    examples: [
      { de: "Ich habe vergessen, Brot zu kaufen.", en: "I forgot to buy bread." },
      { de: "Sie spart Geld, um zu reisen.", en: "She's saving money in order to travel." },
      { de: "Es ist schön, dich wiederzusehen.", en: "It's nice to see you again." },
    ],
  },
  {
    id: "adjective_endings",
    title: "Adjective endings without memorising chaos",
    level: "B1",
    summary: "An adjective before a noun carries an ending. The article and adjective share the job of showing gender, number and sentence role.",
    rules: [
      "After der/die/das forms, the adjective is usually -e or -en: der neue Job, mit dem neuen Chef.",
      "After ein has no visible ending, the adjective supplies it: ein guter Plan, eine gute Idee, ein gutes Buch.",
      "The common masculine direct-object pattern is einen + -en: einen guten Kaffee.",
      "After die, meine or keine in the plural, use -en: die neuen Kollegen, meine alten Freunde.",
      "Without an article, the adjective carries more information: kaltes Wasser, guter Kaffee.",
    ],
    tip: "Master high-frequency chunks before a full table: ein guter ..., eine gute ..., ein gutes ..., einen guten ....",
    examples: [
      { de: "Ich brauche einen neuen Termin.", en: "I need a new appointment." },
      { de: "Das ist eine gute Idee.", en: "That's a good idea." },
      { de: "Wir wohnen in einer kleinen Wohnung.", en: "We live in a small flat." },
    ],
  },
  {
    id: "passive_voice",
    title: "Focusing on what happens",
    level: "B1",
    summary: "Use werden plus the past form when the action matters more than the person doing it. Use sein plus the past form for the resulting state.",
    rules: [
      "Action: Das Paket wird heute geliefert. = The parcel is being delivered today.",
      "Past action: Das Paket wurde gestern geliefert.",
      "Resulting state: Die Tür ist geschlossen. = The door is closed.",
      "Name the actor with von when useful: Das wurde von meiner Kollegin organisiert.",
      "With a modal: Das muss heute gemacht werden.",
    ],
    tip: "Use active sentences when the person matters. Passive is useful for processes, rules, news and situations where the actor is unknown.",
    examples: [
      { de: "Hier wird gerade gebaut.", en: "There's construction work going on here." },
      { de: "Die Rechnung wurde schon bezahlt.", en: "The bill has already been paid." },
      { de: "Die Tür ist abgeschlossen.", en: "The door is locked." },
    ],
  },
  {
    id: "connectors",
    title: "Linking ideas without losing word order",
    level: "B1",
    summary: "German connectors fall into different word-order patterns. Knowing the pattern lets you explain reasons, contrasts and results naturally.",
    rules: [
      "und, aber, oder, denn and sondern keep normal main-clause order: Ich komme, aber ich bleibe nicht lange.",
      "weil, obwohl, dass and wenn send the changed verb to the end.",
      "deshalb, deswegen, trotzdem and dann occupy the first position, so the verb follows: Es regnet. Trotzdem gehe ich raus.",
      "sondern follows a negative correction: Nicht heute, sondern morgen.",
      "A connector can start a new sentence; long chains are not more natural just because they are grammatical.",
    ],
    tip: "Learn one model per family: aber ich komme; weil ich komme; deshalb komme ich.",
    examples: [
      { de: "Ich bin müde, aber ich komme trotzdem mit.", en: "I'm tired, but I'm still coming along." },
      { de: "Der Zug fällt aus. Deshalb nehme ich den Bus.", en: "The train is cancelled, so I'm taking the bus." },
      { de: "Nicht am Freitag, sondern am Samstag.", en: "Not on Friday, but on Saturday." },
    ],
  },
  {
    id: "narrative_past",
    title: "war, hatte and telling a story",
    level: "B1",
    summary: "Conversation normally uses the spoken perfect, but war, hatte and past modal forms are common. Written stories use the simple past more widely.",
    rules: [
      "Common in speech: ich war, ich hatte, ich konnte, ich musste, ich wollte.",
      "Most other spoken events use the perfect: Ich habe ihn angerufen.",
      "Written narrative often uses simple past: Er öffnete die Tür und ging hinaus.",
      "For an event that happened before another past event, use hatte/war + past form: Ich hatte schon gegessen.",
      "Keep the time line clear with zuerst, dann, danach, vorher and plötzlich.",
    ],
    tip: "For conversation, prioritise war, hatte and the modal past forms; recognise the wider simple past when reading.",
    examples: [
      { de: "Ich war müde und hatte keine Lust.", en: "I was tired and didn't feel like it." },
      { de: "Als ich ankam, hatte sie schon gegessen.", en: "When I arrived, she had already eaten." },
      { de: "Dann ist plötzlich das Licht ausgegangen.", en: "Then the light suddenly went out." },
    ],
  },
  {
    id: "genitive_possession",
    title: "Possession and the genitive",
    level: "B1",
    summary: "The genitive often expresses 'of'. It is common in writing and fixed phrases; everyday speech also frequently uses von plus the dative.",
    rules: [
      "Articles: das Auto des Mannes; die Tür der Wohnung; die Namen der Kinder.",
      "Masculine and neuter nouns usually add -s or -es: des Tages, des Kindes, des Hotels.",
      "Names normally come first without an apostrophe: Marias Auto, Leons Wohnung.",
      "Everyday alternative: das Auto von meinem Bruder.",
      "Standard written German uses the genitive after trotz, während and wegen, though dative alternatives occur in speech.",
    ],
    tip: "Use the clear von phrase in conversation when unsure, but learn the genitive so signs, news and formal writing make sense.",
    examples: [
      { de: "Das ist das Handy meines Bruders.", en: "That's my brother's phone." },
      { de: "Wegen des Wetters bleiben wir zu Hause.", en: "We're staying home because of the weather." },
      { de: "Wie ist der Name der Firma?", en: "What's the name of the company?" },
    ],
  },
  {
    id: "modal_particles",
    title: "Small words that make speech sound human",
    level: "B2",
    summary: "Words such as mal, doch, ja, eben, halt and wohl often express attitude rather than a dictionary meaning. They soften, remind, contradict or show an assumption.",
    rules: [
      "mal often softens a request: Schau mal. Warte mal kurz.",
      "doch can contradict or encourage: Das stimmt doch nicht. Komm doch mit.",
      "ja can mark shared or obvious information: Das ist ja klar.",
      "eben or halt can show acceptance or resignation: Dann ist das eben so.",
      "wohl marks an assumption: Er ist wohl schon zu Hause.",
      "Tone and context matter. Leaving these words out is grammatical; adding too many can sound forced.",
    ],
    tip: "Learn each small word inside complete phrases you actually hear. There is rarely one fixed English translation.",
    examples: [
      { de: "Komm doch einfach mit.", en: "Why don't you just come along?" },
      { de: "Das weißt du ja schon.", en: "You already know that, of course." },
      { de: "Dann machen wir das halt morgen.", en: "Then we'll just do it tomorrow." },
    ],
  },
  {
    id: "past_counterfactual",
    title: "Regret and unreal past situations",
    level: "B2",
    summary: "Use hätte or wäre plus a past form for something that did not happen. With a modal verb, German often ends with two basic verb forms.",
    rules: [
      "Unreal past: Wenn ich das gewusst hätte, wäre ich früher gekommen.",
      "Regret: Das hätte ich nicht sagen sollen.",
      "Missed possibility: Wir hätten früher gehen können.",
      "With a modal, use hätte + main infinitive + modal infinitive: hätte sagen sollen, hätte kommen können.",
      "The dependent clause still ends with the verb group: ..., weil ich früher hätte gehen müssen.",
    ],
    tip: "Memorise the useful regret frame as one unit: Das hätte ich nicht ... sollen.",
    examples: [
      { de: "Ich hätte dich anrufen sollen.", en: "I should have called you." },
      { de: "Das wäre nicht nötig gewesen.", en: "That wouldn't have been necessary." },
      { de: "Wir hätten das schaffen können.", en: "We could have managed that." },
    ],
  },
  {
    id: "indirect_speech",
    title: "Reporting what somebody said",
    level: "B2",
    summary: "In conversation, German usually reports speech with dass and normal verb forms. News and formal writing often use Konjunktiv I to show that the claim belongs to someone else.",
    rules: [
      "Everyday conversation: Sie sagt, dass sie morgen kommt.",
      "Formal report: Sie sagt, sie komme morgen.",
      "Common forms: er sei, er habe, er werde, er könne, er müsse.",
      "If Konjunktiv I looks identical to the normal form, formal German often uses Konjunktiv II instead.",
      "Pronouns, place and time may need to change: 'Ich bleibe hier' → Er sagt, er bleibe dort.",
    ],
    tip: "Use dass clauses in ordinary conversation. Learn Konjunktiv I mainly to understand reporting, news and formal writing.",
    examples: [
      { de: "Er sagt, dass er keine Zeit hat.", en: "He says that he doesn't have time." },
      { de: "Laut Polizei sei niemand verletzt worden.", en: "According to police, nobody was injured." },
      { de: "Sie meinte, sie könne später kommen.", en: "She said she could come later." },
    ],
  },
  {
    id: "future_assumptions",
    title: "Future plans and assumptions",
    level: "B2",
    summary: "German often uses the present tense for real future plans. werden is useful for promises, predictions and assumptions rather than every future sentence.",
    rules: [
      "Planned future: Morgen treffe ich Anna. The time word already makes the future clear.",
      "Promise or prediction: Ich werde dich anrufen. Das wird schwierig.",
      "Present assumption: Er wird wohl noch arbeiten. = He's probably still working.",
      "Past assumption: Sie wird den Zug verpasst haben. = She probably missed the train.",
      "werden takes the changed position; the main verb or past verb group goes to the end.",
    ],
    tip: "Do not translate every English will with werden. A present-tense German sentence is often the most natural future.",
    examples: [
      { de: "Ich rufe dich morgen an.", en: "I'll call you tomorrow." },
      { de: "Das wird schon klappen.", en: "It'll work out." },
      { de: "Er wird wohl zu Hause sein.", en: "He's probably at home." },
    ],
  },
  {
    id: "advanced_clause_links",
    title: "Explaining how, without and the more ... the more",
    level: "C1",
    summary: "Advanced connectors let you express method, alternatives and linked change precisely. Each connector has its own reliable sentence frame.",
    rules: [
      "Method with indem: Sie löst das Problem, indem sie direkt nachfragt.",
      "Without doing something: Er ging, ohne sich zu verabschieden. If the person changes, use ohne dass.",
      "Instead of doing something: Statt anzurufen, schrieb sie eine Nachricht. With a different person, use statt dass.",
      "Linked change: Je länger wir warten, desto teurer wird es. The desto clause has main-clause word order.",
      "Imagined comparison: Er tut so, als ob er alles wüsste. In careful speech, als ob sends the verb to the end.",
    ],
    tip: "Choose the shortest frame that keeps the people clear. Use zu when the same person performs both actions; use dass when the person changes.",
    examples: [
      { de: "Sie hat das Problem gelöst, indem sie direkt nachgefragt hat.", en: "She solved the problem by asking directly." },
      { de: "Je länger ich darüber nachdenke, desto weniger gefällt es mir.", en: "The longer I think about it, the less I like it." },
      { de: "Er ging, ohne sich zu verabschieden.", en: "He left without saying goodbye." },
    ],
  },
  {
    id: "passive_alternatives",
    title: "Natural alternatives to the passive",
    level: "C1",
    summary: "German often avoids a heavy passive sentence. man, sich lassen, sein + zu and a fitting adjective can express the same idea more naturally.",
    rules: [
      "Active with man: Man kann das leicht erklären.",
      "sich lassen + basic verb: Das lässt sich leicht erklären.",
      "sein + zu + basic verb: Das ist leicht zu erklären.",
      "Adjective ending in -bar or -lich: Das Problem ist lösbar. Die Schrift ist kaum leserlich.",
      "Some verbs use sich for a general process: Das Buch verkauft sich gut.",
    ],
    tip: "In conversation, man kann ... is usually the clearest choice. Use the other forms when they make the sentence shorter or shift the focus naturally.",
    examples: [
      { de: "Das lässt sich nicht vermeiden.", en: "That can't be avoided." },
      { de: "Die Datei ist leicht zu finden.", en: "The file is easy to find." },
      { de: "So etwas erklärt sich nicht von selbst.", en: "Something like that doesn't explain itself." },
    ],
  },
  {
    id: "information_structure",
    title: "Putting familiar and important information in the right place",
    level: "C1",
    summary: "German word order is not only about correct positions. It also guides the listener from familiar context towards the important new point.",
    rules: [
      "The first position sets the frame: Mit Anna habe ich gestern gesprochen. Gestern habe ich mit Anna gesprochen.",
      "Short unstressed pronouns usually come early: Ich habe es ihm gestern erklärt.",
      "With two nouns, the receiver often comes first: Ich habe meinem Bruder das Auto geliehen.",
      "A pronoun usually comes before a noun: Ich habe es meinem Bruder geliehen.",
      "Important new information often comes later: Was ich wichtig finde, ist die klare Erklärung.",
    ],
    tip: "If a sentence is grammatical but feels awkward, keep short pronouns early and place the genuinely new point nearer the end.",
    examples: [
      { de: "Darüber habe ich mit ihr noch nicht gesprochen.", en: "I haven't talked to her about that yet." },
      { de: "Ich habe es meiner Kollegin gestern geschickt.", en: "I sent it to my colleague yesterday." },
      { de: "Was mir fehlt, ist eine klare Antwort.", en: "What I'm missing is a clear answer." },
    ],
  },
  {
    id: "fixed_noun_verb_phrases",
    title: "Useful noun and verb combinations",
    level: "C1",
    summary: "German often packages an action as a noun plus a common verb. These combinations are frequent in work, services, news and careful conversation.",
    rules: [
      "eine Entscheidung treffen = decide; Bescheid geben = let someone know.",
      "Rücksicht nehmen auf = take account of; zur Verfügung stehen = be available.",
      "in Frage kommen = be an option; in Kontakt bleiben = stay in touch.",
      "The noun and verb form one meaning, but normal word-order rules still apply: Das kommt für mich nicht in Frage.",
      "Prefer a simple verb when it sounds more direct: entscheiden is often clearer than eine Entscheidung treffen.",
    ],
    tip: "Learn these as complete conversational chunks, including the preposition: Rücksicht auf jemanden nehmen, jemandem Bescheid geben.",
    examples: [
      { de: "Gib mir bitte Bescheid, sobald du mehr weißt.", en: "Please let me know as soon as you know more." },
      { de: "Das kommt für mich nicht in Frage.", en: "That's not an option for me." },
      { de: "Ich stehe jederzeit zur Verfügung.", en: "I'm available at any time." },
    ],
  },
  {
    id: "claim_and_distance",
    title: "Showing who claims something and how certain it is",
    level: "C2",
    summary: "Careful German separates a verified fact from a report, claim or assumption through verb form, source wording and small stance words.",
    rules: [
      "Neutral report: Sie sagt, sie habe nichts davon gewusst.",
      "A claim the speaker does not confirm: Er will davon nichts gewusst haben.",
      "A report about someone else: Sie soll bereits abgereist sein.",
      "An assumption: Das dürfte stimmen. Er wird wohl noch unterwegs sein.",
      "A source phrase can be clearest: Laut Bericht wurde niemand verletzt.",
    ],
    tip: "Do not use a formal reported form just to sound advanced. Use it when the source of the claim or your distance from it genuinely matters.",
    examples: [
      { de: "Er will die Nachricht nicht gesehen haben.", en: "He claims not to have seen the message." },
      { de: "Sie soll inzwischen in Berlin wohnen.", en: "She is said to live in Berlin now." },
      { de: "Das dürfte kein Problem sein.", en: "That probably won't be a problem." },
    ],
  },
  {
    id: "register_precision_de",
    title: "Changing register without changing the message",
    level: "C2",
    summary: "Advanced control means choosing grammar that fits a chat, a polite request, a meeting or formal writing, not making every sentence more complicated.",
    rules: [
      "Casual: Schickst du mir das kurz? Neutral polite: Könntest du mir das bitte schicken?",
      "Direct: Wir müssen das ändern. Diplomatic: Wir sollten das vielleicht noch einmal überdenken.",
      "Spoken framing: Ich meine damit, dass .... Formal alternative: Entscheidend ist, dass ....",
      "A passive or noun-heavy style can sound official; a clear active verb often sounds more human.",
      "Modal particles change tone: Komm mit. Komm doch mit. Komm mal mit. Context decides which one fits.",
    ],
    tip: "The most advanced choice is often the simplest sentence that matches the relationship and situation.",
    examples: [
      { de: "Könnten wir das vielleicht auf morgen verschieben?", en: "Could we perhaps move that to tomorrow?" },
      { de: "Ganz überzeugt bin ich davon noch nicht.", en: "I'm not entirely convinced by that yet." },
      { de: "Entscheidend ist, dass wir eine klare Lösung finden.", en: "What matters is that we find a clear solution." },
    ],
  },
  // Individual phrases carry their own "sounds like" hint, but these reductions
  // turn up in hundreds of sentences each. Repeating them per phrase would be
  // noise. They belong here once, as rules.
  {
    id: "spoken_reductions",
    title: "Common spoken pronunciation",
    level: "A2",
    summary: "Everyday German often compresses unstressed sounds. The exact result varies by region and situation, so learn to recognise common forms without treating one accent as the only correct German.",
    rules: [
      "eu and äu use the sound in English 'boy': heute, Leute, Häuser.",
      "Unstressed -en is often reduced: machen can sound like mach'n, haben like hab'n, and gehen like gehn.",
      "Contractions such as gibt's, geht's and hab ich are normal. Relaxed nicht may sound like nich, but standard writing remains nicht.",
      "The sound in ich is lighter than the sound in ach, noch and Buch. Neither has a perfect English equivalent.",
      "In standard northern pronunciation, unstressed final -ig often sounds like -ich. Pronunciations closer to -ik or -ig are normal in other regions.",
      "Final -er is often softened: Vater and wieder do not end with a strong English r in most German accents.",
      "w usually sounds like English v; z is ts; at the start of many native words, sp/st sound like shp/sht. The letter v varies: Vater begins with f, Vase with v.",
      "Informal forms such as haste or kannste exist, but they are regional and casual. Recognise them; you never need to imitate them to sound natural.",
    ],
    tip: "Use the clear full form yourself and train your ear on several German accents. Natural speech is not one fixed set of shortcuts.",
    examples: [
      { de: "Wollen wir nach Hause gehen?", en: "Shall we go home? (Unstressed -en may be very light.)" },
      { de: "Hast du das nicht gesehen?", en: "Didn't you see that? (Casual speech may compress hast du and nicht.)" },
      { de: "Das ist richtig wichtig.", en: "That's really important. (The two -ig endings vary by region.)" },
    ],
  },
];

export const ENGLISH_GRAMMAR_TIPS: GrammarTip[] = [
  {
    id: "articles",
    title: "Artikel: a, an und the",
    level: "A1",
    summary: "A und an stehen bei einer nicht näher bestimmten Sache. The bezeichnet etwas Bestimmtes oder bereits Bekanntes.",
    rules: [
      "a vor einem Konsonantenlaut: a room, a university",
      "an vor einem Vokallaut: an apple, an hour",
      "the für etwas Bestimmtes: the room we booked",
      "Kein Artikel bei allgemeinen Pluralen: Dogs are friendly.",
    ],
    tip: "Entscheidend ist der Laut, nicht der erste Buchstabe: an hour, aber a university.",
    examples: [
      { de: "I need a room.", en: "Ich brauche ein Zimmer." },
      { de: "The room is ready.", en: "Das Zimmer ist fertig." },
      { de: "She has an idea.", en: "Sie hat eine Idee." },
    ],
  },
  {
    id: "verb_position",
    title: "Grundwortstellung",
    level: "A1",
    summary: "In einfachen englischen Aussagesätzen steht meist Subjekt, Verb, Objekt.",
    rules: [
      "Subjekt zuerst: I speak English.",
      "Dann das Verb: She works today.",
      "Ort steht in neutralen Sätzen oft vor Zeit: We meet at the café tomorrow.",
      "Adverbien wie usually stehen vor dem Hauptverb, aber nach be.",
    ],
    tip: "Beginne mit Subjekt + Verb. Das hält auch längere Sätze verständlich.",
    examples: [
      { de: "I drink coffee every morning.", en: "Ich trinke jeden Morgen Kaffee." },
      { de: "She is usually early.", en: "Sie ist normalerweise früh da." },
    ],
  },
  {
    id: "be_have",
    title: "be und have",
    level: "A1",
    summary: "Be bedeutet sein, have bedeutet haben. Beide Verben sind sehr häufig und unregelmäßig.",
    rules: [
      "I am / I have",
      "you are / you have",
      "he, she, it is / has",
      "we, they are / have",
    ],
    tip: "Lerne die Kurzformen gleich mit: I'm, you're, he's, we've und they've.",
    examples: [
      { de: "I'm tired.", en: "Ich bin müde." },
      { de: "She has time.", en: "Sie hat Zeit." },
    ],
  },
  {
    id: "negation",
    title: "Verneinung",
    level: "A1",
    summary: "Bei be setzt du not direkt dahinter. Bei den meisten anderen Verben verwendest du do not oder does not.",
    rules: [
      "be: I am not tired. / She isn't here.",
      "andere Verben: I don't know.",
      "he, she, it: He doesn't work here.",
      "Nach don't und doesn't steht die Grundform: doesn't like, nicht doesn't likes.",
    ],
    tip: "Im Gespräch sind don't, doesn't, isn't und aren't die normalen Formen.",
    examples: [
      { de: "I don't understand.", en: "Ich verstehe nicht." },
      { de: "He isn't at home.", en: "Er ist nicht zu Hause." },
    ],
  },
  {
    id: "modal_verbs",
    title: "Modalverben",
    level: "A2",
    summary: "Can, must, should, may und might stehen vor der Grundform des nächsten Verbs.",
    rules: [
      "can + Grundform: I can help.",
      "must + Grundform: You must leave.",
      "should + Grundform: We should call.",
      "Kein to und kein -s nach einem Modalverb.",
    ],
    tip: "Auch bei he und she bleibt das Modalverb unverändert: she can, he must.",
    examples: [
      { de: "Can you help me?", en: "Kannst du mir helfen?" },
      { de: "We should go now.", en: "Wir sollten jetzt gehen." },
    ],
  },
  {
    id: "simple_present",
    title: "Simple Present",
    level: "A1",
    summary: "Das Simple Present beschreibt Gewohnheiten, Fakten und regelmäßige Abläufe.",
    rules: [
      "I, you, we, they: Grundform, zum Beispiel I work.",
      "he, she, it: meist -s, zum Beispiel She works.",
      "Endungen auf -ch, -sh, -s, -x: -es, zum Beispiel He watches.",
      "Fragen und Verneinungen verwenden do oder does.",
    ],
    tip: "Das -s gehört nur in positiven Aussagen zu he, she und it.",
    examples: [
      { de: "She works from home.", en: "Sie arbeitet von zu Hause." },
      { de: "They play football on Sundays.", en: "Sie spielen sonntags Fußball." },
    ],
  },
  {
    id: "questions_do",
    title: "Fragen mit do und does",
    level: "A1",
    summary: "Bei den meisten Fragen im Simple Present steht do oder does vor dem Subjekt.",
    rules: [
      "Do you live here?",
      "Does she speak English?",
      "Nach does steht die Grundform: Does he work?",
      "Bei be brauchst du kein do: Are you ready?",
    ],
    tip: "Does trägt bereits das -s. Deshalb heißt es Does she like, nicht Does she likes.",
    examples: [
      { de: "Do you have a room free?", en: "Haben Sie ein Zimmer frei?" },
      { de: "Does he work here?", en: "Arbeitet er hier?" },
    ],
  },
  {
    id: "spoken_reductions",
    title: "Natürliches gesprochenes Englisch",
    level: "A1",
    summary: "Im Gespräch werden häufig Kurzformen verwendet. Sie sind normales Englisch und keine nachlässige Aussprache.",
    rules: [
      "I am → I'm, you are → you're, we are → we're",
      "do not → don't, does not → doesn't",
      "I will → I'll, we will → we'll",
      "want to und going to klingen oft wie wanna und gonna, werden aber standardmäßig ausgeschrieben.",
    ],
    tip: "Lerne die vollständige und die gesprochene Form zusammen. So erkennst du beide sofort.",
    examples: [
      { de: "I'm ready.", en: "Ich bin bereit." },
      { de: "I don't know.", en: "Ich weiß es nicht." },
      { de: "We'll see.", en: "Wir werden sehen." },
    ],
  },
  // Die Verneinungs-Karte oben deckt nur das Simple Present ab (don't, doesn't).
  // Im Alltag hört man aber vor allem didn't, can't, won't und shouldn't.
  // deshalb hier das ganze System auf einen Blick.
  {
    id: "negation_all",
    title: "Verneinung: didn't, can't, won't",
    level: "A2",
    summary: "Verneint wird immer am ersten Hilfsverb, nie am Hauptverb. Welches Hilfsverb du brauchst, hängt von der Zeit ab; das Hauptverb bleibt danach in der Grundform.",
    rules: [
      "Vergangenheit: did not → didn't. Danach die GRUNDFORM: I didn't go, nicht I didn't went.",
      "können: Die normale Verneinung lautet cannot → can't. Getrenntes can not kommt nur in besonderen Kontrasten vor.",
      "Zukunft: will not → won't. Die Form ist unregelmäßig geschrieben, nicht willn't.",
      "Rat: should not → shouldn't. Ebenso wouldn't, couldn't, mustn't.",
      "be in der Vergangenheit: was not → wasn't, were not → weren't.",
      "Perfekt: have not → haven't, has not → hasn't. I haven't seen it.",
      "Im Standardenglisch: I didn't see anything, nicht I didn't see nothing. Manche Dialekte verwenden bewusst doppelte Verneinung.",
    ],
    tip: "Merke dir die Grundregel: Sobald ein Hilfsverb da ist (did, can, will, should, have), hängt das n't daran und das Hauptverb bleibt unverändert.",
    examples: [
      { de: "I didn't see her yesterday.", en: "Ich habe sie gestern nicht gesehen." },
      { de: "I can't come tomorrow.", en: "Ich kann morgen nicht kommen." },
      { de: "He won't be there.", en: "Er wird nicht da sein." },
      { de: "You shouldn't worry.", en: "Du solltest dir keine Sorgen machen." },
    ],
  },
  {
    id: "there_is_are",
    title: "there is und there are",
    level: "A1",
    summary: "Für „es gibt“ sagt man im Englischen there is oder there are, je nach der Zahl dessen, was folgt. Wichtig: Es heißt nie „it gives“.",
    rules: [
      "Einzahl: there is a problem. Kurzform im Gespräch: there's.",
      "Mehrzahl: there are two rooms. Die Kurzform there're ist selten; sprich es aus.",
      "Nicht zählbar behandelt man wie Einzahl: there is milk in the fridge.",
      "Vergangenheit: there was a party. / There were many people.",
      "Verneint: there isn't any bread. / There aren't any seats.",
      "Frage: Is there a bank near here? / Are there any questions?",
      "Das there ist nur ein Platzhalter, kein Ort. „Dort ist es“ heißt it is there.",
    ],
    tip: "Deutsches „es gibt“ ist immer gleich, Englisch nicht: entscheide zuerst, ob das, was danach kommt, Einzahl oder Mehrzahl ist.",
    examples: [
      { de: "There is a supermarket on the corner.", en: "An der Ecke gibt es einen Supermarkt." },
      { de: "There are a lot of people here.", en: "Hier sind viele Leute." },
      { de: "There wasn't any coffee left.", en: "Es war kein Kaffee mehr da." },
    ],
  },
  {
    id: "pronouns_possessives",
    title: "Pronomen und Besitz",
    level: "A1",
    summary: "Englische Pronomen ändern ihre Form je nachdem, ob sie handeln, nach dem Verb stehen oder Besitz zeigen.",
    rules: [
      "Subjekt: I, you, he, she, it, we, they.",
      "Nach Verb oder Präposition: me, you, him, her, it, us, them.",
      "Vor einem Nomen: my, your, his, her, its, our, their.",
      "Ohne folgendes Nomen: mine, yours, his, hers, ours, theirs.",
      "its = sein/ihr bei Dingen; it's = it is oder it has.",
    ],
    tip: "Frage dich: Wer handelt? Wen betrifft es? Oder wem gehört etwas? Dann wählst du die passende Reihe.",
    examples: [
      { de: "She called me yesterday.", en: "Sie hat mich gestern angerufen." },
      { de: "Is this your coat or mine?", en: "Ist das deine Jacke oder meine?" },
      { de: "The dog is eating its food.", en: "Der Hund frisst sein Futter." },
    ],
  },
  {
    id: "present_continuous",
    title: "Simple Present oder gerade jetzt?",
    level: "A2",
    summary: "Das Simple Present beschreibt Gewohnheiten und Fakten. be + -ing zeigt meistens, was gerade läuft oder nur vorübergehend gilt.",
    rules: [
      "Gewohnheit: I work from home on Fridays.",
      "Gerade jetzt: I'm working from home today.",
      "Vorübergehend: She's staying with friends this week.",
      "Frage: Are you working? Verneinung: I'm not working.",
      "Verben wie know, want, need und believe stehen normalerweise nicht in der -ing-Form.",
    ],
    tip: "Suche nach dem Zeitgefühl: usually/every day → Simple Present; now/at the moment/this week → oft be + -ing.",
    examples: [
      { de: "I usually cook, but I'm ordering food tonight.", en: "Normalerweise koche ich, aber heute Abend bestelle ich Essen." },
      { de: "What are you doing?", en: "Was machst du gerade?" },
      { de: "I don't understand.", en: "Ich verstehe es nicht." },
    ],
  },
  {
    id: "past_simple",
    title: "Simple Past: abgeschlossene Vergangenheit",
    level: "A2",
    summary: "Das Simple Past beschreibt abgeschlossene Ereignisse in einer vergangenen Zeit, zum Beispiel yesterday, last week oder in 2024.",
    rules: [
      "Regelmäßig: work → worked, call → called.",
      "Unregelmäßig: go → went, see → saw, buy → bought.",
      "Frage: Did you call? Danach Grundform, nicht did you called.",
      "Verneinung: I didn't call. Danach ebenfalls die Grundform.",
      "be: I/he/she was; you/we/they were.",
    ],
    tip: "Lerne unregelmäßige Verben in einem Satz: I went home, I saw her, I bought it.",
    examples: [
      { de: "I saw her yesterday.", en: "Ich habe sie gestern gesehen." },
      { de: "Did you get my message?", en: "Hast du meine Nachricht bekommen?" },
      { de: "We didn't stay long.", en: "Wir sind nicht lange geblieben." },
    ],
  },
  {
    id: "future_forms",
    title: "Zukunft: will, going to und feste Pläne",
    level: "A2",
    summary: "Englisch hat mehrere natürliche Zukunftsformen. Die Wahl zeigt, ob du spontan entscheidest, schon einen Plan hast oder etwas fest vereinbart ist.",
    rules: [
      "Spontane Entscheidung oder Versprechen: I'll call her now. I'll help you.",
      "Absicht oder sichtbare Folge: I'm going to apply. Look at those clouds; it's going to rain.",
      "Feste Vereinbarung: I'm meeting Anna at six.",
      "Zeitplan: The train leaves at 7:20.",
      "Nach when, if und as soon as steht für die Zukunft oft Present: I'll call when I arrive.",
    ],
    tip: "Nicht jedes deutsche werden ist will. Für einen verabredeten Termin klingt be + -ing oft natürlicher.",
    examples: [
      { de: "I'll text you later.", en: "Ich schreibe dir später." },
      { de: "We're having dinner with them tomorrow.", en: "Wir essen morgen mit ihnen zu Abend." },
      { de: "It's going to be difficult.", en: "Das wird schwierig." },
    ],
  },
  {
    id: "countable_uncountable",
    title: "Zählbar, nicht zählbar, some und any",
    level: "A2",
    summary: "Englisch behandelt Wörter wie information, advice, furniture und luggage als nicht zählbar. Das beeinflusst Artikel, Mehrzahl und Mengenwörter.",
    rules: [
      "Zählbar: a chair, two chairs, many chairs, a few chairs.",
      "Nicht zählbar: information, advice, furniture, luggage, money; kein a und normalerweise kein Plural-s.",
      "Positiv oft some: I need some information.",
      "Frage/Verneinung oft any: Do you have any questions? I don't have any cash.",
      "Mengen: much time, many people, a lot of time/people; a little time, a few people.",
    ],
    tip: "Sag a piece of advice / some advice, nicht an advice oder advices.",
    examples: [
      { de: "Could you give me some advice?", en: "Könntest du mir einen Rat geben?" },
      { de: "We don't have much time.", en: "Wir haben nicht viel Zeit." },
      { de: "There are a few seats left.", en: "Es sind noch ein paar Plätze frei." },
    ],
  },
  {
    id: "comparisons_en",
    title: "Vergleiche auf Englisch",
    level: "A2",
    summary: "Kurze Adjektive verwenden meist -er/-est, längere meist more/most. Gleichheit drückst du mit as ... as aus.",
    rules: [
      "Kurz: cheap → cheaper → the cheapest.",
      "Länger: more useful → the most useful.",
      "Gleich: It's as good as the other one.",
      "Weniger: less expensive; the least expensive.",
      "Unregelmäßig: good → better → best; bad → worse → worst; far → farther/further.",
    ],
    tip: "Nicht doppeln: cheaper oder more expensive, aber nicht more cheaper.",
    examples: [
      { de: "This one is cheaper than that one.", en: "Dieses hier ist günstiger als das dort." },
      { de: "It's not as far as I thought.", en: "Es ist nicht so weit, wie ich dachte." },
      { de: "That's the best option.", en: "Das ist die beste Möglichkeit." },
    ],
  },
  {
    id: "prepositions_time_place",
    title: "Zeit und Ort: at, on und in",
    level: "A2",
    summary: "at, on und in folgen bei Zeit und Ort unterschiedlichen, aber gut lernbaren Mustern.",
    rules: [
      "Zeitpunkt: at six, at night, at the weekend (UK).",
      "Tag/Datum: on Monday, on 12 May, on my birthday.",
      "Längerer Zeitraum: in July, in 2026, in the morning.",
      "Ort: at the station (Punkt), on the table (Fläche), in the room (Innenraum).",
      "Kein on/in vor last, next, this und every: next week, last Monday.",
    ],
    tip: "Lerne typische Blöcke statt eine deutsche Präposition zu übersetzen: at home, on the bus, in a car.",
    examples: [
      { de: "I'll see you at six on Friday.", en: "Ich sehe dich am Freitag um sechs." },
      { de: "She's on the train.", en: "Sie ist im Zug." },
      { de: "We moved here in 2024.", en: "Wir sind 2024 hierhergezogen." },
    ],
  },
  {
    id: "present_perfect",
    title: "Present Perfect: Vergangenheit mit Bezug zu jetzt",
    level: "A2",
    summary: "have/has + past participle verbindet ein früheres Ereignis mit der Gegenwart: Erfahrung, Ergebnis oder ein noch laufender Zeitraum.",
    rules: [
      "Erfahrung ohne fertige Zeit: I've been to Berlin twice.",
      "Ergebnis jetzt: I've lost my keys.",
      "Noch laufender Zeitraum: I've lived here for three years / since 2023.",
      "just, already und yet stehen häufig mit dem Present Perfect, besonders im britischen Englisch.",
      "Keine fertige Vergangenheit dazu: I saw her yesterday, nicht I've seen her yesterday.",
    ],
    tip: "Wenn du yesterday, last week oder in 2020 nennst, brauchst du normalerweise Simple Past.",
    examples: [
      { de: "I've just finished.", en: "Ich bin gerade fertig geworden." },
      { de: "Have you ever tried it?", en: "Hast du das schon einmal probiert?" },
      { de: "We haven't decided yet.", en: "Wir haben uns noch nicht entschieden." },
    ],
  },
  {
    id: "present_perfect_vs_past",
    title: "Present Perfect oder Simple Past?",
    level: "B1",
    summary: "Simple Past gehört zu einer abgeschlossenen vergangenen Zeit. Present Perfect bleibt mit jetzt verbunden oder nennt keinen fertigen Zeitpunkt.",
    rules: [
      "Fertige Zeit: I spoke to her yesterday.",
      "Zeit offen oder nicht genannt: I've spoken to her, so she knows.",
      "Lebenszeit bis jetzt: Have you ever been to Scotland?",
      "Eine verstorbene Person oder abgeschlossene Phase: Shakespeare wrote plays; I lived there as a child.",
      "US-Englisch verwendet Simple Past bei just/already/yet häufiger als britisches Englisch; beide Varianten können natürlich sein.",
    ],
    tip: "Entscheide nicht nach der deutschen Zeitform, sondern danach, ob die englische Zeitspanne abgeschlossen ist.",
    examples: [
      { de: "I've seen that film, but I don't remember the ending.", en: "Ich habe den Film gesehen, erinnere mich aber nicht an das Ende." },
      { de: "I saw it last Friday.", en: "Ich habe ihn letzten Freitag gesehen." },
      { de: "Did you eat yet? / Have you eaten yet?", en: "Hast du schon gegessen? (US / UK-typisch)" },
    ],
  },
  {
    id: "first_conditional",
    title: "Reale Bedingungen: if und when",
    level: "B1",
    summary: "Für eine echte oder gut mögliche Zukunft steht nach if/when meist Present, im anderen Satzteil will, can, may oder ein Imperativ.",
    rules: [
      "If + Present, will: If it rains, we'll stay home.",
      "Möglichkeit: If you're free, we can meet later.",
      "Aufforderung: If you see Anna, tell her to call me.",
      "when erwartet das Ereignis; if lässt offen, ob es passiert.",
      "Kein will direkt nach normalem if: If I have time, nicht If I will have time.",
    ],
    tip: "Das Komma ist üblich, wenn der if-Satz zuerst steht; steht er hinten, brauchst du meist keins.",
    examples: [
      { de: "If you're tired, we can go home.", en: "Wenn du müde bist, können wir nach Hause gehen." },
      { de: "I'll text you when I arrive.", en: "Ich schreibe dir, wenn ich ankomme." },
      { de: "If she calls, let me know.", en: "Falls sie anruft, sag mir Bescheid." },
    ],
  },
  {
    id: "second_conditional",
    title: "Unwirkliche Gegenwart: If I were ...",
    level: "B1",
    summary: "Für erfundene, unwahrscheinliche oder nicht aktuelle Situationen verwendet Englisch if + past und would/could + Grundform.",
    rules: [
      "If I had more time, I would travel more.",
      "Das past zeigt hier Abstand zur Realität, nicht zwingend Vergangenheit.",
      "could/might sind möglich: If we left now, we could catch the train.",
      "In formellem Standardenglisch: If I were you. Was hört man ebenfalls, besonders informell.",
      "Kein would im normalen if-Satz: If I knew, I would tell you.",
    ],
    tip: "Die nützlichste feste Wendung ist If I were you, I'd ....",
    examples: [
      { de: "If I were you, I'd wait.", en: "An deiner Stelle würde ich warten." },
      { de: "What would you do?", en: "Was würdest du tun?" },
      { de: "If we lived closer, we'd see each other more often.", en: "Wenn wir näher beieinander wohnen würden, würden wir uns öfter sehen." },
    ],
  },
  {
    id: "relative_clauses_en",
    title: "who, which, that und Zusatzinformationen",
    level: "B1",
    summary: "Relative clauses verbinden Informationen über Menschen und Dinge, ohne einen neuen Satz beginnen zu müssen.",
    rules: [
      "Menschen: the woman who called; Dinge: the phone which broke.",
      "that kann in notwendigen Informationen who/which ersetzen: the book that I bought.",
      "Als Objekt kann das Wort entfallen: the book (that) I bought.",
      "Zusatzinformation steht zwischen Kommas und verwendet nicht that: My brother, who lives in Leeds, is visiting.",
      "whose zeigt Besitz: the person whose bag was missing.",
    ],
    tip: "Frage: Brauche ich die Information, um die Person/Sache zu identifizieren? Wenn nein, setze Kommas.",
    examples: [
      { de: "That's the person who helped me.", en: "Das ist die Person, die mir geholfen hat." },
      { de: "The film we watched was brilliant.", en: "Der Film, den wir gesehen haben, war großartig." },
      { de: "My car, which is ten years old, still runs well.", en: "Mein Auto, das zehn Jahre alt ist, läuft noch gut." },
    ],
  },
  {
    id: "passive_en",
    title: "Passiv: Was geschieht?",
    level: "B1",
    summary: "be + past participle rückt das Ergebnis oder Geschehen in den Mittelpunkt, wenn die handelnde Person unbekannt, offensichtlich oder unwichtig ist.",
    rules: [
      "Present: The shop is closed at six.",
      "Past: My bike was stolen last night.",
      "Present Perfect: The problem has been fixed.",
      "Modal: It must be done today.",
      "Die handelnde Person kann mit by folgen: It was written by George Orwell.",
    ],
    tip: "Wenn wichtig ist, wer etwas tut, klingt Aktiv meist klarer. Passiv passt gut zu Abläufen, Regeln und unbekannten Tätern.",
    examples: [
      { de: "The meeting has been cancelled.", en: "Das Treffen wurde abgesagt." },
      { de: "English is spoken here.", en: "Hier wird Englisch gesprochen." },
      { de: "I was told to wait.", en: "Mir wurde gesagt, ich solle warten." },
    ],
  },
  {
    id: "gerund_infinitive",
    title: "-ing oder to + Verb?",
    level: "B1",
    summary: "Nach manchen Verben folgt -ing, nach anderen to + Grundform. Einige erlauben beides, manchmal mit Bedeutungsunterschied.",
    rules: [
      "-ing nach enjoy, avoid, finish, mind, suggest: I enjoy cooking.",
      "to + Verb nach want, need, decide, hope, promise: We decided to leave.",
      "Nach Präposition immer -ing: I'm interested in learning. Thanks for helping.",
      "like/love/hate erlauben oft beides: I like reading / I like to read before bed.",
      "remember doing = Erinnerung an früher; remember to do = nicht vergessen, es zu tun.",
    ],
    tip: "Lerne das zweite Verb gleich mit: enjoy doing, decide to do, interested in doing.",
    examples: [
      { de: "Would you mind waiting?", en: "Würdest du bitte warten?" },
      { de: "I forgot to call her.", en: "Ich habe vergessen, sie anzurufen." },
      { de: "He suggested going by train.", en: "Er schlug vor, mit dem Zug zu fahren." },
    ],
  },
  {
    id: "phrasal_verbs",
    title: "Phrasal verbs und ihre Wortstellung",
    level: "B1",
    summary: "Viele häufige englische Verben bestehen aus Verb + kleinem Wort. Die Gesamtbedeutung und die Position eines Objekts musst du zusammen lernen.",
    rules: [
      "Untrennbar: look after someone, run into someone, deal with something.",
      "Trennbar: turn the light off / turn off the light.",
      "Pronomen bei trennbaren Verben immer in der Mitte: turn it off, pick me up.",
      "Manche haben mehrere Bedeutungen: work out = trainieren, ausrechnen oder gut ausgehen.",
      "Register beachten: put off ist alltäglich; postpone ist neutraler/formeller.",
    ],
    tip: "Speichere ein Phrasal Verb mit einem echten Objekt: pick someone up, look it up, put the meeting off.",
    examples: [
      { de: "Can you pick me up at eight?", en: "Kannst du mich um acht abholen?" },
      { de: "I'll look it up.", en: "Ich schlage es nach." },
      { de: "They've put the meeting off.", en: "Sie haben das Treffen verschoben." },
    ],
  },
  {
    id: "used_to",
    title: "Frühere Gewohnheiten mit used to",
    level: "B1",
    summary: "used to + Grundform beschreibt einen früheren Zustand oder eine frühere Gewohnheit, die heute nicht mehr gilt.",
    rules: [
      "Positiv: I used to live in Bristol.",
      "Frage: Did you use to work here? Nach did steht use ohne d.",
      "Verneinung: I didn't use to like coffee.",
      "would kann wiederholte frühere Handlungen beschreiben, aber normalerweise keine Zustände: Every summer, we'd camp by the sea.",
      "be used to + -ing bedeutet gewohnt sein: I'm used to getting up early.",
    ],
    tip: "Trenne diese drei: used to do = früher; be used to doing = gewohnt sein; get used to doing = sich daran gewöhnen.",
    examples: [
      { de: "I used to be shy.", en: "Früher war ich schüchtern." },
      { de: "I'm used to working late.", en: "Ich bin es gewohnt, lange zu arbeiten." },
      { de: "You'll get used to it.", en: "Du wirst dich daran gewöhnen." },
    ],
  },
  {
    id: "question_tags",
    title: "Kurze Rückfragen: isn't it?, don't you?",
    level: "B1",
    summary: "Question tags laden zur Bestätigung ein. Ein positiver Satz bekommt meist eine negative Rückfrage und umgekehrt.",
    rules: [
      "You're ready, aren't you?",
      "She doesn't live here, does she?",
      "Verwende das Hilfsverb des Satzes: They've left, haven't they? He can drive, can't he?",
      "Ohne Hilfsverb brauchst du do/does/did: You work here, don't you?",
      "Die Stimme kann echte Unsicherheit (steigend) oder erwartete Zustimmung (fallend) zeigen.",
    ],
    tip: "Im Gespräch sind kurze neutrale Rückfragen wie right? oder yeah? ebenfalls häufig, aber question tags bleiben wichtig.",
    examples: [
      { de: "It's cold today, isn't it?", en: "Heute ist es kalt, oder?" },
      { de: "You haven't seen it, have you?", en: "Du hast es nicht gesehen, oder?" },
      { de: "We can leave now, can't we?", en: "Wir können jetzt gehen, oder?" },
    ],
  },
  {
    id: "past_perfect",
    title: "Past Perfect: Was war schon vorher passiert?",
    level: "B1",
    summary: "had + past participle zeigt, dass ein Ereignis vor einem anderen vergangenen Zeitpunkt bereits passiert war.",
    rules: [
      "Earlier past: When I arrived, they had already left.",
      "Die spätere Handlung steht oft im Simple Past.",
      "Verneinung: I hadn't seen the message.",
      "Frage: Had you met before?",
      "Wenn die Reihenfolge durch before/after völlig klar ist, reicht manchmal Simple Past; Past Perfect betont die Reihenfolge.",
    ],
    tip: "Stelle zwei vergangene Punkte auf eine Linie. Nur der frühere braucht had + past participle.",
    examples: [
      { de: "She had gone home before I called.", en: "Sie war nach Hause gegangen, bevor ich anrief." },
      { de: "I'd never seen snow before.", en: "Ich hatte vorher noch nie Schnee gesehen." },
      { de: "Had they already eaten?", en: "Hatten sie schon gegessen?" },
    ],
  },
  {
    id: "reported_speech_en",
    title: "Wiedergeben, was jemand gesagt hat",
    level: "B2",
    summary: "Reported speech gibt Aussagen sinngemäß wieder. Nach einem Verb in der Vergangenheit verschieben sich Zeitformen oft zurück, wenn die Aussage nicht mehr direkt zitiert wird.",
    rules: [
      "Direct: 'I'm tired.' → She said (that) she was tired.",
      "Present → past; will → would; can → could; have done → had done.",
      "Wenn die Aussage weiterhin wahr oder aktuell ist, bleibt die ursprüngliche Zeitform oft möglich: She said she lives in Leeds.",
      "say ohne Person; tell mit Person: She said that ... / She told me that ....",
      "Frage: He asked where I lived. Keine Fragewortstellung und kein do.",
    ],
    tip: "Backshift ist ein Muster, kein blinder Zwang. Entscheidend ist, ob du die Aussage als vergangen oder weiterhin aktuell darstellst.",
    examples: [
      { de: "He told me he couldn't come.", en: "Er sagte mir, dass er nicht kommen könne." },
      { de: "She asked whether I was free.", en: "Sie fragte, ob ich Zeit hätte." },
      { de: "They said the train had been cancelled.", en: "Sie sagten, der Zug sei ausgefallen." },
    ],
  },
  {
    id: "third_conditional",
    title: "Unwirkliche Vergangenheit: If I had known ...",
    level: "B2",
    summary: "Für eine Vergangenheit, die anders hätte verlaufen können, verwendet Englisch if + Past Perfect und would/could/might have + past participle.",
    rules: [
      "If I had known, I would have called.",
      "Missed possibility: We could have caught the train if we'd left earlier.",
      "Unsicheres Ergebnis: She might have come if you'd invited her.",
      "Kein would im normalen if-Satz: if I had known, nicht if I would have known.",
      "Kurzformen: I'd kann I had oder I would bedeuten; das folgende Verb zeigt welches.",
    ],
    tip: "Baue beide Hälften als feste Paare: if + had done / would have done.",
    examples: [
      { de: "If you'd told me, I would have helped.", en: "Wenn du es mir gesagt hättest, hätte ich geholfen." },
      { de: "We wouldn't have missed it if we'd left on time.", en: "Wir hätten es nicht verpasst, wenn wir pünktlich losgefahren wären." },
      { de: "What would you have done?", en: "Was hättest du getan?" },
    ],
  },
  {
    id: "modal_deduction",
    title: "Vermutungen mit must, might und can't",
    level: "B2",
    summary: "Modalverben zeigen, wie sicher du dir bei einer Vermutung bist. Hier bedeutet must logische Gewissheit, nicht Pflicht.",
    rules: [
      "Sehr wahrscheinlich: She must be tired.",
      "Möglich: He might/may/could be at home.",
      "Sehr unwahrscheinlich: That can't be right.",
      "Vergangenheit: She must have forgotten. He might have missed the bus.",
      "Für negative Vermutung nicht mustn't: He can't be at work, nicht He mustn't be at work.",
    ],
    tip: "mustn't bedeutet Verbot. can't bedeutet bei einer Vermutung 'das kann nicht sein'.",
    examples: [
      { de: "You must be exhausted.", en: "Du musst völlig erschöpft sein." },
      { de: "She might have gone home.", en: "Vielleicht ist sie nach Hause gegangen." },
      { de: "That can't have been easy.", en: "Das kann nicht leicht gewesen sein." },
    ],
  },
  {
    id: "wish_if_only",
    title: "Wünsche und Bedauern mit wish",
    level: "B2",
    summary: "wish und if only verwenden eine zurückgesetzte Zeitform, um Abstand zur Wirklichkeit zu zeigen.",
    rules: [
      "Gegenwart anders gewünscht: I wish I had more time.",
      "Vergangenheit bedauern: I wish I hadn't said that.",
      "Veränderung wünschen oder sich beschweren: I wish he would stop shouting.",
      "Fähigkeit: I wish I could help.",
      "if only ist stärker/emotionaler: If only I'd listened.",
    ],
    tip: "Nach wish zeigt past nicht immer Vergangenheit; oft zeigt es nur: Die Wirklichkeit ist leider anders.",
    examples: [
      { de: "I wish you were here.", en: "Ich wünschte, du wärst hier." },
      { de: "I wish I'd known earlier.", en: "Ich wünschte, ich hätte es früher gewusst." },
      { de: "If only it would stop raining.", en: "Wenn es doch nur aufhören würde zu regnen." },
    ],
  },
  {
    id: "perfect_continuous",
    title: "Wie lange läuft es schon?",
    level: "B2",
    summary: "have/has been + -ing betont Dauer oder eine wiederholte Aktivität, die bis jetzt reicht oder gerade sichtbare Folgen hat.",
    rules: [
      "Dauer bis jetzt: I've been waiting for an hour.",
      "Sichtbare Folge: You're wet. Have you been walking in the rain?",
      "Aktivität betonen: I've been reading the report. Ergebnis betonen: I've read the report.",
      "Zustandsverben stehen meist nicht continuous: I've known her for years.",
      "Vergangene Dauer vor einem Zeitpunkt: I'd been waiting for an hour when she arrived.",
    ],
    tip: "Continuous beantwortet oft 'Wie lange/was lief?', die einfache Perfect-Form eher 'Was ist erledigt/wie oft?'.",
    examples: [
      { de: "I've been trying to call you.", en: "Ich versuche schon die ganze Zeit, dich anzurufen." },
      { de: "How long have you been working here?", en: "Wie lange arbeitest du schon hier?" },
      { de: "She's written three emails this morning.", en: "Sie hat heute Morgen drei E-Mails geschrieben." },
    ],
  },
  {
    id: "natural_emphasis",
    title: "Natürliche Betonung und Fokus",
    level: "B2",
    summary: "Englisch verschiebt wichtige Informationen oft mit it is/was, what oder do. Diese Muster klingen im Gespräch natürlicher als jedes Wort lauter zu sagen.",
    rules: [
      "Korrektur/Fokus: It was Anna who told me, not Paul.",
      "Wichtigster Punkt: What I need is a break.",
      "Nachdrückliche positive Aussage: I do understand. She did call me.",
      "Fronting in normaler Rede: The funny thing is, nobody noticed.",
      "Übertreibe diese Formen nicht; einfache Wortbetonung reicht oft.",
    ],
    tip: "Nutze Fokusmuster, wenn du einen Kontrast wirklich klären willst, nicht um jeden Satz komplizierter zu machen.",
    examples: [
      { de: "What I mean is, we need more time.", en: "Was ich meine, ist: Wir brauchen mehr Zeit." },
      { de: "I do want to help.", en: "Ich will wirklich helfen." },
      { de: "It was yesterday that she called.", en: "Sie hat gestern angerufen, nicht heute." },
    ],
  },
  {
    id: "mixed_conditionals",
    title: "Gemischte Bedingungen über Vergangenheit und Gegenwart",
    level: "C1",
    summary: "Mixed conditionals verbinden eine nicht reale Vergangenheit mit einer Folge heute oder einen heutigen Zustand mit einer früheren Folge.",
    rules: [
      "Vergangene Ursache, heutige Folge: If I'd taken that job, I'd be living in London now.",
      "Heutiger Zustand, vergangene Folge: If I were more organised, I wouldn't have missed the deadline.",
      "Die Zeitform folgt der echten Zeit jeder Satzhälfte, nicht einem starren Namen des conditional.",
      "could oder might können would ersetzen, wenn Fähigkeit oder Unsicherheit gemeint ist.",
      "Im if-Satz steht normalerweise kein would: If I'd known, nicht If I would have known.",
    ],
    tip: "Zeichne zuerst zwei Zeitpunkte: Wann liegt die Bedingung, wann die Folge? Dann baust du jede Hälfte passend.",
    examples: [
      { de: "If I'd listened to you, I wouldn't be in this mess now.", en: "Wenn ich auf dich gehört hätte, wäre ich jetzt nicht in diesem Schlamassel." },
      { de: "If she spoke German, she could have applied for the job.", en: "Wenn sie Deutsch könnte, hätte sie sich auf die Stelle bewerben können." },
      { de: "We'd be there by now if we'd left earlier.", en: "Wir wären jetzt schon da, wenn wir früher losgefahren wären." },
    ],
  },
  {
    id: "inversion_emphasis",
    title: "Formelle Betonung mit umgestelltem Hilfsverb",
    level: "C1",
    summary: "Nach einigen negativen oder einschränkenden Ausdrücken kann Englisch Hilfsverb und Subjekt umstellen. Das klingt betont, formell oder dramatisch.",
    rules: [
      "Never have I seen anything like it.",
      "Rarely do we get an opportunity like this. Ohne Hilfsverb ergänzt du do/does/did.",
      "Not until Friday did they reply.",
      "Only then did I understand what she meant.",
      "In normaler Unterhaltung ist die neutrale Wortstellung oft natürlicher: I had never seen anything like it.",
    ],
    tip: "Lerne diese Form vor allem zum Verstehen. Verwende sie selbst nur, wenn die starke Betonung wirklich passt.",
    examples: [
      { de: "Never have I felt so relieved.", en: "Noch nie war ich so erleichtert." },
      { de: "Only later did I realise my mistake.", en: "Erst später bemerkte ich meinen Fehler." },
      { de: "Rarely does he complain.", en: "Er beschwert sich nur selten." },
    ],
  },
  {
    id: "participle_clauses",
    title: "Nebensätze vorsichtig verkürzen",
    level: "C1",
    summary: "Participle clauses kürzen Informationen über Zeit, Grund oder Begleitumstände. Sie passen eher zu sorgfältiger Rede und Schrift als zu jedem Alltagsgespräch.",
    rules: [
      "Gleichzeitige Handlung: Walking home, I called Anna.",
      "Frühere Handlung: Having finished the report, she went home.",
      "Passiv/Blickwinkel: Seen from here, the building looks tiny.",
      "Die versteckte handelnde Person muss zum Subjekt des Hauptsatzes passen.",
      "Wenn die Zuordnung unklar wird, ist ein vollständiger Satz mit when, because oder after besser.",
    ],
    tip: "Prüfe immer: Wer führt die verkürzte Handlung aus? Wenn die Antwort nicht das Hauptsatz-Subjekt ist, schreibe den Satz aus.",
    examples: [
      { de: "Having checked the address, I sent the parcel.", en: "Nachdem ich die Adresse geprüft hatte, schickte ich das Paket ab." },
      { de: "Feeling tired, she went home early.", en: "Weil sie müde war, ging sie früh nach Hause." },
      { de: "Built in 1890, the house needs a lot of work.", en: "Das 1890 gebaute Haus muss umfassend renoviert werden." },
    ],
  },
  {
    id: "hedging_diplomacy",
    title: "Vorsichtig und diplomatisch formulieren",
    level: "C1",
    summary: "Fortgeschrittenes Englisch zeigt oft bewusst, wie sicher, direkt oder offen eine Aussage gemeint ist.",
    rules: [
      "Unsicherheit: It seems that ..., It may be ..., I could be wrong, but ....",
      "Tendenz statt absolute Regel: People tend to ..., It is generally more common to ....",
      "Diplomatischer Widerspruch: I'm not sure I completely agree. I see your point, but ....",
      "Sanfte Bitte: I was wondering if you could help me.",
      "Begrenzung: That's not necessarily true. It works to some extent.",
    ],
    tip: "Hedging soll deine genaue Haltung zeigen, nicht jede Aussage schwach machen. Bei klaren Fakten darfst du direkt bleiben.",
    examples: [
      { de: "I may have misunderstood, but I thought we agreed on Friday.", en: "Vielleicht habe ich es falsch verstanden, aber ich dachte, wir hätten uns auf Freitag geeinigt." },
      { de: "I'm not entirely convinced that's the best option.", en: "Ich bin nicht völlig davon überzeugt, dass das die beste Möglichkeit ist." },
      { de: "I was wondering if we could talk later.", en: "Ich wollte fragen, ob wir später reden könnten." },
    ],
  },
  {
    id: "ellipsis_substitution",
    title: "Wiederholungen natürlich weglassen",
    level: "C2",
    summary: "Englisch lässt bereits klare Wörter oft weg oder ersetzt sie. Sichere Ellipse macht Gespräche flüssig, ohne Informationen zu verlieren.",
    rules: [
      "Übereinstimmung: I love it. So do I. / I don't. Neither do I.",
      "Hilfsverb ersetzt den Rest: I haven't seen it, but Anna has.",
      "one/ones ersetzt ein zählbares Nomen: the red one, the cheaper ones.",
      "do so ist eher formell; do it/that ist im Gespräch oft natürlicher.",
      "Nach Vergleichswörtern bleibt der Rest manchmal aus: She works harder than I do.",
    ],
    tip: "Lass nur weg, was der Hörer eindeutig ergänzen kann. Wiederhole das Nomen oder Verb, sobald zwei mögliche Bedeutungen entstehen.",
    examples: [
      { de: "I thought she'd call, but she didn't.", en: "Ich dachte, sie würde anrufen, aber sie tat es nicht." },
      { de: "These shoes are too small. Have you got bigger ones?", en: "Diese Schuhe sind zu klein. Haben Sie größere?" },
      { de: "I've finished, and so has Leon.", en: "Ich bin fertig, und Leon auch." },
    ],
  },
  {
    id: "register_precision_en",
    title: "Grammatik an Beziehung und Situation anpassen",
    level: "C2",
    summary: "Sehr gutes Englisch wählt nicht die komplizierteste Form, sondern die Form, die Nähe, Höflichkeit, Sicherheit und Absicht richtig vermittelt.",
    rules: [
      "Direkt: Send me the file. Neutral höflich: Could you send me the file, please?",
      "Vorsichtiger Rat: You might want to check that again.",
      "Zurückhaltende Anfrage: I don't suppose you could give me a hand?",
      "Negative Fragen können Erwartung zeigen: Didn't you get my message?",
      "Kurzformen klingen meist natürlicher im Gespräch; volle Formen können Kontrast, Nachdruck oder Förmlichkeit zeigen.",
    ],
    tip: "Achte auf die Wirkung beim Hörer. Ein kurzer klarer Satz kann auf C2-Niveau passender sein als eine auffällig komplizierte Konstruktion.",
    examples: [
      { de: "Would you mind keeping the noise down?", en: "Würden Sie bitte etwas leiser sein?" },
      { de: "You might want to back that up first.", en: "Du solltest das vielleicht vorher sichern." },
      { de: "I don't suppose you've got a charger, have you?", en: "Du hast nicht zufällig ein Ladegerät, oder?" },
    ],
  },
];

export const ENGLISH_CLOZE_EXERCISES: ClozeExercise[] = [
  { id: "en1", sentence: "I need ___ room.", answer: "a", hint: "Unbestimmter Artikel vor einem Konsonantenlaut", tip_id: "articles" },
  { id: "en2", sentence: "She has ___ idea.", answer: "an", hint: "Unbestimmter Artikel vor einem Vokallaut", tip_id: "articles" },
  { id: "en3", sentence: "___ room is ready.", answer: "The", hint: "Bestimmter Artikel", tip_id: "articles" },
  { id: "en4", sentence: "I ___ tired.", answer: "am", hint: "be mit I", tip_id: "be_have" },
  { id: "en5", sentence: "She ___ time.", answer: "has", hint: "have mit she", tip_id: "be_have" },
  { id: "en6", sentence: "We ___ English every day.", answer: "practise", hint: "üben, Simple Present mit we", tip_id: "verb_position" },
  { id: "en7", sentence: "He ___ from home.", answer: "works", hint: "arbeiten, Simple Present mit he", tip_id: "simple_present" },
  { id: "en8", sentence: "I ___ understand.", answer: "don't", hint: "Verneinung im Simple Present", tip_id: "negation" },
  { id: "en9", sentence: "She ___ live here.", answer: "doesn't", hint: "Verneinung mit she", tip_id: "negation" },
  { id: "en10", sentence: "Can you ___ me?", answer: "help", hint: "helfen, Grundform nach can", tip_id: "modal_verbs" },
  { id: "en11", sentence: "We should ___ now.", answer: "go", hint: "gehen, Grundform nach should", tip_id: "modal_verbs" },
  { id: "en12", sentence: "___ you have a room free?", answer: "Do", hint: "Frage mit you", tip_id: "questions_do" },
  { id: "en13", sentence: "___ she work here?", answer: "Does", hint: "Frage mit she", tip_id: "questions_do" },
  { id: "en14", sentence: "I ___ ready.", answer: "am", hint: "be mit I", tip_id: "be_have" },
  { id: "en15", sentence: "They ___ football on Sundays.", answer: "play", hint: "spielen, Simple Present mit they", tip_id: "simple_present" },
  { id: "en16", sentence: "He ___ not at home.", answer: "is", hint: "Verneinung mit be", tip_id: "negation" },
  // Verneinung außerhalb des Simple Present, und there is/are.
  { id: "en17", sentence: "I ___ go to work yesterday.", answer: "didn't", hint: "Verneinung in der Vergangenheit", tip_id: "negation_all" },
  { id: "en18", sentence: "She ___ come to the party last night.", answer: "didn't", hint: "did not + Grundform", tip_id: "negation_all" },
  { id: "en19", sentence: "I ___ help you today, sorry.", answer: "can't", hint: "cannot als Kurzform", tip_id: "negation_all" },
  { id: "en20", sentence: "He ___ be home before eight.", answer: "won't", hint: "will not als Kurzform", tip_id: "negation_all" },
  { id: "en21", sentence: "You ___ worry about it.", answer: "shouldn't", hint: "should not als Kurzform", tip_id: "negation_all" },
  { id: "en22", sentence: "I ___ seen that film yet.", answer: "haven't", hint: "have not im Perfekt", tip_id: "negation_all" },
  { id: "en23", sentence: "We ___ at home when you called.", answer: "weren't", hint: "were not als Kurzform", tip_id: "negation_all" },
  { id: "en24", sentence: "___ is a problem with my room.", answer: "There", hint: "es gibt, Einzahl", tip_id: "there_is_are" },
  { id: "en25", sentence: "There ___ two beds in the room.", answer: "are", hint: "es gibt, Mehrzahl", tip_id: "there_is_are" },
  { id: "en26", sentence: "There ___ a lot of people at the station.", answer: "were", hint: "es gab, Mehrzahl in der Vergangenheit", tip_id: "there_is_are" },
  { id: "en27", sentence: "___ there a bank near here?", answer: "Is", hint: "Frage mit there is", tip_id: "there_is_are" },
  { id: "en28", sentence: "I ___ know.", answer: "don't", hint: "Normale Kurzform im Gespräch", tip_id: "spoken_reductions" },
  { id: "en29", sentence: "She called ___ yesterday.", answer: "me", hint: "Objektform von I", tip_id: "pronouns_possessives" },
  { id: "en30", sentence: "What are you ___?", answer: "doing", hint: "machen, be + -ing für gerade jetzt", tip_id: "present_continuous" },
  { id: "en31", sentence: "We didn't ___ long.", answer: "stay", hint: "bleiben, Grundform nach didn't", tip_id: "past_simple" },
  { id: "en32", sentence: "I'll call when I ___.", answer: "arrive", hint: "ankommen, Present nach when mit Zukunftsbedeutung", tip_id: "future_forms" },
  { id: "en33", sentence: "Could you give me some ___?", answer: "advice", hint: "der Rat, nicht zählbares Nomen ohne Plural-s", tip_id: "countable_uncountable" },
  { id: "en34", sentence: "This one is cheaper ___ that one.", answer: "than", hint: "Vergleich nach cheaper", tip_id: "comparisons_en" },
  { id: "en35", sentence: "I'll see you ___ Friday.", answer: "on", hint: "Präposition vor einem Tag", tip_id: "prepositions_time_place" },
  { id: "en36", sentence: "I've just ___.", answer: "finished", hint: "fertig werden, past participle nach have", tip_id: "present_perfect" },
  { id: "en37", sentence: "I ___ her yesterday.", answer: "saw", hint: "sehen, fertiger vergangener Zeitpunkt", tip_id: "present_perfect_vs_past" },
  { id: "en38", sentence: "If it rains, we ___ stay home.", answer: "will", hint: "Present nach if, will in der Folge", tip_id: "first_conditional" },
  { id: "en39", sentence: "If I ___ you, I'd wait.", answer: "were", hint: "Feste Form für einen unwirklichen Rat", tip_id: "second_conditional" },
  { id: "en40", sentence: "That's the person ___ helped me.", answer: "who", hint: "Relativwort für eine Person als Subjekt", tip_id: "relative_clauses_en" },
  { id: "en41", sentence: "The meeting has been ___.", answer: "cancelled", hint: "absagen, past participle im Passiv", tip_id: "passive_en" },
  { id: "en42", sentence: "Would you mind ___?", answer: "waiting", hint: "warten, -ing nach mind", tip_id: "gerund_infinitive" },
  { id: "en43", sentence: "Please turn it ___.", answer: "off", hint: "ausschalten, Pronomen in der Mitte eines trennbaren phrasal verb", tip_id: "phrasal_verbs" },
  { id: "en44", sentence: "I ___ to live in Bristol.", answer: "used", hint: "Früherer Zustand, der heute nicht mehr gilt", tip_id: "used_to" },
  { id: "en45", sentence: "You're ready, ___ you?", answer: "aren't", hint: "Negative Rückfrage nach positiver Aussage", tip_id: "question_tags" },
  { id: "en46", sentence: "They had already ___.", answer: "left", hint: "weggehen, past participle nach had", tip_id: "past_perfect" },
  { id: "en47", sentence: "She said she ___ tired.", answer: "was", hint: "Zurückgesetzte Zeitform nach said", tip_id: "reported_speech_en" },
  { id: "en48", sentence: "If I had known, I would have ___.", answer: "called", hint: "anrufen, past participle nach would have", tip_id: "third_conditional" },
  { id: "en49", sentence: "That ___ be right.", answer: "can't", hint: "Starke negative Vermutung", tip_id: "modal_deduction" },
  { id: "en50", sentence: "I wish I ___ more time.", answer: "had", hint: "Unwirklicher Wunsch über die Gegenwart", tip_id: "wish_if_only" },
  { id: "en51", sentence: "I've been ___ for an hour.", answer: "waiting", hint: "warten, have been + -ing für Dauer", tip_id: "perfect_continuous" },
  { id: "en52", sentence: "I ___ want to help.", answer: "do", hint: "Hilfsverb für nachdrückliche positive Aussage", tip_id: "natural_emphasis" },
  { id: "en53", sentence: "If I'd listened, I wouldn't ___ in this mess now.", answer: "be", hint: "Heutige Folge einer nicht realen Vergangenheit", tip_id: "mixed_conditionals" },
  { id: "en54", sentence: "Never ___ I seen anything like it.", answer: "have", hint: "Umgestelltes Hilfsverb nach never", tip_id: "inversion_emphasis" },
  { id: "en55", sentence: "___ tired, she went home early.", answer: "Feeling", hint: "sich fühlen, -ing clause mit demselben Subjekt", tip_id: "participle_clauses" },
  { id: "en56", sentence: "I may have ___, but I thought we agreed.", answer: "misunderstood", hint: "missverstehen, vorsichtige Einleitung eines Widerspruchs", tip_id: "hedging_diplomacy" },
  { id: "en57", sentence: "I haven't seen it, but Anna ___.", answer: "has", hint: "Hilfsverb ersetzt die bereits genannte Handlung", tip_id: "ellipsis_substitution" },
  { id: "en58", sentence: "Would you ___ keeping the noise down?", answer: "mind", hint: "etwas dagegen haben, höfliche Bitte passend zur Situation", tip_id: "register_precision_en" },
];

export const CLOZE_EXERCISES: ClozeExercise[] = [
  // Articles
  { id: "c1",  sentence: "___ Mann trinkt Kaffee.",        answer: "Der",    hint: "Masculine article", tip_id: "articles" },
  { id: "c2",  sentence: "___ Stadt ist groß.",            answer: "Die",    hint: "Feminine article",  tip_id: "articles" },
  { id: "c3",  sentence: "___ Kind spielt draußen.",       answer: "Das",    hint: "Neuter article",    tip_id: "articles" },
  { id: "c4",  sentence: "Ich sehe ___ Mann.",             answer: "den",    hint: "Accusative masculine", tip_id: "accusative" },
  { id: "c5",  sentence: "Er kauft ___ Kaffee.",           answer: "einen",  hint: "Accusative masculine indefinite", tip_id: "accusative" },
  // Verbs
  { id: "c6",  sentence: "Ich ___ müde.",                  answer: "bin",    hint: "sein, ich form",   tip_id: "sein_haben" },
  { id: "c7",  sentence: "Du ___ Zeit.",                   answer: "hast",   hint: "haben, du form",   tip_id: "sein_haben" },
  { id: "c8",  sentence: "Wir ___ nach Hause.",            answer: "gehen",  hint: "to go, wir form",  tip_id: "basic_word_order" },
  { id: "c9",  sentence: "Heute ___ ich Deutsch.",         answer: "lerne",  hint: "lernen, ich form", tip_id: "basic_word_order" },
  // Negation
  { id: "c10", sentence: "Ich verstehe das ___.",          answer: "nicht",  hint: "Negate the verb",   tip_id: "negation" },
  { id: "c11", sentence: "Ich habe ___ Zeit.",             answer: "keine",  hint: "Negate a noun",     tip_id: "negation" },
  // Modals
  { id: "c12", sentence: "Ich ___ Deutsch sprechen.",      answer: "kann",   hint: "can, ich form",    tip_id: "modal_verbs" },
  { id: "c13", sentence: "Du ___ jetzt gehen.",            answer: "musst",  hint: "must, du form",    tip_id: "modal_verbs" },
  { id: "c14", sentence: "Wir ___ Deutsch lernen.",        answer: "wollen", hint: "want to, wir form",tip_id: "modal_verbs" },
  // Separable
  { id: "c15", sentence: "Ich stehe um 7 Uhr ___.",        answer: "auf",    hint: "aufstehen splits",  tip_id: "separable_verbs" },
  { id: "c16", sentence: "Ruf mich bitte ___!",            answer: "an",     hint: "anrufen splits",    tip_id: "separable_verbs" },
  { id: "c17", sentence: "Sie ___ morgen nach Köln.", answer: "fährt", hint: "fahren with sie", tip_id: "present_tense" },
  { id: "c18", sentence: "___ kommst du nach Hause?", answer: "Wann", hint: "Question word for time", tip_id: "questions" },
  { id: "c19", sentence: "Ich habe sie gestern ___.", answer: "gesehen", hint: "Past form of sehen", tip_id: "perfect_past" },
  { id: "c20", sentence: "Kannst du ___ helfen?", answer: "mir", hint: "Dative form of ich", tip_id: "dative" },
  { id: "c21", sentence: "Die Schlüssel liegen in ___ Tasche.", answer: "der", hint: "Location with in", tip_id: "two_way_prepositions" },
  { id: "c22", sentence: "___ bitte kurz!", answer: "Warte", hint: "du command of warten", tip_id: "commands_requests" },
  { id: "c23", sentence: "Heute ist es wärmer ___ gestern.", answer: "als", hint: "Comparison meaning than", tip_id: "comparisons" },
  { id: "c24", sentence: "Ist das ___ Handy?", answer: "dein", hint: "Possessive meaning your", tip_id: "possessives" },
  { id: "c25", sentence: "Ich bleibe zu Hause, weil ich krank ___.", answer: "bin", hint: "Changed verb at the end of a weil clause", tip_id: "subordinate_clauses" },
  { id: "c26", sentence: "Ich erinnere ___ nicht daran.", answer: "mich", hint: "Pronoun used with sich erinnern", tip_id: "verbs_with_pronouns" },
  { id: "c27", sentence: "Ich warte ___ den Bus.", answer: "auf", hint: "Fixed partner word after warten", tip_id: "verbs_with_prepositions" },
  { id: "c28", sentence: "Das ist die Frau, ___ mir geholfen hat.", answer: "die", hint: "Relative word for die Frau", tip_id: "relative_clauses" },
  { id: "c29", sentence: "Ich ___ gern einen Kaffee.", answer: "hätte", hint: "Polite form of haben", tip_id: "konjunktiv_two" },
  { id: "c30", sentence: "Ich habe vergessen, Brot zu ___.", answer: "kaufen", hint: "to buy, basic verb after zu", tip_id: "zu_infinitive" },
  { id: "c31", sentence: "Ich brauche einen ___ Termin.", answer: "neuen", hint: "Adjective ending after einen", tip_id: "adjective_endings" },
  { id: "c32", sentence: "Das Paket wird heute ___.", answer: "geliefert", hint: "Past form of liefern", tip_id: "passive_voice" },
  { id: "c33", sentence: "Es regnet. ___ gehe ich raus.", answer: "Trotzdem", hint: "Connector meaning nevertheless", tip_id: "connectors" },
  { id: "c34", sentence: "Ich ___ müde und hatte keine Lust.", answer: "war", hint: "Common spoken simple past of sein", tip_id: "narrative_past" },
  { id: "c35", sentence: "Das ist das Handy meines ___.", answer: "Bruders", hint: "Genitive form of Bruder", tip_id: "genitive_possession" },
  { id: "c36", sentence: "Komm ___ einfach mit.", answer: "doch", hint: "Small word that encourages someone", tip_id: "modal_particles" },
  { id: "c37", sentence: "Ich hätte dich anrufen ___.", answer: "sollen", hint: "Regret with hätte + basic verbs", tip_id: "past_counterfactual" },
  { id: "c38", sentence: "Sie sagt, sie ___ morgen.", answer: "komme", hint: "Reported form of kommen", tip_id: "indirect_speech" },
  { id: "c39", sentence: "Er wird wohl zu Hause ___.", answer: "sein", hint: "to be, basic verb at the end after werden", tip_id: "future_assumptions" },
  { id: "c40", sentence: "Je länger wir warten, ___ teurer wird es.", answer: "desto", hint: "The more in a linked comparison", tip_id: "advanced_clause_links" },
  { id: "c41", sentence: "Das lässt sich leicht ___.", answer: "erklären", hint: "to explain, basic verb after sich lassen", tip_id: "passive_alternatives" },
  { id: "c42", sentence: "Ich habe ___ meiner Kollegin geschickt.", answer: "es", hint: "Short pronoun before a noun receiver", tip_id: "information_structure" },
  { id: "c43", sentence: "Gib mir bitte ___.", answer: "Bescheid", hint: "Fixed phrase meaning let me know", tip_id: "fixed_noun_verb_phrases" },
  { id: "c44", sentence: "Sie ___ bereits abgereist sein.", answer: "soll", hint: "Marks something as reported rather than confirmed", tip_id: "claim_and_distance" },
  { id: "c45", sentence: "Könnten wir das vielleicht auf morgen ___?", answer: "verschieben", hint: "to postpone, polite and diplomatic request", tip_id: "register_precision_de" },
  { id: "c46", sentence: "Heute ___ Pizza.", answer: "gibt's", hint: "Common spoken contraction of gibt es", tip_id: "spoken_reductions" },
];

function normalize(t: unknown) {
  return String(t ?? "").toLowerCase().trim().replace(/[.!?,]/g, "");
}

// ── ClozeTab component ────────────────────────────────────────────────────────
export function ClozeTab() {
  const learnsEnglish = uiIsGerman();
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exercises = learnsEnglish ? ENGLISH_CLOZE_EXERCISES : CLOZE_EXERCISES;
  const tips = learnsEnglish ? ENGLISH_GRAMMAR_TIPS : GRAMMAR_TIPS;
  const ex = exercises[index % exercises.length];
  const tip = tips.find(t => t.id === ex.tip_id);
  const correct = normalize(input) === normalize(ex.answer);

  useEffect(() => { inputRef.current?.focus(); setShowTip(false); }, [index]);
  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) return;
    const val = e.target.value;
    setInput(val);
    if (normalize(val) === normalize(ex.answer)) {
      setChecked(true);
      setScore(s => s + 1);
      timerRef.current = setTimeout(() => next(), 1200);
    }
  };

  const check = () => {
    if (!input.trim() || checked) return;
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setChecked(true);
    if (correct) { setScore(s => s + 1); timerRef.current = setTimeout(() => next(), 1200); }
  };

  const next = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setIndex(i => i + 1);
    setInput("");
    setChecked(false);
    setShowTip(false);
  }, []);

  // Render the sentence with the blank highlighted
  const parts = ex.sentence.split("___");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-4 py-3">
        <div className="text-xs font-black uppercase text-[var(--accent)]">{ui("Your task")}</div>
        <div className="mt-1 font-bold text-[var(--text-1)]">
          {ui("Which German word completes this sentence?")}
        </div>
        <div className="mt-0.5 text-sm font-medium text-[var(--text-2)]">
          {ui("Type the missing German word. A correct answer is accepted automatically.")}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-[var(--text-3)]">{index + 1} / {exercises.length} · {ui("Score")}: {score}</div>
        <Badge variant="outline" className="border-[var(--border)] font-black text-[var(--text-2)]">{tip?.level ?? "A1"}</Badge>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_14px_34px_rgba(25,27,38,0.06)] space-y-5">
        {/* Sentence with blank */}
        <div className="text-2xl font-black tracking-tight text-center leading-relaxed text-zinc-950">
          {parts[0]}
          <span className={`inline-block border-b-2 min-w-[80px] mx-1 text-center align-bottom
            ${checked ? (correct ? "border-emerald-500 text-emerald-600" : "border-rose-400 text-rose-600") : "border-zinc-400 text-[var(--accent)]"}`}>
            {checked ? ex.answer : (input || "\u00A0")}
          </span>
          {parts[1]}
        </div>

        <div className="text-sm font-semibold text-zinc-500 text-center">{ex.hint}</div>

        <div className="space-y-2">
          <label htmlFor="grammar-cloze-answer" className="block text-sm font-black text-[var(--text-2)]">
            {ui("Missing German word")}
          </label>
          <Input
            id="grammar-cloze-answer"
            ref={inputRef}
            value={input}
            onChange={handleChange}
            onKeyDown={e => { if (e.key === "Enter") { if (checked && correct) { next(); } else check(); } }}
            placeholder={ui("Type the German word…")}
            className="h-12 rounded-2xl border-zinc-200 bg-white text-center text-base font-bold text-zinc-950 placeholder:text-zinc-400 focus:border-[var(--accent)]"
            disabled={checked && !correct}
            lang={learnsEnglish ? "en" : "de"}
            autoComplete="off"
          />
        </div>

        {!checked && (
          <Button className="continue-glow h-12 w-full rounded-2xl bg-zinc-950 text-sm font-black text-white hover:bg-zinc-800 disabled:opacity-40" onClick={check} disabled={!input.trim()}>{ui("Check")}</Button>
        )}

        {checked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-3 text-sm font-bold text-center ${correct ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
            {correct
              ? <span className="flex items-center gap-2 justify-center font-medium"><CheckCircle2 className="h-4 w-4" /> {ui("Correct!")}</span>
              : <span className="font-medium"><XCircle className="h-4 w-4 inline mr-1" />{ui("Answer:")} <strong>{ex.answer}</strong></span>
            }
          </motion.div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="outline" size="sm" className="rounded-2xl gap-1 border-zinc-200 bg-white font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950" onClick={() => setShowTip(v => !v)}>
            <Lightbulb className="h-3 w-3" /> {ui("Grammar tip")}
          </Button>
          {checked && !correct && (
            <Button size="sm" className="rounded-2xl gap-1 bg-zinc-950 font-black text-white hover:bg-zinc-800" onClick={next}>
              {ui("Next")} <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showTip && tip && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-sm space-y-2 overflow-hidden">
              <div className="font-black text-amber-600">{tip.title}</div>
              <div className="font-semibold text-amber-700">{tip.summary}</div>
              <div className="font-semibold text-amber-600 italic">💡 {tip.tip}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── GrammarTab component ──────────────────────────────────────────────────────
const GRAMMAR_LEVELS = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
const GRAMMAR_LEVEL_RANK = new Map(GRAMMAR_LEVELS.map((item, index) => [item, index]));
const orderGrammarTopics = (topics: GrammarTip[]) => [...topics].sort(
  (left, right) => (GRAMMAR_LEVEL_RANK.get(left.level) ?? 99) - (GRAMMAR_LEVEL_RANK.get(right.level) ?? 99)
);
const ORDERED_GERMAN_GRAMMAR_TIPS = orderGrammarTopics(GRAMMAR_TIPS);
const ORDERED_ENGLISH_GRAMMAR_TIPS = orderGrammarTopics(ENGLISH_GRAMMAR_TIPS);

export function GrammarTab() {
  const learnsEnglish = uiIsGerman();
  const tips = learnsEnglish ? ORDERED_ENGLISH_GRAMMAR_TIPS : ORDERED_GERMAN_GRAMMAR_TIPS;
  const [selected, setSelected] = useState(tips[0].id);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");

  const filteredTips = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return tips.filter((topic) => {
      if (level !== "All" && topic.level !== level) return false;
      if (!needle) return true;
      const searchable = [
        topic.title,
        topic.summary,
        topic.tip,
        ...topic.rules,
        ...topic.examples.flatMap((example) => [example.de, example.en]),
      ].join(" ").toLocaleLowerCase();
      return searchable.includes(needle);
    });
  }, [level, query, tips]);

  useEffect(() => {
    if (!filteredTips.some((topic) => topic.id === selected)) {
      setSelected(filteredTips[0]?.id ?? "");
    }
  }, [filteredTips, selected]);

  const tip = filteredTips.find((topic) => topic.id === selected) ?? filteredTips[0];
  const targetLanguage = learnsEnglish ? "English" : "German";
  const meaningLanguage = learnsEnglish ? "German" : "English";

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-[0_5px_0_color-mix(in_srgb,var(--accent)_14%,transparent)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent)]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-[var(--text-1)]">{ui("Grammar path: A1 to C2")}</h3>
            <p className="mt-0.5 max-w-3xl text-sm font-semibold leading-relaxed text-[var(--text-2)]">
              {ui("A1 and A2 build the basics. B1 and B2 support independent conversation. C1 and C2 deepen precision, tone, and style.")}
            </p>
          </div>
        </div>
        <div className="shrink-0 self-start rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-black text-[var(--text-1)] sm:self-center">
          {tips.length} {ui("topics")}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-3 shadow-[0_10px_26px_rgba(25,27,38,0.05)]">
            <label htmlFor="grammar-topic-search" className="sr-only">{ui("Search grammar…")}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" aria-hidden="true" />
              <Input
                id="grammar-topic-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui("Search grammar…")}
                className="h-11 rounded-2xl border-[var(--border)] bg-[var(--surface)] pl-10 font-bold text-[var(--text-1)] placeholder:font-semibold placeholder:text-[var(--text-3)] focus-visible:border-[var(--accent)] focus-visible:ring-[var(--accent)]/20"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={ui("Grammar level")}>
              {GRAMMAR_LEVELS.map((item) => {
                const active = item === level;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLevel(item)}
                    className={`min-w-10 rounded-xl border px-2.5 py-1.5 text-xs font-black transition duration-150 active:translate-y-px ${active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_3px_0_color-mix(in_srgb,var(--accent)_55%,black)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:-translate-y-0.5 hover:border-[var(--accent)]/45 hover:text-[var(--text-1)]"
                    }`}
                  >
                    {item === "All" ? ui("All levels") : item}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between px-1 text-xs font-bold text-[var(--text-3)]">
              <span>{ui("Grammar topics")}</span>
              <span>{filteredTips.length} / {tips.length}</span>
            </div>
          </div>

          <div className="max-h-[min(62vh,700px)] space-y-2 overflow-y-auto pr-1 [scrollbar-color:var(--border)_transparent]">
            {filteredTips.map((topic) => {
              const active = selected === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelected(topic.id)}
                  aria-current={active ? "true" : undefined}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition duration-150 active:translate-y-px ${active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_4px_0_color-mix(in_srgb,var(--accent)_55%,black)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <div className="font-black leading-snug">{topic.title}</div>
                  <div className={`mt-1 text-xs font-black ${active ? "text-white/80" : "text-[var(--text-3)]"}`}>{topic.level}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {!tip && (
          <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <div>
              <Search className="mx-auto h-7 w-7 text-[var(--accent)]" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-black text-[var(--text-1)]">{ui("No grammar topics found")}</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--text-2)]">{ui("Try another search or choose a different level.")}</p>
            </div>
          </div>
        )}

        {tip && (
          <AnimatePresence mode="wait">
            <motion.article
              key={tip.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_14px_34px_rgba(25,27,38,0.06)] sm:p-6"
            >
              <header>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="min-w-0 flex-1 text-xl font-black leading-tight text-[var(--text-1)] sm:text-2xl">{tip.title}</h2>
                  <Badge variant="outline" className="rounded-xl border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-1 font-black text-[var(--accent)]">{tip.level}</Badge>
                </div>
                <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-[var(--text-2)]">{tip.summary}</p>
              </header>

              <section aria-labelledby="grammar-patterns-heading" className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <h3 id="grammar-patterns-heading" className="text-sm font-black text-[var(--text-1)]">{ui("Key patterns")}</h3>
                <ul className="mt-3 space-y-2.5">
                  {tip.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-2)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                      <span className="font-semibold">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="flex items-start gap-3 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/10 p-4 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <div>
                  <span className="font-black text-[var(--accent)]">{ui("Useful shortcut")}: </span>
                  <span className="font-semibold leading-relaxed text-[var(--text-2)]">{tip.tip}</span>
                </div>
              </aside>

              <section aria-labelledby="grammar-examples-heading" className="space-y-2.5">
                <h3 id="grammar-examples-heading" className="text-sm font-black text-[var(--text-1)]">{ui("Examples")}</h3>
                {tip.examples.map((example, index) => (
                  <div key={index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5">
                    <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--accent)]">{ui(targetLanguage)}</div>
                    <div className="mt-1 font-black leading-relaxed text-[var(--text-1)]" lang={learnsEnglish ? "en" : "de"}>{example.de}</div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui(meaningLanguage)}</div>
                    <div className="mt-1 text-sm font-semibold leading-relaxed text-[var(--text-2)]" lang={learnsEnglish ? "de" : "en"}>{example.en}</div>
                  </div>
                ))}
              </section>
            </motion.article>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
