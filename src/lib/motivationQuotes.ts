/**
 * One motivation line for every day of the year, in all six app languages.
 *
 * NOT interface text, and deliberately not routed through ui(). Everything
 * ui() is handed must exist in every interface table or check-german-interface
 * and its five siblings fail the build — 365 lines would mean 1,825 obligatory
 * entries, and main would be red until the last one landed. These are content:
 * they live here, keyed by nothing, and are read straight out of the array.
 *
 * A motivation line lives on rhythm, not on its words. Where the German does
 * not carry over, these say the thing that language would actually say rather
 * than taking the German apart word by word — "Du schaffst das" is "Dasz radę"
 * in Polish and "Tú puedes" in Spanish, neither of which is a translation of
 * the other. Gendered forms are avoided throughout: the banner does not know
 * who is reading it, so "sei stolz" becomes "masz powód do dumy" rather than
 * "bądź dumny", and French reaches for a noun or a rephrasing wherever an
 * adjective would have to agree.
 *
 * Portuguese is EUROPEAN and uses tu, matching i18nPt and the course; Spanish
 * uses tú.
 *
 * The day decides the line: day 1 takes the first entry, day 2 the second. No
 * randomness and nothing stored, so everyone on the same date reads the same
 * thing and it turns over at midnight. Day 366 of a leap year starts the list
 * again rather than falling off the end.
 */

import { useEffect, useState } from "react";
import { useInterfaceLanguage } from "@/lib/interfaceLanguage";
import type { ResolvedInterfaceLanguage } from "@/lib/interfaceLanguage";

/**
 * English is the one field that must be there, because it is what every other
 * language falls back to. The rest are optional so that a gap shows the
 * English line instead of an empty banner.
 */
/**
 * One line, in every language the app can be read in.
 *
 * Every entry but `en` is optional because the lookup falls back to English,
 * and `it` is optional for that reason and no better one: Italian became an
 * app language before these were translated, so an Italian reader gets the
 * English line. That is a real gap, not a design — the other five are at
 * 365 of 365.
 *
 * The type has to name every ResolvedInterfaceLanguage whether or not the
 * strings exist, because the lookup indexes this by that type. Leaving `it`
 * out did not keep Italian honest; it stopped the project compiling, and main
 * was red from v1.2.807 until this line.
 */
