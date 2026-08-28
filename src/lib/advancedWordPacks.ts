import type { Blueprint } from "./types";

/**
 * Vocabulary-only depth for learners who already know the everyday basics.
 *
 * These entries are deliberately authored rather than generated. Each card
 * has one useful German headword and one natural English meaning so the same
 * catalogue remains useful in either learning direction. Keep new packs
 * append-only after release: word progress is global by lemma, while the pack
 * order is the curriculum order used by the word ladder.
 */
const focus = "High-utility upper-intermediate and advanced vocabulary for dedicated word sittings, with exact German-English meanings in both learning directions.";

export const advancedWordPartBlueprints: Record<string, Blueprint> = {
  part411: {
    label: "Part 411",
    level: "B2-C1",
    theme: "Nuanced descriptions",
    description: "Precise adjectives and adverbs for describing quality, scale, certainty and change without relying on very basic words.",
    focus,
    seeds: [
      { de: "subtil", lookup: "subtil", fallbackEn: "subtle", tip: "adjective" },
      { de: "vage", lookup: "vage", fallbackEn: "vague", tip: "adjective" },
      { de: "unkompliziert", lookup: "unkompliziert", fallbackEn: "straightforward", tip: "adjective" },
      { de: "überwältigend", lookup: "überwältigend", fallbackEn: "overwhelming", tip: "adjective" },
      { de: "widerwillig", lookup: "widerwillig", fallbackEn: "reluctant", tip: "adjective" },
      { de: "eifrig", lookup: "eifrig", fallbackEn: "eager", tip: "adjective" },
      { de: "vernünftig", lookup: "vernünftig", fallbackEn: "reasonable", tip: "adjective" },
      { de: "unvernünftig", lookup: "unvernünftig", fallbackEn: "unreasonable", tip: "adjective" },
      { de: "irreführend", lookup: "irreführend", fallbackEn: "misleading", tip: "adjective" },
      { de: "voreingenommen", lookup: "voreingenommen", fallbackEn: "prejudiced, biased", tip: "adjective" },
      { de: "zerbrechlich", lookup: "zerbrechlich", fallbackEn: "fragile", tip: "adjective" },
      { de: "langlebig", lookup: "langlebig", fallbackEn: "durable", tip: "adjective" },
      { de: "reichlich", lookup: "reichlich", fallbackEn: "abundant", tip: "adjective" },
      { de: "präzise", lookup: "präzise", fallbackEn: "precise", tip: "adjective" },
      { de: "absichtlich", lookup: "absichtlich", fallbackEn: "intentional", tip: "adjective" },
      { de: "unangebracht", lookup: "unangebracht", fallbackEn: "out of place, inappropriate", tip: "adjective" },
      { de: "überzeugend", lookup: "überzeugend", fallbackEn: "convincing", tip: "adjective" },
      { de: "vernachlässigbar", lookup: "vernachlässigbar", fallbackEn: "too small to matter", tip: "adjective" },
      { de: "beträchtlich", lookup: "beträchtlich", fallbackEn: "substantial, considerable", tip: "adjective" },
      { de: "einheitlich", lookup: "einheitlich", fallbackEn: "uniform", tip: "adjective" },
      { de: "willkürlich", lookup: "willkürlich", fallbackEn: "arbitrary", tip: "adjective" },
      { de: "inhärent", lookup: "inhärent", fallbackEn: "inherent", tip: "adjective" },
      { de: "beispiellos", lookup: "beispiellos", fallbackEn: "unprecedented", tip: "adjective" },
      { de: "nachteilig", lookup: "nachteilig", fallbackEn: "detrimental", tip: "adjective" },
      { de: "vorteilhaft", lookup: "vorteilhaft", fallbackEn: "advantageous", tip: "adjective" },
      { de: "außergewöhnlich", lookup: "außergewöhnlich", fallbackEn: "exceptional", tip: "adjective" },
      { de: "übermäßig", lookup: "übermäßig", fallbackEn: "excessive", tip: "adjective" },
      { de: "mäßig", lookup: "mäßig", fallbackEn: "moderate", tip: "adjective" },
      { de: "aufeinanderfolgend", lookup: "aufeinanderfolgend", fallbackEn: "consecutive", tip: "adjective" },
      { de: "gleichzeitig", lookup: "gleichzeitig", fallbackEn: "simultaneous", tip: "adjective" },
      { de: "naheliegend", lookup: "naheliegend", fallbackEn: "obvious, natural", tip: "adjective" },
      { de: "praktisch", lookup: "praktisch", fallbackEn: "practical", tip: "adjective", use: "As an adjective it means practical; in some contexts it can also mean virtually or almost." },
      { de: "unverkennbar", lookup: "unverkennbar", fallbackEn: "unmistakable", tip: "adjective" },
      { de: "unauffällig", lookup: "unauffällig", fallbackEn: "unobtrusive, inconspicuous", tip: "adjective" },
      { de: "zwingend", lookup: "zwingend", fallbackEn: "compelling", tip: "adjective" },
      { de: "maßgeblich", lookup: "maßgeblich", fallbackEn: "decisive", tip: "adjective" },
      { de: "zweckmäßig", lookup: "zweckmäßig", fallbackEn: "fit for purpose", tip: "adjective" },
      { de: "unbestreitbar", lookup: "unbestreitbar", fallbackEn: "undeniable", tip: "adjective" },
      { de: "vorwiegend", lookup: "vorwiegend", fallbackEn: "mainly, predominantly", tip: "adverb" },
      { de: "unmissverständlich", lookup: "unmissverständlich", fallbackEn: "unequivocal", tip: "adjective" },
    ],
    dialogues: [],
    phrases: [

      { de: "Der Unterschied ist subtil, aber entscheidend.", en: "The difference is subtle but crucial.", use: "Two adjectives, one verb — the classic verdict shape; subtil stresses the second syllable, unlike English subtle." },

      { de: "Ihre Antwort blieb vage, was das Misstrauen nur verstärkte.", en: "Her answer stayed vague, which only deepened the mistrust.", use: "was after a comma refers to the WHOLE preceding clause — the relative pronoun for facts, not things." },

      { de: "Die Bedienung ist erfreulich unkompliziert.", en: "The controls are refreshingly straightforward.", use: "An adverb grading an adjective: erfreulich unkompliziert = pleasingly simple — a very German pattern of measured praise." },

      { de: "Die Resonanz war überwältigend: dreitausend Bewerbungen in einer Woche.", en: "The response was overwhelming: three thousand applications in one week.", use: "die Resonanz = the response/echo to an offer; the colon then delivers the number as proof." },

      { de: "Nur widerwillig stimmte der Aufsichtsrat zu.", en: "The supervisory board agreed only reluctantly.", use: "Fronting nur widerwillig makes the reluctance the headline; zustimmen splits to the end." },

      { de: "Je eifriger er half, desto misstrauischer wurde sie.", en: "The more eagerly he helped, the more suspicious she became.", use: "je ... desto with full clauses this time: je-clause verb-final, desto-clause verb-second." },

      { de: "Der Vorschlag klingt vernünftig, die Umsetzung wäre unvernünftig teuer.", en: "The proposal sounds sensible; implementing it would be unreasonably expensive.", use: "vernünftig flips into unvernünftig used as a degree adverb — unreasonably expensive; wäre keeps it hypothetical." },

      { de: "Die Überschrift ist nicht falsch, aber bewusst irreführend.", en: "The headline is not wrong, but deliberately misleading.", use: "nicht falsch, aber ... — conceding the letter while attacking the intent; bewusst = knowingly." },

      { de: "Wer voreingenommen liest, findet nur, was er sucht.", en: "If you read with your mind made up, you only find what you were looking for.", use: "wer-clause + was-clause bracket the sentence; voreingenommen = pre-occupied in judgement, from einnehmen." },

      { de: "Das Material ist langlebig, aber die Verpackung zerbrechlich.", en: "The material is durable, but the packaging is fragile.", use: "-lebig and -brechlich: German builds both adjectives from verbs (leben, brechen) — the pack's pair of physical opposites." },

      { de: "Belege gibt es reichlich, nur zitiert sie niemand.", en: "There is abundant evidence — only nobody cites it.", use: "X gibt es reichlich fronts the object of es gibt; nur as a conjunction = only/except that." },

      { de: "Drücken Sie sich bitte präziser aus: Wen genau meinen Sie?", en: "Please be more precise: who exactly do you mean?", use: "sich ausdrücken = to express oneself; the comparative präziser + the pointed follow-up question." },

      { de: "Ob absichtlich oder nicht: Die Wirkung bleibt dieselbe.", en: "Whether intentional or not, the effect is the same.", use: "Ob X oder nicht: — a verbless concession clause, sealed with a colon; dieselbe agrees with die Wirkung." },

      { de: "Die Bemerkung war unangebracht, der Zeitpunkt noch mehr.", en: "The remark was inappropriate; the timing even more so.", use: "noch mehr stands for noch unangebrachter — German lets the degree word carry the elided adjective." },

      { de: "Das Risiko ist vernachlässigbar, der Nutzen beträchtlich.", en: "The risk is negligible; the benefit substantial.", use: "A two-beat verdict with the verb said once; vernachlässigbar — -bar turns vernachlässigen into ignorable." },

      { de: "Ein einheitliches Vorgehen wäre effizienter als dreißig Einzellösungen.", en: "A uniform approach would be more efficient than thirty separate solutions.", use: "wäre + comparative + als — hypothetical comparison; das Vorgehen nominalises vorgehen, the how-we-proceed." },

      { de: "Die Auswahl wirkt willkürlich, folgt aber einem klaren Kriterium.", en: "The selection looks arbitrary, but it follows a clear criterion.", use: "wirken = to appear (outward impression) against folgen + Dativ for the hidden rule." },

      { de: "Dem System inhärent ist ein Zielkonflikt, den keine Reform auflöst.", en: "Inherent in the system is a conflict of goals that no reform can resolve.", use: "Dem System inhärent fronted with dative — the elevated register inhärent lives in; the subject arrives after ist." },

      { de: "Der Andrang war beispiellos, die Organisation ihm nicht gewachsen.", en: "The turnout was unprecedented, and the organisers were not equal to it.", use: "jemandem/etwas gewachsen sein = to be equal to it, to measure up — with ihm pointing at the Andrang." },

      { de: "Für Pendler ist die neue Regelung eher nachteilig, für Familien vorteilhaft.", en: "For commuters the new rule is rather disadvantageous; for families it is advantageous.", use: "Two für-phrases split the verdict; nachteilig and vorteilhaft are the pack's mirrored pair." },

      { de: "Mäßig begabt, aber außergewöhnlich fleißig: So beschrieb ihn sein Lehrer.", en: "Moderately gifted but exceptionally hard-working: that was how his teacher described him.", use: "A verbless appraisal, then So beschrieb ... — so points back at the whole quoted judgement." },

    ],
  },
  part412: {
    label: "Part 412",
    level: "B2-C1",
    theme: "Character and social behaviour",
    description: "Useful words for describing how people behave, relate to others and come across in real life.",
    focus,
    seeds: [
      { de: "rücksichtslos", lookup: "rücksichtslos", fallbackEn: "inconsiderate", tip: "adjective" },
      { de: "durchsetzungsfähig", lookup: "durchsetzungsfähig", fallbackEn: "assertive", tip: "adjective" },
      { de: "kontaktfreudig", lookup: "kontaktfreudig", fallbackEn: "outgoing", tip: "adjective" },
      { de: "aufgeschlossen", lookup: "aufgeschlossen", fallbackEn: "open-minded", tip: "adjective" },
      { de: "engstirnig", lookup: "engstirnig", fallbackEn: "narrow-minded", tip: "adjective" },
      { de: "vertrauenswürdig", lookup: "vertrauenswürdig", fallbackEn: "trustworthy", tip: "adjective" },
      { de: "heuchlerisch", lookup: "heuchlerisch", fallbackEn: "hypocritical", tip: "adjective" },
      { de: "geduldig", lookup: "geduldig", fallbackEn: "patient with people", tip: "adjective" },
      { de: "ungeduldig", lookup: "ungeduldig", fallbackEn: "impatient", tip: "adjective" },
      { de: "großzügig", lookup: "großzügig", fallbackEn: "generous", tip: "adjective" },
      { de: "geizig", lookup: "geizig", fallbackEn: "stingy", tip: "adjective" },
      { de: "bescheiden", lookup: "bescheiden", fallbackEn: "modest, humble", tip: "adjective" },
      { de: "herablassend", lookup: "herablassend", fallbackEn: "condescending", tip: "adjective" },
      { de: "neidisch", lookup: "neidisch", fallbackEn: "envious", tip: "adjective" },
      { de: "hilfsbereit", lookup: "hilfsbereit", fallbackEn: "helpful", tip: "adjective" },
      { de: "abweisend", lookup: "abweisend", fallbackEn: "dismissive", tip: "adjective" },
      { de: "feindselig", lookup: "feindselig", fallbackEn: "hostile", tip: "adjective" },
      { de: "nahbar", lookup: "nahbar", fallbackEn: "approachable", tip: "adjective" },
      { de: "verlässlich", lookup: "verlässlich", fallbackEn: "dependable", tip: "adjective" },
      { de: "einfallsreich", lookup: "einfallsreich", fallbackEn: "resourceful", tip: "adjective" },
      { de: "nachlässig", lookup: "nachlässig", fallbackEn: "careless", tip: "adjective" },
      { de: "vorsichtig", lookup: "vorsichtig", fallbackEn: "cautious", tip: "adjective" },
      { de: "leichtgläubig", lookup: "leichtgläubig", fallbackEn: "gullible", tip: "adjective" },
      { de: "skeptisch", lookup: "skeptisch", fallbackEn: "sceptical", tip: "adjective" },
      { de: "selbstsicher", lookup: "selbstsicher", fallbackEn: "confident, self-assured", tip: "adjective" },
      { de: "beschämt", lookup: "beschämt", fallbackEn: "ashamed", tip: "adjective" },
      { de: "dankbar", lookup: "dankbar", fallbackEn: "grateful", tip: "adjective" },
      { de: "gewissenhaft", lookup: "gewissenhaft", fallbackEn: "conscientious", tip: "adjective" },
      { de: "unberechenbar", lookup: "unberechenbar", fallbackEn: "unpredictable", tip: "adjective" },
      { de: "schlagfertig", lookup: "schlagfertig", fallbackEn: "quick-witted", tip: "adjective" },
      { de: "taktvoll", lookup: "taktvoll", fallbackEn: "tactful", tip: "adjective" },
      { de: "untreu", lookup: "untreu", fallbackEn: "unfaithful", tip: "adjective" },
      { de: "treu", lookup: "treu", fallbackEn: "loyal", tip: "adjective" },
      { de: "mitfühlend", lookup: "mitfühlend", fallbackEn: "compassionate", tip: "adjective" },
      { de: "unhöflich", lookup: "unhöflich", fallbackEn: "rude", tip: "adjective" },
      { de: "gelassen", lookup: "gelassen", fallbackEn: "composed", tip: "adjective" },
      { de: "ehrgeizig", lookup: "ehrgeizig", fallbackEn: "ambitious", tip: "adjective" },
      { de: "anmaßend", lookup: "anmaßend", fallbackEn: "presumptuous", tip: "adjective" },
      { de: "verschlossen", lookup: "verschlossen", fallbackEn: "guarded", tip: "adjective" },
      { de: "verständnisvoll", lookup: "verständnisvoll", fallbackEn: "understanding", tip: "adjective" },
    ],
    dialogues: [],
    phrases: [

      { de: "Rücksichtslos ist er nur im Straßenverkehr, sonst der geduldigste Mensch.", en: "He is only inconsiderate in traffic; otherwise he is the most patient person imaginable.", use: "Fronting the adjective (Rücksichtslos ist er ...) concedes the flaw before confining it; sonst = otherwise." },

      { de: "Durchsetzungsfähig heißt nicht laut.", en: "Assertive does not mean loud.", use: "The four-word definition frame again: X heißt nicht Y — German loves settling a confusion this briefly." },

      { de: "Sie ist kontaktfreudig und kommt überall schnell ins Gespräch.", en: "She is outgoing and gets talking to people quickly wherever she goes.", use: "ins Gespräch kommen = to fall into conversation; kontaktfreudig — -freudig builds 'taking joy in' adjectives." },

      { de: "Bleib aufgeschlossen, aber nicht leichtgläubig.", en: "Stay open-minded, but don't be gullible.", use: "The du-imperative bleib carries both adjectives; the pack's caution — openness has a failure mode, and it is named." },

      { de: "Engstirnig wird man nicht über Nacht, das schleicht sich ein.", en: "You don't become narrow-minded overnight; it creeps up on you.", use: "sich einschleichen = to creep in unnoticed; über Nacht = overnight, the fixed phrase for sudden change denied here." },

      { de: "Vertrauenswürdig ist, wer auch dann ehrlich bleibt, wenn niemand hinschaut.", en: "Trustworthy is the person who stays honest even when nobody is watching.", use: "auch dann ..., wenn = even then, when; hinschauen = to look over there — attention, not just vision." },

      { de: "Sein Lob klang heuchlerisch, denn gestern sagte er noch das Gegenteil.", en: "His praise rang hollow — only yesterday he was saying the opposite.", use: "klingen + adjective = to sound/ring; denn explains without changing word order; noch gestern = as recently as yesterday." },

      { de: "Mit Kindern ist sie geduldig, mit Erwachsenen deutlich ungeduldiger.", en: "With children she is patient; with adults, noticeably less so.", use: "The comparative ungeduldiger against the base geduldig; deutlich = noticeably, grading the comparative." },

      { de: "Beim Schenken großzügig, beim Zuhören geizig.", en: "Generous with gifts, stingy with attention.", use: "beim + nominalised verb twice, no main verb at all — a portrait in eight words; geizig transfers from money to attention." },

      { de: "Bescheiden geblieben ist er trotz allem Erfolg.", en: "For all his success, he has stayed modest.", use: "The participle phrase fronts (Bescheiden geblieben ist er) — emphasis by inversion; trotz allem Erfolg with dative allem." },

      { de: "Ihr herablassender Ton macht jedes Kompliment zunichte.", en: "Her condescending tone undoes every compliment.", use: "zunichtemachen = to bring to nothing; herablassend — literally letting-oneself-down-to-you, hence condescending." },

      { de: "Sei nicht neidisch auf Dinge, die du gar nicht willst.", en: "Don't be envious of things you don't even want.", use: "neidisch auf + Akkusativ; gar nicht = not at all — the gar sharpens the absurdity the sentence points at." },

      { de: "Hilfsbereit ja, aber nicht auf eigene Kosten.", en: "Helpful, yes — but not at your own expense.", use: "X ja, aber ... — spoken German's way of agreeing with a reservation; auf eigene Kosten = at one's own expense." },

      { de: "Am Telefon wirkt er abweisend, persönlich ist er nahbar.", en: "On the phone he seems dismissive; in person he is approachable.", use: "abweisend and nahbar are this pack's door-shut and door-open; wirken for the impression, sein for the fact." },

      { de: "Ein verlässlicher Kollege sagt früh Bescheid, wenn etwas nicht klappt.", en: "A dependable colleague lets you know early when something isn't going to work.", use: "Bescheid sagen = to let someone know; klappen = to work out — the everyday verb for plans succeeding." },

      { de: "Einfallsreich wird man, wenn das Budget klein ist.", en: "You get resourceful when the budget is small.", use: "werden + adjective for becoming; einfallsreich — rich in Einfälle, the ideas that fall into your head." },

      { de: "Ein nachlässiger Fehler, und die ganze Bewerbung landet im Papierkorb.", en: "One careless mistake and the whole application ends up in the bin.", use: "Noun phrase + und + consequence — a conditional without wenn; landen in = to end up in, informal and vivid." },

      { de: "Skeptisch bleiben heißt prüfen, nicht alles ablehnen.", en: "Staying sceptical means checking things, not rejecting everything.", use: "Two bare infinitives after heißt, corrected by nicht — scepticism defined against its caricature." },

      { de: "Nach außen selbstsicher, innerlich voller Zweifel.", en: "Confident on the outside, full of doubt within.", use: "nach außen / innerlich — the outward-inward axis; voller + Genitiv-like bare noun (voller Zweifel) = full of." },

      { de: "Taktvoll verschwieg sie, woher sie die Zahlen kannte.", en: "She was tactful enough not to say how she knew the figures.", use: "verschweigen = to deliberately not say — German has a single verb for the tactful omission; woher-clause as its object." },

      { de: "Auf seine schlagfertige Antwort fiel niemandem eine Erwiderung ein.", en: "Nobody could think of a comeback to his quick-witted reply.", use: "jemandem fällt etwas ein = something occurs to someone — the ideas do the falling, the person is dative." },

    ],
  },
  part413: {
    label: "Part 413",
    level: "B2-C1",
    theme: "Communication and discussion",
    description: "Verbs for explaining a point, reacting to an argument and managing a difficult conversation precisely.",
    focus,
    seeds: [
      { de: "anerkennen", lookup: "anerkennen", fallbackEn: "to acknowledge", tip: "verb" },
      { de: "klarstellen", lookup: "klarstellen", fallbackEn: "to make clear", tip: "verb" },
      { de: "näher ausführen", lookup: "ausführen", fallbackEn: "to elaborate", tip: "verb" },
      { de: "umformulieren", lookup: "umformulieren", fallbackEn: "to rephrase", tip: "verb" },
      { de: "entmutigen", lookup: "entmutigen", fallbackEn: "to discourage", tip: "verb" },
      { de: "beruhigen", lookup: "beruhigen", fallbackEn: "to reassure", tip: "verb" },
      { de: "warnen", lookup: "warnen", fallbackEn: "to warn", tip: "verb" },
      { de: "benachrichtigen", lookup: "benachrichtigen", fallbackEn: "to notify", tip: "verb" },
      { de: "erwähnen", lookup: "erwähnen", fallbackEn: "to mention", tip: "verb" },
      { de: "auslassen", lookup: "auslassen", fallbackEn: "to omit", tip: "verb" },
      { de: "herunterspielen", lookup: "herunterspielen", fallbackEn: "to downplay", tip: "verb" },
      { de: "irreführen", lookup: "irreführen", fallbackEn: "to mislead", tip: "verb" },
      { de: "offenlegen", lookup: "offenlegen", fallbackEn: "to disclose", tip: "verb" },
      { de: "zurückhalten", lookup: "zurückhalten", fallbackEn: "to hold back, withhold", tip: "verb" },
      { de: "widersprechen", lookup: "widersprechen", fallbackEn: "to contradict", tip: "verb" },
      { de: "kritisieren", lookup: "kritisieren", fallbackEn: "to criticise", tip: "verb" },
      { de: "beschuldigen", lookup: "beschuldigen", fallbackEn: "to accuse", tip: "verb" },
      { de: "jemandem die Schuld geben", lookup: "Schuld geben", fallbackEn: "to blame", tip: "verb phrase" },
      { de: "einwenden", lookup: "einwenden", fallbackEn: "to object", tip: "verb" },
      { de: "anfordern", lookup: "anfordern", fallbackEn: "to request", tip: "verb" },
      { de: "sich erkundigen", lookup: "erkundigen", fallbackEn: "to enquire", tip: "verb" },
      { de: "umschreiben", lookup: "umschreiben", fallbackEn: "to express in other words", tip: "verb" },
      { de: "verkünden", lookup: "verkünden", fallbackEn: "to proclaim", tip: "verb" },
      { de: "behaupten", lookup: "behaupten", fallbackEn: "to assert, claim", tip: "verb" },
      { de: "erwidern", lookup: "erwidern", fallbackEn: "to retort", tip: "verb" },
      { de: "vermitteln", lookup: "vermitteln", fallbackEn: "to convey", tip: "verb" },
      { de: "ansprechen", lookup: "ansprechen", fallbackEn: "to raise a topic", tip: "verb" },
      { de: "bekräftigen", lookup: "bekräftigen", fallbackEn: "to reaffirm", tip: "verb" },
      { de: "preisgeben", lookup: "preisgeben", fallbackEn: "to divulge", tip: "verb" },
      { de: "ankündigen", lookup: "ankündigen", fallbackEn: "to announce", tip: "verb" },
      { de: "schildern", lookup: "schildern", fallbackEn: "to recount", tip: "verb" },
      { de: "formulieren", lookup: "formulieren", fallbackEn: "to formulate", tip: "verb" },
      { de: "zustimmen", lookup: "zustimmen", fallbackEn: "to agree", tip: "verb" },
      { de: "bezeugen", lookup: "bezeugen", fallbackEn: "to attest", tip: "verb" },
      { de: "nachfragen", lookup: "nachfragen", fallbackEn: "to ask a follow-up question", tip: "verb" },
      { de: "ergänzen", lookup: "ergänzen", fallbackEn: "to supplement", tip: "verb" },
      { de: "entgegnen", lookup: "entgegnen", fallbackEn: "to counter", tip: "verb" },
      { de: "abraten", lookup: "abraten", fallbackEn: "to advise against", tip: "verb" },
      { de: "einlenken", lookup: "einlenken", fallbackEn: "to concede", tip: "verb" },
      { de: "aufgreifen", lookup: "aufgreifen", fallbackEn: "to pick up on a point", tip: "verb" },
    ],
    dialogues: [],
    phrases: [

      { de: "Ich möchte gleich zu Beginn klarstellen, worum es heute nicht geht.", en: "Let me make clear right at the start what today is not about.", use: "klarstellen introduces an indirect question; worum es geht = what it is about, negated inside the clause." },

      { de: "Könnten Sie diesen Punkt näher ausführen?", en: "Could you elaborate on that point?", use: "näher ausführen = to set out in more detail — the polite conference-room request, with Konjunktiv II könnten." },

      { de: "Der Satz ist missverständlich, formulieren Sie ihn um.", en: "The sentence is ambiguous — rephrase it.", use: "umformulieren splits in the imperative: formulieren Sie ... um. missverständlich = open to misunderstanding, not wrong." },

      { de: "Lass dich von einer Absage nicht entmutigen.", en: "Don't let one rejection discourage you.", use: "lass dich nicht + infinitive = don't let yourself be X-ed — the lassen-passive as encouragement." },

      { de: "Die Airline beruhigte die Passagiere und benachrichtigte die Angehörigen.", en: "The airline reassured the passengers and notified the relatives.", use: "beruhigen and benachrichtigen share one subject; die Angehörigen = the relatives, a nominalised adjective." },

      { de: "Er erwähnte den Vorfall nur beiläufig, als wäre nichts gewesen.", en: "He mentioned the incident only in passing, as if nothing had happened.", use: "als wäre + participle = as if it had been — Konjunktiv II with verb-second als, no wenn." },

      { de: "Im Bericht wurde ausgelassen, wer den Auftrag erteilt hatte.", en: "The report omitted who had given the order.", use: "auslassen in the passive with an indirect question as subject; erteilt hatte — Plusquamperfekt for the earlier act." },

      { de: "Die Zahlen herunterzuspielen macht sie nicht kleiner.", en: "Downplaying the numbers does not make them any smaller.", use: "A zu-infinitive phrase as subject (Die Zahlen herunterzuspielen) — zu inside the separable herunterspielen." },

      { de: "Die Werbung führt in die Irre, ohne direkt zu lügen.", en: "The advert misleads without actually lying.", use: "in die Irre führen is the idiom irreführen was built from; ohne zu lügen — the innocence-preserving clause." },

      { de: "Legen Sie alle Interessenkonflikte offen.", en: "Disclose all conflicts of interest.", use: "offenlegen splits in the imperative; der Interessenkonflikt — German compounds what English joins with 'of'." },

      { de: "Wer Informationen zurückhält, verliert als Erstes das Vertrauen der anderen.", en: "If you withhold information, the first thing you lose is people's trust.", use: "als Erstes = first of all; zurückhalten = to hold back deliberately — the withholding is a choice." },

      { de: "Ich will niemanden beschuldigen, aber Fragen wird man ja stellen dürfen.", en: "I'm not accusing anyone, but surely one is allowed to ask questions.", use: "wird man ja ... dürfen — the defensive ja of 'surely'; the sentence every German meeting hears before an accusation." },

      { de: "Gib nicht dem Boten die Schuld.", en: "Don't blame the messenger.", use: "jemandem die Schuld geben — blame goes to the DATIVE; the proverb arrives ready-made with the pack's phrase." },

      { de: "Dagegen lässt sich einwenden, dass die Daten veraltet sind.", en: "One might object that the data is out of date.", use: "Dagegen lässt sich einwenden, dass ... — the fixed academic move for raising an objection without owning it." },

      { de: "Fordern Sie die Unterlagen schriftlich an.", en: "Request the documents in writing.", use: "anfordern splits; schriftlich as a bare adverb = in writing. Firmer than bitten um, short of verlangen." },

      { de: "Erkundigen Sie sich vorher, welche Nachweise verlangt werden.", en: "Enquire beforehand which documents are required.", use: "sich erkundigen + indirect question; vorher = beforehand, floating free where English needs a phrase." },

      { de: "Das Gericht verkündete das Urteil am frühen Nachmittag.", en: "The court announced the verdict in the early afternoon.", use: "verkünden = to proclaim officially — courts verkünden, people just sagen; am frühen Nachmittag with the adjective inside." },

      { de: "Auf den Vorwurf erwiderte sie nur, man werde sich vor Gericht wiedersehen.", en: "To the accusation she merely replied that they would see each other in court.", use: "man werde — Konjunktiv I future in reported speech; sich wiedersehen = to meet again, here as a threat." },

      { de: "Gute Lehrer vermitteln nicht nur Wissen, sondern auch Haltung.", en: "Good teachers convey not just knowledge but also an attitude.", use: "nicht nur ..., sondern auch — the addition frame; vermitteln = to convey/impart, also to mediate elsewhere." },

      { de: "Er bekräftigte seine Aussage vor laufender Kamera.", en: "He reaffirmed his statement on camera.", use: "vor laufender Kamera = with the camera rolling — a participle attribute; bekräftigen strengthens what was already said." },

      { de: "Statt einzulenken, griff sie den schwächsten Punkt der Gegenseite auf.", en: "Instead of backing down, she seized on the other side's weakest point.", use: "statt + zu-infinitive (einzulenken — zu inside the separable verb); aufgreifen splits at the end." },

    ],
  },
  part414: {
    label: "Part 414",
    level: "B2-C1",
    theme: "Work and organisation",
    description: "High-value verbs for projects, administration and decisions at work or in formal everyday life.",
    focus,
    seeds: [
      { de: "priorisieren", lookup: "priorisieren", fallbackEn: "to prioritise", tip: "verb" },
      { de: "delegieren", lookup: "delegieren", fallbackEn: "to delegate", tip: "verb" },
      { de: "koordinieren", lookup: "koordinieren", fallbackEn: "to coordinate", tip: "verb" },
      { de: "beaufsichtigen", lookup: "beaufsichtigen", fallbackEn: "to supervise", tip: "verb" },
      { de: "anwerben", lookup: "anwerben", fallbackEn: "to recruit", tip: "verb" },
      { de: "befördern", lookup: "befördern", fallbackEn: "to promote", tip: "verb" },
      { de: "einhalten", lookup: "einhalten", fallbackEn: "to comply with", tip: "verb", use: "Used for rules, deadlines, promises and agreements that must be observed." },
      { de: "genehmigen", lookup: "genehmigen", fallbackEn: "to approve", tip: "verb" },
      { de: "einplanen", lookup: "einplanen", fallbackEn: "to schedule", tip: "verb" },
      { de: "schätzen", lookup: "schätzen", fallbackEn: "to estimate", tip: "verb" },
      { de: "prognostizieren", lookup: "prognostizieren", fallbackEn: "to forecast", tip: "verb" },
      { de: "budgetieren", lookup: "budgetieren", fallbackEn: "to budget", tip: "verb" },
      { de: "in Rechnung stellen", lookup: "Rechnung stellen", fallbackEn: "to invoice", tip: "verb phrase" },
      { de: "überarbeiten", lookup: "überarbeiten", fallbackEn: "to revise", tip: "verb" },
      { de: "Korrektur lesen", lookup: "Korrektur lesen", fallbackEn: "to proofread", tip: "verb phrase" },
      { de: "bevollmächtigen", lookup: "bevollmächtigen", fallbackEn: "to authorise", tip: "verb" },
      { de: "durchsetzen", lookup: "durchsetzen", fallbackEn: "to enforce", tip: "verb" },
      { de: "gegen etwas verstoßen", lookup: "verstoßen", fallbackEn: "to violate", tip: "verb" },
      { de: "begleichen", lookup: "begleichen", fallbackEn: "to settle a payment", tip: "verb" },
      { de: "einführen", lookup: "einführen", fallbackEn: "to launch, introduce", tip: "verb" },
      { de: "zurückziehen", lookup: "zurückziehen", fallbackEn: "to withdraw", tip: "verb" },
      { de: "beibehalten", lookup: "beibehalten", fallbackEn: "to retain", tip: "verb" },
      { de: "auslagern", lookup: "auslagern", fallbackEn: "to outsource", tip: "verb" },
      { de: "optimieren", lookup: "optimieren", fallbackEn: "to optimise", tip: "verb" },
      { de: "einen Fehler beheben", lookup: "Fehler beheben", fallbackEn: "to troubleshoot", tip: "verb phrase" },
      { de: "aufrüsten", lookup: "aufrüsten", fallbackEn: "to upgrade", tip: "verb" },
      { de: "herabstufen", lookup: "herabstufen", fallbackEn: "to downgrade", tip: "verb" },
      { de: "abwickeln", lookup: "abwickeln", fallbackEn: "to process, handle", tip: "verb" },
      { de: "beschaffen", lookup: "beschaffen", fallbackEn: "to procure", tip: "verb" },
      { de: "freigeben", lookup: "freigeben", fallbackEn: "to release for use", tip: "verb" },
      { de: "einarbeiten", lookup: "einarbeiten", fallbackEn: "to onboard, train", tip: "verb" },
      { de: "befristen", lookup: "befristen", fallbackEn: "to make fixed-term", tip: "verb" },
      { de: "vermerken", lookup: "vermerken", fallbackEn: "to note on record", tip: "verb" },
      { de: "abrechnen", lookup: "abrechnen", fallbackEn: "to bill", tip: "verb" },
      { de: "bilanzieren", lookup: "bilanzieren", fallbackEn: "to take stock", tip: "verb" },
      { de: "entwerfen", lookup: "entwerfen", fallbackEn: "to draft", tip: "verb" },
      { de: "ausarbeiten", lookup: "ausarbeiten", fallbackEn: "to work out in detail", tip: "verb" },
      { de: "verwalten", lookup: "verwalten", fallbackEn: "to administer", tip: "verb" },
      { de: "zuordnen", lookup: "zuordnen", fallbackEn: "to assign", tip: "verb" },
      { de: "vereinbaren", lookup: "vereinbaren", fallbackEn: "to arrange, agree", tip: "verb" },
    ],
    dialogues: [],
    phrases: [

      { de: "Wer alles priorisiert, priorisiert nichts.", en: "If everything is a priority, nothing is.", use: "The verb repeated with alles and nichts — German states the management truism as a mirrored wer-clause." },

      { de: "Delegieren fällt ihr schwer, dabei wäre es dringend nötig.", en: "She finds delegating hard, though she badly needs to.", use: "jemandem schwerfallen = to be hard for someone; dabei introduces the ironic contrast — and yet." },

      { de: "Wer koordiniert eigentlich die beiden Teams?", en: "Who is actually coordinating the two teams?", use: "eigentlich in a question = actually/come to think of it — the particle that reveals nobody knows the answer." },

      { de: "Niemand beaufsichtigt gern und niemand wird gern beaufsichtigt.", en: "Nobody likes supervising, and nobody likes being supervised.", use: "The same verb active then passive, both with gern — German expresses 'like doing' with gern, no extra verb." },

      { de: "Die Firma wirbt gezielt Fachkräfte aus dem Ausland an.", en: "The company is actively recruiting skilled workers from abroad.", use: "anwerben splits (wirbt ... an); gezielt = in a targeted way; aus dem Ausland — the Ausland always takes its article." },

      { de: "Befördert wird, wer Ergebnisse liefert, nicht, wer am längsten bleibt.", en: "Promotion goes to those who deliver results, not those who stay latest.", use: "Passive fronted with the subject postponed twice as wer-clauses — the memo-German shape for stating policy." },

      { de: "Wer Termine zweimal nicht einhält, bekommt hier keinen dritten.", en: "Miss two deadlines here and you won't be given a third.", use: "einhalten = to keep to; keinen dritten leaves Termin unsaid — the ordinal carries the noun." },

      { de: "Das Budget wurde genehmigt, die zusätzliche Stelle nicht.", en: "The budget was approved; the extra position was not.", use: "The clipped second clause again — nicht alone negates the elided wurde genehmigt." },

      { de: "Planen Sie Pufferzeiten ein, Maschinen fallen immer im dümmsten Moment aus.", en: "Schedule buffer time — machines always fail at the worst possible moment.", use: "einplanen and ausfallen both split; im dümmsten Moment — dumm graded onto the moment itself." },

      { de: "Geschätzt waren drei Monate, geworden sind es neun.", en: "The estimate was three months; it turned into nine.", use: "Two fronted participles (Geschätzt waren ..., geworden sind ...) — the plan-versus-reality frame, four words a side." },

      { de: "Die Stunden stellen wir Ihnen am Monatsende in Rechnung.", en: "We will invoice you for the hours at the end of the month.", use: "in Rechnung stellen = to invoice — the noun phrase is the verb; Ihnen dative for the person billed." },

      { de: "Der Entwurf muss noch überarbeitet und Korrektur gelesen werden.", en: "The draft still needs revising and proofreading.", use: "Two passives share one werden; Korrektur lesen keeps its noun even inside the passive — Korrektur gelesen." },

      { de: "Für Verträge über zehntausend Euro ist er nicht bevollmächtigt.", en: "He is not authorised to sign contracts above ten thousand euros.", use: "bevollmächtigt — carrying Vollmacht, power of attorney; über + amount = above/in excess of." },

      { de: "Regeln, die niemand durchsetzt, sind Empfehlungen.", en: "Rules nobody enforces are just recommendations.", use: "The relative clause deflates the noun before the verdict lands; durchsetzen = to push through against resistance." },

      { de: "Begleichen Sie die Rechnung bitte innerhalb von vierzehn Tagen.", en: "Please settle the invoice within fourteen days.", use: "begleichen = to settle a payment — formal register where bezahlen is neutral; innerhalb von + Dativ." },

      { de: "Das alte Verfahren behalten wir bei, bis das neue zuverlässig läuft.", en: "We are keeping the old procedure until the new one runs reliably.", use: "beibehalten splits (behalten ... bei); das neue stands alone — the adjective carries the elided noun." },

      { de: "Die Buchhaltung wurde vor Jahren ausgelagert, jetzt holt man sie zurück.", en: "Accounting was outsourced years ago; now it is being brought back in.", use: "auslagern / zurückholen — the outsourcing round trip; vor Jahren = years ago, no article." },

      { de: "Erst den Fehler beheben, dann optimieren.", en: "Fix the bug first, then optimise.", use: "Bare infinitives as instructions — the register of checklists and code reviews; erst ... dann orders them." },

      { de: "Neue Mitarbeiter arbeitet sie persönlich ein.", en: "She onboards new staff personally.", use: "einarbeiten splits with the object fronted: Neue Mitarbeiter arbeitet sie ... ein — topicalisation, everyday in German." },

      { de: "Die Stelle ist auf zwei Jahre befristet.", en: "The position is fixed-term, limited to two years.", use: "befristet auf + Akkusativ — carrying die Frist inside the participle; the phrase every German job advert ends with." },

      { de: "Der Sonderwunsch wurde vermerkt, aber nie umgesetzt.", en: "The special request was noted on record but never acted on.", use: "vermerken = to note formally; umsetzen = to put into practice — noted and done are two different files." },

    ],
  },
  part415: {
    label: "Part 415",
    level: "B2-C1",
    theme: "Change, difficulty and recovery",
    description: "Verbs for saying how situations develop, go wrong, improve or are brought back under control.",
    focus,
    seeds: [
      { de: "sich verschlechtern", lookup: "verschlechtern", fallbackEn: "to deteriorate", tip: "verb" },
      { de: "schwanken", lookup: "schwanken", fallbackEn: "to fluctuate", tip: "verb" },
      { de: "stabilisieren", lookup: "stabilisieren", fallbackEn: "to stabilise", tip: "verb" },
      { de: "beschleunigen", lookup: "beschleunigen", fallbackEn: "to accelerate", tip: "verb" },
      { de: "verlangsamen", lookup: "verlangsamen", fallbackEn: "to slow down", tip: "verb" },
      { de: "zusammenbrechen", lookup: "zusammenbrechen", fallbackEn: "to collapse", tip: "verb" },
      { de: "hervorgehen", lookup: "hervorgehen", fallbackEn: "to emerge", tip: "verb" },
      { de: "verschwinden", lookup: "verschwinden", fallbackEn: "to vanish", tip: "verb" },
      { de: "anhalten", lookup: "anhalten", fallbackEn: "to continue, persist", tip: "verb" },
      { de: "auslösen", lookup: "auslösen", fallbackEn: "to trigger", tip: "verb" },
      { de: "lindern", lookup: "lindern", fallbackEn: "to alleviate", tip: "verb" },
      { de: "überwinden", lookup: "überwinden", fallbackEn: "to overcome", tip: "verb" },
      { de: "angehen", lookup: "angehen", fallbackEn: "to tackle", tip: "verb" },
      { de: "sich mit etwas befassen", lookup: "befassen", fallbackEn: "to address, deal with", tip: "verb" },
      { de: "gefährden", lookup: "gefährden", fallbackEn: "to jeopardise", tip: "verb" },
      { de: "verwandeln", lookup: "verwandeln", fallbackEn: "to transform", tip: "verb" },
      { de: "wiederherstellen", lookup: "wiederherstellen", fallbackEn: "to restore", tip: "verb" },
      { de: "bewahren", lookup: "bewahren", fallbackEn: "to preserve", tip: "verb" },
      { de: "erneuern", lookup: "erneuern", fallbackEn: "to renew", tip: "verb" },
      { de: "verwerfen", lookup: "verwerfen", fallbackEn: "to discard", tip: "verb" },
      { de: "nach hinten losgehen", lookup: "nach hinten losgehen", fallbackEn: "to backfire", tip: "verb phrase" },
      { de: "zurechtkommen", lookup: "zurechtkommen", fallbackEn: "to cope", tip: "verb" },
      { de: "aufblühen", lookup: "aufblühen", fallbackEn: "to thrive", tip: "verb" },
      { de: "zurückgehen", lookup: "zurückgehen", fallbackEn: "to decrease, decline", tip: "verb" },
      { de: "schrumpfen", lookup: "schrumpfen", fallbackEn: "to shrink", tip: "verb" },
      { de: "stagnieren", lookup: "stagnieren", fallbackEn: "to stagnate", tip: "verb" },
      { de: "abweichen", lookup: "abweichen", fallbackEn: "to deviate", tip: "verb" },
      { de: "nachlassen", lookup: "nachlassen", fallbackEn: "to subside", tip: "verb" },
      { de: "ausgleichen", lookup: "ausgleichen", fallbackEn: "to offset", tip: "verb" },
      { de: "eindämmen", lookup: "eindämmen", fallbackEn: "to contain, limit", tip: "verb" },
      { de: "beheben", lookup: "beheben", fallbackEn: "to remedy", tip: "verb" },
      { de: "mit etwas umgehen", lookup: "umgehen", fallbackEn: "to handle, deal with", tip: "verb" },
      { de: "abfedern", lookup: "abfedern", fallbackEn: "to cushion, mitigate", tip: "verb" },
      { de: "entschärfen", lookup: "entschärfen", fallbackEn: "to defuse", tip: "verb" },
      { de: "ausarten", lookup: "ausarten", fallbackEn: "to get out of hand", tip: "verb" },
      { de: "fortbestehen", lookup: "fortbestehen", fallbackEn: "to persist", tip: "verb" },
      { de: "ausweichen", lookup: "ausweichen", fallbackEn: "to evade", tip: "verb" },
      { de: "voranschreiten", lookup: "voranschreiten", fallbackEn: "to advance", tip: "verb" },
      { de: "überdauern", lookup: "überdauern", fallbackEn: "to outlast", tip: "verb" },
      { de: "aufholen", lookup: "aufholen", fallbackEn: "to catch up", tip: "verb" },
    ],
    dialogues: [],
    phrases: [

      { de: "Sein Zustand verschlechterte sich über Nacht.", en: "His condition deteriorated overnight.", use: "sich verschlechtern — the worsening happens to itself, no agent; über Nacht = overnight, literal here." },

      { de: "Die Preise schwanken stärker, als die Statistik vermuten lässt.", en: "Prices fluctuate more than the statistics would suggest.", use: "vermuten lassen = to suggest/give reason to suppose — lassen turns the statistics into a hinting agent." },

      { de: "Erst als sich die Lage stabilisierte, kehrten die Ersten zurück.", en: "Only when the situation stabilised did the first people return.", use: "Erst als = only when; the main clause inverts (kehrten die Ersten zurück) after the fronted time clause." },

      { de: "Die Talfahrt beschleunigte sich, statt sich zu verlangsamen.", en: "The decline accelerated instead of slowing down.", use: "beschleunigen and verlangsamen mirrored around statt ... zu; die Talfahrt — downhill ride as economic metaphor." },

      { de: "Unter der Last der Schulden brach das Unternehmen zusammen.", en: "Under the weight of its debts, the company collapsed.", use: "zusammenbrechen splits; unter der Last + Genitiv — the burden image German finance reporting runs on." },

      { de: "Aus der Krise ging sie gestärkt hervor.", en: "She emerged from the crisis stronger.", use: "hervorgehen aus = to emerge from; gestärkt — the participle as resultative: emerged STRENGTHENED." },

      { de: "Der Schmerz hielt an, aber die Angst verschwand.", en: "The pain persisted, but the fear vanished.", use: "anhalten (intransitive) = to persist; the two verbs split one experience into what stayed and what left." },

      { de: "Ein einziges Wort löste die Lawine aus.", en: "A single word set off the avalanche.", use: "auslösen splits; die Lawine here is figurative — the uncontainable consequence, a standing German metaphor." },

      { de: "Das Medikament lindert die Symptome, heilt aber nicht die Ursache.", en: "The drug alleviates the symptoms but does not cure the cause.", use: "lindern eases, heilen cures — the sentence keeps the medical distinction the words carry." },

      { de: "Wir verwalten das Problem seit Jahren, angegangen wurde es nie.", en: "We have been managing the problem for years; it has never actually been tackled.", use: "angegangen wurde es nie — passive of angehen with the participle fronted; managing versus tackling is the point." },

      { de: "Je länger man sich nicht damit befasst, desto größer wird es.", en: "The longer you avoid dealing with it, the bigger it gets.", use: "sich befassen mit = to engage with; the je/desto frame around a negation — avoidance measured in growth." },

      { de: "Der Streik gefährdet die Lieferkette der gesamten Branche.", en: "The strike is jeopardising the supply chain of the entire industry.", use: "gefährden = to endanger — transitive, no preposition; die Lieferkette, chain of deliveries, one compound." },

      { de: "Der Umbau verwandelte das Lagerhaus in ein Museum.", en: "The conversion transformed the warehouse into a museum.", use: "verwandeln in + Akkusativ — transformation names its target with in; der Umbau nominalises umbauen." },

      { de: "Die alten Daten ließen sich vollständig wiederherstellen.", en: "The old data could be fully restored.", use: "ließen sich wiederherstellen — the lassen-passive in the past; wiederherstellen stacks two prefixes and still splits." },

      { de: "Bewahren kann man nur, was man auch pflegt.", en: "You can only preserve what you also take care of.", use: "The infinitive fronts (Bewahren kann man ...) and the was-clause supplies the object — proverb word order." },

      { de: "Der erste Entwurf wurde verworfen, der zweite kaum verändert übernommen.", en: "The first draft was discarded; the second was adopted almost unchanged.", use: "verwerfen versus übernehmen; kaum verändert — a participle phrase wedged before the second participle." },

      { de: "Die Sparmaßnahme ging nach hinten los und kostete am Ende das Doppelte.", en: "The cost-cutting measure backfired and ended up costing twice as much.", use: "nach hinten losgehen = to backfire — the gun image; das Doppelte = twice the amount, nominalised." },

      { de: "Anfangs kam er mit der neuen Software gut zurecht, dann kamen die Updates.", en: "At first he coped fine with the new software — then came the updates.", use: "zurechtkommen mit = to cope with; the flat second clause (dann kamen die Updates) lands the joke by understatement." },

      { de: "Kaum ließ der Druck nach, blühte das Team auf.", en: "No sooner did the pressure ease than the team blossomed.", use: "Kaum + verb-first clause = no sooner ... than; nachlassen and aufblühen both split around the frame." },

      { de: "Die Nachfrage geht zurück, der Markt schrumpft, nur die Miete stagniert nicht.", en: "Demand is declining, the market is shrinking — only the rent isn't stagnating.", use: "Three verbs of decline in a row; the punchline hangs on nicht — the one curve refusing to flatten." },

      { de: "Die Übergangsregel soll die Härten abfedern und den Konflikt entschärfen.", en: "The transitional rule is meant to cushion the hardships and defuse the conflict.", use: "abfedern (springs) and entschärfen (bombs) — two defusing metaphors German policy language uses daily." },

    ],
  },
  part416: {
    label: "Part 416",
    level: "C1",
    theme: "Reasoning and evidence",
    description: "Core concepts for understanding nuanced explanations, evidence, analysis and disagreement.",
    focus,
    seeds: [
      { de: "das Fachwissen", lookup: "Fachwissen", fallbackEn: "expertise", tip: "noun", article: "das" },
      { de: "die Voreingenommenheit", lookup: "Voreingenommenheit", fallbackEn: "bias", tip: "noun", article: "die" },
      { de: "der Blickwinkel", lookup: "Blickwinkel", fallbackEn: "perspective", tip: "noun", article: "der" },
      { de: "der Ausblick", lookup: "Ausblick", fallbackEn: "outlook", tip: "noun", article: "der" },
      { de: "der Rahmen", lookup: "Rahmen", fallbackEn: "framework", tip: "noun", article: "der" },
      { de: "das Muster", lookup: "Muster", fallbackEn: "pattern", tip: "noun", article: "das" },
      { de: "die Einordnung", lookup: "Einordnung", fallbackEn: "contextual classification", tip: "noun", article: "die" },
      { de: "das Merkmal", lookup: "Merkmal", fallbackEn: "characteristic", tip: "noun", article: "das" },
      { de: "der Faktor", lookup: "Faktor", fallbackEn: "factor", tip: "noun", article: "der" },
      { de: "das Kriterium", lookup: "Kriterium", fallbackEn: "criterion", tip: "noun", article: "das" },
      { de: "die Schätzung", lookup: "Schätzung", fallbackEn: "estimate", tip: "noun", article: "die" },
      { de: "die Prognose", lookup: "Prognose", fallbackEn: "forecast", tip: "noun", article: "die" },
      { de: "die Gewissheit", lookup: "Gewissheit", fallbackEn: "certainty", tip: "noun", article: "die" },
      { de: "das Gegenargument", lookup: "Gegenargument", fallbackEn: "counterargument", tip: "noun", article: "das" },
      { de: "die Folgerung", lookup: "Folgerung", fallbackEn: "inference", tip: "noun", article: "die" },
      { de: "die Auslegung", lookup: "Auslegung", fallbackEn: "interpretation of a rule or text", tip: "noun", article: "die" },
      { de: "der Irrglaube", lookup: "Irrglaube", fallbackEn: "misconception", tip: "noun", article: "der" },
      { de: "die Abgrenzung", lookup: "Abgrenzung", fallbackEn: "distinction", tip: "noun", article: "die" },
      { de: "die Verallgemeinerung", lookup: "Verallgemeinerung", fallbackEn: "generalisation", tip: "noun", article: "die" },
      { de: "die Mehrdeutigkeit", lookup: "Mehrdeutigkeit", fallbackEn: "ambiguity", tip: "noun", article: "die" },
      { de: "der Konsens", lookup: "Konsens", fallbackEn: "consensus", tip: "noun", article: "der" },
      { de: "die Kontroverse", lookup: "Kontroverse", fallbackEn: "controversy", tip: "noun", article: "die" },
      { de: "der Anhaltspunkt", lookup: "Anhaltspunkt", fallbackEn: "clue", tip: "noun", article: "der" },
      { de: "der Überblick", lookup: "Überblick", fallbackEn: "overview", tip: "noun", article: "der" },
      { de: "der Schwerpunkt", lookup: "Schwerpunkt", fallbackEn: "focus", tip: "noun", article: "der" },
      { de: "die Grundlage", lookup: "Grundlage", fallbackEn: "basis", tip: "noun", article: "die" },
      { de: "die Widerlegung", lookup: "Widerlegung", fallbackEn: "refutation", tip: "noun", article: "die" },
      { de: "die Einschätzung", lookup: "Einschätzung", fallbackEn: "assessment", tip: "noun", article: "die" },
      { de: "die Vermutung", lookup: "Vermutung", fallbackEn: "supposition", tip: "noun", article: "die" },
      { de: "die Denkweise", lookup: "Denkweise", fallbackEn: "mindset", tip: "noun", article: "die" },
      { de: "der Sachverhalt", lookup: "Sachverhalt", fallbackEn: "set of facts", tip: "noun", article: "der" },
      { de: "die Glaubwürdigkeit", lookup: "Glaubwürdigkeit", fallbackEn: "credibility", tip: "noun", article: "die" },
      { de: "die Stichhaltigkeit", lookup: "Stichhaltigkeit", fallbackEn: "soundness", tip: "noun", article: "die" },
      { de: "die Unsicherheit", lookup: "Unsicherheit", fallbackEn: "uncertainty", tip: "noun", article: "die" },
      { de: "der Denkfehler", lookup: "Denkfehler", fallbackEn: "reasoning error", tip: "noun", article: "der" },
      { de: "das Gegenbeispiel", lookup: "Gegenbeispiel", fallbackEn: "counterexample", tip: "noun", article: "das" },
      { de: "der Grundsatz", lookup: "Grundsatz", fallbackEn: "principle", tip: "noun", article: "der" },
      { de: "die Schlüssigkeit", lookup: "Schlüssigkeit", fallbackEn: "coherence", tip: "noun", article: "die" },
      { de: "der Gedankengang", lookup: "Gedankengang", fallbackEn: "train of thought", tip: "noun", article: "der" },
      { de: "die Beweisführung", lookup: "Beweisführung", fallbackEn: "line of argument", tip: "noun", article: "die" },
    ],
    dialogues: [],
    phrases: [

      { de: "Aus welchem Blickwinkel man den Fall betrachtet, ändert die Einschätzung erheblich.", en: "Which angle you look at the case from changes the assessment considerably.", use: "The indirect question (Aus welchem Blickwinkel ...) serves as subject; the main verb follows it immediately: ..., ändert ..." },

      { de: "Für diese Vermutung gibt es bisher keinen einzigen Anhaltspunkt.", en: "So far there is not a single clue to support this supposition.", use: "kein einziger sharpens kein to 'not one single'; bisher = so far, sitting comfortably mid-sentence." },

      { de: "Ihre Prognose beruht auf einer groben Schätzung, nicht auf Daten.", en: "Her forecast rests on a rough estimate, not on data.", use: "beruhen auf + Dativ; repeating the preposition (nicht auf Daten) keeps the contrast grammatical." },

      { de: "Der Konsens täuscht: Hinter den Kulissen schwelt die Kontroverse weiter.", en: "The consensus is deceptive: behind the scenes, the controversy is still smouldering.", use: "täuschen used intransitively = to be deceptive; weiterschwelen splits, and hinter den Kulissen is the fixed stage image." },

      { de: "Ein einziges Gegenbeispiel genügt, um die Verallgemeinerung zu widerlegen.", en: "A single counterexample is enough to refute the generalisation.", use: "genügen, um ... zu = to be enough to; widerlegen is inseparable — no ge- in sight and the zu stands before it whole." },

      { de: "Wo genau liegt der Denkfehler in dieser Beweisführung?", en: "Where exactly is the flaw in this line of argument?", use: "liegen, not sein, for where an abstract fault sits: der Fehler liegt in ... — the standard collocation." },

      { de: "Ihre Glaubwürdigkeit steht und fällt mit der Stichhaltigkeit ihrer Belege.", en: "Her credibility stands or falls with the soundness of her evidence.", use: "steht und fällt mit + Dativ — fixed pair, always this order, with und where English says or." },

      { de: "Verschaffen Sie sich zuerst einen Überblick, ehe Sie sich ein Urteil bilden.", en: "Get an overview first, before you form a judgement.", use: "sich (Dativ) einen Überblick verschaffen and sich ein Urteil bilden — both keep their sich; ehe is the formal bevor." },

      { de: "Der Schwerpunkt der Arbeit liegt auf der Auslegung des neuen Gesetzes.", en: "The paper focuses on the interpretation of the new law.", use: "der Schwerpunkt liegt auf + Dativ is the nominal way to say 'focuses on' — common in abstracts and introductions." },

      { de: "Dass Kälte Erkältungen verursacht, ist ein weitverbreiteter Irrglaube.", en: "That cold weather causes colds is a widespread misconception.", use: "A dass-clause as fronted subject; the main clause then starts with its verb: ..., ist ..." },

      { de: "Ohne klare Kriterien bleibt jede Bewertung willkürlich.", en: "Without clear criteria, any evaluation remains arbitrary.", use: "ohne + noun replaces a whole conditional clause; bleiben marks the state as persisting, not appearing." },

      { de: "Die Mehrdeutigkeit der Formulierung ist kein Zufall, sondern Absicht.", en: "The ambiguity of the wording is no accident — it is deliberate.", use: "kein Zufall, sondern Absicht — the sondern-correction with two bare nouns, no verb repeated." },

      { de: "Gegen diese These gibt es ein naheliegendes Gegenargument.", en: "There is an obvious counterargument to this thesis.", use: "das Argument GEGEN etwas — German keeps the preposition gegen where English says 'to'; fronting Gegen diese These stresses the target." },

      { de: "Seine Denkweise ist von zwanzig Jahren Behördenarbeit geprägt.", en: "His mindset has been shaped by twenty years of working in government offices.", use: "geprägt von + Dativ — the stative passive: shaped and still bearing the stamp. Behördenarbeit compresses 'work in public agencies' into one noun." },

      { de: "Zuerst müssen wir den Sachverhalt klären, dann können wir ihn bewerten.", en: "First we need to establish the facts; only then can we judge them.", use: "zuerst ... dann orders the steps; der Sachverhalt is the legal-administrative word for the facts of the matter, singular." },

      { de: "Im Rahmen dieser Untersuchung lässt sich das nur andeuten.", en: "Within the scope of this study, that can only be hinted at.", use: "im Rahmen + Genitiv = within the scope of — the standard academic hedge before admitting limits." },

      { de: "Das Muster wiederholt sich: Auf jede Krise folgt ein kurzer Aufschwung.", en: "The pattern repeats itself: every crisis is followed by a brief upturn.", use: "auf X folgt Y inverts the order English expects — the thing that comes AFTER stands as subject after folgt." },

      { de: "Nach welchem Kriterium wurden die Bewerber ausgewählt?", en: "By what criterion were the applicants selected?", use: "nach + Kriterium = by/according to; the preposition travels to the front of the question with its noun." },

      { de: "Mit mehr Fachwissen hätte er den Fehler sofort erkannt.", en: "With more expertise, he would have spotted the mistake immediately.", use: "hätte + participle is the past unreal (Konjunktiv II der Vergangenheit); mit + noun smuggles in the unreal condition." },

      { de: "Ihre Einordnung des Falls überzeugt mich mehr als jede Statistik.", en: "The way she puts the case in context convinces me more than any statistic.", use: "Einordnung nominalises einordnen — classification into context; mehr als jede X = more than any X." },

      { de: "Der Grundsatz gilt, bis jemand ihn überzeugend widerlegt.", en: "The principle holds until someone convincingly refutes it.", use: "gelten = to hold/be valid; bis opens a subordinate clause, so the verb widerlegt moves to the end." },

      { de: "Bei aller Unsicherheit: An der Grundlage der Theorie zweifelt kaum jemand.", en: "For all the uncertainty, hardly anyone doubts the theory's foundations.", use: "bei aller X = for all the X, conceding before asserting; zweifeln an + Dativ, and kaum jemand = hardly anyone." },

    ],
  },
  part417: {
    label: "Part 417",
    level: "C1",
    theme: "Money and public life",
    description: "Vocabulary used in news, employment, personal finance and discussions about society.",
    focus,
    seeds: [
      { de: "die Einnahme", lookup: "Einnahme", fallbackEn: "revenue", tip: "noun", article: "die" },
      { de: "die Ausgabe", lookup: "Ausgabe", fallbackEn: "expenditure", tip: "noun", article: "die" },
      { de: "die Verschuldung", lookup: "Verschuldung", fallbackEn: "indebtedness", tip: "noun", article: "die" },
      { de: "das Darlehen", lookup: "Darlehen", fallbackEn: "formal loan", tip: "noun", article: "das" },
      { de: "das Wirtschaftswachstum", lookup: "Wirtschaftswachstum", fallbackEn: "economic growth", tip: "noun", article: "das" },
      { de: "die Rezession", lookup: "Rezession", fallbackEn: "recession", tip: "noun", article: "die" },
      { de: "der Überschuss", lookup: "Überschuss", fallbackEn: "surplus", tip: "noun", article: "der" },
      { de: "die Nachfrage", lookup: "Nachfrage", fallbackEn: "demand", tip: "noun", article: "die" },
      { de: "der Lohn", lookup: "Lohn", fallbackEn: "wage", tip: "noun", article: "der" },
      { de: "das Gehalt", lookup: "Gehalt", fallbackEn: "salary", tip: "noun", article: "das" },
      { de: "der Zuschuss", lookup: "Zuschuss", fallbackEn: "grant", tip: "noun", article: "der" },
      { de: "die Sozialleistung", lookup: "Sozialleistung", fallbackEn: "welfare benefit", tip: "noun", article: "die" },
      { de: "die Versicherung", lookup: "Versicherung", fallbackEn: "insurance", tip: "noun", article: "die" },
      { de: "die Hypothek", lookup: "Hypothek", fallbackEn: "mortgage", tip: "noun", article: "die" },
      { de: "die Rückerstattung", lookup: "Rückerstattung", fallbackEn: "reimbursement, refund", tip: "noun", article: "die" },
      { de: "das Abonnement", lookup: "Abonnement", fallbackEn: "formal subscription", tip: "noun", article: "das" },
      { de: "die Vertragsklausel", lookup: "Vertragsklausel", fallbackEn: "contract clause", tip: "noun", article: "die" },
      { de: "die Richtlinie", lookup: "Richtlinie", fallbackEn: "guideline, policy", tip: "noun", article: "die" },
      { de: "die Behörde", lookup: "Behörde", fallbackEn: "government agency", tip: "noun", article: "die" },
      { de: "der Stadtrat", lookup: "Stadtrat", fallbackEn: "city council", tip: "noun", article: "der" },
      { de: "die Bürgerinitiative", lookup: "Bürgerinitiative", fallbackEn: "citizens' initiative", tip: "noun", article: "die" },
      { de: "die Wohltätigkeitsorganisation", lookup: "Wohltätigkeitsorganisation", fallbackEn: "charity", tip: "noun", article: "die" },
      { de: "die Arbeitslosigkeit", lookup: "Arbeitslosigkeit", fallbackEn: "unemployment", tip: "noun", article: "die" },
      { de: "die Lebenshaltungskosten", lookup: "Lebenshaltungskosten", fallbackEn: "cost of living", tip: "plural noun", article: "die" },
      { de: "die Kaufkraft", lookup: "Kaufkraft", fallbackEn: "purchasing power", tip: "noun", article: "die" },
      { de: "das Vermögen", lookup: "Vermögen", fallbackEn: "wealth, assets", tip: "noun", article: "das" },
      { de: "der Haushalt", lookup: "Haushalt", fallbackEn: "household budget", tip: "noun", article: "der" },
      { de: "die Förderung", lookup: "Förderung", fallbackEn: "funding, support", tip: "noun", article: "die" },
      { de: "das Haushaltsdefizit", lookup: "Haushaltsdefizit", fallbackEn: "budget deficit", tip: "noun", article: "das" },
      { de: "der Mindestlohn", lookup: "Mindestlohn", fallbackEn: "minimum wage", tip: "noun", article: "der" },
      { de: "der Tarifvertrag", lookup: "Tarifvertrag", fallbackEn: "collective agreement", tip: "noun", article: "der" },
      { de: "die Gewerkschaft", lookup: "Gewerkschaft", fallbackEn: "trade union", tip: "noun", article: "die" },
      { de: "der Wettbewerb", lookup: "Wettbewerb", fallbackEn: "competition", tip: "noun", article: "der" },
      { de: "das Monopol", lookup: "Monopol", fallbackEn: "monopoly", tip: "noun", article: "das" },
      { de: "die Konjunktur", lookup: "Konjunktur", fallbackEn: "economic cycle", tip: "noun", article: "die" },
      { de: "der Wohlstand", lookup: "Wohlstand", fallbackEn: "prosperity", tip: "noun", article: "der" },
      { de: "die Subvention", lookup: "Subvention", fallbackEn: "subsidy", tip: "noun", article: "die" },
      { de: "der Verbraucher", lookup: "Verbraucher", fallbackEn: "consumer", tip: "noun", article: "der" },
      { de: "das Eigentum", lookup: "Eigentum", fallbackEn: "property, ownership", tip: "noun", article: "das" },
      { de: "der Steuerzahler", lookup: "Steuerzahler", fallbackEn: "taxpayer", tip: "noun", article: "der" },
    ],
    dialogues: [],
    phrases: [

      { de: "Die Ausgaben übersteigen die Einnahmen seit Jahren.", en: "Spending has exceeded revenue for years.", use: "seit + time span takes the PRESENT tense in German where English needs the perfect: übersteigen ... seit Jahren." },

      { de: "Ohne das Darlehen der Bank hätte die Firma die Krise nicht überstanden.", en: "Without the bank loan, the company would not have survived the crisis.", use: "ohne + noun carries the unreal condition; hätte ... überstanden is Konjunktiv II of the past." },

      { de: "Trotz des Wirtschaftswachstums sinkt die Kaufkraft vieler Haushalte.", en: "Despite economic growth, the purchasing power of many households is falling.", use: "trotz governs the genitive in written German: trotz des Wachstums. vieler Haushalte is a bare genitive plural — no article." },

      { de: "Die Rezession traf zuerst die, die ohnehin wenig hatten.", en: "The recession first hit those who had little to begin with.", use: "die, die = those who; the first die is a demonstrative standing alone. ohnehin = anyway/to begin with." },

      { de: "Der Überschuss des Vorjahres ist längst aufgebraucht.", en: "Last year's surplus has long since been used up.", use: "längst = long since, stronger than schon lange; aufgebraucht is the stative passive — the state, not the act." },

      { de: "Lohn und Gehalt sind nicht dasselbe: Das eine wird nach Stunden gezahlt, das andere monatlich.", en: "A wage and a salary are not the same thing: one is paid by the hour, the other monthly.", use: "das eine ... das andere pairs two neuter stand-ins; nach Stunden = by the hour. Lohn is blue-collar, Gehalt salaried." },

      { de: "Den Zuschuss muss man nicht zurückzahlen, das Darlehen schon.", en: "You do not have to pay back the grant — the loan you do.", use: "A bare schon answers the negation for the second item: das Darlehen schon = but the loan, yes. Very German, very compact." },

      { de: "Wer Sozialleistungen beantragt, muss sein Vermögen offenlegen.", en: "Anyone applying for welfare benefits has to disclose their assets.", use: "Wer ..., muss ... — the free relative again; offenlegen (separable) is the official verb for mandatory disclosure." },

      { de: "Prüfen Sie die Vertragsklausel, bevor Sie das Abonnement verlängern.", en: "Check the contract clause before you renew the subscription.", use: "bevor needs a full clause with the verb at the end; the Sie-imperative fronts the bare verb: Prüfen Sie ..." },

      { de: "Die Behörde beruft sich auf eine interne Richtlinie.", en: "The agency is invoking an internal policy.", use: "sich berufen auf + Akkusativ = to invoke/cite as authority — not to be confused with berufen = to appoint." },

      { de: "Der Stadtrat hat die Förderung gegen den Widerstand der Bürgerinitiative beschlossen.", en: "The city council approved the funding against the resistance of the citizens' initiative.", use: "gegen den Widerstand + Genitiv slots the opposition inside the sentence; beschließen = to resolve/approve formally." },

      { de: "Die Wohltätigkeitsorganisation finanziert sich fast ausschließlich aus Spenden.", en: "The charity is funded almost entirely by donations.", use: "sich finanzieren aus + Dativ — the sich says it funds ITSELF from a source; no passive needed." },

      { de: "Steigende Lebenshaltungskosten treffen Geringverdiener am härtesten.", en: "Rising living costs hit low earners hardest.", use: "The participle steigend works as an adjective; am härtesten is the superlative adverb — am + -sten." },

      { de: "Die Arbeitslosigkeit ist auf den niedrigsten Stand seit zehn Jahren gefallen.", en: "Unemployment has fallen to its lowest level in ten years.", use: "auf einen Stand fallen/steigen = to fall/rise TO a level; seit zehn Jahren pins the comparison window." },

      { de: "Ohne den Tarifvertrag läge der Lohn vermutlich unter dem Mindestlohn.", en: "Without the collective agreement, pay would probably be below the minimum wage.", use: "läge is the one-word Konjunktiv II of liegen — written German prefers it to würde liegen for common verbs." },

      { de: "Die Gewerkschaft droht mit Streik, falls die Verhandlungen scheitern.", en: "The union is threatening to strike if the talks fail.", use: "drohen mit + Dativ noun (mit Streik), not an infinitive; falls = in case/if, slightly more formal than wenn." },

      { de: "Wo der Wettbewerb fehlt, entsteht früher oder später ein Monopol.", en: "Where competition is absent, a monopoly emerges sooner or later.", use: "wo opens a generalising clause of place; früher oder später — German keeps the same order as English, comma-free." },

      { de: "Die Konjunktur zieht an, doch beim Verbraucher kommt davon wenig an.", en: "The economy is picking up, but little of it is reaching the consumer.", use: "anziehen (intransitive) = to pick up; ankommen bei = to reach someone. davon = of it — the partitive glue." },

      { de: "Wohlstand, der auf Verschuldung beruht, ist keiner.", en: "Prosperity built on debt is no prosperity at all.", use: "The bare keiner at the end stands for kein Wohlstand — German can end on the pronoun where English must repeat the noun." },

      { de: "Für die einen verzerren Subventionen den Wettbewerb, für die anderen sichern sie Arbeitsplätze.", en: "For some, subsidies distort competition; for others, they protect jobs.", use: "für die einen ..., für die anderen ... frames a two-camp dispute; sie picks up Subventionen across the comma." },

      { de: "Als Steuerzahler frage ich mich, wofür dieses Haushaltsdefizit eigentlich gut sein soll.", en: "As a taxpayer, I wonder what this budget deficit is actually supposed to achieve.", use: "wofür ... gut sein soll = what it is supposed to be good for; eigentlich adds the sceptical edge of 'actually'." },

      { de: "Sobald die Hypothek abbezahlt ist, gehört das Haus endlich uns.", en: "Once the mortgage is paid off, the house will finally be ours.", use: "sobald = as soon as, verb to the end; gehören + Dativ — das Haus gehört UNS, no possessive needed." },

    ],
  },
  part418: {
    label: "Part 418",
    level: "C1",
    theme: "Technology and information",
    description: "Modern digital vocabulary for understanding devices, software, online services and information quality.",
    focus,
    seeds: [
      { de: "der Datenschutz", lookup: "Datenschutz", fallbackEn: "data protection, privacy", tip: "noun", article: "der" },
      { de: "die Einwilligung", lookup: "Einwilligung", fallbackEn: "informed consent, permission", tip: "noun", article: "die" },
      { de: "die Verschlüsselung", lookup: "Verschlüsselung", fallbackEn: "encryption", tip: "noun", article: "die" },
      { de: "die Benutzeroberfläche", lookup: "Benutzeroberfläche", fallbackEn: "user interface", tip: "noun", article: "die" },
      { de: "die Aktualisierung", lookup: "Aktualisierung", fallbackEn: "update", tip: "noun", article: "die" },
      { de: "der Speicherplatz", lookup: "Speicherplatz", fallbackEn: "storage space", tip: "noun", article: "der" },
      { de: "die Bandbreite", lookup: "Bandbreite", fallbackEn: "bandwidth", tip: "noun", article: "die" },
      { de: "die Verzögerung", lookup: "Verzögerung", fallbackEn: "latency, delay", tip: "noun", article: "die" },
      { de: "der Serverausfall", lookup: "Serverausfall", fallbackEn: "server outage", tip: "noun", article: "der" },
      { de: "die Schadsoftware", lookup: "Schadsoftware", fallbackEn: "malware", tip: "noun", article: "die" },
      { de: "die Zugangsdaten", lookup: "Zugangsdaten", fallbackEn: "login credentials", tip: "plural noun", article: "die" },
      { de: "die Berechtigung", lookup: "Berechtigung", fallbackEn: "permission", tip: "noun", article: "die" },
      { de: "die Benachrichtigung", lookup: "Benachrichtigung", fallbackEn: "notification", tip: "noun", article: "die" },
      { de: "der Anhang", lookup: "Anhang", fallbackEn: "email attachment, appendix", tip: "noun", article: "der" },
      { de: "der Suchverlauf", lookup: "Suchverlauf", fallbackEn: "search history", tip: "noun", article: "der" },
      { de: "der Browserverlauf", lookup: "Browserverlauf", fallbackEn: "browsing history", tip: "noun", article: "der" },
      { de: "der Zwischenspeicher", lookup: "Zwischenspeicher", fallbackEn: "cache", tip: "noun", article: "der" },
      { de: "die Datenbank", lookup: "Datenbank", fallbackEn: "database", tip: "noun", article: "die" },
      { de: "der Quellcode", lookup: "Quellcode", fallbackEn: "source code", tip: "noun", article: "der" },
      { de: "die Schnittstelle", lookup: "Schnittstelle", fallbackEn: "interface", tip: "noun", article: "die" },
      { de: "das Netzwerk", lookup: "Netzwerk", fallbackEn: "computer network", tip: "noun", article: "das" },
      { de: "die Verbindung", lookup: "Verbindung", fallbackEn: "connection", tip: "noun", article: "die" },
      { de: "die Auflösung", lookup: "Auflösung", fallbackEn: "resolution", tip: "noun", article: "die" },
      { de: "die Bildfrequenz", lookup: "Bildfrequenz", fallbackEn: "frame rate", tip: "noun", article: "die" },
      { de: "die Ladezeit", lookup: "Ladezeit", fallbackEn: "loading time", tip: "noun", article: "die" },
      { de: "das Dateiformat", lookup: "Dateiformat", fallbackEn: "file format", tip: "noun", article: "das" },
      { de: "die Kompatibilität", lookup: "Kompatibilität", fallbackEn: "compatibility", tip: "noun", article: "die" },
      { de: "die Barrierefreiheit", lookup: "Barrierefreiheit", fallbackEn: "accessibility", tip: "noun", article: "die" },
      { de: "die Nutzungsbedingungen", lookup: "Nutzungsbedingungen", fallbackEn: "terms of service", tip: "plural noun", article: "die" },
      { de: "das Urheberrecht", lookup: "Urheberrecht", fallbackEn: "copyright", tip: "noun", article: "das" },
      { de: "die Fehlinformation", lookup: "Fehlinformation", fallbackEn: "misinformation", tip: "noun", article: "die" },
      { de: "die Suchmaschine", lookup: "Suchmaschine", fallbackEn: "search engine", tip: "noun", article: "die" },
      { de: "das Endgerät", lookup: "Endgerät", fallbackEn: "end-user device", tip: "noun", article: "das" },
      { de: "das Eingabefeld", lookup: "Eingabefeld", fallbackEn: "input field", tip: "noun", article: "das" },
      { de: "die Sicherheitslücke", lookup: "Sicherheitslücke", fallbackEn: "security vulnerability", tip: "noun", article: "die" },
      { de: "der Datenverkehr", lookup: "Datenverkehr", fallbackEn: "data traffic", tip: "noun", article: "der" },
      { de: "die Voreinstellung", lookup: "Voreinstellung", fallbackEn: "default setting", tip: "noun", article: "die" },
      { de: "die Bildschirmfreigabe", lookup: "Bildschirmfreigabe", fallbackEn: "screen sharing", tip: "noun", article: "die" },
      { de: "die Spracherkennung", lookup: "Spracherkennung", fallbackEn: "speech recognition", tip: "noun", article: "die" },
      { de: "die Datenverarbeitung", lookup: "Datenverarbeitung", fallbackEn: "data processing", tip: "noun", article: "die" },
    ],
    dialogues: [],
    phrases: [

      { de: "Ohne Ihre ausdrückliche Einwilligung werden keine Daten weitergegeben.", en: "No data is passed on without your explicit consent.", use: "The German fronts the condition and negates the object (keine Daten) — the standard privacy-notice sentence shape." },

      { de: "Die Verschlüsselung schützt die Daten nur auf dem Weg, nicht auf dem Server.", en: "Encryption protects the data only in transit, not on the server.", use: "auf dem Weg = in transit, literally 'on the way'; the repeated preposition keeps the contrast parallel." },

      { de: "Nach der Aktualisierung war die Benutzeroberfläche kaum wiederzuerkennen.", en: "After the update, the interface was barely recognisable.", use: "sein + zu + infinitive = can/must be done: war kaum wiederzuerkennen = could barely be recognised. zu sits inside the separable verb." },

      { de: "Wenn der Speicherplatz knapp wird, leeren Sie zuerst den Zwischenspeicher.", en: "When storage runs low, clear the cache first.", use: "knapp werden = to run low; the wenn-clause fronts, so the imperative follows comma-first: ..., leeren Sie ..." },

      { de: "Je geringer die Bandbreite, desto länger die Ladezeit.", en: "The lower the bandwidth, the longer the loading time.", use: "je ... desto in its verbless form again — the natural shape for technical rules of thumb." },

      { de: "Der Serverausfall ließ sich auf eine einzige Sicherheitslücke zurückführen.", en: "The server outage could be traced back to a single security vulnerability.", use: "sich zurückführen lassen auf + Akkusativ = can be traced back to; ließ sich is its past." },

      { de: "Öffnen Sie keinen Anhang, dessen Absender Sie nicht kennen.", en: "Do not open an attachment whose sender you do not know.", use: "dessen is the genitive relative pronoun — whose — for masculine and neuter heads like der Anhang." },

      { de: "Die Schadsoftware kam über ein harmlos wirkendes Eingabefeld ins Netzwerk.", en: "The malware got into the network through an innocent-looking input field.", use: "harmlos wirkend = seeming harmless — a participle phrase compressed into an attribute before the noun; über = via." },

      { de: "Geben Sie Ihre Zugangsdaten niemals telefonisch weiter.", en: "Never give out your login credentials over the phone.", use: "telefonisch does adverbial work — by phone, one word; weitergeben splits around it in the imperative." },

      { de: "Ihnen fehlt die Berechtigung, diese Datei zu ändern.", en: "You do not have permission to modify this file.", use: "jemandem fehlt X — the thing lacking is the subject and the person goes into the dative: Ihnen fehlt ..." },

      { de: "Ich habe die Benachrichtigungen abgestellt, um mich besser konzentrieren zu können.", en: "I turned off notifications so I could concentrate better.", use: "um ... zu können adds ability into the purpose clause — so as to BE ABLE to; abstellen = to switch off, everyday register." },

      { de: "Der Browserverlauf verrät mehr über einen Menschen, als ihm lieb ist.", en: "A browsing history reveals more about a person than they would like.", use: "mehr, als jemandem lieb ist — the fixed comparative: more than one is comfortable with. ihm points back to Menschen." },

      { de: "Die Schnittstelle ist gut dokumentiert, der Quellcode leider nicht.", en: "The interface is well documented; the source code, unfortunately, is not.", use: "The second clause keeps only its topic and nicht — ellipsis German loves in verdicts. leider slots before the negation." },

      { de: "Bei schwacher Verbindung sinkt zuerst die Auflösung, dann die Bildfrequenz.", en: "On a weak connection, the resolution drops first, then the frame rate.", use: "bei + adjective + noun sets a standing condition (whenever the connection is weak); zuerst ... dann orders the failure." },

      { de: "Prüfen Sie vor dem Kauf die Kompatibilität mit Ihrem Endgerät.", en: "Check compatibility with your device before buying.", use: "vor dem Kauf nominalises 'before you buy' into two words — the shape German product pages actually use." },

      { de: "Barrierefreiheit ist kein Extra, sondern eine Voraussetzung.", en: "Accessibility is not an optional extra — it is a requirement.", use: "kein ..., sondern ... again, here with two predicate nouns; Voraussetzung = precondition, stronger than Anforderung." },

      { de: "Die Nutzungsbedingungen akzeptiert man meist, ohne sie gelesen zu haben.", en: "People usually accept the terms of service without having read them.", use: "ohne ... zu + PERFECT infinitive (gelesen zu haben) = without having done — the past inside the ohne-clause." },

      { de: "Auch im Internet gilt das Urheberrecht.", en: "Copyright applies on the internet too.", use: "auch fronts with the phrase it scopes over: Auch im Internet = on the internet TOO. gelten = to apply/be in force." },

      { de: "Fehlinformationen verbreiten sich schneller, als sie sich richtigstellen lassen.", en: "Misinformation spreads faster than it can be corrected.", use: "als opens the comparison clause; sich richtigstellen lassen = can be corrected — the lassen-passive inside a comparative." },

      { de: "Die Suchmaschine bewertet nicht, was wahr ist, sondern was angeklickt wird.", en: "The search engine does not rank what is true — it ranks what gets clicked.", use: "Two was-clauses as objects, corrected by sondern; angeklickt wird is the processual passive: what GETS clicked." },

      { de: "Die Voreinstellung ist bequem, aber selten die sicherste Wahl.", en: "The default setting is convenient, but rarely the safest choice.", use: "selten does the negating here — 'rarely the safest' — softer and more idiomatic than fast nie." },

      { de: "Ohne Bildschirmfreigabe kann der Support nur raten.", en: "Without screen sharing, support can only guess.", use: "raten = to guess (and also to advise — context decides); ohne + bare noun states the missing tool." },

    ],
  },
  part419: {
    label: "Part 419",
    level: "B2-C1",
    theme: "Health and wellbeing",
    description: "Specific words for explaining symptoms, treatment, recovery and how the body feels.",
    focus,
    seeds: [
      { de: "die Behandlung", lookup: "Behandlung", fallbackEn: "medical treatment", tip: "noun", article: "die" },
      { de: "die Erkrankung", lookup: "Erkrankung", fallbackEn: "medical condition", tip: "noun", article: "die" },
      { de: "der Ausbruch", lookup: "Ausbruch", fallbackEn: "outbreak", tip: "noun", article: "der" },
      { de: "die Infektion", lookup: "Infektion", fallbackEn: "infection", tip: "noun", article: "die" },
      { de: "die Immunität", lookup: "Immunität", fallbackEn: "immunity", tip: "noun", article: "die" },
      { de: "die Mangelerscheinung", lookup: "Mangelerscheinung", fallbackEn: "deficiency symptom", tip: "noun", article: "die" },
      { de: "die Entzündung", lookup: "Entzündung", fallbackEn: "inflammation", tip: "noun", article: "die" },
      { de: "die Verletzung", lookup: "Verletzung", fallbackEn: "injury", tip: "noun", article: "die" },
      { de: "die Schwellung", lookup: "Schwellung", fallbackEn: "swelling", tip: "noun", article: "die" },
      { de: "die Prellung", lookup: "Prellung", fallbackEn: "contusion", tip: "noun", article: "die" },
      { de: "die Verstauchung", lookup: "Verstauchung", fallbackEn: "sprain", tip: "noun", article: "die" },
      { de: "der Schwindel", lookup: "Schwindel", fallbackEn: "dizziness", tip: "noun", article: "der" },
      { de: "die Übelkeit", lookup: "Übelkeit", fallbackEn: "nausea", tip: "noun", article: "die" },
      { de: "die Erschöpfung", lookup: "Erschöpfung", fallbackEn: "exhaustion", tip: "noun", article: "die" },
      { de: "fiebrig", lookup: "fiebrig", fallbackEn: "feverish", tip: "adjective" },
      { de: "chronisch", lookup: "chronisch", fallbackEn: "chronic", tip: "adjective" },
      { de: "harmlos", lookup: "harmlos", fallbackEn: "harmless", tip: "adjective" },
      { de: "lebensbedrohlich", lookup: "lebensbedrohlich", fallbackEn: "life-threatening", tip: "adjective" },
      { de: "behandeln", lookup: "behandeln", fallbackEn: "to treat", tip: "verb" },
      { de: "therapieren", lookup: "therapieren", fallbackEn: "to treat with therapy", tip: "verb" },
      { de: "vorbeugen", lookup: "vorbeugen", fallbackEn: "to take preventive action", tip: "verb" },
      { de: "benommen", lookup: "benommen", fallbackEn: "dazed", tip: "adjective" },
      { de: "entzündet", lookup: "entzündet", fallbackEn: "inflamed", tip: "adjective" },
      { de: "geschwollen", lookup: "geschwollen", fallbackEn: "swollen", tip: "adjective" },
      { de: "steif", lookup: "steif", fallbackEn: "stiff", tip: "adjective" },
      { de: "pochen", lookup: "pochen", fallbackEn: "to throb", tip: "verb" },
      { de: "zerrissen", lookup: "zerrissen", fallbackEn: "torn", tip: "adjective" },
      { de: "heilbar", lookup: "heilbar", fallbackEn: "treatable, curable", tip: "adjective" },
      { de: "die Müdigkeit", lookup: "Müdigkeit", fallbackEn: "tiredness", tip: "noun", article: "die" },
      { de: "die Anspannung", lookup: "Anspannung", fallbackEn: "tension", tip: "noun", article: "die" },
      { de: "das Wohlbefinden", lookup: "Wohlbefinden", fallbackEn: "wellbeing", tip: "noun", article: "das" },
      { de: "die Migräne", lookup: "Migräne", fallbackEn: "migraine", tip: "noun", article: "die" },
      { de: "die Dehydrierung", lookup: "Dehydrierung", fallbackEn: "dehydration", tip: "noun", article: "die" },
      { de: "die Narbe", lookup: "Narbe", fallbackEn: "scar", tip: "noun", article: "die" },
      { de: "der Bluterguss", lookup: "Bluterguss", fallbackEn: "bruise", tip: "noun", article: "der" },
      { de: "der Krampf", lookup: "Krampf", fallbackEn: "cramp", tip: "noun", article: "der" },
      { de: "das Sodbrennen", lookup: "Sodbrennen", fallbackEn: "heartburn", tip: "noun", article: "das" },
      { de: "die Verdauung", lookup: "Verdauung", fallbackEn: "digestion", tip: "noun", article: "die" },
      { de: "die Atemnot", lookup: "Atemnot", fallbackEn: "shortness of breath", tip: "noun", article: "die" },
      { de: "die Heiserkeit", lookup: "Heiserkeit", fallbackEn: "hoarseness", tip: "noun", article: "die" },
    ],
    dialogues: [],
    phrases: [

      { de: "Die Behandlung schlägt an, die Werte verbessern sich.", en: "The treatment is taking effect; the readings are improving.", use: "anschlagen (intransitive) = to take effect, said of treatments; die Werte — your numbers, what German doctors call results." },

      { de: "Die Erkrankung verläuft in Schüben.", en: "The condition progresses in episodes.", use: "in Schüben verlaufen — der Schub is the flare-up; verlaufen describes the course an illness takes." },

      { de: "Beim ersten Ausbruch wusste niemand, wie ansteckend das Virus war.", en: "During the first outbreak, nobody knew how contagious the virus was.", use: "beim + noun for during; the indirect question wie ansteckend ... war hangs off wusste." },

      { de: "Nach der Impfung baut der Körper Immunität auf.", en: "After vaccination, the body builds up immunity.", use: "aufbauen splits; Immunität aufbauen is the collocation — immunity is BUILT in German, not gained." },

      { de: "Müdigkeit und blasse Haut können auf eine Mangelerscheinung hindeuten.", en: "Tiredness and pale skin can point to a deficiency.", use: "hindeuten auf + Akkusativ = to point to (as a sign); die Mangelerscheinung — the deficiency made visible." },

      { de: "Die Entzündung ist zurückgegangen, die Schwellung noch nicht.", en: "The inflammation has gone down; the swelling has not yet.", use: "zurückgehen for symptoms receding; noch nicht carries the whole elided second clause." },

      { de: "Der Arzt konnte einen Bruch ausschließen, es blieb bei einer Prellung.", en: "The doctor was able to rule out a fracture; it turned out to be just a bruise.", use: "es blieb bei + Dativ = it stayed at / amounted to no more than — the reassuring formula after an X-ray." },

      { de: "Beim Aufstehen überkam sie ein plötzlicher Schwindel.", en: "A sudden dizziness came over her as she stood up.", use: "jemanden überkommen — the feeling is the subject and the person the object; beim Aufstehen = on standing up." },

      { de: "Gegen die Übelkeit half nur frische Luft.", en: "Only fresh air helped against the nausea.", use: "helfen gegen + Akkusativ; fronting Gegen die Übelkeit leaves the remedy for the end." },

      { de: "Erschöpfung kündigt sich an, man muss nur hinhören.", en: "Exhaustion announces itself — you just have to listen.", use: "sich ankündigen = to announce itself in advance; hinhören = to listen TOWARDS something, attention again." },

      { de: "Die Infektion ist unangenehm, aber gut heilbar.", en: "The infection is unpleasant but very treatable.", use: "gut heilbar — gut grades the -bar adjective: well curable, i.e. very treatable. The doctor's calming sentence." },

      { de: "Aus der akuten Entzündung ist eine chronische geworden.", en: "The acute inflammation has become chronic.", use: "aus X ist Y geworden — the becoming frame in the perfect; eine chronische stands without its noun." },

      { de: "Die Zyste ist harmlos, sollte aber beobachtet werden.", en: "The cyst is harmless but should be kept an eye on.", use: "sollte + passive infinitive = should be done; beobachten here is medical watchful waiting." },

      { de: "Unbehandelt kann die Krankheit lebensbedrohlich werden.", en: "Left untreated, the illness can become life-threatening.", use: "A single fronted participle (Unbehandelt) replaces a whole wenn-clause — condition in one word." },

      { de: "Wer früh vorbeugt, muss später weniger behandeln.", en: "Prevent early and there is less to treat later.", use: "vorbeugen against behandeln — prevention versus cure in the pack's own verbs; früh/später mark the trade." },

      { de: "Nach der Narkose war er noch Stunden benommen.", en: "He was still dazed for hours after the anaesthetic.", use: "noch Stunden — a bare accusative of duration; benommen = dazed, the participle of benehmen gone its own way." },

      { de: "Der Knöchel ist geschwollen und heiß, vermutlich entzündet.", en: "The ankle is swollen and hot — probably inflamed.", use: "Three participles/adjectives stacked as findings; vermutlich hedges the diagnosis the way clinicians do." },

      { de: "Morgens ist das Gelenk steif, nach ein paar Schritten wird es besser.", en: "In the morning the joint is stiff; after a few steps it gets better.", use: "morgens — the -s adverb for habitual time; werden + comparative for improvement without naming a healer." },

      { de: "Die Wunde pocht, sobald er den Arm hängen lässt.", en: "The wound throbs as soon as he lets his arm hang down.", use: "pochen = to throb (also to knock); hängen lassen = to let hang — lassen + infinitive of permitted state." },

      { de: "Die Röntgenaufnahme zeigt: nichts gebrochen, nichts zerrissen.", en: "The X-ray shows nothing broken, nothing torn.", use: "The colon then two verbless findings — exactly how results are read out; zerrissen = torn through." },

      { de: "Trink genug, sonst droht bei dieser Hitze Dehydrierung.", en: "Drink enough — in this heat you risk dehydration.", use: "drohen with a thing as subject = to loom/threaten to occur: Dehydrierung droht. sonst carries the warning." },

    ],
  },
  part420: {
    label: "Part 420",
    level: "C1",
    theme: "Environment and science",
    description: "Useful vocabulary for climate, energy, research and explanations of the physical world.",
    focus,
    seeds: [
      { de: "die Verschmutzung", lookup: "Verschmutzung", fallbackEn: "pollution", tip: "noun", article: "die" },
      { de: "der Abfall", lookup: "Abfall", fallbackEn: "waste", tip: "noun", article: "der" },
      { de: "der Rohstoff", lookup: "Rohstoff", fallbackEn: "raw material", tip: "noun", article: "der" },
      { de: "der Lebensraum", lookup: "Lebensraum", fallbackEn: "habitat", tip: "noun", article: "der" },
      { de: "die Tierart", lookup: "Tierart", fallbackEn: "animal species", tip: "noun", article: "die" },
      { de: "die Dürre", lookup: "Dürre", fallbackEn: "drought", tip: "noun", article: "die" },
      { de: "die Überschwemmung", lookup: "Überschwemmung", fallbackEn: "flood", tip: "noun", article: "die" },
      { de: "der Waldbrand", lookup: "Waldbrand", fallbackEn: "wildfire", tip: "noun", article: "der" },
      { de: "erneuerbar", lookup: "erneuerbar", fallbackEn: "renewable", tip: "adjective" },
      { de: "die Artenvielfalt", lookup: "Artenvielfalt", fallbackEn: "biodiversity", tip: "noun", article: "die" },
      { de: "das Treibhausgas", lookup: "Treibhausgas", fallbackEn: "greenhouse gas", tip: "noun", article: "das" },
      { de: "der Meeresspiegel", lookup: "Meeresspiegel", fallbackEn: "sea level", tip: "noun", article: "der" },
      { de: "der Energieverbrauch", lookup: "Energieverbrauch", fallbackEn: "energy consumption", tip: "noun", article: "der" },
      { de: "das Stromnetz", lookup: "Stromnetz", fallbackEn: "power grid", tip: "noun", article: "das" },
      { de: "der Wassermangel", lookup: "Wassermangel", fallbackEn: "water scarcity", tip: "noun", article: "der" },
      { de: "die Bodenerosion", lookup: "Bodenerosion", fallbackEn: "soil erosion", tip: "noun", article: "die" },
      { de: "die Abholzung", lookup: "Abholzung", fallbackEn: "deforestation", tip: "noun", article: "die" },
      { de: "die Wiederaufforstung", lookup: "Wiederaufforstung", fallbackEn: "reforestation", tip: "noun", article: "die" },
      { de: "die Kreislaufwirtschaft", lookup: "Kreislaufwirtschaft", fallbackEn: "circular economy", tip: "noun", article: "die" },
      { de: "die Recyclinganlage", lookup: "Recyclinganlage", fallbackEn: "recycling facility", tip: "noun", article: "die" },
      { de: "der Messwert", lookup: "Messwert", fallbackEn: "measurement reading", tip: "noun", article: "der" },
      { de: "der Datensatz", lookup: "Datensatz", fallbackEn: "dataset", tip: "noun", article: "der" },
      { de: "der Durchschnitt", lookup: "Durchschnitt", fallbackEn: "average", tip: "noun", article: "der" },
      { de: "die Abweichung", lookup: "Abweichung", fallbackEn: "deviation", tip: "noun", article: "die" },
      { de: "die Theorie", lookup: "Theorie", fallbackEn: "theory", tip: "noun", article: "die" },
      { de: "die Entdeckung", lookup: "Entdeckung", fallbackEn: "discovery", tip: "noun", article: "die" },
      { de: "der Bestandteil", lookup: "Bestandteil", fallbackEn: "component", tip: "noun", article: "der" },
      { de: "das Teilchen", lookup: "Teilchen", fallbackEn: "particle", tip: "noun", article: "das" },
      { de: "die Strahlung", lookup: "Strahlung", fallbackEn: "radiation", tip: "noun", article: "die" },
      { de: "die Schwerkraft", lookup: "Schwerkraft", fallbackEn: "gravity", tip: "noun", article: "die" },
      { de: "der Temperaturanstieg", lookup: "Temperaturanstieg", fallbackEn: "rise in temperature", tip: "noun", article: "der" },
      { de: "das Ökosystem", lookup: "Ökosystem", fallbackEn: "ecosystem", tip: "noun", article: "das" },
      { de: "das Grundwasser", lookup: "Grundwasser", fallbackEn: "groundwater", tip: "noun", article: "das" },
      { de: "die Luftqualität", lookup: "Luftqualität", fallbackEn: "air quality", tip: "noun", article: "die" },
      { de: "die Messung", lookup: "Messung", fallbackEn: "measurement", tip: "noun", article: "die" },
      { de: "die Erwärmung", lookup: "Erwärmung", fallbackEn: "warming", tip: "noun", article: "die" },
      { de: "der Ausstoß", lookup: "Ausstoß", fallbackEn: "emissions, output", tip: "noun", article: "der" },
      { de: "das Vorkommen", lookup: "Vorkommen", fallbackEn: "occurrence, deposit", tip: "noun", article: "das" },
      { de: "die Energiequelle", lookup: "Energiequelle", fallbackEn: "energy source", tip: "noun", article: "die" },
      { de: "die Naturkatastrophe", lookup: "Naturkatastrophe", fallbackEn: "natural disaster", tip: "noun", article: "die" },
    ],
    dialogues: [],
    phrases: [

      { de: "Die Verschmutzung des Grundwassers bleibt jahrzehntelang messbar.", en: "Groundwater pollution remains measurable for decades.", use: "jahrzehntelang — German builds 'for decades' as one adverb; -lang glues onto most time nouns: stundenlang, wochenlang." },

      { de: "Aus Abfall wird Rohstoff: Genau das meint Kreislaufwirtschaft.", en: "Waste becomes raw material: that is exactly what a circular economy means.", use: "aus X wird Y = X turns into Y — the becoming reads backwards for English eyes; genau das points at the whole first clause." },

      { de: "Mit jedem verlorenen Lebensraum verschwinden auch Tierarten, die niemand je gezählt hat.", en: "With every habitat lost, animal species vanish that no one ever counted.", use: "mit jedem + participle + noun = with every X that is Y-ed; the relative clause trails after the verb — legal and common." },

      { de: "Auf die Dürre folgte die Überschwemmung, und beides in einem einzigen Sommer.", en: "The drought was followed by the flood — and both in a single summer.", use: "auf X folgt Y again — the follower is the subject; the afterthought und beides ... needs no verb at all." },

      { de: "Der Waldbrand hat mehr Treibhausgase freigesetzt als der gesamte Autoverkehr der Region in einem Jahr.", en: "The wildfire released more greenhouse gases than the region's entire road traffic does in a year.", use: "mehr ... als with a full noun phrase as the comparison; freisetzen = to release (gases, energy) — technical register." },

      { de: "Erneuerbare Energiequellen decken inzwischen die Hälfte des Energieverbrauchs.", en: "Renewable energy sources now cover half of all energy consumption.", use: "decken = to cover (demand); inzwischen = by now, marking how far things have moved. die Hälfte + Genitiv." },

      { de: "Steigt der Meeresspiegel weiter, sind die ersten Inseln nicht mehr zu retten.", en: "If sea levels keep rising, the first islands will be beyond saving.", use: "The wenn is dropped: verb-first Steigt ... = if it rises. nicht mehr zu retten = sein + zu-infinitive as 'cannot be'." },

      { de: "Ohne ein stabiles Stromnetz nützt der beste Solarpark wenig.", en: "Without a stable power grid, even the best solar farm is of little use.", use: "nützen = to be of use (intransitive); wenig alone as its measure. Superlative der beste concedes quality before dismissing it." },

      { de: "Wassermangel und Bodenerosion treiben die Landflucht voran.", en: "Water scarcity and soil erosion are driving the exodus from the countryside.", use: "vorantreiben (separable) = to drive forward; two compound subjects share one plural verb." },

      { de: "Der Abholzung folgt die Erosion, der Erosion folgt die Aufgabe der Felder.", en: "Deforestation is followed by erosion, and erosion by the abandonment of the fields.", use: "folgen + Dativ chains causes: the DATIVE names what came first. The repetition is deliberate rhetoric, not clumsiness." },

      { de: "Die Wiederaufforstung wird Jahrzehnte brauchen, die Abholzung brauchte drei Wochen.", en: "Reforestation will take decades; the clearing took three weeks.", use: "Future werden against bare Präteritum in one line — the tense clash IS the argument." },

      { de: "Einzelne Messwerte weichen immer ab, entscheidend ist der Durchschnitt.", en: "Individual readings always deviate; what matters is the average.", use: "abweichen splits (weichen ... ab); entscheidend ist X fronts the predicate — 'what is decisive is ...'." },

      { de: "Ein einziger Datensatz macht noch keine Theorie.", en: "A single dataset does not make a theory.", use: "X macht noch kein Y — the proverb frame (eine Schwalbe macht noch keinen Sommer) borrowed for science." },

      { de: "Die Entdeckung gelang durch Zufall, ihre Bestätigung durch Messung.", en: "The discovery came about by chance; its confirmation came through measurement.", use: "gelingen = to succeed/come off, with the achievement as subject; the second half drops the verb and keeps durch." },

      { de: "Die Schwerkraft wirkt auf jedes Teilchen, ob wir sie messen oder nicht.", en: "Gravity acts on every particle whether we measure it or not.", use: "ob ... oder nicht = whether ... or not; wirken auf + Akkusativ = to act on." },

      { de: "Ein Temperaturanstieg von zwei Grad klingt harmlos und ist es nicht.", en: "A two-degree rise in temperature sounds harmless — and it is not.", use: "und ist es nicht — es stands for the adjective harmlos; German can pronoun-ise a predicate adjective this way." },

      { de: "Ein Ökosystem kippt nicht langsam, sondern plötzlich.", en: "An ecosystem does not tip gradually — it tips all at once.", use: "kippen is the ecological term for tipping past the point of recovery; nicht ..., sondern with two bare adverbs." },

      { de: "Die Luftqualität hat sich verbessert, seit die Innenstadt autofrei ist.", en: "Air quality has improved since the city centre went car-free.", use: "seit as a conjunction takes present tense for a state that still holds: seit ... IST. autofrei — German coins adjectives with -frei." },

      { de: "Jede Messung verändert das, was sie misst, zumindest ein wenig.", en: "Every measurement changes the thing it measures, at least a little.", use: "das, was = that which; the comma pair around the relative clause is obligatory. zumindest = at least, as a concession." },

      { de: "Die Erwärmung der Meere verläuft schneller, als jede bisherige Prognose annahm.", en: "The oceans are warming faster than any previous forecast assumed.", use: "verlaufen describes how a process runs; als + clause for the exceeded expectation, with annahm (annehmen) at the end." },

      { de: "Der Ausstoß pro Kopf sagt mehr als die Gesamtzahl.", en: "Per-capita emissions tell you more than the total does.", use: "pro Kopf = per head/capita — no article; sagen here = to tell (be informative), a common metaphor with numbers." },

      { de: "Naturkatastrophen treffen selten die, die sie verursacht haben.", en: "Natural disasters rarely strike the people who caused them.", use: "die, die once more — those who; sie inside the relative clause points back to the disasters, not the people." },

    ],
  },
};
