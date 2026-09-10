/**
 * French for the Vivere in Italia practice questions.
 *
 * The lesson cards are answered by VIVERE_IN_ITALIA_FR. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in French and then asked its
 * questions in Italian.
 *
 * Keyed on the ITALIAN source text exactly as it appears in itQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an e for
 * an è or a straight apostrophe for a typographic one, and the lookup misses
 * in silence. The question renders in Italian, the tap works, and nothing
 * anywhere reports it.
 *
 * WHAT STAYS ITALIAN follows VIVERE_IN_ITALIA_FR exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - an institution French has a settled name for takes it — the Camera dei
 *     deputati is the Chambre des députés, the Corte costituzionale the Cour
 *     constitutionnelle, the Quirinale the Quirinal;
 *   - where the word IS the answer and French has nothing for it — codice
 *     fiscale, permesso di soggiorno, questura, partita IVA, tessera
 *     sanitaria, INPS, INAIL, CCNL, SPID — the French gives the meaning and
 *     keeps the Italian word beside it;
 *   - the Consulta keeps its nickname, because a question asking what the
 *     Corte costituzionale is commonly called cannot be answered in French.
 *
 * The keep list in check-fr-bank-translation was measured against this table
 * before it was written down. Two needles that look as if they belong are
 * left out because they hide inside longer Italian: "primo" and "secondo" are
 * the two courses of a meal in a handful of keys but the ordinal in dozens
 * more — primo grado, secondo l'articolo — and a gate watching them would
 * accuse the entire chapter on the courts. "carta d'identità" and "Quirinale"
 * are out for the opposite reason: French has carte d'identité and Quirinal,
 * and VIVERE_IN_ITALIA_FR uses them.
 *
 * Sixty-seven of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that VIVERE_IN_ITALIA_FR already
 * answers. Every French table is spread into one object, so a key present in
 * two of them would lose one silently — the later spread would decide both.
 * check-fr-bank-translation measures coverage through translateCourseText,
 * the lookup a reader's tap actually goes through, so those count as answered
 * and are not duplicated here.
 */
