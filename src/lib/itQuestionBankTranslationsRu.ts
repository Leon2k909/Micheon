/**
 * Russian for the Vivere in Italia practice questions.
 *
 * The lesson cards are answered by VIVERE_IN_ITALIA_RU. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in Russian and then asked its
 * questions in Italian.
 *
 * Keyed on the ITALIAN source text exactly as it appears in itQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an e for
 * an è or a straight apostrophe for a typographic one, and the lookup misses
 * in silence. The question renders in Italian, the tap works, and nothing
 * anywhere reports it.
 *
 * WHAT STAYS ITALIAN follows VIVERE_IN_ITALIA_RU exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The line runs where Russian itself
 * draws it:
 *
 *   - an institution Russian has a name for gets that name — Конституция,
 *     Палата депутатов, Сенат, Конституционный суд, области, коммуны;
 *   - the words a reader will only ever meet printed on a form, a card or a
 *     doorplate lead in Italian — codice fiscale, carta d'identità, tessera
 *     sanitaria, permesso di soggiorno, questura, anagrafe, INPS, INAIL,
 *     IRPEF, CCNL, Ferragosto;
 *   - a dish, a hymn or a painting keeps its Italian name, with the meaning
 *     beside it where a reader needs to know what the words say. The primo
 *     and the secondo are two courses, not two adjectives, and calling them
 *     anything else would lose the question.
 *
 * Sixty-seven of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that VIVERE_IN_ITALIA_RU or
 * another Russian table already answers. Every Russian table is spread into
 * one object, so a key present in two of them would lose one silently — the
 * later spread would decide both. check-ru-bank-translation measures coverage
 * through translateCourseText, the lookup a reader's tap actually goes
 * through, so those count as answered and are not duplicated here.
 */