export type MotivationQuote = {
  en: string;
  de?: string;
  fr?: string;
  pl?: string;
  es?: string;
  it?: string;
  pt?: string;
};

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  // 1
  { de: "Du schaffst das.", en: "You've got this.", fr: "Tu vas y arriver.", pl: "Dasz radę.", es: "Tú puedes.", pt: "Tu consegues." },
  // 2
  { de: "Glaub an dich.", en: "Believe in yourself.", fr: "Crois en toi.", pl: "Uwierz w siebie.", es: "Cree en ti.", pt: "Acredita em ti." },
  // 3
  { de: "Heute zählt.", en: "Today counts.", fr: "Aujourd'hui compte.", pl: "Dziś się liczy.", es: "Hoy cuenta.", pt: "Hoje conta." },
  // 4
  { de: "Heute darfst du strahlen.", en: "Today is yours to shine.", fr: "Aujourd'hui, c'est à toi de briller.", pl: "Dziś możesz zabłysnąć.", es: "Hoy te toca brillar.", pt: "Hoje é a tua vez de brilhar." },
  // 5
  { de: "Dein Weg zählt.", en: "Your path matters.", fr: "Ton chemin compte.", pl: "Twoja droga ma znaczenie.", es: "Tu camino importa.", pt: "O teu caminho importa." },
  // 6
  { de: "Dein Moment ist jetzt.", en: "Your moment is now.", fr: "Ton moment, c'est maintenant.", pl: "To jest twój moment.", es: "Tu momento es ahora.", pt: "O teu momento é agora." },
  // 7
  { de: "Du kannst mehr.", en: "You're capable of more.", fr: "Tu es capable de plus.", pl: "Stać cię na więcej.", es: "Tú puedes más.", pt: "Tu podes mais." },
  // 8
  { de: "Schritt für Schritt.", en: "Step by step.", fr: "Pas à pas.", pl: "Krok po kroku.", es: "Paso a paso.", pt: "Passo a passo." },
  // 9
  { de: "Bleib neugierig.", en: "Stay curious.", fr: "Garde ta curiosité.", pl: "Zachowaj ciekawość.", es: "Mantén la curiosidad.", pt: "Mantém a curiosidade." },
  // 10
  { de: "Mach weiter.", en: "Keep going.", fr: "Continue.", pl: "Idź dalej.", es: "Sigue adelante.", pt: "Continua." },
  // 11
  { de: "Sei stolz auf dich.", en: "Be proud of yourself.", fr: "Regarde ce que tu as accompli.", pl: "Masz powód do dumy.", es: "Siente orgullo de ti.", pt: "Tem orgulho em ti." },
  // 12
  { de: "Heute ist deine Chance.", en: "Today is your chance.", fr: "Aujourd'hui est ta chance.", pl: "Dziś jest twoja szansa.", es: "Hoy es tu oportunidad.", pt: "Hoje é a tua oportunidade." },
  // 13
  { de: "Vertrau deinem Weg.", en: "Trust your path.", fr: "Fais confiance à ton chemin.", pl: "Zaufaj swojej drodze.", es: "Confía en tu camino.", pt: "Confia no teu caminho." },
  // 14
  { de: "Kleine Schritte zählen.", en: "Small steps count.", fr: "Les petits pas comptent.", pl: "Małe kroki się liczą.", es: "Los pasos pequeños cuentan.", pt: "Os passos pequenos contam." },
  // 15
  { de: "Du bist bereit.", en: "You're ready.", fr: "Tu as tout ce qu'il faut.", pl: "Możesz zaczynać.", es: "Tienes todo lo que hace falta.", pt: "Tens tudo o que é preciso." },
  // 16
  { de: "Bleib mutig.", en: "Stay brave.", fr: "Garde ton courage.", pl: "Nie trać odwagi.", es: "Mantén el valor.", pt: "Mantém a coragem." },
  // 17
  { de: "Gib dir Zeit.", en: "Give yourself time.", fr: "Donne-toi du temps.", pl: "Daj sobie czas.", es: "Date tiempo.", pt: "Dá-te tempo." },
  // 18
  { de: "Dein Einsatz zählt.", en: "Your effort counts.", fr: "Tes efforts comptent.", pl: "Twój wysiłek się liczy.", es: "Tu esfuerzo cuenta.", pt: "O teu esforço conta." },
  // 19
  { de: "Wachstum braucht Zeit.", en: "Growth takes time.", fr: "Grandir prend du temps.", pl: "Rozwój wymaga czasu.", es: "Crecer lleva tiempo.", pt: "Crescer leva tempo." },
  // 20
  { de: "Du kommst voran.", en: "You're getting somewhere.", fr: "Tu avances.", pl: "Idziesz do przodu.", es: "Vas avanzando.", pt: "Estás a avançar." },
  // 21
  { de: "Bleib dran.", en: "Stick with it.", fr: "Tiens bon.", pl: "Nie odpuszczaj.", es: "No lo dejes.", pt: "Não desistas." },
  // 22
  { de: "Alles beginnt mit Mut.", en: "It all starts with courage.", fr: "Tout commence par le courage.", pl: "Wszystko zaczyna się od odwagi.", es: "Todo empieza con valor.", pt: "Tudo começa com coragem." },
  // 23
  { de: "Heute wird gut.", en: "Today will be a good one.", fr: "Aujourd'hui sera une bonne journée.", pl: "Dziś będzie dobry dzień.", es: "Hoy va a ser un buen día.", pt: "Hoje vai ser um bom dia." },
  // 24
  { de: "Trau dich.", en: "Go for it.", fr: "Ose.", pl: "Odważ się.", es: "Atrévete.", pt: "Atreve-te." },
  // 25
  { de: "Du bist stärker als gestern.", en: "You're stronger than yesterday.", fr: "Tu as plus de force qu'hier.", pl: "Masz w sobie więcej siły niż wczoraj.", es: "Eres más fuerte que ayer.", pt: "És mais forte do que ontem." },
  // 26
  { de: "Jeder Anfang zählt.", en: "Every beginning counts.", fr: "Chaque début compte.", pl: "Każdy początek się liczy.", es: "Cada comienzo cuenta.", pt: "Cada começo conta." },
  // 27
  { de: "Dein Tempo ist richtig.", en: "Your pace is the right one.", fr: "Ton rythme est le bon.", pl: "Twoje tempo jest właściwe.", es: "Tu ritmo es el correcto.", pt: "O teu ritmo é o certo." },
  // 28
  { de: "Lass dich nicht aufhalten.", en: "Don't let anything stop you.", fr: "Ne laisse rien t'arrêter.", pl: "Nie daj się zatrzymać.", es: "Que nada te detenga.", pt: "Não deixes que nada te pare." },
  // 29
  { de: "Du wächst daran.", en: "This is how you grow.", fr: "C'est ainsi que tu grandis.", pl: "To cię rozwija.", es: "Con esto creces.", pt: "É assim que cresces." },
  // 30
  { de: "Mach es für dich.", en: "Do it for yourself.", fr: "Fais-le pour toi.", pl: "Zrób to dla siebie.", es: "Hazlo por ti.", pt: "Fá-lo por ti." },
  // 31
  { de: "Sei dein eigener Antrieb.", en: "Be your own engine.", fr: "Sois ton propre moteur.", pl: "Bądź własnym napędem.", es: "Sé tu propio motor.", pt: "Sê o teu próprio motor." },
  // 32
  { de: "Heute beginnt etwas Neues.", en: "Something new begins today.", fr: "Quelque chose de nouveau commence aujourd'hui.", pl: "Dziś zaczyna się coś nowego.", es: "Hoy empieza algo nuevo.", pt: "Hoje começa algo novo." },
  // 33
  { de: "Vertrau dir.", en: "Trust yourself.", fr: "Fais-toi confiance.", pl: "Zaufaj sobie.", es: "Confía en ti.", pt: "Confia em ti." },
  // 34
  { de: "Dein Mut lohnt sich.", en: "Your courage pays off.", fr: "Ton courage en vaut la peine.", pl: "Twoja odwaga się opłaca.", es: "Tu valentía vale la pena.", pt: "A tua coragem vale a pena." },
  // 35
  { de: "Jeder Fortschritt zählt.", en: "Every bit of progress counts.", fr: "Chaque progrès compte.", pl: "Każdy postęp się liczy.", es: "Cada avance cuenta.", pt: "Cada progresso conta." },
  // 36
  { de: "Du bist auf dem Weg.", en: "You're on your way.", fr: "Tu es en chemin.", pl: "Jesteś w drodze.", es: "Vas por buen camino.", pt: "Estás a caminho." },
  // 37
  { de: "Bleib fokussiert.", en: "Stay focused.", fr: "Ne te disperse pas.", pl: "Nie trać skupienia.", es: "Mantén la concentración.", pt: "Mantém o foco." },
  // 38
  { de: "Es lohnt sich.", en: "It's worth it.", fr: "Ça en vaut la peine.", pl: "Warto.", es: "Merece la pena.", pt: "Vale a pena." },
  // 39
  { de: "Deine Zeit kommt.", en: "Your time will come.", fr: "Ton heure viendra.", pl: "Twój czas nadejdzie.", es: "Tu momento llegará.", pt: "O teu tempo há de chegar." },
  // 40
  { de: "Wähle deinen Weg.", en: "Choose your path.", fr: "Choisis ton chemin.", pl: "Wybierz swoją drogę.", es: "Elige tu camino.", pt: "Escolhe o teu caminho." },
  // 41
  { de: "Sei offen für Neues.", en: "Stay open to something new.", fr: "Ouvre-toi à la nouveauté.", pl: "Otwórz się na nowe.", es: "Ábrete a lo nuevo.", pt: "Abre-te ao que é novo." },
  // 42
  { de: "Du machst Fortschritte.", en: "You're making progress.", fr: "Tu progresses.", pl: "Robisz postępy.", es: "Estás avanzando.", pt: "Estás a progredir." },
  // 43
  { de: "Alles darf wachsen.", en: "Everything is allowed to grow.", fr: "Tout a le droit de grandir.", pl: "Wszystko ma prawo rosnąć.", es: "Todo tiene derecho a crecer.", pt: "Tudo tem direito a crescer." },
  // 44
  { de: "Bleib hoffnungsvoll.", en: "Keep your hope.", fr: "Garde espoir.", pl: "Nie trać nadziei.", es: "No pierdas la esperanza.", pt: "Não percas a esperança." },
  // 45
  { de: "Sei stolz auf heute.", en: "Be proud of today.", fr: "Aujourd'hui mérite ta fierté.", pl: "Dziś masz powód do dumy.", es: "Hoy merece tu orgullo.", pt: "Hoje merece o teu orgulho." },
  // 46
  { de: "Mach dich stolz.", en: "Make yourself proud.", fr: "Fais-toi honneur.", pl: "Daj sobie powód do dumy.", es: "Date un motivo de orgullo.", pt: "Dá a ti um motivo de orgulho." },
  // 47
  { de: "Heute kannst du wachsen.", en: "Today you can grow.", fr: "Aujourd'hui, tu peux grandir.", pl: "Dziś możesz się rozwinąć.", es: "Hoy puedes crecer.", pt: "Hoje podes crescer." },
  // 48
  { de: "Denk groß.", en: "Think big.", fr: "Vois grand.", pl: "Myśl z rozmachem.", es: "Piensa en grande.", pt: "Pensa em grande." },
  // 49
  { de: "Beginne klein.", en: "Start small.", fr: "Commence petit.", pl: "Zacznij od małego.", es: "Empieza por lo pequeño.", pt: "Começa pelo pequeno." },
  // 50
  { de: "Bleib dir treu.", en: "Stay true to yourself.", fr: "Reste fidèle à toi-même.", pl: "Pozostań sobą.", es: "Sé fiel a ti.", pt: "Sê fiel a ti." },
  // 51
  { de: "Du hast Potenzial.", en: "You have potential.", fr: "Tu as du potentiel.", pl: "Masz potencjał.", es: "Tienes potencial.", pt: "Tens potencial." },
  // 52
  { de: "Jeder Schritt verändert etwas.", en: "Every step changes something.", fr: "Chaque pas change quelque chose.", pl: "Każdy krok coś zmienia.", es: "Cada paso cambia algo.", pt: "Cada passo muda alguma coisa." },
  // 53
  { de: "Dein Morgen beginnt heute.", en: "Your tomorrow starts today.", fr: "Ton demain commence aujourd'hui.", pl: "Twoje jutro zaczyna się dziś.", es: "Tu mañana empieza hoy.", pt: "O teu amanhã começa hoje." },
  // 54
  { de: "Sei geduldig mit dir.", en: "Be patient with yourself.", fr: "Va doucement avec toi-même.", pl: "Miej do siebie cierpliwość.", es: "Ten paciencia contigo.", pt: "Tem paciência contigo." },
  // 55
  { de: "Du darfst neu anfangen.", en: "You're allowed to start over.", fr: "Tu as le droit de recommencer.", pl: "Masz prawo zacząć od nowa.", es: "Tienes derecho a empezar de nuevo.", pt: "Tens o direito de recomeçar." },
  // 56
  { de: "Mut verändert alles.", en: "Courage changes everything.", fr: "Le courage change tout.", pl: "Odwaga zmienia wszystko.", es: "El valor lo cambia todo.", pt: "A coragem muda tudo." },
  // 57
  { de: "Bleib auf Kurs.", en: "Hold your course.", fr: "Garde le cap.", pl: "Trzymaj kurs.", es: "Mantén el rumbo.", pt: "Mantém o rumo." },
  // 58
  { de: "Deine Träume zählen.", en: "Your dreams matter.", fr: "Tes rêves comptent.", pl: "Twoje marzenia się liczą.", es: "Tus sueños importan.", pt: "Os teus sonhos importam." },
  // 59
  { de: "Heute ist ein guter Anfang.", en: "Today is a good place to start.", fr: "Aujourd'hui est un bon début.", pl: "Dziś to dobry początek.", es: "Hoy es un buen comienzo.", pt: "Hoje é um bom começo." },
  // 60
  { de: "Du kannst stolz sein.", en: "You have every reason to be proud.", fr: "Tu peux en tirer de la fierté.", pl: "Możesz czuć dumę.", es: "Puedes sentir orgullo.", pt: "Podes sentir orgulho." },
  // 61
  { de: "Folge deinem Herzen.", en: "Follow your heart.", fr: "Suis ton cœur.", pl: "Idź za głosem serca.", es: "Sigue a tu corazón.", pt: "Segue o teu coração." },
  // 62
  { de: "Gib dein Bestes.", en: "Give it your best.", fr: "Donne le meilleur de toi.", pl: "Daj z siebie wszystko.", es: "Da lo mejor de ti.", pt: "Dá o teu melhor." },
  // 63
  { de: "Dein Weg ist einzigartig.", en: "Your path is yours alone.", fr: "Ton chemin n'appartient qu'à toi.", pl: "Twoja droga jest jedyna w swoim rodzaju.", es: "Tu camino es único.", pt: "O teu caminho é único." },
  // 64
  { de: "Bleib positiv.", en: "Keep your head up.", fr: "Garde le sourire.", pl: "Zachowaj pogodę ducha.", es: "No pierdas el ánimo.", pt: "Mantém o ânimo." },
  // 65
  { de: "Du wirst besser.", en: "You're getting better.", fr: "Tu t'améliores.", pl: "Jest coraz lepiej.", es: "Cada vez lo haces mejor.", pt: "Estás cada vez melhor." },
  // 66
  { de: "Wachstum beginnt im Kleinen.", en: "Growth starts small.", fr: "Grandir commence par un détail.", pl: "Rozwój zaczyna się od drobiazgów.", es: "Crecer empieza por lo pequeño.", pt: "Crescer começa pelo pequeno." },
  // 67
  { de: "Heute gehört dir.", en: "Today belongs to you.", fr: "Aujourd'hui t'appartient.", pl: "Dziś należy do ciebie.", es: "Hoy es tuyo.", pt: "Hoje é teu." },
  // 68
  { de: "Lass deine Zweifel los.", en: "Let your doubts go.", fr: "Laisse tomber tes doutes.", pl: "Odpuść wątpliwości.", es: "Suelta tus dudas.", pt: "Larga as tuas dúvidas." },
  // 69
  { de: "Du bist näher als gestern.", en: "You're closer than you were yesterday.", fr: "Tu es plus près qu'hier.", pl: "Jesteś bliżej niż wczoraj.", es: "Estás más cerca que ayer.", pt: "Estás mais perto do que ontem." },
  // 70
  { de: "Es beginnt mit dir.", en: "It starts with you.", fr: "Tout commence par toi.", pl: "Wszystko zaczyna się od ciebie.", es: "Empieza por ti.", pt: "Começa por ti." },
  // 71
  { de: "Hab Vertrauen.", en: "Have faith.", fr: "Aie confiance.", pl: "Miej zaufanie.", es: "Ten confianza.", pt: "Tem confiança." },
  // 72
  { de: "Bleib in Bewegung.", en: "Keep moving.", fr: "Reste en mouvement.", pl: "Bądź w ruchu.", es: "No te pares.", pt: "Não pares." },
  // 73
  { de: "Dein Ziel wartet.", en: "Your goal is waiting.", fr: "Ton objectif t'attend.", pl: "Twój cel czeka.", es: "Tu meta te espera.", pt: "O teu objetivo espera por ti." },
  // 74
  { de: "Sei mutiger als deine Zweifel.", en: "Be braver than your doubts.", fr: "Que ton courage passe avant tes doutes.", pl: "Niech odwaga będzie silniejsza od wątpliwości.", es: "Que tu valor pese más que tus dudas.", pt: "Que a tua coragem seja maior do que as dúvidas." },
  // 75
  { de: "Du kannst neu beginnen.", en: "You can begin again.", fr: "Tu peux repartir de zéro.", pl: "Możesz zacząć od nowa.", es: "Puedes volver a empezar.", pt: "Podes voltar a começar." },
  // 76
  { de: "Gutes braucht manchmal Zeit.", en: "Good things sometimes take time.", fr: "Ce qui est bon prend parfois du temps.", pl: "Dobre rzeczy czasem potrzebują czasu.", es: "Lo bueno a veces tarda.", pt: "O que é bom às vezes demora." },
  // 77
  { de: "Deine Stärke wächst.", en: "Your strength is growing.", fr: "Ta force grandit.", pl: "Twoja siła rośnie.", es: "Tu fuerza crece.", pt: "A tua força cresce." },
  // 78
  { de: "Geh deinen Weg.", en: "Walk your own way.", fr: "Suis ton chemin.", pl: "Idź swoją drogą.", es: "Sigue tu camino.", pt: "Segue o teu caminho." },
  // 79
  { de: "Bleib zuversichtlich.", en: "Keep your confidence.", fr: "Garde confiance.", pl: "Nie trać wiary.", es: "No pierdas la confianza.", pt: "Não percas a confiança." },
  // 80
  { de: "Vor dir liegt noch viel.", en: "There's a lot ahead of you.", fr: "Il te reste beaucoup à découvrir.", pl: "Wiele jeszcze przed tobą.", es: "Te queda mucho por delante.", pt: "Tens muito pela frente." },
  // 81
  { de: "Nutze diesen Augenblick.", en: "Make use of this moment.", fr: "Profite de cet instant.", pl: "Wykorzystaj tę chwilę.", es: "Aprovecha este momento.", pt: "Aproveita este momento." },
  // 82
  { de: "Deine Mühe zahlt sich aus.", en: "Your effort will pay off.", fr: "Tes efforts porteront leurs fruits.", pl: "Twój trud się opłaci.", es: "Tu esfuerzo dará fruto.", pt: "O teu esforço vai dar frutos." },
  // 83
  { de: "Du darfst langsam wachsen.", en: "You're allowed to grow slowly.", fr: "Tu as le droit de grandir lentement.", pl: "Masz prawo rosnąć powoli.", es: "Tienes derecho a crecer despacio.", pt: "Tens o direito de crescer devagar." },
  // 84
  { de: "Sei stolz auf jeden Schritt.", en: "Be proud of every step.", fr: "Chaque pas mérite ta fierté.", pl: "Każdy krok to powód do dumy.", es: "Cada paso merece tu orgullo.", pt: "Cada passo merece o teu orgulho." },
  // 85
  { de: "Neues darf entstehen.", en: "Let something new take shape.", fr: "Laisse le neuf prendre forme.", pl: "Niech powstanie coś nowego.", es: "Deja que nazca algo nuevo.", pt: "Deixa nascer algo novo." },
  // 86
  { de: "Dein Mut bringt dich weiter.", en: "Your courage carries you forward.", fr: "Ton courage te porte plus loin.", pl: "Odwaga poprowadzi cię dalej.", es: "Tu valor te lleva más lejos.", pt: "A tua coragem leva-te mais longe." },
  // 87
  { de: "Du bestimmst die Richtung.", en: "You set the direction.", fr: "C'est toi qui décides de la direction.", pl: "To ty wyznaczasz kierunek.", es: "La dirección la eliges tú.", pt: "A direção é tua." },
  // 88
  { de: "Mach den nächsten Schritt.", en: "Take the next step.", fr: "Fais le pas suivant.", pl: "Zrób następny krok.", es: "Da el siguiente paso.", pt: "Dá o próximo passo." },
  // 89
  { de: "Jeder Tag ist eine Chance.", en: "Every day is a chance.", fr: "Chaque jour est une chance.", pl: "Każdy dzień to szansa.", es: "Cada día es una oportunidad.", pt: "Cada dia é uma oportunidade." },
  // 90
  { de: "Du hast es in dir.", en: "It's already in you.", fr: "Tu l'as en toi.", pl: "Masz to w sobie.", es: "Lo llevas dentro.", pt: "Tens isso dentro de ti." },
  // 91
  { de: "Deine Zukunft beginnt jetzt.", en: "Your future starts now.", fr: "Ton avenir commence maintenant.", pl: "Twoja przyszłość zaczyna się teraz.", es: "Tu futuro empieza ahora.", pt: "O teu futuro começa agora." },
  // 92
  { de: "Hoffnung trägt dich weiter.", en: "Hope carries you on.", fr: "L'espoir te porte.", pl: "Nadzieja niesie cię dalej.", es: "La esperanza te lleva más lejos.", pt: "A esperança leva-te mais longe." },
  // 93
  { de: "Du darfst groß träumen.", en: "You're allowed to dream big.", fr: "Tu as le droit de rêver grand.", pl: "Masz prawo do wielkich marzeń.", es: "Tienes derecho a soñar en grande.", pt: "Tens o direito de sonhar alto." },
  // 94
  { de: "Heute lohnt sich dein Einsatz.", en: "Today your effort is worth it.", fr: "Aujourd'hui, tes efforts en valent la peine.", pl: "Dziś twój wysiłek się opłaca.", es: "Hoy tu esfuerzo merece la pena.", pt: "Hoje o teu esforço vale a pena." },
  // 95
  { de: "Lass dich überraschen.", en: "Let yourself be surprised.", fr: "Laisse-toi surprendre.", pl: "Daj się zaskoczyć.", es: "Déjate sorprender.", pt: "Deixa-te surpreender." },
  // 96
  { de: "Vertraue deiner Richtung.", en: "Trust the direction you've chosen.", fr: "Fais confiance à ta direction.", pl: "Zaufaj swojemu kierunkowi.", es: "Confía en tu rumbo.", pt: "Confia no teu rumo." },
  // 97
  { de: "Dein Wille zählt.", en: "Your will counts.", fr: "Ta volonté compte.", pl: "Twoja wola się liczy.", es: "Tu voluntad cuenta.", pt: "A tua vontade conta." },
  // 98
  { de: "Veränderung beginnt klein.", en: "Change starts small.", fr: "Le changement commence petit.", pl: "Zmiana zaczyna się od drobiazgu.", es: "El cambio empieza por lo pequeño.", pt: "A mudança começa pelo pequeno." },
  // 99
  { de: "Begrüße das Neue.", en: "Welcome what's new.", fr: "Accueille la nouveauté.", pl: "Przywitaj to, co nowe.", es: "Da la bienvenida a lo nuevo.", pt: "Dá as boas-vindas ao que é novo." },
  // 100
  { de: "Lernen bringt dich weiter.", en: "Learning takes you further.", fr: "Apprendre te mène plus loin.", pl: "Nauka prowadzi cię dalej.", es: "Aprender te lleva más lejos.", pt: "Aprender leva-te mais longe." },
  // 101
  { de: "Mach heute den Unterschied.", en: "Make today the difference.", fr: "Fais la différence aujourd'hui.", pl: "Dziś zrób różnicę.", es: "Marca la diferencia hoy.", pt: "Faz a diferença hoje." },
  // 102
  { de: "Halte dein Ziel im Blick.", en: "Keep your goal in sight.", fr: "Garde ton objectif en vue.", pl: "Miej cel przed oczami.", es: "No pierdas de vista tu meta.", pt: "Não percas o teu objetivo de vista." },
  // 103
  { de: "Jeden Tag ein Stück weiter.", en: "A little further every day.", fr: "Un peu plus loin chaque jour.", pl: "Każdego dnia kawałek dalej.", es: "Un poco más lejos cada día.", pt: "Um pouco mais longe a cada dia." },
  // 104
  { de: "Großes wächst aus Kleinem.", en: "Big things grow from small ones.", fr: "Les grandes choses naissent des petites.", pl: "Wielkie rzeczy rosną z małych.", es: "Lo grande nace de lo pequeño.", pt: "O grande nasce do pequeno." },
  // 105
  { de: "Deine Chance ist jetzt.", en: "Your chance is now.", fr: "Ta chance, c'est maintenant.", pl: "Twoja szansa jest teraz.", es: "Tu oportunidad es ahora.", pt: "A tua oportunidade é agora." },
  // 106
  { de: "Sei stärker als deine Ausreden.", en: "Be stronger than your excuses.", fr: "Ne te laisse pas convaincre par tes excuses.", pl: "Nie daj się wymówkom.", es: "Que tus excusas no te ganen.", pt: "Não deixes que as desculpas ganhem." },
  // 107
  { de: "Neue Wege warten auf dich.", en: "New paths are waiting for you.", fr: "De nouveaux chemins t'attendent.", pl: "Czekają na ciebie nowe drogi.", es: "Te esperan caminos nuevos.", pt: "Há caminhos novos à tua espera." },
  // 108
  { de: "Du kannst den Anfang machen.", en: "You can make the start.", fr: "C'est toi qui peux commencer.", pl: "To ty możesz zacząć.", es: "Puedes dar tú el primer paso.", pt: "Podes ser tu a começar." },
  // 109
  { de: "Lass deinen Mut sprechen.", en: "Let your courage speak.", fr: "Laisse parler ton courage.", pl: "Niech przemówi twoja odwaga.", es: "Deja hablar a tu valor.", pt: "Deixa falar a tua coragem." },
  // 110
  { de: "Deine Schritte hinterlassen Spuren.", en: "Your steps leave a trace.", fr: "Tes pas laissent une trace.", pl: "Twoje kroki zostawiają ślad.", es: "Tus pasos dejan huella.", pt: "Os teus passos deixam marca." },
  // 111
  { de: "Starte mit neuer Energie.", en: "Start with fresh energy.", fr: "Repars avec de l'énergie neuve.", pl: "Zacznij z nową energią.", es: "Empieza con energía nueva.", pt: "Começa com energia nova." },
  // 112
  { de: "Weitergehen lohnt sich.", en: "Going on is worth it.", fr: "Continuer en vaut la peine.", pl: "Warto iść dalej.", es: "Seguir merece la pena.", pt: "Vale a pena continuar." },
  // 113
  { de: "Dein Traum verdient Mut.", en: "Your dream deserves courage.", fr: "Ton rêve mérite du courage.", pl: "Twoje marzenie zasługuje na odwagę.", es: "Tu sueño merece valor.", pt: "O teu sonho merece coragem." },
  // 114
  { de: "Dieser Tag gehört dir.", en: "This day is yours.", fr: "Cette journée est à toi.", pl: "Ten dzień należy do ciebie.", es: "Este día es tuyo.", pt: "Este dia é teu." },
  // 115
  { de: "Gib nicht zu früh auf.", en: "Don't give up too soon.", fr: "N'abandonne pas trop tôt.", pl: "Nie poddawaj się za wcześnie.", es: "No te rindas demasiado pronto.", pt: "Não desistas cedo demais." },
  // 116
  { de: "Überrasche dich selbst.", en: "Surprise yourself.", fr: "Surprends-toi.", pl: "Zaskocz siebie.", es: "Sorpréndete.", pt: "Surpreende-te." },
  // 117
  { de: "Dein Mut macht dich stolz.", en: "Your courage is something to be proud of.", fr: "Ton courage est une raison de fierté.", pl: "Twoja odwaga to powód do dumy.", es: "Tu valor es motivo de orgullo.", pt: "A tua coragem é motivo de orgulho." },
  // 118
  { de: "Erkenne deinen Fortschritt.", en: "Notice how far you've come.", fr: "Vois le chemin parcouru.", pl: "Zauważ swój postęp.", es: "Reconoce tu avance.", pt: "Repara no teu progresso." },
  // 119
  { de: "Behalte dein Ziel im Herzen.", en: "Keep your goal close to your heart.", fr: "Garde ton objectif au cœur.", pl: "Zachowaj swój cel w sercu.", es: "Guarda tu meta en el corazón.", pt: "Guarda o teu objetivo no coração." },
  // 120
  { de: "Der Weg liegt vor dir.", en: "The road is ahead of you.", fr: "Le chemin est devant toi.", pl: "Droga jest przed tobą.", es: "El camino está por delante.", pt: "O caminho está à tua frente." },
  // 121
  { de: "Jeder Versuch zählt.", en: "Every attempt counts.", fr: "Chaque tentative compte.", pl: "Każda próba się liczy.", es: "Cada intento cuenta.", pt: "Cada tentativa conta." },
  // 122
  { de: "Wachstum darf Freude machen.", en: "Growing can be a joy.", fr: "Grandir peut être un plaisir.", pl: "Rozwój może sprawiać radość.", es: "Crecer puede dar alegría.", pt: "Crescer pode dar alegria." },
  // 123
  { de: "Dein Weg darf anders sein.", en: "Your path is allowed to look different.", fr: "Ton chemin a le droit d'être différent.", pl: "Twoja droga może być inna.", es: "Tu camino puede ser distinto.", pt: "O teu caminho pode ser diferente." },
  // 124
  { de: "Schenk dir selbst Vertrauen.", en: "Give yourself some trust.", fr: "Accorde-toi ta confiance.", pl: "Obdarz siebie zaufaniem.", es: "Regálate confianza.", pt: "Dá-te confiança." },
  // 125
  { de: "Du wirst deinen Weg finden.", en: "You'll find your way.", fr: "Tu trouveras ton chemin.", pl: "Znajdziesz swoją drogę.", es: "Encontrarás tu camino.", pt: "Vais encontrar o teu caminho." },
  // 126
  { de: "Vieles kann sich verändern.", en: "A lot can change.", fr: "Beaucoup de choses peuvent changer.", pl: "Wiele może się zmienić.", es: "Muchas cosas pueden cambiar.", pt: "Muita coisa pode mudar." },
  // 127
  { de: "Deine Entscheidung zählt.", en: "Your decision counts.", fr: "Ta décision compte.", pl: "Twoja decyzja się liczy.", es: "Tu decisión cuenta.", pt: "A tua decisão conta." },
  // 128
  { de: "Bleib entschlossen.", en: "Stay determined.", fr: "Garde ta détermination.", pl: "Nie trać determinacji.", es: "Mantén la determinación.", pt: "Mantém a determinação." },
  // 129
  { de: "Der erste Schritt wartet.", en: "The first step is waiting.", fr: "Le premier pas t'attend.", pl: "Pierwszy krok czeka.", es: "El primer paso te espera.", pt: "O primeiro passo espera por ti." },
  // 130
  { de: "Dein Ziel ist erreichbar.", en: "Your goal is within reach.", fr: "Ton objectif est à ta portée.", pl: "Twój cel jest w zasięgu.", es: "Tu meta está a tu alcance.", pt: "O teu objetivo está ao teu alcance." },
  // 131
  { de: "Mut beginnt mit einem Schritt.", en: "Courage starts with one step.", fr: "Le courage commence par un pas.", pl: "Odwaga zaczyna się od jednego kroku.", es: "El valor empieza con un paso.", pt: "A coragem começa com um passo." },
  // 132
  { de: "Schau, wie weit du bist.", en: "Look how far you've come.", fr: "Regarde le chemin déjà fait.", pl: "Zobacz, jak daleko już jesteś.", es: "Mira lo lejos que has llegado.", pt: "Olha até onde já chegaste." },
  // 133
  { de: "Vertraue dem Prozess.", en: "Trust the process.", fr: "Fais confiance au processus.", pl: "Zaufaj procesowi.", es: "Confía en el proceso.", pt: "Confia no processo." },
  // 134
  { de: "Der Tag hält Chancen bereit.", en: "The day has chances in store.", fr: "La journée réserve des occasions.", pl: "Ten dzień niesie szanse.", es: "El día trae oportunidades.", pt: "O dia guarda oportunidades." },
  // 135
  { de: "Du kannst etwas bewegen.", en: "You can move something.", fr: "Tu peux faire bouger les choses.", pl: "Możesz coś poruszyć.", es: "Puedes cambiar las cosas.", pt: "Podes mudar as coisas." },
  // 136
  { de: "Bleib deiner Vision treu.", en: "Stay true to your vision.", fr: "Reste fidèle à ta vision.", pl: "Nie porzucaj swojej wizji.", es: "Sé fiel a tu visión.", pt: "Sê fiel à tua visão." },
  // 137
  { de: "Jeder Tag bringt Neues.", en: "Every day brings something new.", fr: "Chaque jour apporte du nouveau.", pl: "Każdy dzień przynosi coś nowego.", es: "Cada día trae algo nuevo.", pt: "Cada dia traz algo novo." },
  // 138
  { de: "Dein Einsatz macht den Unterschied.", en: "Your effort makes the difference.", fr: "Tes efforts font la différence.", pl: "Twój wysiłek robi różnicę.", es: "Tu esfuerzo marca la diferencia.", pt: "O teu esforço faz a diferença." },
  // 139
  { de: "Du darfst Fehler machen.", en: "You're allowed to make mistakes.", fr: "Tu as le droit de te tromper.", pl: "Masz prawo popełniać błędy.", es: "Tienes derecho a equivocarte.", pt: "Tens o direito de errar." },
  // 140
  { de: "Fehler lassen dich wachsen.", en: "Mistakes are how you grow.", fr: "Les erreurs te font grandir.", pl: "Błędy cię rozwijają.", es: "Los errores te hacen crecer.", pt: "Os erros fazem-te crescer." },
  // 141
  { de: "Wachse über gestern hinaus.", en: "Grow past yesterday.", fr: "Va plus loin qu'hier.", pl: "Wyrośnij ponad wczoraj.", es: "Ve más allá de ayer.", pt: "Vai além do que foste ontem." },
  // 142
  { de: "Dein Weg entsteht beim Gehen.", en: "The path appears as you walk it.", fr: "Le chemin se fait en marchant.", pl: "Droga powstaje, gdy idziesz.", es: "El camino se hace al andar.", pt: "O caminho faz-se caminhando." },
  // 143
  { de: "Blick stolz zurück.", en: "Look back with pride.", fr: "Regarde en arrière avec fierté.", pl: "Spójrz wstecz z dumą.", es: "Mira atrás con orgullo.", pt: "Olha para trás com orgulho." },
  // 144
  { de: "Folge deiner eigenen Richtung.", en: "Follow your own direction.", fr: "Suis ta propre direction.", pl: "Idź własnym kierunkiem.", es: "Sigue tu propia dirección.", pt: "Segue a tua própria direção." },
  // 145
  { de: "Mach heute zu deinem Tag.", en: "Make today your day.", fr: "Fais d'aujourd'hui ta journée.", pl: "Uczyń z dziś swój dzień.", es: "Haz de hoy tu día.", pt: "Faz de hoje o teu dia." },
  // 146
  { de: "Du verdienst deinen Erfolg.", en: "Your success is earned.", fr: "Ta réussite, tu l'as méritée.", pl: "Zasługujesz na swój sukces.", es: "Mereces tu éxito.", pt: "Mereces o teu sucesso." },
  // 147
  { de: "Kleine Erfolge sind Erfolge.", en: "Small wins are wins.", fr: "Les petites victoires sont des victoires.", pl: "Małe sukcesy to też sukcesy.", es: "Los logros pequeños son logros.", pt: "As vitórias pequenas são vitórias." },
  // 148
  { de: "Der nächste Schritt zählt.", en: "The next step is the one that counts.", fr: "C'est le pas suivant qui compte.", pl: "Liczy się następny krok.", es: "Lo que cuenta es el siguiente paso.", pt: "O que conta é o próximo passo." },
  // 149
  { de: "Lass dich nicht entmutigen.", en: "Don't let it discourage you.", fr: "Ne te décourage pas.", pl: "Nie zniechęcaj się.", es: "No te desanimes.", pt: "Não te desanimes." },
  // 150
  { de: "Du bist voller Möglichkeiten.", en: "You're full of possibility.", fr: "Les possibilités ne te manquent pas.", pl: "Jest w tobie mnóstwo możliwości.", es: "No te faltan posibilidades.", pt: "Não te faltam possibilidades." },
  // 151
  { de: "Mehr steckt in dir.", en: "There's more in you.", fr: "Il y a plus en toi.", pl: "Jest w tobie więcej.", es: "Hay más dentro de ti.", pt: "Há mais dentro de ti." },
  // 152
  { de: "Geduld bringt dich weiter.", en: "Patience takes you further.", fr: "La patience te mène plus loin.", pl: "Cierpliwość prowadzi cię dalej.", es: "La paciencia te lleva más lejos.", pt: "A paciência leva-te mais longe." },
  // 153
  { de: "Dein Ziel kommt näher.", en: "Your goal is getting closer.", fr: "Ton objectif se rapproche.", pl: "Twój cel jest coraz bliżej.", es: "Tu meta se acerca.", pt: "O teu objetivo está mais perto." },
  // 154
  { de: "Du bist stärker geworden.", en: "You've grown stronger.", fr: "Tu as gagné en force.", pl: "Twoja siła urosła.", es: "Has ganado fuerza.", pt: "Ganhaste força." },
  // 155
  { de: "Bewahre deinen Schwung.", en: "Keep your momentum.", fr: "Garde ton élan.", pl: "Nie trać rozpędu.", es: "No pierdas el impulso.", pt: "Não percas o impulso." },
  // 156
  { de: "Deine Reise zählt.", en: "Your journey matters.", fr: "Ton voyage compte.", pl: "Twoja podróż ma znaczenie.", es: "Tu viaje importa.", pt: "A tua viagem importa." },
  // 157
  { de: "Du kannst Grenzen verschieben.", en: "You can move your limits.", fr: "Tu peux repousser tes limites.", pl: "Możesz przesuwać granice.", es: "Puedes mover tus límites.", pt: "Podes empurrar os teus limites." },
  // 158
  { de: "Heute ist eine neue Seite.", en: "Today is a fresh page.", fr: "Aujourd'hui est une page blanche.", pl: "Dziś to nowa strona.", es: "Hoy es una página nueva.", pt: "Hoje é uma página nova." },
  // 159
  { de: "Schreib deine Geschichte.", en: "Write your own story.", fr: "Écris ton histoire.", pl: "Napisz swoją historię.", es: "Escribe tu historia.", pt: "Escreve a tua história." },
  // 160
  { de: "Sei mutig genug anzufangen.", en: "Be brave enough to begin.", fr: "Aie le courage de commencer.", pl: "Miej odwagę zacząć.", es: "Ten el valor de empezar.", pt: "Tem a coragem de começar." },
  // 161
  { de: "Vor dir liegt dein Weg.", en: "Your path lies ahead.", fr: "C'est ton chemin qui s'ouvre devant toi.", pl: "Przed tobą twoja droga.", es: "Ante ti está tu camino.", pt: "À tua frente está o teu caminho." },
  // 162
  { de: "Entdecke, was in dir steckt.", en: "Find out what's in you.", fr: "Découvre ce que tu as en toi.", pl: "Odkryj, co w tobie drzemie.", es: "Descubre lo que llevas dentro.", pt: "Descobre o que tens dentro de ti." },
  // 163
  { de: "Du kannst dich entwickeln.", en: "You can develop.", fr: "Tu peux évoluer.", pl: "Możesz się rozwijać.", es: "Puedes evolucionar.", pt: "Podes evoluir." },
  // 164
  { de: "Jeder Morgen bringt Chancen.", en: "Every morning brings chances.", fr: "Chaque matin apporte des occasions.", pl: "Każdy poranek przynosi szanse.", es: "Cada mañana trae oportunidades.", pt: "Cada manhã traz oportunidades." },
  // 165
  { de: "Deine Ideen verdienen Raum.", en: "Your ideas deserve room.", fr: "Tes idées méritent de la place.", pl: "Twoje pomysły zasługują na miejsce.", es: "Tus ideas merecen espacio.", pt: "As tuas ideias merecem espaço." },
  // 166
  { de: "Glaube an deine Fähigkeiten.", en: "Believe in what you can do.", fr: "Crois en tes capacités.", pl: "Uwierz w swoje możliwości.", es: "Cree en tus capacidades.", pt: "Acredita nas tuas capacidades." },
  // 167
  { de: "Lass dein Licht leuchten.", en: "Let your light shine.", fr: "Laisse briller ta lumière.", pl: "Niech twoje światło świeci.", es: "Deja brillar tu luz.", pt: "Deixa a tua luz brilhar." },
  // 168
  { de: "Vertrauen lässt dich wachsen.", en: "Trust is what lets you grow.", fr: "La confiance te fait grandir.", pl: "Zaufanie pozwala ci rosnąć.", es: "La confianza te hace crecer.", pt: "A confiança faz-te crescer." },
  // 169
  { de: "Dein Mut kennt den Weg.", en: "Your courage knows the way.", fr: "Ton courage connaît le chemin.", pl: "Twoja odwaga zna drogę.", es: "Tu valor conoce el camino.", pt: "A tua coragem conhece o caminho." },
  // 170
  { de: "Du kannst Berge bewegen.", en: "You can move mountains.", fr: "Tu peux déplacer des montagnes.", pl: "Możesz przenosić góry.", es: "Puedes mover montañas.", pt: "Podes mover montanhas." },
  // 171
  { de: "Glaube macht vieles möglich.", en: "Belief makes a lot possible.", fr: "La foi rend bien des choses possibles.", pl: "Wiara wiele umożliwia.", es: "La fe hace posible mucho.", pt: "A fé torna muita coisa possível." },
  // 172
  { de: "Dein Traum ist es wert.", en: "Your dream is worth it.", fr: "Ton rêve en vaut la peine.", pl: "Twoje marzenie jest tego warte.", es: "Tu sueño lo vale.", pt: "O teu sonho vale a pena." },
  // 173
  { de: "Bleib deinem Herzen nah.", en: "Stay close to your heart.", fr: "Reste près de ton cœur.", pl: "Trzymaj się blisko serca.", es: "Mantente cerca de tu corazón.", pt: "Mantém-te perto do teu coração." },
  // 174
  { de: "Du bist bereit für mehr.", en: "You're ready for more.", fr: "Tu peux viser plus haut.", pl: "Możesz sięgnąć po więcej.", es: "Puedes aspirar a más.", pt: "Podes querer mais." },
  // 175
  { de: "Möglichkeiten warten überall.", en: "Chances are waiting everywhere.", fr: "Des occasions t'attendent partout.", pl: "Wszędzie czekają możliwości.", es: "Hay oportunidades por todas partes.", pt: "Há oportunidades por todo o lado." },
  // 176
  { de: "Gib deinem Traum eine Chance.", en: "Give your dream a chance.", fr: "Donne une chance à ton rêve.", pl: "Daj swojemu marzeniu szansę.", es: "Dale una oportunidad a tu sueño.", pt: "Dá uma oportunidade ao teu sonho." },
  // 177
  { de: "Dein Einsatz wird sichtbar.", en: "Your effort is starting to show.", fr: "Tes efforts commencent à se voir.", pl: "Twój wysiłek zaczyna być widoczny.", es: "Tu esfuerzo empieza a notarse.", pt: "O teu esforço começa a notar-se." },
  // 178
  { de: "Bleib stark.", en: "Stay strong.", fr: "Garde ta force.", pl: "Nie trać siły.", es: "Mantente fuerte.", pt: "Mantém-te forte." },
  // 179
  { de: "In dir steckt noch Wachstum.", en: "There's still growing in you.", fr: "Il te reste de la marge pour grandir.", pl: "Jest w tobie jeszcze przestrzeń na rozwój.", es: "Todavía te queda mucho por crecer.", pt: "Ainda tens muito para crescer." },
  // 180
  { de: "Jeder Schritt bringt Erfahrung.", en: "Every step brings experience.", fr: "Chaque pas apporte de l'expérience.", pl: "Każdy krok przynosi doświadczenie.", es: "Cada paso trae experiencia.", pt: "Cada passo traz experiência." },
  // 181
  { de: "Deine Zukunft ist offen.", en: "Your future is open.", fr: "Ton avenir est ouvert.", pl: "Twoja przyszłość jest otwarta.", es: "Tu futuro está abierto.", pt: "O teu futuro está em aberto." },
  // 182
  { de: "Wage heute etwas Neues.", en: "Try something new today.", fr: "Ose du nouveau aujourd'hui.", pl: "Odważ się dziś na coś nowego.", es: "Atrévete hoy con algo nuevo.", pt: "Arrisca hoje algo novo." },
  // 183
  { de: "Lass deine Ideen fliegen.", en: "Let your ideas fly.", fr: "Laisse tes idées s'envoler.", pl: "Pozwól swoim pomysłom latać.", es: "Deja volar tus ideas.", pt: "Deixa as tuas ideias voar." },
  // 184
  { de: "Ein Versuch kann alles ändern.", en: "One attempt can change everything.", fr: "Une tentative peut tout changer.", pl: "Jedna próba może wszystko zmienić.", es: "Un intento puede cambiarlo todo.", pt: "Uma tentativa pode mudar tudo." },
  // 185
  { de: "Mut macht dich stärker.", en: "Courage makes you stronger.", fr: "Le courage te donne de la force.", pl: "Odwaga daje ci siłę.", es: "El valor te hace más fuerte.", pt: "A coragem torna-te mais forte." },
  // 186
  { de: "Heute ist ein Geschenk.", en: "Today is a gift.", fr: "Aujourd'hui est un cadeau.", pl: "Dziś to prezent.", es: "Hoy es un regalo.", pt: "Hoje é um presente." },
  // 187
  { de: "Nutze deine Chance.", en: "Take your chance.", fr: "Saisis ta chance.", pl: "Wykorzystaj swoją szansę.", es: "Aprovecha tu oportunidad.", pt: "Aproveita a tua oportunidade." },
  // 188
  { de: "Sei stolz auf deinen Weg.", en: "Be proud of your path.", fr: "Ton chemin mérite ta fierté.", pl: "Twoja droga to powód do dumy.", es: "Tu camino merece tu orgullo.", pt: "O teu caminho merece o teu orgulho." },
  // 189
  { de: "Verlass dich auf dich.", en: "Rely on yourself.", fr: "Compte sur toi.", pl: "Polegaj na sobie.", es: "Cuenta contigo.", pt: "Conta contigo." },
  // 190
  { de: "Dein Ziel verdient Geduld.", en: "Your goal deserves patience.", fr: "Ton objectif mérite de la patience.", pl: "Twój cel zasługuje na cierpliwość.", es: "Tu meta merece paciencia.", pt: "O teu objetivo merece paciência." },
  // 191
  { de: "Finde deinen eigenen Rhythmus.", en: "Find your own rhythm.", fr: "Trouve ton propre rythme.", pl: "Znajdź własny rytm.", es: "Encuentra tu propio ritmo.", pt: "Encontra o teu próprio ritmo." },
  // 192
  { de: "Du bestimmst dein Tempo.", en: "You set your own pace.", fr: "C'est toi qui fixes ton allure.", pl: "To ty ustalasz tempo.", es: "El ritmo lo pones tú.", pt: "O ritmo é decidido por ti." },
  // 193
  { de: "Jetzt kommt dein nächster Schritt.", en: "Here comes your next step.", fr: "Voici ton prochain pas.", pl: "Teraz twój następny krok.", es: "Ahora viene tu siguiente paso.", pt: "Agora vem o teu próximo passo." },
  // 194
  { de: "Zweifel bestimmen dich nicht.", en: "Your doubts don't define you.", fr: "Tes doutes ne te définissent pas.", pl: "Wątpliwości cię nie określają.", es: "Tus dudas no te definen.", pt: "As tuas dúvidas não te definem." },
  // 195
  { de: "Lass dich vom Mut führen.", en: "Let courage lead.", fr: "Laisse le courage te guider.", pl: "Niech odwaga cię prowadzi.", es: "Deja que el valor te guíe.", pt: "Deixa a coragem guiar-te." },
  // 196
  { de: "Dein Weg gehört dir.", en: "Your path is your own.", fr: "Ton chemin est à toi.", pl: "Twoja droga należy do ciebie.", es: "Tu camino es tuyo.", pt: "O teu caminho é teu." },
  // 197
  { de: "Möglichkeiten sind überall.", en: "There are chances all around.", fr: "Les occasions sont partout.", pl: "Możliwości są wszędzie.", es: "Las oportunidades están por todas partes.", pt: "As oportunidades estão em todo o lado." },
  // 198
  { de: "Veränderung liegt in deiner Hand.", en: "Change is in your hands.", fr: "Le changement est entre tes mains.", pl: "Zmiana jest w twoich rękach.", es: "El cambio está en tus manos.", pt: "A mudança está nas tuas mãos." },
  // 199
  { de: "Jeder Moment birgt einen Anfang.", en: "Every moment holds a beginning.", fr: "Chaque instant contient un début.", pl: "W każdej chwili kryje się początek.", es: "Cada momento guarda un comienzo.", pt: "Cada momento guarda um começo." },
  // 200
  { de: "Deine Stärke liegt in dir.", en: "Your strength is inside you.", fr: "Ta force est en toi.", pl: "Twoja siła jest w tobie.", es: "Tu fuerza está dentro de ti.", pt: "A tua força está dentro de ti." },
  // 201
  { de: "Deine Wahl macht den Unterschied.", en: "Your choice makes the difference.", fr: "Ton choix fait la différence.", pl: "Twój wybór robi różnicę.", es: "Tu elección marca la diferencia.", pt: "A tua escolha faz a diferença." },
  // 202
  { de: "Gib deinem Ziel Zeit.", en: "Give your goal time.", fr: "Donne du temps à ton objectif.", pl: "Daj swojemu celowi czas.", es: "Dale tiempo a tu meta.", pt: "Dá tempo ao teu objetivo." },
  // 203
  { de: "Halte deine Richtung.", en: "Hold your direction.", fr: "Tiens ta direction.", pl: "Trzymaj się swojego kierunku.", es: "Mantén tu dirección.", pt: "Mantém a tua direção." },
  // 204
  { de: "Wachse über dich hinaus.", en: "Outgrow yourself.", fr: "Dépasse-toi.", pl: "Przekrocz własne granice.", es: "Supérate.", pt: "Supera-te." },
  // 205
  { de: "Dein Morgen kann groß werden.", en: "Your tomorrow can be big.", fr: "Ton demain peut être grand.", pl: "Twoje jutro może być wielkie.", es: "Tu mañana puede ser grande.", pt: "O teu amanhã pode ser grande." },
  // 206
  { de: "Träume brauchen Mut.", en: "Dreams need courage.", fr: "Les rêves ont besoin de courage.", pl: "Marzenia potrzebują odwagi.", es: "Los sueños necesitan valor.", pt: "Os sonhos precisam de coragem." },
  // 207
  { de: "Dein Einsatz zählt heute.", en: "Today your effort counts.", fr: "Aujourd'hui, tes efforts comptent.", pl: "Dziś liczy się twój wysiłek.", es: "Hoy cuenta tu esfuerzo.", pt: "Hoje conta o teu esforço." },
  // 208
  { de: "Chancen liegen vor dir.", en: "Chances lie ahead of you.", fr: "Des occasions s'ouvrent devant toi.", pl: "Przed tobą leżą szanse.", es: "Tienes oportunidades por delante.", pt: "Tens oportunidades pela frente." },
  // 209
  { de: "Entschlossenheit bringt dich weiter.", en: "Determination takes you further.", fr: "La détermination te mène plus loin.", pl: "Determinacja prowadzi cię dalej.", es: "La determinación te lleva más lejos.", pt: "A determinação leva-te mais longe." },
  // 210
  { de: "Deine Reise geht weiter.", en: "Your journey goes on.", fr: "Ton voyage continue.", pl: "Twoja podróż trwa.", es: "Tu viaje continúa.", pt: "A tua viagem continua." },
  // 211
  { de: "Du kannst immer dazulernen.", en: "There's always more to learn.", fr: "Il y a toujours à apprendre.", pl: "Zawsze można się czegoś nauczyć.", es: "Siempre se puede aprender más.", pt: "Há sempre mais para aprender." },
  // 212
  { de: "Heute darf etwas gelingen.", en: "Something is allowed to go right today.", fr: "Aujourd'hui, quelque chose a le droit de réussir.", pl: "Dziś coś może się udać.", es: "Hoy algo puede salir bien.", pt: "Hoje algo pode correr bem." },
  // 213
  { de: "Dein Mut öffnet Türen.", en: "Your courage opens doors.", fr: "Ton courage ouvre des portes.", pl: "Twoja odwaga otwiera drzwi.", es: "Tu valor abre puertas.", pt: "A tua coragem abre portas." },
  // 214
  { de: "Halte deinen Traum fest.", en: "Hold on to your dream.", fr: "Ne lâche pas ton rêve.", pl: "Trzymaj się swojego marzenia.", es: "No sueltes tu sueño.", pt: "Não largues o teu sonho." },
  // 215
  { de: "Entdecke neue Seiten an dir.", en: "Discover new sides of yourself.", fr: "Découvre de nouvelles facettes de toi.", pl: "Odkryj w sobie nowe strony.", es: "Descubre nuevas facetas de ti.", pt: "Descobre novas facetas de ti." },
  // 216
  { de: "Anfänge brauchen Vertrauen.", en: "Beginnings need trust.", fr: "Les débuts demandent de la confiance.", pl: "Początki potrzebują zaufania.", es: "Los comienzos necesitan confianza.", pt: "Os começos precisam de confiança." },
  // 217
  { de: "Deine Möglichkeiten sind größer.", en: "Your options are bigger than you think.", fr: "Tes possibilités sont plus larges que tu ne crois.", pl: "Twoje możliwości są większe, niż sądzisz.", es: "Tus posibilidades son mayores de lo que crees.", pt: "As tuas possibilidades são maiores do que pensas." },
  // 218
  { de: "Überrasche dich heute selbst.", en: "Surprise yourself today.", fr: "Surprends-toi aujourd'hui.", pl: "Zaskocz dziś siebie.", es: "Sorpréndete hoy.", pt: "Surpreende-te hoje." },
  // 219
  { de: "Geh weiter als gestern.", en: "Go further than yesterday.", fr: "Va plus loin que la veille.", pl: "Idź dalej niż wczoraj.", es: "Llega más lejos que ayer.", pt: "Vai mais longe do que ontem." },
  // 220
  { de: "Du darfst deinen Weg ändern.", en: "You're allowed to change your path.", fr: "Tu as le droit de changer de chemin.", pl: "Masz prawo zmienić drogę.", es: "Tienes derecho a cambiar de camino.", pt: "Tens o direito de mudar de caminho." },
  // 221
  { de: "Zuversicht macht vieles leichter.", en: "Confidence makes a lot easier.", fr: "La confiance allège bien des choses.", pl: "Ufność wiele ułatwia.", es: "La confianza lo hace todo más llevadero.", pt: "A confiança torna tudo mais leve." },
  // 222
  { de: "Deine Ziele sind wichtig.", en: "Your goals matter.", fr: "Tes objectifs comptent.", pl: "Twoje cele są ważne.", es: "Tus metas importan.", pt: "Os teus objetivos importam." },
  // 223
  { de: "Großes darf klein beginnen.", en: "Big things may start small.", fr: "Les grandes choses ont le droit de commencer petit.", pl: "Wielkie rzeczy mogą zacząć się od małego.", es: "Lo grande puede empezar pequeño.", pt: "O que é grande pode começar pequeno." },
  // 224
  { de: "Ein neuer Versuch lohnt sich.", en: "Another try is worth it.", fr: "Un nouvel essai en vaut la peine.", pl: "Warto spróbować jeszcze raz.", es: "Vale la pena intentarlo otra vez.", pt: "Vale a pena tentar outra vez." },
  // 225
  { de: "Vertraue deiner Stärke.", en: "Trust your strength.", fr: "Fais confiance à ta force.", pl: "Zaufaj swojej sile.", es: "Confía en tu fuerza.", pt: "Confia na tua força." },
  // 226
  { de: "Dein Weg muss nicht perfekt sein.", en: "Your path doesn't have to be perfect.", fr: "Ton chemin n'a pas besoin d'être parfait.", pl: "Twoja droga nie musi być idealna.", es: "Tu camino no tiene que ser perfecto.", pt: "O teu caminho não tem de ser perfeito." },
  // 227
  { de: "Hab den Mut zu beginnen.", en: "Have the courage to begin.", fr: "Aie le courage de te lancer.", pl: "Miej odwagę, by zacząć.", es: "Ten el valor de lanzarte.", pt: "Tem a coragem de te lançares." },
  // 228
  { de: "Ein Neustart ist immer möglich.", en: "A fresh start is always possible.", fr: "Un nouveau départ est toujours possible.", pl: "Nowy start jest zawsze możliwy.", es: "Siempre es posible empezar de nuevo.", pt: "Recomeçar é sempre possível." },
  // 229
  { de: "Deine Gelegenheit wartet.", en: "Your opportunity is waiting.", fr: "Ton occasion t'attend.", pl: "Twoja okazja czeka.", es: "Tu ocasión te espera.", pt: "A tua ocasião espera por ti." },
  // 230
  { de: "Mut zahlt sich aus.", en: "Courage pays off.", fr: "Le courage paie.", pl: "Odwaga się opłaca.", es: "El valor da sus frutos.", pt: "A coragem compensa." },
  // 231
  { de: "Mach Platz für Neues.", en: "Make room for something new.", fr: "Fais de la place au nouveau.", pl: "Zrób miejsce na nowe.", es: "Haz sitio a lo nuevo.", pt: "Abre espaço para o novo." },
  // 232
  { de: "Deine Träume dürfen bleiben.", en: "Your dreams are allowed to stay.", fr: "Tes rêves ont le droit de rester.", pl: "Twoje marzenia mogą zostać.", es: "Tus sueños pueden quedarse.", pt: "Os teus sonhos podem ficar." },
  // 233
  { de: "Jeder Schritt formt deinen Weg.", en: "Every step shapes your path.", fr: "Chaque pas façonne ton chemin.", pl: "Każdy krok kształtuje twoją drogę.", es: "Cada paso da forma a tu camino.", pt: "Cada passo molda o teu caminho." },
  // 234
  { de: "Nutze deinen Tatendrang.", en: "Use the drive you have.", fr: "Profite de ton élan.", pl: "Wykorzystaj swój zapał.", es: "Aprovecha tus ganas.", pt: "Aproveita a tua vontade de agir." },
  // 235
  { de: "Gestalte deinen eigenen Weg.", en: "Shape your own path.", fr: "Trace ton propre chemin.", pl: "Kształtuj własną drogę.", es: "Traza tu propio camino.", pt: "Traça o teu próprio caminho." },
  // 236
  { de: "Veränderung beginnt in dir.", en: "Change starts inside you.", fr: "Le changement commence en toi.", pl: "Zmiana zaczyna się w tobie.", es: "El cambio empieza dentro de ti.", pt: "A mudança começa dentro de ti." },
  // 237
  { de: "Dein Potenzial wächst mit dir.", en: "Your potential grows with you.", fr: "Ton potentiel grandit avec toi.", pl: "Twój potencjał rośnie razem z tobą.", es: "Tu potencial crece contigo.", pt: "O teu potencial cresce contigo." },
  // 238
  { de: "Feiere deinen Fortschritt.", en: "Celebrate your progress.", fr: "Célèbre tes progrès.", pl: "Świętuj swój postęp.", es: "Celebra tu avance.", pt: "Celebra o teu progresso." },
  // 239
  { de: "Das Ziel rückt näher.", en: "The goal is drawing closer.", fr: "Le but se rapproche.", pl: "Meta się zbliża.", es: "La meta está cada vez más cerca.", pt: "A meta está cada vez mais perto." },
  // 240
  { de: "Bewahre deine Hoffnung.", en: "Keep hold of your hope.", fr: "Préserve ton espoir.", pl: "Zachowaj nadzieję.", es: "Conserva tu esperanza.", pt: "Guarda a tua esperança." },
  // 241
  { de: "Viele Wege stehen dir offen.", en: "Many roads are open to you.", fr: "Bien des chemins s'offrent à toi.", pl: "Stoi przed tobą wiele dróg.", es: "Tienes muchos caminos abiertos.", pt: "Tens muitos caminhos abertos." },
  // 242
  { de: "Leg einfach los.", en: "Just start.", fr: "Lance-toi, tout simplement.", pl: "Po prostu zacznij.", es: "Simplemente empieza.", pt: "Começa, simplesmente." },
  // 243
  { de: "Du kannst mehr erreichen.", en: "You can reach further.", fr: "Tu peux aller chercher davantage.", pl: "Możesz osiągnąć więcej.", es: "Puedes lograr más.", pt: "Podes alcançar mais." },
  // 244
  { de: "Lass deine Ziele wachsen.", en: "Let your goals grow.", fr: "Laisse tes objectifs grandir.", pl: "Pozwól swoim celom rosnąć.", es: "Deja crecer tus metas.", pt: "Deixa os teus objetivos crescer." },
  // 245
  { de: "Deine Stärke trägt dich.", en: "Your strength carries you.", fr: "Ta force te porte.", pl: "Twoja siła cię niesie.", es: "Tu fuerza te sostiene.", pt: "A tua força sustenta-te." },
  // 246
  { de: "Mut und Neugier bringen dich weiter.", en: "Courage and curiosity take you further.", fr: "Le courage et la curiosité te mènent plus loin.", pl: "Odwaga i ciekawość prowadzą cię dalej.", es: "El valor y la curiosidad te llevan más lejos.", pt: "A coragem e a curiosidade levam-te mais longe." },
  // 247
  { de: "Jeder Tag kann überraschen.", en: "Any day can surprise you.", fr: "Chaque jour peut surprendre.", pl: "Każdy dzień może zaskoczyć.", es: "Cualquier día puede sorprender.", pt: "Qualquer dia pode surpreender." },
  // 248
  { de: "Denk auch mal anders.", en: "Try thinking differently.", fr: "Essaie de penser autrement.", pl: "Spróbuj pomyśleć inaczej.", es: "Prueba a pensar de otra manera.", pt: "Experimenta pensar de outra maneira." },
  // 249
  { de: "Erfolg wächst aus kleinen Schritten.", en: "Success grows out of small steps.", fr: "La réussite naît de petits pas.", pl: "Sukces rośnie z małych kroków.", es: "El éxito nace de pasos pequeños.", pt: "O sucesso nasce de passos pequenos." },
  // 250
  { de: "Wage den Sprung.", en: "Take the leap.", fr: "Fais le saut.", pl: "Zrób ten skok.", es: "Da el salto.", pt: "Dá o salto." },
  // 251
  { de: "Vertraue deinen Fähigkeiten.", en: "Trust what you can do.", fr: "Fais confiance à tes capacités.", pl: "Zaufaj swoim umiejętnościom.", es: "Confía en tus capacidades.", pt: "Confia nas tuas capacidades." },
  // 252
  { de: "Mit jedem Schritt wird es klarer.", en: "It gets clearer with every step.", fr: "Tout devient plus clair à chaque pas.", pl: "Z każdym krokiem robi się jaśniej.", es: "Con cada paso se ve más claro.", pt: "A cada passo fica mais claro." },
  // 253
  { de: "Möglichkeiten warten auf dich.", en: "Chances are waiting for you.", fr: "Des possibilités t'attendent.", pl: "Możliwości na ciebie czekają.", es: "Hay posibilidades esperándote.", pt: "Há possibilidades à tua espera." },
  // 254
  { de: "Erschaffe etwas Neues.", en: "Make something new.", fr: "Crée quelque chose de neuf.", pl: "Stwórz coś nowego.", es: "Crea algo nuevo.", pt: "Cria algo novo." },
  // 255
  { de: "Sei stolz auf das Heute.", en: "Let today be something you're proud of.", fr: "Le jour d'aujourd'hui mérite ta fierté.", pl: "Dziś zasługuje na twoją dumę.", es: "El día de hoy merece tu orgullo.", pt: "O dia de hoje merece o teu orgulho." },
  // 256
  { de: "Mut ist ein guter Anfang.", en: "Courage is a good beginning.", fr: "Le courage est un bon début.", pl: "Odwaga to dobry początek.", es: "El valor es un buen comienzo.", pt: "A coragem é um bom começo." },
  // 257
  { de: "Geh mit Vertrauen voran.", en: "Move forward with trust.", fr: "Avance avec confiance.", pl: "Idź naprzód z ufnością.", es: "Avanza con confianza.", pt: "Avança com confiança." },
  // 258
  { de: "Lebe deinen Traum.", en: "Live your dream.", fr: "Vis ton rêve.", pl: "Żyj swoim marzeniem.", es: "Vive tu sueño.", pt: "Vive o teu sonho." },
  // 259
  { de: "Versuche machen dich stärker.", en: "Trying makes you stronger.", fr: "Essayer te renforce.", pl: "Próby dodają ci siły.", es: "Intentarlo te fortalece.", pt: "Tentar torna-te mais forte." },
  // 260
  { de: "Morgen wächst aus heute.", en: "Tomorrow grows out of today.", fr: "Demain naît d'aujourd'hui.", pl: "Jutro wyrasta z dziś.", es: "El mañana nace del hoy.", pt: "O amanhã nasce do hoje." },
  // 261
  { de: "Deine Ziele verdienen Einsatz.", en: "Your goals deserve the effort.", fr: "Tes objectifs méritent tes efforts.", pl: "Twoje cele zasługują na wysiłek.", es: "Tus metas merecen tu esfuerzo.", pt: "Os teus objetivos merecem o teu esforço." },
  // 262
  { de: "Bleib dir selbst treu.", en: "Stay true to who you are.", fr: "Reste fidèle à ce que tu es.", pl: "Bądź w zgodzie ze sobą.", es: "Sé fiel a quien eres.", pt: "Sê fiel a quem és." },
  // 263
  { de: "Wachstum kennt keinen Stillstand.", en: "Growth never stands still.", fr: "Grandir ne s'arrête jamais.", pl: "Rozwój nie zna bezruchu.", es: "Crecer no conoce la quietud.", pt: "Crescer não conhece paragens." },
  // 264
  { de: "Dein Weg führt weiter.", en: "Your road leads on.", fr: "Ton chemin continue.", pl: "Twoja droga prowadzi dalej.", es: "Tu camino sigue.", pt: "O teu caminho segue em frente." },
  // 265
  { de: "Jetzt ist Zeit für Mut.", en: "Now is the time for courage.", fr: "C'est le moment du courage.", pl: "Teraz czas na odwagę.", es: "Ahora es momento de valor.", pt: "Agora é tempo de coragem." },
  // 266
  { de: "Lass deine Stärke wachsen.", en: "Let your strength grow.", fr: "Laisse ta force grandir.", pl: "Pozwól swojej sile rosnąć.", es: "Deja crecer tu fuerza.", pt: "Deixa a tua força crescer." },
  // 267
  { de: "Wähle deine eigene Richtung.", en: "Choose your own direction.", fr: "Choisis ta propre direction.", pl: "Wybierz własny kierunek.", es: "Elige tu propia dirección.", pt: "Escolhe a tua própria direção." },
  // 268
  { de: "Jeder kleine Sieg zählt.", en: "Every small win counts.", fr: "Chaque petite victoire compte.", pl: "Każde małe zwycięstwo się liczy.", es: "Cada pequeña victoria cuenta.", pt: "Cada pequena vitória conta." },
  // 269
  { de: "Gestalte deine Zukunft selbst.", en: "Shape your own future.", fr: "Construis toi-même ton avenir.", pl: "Kształtuj swoją przyszłość po swojemu.", es: "Construye tu futuro a tu manera.", pt: "Constrói o teu futuro à tua maneira." },
  // 270
  { de: "Erkenne deine Chancen.", en: "See the chances you have.", fr: "Repère tes occasions.", pl: "Dostrzeż swoje szanse.", es: "Reconoce tus oportunidades.", pt: "Repara nas tuas oportunidades." },
  // 271
  { de: "Auch kleine Schritte bringen dich ans Ziel.", en: "Small steps get you there too.", fr: "Les petits pas mènent aussi au but.", pl: "Małe kroki też prowadzą do celu.", es: "Los pasos pequeños también llegan a la meta.", pt: "Os passos pequenos também chegam à meta." },
  // 272
  { de: "Fang dort an, wo du bist.", en: "Start where you are.", fr: "Commence là où tu es.", pl: "Zacznij tam, gdzie jesteś.", es: "Empieza donde estás.", pt: "Começa onde estás." },
  // 273
  { de: "Dein Ziel beginnt mit dir.", en: "Your goal starts with you.", fr: "Ton objectif commence par toi.", pl: "Twój cel zaczyna się od ciebie.", es: "Tu meta empieza en ti.", pt: "O teu objetivo começa em ti." },
  // 274
  { de: "Lass dich von Hoffnung tragen.", en: "Let hope carry you.", fr: "Laisse l'espoir te porter.", pl: "Daj się nieść nadziei.", es: "Déjate llevar por la esperanza.", pt: "Deixa-te levar pela esperança." },
  // 275
  { de: "Du kannst deine Geschichte verändern.", en: "You can change your story.", fr: "Tu peux changer ton histoire.", pl: "Możesz zmienić swoją historię.", es: "Puedes cambiar tu historia.", pt: "Podes mudar a tua história." },
  // 276
  { de: "Jeder Tag schenkt einen Neubeginn.", en: "Every day offers a fresh start.", fr: "Chaque jour offre un nouveau départ.", pl: "Każdy dzień daje nowy początek.", es: "Cada día regala un nuevo comienzo.", pt: "Cada dia oferece um novo começo." },
  // 277
  { de: "Gib deinen Träumen Raum.", en: "Give your dreams room.", fr: "Donne de la place à tes rêves.", pl: "Daj swoim marzeniom przestrzeń.", es: "Dales espacio a tus sueños.", pt: "Dá espaço aos teus sonhos." },
  // 278
  { de: "Verlier deinen Weg nicht aus den Augen.", en: "Don't lose sight of your path.", fr: "Ne perds pas ton chemin de vue.", pl: "Nie trać swojej drogi z oczu.", es: "No pierdas de vista tu camino.", pt: "Não percas o teu caminho de vista." },
  // 279
  { de: "Stärke wächst durch Erfahrung.", en: "Strength grows through experience.", fr: "La force vient de l'expérience.", pl: "Siła rośnie przez doświadczenie.", es: "La fuerza crece con la experiencia.", pt: "A força cresce com a experiência." },
  // 280
  { de: "Einsatz bringt dich weiter.", en: "Effort takes you further.", fr: "L'effort te mène plus loin.", pl: "Wysiłek prowadzi cię dalej.", es: "El esfuerzo te lleva más lejos.", pt: "O esforço leva-te mais longe." },
  // 281
  { de: "Erschaffe etwas, das dich stolz macht.", en: "Make something you'll be proud of.", fr: "Crée quelque chose qui te fasse honneur.", pl: "Stwórz coś, co da ci powód do dumy.", es: "Crea algo que te dé orgullo.", pt: "Cria algo que te dê orgulho." },
  // 282
  { de: "Vertraue deinem nächsten Schritt.", en: "Trust your next step.", fr: "Fais confiance à ton prochain pas.", pl: "Zaufaj swojemu następnemu krokowi.", es: "Confía en tu siguiente paso.", pt: "Confia no teu próximo passo." },
  // 283
  { de: "Veränderung kann etwas Schönes sein.", en: "Change can be a beautiful thing.", fr: "Le changement peut être une belle chose.", pl: "Zmiana może być czymś pięknym.", es: "El cambio puede ser algo hermoso.", pt: "A mudança pode ser algo belo." },
  // 284
  { de: "Mut steht dir gut.", en: "Courage suits you.", fr: "Le courage te va bien.", pl: "Odwaga ci pasuje.", es: "El valor te queda bien.", pt: "A coragem fica-te bem." },
  // 285
  { de: "Deine Reise ist voller Möglichkeiten.", en: "Your journey is full of possibility.", fr: "Ton voyage est plein de possibles.", pl: "Twoja podróż jest pełna możliwości.", es: "Tu viaje está lleno de posibilidades.", pt: "A tua viagem está cheia de possibilidades." },
  // 286
  { de: "Entwicklung beginnt mit Neugier.", en: "Growth starts with curiosity.", fr: "Tout progrès commence par la curiosité.", pl: "Rozwój zaczyna się od ciekawości.", es: "El desarrollo empieza con la curiosidad.", pt: "O desenvolvimento começa com curiosidade." },
  // 287
  { de: "Dein Wille bewegt dich.", en: "Your will moves you.", fr: "Ta volonté te met en mouvement.", pl: "Twoja wola cię napędza.", es: "Tu voluntad te mueve.", pt: "A tua vontade move-te." },
  // 288
  { de: "Dein Weg darf Zeit brauchen.", en: "Your path is allowed to take time.", fr: "Ton chemin a le droit de prendre du temps.", pl: "Twoja droga może potrzebować czasu.", es: "Tu camino puede tomarse su tiempo.", pt: "O teu caminho pode levar o seu tempo." },
  // 289
  { de: "Erinnere dich an deine Stärke.", en: "Remember your strength.", fr: "Souviens-toi de ta force.", pl: "Przypomnij sobie swoją siłę.", es: "Acuérdate de tu fuerza.", pt: "Lembra-te da tua força." },
  // 290
  { de: "Deine Entscheidung kann viel verändern.", en: "Your decision can change a lot.", fr: "Ta décision peut changer beaucoup.", pl: "Twoja decyzja może wiele zmienić.", es: "Tu decisión puede cambiar mucho.", pt: "A tua decisão pode mudar muito." },
  // 291
  { de: "In jedem Tag steckt eine Möglichkeit.", en: "There's a possibility in every day.", fr: "Chaque jour recèle une possibilité.", pl: "W każdym dniu kryje się możliwość.", es: "En cada día hay una posibilidad.", pt: "Em cada dia há uma possibilidade." },
  // 292
  { de: "Mut zeigt dir neue Wege.", en: "Courage shows you new roads.", fr: "Le courage t'ouvre de nouveaux chemins.", pl: "Odwaga pokazuje ci nowe drogi.", es: "El valor te muestra caminos nuevos.", pt: "A coragem mostra-te caminhos novos." },
  // 293
  { de: "Neue Gedanken öffnen Türen.", en: "New thoughts open doors.", fr: "Les idées neuves ouvrent des portes.", pl: "Nowe myśli otwierają drzwi.", es: "Las ideas nuevas abren puertas.", pt: "As ideias novas abrem portas." },
  // 294
  { de: "Du bist stärker als deine Angst.", en: "You're stronger than your fear.", fr: "Tu as plus de force que de peur.", pl: "Masz w sobie więcej siły niż strachu.", es: "Eres más fuerte que tu miedo.", pt: "És mais forte do que o teu medo." },
  // 295
  { de: "Halte deine Ziele im Blick.", en: "Keep your goals in sight.", fr: "Garde tes objectifs en vue.", pl: "Miej swoje cele przed oczami.", es: "No pierdas de vista tus metas.", pt: "Não percas os teus objetivos de vista." },
  // 296
  { de: "Gib deinem Traum einen Anfang.", en: "Give your dream a start.", fr: "Donne un début à ton rêve.", pl: "Daj swojemu marzeniu początek.", es: "Dale un comienzo a tu sueño.", pt: "Dá um começo ao teu sonho." },
  // 297
  { de: "Du kannst Herausforderungen meistern.", en: "You can handle what comes.", fr: "Tu peux relever les défis.", pl: "Potrafisz sprostać wyzwaniom.", es: "Puedes con los retos.", pt: "És capaz de enfrentar os desafios." },
  // 298
  { de: "Dein nächstes Kapitel wartet.", en: "Your next chapter is waiting.", fr: "Ton prochain chapitre t'attend.", pl: "Twój następny rozdział czeka.", es: "Tu próximo capítulo te espera.", pt: "O teu próximo capítulo espera por ti." },
  // 299
  { de: "Gib deinen Zielen eine Chance.", en: "Give your goals a chance.", fr: "Donne une chance à tes objectifs.", pl: "Daj swoim celom szansę.", es: "Dales una oportunidad a tus metas.", pt: "Dá uma oportunidade aos teus objetivos." },
  // 300
  { de: "Mit jedem Schritt wirst du stärker.", en: "You get stronger with every step.", fr: "Chaque pas te renforce.", pl: "Z każdym krokiem masz więcej siły.", es: "Con cada paso te haces más fuerte.", pt: "A cada passo ficas mais forte." },
  // 301
  { de: "Veränderung bringt neue Chancen.", en: "Change brings new chances.", fr: "Le changement apporte de nouvelles occasions.", pl: "Zmiana przynosi nowe szanse.", es: "El cambio trae nuevas oportunidades.", pt: "A mudança traz novas oportunidades." },
  // 302
  { de: "Deine Taten können etwas bewegen.", en: "What you do can move things.", fr: "Ce que tu fais peut changer les choses.", pl: "Twoje czyny mogą coś zmienić.", es: "Lo que haces puede mover cosas.", pt: "Aquilo que fazes pode mover as coisas." },
  // 303
  { de: "Entdecke die Chancen auf deinem Weg.", en: "Spot the chances along your path.", fr: "Repère les occasions sur ton chemin.", pl: "Odkryj szanse na swojej drodze.", es: "Descubre las oportunidades de tu camino.", pt: "Descobre as oportunidades no teu caminho." },
  // 304
  { de: "Mut macht den Tag besonders.", en: "Courage makes the day special.", fr: "Le courage rend la journée particulière.", pl: "Odwaga czyni dzień wyjątkowym.", es: "El valor hace especial el día.", pt: "A coragem torna o dia especial." },
  // 305
  { de: "Du kannst mehr als du denkst.", en: "You can do more than you think.", fr: "Tu peux plus que tu ne crois.", pl: "Potrafisz więcej, niż myślisz.", es: "Puedes más de lo que crees.", pt: "Consegues mais do que pensas." },
  // 306
  { de: "Lass deinen Traum größer werden.", en: "Let your dream get bigger.", fr: "Laisse ton rêve grandir.", pl: "Pozwól swojemu marzeniu urosnąć.", es: "Deja que tu sueño crezca.", pt: "Deixa o teu sonho crescer." },
  // 307
  { de: "Jeder Schritt bringt dich weiter.", en: "Every step takes you further.", fr: "Chaque pas te mène plus loin.", pl: "Każdy krok prowadzi cię dalej.", es: "Cada paso te lleva más lejos.", pt: "Cada passo leva-te mais longe." },
  // 308
  { de: "Deine Zukunft entsteht heute.", en: "Your future is being made today.", fr: "Ton avenir se construit aujourd'hui.", pl: "Twoja przyszłość powstaje dziś.", es: "Tu futuro se hace hoy.", pt: "O teu futuro constrói-se hoje." },
  // 309
  { de: "Dein Ziel verdient deine Aufmerksamkeit.", en: "Your goal deserves your attention.", fr: "Ton objectif mérite ton attention.", pl: "Twój cel zasługuje na twoją uwagę.", es: "Tu meta merece tu atención.", pt: "O teu objetivo merece a tua atenção." },
  // 310
  { de: "Ein neuer Anfang ist immer möglich.", en: "A new beginning is always possible.", fr: "Un nouveau commencement est toujours possible.", pl: "Nowy początek jest zawsze możliwy.", es: "Un nuevo comienzo siempre es posible.", pt: "Um novo começo é sempre possível." },
  // 311
  { de: "Öffne die Tür für Neues.", en: "Open the door to something new.", fr: "Ouvre la porte au nouveau.", pl: "Otwórz drzwi na nowe.", es: "Abre la puerta a lo nuevo.", pt: "Abre a porta ao novo." },
  // 312
  { de: "Mut kann deinen Weg verändern.", en: "Courage can change your path.", fr: "Le courage peut changer ton chemin.", pl: "Odwaga może zmienić twoją drogę.", es: "El valor puede cambiar tu camino.", pt: "A coragem pode mudar o teu caminho." },
  // 313
  { de: "Lass deine Zweifel hinter dir.", en: "Leave your doubts behind.", fr: "Laisse tes doutes derrière toi.", pl: "Zostaw wątpliwości za sobą.", es: "Deja tus dudas atrás.", pt: "Deixa as dúvidas para trás." },
  // 314
  { de: "Geh deinen eigenen Weg.", en: "Go your own way.", fr: "Va ton propre chemin.", pl: "Idź własną drogą.", es: "Ve por tu propio camino.", pt: "Vai pelo teu próprio caminho." },
  // 315
  { de: "Jeder Tag lehrt dich etwas.", en: "Every day teaches you something.", fr: "Chaque jour t'apprend quelque chose.", pl: "Każdy dzień czegoś cię uczy.", es: "Cada día te enseña algo.", pt: "Cada dia ensina-te algo." },
  // 316
  { de: "Deine Ziele warten auf dich.", en: "Your goals are waiting for you.", fr: "Tes objectifs t'attendent.", pl: "Twoje cele na ciebie czekają.", es: "Tus metas te esperan.", pt: "Os teus objetivos esperam por ti." },
  // 317
  { de: "Hoffnung und Mut tragen weit.", en: "Hope and courage carry far.", fr: "L'espoir et le courage portent loin.", pl: "Nadzieja i odwaga niosą daleko.", es: "La esperanza y el valor llevan lejos.", pt: "A esperança e a coragem levam longe." },
  // 318
  { de: "Wachse in deinem eigenen Tempo.", en: "Grow at your own pace.", fr: "Grandis à ton rythme.", pl: "Rozwijaj się we własnym tempie.", es: "Crece a tu propio ritmo.", pt: "Cresce ao teu próprio ritmo." },
  // 319
  { de: "Dein Weg verdient Vertrauen.", en: "Your path deserves your trust.", fr: "Ton chemin mérite ta confiance.", pl: "Twoja droga zasługuje na zaufanie.", es: "Tu camino merece tu confianza.", pt: "O teu caminho merece a tua confiança." },
  // 320
  { de: "Entscheide dich für deinen Traum.", en: "Choose your dream.", fr: "Choisis ton rêve.", pl: "Zdecyduj się na swoje marzenie.", es: "Decídete por tu sueño.", pt: "Decide-te pelo teu sonho." },
  // 321
  { de: "Sei stolz auf das Erreichte.", en: "Be proud of what you've reached.", fr: "Ce que tu as accompli mérite ta fierté.", pl: "To, co osiągnięte, to powód do dumy.", es: "Lo que has logrado merece tu orgullo.", pt: "O que já alcançaste merece o teu orgulho." },
  // 322
  { de: "Erweitere deine Grenzen.", en: "Widen your limits.", fr: "Élargis tes limites.", pl: "Poszerzaj swoje granice.", es: "Amplía tus límites.", pt: "Alarga os teus limites." },
  // 323
  { de: "Dein nächster Schritt wartet.", en: "Your next step is waiting.", fr: "Ton prochain pas t'attend.", pl: "Twój następny krok czeka.", es: "Tu siguiente paso te espera.", pt: "O teu próximo passo espera por ti." },
  // 324
  { de: "Bleib neugierig auf morgen.", en: "Stay curious about tomorrow.", fr: "Garde ta curiosité pour demain.", pl: "Zachowaj ciekawość jutra.", es: "Mantén la curiosidad por el mañana.", pt: "Mantém a curiosidade pelo amanhã." },
  // 325
  { de: "Nutze, was vor dir liegt.", en: "Use what's in front of you.", fr: "Sers-toi de ce qui est devant toi.", pl: "Wykorzystaj to, co przed tobą.", es: "Aprovecha lo que tienes delante.", pt: "Aproveita o que tens à frente." },
  // 326
  { de: "Nimm dir Zeit für dich.", en: "Take some time for yourself.", fr: "Prends du temps pour toi.", pl: "Znajdź czas dla siebie.", es: "Tómate tiempo para ti.", pt: "Arranja tempo para ti." },
  // 327
  { de: "Dein Mut bringt Veränderung.", en: "Your courage brings change.", fr: "Ton courage apporte du changement.", pl: "Twoja odwaga przynosi zmianę.", es: "Tu valor trae cambio.", pt: "A tua coragem traz mudança." },
  // 328
  { de: "Jeder Anfang birgt Möglichkeiten.", en: "Every beginning holds possibility.", fr: "Chaque début recèle des possibles.", pl: "Każdy początek kryje możliwości.", es: "Cada comienzo guarda posibilidades.", pt: "Cada começo guarda possibilidades." },
  // 329
  { de: "Folge deinem Traum.", en: "Follow your dream.", fr: "Suis ton rêve.", pl: "Podążaj za swoim marzeniem.", es: "Sigue tu sueño.", pt: "Segue o teu sonho." },
  // 330
  { de: "Bleib deinem Herzen treu.", en: "Stay true to your heart.", fr: "Reste fidèle à ton cœur.", pl: "Trzymaj się tego, co czujesz.", es: "Sé fiel a tu corazón.", pt: "Sê fiel ao teu coração." },
  // 331
  { de: "Geh mit Zuversicht weiter.", en: "Carry on with confidence.", fr: "Poursuis avec confiance.", pl: "Idź dalej z ufnością.", es: "Sigue adelante con confianza.", pt: "Continua com confiança." },
  // 332
  { de: "Deine Stärke kennt keine Eile.", en: "Your strength is in no hurry.", fr: "Ta force n'est pas pressée.", pl: "Twoja siła się nie spieszy.", es: "Tu fuerza no tiene prisa.", pt: "A tua força não tem pressa." },
  // 333
  { de: "Du kannst jeden Tag neu wählen.", en: "You can choose again every day.", fr: "Chaque jour, tu peux choisir à nouveau.", pl: "Każdego dnia możesz wybrać na nowo.", es: "Cada día puedes volver a elegir.", pt: "Todos os dias podes escolher de novo." },
  // 334
  { de: "Ein Schritt kann viel verändern.", en: "One step can change a lot.", fr: "Un seul pas peut beaucoup changer.", pl: "Jeden krok może wiele zmienić.", es: "Un solo paso puede cambiar mucho.", pt: "Um só passo pode mudar muito." },
  // 335
  { de: "Dein eigener Weg ist wertvoll.", en: "Your own path is worth something.", fr: "Ton chemin à toi a de la valeur.", pl: "Twoja własna droga ma wartość.", es: "Tu propio camino tiene valor.", pt: "O teu próprio caminho tem valor." },
  // 336
  { de: "Entdecke heute etwas Neues.", en: "Find something new today.", fr: "Découvre du nouveau aujourd'hui.", pl: "Odkryj dziś coś nowego.", es: "Descubre hoy algo nuevo.", pt: "Descobre hoje algo novo." },
  // 337
  { de: "Du hast noch so viel vor dir.", en: "You have so much still ahead.", fr: "Il te reste tant devant toi.", pl: "Tak wiele jeszcze przed tobą.", es: "Te queda tantísimo por delante.", pt: "Tens ainda tanto pela frente." },
  // 338
  { de: "Deine Mühe ist nicht umsonst.", en: "Your effort isn't wasted.", fr: "Tes efforts ne sont pas vains.", pl: "Twój trud nie idzie na marne.", es: "Tu esfuerzo no es en vano.", pt: "O teu esforço não é em vão." },
  // 339
  { de: "Gestalte die Zukunft nach deinen Vorstellungen.", en: "Shape the future the way you picture it.", fr: "Façonne l'avenir comme tu l'imagines.", pl: "Kształtuj przyszłość według swoich wyobrażeń.", es: "Da forma al futuro como lo imaginas.", pt: "Molda o futuro como o imaginas." },
  // 340
  { de: "Mut begleitet dich auf deinem Weg.", en: "Courage goes with you along the way.", fr: "Le courage t'accompagne en chemin.", pl: "Odwaga towarzyszy ci w drodze.", es: "El valor te acompaña en el camino.", pt: "A coragem acompanha-te no caminho." },
  // 341
  { de: "Dieser Tag steckt voller Möglichkeiten.", en: "This day is full of possibility.", fr: "Cette journée est pleine de possibles.", pl: "Ten dzień jest pełen możliwości.", es: "Este día está lleno de posibilidades.", pt: "Este dia está cheio de possibilidades." },
  // 342
  { de: "Auch langsam führt ans Ziel.", en: "Slowly still gets you there.", fr: "Lentement mène aussi au but.", pl: "Powoli też prowadzi do celu.", es: "Despacio también se llega.", pt: "Devagar também se chega." },
  // 343
  { de: "Neues Wissen bringt dich weiter.", en: "New knowledge takes you further.", fr: "Le savoir nouveau te mène plus loin.", pl: "Nowa wiedza prowadzi cię dalej.", es: "El conocimiento nuevo te lleva más lejos.", pt: "O saber novo leva-te mais longe." },
  // 344
  { de: "Erkenne den Wert jedes Schrittes.", en: "See the worth of every step.", fr: "Reconnais la valeur de chaque pas.", pl: "Dostrzeż wartość każdego kroku.", es: "Reconoce el valor de cada paso.", pt: "Reconhece o valor de cada passo." },
  // 345
  { de: "Deine Träume sind möglich.", en: "Your dreams are possible.", fr: "Tes rêves sont possibles.", pl: "Twoje marzenia są możliwe.", es: "Tus sueños son posibles.", pt: "Os teus sonhos são possíveis." },
  // 346
  { de: "Veränderung kann heute beginnen.", en: "Change can start today.", fr: "Le changement peut commencer aujourd'hui.", pl: "Zmiana może zacząć się dziś.", es: "El cambio puede empezar hoy.", pt: "A mudança pode começar hoje." },
  // 347
  { de: "Vertraue auf das, was in dir steckt.", en: "Trust what's inside you.", fr: "Fais confiance à ce que tu as en toi.", pl: "Zaufaj temu, co w tobie jest.", es: "Confía en lo que llevas dentro.", pt: "Confia no que tens dentro de ti." },
  // 348
  { de: "Dein Weg zeigt sich beim Gehen.", en: "Your path shows itself as you walk.", fr: "Ton chemin se révèle en marchant.", pl: "Twoja droga odsłania się w marszu.", es: "Tu camino se revela al andar.", pt: "O teu caminho revela-se a caminhar." },
  // 349
  { de: "Dein Mut überwindet Zweifel.", en: "Your courage outlasts your doubts.", fr: "Ton courage a raison de tes doutes.", pl: "Twoja odwaga pokonuje wątpliwości.", es: "Tu valor vence a las dudas.", pt: "A tua coragem vence as dúvidas." },
  // 350
  { de: "Heute ist ein guter Tag.", en: "Today is a good day.", fr: "Aujourd'hui est une bonne journée.", pl: "Dziś jest dobry dzień.", es: "Hoy es un buen día.", pt: "Hoje é um bom dia." },
  // 351
  { de: "Du darfst stolz auf dich sein.", en: "You're allowed to be proud of yourself.", fr: "Tu as le droit d'en tirer de la fierté.", pl: "Masz prawo czuć dumę.", es: "Tienes derecho a sentir orgullo.", pt: "Tens o direito de sentir orgulho." },
  // 352
  { de: "Mut bringt dich deinem Morgen näher.", en: "Courage brings your tomorrow closer.", fr: "Le courage rapproche ton demain.", pl: "Odwaga przybliża twoje jutro.", es: "El valor acerca tu mañana.", pt: "A coragem aproxima o teu amanhã." },
  // 353
  { de: "Bleib dran, es lohnt sich.", en: "Stick with it, it's worth it.", fr: "Tiens bon, ça en vaut la peine.", pl: "Nie odpuszczaj, warto.", es: "No lo dejes, merece la pena.", pt: "Não desistas, vale a pena." },
  // 354
  { de: "Du kannst Großes erreichen.", en: "You can reach great things.", fr: "Tu peux accomplir de grandes choses.", pl: "Możesz osiągnąć wielkie rzeczy.", es: "Puedes lograr cosas grandes.", pt: "Podes alcançar grandes coisas." },
  // 355
  { de: "Dein Weg beginnt genau hier.", en: "Your path starts right here.", fr: "Ton chemin commence ici même.", pl: "Twoja droga zaczyna się właśnie tu.", es: "Tu camino empieza justo aquí.", pt: "O teu caminho começa mesmo aqui." },
  // 356
  { de: "Das Beste liegt noch vor dir.", en: "The best is still ahead.", fr: "Le meilleur est encore devant toi.", pl: "Najlepsze dopiero przed tobą.", es: "Lo mejor está por llegar.", pt: "O melhor ainda está para vir." },
  // 357
  { de: "In dir steckt etwas Besonderes.", en: "There's something special in you.", fr: "Il y a en toi quelque chose de rare.", pl: "Jest w tobie coś wyjątkowego.", es: "Hay algo especial en ti.", pt: "Há algo de especial em ti." },
  // 358
  { de: "Heute darf Leichtigkeit gewinnen.", en: "Let today be light.", fr: "Aujourd'hui, laisse la légèreté l'emporter.", pl: "Niech dziś wygra lekkość.", es: "Hoy que gane la ligereza.", pt: "Hoje que ganhe a leveza." },
  // 359
  { de: "Folge dem, was dich begeistert.", en: "Follow what lights you up.", fr: "Suis ce qui t'enthousiasme.", pl: "Podążaj za tym, co cię zachwyca.", es: "Sigue lo que te entusiasma.", pt: "Segue aquilo que te entusiasma." },
  // 360
  { de: "Ein kleiner Schritt reicht manchmal.", en: "Sometimes one small step is enough.", fr: "Parfois, un petit pas suffit.", pl: "Czasem wystarczy mały krok.", es: "A veces basta un paso pequeño.", pt: "Às vezes basta um passo pequeno." },
  // 361
  { de: "Schöne Dinge brauchen ihren Moment.", en: "Good things need their moment.", fr: "Les belles choses ont besoin de leur moment.", pl: "Piękne rzeczy potrzebują swojej chwili.", es: "Las cosas bellas necesitan su momento.", pt: "As coisas belas precisam do seu momento." },
  // 362
  { de: "Mach aus Hoffnung Zuversicht.", en: "Turn hope into confidence.", fr: "Transforme l'espoir en confiance.", pl: "Zamień nadzieję w pewność.", es: "Convierte la esperanza en confianza.", pt: "Transforma a esperança em confiança." },
  // 363
  { de: "Lass dich vom Morgen überraschen.", en: "Let tomorrow surprise you.", fr: "Laisse demain te surprendre.", pl: "Daj się zaskoczyć jutru.", es: "Deja que el mañana te sorprenda.", pt: "Deixa o amanhã surpreender-te." },
  // 364
  { de: "Deine besten Momente kommen noch.", en: "Your best moments are still coming.", fr: "Tes plus beaux moments sont à venir.", pl: "Twoje najlepsze chwile dopiero nadejdą.", es: "Tus mejores momentos están por venir.", pt: "Os teus melhores momentos ainda estão para vir." },
  // 365
  { de: "Freu dich auf das, was kommt.", en: "Look forward to what's coming.", fr: "Réjouis-toi de ce qui vient.", pl: "Ciesz się na to, co nadchodzi.", es: "Ilusiónate con lo que viene.", pt: "Anseia por aquilo que vem." },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 1 on 1 January, counted in LOCAL time so the line turns over at the
 * reader's midnight rather than at UTC's.
 *
 * Both ends are local midnights, so their difference is a whole number of days
 * give or take the hour a daylight-saving change adds or removes. Rounding
 * absorbs that; flooring would lose a day for half the year.
 */
