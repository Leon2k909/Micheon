import type { Blueprint, Dialogue } from "./types";

/**
 * Conversations for the lessons that never had one.
 *
 * 369 of the course's 650 lessons taught their sentences and words and then
 * stopped — no scene at the end where the language is actually USED. These
 * are those scenes. They live here rather than inline in data.ts because
 * data.ts is the file every parallel session edits: one hook at its export
 * merges this record in, and every block of new conversations after that
 * touches only this file.
 *
 * THE RULES each dialogue here is written under, in order of importance:
 *
 *   1. A conversation is a capstone, not a doorway. Every line is built from
 *      language the course already teaches — no new words arrive in a scene.
 *      Checked against the full course text before every block ships.
 *   2. Every line is a NEW sentence. A line that copies a sentence its pack
 *      already teaches collapses into that sentence's card and counts
 *      nothing, so the 2,768 -> 3,500 count only moves for genuinely new
 *      lines. Checked against all 13,790 course sentences.
 *   3. The title names the situation. The lines are one scene with a start
 *      and an end, not sample sentences holding hands.
 *   4. English rides on every line, written as what an English speaker would
 *      SAY there — the English course serves the same line turned around.
 *   5. French and Polish are deliberately absent for now; the translation
 *      pass works from dialog-uebersetzungen-offen.tsv at the repo root,
 *      which lists every line added here with its pack and title.
 *
 * dialogueIsEarned() decides when a scene runs: at least half its lines must
 * be drilled in one sitting first. check-dialogue-capstone.cjs holds that
 * rule in place, and every pack touched here is walked the same way that
 * gate walks its sample, so a scene that would never run does not ship.
 */
