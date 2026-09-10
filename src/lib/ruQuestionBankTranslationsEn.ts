/**
 * English for the Zhizn v Rossii practice questions.
 *
 * The lesson cards are answered by ZHIZN_V_ROSSII_EN. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in English then asked its questions
 * in Cyrillic, which is the one alphabet a reader cannot guess at.
 *
 * Keyed on the RUSSIAN source text exactly as it appears in ruQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an e for
 * an ё or a straight quotation mark where the sentence has a guillemet, and
 * the lookup misses in silence. The question renders in Russian, the tap
 * works, and nothing anywhere reports it.
 *
 * WHAT STAYS RUSSIAN follows ZHIZN_V_ROSSII_EN exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - proper names take their usual English form: the Duma, the Federation
 *     Council, the Kremlin, the rouble, the Trans-Siberian;
 *   - the abbreviation the exam asks for by name keeps its letters with the
 *     meaning beside it: SNILS, INN, MROT, EGE, ZAGS;
 *   - a thing with no English name keeps the Russian and is explained where
 *     it first appears: banya, dacha, elektrichka, marshrutka, venik,
 *     borshch, shchi, kompot;
 *   - what English already names takes its English name: субъект Федерации
 *     is a federal subject, поликлиника a clinic, отчество a patronymic.
 *     Those are the pairs the gate watches, because the source word cannot
 *     survive into a Latin sentence and only the English side can be checked.
 *
 * British spelling throughout, the same as the rest of the English catalogue:
 * offence, recognise, programme, defence, labour.
 *
 * A hundred and five of the bank's strings are not here and that is correct:
 * they are years, bare numbers and short answers that ZHIZN_V_ROSSII_EN
 * already answers. Every English table is spread into one object, so a key
 * present in two of them would lose one silently — the later spread would
 * decide both. check-en-bank-translation measures coverage through
 * translateCourseText, the lookup a reader's tap actually goes through, so
 * those count as answered and are not duplicated here.
 */
