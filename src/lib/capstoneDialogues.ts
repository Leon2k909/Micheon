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
export const CAPSTONE_DIALOGUES: Record<string, Dialogue[]> = {
  // Keys are quoted so check-catalog-duplicates does not read this record as
  // a second DECLARATION of each pack — the packs live in data.ts alone.
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
        { speaker: "B", de: "Naja, teils teils. Da ist schon was dran, aber so einfach ist das nicht.", en: "Well — so-so. There's something in it, but it's not that simple." },
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