export function dayOfYear(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const newYear = new Date(now.getFullYear(), 0, 1);
  return Math.round((today.getTime() - newYear.getTime()) / DAY_MS) + 1;
}

/** The line for a given day, in a given language, English if that one is missing. */
export function motivationQuoteForDay(day: number, language: ResolvedInterfaceLanguage): string {
  const count = MOTIVATION_QUOTES.length;
  if (!count) return "";
  // Two modulos rather than one: the second brings a nonsense negative day
  // back into range instead of indexing off the front.
  const index = (((Math.trunc(day) - 1) % count) + count) % count;
  const quote = MOTIVATION_QUOTES[index];
  return quote[language] ?? quote.en;
}

/** Today's line, following the app language and turning over at midnight. */
export function useMotivationQuote(): string {
  const language = useInterfaceLanguage();
  const [day, setDay] = useState(() => dayOfYear());
  useEffect(() => {
    // Left open overnight the banner should follow the date, rather than wait
    // for whatever happens to re-render it next.
    let timer: ReturnType<typeof setTimeout>;
    const armForNextMidnight = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      // A minute past it, so a clock running a shade fast still lands on the
      // new day. Waking from sleep late is harmless: the day is read again.
      timer = setTimeout(() => {
        setDay(dayOfYear());
        armForNextMidnight();
      }, midnight.getTime() - now.getTime() + 60_000);
    };
    armForNextMidnight();
    return () => clearTimeout(timer);
  }, []);
  return motivationQuoteForDay(day, language);
}
