import type { Course } from "@/lib/courses";

/**
 * Vivere in Italia.
 *
 * Il quinto corso della sezione Country studies, costruito sullo stesso
 * modello di Life in the UK, Leben in Deutschland, Vivre en France e Życie w
 * Polsce: stessi tipi di blocco, stessa forma della lezione, stessa struttura
 * del quiz. Cambia il contenuto — e la lingua, perché ognuno di questi corsi
 * è scritto nella lingua del proprio paese.
 *
 * NON ESISTE UN ESAME DI EDUCAZIONE CIVICA ITALIANO. Tre di quei corsi
 * ricalcano esami di Stato realmente esistenti. L'Italia non ne ha uno: per
 * la cittadinanza si richiede un certificato di conoscenza della lingua
 * italiana di livello B1, cioè una prova LINGUISTICA, non di conoscenza del
 * paese. Per il permesso di soggiorno di lungo periodo serve un test di
 * italiano di livello A2, e chi entra per la prima volta firma un accordo di
 * integrazione a crediti. Nessuna di queste prove verte sulla storia o sulle
 * istituzioni. Questo corso quindi non ricalca nulla e non prepara a nulla:
 * i numeri nel campo `exam` sono i numeri di questo corso, non di uno Stato.
 *
 * DA QUI UNA SCELTA DIVERSA DEI CONTENUTI. Gli altri corsi si chiedono che
 * cosa potrebbe uscire all'esame. Questo si chiede che cosa vale la pena
 * sapere per capire l'Italia: storia, ordinamento, territorio, feste, vita
 * di tutti i giorni, cultura. Ampiezza invece che densità d'esame.
 *
 * CINQUE CAPITOLI, e i primi due portano i titoli che la Costituzione dà a
 * sé stessa:
 *   1. Simboli e principi fondamentali
 *   2. L'ordinamento della Repubblica
 *   3. Storia d'Italia
 *   4. Territorio, economia e l'Italia nel mondo
 *   5. Società e vita quotidiana
 *
 * LE FONTI sono pubbliche: la Costituzione della Repubblica Italiana, i siti
 * di Camera, Senato e Quirinale, normattiva.it, i portali del Ministero
 * dell'interno e di integrazionemigranti.gov.it, l'ISTAT e le indicazioni
 * nazionali per l'insegnamento dell'educazione civica. Si riprendono i fatti
 * — date, istituzioni, cifre. Le formulazioni, le domande e le spiegazioni
 * sono scritte qui; nessun catalogo viene ricopiato.
 */