export const IT_QUESTION_BANK_RU: Record<string, string> = {
  "Quale articolo della Costituzione descrive la bandiera?":
    "Какая статья Конституции описывает флаг?",
  "L'articolo 1": "Статья 1",
  "L'articolo 6": "Статья 6",
  "L'articolo 11": "Статья 11",
  "L'articolo 12": "Статья 12",
  "L'articolo 12 chiude i principi fondamentali e descrive il tricolore a tre bande verticali di uguali dimensioni.":
    "Статья 12 завершает основные принципы и описывает триколор из трёх вертикальных полос равного размера.",
  "Come si chiama ufficialmente l'inno nazionale?":
    "Как официально называется государственный гимн?",
  "Fratelli d'Italia": "«Fratelli d'Italia» — «Братья Италии»",
  "Il Canto degli Italiani": "«Il Canto degli Italiani» — «Песнь итальянцев»",
  "Inno di Mameli": "«Inno di Mameli» — «Гимн Мамели»",
  "Va' pensiero": "«Va' pensiero» — «Лети, мысль»",
  "Il titolo ufficiale è Il Canto degli Italiani. Fratelli d'Italia è il primo verso e Inno di Mameli il nome corrente: entrambi indicano lo stesso brano, ma non sono il titolo.":
    "Официальное название — Il Canto degli Italiani. Fratelli d'Italia — это первая строка, а Inno di Mameli — расхожее имя: и то и другое указывает на ту же вещь, но названием не является.",
  "In quale città nacque il tricolore nel 1797?": "В каком городе родился триколор в 1797 году?",
  "Reggio Emilia": "Реджо-Эмилия",
  "Bologna": "Болонья",
  "Il 7 gennaio 1797 la Repubblica Cispadana adottò il tricolore a Reggio Emilia. Per questo il 7 gennaio è la Festa del Tricolore.":
    "7 января 1797 года Циспаданская республика приняла триколор в Реджо-Эмилии. Поэтому 7 января — праздник триколора.",
  "Chi compose la musica dell'inno nazionale?": "Кто написал музыку государственного гимна?",
  "Gioachino Rossini": "Джоаккино Россини",
  "La musica è di Michele Novaro, il testo di Goffredo Mameli. Il nome corrente ricorda solo l'autore delle parole.":
    "Музыка Микеле Новаро, текст Гоффредо Мамели. Расхожее название помнит только автора слов.",
  "Da quando è in vigore l'emblema della Repubblica?":
    "С какого времени действует эмблема Республики?",
  "Dal 1861": "С 1861 года",
  "Dal 1946": "С 1946 года",
  "Dal 1948": "С 1948 года",
  "Dal 2017": "С 2017 года",
  "L'emblema, scelto per concorso pubblico, è in vigore dal 5 maggio 1948, pochi mesi dopo l'entrata in vigore della Costituzione.":
    "Эмблема, выбранная на открытом конкурсе, действует с 5 мая 1948 года, через несколько месяцев после вступления Конституции в силу.",
  "Quale ramo dell'emblema rappresenta la pace?": "Какая ветвь на эмблеме означает мир?",
  "Il ramo di quercia": "Дубовая ветвь",
  "Il ramo di olivo": "Оливковая ветвь",
  "Il ramo di alloro": "Лавровая ветвь",
  "Il ramo di palma": "Пальмовая ветвь",
  "L'olivo sta per la pace, la quercia per la forza e la dignità. Sono due alberi diffusi in tutta la penisola.":
    "Олива означает мир, дуб — силу и достоинство. Оба дерева растут по всему полуострову.",
  "Che cosa richiama la ruota dentata dell'emblema?":
    "На что указывает зубчатое колесо на эмблеме?",
  "L'industria automobilistica": "На автомобильную промышленность",
  "Il lavoro": "На труд",
  "La navigazione": "На мореходство",
  "Il tempo": "На время",
  "L'ingranaggio richiama il lavoro, su cui l'articolo 1 fonda la Repubblica: l'emblema cita la Costituzione.":
    "Шестерня указывает на труд, на котором статья 1 основывает Республику: эмблема цитирует Конституцию.",
  "In che anno Il Canto degli Italiani è diventato inno ufficiale per legge?":
    "В каком году Il Canto degli Italiani стал официальным гимном по закону?",
  "Nel 1977": "В 1977 году",
  "Nel 2017": "В 2017 году",
  "Adottato in via provvisoria nel 1946, è diventato inno ufficiale soltanto con la legge del 4 dicembre 2017: settant'anni da provvisorio.":
    "Принятый временно в 1946 году, официальным гимном он стал только законом от 4 декабря 2017 года: семьдесят лет во временном качестве.",
  "Che cosa si celebra il 7 gennaio?": "Что отмечают 7 января?",
  "La Festa della Repubblica": "Праздник Республики",
  "La Festa del Tricolore": "Праздник триколора",
  "L'Epifania civile": "Гражданское Богоявление",
  "La Giornata della Costituzione": "День Конституции",
  "Il 7 gennaio è la Festa del Tricolore, anniversario dell'adozione della bandiera nel 1797. Non è giorno festivo.":
    "7 января — праздник триколора, годовщина принятия флага в 1797 году. Нерабочим днём он не является.",
  "Quale evento ricorda il 4 novembre?": "О каком событии напоминает 4 ноября?",
  "L'armistizio del 1918 e l'unità nazionale": "О перемирии 1918 года и о национальном единстве",
  "La liberazione dal nazifascismo": "Об освобождении от нацифашизма",
  "L'entrata in guerra del 1940": "О вступлении в войну в 1940 году",
  "Il 4 novembre è il Giorno dell'Unità nazionale e Festa delle Forze armate, legato all'armistizio del 1918. La Liberazione è il 25 aprile e la Repubblica il 2 giugno.":
    "4 ноября — День национального единства и праздник вооружённых сил, связанный с перемирием 1918 года. Освобождение — это 25 апреля, а Республика — 2 июня.",
  "Come sono disposte le bande del tricolore?": "Как расположены полосы триколора?",
  "Orizzontali, di larghezza diversa": "Горизонтально, разной ширины",
  "Verticali, di uguali dimensioni": "Вертикально, одинакового размера",
  "Orizzontali, di uguali dimensioni": "Горизонтально, одинакового размера",
  "In diagonale": "По диагонали",
  "Tre bande verticali di uguali dimensioni. Le bande orizzontali sono quelle della bandiera ungherese, che ha gli stessi colori disposti diversamente.":
    "Три вертикальные полосы одинакового размера. Горизонтальные — это венгерский флаг, где те же цвета расположены иначе.",
  "Chi disegnò l'emblema della Repubblica?": "Кто нарисовал эмблему Республики?",
  "Paolo Paschetto": "Паоло Пашетто",
  "Giuseppe Terragni": "Джузеппе Терраньи",
  "Renato Guttuso": "Ренато Гуттузо",
  "Bruno Munari": "Бруно Мунари",
  "L'emblema fu disegnato da Paolo Paschetto, vincitore del concorso pubblico bandito dal governo nel 1946.":
    "Эмблему нарисовал Паоло Пашетто, победитель открытого конкурса, объявленного правительством в 1946 году.",
  "Perché l'Italia ha un emblema e non uno stemma?": "Почему у Италии эмблема, а не герб?",
  "Perché lo stemma è riservato alle monarchie e l'emblema non discende da una dinastia":
    "Потому что герб оставлен монархиям, а эмблема не происходит от династии",
  "Perché l'araldica è vietata dalla Costituzione": "Потому что геральдика запрещена Конституцией",
  "Perché uno stemma sarebbe troppo costoso da riprodurre":
    "Потому что герб было бы слишком дорого воспроизводить",
  "Perché lo stemma spetta solo alle regioni": "Потому что герб полагается только областям",
  "Uno stemma discende da una famiglia regnante; l'emblema fu inventato da una repubblica appena nata, scegliendolo per concorso pubblico. È una differenza di origine, non di forma.":
    "Герб происходит от правящей семьи; эмблему придумала только что родившаяся республика, выбрав её на открытом конкурсе. Разница в происхождении, а не в форме.",
  "Quanti articoli ha la Costituzione italiana?": "Сколько статей в итальянской Конституции?",
  "Cinquantacinque": "Пятьдесят пять",
  "Duecento": "Двести",
  "Centotrentanove articoli, più diciotto disposizioni transitorie e finali. Dodici sono i soli principi fondamentali.":
    "Сто тридцать девять статей плюс восемнадцать переходных и заключительных положений. Двенадцать — это только основные принципы.",
  "Chi promulgò la Costituzione nel dicembre 1947?":
    "Кто обнародовал Конституцию в декабре 1947 года?",
  "Alcide De Gasperi": "Альчиде Де Гаспери",
  "Enrico De Nicola": "Энрико Де Никола",
  "Luigi Einaudi": "Луиджи Эйнауди",
  "Umberto II": "Умберто II",
  "Enrico De Nicola, capo provvisorio dello Stato. Einaudi sarà il primo Presidente della Repubblica eletto dal Parlamento, nel 1948.":
    "Энрико Де Никола, временный глава государства. Эйнауди станет первым президентом Республики, избранным парламентом, в 1948 году.",
  "Quando fu eletta l'Assemblea costituente?": "Когда было избрано Учредительное собрание?",
  "Il 18 aprile 1948": "18 апреля 1948 года",
  "L'Assemblea fu eletta il 2 giugno 1946, lo stesso giorno del referendum istituzionale: una scheda per la forma dello Stato, una per i costituenti.":
    "Собрание избрали 2 июня 1946 года, в тот же день, что и институциональный референдум: один бюллетень о форме государства, другой — об учредителях.",
  "Che cosa rese storico il voto del 2 giugno 1946?":
    "Что сделало голосование 2 июня 1946 года историческим?",
  "Fu il primo voto a scrutinio segreto": "Это было первое тайное голосование",
  "Fu la prima volta che votarono le donne a livello nazionale":
    "Женщины впервые голосовали на общенациональном уровне",
  "Fu il primo voto con le schede stampate": "Это было первое голосование с печатными бюллетенями",
  "Fu il primo voto aperto ai diciottenni":
    "Это было первое голосование, открытое для восемнадцатилетних",
  "Fu la prima consultazione a suffragio davvero universale: le donne votarono per la prima volta a livello nazionale. Il voto ai diciottenni arriverà solo nel 1975.":
    "Это было первое голосование при по-настоящему всеобщем избирательном праве: женщины впервые голосовали на общенациональном уровне. Право голоса с восемнадцати лет придёт только в 1975 году.",
  "Su che cosa è fondata la Repubblica secondo l'articolo 1?":
    "На чём основана Республика по статье 1?",
  "Sulla famiglia": "На семье",
  "Sul lavoro": "На труде",
  "Sulla libertà": "На свободе",
  "Sulla proprietà": "На собственности",
  "Una repubblica democratica fondata sul lavoro: la formula fu il compromesso fra chi voleva una repubblica dei lavoratori e chi ne voleva una definizione più generale.":
    "Демократическая республика, основанная на труде: формулировка стала компромиссом между теми, кто хотел республику трудящихся, и теми, кто хотел определения пошире.",
  "Che cosa aggiunge il secondo comma dell'articolo 3?": "Что добавляет второй абзац статьи 3?",
  "L'uguaglianza davanti alla legge": "Равенство перед законом",
  "Il compito della Repubblica di rimuovere gli ostacoli di fatto all'uguaglianza":
    "Обязанность Республики устранять фактические препятствия равенству",
  "Il divieto di discriminazione religiosa": "Запрет религиозной дискриминации",
  "La parità fra uomo e donna nel lavoro": "Равенство мужчины и женщины в труде",
  "Il primo comma enuncia l'uguaglianza formale, il secondo quella sostanziale: non basta che la legge sia uguale, la Repubblica deve rimuovere gli ostacoli che la rendono ineffettiva. È il comma su cui poggiano le politiche sociali.":
    "Первый абзац провозглашает формальное равенство, второй — содержательное: мало того, что закон одинаков, Республика должна убрать препятствия, которые делают его недействующим. На этом абзаце держится социальная политика.",
  "Su quale articolo poggia l'adesione italiana all'Unione europea?":
    "На какой статье держится участие Италии в Европейском союзе?",
  "L'articolo 3": "Статья 3",
  "L'articolo 138": "Статья 138",
  "L'articolo 11 consente, in condizioni di parità con gli altri Stati, le limitazioni di sovranità necessarie a un ordinamento che assicuri pace e giustizia. Lo stesso articolo che ripudia la guerra apre all'Europa.":
    "Статья 11 допускает на условиях равенства с другими государствами ограничения суверенитета, необходимые для порядка, который обеспечивает мир и справедливость. Та же статья, что отвергает войну, открывает дорогу в Европу.",
  "Che cosa ripudia l'articolo 11?": "Что отвергает статья 11?",
  "La pena di morte": "Смертную казнь",
  "La censura": "Цензуру",
  "Il lavoro minorile": "Детский труд",
  "L'Italia ripudia la guerra come strumento di offesa alla libertà degli altri popoli e come mezzo di risoluzione delle controversie internazionali. La pena di morte è abolita dall'articolo 27.":
    "Италия отвергает войну как средство посягательства на свободу других народов и как способ разрешения международных споров. Смертная казнь отменена статьёй 27.",
  "Quale articolo disciplina la revisione della Costituzione?":
    "Какая статья регулирует пересмотр Конституции?",
  "L'articolo 75": "Статья 75",
  "L'articolo 101": "Статья 101",
  "L'articolo 139": "Статья 139",
  "L'articolo 138 detta la procedura aggravata; il 139 pone il limite invalicabile della forma repubblicana. Il 75 riguarda invece il referendum abrogativo.":
    "Статья 138 задаёт усложнённую процедуру; 139-я ставит непреодолимый предел — республиканскую форму. А 75-я касается отменяющего референдума.",
  "Quando può essere chiesto il referendum confermativo su una legge costituzionale?":
    "Когда можно потребовать подтверждающий референдум по конституционному закону?",
  "Sempre, dopo l'approvazione": "Всегда, после принятия",
  "Solo se nella seconda votazione non si raggiungono i due terzi":
    "Только если во втором голосовании не набрали две трети",
  "Solo se lo chiede il Presidente della Repubblica":
    "Только если этого потребует президент Республики",
  "Mai: le leggi costituzionali non sono referendabili":
    "Никогда: конституционные законы на референдум не выносят",
  "Se ciascuna Camera approva con almeno i due terzi, la legge è definitiva. Sotto quella soglia, cinquecentomila elettori, cinque consigli regionali o un quinto dei parlamentari possono chiedere il referendum.":
    "Если каждая палата примет закон не менее чем двумя третями, он окончателен. Ниже этого порога референдум могут потребовать пятьсот тысяч избирателей, пять областных советов или пятая часть парламентариев.",
  "Il referendum confermativo dell'articolo 138 è valido solo se vota la maggioranza degli aventi diritto?":
    "Действителен ли подтверждающий референдум по статье 138 только тогда, когда проголосовало большинство имеющих право?",
  "Sì, come tutti i referendum": "Да, как все референдумы",
  "No, non ha quorum di partecipazione": "Нет, кворума явки у него нет",
  "Sì, ma solo per le riforme della Parte II": "Да, но только для реформ Части II",
  "Dipende dal numero di firme raccolte": "Это зависит от числа собранных подписей",
  "Il confermativo non ha quorum: vale qualunque sia l'affluenza. Il quorum di metà più uno degli aventi diritto riguarda il referendum abrogativo dell'articolo 75.":
    "У подтверждающего кворума нет: он действителен при любой явке. Кворум в половину плюс один от имеющих право касается отменяющего референдума по статье 75.",
  "Quali articoli formano la Parte II, sull'ordinamento della Repubblica?":
    "Какие статьи образуют Часть II, об устройстве Республики?",
  "Dall'1 al 12": "С 1-й по 12-ю",
  "Dal 13 al 54": "С 13-й по 54-ю",
  "Dal 55 al 139": "С 55-й по 139-ю",
  "Dal 100 al 139": "С 100-й по 139-ю",
  "Principi fondamentali 1–12, Parte I sui diritti e doveri 13–54, Parte II sull'ordinamento 55–139.":
    "Основные принципы 1–12, Часть I о правах и обязанностях 13–54, Часть II об устройстве 55–139.",
  "Quando l'Assemblea costituente approvò il testo della Costituzione?":
    "Когда Учредительное собрание приняло текст Конституции?",
  "Approvazione il 22 dicembre 1947, promulgazione il 27 dicembre, entrata in vigore il 1º gennaio 1948. Il 18 aprile 1948 sono invece le prime elezioni politiche repubblicane.":
    "Принятие 22 декабря 1947 года, обнародование 27 декабря, вступление в силу 1 января 1948 года. А 18 апреля 1948 года — это первые республиканские парламентские выборы.",
  "Quali articoli formano la Parte I, sui diritti e doveri?":
    "Какие статьи образуют Часть I, о правах и обязанностях?",
  "Dal 55 al 96": "С 55-й по 96-ю",
  "Dal 101 al 139": "С 101-й по 139-ю",
  "La Parte I va dall'articolo 13 al 54 ed è divisa in quattro titoli: rapporti civili, etico-sociali, economici e politici.":
    "Часть I идёт со статьи 13 по 54 и делится на четыре раздела: гражданские, этико-социальные, экономические и политические отношения.",
  "In quanti titoli è divisa la Parte I della Costituzione?":
    "На сколько разделов делится Часть I Конституции?",
  "Due": "На два",
  "Quattro": "На четыре",
  "Sei": "На шесть",
  "Quattro: rapporti civili, rapporti etico-sociali, rapporti economici e rapporti politici. Ogni titolo guarda la persona da un lato diverso.":
    "На четыре: гражданские, этико-социальные, экономические и политические отношения. Каждый раздел смотрит на человека с другой стороны.",
  "Quale articolo esclude la pena di morte?": "Какая статья исключает смертную казнь?",
  "L'articolo 13": "Статья 13",
  "L'articolo 21": "Статья 21",
  "L'articolo 24": "Статья 24",
  "L'articolo 27": "Статья 27",
  "L'articolo 27 chiude affermando che non è ammessa la pena di morte, dopo aver stabilito la personalità della responsabilità penale e il fine rieducativo della pena.":
    "Статья 27 завершается тем, что смертная казнь не допускается, — после того как установила личный характер уголовной ответственности и воспитательную цель наказания.",
  "Quale principio NON è contenuto nell'articolo 27?": "Какой принцип НЕ содержится в статье 27?",
  "La responsabilità penale è personale": "Уголовная ответственность носит личный характер",
  "L'imputato non è considerato colpevole fino alla condanna definitiva":
    "Обвиняемый не считается виновным до окончательного приговора",
  "Le pene devono tendere alla rieducazione": "Наказания должны быть направлены на перевоспитание",
  "Nessuno può essere distolto dal giudice naturale":
    "Никого нельзя изъять из ведения его законного судьи",
  "Il giudice naturale è garantito dall'articolo 25. L'articolo 27 riunisce personalità della responsabilità, presunzione di non colpevolezza, fine rieducativo della pena e divieto della pena di morte.":
    "Законный судья гарантирован статьёй 25. Статья 27 сводит вместе личный характер ответственности, презумпцию невиновности, воспитательную цель наказания и запрет смертной казни.",
  "Che cosa garantisce l'articolo 21?": "Что гарантирует статья 21?",
  "La libertà di riunione": "Свободу собраний",
  "La libertà di manifestare il proprio pensiero": "Свободу выражать свои мысли",
  "La libertà di associazione": "Свободу объединений",
  "La libertà religiosa": "Свободу вероисповедания",
  "L'articolo 21 riguarda la manifestazione del pensiero con la parola, lo scritto e ogni mezzo di diffusione. Riunione è l'articolo 17, associazione il 18, religione il 19.":
    "Статья 21 касается выражения мысли словом, письмом и любым средством распространения. Собрания — это статья 17, объединения — 18-я, религия — 19-я.",
  "La stampa può essere sottoposta ad autorizzazioni o censure?":
    "Можно ли подчинить печать разрешениям или цензуре?",
  "Sì, in caso di emergenza nazionale": "Да, при чрезвычайном положении в стране",
  "No, l'articolo 21 lo esclude": "Нет, статья 21 это исключает",
  "Sì, se lo decide il Ministero dell'interno": "Да, если так решит министерство внутренних дел",
  "Solo per le pubblicazioni straniere": "Только для иностранных изданий",
  "L'articolo 21 esclude autorizzazioni e censure: è una frase scritta da chi aveva appena vissuto vent'anni di giornali autorizzati. Restano possibili i sequestri per atto motivato dell'autorità giudiziaria.":
    "Статья 21 исключает разрешения и цензуру: эту фразу писали люди, только что прожившие двадцать лет при разрешённых газетах. Возможным остаётся изъятие по мотивированному акту судебной власти.",
  "Quale articolo tutela la salute come diritto dell'individuo?":
    "Какая статья защищает здоровье как право человека?",
  "L'articolo 29": "Статья 29",
  "L'articolo 32": "Статья 32",
  "L'articolo 34": "Статья 34",
  "L'articolo 38": "Статья 38",
  "L'articolo 32 definisce la salute diritto dell'individuo e interesse della collettività, e garantisce cure gratuite agli indigenti. È la base del Servizio sanitario nazionale.":
    "Статья 32 называет здоровье правом человека и интересом общества и гарантирует бесплатное лечение неимущим. Это основа Национальной службы здравоохранения.",
  "Che cos'è il patrocinio a spese dello Stato?":
    "Что такое юридическая помощь за счёт государства?",
  "Un contributo per le spese processuali di chi non può permettersele":
    "Оплата судебных расходов тому, кому они не по средствам",
  "Un fondo per le vittime di reato": "Фонд для жертв преступлений",
  "Un'assicurazione obbligatoria per gli avvocati": "Обязательное страхование для адвокатов",
  "Un sussidio per i detenuti": "Пособие для заключённых",
  "Nasce dall'articolo 24, che impone allo Stato di assicurare ai non abbienti i mezzi per agire e difendersi davanti a ogni giurisdizione.":
    "Оно рождается из статьи 24, которая обязывает государство обеспечить неимущим средства для иска и защиты в любой инстанции.",
  "Quale articolo riconosce il diritto di sciopero?": "Какая статья признаёт право на забастовку?",
  "L'articolo 35": "Статья 35",
  "L'articolo 39": "Статья 39",
  "L'articolo 40": "Статья 40",
  "L'articolo 46": "Статья 46",
  "L'articolo 40 riconosce il diritto di sciopero, che si esercita nell'ambito delle leggi che lo regolano. L'articolo 39 riguarda invece la libertà sindacale.":
    "Статья 40 признаёт право на забастовку, которое осуществляется в рамках регулирующих его законов. А статья 39 касается свободы профсоюзов.",
  "Chi non vota alle elezioni politiche che conseguenza subisce?":
    "Что грозит тому, кто не голосует на парламентских выборах?",
  "Una sanzione amministrativa": "Административное взыскание",
  "Nessuna: il dovere civico non è sanzionato":
    "Ничего: гражданский долг не подкреплён наказанием",
  "La sospensione dei diritti politici": "Приостановка политических прав",
  "L'esclusione dai concorsi pubblici": "Отстранение от конкурсов на государственную службу",
  "L'articolo 48 chiama il voto dovere civico, ma non prevede sanzioni. Dovere civico indica un obbligo morale e politico, non un obbligo giuridico assistito da pena.":
    "Статья 48 называет голосование гражданским долгом, но наказаний не предусматривает. Гражданский долг означает моральную и политическую обязанность, а не юридическую, подкреплённую карой.",
  "Quale articolo impone fedeltà alla Repubblica e l'osservanza della Costituzione?":
    "Какая статья требует верности Республике и соблюдения Конституции?",
  "L'articolo 48": "Статья 48",
  "L'articolo 52": "Статья 52",
  "L'articolo 53": "Статья 53",
  "L'articolo 54": "Статья 54",
  "L'articolo 54 chiede a tutti fedeltà alla Repubblica e, a chi ricopre funzioni pubbliche, di adempierle con disciplina e onore.":
    "Статья 54 требует от всех верности Республике, а от тех, кто занимает публичные должности, — исполнять их с дисциплиной и честью.",
  "Le garanzie dell'articolo 13 sulla libertà personale valgono solo per i cittadini italiani?":
    "Действуют ли гарантии статьи 13 о личной свободе только для итальянских граждан?",
  "Sì, solo per i cittadini": "Да, только для граждан",
  "No, l'articolo dice nessuno e vale per chiunque":
    "Нет, статья говорит «никто» и действует для всех",
  "Solo per i cittadini dell'Unione europea": "Только для граждан Европейского союза",
  "Solo per chi ha la residenza": "Только для тех, у кого есть вид на жительство",
  "L'articolo 13 usa la parola nessuno e l'articolo 21 la parola tutti: sono garanzie riferite alla persona. Riservati ai cittadini sono soprattutto i diritti politici, come il voto.":
    "Статья 13 говорит «никто», а статья 21 — «все»: это гарантии, отнесённые к человеку. За гражданами закреплены прежде всего политические права, например голос.",
  "Quale articolo definisce sacro dovere la difesa della patria?":
    "Какая статья называет защиту родины священным долгом?",
  "L'articolo 52. Il 48 riguarda il voto, il 53 i tributi e l'11 il ripudio della guerra: quattro articoli che si citano spesso insieme e si confondono facilmente.":
    "Статья 52. 48-я касается голоса, 53-я — налогов, а 11-я — отказа от войны: четыре статьи, которые часто называют вместе и легко путают.",
  "Quale articolo della Costituzione tutela le minoranze linguistiche?":
    "Какая статья Конституции защищает языковые меньшинства?",
  "L'articolo 9": "Статья 9",
  "L'articolo 6 impegna la Repubblica a tutelare con apposite norme le minoranze linguistiche. L'attuazione arriverà però solo con la legge 482 del 1999.":
    "Статья 6 обязывает Республику защищать языковые меньшинства особыми нормами. Но исполнение придёт только с законом 482 от 1999 года.",
  "Quante minoranze linguistiche storiche riconosce la legge del 1999?":
    "Сколько исторических языковых меньшинств признаёт закон 1999 года?",
  "Nove": "Девять",
  "Venti": "Двадцать",
  "Dodici: albanesi, catalane, germaniche, greche, slovene, croate, e le popolazioni parlanti francese, franco-provenzale, friulano, ladino, occitano e sardo.":
    "Двенадцать: албанское, каталонское, германские, греческое, словенское, хорватское, а также говорящие по-французски, на франкопровансальском, фриульском, ладинском, окситанском и сардинском.",
  "In quale regione il tedesco è equiparato all'italiano?":
    "В каком регионе немецкий приравнен к итальянскому?",
  "In Friuli Venezia Giulia": "Во Фриули-Венеция-Джулия",
  "In Veneto": "В Венето",
  "In Alto Adige il tedesco è equiparato all'italiano: atti bilingui, scuole distinte per gruppo linguistico e proporzionale etnica per i posti pubblici.":
    "В Альто-Адидже немецкий приравнен к итальянскому: двуязычные акты, отдельные школы для каждой языковой группы и этническая пропорция для государственных должностей.",
  "In che anno fu fondata l'Accademia della Crusca?":
    "В каком году основана Accademia della Crusca?",
  "Nel 1321": "В 1321 году",
  "Nel 1583": "В 1583 году",
  "Nel 1861": "В 1861 году",
  "Fondata a Firenze nel 1583, è la più antica accademia linguistica del mondo ancora attiva.":
    "Основанная во Флоренции в 1583 году, это старейшая действующая языковая академия в мире.",
  "Perché il napoletano non è considerato una variante dell'italiano?":
    "Почему неаполитанский не считают разновидностью итальянского?",
  "Perché ha un alfabeto diverso": "Потому что у него другой алфавит",
  "Perché discende dal latino per conto proprio, come lingua romanza sorella":
    "Потому что он происходит от латыни сам по себе, как родственный романский язык",
  "Perché è parlato solo in una città": "Потому что на нём говорят только в одном городе",
  "Perché non ha una tradizione scritta": "Потому что у него нет письменной традиции",
  "I cosiddetti dialetti italiani in genere non derivano dall'italiano: derivano dal latino in parallelo. Il napoletano ha inoltre una lunga tradizione scritta e letteraria.":
    "Так называемые итальянские диалекты обычно происходят не от итальянского: они идут от латыни параллельно с ним. У неаполитанского к тому же долгая письменная и литературная традиция.",
  "Quale studioso propose la stima più citata sugli italofoni al momento dell'Unità?":
    "Какой учёный предложил самую цитируемую оценку числа говоривших по-итальянски к моменту объединения?",
  "Benedetto Croce": "Бенедетто Кроче",
  "Tullio De Mauro": "Туллио Де Мауро",
  "Antonio Gramsci": "Антонио Грамши",
  "Bruno Migliorini": "Бруно Мильорини",
  "La stima di poco più del due per cento è di Tullio De Mauro. Altri studiosi propongono percentuali più alte, comunque lontane dalla maggioranza della popolazione.":
    "Оценка чуть больше двух процентов принадлежит Туллио Де Мауро. Другие учёные называют доли повыше, но всё равно далёкие от большинства населения.",
  "Che cos'è la proporzionale etnica in Alto Adige?":
    "Что такое этническая пропорция в Альто-Адидже?",
  "Una ripartizione dei posti nel pubblico impiego fra i gruppi linguistici":
    "Распределение мест на государственной службе между языковыми группами",
  "Un sistema elettorale riservato alle minoranze":
    "Избирательная система, отведённая меньшинствам",
  "Una quota di studenti stranieri per classe": "Квота иностранных учеников на класс",
  "Una divisione del bilancio provinciale fra i comuni":
    "Раздел провинциального бюджета между коммунами",
  "I posti nel pubblico impiego sono ripartiti fra gruppo italiano, tedesco e ladino in proporzione alla loro consistenza, dichiarata al censimento.":
    "Места на государственной службе распределяются между итальянской, немецкой и ладинской группами пропорционально их численности, заявленной при переписи.",
  "Quali lingue minoritarie sono tutelate in Friuli Venezia Giulia?":
    "Какие языки меньшинств защищены во Фриули-Венеция-Джулия?",
  "Il tedesco e il ladino": "Немецкий и ладинский",
  "Lo sloveno e il friulano": "Словенский и фриульский",
  "Il croato e l'albanese": "Хорватский и албанский",
  "L'occitano e il sardo": "Окситанский и сардинский",
  "Lo sloveno nelle province di Trieste, Gorizia e Udine, e il friulano, parlato da alcune centinaia di migliaia di persone.":
    "Словенский в провинциях Триест, Гориция и Удине, и фриульский, на котором говорят несколько сотен тысяч человек.",
  "Da quale città viene il modello su cui si è formato l'italiano standard?":
    "Из какого города пришёл образец, на котором сложился литературный итальянский?",
  "Il fiorentino letterario del Trecento, quello di Dante, Petrarca e Boccaccio, fu adottato nel Cinquecento come modello scritto per tutta la penisola.":
    "Литературный флорентийский XIV века, язык Данте, Петрарки и Боккаччо, в XVI веке приняли как письменный образец для всего полуострова.",
  "Quale mezzo contribuì più di ogni altro a diffondere l'italiano parlato nel dopoguerra?":
    "Какое средство больше всех остальных распространило разговорный итальянский после войны?",
  "Il cinema": "Кино",
  "La televisione": "Телевидение",
  "La radio a galena": "Детекторный радиоприёмник",
  "I giornali": "Газеты",
  "Negli anni Cinquanta e Sessanta la televisione portò l'italiano nelle case di chi parlava solo dialetto, insieme alla scuola dell'obbligo e all'emigrazione interna.":
    "В пятидесятые и шестидесятые телевидение принесло итальянский в дома тех, кто говорил только на диалекте, вместе с обязательной школой и внутренней миграцией.",
  "Da dove viene il nome dell'Accademia della Crusca?":
    "Откуда взялось название Accademia della Crusca?",
  "Dal quartiere fiorentino in cui nacque": "От флорентийского квартала, где она возникла",
  "Dall'immagine della farina separata dalla crusca": "От образа муки, отделённой от отрубей",
  "Dal cognome del fondatore": "От фамилии основателя",
  "Da un'antica corporazione di fornai": "От старинного цеха пекарей",
  "Il nome richiama il lavoro di separare la farina buona dalla crusca: separare le parole da accogliere da quelle da scartare.":
    "Название напоминает о работе отделять хорошую муку от отрубей: отделять слова, которые стоит принять, от тех, что надо отбросить.",
  "In quale regione si parlano, oltre al francese, varietà germaniche walser?":
    "В каком регионе, кроме французского, говорят на германских наречиях вальзеров?",
  "In Emilia-Romagna": "В Эмилии-Романье",
  "In Calabria": "В Калабрии",
  "Le comunità walser vivono nelle valli alpine della Valle d'Aosta e del Piemonte. In Valle d'Aosta convivono quindi italiano, francese e parlate germaniche.":
    "Общины вальзеров живут в альпийских долинах Валле-д'Аоста и Пьемонта. В Валле-д'Аоста поэтому уживаются итальянский, французский и германские говоры.",
  "L'italiano è dichiarato lingua ufficiale nei principi fondamentali della Costituzione?":
    "Объявлен ли итальянский официальным языком в основных принципах Конституции?",
  "Sì, all'articolo 6": "Да, в статье 6",
  "Sì, all'articolo 12": "Да, в статье 12",
  "No: lo si ricava dallo statuto del Trentino-Alto Adige e dalla legge 482":
    "Нет: это выводится из устава Трентино-Альто-Адидже и закона 482",
  "No: non è lingua ufficiale in nessun testo":
    "Нет: официальным языком он не назван ни в одном тексте",
  "La Costituzione non lo dice. L'italiano è indicato come lingua ufficiale nello statuto speciale del Trentino-Alto Adige e nella legge 482 del 1999: una cosa ovvia che non sta dove ci si aspetta.":
    "Конституция об этом не говорит. Итальянский назван официальным языком в особом уставе Трентино-Альто-Адидже и в законе 482 от 1999 года: очевидная вещь стоит не там, где её ждут.",
  "Quanti sono i giorni festivi nazionali, oltre al patrono locale?":
    "Сколько в стране нерабочих праздников, кроме местного покровителя?",
  "Dieci": "Десять",
  "Quindici": "Пятнадцать",
  "Dodici giorni festivi per legge, più il santo patrono, che è festivo soltanto nel proprio comune.":
    "Двенадцать праздничных дней по закону, плюс святой покровитель, который нерабочий только в своей коммуне.",
  "Quando si celebra il patrono di Milano?": "Когда отмечают покровителя Милана?",
  "Il 19 settembre": "19 сентября",
  "Il 4 ottobre": "4 октября",
  "Il 7 dicembre": "7 декабря",
  "Il 29 giugno": "29 июня",
  "Sant'Ambrogio si celebra il 7 dicembre: a Milano è giorno festivo e apre la stagione della Scala. Il 19 settembre è san Gennaro a Napoli.":
    "Святого Амвросия отмечают 7 декабря: в Милане это нерабочий день, он открывает сезон в Ла Скала. 19 сентября — это святой Януарий в Неаполе.",
  "Chi è il patrono di Napoli?": "Кто покровитель Неаполя?",
  "San Petronio": "Святой Петроний",
  "San Gennaro": "Святой Януарий",
  "San Marco": "Святой Марк",
  "Santa Rosalia": "Святая Розалия",
  "San Gennaro, celebrato il 19 settembre. San Petronio è di Bologna, san Marco di Venezia e santa Rosalia di Palermo.":
    "Святой Януарий, которого отмечают 19 сентября. Святой Петроний — покровитель Болоньи, святой Марк — Венеции, святая Розалия — Палермо.",
  "Che cosa si celebra il 1º maggio?": "Что отмечают 1 мая?",
  "La Liberazione": "Освобождение",
  "La festa dei lavoratori": "Праздник трудящихся",
  "La festa della Repubblica": "Праздник Республики",
  "L'Unità nazionale": "Национальное единство",
  "Il 1º maggio è la festa dei lavoratori, una delle quattro ricorrenze civili del calendario italiano.":
    "1 мая — праздник трудящихся, одна из четырёх гражданских дат итальянского календаря.",
  "Quando si celebrano i santi Pietro e Paolo, patroni di Roma?":
    "Когда отмечают святых Петра и Павла, покровителей Рима?",
  "Il 21 aprile": "21 апреля",
  "Il 1º novembre": "1 ноября",
  "Il 29 giugno, giorno festivo soltanto a Roma. Il 21 aprile è invece il Natale di Roma, che non è festivo.":
    "29 июня, нерабочий день только в Риме. А 21 апреля — это день основания Рима, который нерабочим не является.",
  "Il giorno del patrono è festivo in tutta Italia?":
    "Является ли день покровителя нерабочим во всей Италии?",
  "Sì, come le altre dodici feste": "Да, как и остальные двенадцать праздников",
  "No, soltanto nel comune di cui è patrono": "Нет, только в той коммуне, чей он покровитель",
  "Sì, ma solo nei capoluoghi di regione": "Да, но только в областных центрах",
  "No, non è mai festivo per legge": "Нет, по закону он никогда не бывает нерабочим",
  "È festivo solo nel proprio comune: un ufficio milanese chiude il 7 dicembre, mentre a Roma lo stesso giorno si lavora normalmente.":
    "Он нерабочий только в своей коммуне: миланская контора закрывается 7 декабря, а в Риме в тот же день работают как обычно.",
  "Con quale nome è comunemente conosciuto il Lunedì dell'Angelo?":
    "Под каким именем обычно известен Lunedì dell'Angelo?",
  "Pasquetta": "Пасквета, пасхальный понедельник",
  "Carnevale": "Карнавал",
  "Befana": "Бефана",
  "Il lunedì dopo Pasqua si chiama ufficialmente Lunedì dell'Angelo e comunemente Pasquetta. È una festa mobile, come la Pasqua da cui dipende.":
    "Понедельник после Пасхи официально называется Lunedì dell'Angelo, а в обиходе — Pasquetta. Это переходящий праздник, как и Пасха, от которой он зависит.",
  "Che cosa si ricorda il 10 febbraio?": "О чём вспоминают 10 февраля?",
  "Le vittime delle foibe e l'esodo giuliano-dalmata":
    "О жертвах фойб и об исходе жителей Юлийской Крайны и Далмации",
  "I caduti della Grande guerra": "О павших в Первой мировой войне",
  "Il Giorno del Ricordo, istituito per le vittime delle foibe e per l'esodo delle popolazioni istriane, fiumane e dalmate.":
    "День памяти, учреждённый для жертв фойб и для исхода населения Истрии, Риеки и Далмации.",
  "A quale fatto del 1978 è legata la data del 9 maggio?":
    "С каким событием 1978 года связана дата 9 мая?",
  "Alla strage di piazza Fontana": "С бойней на площади Фонтана",
  "Al ritrovamento del corpo di Aldo Moro": "С тем, что нашли тело Альдо Моро",
  "All'attentato di via Fani": "С нападением на улице Фани",
  "Alla strage di Bologna": "Со взрывом в Болонье",
  "Il 9 maggio 1978 fu ritrovato il corpo di Aldo Moro. Quella data è oggi il Giorno della memoria delle vittime del terrorismo. Il rapimento in via Fani era avvenuto il 16 marzo.":
    "9 мая 1978 года было найдено тело Альдо Моро. Сегодня это День памяти жертв терроризма. Похищение на улице Фани произошло 16 марта.",
  "Quale festa cade il 26 dicembre?": "Какой праздник приходится на 26 декабря?",
  "L'Immacolata": "Непорочное зачатие",
  "Santo Stefano": "День святого Стефана",
  "Ognissanti": "День всех святых",
  "Santo Stefano, il giorno dopo Natale. L'Immacolata è l'8 dicembre, l'Epifania il 6 gennaio e Ognissanti il 1º novembre.":
    "День святого Стефана, на следующий день после Рождества. Непорочное зачатие — это 8 декабря, Богоявление — 6 января, а День всех святых — 1 ноября.",
  "Quando cade l'Immacolata Concezione?": "Когда приходится Непорочное зачатие?",
  "Il 6 dicembre": "6 декабря",
  "Il 6 gennaio": "6 января",
  "L'8 dicembre. In molte case è il giorno in cui si fa l'albero di Natale, e a Roma il papa rende omaggio alla colonna di piazza di Spagna.":
    "8 декабря. Во многих домах в этот день ставят рождественскую ёлку, а в Риме папа воздаёт почести колонне на площади Испании.",
  "Da che cosa dipende la data della Pasqua?": "От чего зависит дата Пасхи?",
  "Da una data fissa stabilita nel Concilio di Trento":
    "От постоянной даты, установленной на Тридентском соборе",
  "Dal primo plenilunio di primavera": "От первого весеннего полнолуния",
  "Dal calendario civile dello Stato": "От гражданского календаря государства",
  "Dall'inizio della Quaresima, fissato al 1º marzo":
    "От начала Великого поста, назначенного на 1 марта",
  "La Pasqua cade la domenica successiva al primo plenilunio dopo l'equinozio di primavera. Da lei dipendono a cascata Carnevale, Quaresima e Pasquetta.":
    "Пасха приходится на воскресенье после первого полнолуния, следующего за весенним равноденствием. От неё цепочкой зависят карнавал, Великий пост и пасхальный понедельник.",
  "Che cosa porta la Befana la notte del 6 gennaio?": "Что приносит Бефана в ночь на 6 января?",
  "I doni ai bambini, e carbone di zucchero a chi non è stato buono":
    "Подарки детям, а тем, кто не слушался, — сахарный уголь",
  "Le uova di cioccolato": "Шоколадные яйца",
  "I dolci del Carnevale": "Карнавальные сладости",
  "I regali ai soli adulti": "Подарки только взрослым",
  "La Befana riempie le calze la notte dell'Epifania. Non è festa religiosa nel senso stretto: è una tradizione popolare che si è appoggiata alla data del 6 gennaio.":
    "Бефана наполняет чулки в ночь Богоявления. Это не религиозный праздник в строгом смысле: народный обычай, который прислонился к дате 6 января.",
  "Quanti sono oggi i senatori elettivi?": "Сколько сегодня выборных сенаторов?",
  "Cento": "Сто",
  "Trecentoquindici": "Триста пятнадцать",
  "Quattrocento": "Четыреста",
  "Duecento dal 2022. Trecentoquindici era il numero precedente e quattrocento è quello dei deputati.":
    "Двести с 2022 года. Триста пятнадцать было прежним числом, а четыреста — это депутаты.",
  "In quale palazzo si riunisce la Camera dei deputati?":
    "В каком дворце заседает Палата депутатов?",
  "Palazzo Madama": "Палаццо Мадама",
  "Palazzo Chigi": "Палаццо Киджи",
  "Palazzo Montecitorio": "Палаццо Монтечиторио",
  "Palazzo della Consulta": "Палаццо делла Консульта",
  "Montecitorio è la Camera, Madama il Senato, Chigi il governo e la Consulta la Corte costituzionale: quattro palazzi romani che nei giornali stanno per quattro istituzioni.":
    "Монтечиторио — это Палата, Мадама — Сенат, Киджи — правительство, а Консульта — Конституционный суд: четыре римских дворца, которые в газетах заменяют названия четырёх учреждений.",
  "In quale palazzo si riunisce il Senato?": "В каком дворце заседает Сенат?",
  "Palazzo Madama, che deve il nome a Margherita d'Austria. Il Quirinale è la residenza del Presidente della Repubblica.":
    "Палаццо Мадама, названный так в честь Маргариты Австрийской. Квиринал — резиденция президента Республики.",
  "Quanti anni bisogna avere per essere eletti senatori?":
    "Сколько лет нужно, чтобы быть избранным сенатором?",
  "Venticinque": "Двадцать пять",
  "Trenta": "Тридцать",
  "Quaranta": "Сорок",
  "Cinquanta": "Пятьдесят",
  "Quaranta per il Senato, venticinque per la Camera. Cinquanta è invece l'età minima per il Presidente della Repubblica.":
    "Сорок для Сената, двадцать пять для Палаты. А пятьдесят — это минимальный возраст для президента Республики.",
  "Quanti anni bisogna avere per essere eletti deputati?":
    "Сколько лет нужно, чтобы быть избранным депутатом?",
  "Diciotto": "Восемнадцать",
  "Venticinque. A diciotto si può votare per entrambe le camere, ma per candidarsi le soglie restano più alte.":
    "Двадцать пять. В восемнадцать можно голосовать за обе палаты, но чтобы выдвинуться, планка остаётся выше.",
  "Quanti erano deputati e senatori elettivi prima della riforma?":
    "Сколько было депутатов и выборных сенаторов до реформы?",
  "500 e 250": "500 и 250",
  "630 e 315": "630 и 315",
  "700 e 350": "700 и 350",
  "400 e 200": "400 и 200",
  "Seicentotrenta e trecentoquindici, fino alla legislatura iniziata nel 2022. Quattrocento e duecento sono i numeri attuali.":
    "Шестьсот тридцать и триста пятнадцать, до созыва, начавшегося в 2022 году. Четыреста и двести — нынешние числа.",
  "Che cosa si intende per navetta parlamentare?": "Что понимают под парламентским челноком?",
  "Il passaggio di un testo da una camera all'altra finché non è identico":
    "Переход текста из одной палаты в другую, пока он не станет одинаковым",
  "Il servizio che collega Montecitorio e Palazzo Madama":
    "Маршрутка между Монтечиторио и палаццо Мадама",
  "La sessione notturna di approvazione del bilancio": "Ночное заседание по принятию бюджета",
  "Il voto di fiducia ripetuto due volte": "Вотум доверия, повторённый дважды",
  "Una legge deve essere approvata nel medesimo testo da entrambe le camere: se una la modifica, torna all'altra. L'andirivieni può ripetersi molte volte ed è la conseguenza diretta del bicameralismo paritario.":
    "Закон должен быть принят в одном и том же тексте обеими палатами: если одна его меняет, он возвращается в другую. Хождение туда-сюда может повториться много раз и прямо вытекает из равноправного двухпалатного устройства.",
  "Quanto dura una legislatura?": "Сколько длится созыв парламента?",
  "Sei anni": "Шесть лет",
  "Cinque anni, salvo scioglimento anticipato. Sette anni è la durata del mandato presidenziale, e in Italia le legislature arrivate a scadenza naturale sono una minoranza.":
    "Пять лет, если не будет досрочного роспуска. Семь лет — это срок президента, а в Италии созывы, доживающие до естественного конца, составляют меньшинство.",
  "Quante firme servono per chiedere un referendum abrogativo?":
    "Сколько подписей нужно, чтобы потребовать отменяющий референдум?",
  "Cinquantamila": "Пятьдесят тысяч",
  "Centomila": "Сто тысяч",
  "Cinquecentomila": "Пятьсот тысяч",
  "Un milione": "Миллион",
  "Cinquecentomila elettori, oppure cinque consigli regionali. Centomila firme servono invece per una proposta di legge di iniziativa popolare.":
    "Пятьсот тысяч избирателей либо пять областных советов. А сто тысяч подписей нужны для законопроекта народной инициативы.",
  "Quando è valido un referendum abrogativo?": "Когда отменяющий референдум действителен?",
  "Sempre, qualunque sia l'affluenza": "Всегда, какой бы ни была явка",
  "Se partecipa la maggioranza degli aventi diritto":
    "Если участвует большинство имеющих право голоса",
  "Se partecipa un terzo degli aventi diritto": "Если участвует треть имеющих право голоса",
  "Se lo convalida la Corte costituzionale dopo il voto":
    "Если Конституционный суд утвердит его после голосования",
  "Serve il quorum di metà più uno degli aventi diritto. Molti referendum sono falliti non perché il no abbia vinto, ma perché non ci si è presentati: astenersi è un modo di far cadere la consultazione.":
    "Нужен кворум в половину плюс один от имеющих право голоса. Многие референдумы провалились не потому, что победило «нет», а потому, что люди не пришли: воздержаться — способ сорвать голосование.",
  "Quale di queste materie NON può essere sottoposta a referendum abrogativo?":
    "Какой из этих предметов НЕЛЬЗЯ вынести на отменяющий референдум?",
  "Il diritto di famiglia": "Семейное право",
  "L'energia nucleare": "Атомная энергетика",
  "Le leggi tributarie e di bilancio": "Налоговые и бюджетные законы",
  "La legge elettorale": "Избирательный закон",
  "L'articolo 75 esclude leggi tributarie e di bilancio, amnistia e indulto, e la ratifica dei trattati internazionali. Divorzio, aborto e nucleare sono invece stati tutti oggetto di referendum.":
    "Статья 75 исключает налоговые и бюджетные законы, амнистию и помилование, а также ратификацию международных договоров. А развод, аборт и атомная энергетика все были предметом референдумов.",
  "A quale età si vota oggi per il Senato?": "С какого возраста сегодня голосуют за Сенат?",
  "Diciotto anni": "С восемнадцати лет",
  "Ventun anni": "С двадцати одного года",
  "Venticinque anni": "С двадцати пяти лет",
  "Trent'anni": "С тридцати лет",
  "Diciotto, dalla legge costituzionale del 2021. Prima il Senato si eleggeva dai venticinque anni in su, e i più giovani avevano in mano una scheda sola.":
    "С восемнадцати, по конституционному закону 2021 года. Раньше Сенат избирали с двадцати пяти, и у самых молодых в руках был только один бюллетень.",
  "Quanti senatori a vita può nominare il Presidente della Repubblica?":
    "Сколько пожизненных сенаторов может назначить президент Республики?",
  "Nessuno": "Ни одного",
  "Fino a tre": "До трёх",
  "Fino a cinque": "До пяти",
  "Senza limite": "Без ограничения",
  "Fino a cinque, per altissimi meriti nel campo sociale, scientifico, artistico o letterario. Gli ex Presidenti della Repubblica non rientrano in questo numero: lo sono di diritto.":
    "До пяти, за высочайшие заслуги в общественной, научной, художественной или литературной области. Бывшие президенты Республики в это число не входят: они сенаторы по праву.",
  "Dove ha sede il governo italiano?": "Где находится итальянское правительство?",
  "Al Quirinale": "В Квиринале",
  "A Palazzo Chigi": "В палаццо Киджи",
  "A Palazzo Madama": "В палаццо Мадама",
  "A Montecitorio": "В Монтечиторио",
  "Palazzo Chigi. Il Quirinale è del Presidente della Repubblica: due palazzi a pochi minuti a piedi e due poteri distinti.":
    "Палаццо Киджи. Квиринал принадлежит президенту Республики: два дворца в нескольких минутах ходьбы и две разные власти.",
  "Che cosa sono le consultazioni?": "Что такое консультации?",
  "I sondaggi commissionati dai partiti prima del voto":
    "Опросы, которые партии заказывают перед голосованием",
  "Gli incontri del Presidente della Repubblica con i gruppi parlamentari":
    "Встречи президента Республики с парламентскими группами",
  "Le riunioni del Consiglio dei ministri": "Заседания Совета министров",
  "Le audizioni dei ministri in commissione": "Слушания министров в комиссии",
  "Prima di nominare un Presidente del Consiglio, il capo dello Stato riceve i gruppi per capire chi possa raccogliere una maggioranza. Non sono previste nel dettaglio dalla Costituzione: sono una prassi consolidata.":
    "Прежде чем назначить председателя Совета министров, глава государства принимает группы, чтобы понять, кто способен собрать большинство. Подробно Конституцией они не предусмотрены: это устоявшаяся практика.",
  "Entro quanti giorni dalla formazione il governo si presenta per la fiducia?":
    "В какой срок после формирования правительство приходит за вотумом доверия?",
  "Sessanta": "Шестьдесят",
  "Dieci giorni, secondo l'articolo 94. Sessanta è il termine di conversione dei decreti legge e tre il tempo minimo prima di discutere una mozione di sfiducia.":
    "Десять дней, по статье 94. Шестьдесят — это срок преобразования декретов-законов, а три — минимальное время перед обсуждением вотума недоверия.",
  "Da quante camere deve ottenere la fiducia un governo?":
    "От скольких палат правительство должно получить доверие?",
  "Solo dalla Camera dei deputati": "Только от Палаты депутатов",
  "Solo dal Senato": "Только от Сената",
  "Da entrambe": "От обеих",
  "Da una qualsiasi delle due, a scelta del Presidente del Consiglio":
    "От любой из двух, на выбор председателя Совета министров",
  "Da entrambe, ed è una conseguenza del bicameralismo paritario. Un governo che ha i numeri alla Camera ma non al Senato non può esistere: è la ragione per cui le maggioranze italiane sono spesso larghe e fragili.":
    "От обеих, и это следствие равноправного двухпалатного устройства. Правительство, у которого есть числа в Палате, но нет в Сенате, существовать не может: поэтому итальянские большинства часто широки и хрупки.",
  "Quale articolo consente al governo il decreto legge?":
    "Какая статья позволяет правительству издать декрет-закон?",
  "L'articolo 76": "Статья 76",
  "L'articolo 77": "Статья 77",
  "L'articolo 92": "Статья 92",
  "L'articolo 77, per casi straordinari di necessità e urgenza. Il 76 riguarda il decreto legislativo su delega, il 75 il referendum abrogativo e il 92 la nomina del governo.":
    "Статья 77, для чрезвычайных случаев необходимости и срочности. 76-я касается законодательного декрета по делегированию, 75-я — отменяющего референдума, а 92-я — назначения правительства.",
  "Che cos'è un decreto legislativo?": "Что такое законодательный декрет?",
  "Una norma scritta dal governo su delega del Parlamento":
    "Норма, написанная правительством по поручению парламента",
  "Una norma d'urgenza che vale subito": "Срочная норма, которая действует сразу",
  "Un regolamento di attuazione di una legge": "Регламент по исполнению закона",
  "Una legge approvata da una sola camera": "Закон, принятый только одной палатой",
  "Il Parlamento delega, fissando principi, criteri e un termine; il governo scrive il testo. Serve per normative lunghe e tecniche come i codici. Il decreto legge, invece, nasce dall'urgenza e non da una delega.":
    "Парламент делегирует, задавая принципы, критерии и срок; правительство пишет текст. Это нужно для длинных технических сводов вроде кодексов. А декрет-закон рождается из срочности, а не из делегирования.",
  "Chi propone al Presidente della Repubblica i nomi dei ministri?":
    "Кто предлагает президенту Республики имена министров?",
  "I segretari dei partiti di maggioranza": "Секретари партий большинства",
  "Il Presidente del Consiglio incaricato": "Назначенный председатель Совета министров",
  "Il presidente della Camera": "Председатель Палаты",
  "Nessuno: li sceglie il Presidente della Repubblica da solo":
    "Никто: их выбирает президент Республики сам",
  "L'articolo 92 dice che il Presidente della Repubblica nomina i ministri su proposta del Presidente del Consiglio. La proposta è dell'uno, la nomina dell'altro: nessuno dei due decide da solo.":
    "Статья 92 говорит, что президент Республики назначает министров по предложению председателя Совета министров. Предложение от одного, назначение от другого: ни один из них не решает в одиночку.",
  "Da quanti parlamentari deve essere firmata una mozione di sfiducia?":
    "Сколькими парламентариями должен быть подписан вотум недоверия?",
  "Da dieci": "Десятью",
  "Da un decimo dei componenti della camera": "Десятой частью состава палаты",
  "Da un quarto": "Четвертью",
  "Dalla maggioranza assoluta": "Абсолютным большинством",
  "Un decimo dei componenti. La soglia è bassa di proposito: presentare la mozione deve essere possibile, approvarla è un'altra cosa.":
    "Десятая часть состава. Планка намеренно низкая: внести вотум должно быть можно, принять его — совсем другое дело.",
  "Dopo quanto tempo dalla presentazione può essere discussa una mozione di sfiducia?":
    "Через какое время после внесения можно обсуждать вотум недоверия?",
  "Subito": "Сразу",
  "Non prima di tre giorni": "Не раньше чем через три дня",
  "Non prima di dieci giorni": "Не раньше чем через десять дней",
  "Non prima di un mese": "Не раньше чем через месяц",
  "Tre giorni almeno. L'attesa serve a raffreddare gli animi e a dare tempo al governo di cercare i voti che gli mancano.":
    "Не меньше трёх дней. Ожидание нужно, чтобы страсти остыли и у правительства было время поискать недостающие голоса.",
  "Chi compone il Consiglio dei ministri?": "Кто входит в Совет министров?",
  "Il Presidente del Consiglio e i ministri": "Председатель Совета министров и министры",
  "Il Presidente della Repubblica e i ministri": "Президент Республики и министры",
  "I capigruppo parlamentari": "Руководители парламентских групп",
  "I presidenti delle regioni": "Председатели областей",
  "Il Presidente del Consiglio e i ministri insieme formano il Consiglio dei ministri, che è l'organo collegiale del governo.":
    "Председатель Совета министров и министры вместе образуют Совет министров — коллегиальный орган правительства.",
  "In che modo cadono di solito i governi italiani?":
    "Каким образом обычно падают итальянские правительства?",
  "Con un voto di sfiducia in aula": "Вотумом недоверия в зале",
  "Per dimissioni del Presidente del Consiglio": "Отставкой председателя Совета министров",
  "Per decisione del Presidente della Repubblica": "Решением президента Республики",
  "Alla scadenza naturale dei cinque anni": "По естественному истечению пяти лет",
  "Quasi sempre per dimissioni: un partito lascia la maggioranza e il Presidente del Consiglio sale al Quirinale prima di essere messo in minoranza. Le mozioni di sfiducia approvate si contano sulle dita.":
    "Почти всегда отставкой: партия выходит из большинства, и председатель Совета министров поднимается на Квиринал, прежде чем окажется в меньшинстве. Принятые вотумы недоверия можно пересчитать по пальцам.",
  "Un regolamento del governo può contraddire una legge?":
    "Может ли правительственный регламент противоречить закону?",
  "Sì, se è più recente": "Да, если он более поздний",
  "No: attua la legge e non può andarle contro":
    "Нет: он исполняет закон и пойти против него не может",
  "Sì, in caso di urgenza": "Да, в случае срочности",
  "Solo con il parere della Corte costituzionale": "Только с заключением Конституционного суда",
  "Il regolamento sta sotto la legge nella gerarchia delle fonti: ne detta i dettagli attuativi e non può contraddirla. Per fare qualcosa con forza di legge servono il decreto legge o il decreto legislativo.":
    "Регламент стоит ниже закона в иерархии источников: он задаёт подробности исполнения и противоречить закону не может. Чтобы сделать что-то с силой закона, нужен декрет-закон или законодательный декрет.",
  "Quale palazzo è la residenza del Presidente della Repubblica?":
    "Какой дворец — резиденция президента Республики?",
  "Il Viminale": "Виминал",
  "Il Quirinale, che fu dei papi e poi dei re. Il Viminale è il Ministero dell'interno, un altro nome di palazzo che nei giornali sostituisce l'istituzione.":
    "Квиринал, который принадлежал папам, а потом королям. Виминал — это министерство внутренних дел, ещё одно название дворца, которым в газетах заменяют учреждение.",
  "Qual è l'età minima per essere eletti Presidente della Repubblica?":
    "Каков минимальный возраст для избрания президентом Республики?",
  "Quaranta anni": "Сорок лет",
  "Quarantacinque anni": "Сорок пять лет",
  "Sessant'anni": "Шестьдесят лет",
  "Cinquant'anni, oltre alla cittadinanza italiana e al godimento dei diritti civili e politici. Quaranta è l'età minima per il Senato.":
    "Пятьдесят лет, а кроме того итальянское гражданство и обладание гражданскими и политическими правами. Сорок — это минимальный возраст для Сената.",
  "Quanti delegati regionali partecipano all'elezione del Presidente?":
    "Сколько областных делегатов участвует в выборах президента?",
  "Cinquantotto": "Пятьдесят восемь",
  "Cinquantotto: tre per ogni regione e uno soltanto per la Valle d'Aosta. Si aggiungono ai deputati e ai senatori riuniti in seduta comune.":
    "Пятьдесят восемь: по три от каждой области и только один от Валле-д'Аоста. Они прибавляются к депутатам и сенаторам, собравшимся на совместное заседание.",
  "Quanti delegati esprime la Valle d'Aosta all'elezione presidenziale?":
    "Сколько делегатов выставляет Валле-д'Аоста на президентских выборах?",
  "Uno": "Одного",
  "Tre come tutte le altre": "Трёх, как все остальные",
  "Uno solo: è l'eccezione prevista proprio per la sua dimensione. Tutte le altre diciannove regioni ne esprimono tre.":
    "Только одного: это исключение, предусмотренное именно из-за её размера. Все остальные девятнадцать областей выставляют по три.",
  "Quale maggioranza serve nei primi tre scrutini per eleggere il Presidente?":
    "Какое большинство нужно в первых трёх турах, чтобы избрать президента?",
  "La maggioranza semplice": "Простое большинство",
  "La maggioranza assoluta": "Абсолютное большинство",
  "I due terzi": "Две трети",
  "L'unanimità": "Единогласие",
  "Due terzi dell'assemblea nei primi tre scrutini; dal quarto basta la maggioranza assoluta. La soglia alta all'inizio spinge a cercare un nome largamente condiviso.":
    "Две трети собрания в первых трёх турах; с четвёртого хватает абсолютного большинства. Высокая планка вначале подталкивает искать имя, с которым согласны многие.",
  "Che maggioranza basta dal quarto scrutinio in poi?":
    "Какого большинства хватает начиная с четвёртого тура?",
  "I tre quinti": "Трёх пятых",
  "La maggioranza dei presenti": "Большинства присутствующих",
  "La maggioranza assoluta dei componenti. È il momento in cui l'elezione diventa possibile per una coalizione senza bisogno dell'opposizione.":
    "Абсолютного большинства состава. Это момент, когда выборы становятся возможны для коалиции без помощи оппозиции.",
  "Chi sono i franchi tiratori in un'elezione presidenziale?":
    "Кто такие «вольные стрелки» на президентских выборах?",
  "I delegati regionali che votano per ultimi": "Областные делегаты, которые голосуют последними",
  "I parlamentari che votano diversamente da quanto indicato dal proprio gruppo":
    "Парламентарии, которые голосуют не так, как указала их группа",
  "I senatori a vita": "Пожизненные сенаторы",
  "Gli scrutatori incaricati dello spoglio": "Счётчики, которым поручен подсчёт",
  "Il voto è segreto, e la segretezza permette di disobbedire al gruppo senza che si sappia chi è stato. Alcune elezioni sono naufragate proprio su questo, richiedendo decine di scrutini.":
    "Голосование тайное, и тайна позволяет ослушаться группы так, что никто не узнает кто. Некоторые выборы именно на этом и срывались, требуя десятков туров.",
  "Chi presiede il Consiglio superiore della magistratura?":
    "Кто председательствует в Высшем совете магистратуры?",
  "Il ministro della Giustizia": "Министр юстиции",
  "Il primo presidente della Cassazione": "Первый председатель Кассационного суда",
  "Il presidente della Corte costituzionale": "Председатель Конституционного суда",
  "Lo presiede il capo dello Stato, come garanzia di indipendenza. Il primo presidente della Cassazione e il procuratore generale ne fanno parte di diritto, e il ministro della Giustizia non ne fa parte affatto.":
    "Председательствует глава государства — как гарантия независимости. Первый председатель Кассационного суда и генеральный прокурор входят в него по праву, а министр юстиции не входит вовсе.",
  "Quanti giudici costituzionali nomina il Presidente della Repubblica?":
    "Сколько конституционных судей назначает президент Республики?",
  "Cinque su quindici. Altri cinque li elegge il Parlamento in seduta comune e cinque vengono dalle supreme magistrature.":
    "Пятерых из пятнадцати. Ещё пятерых избирает парламент на совместном заседании, и пятеро приходят из высших судов.",
  "Per quali atti il Presidente della Repubblica può essere chiamato a rispondere?":
    "За какие действия президент Республики может быть привлечён к ответственности?",
  "Per qualsiasi reato, come ogni cittadino": "За любое преступление, как любой гражданин",
  "Per alto tradimento e attentato alla Costituzione":
    "За государственную измену и посягательство на Конституцию",
  "Per le leggi che promulga": "За законы, которые он обнародует",
  "Per nessun atto, in nessun caso": "Ни за какие действия, ни в каком случае",
  "Solo per questi due. Per il resto degli atti compiuti nell'esercizio delle funzioni non è responsabile: risponde il ministro che li controfirma.":
    "Только за эти два. За остальные действия при исполнении обязанностей он не отвечает: отвечает министр, который их контрасигнует.",
  "A che cosa serve la controfirma ministeriale?": "Для чего нужна министерская контрасигнатура?",
  "A certificare la firma del Presidente": "Чтобы удостоверить подпись президента",
  "A far assumere al ministro la responsabilità dell'atto":
    "Чтобы министр взял на себя ответственность за акт",
  "A rendere l'atto immediatamente esecutivo": "Чтобы акт немедленно вступил в исполнение",
  "A trasmettere l'atto alla Corte costituzionale": "Чтобы передать акт в Конституционный суд",
  "L'articolo 89 lega ogni atto presidenziale alla firma del ministro proponente, che se ne assume la responsabilità. È il modo di conciliare un capo dello Stato irresponsabile con un sistema in cui qualcuno deve rispondere.":
    "Статья 89 связывает каждый президентский акт с подписью предлагающего министра, который берёт ответственность на себя. Так примиряют не отвечающего главу государства с системой, где кто-то отвечать должен.",
  "Quale di questi poteri spetta al Presidente della Repubblica?":
    "Какое из этих полномочий принадлежит президенту Республики?",
  "Approvare il bilancio": "Утверждать бюджет",
  "Concedere la grazia": "Миловать",
  "Nominare i sindaci": "Назначать мэров",
  "Fissare le aliquote fiscali": "Устанавливать налоговые ставки",
  "La grazia è un potere presidenziale. Bilancio e tasse spettano al Parlamento e al governo, e i sindaci li eleggono i cittadini.":
    "Помилование — президентское полномочие. Бюджет и налоги принадлежат парламенту и правительству, а мэров избирают граждане.",
  "Chi giudica il Presidente messo in stato d'accusa?":
    "Кто судит президента, которому предъявлено обвинение?",
  "La Corte di cassazione": "Кассационный суд",
  "Il Parlamento in seduta comune": "Парламент на совместном заседании",
  "La Corte costituzionale integrata da sedici membri esterni":
    "Конституционный суд, дополненный шестнадцатью внешними членами",
  "Un tribunale ordinario di Roma": "Обычный римский суд",
  "La Corte costituzionale, allargata a sedici giudici aggregati sorteggiati da un elenco di cittadini. Il Parlamento in seduta comune mette in stato d'accusa, ma non giudica.":
    "Конституционный суд, расширенный шестнадцатью привлечёнными судьями, которых тянут жребием из списка граждан. Парламент на совместном заседании предъявляет обвинение, но не судит.",
  "Chi mette il Presidente in stato d'accusa?": "Кто предъявляет обвинение президенту?",
  "La sola Camera dei deputati": "Одна лишь Палата депутатов",
  "Il Consiglio dei ministri": "Совет министров",
  "La Corte costituzionale d'ufficio": "Конституционный суд по собственной инициативе",
  "Il Parlamento in seduta comune, a maggioranza assoluta. Poi il giudizio passa alla Corte costituzionale nella sua composizione allargata.":
    "Парламент на совместном заседании, абсолютным большинством. Потом суд переходит к Конституционному суду в расширенном составе.",
  "Quale articolo dichiara la magistratura autonoma e indipendente?":
    "Какая статья объявляет магистратуру самостоятельной и независимой?",
  "L'articolo 104": "Статья 104",
  "L'articolo 112": "Статья 112",
  "L'articolo 104. Il 101 stabilisce che i giudici sono soggetti soltanto alla legge, il 112 l'obbligatorietà dell'azione penale e il 24 il diritto di difesa.":
    "Статья 104. 101-я устанавливает, что судьи подчинены только закону, 112-я — обязательность уголовного преследования, а 24-я — право на защиту.",
  "A che cosa sono soggetti i giudici secondo la Costituzione?":
    "Чему подчинены судьи по Конституции?",
  "Al ministro della Giustizia": "Министру юстиции",
  "Soltanto alla legge": "Только закону",
  "Alle direttive del CSM": "Указаниям CSM",
  "Al Presidente della Repubblica": "Президенту Республики",
  "Soltanto alla legge, dice l'articolo 101. Il CSM gestisce le carriere ma non può dire a un giudice come decidere, e il ministro non ha alcun potere sulle sentenze.":
    "Только закону, говорит статья 101. CSM ведает карьерами, но не может сказать судье, как решать, а у министра нет никакой власти над приговорами.",
  "Che cosa comporta l'obbligatorietà dell'azione penale?":
    "Что влечёт за собой обязательность уголовного преследования?",
  "Che il pubblico ministero deve procedere su ogni notizia di reato":
    "Что прокурор должен возбуждать дело по каждому сообщению о преступлении",
  "Che ogni processo deve concludersi entro un anno":
    "Что каждый процесс должен закончиться в течение года",
  "Che l'imputato deve essere sempre difeso da un avvocato":
    "Что обвиняемого всегда должен защищать адвокат",
  "Che ogni condanna prevede il carcere": "Что каждый приговор предполагает тюрьму",
  "Ricevuta una notizia di reato, il pubblico ministero non può scegliere di lasciar perdere. In teoria elimina ogni discrezionalità politica; nella pratica, con più fascicoli che magistrati, la scelta si sposta sull'ordine delle priorità.":
    "Получив сообщение о преступлении, прокурор не может решить оставить его без последствий. В теории это снимает всякое политическое усмотрение; на практике, когда дел больше, чем судей, выбор смещается на порядок очерёдности.",
  "Quale articolo stabilisce l'obbligatorietà dell'azione penale?":
    "Какая статья устанавливает обязательность уголовного преследования?",
  "L'articolo 112. È uno degli articoli più discussi della Costituzione, perché la sua attuazione dipende da quante risorse ha la giustizia.":
    "Статья 112. Это одна из самых обсуждаемых статей Конституции, потому что её исполнение зависит от того, сколько у правосудия средств.",
  "Quanti gradi di giudizio prevede il sistema italiano?":
    "Сколько судебных инстанций предусматривает итальянская система?",
  "Primo grado, appello e Cassazione. I primi due esaminano i fatti, il terzo soltanto la corretta applicazione della legge.":
    "Первая инстанция, апелляция и кассация. Первые две разбирают факты, третья — только правильность применения закона.",
  "Quando una sentenza penale diventa definitiva?":
    "Когда уголовный приговор становится окончательным?",
  "Alla fine del primo grado": "В конце первой инстанции",
  "Dopo l'appello": "После апелляции",
  "Dopo la pronuncia della Cassazione": "После решения Кассационного суда",
  "Dopo la conferma della Corte costituzionale": "После подтверждения Конституционным судом",
  "Passa in giudicato dopo la Cassazione. Fino ad allora vale l'articolo 27: l'imputato non è considerato colpevole. La Corte costituzionale non entra nei processi: giudica le leggi.":
    "Он вступает в силу после кассации. До тех пор действует статья 27: обвиняемый не считается виновным. Конституционный суд в процессы не вмешивается: он судит законы.",
  "Dove ha sede la Corte costituzionale?": "Где находится Конституционный суд?",
  "A Palazzo della Consulta": "В палаццо делла Консульта",
  "Palazzo della Consulta, di fronte al Quirinale. Per questo la Corte viene chiamata semplicemente la Consulta.":
    "Палаццо делла Консульта, напротив Квиринала. Поэтому суд называют просто Консультой.",
  "Quanto dura il mandato di un giudice costituzionale?":
    "Сколько длится срок конституционного судьи?",
  "A vita": "Пожизненно",
  "Nove anni. Più lungo di una legislatura e del mandato presidenziale, così che nessun giudice debba qualcosa a chi lo ha nominato.":
    "Девять лет. Дольше созыва парламента и президентского срока, чтобы ни один судья не был ничем обязан тому, кто его назначил.",
  "Un giudice costituzionale può essere rinominato alla scadenza?":
    "Может ли конституционный судья быть назначен заново по истечении срока?",
  "Sì, una volta": "Да, один раз",
  "Sì, senza limiti": "Да, без ограничений",
  "No: il mandato non è rinnovabile": "Нет: срок не возобновляется",
  "Solo se lo propone il Presidente della Repubblica":
    "Только если это предложит президент Республики",
  "Non è rinnovabile, ed è parte della garanzia: un giudice che non può sperare in un secondo mandato non ha ragione di compiacere chi lo ha scelto.":
    "Он не возобновляется, и это часть гарантии: судье, который не может надеяться на второй срок, незачем угождать тому, кто его выбрал.",
  "Quale di questi compiti NON spetta alla Corte costituzionale?":
    "Какая из этих задач НЕ относится к Конституционному суду?",
  "Giudicare la legittimità costituzionale delle leggi": "Судить о конституционности законов",
  "Decidere i conflitti di attribuzione fra Stato e regioni":
    "Решать споры о полномочиях между государством и областями",
  "Giudicare in appello i processi penali": "Рассматривать уголовные дела в апелляции",
  "Decidere se un referendum abrogativo è ammissibile":
    "Решать, допустим ли отменяющий референдум",
  "L'appello spetta alla magistratura ordinaria. La Corte costituzionale giudica leggi, conflitti fra poteri, accuse contro il Presidente e ammissibilità dei referendum: mai un imputato.":
    "Апелляция принадлежит обычным судам. Конституционный суд судит законы, споры между властями, обвинения против президента и допустимость референдумов — но никогда обвиняемого.",
  "Da quando perde efficacia una legge dichiarata incostituzionale?":
    "С какого момента закон, признанный неконституционным, теряет силу?",
  "Dal giorno in cui era stata approvata": "Со дня, когда он был принят",
  "Dal giorno successivo alla pubblicazione della sentenza":
    "Со дня, следующего за публикацией решения",
  "Dopo un anno, per dare tempo al Parlamento": "Через год, чтобы дать время парламенту",
  "Solo se il Parlamento la abroga": "Только если парламент его отменит",
  "Cessa di avere efficacia dal giorno dopo la pubblicazione della decisione. Non serve alcun intervento del Parlamento: la norma esce dall'ordinamento da sola.":
    "Он перестаёт действовать со дня после публикации решения. Никакого вмешательства парламента не нужно: норма выходит из правопорядка сама.",
  "Chi decide trasferimenti, promozioni e provvedimenti disciplinari dei magistrati?":
    "Кто решает о переводах, повышениях и дисциплинарных мерах для судей?",
  "Il Consiglio superiore della magistratura": "Высший совет магистратуры",
  "Il CSM, presieduto dal Presidente della Repubblica. Tenere queste decisioni fuori dal governo è ciò che rende concreta l'indipendenza dell'articolo 104.":
    "CSM, которым председательствует президент Республики. Именно то, что эти решения держат вне правительства, делает независимость из статьи 104 настоящей.",
  "Con quale nome viene comunemente indicata la Corte costituzionale?":
    "Каким именем обычно называют Конституционный суд?",
  "La Cassazione": "Кассационный суд",
  "La Consulta": "Консульта",
  "La Corte dei conti": "Счётная палата",
  "La Consulta, dal palazzo che la ospita. La Corte dei conti è un altro organo, che controlla la spesa pubblica.":
    "Консульта, по имени дворца, в котором он размещается. Счётная палата — другой орган, который проверяет государственные расходы.",
  "Quante sono le regioni italiane?": "Сколько в Италии областей?",
  "Ventidue": "Двадцать две",
  "Venti, di cui cinque a statuto speciale e quindici a statuto ordinario.":
    "Двадцать, из них пять с особым статутом и пятнадцать с обычным.",
  "In che anno è stato riformato il Titolo V della Costituzione?":
    "В каком году реформировали Раздел V Конституции?",
  "Nel 1993": "В 1993 году",
  "Nel 2020": "В 2020 году",
  "Nel 2001. La riforma ha ribaltato il criterio delle competenze e ha messo lo Stato per ultimo nell'elenco degli enti della Repubblica.":
    "В 2001 году. Реформа перевернула принцип распределения полномочий и поставила государство последним в списке образований Республики.",
  "Dopo la riforma del 2001, a chi spettano le materie non elencate nella Costituzione?":
    "После реформы 2001 года кому принадлежат предметы, не перечисленные в Конституции?",
  "Allo Stato": "Государству",
  "Alle regioni": "Областям",
  "Ai comuni": "Коммунам",
  "Sono decise di volta in volta dalla Corte costituzionale":
    "Их каждый раз решает Конституционный суд",
  "Alle regioni. Prima valeva il criterio opposto: le regioni potevano legiferare solo sulle materie espressamente elencate. Il ribaltamento ha però moltiplicato i conflitti davanti alla Corte.":
    "Областям. Раньше действовал обратный принцип: области могли законодательствовать только по прямо перечисленным предметам. Но переворот умножил споры перед судом.",
  "Quali sono le due province autonome italiane?": "Какие две итальянские провинции автономны?",
  "Trieste e Gorizia": "Триест и Гориция",
  "Trento e Bolzano": "Тренто и Больцано",
  "Aosta e Sondrio": "Аоста и Сондрио",
  "Cagliari e Sassari": "Кальяри и Сассари",
  "Trento e Bolzano, che dentro il Trentino-Alto Adige hanno più poteri della regione stessa. È l'assetto nato dalla tutela della minoranza di lingua tedesca.":
    "Тренто и Больцано, у которых внутри Трентино-Альто-Адидже больше полномочий, чем у самой области. Такое устройство выросло из защиты немецкоязычного меньшинства.",
  "Quante sono le città metropolitane?": "Сколько метрополийных городов?",
  "Quattordici": "Четырнадцать",
  "Quattordici, istituite dal 2015 al posto delle province nei territori dei grandi capoluoghi. Il sindaco del capoluogo ne è anche sindaco metropolitano.":
    "Четырнадцать, учреждённых с 2015 года вместо провинций на территориях больших областных центров. Мэр центра одновременно и метрополийный мэр.",
  "Perché la Sicilia ha uno statuto speciale?": "Почему у Сицилии особый статут?",
  "Perché è la regione più popolosa": "Потому что это самая населённая область",
  "Perché è un'isola con un forte movimento autonomista nel dopoguerra":
    "Потому что это остров с сильным автономистским движением после войны",
  "Perché ospita una minoranza linguistica riconosciuta":
    "Потому что там живёт признанное языковое меньшинство",
  "Perché confina con uno Stato estero": "Потому что она граничит с иностранным государством",
  "Lo statuto siciliano è del 1946, precedente alla Costituzione stessa: fu concesso mentre il movimento indipendentista era forte. Le altre speciali nascono da minoranze linguistiche o da confini contesi.":
    "Сицилийский статут от 1946 года, он старше самой Конституции: его дали, когда движение за независимость было сильным. Остальные особые области выросли из языковых меньшинств или спорных границ.",
  "Quanti sono all'incirca i comuni italiani?": "Сколько примерно в Италии коммун?",
  "Ottocento": "Восемьсот",
  "Duemila": "Две тысячи",
  "Ottomila": "Восемь тысяч",
  "Ventimila": "Двадцать тысяч",
  "Circa ottomila, dalle grandi città a paesi di poche decine di abitanti. La frammentazione è tale che da anni si discute di accorpare i più piccoli.":
    "Около восьми тысяч, от больших городов до посёлков в несколько десятков жителей. Раздробленность такова, что годами обсуждают, не объединить ли самые мелкие.",
  "Che cosa comporta la regola per cui consiglio e presidente regionale stanno o cadono insieme?":
    "Что означает правило, по которому областной совет и председатель держатся или падают вместе?",
  "Che il presidente può sciogliere il consiglio quando vuole":
    "Что председатель может распустить совет когда захочет",
  "Che se il presidente cade, si torna al voto per entrambi":
    "Что если падает председатель, к выборам идут оба",
  "Che il consiglio elegge il presidente fra i propri membri":
    "Что совет избирает председателя из своих членов",
  "Che il presidente non può essere sfiduciato": "Что председателю нельзя выразить недоверие",
  "Dimissioni, sfiducia o impedimento del presidente sciolgono anche il consiglio e portano a nuove elezioni. Serve a evitare che una regione resti anni senza guida mentre si cercano maggioranze in aula.":
    "Отставка, недоверие или невозможность исполнять обязанности распускают и совет и ведут к новым выборам. Это нужно, чтобы область не оставалась годами без руководства, пока в зале ищут большинство.",
  "Il titolo di governatore per il presidente di una regione è ufficiale?":
    "Является ли титул губернатора для председателя области официальным?",
  "Sì, è previsto dalla Costituzione": "Да, он предусмотрен Конституцией",
  "Sì, dal 2001": "Да, с 2001 года",
  "No: è un uso giornalistico": "Нет: это газетное словоупотребление",
  "Sì, ma solo nelle regioni a statuto speciale": "Да, но только в областях с особым статутом",
  "La Costituzione parla di Presidente della Giunta regionale. Governatore è entrato dall'uso dei giornali, per analogia con gli Stati americani, e non ha alcun valore giuridico.":
    "Конституция говорит о председателе областной джунты. Губернатор пришёл из газетного обихода, по аналогии с американскими штатами, и юридической силы не имеет.",
  "Chi approva le leggi regionali?": "Кто принимает областные законы?",
  "Il consiglio regionale": "Областной совет",
  "La giunta regionale": "Областная джунта",
  "Il prefetto": "Префект",
  "Il Parlamento nazionale": "Национальный парламент",
  "Il consiglio regionale legifera, la giunta governa. È la stessa distinzione che a livello nazionale corre fra Parlamento e governo.":
    "Областной совет законодательствует, джунта управляет. Это то же различие, что на общегосударственном уровне проходит между парламентом и правительством.",
  "Sopra quale soglia di abitanti l'elezione del sindaco prevede il ballottaggio?":
    "Начиная с какого числа жителей выборы мэра предусматривают второй тур?",
  "Cinquemila": "Пять тысяч",
  "Quindicimila": "Пятнадцать тысяч",
  "Quindicimila abitanti. Nei comuni più piccoli si vince al primo turno con la maggioranza relativa, senza secondo turno.":
    "Пятнадцать тысяч жителей. В коммунах поменьше побеждают в первом туре относительным большинством, без второго.",
  "Chi rappresenta il governo nazionale in ogni provincia?":
    "Кто представляет общегосударственное правительство в каждой провинции?",
  "Il presidente della provincia": "Председатель провинции",
  "Il questore": "Квестор, начальник полиции провинции",
  "Il sindaco del capoluogo": "Мэр административного центра",
  "Il prefetto, che dipende dal Ministero dell'interno. È lui a ricevere le domande di cittadinanza e a firmare gli accordi di integrazione: non è un organo eletto e non appartiene all'ente locale.":
    "Префект, который подчиняется министерству внутренних дел. Именно он принимает заявления о гражданстве и подписывает соглашения об интеграции: он не выборный орган и к местному самоуправлению не относится.",
  "Quale di queste materie resta di competenza esclusiva dello Stato?":
    "Какой из этих предметов остаётся в исключительном ведении государства?",
  "Il turismo": "Туризм",
  "L'agricoltura": "Сельское хозяйство",
  "L'immigrazione": "Иммиграция",
  "L'artigianato": "Ремёсла",
  "Immigrazione, difesa, moneta e giustizia sono fra le materie esclusive dello Stato. Turismo, agricoltura e artigianato ricadono invece nella competenza regionale.":
    "Иммиграция, оборона, деньги и правосудие — среди исключительных предметов государства. А туризм, сельское хозяйство и ремёсла попадают в ведение областей.",
  "A quale anno la tradizione assegna la fondazione di Roma?":
    "К какому году предание относит основание Рима?",
  "753 avanti Cristo": "753 год до нашей эры",
  "509 avanti Cristo": "509 год до нашей эры",
  "27 avanti Cristo": "27 год до нашей эры",
  "476 dopo Cristo": "476 год нашей эры",
  "Il 753 avanti Cristo, per convenzione degli storici antichi. Il 509 è la repubblica, il 27 l'inizio dell'impero e il 476 la sua fine in Occidente.":
    "753 год до нашей эры, по договорённости античных историков. 509-й — это республика, 27-й — начало империи, а 476-й — её конец на Западе.",
  "Chi depone l'ultimo imperatore romano d'Occidente?":
    "Кто низложил последнего западноримского императора?",
  "Attila": "Аттила",
  "Odoacre": "Одоакр",
  "Teodorico": "Теодорих",
  "Alarico": "Аларих",
  "Odoacre depone Romolo Augustolo nel 476. Teodorico governerà l'Italia poco dopo, e Attila e Alarico avevano guidato incursioni precedenti senza deporre nessuno.":
    "Одоакр низложил Ромула Августула в 476 году. Теодорих будет править Италией немного позже, а Аттила и Аларих водили набеги раньше, никого не низлагая.",
  "In quale anno i Longobardi entrano in Italia?": "В каком году лангобарды вошли в Италию?",
  "Nel 568": "В 568 году",
  "Nel 774": "В 774 году",
  "Nel 1130": "В 1130 году",
  "Nel 568. Si insediano al centro e al nord, e resteranno fino alla sconfitta contro Carlo Magno nel 774.":
    "В 568 году. Они осели в центре и на севере и останутся до поражения от Карла Великого в 774 году.",
  "Chi sconfigge i Longobardi nel 774?": "Кто победил лангобардов в 774 году?",
  "Costantino": "Константин",
  "Giustiniano": "Юстиниан",
  "Carlo Magno": "Карл Великий",
  "Federico Barbarossa": "Фридрих Барбаросса",
  "Carlo Magno prende Pavia e assume la corona longobarda. Le terre donate al papa consolidano il nucleo dello Stato della Chiesa.":
    "Карл Великий взял Павию и принял лангобардскую корону. Земли, подаренные папе, укрепили ядро Папского государства.",
  "Quali erano le quattro repubbliche marinare?": "Какими были четыре морские республики?",
  "Amalfi, Pisa, Genova e Venezia": "Амальфи, Пиза, Генуя и Венеция",
  "Napoli, Bari, Palermo e Messina": "Неаполь, Бари, Палермо и Мессина",
  "Milano, Firenze, Siena e Lucca": "Милан, Флоренция, Сиена и Лукка",
  "Ravenna, Rimini, Ancona e Trieste": "Равенна, Римини, Анкона и Триест",
  "Amalfi, Pisa, Genova e Venezia. Costruirono flotte, colonie e banche, e portarono in Italia la contabilità moderna e la lettera di cambio.":
    "Амальфи, Пиза, Генуя и Венеция. Они построили флоты, колонии и банки и принесли в Италию современную бухгалтерию и вексель.",
  "In quale anno la Lega Lombarda sconfigge Federico Barbarossa a Legnano?":
    "В каком году Ломбардская лига победила Фридриха Барбароссу при Леньяно?",
  "Nel 1176": "В 1176 году",
  "Nel 1183": "В 1183 году",
  "Nel 1250": "В 1250 году",
  "Nel 1176. La pace che ne consegue, quella di Costanza, è del 1183: la battaglia e il trattato sono due date distinte, a sette anni di distanza.":
    "В 1176 году. Последовавший мир, Констанцский, относится к 1183-му: битва и договор — две разные даты, между ними семь лет.",
  "Che cosa fondano i Normanni nel Sud nel 1130?": "Что основали норманны на юге в 1130 году?",
  "La Repubblica di Amalfi": "Республику Амальфи",
  "Il Regno di Sicilia, primo Stato accentrato d'Europa":
    "Сицилийское королевство, первое централизованное государство Европы",
  "Il Ducato di Benevento": "Беневентское герцогство",
  "Ruggero II unisce Sicilia e Italia meridionale in un regno con amministrazione centrale, catasto e burocrazia stabile, quando il resto d'Europa è ancora feudale.":
    "Рожер II объединил Сицилию и южную Италию в королевство с центральной администрацией, кадастром и постоянной бюрократией — когда остальная Европа была ещё феодальной.",
  "Qual è la più antica università del mondo occidentale ancora attiva?":
    "Какой самый старый действующий университет западного мира?",
  "Padova": "Падуя",
  "Salerno": "Салерно",
  "Bologna, dal 1088. Nasce come corporazione di studenti che assumono i propri maestri, e vi si studia soprattutto diritto.":
    "Болонья, с 1088 года. Он возник как корпорация студентов, которые нанимали себе учителей, и учили там прежде всего право.",
  "Che cosa succede ai Comuni nel corso del Trecento?":
    "Что происходит с городами-коммунами в XIV веке?",
  "Si uniscono in un regno del Nord": "Они объединяются в северное королевство",
  "Vengono riassorbiti dall'impero": "Их снова поглощает империя",
  "Le lotte fra fazioni li trasformano in signorie": "Борьба группировок превращает их в синьории",
  "Passano tutti sotto lo Stato della Chiesa": "Все они переходят под Папское государство",
  "Le istituzioni comunali si logorano nelle lotte interne, e in una città dopo l'altra una famiglia prende il potere in modo stabile. Le signorie diventeranno poi principati riconosciuti.":
    "Учреждения коммун изнашиваются во внутренней борьбе, и в городе за городом одна семья прочно берёт власть. Синьории потом станут признанными княжествами.",
  "Che cosa concede l'editto di Milano del 313?": "Что даёт Миланский эдикт 313 года?",
  "La cittadinanza a tutti gli abitanti dell'impero": "Гражданство всем жителям империи",
  "La libertà di culto ai cristiani": "Свободу вероисповедания христианам",
  "L'autonomia alle città della Padania": "Автономию городам Паданской равнины",
  "L'esenzione fiscale ai senatori": "Освобождение сенаторов от налогов",
  "Costantino pone fine alle persecuzioni. Per l'Italia significa l'inizio del ruolo di Roma come centro religioso, che le resterà anche quando avrà perso ogni altro potere.":
    "Константин кладёт конец гонениям. Для Италии это начало роли Рима как религиозного центра, которая останется за ним и когда он потеряет всякую другую власть.",
  "Che cosa significava in origine la parola università?":
    "Что первоначально значило слово «университет»?",
  "Universalità del sapere": "Всеобщность знания",
  "Corporazione": "Корпорация",
  "Edificio pubblico": "Общественное здание",
  "Biblioteca": "Библиотека",
  "Indicava una corporazione, come quelle degli artigiani. A Bologna erano gli studenti a riunirsi in corporazione e ad assumere i docenti: l'esatto contrario dell'organizzazione odierna.":
    "Оно означало корпорацию, как ремесленные цехи. В Болонье именно студенты собирались в корпорацию и нанимали преподавателей: полная противоположность нынешнему устройству.",
  "Quale eredità romana è ancora l'ossatura del codice civile italiano?":
    "Какое римское наследие до сих пор служит остовом итальянского гражданского кодекса?",
  "Il calendario": "Календарь",
  "Il diritto romano": "Римское право",
  "Le strade consolari": "Консульские дороги",
  "Il latino ecclesiastico": "Церковная латынь",
  "Il diritto romano, riscoperto e insegnato nelle università medievali, sta alla base del diritto civile di gran parte dell'Europa continentale.":
    "Римское право, заново открытое и преподаваемое в средневековых университетах, лежит в основе гражданского права большей части континентальной Европы.",
  "Da che cosa deriva storicamente il campanilismo italiano?":
    "Откуда исторически идёт итальянская привязанность к своей колокольне?",
  "Dalla rivalità fra le squadre di calcio": "Из соперничества футбольных клубов",
  "Da secoli in cui la città vicina era davvero un altro Stato":
    "Из веков, когда соседний город и правда был другим государством",
  "Dalle divisioni introdotte dal fascismo": "Из разделений, введённых фашизмом",
  "Dalla riforma delle regioni del 1970": "Из областной реформы 1970 года",
  "Decine di città indipendenti, ciascuna con leggi, monete e milizie proprie, a poche decine di chilometri l'una dall'altra. Il campanilismo è il residuo di quell'assetto, non un tratto caratteriale.":
    "Десятки независимых городов, у каждого свои законы, монеты и ополчение, в нескольких десятках километров друг от друга. Эта привязанность — остаток того устройства, а не черта характера.",
  "Chi era Lorenzo il Magnifico?": "Кем был Лоренцо Великолепный?",
  "Un banchiere che governava Firenze senza cariche formali":
    "Банкиром, который правил Флоренцией без формальных должностей",
  "Il duca di Milano": "Герцогом Милана",
  "Un papa del Rinascimento": "Папой эпохи Возрождения",
  "Il primo re di Napoli": "Первым королём Неаполя",
  "I Medici erano banchieri prima che signori: governavano comprando consenso, sposando alleanze e finanziando artisti, senza bisogno di un titolo.":
    "Медичи были банкирами раньше, чем синьорами: они правили, покупая согласие, женясь на союзах и оплачивая художников, и титул им был не нужен.",
  "In quale anno muore Lorenzo de' Medici?": "В каком году умер Лоренцо Медичи?",
  "Nel 1454": "В 1454 году",
  "Nel 1492": "В 1492 году",
  "Nel 1513": "В 1513 году",
  "Nel 1527": "В 1527 году",
  "Nel 1492, lo stesso anno del viaggio di Colombo. Due anni dopo Carlo VIII scende in Italia e l'equilibrio che Lorenzo aveva retto crolla.":
    "В 1492 году, в год плавания Колумба. Через два года Карл VIII спускается в Италию, и равновесие, которое держал Лоренцо, рушится.",
  "Chi scrive Il Principe, e in quale anno?": "Кто написал «Государя» и в каком году?",
  "Machiavelli, nel 1513": "Макиавелли, в 1513 году",
  "Guicciardini, nel 1540": "Гвиччардини, в 1540 году",
  "Castiglione, nel 1528": "Кастильоне, в 1528 году",
  "Machiavelli, nel 1492": "Макиавелли, в 1492 году",
  "Machiavelli lo scrive nel 1513, in esilio dopo il ritorno dei Medici a Firenze. È il primo libro che osserva il potere per come funziona invece che per come dovrebbe essere.":
    "Макиавелли написал её в 1513 году, в изгнании, после возвращения Медичи во Флоренцию. Это первая книга, которая смотрит на власть такой, какая она есть, а не какой должна быть.",
  "Che cos'è il sacco di Roma del 1527?": "Что такое разграбление Рима 1527 года?",
  "Un'incursione dei pirati saraceni": "Набег сарацинских пиратов",
  "Il saccheggio della città da parte dei lanzichenecchi imperiali":
    "Разграбление города имперскими ландскнехтами",
  "La presa di Roma da parte dei bersaglieri": "Взятие Рима берсальерами",
  "Un'epidemia di peste": "Эпидемия чумы",
  "Le truppe di Carlo V, rimaste senza paga, presero e devastarono la città per mesi. Gli storici usano questa data per segnare la fine del Rinascimento come stagione fiduciosa.":
    "Войска Карла V, оставшиеся без жалованья, взяли город и месяцами его разоряли. Историки этой датой отмечают конец Возрождения как времени уверенности.",
  "Quale pace chiude nel 1559 le guerre d'Italia?":
    "Какой мир закрыл в 1559 году Итальянские войны?",
  "La pace di Lodi": "Лодийский мир",
  "La pace di Costanza": "Констанцский мир",
  "La pace di Cateau-Cambrésis": "Като-Камбрезийский мир",
  "La pace di Westfalia": "Вестфальский мир",
  "Cateau-Cambrésis. Lodi era del 1454 e riguardava l'equilibrio interno; Costanza del 1183 e riguardava i Comuni; Westfalia del 1648 e riguardava la Germania.":
    "Като-Камбрезийский. Лодийский был в 1454 году и касался внутреннего равновесия; Констанцский — в 1183-м и касался коммун; Вестфальский — в 1648-м и касался Германии.",
  "Quale potenza domina l'Italia dopo il 1559?":
    "Какая держава господствует в Италии после 1559 года?",
  "L'Austria": "Австрия",
  "L'Impero ottomano": "Османская империя",
  "La Spagna, per circa un secolo e mezzo, prima di cedere il posto all'Austria nel Settecento. Milano, Napoli, Sicilia e Sardegna passano alla corona spagnola.":
    "Испания, около полутора веков, прежде чем уступить место Австрии в XVIII веке. Милан, Неаполь, Сицилия и Сардиния переходят к испанской короне.",
  "Quale istituzione diplomatica nasce nell'Italia dell'equilibrio di Lodi?":
    "Какое дипломатическое учреждение рождается в Италии времён Лодийского равновесия?",
  "Il congresso internazionale": "Международный конгресс",
  "L'ambasciata permanente": "Постоянное посольство",
  "Il tribunale arbitrale": "Третейский суд",
  "Il passaporto diplomatico": "Дипломатический паспорт",
  "Con cinque Stati che non possono prevalere l'uno sull'altro, la diplomazia sostituisce la guerra e nasce l'idea di tenere stabilmente un rappresentante presso l'altro. L'Europa adotterà la pratica per intera.":
    "Когда пять государств не могут одолеть друг друга, дипломатия заменяет войну и рождается мысль постоянно держать своего представителя у соседа. Европа переймёт эту практику целиком.",
  "Che cosa accade a Galileo nel 1633?": "Что произошло с Галилеем в 1633 году?",
  "Viene nominato matematico di corte": "Его назначили придворным математиком",
  "Pubblica il primo trattato sul telescopio": "Он издал первый трактат о телескопе",
  "È processato e costretto ad abiurare": "Его судили и заставили отречься",
  "Viene eletto all'Accademia della Crusca": "Его избрали в Accademia della Crusca",
  "Il processo lo costringe all'abiura e agli arresti domiciliari fino alla morte, per aver sostenuto che la Terra gira intorno al Sole.":
    "Процесс вынудил его отречься и до самой смерти держал под домашним арестом — за утверждение, что Земля вращается вокруг Солнца.",
  "In quale città nasce il melodramma, intorno al 1600?":
    "В каком городе около 1600 года рождается опера?",
  "A Firenze, dagli esperimenti di un gruppo di musicisti e letterati. Diventerà la forma teatrale d'Europa, e Venezia e Napoli ne saranno poi le capitali.":
    "Во Флоренции, из опытов кружка музыкантов и литераторов. Она станет театральной формой всей Европы, а её столицами потом будут Венеция и Неаполь.",
  "Quale potenza subentra alla Spagna in Italia nel Settecento?":
    "Какая держава сменила Испанию в Италии в XVIII веке?",
  "La Prussia": "Пруссия",
  "La Russia": "Россия",
  "L'Austria, che governerà la Lombardia e poi il Veneto fino al Risorgimento. È la potenza contro cui si combatteranno le guerre d'indipendenza.":
    "Австрия, которая будет править Ломбардией, а затем Венето до Рисорджименто. Именно против неё будут вестись войны за независимость.",
  "Perché i Medici poterono governare Firenze senza ricoprire cariche pubbliche?":
    "Почему Медичи смогли править Флоренцией, не занимая государственных должностей?",
  "Perché la legge fiorentina lo vietava ai nobili":
    "Потому что флорентийский закон запрещал это дворянам",
  "Perché il loro potere veniva dalla banca, dal credito e dalle alleanze":
    "Потому что их власть шла от банка, кредита и союзов",
  "Perché erano stati nominati dall'imperatore": "Потому что их назначил император",
  "Perché la città non aveva istituzioni": "Потому что у города не было учреждений",
  "Erano banchieri: prestavano a chi contava, finanziavano artisti e combinavano matrimoni. Le istituzioni repubblicane restavano in piedi, ma decidevano quello che i Medici volevano.":
    "Они были банкирами: давали в долг тем, кто был в силе, оплачивали художников и устраивали браки. Республиканские учреждения оставались на месте, но решали то, чего хотели Медичи.",
  "Quale famiglia governa Milano dopo i Visconti?": "Какая семья правит Миланом после Висконти?",
  "Gli Sforza": "Сфорца",
  "Gli Este": "Эсте",
  "I Gonzaga": "Гонзага",
  "I Della Rovere": "Делла Ровере",
  "Gli Sforza. Gli Este erano a Ferrara e i Gonzaga a Mantova: signorie diverse in città diverse, spesso confuse fra loro.":
    "Сфорца. Эсте были в Ферраре, а Гонзага в Мантуе: разные синьории в разных городах, которые часто путают.",
  "Perché il Rinascimento italiano coincide con la perdita dell'indipendenza politica?":
    "Почему итальянское Возрождение совпадает с потерей политической независимости?",
  "Perché gli artisti lavoravano per committenti stranieri":
    "Потому что художники работали на иностранных заказчиков",
  "Perché gli Stati italiani erano troppo piccoli per reggere l'urto degli Stati nazionali":
    "Потому что итальянские государства были слишком малы, чтобы выдержать натиск национальных государств",
  "Perché la cultura assorbiva le risorse militari":
    "Потому что культура поглощала военные средства",
  "Perché i papi impedivano l'unificazione": "Потому что папы мешали объединению",
  "Cinque Stati in equilibrio bastavano finché il confronto restava interno. Davanti a Francia e Spagna, capaci di schierare eserciti grandi, nessuno di essi poteva reggere da solo.":
    "Пяти государств в равновесии хватало, пока противостояние оставалось внутренним. Перед Францией и Испанией, способными выставить большие армии, ни одно из них не могло устоять в одиночку.",
  "Chi fonda la Giovine Italia?": "Кто основал «Молодую Италию»?",
  "Giuseppe Mazzini, dall'esilio. Voleva una repubblica unitaria fatta dal popolo, e passò la vita fuori dall'Italia che contribuì a creare.":
    "Джузеппе Мадзини, из изгнания. Он хотел единой республики, созданной народом, и прожил жизнь вне Италии, которую помог создать.",
  "In quale anno nasce la Giovine Italia?": "В каком году возникает «Молодая Италия»?",
  "Nel 1815": "В 1815 году",
  "Nel 1831": "В 1831 году",
  "Nel 1848": "В 1848 году",
  "Nel 1831, a Marsiglia. Le sue insurrezioni fallirono quasi tutte, ma formarono la generazione che avrebbe fatto l'Unità.":
    "В 1831 году, в Марселе. Её восстания почти все провалились, но воспитали поколение, которое сделает объединение.",
  "Che cosa stabilisce per l'Italia il congresso di Vienna?":
    "Что установил для Италии Венский конгресс?",
  "L'unificazione sotto i Savoia": "Объединение под Савойской династией",
  "Il ritorno dei sovrani cacciati da Napoleone": "Возвращение государей, изгнанных Наполеоном",
  "La creazione di una confederazione italiana": "Создание итальянской конфедерации",
  "L'indipendenza dello Stato della Chiesa dall'Austria":
    "Независимость Папского государства от Австрии",
  "La restaurazione: l'Austria in Lombardia e Veneto, i Borbone a Napoli, il papa a Roma, i Savoia in Piemonte. L'idea nazionale però resta in circolazione.":
    "Реставрацию: Австрия в Ломбардии и Венето, Бурбоны в Неаполе, папа в Риме, Савойская династия в Пьемонте. Но национальная идея остаётся в обращении.",
  "In quale anno viene concesso lo Statuto albertino?":
    "В каком году был дарован Альбертинский статут?",
  "Il 4 marzo 1848, nell'anno delle rivoluzioni europee. Resterà la costituzione dell'Italia unita per un secolo, fino al 1948.":
    "4 марта 1848 года, в год европейских революций. Он останется конституцией объединённой Италии на век, до 1948 года.",
  "Chi guida la spedizione dei Mille?": "Кто возглавил поход Тысячи?",
  "Giuseppe Garibaldi, con mille volontari partiti da Quarto. In pochi mesi conquistò un regno con un esercito assai più numeroso del suo.":
    "Джузеппе Гарибальди, с тысячей добровольцев, отплывших из Кварто. За несколько месяцев он завоевал королевство с армией куда более многочисленной, чем его собственная.",
  "Dove sbarcano i Mille nel maggio 1860?": "Где Тысяча высадилась в мае 1860 года?",
  "A Napoli": "В Неаполе",
  "A Marsala": "В Марсале",
  "A Messina": "В Мессине",
  "A Palermo": "В Палермо",
  "A Marsala, in Sicilia. Palermo cadde poche settimane dopo e Napoli entro l'autunno.":
    "В Марсале, на Сицилии. Палермо пал через несколько недель, а Неаполь к осени.",
  "Dove Garibaldi consegna a Vittorio Emanuele II il regno conquistato?":
    "Где Гарибальди передал Виктору Эммануилу II завоёванное королевство?",
  "A Teano": "В Теано",
  "A Torino": "В Турине",
  "A Gaeta": "В Гаэте",
  "L'incontro di Teano è uno dei gesti più discussi della storia italiana: un repubblicano che consegna un regno a un re, evitando una guerra fra italiani.":
    "Встреча в Теано — один из самых обсуждаемых поступков итальянской истории: республиканец передаёт королевство королю, избегая войны между итальянцами.",
  "In quale data viene proclamato il Regno d'Italia?":
    "В какой день провозгласили Королевство Италия?",
  "Il 4 marzo 1848": "4 марта 1848 года",
  "Il 17 marzo 1861": "17 марта 1861 года",
  "Il 20 settembre 1870": "20 сентября 1870 года",
  "Il 17 marzo 1861. Il 20 settembre 1870 è la presa di Roma e il 2 giugno 1946 la nascita della Repubblica: tre date che si confondono facilmente.":
    "17 марта 1861 года. 20 сентября 1870 года — это взятие Рима, а 2 июня 1946 года — рождение Республики: три даты, которые легко спутать.",
  "Quali furono, nell'ordine, le capitali del Regno d'Italia?":
    "Какими по порядку были столицы Королевства Италия?",
  "Roma, Torino, Firenze": "Рим, Турин, Флоренция",
  "Torino, Firenze, Roma": "Турин, Флоренция, Рим",
  "Milano, Torino, Roma": "Милан, Турин, Рим",
  "Torino, Milano, Roma": "Турин, Милан, Рим",
  "Torino fino al 1865, Firenze fino al 1871, poi Roma. Il nuovo Stato spostò il proprio centro tre volte in dieci anni.":
    "Турин до 1865 года, Флоренция до 1871-го, потом Рим. Новое государство переносило свой центр трижды за десять лет.",
  "Perché il primo re d'Italia si chiama Vittorio Emanuele II e non I?":
    "Почему первого короля Италии зовут Виктор Эммануил II, а не I?",
  "Perché il primo era stato suo padre": "Потому что первым был его отец",
  "Perché mantenne il numero che aveva come re di Sardegna":
    "Потому что он сохранил номер, который имел как король Сардинии",
  "Per un errore mai corretto negli atti ufficiali":
    "Из-за ошибки, которую так и не исправили в официальных актах",
  "Perché il numero I era riservato al re longobardo":
    "Потому что номер I был закреплён за лангобардским королём",
  "Conservò la numerazione sabauda invece di ripartire da uno. È un dettaglio che dice come l'Unità fu vissuta al Sud: un'annessione al Piemonte più che una fondazione comune.":
    "Он сохранил савойскую нумерацию вместо того, чтобы начать с единицы. Эта мелочь говорит, как объединение переживали на юге: скорее как присоединение к Пьемонту, чем как общее основание.",
  "Quante persone lasciarono l'Italia fra il 1861 e il 1970?":
    "Сколько людей покинуло Италию между 1861 и 1970 годами?",
  "Circa otto milioni": "Около восьми миллионов",
  "Circa ventisei milioni": "Около двадцати шести миллионов",
  "Circa quaranta milioni": "Около сорока миллионов",
  "Circa ventisei milioni, più della popolazione del paese al momento dell'Unità. È una delle emigrazioni più grandi della storia moderna.":
    "Около двадцати шести миллионов — больше, чем население страны на момент объединения. Это одна из самых больших эмиграций новой истории.",
  "Che cosa fu il brigantaggio postunitario?": "Чем было разбойничество после объединения?",
  "Un movimento di indipendenza siciliano": "Сицилийским движением за независимость",
  "Un fenomeno insieme criminale e di rivolta sociale nel Sud, represso duramente":
    "Явлением одновременно преступным и социальным бунтом на юге, жёстко подавленным",
  "La resistenza dell'esercito borbonico regolare": "Сопротивлением регулярной бурбонской армии",
  "Una rivolta contadina nel Nord contro le tasse austriache":
    "Крестьянским бунтом на севере против австрийских налогов",
  "L'annessione portò tasse nuove, leva obbligatoria e leggi pensate per il Nord. La repressione militare che ne seguì durò anni e lasciò una ferita da cui nasce la questione meridionale.":
    "Присоединение принесло новые налоги, обязательный призыв и законы, придуманные для севера. Последовавшее военное подавление длилось годами и оставило рану, из которой родился южный вопрос.",
  "In quale anno Roma diventa parte del Regno d'Italia?":
    "В каком году Рим стал частью Королевства Италия?",
  "Nel 1859": "В 1859 году",
  "Nel 1866": "В 1866 году",
  "Nel 1870": "В 1870 году",
  "Il 20 settembre 1870, attraverso la breccia di Porta Pia. Il 1866 aveva portato il Veneto e il 1859 la Lombardia.":
    "20 сентября 1870 года, через пролом у Порта-Пиа. 1866 год принёс Венето, а 1859-й — Ломбардию.",
  "Quale accordo segreto porta l'Italia in guerra nel 1915?":
    "Какое тайное соглашение привело Италию к войне в 1915 году?",
  "Il patto d'acciaio": "Стальной пакт",
  "Il patto di Londra": "Лондонский пакт",
  "La Triplice alleanza": "Тройственный союз",
  "L'asse Roma-Berlino": "Ось Рим — Берлин",
  "Il patto di Londra, firmato con Francia, Gran Bretagna e Russia mentre l'Italia era formalmente alleata degli imperi centrali. Il patto d'acciaio è del 1939, con la Germania.":
    "Лондонский пакт, подписанный с Францией, Великобританией и Россией, пока Италия формально была в союзе с центральными державами. Стальной пакт — это 1939 год, с Германией.",
  "Quanti furono all'incirca i morti italiani nella Prima guerra mondiale?":
    "Сколько примерно итальянцев погибло в Первой мировой войне?",
  "Trecentomila": "Триста тысяч",
  "Seicentomila": "Шестьсот тысяч",
  "Due milioni": "Два миллиона",
  "Circa seicentomila. La guerra si combatté per tre anni e mezzo in trincea sull'Isonzo, sul Carso e sulle Alpi.":
    "Около шестисот тысяч. Войну три с половиной года вели в окопах на Изонцо, на Карсте и в Альпах.",
  "Che cosa fu Caporetto?": "Чем было Капоретто?",
  "La battaglia finale vinta dall'Italia": "Последним сражением, выигранным Италией",
  "La rotta del 1917 che portò il fronte fino al Piave":
    "Разгромом 1917 года, отодвинувшим фронт до Пьяве",
  "Il trattato di pace del 1919": "Мирным договором 1919 года",
  "Il luogo della firma dell'armistizio": "Местом подписания перемирия",
  "L'offensiva austro-tedesca sfondò le linee e l'esercito arretrò di cento chilometri. Il nome è entrato nella lingua comune come sinonimo di disfatta.":
    "Австро-германское наступление прорвало линии, и армия отошла на сто километров. Название вошло в обиходный язык как синоним разгрома.",
  "Quale battaglia chiude per l'Italia la Prima guerra mondiale?":
    "Какое сражение закрыло для Италии Первую мировую войну?",
  "Caporetto": "Капоретто",
  "Il Piave": "Пьяве",
  "Vittorio Veneto": "Витторио-Венето",
  "Custoza": "Кустоца",
  "Vittorio Veneto, nell'ottobre-novembre 1918, seguita dall'armistizio di Villa Giusti. Custoza appartiene invece alle guerre d'indipendenza.":
    "Витторио-Венето, в октябре — ноябре 1918 года, за которым последовало перемирие в Вилла-Джусти. А Кустоца относится к войнам за независимость.",
  "In quale anno nascono i Fasci italiani di combattimento?":
    "В каком году возникли «Итальянские союзы борьбы»?",
  "Nel 1915": "В 1915 году",
  "Nel 1919": "В 1919 году",
  "Nel 1922": "В 1922 году",
  "Nel 1925": "В 1925 году",
  "Nel marzo 1919, a Milano. La marcia su Roma sarà tre anni dopo e le leggi fascistissime dal 1925.":
    "В марте 1919 года, в Милане. Поход на Рим будет через три года, а «сверхфашистские» законы — с 1925-го.",
  "Chi era Giacomo Matteotti?": "Кем был Джакомо Маттеотти?",
  "Il fondatore del Partito comunista": "Основателем Коммунистической партии",
  "Il deputato socialista rapito e ucciso nel 1924 dopo aver denunciato i brogli":
    "Депутатом-социалистом, похищенным и убитым в 1924 году после того, как он заявил о подлогах на выборах",
  "Il presidente del consiglio prima di Mussolini": "Председателем Совета министров до Муссолини",
  "Un generale della Grande guerra": "Генералом Первой мировой войны",
  "Aveva contestato in aula la validità delle elezioni. La sua morte aprì la crisi più grave del regime nascente, superata nel gennaio 1925 con l'assunzione pubblica di responsabilità da parte di Mussolini.":
    "Он оспорил в зале действительность выборов. Его смерть открыла самый тяжёлый кризис рождавшегося режима, преодолённый в январе 1925 года, когда Муссолини публично взял ответственность на себя.",
  "Che cosa furono le leggi fascistissime?": "Чем были «сверхфашистские» законы?",
  "Le leggi che estesero il voto alle donne": "Законами, которые дали женщинам право голоса",
  "I provvedimenti del 1925-26 che sciolsero i partiti e soppressero la stampa libera":
    "Мерами 1925–26 годов, которые распустили партии и уничтожили свободную печать",
  "Le leggi economiche del 1936": "Экономическими законами 1936 года",
  "I decreti di guerra del 1940": "Военными декретами 1940 года",
  "In due anni lo Stato liberale fu smontato con leggi ordinarie, senza che lo Statuto albertino fosse mai abrogato: la dimostrazione pratica di che cosa comporti una costituzione flessibile.":
    "За два года либеральное государство разобрали обычными законами, так и не отменив Альбертинский статут: наглядное доказательство того, чем оборачивается гибкая конституция.",
  "Che cosa stabiliscono i Patti Lateranensi del 1929?":
    "Что устанавливают Латеранские соглашения 1929 года?",
  "L'abolizione dell'insegnamento religioso": "Отмену религиозного образования",
  "La nascita dello Stato della Città del Vaticano e la fine della questione romana":
    "Рождение государства Ватикан и конец римского вопроса",
  "L'annessione dello Stato della Chiesa al Regno":
    "Присоединение Папского государства к Королевству",
  "La separazione fra Stato e Chiesa sul modello francese":
    "Отделение государства от церкви по французскому образцу",
  "L'accordo con la Santa Sede chiuse la questione aperta nel 1870 con la presa di Roma. I Patti sono stati rivisti nel 1984 e sono richiamati dalla Costituzione.":
    "Соглашение со Святым престолом закрыло вопрос, открытый в 1870 году взятием Рима. Соглашения были пересмотрены в 1984 году, и на них ссылается Конституция.",
  "Quale articolo della Costituzione richiama i Patti Lateranensi?":
    "Какая статья Конституции ссылается на Латеранские соглашения?",
  "L'articolo 7": "Статья 7",
  "L'articolo 19": "Статья 19",
  "L'articolo 7, sui rapporti fra Stato e Chiesa cattolica. L'articolo 19 garantisce invece la libertà religiosa a tutti, e fu scritto separatamente proprio per non confondere le due cose.":
    "Статья 7, об отношениях между государством и католической церковью. А статья 19 гарантирует свободу вероисповедания всем и была написана отдельно именно чтобы не смешивать эти две вещи.",
  "In quale anno furono emanate le leggi razziali?": "В каком году были изданы расовые законы?",
  "Nel 1929": "В 1929 году",
  "Nel 1935": "В 1935 году",
  "Nel 1938": "В 1938 году",
  "Nel 1943": "В 1943 году",
  "Nel 1938. Esclusero gli ebrei italiani da scuole, professioni e vita pubblica, preparando il terreno alle deportazioni che sarebbero cominciate dopo l'occupazione tedesca.":
    "В 1938 году. Они исключили итальянских евреев из школ, профессий и общественной жизни, подготовив почву для депортаций, которые начнутся после немецкой оккупации.",
  "Quando entra l'Italia nella Seconda guerra mondiale?":
    "Когда Италия вступила во Вторую мировую войну?",
  "Il 1º settembre 1939": "1 сентября 1939 года",
  "Il 10 giugno 1940": "10 июня 1940 года",
  "Il 25 luglio 1943": "25 июля 1943 года",
  "L'8 settembre 1943": "8 сентября 1943 года",
  "Il 10 giugno 1940, quando la Francia era quasi sconfitta e si pensava che la guerra sarebbe finita in poche settimane.":
    "10 июня 1940 года, когда Франция была почти разбита и считалось, что война кончится за несколько недель.",
  "Che cos'era la Repubblica sociale italiana?": "Чем была Итальянская социальная республика?",
  "Il governo del Sud alleato degli angloamericani":
    "Правительством юга, союзным англо-американцам",
  "Lo Stato installato al centro-nord sotto controllo tedesco dopo l'8 settembre":
    "Государством, устроенным в центре и на севере под немецким контролем после 8 сентября",
  "Il primo nome della Repubblica nata nel 1946":
    "Первым названием Республики, родившейся в 1946 году",
  "Un progetto costituzionale mai realizzato":
    "Конституционным проектом, который так и не осуществили",
  "Nacque dopo l'armistizio, con Mussolini liberato dai tedeschi. Fra il settembre 1943 e l'aprile 1945 esistono due Italie: il Regno del Sud e la Repubblica sociale al Nord.":
    "Она возникла после перемирия, когда немцы освободили Муссолини. Между сентябрём 1943-го и апрелем 1945 года существуют две Италии: Королевство на юге и Социальная республика на севере.",
  "Che cosa accade il 25 luglio 1943?": "Что произошло 25 июля 1943 года?",
  "Viene annunciato l'armistizio": "Объявили о перемирии",
  "Il Gran consiglio mette Mussolini in minoranza e il re lo fa arrestare":
    "Большой совет оставил Муссолини в меньшинстве, и король велел его арестовать",
  "Gli Alleati sbarcano in Sicilia": "Союзники высадились на Сицилии",
  "Roma viene liberata": "Рим был освобождён",
  "L'arresto è del 25 luglio, l'armistizio dell'8 settembre. Fra le due date passano sei settimane in cui il paese resta in guerra senza sapere da che parte.":
    "Арест — это 25 июля, перемирие — 8 сентября. Между двумя датами проходит шесть недель, в которые страна остаётся в войне, не зная, на чьей стороне.",
  "Con quale percentuale approssimativa vinse la repubblica nel referendum del 1946?":
    "С каким примерно процентом победила республика на референдуме 1946 года?",
  "Circa il 45 per cento": "Около 45 процентов",
  "Circa il 54 per cento": "Около 54 процентов",
  "Circa il 75 per cento": "Около 75 процентов",
  "Circa il 90 per cento": "Около 90 процентов",
  "Poco più della metà, con un Nord largamente repubblicano e un Sud in maggioranza monarchico. Il risultato fu contestato per settimane, e la differenza stretta spiega perché.":
    "Чуть больше половины, при том что север был в основном за республику, а юг большинством за монархию. Результат оспаривали неделями, и узкий разрыв объясняет почему.",
  "Che cos'era il Comitato di liberazione nazionale?":
    "Чем был Комитет национального освобождения?",
  "Il governo del Regno del Sud": "Правительством Королевства на юге",
  "L'organismo che coordinava le forze della Resistenza":
    "Органом, который согласовывал силы Сопротивления",
  "Il comando alleato in Italia": "Союзным командованием в Италии",
  "L'assemblea che scrisse la Costituzione": "Собранием, которое написало Конституцию",
  "Vi sedevano insieme comunisti, socialisti, democratici cristiani, liberali e azionisti. Quelle stesse forze si sarebbero combattute per decenni, ma in quel momento scrivevano insieme.":
    "В нём вместе сидели коммунисты, социалисты, христианские демократы, либералы и члены Партии действия. Те же силы будут воевать друг с другом десятилетиями, но в тот момент писали сообща.",
  "Chi fu l'ultimo re d'Italia?": "Кто был последним королём Италии?",
  "Vittorio Emanuele III": "Виктор Эммануил III",
  "Carlo Alberto": "Карл Альберт",
  "Umberto II, che regnò poco più di un mese e lasciò il paese dopo il referendum. Vittorio Emanuele III, suo padre, aveva abdicato in suo favore poche settimane prima.":
    "Умберто II, который правил чуть больше месяца и покинул страну после референдума. Виктор Эммануил III, его отец, отрёкся в его пользу за несколько недель до этого.",
  "Quando si tennero le prime elezioni politiche della Repubblica?":
    "Когда прошли первые парламентские выборы Республики?",
  "Il 18 aprile 1948, in un clima segnato dall'inizio della guerra fredda. Il 2 giugno 1946 si era votato per la forma dello Stato e per l'Assemblea costituente.":
    "18 апреля 1948 года, в обстановке начавшейся холодной войны. 2 июня 1946 года голосовали о форме государства и об Учредительном собрании.",
  "Quale piano finanziò la ricostruzione postbellica?":
    "Какой план финансировал послевоенное восстановление?",
  "Il piano Marshall": "План Маршалла",
  "Il piano Schuman": "План Шумана",
  "Il piano Beveridge": "План Бевериджа",
  "Il piano Vanoni": "План Ванони",
  "Gli aiuti americani del piano Marshall. Il piano Schuman riguardava invece il carbone e l'acciaio, e da esso nascerà la prima comunità europea.":
    "Американская помощь по плану Маршалла. А план Шумана касался угля и стали, и из него родится первое европейское сообщество.",
  "Quali città formavano il triangolo industriale del boom?":
    "Какие города образовывали промышленный треугольник времён бума?",
  "Roma, Napoli e Bari": "Рим, Неаполь и Бари",
  "Torino, Milano e Genova": "Турин, Милан и Генуя",
  "Milano, Bologna e Firenze": "Милан, Болонья и Флоренция",
  "Venezia, Trieste e Padova": "Венеция, Триест и Падуя",
  "Torino, Milano e Genova. Verso quelle fabbriche si mossero milioni di persone dal Sud e dal Nordest: la più grande migrazione interna della storia italiana.":
    "Турин, Милан и Генуя. К этим заводам двинулись миллионы людей с юга и северо-востока: крупнейшее внутреннее переселение в истории Италии.",
  "In quale anno l'Italia firma i trattati che istituiscono la Comunità economica europea?":
    "В каком году Италия подписала договоры, учреждающие Европейское экономическое сообщество?",
  "Nel 1951": "В 1951 году",
  "Nel 1992": "В 1992 году",
  "Il 25 marzo 1957, in Campidoglio. L'Italia non aderisce all'Europa comunitaria: la fonda, e lo fa nella propria capitale.":
    "25 марта 1957 года, на Капитолии. Италия не присоединяется к общей Европе: она её основывает, и делает это в собственной столице.",
  "Quanti giorni durò il sequestro di Aldo Moro?": "Сколько дней длилось похищение Альдо Моро?",
  "Trentatré": "Тридцать три",
  "Novanta": "Девяносто",
  "Cinquantacinque giorni, dal 16 marzo al 9 maggio 1978. Nel rapimento in via Fani furono uccisi i cinque uomini della scorta.":
    "Пятьдесят пять дней, с 16 марта по 9 мая 1978 года. При нападении на улице Фани убили пятерых охранников.",
  "Quante vittime causò la bomba alla stazione di Bologna nel 1980?":
    "Сколько жертв унёс взрыв на вокзале Болоньи в 1980 году?",
  "Diciassette": "Семнадцать",
  "Quarantatré": "Сорок три",
  "Ottantacinque": "Восемьдесят пять",
  "Centoventi": "Сто двадцать",
  "Ottantacinque: è la strage più grave dell'Italia repubblicana. L'orologio della stazione è fermo sull'ora dell'esplosione.":
    "Восемьдесят пять: это самая тяжёлая бойня республиканской Италии. Вокзальные часы стоят на времени взрыва.",
  "Chi erano Giovanni Falcone e Paolo Borsellino?":
    "Кем были Джованни Фальконе и Паоло Борселлино?",
  "Due parlamentari dell'Assemblea costituente": "Двумя депутатами Учредительного собрания",
  "I giudici antimafia uccisi nelle stragi del 1992":
    "Судьями по делам мафии, убитыми в терактах 1992 года",
  "I fondatori del Partito d'azione": "Основателями Партии действия",
  "Due giornalisti dell'inchiesta Mani pulite": "Двумя журналистами расследования «Чистые руки»",
  "Uccisi a pochi mesi di distanza nelle stragi di Capaci e di via d'Amelio, nello stesso anno in cui Mani pulite faceva crollare il sistema dei partiti.":
    "Их убили с разницей в несколько месяцев в терактах в Капачи и на улице д'Амелио — в тот самый год, когда «Чистые руки» обрушивали партийную систему.",
  "Che cosa indica l'espressione Prima Repubblica?":
    "Что обозначает выражение «Первая республика»?",
  "La repubblica proclamata da Mazzini a Roma nel 1849":
    "Республику, провозглашённую Мадзини в Риме в 1849 году",
  "La stagione del sistema dei partiti dal dopoguerra al 1992-94":
    "Эпоху партийной системы от послевоенных лет до 1992–94 годов",
  "Il periodo fra il 1946 e il 1948": "Период между 1946 и 1948 годами",
  "Lo Stato nato dalla Resistenza al Nord": "Государство, рождённое Сопротивлением на севере",
  "Non è una categoria giuridica: la Costituzione è la stessa dal 1948. Indica la stagione dei partiti nati dalla Resistenza, chiusa dal biennio di Mani pulite.":
    "Это не юридическая категория: Конституция та же с 1948 года. Так называют эпоху партий, рождённых Сопротивлением, которую закрыло двухлетие «Чистых рук».",
  "In quale anno arrivano le banconote in euro?": "В каком году появились банкноты евро?",
  "Nel 1999": "В 1999 году",
  "Nel 2002": "В 2002 году",
  "Nel 2004": "В 2004 году",
  "Le banconote e le monete circolano dal 1º gennaio 2002; dal 1999 l'euro esisteva già come moneta di conto. La lira era nata con il Regno d'Italia nel 1862.":
    "Банкноты и монеты ходят с 1 января 2002 года; с 1999-го евро уже существовало как расчётная единица. Лира родилась вместе с Королевством Италия в 1862 году.",
  "Che cosa portò lo Statuto dei lavoratori del 1970?": "Что принёс Статут трудящихся 1970 года?",
  "Le libertà costituzionali dentro i luoghi di lavoro":
    "Конституционные свободы внутрь рабочих мест",
  "L'istituzione del salario minimo": "Введение минимальной зарплаты",
  "La settimana di trentacinque ore": "Тридцатипятичасовую неделю",
  "L'obbligo di iscrizione al sindacato": "Обязанность вступать в профсоюз",
  "La legge 300 portò in fabbrica le libertà che la Costituzione garantiva fuori, e vietò il licenziamento senza giusta causa nelle imprese maggiori. Nello stesso anno nacquero le regioni a statuto ordinario.":
    "Закон 300 принёс на завод свободы, которые Конституция гарантировала снаружи, и запретил увольнение без уважительной причины на крупных предприятиях. В том же году появились области с обычным статутом.",
  "Quale catena montuosa percorre l'Italia da nord a sud?":
    "Какая горная цепь проходит через Италию с севера на юг?",
  "Le Alpi": "Альпы",
  "Gli Appennini": "Апеннины",
  "I Pirenei": "Пиренеи",
  "Gli Appennini corrono per l'intera penisola e proseguono in Sicilia. Le Alpi chiudono soltanto il lato settentrionale, e le Dolomiti ne sono una parte.":
    "Апеннины идут через весь полуостров и продолжаются на Сицилии. Альпы закрывают только северную сторону, а Доломиты — их часть.",
  "Qual è l'unica grande pianura italiana?": "Какая единственная большая равнина в Италии?",
  "Il Tavoliere delle Puglie": "Тавольере-делле-Пулье",
  "La pianura padana": "Паданская равнина",
  "La Maremma": "Маремма",
  "La piana di Catania": "Катанская равнина",
  "La pianura padana, attraversata dal Po. Le altre citate sono pianure reali ma molto più piccole: in Italia la pianura copre poco più di un quinto del territorio.":
    "Паданская равнина, через которую течёт По. Остальные названные — настоящие равнины, но куда меньше: в Италии равнина покрывает чуть больше пятой части территории.",
  "Con quali Stati confina l'Italia via terra?": "С какими государствами Италия граничит по суше?",
  "Francia, Svizzera, Austria e Slovenia": "Франция, Швейцария, Австрия и Словения",
  "Francia, Germania, Austria e Croazia": "Франция, Германия, Австрия и Хорватия",
  "Francia, Svizzera, Germania e Slovenia": "Франция, Швейцария, Германия и Словения",
  "Svizzera, Austria, Ungheria e Croazia": "Швейцария, Австрия, Венгрия и Хорватия",
  "Quattro Stati lungo l'arco alpino. La Germania non tocca l'Italia, e la Croazia le sta di fronte sull'Adriatico ma non confina.":
    "Четыре государства вдоль альпийской дуги. Германия Италии не касается, а Хорватия лежит напротив через Адриатику, но не граничит.",
  "Qual è il vulcano attivo più grande d'Europa?":
    "Какой самый большой действующий вулкан Европы?",
  "Il Vesuvio": "Везувий",
  "Lo Stromboli": "Стромболи",
  "L'Etna": "Этна",
  "I Campi Flegrei": "Флегрейские поля",
  "L'Etna, in Sicilia, che erutta più volte l'anno. Il Vesuvio è più piccolo ma più pericoloso, perché sovrasta un'area densamente abitata.":
    "Этна, на Сицилии, которая извергается по нескольку раз в год. Везувий меньше, но опаснее, потому что нависает над густонаселённой местностью.",
  "Quale regione italiana non è sostanzialmente sismica?":
    "Какая итальянская область по сути не сейсмична?",
  "La Calabria": "Калабрия",
  "L'Umbria": "Умбрия",
  "La Sardegna": "Сардиния",
  "Il Friuli Venezia Giulia": "Фриули-Венеция-Джулия",
  "La Sardegna, che sta su una porzione di crosta stabile. Calabria, Umbria e Friuli hanno invece subito terremoti distruttivi in tempi recenti.":
    "Сардиния, которая стоит на устойчивом куске коры. А Калабрия, Умбрия и Фриули в недавнее время пережили разрушительные землетрясения.",
  "Qual è la più grande isola del Mediterraneo?": "Какой самый большой остров Средиземного моря?",
  "Cipro": "Кипр",
  "Creta": "Крит",
  "La Sicilia, seguita dalla Sardegna. Cipro e Creta sono più piccole di entrambe.":
    "Сицилия, за ней Сардиния. Кипр и Крит меньше их обеих.",
  "Quale montagna è la vetta più alta della catena alpina?":
    "Какая гора — высшая точка альпийской цепи?",
  "Il Monte Rosa": "Монте-Роза",
  "Il Gran Paradiso": "Гран-Парадизо",
  "Il Cervino": "Маттерхорн",
  "Il Monte Bianco": "Монблан",
  "Il Monte Bianco, 4.808 metri. La sovranità della cima è oggetto di una controversia mai risolta con la Francia: le carte dei due paesi non coincidono.":
    "Монблан, 4808 метров. Суверенитет над вершиной — предмет так и не решённого спора с Францией: карты двух стран не совпадают.",
  "Quanto misura all'incirca lo sviluppo costiero italiano?":
    "Какова примерно протяжённость итальянского побережья?",
  "Mille chilometri": "Тысяча километров",
  "Tremila chilometri": "Три тысячи километров",
  "Settemilacinquecento chilometri": "Семь с половиной тысяч километров",
  "Quindicimila chilometri": "Пятнадцать тысяч километров",
  "Circa settemilacinquecento chilometri fra penisola e isole. Nessun punto del paese è lontanissimo dal mare, e questo ha segnato cucina, commercio e storia.":
    "Около семи с половиной тысяч километров, считая полуостров и острова. Ни одна точка страны не лежит очень далеко от моря, и это отметило кухню, торговлю и историю.",
  "Che cosa sono i Campi Flegrei?": "Что такое Флегрейские поля?",
  "Una pianura agricola della Campania": "Сельскохозяйственная равнина в Кампании",
  "Una vasta caldera vulcanica a ovest di Napoli":
    "Обширная вулканическая кальдера к западу от Неаполя",
  "Un parco nazionale dell'Appennino": "Национальный парк в Апеннинах",
  "Un antico sito greco in Calabria": "Древнегреческое городище в Калабрии",
  "Una caldera, cioè un'ampia depressione vulcanica, densamente abitata. È sorvegliata di continuo perché il suolo si solleva e si abbassa nel fenomeno chiamato bradisismo.":
    "Кальдера, то есть широкая вулканическая впадина, густо заселённая. За ней постоянно следят, потому что почва поднимается и опускается — это явление называют брадисейсмом.",
  "Quale città è stata sepolta dall'eruzione del Vesuvio insieme a Pompei?":
    "Какой город был погребён извержением Везувия вместе с Помпеями?",
  "Cuma": "Кумы",
  "Ercolano": "Геркуланум",
  "Capua": "Капуя",
  "Benevento": "Беневенто",
  "Ercolano, insieme a Stabia. Furono coperte da materiali diversi, e per questo a Ercolano si sono conservati anche il legno e i papiri.":
    "Геркуланум, вместе со Стабиями. Их накрыло разным материалом, и поэтому в Геркулануме сохранились даже дерево и папирусы.",
  "Perché in Italia si coltiva spesso a terrazze?":
    "Почему в Италии часто возделывают землю террасами?",
  "Per ragioni estetiche legate al paesaggio":
    "По эстетическим соображениям, связанным с ландшафтом",
  "Perché la pianura è scarsa e gran parte del territorio è collinare o montuoso":
    "Потому что равнины мало, и большая часть территории холмистая или горная",
  "Perché lo impone la normativa europea": "Потому что этого требуют европейские нормы",
  "Per proteggere le colture dal vento marino": "Чтобы защитить посевы от морского ветра",
  "La pianura copre poco più di un quinto del paese. Terrazzare i pendii è il modo con cui generazioni di agricoltori hanno reso coltivabile ciò che altrimenti non lo era.":
    "Равнина покрывает чуть больше пятой части страны. Террасировать склоны — способ, которым поколения крестьян сделали пригодным для земледелия то, что иначе им не было.",
  "Quale di questi è uno Stato indipendente sull'Appennino romagnolo?":
    "Что из этого — независимое государство в романьольских Апеннинах?",
  "Il Principato di Seborga": "Княжество Себорга",
  "La Repubblica di San Marino": "Республика Сан-Марино",
  "Il Vaticano": "Ватикан",
  "Campione d'Italia": "Кампионе-д'Италия",
  "San Marino, che si dice la più antica repubblica ancora esistente. Il Vaticano è a Roma, e Campione d'Italia è invece un comune italiano circondato dalla Svizzera.":
    "Сан-Марино, которую называют старейшей из ныне существующих республик. Ватикан — в Риме, а Кампионе-д'Италия — итальянская коммуна, окружённая Швейцарией.",
  "Perché il clima italiano non può essere descritto come uno solo?":
    "Почему итальянский климат нельзя описать как один?",
  "Perché il paese si estende per oltre mille chilometri in latitudine e ha rilievi molto diversi":
    "Потому что страна тянется больше чем на тысячу километров по широте и рельеф у неё очень разный",
  "Perché le regioni misurano le temperature con metodi diversi":
    "Потому что области меряют температуру разными способами",
  "Perché il Mediterraneo cambia temperatura ogni anno":
    "Потому что Средиземное море каждый год меняет температуру",
  "Perché le Alpi bloccano ogni corrente atlantica":
    "Потому что Альпы преграждают всякое атлантическое течение",
  "Fra Bolzano e Lampedusa corrono più di dieci gradi di temperatura media annua. Le Alpi hanno clima alpino, la pianura padana estati afose e nebbie, le coste clima mediterraneo.":
    "Между Больцано и Лампедузой больше десяти градусов разницы в средней годовой температуре. В Альпах альпийский климат, на Паданской равнине душное лето и туманы, на побережьях средиземноморский климат.",
  "Quale città è il principale centro economico e finanziario italiano?":
    "Какой город — главный экономический и финансовый центр Италии?",
  "Milano, sede della borsa e della gran parte dei servizi finanziari. Roma è la capitale politica e amministrativa, Torino il centro industriale storico.":
    "Милан, где находится биржа и большая часть финансовых услуг. Рим — политическая и административная столица, Турин — исторический промышленный центр.",
  "Perché l'Italia non ha una sola città che concentri tutto, come Parigi o Londra?":
    "Почему в Италии нет одного города, где сосредоточено всё, как Париж или Лондон?",
  "Perché la Costituzione lo vieta": "Потому что Конституция это запрещает",
  "Perché per quattordici secoli ogni città è stata capitale di qualcosa":
    "Потому что четырнадцать веков каждый город был столицей чего-нибудь",
  "Perché le distanze sono troppo grandi": "Потому что расстояния слишком велики",
  "Perché la capitale è stata scelta solo nel 1946":
    "Потому что столицу выбрали только в 1946 году",
  "Senza uno Stato unico, ogni città ha avuto il proprio palazzo di governo, il proprio teatro e la propria università, e li ha conservati. Il policentrismo italiano è un'eredità storica, non una scelta amministrativa.":
    "Без единого государства у каждого города был свой дворец правительства, свой театр и свой университет, и он их сохранил. Итальянская многоцентровость — историческое наследие, а не административный выбор.",
  "Che cosa si trova ad Agrigento, in Sicilia?": "Что находится в Агридженто на Сицилии?",
  "Il sito di Ercolano": "Городище Геркуланума",
  "La Reggia di Caserta": "Дворец в Казерте",
  "Il Foro romano": "Римский форум",
  "La Valle dei Templi, con templi greci del quinto secolo avanti Cristo. La Sicilia fu Magna Grecia prima di essere romana, e in molti punti si vede.":
    "Долина храмов, с греческими храмами V века до нашей эры. Сицилия была Великой Грецией прежде, чем стать римской, и во многих местах это видно.",
  "Quale sito italiano è iscritto nella lista UNESCO come patrimonio naturale e non culturale?":
    "Какой итальянский объект внесён в список ЮНЕСКО как природное, а не культурное наследие?",
  "Il centro storico di Siena": "Исторический центр Сиены",
  "La laguna di Venezia": "Венецианская лагуна",
  "Le Dolomiti sono iscritte per il loro valore paesaggistico e geologico. Venezia e la sua laguna sono invece un sito culturale, che comprende anche l'ambiente in cui la città sta.":
    "Доломиты внесены за ландшафтную и геологическую ценность. А Венеция с лагуной — культурный объект, в который входит и среда, где город стоит.",
  "Che cosa significa che un intero centro storico è iscritto come un solo sito?":
    "Что значит, что весь исторический центр внесён как один объект?",
  "Che ogni edificio è di proprietà pubblica": "Что каждое здание в государственной собственности",
  "Che il riconoscimento riguarda il complesso urbano, non i singoli monumenti":
    "Что признание касается городского целого, а не отдельных памятников",
  "Che nessun edificio può essere modificato": "Что ни одно здание нельзя менять",
  "Che il sito è chiuso ai residenti": "Что объект закрыт для жителей",
  "Roma, Firenze, Venezia, Napoli, Siena, Urbino e Ferrara sono iscritte così: conta il tessuto della città, non l'elenco dei suoi monumenti presi uno per uno.":
    "Рим, Флоренция, Венеция, Неаполь, Сиена, Урбино и Феррара внесены именно так: считается ткань города, а не список его памятников поодиночке.",
  "Quale città italiana è costruita su una laguna?": "Какой итальянский город построен на лагуне?",
  "Genova": "Генуя",
  "Trieste": "Триест",
  "Ravenna": "Равенна",
  "Venezia, su un arcipelago di isolette in una laguna. La città e la laguna insieme formano un unico sito del patrimonio mondiale.":
    "Венеция, на архипелаге островков в лагуне. Город и лагуна вместе образуют единый объект всемирного наследия.",
  "Che cosa si intende per aree interne?": "Что понимают под внутренними территориями?",
  "I quartieri centrali delle grandi città": "Центральные кварталы больших городов",
  "I territori lontani dai servizi, spesso appenninici, che si stanno spopolando":
    "Территории, далёкие от услуг, чаще апеннинские, которые пустеют",
  "Le zone industriali del Nord": "Промышленные зоны севера",
  "Le regioni senza sbocco sul mare": "Области без выхода к морю",
  "Paesi distanti da scuole, ospedali e stazioni, dove la popolazione cala e i servizi chiudono. Sono l'esatto rovescio dell'affollamento turistico, e spesso stanno a poche decine di chilometri da esso.":
    "Посёлки далеко от школ, больниц и станций, где население убывает, а услуги закрываются. Это полная противоположность туристической тесноте, и часто они лежат в нескольких десятках километров от неё.",
  "Quale problema colpisce i centri storici di Venezia e Firenze?":
    "Какая беда бьёт по историческим центрам Венеции и Флоренции?",
  "L'abbandono da parte dei turisti": "Туристы их покидают",
  "La diminuzione dei residenti mentre crescono gli affitti brevi":
    "Жителей становится меньше, а краткосрочной аренды больше",
  "La mancanza di collegamenti ferroviari": "Не хватает железнодорожного сообщения",
  "Il divieto di ristrutturare gli edifici": "Запрет на перестройку зданий",
  "In alcune giornate i visitatori superano gli abitanti, e chi vive in centro se ne va perché le case diventano alloggi turistici. È il rovescio del successo, e le due città lo affrontano con misure diverse.":
    "В иные дни приезжих больше, чем жителей, и те, кто живёт в центре, уезжают, потому что дома превращаются в туристическое жильё. Это обратная сторона успеха, и два города встречают её разными мерами.",
  "Quale città è considerata la capitale del Mezzogiorno?":
    "Какой город считают столицей юга Италии?",
  "Bari": "Бари",
  "Palermo": "Палермо",
  "Catania": "Катания",
  "Napoli, capitale di un regno per secoli e oggi la maggiore città del Sud. Palermo è la capitale della Sicilia e Bari il principale porto adriatico meridionale.":
    "Неаполь, веками столица королевства и сегодня самый большой город юга. Палермо — столица Сицилии, а Бари — главный южный адриатический порт.",
  "Che cosa può essere iscritto nella lista UNESCO oltre a monumenti e paesaggi?":
    "Что можно внести в список ЮНЕСКО кроме памятников и ландшафтов?",
  "Nulla: la lista comprende solo beni materiali":
    "Ничего: список включает только материальные объекты",
  "Anche pratiche immateriali, come un'arte o un saper fare":
    "Также нематериальные практики, например искусство или умение",
  "Solo edifici anteriori al Settecento": "Только здания старше XVIII века",
  "Solo siti di proprietà statale": "Только объекты в государственной собственности",
  "Esiste una lista del patrimonio culturale immateriale, in cui l'Italia è presente fra l'altro con l'arte del pizzaiuolo napoletano. Non tutto ciò che si tutela è fatto di pietra.":
    "Существует список нематериального культурного наследия, где Италия представлена, среди прочего, искусством неаполитанского пиццайоло. Не всё, что охраняют, сделано из камня.",
  "Quale città fu il centro industriale storico dell'Italia?":
    "Какой город был историческим промышленным центром Италии?",
  "Verona": "Верона",
  "Torino, attorno all'automobile. Insieme a Milano e Genova formava il triangolo industriale verso cui si mosse la migrazione interna del dopoguerra.":
    "Турин, вокруг автомобиля. Вместе с Миланом и Генуей он образовывал промышленный треугольник, к которому шло послевоенное внутреннее переселение.",
  "In quale città si trova il porto di Roma dell'età antica?":
    "В каком городе находится порт Рима античной эпохи?",
  "A Civitavecchia": "В Чивитавеккье",
  "A Ostia": "В Остии",
  "Ad Anzio": "В Анцио",
  "Ostia antica, alla foce del Tevere. Non fu sepolta da un'eruzione ma abbandonata lentamente, e per questo si è conservata in modo diverso da Pompei.":
    "Древняя Остия, в устье Тибра. Её не погребло извержение, её медленно покинули, и поэтому сохранилась она иначе, чем Помпеи.",
  "Che cos'è il patrimonio diffuso italiano?": "Что такое рассеянное итальянское наследие?",
  "L'insieme dei musei statali": "Совокупность государственных музеев",
  "Le migliaia di piccoli centri storici che nessuna lista riesce a contenere":
    "Тысячи маленьких исторических центров, которые не вмещает ни один список",
  "Il fondo per il restauro delle chiese": "Фонд реставрации церквей",
  "L'archivio digitale dei beni culturali": "Цифровой архив культурных ценностей",
  "Accanto ai siti iscritti c'è un patrimonio distribuito in migliaia di borghi, pievi e centri minori. È una delle ragioni per cui in Italia il paesaggio culturale non si esaurisce nelle città d'arte.":
    "Рядом с внесёнными объектами есть наследие, рассыпанное по тысячам посёлков, сельских приходов и малых центров. Это одна из причин, по которой в Италии культурный ландшафт не исчерпывается городами искусства.",
  "Dove si concentra il distretto italiano dell'occhialeria?":
    "Где сосредоточен итальянский очковый округ?",
  "Nel Bellunese": "В окрестностях Беллуно",
  "Nel Salento": "В Саленто",
  "In Brianza": "В Брианце",
  "Nella Valle d'Aosta": "В Валле-д'Аоста",
  "Nel Bellunese, in Veneto: una valle alpina che produce una quota rilevante degli occhiali venduti nel mondo. È l'esempio più citato di distretto.":
    "В окрестностях Беллуно, в Венето: альпийская долина, которая делает заметную долю продаваемых в мире очков. Это самый цитируемый пример округа.",
  "Quale distretto industriale ha sede a Sassuolo?":
    "Какой промышленный округ находится в Сассуоло?",
  "La meccanica di precisione": "Точная механика",
  "La ceramica e le piastrelle": "Керамика и плитка",
  "Le calzature": "Обувь",
  "Gli elettrodomestici": "Бытовая техника",
  "La ceramica, nata attorno all'argilla locale ed esportata ovunque. Le calzature stanno soprattutto nelle Marche e in Veneto.":
    "Керамика, выросшая вокруг местной глины и вывозимая повсюду. Обувь делают прежде всего в Марке и Венето.",
  "Da quale tipo di imprese è composta soprattutto l'economia italiana?":
    "Из каких предприятий главным образом состоит итальянская экономика?",
  "Da grandi gruppi industriali": "Из больших промышленных групп",
  "Da piccole e medie imprese": "Из малых и средних предприятий",
  "Da imprese pubbliche": "Из государственных предприятий",
  "Da multinazionali estere": "Из иностранных транснациональных компаний",
  "L'Italia ha pochissimi gruppi molto grandi e moltissime imprese piccole, spesso familiari. Messe insieme per territorio, funzionano come una grande azienda distribuita.":
    "В Италии очень мало очень крупных групп и очень много мелких предприятий, часто семейных. Собранные вместе по местности, они работают как одна большая рассредоточенная фирма.",
  "Quale settore italiano esporta di più fra questi?":
    "Какая итальянская отрасль из этих вывозит больше всего?",
  "La meccanica": "Машиностроение",
  "L'editoria": "Издательское дело",
  "La cantieristica navale da diporto": "Строительство прогулочных судов",
  "L'industria mineraria": "Горнодобывающая промышленность",
  "La meccanica, in particolare le macchine per il confezionamento e l'automazione, concentrate lungo la via Emilia. È la A di automazione fra le quattro dell'export.":
    "Машиностроение, особенно упаковочные машины и автоматика, сосредоточенные вдоль Эмилиевой дороги. Это та самая «А» — автоматика — из четырёх букв экспорта.",
  "Che cosa indica il divario Nord-Sud?": "Что обозначает разрыв между Севером и Югом?",
  "La differenza di clima fra le due parti del paese":
    "Разницу климата между двумя частями страны",
  "La differenza di reddito, occupazione e servizi fra Mezzogiorno e Centro-Nord":
    "Разницу в доходах, занятости и услугах между югом и центром с севером",
  "La distanza chilometrica fra le due estremità": "Расстояние в километрах между двумя краями",
  "La diversa densità di popolazione": "Разную плотность населения",
  "Reddito per abitante più basso, disoccupazione più alta e occupazione femminile molto minore. È la questione economica più antica del paese, aperta con l'Unità e mai chiusa.":
    "Доход на жителя ниже, безработица выше, женская занятость намного меньше. Это самый старый экономический вопрос страны, открытый с объединением и так и не закрытый.",
  "Da che cosa deriva l'alto debito pubblico italiano?":
    "Откуда взялся высокий государственный долг Италии?",
  "Dalla ricostruzione postbellica": "Из послевоенного восстановления",
  "Da decenni di spesa a deficit, soprattutto negli anni Ottanta":
    "Из десятилетий дефицитных расходов, особенно в восьмидесятые",
  "Dall'ingresso nell'euro": "Из вступления в евро",
  "Dalla crisi finanziaria del 2008": "Из финансового кризиса 2008 года",
  "Il rapporto fra debito e prodotto è cresciuto soprattutto negli anni Ottanta. Da allora serve un avanzo primario costante solo per non farlo aumentare, il che riduce lo spazio per investire.":
    "Отношение долга к продукту выросло прежде всего в восьмидесятые. С тех пор нужен постоянный первичный профицит только чтобы он не рос, и это сужает место для вложений.",
  "Che cosa caratterizza la demografia italiana attuale?":
    "Что отличает нынешнюю итальянскую демографию?",
  "Una natalità fra le più basse del mondo e una popolazione che invecchia":
    "Одна из самых низких рождаемостей в мире и стареющее население",
  "Una crescita rapida della popolazione giovane": "Быстрый рост молодого населения",
  "Un equilibrio stabile fra nascite e decessi":
    "Устойчивое равновесие между рождениями и смертями",
  "Un aumento della natalità dal 2000": "Рост рождаемости с 2000 года",
  "La natalità è fra le più basse al mondo e l'età media fra le più alte d'Europa. È uno dei tre nodi aperti dell'economia, insieme al debito e alla partenza dei giovani laureati.":
    "Рождаемость — одна из самых низких в мире, а средний возраст — один из самых высоких в Европе. Это один из трёх открытых узлов экономики, вместе с долгом и отъездом молодых выпускников.",
  "Quale di queste è una delle quattro A dell'export italiano?":
    "Что из этого — одна из четырёх «А» итальянского экспорта?",
  "Acciaio": "Сталь",
  "Arredamento": "Мебель",
  "Agricoltura": "Сельское хозяйство",
  "Aeronautica": "Авиастроение",
  "Arredamento, insieme ad abbigliamento, automazione e alimentare. Le altre voci esistono nell'economia italiana ma non fanno parte della formula.":
    "Мебель, вместе с одеждой, автоматикой и продовольствием. Остальные названные отрасли в итальянской экономике есть, но в формулу не входят.",
  "Perché piccola impresa non significa impresa arretrata?":
    "Почему малое предприятие не значит отсталое предприятие?",
  "Perché tutte le piccole imprese ricevono aiuti pubblici":
    "Потому что все малые предприятия получают государственную помощь",
  "Perché molte sono leader mondiali nella propria nicchia specializzata":
    "Потому что многие из них мировые лидеры в своей узкой нише",
  "Perché sono esenti da imposte fino a dieci dipendenti":
    "Потому что они освобождены от налогов, пока в них меньше десяти работников",
  "Perché sono tutte di proprietà straniera": "Потому что все они принадлежат иностранцам",
  "Aziende con poche decine di dipendenti fanno una cosa sola e la fanno meglio di chiunque altro al mondo. La specializzazione sostituisce la scala.":
    "Фирмы с несколькими десятками работников делают одну вещь и делают её лучше всех в мире. Специализация заменяет масштаб.",
  "Quale fenomeno riguarda i giovani laureati italiani?":
    "Какое явление касается молодых итальянских выпускников?",
  "Un ritorno massiccio dall'estero": "Массовое возвращение из-за границы",
  "Una partenza verso altri paesi dopo la formazione": "Отъезд в другие страны после учёбы",
  "Un aumento dell'occupazione nel settore pubblico": "Рост занятости в государственном секторе",
  "Una diminuzione delle iscrizioni universitarie all'estero":
    "Снижение числа поступающих в зарубежные вузы",
  "Molti lasciano il paese dopo gli studi. L'Italia forma persone che poi lavorano altrove, e questo pesa sui conti tanto quanto sull'economia.":
    "Многие уезжают из страны после учёбы. Италия готовит людей, которые потом работают в другом месте, и это бьёт по бюджету не меньше, чем по экономике.",
  "In quale zona si concentra il distretto meccanico italiano?":
    "В какой местности сосредоточен итальянский машиностроительный округ?",
  "Lungo la via Emilia": "Вдоль Эмилиевой дороги",
  "In Sardegna": "На Сардинии",
  "Nel Molise": "В Молизе",
  "Lungo la via Emilia, fra Bologna, Modena, Reggio e Parma: macchine per il packaging, motori, automazione. È il settore che esporta di più.":
    "Вдоль Эмилиевой дороги, между Болоньей, Моденой, Реджо и Пармой: упаковочные машины, моторы, автоматика. Это отрасль, которая вывозит больше всех.",
  "Come nascono di solito i distretti industriali italiani?":
    "Как обычно возникают итальянские промышленные округа?",
  "Da piani di sviluppo statali": "Из государственных планов развития",
  "Da un mestiere già presente sul territorio, spesso artigiano":
    "Из ремесла, уже жившего на этой земле, чаще всего кустарного",
  "Dall'insediamento di multinazionali": "Из прихода транснациональных компаний",
  "Da fondi europei degli anni Novanta": "Из европейских фондов девяностых",
  "Non sono stati progettati a tavolino: sono cresciuti dove esisteva già una tradizione di bottega, e si sono specializzati passandosi il lavoro fra imprese vicine.":
    "Их не проектировали за столом: они выросли там, где уже была мастерская традиция, и специализировались, передавая работу между соседними фирмами.",
  "Quale voce dell'economia italiana è legata direttamente al patrimonio culturale?":
    "Какая статья итальянской экономики прямо связана с культурным наследием?",
  "La siderurgia": "Чёрная металлургия",
  "La chimica di base": "Базовая химия",
  "L'estrazione mineraria": "Горная добыча",
  "Il turismo è una delle principali voci dell'economia, e poggia in gran parte sul patrimonio artistico e paesaggistico. Da qui anche i problemi di concentrazione nelle città d'arte.":
    "Туризм — одна из главных статей экономики, и держится он в основном на художественном и ландшафтном наследии. Отсюда же и беды со скученностью в городах искусства.",
  "Quale articolo della Costituzione fonda l'adesione italiana all'Unione europea?":
    "Какая статья Конституции обосновывает участие Италии в Европейском союзе?",
  "L'articolo 117": "Статья 117",
  "L'articolo 11 consente le limitazioni di sovranità necessarie a un ordinamento che assicuri la pace. È lo stesso articolo che ripudia la guerra.":
    "Статья 11 допускает ограничения суверенитета, необходимые для порядка, который обеспечивает мир. Это та же статья, что отвергает войну.",
  "Quale comunità europea nasce nel 1951 con l'Italia fra i fondatori?":
    "Какое европейское сообщество возникает в 1951 году, и Италия среди основателей?",
  "La CEE": "ЕЭС",
  "La CECA": "ЕОУС",
  "L'Euratom": "Евратом",
  "L'Unione europea": "Европейский союз",
  "La Comunità europea del carbone e dell'acciaio. CEE ed Euratom nascono nel 1957 con i Trattati di Roma, e l'Unione europea nel 1992 a Maastricht.":
    "Европейское объединение угля и стали. ЕЭС и Евратом рождаются в 1957 году с Римскими договорами, а Европейский союз — в 1992-м в Маастрихте.",
  "In quale anno l'Italia è ammessa all'ONU?": "В каком году Италию приняли в ООН?",
  "Nel 1945": "В 1945 году",
  "Nel 1955, dieci anni dopo la fondazione: l'ammissione era rimasta bloccata dalle tensioni della guerra fredda e fu sbloccata insieme a quella di altri paesi.":
    "В 1955 году, через десять лет после основания: приём был заблокирован напряжением холодной войны и разблокирован вместе с приёмом других стран.",
  "In quale città furono firmati i trattati che istituirono la CEE?":
    "В каком городе подписали договоры, учредившие ЕЭС?",
  "A Bruxelles": "В Брюсселе",
  "A Roma": "В Риме",
  "A Parigi": "В Париже",
  "A Maastricht": "В Маастрихте",
  "In Campidoglio, a Roma, il 25 marzo 1957. La sede della firma non è un dettaglio: l'Italia non è entrata in un'Europa già esistente, l'ha costruita.":
    "На Капитолии, в Риме, 25 марта 1957 года. Место подписания — не мелочь: Италия не вошла в уже существующую Европу, она её построила.",
  "Da quando l'euro esiste come moneta di conto, prima delle banconote?":
    "С какого времени евро существует как расчётная валюта, ещё до банкнот?",
  "Dal 1992": "С 1992 года",
  "Dal 1999": "С 1999 года",
  "Dal 2002": "С 2002 года",
  "Dal 2004": "С 2004 года",
  "Dal 1999 i cambi sono fissati e l'euro esiste nei conti; dal 1º gennaio 2002 circolano banconote e monete. La lira era nata nel 1862.":
    "С 1999 года курсы закреплены и евро существует в счетах; с 1 января 2002 года ходят банкноты и монеты. Лира родилась в 1862 году.",
  "Che cos'è lo spazio Schengen?": "Что такое Шенгенское пространство?",
  "L'area in cui circola l'euro": "Область, где ходит евро",
  "L'area in cui i controlli alle frontiere interne sono aboliti":
    "Область, где отменён контроль на внутренних границах",
  "L'unione doganale europea": "Европейский таможенный союз",
  "Il mercato unico dei servizi": "Единый рынок услуг",
  "Riguarda la circolazione delle persone senza controlli alle frontiere interne. Non coincide con l'area dell'euro: alcuni paesi stanno in una e non nell'altra.":
    "Оно касается передвижения людей без проверок на внутренних границах. С зоной евро оно не совпадает: некоторые страны состоят в одной и не состоят в другой.",
  "Quale organizzazione con sede a Roma si occupa di aiuti alimentari d'emergenza?":
    "Какая организация со штаб-квартирой в Риме занимается срочной продовольственной помощью?",
  "La FAO": "ФАО",
  "Il Programma alimentare mondiale": "Всемирная продовольственная программа",
  "L'OMS": "ВОЗ",
  "L'UNESCO": "ЮНЕСКО",
  "Il Programma alimentare mondiale, che con FAO e IFAD fa di Roma la capitale internazionale dei temi dell'alimentazione. L'OMS sta a Ginevra e l'UNESCO a Parigi.":
    "Всемирная продовольственная программа, которая вместе с ФАО и ИФАД делает Рим международной столицей продовольственных вопросов. ВОЗ находится в Женеве, а ЮНЕСКО в Париже.",
  "L'italiano è una delle lingue ufficiali dell'Unione europea?":
    "Является ли итальянский одним из официальных языков Европейского союза?",
  "No, le lingue ufficiali sono solo tre": "Нет, официальных языков всего три",
  "Sì": "Да",
  "Solo per i documenti che riguardano l'Italia": "Только для документов, касающихся Италии",
  "Solo dal 2004": "Только с 2004 года",
  "L'italiano è lingua ufficiale dell'Unione fin dall'inizio, come lingua di uno degli Stati fondatori: tutti gli atti vengono pubblicati anche in italiano.":
    "Итальянский — официальный язык Союза с самого начала, как язык одного из государств-основателей: все акты публикуются и по-итальянски.",
  "Qual è oggi la comunità straniera più numerosa in Italia?":
    "Какая иностранная община сегодня самая многочисленная в Италии?",
  "Quella romena": "Румынская",
  "Quella cinese": "Китайская",
  "Quella marocchina": "Марокканская",
  "Quella albanese": "Албанская",
  "La comunità romena è la più numerosa fra i circa cinque milioni di cittadini stranieri residenti. Albanese e marocchina sono fra le più antiche per insediamento.":
    "Румынская община — самая многочисленная среди примерно пяти миллионов проживающих иностранных граждан. Албанская и марокканская — из старейших по времени оседания.",
  "Verso quali destinazioni si diresse principalmente l'emigrazione italiana?":
    "Куда главным образом направлялась итальянская эмиграция?",
  "Verso le Americhe prima e l'Europa del Nord poi":
    "Сначала в обе Америки, потом в северную Европу",
  "Verso l'Africa settentrionale": "В северную Африку",
  "Verso l'Asia orientale": "В восточную Азию",
  "Verso l'Europa dell'Est": "В восточную Европу",
  "Prima Stati Uniti, Argentina e Brasile; dopo la Seconda guerra mondiale soprattutto Germania, Svizzera, Belgio e Francia. Da lì le grandi comunità di origine italiana nel mondo.":
    "Сначала Соединённые Штаты, Аргентина и Бразилия; после Второй мировой войны прежде всего Германия, Швейцария, Бельгия и Франция. Отсюда большие общины итальянского происхождения по всему миру.",
  "In quale decennio il saldo migratorio italiano si inverte, da paese di partenza a paese di arrivo?":
    "В каком десятилетии итальянское миграционное сальдо переворачивается — из страны отъезда в страну приезда?",
  "Negli anni Sessanta": "В шестидесятые",
  "Negli anni Ottanta": "В восьмидесятые",
  "Negli anni Duemila": "В двухтысячные",
  "Negli anni Dieci": "В десятые",
  "Negli anni Ottanta. Il paese che aveva visto partire ventisei milioni di persone comincia a riceverne, e nel giro di una generazione il dibattito pubblico cambia del tutto.":
    "В восьмидесятые. Страна, из которой уехали двадцать шесть миллионов человек, начинает их принимать, и за одно поколение общественный спор меняется полностью.",
  "Di quale gruppo di grandi economie fa parte l'Italia?":
    "В какую группу крупных экономик входит Италия?",
  "Del G7": "В G7",
  "Del Consiglio nordico": "В Северный совет",
  "Del Mercosur": "В Меркосур",
  "Dell'ASEAN": "В АСЕАН",
  "Del G7 e del G20. Le altre organizzazioni citate riuniscono paesi di altre aree del mondo.":
    "В G7 и в G20. Остальные названные организации объединяют страны других частей света.",
  "Perché la posizione geografica rende l'Italia una frontiera esterna dell'Unione europea?":
    "Почему географическое положение делает Италию внешней границей Европейского союза?",
  "Perché confina con quattro Stati non europei":
    "Потому что она граничит с четырьмя неевропейскими государствами",
  "Perché si estende al centro del Mediterraneo, fra Europa e Africa":
    "Потому что она вытянута в середину Средиземного моря, между Европой и Африкой",
  "Perché non fa parte dello spazio Schengen":
    "Потому что она не входит в Шенгенское пространство",
  "Perché ha il litorale più corto dell'Unione":
    "Потому что у неё самое короткое побережье в Союзе",
  "La penisola e le isole si spingono verso sud fino a Lampedusa, più vicina all'Africa che alla Sicilia. Da qui il ruolo dell'Italia nel dibattito europeo sulle frontiere marittime.":
    "Полуостров и острова уходят на юг до Лампедузы, которая ближе к Африке, чем к Сицилии. Отсюда роль Италии в европейском споре о морских границах.",
  "Che cosa significa la sigla CCNL?": "Что означает сокращение CCNL?",
  "Contratto collettivo nazionale di lavoro":
    "Contratto collettivo nazionale di lavoro — общенациональный отраслевой коллективный договор",
  "Consiglio consultivo nazionale del lavoro": "Национальный консультативный совет по труду",
  "Codice civile nazionale del lavoro": "Национальный гражданский трудовой кодекс",
  "Cassa contributiva nazionale dei lavoratori": "Национальная взносовая касса трудящихся",
  "Il contratto collettivo nazionale di lavoro, firmato per ciascun settore dalle organizzazioni dei datori e dai sindacati. In Italia le condizioni minime si fissano per settore, non per azienda.":
    "CCNL, общенациональный коллективный договор, который для каждой отрасли подписывают объединения работодателей и профсоюзы. В Италии минимальные условия задают по отрасли, а не по фирме.",
  "Quale articolo della Costituzione richiede una retribuzione sufficiente a un'esistenza libera e dignitosa?":
    "Какая статья Конституции требует оплаты, достаточной для свободного и достойного существования?",
  "L'articolo 4": "Статья 4",
  "L'articolo 36": "Статья 36",
  "L'articolo 36. L'articolo 4 riconosce il diritto al lavoro e il 40 il diritto di sciopero: tre articoli spesso citati insieme e facili da scambiare.":
    "Статья 36. Статья 4 признаёт право на труд, а 40-я — право на забастовку: три статьи, которые часто называют вместе и легко перепутать.",
  "Quale ente incassa i contributi previdenziali e paga le pensioni?":
    "Какое учреждение собирает пенсионные взносы и платит пенсии?",
  "L'INAIL": "INAIL",
  "L'INPS": "INPS",
  "L'Agenzia delle entrate": "Налоговое агентство",
  "Il Ministero del lavoro": "Министерство труда",
  "L'INPS. L'INAIL assicura invece contro gli infortuni sul lavoro e le malattie professionali: due enti distinti che accompagnano ogni rapporto di lavoro.":
    "INPS. А INAIL страхует от несчастных случаев на работе и профессиональных болезней: два разных учреждения, которые сопровождают каждые трудовые отношения.",
  "Contro che cosa assicura l'INAIL?": "От чего страхует INAIL?",
  "Contro la disoccupazione": "От безработицы",
  "Contro gli infortuni sul lavoro e le malattie professionali":
    "От несчастных случаев на работе и профессиональных болезней",
  "Contro il fallimento dell'azienda": "От банкротства фирмы",
  "Contro i danni a terzi": "От вреда третьим лицам",
  "Infortuni e malattie professionali. L'indennità di disoccupazione è invece pagata dall'INPS.":
    "От несчастных случаев и профессиональных болезней. А пособие по безработице платит INPS.",
  "Quali sono le tre confederazioni sindacali storiche italiane?":
    "Какие три исторические профсоюзные конфедерации есть в Италии?",
  "CGIL, CISL e UIL": "CGIL, CISL и UIL",
  "CGIL, INPS e INAIL": "CGIL, INPS и INAIL",
  "CISL, CNEL e UIL": "CISL, CNEL и UIL",
  "UIL, CCNL e CGIL": "UIL, CCNL и CGIL",
  "CGIL, CISL e UIL, nate dalla scissione del sindacato unitario del dopoguerra lungo linee politiche. INPS e INAIL sono enti pubblici, e il CNEL è un organo di consulenza.":
    "CGIL, CISL и UIL, выросшие из раскола единого послевоенного профсоюза по политическим линиям. INPS и INAIL — государственные учреждения, а CNEL — консультативный орган.",
  "Quante settimane di ferie retribuite spettano come minimo ogni anno?":
    "Сколько недель оплачиваемого отпуска полагается как минимум в год?",
  "Quattro settimane, di cui almeno due da godere nell'anno di maturazione. I contratti collettivi possono prevederne di più, mai di meno.":
    "Четыре недели, из которых не меньше двух нужно отгулять в тот же год, когда они начислены. Коллективные договоры могут дать больше, но никогда меньше.",
  "Che cosa distingue il lavoro con partita IVA?":
    "Чем отличается работа с собственным номером плательщика НДС?",
  "Si riceve una busta paga come i dipendenti":
    "Получаешь расчётный листок, как наёмные работники",
  "Si emette fattura e si versano da sé imposte e contributi":
    "Выставляешь счёт и сам платишь налоги и взносы",
  "Il datore paga tutti i contributi": "Все взносы платит работодатель",
  "Non si pagano imposte sul reddito": "Подоходный налог не платится",
  "È lavoro autonomo: niente busta paga, niente ferie retribuite e nessuna trattenuta a monte. Imposte e contributi li versa direttamente chi lavora.":
    "Это самостоятельная работа: ни расчётного листка, ни оплачиваемого отпуска, ни удержаний у источника. Налоги и взносы платит прямо тот, кто работает.",
  "Che cosa serve per licenziare un dipendente a tempo indeterminato?":
    "Что нужно, чтобы уволить работника с бессрочным договором?",
  "Nulla: basta il preavviso": "Ничего: хватает предупреждения",
  "Una giusta causa o un giustificato motivo": "Уважительная причина или обоснованный повод",
  "L'autorizzazione del sindacato": "Разрешение профсоюза",
  "Il consenso dell'ispettorato del lavoro": "Согласие трудовой инспекции",
  "Il tempo indeterminato non rende impossibile il licenziamento: lo condiziona a una ragione riconosciuta. Senza di essa il provvedimento è impugnabile davanti al giudice del lavoro.":
    "Бессрочный договор не делает увольнение невозможным: он ставит его в зависимость от признанной причины. Без неё решение можно оспорить у судьи по трудовым делам.",
  "Che cos'è l'apprendistato?": "Что такое ученический договор?",
  "Un periodo di prova non retribuito": "Неоплачиваемый испытательный срок",
  "Un contratto che unisce lavoro e formazione, rivolto ai giovani":
    "Договор, соединяющий работу и обучение, для молодых",
  "Un tirocinio universitario obbligatorio": "Обязательная университетская практика",
  "Un corso serale organizzato dalle regioni": "Вечерние курсы, устраиваемые областями",
  "È un vero contratto di lavoro, retribuito, che affianca alla prestazione un percorso formativo, con contributi ridotti per il datore.":
    "Это настоящий трудовой договор, оплачиваемый, который к работе добавляет учебный путь, со сниженными взносами для работодателя.",
  "In che anno è stato approvato lo Statuto dei lavoratori?":
    "В каком году был принят Статут трудящихся?",
  "Nel 1970, la legge 300. Portò le libertà costituzionali dentro i luoghi di lavoro e limitò il licenziamento nelle imprese maggiori. Il 1978 è invece l'anno del Servizio sanitario nazionale.":
    "В 1970 году, закон 300. Он принёс конституционные свободы внутрь рабочих мест и ограничил увольнения на крупных предприятиях. А 1978-й — это год Национальной службы здравоохранения.",
  "Perché il contratto a tempo determinato ha limiti di durata e di rinnovo?":
    "Почему у срочного договора есть пределы по сроку и по продлению?",
  "Per ridurre il costo del lavoro": "Чтобы снизить стоимость труда",
  "Per impedire che diventi un rapporto permanente senza le tutele di uno stabile":
    "Чтобы он не превратился в постоянные отношения без защиты, которую даёт бессрочный договор",
  "Per favorire le assunzioni stagionali": "Чтобы поощрить сезонный наём",
  "Per uniformarsi a un regolamento europeo del 2001":
    "Чтобы соответствовать европейскому регламенту 2001 года",
  "Senza limiti si potrebbe tenere una persona a termine per tutta la vita lavorativa. I tetti servono a evitare che la precarietà diventi la forma normale del rapporto.":
    "Без пределов человека можно было бы держать на срочном договоре всю трудовую жизнь. Потолки нужны, чтобы шаткость не стала обычной формой отношений.",
  "Che cosa sono i contributi previdenziali in busta paga?":
    "Что такое пенсионные взносы в расчётном листке?",
  "Una tassa sul reddito": "Налог на доход",
  "Le somme versate all'INPS che costruiscono il diritto alla pensione":
    "Суммы, перечисляемые в INPS, которые строят право на пенсию",
  "Un contributo volontario al sindacato": "Добровольный взнос в профсоюз",
  "Un accantonamento restituito ogni anno": "Резерв, возвращаемый каждый год",
  "Sono la differenza principale fra lordo e netto insieme all'IRPEF, e non sono un'imposta: costruiscono la posizione previdenziale di chi lavora.":
    "Вместе с IRPEF это главная разница между начисленным и полученным, и это не налог: они строят пенсионный счёт того, кто работает.",
  "Quale conseguenza ha l'assenza di un salario minimo legale in Italia?":
    "К чему ведёт отсутствие законной минимальной зарплаты в Италии?",
  "Che nessun lavoratore ha un minimo garantito":
    "К тому, что ни у одного работника нет гарантированного минимума",
  "Che il minimo dipende dal contratto collettivo applicato, e chi non ne ha uno resta scoperto":
    "К тому, что минимум зависит от применяемого коллективного договора, и у кого его нет, тот не защищён",
  "Che i minimi li fissa ogni regione": "К тому, что минимумы устанавливает каждая область",
  "Che il minimo è stabilito ogni anno dal bilancio dello Stato":
    "К тому, что минимум каждый год определяет государственный бюджет",
  "I minimi stanno nei CCNL, che coprono la gran parte ma non la totalità dei rapporti. Chi lavora in un settore senza contratto applicato non ha quella protezione: è la ragione per cui il tema si discute da anni.":
    "Минимумы стоят в CCNL, которые покрывают большую часть отношений, но не все. Кто работает в отрасли без применяемого договора, той защиты не имеет: поэтому тема обсуждается годами.",
  "Come è finanziato il Servizio sanitario nazionale?":
    "Как финансируется Национальная служба здравоохранения?",
  "Con premi assicurativi individuali": "Индивидуальными страховыми взносами",
  "Con la fiscalità generale": "Из общих налогов",
  "Con i contributi versati dai soli lavoratori dipendenti":
    "Взносами, которые платят только наёмные работники",
  "Con i ticket pagati dai pazienti": "Соплатежами пациентов",
  "Dalle tasse, non da un premio assicurativo. È la differenza di fondo rispetto al vecchio sistema delle casse mutue, in cui la copertura dipendeva dalla categoria professionale.":
    "Из налогов, а не из страховой премии. Это коренное отличие от старой системы больничных касс, где покрытие зависело от профессиональной категории.",
  "Chi gestisce concretamente la sanità in Italia?":
    "Кто на деле управляет здравоохранением в Италии?",
  "Lo Stato centrale": "Центральное государство",
  "Le regioni": "Области",
  "I comuni": "Коммуны",
  "Le province": "Провинции",
  "Le regioni organizzano aziende sanitarie e ospedali. Da qui differenze reali di attesa e organizzazione, e la mobilità sanitaria di chi si sposta per curarsi.":
    "Области устраивают медицинские предприятия и больницы. Отсюда настоящая разница в очередях и в устройстве, и медицинская миграция тех, кто едет лечиться в другое место.",
  "Chi è il primo riferimento sanitario per un residente in Italia?":
    "Кто первый медицинский адрес для жителя Италии?",
  "Il pronto soccorso": "Приёмный покой скорой помощи",
  "Lo specialista ospedaliero": "Больничный специалист",
  "Il farmacista": "Аптекарь",
  "Il medico di medicina generale, che si sceglie fra quelli disponibili nella propria zona: visita, prescrive e indirizza allo specialista.":
    "Врач общей практики, которого выбирают из доступных в своём районе: он осматривает, выписывает и направляет к специалисту.",
  "Con quale criterio si viene ricevuti al pronto soccorso?":
    "По какому принципу принимают в приёмном покое?",
  "In ordine di arrivo": "В порядке прихода",
  "In ordine di gravità": "В порядке тяжести состояния",
  "In base all'età": "По возрасту",
  "In base alla residenza": "По месту жительства",
  "I codici di priorità stabiliscono chi passa prima: una persona arrivata dopo può essere ricevuta per prima se la sua condizione è più grave.":
    "Коды срочности определяют, кто проходит раньше: пришедшего позже могут принять первым, если его состояние тяжелее.",
  "Che cos'è il ticket sanitario?": "Что такое медицинский тикет?",
  "Il costo pieno di una visita privata": "Полная стоимость частного приёма",
  "Una quota a carico del paziente per alcune prestazioni, con esenzioni":
    "Доля расходов на пациенте за некоторые услуги, с освобождениями",
  "Un abbonamento annuale al servizio sanitario": "Годовой абонемент на медицинскую службу",
  "La tassa regionale sulla salute": "Областной налог на здоровье",
  "Una compartecipazione alla spesa, con esenzioni per reddito, età e patologia. Le prestazioni urgenti al pronto soccorso non si pagano.":
    "Участие в расходах, с освобождениями по доходу, возрасту и болезни. Срочная помощь в приёмном покое не оплачивается.",
  "Che cosa sostituì il Servizio sanitario nazionale nel 1978?":
    "Что Национальная служба здравоохранения заменила в 1978 году?",
  "Le assicurazioni private obbligatorie": "Обязательные частные страховки",
  "Le casse mutue legate alla categoria professionale":
    "Больничные кассы, привязанные к профессиональной категории",
  "Gli ospedali gestiti dalle province": "Больницы под управлением провинций",
  "Il sistema di assistenza comunale": "Систему коммунальной помощи",
  "Prima del 1978 la copertura dipendeva dal mestiere: ciascuna categoria aveva la propria cassa, e chi non rientrava in nessuna restava scoperto.":
    "До 1978 года покрытие зависело от ремесла: у каждой категории была своя касса, а кто не попадал ни в одну, оставался без защиты.",
  "Quanti anni dura la scuola primaria italiana?":
    "Сколько лет длится итальянская начальная школа?",
  "Cinque anni, dai sei agli undici. Seguono tre anni di secondaria di primo grado e cinque di secondaria di secondo grado.":
    "Пять лет, с шести до одиннадцати. Дальше три года средней школы первой ступени и пять — второй.",
  "Quanti anni dura la scuola secondaria di primo grado?":
    "Сколько лет длится средняя школа первой ступени?",
  "Tre anni, quelle che tutti chiamano medie, e si chiudono con un esame. La secondaria di secondo grado dura invece cinque anni.":
    "Три года — то, что все зовут medie, — и заканчиваются они экзаменом. А средняя школа второй ступени длится пять лет.",
  "Fra quali indirizzi si sceglie per la scuola secondaria di secondo grado?":
    "Между какими направлениями выбирают для средней школы второй ступени?",
  "Liceo, istituto tecnico e istituto professionale":
    "Лицей, технический институт и профессиональный институт",
  "Liceo classico e liceo scientifico soltanto":
    "Только классический лицей и естественнонаучный лицей",
  "Scuola pubblica e scuola paritaria": "Государственная школа и приравненная к ней частная",
  "Percorso breve e percorso lungo": "Короткий путь и длинный путь",
  "Tre indirizzi, e la scelta si fa a tredici anni. Tutti e tre portano a un diploma che dà accesso all'università: il liceo non è la scuola superiore in generale, è uno dei tre.":
    "Три направления, и выбор делают в тринадцать лет. Все три ведут к диплому, открывающему дорогу в университет: лицей — это не старшая школа вообще, а одно из трёх.",
  "Come si chiama ufficialmente l'esame che chiude la scuola superiore?":
    "Как официально называется экзамен, завершающий старшую школу?",
  "Maturità": "Матурита",
  "Esame di Stato": "Государственный экзамен",
  "Diploma nazionale": "Национальный диплом",
  "Esame di ammissione": "Вступительный экзамен",
  "Ufficialmente esame di Stato; maturità è il nome con cui lo chiamano tutti. Si valuta in centesimi, con sessanta come minimo.":
    "Официально — государственный экзамен; maturità — имя, которым его зовут все. Оценивают по стобалльной шкале, минимум шестьдесят.",
  "Su quale scala si valuta il voto finale di laurea?":
    "По какой шкале ставят итоговую оценку за диплом?",
  "In centodecimi, con centodieci e lode come massimo. I trentesimi valgono per i singoli esami e i centesimi per la maturità.":
    "По стодесятибалльной, с высшей оценкой сто десять с отличием. Тридцатибалльная — для отдельных экзаменов, а стобалльная — для матуриты.",
  "Quali corsi universitari sono a ciclo unico, senza triennale e magistrale separate?":
    "Какие университетские курсы идут одним циклом, без отдельных трёхлетней и магистерской ступеней?",
  "Economia e ingegneria": "Экономика и инженерное дело",
  "Medicina, giurisprudenza e architettura": "Медицина, юриспруденция и архитектура",
  "Lettere e filosofia": "Филология и философия",
  "Scienze politiche e sociologia": "Политология и социология",
  "Medicina, giurisprudenza e architettura seguono un percorso unico più lungo. Gli altri corsi si articolano in una laurea triennale seguita da una magistrale biennale.":
    "Медицина, юриспруденция и архитектура идут одним, более длинным путём. Остальные курсы делятся на трёхлетнюю степень и следующую за ней двухлетнюю магистратуру.",
  "A che cosa serve la tessera sanitaria, oltre a dare accesso alle prestazioni?":
    "Для чего нужна tessera sanitaria, кроме доступа к медицинским услугам?",
  "A votare alle elezioni regionali": "Чтобы голосовать на областных выборах",
  "A riportare il codice fiscale e a valere come tessera europea di assicurazione malattia":
    "Чтобы нести на себе codice fiscale и служить европейской картой медицинского страхования",
  "A ottenere sconti sui trasporti pubblici": "Чтобы получать скидки на общественный транспорт",
  "A dimostrare la residenza": "Чтобы подтверждать место жительства",
  "Porta il codice fiscale sul fronte e sul retro è la tessera europea che consente l'assistenza negli altri Stati dell'Unione.":
    "На лицевой стороне у неё codice fiscale, а на обороте — европейская карта, дающая помощь в других государствах Союза.",
  "Da quanti caratteri è composto il codice fiscale?":
    "Из скольких знаков состоит codice fiscale?",
  "Undici": "Из одиннадцати",
  "Tredici": "Из тринадцати",
  "Sedici": "Из шестнадцати",
  "Sedici caratteri ricavati da nome, cognome, data e luogo di nascita. Undici è la lunghezza della partita IVA, che è un'altra cosa.":
    "Шестнадцать знаков, выведенных из имени, фамилии, даты и места рождения. Одиннадцать — это длина номера плательщика НДС, а это другое.",
  "Che cos'è la residenza anagrafica?": "Что такое residenza anagrafica, учётная прописка?",
  "L'indirizzo indicato nel contratto di lavoro": "Адрес, указанный в трудовом договоре",
  "L'iscrizione all'anagrafe del comune in cui si abita davvero":
    "Запись в anagrafe той коммуны, где человек действительно живёт",
  "Il luogo di nascita registrato sul certificato": "Место рождения, записанное в свидетельстве",
  "L'indirizzo del proprio datore di lavoro": "Адрес своего работодателя",
  "Da essa dipendono carta d'identità, medico di base, iscrizione a scuola e, per i cittadini dell'Unione, il voto alle comunali.":
    "От неё зависят carta d'identità, участковый врач, запись в школу и, для граждан Союза, голос на коммунальных выборах.",
  "A quale autorità si chiede il permesso di soggiorno?":
    "У какого органа просят permesso di soggiorno?",
  "Al comune": "У коммуны",
  "Alla questura": "У questura",
  "Alla regione": "У области",
  "All'ambasciata": "У посольства",
  "Alla questura, presentando la domanda tramite gli uffici postali abilitati. L'accordo di integrazione si firma invece allo sportello unico presso la prefettura.":
    "У questura, подав заявление через уполномоченные почтовые отделения. А соглашение об интеграции подписывают в едином окне при префектуре.",
  "Quale livello di italiano serve per il permesso di soggiorno UE per soggiornanti di lungo periodo?":
    "Какой уровень итальянского нужен для permesso di soggiorno ЕС для долгосрочно проживающих?",
  "B2": "B2",
  "A2, dimostrato con un test. Il B1 serve invece per la domanda di cittadinanza: due soglie diverse per due procedure diverse.":
    "A2, подтверждённый тестом. А B1 нужен для заявления о гражданстве: два разных порога для двух разных процедур.",
  "Quanti anni di soggiorno regolare servono come minimo per il permesso di lungo periodo?":
    "Сколько лет законного проживания нужно как минимум для долгосрочного разрешения?",
  "Cinque anni, insieme a un reddito e al test di italiano A2. Dieci anni è invece il termine ordinario per chiedere la cittadinanza per residenza.":
    "Пять лет, вместе с доходом и тестом по итальянскому на A2. А десять лет — обычный срок, чтобы просить гражданство по проживанию.",
  "Quanti crediti si ricevono alla firma dell'accordo di integrazione?":
    "Сколько баллов дают при подписании соглашения об интеграции?",
  "Sedici crediti iniziali, da mantenere o accrescere in due anni, prorogabili di uno. Azzerarli comporta la revoca del permesso di soggiorno.":
    "Шестнадцать начальных баллов, которые нужно удержать или увеличить за два года, с возможным продлением ещё на год. Обнулить их — значит потерять permesso di soggiorno.",
  "Entro quanto tempo dalla firma dell'accordo si partecipa alla sessione di formazione civica?":
    "В какой срок после подписания соглашения проходят занятие по гражданскому просвещению?",
  "Entro un mese": "В течение месяца",
  "Entro tre mesi": "В течение трёх месяцев",
  "Entro un anno": "В течение года",
  "Non è prevista": "Оно не предусмотрено",
  "Entro tre mesi. Non è un esame: la partecipazione dà crediti, e la sessione riguarda ordinamento, diritti e doveri e accesso ai servizi.":
    "В течение трёх месяцев. Это не экзамен: участие даёт баллы, а занятие касается устройства государства, прав и обязанностей и доступа к услугам.",
  "Che cosa si verifica alla scadenza dell'accordo di integrazione?":
    "Что проверяют по истечении соглашения об интеграции?",
  "Un esame scritto di storia italiana": "Письменный экзамен по итальянской истории",
  "La conoscenza dell'italiano parlato almeno all'A2 e una conoscenza sufficiente della vita civile":
    "Владение разговорным итальянским хотя бы на A2 и достаточное знание гражданской жизни",
  "Il possesso di un contratto di lavoro a tempo indeterminato":
    "Наличие бессрочного трудового договора",
  "La frequenza di un corso universitario": "Посещение университетского курса",
  "Non esiste alcun esame di educazione civica: si verificano il livello linguistico e una conoscenza sufficiente della cultura civica e della vita civile in Italia.":
    "Никакого экзамена по гражданскому воспитанию не существует: проверяют уровень языка и достаточное знание гражданской культуры и гражданской жизни в Италии.",
  "Quanti anni di residenza servono ordinariamente a un cittadino non dell'Unione per chiedere la cittadinanza?":
    "Сколько лет проживания обычно нужно гражданину не из Союза, чтобы просить гражданство?",
  "Dieci anni. Il termine è più breve per i cittadini dell'Unione, per i rifugiati e per chi è nato in Italia.":
    "Десять лет. Срок короче для граждан Союза, для беженцев и для тех, кто родился в Италии.",
  "Per quali vie si può ottenere la cittadinanza italiana?":
    "Какими путями можно получить итальянское гражданство?",
  "Solo per nascita sul territorio": "Только по рождению на территории",
  "Per discendenza, per matrimonio o per residenza":
    "По происхождению, по браку или по проживанию",
  "Solo per matrimonio": "Только по браку",
  "Solo per decreto del Presidente della Repubblica": "Только указом президента Республики",
  "Le tre vie ordinarie. La nascita sul territorio da sola non basta: l'Italia non applica il principio dello ius soli puro.":
    "Три обычных пути. Одного рождения на территории мало: Италия не применяет чистый принцип права почвы.",
  "Da quale anno la domanda di cittadinanza richiede un certificato di lingua?":
    "С какого года заявление о гражданстве требует языкового сертификата?",
  "Dal 2012": "С 2012 года",
  "Dal 2018": "С 2018 года",
  "Dal 2022": "С 2022 года",
  "Dal 2018. L'accordo di integrazione, che è cosa diversa e riguarda il permesso di soggiorno, era invece entrato in vigore nel 2012.":
    "С 2018 года. А соглашение об интеграции — это другое, оно касается permesso di soggiorno и вступило в силу в 2012 году.",
  "Che cosa serve per accedere ai servizi pubblici online in Italia?":
    "Что нужно для доступа к государственным услугам онлайн в Италии?",
  "Un'identità digitale come SPID o la carta d'identità elettronica":
    "Цифровая личность вроде SPID или электронная carta d'identità",
  "Il solo codice fiscale": "Один только codice fiscale",
  "Un indirizzo di posta elettronica certificata": "Адрес заверенной электронной почты",
  "La tessera sanitaria scaduta": "Просроченная tessera sanitaria",
  "Senza SPID o carta d'identità elettronica non si prenota una visita, non si scarica un certificato e non si consulta il proprio fascicolo previdenziale.":
    "Без SPID или электронной carta d'identità не запишешься на приём, не скачаешь справку и не посмотришь своё пенсионное дело.",
  "Le prove richieste dallo Stato italiano riguardano la storia e le istituzioni del paese?":
    "Касаются ли проверки, которых требует итальянское государство, истории и учреждений страны?",
  "Sì, entrambe le prove sono di educazione civica":
    "Да, обе проверки — по гражданскому воспитанию",
  "No: il test A2 e il certificato B1 sono prove linguistiche":
    "Нет: тест A2 и сертификат B1 — языковые проверки",
  "Solo la prova per la cittadinanza è di educazione civica":
    "Только проверка для гражданства — по гражданскому воспитанию",
  "Solo il test per il permesso è di educazione civica":
    "Только тест для разрешения — по гражданскому воспитанию",
  "Sia l'A2 per il permesso di lungo periodo sia il B1 per la cittadinanza esaminano la lingua. L'unico riferimento alla vita civile è nella verifica dell'accordo di integrazione, e non è un esame di storia.":
    "И A2 для долгосрочного разрешения, и B1 для гражданства проверяют язык. Единственная отсылка к гражданской жизни — в проверке соглашения об интеграции, и это не экзамен по истории.",
  "Come si beve abitualmente il caffè in Italia?": "Как в Италии обычно пьют кофе?",
  "Lungo, seduti al tavolo": "Разбавленным, сидя за столиком",
  "Espresso, spesso al banco e in poco tempo": "Эспрессо, чаще у стойки и быстро",
  "Filtrato, in tazza grande": "Фильтрованным, в большой чашке",
  "Solo a colazione": "Только на завтрак",
  "L'espresso al banco è il gesto quotidiano più diffuso. Al tavolo il prezzo di solito cambia, ed è la ragione per cui molti restano in piedi.":
    "Эспрессо у стойки — самое распространённое ежедневное движение. За столиком цена обычно другая, и поэтому многие остаются стоять.",
  "Che cos'è il caffè corretto?": "Что такое caffè corretto?",
  "Un espresso con l'aggiunta di un liquore": "Эспрессо с добавлением спиртного",
  "Un caffè preparato con acqua filtrata": "Кофе, сваренный на фильтрованной воде",
  "Un caffè senza zucchero": "Кофе без сахара",
  "Un caffè con latte freddo": "Кофе с холодным молоком",
  "Corretto con grappa, sambuca o un altro liquore. Si prende di solito dopo il pasto, al posto o dopo l'espresso semplice.":
    "«Исправленный» граппой, самбукой или другим ликёром. Его обычно берут после еды, вместо простого эспрессо или после него.",
  "Che cos'è il primo in un pasto italiano?": "Что такое primo в итальянской трапезе?",
  "L'antipasto": "Закуска",
  "La portata di pasta, riso o zuppa": "Блюдо из пасты, риса или супа",
  "Il piatto di carne o pesce": "Блюдо из мяса или рыбы",
  "Il contorno servito per primo": "Гарнир, поданный первым",
  "Primo e secondo sono due portate distinte, servite una dopo l'altra: il primo è pasta, riso o zuppa, il secondo carne o pesce con contorno.":
    "Primo и secondo — два разных блюда, подаваемых одно за другим: primo — это паста, рис или суп, secondo — мясо или рыба с гарниром.",
  "Perché si dice che la cucina italiana al singolare quasi non esista?":
    "Почему говорят, что итальянской кухни в единственном числе почти не существует?",
  "Perché è stata inventata nel Novecento": "Потому что её придумали в XX веке",
  "Perché è regionale e spesso cittadina, e cambia di valle in valle":
    "Потому что она областная, а часто и городская, и меняется от долины к долине",
  "Perché deriva interamente dalla cucina francese":
    "Потому что она целиком происходит от французской кухни",
  "Perché i prodotti sono importati": "Потому что продукты привозные",
  "Il ragù non è lo stesso a Bologna e a Napoli, e la pizza napoletana e quella romana sono prodotti diversi. L'idea di una cucina nazionale unica è nata soprattutto fuori dai confini, con l'emigrazione.":
    "Рагу в Болонье и в Неаполе не одно и то же, а неаполитанская и римская пицца — разные вещи. Мысль о единой национальной кухне родилась главным образом за границей, вместе с эмиграцией.",
  "Che cos'è l'aperitivo?": "Что такое аперитив?",
  "Il caffè che precede la colazione": "Кофе перед завтраком",
  "Il momento prima di cena, con una bevanda e qualcosa da mangiare":
    "Время перед ужином, с напитком и чем-нибудь закусить",
  "Il dolce di fine pasto": "Сладкое в конце еды",
  "Il pasto di mezzogiorno nei giorni festivi": "Полуденная трапеза по праздникам",
  "Precede la cena e in alcune città, Milano in particolare, si è ampliato al punto da sostituirla quasi del tutto.":
    "Он идёт перед ужином и в некоторых городах, особенно в Милане, разросся так, что почти его заменяет.",
  "Perché i giovani italiani lasciano tardi la casa dei genitori?":
    "Почему молодые итальянцы поздно уходят из родительского дома?",
  "Per una tradizione religiosa": "Из-за религиозной традиции",
  "Soprattutto per ragioni economiche: affitti, salari d'ingresso e lavoro instabile":
    "Прежде всего по денежным причинам: аренда, начальные зарплаты и нестабильная работа",
  "Perché la legge lo prevede fino ai trent'anni":
    "Потому что закон предусматривает это до тридцати лет",
  "Perché mancano corsi universitari fuori sede":
    "Потому что не хватает университетских курсов в других городах",
  "L'età media in cui si lascia la famiglia è fra le più alte d'Europa, e le indagini indicano cause soprattutto economiche più che culturali.":
    "Средний возраст ухода из семьи — один из самых высоких в Европе, и опросы указывают на причины скорее денежные, чем культурные.",
  "Quale ruolo hanno spesso i nonni nelle famiglie italiane?":
    "Какую роль часто играют дедушки и бабушки в итальянских семьях?",
  "Vivono di norma separati dai figli e non partecipano":
    "Обычно они живут отдельно от детей и не участвуют",
  "Curano quotidianamente i nipoti, sostenendo di fatto i bilanci familiari":
    "Они каждый день смотрят за внуками и тем самым поддерживают семейный бюджет",
  "Sono assistiti in strutture pubbliche nella maggioranza dei casi":
    "В большинстве случаев за ними ухаживают в государственных учреждениях",
  "Non hanno alcun ruolo riconosciuto": "У них нет никакой признанной роли",
  "La cura dei nipoti da parte dei nonni sostituisce in molte famiglie servizi che costerebbero, e regge una parte non piccola dell'occupazione femminile.":
    "Уход дедушек и бабушек за внуками во многих семьях заменяет услуги, которые стоили бы денег, и держит немалую часть женской занятости.",
  "Come si chiamano i giocatori della nazionale italiana di calcio?":
    "Как называют игроков итальянской сборной по футболу?",
  "I rossoneri": "Красно-чёрные",
  "Gli azzurri": "Лазурные",
  "I bianconeri": "Бело-чёрные",
  "I granata": "Гранатовые",
  "Gli azzurri, dal colore delle maglie, che viene dal blu Savoia e non dalla bandiera. Gli altri nomi appartengono a singole squadre di club.":
    "Лазурные, по цвету футболок, который идёт от савойского синего, а не от флага. Остальные прозвища принадлежат отдельным клубам.",
  "Quanti campionati del mondo di calcio ha vinto l'Italia?":
    "Сколько чемпионатов мира по футболу выиграла Италия?",
  "Quattro. Solo il Brasile ne ha vinti di più. Il calcio è lo sport nazionale e occupa le conversazioni da agosto a maggio.":
    "Четыре. Больше выиграла только Бразилия. Футбол — национальный спорт, и он занимает разговоры с августа по май.",
  "In quale mese si corre il Giro d'Italia?": "В каком месяце проходит Джиро д'Италия?",
  "A marzo": "В марте",
  "A maggio": "В мае",
  "A luglio": "В июле",
  "A settembre": "В сентябре",
  "A maggio, attraversando il paese. Il Tour de France si corre invece a luglio: le due grandi corse a tappe non si sovrappongono.":
    "В мае, пересекая страну. А «Тур де Франс» проходит в июле: две большие многодневки не накладываются.",
  "Da dove viene il colore della maglia del Giro d'Italia?":
    "Откуда взялся цвет майки лидера Джиро д'Италия?",
  "Dalla bandiera nazionale": "От государственного флага",
  "Dalla carta del quotidiano sportivo che organizzò la corsa":
    "От бумаги спортивной газеты, которая устроила гонку",
  "Dal colore delle Alpi al tramonto": "От цвета Альп на закате",
  "Da una scelta casuale degli anni Cinquanta": "От случайного выбора в пятидесятые",
  "Come la maglia gialla del Tour, il colore viene dalla carta del giornale organizzatore. Due corse diverse, due giornali, due colori, stessa logica.":
    "Как и жёлтая майка «Тура», цвет идёт от бумаги газеты-организатора. Две разные гонки, две газеты, два цвета, одна и та же логика.",
  "Che cosa succede a molti negozi e uffici italiani nel mese di agosto?":
    "Что происходит со многими итальянскими магазинами и конторами в августе?",
  "Prolungano gli orari per il turismo": "Они продлевают часы работы ради туристов",
  "Chiudono per ferie, soprattutto intorno a Ferragosto":
    "Они закрываются на отпуск, особенно вокруг Ferragosto",
  "Passano a un orario continuato": "Они переходят на непрерывный график",
  "Aprono anche di domenica per legge": "Они по закону открываются и по воскресеньям",
  "Intorno al 15 agosto chiudono negozi, studi professionali e interi quartieri delle grandi città. È la settimana in cui il paese si ferma davvero.":
    "Около 15 августа закрываются магазины, конторы и целые кварталы больших городов. Это неделя, когда страна действительно останавливается.",
  "Che cos'è la pausa pranzo nei negozi italiani?":
    "Что такое обеденный перерыв в итальянских магазинах?",
  "Una chiusura pomeridiana obbligatoria per legge": "Обязательное по закону дневное закрытие",
  "Una chiusura di alcune ore a metà giornata, con riapertura fino a sera":
    "Закрытие на несколько часов в середине дня с новым открытием до вечера",
  "Il giorno di riposo settimanale": "Еженедельный выходной",
  "Un orario ridotto riservato all'estate": "Сокращённый график, отведённый лету",
  "Diffusa soprattutto nei centri piccoli e al Sud. Non è obbligatoria, e nelle grandi città molti esercizi ormai restano aperti tutto il giorno.":
    "Он распространён прежде всего в маленьких городках и на юге. Обязательным он не является, и в больших городах многие заведения теперь работают весь день.",
};
