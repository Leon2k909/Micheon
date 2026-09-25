import type { TranslationTable } from "@/lib/translations";

/**
 * Standard Albanian translations keyed by the German catalogue text.
 *
 * THE VARIETY is Standard Albanian (gjuha standarde) as it is written in
 * Albania today, with its two letters of its own always in place: ë and ç.
 * Typed in a hurry Albanian drops both, and a learner copies what the card
 * shows, so the table never does — see albanianTextMatch.ts for the other
 * side of that, where a learner who leaves them off is met with a slip, not
 * a mistake. Days, months and languages are written small (e hënë, janar,
 * gjermanisht), contractions with the plain apostrophe (ç'kemi, s'kam).
 *
 * THE STANDARD is what an Albanian would actually say in that situation, at
 * the register the German uses. A German sentence rebuilt word for word fails
 * even when every word is right, because the learner cannot tell and will
 * repeat it. So Na? is Ç'kemi?, Prost is Gëzuar, Guten Appetit is Ju bëftë
 * mirë, and Gute Besserung is Shërim të shpejtë.
 *
 * NOUNS CARRY THEIR ARTICLE, which in Albanian is an ending: das Haus is
 * shtëpia, the house, and the ending is what shows the gender. Verbs are given
 * in the first person singular of the present, the form an Albanian dictionary
 * lists; adjectives in the masculine, with the small article most of them take
 * (i madh, i bukur).
 *
 * FORMAL ADDRESS follows the German: du is ti, ihr and Sie are ju. When the
 * learner speaks about themself, a phrasing that is the same for a man and a
 * woman is preferred wherever Albanian has one — U lodha rather than Jam i
 * lodhur — and the masculine is written only where it has none.
 *
 * ALBANIAN THINGS. A card that is not about life in Germany carries Albanian
 * people and places: Anna is Ana, Herr Müller is zoti Hoxha, a ticket to
 * Hamburg is a ticket to Durrës — and a sentence stays true, so a train
 * between two Albanian towns becomes the bus or the furgon Albanians take. A
 * card that IS about life in Germany — the Bürgeramt, the Schufa, the
 * Deutschlandticket — keeps everything German, which is how an Albanian living
 * in Germany talks about them. The German language itself stays German
 * everywhere: Ich lerne Deutsch is Mësoj gjermanisht. Euro amounts stay euros.
 *
 * ONE ANSWER PER SPELLING. The course teaches a sentence in the form people
 * say it (ich hab) and the exam form (ich habe), and the app looks a card up
 * by whichever it is showing, so each German spelling of one sentence is a key
 * here with the same Albanian beside it. They were written once and copied,
 * never translated twice, so the two can never drift apart.
 *
 * WHERE TWO GERMAN CARDS MEET ONE ALBANIAN LINE they are left to collide and
 * the course keeps one card carrying both meanings, as the Portuguese table
 * does.
 */
export const ALBANIAN_BY_GERMAN: TranslationTable = {
};