export const vivereInItaliaCourse: Course = {
  id: "vivere-in-italia",
  kind: "citizenship",
  name: "Italy – Land and Culture",
  tagline: "Storia, ordinamento e vita quotidiana — come funziona il paese.",
  icon: "🇮🇹",
  available: true,
  lessons: [
    // ══ Capitolo 1: Simboli e principi fondamentali ═══════════════════════
    {
      id: "it-simboli",
      title: "Simboli nazionali",
      section: "Simboli e principi fondamentali",
      badge: "lezione 1",
      blocks: [
        { type: "callout", variant: "why", text: "Perché si comincia da qui: i simboli si incontrano tutti i giorni — sul municipio, sul passaporto, sulla maglia della nazionale — e sono quindi la porta più facile per entrare in tutto il resto." },
        { type: "h3", text: "La bandiera" },
        { type: "p", text: "Il **tricolore** ha tre bande verticali di uguali dimensioni: **verde** dalla parte dell'asta, **bianco** al centro, **rosso** al battente. Lo descrive l'**articolo 12** della Costituzione, l'ultimo dei principi fondamentali — il che dice già qualcosa: la bandiera non è un dettaglio decorativo, sta fra le cose che fondano la Repubblica." },
        { type: "p", text: "Nacque a **Reggio Emilia il 7 gennaio 1797**, quando la Repubblica Cispadana lo adottò come proprio vessillo. È la bandiera nazionale più antica d'Europa dopo quelle di Danimarca e Paesi Bassi, e il 7 gennaio si celebra la **Festa del Tricolore**." },
        { type: "p", text: "Ai colori non è assegnato per legge alcun significato. Le spiegazioni che si sentono — il verde delle pianure, il bianco delle nevi alpine, il rosso del sangue versato — sono letture affettive nate dopo, non una regola scritta da qualche parte." },
        { type: "h3", text: "L'emblema" },
        { type: "p", text: "L'Italia non ha uno stemma di famiglia regnante: ha un **emblema**, scelto per concorso pubblico e in vigore dal **5 maggio 1948**. Lo disegnò Paolo Paschetto. Non è uno scudo, ed è la differenza che conta: non discende da una dinastia, è stato inventato da una repubblica appena nata per rappresentarsi." },
        { type: "cards", items: [
          { h4: "La stella", p: "La stella d'Italia, il simbolo più antico del paese: accompagna l'immagine dell'Italia da prima dell'Unità." },
          { h4: "La ruota dentata", p: "L'ingranaggio richiama il lavoro, su cui l'articolo 1 fonda la Repubblica." },
          { h4: "L'olivo e la quercia", p: "L'olivo per la pace, la quercia per la forza e la dignità. Sono due alberi che crescono in tutta la penisola." },
        ] },
        { type: "quiz",
          q: "Da quale parte della bandiera si trova il verde?",
          options: [
            { text: "Al centro", correct: false },
            { text: "Dalla parte dell'asta", correct: true },
            { text: "Dalla parte del battente", correct: false },
            { text: "Cambia a seconda della regione", correct: false },
          ],
          explanation: "Verde all'asta, bianco al centro, rosso al battente. L'ordine non è libero: è fissato dall'articolo 12 della Costituzione, e una bandiera con i colori invertiti è semplicemente sbagliata.",
        },
        { type: "h3", text: "L'inno" },
        { type: "p", text: "L'inno nazionale si chiama ufficialmente **Il Canto degli Italiani**, ma tutti lo conoscono come **Inno di Mameli** oppure dal suo primo verso, **Fratelli d'Italia**. Il testo è di **Goffredo Mameli**, che lo scrisse nel **1847** a vent'anni; la musica è di **Michele Novaro**. Mameli morì due anni dopo, a ventun anni, difendendo la Repubblica Romana." },
        { type: "p", text: "Curiosamente l'inno è stato per settant'anni un inno di fatto: adottato in via provvisoria nel **1946**, è diventato inno ufficiale per legge soltanto il **4 dicembre 2017**. In Italia le cose provvisorie durano." },
        { type: "quiz",
          q: "Chi scrisse il testo dell'inno nazionale?",
          options: [
            { text: "Michele Novaro", correct: false },
            { text: "Giuseppe Verdi", correct: false },
            { text: "Goffredo Mameli", correct: true },
            { text: "Giuseppe Mazzini", correct: false },
          ],
          explanation: "Il testo è di Goffredo Mameli, la musica di Michele Novaro: per questo si dice Inno di Mameli e non Inno di Novaro. Verdi non c'entra, anche se il coro del Nabucco viene spesso proposto come alternativa.",
        },
        { type: "h3", text: "Le date della Repubblica" },
        { type: "cards", items: [
          { h4: "2 giugno", p: "Festa della Repubblica. Ricorda il referendum del 2 e 3 giugno 1946, con cui gli italiani scelsero la repubblica al posto della monarchia." },
          { h4: "25 aprile", p: "Anniversario della Liberazione, la fine dell'occupazione nazifascista nel 1945." },
          { h4: "4 novembre", p: "Giorno dell'Unità nazionale e Festa delle Forze armate: l'armistizio del 1918. Non è più giorno festivo dal 1977 e si celebra la prima domenica di novembre." },
        ] },
        { type: "p", text: "Il **2 giugno** è la festa nazionale vera e propria. A Roma si svolgono la deposizione della corona all'Altare della Patria e la parata lungo via dei Fori Imperiali, con il sorvolo delle Frecce Tricolori che lasciano nel cielo le tre bande." },
        { type: "quiz",
          q: "Che cosa si ricorda il 2 giugno?",
          options: [
            { text: "La proclamazione del Regno d'Italia nel 1861", correct: false },
            { text: "Il referendum del 1946 e la nascita della Repubblica", correct: true },
            { text: "L'entrata in vigore della Costituzione", correct: false },
            { text: "La fine della Seconda guerra mondiale", correct: false },
          ],
          explanation: "Il 2 giugno 1946 gli italiani votarono per la repubblica contro la monarchia, e nello stesso giorno elessero l'Assemblea costituente. Il Regno era stato proclamato l'11 marzo 1861, la Costituzione entrò in vigore il 1º gennaio 1948: tre date diverse che è facile confondere.",
        },
        { type: "callout", variant: "warn", text: "Da non confondere: il **7 gennaio** è la Festa del Tricolore, cioè della bandiera; il **2 giugno** è la Festa della Repubblica. Solo la seconda è giorno festivo." },
      ],
    },
    {
      id: "it-costituzione",
      title: "La Costituzione e i principi fondamentali",
      section: "Simboli e principi fondamentali",
      badge: "lezione 2",
      blocks: [
        { type: "callout", variant: "why", text: "Perché conta: quasi tutto quello che verrà dopo — il Parlamento, le regioni, i diritti, perfino la bandiera — è scritto in un unico testo del 1947. Chi lo conosce a grandi linee ha già la mappa del resto del corso." },
        { type: "h3", text: "Come è nata" },
        { type: "p", text: "Il **2 giugno 1946**, nello stesso giorno del referendum, gli italiani elessero l'**Assemblea costituente**. Fu la prima consultazione a suffragio davvero universale della storia italiana: **votarono per la prima volta le donne**. L'Assemblea lavorò un anno e mezzo e approvò il testo il **22 dicembre 1947**." },
        { type: "p", text: "La Costituzione fu promulgata il **27 dicembre 1947** dal capo provvisorio dello Stato **Enrico De Nicola** ed entrò in vigore il **1º gennaio 1948**. Fu scritta da un'assemblea in cui sedevano insieme democratici cristiani, comunisti, socialisti, liberali e azionisti: è un testo di compromesso, e si vede." },
        { type: "quiz",
          q: "Quando è entrata in vigore la Costituzione?",
          options: [
            { text: "Il 2 giugno 1946", correct: false },
            { text: "Il 22 dicembre 1947", correct: false },
            { text: "Il 1º gennaio 1948", correct: true },
            { text: "Il 25 aprile 1945", correct: false },
          ],
          explanation: "Approvata il 22 dicembre 1947, promulgata il 27 dicembre, entrata in vigore il 1º gennaio 1948. Le tre date sono vicine ma distinte: approvazione, firma, efficacia.",
        },
        { type: "h3", text: "Come è fatta" },
        { type: "p", text: "Il testo ha **139 articoli** più diciotto disposizioni transitorie e finali, ed è diviso in tre parti disuguali." },
        { type: "cards", items: [
          { h4: "Principi fondamentali", p: "Articoli 1–12. Dodici articoli che dicono che cosa è la Repubblica prima di dire come funziona." },
          { h4: "Parte I · Diritti e doveri dei cittadini", p: "Articoli 13–54. Le libertà, la famiglia, la salute, la scuola, il lavoro, il voto, le tasse." },
          { h4: "Parte II · Ordinamento della Repubblica", p: "Articoli 55–139. Parlamento, Governo, Presidente, magistratura, regioni. È il capitolo 2 di questo corso." },
        ] },
        { type: "h3", text: "I primi articoli" },
        { type: "p", text: "L'**articolo 1** stabilisce che l'Italia è una Repubblica democratica **fondata sul lavoro** e che la sovranità appartiene al popolo, che la esercita nelle forme e nei limiti della Costituzione. Quella formula sul lavoro fu il compromesso trovato fra chi voleva una repubblica dei lavoratori e chi voleva una formula più generale." },
        { type: "p", text: "L'**articolo 3** enuncia due uguaglianze, non una. La prima è **formale**: tutti sono uguali davanti alla legge senza distinzione di sesso, razza, lingua, religione, opinioni politiche, condizioni personali e sociali. La seconda è **sostanziale**: è compito della Repubblica rimuovere gli ostacoli che di fatto impediscono quell'uguaglianza. Il secondo comma è quello che giustifica le politiche sociali." },
        { type: "p", text: "L'**articolo 11** contiene il verbo più discusso del testo: l'Italia **ripudia** la guerra come strumento di offesa alla libertà degli altri popoli e come mezzo di risoluzione delle controversie internazionali. Lo stesso articolo consente le limitazioni di sovranità necessarie a un ordinamento che assicuri la pace: su questa frase poggia l'adesione italiana all'Unione europea." },
        { type: "quiz",
          q: "Quanti sono gli articoli dei principi fondamentali?",
          options: [
            { text: "Sette", correct: false },
            { text: "Dodici", correct: true },
            { text: "Ventuno", correct: false },
            { text: "Centotrentanove", correct: false },
          ],
          explanation: "I principi fondamentali sono gli articoli da 1 a 12, prima ancora della Parte I. Centotrentanove è il totale degli articoli della Costituzione.",
        },
        { type: "h3", text: "Una costituzione rigida" },
        { type: "p", text: "La Costituzione non si cambia con una legge ordinaria. L'**articolo 138** impone una procedura aggravata: ciascuna Camera deve approvare due volte, a distanza di almeno tre mesi, e nella seconda votazione serve la maggioranza assoluta. Se non si raggiungono i due terzi, cinquecentomila elettori, cinque consigli regionali o un quinto dei parlamentari possono chiedere un **referendum confermativo**." },
        { type: "p", text: "L'**articolo 139** mette un limite ancora più netto: la **forma repubblicana non può essere oggetto di revisione costituzionale**. Non esiste procedura, per quanto aggravata, che possa riportare la monarchia." },
        { type: "quiz",
          q: "Che cosa non può essere modificato in nessun modo?",
          options: [
            { text: "Il numero dei parlamentari", correct: false },
            { text: "La forma repubblicana", correct: true },
            { text: "La bandiera", correct: false },
            { text: "La durata del mandato presidenziale", correct: false },
          ],
          explanation: "L'articolo 139 sottrae la forma repubblicana a qualsiasi revisione. Tutto il resto — parlamentari, mandato, perfino l'articolo 12 sulla bandiera — è modificabile con la procedura dell'articolo 138.",
        },
        { type: "callout", variant: "warn", text: "Il referendum dell'articolo 138 è **confermativo** e non ha quorum: vale qualunque sia l'affluenza. È cosa diversa dal referendum **abrogativo** dell'articolo 75, che invece è valido solo se vota la maggioranza degli aventi diritto." },
      ],
    },
    {
      id: "it-diritti-doveri",
      title: "Diritti e doveri dei cittadini",
      section: "Simboli e principi fondamentali",
      badge: "lezione 3",
      blocks: [
        { type: "callout", variant: "why", text: "Perché conta: la Parte I non elenca soltanto quello che si può fare. Elenca anche quattro doveri, e sono quelli che trasformano un abitante in un cittadino." },
        { type: "h3", text: "Quattro gruppi di rapporti" },
        { type: "p", text: "La Parte I va dall'articolo 13 al 54 ed è divisa in quattro titoli, ognuno dei quali guarda la persona da un lato diverso: **rapporti civili**, **etico-sociali**, **economici** e **politici**." },
        { type: "cards", items: [
          { h4: "Civili · 13–28", p: "Libertà personale, domicilio, corrispondenza, circolazione, riunione, associazione, religione, pensiero, difesa in giudizio." },
          { h4: "Etico-sociali · 29–34", p: "Famiglia, salute, scuola. Qui stanno il diritto alle cure e l'istruzione obbligatoria." },
          { h4: "Economici · 35–47", p: "Lavoro, retribuzione, sindacati, sciopero, impresa, proprietà, risparmio." },
          { h4: "Politici · 48–54", p: "Voto, partiti, petizioni, accesso agli uffici pubblici, difesa della patria, tributi, fedeltà alla Repubblica." },
        ] },
        { type: "h3", text: "Le libertà" },
        { type: "p", text: "L'**articolo 13** dichiara inviolabile la libertà personale: nessuna detenzione o perquisizione se non per atto motivato dell'autorità giudiziaria. Se in casi eccezionali interviene la polizia, deve avvisare il giudice entro quarantotto ore, e il giudice ha altre quarantotto ore per convalidare. Passate le novantasei ore senza convalida, il provvedimento perde ogni effetto." },
        { type: "p", text: "L'**articolo 21** garantisce a tutti il diritto di manifestare liberamente il proprio pensiero con la parola, lo scritto e ogni altro mezzo di diffusione. La stampa non può essere soggetta ad autorizzazioni o censure: è una frase scritta da chi aveva appena vissuto vent'anni di giornali autorizzati." },
        { type: "quiz",
          q: "Entro quanto tempo l'autorità giudiziaria deve essere avvisata di un fermo di polizia?",
          options: [
            { text: "Entro ventiquattro ore", correct: false },
            { text: "Entro quarantotto ore", correct: true },
            { text: "Entro una settimana", correct: false },
            { text: "Non è previsto alcun termine", correct: false },
          ],
          explanation: "Quarantotto ore per l'avviso al giudice e altre quarantotto per la convalida. Se il termine passa senza convalida, il provvedimento è revocato e resta privo di effetto: il tempo qui non è una formalità, è la garanzia.",
        },
        { type: "h3", text: "La pena e il processo" },
        { type: "p", text: "L'**articolo 27** contiene tre regole che stanno insieme: la responsabilità penale è **personale**, l'imputato **non è considerato colpevole** fino alla condanna definitiva, e le pene devono tendere alla **rieducazione** del condannato. Lo stesso articolo chiude con quattro parole: non è ammessa la pena di morte." },
        { type: "p", text: "L'**articolo 24** garantisce a tutti il diritto di agire in giudizio e la difesa in ogni stato del procedimento; ai non abbienti lo Stato assicura i mezzi per agire e difendersi, ed è da qui che nasce il **patrocinio a spese dello Stato**." },
        { type: "h3", text: "I doveri" },
        { type: "p", text: "Il **voto** (articolo 48) è definito insieme diritto e **dovere civico**: non è sanzionato, ma la Costituzione lo chiama con quel nome di proposito. L'**articolo 52** definisce la difesa della patria un sacro dovere. L'**articolo 54** chiede a tutti fedeltà alla Repubblica e, a chi ricopre funzioni pubbliche, di adempierle con disciplina e onore." },
        { type: "p", text: "L'**articolo 53** è il dovere che si incontra ogni anno: tutti concorrono alle spese pubbliche **in ragione della propria capacità contributiva**, e il sistema tributario è informato a criteri di **progressività**. Chi guadagna di più non paga solo di più: paga una quota maggiore. È il principio su cui poggiano gli scaglioni dell'IRPEF." },
        { type: "quiz",
          q: "Che cosa significa che il sistema tributario è progressivo?",
          options: [
            { text: "Che le tasse aumentano ogni anno", correct: false },
            { text: "Che chi ha un reddito più alto paga una quota proporzionalmente maggiore", correct: true },
            { text: "Che tutti pagano la stessa percentuale", correct: false },
            { text: "Che si paga a rate", correct: false },
          ],
          explanation: "Progressività significa che l'aliquota cresce con il reddito, non solo l'importo. Una tassa uguale in percentuale per tutti sarebbe proporzionale, non progressiva: l'articolo 53 chiede espressamente la seconda.",
        },
        { type: "quiz",
          q: "Come definisce il voto la Costituzione?",
          options: [
            { text: "Solo un diritto", correct: false },
            { text: "Un diritto e un dovere civico", correct: true },
            { text: "Un obbligo sanzionabile con una multa", correct: false },
            { text: "Una facoltà riservata a chi paga le tasse", correct: false },
          ],
          explanation: "L'articolo 48 usa entrambe le parole: il voto è un diritto e il suo esercizio è un dovere civico. Dovere civico però non vuol dire obbligo sanzionato — chi non vota non paga nulla.",
        },
        { type: "callout", variant: "warn", text: "Molte di queste garanzie valgono per **tutti**, non solo per i cittadini: l'articolo 13 dice nessuno, l'articolo 21 dice tutti. I diritti riservati ai cittadini sono soprattutto quelli politici — il voto, l'accesso ai pubblici uffici." },
      ],
    },
    {
      id: "it-lingue",
      title: "La lingua italiana e le minoranze linguistiche",
      section: "Simboli e principi fondamentali",
      badge: "lezione 4",
      blocks: [
        { type: "callout", variant: "why", text: "Perché conta: l'Italia è unita da centosessant'anni, ma la sua unità linguistica è molto più recente — ed è ancora incompleta, per legge e di proposito." },
        { type: "h3", text: "Una lingua giovane" },
        { type: "p", text: "L'italiano standard non nasce da un parlato ma da una **lingua scritta**: il fiorentino letterario del Trecento di **Dante, Petrarca e Boccaccio**, scelto nel Cinquecento come modello per tutta la penisola. Per secoli è stata la lingua della scrittura mentre si parlava altro." },
        { type: "p", text: "Alla proclamazione del Regno, nel 1861, chi sapeva usare l'italiano era una piccola minoranza: la stima più citata, quella del linguista **Tullio De Mauro**, parla di poco più del due per cento della popolazione, e altri studiosi arrivano a percentuali più alte, comunque lontane dalla maggioranza. A unificare la lingua sono stati la scuola dell'obbligo, la leva militare, l'emigrazione interna e — negli anni Cinquanta e Sessanta — la televisione." },
        { type: "p", text: "L'**Accademia della Crusca**, fondata a Firenze nel **1583**, è la più antica accademia linguistica del mondo ancora attiva. Il suo nome viene dall'immagine della farina separata dalla crusca: separare le parole buone dalle altre." },
        { type: "quiz",
          q: "Da quale parlata deriva l'italiano standard?",
          options: [
            { text: "Dal romano dell'epoca imperiale", correct: false },
            { text: "Dal fiorentino letterario del Trecento", correct: true },
            { text: "Dal milanese dell'Ottocento", correct: false },
            { text: "Dal napoletano del Seicento", correct: false },
          ],
          explanation: "Il modello è il fiorentino di Dante, Petrarca e Boccaccio, adottato come lingua scritta comune nel Cinquecento. Il latino è l'antenato di tutte le parlate italiane, non il modello dell'italiano moderno.",
        },
        { type: "h3", text: "Dialetti o lingue?" },
        { type: "p", text: "Quelli che in Italia si chiamano **dialetti** in genere non sono varianti dell'italiano: sono lingue romanze sorelle, discese dal latino per conto proprio. Il napoletano, il siciliano, il veneto o il piemontese non derivano dall'italiano più di quanto lo spagnolo derivi dal francese." },
        { type: "p", text: "Il dialetto non è scomparso. Secondo le rilevazioni ISTAT una quota consistente della popolazione lo usa ancora, soprattutto in famiglia e fra amici, spesso alternandolo all'italiano nella stessa conversazione." },
        { type: "h3", text: "Le minoranze riconosciute" },
        { type: "p", text: "L'**articolo 6** della Costituzione impegna la Repubblica a tutelare con apposite norme le minoranze linguistiche. La **legge 482 del 1999** ha dato attuazione a quell'articolo dopo cinquant'anni, riconoscendo **dodici** minoranze storiche." },
        { type: "cards", items: [
          { h4: "Le dodici", p: "Albanesi, catalane, germaniche, greche, slovene, croate, e le popolazioni parlanti francese, franco-provenzale, friulano, ladino, occitano e sardo." },
          { h4: "Alto Adige · Südtirol", p: "Il tedesco è equiparato all'italiano: atti bilingui, scuole separate per gruppo linguistico, e la proporzionale etnica per i posti pubblici." },
          { h4: "Valle d'Aosta", p: "Il francese è equiparato all'italiano fin dallo statuto speciale del 1948; nelle valli walser si parlano anche varietà germaniche." },
          { h4: "Friuli Venezia Giulia", p: "Tutela dello sloveno nelle province di Trieste, Gorizia e Udine, e del friulano, parlato da alcune centinaia di migliaia di persone." },
        ] },
        { type: "quiz",
          q: "Quale legge dà attuazione all'articolo 6 sulle minoranze linguistiche?",
          options: [
            { text: "La legge 482 del 1999", correct: true },
            { text: "La legge 194 del 1978", correct: false },
            { text: "La legge 300 del 1970", correct: false },
            { text: "La legge 91 del 1992", correct: false },
          ],
          explanation: "La legge 15 dicembre 1999, n. 482, riconosce dodici minoranze linguistiche storiche. La 300 del 1970 è lo Statuto dei lavoratori e la 91 del 1992 riguarda la cittadinanza: numeri facili da scambiare.",
        },
        { type: "quiz",
          q: "In quale regione il francese è equiparato all'italiano?",
          options: [
            { text: "In Piemonte", correct: false },
            { text: "In Liguria", correct: false },
            { text: "In Valle d'Aosta", correct: true },
            { text: "In Trentino-Alto Adige", correct: false },
          ],
          explanation: "La Valle d'Aosta è bilingue italiano-francese per statuto speciale. In Trentino-Alto Adige la seconda lingua è il tedesco, e in Piemonte si parlano occitano e franco-provenzale, tutelati ma non equiparati.",
        },
        { type: "callout", variant: "warn", text: "L'italiano non è dichiarato lingua ufficiale nei principi fondamentali della Costituzione. Lo si ricava dallo statuto del Trentino-Alto Adige e dalla legge 482, che lo chiama lingua ufficiale della Repubblica: una di quelle cose che sembrano ovvie e non sono scritte dove ci si aspetta." },
      ],
    },
    {
      id: "it-feste",
      title: "Feste civili e religiose",
      section: "Simboli e principi fondamentali",
      badge: "lezione 5",
      blocks: [
        { type: "callout", variant: "why", text: "Perché conta: il calendario racconta un paese meglio di molti manuali. In Italia le feste nazionali sono dodici, e una tredicesima cambia da città a città." },
        { type: "h3", text: "I giorni festivi" },
        { type: "p", text: "Sono festivi per legge dodici giorni all'anno, più il patrono locale. Quattro sono civili, gli altri religiosi — l'equilibrio di un paese che è stato a lungo cattolico e ha scritto una costituzione laica." },
        { type: "cards", items: [
          { h4: "Feste civili", p: "25 aprile, Liberazione · 1º maggio, festa dei lavoratori · 2 giugno, Repubblica. La quarta è il 1º gennaio, che è civile ma senza contenuto politico." },
          { h4: "Feste religiose fisse", p: "6 gennaio Epifania · 15 agosto Assunzione · 1º novembre Ognissanti · 8 dicembre Immacolata · 25 dicembre Natale · 26 dicembre Santo Stefano." },
          { h4: "Feste mobili", p: "La Pasqua e il Lunedì dell'Angelo, che tutti chiamano Pasquetta. La data dipende dal primo plenilunio di primavera." },
          { h4: "Il patrono", p: "Ogni comune ha il suo giorno festivo: sant'Ambrogio a Milano il 7 dicembre, san Gennaro a Napoli il 19 settembre, santi Pietro e Paolo a Roma il 29 giugno." },
        ] },
        { type: "quiz",
          q: "Quale di queste è una festa civile e non religiosa?",
          options: [
            { text: "L'Epifania", correct: false },
            { text: "Il 25 aprile", correct: true },
            { text: "Il 15 agosto", correct: false },
            { text: "L'8 dicembre", correct: false },
          ],
          explanation: "Il 25 aprile è l'anniversario della Liberazione, una data storica. Epifania, Assunzione e Immacolata sono ricorrenze religiose entrate nel calendario civile.",
        },
        { type: "h3", text: "Ferragosto" },
        { type: "p", text: "Il **15 agosto** la Chiesa celebra l'Assunzione, ma il nome della festa è più antico: **Ferragosto** viene dalle *feriae Augusti*, il riposo istituito dall'imperatore **Augusto nel 18 avanti Cristo** alla fine dei lavori agricoli. È la festa in cui l'Italia si ferma davvero: nelle settimane intorno chiudono uffici, negozi e interi quartieri delle città." },
        { type: "h3", text: "I giorni della memoria" },
        { type: "p", text: "Alcune ricorrenze non sono festive ma sono istituite per legge, e nelle scuole si osservano." },
        { type: "cards", items: [
          { h4: "27 gennaio", p: "Giorno della Memoria, per le vittime della Shoah, delle leggi razziali e della deportazione. È la data della liberazione di Auschwitz." },
          { h4: "10 febbraio", p: "Giorno del Ricordo, per le vittime delle foibe e per l'esodo giuliano-dalmata." },
          { h4: "9 maggio", p: "Giorno della memoria delle vittime del terrorismo, nell'anniversario del ritrovamento del corpo di Aldo Moro nel 1978." },
        ] },
        { type: "quiz",
          q: "Da dove viene il nome Ferragosto?",
          options: [
            { text: "Dal ferro battuto nelle fiere estive", correct: false },
            { text: "Dalle feriae Augusti, il riposo istituito dall'imperatore Augusto", correct: true },
            { text: "Dall'Assunzione di Maria", correct: false },
            { text: "Dalla fiera del bestiame di agosto", correct: false },
          ],
          explanation: "Il nome viene dalle feriae Augusti del 18 avanti Cristo, quindi da una festa romana precedente di secoli alla ricorrenza cristiana che poi si è sovrapposta alla stessa data.",
        },
        { type: "h3", text: "Le feste che non sono nel calendario" },
        { type: "p", text: "Accanto alle date ufficiali ci sono ricorrenze che scandiscono l'anno senza essere festive: il **Carnevale**, che a Venezia e a Viareggio dura settimane; la **Befana** del 6 gennaio, che porta i doni ai bambini e riempie le calze di carbone di zucchero; il **palio** o la **sagra** di paese, che in molti comuni è l'evento più partecipato dell'anno." },
        { type: "quiz",
          q: "Che cosa si ricorda il 27 gennaio?",
          options: [
            { text: "L'esodo giuliano-dalmata", correct: false },
            { text: "Le vittime della Shoah", correct: true },
            { text: "Le vittime del terrorismo", correct: false },
            { text: "La fine della Prima guerra mondiale", correct: false },
          ],
          explanation: "Il Giorno della Memoria cade il 27 gennaio, anniversario della liberazione di Auschwitz. Il Giorno del Ricordo, dedicato alle foibe e all'esodo, è il 10 febbraio: due date vicine e distinte.",
        },
        { type: "callout", variant: "warn", text: "Il patrono è giorno festivo **solo nel proprio comune**. Un ufficio milanese chiude il 7 dicembre; lo stesso giorno a Roma si lavora normalmente." },
      ],
    },
  ],
};
