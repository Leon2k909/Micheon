/**
 * English for the Vivere in Italia practice questions.
 *
 * The lesson cards are answered by VIVERE_IN_ITALIA_EN. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in English then asked its questions
 * in Italian.
 *
 * Keyed on the ITALIAN source text exactly as it appears in itQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an e for
 * an è or a straight apostrophe where the sentence has a curly one, and the
 * lookup misses in silence. The question renders in Italian, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS ITALIAN follows VIVERE_IN_ITALIA_EN exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - the word printed on the form or the card keeps its own name, with the
 *     meaning beside it: codice fiscale, permesso di soggiorno, INPS, INAIL,
 *     CCNL, SPID, questura, liceo, maturità;
 *   - the palace that stands for an institution keeps its name, because the
 *     newspapers use it that way: Quirinale, Montecitorio, Palazzo Madama,
 *     Palazzo Chigi, and the Consulta for the Corte costituzionale;
 *   - what English already names takes its English name: the Camera dei
 *     deputati is the Chamber of Deputies, the Corte di cassazione the Court
 *     of Cassation, a comune a commune and a regione a region.
 *
 * British spelling throughout, the same as the rest of the English catalogue:
 * offence, recognise, programme, defence, labour.
 *
 * Sixty-seven of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that VIVERE_IN_ITALIA_EN already
 * answers. Every English table is spread into one object, so a key present in
 * two of them would lose one silently — the later spread would decide both.
 * check-en-bank-translation measures coverage through translateCourseText,
 * the lookup a reader's tap actually goes through, so those count as answered
 * and are not duplicated here.
 */