const CAPSTONE_DIALOGUES: Record<string, Dialogue[]> = {
  // Keys are quoted so check-catalog-duplicates does not read this record as
  // a second DECLARATION of each pack — the packs live in data.ts alone.
  "part84": [
    {
      title: "Die letzte Runde",
      lines: [
        { speaker: "A", de: "Ich kann nicht mehr, ich bin komplett aus der Puste.", en: "I can't go on — I'm completely out of breath." },
        { speaker: "B", de: "Komm, letzte Runde, dann hast du es geschafft!", en: "Come on, last lap and you've done it!" },
        { speaker: "A", de: "Ich habe Seitenstechen und spüre Muskeln, von denen ich nichts wusste.", en: "I've got a stitch and I'm feeling muscles I never knew I had." },
        { speaker: "B", de: "Der Muskelkater kommt sowieso erst übermorgen. Durchziehen!", en: "The soreness won't hit till the day after tomorrow anyway. Push through!" },
        { speaker: "A", de: "Na gut. Aber nächsten Sonntag kicken wir nur im Park.", en: "Fine. But next Sunday we're just having a kickabout in the park." },
      ],
    },
  ],
  "part94": [
    {
      title: "Rezeptfrei oder nicht",
      lines: [
        { speaker: "A", de: "Guten Tag, haben Sie etwas gegen Halsschmerzen für ein Kind von fünf Jahren?", en: "Hello, do you have something for a sore throat, for a five-year-old?" },
        { speaker: "B", de: "Ja, dieser Saft hier ist rezeptfrei. Einmal morgens, einmal abends.", en: "Yes, this syrup here is available without prescription. Once in the morning, once at night." },
        { speaker: "A", de: "Macht der müde? Sie hat morgen Schule.", en: "Does it make you drowsy? She's got school tomorrow." },
        { speaker: "B", de: "Nein. Aber geben Sie ihn nach dem Essen, nicht vorher.", en: "No. But give it after food, not before." },
        { speaker: "A", de: "Gut. Und welche Apotheke hat heute Nacht Notdienst, falls was ist?", en: "Good. And which pharmacy is on night duty tonight, just in case?" },
      ],
    },
  ],
  "part95": [
    {
      title: "Der Notfalltermin",
      lines: [
        { speaker: "A", de: "Guten Morgen, ich habe starke Zahnschmerzen. Geht heute noch ein Notfalltermin?", en: "Good morning, I've got bad toothache. Is there still an emergency appointment today?" },
        { speaker: "B", de: "Um halb zwölf. Seit wann tut der Zahn denn weh?", en: "At half past eleven. How long has the tooth been hurting?" },
        { speaker: "A", de: "Seit gestern Abend. Es pocht, und kalt trinken geht gar nicht mehr.", en: "Since last night. It's throbbing, and cold drinks are out of the question now." },
        { speaker: "B", de: "Welcher ist es denn?", en: "Which one is it?" },
        { speaker: "A", de: "Der hintere unten links. Mir ist da vor Jahren mal eine Füllung rausgefallen.", en: "The one at the back, bottom left. A filling fell out there years ago." },
      ],
    },
  ],
  "part96": [
    {
      title: "Der Anruf bei der 112",
      lines: [
        { speaker: "A", de: "Notruf, was ist passiert?", en: "Emergency services — what's happened?" },
        { speaker: "B", de: "Es hat einen Unfall gegeben, auf der B27 kurz vor der Ausfahrt.", en: "There's been an accident, on the B27 just before the exit." },
        { speaker: "A", de: "Ist jemand verletzt?", en: "Is anyone injured?" },
        { speaker: "B", de: "Eine Person. Sie ist bewusstlos, atmet aber. Wir haben mit Erster Hilfe angefangen.", en: "One person. She's unconscious but breathing. We've started first aid." },
        { speaker: "A", de: "Gut gemacht. Bleiben Sie ruhig bei ihr, Hilfe ist unterwegs.", en: "Well done. Stay with her and keep calm — help is on its way." },
      ],
    },
  ],
  "part98": [
    {
      title: "Das Gespräch übers Gehalt",
      lines: [
        { speaker: "A", de: "Danke, dass Sie Zeit haben. Ich würde gern über mein Gehalt sprechen.", en: "Thank you for making time. I'd like to talk about my salary." },
        { speaker: "B", de: "Gern. Worum geht es konkret?", en: "Of course. What's it about, specifically?" },
        { speaker: "A", de: "Sie wissen ja: Seit zwei Jahren trage ich deutlich mehr Verantwortung.", en: "As you know, I've been carrying considerably more responsibility for two years now." },
        { speaker: "B", de: "Das stimmt. An welche Größenordnung denken Sie?", en: "That's true. What sort of figure do you have in mind?" },
        { speaker: "A", de: "Zehn Prozent. Und zusätzlich zwei Tage pro Woche im Homeoffice.", en: "Ten per cent. And on top of that, two days a week working from home." },
      ],
    },
  ],
  "part114": [
    {
      title: "Aufgeschoben",
      lines: [
        { speaker: "A", de: "Wie verbringst du eigentlich deinen Sonntag, so ganz ehrlich?", en: "How do you actually spend your Sunday — be honest?" },
        { speaker: "B", de: "Ursprünglich wollte ich aufräumen. Ich schiebe das seit Wochen vor mir her.", en: "Originally I meant to tidy up. I've been putting it off for weeks." },
        { speaker: "A", de: "Kenne ich. Künftig machen wir das anders: erst eine Stunde arbeiten, dann frei.", en: "I know the feeling. From now on we'll do it differently: one hour of work first, then free time." },
        { speaker: "B", de: "Das dauert bei mir höchstens zehn Minuten, so viel liegt da nicht.", en: "That'll take me ten minutes at most — there isn't that much lying around." },
        { speaker: "A", de: "Dann nimm dir danach bewusst Zeit für was Schönes.", en: "Then set aside proper time afterwards for something nice." },
      ],
    },
  ],
  "part115": [
    {
      title: "Nicht optimal, aber es geht",
      lines: [
        { speaker: "A", de: "Und, wie findest du die neue Software generell?", en: "So what do you make of the new software, generally?" },
        { speaker: "B", de: "Relativ einfach zu bedienen. Das Konzept überzeugt mich aber noch nicht.", en: "Relatively easy to use. The concept doesn't convince me yet, though." },
        { speaker: "A", de: "Die Reaktion im Team war auch eher negativ.", en: "The team's reaction was on the negative side too." },
        { speaker: "B", de: "Wir haben zwei Wochen intensiv geübt. Es ist nicht optimal, aber es geht.", en: "We practised intensively for two weeks. It's not ideal, but it works." },
        { speaker: "A", de: "Na immerhin. Effektiv ist es billiger als vorher, das zählt auch.", en: "Well, that's something. In effect it's cheaper than before — that counts too." },
      ],
    },
  ],
  "part116": [
    {
      title: "Der Antrag online",
      lines: [
        { speaker: "A", de: "Guten Tag, ich habe den Antrag online gestellt. Wie lange dauert die Bearbeitung?", en: "Hello, I submitted the application online. How long does processing take?" },
        { speaker: "B", de: "Etwa drei Wochen. Bringen Sie zum Termin bitte alle Dokumente mit.", en: "About three weeks. Please bring all your documents to the appointment." },
        { speaker: "A", de: "Gilt der Bescheid dann bundesweit?", en: "Will the decision be valid nationwide?" },
        { speaker: "B", de: "Ja. Nur eine Frage kann ich Ihnen aus Gründen des Datenschutzes nicht beantworten.", en: "Yes. There's just one question I can't answer, for data protection reasons." },
        { speaker: "A", de: "Verstehe. Können Sie mir wenigstens erläutern, welche Unterlagen noch fehlen?", en: "I see. Could you at least explain to me which papers are still missing?" },
      ],
    },
  ],
  "part117": [
    {
      title: "Das kriegen wir hin",
      lines: [
        { speaker: "A", de: "Darf ich kurz ergänzen? Ich habe das Problem schon länger beobachtet.", en: "May I add something briefly? I've been watching this problem for a while." },
        { speaker: "B", de: "Bitte, gern. Jeder Hinweis erleichtert die Sache erheblich.", en: "Please do. Every pointer makes this considerably easier." },
        { speaker: "A", de: "Wir müssen nur verhindern, dass es im Winter schlimmer wird.", en: "We just have to stop it getting worse over the winter." },
        { speaker: "B", de: "Da hat jeder andere Bedürfnisse. Aber gut: Sag Bescheid, wenn du Hilfe brauchst.", en: "Everyone's needs are different there. But fine: give me a shout if you need help." },
        { speaker: "A", de: "Mach ich. Zusammen kriegen wir das hin.", en: "Will do. Together we'll manage it." },
      ],
    },
  ],
  "part121": [
    {
      title: "Mehr Kunden für den Laden",
      lines: [
        { speaker: "A", de: "Ich brauche endlich eine richtige Webseite für mein Geschäft.", en: "I finally need a proper website for my business." },
        { speaker: "B", de: "Lass eine bauen und mach mehr Werbung. Wir werben fast nur noch online.", en: "Have one built and do more advertising. We advertise almost exclusively online these days." },
        { speaker: "A", de: "Und wie gewinnt ihr neue Kunden? Nur über Instagram?", en: "And how do you win new customers? Just through Instagram?" },
        { speaker: "B", de: "Auch. Vor allem aber über sehr gute Bewertungen.", en: "That too. But above all through very good reviews." },
        { speaker: "A", de: "Gut. Schick mir ein Angebot — zahlbar innerhalb von vierzehn Tagen, wie immer?", en: "Fine. Send me a quote — payable within fourteen days, as usual?" },
      ],
    },
  ],
  "part122": [
    {
      title: "Nur noch eine Folge",
      lines: [
        { speaker: "A", de: "Ich habe die zweite Staffel gestern in einem Rutsch durchgeschaut.", en: "I binged the whole second season yesterday in one go." },
        { speaker: "B", de: "Verrate mir nichts! Ich bin erst bei Folge vier.", en: "Don't tell me anything! I'm only on episode four." },
        { speaker: "A", de: "Keine Sorge, kein Spoiler. Aber sie ist besser als die erste.", en: "Don't worry, no spoilers. But it's better than the first." },
        { speaker: "B", de: "Das reicht mir schon! Und danach? Was soll ich als Nächstes schauen?", en: "That's already more than I needed! And afterwards? What should I watch next?" },
        { speaker: "A", de: "Ich schicke dir den Kanal, den ich abonniert habe. Kann ich echt empfehlen.", en: "I'll send you the channel I've subscribed to. Really can recommend it." },
      ],
    },
  ],
  "part123": [
    {
      title: "Stoßlüften, nicht kippen",
      lines: [
        { speaker: "A", de: "Die Nachbarn haben sich beschwert? Wir sind doch gerade erst eingezogen.", en: "The neighbours have complained? We've only just moved in." },
        { speaker: "B", de: "Wegen der Waschmaschine gestern Nacht. Ab zweiundzwanzig Uhr ist Ruhezeit.", en: "About the washing machine last night. Quiet hours start at ten p.m." },
        { speaker: "A", de: "Steht das wirklich in der Hausordnung?", en: "Is that really in the house rules?" },
        { speaker: "B", de: "Ja, und noch mehr: sonntags wird nicht gebohrt.", en: "Yes, and there's more: no drilling on Sundays." },
        { speaker: "A", de: "Gut zu wissen. Der Hausmeister meinte auch noch: Stoßlüften, nicht kippen.", en: "Good to know. The caretaker also said: air the place properly, don't just tilt the window." },
      ],
    },
  ],
  "part124": [
    {
      title: "Endlich eingeschlafen",
      lines: [
        { speaker: "A", de: "Leise, sie ist gerade eingeschlafen.", en: "Quietly — she's just fallen asleep." },
        { speaker: "B", de: "Endlich. Hat er auch durchgeschlafen?", en: "At last. Did he sleep through as well?" },
        { speaker: "A", de: "Bis fünf. Dann hat er geschrien, und die Windel war natürlich voll.", en: "Till five. Then he screamed — and the nappy was full, of course." },
        { speaker: "B", de: "Ich übernehme morgen früh. Du bringst sie in die Kita, ich wickle ihn.", en: "I'll take over tomorrow morning. You take her to nursery, I'll change him." },
        { speaker: "A", de: "Abgemacht. Und der Kinderwagen muss unten bleiben, er passt nicht in den Aufzug.", en: "Deal. And the pram has to stay downstairs — it doesn't fit in the lift." },
      ],
    },
  ],
  "part125": [
    {
      title: "Die leere Batterie",
      lines: [
        { speaker: "A", de: "Der Wagen springt nicht an. Ich glaube, die Batterie ist leer.", en: "The car won't start. I think the battery's dead." },
        { speaker: "B", de: "Schon wieder? Kannst du mal Starthilfe geben lassen?", en: "Again? Can you get someone to jump-start it?" },
        { speaker: "A", de: "Der Nachbar hilft gleich. Aber der Motor macht auch ein komisches Geräusch.", en: "The neighbour's going to help in a minute. But the engine's making a strange noise too." },
        { speaker: "B", de: "Dann bring den Wagen diese Woche in die Werkstatt. Der TÜV ist eh bald fällig.", en: "Then take the car to the garage this week. The MOT's due soon anyway." },
        { speaker: "A", de: "Stimmt. Und tanken muss ich auch noch. Das Auto frisst gerade nur Geld.", en: "True. And I still need to fill up. The car's just eating money at the moment." },
      ],
    },
  ],
  "part126": [
    {
      title: "Alles ein bisschen viel",
      lines: [
        { speaker: "A", de: "Du wirkst gestresst. Alles okay bei dir?", en: "You seem stressed. Everything okay with you?" },
        { speaker: "B", de: "Ehrlich? Ich bin gerade etwas überfordert. Das ist mir alles zu viel.", en: "Honestly? I'm a bit overwhelmed right now. It's all too much for me." },
        { speaker: "A", de: "Das verstehe ich. Mich nervt die Woche auch langsam.", en: "I understand. This week's slowly getting on my nerves too." },
        { speaker: "B", de: "Wie bleibt deine Schwester eigentlich immer so gelassen?", en: "How does your sister always stay so calm, anyway?" },
        { speaker: "A", de: "Keine Ahnung. Aber ich bin froh, dass du so ehrlich bist.", en: "No idea. But I'm glad you're being so honest." },
      ],
    },
  ],
  "part127": [
    {
      title: "Die Taufe im Frühling",
      lines: [
        { speaker: "A", de: "Wir lassen den Kleinen im Frühling taufen.", en: "We're having the little one christened in the spring." },
        { speaker: "B", de: "Wie schön! In eurer Gemeinde?", en: "How lovely! In your parish?" },
        { speaker: "A", de: "Ja, der Gottesdienst fängt um zehn an, danach feiern wir im Garten.", en: "Yes, the service starts at ten, then we're celebrating in the garden." },
        { speaker: "B", de: "Der Pfarrer hat bei eurer Hochzeit damals so schön gesprochen.", en: "The vicar spoke so beautifully at your wedding back then." },
        { speaker: "A", de: "Genau der macht es wieder. Mein Glaube ist mir wichtig, das weißt du ja.", en: "It's him doing it again. My faith matters to me — you know that." },
      ],
    },
  ],
  "part128": [
    {
      title: "Der verstauchte Knöchel",
      lines: [
        { speaker: "A", de: "Kommst du morgen joggen? Wir wollten doch dreimal die Woche trainieren.", en: "Are you coming jogging tomorrow? We did say we'd train three times a week." },
        { speaker: "B", de: "Ich kann nicht, ich habe mir den Knöchel verstaucht.", en: "I can't — I've sprained my ankle." },
        { speaker: "A", de: "Autsch. Beim Schwimmen gestern?", en: "Ouch. Swimming yesterday?" },
        { speaker: "B", de: "Nein, auf der Treppe. Es tut vor allem beim Laufen weh.", en: "No, on the stairs. It hurts most when I walk." },
        { speaker: "A", de: "Dann mach diese Woche Pause. Ich wärme mich ab jetzt für zwei auf.", en: "Then take this week off. I'll be warming up for two from now on." },
      ],
    },
  ],
  "part132": [
    {
      title: "Der Ohrwurm",
      lines: [
        { speaker: "A", de: "Ich habe seit Tagen einen Ohrwurm von deinem Lied.", en: "I've had your song stuck in my head for days." },
        { speaker: "B", de: "Welches denn? Das, das wir im Chor proben?", en: "Which one? The one we're rehearsing in choir?" },
        { speaker: "A", de: "Genau das. Ich kenne den Text inzwischen besser als du.", en: "That's the one. I know the words better than you do by now." },
        { speaker: "B", de: "Dann sing doch mit! Wir proben jeden Donnerstag.", en: "Then come and sing along! We rehearse every Thursday." },
        { speaker: "A", de: "Mal sehen. Euer letzter Auftritt war jedenfalls richtig gut.", en: "We'll see. Your last performance was properly good, in any case." },
      ],
    },
  ],
  "part138": [
    {
      title: "Samstag im Garten",
      lines: [
        { speaker: "A", de: "Was steht heute an? Der Rasen?", en: "What's on today? The lawn?" },
        { speaker: "B", de: "Mähen, ja. Und im Beet wächst nur noch Unkraut.", en: "Mowing, yes. And the bed's growing nothing but weeds." },
        { speaker: "A", de: "Ich übernehme das Beet, und danach hältst du mir die Leiter fest.", en: "I'll take the bed, and afterwards you hold the ladder steady for me." },
        { speaker: "B", de: "Für den Baum? Der muss wirklich geschnitten werden.", en: "For the tree? It really does need pruning." },
        { speaker: "A", de: "Genau. Und abends gießen wir die Blumen und sind fertig.", en: "Exactly. And in the evening we water the flowers and we're done." },
      ],
    },
  ],
  "part140": [
    {
      title: "Im Abteil nach Norden",
      lines: [
        { speaker: "A", de: "Entschuldigung, ist dieses Abteil noch frei?", en: "Excuse me, is this compartment still free?" },
        { speaker: "B", de: "Ja, kommen Sie rein. Müssen Sie auch umsteigen?", en: "Yes, come on in. Do you have to change trains as well?" },
        { speaker: "A", de: "Einmal, aber der Anschlusszug wartet. Wir wollen an die Küste, zelten.", en: "Once, but the connecting train waits. We're heading to the coast, camping." },
        { speaker: "B", de: "Schön! Die Wellen sollen dieses Wochenende ziemlich hoch sein.", en: "Lovely! The waves are supposed to be quite high this weekend." },
        { speaker: "A", de: "Perfekt für die Kinder. Zelt, Lagerfeuer, grillen — mehr brauchen wir nicht.", en: "Perfect for the kids. Tent, campfire, barbecue — we don't need more than that." },
      ],
    },
  ],
  "part99": [
    {
      title: "Gelinde gesagt",
      lines: [
        { speaker: "A", de: "Und, was hältst du von seinem Vorschlag?", en: "So, what do you make of his proposal?" },
        { speaker: "B", de: "Der ist, gelinde gesagt, unglücklich formuliert.", en: "It is, to put it mildly, unfortunately worded." },
        { speaker: "A", de: "Ich will dir nicht zu nahe treten, aber der Text kam doch von euch.", en: "I don't want to step on your toes, but the text did come from your side." },
        { speaker: "B", de: "Da würde ich stark differenzieren wollen: am ersten Teil, nicht am zweiten.", en: "I'd want to draw a sharp distinction there: on the first part, not the second." },
        { speaker: "A", de: "Na gut. Das steht ohnehin auf einem anderen Blatt.", en: "Fair enough. That's another matter entirely anyway." },
      ],
    },
  ],
  "part129": [
    {
      title: "Fünf Minuten noch",
      lines: [
        { speaker: "A", de: "Bist du bald fertig im Bad? Ich muss mir noch die Zähne putzen.", en: "Are you nearly done in the bathroom? I still have to brush my teeth." },
        { speaker: "B", de: "Fünf Minuten! Ich föhne mir nur kurz die Haare.", en: "Five minutes! I'm just quickly blow-drying my hair." },
        { speaker: "A", de: "Dann hebe ich unterwegs Geld ab. Der Automat an der Ecke geht wieder.", en: "Then I'll get cash out on the way. The machine on the corner is working again." },
        { speaker: "B", de: "Gut. Steht Milch eigentlich schon auf der Liste?", en: "Good. Is milk actually on the list yet?" },
        { speaker: "A", de: "Ja, und alle Zutaten für morgen. Ich warte unten.", en: "Yes, and all the ingredients for tomorrow. I'll wait downstairs." },
      ],
    },
  ],
  "part130": [
    {
      title: "Der Kreisverkehr",
      lines: [
        { speaker: "A", de: "Ich glaube, wir sind falsch. Da vorne ist eine Umleitung.", en: "I think we've gone wrong. There's a diversion up ahead." },
        { speaker: "B", de: "Nein, das passt. Fahr im Kreisverkehr die zweite Ausfahrt.", en: "No, this is right. Take the second exit at the roundabout." },
        { speaker: "A", de: "Und dann? An der Kreuzung links abbiegen?", en: "And then? Turn left at the junction?" },
        { speaker: "B", de: "Erst an der zweiten Ampel. Das Haus liegt direkt gegenüber der Post.", en: "Not till the second lights. The house is directly opposite the post office." },
        { speaker: "A", de: "Hoffentlich. Die Straße danach ist nämlich eine Einbahnstraße.", en: "Let's hope so. Because the street after that is one-way." },
      ],
    },
  ],
  "part131": [
    {
      title: "Massives Holz",
      lines: [
        { speaker: "A", de: "Schau mal, der Tisch! Ist der aus massivem Holz?", en: "Look at that table! Is it solid wood?" },
        { speaker: "B", de: "Ja, und die Stühle sind aus echtem Leder.", en: "Yes, and the chairs are real leather." },
        { speaker: "A", de: "Passt der überhaupt? Das sind bestimmt zwei Meter.", en: "Will it even fit? That's got to be two metres." },
        { speaker: "B", de: "Knapp. Und die Verpackung ist leider komplett aus Plastik.", en: "Just about. And the packaging is all plastic, unfortunately." },
        { speaker: "A", de: "Egal, wir nehmen ihn. Vorsicht beim Tragen, das Holz ist empfindlich.", en: "Never mind, we'll take it. Careful carrying it — the wood is delicate." },
      ],
    },
  ],
  "part133": [
    {
      title: "Die Klassenarbeit",
      lines: [
        { speaker: "A", de: "Welche Note hast du in der Klassenarbeit bekommen?", en: "What mark did you get in the class test?" },
        { speaker: "B", de: "Eine Zwei! Dabei ist Mathe echt nicht mein Fach.", en: "A B! And maths really isn't my subject." },
        { speaker: "A", de: "Eine Zwei ist super. Hat wieder jemand abgeschrieben?", en: "A B is great. Did somebody copy again?" },
        { speaker: "B", de: "Klar, und der Lehrer hat es sofort gemerkt.", en: "Of course — and the teacher noticed straight away." },
        { speaker: "A", de: "Selber schuld. Das Zeugnis kommt ja schon nächste Woche.", en: "Their own fault. Reports are out next week, after all." },
      ],
    },
  ],
  "part137": [
    {
      title: "Verspannt vom Sitzen",
      lines: [
        { speaker: "A", de: "Mein Nacken ist total verspannt, und die Schulter tut auch weh.", en: "My neck is completely seized up, and my shoulder hurts too." },
        { speaker: "B", de: "Zu viel am Schreibtisch? Beweg mal die Finger — tut da was weh?", en: "Too long at the desk? Move your fingers — does anything hurt?" },
        { speaker: "A", de: "Nein, aber das Handgelenk ist ein bisschen geschwollen.", en: "No, but my wrist is a little swollen." },
        { speaker: "B", de: "Dann leg heute eine Pause ein und kühl das Gelenk.", en: "Then take a break today and put something cold on the joint." },
        { speaker: "A", de: "Mach ich. Muskelkater in den Waden habe ich auch noch.", en: "I will. And I've got sore calves as well." },
      ],
    },
  ],
  "part447": [
    {
      title: "Nicht mehr zu ertragen",
      lines: [
        { speaker: "A", de: "Hast du den Kommentar gesehen? Das macht mich echt wütend.", en: "Did you see the comment? It makes me properly angry." },
        { speaker: "B", de: "Ich kann das auch nicht mehr ertragen. Wer hat das gepostet?", en: "I can't stand it any more either. Who posted it?" },
        { speaker: "A", de: "Keine Ahnung, irgendein neues Konto. Ich dreh gleich durch.", en: "No idea — some new account. I'm about to lose it." },
        { speaker: "B", de: "Melde es einfach und gut. Das ist meistens so bei denen.", en: "Just report it and be done. That's usually how it goes with them." },
        { speaker: "A", de: "Stimmt. Ich freu mich schon drauf, wenn das Konto weg ist.", en: "True. I'm already looking forward to that account being gone." },
      ],
    },
  ],
  "part448": [
    {
      title: "Der Stellenabbau in den Nachrichten",
      lines: [
        { speaker: "A", de: "Hast du die Nachrichten gelesen? Es droht ein weiterer Stellenabbau.", en: "Have you read the news? More job cuts are looming." },
        { speaker: "B", de: "Ja. Für die Region klingt das nach einer echten Bedrohung.", en: "Yes. For the region that sounds like a genuine threat." },
        { speaker: "A", de: "Trifft es auch eure Firma?", en: "Is your company affected too?" },
        { speaker: "B", de: "Noch nicht. Unser Produkt ist ein typischer Anwendungsfall für die neue Technik.", en: "Not yet. Our product is a typical use case for the new technology." },
        { speaker: "A", de: "Dann hoffen wir, dass das so bleibt.", en: "Then let's hope it stays that way." },
      ],
    },
  ],
  "part449": [
    {
      title: "Die übersehene Mitteilung",
      lines: [
        { speaker: "A", de: "Du hast nicht geantwortet. Hast du meine Nachricht gesehen?", en: "You didn't reply. Did you see my message?" },
        { speaker: "B", de: "Erst jetzt! Die Benachrichtigung war irgendwie weg.", en: "Only just now! The notification had somehow vanished." },
        { speaker: "A", de: "Schon wieder? Bei mir war das auch mal so.", en: "Again? That happened to me once too." },
        { speaker: "B", de: "Ich habe dann den Verlauf im Browser gelöscht, seitdem geht es.", en: "I cleared the browser history in the end — it's been fine since." },
        { speaker: "A", de: "Gut. Ohne Premium-Abo bleibt eben manches komisch.", en: "Right. Without a premium subscription some things just stay odd." },
      ],
    },
  ],
  "part450": [
    {
      title: "Die Sammlung fürs Geschenk",
      lines: [
        { speaker: "A", de: "Wir sammeln Geld für ein Geschenk. Bist du dabei?", en: "We're collecting money for a present. Are you in?" },
        { speaker: "B", de: "Klar. Für die Kollegin aus Schweden, oder?", en: "Of course. For the colleague from Sweden, right?" },
        { speaker: "A", de: "Genau, sie geht zurück nach Schweden zu ihrer alten Firma.", en: "Exactly — she's going back to Sweden, to her old company." },
        { speaker: "B", de: "Schade. Ich hab ihr versprochen, dass wir sie besuchen.", en: "A shame. I promised her we'd visit." },
        { speaker: "A", de: "Dann halte das Versprechen. Schweden im Sommer soll wunderschön sein.", en: "Then keep the promise. Sweden in summer is supposed to be gorgeous." },
      ],
    },
  ],
  "part451": [
    {
      title: "Kommst du kurz raus?",
      lines: [
        { speaker: "A", de: "Kommst du kurz raus? Du musst dir das ansehen.", en: "Can you come outside for a second? You have to see this." },
        { speaker: "B", de: "Was denn? Ich hab nichts gehört.", en: "What is it? I didn't hear anything." },
        { speaker: "A", de: "Eben! Die ganze Straße ist leer, alle Autos sind weg.", en: "Exactly! The whole street is empty — all the cars are gone." },
        { speaker: "B", de: "Das ist doch verrückt. So was hab ich noch nie gesehen.", en: "That's crazy. I've never seen anything like it." },
        { speaker: "A", de: "Morgen wird gebaut, stand auf den Schildern. Wir brauchen einen Parkplatz.", en: "There's roadworks tomorrow — it was on the signs. We need somewhere to park." },
      ],
    },
  ],
  "part452": [
    {
      title: "Zurückgetreten",
      lines: [
        { speaker: "A", de: "Hast du es gehört? Er ist von seinem Amt zurückgetreten.", en: "Have you heard? He's resigned from his post." },
        { speaker: "B", de: "Endlich. Das Ergebnis der Prüfung war ja auch enttäuschend.", en: "Finally. The result of the review was disappointing, after all." },
        { speaker: "A", de: "Und die Angaben im Bericht waren unvollständig.", en: "And the figures in the report were incomplete." },
        { speaker: "B", de: "Kann sein Nachfolger da überhaupt mithalten?", en: "Can his successor even keep up with all that?" },
        { speaker: "A", de: "Mal sehen. Das Update zur Sache verzögert sich ja sowieso.", en: "We'll see. The update on the matter is delayed anyway." },
      ],
    },
  ],
  "part455": [
    {
      title: "Bestellt und bezahlt",
      lines: [
        { speaker: "A", de: "Ich habe die Maschine online bestellt. Ist die noch auf Lager?", en: "I've ordered the machine online. Is it still in stock?" },
        { speaker: "B", de: "Ja, die Lieferung kommt Donnerstag. Der Versand ist kostenlos.", en: "Yes, delivery is Thursday. Shipping is free." },
        { speaker: "A", de: "Sehr gut. Kann ich auch in Raten zahlen?", en: "Very good. Can I pay in instalments as well?" },
        { speaker: "B", de: "Können Sie, drei oder sechs Monate. Und Sie können jederzeit kündigen.", en: "You can — three or six months. And you can cancel at any time." },
        { speaker: "A", de: "Perfekt. Ist das Zubehör eigentlich im Preis mit drin?", en: "Perfect. Is the accessory kit actually included in the price?" },
      ],
    },
  ],
  "part456": [
    {
      title: "Kabellos oder nicht",
      lines: [
        { speaker: "A", de: "Ist der Lautsprecher eigentlich kabelgebunden oder kabellos?", en: "Is the speaker actually wired or wireless?" },
        { speaker: "B", de: "Beides — das Kabel ist abnehmbar. Und der Klang ist überraschend gut.", en: "Both — the cable is detachable. And the sound is surprisingly good." },
        { speaker: "A", de: "Ist er mit meinem Handy kompatibel?", en: "Is it compatible with my phone?" },
        { speaker: "B", de: "Ja. In den Einstellungen lässt sich sogar die Helligkeit vom Display anpassen.", en: "Yes. In the settings you can even adjust the display brightness." },
        { speaker: "A", de: "Gut. Dann fehlt mir nur noch das Zubehör dazu.", en: "Good. Then all I'm missing is the accessories to go with it." },
      ],
    },
  ],
  "part605": [
    {
      title: "Der Magnet am Kühlschrank",
      lines: [
        { speaker: "A", de: "Warum hält ein Magnet eigentlich am Kühlschrank, aber nicht an der Tür?", en: "Why does a magnet actually stick to the fridge, but not to the door?" },
        { speaker: "B", de: "Die Tür ist aus Holz. Ein Magnetfeld zieht nur Metall an.", en: "The door is wood. A magnetic field only attracts metal." },
        { speaker: "A", de: "Und warum fällt er nicht einfach runter?", en: "And why doesn't it simply fall down?" },
        { speaker: "B", de: "Die Reibung hält ihn oben. Physik im Alltag.", en: "Friction keeps it up. Physics in everyday life." },
        { speaker: "A", de: "Dann bist du dran mit dem Stromkreis von der Lampe. Erklären, bitte!", en: "Then you're up next with the lamp's circuit. Explain away, please!" },
      ],
    },
  ],
  "part606": [
    {
      title: "Die Sicherung ist raus",
      lines: [
        { speaker: "A", de: "Schon wieder alles dunkel! Die Sicherung ist raus.", en: "Everything's gone dark again! The fuse has tripped." },
        { speaker: "B", de: "Dann ist zu viel auf einem Stromkreis. Was lief denn alles?", en: "Then there's too much on one circuit. What was running?" },
        { speaker: "A", de: "Waschmaschine, Ofen und der Wasserkocher.", en: "Washing machine, oven and the kettle." },
        { speaker: "B", de: "Na klar. Zu viel Stromstärke, der Widerstand macht das nicht mit.", en: "There you go. Too much current — the resistance can't take it." },
        { speaker: "A", de: "Beim Schalter hat es sogar einen Funken gegeben. Das schaut sich ein Fachmann an.", en: "There was even a spark at the switch. A professional is looking at that." },
      ],
    },
  ],
  "part607": [
    {
      title: "Rost am Fahrrad",
      lines: [
        { speaker: "A", de: "Mein Fahrrad ist voller Rost. Was mache ich dagegen?", en: "My bike is covered in rust. What do I do about it?" },
        { speaker: "B", de: "Der Lack ist ab, und Wasser plus Sauerstoff macht den Rest.", en: "The paint's come off, and water plus oxygen does the rest." },
        { speaker: "A", de: "Hilft die Flüssigkeit hier? Auf der Flasche steht was von Säure.", en: "Will this liquid help? The bottle says something about acid." },
        { speaker: "B", de: "Ja, aber vorsichtig — die Säure kann auch den Lack ätzen.", en: "Yes, but be careful — the acid can eat into the paint too." },
        { speaker: "A", de: "Dann probiere ich das erst an einer kleinen Stelle am Rahmen aus.", en: "Then I'll try it out on one small spot on the frame first." },
      ],
    },
  ],
  "part608": [
    {
      title: "Die Dokumentation über den Wald",
      lines: [
        { speaker: "A", de: "Die Dokumentation gestern war stark. Es ging um die Nahrungskette im Wald.", en: "That documentary yesterday was great. It was about the food chain in the forest." },
        { speaker: "B", de: "Mit den Pilzen und Bakterien im Boden?", en: "With the fungi and bacteria in the soil?" },
        { speaker: "A", de: "Genau. Ohne die läuft gar nichts, jeder Keim hat seine Aufgabe.", en: "Exactly. Nothing works without them — every germ has its job." },
        { speaker: "B", de: "Und die Photosynthese bringt die Energie für das Ganze.", en: "And photosynthesis provides the energy for the whole thing." },
        { speaker: "A", de: "Am Ende hängt jedes Organ von jedem Blatt ab. Verrückt, oder?", en: "In the end every organ depends on every leaf. Crazy, isn't it?" },
      ],
    },
  ],
  "part609": [
    {
      title: "Fieber messen",
      lines: [
        { speaker: "A", de: "Das Thermometer zeigt 38,5. Stimmt die Skala überhaupt?", en: "The thermometer says 38.5. Is the scale even right?" },
        { speaker: "B", de: "Natürlich. Miss noch mal, vorhin war die Auswertung anders.", en: "Of course. Take it again — the reading was different a moment ago." },
        { speaker: "A", de: "Jetzt 38,7. Die Richtung ist klar, das ist Fieber.", en: "38.7 now. The direction's clear — that's a fever." },
        { speaker: "B", de: "Dann Tee, Bett und morgen der Arzt.", en: "Tea, bed, and the doctor tomorrow then." },
        { speaker: "A", de: "Und ich messe alle zwei Stunden nach, mit System.", en: "And I'll re-check every two hours, methodically." },
      ],
    },
  ],
  "part610": [
    {
      title: "Die Sonnenfinsternis",
      lines: [
        { speaker: "A", de: "Nächsten Monat gibt es eine Sonnenfinsternis, hast du das gelesen?", en: "There's a solar eclipse next month — did you read that?" },
        { speaker: "B", de: "Ja! Und abends soll man sogar einen Kometen sehen können.", en: "Yes! And in the evening you're supposed to be able to see a comet too." },
        { speaker: "A", de: "Dafür fahre ich raus aus der Stadt, weg vom Licht.", en: "For that I'm driving out of town, away from the lights." },
        { speaker: "B", de: "Nimm mich mit. Seit dem Film über die Raumstation will ich mehr davon sehen.", en: "Take me with you. Ever since the film about the space station I've wanted to see more of this." },
        { speaker: "A", de: "Abgemacht. Vielleicht erwischen wir sogar die Galaxie nebenan.", en: "Deal. Maybe we'll even catch the galaxy next door." },
      ],
    },
  ],
  "part611": [
    {
      title: "Einmal übers Deck",
      lines: [
        { speaker: "A", de: "Willkommen an Bord! Ich zeige dir kurz alles.", en: "Welcome aboard! I'll give you the quick tour." },
        { speaker: "B", de: "Gern. Was ist vorne und was ist hinten?", en: "Please. Which end is the front and which is the back?" },
        { speaker: "A", de: "Vorne ist der Bug, hinten das Heck. Und das hier ist das Steuerrad.", en: "The bow's at the front, the stern at the back. And this here is the wheel." },
        { speaker: "B", de: "Und die Seiten? Da gab es doch diese Wörter.", en: "And the sides? There were those words for them." },
        { speaker: "A", de: "Steuerbord rechts, backbord links. Und halt dich an der Reling fest.", en: "Starboard right, port left. And hold on to the railing." },
      ],
    },
  ],
  "part612": [
    {
      title: "Wer ist wer an Bord",
      lines: [
        { speaker: "A", de: "Der Mann am Steuer — ist das der Kapitän?", en: "The man at the wheel — is that the captain?" },
        { speaker: "B", de: "Nein, das ist der Steuermann. Der Kapitän spricht gerade mit dem Lotsen.", en: "No, that's the helmsman. The captain's talking to the pilot right now." },
        { speaker: "A", de: "Wozu braucht ein Schiff hier einen Lotsen?", en: "Why does a ship need a pilot here?" },
        { speaker: "B", de: "Der kennt den Hafen. Ohne ihn fährt die Besatzung nicht rein.", en: "He knows the harbour. The crew won't take her in without him." },
        { speaker: "A", de: "Und der Matrose da vorne macht die Leinen los?", en: "And the sailor up front is casting off the lines?" },
      ],
    },
  ],
  "part613": [
    {
      title: "Anlegen im Hafen",
      lines: [
        { speaker: "A", de: "Wo dürfen wir anlegen? Am Kai ist alles voll.", en: "Where are we allowed to dock? The quay is completely full." },
        { speaker: "B", de: "Der Hafenmeister hat uns die Anlegestelle hinter der Mole gegeben.", en: "The harbourmaster gave us the berth behind the jetty." },
        { speaker: "A", de: "Gut. Trag es ins Logbuch ein, mit Uhrzeit.", en: "Good. Enter it in the logbook, with the time." },
        { speaker: "B", de: "Mache ich. Die Zollkontrolle kommt übrigens um vier an Bord.", en: "Will do. Customs are coming aboard at four, by the way." },
        { speaker: "A", de: "Dann liegt bis dahin alles bereit. Nach der Verladung sind wir fertig.", en: "Then everything will be laid out ready by then. Once the loading's done, we're finished." },
      ],
    },
  ],
  "part614": [
    {
      title: "Ebbe und Flut",
      lines: [
        { speaker: "A", de: "Warum liegt das Boot auf einmal im Sand?", en: "Why is the boat suddenly sitting on the sand?" },
        { speaker: "B", de: "Gezeiten. Bei Ebbe zieht sich das Wasser hier weit zurück.", en: "Tides. At low tide the water pulls a long way back here." },
        { speaker: "A", de: "Und wann kommt es wieder?", en: "And when does it come back?" },
        { speaker: "B", de: "In sechs Stunden. Dann steht sogar die Brandung wieder am Deich.", en: "In six hours. Then even the surf will be back at the sea wall." },
        { speaker: "A", de: "Die Nordsee macht, was sie will. Beeindruckend.", en: "The North Sea does as it pleases. Impressive." },
      ],
    },
  ],
  "part615": [
    {
      title: "Am Fischstand",
      lines: [
        { speaker: "A", de: "Was ist heute frisch?", en: "What's fresh today?" },
        { speaker: "B", de: "Kabeljau und Scholle, heute Morgen gefangen. Die Makrele ist aus dem Rauch.", en: "Cod and plaice, caught this morning. The mackerel is straight from the smoker." },
        { speaker: "A", de: "Dann zwei Stück Kabeljau. Ist jede Fischgräte schon raus?", en: "Two pieces of cod, then. Is every fish bone already out?" },
        { speaker: "B", de: "Bis auf die letzte Fischgräte. Dazu vielleicht Krabben aus der Region?", en: "Down to the last fish bone. Some local shrimp to go with it, maybe?" },
        { speaker: "A", de: "Gern. Aber die Auster hebe ich mir für den Urlaub auf.", en: "Yes, please. But I'm saving the oyster for my holiday." },
      ],
    },
  ],
  "part616": [
    {
      title: "Der erste Tauchgang",
      lines: [
        { speaker: "A", de: "Morgen ist mein erster richtiger Tauchgang. Ich bin nervös.", en: "Tomorrow is my first proper dive. I'm nervous." },
        { speaker: "B", de: "Alles halb so wild. Sitzt der Neoprenanzug?", en: "It's not half as scary as it seems. Does the wetsuit fit?" },
        { speaker: "A", de: "Ja, und die Sauerstoffflasche ist geprüft.", en: "Yes, and the air tank has been checked." },
        { speaker: "B", de: "Dann fehlen nur Flossen und Ruhe. Atmen, langsam schauen, fertig.", en: "Then all you need is fins and calm. Breathe, look around slowly, done." },
        { speaker: "A", de: "Und danach erzähle ich dir, wie die Welt unten aussieht.", en: "And afterwards I'll tell you what the world looks like down there." },
      ],
    },
  ],
  "part617": [
    {
      title: "Die Übung der Seenotrettung",
      lines: [
        { speaker: "A", de: "Was ist da draußen los? Überall Boote!", en: "What's going on out there? Boats everywhere!" },
        { speaker: "B", de: "Eine Übung der Seenotrettung. Die Küstenwache ist auch dabei.", en: "A sea-rescue exercise. The coastguard's taking part too." },
        { speaker: "A", de: "Deshalb der Funkspruch vorhin. Und das Rettungsboot am Strand?", en: "So that's what the radio message earlier was. And the lifeboat on the beach?" },
        { speaker: "B", de: "Gehört dazu. Sogar ein Wrack spielen sie durch, mit allem.", en: "Part of it. They're even running through a wreck scenario, the whole works." },
        { speaker: "A", de: "Gut zu wissen, dass das geübt wird. Ich bleibe trotzdem im Strandkorb.", en: "Good to know they practise it. I'm staying in my beach chair all the same." },
      ],
    },
  ],
  "part618": [
    {
      title: "Wen rufen wir an?",
      lines: [
        { speaker: "A", de: "Das Bad ist fertig geplant. Wen brauchen wir jetzt alles?", en: "The bathroom's all planned. Who do we need now?" },
        { speaker: "B", de: "Zuerst den Installateur für Wasser und Heizung.", en: "First the plumber, for water and heating." },
        { speaker: "A", de: "Dann den Fliesenleger. Und für die neue Tür?", en: "Then the tiler. And for the new door?" },
        { speaker: "B", de: "Den Schreiner. Das Glas oben macht der Glaser gleich mit.", en: "The joiner. The glazier will do the glass panel at the same time." },
        { speaker: "A", de: "Drei Betriebe für ein kleines Bad. Gutes Handwerk hat seinen Preis.", en: "Three firms for one small bathroom. Good craftsmanship has its price." },
      ],
    },
  ],
  "part619": [
    {
      title: "Vom Lehrling zum Meister",
      lines: [
        { speaker: "A", de: "Mein Neffe fängt im August seine Ausbildung an. Drei Jahre!", en: "My nephew starts his apprenticeship in August. Three years!" },
        { speaker: "B", de: "Mit Zwischenprüfung nach dem zweiten Ausbildungsjahr, wie immer.", en: "With the interim exam after the second year, as always." },
        { speaker: "A", de: "Und nach der Abschlussprüfung ist er dann Geselle.", en: "And after the final exam he'll be a journeyman." },
        { speaker: "B", de: "Genau. Der Meisterbrief kommt später, wenn er will.", en: "Exactly. The master's certificate comes later, if he wants it." },
        { speaker: "A", de: "Die Innung hat ihm sogar schon einen Betrieb gezeigt.", en: "The guild has even pointed him to a firm already." },
      ],
    },
  ],
  "part620": [
    {
      title: "Auf der Baustelle nebenan",
      lines: [
        { speaker: "A", de: "Nebenan geht es los! Die Baugrube ist schon fertig.", en: "It's starting next door! The excavation pit is already done." },
        { speaker: "B", de: "Dann kommt jetzt das Fundament. Der Betonmischer steht ja bereit.", en: "Then the foundation's next. The cement mixer's standing ready, after all." },
        { speaker: "A", de: "Der Bauleiter meinte, der Rohbau steht vor dem Winter.", en: "The site manager said the shell will be up before winter." },
        { speaker: "B", de: "Sportlich. Und der Innenausbau?", en: "Ambitious. And the interior fit-out?" },
        { speaker: "A", de: "Im Frühjahr, alles in Trockenbau. Die Baugenehmigung hing übrigens am Bauzaun.", en: "In spring, all drywall. The planning permission was pinned to the site fence, by the way." },
      ],
    },
  ],
  "part621": [
    {
      title: "Ordnung in der Werkstatt",
      lines: [
        { speaker: "A", de: "Hast du die Schraubzwinge gesehen? Ich finde sie nicht.", en: "Have you seen the clamp? I can't find it." },
        { speaker: "B", de: "Neben der Drehbank, unter deinem Overall.", en: "Next to the lathe, under your overalls." },
        { speaker: "A", de: "Danke. Und das Sägeblatt für die Kettensäge?", en: "Thanks. And the blade for the chainsaw?" },
        { speaker: "B", de: "Ist gerade beim Schleifen. Nimm solange Feile und Stemmeisen.", en: "It's off being sharpened. Take the file and the chisel for the time being." },
        { speaker: "A", de: "Gut. Aber zuerst wird der Boden gefegt, die Sägespäne liegen überall.", en: "Fine. But the floor gets swept first — there's sawdust all over." },
      ],
    },
  ],
  "part622": [
    {
      title: "Das fehlende Ersatzteil",
      lines: [
        { speaker: "A", de: "Der Schrank wackelt. Da fehlt eine Schraube mit Unterlegscheibe.", en: "The cupboard wobbles. There's a screw and washer missing." },
        { speaker: "B", de: "Schau in die Kiste — Gewinde in jeder Größe, Niete, Klammern.", en: "Look in the box — threads in every size, rivets, clips." },
        { speaker: "A", de: "Gefunden. Und die Leiste hier? Die Maserung passt gar nicht zum Rest.", en: "Found one. And this strip here? The grain doesn't match the rest at all." },
        { speaker: "B", de: "Das ist Furnier auf Spanplatte, kein echtes Holz.", en: "That's veneer on chipboard, not solid wood." },
        { speaker: "A", de: "Deshalb! Dann klebe ich sie mit Leim fest und gut ist.", en: "That explains it! Then I'll fix it with wood glue and be done." },
      ],
    },
  ],
  "part623": [
    {
      title: "Erst grundieren, dann streichen",
      lines: [
        { speaker: "A", de: "Wand verputzen, schleifen, streichen — richtig?", en: "Plaster the wall, sand it, paint it — right?" },
        { speaker: "B", de: "Fast. Nach dem Verputzen erst grundieren, sonst hält die Farbe nicht.", en: "Almost. After plastering, prime first — otherwise the paint won't hold." },
        { speaker: "A", de: "Und das Regal? Zuschneiden und anschrauben?", en: "And the shelf? Cut to size and screw it on?" },
        { speaker: "B", de: "Erst anzeichnen, dann zuschneiden, dann verschrauben. Und alles festziehen.", en: "Mark it out first, then cut, then bolt it together. And tighten everything." },
        { speaker: "A", de: "Verstanden. Reparieren kann jeder — montieren ist eine Kunst.", en: "Understood. Anyone can repair — fitting is an art." },
      ],
    },
  ],
  "part624": [
    {
      title: "Der Kostenvoranschlag",
      lines: [
        { speaker: "A", de: "Der Handwerker war da. Hier ist der Kostenvoranschlag.", en: "The tradesman came by. Here's the estimate." },
        { speaker: "B", de: "Materialkosten, Stundenlohn ... und was ist diese Pauschale?", en: "Cost of materials, hourly rate ... and what's this flat rate?" },
        { speaker: "A", de: "Anfahrt und Kleinkram. Dafür gibt es Skonto, wenn wir schnell zahlen.", en: "Travel and odds and ends. In return there's a discount if we pay quickly." },
        { speaker: "B", de: "Vierzehn Tage Zahlungsziel steht hier. Machen wir.", en: "Fourteen days to pay, it says here. Let's do it." },
        { speaker: "A", de: "Und nach der Abnahme haben wir zwei Jahre Gewährleistung.", en: "And after sign-off we've got two years' warranty." },
      ],
    },
  ],
  "part625": [
    {
      title: "Am Einstieg vom Klettersteig",
      lines: [
        { speaker: "A", de: "Sitzt dein Klettergurt? Ich prüfe noch mal jeden Karabiner.", en: "Is your harness on right? I'm double-checking every carabiner." },
        { speaker: "B", de: "Alles fest. Wie lang ist der Klettersteig?", en: "All secure. How long is the via ferrata?" },
        { speaker: "A", de: "Zwei Stunden bis zum Grat, mit einer Stelle unterm Überhang.", en: "Two hours to the ridge, with one section under the overhang." },
        { speaker: "B", de: "Und da oben? Trittsicherheit reicht, oder brauche ich mehr?", en: "And up top? Is sure-footedness enough, or do I need more?" },
        { speaker: "A", de: "Reicht. Nur bei Regen wird der Fels ernst. Los jetzt.", en: "It's enough. Only in rain does the rock get serious. Off we go." },
      ],
    },
  ],
  "part626": [
    {
      title: "Der Wegweiser fehlt",
      lines: [
        { speaker: "A", de: "Hier stimmt was nicht. Auf der Wanderkarte ist ein Wegweiser.", en: "Something's off here. There's a signpost on the walking map." },
        { speaker: "B", de: "Der liegt da drüben im Gras. Der Wind war wohl zu stark.", en: "It's lying over there in the grass. The wind must have been too strong." },
        { speaker: "A", de: "Super. Also: Rundweg links oder Aussichtspunkt rechts?", en: "Great. So: circular route to the left or viewpoint to the right?" },
        { speaker: "B", de: "Rechts, über die Serpentinen. Der Wanderführer schwärmt davon.", en: "Right, up the hairpins. The guidebook raves about it." },
        { speaker: "A", de: "Gut. An der Baumgrenze machen wir Rast.", en: "Fine. We'll rest at the tree line." },
      ],
    },
  ],
  "part627": [
    {
      title: "Feuer im Regen",
      lines: [
        { speaker: "A", de: "Alles ist klamm. Kriegen wir das Lagerfeuer trotzdem an?", en: "Everything's damp. Can we still get the campfire going?" },
        { speaker: "B", de: "Mit dem trockenen Zunder aus der Dose, ja. Brennholz liegt unter der Plane.", en: "With the dry tinder from the tin, yes. The firewood's under the tarp." },
        { speaker: "A", de: "Gut mitgedacht. Und der Windschutz steht auch schon.", en: "Good thinking. And the windbreak's already up." },
        { speaker: "B", de: "Dann Wasser in den Topf. Der Proviant reicht noch für zwei Tage.", en: "Then water in the pot. The provisions will last another two days." },
        { speaker: "A", de: "Perfekt. Morgen füllen wir die Trinkflaschen an der Quelle auf.", en: "Perfect. Tomorrow we'll fill the water bottles up at the spring." },
      ],
    },
  ],
  "part628": [
    {
      title: "Rast auf der Alm",
      lines: [
        { speaker: "A", de: "Endlich oben. Die Almwiese ist ja schöner als jedes Foto.", en: "Top at last. The alpine meadow is lovelier than any photo." },
        { speaker: "B", de: "Und die Sennhütte hat offen! Käse und Milch, direkt von hier.", en: "And the dairy hut is open! Cheese and milk, straight from here." },
        { speaker: "A", de: "Danach der Abstieg durch den Nadelwald, am Wildbach entlang.", en: "Then the descent through the pine forest, along the mountain torrent." },
        { speaker: "B", de: "Im Naturschutzgebiet bleiben wir auf dem Weg, klar.", en: "We'll stay on the path in the nature reserve, obviously." },
        { speaker: "A", de: "Klar. Und unten im Weiher kühlen wir die Füße.", en: "Obviously. And down at the pond we'll cool our feet." },
      ],
    },
  ],
  "part629": [
    {
      title: "Was da geflogen ist",
      lines: [
        { speaker: "A", de: "Siehst du den großen Vogel über dem Hang? Ein Adler?", en: "Do you see the big bird over the slope? An eagle?" },
        { speaker: "B", de: "Ein Bussard, glaube ich. Und hör mal: ein Specht.", en: "A buzzard, I think. And listen: a woodpecker." },
        { speaker: "A", de: "Vorhin stand ein Murmeltier direkt am Weg.", en: "Earlier a marmot was standing right by the path." },
        { speaker: "B", de: "Besser als eine Kreuzotter. Auf die Steine trete ich vorsichtig.", en: "Better than an adder. I'm stepping carefully on the stones." },
        { speaker: "A", de: "Gute Idee. Die Gams da oben interessiert das alles gar nicht.", en: "Good idea. The chamois up there couldn't care less about any of it." },
      ],
    },
  ],
  "part630": [
    {
      title: "Wetterumschwung am Berg",
      lines: [
        { speaker: "A", de: "Der Aufwind wird kalt, und da hinten wird es schwarz.", en: "The updraught's turning cold, and it's going black over there." },
        { speaker: "B", de: "Dann runter. Bei Gewitter hat man auf dem Grat nichts verloren.", en: "Down we go, then. In a thunderstorm you've no business being on the ridge." },
        { speaker: "A", de: "Die Hütte meldet Graupel und Böen. Lawinengefahr ist zum Glück keine.", en: "The hut is reporting soft hail and gusts. Thankfully no avalanche risk." },
        { speaker: "B", de: "Trotzdem: Steinschlag nach dem Regen. Helm auf.", en: "All the same: rockfall after rain. Helmet on." },
        { speaker: "A", de: "Und falls was passiert, hat die Bergrettung heute sowieso viel zu tun.", en: "And if anything happens, mountain rescue has plenty on today anyway." },
      ],
    },
  ],
  "part631": [
    {
      title: "Das Paket nach Polen",
      lines: [
        { speaker: "A", de: "Guten Tag, dieses Paket soll nach Polen. Was kostet das Porto?", en: "Hello, this parcel is going to Poland. What's the postage?" },
        { speaker: "B", de: "Neun Euro, mit Sendungsverfolgung. Als Warensendung ginge es billiger.", en: "Nine euros, with tracking. As a goods shipment it would be cheaper." },
        { speaker: "A", de: "Nein, es soll schnell gehen. Wie viele Zustellversuche gibt es?", en: "No, it needs to be quick. How many delivery attempts are there?" },
        { speaker: "B", de: "Zwei. Danach liegt es in der Filiale zur Abholung.", en: "Two. After that it waits at the branch for collection." },
        { speaker: "A", de: "Gut. Und eine Empfangsbestätigung hätte ich gern dazu.", en: "Good. And I'd like proof of receipt with that, please." },
      ],
    },
  ],
  "part632": [
    {
      title: "Gut verpackt",
      lines: [
        { speaker: "A", de: "Reicht die Versandtasche, oder brauche ich einen Karton?", en: "Will the mailing bag do, or do I need a box?" },
        { speaker: "B", de: "Für Gläser? Karton, Wellpappe und ordentlich Füllmaterial.", en: "For glasses? A box, corrugated cardboard and plenty of padding." },
        { speaker: "A", de: "Und außen der Aufkleber mit dem Barcode?", en: "And the sticker with the barcode on the outside?" },
        { speaker: "B", de: "Genau, gut sichtbar. Sonst zahlt bei einem Transportschaden keiner.", en: "Exactly, clearly visible. Otherwise nobody pays out if there's transit damage." },
        { speaker: "A", de: "Verstanden. Der Versicherungswert steht ja auf dem Lieferschein.", en: "Understood. The insured value is on the delivery note anyway." },
      ],
    },
  ],
  "part633": [
    {
      title: "Die Rücksendung",
      lines: [
        { speaker: "A", de: "Die Jacke ist zu klein. Wie läuft die Rücksendung?", en: "The jacket's too small. How does the return work?" },
        { speaker: "B", de: "Rücksendeetikett ausdrucken, drauf, abgeben. Das Rückgaberecht gilt vierzehn Tage.", en: "Print the return label, stick it on, drop it off. The right of return runs fourteen days." },
        { speaker: "A", de: "Und wann kommt das Geld?", en: "And when does the money come back?" },
        { speaker: "B", de: "Nach der Ankunft im Lager, meist in einer Woche.", en: "Once it arrives back at the warehouse — usually within a week." },
        { speaker: "A", de: "Okay. Nächstes Mal bestelle ich zwei Größen und schicke eine zurück.", en: "Okay. Next time I'll order two sizes and send one back." },
      ],
    },
  ],
  "part634": [
    {
      title: "Im Versandlager",
      lines: [
        { speaker: "A", de: "Erster Tag im Lager? Ich zeige dir alles.", en: "First day in the warehouse? I'll show you around." },
        { speaker: "B", de: "Gern. Was fahren die Gabelstapler da hin und her?", en: "Please. What are the forklifts shuttling back and forth?" },
        { speaker: "A", de: "Paletten für den Großhandel. Der Einzelhandel läuft über das Band da.", en: "Pallets for wholesale. Retail runs over that belt there." },
        { speaker: "B", de: "Und wann ist Inventur?", en: "And when is stocktaking?" },
        { speaker: "A", de: "Ende des Jahres. Dann zählt jeder hier jeden Lagerbestand zweimal.", en: "End of the year. Then everyone here counts every stock item twice." },
      ],
    },
  ],
  "part635": [
    {
      title: "An der Zollkontrolle",
      lines: [
        { speaker: "A", de: "Ihr Paket kommt von außerhalb der EU. Das ist eine Einfuhr.", en: "Your parcel comes from outside the EU. That counts as an import." },
        { speaker: "B", de: "Muss ich dann Zollgebühren zahlen?", en: "Do I have to pay customs charges, then?" },
        { speaker: "A", de: "Kommt auf den Warenwert an. Die Zollinhaltserklärung fehlt leider.", en: "Depends on the value of the goods. The customs contents form is missing, unfortunately." },
        { speaker: "B", de: "Die hat der Absender vergessen? Großartig.", en: "The sender forgot it? Wonderful." },
        { speaker: "A", de: "Passiert oft. Er kann sie nachreichen, dann geht alles seinen Weg.", en: "Happens a lot. He can hand it in after the fact, and everything takes its course." },
      ],
    },
  ],
  "part636": [
    {
      title: "Welche Versicherung braucht man",
      lines: [
        { speaker: "A", de: "Welche Versicherungen brauche ich wirklich? Ehrlich jetzt.", en: "Which insurance policies do I really need? Honestly now." },
        { speaker: "B", de: "Haftpflicht zuerst. Die zahlt, wenn du anderen etwas kaputt machst.", en: "Personal liability first. That pays when you break other people's things." },
        { speaker: "A", de: "Und Hausrat?", en: "And contents insurance?" },
        { speaker: "B", de: "Sinnvoll, sobald dir deine Sachen weh tun würden. Der Beitrag ist klein.", en: "Worth it as soon as losing your things would hurt. The premium is small." },
        { speaker: "A", de: "Gut. Den Rechtsschutz hebe ich mir für später auf.", en: "Fine. I'll save legal cover for later." },
      ],
    },
  ],
  "part637": [
    {
      title: "Die Mahnung",
      lines: [
        { speaker: "A", de: "Hier ist eine Mahnung! Dabei war die Überweisung längst raus.", en: "There's a payment reminder here! And the transfer went out ages ago." },
        { speaker: "B", de: "Steht die Rechnungsnummer im Verwendungszweck?", en: "Is the invoice number in the payment reference?" },
        { speaker: "A", de: "Ähm ... nein. Nur mein Name.", en: "Um ... no. Just my name." },
        { speaker: "B", de: "Deshalb. Ohne Nummer findet die Buchhaltung den Zahlungseingang nicht.", en: "That's why. Without the number, accounts can't find the incoming payment." },
        { speaker: "A", de: "Dann rufe ich an und schicke den Beleg mit. Danke!", en: "Then I'll call and send the receipt along. Thanks!" },
      ],
    },
  ],
  "part638": [
    {
      title: "Seit gestern Schüttelfrost",
      lines: [
        { speaker: "A", de: "Was fehlt Ihnen denn?", en: "So what seems to be the trouble?" },
        { speaker: "B", de: "Seit gestern Schüttelfrost, Herzrasen und ein Kribbeln in den Händen.", en: "Since yesterday: chills, a racing heart and tingling in my hands." },
        { speaker: "A", de: "Schlafen Sie zurzeit schlecht?", en: "Are you sleeping badly at the moment?" },
        { speaker: "B", de: "Kaum. Die Schlafstörung habe ich schon länger.", en: "Hardly at all. The sleep problems have been going on a while." },
        { speaker: "A", de: "Dann schauen wir uns das gründlich an. Erst mal Blutdruck.", en: "Then we'll look at this properly. Blood pressure first." },
      ],
    },
  ],
  "part639": [
    {
      title: "Die Frage nach dem Impfpass",
      lines: [
        { speaker: "A", de: "Wir machen eine große Reise. Welche Impfungen brauchen wir?", en: "We're going on a big trip. Which vaccinations do we need?" },
        { speaker: "B", de: "Zeigen Sie mal Ihren Impfpass. Tetanus ist Pflicht, das zuerst.", en: "Show me your vaccination record. Tetanus is a must — that first." },
        { speaker: "A", de: "Und gegen Tollwut?", en: "And against rabies?" },
        { speaker: "B", de: "Nur bei viel Kontakt mit Tieren. Malaria ist dort das größere Thema.", en: "Only if you'll have a lot of animal contact. Malaria is the bigger issue there." },
        { speaker: "A", de: "Verstanden. Dann planen wir die Termine gleich durch.", en: "Understood. Then let's plan out the appointments right away." },
      ],
    },
  ],
  "part640": [
    {
      title: "Die verspannte Schulter",
      lines: [
        { speaker: "A", de: "Es zieht vom Nacken bis unters Schulterblatt.", en: "It pulls from my neck right down under my shoulder blade." },
        { speaker: "B", de: "Der Muskel ist hart. Das Gewebe hier ist deutlich verspannt.", en: "The muscle is hard. The tissue here is clearly knotted up." },
        { speaker: "A", de: "Ist das was mit einem Nerv?", en: "Is it something to do with a nerve?" },
        { speaker: "B", de: "Eher nicht. Das Immunsystem hat damit nichts zu tun, die Haltung schon.", en: "Probably not. Your immune system has nothing to do with it — your posture does." },
        { speaker: "A", de: "Also mehr Bewegung. Und weniger Schreibtisch.", en: "So more movement. And less desk." },
      ],
    },
  ],
  "part641": [
    {
      title: "Die Blutwerte sind da",
      lines: [
        { speaker: "A", de: "Ihre Laborwerte sind da. Der Blutzucker ist in Ordnung.", en: "Your lab results are in. Blood sugar is fine." },
        { speaker: "B", de: "Und das Cholesterin?", en: "And the cholesterol?" },
        { speaker: "A", de: "Leicht erhöht. Nichts, was Sport und Küche nicht regeln.", en: "Slightly raised. Nothing that exercise and cooking won't fix." },
        { speaker: "B", de: "Puh. Und der Ultraschall von letzter Woche?", en: "Phew. And the ultrasound from last week?" },
        { speaker: "A", de: "Ohne Befund. Die Früherkennung machen wir trotzdem jedes Jahr.", en: "All clear. We'll still do the screening every year." },
      ],
    },
  ],
  "part642": [
    {
      title: "Wer hilft wobei",
      lines: [
        { speaker: "A", de: "Mein Rücken, mein Knie, meine Stimme — wohin zuerst?", en: "My back, my knee, my voice — where do I go first?" },
        { speaker: "B", de: "Für Rücken und Knie zum Physiotherapeuten.", en: "For the back and knee, to the physiotherapist." },
        { speaker: "A", de: "Und für die Stimme?", en: "And for the voice?" },
        { speaker: "B", de: "Zum Logopäden. Und der Apotheker hat sicher noch Tee für dich.", en: "To the speech therapist. And the pharmacist will have some tea for you, no doubt." },
        { speaker: "A", de: "Drei Profis für einen Menschen. Na dann, der Reihe nach.", en: "Three professionals for one person. Right then — one at a time." },
      ],
    },
  ],
  "part643": [
    {
      title: "Die Rettungsgasse",
      lines: [
        { speaker: "A", de: "Hinter uns: Blaulicht und Martinshorn. Alle fahren zur Seite.", en: "Behind us: blue lights and a siren. Everyone's pulling over." },
        { speaker: "B", de: "Rettungsgasse! Du nach rechts, die linke Spur nach links.", en: "Emergency corridor! You go right, the left lane goes left." },
        { speaker: "A", de: "Geschafft. Der Krankenwagen ist durch.", en: "Done. The ambulance is through." },
        { speaker: "B", de: "Bei einem Notfall zählt jede Minute bis zur Notaufnahme.", en: "In an emergency, every minute to A&E counts." },
        { speaker: "A", de: "Genau deshalb übt man das. Gut gemacht, alle hier.", en: "That's exactly why people practise it. Well done, everyone here." },
      ],
    },
  ],
  "part644": [
    {
      title: "Der Treppenlift für Oma",
      lines: [
        { speaker: "A", de: "Oma kommt nach der Operation nach Hause. Was braucht sie?", en: "Grandma's coming home after the operation. What does she need?" },
        { speaker: "B", de: "Einen Treppenlift für den ersten Stock. Der Antrag läuft schon.", en: "A stairlift for the first floor. The application's already in." },
        { speaker: "A", de: "Und die Wundnaht? Wer schaut danach?", en: "And the stitches? Who's keeping an eye on those?" },
        { speaker: "B", de: "Der Pflegedienst, zweimal die Woche. Die Gehhilfe steht auch bereit.", en: "The care service, twice a week. The walking aid is ready and waiting too." },
        { speaker: "A", de: "Dann fehlt nur noch ihre neue Brille — und ihr Sessel am Fenster.", en: "Then all that's missing is her new glasses — and her armchair by the window." },
      ],
    },
  ],
  "part645": [
    {
      title: "Erst die Packungsbeilage",
      lines: [
        { speaker: "A", de: "Diese Augentropfen — wie oft darf ich die nehmen?", en: "These eye drops — how often can I use them?" },
        { speaker: "B", de: "Steht in der Packungsbeilage: dreimal täglich, ein Tropfen.", en: "It's in the leaflet: three times a day, one drop." },
        { speaker: "A", de: "Und wenn ich mal einen vergesse?", en: "And if I forget one?" },
        { speaker: "B", de: "Dann einfach normal weiter. Bloß nicht doppelt — eine Überdosis hilft niemandem.", en: "Then just carry on as normal. Only don't double up — an overdose helps nobody." },
        { speaker: "A", de: "Verstanden. Die Rezeptgebühr zahle ich vorne an der Kasse?", en: "Understood. Do I pay the prescription charge at the till up front?" },
      ],
    },
  ],
  "part646": [
    {
      title: "Langsam wieder aufbauen",
      lines: [
        { speaker: "A", de: "Der Gips ist ab! Und jetzt?", en: "The cast is off! Now what?" },
        { speaker: "B", de: "Jetzt kommt die Genesung: erst Dehnung, dann Muskelaufbau.", en: "Now comes the recovery: stretching first, then building the muscle back." },
        { speaker: "A", de: "Ich gehe noch ziemlich langsam und schief.", en: "I'm still walking pretty slowly and crookedly." },
        { speaker: "B", de: "Normal. Die Beweglichkeit kommt in Wochen zurück, nicht in Tagen.", en: "Normal. The mobility comes back in weeks, not days." },
        { speaker: "A", de: "Und bis dahin Schonkost fürs Bein: Spazieren statt Fußball.", en: "And till then it's the gentle diet for the leg: walks instead of football." },
      ],
    },
  ],
  "part647": [
    {
      title: "Gut geplant für Opa",
      lines: [
        { speaker: "A", de: "Opa stürzt in letzter Zeit öfter. Ich mache mir Sorgen.", en: "Grandpa's been falling more often lately. I'm worried." },
        { speaker: "B", de: "Die Sturzgefahr in der Wohnung lässt sich senken: mehr Licht, Teppiche weg.", en: "The risk of falls in the flat can be lowered: more light, rugs out." },
        { speaker: "A", de: "Und wenn das nicht mehr reicht? Seniorenheim?", en: "And if that's no longer enough? A retirement home?" },
        { speaker: "B", de: "Erst mal Betreuung zu Hause. Und die Vorsorgevollmacht sollte er jetzt regeln.", en: "Home care first. And he should sort out the lasting power of attorney now." },
        { speaker: "A", de: "Stimmt. Das Gespräch führen wir am Sonntag, in Ruhe.", en: "True. We'll have that conversation on Sunday, calmly." },
      ],
    },
  ],
  "part648": [
    {
      title: "Kasse oder privat",
      lines: [
        { speaker: "A", de: "Zwei Wochen auf einen Termin! Als Privatpatient ginge es morgen.", en: "Two weeks for an appointment! As a private patient it would be tomorrow." },
        { speaker: "B", de: "Als Kassenpatient zahlst du dafür keinen Eigenanteil für das Meiste.", en: "As a public patient you pay no excess for most things, mind." },
        { speaker: "A", de: "Und diese Wahlleistungen im Krankenhaus, lohnt sich das?", en: "And those optional extras in hospital — are they worth it?" },
        { speaker: "B", de: "Kommt drauf an. Das Zweibettzimmer ja, der Rest selten.", en: "Depends. The two-bed room yes, the rest rarely." },
        { speaker: "A", de: "Na gut. Hauptsache, jemand hat Nachtdienst, wenn es ernst wird.", en: "Fair enough. The main thing is somebody's on night duty when it gets serious." },
      ],
    },
  ],
  "part545": [
    {
      title: "Der neue Mehrspielermodus",
      lines: [
        { speaker: "A", de: "Hast du das Update gesehen? Der Mehrspielermodus ist endlich da.", en: "Have you seen the update? Multiplayer mode is finally here." },
        { speaker: "B", de: "Ja! Das Kampfsystem fühlt sich auf der Konsole viel besser an.", en: "Yes! The combat system feels much better on the console." },
        { speaker: "A", de: "Bei mir hakt noch das Startprogramm, jedes Mal eine Korrektur.", en: "My launcher is still glitchy — a fix every single time." },
        { speaker: "B", de: "Installier das Plug-in neu, danach lief es bei mir.", en: "Reinstall the plug-in — it ran fine for me after that." },
        { speaker: "A", de: "Mach ich heute Abend. Der Aufschwung kam für das Spiel genau rechtzeitig.", en: "I'll do it tonight. The upturn came just in time for that game." },
      ],
    },
  ],
  "part546": [
    {
      title: "Die Landkarte der Großtante",
      lines: [
        { speaker: "A", de: "Schau, was ich beim Aufräumen gefunden habe: eine alte Landkarte.", en: "Look what I found while tidying up: an old map." },
        { speaker: "B", de: "Von deiner Großtante? Der Anblick ist wirklich etwas Besonderes.", en: "From your great-aunt? It's really quite a sight." },
        { speaker: "A", de: "Mein Kumpel meint, so etwas gehört mit Rahmen an die Wand.", en: "My mate says something like this belongs on the wall in a frame." },
        { speaker: "B", de: "Recht hat er. Besser als jedes Diagramm im Arbeitszimmer.", en: "He's right. Better than any chart in the study." },
        { speaker: "A", de: "Dann hängt sie ab morgen über dem Tisch — beim Abendessen schauen alle drauf.", en: "Then from tomorrow it hangs over the table — everyone can look at it during dinner." },
      ],
    },
  ],
  "part547": [
    {
      title: "Die Eilmeldung",
      lines: [
        { speaker: "A", de: "Eilmeldung auf dem Handy: eine Festnahme in der Innenstadt.", en: "Breaking news on my phone: an arrest in the city centre." },
        { speaker: "B", de: "Schon wieder? Gestern war es noch der Börsengang, heute ein Verdächtiger.", en: "Again? Yesterday it was the stock market launch, today a suspect." },
        { speaker: "A", de: "Die Empörung im Netz ist jedenfalls riesig.", en: "The outrage online is enormous, in any case." },
        { speaker: "B", de: "Wie immer. Ich warte lieber auf die Ankündigung der Polizei.", en: "As always. I'd rather wait for the police announcement." },
        { speaker: "A", de: "Vernünftig. Erst die Fakten, dann die Meinung.", en: "Sensible. Facts first, opinion after." },
      ],
    },
  ],
  "part548": [
    {
      title: "Was für ein Blödsinn",
      lines: [
        { speaker: "A", de: "Mein Nachbar glaubt an eine große Verschwörung. Wegen der Lampen an der Straße.", en: "My neighbour believes in a grand conspiracy. About the lamps along the street." },
        { speaker: "B", de: "Was für ein Blödsinn. Und woher hat er das?", en: "What nonsense. And where's he got that from?" },
        { speaker: "A", de: "Aus dem Internet. Er will jetzt sogar als Demonstrant auf die Straße.", en: "The internet. Now he even wants to take to the streets as a protester." },
        { speaker: "B", de: "Dann leih ihm lieber ein gutes Lehrbuch.", en: "Better to lend him a good textbook instead." },
        { speaker: "A", de: "Mache ich. Das kann er dann gern durchsuchen — Seite für Seite.", en: "I will. He's welcome to comb through that — page by page." },
      ],
    },
  ],
  "part549": [
    {
      title: "Umbenennen und aufräumen",
      lines: [
        { speaker: "A", de: "Tausend Dateien, alle heißen Dokument eins bis Dokument tausend.", en: "A thousand files, all named Document One through Document Thousand." },
        { speaker: "B", de: "Dann bitte alle umbenennen. Und die Hälfte fliegt raus.", en: "Then rename them all, please. And half of them are going out." },
        { speaker: "A", de: "Ich horte so etwas eben. Man weiß ja nie.", en: "I just hoard this stuff. You never know." },
        { speaker: "B", de: "Erwäge es wenigstens. Halbieren wäre schon fantastisch.", en: "At least consider it. Halving it would already be fantastic." },
        { speaker: "A", de: "Na gut. Aber die Fotos bleiben — unbedingt alle.", en: "Fine. But the photos stay — every last one, no question." },
      ],
    },
  ],
  "part586": [
    {
      title: "Wohin mit dem Sofa",
      lines: [
        { speaker: "A", de: "Das neue Sofa kommt Freitag. Nur: wie kommt es in die dritte Etage?", en: "The new sofa arrives Friday. Just one thing: how does it get to the third floor?" },
        { speaker: "B", de: "Der Aufzug ist zu klein. Bleibt die Treppe.", en: "The lift is too small. That leaves the stairs." },
        { speaker: "A", de: "Durch den Flur passt es, das habe ich gemessen.", en: "It fits through the hallway — I've measured." },
        { speaker: "B", de: "Dann tragen wir es zu viert. Danach gibt es Kaffee aus der neuen Kaffeemaschine.", en: "Then the four of us will carry it. Afterwards there's coffee from the new coffee machine." },
        { speaker: "A", de: "Abgemacht. Und das alte Sofa stellen wir in die Garage.", en: "Deal. And the old sofa goes in the garage." },
      ],
    },
  ],
  "part587": [
    {
      title: "Ohne Ausweis zum Bahnsteig",
      lines: [
        { speaker: "A", de: "Mist, mein Ausweis liegt zu Hause. Nur der Führerschein ist dabei.", en: "Damn, my ID card's at home. I've only got my driving licence on me." },
        { speaker: "B", de: "Für die Fahrkarte reicht der. Welcher Bahnsteig ist es?", en: "That'll do for the ticket. Which platform is it?" },
        { speaker: "A", de: "Sieben, durch die Bahnhofshalle und dann links.", en: "Seven — through the station concourse and then left." },
        { speaker: "B", de: "Gut. Und vom Bahnhof nehmen wir ein Taxi zur Pension.", en: "Good. And from the station we'll take a taxi to the guesthouse." },
        { speaker: "A", de: "Oder den Spaziergang durch die Gasse — die Kurve am Fluss ist schön.", en: "Or the walk through the lane — the bend by the river is lovely." },
      ],
    },
  ],
  "part588": [
    {
      title: "Mehr Pfeffer",
      lines: [
        { speaker: "A", de: "Probier mal die Soße. Fehlt da was?", en: "Try the sauce. Is something missing?" },
        { speaker: "B", de: "Pfeffer. Und ein kleines bisschen Salz.", en: "Pepper. And a tiny bit of salt." },
        { speaker: "A", de: "Der Reis ist fertig, die Nudeln auch. Beides da.", en: "The rice is done, the pasta too. Both ready." },
        { speaker: "B", de: "Dann ist die Mahlzeit komplett. Käse noch drüber?", en: "Then the meal is complete. Cheese on top?" },
        { speaker: "A", de: "Klar. Und danach Schokolade — der Hunger hat Platz für beides.", en: "Of course. And chocolate after — my appetite has room for both." },
      ],
    },
  ],
  "part589": [
    {
      title: "Die neue Trainerin",
      lines: [
        { speaker: "A", de: "Habt ihr eine neue Trainerin?", en: "Have you got a new coach?" },
        { speaker: "B", de: "Ja, seit März. Vorher war sie selbst Spielerin, ziemlich gut sogar.", en: "Yes, since March. She used to play herself — pretty well, too." },
        { speaker: "A", de: "Und wie findet die Mannschaft sie?", en: "And what does the team make of her?" },
        { speaker: "B", de: "Alle sind begeistert. Sogar die Chefin vom Verein.", en: "Everyone's delighted. Even the club's boss." },
        { speaker: "A", de: "Dann schaue ich Samstag zu — mit Großvater und Großmutter.", en: "Then I'll watch on Saturday — with grandad and grandma." },
      ],
    },
  ],
  "part590": [
    {
      title: "Das Turnier am See",
      lines: [
        { speaker: "A", de: "Samstag ist das Turnier: Volleyball, Badminton und Tennis.", en: "Saturday is the tournament: volleyball, badminton and tennis." },
        { speaker: "B", de: "Ich bringe den Schläger mit. Und danach?", en: "I'll bring my racket. And afterwards?" },
        { speaker: "A", de: "Picknick am See, mit Grill und Sonnenschirm.", en: "A picnic by the lake, with a barbecue and a parasol." },
        { speaker: "B", de: "Perfekt. Zelt und Schlafsack auch, oder wird das zu viel?", en: "Perfect. Tent and sleeping bag too, or is that overdoing it?" },
        { speaker: "A", de: "Bring sie mit. Aus einem Turnier wird bei uns gern Camping.", en: "Bring them. With us, a tournament has a way of turning into camping." },
      ],
    },
  ],
  "part591": [
    {
      title: "Das Geräusch im Scanner",
      lines: [
        { speaker: "A", de: "Der Scanner macht so ein komisches Geräusch beim Upload.", en: "The scanner makes such a strange noise during the upload." },
        { speaker: "B", de: "Solange keine Flamme rauskommt, ist alles gut.", en: "As long as no flame comes out of it, we're fine." },
        { speaker: "A", de: "Sehr witzig. Es ist unsere einzige Hardware für die Reservierung morgen.", en: "Very funny. It's our only hardware for tomorrow's reservation." },
        { speaker: "B", de: "Dann behandeln wir es wie einen Notfall: ausschalten, abkühlen, neu starten.", en: "Then we'll treat it like an emergency: switch off, cool down, restart." },
        { speaker: "A", de: "Und wenn das nichts hilft, hilft Konzentration — oder ein neues Gerät.", en: "And if that doesn't work, concentration will — or a new machine." },
      ],
    },
  ],
  "part585": [
    {
      title: "Der, die oder das",
      lines: [
        { speaker: "A", de: "Hilf mir mal: Heißt es der, die oder das Wörterbuch?", en: "Help me out: is it der, die or das Wörterbuch?" },
        { speaker: "B", de: "Das Wörterbuch. Nomen lernst du am besten gleich mit Artikel.", en: "Das Wörterbuch. Nouns are best learned with their article from the start." },
        { speaker: "A", de: "Und warum wird aus der Tisch auf einmal den Tisch?", en: "And why does der Tisch suddenly turn into den Tisch?" },
        { speaker: "B", de: "Akkusativ. Der Nominativ nennt, wer handelt, der Akkusativ, wen es trifft.", en: "Accusative. The nominative names who acts, the accusative whom it affects." },
        { speaker: "A", de: "Dann fehlen mir nur noch Dativ und Genitiv.", en: "Then I've only got the dative and the genitive to go." },
        { speaker: "B", de: "Ein Fall pro Woche, und im Plural sind sowieso alle gleich nett.", en: "One case a week — and in the plural they're all equally kind anyway." },
      ],
    },
  ],
  "part592": [
    {
      title: "Erst entpacken, dann klicken",
      lines: [
        { speaker: "A", de: "Ich habe die Datei doch runtergeladen. Warum geht nichts?", en: "I did download the file. Why is nothing happening?" },
        { speaker: "B", de: "Du musst sie erst entpacken. Dann das Programm anklicken.", en: "You have to unzip it first. Then click the program." },
        { speaker: "A", de: "Ah. Und dann konfigurieren, oder?", en: "Ah. And then configure it, right?" },
        { speaker: "B", de: "Genau, einmal durchklicken, am Ende exportieren. Fertig.", en: "Exactly — click through once, export at the end. Done." },
        { speaker: "A", de: "Danach logge ich mich aus und schalte den Rechner aus. Versprochen.", en: "After that I'll log out and switch the computer off. Promise." },
      ],
    },
  ],
  "part593": [
    {
      title: "Selbst gemacht",
      lines: [
        { speaker: "A", de: "Der Stuhl wackelt nicht mehr! Was hast du gemacht?", en: "The chair's stopped wobbling! What did you do?" },
        { speaker: "B", de: "Neu verleimt, geschliffen und poliert. Dann noch lackiert.", en: "Re-glued, sanded and polished. Then varnished on top." },
        { speaker: "A", de: "Das sieht besser aus als neu. Und der Korb da?", en: "It looks better than new. And that basket there?" },
        { speaker: "B", de: "Selbst gemacht — gewebt, aus alten Resten.", en: "Made it myself — woven, from old scraps." },
        { speaker: "A", de: "Nächstes Wochenende bringst du mir das bei. Erst häkeln, dann weben.", en: "Next weekend you're teaching me. Crochet first, then weaving." },
      ],
    },
  ],
  "part594": [
    {
      title: "Das Zimmer neu gedacht",
      lines: [
        { speaker: "A", de: "Wir renovieren im Herbst. Erst streichen, dann neu möblieren.", en: "We're renovating in autumn. Paint first, then refurnish." },
        { speaker: "B", de: "Und die dunkle Ecke? Da bekommt man doch nie Licht rein.", en: "And the dark corner? You never get any light in there." },
        { speaker: "A", de: "Mit einem Spiegel vergrößern wir sie optisch. Alter Trick.", en: "We'll enlarge it visually with a mirror. Old trick." },
        { speaker: "B", de: "Gut. Beim Tragen musst du dann aber in die Knie gehen, nicht in den Rücken.", en: "Fine. But when carrying, bend at the knees, not with your back." },
        { speaker: "A", de: "Keine Sorge. Und abends wird verriegelt, die Leiter bleibt draußen.", en: "Don't worry. And at night we lock up — the ladder stays outside." },
      ],
    },
  ],
  "part595": [
    {
      title: "Säen, gießen, warten",
      lines: [
        { speaker: "A", de: "Ich habe im März gesät, und jetzt blüht das ganze Beet!", en: "I sowed in March, and now the whole bed is in bloom!" },
        { speaker: "B", de: "Schön! Hast du gedüngt?", en: "Lovely! Did you fertilise?" },
        { speaker: "A", de: "Nur mit Kompost. Recyceln für den Garten, sozusagen.", en: "Only with compost. Recycling for the garden, so to speak." },
        { speaker: "B", de: "Und die Kinder? Helfen die mit?", en: "And the kids? Do they help?" },
        { speaker: "A", de: "Sie buddeln vor allem. Aber pflücken können sie schon sehr gut.", en: "Mostly they dig. But they're already very good at picking." },
      ],
    },
  ],
  "part596": [
    {
      title: "Staunen und begreifen",
      lines: [
        { speaker: "A", de: "Ich habe gestern eine Stunde nur den Sternen zugeschaut. Ich staune immer noch.", en: "Yesterday I just watched the stars for an hour. I'm still in awe." },
        { speaker: "B", de: "Das kann ich gut verstehen. Mich entspannt das auch.", en: "I can well understand that. It relaxes me too." },
        { speaker: "A", de: "Und je mehr ich begreife, desto mehr bewundere ich das alles.", en: "And the more I grasp, the more I admire it all." },
        { speaker: "B", de: "So soll Lernen sein. Besser als sich zu langweilen.", en: "That's how learning should be. Better than being bored." },
        { speaker: "A", de: "Eben. Nächste Woche fange ich an zu musizieren. Ganz neues Staunen.", en: "Exactly. Next week I'm taking up music. A whole new kind of wonder." },
      ],
    },
  ],
  "part597": [
    {
      title: "Der Termin ist reserviert",
      lines: [
        { speaker: "A", de: "Ich habe den Tisch reserviert und den Ausflug terminiert.", en: "I've booked the table and scheduled the outing." },
        { speaker: "B", de: "Du klingst wie ein Büro. Wir wollten uns entspannen!", en: "You sound like an office. We were supposed to be relaxing!" },
        { speaker: "A", de: "Deshalb ja! Nichts wird verschwendet, auch keine Zeit.", en: "That's the point! Nothing gets wasted — not even time." },
        { speaker: "B", de: "Gut. Samstag fahren wir am Fluss entlang und sonnen uns.", en: "Fine. Saturday we ride along the river and sun ourselves." },
        { speaker: "A", de: "Und Sonntag ruhen wir. Das unterschreibe ich dir sogar.", en: "And Sunday we rest. I'll even put that in writing for you." },
      ],
    },
  ],
  "part598": [
    {
      title: "Zwei sehr verschiedene Brüder",
      lines: [
        { speaker: "A", de: "Deine Brüder sind wirklich verschieden, oder?", en: "Your brothers really are different, aren't they?" },
        { speaker: "B", de: "Sehr. Der eine redselig und gesellig, der andere eher wortkarg.", en: "Very. One talkative and sociable, the other more a man of few words." },
        { speaker: "A", de: "Aber beide liebevoll, das merkt man sofort.", en: "But both affectionate — you can tell straight away." },
        { speaker: "B", de: "Ja. Der eine optimistisch, der andere vorsichtig. Zusammen perfekt.", en: "Yes. One optimistic, the other careful. Together they're perfect." },
        { speaker: "A", de: "Hartnäckig sind sie beide. Das liegt dann wohl in der Familie.", en: "They're both stubborn, though. That must run in the family." },
      ],
    },
  ],
  "part599": [
    {
      title: "Unklar und undeutlich",
      lines: [
        { speaker: "A", de: "Die Ansage am Bahnhof war mal wieder völlig undeutlich.", en: "The station announcement was completely unclear again." },
        { speaker: "B", de: "Wie immer. Und die Anzeige bleibt neutral: Verspätung unklar.", en: "As ever. And the display stays neutral: delay unclear." },
        { speaker: "A", de: "Unrealistisch ist das nicht, aber unpräzise.", en: "It's not unrealistic, but it is imprecise." },
        { speaker: "B", de: "Identisch mit letzter Woche. Konstant schlecht, immerhin.", en: "Identical to last week. Consistently bad, at least." },
        { speaker: "A", de: "Logisch wäre eine klare Ansage. Aber das ist wohl undenkbar.", en: "The logical thing would be a clear announcement. But that's apparently unthinkable." },
      ],
    },
  ],
  "part600": [
    {
      title: "Essbar oder nicht",
      lines: [
        { speaker: "A", de: "Ist der Pilz da essbar?", en: "Is that mushroom edible?" },
        { speaker: "B", de: "Keine Ahnung, und genau deshalb bleibt er stehen.", en: "No idea — and that's exactly why it stays where it is." },
        { speaker: "A", de: "Gut. Das Wasser hier, ist das trinkbar?", en: "Fair. The water here — is it drinkable?" },
        { speaker: "B", de: "Ja, steht auf dem Schild. Und die Beeren sind sogar messbar süßer als gekaufte.", en: "Yes, it says so on the sign. And the berries are measurably sweeter than shop-bought." },
        { speaker: "A", de: "Dann ist das Picknick ja bezahlbar: alles umsonst.", en: "Then this picnic is affordable indeed: everything's free." },
      ],
    },
  ],
  "part601": [
    {
      title: "Unnötig kompliziert",
      lines: [
        { speaker: "A", de: "Das Formular ist unnötig kompliziert. Zehn Seiten!", en: "This form is needlessly complicated. Ten pages!" },
        { speaker: "B", de: "Und unpraktisch: Feld drei passt nicht mal auf die Zeile.", en: "And impractical: field three doesn't even fit on the line." },
        { speaker: "A", de: "Unfair ist es auch. Ohne Internet ist es fast unmöglich.", en: "It's unfair too. Without internet it's nearly impossible." },
        { speaker: "B", de: "Unvorsichtig ausgefüllt wird es aber erst recht ungerecht.", en: "But filled in carelessly it gets more unjust still." },
        { speaker: "A", de: "Also langsam und produktiv. Zart anfassen, das Papier ist spröde.", en: "Slow and productive it is, then. Handle it gently — the paper's brittle." },
      ],
    },
  ],
  "part602": [
    {
      title: "Die Anzeige für die Wohnung",
      lines: [
        { speaker: "A", de: "Wie beschreiben wir die Wohnung in der Anzeige?", en: "How do we describe the flat in the advert?" },
        { speaker: "B", de: "Geräumig, renoviert, möbliert. Und die Lage: urban, aber wassernah.", en: "Spacious, renovated, furnished. And the location: urban, but close to the water." },
        { speaker: "A", de: "Morgendliche Sonne im Schlafzimmer, abendliche auf dem Balkon.", en: "Morning sun in the bedroom, evening sun on the balcony." },
        { speaker: "B", de: "Das Viertel ist belebt, aber nachts ruhig.", en: "The neighbourhood is lively, but quiet at night." },
        { speaker: "A", de: "Perfekt. Altmodisch ist nur das Bad — das nennen wir charmant.", en: "Perfect. Only the bathroom is old-fashioned — we'll call that charming." },
      ],
    },
  ],
  "part603": [
    {
      title: "Freundlich zu allen",
      lines: [
        { speaker: "A", de: "Das neue Café ist wirklich kinderfreundlich. Und tierfreundlich!", en: "The new café is really child-friendly. And pet-friendly!" },
        { speaker: "B", de: "Und behindertengerecht, habe ich gelesen. Breite Türen, keine Stufen.", en: "And accessible, I read. Wide doors, no steps." },
        { speaker: "A", de: "Die Verpackung beim Mitnehmen ist umweltfreundlich.", en: "The takeaway packaging is environmentally friendly." },
        { speaker: "B", de: "Benutzerfreundlich ist sogar die Karte: drei Seiten, klare Preise.", en: "Even the menu is user-friendly: three pages, clear prices." },
        { speaker: "A", de: "Friedlich ist es auch noch. Da gehen wir jetzt immer hin.", en: "And it's peaceful on top of that. That's our place from now on." },
      ],
    },
  ],
  "part604": [
    {
      title: "Hellblau oder dunkelgrün",
      lines: [
        { speaker: "A", de: "Welche Farbe fürs Arbeitszimmer: hellblau oder dunkelgrün?", en: "Which colour for the study: light blue or dark green?" },
        { speaker: "B", de: "Dunkelgrün, mit silbernen Rahmen an der Wand.", en: "Dark green, with silver frames on the wall." },
        { speaker: "A", de: "Und der Teppich? Oval oder rechteckig?", en: "And the rug? Oval or rectangular?" },
        { speaker: "B", de: "Rechteckig. Oval wirkt schnell altmodisch.", en: "Rectangular. Oval quickly looks dated." },
        { speaker: "A", de: "Gut. Violett kommt mir jedenfalls nicht ins Haus.", en: "Fine. Violet, in any case, is not setting foot in this house." },
      ],
    },
  ],
  "part405": [
    {
      title: "Der Kompromiss",
      lines: [
        { speaker: "A", de: "Deine These kenne ich. Aber es gibt einen Einwand.", en: "I know your thesis. But there is an objection." },
        { speaker: "B", de: "Dann her damit. Ohne Entgegnung wird das keine echte Verhandlung.", en: "Then let's hear it. Without a rejoinder this won't be a real negotiation." },
        { speaker: "A", de: "Deine Behauptung stützt sich auf eine einzige Quelle.", en: "Your claim rests on a single source." },
        { speaker: "B", de: "Das räume ich ein. Dafür ist es eine sehr gute Quelle.", en: "I'll concede that. In return, it's a very good source." },
        { speaker: "A", de: "Na schön. Ich mache dir einen Kompromiss: Wir prüfen sie zusammen.", en: "Very well. I'll offer you a compromise: we examine it together." },
      ],
    },
  ],
  "part407": [
    {
      title: "Erleichterung",
      lines: [
        { speaker: "A", de: "Und? Wie war das Gespräch, vor dem du solche Angst hattest?", en: "Well? How was the conversation you were so afraid of?" },
        { speaker: "B", de: "Die Beklommenheit war nach zwei Minuten weg. Danach: pure Erleichterung.", en: "The unease was gone after two minutes. After that: pure relief." },
        { speaker: "A", de: "Siehst du! Deine Zuversicht war berechtigt.", en: "See! Your confidence was justified." },
        { speaker: "B", de: "Ein bisschen Reue bleibt, dass ich so lange gewartet habe.", en: "A little regret remains that I waited so long." },
        { speaker: "A", de: "Kein Neid auf Leute, die das leichter können — jeder hat sein Tempo.", en: "No envying people who find it easier — everyone has their own pace." },
      ],
    },
  ],
  "part409": [
    {
      title: "Der Lichtblick",
      lines: [
        { speaker: "A", de: "Das Projekt war viele Monate ein Teufelskreis: kein Geld, keine Leute.", en: "For many months the project was a vicious circle: no money, no people." },
        { speaker: "B", de: "Und dann kam der Durchbruch?", en: "And then came the breakthrough?" },
        { speaker: "A", de: "Erst ein Lichtblick: eine kleine Zusage. Dann der Wendepunkt.", en: "First a ray of hope: one small commitment. Then the turning point." },
        { speaker: "B", de: "Der Knackpunkt war sicher das Geld.", en: "The sticking point was the money, surely." },
        { speaker: "A", de: "Genau. Jetzt haben wir Spielraum — und ich etwas Fingerspitzengefühl mehr.", en: "Exactly. Now we've got room to move — and I've got a little more finesse." },
        { speaker: "B", de: "Dann war die ganze Gratwanderung am Ende eine Sternstunde.", en: "Then the whole tightrope walk turned out to be a finest hour." },
      ],
    },
  ],
  "part111": [
    {
      title: "Vor dem Kunstwerk",
      lines: [
        { speaker: "A", de: "Für moderne Kunst hast du doch nichts übrig — was machst du dann hier?", en: "You've got no time for modern art — so what are you doing here?" },
        { speaker: "B", de: "Die Ausstellung hat meine Perspektive verändert, ehrlich.", en: "This exhibition has changed my perspective, honestly." },
        { speaker: "A", de: "Welches Werk denn? Zeig mal.", en: "Which work? Show me." },
        { speaker: "B", de: "Das da drüben. Der Künstler hat einen ganz eigenen Stil.", en: "That one over there. The artist has a style all of his own." },
        { speaker: "A", de: "Hm. Damit kann ich ehrlich gesagt nichts anfangen.", en: "Hm. Honestly, it does nothing for me." },
      ],
    },
  ],
  "part8": [
    {
      title: "Kurz vor Feierabend",
      lines: [
        { speaker: "A", de: "Bist du bald fertig? Wir wollten doch noch einkaufen.", en: "Are you nearly done? We were going to go shopping, remember." },
        { speaker: "B", de: "Zehn Minuten noch. Ich muss diese Liste zu Ende schreiben.", en: "Ten more minutes. I have to finish writing this list." },
        { speaker: "A", de: "Gut, dann mache ich schon mal das Fenster zu und packe die Taschen.", en: "Fine, then I'll close the window and pack the bags in the meantime." },
        { speaker: "B", de: "Hast du Kleingeld für den Einkaufswagen?", en: "Have you got change for the shopping trolley?" },
        { speaker: "A", de: "Nein, aber wir nehmen einfach den Korb. So viel brauchen wir nicht.", en: "No, but we'll just take the basket. We don't need that much." },
      ],
    },
  ],
  "part9": [
    {
      title: "Die neue Wohnung zeigen",
      lines: [
        { speaker: "A", de: "Komm rein! Die Schuhe kannst du gern anlassen.", en: "Come in! You're welcome to keep your shoes on." },
        { speaker: "B", de: "Schön hell hier. Seit wann wohnst du im dritten Stock?", en: "Nice and bright in here. How long have you been living on the third floor?" },
        { speaker: "A", de: "Seit zwei Monaten. Die Küche ist klein, aber sie reicht mir.", en: "Two months now. The kitchen's small, but it does me fine." },
        { speaker: "B", de: "Und der Balkon! Da bleibe ich im Sommer gleich zum Essen.", en: "And the balcony! In summer I'm staying for dinner right there." },
        { speaker: "A", de: "Gern. Nur der Aufzug ist leider öfter kaputt als er fährt.", en: "Please do. Only the lift is broken more often than it runs, sadly." },
      ],
    },
  ],
  "part10": [
    {
      title: "Das neue Projekt",
      lines: [
        { speaker: "A", de: "Arbeitest du morgen im Büro oder im Homeoffice?", en: "Are you working at the office tomorrow or from home?" },
        { speaker: "B", de: "Im Büro. Wir planen das neue Projekt, da will ich dabei sein.", en: "At the office. We're planning the new project — I want to be there for that." },
        { speaker: "A", de: "Wer erklärt dem Team eigentlich den Plan?", en: "Who's actually explaining the plan to the team?" },
        { speaker: "B", de: "Die Chefin selbst, am Freitag um neun.", en: "The boss herself, on Friday at nine." },
        { speaker: "A", de: "Dann arbeite ich Freitag nur bis zwei und komme danach dazu.", en: "Then I'll only work till two on Friday and join afterwards." },
      ],
    },
  ],
  "part11": [
    {
      title: "Die Nachricht in der Zeitung",
      lines: [
        { speaker: "A", de: "Hast du die Nachricht über das neue Schwimmbad gelesen?", en: "Did you read the news about the new swimming pool?" },
        { speaker: "B", de: "Ja, heute Morgen in der Zeitung. Ich glaube aber nicht, dass das klappt.", en: "Yes, in the paper this morning. I don't believe it'll work out, though." },
        { speaker: "A", de: "Warum nicht? Ich finde die Idee eigentlich gut.", en: "Why not? I actually think the idea is good." },
        { speaker: "B", de: "Zu teuer. Und ich glaube, die Stadt hat das Geld nicht.", en: "Too expensive. And I don't think the town has the money." },
        { speaker: "A", de: "Da hast du vielleicht recht. Mal sehen, was daraus wird.", en: "You may be right there. Let's see what comes of it." },
      ],
    },
  ],
  "part12": [
    {
      title: "Die vergessene Tasche",
      lines: [
        { speaker: "A", de: "Entschuldigung, ich habe meine Tasche im Zug vergessen. Wer kann mir helfen?", en: "Excuse me, I've left my bag on the train. Who can help me?" },
        { speaker: "B", de: "Da sind Sie hier richtig. Welcher Zug war es denn?", en: "You've come to the right place. Which train was it?" },
        { speaker: "A", de: "Der um halb neun aus Hamburg. Die Tasche ist blau, mit meinem Regenschirm drin.", en: "The half past eight from Hamburg. The bag's blue, with my umbrella inside." },
        { speaker: "B", de: "Moment ... tatsächlich, die wurde gerade abgegeben. Haben Sie Ihren Pass dabei?", en: "One moment ... as it happens, it's just been handed in. Do you have your passport on you?" },
        { speaker: "A", de: "Ja, zum Glück war der in meiner Jacke und nicht in der Tasche.", en: "Yes — luckily that was in my jacket and not in the bag." },
      ],
    },
  ],
  "part68": [
    {
      title: "Gleich ins Bett",
      lines: [
        { speaker: "A", de: "Ich putz mir noch die Zähne und geh dann ins Bett.", en: "I'll just brush my teeth and then I'm off to bed." },
        { speaker: "B", de: "Schon? Ich wollte noch eine Folge gucken.", en: "Already? I was going to watch one more episode." },
        { speaker: "A", de: "Dann leise, bitte. Und weck mich nicht, wenn du kommst.", en: "Quietly then, please. And don't wake me when you come in." },
        { speaker: "B", de: "Versprochen. Bist du eigentlich noch sauer wegen vorhin?", en: "Promise. Are you still cross about earlier, by the way?" },
        { speaker: "A", de: "Nein, schon vergessen. Gute Nacht, bis morgen.", en: "No, forgotten already. Good night — see you in the morning." },
      ],
    },
  ],
  "part69": [
    {
      title: "Der neue Kollege",
      lines: [
        { speaker: "A", de: "Und, wie ist der Neue so?", en: "So, what's the new guy like?" },
        { speaker: "B", de: "Ich kann ihn gut leiden. Ehrlich, hilfsbereit, macht seine Arbeit.", en: "I quite like him. Honest, helpful, gets his work done." },
        { speaker: "A", de: "Wirklich? Mir gefällt sein Ton nicht besonders.", en: "Really? I'm not keen on his tone." },
        { speaker: "B", de: "Das ist nur seine Art. Er meint das nicht böse.", en: "That's just his manner. He doesn't mean anything by it." },
        { speaker: "A", de: "Vielleicht. Sympathisch finde ich trotzdem andere.", en: "Maybe. I still find other people more likeable." },
      ],
    },
  ],
  "part70": [
    {
      title: "Was aus dem Umzug wurde",
      lines: [
        { speaker: "A", de: "Du hast letztens erzählt, du willst umziehen. Was ist daraus geworden?", en: "You said recently you wanted to move. What came of that?" },
        { speaker: "B", de: "Nichts. Der Vermieter hat die Wohnung dann doch anders vergeben.", en: "Nothing. In the end the landlord gave the flat to someone else." },
        { speaker: "A", de: "Ach echt? Das hätte ich nicht gedacht. Und wie ging es weiter?", en: "Oh really? I wouldn't have expected that. And what happened then?" },
        { speaker: "B", de: "Ich suche noch. Aber ehrlich gesagt ohne Eile.", en: "I'm still looking. But honestly, without any hurry." },
        { speaker: "A", de: "Das kenne ich. Bei mir hat die Suche damals ein Jahr gedauert.", en: "I know how that goes. My own search took a year back then." },
      ],
    },
  ],
  "part71": [
    {
      title: "Teils, teils",
      lines: [
        { speaker: "A", de: "Und, wie fandest du den Vorschlag?", en: "So, what did you make of the proposal?" },
        { speaker: "B", de: "Naja, teils teils. Da ist schon was dran, aber so einfach ist das nicht.", en: "Well — yes and no. There's something in it, but it's not that simple." },
        { speaker: "A", de: "Kommt drauf an, wen du fragst, oder?", en: "Depends who you ask, right?" },
        { speaker: "B", de: "Genau. Ich sag ja nicht, dass er unrecht hat. Überzeugt bin ich trotzdem nicht.", en: "Exactly. I'm not saying he's wrong. I'm still not convinced, though." },
        { speaker: "A", de: "Das kann man so sehen. Schlafen wir eine Nacht drüber.", en: "That's one way to see it. Let's sleep on it." },
      ],
    },
  ],
  "part72": [
    {
      title: "Donnerstag um acht",
      lines: [
        { speaker: "A", de: "Hättest du Lust, diese Woche mal wieder essen zu gehen?", en: "Would you fancy going out for dinner again some time this week?" },
        { speaker: "B", de: "Sehr gern. Geht bei dir Donnerstag?", en: "I'd love to. Does Thursday work for you?" },
        { speaker: "A", de: "Donnerstag ja, aber ich kann leider erst ab acht.", en: "Thursday yes, but unfortunately I can't do it before eight." },
        { speaker: "B", de: "Passt mir gut. Ich reserviere uns was und schreibe dir vorher noch kurz.", en: "Suits me fine. I'll book us somewhere and drop you a line beforehand." },
        { speaker: "A", de: "Perfekt. Bis Donnerstag dann!", en: "Perfect. See you Thursday, then!" },
      ],
    },
  ],
  "part78": [
    {
      title: "Angeschlagen",
      lines: [
        { speaker: "A", de: "Du siehst blass aus. Alles okay?", en: "You look pale. Everything all right?" },
        { speaker: "B", de: "Ich fühl mich total angeschlagen. Ich glaub, ich brüte was aus.", en: "I feel completely run-down. I think I'm coming down with something." },
        { speaker: "A", de: "Dann geh heim. Hast du was da? Tee, Ibu, Wärmflasche?", en: "Then go home. Have you got supplies in? Tea, ibuprofen, hot water bottle?" },
        { speaker: "B", de: "Tee ja. Aber ich hab heute Nacht kein Auge zugemacht.", en: "Tea, yes. But I didn't sleep a wink last night." },
        { speaker: "A", de: "Eben. Leg dich hin, ich sag den anderen Bescheid.", en: "Exactly. Go and lie down — I'll let the others know." },
      ],
    },
  ],
  "part79": [
    {
      title: "Einfach mal zuhören",
      lines: [
        { speaker: "A", de: "Du bist heute so still. Irgendwas stimmt doch nicht, oder?", en: "You're very quiet today. Something's not right, is it?" },
        { speaker: "B", de: "Ach, ich weiß auch nicht. Irgendwie ist gerade alles viel.", en: "Oh, I don't know. Everything's just a lot at the moment." },
        { speaker: "A", de: "Willst du reden, oder lieber abgelenkt werden?", en: "Do you want to talk, or would you rather be distracted?" },
        { speaker: "B", de: "Ehrlich gesagt: im Moment lieber nur reden.", en: "Honestly? Right now I'd rather just talk." },
        { speaker: "A", de: "Dann höre ich zu. Lass dir Zeit, Geduld habe ich genug.", en: "Then I'll listen. Take your time; I've got plenty of patience." },
      ],
    },
  ],
  "part100": [
    {
      title: "Nach der Ausbildung",
      lines: [
        { speaker: "A", de: "Wie lange dauert deine Ausbildung eigentlich noch?", en: "How much longer does your training actually run?" },
        { speaker: "B", de: "Noch ein Jahr. Danach will ich vielleicht noch studieren.", en: "Another year. After that I might go on to university." },
        { speaker: "A", de: "An der Universität hier, oder woanders?", en: "At the university here, or somewhere else?" },
        { speaker: "B", de: "Am liebsten an der Hochschule in Köln. Der Kurs dort soll sehr gut sein.", en: "Ideally at the college in Cologne. The course there is supposed to be very good." },
        { speaker: "A", de: "Dann lies schon mal fleißig. Die nehmen nicht jeden.", en: "Better keep up the reading, then. They don't take just anyone." },
      ],
    },
  ],
  "part103": [
    {
      title: "Es hat geklappt",
      lines: [
        { speaker: "A", de: "Und? Hat es mit der Wohnung geklappt?", en: "Well? Did it work out with the flat?" },
        { speaker: "B", de: "Diesmal ist es mir gelungen! Ich habe gestern die Nachricht erhalten.", en: "This time I managed it! I got the message yesterday." },
        { speaker: "A", de: "Wie schön! Und wie viel Fläche hat sie?", en: "Wonderful! And how much floor space has it got?" },
        { speaker: "B", de: "Drei Zimmer, und der Keller gehört auch dazu.", en: "Three rooms, and the cellar comes with it too." },
        { speaker: "A", de: "Das scheint mir ein sehr guter Fang. Du siehst richtig glücklich aus.", en: "That seems like a very good catch to me. You look properly happy." },
      ],
    },
  ],
  "part104": [
    {
      title: "Der Vergleich lohnt sich",
      lines: [
        { speaker: "A", de: "Warum kaufst du hier? Der Laden an der Ecke ist doch näher.", en: "Why do you shop here? The place on the corner is closer, after all." },
        { speaker: "B", de: "Stimmt, aber die Auswahl hier ist wirklich groß.", en: "True, but the selection here is really big." },
        { speaker: "A", de: "Und die Preise?", en: "And the prices?" },
        { speaker: "B", de: "Im Vergleich ziemlich günstig. Zusätzlich ist sonntags geöffnet.", en: "Pretty cheap by comparison. On top of that, it's open on Sundays." },
        { speaker: "A", de: "Das ist allerdings ein wesentlicher Unterschied.", en: "Now that is a significant difference." },
      ],
    },
  ],
  "part105": [
    {
      title: "Der Anspruch auf Beratung",
      lines: [
        { speaker: "A", de: "Guten Tag, ich brauche Unterstützung bei einem Antrag. Wo finde ich die Beratung?", en: "Hello, I need support with an application. Where do I find the advice desk?" },
        { speaker: "B", de: "Hier. Welche Voraussetzungen Sie erfüllen müssen, steht in diesem Heft.", en: "Right here. The requirements you have to meet are in this booklet." },
        { lessonPriority: 2, speaker: "A", de: "Habe ich auch Anspruch auf einen Termin zur Beratung vor Ort?", en: "Am I also entitled to an in-person advice appointment?" },
        { speaker: "B", de: "Ja. Füllen Sie das Formular vollständig aus und bringen Sie Ihre Unterlagen mit.", en: "Yes. Fill in the form completely and bring your documents with you." },
        { speaker: "A", de: "Danke für den Hinweis. Das Gebäude hier am Bahnhof, richtig?", en: "Thanks for the pointer. The building here by the station, right?" },
      ],
    },
  ],
  "part110": [
    {
      title: "Zwei Sichtweisen",
      lines: [
        { speaker: "A", de: "Wie hat sie eigentlich auf die Absage reagiert?", en: "How did she actually react to the cancellation?" },
        { speaker: "B", de: "Erstaunlich ruhig. Aus meiner Sicht war das kein Problem für sie.", en: "Surprisingly calmly. From my point of view it was no problem for her." },
        { speaker: "A", de: "Das würde ich anders sehen. Sie hatte sich sehr darauf gefreut.", en: "I'd see that differently. She'd really been looking forward to it." },
        { speaker: "B", de: "Kann ich nachvollziehen. Ich möchte nur betonen: Es war ihre Entscheidung.", en: "I can understand that. I'd just stress one thing: it was her decision." },
        { speaker: "A", de: "Da hast du völlig recht. Bei Gelegenheit frage ich sie einfach selbst.", en: "You're completely right there. When the chance comes up, I'll simply ask her myself." },
      ],
    },
  ],
  "part113": [
    {
      title: "Der Ausflug zum See",
      lines: [
        { speaker: "A", de: "Sollen wir am Samstag an den See? Die Saison fängt doch jetzt an.", en: "Shall we go to the lake on Saturday? The season's just starting, after all." },
        { speaker: "B", de: "Es soll aber örtlich Gewitter geben.", en: "There are meant to be local thunderstorms, though." },
        { speaker: "A", de: "Nur am Nachmittag. Vormittags waren wir letztes Mal fast allein dort.", en: "Only in the afternoon. Last time we were almost alone there in the morning." },
        { speaker: "B", de: "Gut. Aber der See ist an einer Stelle ziemlich tief, denk an die Kinder.", en: "Fine. But the lake's quite deep in one spot — think of the kids." },
        { speaker: "A", de: "Wir bleiben nah am Ufer. Und bei Regen ist das Auto nur zehn Minuten entfernt.", en: "We'll stay close to the bank. And if it rains, the car's only ten minutes away." },
      ],
    },
  ],
  "part380": [
    {
      title: "Mal sehen, ob das Wetter hält",
      lines: [
        { speaker: "A", de: "Kommst du morgen mit zum Flohmarkt?", en: "Are you coming along to the flea market tomorrow?" },
        { speaker: "B", de: "Kann sein. Kommt drauf an, wie viel Zeit wir haben.", en: "Maybe. Depends how much time we have." },
        { speaker: "A", de: "Wir fahren früh los. Mal sehen, ob das Wetter hält.", en: "We're setting off early. Let's see if the weather holds." },
        { speaker: "B", de: "Ich weiß nicht, ob ich das schaffe. Ich sage dir heute Abend Bescheid.", en: "I don't know if I'll manage it. I'll let you know tonight." },
        { speaker: "A", de: "Gut. Und keine Ahnung, wo mein Schlüssel ist — such du schon mal deinen.", en: "Fine. And I've no idea where my key is — you go and find yours in the meantime." },
      ],
    },
  ],
  "part73": [
    {
      title: "Die Übergabe vor dem Urlaub",
      lines: [
        { speaker: "A", de: "Bevor ich in den Urlaub gehe, machen wir noch die Übergabe.", en: "Before I go on holiday, let's do the handover." },
        { speaker: "B", de: "Gut. Wer macht deine Vertretung, während du weg bist?", en: "Good. Who's covering for you while you're away?" },
        { speaker: "A", de: "Der Kollege aus dem Büro nebenan, der hat noch Puffer.", en: "The colleague from the office next door — he's still got some slack." },
        { speaker: "B", de: "Und dein Resturlaub? Der ist sonst einfach weg.", en: "And your remaining leave? Otherwise it'll just be gone." },
        { speaker: "A", de: "Schon eingetragen. Ab morgen habe ich Feierabend.", en: "Already booked in. As of tomorrow, I'm off the clock." },
      ],
    },
  ],
  "part74": [
    {
      title: "Schlechter Empfang",
      lines: [
        { speaker: "A", de: "Hallo, hörst du mich? Der Empfang im Keller ist eine Katastrophe.", en: "Hello, can you hear me? The reception in the basement is a disaster." },
        { speaker: "B", de: "Halb. Bei dir hat es die ganze Zeit gerauscht.", en: "Just about. There was static on your end the whole time." },
        { speaker: "A", de: "Ich gehe mal rauf ans Fenster. Hörst du mich jetzt besser?", en: "I'll go up by the window. Can you hear me better now?" },
        { speaker: "B", de: "Ja, viel besser. Warum bist du vorhin nicht rangegangen?", en: "Yes, much better. Why didn't you pick up earlier?" },
        { speaker: "A", de: "Dein Anruf ist direkt auf die Mailbox gegangen, sorry.", en: "Your call went straight to voicemail, sorry." },
      ],
    },
  ],
  "part75": [
    {
      title: "Der Zug fällt aus",
      lines: [
        { speaker: "A", de: "Entschuldigung, mein Zug fällt aus. Wie komme ich heute noch nach Köln?", en: "Excuse me, my train's been cancelled. How do I still get to Cologne today?" },
        { speaker: "B", de: "Es gibt einen Ersatzbus, der fährt in zehn Minuten vor dem Bahnhof ab.", en: "There's a replacement bus — it leaves in front of the station in ten minutes." },
        { speaker: "A", de: "Und erreiche ich damit meinen Anschlusszug?", en: "And will I make my connecting train with it?" },
        { speaker: "B", de: "Das wird knapp. Ab sechzig Minuten Verspätung kriegen Sie aber Geld zurück.", en: "It'll be tight. But from sixty minutes' delay you get money back." },
        { speaker: "A", de: "Gut zu wissen. Dann fülle ich nachher gleich das Formular für die Verspätung aus.", en: "Good to know. I'll fill in the delay form straight afterwards, then." },
      ],
    },
  ],
  "part77": [
    {
      title: "Der Umtausch ohne Bon",
      lines: [
        { speaker: "A", de: "Guten Tag, ich möchte das hier umtauschen. Da fehlt eine Schraube.", en: "Hello, I'd like to exchange this. There's a screw missing." },
        { speaker: "B", de: "Haben Sie den Bon dabei?", en: "Do you have the receipt with you?" },
        { speaker: "A", de: "Nein, aber ich habe mit Karte bezahlt. Sie sehen das sicher im System.", en: "No, but I paid by card. I'm sure you can see it in the system." },
        { speaker: "B", de: "Moment, ich schaue nach ... ja, hier ist es. Möchten Sie das Geld zurück?", en: "One moment, let me check ... yes, here it is. Would you like your money back?" },
        { speaker: "A", de: "Lieber ein neues Gerät, wenn Sie hinten noch eins im Lager haben.", en: "I'd rather have a new one, if you've still got one in the stockroom." },
      ],
    },
  ],
  "part80": [
    {
      title: "Der Neue im Haus",
      lines: [
        { speaker: "A", de: "Hallo, ich bin der Neue aus dem dritten Stock.", en: "Hi, I'm the new guy from the third floor." },
        { speaker: "B", de: "Ah, willkommen im Haus! Schon richtig angekommen?", en: "Ah, welcome to the building! Settled in properly yet?" },
        { speaker: "A", de: "Fast. Eine Frage: Wann stellt man hier die Tonnen raus?", en: "Almost. One question — when do the bins go out here?" },
        { speaker: "B", de: "Immer montags. Und nach zehn bitte leise, die Wände sind dünn.", en: "Always on Mondays. And please keep it down after ten — the walls are thin." },
        { speaker: "A", de: "Versprochen. Wenn was ist, klingeln Sie einfach bei mir.", en: "Promise. If anything comes up, just ring my bell." },
      ],
    },
  ],
  "part81": [
    {
      title: "Kein Wort über die Serie",
      lines: [
        { speaker: "A", de: "Guckst du die Serie auch? Alle reden davon.", en: "Are you watching the series too? Everyone's talking about it." },
        { speaker: "B", de: "Ja, aber kein Wort — ich bin erst bei der zweiten Folge.", en: "Yes, but not a word — I'm only on episode two." },
        { speaker: "A", de: "Okay, ich sage nichts. Ich schicke dir nachher das Meme dazu.", en: "Okay, I'll say nothing. I'll send you the meme about it later." },
        { speaker: "B", de: "Bitte nicht in den Gruppenchat, da liest es sonst jeder.", en: "Not in the group chat, please — everyone will see it there." },
        { speaker: "A", de: "Gut. Und lade vorher dein Handy, sonst bist du gleich wieder raus.", en: "Fine. And charge your phone first, or you'll be gone again in no time." },
      ],
    },
  ],
  "part82": [
    {
      title: "Omas Neunzigster",
      lines: [
        { speaker: "A", de: "Kommst du am Sonntag zur Familienfeier? Oma wird neunzig.", en: "Are you coming to the family do on Sunday? Grandma's turning ninety." },
        { speaker: "B", de: "Klar. Und die ganze Verwandtschaft reist wieder an, nehme ich an?", en: "Of course. And the whole extended family's travelling in again, I take it?" },
        { speaker: "A", de: "Alle. Auch der Cousin aus Hamburg, den du noch nie getroffen hast.", en: "Everyone. Including the cousin from Hamburg you've never met." },
        { speaker: "B", de: "Der, der dir so ähnlich sieht?", en: "The one who looks so much like you?" },
        { speaker: "A", de: "Genau der. Mama sagt, wir sind wie aus dem Gesicht geschnitten.", en: "That's the one. Mum says we're the spitting image of each other." },
      ],
    },
  ],
  "part83": [
    {
      title: "Dreißig Grad in der Wohnung",
      lines: [
        { speaker: "A", de: "Sag ehrlich: Wie viel Grad hat deine Bude gerade?", en: "Be honest — how many degrees is your place right now?" },
        { speaker: "B", de: "Dreißig, mindestens. Ich habe die Rollläden den ganzen Tag unten gelassen.", en: "Thirty, at least. I've kept the shutters down all day." },
        { speaker: "A", de: "Hilft das denn wirklich?", en: "Does that actually help?" },
        { speaker: "B", de: "Ein bisschen. Abends mache ich dann alle Fenster auf.", en: "A little. Then in the evening I open all the windows." },
        { speaker: "A", de: "Morgen soll ein Gewitter kommen, dann kühlt es endlich ab.", en: "There's meant to be a thunderstorm tomorrow — it'll finally cool off." },
      ],
    },
  ],
  "part85": [
    {
      title: "Die offenen zwölf Euro",
      lines: [
        { speaker: "A", de: "Ich habe noch Schulden bei dir von gestern Abend.", en: "I still owe you from last night." },
        { speaker: "B", de: "Ach ja, stimmt. Zwölf Euro, glaube ich.", en: "Oh right, so you do. Twelve euros, I think." },
        { speaker: "A", de: "Geht das per Überweisung? Dann brauche ich deine IBAN.", en: "Can I do it by bank transfer? I'll need your IBAN then." },
        { speaker: "B", de: "Mach dir keinen Stress, das hat Zeit bis zum Wochenende.", en: "Don't stress about it — it can wait till the weekend." },
        { speaker: "A", de: "Nein, nein, sonst vergesse ich es wieder. Halbe-halbe beim nächsten Mal?", en: "No, no — otherwise I'll forget again. Fifty-fifty next time?" },
      ],
    },
  ],
  "part86": [
    {
      title: "Er frisst nicht",
      lines: [
        { speaker: "A", de: "Guten Tag. Mein Hund frisst seit zwei Tagen kaum etwas.", en: "Hello. My dog has hardly eaten anything for two days." },
        { speaker: "B", de: "Dann schauen wir mal. Zieht er an der Leine noch wie immer?", en: "Let's have a look then. Is he still pulling on the lead like he always does?" },
        { speaker: "A", de: "Nein, er ist viel ruhiger als sonst.", en: "No, he's much quieter than usual." },
        { speaker: "B", de: "Ich untersuche ihn kurz. Halten Sie ihn bitte gut fest.", en: "I'll examine him quickly. Please hold him steady for me." },
        { speaker: "A", de: "Kein Problem, er tut nichts. Er ist nur ein bisschen ängstlich.", en: "No problem, he won't hurt you. He's just a bit nervous." },
      ],
    },
  ],
  "part87": [
    {
      title: "Der Fleck auf dem Hemd",
      lines: [
        { speaker: "A", de: "Mist, ich habe einen Fleck auf dem Hemd. Kriegt man den noch raus?", en: "Damn, I've got a stain on my shirt. Will it still come out?" },
        { speaker: "B", de: "Zeig mal. Oh je, das ist Fett — das geht so schnell nicht raus.", en: "Show me. Oh dear, that's grease — that won't come out in a hurry." },
        { speaker: "A", de: "Das war mein letztes sauberes Hemd.", en: "That was my last clean shirt." },
        { speaker: "B", de: "Dann nimm den Pulli, der ist frisch gewaschen.", en: "Then take the jumper — it's fresh out of the wash." },
        { speaker: "A", de: "Der ist beim Waschen eingelaufen, der passt mir nicht mehr.", en: "It shrank in the wash — it doesn't fit me any more." },
      ],
    },
  ],
  "part88": [
    {
      title: "Morgens um halb acht",
      lines: [
        { speaker: "A", de: "Schuhe an, wir sind spät dran!", en: "Shoes on — we're running late!" },
        { speaker: "B", de: "Ich finde meine Brotdose nicht.", en: "I can't find my lunchbox." },
        { speaker: "A", de: "Die steht schon in deinem Rucksack. Und bitte nicht trödeln.", en: "It's already in your backpack. And no dawdling, please." },
        { speaker: "B", de: "Krieg ich heute Nachmittag Zeit am Tablet?", en: "Do I get time on the tablet this afternoon?" },
        { speaker: "A", de: "Zehn Minuten nach den Hausaufgaben. Und jetzt los, ich zähle bis drei.", en: "Ten minutes, after your homework. Now off we go — I'm counting to three." },
      ],
    },
  ],
  "part89": [
    {
      title: "Der Abend vor der Klausur",
      lines: [
        { speaker: "A", de: "Kannst du mich heute Abend abfragen? Morgen ist die Klausur.", en: "Can you test me tonight? The exam's tomorrow." },
        { speaker: "B", de: "Klar. Wie läuft es mit dem Lernen?", en: "Sure. How's the studying going?" },
        { speaker: "A", de: "Ich bin seit Tagen dran, aber ich trete auf der Stelle.", en: "I've been at it for days, but I'm just treading water." },
        { speaker: "B", de: "Du schaffst das. Letztes Mal hast du auch bestanden.", en: "You've got this. You passed last time too." },
        { speaker: "A", de: "Stimmt. Und diesmal lerne ich nicht erst auf den letzten Drücker.", en: "True. And this time I'm not leaving it till the last minute." },
      ],
    },
  ],
  "part90": [
    {
      title: "Es klappert hinten",
      lines: [
        { speaker: "A", de: "Guten Tag, beim Fahren klappert hinten irgendwas.", en: "Hello — something's rattling at the back when I drive." },
        { speaker: "B", de: "Wann können Sie das Auto vorbeibringen?", en: "When can you bring the car in?" },
        { speaker: "A", de: "Geht Donnerstag? Der TÜV ist auch bald fällig.", en: "Would Thursday work? The MOT is due soon as well." },
        { speaker: "B", de: "Donnerstag passt. Die Werkstatt ist ab sieben besetzt, kommen Sie einfach vorbei.", en: "Thursday works. The workshop's staffed from seven — just drop the car off." },
        { speaker: "A", de: "Und die Winterreifen? Können Sie die gleich mit draufmachen?", en: "And the winter tyres? Could you put those on while you're at it?" },
      ],
    },
  ],
  "part91": [
    {
      title: "Sonntag, halb eins",
      lines: [
        { speaker: "A", de: "Schlechte Nachricht: Das Brot ist alle, und alles hat zu.", en: "Bad news: we're out of bread, and everything's shut." },
        { speaker: "B", de: "Der Bäcker am Markt hat sonntags vormittags auf.", en: "The baker by the market is open on Sunday mornings." },
        { speaker: "A", de: "Es ist schon halb eins.", en: "It's already half past twelve." },
        { speaker: "B", de: "Dann bleibt wohl wieder nur die Tankstelle an der Ecke.", en: "Then I guess it's the petrol station on the corner again." },
        { speaker: "A", de: "Na gut. Aber danach geht es zurück auf die Couch.", en: "Fine. But after that it's straight back to the sofa." },
      ],
    },
  ],
  "part92": [
    {
      title: "Streit um den Film",
      lines: [
        { speaker: "A", de: "Und? Wie fandest du den Film?", en: "So? What did you think of the film?" },
        { speaker: "B", de: "Ehrlich? Den Hype verstehe ich nicht.", en: "Honestly? I don't get the hype." },
        { speaker: "A", de: "Was? Am Ende habe ich fast geheult.", en: "What? I nearly cried at the end." },
        { speaker: "B", de: "Na ja. Allein der Soundtrack war ganz gut.", en: "Well... the soundtrack alone was pretty good." },
        { speaker: "A", de: "Siehst du! Lies danach das Buch, das ist noch besser.", en: "See! Read the book afterwards — it's even better." },
      ],
    },
  ],
  "part93": [
    {
      title: "Dampf ablassen",
      lines: [
        { speaker: "A", de: "Hast du kurz Zeit? Ich muss mal Dampf ablassen.", en: "Have you got a minute? I need to let off some steam." },
        { speaker: "B", de: "Klar, immer. Wer hat dir denn den Tag versaut?", en: "Of course, any time. So who wrecked your day?" },
        { speaker: "A", de: "Der Chef hat mich heute vor allen zusammengefaltet.", en: "The boss tore into me in front of everyone today." },
        { speaker: "B", de: "Wie bitte? Das hast du nicht verdient.", en: "Excuse me? You didn't deserve that." },
        { speaker: "A", de: "Danke. Jetzt platzt mir wenigstens nicht mehr gleich der Kragen.", en: "Thanks. At least I'm no longer about to blow my top." },
      ],
    },
  ],
  "part101": [
    {
      title: "Die App geht nicht auf",
      lines: [
        { speaker: "A", de: "Die neue App lädt bei mir ewig und geht dann einfach nicht auf.", en: "The new app takes forever to load for me and then just won't open." },
        { speaker: "B", de: "Hast du das Update schon installiert?", en: "Have you installed the update yet?" },
        { speaker: "A", de: "Nein, mein Speicher ist voll. Ich muss erst Dateien löschen.", en: "No — my storage is full. I need to delete some files first." },
        { speaker: "B", de: "Sichere sie vorher irgendwo, sonst sind sie weg.", en: "Back them up somewhere first, or they'll be gone." },
        { speaker: "A", de: "Gute Idee. Danach erstelle ich das Konto neu und sichere alles doppelt.", en: "Good idea. After that I'll set the account up fresh and back everything up twice." },
      ],
    },
  ],
  "part102": [
    {
      title: "Samstag ins Museum",
      lines: [
        { speaker: "A", de: "Was machen wir am Samstag, bevor die Gäste kommen?", en: "What shall we do on Saturday, before the guests arrive?" },
        { speaker: "B", de: "Im Museum läuft noch die Ausstellung, die du sehen wolltest.", en: "The exhibition you wanted to see is still on at the museum." },
        { speaker: "A", de: "Gute Idee. Ist der Eintritt für Schüler ermäßigt? Dann kommt dein Bruder mit.", en: "Good idea. Is admission reduced for schoolkids? Then your brother can come along." },
        { speaker: "B", de: "Ja, aber für die Führung muss man sich vorher anmelden.", en: "Yes, but you have to register in advance for the guided tour." },
        { speaker: "A", de: "Das mache ich gleich online. Sonst ist am Ende alles voll.", en: "I'll do it online right away. Otherwise it'll all be booked up." },
      ],
    },
  ],
  "part76": [
    {
      title: "Bestellen mit Allergie",
      lines: [
        { speaker: "A", de: "Entschuldigung, ist in der Vorspeise Sahne drin? Ich bin allergisch.", en: "Excuse me, is there cream in the starter? I'm allergic." },
        { speaker: "B", de: "In der Suppe ja, aber die Küche macht sie gern ohne Sahne.", en: "In the soup, yes — but the kitchen is happy to make it without cream." },
        { speaker: "A", de: "Sehr gut. Gibt es das Tagesgericht auch vegetarisch?", en: "Very good. Does the dish of the day come in a vegetarian version too?" },
        { speaker: "B", de: "Ja, mit extra Beilagen statt Fleisch. Soll ich das so bestellen?", en: "Yes, with extra sides instead of meat. Shall I put that order in for you?" },
        { speaker: "A", de: "Gern. Den Nachtisch suchen wir später von der Speisekarte aus.", en: "Please. We'll pick a dessert from the menu later." },
      ],
    },
  ],
};

/**
 * The hook data.ts calls at its export: the same record of blueprints, with
 * each pack's conversations appended. Nothing else about a pack changes —
 * seeds and phrases pass through by reference, and packs named here must
 * exist, so a renamed pack fails the build instead of silently dropping its
 * scenes.
 */
export function withCapstoneDialogues(
  parts: Record<string, Blueprint>
): Record<string, Blueprint> {
  const merged: Record<string, Blueprint> = { ...parts };
  for (const [key, added] of Object.entries(CAPSTONE_DIALOGUES)) {
    const base = merged[key];
    if (!base) throw new Error(`capstoneDialogues: no such pack "${key}"`);
    // Every scene line is demoted one authored step (the same dial a
    // Phrase's lessonPriority turns). Two reasons. In the pack, a capstone
    // belongs behind the sentences that taught its language. In the listen
    // queue, the front five thousand positions must be 100% translated —
    // and these lines ship German-and-English first, so they must rank
    // behind that front until the translation pass catches up.
    const demoted = added.map((d) => ({
      ...d,
      lines: d.lines.map((line) => ({ lessonPriority: 1, ...line })),
    }));
    merged[key] = { ...base, dialogues: [...(base.dialogues ?? []), ...demoted] };
  }
  return merged;
}