export const RU_QUESTION_BANK_EN: Record<string, string> = {
  "Сколько полос на государственном флаге России?":
    "How many bands are there on the state flag of Russia?",
  "Две": "Two",
  "Пять": "Five",
  "Три равные горизонтальные полосы. Порядок закреплён федеральным конституционным законом 2000 года.":
    "Three equal horizontal bands. The order is fixed by the federal constitutional law of 2000.",
  "При каком правителе появился российский триколор?":
    "Under which ruler did the Russian tricolour appear?",
  "При Иване III": "Under Ivan III",
  "При Петре I": "Under Peter I",
  "При Екатерине II": "Under Catherine II",
  "При Александре II": "Under Alexander II",
  "При Петре I, сначала как флаг торговых судов. Двуглавый орёл в гербе, наоборот, старше: он появился при Иване III, в конце XV века.":
    "Under Peter I, at first as the flag of merchant ships. The double-headed eagle on the coat of arms is older: it appeared under Ivan III, at the end of the fifteenth century.",
  "Закреплены ли в законе значения цветов флага?":
    "Are the meanings of the flag's colours fixed in law?",
  "Да, они перечислены в конституционном законе": "Yes, they are listed in the constitutional law",
  "Нет: распространённые толкования появились позже и в законе их нет":
    "No: the usual readings came later and are not in the law",
  "Да, но только для белого цвета": "Yes, but only for white",
  "Значения устанавливает каждый субъект федерации": "Each federal subject sets the meanings",
  "Закон описывает полотнище и порядок полос, но не приписывает цветам смысла. Толкования вроде чистоты, верности и отваги — позднейшие и неофициальные.":
    "The law describes the cloth and the order of the bands, but gives the colours no meaning. Readings such as purity, loyalty and courage came later and are unofficial.",
  "Какая птица изображена на государственном гербе?":
    "Which bird is shown on the state coat of arms?",
  "Одноглавый орёл": "A single-headed eagle",
  "Двуглавый орёл": "A double-headed eagle",
  "Сокол": "A falcon",
  "Лебедь": "A swan",
  "Золотой двуглавый орёл на красном щите, с тремя коронами, скипетром и державой, и всадником на груди.":
    "A golden double-headed eagle on a red shield, with three crowns, a sceptre and an orb, and a horseman on its breast.",
  "Сколько корон над головами орла на гербе?":
    "How many crowns are above the eagle's heads on the coat of arms?",
  "Одна": "One",
  "Ни одной": "None",
  "Три короны, которые сегодня толкуют как символ суверенитета Российской Федерации и её частей.":
    "Three crowns, read today as the symbol of the sovereignty of the Russian Federation and of its parts.",
  "Что изображено на щите на груди орла?": "What is shown on the shield on the eagle's breast?",
  "Всадник, поражающий копьём дракона": "A horseman spearing a dragon",
  "Крест": "A cross",
  "Медведь": "A bear",
  "Корабль": "A ship",
  "Это древний московский герб, который связывают с Георгием Победоносцем. Он попал на грудь двуглавого орла при объединении русских земель вокруг Москвы.":
    "It is the ancient coat of arms of Moscow, associated with St George the Victorious. It came onto the breast of the double-headed eagle as the Russian lands were gathered around Moscow.",
  "Кто написал слова действующего государственного гимна?":
    "Who wrote the words of the present state anthem?",
  "Александр Пушкин": "Alexander Pushkin",
  "Сергей Михалков, и он писал текст к этой мелодии трижды: в 1943, 1977 и 2000 годах. Музыка во всех случаях александровская.":
    "Sergey Mikhalkov, and he wrote words for this melody three times: in 1943, 1977 and 2000. The music is Alexandrov's in every case.",
  "Какая мелодия была гимном России с 1990 по 2000 год?":
    "Which melody was the anthem of Russia from 1990 to 2000?",
  "Патриотическая песня Глинки": "Glinka's Patriotic Song",
  "Гимн Александрова без слов": "Alexandrov's anthem without words",
  "Марш Преображенского полка": "The march of the Preobrazhensky Regiment",
  "Боже, царя храни": "God Save the Tsar",
  "Патриотическая песня Глинки, к которой так и не утвердили текста. Отсутствие слов было одной из причин вернуться в 2000 году к прежней мелодии.":
    "Glinka's Patriotic Song, for which no words were ever approved. Having none was one of the reasons for going back to the older melody in 2000.",
  "Какая статья Конституции называет столицей Москву?":
    "Which article of the Constitution names Moscow as the capital?",
  "Статья 1": "Article 1",
  "Статья 68": "Article 68",
  "Статья 70": "Article 70",
  "Статья 137": "Article 137",
  "Статья 70. Статья 68 — о государственном языке, а статья 1 определяет форму государства.":
    "Article 70. Article 68 is about the state language, and Article 1 defines the form of the state.",
  "Что устанавливает статья 68 Конституции?":
    "What does Article 68 of the Constitution establish?",
  "Государственный флаг": "The state flag",
  "Русский язык как государственный на всей территории":
    "Russian as the state language across the whole territory",
  "Порядок принятия законов": "The way laws are passed",
  "Столицу": "The capital",
  "Русский язык — государственный на всей территории России, при этом республики вправе устанавливать свои государственные языки. Об этом подробнее в главе о языках.":
    "Russian is the state language across the whole of Russia, and the republics may set state languages of their own. There is more on this in the chapter on languages.",
  "Когда отмечается День Государственного флага?": "When is Flag Day marked?",
  "12 июня": "12 June",
  "22 августа": "22 August",
  "4 ноября": "4 November",
  "12 декабря": "12 December",
  "22 августа. Это памятная дата, а не нерабочий праздничный день.":
    "22 August. It is a commemorative date, not a non-working holiday.",
  "Какое событие 1990 года лежит в основе Дня России?":
    "Which event of 1990 lies behind Russia Day?",
  "Принятие Конституции": "The adoption of the Constitution",
  "Принятие Декларации о государственном суверенитете РСФСР":
    "The adoption of the Declaration of State Sovereignty of the RSFSR",
  "Распад Советского Союза": "The break-up of the Soviet Union",
  "Первые выборы президента": "The first presidential election",
  "Декларация о государственном суверенитете, принятая 12 июня 1990 года. Праздник дважды менял название и стал Днём России только в 2002 году.":
    "The Declaration of State Sovereignty, adopted on 12 June 1990. The holiday changed its name twice and became Russia Day only in 2002.",
  "В каком году государственный герб получил нынешний вид?":
    "In which year did the state coat of arms take its present form?",
  "В 1918 году": "In 1918",
  "В 2000 году": "In 2000",
  "В 1993 году. Законы о флаге, гербе и гимне в их действующей редакции приняты позже, в 2000 году.":
    "In 1993. The laws on the flag, the coat of arms and the anthem in their present wording were passed later, in 2000.",
  "Когда Конституция вступила в силу?": "When did the Constitution come into force?",
  "1 января 1994 года": "On 1 January 1994",
  "12 июня 1994 года": "On 12 June 1994",
  "Со дня официального опубликования — 25 декабря 1993 года. 12 декабря состоялось всенародное голосование, и именно эту дату отмечают как День Конституции.":
    "From the day of official publication — 25 December 1993. The nationwide vote was held on 12 December, and that is the date marked as Constitution Day.",
  "Какую конституцию заменила Конституция 1993 года?":
    "Which constitution did the Constitution of 1993 replace?",
  "Конституцию СССР 1977 года": "The USSR Constitution of 1977",
  "Конституцию РСФСР 1978 года": "The RSFSR Constitution of 1978",
  "Конституцию 1936 года": "The Constitution of 1936",
  "Никакую: это первая конституция России": "None: it is the first constitution of Russia",
  "Конституцию РСФСР 1978 года, которую к началу девяностых правили десятки раз. Конституция СССР 1977 года перестала действовать вместе с Союзом.":
    "The RSFSR Constitution of 1978, which by the early nineties had been amended dozens of times. The USSR Constitution of 1977 stopped applying along with the Union.",
  "Сколько глав в первом разделе Конституции?":
    "How many chapters are in the first section of the Constitution?",
  "Двенадцать": "Twelve",
  "Двадцать": "Twenty",
  "Девять глав и сто тридцать семь статей. Второй раздел короткий и содержит заключительные и переходные положения.":
    "Nine chapters and a hundred and thirty-seven articles. The second section is short and holds the final and transitional provisions.",
  "Какие статьи входят в главу о правах и свободах человека?":
    "Which articles make up the chapter on human rights and freedoms?",
  "С 1 по 16": "1 to 16",
  "С 17 по 64": "17 to 64",
  "С 65 по 79": "65 to 79",
  "С 80 по 93": "80 to 93",
  "Статьи 17–64, это самая длинная глава Конституции. Статьи 1–16 — основы конституционного строя, 65–79 — федеративное устройство.":
    "Articles 17–64, the longest chapter of the Constitution. Articles 1–16 are the foundations of the constitutional order, 65–79 the federal structure.",
  "Как статья 1 определяет Российскую Федерацию?":
    "How does Article 1 define the Russian Federation?",
  "Как демократическое федеративное правовое государство с республиканской формой правления":
    "As a democratic federal law-governed state with a republican form of government",
  "Как союз суверенных республик": "As a union of sovereign republics",
  "Как унитарное государство": "As a unitary state",
  "Как социалистическое государство рабочих и крестьян":
    "As a socialist state of workers and peasants",
  "Четыре характеристики в одном предложении, и у каждой есть продолжение в отдельной главе: демократия, федерация, право и республиканская форма правления.":
    "Four descriptions in one sentence, and each is taken up in a chapter of its own: democracy, federation, law and the republican form of government.",
  "Кого статья 3 называет единственным источником власти?":
    "Whom does Article 3 call the only source of power?",
  "Президента": "The president",
  "Носитель суверенитета и единственный источник власти — многонациональный народ. Слово «многонациональный» стоит и в преамбуле, и это не украшение.":
    "The bearer of sovereignty and the only source of power is the multi-ethnic people. The word multi-ethnic stands in the preamble as well, and it is not decoration.",
  "Что провозглашает статья 2 Конституции?": "What does Article 2 of the Constitution proclaim?",
  "Разделение властей": "The separation of powers",
  "Человека, его права и свободы высшей ценностью":
    "The human being, and their rights and freedoms, as the highest value",
  "Светский характер государства": "The secular character of the state",
  "Единство экономического пространства": "The unity of the economic space",
  "Признание, соблюдение и защита прав и свобод объявлены обязанностью государства. Разделение властей — статья 10, светское государство — статья 14.":
    "Recognising, observing and protecting rights and freedoms is declared the duty of the state. The separation of powers is Article 10, the secular state Article 14.",
  "Что устанавливает статья 13 об идеологии?": "What does Article 13 establish about ideology?",
  "Государственной идеологией объявляется патриотизм": "Patriotism is declared the state ideology",
  "Никакая идеология не может устанавливаться в качестве государственной или обязательной":
    "No ideology may be established as a state or a compulsory one",
  "Идеология определяется федеральным законом": "Ideology is set by federal law",
  "Об идеологии Конституция не говорит": "The Constitution says nothing about ideology",
  "Статья 13 закрепляет идеологическое и политическое многообразие и многопартийность. Формулировка прямая: никакая идеология не может быть государственной или обязательной.":
    "Article 13 fixes ideological and political diversity and a multi-party system. The wording is plain: no ideology may be a state or a compulsory one.",
  "Что означает, что Россия — светское государство?":
    "What does it mean that Russia is a secular state?",
  "Религия запрещена": "Religion is forbidden",
  "Религиозные объединения отделены от государства и равны перед законом":
    "Religious associations are separated from the state and equal before the law",
  "Установлена одна государственная религия": "One state religion is established",
  "Религиозные организации управляют школами": "Religious organisations run the schools",
  "Статья 14: никакая религия не может устанавливаться в качестве государственной или обязательной, а объединения отделены от государства и равны перед законом.":
    "Article 14: no religion may be established as a state or a compulsory one, and associations are separated from the state and equal before the law.",
  "Сколько субъектов федерации должны одобрить поправку к главам с третьей по восьмую?":
    "How many federal subjects have to approve an amendment to chapters three to eight?",
  "Половина": "Half",
  "Не менее двух третей": "At least two thirds",
  "Три четверти": "Three quarters",
  "Все": "All of them",
  "Поправка принимается в порядке федерального конституционного закона и вступает в силу после одобрения органами законодательной власти не менее чем двух третей субъектов.":
    "An amendment is passed in the manner of a federal constitutional law and comes into force after approval by the legislatures of at least two thirds of the federal subjects.",
  "Какой орган должен быть созван для пересмотра глав 1, 2 и 9?":
    "Which body has to be convened to revise chapters 1, 2 and 9?",
  "Конституционное Собрание": "The Constitutional Assembly",
  "Конституционное Собрание по статье 135. Его ни разу не созывали, и федерального конституционного закона о нём до сих пор нет.":
    "The Constitutional Assembly, under Article 135. It has never once been convened, and there is still no federal constitutional law about it.",
  "В каком году в Конституцию внесли крупный пакет поправок к главам с третьей по восьмую?":
    "In which year was a large package of amendments to chapters three to eight put into the Constitution?",
  "В 2008 году": "In 2008",
  "В 2014 году": "In 2014",
  "В 2020 году": "In 2020",
  "В 2023 году": "In 2023",
  "В 2020 году. До этого поправки касались сроков полномочий в 2008 году и объединения высших судов в 2014-м.":
    "In 2020. Before that the amendments touched terms of office in 2008 and the merger of the higher courts in 2014.",
  "Является ли 12 декабря нерабочим днём?": "Is 12 December a non-working day?",
  "Да, это государственный праздник": "Yes, it is a state holiday",
  "Нет: с 2005 года это памятная дата, но рабочий день":
    "No: since 2005 it has been a commemorative date but a working day",
  "Да, но только для государственных служащих": "Yes, but only for state employees",
  "Это выходной раз в пять лет": "It is a day off once every five years",
  "День Конституции остался памятной датой, но нерабочим быть перестал. Памятная дата и праздничный выходной — разные вещи.":
    "Constitution Day stayed a commemorative date but stopped being a day off. A commemorative date and a holiday day off are different things.",
  "С какого момента, по статье 17, человеку принадлежат основные права?":
    "From what moment, under Article 17, does a person hold the basic rights?",
  "С получения паспорта": "From receiving a passport",
  "От рождения": "From birth",
  "С восемнадцати лет": "From the age of eighteen",
  "С момента регистрации по месту жительства": "From registration at a place of residence",
  "Права и свободы принадлежат каждому от рождения и неотчуждаемы. Паспорт и совершеннолетие меняют объём дееспособности, а не сам факт обладания правами.":
    "Rights and freedoms belong to everyone from birth and cannot be taken away. A passport and coming of age change the extent of legal capacity, not the holding of the rights themselves.",
  "Чем отличаются статьи, начинающиеся словом «каждый», от статей о гражданах?":
    "How do the articles that begin with the word everyone differ from the articles about citizens?",
  "Ничем: это стилистическая разница": "In nothing: it is a difference of style",
  "Права со словом «каждый» принадлежат и иностранцам, а права граждан — только гражданам":
    "Rights with the word everyone belong to foreigners as well, while citizens' rights belong to citizens alone",
  "«Каждый» означает только совершеннолетних": "Everyone means adults only",
  "«Каждый» относится к юридическим лицам": "Everyone refers to legal persons",
  "Это ключ к чтению всей главы. Избирательные права и доступ к государственной службе записаны как права граждан; свобода слова, неприкосновенность жилища и право на защиту — как права каждого.":
    "It is the key to reading the whole chapter. The right to vote and access to state service are written as citizens' rights; freedom of speech, the inviolability of the home and the right to a defence as everyone's.",
  "Каково фактическое положение смертной казни в России?":
    "What is the actual position of the death penalty in Russia?",
  "Применяется по приговорам судов": "It is applied under court sentences",
  "Действует мораторий, и наказание не применяется":
    "A moratorium is in force and the penalty is not applied",
  "Полностью исключена из Конституции": "It has been removed from the Constitution altogether",
  "Применяется только в военное время": "It is applied only in time of war",
  "В статье 20 она названа исключительной мерой, но с середины девяностых действует мораторий, подтверждённый решениями Конституционного Суда.":
    "Article 20 calls it an exceptional measure, but a moratorium has been in force since the mid-nineties, upheld by rulings of the Constitutional Court.",
  "Что защищает статья 25 Конституции?": "What does Article 25 of the Constitution protect?",
  "Тайну переписки": "The privacy of correspondence",
  "Неприкосновенность жилища": "The inviolability of the home",
  "Никто не вправе проникать в жилище против воли проживающих иначе как в случаях, установленных законом, или по судебному решению. Тайна переписки — статья 23.":
    "Nobody may enter a home against the will of those living there except in the cases the law lays down or on a court decision. The privacy of correspondence is Article 23.",
  "Что гарантирует статья 26 Конституции?": "What does Article 26 of the Constitution guarantee?",
  "Право определять и указывать свою национальность и пользоваться родным языком":
    "The right to state one's own ethnicity and to use one's native language",
  "Право на двойное гражданство": "The right to dual citizenship",
  "Право на альтернативную гражданскую службу": "The right to alternative civilian service",
  "Свободу вероисповедания": "Freedom of religion",
  "И одновременно запрет принуждать к указанию национальности. Для страны, где живут сотни народов, это существенная норма, а не формальность.":
    "And at the same time a ban on compelling anyone to state their ethnicity. For a country where hundreds of peoples live, that is a substantial rule, not a formality.",
  "Что гарантирует статья 28 Конституции?": "What does Article 28 of the Constitution guarantee?",
  "Свободу совести и вероисповедания": "Freedom of conscience and of religion",
  "Свободу собраний": "Freedom of assembly",
  "Право на труд": "The right to work",
  "В том числе право не исповедовать никакой религии и свободно выбирать, иметь и распространять убеждения. Свобода собраний — статья 31.":
    "Including the right to profess no religion at all and to choose, hold and spread beliefs freely. Freedom of assembly is Article 31.",
  "Какая статья закрепляет право на жилище?": "Which article fixes the right to housing?",
  "Статья 37": "Article 37",
  "Статья 40": "Article 40",
  "Статья 41": "Article 41",
  "Статья 40: никто не может быть произвольно лишён жилища, а малоимущим оно предоставляется бесплатно или за доступную плату. Статья 41 — о здоровье, 43 — об образовании.":
    "Article 40: nobody may be arbitrarily deprived of a home, and the poor are given one free or for an affordable rent. Article 41 is about health, 43 about education.",
  "Что говорит статья 41 о медицинской помощи?": "What does Article 41 say about medical care?",
  "Она платная для всех": "It is paid for by everyone",
  "В государственных и муниципальных учреждениях она оказывается гражданам бесплатно":
    "In state and municipal institutions it is given to citizens free of charge",
  "Её объём определяет работодатель": "The employer decides how much of it there is",
  "Она бесплатна только для детей": "It is free for children only",
  "Помощь в государственных и муниципальных учреждениях здравоохранения оказывается бесплатно, за счёт бюджета, страховых взносов и других поступлений.":
    "Care in state and municipal health institutions is given free, paid for out of the budget, insurance contributions and other receipts.",
  "Против кого человек не обязан свидетельствовать по статье 51?":
    "Against whom is a person not obliged to testify under Article 51?",
  "Только против самого себя": "Against themselves only",
  "Против себя, супруга и близких родственников":
    "Against themselves, their spouse and close relatives",
  "Против любого знакомого": "Against any acquaintance",
  "Против работодателя": "Against their employer",
  "Круг близких родственников определяется федеральным законом. Это одна из самых известных статей Конституции — её часто цитируют, не открывая текста.":
    "Federal law defines who counts as a close relative. It is one of the best-known articles of the Constitution — often quoted without the text being opened.",
  "Что означает право на квалифицированную юридическую помощь по статье 48?":
    "What does the right to qualified legal assistance under Article 48 mean?",
  "Что помощь всегда платная": "That the assistance is always paid for",
  "Что в случаях, предусмотренных законом, она оказывается бесплатно":
    "That in the cases the law provides for it is given free",
  "Что защитника назначает следователь": "That the investigator appoints the defence lawyer",
  "Что помощь доступна только гражданам": "That the assistance is open to citizens only",
  "Право гарантировано каждому, а в предусмотренных законом случаях помощь оказывается бесплатно. Задержанный вправе пользоваться помощью защитника с момента задержания.":
    "The right is guaranteed to everyone, and in the cases the law provides for the assistance is free. A detained person may have a defence lawyer from the moment of detention.",
  "В чью пользу толкуются неустранимые сомнения в виновности?":
    "In whose favour are unresolvable doubts about guilt read?",
  "В пользу обвинения": "In favour of the prosecution",
  "В пользу обвиняемого": "In favour of the accused",
  "В пользу потерпевшего": "In favour of the injured party",
  "Их толкует суд по своему усмотрению": "The court reads them as it sees fit",
  "Это часть презумпции невиновности в статье 49. Обвиняемый не обязан доказывать свою невиновность, а сомнения работают на него.":
    "It is part of the presumption of innocence in Article 49. The accused does not have to prove their innocence, and the doubts work for them.",
  "Какие уровни образования статья 43 объявляет общедоступными и бесплатными?":
    "Which levels of education does Article 43 declare open to all and free?",
  "Только начальное": "Primary only",
  "Дошкольное, основное общее и среднее профессиональное":
    "Pre-school, basic general and secondary vocational",
  "Только высшее": "Higher education only",
  "Все уровни без исключения": "Every level without exception",
  "Высшее образование тоже можно получить бесплатно, но на конкурсной основе — это отдельная оговорка той же статьи.":
    "Higher education can be had free too, but on a competitive basis — that is a separate proviso of the same article.",
  "Что устанавливает статья 37 о труде?": "What does Article 37 establish about labour?",
  "Труд обязателен для всех трудоспособных": "Work is compulsory for everyone able to work",
  "Труд свободен, а принудительный труд запрещён": "Labour is free and forced labour is forbidden",
  "Работать можно только по трудовому договору": "You may work only under an employment contract",
  "Продолжительность рабочего дня записана в Конституции":
    "The length of the working day is written into the Constitution",
  "Каждый вправе распоряжаться своими способностями к труду и выбирать род деятельности. Конкретная продолжительность рабочей недели установлена не Конституцией, а Трудовым кодексом.":
    "Everyone may dispose of their ability to work and choose their occupation. The actual length of the working week is set not by the Constitution but by the Labour Code.",
  "Какая статья обязывает сохранять природу?": "Which article obliges people to preserve nature?",
  "Статья 58. Рядом стоят статья 57 о налогах и статья 59 о защите Отечества: три обязанности подряд, которые легко перепутать.":
    "Article 58. Next to it stand Article 57 on taxes and Article 59 on the defence of the fatherland: three duties in a row that are easy to confuse.",
  "Как Конституция называет защиту Отечества?":
    "What does the Constitution call the defence of the fatherland?",
  "Правом гражданина": "A right of the citizen",
  "Долгом и обязанностью гражданина": "A duty and an obligation of the citizen",
  "Обязанностью каждого, кто живёт в стране": "An obligation of everyone living in the country",
  "Добровольным делом": "A voluntary matter",
  "Статья 59 использует оба слова сразу. Военная служба несётся по федеральному закону, а при противоречии убеждениям возможна альтернативная гражданская служба.":
    "Article 59 uses both words at once. Military service is performed under federal law, and where it goes against a person's convictions, alternative civilian service is possible.",
  "Кто имеет право на альтернативную гражданскую службу?":
    "Who has the right to alternative civilian service?",
  "Любой призывник по заявлению": "Any conscript, on application",
  "Тот, чьим убеждениям или вероисповеданию противоречит несение военной службы":
    "Anyone whose convictions or religion are against performing military service",
  "Только студенты": "Students only",
  "Такого права в России нет": "There is no such right in Russia",
  "Право закреплено прямо в статье 59, а порядок определяет федеральный закон. Оно распространяется также на представителей коренных малочисленных народов, ведущих традиционный образ жизни.":
    "The right stands directly in Article 59, and federal law sets the procedure. It also extends to members of small indigenous peoples who follow a traditional way of life.",
  "Что говорит статья 38 об обязанностях в семье?":
    "What does Article 38 say about duties within the family?",
  "Только родители обязаны заботиться о детях": "Only parents have to care for children",
  "Родители заботятся о детях, а трудоспособные взрослые дети — о нетрудоспособных родителях":
    "Parents care for their children, and adult children able to work care for parents who cannot",
  "Обязанности в семье устанавливает регион": "The region sets the duties within the family",
  "Об этом Конституция не говорит": "The Constitution says nothing about it",
  "Обязанность идёт в обе стороны, и это записано прямо в Конституции, а не только в Семейном кодексе.":
    "The duty runs both ways, and it is written directly into the Constitution, not only into the Family Code.",
  "Имеют ли обратную силу законы, ухудшающие положение налогоплательщиков?":
    "Do laws that worsen the position of taxpayers have retroactive force?",
  "Да, если так решит парламент": "Yes, if parliament so decides",
  "Нет: статья 57 это прямо запрещает": "No: Article 57 forbids it outright",
  "Да, в случае бюджетного дефицита": "Yes, in the case of a budget deficit",
  "Вопрос решает суд в каждом случае": "The court decides in each case",
  "Прямая оговорка статьи 57. Законы, устанавливающие новые налоги или ухудшающие положение налогоплательщиков, обратной силы не имеют.":
    "A direct proviso of Article 57. Laws that bring in new taxes or worsen the position of taxpayers have no retroactive force.",
  "Какое образование Конституция называет обязательным?":
    "Which education does the Constitution call compulsory?",
  "Дошкольное": "Pre-school",
  "Основное общее": "Basic general",
  "Среднее профессиональное": "Secondary vocational",
  "Высшее": "Higher",
  "Основное общее образование обязательно, и обеспечить его получение детьми должны родители или лица, их заменяющие.":
    "Basic general education is compulsory, and parents or those standing in their place have to see that children receive it.",
  "Что означает, что гражданство России едино и равно независимо от оснований приобретения?":
    "What does it mean that Russian citizenship is single and equal whatever the grounds on which it was acquired?",
  "Что все граждане имеют одинаковые права независимо от того, получили они гражданство по рождению или были приняты":
    "That every citizen has the same rights whether they got citizenship by birth or were admitted to it",
  "Что гражданство нельзя изменить": "That citizenship cannot be changed",
  "Что двойное гражданство запрещено": "That dual citizenship is forbidden",
  "Что гражданство даётся только по рождению": "That citizenship is given by birth alone",
  "Статья 6. Из неё же следует, что гражданина нельзя лишить гражданства или права его изменить.":
    "Article 6. It follows from the same article that a citizen cannot be deprived of citizenship or of the right to change it.",
  "В каком году принят действующий федеральный закон о гражданстве?":
    "In which year was the federal law on citizenship now in force passed?",
  "В 2002 году": "In 2002",
  "Закон 2023 года заменил закон 2002 года. Он же перестроил перечень оснований для приёма в упрощённом порядке.":
    "The law of 2023 replaced the law of 2002. It also rebuilt the list of grounds for admission under the simplified procedure.",
  "Какой документ должен иметь заявитель, чтобы начался отсчёт пятилетнего срока проживания?":
    "Which document must an applicant hold for the five-year period of residence to start counting?",
  "Визу": "A visa",
  "Разрешение на временное проживание": "A temporary residence permit",
  "Вид на жительство": "A residence permit",
  "Патент на работу": "A work patent",
  "Срок считается со дня получения вида на жительство. Разрешение на временное проживание — предшествующая ступень, а не она.":
    "The period runs from the day the residence permit is received. The temporary residence permit is the step before it, not that one.",
  "Кто может претендовать на приём в гражданство в упрощённом порядке?":
    "Who can apply for citizenship under the simplified procedure?",
  "Любой, кто прожил в стране год": "Anyone who has lived in the country for a year",
  "В частности, близкие родственники граждан России, выпускники российских вузов и носители русского языка":
    "Among others, close relatives of Russian citizens, graduates of Russian universities and native speakers of Russian",
  "Только граждане государств СНГ": "Citizens of CIS states only",
  "Упрощённого порядка не существует": "There is no simplified procedure",
  "Перечень категорий установлен законом и время от времени меняется. Общий порядок с пятилетним сроком остаётся правилом, а упрощённый — исключением из него.":
    "The list of categories is set by law and changes from time to time. The general procedure with its five-year period stays the rule, and the simplified one the exception to it.",
  "Что, кроме срока проживания, требуется для приёма в гражданство?":
    "What besides the period of residence is required for admission to citizenship?",
  "Только законный источник средств": "A lawful source of income only",
  "Владение русским языком, знание истории и основ законодательства, законный источник средств":
    "Command of Russian, knowledge of history and of the basics of the law, and a lawful source of income",
  "Наличие недвижимости": "Owning property",
  "Служба в армии": "Service in the army",
  "Знание языка, истории и основ законодательства подтверждается экзаменом. Именно его форму — тридцать шесть заданий за девяносто минут — берёт тренировочный тест этого курса.":
    "Knowledge of the language, of history and of the basics of the law is shown by an exam. Its shape — thirty-six tasks in ninety minutes — is what the practice test of this course takes.",
  "С какого года принятые в гражданство приносят присягу?":
    "Since which year have those admitted to citizenship taken an oath?",
  "С 1993 года": "Since 1993",
  "С 2002 года": "Since 2002",
  "С 2017 года": "Since 2017",
  "С 2023 года": "Since 2023",
  "Присяга гражданина Российской Федерации введена в 2017 году и приносится после принятия решения о приёме в гражданство.":
    "The oath of a citizen of the Russian Federation was brought in in 2017 and is taken after the decision to admit a person to citizenship.",
  "С какого возраста гражданин России получает паспорт?":
    "At what age does a citizen of Russia receive a passport?",
  "С 10 лет": "At 10",
  "С 14 лет": "At 14",
  "С 16 лет": "At 16",
  "Паспорт выдаётся в 14 лет, а совершеннолетие с правом голоса и полной дееспособностью наступает в 18.":
    "The passport is issued at 14, and majority, with the right to vote and full legal capacity, comes at 18.",
  "Какая статья Трудового кодекса перечисляет нерабочие праздничные дни?":
    "Which article of the Labour Code lists the non-working holidays?",
  "Статья 91": "Article 91",
  "Статья 112": "Article 112",
  "Статья 115": "Article 115",
  "Статья 128": "Article 128",
  "Статья 112. Статья 115 — о продолжительности ежегодного отпуска, статья 91 — о рабочем времени.":
    "Article 112. Article 115 is about the length of the yearly holiday, Article 91 about working time.",
  "Какого числа отмечается Рождество Христово?": "On what date is Christmas marked?",
  "25 декабря": "25 December",
  "31 декабря": "31 December",
  "7 января": "7 January",
  "14 января": "14 January",
  "7 января, потому что церковный календарь остался юлианским. По той же причине 14 января отмечают старый Новый год.":
    "7 January, because the church calendar stayed Julian. For the same reason the Old New Year is marked on 14 January.",
  "Что отмечают 23 февраля?": "What is marked on 23 February?",
  "День защитника Отечества": "Defender of the Fatherland Day",
  "Праздник ведёт начало от 1918 года. Сегодня поздравляют не только военных, и по массовости он стоит рядом с 8 марта.":
    "The holiday goes back to 1918. Today the greetings go not only to servicemen, and in how widely it is kept it stands beside 8 March.",
  "С какого года 8 марта стало в стране нерабочим днём?":
    "Since which year has 8 March been a non-working day in the country?",
  "С 1918 года": "Since 1918",
  "С 1966 года": "Since 1966",
  "С 1966 года. Сам праздник отмечался задолго до этого, но выходным сделался только тогда.":
    "Since 1966. The holiday itself was kept long before that, but only then did it become a day off.",
  "Как назывался праздник 1 мая до 1992 года?":
    "What was the holiday of 1 May called before 1992?",
  "Праздник Весны и Труда": "The Festival of Spring and Labour",
  "День международной солидарности трудящихся": "The Day of International Workers' Solidarity",
  "День трудовой славы": "The Day of Labour Glory",
  "День рабочего класса": "Working Class Day",
  "Название сменилось в 1992 году на Праздник Весны и Труда. Сам выходной сохранился.":
    "The name changed in 1992 to the Festival of Spring and Labour. The day off itself stayed.",
  "Что происходит в Москве 9 мая?": "What happens in Moscow on 9 May?",
  "Парад на Красной площади и шествие «Бессмертного полка»":
    "A parade on Red Square and the Immortal Regiment march",
  "Выборы в Государственную Думу": "Elections to the State Duma",
  "Открытие учебного года": "The opening of the school year",
  "Ежегодное послание парламенту": "The yearly address to parliament",
  "День Победы — с парадом, минутой молчания и шествием «Бессмертного полка», которое за последние годы стало частью дня по всей стране.":
    "Victory Day — with a parade, a minute of silence and the Immortal Regiment march, which in recent years has become part of the day across the whole country.",
  "Какой праздник 4 ноября заменил в календаре?":
    "Which holiday did 4 November replace in the calendar?",
  "7 ноября, годовщину Октябрьской революции":
    "7 November, the anniversary of the October Revolution",
  "12 декабря, День Конституции": "12 December, Constitution Day",
  "День народного единства введён в 2005 году вместо годовщины революции. Он посвящён освобождению Москвы ополчением Минина и Пожарского в 1612 году.":
    "National Unity Day was brought in in 2005 in place of the anniversary of the revolution. It marks the freeing of Moscow by the militia of Minin and Pozharsky in 1612.",
  "Каким событиям посвящён День народного единства?": "Which events does National Unity Day mark?",
  "Событиям 1612 года": "The events of 1612",
  "Событиям 1812 года": "The events of 1812",
  "Событиям 1917 года": "The events of 1917",
  "Событиям 1991 года": "The events of 1991",
  "Освобождению Москвы от польско-литовского гарнизона ополчением Минина и Пожарского, что положило конец Смутному времени.":
    "The freeing of Moscow from the Polish-Lithuanian garrison by the militia of Minin and Pozharsky, which put an end to the Time of Troubles.",
  "Что отмечают 12 апреля?": "What is marked on 12 April?",
  "День знаний": "Knowledge Day",
  "День космонавтики": "Cosmonautics Day",
  "День памяти и скорби": "The Day of Memory and Sorrow",
  "День флага": "Flag Day",
  "День космонавтики, в память о полёте Гагарина в 1961 году. Это памятная дата, а не выходной.":
    "Cosmonautics Day, in memory of Gagarin's flight in 1961. It is a commemorative date, not a day off.",
  "Что происходит 1 сентября?": "What happens on 1 September?",
  "День знаний: линейки, первый звонок и цветы учителям":
    "Knowledge Day: assemblies, the first bell and flowers for the teachers",
  "День города в Москве": "City Day in Moscow",
  "Начало финансового года": "The start of the financial year",
  "День работника образования": "Education Worker's Day",
  "День знаний. Он рабочий, но школы начинают год торжественной линейкой, а первоклассники дают первый звонок.":
    "Knowledge Day. It is a working day, but the schools open the year with a ceremonial assembly, and the first-year pupils ring the first bell.",
  "Чему посвящено 22 июня?": "What is 22 June devoted to?",
  "Дню Победы": "Victory Day",
  "Дню памяти и скорби, годовщине начала войны в 1941 году":
    "The Day of Memory and Sorrow, the anniversary of the start of the war in 1941",
  "Дню России": "Russia Day",
  "Дню защитника Отечества": "Defender of the Fatherland Day",
  "В этот день в 1941 году началась война. Флаги приспускают, а ночью проводят акцию «Свеча памяти».":
    "On that day in 1941 the war began. Flags are lowered to half-mast, and at night the Candle of Remembrance is held.",
  "Что такое Масленица?": "What is Maslenitsa?",
  "Неделя перед Великим постом, с блинами и сожжением чучела зимы":
    "The week before Lent, with pancakes and the burning of an effigy of winter",
  "Праздник урожая осенью": "A harvest festival in autumn",
  "Название новогодних каникул": "The name of the New Year holidays",
  "Ярмарка в честь Дня города": "A fair for City Day",
  "Народный праздник проводов зимы, привязанный к церковному календарю: его дата зависит от даты Пасхи и потому подвижна.":
    "A folk festival seeing winter off, tied to the church calendar: its date depends on the date of Easter and so moves.",
  "Какова была разница между юлианским и григорианским календарями при переходе 1918 года?":
    "What was the difference between the Julian and Gregorian calendars at the changeover of 1918?",
  "Семь дней": "Seven days",
  "Десять дней": "Ten days",
  "Тринадцать дней": "Thirteen days",
  "Тридцать дней": "Thirty days",
  "Тринадцать дней. Отсюда и Рождество 7 января, и старый Новый год 14 января: обе даты — прежние числа, пересчитанные на новый календарь.":
    "Thirteen days. Hence Christmas on 7 January and the Old New Year on 14 January: both are the old dates counted onto the new calendar.",
  "Как статья 80 называет Президента?": "What does Article 80 call the President?",
  "Главой исполнительной власти": "The head of the executive",
  "Главой государства": "The head of state",
  "Председателем Правительства": "The Chairman of the Government",
  "Главой парламента": "The head of parliament",
  "Глава государства и гарант Конституции. Он не отнесён ни к одной из трёх ветвей власти, а стоит над разделением, установленным статьёй 10.":
    "The head of state and the guarantor of the Constitution. He is not placed in any of the three branches of power but stands above the separation Article 10 sets up.",
  "Каким был срок полномочий Президента до поправки 2008 года?":
    "How long was the President's term before the amendment of 2008?",
  "Семь лет": "Seven years",
  "Четыре года. Той же поправкой срок полномочий Государственной Думы увеличили с четырёх лет до пяти.":
    "Four years. The same amendment raised the term of the State Duma from four years to five.",
  "Сколько лет кандидат в Президенты должен постоянно проживать в России?":
    "How many years must a candidate for President have lived in Russia without a break?",
  "Десять": "Ten",
  "Двадцать пять": "Twenty-five",
  "Такого требования нет": "There is no such requirement",
  "Двадцать пять лет — требование, добавленное поправками 2020 года. Тогда же появился запрет на иностранное гражданство и вид на жительство, в том числе в прошлом.":
    "Twenty-five years — a requirement added by the amendments of 2020. The ban on foreign citizenship and on a foreign residence permit, past ones included, appeared then too.",
  "Какое слово убрали из ограничения на сроки поправками 2020 года?":
    "Which word did the amendments of 2020 take out of the limit on terms?",
  "Слово «двух»": "The word two",
  "Слово «подряд»": "The word consecutive",
  "Слово «шесть»": "The word six",
  "Ничего не убирали": "Nothing was taken out",
  "Прежде в тексте стояло «двух сроков подряд». После поправки осталось ограничение двумя сроками без этой оговорки.":
    "The text used to say two consecutive terms. After the amendment the limit of two terms stayed without that qualifier.",
  "Кого Президент назначает после утверждения кандидатуры Государственной Думой?":
    "Whom does the President appoint after the State Duma has approved the nomination?",
  "Председателя Правительства": "The Chairman of the Government",
  "Генерального прокурора": "The Prosecutor General",
  "Председателя Конституционного Суда": "The Chairman of the Constitutional Court",
  "Председателя Центрального банка": "The Chairman of the Central Bank",
  "Председателя Правительства. Генерального прокурора и судей высших судов назначает Совет Федерации по представлению Президента, а Председателя Центрального банка — Дума.":
    "The Chairman of the Government. The Federation Council appoints the Prosecutor General and the judges of the higher courts on the President's proposal, and the Duma the Chairman of the Central Bank.",
  "Кто является Верховным Главнокомандующим Вооружёнными Силами?":
    "Who is the Supreme Commander-in-Chief of the Armed Forces?",
  "Министр обороны": "The Minister of Defence",
  "Начальник Генерального штаба": "The Chief of the General Staff",
  "Президент, по статье 87. Он же вводит военное положение — с последующим утверждением Советом Федерации.":
    "The President, under Article 87. He also declares martial law — with the Federation Council approving it afterwards.",
  "Какой орган утверждает указ Президента о введении военного положения?":
    "Which body approves the President's decree declaring martial law?",
  "Совет Федерации. То же касается чрезвычайного положения: указ издаёт Президент, а утверждает верхняя палата.":
    "The Federation Council. The same goes for a state of emergency: the President issues the decree and the upper chamber approves it.",
  "Какое право Президента позволяет ему не подписать принятый закон?":
    "Which power lets the President not sign a law that has been passed?",
  "Право роспуска": "The power of dissolution",
  "Право вето": "The power of veto",
  "Право помилования": "The power of pardon",
  "Право законодательной инициативы": "The power of legislative initiative",
  "Вето. Оно преодолевается повторным принятием закона двумя третями голосов в обеих палатах, после чего Президент обязан подписать.":
    "The veto. It is overridden by passing the law again with two thirds of the votes in both chambers, after which the President has to sign.",
  "Что из перечисленного относится к полномочиям Президента?":
    "Which of these is among the President's powers?",
  "Помилование": "Pardon",
  "Амнистия": "Amnesty",
  "Утверждение бюджета": "Approving the budget",
  "Установление местных налогов": "Setting local taxes",
  "Помилование — акт в отношении конкретного осуждённого. Амнистию объявляет Государственная Дума, а бюджет утверждает парламент по представлению Правительства.":
    "A pardon is an act about one particular convicted person. The State Duma declares an amnesty, and parliament approves the budget on the Government's submission.",
  "Какая палата выдвигает обвинение при отрешении Президента от должности?":
    "Which chamber brings the charge when the President is removed from office?",
  "Государственная Дума двумя третями голосов": "The State Duma, by two thirds of the votes",
  "Совет Федерации простым большинством": "The Federation Council, by a simple majority",
  "Обе палаты совместно": "Both chambers together",
  "Дума выдвигает обвинение, суды дают заключения, а решение принимает Совет Федерации двумя третями. Процедура ни разу не была доведена до конца.":
    "The Duma brings the charge, the courts give their opinions, and the Federation Council decides by two thirds. The procedure has never once been carried through.",
  "В какой срок должно быть принято решение об отрешении Президента?":
    "Within what time must the decision to remove the President be taken?",
  "В месячный": "Within a month",
  "В трёхмесячный": "Within three months",
  "В шестимесячный": "Within six months",
  "Три месяца с момента выдвижения обвинения. Если Совет Федерации не уложится в срок, обвинение считается отклонённым.":
    "Three months from the bringing of the charge. If the Federation Council does not keep to the time, the charge counts as rejected.",
  "Где находится официальная резиденция Президента?":
    "Where is the President's official residence?",
  "В Доме Правительства": "In the House of Government",
  "В Московском Кремле": "In the Moscow Kremlin",
  "На Охотном Ряду": "On Okhotny Ryad",
  "На Большой Дмитровке": "On Bolshaya Dmitrovka",
  "Московский Кремль. Дом Правительства занимает Председатель Правительства, а Охотный Ряд и Большая Дмитровка — это Дума и Совет Федерации.":
    "The Moscow Kremlin. The Chairman of the Government sits in the House of Government, and Okhotny Ryad and Bolshaya Dmitrovka are the Duma and the Federation Council.",
  "Что Президент приносит при вступлении в должность?":
    "What does the President take on entering office?",
  "Присягу народу": "An oath to the people",
  "Отчёт парламенту": "A report to parliament",
  "Клятву на Конституции перед судом": "A vow on the Constitution before a court",
  "Ничего не требуется": "Nothing is required",
  "Присягу, текст которой записан в статье 82. С этого момента он приступает к исполнению полномочий.":
    "The oath whose text is written in Article 82. From that moment he takes up his powers.",
  "Как называется верхняя палата российского парламента?":
    "What is the upper chamber of the Russian parliament called?",
  "Верховный Совет": "The Supreme Soviet",
  "Сенат республик": "The Senate of the Republics",
  "Совет Федерации — палата регионов. Государственная Дума нижняя, и именно в неё вносятся законопроекты.":
    "The Federation Council — the chamber of the regions. The State Duma is the lower one, and it is there that bills are introduced.",
  "На какой срок избирается Государственная Дума?": "For how long is the State Duma elected?",
  "Пять лет — с поправки 2008 года; прежде было четыре. Президент избирается на шесть лет: эти две цифры легко перепутать.":
    "Five years, since the amendment of 2008; before that it was four. The President is elected for six: those two figures are easy to confuse.",
  "Сколько депутатов Думы избирается по одномандатным округам?":
    "How many Duma deputies are elected in single-member constituencies?",
  "Сто": "A hundred",
  "Все четыреста пятьдесят": "All four hundred and fifty",
  "Половина, то есть 225. Другая половина проходит по партийным спискам в едином федеральном округе. Система называется смешанной.":
    "Half, that is 225. The other half come in on party lists in a single federal constituency. The system is called mixed.",
  "Сколько сенаторов вправе назначить Президент по поправкам 2020 года?":
    "How many senators may the President appoint under the amendments of 2020?",
  "Не более десяти": "No more than ten",
  "Не более тридцати": "No more than thirty",
  "Не более пятидесяти": "No more than fifty",
  "Ни одного": "None at all",
  "Не более тридцати. К ним добавляются по два представителя от каждого субъекта и бывшие президенты, которые могут стать пожизненными сенаторами.":
    "No more than thirty. To them are added two representatives from each federal subject and former presidents, who may become senators for life.",
  "Почему Совет Федерации нельзя распустить?": "Why can the Federation Council not be dissolved?",
  "Так решил Конституционный Суд": "Because the Constitutional Court so decided",
  "Он не избирается целиком: его состав меняется постепенно, вслед за выборами в регионах":
    "Because it is not elected as a whole: its membership changes gradually, following the elections in the regions",
  "Его защищает международный договор": "Because an international treaty protects it",
  "Его можно распустить, но только с согласия Думы":
    "It can be dissolved, but only with the Duma's agreement",
  "У палаты нет единого срока полномочий, поэтому она работает непрерывно. Роспуск предусмотрен только для Государственной Думы, и лишь в двух случаях.":
    "The chamber has no single term of office, so it works without a break. Dissolution is provided for only for the State Duma, and only in two cases.",
  "С какого возраста можно стать сенатором Российской Федерации?":
    "From what age can a person become a senator of the Russian Federation?",
  "С 25 лет": "From 25",
  "С тридцати лет. Двадцать один — для депутата Думы, тридцать пять — для Президента.":
    "From thirty. Twenty-one is for a Duma deputy, thirty-five for the President.",
  "Сколько времени есть у Совета Федерации на рассмотрение принятого Думой закона?":
    "How long does the Federation Council have to consider a law the Duma has passed?",
  "Пять дней": "Five days",
  "Четырнадцать дней": "Fourteen days",
  "Срок не ограничен": "There is no time limit",
  "Четырнадцать дней. Пять дней — срок, в который Дума передаёт закон в верхнюю палату, а четырнадцать дней есть и у Президента на подписание.":
    "Fourteen days. Five days is the time in which the Duma passes the law to the upper chamber, and the President has fourteen days to sign as well.",
  "Какой большинство нужно Думе, чтобы принять федеральный конституционный закон?":
    "Which majority does the Duma need to pass a federal constitutional law?",
  "Простое большинство": "A simple majority",
  "Абсолютное большинство": "An absolute majority",
  "Две трети голосов депутатов, а в Совете Федерации — три четверти. Обычный федеральный закон принимается простым большинством.":
    "Two thirds of the deputies' votes, and three quarters in the Federation Council. An ordinary federal law is passed by a simple majority.",
  "Как преодолевается вето Президента?": "How is the President's veto overridden?",
  "Повторным голосованием только в Думе": "By a second vote in the Duma alone",
  "Двумя третями голосов в обеих палатах": "By two thirds of the votes in both chambers",
  "Решением Конституционного Суда": "By a ruling of the Constitutional Court",
  "Вето преодолеть нельзя": "The veto cannot be overridden",
  "Обе палаты должны повторно принять закон в прежней редакции двумя третями голосов, после чего Президент обязан его подписать в течение семи дней.":
    "Both chambers have to pass the law again in its former wording with two thirds of the votes, after which the President has to sign it within seven days.",
  "Какие законы Совет Федерации обязан рассмотреть непременно?":
    "Which laws must the Federation Council consider without fail?",
  "Все без исключения": "All of them without exception",
  "О бюджете, налогах, ратификации договоров, границе, войне и мире":
    "Those on the budget, taxes, the ratification of treaties, the border, war and peace",
  "Только уголовные": "Criminal ones only",
  "Только те, что внёс Президент": "Only those the President introduced",
  "Перечень в статье 106. Остальные законы, не рассмотренные в четырнадцатидневный срок, считаются одобренными молчанием.":
    "The list is in Article 106. Other laws not considered within fourteen days count as approved by silence.",
  "Кто объявляет амнистию?": "Who declares an amnesty?",
  "Государственная Дума. Помилование в отношении конкретного человека — полномочие Президента: два разных акта и два разных органа.":
    "The State Duma. A pardon for one particular person is the President's power: two different acts and two different bodies.",
  "Кто назначает выборы Президента Российской Федерации?":
    "Who calls the election of the President of the Russian Federation?",
  "Центральная избирательная комиссия": "The Central Election Commission",
  "Совет Федерации. А выборы Государственной Думы, наоборот, назначает Президент: полномочия здесь намеренно перекрещены.":
    "The Federation Council. The President, the other way round, calls the State Duma election: the powers here are deliberately crossed.",
  "В каких случаях палаты Федерального Собрания собираются совместно?":
    "In which cases do the chambers of the Federal Assembly meet together?",
  "Каждую неделю": "Every week",
  "Для посланий Президента и выступлений глав иностранных государств":
    "For the President's addresses and for speeches by foreign heads of state",
  "Для принятия любого закона": "To pass any law",
  "Никогда": "Never",
  "По общему правилу палаты заседают раздельно. Совместные заседания — исключение, названное в статье 100.":
    "As a rule the chambers sit separately. Joint sittings are the exception named in Article 100.",
  "Кто входит в состав Правительства?": "Who makes up the Government?",
  "Председатель, его заместители и федеральные министры":
    "The Chairman, his deputies and the federal ministers",
  "Президент и министры": "The President and the ministers",
  "Депутаты правящей партии": "The deputies of the governing party",
  "Главы субъектов Федерации": "The heads of the federal subjects",
  "Состав определён статьёй 110. Президент в Правительство не входит: он глава государства, а не глава правительства.":
    "The composition is set by Article 110. The President is not part of the Government: he is the head of state, not the head of government.",
  "Какую власть осуществляет Правительство?": "Which power does the Government exercise?",
  "Законодательную": "The legislative",
  "Исполнительную": "The executive",
  "Судебную": "The judicial",
  "Учредительную": "The constituent",
  "Исполнительную. Законодательную осуществляет Федеральное Собрание, судебную — суды: разделение закреплено статьёй 10.":
    "The executive. The Federal Assembly exercises the legislative and the courts the judicial: the separation is fixed by Article 10.",
  "Как изменилась роль Думы при назначении Председателя Правительства после 2020 года?":
    "How did the Duma's role in appointing the Chairman of the Government change after 2020?",
  "Она перестала участвовать": "It stopped taking part",
  "Вместо «согласия» Дума теперь «утверждает» кандидатуру":
    "Instead of giving consent the Duma now approves the nomination",
  "Она получила право сама выдвигать кандидата":
    "It gained the right to put forward a candidate itself",
  "Ничего не изменилось": "Nothing changed",
  "Формулировка стала жёстче: Президент назначает Председателя после утверждения Думой. Право трижды отклонить кандидатуру, с последующим роспуском, при этом сохранилось.":
    "The wording became firmer: the President appoints the Chairman after the Duma's approval. The right to reject a nomination three times, with dissolution to follow, stayed all the same.",
  "Кого из министров Дума НЕ утверждает?": "Which minister does the Duma NOT approve?",
  "Министра финансов": "The Minister of Finance",
  "Министра обороны": "The Minister of Defence",
  "Министра просвещения": "The Minister of Education",
  "Министра транспорта": "The Minister of Transport",
  "Руководителей силового блока — обороны, внутренних дел, иностранных дел, юстиции, спецслужб — назначает Президент после консультаций с Советом Федерации.":
    "The President appoints the heads of the security block — defence, internal affairs, foreign affairs, justice, the special services — after consulting the Federation Council.",
  "Кто разрабатывает и представляет федеральный бюджет?":
    "Who draws up and submits the federal budget?",
  "Центральный банк": "The Central Bank",
  "Счётная палата": "The Accounts Chamber",
  "Правительство разрабатывает и вносит бюджет, а утверждает его парламент законом. Счётная палата проверяет исполнение.":
    "The Government draws up and introduces the budget, and parliament approves it by law. The Accounts Chamber checks that it is carried out.",
  "Что происходит, если Дума повторно выразит недоверие Правительству в течение трёх месяцев?":
    "What happens if the Duma votes no confidence in the Government a second time within three months?",
  "Правительство обязано уйти в отставку": "The Government has to resign",
  "Президент объявляет об отставке Правительства либо распускает Думу":
    "The President announces the Government's resignation or dissolves the Duma",
  "Вопрос передаётся в Совет Федерации": "The matter goes to the Federation Council",
  "Недоверие не влечёт последствий": "A vote of no confidence has no consequences",
  "Выбор остаётся за Президентом, и это второе из двух конституционных оснований роспуска Думы. Первое — трёхкратное отклонение кандидатуры Председателя.":
    "The choice stays with the President, and this is the second of the two constitutional grounds for dissolving the Duma. The first is rejecting the nomination for Chairman three times.",
  "Может ли Правительство само поставить перед Думой вопрос о доверии?":
    "Can the Government itself put the question of confidence to the Duma?",
  "Да": "Yes",
  "Нет": "No",
  "Только с согласия Президента": "Only with the President's consent",
  "Только раз в год": "Only once a year",
  "Может, и это зеркальная процедура к недоверию. При отказе в доверии Президент в течение семи дней принимает решение об отставке Правительства или о роспуске Думы.":
    "It can, and this is the mirror of the no-confidence procedure. If confidence is refused, the President decides within seven days on the Government's resignation or the Duma's dissolution.",
  "Кто вправе отменить постановление Правительства?": "Who may annul a decree of the Government?",
  "Президент, если оно противоречит Конституции, законам или его указам":
    "The President, if it goes against the Constitution, the laws or his own decrees",
  "Никто": "Nobody",
  "Это одна из связок между Президентом и исполнительной властью. Постановления обязательны на всей территории, но стоят ниже Конституции, законов и указов.":
    "It is one of the ties between the President and the executive. Government decrees are binding across the whole territory, but stand below the Constitution, the laws and presidential decrees.",
  "Как в обиходе называют Дом Правительства в Москве?":
    "What is the House of Government in Moscow called in everyday speech?",
  "Белый дом": "The White House",
  "Серый дом": "The Grey House",
  "Красный дом": "The Red House",
  "Дом Советов": "The House of Soviets",
  "Белый дом, по цвету здания на Краснопресненской набережной. Кремль — резиденция Президента, а не Правительства.":
    "The White House, after the colour of the building on Krasnopresnenskaya Embankment. The Kremlin is the President's residence, not the Government's.",
  "Какая из этих сфер названа в статье 114 среди задач Правительства?":
    "Which of these areas is named in Article 114 among the Government's tasks?",
  "Толкование Конституции": "Interpreting the Constitution",
  "Единая политика в области культуры, науки, образования и здравоохранения":
    "A single policy in culture, science, education and health",
  "Назначение судей": "Appointing judges",
  "Объявление амнистии": "Declaring an amnesty",
  "Толкует Конституцию Конституционный Суд, судей назначает Совет Федерации, амнистию объявляет Дума. Правительство отвечает за исполнение и за отраслевую политику.":
    "The Constitutional Court interprets the Constitution, the Federation Council appoints judges, the Duma declares an amnesty. The Government answers for carrying things out and for policy in each field.",
  "Применялась ли когда-нибудь норма о роспуске Думы после трёхкратного отклонения кандидатуры премьера?":
    "Has the rule on dissolving the Duma after three rejections of a nomination for prime minister ever been used?",
  "Да, дважды": "Yes, twice",
  "Нет, ни разу": "No, never once",
  "Да, в 1998 году": "Yes, in 1998",
  "Она была отменена в 2020 году": "It was abolished in 2020",
  "Ни разу. В 1998 году дело дошло до третьего голосования, но кандидатура была утверждена. Норма работает самим фактом своего существования.":
    "Never once. In 1998 it came to a third vote, but the nomination was approved. The rule works by the very fact that it exists.",
  "Влечёт ли избрание новой Государственной Думы отставку Правительства?":
    "Does the election of a new State Duma bring the Government's resignation?",
  "Да, автоматически": "Yes, automatically",
  "Нет: Правительство слагает полномочия перед вновь избранным Президентом":
    "No: the Government lays down its powers before a newly elected President",
  "Да, если сменилось большинство": "Yes, if the majority has changed",
  "Решает Совет Федерации": "The Federation Council decides",
  "Полномочия слагаются перед Президентом, а не перед Думой. Смена состава нижней палаты сама по себе судьбу Правительства не решает.":
    "The powers are laid down before the President, not before the Duma. A change in the lower chamber does not by itself decide the Government's fate.",
  "Где находится Дом Правительства?": "Where is the House of Government?",
  "На Краснопресненской набережной": "On Krasnopresnenskaya Embankment",
  "В Кремле": "In the Kremlin",
  "На Краснопресненской набережной. Охотный Ряд — Государственная Дума, Большая Дмитровка — Совет Федерации, Кремль — Президент.":
    "On Krasnopresnenskaya Embankment. Okhotny Ryad is the State Duma, Bolshaya Dmitrovka the Federation Council, the Kremlin the President.",
  "Что прямо запрещает статья 118 Конституции?":
    "What does Article 118 of the Constitution forbid outright?",
  "Суд присяжных": "Trial by jury",
  "Создание чрезвычайных судов": "The creation of emergency courts",
  "Апелляцию по уголовным делам": "Appeal in criminal cases",
  "Участие граждан в правосудии": "Citizens taking part in justice",
  "Чрезвычайные суды не допускаются. Суд присяжных, наоборот, прямо предусмотрен Конституцией как форма участия граждан в правосудии.":
    "Emergency courts are not allowed. Trial by jury, on the contrary, is expressly provided for by the Constitution as a form of citizens taking part in justice.",
  "Каким трём требованиям должен отвечать судья?": "Which three requirements must a judge meet?",
  "Возраст 25 лет, высшее юридическое образование, стаж пять лет":
    "Age 25, a higher legal education, five years of practice",
  "Возраст 30 лет, любое высшее образование, стаж три года":
    "Age 30, any higher education, three years of practice",
  "Возраст 21 год, юридическое образование, без требований к стажу":
    "Age 21, a legal education, no requirement of practice",
  "Возраст 35 лет, учёная степень, стаж десять лет":
    "Age 35, an academic degree, ten years of practice",
  "Для высших судов требования выше, но это общий минимум по статье 119. Судьи независимы, несменяемы и неприкосновенны.":
    "For the higher courts the requirements are stiffer, but this is the general minimum under Article 119. Judges are independent, irremovable and immune.",
  "К чьей системе относятся мировые судьи?": "To whose system do justices of the peace belong?",
  "К федеральным судам": "To the federal courts",
  "К судам субъектов Федерации": "To the courts of the federal subjects",
  "К муниципальным органам": "To the municipal bodies",
  "К арбитражной ветви": "To the arbitration branch",
  "Мировые судьи — суды субъектов, а не федеральные. Они рассматривают самые простые гражданские и часть уголовных дел.":
    "Justices of the peace are courts of the federal subjects, not federal ones. They hear the simplest civil cases and some criminal ones.",
  "Какие споры рассматривают арбитражные суды?": "Which disputes do the arbitration courts hear?",
  "Уголовные дела": "Criminal cases",
  "Экономические споры между организациями и предпринимателями":
    "Economic disputes between organisations and business people",
  "Семейные дела": "Family cases",
  "Жалобы на законы": "Complaints against laws",
  "Это отдельная ветвь внутри судебной системы. Жалобы на законы рассматривает Конституционный Суд, а уголовные дела — суды общей юрисдикции.":
    "It is a separate branch inside the court system. The Constitutional Court hears complaints against laws, and the courts of general jurisdiction criminal cases.",
  "Через сколько инстанций обычно проходит дело?":
    "Through how many instances does a case usually pass?",
  "Через одну": "Through one",
  "Через две": "Through two",
  "Через три": "Through three",
  "Через пять": "Through five",
  "Первая инстанция, апелляция и кассация. Есть ещё надзорная инстанция в Верховном Суде, но туда доходят немногие дела.":
    "The first instance, appeal and cassation. There is also a supervisory instance in the Supreme Court, but few cases reach it.",
  "Зачем в 2019 году создали отдельные кассационные и апелляционные суды?":
    "Why were separate cassation and appeal courts created in 2019?",
  "Чтобы разгрузить мировых судей": "To take the load off the justices of the peace",
  "Чтобы проверка шла не в том же регионе, где выносилось решение":
    "So that the review would not be in the same region where the decision was given",
  "Чтобы заменить арбитражные суды": "To replace the arbitration courts",
  "Чтобы сократить число инстанций": "To cut the number of instances",
  "Прежде апелляцию на решение областного суда рассматривал тот же областной суд другим составом. Окружные суды разорвали эту связку.":
    "An appeal against a regional court's decision used to be heard by that same regional court with a different bench. The district courts broke that tie.",
  "Какие дела относятся к ведению Верховного Суда?": "Which cases fall to the Supreme Court?",
  "Гражданские, уголовные, административные и экономические споры":
    "Civil, criminal, administrative and economic disputes",
  "Только споры между органами власти": "Only disputes between organs of power",
  "Только жалобы на законы": "Only complaints against laws",
  "После упразднения Высшего Арбитражного Суда в 2014 году экономические споры тоже перешли к нему. Жалобы на законы остались у Конституционного Суда.":
    "After the Higher Arbitration Court was abolished in 2014, economic disputes passed to it as well. Complaints against laws stayed with the Constitutional Court.",
  "Какое значение имеют разъяснения Верховного Суда по вопросам судебной практики?":
    "What weight do the Supreme Court's explanations on questions of court practice carry?",
  "Они носят рекомендательный характер и почти не используются":
    "They are advisory and are hardly used",
  "Они фактически определяют, как нижестоящие суды читают закон":
    "In practice they decide how the lower courts read the law",
  "Они имеют силу федерального закона": "They have the force of a federal law",
  "Они обязательны только для арбитражных судов": "They bind the arbitration courts only",
  "Формально это разъяснения, а не нормы. На практике постановления Пленума задают единообразие и решают, какое толкование закона будет применяться по всей стране.":
    "Formally they are explanations, not rules. In practice the decisions of the Plenum set uniformity and decide which reading of the law will be applied across the whole country.",
  "Что происходит с нормой, признанной Конституционным Судом неконституционной?":
    "What happens to a rule the Constitutional Court has found unconstitutional?",
  "Она утрачивает силу": "It loses force",
  "Она применяется до отмены парламентом": "It applies until parliament repeals it",
  "Она действует ещё год": "It stays in force for another year",
  "Её применение решает каждый суд отдельно": "Each court decides separately whether to apply it",
  "Норма утрачивает силу, и отдельного решения парламента для этого не требуется. Законодателю остаётся привести закон в порядок.":
    "The rule loses force, and no separate decision of parliament is needed for that. It is left to the legislator to put the law in order.",
  "Какое из этих полномочий принадлежит Конституционному Суду?":
    "Which of these powers belongs to the Constitutional Court?",
  "Пересмотр приговоров по уголовным делам": "Reviewing sentences in criminal cases",
  "Рассмотрение экономических споров": "Hearing economic disputes",
  "Назначение судей районных судов": "Appointing the judges of district courts",
  "Толкование Конституции, разрешение споров о компетенции, проверка конституционности законов. Приговоры и экономические споры — к Верховному Суду.":
    "Interpreting the Constitution, settling disputes about competence, checking that laws are constitutional. Sentences and economic disputes go to the Supreme Court.",
  "Кто назначает Генерального прокурора?": "Who appoints the Prosecutor General?",
  "Президент единолично": "The President alone",
  "Совет Федерации по представлению Президента":
    "The Federation Council, on the President's proposal",
  "Совет Федерации по представлению Президента — тот же порядок, что и для судей высших судов. Прокуратура при этом судом не является.":
    "The Federation Council, on the President's proposal — the same procedure as for the judges of the higher courts. The prosecution service is not a court, though.",
  "Как устроена прокуратура по статье 129?":
    "How is the prosecution service built under Article 129?",
  "Как единая централизованная система с подчинением вышестоящим прокурорам":
    "As a single centralised system in which each prosecutor answers to the one above",
  "Как система независимых региональных прокуратур":
    "As a system of independent regional prosecution offices",
  "Как подразделение Министерства юстиции": "As a department of the Ministry of Justice",
  "Как часть судебной системы": "As part of the court system",
  "Единая централизованная система во главе с Генеральным прокурором. Она надзирает за соблюдением законов и поддерживает обвинение, но не судит.":
    "A single centralised system headed by the Prosecutor General. It watches over the keeping of the laws and brings the prosecution, but it does not judge.",
  "Кем осуществляется правосудие в России?": "By whom is justice administered in Russia?",
  "Только судом": "By the court alone",
  "Судом и прокуратурой": "By the court and the prosecution service",
  "Судом и следственными органами": "By the court and the investigative bodies",
  "Судом и органами власти субъектов": "By the court and the authorities of the federal subjects",
  "Статья 118: правосудие осуществляется только судом. Прокуратура и следствие участвуют в процессе, но приговор выносит суд.":
    "Article 118: justice is administered by the court alone. The prosecution service and the investigation take part in the process, but the court gives the sentence.",
  "С какого возраста наступает право избирать?": "From what age does the right to vote begin?",
  "Активное избирательное право — с восемнадцати лет, вместе с совершеннолетием. Право быть избранным зависит от должности.":
    "The right to vote comes at eighteen, along with majority. The right to be elected depends on the office.",
  "С какого возраста можно быть избранным главой субъекта Федерации?":
    "From what age can a person be elected head of a federal subject?",
  "С тридцати лет — тот же порог, что и для сенатора. Тридцать пять требуется только для Президента.":
    "From thirty — the same threshold as for a senator. Thirty-five is required only for the President.",
  "Кто по статье 32 не имеет права избирать и быть избранным?":
    "Who, under Article 32, has no right to vote or to be elected?",
  "Все, кто находится под следствием": "Everyone under investigation",
  "Признанные судом недееспособными и содержащиеся в местах лишения свободы по приговору":
    "Those a court has found legally incapable and those held in prison under a sentence",
  "Не имеющие постоянной регистрации": "Those with no permanent registration",
  "Не служившие в армии": "Those who have not served in the army",
  "Два исключения, и оба требуют решения суда. Заключение под стражу до приговора права голоса не лишает.":
    "Two exceptions, and both need a court decision. Being held in custody before sentence does not take the vote away.",
  "Какой орган возглавляет систему избирательных комиссий?":
    "Which body heads the system of election commissions?",
  "Министерство юстиции": "The Ministry of Justice",
  "Общественная палата": "The Public Chamber",
  "ЦИК, а ниже — комиссии субъектов, территориальные и участковые. На участках работают наблюдатели от кандидатов и партий.":
    "The Central Election Commission, and below it the commissions of the federal subjects, the territorial ones and the precinct ones. At the polling stations observers from the candidates and the parties are at work.",
  "Что статья 3 называет высшим непосредственным выражением власти народа?":
    "What does Article 3 call the highest direct expression of the people's power?",
  "Референдум и свободные выборы": "A referendum and free elections",
  "Заседания парламента": "The sittings of parliament",
  "Обращения к Президенту": "Petitions to the President",
  "Работу общественных организаций": "The work of public organisations",
  "Оба названы прямо и в одном ряду. Народ осуществляет власть непосредственно и через органы государственной власти и местного самоуправления.":
    "Both are named outright and side by side. The people exercise power directly and through the organs of state power and of local self-government.",
  "Сколько раз проводился общероссийский референдум?":
    "How many times has an all-Russian referendum been held?",
  "Ни разу": "Never once",
  "Дважды": "Twice",
  "Пять раз": "Five times",
  "Каждые пять лет": "Every five years",
  "В 1991 и 1993 годах. Голосование по поправкам 2020 года проводилось в особом порядке и референдумом в строгом смысле не называлось.":
    "In 1991 and 1993. The vote on the 2020 amendments was held under a special procedure and was not called a referendum in the strict sense.",
  "Какое требование закон предъявляет к политической партии?":
    "Which requirement does the law set for a political party?",
  "Наличие региональных отделений более чем в половине субъектов":
    "Regional branches in more than half of the federal subjects",
  "Наличие представительства во всех муниципалитетах": "Representation in every municipality",
  "Согласие Совета Федерации": "The Federation Council's consent",
  "Существование не менее десяти лет": "Existing for at least ten years",
  "Закон о политических партиях требует определённой численности и региональных отделений более чем в половине субъектов Федерации.":
    "The law on political parties requires a certain membership and regional branches in more than half of the federal subjects.",
  "Какая глава Конституции посвящена местному самоуправлению?":
    "Which chapter of the Constitution is given to local self-government?",
  "Третья": "The third",
  "Шестая": "The sixth",
  "Восьмая": "The eighth",
  "Девятая": "The ninth",
  "Восьмая глава, статьи 130–133. Отдельная глава подчёркивает, что местное самоуправление не является нижним этажом государственной власти.":
    "The eighth chapter, Articles 130–133. A chapter of its own underlines that local self-government is not the bottom floor of state power.",
  "Какие из этих образований являются муниципальными?": "Which of these are municipal formations?",
  "Городской округ, муниципальный округ, муниципальный район, поселение":
    "The urban district, the municipal district, the municipal region and the settlement",
  "Область, край, республика": "The oblast, the krai and the republic",
  "Федеральный округ и субъект": "The federal district and the federal subject",
  "Регион и агломерация": "The region and the agglomeration",
  "Области, края и республики — субъекты Федерации, то есть государственный уровень. Федеральные округа вообще не предусмотрены Конституцией.":
    "Oblasts, krais and republics are federal subjects, that is, the state level. Federal districts are not provided for by the Constitution at all.",
  "Что относится к вопросам местного значения?": "What counts as a matter of local importance?",
  "Благоустройство, местные дороги, жилищно-коммунальное хозяйство":
    "Improvement works, local roads, housing and utilities",
  "Оборона и безопасность": "Defence and security",
  "Уголовное законодательство": "Criminal law",
  "Денежная эмиссия": "The issue of money",
  "Оборона, уголовное право и денежная эмиссия — исключительное ведение Федерации. Муниципалитет отвечает за то, что видно из окна.":
    "Defence, criminal law and the issue of money belong to the Federation alone. The municipality answers for what can be seen out of the window.",
  "На каком условии государственные полномочия могут быть переданы муниципалитету?":
    "On what condition may state powers be handed to a municipality?",
  "Только вместе с необходимыми для их исполнения средствами":
    "Only together with the means needed to carry them out",
  "По решению главы муниципалитета": "By a decision of the head of the municipality",
  "Безвозмездно, как обязанность": "Free of charge, as a duty",
  "Передача невозможна": "No handover is possible",
  "Наделение отдельными государственными полномочиями возможно законом и с передачей материальных и финансовых средств. Иначе обязанность повисла бы без денег.":
    "Particular state powers may be given by law and with material and financial means handed over with them. Otherwise the duty would hang there with no money.",
  "Кто назначает Уполномоченного по правам человека в Российской Федерации?":
    "Who appoints the Commissioner for Human Rights in the Russian Federation?",
  "Государственная Дума. Омбудсмен работает независимо от органов власти, и у большинства субъектов есть собственный уполномоченный.":
    "The State Duma. The ombudsman works independently of the authorities, and most federal subjects have a commissioner of their own.",
  "Как избирается глава муниципального образования?":
    "How is the head of a municipal formation chosen?",
  "Порядок различается: прямые выборы, избрание депутатами или по конкурсу":
    "The procedure varies: direct election, election by the deputies, or a competition",
  "Только прямыми выборами по всей стране": "By direct election alone, across the whole country",
  "Его назначает губернатор": "The governor appoints them",
  "Его назначает Президент": "The President appoints them",
  "Способ определяют закон субъекта и устав муниципалитета, поэтому в соседних городах он может быть разным.":
    "The federal subject's law and the municipality's charter decide the way, so it can be different in neighbouring towns.",
  "Как назывался торговый путь, вдоль которого выросла Киевская Русь?":
    "What was the trade route called along which Kievan Rus grew up?",
  "Великий шёлковый путь": "The Great Silk Road",
  "Волжский путь": "The Volga route",
  "Янтарный путь": "The Amber Road",
  "От Балтики по Волхову и Днепру к Чёрному морю и Константинополю. Города вырастали там, где стоило держать перевоз и склад: Новгород, Смоленск, Киев.":
    "From the Baltic along the Volkhov and the Dnieper to the Black Sea and Constantinople. Towns grew where it was worth keeping a crossing and a warehouse: Novgorod, Smolensk, Kiev.",
  "К какому году летопись относит призвание Рюрика?":
    "To which year does the chronicle put the calling of Rurik?",
  "К 862 году": "To 862",
  "К 882 году": "To 882",
  "К 988 году": "To 988",
  "К 1147 году": "To 1147",
  "862 год по «Повести временных лет». 882-й — объединение Новгорода и Киева Олегом, 988-й — Крещение Руси, 1147-й — первое упоминание Москвы.":
    "862, according to the Tale of Bygone Years. 882 is Oleg's joining of Novgorod and Kiev, 988 the baptism of Rus, 1147 the first mention of Moscow.",
  "Кто объединил Новгород и Киев под одной властью?":
    "Who joined Novgorod and Kiev under one rule?",
  "Рюрик": "Rurik",
  "Олег": "Oleg",
  "Владимир": "Vladimir",
  "Олег в 882 году, и он же сделал Киев столицей. С этой даты принято вести начало Киевской Руси.":
    "Oleg in 882, and he made Kiev the capital as well. Kievan Rus is usually counted from that date.",
  "Какой князь крестил Русь?": "Which prince baptised Rus?",
  "Игорь": "Igor",
  "Святослав": "Svyatoslav",
  "Князь Владимир, в 988 году. Решение было и религиозным, и политическим: страна входила в круг христианской Европы.":
    "Prince Vladimir, in 988. The decision was religious and political at once: the country was entering the circle of Christian Europe.",
  "Кто создал славянскую азбуку?": "Who created the Slavonic alphabet?",
  "Кирилл и Мефодий": "Cyril and Methodius",
  "Нестор Летописец": "Nestor the Chronicler",
  "Кириллица создана в IX веке для перевода богослужебных книг на понятный славянам язык. Нестор — летописец, автор «Повести временных лет».":
    "The Cyrillic alphabet was created in the ninth century to translate service books into a language the Slavs could understand. Nestor was a chronicler, the author of the Tale of Bygone Years.",
  "Что заменила Русская Правда в порядке наказаний?":
    "What did the Russkaya Pravda replace in the order of punishments?",
  "Церковный суд": "The church court",
  "Кровную месть": "The blood feud",
  "Ордынский суд": "The court of the Horde",
  "Суд веча": "The court of the veche",
  "Вместо мести устанавливались денежные штрафы, различавшиеся по состоянию потерпевшего. Свод дополнялся при потомках Ярослава.":
    "In place of revenge came fines in money, different according to the standing of the injured party. The code was added to under Yaroslav's descendants.",
  "С кем породнился Ярослав Мудрый через своих дочерей?":
    "With whom did Yaroslav the Wise become related through his daughters?",
  "С королями Франции, Норвегии и Венгрии": "With the kings of France, Norway and Hungary",
  "С ханами степи": "With the khans of the steppe",
  "С императорами Китая": "With the emperors of China",
  "Ни с кем: браки заключались только внутри Руси":
    "With nobody: marriages were made inside Rus only",
  "Русь была частью европейской династической сети, и киевский двор считался желанной партией. Это одна из причин, по которым XI век называют временем расцвета.":
    "Rus was part of the European dynastic network, and the court at Kiev counted as a desirable match. It is one of the reasons the eleventh century is called a time of flowering.",
  "Чем управлялась Новгородская республика?": "How was the Novgorod republic governed?",
  "Наследственным князем": "By a hereditary prince",
  "Вечем — собранием горожан, приглашавшим и изгонявшим князя":
    "By the veche — the assembly of townspeople, which invited the prince and drove him out",
  "Митрополитом": "By the metropolitan",
  "Ханским наместником": "By the khan's governor",
  "Новгород ближе к городской республике, чем к княжеству: князя нанимали как военного руководителя и могли прогнать. Эта традиция кончится в 1478 году.":
    "Novgorod is closer to a city republic than to a principality: the prince was hired as a military leader and could be sent away. That tradition would end in 1478.",
  "Куда сместился центр силы русских земель в XII веке?":
    "Where did the centre of power of the Russian lands move in the twelfth century?",
  "На юго-запад, в Галицко-Волынскую землю": "South-west, to the land of Galicia-Volhynia",
  "На северо-восток, во Владимиро-Суздальскую землю": "North-east, to the land of Vladimir-Suzdal",
  "На север, в Новгород": "North, to Novgorod",
  "Он остался в Киеве": "It stayed in Kiev",
  "При Андрее Боголюбском центр переместился на северо-восток. Из этих земель через двести лет вырастет Москва.":
    "Under Andrei Bogolyubsky the centre moved north-east. Out of those lands Moscow would grow two hundred years later.",
  "О чём говорит «Слово о полку Игореве»?": "What is the Tale of Igor's Campaign about?",
  "О крещении Руси": "About the baptism of Rus",
  "О неудачном походе против половцев и о разобщённости князей":
    "About a failed campaign against the Cumans and about the princes' disunity",
  "О призвании варягов": "About the calling of the Varangians",
  "О Куликовской битве": "About the battle of Kulikovo",
  "Тема поэмы — та же беда, что и у Любечского съезда: князья не действуют вместе. Единственный известный список сгорел в московском пожаре 1812 года.":
    "The subject of the poem is the same trouble as at the congress of Lyubech: the princes do not act together. The only known manuscript burned in the Moscow fire of 1812.",
  "В каком году впервые упоминается Москва?": "In which year is Moscow first mentioned?",
  "В 1147 году": "In 1147",
  "В 1237 году": "In 1237",
  "1147 год. Тогда это небольшой пункт на окраине Владимиро-Суздальской земли; до превращения в центр страны пройдёт около двухсот лет.":
    "1147. It was then a small place on the edge of the land of Vladimir-Suzdal; some two hundred years would pass before it became the centre of the country.",
  "В каком году пал Киев под ударом войск Батыя?": "In which year did Kiev fall to Batu's armies?",
  "В 1223 году": "In 1223",
  "1240 год. Нашествие началось в 1237-м с Рязани, а 1242-й — это Ледовое побоище, событие западного направления.":
    "1240. The invasion began in 1237 with Ryazan, and 1242 is the Battle on the Ice, an event on the western side.",
  "Почему княжества не смогли выставить против Батыя общее войско?":
    "Why could the principalities not put a common army into the field against Batu?",
  "Не хватало оружия": "There were not enough weapons",
  "Из-за раздробленности, закреплённой Любечским съездом":
    "Because of the fragmentation fixed by the congress of Lyubech",
  "Князья были в походе на запад": "The princes were away on a campaign in the west",
  "Мешала зима": "The winter got in the way",
  "Съезд 1097 года закрепил разделение земель между княжескими линиями, и через сто сорок лет каждое княжество оборонялось поодиночке.":
    "The congress of 1097 fixed the division of the lands between the princely lines, and a hundred and forty years later each principality defended itself alone.",
  "Как называлась дань, которую русские земли платили Орде?":
    "What was the tribute called that the Russian lands paid the Horde?",
  "Оброк": "Obrok",
  "Выход": "Vykhod",
  "Тягло": "Tyaglo",
  "Полюдье": "Polyudye",
  "Выход. Собирали его сначала ханские сборщики — баскаки, а позже это право перешло к самим князьям, и с него началось возвышение Москвы.":
    "The vykhod. At first the khan's collectors, the baskaks, gathered it; later the right passed to the princes themselves, and the rise of Moscow began with it.",
  "Кто такие баскаки?": "Who were the baskaks?",
  "Ханские сборщики дани": "The khan's tribute collectors",
  "Русские воеводы": "Russian military commanders",
  "Купцы Великого Новгорода": "Merchants of Novgorod the Great",
  "Монахи-летописцы": "Chronicler monks",
  "Ордынские чиновники, собиравшие выход на местах. Позже сбор передали князьям, и это оказалось решающим преимуществом для Москвы.":
    "Officials of the Horde who gathered the vykhod on the spot. Later the collecting was handed to the princes, and that proved the decisive advantage for Moscow.",
  "Где Александр Невский разбил шведов в 1240 году?":
    "Where did Alexander Nevsky beat the Swedes in 1240?",
  "На Чудском озере": "On Lake Peipus",
  "На Неве": "On the Neva",
  "На Куликовом поле": "On Kulikovo Field",
  "На Угре": "On the Ugra",
  "На Неве, откуда и прозвище. Ледовое побоище на Чудском озере состоялось двумя годами позже, против Ливонского ордена.":
    "On the Neva, which is where the byname comes from. The Battle on the Ice on Lake Peipus came two years later, against the Livonian Order.",
  "Почему Александр Невский не воевал с Ордой?": "Why did Alexander Nevsky not fight the Horde?",
  "Он был родственником хана": "He was a relative of the khan",
  "Воевать одновременно на два фронта было невозможно":
    "Fighting on two fronts at once was impossible",
  "Орда не претендовала на его земли": "The Horde laid no claim to his lands",
  "Ему запретил митрополит": "The metropolitan forbade him",
  "С запада шли Орден и Швеция, с востока — Орда. Выбор в пользу соглашения с Ордой историки обсуждают до сих пор.":
    "From the west came the Order and Sweden, from the east the Horde. Historians are still arguing about the choice to come to terms with the Horde.",
  "Какие два решения Ивана Калиты усилили Москву?":
    "Which two decisions of Ivan Kalita strengthened Moscow?",
  "Право собирать дань и перенос митрополичьей кафедры":
    "The right to collect the tribute and the move of the metropolitan's seat",
  "Строительство флота и открытие университета": "Building a fleet and opening a university",
  "Отказ платить дань и союз с Литвой":
    "Refusing to pay the tribute and an alliance with Lithuania",
  "Введение земских соборов и Судебника": "Bringing in the zemsky sobors and the law code",
  "Деньги и церковный авторитет. Ни того, ни другого не давало географическое положение города — это был результат расчёта.":
    "Money and the authority of the church. The town's position gave it neither: it was the result of calculation.",
  "Против кого сражалось войско Дмитрия Донского на Куликовом поле?":
    "Whom did Dmitry Donskoy's army fight on Kulikovo Field?",
  "Против Батыя": "Batu",
  "Против Мамая": "Mamai",
  "Против Ахмата": "Akhmat",
  "Против Тохтамыша": "Tokhtamysh",
  "Против Мамая. Тохтамыш сжёг Москву через два года после битвы, а Ахмат стоял на Угре ровно столетие спустя.":
    "Mamai. Tokhtamysh burned Moscow two years after the battle, and Akhmat stood on the Ugra exactly a century later.",
  "Сняла ли Куликовская битва ордынскую зависимость?":
    "Did the battle of Kulikovo lift the dependence on the Horde?",
  "Да, сразу же": "Yes, at once",
  "Нет: через два года Тохтамыш сжёг Москву": "No: two years later Tokhtamysh burned Moscow",
  "Да, но только для Москвы": "Yes, but for Moscow only",
  "Зависимости к тому времени уже не было": "There was no dependence by then",
  "Победа показала, что Орду можно побеждать, но зависимость продержалась ещё сто лет, до стояния на Угре в 1480 году.":
    "The victory showed that the Horde could be beaten, but the dependence held for another hundred years, until the stand on the Ugra in 1480.",
  "Кто присоединил Новгород к Московскому государству?":
    "Who joined Novgorod to the Muscovite state?",
  "Иван Калита": "Ivan Kalita",
  "Дмитрий Донской": "Dmitry Donskoy",
  "Иван III в 1478 году. Он вывез вечевой колокол — символ городского самоуправления, и республиканская традиция Новгорода прервалась.":
    "Ivan III in 1478. He carried off the veche bell — the symbol of the town's self-government — and Novgorod's republican tradition was broken.",
  "Какой титул принял Иван III?": "Which title did Ivan III take?",
  "Царь": "Tsar",
  "Государь всея Руси": "Sovereign of All Rus",
  "Император": "Emperor",
  "Великий хан": "Great Khan",
  "«Государь всея Руси». Царём первым венчается Иван IV в 1547 году, а императором станет Пётр I в 1721-м.":
    "Sovereign of All Rus. Ivan IV is the first to be crowned tsar, in 1547, and Peter I becomes emperor in 1721.",
  "Сколько лет длилась ордынская зависимость?": "How long did the dependence on the Horde last?",
  "Около ста лет": "About a hundred years",
  "Около ста сорока лет": "About a hundred and forty years",
  "Около двухсот сорока лет": "About two hundred and forty years",
  "Около трёхсот лет": "About three hundred years",
  "С 1240 по 1480 год — двести сорок лет. Это дольше, чем существовала Российская империя.":
    "From 1240 to 1480 — two hundred and forty years. That is longer than the Russian Empire existed.",
  "Кто написал икону «Троица»?": "Who painted the icon of the Trinity?",
  "Феофан Грек": "Theophanes the Greek",
  "Дионисий": "Dionisy",
  "Симон Ушаков": "Simon Ushakov",
  "Андрей Рублёв, около 1425 года, для Троице-Сергиева монастыря. Икона стала образцом для нескольких поколений иконописцев.":
    "Andrei Rublev, around 1425, for the Trinity-Sergius Monastery. The icon became the model for several generations of icon painters.",
  "Какой герб появился при Иване III?": "Which coat of arms appeared under Ivan III?",
  "Всадник с копьём": "A horseman with a spear",
  "Лев": "A lion",
  "Двуглавый орёл вошёл в русскую геральдику в конце XV века. Всадник — древний московский герб, который позже оказался на груди орла.":
    "The double-headed eagle entered Russian heraldry at the end of the fifteenth century. The horseman is the ancient coat of arms of Moscow, which later came onto the eagle's breast.",
  "Чем московский порядок наследования отличался от порядка в соседних княжествах?":
    "How did the Muscovite order of succession differ from that in the neighbouring principalities?",
  "Наследование шло от отца к сыну, а не дробилось между братьями":
    "The inheritance went from father to son instead of being split among brothers",
  "Наследника выбирало вече": "The veche chose the heir",
  "Княжество делилось поровну между всеми детьми":
    "The principality was divided equally among all the children",
  "Наследника назначал хан": "The khan named the heir",
  "Прямое наследование не давало владениям дробиться. Соседние княжества, наоборот, распадались с каждым поколением.":
    "Direct inheritance kept the holdings from being split. The neighbouring principalities, on the contrary, fell apart with every generation.",
  "В каком году Иван IV венчался на царство?": "In which year was Ivan IV crowned tsar?",
  "В 1497 году": "In 1497",
  "В 1547 году": "In 1547",
  "В 1552 году": "In 1552",
  "1547 год. 1497-й — Судебник Ивана III, 1552-й — взятие Казани, 1480-й — стояние на Угре.":
    "1547. 1497 is Ivan III's law code, 1552 the taking of Kazan, 1480 the stand on the Ugra.",
  "Что такое земский собор?": "What is a zemsky sobor?",
  "Сословное собрание, созывавшееся по решению власти":
    "An assembly of the estates, called together at the ruler's decision",
  "Постоянный парламент": "A standing parliament",
  "Собрание городских ремесленников": "A meeting of the town craftsmen",
  "Собор собирался нерегулярно и представлял сословия, а не избирателей. Но именно он в 1613 году выбрал царя, и этот прецедент запомнился.":
    "The sobor met irregularly and stood for the estates, not for voters. But it was the sobor that chose the tsar in 1613, and that precedent was remembered.",
  "Какое ханство было присоединено в 1552 году?": "Which khanate was taken in 1552?",
  "Астраханское": "Astrakhan",
  "Казанское": "Kazan",
  "Крымское": "Crimea",
  "Сибирское": "Siberia",
  "Казань в 1552-м, Астрахань в 1556-м, и Волга стала русской рекой на всём протяжении. Крым войдёт в состав России только в 1783 году.":
    "Kazan in 1552, Astrakhan in 1556, and the Volga became a Russian river along its whole length. Crimea would come into Russia only in 1783.",
  "Кто начал присоединение Сибири в 1580-е годы?": "Who began the taking of Siberia in the 1580s?",
  "Ермак": "Yermak",
  "Дежнёв": "Dezhnyov",
  "Хабаров": "Khabarov",
  "Беринг": "Bering",
  "Отряд Ермака. Дежнёв в 1648 году пройдёт проливом между Азией и Америкой: путь до Тихого океана занял меньше века.":
    "Yermak's band. In 1648 Dezhnyov would pass through the strait between Asia and America: the way to the Pacific took less than a century.",
  "Что такое опричнина?": "What was the oprichnina?",
  "Особый удел царя с собственным войском, время казней и конфискаций":
    "The tsar's own domain with an army of its own, a time of executions and confiscations",
  "Система сбора налогов": "A system of tax collection",
  "Свод законов Ивана IV": "Ivan IV's code of laws",
  "Название царского двора": "The name of the tsar's court",
  "С 1565 по 1572 год. Массовые казни, разгром Новгорода и разорение центральных уездов вместе с Ливонской войной подорвали хозяйство страны.":
    "From 1565 to 1572. Mass executions, the sacking of Novgorod and the ruin of the central districts, together with the Livonian War, undermined the country's economy.",
  "Что было учреждено в Москве в 1589 году?": "What was set up in Moscow in 1589?",
  "Синод": "The Synod",
  "Земский собор": "The zemsky sobor",
  "Сенат": "The Senate",
  "Патриаршество: русская церковь стала полностью самостоятельной. Пётр I упразднит его и заменит Синодом, а восстановят патриаршество в 1917 году.":
    "The patriarchate: the Russian church became fully independent. Peter I would abolish it and put the Synod in its place, and the patriarchate would be restored in 1917.",
  "Что такое Смутное время?": "What was the Time of Troubles?",
  "Период с 1598 по 1613 год: пресечение династии, самозванцы, голод и интервенция":
    "The period from 1598 to 1613: the end of the dynasty, pretenders, famine and foreign intervention",
  "Годы опричнины": "The years of the oprichnina",
  "Церковный раскол XVII века": "The church schism of the seventeenth century",
  "Восстание Пугачёва": "Pugachev's rising",
  "Государство фактически перестало существовать: в Москве стоял иноземный гарнизон, а власть на местах распалась. Выход нашёлся снизу, через ополчение.":
    "The state in effect stopped existing: a foreign garrison stood in Moscow and power in the provinces fell apart. The way out was found from below, through the militia.",
  "Кто возглавил ополчение, освободившее Москву в 1612 году?":
    "Who led the militia that freed Moscow in 1612?",
  "Минин и Пожарский": "Minin and Pozharsky",
  "Иван Сусанин и Михаил Романов": "Ivan Susanin and Mikhail Romanov",
  "Ермак и Дежнёв": "Yermak and Dezhnyov",
  "Никон и Аввакум": "Nikon and Avvakum",
  "Земский староста Кузьма Минин собрал средства, князь Дмитрий Пожарский возглавил войско. Это событие лежит в основе Дня народного единства.":
    "The town elder Kuzma Minin gathered the money, Prince Dmitry Pozharsky led the army. That event lies behind National Unity Day.",
  "Сколько лет правила династия Романовых?": "How long did the Romanov dynasty rule?",
  "Сто лет": "A hundred years",
  "Двести лет": "Two hundred years",
  "Триста четыре года": "Three hundred and four years",
  "Четыреста лет": "Four hundred years",
  "С 1613 по 1917 год. Первым был избран шестнадцатилетний Михаил, последним стал Николай II.":
    "From 1613 to 1917. The sixteen-year-old Mikhail was the first to be chosen, and Nicholas II was the last.",
  "Что изменил в положении крестьян бессрочный сыск беглых?":
    "What did the unlimited search for runaways change in the position of the peasants?",
  "Крестьянин мог уйти от владельца через десять лет":
    "A peasant could leave their owner after ten years",
  "Крестьянин оказался прикреплён к земле и владельцу навсегда":
    "The peasant became tied to the land and the owner for good",
  "Крестьяне получили право владеть землёй": "Peasants gained the right to own land",
  "Ничего: норма не применялась": "Nothing: the rule was not applied",
  "До Уложения срок сыска был ограничен, и по его истечении беглого не возвращали. С 1649 года эта возможность исчезла.":
    "Before the Code the time for the search was limited, and once it ran out a runaway was not returned. From 1649 that possibility was gone.",
  "Кто провёл церковную реформу середины XVII века?":
    "Who carried out the church reform of the mid-seventeenth century?",
  "Патриарх Никон": "Patriarch Nikon",
  "Протопоп Аввакум": "Archpriest Avvakum",
  "Митрополит Алексий": "Metropolitan Alexy",
  "Патриарх Филарет": "Patriarch Filaret",
  "Никон исправил книги и обряды по греческому образцу. Часть верующих реформу не приняла — произошёл раскол, а Аввакум стал вождём старообрядцев.":
    "Nikon corrected the books and the rites on the Greek model. Some believers did not accept the reform — a schism followed, and Avvakum became the leader of the Old Believers.",
  "Кто такие старообрядцы?": "Who are the Old Believers?",
  "Верующие, не принявшие реформу Никона": "Believers who did not accept Nikon's reform",
  "Монахи древних монастырей": "Monks of the ancient monasteries",
  "Служители дореформенной церкви в Новгороде": "Clergy of the pre-reform church in Novgorod",
  "Последователи католического обряда": "Followers of the Catholic rite",
  "Раскол XVII века отделил их от господствующей церкви на столетия. Старообрядческие общины существуют и сегодня.":
    "The schism of the seventeenth century separated them from the dominant church for centuries. Old Believer communities exist today as well.",
  "Сколько лет действовало Соборное уложение 1649 года?":
    "How long was the Council Code of 1649 in force?",
  "Около двадцати лет": "About twenty years",
  "Около пятидесяти лет": "About fifty years",
  "Почти двести лет": "Almost two hundred years",
  "Оно действует до сих пор": "It is still in force today",
  "Почти двести лет — до кодификации законов в XIX веке. Крепостное право, им закреплённое, отменят в 1861 году.":
    "Almost two hundred years — until the laws were codified in the nineteenth century. The serfdom it fixed would be abolished in 1861.",
  "В каком году был основан Санкт-Петербург?": "In which year was St Petersburg founded?",
  "В 1700 году": "In 1700",
  "1703 год, на отвоёванной у Швеции земле. Столицей он останется более двухсот лет, до 1918 года.":
    "1703, on land taken from Sweden. It would stay the capital for more than two hundred years, until 1918.",
  "Что такое Табель о рангах?": "What is the Table of Ranks?",
  "Список дворянских родов": "A list of noble families",
  "Система чинов, при которой положение зависело от службы, а не от происхождения":
    "A system of ranks in which standing depended on service, not on birth",
  "Перечень налогов": "A list of taxes",
  "Реестр земельных владений": "A register of landholdings",
  "Введена Петром I. Она открыла дорогу наверх людям незнатного происхождения и связала статус с государственной службой.":
    "Brought in by Peter I. It opened the way up for people of humble birth and tied standing to state service.",
  "Сколько лет длилась Северная война?": "How long did the Great Northern War last?",
  "Двенадцать лет": "Twelve years",
  "Двадцать один год": "Twenty-one years",
  "Тридцать лет": "Thirty years",
  "С 1700 по 1721 год. Полтавская победа 1709 года стала переломом, а окончание войны совпало с провозглашением империи.":
    "From 1700 to 1721. The victory at Poltava in 1709 was the turning point, and the end of the war fell together with the proclaiming of the empire.",
  "Что такое эпоха дворцовых переворотов?": "What is the age of palace coups?",
  "Период, когда гвардия несколько раз решала, кто займёт престол":
    "The period when the guards several times decided who would take the throne",
  "Годы строительства дворцов в Петербурге": "The years of palace building in Petersburg",
  "Время войн с Турцией": "The time of the wars with Turkey",
  "Период правления Екатерины II": "The reign of Catherine II",
  "После смерти Петра I престол несколько раз переходил при участии гвардейских полков. Закончилась эпоха воцарением Екатерины II в 1762 году.":
    "After Peter I's death the throne changed hands several times with the guards regiments taking part. The age ended with Catherine II's accession in 1762.",
  "В каком году был присоединён Крым при Екатерине II?":
    "In which year was Crimea taken under Catherine II?",
  "В 1774 году": "In 1774",
  "В 1783 году": "In 1783",
  "В 1812 году": "In 1812",
  "1783 год. К этому же времени относятся освоение Новороссии и основание Одессы, Севастополя и Херсона.":
    "1783. To the same time belong the settling of Novorossiya and the founding of Odessa, Sevastopol and Kherson.",
  "Какое крупное народное восстание произошло при Екатерине II?":
    "Which large popular rising happened under Catherine II?",
  "Восстание Болотникова": "Bolotnikov's rising",
  "Соляной бунт": "The Salt Riot",
  "Восстание 1773–1775 годов охватило Урал и Поволжье. Просвещённые замыслы императрицы остались на бумаге, а крепостное право стало жёстче.":
    "The rising of 1773–1775 spread over the Urals and the Volga country. The empress's enlightened plans stayed on paper, and serfdom grew harder.",
  "Кто командовал русской армией в Бородинском сражении?":
    "Who commanded the Russian army at the battle of Borodino?",
  "Суворов": "Suvorov",
  "Кутузов": "Kutuzov",
  "Нахимов": "Nakhimov",
  "Багратион": "Bagration",
  "Михаил Кутузов. После сражения он оставил Москву, и это решение спасло армию, хотя город почти целиком сгорел.":
    "Mikhail Kutuzov. After the battle he gave up Moscow, and that decision saved the army, although the city burned almost entirely.",
  "Чего требовали декабристы в 1825 году?": "What did the Decembrists demand in 1825?",
  "Конституции и ограничения самодержавия": "A constitution and a limit on autocracy",
  "Восстановления патриаршества": "The restoration of the patriarchate",
  "Присоединения новых земель": "The taking of new lands",
  "Отмены Табели о рангах": "The abolition of the Table of Ranks",
  "Это первое выступление за конституцию в русской истории. Восстание было подавлено за день, пятерых казнили, остальных сослали в Сибирь.":
    "It was the first move for a constitution in Russian history. The rising was put down in a day, five men were executed and the rest exiled to Siberia.",
  "Какой император отменил крепостное право?": "Which emperor abolished serfdom?",
  "Николай I": "Nicholas I",
  "Александр II": "Alexander II",
  "Александр III": "Alexander III",
  "Николай II": "Nicholas II",
  "Александр II, манифестом 19 февраля 1861 года. За ним последовали земская, судебная и военная реформы.":
    "Alexander II, by the manifesto of 19 February 1861. The zemstvo, judicial and military reforms followed it.",
  "Что получили крестьяне по реформе 1861 года и чего не получили?":
    "What did the peasants get from the reform of 1861 and what did they not?",
  "Личную свободу, но землю пришлось выкупать": "Personal freedom, but the land had to be bought",
  "И свободу, и землю безвозмездно": "Both freedom and land, free of charge",
  "Землю, но остались лично зависимыми": "Land, but they stayed personally dependent",
  "Право уйти в город без документов": "The right to leave for the town without papers",
  "Выкупные платежи легли на деревню на десятилетия вперёд. Именно поэтому реформу называют незавершённой.":
    "The redemption payments lay on the village for decades to come. That is why the reform is called unfinished.",
  "Что ввела судебная реформа 1864 года?": "What did the judicial reform of 1864 bring in?",
  "Гласный суд, состязательность, адвокатуру и суд присяжных":
    "Public trials, an adversarial process, a bar and trial by jury",
  "Военные трибуналы": "Military tribunals",
  "Церковный суд по гражданским делам": "A church court for civil cases",
  "Единый кассационный суд": "A single court of cassation",
  "Реформа считается самой удачной из великих реформ. Суд присяжных, введённый тогда, был упразднён в советское время и вернулся в девяностые.":
    "The reform is held to be the most successful of the great reforms. Trial by jury, brought in then, was abolished in Soviet times and came back in the nineties.",
  "Что провозгласил Манифест 17 октября 1905 года?":
    "What did the Manifesto of 17 October 1905 proclaim?",
  "Гражданские свободы и созыв Государственной думы":
    "Civil freedoms and the calling of a State Duma",
  "Отмену крепостного права": "The abolition of serfdom",
  "Вступление в Первую мировую войну": "Entry into the First World War",
  "Введение конституции": "The bringing in of a constitution",
  "Дума стала первым в русской истории выборным законодательным органом. Отдельной конституции при этом принято не было.":
    "The Duma became the first elected legislative body in Russian history. No separate constitution was adopted with it.",
  "Какая железная дорога связала Москву с Тихим океаном?":
    "Which railway joined Moscow to the Pacific?",
  "Николаевская": "The Nikolaev line",
  "Транссибирская магистраль": "The Trans-Siberian Railway",
  "Турксиб": "The Turksib",
  "Байкало-Амурская магистраль": "The Baikal-Amur Mainline",
  "Транссиб, строительство которого началось в 1891 году. Турксиб построен в советское время, а БАМ — во второй половине XX века.":
    "The Trans-Siberian, whose building began in 1891. The Turksib was built in Soviet times and the Baikal-Amur Mainline in the second half of the twentieth century.",
  "Сколько революций произошло в России в 1917 году?":
    "How many revolutions happened in Russia in 1917?",
  "Ни одной: это была одна длинная революция": "None: it was one long revolution",
  "Февральская и Октябрьская, и между ними восемь месяцев. Первая свергла монархию, вторая сменила пришедшее ей на смену правительство.":
    "The February and the October ones, with eight months between them. The first overthrew the monarchy, the second replaced the government that had come in its place.",
  "Что такое двоевластие?": "What is dual power?",
  "Одновременное существование Временного правительства и Советов":
    "The Provisional Government and the Soviets existing at the same time",
  "Разделение власти между царём и Думой": "Power divided between the tsar and the Duma",
  "Правление двух императоров": "The rule of two emperors",
  "Раздел страны между красными и белыми": "The country divided between Reds and Whites",
  "Правительство считало себя властью до Учредительного собрания, а за Советами стояли гарнизон и заводы. Ни одна из сторон не решалась ни выйти из войны, ни разделить землю.":
    "The government held itself to be the authority until a Constituent Assembly, and behind the Soviets stood the garrison and the factories. Neither side dared to leave the war or to divide the land.",
  "Почему Октябрьскую революцию отмечали 7 ноября?":
    "Why was the October Revolution marked on 7 November?",
  "Так решили в 1930-е годы": "It was decided so in the 1930s",
  "Из-за перехода с юлианского календаря на григорианский":
    "Because of the change from the Julian to the Gregorian calendar",
  "По решению II съезда Советов": "By a decision of the Second Congress of Soviets",
  "Из-за разницы часовых поясов": "Because of the difference in time zones",
  "25 октября по старому стилю — это 7 ноября по новому. Календарь сменили в 1918 году, а название события осталось прежним.":
    "25 October in the old style is 7 November in the new. The calendar was changed in 1918, and the name of the event stayed as it was.",
  "Какие два декрета были приняты первыми после Октября?":
    "Which two decrees were the first to be passed after October?",
  "О мире и о земле": "On peace and on land",
  "О труде и об образовании": "On labour and on education",
  "О церкви и о календаре": "On the church and on the calendar",
  "О национализации и о хлебе": "On nationalisation and on grain",
  "Именно эти два вопроса Временное правительство откладывало восемь месяцев, и именно их ждала страна.":
    "Those were exactly the two questions the Provisional Government had put off for eight months, and exactly the ones the country was waiting for.",
  "Что произошло с Учредительным собранием?": "What happened to the Constituent Assembly?",
  "Оно приняло конституцию": "It adopted a constitution",
  "Оно было распущено в январе 1918 года после первого заседания":
    "It was dissolved in January 1918 after its first sitting",
  "Выборы в него не состоялись": "The elections to it never took place",
  "Оно работало до 1922 года": "It worked until 1922",
  "Выборы прошли, но большевики получили меньшинство. Собрание распустили после первого же заседания.":
    "The elections were held, but the Bolsheviks got a minority. The assembly was dissolved after its very first sitting.",
  "Чем обернулся для России Брестский мир?":
    "What did the Treaty of Brest-Litovsk turn into for Russia?",
  "Выходом из войны ценой огромных территорий":
    "Leaving the war at the price of enormous territories",
  "Присоединением новых земель": "The taking of new lands",
  "Союзом с Германией": "An alliance with Germany",
  "Отсрочкой военных действий на год": "A year's pause in the fighting",
  "Мир подписан в марте 1918 года. Тогда же столица вернулась из Петрограда в Москву, а страна вступала в гражданскую войну.":
    "The treaty was signed in March 1918. At the same time the capital came back from Petrograd to Moscow, and the country was entering civil war.",
  "В какой город вернулась столица в 1918 году?": "To which city did the capital return in 1918?",
  "В Петроград": "To Petrograd",
  "В Москву": "To Moscow",
  "В Киев": "To Kiev",
  "В Нижний Новгород": "To Nizhny Novgorod",
  "Столица вернулась в Москву после двухсот с лишним лет в Петербурге. Причиной была близость фронта к прежней столице.":
    "The capital came back to Moscow after more than two hundred years in Petersburg. The reason was how close the front was to the former capital.",
  "Где и когда была расстреляна царская семья?": "Where and when was the tsar's family shot?",
  "В Петрограде в 1917 году": "In Petrograd in 1917",
  "В Екатеринбурге в июле 1918 года": "In Yekaterinburg in July 1918",
  "В Москве в 1919 году": "In Moscow in 1919",
  "В Тобольске в 1920 году": "In Tobolsk in 1920",
  "Останки были найдены и идентифицированы уже в конце XX века, а в 2000 году члены семьи причислены Русской православной церковью к лику святых.":
    "The remains were found and identified only at the end of the twentieth century, and in 2000 the members of the family were canonised by the Russian Orthodox Church.",
  "Сколько лет длилась Гражданская война?": "How long did the Civil War last?",
  "Два года": "Two years",
  "Около четырёх лет": "About four years",
  "С 1918 по 1922 год. Против красных выступали белые армии, крестьянские восстания и войска иностранных держав.":
    "From 1918 to 1922. Against the Reds stood the White armies, peasant risings and the troops of foreign powers.",
  "Сколько человек покинуло страну в результате революции и Гражданской войны?":
    "How many people left the country as a result of the revolution and the Civil War?",
  "Около ста тысяч": "About a hundred thousand",
  "Около полумиллиона": "About half a million",
  "Около двух миллионов": "About two million",
  "Около десяти миллионов": "About ten million",
  "Около двух миллионов: офицеры, учёные, инженеры, писатели. Уехал целый слой общества, и это сказалось на десятилетия вперёд.":
    "About two million: officers, scholars, engineers, writers. A whole layer of society left, and that told for decades to come.",
  "Что заменило продразвёрстку при новой экономической политике?":
    "What replaced grain requisitioning under the New Economic Policy?",
  "Налог": "A tax",
  "Полное освобождение от повинностей": "Complete freedom from dues",
  "Карточки": "Ration cards",
  "Барщина": "Corvée labour",
  "Продовольственный налог: крестьянин знал заранее, сколько отдаст, и остальное мог продать. Была разрешена торговля и мелкое частное предпринимательство.":
    "A tax in food: the peasant knew in advance how much they would give up, and could sell the rest. Trade and small private business were allowed.",
  "Какие республики подписали договор об образовании СССР?":
    "Which republics signed the treaty founding the USSR?",
  "РСФСР, Украина, Белоруссия и Закавказская федерация":
    "The RSFSR, Ukraine, Belorussia and the Transcaucasian Federation",
  "Все пятнадцать союзных республик": "All fifteen union republics",
  "РСФСР и Украина": "The RSFSR and Ukraine",
  "РСФСР, Украина, Белоруссия и Казахстан": "The RSFSR, Ukraine, Belorussia and Kazakhstan",
  "Четыре подписанта в 1922 году. До пятнадцати республик Союз вырастет позже, в том числе за счёт разделения Закавказской федерации.":
    "Four signatories in 1922. The Union would grow to fifteen republics later, partly by the splitting of the Transcaucasian Federation.",
  "Что вызвало голод 1921–1922 годов в Поволжье?":
    "What caused the famine of 1921–1922 in the Volga country?",
  "Неурожай на разорённой войной земле": "A failed harvest on land ruined by war",
  "Массовая эмиграция крестьян": "Mass emigration of peasants",
  "Эпидемия скота": "An epidemic among the cattle",
  "Закрытие границ": "The closing of the borders",
  "Хозяйство было подорвано войной и продразвёрсткой, а засуха довершила дело. Голод стал одной из причин перехода к новой экономической политике.":
    "The economy had been undermined by war and requisitioning, and the drought finished the job. The famine was one of the reasons for the turn to the New Economic Policy.",
  "Что было свёрнуто в конце двадцатых годов?": "What was wound up at the end of the twenties?",
  "Новая экономическая политика": "The New Economic Policy",
  "Продразвёрстка": "Grain requisitioning",
  "Пятилетние планы": "The five-year plans",
  "НЭП свернули ради форсированной индустриализации. Военный коммунизм и продразвёрстка кончились раньше, в 1921 году.":
    "The New Economic Policy was wound up for the sake of forced industrialisation. War communism and requisitioning had ended earlier, in 1921.",
  "Какие из этих объектов построены в годы первых пятилеток?":
    "Which of these were built in the years of the first five-year plans?",
  "Магнитка, Днепрогэс и Турксиб": "Magnitka, the Dnieper hydro station and the Turksib",
  "Транссиб и Николаевская дорога": "The Trans-Siberian and the Nikolaev line",
  "Петербургский порт": "The port of Petersburg",
  "За десятилетие страна из аграрной стала промышленной. Транссиб построен ещё в империи, а БАМ — во второй половине века.":
    "In a decade the country went from farming to industry. The Trans-Siberian was built back in the empire, and the Baikal-Amur Mainline in the second half of the century.",
  "За счёт чего в основном финансировалась индустриализация?":
    "What mainly paid for industrialisation?",
  "За счёт иностранных займов": "Foreign loans",
  "За счёт деревни, экспорта зерна и низких зарплат": "The village, grain exports and low wages",
  "За счёт продажи колоний": "The sale of colonies",
  "За счёт золотого запаса империи": "The empire's gold reserve",
  "Средства брали внутри страны: у деревни через закупочные цены, у населения через зарплаты и займы. Это и связывает индустриализацию с коллективизацией.":
    "The means were taken inside the country: from the village through purchase prices, from the people through wages and loans. That is what ties industrialisation to collectivisation.",
  "Что такое коллективизация?": "What is collectivisation?",
  "Объединение крестьянских хозяйств в колхозы":
    "The joining of peasant farms into collective farms",
  "Переселение горожан в деревню": "The moving of townspeople to the village",
  "Раздача земли крестьянам": "The handing out of land to the peasants",
  "Создание рабочих кооперативов в городах":
    "The setting up of workers' cooperatives in the towns",
  "Сплошная коллективизация началась в 1929 году и сопровождалась раскулачиванием — конфискацией имущества и высылкой зажиточных крестьян.":
    "Wholesale collectivisation began in 1929 and came with dekulakisation — the confiscation of property and the deportation of well-off peasants.",
  "Какие регионы охватил голод 1932–1933 годов?":
    "Which regions did the famine of 1932–1933 cover?",
  "Только Украину": "Ukraine only",
  "Украину, Поволжье, Казахстан, Северный Кавказ и Западную Сибирь":
    "Ukraine, the Volga country, Kazakhstan, the North Caucasus and western Siberia",
  "Только Сибирь": "Siberia only",
  "Прибалтику и Белоруссию": "The Baltic lands and Belorussia",
  "Голод затронул основные зерновые районы. Число погибших исчисляется миллионами; оценки расходятся, но порядок величины не оспаривается.":
    "The famine touched the main grain districts. The dead are counted in millions; the estimates differ, but the order of size is not disputed.",
  "Что такое раскулачивание?": "What is dekulakisation?",
  "Конфискация имущества и высылка зажиточных крестьян":
    "The confiscation of property and the deportation of well-off peasants",
  "Освобождение крестьян от налогов": "Freeing peasants from taxes",
  "Передача земли колхозам за выкуп": "Handing land to the collective farms for a payment",
  "Перепись сельского населения": "A census of the rural population",
  "Сотни тысяч семей были отправлены в отдалённые районы страны, и многие погибли в дороге или в первые годы на новом месте.":
    "Hundreds of thousands of families were sent to remote parts of the country, and many died on the way or in the first years in the new place.",
  "Что строили заключённые ГУЛАГа?": "What did the prisoners of the Gulag build?",
  "Каналы, прииски, комбинаты за полярным кругом": "Canals, mines, works beyond the Arctic Circle",
  "Только дороги в европейской части": "Roads in the European part only",
  "Жильё в крупных городах": "Housing in the large cities",
  "Ничего: труд не использовался": "Nothing: their labour was not used",
  "Беломорканал, золотые прииски Колымы, Норильский комбинат. Принудительный труд был встроен в хозяйственные планы.":
    "The White Sea Canal, the gold mines of Kolyma, the Norilsk works. Forced labour was built into the economic plans.",
  "Что такое «тройки» в период Большого террора?":
    "What were the troikas in the time of the Great Terror?",
  "Внесудебные органы, выносившие приговоры":
    "Bodies outside the courts that handed down sentences",
  "Бригады на стройках пятилетки": "Work brigades on the five-year plan's building sites",
  "Комиссии по раскулачиванию": "Commissions for dekulakisation",
  "Отделения милиции": "Police stations",
  "Дела рассматривались без суда и защиты, приговоры выносились за минуты. Аресты при этом шли по спущенным сверху разнарядкам.":
    "Cases were heard with no trial and no defence, and sentences were passed in minutes. The arrests, meanwhile, followed quotas sent down from above.",
  "На какие годы пришёлся пик массовых репрессий?":
    "In which years did the mass repressions reach their peak?",
  "На 1929–1930": "1929–1930",
  "На 1932–1933": "1932–1933",
  "На 1937–1938": "1937–1938",
  "На 1945–1946": "1945–1946",
  "Большой террор 1937–1938 годов: несколько сотен тысяч расстрелянных по массовым операциям и столько же и более отправленных в лагеря.":
    "The Great Terror of 1937–1938: several hundred thousand shot in the mass operations and as many and more sent to the camps.",
  "Какие народы подверглись депортации в годы войны и после неё?":
    "Which peoples were deported during the war and after it?",
  "Поволжские немцы, крымские татары, чеченцы, ингуши, калмыки и другие":
    "The Volga Germans, the Crimean Tatars, the Chechens, the Ingush, the Kalmyks and others",
  "Только поволжские немцы": "The Volga Germans only",
  "Только народы Сибири": "The peoples of Siberia only",
  "Депортаций не было": "There were no deportations",
  "Целые народы были насильственно выселены с мест проживания. Многие погибли в пути или в первые годы на новом месте; возвращение началось только после 1956 года.":
    "Whole peoples were driven by force from where they lived. Many died on the way or in the first years in the new place; the return began only after 1956.",
  "Как была официально названа Конституция 1936 года?":
    "What was the Constitution of 1936 officially called?",
  "Самой демократической в мире": "The most democratic in the world",
  "Временным основным законом": "A temporary basic law",
  "Конституцией переходного периода": "The constitution of a transition period",
  "Уставом Союза": "The charter of the Union",
  "Расхождение между её текстом и практикой тех же лет — наглядный пример того, почему конституция без работающих судов остаётся бумагой.":
    "The gap between its text and the practice of those same years is a plain example of why a constitution without working courts stays paper.",
  "Что началось после XX съезда партии в 1956 году?":
    "What began after the Twentieth Party Congress in 1956?",
  "Реабилитация: пересмотр дел и восстановление доброго имени осуждённых":
    "Rehabilitation: the review of cases and the restoring of the good name of the convicted",
  "Новая волна арестов": "A new wave of arrests",
  "Вторая коллективизация": "A second collectivisation",
  "Закрытие архивов": "The closing of the archives",
  "На съезде прозвучал доклад о культе личности. Реабилитация шла волнами и продолжалась десятилетиями.":
    "The report on the cult of personality was given at the congress. Rehabilitation came in waves and went on for decades.",
  "Что было открыто в Москве в 2017 году?": "What was unveiled in Moscow in 2017?",
  "«Стена скорби» — памятник жертвам политических репрессий":
    "The Wall of Grief — the monument to the victims of political repression",
  "Музей космонавтики": "The Museum of Cosmonautics",
  "Мемориал защитникам Москвы": "The memorial to the defenders of Moscow",
  "Памятник Тысячелетию России": "The Millennium of Russia monument",
  "Государственный памятник жертвам репрессий. Работают также музеи и мемориальные комплексы на местах бывших лагерей и полигонов, включая Бутовский.":
    "The state monument to the victims of repression. There are also museums and memorial sites where the camps and execution grounds used to be, Butovo among them.",
  "Чем Великая Отечественная война отличается по срокам от Второй мировой?":
    "How do the dates of the Great Patriotic War differ from those of the Second World War?",
  "Ничем: это одно и то же": "In nothing: they are the same thing",
  "Она шла с 22 июня 1941 по 9 мая 1945 года, на советско-германском фронте":
    "It ran from 22 June 1941 to 9 May 1945, on the Soviet-German front",
  "Она началась в 1939 году": "It began in 1939",
  "Она закончилась в сентябре 1945 года": "It ended in September 1945",
  "Вторая мировая шла с 1939 по 1945 год. Великая Отечественная — та её часть, что велась на советско-германском фронте.":
    "The Second World War ran from 1939 to 1945. The Great Patriotic War is the part of it fought on the Soviet-German front.",
  "Когда была прорвана и снята блокада Ленинграда?":
    "When was the siege of Leningrad broken and lifted?",
  "В январе 1944 года": "In January 1944",
  "В декабре 1941 года": "In December 1941",
  "В феврале 1943 года": "In February 1943",
  "В мае 1945 года": "In May 1945",
  "Блокада была полностью снята в январе 1944 года, продлившись почти девятьсот дней с сентября 1941-го.":
    "The siege was fully lifted in January 1944, having lasted almost nine hundred days from September 1941.",
  "Какое сражение стало переломом в ходе войны?": "Which battle was the turning point of the war?",
  "Сталинградская битва": "The battle of Stalingrad",
  "Битва за Берлин": "The battle for Berlin",
  "Окружение и капитуляция немецкой армии под Сталинградом зимой 1942–1943 годов. Летом 1943-го на Курской дуге инициатива закрепилась окончательно.":
    "The encircling and surrender of the German army at Stalingrad in the winter of 1942–1943. In the summer of 1943, on the Kursk salient, the initiative was secured for good.",
  "Какими оцениваются потери СССР в войне?": "How are the USSR's losses in the war estimated?",
  "Около семи миллионов человек": "About seven million people",
  "Около двенадцати миллионов": "About twelve million",
  "Около двадцати семи миллионов": "About twenty-seven million",
  "Около сорока миллионов": "About forty million",
  "Около двадцати семи миллионов, большую часть из которых составило мирное население. Это самые тяжёлые потери среди всех стран — участниц войны.":
    "About twenty-seven million, most of them civilians. They are the heaviest losses of any country that took part in the war.",
  "Какое место стало одним из известнейших символов Холокоста на оккупированной территории?":
    "Which place became one of the best-known symbols of the Holocaust on occupied territory?",
  "Бабий Яр": "Babi Yar",
  "Хатынь": "Khatyn",
  "Пискарёвское кладбище": "The Piskaryovskoye Cemetery",
  "Прохоровка": "Prokhorovka",
  "Бабий Яр под Киевом. Хатынь — сожжённая белорусская деревня, Пискарёвское кладбище — блокадный Ленинград, Прохоровка — Курская дуга.":
    "Babi Yar near Kiev. Khatyn is a Belorussian village that was burned, the Piskaryovskoye Cemetery belongs to besieged Leningrad, Prokhorovka to the Kursk salient.",
  "Что произошло в 1949 году?": "What happened in 1949?",
  "СССР испытал атомную бомбу": "The USSR tested an atomic bomb",
  "Был запущен первый спутник": "The first satellite was launched",
  "Умер Сталин": "Stalin died",
  "Началась война в Корее": "The war in Korea began",
  "Испытание атомной бомбы и начало ядерного противостояния двух блоков. Спутник запустят в 1957 году, а Сталин умрёт в 1953-м.":
    "The test of an atomic bomb and the start of the nuclear stand-off between the two blocs. The satellite would be launched in 1957 and Stalin would die in 1953.",
  "Как называют период после XX съезда партии?":
    "What is the period after the Twentieth Party Congress called?",
  "Застой": "The Stagnation",
  "Оттепель": "The Thaw",
  "Оттепель: массовая реабилитация, возвращение людей из лагерей, ослабление цензуры. Застоем назовут следующие два десятилетия.":
    "The Thaw: mass rehabilitation, people coming back from the camps, a loosening of censorship. The next two decades would be called the Stagnation.",
  "Кто первым в мире совершил полёт в космос?":
    "Who was the first person in the world to fly into space?",
  "Юрий Гагарин": "Yuri Gagarin",
  "Герман Титов": "German Titov",
  "Алексей Леонов": "Alexei Leonov",
  "Валентина Терешкова": "Valentina Tereshkova",
  "12 апреля 1961 года. Титов полетел вторым, Леонов первым вышел в открытый космос, Терешкова стала первой женщиной-космонавтом.":
    "12 April 1961. Titov flew second, Leonov was the first to walk in open space, Tereshkova became the first woman cosmonaut.",
  "Чем закончился Карибский кризис 1962 года?": "How did the Cuban missile crisis of 1962 end?",
  "Взаимными уступками и первыми соглашениями об ограничении вооружений":
    "With concessions on both sides and the first agreements on limiting arms",
  "Военным столкновением": "With a military clash",
  "Разрывом отношений на десять лет": "With relations broken off for ten years",
  "Выходом СССР из ООН": "With the USSR leaving the UN",
  "Кризис подвёл мир к грани ядерной войны и заставил обе стороны искать механизмы предотвращения: тогда же появилась прямая линия связи между Москвой и Вашингтоном.":
    "The crisis brought the world to the edge of nuclear war and made both sides look for ways to prevent it: the direct line between Moscow and Washington appeared at that time.",
  "Сколько лет продолжалась война в Афганистане?": "How long did the war in Afghanistan last?",
  "Пятнадцать лет": "Fifteen years",
  "С 1979 по 1989 год. Она шла на фоне экономического застоя, и её итоги стали одним из факторов перемен второй половины восьмидесятых.":
    "From 1979 to 1989. It ran against a background of economic stagnation, and its results were one of the factors behind the changes of the later eighties.",
  "Что было объявлено в 1985 году?": "What was announced in 1985?",
  "Перестройка и гласность": "Perestroika and glasnost",
  "Первая пятилетка": "The first five-year plan",
  "С приходом Михаила Горбачёва открылись архивы, вернулись запрещённые книги, началось публичное обсуждение прошлого.":
    "With Mikhail Gorbachev's arrival the archives opened, banned books came back, and the past began to be discussed in public.",
  "Что произошло 12 июня 1991 года?": "What happened on 12 June 1991?",
  "Были подписаны Беловежские соглашения": "The Belovezha Accords were signed",
  "Прошли первые прямые выборы Президента РСФСР":
    "The first direct election of a President of the RSFSR was held",
  "Была принята Декларация о суверенитете": "The Declaration of Sovereignty was adopted",
  "Провалилась попытка государственного переворота": "An attempted coup failed",
  "Победил Борис Ельцин. Декларация о суверенитете принята ровно годом раньше, а Беловежские соглашения подписаны 8 декабря того же года.":
    "Boris Yeltsin won. The Declaration of Sovereignty was adopted exactly a year earlier, and the Belovezha Accords were signed on 8 December of the same year.",
  "Что произошло в России в 1998 году?": "What happened in Russia in 1998?",
  "Дефолт": "The default",
  "Деноминация рубля и рост экономики": "The redenomination of the rouble and economic growth",
  "Вступление в Совет Европы": "Joining the Council of Europe",
  "Государство отказалось платить по краткосрочным обязательствам, рубль обесценился в несколько раз. Через год начался экономический рост, продолжавшийся почти десятилетие.":
    "The state refused to pay on its short-term obligations and the rouble lost several times its value. A year later economic growth began that went on for almost a decade.",
  "Какую примерно долю земной суши занимает Россия?":
    "Roughly what share of the earth's land does Russia take up?",
  "Около одной двадцатой": "About one twentieth",
  "Около одной восьмой": "About one eighth",
  "Около четверти": "About a quarter",
  "Свыше семнадцати миллионов квадратных километров — около одной восьмой всей суши планеты. Это делает Россию крупнейшей страной мира.":
    "More than seventeen million square kilometres — about one eighth of all the land on the planet. That makes Russia the largest country in the world.",
  "Какова протяжённость страны с запада на восток?":
    "How far does the country stretch from west to east?",
  "Около трёх тысяч километров": "About three thousand kilometres",
  "Около пяти тысяч": "About five thousand",
  "Почти десять тысяч": "Almost ten thousand",
  "Около двадцати тысяч": "About twenty thousand",
  "Почти десять тысяч километров, при четырёх тысячах с севера на юг. Отсюда и одиннадцать часовых поясов.":
    "Almost ten thousand kilometres, against four thousand from north to south. Hence the eleven time zones.",
  "Какая доля населения живёт в европейской части страны?":
    "What share of the population lives in the European part of the country?",
  "Около половины": "About half",
  "Около трёх четвертей": "About three quarters",
  "Почти всё население": "Almost the whole population",
  "Около трёх четвертей населения — при том что три четверти территории лежат в Азии. Этот разрыв — одна из главных особенностей российской географии.":
    "About three quarters of the population — while three quarters of the territory lies in Asia. That gap is one of the main features of Russian geography.",
  "Какова разница во времени между Москвой и Камчаткой?":
    "What is the time difference between Moscow and Kamchatka?",
  "Три часа": "Three hours",
  "Шесть часов": "Six hours",
  "Девять часов": "Nine hours",
  "Девять часов: когда в Москве девять утра, на Камчатке уже вечер. Всего страна занимает одиннадцать часовых поясов.":
    "Nine hours: when it is nine in the morning in Moscow, it is already evening in Kamchatka. In all the country covers eleven time zones.",
  "Что изменилось в российском времяисчислении в 2014 году?":
    "What changed in Russian timekeeping in 2014?",
  "Вернулись одиннадцать часовых поясов и прекратился перевод часов":
    "The eleven time zones came back and the clocks stopped being changed",
  "Страна перешла на единое время": "The country went over to a single time",
  "Было введено летнее время": "Summer time was brought in",
  "Калининград перешёл на московское время": "Kaliningrad went over to Moscow time",
  "С 2010 по 2014 год поясов было девять. Сезонного перевода часов в России с тех пор нет, и разница с Европой меняется дважды в год за счёт соседей.":
    "From 2010 to 2014 there were nine zones. There has been no seasonal change of the clocks in Russia since, and the difference with Europe changes twice a year because of the neighbours.",
  "Со сколькими государствами Россия имеет сухопутную границу?":
    "With how many states does Russia have a land border?",
  "С восемью": "With eight",
  "С одиннадцатью": "With eleven",
  "С четырнадцатью": "With fourteen",
  "С двадцатью": "With twenty",
  "С четырнадцатью — по этому показателю Россия делит первое место в мире с Китаем. Морские соседи, США и Япония, в это число не входят.":
    "With fourteen — on that count Russia shares first place in the world with China. The sea neighbours, the United States and Japan, are not in that number.",
  "Через какой пролив проходит морская граница с США?":
    "Through which strait does the sea border with the United States run?",
  "Через Берингов": "Through the Bering Strait",
  "Через Лаперуза": "Through the La Pérouse Strait",
  "Через Керченский": "Through the Kerch Strait",
  "Через Татарский": "Through the Tatar Strait",
  "Берингов пролив: между островами Ратманова и Крузенштерна около четырёх километров. Пролив Лаперуза отделяет Сахалин от Хоккайдо.":
    "The Bering Strait: between Ratmanov Island and Krusenstern Island there are about four kilometres. The La Pérouse Strait separates Sakhalin from Hokkaido.",
  "Какими государствами и морем окружена Калининградская область?":
    "Which states and which sea surround Kaliningrad oblast?",
  "Польшей, Литвой и Балтийским морем": "Poland, Lithuania and the Baltic Sea",
  "Белоруссией и Латвией": "Belorussia and Latvia",
  "Финляндией и Эстонией": "Finland and Estonia",
  "Только Польшей": "Poland alone",
  "Область не имеет сухопутной связи с остальной страной, то есть является эксклавом. Это единственный такой регион в России.":
    "The oblast has no land link with the rest of the country, that is, it is an exclave. It is the only such region in Russia.",
  "Какая точка является самой северной материковой точкой России?":
    "Which point is Russia's northernmost mainland point?",
  "Мыс Челюскин": "Cape Chelyuskin",
  "Мыс Дежнёва": "Cape Dezhnyov",
  "Остров Ратманова": "Ratmanov Island",
  "Гора Базардюзю": "Mount Bazardyuzyu",
  "Мыс Челюскин на Таймыре. Базардюзю — самая южная точка, а остров Ратманова — самая восточная.":
    "Cape Chelyuskin on the Taimyr Peninsula. Bazardyuzyu is the southernmost point, and Ratmanov Island the easternmost.",
  "Почему линии часовых поясов на карте России не идут по меридианам?":
    "Why do the lines of the time zones on the map of Russia not follow the meridians?",
  "Из-за рельефа": "Because of the relief",
  "Потому что время устанавливается для каждого субъекта Федерации отдельно":
    "Because the time is set for each federal subject separately",
  "Из-за международных соглашений": "Because of international agreements",
  "Они идут строго по меридианам": "They follow the meridians exactly",
  "Пояс определяется административной границей, а не географической долготой. Поэтому карта времени повторяет карту регионов.":
    "A zone is set by an administrative border, not by geographical longitude. That is why the map of time repeats the map of the regions.",
  "Какова примерная численность населения России?": "Roughly what is the population of Russia?",
  "Около 90 миллионов": "About 90 million",
  "Около 146 миллионов": "About 146 million",
  "Около 200 миллионов": "About 200 million",
  "Около 300 миллионов": "About 300 million",
  "Около ста сорока шести миллионов человек, распределённых крайне неравномерно: густо на юго-западе и вдоль Транссиба, почти пусто на севере Сибири.":
    "About a hundred and forty-six million people, spread extremely unevenly: thickly in the south-west and along the Trans-Siberian, almost empty in the north of Siberia.",
  "Где в России первыми встречают Новый год?": "Where in Russia is the New Year met first?",
  "В Калининграде": "In Kaliningrad",
  "На Камчатке и Чукотке": "In Kamchatka and Chukotka",
  "На востоке страны, где время опережает московское на девять часов. Калининград, наоборот, встречает его последним — там на час меньше московского.":
    "In the east of the country, where the time is nine hours ahead of Moscow. Kaliningrad, on the contrary, meets it last — its time is an hour behind Moscow's.",
  "Какой регион является самым западным?": "Which region is the westernmost?",
  "Псковская область": "Pskov oblast",
  "Ленинградская область": "Leningrad oblast",
  "Республика Карелия": "The Republic of Karelia",
  "Калининградская область, которая к тому же единственный российский регион с временем на час меньше московского.":
    "Kaliningrad oblast, which is also the only Russian region whose time is an hour behind Moscow's.",
  "Какая природная зона занимает наибольшую площадь в России?":
    "Which natural zone takes up the largest area in Russia?",
  "Тундра": "The tundra",
  "Тайга": "The taiga",
  "Степь": "The steppe",
  "Полупустыня": "The semi-desert",
  "Тайга — крупнейший лесной массив планеты. На Россию приходится около пятой части всех лесов мира.":
    "The taiga — the largest forest belt on the planet. About a fifth of all the world's forest falls to Russia.",
  "Какую долю мировых лесов занимают леса России?":
    "What share of the world's forests do Russia's forests make up?",
  "Около одной пятой": "About one fifth",
  "Около пятой части, и по площади лесов страна занимает первое место в мире.":
    "About a fifth, and by forest area the country stands first in the world.",
  "Почему в северных городах дома строят на сваях?":
    "Why are houses in the northern towns built on piles?",
  "Из-за паводков": "Because of floods",
  "Чтобы тепло здания не растопило вечную мерзлоту под ним":
    "So that the building's heat does not melt the permafrost under it",
  "Из-за сильных ветров": "Because of strong winds",
  "Так дешевле строить": "Because it is cheaper to build that way",
  "Растаявший грунт теряет несущую способность, и здание проседает. Сваи поднимают дом, оставляя между ним и землёй продуваемый зазор.":
    "Thawed ground loses its bearing strength and the building sinks. Piles lift the house, leaving a gap between it and the ground for the air to blow through.",
  "Какая река является самой длинной в Европе?": "Which river is the longest in Europe?",
  "Дунай": "The Danube",
  "Волга": "The Volga",
  "Днепр": "The Dnieper",
  "Дон": "The Don",
  "Волга, около трёх с половиной тысяч километров. Она впадает не в океан, а в Каспийское море — крупнейший замкнутый водоём планеты.":
    "The Volga, about three and a half thousand kilometres. It flows not into an ocean but into the Caspian Sea — the largest enclosed body of water on the planet.",
  "Какая из сибирских рек самая полноводная?":
    "Which of the Siberian rivers carries the most water?",
  "Обь": "The Ob",
  "Енисей": "The Yenisei",
  "Лена": "The Lena",
  "Амур": "The Amur",
  "Енисей. Все три великие сибирские реки текут на север, а Амур на Дальнем Востоке течёт на восток, и по нему частично проходит граница с Китаем.":
    "The Yenisei. All three great Siberian rivers flow north, while the Amur in the Far East flows east, and part of the border with China runs along it.",
  "Какова глубина Байкала?": "How deep is Lake Baikal?",
  "642 метра": "642 metres",
  "1042 метра": "1,042 metres",
  "1642 метра": "1,642 metres",
  "2642 метра": "2,642 metres",
  "1642 метра — самое глубокое озеро мира. В нём сосредоточено около пятой части мировых запасов поверхностной пресной воды.":
    "1,642 metres — the deepest lake in the world. About a fifth of the world's surface fresh water is gathered in it.",
  "Какое озеро является крупнейшим пресноводным в Европе?":
    "Which lake is the largest freshwater lake in Europe?",
  "Чудское": "Lake Peipus",
  "Ладожское. Байкал глубже и больше по объёму, но находится в Азии, а Каспий — солёный и замкнутый.":
    "Lake Ladoga. Baikal is deeper and larger by volume, but it is in Asia, and the Caspian is salt and enclosed.",
  "Какой хребет разделяет Европу и Азию и богат рудами?":
    "Which range divides Europe from Asia and is rich in ores?",
  "Алтай": "The Altai",
  "Саяны": "The Sayans",
  "Урал — древний и невысокий хребет. На его рудах выросла уральская промышленность ещё в петровское время.":
    "The Urals — an old range and not a high one. Ural industry grew on its ores as far back as Peter's time.",
  "Какой вулкан является высочайшим действующим вулканом Евразии?":
    "Which volcano is the highest active volcano in Eurasia?",
  "Казбек": "Kazbek",
  "Авачинская Сопка": "Avachinsky",
  "Ключевская Сопка на Камчатке. Эльбрус и Казбек — потухшие вулканы Кавказа, а Эльбрус вдобавок высшая точка России.":
    "Klyuchevskaya Sopka in Kamchatka. Elbrus and Kazbek are extinct volcanoes of the Caucasus, and Elbrus is besides the highest point in Russia.",
  "Какой климат преобладает в Сибири?": "Which climate prevails in Siberia?",
  "Морской": "Maritime",
  "Резко континентальный": "Sharply continental",
  "Субтропический": "Subtropical",
  "Муссонный": "Monsoon",
  "Резко континентальный: очень холодная зима и жаркое лето, разница между ними доходит до шестидесяти градусов. Муссонный климат — на Дальнем Востоке.":
    "Sharply continental: a very cold winter and a hot summer, with as much as sixty degrees between them. The monsoon climate is in the Far East.",
  "Какие населённые пункты оспаривают звание полюса холода Северного полушария?":
    "Which places compete for the title of pole of cold of the northern hemisphere?",
  "Норильск и Мурманск": "Norilsk and Murmansk",
  "Оймякон и Верхоянск": "Oymyakon and Verkhoyansk",
  "Воркута и Салехард": "Vorkuta and Salekhard",
  "Якутск и Магадан": "Yakutsk and Magadan",
  "Оба в Якутии, и там фиксировали температуры около минус шестидесяти семи градусов. В тот же январский день в Сочи может быть плюс десять.":
    "Both are in Yakutia, and temperatures of about minus sixty-seven degrees have been recorded there. On the same January day it can be plus ten in Sochi.",
  "Где в России субтропический климат?": "Where in Russia is the climate subtropical?",
  "На побережье Чёрного моря около Сочи": "On the Black Sea coast near Sochi",
  "На юге Сибири": "In the south of Siberia",
  "На Камчатке": "In Kamchatka",
  "Узкая полоса черноморского побережья, защищённая с севера горами. Это единственная субтропическая зона страны.":
    "A narrow strip of the Black Sea coast, sheltered from the north by mountains. It is the country's only subtropical zone.",
  "Куда заносятся редкие и исчезающие виды?": "Where are rare and vanishing species entered?",
  "В Красную книгу": "In the Red Book",
  "В Зелёную книгу": "In the Green Book",
  "В реестр заповедников": "In the register of nature reserves",
  "В список ЮНЕСКО": "In the UNESCO list",
  "В Красную книгу. Среди самых известных её обитателей — амурский тигр, белый медведь, зубр и дальневосточный леопард.":
    "In the Red Book. Among its best-known inhabitants are the Amur tiger, the polar bear, the European bison and the Amur leopard.",
  "Какая статья Конституции содержит перечень субъектов Федерации?":
    "Which article of the Constitution holds the list of federal subjects?",
  "Статья 5": "Article 5",
  "Статья 65": "Article 65",
  "Статья 71": "Article 71",
  "Статья 73": "Article 73",
  "Статья 65. Статья 5 говорит о равноправии субъектов, а 71 и 73 распределяют предметы ведения.":
    "Article 65. Article 5 speaks of the equality of the federal subjects, and 71 and 73 share out the matters of competence.",
  "Какой вид субъекта Федерации самый многочисленный?":
    "Which kind of federal subject is the most numerous?",
  "Область": "The oblast",
  "Автономный округ": "The autonomous okrug",
  "Области, вместе с краями, составляют большинство субъектов. Автономная область при этом всего одна — Еврейская.":
    "Oblasts, together with krais, make up the majority of the federal subjects. There is only one autonomous oblast, the Jewish one.",
  "Какие города являются самостоятельными субъектами Федерации?":
    "Which cities are federal subjects in their own right?",
  "Москва, Санкт-Петербург и Севастополь": "Moscow, St Petersburg and Sevastopol",
  "Только Москва": "Moscow only",
  "Москва, Санкт-Петербург и Новосибирск": "Moscow, St Petersburg and Novosibirsk",
  "Все города-миллионники": "Every city of a million",
  "Города федерального значения — отдельный вид субъекта. Новосибирск, несмотря на размер, входит в состав Новосибирской области.":
    "Cities of federal importance are a separate kind of federal subject. Novosibirsk, for all its size, is part of Novosibirsk oblast.",
  "Сколько автономных областей в составе России?":
    "How many autonomous oblasts are there in Russia?",
  "Двадцать четыре": "Twenty-four",
  "Одна — Еврейская автономная область. Автономных округов несколько, и это другой вид субъекта.":
    "One — the Jewish Autonomous Oblast. There are several autonomous okrugs, and that is a different kind of federal subject.",
  "Какой документ является основным для края или области?":
    "Which document is the basic one for a krai or an oblast?",
  "Конституция": "A constitution",
  "Устав": "A charter",
  "Договор с Федерацией": "A treaty with the Federation",
  "Регламент": "Standing orders",
  "Устав. Конституция есть только у республик, и это одно из двух отличий, наряду с правом устанавливать государственные языки.":
    "A charter. Only the republics have a constitution, and that is one of the two differences, along with the right to set state languages.",
  "Какие языки являются государственными в Татарстане?":
    "Which languages are state languages in Tatarstan?",
  "Только русский": "Russian only",
  "Русский и татарский": "Russian and Tatar",
  "Только татарский": "Tatar only",
  "Русский, татарский и башкирский": "Russian, Tatar and Bashkir",
  "Республики вправе устанавливать свои государственные языки наряду с русским. Так же устроено в Якутии с якутским и в Башкортостане с башкирским.":
    "The republics may set state languages of their own alongside Russian. It works the same way in Yakutia with Yakut and in Bashkortostan with Bashkir.",
  "Что относится к исключительному ведению Федерации по статье 71?":
    "What belongs to the Federation alone under Article 71?",
  "Оборона, внешняя политика, гражданство, денежная эмиссия":
    "Defence, foreign policy, citizenship, the issue of money",
  "Образование и здравоохранение": "Education and health care",
  "Благоустройство городов": "Town improvement works",
  "Природопользование": "The use of natural resources",
  "Здесь субъекты не законодательствуют вовсе. Образование, здравоохранение и природопользование относятся к совместному ведению по статье 72.":
    "Here the federal subjects do not legislate at all. Education, health care and the use of natural resources are joint competences under Article 72.",
  "Что говорит статья 73 о полномочиях субъектов?":
    "What does Article 73 say about the powers of the federal subjects?",
  "Субъекты обладают всей полнотой власти вне ведения Федерации и совместного ведения":
    "The federal subjects hold the whole of the power outside the Federation's competence and the joint competence",
  "Субъекты действуют только по прямому поручению центра":
    "The federal subjects act only on the centre's direct instruction",
  "Полномочия субъектов перечислены отдельным списком":
    "The federal subjects' powers are set out in a list of their own",
  "Субъекты не обладают собственными полномочиями":
    "The federal subjects have no powers of their own",
  "Перечисляется то, что забирает центр; остальное остаётся регионам. Та же логика лежит в основе испанского и немецкого федерализма.":
    "What the centre takes is listed; the rest stays with the regions. The same logic lies under Spanish and German federalism.",
  "Как может называться законодательный орган субъекта?":
    "What may a federal subject's legislature be called?",
  "Только думой": "A duma only",
  "Думой, советом, хуралом, курултаем и иначе":
    "A duma, a council, a khural, a kurultai and other names",
  "Только собранием": "An assembly only",
  "Название одинаково во всех субъектах": "The name is the same in every federal subject",
  "Название выбирает сам субъект, и в нём часто отражается язык и традиция региона: Хурал в Бурятии и Калмыкии, Курултай в Башкортостане.":
    "The federal subject chooses the name itself, and the region's language and tradition often show in it: the Khural in Buryatia and Kalmykia, the Kurultai in Bashkortostan.",
  "Сколько федеральных округов в России?": "How many federal districts are there in Russia?",
  "Восемь. Они введены указом Президента в 2000 году, в Конституции не упомянуты и субъектами Федерации не являются.":
    "Eight. They were brought in by a presidential decree in 2000, are not mentioned in the Constitution and are not federal subjects.",
  "Что происходило при укрупнении регионов в 2000-е годы?":
    "What happened when regions were merged in the 2000s?",
  "Автономные округа объединялись с краями и областями через референдум":
    "Autonomous okrugs were joined with krais and oblasts through a referendum",
  "Области делились на более мелкие": "Oblasts were split into smaller ones",
  "Создавались новые республики": "New republics were created",
  "Субъекты переходили в другие федеральные округа":
    "Federal subjects moved into other federal districts",
  "Каждое объединение проходило через референдум в обоих регионах, и число субъектов сократилось. Это единственный способ изменить состав Федерации изнутри.":
    "Every merger went through a referendum in both regions, and the number of federal subjects fell. It is the only way of changing what the Federation is made of from inside.",
  "Что говорит статья 5 об отношениях субъектов с федеральными органами?":
    "What does Article 5 say about the federal subjects' relations with the federal bodies?",
  "Субъекты равноправны": "The federal subjects have equal rights",
  "Республики имеют преимущество": "The republics have the advantage",
  "Города федерального значения имеют преимущество":
    "The cities of federal importance have the advantage",
  "Порядок определяется отдельным договором для каждого":
    "A separate treaty sets the order for each of them",
  "Равноправие закреплено прямо, при том что исторические названия и объём собственных институтов различаются. Равенство здесь — о положении, а не об устройстве.":
    "Equality of rights is fixed outright, even though the historical names and the extent of their own institutions differ. Equality here is about standing, not about structure.",
  "По какому признаку выделялись автономные округа?":
    "On what basis were the autonomous okrugs marked out?",
  "По территориям коренных народов Севера":
    "By the territories of the indigenous peoples of the North",
  "По численности населения": "By the size of the population",
  "По границам федеральных округов": "By the borders of the federal districts",
  "По уровню промышленного развития": "By the level of industrial development",
  "Некоторые из них до сих пор входят в состав области, оставаясь при этом самостоятельными субъектами Федерации — редкая конструкция даже среди федераций.":
    "Some of them are still part of an oblast while remaining federal subjects in their own right — a rare arrangement even among federations.",
  "Какой город является крупнейшим в Европе по населению?":
    "Which city is the largest in Europe by population?",
  "Лондон": "London",
  "Париж": "Paris",
  "Москва": "Moscow",
  "Стамбул": "Istanbul",
  "Москва, около тринадцати миллионов жителей. Стамбул больше, но лежит преимущественно в азиатской части.":
    "Moscow, with about thirteen million people. Istanbul is larger, but it lies mostly in the Asian part.",
  "В каком году открылось московское метро?": "In which year did the Moscow metro open?",
  "В 1917 году": "In 1917",
  "В 1935 году": "In 1935",
  "В 1947 году": "In 1947",
  "В 1961 году": "In 1961",
  "1935 год. Оформление станций первых очередей — часть архитектурного наследия города, и некоторые из них охраняются как памятники.":
    "1935. The design of the stations of the first stages is part of the city's architectural heritage, and some of them are protected as monuments.",
  "Какой музей Санкт-Петербурга входит в число крупнейших в мире?":
    "Which museum in St Petersburg is among the largest in the world?",
  "Третьяковская галерея": "The Tretyakov Gallery",
  "Эрмитаж": "The Hermitage",
  "Русский музей": "The Russian Museum",
  "Кунсткамера": "The Kunstkamera",
  "Эрмитаж, размещённый в Зимнем дворце и соседних зданиях. Третьяковская галерея находится в Москве.":
    "The Hermitage, housed in the Winter Palace and the buildings next to it. The Tretyakov Gallery is in Moscow.",
  "Что такое белые ночи?": "What are the white nights?",
  "Период, когда ночью почти не темнеет из-за северной широты":
    "The time when it hardly grows dark at night because of the northern latitude",
  "Зимние праздники в Петербурге": "The winter holidays in Petersburg",
  "Название фестиваля искусств": "The name of an arts festival",
  "Ночные экскурсии по разводным мостам": "Night tours of the drawbridges",
  "В июне в Петербурге сумерки не переходят в настоящую ночь. На этом строится летний туристический сезон города.":
    "In June in Petersburg the dusk never turns into real night. The city's summer tourist season is built on it.",
  "Сколько примерно в России городов-миллионников?":
    "Roughly how many cities of a million are there in Russia?",
  "Около шестнадцати": "About sixteen",
  "Около тридцати": "About thirty",
  "Более пятидесяти": "More than fifty",
  "Около шестнадцати, считая обе столицы. Крупнейшие после них — Новосибирск, Екатеринбург, Казань и Нижний Новгород.":
    "About sixteen, counting both capitals. The largest after them are Novosibirsk, Yekaterinburg, Kazan and Nizhny Novgorod.",
  "Какой город является третьим по населению в стране?":
    "Which city is third by population in the country?",
  "Нижний Новгород": "Nizhny Novgorod",
  "Новосибирск, выросший вокруг моста Транссиба через Обь. Рядом с ним находится Академгородок — крупный научный центр.":
    "Novosibirsk, which grew around the Trans-Siberian bridge over the Ob. Beside it lies Akademgorodok, a large centre of science.",
  "Чем известен казанский кремль?": "What is the Kazan kremlin known for?",
  "Мечетью и православным собором внутри одной стены":
    "A mosque and an Orthodox cathedral inside one wall",
  "Самой высокой башней страны": "The tallest tower in the country",
  "Тем, что построен в XIX веке": "Having been built in the nineteenth century",
  "Тем, что в нём находится резиденция Президента России":
    "Housing the residence of the President of Russia",
  "Ансамбль внесён в список Всемирного наследия ЮНЕСКО именно как памятник сосуществования двух традиций в одном городе.":
    "The ensemble was put on the UNESCO World Heritage list precisely as a monument to two traditions living side by side in one city.",
  "Какой город является конечной точкой Транссиба?":
    "Which city is the end point of the Trans-Siberian?",
  "Хабаровск": "Khabarovsk",
  "Иркутск": "Irkutsk",
  "Чита": "Chita",
  "Владивосток, главный порт на Тихом океане. Время там опережает московское на семь часов.":
    "Vladivostok, the main port on the Pacific. The time there is seven hours ahead of Moscow.",
  "Какова длина Транссибирской магистрали от Москвы до Владивостока?":
    "How long is the Trans-Siberian Railway from Moscow to Vladivostok?",
  "5288 километров": "5,288 kilometres",
  "7288 километров": "7,288 kilometres",
  "9288 километров": "9,288 kilometres",
  "12 288 километров": "12,288 kilometres",
  "9288 километров и семь часовых поясов — самая длинная железная дорога в мире. Поезд идёт около шести суток.":
    "9,288 kilometres and seven time zones — the longest railway in the world. The train takes about six days.",
  "Какие города входят в Золотое кольцо?": "Which towns are in the Golden Ring?",
  "Владимир, Суздаль, Ярославль, Кострома и другие города северо-востока":
    "Vladimir, Suzdal, Yaroslavl, Kostroma and other towns of the north-east",
  "Города-миллионники европейской части": "The cities of a million in the European part",
  "Города Транссиба": "The towns of the Trans-Siberian",
  "Города Золотой Орды": "The towns of the Golden Horde",
  "Это те земли, из которых выросло Московское государство. Белокаменные соборы XII века стоят там до сих пор.":
    "These are the lands out of which the Muscovite state grew. The white stone cathedrals of the twelfth century still stand there.",
  "За что присваивалось звание города-героя?": "What was the title of hero city given for?",
  "За оборону в годы Великой Отечественной войны":
    "For the defence during the Great Patriotic War",
  "За промышленные достижения": "For industrial achievements",
  "За древность города": "For the town's antiquity",
  "За вклад в освоение космоса": "For a contribution to space exploration",
  "В нынешних границах России это Волгоград, Санкт-Петербург, Москва, Мурманск, Смоленск, Тула и Новороссийск. Позже появилось звание города воинской славы.":
    "Within Russia's present borders they are Volgograd, St Petersburg, Moscow, Murmansk, Smolensk, Tula and Novorossiysk. The title of city of military glory came later.",
  "Что такое наукоград?": "What is a naukograd?",
  "Город, построенный вокруг научных институтов": "A town built around research institutes",
  "Город с ограниченным въездом": "A town with restricted entry",
  "Университетский квартал": "A university quarter",
  "Технопарк при заводе": "A technology park attached to a factory",
  "Дубна, Королёв, Пущино и другие. От закрытого города наукоград отличается тем, что приехать туда можно свободно.":
    "Dubna, Korolyov, Pushchino and others. A naukograd differs from a closed town in that anyone may travel there freely.",
  "Что такое ЗАТО?": "What is a ZATO?",
  "Закрытое административно-территориальное образование с ограниченным въездом":
    "A closed administrative territorial formation with restricted entry",
  "Заповедная территория особой охраны": "A specially protected nature reserve",
  "Западный административный округ": "The Western administrative district",
  "Завод оборонного значения": "A factory of defence importance",
  "Города при предприятиях атомной и оборонной промышленности. На картах советского времени многих из них попросту не было.":
    "Towns attached to nuclear and defence works. On Soviet maps many of them simply were not there.",
  "Сколько народов насчитала перепись 2021 года?":
    "How many peoples did the census of 2021 count?",
  "Больше тысячи": "More than a thousand",
  "Более 190": "More than 190",
  "Около 40": "About 40",
  "Ровно 100": "Exactly 100",
  "Точное число всегда спорно: перепись записывает то, что человек говорит о себе сам, а границы между близкими группами проводят по-разному.":
    "The exact number is always open to argument: a census writes down what a person says about themselves, and the lines between close groups are drawn in different ways.",
  "Какую долю населения составляют русские?": "What share of the population are Russians?",
  "Около 95 %": "About 95%",
  "Около 60 %": "About 60%",
  "Около 80 %": "About 80%",
  "Примерно 105 миллионов человек по переписи 2021 года. В отдельных республиках картина совершенно другая.":
    "About 105 million people according to the census of 2021. In some republics the picture is quite different.",
  "Какой народ идёт за русскими по численности?":
    "Which people comes after the Russians in numbers?",
  "Татары": "The Tatars",
  "Башкиры": "The Bashkirs",
  "Чуваши": "The Chuvash",
  "Армяне": "The Armenians",
  "По переписи 2021 года за татарами следуют чеченцы, башкиры, чуваши, аварцы и армяне.":
    "According to the census of 2021 the Tatars are followed by the Chechens, the Bashkirs, the Chuvash, the Avars and the Armenians.",
  "Есть ли в нынешнем российском паспорте графа «национальность»?":
    "Does the present Russian passport have a line for ethnicity?",
  "Да, она заполняется по родителям": "Yes, and it is filled in from the parents",
  "Да, но заполняется по желанию": "Yes, but it is filled in at will",
  "Она есть только в загранпаспорте": "It is only in the foreign travel passport",
  "Нет, её убрали": "No, it was taken out",
  "В советском паспорте такая графа была и записывалась по родителям. В паспорте нынешнего образца её нет — национальность человек определяет сам.":
    "The Soviet passport had such a line and it was written from the parents. The present passport has none — a person decides their ethnicity themselves.",
  "Какая статья Конституции гарантирует права коренных малочисленных народов?":
    "Which article of the Constitution guarantees the rights of the small indigenous peoples?",
  "Статья 14": "Article 14",
  "Статья 3": "Article 3",
  "Статья 69": "Article 69",
  "Статья 26": "Article 26",
  "Статья 26 говорит о национальной принадлежности каждого, статья 14 — о светском государстве, статья 3 — о носителе суверенитета.":
    "Article 26 speaks of everyone's ethnic belonging, Article 14 of the secular state, Article 3 of the bearer of sovereignty.",
  "Сколько народов входит в единый перечень коренных малочисленных?":
    "How many peoples are in the single list of small indigenous peoples?",
  "Сорок семь": "Forty-seven",
  "Сто девяносто": "A hundred and ninety",
  "Перечень утверждает Правительство. Двадцать четыре — это число республик, а сто девяносто с лишним — общее число народов страны.":
    "The Government approves the list. Twenty-four is the number of republics, and a hundred and ninety-odd the total number of peoples in the country.",
  "Что даёт статус коренного малочисленного народа?":
    "What does the status of a small indigenous people give?",
  "Освобождение от налогов": "Freedom from taxes",
  "Отдельное представительство в Государственной Думе":
    "Separate representation in the State Duma",
  "Собственное гражданство": "A citizenship of its own",
  "Права на традиционное природопользование, льготы на промысел и досрочную пенсию":
    "Rights to the traditional use of the land, concessions for hunting and fishing, and an early pension",
  "Это не привилегия по происхождению, а возмещение за то, что современное хозяйство сокращает землю традиционного промысла.":
    "It is not a privilege of birth but a return for the fact that modern industry is shrinking the land of the traditional trades.",
  "Всегда ли титульный народ составляет большинство в своей республике?":
    "Is the titular people always the majority in its own republic?",
  "Нет: в Карелии карелов немного, в Башкортостане башкир около четверти":
    "No: there are few Karelians in Karelia, and Bashkirs are about a quarter in Bashkortostan",
  "Да, иначе республику переименовали бы": "Yes, otherwise the republic would be renamed",
  "Да, это условие статуса республики": "Yes, it is a condition of republic status",
  "Так было до 1993 года": "That was so until 1993",
  "Имя республики говорит об истории, а не о нынешней арифметике. В Чечне, Ингушетии, Дагестане и Туве титульные народы действительно преобладают.":
    "A republic's name speaks of history, not of present-day arithmetic. In Chechnya, Ingushetia, Dagestan and Tuva the titular peoples really are in the majority.",
  "Сколько человек при переписи 2021 года не указали национальность?":
    "How many people did not state their ethnicity in the census of 2021?",
  "Никто: ответ обязателен": "Nobody: the answer is compulsory",
  "Около шестнадцати миллионов": "About sixteen million",
  "Несколько тысяч": "A few thousand",
  "Около миллиона": "About a million",
  "Ответ на этот вопрос переписи добровольный, и очень многие им не воспользовались.":
    "The answer to that census question is voluntary, and a great many people did not give one.",
  "Как перевести выражение «многонациональный народ» из преамбулы на язык прав?":
    "How is the phrase multi-ethnic people from the preamble put into the language of rights?",
  "Суверенитет принадлежит крупнейшему народу": "Sovereignty belongs to the largest people",
  "Суверенитет разделён между республиками": "Sovereignty is divided among the republics",
  "Суверенитет принадлежит всем народам страны вместе":
    "Sovereignty belongs to all the peoples of the country together",
  "Каждый народ обладает собственным суверенитетом": "Each people holds a sovereignty of its own",
  "Носитель суверенитета в статье 3 назван так же, как в преамбуле. Отсюда и федеративное устройство страны.":
    "Article 3 names the bearer of sovereignty in the same words as the preamble. The country's federal structure follows from that.",
  "Какое право, кроме указания национальности, даёт статья 26?":
    "Which right besides stating one's ethnicity does Article 26 give?",
  "Пользоваться родным языком и свободно выбирать язык общения и обучения":
    "To use one's native language and to choose freely the language of communication and of learning",
  "Требовать преподавания на родном языке в любой школе страны":
    "To demand teaching in one's native language in any school in the country",
  "Получать документы на родном языке в любом органе власти":
    "To receive documents in one's native language from any authority",
  "Менять гражданство без согласия государства":
    "To change citizenship without the state's consent",
  "Свободный выбор языка общения, воспитания, обучения и творчества. Обязать государство преподавать любой язык где угодно эта статья не может.":
    "The free choice of the language of communication, upbringing, learning and creative work. That article cannot oblige the state to teach any language anywhere.",
  "В каких республиках титульный народ составляет уверенное большинство?":
    "In which republics is the titular people a clear majority?",
  "В Мордовии и Удмуртии": "In Mordovia and Udmurtia",
  "Ни в одной": "In none of them",
  "В Чечне, Ингушетии, Дагестане и Туве": "In Chechnya, Ingushetia, Dagestan and Tuva",
  "В Карелии и Коми": "In Karelia and Komi",
  "В Карелии карелов небольшая доля, в Мордовии и Удмуртии преобладают русские. Национальный состав в России — вопрос конкретного места, а не общей цифры.":
    "Karelians are a small share in Karelia, and Russians are the majority in Mordovia and Udmurtia. The ethnic make-up in Russia is a question of the particular place, not of a general figure.",
  "Почему число народов при каждой переписи оказывается спорным?":
    "Why is the number of peoples open to argument at every census?",
  "Часть народов запрещено учитывать": "Some peoples may not be counted",
  "Перепись записывает самоопределение, а границы между близкими группами проводят по-разному":
    "The census writes down self-definition, and the lines between close groups are drawn in different ways",
  "Перепись охватывает не всю страну": "The census does not cover the whole country",
  "Список народов утверждается заново каждые десять лет":
    "The list of peoples is approved afresh every ten years",
  "Одни считают группу самостоятельным народом, другие — частью соседнего. Ни один вариант подсчёта не отменяет ответа самого человека.":
    "Some count a group as a people of its own, others as part of the neighbouring one. No way of counting overrides the answer a person gives.",
  "Какая численность служит верхней границей для коренного малочисленного народа?":
    "What number serves as the upper limit for a small indigenous people?",
  "Сто тысяч человек": "A hundred thousand people",
  "Десять тысяч человек": "Ten thousand people",
  "Границы нет": "There is no limit",
  "Пятьдесят тысяч человек": "Fifty thousand people",
  "Кроме численности учитываются жизнь на землях предков, традиционное хозяйство и осознание себя самостоятельной общностью. Некоторые из этих народов — несколько сотен человек.":
    "Besides numbers, what counts is life on ancestral lands, a traditional way of making a living and seeing oneself as a community apart. Some of these peoples number a few hundred.",
  "Какой язык является государственным на всей территории страны?":
    "Which language is the state language across the whole country?",
  "Государственного языка нет": "There is no state language",
  "Русский": "Russian",
  "Каждый регион решает сам": "Each region decides for itself",
  "Статья 68. Республики могут добавить к нему свои государственные языки, но заменить русский не могут.":
    "Article 68. The republics may add state languages of their own to it, but they cannot replace Russian.",
  "Какая статья Конституции объявляет Россию светским государством?":
    "Which article of the Constitution declares Russia a secular state?",
  "Статья 28": "Article 28",
  "Статья 28 даёт свободу совести, статья 68 говорит о языках, статья 69 — о коренных малочисленных народах.":
    "Article 28 gives freedom of conscience, Article 68 speaks of languages, Article 69 of the small indigenous peoples.",
  "Является ли Пасха нерабочим днём по федеральному закону?":
    "Is Easter a non-working day under federal law?",
  "Нет, но она всегда приходится на воскресенье": "No, but it always falls on a Sunday",
  "Да, вместе с понедельником после неё": "Yes, along with the Monday after it",
  "Да, но только в отдельных республиках": "Yes, but only in some republics",
  "Да, с 1997 года": "Yes, since 1997",
  "Из религиозных праздников нерабочим днём по всей стране объявлено только 7 января. Пасха передвижная и в перечень не входит.":
    "Of the religious holidays only 7 January is declared a non-working day across the country. Easter moves and is not on the list.",
  "В каких регионах традиционен буддизм?": "In which regions is Buddhism traditional?",
  "В Татарстане и Башкортостане": "In Tatarstan and Bashkortostan",
  "В Дагестане и Чечне": "In Dagestan and Chechnya",
  "В Калмыкии, Бурятии и Туве": "In Kalmykia, Buryatia and Tuva",
  "Калмыкия — единственный буддийский регион в Европе. Татарстан, Башкортостан, Дагестан и Чечня — области распространения ислама.":
    "Kalmykia is the only Buddhist region in Europe. Tatarstan, Bashkortostan, Dagestan and Chechnya are lands where Islam is widespread.",
  "Сколько примерно языков народов России существует?":
    "Roughly how many languages of the peoples of Russia are there?",
  "Ровно сто": "Exactly a hundred",
  "Более тысячи": "More than a thousand",
  "Около ста пятидесяти": "About a hundred and fifty",
  "Около двадцати": "About twenty",
  "Часть из них ЮНЕСКО относит к исчезающим. Государственный статус в республиках имеют несколько десятков.":
    "UNESCO counts some of them as endangered. A few dozen have state status in the republics.",
  "Что гарантирует статья 28?": "What does Article 28 guarantee?",
  "Право менять только между традиционными религиями":
    "The right to change only between the traditional religions",
  "Свободу совести, включая право не исповедовать никакой религии":
    "Freedom of conscience, including the right to profess no religion at all",
  "Право религиозных объединений на бюджетную поддержку":
    "The right of religious associations to support from the budget",
  "Обязательное изучение основ религии в школе":
    "Compulsory study of the basics of religion at school",
  "Свободно выбирать, иметь и распространять убеждения и действовать в согласии с ними. Право не верить в этой статье записано наравне с правом верить.":
    "To choose, hold and spread beliefs freely and to act in keeping with them. The right not to believe is written into that article on a level with the right to believe.",
  "Какая республика объявила государственными языки всех своих народов сразу?":
    "Which republic declared the languages of all its peoples state languages at once?",
  "Якутия": "Yakutia",
  "Бурятия": "Buryatia",
  "Карелия": "Karelia",
  "Дагестан": "Dagestan",
  "Их там больше десятка. Это самый многоязычный субъект страны, и решение отражает именно это.":
    "There are more than a dozen of them there. It is the country's most many-tongued federal subject, and the decision reflects exactly that.",
  "Что решил Конституционный Суд в 2004 году о письменности?":
    "What did the Constitutional Court decide in 2004 about writing systems?",
  "Требование единой графической основы соответствует Конституции":
    "The requirement of a single graphic base agrees with the Constitution",
  "Республики вправе выбирать письменность сами":
    "The republics may choose their writing system themselves",
  "Латиница допустима для языков без своей традиции":
    "The Latin alphabet is allowed for languages with no tradition of their own",
  "Вопрос относится к ведению муниципалитетов": "The question belongs to the municipalities",
  "Письменность государственных языков признана вопросом общегосударственным, а не только республиканским.":
    "The writing system of the state languages was held to be a matter for the whole state, not for the republic alone.",
  "Какие религии названы в преамбуле закона о свободе совести 1997 года?":
    "Which religions are named in the preamble of the 1997 law on freedom of conscience?",
  "Преамбула религий не называет": "The preamble names no religions",
  "Христианство, ислам, буддизм и иудаизм": "Christianity, Islam, Buddhism and Judaism",
  "Только православие": "Orthodoxy alone",
  "Все зарегистрированные объединения перечислены поимённо":
    "Every registered association is listed by name",
  "Преамбула признаёт особую роль православия в истории страны и выражает уважение к этим религиям как части исторического наследия народов России.":
    "The preamble acknowledges the particular part Orthodoxy has played in the country's history and expresses respect for these religions as part of the historical heritage of the peoples of Russia.",
  "Какой праздник отмечается 24 мая?": "Which holiday is marked on 24 May?",
  "День славянской письменности и культуры": "The Day of Slavonic Writing and Culture",
  "День русского языка": "Russian Language Day",
  "День русского языка — 6 июня, в день рождения Пушкина; День народного единства — 4 ноября; День Конституции — 12 декабря.":
    "Russian Language Day is 6 June, Pushkin's birthday; National Unity Day is 4 November; Constitution Day is 12 December.",
  "Как обстоит дело с выходными на Ураза-байрам и Курбан-байрам?":
    "How do days off stand for Uraza Bayram and Kurban Bayram?",
  "Их объявляют выходными законы отдельных республик":
    "The laws of particular republics declare them days off",
  "Это нерабочие дни по всей стране": "They are non-working days across the whole country",
  "Они не бывают выходными нигде": "They are days off nowhere",
  "Решение принимает работодатель": "The employer decides",
  "Общероссийский нерабочий религиозный праздник один — 7 января. Остальное решается региональным законом.":
    "There is one all-Russian non-working religious holiday, 7 January. The rest is decided by regional law.",
  "После какого события в законе о языках появилось требование кириллицы?":
    "After which event did the requirement of Cyrillic appear in the law on languages?",
  "После принятия Конституции 1993 года": "After the adoption of the Constitution of 1993",
  "После переписи 2002 года": "After the census of 2002",
  "После решения Татарстана перевести татарскую письменность на латиницу":
    "After Tatarstan decided to move Tatar writing to the Latin alphabet",
  "После распада СССР": "After the break-up of the USSR",
  "Республика приняла такое решение в конце 1990-х. Требование единой графической основы появилось в ответ, а в 2004 году его подтвердил Конституционный Суд.":
    "The republic took that decision at the end of the 1990s. The requirement of a single graphic base appeared in answer, and in 2004 the Constitutional Court upheld it.",
  "Что задало нынешний облик русских печатных букв?":
    "What set the present look of Russian printed letters?",
  "Типографские правила XIX века": "The printing rules of the nineteenth century",
  "Гражданская азбука Петра I 1708 года": "Peter I's civil alphabet of 1708",
  "Реформа орфографии 1918 года": "The spelling reform of 1918",
  "Азбука Кирилла и Мефодия без изменений": "The alphabet of Cyril and Methodius, unchanged",
  "Кирилл и Мефодий принесли письменность в IX веке, реформа 1918 года убрала несколько букв, а форму нынешнего шрифта задала гражданская азбука.":
    "Cyril and Methodius brought writing in the ninth century, the reform of 1918 took several letters out, and the shape of today's type was set by the civil alphabet.",
  "Может ли алфавит государственного языка республики строиться не на кириллице?":
    "May the alphabet of a republic's state language be built on something other than Cyrillic?",
  "Нет ни при каких условиях": "No, under no conditions",
  "Да, по решению парламента республики": "Yes, by a decision of the republic's parliament",
  "Да, если язык не имеет кириллической традиции":
    "Yes, if the language has no Cyrillic tradition",
  "Только если это установит федеральный закон": "Only if a federal law says so",
  "Закон о языках оставляет такую возможность, но отдаёт её федеральному законодателю, а не республике.":
    "The law on languages leaves that possibility open, but gives it to the federal legislator, not to the republic.",
  "Кого считают создателем современного русского литературного языка?":
    "Who is held to be the creator of the modern Russian literary language?",
  "Николая Карамзина": "Nikolai Karamzin",
  "Александра Пушкина": "Alexander Pushkin",
  "Михаила Ломоносова": "Mikhail Lomonosov",
  "Льва Толстого": "Leo Tolstoy",
  "До него книжный и разговорный язык расходились гораздо сильнее. «Евгений Онегин» написан уже языком, который читается сегодня почти без пояснений.":
    "Before him the language of books and the language of speech were much further apart. Eugene Onegin is already written in a language that reads today with almost no explaining.",
  "Какого числа отмечается День русского языка?": "On what date is Russian Language Day marked?",
  "1 сентября": "1 September",
  "6 июня": "6 June",
  "24 мая": "24 May",
  "В день рождения Пушкина. Это же число — Пушкинский день России, а 24 мая отмечают День славянской письменности.":
    "On Pushkin's birthday. The same date is Pushkin Day in Russia, and 24 May is the Day of Slavonic Writing.",
  "Кто написал «Войну и мир»?": "Who wrote War and Peace?",
  "Фёдор Достоевский": "Fyodor Dostoevsky",
  "Иван Тургенев": "Ivan Turgenev",
  "Антон Чехов": "Anton Chekhov",
  "Ему же принадлежит «Анна Каренина», а усадьба Ясная Поляна сохранена как музей.":
    "Anna Karenina is his as well, and the estate at Yasnaya Polyana is kept as a museum.",
  "Как называется главное собрание русского искусства в Москве?":
    "What is the main collection of Russian art in Moscow called?",
  "Оружейная палата": "The Armoury",
  "Пушкинский дом": "Pushkin House",
  "Она выросла из частного собрания купца Павла Третьякова. Русский музей — петербургский, основан в 1895 году.":
    "It grew out of the private collection of the merchant Pavel Tretyakov. The Russian Museum is in Petersburg and was founded in 1895.",
  "Кто написал «Преступление и наказание»?": "Who wrote Crime and Punishment?",
  "Николай Гоголь": "Nikolai Gogol",
  "Михаил Лермонтов": "Mikhail Lermontov",
  "Ему же принадлежат «Идиот» и «Братья Карамазовы». Из русских авторов его, вероятно, чаще всех переводят и ставят на сцене.":
    "The Idiot and The Brothers Karamazov are his as well. Of the Russian authors he is probably the most translated and the most staged.",
  "Кто из русских писателей был вынужден отказаться от Нобелевской премии?":
    "Which Russian writer was forced to turn down the Nobel Prize?",
  "Иосиф Бродский": "Joseph Brodsky",
  "Премия 1958 года. Отказ был вынужденным, под давлением; Бунин, Шолохов, Солженицын и Бродский свои премии получили.":
    "The prize of 1958. The refusal was forced, under pressure; Bunin, Sholokhov, Solzhenitsyn and Brodsky received theirs.",
  "Что такое «Русские сезоны»?": "What were the Russian Seasons?",
  "Ежегодный фестиваль в Большом театре": "A yearly festival at the Bolshoi Theatre",
  "Цикл выставок передвижников": "A run of exhibitions by the Peredvizhniki",
  "Серия концертов Чайковского за границей": "A series of Tchaikovsky concerts abroad",
  "Показы русского балета в Париже, начатые Дягилевым в 1909 году":
    "Showings of Russian ballet in Paris, begun by Diaghilev in 1909",
  "Именно после них русский балет стал мировым эталоном: танцовщики и декорации оказались такими, каких в Париже не видели.":
    "It was after them that Russian ballet became the world's measure: the dancers and the sets turned out to be like nothing Paris had seen.",
  "Кто основал Московский Художественный театр?": "Who founded the Moscow Art Theatre?",
  "Станиславский и Немирович-Данченко": "Stanislavsky and Nemirovich-Danchenko",
  "Дягилев и Нижинский": "Diaghilev and Nijinsky",
  "Чехов и Горький": "Chekhov and Gorky",
  "Мейерхольд и Вахтангов": "Meyerhold and Vakhtangov",
  "Театр открылся в 1898 году, а метод работы с актёром — система Станиславского — преподаётся в театральных школах по всему миру.":
    "The theatre opened in 1898, and its way of working with an actor — the Stanislavsky system — is taught in drama schools all over the world.",
  "Кому принадлежат балеты «Лебединое озеро», «Спящая красавица» и «Щелкунчик»?":
    "Whose are the ballets Swan Lake, The Sleeping Beauty and The Nutcracker?",
  "Сергею Рахманинову": "Sergei Rachmaninoff's",
  "Петру Чайковскому": "Pyotr Tchaikovsky's",
  "Сергею Прокофьеву": "Sergei Prokofiev's",
  "Игорю Стравинскому": "Igor Stravinsky's",
  "На этих трёх балетах держится мировой балетный репертуар. Стравинскому принадлежит «Весна священная», Прокофьеву — «Ромео и Джульетта».":
    "The world's ballet repertoire rests on those three. The Rite of Spring is Stravinsky's, Romeo and Juliet Prokofiev's.",
  "Что объединяло передвижников?": "What held the Peredvizhniki together?",
  "Работа при императорской Академии художеств": "Working under the Imperial Academy of Arts",
  "Отказ от пейзажа как жанра": "Turning away from landscape as a genre",
  "Товарищество 1870 года, возившее выставки по городам":
    "The society of 1870 that took exhibitions round the towns",
  "Общая манера письма": "A shared manner of painting",
  "Устав и выставочный маршрут, а не стиль: писали они очень по-разному, и пейзаж у них стал самостоятельным сюжетом.":
    "A charter and an exhibition route, not a style: they painted very differently, and landscape became a subject in its own right with them.",
  "Где впервые исполнили Ленинградскую симфонию Шостаковича?":
    "Where was Shostakovich's Leningrad Symphony first performed?",
  "В осаждённом Ленинграде в августе 1942 года": "In besieged Leningrad in August 1942",
  "В Москве после войны": "In Moscow after the war",
  "В Куйбышеве в 1945 году": "In Kuibyshev in 1945",
  "В Нью-Йорке": "In New York",
  "Оркестр собрали из оставшихся в живых музыкантов города. Это Седьмая симфония композитора.":
    "The orchestra was put together from the musicians of the city who were still alive. It is the composer's Seventh Symphony.",
  "Сколько русских авторов получили Нобелевскую премию по литературе?":
    "How many Russian authors have received the Nobel Prize in literature?",
  "Один": "One",
  "Пятеро": "Five",
  "Двое": "Two",
  "Бунин в 1933 году, Пастернак в 1958-м, Шолохов в 1965-м, Солженицын в 1970-м и Бродский в 1987-м.":
    "Bunin in 1933, Pasternak in 1958, Sholokhov in 1965, Solzhenitsyn in 1970 and Brodsky in 1987.",
  "Какие четыре пьесы Чехова держат мировой репертуар?":
    "Which four plays of Chekhov's hold the world repertoire?",
  "«Три сестры», «Маскарад», «Борис Годунов», «Женитьба»":
    "Three Sisters, Masquerade, Boris Godunov, The Marriage",
  "«Чайка», «Дядя Ваня», «Три сестры», «Вишнёвый сад»":
    "The Seagull, Uncle Vanya, Three Sisters, The Cherry Orchard",
  "«Ревизор», «Гроза», «Горе от ума», «Чайка»":
    "The Government Inspector, The Storm, Woe from Wit, The Seagull",
  "«На дне», «Чайка», «Вишнёвый сад», «Бесприданница»":
    "The Lower Depths, The Seagull, The Cherry Orchard, Without a Dowry",
  "Чайка со шторы Художественного театра — эмблема именно отсюда. Остальные названия принадлежат Гоголю, Островскому, Грибоедову, Горькому, Лермонтову и Пушкину.":
    "The seagull on the Art Theatre's curtain is the emblem from exactly here. The other titles belong to Gogol, Ostrovsky, Griboyedov, Gorky, Lermontov and Pushkin.",
  "Чем известен Иван Айвазовский?": "What is Ivan Aivazovsky known for?",
  "Портретами императорской семьи": "Portraits of the imperial family",
  "Лесными пейзажами": "Forest landscapes",
  "Историческими полотнами о Сибири": "Historical canvases about Siberia",
  "Морскими видами: почти шесть тысяч полотен": "Sea views: almost six thousand canvases",
  "Он работал в Феодосии. Лес — это Шишкин, сибирские сюжеты — Суриков.":
    "He worked in Feodosia. The forest is Shishkin, the Siberian subjects Surikov.",
  "В каком году основана Академия наук?": "In which year was the Academy of Sciences founded?",
  "В 1724 году, указом Петра I": "In 1724, by a decree of Peter I",
  "В 1755 году": "In 1755",
  "Одно из старейших научных учреждений Европы, созданное сразу как государственное. В 1755 году основан Московский университет.":
    "One of the oldest scientific institutions in Europe, created as a state body from the start. Moscow University was founded in 1755.",
  "Кто сформулировал периодический закон?": "Who formulated the periodic law?",
  "Иван Павлов": "Ivan Pavlov",
  "Лев Ландау": "Lev Landau",
  "Дмитрий Менделеев": "Dmitri Mendeleev",
  "Михаил Ломоносов": "Mikhail Lomonosov",
  "1869 год. В таблице остались пустые клетки под неоткрытые элементы, и когда их нашли, свойства совпали с предсказанными.":
    "1869. Empty cells were left in the table for undiscovered elements, and when they were found their properties matched what had been predicted.",
  "Какого числа отмечается День космонавтики?": "On what date is Cosmonautics Day marked?",
  "12 апреля": "12 April",
  "4 октября": "4 October",
  "В этот день в 1961 году состоялся первый полёт человека в космос. 4 октября 1957 года был запущен первый спутник.":
    "On that day in 1961 the first flight of a human being into space took place. On 4 October 1957 the first satellite was launched.",
  "Кто стала первой женщиной в космосе?": "Who was the first woman in space?",
  "Светлана Савицкая": "Svetlana Savitskaya",
  "Елена Кондакова": "Yelena Kondakova",
  "Анна Кикина": "Anna Kikina",
  "1963 год, корабль «Восток-6». Савицкая первой из женщин вышла в открытый космос в 1984 году.":
    "1963, the craft Vostok 6. Savitskaya was the first woman to walk in open space, in 1984.",
  "По чьему замыслу основан Московский университет?":
    "On whose idea was Moscow University founded?",
  "Екатерины II": "Catherine II's",
  "Дмитрия Менделеева": "Dmitri Mendeleev's",
  "Петра I": "Peter I's",
  "Университет открыт в 1755 году и носит его имя. Ломоносов был химиком, физиком, астрономом, поэтом и историком сразу.":
    "The university opened in 1755 and bears his name. Lomonosov was a chemist, a physicist, an astronomer, a poet and a historian all at once.",
  "Кто первым из россиян получил Нобелевскую премию?":
    "Who was the first Russian to receive a Nobel Prize?",
  "Илья Мечников": "Ilya Mechnikov",
  "Пётр Капица": "Pyotr Kapitsa",
  "1904 год, за работы о пищеварении. Мечников получил премию в 1908 году за учение об иммунитете.":
    "1904, for work on digestion. Mechnikov received the prize in 1908 for his teaching on immunity.",
  "Кто был главным конструктором космической программы?":
    "Who was the chief designer of the space programme?",
  "Константин Циолковский": "Konstantin Tsiolkovsky",
  "Игорь Курчатов": "Igor Kurchatov",
  "Сергей Королёв": "Sergei Korolyov",
  "Его имя держали в тайне до самой смерти в 1966 году. Циолковский был теоретиком, Курчатов вёл атомный проект.":
    "His name was kept secret until his death in 1966. Tsiolkovsky was a theorist, Kurchatov led the atomic project.",
  "Кто первым вышел в открытый космос?": "Who was the first to walk in open space?",
  "1965 год, корабль «Восход-2». Гагарин совершил первый полёт, Титов был вторым, Терешкова — первой женщиной.":
    "1965, the craft Voskhod 2. Gagarin made the first flight, Titov was second, Tereshkova the first woman.",
  "В какой стране находится космодром Байконур?": "In which country is the Baikonur cosmodrome?",
  "На границе России и Казахстана": "On the border of Russia and Kazakhstan",
  "В Казахстане, Россия его арендует": "In Kazakhstan; Russia leases it",
  "В России, Оренбургская область": "In Russia, in Orenburg oblast",
  "В Узбекистане": "In Uzbekistan",
  "Космодром остался за границей после распада СССР. Именно поэтому в Амурской области построили Восточный.":
    "The cosmodrome was left abroad after the break-up of the USSR. That is exactly why Vostochny was built in Amur oblast.",
  "Сколько проработала на орбите станция «Мир»?": "How long did the Mir station work in orbit?",
  "Двадцать пять лет": "Twenty-five years",
  "Она работает до сих пор": "It is still working today",
  "Пятнадцать лет, с 1986 по 2001 год": "Fifteen years, from 1986 to 2001",
  "Пять лет, как и рассчитывали": "Five years, as planned",
  "Расчётный срок был пятилетним. С 1998 года Россия участвует в Международной космической станции.":
    "The planned life was five years. Since 1998 Russia has taken part in the International Space Station.",
  "Кто руководил атомным проектом?": "Who led the atomic project?",
  "Андрей Сахаров": "Andrei Sakharov",
  "При нём в 1954 году в Обнинске заработала первая в мире атомная электростанция, а в 1959-м вышел в море атомный ледокол.":
    "Under him the world's first nuclear power station started up at Obninsk in 1954, and in 1959 a nuclear icebreaker put to sea.",
  "Кто заложил теоретическую основу космонавтики?":
    "Who laid the theoretical ground of cosmonautics?",
  "Николай Кибальчич": "Nikolai Kibalchich",
  "Валентин Глушко": "Valentin Glushko",
  "Константин Циолковский, школьный учитель из Калуги":
    "Konstantin Tsiolkovsky, a schoolteacher from Kaluga",
  "Расчёт ракетного движения он опубликовал в 1903 году — за полвека до первого спутника.":
    "He published his calculation of rocket motion in 1903 — half a century before the first satellite.",
  "Чем важен атомный ледокольный флот?": "Why does the nuclear icebreaker fleet matter?",
  "Он принадлежит нескольким странам совместно": "It belongs to several countries jointly",
  "Он единственный в мире, и без него Северный морской путь не работал бы круглый год":
    "It is the only one in the world, and without it the Northern Sea Route would not work all year round",
  "Он используется только для научных экспедиций": "It is used for scientific expeditions only",
  "Он заменяет атомные электростанции на севере":
    "It takes the place of nuclear power stations in the north",
  "Первым был ледокол «Ленин», вышедший в море в 1959 году.":
    "The first was the icebreaker Lenin, which put to sea in 1959.",
  "Что такое «Луноход-1»?": "What was Lunokhod 1?",
  "Первая ракета, достигшая Луны": "The first rocket to reach the Moon",
  "Первый спутник Луны": "The first satellite of the Moon",
  "Проект, который так и не был запущен": "A project that was never launched",
  "Первый самоходный аппарат, работавший на другом небесном теле":
    "The first self-propelled craft to work on another heavenly body",
  "1970 год. Через год на орбиту вышла первая орбитальная станция — «Салют-1».":
    "1970. A year later the first orbital station, Salyut 1, went into orbit.",
  "В какой форме заключается трудовой договор?": "In what form is an employment contract made?",
  "Записью в трудовой книжке": "By an entry in the work record book",
  "Письменно, в двух экземплярах": "In writing, in two copies",
  "Устно, при свидетелях": "Orally, before witnesses",
  "Только через нотариуса": "Only through a notary",
  "Один экземпляр остаётся у работника. Если человека фактически допустили к работе, договор считается заключённым и без подписанной бумаги.":
    "One copy stays with the worker. If a person has in fact been allowed to start work, the contract counts as made even with no paper signed.",
  "Какова нормальная продолжительность рабочей недели?":
    "What is the normal length of the working week?",
  "Не более 48 часов": "No more than 48 hours",
  "Её устанавливает работодатель": "The employer sets it",
  "Не более 40 часов": "No more than 40 hours",
  "Не более 36 часов": "No more than 36 hours",
  "Трудовой кодекс задаёт верхнюю границу; у отдельных категорий работников неделя короче.":
    "The Labour Code sets the upper limit; for some categories of worker the week is shorter.",
  "Из скольких копеек состоит рубль?": "How many kopecks make a rouble?",
  "Из ста": "A hundred",
  "Из десяти": "Ten",
  "Из тысячи": "A thousand",
  "Копейки давно отменены": "Kopecks were abolished long ago",
  "Графический знак рубля утверждён в 2013 году, а выпуск денег ведёт Центральный банк.":
    "The rouble's sign was approved in 2013, and the Central Bank issues the money.",
  "Как называется национальная платёжная система?": "What is the national payment system called?",
  "«Рубль»": "Rubl",
  "«Восток»": "Vostok",
  "«Спутник»": "Sputnik",
  "«Мир»": "Mir",
  "Пенсии и бюджетные выплаты зачисляются именно на такие карты. Безналичная оплата в стране распространена очень широко.":
    "Pensions and payments from the budget go onto exactly those cards. Paying without cash is very widespread in the country.",
  "Какова наибольшая длительность испытательного срока по общему правилу?":
    "What is the longest probation period as a general rule?",
  "Шесть месяцев для всех": "Six months for everyone",
  "Год": "A year",
  "Три месяца": "Three months",
  "Один месяц": "One month",
  "До шести месяцев испытание допускается только для руководителей организаций, их заместителей и главных бухгалтеров.":
    "A probation of up to six months is allowed only for heads of organisations, their deputies and chief accountants.",
  "Как часто должна выплачиваться заработная плата?": "How often must wages be paid?",
  "Не реже одного раза в квартал": "At least once a quarter",
  "Не реже чем каждые полмесяца": "At least every half-month",
  "Один раз в месяц": "Once a month",
  "По усмотрению работодателя": "At the employer's discretion",
  "Аванс здесь не любезность работодателя, а прямое требование Трудового кодекса.":
    "The advance here is not the employer's kindness but a direct requirement of the Labour Code.",
  "Что такое МРОТ?": "What is the MROT?",
  "Средняя зарплата по стране": "The average wage in the country",
  "Размер пособия по безработице": "The size of unemployment benefit",
  "Минимальный стаж для пенсии": "The minimum record of service for a pension",
  "Минимальный размер оплаты труда, ниже которого платить нельзя":
    "The minimum wage, below which nobody may be paid",
  "Устанавливается федеральным законом. В регионе может действовать собственное, более высокое соглашение.":
    "It is set by federal law. A region may have an agreement of its own, at a higher level.",
  "Что произошло с трудовой книжкой в 2020 году?":
    "What happened to the work record book in 2020?",
  "Её перевели в электронный вид": "It was moved into electronic form",
  "Её отменили совсем": "It was abolished altogether",
  "Её стали хранить у работника дома": "It began to be kept at the worker's home",
  "Её заменил трудовой договор": "The employment contract replaced it",
  "Тем, кто устраивается на работу впервые, бумажную книжку уже не заводят: сведения о стаже хранит Социальный фонд.":
    "People taking a job for the first time no longer get a paper book: the Social Fund keeps the record of service.",
  "Каковы ставки налога на профессиональный доход у самозанятых?":
    "What are the rates of the professional income tax for the self-employed?",
  "Самозанятые налог не платят": "The self-employed pay no tax",
  "4 % с поступлений от частных лиц и 6 % от организаций":
    "4% on receipts from private individuals and 6% from organisations",
  "13 % со всего дохода": "13% on all income",
  "6 % во всех случаях": "6% in every case",
  "Режим действует с 2019 года, без отчётности и без кассы, пока доход не превышает 2,4 миллиона рублей в год.":
    "The regime has been in force since 2019, with no accounts and no till, as long as the income does not go over 2.4 million roubles a year.",
  "Каким станет пенсионный возраст к 2028 году?": "What will the pension age be by 2028?",
  "65 лет для всех": "65 for everyone",
  "Он останется прежним": "It will stay as it was",
  "65 лет для мужчин и 60 лет для женщин": "65 for men and 60 for women",
  "60 лет для мужчин и 55 лет для женщин": "60 for men and 55 for women",
  "Реформа 2018 года подняла возраст постепенно. Кроме возраста нужны стаж и пенсионные коэффициенты.":
    "The reform of 2018 raised the age step by step. Besides the age, a record of service and pension points are needed.",
  "Что такое СНИЛС?": "What is SNILS?",
  "Номер индивидуального лицевого счёта в пенсионном страховании":
    "The number of the personal account in pension insurance",
  "Номер налогоплательщика": "The taxpayer's number",
  "Номер полиса медицинского страхования": "The number of the medical insurance policy",
  "Номер трудового договора": "The number of the employment contract",
  "На нём копится стаж, и он нужен почти для любой государственной услуги. Номер налогоплательщика — это ИНН.":
    "The record of service builds up on it, and it is needed for almost any state service. The taxpayer's number is the INN.",
  "Есть ли трудовой договор, если человека допустили к работе, но бумагу не подписали?":
    "Is there an employment contract if a person has been allowed to start work but no paper has been signed?",
  "Только если прошло больше месяца": "Only if more than a month has passed",
  "Только по решению суда": "Only on a court decision",
  "Да, договор считается заключённым": "Yes, the contract counts as made",
  "Нет, до подписи отношений нет": "No, there is no relationship before the signature",
  "Работодатель обязан оформить документ письменно после этого, но права работника действуют с первого дня работы.":
    "The employer has to draw the document up in writing afterwards, but the worker's rights apply from the first day of work.",
  "К какой части дохода применяется повышенная ставка подоходного налога?":
    "To which part of income does the higher rate of income tax apply?",
  "К доходу супругов вместе": "To the spouses' income together",
  "Только к той части, которая перешла порог": "Only to the part that has crossed the threshold",
  "Ко всему доходу за год": "To all the income for the year",
  "К доходу следующего года": "To the next year's income",
  "Шкала действует с 2025 года: базовая ставка 13 %, выше порогов — 15, 18, 20 и 22 процента, каждая на своей части дохода.":
    "The scale has applied since 2025: the base rate is 13%, and above the thresholds 15, 18, 20 and 22 per cent, each on its own part of the income.",
  "Кто отвечает за устойчивость рубля?": "Who answers for the stability of the rouble?",
  "Министерство финансов": "The Ministry of Finance",
  "Это названо в Конституции его основной функцией. Выпуск денег тоже ведёт он.":
    "The Constitution names that as its main function. It issues the money as well.",
  "По какому номеру вызывают скорую помощь?": "Which number do you call for an ambulance?",
  "104": "104",
  "103": "103",
  "102": "102",
  "101 — пожарные и спасатели, 102 — полиция, 104 — аварийная газовая служба, 112 — единый экстренный номер.":
    "101 is the fire and rescue service, 102 the police, 104 the emergency gas service, 112 the single emergency number.",
  "Сколько классов занимает полное школьное обучение?": "How many years does full schooling take?",
  "Четыре года начальной школы, пять лет основной и два года старшей. Обязательными Конституция называет девять классов.":
    "Four years of primary school, five of basic school and two of senior school. The Constitution calls nine of those years compulsory.",
  "Какая школьная оценка является высшей?": "Which school mark is the highest?",
  "Шкала пятибалльная: 2 — неудовлетворительно, а единицу на практике почти не ставят.":
    "The scale runs to five: 2 is a fail, and in practice a 1 is almost never given.",
  "Когда начинается учебный год?": "When does the school year begin?",
  "1 августа": "1 August",
  "1 октября": "1 October",
  "В разные дни в разных регионах": "On different days in different regions",
  "Этот день называется Днём знаний и отмечается по всей стране одинаково.":
    "That day is called Knowledge Day and is kept the same way across the whole country.",
  "Кто платит взносы медицинского страхования за детей и пенсионеров?":
    "Who pays the medical insurance contributions for children and pensioners?",
  "Федеральный бюджет напрямую": "The federal budget directly",
  "Никто, они не застрахованы": "Nobody; they are not insured",
  "Регион": "The region",
  "Сами застрахованные": "The insured themselves",
  "За работающих взносы платит работодатель, за неработающих — субъект федерации.":
    "For those in work the employer pays the contributions, for those not in work the federal subject does.",
  "Что определяет объём бесплатной медицинской помощи?":
    "What decides how much medical care is free?",
  "Договор с работодателем": "The contract with the employer",
  "Программа государственных гарантий, утверждаемая ежегодно":
    "The programme of state guarantees, approved every year",
  "Решение главного врача поликлиники": "The decision of the head doctor of the clinic",
  "Страховая организация по своему усмотрению": "The insurance company, as it sees fit",
  "Всё, что за пределами программы, оказывается платно или по добровольному страхованию.":
    "Everything outside the programme is given for payment or under voluntary insurance.",
  "Как часто можно менять поликлинику?": "How often may you change clinic?",
  "В любой момент, сколько угодно раз": "At any moment, as often as you like",
  "Только при переезде в другой регион": "Only when moving to another region",
  "Менять её нельзя": "It cannot be changed",
  "Не чаще одного раза в год": "No more than once a year",
  "Прикрепление обычно идёт по месту жительства, но выбор возможен. Врача внутри поликлиники тоже можно выбрать, с его согласия.":
    "Registration usually follows where you live, but a choice is possible. A doctor inside the clinic can be chosen too, with their agreement.",
  "Что такое диспансеризация?": "What is dispanserizatsiya, the routine health check?",
  "Бесплатное профилактическое обследование по полису":
    "A free preventive examination under the insurance policy",
  "Постановка на учёт у психиатра": "Being put on a psychiatrist's register",
  "Осмотр перед приёмом на работу": "An examination before being taken on for a job",
  "Лечение в дневном стационаре": "Treatment in a day hospital",
  "До сорока лет она проходится раз в три года, после сорока — ежегодно, и на неё дают оплачиваемый выходной.":
    "Up to forty it is done once every three years, after forty every year, and a paid day off is given for it.",
  "Какие предметы на ЕГЭ обязательны для всех?":
    "Which subjects in the EGE are compulsory for everyone?",
  "Обязательных нет": "There are no compulsory ones",
  "Русский язык и математика": "Russian and mathematics",
  "Русский язык и история": "Russian and history",
  "Математика и иностранный язык": "Mathematics and a foreign language",
  "Остальные предметы выпускник выбирает под ту специальность, на которую собирается поступать.":
    "The leaver chooses the other subjects to fit the course they mean to apply for.",
  "Чем бюджетное место в вузе отличается от платного?":
    "How does a state-funded place at a university differ from a paid one?",
  "Оно даёт диплом другого образца": "It gives a diploma of a different kind",
  "Оно доступно только жителям региона": "It is open only to residents of the region",
  "Его оплачивает государство и распределяет по конкурсу баллов":
    "The state pays for it and shares it out by a competition of marks",
  "На нём учатся дольше": "It takes longer to study on it",
  "Конституция говорит именно так: высшее образование бесплатно на конкурсной основе — не всем, но и не за деньги.":
    "The Constitution says exactly that: higher education is free on a competitive basis — not for everyone, but not for money either.",
  "С какого года ЕГЭ проводится по всей стране?":
    "Since which year has the EGE been held across the whole country?",
  "С 2009 года": "Since 2009",
  "С 1999 года": "Since 1999",
  "С 2015 года": "Since 2015",
  "Он служит одновременно выпускным экзаменом школы и вступительным экзаменом вуза.":
    "It serves at once as the school leaving exam and as the university entrance exam.",
  "Действует ли полис медицинского страхования за пределами региона, где выдан?":
    "Does the medical insurance policy work outside the region where it was issued?",
  "Только в течение полугода": "Only for six months",
  "Только по экстренным случаям": "Only in emergencies",
  "Да, по всей стране": "Yes, across the whole country",
  "Нет, при переезде нужен новый": "No, a new one is needed on moving",
  "Переехав, менять полис не нужно — нужно только прикрепиться к новой поликлинике.":
    "After moving there is no need to change the policy — only to register with a new clinic.",
  "Чем специалитет отличается от бакалавриата по сроку?":
    "How does the specialist course differ from the bachelor's in length?",
  "Специалитет длится три года": "The specialist course lasts three years",
  "Специалист учится пять-шесть лет, бакалавр четыре":
    "A specialist studies five or six years, a bachelor four",
  "Наоборот, бакалавр учится дольше": "The other way round: the bachelor studies longer",
  "Сроки одинаковые": "The lengths are the same",
  "По специалитету учатся, например, врачи. После бакалавриата можно пойти в магистратуру ещё на два года.":
    "Doctors, for instance, study on the specialist course. After a bachelor's you can go on to a master's for two more years.",
  "По какому принципу принимают детей в школу?":
    "On what principle are children taken into a school?",
  "По результатам вступительного тестирования": "By the results of an entrance test",
  "По очереди подачи заявления, без учёта адреса":
    "By the order the applications came in, with no regard to address",
  "По выбору директора школы": "By the head teacher's choice",
  "По территориальному: за школой закреплён участок, и живущим на нём место гарантировано":
    "By territory: a catchment area is attached to the school, and those living in it are guaranteed a place",
  "Оставшиеся после закреплённых места распределяются между всеми остальными желающими.":
    "The places left after the catchment children are shared among everyone else who applies.",
  "Какой документ является основным у ребёнка до четырнадцати лет?":
    "Which document is the main one for a child under fourteen?",
  "Справка из школы": "A certificate from the school",
  "Свидетельство о рождении": "The birth certificate",
  "Паспорт родителя с записью о ребёнке": "A parent's passport with the child entered in it",
  "Полис медицинского страхования": "The medical insurance policy",
  "Паспорт выдаётся в четырнадцать лет, и с этого момента основным документом становится он.":
    "The passport is issued at fourteen, and from that moment it becomes the main document.",
  "Какой номер является единым для всех экстренных служб?":
    "Which number is the single one for all the emergency services?",
  "01": "01",
  "Со 112 можно позвонить без денег на счету, без сим-карты и с заблокированного телефона.":
    "112 can be called with no money on the account, with no SIM card and from a locked telephone.",
  "Что скрывается за вывеской «Мои документы»?": "What is behind the sign My Documents?",
  "Многофункциональный центр государственных услуг": "A multifunctional centre for state services",
  "Архив": "An archive",
  "Отделение полиции": "A police station",
  "Нотариальная контора": "A notary's office",
  "Одно окно почти для всего: паспорт, регистрация, справки, выписки, пособия.":
    "One window for almost everything: a passport, registration, certificates, extracts, benefits.",
  "По какому номеру вызывают полицию?": "Which number do you call for the police?",
  "101 — пожарные и спасатели, 103 — скорая помощь, 104 — аварийная газовая служба.":
    "101 is the fire and rescue service, 103 the ambulance, 104 the emergency gas service.",
  "Что пришло на смену прописке в 1993 году?": "What took the place of the propiska in 1993?",
  "Отметка в трудовой книжке": "An entry in the work record book",
  "Ничего, прописка сохранилась под другим названием":
    "Nothing; the propiska stayed under another name",
  "Регистрационный учёт, носящий уведомительный характер": "Registration, which only notifies",
  "Разрешение на проживание, выдаваемое городом": "A permit to live there, issued by the city",
  "Прописка разрешала жить в городе, регистрация лишь уведомляет государство об адресе. Конституционный Суд указывал, что она не может быть условием осуществления прав.":
    "The propiska allowed a person to live in a city; registration only tells the state the address. The Constitutional Court has pointed out that it cannot be a condition for exercising rights.",
  "Чем регистрация по месту жительства отличается от регистрации по месту пребывания?":
    "How does registration at a place of residence differ from registration at a place of stay?",
  "Между ними нет разницы": "There is no difference between them",
  "Первая постоянна и ставится штампом, вторая временна и оформляется свидетельством":
    "The first is permanent and goes in as a stamp, the second is temporary and comes as a certificate",
  "Первая для граждан, вторая для иностранцев":
    "The first is for citizens, the second for foreigners",
  "Первая бесплатна, вторая платна": "The first is free, the second is paid for",
  "Одна другую не отменяет: временная регистрация не лишает человека постоянной.":
    "One does not cancel the other: a temporary registration does not take away a permanent one.",
  "Что регистрируют органы записи актов гражданского состояния?":
    "What do the civil registry offices, the ZAGS, register?",
  "Только брак и развод": "Marriage and divorce only",
  "Сделки с недвижимостью": "Property transactions",
  "Место жительства": "Place of residence",
  "Рождение, брак, развод, отцовство, перемену имени и смерть":
    "Birth, marriage, divorce, fatherhood, a change of name and death",
  "Место жительства регистрируют другие органы, а сделки с недвижимостью — Росреестр.":
    "Other bodies register a place of residence, and property transactions go to Rosreestr.",
  "Каков брачный возраст?": "What is the age of marriage?",
  "18 лет, при уважительных причинах может быть снижен до 16":
    "18, and with good reason it can be lowered to 16",
  "21 год без исключений": "21 with no exceptions",
  "18 лет без исключений": "18 with no exceptions",
  "16 лет для всех": "16 for everyone",
  "В отдельных регионах региональный закон допускает и более ранний возраст. Между заявлением и регистрацией обычно проходит месяц.":
    "In some regions the regional law allows an even earlier age. A month usually passes between the application and the registration.",
  "На какой срок выдают заграничный паспорт?": "For how long is a foreign travel passport issued?",
  "Обычный на пять лет, биометрический на десять":
    "The ordinary one for five years, the biometric one for ten",
  "Оба на пять лет": "Both for five years",
  "Оба на десять лет": "Both for ten years",
  "Внутренний паспорт за пределами страны не действует, поэтому загранпаспорт оформляется отдельно.":
    "The internal passport is no good outside the country, so the foreign travel passport is issued separately.",
  "Какой возраст охватывает призыв на военную службу?":
    "Which ages does conscription for military service cover?",
  "От 16 до 25 лет": "From 16 to 25",
  "От 20 до 35 лет": "From 20 to 35",
  "От 18 до 30 лет": "From 18 to 30",
  "От 18 до 27 лет": "From 18 to 27",
  "Верхняя граница поднята с 27 до 30 лет с 2024 года. Мужчины при этом состоят на воинском учёте.":
    "The upper limit was raised from 27 to 30 in 2024. Men are on the military register all the same.",
  "Что даёт подтверждённая учётная запись на портале государственных услуг?":
    "What does a confirmed account on the state services portal give you?",
  "Возможность подать большинство заявлений и записаться на приём, не выходя из дома":
    "The chance to file most applications and book an appointment without leaving home",
  "Освобождение от государственных пошлин": "Freedom from state fees",
  "Право не иметь регистрации": "The right to have no registration",
  "Замену паспорта в электронном виде": "A passport replaced in electronic form",
  "Портал и приложение заменяют очередь, но не сам документ: паспорт по-прежнему бумажный.":
    "The portal and the app take the place of the queue, not of the document itself: the passport is still on paper.",
  "Лишает ли отсутствие регистрации права на медицинскую помощь?":
    "Does having no registration take away the right to medical care?",
  "Да, и школа ребёнку тоже недоступна": "Yes, and school is closed to the child as well",
  "Нет, и никакой ответственности не наступает": "No, and there is no liability at all",
  "Нет, но за проживание без неё дольше срока предусмотрен штраф":
    "No, but living without it beyond the time limit brings a fine",
  "Да, без регистрации помощь платная": "Yes; without registration care is paid for",
  "Регистрация — обязанность, а не разрешение: прав она не даёт и не отнимает, но не оформить её нельзя.":
    "Registration is a duty, not a permission: it neither gives rights nor takes them away, but it cannot be left undone.",
  "Что такое альтернативная гражданская служба?": "What is alternative civilian service?",
  "Отсрочка от призыва на время учёбы": "A deferment from call-up while studying",
  "Замена военной службы для тех, чьим убеждениям она противоречит":
    "A replacement for military service for those whose convictions are against it",
  "Служба по контракту за деньги": "Service under contract, for money",
  "Работа в военных учреждениях без оружия": "Work in military establishments without weapons",
  "Право на неё даёт Конституция. Такая служба дольше обычной и проходит, как правило, в гражданских учреждениях.":
    "The Constitution gives the right to it. Such service is longer than the ordinary kind and is done, as a rule, in civilian institutions.",
  "Чем занимается Социальный фонд?": "What does the Social Fund do?",
  "Медицинским страхованием": "Medical insurance",
  "Сбором налогов": "Collecting taxes",
  "Выдачей паспортов": "Issuing passports",
  "Пенсиями, пособиями, номером СНИЛС и сведениями о стаже":
    "Pensions, benefits, the SNILS number and the record of service",
  "Он образован объединением прежних пенсионного и социального фондов. Налоги собирает налоговая служба.":
    "It was formed by joining the former pension and social funds. The tax service collects the taxes.",
  "От чего образуется отчество?": "What is the patronymic formed from?",
  "От имени крёстного": "From the godfather's name",
  "От имени отца": "From the father's name",
  "От фамилии рода": "From the family surname",
  "От места рождения": "From the place of birth",
  "Иванович и Ивановна, Сергеевич и Сергеевна. Обращение по имени и отчеству считается уважительным.":
    "Ivanovich and Ivanovna, Sergeyevich and Sergeyevna. Addressing somebody by name and patronymic counts as respectful.",
  "Что принято делать, входя в квартиру?": "What is it usual to do on coming into a flat?",
  "Ничего особенного": "Nothing in particular",
  "Снимать верхнюю одежду только по просьбе хозяев": "Take off your coat only if the hosts ask",
  "Разуваться в прихожей": "Take your shoes off in the hall",
  "Оставлять обувь на лестничной площадке": "Leave your shoes on the landing",
  "Гостю обычно дают тапочки. Зимой улицы посыпают реагентами, и хозяева берегут пол.":
    "A guest is usually given slippers. In winter the streets are salted, and the hosts are looking after the floor.",
  "Что такое борщ?": "What is borshch?",
  "Суп со свёклой": "A soup with beetroot",
  "Каша из гречки": "A buckwheat porridge",
  "Пирог с мясом": "A meat pie",
  "Кисломолочный напиток": "A fermented milk drink",
  "Щи варят из капусты, уху — из рыбы. Суп здесь не закуска, а полноценное первое блюдо.":
    "Shchi is made from cabbage, ukha from fish. Soup here is not a starter but a full first course.",
  "Какой праздник считается главным семейным праздником года?":
    "Which holiday counts as the main family holiday of the year?",
  "Рождество": "Christmas",
  "Пасха": "Easter",
  "Новый год": "New Year",
  "Ставят ёлку, ждут Деда Мороза и Снегурочку, под бой курантов провожают старый год. Каникулы длятся с 1 по 8 января.":
    "A tree goes up, Ded Moroz and Snegurochka are waited for, and the old year is seen out to the striking of the Kremlin clock. The holidays run from 1 to 8 January.",
  "К кому обращаются по имени и отчеству?": "Whom do you address by name and patronymic?",
  "Только к государственным служащим": "State officials only",
  "К близким друзьям": "Close friends",
  "К преподавателю, врачу, начальнику, к человеку старше себя":
    "A teacher, a doctor, a manager, somebody older than yourself",
  "К любому незнакомому на улице": "Any stranger in the street",
  "Между знакомыми ровесниками обычно достаточно имени, часто уменьшительного.":
    "Between acquaintances of the same age the first name is usually enough, often in its short form.",
  "Кто предлагает перейти на «ты»?": "Who offers to move to the familiar you?",
  "Переход происходит сам собой": "The change happens by itself",
  "Старший или тот, кто выше по положению": "The older person, or the one higher in standing",
  "Младший, в знак доверия": "The younger one, as a sign of trust",
  "Тот, кто заговорил первым": "Whoever spoke first",
  "И предложение это обычно произносят вслух. К незнакомому, к старшему и к должностному лицу — только «вы».":
    "And the offer is usually said out loud. To a stranger, to an older person and to an official it is the formal you and nothing else.",
  "Что означает выражение «шесть соток»?": "What does the phrase six sotkas mean?",
  "Площадь типовой квартиры": "The floor area of a standard flat",
  "Норму жилья на человека": "The housing allowance per person",
  "Размер огорода при деревенском доме": "The size of the vegetable plot by a village house",
  "Размер дачного участка, какие раздавали в советское время":
    "The size of the dacha plot of the kind handed out in Soviet times",
  "Участки давали работникам предприятий, и дом на них строили своими руками. Летом города по выходным заметно пустеют именно поэтому.":
    "The plots were given to the workers of an enterprise, and the house on them was built by hand. That is exactly why the cities empty noticeably at weekends in summer.",
  "Чем парятся в бане?": "What do you use in the banya?",
  "Веником из берёзовых или дубовых веток": "A venik of birch or oak twigs",
  "Горячими камнями": "Hot stones",
  "Полотенцем, смоченным в кипятке": "A towel dipped in boiling water",
  "Ничем, просто сидят в жаре": "Nothing; you just sit in the heat",
  "Ходят компанией, между заходами пьют чай. Суббота — традиционный банный день.":
    "People go in company and drink tea between rounds. Saturday is the traditional banya day.",
  "Из чего состоит полный обед?": "What does a full dinner consist of?",
  "Из одного основного блюда": "Of one main course",
  "Из первого, второго и третьего": "Of a first, a second and a third course",
  "Из закуски и горячего": "Of a starter and a hot dish",
  "Из супа и десерта": "Of a soup and a dessert",
  "Первое — суп, второе — основное блюдо, третье — напиток: компот, кисель или чай.":
    "The first is the soup, the second the main dish, the third a drink: kompot, kisel or tea.",
  "Сколько длятся новогодние каникулы?": "How long do the New Year holidays last?",
  "Две недели": "Two weeks",
  "Это самый длинный нерабочий период в году, и на него приходится и Рождество 7 января.":
    "It is the longest non-working stretch of the year, and Christmas on 7 January falls inside it.",
  "Что такое маршрутка?": "What is a marshrutka?",
  "Микроавтобус по фиксированному маршруту, останавливающийся по просьбе":
    "A minibus on a fixed route that stops when asked",
  "Городской автобус большой вместимости": "A large city bus",
  "Такси с несколькими пассажирами": "A taxi with several passengers",
  "Пригородный поезд": "A suburban train",
  "Платят при входе или при выходе. Пригородный поезд называется электричкой.":
    "You pay getting on or getting off. The suburban train is called an elektrichka.",
  "Сочетается ли уменьшительное имя с отчеством?":
    "Does a short form of a name go with the patronymic?",
  "Да, в неофициальной обстановке": "Yes, in informal settings",
  "Сочетается только у женских имён": "It goes only with women's names",
  "Нет: с отчеством идёт только полное имя": "No: only the full name goes with the patronymic",
  "Да, так говорят с молодыми коллегами": "Yes, that is how people speak to young colleagues",
  "Уменьшительное имя между знакомыми — норма, а не фамильярность, но рядом с отчеством оно не стоит.":
    "A short name between acquaintances is the norm, not over-familiarity, but it does not stand beside the patronymic.",
  "В скольких российских городах работает метро?": "In how many Russian cities does a metro run?",
  "В каждом городе-миллионнике": "In every city of a million",
  "В семи": "In seven",
  "Только в Москве и Санкт-Петербурге": "In Moscow and St Petersburg only",
  "В двадцати с лишним": "In more than twenty",
  "Москва, Санкт-Петербург, Нижний Новгород, Новосибирск, Самара, Екатеринбург и Казань. В остальных городах ходят автобусы, троллейбусы и трамваи.":
    "Moscow, St Petersburg, Nizhny Novgorod, Novosibirsk, Samara, Yekaterinburg and Kazan. In the other cities there are buses, trolleybuses and trams.",
  "Почему жильцы не включают отопление в квартире сами?":
    "Why do residents not turn the heating on in the flat themselves?",
  "Это запрещено правилами дома": "The building's rules forbid it",
  "Отопление включают только по заявлению жильцов":
    "The heating is turned on only when the residents ask",
  "Каждая квартира отапливается своим котлом": "Each flat is heated by a boiler of its own",
  "Тепло идёт из общей котельной сразу на весь район":
    "The heat comes from one boiler house for a whole district at once",
  "Поэтому и решение о начале сезона принимается по погоде: когда среднесуточная температура пять дней держится ниже +8 °C.":
    "That is why the decision to start the season goes by the weather: when the average daily temperature stays below +8 °C for five days.",
};