export const IT_QUESTION_BANK_EN: Record<string, string> = {
  "Quale articolo della Costituzione descrive la bandiera?":
    "Which article of the Constitution describes the flag?",
  "L'articolo 1": "Article 1",
  "L'articolo 6": "Article 6",
  "L'articolo 11": "Article 11",
  "L'articolo 12": "Article 12",
  "L'articolo 12 chiude i principi fondamentali e descrive il tricolore a tre bande verticali di uguali dimensioni.":
    "Article 12 closes the fundamental principles and describes the tricolour as three vertical bands of equal size.",
  "Come si chiama ufficialmente l'inno nazionale?":
    "What is the national anthem officially called?",
  "Fratelli d'Italia": "Fratelli d'Italia",
  "Il Canto degli Italiani": "Il Canto degli Italiani",
  "Inno di Mameli": "Inno di Mameli",
  "Va' pensiero": "Va' pensiero",
  "Il titolo ufficiale è Il Canto degli Italiani. Fratelli d'Italia è il primo verso e Inno di Mameli il nome corrente: entrambi indicano lo stesso brano, ma non sono il titolo.":
    "The official title is Il Canto degli Italiani. Fratelli d'Italia is the first line and Inno di Mameli the everyday name: both point to the same piece, but neither is the title.",
  "In quale città nacque il tricolore nel 1797?": "In which city was the tricolour born in 1797?",
  "Reggio Emilia": "Reggio Emilia",
  "Bologna": "Bologna",
  "Il 7 gennaio 1797 la Repubblica Cispadana adottò il tricolore a Reggio Emilia. Per questo il 7 gennaio è la Festa del Tricolore.":
    "On 7 January 1797 the Cispadane Republic adopted the tricolour at Reggio Emilia. That is why 7 January is the Festa del Tricolore.",
  "Chi compose la musica dell'inno nazionale?": "Who composed the music of the national anthem?",
  "Gioachino Rossini": "Gioachino Rossini",
  "La musica è di Michele Novaro, il testo di Goffredo Mameli. Il nome corrente ricorda solo l'autore delle parole.":
    "The music is by Michele Novaro and the words by Goffredo Mameli. The everyday name remembers only the man who wrote the words.",
  "Da quando è in vigore l'emblema della Repubblica?":
    "How long has the emblem of the Republic been in force?",
  "Dal 1861": "Since 1861",
  "Dal 1946": "Since 1946",
  "Dal 1948": "Since 1948",
  "Dal 2017": "Since 2017",
  "L'emblema, scelto per concorso pubblico, è in vigore dal 5 maggio 1948, pochi mesi dopo l'entrata in vigore della Costituzione.":
    "The emblem, chosen by public competition, has been in force since 5 May 1948, a few months after the Constitution came into force.",
  "Quale ramo dell'emblema rappresenta la pace?": "Which branch on the emblem stands for peace?",
  "Il ramo di quercia": "The oak branch",
  "Il ramo di olivo": "The olive branch",
  "Il ramo di alloro": "The laurel branch",
  "Il ramo di palma": "The palm branch",
  "L'olivo sta per la pace, la quercia per la forza e la dignità. Sono due alberi diffusi in tutta la penisola.":
    "The olive stands for peace and the oak for strength and dignity. Both trees grow the length of the peninsula.",
  "Che cosa richiama la ruota dentata dell'emblema?":
    "What does the cogwheel on the emblem call to mind?",
  "L'industria automobilistica": "The motor industry",
  "Il lavoro": "Work",
  "La navigazione": "Seafaring",
  "Il tempo": "Time",
  "L'ingranaggio richiama il lavoro, su cui l'articolo 1 fonda la Repubblica: l'emblema cita la Costituzione.":
    "The cog stands for work, on which Article 1 founds the Republic: the emblem quotes the Constitution.",
  "In che anno Il Canto degli Italiani è diventato inno ufficiale per legge?":
    "In which year did Il Canto degli Italiani become the official anthem by law?",
  "Nel 1977": "In 1977",
  "Nel 2017": "In 2017",
  "Adottato in via provvisoria nel 1946, è diventato inno ufficiale soltanto con la legge del 4 dicembre 2017: settant'anni da provvisorio.":
    "Adopted provisionally in 1946, it became the official anthem only with the law of 4 December 2017: seventy years as a stopgap.",
  "Che cosa si celebra il 7 gennaio?": "What is celebrated on 7 January?",
  "La Festa della Repubblica": "The Festa della Repubblica",
  "La Festa del Tricolore": "The Festa del Tricolore",
  "L'Epifania civile": "A civil Epiphany",
  "La Giornata della Costituzione": "The day of the Constitution",
  "Il 7 gennaio è la Festa del Tricolore, anniversario dell'adozione della bandiera nel 1797. Non è giorno festivo.":
    "7 January is the Festa del Tricolore, the anniversary of the flag's adoption in 1797. It is not a public holiday.",
  "Quale evento ricorda il 4 novembre?": "Which event does 4 November recall?",
  "L'armistizio del 1918 e l'unità nazionale": "The armistice of 1918 and national unity",
  "La liberazione dal nazifascismo": "The liberation from fascism and the Nazis",
  "L'entrata in guerra del 1940": "Entry into the war in 1940",
  "Il 4 novembre è il Giorno dell'Unità nazionale e Festa delle Forze armate, legato all'armistizio del 1918. La Liberazione è il 25 aprile e la Repubblica il 2 giugno.":
    "4 November is the day of national unity and the feast of the armed forces, tied to the armistice of 1918. Liberation is 25 April and the Republic 2 June.",
  "Come sono disposte le bande del tricolore?": "How are the bands of the tricolour set out?",
  "Orizzontali, di larghezza diversa": "Horizontal, of different widths",
  "Verticali, di uguali dimensioni": "Vertical, of equal size",
  "Orizzontali, di uguali dimensioni": "Horizontal, of equal size",
  "In diagonale": "Diagonal",
  "Tre bande verticali di uguali dimensioni. Le bande orizzontali sono quelle della bandiera ungherese, che ha gli stessi colori disposti diversamente.":
    "Three vertical bands of equal size. Horizontal bands belong to the Hungarian flag, which has the same colours set out differently.",
  "Chi disegnò l'emblema della Repubblica?": "Who designed the emblem of the Republic?",
  "Paolo Paschetto": "Paolo Paschetto",
  "Giuseppe Terragni": "Giuseppe Terragni",
  "Renato Guttuso": "Renato Guttuso",
  "Bruno Munari": "Bruno Munari",
  "L'emblema fu disegnato da Paolo Paschetto, vincitore del concorso pubblico bandito dal governo nel 1946.":
    "The emblem was designed by Paolo Paschetto, who won the public competition the government called in 1946.",
  "Perché l'Italia ha un emblema e non uno stemma?":
    "Why does Italy have an emblem and not a coat of arms?",
  "Perché lo stemma è riservato alle monarchie e l'emblema non discende da una dinastia":
    "Because a coat of arms belongs to monarchies and an emblem descends from no dynasty",
  "Perché l'araldica è vietata dalla Costituzione": "Because the Constitution forbids heraldry",
  "Perché uno stemma sarebbe troppo costoso da riprodurre":
    "Because a coat of arms would cost too much to reproduce",
  "Perché lo stemma spetta solo alle regioni":
    "Because a coat of arms belongs only to the regions",
  "Uno stemma discende da una famiglia regnante; l'emblema fu inventato da una repubblica appena nata, scegliendolo per concorso pubblico. È una differenza di origine, non di forma.":
    "A coat of arms comes down from a ruling family; the emblem was invented by a republic barely born, and chosen by public competition. The difference is one of origin, not of shape.",
  "Quanti articoli ha la Costituzione italiana?":
    "How many articles does the Italian Constitution have?",
  "Cinquantacinque": "Fifty-five",
  "Duecento": "Two hundred",
  "Centotrentanove articoli, più diciotto disposizioni transitorie e finali. Dodici sono i soli principi fondamentali.":
    "A hundred and thirty-nine articles, plus eighteen transitional and final provisions. Twelve of them are the fundamental principles alone.",
  "Chi promulgò la Costituzione nel dicembre 1947?":
    "Who promulgated the Constitution in December 1947?",
  "Alcide De Gasperi": "Alcide De Gasperi",
  "Enrico De Nicola": "Enrico De Nicola",
  "Luigi Einaudi": "Luigi Einaudi",
  "Umberto II": "Umberto II",
  "Enrico De Nicola, capo provvisorio dello Stato. Einaudi sarà il primo Presidente della Repubblica eletto dal Parlamento, nel 1948.":
    "Enrico De Nicola, the provisional head of state. Einaudi would be the first President of the Republic elected by parliament, in 1948.",
  "Quando fu eletta l'Assemblea costituente?": "When was the Constituent Assembly elected?",
  "Il 18 aprile 1948": "On 18 April 1948",
  "L'Assemblea fu eletta il 2 giugno 1946, lo stesso giorno del referendum istituzionale: una scheda per la forma dello Stato, una per i costituenti.":
    "The Assembly was elected on 2 June 1946, the same day as the referendum on the form of the state: one ballot paper for the form of the state and one for the constituent members.",
  "Che cosa rese storico il voto del 2 giugno 1946?":
    "What made the vote of 2 June 1946 historic?",
  "Fu il primo voto a scrutinio segreto": "It was the first vote by secret ballot",
  "Fu la prima volta che votarono le donne a livello nazionale":
    "It was the first time women voted at national level",
  "Fu il primo voto con le schede stampate": "It was the first vote with printed ballot papers",
  "Fu il primo voto aperto ai diciottenni": "It was the first vote open to eighteen-year-olds",
  "Fu la prima consultazione a suffragio davvero universale: le donne votarono per la prima volta a livello nazionale. Il voto ai diciottenni arriverà solo nel 1975.":
    "It was the first vote on a truly universal franchise: women voted at national level for the first time. The vote at eighteen would come only in 1975.",
  "Su che cosa è fondata la Repubblica secondo l'articolo 1?":
    "What is the Republic founded on, under Article 1?",
  "Sulla famiglia": "On the family",
  "Sul lavoro": "On work",
  "Sulla libertà": "On freedom",
  "Sulla proprietà": "On property",
  "Una repubblica democratica fondata sul lavoro: la formula fu il compromesso fra chi voleva una repubblica dei lavoratori e chi ne voleva una definizione più generale.":
    "A democratic republic founded on work: the wording was the compromise between those who wanted a republic of workers and those who wanted something broader.",
  "Che cosa aggiunge il secondo comma dell'articolo 3?":
    "What does the second paragraph of Article 3 add?",
  "L'uguaglianza davanti alla legge": "Equality before the law",
  "Il compito della Repubblica di rimuovere gli ostacoli di fatto all'uguaglianza":
    "The Republic's task of removing the obstacles that stand in the way of equality in fact",
  "Il divieto di discriminazione religiosa": "The ban on religious discrimination",
  "La parità fra uomo e donna nel lavoro": "Equality between men and women at work",
  "Il primo comma enuncia l'uguaglianza formale, il secondo quella sostanziale: non basta che la legge sia uguale, la Repubblica deve rimuovere gli ostacoli che la rendono ineffettiva. È il comma su cui poggiano le politiche sociali.":
    "The first paragraph states formal equality, the second the equality that has to be real: it is not enough for the law to be equal, the Republic has to remove the obstacles that make it ineffective. It is the paragraph the social policies rest on.",
  "Su quale articolo poggia l'adesione italiana all'Unione europea?":
    "Which article does Italy's membership of the European Union rest on?",
  "L'articolo 3": "Article 3",
  "L'articolo 138": "Article 138",
  "L'articolo 11 consente, in condizioni di parità con gli altri Stati, le limitazioni di sovranità necessarie a un ordinamento che assicuri pace e giustizia. Lo stesso articolo che ripudia la guerra apre all'Europa.":
    "Article 11 allows, on equal terms with other states, the limits on sovereignty needed for an order that secures peace and justice. The same article that rejects war opens the door to Europe.",
  "Che cosa ripudia l'articolo 11?": "What does Article 11 reject?",
  "La pena di morte": "The death penalty",
  "La censura": "Censorship",
  "Il lavoro minorile": "Child labour",
  "L'Italia ripudia la guerra come strumento di offesa alla libertà degli altri popoli e come mezzo di risoluzione delle controversie internazionali. La pena di morte è abolita dall'articolo 27.":
    "Italy rejects war as a means of offence against the freedom of other peoples and as a way of settling international disputes. The death penalty is abolished by Article 27.",
  "Quale articolo disciplina la revisione della Costituzione?":
    "Which article governs amending the Constitution?",
  "L'articolo 75": "Article 75",
  "L'articolo 101": "Article 101",
  "L'articolo 139": "Article 139",
  "L'articolo 138 detta la procedura aggravata; il 139 pone il limite invalicabile della forma repubblicana. Il 75 riguarda invece il referendum abrogativo.":
    "Article 138 lays down the heavier procedure; 139 sets the limit that cannot be crossed, the republican form. 75 covers the repealing referendum instead.",
  "Quando può essere chiesto il referendum confermativo su una legge costituzionale?":
    "When can a confirming referendum be asked for on a constitutional law?",
  "Sempre, dopo l'approvazione": "Always, once it is passed",
  "Solo se nella seconda votazione non si raggiungono i due terzi":
    "Only if the second vote falls short of two thirds",
  "Solo se lo chiede il Presidente della Repubblica":
    "Only if the President of the Republic asks for it",
  "Mai: le leggi costituzionali non sono referendabili":
    "Never: constitutional laws cannot go to referendum",
  "Se ciascuna Camera approva con almeno i due terzi, la legge è definitiva. Sotto quella soglia, cinquecentomila elettori, cinque consigli regionali o un quinto dei parlamentari possono chiedere il referendum.":
    "If each chamber passes it with at least two thirds, the law is final. Below that mark, five hundred thousand voters, five regional councils or a fifth of the members can ask for the referendum.",
  "Il referendum confermativo dell'articolo 138 è valido solo se vota la maggioranza degli aventi diritto?":
    "Is the confirming referendum of Article 138 valid only if a majority of those entitled vote?",
  "Sì, come tutti i referendum": "Yes, like every referendum",
  "No, non ha quorum di partecipazione": "No; it has no turnout threshold",
  "Sì, ma solo per le riforme della Parte II": "Yes, but only for reforms to Part II",
  "Dipende dal numero di firme raccolte": "It depends on how many signatures were collected",
  "Il confermativo non ha quorum: vale qualunque sia l'affluenza. Il quorum di metà più uno degli aventi diritto riguarda il referendum abrogativo dell'articolo 75.":
    "The confirming referendum has no threshold: it counts whatever the turnout. The threshold of half those entitled plus one belongs to the repealing referendum of Article 75.",
  "Quali articoli formano la Parte II, sull'ordinamento della Repubblica?":
    "Which articles make up Part II, on the ordering of the Republic?",
  "Dall'1 al 12": "1 to 12",
  "Dal 13 al 54": "13 to 54",
  "Dal 55 al 139": "55 to 139",
  "Dal 100 al 139": "100 to 139",
  "Principi fondamentali 1–12, Parte I sui diritti e doveri 13–54, Parte II sull'ordinamento 55–139.":
    "Fundamental principles 1–12, Part I on rights and duties 13–54, Part II on the ordering of the state 55–139.",
  "Quando l'Assemblea costituente approvò il testo della Costituzione?":
    "When did the Constituent Assembly pass the text of the Constitution?",
  "Approvazione il 22 dicembre 1947, promulgazione il 27 dicembre, entrata in vigore il 1º gennaio 1948. Il 18 aprile 1948 sono invece le prime elezioni politiche repubblicane.":
    "Passed on 22 December 1947, promulgated on the 27th, in force from 1 January 1948. 18 April 1948 is the first general election of the Republic instead.",
  "Quali articoli formano la Parte I, sui diritti e doveri?":
    "Which articles make up Part I, on rights and duties?",
  "Dal 55 al 96": "55 to 96",
  "Dal 101 al 139": "101 to 139",
  "La Parte I va dall'articolo 13 al 54 ed è divisa in quattro titoli: rapporti civili, etico-sociali, economici e politici.":
    "Part I runs from Article 13 to 54 and is divided into four titles: civil, ethical and social, economic and political relations.",
  "In quanti titoli è divisa la Parte I della Costituzione?":
    "How many titles is Part I of the Constitution divided into?",
  "Due": "Two",
  "Quattro": "Four",
  "Sei": "Six",
  "Quattro: rapporti civili, rapporti etico-sociali, rapporti economici e rapporti politici. Ogni titolo guarda la persona da un lato diverso.":
    "Four: civil relations, ethical and social relations, economic relations and political relations. Each title looks at the person from a different side.",
  "Quale articolo esclude la pena di morte?": "Which article rules out the death penalty?",
  "L'articolo 13": "Article 13",
  "L'articolo 21": "Article 21",
  "L'articolo 24": "Article 24",
  "L'articolo 27": "Article 27",
  "L'articolo 27 chiude affermando che non è ammessa la pena di morte, dopo aver stabilito la personalità della responsabilità penale e il fine rieducativo della pena.":
    "Article 27 closes by stating that the death penalty is not allowed, after establishing that criminal responsibility is personal and that punishment must aim at rehabilitation.",
  "Quale principio NON è contenuto nell'articolo 27?": "Which principle is NOT in Article 27?",
  "La responsabilità penale è personale": "Criminal responsibility is personal",
  "L'imputato non è considerato colpevole fino alla condanna definitiva":
    "The accused is not held guilty until the conviction is final",
  "Le pene devono tendere alla rieducazione": "Punishment must aim at rehabilitation",
  "Nessuno può essere distolto dal giudice naturale":
    "Nobody may be taken from the judge assigned by law",
  "Il giudice naturale è garantito dall'articolo 25. L'articolo 27 riunisce personalità della responsabilità, presunzione di non colpevolezza, fine rieducativo della pena e divieto della pena di morte.":
    "The judge assigned by law is guaranteed by Article 25. Article 27 brings together the personal nature of responsibility, the presumption of innocence, the rehabilitative purpose of punishment and the ban on the death penalty.",
  "Che cosa garantisce l'articolo 21?": "What does Article 21 guarantee?",
  "La libertà di riunione": "Freedom of assembly",
  "La libertà di manifestare il proprio pensiero": "Freedom to express one's thought",
  "La libertà di associazione": "Freedom of association",
  "La libertà religiosa": "Freedom of religion",
  "L'articolo 21 riguarda la manifestazione del pensiero con la parola, lo scritto e ogni mezzo di diffusione. Riunione è l'articolo 17, associazione il 18, religione il 19.":
    "Article 21 covers expressing thought in speech, in writing and by any means of distribution. Assembly is Article 17, association 18 and religion 19.",
  "La stampa può essere sottoposta ad autorizzazioni o censure?":
    "Can the press be made subject to authorisation or censorship?",
  "Sì, in caso di emergenza nazionale": "Yes, in a national emergency",
  "No, l'articolo 21 lo esclude": "No; Article 21 rules it out",
  "Sì, se lo decide il Ministero dell'interno": "Yes, if the interior ministry decides so",
  "Solo per le pubblicazioni straniere": "Only for foreign publications",
  "L'articolo 21 esclude autorizzazioni e censure: è una frase scritta da chi aveva appena vissuto vent'anni di giornali autorizzati. Restano possibili i sequestri per atto motivato dell'autorità giudiziaria.":
    "Article 21 rules out authorisation and censorship: a sentence written by people who had just lived through twenty years of licensed newspapers. Seizure remains possible on a reasoned order of the judicial authority.",
  "Quale articolo tutela la salute come diritto dell'individuo?":
    "Which article protects health as a right of the individual?",
  "L'articolo 29": "Article 29",
  "L'articolo 32": "Article 32",
  "L'articolo 34": "Article 34",
  "L'articolo 38": "Article 38",
  "L'articolo 32 definisce la salute diritto dell'individuo e interesse della collettività, e garantisce cure gratuite agli indigenti. È la base del Servizio sanitario nazionale.":
    "Article 32 calls health a right of the individual and an interest of the community, and guarantees free care to those without means. It is the basis of the national health service.",
  "Che cos'è il patrocinio a spese dello Stato?": "What is legal aid at the state's expense?",
  "Un contributo per le spese processuali di chi non può permettersele":
    "A contribution towards the court costs of those who cannot afford them",
  "Un fondo per le vittime di reato": "A fund for the victims of crime",
  "Un'assicurazione obbligatoria per gli avvocati": "Compulsory insurance for lawyers",
  "Un sussidio per i detenuti": "An allowance for prisoners",
  "Nasce dall'articolo 24, che impone allo Stato di assicurare ai non abbienti i mezzi per agire e difendersi davanti a ogni giurisdizione.":
    "It comes from Article 24, which requires the state to give those without means the wherewithal to sue and to defend themselves before any court.",
  "Quale articolo riconosce il diritto di sciopero?":
    "Which article recognises the right to strike?",
  "L'articolo 35": "Article 35",
  "L'articolo 39": "Article 39",
  "L'articolo 40": "Article 40",
  "L'articolo 46": "Article 46",
  "L'articolo 40 riconosce il diritto di sciopero, che si esercita nell'ambito delle leggi che lo regolano. L'articolo 39 riguarda invece la libertà sindacale.":
    "Article 40 recognises the right to strike, exercised within the laws that govern it. Article 39 covers freedom of association in unions instead.",
  "Chi non vota alle elezioni politiche che conseguenza subisce?":
    "What happens to someone who does not vote in a general election?",
  "Una sanzione amministrativa": "An administrative penalty",
  "Nessuna: il dovere civico non è sanzionato": "Nothing: the civic duty carries no penalty",
  "La sospensione dei diritti politici": "Suspension of political rights",
  "L'esclusione dai concorsi pubblici": "Exclusion from public competitions",
  "L'articolo 48 chiama il voto dovere civico, ma non prevede sanzioni. Dovere civico indica un obbligo morale e politico, non un obbligo giuridico assistito da pena.":
    "Article 48 calls voting a civic duty but sets no penalty. A civic duty is a moral and political obligation, not a legal one backed by punishment.",
  "Quale articolo impone fedeltà alla Repubblica e l'osservanza della Costituzione?":
    "Which article requires loyalty to the Republic and observance of the Constitution?",
  "L'articolo 48": "Article 48",
  "L'articolo 52": "Article 52",
  "L'articolo 53": "Article 53",
  "L'articolo 54": "Article 54",
  "L'articolo 54 chiede a tutti fedeltà alla Repubblica e, a chi ricopre funzioni pubbliche, di adempierle con disciplina e onore.":
    "Article 54 asks loyalty to the Republic of everyone, and of those who hold public office that they carry it out with discipline and honour.",
  "Le garanzie dell'articolo 13 sulla libertà personale valgono solo per i cittadini italiani?":
    "Do the guarantees of Article 13 on personal liberty apply only to Italian citizens?",
  "Sì, solo per i cittadini": "Yes, only to citizens",
  "No, l'articolo dice nessuno e vale per chiunque":
    "No; the article says nobody and applies to everyone",
  "Solo per i cittadini dell'Unione europea": "Only to citizens of the European Union",
  "Solo per chi ha la residenza": "Only to those who are resident",
  "L'articolo 13 usa la parola nessuno e l'articolo 21 la parola tutti: sono garanzie riferite alla persona. Riservati ai cittadini sono soprattutto i diritti politici, come il voto.":
    "Article 13 uses the word nobody and Article 21 the word everyone: these are guarantees given to the person. What is reserved to citizens is above all the political rights, such as the vote.",
  "Quale articolo definisce sacro dovere la difesa della patria?":
    "Which article calls the defence of the homeland a sacred duty?",
  "L'articolo 52. Il 48 riguarda il voto, il 53 i tributi e l'11 il ripudio della guerra: quattro articoli che si citano spesso insieme e si confondono facilmente.":
    "Article 52. 48 covers voting, 53 taxes and 11 the rejection of war: four articles often cited together and easily confused.",
  "Quale articolo della Costituzione tutela le minoranze linguistiche?":
    "Which article of the Constitution protects the linguistic minorities?",
  "L'articolo 9": "Article 9",
  "L'articolo 6 impegna la Repubblica a tutelare con apposite norme le minoranze linguistiche. L'attuazione arriverà però solo con la legge 482 del 1999.":
    "Article 6 commits the Republic to protecting the linguistic minorities by specific rules. It was put into effect only with law 482 of 1999.",
  "Quante minoranze linguistiche storiche riconosce la legge del 1999?":
    "How many historic linguistic minorities does the law of 1999 recognise?",
  "Nove": "Nine",
  "Venti": "Twenty",
  "Dodici: albanesi, catalane, germaniche, greche, slovene, croate, e le popolazioni parlanti francese, franco-provenzale, friulano, ladino, occitano e sardo.":
    "Twelve: Albanian, Catalan, Germanic, Greek, Slovene and Croatian, plus the people who speak French, Franco-Provençal, Friulian, Ladin, Occitan and Sardinian.",
  "In quale regione il tedesco è equiparato all'italiano?":
    "In which region does German stand on the same footing as Italian?",
  "In Friuli Venezia Giulia": "In Friuli Venezia Giulia",
  "In Veneto": "In Veneto",
  "In Alto Adige il tedesco è equiparato all'italiano: atti bilingui, scuole distinte per gruppo linguistico e proporzionale etnica per i posti pubblici.":
    "In Alto Adige German stands on the same footing as Italian: bilingual documents, separate schools for each language group and an ethnic quota for public posts.",
  "In che anno fu fondata l'Accademia della Crusca?":
    "In which year was the Accademia della Crusca founded?",
  "Nel 1321": "In 1321",
  "Nel 1583": "In 1583",
  "Nel 1861": "In 1861",
  "Fondata a Firenze nel 1583, è la più antica accademia linguistica del mondo ancora attiva.":
    "Founded in Florence in 1583, it is the oldest academy of language in the world still at work.",
  "Perché il napoletano non è considerato una variante dell'italiano?":
    "Why is Neapolitan not counted as a variety of Italian?",
  "Perché ha un alfabeto diverso": "Because it has a different alphabet",
  "Perché discende dal latino per conto proprio, come lingua romanza sorella":
    "Because it comes down from Latin in its own right, as a sister Romance language",
  "Perché è parlato solo in una città": "Because it is spoken in one city only",
  "Perché non ha una tradizione scritta": "Because it has no written tradition",
  "I cosiddetti dialetti italiani in genere non derivano dall'italiano: derivano dal latino in parallelo. Il napoletano ha inoltre una lunga tradizione scritta e letteraria.":
    "The so-called Italian dialects mostly do not come from Italian: they come from Latin alongside it. Neapolitan also has a long written and literary tradition.",
  "Quale studioso propose la stima più citata sugli italofoni al momento dell'Unità?":
    "Which scholar put forward the most quoted estimate of Italian speakers at unification?",
  "Benedetto Croce": "Benedetto Croce",
  "Tullio De Mauro": "Tullio De Mauro",
  "Antonio Gramsci": "Antonio Gramsci",
  "Bruno Migliorini": "Bruno Migliorini",
  "La stima di poco più del due per cento è di Tullio De Mauro. Altri studiosi propongono percentuali più alte, comunque lontane dalla maggioranza della popolazione.":
    "The estimate of a little over two per cent is Tullio De Mauro's. Other scholars put the figure higher, but still far from a majority of the population.",
  "Che cos'è la proporzionale etnica in Alto Adige?": "What is the ethnic quota in Alto Adige?",
  "Una ripartizione dei posti nel pubblico impiego fra i gruppi linguistici":
    "A sharing out of public sector posts among the language groups",
  "Un sistema elettorale riservato alle minoranze":
    "An electoral system reserved for the minorities",
  "Una quota di studenti stranieri per classe": "A quota of foreign pupils per class",
  "Una divisione del bilancio provinciale fra i comuni":
    "A division of the provincial budget among the communes",
  "I posti nel pubblico impiego sono ripartiti fra gruppo italiano, tedesco e ladino in proporzione alla loro consistenza, dichiarata al censimento.":
    "Public sector posts are shared among the Italian, German and Ladin groups in proportion to their size, as declared at the census.",
  "Quali lingue minoritarie sono tutelate in Friuli Venezia Giulia?":
    "Which minority languages are protected in Friuli Venezia Giulia?",
  "Il tedesco e il ladino": "German and Ladin",
  "Lo sloveno e il friulano": "Slovene and Friulian",
  "Il croato e l'albanese": "Croatian and Albanian",
  "L'occitano e il sardo": "Occitan and Sardinian",
  "Lo sloveno nelle province di Trieste, Gorizia e Udine, e il friulano, parlato da alcune centinaia di migliaia di persone.":
    "Slovene in the provinces of Trieste, Gorizia and Udine, and Friulian, spoken by some hundreds of thousands of people.",
  "Da quale città viene il modello su cui si è formato l'italiano standard?":
    "Which city gave the model on which standard Italian was formed?",
  "Il fiorentino letterario del Trecento, quello di Dante, Petrarca e Boccaccio, fu adottato nel Cinquecento come modello scritto per tutta la penisola.":
    "The literary Florentine of the fourteenth century, the language of Dante, Petrarch and Boccaccio, was taken up in the sixteenth as the written model for the whole peninsula.",
  "Quale mezzo contribuì più di ogni altro a diffondere l'italiano parlato nel dopoguerra?":
    "Which medium did most to spread spoken Italian after the war?",
  "Il cinema": "The cinema",
  "La televisione": "Television",
  "La radio a galena": "The crystal radio",
  "I giornali": "The newspapers",
  "Negli anni Cinquanta e Sessanta la televisione portò l'italiano nelle case di chi parlava solo dialetto, insieme alla scuola dell'obbligo e all'emigrazione interna.":
    "In the fifties and sixties television brought Italian into the homes of people who spoke only dialect, alongside compulsory schooling and migration within the country.",
  "Da dove viene il nome dell'Accademia della Crusca?":
    "Where does the name of the Accademia della Crusca come from?",
  "Dal quartiere fiorentino in cui nacque": "From the district of Florence where it was born",
  "Dall'immagine della farina separata dalla crusca":
    "From the image of flour separated from the bran",
  "Dal cognome del fondatore": "From the founder's surname",
  "Da un'antica corporazione di fornai": "From an old guild of bakers",
  "Il nome richiama il lavoro di separare la farina buona dalla crusca: separare le parole da accogliere da quelle da scartare.":
    "The name recalls the work of separating good flour from bran: separating the words to take in from those to throw out.",
  "In quale regione si parlano, oltre al francese, varietà germaniche walser?":
    "In which region are Walser Germanic varieties spoken alongside French?",
  "In Emilia-Romagna": "In Emilia-Romagna",
  "In Calabria": "In Calabria",
  "Le comunità walser vivono nelle valli alpine della Valle d'Aosta e del Piemonte. In Valle d'Aosta convivono quindi italiano, francese e parlate germaniche.":
    "The Walser communities live in the Alpine valleys of the Aosta Valley and Piedmont. In the Aosta Valley, then, Italian, French and Germanic speech live side by side.",
  "L'italiano è dichiarato lingua ufficiale nei principi fondamentali della Costituzione?":
    "Is Italian declared the official language in the fundamental principles of the Constitution?",
  "Sì, all'articolo 6": "Yes, in Article 6",
  "Sì, all'articolo 12": "Yes, in Article 12",
  "No: lo si ricava dallo statuto del Trentino-Alto Adige e dalla legge 482":
    "No: it follows from the statute of Trentino-Alto Adige and from law 482",
  "No: non è lingua ufficiale in nessun testo": "No: it is not the official language in any text",
  "La Costituzione non lo dice. L'italiano è indicato come lingua ufficiale nello statuto speciale del Trentino-Alto Adige e nella legge 482 del 1999: una cosa ovvia che non sta dove ci si aspetta.":
    "The Constitution does not say it. Italian is named the official language in the special statute of Trentino-Alto Adige and in law 482 of 1999: an obvious thing that is not where you expect it.",
  "Quanti sono i giorni festivi nazionali, oltre al patrono locale?":
    "How many national public holidays are there, besides the local patron saint?",
  "Dieci": "Ten",
  "Quindici": "Fifteen",
  "Dodici giorni festivi per legge, più il santo patrono, che è festivo soltanto nel proprio comune.":
    "Twelve public holidays by law, plus the patron saint, which is a holiday only in that saint's own commune.",
  "Quando si celebra il patrono di Milano?": "When is the patron saint of Milan celebrated?",
  "Il 19 settembre": "On 19 September",
  "Il 4 ottobre": "On 4 October",
  "Il 7 dicembre": "On 7 December",
  "Il 29 giugno": "On 29 June",
  "Sant'Ambrogio si celebra il 7 dicembre: a Milano è giorno festivo e apre la stagione della Scala. Il 19 settembre è san Gennaro a Napoli.":
    "Saint Ambrose is celebrated on 7 December: in Milan it is a public holiday and it opens the season at La Scala. 19 September is Saint Januarius in Naples.",
  "Chi è il patrono di Napoli?": "Who is the patron saint of Naples?",
  "San Petronio": "Saint Petronius",
  "San Gennaro": "Saint Januarius",
  "San Marco": "Saint Mark",
  "Santa Rosalia": "Saint Rosalia",
  "San Gennaro, celebrato il 19 settembre. San Petronio è di Bologna, san Marco di Venezia e santa Rosalia di Palermo.":
    "Saint Januarius, celebrated on 19 September. Saint Petronius belongs to Bologna, Saint Mark to Venice and Saint Rosalia to Palermo.",
  "Che cosa si celebra il 1º maggio?": "What is celebrated on 1 May?",
  "La Liberazione": "The Liberation",
  "La festa dei lavoratori": "The workers' holiday",
  "La festa della Repubblica": "The feast of the Republic",
  "L'Unità nazionale": "National unity",
  "Il 1º maggio è la festa dei lavoratori, una delle quattro ricorrenze civili del calendario italiano.":
    "1 May is the workers' holiday, one of the four civil dates in the Italian calendar.",
  "Quando si celebrano i santi Pietro e Paolo, patroni di Roma?":
    "When are Saints Peter and Paul, the patrons of Rome, celebrated?",
  "Il 21 aprile": "On 21 April",
  "Il 1º novembre": "On 1 November",
  "Il 29 giugno, giorno festivo soltanto a Roma. Il 21 aprile è invece il Natale di Roma, che non è festivo.":
    "On 29 June, a public holiday in Rome alone. 21 April is the birthday of Rome instead, which is not a holiday.",
  "Il giorno del patrono è festivo in tutta Italia?":
    "Is the patron saint's day a holiday throughout Italy?",
  "Sì, come le altre dodici feste": "Yes, like the other twelve holidays",
  "No, soltanto nel comune di cui è patrono": "No, only in the commune whose patron it is",
  "Sì, ma solo nei capoluoghi di regione": "Yes, but only in the regional capitals",
  "No, non è mai festivo per legge": "No; it is never a holiday by law",
  "È festivo solo nel proprio comune: un ufficio milanese chiude il 7 dicembre, mentre a Roma lo stesso giorno si lavora normalmente.":
    "It is a holiday only in that saint's own commune: an office in Milan closes on 7 December, while in Rome the same day is an ordinary working day.",
  "Con quale nome è comunemente conosciuto il Lunedì dell'Angelo?":
    "By what name is the Lunedì dell'Angelo commonly known?",
  "Pasquetta": "Pasquetta",
  "Carnevale": "Carnevale, the carnival",
  "Befana": "Befana",
  "Il lunedì dopo Pasqua si chiama ufficialmente Lunedì dell'Angelo e comunemente Pasquetta. È una festa mobile, come la Pasqua da cui dipende.":
    "The Monday after Easter is officially the Lunedì dell'Angelo and commonly Pasquetta. It is a movable feast, like the Easter it depends on.",
  "Che cosa si ricorda il 10 febbraio?": "What is remembered on 10 February?",
  "Le vittime delle foibe e l'esodo giuliano-dalmata":
    "The victims of the foibe and the exodus from Istria and Dalmatia",
  "I caduti della Grande guerra": "The dead of the Great War",
  "Il Giorno del Ricordo, istituito per le vittime delle foibe e per l'esodo delle popolazioni istriane, fiumane e dalmate.":
    "The Giorno del Ricordo, the day of remembrance set up for the victims of the foibe and for the exodus of the people of Istria, Fiume and Dalmatia.",
  "A quale fatto del 1978 è legata la data del 9 maggio?":
    "Which event of 1978 is the date of 9 May tied to?",
  "Alla strage di piazza Fontana": "The massacre in piazza Fontana",
  "Al ritrovamento del corpo di Aldo Moro": "The finding of Aldo Moro's body",
  "All'attentato di via Fani": "The attack in via Fani",
  "Alla strage di Bologna": "The Bologna bombing",
  "Il 9 maggio 1978 fu ritrovato il corpo di Aldo Moro. Quella data è oggi il Giorno della memoria delle vittime del terrorismo. Il rapimento in via Fani era avvenuto il 16 marzo.":
    "Aldo Moro's body was found on 9 May 1978. That date is now the day of remembrance for the victims of terrorism. The kidnapping in via Fani had happened on 16 March.",
  "Quale festa cade il 26 dicembre?": "Which feast falls on 26 December?",
  "L'Immacolata": "The Immaculate Conception",
  "Santo Stefano": "Saint Stephen",
  "Ognissanti": "All Saints",
  "Santo Stefano, il giorno dopo Natale. L'Immacolata è l'8 dicembre, l'Epifania il 6 gennaio e Ognissanti il 1º novembre.":
    "Saint Stephen, the day after Christmas. The Immaculate Conception is 8 December, Epiphany 6 January and All Saints 1 November.",
  "Quando cade l'Immacolata Concezione?": "When does the Immaculate Conception fall?",
  "Il 6 dicembre": "On 6 December",
  "Il 6 gennaio": "On 6 January",
  "L'8 dicembre. In molte case è il giorno in cui si fa l'albero di Natale, e a Roma il papa rende omaggio alla colonna di piazza di Spagna.":
    "8 December. In many homes it is the day the Christmas tree goes up, and in Rome the pope pays homage at the column in piazza di Spagna.",
  "Da che cosa dipende la data della Pasqua?": "What does the date of Easter depend on?",
  "Da una data fissa stabilita nel Concilio di Trento":
    "A fixed date settled at the Council of Trent",
  "Dal primo plenilunio di primavera": "The first full moon of spring",
  "Dal calendario civile dello Stato": "The civil calendar of the state",
  "Dall'inizio della Quaresima, fissato al 1º marzo": "The start of Lent, fixed at 1 March",
  "La Pasqua cade la domenica successiva al primo plenilunio dopo l'equinozio di primavera. Da lei dipendono a cascata Carnevale, Quaresima e Pasquetta.":
    "Easter falls on the Sunday after the first full moon following the spring equinox. Carnevale, Lent and Pasquetta all follow from it in turn.",
  "Che cosa porta la Befana la notte del 6 gennaio?":
    "What does the Befana bring on the night of 6 January?",
  "I doni ai bambini, e carbone di zucchero a chi non è stato buono":
    "Presents for the children, and sugar coal for those who have not been good",
  "Le uova di cioccolato": "Chocolate eggs",
  "I dolci del Carnevale": "The sweets of Carnevale",
  "I regali ai soli adulti": "Presents for the grown-ups only",
  "La Befana riempie le calze la notte dell'Epifania. Non è festa religiosa nel senso stretto: è una tradizione popolare che si è appoggiata alla data del 6 gennaio.":
    "The Befana fills the stockings on the night of Epiphany. It is not a religious feast in the strict sense: it is a folk tradition that attached itself to the date of 6 January.",
  "Quanti sono oggi i senatori elettivi?": "How many elected senators are there today?",
  "Cento": "A hundred",
  "Trecentoquindici": "Three hundred and fifteen",
  "Quattrocento": "Four hundred",
  "Duecento dal 2022. Trecentoquindici era il numero precedente e quattrocento è quello dei deputati.":
    "Two hundred since 2022. Three hundred and fifteen was the earlier number, and four hundred is the number of deputies.",
  "In quale palazzo si riunisce la Camera dei deputati?":
    "In which palace does the Chamber of Deputies meet?",
  "Palazzo Madama": "Palazzo Madama",
  "Palazzo Chigi": "Palazzo Chigi",
  "Palazzo Montecitorio": "Palazzo Montecitorio",
  "Palazzo della Consulta": "Palazzo della Consulta",
  "Montecitorio è la Camera, Madama il Senato, Chigi il governo e la Consulta la Corte costituzionale: quattro palazzi romani che nei giornali stanno per quattro istituzioni.":
    "Montecitorio is the Chamber, Madama the Senate, Chigi the government and the Consulta the Constitutional Court: four Roman palaces that stand in the papers for four institutions.",
  "In quale palazzo si riunisce il Senato?": "In which palace does the Senate meet?",
  "Palazzo Madama, che deve il nome a Margherita d'Austria. Il Quirinale è la residenza del Presidente della Repubblica.":
    "Palazzo Madama, which owes its name to Margaret of Austria. The Quirinale is the residence of the President of the Republic.",
  "Quanti anni bisogna avere per essere eletti senatori?":
    "How old must you be to be elected a senator?",
  "Venticinque": "Twenty-five",
  "Trenta": "Thirty",
  "Quaranta": "Forty",
  "Cinquanta": "Fifty",
  "Quaranta per il Senato, venticinque per la Camera. Cinquanta è invece l'età minima per il Presidente della Repubblica.":
    "Forty for the Senate, twenty-five for the Chamber. Fifty is the minimum age for the President of the Republic instead.",
  "Quanti anni bisogna avere per essere eletti deputati?":
    "How old must you be to be elected a deputy?",
  "Diciotto": "Eighteen",
  "Venticinque. A diciotto si può votare per entrambe le camere, ma per candidarsi le soglie restano più alte.":
    "Twenty-five. At eighteen you can vote for both chambers, but the bars for standing stay higher.",
  "Quanti erano deputati e senatori elettivi prima della riforma?":
    "How many deputies and elected senators were there before the reform?",
  "500 e 250": "500 and 250",
  "630 e 315": "630 and 315",
  "700 e 350": "700 and 350",
  "400 e 200": "400 and 200",
  "Seicentotrenta e trecentoquindici, fino alla legislatura iniziata nel 2022. Quattrocento e duecento sono i numeri attuali.":
    "Six hundred and thirty and three hundred and fifteen, up to the parliament that began in 2022. Four hundred and two hundred are the numbers now.",
  "Che cosa si intende per navetta parlamentare?": "What is meant by the parliamentary shuttle?",
  "Il passaggio di un testo da una camera all'altra finché non è identico":
    "A text passing from one chamber to the other until the two agree word for word",
  "Il servizio che collega Montecitorio e Palazzo Madama":
    "The service that links Montecitorio and Palazzo Madama",
  "La sessione notturna di approvazione del bilancio": "The night sitting that passes the budget",
  "Il voto di fiducia ripetuto due volte": "A vote of confidence taken twice",
  "Una legge deve essere approvata nel medesimo testo da entrambe le camere: se una la modifica, torna all'altra. L'andirivieni può ripetersi molte volte ed è la conseguenza diretta del bicameralismo paritario.":
    "A law has to be passed in the same words by both chambers: if one changes it, it goes back to the other. The to and fro can repeat many times, and it follows directly from the two chambers having equal power.",
  "Quanto dura una legislatura?": "How long does a parliament last?",
  "Sei anni": "Six years",
  "Cinque anni, salvo scioglimento anticipato. Sette anni è la durata del mandato presidenziale, e in Italia le legislature arrivate a scadenza naturale sono una minoranza.":
    "Five years, unless it is dissolved early. Seven years is the presidential term, and in Italy the parliaments that reach their natural end are in the minority.",
  "Quante firme servono per chiedere un referendum abrogativo?":
    "How many signatures are needed to call a repealing referendum?",
  "Cinquantamila": "Fifty thousand",
  "Centomila": "A hundred thousand",
  "Cinquecentomila": "Five hundred thousand",
  "Un milione": "A million",
  "Cinquecentomila elettori, oppure cinque consigli regionali. Centomila firme servono invece per una proposta di legge di iniziativa popolare.":
    "Five hundred thousand voters, or five regional councils. A hundred thousand signatures are what a bill from the people needs instead.",
  "Quando è valido un referendum abrogativo?": "When is a repealing referendum valid?",
  "Sempre, qualunque sia l'affluenza": "Always, whatever the turnout",
  "Se partecipa la maggioranza degli aventi diritto": "If a majority of those entitled take part",
  "Se partecipa un terzo degli aventi diritto": "If a third of those entitled take part",
  "Se lo convalida la Corte costituzionale dopo il voto":
    "If the Constitutional Court confirms it after the vote",
  "Serve il quorum di metà più uno degli aventi diritto. Molti referendum sono falliti non perché il no abbia vinto, ma perché non ci si è presentati: astenersi è un modo di far cadere la consultazione.":
    "It needs half of those entitled, plus one. Many referendums have failed not because no won but because people stayed at home: abstaining is a way of bringing the vote down.",
  "Quale di queste materie NON può essere sottoposta a referendum abrogativo?":
    "Which of these subjects can NOT be put to a repealing referendum?",
  "Il diritto di famiglia": "Family law",
  "L'energia nucleare": "Nuclear energy",
  "Le leggi tributarie e di bilancio": "Tax and budget laws",
  "La legge elettorale": "The electoral law",
  "L'articolo 75 esclude leggi tributarie e di bilancio, amnistia e indulto, e la ratifica dei trattati internazionali. Divorzio, aborto e nucleare sono invece stati tutti oggetto di referendum.":
    "Article 75 rules out tax and budget laws, amnesty and pardon, and the ratification of international treaties. Divorce, abortion and nuclear power have all been put to referendum.",
  "A quale età si vota oggi per il Senato?": "At what age do you vote for the Senate today?",
  "Diciotto anni": "Eighteen",
  "Ventun anni": "Twenty-one",
  "Venticinque anni": "Twenty-five",
  "Trent'anni": "Thirty",
  "Diciotto, dalla legge costituzionale del 2021. Prima il Senato si eleggeva dai venticinque anni in su, e i più giovani avevano in mano una scheda sola.":
    "Eighteen, since the constitutional law of 2021. Before that the Senate was elected from twenty-five upwards, and the youngest voters held only one ballot paper.",
  "Quanti senatori a vita può nominare il Presidente della Repubblica?":
    "How many senators for life can the President of the Republic appoint?",
  "Nessuno": "None",
  "Fino a tre": "Up to three",
  "Fino a cinque": "Up to five",
  "Senza limite": "Without limit",
  "Fino a cinque, per altissimi meriti nel campo sociale, scientifico, artistico o letterario. Gli ex Presidenti della Repubblica non rientrano in questo numero: lo sono di diritto.":
    "Up to five, for the highest merit in social, scientific, artistic or literary life. Former Presidents of the Republic do not count in that number: they are senators for life as of right.",
  "Dove ha sede il governo italiano?": "Where does the Italian government sit?",
  "Al Quirinale": "At the Quirinale",
  "A Palazzo Chigi": "At Palazzo Chigi",
  "A Palazzo Madama": "At Palazzo Madama",
  "A Montecitorio": "At Montecitorio",
  "Palazzo Chigi. Il Quirinale è del Presidente della Repubblica: due palazzi a pochi minuti a piedi e due poteri distinti.":
    "Palazzo Chigi. The Quirinale belongs to the President of the Republic: two palaces a few minutes apart on foot, and two separate powers.",
  "Che cosa sono le consultazioni?": "What are the consultations?",
  "I sondaggi commissionati dai partiti prima del voto":
    "The polls the parties commission before an election",
  "Gli incontri del Presidente della Repubblica con i gruppi parlamentari":
    "The President of the Republic's meetings with the parliamentary groups",
  "Le riunioni del Consiglio dei ministri": "The meetings of the Council of Ministers",
  "Le audizioni dei ministri in commissione": "Ministers' hearings before a committee",
  "Prima di nominare un Presidente del Consiglio, il capo dello Stato riceve i gruppi per capire chi possa raccogliere una maggioranza. Non sono previste nel dettaglio dalla Costituzione: sono una prassi consolidata.":
    "Before appointing a President of the Council, the head of state receives the groups to work out who can gather a majority. The Constitution does not set them out in detail: they are a settled practice.",
  "Entro quanti giorni dalla formazione il governo si presenta per la fiducia?":
    "Within how many days of being formed does a government come for its vote of confidence?",
  "Sessanta": "Sixty",
  "Dieci giorni, secondo l'articolo 94. Sessanta è il termine di conversione dei decreti legge e tre il tempo minimo prima di discutere una mozione di sfiducia.":
    "Ten days, under Article 94. Sixty is the deadline for turning a decree law into law, and three the shortest wait before a motion of no confidence can be debated.",
  "Da quante camere deve ottenere la fiducia un governo?":
    "From how many chambers must a government win confidence?",
  "Solo dalla Camera dei deputati": "From the Chamber of Deputies alone",
  "Solo dal Senato": "From the Senate alone",
  "Da entrambe": "From both",
  "Da una qualsiasi delle due, a scelta del Presidente del Consiglio":
    "From either one, as the President of the Council chooses",
  "Da entrambe, ed è una conseguenza del bicameralismo paritario. Un governo che ha i numeri alla Camera ma non al Senato non può esistere: è la ragione per cui le maggioranze italiane sono spesso larghe e fragili.":
    "From both, and that follows from the two chambers having equal power. A government with the numbers in the Chamber but not in the Senate cannot exist: it is why Italian majorities are often broad and fragile.",
  "Quale articolo consente al governo il decreto legge?":
    "Which article allows the government the decree law?",
  "L'articolo 76": "Article 76",
  "L'articolo 77": "Article 77",
  "L'articolo 92": "Article 92",
  "L'articolo 77, per casi straordinari di necessità e urgenza. Il 76 riguarda il decreto legislativo su delega, il 75 il referendum abrogativo e il 92 la nomina del governo.":
    "Article 77, for extraordinary cases of necessity and urgency. 76 covers the legislative decree made under delegation, 75 the repealing referendum and 92 the appointment of the government.",
  "Che cos'è un decreto legislativo?": "What is a legislative decree?",
  "Una norma scritta dal governo su delega del Parlamento":
    "A rule written by the government under a delegation from parliament",
  "Una norma d'urgenza che vale subito": "An urgent rule that takes effect at once",
  "Un regolamento di attuazione di una legge": "A regulation putting a law into effect",
  "Una legge approvata da una sola camera": "A law passed by one chamber only",
  "Il Parlamento delega, fissando principi, criteri e un termine; il governo scrive il testo. Serve per normative lunghe e tecniche come i codici. Il decreto legge, invece, nasce dall'urgenza e non da una delega.":
    "Parliament delegates, setting principles, criteria and a deadline; the government writes the text. It is used for long technical bodies of rules such as the codes. The decree law, by contrast, is born of urgency and not of a delegation.",
  "Chi propone al Presidente della Repubblica i nomi dei ministri?":
    "Who proposes the ministers' names to the President of the Republic?",
  "I segretari dei partiti di maggioranza": "The leaders of the parties in the majority",
  "Il Presidente del Consiglio incaricato": "The President of the Council designate",
  "Il presidente della Camera": "The president of the Chamber",
  "Nessuno: li sceglie il Presidente della Repubblica da solo":
    "Nobody: the President of the Republic picks them alone",
  "L'articolo 92 dice che il Presidente della Repubblica nomina i ministri su proposta del Presidente del Consiglio. La proposta è dell'uno, la nomina dell'altro: nessuno dei due decide da solo.":
    "Article 92 says that the President of the Republic appoints the ministers on the proposal of the President of the Council. The proposal belongs to one and the appointment to the other: neither decides alone.",
  "Da quanti parlamentari deve essere firmata una mozione di sfiducia?":
    "How many members must sign a motion of no confidence?",
  "Da dieci": "Ten",
  "Da un decimo dei componenti della camera": "A tenth of the chamber's members",
  "Da un quarto": "A quarter",
  "Dalla maggioranza assoluta": "An absolute majority",
  "Un decimo dei componenti. La soglia è bassa di proposito: presentare la mozione deve essere possibile, approvarla è un'altra cosa.":
    "A tenth of the members. The bar is deliberately low: tabling the motion has to be possible; carrying it is another matter.",
  "Dopo quanto tempo dalla presentazione può essere discussa una mozione di sfiducia?":
    "How long after it is tabled can a motion of no confidence be debated?",
  "Subito": "At once",
  "Non prima di tre giorni": "Not before three days",
  "Non prima di dieci giorni": "Not before ten days",
  "Non prima di un mese": "Not before a month",
  "Tre giorni almeno. L'attesa serve a raffreddare gli animi e a dare tempo al governo di cercare i voti che gli mancano.":
    "Three days at least. The wait is there to cool tempers and to give the government time to look for the votes it lacks.",
  "Chi compone il Consiglio dei ministri?": "Who makes up the Council of Ministers?",
  "Il Presidente del Consiglio e i ministri": "The President of the Council and the ministers",
  "Il Presidente della Repubblica e i ministri": "The President of the Republic and the ministers",
  "I capigruppo parlamentari": "The leaders of the parliamentary groups",
  "I presidenti delle regioni": "The presidents of the regions",
  "Il Presidente del Consiglio e i ministri insieme formano il Consiglio dei ministri, che è l'organo collegiale del governo.":
    "The President of the Council and the ministers together form the Council of Ministers, the collective organ of the government.",
  "In che modo cadono di solito i governi italiani?": "How do Italian governments usually fall?",
  "Con un voto di sfiducia in aula": "By a vote of no confidence on the floor",
  "Per dimissioni del Presidente del Consiglio": "By the President of the Council resigning",
  "Per decisione del Presidente della Repubblica":
    "By a decision of the President of the Republic",
  "Alla scadenza naturale dei cinque anni": "At the natural end of the five years",
  "Quasi sempre per dimissioni: un partito lascia la maggioranza e il Presidente del Consiglio sale al Quirinale prima di essere messo in minoranza. Le mozioni di sfiducia approvate si contano sulle dita.":
    "Almost always by resignation: a party leaves the majority and the President of the Council goes up to the Quirinale before being outvoted. The motions of no confidence that have carried can be counted on one hand.",
  "Un regolamento del governo può contraddire una legge?":
    "Can a government regulation contradict a law?",
  "Sì, se è più recente": "Yes, if it is more recent",
  "No: attua la legge e non può andarle contro":
    "No: it puts the law into effect and cannot go against it",
  "Sì, in caso di urgenza": "Yes, in an urgent case",
  "Solo con il parere della Corte costituzionale":
    "Only with the opinion of the Constitutional Court",
  "Il regolamento sta sotto la legge nella gerarchia delle fonti: ne detta i dettagli attuativi e non può contraddirla. Per fare qualcosa con forza di legge servono il decreto legge o il decreto legislativo.":
    "A regulation stands below a law in the order of sources: it sets out the details of putting it into effect and cannot contradict it. To do something with the force of law you need the decree law or the legislative decree.",
  "Quale palazzo è la residenza del Presidente della Repubblica?":
    "Which palace is the residence of the President of the Republic?",
  "Il Viminale": "The Viminale",
  "Il Quirinale, che fu dei papi e poi dei re. Il Viminale è il Ministero dell'interno, un altro nome di palazzo che nei giornali sostituisce l'istituzione.":
    "The Quirinale, which belonged first to the popes and then to the kings. The Viminale is the interior ministry, another palace whose name stands in the papers for the institution.",
  "Qual è l'età minima per essere eletti Presidente della Repubblica?":
    "What is the minimum age to be elected President of the Republic?",
  "Quaranta anni": "Forty",
  "Quarantacinque anni": "Forty-five",
  "Sessant'anni": "Sixty",
  "Cinquant'anni, oltre alla cittadinanza italiana e al godimento dei diritti civili e politici. Quaranta è l'età minima per il Senato.":
    "Fifty, besides Italian citizenship and the enjoyment of civil and political rights. Forty is the minimum age for the Senate.",
  "Quanti delegati regionali partecipano all'elezione del Presidente?":
    "How many regional delegates take part in electing the President?",
  "Cinquantotto": "Fifty-eight",
  "Cinquantotto: tre per ogni regione e uno soltanto per la Valle d'Aosta. Si aggiungono ai deputati e ai senatori riuniti in seduta comune.":
    "Fifty-eight: three for each region and one only for the Aosta Valley. They join the deputies and senators sitting together.",
  "Quanti delegati esprime la Valle d'Aosta all'elezione presidenziale?":
    "How many delegates does the Aosta Valley send to the presidential election?",
  "Uno": "One",
  "Tre come tutte le altre": "Three, like all the others",
  "Uno solo: è l'eccezione prevista proprio per la sua dimensione. Tutte le altre diciannove regioni ne esprimono tre.":
    "One only: the exception made precisely because of its size. All the other nineteen regions send three.",
  "Quale maggioranza serve nei primi tre scrutini per eleggere il Presidente?":
    "What majority is needed in the first three ballots to elect the President?",
  "La maggioranza semplice": "A simple majority",
  "La maggioranza assoluta": "An absolute majority",
  "I due terzi": "Two thirds",
  "L'unanimità": "Unanimity",
  "Due terzi dell'assemblea nei primi tre scrutini; dal quarto basta la maggioranza assoluta. La soglia alta all'inizio spinge a cercare un nome largamente condiviso.":
    "Two thirds of the assembly in the first three ballots; from the fourth an absolute majority is enough. The high bar at the start pushes towards a name widely agreed on.",
  "Che maggioranza basta dal quarto scrutinio in poi?":
    "What majority is enough from the fourth ballot onwards?",
  "I tre quinti": "Three fifths",
  "La maggioranza dei presenti": "A majority of those present",
  "La maggioranza assoluta dei componenti. È il momento in cui l'elezione diventa possibile per una coalizione senza bisogno dell'opposizione.":
    "An absolute majority of the members. That is the moment when a coalition can elect without needing the opposition.",
  "Chi sono i franchi tiratori in un'elezione presidenziale?":
    "Who are the snipers in a presidential election?",
  "I delegati regionali che votano per ultimi": "The regional delegates who vote last",
  "I parlamentari che votano diversamente da quanto indicato dal proprio gruppo":
    "The members who vote differently from what their group has agreed",
  "I senatori a vita": "The senators for life",
  "Gli scrutatori incaricati dello spoglio": "The tellers who count the votes",
  "Il voto è segreto, e la segretezza permette di disobbedire al gruppo senza che si sappia chi è stato. Alcune elezioni sono naufragate proprio su questo, richiedendo decine di scrutini.":
    "The vote is secret, and secrecy makes it possible to disobey the group without anyone knowing who did it. Some elections have foundered on exactly that, taking dozens of ballots.",
  "Chi presiede il Consiglio superiore della magistratura?":
    "Who chairs the Higher Council of the Judiciary?",
  "Il ministro della Giustizia": "The minister of justice",
  "Il primo presidente della Cassazione": "The first president of the Court of Cassation",
  "Il presidente della Corte costituzionale": "The president of the Constitutional Court",
  "Lo presiede il capo dello Stato, come garanzia di indipendenza. Il primo presidente della Cassazione e il procuratore generale ne fanno parte di diritto, e il ministro della Giustizia non ne fa parte affatto.":
    "The head of state chairs it, as a guarantee of independence. The first president of the Court of Cassation and the prosecutor general belong to it as of right, and the minister of justice does not belong to it at all.",
  "Quanti giudici costituzionali nomina il Presidente della Repubblica?":
    "How many constitutional judges does the President of the Republic appoint?",
  "Cinque su quindici. Altri cinque li elegge il Parlamento in seduta comune e cinque vengono dalle supreme magistrature.":
    "Five out of fifteen. Parliament sitting together elects another five, and five come from the supreme courts.",
  "Per quali atti il Presidente della Repubblica può essere chiamato a rispondere?":
    "For which acts can the President of the Republic be called to answer?",
  "Per qualsiasi reato, come ogni cittadino": "For any offence, like any citizen",
  "Per alto tradimento e attentato alla Costituzione":
    "For high treason and for an attack on the Constitution",
  "Per le leggi che promulga": "For the laws they promulgate",
  "Per nessun atto, in nessun caso": "For no act, in no case",
  "Solo per questi due. Per il resto degli atti compiuti nell'esercizio delle funzioni non è responsabile: risponde il ministro che li controfirma.":
    "For those two alone. For the rest of the acts done in office they are not liable: the minister who countersigns answers for them.",
  "A che cosa serve la controfirma ministeriale?": "What is the ministerial countersignature for?",
  "A certificare la firma del Presidente": "To certify the President's signature",
  "A far assumere al ministro la responsabilità dell'atto":
    "To make the minister take responsibility for the act",
  "A rendere l'atto immediatamente esecutivo": "To make the act take effect at once",
  "A trasmettere l'atto alla Corte costituzionale": "To send the act to the Constitutional Court",
  "L'articolo 89 lega ogni atto presidenziale alla firma del ministro proponente, che se ne assume la responsabilità. È il modo di conciliare un capo dello Stato irresponsabile con un sistema in cui qualcuno deve rispondere.":
    "Article 89 ties every presidential act to the signature of the proposing minister, who takes responsibility for it. It is the way of reconciling a head of state who is not liable with a system in which somebody has to answer.",
  "Quale di questi poteri spetta al Presidente della Repubblica?":
    "Which of these powers belongs to the President of the Republic?",
  "Approvare il bilancio": "Passing the budget",
  "Concedere la grazia": "Granting a pardon",
  "Nominare i sindaci": "Appointing the mayors",
  "Fissare le aliquote fiscali": "Setting the tax rates",
  "La grazia è un potere presidenziale. Bilancio e tasse spettano al Parlamento e al governo, e i sindaci li eleggono i cittadini.":
    "The pardon is a presidential power. Budget and taxes belong to parliament and the government, and the mayors are elected by the citizens.",
  "Chi giudica il Presidente messo in stato d'accusa?":
    "Who tries a President who has been impeached?",
  "La Corte di cassazione": "The Court of Cassation",
  "Il Parlamento in seduta comune": "Parliament sitting together",
  "La Corte costituzionale integrata da sedici membri esterni":
    "The Constitutional Court with sixteen outside members added",
  "Un tribunale ordinario di Roma": "An ordinary court in Rome",
  "La Corte costituzionale, allargata a sedici giudici aggregati sorteggiati da un elenco di cittadini. Il Parlamento in seduta comune mette in stato d'accusa, ma non giudica.":
    "The Constitutional Court, widened by sixteen added judges drawn by lot from a list of citizens. Parliament sitting together impeaches, but does not try.",
  "Chi mette il Presidente in stato d'accusa?": "Who impeaches the President?",
  "La sola Camera dei deputati": "The Chamber of Deputies alone",
  "Il Consiglio dei ministri": "The Council of Ministers",
  "La Corte costituzionale d'ufficio": "The Constitutional Court, of its own motion",
  "Il Parlamento in seduta comune, a maggioranza assoluta. Poi il giudizio passa alla Corte costituzionale nella sua composizione allargata.":
    "Parliament sitting together, by an absolute majority. The trial then passes to the Constitutional Court in its widened composition.",
  "Quale articolo dichiara la magistratura autonoma e indipendente?":
    "Which article declares the judiciary autonomous and independent?",
  "L'articolo 104": "Article 104",
  "L'articolo 112": "Article 112",
  "L'articolo 104. Il 101 stabilisce che i giudici sono soggetti soltanto alla legge, il 112 l'obbligatorietà dell'azione penale e il 24 il diritto di difesa.":
    "Article 104. 101 lays down that judges are subject only to the law, 112 that prosecution is compulsory and 24 the right to a defence.",
  "A che cosa sono soggetti i giudici secondo la Costituzione?":
    "What are judges subject to under the Constitution?",
  "Al ministro della Giustizia": "To the minister of justice",
  "Soltanto alla legge": "To the law alone",
  "Alle direttive del CSM": "To the directions of the CSM",
  "Al Presidente della Repubblica": "To the President of the Republic",
  "Soltanto alla legge, dice l'articolo 101. Il CSM gestisce le carriere ma non può dire a un giudice come decidere, e il ministro non ha alcun potere sulle sentenze.":
    "To the law alone, says Article 101. The CSM runs the careers but cannot tell a judge how to decide, and the minister has no power at all over judgments.",
  "Che cosa comporta l'obbligatorietà dell'azione penale?":
    "What does compulsory prosecution mean?",
  "Che il pubblico ministero deve procedere su ogni notizia di reato":
    "That the public prosecutor has to act on every report of an offence",
  "Che ogni processo deve concludersi entro un anno": "That every trial has to end within a year",
  "Che l'imputato deve essere sempre difeso da un avvocato":
    "That the accused must always be defended by a lawyer",
  "Che ogni condanna prevede il carcere": "That every conviction means prison",
  "Ricevuta una notizia di reato, il pubblico ministero non può scegliere di lasciar perdere. In teoria elimina ogni discrezionalità politica; nella pratica, con più fascicoli che magistrati, la scelta si sposta sull'ordine delle priorità.":
    "Once a report of an offence comes in, the public prosecutor cannot choose to let it go. In theory that removes any political discretion; in practice, with more files than magistrates, the choice shifts to the order of priorities.",
  "Quale articolo stabilisce l'obbligatorietà dell'azione penale?":
    "Which article lays down that prosecution is compulsory?",
  "L'articolo 112. È uno degli articoli più discussi della Costituzione, perché la sua attuazione dipende da quante risorse ha la giustizia.":
    "Article 112. It is one of the most argued-over articles of the Constitution, because putting it into effect depends on how much the courts have to work with.",
  "Quanti gradi di giudizio prevede il sistema italiano?":
    "How many stages of judgment does the Italian system have?",
  "Primo grado, appello e Cassazione. I primi due esaminano i fatti, il terzo soltanto la corretta applicazione della legge.":
    "First instance, appeal and Cassation. The first two examine the facts, the third only whether the law was applied correctly.",
  "Quando una sentenza penale diventa definitiva?": "When does a criminal judgment become final?",
  "Alla fine del primo grado": "At the end of the first instance",
  "Dopo l'appello": "After the appeal",
  "Dopo la pronuncia della Cassazione": "After the ruling of the Court of Cassation",
  "Dopo la conferma della Corte costituzionale": "After confirmation by the Constitutional Court",
  "Passa in giudicato dopo la Cassazione. Fino ad allora vale l'articolo 27: l'imputato non è considerato colpevole. La Corte costituzionale non entra nei processi: giudica le leggi.":
    "It becomes final after Cassation. Until then Article 27 holds: the accused is not held guilty. The Constitutional Court does not enter trials: it judges laws.",
  "Dove ha sede la Corte costituzionale?": "Where does the Constitutional Court sit?",
  "A Palazzo della Consulta": "At Palazzo della Consulta",
  "Palazzo della Consulta, di fronte al Quirinale. Per questo la Corte viene chiamata semplicemente la Consulta.":
    "Palazzo della Consulta, opposite the Quirinale. That is why the Court is called simply the Consulta.",
  "Quanto dura il mandato di un giudice costituzionale?":
    "How long does a constitutional judge's term last?",
  "A vita": "For life",
  "Nove anni. Più lungo di una legislatura e del mandato presidenziale, così che nessun giudice debba qualcosa a chi lo ha nominato.":
    "Nine years. Longer than a parliament and longer than the presidential term, so that no judge owes anything to whoever appointed them.",
  "Un giudice costituzionale può essere rinominato alla scadenza?":
    "Can a constitutional judge be reappointed at the end of the term?",
  "Sì, una volta": "Yes, once",
  "Sì, senza limiti": "Yes, without limit",
  "No: il mandato non è rinnovabile": "No: the term cannot be renewed",
  "Solo se lo propone il Presidente della Repubblica":
    "Only if the President of the Republic proposes it",
  "Non è rinnovabile, ed è parte della garanzia: un giudice che non può sperare in un secondo mandato non ha ragione di compiacere chi lo ha scelto.":
    "It cannot be renewed, and that is part of the guarantee: a judge who cannot hope for a second term has no reason to please whoever chose them.",
  "Quale di questi compiti NON spetta alla Corte costituzionale?":
    "Which of these tasks does NOT belong to the Constitutional Court?",
  "Giudicare la legittimità costituzionale delle leggi": "Judging whether laws are constitutional",
  "Decidere i conflitti di attribuzione fra Stato e regioni":
    "Deciding conflicts of competence between the state and the regions",
  "Giudicare in appello i processi penali": "Hearing criminal appeals",
  "Decidere se un referendum abrogativo è ammissibile":
    "Deciding whether a repealing referendum is admissible",
  "L'appello spetta alla magistratura ordinaria. La Corte costituzionale giudica leggi, conflitti fra poteri, accuse contro il Presidente e ammissibilità dei referendum: mai un imputato.":
    "Appeals belong to the ordinary courts. The Constitutional Court judges laws, conflicts between powers, charges against the President and whether a referendum is admissible: never a defendant.",
  "Da quando perde efficacia una legge dichiarata incostituzionale?":
    "From when does a law declared unconstitutional lose its force?",
  "Dal giorno in cui era stata approvata": "From the day it was passed",
  "Dal giorno successivo alla pubblicazione della sentenza":
    "From the day after the judgment is published",
  "Dopo un anno, per dare tempo al Parlamento": "After a year, to give parliament time",
  "Solo se il Parlamento la abroga": "Only if parliament repeals it",
  "Cessa di avere efficacia dal giorno dopo la pubblicazione della decisione. Non serve alcun intervento del Parlamento: la norma esce dall'ordinamento da sola.":
    "It ceases to have force from the day after the decision is published. No step by parliament is needed: the rule leaves the legal order by itself.",
  "Chi decide trasferimenti, promozioni e provvedimenti disciplinari dei magistrati?":
    "Who decides transfers, promotions and disciplinary measures for magistrates?",
  "Il Consiglio superiore della magistratura": "The Higher Council of the Judiciary",
  "Il CSM, presieduto dal Presidente della Repubblica. Tenere queste decisioni fuori dal governo è ciò che rende concreta l'indipendenza dell'articolo 104.":
    "The CSM, chaired by the President of the Republic. Keeping these decisions out of the government's hands is what makes the independence of Article 104 real.",
  "Con quale nome viene comunemente indicata la Corte costituzionale?":
    "By what name is the Constitutional Court commonly known?",
  "La Cassazione": "The Cassation",
  "La Consulta": "The Consulta",
  "La Corte dei conti": "The Court of Auditors",
  "La Consulta, dal palazzo che la ospita. La Corte dei conti è un altro organo, che controlla la spesa pubblica.":
    "The Consulta, from the palace that houses it. The Court of Auditors is another body, which checks public spending.",
  "Quante sono le regioni italiane?": "How many Italian regions are there?",
  "Ventidue": "Twenty-two",
  "Venti, di cui cinque a statuto speciale e quindici a statuto ordinario.":
    "Twenty, of which five have a special statute and fifteen an ordinary one.",
  "In che anno è stato riformato il Titolo V della Costituzione?":
    "In which year was Title V of the Constitution reformed?",
  "Nel 1993": "In 1993",
  "Nel 2020": "In 2020",
  "Nel 2001. La riforma ha ribaltato il criterio delle competenze e ha messo lo Stato per ultimo nell'elenco degli enti della Repubblica.":
    "In 2001. The reform turned the test for competences upside down and put the state last in the list of the bodies that make up the Republic.",
  "Dopo la riforma del 2001, a chi spettano le materie non elencate nella Costituzione?":
    "After the 2001 reform, who has the subjects the Constitution does not list?",
  "Allo Stato": "The state",
  "Alle regioni": "The regions",
  "Ai comuni": "The communes",
  "Sono decise di volta in volta dalla Corte costituzionale":
    "The Constitutional Court decides case by case",
  "Alle regioni. Prima valeva il criterio opposto: le regioni potevano legiferare solo sulle materie espressamente elencate. Il ribaltamento ha però moltiplicato i conflitti davanti alla Corte.":
    "The regions. The opposite test used to apply: the regions could legislate only on the subjects expressly listed. Turning it round has, however, multiplied the disputes before the Court.",
  "Quali sono le due province autonome italiane?":
    "Which are the two autonomous Italian provinces?",
  "Trieste e Gorizia": "Trieste and Gorizia",
  "Trento e Bolzano": "Trento and Bolzano",
  "Aosta e Sondrio": "Aosta and Sondrio",
  "Cagliari e Sassari": "Cagliari and Sassari",
  "Trento e Bolzano, che dentro il Trentino-Alto Adige hanno più poteri della regione stessa. È l'assetto nato dalla tutela della minoranza di lingua tedesca.":
    "Trento and Bolzano, which inside Trentino-Alto Adige hold more power than the region itself. The arrangement grew out of protecting the German-speaking minority.",
  "Quante sono le città metropolitane?": "How many metropolitan cities are there?",
  "Quattordici": "Fourteen",
  "Quattordici, istituite dal 2015 al posto delle province nei territori dei grandi capoluoghi. Il sindaco del capoluogo ne è anche sindaco metropolitano.":
    "Fourteen, set up from 2015 in place of the provinces around the big regional capitals. The mayor of the capital is also the metropolitan mayor.",
  "Perché la Sicilia ha uno statuto speciale?": "Why does Sicily have a special statute?",
  "Perché è la regione più popolosa": "Because it is the most populous region",
  "Perché è un'isola con un forte movimento autonomista nel dopoguerra":
    "Because it is an island with a strong post-war movement for autonomy",
  "Perché ospita una minoranza linguistica riconosciuta":
    "Because it is home to a recognised linguistic minority",
  "Perché confina con uno Stato estero": "Because it borders a foreign state",
  "Lo statuto siciliano è del 1946, precedente alla Costituzione stessa: fu concesso mentre il movimento indipendentista era forte. Le altre speciali nascono da minoranze linguistiche o da confini contesi.":
    "The Sicilian statute dates from 1946, earlier than the Constitution itself: it was granted while the movement for independence was strong. The other special regions come from linguistic minorities or from contested borders.",
  "Quanti sono all'incirca i comuni italiani?": "Roughly how many Italian communes are there?",
  "Ottocento": "Eight hundred",
  "Duemila": "Two thousand",
  "Ottomila": "Eight thousand",
  "Ventimila": "Twenty thousand",
  "Circa ottomila, dalle grandi città a paesi di poche decine di abitanti. La frammentazione è tale che da anni si discute di accorpare i più piccoli.":
    "About eight thousand, from the great cities to villages of a few dozen people. The splintering is such that merging the smallest has been under discussion for years.",
  "Che cosa comporta la regola per cui consiglio e presidente regionale stanno o cadono insieme?":
    "What follows from the rule that a regional council and its president stand or fall together?",
  "Che il presidente può sciogliere il consiglio quando vuole":
    "That the president can dissolve the council at will",
  "Che se il presidente cade, si torna al voto per entrambi":
    "That if the president falls, both go back to the electorate",
  "Che il consiglio elegge il presidente fra i propri membri":
    "That the council elects the president from among its own members",
  "Che il presidente non può essere sfiduciato":
    "That the president cannot lose a vote of confidence",
  "Dimissioni, sfiducia o impedimento del presidente sciolgono anche il consiglio e portano a nuove elezioni. Serve a evitare che una regione resti anni senza guida mentre si cercano maggioranze in aula.":
    "Resignation, a vote of no confidence or the president's incapacity dissolves the council too and brings fresh elections. It is there to stop a region drifting for years without leadership while majorities are hunted on the floor.",
  "Il titolo di governatore per il presidente di una regione è ufficiale?":
    "Is the title of governor for a region's president official?",
  "Sì, è previsto dalla Costituzione": "Yes; the Constitution provides for it",
  "Sì, dal 2001": "Yes, since 2001",
  "No: è un uso giornalistico": "No: it is a usage of the press",
  "Sì, ma solo nelle regioni a statuto speciale":
    "Yes, but only in the regions with a special statute",
  "La Costituzione parla di Presidente della Giunta regionale. Governatore è entrato dall'uso dei giornali, per analogia con gli Stati americani, e non ha alcun valore giuridico.":
    "The Constitution speaks of the President of the Regional Executive. Governor came in through the newspapers, by analogy with the American states, and has no legal value at all.",
  "Chi approva le leggi regionali?": "Who passes the regional laws?",
  "Il consiglio regionale": "The regional council",
  "La giunta regionale": "The regional executive",
  "Il prefetto": "The prefect",
  "Il Parlamento nazionale": "The national parliament",
  "Il consiglio regionale legifera, la giunta governa. È la stessa distinzione che a livello nazionale corre fra Parlamento e governo.":
    "The regional council legislates and the executive governs. It is the same line that runs nationally between parliament and government.",
  "Sopra quale soglia di abitanti l'elezione del sindaco prevede il ballottaggio?":
    "Above what number of inhabitants does the election of a mayor go to a run-off?",
  "Cinquemila": "Five thousand",
  "Quindicimila": "Fifteen thousand",
  "Quindicimila abitanti. Nei comuni più piccoli si vince al primo turno con la maggioranza relativa, senza secondo turno.":
    "Fifteen thousand inhabitants. In smaller communes it is won in the first round on a simple plurality, with no second round.",
  "Chi rappresenta il governo nazionale in ogni provincia?":
    "Who represents the national government in each province?",
  "Il presidente della provincia": "The president of the province",
  "Il questore": "The questore, the provincial police chief",
  "Il sindaco del capoluogo": "The mayor of the capital town",
  "Il prefetto, che dipende dal Ministero dell'interno. È lui a ricevere le domande di cittadinanza e a firmare gli accordi di integrazione: non è un organo eletto e non appartiene all'ente locale.":
    "The prefect, who answers to the interior ministry. It is the prefect who receives applications for citizenship and signs the integration agreements: an office nobody elects, and not part of the local authority.",
  "Quale di queste materie resta di competenza esclusiva dello Stato?":
    "Which of these subjects stays within the state's exclusive competence?",
  "Il turismo": "Tourism",
  "L'agricoltura": "Agriculture",
  "L'immigrazione": "Immigration",
  "L'artigianato": "The crafts",
  "Immigrazione, difesa, moneta e giustizia sono fra le materie esclusive dello Stato. Turismo, agricoltura e artigianato ricadono invece nella competenza regionale.":
    "Immigration, defence, currency and justice are among the state's exclusive subjects. Tourism, agriculture and the crafts fall to the regions instead.",
  "A quale anno la tradizione assegna la fondazione di Roma?":
    "To which year does tradition assign the founding of Rome?",
  "753 avanti Cristo": "753 BC",
  "509 avanti Cristo": "509 BC",
  "27 avanti Cristo": "27 BC",
  "476 dopo Cristo": "AD 476",
  "Il 753 avanti Cristo, per convenzione degli storici antichi. Il 509 è la repubblica, il 27 l'inizio dell'impero e il 476 la sua fine in Occidente.":
    "753 BC, by the convention of the ancient historians. 509 is the republic, 27 the start of the empire and 476 its end in the west.",
  "Chi depone l'ultimo imperatore romano d'Occidente?":
    "Who deposes the last Roman emperor in the west?",
  "Attila": "Attila",
  "Odoacre": "Odoacer",
  "Teodorico": "Theodoric",
  "Alarico": "Alaric",
  "Odoacre depone Romolo Augustolo nel 476. Teodorico governerà l'Italia poco dopo, e Attila e Alarico avevano guidato incursioni precedenti senza deporre nessuno.":
    "Odoacer deposes Romulus Augustulus in 476. Theodoric would rule Italy soon after, and Attila and Alaric had led earlier raids without deposing anyone.",
  "In quale anno i Longobardi entrano in Italia?": "In which year do the Lombards enter Italy?",
  "Nel 568": "In 568",
  "Nel 774": "In 774",
  "Nel 1130": "In 1130",
  "Nel 568. Si insediano al centro e al nord, e resteranno fino alla sconfitta contro Carlo Magno nel 774.":
    "In 568. They settle in the centre and the north, and stay until their defeat by Charlemagne in 774.",
  "Chi sconfigge i Longobardi nel 774?": "Who defeats the Lombards in 774?",
  "Costantino": "Constantine",
  "Giustiniano": "Justinian",
  "Carlo Magno": "Charlemagne",
  "Federico Barbarossa": "Frederick Barbarossa",
  "Carlo Magno prende Pavia e assume la corona longobarda. Le terre donate al papa consolidano il nucleo dello Stato della Chiesa.":
    "Charlemagne takes Pavia and assumes the Lombard crown. The lands given to the pope harden into the core of the Papal State.",
  "Quali erano le quattro repubbliche marinare?": "Which were the four maritime republics?",
  "Amalfi, Pisa, Genova e Venezia": "Amalfi, Pisa, Genoa and Venice",
  "Napoli, Bari, Palermo e Messina": "Naples, Bari, Palermo and Messina",
  "Milano, Firenze, Siena e Lucca": "Milan, Florence, Siena and Lucca",
  "Ravenna, Rimini, Ancona e Trieste": "Ravenna, Rimini, Ancona and Trieste",
  "Amalfi, Pisa, Genova e Venezia. Costruirono flotte, colonie e banche, e portarono in Italia la contabilità moderna e la lettera di cambio.":
    "Amalfi, Pisa, Genoa and Venice. They built fleets, colonies and banks, and brought modern bookkeeping and the bill of exchange to Italy.",
  "In quale anno la Lega Lombarda sconfigge Federico Barbarossa a Legnano?":
    "In which year does the Lombard League defeat Frederick Barbarossa at Legnano?",
  "Nel 1176": "In 1176",
  "Nel 1183": "In 1183",
  "Nel 1250": "In 1250",
  "Nel 1176. La pace che ne consegue, quella di Costanza, è del 1183: la battaglia e il trattato sono due date distinte, a sette anni di distanza.":
    "In 1176. The peace that followed, at Constance, is of 1183: the battle and the treaty are two separate dates, seven years apart.",
  "Che cosa fondano i Normanni nel Sud nel 1130?":
    "What do the Normans found in the south in 1130?",
  "La Repubblica di Amalfi": "The Republic of Amalfi",
  "Il Regno di Sicilia, primo Stato accentrato d'Europa":
    "The Kingdom of Sicily, the first centralised state in Europe",
  "Il Ducato di Benevento": "The Duchy of Benevento",
  "Ruggero II unisce Sicilia e Italia meridionale in un regno con amministrazione centrale, catasto e burocrazia stabile, quando il resto d'Europa è ancora feudale.":
    "Roger II joins Sicily and southern Italy into a kingdom with a central administration, a land register and a standing bureaucracy, while the rest of Europe is still feudal.",
  "Qual è la più antica università del mondo occidentale ancora attiva?":
    "Which is the oldest university in the western world still at work?",
  "Padova": "Padua",
  "Salerno": "Salerno",
  "Bologna, dal 1088. Nasce come corporazione di studenti che assumono i propri maestri, e vi si studia soprattutto diritto.":
    "Bologna, from 1088. It began as a guild of students who hired their own masters, and what was studied there was above all law.",
  "Che cosa succede ai Comuni nel corso del Trecento?":
    "What happens to the communes in the course of the fourteenth century?",
  "Si uniscono in un regno del Nord": "They unite into a northern kingdom",
  "Vengono riassorbiti dall'impero": "The empire takes them back",
  "Le lotte fra fazioni li trasformano in signorie":
    "The struggles between factions turn them into lordships",
  "Passano tutti sotto lo Stato della Chiesa": "They all pass under the Papal State",
  "Le istituzioni comunali si logorano nelle lotte interne, e in una città dopo l'altra una famiglia prende il potere in modo stabile. Le signorie diventeranno poi principati riconosciuti.":
    "The communal institutions wear themselves out in internal fighting, and in one city after another a single family takes lasting power. The lordships would later become recognised principalities.",
  "Che cosa concede l'editto di Milano del 313?": "What does the edict of Milan of 313 grant?",
  "La cittadinanza a tutti gli abitanti dell'impero":
    "Citizenship to everyone living in the empire",
  "La libertà di culto ai cristiani": "Freedom of worship to Christians",
  "L'autonomia alle città della Padania": "Autonomy to the cities of the Po valley",
  "L'esenzione fiscale ai senatori": "Exemption from tax for senators",
  "Costantino pone fine alle persecuzioni. Per l'Italia significa l'inizio del ruolo di Roma come centro religioso, che le resterà anche quando avrà perso ogni altro potere.":
    "Constantine puts an end to the persecutions. For Italy it means the beginning of Rome's role as a religious centre, which stays with the city even once it has lost every other power.",
  "Che cosa significava in origine la parola università?":
    "What did the word university mean to begin with?",
  "Universalità del sapere": "The universality of knowledge",
  "Corporazione": "A guild",
  "Edificio pubblico": "A public building",
  "Biblioteca": "A library",
  "Indicava una corporazione, come quelle degli artigiani. A Bologna erano gli studenti a riunirsi in corporazione e ad assumere i docenti: l'esatto contrario dell'organizzazione odierna.":
    "It meant a guild, like those of the craftsmen. In Bologna it was the students who formed the guild and hired the teachers: the exact opposite of today's arrangement.",
  "Quale eredità romana è ancora l'ossatura del codice civile italiano?":
    "Which Roman legacy is still the frame of the Italian civil code?",
  "Il calendario": "The calendar",
  "Il diritto romano": "Roman law",
  "Le strade consolari": "The consular roads",
  "Il latino ecclesiastico": "Church Latin",
  "Il diritto romano, riscoperto e insegnato nelle università medievali, sta alla base del diritto civile di gran parte dell'Europa continentale.":
    "Roman law, rediscovered and taught in the medieval universities, lies under the civil law of much of continental Europe.",
  "Da che cosa deriva storicamente il campanilismo italiano?":
    "Where does Italian parish-pump loyalty come from historically?",
  "Dalla rivalità fra le squadre di calcio": "From the rivalry between football clubs",
  "Da secoli in cui la città vicina era davvero un altro Stato":
    "From centuries in which the next town really was another state",
  "Dalle divisioni introdotte dal fascismo": "From the divisions fascism introduced",
  "Dalla riforma delle regioni del 1970": "From the reform of the regions in 1970",
  "Decine di città indipendenti, ciascuna con leggi, monete e milizie proprie, a poche decine di chilometri l'una dall'altra. Il campanilismo è il residuo di quell'assetto, non un tratto caratteriale.":
    "Dozens of independent cities, each with its own laws, coins and militias, a few tens of kilometres apart. That loyalty is what remains of the arrangement, not a trait of character.",
  "Chi era Lorenzo il Magnifico?": "Who was Lorenzo the Magnificent?",
  "Un banchiere che governava Firenze senza cariche formali":
    "A banker who governed Florence without holding formal office",
  "Il duca di Milano": "The duke of Milan",
  "Un papa del Rinascimento": "A Renaissance pope",
  "Il primo re di Napoli": "The first king of Naples",
  "I Medici erano banchieri prima che signori: governavano comprando consenso, sposando alleanze e finanziando artisti, senza bisogno di un titolo.":
    "The Medici were bankers before they were lords: they governed by buying consent, marrying into alliances and paying for artists, with no need of a title.",
  "In quale anno muore Lorenzo de' Medici?": "In which year does Lorenzo de' Medici die?",
  "Nel 1454": "In 1454",
  "Nel 1492": "In 1492",
  "Nel 1513": "In 1513",
  "Nel 1527": "In 1527",
  "Nel 1492, lo stesso anno del viaggio di Colombo. Due anni dopo Carlo VIII scende in Italia e l'equilibrio che Lorenzo aveva retto crolla.":
    "In 1492, the same year as Columbus's voyage. Two years later Charles VIII comes down into Italy and the balance Lorenzo had held collapses.",
  "Chi scrive Il Principe, e in quale anno?": "Who writes Il Principe, and in which year?",
  "Machiavelli, nel 1513": "Machiavelli, in 1513",
  "Guicciardini, nel 1540": "Guicciardini, in 1540",
  "Castiglione, nel 1528": "Castiglione, in 1528",
  "Machiavelli, nel 1492": "Machiavelli, in 1492",
  "Machiavelli lo scrive nel 1513, in esilio dopo il ritorno dei Medici a Firenze. È il primo libro che osserva il potere per come funziona invece che per come dovrebbe essere.":
    "Machiavelli writes it in 1513, in exile after the Medici return to Florence. It is the first book to watch power as it works instead of as it ought to be.",
  "Che cos'è il sacco di Roma del 1527?": "What was the sack of Rome of 1527?",
  "Un'incursione dei pirati saraceni": "A raid by Saracen pirates",
  "Il saccheggio della città da parte dei lanzichenecchi imperiali":
    "The plundering of the city by the emperor's landsknechts",
  "La presa di Roma da parte dei bersaglieri": "The taking of Rome by the bersaglieri",
  "Un'epidemia di peste": "An outbreak of plague",
  "Le truppe di Carlo V, rimaste senza paga, presero e devastarono la città per mesi. Gli storici usano questa data per segnare la fine del Rinascimento come stagione fiduciosa.":
    "The troops of Charles V, left unpaid, took the city and laid it waste for months. Historians use the date to mark the end of the Renaissance as a confident age.",
  "Quale pace chiude nel 1559 le guerre d'Italia?": "Which peace closes the Italian wars in 1559?",
  "La pace di Lodi": "The peace of Lodi",
  "La pace di Costanza": "The peace of Constance",
  "La pace di Cateau-Cambrésis": "The peace of Cateau-Cambrésis",
  "La pace di Westfalia": "The peace of Westphalia",
  "Cateau-Cambrésis. Lodi era del 1454 e riguardava l'equilibrio interno; Costanza del 1183 e riguardava i Comuni; Westfalia del 1648 e riguardava la Germania.":
    "Cateau-Cambrésis. Lodi was of 1454 and concerned the balance within Italy; Constance of 1183 and concerned the communes; Westphalia of 1648 and concerned Germany.",
  "Quale potenza domina l'Italia dopo il 1559?": "Which power dominates Italy after 1559?",
  "L'Austria": "Austria",
  "L'Impero ottomano": "The Ottoman Empire",
  "La Spagna, per circa un secolo e mezzo, prima di cedere il posto all'Austria nel Settecento. Milano, Napoli, Sicilia e Sardegna passano alla corona spagnola.":
    "Spain, for about a century and a half, before giving way to Austria in the eighteenth century. Milan, Naples, Sicily and Sardinia pass to the Spanish crown.",
  "Quale istituzione diplomatica nasce nell'Italia dell'equilibrio di Lodi?":
    "Which diplomatic institution is born in the Italy of the balance of Lodi?",
  "Il congresso internazionale": "The international congress",
  "L'ambasciata permanente": "The permanent embassy",
  "Il tribunale arbitrale": "The court of arbitration",
  "Il passaporto diplomatico": "The diplomatic passport",
  "Con cinque Stati che non possono prevalere l'uno sull'altro, la diplomazia sostituisce la guerra e nasce l'idea di tenere stabilmente un rappresentante presso l'altro. L'Europa adotterà la pratica per intera.":
    "With five states none of which can prevail over the others, diplomacy takes the place of war and the idea appears of keeping a standing representative at another court. Europe would take up the practice entire.",
  "Che cosa accade a Galileo nel 1633?": "What happens to Galileo in 1633?",
  "Viene nominato matematico di corte": "He is made mathematician to the court",
  "Pubblica il primo trattato sul telescopio": "He publishes the first treatise on the telescope",
  "È processato e costretto ad abiurare": "He is tried and forced to recant",
  "Viene eletto all'Accademia della Crusca": "He is elected to the Accademia della Crusca",
  "Il processo lo costringe all'abiura e agli arresti domiciliari fino alla morte, per aver sostenuto che la Terra gira intorno al Sole.":
    "The trial forces him to recant and puts him under house arrest until his death, for having held that the Earth goes round the Sun.",
  "In quale città nasce il melodramma, intorno al 1600?":
    "In which city is opera born, around 1600?",
  "A Firenze, dagli esperimenti di un gruppo di musicisti e letterati. Diventerà la forma teatrale d'Europa, e Venezia e Napoli ne saranno poi le capitali.":
    "In Florence, out of the experiments of a group of musicians and men of letters. It would become the theatrical form of Europe, and Venice and Naples its later capitals.",
  "Quale potenza subentra alla Spagna in Italia nel Settecento?":
    "Which power takes Spain's place in Italy in the eighteenth century?",
  "La Prussia": "Prussia",
  "La Russia": "Russia",
  "L'Austria, che governerà la Lombardia e poi il Veneto fino al Risorgimento. È la potenza contro cui si combatteranno le guerre d'indipendenza.":
    "Austria, which would rule Lombardy and then the Veneto until the Risorgimento. It is the power against which the wars of independence would be fought.",
  "Perché i Medici poterono governare Firenze senza ricoprire cariche pubbliche?":
    "How could the Medici govern Florence without holding public office?",
  "Perché la legge fiorentina lo vietava ai nobili":
    "Because Florentine law forbade it to the nobility",
  "Perché il loro potere veniva dalla banca, dal credito e dalle alleanze":
    "Because their power came from the bank, from credit and from alliances",
  "Perché erano stati nominati dall'imperatore": "Because the emperor had appointed them",
  "Perché la città non aveva istituzioni": "Because the city had no institutions",
  "Erano banchieri: prestavano a chi contava, finanziavano artisti e combinavano matrimoni. Le istituzioni repubblicane restavano in piedi, ma decidevano quello che i Medici volevano.":
    "They were bankers: they lent to those who counted, paid for artists and arranged marriages. The republican institutions stayed standing, but decided what the Medici wanted.",
  "Quale famiglia governa Milano dopo i Visconti?": "Which family rules Milan after the Visconti?",
  "Gli Sforza": "The Sforza",
  "Gli Este": "The Este",
  "I Gonzaga": "The Gonzaga",
  "I Della Rovere": "The Della Rovere",
  "Gli Sforza. Gli Este erano a Ferrara e i Gonzaga a Mantova: signorie diverse in città diverse, spesso confuse fra loro.":
    "The Sforza. The Este were in Ferrara and the Gonzaga in Mantua: different lordships in different cities, often muddled with one another.",
  "Perché il Rinascimento italiano coincide con la perdita dell'indipendenza politica?":
    "Why does the Italian Renaissance coincide with the loss of political independence?",
  "Perché gli artisti lavoravano per committenti stranieri":
    "Because the artists worked for foreign patrons",
  "Perché gli Stati italiani erano troppo piccoli per reggere l'urto degli Stati nazionali":
    "Because the Italian states were too small to withstand the national states",
  "Perché la cultura assorbiva le risorse militari":
    "Because culture swallowed the military resources",
  "Perché i papi impedivano l'unificazione": "Because the popes prevented unification",
  "Cinque Stati in equilibrio bastavano finché il confronto restava interno. Davanti a Francia e Spagna, capaci di schierare eserciti grandi, nessuno di essi poteva reggere da solo.":
    "Five states in balance were enough while the contest stayed inside Italy. Faced with France and Spain, able to field great armies, none of them could stand alone.",
  "Chi fonda la Giovine Italia?": "Who founds Young Italy?",
  "Giuseppe Mazzini, dall'esilio. Voleva una repubblica unitaria fatta dal popolo, e passò la vita fuori dall'Italia che contribuì a creare.":
    "Giuseppe Mazzini, from exile. He wanted a single republic made by the people, and spent his life outside the Italy he helped to create.",
  "In quale anno nasce la Giovine Italia?": "In which year is Young Italy born?",
  "Nel 1815": "In 1815",
  "Nel 1831": "In 1831",
  "Nel 1848": "In 1848",
  "Nel 1831, a Marsiglia. Le sue insurrezioni fallirono quasi tutte, ma formarono la generazione che avrebbe fatto l'Unità.":
    "In 1831, in Marseille. Almost all its risings failed, but they formed the generation that would make the Unification.",
  "Che cosa stabilisce per l'Italia il congresso di Vienna?":
    "What does the Congress of Vienna settle for Italy?",
  "L'unificazione sotto i Savoia": "Unification under the House of Savoy",
  "Il ritorno dei sovrani cacciati da Napoleone":
    "The return of the rulers Napoleon had driven out",
  "La creazione di una confederazione italiana": "The creation of an Italian confederation",
  "L'indipendenza dello Stato della Chiesa dall'Austria":
    "The independence of the Papal State from Austria",
  "La restaurazione: l'Austria in Lombardia e Veneto, i Borbone a Napoli, il papa a Roma, i Savoia in Piemonte. L'idea nazionale però resta in circolazione.":
    "The restoration: Austria in Lombardy and the Veneto, the Bourbons in Naples, the pope in Rome, the House of Savoy in Piedmont. The national idea, though, stays in circulation.",
  "In quale anno viene concesso lo Statuto albertino?":
    "In which year is the Statuto albertino granted?",
  "Il 4 marzo 1848, nell'anno delle rivoluzioni europee. Resterà la costituzione dell'Italia unita per un secolo, fino al 1948.":
    "On 4 March 1848, in the year of the European revolutions. It would remain the constitution of a united Italy for a century, until 1948.",
  "Chi guida la spedizione dei Mille?": "Who leads the expedition of the Thousand?",
  "Giuseppe Garibaldi, con mille volontari partiti da Quarto. In pochi mesi conquistò un regno con un esercito assai più numeroso del suo.":
    "Giuseppe Garibaldi, with a thousand volunteers who set out from Quarto. In a few months he took a kingdom whose army was far larger than his own.",
  "Dove sbarcano i Mille nel maggio 1860?": "Where do the Thousand land in May 1860?",
  "A Napoli": "At Naples",
  "A Marsala": "At Marsala",
  "A Messina": "At Messina",
  "A Palermo": "At Palermo",
  "A Marsala, in Sicilia. Palermo cadde poche settimane dopo e Napoli entro l'autunno.":
    "At Marsala, in Sicily. Palermo fell a few weeks later and Naples by the autumn.",
  "Dove Garibaldi consegna a Vittorio Emanuele II il regno conquistato?":
    "Where does Garibaldi hand the conquered kingdom to Victor Emmanuel II?",
  "A Teano": "At Teano",
  "A Torino": "At Turin",
  "A Gaeta": "At Gaeta",
  "L'incontro di Teano è uno dei gesti più discussi della storia italiana: un repubblicano che consegna un regno a un re, evitando una guerra fra italiani.":
    "The meeting at Teano is one of the most argued-over acts in Italian history: a republican handing a kingdom to a king, and avoiding a war between Italians.",
  "In quale data viene proclamato il Regno d'Italia?":
    "On what date is the Kingdom of Italy proclaimed?",
  "Il 4 marzo 1848": "On 4 March 1848",
  "Il 17 marzo 1861": "On 17 March 1861",
  "Il 20 settembre 1870": "On 20 September 1870",
  "Il 17 marzo 1861. Il 20 settembre 1870 è la presa di Roma e il 2 giugno 1946 la nascita della Repubblica: tre date che si confondono facilmente.":
    "17 March 1861. 20 September 1870 is the taking of Rome and 2 June 1946 the birth of the Republic: three dates easily muddled.",
  "Quali furono, nell'ordine, le capitali del Regno d'Italia?":
    "Which, in order, were the capitals of the Kingdom of Italy?",
  "Roma, Torino, Firenze": "Rome, Turin, Florence",
  "Torino, Firenze, Roma": "Turin, Florence, Rome",
  "Milano, Torino, Roma": "Milan, Turin, Rome",
  "Torino, Milano, Roma": "Turin, Milan, Rome",
  "Torino fino al 1865, Firenze fino al 1871, poi Roma. Il nuovo Stato spostò il proprio centro tre volte in dieci anni.":
    "Turin until 1865, Florence until 1871, then Rome. The new state moved its centre three times in ten years.",
  "Perché il primo re d'Italia si chiama Vittorio Emanuele II e non I?":
    "Why is the first king of Italy called Victor Emmanuel II and not I?",
  "Perché il primo era stato suo padre": "Because the first had been his father",
  "Perché mantenne il numero che aveva come re di Sardegna":
    "Because he kept the number he had as king of Sardinia",
  "Per un errore mai corretto negli atti ufficiali":
    "Through a mistake in the official records that was never put right",
  "Perché il numero I era riservato al re longobardo":
    "Because the number I was reserved for the Lombard king",
  "Conservò la numerazione sabauda invece di ripartire da uno. È un dettaglio che dice come l'Unità fu vissuta al Sud: un'annessione al Piemonte più che una fondazione comune.":
    "He kept the Savoy numbering instead of starting again at one. It is a detail that says how the Unification was felt in the south: an annexation to Piedmont rather than a founding shared by all.",
  "Quante persone lasciarono l'Italia fra il 1861 e il 1970?":
    "How many people left Italy between 1861 and 1970?",
  "Circa otto milioni": "About eight million",
  "Circa ventisei milioni": "About twenty-six million",
  "Circa quaranta milioni": "About forty million",
  "Circa ventisei milioni, più della popolazione del paese al momento dell'Unità. È una delle emigrazioni più grandi della storia moderna.":
    "About twenty-six million, more than the country's whole population at the time of Unification. It is one of the largest emigrations in modern history.",
  "Che cosa fu il brigantaggio postunitario?":
    "What was the brigandage that followed unification?",
  "Un movimento di indipendenza siciliano": "A Sicilian movement for independence",
  "Un fenomeno insieme criminale e di rivolta sociale nel Sud, represso duramente":
    "Something at once criminal and a social revolt in the south, put down harshly",
  "La resistenza dell'esercito borbonico regolare": "The resistance of the regular Bourbon army",
  "Una rivolta contadina nel Nord contro le tasse austriache":
    "A peasant revolt in the north against Austrian taxes",
  "L'annessione portò tasse nuove, leva obbligatoria e leggi pensate per il Nord. La repressione militare che ne seguì durò anni e lasciò una ferita da cui nasce la questione meridionale.":
    "Annexation brought new taxes, compulsory conscription and laws written for the north. The military repression that followed lasted years and left a wound out of which the southern question was born.",
  "In quale anno Roma diventa parte del Regno d'Italia?":
    "In which year does Rome become part of the Kingdom of Italy?",
  "Nel 1859": "In 1859",
  "Nel 1866": "In 1866",
  "Nel 1870": "In 1870",
  "Il 20 settembre 1870, attraverso la breccia di Porta Pia. Il 1866 aveva portato il Veneto e il 1859 la Lombardia.":
    "On 20 September 1870, through the breach at Porta Pia. 1866 had brought the Veneto and 1859 Lombardy.",
  "Quale accordo segreto porta l'Italia in guerra nel 1915?":
    "Which secret agreement takes Italy into war in 1915?",
  "Il patto d'acciaio": "The Pact of Steel",
  "Il patto di Londra": "The Treaty of London",
  "La Triplice alleanza": "The Triple Alliance",
  "L'asse Roma-Berlino": "The Rome-Berlin axis",
  "Il patto di Londra, firmato con Francia, Gran Bretagna e Russia mentre l'Italia era formalmente alleata degli imperi centrali. Il patto d'acciaio è del 1939, con la Germania.":
    "The Treaty of London, signed with France, Britain and Russia while Italy was formally allied to the central powers. The Pact of Steel is of 1939, with Germany.",
  "Quanti furono all'incirca i morti italiani nella Prima guerra mondiale?":
    "Roughly how many Italians died in the First World War?",
  "Trecentomila": "Three hundred thousand",
  "Seicentomila": "Six hundred thousand",
  "Due milioni": "Two million",
  "Circa seicentomila. La guerra si combatté per tre anni e mezzo in trincea sull'Isonzo, sul Carso e sulle Alpi.":
    "About six hundred thousand. The war was fought for three and a half years in the trenches on the Isonzo, on the Carso and in the Alps.",
  "Che cosa fu Caporetto?": "What was Caporetto?",
  "La battaglia finale vinta dall'Italia": "The final battle Italy won",
  "La rotta del 1917 che portò il fronte fino al Piave":
    "The rout of 1917 that carried the front back to the Piave",
  "Il trattato di pace del 1919": "The peace treaty of 1919",
  "Il luogo della firma dell'armistizio": "The place where the armistice was signed",
  "L'offensiva austro-tedesca sfondò le linee e l'esercito arretrò di cento chilometri. Il nome è entrato nella lingua comune come sinonimo di disfatta.":
    "The Austro-German offensive broke the lines and the army fell back a hundred kilometres. The name has entered everyday speech as a byword for rout.",
  "Quale battaglia chiude per l'Italia la Prima guerra mondiale?":
    "Which battle closes the First World War for Italy?",
  "Caporetto": "Caporetto",
  "Il Piave": "The Piave",
  "Vittorio Veneto": "Vittorio Veneto",
  "Custoza": "Custoza",
  "Vittorio Veneto, nell'ottobre-novembre 1918, seguita dall'armistizio di Villa Giusti. Custoza appartiene invece alle guerre d'indipendenza.":
    "Vittorio Veneto, in October and November 1918, followed by the armistice of Villa Giusti. Custoza belongs to the wars of independence instead.",
  "In quale anno nascono i Fasci italiani di combattimento?":
    "In which year are the Fasci italiani di combattimento founded?",
  "Nel 1915": "In 1915",
  "Nel 1919": "In 1919",
  "Nel 1922": "In 1922",
  "Nel 1925": "In 1925",
  "Nel marzo 1919, a Milano. La marcia su Roma sarà tre anni dopo e le leggi fascistissime dal 1925.":
    "In March 1919, in Milan. The march on Rome would come three years later and the most fascist laws from 1925.",
  "Chi era Giacomo Matteotti?": "Who was Giacomo Matteotti?",
  "Il fondatore del Partito comunista": "The founder of the Communist Party",
  "Il deputato socialista rapito e ucciso nel 1924 dopo aver denunciato i brogli":
    "The socialist member kidnapped and killed in 1924 after denouncing the rigging of the vote",
  "Il presidente del consiglio prima di Mussolini":
    "The President of the Council before Mussolini",
  "Un generale della Grande guerra": "A general of the Great War",
  "Aveva contestato in aula la validità delle elezioni. La sua morte aprì la crisi più grave del regime nascente, superata nel gennaio 1925 con l'assunzione pubblica di responsabilità da parte di Mussolini.":
    "He had challenged the validity of the election on the floor of the house. His death opened the gravest crisis of the young regime, which passed in January 1925 when Mussolini publicly took responsibility.",
  "Che cosa furono le leggi fascistissime?":
    "What were the leggi fascistissime, the most fascist laws?",
  "Le leggi che estesero il voto alle donne": "The laws that gave women the vote",
  "I provvedimenti del 1925-26 che sciolsero i partiti e soppressero la stampa libera":
    "The measures of 1925 and 1926 that dissolved the parties and suppressed the free press",
  "Le leggi economiche del 1936": "The economic laws of 1936",
  "I decreti di guerra del 1940": "The war decrees of 1940",
  "In due anni lo Stato liberale fu smontato con leggi ordinarie, senza che lo Statuto albertino fosse mai abrogato: la dimostrazione pratica di che cosa comporti una costituzione flessibile.":
    "In two years the liberal state was taken apart by ordinary laws, without the Statuto albertino ever being repealed: a practical demonstration of what a flexible constitution allows.",
  "Che cosa stabiliscono i Patti Lateranensi del 1929?":
    "What do the Lateran Pacts of 1929 settle?",
  "L'abolizione dell'insegnamento religioso": "The abolition of religious teaching",
  "La nascita dello Stato della Città del Vaticano e la fine della questione romana":
    "The birth of the Vatican City State and the end of the Roman question",
  "L'annessione dello Stato della Chiesa al Regno":
    "The annexation of the Papal State to the Kingdom",
  "La separazione fra Stato e Chiesa sul modello francese":
    "The separation of church and state on the French model",
  "L'accordo con la Santa Sede chiuse la questione aperta nel 1870 con la presa di Roma. I Patti sono stati rivisti nel 1984 e sono richiamati dalla Costituzione.":
    "The agreement with the Holy See closed the question opened in 1870 by the taking of Rome. The Pacts were revised in 1984 and are referred to in the Constitution.",
  "Quale articolo della Costituzione richiama i Patti Lateranensi?":
    "Which article of the Constitution refers to the Lateran Pacts?",
  "L'articolo 7": "Article 7",
  "L'articolo 19": "Article 19",
  "L'articolo 7, sui rapporti fra Stato e Chiesa cattolica. L'articolo 19 garantisce invece la libertà religiosa a tutti, e fu scritto separatamente proprio per non confondere le due cose.":
    "Article 7, on relations between the state and the Catholic Church. Article 19 guarantees freedom of religion to everyone instead, and was written separately precisely so as not to muddle the two.",
  "In quale anno furono emanate le leggi razziali?": "In which year were the racial laws issued?",
  "Nel 1929": "In 1929",
  "Nel 1935": "In 1935",
  "Nel 1938": "In 1938",
  "Nel 1943": "In 1943",
  "Nel 1938. Esclusero gli ebrei italiani da scuole, professioni e vita pubblica, preparando il terreno alle deportazioni che sarebbero cominciate dopo l'occupazione tedesca.":
    "In 1938. They shut Italian Jews out of schools, professions and public life, and prepared the ground for the deportations that would begin after the German occupation.",
  "Quando entra l'Italia nella Seconda guerra mondiale?":
    "When does Italy enter the Second World War?",
  "Il 1º settembre 1939": "On 1 September 1939",
  "Il 10 giugno 1940": "On 10 June 1940",
  "Il 25 luglio 1943": "On 25 July 1943",
  "L'8 settembre 1943": "On 8 September 1943",
  "Il 10 giugno 1940, quando la Francia era quasi sconfitta e si pensava che la guerra sarebbe finita in poche settimane.":
    "On 10 June 1940, when France was all but beaten and the war was thought likely to end in a few weeks.",
  "Che cos'era la Repubblica sociale italiana?": "What was the Italian Social Republic?",
  "Il governo del Sud alleato degli angloamericani":
    "The government of the south allied to the British and Americans",
  "Lo Stato installato al centro-nord sotto controllo tedesco dopo l'8 settembre":
    "The state set up in the centre and north under German control after 8 September",
  "Il primo nome della Repubblica nata nel 1946": "The first name of the Republic born in 1946",
  "Un progetto costituzionale mai realizzato": "A constitutional plan never carried out",
  "Nacque dopo l'armistizio, con Mussolini liberato dai tedeschi. Fra il settembre 1943 e l'aprile 1945 esistono due Italie: il Regno del Sud e la Repubblica sociale al Nord.":
    "It came into being after the armistice, with Mussolini freed by the Germans. Between September 1943 and April 1945 there are two Italies: the Kingdom in the south and the Social Republic in the north.",
  "Che cosa accade il 25 luglio 1943?": "What happens on 25 July 1943?",
  "Viene annunciato l'armistizio": "The armistice is announced",
  "Il Gran consiglio mette Mussolini in minoranza e il re lo fa arrestare":
    "The Grand Council outvotes Mussolini and the king has him arrested",
  "Gli Alleati sbarcano in Sicilia": "The Allies land in Sicily",
  "Roma viene liberata": "Rome is liberated",
  "L'arresto è del 25 luglio, l'armistizio dell'8 settembre. Fra le due date passano sei settimane in cui il paese resta in guerra senza sapere da che parte.":
    "The arrest is 25 July, the armistice 8 September. Six weeks pass between them, in which the country stays at war without knowing on which side.",
  "Con quale percentuale approssimativa vinse la repubblica nel referendum del 1946?":
    "By roughly what percentage did the republic win the referendum of 1946?",
  "Circa il 45 per cento": "About 45 per cent",
  "Circa il 54 per cento": "About 54 per cent",
  "Circa il 75 per cento": "About 75 per cent",
  "Circa il 90 per cento": "About 90 per cent",
  "Poco più della metà, con un Nord largamente repubblicano e un Sud in maggioranza monarchico. Il risultato fu contestato per settimane, e la differenza stretta spiega perché.":
    "A little over half, with a largely republican north and a mostly monarchist south. The result was contested for weeks, and the narrowness of the margin explains why.",
  "Che cos'era il Comitato di liberazione nazionale?":
    "What was the National Liberation Committee?",
  "Il governo del Regno del Sud": "The government of the Kingdom in the south",
  "L'organismo che coordinava le forze della Resistenza":
    "The body that coordinated the forces of the Resistance",
  "Il comando alleato in Italia": "The Allied command in Italy",
  "L'assemblea che scrisse la Costituzione": "The assembly that wrote the Constitution",
  "Vi sedevano insieme comunisti, socialisti, democratici cristiani, liberali e azionisti. Quelle stesse forze si sarebbero combattute per decenni, ma in quel momento scrivevano insieme.":
    "Communists, socialists, Christian democrats, liberals and the Party of Action sat in it together. Those same forces would fight each other for decades, but at that moment they were writing together.",
  "Chi fu l'ultimo re d'Italia?": "Who was the last king of Italy?",
  "Vittorio Emanuele III": "Victor Emmanuel III",
  "Carlo Alberto": "Charles Albert",
  "Umberto II, che regnò poco più di un mese e lasciò il paese dopo il referendum. Vittorio Emanuele III, suo padre, aveva abdicato in suo favore poche settimane prima.":
    "Umberto II, who reigned a little over a month and left the country after the referendum. Victor Emmanuel III, his father, had abdicated in his favour a few weeks earlier.",
  "Quando si tennero le prime elezioni politiche della Repubblica?":
    "When were the first general elections of the Republic held?",
  "Il 18 aprile 1948, in un clima segnato dall'inizio della guerra fredda. Il 2 giugno 1946 si era votato per la forma dello Stato e per l'Assemblea costituente.":
    "On 18 April 1948, in a mood marked by the start of the cold war. On 2 June 1946 the vote had been on the form of the state and on the Constituent Assembly.",
  "Quale piano finanziò la ricostruzione postbellica?":
    "Which plan paid for the rebuilding after the war?",
  "Il piano Marshall": "The Marshall Plan",
  "Il piano Schuman": "The Schuman Plan",
  "Il piano Beveridge": "The Beveridge Plan",
  "Il piano Vanoni": "The Vanoni Plan",
  "Gli aiuti americani del piano Marshall. Il piano Schuman riguardava invece il carbone e l'acciaio, e da esso nascerà la prima comunità europea.":
    "The American aid of the Marshall Plan. The Schuman Plan concerned coal and steel instead, and out of it the first European community would grow.",
  "Quali città formavano il triangolo industriale del boom?":
    "Which cities made up the industrial triangle of the boom?",
  "Roma, Napoli e Bari": "Rome, Naples and Bari",
  "Torino, Milano e Genova": "Turin, Milan and Genoa",
  "Milano, Bologna e Firenze": "Milan, Bologna and Florence",
  "Venezia, Trieste e Padova": "Venice, Trieste and Padua",
  "Torino, Milano e Genova. Verso quelle fabbriche si mossero milioni di persone dal Sud e dal Nordest: la più grande migrazione interna della storia italiana.":
    "Turin, Milan and Genoa. Millions moved towards those factories from the south and the north-east: the largest internal migration in Italian history.",
  "In quale anno l'Italia firma i trattati che istituiscono la Comunità economica europea?":
    "In which year does Italy sign the treaties that set up the European Economic Community?",
  "Nel 1951": "In 1951",
  "Nel 1992": "In 1992",
  "Il 25 marzo 1957, in Campidoglio. L'Italia non aderisce all'Europa comunitaria: la fonda, e lo fa nella propria capitale.":
    "On 25 March 1957, on the Capitol. Italy does not join the Europe of the communities: it founds it, and does so in its own capital.",
  "Quanti giorni durò il sequestro di Aldo Moro?":
    "How many days did the kidnapping of Aldo Moro last?",
  "Trentatré": "Thirty-three",
  "Novanta": "Ninety",
  "Cinquantacinque giorni, dal 16 marzo al 9 maggio 1978. Nel rapimento in via Fani furono uccisi i cinque uomini della scorta.":
    "Fifty-five days, from 16 March to 9 May 1978. The five men of his escort were killed in the kidnapping in via Fani.",
  "Quante vittime causò la bomba alla stazione di Bologna nel 1980?":
    "How many people did the bomb at Bologna station kill in 1980?",
  "Diciassette": "Seventeen",
  "Quarantatré": "Forty-three",
  "Ottantacinque": "Eighty-five",
  "Centoventi": "A hundred and twenty",
  "Ottantacinque: è la strage più grave dell'Italia repubblicana. L'orologio della stazione è fermo sull'ora dell'esplosione.":
    "Eighty-five: the gravest massacre of republican Italy. The station clock is stopped at the hour of the blast.",
  "Chi erano Giovanni Falcone e Paolo Borsellino?":
    "Who were Giovanni Falcone and Paolo Borsellino?",
  "Due parlamentari dell'Assemblea costituente": "Two members of the Constituent Assembly",
  "I giudici antimafia uccisi nelle stragi del 1992":
    "The anti-mafia judges killed in the bombings of 1992",
  "I fondatori del Partito d'azione": "The founders of the Party of Action",
  "Due giornalisti dell'inchiesta Mani pulite": "Two journalists on the Mani pulite investigation",
  "Uccisi a pochi mesi di distanza nelle stragi di Capaci e di via d'Amelio, nello stesso anno in cui Mani pulite faceva crollare il sistema dei partiti.":
    "Killed a few months apart in the bombings at Capaci and in via d'Amelio, in the same year that Mani pulite was bringing the party system down.",
  "Che cosa indica l'espressione Prima Repubblica?": "What does the phrase First Republic mean?",
  "La repubblica proclamata da Mazzini a Roma nel 1849":
    "The republic Mazzini proclaimed in Rome in 1849",
  "La stagione del sistema dei partiti dal dopoguerra al 1992-94":
    "The age of the party system from the post-war years to 1992 and 1994",
  "Il periodo fra il 1946 e il 1948": "The period between 1946 and 1948",
  "Lo Stato nato dalla Resistenza al Nord": "The state born of the Resistance in the north",
  "Non è una categoria giuridica: la Costituzione è la stessa dal 1948. Indica la stagione dei partiti nati dalla Resistenza, chiusa dal biennio di Mani pulite.":
    "It is not a legal category: the Constitution has been the same since 1948. It names the age of the parties born of the Resistance, closed by the two years of Mani pulite.",
  "In quale anno arrivano le banconote in euro?": "In which year do the euro notes arrive?",
  "Nel 1999": "In 1999",
  "Nel 2002": "In 2002",
  "Nel 2004": "In 2004",
  "Le banconote e le monete circolano dal 1º gennaio 2002; dal 1999 l'euro esisteva già come moneta di conto. La lira era nata con il Regno d'Italia nel 1862.":
    "Notes and coins have circulated since 1 January 2002; from 1999 the euro already existed as money of account. The lira had been born with the Kingdom of Italy in 1862.",
  "Che cosa portò lo Statuto dei lavoratori del 1970?":
    "What did the workers' statute of 1970 bring?",
  "Le libertà costituzionali dentro i luoghi di lavoro":
    "The constitutional freedoms inside the workplace",
  "L'istituzione del salario minimo": "The creation of a minimum wage",
  "La settimana di trentacinque ore": "The thirty-five hour week",
  "L'obbligo di iscrizione al sindacato": "Compulsory union membership",
  "La legge 300 portò in fabbrica le libertà che la Costituzione garantiva fuori, e vietò il licenziamento senza giusta causa nelle imprese maggiori. Nello stesso anno nacquero le regioni a statuto ordinario.":
    "Law 300 carried into the factory the freedoms the Constitution guaranteed outside it, and forbade dismissal without good cause in the larger firms. The regions with an ordinary statute were born the same year.",
  "Quale catena montuosa percorre l'Italia da nord a sud?":
    "Which mountain range runs the length of Italy from north to south?",
  "Le Alpi": "The Alps",
  "Gli Appennini": "The Apennines",
  "I Pirenei": "The Pyrenees",
  "Gli Appennini corrono per l'intera penisola e proseguono in Sicilia. Le Alpi chiudono soltanto il lato settentrionale, e le Dolomiti ne sono una parte.":
    "The Apennines run the whole length of the peninsula and carry on into Sicily. The Alps close off only the northern side, and the Dolomites are a part of them.",
  "Qual è l'unica grande pianura italiana?": "Which is Italy's only great plain?",
  "Il Tavoliere delle Puglie": "The Tavoliere of Apulia",
  "La pianura padana": "The Po valley",
  "La Maremma": "The Maremma",
  "La piana di Catania": "The plain of Catania",
  "La pianura padana, attraversata dal Po. Le altre citate sono pianure reali ma molto più piccole: in Italia la pianura copre poco più di un quinto del territorio.":
    "The Po valley, crossed by the river Po. The others named are real plains but far smaller: in Italy flat land covers a little over a fifth of the country.",
  "Con quali Stati confina l'Italia via terra?": "Which states does Italy border on land?",
  "Francia, Svizzera, Austria e Slovenia": "France, Switzerland, Austria and Slovenia",
  "Francia, Germania, Austria e Croazia": "France, Germany, Austria and Croatia",
  "Francia, Svizzera, Germania e Slovenia": "France, Switzerland, Germany and Slovenia",
  "Svizzera, Austria, Ungheria e Croazia": "Switzerland, Austria, Hungary and Croatia",
  "Quattro Stati lungo l'arco alpino. La Germania non tocca l'Italia, e la Croazia le sta di fronte sull'Adriatico ma non confina.":
    "Four states along the Alpine arc. Germany does not touch Italy, and Croatia lies opposite across the Adriatic but shares no border.",
  "Qual è il vulcano attivo più grande d'Europa?":
    "Which is the largest active volcano in Europe?",
  "Il Vesuvio": "Vesuvius",
  "Lo Stromboli": "Stromboli",
  "L'Etna": "Etna",
  "I Campi Flegrei": "The Phlegraean Fields",
  "L'Etna, in Sicilia, che erutta più volte l'anno. Il Vesuvio è più piccolo ma più pericoloso, perché sovrasta un'area densamente abitata.":
    "Etna, in Sicily, which erupts several times a year. Vesuvius is smaller but more dangerous, because it stands over a densely settled area.",
  "Quale regione italiana non è sostanzialmente sismica?":
    "Which Italian region is essentially free of earthquakes?",
  "La Calabria": "Calabria",
  "L'Umbria": "Umbria",
  "La Sardegna": "Sardinia",
  "Il Friuli Venezia Giulia": "Friuli Venezia Giulia",
  "La Sardegna, che sta su una porzione di crosta stabile. Calabria, Umbria e Friuli hanno invece subito terremoti distruttivi in tempi recenti.":
    "Sardinia, which sits on a stable piece of crust. Calabria, Umbria and Friuli, by contrast, have all suffered destructive earthquakes in recent times.",
  "Qual è la più grande isola del Mediterraneo?":
    "Which is the largest island in the Mediterranean?",
  "Cipro": "Cyprus",
  "Creta": "Crete",
  "La Sicilia, seguita dalla Sardegna. Cipro e Creta sono più piccole di entrambe.":
    "Sicily, followed by Sardinia. Cyprus and Crete are smaller than both.",
  "Quale montagna è la vetta più alta della catena alpina?":
    "Which mountain is the highest peak in the Alpine chain?",
  "Il Monte Rosa": "Monte Rosa",
  "Il Gran Paradiso": "Gran Paradiso",
  "Il Cervino": "The Matterhorn",
  "Il Monte Bianco": "Mont Blanc",
  "Il Monte Bianco, 4.808 metri. La sovranità della cima è oggetto di una controversia mai risolta con la Francia: le carte dei due paesi non coincidono.":
    "Mont Blanc, 4,808 metres. Sovereignty over the summit is the subject of a dispute with France that has never been settled: the two countries' maps do not agree.",
  "Quanto misura all'incirca lo sviluppo costiero italiano?":
    "Roughly how long is the Italian coastline?",
  "Mille chilometri": "A thousand kilometres",
  "Tremila chilometri": "Three thousand kilometres",
  "Settemilacinquecento chilometri": "Seven thousand five hundred kilometres",
  "Quindicimila chilometri": "Fifteen thousand kilometres",
  "Circa settemilacinquecento chilometri fra penisola e isole. Nessun punto del paese è lontanissimo dal mare, e questo ha segnato cucina, commercio e storia.":
    "About seven thousand five hundred kilometres, peninsula and islands together. No point in the country is very far from the sea, and that has marked its cooking, its trade and its history.",
  "Che cosa sono i Campi Flegrei?": "What are the Phlegraean Fields?",
  "Una pianura agricola della Campania": "A farming plain in Campania",
  "Una vasta caldera vulcanica a ovest di Napoli": "A wide volcanic caldera west of Naples",
  "Un parco nazionale dell'Appennino": "A national park in the Apennines",
  "Un antico sito greco in Calabria": "An ancient Greek site in Calabria",
  "Una caldera, cioè un'ampia depressione vulcanica, densamente abitata. È sorvegliata di continuo perché il suolo si solleva e si abbassa nel fenomeno chiamato bradisismo.":
    "A caldera, that is a broad volcanic hollow, densely inhabited. It is watched constantly because the ground rises and falls in what is called bradyseism.",
  "Quale città è stata sepolta dall'eruzione del Vesuvio insieme a Pompei?":
    "Which city was buried by the eruption of Vesuvius along with Pompeii?",
  "Cuma": "Cumae",
  "Ercolano": "Herculaneum",
  "Capua": "Capua",
  "Benevento": "Benevento",
  "Ercolano, insieme a Stabia. Furono coperte da materiali diversi, e per questo a Ercolano si sono conservati anche il legno e i papiri.":
    "Herculaneum, along with Stabiae. Different material covered them, which is why wood and papyri have survived at Herculaneum too.",
  "Perché in Italia si coltiva spesso a terrazze?":
    "Why is so much land in Italy farmed in terraces?",
  "Per ragioni estetiche legate al paesaggio": "For reasons of how the landscape looks",
  "Perché la pianura è scarsa e gran parte del territorio è collinare o montuoso":
    "Because flat land is scarce and most of the country is hill or mountain",
  "Perché lo impone la normativa europea": "Because European rules require it",
  "Per proteggere le colture dal vento marino": "To shelter the crops from the sea wind",
  "La pianura copre poco più di un quinto del paese. Terrazzare i pendii è il modo con cui generazioni di agricoltori hanno reso coltivabile ciò che altrimenti non lo era.":
    "Flat land covers a little over a fifth of the country. Terracing the slopes is how generations of farmers made land workable that otherwise was not.",
  "Quale di questi è uno Stato indipendente sull'Appennino romagnolo?":
    "Which of these is an independent state in the Romagna Apennines?",
  "Il Principato di Seborga": "The Principality of Seborga",
  "La Repubblica di San Marino": "The Republic of San Marino",
  "Il Vaticano": "The Vatican",
  "Campione d'Italia": "Campione d'Italia",
  "San Marino, che si dice la più antica repubblica ancora esistente. Il Vaticano è a Roma, e Campione d'Italia è invece un comune italiano circondato dalla Svizzera.":
    "San Marino, said to be the oldest republic still in existence. The Vatican is in Rome, and Campione d'Italia is an Italian commune surrounded by Switzerland.",
  "Perché il clima italiano non può essere descritto come uno solo?":
    "Why can the Italian climate not be described as one?",
  "Perché il paese si estende per oltre mille chilometri in latitudine e ha rilievi molto diversi":
    "Because the country stretches over a thousand kilometres in latitude and its terrain varies greatly",
  "Perché le regioni misurano le temperature con metodi diversi":
    "Because the regions measure temperature by different methods",
  "Perché il Mediterraneo cambia temperatura ogni anno":
    "Because the Mediterranean changes temperature every year",
  "Perché le Alpi bloccano ogni corrente atlantica":
    "Because the Alps block every Atlantic current",
  "Fra Bolzano e Lampedusa corrono più di dieci gradi di temperatura media annua. Le Alpi hanno clima alpino, la pianura padana estati afose e nebbie, le coste clima mediterraneo.":
    "Between Bolzano and Lampedusa there are more than ten degrees of difference in the mean annual temperature. The Alps have an Alpine climate, the Po valley muggy summers and fog, and the coasts a Mediterranean one.",
  "Quale città è il principale centro economico e finanziario italiano?":
    "Which city is Italy's chief economic and financial centre?",
  "Milano, sede della borsa e della gran parte dei servizi finanziari. Roma è la capitale politica e amministrativa, Torino il centro industriale storico.":
    "Milan, home of the stock exchange and of most financial services. Rome is the political and administrative capital, Turin the historic industrial centre.",
  "Perché l'Italia non ha una sola città che concentri tutto, come Parigi o Londra?":
    "Why does Italy have no single city that gathers everything, as Paris or London do?",
  "Perché la Costituzione lo vieta": "Because the Constitution forbids it",
  "Perché per quattordici secoli ogni città è stata capitale di qualcosa":
    "Because for fourteen centuries every city was the capital of something",
  "Perché le distanze sono troppo grandi": "Because the distances are too great",
  "Perché la capitale è stata scelta solo nel 1946": "Because the capital was chosen only in 1946",
  "Senza uno Stato unico, ogni città ha avuto il proprio palazzo di governo, il proprio teatro e la propria università, e li ha conservati. Il policentrismo italiano è un'eredità storica, non una scelta amministrativa.":
    "With no single state, every city had its own seat of government, its own theatre and its own university, and kept them. Italian polycentrism is an inheritance from history, not an administrative choice.",
  "Che cosa si trova ad Agrigento, in Sicilia?": "What is at Agrigento, in Sicily?",
  "Il sito di Ercolano": "The site of Herculaneum",
  "La Reggia di Caserta": "The palace of Caserta",
  "Il Foro romano": "The Roman Forum",
  "La Valle dei Templi, con templi greci del quinto secolo avanti Cristo. La Sicilia fu Magna Grecia prima di essere romana, e in molti punti si vede.":
    "The Valley of the Temples, with Greek temples of the fifth century BC. Sicily was Magna Graecia before it was Roman, and in many places it shows.",
  "Quale sito italiano è iscritto nella lista UNESCO come patrimonio naturale e non culturale?":
    "Which Italian site is on the UNESCO list as natural and not cultural heritage?",
  "Il centro storico di Siena": "The historic centre of Siena",
  "La laguna di Venezia": "The lagoon of Venice",
  "Le Dolomiti sono iscritte per il loro valore paesaggistico e geologico. Venezia e la sua laguna sono invece un sito culturale, che comprende anche l'ambiente in cui la città sta.":
    "The Dolomites are listed for the value of their landscape and geology. Venice and its lagoon, by contrast, are a cultural site, which takes in the setting the city stands in as well.",
  "Che cosa significa che un intero centro storico è iscritto come un solo sito?":
    "What does it mean that a whole historic centre is listed as a single site?",
  "Che ogni edificio è di proprietà pubblica": "That every building is publicly owned",
  "Che il riconoscimento riguarda il complesso urbano, non i singoli monumenti":
    "That the listing covers the city as a whole, not the individual monuments",
  "Che nessun edificio può essere modificato": "That no building may be altered",
  "Che il sito è chiuso ai residenti": "That the site is closed to residents",
  "Roma, Firenze, Venezia, Napoli, Siena, Urbino e Ferrara sono iscritte così: conta il tessuto della città, non l'elenco dei suoi monumenti presi uno per uno.":
    "Rome, Florence, Venice, Naples, Siena, Urbino and Ferrara are listed that way: what counts is the fabric of the city, not a list of its monuments taken one by one.",
  "Quale città italiana è costruita su una laguna?": "Which Italian city is built on a lagoon?",
  "Genova": "Genoa",
  "Trieste": "Trieste",
  "Ravenna": "Ravenna",
  "Venezia, su un arcipelago di isolette in una laguna. La città e la laguna insieme formano un unico sito del patrimonio mondiale.":
    "Venice, on an archipelago of small islands in a lagoon. The city and the lagoon together form a single world heritage site.",
  "Che cosa si intende per aree interne?": "What is meant by the inner areas?",
  "I quartieri centrali delle grandi città": "The central districts of the big cities",
  "I territori lontani dai servizi, spesso appenninici, che si stanno spopolando":
    "The places far from services, often in the Apennines, that are emptying out",
  "Le zone industriali del Nord": "The industrial zones of the north",
  "Le regioni senza sbocco sul mare": "The regions with no coast",
  "Paesi distanti da scuole, ospedali e stazioni, dove la popolazione cala e i servizi chiudono. Sono l'esatto rovescio dell'affollamento turistico, e spesso stanno a poche decine di chilometri da esso.":
    "Villages far from schools, hospitals and stations, where the population falls and services close. They are the exact reverse of the tourist crush, and often stand a few tens of kilometres from it.",
  "Quale problema colpisce i centri storici di Venezia e Firenze?":
    "Which problem strikes the historic centres of Venice and Florence?",
  "L'abbandono da parte dei turisti": "Tourists abandoning them",
  "La diminuzione dei residenti mentre crescono gli affitti brevi":
    "Residents leaving while short lets increase",
  "La mancanza di collegamenti ferroviari": "The lack of rail links",
  "Il divieto di ristrutturare gli edifici": "The ban on renovating buildings",
  "In alcune giornate i visitatori superano gli abitanti, e chi vive in centro se ne va perché le case diventano alloggi turistici. È il rovescio del successo, e le due città lo affrontano con misure diverse.":
    "On some days visitors outnumber inhabitants, and those who live in the centre leave because the houses become tourist lodgings. It is the reverse side of success, and the two cities meet it with different measures.",
  "Quale città è considerata la capitale del Mezzogiorno?":
    "Which city is counted the capital of the Mezzogiorno?",
  "Bari": "Bari",
  "Palermo": "Palermo",
  "Catania": "Catania",
  "Napoli, capitale di un regno per secoli e oggi la maggiore città del Sud. Palermo è la capitale della Sicilia e Bari il principale porto adriatico meridionale.":
    "Naples, the capital of a kingdom for centuries and today the largest city in the south. Palermo is the capital of Sicily and Bari the chief southern port on the Adriatic.",
  "Che cosa può essere iscritto nella lista UNESCO oltre a monumenti e paesaggi?":
    "What can go on the UNESCO list besides monuments and landscapes?",
  "Nulla: la lista comprende solo beni materiali": "Nothing: the list holds only material things",
  "Anche pratiche immateriali, come un'arte o un saper fare":
    "Practices with no material form too, such as an art or a craft",
  "Solo edifici anteriori al Settecento": "Only buildings older than the eighteenth century",
  "Solo siti di proprietà statale": "Only sites owned by the state",
  "Esiste una lista del patrimonio culturale immateriale, in cui l'Italia è presente fra l'altro con l'arte del pizzaiuolo napoletano. Non tutto ciò che si tutela è fatto di pietra.":
    "There is a list of intangible cultural heritage, on which Italy appears among other things with the art of the Neapolitan pizza maker. Not everything protected is made of stone.",
  "Quale città fu il centro industriale storico dell'Italia?":
    "Which city was Italy's historic industrial centre?",
  "Verona": "Verona",
  "Torino, attorno all'automobile. Insieme a Milano e Genova formava il triangolo industriale verso cui si mosse la migrazione interna del dopoguerra.":
    "Turin, around the motor car. Together with Milan and Genoa it formed the industrial triangle towards which the post-war migration inside the country moved.",
  "In quale città si trova il porto di Roma dell'età antica?":
    "Where is the port of Rome from antiquity?",
  "A Civitavecchia": "At Civitavecchia",
  "A Ostia": "At Ostia",
  "Ad Anzio": "At Anzio",
  "Ostia antica, alla foce del Tevere. Non fu sepolta da un'eruzione ma abbandonata lentamente, e per questo si è conservata in modo diverso da Pompei.":
    "Ostia antica, at the mouth of the Tiber. It was not buried by an eruption but slowly abandoned, which is why it has survived differently from Pompeii.",
  "Che cos'è il patrimonio diffuso italiano?": "What is Italy's scattered heritage?",
  "L'insieme dei musei statali": "The whole set of state museums",
  "Le migliaia di piccoli centri storici che nessuna lista riesce a contenere":
    "The thousands of small historic centres no list can hold",
  "Il fondo per il restauro delle chiese": "The fund for restoring churches",
  "L'archivio digitale dei beni culturali": "The digital archive of cultural property",
  "Accanto ai siti iscritti c'è un patrimonio distribuito in migliaia di borghi, pievi e centri minori. È una delle ragioni per cui in Italia il paesaggio culturale non si esaurisce nelle città d'arte.":
    "Beside the listed sites there is a heritage spread across thousands of villages, country churches and small towns. It is one of the reasons why the cultural landscape of Italy does not end with the cities of art.",
  "Dove si concentra il distretto italiano dell'occhialeria?":
    "Where is the Italian eyewear district?",
  "Nel Bellunese": "Around Belluno",
  "Nel Salento": "In the Salento",
  "In Brianza": "In the Brianza",
  "Nella Valle d'Aosta": "In the Aosta Valley",
  "Nel Bellunese, in Veneto: una valle alpina che produce una quota rilevante degli occhiali venduti nel mondo. È l'esempio più citato di distretto.":
    "Around Belluno, in the Veneto: an Alpine valley that makes a sizeable share of the spectacles sold in the world. It is the most quoted example of a district.",
  "Quale distretto industriale ha sede a Sassuolo?":
    "Which industrial district has its home at Sassuolo?",
  "La meccanica di precisione": "Precision engineering",
  "La ceramica e le piastrelle": "Ceramics and tiles",
  "Le calzature": "Footwear",
  "Gli elettrodomestici": "Household appliances",
  "La ceramica, nata attorno all'argilla locale ed esportata ovunque. Le calzature stanno soprattutto nelle Marche e in Veneto.":
    "Ceramics, born around the local clay and exported everywhere. Footwear is above all in the Marche and the Veneto.",
  "Da quale tipo di imprese è composta soprattutto l'economia italiana?":
    "What kind of firms does the Italian economy mostly consist of?",
  "Da grandi gruppi industriali": "Large industrial groups",
  "Da piccole e medie imprese": "Small and medium firms",
  "Da imprese pubbliche": "State-owned firms",
  "Da multinazionali estere": "Foreign multinationals",
  "L'Italia ha pochissimi gruppi molto grandi e moltissime imprese piccole, spesso familiari. Messe insieme per territorio, funzionano come una grande azienda distribuita.":
    "Italy has very few very large groups and a great many small firms, often family ones. Taken together by area, they work like one large company spread out.",
  "Quale settore italiano esporta di più fra questi?":
    "Which of these Italian sectors exports most?",
  "La meccanica": "Engineering",
  "L'editoria": "Publishing",
  "La cantieristica navale da diporto": "Pleasure boat building",
  "L'industria mineraria": "Mining",
  "La meccanica, in particolare le macchine per il confezionamento e l'automazione, concentrate lungo la via Emilia. È la A di automazione fra le quattro dell'export.":
    "Engineering, and above all packaging and automation machinery, concentrated along the via Emilia. It is the A for automazione among the four of the export trade.",
  "Che cosa indica il divario Nord-Sud?": "What does the north-south gap mean?",
  "La differenza di clima fra le due parti del paese":
    "The difference in climate between the two halves of the country",
  "La differenza di reddito, occupazione e servizi fra Mezzogiorno e Centro-Nord":
    "The difference in income, employment and services between the Mezzogiorno and the centre and north",
  "La distanza chilometrica fra le due estremità":
    "The distance in kilometres between the two ends",
  "La diversa densità di popolazione": "The difference in how densely people live",
  "Reddito per abitante più basso, disoccupazione più alta e occupazione femminile molto minore. È la questione economica più antica del paese, aperta con l'Unità e mai chiusa.":
    "Lower income a head, higher unemployment and far fewer women in work. It is the country's oldest economic question, opened with Unification and never closed.",
  "Da che cosa deriva l'alto debito pubblico italiano?":
    "Where does Italy's high public debt come from?",
  "Dalla ricostruzione postbellica": "From the rebuilding after the war",
  "Da decenni di spesa a deficit, soprattutto negli anni Ottanta":
    "From decades of deficit spending, above all in the eighties",
  "Dall'ingresso nell'euro": "From joining the euro",
  "Dalla crisi finanziaria del 2008": "From the financial crisis of 2008",
  "Il rapporto fra debito e prodotto è cresciuto soprattutto negli anni Ottanta. Da allora serve un avanzo primario costante solo per non farlo aumentare, il che riduce lo spazio per investire.":
    "The ratio of debt to output grew above all in the eighties. Since then a steady primary surplus is needed just to keep it from rising, which leaves less room to invest.",
  "Che cosa caratterizza la demografia italiana attuale?": "What marks Italy's population today?",
  "Una natalità fra le più basse del mondo e una popolazione che invecchia":
    "One of the lowest birth rates in the world and an ageing population",
  "Una crescita rapida della popolazione giovane": "A fast-growing young population",
  "Un equilibrio stabile fra nascite e decessi": "A steady balance between births and deaths",
  "Un aumento della natalità dal 2000": "A rise in the birth rate since 2000",
  "La natalità è fra le più basse al mondo e l'età media fra le più alte d'Europa. È uno dei tre nodi aperti dell'economia, insieme al debito e alla partenza dei giovani laureati.":
    "The birth rate is among the lowest in the world and the average age among the highest in Europe. It is one of the three open knots in the economy, along with the debt and the departure of young graduates.",
  "Quale di queste è una delle quattro A dell'export italiano?":
    "Which of these is one of the four As of Italian exports?",
  "Acciaio": "Acciaio, steel",
  "Arredamento": "Arredamento, furnishing",
  "Agricoltura": "Agricoltura, farming",
  "Aeronautica": "Aeronautica, aviation",
  "Arredamento, insieme ad abbigliamento, automazione e alimentare. Le altre voci esistono nell'economia italiana ma non fanno parte della formula.":
    "Arredamento, furnishing, along with abbigliamento, clothing, automazione, automation, and alimentare, food. The other headings exist in the Italian economy but are not part of the formula.",
  "Perché piccola impresa non significa impresa arretrata?":
    "Why does a small firm not mean a backward one?",
  "Perché tutte le piccole imprese ricevono aiuti pubblici":
    "Because every small firm gets public support",
  "Perché molte sono leader mondiali nella propria nicchia specializzata":
    "Because many lead the world in their own specialised niche",
  "Perché sono esenti da imposte fino a dieci dipendenti":
    "Because they pay no tax up to ten employees",
  "Perché sono tutte di proprietà straniera": "Because they are all foreign-owned",
  "Aziende con poche decine di dipendenti fanno una cosa sola e la fanno meglio di chiunque altro al mondo. La specializzazione sostituisce la scala.":
    "Firms with a few dozen employees do one thing and do it better than anyone else in the world. Specialisation takes the place of scale.",
  "Quale fenomeno riguarda i giovani laureati italiani?":
    "What is happening to young Italian graduates?",
  "Un ritorno massiccio dall'estero": "A great return from abroad",
  "Una partenza verso altri paesi dopo la formazione":
    "A departure for other countries once they have qualified",
  "Un aumento dell'occupazione nel settore pubblico": "A rise in public sector employment",
  "Una diminuzione delle iscrizioni universitarie all'estero":
    "A fall in enrolments at universities abroad",
  "Molti lasciano il paese dopo gli studi. L'Italia forma persone che poi lavorano altrove, e questo pesa sui conti tanto quanto sull'economia.":
    "Many leave the country after studying. Italy trains people who then work elsewhere, and that weighs on the public accounts as much as on the economy.",
  "In quale zona si concentra il distretto meccanico italiano?":
    "Where is the Italian engineering district concentrated?",
  "Lungo la via Emilia": "Along the via Emilia",
  "In Sardegna": "In Sardinia",
  "Nel Molise": "In Molise",
  "Lungo la via Emilia, fra Bologna, Modena, Reggio e Parma: macchine per il packaging, motori, automazione. È il settore che esporta di più.":
    "Along the via Emilia, between Bologna, Modena, Reggio and Parma: packaging machinery, engines, automation. It is the sector that exports most.",
  "Come nascono di solito i distretti industriali italiani?":
    "How do Italian industrial districts usually come about?",
  "Da piani di sviluppo statali": "From state development plans",
  "Da un mestiere già presente sul territorio, spesso artigiano":
    "From a trade already present in the area, often a craft",
  "Dall'insediamento di multinazionali": "From multinationals moving in",
  "Da fondi europei degli anni Novanta": "From European funds in the nineties",
  "Non sono stati progettati a tavolino: sono cresciuti dove esisteva già una tradizione di bottega, e si sono specializzati passandosi il lavoro fra imprese vicine.":
    "They were not designed at a desk: they grew where a workshop tradition already stood, and specialised by passing work between neighbouring firms.",
  "Quale voce dell'economia italiana è legata direttamente al patrimonio culturale?":
    "Which part of the Italian economy is tied directly to the cultural heritage?",
  "La siderurgia": "Steelmaking",
  "La chimica di base": "Basic chemicals",
  "L'estrazione mineraria": "Mining",
  "Il turismo è una delle principali voci dell'economia, e poggia in gran parte sul patrimonio artistico e paesaggistico. Da qui anche i problemi di concentrazione nelle città d'arte.":
    "Tourism is one of the main parts of the economy, and it rests largely on the artistic and scenic heritage. Hence too the problems of crowding in the cities of art.",
  "Quale articolo della Costituzione fonda l'adesione italiana all'Unione europea?":
    "Which article of the Constitution grounds Italy's membership of the European Union?",
  "L'articolo 117": "Article 117",
  "L'articolo 11 consente le limitazioni di sovranità necessarie a un ordinamento che assicuri la pace. È lo stesso articolo che ripudia la guerra.":
    "Article 11 allows the limits on sovereignty needed for an order that secures peace. It is the same article that rejects war.",
  "Quale comunità europea nasce nel 1951 con l'Italia fra i fondatori?":
    "Which European community is born in 1951 with Italy among its founders?",
  "La CEE": "The EEC",
  "La CECA": "The ECSC",
  "L'Euratom": "Euratom",
  "L'Unione europea": "The European Union",
  "La Comunità europea del carbone e dell'acciaio. CEE ed Euratom nascono nel 1957 con i Trattati di Roma, e l'Unione europea nel 1992 a Maastricht.":
    "The European Coal and Steel Community. The EEC and Euratom are born in 1957 with the Treaties of Rome, and the European Union in 1992 at Maastricht.",
  "In quale anno l'Italia è ammessa all'ONU?":
    "In which year is Italy admitted to the United Nations?",
  "Nel 1945": "In 1945",
  "Nel 1955, dieci anni dopo la fondazione: l'ammissione era rimasta bloccata dalle tensioni della guerra fredda e fu sbloccata insieme a quella di altri paesi.":
    "In 1955, ten years after the founding: admission had been blocked by the tensions of the cold war and was released along with that of other countries.",
  "In quale città furono firmati i trattati che istituirono la CEE?":
    "In which city were the treaties that set up the EEC signed?",
  "A Bruxelles": "In Brussels",
  "A Roma": "In Rome",
  "A Parigi": "In Paris",
  "A Maastricht": "In Maastricht",
  "In Campidoglio, a Roma, il 25 marzo 1957. La sede della firma non è un dettaglio: l'Italia non è entrata in un'Europa già esistente, l'ha costruita.":
    "On the Capitol, in Rome, on 25 March 1957. Where they were signed is not a detail: Italy did not join a Europe that already existed, it built one.",
  "Da quando l'euro esiste come moneta di conto, prima delle banconote?":
    "Since when has the euro existed as money of account, before the notes?",
  "Dal 1992": "Since 1992",
  "Dal 1999": "Since 1999",
  "Dal 2002": "Since 2002",
  "Dal 2004": "Since 2004",
  "Dal 1999 i cambi sono fissati e l'euro esiste nei conti; dal 1º gennaio 2002 circolano banconote e monete. La lira era nata nel 1862.":
    "From 1999 the exchange rates are fixed and the euro exists in the accounts; from 1 January 2002 notes and coins circulate. The lira had been born in 1862.",
  "Che cos'è lo spazio Schengen?": "What is the Schengen area?",
  "L'area in cui circola l'euro": "The area where the euro circulates",
  "L'area in cui i controlli alle frontiere interne sono aboliti":
    "The area where checks at the internal borders are abolished",
  "L'unione doganale europea": "The European customs union",
  "Il mercato unico dei servizi": "The single market in services",
  "Riguarda la circolazione delle persone senza controlli alle frontiere interne. Non coincide con l'area dell'euro: alcuni paesi stanno in una e non nell'altra.":
    "It concerns people moving without checks at the internal borders. It does not coincide with the euro area: some countries are in one and not the other.",
  "Quale organizzazione con sede a Roma si occupa di aiuti alimentari d'emergenza?":
    "Which organisation based in Rome deals with emergency food aid?",
  "La FAO": "The FAO",
  "Il Programma alimentare mondiale": "The World Food Programme",
  "L'OMS": "The WHO",
  "L'UNESCO": "UNESCO",
  "Il Programma alimentare mondiale, che con FAO e IFAD fa di Roma la capitale internazionale dei temi dell'alimentazione. L'OMS sta a Ginevra e l'UNESCO a Parigi.":
    "The World Food Programme, which with the FAO and IFAD makes Rome the international capital of questions of food. The WHO is in Geneva and UNESCO in Paris.",
  "L'italiano è una delle lingue ufficiali dell'Unione europea?":
    "Is Italian one of the official languages of the European Union?",
  "No, le lingue ufficiali sono solo tre": "No; there are only three official languages",
  "Sì": "Yes",
  "Solo per i documenti che riguardano l'Italia": "Only for documents that concern Italy",
  "Solo dal 2004": "Only since 2004",
  "L'italiano è lingua ufficiale dell'Unione fin dall'inizio, come lingua di uno degli Stati fondatori: tutti gli atti vengono pubblicati anche in italiano.":
    "Italian has been an official language of the Union from the start, as the language of one of the founding states: every act is published in Italian too.",
  "Qual è oggi la comunità straniera più numerosa in Italia?":
    "Which is the largest foreign community in Italy today?",
  "Quella romena": "The Romanian one",
  "Quella cinese": "The Chinese one",
  "Quella marocchina": "The Moroccan one",
  "Quella albanese": "The Albanian one",
  "La comunità romena è la più numerosa fra i circa cinque milioni di cittadini stranieri residenti. Albanese e marocchina sono fra le più antiche per insediamento.":
    "The Romanian community is the largest among the roughly five million foreign citizens resident here. The Albanian and Moroccan are among the longest settled.",
  "Verso quali destinazioni si diresse principalmente l'emigrazione italiana?":
    "Where did Italian emigration mainly head?",
  "Verso le Americhe prima e l'Europa del Nord poi":
    "To the Americas first and northern Europe afterwards",
  "Verso l'Africa settentrionale": "To north Africa",
  "Verso l'Asia orientale": "To east Asia",
  "Verso l'Europa dell'Est": "To eastern Europe",
  "Prima Stati Uniti, Argentina e Brasile; dopo la Seconda guerra mondiale soprattutto Germania, Svizzera, Belgio e Francia. Da lì le grandi comunità di origine italiana nel mondo.":
    "First the United States, Argentina and Brazil; after the Second World War above all Germany, Switzerland, Belgium and France. Hence the great communities of Italian descent around the world.",
  "In quale decennio il saldo migratorio italiano si inverte, da paese di partenza a paese di arrivo?":
    "In which decade does Italy's migration balance turn, from a country people leave to one they arrive in?",
  "Negli anni Sessanta": "In the sixties",
  "Negli anni Ottanta": "In the eighties",
  "Negli anni Duemila": "In the two thousands",
  "Negli anni Dieci": "In the twenty-tens",
  "Negli anni Ottanta. Il paese che aveva visto partire ventisei milioni di persone comincia a riceverne, e nel giro di una generazione il dibattito pubblico cambia del tutto.":
    "In the eighties. The country that had watched twenty-six million people leave begins to receive them, and within a generation the public argument changes entirely.",
  "Di quale gruppo di grandi economie fa parte l'Italia?":
    "Which group of large economies does Italy belong to?",
  "Del G7": "The G7",
  "Del Consiglio nordico": "The Nordic Council",
  "Del Mercosur": "Mercosur",
  "Dell'ASEAN": "ASEAN",
  "Del G7 e del G20. Le altre organizzazioni citate riuniscono paesi di altre aree del mondo.":
    "The G7 and the G20. The other organisations named gather countries from other parts of the world.",
  "Perché la posizione geografica rende l'Italia una frontiera esterna dell'Unione europea?":
    "Why does its position make Italy an external frontier of the European Union?",
  "Perché confina con quattro Stati non europei": "Because it borders four non-European states",
  "Perché si estende al centro del Mediterraneo, fra Europa e Africa":
    "Because it reaches into the middle of the Mediterranean, between Europe and Africa",
  "Perché non fa parte dello spazio Schengen": "Because it is not part of the Schengen area",
  "Perché ha il litorale più corto dell'Unione":
    "Because it has the shortest coastline in the Union",
  "La penisola e le isole si spingono verso sud fino a Lampedusa, più vicina all'Africa che alla Sicilia. Da qui il ruolo dell'Italia nel dibattito europeo sulle frontiere marittime.":
    "The peninsula and the islands push south as far as Lampedusa, closer to Africa than to Sicily. Hence Italy's part in the European argument about sea frontiers.",
  "Che cosa significa la sigla CCNL?": "What does the abbreviation CCNL stand for?",
  "Contratto collettivo nazionale di lavoro":
    "Contratto collettivo nazionale di lavoro, the national collective agreement",
  "Consiglio consultivo nazionale del lavoro": "A national advisory council on labour",
  "Codice civile nazionale del lavoro": "A national civil code of labour",
  "Cassa contributiva nazionale dei lavoratori": "A national contributions fund for workers",
  "Il contratto collettivo nazionale di lavoro, firmato per ciascun settore dalle organizzazioni dei datori e dai sindacati. In Italia le condizioni minime si fissano per settore, non per azienda.":
    "The contratto collettivo nazionale di lavoro, signed for each sector by the employers' organisations and the unions. In Italy the minimum terms are set by sector, not by firm.",
  "Quale articolo della Costituzione richiede una retribuzione sufficiente a un'esistenza libera e dignitosa?":
    "Which article of the Constitution requires pay enough for a free and dignified life?",
  "L'articolo 4": "Article 4",
  "L'articolo 36": "Article 36",
  "L'articolo 36. L'articolo 4 riconosce il diritto al lavoro e il 40 il diritto di sciopero: tre articoli spesso citati insieme e facili da scambiare.":
    "Article 36. Article 4 recognises the right to work and 40 the right to strike: three articles often cited together and easily swapped.",
  "Quale ente incassa i contributi previdenziali e paga le pensioni?":
    "Which body collects the social insurance contributions and pays the pensions?",
  "L'INAIL": "INAIL",
  "L'INPS": "INPS",
  "L'Agenzia delle entrate": "The revenue agency",
  "Il Ministero del lavoro": "The ministry of labour",
  "L'INPS. L'INAIL assicura invece contro gli infortuni sul lavoro e le malattie professionali: due enti distinti che accompagnano ogni rapporto di lavoro.":
    "INPS. INAIL insures against accidents at work and occupational illness instead: two separate bodies that go with every job.",
  "Contro che cosa assicura l'INAIL?": "What does INAIL insure against?",
  "Contro la disoccupazione": "Against unemployment",
  "Contro gli infortuni sul lavoro e le malattie professionali":
    "Against accidents at work and occupational illness",
  "Contro il fallimento dell'azienda": "Against the firm going under",
  "Contro i danni a terzi": "Against damage to others",
  "Infortuni e malattie professionali. L'indennità di disoccupazione è invece pagata dall'INPS.":
    "Accidents and occupational illness. Unemployment benefit is paid by INPS instead.",
  "Quali sono le tre confederazioni sindacali storiche italiane?":
    "Which are the three historic Italian union confederations?",
  "CGIL, CISL e UIL": "CGIL, CISL and UIL",
  "CGIL, INPS e INAIL": "CGIL, INPS and INAIL",
  "CISL, CNEL e UIL": "CISL, CNEL and UIL",
  "UIL, CCNL e CGIL": "UIL, CCNL and CGIL",
  "CGIL, CISL e UIL, nate dalla scissione del sindacato unitario del dopoguerra lungo linee politiche. INPS e INAIL sono enti pubblici, e il CNEL è un organo di consulenza.":
    "CGIL, CISL and UIL, born when the single post-war union split along political lines. INPS and INAIL are public bodies, and the CNEL is an advisory organ.",
  "Quante settimane di ferie retribuite spettano come minimo ogni anno?":
    "How many weeks of paid holiday are the minimum each year?",
  "Quattro settimane, di cui almeno due da godere nell'anno di maturazione. I contratti collettivi possono prevederne di più, mai di meno.":
    "Four weeks, of which at least two have to be taken in the year they are earned. Collective agreements can give more, never less.",
  "Che cosa distingue il lavoro con partita IVA?": "What sets working with a VAT number apart?",
  "Si riceve una busta paga come i dipendenti": "You get a payslip like an employee",
  "Si emette fattura e si versano da sé imposte e contributi":
    "You issue an invoice and pay your own tax and contributions",
  "Il datore paga tutti i contributi": "The employer pays all the contributions",
  "Non si pagano imposte sul reddito": "You pay no income tax",
  "È lavoro autonomo: niente busta paga, niente ferie retribuite e nessuna trattenuta a monte. Imposte e contributi li versa direttamente chi lavora.":
    "It is self-employment: no payslip, no paid holiday and nothing deducted at source. Tax and contributions are paid directly by the person doing the work.",
  "Che cosa serve per licenziare un dipendente a tempo indeterminato?":
    "What is needed to dismiss an employee on a permanent contract?",
  "Nulla: basta il preavviso": "Nothing: notice is enough",
  "Una giusta causa o un giustificato motivo": "A just cause or a justified reason",
  "L'autorizzazione del sindacato": "The union's authorisation",
  "Il consenso dell'ispettorato del lavoro": "The labour inspectorate's consent",
  "Il tempo indeterminato non rende impossibile il licenziamento: lo condiziona a una ragione riconosciuta. Senza di essa il provvedimento è impugnabile davanti al giudice del lavoro.":
    "A permanent contract does not make dismissal impossible: it makes it conditional on a recognised reason. Without one the decision can be challenged before the labour court.",
  "Che cos'è l'apprendistato?": "What is an apprenticeship?",
  "Un periodo di prova non retribuito": "An unpaid trial period",
  "Un contratto che unisce lavoro e formazione, rivolto ai giovani":
    "A contract that joins work and training, aimed at young people",
  "Un tirocinio universitario obbligatorio": "A compulsory university placement",
  "Un corso serale organizzato dalle regioni": "An evening course run by the regions",
  "È un vero contratto di lavoro, retribuito, che affianca alla prestazione un percorso formativo, con contributi ridotti per il datore.":
    "It is a real contract of employment, paid, which sets a course of training alongside the work, with reduced contributions for the employer.",
  "In che anno è stato approvato lo Statuto dei lavoratori?":
    "In which year was the workers' statute passed?",
  "Nel 1970, la legge 300. Portò le libertà costituzionali dentro i luoghi di lavoro e limitò il licenziamento nelle imprese maggiori. Il 1978 è invece l'anno del Servizio sanitario nazionale.":
    "In 1970, law 300. It carried the constitutional freedoms into the workplace and limited dismissal in the larger firms. 1978 is the year of the national health service instead.",
  "Perché il contratto a tempo determinato ha limiti di durata e di rinnovo?":
    "Why does a fixed-term contract have limits on length and renewal?",
  "Per ridurre il costo del lavoro": "To lower the cost of labour",
  "Per impedire che diventi un rapporto permanente senza le tutele di uno stabile":
    "To stop it becoming a permanent job without the protections of a permanent one",
  "Per favorire le assunzioni stagionali": "To encourage seasonal hiring",
  "Per uniformarsi a un regolamento europeo del 2001":
    "To fall in line with a European regulation of 2001",
  "Senza limiti si potrebbe tenere una persona a termine per tutta la vita lavorativa. I tetti servono a evitare che la precarietà diventi la forma normale del rapporto.":
    "Without limits someone could be kept on fixed terms for a whole working life. The caps are there so that insecurity does not become the normal shape of a job.",
  "Che cosa sono i contributi previdenziali in busta paga?":
    "What are the social insurance contributions on a payslip?",
  "Una tassa sul reddito": "A tax on income",
  "Le somme versate all'INPS che costruiscono il diritto alla pensione":
    "The sums paid to INPS that build up the right to a pension",
  "Un contributo volontario al sindacato": "A voluntary payment to the union",
  "Un accantonamento restituito ogni anno": "A sum set aside and returned each year",
  "Sono la differenza principale fra lordo e netto insieme all'IRPEF, e non sono un'imposta: costruiscono la posizione previdenziale di chi lavora.":
    "They are the main difference between gross and net, along with income tax, and they are not a tax: they build the worker's own pension record.",
  "Quale conseguenza ha l'assenza di un salario minimo legale in Italia?":
    "What follows from Italy having no statutory minimum wage?",
  "Che nessun lavoratore ha un minimo garantito": "That no worker has a guaranteed minimum",
  "Che il minimo dipende dal contratto collettivo applicato, e chi non ne ha uno resta scoperto":
    "That the minimum depends on the collective agreement that applies, and anyone without one is left uncovered",
  "Che i minimi li fissa ogni regione": "That each region sets the minimum",
  "Che il minimo è stabilito ogni anno dal bilancio dello Stato":
    "That the minimum is set each year by the state budget",
  "I minimi stanno nei CCNL, che coprono la gran parte ma non la totalità dei rapporti. Chi lavora in un settore senza contratto applicato non ha quella protezione: è la ragione per cui il tema si discute da anni.":
    "The minimums sit in the CCNL, which cover most but not all jobs. Anyone working in a sector with no agreement in force lacks that protection: which is why the question has been argued over for years.",
  "Come è finanziato il Servizio sanitario nazionale?":
    "How is the national health service paid for?",
  "Con premi assicurativi individuali": "By individual insurance premiums",
  "Con la fiscalità generale": "Out of general taxation",
  "Con i contributi versati dai soli lavoratori dipendenti":
    "By contributions from employees alone",
  "Con i ticket pagati dai pazienti": "By the charges patients pay",
  "Dalle tasse, non da un premio assicurativo. È la differenza di fondo rispetto al vecchio sistema delle casse mutue, in cui la copertura dipendeva dalla categoria professionale.":
    "Out of taxes, not out of an insurance premium. That is the deep difference from the old system of mutual funds, in which cover depended on your trade.",
  "Chi gestisce concretamente la sanità in Italia?": "Who actually runs health care in Italy?",
  "Lo Stato centrale": "The central state",
  "Le regioni": "The regions",
  "I comuni": "The communes",
  "Le province": "The provinces",
  "Le regioni organizzano aziende sanitarie e ospedali. Da qui differenze reali di attesa e organizzazione, e la mobilità sanitaria di chi si sposta per curarsi.":
    "The regions organise the health authorities and the hospitals. Hence real differences in waiting and organisation, and the movement of people who travel to be treated.",
  "Chi è il primo riferimento sanitario per un residente in Italia?":
    "Who is a resident's first point of medical contact in Italy?",
  "Il pronto soccorso": "The emergency department",
  "Lo specialista ospedaliero": "The hospital specialist",
  "Il farmacista": "The pharmacist",
  "Il medico di medicina generale, che si sceglie fra quelli disponibili nella propria zona: visita, prescrive e indirizza allo specialista.":
    "The general practitioner, chosen from those available in your area: they examine, prescribe and refer you to a specialist.",
  "Con quale criterio si viene ricevuti al pronto soccorso?":
    "On what basis are you seen in the emergency department?",
  "In ordine di arrivo": "In order of arrival",
  "In ordine di gravità": "In order of seriousness",
  "In base all'età": "By age",
  "In base alla residenza": "By where you live",
  "I codici di priorità stabiliscono chi passa prima: una persona arrivata dopo può essere ricevuta per prima se la sua condizione è più grave.":
    "The priority codes decide who goes first: someone who arrived later can be seen first if their condition is more serious.",
  "Che cos'è il ticket sanitario?": "What is the health charge?",
  "Il costo pieno di una visita privata": "The full cost of a private appointment",
  "Una quota a carico del paziente per alcune prestazioni, con esenzioni":
    "A share the patient pays for certain services, with exemptions",
  "Un abbonamento annuale al servizio sanitario": "A yearly subscription to the health service",
  "La tassa regionale sulla salute": "The regional health tax",
  "Una compartecipazione alla spesa, con esenzioni per reddito, età e patologia. Le prestazioni urgenti al pronto soccorso non si pagano.":
    "A share of the cost, with exemptions for income, age and illness. Urgent care in the emergency department is not charged for.",
  "Che cosa sostituì il Servizio sanitario nazionale nel 1978?":
    "What did the national health service replace in 1978?",
  "Le assicurazioni private obbligatorie": "Compulsory private insurance",
  "Le casse mutue legate alla categoria professionale": "The mutual funds tied to your trade",
  "Gli ospedali gestiti dalle province": "Hospitals run by the provinces",
  "Il sistema di assistenza comunale": "The system of communal assistance",
  "Prima del 1978 la copertura dipendeva dal mestiere: ciascuna categoria aveva la propria cassa, e chi non rientrava in nessuna restava scoperto.":
    "Before 1978 cover depended on your trade: each category had its own fund, and anyone who fitted none was left uncovered.",
  "Quanti anni dura la scuola primaria italiana?":
    "How many years does Italian primary school last?",
  "Cinque anni, dai sei agli undici. Seguono tre anni di secondaria di primo grado e cinque di secondaria di secondo grado.":
    "Five years, from six to eleven. Three years of lower secondary follow, and five of upper secondary.",
  "Quanti anni dura la scuola secondaria di primo grado?":
    "How many years does lower secondary school last?",
  "Tre anni, quelle che tutti chiamano medie, e si chiudono con un esame. La secondaria di secondo grado dura invece cinque anni.":
    "Three years, what everyone calls the medie, and they end with an examination. Upper secondary lasts five years instead.",
  "Fra quali indirizzi si sceglie per la scuola secondaria di secondo grado?":
    "Which paths can you choose between for upper secondary school?",
  "Liceo, istituto tecnico e istituto professionale":
    "The liceo, the technical institute and the vocational institute",
  "Liceo classico e liceo scientifico soltanto": "The classical and the scientific liceo only",
  "Scuola pubblica e scuola paritaria": "State school and state-recognised private school",
  "Percorso breve e percorso lungo": "A short path and a long one",
  "Tre indirizzi, e la scelta si fa a tredici anni. Tutti e tre portano a un diploma che dà accesso all'università: il liceo non è la scuola superiore in generale, è uno dei tre.":
    "Three paths, and the choice is made at thirteen. All three lead to a diploma that opens the university: the liceo is not upper secondary school in general, it is one of the three.",
  "Come si chiama ufficialmente l'esame che chiude la scuola superiore?":
    "What is the examination that ends upper secondary school officially called?",
  "Maturità": "Maturità",
  "Esame di Stato": "Esame di Stato, the state examination",
  "Diploma nazionale": "A national diploma",
  "Esame di ammissione": "An entrance examination",
  "Ufficialmente esame di Stato; maturità è il nome con cui lo chiamano tutti. Si valuta in centesimi, con sessanta come minimo.":
    "Officially the esame di Stato; maturità is what everybody calls it. It is marked out of a hundred, with sixty as the pass.",
  "Su quale scala si valuta il voto finale di laurea?":
    "On what scale is a final degree mark given?",
  "In centodecimi, con centodieci e lode come massimo. I trentesimi valgono per i singoli esami e i centesimi per la maturità.":
    "Out of a hundred and ten, with a hundred and ten with distinction as the top. Individual examinations are marked out of thirty, and the maturità out of a hundred.",
  "Quali corsi universitari sono a ciclo unico, senza triennale e magistrale separate?":
    "Which university courses run as a single cycle, with no separate first degree and master's?",
  "Economia e ingegneria": "Economics and engineering",
  "Medicina, giurisprudenza e architettura": "Medicine, law and architecture",
  "Lettere e filosofia": "Letters and philosophy",
  "Scienze politiche e sociologia": "Political science and sociology",
  "Medicina, giurisprudenza e architettura seguono un percorso unico più lungo. Gli altri corsi si articolano in una laurea triennale seguita da una magistrale biennale.":
    "Medicine, law and architecture follow one longer path. The other courses divide into a three-year degree followed by a two-year master's.",
  "A che cosa serve la tessera sanitaria, oltre a dare accesso alle prestazioni?":
    "What is the health card for, besides giving access to treatment?",
  "A votare alle elezioni regionali": "For voting in regional elections",
  "A riportare il codice fiscale e a valere come tessera europea di assicurazione malattia":
    "For carrying the codice fiscale, the tax code, and serving as the European health insurance card",
  "A ottenere sconti sui trasporti pubblici": "For discounts on public transport",
  "A dimostrare la residenza": "For proving where you live",
  "Porta il codice fiscale sul fronte e sul retro è la tessera europea che consente l'assistenza negli altri Stati dell'Unione.":
    "It carries the codice fiscale on the front, and on the back it is the European card that allows treatment in the other states of the Union.",
  "Da quanti caratteri è composto il codice fiscale?":
    "How many characters make up the codice fiscale?",
  "Undici": "Eleven",
  "Tredici": "Thirteen",
  "Sedici": "Sixteen",
  "Sedici caratteri ricavati da nome, cognome, data e luogo di nascita. Undici è la lunghezza della partita IVA, che è un'altra cosa.":
    "Sixteen characters drawn from your first name, surname, date and place of birth. Eleven is the length of the VAT number, which is another thing entirely.",
  "Che cos'è la residenza anagrafica?": "What is registered residence?",
  "L'indirizzo indicato nel contratto di lavoro": "The address given in a contract of employment",
  "L'iscrizione all'anagrafe del comune in cui si abita davvero":
    "Being entered in the register of the commune where you actually live",
  "Il luogo di nascita registrato sul certificato":
    "The place of birth recorded on the certificate",
  "L'indirizzo del proprio datore di lavoro": "Your employer's address",
  "Da essa dipendono carta d'identità, medico di base, iscrizione a scuola e, per i cittadini dell'Unione, il voto alle comunali.":
    "The identity card, the family doctor, school enrolment and, for citizens of the Union, the vote in local elections all depend on it.",
  "A quale autorità si chiede il permesso di soggiorno?":
    "Which authority do you apply to for a permesso di soggiorno?",
  "Al comune": "The commune",
  "Alla questura": "The questura, the provincial police headquarters",
  "Alla regione": "The region",
  "All'ambasciata": "The embassy",
  "Alla questura, presentando la domanda tramite gli uffici postali abilitati. L'accordo di integrazione si firma invece allo sportello unico presso la prefettura.":
    "The questura, with the application handed in through the post offices set up for it. The integration agreement is signed at the single desk in the prefecture instead.",
  "Quale livello di italiano serve per il permesso di soggiorno UE per soggiornanti di lungo periodo?":
    "What level of Italian is needed for the EU long-term permesso di soggiorno?",
  "B2": "B2",
  "A2, dimostrato con un test. Il B1 serve invece per la domanda di cittadinanza: due soglie diverse per due procedure diverse.":
    "A2, shown by a test. B1 is what the citizenship application needs instead: two different bars for two different procedures.",
  "Quanti anni di soggiorno regolare servono come minimo per il permesso di lungo periodo?":
    "How many years of lawful residence are the minimum for the long-term permit?",
  "Cinque anni, insieme a un reddito e al test di italiano A2. Dieci anni è invece il termine ordinario per chiedere la cittadinanza per residenza.":
    "Five years, along with an income and the A2 test in Italian. Ten years is the ordinary term for asking for citizenship by residence instead.",
  "Quanti crediti si ricevono alla firma dell'accordo di integrazione?":
    "How many credits do you get on signing the integration agreement?",
  "Sedici crediti iniziali, da mantenere o accrescere in due anni, prorogabili di uno. Azzerarli comporta la revoca del permesso di soggiorno.":
    "Sixteen credits to start with, to be kept or increased over two years, extendable by one. Losing them all means the permesso di soggiorno is withdrawn.",
  "Entro quanto tempo dalla firma dell'accordo si partecipa alla sessione di formazione civica?":
    "How soon after signing the agreement do you attend the session on civic life?",
  "Entro un mese": "Within a month",
  "Entro tre mesi": "Within three months",
  "Entro un anno": "Within a year",
  "Non è prevista": "There is no such session",
  "Entro tre mesi. Non è un esame: la partecipazione dà crediti, e la sessione riguarda ordinamento, diritti e doveri e accesso ai servizi.":
    "Within three months. It is not an examination: attending earns credits, and the session covers the system of government, rights and duties and how to reach the services.",
  "Che cosa si verifica alla scadenza dell'accordo di integrazione?":
    "What is checked when the integration agreement runs out?",
  "Un esame scritto di storia italiana": "A written examination in Italian history",
  "La conoscenza dell'italiano parlato almeno all'A2 e una conoscenza sufficiente della vita civile":
    "Spoken Italian at A2 at least, and enough knowledge of civic life",
  "Il possesso di un contratto di lavoro a tempo indeterminato":
    "Holding a permanent contract of employment",
  "La frequenza di un corso universitario": "Attendance at a university course",
  "Non esiste alcun esame di educazione civica: si verificano il livello linguistico e una conoscenza sufficiente della cultura civica e della vita civile in Italia.":
    "There is no examination in civics: what is checked is the level of language and enough knowledge of civic culture and of civic life in Italy.",
  "Quanti anni di residenza servono ordinariamente a un cittadino non dell'Unione per chiedere la cittadinanza?":
    "How many years of residence does a citizen from outside the Union ordinarily need to apply for citizenship?",
  "Dieci anni. Il termine è più breve per i cittadini dell'Unione, per i rifugiati e per chi è nato in Italia.":
    "Ten years. The term is shorter for citizens of the Union, for refugees and for those born in Italy.",
  "Per quali vie si può ottenere la cittadinanza italiana?":
    "By what routes can Italian citizenship be obtained?",
  "Solo per nascita sul territorio": "Only by birth on the territory",
  "Per discendenza, per matrimonio o per residenza": "By descent, by marriage or by residence",
  "Solo per matrimonio": "Only by marriage",
  "Solo per decreto del Presidente della Repubblica":
    "Only by decree of the President of the Republic",
  "Le tre vie ordinarie. La nascita sul territorio da sola non basta: l'Italia non applica il principio dello ius soli puro.":
    "The three ordinary routes. Birth on the territory alone is not enough: Italy does not apply pure ius soli.",
  "Da quale anno la domanda di cittadinanza richiede un certificato di lingua?":
    "Since which year has a citizenship application needed a language certificate?",
  "Dal 2012": "Since 2012",
  "Dal 2018": "Since 2018",
  "Dal 2022": "Since 2022",
  "Dal 2018. L'accordo di integrazione, che è cosa diversa e riguarda il permesso di soggiorno, era invece entrato in vigore nel 2012.":
    "Since 2018. The integration agreement, which is a different thing and concerns the permesso di soggiorno, came into force in 2012 instead.",
  "Che cosa serve per accedere ai servizi pubblici online in Italia?":
    "What do you need to reach public services online in Italy?",
  "Un'identità digitale come SPID o la carta d'identità elettronica":
    "A digital identity such as SPID, or the electronic identity card",
  "Il solo codice fiscale": "The codice fiscale alone",
  "Un indirizzo di posta elettronica certificata": "A certified email address",
  "La tessera sanitaria scaduta": "An expired health card",
  "Senza SPID o carta d'identità elettronica non si prenota una visita, non si scarica un certificato e non si consulta il proprio fascicolo previdenziale.":
    "Without SPID or the electronic identity card you cannot book an appointment, download a certificate or look at your own pension record.",
  "Le prove richieste dallo Stato italiano riguardano la storia e le istituzioni del paese?":
    "Do the tests the Italian state requires cover the country's history and institutions?",
  "Sì, entrambe le prove sono di educazione civica": "Yes; both tests are in civics",
  "No: il test A2 e il certificato B1 sono prove linguistiche":
    "No: the A2 test and the B1 certificate are tests of language",
  "Solo la prova per la cittadinanza è di educazione civica":
    "Only the citizenship test is in civics",
  "Solo il test per il permesso è di educazione civica":
    "Only the test for the permit is in civics",
  "Sia l'A2 per il permesso di lungo periodo sia il B1 per la cittadinanza esaminano la lingua. L'unico riferimento alla vita civile è nella verifica dell'accordo di integrazione, e non è un esame di storia.":
    "Both the A2 for the long-term permit and the B1 for citizenship examine the language. The only reference to civic life is in the check on the integration agreement, and that is not an examination in history.",
  "Come si beve abitualmente il caffè in Italia?": "How is coffee usually drunk in Italy?",
  "Lungo, seduti al tavolo": "Long, sitting at a table",
  "Espresso, spesso al banco e in poco tempo":
    "As an espresso, often standing at the bar and quickly",
  "Filtrato, in tazza grande": "Filtered, in a large cup",
  "Solo a colazione": "Only at breakfast",
  "L'espresso al banco è il gesto quotidiano più diffuso. Al tavolo il prezzo di solito cambia, ed è la ragione per cui molti restano in piedi.":
    "An espresso at the bar is the commonest daily gesture. At a table the price usually changes, which is why many people stay on their feet.",
  "Che cos'è il caffè corretto?": "What is a caffè corretto?",
  "Un espresso con l'aggiunta di un liquore": "An espresso with a shot of spirits added",
  "Un caffè preparato con acqua filtrata": "A coffee made with filtered water",
  "Un caffè senza zucchero": "A coffee without sugar",
  "Un caffè con latte freddo": "A coffee with cold milk",
  "Corretto con grappa, sambuca o un altro liquore. Si prende di solito dopo il pasto, al posto o dopo l'espresso semplice.":
    "Corrected with grappa, sambuca or another spirit. It is usually taken after a meal, in place of or after a plain espresso.",
  "Che cos'è il primo in un pasto italiano?": "What is the primo in an Italian meal?",
  "L'antipasto": "The starter",
  "La portata di pasta, riso o zuppa": "The course of pasta, rice or soup",
  "Il piatto di carne o pesce": "The dish of meat or fish",
  "Il contorno servito per primo": "The side dish served first",
  "Primo e secondo sono due portate distinte, servite una dopo l'altra: il primo è pasta, riso o zuppa, il secondo carne o pesce con contorno.":
    "Primo and secondo are two separate courses, served one after the other: the primo is pasta, rice or soup, the secondo meat or fish with a side dish.",
  "Perché si dice che la cucina italiana al singolare quasi non esista?":
    "Why is it said that Italian cooking, in the singular, hardly exists?",
  "Perché è stata inventata nel Novecento": "Because it was invented in the twentieth century",
  "Perché è regionale e spesso cittadina, e cambia di valle in valle":
    "Because it is regional and often local to a city, and changes from valley to valley",
  "Perché deriva interamente dalla cucina francese": "Because it comes wholly from French cooking",
  "Perché i prodotti sono importati": "Because the produce is imported",
  "Il ragù non è lo stesso a Bologna e a Napoli, e la pizza napoletana e quella romana sono prodotti diversi. L'idea di una cucina nazionale unica è nata soprattutto fuori dai confini, con l'emigrazione.":
    "Ragù is not the same in Bologna and in Naples, and Neapolitan and Roman pizza are different things. The idea of a single national cuisine grew up mostly outside the country, with emigration.",
  "Che cos'è l'aperitivo?": "What is the aperitivo?",
  "Il caffè che precede la colazione": "The coffee that comes before breakfast",
  "Il momento prima di cena, con una bevanda e qualcosa da mangiare":
    "The moment before dinner, with a drink and something to eat",
  "Il dolce di fine pasto": "The sweet at the end of a meal",
  "Il pasto di mezzogiorno nei giorni festivi": "The midday meal on holidays",
  "Precede la cena e in alcune città, Milano in particolare, si è ampliato al punto da sostituirla quasi del tutto.":
    "It comes before dinner, and in some cities, Milan above all, it has grown until it almost replaces it.",
  "Perché i giovani italiani lasciano tardi la casa dei genitori?":
    "Why do young Italians leave their parents' home late?",
  "Per una tradizione religiosa": "Because of a religious tradition",
  "Soprattutto per ragioni economiche: affitti, salari d'ingresso e lavoro instabile":
    "Mostly for money: rents, starting wages and unstable work",
  "Perché la legge lo prevede fino ai trent'anni":
    "Because the law provides for it until they are thirty",
  "Perché mancano corsi universitari fuori sede":
    "Because there are no university courses away from home",
  "L'età media in cui si lascia la famiglia è fra le più alte d'Europa, e le indagini indicano cause soprattutto economiche più che culturali.":
    "The average age at which people leave the family is among the highest in Europe, and the surveys point to economic rather than cultural causes.",
  "Quale ruolo hanno spesso i nonni nelle famiglie italiane?":
    "What part do grandparents often play in Italian families?",
  "Vivono di norma separati dai figli e non partecipano":
    "They usually live apart from their children and take no part",
  "Curano quotidianamente i nipoti, sostenendo di fatto i bilanci familiari":
    "They look after the grandchildren daily, in effect propping up the family finances",
  "Sono assistiti in strutture pubbliche nella maggioranza dei casi":
    "They are cared for in public homes in most cases",
  "Non hanno alcun ruolo riconosciuto": "They have no recognised part at all",
  "La cura dei nipoti da parte dei nonni sostituisce in molte famiglie servizi che costerebbero, e regge una parte non piccola dell'occupazione femminile.":
    "Grandparents caring for grandchildren replaces, in many families, services that would cost money, and it carries no small part of the employment of women.",
  "Come si chiamano i giocatori della nazionale italiana di calcio?":
    "What are the players of the Italian national football team called?",
  "I rossoneri": "The rossoneri, the red and blacks",
  "Gli azzurri": "The azzurri, the blues",
  "I bianconeri": "The bianconeri, the white and blacks",
  "I granata": "The granata, the maroons",
  "Gli azzurri, dal colore delle maglie, che viene dal blu Savoia e non dalla bandiera. Gli altri nomi appartengono a singole squadre di club.":
    "The azzurri, from the colour of the shirts, which comes from Savoy blue and not from the flag. The other names belong to individual clubs.",
  "Quanti campionati del mondo di calcio ha vinto l'Italia?":
    "How many football World Cups has Italy won?",
  "Quattro. Solo il Brasile ne ha vinti di più. Il calcio è lo sport nazionale e occupa le conversazioni da agosto a maggio.":
    "Four. Only Brazil has won more. Football is the national sport and fills the conversation from August to May.",
  "In quale mese si corre il Giro d'Italia?": "In which month is the Giro d'Italia ridden?",
  "A marzo": "In March",
  "A maggio": "In May",
  "A luglio": "In July",
  "A settembre": "In September",
  "A maggio, attraversando il paese. Il Tour de France si corre invece a luglio: le due grandi corse a tappe non si sovrappongono.":
    "In May, crossing the country. The Tour de France is ridden in July instead: the two great stage races do not overlap.",
  "Da dove viene il colore della maglia del Giro d'Italia?":
    "Where does the colour of the Giro d'Italia jersey come from?",
  "Dalla bandiera nazionale": "From the national flag",
  "Dalla carta del quotidiano sportivo che organizzò la corsa":
    "From the paper the sports daily that organised the race was printed on",
  "Dal colore delle Alpi al tramonto": "From the colour of the Alps at sunset",
  "Da una scelta casuale degli anni Cinquanta": "From a chance decision in the fifties",
  "Come la maglia gialla del Tour, il colore viene dalla carta del giornale organizzatore. Due corse diverse, due giornali, due colori, stessa logica.":
    "Like the yellow jersey of the Tour, the colour comes from the paper of the organising newspaper. Two different races, two newspapers, two colours, the same logic.",
  "Che cosa succede a molti negozi e uffici italiani nel mese di agosto?":
    "What happens to many Italian shops and offices in August?",
  "Prolungano gli orari per il turismo": "They open longer for the tourists",
  "Chiudono per ferie, soprattutto intorno a Ferragosto":
    "They close for the holidays, above all around Ferragosto",
  "Passano a un orario continuato": "They switch to opening straight through",
  "Aprono anche di domenica per legge": "They open on Sundays too, by law",
  "Intorno al 15 agosto chiudono negozi, studi professionali e interi quartieri delle grandi città. È la settimana in cui il paese si ferma davvero.":
    "Around 15 August shops, professional offices and whole districts of the big cities close. It is the week when the country really stops.",
  "Che cos'è la pausa pranzo nei negozi italiani?": "What is the lunch break in Italian shops?",
  "Una chiusura pomeridiana obbligatoria per legge": "An afternoon closing required by law",
  "Una chiusura di alcune ore a metà giornata, con riapertura fino a sera":
    "A closing of a few hours in the middle of the day, reopening until the evening",
  "Il giorno di riposo settimanale": "The weekly day of rest",
  "Un orario ridotto riservato all'estate": "Shorter hours kept for the summer",
  "Diffusa soprattutto nei centri piccoli e al Sud. Non è obbligatoria, e nelle grandi città molti esercizi ormai restano aperti tutto il giorno.":
    "Common above all in small towns and in the south. It is not compulsory, and in the big cities many places now stay open all day.",
};