export const IT_QUESTION_BANK_FR: Record<string, string> = {
  "Quale articolo della Costituzione descrive la bandiera?":
    "Quel article de la Constitution décrit le drapeau ?",
  "L'articolo 1": "L'article 1",
  "L'articolo 6": "L'article 6",
  "L'articolo 11": "L'article 11",
  "L'articolo 12": "L'article 12",
  "L'articolo 12 chiude i principi fondamentali e descrive il tricolore a tre bande verticali di uguali dimensioni.":
    "L'article 12 clôt les principes fondamentaux et décrit le tricolore, à trois bandes verticales de mêmes dimensions.",
  "Come si chiama ufficialmente l'inno nazionale?":
    "Quel est le nom officiel de l'hymne national ?",
  "Fratelli d'Italia": "Fratelli d'Italia",
  "Il Canto degli Italiani": "Il Canto degli Italiani",
  "Inno di Mameli": "Inno di Mameli",
  "Va' pensiero": "Va' pensiero",
  "Il titolo ufficiale è Il Canto degli Italiani. Fratelli d'Italia è il primo verso e Inno di Mameli il nome corrente: entrambi indicano lo stesso brano, ma non sono il titolo.":
    "Le titre officiel est Il Canto degli Italiani. Fratelli d'Italia en est le premier vers et Inno di Mameli le nom courant : les deux désignent le même morceau, mais ne sont pas le titre.",
  "In quale città nacque il tricolore nel 1797?":
    "Dans quelle ville le tricolore est-il né en 1797 ?",
  "Reggio Emilia": "Reggio d'Émilie",
  "Bologna": "Bologne",
  "Il 7 gennaio 1797 la Repubblica Cispadana adottò il tricolore a Reggio Emilia. Per questo il 7 gennaio è la Festa del Tricolore.":
    "Le 7 janvier 1797, la République cispadane adopta le tricolore à Reggio d'Émilie. C'est pourquoi le 7 janvier est la fête du Tricolore.",
  "Chi compose la musica dell'inno nazionale?": "Qui a composé la musique de l'hymne national ?",
  "Gioachino Rossini": "Gioachino Rossini",
  "La musica è di Michele Novaro, il testo di Goffredo Mameli. Il nome corrente ricorda solo l'autore delle parole.":
    "La musique est de Michele Novaro, le texte de Goffredo Mameli. Le nom courant ne retient que l'auteur des paroles.",
  "Da quando è in vigore l'emblema della Repubblica?":
    "Depuis quand l'emblème de la République est-il en vigueur ?",
  "Dal 1861": "Depuis 1861",
  "Dal 1946": "Depuis 1946",
  "Dal 1948": "Depuis 1948",
  "Dal 2017": "Depuis 2017",
  "L'emblema, scelto per concorso pubblico, è in vigore dal 5 maggio 1948, pochi mesi dopo l'entrata in vigore della Costituzione.":
    "L'emblème, choisi par concours public, est en vigueur depuis le 5 mai 1948, quelques mois après l'entrée en vigueur de la Constitution.",
  "Quale ramo dell'emblema rappresenta la pace?":
    "Quelle branche de l'emblème représente la paix ?",
  "Il ramo di quercia": "La branche de chêne",
  "Il ramo di olivo": "La branche d'olivier",
  "Il ramo di alloro": "La branche de laurier",
  "Il ramo di palma": "La branche de palmier",
  "L'olivo sta per la pace, la quercia per la forza e la dignità. Sono due alberi diffusi in tutta la penisola.":
    "L'olivier dit la paix, le chêne la force et la dignité. Ce sont deux arbres répandus dans toute la péninsule.",
  "Che cosa richiama la ruota dentata dell'emblema?":
    "À quoi renvoie la roue dentée de l'emblème ?",
  "L'industria automobilistica": "À l'industrie automobile",
  "Il lavoro": "Au travail",
  "La navigazione": "À la navigation",
  "Il tempo": "Au temps",
  "L'ingranaggio richiama il lavoro, su cui l'articolo 1 fonda la Repubblica: l'emblema cita la Costituzione.":
    "L'engrenage renvoie au travail, sur lequel l'article 1 fonde la République : l'emblème cite la Constitution.",
  "In che anno Il Canto degli Italiani è diventato inno ufficiale per legge?":
    "En quelle année Il Canto degli Italiani est-il devenu hymne officiel par la loi ?",
  "Nel 1977": "En 1977",
  "Nel 2017": "En 2017",
  "Adottato in via provvisoria nel 1946, è diventato inno ufficiale soltanto con la legge del 4 dicembre 2017: settant'anni da provvisorio.":
    "Adopté à titre provisoire en 1946, il n'est devenu hymne officiel qu'avec la loi du 4 décembre 2017 : soixante-dix ans de provisoire.",
  "Che cosa si celebra il 7 gennaio?": "Que célèbre-t-on le 7 janvier ?",
  "La Festa della Repubblica": "La fête de la République",
  "La Festa del Tricolore": "La fête du Tricolore",
  "L'Epifania civile": "L'Épiphanie civile",
  "La Giornata della Costituzione": "La journée de la Constitution",
  "Il 7 gennaio è la Festa del Tricolore, anniversario dell'adozione della bandiera nel 1797. Non è giorno festivo.":
    "Le 7 janvier est la fête du Tricolore, anniversaire de l'adoption du drapeau en 1797. Ce n'est pas un jour férié.",
  "Quale evento ricorda il 4 novembre?": "Quel événement le 4 novembre rappelle-t-il ?",
  "L'armistizio del 1918 e l'unità nazionale": "L'armistice de 1918 et l'unité nationale",
  "La liberazione dal nazifascismo": "La libération du nazi-fascisme",
  "L'entrata in guerra del 1940": "L'entrée en guerre de 1940",
  "Il 4 novembre è il Giorno dell'Unità nazionale e Festa delle Forze armate, legato all'armistizio del 1918. La Liberazione è il 25 aprile e la Repubblica il 2 giugno.":
    "Le 4 novembre est le jour de l'Unité nationale et la fête des forces armées, lié à l'armistice de 1918. La Libération, c'est le 25 avril, et la République le 2 juin.",
  "Come sono disposte le bande del tricolore?":
    "Comment les bandes du tricolore sont-elles disposées ?",
  "Orizzontali, di larghezza diversa": "Horizontales, de largeurs différentes",
  "Verticali, di uguali dimensioni": "Verticales, de mêmes dimensions",
  "Orizzontali, di uguali dimensioni": "Horizontales, de mêmes dimensions",
  "In diagonale": "En diagonale",
  "Tre bande verticali di uguali dimensioni. Le bande orizzontali sono quelle della bandiera ungherese, che ha gli stessi colori disposti diversamente.":
    "Trois bandes verticales de mêmes dimensions. Les bandes horizontales sont celles du drapeau hongrois, qui a les mêmes couleurs disposées autrement.",
  "Chi disegnò l'emblema della Repubblica?": "Qui a dessiné l'emblème de la République ?",
  "Paolo Paschetto": "Paolo Paschetto",
  "Giuseppe Terragni": "Giuseppe Terragni",
  "Renato Guttuso": "Renato Guttuso",
  "Bruno Munari": "Bruno Munari",
  "L'emblema fu disegnato da Paolo Paschetto, vincitore del concorso pubblico bandito dal governo nel 1946.":
    "L'emblème fut dessiné par Paolo Paschetto, lauréat du concours public ouvert par le gouvernement en 1946.",
  "Perché l'Italia ha un emblema e non uno stemma?":
    "Pourquoi l'Italie a-t-elle un emblème et non des armoiries ?",
  "Perché lo stemma è riservato alle monarchie e l'emblema non discende da una dinastia":
    "Parce que les armoiries sont réservées aux monarchies et que l'emblème ne descend d'aucune dynastie",
  "Perché l'araldica è vietata dalla Costituzione":
    "Parce que la Constitution interdit l'héraldique",
  "Perché uno stemma sarebbe troppo costoso da riprodurre":
    "Parce que des armoiries coûteraient trop cher à reproduire",
  "Perché lo stemma spetta solo alle regioni":
    "Parce que les armoiries ne reviennent qu'aux régions",
  "Uno stemma discende da una famiglia regnante; l'emblema fu inventato da una repubblica appena nata, scegliendolo per concorso pubblico. È una differenza di origine, non di forma.":
    "Des armoiries descendent d'une famille régnante ; l'emblème fut inventé par une république à peine née, qui le choisit par concours public. C'est une différence d'origine, non de forme.",
  "Quanti articoli ha la Costituzione italiana?":
    "Combien d'articles compte la Constitution italienne ?",
  "Cinquantacinque": "Cinquante-cinq",
  "Duecento": "Deux cents",
  "Centotrentanove articoli, più diciotto disposizioni transitorie e finali. Dodici sono i soli principi fondamentali.":
    "Cent trente-neuf articles, plus dix-huit dispositions transitoires et finales. Douze seulement sont les principes fondamentaux.",
  "Chi promulgò la Costituzione nel dicembre 1947?":
    "Qui a promulgué la Constitution en décembre 1947 ?",
  "Alcide De Gasperi": "Alcide De Gasperi",
  "Enrico De Nicola": "Enrico De Nicola",
  "Luigi Einaudi": "Luigi Einaudi",
  "Umberto II": "Humbert II",
  "Enrico De Nicola, capo provvisorio dello Stato. Einaudi sarà il primo Presidente della Repubblica eletto dal Parlamento, nel 1948.":
    "Enrico De Nicola, chef provisoire de l'État. Einaudi sera le premier président de la République élu par le Parlement, en 1948.",
  "Quando fu eletta l'Assemblea costituente?":
    "Quand l'Assemblée constituante a-t-elle été élue ?",
  "Il 18 aprile 1948": "Le 18 avril 1948",
  "L'Assemblea fu eletta il 2 giugno 1946, lo stesso giorno del referendum istituzionale: una scheda per la forma dello Stato, una per i costituenti.":
    "L'Assemblée fut élue le 2 juin 1946, le jour même du référendum institutionnel : un bulletin pour la forme de l'État, un pour les constituants.",
  "Che cosa rese storico il voto del 2 giugno 1946?":
    "Qu'est-ce qui a rendu historique le vote du 2 juin 1946 ?",
  "Fu il primo voto a scrutinio segreto": "Ce fut le premier vote à bulletin secret",
  "Fu la prima volta che votarono le donne a livello nazionale":
    "Ce fut la première fois que les femmes votèrent à l'échelle nationale",
  "Fu il primo voto con le schede stampate": "Ce fut le premier vote avec des bulletins imprimés",
  "Fu il primo voto aperto ai diciottenni":
    "Ce fut le premier vote ouvert aux jeunes de dix-huit ans",
  "Fu la prima consultazione a suffragio davvero universale: le donne votarono per la prima volta a livello nazionale. Il voto ai diciottenni arriverà solo nel 1975.":
    "Ce fut la première consultation au suffrage vraiment universel : les femmes votèrent pour la première fois à l'échelle nationale. Le vote à dix-huit ans n'arrivera qu'en 1975.",
  "Su che cosa è fondata la Repubblica secondo l'articolo 1?":
    "Sur quoi la République est-elle fondée selon l'article 1 ?",
  "Sulla famiglia": "Sur la famille",
  "Sul lavoro": "Sur le travail",
  "Sulla libertà": "Sur la liberté",
  "Sulla proprietà": "Sur la propriété",
  "Una repubblica democratica fondata sul lavoro: la formula fu il compromesso fra chi voleva una repubblica dei lavoratori e chi ne voleva una definizione più generale.":
    "Une république démocratique fondée sur le travail : la formule fut le compromis entre ceux qui voulaient une république des travailleurs et ceux qui en voulaient une définition plus générale.",
  "Che cosa aggiunge il secondo comma dell'articolo 3?":
    "Qu'ajoute le second alinéa de l'article 3 ?",
  "L'uguaglianza davanti alla legge": "L'égalité devant la loi",
  "Il compito della Repubblica di rimuovere gli ostacoli di fatto all'uguaglianza":
    "La tâche pour la République de lever les obstacles de fait à l'égalité",
  "Il divieto di discriminazione religiosa": "L'interdiction de la discrimination religieuse",
  "La parità fra uomo e donna nel lavoro": "L'égalité entre l'homme et la femme au travail",
  "Il primo comma enuncia l'uguaglianza formale, il secondo quella sostanziale: non basta che la legge sia uguale, la Repubblica deve rimuovere gli ostacoli che la rendono ineffettiva. È il comma su cui poggiano le politiche sociali.":
    "Le premier alinéa énonce l'égalité formelle, le second l'égalité réelle : il ne suffit pas que la loi soit la même, la République doit lever les obstacles qui la rendent inopérante. C'est l'alinéa sur lequel reposent les politiques sociales.",
  "Su quale articolo poggia l'adesione italiana all'Unione europea?":
    "Sur quel article repose l'adhésion italienne à l'Union européenne ?",
  "L'articolo 3": "L'article 3",
  "L'articolo 138": "L'article 138",
  "L'articolo 11 consente, in condizioni di parità con gli altri Stati, le limitazioni di sovranità necessarie a un ordinamento che assicuri pace e giustizia. Lo stesso articolo che ripudia la guerra apre all'Europa.":
    "L'article 11 consent, à égalité avec les autres États, aux limitations de souveraineté nécessaires à un ordre qui assure la paix et la justice. Le même article qui répudie la guerre ouvre à l'Europe.",
  "Che cosa ripudia l'articolo 11?": "Que répudie l'article 11 ?",
  "La pena di morte": "La peine de mort",
  "La censura": "La censure",
  "Il lavoro minorile": "Le travail des enfants",
  "L'Italia ripudia la guerra come strumento di offesa alla libertà degli altri popoli e come mezzo di risoluzione delle controversie internazionali. La pena di morte è abolita dall'articolo 27.":
    "L'Italie répudie la guerre comme moyen d'atteinte à la liberté des autres peuples et comme mode de règlement des différends internationaux. La peine de mort, elle, est abolie par l'article 27.",
  "Quale articolo disciplina la revisione della Costituzione?":
    "Quel article règle la révision de la Constitution ?",
  "L'articolo 75": "L'article 75",
  "L'articolo 101": "L'article 101",
  "L'articolo 139": "L'article 139",
  "L'articolo 138 detta la procedura aggravata; il 139 pone il limite invalicabile della forma repubblicana. Il 75 riguarda invece il referendum abrogativo.":
    "L'article 138 fixe la procédure renforcée ; le 139 pose la limite infranchissable de la forme républicaine. Le 75, lui, concerne le référendum abrogatif.",
  "Quando può essere chiesto il referendum confermativo su una legge costituzionale?":
    "Quand peut-on demander le référendum de confirmation sur une loi constitutionnelle ?",
  "Sempre, dopo l'approvazione": "Toujours, après l'adoption",
  "Solo se nella seconda votazione non si raggiungono i due terzi":
    "Seulement si les deux tiers ne sont pas atteints au second vote",
  "Solo se lo chiede il Presidente della Repubblica":
    "Seulement si le président de la République le demande",
  "Mai: le leggi costituzionali non sono referendabili":
    "Jamais : les lois constitutionnelles ne peuvent être soumises à référendum",
  "Se ciascuna Camera approva con almeno i due terzi, la legge è definitiva. Sotto quella soglia, cinquecentomila elettori, cinque consigli regionali o un quinto dei parlamentari possono chiedere il referendum.":
    "Si chaque chambre adopte à au moins deux tiers, la loi est définitive. Au-dessous de ce seuil, cinq cent mille électeurs, cinq conseils régionaux ou un cinquième des parlementaires peuvent demander le référendum.",
  "Il referendum confermativo dell'articolo 138 è valido solo se vota la maggioranza degli aventi diritto?":
    "Le référendum de confirmation de l'article 138 n'est-il valable que si la majorité des inscrits vote ?",
  "Sì, come tutti i referendum": "Oui, comme tous les référendums",
  "No, non ha quorum di partecipazione": "Non, il n'a pas de quorum de participation",
  "Sì, ma solo per le riforme della Parte II":
    "Oui, mais seulement pour les réformes de la deuxième partie",
  "Dipende dal numero di firme raccolte": "Cela dépend du nombre de signatures réunies",
  "Il confermativo non ha quorum: vale qualunque sia l'affluenza. Il quorum di metà più uno degli aventi diritto riguarda il referendum abrogativo dell'articolo 75.":
    "Le référendum de confirmation n'a pas de quorum : il vaut quelle que soit la participation. Le quorum de la moitié plus un des inscrits concerne le référendum abrogatif de l'article 75.",
  "Quali articoli formano la Parte II, sull'ordinamento della Repubblica?":
    "Quels articles forment la deuxième partie, sur l'organisation de la République ?",
  "Dall'1 al 12": "De 1 à 12",
  "Dal 13 al 54": "De 13 à 54",
  "Dal 55 al 139": "De 55 à 139",
  "Dal 100 al 139": "De 100 à 139",
  "Principi fondamentali 1–12, Parte I sui diritti e doveri 13–54, Parte II sull'ordinamento 55–139.":
    "Principes fondamentaux 1 à 12, première partie sur les droits et devoirs 13 à 54, deuxième partie sur l'organisation 55 à 139.",
  "Quando l'Assemblea costituente approvò il testo della Costituzione?":
    "Quand l'Assemblée constituante a-t-elle adopté le texte de la Constitution ?",
  "Approvazione il 22 dicembre 1947, promulgazione il 27 dicembre, entrata in vigore il 1º gennaio 1948. Il 18 aprile 1948 sono invece le prime elezioni politiche repubblicane.":
    "Adoption le 22 décembre 1947, promulgation le 27 décembre, entrée en vigueur le 1er janvier 1948. Le 18 avril 1948, ce sont en revanche les premières élections législatives de la République.",
  "Quali articoli formano la Parte I, sui diritti e doveri?":
    "Quels articles forment la première partie, sur les droits et devoirs ?",
  "Dal 55 al 96": "De 55 à 96",
  "Dal 101 al 139": "De 101 à 139",
  "La Parte I va dall'articolo 13 al 54 ed è divisa in quattro titoli: rapporti civili, etico-sociali, economici e politici.":
    "La première partie va de l'article 13 à l'article 54 et se divise en quatre titres : rapports civils, éthiques et sociaux, économiques et politiques.",
  "In quanti titoli è divisa la Parte I della Costituzione?":
    "En combien de titres la première partie de la Constitution se divise-t-elle ?",
  "Due": "Deux",
  "Quattro": "Quatre",
  "Sei": "Six",
  "Quattro: rapporti civili, rapporti etico-sociali, rapporti economici e rapporti politici. Ogni titolo guarda la persona da un lato diverso.":
    "Quatre : rapports civils, rapports éthiques et sociaux, rapports économiques et rapports politiques. Chaque titre regarde la personne d'un côté différent.",
  "Quale articolo esclude la pena di morte?": "Quel article exclut la peine de mort ?",
  "L'articolo 13": "L'article 13",
  "L'articolo 21": "L'article 21",
  "L'articolo 24": "L'article 24",
  "L'articolo 27": "L'article 27",
  "L'articolo 27 chiude affermando che non è ammessa la pena di morte, dopo aver stabilito la personalità della responsabilità penale e il fine rieducativo della pena.":
    "L'article 27 se clôt en affirmant que la peine de mort n'est pas admise, après avoir posé le caractère personnel de la responsabilité pénale et la fin rééducative de la peine.",
  "Quale principio NON è contenuto nell'articolo 27?":
    "Quel principe ne figure PAS à l'article 27 ?",
  "La responsabilità penale è personale": "La responsabilité pénale est personnelle",
  "L'imputato non è considerato colpevole fino alla condanna definitiva":
    "Le prévenu n'est pas tenu pour coupable jusqu'à la condamnation définitive",
  "Le pene devono tendere alla rieducazione": "Les peines doivent tendre à la rééducation",
  "Nessuno può essere distolto dal giudice naturale":
    "Nul ne peut être soustrait à son juge naturel",
  "Il giudice naturale è garantito dall'articolo 25. L'articolo 27 riunisce personalità della responsabilità, presunzione di non colpevolezza, fine rieducativo della pena e divieto della pena di morte.":
    "Le juge naturel est garanti par l'article 25. L'article 27, lui, réunit le caractère personnel de la responsabilité, la présomption d'innocence, la fin rééducative de la peine et l'interdiction de la peine de mort.",
  "Che cosa garantisce l'articolo 21?": "Que garantit l'article 21 ?",
  "La libertà di riunione": "La liberté de réunion",
  "La libertà di manifestare il proprio pensiero": "La liberté d'exprimer sa pensée",
  "La libertà di associazione": "La liberté d'association",
  "La libertà religiosa": "La liberté religieuse",
  "L'articolo 21 riguarda la manifestazione del pensiero con la parola, lo scritto e ogni mezzo di diffusione. Riunione è l'articolo 17, associazione il 18, religione il 19.":
    "L'article 21 porte sur l'expression de la pensée par la parole, par l'écrit et par tout moyen de diffusion. La réunion, c'est l'article 17, l'association le 18, la religion le 19.",
  "La stampa può essere sottoposta ad autorizzazioni o censure?":
    "La presse peut-elle être soumise à autorisation ou à censure ?",
  "Sì, in caso di emergenza nazionale": "Oui, en cas d'urgence nationale",
  "No, l'articolo 21 lo esclude": "Non, l'article 21 l'exclut",
  "Sì, se lo decide il Ministero dell'interno":
    "Oui, si le ministère de l'Intérieur en décide ainsi",
  "Solo per le pubblicazioni straniere": "Seulement pour les publications étrangères",
  "L'articolo 21 esclude autorizzazioni e censure: è una frase scritta da chi aveva appena vissuto vent'anni di giornali autorizzati. Restano possibili i sequestri per atto motivato dell'autorità giudiziaria.":
    "L'article 21 exclut autorisations et censures : c'est une phrase écrite par des gens qui venaient de vivre vingt ans de journaux autorisés. Restent possibles les saisies par acte motivé de l'autorité judiciaire.",
  "Quale articolo tutela la salute come diritto dell'individuo?":
    "Quel article protège la santé comme un droit de la personne ?",
  "L'articolo 29": "L'article 29",
  "L'articolo 32": "L'article 32",
  "L'articolo 34": "L'article 34",
  "L'articolo 38": "L'article 38",
  "L'articolo 32 definisce la salute diritto dell'individuo e interesse della collettività, e garantisce cure gratuite agli indigenti. È la base del Servizio sanitario nazionale.":
    "L'article 32 fait de la santé un droit de la personne et un intérêt de la collectivité, et garantit des soins gratuits aux indigents. C'est le fondement du Service national de santé.",
  "Che cos'è il patrocinio a spese dello Stato?": "Qu'est-ce que l'aide juridictionnelle ?",
  "Un contributo per le spese processuali di chi non può permettersele":
    "Une prise en charge des frais de procès pour qui n'en a pas les moyens",
  "Un fondo per le vittime di reato": "Un fonds pour les victimes d'infractions",
  "Un'assicurazione obbligatoria per gli avvocati": "Une assurance obligatoire pour les avocats",
  "Un sussidio per i detenuti": "Une allocation pour les détenus",
  "Nasce dall'articolo 24, che impone allo Stato di assicurare ai non abbienti i mezzi per agire e difendersi davanti a ogni giurisdizione.":
    "Elle naît de l'article 24, qui impose à l'État d'assurer aux plus démunis les moyens d'agir et de se défendre devant toute juridiction.",
  "Quale articolo riconosce il diritto di sciopero?": "Quel article reconnaît le droit de grève ?",
  "L'articolo 35": "L'article 35",
  "L'articolo 39": "L'article 39",
  "L'articolo 40": "L'article 40",
  "L'articolo 46": "L'article 46",
  "L'articolo 40 riconosce il diritto di sciopero, che si esercita nell'ambito delle leggi che lo regolano. L'articolo 39 riguarda invece la libertà sindacale.":
    "L'article 40 reconnaît le droit de grève, qui s'exerce dans le cadre des lois qui le règlent. L'article 39, lui, concerne la liberté syndicale.",
  "Chi non vota alle elezioni politiche che conseguenza subisce?":
    "Que risque celui qui ne vote pas aux élections législatives ?",
  "Una sanzione amministrativa": "Une sanction administrative",
  "Nessuna: il dovere civico non è sanzionato": "Rien : le devoir civique n'est pas sanctionné",
  "La sospensione dei diritti politici": "La suspension de ses droits politiques",
  "L'esclusione dai concorsi pubblici": "L'exclusion des concours de la fonction publique",
  "L'articolo 48 chiama il voto dovere civico, ma non prevede sanzioni. Dovere civico indica un obbligo morale e politico, non un obbligo giuridico assistito da pena.":
    "L'article 48 appelle le vote un devoir civique, mais ne prévoit aucune sanction. Un devoir civique dit une obligation morale et politique, non une obligation juridique assortie d'une peine.",
  "Quale articolo impone fedeltà alla Repubblica e l'osservanza della Costituzione?":
    "Quel article impose la fidélité à la République et le respect de la Constitution ?",
  "L'articolo 48": "L'article 48",
  "L'articolo 52": "L'article 52",
  "L'articolo 53": "L'article 53",
  "L'articolo 54": "L'article 54",
  "L'articolo 54 chiede a tutti fedeltà alla Repubblica e, a chi ricopre funzioni pubbliche, di adempierle con disciplina e onore.":
    "L'article 54 demande à chacun d'être fidèle à la République et, à qui exerce une fonction publique, de s'en acquitter avec discipline et honneur.",
  "Le garanzie dell'articolo 13 sulla libertà personale valgono solo per i cittadini italiani?":
    "Les garanties de l'article 13 sur la liberté personnelle ne valent-elles que pour les citoyens italiens ?",
  "Sì, solo per i cittadini": "Oui, pour les seuls citoyens",
  "No, l'articolo dice nessuno e vale per chiunque":
    "Non, l'article dit « nul » et vaut pour quiconque",
  "Solo per i cittadini dell'Unione europea": "Seulement pour les citoyens de l'Union européenne",
  "Solo per chi ha la residenza": "Seulement pour les résidents",
  "L'articolo 13 usa la parola nessuno e l'articolo 21 la parola tutti: sono garanzie riferite alla persona. Riservati ai cittadini sono soprattutto i diritti politici, come il voto.":
    "L'article 13 emploie le mot « nul » et l'article 21 le mot « tous » : ce sont des garanties attachées à la personne. Réservés aux citoyens sont surtout les droits politiques, comme le vote.",
  "Quale articolo definisce sacro dovere la difesa della patria?":
    "Quel article fait de la défense de la patrie un devoir sacré ?",
  "L'articolo 52. Il 48 riguarda il voto, il 53 i tributi e l'11 il ripudio della guerra: quattro articoli che si citano spesso insieme e si confondono facilmente.":
    "L'article 52. Le 48 concerne le vote, le 53 l'impôt et le 11 la répudiation de la guerre : quatre articles que l'on cite souvent ensemble et que l'on confond aisément.",
  "Quale articolo della Costituzione tutela le minoranze linguistiche?":
    "Quel article de la Constitution protège les minorités linguistiques ?",
  "L'articolo 9": "L'article 9",
  "L'articolo 6 impegna la Repubblica a tutelare con apposite norme le minoranze linguistiche. L'attuazione arriverà però solo con la legge 482 del 1999.":
    "L'article 6 engage la République à protéger les minorités linguistiques par des règles propres. Son application n'arrivera toutefois qu'avec la loi 482 de 1999.",
  "Quante minoranze linguistiche storiche riconosce la legge del 1999?":
    "Combien de minorités linguistiques historiques la loi de 1999 reconnaît-elle ?",
  "Nove": "Neuf",
  "Venti": "Vingt",
  "Dodici: albanesi, catalane, germaniche, greche, slovene, croate, e le popolazioni parlanti francese, franco-provenzale, friulano, ladino, occitano e sardo.":
    "Douze : albanaise, catalane, germanique, grecque, slovène, croate, et les populations de langue française, franco-provençale, frioulane, ladine, occitane et sarde.",
  "In quale regione il tedesco è equiparato all'italiano?":
    "Dans quelle région l'allemand est-il mis sur le même pied que l'italien ?",
  "In Friuli Venezia Giulia": "Au Frioul-Vénétie Julienne",
  "In Veneto": "En Vénétie",
  "In Alto Adige il tedesco è equiparato all'italiano: atti bilingui, scuole distinte per gruppo linguistico e proporzionale etnica per i posti pubblici.":
    "Dans le Haut-Adige, l'allemand est mis sur le même pied que l'italien : actes bilingues, écoles séparées par groupe linguistique et répartition proportionnelle des postes publics entre les groupes.",
  "In che anno fu fondata l'Accademia della Crusca?":
    "En quelle année l'Accademia della Crusca a-t-elle été fondée ?",
  "Nel 1321": "En 1321",
  "Nel 1583": "En 1583",
  "Nel 1861": "En 1861",
  "Fondata a Firenze nel 1583, è la più antica accademia linguistica del mondo ancora attiva.":
    "Fondée à Florence en 1583, c'est la plus ancienne académie de langue encore en activité au monde.",
  "Perché il napoletano non è considerato una variante dell'italiano?":
    "Pourquoi le napolitain n'est-il pas tenu pour une variante de l'italien ?",
  "Perché ha un alfabeto diverso": "Parce qu'il a un autre alphabet",
  "Perché discende dal latino per conto proprio, come lingua romanza sorella":
    "Parce qu'il descend du latin pour son propre compte, comme une langue romane sœur",
  "Perché è parlato solo in una città": "Parce qu'on ne le parle que dans une seule ville",
  "Perché non ha una tradizione scritta": "Parce qu'il n'a pas de tradition écrite",
  "I cosiddetti dialetti italiani in genere non derivano dall'italiano: derivano dal latino in parallelo. Il napoletano ha inoltre una lunga tradizione scritta e letteraria.":
    "Ce qu'on appelle les dialectes italiens ne vient généralement pas de l'italien : ils viennent du latin en parallèle. Le napolitain a de surcroît une longue tradition écrite et littéraire.",
  "Quale studioso propose la stima più citata sugli italofoni al momento dell'Unità?":
    "Quel savant a proposé l'estimation la plus citée du nombre d'italophones au moment de l'Unité ?",
  "Benedetto Croce": "Benedetto Croce",
  "Tullio De Mauro": "Tullio De Mauro",
  "Antonio Gramsci": "Antonio Gramsci",
  "Bruno Migliorini": "Bruno Migliorini",
  "La stima di poco più del due per cento è di Tullio De Mauro. Altri studiosi propongono percentuali più alte, comunque lontane dalla maggioranza della popolazione.":
    "L'estimation d'un peu plus de deux pour cent est de Tullio De Mauro. D'autres avancent des taux plus élevés, en tout cas loin de la majorité de la population.",
  "Che cos'è la proporzionale etnica in Alto Adige?":
    "Qu'est-ce que la répartition ethnique proportionnelle dans le Haut-Adige ?",
  "Una ripartizione dei posti nel pubblico impiego fra i gruppi linguistici":
    "Une répartition des postes de la fonction publique entre les groupes linguistiques",
  "Un sistema elettorale riservato alle minoranze": "Un mode de scrutin réservé aux minorités",
  "Una quota di studenti stranieri per classe": "Un quota d'élèves étrangers par classe",
  "Una divisione del bilancio provinciale fra i comuni":
    "Un partage du budget provincial entre les communes",
  "I posti nel pubblico impiego sono ripartiti fra gruppo italiano, tedesco e ladino in proporzione alla loro consistenza, dichiarata al censimento.":
    "Les postes de la fonction publique se répartissent entre les groupes italien, allemand et ladin au prorata de leur poids, déclaré au recensement.",
  "Quali lingue minoritarie sono tutelate in Friuli Venezia Giulia?":
    "Quelles langues minoritaires sont protégées au Frioul-Vénétie Julienne ?",
  "Il tedesco e il ladino": "L'allemand et le ladin",
  "Lo sloveno e il friulano": "Le slovène et le frioulan",
  "Il croato e l'albanese": "Le croate et l'albanais",
  "L'occitano e il sardo": "L'occitan et le sarde",
  "Lo sloveno nelle province di Trieste, Gorizia e Udine, e il friulano, parlato da alcune centinaia di migliaia di persone.":
    "Le slovène dans les provinces de Trieste, Gorizia et Udine, et le frioulan, que parlent quelques centaines de milliers de personnes.",
  "Da quale città viene il modello su cui si è formato l'italiano standard?":
    "De quelle ville vient le modèle sur lequel l'italien standard s'est formé ?",
  "Il fiorentino letterario del Trecento, quello di Dante, Petrarca e Boccaccio, fu adottato nel Cinquecento come modello scritto per tutta la penisola.":
    "Le florentin littéraire du quatorzième siècle, celui de Dante, de Pétrarque et de Boccace, fut adopté au seizième comme modèle écrit pour toute la péninsule.",
  "Quale mezzo contribuì più di ogni altro a diffondere l'italiano parlato nel dopoguerra?":
    "Quel moyen a fait plus que tout autre pour répandre l'italien parlé après la guerre ?",
  "Il cinema": "Le cinéma",
  "La televisione": "La télévision",
  "La radio a galena": "Le poste à galène",
  "I giornali": "Les journaux",
  "Negli anni Cinquanta e Sessanta la televisione portò l'italiano nelle case di chi parlava solo dialetto, insieme alla scuola dell'obbligo e all'emigrazione interna.":
    "Dans les années cinquante et soixante, la télévision a porté l'italien chez ceux qui ne parlaient que le dialecte, avec l'école obligatoire et les migrations intérieures.",
  "Da dove viene il nome dell'Accademia della Crusca?":
    "D'où vient le nom de l'Accademia della Crusca ?",
  "Dal quartiere fiorentino in cui nacque": "Du quartier de Florence où elle est née",
  "Dall'immagine della farina separata dalla crusca": "De l'image de la farine séparée du son",
  "Dal cognome del fondatore": "Du nom de son fondateur",
  "Da un'antica corporazione di fornai": "D'une ancienne corporation de boulangers",
  "Il nome richiama il lavoro di separare la farina buona dalla crusca: separare le parole da accogliere da quelle da scartare.":
    "Le nom rappelle le travail qui sépare la bonne farine du son : séparer les mots à accueillir de ceux qu'il faut écarter.",
  "In quale regione si parlano, oltre al francese, varietà germaniche walser?":
    "Dans quelle région parle-t-on, outre le français, des parlers germaniques walsers ?",
  "In Emilia-Romagna": "En Émilie-Romagne",
  "In Calabria": "En Calabre",
  "Le comunità walser vivono nelle valli alpine della Valle d'Aosta e del Piemonte. In Valle d'Aosta convivono quindi italiano, francese e parlate germaniche.":
    "Les communautés walsers vivent dans les vallées alpines du Val d'Aoste et du Piémont. Au Val d'Aoste cohabitent donc l'italien, le français et des parlers germaniques.",
  "L'italiano è dichiarato lingua ufficiale nei principi fondamentali della Costituzione?":
    "L'italien est-il déclaré langue officielle dans les principes fondamentaux de la Constitution ?",
  "Sì, all'articolo 6": "Oui, à l'article 6",
  "Sì, all'articolo 12": "Oui, à l'article 12",
  "No: lo si ricava dallo statuto del Trentino-Alto Adige e dalla legge 482":
    "Non : cela ressort du statut du Trentin-Haut-Adige et de la loi 482",
  "No: non è lingua ufficiale in nessun testo":
    "Non : il n'est langue officielle dans aucun texte",
  "La Costituzione non lo dice. L'italiano è indicato come lingua ufficiale nello statuto speciale del Trentino-Alto Adige e nella legge 482 del 1999: una cosa ovvia che non sta dove ci si aspetta.":
    "La Constitution ne le dit pas. L'italien est désigné comme langue officielle dans le statut spécial du Trentin-Haut-Adige et dans la loi 482 de 1999 : une évidence qui ne se trouve pas là où on l'attend.",
  "Quanti sono i giorni festivi nazionali, oltre al patrono locale?":
    "Combien y a-t-il de jours fériés nationaux, outre le saint patron local ?",
  "Dieci": "Dix",
  "Quindici": "Quinze",
  "Dodici giorni festivi per legge, più il santo patrono, che è festivo soltanto nel proprio comune.":
    "Douze jours fériés par la loi, plus le saint patron, chômé dans sa seule commune.",
  "Quando si celebra il patrono di Milano?": "Quand fête-t-on le patron de Milan ?",
  "Il 19 settembre": "Le 19 septembre",
  "Il 4 ottobre": "Le 4 octobre",
  "Il 7 dicembre": "Le 7 décembre",
  "Il 29 giugno": "Le 29 juin",
  "Sant'Ambrogio si celebra il 7 dicembre: a Milano è giorno festivo e apre la stagione della Scala. Il 19 settembre è san Gennaro a Napoli.":
    "Saint Ambroise se fête le 7 décembre : à Milan, c'est un jour férié et il ouvre la saison de la Scala. Le 19 septembre, c'est saint Janvier à Naples.",
  "Chi è il patrono di Napoli?": "Qui est le patron de Naples ?",
  "San Petronio": "Saint Pétrone",
  "San Gennaro": "Saint Janvier",
  "San Marco": "Saint Marc",
  "Santa Rosalia": "Sainte Rosalie",
  "San Gennaro, celebrato il 19 settembre. San Petronio è di Bologna, san Marco di Venezia e santa Rosalia di Palermo.":
    "Saint Janvier, fêté le 19 septembre. Saint Pétrone est de Bologne, saint Marc de Venise et sainte Rosalie de Palerme.",
  "Che cosa si celebra il 1º maggio?": "Que célèbre-t-on le 1er mai ?",
  "La Liberazione": "La Libération",
  "La festa dei lavoratori": "La fête des travailleurs",
  "La festa della Repubblica": "La fête de la République",
  "L'Unità nazionale": "L'Unité nationale",
  "Il 1º maggio è la festa dei lavoratori, una delle quattro ricorrenze civili del calendario italiano.":
    "Le 1er mai est la fête des travailleurs, l'une des quatre dates civiles du calendrier italien.",
  "Quando si celebrano i santi Pietro e Paolo, patroni di Roma?":
    "Quand fête-t-on les saints Pierre et Paul, patrons de Rome ?",
  "Il 21 aprile": "Le 21 avril",
  "Il 1º novembre": "Le 1er novembre",
  "Il 29 giugno, giorno festivo soltanto a Roma. Il 21 aprile è invece il Natale di Roma, che non è festivo.":
    "Le 29 juin, jour férié à Rome seulement. Le 21 avril, c'est en revanche la naissance de Rome, qui n'est pas chômée.",
  "Il giorno del patrono è festivo in tutta Italia?":
    "Le jour du saint patron est-il férié dans toute l'Italie ?",
  "Sì, come le altre dodici feste": "Oui, comme les douze autres fêtes",
  "No, soltanto nel comune di cui è patrono":
    "Non, seulement dans la commune dont il est le patron",
  "Sì, ma solo nei capoluoghi di regione": "Oui, mais seulement dans les chefs-lieux de région",
  "No, non è mai festivo per legge": "Non, il n'est jamais férié par la loi",
  "È festivo solo nel proprio comune: un ufficio milanese chiude il 7 dicembre, mentre a Roma lo stesso giorno si lavora normalmente.":
    "Il n'est chômé que dans sa propre commune : un bureau milanais ferme le 7 décembre, alors qu'à Rome on travaille normalement ce jour-là.",
  "Con quale nome è comunemente conosciuto il Lunedì dell'Angelo?":
    "Sous quel nom le Lunedì dell'Angelo est-il couramment connu ?",
  "Pasquetta": "Pasquetta",
  "Carnevale": "Carnaval",
  "Befana": "Befana",
  "Il lunedì dopo Pasqua si chiama ufficialmente Lunedì dell'Angelo e comunemente Pasquetta. È una festa mobile, come la Pasqua da cui dipende.":
    "Le lundi qui suit Pâques s'appelle officiellement Lunedì dell'Angelo et couramment Pasquetta. C'est une fête mobile, comme Pâques dont elle dépend.",
  "Che cosa si ricorda il 10 febbraio?": "Que rappelle le 10 février ?",
  "Le vittime delle foibe e l'esodo giuliano-dalmata":
    "Les victimes des foibe et l'exode julien-dalmate",
  "I caduti della Grande guerra": "Les morts de la Grande Guerre",
  "Il Giorno del Ricordo, istituito per le vittime delle foibe e per l'esodo delle popolazioni istriane, fiumane e dalmate.":
    "Le jour du Souvenir, institué pour les victimes des foibe et pour l'exode des populations d'Istrie, de Fiume et de Dalmatie.",
  "A quale fatto del 1978 è legata la data del 9 maggio?":
    "À quel fait de 1978 la date du 9 mai est-elle liée ?",
  "Alla strage di piazza Fontana": "Au massacre de la piazza Fontana",
  "Al ritrovamento del corpo di Aldo Moro": "À la découverte du corps d'Aldo Moro",
  "All'attentato di via Fani": "À l'attentat de la via Fani",
  "Alla strage di Bologna": "Au massacre de Bologne",
  "Il 9 maggio 1978 fu ritrovato il corpo di Aldo Moro. Quella data è oggi il Giorno della memoria delle vittime del terrorismo. Il rapimento in via Fani era avvenuto il 16 marzo.":
    "Le 9 mai 1978, on retrouva le corps d'Aldo Moro. Cette date est aujourd'hui le jour de mémoire des victimes du terrorisme. L'enlèvement de la via Fani avait eu lieu le 16 mars.",
  "Quale festa cade il 26 dicembre?": "Quelle fête tombe le 26 décembre ?",
  "L'Immacolata": "L'Immaculée Conception",
  "Santo Stefano": "La Saint-Étienne",
  "Ognissanti": "La Toussaint",
  "Santo Stefano, il giorno dopo Natale. L'Immacolata è l'8 dicembre, l'Epifania il 6 gennaio e Ognissanti il 1º novembre.":
    "La Saint-Étienne, le lendemain de Noël. L'Immaculée Conception tombe le 8 décembre, l'Épiphanie le 6 janvier et la Toussaint le 1er novembre.",
  "Quando cade l'Immacolata Concezione?": "Quand tombe l'Immaculée Conception ?",
  "Il 6 dicembre": "Le 6 décembre",
  "Il 6 gennaio": "Le 6 janvier",
  "L'8 dicembre. In molte case è il giorno in cui si fa l'albero di Natale, e a Roma il papa rende omaggio alla colonna di piazza di Spagna.":
    "Le 8 décembre. Dans bien des maisons, c'est le jour où l'on dresse le sapin, et à Rome le pape rend hommage à la colonne de la place d'Espagne.",
  "Da che cosa dipende la data della Pasqua?": "De quoi dépend la date de Pâques ?",
  "Da una data fissa stabilita nel Concilio di Trento":
    "D'une date fixe arrêtée au concile de Trente",
  "Dal primo plenilunio di primavera": "De la première pleine lune du printemps",
  "Dal calendario civile dello Stato": "Du calendrier civil de l'État",
  "Dall'inizio della Quaresima, fissato al 1º marzo": "Du début du carême, fixé au 1er mars",
  "La Pasqua cade la domenica successiva al primo plenilunio dopo l'equinozio di primavera. Da lei dipendono a cascata Carnevale, Quaresima e Pasquetta.":
    "Pâques tombe le dimanche qui suit la première pleine lune après l'équinoxe de printemps. En dépendent en cascade le carnaval, le carême et Pasquetta.",
  "Che cosa porta la Befana la notte del 6 gennaio?":
    "Qu'apporte la Befana dans la nuit du 6 janvier ?",
  "I doni ai bambini, e carbone di zucchero a chi non è stato buono":
    "Des cadeaux aux enfants, et du charbon en sucre à qui n'a pas été sage",
  "Le uova di cioccolato": "Des œufs en chocolat",
  "I dolci del Carnevale": "Les gâteaux du carnaval",
  "I regali ai soli adulti": "Des cadeaux aux seuls adultes",
  "La Befana riempie le calze la notte dell'Epifania. Non è festa religiosa nel senso stretto: è una tradizione popolare che si è appoggiata alla data del 6 gennaio.":
    "La Befana remplit les chaussettes la nuit de l'Épiphanie. Ce n'est pas une fête religieuse au sens strict : c'est une tradition populaire qui s'est appuyée sur la date du 6 janvier.",
  "Quanti sono oggi i senatori elettivi?": "Combien y a-t-il aujourd'hui de sénateurs élus ?",
  "Cento": "Cent",
  "Trecentoquindici": "Trois cent quinze",
  "Quattrocento": "Quatre cents",
  "Duecento dal 2022. Trecentoquindici era il numero precedente e quattrocento è quello dei deputati.":
    "Deux cents depuis 2022. Trois cent quinze était le nombre d'avant, et quatre cents est celui des députés.",
  "In quale palazzo si riunisce la Camera dei deputati?":
    "Dans quel palais la Chambre des députés se réunit-elle ?",
  "Palazzo Madama": "Le palais Madama",
  "Palazzo Chigi": "Le palais Chigi",
  "Palazzo Montecitorio": "Le palais Montecitorio",
  "Palazzo della Consulta": "Le palais de la Consulta",
  "Montecitorio è la Camera, Madama il Senato, Chigi il governo e la Consulta la Corte costituzionale: quattro palazzi romani che nei giornali stanno per quattro istituzioni.":
    "Montecitorio, c'est la Chambre ; Madama, le Sénat ; Chigi, le gouvernement ; la Consulta, la Cour constitutionnelle : quatre palais romains qui, dans les journaux, tiennent lieu de quatre institutions.",
  "In quale palazzo si riunisce il Senato?": "Dans quel palais le Sénat se réunit-il ?",
  "Palazzo Madama, che deve il nome a Margherita d'Austria. Il Quirinale è la residenza del Presidente della Repubblica.":
    "Le palais Madama, qui doit son nom à Marguerite d'Autriche. Le Quirinal est la résidence du président de la République.",
  "Quanti anni bisogna avere per essere eletti senatori?":
    "Quel âge faut-il avoir pour être élu sénateur ?",
  "Venticinque": "Vingt-cinq",
  "Trenta": "Trente",
  "Quaranta": "Quarante",
  "Cinquanta": "Cinquante",
  "Quaranta per il Senato, venticinque per la Camera. Cinquanta è invece l'età minima per il Presidente della Repubblica.":
    "Quarante pour le Sénat, vingt-cinq pour la Chambre. Cinquante est en revanche l'âge minimum pour la présidence de la République.",
  "Quanti anni bisogna avere per essere eletti deputati?":
    "Quel âge faut-il avoir pour être élu député ?",
  "Diciotto": "Dix-huit",
  "Venticinque. A diciotto si può votare per entrambe le camere, ma per candidarsi le soglie restano più alte.":
    "Vingt-cinq. À dix-huit ans on peut voter pour les deux chambres, mais pour se présenter les seuils restent plus hauts.",
  "Quanti erano deputati e senatori elettivi prima della riforma?":
    "Combien y avait-il de députés et de sénateurs élus avant la réforme ?",
  "500 e 250": "500 et 250",
  "630 e 315": "630 et 315",
  "700 e 350": "700 et 350",
  "400 e 200": "400 et 200",
  "Seicentotrenta e trecentoquindici, fino alla legislatura iniziata nel 2022. Quattrocento e duecento sono i numeri attuali.":
    "Six cent trente et trois cent quinze, jusqu'à la législature ouverte en 2022. Quatre cents et deux cents sont les nombres actuels.",
  "Che cosa si intende per navetta parlamentare?": "Qu'entend-on par navette parlementaire ?",
  "Il passaggio di un testo da una camera all'altra finché non è identico":
    "Le passage d'un texte d'une chambre à l'autre jusqu'à ce qu'il soit identique",
  "Il servizio che collega Montecitorio e Palazzo Madama":
    "Le service qui relie Montecitorio au palais Madama",
  "La sessione notturna di approvazione del bilancio": "La séance de nuit d'adoption du budget",
  "Il voto di fiducia ripetuto due volte": "Le vote de confiance répété deux fois",
  "Una legge deve essere approvata nel medesimo testo da entrambe le camere: se una la modifica, torna all'altra. L'andirivieni può ripetersi molte volte ed è la conseguenza diretta del bicameralismo paritario.":
    "Une loi doit être adoptée dans le même texte par les deux chambres : si l'une la modifie, elle repart vers l'autre. Ce va-et-vient peut se répéter longtemps ; c'est la conséquence directe d'un bicamérisme égalitaire.",
  "Quanto dura una legislatura?": "Combien de temps dure une législature ?",
  "Sei anni": "Six ans",
  "Cinque anni, salvo scioglimento anticipato. Sette anni è la durata del mandato presidenziale, e in Italia le legislature arrivate a scadenza naturale sono una minoranza.":
    "Cinq ans, sauf dissolution anticipée. Sept ans est la durée du mandat présidentiel, et en Italie les législatures menées à leur terme sont une minorité.",
  "Quante firme servono per chiedere un referendum abrogativo?":
    "Combien de signatures faut-il pour demander un référendum abrogatif ?",
  "Cinquantamila": "Cinquante mille",
  "Centomila": "Cent mille",
  "Cinquecentomila": "Cinq cent mille",
  "Un milione": "Un million",
  "Cinquecentomila elettori, oppure cinque consigli regionali. Centomila firme servono invece per una proposta di legge di iniziativa popolare.":
    "Cinq cent mille électeurs, ou bien cinq conseils régionaux. Cent mille signatures servent en revanche à une proposition de loi d'initiative populaire.",
  "Quando è valido un referendum abrogativo?": "Quand un référendum abrogatif est-il valable ?",
  "Sempre, qualunque sia l'affluenza": "Toujours, quelle que soit la participation",
  "Se partecipa la maggioranza degli aventi diritto": "Si la majorité des inscrits y prend part",
  "Se partecipa un terzo degli aventi diritto": "Si un tiers des inscrits y prend part",
  "Se lo convalida la Corte costituzionale dopo il voto":
    "Si la Cour constitutionnelle le valide après le vote",
  "Serve il quorum di metà più uno degli aventi diritto. Molti referendum sono falliti non perché il no abbia vinto, ma perché non ci si è presentati: astenersi è un modo di far cadere la consultazione.":
    "Il faut le quorum de la moitié plus un des inscrits. Bien des référendums ont échoué non parce que le non l'a emporté, mais parce qu'on ne s'est pas déplacé : s'abstenir est une façon de faire tomber la consultation.",
  "Quale di queste materie NON può essere sottoposta a referendum abrogativo?":
    "Laquelle de ces matières ne peut PAS être soumise à un référendum abrogatif ?",
  "Il diritto di famiglia": "Le droit de la famille",
  "L'energia nucleare": "L'énergie nucléaire",
  "Le leggi tributarie e di bilancio": "Les lois fiscales et budgétaires",
  "La legge elettorale": "La loi électorale",
  "L'articolo 75 esclude leggi tributarie e di bilancio, amnistia e indulto, e la ratifica dei trattati internazionali. Divorzio, aborto e nucleare sono invece stati tutti oggetto di referendum.":
    "L'article 75 exclut les lois fiscales et budgétaires, l'amnistie et la remise de peine, et la ratification des traités internationaux. Le divorce, l'avortement et le nucléaire ont en revanche tous fait l'objet de référendums.",
  "A quale età si vota oggi per il Senato?": "À quel âge vote-t-on aujourd'hui pour le Sénat ?",
  "Diciotto anni": "Dix-huit ans",
  "Ventun anni": "Vingt et un ans",
  "Venticinque anni": "Vingt-cinq ans",
  "Trent'anni": "Trente ans",
  "Diciotto, dalla legge costituzionale del 2021. Prima il Senato si eleggeva dai venticinque anni in su, e i più giovani avevano in mano una scheda sola.":
    "Dix-huit, depuis la loi constitutionnelle de 2021. Auparavant, le Sénat s'élisait à partir de vingt-cinq ans, et les plus jeunes n'avaient qu'un bulletin en main.",
  "Quanti senatori a vita può nominare il Presidente della Repubblica?":
    "Combien de sénateurs à vie le président de la République peut-il nommer ?",
  "Nessuno": "Aucun",
  "Fino a tre": "Jusqu'à trois",
  "Fino a cinque": "Jusqu'à cinq",
  "Senza limite": "Sans limite",
  "Fino a cinque, per altissimi meriti nel campo sociale, scientifico, artistico o letterario. Gli ex Presidenti della Repubblica non rientrano in questo numero: lo sono di diritto.":
    "Jusqu'à cinq, pour de très hauts mérites dans le domaine social, scientifique, artistique ou littéraire. Les anciens présidents de la République n'entrent pas dans ce nombre : ils le sont de plein droit.",
  "Dove ha sede il governo italiano?": "Où siège le gouvernement italien ?",
  "Al Quirinale": "Au Quirinal",
  "A Palazzo Chigi": "Au palais Chigi",
  "A Palazzo Madama": "Au palais Madama",
  "A Montecitorio": "À Montecitorio",
  "Palazzo Chigi. Il Quirinale è del Presidente della Repubblica: due palazzi a pochi minuti a piedi e due poteri distinti.":
    "Le palais Chigi. Le Quirinal est au président de la République : deux palais à quelques minutes de marche et deux pouvoirs distincts.",
  "Che cosa sono le consultazioni?": "Que sont les consultations ?",
  "I sondaggi commissionati dai partiti prima del voto":
    "Les sondages commandés par les partis avant le scrutin",
  "Gli incontri del Presidente della Repubblica con i gruppi parlamentari":
    "Les entretiens du président de la République avec les groupes parlementaires",
  "Le riunioni del Consiglio dei ministri": "Les séances du Conseil des ministres",
  "Le audizioni dei ministri in commissione": "Les auditions des ministres en commission",
  "Prima di nominare un Presidente del Consiglio, il capo dello Stato riceve i gruppi per capire chi possa raccogliere una maggioranza. Non sono previste nel dettaglio dalla Costituzione: sono una prassi consolidata.":
    "Avant de nommer un président du Conseil, le chef de l'État reçoit les groupes pour savoir qui peut réunir une majorité. La Constitution ne les règle pas dans le détail : c'est un usage bien établi.",
  "Entro quanti giorni dalla formazione il governo si presenta per la fiducia?":
    "Dans quel délai, après sa formation, le gouvernement se présente-t-il devant les chambres pour la confiance ?",
  "Sessanta": "Soixante",
  "Dieci giorni, secondo l'articolo 94. Sessanta è il termine di conversione dei decreti legge e tre il tempo minimo prima di discutere una mozione di sfiducia.":
    "Dix jours, selon l'article 94. Soixante est le délai de conversion des décrets-lois, et trois le temps minimum avant de discuter une motion de censure.",
  "Da quante camere deve ottenere la fiducia un governo?":
    "De combien de chambres un gouvernement doit-il obtenir la confiance ?",
  "Solo dalla Camera dei deputati": "De la seule Chambre des députés",
  "Solo dal Senato": "Du seul Sénat",
  "Da entrambe": "Des deux",
  "Da una qualsiasi delle due, a scelta del Presidente del Consiglio":
    "De l'une ou de l'autre, au choix du président du Conseil",
  "Da entrambe, ed è una conseguenza del bicameralismo paritario. Un governo che ha i numeri alla Camera ma non al Senato non può esistere: è la ragione per cui le maggioranze italiane sono spesso larghe e fragili.":
    "Des deux, et c'est une conséquence du bicamérisme égalitaire. Un gouvernement qui a les voix à la Chambre mais non au Sénat ne peut pas exister : voilà pourquoi les majorités italiennes sont souvent larges et fragiles.",
  "Quale articolo consente al governo il decreto legge?":
    "Quel article permet au gouvernement de prendre un décret-loi ?",
  "L'articolo 76": "L'article 76",
  "L'articolo 77": "L'article 77",
  "L'articolo 92": "L'article 92",
  "L'articolo 77, per casi straordinari di necessità e urgenza. Il 76 riguarda il decreto legislativo su delega, il 75 il referendum abrogativo e il 92 la nomina del governo.":
    "L'article 77, pour les cas extraordinaires de nécessité et d'urgence. Le 76 concerne le décret législatif sur délégation, le 75 le référendum abrogatif et le 92 la nomination du gouvernement.",
  "Che cos'è un decreto legislativo?": "Qu'est-ce qu'un décret législatif ?",
  "Una norma scritta dal governo su delega del Parlamento":
    "Une norme écrite par le gouvernement sur délégation du Parlement",
  "Una norma d'urgenza che vale subito": "Une norme d'urgence qui vaut aussitôt",
  "Un regolamento di attuazione di una legge": "Un règlement d'application d'une loi",
  "Una legge approvata da una sola camera": "Une loi adoptée par une seule chambre",
  "Il Parlamento delega, fissando principi, criteri e un termine; il governo scrive il testo. Serve per normative lunghe e tecniche come i codici. Il decreto legge, invece, nasce dall'urgenza e non da una delega.":
    "Le Parlement délègue, en fixant des principes, des critères et un terme ; le gouvernement écrit le texte. Cela sert aux réglementations longues et techniques comme les codes. Le décret-loi, lui, naît de l'urgence et non d'une délégation.",
  "Chi propone al Presidente della Repubblica i nomi dei ministri?":
    "Qui propose au président de la République le nom des ministres ?",
  "I segretari dei partiti di maggioranza": "Les secrétaires des partis de la majorité",
  "Il Presidente del Consiglio incaricato": "Le président du Conseil pressenti",
  "Il presidente della Camera": "Le président de la Chambre",
  "Nessuno: li sceglie il Presidente della Repubblica da solo":
    "Personne : le président de la République les choisit seul",
  "L'articolo 92 dice che il Presidente della Repubblica nomina i ministri su proposta del Presidente del Consiglio. La proposta è dell'uno, la nomina dell'altro: nessuno dei due decide da solo.":
    "L'article 92 dit que le président de la République nomme les ministres sur proposition du président du Conseil. La proposition vient de l'un, la nomination de l'autre : aucun des deux ne décide seul.",
  "Da quanti parlamentari deve essere firmata una mozione di sfiducia?":
    "Par combien de parlementaires une motion de censure doit-elle être signée ?",
  "Da dieci": "Par dix",
  "Da un decimo dei componenti della camera": "Par un dixième des membres de la chambre",
  "Da un quarto": "Par un quart",
  "Dalla maggioranza assoluta": "Par la majorité absolue",
  "Un decimo dei componenti. La soglia è bassa di proposito: presentare la mozione deve essere possibile, approvarla è un'altra cosa.":
    "Un dixième des membres. Le seuil est bas à dessein : déposer la motion doit rester possible, l'adopter est une autre affaire.",
  "Dopo quanto tempo dalla presentazione può essere discussa una mozione di sfiducia?":
    "Au bout de combien de temps après son dépôt une motion de censure peut-elle être discutée ?",
  "Subito": "Aussitôt",
  "Non prima di tre giorni": "Pas avant trois jours",
  "Non prima di dieci giorni": "Pas avant dix jours",
  "Non prima di un mese": "Pas avant un mois",
  "Tre giorni almeno. L'attesa serve a raffreddare gli animi e a dare tempo al governo di cercare i voti che gli mancano.":
    "Trois jours au moins. L'attente sert à calmer les esprits et à laisser au gouvernement le temps de chercher les voix qui lui manquent.",
  "Chi compone il Consiglio dei ministri?": "Qui compose le Conseil des ministres ?",
  "Il Presidente del Consiglio e i ministri": "Le président du Conseil et les ministres",
  "Il Presidente della Repubblica e i ministri": "Le président de la République et les ministres",
  "I capigruppo parlamentari": "Les présidents des groupes parlementaires",
  "I presidenti delle regioni": "Les présidents des régions",
  "Il Presidente del Consiglio e i ministri insieme formano il Consiglio dei ministri, che è l'organo collegiale del governo.":
    "Le président du Conseil et les ministres forment ensemble le Conseil des ministres, l'organe collégial du gouvernement.",
  "In che modo cadono di solito i governi italiani?":
    "Comment les gouvernements italiens tombent-ils d'ordinaire ?",
  "Con un voto di sfiducia in aula": "Par un vote de censure en séance",
  "Per dimissioni del Presidente del Consiglio": "Par la démission du président du Conseil",
  "Per decisione del Presidente della Repubblica": "Par décision du président de la République",
  "Alla scadenza naturale dei cinque anni": "À l'échéance naturelle des cinq ans",
  "Quasi sempre per dimissioni: un partito lascia la maggioranza e il Presidente del Consiglio sale al Quirinale prima di essere messo in minoranza. Le mozioni di sfiducia approvate si contano sulle dita.":
    "Presque toujours par démission : un parti quitte la majorité et le président du Conseil monte au Quirinal avant d'être mis en minorité. Les motions de censure adoptées se comptent sur les doigts d'une main.",
  "Un regolamento del governo può contraddire una legge?":
    "Un règlement du gouvernement peut-il contredire une loi ?",
  "Sì, se è più recente": "Oui, s'il est plus récent",
  "No: attua la legge e non può andarle contro":
    "Non : il applique la loi et ne peut aller contre elle",
  "Sì, in caso di urgenza": "Oui, en cas d'urgence",
  "Solo con il parere della Corte costituzionale":
    "Seulement avec l'avis de la Cour constitutionnelle",
  "Il regolamento sta sotto la legge nella gerarchia delle fonti: ne detta i dettagli attuativi e non può contraddirla. Per fare qualcosa con forza di legge servono il decreto legge o il decreto legislativo.":
    "Le règlement se place sous la loi dans la hiérarchie des normes : il en règle les détails d'application et ne peut la contredire. Pour agir avec force de loi, il faut le décret-loi ou le décret législatif.",
  "Quale palazzo è la residenza del Presidente della Repubblica?":
    "Quel palais est la résidence du président de la République ?",
  "Il Viminale": "Le Viminal",
  "Il Quirinale, che fu dei papi e poi dei re. Il Viminale è il Ministero dell'interno, un altro nome di palazzo che nei giornali sostituisce l'istituzione.":
    "Le Quirinal, qui fut aux papes puis aux rois. Le Viminal, c'est le ministère de l'Intérieur — un autre nom de palais qui, dans les journaux, tient lieu d'institution.",
  "Qual è l'età minima per essere eletti Presidente della Repubblica?":
    "Quel est l'âge minimum pour être élu président de la République ?",
  "Quaranta anni": "Quarante ans",
  "Quarantacinque anni": "Quarante-cinq ans",
  "Sessant'anni": "Soixante ans",
  "Cinquant'anni, oltre alla cittadinanza italiana e al godimento dei diritti civili e politici. Quaranta è l'età minima per il Senato.":
    "Cinquante ans, outre la nationalité italienne et la jouissance des droits civils et politiques. Quarante est l'âge minimum pour le Sénat.",
  "Quanti delegati regionali partecipano all'elezione del Presidente?":
    "Combien de délégués régionaux prennent part à l'élection du président ?",
  "Cinquantotto": "Cinquante-huit",
  "Cinquantotto: tre per ogni regione e uno soltanto per la Valle d'Aosta. Si aggiungono ai deputati e ai senatori riuniti in seduta comune.":
    "Cinquante-huit : trois par région et un seul pour le Val d'Aoste. Ils s'ajoutent aux députés et aux sénateurs réunis en séance commune.",
  "Quanti delegati esprime la Valle d'Aosta all'elezione presidenziale?":
    "Combien de délégués le Val d'Aoste envoie-t-il à l'élection présidentielle ?",
  "Uno": "Un",
  "Tre come tutte le altre": "Trois, comme toutes les autres",
  "Uno solo: è l'eccezione prevista proprio per la sua dimensione. Tutte le altre diciannove regioni ne esprimono tre.":
    "Un seul : c'est l'exception prévue précisément pour sa taille. Les dix-neuf autres régions en envoient trois.",
  "Quale maggioranza serve nei primi tre scrutini per eleggere il Presidente?":
    "Quelle majorité faut-il aux trois premiers tours pour élire le président ?",
  "La maggioranza semplice": "La majorité simple",
  "La maggioranza assoluta": "La majorité absolue",
  "I due terzi": "Les deux tiers",
  "L'unanimità": "L'unanimité",
  "Due terzi dell'assemblea nei primi tre scrutini; dal quarto basta la maggioranza assoluta. La soglia alta all'inizio spinge a cercare un nome largamente condiviso.":
    "Les deux tiers de l'assemblée aux trois premiers tours ; à partir du quatrième, la majorité absolue suffit. Le seuil élevé au départ pousse à chercher un nom largement accepté.",
  "Che maggioranza basta dal quarto scrutinio in poi?":
    "Quelle majorité suffit à partir du quatrième tour ?",
  "I tre quinti": "Les trois cinquièmes",
  "La maggioranza dei presenti": "La majorité des présents",
  "La maggioranza assoluta dei componenti. È il momento in cui l'elezione diventa possibile per una coalizione senza bisogno dell'opposizione.":
    "La majorité absolue des membres. C'est le moment où l'élection devient possible pour une coalition sans le concours de l'opposition.",
  "Chi sono i franchi tiratori in un'elezione presidenziale?":
    "Qui sont les francs-tireurs dans une élection présidentielle ?",
  "I delegati regionali che votano per ultimi": "Les délégués régionaux qui votent en dernier",
  "I parlamentari che votano diversamente da quanto indicato dal proprio gruppo":
    "Les parlementaires qui votent autrement que ne l'a indiqué leur groupe",
  "I senatori a vita": "Les sénateurs à vie",
  "Gli scrutatori incaricati dello spoglio": "Les scrutateurs chargés du dépouillement",
  "Il voto è segreto, e la segretezza permette di disobbedire al gruppo senza che si sappia chi è stato. Alcune elezioni sono naufragate proprio su questo, richiedendo decine di scrutini.":
    "Le vote est secret, et ce secret permet de désobéir à son groupe sans qu'on sache qui l'a fait. Des élections ont sombré là-dessus, exigeant des dizaines de tours.",
  "Chi presiede il Consiglio superiore della magistratura?":
    "Qui préside le Conseil supérieur de la magistrature ?",
  "Il ministro della Giustizia": "Le ministre de la Justice",
  "Il primo presidente della Cassazione": "Le premier président de la Cour de cassation",
  "Il presidente della Corte costituzionale": "Le président de la Cour constitutionnelle",
  "Lo presiede il capo dello Stato, come garanzia di indipendenza. Il primo presidente della Cassazione e il procuratore generale ne fanno parte di diritto, e il ministro della Giustizia non ne fa parte affatto.":
    "C'est le chef de l'État qui le préside, en garantie d'indépendance. Le premier président de la Cour de cassation et le procureur général en font partie de droit, et le ministre de la Justice n'en fait pas partie du tout.",
  "Quanti giudici costituzionali nomina il Presidente della Repubblica?":
    "Combien de juges constitutionnels le président de la République nomme-t-il ?",
  "Cinque su quindici. Altri cinque li elegge il Parlamento in seduta comune e cinque vengono dalle supreme magistrature.":
    "Cinq sur quinze. Cinq autres sont élus par le Parlement en séance commune et cinq viennent des juridictions suprêmes.",
  "Per quali atti il Presidente della Repubblica può essere chiamato a rispondere?":
    "De quels actes le président de la République peut-il avoir à répondre ?",
  "Per qualsiasi reato, come ogni cittadino": "De toute infraction, comme n'importe quel citoyen",
  "Per alto tradimento e attentato alla Costituzione":
    "De haute trahison et d'atteinte à la Constitution",
  "Per le leggi che promulga": "Des lois qu'il promulgue",
  "Per nessun atto, in nessun caso": "D'aucun acte, en aucun cas",
  "Solo per questi due. Per il resto degli atti compiuti nell'esercizio delle funzioni non è responsabile: risponde il ministro che li controfirma.":
    "De ces deux-là seulement. Pour les autres actes accomplis dans l'exercice de ses fonctions, il n'est pas responsable : c'est le ministre qui contresigne qui en répond.",
  "A che cosa serve la controfirma ministeriale?": "À quoi sert le contreseing ministériel ?",
  "A certificare la firma del Presidente": "À certifier la signature du président",
  "A far assumere al ministro la responsabilità dell'atto":
    "À faire assumer au ministre la responsabilité de l'acte",
  "A rendere l'atto immediatamente esecutivo": "À rendre l'acte immédiatement exécutoire",
  "A trasmettere l'atto alla Corte costituzionale":
    "À transmettre l'acte à la Cour constitutionnelle",
  "L'articolo 89 lega ogni atto presidenziale alla firma del ministro proponente, che se ne assume la responsabilità. È il modo di conciliare un capo dello Stato irresponsabile con un sistema in cui qualcuno deve rispondere.":
    "L'article 89 lie chaque acte du président à la signature du ministre qui l'a proposé, lequel en assume la responsabilité. C'est la façon de concilier un chef de l'État irresponsable avec un système où quelqu'un doit répondre.",
  "Quale di questi poteri spetta al Presidente della Repubblica?":
    "Lequel de ces pouvoirs revient au président de la République ?",
  "Approvare il bilancio": "Adopter le budget",
  "Concedere la grazia": "Accorder la grâce",
  "Nominare i sindaci": "Nommer les maires",
  "Fissare le aliquote fiscali": "Fixer les taux d'imposition",
  "La grazia è un potere presidenziale. Bilancio e tasse spettano al Parlamento e al governo, e i sindaci li eleggono i cittadini.":
    "La grâce est un pouvoir présidentiel. Le budget et les impôts reviennent au Parlement et au gouvernement, et les maires sont élus par les habitants.",
  "Chi giudica il Presidente messo in stato d'accusa?":
    "Qui juge le président mis en accusation ?",
  "La Corte di cassazione": "La Cour de cassation",
  "Il Parlamento in seduta comune": "Le Parlement en séance commune",
  "La Corte costituzionale integrata da sedici membri esterni":
    "La Cour constitutionnelle complétée par seize membres extérieurs",
  "Un tribunale ordinario di Roma": "Un tribunal ordinaire de Rome",
  "La Corte costituzionale, allargata a sedici giudici aggregati sorteggiati da un elenco di cittadini. Il Parlamento in seduta comune mette in stato d'accusa, ma non giudica.":
    "La Cour constitutionnelle, élargie à seize juges adjoints tirés au sort sur une liste de citoyens. Le Parlement en séance commune met en accusation, mais ne juge pas.",
  "Chi mette il Presidente in stato d'accusa?": "Qui met le président en accusation ?",
  "La sola Camera dei deputati": "La seule Chambre des députés",
  "Il Consiglio dei ministri": "Le Conseil des ministres",
  "La Corte costituzionale d'ufficio": "La Cour constitutionnelle, d'office",
  "Il Parlamento in seduta comune, a maggioranza assoluta. Poi il giudizio passa alla Corte costituzionale nella sua composizione allargata.":
    "Le Parlement en séance commune, à la majorité absolue. Le jugement passe ensuite à la Cour constitutionnelle dans sa composition élargie.",
  "Quale articolo dichiara la magistratura autonoma e indipendente?":
    "Quel article déclare la magistrature autonome et indépendante ?",
  "L'articolo 104": "L'article 104",
  "L'articolo 112": "L'article 112",
  "L'articolo 104. Il 101 stabilisce che i giudici sono soggetti soltanto alla legge, il 112 l'obbligatorietà dell'azione penale e il 24 il diritto di difesa.":
    "L'article 104. Le 101 pose que les juges ne sont soumis qu'à la loi, le 112 le caractère obligatoire de l'action publique et le 24 le droit de se défendre.",
  "A che cosa sono soggetti i giudici secondo la Costituzione?":
    "À quoi les juges sont-ils soumis selon la Constitution ?",
  "Al ministro della Giustizia": "Au ministre de la Justice",
  "Soltanto alla legge": "À la loi seule",
  "Alle direttive del CSM": "Aux directives du CSM",
  "Al Presidente della Repubblica": "Au président de la République",
  "Soltanto alla legge, dice l'articolo 101. Il CSM gestisce le carriere ma non può dire a un giudice come decidere, e il ministro non ha alcun potere sulle sentenze.":
    "À la loi seule, dit l'article 101. Le CSM gère les carrières mais ne peut dire à un juge comment trancher, et le ministre n'a aucun pouvoir sur les jugements.",
  "Che cosa comporta l'obbligatorietà dell'azione penale?":
    "Qu'emporte le caractère obligatoire de l'action publique ?",
  "Che il pubblico ministero deve procedere su ogni notizia di reato":
    "Que le ministère public doit engager des poursuites sur toute dénonciation d'infraction",
  "Che ogni processo deve concludersi entro un anno": "Que tout procès doit s'achever en un an",
  "Che l'imputato deve essere sempre difeso da un avvocato":
    "Que le prévenu doit toujours être défendu par un avocat",
  "Che ogni condanna prevede il carcere": "Que toute condamnation entraîne la prison",
  "Ricevuta una notizia di reato, il pubblico ministero non può scegliere di lasciar perdere. In teoria elimina ogni discrezionalità politica; nella pratica, con più fascicoli che magistrati, la scelta si sposta sull'ordine delle priorità.":
    "Une fois saisi d'une infraction, le ministère public ne peut choisir de laisser courir. En théorie, cela supprime toute latitude politique ; en pratique, avec plus de dossiers que de magistrats, le choix se déplace vers l'ordre des priorités.",
  "Quale articolo stabilisce l'obbligatorietà dell'azione penale?":
    "Quel article pose le caractère obligatoire de l'action publique ?",
  "L'articolo 112. È uno degli articoli più discussi della Costituzione, perché la sua attuazione dipende da quante risorse ha la giustizia.":
    "L'article 112. C'est l'un des articles les plus discutés de la Constitution, parce que son application dépend des moyens dont dispose la justice.",
  "Quanti gradi di giudizio prevede il sistema italiano?":
    "Combien de degrés de juridiction le système italien prévoit-il ?",
  "Primo grado, appello e Cassazione. I primi due esaminano i fatti, il terzo soltanto la corretta applicazione della legge.":
    "Première instance, appel et cassation. Les deux premiers examinent les faits, le troisième seulement la bonne application de la loi.",
  "Quando una sentenza penale diventa definitiva?":
    "Quand un jugement pénal devient-il définitif ?",
  "Alla fine del primo grado": "À la fin de la première instance",
  "Dopo l'appello": "Après l'appel",
  "Dopo la pronuncia della Cassazione": "Après l'arrêt de la Cour de cassation",
  "Dopo la conferma della Corte costituzionale":
    "Après confirmation par la Cour constitutionnelle",
  "Passa in giudicato dopo la Cassazione. Fino ad allora vale l'articolo 27: l'imputato non è considerato colpevole. La Corte costituzionale non entra nei processi: giudica le leggi.":
    "Il passe en force de chose jugée après la cassation. Jusque-là vaut l'article 27 : le prévenu n'est pas tenu pour coupable. La Cour constitutionnelle n'entre pas dans les procès : elle juge les lois.",
  "Dove ha sede la Corte costituzionale?": "Où siège la Cour constitutionnelle ?",
  "A Palazzo della Consulta": "Au palais de la Consulta",
  "Palazzo della Consulta, di fronte al Quirinale. Per questo la Corte viene chiamata semplicemente la Consulta.":
    "Le palais de la Consulta, en face du Quirinal. C'est pourquoi on appelle simplement la Cour la Consulta.",
  "Quanto dura il mandato di un giudice costituzionale?":
    "Combien de temps dure le mandat d'un juge constitutionnel ?",
  "A vita": "À vie",
  "Nove anni. Più lungo di una legislatura e del mandato presidenziale, così che nessun giudice debba qualcosa a chi lo ha nominato.":
    "Neuf ans. Plus long qu'une législature et que le mandat présidentiel, afin qu'aucun juge ne doive rien à qui l'a nommé.",
  "Un giudice costituzionale può essere rinominato alla scadenza?":
    "Un juge constitutionnel peut-il être renommé à l'échéance ?",
  "Sì, una volta": "Oui, une fois",
  "Sì, senza limiti": "Oui, sans limite",
  "No: il mandato non è rinnovabile": "Non : le mandat n'est pas renouvelable",
  "Solo se lo propone il Presidente della Repubblica":
    "Seulement si le président de la République le propose",
  "Non è rinnovabile, ed è parte della garanzia: un giudice che non può sperare in un secondo mandato non ha ragione di compiacere chi lo ha scelto.":
    "Il n'est pas renouvelable, et cela fait partie de la garantie : un juge qui ne peut espérer un second mandat n'a aucune raison de plaire à qui l'a choisi.",
  "Quale di questi compiti NON spetta alla Corte costituzionale?":
    "Laquelle de ces tâches ne revient PAS à la Cour constitutionnelle ?",
  "Giudicare la legittimità costituzionale delle leggi": "Juger de la constitutionnalité des lois",
  "Decidere i conflitti di attribuzione fra Stato e regioni":
    "Trancher les conflits d'attribution entre l'État et les régions",
  "Giudicare in appello i processi penali": "Juger en appel les procès pénaux",
  "Decidere se un referendum abrogativo è ammissibile":
    "Décider si un référendum abrogatif est recevable",
  "L'appello spetta alla magistratura ordinaria. La Corte costituzionale giudica leggi, conflitti fra poteri, accuse contro il Presidente e ammissibilità dei referendum: mai un imputato.":
    "L'appel revient à la justice ordinaire. La Cour constitutionnelle juge des lois, des conflits entre pouvoirs, des accusations contre le président et de la recevabilité des référendums : jamais un prévenu.",
  "Da quando perde efficacia una legge dichiarata incostituzionale?":
    "À partir de quand une loi déclarée inconstitutionnelle cesse-t-elle de produire effet ?",
  "Dal giorno in cui era stata approvata": "Du jour où elle avait été adoptée",
  "Dal giorno successivo alla pubblicazione della sentenza":
    "Du lendemain de la publication de la décision",
  "Dopo un anno, per dare tempo al Parlamento":
    "Au bout d'un an, pour laisser du temps au Parlement",
  "Solo se il Parlamento la abroga": "Seulement si le Parlement l'abroge",
  "Cessa di avere efficacia dal giorno dopo la pubblicazione della decisione. Non serve alcun intervento del Parlamento: la norma esce dall'ordinamento da sola.":
    "Elle cesse de produire effet dès le lendemain de la publication de la décision. Aucune intervention du Parlement n'est nécessaire : la norme sort de l'ordre juridique d'elle-même.",
  "Chi decide trasferimenti, promozioni e provvedimenti disciplinari dei magistrati?":
    "Qui décide des mutations, des promotions et des sanctions disciplinaires des magistrats ?",
  "Il Consiglio superiore della magistratura": "Le Conseil supérieur de la magistrature",
  "Il CSM, presieduto dal Presidente della Repubblica. Tenere queste decisioni fuori dal governo è ciò che rende concreta l'indipendenza dell'articolo 104.":
    "Le CSM, présidé par le président de la République. Tenir ces décisions hors du gouvernement est ce qui rend concrète l'indépendance de l'article 104.",
  "Con quale nome viene comunemente indicata la Corte costituzionale?":
    "Sous quel nom désigne-t-on couramment la Cour constitutionnelle ?",
  "La Cassazione": "La Cassation",
  "La Consulta": "La Consulta",
  "La Corte dei conti": "La Cour des comptes",
  "La Consulta, dal palazzo che la ospita. La Corte dei conti è un altro organo, che controlla la spesa pubblica.":
    "La Consulta, du nom du palais qui l'abrite. La Cour des comptes est un autre organe, qui contrôle la dépense publique.",
  "Quante sono le regioni italiane?": "Combien y a-t-il de régions italiennes ?",
  "Ventidue": "Vingt-deux",
  "Venti, di cui cinque a statuto speciale e quindici a statuto ordinario.":
    "Vingt, dont cinq à statut spécial et quinze à statut ordinaire.",
  "In che anno è stato riformato il Titolo V della Costituzione?":
    "En quelle année le titre V de la Constitution a-t-il été réformé ?",
  "Nel 1993": "En 1993",
  "Nel 2020": "En 2020",
  "Nel 2001. La riforma ha ribaltato il criterio delle competenze e ha messo lo Stato per ultimo nell'elenco degli enti della Repubblica.":
    "En 2001. La réforme a renversé le critère des compétences et a placé l'État en dernier dans la liste des collectivités de la République.",
  "Dopo la riforma del 2001, a chi spettano le materie non elencate nella Costituzione?":
    "Après la réforme de 2001, à qui reviennent les matières que la Constitution n'énumère pas ?",
  "Allo Stato": "À l'État",
  "Alle regioni": "Aux régions",
  "Ai comuni": "Aux communes",
  "Sono decise di volta in volta dalla Corte costituzionale":
    "La Cour constitutionnelle en décide au cas par cas",
  "Alle regioni. Prima valeva il criterio opposto: le regioni potevano legiferare solo sulle materie espressamente elencate. Il ribaltamento ha però moltiplicato i conflitti davanti alla Corte.":
    "Aux régions. Auparavant valait le critère inverse : les régions ne pouvaient légiférer que sur les matières expressément énumérées. Ce renversement a toutefois multiplié les conflits devant la Cour.",
  "Quali sono le due province autonome italiane?":
    "Quelles sont les deux provinces autonomes italiennes ?",
  "Trieste e Gorizia": "Trieste et Gorizia",
  "Trento e Bolzano": "Trente et Bolzano",
  "Aosta e Sondrio": "Aoste et Sondrio",
  "Cagliari e Sassari": "Cagliari et Sassari",
  "Trento e Bolzano, che dentro il Trentino-Alto Adige hanno più poteri della regione stessa. È l'assetto nato dalla tutela della minoranza di lingua tedesca.":
    "Trente et Bolzano, qui, à l'intérieur du Trentin-Haut-Adige, ont plus de pouvoirs que la région elle-même. C'est l'ordre né de la protection de la minorité de langue allemande.",
  "Quante sono le città metropolitane?": "Combien y a-t-il de villes métropolitaines ?",
  "Quattordici": "Quatorze",
  "Quattordici, istituite dal 2015 al posto delle province nei territori dei grandi capoluoghi. Il sindaco del capoluogo ne è anche sindaco metropolitano.":
    "Quatorze, instituées depuis 2015 à la place des provinces sur le territoire des grands chefs-lieux. Le maire du chef-lieu en est aussi le maire métropolitain.",
  "Perché la Sicilia ha uno statuto speciale?": "Pourquoi la Sicile a-t-elle un statut spécial ?",
  "Perché è la regione più popolosa": "Parce que c'est la région la plus peuplée",
  "Perché è un'isola con un forte movimento autonomista nel dopoguerra":
    "Parce que c'est une île où le mouvement autonomiste était fort après la guerre",
  "Perché ospita una minoranza linguistica riconosciuta":
    "Parce qu'elle abrite une minorité linguistique reconnue",
  "Perché confina con uno Stato estero": "Parce qu'elle a une frontière avec un État étranger",
  "Lo statuto siciliano è del 1946, precedente alla Costituzione stessa: fu concesso mentre il movimento indipendentista era forte. Le altre speciali nascono da minoranze linguistiche o da confini contesi.":
    "Le statut sicilien date de 1946, antérieur à la Constitution elle-même : il fut accordé alors que le mouvement indépendantiste était fort. Les autres régions spéciales naissent de minorités linguistiques ou de frontières disputées.",
  "Quanti sono all'incirca i comuni italiani?":
    "Combien y a-t-il à peu près de communes italiennes ?",
  "Ottocento": "Huit cents",
  "Duemila": "Deux mille",
  "Ottomila": "Huit mille",
  "Ventimila": "Vingt mille",
  "Circa ottomila, dalle grandi città a paesi di poche decine di abitanti. La frammentazione è tale che da anni si discute di accorpare i più piccoli.":
    "Huit mille environ, des grandes villes à des villages de quelques dizaines d'habitants. L'émiettement est tel qu'on discute depuis des années de regrouper les plus petites.",
  "Che cosa comporta la regola per cui consiglio e presidente regionale stanno o cadono insieme?":
    "Qu'emporte la règle qui fait tenir ou tomber ensemble le conseil et le président de région ?",
  "Che il presidente può sciogliere il consiglio quando vuole":
    "Que le président peut dissoudre le conseil quand il veut",
  "Che se il presidente cade, si torna al voto per entrambi":
    "Que si le président tombe, on retourne aux urnes pour les deux",
  "Che il consiglio elegge il presidente fra i propri membri":
    "Que le conseil élit le président parmi ses membres",
  "Che il presidente non può essere sfiduciato": "Que le président ne peut être censuré",
  "Dimissioni, sfiducia o impedimento del presidente sciolgono anche il consiglio e portano a nuove elezioni. Serve a evitare che una regione resti anni senza guida mentre si cercano maggioranze in aula.":
    "La démission, la censure ou l'empêchement du président dissolvent aussi le conseil et mènent à de nouvelles élections. Cela évite qu'une région reste des années sans direction pendant qu'on cherche des majorités en séance.",
  "Il titolo di governatore per il presidente di una regione è ufficiale?":
    "Le titre de gouverneur pour le président d'une région est-il officiel ?",
  "Sì, è previsto dalla Costituzione": "Oui, la Constitution le prévoit",
  "Sì, dal 2001": "Oui, depuis 2001",
  "No: è un uso giornalistico": "Non : c'est un usage de journalistes",
  "Sì, ma solo nelle regioni a statuto speciale":
    "Oui, mais seulement dans les régions à statut spécial",
  "La Costituzione parla di Presidente della Giunta regionale. Governatore è entrato dall'uso dei giornali, per analogia con gli Stati americani, e non ha alcun valore giuridico.":
    "La Constitution parle de président de la junte régionale. « Gouverneur » est entré par l'usage des journaux, par analogie avec les États américains, et n'a aucune valeur juridique.",
  "Chi approva le leggi regionali?": "Qui adopte les lois régionales ?",
  "Il consiglio regionale": "Le conseil régional",
  "La giunta regionale": "La junte régionale",
  "Il prefetto": "Le préfet",
  "Il Parlamento nazionale": "Le Parlement national",
  "Il consiglio regionale legifera, la giunta governa. È la stessa distinzione che a livello nazionale corre fra Parlamento e governo.":
    "Le conseil régional légifère, la junte gouverne. C'est la même distinction qu'à l'échelle nationale entre Parlement et gouvernement.",
  "Sopra quale soglia di abitanti l'elezione del sindaco prevede il ballottaggio?":
    "Au-dessus de quel nombre d'habitants l'élection du maire prévoit-elle un second tour ?",
  "Cinquemila": "Cinq mille",
  "Quindicimila": "Quinze mille",
  "Quindicimila abitanti. Nei comuni più piccoli si vince al primo turno con la maggioranza relativa, senza secondo turno.":
    "Quinze mille habitants. Dans les communes plus petites, on l'emporte au premier tour à la majorité relative, sans second tour.",
  "Chi rappresenta il governo nazionale in ogni provincia?":
    "Qui représente le gouvernement national dans chaque province ?",
  "Il presidente della provincia": "Le président de la province",
  "Il questore": "Le questore",
  "Il sindaco del capoluogo": "Le maire du chef-lieu",
  "Il prefetto, che dipende dal Ministero dell'interno. È lui a ricevere le domande di cittadinanza e a firmare gli accordi di integrazione: non è un organo eletto e non appartiene all'ente locale.":
    "Le préfet, qui relève du ministère de l'Intérieur. C'est lui qui reçoit les demandes de nationalité et signe les accords d'intégration : ce n'est pas un organe élu et il n'appartient pas à la collectivité locale.",
  "Quale di queste materie resta di competenza esclusiva dello Stato?":
    "Laquelle de ces matières reste de la compétence exclusive de l'État ?",
  "Il turismo": "Le tourisme",
  "L'agricoltura": "L'agriculture",
  "L'immigrazione": "L'immigration",
  "L'artigianato": "L'artisanat",
  "Immigrazione, difesa, moneta e giustizia sono fra le materie esclusive dello Stato. Turismo, agricoltura e artigianato ricadono invece nella competenza regionale.":
    "L'immigration, la défense, la monnaie et la justice comptent parmi les matières exclusives de l'État. Le tourisme, l'agriculture et l'artisanat relèvent en revanche de la compétence régionale.",
  "A quale anno la tradizione assegna la fondazione di Roma?":
    "À quelle année la tradition rapporte-t-elle la fondation de Rome ?",
  "753 avanti Cristo": "753 avant Jésus-Christ",
  "509 avanti Cristo": "509 avant Jésus-Christ",
  "27 avanti Cristo": "27 avant Jésus-Christ",
  "476 dopo Cristo": "476 après Jésus-Christ",
  "Il 753 avanti Cristo, per convenzione degli storici antichi. Il 509 è la repubblica, il 27 l'inizio dell'impero e il 476 la sua fine in Occidente.":
    "753 avant Jésus-Christ, par convention des historiens anciens. 509 est la république, 27 le début de l'empire et 476 sa fin en Occident.",
  "Chi depone l'ultimo imperatore romano d'Occidente?":
    "Qui dépose le dernier empereur romain d'Occident ?",
  "Attila": "Attila",
  "Odoacre": "Odoacre",
  "Teodorico": "Théodoric",
  "Alarico": "Alaric",
  "Odoacre depone Romolo Augustolo nel 476. Teodorico governerà l'Italia poco dopo, e Attila e Alarico avevano guidato incursioni precedenti senza deporre nessuno.":
    "Odoacre dépose Romulus Augustule en 476. Théodoric gouvernera l'Italie peu après, et Attila comme Alaric avaient mené des incursions antérieures sans déposer personne.",
  "In quale anno i Longobardi entrano in Italia?":
    "En quelle année les Lombards entrent-ils en Italie ?",
  "Nel 568": "En 568",
  "Nel 774": "En 774",
  "Nel 1130": "En 1130",
  "Nel 568. Si insediano al centro e al nord, e resteranno fino alla sconfitta contro Carlo Magno nel 774.":
    "En 568. Ils s'installent au centre et au nord, et resteront jusqu'à leur défaite devant Charlemagne en 774.",
  "Chi sconfigge i Longobardi nel 774?": "Qui bat les Lombards en 774 ?",
  "Costantino": "Constantin",
  "Giustiniano": "Justinien",
  "Carlo Magno": "Charlemagne",
  "Federico Barbarossa": "Frédéric Barberousse",
  "Carlo Magno prende Pavia e assume la corona longobarda. Le terre donate al papa consolidano il nucleo dello Stato della Chiesa.":
    "Charlemagne prend Pavie et ceint la couronne lombarde. Les terres données au pape affermissent le noyau des États de l'Église.",
  "Quali erano le quattro repubbliche marinare?":
    "Quelles étaient les quatre républiques maritimes ?",
  "Amalfi, Pisa, Genova e Venezia": "Amalfi, Pise, Gênes et Venise",
  "Napoli, Bari, Palermo e Messina": "Naples, Bari, Palerme et Messine",
  "Milano, Firenze, Siena e Lucca": "Milan, Florence, Sienne et Lucques",
  "Ravenna, Rimini, Ancona e Trieste": "Ravenne, Rimini, Ancône et Trieste",
  "Amalfi, Pisa, Genova e Venezia. Costruirono flotte, colonie e banche, e portarono in Italia la contabilità moderna e la lettera di cambio.":
    "Amalfi, Pise, Gênes et Venise. Elles bâtirent des flottes, des comptoirs et des banques, et apportèrent en Italie la comptabilité moderne et la lettre de change.",
  "In quale anno la Lega Lombarda sconfigge Federico Barbarossa a Legnano?":
    "En quelle année la Ligue lombarde bat-elle Frédéric Barberousse à Legnano ?",
  "Nel 1176": "En 1176",
  "Nel 1183": "En 1183",
  "Nel 1250": "En 1250",
  "Nel 1176. La pace che ne consegue, quella di Costanza, è del 1183: la battaglia e il trattato sono due date distinte, a sette anni di distanza.":
    "En 1176. La paix qui s'ensuit, celle de Constance, est de 1183 : la bataille et le traité sont deux dates distinctes, à sept ans d'écart.",
  "Che cosa fondano i Normanni nel Sud nel 1130?":
    "Que fondent les Normands dans le Sud en 1130 ?",
  "La Repubblica di Amalfi": "La république d'Amalfi",
  "Il Regno di Sicilia, primo Stato accentrato d'Europa":
    "Le royaume de Sicile, premier État centralisé d'Europe",
  "Il Ducato di Benevento": "Le duché de Bénévent",
  "Ruggero II unisce Sicilia e Italia meridionale in un regno con amministrazione centrale, catasto e burocrazia stabile, quando il resto d'Europa è ancora feudale.":
    "Roger II réunit la Sicile et l'Italie du Sud en un royaume doté d'une administration centrale, d'un cadastre et d'une bureaucratie stable, quand le reste de l'Europe est encore féodal.",
  "Qual è la più antica università del mondo occidentale ancora attiva?":
    "Quelle est la plus ancienne université du monde occidental encore en activité ?",
  "Padova": "Padoue",
  "Salerno": "Salerne",
  "Bologna, dal 1088. Nasce come corporazione di studenti che assumono i propri maestri, e vi si studia soprattutto diritto.":
    "Bologne, depuis 1088. Elle naît comme une corporation d'étudiants qui engagent leurs propres maîtres, et l'on y étudie surtout le droit.",
  "Che cosa succede ai Comuni nel corso del Trecento?":
    "Qu'advient-il des communes au cours du quatorzième siècle ?",
  "Si uniscono in un regno del Nord": "Elles s'unissent en un royaume du Nord",
  "Vengono riassorbiti dall'impero": "Elles sont reprises par l'empire",
  "Le lotte fra fazioni li trasformano in signorie":
    "Les luttes de factions les changent en seigneuries",
  "Passano tutti sotto lo Stato della Chiesa": "Elles passent toutes sous les États de l'Église",
  "Le istituzioni comunali si logorano nelle lotte interne, e in una città dopo l'altra una famiglia prende il potere in modo stabile. Le signorie diventeranno poi principati riconosciuti.":
    "Les institutions communales s'usent dans les luttes intérieures, et dans une ville après l'autre une famille prend durablement le pouvoir. Les seigneuries deviendront ensuite des principautés reconnues.",
  "Che cosa concede l'editto di Milano del 313?": "Qu'accorde l'édit de Milan de 313 ?",
  "La cittadinanza a tutti gli abitanti dell'impero":
    "La citoyenneté à tous les habitants de l'empire",
  "La libertà di culto ai cristiani": "La liberté de culte aux chrétiens",
  "L'autonomia alle città della Padania": "L'autonomie aux villes de la plaine du Pô",
  "L'esenzione fiscale ai senatori": "L'exemption d'impôt aux sénateurs",
  "Costantino pone fine alle persecuzioni. Per l'Italia significa l'inizio del ruolo di Roma come centro religioso, che le resterà anche quando avrà perso ogni altro potere.":
    "Constantin met fin aux persécutions. Pour l'Italie, c'est le début du rôle de Rome comme centre religieux, qui lui restera même quand elle aura perdu tout autre pouvoir.",
  "Che cosa significava in origine la parola università?":
    "Que signifiait à l'origine le mot université ?",
  "Universalità del sapere": "L'universalité du savoir",
  "Corporazione": "Une corporation",
  "Edificio pubblico": "Un bâtiment public",
  "Biblioteca": "Une bibliothèque",
  "Indicava una corporazione, come quelle degli artigiani. A Bologna erano gli studenti a riunirsi in corporazione e ad assumere i docenti: l'esatto contrario dell'organizzazione odierna.":
    "Il désignait une corporation, comme celles des artisans. À Bologne, c'étaient les étudiants qui se réunissaient en corporation et engageaient les maîtres : l'exact contraire de l'organisation d'aujourd'hui.",
  "Quale eredità romana è ancora l'ossatura del codice civile italiano?":
    "Quel héritage romain forme encore l'ossature du code civil italien ?",
  "Il calendario": "Le calendrier",
  "Il diritto romano": "Le droit romain",
  "Le strade consolari": "Les voies consulaires",
  "Il latino ecclesiastico": "Le latin d'Église",
  "Il diritto romano, riscoperto e insegnato nelle università medievali, sta alla base del diritto civile di gran parte dell'Europa continentale.":
    "Le droit romain, redécouvert et enseigné dans les universités médiévales, est au fondement du droit civil d'une grande partie de l'Europe continentale.",
  "Da che cosa deriva storicamente il campanilismo italiano?":
    "D'où vient historiquement l'esprit de clocher italien ?",
  "Dalla rivalità fra le squadre di calcio": "De la rivalité entre les clubs de football",
  "Da secoli in cui la città vicina era davvero un altro Stato":
    "De siècles pendant lesquels la ville voisine était vraiment un autre État",
  "Dalle divisioni introdotte dal fascismo": "Des divisions introduites par le fascisme",
  "Dalla riforma delle regioni del 1970": "De la réforme des régions de 1970",
  "Decine di città indipendenti, ciascuna con leggi, monete e milizie proprie, a poche decine di chilometri l'una dall'altra. Il campanilismo è il residuo di quell'assetto, non un tratto caratteriale.":
    "Des dizaines de villes indépendantes, chacune avec ses lois, sa monnaie et sa milice, à quelques dizaines de kilomètres l'une de l'autre. L'esprit de clocher est le reste de cet ordre-là, non un trait de caractère.",
  "Chi era Lorenzo il Magnifico?": "Qui était Laurent le Magnifique ?",
  "Un banchiere che governava Firenze senza cariche formali":
    "Un banquier qui gouvernait Florence sans charge officielle",
  "Il duca di Milano": "Le duc de Milan",
  "Un papa del Rinascimento": "Un pape de la Renaissance",
  "Il primo re di Napoli": "Le premier roi de Naples",
  "I Medici erano banchieri prima che signori: governavano comprando consenso, sposando alleanze e finanziando artisti, senza bisogno di un titolo.":
    "Les Médicis étaient banquiers avant d'être seigneurs : ils gouvernaient en achetant les faveurs, en scellant des alliances par mariage et en payant des artistes, sans avoir besoin d'un titre.",
  "In quale anno muore Lorenzo de' Medici?": "En quelle année meurt Laurent de Médicis ?",
  "Nel 1454": "En 1454",
  "Nel 1492": "En 1492",
  "Nel 1513": "En 1513",
  "Nel 1527": "En 1527",
  "Nel 1492, lo stesso anno del viaggio di Colombo. Due anni dopo Carlo VIII scende in Italia e l'equilibrio che Lorenzo aveva retto crolla.":
    "En 1492, l'année même du voyage de Colomb. Deux ans plus tard, Charles VIII descend en Italie et l'équilibre que Laurent avait tenu s'effondre.",
  "Chi scrive Il Principe, e in quale anno?": "Qui écrit Le Prince, et en quelle année ?",
  "Machiavelli, nel 1513": "Machiavel, en 1513",
  "Guicciardini, nel 1540": "Guichardin, en 1540",
  "Castiglione, nel 1528": "Castiglione, en 1528",
  "Machiavelli, nel 1492": "Machiavel, en 1492",
  "Machiavelli lo scrive nel 1513, in esilio dopo il ritorno dei Medici a Firenze. È il primo libro che osserva il potere per come funziona invece che per come dovrebbe essere.":
    "Machiavel l'écrit en 1513, en exil après le retour des Médicis à Florence. C'est le premier livre qui regarde le pouvoir tel qu'il fonctionne au lieu de tel qu'il devrait être.",
  "Che cos'è il sacco di Roma del 1527?": "Qu'est-ce que le sac de Rome de 1527 ?",
  "Un'incursione dei pirati saraceni": "Une incursion de pirates sarrasins",
  "Il saccheggio della città da parte dei lanzichenecchi imperiali":
    "Le pillage de la ville par les lansquenets impériaux",
  "La presa di Roma da parte dei bersaglieri": "La prise de Rome par les bersagliers",
  "Un'epidemia di peste": "Une épidémie de peste",
  "Le truppe di Carlo V, rimaste senza paga, presero e devastarono la città per mesi. Gli storici usano questa data per segnare la fine del Rinascimento come stagione fiduciosa.":
    "Les troupes de Charles Quint, restées sans solde, prirent et dévastèrent la ville pendant des mois. Les historiens retiennent cette date pour marquer la fin de la Renaissance comme saison confiante.",
  "Quale pace chiude nel 1559 le guerre d'Italia?":
    "Quelle paix met fin en 1559 aux guerres d'Italie ?",
  "La pace di Lodi": "La paix de Lodi",
  "La pace di Costanza": "La paix de Constance",
  "La pace di Cateau-Cambrésis": "La paix du Cateau-Cambrésis",
  "La pace di Westfalia": "La paix de Westphalie",
  "Cateau-Cambrésis. Lodi era del 1454 e riguardava l'equilibrio interno; Costanza del 1183 e riguardava i Comuni; Westfalia del 1648 e riguardava la Germania.":
    "Le Cateau-Cambrésis. Lodi datait de 1454 et concernait l'équilibre intérieur ; Constance de 1183 et concernait les communes ; la Westphalie de 1648 et concernait l'Allemagne.",
  "Quale potenza domina l'Italia dopo il 1559?": "Quelle puissance domine l'Italie après 1559 ?",
  "L'Austria": "L'Autriche",
  "L'Impero ottomano": "L'Empire ottoman",
  "La Spagna, per circa un secolo e mezzo, prima di cedere il posto all'Austria nel Settecento. Milano, Napoli, Sicilia e Sardegna passano alla corona spagnola.":
    "L'Espagne, pendant environ un siècle et demi, avant de céder la place à l'Autriche au dix-huitième siècle. Milan, Naples, la Sicile et la Sardaigne passent à la couronne espagnole.",
  "Quale istituzione diplomatica nasce nell'Italia dell'equilibrio di Lodi?":
    "Quelle institution diplomatique naît dans l'Italie de l'équilibre de Lodi ?",
  "Il congresso internazionale": "Le congrès international",
  "L'ambasciata permanente": "L'ambassade permanente",
  "Il tribunale arbitrale": "Le tribunal arbitral",
  "Il passaporto diplomatico": "Le passeport diplomatique",
  "Con cinque Stati che non possono prevalere l'uno sull'altro, la diplomazia sostituisce la guerra e nasce l'idea di tenere stabilmente un rappresentante presso l'altro. L'Europa adotterà la pratica per intera.":
    "Avec cinq États dont aucun ne peut l'emporter sur l'autre, la diplomatie remplace la guerre et naît l'idée d'entretenir à demeure un représentant chez l'autre. L'Europe adoptera la pratique tout entière.",
  "Che cosa accade a Galileo nel 1633?": "Qu'arrive-t-il à Galilée en 1633 ?",
  "Viene nominato matematico di corte": "Il est nommé mathématicien de cour",
  "Pubblica il primo trattato sul telescopio": "Il publie le premier traité sur la lunette",
  "È processato e costretto ad abiurare": "Il est jugé et contraint d'abjurer",
  "Viene eletto all'Accademia della Crusca": "Il est élu à l'Accademia della Crusca",
  "Il processo lo costringe all'abiura e agli arresti domiciliari fino alla morte, per aver sostenuto che la Terra gira intorno al Sole.":
    "Le procès le contraint à l'abjuration et à la résidence surveillée jusqu'à sa mort, pour avoir soutenu que la Terre tourne autour du Soleil.",
  "In quale città nasce il melodramma, intorno al 1600?":
    "Dans quelle ville naît l'opéra, vers 1600 ?",
  "A Firenze, dagli esperimenti di un gruppo di musicisti e letterati. Diventerà la forma teatrale d'Europa, e Venezia e Napoli ne saranno poi le capitali.":
    "À Florence, des essais d'un cercle de musiciens et de lettrés. Il deviendra la forme théâtrale de l'Europe, et Venise puis Naples en seront les capitales.",
  "Quale potenza subentra alla Spagna in Italia nel Settecento?":
    "Quelle puissance succède à l'Espagne en Italie au dix-huitième siècle ?",
  "La Prussia": "La Prusse",
  "La Russia": "La Russie",
  "L'Austria, che governerà la Lombardia e poi il Veneto fino al Risorgimento. È la potenza contro cui si combatteranno le guerre d'indipendenza.":
    "L'Autriche, qui gouvernera la Lombardie puis la Vénétie jusqu'au Risorgimento. C'est la puissance contre laquelle se livreront les guerres d'indépendance.",
  "Perché i Medici poterono governare Firenze senza ricoprire cariche pubbliche?":
    "Pourquoi les Médicis purent-ils gouverner Florence sans occuper de charge publique ?",
  "Perché la legge fiorentina lo vietava ai nobili":
    "Parce que la loi florentine l'interdisait aux nobles",
  "Perché il loro potere veniva dalla banca, dal credito e dalle alleanze":
    "Parce que leur pouvoir venait de la banque, du crédit et des alliances",
  "Perché erano stati nominati dall'imperatore": "Parce que l'empereur les avait nommés",
  "Perché la città non aveva istituzioni": "Parce que la ville n'avait pas d'institutions",
  "Erano banchieri: prestavano a chi contava, finanziavano artisti e combinavano matrimoni. Le istituzioni repubblicane restavano in piedi, ma decidevano quello che i Medici volevano.":
    "C'étaient des banquiers : ils prêtaient à ceux qui comptaient, payaient des artistes et arrangeaient des mariages. Les institutions républicaines restaient debout, mais décidaient ce que les Médicis voulaient.",
  "Quale famiglia governa Milano dopo i Visconti?":
    "Quelle famille gouverne Milan après les Visconti ?",
  "Gli Sforza": "Les Sforza",
  "Gli Este": "Les Este",
  "I Gonzaga": "Les Gonzague",
  "I Della Rovere": "Les Della Rovere",
  "Gli Sforza. Gli Este erano a Ferrara e i Gonzaga a Mantova: signorie diverse in città diverse, spesso confuse fra loro.":
    "Les Sforza. Les Este étaient à Ferrare et les Gonzague à Mantoue : des seigneuries différentes dans des villes différentes, que l'on confond souvent.",
  "Perché il Rinascimento italiano coincide con la perdita dell'indipendenza politica?":
    "Pourquoi la Renaissance italienne coïncide-t-elle avec la perte de l'indépendance politique ?",
  "Perché gli artisti lavoravano per committenti stranieri":
    "Parce que les artistes travaillaient pour des commanditaires étrangers",
  "Perché gli Stati italiani erano troppo piccoli per reggere l'urto degli Stati nazionali":
    "Parce que les États italiens étaient trop petits pour tenir devant les États nationaux",
  "Perché la cultura assorbiva le risorse militari":
    "Parce que la culture absorbait les moyens militaires",
  "Perché i papi impedivano l'unificazione": "Parce que les papes empêchaient l'unification",
  "Cinque Stati in equilibrio bastavano finché il confronto restava interno. Davanti a Francia e Spagna, capaci di schierare eserciti grandi, nessuno di essi poteva reggere da solo.":
    "Cinq États en équilibre suffisaient tant que l'affrontement restait intérieur. Devant la France et l'Espagne, capables d'aligner de grandes armées, aucun d'eux ne pouvait tenir seul.",
  "Chi fonda la Giovine Italia?": "Qui fonde la Jeune Italie ?",
  "Giuseppe Mazzini, dall'esilio. Voleva una repubblica unitaria fatta dal popolo, e passò la vita fuori dall'Italia che contribuì a creare.":
    "Giuseppe Mazzini, depuis l'exil. Il voulait une république unitaire faite par le peuple, et passa sa vie hors de l'Italie qu'il aida à créer.",
  "In quale anno nasce la Giovine Italia?": "En quelle année naît la Jeune Italie ?",
  "Nel 1815": "En 1815",
  "Nel 1831": "En 1831",
  "Nel 1848": "En 1848",
  "Nel 1831, a Marsiglia. Le sue insurrezioni fallirono quasi tutte, ma formarono la generazione che avrebbe fatto l'Unità.":
    "En 1831, à Marseille. Ses insurrections échouèrent presque toutes, mais elles formèrent la génération qui allait faire l'Unité.",
  "Che cosa stabilisce per l'Italia il congresso di Vienna?":
    "Qu'établit pour l'Italie le congrès de Vienne ?",
  "L'unificazione sotto i Savoia": "L'unification sous la maison de Savoie",
  "Il ritorno dei sovrani cacciati da Napoleone": "Le retour des souverains chassés par Napoléon",
  "La creazione di una confederazione italiana": "La création d'une confédération italienne",
  "L'indipendenza dello Stato della Chiesa dall'Austria":
    "L'indépendance des États de l'Église à l'égard de l'Autriche",
  "La restaurazione: l'Austria in Lombardia e Veneto, i Borbone a Napoli, il papa a Roma, i Savoia in Piemonte. L'idea nazionale però resta in circolazione.":
    "La restauration : l'Autriche en Lombardie et en Vénétie, les Bourbons à Naples, le pape à Rome, la maison de Savoie en Piémont. L'idée nationale, elle, continue de circuler.",
  "In quale anno viene concesso lo Statuto albertino?":
    "En quelle année le Statut albertin est-il octroyé ?",
  "Il 4 marzo 1848, nell'anno delle rivoluzioni europee. Resterà la costituzione dell'Italia unita per un secolo, fino al 1948.":
    "Le 4 mars 1848, l'année des révolutions européennes. Il restera la constitution de l'Italie unifiée pendant un siècle, jusqu'en 1948.",
  "Chi guida la spedizione dei Mille?": "Qui conduit l'expédition des Mille ?",
  "Giuseppe Garibaldi, con mille volontari partiti da Quarto. In pochi mesi conquistò un regno con un esercito assai più numeroso del suo.":
    "Giuseppe Garibaldi, avec mille volontaires partis de Quarto. En quelques mois, il conquit un royaume dont l'armée était bien plus nombreuse que la sienne.",
  "Dove sbarcano i Mille nel maggio 1860?": "Où les Mille débarquent-ils en mai 1860 ?",
  "A Napoli": "À Naples",
  "A Marsala": "À Marsala",
  "A Messina": "À Messine",
  "A Palermo": "À Palerme",
  "A Marsala, in Sicilia. Palermo cadde poche settimane dopo e Napoli entro l'autunno.":
    "À Marsala, en Sicile. Palerme tomba quelques semaines plus tard et Naples avant l'automne.",
  "Dove Garibaldi consegna a Vittorio Emanuele II il regno conquistato?":
    "Où Garibaldi remet-il à Victor-Emmanuel II le royaume conquis ?",
  "A Teano": "À Teano",
  "A Torino": "À Turin",
  "A Gaeta": "À Gaète",
  "L'incontro di Teano è uno dei gesti più discussi della storia italiana: un repubblicano che consegna un regno a un re, evitando una guerra fra italiani.":
    "La rencontre de Teano est l'un des gestes les plus discutés de l'histoire italienne : un républicain qui remet un royaume à un roi, évitant une guerre entre Italiens.",
  "In quale data viene proclamato il Regno d'Italia?":
    "À quelle date le royaume d'Italie est-il proclamé ?",
  "Il 4 marzo 1848": "Le 4 mars 1848",
  "Il 17 marzo 1861": "Le 17 mars 1861",
  "Il 20 settembre 1870": "Le 20 septembre 1870",
  "Il 17 marzo 1861. Il 20 settembre 1870 è la presa di Roma e il 2 giugno 1946 la nascita della Repubblica: tre date che si confondono facilmente.":
    "Le 17 mars 1861. Le 20 septembre 1870, c'est la prise de Rome, et le 2 juin 1946 la naissance de la République : trois dates que l'on confond aisément.",
  "Quali furono, nell'ordine, le capitali del Regno d'Italia?":
    "Quelles furent, dans l'ordre, les capitales du royaume d'Italie ?",
  "Roma, Torino, Firenze": "Rome, Turin, Florence",
  "Torino, Firenze, Roma": "Turin, Florence, Rome",
  "Milano, Torino, Roma": "Milan, Turin, Rome",
  "Torino, Milano, Roma": "Turin, Milan, Rome",
  "Torino fino al 1865, Firenze fino al 1871, poi Roma. Il nuovo Stato spostò il proprio centro tre volte in dieci anni.":
    "Turin jusqu'en 1865, Florence jusqu'en 1871, puis Rome. Le nouvel État déplaça son centre trois fois en dix ans.",
  "Perché il primo re d'Italia si chiama Vittorio Emanuele II e non I?":
    "Pourquoi le premier roi d'Italie s'appelle-t-il Victor-Emmanuel II et non premier du nom ?",
  "Perché il primo era stato suo padre": "Parce que le premier avait été son père",
  "Perché mantenne il numero che aveva come re di Sardegna":
    "Parce qu'il garda le numéro qu'il avait comme roi de Sardaigne",
  "Per un errore mai corretto negli atti ufficiali":
    "À cause d'une erreur jamais corrigée dans les actes officiels",
  "Perché il numero I era riservato al re longobardo":
    "Parce que le numéro premier était réservé au roi lombard",
  "Conservò la numerazione sabauda invece di ripartire da uno. È un dettaglio che dice come l'Unità fu vissuta al Sud: un'annessione al Piemonte più che una fondazione comune.":
    "Il garda la numérotation de la maison de Savoie au lieu de repartir de un. C'est un détail qui dit comment l'Unité fut vécue dans le Sud : une annexion au Piémont plutôt qu'une fondation commune.",
  "Quante persone lasciarono l'Italia fra il 1861 e il 1970?":
    "Combien de personnes quittèrent l'Italie entre 1861 et 1970 ?",
  "Circa otto milioni": "Environ huit millions",
  "Circa ventisei milioni": "Environ vingt-six millions",
  "Circa quaranta milioni": "Environ quarante millions",
  "Circa ventisei milioni, più della popolazione del paese al momento dell'Unità. È una delle emigrazioni più grandi della storia moderna.":
    "Environ vingt-six millions, plus que la population du pays au moment de l'Unité. C'est l'une des plus grandes émigrations de l'histoire moderne.",
  "Che cosa fu il brigantaggio postunitario?": "Que fut le brigandage d'après l'Unité ?",
  "Un movimento di indipendenza siciliano": "Un mouvement d'indépendance sicilien",
  "Un fenomeno insieme criminale e di rivolta sociale nel Sud, represso duramente":
    "Un phénomène à la fois criminel et de révolte sociale dans le Sud, durement réprimé",
  "La resistenza dell'esercito borbonico regolare":
    "La résistance de l'armée régulière des Bourbons",
  "Una rivolta contadina nel Nord contro le tasse austriache":
    "Une révolte paysanne dans le Nord contre les impôts autrichiens",
  "L'annessione portò tasse nuove, leva obbligatoria e leggi pensate per il Nord. La repressione militare che ne seguì durò anni e lasciò una ferita da cui nasce la questione meridionale.":
    "L'annexion apporta des impôts nouveaux, la conscription et des lois pensées pour le Nord. La répression militaire qui suivit dura des années et laissa une blessure d'où naît la question méridionale.",
  "In quale anno Roma diventa parte del Regno d'Italia?":
    "En quelle année Rome entre-t-elle dans le royaume d'Italie ?",
  "Nel 1859": "En 1859",
  "Nel 1866": "En 1866",
  "Nel 1870": "En 1870",
  "Il 20 settembre 1870, attraverso la breccia di Porta Pia. Il 1866 aveva portato il Veneto e il 1859 la Lombardia.":
    "Le 20 septembre 1870, par la brèche de la Porta Pia. 1866 avait apporté la Vénétie et 1859 la Lombardie.",
  "Quale accordo segreto porta l'Italia in guerra nel 1915?":
    "Quel accord secret fait entrer l'Italie en guerre en 1915 ?",
  "Il patto d'acciaio": "Le pacte d'Acier",
  "Il patto di Londra": "Le pacte de Londres",
  "La Triplice alleanza": "La Triple-Alliance",
  "L'asse Roma-Berlino": "L'axe Rome-Berlin",
  "Il patto di Londra, firmato con Francia, Gran Bretagna e Russia mentre l'Italia era formalmente alleata degli imperi centrali. Il patto d'acciaio è del 1939, con la Germania.":
    "Le pacte de Londres, signé avec la France, la Grande-Bretagne et la Russie alors que l'Italie était formellement alliée aux empires centraux. Le pacte d'Acier date de 1939, avec l'Allemagne.",
  "Quanti furono all'incirca i morti italiani nella Prima guerra mondiale?":
    "Combien d'Italiens moururent à peu près pendant la Première Guerre mondiale ?",
  "Trecentomila": "Trois cent mille",
  "Seicentomila": "Six cent mille",
  "Due milioni": "Deux millions",
  "Circa seicentomila. La guerra si combatté per tre anni e mezzo in trincea sull'Isonzo, sul Carso e sulle Alpi.":
    "Environ six cent mille. La guerre se livra trois ans et demi dans les tranchées de l'Isonzo, du Carso et des Alpes.",
  "Che cosa fu Caporetto?": "Que fut Caporetto ?",
  "La battaglia finale vinta dall'Italia": "La bataille finale gagnée par l'Italie",
  "La rotta del 1917 che portò il fronte fino al Piave":
    "La déroute de 1917 qui ramena le front jusqu'au Piave",
  "Il trattato di pace del 1919": "Le traité de paix de 1919",
  "Il luogo della firma dell'armistizio": "Le lieu où l'armistice fut signé",
  "L'offensiva austro-tedesca sfondò le linee e l'esercito arretrò di cento chilometri. Il nome è entrato nella lingua comune come sinonimo di disfatta.":
    "L'offensive austro-allemande enfonça les lignes et l'armée recula de cent kilomètres. Le nom est passé dans la langue courante comme synonyme de débâcle.",
  "Quale battaglia chiude per l'Italia la Prima guerra mondiale?":
    "Quelle bataille clôt pour l'Italie la Première Guerre mondiale ?",
  "Caporetto": "Caporetto",
  "Il Piave": "Le Piave",
  "Vittorio Veneto": "Vittorio Veneto",
  "Custoza": "Custoza",
  "Vittorio Veneto, nell'ottobre-novembre 1918, seguita dall'armistizio di Villa Giusti. Custoza appartiene invece alle guerre d'indipendenza.":
    "Vittorio Veneto, en octobre et novembre 1918, suivie de l'armistice de la villa Giusti. Custoza appartient en revanche aux guerres d'indépendance.",
  "In quale anno nascono i Fasci italiani di combattimento?":
    "En quelle année naissent les Faisceaux italiens de combat ?",
  "Nel 1915": "En 1915",
  "Nel 1919": "En 1919",
  "Nel 1922": "En 1922",
  "Nel 1925": "En 1925",
  "Nel marzo 1919, a Milano. La marcia su Roma sarà tre anni dopo e le leggi fascistissime dal 1925.":
    "En mars 1919, à Milan. La marche sur Rome viendra trois ans plus tard et les lois les plus fascistes à partir de 1925.",
  "Chi era Giacomo Matteotti?": "Qui était Giacomo Matteotti ?",
  "Il fondatore del Partito comunista": "Le fondateur du Parti communiste",
  "Il deputato socialista rapito e ucciso nel 1924 dopo aver denunciato i brogli":
    "Le député socialiste enlevé et tué en 1924 après avoir dénoncé la fraude électorale",
  "Il presidente del consiglio prima di Mussolini":
    "Le président du Conseil qui précéda Mussolini",
  "Un generale della Grande guerra": "Un général de la Grande Guerre",
  "Aveva contestato in aula la validità delle elezioni. La sua morte aprì la crisi più grave del regime nascente, superata nel gennaio 1925 con l'assunzione pubblica di responsabilità da parte di Mussolini.":
    "Il avait contesté en séance la validité des élections. Sa mort ouvrit la crise la plus grave du régime naissant, franchie en janvier 1925 lorsque Mussolini en assuma publiquement la responsabilité.",
  "Che cosa furono le leggi fascistissime?": "Que furent les lois dites les plus fascistes ?",
  "Le leggi che estesero il voto alle donne": "Les lois qui étendirent le vote aux femmes",
  "I provvedimenti del 1925-26 che sciolsero i partiti e soppressero la stampa libera":
    "Les mesures de 1925 et 1926 qui dissolurent les partis et supprimèrent la presse libre",
  "Le leggi economiche del 1936": "Les lois économiques de 1936",
  "I decreti di guerra del 1940": "Les décrets de guerre de 1940",
  "In due anni lo Stato liberale fu smontato con leggi ordinarie, senza che lo Statuto albertino fosse mai abrogato: la dimostrazione pratica di che cosa comporti una costituzione flessibile.":
    "En deux ans, l'État libéral fut démonté par des lois ordinaires, sans que le Statut albertin fût jamais abrogé : la démonstration pratique de ce qu'emporte une constitution souple.",
  "Che cosa stabiliscono i Patti Lateranensi del 1929?":
    "Qu'établissent les accords du Latran de 1929 ?",
  "L'abolizione dell'insegnamento religioso": "L'abolition de l'enseignement religieux",
  "La nascita dello Stato della Città del Vaticano e la fine della questione romana":
    "La naissance de l'État de la Cité du Vatican et la fin de la question romaine",
  "L'annessione dello Stato della Chiesa al Regno": "L'annexion des États de l'Église au royaume",
  "La separazione fra Stato e Chiesa sul modello francese":
    "La séparation de l'Église et de l'État sur le modèle français",
  "L'accordo con la Santa Sede chiuse la questione aperta nel 1870 con la presa di Roma. I Patti sono stati rivisti nel 1984 e sono richiamati dalla Costituzione.":
    "L'accord avec le Saint-Siège referma la question ouverte en 1870 par la prise de Rome. Les accords ont été révisés en 1984 et la Constitution y renvoie.",
  "Quale articolo della Costituzione richiama i Patti Lateranensi?":
    "Quel article de la Constitution renvoie aux accords du Latran ?",
  "L'articolo 7": "L'article 7",
  "L'articolo 19": "L'article 19",
  "L'articolo 7, sui rapporti fra Stato e Chiesa cattolica. L'articolo 19 garantisce invece la libertà religiosa a tutti, e fu scritto separatamente proprio per non confondere le due cose.":
    "L'article 7, sur les rapports entre l'État et l'Église catholique. L'article 19 garantit en revanche la liberté religieuse à tous, et fut écrit séparément précisément pour ne pas confondre les deux choses.",
  "In quale anno furono emanate le leggi razziali?":
    "En quelle année les lois raciales furent-elles édictées ?",
  "Nel 1929": "En 1929",
  "Nel 1935": "En 1935",
  "Nel 1938": "En 1938",
  "Nel 1943": "En 1943",
  "Nel 1938. Esclusero gli ebrei italiani da scuole, professioni e vita pubblica, preparando il terreno alle deportazioni che sarebbero cominciate dopo l'occupazione tedesca.":
    "En 1938. Elles exclurent les Juifs italiens des écoles, des professions et de la vie publique, préparant le terrain aux déportations qui commenceraient après l'occupation allemande.",
  "Quando entra l'Italia nella Seconda guerra mondiale?":
    "Quand l'Italie entre-t-elle dans la Seconde Guerre mondiale ?",
  "Il 1º settembre 1939": "Le 1er septembre 1939",
  "Il 10 giugno 1940": "Le 10 juin 1940",
  "Il 25 luglio 1943": "Le 25 juillet 1943",
  "L'8 settembre 1943": "Le 8 septembre 1943",
  "Il 10 giugno 1940, quando la Francia era quasi sconfitta e si pensava che la guerra sarebbe finita in poche settimane.":
    "Le 10 juin 1940, quand la France était presque vaincue et que l'on croyait la guerre finie en quelques semaines.",
  "Che cos'era la Repubblica sociale italiana?": "Qu'était la République sociale italienne ?",
  "Il governo del Sud alleato degli angloamericani":
    "Le gouvernement du Sud allié aux Anglo-Américains",
  "Lo Stato installato al centro-nord sotto controllo tedesco dopo l'8 settembre":
    "L'État installé au centre et au nord sous contrôle allemand après le 8 septembre",
  "Il primo nome della Repubblica nata nel 1946": "Le premier nom de la République née en 1946",
  "Un progetto costituzionale mai realizzato": "Un projet constitutionnel jamais réalisé",
  "Nacque dopo l'armistizio, con Mussolini liberato dai tedeschi. Fra il settembre 1943 e l'aprile 1945 esistono due Italie: il Regno del Sud e la Repubblica sociale al Nord.":
    "Elle naquit après l'armistice, Mussolini ayant été libéré par les Allemands. Entre septembre 1943 et avril 1945 il existe deux Italies : le royaume du Sud et la République sociale au Nord.",
  "Che cosa accade il 25 luglio 1943?": "Que se passe-t-il le 25 juillet 1943 ?",
  "Viene annunciato l'armistizio": "L'armistice est annoncé",
  "Il Gran consiglio mette Mussolini in minoranza e il re lo fa arrestare":
    "Le Grand Conseil met Mussolini en minorité et le roi le fait arrêter",
  "Gli Alleati sbarcano in Sicilia": "Les Alliés débarquent en Sicile",
  "Roma viene liberata": "Rome est libérée",
  "L'arresto è del 25 luglio, l'armistizio dell'8 settembre. Fra le due date passano sei settimane in cui il paese resta in guerra senza sapere da che parte.":
    "L'arrestation est du 25 juillet, l'armistice du 8 septembre. Entre les deux passent six semaines pendant lesquelles le pays reste en guerre sans savoir de quel côté.",
  "Con quale percentuale approssimativa vinse la repubblica nel referendum del 1946?":
    "Avec quel pourcentage approximatif la république l'emporta-t-elle au référendum de 1946 ?",
  "Circa il 45 per cento": "Environ 45 pour cent",
  "Circa il 54 per cento": "Environ 54 pour cent",
  "Circa il 75 per cento": "Environ 75 pour cent",
  "Circa il 90 per cento": "Environ 90 pour cent",
  "Poco più della metà, con un Nord largamente repubblicano e un Sud in maggioranza monarchico. Il risultato fu contestato per settimane, e la differenza stretta spiega perché.":
    "Un peu plus de la moitié, avec un Nord largement républicain et un Sud majoritairement monarchiste. Le résultat fut contesté pendant des semaines, et l'écart serré explique pourquoi.",
  "Che cos'era il Comitato di liberazione nazionale?":
    "Qu'était le Comité de libération nationale ?",
  "Il governo del Regno del Sud": "Le gouvernement du royaume du Sud",
  "L'organismo che coordinava le forze della Resistenza":
    "L'organe qui coordonnait les forces de la Résistance",
  "Il comando alleato in Italia": "Le commandement allié en Italie",
  "L'assemblea che scrisse la Costituzione": "L'assemblée qui écrivit la Constitution",
  "Vi sedevano insieme comunisti, socialisti, democratici cristiani, liberali e azionisti. Quelle stesse forze si sarebbero combattute per decenni, ma in quel momento scrivevano insieme.":
    "Y siégeaient ensemble communistes, socialistes, démocrates-chrétiens, libéraux et membres du Parti d'action. Ces mêmes forces allaient se combattre pendant des décennies, mais à ce moment-là elles écrivaient ensemble.",
  "Chi fu l'ultimo re d'Italia?": "Qui fut le dernier roi d'Italie ?",
  "Vittorio Emanuele III": "Victor-Emmanuel III",
  "Carlo Alberto": "Charles-Albert",
  "Umberto II, che regnò poco più di un mese e lasciò il paese dopo il referendum. Vittorio Emanuele III, suo padre, aveva abdicato in suo favore poche settimane prima.":
    "Humbert II, qui régna un peu plus d'un mois et quitta le pays après le référendum. Victor-Emmanuel III, son père, avait abdiqué en sa faveur quelques semaines plus tôt.",
  "Quando si tennero le prime elezioni politiche della Repubblica?":
    "Quand eurent lieu les premières élections législatives de la République ?",
  "Il 18 aprile 1948, in un clima segnato dall'inizio della guerra fredda. Il 2 giugno 1946 si era votato per la forma dello Stato e per l'Assemblea costituente.":
    "Le 18 avril 1948, dans un climat marqué par le début de la guerre froide. Le 2 juin 1946, on avait voté sur la forme de l'État et pour l'Assemblée constituante.",
  "Quale piano finanziò la ricostruzione postbellica?":
    "Quel plan finança la reconstruction d'après-guerre ?",
  "Il piano Marshall": "Le plan Marshall",
  "Il piano Schuman": "Le plan Schuman",
  "Il piano Beveridge": "Le plan Beveridge",
  "Il piano Vanoni": "Le plan Vanoni",
  "Gli aiuti americani del piano Marshall. Il piano Schuman riguardava invece il carbone e l'acciaio, e da esso nascerà la prima comunità europea.":
    "Les aides américaines du plan Marshall. Le plan Schuman portait en revanche sur le charbon et l'acier, et de lui naîtra la première communauté européenne.",
  "Quali città formavano il triangolo industriale del boom?":
    "Quelles villes formaient le triangle industriel du boom ?",
  "Roma, Napoli e Bari": "Rome, Naples et Bari",
  "Torino, Milano e Genova": "Turin, Milan et Gênes",
  "Milano, Bologna e Firenze": "Milan, Bologne et Florence",
  "Venezia, Trieste e Padova": "Venise, Trieste et Padoue",
  "Torino, Milano e Genova. Verso quelle fabbriche si mossero milioni di persone dal Sud e dal Nordest: la più grande migrazione interna della storia italiana.":
    "Turin, Milan et Gênes. Vers ces usines se déplacèrent des millions de gens du Sud et du Nord-Est : la plus grande migration intérieure de l'histoire italienne.",
  "In quale anno l'Italia firma i trattati che istituiscono la Comunità economica europea?":
    "En quelle année l'Italie signe-t-elle les traités instituant la Communauté économique européenne ?",
  "Nel 1951": "En 1951",
  "Nel 1992": "En 1992",
  "Il 25 marzo 1957, in Campidoglio. L'Italia non aderisce all'Europa comunitaria: la fonda, e lo fa nella propria capitale.":
    "Le 25 mars 1957, au Capitole. L'Italie n'adhère pas à l'Europe communautaire : elle la fonde, et le fait dans sa propre capitale.",
  "Quanti giorni durò il sequestro di Aldo Moro?":
    "Combien de jours dura l'enlèvement d'Aldo Moro ?",
  "Trentatré": "Trente-trois",
  "Novanta": "Quatre-vingt-dix",
  "Cinquantacinque giorni, dal 16 marzo al 9 maggio 1978. Nel rapimento in via Fani furono uccisi i cinque uomini della scorta.":
    "Cinquante-cinq jours, du 16 mars au 9 mai 1978. Lors de l'enlèvement de la via Fani, les cinq hommes de son escorte furent tués.",
  "Quante vittime causò la bomba alla stazione di Bologna nel 1980?":
    "Combien de victimes fit la bombe de la gare de Bologne en 1980 ?",
  "Diciassette": "Dix-sept",
  "Quarantatré": "Quarante-trois",
  "Ottantacinque": "Quatre-vingt-cinq",
  "Centoventi": "Cent vingt",
  "Ottantacinque: è la strage più grave dell'Italia repubblicana. L'orologio della stazione è fermo sull'ora dell'esplosione.":
    "Quatre-vingt-cinq : c'est le massacre le plus grave de l'Italie républicaine. L'horloge de la gare est arrêtée sur l'heure de l'explosion.",
  "Chi erano Giovanni Falcone e Paolo Borsellino?":
    "Qui étaient Giovanni Falcone et Paolo Borsellino ?",
  "Due parlamentari dell'Assemblea costituente": "Deux parlementaires de l'Assemblée constituante",
  "I giudici antimafia uccisi nelle stragi del 1992":
    "Les juges antimafia tués dans les attentats de 1992",
  "I fondatori del Partito d'azione": "Les fondateurs du Parti d'action",
  "Due giornalisti dell'inchiesta Mani pulite": "Deux journalistes de l'enquête Mains propres",
  "Uccisi a pochi mesi di distanza nelle stragi di Capaci e di via d'Amelio, nello stesso anno in cui Mani pulite faceva crollare il sistema dei partiti.":
    "Tués à quelques mois d'écart dans les attentats de Capaci et de la via d'Amelio, l'année même où Mains propres faisait s'effondrer le système des partis.",
  "Che cosa indica l'espressione Prima Repubblica?":
    "Que désigne l'expression Première République ?",
  "La repubblica proclamata da Mazzini a Roma nel 1849":
    "La république proclamée par Mazzini à Rome en 1849",
  "La stagione del sistema dei partiti dal dopoguerra al 1992-94":
    "La saison du système des partis, de l'après-guerre à 1992 et 1994",
  "Il periodo fra il 1946 e il 1948": "La période entre 1946 et 1948",
  "Lo Stato nato dalla Resistenza al Nord": "L'État né de la Résistance au Nord",
  "Non è una categoria giuridica: la Costituzione è la stessa dal 1948. Indica la stagione dei partiti nati dalla Resistenza, chiusa dal biennio di Mani pulite.":
    "Ce n'est pas une catégorie juridique : la Constitution est la même depuis 1948. L'expression désigne la saison des partis nés de la Résistance, close par les deux années de Mains propres.",
  "In quale anno arrivano le banconote in euro?":
    "En quelle année arrivent les billets en euros ?",
  "Nel 1999": "En 1999",
  "Nel 2002": "En 2002",
  "Nel 2004": "En 2004",
  "Le banconote e le monete circolano dal 1º gennaio 2002; dal 1999 l'euro esisteva già come moneta di conto. La lira era nata con il Regno d'Italia nel 1862.":
    "Les billets et les pièces circulent depuis le 1er janvier 2002 ; depuis 1999, l'euro existait déjà comme monnaie de compte. La lire était née avec le royaume d'Italie en 1862.",
  "Che cosa portò lo Statuto dei lavoratori del 1970?":
    "Qu'apporta le Statut des travailleurs de 1970 ?",
  "Le libertà costituzionali dentro i luoghi di lavoro":
    "Les libertés constitutionnelles à l'intérieur des lieux de travail",
  "L'istituzione del salario minimo": "L'instauration d'un salaire minimum",
  "La settimana di trentacinque ore": "La semaine de trente-cinq heures",
  "L'obbligo di iscrizione al sindacato": "L'obligation d'adhérer à un syndicat",
  "La legge 300 portò in fabbrica le libertà che la Costituzione garantiva fuori, e vietò il licenziamento senza giusta causa nelle imprese maggiori. Nello stesso anno nacquero le regioni a statuto ordinario.":
    "La loi 300 porta à l'usine les libertés que la Constitution garantissait au dehors, et interdit le licenciement sans juste motif dans les grandes entreprises. La même année naissaient les régions à statut ordinaire.",
  "Quale catena montuosa percorre l'Italia da nord a sud?":
    "Quelle chaîne de montagnes parcourt l'Italie du nord au sud ?",
  "Le Alpi": "Les Alpes",
  "Gli Appennini": "Les Apennins",
  "I Pirenei": "Les Pyrénées",
  "Gli Appennini corrono per l'intera penisola e proseguono in Sicilia. Le Alpi chiudono soltanto il lato settentrionale, e le Dolomiti ne sono una parte.":
    "Les Apennins courent sur toute la péninsule et se prolongent en Sicile. Les Alpes ne ferment que le côté septentrional, et les Dolomites en font partie.",
  "Qual è l'unica grande pianura italiana?": "Quelle est la seule grande plaine italienne ?",
  "Il Tavoliere delle Puglie": "Le Tavoliere des Pouilles",
  "La pianura padana": "La plaine du Pô",
  "La Maremma": "La Maremme",
  "La piana di Catania": "La plaine de Catane",
  "La pianura padana, attraversata dal Po. Le altre citate sono pianure reali ma molto più piccole: in Italia la pianura copre poco più di un quinto del territorio.":
    "La plaine du Pô, que traverse le fleuve du même nom. Les autres citées sont de vraies plaines, mais bien plus petites : en Italie, la plaine couvre un peu plus d'un cinquième du territoire.",
  "Con quali Stati confina l'Italia via terra?":
    "Avec quels États l'Italie a-t-elle une frontière terrestre ?",
  "Francia, Svizzera, Austria e Slovenia": "La France, la Suisse, l'Autriche et la Slovénie",
  "Francia, Germania, Austria e Croazia": "La France, l'Allemagne, l'Autriche et la Croatie",
  "Francia, Svizzera, Germania e Slovenia": "La France, la Suisse, l'Allemagne et la Slovénie",
  "Svizzera, Austria, Ungheria e Croazia": "La Suisse, l'Autriche, la Hongrie et la Croatie",
  "Quattro Stati lungo l'arco alpino. La Germania non tocca l'Italia, e la Croazia le sta di fronte sull'Adriatico ma non confina.":
    "Quatre États le long de l'arc alpin. L'Allemagne ne touche pas l'Italie, et la Croatie lui fait face sur l'Adriatique sans avoir de frontière avec elle.",
  "Qual è il vulcano attivo più grande d'Europa?":
    "Quel est le plus grand volcan actif d'Europe ?",
  "Il Vesuvio": "Le Vésuve",
  "Lo Stromboli": "Le Stromboli",
  "L'Etna": "L'Etna",
  "I Campi Flegrei": "Les Champs Phlégréens",
  "L'Etna, in Sicilia, che erutta più volte l'anno. Il Vesuvio è più piccolo ma più pericoloso, perché sovrasta un'area densamente abitata.":
    "L'Etna, en Sicile, qui entre en éruption plusieurs fois par an. Le Vésuve est plus petit mais plus dangereux, parce qu'il domine une zone très peuplée.",
  "Quale regione italiana non è sostanzialmente sismica?":
    "Quelle région italienne n'est pour ainsi dire pas sismique ?",
  "La Calabria": "La Calabre",
  "L'Umbria": "L'Ombrie",
  "La Sardegna": "La Sardaigne",
  "Il Friuli Venezia Giulia": "Le Frioul-Vénétie Julienne",
  "La Sardegna, che sta su una porzione di crosta stabile. Calabria, Umbria e Friuli hanno invece subito terremoti distruttivi in tempi recenti.":
    "La Sardaigne, posée sur une portion de croûte stable. La Calabre, l'Ombrie et le Frioul ont en revanche subi des séismes destructeurs ces dernières décennies.",
  "Qual è la più grande isola del Mediterraneo?":
    "Quelle est la plus grande île de la Méditerranée ?",
  "Cipro": "Chypre",
  "Creta": "La Crète",
  "La Sicilia, seguita dalla Sardegna. Cipro e Creta sono più piccole di entrambe.":
    "La Sicile, suivie de la Sardaigne. Chypre et la Crète sont plus petites que l'une et l'autre.",
  "Quale montagna è la vetta più alta della catena alpina?":
    "Quelle montagne est le plus haut sommet de la chaîne alpine ?",
  "Il Monte Rosa": "Le mont Rose",
  "Il Gran Paradiso": "Le Grand Paradis",
  "Il Cervino": "Le Cervin",
  "Il Monte Bianco": "Le mont Blanc",
  "Il Monte Bianco, 4.808 metri. La sovranità della cima è oggetto di una controversia mai risolta con la Francia: le carte dei due paesi non coincidono.":
    "Le mont Blanc, 4 808 mètres. La souveraineté du sommet fait l'objet d'un différend jamais tranché avec la France : les cartes des deux pays ne coïncident pas.",
  "Quanto misura all'incirca lo sviluppo costiero italiano?":
    "Quelle est à peu près la longueur des côtes italiennes ?",
  "Mille chilometri": "Mille kilomètres",
  "Tremila chilometri": "Trois mille kilomètres",
  "Settemilacinquecento chilometri": "Sept mille cinq cents kilomètres",
  "Quindicimila chilometri": "Quinze mille kilomètres",
  "Circa settemilacinquecento chilometri fra penisola e isole. Nessun punto del paese è lontanissimo dal mare, e questo ha segnato cucina, commercio e storia.":
    "Environ sept mille cinq cents kilomètres, péninsule et îles comprises. Aucun point du pays n'est très loin de la mer, et cela a marqué la cuisine, le commerce et l'histoire.",
  "Che cosa sono i Campi Flegrei?": "Que sont les Champs Phlégréens ?",
  "Una pianura agricola della Campania": "Une plaine agricole de Campanie",
  "Una vasta caldera vulcanica a ovest di Napoli":
    "Une vaste caldeira volcanique à l'ouest de Naples",
  "Un parco nazionale dell'Appennino": "Un parc national des Apennins",
  "Un antico sito greco in Calabria": "Un ancien site grec de Calabre",
  "Una caldera, cioè un'ampia depressione vulcanica, densamente abitata. È sorvegliata di continuo perché il suolo si solleva e si abbassa nel fenomeno chiamato bradisismo.":
    "Une caldeira, c'est-à-dire une large dépression volcanique, très peuplée. Elle est surveillée sans relâche parce que le sol s'y soulève et s'y abaisse : c'est le bradyséisme.",
  "Quale città è stata sepolta dall'eruzione del Vesuvio insieme a Pompei?":
    "Quelle ville fut ensevelie par l'éruption du Vésuve en même temps que Pompéi ?",
  "Cuma": "Cumes",
  "Ercolano": "Herculanum",
  "Capua": "Capoue",
  "Benevento": "Bénévent",
  "Ercolano, insieme a Stabia. Furono coperte da materiali diversi, e per questo a Ercolano si sono conservati anche il legno e i papiri.":
    "Herculanum, avec Stabies. Elles furent recouvertes de matières différentes, et c'est pourquoi le bois et les papyrus se sont conservés à Herculanum.",
  "Perché in Italia si coltiva spesso a terrazze?":
    "Pourquoi cultive-t-on souvent en terrasses en Italie ?",
  "Per ragioni estetiche legate al paesaggio": "Pour des raisons de beauté du paysage",
  "Perché la pianura è scarsa e gran parte del territorio è collinare o montuoso":
    "Parce que la plaine est rare et qu'une grande partie du territoire est de colline ou de montagne",
  "Perché lo impone la normativa europea": "Parce que la réglementation européenne l'impose",
  "Per proteggere le colture dal vento marino": "Pour protéger les cultures du vent de mer",
  "La pianura copre poco più di un quinto del paese. Terrazzare i pendii è il modo con cui generazioni di agricoltori hanno reso coltivabile ciò che altrimenti non lo era.":
    "La plaine couvre un peu plus d'un cinquième du pays. Terrasser les pentes est la façon dont des générations de paysans ont rendu cultivable ce qui ne l'était pas.",
  "Quale di questi è uno Stato indipendente sull'Appennino romagnolo?":
    "Lequel de ces territoires est un État indépendant dans l'Apennin romagnol ?",
  "Il Principato di Seborga": "La principauté de Seborga",
  "La Repubblica di San Marino": "La république de Saint-Marin",
  "Il Vaticano": "Le Vatican",
  "Campione d'Italia": "Campione d'Italia",
  "San Marino, che si dice la più antica repubblica ancora esistente. Il Vaticano è a Roma, e Campione d'Italia è invece un comune italiano circondato dalla Svizzera.":
    "Saint-Marin, que l'on dit la plus ancienne république encore existante. Le Vatican est à Rome, et Campione d'Italia est une commune italienne entourée par la Suisse.",
  "Perché il clima italiano non può essere descritto come uno solo?":
    "Pourquoi ne peut-on pas décrire le climat italien comme un seul climat ?",
  "Perché il paese si estende per oltre mille chilometri in latitudine e ha rilievi molto diversi":
    "Parce que le pays s'étend sur plus de mille kilomètres en latitude et présente des reliefs très différents",
  "Perché le regioni misurano le temperature con metodi diversi":
    "Parce que les régions mesurent les températures par des méthodes différentes",
  "Perché il Mediterraneo cambia temperatura ogni anno":
    "Parce que la Méditerranée change de température chaque année",
  "Perché le Alpi bloccano ogni corrente atlantica":
    "Parce que les Alpes arrêtent tout courant atlantique",
  "Fra Bolzano e Lampedusa corrono più di dieci gradi di temperatura media annua. Le Alpi hanno clima alpino, la pianura padana estati afose e nebbie, le coste clima mediterraneo.":
    "Entre Bolzano et Lampedusa, plus de dix degrés séparent les températures moyennes annuelles. Les Alpes ont un climat alpin, la plaine du Pô des étés lourds et des brouillards, les côtes un climat méditerranéen.",
  "Quale città è il principale centro economico e finanziario italiano?":
    "Quelle ville est le principal centre économique et financier italien ?",
  "Milano, sede della borsa e della gran parte dei servizi finanziari. Roma è la capitale politica e amministrativa, Torino il centro industriale storico.":
    "Milan, siège de la bourse et de la plupart des services financiers. Rome est la capitale politique et administrative, Turin le centre industriel historique.",
  "Perché l'Italia non ha una sola città che concentri tutto, come Parigi o Londra?":
    "Pourquoi l'Italie n'a-t-elle pas une seule ville qui concentre tout, comme Paris ou Londres ?",
  "Perché la Costituzione lo vieta": "Parce que la Constitution l'interdit",
  "Perché per quattordici secoli ogni città è stata capitale di qualcosa":
    "Parce que pendant quatorze siècles chaque ville a été capitale de quelque chose",
  "Perché le distanze sono troppo grandi": "Parce que les distances sont trop grandes",
  "Perché la capitale è stata scelta solo nel 1946":
    "Parce que la capitale n'a été choisie qu'en 1946",
  "Senza uno Stato unico, ogni città ha avuto il proprio palazzo di governo, il proprio teatro e la propria università, e li ha conservati. Il policentrismo italiano è un'eredità storica, non una scelta amministrativa.":
    "Faute d'un État unique, chaque ville a eu son palais de gouvernement, son théâtre et son université, et les a gardés. Le polycentrisme italien est un héritage de l'histoire, non un choix administratif.",
  "Che cosa si trova ad Agrigento, in Sicilia?": "Que trouve-t-on à Agrigente, en Sicile ?",
  "Il sito di Ercolano": "Le site d'Herculanum",
  "La Reggia di Caserta": "Le palais royal de Caserte",
  "Il Foro romano": "Le Forum romain",
  "La Valle dei Templi, con templi greci del quinto secolo avanti Cristo. La Sicilia fu Magna Grecia prima di essere romana, e in molti punti si vede.":
    "La Vallée des Temples, avec des temples grecs du cinquième siècle avant Jésus-Christ. La Sicile fut Grande-Grèce avant d'être romaine, et cela se voit en bien des endroits.",
  "Quale sito italiano è iscritto nella lista UNESCO come patrimonio naturale e non culturale?":
    "Quel site italien est inscrit à l'UNESCO au titre du patrimoine naturel et non culturel ?",
  "Il centro storico di Siena": "Le centre historique de Sienne",
  "La laguna di Venezia": "La lagune de Venise",
  "Le Dolomiti sono iscritte per il loro valore paesaggistico e geologico. Venezia e la sua laguna sono invece un sito culturale, che comprende anche l'ambiente in cui la città sta.":
    "Les Dolomites sont inscrites pour leur valeur paysagère et géologique. Venise et sa lagune sont en revanche un site culturel, qui comprend aussi le milieu où la ville se tient.",
  "Che cosa significa che un intero centro storico è iscritto come un solo sito?":
    "Que veut dire qu'un centre historique entier soit inscrit comme un seul site ?",
  "Che ogni edificio è di proprietà pubblica":
    "Que chaque bâtiment appartient à la puissance publique",
  "Che il riconoscimento riguarda il complesso urbano, non i singoli monumenti":
    "Que la reconnaissance porte sur l'ensemble urbain, non sur les monuments pris un à un",
  "Che nessun edificio può essere modificato": "Qu'aucun bâtiment ne peut être modifié",
  "Che il sito è chiuso ai residenti": "Que le site est fermé aux habitants",
  "Roma, Firenze, Venezia, Napoli, Siena, Urbino e Ferrara sono iscritte così: conta il tessuto della città, non l'elenco dei suoi monumenti presi uno per uno.":
    "Rome, Florence, Venise, Naples, Sienne, Urbino et Ferrare sont inscrites ainsi : c'est le tissu de la ville qui compte, non la liste de ses monuments pris un à un.",
  "Quale città italiana è costruita su una laguna?":
    "Quelle ville italienne est bâtie sur une lagune ?",
  "Genova": "Gênes",
  "Trieste": "Trieste",
  "Ravenna": "Ravenne",
  "Venezia, su un arcipelago di isolette in una laguna. La città e la laguna insieme formano un unico sito del patrimonio mondiale.":
    "Venise, sur un archipel d'îlots dans une lagune. La ville et la lagune forment ensemble un seul site du patrimoine mondial.",
  "Che cosa si intende per aree interne?": "Qu'entend-on par territoires de l'intérieur ?",
  "I quartieri centrali delle grandi città": "Les quartiers centraux des grandes villes",
  "I territori lontani dai servizi, spesso appenninici, che si stanno spopolando":
    "Les territoires éloignés des services, souvent apennins, qui se vident",
  "Le zone industriali del Nord": "Les zones industrielles du Nord",
  "Le regioni senza sbocco sul mare": "Les régions sans accès à la mer",
  "Paesi distanti da scuole, ospedali e stazioni, dove la popolazione cala e i servizi chiudono. Sono l'esatto rovescio dell'affollamento turistico, e spesso stanno a poche decine di chilometri da esso.":
    "Des villages loin des écoles, des hôpitaux et des gares, où la population baisse et où les services ferment. C'est l'exact envers de la foule touristique, et ils s'en trouvent souvent à quelques dizaines de kilomètres.",
  "Quale problema colpisce i centri storici di Venezia e Firenze?":
    "Quel mal frappe les centres historiques de Venise et de Florence ?",
  "L'abbandono da parte dei turisti": "La désaffection des touristes",
  "La diminuzione dei residenti mentre crescono gli affitti brevi":
    "La baisse du nombre d'habitants tandis que la location de courte durée se répand",
  "La mancanza di collegamenti ferroviari": "Le manque de liaisons ferroviaires",
  "Il divieto di ristrutturare gli edifici": "L'interdiction de rénover les bâtiments",
  "In alcune giornate i visitatori superano gli abitanti, e chi vive in centro se ne va perché le case diventano alloggi turistici. È il rovescio del successo, e le due città lo affrontano con misure diverse.":
    "Certains jours, les visiteurs sont plus nombreux que les habitants, et ceux qui vivent au centre s'en vont parce que les logements deviennent des meublés touristiques. C'est l'envers du succès, et les deux villes y répondent par des mesures différentes.",
  "Quale città è considerata la capitale del Mezzogiorno?":
    "Quelle ville passe pour la capitale du Midi italien ?",
  "Bari": "Bari",
  "Palermo": "Palerme",
  "Catania": "Catane",
  "Napoli, capitale di un regno per secoli e oggi la maggiore città del Sud. Palermo è la capitale della Sicilia e Bari il principale porto adriatico meridionale.":
    "Naples, capitale d'un royaume pendant des siècles et aujourd'hui la plus grande ville du Sud. Palerme est la capitale de la Sicile et Bari le principal port adriatique méridional.",
  "Che cosa può essere iscritto nella lista UNESCO oltre a monumenti e paesaggi?":
    "Que peut-on inscrire à l'UNESCO outre les monuments et les paysages ?",
  "Nulla: la lista comprende solo beni materiali":
    "Rien : la liste ne comprend que des biens matériels",
  "Anche pratiche immateriali, come un'arte o un saper fare":
    "Aussi des pratiques immatérielles, comme un art ou un savoir-faire",
  "Solo edifici anteriori al Settecento":
    "Seulement des bâtiments antérieurs au dix-huitième siècle",
  "Solo siti di proprietà statale": "Seulement des sites appartenant à l'État",
  "Esiste una lista del patrimonio culturale immateriale, in cui l'Italia è presente fra l'altro con l'arte del pizzaiuolo napoletano. Non tutto ciò che si tutela è fatto di pietra.":
    "Il existe une liste du patrimoine culturel immatériel, où l'Italie figure entre autres avec l'art du pizzaiolo napolitain. Tout ce que l'on protège n'est pas fait de pierre.",
  "Quale città fu il centro industriale storico dell'Italia?":
    "Quelle ville fut le centre industriel historique de l'Italie ?",
  "Verona": "Vérone",
  "Torino, attorno all'automobile. Insieme a Milano e Genova formava il triangolo industriale verso cui si mosse la migrazione interna del dopoguerra.":
    "Turin, autour de l'automobile. Avec Milan et Gênes, elle formait le triangle industriel vers lequel se déplaça la migration intérieure d'après-guerre.",
  "In quale città si trova il porto di Roma dell'età antica?":
    "Où se trouve le port de Rome de l'Antiquité ?",
  "A Civitavecchia": "À Civitavecchia",
  "A Ostia": "À Ostie",
  "Ad Anzio": "À Anzio",
  "Ostia antica, alla foce del Tevere. Non fu sepolta da un'eruzione ma abbandonata lentamente, e per questo si è conservata in modo diverso da Pompei.":
    "Ostie antique, à l'embouchure du Tibre. Elle ne fut pas ensevelie par une éruption mais abandonnée lentement, et s'est donc conservée autrement que Pompéi.",
  "Che cos'è il patrimonio diffuso italiano?": "Qu'est-ce que le patrimoine dispersé italien ?",
  "L'insieme dei musei statali": "L'ensemble des musées de l'État",
  "Le migliaia di piccoli centri storici che nessuna lista riesce a contenere":
    "Les milliers de petits centres historiques qu'aucune liste ne parvient à contenir",
  "Il fondo per il restauro delle chiese": "Le fonds pour la restauration des églises",
  "L'archivio digitale dei beni culturali": "L'archive numérique des biens culturels",
  "Accanto ai siti iscritti c'è un patrimonio distribuito in migliaia di borghi, pievi e centri minori. È una delle ragioni per cui in Italia il paesaggio culturale non si esaurisce nelle città d'arte.":
    "À côté des sites inscrits, il y a un patrimoine réparti dans des milliers de bourgs, d'églises rurales et de petites villes. C'est l'une des raisons pour lesquelles, en Italie, le paysage culturel ne s'épuise pas dans les villes d'art.",
  "Dove si concentra il distretto italiano dell'occhialeria?":
    "Où se concentre le district italien de la lunetterie ?",
  "Nel Bellunese": "Dans la région de Belluno",
  "Nel Salento": "Dans le Salento",
  "In Brianza": "En Brianza",
  "Nella Valle d'Aosta": "Au Val d'Aoste",
  "Nel Bellunese, in Veneto: una valle alpina che produce una quota rilevante degli occhiali venduti nel mondo. È l'esempio più citato di distretto.":
    "Dans la région de Belluno, en Vénétie : une vallée alpine qui produit une part notable des lunettes vendues dans le monde. C'est l'exemple de district le plus cité.",
  "Quale distretto industriale ha sede a Sassuolo?":
    "Quel district industriel a son siège à Sassuolo ?",
  "La meccanica di precisione": "La mécanique de précision",
  "La ceramica e le piastrelle": "La céramique et le carrelage",
  "Le calzature": "La chaussure",
  "Gli elettrodomestici": "L'électroménager",
  "La ceramica, nata attorno all'argilla locale ed esportata ovunque. Le calzature stanno soprattutto nelle Marche e in Veneto.":
    "La céramique, née autour de l'argile locale et exportée partout. La chaussure se trouve surtout dans les Marches et en Vénétie.",
  "Da quale tipo di imprese è composta soprattutto l'economia italiana?":
    "De quel type d'entreprises l'économie italienne est-elle surtout faite ?",
  "Da grandi gruppi industriali": "De grands groupes industriels",
  "Da piccole e medie imprese": "De petites et moyennes entreprises",
  "Da imprese pubbliche": "D'entreprises publiques",
  "Da multinazionali estere": "De multinationales étrangères",
  "L'Italia ha pochissimi gruppi molto grandi e moltissime imprese piccole, spesso familiari. Messe insieme per territorio, funzionano come una grande azienda distribuita.":
    "L'Italie a très peu de groupes très grands et une multitude de petites entreprises, souvent familiales. Réunies par territoire, elles fonctionnent comme une grande entreprise répartie.",
  "Quale settore italiano esporta di più fra questi?":
    "Lequel de ces secteurs italiens exporte le plus ?",
  "La meccanica": "La mécanique",
  "L'editoria": "L'édition",
  "La cantieristica navale da diporto": "La construction de bateaux de plaisance",
  "L'industria mineraria": "L'industrie minière",
  "La meccanica, in particolare le macchine per il confezionamento e l'automazione, concentrate lungo la via Emilia. È la A di automazione fra le quattro dell'export.":
    "La mécanique, en particulier les machines d'emballage et d'automatisation, groupées le long de la via Emilia. C'est le A d'automatisation parmi les quatre de l'exportation.",
  "Che cosa indica il divario Nord-Sud?": "Que désigne l'écart entre le Nord et le Sud ?",
  "La differenza di clima fra le due parti del paese":
    "La différence de climat entre les deux parties du pays",
  "La differenza di reddito, occupazione e servizi fra Mezzogiorno e Centro-Nord":
    "La différence de revenu, d'emploi et de services entre le Midi et le Centre-Nord",
  "La distanza chilometrica fra le due estremità":
    "La distance en kilomètres entre les deux extrémités",
  "La diversa densità di popolazione": "La différence de densité de population",
  "Reddito per abitante più basso, disoccupazione più alta e occupazione femminile molto minore. È la questione economica più antica del paese, aperta con l'Unità e mai chiusa.":
    "Un revenu par habitant plus bas, un chômage plus élevé et un emploi des femmes bien moindre. C'est la plus ancienne question économique du pays, ouverte avec l'Unité et jamais close.",
  "Da che cosa deriva l'alto debito pubblico italiano?":
    "D'où vient la dette publique élevée de l'Italie ?",
  "Dalla ricostruzione postbellica": "De la reconstruction d'après-guerre",
  "Da decenni di spesa a deficit, soprattutto negli anni Ottanta":
    "De décennies de dépense à découvert, surtout dans les années quatre-vingt",
  "Dall'ingresso nell'euro": "De l'entrée dans l'euro",
  "Dalla crisi finanziaria del 2008": "De la crise financière de 2008",
  "Il rapporto fra debito e prodotto è cresciuto soprattutto negli anni Ottanta. Da allora serve un avanzo primario costante solo per non farlo aumentare, il che riduce lo spazio per investire.":
    "Le rapport entre la dette et la production a surtout crû dans les années quatre-vingt. Depuis, il faut un excédent primaire constant rien que pour l'empêcher de croître, ce qui réduit la place laissée à l'investissement.",
  "Che cosa caratterizza la demografia italiana attuale?":
    "Qu'est-ce qui caractérise la démographie italienne d'aujourd'hui ?",
  "Una natalità fra le più basse del mondo e una popolazione che invecchia":
    "Une natalité parmi les plus basses du monde et une population qui vieillit",
  "Una crescita rapida della popolazione giovane": "Une croissance rapide de la population jeune",
  "Un equilibrio stabile fra nascite e decessi": "Un équilibre stable entre naissances et décès",
  "Un aumento della natalità dal 2000": "Une hausse de la natalité depuis 2000",
  "La natalità è fra le più basse al mondo e l'età media fra le più alte d'Europa. È uno dei tre nodi aperti dell'economia, insieme al debito e alla partenza dei giovani laureati.":
    "La natalité est parmi les plus basses au monde et l'âge moyen parmi les plus élevés d'Europe. C'est l'un des trois nœuds ouverts de l'économie, avec la dette et le départ des jeunes diplômés.",
  "Quale di queste è una delle quattro A dell'export italiano?":
    "Laquelle de ces activités est l'un des quatre A de l'exportation italienne ?",
  "Acciaio": "L'acier",
  "Arredamento": "L'ameublement",
  "Agricoltura": "L'agriculture",
  "Aeronautica": "L'aéronautique",
  "Arredamento, insieme ad abbigliamento, automazione e alimentare. Le altre voci esistono nell'economia italiana ma non fanno parte della formula.":
    "L'ameublement, avec l'habillement, l'automatisation et l'alimentaire. Les autres postes existent dans l'économie italienne mais ne font pas partie de la formule.",
  "Perché piccola impresa non significa impresa arretrata?":
    "Pourquoi petite entreprise ne veut-il pas dire entreprise arriérée ?",
  "Perché tutte le piccole imprese ricevono aiuti pubblici":
    "Parce que toutes les petites entreprises reçoivent des aides publiques",
  "Perché molte sono leader mondiali nella propria nicchia specializzata":
    "Parce que beaucoup sont premières au monde dans leur créneau spécialisé",
  "Perché sono esenti da imposte fino a dieci dipendenti":
    "Parce qu'elles sont exemptes d'impôt jusqu'à dix salariés",
  "Perché sono tutte di proprietà straniera":
    "Parce qu'elles appartiennent toutes à des étrangers",
  "Aziende con poche decine di dipendenti fanno una cosa sola e la fanno meglio di chiunque altro al mondo. La specializzazione sostituisce la scala.":
    "Des entreprises de quelques dizaines de salariés font une seule chose et la font mieux que quiconque au monde. La spécialisation y remplace la taille.",
  "Quale fenomeno riguarda i giovani laureati italiani?":
    "Quel phénomène touche les jeunes diplômés italiens ?",
  "Un ritorno massiccio dall'estero": "Un retour massif de l'étranger",
  "Una partenza verso altri paesi dopo la formazione":
    "Un départ vers d'autres pays une fois la formation finie",
  "Un aumento dell'occupazione nel settore pubblico":
    "Une hausse de l'emploi dans le secteur public",
  "Una diminuzione delle iscrizioni universitarie all'estero":
    "Une baisse des inscriptions universitaires à l'étranger",
  "Molti lasciano il paese dopo gli studi. L'Italia forma persone che poi lavorano altrove, e questo pesa sui conti tanto quanto sull'economia.":
    "Beaucoup quittent le pays après leurs études. L'Italie forme des gens qui travaillent ensuite ailleurs, et cela pèse sur les comptes autant que sur l'économie.",
  "In quale zona si concentra il distretto meccanico italiano?":
    "Où se concentre le district mécanique italien ?",
  "Lungo la via Emilia": "Le long de la via Emilia",
  "In Sardegna": "En Sardaigne",
  "Nel Molise": "Dans le Molise",
  "Lungo la via Emilia, fra Bologna, Modena, Reggio e Parma: macchine per il packaging, motori, automazione. È il settore che esporta di più.":
    "Le long de la via Emilia, entre Bologne, Modène, Reggio et Parme : machines d'emballage, moteurs, automatisation. C'est le secteur qui exporte le plus.",
  "Come nascono di solito i distretti industriali italiani?":
    "Comment naissent d'ordinaire les districts industriels italiens ?",
  "Da piani di sviluppo statali": "De plans de développement de l'État",
  "Da un mestiere già presente sul territorio, spesso artigiano":
    "D'un métier déjà présent sur le territoire, souvent artisanal",
  "Dall'insediamento di multinazionali": "De l'installation de multinationales",
  "Da fondi europei degli anni Novanta": "De fonds européens des années quatre-vingt-dix",
  "Non sono stati progettati a tavolino: sono cresciuti dove esisteva già una tradizione di bottega, e si sono specializzati passandosi il lavoro fra imprese vicine.":
    "Ils n'ont pas été dessinés sur le papier : ils ont poussé là où une tradition d'atelier existait déjà, et se sont spécialisés en se passant le travail d'une entreprise voisine à l'autre.",
  "Quale voce dell'economia italiana è legata direttamente al patrimonio culturale?":
    "Quel poste de l'économie italienne tient directement au patrimoine culturel ?",
  "La siderurgia": "La sidérurgie",
  "La chimica di base": "La chimie de base",
  "L'estrazione mineraria": "L'extraction minière",
  "Il turismo è una delle principali voci dell'economia, e poggia in gran parte sul patrimonio artistico e paesaggistico. Da qui anche i problemi di concentrazione nelle città d'arte.":
    "Le tourisme est l'un des principaux postes de l'économie, et il repose en grande partie sur le patrimoine artistique et paysager. De là viennent aussi les problèmes d'affluence dans les villes d'art.",
  "Quale articolo della Costituzione fonda l'adesione italiana all'Unione europea?":
    "Quel article de la Constitution fonde l'adhésion italienne à l'Union européenne ?",
  "L'articolo 117": "L'article 117",
  "L'articolo 11 consente le limitazioni di sovranità necessarie a un ordinamento che assicuri la pace. È lo stesso articolo che ripudia la guerra.":
    "L'article 11 consent aux limitations de souveraineté nécessaires à un ordre qui assure la paix. C'est le même article qui répudie la guerre.",
  "Quale comunità europea nasce nel 1951 con l'Italia fra i fondatori?":
    "Quelle communauté européenne naît en 1951 avec l'Italie parmi les fondateurs ?",
  "La CEE": "La CEE",
  "La CECA": "La CECA",
  "L'Euratom": "L'Euratom",
  "L'Unione europea": "L'Union européenne",
  "La Comunità europea del carbone e dell'acciaio. CEE ed Euratom nascono nel 1957 con i Trattati di Roma, e l'Unione europea nel 1992 a Maastricht.":
    "La Communauté européenne du charbon et de l'acier. La CEE et l'Euratom naissent en 1957 avec les traités de Rome, et l'Union européenne en 1992 à Maastricht.",
  "In quale anno l'Italia è ammessa all'ONU?":
    "En quelle année l'Italie est-elle admise à l'ONU ?",
  "Nel 1945": "En 1945",
  "Nel 1955, dieci anni dopo la fondazione: l'ammissione era rimasta bloccata dalle tensioni della guerra fredda e fu sbloccata insieme a quella di altri paesi.":
    "En 1955, dix ans après la fondation : l'admission était restée bloquée par les tensions de la guerre froide et fut débloquée en même temps que celle d'autres pays.",
  "In quale città furono firmati i trattati che istituirono la CEE?":
    "Dans quelle ville furent signés les traités instituant la CEE ?",
  "A Bruxelles": "À Bruxelles",
  "A Roma": "À Rome",
  "A Parigi": "À Paris",
  "A Maastricht": "À Maastricht",
  "In Campidoglio, a Roma, il 25 marzo 1957. La sede della firma non è un dettaglio: l'Italia non è entrata in un'Europa già esistente, l'ha costruita.":
    "Au Capitole, à Rome, le 25 mars 1957. Le lieu de la signature n'est pas un détail : l'Italie n'est pas entrée dans une Europe déjà faite, elle l'a bâtie.",
  "Da quando l'euro esiste come moneta di conto, prima delle banconote?":
    "Depuis quand l'euro existe-t-il comme monnaie de compte, avant les billets ?",
  "Dal 1992": "Depuis 1992",
  "Dal 1999": "Depuis 1999",
  "Dal 2002": "Depuis 2002",
  "Dal 2004": "Depuis 2004",
  "Dal 1999 i cambi sono fissati e l'euro esiste nei conti; dal 1º gennaio 2002 circolano banconote e monete. La lira era nata nel 1862.":
    "Depuis 1999, les changes sont fixés et l'euro existe dans les comptes ; depuis le 1er janvier 2002 circulent billets et pièces. La lire était née en 1862.",
  "Che cos'è lo spazio Schengen?": "Qu'est-ce que l'espace Schengen ?",
  "L'area in cui circola l'euro": "La zone où circule l'euro",
  "L'area in cui i controlli alle frontiere interne sono aboliti":
    "La zone où les contrôles aux frontières intérieures sont supprimés",
  "L'unione doganale europea": "L'union douanière européenne",
  "Il mercato unico dei servizi": "Le marché unique des services",
  "Riguarda la circolazione delle persone senza controlli alle frontiere interne. Non coincide con l'area dell'euro: alcuni paesi stanno in una e non nell'altra.":
    "Il porte sur la circulation des personnes sans contrôle aux frontières intérieures. Il ne coïncide pas avec la zone euro : certains pays sont dans l'une et pas dans l'autre.",
  "Quale organizzazione con sede a Roma si occupa di aiuti alimentari d'emergenza?":
    "Quelle organisation ayant son siège à Rome s'occupe de l'aide alimentaire d'urgence ?",
  "La FAO": "La FAO",
  "Il Programma alimentare mondiale": "Le Programme alimentaire mondial",
  "L'OMS": "L'OMS",
  "L'UNESCO": "L'UNESCO",
  "Il Programma alimentare mondiale, che con FAO e IFAD fa di Roma la capitale internazionale dei temi dell'alimentazione. L'OMS sta a Ginevra e l'UNESCO a Parigi.":
    "Le Programme alimentaire mondial qui, avec la FAO et le FIDA, fait de Rome la capitale internationale des questions d'alimentation. L'OMS est à Genève et l'UNESCO à Paris.",
  "L'italiano è una delle lingue ufficiali dell'Unione europea?":
    "L'italien est-il l'une des langues officielles de l'Union européenne ?",
  "No, le lingue ufficiali sono solo tre": "Non, les langues officielles ne sont que trois",
  "Sì": "Oui",
  "Solo per i documenti che riguardano l'Italia":
    "Seulement pour les documents qui concernent l'Italie",
  "Solo dal 2004": "Seulement depuis 2004",
  "L'italiano è lingua ufficiale dell'Unione fin dall'inizio, come lingua di uno degli Stati fondatori: tutti gli atti vengono pubblicati anche in italiano.":
    "L'italien est langue officielle de l'Union depuis le début, comme langue de l'un des États fondateurs : tous les actes sont publiés en italien aussi.",
  "Qual è oggi la comunità straniera più numerosa in Italia?":
    "Quelle est aujourd'hui la communauté étrangère la plus nombreuse en Italie ?",
  "Quella romena": "La roumaine",
  "Quella cinese": "La chinoise",
  "Quella marocchina": "La marocaine",
  "Quella albanese": "L'albanaise",
  "La comunità romena è la più numerosa fra i circa cinque milioni di cittadini stranieri residenti. Albanese e marocchina sono fra le più antiche per insediamento.":
    "La communauté roumaine est la plus nombreuse parmi les quelque cinq millions de résidents étrangers. L'albanaise et la marocaine comptent parmi les plus anciennement installées.",
  "Verso quali destinazioni si diresse principalmente l'emigrazione italiana?":
    "Vers quelles destinations l'émigration italienne s'est-elle principalement dirigée ?",
  "Verso le Americhe prima e l'Europa del Nord poi":
    "Vers les Amériques d'abord, puis vers l'Europe du Nord",
  "Verso l'Africa settentrionale": "Vers l'Afrique du Nord",
  "Verso l'Asia orientale": "Vers l'Asie orientale",
  "Verso l'Europa dell'Est": "Vers l'Europe de l'Est",
  "Prima Stati Uniti, Argentina e Brasile; dopo la Seconda guerra mondiale soprattutto Germania, Svizzera, Belgio e Francia. Da lì le grandi comunità di origine italiana nel mondo.":
    "D'abord les États-Unis, l'Argentine et le Brésil ; après la Seconde Guerre mondiale surtout l'Allemagne, la Suisse, la Belgique et la France. De là viennent les grandes communautés d'origine italienne dans le monde.",
  "In quale decennio il saldo migratorio italiano si inverte, da paese di partenza a paese di arrivo?":
    "Dans quelle décennie le solde migratoire italien s'inverse-t-il, d'un pays de départ à un pays d'arrivée ?",
  "Negli anni Sessanta": "Dans les années soixante",
  "Negli anni Ottanta": "Dans les années quatre-vingt",
  "Negli anni Duemila": "Dans les années deux mille",
  "Negli anni Dieci": "Dans les années deux mille dix",
  "Negli anni Ottanta. Il paese che aveva visto partire ventisei milioni di persone comincia a riceverne, e nel giro di una generazione il dibattito pubblico cambia del tutto.":
    "Dans les années quatre-vingt. Le pays qui avait vu partir vingt-six millions de personnes commence à en recevoir, et en une génération le débat public change du tout au tout.",
  "Di quale gruppo di grandi economie fa parte l'Italia?":
    "De quel groupe de grandes économies l'Italie fait-elle partie ?",
  "Del G7": "Du G7",
  "Del Consiglio nordico": "Du Conseil nordique",
  "Del Mercosur": "Du Mercosur",
  "Dell'ASEAN": "De l'ANASE",
  "Del G7 e del G20. Le altre organizzazioni citate riuniscono paesi di altre aree del mondo.":
    "Du G7 et du G20. Les autres organisations citées réunissent des pays d'autres régions du monde.",
  "Perché la posizione geografica rende l'Italia una frontiera esterna dell'Unione europea?":
    "Pourquoi sa position géographique fait-elle de l'Italie une frontière extérieure de l'Union européenne ?",
  "Perché confina con quattro Stati non europei":
    "Parce qu'elle a une frontière avec quatre États non européens",
  "Perché si estende al centro del Mediterraneo, fra Europa e Africa":
    "Parce qu'elle s'avance au centre de la Méditerranée, entre l'Europe et l'Afrique",
  "Perché non fa parte dello spazio Schengen":
    "Parce qu'elle ne fait pas partie de l'espace Schengen",
  "Perché ha il litorale più corto dell'Unione":
    "Parce qu'elle a le littoral le plus court de l'Union",
  "La penisola e le isole si spingono verso sud fino a Lampedusa, più vicina all'Africa che alla Sicilia. Da qui il ruolo dell'Italia nel dibattito europeo sulle frontiere marittime.":
    "La péninsule et les îles descendent vers le sud jusqu'à Lampedusa, plus proche de l'Afrique que de la Sicile. De là vient le rôle de l'Italie dans le débat européen sur les frontières maritimes.",
  "Che cosa significa la sigla CCNL?": "Que signifie le sigle CCNL ?",
  "Contratto collettivo nazionale di lavoro":
    "Contratto collettivo nazionale di lavoro, la convention collective nationale de travail",
  "Consiglio consultivo nazionale del lavoro": "Conseil consultatif national du travail",
  "Codice civile nazionale del lavoro": "Code civil national du travail",
  "Cassa contributiva nazionale dei lavoratori": "Caisse nationale de cotisation des travailleurs",
  "Il contratto collettivo nazionale di lavoro, firmato per ciascun settore dalle organizzazioni dei datori e dai sindacati. In Italia le condizioni minime si fissano per settore, non per azienda.":
    "Le CCNL, la convention collective nationale de travail, signée pour chaque branche par les organisations patronales et les syndicats. En Italie, les conditions minimales se fixent par branche et non par entreprise.",
  "Quale articolo della Costituzione richiede una retribuzione sufficiente a un'esistenza libera e dignitosa?":
    "Quel article de la Constitution exige une rémunération qui suffise à une existence libre et digne ?",
  "L'articolo 4": "L'article 4",
  "L'articolo 36": "L'article 36",
  "L'articolo 36. L'articolo 4 riconosce il diritto al lavoro e il 40 il diritto di sciopero: tre articoli spesso citati insieme e facili da scambiare.":
    "L'article 36. L'article 4 reconnaît le droit au travail et le 40 le droit de grève : trois articles souvent cités ensemble et faciles à confondre.",
  "Quale ente incassa i contributi previdenziali e paga le pensioni?":
    "Quel organisme encaisse les cotisations et verse les retraites ?",
  "L'INAIL": "L'INAIL",
  "L'INPS": "L'INPS",
  "L'Agenzia delle entrate": "L'administration fiscale",
  "Il Ministero del lavoro": "Le ministère du Travail",
  "L'INPS. L'INAIL assicura invece contro gli infortuni sul lavoro e le malattie professionali: due enti distinti che accompagnano ogni rapporto di lavoro.":
    "L'INPS. L'INAIL, lui, assure contre les accidents du travail et les maladies professionnelles : deux organismes distincts qui accompagnent toute relation de travail.",
  "Contro che cosa assicura l'INAIL?": "Contre quoi l'INAIL assure-t-il ?",
  "Contro la disoccupazione": "Contre le chômage",
  "Contro gli infortuni sul lavoro e le malattie professionali":
    "Contre les accidents du travail et les maladies professionnelles",
  "Contro il fallimento dell'azienda": "Contre la faillite de l'entreprise",
  "Contro i danni a terzi": "Contre les dommages causés à autrui",
  "Infortuni e malattie professionali. L'indennità di disoccupazione è invece pagata dall'INPS.":
    "Les accidents et les maladies professionnelles. L'indemnité de chômage, elle, est versée par l'INPS.",
  "Quali sono le tre confederazioni sindacali storiche italiane?":
    "Quelles sont les trois confédérations syndicales historiques italiennes ?",
  "CGIL, CISL e UIL": "CGIL, CISL et UIL",
  "CGIL, INPS e INAIL": "CGIL, INPS et INAIL",
  "CISL, CNEL e UIL": "CISL, CNEL et UIL",
  "UIL, CCNL e CGIL": "UIL, CCNL et CGIL",
  "CGIL, CISL e UIL, nate dalla scissione del sindacato unitario del dopoguerra lungo linee politiche. INPS e INAIL sono enti pubblici, e il CNEL è un organo di consulenza.":
    "CGIL, CISL et UIL, nées de la scission du syndicat unitaire d'après-guerre selon des lignes politiques. L'INPS et l'INAIL sont des organismes publics, et le CNEL est un organe consultatif.",
  "Quante settimane di ferie retribuite spettano come minimo ogni anno?":
    "À combien de semaines de congés payés a-t-on droit au minimum chaque année ?",
  "Quattro settimane, di cui almeno due da godere nell'anno di maturazione. I contratti collettivi possono prevederne di più, mai di meno.":
    "Quatre semaines, dont deux au moins à prendre dans l'année où elles sont acquises. Les conventions collectives peuvent en prévoir davantage, jamais moins.",
  "Che cosa distingue il lavoro con partita IVA?":
    "Qu'est-ce qui distingue le travail sous partita IVA ?",
  "Si riceve una busta paga come i dipendenti": "On reçoit une fiche de paie comme les salariés",
  "Si emette fattura e si versano da sé imposte e contributi":
    "On émet une facture et l'on verse soi-même impôts et cotisations",
  "Il datore paga tutti i contributi": "L'employeur paie toutes les cotisations",
  "Non si pagano imposte sul reddito": "On ne paie pas d'impôt sur le revenu",
  "È lavoro autonomo: niente busta paga, niente ferie retribuite e nessuna trattenuta a monte. Imposte e contributi li versa direttamente chi lavora.":
    "C'est du travail indépendant : pas de fiche de paie, pas de congés payés et aucune retenue à la source. Impôts et cotisations, c'est celui qui travaille qui les verse.",
  "Che cosa serve per licenziare un dipendente a tempo indeterminato?":
    "Que faut-il pour licencier un salarié en contrat à durée indéterminée ?",
  "Nulla: basta il preavviso": "Rien : le préavis suffit",
  "Una giusta causa o un giustificato motivo": "Une juste cause ou un motif justifié",
  "L'autorizzazione del sindacato": "L'autorisation du syndicat",
  "Il consenso dell'ispettorato del lavoro": "L'accord de l'inspection du travail",
  "Il tempo indeterminato non rende impossibile il licenziamento: lo condiziona a una ragione riconosciuta. Senza di essa il provvedimento è impugnabile davanti al giudice del lavoro.":
    "La durée indéterminée ne rend pas le licenciement impossible : elle le subordonne à une raison reconnue. Faute de quoi la mesure peut être contestée devant le juge du travail.",
  "Che cos'è l'apprendistato?": "Qu'est-ce que l'apprentissage ?",
  "Un periodo di prova non retribuito": "Une période d'essai non rémunérée",
  "Un contratto che unisce lavoro e formazione, rivolto ai giovani":
    "Un contrat qui unit travail et formation, destiné aux jeunes",
  "Un tirocinio universitario obbligatorio": "Un stage universitaire obligatoire",
  "Un corso serale organizzato dalle regioni": "Un cours du soir organisé par les régions",
  "È un vero contratto di lavoro, retribuito, che affianca alla prestazione un percorso formativo, con contributi ridotti per il datore.":
    "C'est un véritable contrat de travail, rémunéré, qui adjoint à la prestation un parcours de formation, avec des cotisations réduites pour l'employeur.",
  "In che anno è stato approvato lo Statuto dei lavoratori?":
    "En quelle année le Statut des travailleurs a-t-il été adopté ?",
  "Nel 1970, la legge 300. Portò le libertà costituzionali dentro i luoghi di lavoro e limitò il licenziamento nelle imprese maggiori. Il 1978 è invece l'anno del Servizio sanitario nazionale.":
    "En 1970, la loi 300. Elle porta les libertés constitutionnelles à l'intérieur des lieux de travail et limita le licenciement dans les grandes entreprises. 1978 est en revanche l'année du Service national de santé.",
  "Perché il contratto a tempo determinato ha limiti di durata e di rinnovo?":
    "Pourquoi le contrat à durée déterminée est-il borné dans sa durée et dans ses renouvellements ?",
  "Per ridurre il costo del lavoro": "Pour abaisser le coût du travail",
  "Per impedire che diventi un rapporto permanente senza le tutele di uno stabile":
    "Pour empêcher qu'il devienne une relation permanente sans les protections d'un emploi stable",
  "Per favorire le assunzioni stagionali": "Pour favoriser les embauches saisonnières",
  "Per uniformarsi a un regolamento europeo del 2001":
    "Pour se conformer à un règlement européen de 2001",
  "Senza limiti si potrebbe tenere una persona a termine per tutta la vita lavorativa. I tetti servono a evitare che la precarietà diventi la forma normale del rapporto.":
    "Sans bornes, on pourrait garder quelqu'un à durée déterminée toute sa vie de travail. Les plafonds servent à éviter que la précarité devienne la forme ordinaire de la relation.",
  "Che cosa sono i contributi previdenziali in busta paga?":
    "Que sont les cotisations de retraite sur la fiche de paie ?",
  "Una tassa sul reddito": "Un impôt sur le revenu",
  "Le somme versate all'INPS che costruiscono il diritto alla pensione":
    "Les sommes versées à l'INPS qui construisent le droit à la retraite",
  "Un contributo volontario al sindacato": "Une contribution volontaire au syndicat",
  "Un accantonamento restituito ogni anno": "Une provision restituée chaque année",
  "Sono la differenza principale fra lordo e netto insieme all'IRPEF, e non sono un'imposta: costruiscono la posizione previdenziale di chi lavora.":
    "Elles font, avec l'IRPEF, l'essentiel de l'écart entre le brut et le net, et ce ne sont pas un impôt : elles bâtissent les droits à retraite de celui qui travaille.",
  "Quale conseguenza ha l'assenza di un salario minimo legale in Italia?":
    "Quelle conséquence a l'absence de salaire minimum légal en Italie ?",
  "Che nessun lavoratore ha un minimo garantito": "Qu'aucun salarié n'a de minimum garanti",
  "Che il minimo dipende dal contratto collettivo applicato, e chi non ne ha uno resta scoperto":
    "Que le minimum dépend de la convention collective appliquée, et que celui qui n'en a pas reste sans protection",
  "Che i minimi li fissa ogni regione": "Que chaque région fixe les minimums",
  "Che il minimo è stabilito ogni anno dal bilancio dello Stato":
    "Que le minimum est arrêté chaque année par le budget de l'État",
  "I minimi stanno nei CCNL, che coprono la gran parte ma non la totalità dei rapporti. Chi lavora in un settore senza contratto applicato non ha quella protezione: è la ragione per cui il tema si discute da anni.":
    "Les minimums figurent dans les CCNL, qui couvrent la plus grande part des relations de travail mais non la totalité. Qui travaille dans une branche sans convention appliquée n'a pas cette protection : c'est la raison pour laquelle le sujet se discute depuis des années.",
  "Come è finanziato il Servizio sanitario nazionale?":
    "Comment le Service national de santé est-il financé ?",
  "Con premi assicurativi individuali": "Par des primes d'assurance individuelles",
  "Con la fiscalità generale": "Par l'impôt",
  "Con i contributi versati dai soli lavoratori dipendenti":
    "Par les cotisations des seuls salariés",
  "Con i ticket pagati dai pazienti": "Par les tickets payés par les patients",
  "Dalle tasse, non da un premio assicurativo. È la differenza di fondo rispetto al vecchio sistema delle casse mutue, in cui la copertura dipendeva dalla categoria professionale.":
    "Par l'impôt, non par une prime d'assurance. C'est la différence de fond avec l'ancien système des caisses mutuelles, où la couverture dépendait de la profession.",
  "Chi gestisce concretamente la sanità in Italia?": "Qui gère concrètement la santé en Italie ?",
  "Lo Stato centrale": "L'État central",
  "Le regioni": "Les régions",
  "I comuni": "Les communes",
  "Le province": "Les provinces",
  "Le regioni organizzano aziende sanitarie e ospedali. Da qui differenze reali di attesa e organizzazione, e la mobilità sanitaria di chi si sposta per curarsi.":
    "Les régions organisent les agences de santé et les hôpitaux. De là des différences réelles d'attente et d'organisation, et les déplacements de ceux qui vont se faire soigner ailleurs.",
  "Chi è il primo riferimento sanitario per un residente in Italia?":
    "Vers qui un résident en Italie se tourne-t-il d'abord pour sa santé ?",
  "Il pronto soccorso": "Le service des urgences",
  "Lo specialista ospedaliero": "Le spécialiste hospitalier",
  "Il farmacista": "Le pharmacien",
  "Il medico di medicina generale, che si sceglie fra quelli disponibili nella propria zona: visita, prescrive e indirizza allo specialista.":
    "Le médecin généraliste, que l'on choisit parmi ceux qui exercent dans son secteur : il examine, prescrit et adresse au spécialiste.",
  "Con quale criterio si viene ricevuti al pronto soccorso?":
    "Selon quel critère est-on reçu aux urgences ?",
  "In ordine di arrivo": "Dans l'ordre d'arrivée",
  "In ordine di gravità": "Dans l'ordre de gravité",
  "In base all'età": "D'après l'âge",
  "In base alla residenza": "D'après le lieu de résidence",
  "I codici di priorità stabiliscono chi passa prima: una persona arrivata dopo può essere ricevuta per prima se la sua condizione è più grave.":
    "Les codes de priorité décident qui passe le premier : quelqu'un arrivé plus tard peut être reçu avant si son état est plus grave.",
  "Che cos'è il ticket sanitario?": "Qu'est-ce que le ticket sanitario ?",
  "Il costo pieno di una visita privata": "Le prix entier d'une consultation privée",
  "Una quota a carico del paziente per alcune prestazioni, con esenzioni":
    "Une part à la charge du patient pour certains actes, avec des exonérations",
  "Un abbonamento annuale al servizio sanitario": "Un abonnement annuel au service de santé",
  "La tassa regionale sulla salute": "La taxe régionale sur la santé",
  "Una compartecipazione alla spesa, con esenzioni per reddito, età e patologia. Le prestazioni urgenti al pronto soccorso non si pagano.":
    "Une participation à la dépense, avec des exonérations selon le revenu, l'âge et la maladie. Les soins urgents aux urgences ne se paient pas.",
  "Che cosa sostituì il Servizio sanitario nazionale nel 1978?":
    "Qu'a remplacé le Service national de santé en 1978 ?",
  "Le assicurazioni private obbligatorie": "Les assurances privées obligatoires",
  "Le casse mutue legate alla categoria professionale":
    "Les caisses mutuelles liées à la profession",
  "Gli ospedali gestiti dalle province": "Les hôpitaux gérés par les provinces",
  "Il sistema di assistenza comunale": "Le système d'assistance communale",
  "Prima del 1978 la copertura dipendeva dal mestiere: ciascuna categoria aveva la propria cassa, e chi non rientrava in nessuna restava scoperto.":
    "Avant 1978, la couverture dépendait du métier : chaque profession avait sa caisse, et qui n'entrait dans aucune restait sans rien.",
  "Quanti anni dura la scuola primaria italiana?":
    "Combien d'années dure l'école primaire italienne ?",
  "Cinque anni, dai sei agli undici. Seguono tre anni di secondaria di primo grado e cinque di secondaria di secondo grado.":
    "Cinq ans, de six à onze ans. Suivent trois ans de secondaire du premier degré et cinq du second degré.",
  "Quanti anni dura la scuola secondaria di primo grado?":
    "Combien d'années dure le secondaire du premier degré ?",
  "Tre anni, quelle che tutti chiamano medie, e si chiudono con un esame. La secondaria di secondo grado dura invece cinque anni.":
    "Trois ans, ce que tout le monde appelle les medie, et qui se closent par un examen. Le secondaire du second degré dure, lui, cinq ans.",
  "Fra quali indirizzi si sceglie per la scuola secondaria di secondo grado?":
    "Entre quelles filières choisit-on pour le secondaire du second degré ?",
  "Liceo, istituto tecnico e istituto professionale":
    "Le lycée général, le lycée technique et le lycée professionnel",
  "Liceo classico e liceo scientifico soltanto":
    "Le lycée classique et le lycée scientifique seulement",
  "Scuola pubblica e scuola paritaria": "L'école publique et l'école sous contrat",
  "Percorso breve e percorso lungo": "Un parcours court et un parcours long",
  "Tre indirizzi, e la scelta si fa a tredici anni. Tutti e tre portano a un diploma che dà accesso all'università: il liceo non è la scuola superiore in generale, è uno dei tre.":
    "Trois filières, et le choix se fait à treize ans. Toutes trois mènent à un diplôme qui ouvre l'université : le liceo n'est pas le lycée en général, c'est l'une des trois.",
  "Come si chiama ufficialmente l'esame che chiude la scuola superiore?":
    "Quel est le nom officiel de l'examen qui clôt le secondaire ?",
  "Maturità": "La maturità",
  "Esame di Stato": "L'examen d'État",
  "Diploma nazionale": "Le diplôme national",
  "Esame di ammissione": "L'examen d'admission",
  "Ufficialmente esame di Stato; maturità è il nome con cui lo chiamano tutti. Si valuta in centesimi, con sessanta come minimo.":
    "Officiellement l'examen d'État ; maturità est le nom que tout le monde emploie. On le note sur cent, avec soixante pour minimum.",
  "Su quale scala si valuta il voto finale di laurea?":
    "Sur quelle échelle se note la mention finale de la licence ?",
  "In centodecimi, con centodieci e lode come massimo. I trentesimi valgono per i singoli esami e i centesimi per la maturità.":
    "Sur cent dix, avec cent dix et les félicitations pour maximum. Les notes sur trente valent pour chaque examen et celles sur cent pour la maturità.",
  "Quali corsi universitari sono a ciclo unico, senza triennale e magistrale separate?":
    "Quelles études universitaires forment un cycle unique, sans licence et master séparés ?",
  "Economia e ingegneria": "L'économie et l'ingénierie",
  "Medicina, giurisprudenza e architettura": "La médecine, le droit et l'architecture",
  "Lettere e filosofia": "Les lettres et la philosophie",
  "Scienze politiche e sociologia": "Les sciences politiques et la sociologie",
  "Medicina, giurisprudenza e architettura seguono un percorso unico più lungo. Gli altri corsi si articolano in una laurea triennale seguita da una magistrale biennale.":
    "La médecine, le droit et l'architecture suivent un parcours unique plus long. Les autres cursus s'articulent en une licence de trois ans suivie d'un master de deux.",
  "A che cosa serve la tessera sanitaria, oltre a dare accesso alle prestazioni?":
    "À quoi sert la tessera sanitaria, outre l'accès aux soins ?",
  "A votare alle elezioni regionali": "À voter aux élections régionales",
  "A riportare il codice fiscale e a valere come tessera europea di assicurazione malattia":
    "À porter le codice fiscale et à valoir comme carte européenne d'assurance maladie",
  "A ottenere sconti sui trasporti pubblici":
    "À obtenir des réductions dans les transports publics",
  "A dimostrare la residenza": "À prouver son lieu de résidence",
  "Porta il codice fiscale sul fronte e sul retro è la tessera europea che consente l'assistenza negli altri Stati dell'Unione.":
    "Elle porte le codice fiscale au recto, et au verso c'est la carte européenne qui donne droit aux soins dans les autres États de l'Union.",
  "Da quanti caratteri è composto il codice fiscale?":
    "De combien de caractères le codice fiscale est-il composé ?",
  "Undici": "Onze",
  "Tredici": "Treize",
  "Sedici": "Seize",
  "Sedici caratteri ricavati da nome, cognome, data e luogo di nascita. Undici è la lunghezza della partita IVA, che è un'altra cosa.":
    "Seize caractères tirés du prénom, du nom, de la date et du lieu de naissance. Onze est la longueur de la partita IVA, qui est tout autre chose.",
  "Che cos'è la residenza anagrafica?": "Qu'est-ce que la residenza anagrafica ?",
  "L'indirizzo indicato nel contratto di lavoro": "L'adresse indiquée au contrat de travail",
  "L'iscrizione all'anagrafe del comune in cui si abita davvero":
    "L'inscription au registre de la commune où l'on habite réellement",
  "Il luogo di nascita registrato sul certificato": "Le lieu de naissance porté sur l'acte",
  "L'indirizzo del proprio datore di lavoro": "L'adresse de son employeur",
  "Da essa dipendono carta d'identità, medico di base, iscrizione a scuola e, per i cittadini dell'Unione, il voto alle comunali.":
    "En dépendent la carte d'identité, le médecin traitant, l'inscription à l'école et, pour les citoyens de l'Union, le vote aux élections communales.",
  "A quale autorità si chiede il permesso di soggiorno?":
    "À quelle autorité demande-t-on le permesso di soggiorno ?",
  "Al comune": "À la commune",
  "Alla questura": "À la questura",
  "Alla regione": "À la région",
  "All'ambasciata": "À l'ambassade",
  "Alla questura, presentando la domanda tramite gli uffici postali abilitati. L'accordo di integrazione si firma invece allo sportello unico presso la prefettura.":
    "À la questura, en déposant la demande par les bureaux de poste habilités. L'accord d'intégration, lui, se signe au guichet unique de la préfecture.",
  "Quale livello di italiano serve per il permesso di soggiorno UE per soggiornanti di lungo periodo?":
    "Quel niveau d'italien faut-il pour le permesso di soggiorno de longue durée de l'Union ?",
  "B2": "B2",
  "A2, dimostrato con un test. Il B1 serve invece per la domanda di cittadinanza: due soglie diverse per due procedure diverse.":
    "A2, prouvé par un test. Le B1 sert en revanche à la demande de nationalité : deux seuils différents pour deux procédures différentes.",
  "Quanti anni di soggiorno regolare servono come minimo per il permesso di lungo periodo?":
    "Combien d'années de séjour régulier faut-il au minimum pour le permesso di soggiorno de longue durée ?",
  "Cinque anni, insieme a un reddito e al test di italiano A2. Dieci anni è invece il termine ordinario per chiedere la cittadinanza per residenza.":
    "Cinq ans, avec un revenu et le test d'italien A2. Dix ans est en revanche le délai ordinaire pour demander la nationalité par résidence.",
  "Quanti crediti si ricevono alla firma dell'accordo di integrazione?":
    "Combien de crédits reçoit-on à la signature de l'accord d'intégration ?",
  "Sedici crediti iniziali, da mantenere o accrescere in due anni, prorogabili di uno. Azzerarli comporta la revoca del permesso di soggiorno.":
    "Seize crédits au départ, à conserver ou à augmenter en deux ans, prorogeables d'un an. Les ramener à zéro entraîne le retrait du permesso di soggiorno.",
  "Entro quanto tempo dalla firma dell'accordo si partecipa alla sessione di formazione civica?":
    "Dans quel délai après la signature de l'accord participe-t-on à la séance de formation civique ?",
  "Entro un mese": "Dans le mois",
  "Entro tre mesi": "Dans les trois mois",
  "Entro un anno": "Dans l'année",
  "Non è prevista": "Elle n'est pas prévue",
  "Entro tre mesi. Non è un esame: la partecipazione dà crediti, e la sessione riguarda ordinamento, diritti e doveri e accesso ai servizi.":
    "Dans les trois mois. Ce n'est pas un examen : la participation donne des crédits, et la séance porte sur les institutions, les droits et devoirs et l'accès aux services.",
  "Che cosa si verifica alla scadenza dell'accordo di integrazione?":
    "Que vérifie-t-on à l'échéance de l'accord d'intégration ?",
  "Un esame scritto di storia italiana": "Un examen écrit d'histoire italienne",
  "La conoscenza dell'italiano parlato almeno all'A2 e una conoscenza sufficiente della vita civile":
    "La connaissance de l'italien parlé au moins au niveau A2 et une connaissance suffisante de la vie civique",
  "Il possesso di un contratto di lavoro a tempo indeterminato":
    "Le fait d'avoir un contrat de travail à durée indéterminée",
  "La frequenza di un corso universitario": "Le suivi d'un cursus universitaire",
  "Non esiste alcun esame di educazione civica: si verificano il livello linguistico e una conoscenza sufficiente della cultura civica e della vita civile in Italia.":
    "Il n'existe aucun examen d'éducation civique : on vérifie le niveau de langue et une connaissance suffisante de la culture civique et de la vie civile en Italie.",
  "Quanti anni di residenza servono ordinariamente a un cittadino non dell'Unione per chiedere la cittadinanza?":
    "Combien d'années de résidence faut-il ordinairement à un ressortissant hors Union pour demander la nationalité ?",
  "Dieci anni. Il termine è più breve per i cittadini dell'Unione, per i rifugiati e per chi è nato in Italia.":
    "Dix ans. Le délai est plus court pour les citoyens de l'Union, pour les réfugiés et pour qui est né en Italie.",
  "Per quali vie si può ottenere la cittadinanza italiana?":
    "Par quelles voies peut-on obtenir la nationalité italienne ?",
  "Solo per nascita sul territorio": "Par la seule naissance sur le territoire",
  "Per discendenza, per matrimonio o per residenza": "Par filiation, par mariage ou par résidence",
  "Solo per matrimonio": "Par le seul mariage",
  "Solo per decreto del Presidente della Repubblica":
    "Par le seul décret du président de la République",
  "Le tre vie ordinarie. La nascita sul territorio da sola non basta: l'Italia non applica il principio dello ius soli puro.":
    "Les trois voies ordinaires. La naissance sur le territoire ne suffit pas à elle seule : l'Italie n'applique pas le droit du sol pur.",
  "Da quale anno la domanda di cittadinanza richiede un certificato di lingua?":
    "Depuis quelle année la demande de nationalité exige-t-elle un certificat de langue ?",
  "Dal 2012": "Depuis 2012",
  "Dal 2018": "Depuis 2018",
  "Dal 2022": "Depuis 2022",
  "Dal 2018. L'accordo di integrazione, che è cosa diversa e riguarda il permesso di soggiorno, era invece entrato in vigore nel 2012.":
    "Depuis 2018. L'accord d'intégration, qui est autre chose et concerne le permesso di soggiorno, était entré en vigueur en 2012.",
  "Che cosa serve per accedere ai servizi pubblici online in Italia?":
    "Que faut-il pour accéder aux services publics en ligne en Italie ?",
  "Un'identità digitale come SPID o la carta d'identità elettronica":
    "Une identité numérique comme SPID, ou la carte d'identité électronique",
  "Il solo codice fiscale": "Le seul codice fiscale",
  "Un indirizzo di posta elettronica certificata":
    "Une adresse de courrier électronique certifiée",
  "La tessera sanitaria scaduta": "Une tessera sanitaria périmée",
  "Senza SPID o carta d'identità elettronica non si prenota una visita, non si scarica un certificato e non si consulta il proprio fascicolo previdenziale.":
    "Sans SPID ni carte d'identité électronique, on ne prend pas rendez-vous, on ne télécharge pas de certificat et on ne consulte pas son dossier de retraite.",
  "Le prove richieste dallo Stato italiano riguardano la storia e le istituzioni del paese?":
    "Les épreuves exigées par l'État italien portent-elles sur l'histoire et les institutions du pays ?",
  "Sì, entrambe le prove sono di educazione civica":
    "Oui, les deux épreuves sont d'éducation civique",
  "No: il test A2 e il certificato B1 sono prove linguistiche":
    "Non : le test A2 et le certificat B1 sont des épreuves de langue",
  "Solo la prova per la cittadinanza è di educazione civica":
    "Seule l'épreuve pour la nationalité est d'éducation civique",
  "Solo il test per il permesso è di educazione civica":
    "Seul le test pour le titre de séjour est d'éducation civique",
  "Sia l'A2 per il permesso di lungo periodo sia il B1 per la cittadinanza esaminano la lingua. L'unico riferimento alla vita civile è nella verifica dell'accordo di integrazione, e non è un esame di storia.":
    "L'A2 pour le titre de longue durée comme le B1 pour la nationalité portent sur la langue. Le seul renvoi à la vie civique se trouve dans la vérification de l'accord d'intégration, et ce n'est pas un examen d'histoire.",
  "Come si beve abitualmente il caffè in Italia?":
    "Comment boit-on habituellement le café en Italie ?",
  "Lungo, seduti al tavolo": "Allongé, assis à une table",
  "Espresso, spesso al banco e in poco tempo":
    "En espresso, souvent au comptoir et en peu de temps",
  "Filtrato, in tazza grande": "Filtré, dans une grande tasse",
  "Solo a colazione": "Seulement au petit-déjeuner",
  "L'espresso al banco è il gesto quotidiano più diffuso. Al tavolo il prezzo di solito cambia, ed è la ragione per cui molti restano in piedi.":
    "L'espresso au comptoir est le geste quotidien le plus répandu. À table, le prix change d'ordinaire, et c'est pourquoi beaucoup restent debout.",
  "Che cos'è il caffè corretto?": "Qu'est-ce qu'un caffè corretto ?",
  "Un espresso con l'aggiunta di un liquore": "Un espresso avec une goutte d'alcool",
  "Un caffè preparato con acqua filtrata": "Un café fait avec de l'eau filtrée",
  "Un caffè senza zucchero": "Un café sans sucre",
  "Un caffè con latte freddo": "Un café au lait froid",
  "Corretto con grappa, sambuca o un altro liquore. Si prende di solito dopo il pasto, al posto o dopo l'espresso semplice.":
    "Corrigé à la grappa, à la sambuca ou à un autre alcool. On le prend d'ordinaire après le repas, à la place de l'espresso simple ou après lui.",
  "Che cos'è il primo in un pasto italiano?": "Qu'est-ce que le primo dans un repas italien ?",
  "L'antipasto": "L'entrée",
  "La portata di pasta, riso o zuppa": "Le plat de pâtes, de riz ou de soupe",
  "Il piatto di carne o pesce": "Le plat de viande ou de poisson",
  "Il contorno servito per primo": "L'accompagnement servi en premier",
  "Primo e secondo sono due portate distinte, servite una dopo l'altra: il primo è pasta, riso o zuppa, il secondo carne o pesce con contorno.":
    "Le primo et le secondo sont deux plats distincts, servis l'un après l'autre : le primo, ce sont des pâtes, du riz ou une soupe, le secondo de la viande ou du poisson avec un accompagnement.",
  "Perché si dice che la cucina italiana al singolare quasi non esista?":
    "Pourquoi dit-on que la cuisine italienne, au singulier, n'existe presque pas ?",
  "Perché è stata inventata nel Novecento": "Parce qu'elle a été inventée au vingtième siècle",
  "Perché è regionale e spesso cittadina, e cambia di valle in valle":
    "Parce qu'elle est régionale et souvent citadine, et qu'elle change d'une vallée à l'autre",
  "Perché deriva interamente dalla cucina francese":
    "Parce qu'elle vient entièrement de la cuisine française",
  "Perché i prodotti sono importati": "Parce que les produits sont importés",
  "Il ragù non è lo stesso a Bologna e a Napoli, e la pizza napoletana e quella romana sono prodotti diversi. L'idea di una cucina nazionale unica è nata soprattutto fuori dai confini, con l'emigrazione.":
    "Le ragù n'est pas le même à Bologne et à Naples, et la pizza napolitaine et la romaine sont deux choses différentes. L'idée d'une cuisine nationale unique est née surtout hors des frontières, avec l'émigration.",
  "Che cos'è l'aperitivo?": "Qu'est-ce que l'aperitivo ?",
  "Il caffè che precede la colazione": "Le café qui précède le petit-déjeuner",
  "Il momento prima di cena, con una bevanda e qualcosa da mangiare":
    "Le moment d'avant le dîner, avec une boisson et quelque chose à manger",
  "Il dolce di fine pasto": "Le dessert de fin de repas",
  "Il pasto di mezzogiorno nei giorni festivi": "Le repas de midi des jours de fête",
  "Precede la cena e in alcune città, Milano in particolare, si è ampliato al punto da sostituirla quasi del tutto.":
    "Il précède le dîner et, dans certaines villes, à Milan surtout, il s'est étoffé au point de le remplacer presque tout à fait.",
  "Perché i giovani italiani lasciano tardi la casa dei genitori?":
    "Pourquoi les jeunes Italiens quittent-ils tard la maison de leurs parents ?",
  "Per una tradizione religiosa": "Par tradition religieuse",
  "Soprattutto per ragioni economiche: affitti, salari d'ingresso e lavoro instabile":
    "Surtout pour des raisons d'argent : les loyers, les salaires de départ et un travail instable",
  "Perché la legge lo prevede fino ai trent'anni":
    "Parce que la loi le prévoit jusqu'à trente ans",
  "Perché mancano corsi universitari fuori sede":
    "Parce qu'il manque des cursus universitaires loin de chez soi",
  "L'età media in cui si lascia la famiglia è fra le più alte d'Europa, e le indagini indicano cause soprattutto economiche più che culturali.":
    "L'âge moyen où l'on quitte sa famille est parmi les plus élevés d'Europe, et les enquêtes en donnent des causes économiques plus que culturelles.",
  "Quale ruolo hanno spesso i nonni nelle famiglie italiane?":
    "Quel rôle les grands-parents jouent-ils souvent dans les familles italiennes ?",
  "Vivono di norma separati dai figli e non partecipano":
    "Ils vivent en principe à l'écart de leurs enfants et n'y prennent pas part",
  "Curano quotidianamente i nipoti, sostenendo di fatto i bilanci familiari":
    "Ils gardent les petits-enfants au quotidien, soutenant de fait le budget des familles",
  "Sono assistiti in strutture pubbliche nella maggioranza dei casi":
    "Ils sont pris en charge en établissement public dans la plupart des cas",
  "Non hanno alcun ruolo riconosciuto": "Ils n'ont aucun rôle reconnu",
  "La cura dei nipoti da parte dei nonni sostituisce in molte famiglie servizi che costerebbero, e regge una parte non piccola dell'occupazione femminile.":
    "La garde des petits-enfants par les grands-parents remplace dans bien des familles des services qui coûteraient, et elle porte une part non négligeable de l'emploi des femmes.",
  "Come si chiamano i giocatori della nazionale italiana di calcio?":
    "Comment appelle-t-on les joueurs de la sélection italienne de football ?",
  "I rossoneri": "Les rossoneri",
  "Gli azzurri": "Les azzurri",
  "I bianconeri": "Les bianconeri",
  "I granata": "Les granata",
  "Gli azzurri, dal colore delle maglie, che viene dal blu Savoia e non dalla bandiera. Gli altri nomi appartengono a singole squadre di club.":
    "Les azzurri, du bleu de leurs maillots, qui vient du bleu de Savoie et non du drapeau. Les autres noms appartiennent à des clubs.",
  "Quanti campionati del mondo di calcio ha vinto l'Italia?":
    "Combien de coupes du monde de football l'Italie a-t-elle gagnées ?",
  "Quattro. Solo il Brasile ne ha vinti di più. Il calcio è lo sport nazionale e occupa le conversazioni da agosto a maggio.":
    "Quatre. Seul le Brésil en a gagné davantage. Le football est le sport national et il occupe les conversations d'août à mai.",
  "In quale mese si corre il Giro d'Italia?": "En quel mois court-on le Giro d'Italia ?",
  "A marzo": "En mars",
  "A maggio": "En mai",
  "A luglio": "En juillet",
  "A settembre": "En septembre",
  "A maggio, attraversando il paese. Il Tour de France si corre invece a luglio: le due grandi corse a tappe non si sovrappongono.":
    "En mai, en traversant le pays. Le Tour de France se court en juillet : les deux grandes courses à étapes ne se chevauchent pas.",
  "Da dove viene il colore della maglia del Giro d'Italia?":
    "D'où vient la couleur du maillot du Giro d'Italia ?",
  "Dalla bandiera nazionale": "Du drapeau national",
  "Dalla carta del quotidiano sportivo che organizzò la corsa":
    "Du papier du quotidien sportif qui organisa la course",
  "Dal colore delle Alpi al tramonto": "De la couleur des Alpes au couchant",
  "Da una scelta casuale degli anni Cinquanta":
    "D'un choix fait au hasard dans les années cinquante",
  "Come la maglia gialla del Tour, il colore viene dalla carta del giornale organizzatore. Due corse diverse, due giornali, due colori, stessa logica.":
    "Comme le maillot jaune du Tour, la couleur vient du papier du journal organisateur. Deux courses différentes, deux journaux, deux couleurs, la même logique.",
  "Che cosa succede a molti negozi e uffici italiani nel mese di agosto?":
    "Qu'arrive-t-il à beaucoup de magasins et de bureaux italiens au mois d'août ?",
  "Prolungano gli orari per il turismo": "Ils allongent leurs horaires pour le tourisme",
  "Chiudono per ferie, soprattutto intorno a Ferragosto":
    "Ils ferment pour congés, surtout autour du Ferragosto",
  "Passano a un orario continuato": "Ils passent à la journée continue",
  "Aprono anche di domenica per legge": "Ils ouvrent aussi le dimanche, par la loi",
  "Intorno al 15 agosto chiudono negozi, studi professionali e interi quartieri delle grandi città. È la settimana in cui il paese si ferma davvero.":
    "Autour du 15 août ferment les magasins, les cabinets et des quartiers entiers des grandes villes. C'est la semaine où le pays s'arrête pour de bon.",
  "Che cos'è la pausa pranzo nei negozi italiani?":
    "Qu'est-ce que la pause de midi dans les magasins italiens ?",
  "Una chiusura pomeridiana obbligatoria per legge":
    "Une fermeture de l'après-midi rendue obligatoire par la loi",
  "Una chiusura di alcune ore a metà giornata, con riapertura fino a sera":
    "Une fermeture de quelques heures au milieu du jour, avec réouverture jusqu'au soir",
  "Il giorno di riposo settimanale": "Le jour de repos hebdomadaire",
  "Un orario ridotto riservato all'estate": "Un horaire réduit réservé à l'été",
  "Diffusa soprattutto nei centri piccoli e al Sud. Non è obbligatoria, e nelle grandi città molti esercizi ormai restano aperti tutto il giorno.":
    "Répandue surtout dans les petites villes et dans le Sud. Elle n'est pas obligatoire, et dans les grandes villes bien des commerces restent désormais ouverts toute la journée.",
};
