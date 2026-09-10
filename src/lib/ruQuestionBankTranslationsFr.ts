/**
 * French for the Zhizn v Rossii practice questions.
 *
 * The lesson cards are answered by ZHIZN_V_ROSSII_FR. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in French and then asked its
 * questions in Russian.
 *
 * Keyed on the RUSSIAN source text exactly as it appears in ruQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an е for
 * a ё or a hyphen where the sentence has an en dash, and the lookup misses in
 * silence. The question renders in Russian, the tap works, and nothing
 * anywhere reports it.
 *
 * WHAT THE FRENCH DOES follows ZHIZN_V_ROSSII_FR exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - names are transliterated the French way — Tchaïkovski, Iouri Gagarine,
 *     Iekaterinbourg, Koutouzov, Riourik — and a name French already spells
 *     its own way keeps that spelling;
 *   - an institution French has a settled name for takes it: the Douma
 *     d'État, le Conseil de la Fédération, la Cour constitutionnelle;
 *   - where the word IS the answer and French has nothing for it — SNILS,
 *     MROT, EGE, OGE, INN, ZATO, la propiska, la banya, le venik, la
 *     marchroutka, l'elektritchka — the French gives the meaning and keeps
 *     the term beside it, so the reader learns the word they will actually
 *     meet on the form or hear at the stop.
 *
 * Because the source is Cyrillic, none of those terms can survive into the
 * French character for character, so the keep list in
 * check-fr-bank-translation names them in pairs: СНИЛС has to come back as
 * SNILS. Every pair was measured against this finished table before it was
 * written down.
 *
 * A hundred and five of the bank's strings are not here and that is correct:
 * they are years, bare numbers and short answers that ZHIZN_V_ROSSII_FR
 * already answers. Every French table is spread into one object, so a key
 * present in two of them would lose one silently — the later spread would
 * decide both. check-fr-bank-translation measures coverage through
 * translateCourseText, the lookup a reader's tap actually goes through, so
 * those count as answered and are not duplicated here.
 */
export const RU_QUESTION_BANK_FR: Record<string, string> = {
  "Сколько полос на государственном флаге России?":
    "Combien de bandes le drapeau d'État de la Russie porte-t-il ?",
  "Две": "Deux",
  "Пять": "Cinq",
  "Три равные горизонтальные полосы. Порядок закреплён федеральным конституционным законом 2000 года.":
    "Trois bandes horizontales égales. Leur ordre est fixé par la loi constitutionnelle fédérale de 2000.",
  "При каком правителе появился российский триколор?":
    "Sous quel souverain le tricolore russe est-il apparu ?",
  "При Иване III": "Sous Ivan III",
  "При Петре I": "Sous Pierre Ier",
  "При Екатерине II": "Sous Catherine II",
  "При Александре II": "Sous Alexandre II",
  "При Петре I, сначала как флаг торговых судов. Двуглавый орёл в гербе, наоборот, старше: он появился при Иване III, в конце XV века.":
    "Sous Pierre Ier, d'abord comme pavillon des navires de commerce. L'aigle bicéphale des armes est au contraire plus ancien : il apparaît sous Ivan III, à la fin du quinzième siècle.",
  "Закреплены ли в законе значения цветов флага?":
    "Le sens des couleurs du drapeau est-il fixé par la loi ?",
  "Да, они перечислены в конституционном законе": "Oui, la loi constitutionnelle les énumère",
  "Нет: распространённые толкования появились позже и в законе их нет":
    "Non : les interprétations répandues sont venues plus tard et ne figurent pas dans la loi",
  "Да, но только для белого цвета": "Oui, mais pour le blanc seulement",
  "Значения устанавливает каждый субъект федерации":
    "Chaque sujet de la Fédération en fixe le sens",
  "Закон описывает полотнище и порядок полос, но не приписывает цветам смысла. Толкования вроде чистоты, верности и отваги — позднейшие и неофициальные.":
    "La loi décrit l'étoffe et l'ordre des bandes, mais n'attribue aucun sens aux couleurs. Les lectures du genre pureté, fidélité et bravoure sont plus tardives et non officielles.",
  "Какая птица изображена на государственном гербе?":
    "Quel oiseau figure sur les armes de l'État ?",
  "Одноглавый орёл": "Un aigle à une tête",
  "Двуглавый орёл": "Un aigle bicéphale",
  "Сокол": "Un faucon",
  "Лебедь": "Un cygne",
  "Золотой двуглавый орёл на красном щите, с тремя коронами, скипетром и державой, и всадником на груди.":
    "Un aigle bicéphale d'or sur écu rouge, avec trois couronnes, un sceptre et un globe, et un cavalier sur la poitrine.",
  "Сколько корон над головами орла на гербе?":
    "Combien de couronnes surmontent les têtes de l'aigle sur les armes ?",
  "Одна": "Une",
  "Ни одной": "Aucune",
  "Три короны, которые сегодня толкуют как символ суверенитета Российской Федерации и её частей.":
    "Trois couronnes, que l'on lit aujourd'hui comme le symbole de la souveraineté de la Fédération de Russie et de ses parties.",
  "Что изображено на щите на груди орла?": "Que représente l'écu sur la poitrine de l'aigle ?",
  "Всадник, поражающий копьём дракона": "Un cavalier perçant un dragon de sa lance",
  "Крест": "Une croix",
  "Медведь": "Un ours",
  "Корабль": "Un navire",
  "Это древний московский герб, который связывают с Георгием Победоносцем. Он попал на грудь двуглавого орла при объединении русских земель вокруг Москвы.":
    "Ce sont les armes anciennes de Moscou, qu'on rattache à saint Georges. Elles sont venues sur la poitrine de l'aigle bicéphale lors du rassemblement des terres russes autour de Moscou.",
  "Кто написал слова действующего государственного гимна?":
    "Qui a écrit les paroles de l'hymne d'État en vigueur ?",
  "Александр Пушкин": "Alexandre Pouchkine",
  "Сергей Михалков, и он писал текст к этой мелодии трижды: в 1943, 1977 и 2000 годах. Музыка во всех случаях александровская.":
    "Sergueï Mikhalkov, et il a écrit un texte pour cette mélodie trois fois : en 1943, en 1977 et en 2000. La musique, dans les trois cas, est celle d'Alexandrov.",
  "Какая мелодия была гимном России с 1990 по 2000 год?":
    "Quelle mélodie fut l'hymne de la Russie de 1990 à 2000 ?",
  "Патриотическая песня Глинки": "Le Chant patriotique de Glinka",
  "Гимн Александрова без слов": "L'hymne d'Alexandrov sans paroles",
  "Марш Преображенского полка": "La marche du régiment Préobrajenski",
  "Боже, царя храни": "Dieu protège le tsar",
  "Патриотическая песня Глинки, к которой так и не утвердили текста. Отсутствие слов было одной из причин вернуться в 2000 году к прежней мелодии.":
    "Le Chant patriotique de Glinka, auquel on n'a jamais fini par adopter de texte. Cette absence de paroles fut l'une des raisons du retour, en 2000, à la mélodie d'avant.",
  "Какая статья Конституции называет столицей Москву?":
    "Quel article de la Constitution nomme Moscou capitale ?",
  "Статья 1": "L'article 1",
  "Статья 68": "L'article 68",
  "Статья 70": "L'article 70",
  "Статья 137": "L'article 137",
  "Статья 70. Статья 68 — о государственном языке, а статья 1 определяет форму государства.":
    "L'article 70. L'article 68 porte sur la langue d'État, et l'article 1 définit la forme de l'État.",
  "Что устанавливает статья 68 Конституции?": "Qu'établit l'article 68 de la Constitution ?",
  "Государственный флаг": "Le drapeau d'État",
  "Русский язык как государственный на всей территории":
    "Le russe comme langue d'État sur tout le territoire",
  "Порядок принятия законов": "La procédure d'adoption des lois",
  "Столицу": "La capitale",
  "Русский язык — государственный на всей территории России, при этом республики вправе устанавливать свои государственные языки. Об этом подробнее в главе о языках.":
    "Le russe est langue d'État sur tout le territoire de la Russie, les républiques ayant par ailleurs le droit d'établir leurs propres langues d'État. Le chapitre sur les langues y revient en détail.",
  "Когда отмечается День Государственного флага?":
    "Quand célèbre-t-on la fête du drapeau d'État ?",
  "12 июня": "Le 12 juin",
  "22 августа": "Le 22 août",
  "4 ноября": "Le 4 novembre",
  "12 декабря": "Le 12 décembre",
  "22 августа. Это памятная дата, а не нерабочий праздничный день.":
    "Le 22 août. C'est une date commémorative et non un jour férié chômé.",
  "Какое событие 1990 года лежит в основе Дня России?":
    "Quel événement de 1990 est à l'origine de la fête de la Russie ?",
  "Принятие Конституции": "L'adoption de la Constitution",
  "Принятие Декларации о государственном суверенитете РСФСР":
    "L'adoption de la déclaration de souveraineté de la RSFSR",
  "Распад Советского Союза": "La dislocation de l'Union soviétique",
  "Первые выборы президента": "La première élection présidentielle",
  "Декларация о государственном суверенитете, принятая 12 июня 1990 года. Праздник дважды менял название и стал Днём России только в 2002 году.":
    "La déclaration de souveraineté, adoptée le 12 juin 1990. La fête a changé deux fois de nom et n'est devenue la fête de la Russie qu'en 2002.",
  "В каком году государственный герб получил нынешний вид?":
    "En quelle année les armes de l'État ont-elles pris leur forme actuelle ?",
  "В 1918 году": "En 1918",
  "В 2000 году": "En 2000",
  "В 1993 году. Законы о флаге, гербе и гимне в их действующей редакции приняты позже, в 2000 году.":
    "En 1993. Les lois sur le drapeau, les armes et l'hymne, dans leur rédaction en vigueur, sont plus tardives : elles datent de 2000.",
  "Когда Конституция вступила в силу?": "Quand la Constitution est-elle entrée en vigueur ?",
  "1 января 1994 года": "Le 1er janvier 1994",
  "12 июня 1994 года": "Le 12 juin 1994",
  "Со дня официального опубликования — 25 декабря 1993 года. 12 декабря состоялось всенародное голосование, и именно эту дату отмечают как День Конституции.":
    "Le jour de sa publication officielle, le 25 décembre 1993. Le vote national avait eu lieu le 12 décembre, et c'est cette date que l'on retient comme la fête de la Constitution.",
  "Какую конституцию заменила Конституция 1993 года?":
    "Quelle constitution la Constitution de 1993 a-t-elle remplacée ?",
  "Конституцию СССР 1977 года": "La constitution de l'URSS de 1977",
  "Конституцию РСФСР 1978 года": "La constitution de la RSFSR de 1978",
  "Конституцию 1936 года": "La constitution de 1936",
  "Никакую: это первая конституция России": "Aucune : c'est la première constitution de la Russie",
  "Конституцию РСФСР 1978 года, которую к началу девяностых правили десятки раз. Конституция СССР 1977 года перестала действовать вместе с Союзом.":
    "La constitution de la RSFSR de 1978, qu'on avait corrigée des dizaines de fois au début des années quatre-vingt-dix. La constitution de l'URSS de 1977 a cessé d'être en vigueur avec l'Union.",
  "Сколько глав в первом разделе Конституции?":
    "Combien de chapitres compte la première partie de la Constitution ?",
  "Двенадцать": "Douze",
  "Двадцать": "Vingt",
  "Девять глав и сто тридцать семь статей. Второй раздел короткий и содержит заключительные и переходные положения.":
    "Neuf chapitres et cent trente-sept articles. La seconde partie est brève et contient les dispositions finales et transitoires.",
  "Какие статьи входят в главу о правах и свободах человека?":
    "Quels articles forment le chapitre sur les droits et libertés de la personne ?",
  "С 1 по 16": "De 1 à 16",
  "С 17 по 64": "De 17 à 64",
  "С 65 по 79": "De 65 à 79",
  "С 80 по 93": "De 80 à 93",
  "Статьи 17–64, это самая длинная глава Конституции. Статьи 1–16 — основы конституционного строя, 65–79 — федеративное устройство.":
    "Les articles 17 à 64, le plus long chapitre de la Constitution. Les articles 1 à 16 posent les fondements du régime, les articles 65 à 79 l'organisation fédérale.",
  "Как статья 1 определяет Российскую Федерацию?":
    "Comment l'article 1 définit-il la Fédération de Russie ?",
  "Как демократическое федеративное правовое государство с республиканской формой правления":
    "Comme un État démocratique, fédératif et de droit, à forme républicaine de gouvernement",
  "Как союз суверенных республик": "Comme une union de républiques souveraines",
  "Как унитарное государство": "Comme un État unitaire",
  "Как социалистическое государство рабочих и крестьян":
    "Comme un État socialiste des ouvriers et des paysans",
  "Четыре характеристики в одном предложении, и у каждой есть продолжение в отдельной главе: демократия, федерация, право и республиканская форма правления.":
    "Quatre caractères en une seule phrase, et chacun trouve sa suite dans un chapitre à part : la démocratie, la fédération, le droit et la forme républicaine.",
  "Кого статья 3 называет единственным источником власти?":
    "Qui l'article 3 nomme-t-il seule source du pouvoir ?",
  "Президента": "Le président",
  "Носитель суверенитета и единственный источник власти — многонациональный народ. Слово «многонациональный» стоит и в преамбуле, и это не украшение.":
    "Le porteur de la souveraineté et la seule source du pouvoir est le peuple multinational. Le mot « multinational » figure aussi dans le préambule, et ce n'est pas un ornement.",
  "Что провозглашает статья 2 Конституции?": "Que proclame l'article 2 de la Constitution ?",
  "Разделение властей": "La séparation des pouvoirs",
  "Человека, его права и свободы высшей ценностью":
    "La personne, ses droits et ses libertés comme valeur suprême",
  "Светский характер государства": "Le caractère laïque de l'État",
  "Единство экономического пространства": "L'unité de l'espace économique",
  "Признание, соблюдение и защита прав и свобод объявлены обязанностью государства. Разделение властей — статья 10, светское государство — статья 14.":
    "Reconnaître, respecter et protéger les droits et libertés est déclaré devoir de l'État. La séparation des pouvoirs, c'est l'article 10, et l'État laïque l'article 14.",
  "Что устанавливает статья 13 об идеологии?": "Qu'établit l'article 13 au sujet de l'idéologie ?",
  "Государственной идеологией объявляется патриотизм":
    "Le patriotisme est déclaré idéologie d'État",
  "Никакая идеология не может устанавливаться в качестве государственной или обязательной":
    "Aucune idéologie ne peut être établie comme idéologie d'État ou obligatoire",
  "Идеология определяется федеральным законом": "Une loi fédérale définit l'idéologie",
  "Об идеологии Конституция не говорит": "La Constitution ne parle pas d'idéologie",
  "Статья 13 закрепляет идеологическое и политическое многообразие и многопартийность. Формулировка прямая: никакая идеология не может быть государственной или обязательной.":
    "L'article 13 consacre la diversité idéologique et politique et le pluralisme des partis. La formule est directe : aucune idéologie ne peut être d'État ni obligatoire.",
  "Что означает, что Россия — светское государство?":
    "Que veut dire que la Russie est un État laïque ?",
  "Религия запрещена": "La religion est interdite",
  "Религиозные объединения отделены от государства и равны перед законом":
    "Les associations religieuses sont séparées de l'État et égales devant la loi",
  "Установлена одна государственная религия": "Une religion d'État est établie",
  "Религиозные организации управляют школами": "Les organisations religieuses dirigent les écoles",
  "Статья 14: никакая религия не может устанавливаться в качестве государственной или обязательной, а объединения отделены от государства и равны перед законом.":
    "Article 14 : aucune religion ne peut être établie comme religion d'État ou obligatoire, et les associations sont séparées de l'État et égales devant la loi.",
  "Сколько субъектов федерации должны одобрить поправку к главам с третьей по восьмую?":
    "Combien de sujets de la Fédération doivent approuver un amendement aux chapitres trois à huit ?",
  "Половина": "La moitié",
  "Не менее двух третей": "Deux tiers au moins",
  "Три четверти": "Trois quarts",
  "Все": "Tous",
  "Поправка принимается в порядке федерального конституционного закона и вступает в силу после одобрения органами законодательной власти не менее чем двух третей субъектов.":
    "L'amendement s'adopte selon la procédure de la loi constitutionnelle fédérale et entre en vigueur après l'approbation des organes législatifs des deux tiers au moins des sujets.",
  "Какой орган должен быть созван для пересмотра глав 1, 2 и 9?":
    "Quel organe faut-il convoquer pour réviser les chapitres 1, 2 et 9 ?",
  "Конституционное Собрание": "L'Assemblée constitutionnelle",
  "Конституционное Собрание по статье 135. Его ни разу не созывали, и федерального конституционного закона о нём до сих пор нет.":
    "L'Assemblée constitutionnelle, selon l'article 135. On ne l'a jamais convoquée, et la loi constitutionnelle fédérale qui doit la régir n'existe toujours pas.",
  "В каком году в Конституцию внесли крупный пакет поправок к главам с третьей по восьмую?":
    "En quelle année un large train d'amendements aux chapitres trois à huit a-t-il été introduit dans la Constitution ?",
  "В 2008 году": "En 2008",
  "В 2014 году": "En 2014",
  "В 2020 году": "En 2020",
  "В 2023 году": "En 2023",
  "В 2020 году. До этого поправки касались сроков полномочий в 2008 году и объединения высших судов в 2014-м.":
    "En 2020. Auparavant, les amendements avaient porté sur la durée des mandats en 2008 et sur la fusion des hautes juridictions en 2014.",
  "Является ли 12 декабря нерабочим днём?": "Le 12 décembre est-il un jour chômé ?",
  "Да, это государственный праздник": "Oui, c'est une fête d'État",
  "Нет: с 2005 года это памятная дата, но рабочий день":
    "Non : depuis 2005 c'est une date commémorative, mais un jour ouvré",
  "Да, но только для государственных служащих": "Oui, mais pour les seuls fonctionnaires",
  "Это выходной раз в пять лет": "C'est un jour chômé une fois tous les cinq ans",
  "День Конституции остался памятной датой, но нерабочим быть перестал. Памятная дата и праздничный выходной — разные вещи.":
    "La fête de la Constitution est restée une date commémorative, mais a cessé d'être chômée. Une date commémorative et un jour férié sont deux choses différentes.",
  "С какого момента, по статье 17, человеку принадлежат основные права?":
    "À partir de quel moment, selon l'article 17, les droits fondamentaux appartiennent-ils à la personne ?",
  "С получения паспорта": "À la remise du passeport",
  "От рождения": "Dès la naissance",
  "С восемнадцати лет": "À dix-huit ans",
  "С момента регистрации по месту жительства": "À l'enregistrement au lieu de résidence",
  "Права и свободы принадлежат каждому от рождения и неотчуждаемы. Паспорт и совершеннолетие меняют объём дееспособности, а не сам факт обладания правами.":
    "Les droits et libertés appartiennent à chacun dès la naissance et sont inaliénables. Le passeport et la majorité changent l'étendue de la capacité, non le fait même de détenir des droits.",
  "Чем отличаются статьи, начинающиеся словом «каждый», от статей о гражданах?":
    "En quoi les articles qui commencent par « chacun » diffèrent-ils de ceux qui parlent des citoyens ?",
  "Ничем: это стилистическая разница": "En rien : c'est une différence de style",
  "Права со словом «каждый» принадлежат и иностранцам, а права граждан — только гражданам":
    "Les droits qui disent « chacun » appartiennent aussi aux étrangers, et ceux des citoyens aux seuls citoyens",
  "«Каждый» означает только совершеннолетних": "« Chacun » ne vise que les majeurs",
  "«Каждый» относится к юридическим лицам": "« Chacun » désigne les personnes morales",
  "Это ключ к чтению всей главы. Избирательные права и доступ к государственной службе записаны как права граждан; свобода слова, неприкосновенность жилища и право на защиту — как права каждого.":
    "C'est la clé de lecture de tout le chapitre. Le droit de vote et l'accès à la fonction publique sont écrits comme des droits des citoyens ; la liberté de parole, l'inviolabilité du domicile et le droit à la défense comme des droits de chacun.",
  "Каково фактическое положение смертной казни в России?":
    "Quelle est la situation réelle de la peine de mort en Russie ?",
  "Применяется по приговорам судов": "Elle s'applique sur décision des tribunaux",
  "Действует мораторий, и наказание не применяется":
    "Un moratoire est en vigueur et la peine ne s'applique pas",
  "Полностью исключена из Конституции": "Elle est entièrement absente de la Constitution",
  "Применяется только в военное время": "Elle ne s'applique qu'en temps de guerre",
  "В статье 20 она названа исключительной мерой, но с середины девяностых действует мораторий, подтверждённый решениями Конституционного Суда.":
    "L'article 20 la qualifie de mesure exceptionnelle, mais depuis le milieu des années quatre-vingt-dix un moratoire est en vigueur, confirmé par des décisions de la Cour constitutionnelle.",
  "Что защищает статья 25 Конституции?": "Que protège l'article 25 de la Constitution ?",
  "Тайну переписки": "Le secret de la correspondance",
  "Неприкосновенность жилища": "L'inviolabilité du domicile",
  "Никто не вправе проникать в жилище против воли проживающих иначе как в случаях, установленных законом, или по судебному решению. Тайна переписки — статья 23.":
    "Nul n'a le droit d'entrer dans un domicile contre la volonté de ses occupants, hors les cas prévus par la loi ou sur décision de justice. Le secret de la correspondance, c'est l'article 23.",
  "Что гарантирует статья 26 Конституции?": "Que garantit l'article 26 de la Constitution ?",
  "Право определять и указывать свою национальность и пользоваться родным языком":
    "Le droit de définir et d'indiquer sa nationalité et d'user de sa langue maternelle",
  "Право на двойное гражданство": "Le droit à la double nationalité",
  "Право на альтернативную гражданскую службу": "Le droit au service civil de remplacement",
  "Свободу вероисповедания": "La liberté de culte",
  "И одновременно запрет принуждать к указанию национальности. Для страны, где живут сотни народов, это существенная норма, а не формальность.":
    "Et en même temps l'interdiction de contraindre quelqu'un à indiquer sa nationalité. Pour un pays où vivent des centaines de peuples, c'est une règle de fond et non une formalité.",
  "Что гарантирует статья 28 Конституции?": "Que garantit l'article 28 de la Constitution ?",
  "Свободу совести и вероисповедания": "La liberté de conscience et de culte",
  "Свободу собраний": "La liberté de réunion",
  "Право на труд": "Le droit au travail",
  "В том числе право не исповедовать никакой религии и свободно выбирать, иметь и распространять убеждения. Свобода собраний — статья 31.":
    "Y compris le droit de ne professer aucune religion et de choisir, d'avoir et de répandre librement ses convictions. La liberté de réunion, c'est l'article 31.",
  "Какая статья закрепляет право на жилище?": "Quel article consacre le droit au logement ?",
  "Статья 37": "L'article 37",
  "Статья 40": "L'article 40",
  "Статья 41": "L'article 41",
  "Статья 40: никто не может быть произвольно лишён жилища, а малоимущим оно предоставляется бесплатно или за доступную плату. Статья 41 — о здоровье, 43 — об образовании.":
    "L'article 40 : nul ne peut être arbitrairement privé de son logement, et les plus démunis en reçoivent un gratuitement ou à un prix abordable. L'article 41 porte sur la santé, le 43 sur l'instruction.",
  "Что говорит статья 41 о медицинской помощи?": "Que dit l'article 41 des soins médicaux ?",
  "Она платная для всех": "Ils sont payants pour tous",
  "В государственных и муниципальных учреждениях она оказывается гражданам бесплатно":
    "Dans les établissements d'État et municipaux, ils sont donnés gratuitement aux citoyens",
  "Её объём определяет работодатель": "L'employeur en détermine l'étendue",
  "Она бесплатна только для детей": "Ils ne sont gratuits que pour les enfants",
  "Помощь в государственных и муниципальных учреждениях здравоохранения оказывается бесплатно, за счёт бюджета, страховых взносов и других поступлений.":
    "Les soins dans les établissements de santé d'État et municipaux sont donnés gratuitement, sur le budget, les cotisations d'assurance et d'autres recettes.",
  "Против кого человек не обязан свидетельствовать по статье 51?":
    "Contre qui n'est-on pas tenu de témoigner selon l'article 51 ?",
  "Только против самого себя": "Contre soi-même seulement",
  "Против себя, супруга и близких родственников":
    "Contre soi-même, son conjoint et ses proches parents",
  "Против любого знакомого": "Contre n'importe quelle connaissance",
  "Против работодателя": "Contre son employeur",
  "Круг близких родственников определяется федеральным законом. Это одна из самых известных статей Конституции — её часто цитируют, не открывая текста.":
    "Le cercle des proches parents est fixé par une loi fédérale. C'est l'un des articles les plus connus de la Constitution — on le cite souvent sans ouvrir le texte.",
  "Что означает право на квалифицированную юридическую помощь по статье 48?":
    "Que signifie le droit à une aide juridique qualifiée selon l'article 48 ?",
  "Что помощь всегда платная": "Que l'aide est toujours payante",
  "Что в случаях, предусмотренных законом, она оказывается бесплатно":
    "Que dans les cas prévus par la loi elle est donnée gratuitement",
  "Что защитника назначает следователь": "Que l'enquêteur désigne le défenseur",
  "Что помощь доступна только гражданам": "Que l'aide n'est ouverte qu'aux citoyens",
  "Право гарантировано каждому, а в предусмотренных законом случаях помощь оказывается бесплатно. Задержанный вправе пользоваться помощью защитника с момента задержания.":
    "Le droit est garanti à chacun, et dans les cas prévus par la loi l'aide est gratuite. La personne arrêtée a le droit d'être assistée d'un défenseur dès son arrestation.",
  "В чью пользу толкуются неустранимые сомнения в виновности?":
    "En faveur de qui les doutes irréductibles sur la culpabilité s'interprètent-ils ?",
  "В пользу обвинения": "En faveur de l'accusation",
  "В пользу обвиняемого": "En faveur de l'accusé",
  "В пользу потерпевшего": "En faveur de la victime",
  "Их толкует суд по своему усмотрению": "Le tribunal les interprète à sa guise",
  "Это часть презумпции невиновности в статье 49. Обвиняемый не обязан доказывать свою невиновность, а сомнения работают на него.":
    "Cela fait partie de la présomption d'innocence de l'article 49. L'accusé n'a pas à prouver son innocence, et le doute joue pour lui.",
  "Какие уровни образования статья 43 объявляет общедоступными и бесплатными?":
    "Quels niveaux d'enseignement l'article 43 déclare-t-il ouverts à tous et gratuits ?",
  "Только начальное": "Le primaire seulement",
  "Дошкольное, основное общее и среднее профессиональное":
    "Le préscolaire, le premier cycle général et l'enseignement professionnel secondaire",
  "Только высшее": "Le supérieur seulement",
  "Все уровни без исключения": "Tous les niveaux sans exception",
  "Высшее образование тоже можно получить бесплатно, но на конкурсной основе — это отдельная оговорка той же статьи.":
    "L'enseignement supérieur peut lui aussi être gratuit, mais sur concours — c'est une réserve à part du même article.",
  "Что устанавливает статья 37 о труде?": "Qu'établit l'article 37 au sujet du travail ?",
  "Труд обязателен для всех трудоспособных":
    "Le travail est obligatoire pour tous ceux qui en sont capables",
  "Труд свободен, а принудительный труд запрещён":
    "Le travail est libre et le travail forcé est interdit",
  "Работать можно только по трудовому договору":
    "On ne peut travailler que sous contrat de travail",
  "Продолжительность рабочего дня записана в Конституции":
    "La durée de la journée de travail est inscrite dans la Constitution",
  "Каждый вправе распоряжаться своими способностями к труду и выбирать род деятельности. Конкретная продолжительность рабочей недели установлена не Конституцией, а Трудовым кодексом.":
    "Chacun a le droit de disposer de ses capacités de travail et de choisir son activité. La durée précise de la semaine de travail est fixée non par la Constitution mais par le code du travail.",
  "Какая статья обязывает сохранять природу?": "Quel article oblige à préserver la nature ?",
  "Статья 58. Рядом стоят статья 57 о налогах и статья 59 о защите Отечества: три обязанности подряд, которые легко перепутать.":
    "L'article 58. Voisinent l'article 57 sur les impôts et l'article 59 sur la défense de la patrie : trois devoirs à la suite, faciles à confondre.",
  "Как Конституция называет защиту Отечества?":
    "Comment la Constitution appelle-t-elle la défense de la patrie ?",
  "Правом гражданина": "Un droit du citoyen",
  "Долгом и обязанностью гражданина": "Un devoir et une obligation du citoyen",
  "Обязанностью каждого, кто живёт в стране": "Une obligation de quiconque vit dans le pays",
  "Добровольным делом": "Une affaire de volontariat",
  "Статья 59 использует оба слова сразу. Военная служба несётся по федеральному закону, а при противоречии убеждениям возможна альтернативная гражданская служба.":
    "L'article 59 emploie les deux mots à la fois. Le service militaire se fait selon la loi fédérale, et s'il heurte les convictions un service civil de remplacement est possible.",
  "Кто имеет право на альтернативную гражданскую службу?":
    "Qui a droit au service civil de remplacement ?",
  "Любой призывник по заявлению": "Tout conscrit, sur demande",
  "Тот, чьим убеждениям или вероисповеданию противоречит несение военной службы":
    "Celui dont les convictions ou la religion s'opposent au service militaire",
  "Только студенты": "Les étudiants seulement",
  "Такого права в России нет": "Ce droit n'existe pas en Russie",
  "Право закреплено прямо в статье 59, а порядок определяет федеральный закон. Оно распространяется также на представителей коренных малочисленных народов, ведущих традиционный образ жизни.":
    "Le droit est inscrit directement à l'article 59, et une loi fédérale en fixe les modalités. Il vaut aussi pour les membres des peuples autochtones peu nombreux qui mènent un mode de vie traditionnel.",
  "Что говорит статья 38 об обязанностях в семье?":
    "Que dit l'article 38 des devoirs au sein de la famille ?",
  "Только родители обязаны заботиться о детях":
    "Seuls les parents doivent prendre soin des enfants",
  "Родители заботятся о детях, а трудоспособные взрослые дети — о нетрудоспособных родителях":
    "Les parents prennent soin des enfants, et les enfants adultes valides de leurs parents devenus incapables de travailler",
  "Обязанности в семье устанавливает регион": "La région fixe les devoirs au sein de la famille",
  "Об этом Конституция не говорит": "La Constitution n'en dit rien",
  "Обязанность идёт в обе стороны, и это записано прямо в Конституции, а не только в Семейном кодексе.":
    "Le devoir va dans les deux sens, et cela est écrit dans la Constitution même, non dans le seul code de la famille.",
  "Имеют ли обратную силу законы, ухудшающие положение налогоплательщиков?":
    "Les lois qui aggravent la situation des contribuables sont-elles rétroactives ?",
  "Да, если так решит парламент": "Oui, si le parlement en décide ainsi",
  "Нет: статья 57 это прямо запрещает": "Non : l'article 57 l'interdit expressément",
  "Да, в случае бюджетного дефицита": "Oui, en cas de déficit budgétaire",
  "Вопрос решает суд в каждом случае": "Le tribunal en décide au cas par cas",
  "Прямая оговорка статьи 57. Законы, устанавливающие новые налоги или ухудшающие положение налогоплательщиков, обратной силы не имеют.":
    "C'est une réserve expresse de l'article 57. Les lois qui créent de nouveaux impôts ou aggravent la situation des contribuables n'ont pas d'effet rétroactif.",
  "Какое образование Конституция называет обязательным?":
    "Quel niveau d'instruction la Constitution déclare-t-elle obligatoire ?",
  "Дошкольное": "Le préscolaire",
  "Основное общее": "Le premier cycle général",
  "Среднее профессиональное": "L'enseignement professionnel secondaire",
  "Высшее": "Le supérieur",
  "Основное общее образование обязательно, и обеспечить его получение детьми должны родители или лица, их заменяющие.":
    "Le premier cycle général est obligatoire, et ce sont les parents, ou ceux qui en tiennent lieu, qui doivent en assurer l'accomplissement.",
  "Что означает, что гражданство России едино и равно независимо от оснований приобретения?":
    "Que veut dire que la nationalité russe est une et égale quel qu'en soit le mode d'acquisition ?",
  "Что все граждане имеют одинаковые права независимо от того, получили они гражданство по рождению или были приняты":
    "Que tous les citoyens ont les mêmes droits, qu'ils tiennent la nationalité de leur naissance ou qu'ils y aient été admis",
  "Что гражданство нельзя изменить": "Que l'on ne peut pas changer de nationalité",
  "Что двойное гражданство запрещено": "Que la double nationalité est interdite",
  "Что гражданство даётся только по рождению":
    "Que la nationalité ne se donne que par la naissance",
  "Статья 6. Из неё же следует, что гражданина нельзя лишить гражданства или права его изменить.":
    "L'article 6. Il s'ensuit aussi qu'on ne peut priver un citoyen de sa nationalité ni du droit d'en changer.",
  "В каком году принят действующий федеральный закон о гражданстве?":
    "En quelle année la loi fédérale en vigueur sur la nationalité a-t-elle été adoptée ?",
  "В 2002 году": "En 2002",
  "Закон 2023 года заменил закон 2002 года. Он же перестроил перечень оснований для приёма в упрощённом порядке.":
    "La loi de 2023 a remplacé celle de 2002. C'est elle aussi qui a refait la liste des motifs d'admission par la voie simplifiée.",
  "Какой документ должен иметь заявитель, чтобы начался отсчёт пятилетнего срока проживания?":
    "Quel document faut-il détenir pour que le délai de cinq ans de résidence commence à courir ?",
  "Визу": "Un visa",
  "Разрешение на временное проживание": "Une autorisation de séjour temporaire",
  "Вид на жительство": "Un titre de séjour permanent",
  "Патент на работу": "Un patent de travail",
  "Срок считается со дня получения вида на жительство. Разрешение на временное проживание — предшествующая ступень, а не она.":
    "Le délai se compte du jour où l'on reçoit le titre de séjour permanent. L'autorisation de séjour temporaire est l'échelon d'avant, non celui-là.",
  "Кто может претендовать на приём в гражданство в упрощённом порядке?":
    "Qui peut prétendre à l'admission à la nationalité par la voie simplifiée ?",
  "Любой, кто прожил в стране год": "Quiconque a vécu un an dans le pays",
  "В частности, близкие родственники граждан России, выпускники российских вузов и носители русского языка":
    "Notamment les proches parents de citoyens russes, les diplômés des universités russes et les locuteurs natifs du russe",
  "Только граждане государств СНГ": "Les seuls ressortissants des États de la CEI",
  "Упрощённого порядка не существует": "La voie simplifiée n'existe pas",
  "Перечень категорий установлен законом и время от времени меняется. Общий порядок с пятилетним сроком остаётся правилом, а упрощённый — исключением из него.":
    "La liste des catégories est fixée par la loi et change de temps à autre. La voie ordinaire, avec son délai de cinq ans, reste la règle, et la voie simplifiée l'exception.",
  "Что, кроме срока проживания, требуется для приёма в гражданство?":
    "Que faut-il, outre le délai de résidence, pour être admis à la nationalité ?",
  "Только законный источник средств": "Une source de revenus légale, et rien d'autre",
  "Владение русским языком, знание истории и основ законодательства, законный источник средств":
    "La maîtrise du russe, la connaissance de l'histoire et des bases de la législation, une source de revenus légale",
  "Наличие недвижимости": "Posséder un bien immobilier",
  "Служба в армии": "Avoir servi dans l'armée",
  "Знание языка, истории и основ законодательства подтверждается экзаменом. Именно его форму — тридцать шесть заданий за девяносто минут — берёт тренировочный тест этого курса.":
    "La connaissance de la langue, de l'histoire et des bases de la législation s'atteste par un examen. C'est sa forme même — trente-six questions en quatre-vingt-dix minutes — que reprend le test d'entraînement de ce cours.",
  "С какого года принятые в гражданство приносят присягу?":
    "Depuis quelle année ceux qui sont admis à la nationalité prêtent-ils serment ?",
  "С 1993 года": "Depuis 1993",
  "С 2002 года": "Depuis 2002",
  "С 2017 года": "Depuis 2017",
  "С 2023 года": "Depuis 2023",
  "Присяга гражданина Российской Федерации введена в 2017 году и приносится после принятия решения о приёме в гражданство.":
    "Le serment du citoyen de la Fédération de Russie a été instauré en 2017 et se prête après la décision d'admission à la nationalité.",
  "С какого возраста гражданин России получает паспорт?":
    "À partir de quel âge un citoyen russe reçoit-il un passeport ?",
  "С 10 лет": "À 10 ans",
  "С 14 лет": "À 14 ans",
  "С 16 лет": "À 16 ans",
  "Паспорт выдаётся в 14 лет, а совершеннолетие с правом голоса и полной дееспособностью наступает в 18.":
    "Le passeport se délivre à 14 ans, et la majorité, avec le droit de vote et la pleine capacité, vient à 18.",
  "Какая статья Трудового кодекса перечисляет нерабочие праздничные дни?":
    "Quel article du code du travail énumère les jours fériés chômés ?",
  "Статья 91": "L'article 91",
  "Статья 112": "L'article 112",
  "Статья 115": "L'article 115",
  "Статья 128": "L'article 128",
  "Статья 112. Статья 115 — о продолжительности ежегодного отпуска, статья 91 — о рабочем времени.":
    "L'article 112. L'article 115 porte sur la durée du congé annuel, l'article 91 sur le temps de travail.",
  "Какого числа отмечается Рождество Христово?": "Quel jour fête-t-on la Nativité ?",
  "25 декабря": "Le 25 décembre",
  "31 декабря": "Le 31 décembre",
  "7 января": "Le 7 janvier",
  "14 января": "Le 14 janvier",
  "7 января, потому что церковный календарь остался юлианским. По той же причине 14 января отмечают старый Новый год.":
    "Le 7 janvier, parce que le calendrier de l'Église est resté julien. Pour la même raison, on fête le 14 janvier l'ancien Nouvel An.",
  "Что отмечают 23 февраля?": "Que fête-t-on le 23 février ?",
  "День защитника Отечества": "La journée du défenseur de la patrie",
  "Праздник ведёт начало от 1918 года. Сегодня поздравляют не только военных, и по массовости он стоит рядом с 8 марта.":
    "La fête remonte à 1918. On y félicite aujourd'hui bien d'autres que les militaires, et par son ampleur elle voisine avec le 8 mars.",
  "С какого года 8 марта стало в стране нерабочим днём?":
    "Depuis quelle année le 8 mars est-il chômé dans le pays ?",
  "С 1918 года": "Depuis 1918",
  "С 1966 года": "Depuis 1966",
  "С 1966 года. Сам праздник отмечался задолго до этого, но выходным сделался только тогда.":
    "Depuis 1966. La fête se célébrait bien avant, mais elle n'est devenue chômée qu'alors.",
  "Как назывался праздник 1 мая до 1992 года?":
    "Comment s'appelait la fête du 1er mai avant 1992 ?",
  "Праздник Весны и Труда": "La fête du Printemps et du Travail",
  "День международной солидарности трудящихся":
    "La journée de la solidarité internationale des travailleurs",
  "День трудовой славы": "La journée de la gloire du travail",
  "День рабочего класса": "La journée de la classe ouvrière",
  "Название сменилось в 1992 году на Праздник Весны и Труда. Сам выходной сохранился.":
    "Le nom a changé en 1992 pour devenir la fête du Printemps et du Travail. Le jour chômé, lui, est resté.",
  "Что происходит в Москве 9 мая?": "Que se passe-t-il à Moscou le 9 mai ?",
  "Парад на Красной площади и шествие «Бессмертного полка»":
    "Un défilé sur la place Rouge et la marche du « Régiment immortel »",
  "Выборы в Государственную Думу": "Les élections à la Douma d'État",
  "Открытие учебного года": "L'ouverture de l'année scolaire",
  "Ежегодное послание парламенту": "Le message annuel au parlement",
  "День Победы — с парадом, минутой молчания и шествием «Бессмертного полка», которое за последние годы стало частью дня по всей стране.":
    "La fête de la Victoire — avec le défilé, la minute de silence et la marche du « Régiment immortel », devenue ces dernières années une part de la journée dans tout le pays.",
  "Какой праздник 4 ноября заменил в календаре?":
    "Quelle fête le 4 novembre a-t-il remplacée au calendrier ?",
  "7 ноября, годовщину Октябрьской революции":
    "Le 7 novembre, anniversaire de la révolution d'Octobre",
  "12 декабря, День Конституции": "Le 12 décembre, la fête de la Constitution",
  "День народного единства введён в 2005 году вместо годовщины революции. Он посвящён освобождению Москвы ополчением Минина и Пожарского в 1612 году.":
    "La journée de l'unité du peuple a été instaurée en 2005 à la place de l'anniversaire de la révolution. Elle est consacrée à la libération de Moscou par la milice de Minine et Pojarski en 1612.",
  "Каким событиям посвящён День народного единства?":
    "À quels événements la journée de l'unité du peuple est-elle consacrée ?",
  "Событиям 1612 года": "À ceux de 1612",
  "Событиям 1812 года": "À ceux de 1812",
  "Событиям 1917 года": "À ceux de 1917",
  "Событиям 1991 года": "À ceux de 1991",
  "Освобождению Москвы от польско-литовского гарнизона ополчением Минина и Пожарского, что положило конец Смутному времени.":
    "À la libération de Moscou de sa garnison polono-lituanienne par la milice de Minine et Pojarski, qui mit fin au Temps des troubles.",
  "Что отмечают 12 апреля?": "Que célèbre-t-on le 12 avril ?",
  "День знаний": "La journée du savoir",
  "День космонавтики": "La journée de la conquête spatiale",
  "День памяти и скорби": "La journée de mémoire et de deuil",
  "День флага": "La journée du drapeau",
  "День космонавтики, в память о полёте Гагарина в 1961 году. Это памятная дата, а не выходной.":
    "La journée de la conquête spatiale, en mémoire du vol de Gagarine en 1961. C'est une date commémorative et non un jour chômé.",
  "Что происходит 1 сентября?": "Que se passe-t-il le 1er septembre ?",
  "День знаний: линейки, первый звонок и цветы учителям":
    "La journée du savoir : rassemblements, première sonnerie et fleurs aux enseignants",
  "День города в Москве": "La fête de la ville à Moscou",
  "Начало финансового года": "Le début de l'exercice budgétaire",
  "День работника образования": "La journée des personnels de l'enseignement",
  "День знаний. Он рабочий, но школы начинают год торжественной линейкой, а первоклассники дают первый звонок.":
    "La journée du savoir. C'est un jour ouvré, mais les écoles ouvrent l'année par un rassemblement solennel, et les élèves de première année font retentir la première sonnerie.",
  "Чему посвящено 22 июня?": "À quoi le 22 juin est-il consacré ?",
  "Дню Победы": "À la fête de la Victoire",
  "Дню памяти и скорби, годовщине начала войны в 1941 году":
    "À la journée de mémoire et de deuil, anniversaire du début de la guerre en 1941",
  "Дню России": "À la fête de la Russie",
  "Дню защитника Отечества": "À la journée du défenseur de la patrie",
  "В этот день в 1941 году началась война. Флаги приспускают, а ночью проводят акцию «Свеча памяти».":
    "C'est ce jour-là qu'en 1941 la guerre a commencé. On met les drapeaux en berne et, la nuit, on tient la veillée dite « Bougie du souvenir ».",
  "Что такое Масленица?": "Qu'est-ce que la Maslenitsa ?",
  "Неделя перед Великим постом, с блинами и сожжением чучела зимы":
    "La semaine qui précède le grand carême, avec ses crêpes et le mannequin de l'hiver que l'on brûle",
  "Праздник урожая осенью": "Une fête des moissons, en automne",
  "Название новогодних каникул": "Le nom des vacances du Nouvel An",
  "Ярмарка в честь Дня города": "Une foire donnée pour la fête de la ville",
  "Народный праздник проводов зимы, привязанный к церковному календарю: его дата зависит от даты Пасхи и потому подвижна.":
    "Une fête populaire d'adieu à l'hiver, accrochée au calendrier de l'Église : sa date dépend de celle de Pâques et se déplace donc.",
  "Какова была разница между юлианским и григорианским календарями при переходе 1918 года?":
    "Quel était l'écart entre le calendrier julien et le grégorien lors du passage de 1918 ?",
  "Семь дней": "Sept jours",
  "Десять дней": "Dix jours",
  "Тринадцать дней": "Treize jours",
  "Тридцать дней": "Trente jours",
  "Тринадцать дней. Отсюда и Рождество 7 января, и старый Новый год 14 января: обе даты — прежние числа, пересчитанные на новый календарь.":
    "Treize jours. De là viennent la Nativité du 7 janvier et l'ancien Nouvel An du 14 : les deux dates sont les anciennes, recalculées sur le nouveau calendrier.",
  "Как статья 80 называет Президента?": "Comment l'article 80 nomme-t-il le président ?",
  "Главой исполнительной власти": "Chef du pouvoir exécutif",
  "Главой государства": "Chef de l'État",
  "Председателем Правительства": "Président du gouvernement",
  "Главой парламента": "Chef du parlement",
  "Глава государства и гарант Конституции. Он не отнесён ни к одной из трёх ветвей власти, а стоит над разделением, установленным статьёй 10.":
    "Chef de l'État et garant de la Constitution. Il n'est rattaché à aucun des trois pouvoirs et se tient au-dessus de la séparation qu'établit l'article 10.",
  "Каким был срок полномочий Президента до поправки 2008 года?":
    "Quelle était la durée du mandat présidentiel avant l'amendement de 2008 ?",
  "Семь лет": "Sept ans",
  "Четыре года. Той же поправкой срок полномочий Государственной Думы увеличили с четырёх лет до пяти.":
    "Quatre ans. Le même amendement a porté le mandat de la Douma d'État de quatre à cinq ans.",
  "Сколько лет кандидат в Президенты должен постоянно проживать в России?":
    "Combien d'années un candidat à la présidence doit-il avoir résidé en Russie de façon permanente ?",
  "Десять": "Dix",
  "Двадцать пять": "Vingt-cinq",
  "Такого требования нет": "Cette condition n'existe pas",
  "Двадцать пять лет — требование, добавленное поправками 2020 года. Тогда же появился запрет на иностранное гражданство и вид на жительство, в том числе в прошлом.":
    "Vingt-cinq ans — une condition ajoutée par les amendements de 2020. C'est alors aussi qu'est apparue l'interdiction d'une nationalité ou d'un titre de séjour étrangers, y compris dans le passé.",
  "Какое слово убрали из ограничения на сроки поправками 2020 года?":
    "Quel mot les amendements de 2020 ont-ils retiré de la limitation des mandats ?",
  "Слово «двух»": "Le mot « deux »",
  "Слово «подряд»": "Le mot « consécutifs »",
  "Слово «шесть»": "Le mot « six »",
  "Ничего не убирали": "On n'a rien retiré",
  "Прежде в тексте стояло «двух сроков подряд». После поправки осталось ограничение двумя сроками без этой оговорки.":
    "Le texte disait auparavant « deux mandats consécutifs ». Après l'amendement, il reste la limite de deux mandats sans cette réserve.",
  "Кого Президент назначает после утверждения кандидатуры Государственной Думой?":
    "Qui le président nomme-t-il après que la Douma d'État a approuvé la candidature ?",
  "Председателя Правительства": "Le président du gouvernement",
  "Генерального прокурора": "Le procureur général",
  "Председателя Конституционного Суда": "Le président de la Cour constitutionnelle",
  "Председателя Центрального банка": "Le président de la Banque centrale",
  "Председателя Правительства. Генерального прокурора и судей высших судов назначает Совет Федерации по представлению Президента, а Председателя Центрального банка — Дума.":
    "Le président du gouvernement. Le procureur général et les juges des hautes cours sont nommés par le Conseil de la Fédération sur proposition du président, et le président de la Banque centrale par la Douma.",
  "Кто является Верховным Главнокомандующим Вооружёнными Силами?":
    "Qui est le chef suprême des forces armées ?",
  "Министр обороны": "Le ministre de la Défense",
  "Начальник Генерального штаба": "Le chef de l'état-major général",
  "Президент, по статье 87. Он же вводит военное положение — с последующим утверждением Советом Федерации.":
    "Le président, selon l'article 87. C'est lui aussi qui proclame la loi martiale, sous réserve d'approbation ensuite par le Conseil de la Fédération.",
  "Какой орган утверждает указ Президента о введении военного положения?":
    "Quel organe approuve le décret présidentiel proclamant la loi martiale ?",
  "Совет Федерации. То же касается чрезвычайного положения: указ издаёт Президент, а утверждает верхняя палата.":
    "Le Conseil de la Fédération. Il en va de même de l'état d'urgence : le président prend le décret et la chambre haute l'approuve.",
  "Какое право Президента позволяет ему не подписать принятый закон?":
    "Quel droit permet au président de ne pas signer une loi adoptée ?",
  "Право роспуска": "Le droit de dissolution",
  "Право вето": "Le droit de veto",
  "Право помилования": "Le droit de grâce",
  "Право законодательной инициативы": "Le droit d'initiative des lois",
  "Вето. Оно преодолевается повторным принятием закона двумя третями голосов в обеих палатах, после чего Президент обязан подписать.":
    "Le veto. On le surmonte en adoptant de nouveau la loi aux deux tiers des voix dans les deux chambres, après quoi le président est tenu de signer.",
  "Что из перечисленного относится к полномочиям Президента?":
    "Lequel de ces pouvoirs appartient au président ?",
  "Помилование": "La grâce",
  "Амнистия": "L'amnistie",
  "Утверждение бюджета": "L'adoption du budget",
  "Установление местных налогов": "L'établissement des impôts locaux",
  "Помилование — акт в отношении конкретного осуждённого. Амнистию объявляет Государственная Дума, а бюджет утверждает парламент по представлению Правительства.":
    "La grâce est un acte visant un condamné précis. L'amnistie est proclamée par la Douma d'État, et le budget adopté par le parlement sur présentation du gouvernement.",
  "Какая палата выдвигает обвинение при отрешении Президента от должности?":
    "Quelle chambre met en accusation lors de la destitution du président ?",
  "Государственная Дума двумя третями голосов": "La Douma d'État, aux deux tiers des voix",
  "Совет Федерации простым большинством": "Le Conseil de la Fédération, à la majorité simple",
  "Обе палаты совместно": "Les deux chambres ensemble",
  "Дума выдвигает обвинение, суды дают заключения, а решение принимает Совет Федерации двумя третями. Процедура ни разу не была доведена до конца.":
    "La Douma met en accusation, les cours rendent leurs avis, et la décision revient au Conseil de la Fédération aux deux tiers. La procédure n'a jamais été menée à son terme.",
  "В какой срок должно быть принято решение об отрешении Президента?":
    "Dans quel délai la décision de destitution du président doit-elle être prise ?",
  "В месячный": "En un mois",
  "В трёхмесячный": "En trois mois",
  "В шестимесячный": "En six mois",
  "Три месяца с момента выдвижения обвинения. Если Совет Федерации не уложится в срок, обвинение считается отклонённым.":
    "Trois mois à compter de la mise en accusation. Si le Conseil de la Fédération n'y parvient pas dans ce délai, l'accusation est tenue pour rejetée.",
  "Где находится официальная резиденция Президента?":
    "Où se trouve la résidence officielle du président ?",
  "В Доме Правительства": "À la Maison du gouvernement",
  "В Московском Кремле": "Au Kremlin de Moscou",
  "На Охотном Ряду": "Sur l'Okhotny Riad",
  "На Большой Дмитровке": "Sur la Bolchaïa Dmitrovka",
  "Московский Кремль. Дом Правительства занимает Председатель Правительства, а Охотный Ряд и Большая Дмитровка — это Дума и Совет Федерации.":
    "Le Kremlin de Moscou. La Maison du gouvernement est occupée par le président du gouvernement, et l'Okhotny Riad et la Bolchaïa Dmitrovka sont la Douma et le Conseil de la Fédération.",
  "Что Президент приносит при вступлении в должность?":
    "Que prête le président en entrant en fonction ?",
  "Присягу народу": "Un serment au peuple",
  "Отчёт парламенту": "Un rapport au parlement",
  "Клятву на Конституции перед судом": "Un serment sur la Constitution devant la cour",
  "Ничего не требуется": "Rien n'est exigé",
  "Присягу, текст которой записан в статье 82. С этого момента он приступает к исполнению полномочий.":
    "Un serment, dont le texte figure à l'article 82. C'est à partir de ce moment qu'il entre dans l'exercice de ses fonctions.",
  "Как называется верхняя палата российского парламента?":
    "Comment s'appelle la chambre haute du parlement russe ?",
  "Верховный Совет": "Le Soviet suprême",
  "Сенат республик": "Le Sénat des républiques",
  "Совет Федерации — палата регионов. Государственная Дума нижняя, и именно в неё вносятся законопроекты.":
    "Le Conseil de la Fédération, la chambre des régions. La Douma d'État est la chambre basse, et c'est elle qui reçoit les projets de loi.",
  "На какой срок избирается Государственная Дума?":
    "Pour combien de temps la Douma d'État est-elle élue ?",
  "Пять лет — с поправки 2008 года; прежде было четыре. Президент избирается на шесть лет: эти две цифры легко перепутать.":
    "Cinq ans, depuis l'amendement de 2008 ; c'était quatre auparavant. Le président est élu pour six ans : ces deux chiffres se confondent aisément.",
  "Сколько депутатов Думы избирается по одномандатным округам?":
    "Combien de députés de la Douma sont élus dans des circonscriptions à un siège ?",
  "Сто": "Cent",
  "Все четыреста пятьдесят": "Les quatre cent cinquante",
  "Половина, то есть 225. Другая половина проходит по партийным спискам в едином федеральном округе. Система называется смешанной.":
    "La moitié, soit 225. L'autre moitié passe sur des listes de partis dans une circonscription fédérale unique. On appelle ce système mixte.",
  "Сколько сенаторов вправе назначить Президент по поправкам 2020 года?":
    "Combien de sénateurs le président peut-il nommer selon les amendements de 2020 ?",
  "Не более десяти": "Dix au plus",
  "Не более тридцати": "Trente au plus",
  "Не более пятидесяти": "Cinquante au plus",
  "Ни одного": "Aucun",
  "Не более тридцати. К ним добавляются по два представителя от каждого субъекта и бывшие президенты, которые могут стать пожизненными сенаторами.":
    "Trente au plus. S'y ajoutent deux représentants de chaque sujet et les anciens présidents, qui peuvent devenir sénateurs à vie.",
  "Почему Совет Федерации нельзя распустить?":
    "Pourquoi ne peut-on pas dissoudre le Conseil de la Fédération ?",
  "Так решил Конституционный Суд": "Parce que la Cour constitutionnelle en a décidé ainsi",
  "Он не избирается целиком: его состав меняется постепенно, вслед за выборами в регионах":
    "Parce qu'il n'est pas élu en bloc : sa composition change peu à peu, au fil des élections dans les régions",
  "Его защищает международный договор": "Parce qu'un traité international le protège",
  "Его можно распустить, но только с согласия Думы":
    "On peut le dissoudre, mais seulement avec l'accord de la Douma",
  "У палаты нет единого срока полномочий, поэтому она работает непрерывно. Роспуск предусмотрен только для Государственной Думы, и лишь в двух случаях.":
    "La chambre n'a pas de mandat commun et travaille donc sans interruption. La dissolution n'est prévue que pour la Douma d'État, et dans deux cas seulement.",
  "С какого возраста можно стать сенатором Российской Федерации?":
    "À partir de quel âge peut-on devenir sénateur de la Fédération de Russie ?",
  "С 25 лет": "À 25 ans",
  "С тридцати лет. Двадцать один — для депутата Думы, тридцать пять — для Президента.":
    "À trente ans. Vingt et un pour un député de la Douma, trente-cinq pour le président.",
  "Сколько времени есть у Совета Федерации на рассмотрение принятого Думой закона?":
    "De combien de temps le Conseil de la Fédération dispose-t-il pour examiner une loi adoptée par la Douma ?",
  "Пять дней": "Cinq jours",
  "Четырнадцать дней": "Quatorze jours",
  "Срок не ограничен": "Le délai n'est pas borné",
  "Четырнадцать дней. Пять дней — срок, в который Дума передаёт закон в верхнюю палату, а четырнадцать дней есть и у Президента на подписание.":
    "Quatorze jours. Cinq jours est le délai dans lequel la Douma transmet la loi à la chambre haute, et le président dispose lui aussi de quatorze jours pour signer.",
  "Какой большинство нужно Думе, чтобы принять федеральный конституционный закон?":
    "Quelle majorité faut-il à la Douma pour adopter une loi constitutionnelle fédérale ?",
  "Простое большинство": "La majorité simple",
  "Абсолютное большинство": "La majorité absolue",
  "Две трети голосов депутатов, а в Совете Федерации — три четверти. Обычный федеральный закон принимается простым большинством.":
    "Les deux tiers des voix des députés, et les trois quarts au Conseil de la Fédération. Une loi fédérale ordinaire s'adopte à la majorité simple.",
  "Как преодолевается вето Президента?": "Comment surmonte-t-on le veto du président ?",
  "Повторным голосованием только в Думе": "Par un second vote à la seule Douma",
  "Двумя третями голосов в обеих палатах": "Aux deux tiers des voix dans les deux chambres",
  "Решением Конституционного Суда": "Par une décision de la Cour constitutionnelle",
  "Вето преодолеть нельзя": "Le veto ne peut pas être surmonté",
  "Обе палаты должны повторно принять закон в прежней редакции двумя третями голосов, после чего Президент обязан его подписать в течение семи дней.":
    "Les deux chambres doivent adopter de nouveau la loi dans sa rédaction première aux deux tiers des voix, après quoi le président est tenu de la signer dans les sept jours.",
  "Какие законы Совет Федерации обязан рассмотреть непременно?":
    "Quelles lois le Conseil de la Fédération est-il tenu d'examiner sans faute ?",
  "Все без исключения": "Toutes sans exception",
  "О бюджете, налогах, ратификации договоров, границе, войне и мире":
    "Celles sur le budget, les impôts, la ratification des traités, la frontière, la guerre et la paix",
  "Только уголовные": "Les seules lois pénales",
  "Только те, что внёс Президент": "Les seules lois déposées par le président",
  "Перечень в статье 106. Остальные законы, не рассмотренные в четырнадцатидневный срок, считаются одобренными молчанием.":
    "La liste est à l'article 106. Les autres lois, non examinées dans le délai de quatorze jours, sont tenues pour approuvées par le silence.",
  "Кто объявляет амнистию?": "Qui proclame l'amnistie ?",
  "Государственная Дума. Помилование в отношении конкретного человека — полномочие Президента: два разных акта и два разных органа.":
    "La Douma d'État. La grâce visant une personne précise est un pouvoir du président : deux actes différents et deux organes différents.",
  "Кто назначает выборы Президента Российской Федерации?":
    "Qui convoque l'élection du président de la Fédération de Russie ?",
  "Центральная избирательная комиссия": "La commission électorale centrale",
  "Совет Федерации. А выборы Государственной Думы, наоборот, назначает Президент: полномочия здесь намеренно перекрещены.":
    "Le Conseil de la Fédération. Et les élections à la Douma d'État sont au contraire convoquées par le président : les pouvoirs se croisent ici à dessein.",
  "В каких случаях палаты Федерального Собрания собираются совместно?":
    "Dans quels cas les chambres de l'Assemblée fédérale se réunissent-elles ensemble ?",
  "Каждую неделю": "Chaque semaine",
  "Для посланий Президента и выступлений глав иностранных государств":
    "Pour les messages du président et les discours de chefs d'État étrangers",
  "Для принятия любого закона": "Pour adopter n'importe quelle loi",
  "Никогда": "Jamais",
  "По общему правилу палаты заседают раздельно. Совместные заседания — исключение, названное в статье 100.":
    "En règle générale, les chambres siègent séparément. Les séances communes sont l'exception que nomme l'article 100.",
  "Кто входит в состав Правительства?": "Qui compose le gouvernement ?",
  "Председатель, его заместители и федеральные министры":
    "Le président, ses adjoints et les ministres fédéraux",
  "Президент и министры": "Le président de la Fédération et les ministres",
  "Депутаты правящей партии": "Les députés du parti au pouvoir",
  "Главы субъектов Федерации": "Les chefs des sujets de la Fédération",
  "Состав определён статьёй 110. Президент в Правительство не входит: он глава государства, а не глава правительства.":
    "La composition est fixée à l'article 110. Le président de la Fédération n'entre pas dans le gouvernement : il est chef de l'État, non chef du gouvernement.",
  "Какую власть осуществляет Правительство?": "Quel pouvoir le gouvernement exerce-t-il ?",
  "Законодательную": "Le législatif",
  "Исполнительную": "L'exécutif",
  "Судебную": "Le judiciaire",
  "Учредительную": "Le constituant",
  "Исполнительную. Законодательную осуществляет Федеральное Собрание, судебную — суды: разделение закреплено статьёй 10.":
    "L'exécutif. Le législatif est exercé par l'Assemblée fédérale, le judiciaire par les cours : la séparation est inscrite à l'article 10.",
  "Как изменилась роль Думы при назначении Председателя Правительства после 2020 года?":
    "Comment le rôle de la Douma dans la nomination du chef du gouvernement a-t-il changé après 2020 ?",
  "Она перестала участвовать": "Elle n'y prend plus part",
  "Вместо «согласия» Дума теперь «утверждает» кандидатуру":
    "Au lieu de donner son « accord », la Douma « approuve » désormais la candidature",
  "Она получила право сама выдвигать кандидата":
    "Elle a reçu le droit d'avancer elle-même un candidat",
  "Ничего не изменилось": "Rien n'a changé",
  "Формулировка стала жёстче: Президент назначает Председателя после утверждения Думой. Право трижды отклонить кандидатуру, с последующим роспуском, при этом сохранилось.":
    "La formule s'est durcie : le président nomme le chef du gouvernement après approbation par la Douma. Le droit de rejeter trois fois la candidature, suivi de la dissolution, est resté.",
  "Кого из министров Дума НЕ утверждает?":
    "Lequel de ces ministres la Douma n'approuve-t-elle PAS ?",
  "Министра финансов": "Le ministre des Finances",
  "Министра обороны": "Le ministre de la Défense",
  "Министра просвещения": "Le ministre de l'Instruction",
  "Министра транспорта": "Le ministre des Transports",
  "Руководителей силового блока — обороны, внутренних дел, иностранных дел, юстиции, спецслужб — назначает Президент после консультаций с Советом Федерации.":
    "Les chefs du bloc régalien — défense, intérieur, affaires étrangères, justice, services spéciaux — sont nommés par le président après consultation du Conseil de la Fédération.",
  "Кто разрабатывает и представляет федеральный бюджет?":
    "Qui élabore et présente le budget fédéral ?",
  "Центральный банк": "La Banque centrale",
  "Счётная палата": "La Chambre des comptes",
  "Правительство разрабатывает и вносит бюджет, а утверждает его парламент законом. Счётная палата проверяет исполнение.":
    "Le gouvernement élabore et dépose le budget, et le parlement l'adopte par une loi. La Chambre des comptes en vérifie l'exécution.",
  "Что происходит, если Дума повторно выразит недоверие Правительству в течение трёх месяцев?":
    "Que se passe-t-il si la Douma vote une seconde fois la défiance au gouvernement en trois mois ?",
  "Правительство обязано уйти в отставку": "Le gouvernement est tenu de démissionner",
  "Президент объявляет об отставке Правительства либо распускает Думу":
    "Le président prononce la démission du gouvernement ou dissout la Douma",
  "Вопрос передаётся в Совет Федерации": "La question passe au Conseil de la Fédération",
  "Недоверие не влечёт последствий": "La défiance n'entraîne rien",
  "Выбор остаётся за Президентом, и это второе из двух конституционных оснований роспуска Думы. Первое — трёхкратное отклонение кандидатуры Председателя.":
    "Le choix revient au président, et c'est le second des deux motifs constitutionnels de dissolution de la Douma. Le premier est le triple rejet du candidat à la tête du gouvernement.",
  "Может ли Правительство само поставить перед Думой вопрос о доверии?":
    "Le gouvernement peut-il poser lui-même à la Douma la question de confiance ?",
  "Да": "Oui",
  "Нет": "Non",
  "Только с согласия Президента": "Seulement avec l'accord du président",
  "Только раз в год": "Une fois par an seulement",
  "Может, и это зеркальная процедура к недоверию. При отказе в доверии Президент в течение семи дней принимает решение об отставке Правительства или о роспуске Думы.":
    "Il le peut, et c'est la procédure symétrique de la défiance. Si la confiance est refusée, le président décide dans les sept jours de la démission du gouvernement ou de la dissolution de la Douma.",
  "Кто вправе отменить постановление Правительства?":
    "Qui a le droit d'annuler un arrêté du gouvernement ?",
  "Президент, если оно противоречит Конституции, законам или его указам":
    "Le président, s'il contredit la Constitution, les lois ou ses propres décrets",
  "Никто": "Personne",
  "Это одна из связок между Президентом и исполнительной властью. Постановления обязательны на всей территории, но стоят ниже Конституции, законов и указов.":
    "C'est l'une des attaches entre le président et le pouvoir exécutif. Les arrêtés s'imposent sur tout le territoire, mais se placent au-dessous de la Constitution, des lois et des décrets.",
  "Как в обиходе называют Дом Правительства в Москве?":
    "Comment appelle-t-on couramment la Maison du gouvernement à Moscou ?",
  "Белый дом": "La Maison blanche",
  "Серый дом": "La Maison grise",
  "Красный дом": "La Maison rouge",
  "Дом Советов": "La Maison des soviets",
  "Белый дом, по цвету здания на Краснопресненской набережной. Кремль — резиденция Президента, а не Правительства.":
    "La Maison blanche, du fait de la couleur du bâtiment sur le quai de la Krasnaïa Presnia. Le Kremlin est la résidence du président, non celle du gouvernement.",
  "Какая из этих сфер названа в статье 114 среди задач Правительства?":
    "Lequel de ces domaines l'article 114 nomme-t-il parmi les tâches du gouvernement ?",
  "Толкование Конституции": "L'interprétation de la Constitution",
  "Единая политика в области культуры, науки, образования и здравоохранения":
    "Une politique unique en matière de culture, de science, d'instruction et de santé",
  "Назначение судей": "La nomination des juges",
  "Объявление амнистии": "La proclamation de l'amnistie",
  "Толкует Конституцию Конституционный Суд, судей назначает Совет Федерации, амнистию объявляет Дума. Правительство отвечает за исполнение и за отраслевую политику.":
    "La Constitution est interprétée par la Cour constitutionnelle, les juges sont nommés par le Conseil de la Fédération, l'amnistie proclamée par la Douma. Le gouvernement, lui, répond de l'exécution et de la politique sectorielle.",
  "Применялась ли когда-нибудь норма о роспуске Думы после трёхкратного отклонения кандидатуры премьера?":
    "La règle de dissolution de la Douma après le triple rejet du candidat au poste de chef du gouvernement a-t-elle jamais été appliquée ?",
  "Да, дважды": "Oui, deux fois",
  "Нет, ни разу": "Non, jamais",
  "Да, в 1998 году": "Oui, en 1998",
  "Она была отменена в 2020 году": "Elle a été supprimée en 2020",
  "Ни разу. В 1998 году дело дошло до третьего голосования, но кандидатура была утверждена. Норма работает самим фактом своего существования.":
    "Jamais. En 1998, on est allé jusqu'au troisième vote, mais la candidature a été approuvée. La règle agit par le seul fait d'exister.",
  "Влечёт ли избрание новой Государственной Думы отставку Правительства?":
    "L'élection d'une nouvelle Douma d'État entraîne-t-elle la démission du gouvernement ?",
  "Да, автоматически": "Oui, automatiquement",
  "Нет: Правительство слагает полномочия перед вновь избранным Президентом":
    "Non : le gouvernement remet ses pouvoirs devant le président nouvellement élu",
  "Да, если сменилось большинство": "Oui, si la majorité a changé",
  "Решает Совет Федерации": "Le Conseil de la Fédération en décide",
  "Полномочия слагаются перед Президентом, а не перед Думой. Смена состава нижней палаты сама по себе судьбу Правительства не решает.":
    "Les pouvoirs se remettent devant le président, non devant la Douma. Le renouvellement de la chambre basse ne décide pas à lui seul du sort du gouvernement.",
  "Где находится Дом Правительства?": "Où se trouve la Maison du gouvernement ?",
  "На Краснопресненской набережной": "Sur le quai de la Krasnaïa Presnia",
  "В Кремле": "Au Kremlin",
  "На Краснопресненской набережной. Охотный Ряд — Государственная Дума, Большая Дмитровка — Совет Федерации, Кремль — Президент.":
    "Sur le quai de la Krasnaïa Presnia. L'Okhotny Riad, c'est la Douma d'État, la Bolchaïa Dmitrovka le Conseil de la Fédération, le Kremlin le président.",
  "Что прямо запрещает статья 118 Конституции?":
    "Qu'interdit expressément l'article 118 de la Constitution ?",
  "Суд присяжных": "Le jury populaire",
  "Создание чрезвычайных судов": "La création de tribunaux d'exception",
  "Апелляцию по уголовным делам": "L'appel en matière pénale",
  "Участие граждан в правосудии": "La participation des citoyens à la justice",
  "Чрезвычайные суды не допускаются. Суд присяжных, наоборот, прямо предусмотрен Конституцией как форма участия граждан в правосудии.":
    "Les tribunaux d'exception ne sont pas admis. Le jury populaire, au contraire, est expressément prévu par la Constitution comme une forme de participation des citoyens à la justice.",
  "Каким трём требованиям должен отвечать судья?":
    "À quelles trois conditions un juge doit-il répondre ?",
  "Возраст 25 лет, высшее юридическое образование, стаж пять лет":
    "Vingt-cinq ans, des études supérieures de droit, cinq ans d'exercice",
  "Возраст 30 лет, любое высшее образование, стаж три года":
    "Trente ans, n'importe quelles études supérieures, trois ans d'exercice",
  "Возраст 21 год, юридическое образование, без требований к стажу":
    "Vingt et un ans, des études de droit, sans condition d'exercice",
  "Возраст 35 лет, учёная степень, стаж десять лет":
    "Trente-cinq ans, un titre universitaire, dix ans d'exercice",
  "Для высших судов требования выше, но это общий минимум по статье 119. Судьи независимы, несменяемы и неприкосновенны.":
    "Pour les hautes cours les conditions sont plus strictes, mais c'est le minimum général de l'article 119. Les juges sont indépendants, inamovibles et inviolables.",
  "К чьей системе относятся мировые судьи?":
    "À quel système les juges de paix appartiennent-ils ?",
  "К федеральным судам": "Aux juridictions fédérales",
  "К судам субъектов Федерации": "Aux juridictions des sujets de la Fédération",
  "К муниципальным органам": "Aux organes municipaux",
  "К арбитражной ветви": "À la branche arbitrale",
  "Мировые судьи — суды субъектов, а не федеральные. Они рассматривают самые простые гражданские и часть уголовных дел.":
    "Les juges de paix relèvent des sujets et non de la Fédération. Ils connaissent des affaires civiles les plus simples et d'une partie des affaires pénales.",
  "Какие споры рассматривают арбитражные суды?":
    "De quels litiges les tribunaux arbitraux connaissent-ils ?",
  "Уголовные дела": "Des affaires pénales",
  "Экономические споры между организациями и предпринимателями":
    "Des litiges économiques entre organisations et entrepreneurs",
  "Семейные дела": "Des affaires familiales",
  "Жалобы на законы": "Des recours contre les lois",
  "Это отдельная ветвь внутри судебной системы. Жалобы на законы рассматривает Конституционный Суд, а уголовные дела — суды общей юрисдикции.":
    "C'est une branche à part au sein du système judiciaire. Les recours contre les lois relèvent de la Cour constitutionnelle, et les affaires pénales des juridictions de droit commun.",
  "Через сколько инстанций обычно проходит дело?":
    "Par combien de degrés une affaire passe-t-elle d'ordinaire ?",
  "Через одну": "Par un",
  "Через две": "Par deux",
  "Через три": "Par trois",
  "Через пять": "Par cinq",
  "Первая инстанция, апелляция и кассация. Есть ещё надзорная инстанция в Верховном Суде, но туда доходят немногие дела.":
    "La première instance, l'appel et la cassation. Il existe encore un degré de contrôle à la Cour suprême, mais peu d'affaires s'y rendent.",
  "Зачем в 2019 году создали отдельные кассационные и апелляционные суды?":
    "Pourquoi a-t-on créé en 2019 des cours de cassation et d'appel distinctes ?",
  "Чтобы разгрузить мировых судей": "Pour décharger les juges de paix",
  "Чтобы проверка шла не в том же регионе, где выносилось решение":
    "Pour que le contrôle ne se fasse pas dans la région même où la décision a été rendue",
  "Чтобы заменить арбитражные суды": "Pour remplacer les tribunaux arbitraux",
  "Чтобы сократить число инстанций": "Pour réduire le nombre de degrés",
  "Прежде апелляцию на решение областного суда рассматривал тот же областной суд другим составом. Окружные суды разорвали эту связку.":
    "Auparavant, l'appel d'une décision du tribunal régional était examiné par ce même tribunal, autrement composé. Les cours de circonscription ont rompu ce lien.",
  "Какие дела относятся к ведению Верховного Суда?":
    "De quelles affaires la Cour suprême connaît-elle ?",
  "Гражданские, уголовные, административные и экономические споры":
    "Des litiges civils, pénaux, administratifs et économiques",
  "Только споры между органами власти": "Des seuls litiges entre organes du pouvoir",
  "Только жалобы на законы": "Des seuls recours contre les lois",
  "После упразднения Высшего Арбитражного Суда в 2014 году экономические споры тоже перешли к нему. Жалобы на законы остались у Конституционного Суда.":
    "Après la suppression de la Haute Cour arbitrale en 2014, les litiges économiques lui sont revenus aussi. Les recours contre les lois sont restés à la Cour constitutionnelle.",
  "Какое значение имеют разъяснения Верховного Суда по вопросам судебной практики?":
    "Quelle portée ont les éclaircissements de la Cour suprême sur la pratique judiciaire ?",
  "Они носят рекомендательный характер и почти не используются":
    "Ils sont de simples recommandations et ne servent presque pas",
  "Они фактически определяют, как нижестоящие суды читают закон":
    "Ils déterminent en fait la façon dont les juridictions inférieures lisent la loi",
  "Они имеют силу федерального закона": "Ils ont force de loi fédérale",
  "Они обязательны только для арбитражных судов": "Ils ne s'imposent qu'aux tribunaux arbitraux",
  "Формально это разъяснения, а не нормы. На практике постановления Пленума задают единообразие и решают, какое толкование закона будет применяться по всей стране.":
    "Formellement ce sont des éclaircissements, non des normes. En pratique, les arrêts de l'assemblée plénière imposent l'uniformité et décident quelle lecture de la loi s'appliquera dans tout le pays.",
  "Что происходит с нормой, признанной Конституционным Судом неконституционной?":
    "Qu'advient-il d'une norme que la Cour constitutionnelle déclare contraire à la Constitution ?",
  "Она утрачивает силу": "Elle perd sa force",
  "Она применяется до отмены парламентом":
    "Elle s'applique jusqu'à son abrogation par le parlement",
  "Она действует ещё год": "Elle vaut encore un an",
  "Её применение решает каждый суд отдельно": "Chaque tribunal décide séparément de l'appliquer",
  "Норма утрачивает силу, и отдельного решения парламента для этого не требуется. Законодателю остаётся привести закон в порядок.":
    "La norme perd sa force, et aucune décision distincte du parlement n'est nécessaire. Il reste au législateur à remettre la loi en ordre.",
  "Какое из этих полномочий принадлежит Конституционному Суду?":
    "Lequel de ces pouvoirs appartient à la Cour constitutionnelle ?",
  "Пересмотр приговоров по уголовным делам": "La révision des jugements pénaux",
  "Рассмотрение экономических споров": "L'examen des litiges économiques",
  "Назначение судей районных судов": "La nomination des juges des tribunaux d'arrondissement",
  "Толкование Конституции, разрешение споров о компетенции, проверка конституционности законов. Приговоры и экономические споры — к Верховному Суду.":
    "L'interprétation de la Constitution, le règlement des conflits de compétence, le contrôle de constitutionnalité des lois. Les jugements et les litiges économiques vont à la Cour suprême.",
  "Кто назначает Генерального прокурора?": "Qui nomme le procureur général ?",
  "Президент единолично": "Le président, seul",
  "Совет Федерации по представлению Президента":
    "Le Conseil de la Fédération, sur proposition du président",
  "Совет Федерации по представлению Президента — тот же порядок, что и для судей высших судов. Прокуратура при этом судом не является.":
    "Le Conseil de la Fédération, sur proposition du président — la même procédure que pour les juges des hautes cours. Le parquet n'est pourtant pas une juridiction.",
  "Как устроена прокуратура по статье 129?":
    "Comment le parquet est-il organisé selon l'article 129 ?",
  "Как единая централизованная система с подчинением вышестоящим прокурорам":
    "En un système unique et centralisé, chaque procureur relevant de celui du dessus",
  "Как система независимых региональных прокуратур":
    "En un système de parquets régionaux indépendants",
  "Как подразделение Министерства юстиции": "En une division du ministère de la Justice",
  "Как часть судебной системы": "En une partie du système judiciaire",
  "Единая централизованная система во главе с Генеральным прокурором. Она надзирает за соблюдением законов и поддерживает обвинение, но не судит.":
    "Un système unique et centralisé, avec le procureur général à sa tête. Il veille au respect des lois et soutient l'accusation, mais ne juge pas.",
  "Кем осуществляется правосудие в России?": "Par qui la justice est-elle rendue en Russie ?",
  "Только судом": "Par les seules juridictions",
  "Судом и прокуратурой": "Par les juridictions et le parquet",
  "Судом и следственными органами": "Par les juridictions et les organes d'enquête",
  "Судом и органами власти субъектов": "Par les juridictions et les autorités des sujets",
  "Статья 118: правосудие осуществляется только судом. Прокуратура и следствие участвуют в процессе, но приговор выносит суд.":
    "Article 118 : la justice n'est rendue que par les juridictions. Le parquet et l'enquête prennent part au procès, mais c'est le tribunal qui rend le jugement.",
  "С какого возраста наступает право избирать?": "À partir de quel âge a-t-on le droit de voter ?",
  "Активное избирательное право — с восемнадцати лет, вместе с совершеннолетием. Право быть избранным зависит от должности.":
    "Le droit de voter s'ouvre à dix-huit ans, avec la majorité. Le droit d'être élu dépend de la charge.",
  "С какого возраста можно быть избранным главой субъекта Федерации?":
    "À partir de quel âge peut-on être élu chef d'un sujet de la Fédération ?",
  "С тридцати лет — тот же порог, что и для сенатора. Тридцать пять требуется только для Президента.":
    "À trente ans — le même seuil que pour un sénateur. Trente-cinq ne sont exigés que pour le président.",
  "Кто по статье 32 не имеет права избирать и быть избранным?":
    "Qui, selon l'article 32, n'a pas le droit de voter ni d'être élu ?",
  "Все, кто находится под следствием": "Tous ceux qui font l'objet d'une enquête",
  "Признанные судом недееспособными и содержащиеся в местах лишения свободы по приговору":
    "Ceux qu'un tribunal a déclarés incapables et ceux qui purgent une peine privative de liberté",
  "Не имеющие постоянной регистрации": "Ceux qui n'ont pas d'enregistrement permanent",
  "Не служившие в армии": "Ceux qui n'ont pas servi dans l'armée",
  "Два исключения, и оба требуют решения суда. Заключение под стражу до приговора права голоса не лишает.":
    "Deux exceptions, et toutes deux exigent une décision de justice. La détention avant jugement ne prive pas du droit de vote.",
  "Какой орган возглавляет систему избирательных комиссий?":
    "Quel organe est à la tête du système des commissions électorales ?",
  "Министерство юстиции": "Le ministère de la Justice",
  "Общественная палата": "La Chambre civique",
  "ЦИК, а ниже — комиссии субъектов, территориальные и участковые. На участках работают наблюдатели от кандидатов и партий.":
    "La commission électorale centrale, et au-dessous les commissions des sujets, territoriales et de bureau. Dans les bureaux travaillent des observateurs des candidats et des partis.",
  "Что статья 3 называет высшим непосредственным выражением власти народа?":
    "Qu'est-ce que l'article 3 nomme l'expression directe suprême du pouvoir du peuple ?",
  "Референдум и свободные выборы": "Le référendum et les élections libres",
  "Заседания парламента": "Les séances du parlement",
  "Обращения к Президенту": "Les requêtes adressées au président",
  "Работу общественных организаций": "L'activité des associations",
  "Оба названы прямо и в одном ряду. Народ осуществляет власть непосредственно и через органы государственной власти и местного самоуправления.":
    "Les deux sont nommés expressément et sur le même rang. Le peuple exerce le pouvoir directement et par les organes du pouvoir d'État et de l'administration locale.",
  "Сколько раз проводился общероссийский референдум?":
    "Combien de fois un référendum national a-t-il eu lieu ?",
  "Ни разу": "Jamais",
  "Дважды": "Deux fois",
  "Пять раз": "Cinq fois",
  "Каждые пять лет": "Tous les cinq ans",
  "В 1991 и 1993 годах. Голосование по поправкам 2020 года проводилось в особом порядке и референдумом в строгом смысле не называлось.":
    "En 1991 et en 1993. Le vote sur les amendements de 2020 s'est tenu selon une procédure particulière et n'a pas été appelé référendum au sens strict.",
  "Какое требование закон предъявляет к политической партии?":
    "Quelle condition la loi pose-t-elle à un parti politique ?",
  "Наличие региональных отделений более чем в половине субъектов":
    "Avoir des sections régionales dans plus de la moitié des sujets",
  "Наличие представительства во всех муниципалитетах": "Être représenté dans toutes les communes",
  "Согласие Совета Федерации": "L'accord du Conseil de la Fédération",
  "Существование не менее десяти лет": "Exister depuis dix ans au moins",
  "Закон о политических партиях требует определённой численности и региональных отделений более чем в половине субъектов Федерации.":
    "La loi sur les partis politiques exige un certain nombre d'adhérents et des sections régionales dans plus de la moitié des sujets de la Fédération.",
  "Какая глава Конституции посвящена местному самоуправлению?":
    "Quel chapitre de la Constitution est consacré à l'administration locale ?",
  "Третья": "Le troisième",
  "Шестая": "Le sixième",
  "Восьмая": "Le huitième",
  "Девятая": "Le neuvième",
  "Восьмая глава, статьи 130–133. Отдельная глава подчёркивает, что местное самоуправление не является нижним этажом государственной власти.":
    "Le huitième chapitre, articles 130 à 133. Un chapitre à part souligne que l'administration locale n'est pas l'étage inférieur du pouvoir d'État.",
  "Какие из этих образований являются муниципальными?":
    "Lesquelles de ces entités sont communales ?",
  "Городской округ, муниципальный округ, муниципальный район, поселение":
    "L'arrondissement urbain, l'arrondissement communal, le district communal, la localité",
  "Область, край, республика": "L'oblast, le kraï, la république",
  "Федеральный округ и субъект": "La circonscription fédérale et le sujet",
  "Регион и агломерация": "La région et l'agglomération",
  "Области, края и республики — субъекты Федерации, то есть государственный уровень. Федеральные округа вообще не предусмотрены Конституцией.":
    "Les oblasts, les kraïs et les républiques sont des sujets de la Fédération, c'est-à-dire l'échelon de l'État. Les circonscriptions fédérales ne sont même pas prévues par la Constitution.",
  "Что относится к вопросам местного значения?": "Qu'est-ce qui relève des affaires locales ?",
  "Благоустройство, местные дороги, жилищно-коммунальное хозяйство":
    "L'aménagement, les routes locales, le logement et les services urbains",
  "Оборона и безопасность": "La défense et la sécurité",
  "Уголовное законодательство": "La législation pénale",
  "Денежная эмиссия": "L'émission de monnaie",
  "Оборона, уголовное право и денежная эмиссия — исключительное ведение Федерации. Муниципалитет отвечает за то, что видно из окна.":
    "La défense, le droit pénal et l'émission de monnaie relèvent de la seule Fédération. La commune répond de ce qu'on voit par sa fenêtre.",
  "На каком условии государственные полномочия могут быть переданы муниципалитету?":
    "À quelle condition des pouvoirs d'État peuvent-ils être transférés à une commune ?",
  "Только вместе с необходимыми для их исполнения средствами":
    "Seulement avec les moyens nécessaires à leur exercice",
  "По решению главы муниципалитета": "Sur décision du chef de la commune",
  "Безвозмездно, как обязанность": "Sans contrepartie, comme une obligation",
  "Передача невозможна": "Le transfert est impossible",
  "Наделение отдельными государственными полномочиями возможно законом и с передачей материальных и финансовых средств. Иначе обязанность повисла бы без денег.":
    "L'attribution de certains pouvoirs d'État est possible par la loi et avec le transfert des moyens matériels et financiers. Sans quoi l'obligation resterait suspendue faute d'argent.",
  "Кто назначает Уполномоченного по правам человека в Российской Федерации?":
    "Qui nomme le défenseur des droits de l'homme dans la Fédération de Russie ?",
  "Государственная Дума. Омбудсмен работает независимо от органов власти, и у большинства субъектов есть собственный уполномоченный.":
    "La Douma d'État. Le médiateur travaille indépendamment des organes du pouvoir, et la plupart des sujets ont leur propre défenseur.",
  "Как избирается глава муниципального образования?":
    "Comment le chef d'une entité communale est-il choisi ?",
  "Порядок различается: прямые выборы, избрание депутатами или по конкурсу":
    "La procédure varie : élection directe, élection par les conseillers, ou concours",
  "Только прямыми выборами по всей стране": "Par élection directe seulement, dans tout le pays",
  "Его назначает губернатор": "Le gouverneur le nomme",
  "Его назначает Президент": "Le président le nomme",
  "Способ определяют закон субъекта и устав муниципалитета, поэтому в соседних городах он может быть разным.":
    "La loi du sujet et la charte de la commune en décident, si bien qu'il peut différer d'une ville à la voisine.",
  "Как назывался торговый путь, вдоль которого выросла Киевская Русь?":
    "Comment s'appelait la route commerciale le long de laquelle la Rus de Kiev a grandi ?",
  "Великий шёлковый путь": "La route de la soie",
  "Волжский путь": "La route de la Volga",
  "Янтарный путь": "La route de l'ambre",
  "От Балтики по Волхову и Днепру к Чёрному морю и Константинополю. Города вырастали там, где стоило держать перевоз и склад: Новгород, Смоленск, Киев.":
    "De la Baltique par le Volkhov et le Dniepr jusqu'à la mer Noire et Constantinople. Les villes poussaient là où il valait la peine de tenir un passage et un entrepôt : Novgorod, Smolensk, Kiev.",
  "К какому году летопись относит призвание Рюрика?":
    "À quelle année la chronique rapporte-t-elle l'appel à Riourik ?",
  "К 862 году": "À 862",
  "К 882 году": "À 882",
  "К 988 году": "À 988",
  "К 1147 году": "À 1147",
  "862 год по «Повести временных лет». 882-й — объединение Новгорода и Киева Олегом, 988-й — Крещение Руси, 1147-й — первое упоминание Москвы.":
    "862, selon la Chronique des temps passés. 882, c'est la réunion de Novgorod et de Kiev par Oleg ; 988, le baptême de la Rus ; 1147, la première mention de Moscou.",
  "Кто объединил Новгород и Киев под одной властью?":
    "Qui a réuni Novgorod et Kiev sous une seule autorité ?",
  "Рюрик": "Riourik",
  "Олег": "Oleg",
  "Владимир": "Vladimir",
  "Олег в 882 году, и он же сделал Киев столицей. С этой даты принято вести начало Киевской Руси.":
    "Oleg, en 882, et c'est lui aussi qui a fait de Kiev la capitale. C'est de cette date qu'on fait partir la Rus de Kiev.",
  "Какой князь крестил Русь?": "Quel prince a baptisé la Rus ?",
  "Игорь": "Igor",
  "Святослав": "Sviatoslav",
  "Князь Владимир, в 988 году. Решение было и религиозным, и политическим: страна входила в круг христианской Европы.":
    "Le prince Vladimir, en 988. La décision fut religieuse autant que politique : le pays entrait dans le cercle de l'Europe chrétienne.",
  "Кто создал славянскую азбуку?": "Qui a créé l'alphabet slave ?",
  "Кирилл и Мефодий": "Cyrille et Méthode",
  "Нестор Летописец": "Nestor le Chroniqueur",
  "Кириллица создана в IX веке для перевода богослужебных книг на понятный славянам язык. Нестор — летописец, автор «Повести временных лет».":
    "Le cyrillique fut créé au neuvième siècle pour traduire les livres liturgiques dans une langue que les Slaves comprennent. Nestor est un chroniqueur, l'auteur de la Chronique des temps passés.",
  "Что заменила Русская Правда в порядке наказаний?":
    "Qu'a remplacé la Rousskaïa Pravda dans l'ordre des peines ?",
  "Церковный суд": "La justice de l'Église",
  "Кровную месть": "La vengeance du sang",
  "Ордынский суд": "La justice de la Horde",
  "Суд веча": "La justice de l'assemblée",
  "Вместо мести устанавливались денежные штрафы, различавшиеся по состоянию потерпевшего. Свод дополнялся при потомках Ярослава.":
    "À la place de la vengeance s'établissaient des amendes en argent, différentes selon la condition de la victime. Le recueil fut complété sous les descendants de Iaroslav.",
  "С кем породнился Ярослав Мудрый через своих дочерей?":
    "Avec qui Iaroslav le Sage s'est-il allié par ses filles ?",
  "С королями Франции, Норвегии и Венгрии": "Avec les rois de France, de Norvège et de Hongrie",
  "С ханами степи": "Avec les khans de la steppe",
  "С императорами Китая": "Avec les empereurs de Chine",
  "Ни с кем: браки заключались только внутри Руси":
    "Avec personne : les mariages ne se faisaient qu'à l'intérieur de la Rus",
  "Русь была частью европейской династической сети, и киевский двор считался желанной партией. Это одна из причин, по которым XI век называют временем расцвета.":
    "La Rus faisait partie du réseau dynastique européen, et la cour de Kiev passait pour un parti recherché. C'est l'une des raisons pour lesquelles on appelle le onzième siècle un temps d'épanouissement.",
  "Чем управлялась Новгородская республика?":
    "Comment la république de Novgorod était-elle gouvernée ?",
  "Наследственным князем": "Par un prince héréditaire",
  "Вечем — собранием горожан, приглашавшим и изгонявшим князя":
    "Par le vétché, l'assemblée des habitants, qui appelait et chassait le prince",
  "Митрополитом": "Par le métropolite",
  "Ханским наместником": "Par un lieutenant du khan",
  "Новгород ближе к городской республике, чем к княжеству: князя нанимали как военного руководителя и могли прогнать. Эта традиция кончится в 1478 году.":
    "Novgorod tient plus de la république urbaine que de la principauté : on engageait le prince comme chef de guerre et on pouvait le renvoyer. Cette tradition prendra fin en 1478.",
  "Куда сместился центр силы русских земель в XII веке?":
    "Où le centre de gravité des terres russes s'est-il déplacé au douzième siècle ?",
  "На юго-запад, в Галицко-Волынскую землю": "Au sud-ouest, vers la terre de Galicie-Volhynie",
  "На северо-восток, во Владимиро-Суздальскую землю":
    "Au nord-est, vers la terre de Vladimir-Souzdal",
  "На север, в Новгород": "Au nord, vers Novgorod",
  "Он остался в Киеве": "Il est resté à Kiev",
  "При Андрее Боголюбском центр переместился на северо-восток. Из этих земель через двести лет вырастет Москва.":
    "Sous André Bogolioubski, le centre s'est déplacé au nord-est. De ces terres, deux cents ans plus tard, sortira Moscou.",
  "О чём говорит «Слово о полку Игореве»?": "De quoi parle le Dit de la campagne d'Igor ?",
  "О крещении Руси": "Du baptême de la Rus",
  "О неудачном походе против половцев и о разобщённости князей":
    "D'une campagne manquée contre les Coumans et de la désunion des princes",
  "О призвании варягов": "De l'appel aux Varègues",
  "О Куликовской битве": "De la bataille de Koulikovo",
  "Тема поэмы — та же беда, что и у Любечского съезда: князья не действуют вместе. Единственный известный список сгорел в московском пожаре 1812 года.":
    "Le sujet du poème est le même mal que celui de la diète de Lioubetch : les princes n'agissent pas ensemble. Le seul manuscrit connu a brûlé dans l'incendie de Moscou de 1812.",
  "В каком году впервые упоминается Москва?":
    "En quelle année Moscou est-elle mentionnée pour la première fois ?",
  "В 1147 году": "En 1147",
  "В 1237 году": "En 1237",
  "1147 год. Тогда это небольшой пункт на окраине Владимиро-Суздальской земли; до превращения в центр страны пройдёт около двухсот лет.":
    "En 1147. Ce n'est alors qu'un petit point à la lisière de la terre de Vladimir-Souzdal ; il faudra environ deux cents ans pour qu'elle devienne le centre du pays.",
  "В каком году пал Киев под ударом войск Батыя?":
    "En quelle année Kiev est-elle tombée sous les coups des armées de Batou ?",
  "В 1223 году": "En 1223",
  "1240 год. Нашествие началось в 1237-м с Рязани, а 1242-й — это Ледовое побоище, событие западного направления.":
    "En 1240. L'invasion avait commencé en 1237 par Riazan, et 1242 est la bataille du lac Peïpous, un événement du front occidental.",
  "Почему княжества не смогли выставить против Батыя общее войско?":
    "Pourquoi les principautés n'ont-elles pas pu opposer à Batou une armée commune ?",
  "Не хватало оружия": "Les armes manquaient",
  "Из-за раздробленности, закреплённой Любечским съездом":
    "À cause du morcellement, consacré par la diète de Lioubetch",
  "Князья были в походе на запад": "Les princes étaient en campagne à l'ouest",
  "Мешала зима": "L'hiver y faisait obstacle",
  "Съезд 1097 года закрепил разделение земель между княжескими линиями, и через сто сорок лет каждое княжество оборонялось поодиночке.":
    "La diète de 1097 a consacré le partage des terres entre les lignées princières, et cent quarante ans plus tard chaque principauté se défendait seule.",
  "Как называлась дань, которую русские земли платили Орде?":
    "Comment s'appelait le tribut que les terres russes payaient à la Horde ?",
  "Оброк": "L'obrok",
  "Выход": "Le vykhod",
  "Тягло": "Le tiaglo",
  "Полюдье": "Le polioudié",
  "Выход. Собирали его сначала ханские сборщики — баскаки, а позже это право перешло к самим князьям, и с него началось возвышение Москвы.":
    "Le vykhod. Il fut d'abord levé par les collecteurs du khan, les baskaks, puis ce droit passa aux princes eux-mêmes, et c'est de là qu'est partie l'ascension de Moscou.",
  "Кто такие баскаки?": "Qui étaient les baskaks ?",
  "Ханские сборщики дани": "Les collecteurs de tribut du khan",
  "Русские воеводы": "Des chefs de guerre russes",
  "Купцы Великого Новгорода": "Des marchands de Novgorod la Grande",
  "Монахи-летописцы": "Des moines chroniqueurs",
  "Ордынские чиновники, собиравшие выход на местах. Позже сбор передали князьям, и это оказалось решающим преимуществом для Москвы.":
    "Des fonctionnaires de la Horde qui levaient le vykhod sur place. La levée passa ensuite aux princes, et ce fut l'avantage décisif de Moscou.",
  "Где Александр Невский разбил шведов в 1240 году?":
    "Où Alexandre Nevski a-t-il battu les Suédois en 1240 ?",
  "На Чудском озере": "Sur le lac Peïpous",
  "На Неве": "Sur la Neva",
  "На Куликовом поле": "Sur le champ de Koulikovo",
  "На Угре": "Sur l'Ougra",
  "На Неве, откуда и прозвище. Ледовое побоище на Чудском озере состоялось двумя годами позже, против Ливонского ордена.":
    "Sur la Neva, d'où son surnom. La bataille des glaces, sur le lac Peïpous, eut lieu deux ans plus tard, contre l'ordre de Livonie.",
  "Почему Александр Невский не воевал с Ордой?":
    "Pourquoi Alexandre Nevski n'a-t-il pas combattu la Horde ?",
  "Он был родственником хана": "Il était parent du khan",
  "Воевать одновременно на два фронта было невозможно":
    "Combattre sur deux fronts à la fois était impossible",
  "Орда не претендовала на его земли": "La Horde ne réclamait pas ses terres",
  "Ему запретил митрополит": "Le métropolite le lui a interdit",
  "С запада шли Орден и Швеция, с востока — Орда. Выбор в пользу соглашения с Ордой историки обсуждают до сих пор.":
    "De l'ouest venaient l'Ordre et la Suède, de l'est la Horde. Le choix de s'entendre avec la Horde se discute encore chez les historiens.",
  "Какие два решения Ивана Калиты усилили Москву?":
    "Quelles deux décisions d'Ivan Kalita ont renforcé Moscou ?",
  "Право собирать дань и перенос митрополичьей кафедры":
    "Le droit de lever le tribut et le transfert du siège métropolitain",
  "Строительство флота и открытие университета":
    "La construction d'une flotte et l'ouverture d'une université",
  "Отказ платить дань и союз с Литвой":
    "Le refus de payer le tribut et l'alliance avec la Lituanie",
  "Введение земских соборов и Судебника":
    "L'institution des assemblées d'États et du code de justice",
  "Деньги и церковный авторитет. Ни того, ни другого не давало географическое положение города — это был результат расчёта.":
    "L'argent et l'autorité de l'Église. Ni l'un ni l'autre ne venaient de la position géographique de la ville : ce fut le fruit d'un calcul.",
  "Против кого сражалось войско Дмитрия Донского на Куликовом поле?":
    "Contre qui l'armée de Dmitri Donskoï s'est-elle battue sur le champ de Koulikovo ?",
  "Против Батыя": "Contre Batou",
  "Против Мамая": "Contre Mamaï",
  "Против Ахмата": "Contre Akhmat",
  "Против Тохтамыша": "Contre Tokhtamych",
  "Против Мамая. Тохтамыш сжёг Москву через два года после битвы, а Ахмат стоял на Угре ровно столетие спустя.":
    "Contre Mamaï. Tokhtamych a brûlé Moscou deux ans après la bataille, et Akhmat s'est tenu sur l'Ougra exactement un siècle plus tard.",
  "Сняла ли Куликовская битва ордынскую зависимость?":
    "La bataille de Koulikovo a-t-elle mis fin à la sujétion à la Horde ?",
  "Да, сразу же": "Oui, aussitôt",
  "Нет: через два года Тохтамыш сжёг Москву":
    "Non : deux ans plus tard, Tokhtamych brûlait Moscou",
  "Да, но только для Москвы": "Oui, mais pour Moscou seulement",
  "Зависимости к тому времени уже не было": "La sujétion n'existait déjà plus alors",
  "Победа показала, что Орду можно побеждать, но зависимость продержалась ещё сто лет, до стояния на Угре в 1480 году.":
    "La victoire a montré qu'on pouvait battre la Horde, mais la sujétion a tenu encore cent ans, jusqu'à la halte de l'Ougra en 1480.",
  "Кто присоединил Новгород к Московскому государству?":
    "Qui a rattaché Novgorod à l'État moscovite ?",
  "Иван Калита": "Ivan Kalita",
  "Дмитрий Донской": "Dmitri Donskoï",
  "Иван III в 1478 году. Он вывез вечевой колокол — символ городского самоуправления, и республиканская традиция Новгорода прервалась.":
    "Ivan III, en 1478. Il emporta la cloche du vétché, symbole de l'autonomie de la ville, et la tradition républicaine de Novgorod s'interrompit.",
  "Какой титул принял Иван III?": "Quel titre Ivan III a-t-il pris ?",
  "Царь": "Tsar",
  "Государь всея Руси": "Souverain de toute la Rus",
  "Император": "Empereur",
  "Великий хан": "Grand khan",
  "«Государь всея Руси». Царём первым венчается Иван IV в 1547 году, а императором станет Пётр I в 1721-м.":
    "« Souverain de toute la Rus ». Le premier à être couronné tsar sera Ivan IV en 1547, et Pierre Ier deviendra empereur en 1721.",
  "Сколько лет длилась ордынская зависимость?":
    "Combien d'années la sujétion à la Horde a-t-elle duré ?",
  "Около ста лет": "Environ cent ans",
  "Около ста сорока лет": "Environ cent quarante ans",
  "Около двухсот сорока лет": "Environ deux cent quarante ans",
  "Около трёхсот лет": "Environ trois cents ans",
  "С 1240 по 1480 год — двести сорок лет. Это дольше, чем существовала Российская империя.":
    "De 1240 à 1480 — deux cent quarante ans. C'est plus long que n'a duré l'Empire russe.",
  "Кто написал икону «Троица»?": "Qui a peint l'icône de la Trinité ?",
  "Феофан Грек": "Théophane le Grec",
  "Дионисий": "Denys",
  "Симон Ушаков": "Simon Ouchakov",
  "Андрей Рублёв, около 1425 года, для Троице-Сергиева монастыря. Икона стала образцом для нескольких поколений иконописцев.":
    "André Roublev, vers 1425, pour le monastère de la Trinité-Saint-Serge. L'icône est devenue le modèle de plusieurs générations de peintres d'icônes.",
  "Какой герб появился при Иване III?": "Quelles armes sont apparues sous Ivan III ?",
  "Всадник с копьём": "Le cavalier à la lance",
  "Лев": "Le lion",
  "Двуглавый орёл вошёл в русскую геральдику в конце XV века. Всадник — древний московский герб, который позже оказался на груди орла.":
    "L'aigle bicéphale est entré dans l'héraldique russe à la fin du quinzième siècle. Le cavalier est l'ancien blason de Moscou, qui s'est trouvé plus tard sur la poitrine de l'aigle.",
  "Чем московский порядок наследования отличался от порядка в соседних княжествах?":
    "En quoi l'ordre de succession moscovite différait-il de celui des principautés voisines ?",
  "Наследование шло от отца к сыну, а не дробилось между братьями":
    "La succession allait de père en fils, sans se morceler entre les frères",
  "Наследника выбирало вече": "Le vétché choisissait l'héritier",
  "Княжество делилось поровну между всеми детьми":
    "La principauté se partageait à parts égales entre tous les enfants",
  "Наследника назначал хан": "Le khan désignait l'héritier",
  "Прямое наследование не давало владениям дробиться. Соседние княжества, наоборот, распадались с каждым поколением.":
    "La succession directe empêchait les domaines de se morceler. Les principautés voisines, au contraire, se défaisaient à chaque génération.",
  "В каком году Иван IV венчался на царство?":
    "En quelle année Ivan IV a-t-il été couronné tsar ?",
  "В 1497 году": "En 1497",
  "В 1547 году": "En 1547",
  "В 1552 году": "En 1552",
  "1547 год. 1497-й — Судебник Ивана III, 1552-й — взятие Казани, 1480-й — стояние на Угре.":
    "1547. 1497, c'est le code de justice d'Ivan III ; 1552, la prise de Kazan ; 1480, la halte de l'Ougra.",
  "Что такое земский собор?": "Qu'est-ce qu'une assemblée d'États ?",
  "Сословное собрание, созывавшееся по решению власти":
    "Une assemblée d'ordres, convoquée sur décision du pouvoir",
  "Постоянный парламент": "Un parlement permanent",
  "Собрание городских ремесленников": "Une assemblée d'artisans de la ville",
  "Собор собирался нерегулярно и представлял сословия, а не избирателей. Но именно он в 1613 году выбрал царя, и этот прецедент запомнился.":
    "L'assemblée se réunissait sans régularité et représentait les ordres, non des électeurs. C'est pourtant elle qui, en 1613, a choisi le tsar, et ce précédent est resté dans les mémoires.",
  "Какое ханство было присоединено в 1552 году?": "Quel khanat fut rattaché en 1552 ?",
  "Астраханское": "Celui d'Astrakhan",
  "Казанское": "Celui de Kazan",
  "Крымское": "Celui de Crimée",
  "Сибирское": "Celui de Sibérie",
  "Казань в 1552-м, Астрахань в 1556-м, и Волга стала русской рекой на всём протяжении. Крым войдёт в состав России только в 1783 году.":
    "Kazan en 1552, Astrakhan en 1556, et la Volga devint russe sur tout son cours. La Crimée n'entrera dans la Russie qu'en 1783.",
  "Кто начал присоединение Сибири в 1580-е годы?":
    "Qui a commencé le rattachement de la Sibérie dans les années 1580 ?",
  "Ермак": "Ermak",
  "Дежнёв": "Dejnev",
  "Хабаров": "Khabarov",
  "Беринг": "Béring",
  "Отряд Ермака. Дежнёв в 1648 году пройдёт проливом между Азией и Америкой: путь до Тихого океана занял меньше века.":
    "La troupe d'Ermak. Dejnev franchira en 1648 le détroit entre l'Asie et l'Amérique : la route jusqu'au Pacifique aura pris moins d'un siècle.",
  "Что такое опричнина?": "Qu'est-ce que l'opritchnina ?",
  "Особый удел царя с собственным войском, время казней и конфискаций":
    "Un domaine à part du tsar, avec sa propre troupe, un temps d'exécutions et de confiscations",
  "Система сбора налогов": "Un système de levée de l'impôt",
  "Свод законов Ивана IV": "Le recueil de lois d'Ivan IV",
  "Название царского двора": "Le nom de la cour du tsar",
  "С 1565 по 1572 год. Массовые казни, разгром Новгорода и разорение центральных уездов вместе с Ливонской войной подорвали хозяйство страны.":
    "De 1565 à 1572. Les exécutions en masse, le sac de Novgorod et la ruine des districts du centre, avec la guerre de Livonie, ont miné l'économie du pays.",
  "Что было учреждено в Москве в 1589 году?": "Qu'a-t-on institué à Moscou en 1589 ?",
  "Синод": "Le Synode",
  "Земский собор": "L'assemblée d'États",
  "Сенат": "Le Sénat",
  "Патриаршество: русская церковь стала полностью самостоятельной. Пётр I упразднит его и заменит Синодом, а восстановят патриаршество в 1917 году.":
    "Le patriarcat : l'Église russe devint pleinement autonome. Pierre Ier le supprimera et le remplacera par le Synode, et le patriarcat sera rétabli en 1917.",
  "Что такое Смутное время?": "Qu'est-ce que le Temps des troubles ?",
  "Период с 1598 по 1613 год: пресечение династии, самозванцы, голод и интервенция":
    "La période de 1598 à 1613 : l'extinction de la dynastie, les imposteurs, la famine et l'intervention étrangère",
  "Годы опричнины": "Les années de l'opritchnina",
  "Церковный раскол XVII века": "Le schisme de l'Église au dix-septième siècle",
  "Восстание Пугачёва": "La révolte de Pougatchev",
  "Государство фактически перестало существовать: в Москве стоял иноземный гарнизон, а власть на местах распалась. Выход нашёлся снизу, через ополчение.":
    "L'État a de fait cessé d'exister : une garnison étrangère tenait Moscou et le pouvoir local s'était défait. La sortie est venue d'en bas, par la milice.",
  "Кто возглавил ополчение, освободившее Москву в 1612 году?":
    "Qui a conduit la milice qui a libéré Moscou en 1612 ?",
  "Минин и Пожарский": "Minine et Pojarski",
  "Иван Сусанин и Михаил Романов": "Ivan Soussanine et Michel Romanov",
  "Ермак и Дежнёв": "Ermak et Dejnev",
  "Никон и Аввакум": "Nikon et Avvakoum",
  "Земский староста Кузьма Минин собрал средства, князь Дмитрий Пожарский возглавил войско. Это событие лежит в основе Дня народного единства.":
    "L'ancien de la ville Kouzma Minine réunit les fonds, le prince Dmitri Pojarski prit la tête de l'armée. Cet événement est à l'origine de la journée de l'unité du peuple.",
  "Сколько лет правила династия Романовых?":
    "Combien d'années la dynastie des Romanov a-t-elle régné ?",
  "Сто лет": "Cent ans",
  "Двести лет": "Deux cents ans",
  "Триста четыре года": "Trois cent quatre ans",
  "Четыреста лет": "Quatre cents ans",
  "С 1613 по 1917 год. Первым был избран шестнадцатилетний Михаил, последним стал Николай II.":
    "De 1613 à 1917. Le premier élu fut Michel, âgé de seize ans, et le dernier fut Nicolas II.",
  "Что изменил в положении крестьян бессрочный сыск беглых?":
    "Qu'a changé pour les paysans la recherche sans limite de temps des fugitifs ?",
  "Крестьянин мог уйти от владельца через десять лет":
    "Le paysan pouvait quitter son maître au bout de dix ans",
  "Крестьянин оказался прикреплён к земле и владельцу навсегда":
    "Le paysan s'est trouvé attaché à la terre et à son maître pour toujours",
  "Крестьяне получили право владеть землёй": "Les paysans ont reçu le droit de posséder la terre",
  "Ничего: норма не применялась": "Rien : la règle n'a pas été appliquée",
  "До Уложения срок сыска был ограничен, и по его истечении беглого не возвращали. С 1649 года эта возможность исчезла.":
    "Avant le code, le délai de recherche était borné, et passé ce délai on ne rendait plus le fugitif. À partir de 1649, cette possibilité a disparu.",
  "Кто провёл церковную реформу середины XVII века?":
    "Qui a mené la réforme de l'Église au milieu du dix-septième siècle ?",
  "Патриарх Никон": "Le patriarche Nikon",
  "Протопоп Аввакум": "L'archiprêtre Avvakoum",
  "Митрополит Алексий": "Le métropolite Alexis",
  "Патриарх Филарет": "Le patriarche Philarète",
  "Никон исправил книги и обряды по греческому образцу. Часть верующих реформу не приняла — произошёл раскол, а Аввакум стал вождём старообрядцев.":
    "Nikon a corrigé les livres et les rites sur le modèle grec. Une partie des fidèles n'a pas accepté la réforme — ce fut le schisme, et Avvakoum devint le chef des vieux-croyants.",
  "Кто такие старообрядцы?": "Qui sont les vieux-croyants ?",
  "Верующие, не принявшие реформу Никона": "Les fidèles qui n'ont pas accepté la réforme de Nikon",
  "Монахи древних монастырей": "Les moines des monastères anciens",
  "Служители дореформенной церкви в Новгороде":
    "Les desservants de l'Église d'avant la réforme à Novgorod",
  "Последователи католического обряда": "Les tenants du rite catholique",
  "Раскол XVII века отделил их от господствующей церкви на столетия. Старообрядческие общины существуют и сегодня.":
    "Le schisme du dix-septième siècle les a séparés de l'Église dominante pour des siècles. Des communautés de vieux-croyants existent encore aujourd'hui.",
  "Сколько лет действовало Соборное уложение 1649 года?":
    "Combien d'années le code de 1649 est-il resté en vigueur ?",
  "Около двадцати лет": "Environ vingt ans",
  "Около пятидесяти лет": "Environ cinquante ans",
  "Почти двести лет": "Près de deux cents ans",
  "Оно действует до сих пор": "Il est en vigueur encore aujourd'hui",
  "Почти двести лет — до кодификации законов в XIX веке. Крепостное право, им закреплённое, отменят в 1861 году.":
    "Près de deux cents ans — jusqu'à la codification des lois au dix-neuvième siècle. Le servage qu'il consacrait sera aboli en 1861.",
  "В каком году был основан Санкт-Петербург?":
    "En quelle année Saint-Pétersbourg a-t-elle été fondée ?",
  "В 1700 году": "En 1700",
  "1703 год, на отвоёванной у Швеции земле. Столицей он останется более двухсот лет, до 1918 года.":
    "En 1703, sur une terre reprise à la Suède. Elle restera capitale plus de deux cents ans, jusqu'en 1918.",
  "Что такое Табель о рангах?": "Qu'est-ce que la Table des rangs ?",
  "Список дворянских родов": "Une liste des familles nobles",
  "Система чинов, при которой положение зависело от службы, а не от происхождения":
    "Un système de grades où la position dépendait du service et non de la naissance",
  "Перечень налогов": "Une liste d'impôts",
  "Реестр земельных владений": "Un registre des propriétés foncières",
  "Введена Петром I. Она открыла дорогу наверх людям незнатного происхождения и связала статус с государственной службой.":
    "Instituée par Pierre Ier. Elle a ouvert la voie vers le haut à des gens de naissance obscure et lié le rang au service de l'État.",
  "Сколько лет длилась Северная война?":
    "Combien d'années la Grande Guerre du Nord a-t-elle duré ?",
  "Двенадцать лет": "Douze ans",
  "Двадцать один год": "Vingt et un ans",
  "Тридцать лет": "Trente ans",
  "С 1700 по 1721 год. Полтавская победа 1709 года стала переломом, а окончание войны совпало с провозглашением империи.":
    "De 1700 à 1721. La victoire de Poltava en 1709 fut le tournant, et la fin de la guerre a coïncidé avec la proclamation de l'Empire.",
  "Что такое эпоха дворцовых переворотов?": "Qu'est-ce que l'époque des révolutions de palais ?",
  "Период, когда гвардия несколько раз решала, кто займёт престол":
    "La période où la garde a décidé plusieurs fois qui monterait sur le trône",
  "Годы строительства дворцов в Петербурге":
    "Les années où l'on bâtissait les palais de Pétersbourg",
  "Время войн с Турцией": "Le temps des guerres contre la Turquie",
  "Период правления Екатерины II": "Le règne de Catherine II",
  "После смерти Петра I престол несколько раз переходил при участии гвардейских полков. Закончилась эпоха воцарением Екатерины II в 1762 году.":
    "Après la mort de Pierre Ier, le trône a changé de mains plusieurs fois avec le concours des régiments de la garde. L'époque s'est close par l'avènement de Catherine II en 1762.",
  "В каком году был присоединён Крым при Екатерине II?":
    "En quelle année la Crimée fut-elle rattachée sous Catherine II ?",
  "В 1774 году": "En 1774",
  "В 1783 году": "En 1783",
  "В 1812 году": "En 1812",
  "1783 год. К этому же времени относятся освоение Новороссии и основание Одессы, Севастополя и Херсона.":
    "En 1783. De la même époque datent la mise en valeur de la Nouvelle-Russie et la fondation d'Odessa, de Sébastopol et de Kherson.",
  "Какое крупное народное восстание произошло при Екатерине II?":
    "Quelle grande révolte populaire a eu lieu sous Catherine II ?",
  "Восстание Болотникова": "La révolte de Bolotnikov",
  "Соляной бунт": "L'émeute du sel",
  "Восстание 1773–1775 годов охватило Урал и Поволжье. Просвещённые замыслы императрицы остались на бумаге, а крепостное право стало жёстче.":
    "La révolte de 1773 à 1775 a gagné l'Oural et la région de la Volga. Les desseins éclairés de l'impératrice sont restés sur le papier, et le servage s'est durci.",
  "Кто командовал русской армией в Бородинском сражении?":
    "Qui commandait l'armée russe à la bataille de Borodino ?",
  "Суворов": "Souvorov",
  "Кутузов": "Koutouzov",
  "Нахимов": "Nakhimov",
  "Багратион": "Bagration",
  "Михаил Кутузов. После сражения он оставил Москву, и это решение спасло армию, хотя город почти целиком сгорел.":
    "Mikhaïl Koutouzov. Après la bataille, il a abandonné Moscou, et cette décision a sauvé l'armée, même si la ville a brûlé presque tout entière.",
  "Чего требовали декабристы в 1825 году?": "Que réclamaient les décembristes en 1825 ?",
  "Конституции и ограничения самодержавия": "Une constitution et la limitation de l'autocratie",
  "Восстановления патриаршества": "Le rétablissement du patriarcat",
  "Присоединения новых земель": "Le rattachement de terres nouvelles",
  "Отмены Табели о рангах": "L'abolition de la Table des rangs",
  "Это первое выступление за конституцию в русской истории. Восстание было подавлено за день, пятерых казнили, остальных сослали в Сибирь.":
    "C'est le premier mouvement pour une constitution de l'histoire russe. Le soulèvement fut écrasé en un jour, cinq hommes furent exécutés et les autres déportés en Sibérie.",
  "Какой император отменил крепостное право?": "Quel empereur a aboli le servage ?",
  "Николай I": "Nicolas Ier",
  "Александр II": "Alexandre II",
  "Александр III": "Alexandre III",
  "Николай II": "Nicolas II",
  "Александр II, манифестом 19 февраля 1861 года. За ним последовали земская, судебная и военная реформы.":
    "Alexandre II, par le manifeste du 19 février 1861. Suivirent les réformes des assemblées locales, de la justice et de l'armée.",
  "Что получили крестьяне по реформе 1861 года и чего не получили?":
    "Qu'ont reçu les paysans par la réforme de 1861, et que n'ont-ils pas reçu ?",
  "Личную свободу, но землю пришлось выкупать":
    "La liberté personnelle, mais il leur a fallu racheter la terre",
  "И свободу, и землю безвозмездно": "La liberté et la terre, sans rien payer",
  "Землю, но остались лично зависимыми":
    "La terre, mais ils sont restés personnellement dépendants",
  "Право уйти в город без документов": "Le droit de partir en ville sans papiers",
  "Выкупные платежи легли на деревню на десятилетия вперёд. Именно поэтому реформу называют незавершённой.":
    "Les versements de rachat ont pesé sur la campagne pendant des décennies. C'est pour cela qu'on dit la réforme inachevée.",
  "Что ввела судебная реформа 1864 года?": "Qu'a introduit la réforme judiciaire de 1864 ?",
  "Гласный суд, состязательность, адвокатуру и суд присяжных":
    "La publicité des audiences, la procédure contradictoire, le barreau et le jury populaire",
  "Военные трибуналы": "Les tribunaux militaires",
  "Церковный суд по гражданским делам": "La justice ecclésiastique en matière civile",
  "Единый кассационный суд": "Une cour de cassation unique",
  "Реформа считается самой удачной из великих реформ. Суд присяжных, введённый тогда, был упразднён в советское время и вернулся в девяностые.":
    "Cette réforme passe pour la mieux réussie des grandes réformes. Le jury alors institué fut supprimé sous les Soviets et revint dans les années quatre-vingt-dix.",
  "Что провозгласил Манифест 17 октября 1905 года?":
    "Qu'a proclamé le manifeste du 17 octobre 1905 ?",
  "Гражданские свободы и созыв Государственной думы":
    "Les libertés civiles et la convocation de la Douma d'État",
  "Отмену крепостного права": "L'abolition du servage",
  "Вступление в Первую мировую войну": "L'entrée dans la Première Guerre mondiale",
  "Введение конституции": "L'instauration d'une constitution",
  "Дума стала первым в русской истории выборным законодательным органом. Отдельной конституции при этом принято не было.":
    "La Douma fut le premier organe législatif élu de l'histoire russe. Aucune constitution distincte ne fut pourtant adoptée.",
  "Какая железная дорога связала Москву с Тихим океаном?":
    "Quel chemin de fer a relié Moscou au Pacifique ?",
  "Николаевская": "Le Nikolaïevski",
  "Транссибирская магистраль": "Le Transsibérien",
  "Турксиб": "Le Tourksib",
  "Байкало-Амурская магистраль": "Le Baïkal-Amour",
  "Транссиб, строительство которого началось в 1891 году. Турксиб построен в советское время, а БАМ — во второй половине XX века.":
    "Le Transsibérien, dont la construction a commencé en 1891. Le Tourksib est de l'époque soviétique, et le Baïkal-Amour de la seconde moitié du vingtième siècle.",
  "Сколько революций произошло в России в 1917 году?":
    "Combien de révolutions ont eu lieu en Russie en 1917 ?",
  "Ни одной: это была одна длинная революция": "Aucune : ce fut une seule longue révolution",
  "Февральская и Октябрьская, и между ними восемь месяцев. Первая свергла монархию, вторая сменила пришедшее ей на смену правительство.":
    "Celle de Février et celle d'Octobre, et huit mois entre les deux. La première a renversé la monarchie, la seconde a écarté le gouvernement qui lui avait succédé.",
  "Что такое двоевластие?": "Qu'est-ce que la dualité du pouvoir ?",
  "Одновременное существование Временного правительства и Советов":
    "L'existence simultanée du gouvernement provisoire et des soviets",
  "Разделение власти между царём и Думой": "Le partage du pouvoir entre le tsar et la Douma",
  "Правление двух императоров": "Le règne de deux empereurs",
  "Раздел страны между красными и белыми": "Le partage du pays entre les rouges et les blancs",
  "Правительство считало себя властью до Учредительного собрания, а за Советами стояли гарнизон и заводы. Ни одна из сторон не решалась ни выйти из войны, ни разделить землю.":
    "Le gouvernement se tenait pour le pouvoir jusqu'à l'Assemblée constituante, et derrière les soviets se tenaient la garnison et les usines. Aucun des deux camps n'osait sortir de la guerre ni partager la terre.",
  "Почему Октябрьскую революцию отмечали 7 ноября?":
    "Pourquoi fêtait-on la révolution d'Octobre le 7 novembre ?",
  "Так решили в 1930-е годы": "On en a décidé ainsi dans les années trente",
  "Из-за перехода с юлианского календаря на григорианский":
    "À cause du passage du calendrier julien au grégorien",
  "По решению II съезда Советов": "Par décision du deuxième congrès des soviets",
  "Из-за разницы часовых поясов": "À cause de la différence de fuseaux horaires",
  "25 октября по старому стилю — это 7 ноября по новому. Календарь сменили в 1918 году, а название события осталось прежним.":
    "Le 25 octobre de l'ancien style, c'est le 7 novembre du nouveau. Le calendrier a changé en 1918, mais le nom de l'événement est resté.",
  "Какие два декрета были приняты первыми после Октября?":
    "Quels deux décrets furent adoptés les premiers après Octobre ?",
  "О мире и о земле": "Celui sur la paix et celui sur la terre",
  "О труде и об образовании": "Celui sur le travail et celui sur l'instruction",
  "О церкви и о календаре": "Celui sur l'Église et celui sur le calendrier",
  "О национализации и о хлебе": "Celui sur les nationalisations et celui sur le pain",
  "Именно эти два вопроса Временное правительство откладывало восемь месяцев, и именно их ждала страна.":
    "Ce sont précisément ces deux questions que le gouvernement provisoire avait remises pendant huit mois, et que le pays attendait.",
  "Что произошло с Учредительным собранием?": "Qu'est-il advenu de l'Assemblée constituante ?",
  "Оно приняло конституцию": "Elle a adopté une constitution",
  "Оно было распущено в январе 1918 года после первого заседания":
    "Elle a été dissoute en janvier 1918 après sa première séance",
  "Выборы в него не состоялись": "Les élections n'ont pas eu lieu",
  "Оно работало до 1922 года": "Elle a siégé jusqu'en 1922",
  "Выборы прошли, но большевики получили меньшинство. Собрание распустили после первого же заседания.":
    "Les élections ont eu lieu, mais les bolcheviks n'y ont eu qu'une minorité. L'assemblée fut dissoute dès sa première séance.",
  "Чем обернулся для России Брестский мир?": "Que fut pour la Russie la paix de Brest-Litovsk ?",
  "Выходом из войны ценой огромных территорий":
    "Une sortie de la guerre au prix d'immenses territoires",
  "Присоединением новых земель": "Le rattachement de terres nouvelles",
  "Союзом с Германией": "Une alliance avec l'Allemagne",
  "Отсрочкой военных действий на год": "Une suspension des combats pour un an",
  "Мир подписан в марте 1918 года. Тогда же столица вернулась из Петрограда в Москву, а страна вступала в гражданскую войну.":
    "La paix fut signée en mars 1918. C'est alors aussi que la capitale revint de Petrograd à Moscou, tandis que le pays entrait en guerre civile.",
  "В какой город вернулась столица в 1918 году?":
    "Dans quelle ville la capitale est-elle revenue en 1918 ?",
  "В Петроград": "À Petrograd",
  "В Москву": "À Moscou",
  "В Киев": "À Kiev",
  "В Нижний Новгород": "À Nijni Novgorod",
  "Столица вернулась в Москву после двухсот с лишним лет в Петербурге. Причиной была близость фронта к прежней столице.":
    "La capitale est revenue à Moscou après plus de deux cents ans à Pétersbourg. La raison en était la proximité du front avec l'ancienne capitale.",
  "Где и когда была расстреляна царская семья?":
    "Où et quand la famille impériale a-t-elle été fusillée ?",
  "В Петрограде в 1917 году": "À Petrograd en 1917",
  "В Екатеринбурге в июле 1918 года": "À Iekaterinbourg en juillet 1918",
  "В Москве в 1919 году": "À Moscou en 1919",
  "В Тобольске в 1920 году": "À Tobolsk en 1920",
  "Останки были найдены и идентифицированы уже в конце XX века, а в 2000 году члены семьи причислены Русской православной церковью к лику святых.":
    "Les restes ont été retrouvés et identifiés seulement à la fin du vingtième siècle, et en 2000 les membres de la famille ont été canonisés par l'Église orthodoxe russe.",
  "Сколько лет длилась Гражданская война?": "Combien d'années a duré la guerre civile ?",
  "Два года": "Deux ans",
  "Около четырёх лет": "Environ quatre ans",
  "С 1918 по 1922 год. Против красных выступали белые армии, крестьянские восстания и войска иностранных держав.":
    "De 1918 à 1922. Contre les rouges se dressaient les armées blanches, les révoltes paysannes et les troupes de puissances étrangères.",
  "Сколько человек покинуло страну в результате революции и Гражданской войны?":
    "Combien de personnes ont quitté le pays du fait de la révolution et de la guerre civile ?",
  "Около ста тысяч": "Environ cent mille",
  "Около полумиллиона": "Environ un demi-million",
  "Около двух миллионов": "Environ deux millions",
  "Около десяти миллионов": "Environ dix millions",
  "Около двух миллионов: офицеры, учёные, инженеры, писатели. Уехал целый слой общества, и это сказалось на десятилетия вперёд.":
    "Environ deux millions : des officiers, des savants, des ingénieurs, des écrivains. C'est une couche entière de la société qui est partie, et cela s'est fait sentir des décennies durant.",
  "Что заменило продразвёрстку при новой экономической политике?":
    "Qu'est-ce qui a remplacé la réquisition des grains sous la nouvelle politique économique ?",
  "Налог": "Un impôt",
  "Полное освобождение от повинностей": "Une exemption complète de charges",
  "Карточки": "Des cartes de rationnement",
  "Барщина": "La corvée",
  "Продовольственный налог: крестьянин знал заранее, сколько отдаст, и остальное мог продать. Была разрешена торговля и мелкое частное предпринимательство.":
    "Un impôt en nature : le paysan savait d'avance ce qu'il donnerait et pouvait vendre le reste. Le commerce et la petite entreprise privée furent autorisés.",
  "Какие республики подписали договор об образовании СССР?":
    "Quelles républiques ont signé le traité fondant l'URSS ?",
  "РСФСР, Украина, Белоруссия и Закавказская федерация":
    "La RSFSR, l'Ukraine, la Biélorussie et la fédération de Transcaucasie",
  "Все пятнадцать союзных республик": "Les quinze républiques de l'Union",
  "РСФСР и Украина": "La RSFSR et l'Ukraine",
  "РСФСР, Украина, Белоруссия и Казахстан": "La RSFSR, l'Ukraine, la Biélorussie et le Kazakhstan",
  "Четыре подписанта в 1922 году. До пятнадцати республик Союз вырастет позже, в том числе за счёт разделения Закавказской федерации.":
    "Quatre signataires en 1922. L'Union montera plus tard à quinze républiques, entre autres par la division de la fédération de Transcaucasie.",
  "Что вызвало голод 1921–1922 годов в Поволжье?":
    "Qu'est-ce qui a causé la famine de 1921 et 1922 sur la Volga ?",
  "Неурожай на разорённой войной земле": "Une mauvaise récolte sur une terre ruinée par la guerre",
  "Массовая эмиграция крестьян": "L'émigration massive des paysans",
  "Эпидемия скота": "Une épizootie",
  "Закрытие границ": "La fermeture des frontières",
  "Хозяйство было подорвано войной и продразвёрсткой, а засуха довершила дело. Голод стал одной из причин перехода к новой экономической политике.":
    "L'économie était minée par la guerre et les réquisitions, et la sécheresse a fait le reste. La famine fut l'une des raisons du passage à la nouvelle politique économique.",
  "Что было свёрнуто в конце двадцатых годов?": "Qu'a-t-on abandonné à la fin des années vingt ?",
  "Новая экономическая политика": "La nouvelle politique économique",
  "Продразвёрстка": "La réquisition des grains",
  "Пятилетние планы": "Les plans quinquennaux",
  "НЭП свернули ради форсированной индустриализации. Военный коммунизм и продразвёрстка кончились раньше, в 1921 году.":
    "La nouvelle politique économique fut abandonnée au profit d'une industrialisation forcée. Le communisme de guerre et les réquisitions avaient pris fin plus tôt, en 1921.",
  "Какие из этих объектов построены в годы первых пятилеток?":
    "Lesquels de ces ouvrages ont été bâtis pendant les premiers plans quinquennaux ?",
  "Магнитка, Днепрогэс и Турксиб": "Magnitka (Magnitogorsk), le Dniéproguès et le Turksib",
  "Транссиб и Николаевская дорога": "Le Transsibérien et la ligne Nikolaïevskaïa",
  "Петербургский порт": "Le port de Saint-Pétersbourg",
  "За десятилетие страна из аграрной стала промышленной. Транссиб построен ещё в империи, а БАМ — во второй половине века.":
    "En une décennie, le pays est passé de l'agriculture à l'industrie. Le Transsibérien avait déjà été construit sous l'Empire, et la BAM le sera dans la seconde moitié du siècle.",
  "За счёт чего в основном финансировалась индустриализация?":
    "Comment l'industrialisation a-t-elle été financée pour l'essentiel ?",
  "За счёт иностранных займов": "Par des emprunts étrangers",
  "За счёт деревни, экспорта зерна и низких зарплат":
    "Par les campagnes, l'exportation de céréales et des salaires bas",
  "За счёт продажи колоний": "Par la vente de colonies",
  "За счёт золотого запаса империи": "Par les réserves d'or de l'Empire",
  "Средства брали внутри страны: у деревни через закупочные цены, у населения через зарплаты и займы. Это и связывает индустриализацию с коллективизацией.":
    "Les moyens ont été pris à l'intérieur du pays : aux campagnes par les prix d'achat, à la population par les salaires et les emprunts. C'est ce qui relie l'industrialisation à la collectivisation.",
  "Что такое коллективизация?": "Qu'est-ce que la collectivisation ?",
  "Объединение крестьянских хозяйств в колхозы":
    "Le regroupement des exploitations paysannes en kolkhozes",
  "Переселение горожан в деревню": "Le transfert des citadins vers les campagnes",
  "Раздача земли крестьянам": "La distribution des terres aux paysans",
  "Создание рабочих кооперативов в городах":
    "La création de coopératives ouvrières dans les villes",
  "Сплошная коллективизация началась в 1929 году и сопровождалась раскулачиванием — конфискацией имущества и высылкой зажиточных крестьян.":
    "La collectivisation intégrale a commencé en 1929 et s'est accompagnée de la dékoulakisation : confiscation des biens et déportation des paysans aisés.",
  "Какие регионы охватил голод 1932–1933 годов?":
    "Quelles régions la famine de 1932–1933 a-t-elle touchées ?",
  "Только Украину": "L'Ukraine seulement",
  "Украину, Поволжье, Казахстан, Северный Кавказ и Западную Сибирь":
    "L'Ukraine, la région de la Volga, le Kazakhstan, le Caucase du Nord et la Sibérie occidentale",
  "Только Сибирь": "La Sibérie seulement",
  "Прибалтику и Белоруссию": "Les pays baltes et la Biélorussie",
  "Голод затронул основные зерновые районы. Число погибших исчисляется миллионами; оценки расходятся, но порядок величины не оспаривается.":
    "La famine a frappé les principales régions céréalières. Le nombre de morts se compte en millions ; les estimations divergent, mais l'ordre de grandeur n'est pas contesté.",
  "Что такое раскулачивание?": "Qu'est-ce que la dékoulakisation ?",
  "Конфискация имущества и высылка зажиточных крестьян":
    "La confiscation des biens et la déportation des paysans aisés",
  "Освобождение крестьян от налогов": "L'exemption d'impôts accordée aux paysans",
  "Передача земли колхозам за выкуп": "La cession des terres aux kolkhozes contre rachat",
  "Перепись сельского населения": "Le recensement de la population rurale",
  "Сотни тысяч семей были отправлены в отдалённые районы страны, и многие погибли в дороге или в первые годы на новом месте.":
    "Des centaines de milliers de familles ont été envoyées dans des régions reculées du pays, et beaucoup sont mortes en route ou pendant les premières années sur place.",
  "Что строили заключённые ГУЛАГа?": "Que construisaient les détenus du Goulag ?",
  "Каналы, прииски, комбинаты за полярным кругом":
    "Des canaux, des mines d'or, des complexes industriels au-delà du cercle polaire",
  "Только дороги в европейской части": "Uniquement des routes dans la partie européenne",
  "Жильё в крупных городах": "Des logements dans les grandes villes",
  "Ничего: труд не использовался": "Rien : leur travail n'était pas utilisé",
  "Беломорканал, золотые прииски Колымы, Норильский комбинат. Принудительный труд был встроен в хозяйственные планы.":
    "Le canal de la mer Blanche, les mines d'or de la Kolyma, le combinat de Norilsk. Le travail forcé était inscrit dans les plans économiques.",
  "Что такое «тройки» в период Большого террора?":
    "Qu'étaient les « troïkas » pendant la Grande Terreur ?",
  "Внесудебные органы, выносившие приговоры":
    "Des organes extrajudiciaires qui prononçaient les peines",
  "Бригады на стройках пятилетки": "Des brigades sur les chantiers du plan quinquennal",
  "Комиссии по раскулачиванию": "Des commissions chargées de la dékoulakisation",
  "Отделения милиции": "Des commissariats de la milice",
  "Дела рассматривались без суда и защиты, приговоры выносились за минуты. Аресты при этом шли по спущенным сверху разнарядкам.":
    "Les affaires étaient examinées sans procès ni défense, les peines prononcées en quelques minutes. Les arrestations, elles, suivaient des quotas fixés d'en haut.",
  "На какие годы пришёлся пик массовых репрессий?":
    "En quelles années les répressions de masse ont-elles atteint leur sommet ?",
  "На 1929–1930": "En 1929–1930",
  "На 1932–1933": "En 1932–1933",
  "На 1937–1938": "En 1937–1938",
  "На 1945–1946": "En 1945–1946",
  "Большой террор 1937–1938 годов: несколько сотен тысяч расстрелянных по массовым операциям и столько же и более отправленных в лагеря.":
    "La Grande Terreur de 1937–1938 : plusieurs centaines de milliers de personnes fusillées lors des opérations de masse, et autant ou davantage envoyées dans les camps.",
  "Какие народы подверглись депортации в годы войны и после неё?":
    "Quels peuples ont été déportés pendant la guerre et après elle ?",
  "Поволжские немцы, крымские татары, чеченцы, ингуши, калмыки и другие":
    "Les Allemands de la Volga, les Tatars de Crimée, les Tchétchènes, les Ingouches, les Kalmouks et d'autres",
  "Только поволжские немцы": "Seulement les Allemands de la Volga",
  "Только народы Сибири": "Seulement les peuples de Sibérie",
  "Депортаций не было": "Il n'y a pas eu de déportations",
  "Целые народы были насильственно выселены с мест проживания. Многие погибли в пути или в первые годы на новом месте; возвращение началось только после 1956 года.":
    "Des peuples entiers ont été chassés de force de leurs lieux de vie. Beaucoup sont morts en chemin ou pendant les premières années sur place ; le retour n'a commencé qu'après 1956.",
  "Как была официально названа Конституция 1936 года?":
    "Comment la Constitution de 1936 a-t-elle été officiellement qualifiée ?",
  "Самой демократической в мире": "De plus démocratique du monde",
  "Временным основным законом": "De loi fondamentale provisoire",
  "Конституцией переходного периода": "De constitution de la période de transition",
  "Уставом Союза": "De statuts de l'Union",
  "Расхождение между её текстом и практикой тех же лет — наглядный пример того, почему конституция без работающих судов остаётся бумагой.":
    "L'écart entre son texte et la pratique de ces mêmes années montre bien pourquoi une constitution sans tribunaux qui fonctionnent reste du papier.",
  "Что началось после XX съезда партии в 1956 году?":
    "Qu'a-t-on entrepris après le XXe congrès du parti, en 1956 ?",
  "Реабилитация: пересмотр дел и восстановление доброго имени осуждённых":
    "La réhabilitation : la révision des dossiers et le rétablissement du bon nom des condamnés",
  "Новая волна арестов": "Une nouvelle vague d'arrestations",
  "Вторая коллективизация": "Une deuxième collectivisation",
  "Закрытие архивов": "La fermeture des archives",
  "На съезде прозвучал доклад о культе личности. Реабилитация шла волнами и продолжалась десятилетиями.":
    "Le congrès a entendu le rapport sur le culte de la personnalité. La réhabilitation s'est faite par vagues et s'est poursuivie pendant des décennies.",
  "Что было открыто в Москве в 2017 году?": "Qu'a-t-on inauguré à Moscou en 2017 ?",
  "«Стена скорби» — памятник жертвам политических репрессий":
    "Le « Mur de la douleur », monument aux victimes des répressions politiques",
  "Музей космонавтики": "Le musée de la Cosmonautique",
  "Мемориал защитникам Москвы": "Le mémorial aux défenseurs de Moscou",
  "Памятник Тысячелетию России": "Le monument du Millénaire de la Russie",
  "Государственный памятник жертвам репрессий. Работают также музеи и мемориальные комплексы на местах бывших лагерей и полигонов, включая Бутовский.":
    "Un monument d'État aux victimes des répressions. Des musées et des ensembles mémoriels existent aussi sur les sites d'anciens camps et champs de tir, dont celui de Boutovo.",
  "Чем Великая Отечественная война отличается по срокам от Второй мировой?":
    "En quoi la Grande Guerre patriotique diffère-t-elle de la Seconde Guerre mondiale par ses dates ?",
  "Ничем: это одно и то же": "En rien : c'est la même chose",
  "Она шла с 22 июня 1941 по 9 мая 1945 года, на советско-германском фронте":
    "Elle a duré du 22 juin 1941 au 9 mai 1945, sur le front germano-soviétique",
  "Она началась в 1939 году": "Elle a commencé en 1939",
  "Она закончилась в сентябре 1945 года": "Elle s'est terminée en septembre 1945",
  "Вторая мировая шла с 1939 по 1945 год. Великая Отечественная — та её часть, что велась на советско-германском фронте.":
    "La Seconde Guerre mondiale a duré de 1939 à 1945. La Grande Guerre patriotique en est la partie menée sur le front germano-soviétique.",
  "Когда была прорвана и снята блокада Ленинграда?":
    "Quand le blocus de Leningrad a-t-il été percé, puis levé ?",
  "В январе 1944 года": "En janvier 1944",
  "В декабре 1941 года": "En décembre 1941",
  "В феврале 1943 года": "En février 1943",
  "В мае 1945 года": "En mai 1945",
  "Блокада была полностью снята в январе 1944 года, продлившись почти девятьсот дней с сентября 1941-го.":
    "Le blocus a été entièrement levé en janvier 1944, après près de neuf cents jours commencés en septembre 1941.",
  "Какое сражение стало переломом в ходе войны?":
    "Quelle bataille a marqué le tournant de la guerre ?",
  "Сталинградская битва": "La bataille de Stalingrad",
  "Битва за Берлин": "La bataille de Berlin",
  "Окружение и капитуляция немецкой армии под Сталинградом зимой 1942–1943 годов. Летом 1943-го на Курской дуге инициатива закрепилась окончательно.":
    "L'encerclement et la capitulation de l'armée allemande devant Stalingrad, pendant l'hiver 1942–1943. À l'été 1943, sur le saillant de Koursk, l'initiative a définitivement changé de camp.",
  "Какими оцениваются потери СССР в войне?":
    "À combien estime-t-on les pertes de l'URSS pendant la guerre ?",
  "Около семи миллионов человек": "Environ sept millions de personnes",
  "Около двенадцати миллионов": "Environ douze millions",
  "Около двадцати семи миллионов": "Environ vingt-sept millions",
  "Около сорока миллионов": "Environ quarante millions",
  "Около двадцати семи миллионов, большую часть из которых составило мирное население. Это самые тяжёлые потери среди всех стран — участниц войны.":
    "Environ vingt-sept millions, dont la plus grande partie de civils. Ce sont les pertes les plus lourdes de tous les pays engagés dans la guerre.",
  "Какое место стало одним из известнейших символов Холокоста на оккупированной территории?":
    "Quel lieu est devenu l'un des symboles les plus connus de la Shoah en territoire occupé ?",
  "Бабий Яр": "Babi Yar",
  "Хатынь": "Khatyn",
  "Пискарёвское кладбище": "Le cimetière Piskariovskoïe",
  "Прохоровка": "Prokhorovka",
  "Бабий Яр под Киевом. Хатынь — сожжённая белорусская деревня, Пискарёвское кладбище — блокадный Ленинград, Прохоровка — Курская дуга.":
    "Babi Yar, près de Kiev. Khatyn est un village biélorusse incendié, le cimetière Piskariovskoïe rappelle le blocus de Leningrad, et Prokhorovka le saillant de Koursk.",
  "Что произошло в 1949 году?": "Que s'est-il passé en 1949 ?",
  "СССР испытал атомную бомбу": "L'URSS a fait exploser sa première bombe atomique",
  "Был запущен первый спутник": "Le premier satellite a été lancé",
  "Умер Сталин": "Staline est mort",
  "Началась война в Корее": "La guerre de Corée a commencé",
  "Испытание атомной бомбы и начало ядерного противостояния двух блоков. Спутник запустят в 1957 году, а Сталин умрёт в 1953-м.":
    "L'essai de la bombe atomique et le début de l'affrontement nucléaire entre les deux blocs. Le Spoutnik sera lancé en 1957, et Staline mourra en 1953.",
  "Как называют период после XX съезда партии?":
    "Comment appelle-t-on la période qui a suivi le XXe congrès du parti ?",
  "Застой": "La stagnation",
  "Оттепель": "Le dégel",
  "Оттепель: массовая реабилитация, возвращение людей из лагерей, ослабление цензуры. Застоем назовут следующие два десятилетия.":
    "Le dégel : réhabilitations massives, retour des gens des camps, relâchement de la censure. Les deux décennies suivantes s'appelleront la stagnation.",
  "Кто первым в мире совершил полёт в космос?":
    "Qui a été le premier homme au monde à voler dans l'espace ?",
  "Юрий Гагарин": "Iouri Gagarine",
  "Герман Титов": "Guerman Titov",
  "Алексей Леонов": "Alexeï Leonov",
  "Валентина Терешкова": "Valentina Terechkova",
  "12 апреля 1961 года. Титов полетел вторым, Леонов первым вышел в открытый космос, Терешкова стала первой женщиной-космонавтом.":
    "Le 12 avril 1961. Titov a volé en deuxième, Leonov a été le premier à sortir dans l'espace, et Terechkova la première femme cosmonaute.",
  "Чем закончился Карибский кризис 1962 года?":
    "Comment s'est terminée la crise des missiles de Cuba, en 1962 ?",
  "Взаимными уступками и первыми соглашениями об ограничении вооружений":
    "Par des concessions mutuelles et les premiers accords de limitation des armements",
  "Военным столкновением": "Par un affrontement militaire",
  "Разрывом отношений на десять лет": "Par une rupture des relations pendant dix ans",
  "Выходом СССР из ООН": "Par le retrait de l'URSS de l'ONU",
  "Кризис подвёл мир к грани ядерной войны и заставил обе стороны искать механизмы предотвращения: тогда же появилась прямая линия связи между Москвой и Вашингтоном.":
    "La crise a mené le monde au bord de la guerre nucléaire et a poussé les deux camps à chercher des mécanismes de prévention : c'est alors qu'est apparue la ligne directe entre Moscou et Washington.",
  "Сколько лет продолжалась война в Афганистане?":
    "Combien d'années a duré la guerre en Afghanistan ?",
  "Пятнадцать лет": "Quinze ans",
  "С 1979 по 1989 год. Она шла на фоне экономического застоя, и её итоги стали одним из факторов перемен второй половины восьмидесятых.":
    "De 1979 à 1989. Elle s'est déroulée sur fond de stagnation économique, et son bilan a été l'un des facteurs des changements de la seconde moitié des années quatre-vingt.",
  "Что было объявлено в 1985 году?": "Qu'a-t-on proclamé en 1985 ?",
  "Перестройка и гласность": "La perestroïka et la glasnost",
  "Первая пятилетка": "Le premier plan quinquennal",
  "С приходом Михаила Горбачёва открылись архивы, вернулись запрещённые книги, началось публичное обсуждение прошлого.":
    "Avec l'arrivée de Mikhaïl Gorbatchev, les archives se sont ouvertes, les livres interdits sont revenus et la discussion publique du passé a commencé.",
  "Что произошло 12 июня 1991 года?": "Que s'est-il passé le 12 juin 1991 ?",
  "Были подписаны Беловежские соглашения": "Les accords de Belovej ont été signés",
  "Прошли первые прямые выборы Президента РСФСР":
    "La première élection directe du président de la RSFSR a eu lieu",
  "Была принята Декларация о суверенитете": "La Déclaration de souveraineté a été adoptée",
  "Провалилась попытка государственного переворота": "La tentative de coup d'État a échoué",
  "Победил Борис Ельцин. Декларация о суверенитете принята ровно годом раньше, а Беловежские соглашения подписаны 8 декабря того же года.":
    "Boris Eltsine l'a emporté. La Déclaration de souveraineté avait été adoptée exactement un an plus tôt, et les accords de Belovej seront signés le 8 décembre de la même année.",
  "Что произошло в России в 1998 году?": "Que s'est-il passé en Russie en 1998 ?",
  "Дефолт": "Le défaut de paiement",
  "Деноминация рубля и рост экономики": "La dénomination du rouble et la croissance de l'économie",
  "Вступление в Совет Европы": "L'adhésion au Conseil de l'Europe",
  "Государство отказалось платить по краткосрочным обязательствам, рубль обесценился в несколько раз. Через год начался экономический рост, продолжавшийся почти десятилетие.":
    "L'État a cessé d'honorer ses obligations à court terme et le rouble a perdu plusieurs fois sa valeur. Un an plus tard commençait une croissance économique qui a duré près de dix ans.",
  "Какую примерно долю земной суши занимает Россия?":
    "Quelle part des terres émergées la Russie occupe-t-elle à peu près ?",
  "Около одной двадцатой": "Environ un vingtième",
  "Около одной восьмой": "Environ un huitième",
  "Около четверти": "Environ un quart",
  "Свыше семнадцати миллионов квадратных километров — около одной восьмой всей суши планеты. Это делает Россию крупнейшей страной мира.":
    "Plus de dix-sept millions de kilomètres carrés, soit environ un huitième des terres émergées de la planète. C'est ce qui fait de la Russie le plus grand pays du monde.",
  "Какова протяжённость страны с запада на восток?":
    "Quelle est l'étendue du pays d'ouest en est ?",
  "Около трёх тысяч километров": "Environ trois mille kilomètres",
  "Около пяти тысяч": "Environ cinq mille",
  "Почти десять тысяч": "Presque dix mille",
  "Около двадцати тысяч": "Environ vingt mille",
  "Почти десять тысяч километров, при четырёх тысячах с севера на юг. Отсюда и одиннадцать часовых поясов.":
    "Presque dix mille kilomètres, contre quatre mille du nord au sud. D'où les onze fuseaux horaires.",
  "Какая доля населения живёт в европейской части страны?":
    "Quelle part de la population vit dans la partie européenne du pays ?",
  "Около половины": "Environ la moitié",
  "Около трёх четвертей": "Environ trois quarts",
  "Почти всё население": "Presque toute la population",
  "Около трёх четвертей населения — при том что три четверти территории лежат в Азии. Этот разрыв — одна из главных особенностей российской географии.":
    "Environ trois quarts de la population, alors que trois quarts du territoire se trouvent en Asie. Ce décalage est l'un des traits majeurs de la géographie russe.",
  "Какова разница во времени между Москвой и Камчаткой?":
    "Quel est le décalage horaire entre Moscou et le Kamtchatka ?",
  "Три часа": "Trois heures",
  "Шесть часов": "Six heures",
  "Девять часов": "Neuf heures",
  "Девять часов: когда в Москве девять утра, на Камчатке уже вечер. Всего страна занимает одиннадцать часовых поясов.":
    "Neuf heures : quand il est neuf heures du matin à Moscou, c'est déjà le soir au Kamtchatka. Le pays couvre en tout onze fuseaux horaires.",
  "Что изменилось в российском времяисчислении в 2014 году?":
    "Qu'est-ce qui a changé dans la mesure du temps en Russie en 2014 ?",
  "Вернулись одиннадцать часовых поясов и прекратился перевод часов":
    "Les onze fuseaux horaires sont revenus et le changement d'heure a cessé",
  "Страна перешла на единое время": "Le pays est passé à une heure unique",
  "Было введено летнее время": "L'heure d'été a été instaurée",
  "Калининград перешёл на московское время": "Kaliningrad est passée à l'heure de Moscou",
  "С 2010 по 2014 год поясов было девять. Сезонного перевода часов в России с тех пор нет, и разница с Европой меняется дважды в год за счёт соседей.":
    "De 2010 à 2014, il n'y a eu que neuf fuseaux. Depuis, la Russie ne change plus d'heure au fil des saisons, et l'écart avec l'Europe varie deux fois par an du fait des voisins.",
  "Со сколькими государствами Россия имеет сухопутную границу?":
    "Avec combien d'États la Russie a-t-elle une frontière terrestre ?",
  "С восемью": "Avec huit",
  "С одиннадцатью": "Avec onze",
  "С четырнадцатью": "Avec quatorze",
  "С двадцатью": "Avec vingt",
  "С четырнадцатью — по этому показателю Россия делит первое место в мире с Китаем. Морские соседи, США и Япония, в это число не входят.":
    "Avec quatorze : sur ce point, la Russie partage la première place mondiale avec la Chine. Les voisins maritimes, les États-Unis et le Japon, ne sont pas comptés.",
  "Через какой пролив проходит морская граница с США?":
    "Par quel détroit passe la frontière maritime avec les États-Unis ?",
  "Через Берингов": "Par le détroit de Béring",
  "Через Лаперуза": "Par le détroit de La Pérouse",
  "Через Керченский": "Par le détroit de Kertch",
  "Через Татарский": "Par le détroit de Tartarie",
  "Берингов пролив: между островами Ратманова и Крузенштерна около четырёх километров. Пролив Лаперуза отделяет Сахалин от Хоккайдо.":
    "Le détroit de Béring : environ quatre kilomètres séparent l'île Ratmanov de l'île Krusenstern. Le détroit de La Pérouse, lui, sépare Sakhaline de Hokkaïdo.",
  "Какими государствами и морем окружена Калининградская область?":
    "Par quels États et quelle mer l'oblast de Kaliningrad est-il entouré ?",
  "Польшей, Литвой и Балтийским морем": "Par la Pologne, la Lituanie et la mer Baltique",
  "Белоруссией и Латвией": "Par la Biélorussie et la Lettonie",
  "Финляндией и Эстонией": "Par la Finlande et l'Estonie",
  "Только Польшей": "Par la Pologne seulement",
  "Область не имеет сухопутной связи с остальной страной, то есть является эксклавом. Это единственный такой регион в России.":
    "L'oblast n'a aucune liaison terrestre avec le reste du pays : c'est une exclave. C'est la seule région de ce genre en Russie.",
  "Какая точка является самой северной материковой точкой России?":
    "Quel est le point continental le plus septentrional de la Russie ?",
  "Мыс Челюскин": "Le cap Tcheliouskine",
  "Мыс Дежнёва": "Le cap Dejnev",
  "Остров Ратманова": "L'île Ratmanov",
  "Гора Базардюзю": "Le mont Bazardüzü",
  "Мыс Челюскин на Таймыре. Базардюзю — самая южная точка, а остров Ратманова — самая восточная.":
    "Le cap Tcheliouskine, sur la presqu'île de Taïmyr. Le Bazardüzü est le point le plus méridional, et l'île Ratmanov le plus oriental.",
  "Почему линии часовых поясов на карте России не идут по меридианам?":
    "Pourquoi les limites des fuseaux horaires, sur la carte de la Russie, ne suivent-elles pas les méridiens ?",
  "Из-за рельефа": "À cause du relief",
  "Потому что время устанавливается для каждого субъекта Федерации отдельно":
    "Parce que l'heure est fixée séparément pour chaque sujet de la Fédération",
  "Из-за международных соглашений": "À cause d'accords internationaux",
  "Они идут строго по меридианам": "Elles suivent strictement les méridiens",
  "Пояс определяется административной границей, а не географической долготой. Поэтому карта времени повторяет карту регионов.":
    "Le fuseau est déterminé par la frontière administrative, et non par la longitude géographique. La carte de l'heure reprend donc la carte des régions.",
  "Какова примерная численность населения России?":
    "Quelle est la population approximative de la Russie ?",
  "Около 90 миллионов": "Environ 90 millions",
  "Около 146 миллионов": "Environ 146 millions",
  "Около 200 миллионов": "Environ 200 millions",
  "Около 300 миллионов": "Environ 300 millions",
  "Около ста сорока шести миллионов человек, распределённых крайне неравномерно: густо на юго-западе и вдоль Транссиба, почти пусто на севере Сибири.":
    "Environ cent quarante-six millions d'habitants, répartis de façon très inégale : densément au sud-ouest et le long du Transsibérien, presque personne dans le nord de la Sibérie.",
  "Где в России первыми встречают Новый год?": "Où fête-t-on le Nouvel An en premier en Russie ?",
  "В Калининграде": "À Kaliningrad",
  "На Камчатке и Чукотке": "Au Kamtchatka et en Tchoukotka",
  "На востоке страны, где время опережает московское на девять часов. Калининград, наоборот, встречает его последним — там на час меньше московского.":
    "Dans l'est du pays, où l'heure devance celle de Moscou de neuf heures. Kaliningrad, à l'inverse, le fête en dernier : il y est une heure plus tôt qu'à Moscou.",
  "Какой регион является самым западным?": "Quelle est la région la plus occidentale ?",
  "Псковская область": "L'oblast de Pskov",
  "Ленинградская область": "L'oblast de Leningrad",
  "Республика Карелия": "La République de Carélie",
  "Калининградская область, которая к тому же единственный российский регион с временем на час меньше московского.":
    "L'oblast de Kaliningrad, qui est de plus la seule région russe dont l'heure est en retard d'une heure sur celle de Moscou.",
  "Какая природная зона занимает наибольшую площадь в России?":
    "Quelle zone naturelle occupe la plus grande superficie en Russie ?",
  "Тундра": "La toundra",
  "Тайга": "La taïga",
  "Степь": "La steppe",
  "Полупустыня": "Le semi-désert",
  "Тайга — крупнейший лесной массив планеты. На Россию приходится около пятой части всех лесов мира.":
    "La taïga, le plus vaste massif forestier de la planète. La Russie abrite environ un cinquième de toutes les forêts du monde.",
  "Какую долю мировых лесов занимают леса России?":
    "Quelle part des forêts mondiales les forêts russes représentent-elles ?",
  "Около одной пятой": "Environ un cinquième",
  "Около пятой части, и по площади лесов страна занимает первое место в мире.":
    "Environ un cinquième : par la superficie forestière, le pays occupe la première place mondiale.",
  "Почему в северных городах дома строят на сваях?":
    "Pourquoi bâtit-on les maisons sur pilotis dans les villes du Nord ?",
  "Из-за паводков": "À cause des crues",
  "Чтобы тепло здания не растопило вечную мерзлоту под ним":
    "Pour que la chaleur du bâtiment ne fasse pas fondre le pergélisol qui se trouve dessous",
  "Из-за сильных ветров": "À cause des vents violents",
  "Так дешевле строить": "Parce que c'est moins cher à construire",
  "Растаявший грунт теряет несущую способность, и здание проседает. Сваи поднимают дом, оставляя между ним и землёй продуваемый зазор.":
    "Un sol dégelé perd sa capacité portante et le bâtiment s'affaisse. Les pilotis soulèvent la maison et laissent entre elle et le sol un espace ventilé.",
  "Какая река является самой длинной в Европе?": "Quel est le fleuve le plus long d'Europe ?",
  "Дунай": "Le Danube",
  "Волга": "La Volga",
  "Днепр": "Le Dniepr",
  "Дон": "Le Don",
  "Волга, около трёх с половиной тысяч километров. Она впадает не в океан, а в Каспийское море — крупнейший замкнутый водоём планеты.":
    "La Volga, environ trois mille cinq cents kilomètres. Elle ne se jette pas dans un océan mais dans la mer Caspienne, le plus grand plan d'eau fermé de la planète.",
  "Какая из сибирских рек самая полноводная?":
    "Lequel des fleuves sibériens a le plus fort débit ?",
  "Обь": "L'Ob",
  "Енисей": "L'Ienisseï",
  "Лена": "La Léna",
  "Амур": "L'Amour",
  "Енисей. Все три великие сибирские реки текут на север, а Амур на Дальнем Востоке течёт на восток, и по нему частично проходит граница с Китаем.":
    "L'Ienisseï. Les trois grands fleuves sibériens coulent vers le nord, tandis que l'Amour, en Extrême-Orient, coule vers l'est et porte en partie la frontière avec la Chine.",
  "Какова глубина Байкала?": "Quelle est la profondeur du Baïkal ?",
  "642 метра": "642 mètres",
  "1042 метра": "1042 mètres",
  "1642 метра": "1642 mètres",
  "2642 метра": "2642 mètres",
  "1642 метра — самое глубокое озеро мира. В нём сосредоточено около пятой части мировых запасов поверхностной пресной воды.":
    "1642 mètres : c'est le lac le plus profond du monde. Il concentre environ un cinquième des réserves mondiales d'eau douce de surface.",
  "Какое озеро является крупнейшим пресноводным в Европе?":
    "Quel est le plus grand lac d'eau douce d'Europe ?",
  "Чудское": "Le lac Peïpous",
  "Ладожское. Байкал глубже и больше по объёму, но находится в Азии, а Каспий — солёный и замкнутый.":
    "Le lac Ladoga. Le Baïkal est plus profond et plus vaste en volume, mais il se trouve en Asie, et la Caspienne est salée et fermée.",
  "Какой хребет разделяет Европу и Азию и богат рудами?":
    "Quelle chaîne sépare l'Europe de l'Asie et regorge de minerais ?",
  "Алтай": "L'Altaï",
  "Саяны": "Les Saïanes",
  "Урал — древний и невысокий хребет. На его рудах выросла уральская промышленность ещё в петровское время.":
    "L'Oural, une chaîne ancienne et peu élevée. Sur ses minerais est née l'industrie de l'Oural, dès l'époque de Pierre le Grand.",
  "Какой вулкан является высочайшим действующим вулканом Евразии?":
    "Quel est le plus haut volcan en activité d'Eurasie ?",
  "Казбек": "Le Kazbek",
  "Авачинская Сопка": "L'Avatchinskaïa Sopka",
  "Ключевская Сопка на Камчатке. Эльбрус и Казбек — потухшие вулканы Кавказа, а Эльбрус вдобавок высшая точка России.":
    "La Klioutchevskaïa Sopka, au Kamtchatka. L'Elbrouz et le Kazbek sont des volcans éteints du Caucase, et l'Elbrouz est de surcroît le point culminant de la Russie.",
  "Какой климат преобладает в Сибири?": "Quel climat domine en Sibérie ?",
  "Морской": "Le climat océanique",
  "Резко континентальный": "Le climat continental extrême",
  "Субтропический": "Le climat subtropical",
  "Муссонный": "Le climat de mousson",
  "Резко континентальный: очень холодная зима и жаркое лето, разница между ними доходит до шестидесяти градусов. Муссонный климат — на Дальнем Востоке.":
    "Le climat continental extrême : un hiver très froid et un été chaud, l'écart entre les deux atteignant soixante degrés. Le climat de mousson, lui, règne en Extrême-Orient.",
  "Какие населённые пункты оспаривают звание полюса холода Северного полушария?":
    "Quelles localités se disputent le titre de pôle du froid de l'hémisphère Nord ?",
  "Норильск и Мурманск": "Norilsk et Mourmansk",
  "Оймякон и Верхоянск": "Oïmiakon et Verkhoïansk",
  "Воркута и Салехард": "Vorkouta et Salekhard",
  "Якутск и Магадан": "Iakoutsk et Magadan",
  "Оба в Якутии, и там фиксировали температуры около минус шестидесяти семи градусов. В тот же январский день в Сочи может быть плюс десять.":
    "Toutes deux en Iakoutie, où l'on a relevé des températures d'environ moins soixante-sept degrés. Le même jour de janvier, il peut faire plus dix à Sotchi.",
  "Где в России субтропический климат?": "Où trouve-t-on un climat subtropical en Russie ?",
  "На побережье Чёрного моря около Сочи": "Sur la côte de la mer Noire, autour de Sotchi",
  "На юге Сибири": "Dans le sud de la Sibérie",
  "На Камчатке": "Au Kamtchatka",
  "Узкая полоса черноморского побережья, защищённая с севера горами. Это единственная субтропическая зона страны.":
    "Une bande étroite de la côte de la mer Noire, protégée au nord par les montagnes. C'est la seule zone subtropicale du pays.",
  "Куда заносятся редкие и исчезающие виды?": "Où inscrit-on les espèces rares et menacées ?",
  "В Красную книгу": "Au Livre rouge",
  "В Зелёную книгу": "Au Livre vert",
  "В реестр заповедников": "Au registre des réserves naturelles",
  "В список ЮНЕСКО": "Sur la liste de l'UNESCO",
  "В Красную книгу. Среди самых известных её обитателей — амурский тигр, белый медведь, зубр и дальневосточный леопард.":
    "Au Livre rouge. Parmi ses hôtes les plus connus figurent le tigre de l'Amour, l'ours blanc, le bison d'Europe et le léopard de l'Amour.",
  "Какая статья Конституции содержит перечень субъектов Федерации?":
    "Quel article de la Constitution contient la liste des sujets de la Fédération ?",
  "Статья 5": "L'article 5",
  "Статья 65": "L'article 65",
  "Статья 71": "L'article 71",
  "Статья 73": "L'article 73",
  "Статья 65. Статья 5 говорит о равноправии субъектов, а 71 и 73 распределяют предметы ведения.":
    "L'article 65. L'article 5 pose l'égalité en droits des sujets, tandis que les articles 71 et 73 répartissent les compétences.",
  "Какой вид субъекта Федерации самый многочисленный?":
    "Quelle sorte de sujet de la Fédération est la plus nombreuse ?",
  "Область": "L'oblast",
  "Автономный округ": "Le district autonome",
  "Области, вместе с краями, составляют большинство субъектов. Автономная область при этом всего одна — Еврейская.":
    "Les oblasts, avec les kraïs, forment la majorité des sujets. Il n'existe en revanche qu'un seul oblast autonome, celui des Juifs.",
  "Какие города являются самостоятельными субъектами Федерации?":
    "Quelles villes sont des sujets de la Fédération à part entière ?",
  "Москва, Санкт-Петербург и Севастополь": "Moscou, Saint-Pétersbourg et Sébastopol",
  "Только Москва": "Moscou seulement",
  "Москва, Санкт-Петербург и Новосибирск": "Moscou, Saint-Pétersbourg et Novossibirsk",
  "Все города-миллионники": "Toutes les villes de plus d'un million d'habitants",
  "Города федерального значения — отдельный вид субъекта. Новосибирск, несмотря на размер, входит в состав Новосибирской области.":
    "Les villes de rang fédéral forment une sorte de sujet à part. Novossibirsk, malgré sa taille, fait partie de l'oblast de Novossibirsk.",
  "Сколько автономных областей в составе России?":
    "Combien d'oblasts autonomes la Russie compte-t-elle ?",
  "Двадцать четыре": "Vingt-quatre",
  "Одна — Еврейская автономная область. Автономных округов несколько, и это другой вид субъекта.":
    "Un seul : l'oblast autonome des Juifs. Les districts autonomes, eux, sont plusieurs, et c'est une autre sorte de sujet.",
  "Какой документ является основным для края или области?":
    "Quel document tient lieu de texte fondamental pour un kraï ou un oblast ?",
  "Конституция": "La constitution",
  "Устав": "Le statut",
  "Договор с Федерацией": "Un traité avec la Fédération",
  "Регламент": "Le règlement intérieur",
  "Устав. Конституция есть только у республик, и это одно из двух отличий, наряду с правом устанавливать государственные языки.":
    "Le statut. Seules les républiques ont une constitution, et c'est l'une des deux différences, avec le droit d'établir des langues officielles.",
  "Какие языки являются государственными в Татарстане?":
    "Quelles langues sont officielles au Tatarstan ?",
  "Только русский": "Le russe seulement",
  "Русский и татарский": "Le russe et le tatar",
  "Только татарский": "Le tatar seulement",
  "Русский, татарский и башкирский": "Le russe, le tatar et le bachkir",
  "Республики вправе устанавливать свои государственные языки наряду с русским. Так же устроено в Якутии с якутским и в Башкортостане с башкирским.":
    "Les républiques ont le droit d'établir leurs langues officielles à côté du russe. Il en va de même en Iakoutie avec le iakoute et au Bachkortostan avec le bachkir.",
  "Что относится к исключительному ведению Федерации по статье 71?":
    "Qu'est-ce qui relève de la compétence exclusive de la Fédération selon l'article 71 ?",
  "Оборона, внешняя политика, гражданство, денежная эмиссия":
    "La défense, la politique étrangère, la nationalité, l'émission de monnaie",
  "Образование и здравоохранение": "L'éducation et la santé",
  "Благоустройство городов": "L'aménagement des villes",
  "Природопользование": "L'exploitation des ressources naturelles",
  "Здесь субъекты не законодательствуют вовсе. Образование, здравоохранение и природопользование относятся к совместному ведению по статье 72.":
    "Là, les sujets ne légifèrent pas du tout. L'éducation, la santé et l'exploitation des ressources naturelles relèvent de la compétence partagée, selon l'article 72.",
  "Что говорит статья 73 о полномочиях субъектов?":
    "Que dit l'article 73 des compétences des sujets ?",
  "Субъекты обладают всей полнотой власти вне ведения Федерации и совместного ведения":
    "Les sujets détiennent la plénitude du pouvoir en dehors des compétences de la Fédération et des compétences partagées",
  "Субъекты действуют только по прямому поручению центра":
    "Les sujets n'agissent que sur mandat direct du centre",
  "Полномочия субъектов перечислены отдельным списком":
    "Les compétences des sujets sont énumérées dans une liste distincte",
  "Субъекты не обладают собственными полномочиями": "Les sujets n'ont pas de compétences propres",
  "Перечисляется то, что забирает центр; остальное остаётся регионам. Та же логика лежит в основе испанского и немецкого федерализма.":
    "On énumère ce que prend le centre ; le reste demeure aux régions. La même logique fonde le fédéralisme espagnol et le fédéralisme allemand.",
  "Как может называться законодательный орган субъекта?":
    "Comment peut s'appeler l'organe législatif d'un sujet ?",
  "Только думой": "Uniquement douma",
  "Думой, советом, хуралом, курултаем и иначе":
    "Douma, soviet, khoural, kouroultaï, et d'autres noms encore",
  "Только собранием": "Uniquement assemblée",
  "Название одинаково во всех субъектах": "Le nom est le même dans tous les sujets",
  "Название выбирает сам субъект, и в нём часто отражается язык и традиция региона: Хурал в Бурятии и Калмыкии, Курултай в Башкортостане.":
    "Le sujet choisit lui-même le nom, et celui-ci reflète souvent la langue et la tradition de la région : Khoural en Bouriatie et en Kalmoukie, Kouroultaï au Bachkortostan.",
  "Сколько федеральных округов в России?":
    "Combien de districts fédéraux la Russie compte-t-elle ?",
  "Восемь. Они введены указом Президента в 2000 году, в Конституции не упомянуты и субъектами Федерации не являются.":
    "Huit. Ils ont été créés par décret du Président en 2000, ne sont pas mentionnés dans la Constitution et ne sont pas des sujets de la Fédération.",
  "Что происходило при укрупнении регионов в 2000-е годы?":
    "Que s'est-il passé lors du regroupement des régions dans les années 2000 ?",
  "Автономные округа объединялись с краями и областями через референдум":
    "Des districts autonomes ont fusionné avec des kraïs et des oblasts par référendum",
  "Области делились на более мелкие": "Les oblasts étaient découpés en unités plus petites",
  "Создавались новые республики": "De nouvelles républiques étaient créées",
  "Субъекты переходили в другие федеральные округа":
    "Des sujets passaient dans d'autres districts fédéraux",
  "Каждое объединение проходило через референдум в обоих регионах, и число субъектов сократилось. Это единственный способ изменить состав Федерации изнутри.":
    "Chaque fusion est passée par un référendum dans les deux régions, et le nombre de sujets a diminué. C'est le seul moyen de modifier de l'intérieur la composition de la Fédération.",
  "Что говорит статья 5 об отношениях субъектов с федеральными органами?":
    "Que dit l'article 5 des rapports des sujets avec les organes fédéraux ?",
  "Субъекты равноправны": "Les sujets sont égaux en droits",
  "Республики имеют преимущество": "Les républiques ont la priorité",
  "Города федерального значения имеют преимущество": "Les villes de rang fédéral ont la priorité",
  "Порядок определяется отдельным договором для каждого":
    "L'ordre est fixé par un traité distinct pour chacun",
  "Равноправие закреплено прямо, при том что исторические названия и объём собственных институтов различаются. Равенство здесь — о положении, а не об устройстве.":
    "L'égalité en droits est inscrite noir sur blanc, alors même que les noms hérités et l'étendue des institutions propres diffèrent. L'égalité porte ici sur la position, non sur l'organisation.",
  "По какому признаку выделялись автономные округа?":
    "Sur quel critère les districts autonomes ont-ils été découpés ?",
  "По территориям коренных народов Севера": "Sur les territoires des peuples autochtones du Nord",
  "По численности населения": "Sur le nombre d'habitants",
  "По границам федеральных округов": "Sur les limites des districts fédéraux",
  "По уровню промышленного развития": "Sur le niveau de développement industriel",
  "Некоторые из них до сих пор входят в состав области, оставаясь при этом самостоятельными субъектами Федерации — редкая конструкция даже среди федераций.":
    "Certains font aujourd'hui encore partie d'un oblast tout en restant des sujets de la Fédération à part entière : une construction rare, même parmi les fédérations.",
  "Какой город является крупнейшим в Европе по населению?":
    "Quelle est la ville la plus peuplée d'Europe ?",
  "Лондон": "Londres",
  "Париж": "Paris",
  "Москва": "Moscou",
  "Стамбул": "Istanbul",
  "Москва, около тринадцати миллионов жителей. Стамбул больше, но лежит преимущественно в азиатской части.":
    "Moscou, environ treize millions d'habitants. Istanbul est plus grande, mais s'étend surtout sur la partie asiatique.",
  "В каком году открылось московское метро?":
    "En quelle année le métro de Moscou a-t-il été inauguré ?",
  "В 1917 году": "En 1917",
  "В 1935 году": "En 1935",
  "В 1947 году": "En 1947",
  "В 1961 году": "En 1961",
  "1935 год. Оформление станций первых очередей — часть архитектурного наследия города, и некоторые из них охраняются как памятники.":
    "1935. La décoration des stations des premières tranches fait partie du patrimoine architectural de la ville, et certaines sont protégées comme monuments.",
  "Какой музей Санкт-Петербурга входит в число крупнейших в мире?":
    "Quel musée de Saint-Pétersbourg compte parmi les plus grands du monde ?",
  "Третьяковская галерея": "La galerie Tretiakov",
  "Эрмитаж": "L'Ermitage",
  "Русский музей": "Le Musée russe",
  "Кунсткамера": "La Kounstkamera",
  "Эрмитаж, размещённый в Зимнем дворце и соседних зданиях. Третьяковская галерея находится в Москве.":
    "L'Ermitage, installé dans le Palais d'Hiver et les bâtiments voisins. La galerie Tretiakov, elle, se trouve à Moscou.",
  "Что такое белые ночи?": "Que sont les nuits blanches ?",
  "Период, когда ночью почти не темнеет из-за северной широты":
    "La période où il ne fait presque pas nuit, du fait de la latitude nordique",
  "Зимние праздники в Петербурге": "Les fêtes d'hiver à Saint-Pétersbourg",
  "Название фестиваля искусств": "Le nom d'un festival des arts",
  "Ночные экскурсии по разводным мостам": "Des visites nocturnes des ponts levants",
  "В июне в Петербурге сумерки не переходят в настоящую ночь. На этом строится летний туристический сезон города.":
    "En juin, à Saint-Pétersbourg, le crépuscule ne devient jamais une vraie nuit. C'est là-dessus que repose la saison touristique estivale de la ville.",
  "Сколько примерно в России городов-миллионников?":
    "Combien la Russie compte-t-elle à peu près de villes de plus d'un million d'habitants ?",
  "Около шестнадцати": "Environ seize",
  "Около тридцати": "Environ trente",
  "Более пятидесяти": "Plus de cinquante",
  "Около шестнадцати, считая обе столицы. Крупнейшие после них — Новосибирск, Екатеринбург, Казань и Нижний Новгород.":
    "Environ seize, en comptant les deux capitales. Les plus grandes après elles sont Novossibirsk, Iekaterinbourg, Kazan et Nijni Novgorod.",
  "Какой город является третьим по населению в стране?":
    "Quelle est la troisième ville du pays par la population ?",
  "Нижний Новгород": "Nijni Novgorod",
  "Новосибирск, выросший вокруг моста Транссиба через Обь. Рядом с ним находится Академгородок — крупный научный центр.":
    "Novossibirsk, née autour du pont du Transsibérien sur l'Ob. Tout près se trouve Akademgorodok, un grand centre scientifique.",
  "Чем известен казанский кремль?": "Pourquoi le kremlin de Kazan est-il connu ?",
  "Мечетью и православным собором внутри одной стены":
    "Pour une mosquée et une cathédrale orthodoxe à l'intérieur d'une même enceinte",
  "Самой высокой башней страны": "Pour la plus haute tour du pays",
  "Тем, что построен в XIX веке": "Parce qu'il a été construit au XIXe siècle",
  "Тем, что в нём находится резиденция Президента России":
    "Parce qu'il abrite la résidence du Président de la Russie",
  "Ансамбль внесён в список Всемирного наследия ЮНЕСКО именно как памятник сосуществования двух традиций в одном городе.":
    "L'ensemble est inscrit au patrimoine mondial de l'UNESCO précisément comme témoin de la coexistence de deux traditions dans une même ville.",
  "Какой город является конечной точкой Транссиба?":
    "Quelle ville est le terminus du Transsibérien ?",
  "Хабаровск": "Khabarovsk",
  "Иркутск": "Irkoutsk",
  "Чита": "Tchita",
  "Владивосток, главный порт на Тихом океане. Время там опережает московское на семь часов.":
    "Vladivostok, le principal port sur l'océan Pacifique. L'heure y devance celle de Moscou de sept heures.",
  "Какова длина Транссибирской магистрали от Москвы до Владивостока?":
    "Quelle est la longueur du Transsibérien de Moscou à Vladivostok ?",
  "5288 километров": "5288 kilomètres",
  "7288 километров": "7288 kilomètres",
  "9288 километров": "9288 kilomètres",
  "12 288 километров": "12 288 kilomètres",
  "9288 километров и семь часовых поясов — самая длинная железная дорога в мире. Поезд идёт около шести суток.":
    "9288 kilomètres et sept fuseaux horaires : la plus longue ligne de chemin de fer du monde. Le train met environ six jours.",
  "Какие города входят в Золотое кольцо?": "Quelles villes font partie de l'Anneau d'or ?",
  "Владимир, Суздаль, Ярославль, Кострома и другие города северо-востока":
    "Vladimir, Souzdal, Iaroslavl, Kostroma et d'autres villes du nord-est",
  "Города-миллионники европейской части":
    "Les villes de plus d'un million d'habitants de la partie européenne",
  "Города Транссиба": "Les villes du Transsibérien",
  "Города Золотой Орды": "Les villes de la Horde d'or",
  "Это те земли, из которых выросло Московское государство. Белокаменные соборы XII века стоят там до сих пор.":
    "Ce sont les terres mêmes d'où est sorti l'État de Moscou. Les cathédrales de pierre blanche du XIIe siècle y sont encore debout.",
  "За что присваивалось звание города-героя?":
    "Pour quoi le titre de ville héroïne était-il décerné ?",
  "За оборону в годы Великой Отечественной войны":
    "Pour la défense pendant la Grande Guerre patriotique",
  "За промышленные достижения": "Pour des réussites industrielles",
  "За древность города": "Pour l'ancienneté de la ville",
  "За вклад в освоение космоса": "Pour la contribution à la conquête de l'espace",
  "В нынешних границах России это Волгоград, Санкт-Петербург, Москва, Мурманск, Смоленск, Тула и Новороссийск. Позже появилось звание города воинской славы.":
    "Dans les frontières actuelles de la Russie, ce sont Volgograd, Saint-Pétersbourg, Moscou, Mourmansk, Smolensk, Toula et Novorossiisk. Plus tard est apparu le titre de ville de gloire militaire.",
  "Что такое наукоград?": "Qu'est-ce qu'une cité scientifique ?",
  "Город, построенный вокруг научных институтов":
    "Une ville bâtie autour d'instituts scientifiques",
  "Город с ограниченным въездом": "Une ville dont l'accès est restreint",
  "Университетский квартал": "Un quartier universitaire",
  "Технопарк при заводе": "Un technoparc rattaché à une usine",
  "Дубна, Королёв, Пущино и другие. От закрытого города наукоград отличается тем, что приехать туда можно свободно.":
    "Doubna, Koroliov, Pouchtchino et d'autres. Ce qui distingue une cité scientifique d'une ville fermée, c'est qu'on peut s'y rendre librement.",
  "Что такое ЗАТО?": "Qu'est-ce qu'un ZATO ?",
  "Закрытое административно-территориальное образование с ограниченным въездом":
    "Une formation administrative et territoriale fermée, dont l'accès est restreint",
  "Заповедная территория особой охраны": "Un territoire naturel sous protection spéciale",
  "Западный административный округ": "Le district administratif ouest",
  "Завод оборонного значения": "Une usine d'intérêt militaire",
  "Города при предприятиях атомной и оборонной промышленности. На картах советского времени многих из них попросту не было.":
    "Des villes attachées à des entreprises de l'industrie atomique et de la défense. Sur les cartes de l'époque soviétique, beaucoup n'existaient tout simplement pas.",
  "Сколько народов насчитала перепись 2021 года?":
    "Combien de peuples le recensement de 2021 a-t-il dénombrés ?",
  "Больше тысячи": "Plus de mille",
  "Более 190": "Plus de 190",
  "Около 40": "Environ 40",
  "Ровно 100": "Exactement 100",
  "Точное число всегда спорно: перепись записывает то, что человек говорит о себе сам, а границы между близкими группами проводят по-разному.":
    "Le chiffre exact prête toujours à discussion : le recensement note ce que chacun dit de lui-même, et les frontières entre groupes proches se tracent de différentes façons.",
  "Какую долю населения составляют русские?":
    "Quelle part de la population les Russes représentent-ils ?",
  "Около 95 %": "Environ 95 %",
  "Около 60 %": "Environ 60 %",
  "Около 80 %": "Environ 80 %",
  "Примерно 105 миллионов человек по переписи 2021 года. В отдельных республиках картина совершенно другая.":
    "Environ 105 millions de personnes selon le recensement de 2021. Dans certaines républiques, le tableau est tout autre.",
  "Какой народ идёт за русскими по численности?":
    "Quel peuple vient après les Russes par le nombre ?",
  "Татары": "Les Tatars",
  "Башкиры": "Les Bachkirs",
  "Чуваши": "Les Tchouvaches",
  "Армяне": "Les Arméniens",
  "По переписи 2021 года за татарами следуют чеченцы, башкиры, чуваши, аварцы и армяне.":
    "Selon le recensement de 2021, les Tatars sont suivis des Tchétchènes, des Bachkirs, des Tchouvaches, des Avars et des Arméniens.",
  "Есть ли в нынешнем российском паспорте графа «национальность»?":
    "Le passeport russe actuel comporte-t-il une rubrique « nationalité » ?",
  "Да, она заполняется по родителям": "Oui, elle est remplie d'après les parents",
  "Да, но заполняется по желанию": "Oui, mais elle se remplit à volonté",
  "Она есть только в загранпаспорте": "Elle ne figure que dans le passeport pour l'étranger",
  "Нет, её убрали": "Non, elle a été supprimée",
  "В советском паспорте такая графа была и записывалась по родителям. В паспорте нынешнего образца её нет — национальность человек определяет сам.":
    "Le passeport soviétique comportait bien cette rubrique, remplie d'après les parents. Le passeport actuel ne l'a plus : chacun détermine lui-même son appartenance.",
  "Какая статья Конституции гарантирует права коренных малочисленных народов?":
    "Quel article de la Constitution garantit les droits des peuples autochtones peu nombreux ?",
  "Статья 14": "L'article 14",
  "Статья 3": "L'article 3",
  "Статья 69": "L'article 69",
  "Статья 26": "L'article 26",
  "Статья 26 говорит о национальной принадлежности каждого, статья 14 — о светском государстве, статья 3 — о носителе суверенитета.":
    "L'article 26 traite de l'appartenance nationale de chacun, l'article 14 de l'État laïque, l'article 3 du détenteur de la souveraineté.",
  "Сколько народов входит в единый перечень коренных малочисленных?":
    "Combien de peuples figurent dans la liste unique des peuples autochtones peu nombreux ?",
  "Сорок семь": "Quarante-sept",
  "Сто девяносто": "Cent quatre-vingt-dix",
  "Перечень утверждает Правительство. Двадцать четыре — это число республик, а сто девяносто с лишним — общее число народов страны.":
    "La liste est approuvée par le gouvernement. Vingt-quatre est le nombre des républiques, et cent quatre-vingt-dix et quelques le nombre total des peuples du pays.",
  "Что даёт статус коренного малочисленного народа?":
    "Qu'apporte le statut de peuple autochtone peu nombreux ?",
  "Освобождение от налогов": "L'exemption d'impôts",
  "Отдельное представительство в Государственной Думе":
    "Une représentation propre à la Douma d'État",
  "Собственное гражданство": "Une nationalité propre",
  "Права на традиционное природопользование, льготы на промысел и досрочную пенсию":
    "Des droits sur l'usage traditionnel de la nature, des facilités pour la chasse et la pêche et une retraite anticipée",
  "Это не привилегия по происхождению, а возмещение за то, что современное хозяйство сокращает землю традиционного промысла.":
    "Ce n'est pas un privilège lié à l'origine, mais une compensation pour le fait que l'économie moderne réduit les terres de l'activité traditionnelle.",
  "Всегда ли титульный народ составляет большинство в своей республике?":
    "Le peuple qui donne son nom à la république y est-il toujours majoritaire ?",
  "Нет: в Карелии карелов немного, в Башкортостане башкир около четверти":
    "Non : en Carélie, les Caréliens sont peu nombreux, et au Bachkortostan les Bachkirs forment environ un quart",
  "Да, иначе республику переименовали бы": "Oui, sinon la république serait rebaptisée",
  "Да, это условие статуса республики": "Oui, c'est une condition du statut de république",
  "Так было до 1993 года": "C'était le cas jusqu'en 1993",
  "Имя республики говорит об истории, а не о нынешней арифметике. В Чечне, Ингушетии, Дагестане и Туве титульные народы действительно преобладают.":
    "Le nom d'une république parle d'histoire, non de l'arithmétique d'aujourd'hui. En Tchétchénie, en Ingouchie, au Daghestan et en Touva, les peuples qui donnent leur nom sont bel et bien majoritaires.",
  "Сколько человек при переписи 2021 года не указали национальность?":
    "Combien de personnes n'ont pas indiqué leur appartenance nationale lors du recensement de 2021 ?",
  "Никто: ответ обязателен": "Personne : la réponse est obligatoire",
  "Около шестнадцати миллионов": "Environ seize millions",
  "Несколько тысяч": "Quelques milliers",
  "Около миллиона": "Environ un million",
  "Ответ на этот вопрос переписи добровольный, и очень многие им не воспользовались.":
    "La réponse à cette question du recensement est facultative, et beaucoup ne s'en sont pas servis.",
  "Как перевести выражение «многонациональный народ» из преамбулы на язык прав?":
    "Comment traduire en langage juridique l'expression « peuple multinational » du préambule ?",
  "Суверенитет принадлежит крупнейшему народу":
    "La souveraineté appartient au peuple le plus nombreux",
  "Суверенитет разделён между республиками": "La souveraineté est partagée entre les républiques",
  "Суверенитет принадлежит всем народам страны вместе":
    "La souveraineté appartient à tous les peuples du pays ensemble",
  "Каждый народ обладает собственным суверенитетом":
    "Chaque peuple possède sa propre souveraineté",
  "Носитель суверенитета в статье 3 назван так же, как в преамбуле. Отсюда и федеративное устройство страны.":
    "Le porteur de la souveraineté est désigné à l'article 3 du même nom que dans le préambule. De là vient aussi l'organisation fédérale du pays.",
  "Какое право, кроме указания национальности, даёт статья 26?":
    "Quel droit, outre l'indication de l'appartenance nationale, l'article 26 accorde-t-il ?",
  "Пользоваться родным языком и свободно выбирать язык общения и обучения":
    "Employer sa langue maternelle et choisir librement sa langue de communication et d'enseignement",
  "Требовать преподавания на родном языке в любой школе страны":
    "Exiger un enseignement en langue maternelle dans n'importe quelle école du pays",
  "Получать документы на родном языке в любом органе власти":
    "Obtenir des documents en langue maternelle auprès de n'importe quelle administration",
  "Менять гражданство без согласия государства": "Changer de nationalité sans l'accord de l'État",
  "Свободный выбор языка общения, воспитания, обучения и творчества. Обязать государство преподавать любой язык где угодно эта статья не может.":
    "Le libre choix de la langue de communication, d'éducation, d'enseignement et de création. Cet article ne peut pas obliger l'État à enseigner n'importe quelle langue n'importe où.",
  "В каких республиках титульный народ составляет уверенное большинство?":
    "Dans quelles républiques le peuple qui donne son nom est-il nettement majoritaire ?",
  "В Мордовии и Удмуртии": "En Mordovie et en Oudmourtie",
  "Ни в одной": "Dans aucune",
  "В Чечне, Ингушетии, Дагестане и Туве": "En Tchétchénie, en Ingouchie, au Daghestan et en Touva",
  "В Карелии и Коми": "En Carélie et en République des Komis",
  "В Карелии карелов небольшая доля, в Мордовии и Удмуртии преобладают русские. Национальный состав в России — вопрос конкретного места, а не общей цифры.":
    "En Carélie, les Caréliens ne forment qu'une petite part, et en Mordovie comme en Oudmourtie les Russes dominent. La composition nationale en Russie est affaire de lieu précis, non de chiffre global.",
  "Почему число народов при каждой переписи оказывается спорным?":
    "Pourquoi le nombre de peuples prête-t-il à discussion à chaque recensement ?",
  "Часть народов запрещено учитывать": "Il est interdit de compter une partie des peuples",
  "Перепись записывает самоопределение, а границы между близкими группами проводят по-разному":
    "Le recensement note ce que chacun déclare de lui-même, et les frontières entre groupes proches se tracent de différentes façons",
  "Перепись охватывает не всю страну": "Le recensement ne couvre pas tout le pays",
  "Список народов утверждается заново каждые десять лет":
    "La liste des peuples est réapprouvée tous les dix ans",
  "Одни считают группу самостоятельным народом, другие — частью соседнего. Ни один вариант подсчёта не отменяет ответа самого человека.":
    "Les uns tiennent un groupe pour un peuple à part entière, les autres pour une partie du peuple voisin. Aucune manière de compter n'annule la réponse de l'intéressé lui-même.",
  "Какая численность служит верхней границей для коренного малочисленного народа?":
    "Quel effectif sert de limite supérieure pour un peuple autochtone peu nombreux ?",
  "Сто тысяч человек": "Cent mille personnes",
  "Десять тысяч человек": "Dix mille personnes",
  "Границы нет": "Il n'y a pas de limite",
  "Пятьдесят тысяч человек": "Cinquante mille personnes",
  "Кроме численности учитываются жизнь на землях предков, традиционное хозяйство и осознание себя самостоятельной общностью. Некоторые из этих народов — несколько сотен человек.":
    "Outre l'effectif, on tient compte de la vie sur les terres des ancêtres, de l'économie traditionnelle et de la conscience de former une communauté à part. Certains de ces peuples ne comptent que quelques centaines de personnes.",
  "Какой язык является государственным на всей территории страны?":
    "Quelle langue est officielle sur tout le territoire du pays ?",
  "Государственного языка нет": "Il n'y a pas de langue officielle",
  "Русский": "Le russe",
  "Каждый регион решает сам": "Chaque région décide elle-même",
  "Статья 68. Республики могут добавить к нему свои государственные языки, но заменить русский не могут.":
    "L'article 68. Les républiques peuvent y ajouter leurs propres langues officielles, mais elles ne peuvent pas remplacer le russe.",
  "Какая статья Конституции объявляет Россию светским государством?":
    "Quel article de la Constitution déclare la Russie État laïque ?",
  "Статья 28": "L'article 28",
  "Статья 28 даёт свободу совести, статья 68 говорит о языках, статья 69 — о коренных малочисленных народах.":
    "L'article 28 accorde la liberté de conscience, l'article 68 traite des langues, l'article 69 des peuples autochtones peu nombreux.",
  "Является ли Пасха нерабочим днём по федеральному закону?":
    "Pâques est-elle un jour chômé au regard de la loi fédérale ?",
  "Нет, но она всегда приходится на воскресенье": "Non, mais elle tombe toujours un dimanche",
  "Да, вместе с понедельником после неё": "Oui, avec le lundi qui suit",
  "Да, но только в отдельных республиках": "Oui, mais seulement dans certaines républiques",
  "Да, с 1997 года": "Oui, depuis 1997",
  "Из религиозных праздников нерабочим днём по всей стране объявлено только 7 января. Пасха передвижная и в перечень не входит.":
    "Parmi les fêtes religieuses, seul le 7 janvier est déclaré chômé dans tout le pays. Pâques est mobile et ne figure pas sur la liste.",
  "В каких регионах традиционен буддизм?":
    "Dans quelles régions le bouddhisme est-il traditionnel ?",
  "В Татарстане и Башкортостане": "Au Tatarstan et au Bachkortostan",
  "В Дагестане и Чечне": "Au Daghestan et en Tchétchénie",
  "В Калмыкии, Бурятии и Туве": "En Kalmoukie, en Bouriatie et en Touva",
  "Калмыкия — единственный буддийский регион в Европе. Татарстан, Башкортостан, Дагестан и Чечня — области распространения ислама.":
    "La Kalmoukie est la seule région bouddhiste d'Europe. Le Tatarstan, le Bachkortostan, le Daghestan et la Tchétchénie sont des régions de tradition musulmane.",
  "Сколько примерно языков народов России существует?":
    "Combien de langues des peuples de Russie existe-t-il à peu près ?",
  "Ровно сто": "Exactement cent",
  "Более тысячи": "Plus de mille",
  "Около ста пятидесяти": "Environ cent cinquante",
  "Около двадцати": "Environ vingt",
  "Часть из них ЮНЕСКО относит к исчезающим. Государственный статус в республиках имеют несколько десятков.":
    "L'UNESCO en range une partie parmi les langues menacées. Quelques dizaines ont le statut de langue officielle dans les républiques.",
  "Что гарантирует статья 28?": "Que garantit l'article 28 ?",
  "Право менять только между традиционными религиями":
    "Le droit de passer seulement d'une religion traditionnelle à une autre",
  "Свободу совести, включая право не исповедовать никакой религии":
    "La liberté de conscience, y compris le droit de ne professer aucune religion",
  "Право религиозных объединений на бюджетную поддержку":
    "Le droit des associations religieuses à un soutien budgétaire",
  "Обязательное изучение основ религии в школе":
    "L'étude obligatoire des bases de la religion à l'école",
  "Свободно выбирать, иметь и распространять убеждения и действовать в согласии с ними. Право не верить в этой статье записано наравне с правом верить.":
    "Choisir, avoir et diffuser librement ses convictions et agir en accord avec elles. Le droit de ne pas croire est inscrit dans cet article à égalité avec le droit de croire.",
  "Какая республика объявила государственными языки всех своих народов сразу?":
    "Quelle république a déclaré officielles d'un coup les langues de tous ses peuples ?",
  "Якутия": "La Iakoutie",
  "Бурятия": "La Bouriatie",
  "Карелия": "La Carélie",
  "Дагестан": "Le Daghestan",
  "Их там больше десятка. Это самый многоязычный субъект страны, и решение отражает именно это.":
    "Il y en a plus d'une dizaine. C'est le sujet le plus multilingue du pays, et la décision ne fait que le refléter.",
  "Что решил Конституционный Суд в 2004 году о письменности?":
    "Qu'a décidé la Cour constitutionnelle en 2004 au sujet de l'écriture ?",
  "Требование единой графической основы соответствует Конституции":
    "L'exigence d'une base graphique unique est conforme à la Constitution",
  "Республики вправе выбирать письменность сами":
    "Les républiques ont le droit de choisir elles-mêmes leur écriture",
  "Латиница допустима для языков без своей традиции":
    "L'alphabet latin est admis pour les langues sans tradition propre",
  "Вопрос относится к ведению муниципалитетов": "La question relève de la compétence des communes",
  "Письменность государственных языков признана вопросом общегосударственным, а не только республиканским.":
    "L'écriture des langues officielles a été reconnue comme une question de portée nationale, et non seulement républicaine.",
  "Какие религии названы в преамбуле закона о свободе совести 1997 года?":
    "Quelles religions le préambule de la loi de 1997 sur la liberté de conscience nomme-t-il ?",
  "Преамбула религий не называет": "Le préambule ne nomme aucune religion",
  "Христианство, ислам, буддизм и иудаизм":
    "Le christianisme, l'islam, le bouddhisme et le judaïsme",
  "Только православие": "L'orthodoxie seulement",
  "Все зарегистрированные объединения перечислены поимённо":
    "Toutes les associations enregistrées y sont énumérées nommément",
  "Преамбула признаёт особую роль православия в истории страны и выражает уважение к этим религиям как части исторического наследия народов России.":
    "Le préambule reconnaît le rôle particulier de l'orthodoxie dans l'histoire du pays et exprime son respect pour ces religions, parties du patrimoine historique des peuples de Russie.",
  "Какой праздник отмечается 24 мая?": "Quelle fête célèbre-t-on le 24 mai ?",
  "День славянской письменности и культуры": "La Journée de l'écriture et de la culture slaves",
  "День русского языка": "La Journée de la langue russe",
  "День русского языка — 6 июня, в день рождения Пушкина; День народного единства — 4 ноября; День Конституции — 12 декабря.":
    "La Journée de la langue russe tombe le 6 juin, jour de la naissance de Pouchkine ; la Journée de l'unité du peuple le 4 novembre ; la Journée de la Constitution le 12 décembre.",
  "Как обстоит дело с выходными на Ураза-байрам и Курбан-байрам?":
    "Qu'en est-il des jours chômés pour l'Aïd el-Fitr et l'Aïd el-Adha ?",
  "Их объявляют выходными законы отдельных республик":
    "Ce sont les lois de certaines républiques qui les déclarent chômés",
  "Это нерабочие дни по всей стране": "Ce sont des jours chômés dans tout le pays",
  "Они не бывают выходными нигде": "Ils ne sont chômés nulle part",
  "Решение принимает работодатель": "C'est l'employeur qui décide",
  "Общероссийский нерабочий религиозный праздник один — 7 января. Остальное решается региональным законом.":
    "Il n'y a qu'une seule fête religieuse chômée dans toute la Russie, le 7 janvier. Le reste se règle par la loi régionale.",
  "После какого события в законе о языках появилось требование кириллицы?":
    "À la suite de quel événement l'exigence du cyrillique est-elle apparue dans la loi sur les langues ?",
  "После принятия Конституции 1993 года": "Après l'adoption de la Constitution de 1993",
  "После переписи 2002 года": "Après le recensement de 2002",
  "После решения Татарстана перевести татарскую письменность на латиницу":
    "Après la décision du Tatarstan de faire passer l'écriture tatare à l'alphabet latin",
  "После распада СССР": "Après la disparition de l'URSS",
  "Республика приняла такое решение в конце 1990-х. Требование единой графической основы появилось в ответ, а в 2004 году его подтвердил Конституционный Суд.":
    "La république a pris cette décision à la fin des années 1990. L'exigence d'une base graphique unique est venue en réponse, et la Cour constitutionnelle l'a confirmée en 2004.",
  "Что задало нынешний облик русских печатных букв?":
    "Qu'est-ce qui a donné aux caractères d'imprimerie russes leur aspect actuel ?",
  "Типографские правила XIX века": "Les règles typographiques du XIXe siècle",
  "Гражданская азбука Петра I 1708 года": "L'alphabet civil de Pierre Ier, en 1708",
  "Реформа орфографии 1918 года": "La réforme de l'orthographe de 1918",
  "Азбука Кирилла и Мефодия без изменений": "L'alphabet de Cyrille et Méthode, inchangé",
  "Кирилл и Мефодий принесли письменность в IX веке, реформа 1918 года убрала несколько букв, а форму нынешнего шрифта задала гражданская азбука.":
    "Cyrille et Méthode ont apporté l'écriture au IXe siècle, la réforme de 1918 a supprimé quelques lettres, et c'est l'alphabet civil qui a fixé la forme des caractères actuels.",
  "Может ли алфавит государственного языка республики строиться не на кириллице?":
    "L'alphabet d'une langue officielle de république peut-il reposer sur autre chose que le cyrillique ?",
  "Нет ни при каких условиях": "Non, en aucun cas",
  "Да, по решению парламента республики": "Oui, sur décision du parlement de la république",
  "Да, если язык не имеет кириллической традиции":
    "Oui, si la langue n'a pas de tradition cyrillique",
  "Только если это установит федеральный закон": "Seulement si une loi fédérale l'établit",
  "Закон о языках оставляет такую возможность, но отдаёт её федеральному законодателю, а не республике.":
    "La loi sur les langues laisse cette possibilité, mais la confie au législateur fédéral et non à la république.",
  "Кого считают создателем современного русского литературного языка?":
    "Qui considère-t-on comme le créateur de la langue littéraire russe moderne ?",
  "Николая Карамзина": "Nikolaï Karamzine",
  "Александра Пушкина": "Alexandre Pouchkine",
  "Михаила Ломоносова": "Mikhaïl Lomonossov",
  "Льва Толстого": "Léon Tolstoï",
  "До него книжный и разговорный язык расходились гораздо сильнее. «Евгений Онегин» написан уже языком, который читается сегодня почти без пояснений.":
    "Avant lui, la langue des livres et la langue parlée s'écartaient bien davantage. « Eugène Onéguine » est déjà écrit dans une langue qui se lit aujourd'hui presque sans notes.",
  "Какого числа отмечается День русского языка?":
    "Quel jour célèbre-t-on la Journée de la langue russe ?",
  "1 сентября": "Le 1er septembre",
  "6 июня": "Le 6 juin",
  "24 мая": "Le 24 mai",
  "В день рождения Пушкина. Это же число — Пушкинский день России, а 24 мая отмечают День славянской письменности.":
    "Le jour de la naissance de Pouchkine. C'est aussi la Journée Pouchkine de Russie, tandis que le 24 mai on célèbre la Journée de l'écriture slave.",
  "Кто написал «Войну и мир»?": "Qui a écrit « Guerre et Paix » ?",
  "Фёдор Достоевский": "Fiodor Dostoïevski",
  "Иван Тургенев": "Ivan Tourgueniev",
  "Антон Чехов": "Anton Tchekhov",
  "Ему же принадлежит «Анна Каренина», а усадьба Ясная Поляна сохранена как музей.":
    "On lui doit aussi « Anna Karénine », et son domaine de Iasnaïa Poliana est conservé comme musée.",
  "Как называется главное собрание русского искусства в Москве?":
    "Comment s'appelle la principale collection d'art russe à Moscou ?",
  "Оружейная палата": "La Chambre des armures",
  "Пушкинский дом": "La Maison Pouchkine",
  "Она выросла из частного собрания купца Павла Третьякова. Русский музей — петербургский, основан в 1895 году.":
    "Elle est née de la collection privée du marchand Pavel Tretiakov. Le Musée russe, lui, est à Saint-Pétersbourg et a été fondé en 1895.",
  "Кто написал «Преступление и наказание»?": "Qui a écrit « Crime et Châtiment » ?",
  "Николай Гоголь": "Nikolaï Gogol",
  "Михаил Лермонтов": "Mikhaïl Lermontov",
  "Ему же принадлежат «Идиот» и «Братья Карамазовы». Из русских авторов его, вероятно, чаще всех переводят и ставят на сцене.":
    "On lui doit aussi « L'Idiot » et « Les Frères Karamazov ». C'est sans doute lui, de tous les auteurs russes, que l'on traduit et que l'on joue le plus.",
  "Кто из русских писателей был вынужден отказаться от Нобелевской премии?":
    "Lequel des écrivains russes a été contraint de refuser le prix Nobel ?",
  "Иосиф Бродский": "Joseph Brodsky",
  "Премия 1958 года. Отказ был вынужденным, под давлением; Бунин, Шолохов, Солженицын и Бродский свои премии получили.":
    "Le prix de 1958. Le refus lui a été imposé sous la pression ; Bounine, Cholokhov, Soljenitsyne et Brodsky, eux, ont reçu le leur.",
  "Что такое «Русские сезоны»?": "Que sont les « Saisons russes » ?",
  "Ежегодный фестиваль в Большом театре": "Un festival annuel au théâtre Bolchoï",
  "Цикл выставок передвижников": "Un cycle d'expositions des ambulants",
  "Серия концертов Чайковского за границей": "Une série de concerts de Tchaïkovski à l'étranger",
  "Показы русского балета в Париже, начатые Дягилевым в 1909 году":
    "Les représentations de ballet russe à Paris, lancées par Diaghilev en 1909",
  "Именно после них русский балет стал мировым эталоном: танцовщики и декорации оказались такими, каких в Париже не видели.":
    "C'est après elles que le ballet russe est devenu la référence mondiale : les danseurs et les décors étaient tels qu'on n'en avait jamais vu à Paris.",
  "Кто основал Московский Художественный театр?": "Qui a fondé le Théâtre d'art de Moscou ?",
  "Станиславский и Немирович-Данченко": "Stanislavski et Nemirovitch-Dantchenko",
  "Дягилев и Нижинский": "Diaghilev et Nijinski",
  "Чехов и Горький": "Tchekhov et Gorki",
  "Мейерхольд и Вахтангов": "Meyerhold et Vakhtangov",
  "Театр открылся в 1898 году, а метод работы с актёром — система Станиславского — преподаётся в театральных школах по всему миру.":
    "Le théâtre a ouvert en 1898, et sa méthode de travail avec l'acteur, le système Stanislavski, s'enseigne dans les écoles de théâtre du monde entier.",
  "Кому принадлежат балеты «Лебединое озеро», «Спящая красавица» и «Щелкунчик»?":
    "À qui doit-on les ballets « Le Lac des cygnes », « La Belle au bois dormant » et « Casse-Noisette » ?",
  "Сергею Рахманинову": "À Sergueï Rachmaninov",
  "Петру Чайковскому": "À Piotr Tchaïkovski",
  "Сергею Прокофьеву": "À Sergueï Prokofiev",
  "Игорю Стравинскому": "À Igor Stravinsky",
  "На этих трёх балетах держится мировой балетный репертуар. Стравинскому принадлежит «Весна священная», Прокофьеву — «Ромео и Джульетта».":
    "Le répertoire mondial du ballet repose sur ces trois œuvres. À Stravinsky on doit « Le Sacre du printemps », à Prokofiev « Roméo et Juliette ».",
  "Что объединяло передвижников?": "Qu'est-ce qui réunissait les ambulants ?",
  "Работа при императорской Академии художеств":
    "Le travail auprès de l'Académie impériale des beaux-arts",
  "Отказ от пейзажа как жанра": "Le rejet du paysage comme genre",
  "Товарищество 1870 года, возившее выставки по городам":
    "La société de 1870, qui portait ses expositions à travers les villes",
  "Общая манера письма": "Une manière de peindre commune",
  "Устав и выставочный маршрут, а не стиль: писали они очень по-разному, и пейзаж у них стал самостоятельным сюжетом.":
    "Des statuts et un itinéraire d'expositions, non un style : ils peignaient de façons très diverses, et chez eux le paysage est devenu un sujet à part entière.",
  "Где впервые исполнили Ленинградскую симфонию Шостаковича?":
    "Où la Symphonie de Leningrad de Chostakovitch a-t-elle été jouée pour la première fois ?",
  "В осаждённом Ленинграде в августе 1942 года": "Dans Leningrad assiégée, en août 1942",
  "В Москве после войны": "À Moscou après la guerre",
  "В Куйбышеве в 1945 году": "À Kouïbychev en 1945",
  "В Нью-Йорке": "À New York",
  "Оркестр собрали из оставшихся в живых музыкантов города. Это Седьмая симфония композитора.":
    "On a rassemblé l'orchestre parmi les musiciens de la ville encore en vie. C'est la Septième Symphonie du compositeur.",
  "Сколько русских авторов получили Нобелевскую премию по литературе?":
    "Combien d'auteurs russes ont reçu le prix Nobel de littérature ?",
  "Один": "Un",
  "Пятеро": "Cinq",
  "Двое": "Deux",
  "Бунин в 1933 году, Пастернак в 1958-м, Шолохов в 1965-м, Солженицын в 1970-м и Бродский в 1987-м.":
    "Bounine en 1933, Pasternak en 1958, Cholokhov en 1965, Soljenitsyne en 1970 et Brodsky en 1987.",
  "Какие четыре пьесы Чехова держат мировой репертуар?":
    "Quelles quatre pièces de Tchekhov portent le répertoire mondial ?",
  "«Три сестры», «Маскарад», «Борис Годунов», «Женитьба»":
    "« Les Trois Sœurs », « Mascarade », « Boris Godounov », « Le Mariage »",
  "«Чайка», «Дядя Ваня», «Три сестры», «Вишнёвый сад»":
    "« La Mouette », « Oncle Vania », « Les Trois Sœurs », « La Cerisaie »",
  "«Ревизор», «Гроза», «Горе от ума», «Чайка»":
    "« Le Revizor », « L'Orage », « Le Malheur d'avoir trop d'esprit », « La Mouette »",
  "«На дне», «Чайка», «Вишнёвый сад», «Бесприданница»":
    "« Les Bas-fonds », « La Mouette », « La Cerisaie », « La Fille sans dot »",
  "Чайка со шторы Художественного театра — эмблема именно отсюда. Остальные названия принадлежат Гоголю, Островскому, Грибоедову, Горькому, Лермонтову и Пушкину.":
    "La mouette du rideau du Théâtre d'art vient précisément de là. Les autres titres sont de Gogol, Ostrovski, Griboïedov, Gorki, Lermontov et Pouchkine.",
  "Чем известен Иван Айвазовский?": "Pour quoi Ivan Aïvazovski est-il connu ?",
  "Портретами императорской семьи": "Pour ses portraits de la famille impériale",
  "Лесными пейзажами": "Pour ses paysages de forêt",
  "Историческими полотнами о Сибири": "Pour ses toiles historiques sur la Sibérie",
  "Морскими видами: почти шесть тысяч полотен": "Pour ses marines : près de six mille toiles",
  "Он работал в Феодосии. Лес — это Шишкин, сибирские сюжеты — Суриков.":
    "Il travaillait à Feodossia. La forêt, c'est Chichkine ; les sujets sibériens, Sourikov.",
  "В каком году основана Академия наук?":
    "En quelle année l'Académie des sciences a-t-elle été fondée ?",
  "В 1724 году, указом Петра I": "En 1724, par décret de Pierre Ier",
  "В 1755 году": "En 1755",
  "Одно из старейших научных учреждений Европы, созданное сразу как государственное. В 1755 году основан Московский университет.":
    "L'une des plus anciennes institutions scientifiques d'Europe, créée d'emblée comme institution d'État. C'est en 1755 qu'a été fondée l'université de Moscou.",
  "Кто сформулировал периодический закон?": "Qui a formulé la loi périodique ?",
  "Иван Павлов": "Ivan Pavlov",
  "Лев Ландау": "Lev Landau",
  "Дмитрий Менделеев": "Dmitri Mendeleïev",
  "Михаил Ломоносов": "Mikhaïl Lomonossov",
  "1869 год. В таблице остались пустые клетки под неоткрытые элементы, и когда их нашли, свойства совпали с предсказанными.":
    "1869. Des cases vides sont restées dans le tableau pour des éléments non encore découverts, et quand on les a trouvés, leurs propriétés coïncidaient avec celles qu'il avait prédites.",
  "Какого числа отмечается День космонавтики?":
    "Quel jour célèbre-t-on la Journée de la cosmonautique ?",
  "12 апреля": "Le 12 avril",
  "4 октября": "Le 4 octobre",
  "В этот день в 1961 году состоялся первый полёт человека в космос. 4 октября 1957 года был запущен первый спутник.":
    "Ce jour-là, en 1961, a eu lieu le premier vol humain dans l'espace. Le 4 octobre 1957 a été lancé le premier satellite.",
  "Кто стала первой женщиной в космосе?": "Qui a été la première femme dans l'espace ?",
  "Светлана Савицкая": "Svetlana Savitskaïa",
  "Елена Кондакова": "Elena Kondakova",
  "Анна Кикина": "Anna Kikina",
  "1963 год, корабль «Восток-6». Савицкая первой из женщин вышла в открытый космос в 1984 году.":
    "1963, à bord du vaisseau « Vostok 6 ». Savitskaïa a été la première femme à sortir dans l'espace, en 1984.",
  "По чьему замыслу основан Московский университет?":
    "Sur l'idée de qui l'université de Moscou a-t-elle été fondée ?",
  "Екатерины II": "De Catherine II",
  "Дмитрия Менделеева": "De Dmitri Mendeleïev",
  "Петра I": "De Pierre Ier",
  "Университет открыт в 1755 году и носит его имя. Ломоносов был химиком, физиком, астрономом, поэтом и историком сразу.":
    "L'université a ouvert en 1755 et porte son nom. Lomonossov était à la fois chimiste, physicien, astronome, poète et historien.",
  "Кто первым из россиян получил Нобелевскую премию?":
    "Qui, parmi les Russes, a reçu le prix Nobel en premier ?",
  "Илья Мечников": "Ilia Metchnikov",
  "Пётр Капица": "Piotr Kapitsa",
  "1904 год, за работы о пищеварении. Мечников получил премию в 1908 году за учение об иммунитете.":
    "1904, pour ses travaux sur la digestion. Metchnikov a reçu le prix en 1908 pour sa théorie de l'immunité.",
  "Кто был главным конструктором космической программы?":
    "Qui était l'ingénieur en chef du programme spatial ?",
  "Константин Циолковский": "Konstantin Tsiolkovski",
  "Игорь Курчатов": "Igor Kourtchatov",
  "Сергей Королёв": "Sergueï Koroliov",
  "Его имя держали в тайне до самой смерти в 1966 году. Циолковский был теоретиком, Курчатов вёл атомный проект.":
    "Son nom a été tenu secret jusqu'à sa mort, en 1966. Tsiolkovski était le théoricien, et Kourtchatov dirigeait le projet atomique.",
  "Кто первым вышел в открытый космос?": "Qui est sorti le premier dans l'espace ?",
  "1965 год, корабль «Восход-2». Гагарин совершил первый полёт, Титов был вторым, Терешкова — первой женщиной.":
    "1965, à bord du vaisseau « Voskhod 2 ». Gagarine a effectué le premier vol, Titov était le deuxième, et Terechkova la première femme.",
  "В какой стране находится космодром Байконур?":
    "Dans quel pays se trouve le cosmodrome de Baïkonour ?",
  "На границе России и Казахстана": "À la frontière de la Russie et du Kazakhstan",
  "В Казахстане, Россия его арендует": "Au Kazakhstan ; la Russie le loue",
  "В России, Оренбургская область": "En Russie, dans l'oblast d'Orenbourg",
  "В Узбекистане": "En Ouzbékistan",
  "Космодром остался за границей после распада СССР. Именно поэтому в Амурской области построили Восточный.":
    "Le cosmodrome s'est retrouvé à l'étranger après la disparition de l'URSS. C'est précisément pour cela qu'on a construit Vostotchny dans l'oblast de l'Amour.",
  "Сколько проработала на орбите станция «Мир»?":
    "Combien de temps la station « Mir » a-t-elle travaillé en orbite ?",
  "Двадцать пять лет": "Vingt-cinq ans",
  "Она работает до сих пор": "Elle fonctionne encore aujourd'hui",
  "Пятнадцать лет, с 1986 по 2001 год": "Quinze ans, de 1986 à 2001",
  "Пять лет, как и рассчитывали": "Cinq ans, comme il était prévu",
  "Расчётный срок был пятилетним. С 1998 года Россия участвует в Международной космической станции.":
    "La durée prévue était de cinq ans. Depuis 1998, la Russie participe à la Station spatiale internationale.",
  "Кто руководил атомным проектом?": "Qui dirigeait le projet atomique ?",
  "Андрей Сахаров": "Andreï Sakharov",
  "При нём в 1954 году в Обнинске заработала первая в мире атомная электростанция, а в 1959-м вышел в море атомный ледокол.":
    "Sous sa direction, la première centrale nucléaire du monde est entrée en service à Obninsk en 1954, et en 1959 un brise-glace à propulsion nucléaire a pris la mer.",
  "Кто заложил теоретическую основу космонавтики?":
    "Qui a posé les bases théoriques de la cosmonautique ?",
  "Николай Кибальчич": "Nikolaï Kibaltchitch",
  "Валентин Глушко": "Valentin Glouchko",
  "Константин Циолковский, школьный учитель из Калуги":
    "Konstantin Tsiolkovski, maître d'école à Kalouga",
  "Расчёт ракетного движения он опубликовал в 1903 году — за полвека до первого спутника.":
    "Il a publié son calcul du mouvement des fusées en 1903, un demi-siècle avant le premier satellite.",
  "Чем важен атомный ледокольный флот?":
    "En quoi la flotte de brise-glaces nucléaires est-elle importante ?",
  "Он принадлежит нескольким странам совместно": "Elle appartient conjointement à plusieurs pays",
  "Он единственный в мире, и без него Северный морской путь не работал бы круглый год":
    "Elle est la seule au monde, et sans elle la route maritime du Nord ne fonctionnerait pas toute l'année",
  "Он используется только для научных экспедиций":
    "Elle ne sert qu'à des expéditions scientifiques",
  "Он заменяет атомные электростанции на севере":
    "Elle remplace les centrales nucléaires dans le Nord",
  "Первым был ледокол «Ленин», вышедший в море в 1959 году.":
    "Le premier a été le brise-glace « Lénine », qui a pris la mer en 1959.",
  "Что такое «Луноход-1»?": "Qu'est-ce que « Lunokhod 1 » ?",
  "Первая ракета, достигшая Луны": "La première fusée à avoir atteint la Lune",
  "Первый спутник Луны": "Le premier satellite de la Lune",
  "Проект, который так и не был запущен": "Un projet qui n'a jamais été lancé",
  "Первый самоходный аппарат, работавший на другом небесном теле":
    "Le premier engin automoteur ayant travaillé sur un autre corps céleste",
  "1970 год. Через год на орбиту вышла первая орбитальная станция — «Салют-1».":
    "1970. Un an plus tard, la première station orbitale, « Saliout 1 », était mise en orbite.",
  "В какой форме заключается трудовой договор?":
    "Sous quelle forme le contrat de travail est-il conclu ?",
  "Записью в трудовой книжке": "Par une mention dans le livret de travail",
  "Письменно, в двух экземплярах": "Par écrit, en deux exemplaires",
  "Устно, при свидетелях": "Oralement, devant témoins",
  "Только через нотариуса": "Uniquement devant notaire",
  "Один экземпляр остаётся у работника. Если человека фактически допустили к работе, договор считается заключённым и без подписанной бумаги.":
    "Un exemplaire reste au salarié. Si la personne a effectivement été admise au travail, le contrat est réputé conclu même sans papier signé.",
  "Какова нормальная продолжительность рабочей недели?":
    "Quelle est la durée normale de la semaine de travail ?",
  "Не более 48 часов": "Pas plus de 48 heures",
  "Её устанавливает работодатель": "C'est l'employeur qui la fixe",
  "Не более 40 часов": "Pas plus de 40 heures",
  "Не более 36 часов": "Pas plus de 36 heures",
  "Трудовой кодекс задаёт верхнюю границу; у отдельных категорий работников неделя короче.":
    "Le code du travail fixe une limite supérieure ; pour certaines catégories de salariés, la semaine est plus courte.",
  "Из скольких копеек состоит рубль?": "De combien de kopecks le rouble se compose-t-il ?",
  "Из ста": "De cent",
  "Из десяти": "De dix",
  "Из тысячи": "De mille",
  "Копейки давно отменены": "Les kopecks ont été supprimés depuis longtemps",
  "Графический знак рубля утверждён в 2013 году, а выпуск денег ведёт Центральный банк.":
    "Le symbole graphique du rouble a été adopté en 2013, et c'est la Banque centrale qui émet la monnaie.",
  "Как называется национальная платёжная система?":
    "Comment s'appelle le système national de paiement ?",
  "«Рубль»": "« Rouble »",
  "«Восток»": "« Vostok »",
  "«Спутник»": "« Spoutnik »",
  "«Мир»": "« Mir »",
  "Пенсии и бюджетные выплаты зачисляются именно на такие карты. Безналичная оплата в стране распространена очень широко.":
    "Les retraites et les versements du budget arrivent précisément sur ces cartes-là. Le paiement sans espèces est très répandu dans le pays.",
  "Какова наибольшая длительность испытательного срока по общему правилу?":
    "Quelle est la durée maximale de la période d'essai selon la règle générale ?",
  "Шесть месяцев для всех": "Six mois pour tout le monde",
  "Год": "Un an",
  "Три месяца": "Trois mois",
  "Один месяц": "Un mois",
  "До шести месяцев испытание допускается только для руководителей организаций, их заместителей и главных бухгалтеров.":
    "Une période d'essai allant jusqu'à six mois n'est admise que pour les dirigeants d'organisations, leurs adjoints et les chefs comptables.",
  "Как часто должна выплачиваться заработная плата?":
    "À quelle fréquence le salaire doit-il être versé ?",
  "Не реже одного раза в квартал": "Au moins une fois par trimestre",
  "Не реже чем каждые полмесяца": "Au moins tous les quinze jours",
  "Один раз в месяц": "Une fois par mois",
  "По усмотрению работодателя": "À la discrétion de l'employeur",
  "Аванс здесь не любезность работодателя, а прямое требование Трудового кодекса.":
    "L'acompte n'est pas ici une amabilité de l'employeur, mais une exigence expresse du code du travail.",
  "Что такое МРОТ?": "Qu'est-ce que le MROT ?",
  "Средняя зарплата по стране": "Le salaire moyen du pays",
  "Размер пособия по безработице": "Le montant de l'allocation chômage",
  "Минимальный стаж для пенсии": "La durée d'activité minimale pour la retraite",
  "Минимальный размер оплаты труда, ниже которого платить нельзя":
    "Le montant minimal de rémunération du travail, en dessous duquel on ne peut pas payer",
  "Устанавливается федеральным законом. В регионе может действовать собственное, более высокое соглашение.":
    "Il est fixé par une loi fédérale. Dans une région, un accord propre et plus élevé peut s'appliquer.",
  "Что произошло с трудовой книжкой в 2020 году?":
    "Qu'est-il arrivé au livret de travail en 2020 ?",
  "Её перевели в электронный вид": "Il est passé au format électronique",
  "Её отменили совсем": "Il a été supprimé purement et simplement",
  "Её стали хранить у работника дома": "On s'est mis à le conserver chez le salarié",
  "Её заменил трудовой договор": "Le contrat de travail l'a remplacé",
  "Тем, кто устраивается на работу впервые, бумажную книжку уже не заводят: сведения о стаже хранит Социальный фонд.":
    "Pour ceux qui prennent un premier emploi, on n'ouvre plus de livret papier : c'est le Fonds social qui conserve les périodes travaillées.",
  "Каковы ставки налога на профессиональный доход у самозанятых?":
    "Quels sont les taux de l'impôt sur le revenu professionnel des travailleurs indépendants ?",
  "Самозанятые налог не платят": "Les indépendants ne paient pas d'impôt",
  "4 % с поступлений от частных лиц и 6 % от организаций":
    "4 % sur les recettes venant de particuliers et 6 % sur celles venant d'organisations",
  "13 % со всего дохода": "13 % sur la totalité du revenu",
  "6 % во всех случаях": "6 % dans tous les cas",
  "Режим действует с 2019 года, без отчётности и без кассы, пока доход не превышает 2,4 миллиона рублей в год.":
    "Ce régime existe depuis 2019, sans déclaration ni caisse enregistreuse, tant que le revenu ne dépasse pas 2,4 millions de roubles par an.",
  "Каким станет пенсионный возраст к 2028 году?": "Quel sera l'âge de la retraite en 2028 ?",
  "65 лет для всех": "65 ans pour tout le monde",
  "Он останется прежним": "Il restera le même",
  "65 лет для мужчин и 60 лет для женщин": "65 ans pour les hommes et 60 ans pour les femmes",
  "60 лет для мужчин и 55 лет для женщин": "60 ans pour les hommes et 55 ans pour les femmes",
  "Реформа 2018 года подняла возраст постепенно. Кроме возраста нужны стаж и пенсионные коэффициенты.":
    "La réforme de 2018 a relevé l'âge par étapes. Outre l'âge, il faut des périodes travaillées et des coefficients de retraite.",
  "Что такое СНИЛС?": "Qu'est-ce que le SNILS ?",
  "Номер индивидуального лицевого счёта в пенсионном страховании":
    "Le numéro du compte personnel dans le système d'assurance retraite",
  "Номер налогоплательщика": "Le numéro de contribuable",
  "Номер полиса медицинского страхования": "Le numéro de la police d'assurance maladie",
  "Номер трудового договора": "Le numéro du contrat de travail",
  "На нём копится стаж, и он нужен почти для любой государственной услуги. Номер налогоплательщика — это ИНН.":
    "C'est sur lui que s'accumulent les périodes travaillées, et il faut l'avoir pour presque toute démarche publique. Le numéro de contribuable, lui, s'appelle INN.",
  "Есть ли трудовой договор, если человека допустили к работе, но бумагу не подписали?":
    "Y a-t-il un contrat de travail si la personne a été admise au travail sans que le papier soit signé ?",
  "Только если прошло больше месяца": "Seulement s'il s'est écoulé plus d'un mois",
  "Только по решению суда": "Seulement sur décision de justice",
  "Да, договор считается заключённым": "Oui, le contrat est réputé conclu",
  "Нет, до подписи отношений нет":
    "Non, tant qu'il n'y a pas de signature il n'y a pas de relation",
  "Работодатель обязан оформить документ письменно после этого, но права работника действуют с первого дня работы.":
    "L'employeur est ensuite tenu d'établir le document par écrit, mais les droits du salarié valent dès le premier jour de travail.",
  "К какой части дохода применяется повышенная ставка подоходного налога?":
    "À quelle part du revenu s'applique le taux majoré de l'impôt sur le revenu ?",
  "К доходу супругов вместе": "Au revenu des deux époux réunis",
  "Только к той части, которая перешла порог": "Seulement à la part qui a franchi le seuil",
  "Ко всему доходу за год": "À tout le revenu de l'année",
  "К доходу следующего года": "Au revenu de l'année suivante",
  "Шкала действует с 2025 года: базовая ставка 13 %, выше порогов — 15, 18, 20 и 22 процента, каждая на своей части дохода.":
    "Le barème s'applique depuis 2025 : taux de base de 13 %, puis au-dessus des seuils 15, 18, 20 et 22 pour cent, chacun sur sa propre part du revenu.",
  "Кто отвечает за устойчивость рубля?": "Qui répond de la stabilité du rouble ?",
  "Министерство финансов": "Le ministère des Finances",
  "Это названо в Конституции его основной функцией. Выпуск денег тоже ведёт он.":
    "La Constitution en fait sa fonction principale. C'est aussi lui qui émet la monnaie.",
  "По какому номеру вызывают скорую помощь?": "À quel numéro appelle-t-on les secours médicaux ?",
  "104": "104",
  "103": "103",
  "102": "102",
  "101 — пожарные и спасатели, 102 — полиция, 104 — аварийная газовая служба, 112 — единый экстренный номер.":
    "101, les pompiers et les secouristes ; 102, la police ; 104, le service d'urgence du gaz ; 112, le numéro d'urgence unique.",
  "Сколько классов занимает полное школьное обучение?":
    "Combien de classes compte la scolarité complète ?",
  "Четыре года начальной школы, пять лет основной и два года старшей. Обязательными Конституция называет девять классов.":
    "Quatre ans d'école primaire, cinq ans de collège et deux ans de lycée. La Constitution rend neuf classes obligatoires.",
  "Какая школьная оценка является высшей?": "Quelle est la meilleure note à l'école ?",
  "Шкала пятибалльная: 2 — неудовлетворительно, а единицу на практике почти не ставят.":
    "L'échelle va de un à cinq : 2 signifie insuffisant, et le 1 ne se met presque jamais en pratique.",
  "Когда начинается учебный год?": "Quand commence l'année scolaire ?",
  "1 августа": "Le 1er août",
  "1 октября": "Le 1er octobre",
  "В разные дни в разных регионах": "À des dates différentes selon les régions",
  "Этот день называется Днём знаний и отмечается по всей стране одинаково.":
    "Ce jour s'appelle la Journée du savoir et se célèbre de la même façon dans tout le pays.",
  "Кто платит взносы медицинского страхования за детей и пенсионеров?":
    "Qui paie les cotisations d'assurance maladie pour les enfants et les retraités ?",
  "Федеральный бюджет напрямую": "Le budget fédéral directement",
  "Никто, они не застрахованы": "Personne : ils ne sont pas assurés",
  "Регион": "La région",
  "Сами застрахованные": "Les assurés eux-mêmes",
  "За работающих взносы платит работодатель, за неработающих — субъект федерации.":
    "Pour ceux qui travaillent, c'est l'employeur qui cotise ; pour les autres, le sujet de la Fédération.",
  "Что определяет объём бесплатной медицинской помощи?":
    "Qu'est-ce qui détermine l'étendue des soins gratuits ?",
  "Договор с работодателем": "Le contrat avec l'employeur",
  "Программа государственных гарантий, утверждаемая ежегодно":
    "Le programme de garanties de l'État, approuvé chaque année",
  "Решение главного врача поликлиники": "La décision du médecin-chef de la polyclinique",
  "Страховая организация по своему усмотрению": "L'organisme d'assurance, à sa discrétion",
  "Всё, что за пределами программы, оказывается платно или по добровольному страхованию.":
    "Tout ce qui sort du programme est payant ou relève de l'assurance volontaire.",
  "Как часто можно менять поликлинику?": "À quelle fréquence peut-on changer de polyclinique ?",
  "В любой момент, сколько угодно раз": "À tout moment, autant de fois qu'on veut",
  "Только при переезде в другой регион": "Seulement en cas de déménagement dans une autre région",
  "Менять её нельзя": "On ne peut pas en changer",
  "Не чаще одного раза в год": "Pas plus d'une fois par an",
  "Прикрепление обычно идёт по месту жительства, но выбор возможен. Врача внутри поликлиники тоже можно выбрать, с его согласия.":
    "Le rattachement se fait d'ordinaire selon le lieu de résidence, mais on peut en choisir une autre. On peut aussi choisir son médecin à l'intérieur de la polyclinique, avec son accord.",
  "Что такое диспансеризация?": "Qu'est-ce que la visite de prévention ?",
  "Бесплатное профилактическое обследование по полису":
    "Un examen préventif gratuit sur la police d'assurance",
  "Постановка на учёт у психиатра": "Une inscription au registre du psychiatre",
  "Осмотр перед приёмом на работу": "Une visite avant l'embauche",
  "Лечение в дневном стационаре": "Un traitement en hôpital de jour",
  "До сорока лет она проходится раз в три года, после сорока — ежегодно, и на неё дают оплачиваемый выходной.":
    "Jusqu'à quarante ans, on la passe tous les trois ans ; après quarante ans, tous les ans, et un jour de congé payé est accordé pour s'y rendre.",
  "Какие предметы на ЕГЭ обязательны для всех?":
    "Quelles matières de l'EGE sont obligatoires pour tous ?",
  "Обязательных нет": "Il n'y en a pas d'obligatoires",
  "Русский язык и математика": "Le russe et les mathématiques",
  "Русский язык и история": "Le russe et l'histoire",
  "Математика и иностранный язык": "Les mathématiques et une langue étrangère",
  "Остальные предметы выпускник выбирает под ту специальность, на которую собирается поступать.":
    "Le candidat choisit les autres matières en fonction de la spécialité qu'il vise.",
  "Чем бюджетное место в вузе отличается от платного?":
    "En quoi une place financée par l'État à l'université diffère-t-elle d'une place payante ?",
  "Оно даёт диплом другого образца": "Elle donne un diplôme d'un autre modèle",
  "Оно доступно только жителям региона": "Elle n'est accessible qu'aux habitants de la région",
  "Его оплачивает государство и распределяет по конкурсу баллов":
    "L'État la finance et l'attribue au concours, selon les points",
  "На нём учатся дольше": "On y étudie plus longtemps",
  "Конституция говорит именно так: высшее образование бесплатно на конкурсной основе — не всем, но и не за деньги.":
    "La Constitution le dit ainsi : l'enseignement supérieur est gratuit sur concours — pas pour tout le monde, mais pas contre de l'argent non plus.",
  "С какого года ЕГЭ проводится по всей стране?":
    "Depuis quelle année l'EGE se passe-t-il dans tout le pays ?",
  "С 2009 года": "Depuis 2009",
  "С 1999 года": "Depuis 1999",
  "С 2015 года": "Depuis 2015",
  "Он служит одновременно выпускным экзаменом школы и вступительным экзаменом вуза.":
    "Il sert à la fois d'examen de sortie de l'école et d'examen d'entrée à l'université.",
  "Действует ли полис медицинского страхования за пределами региона, где выдан?":
    "La police d'assurance maladie est-elle valable hors de la région où elle a été délivrée ?",
  "Только в течение полугода": "Seulement pendant six mois",
  "Только по экстренным случаям": "Seulement pour les urgences",
  "Да, по всей стране": "Oui, dans tout le pays",
  "Нет, при переезде нужен новый": "Non, il en faut une nouvelle en cas de déménagement",
  "Переехав, менять полис не нужно — нужно только прикрепиться к новой поликлинике.":
    "Après un déménagement, il n'y a pas à la changer : il suffit de se rattacher à une nouvelle polyclinique.",
  "Чем специалитет отличается от бакалавриата по сроку?":
    "Quelle différence de durée y a-t-il entre le cursus de spécialiste et le bachelor ?",
  "Специалитет длится три года": "Le cursus de spécialiste dure trois ans",
  "Специалист учится пять-шесть лет, бакалавр четыре":
    "Le spécialiste étudie cinq à six ans, le bachelor quatre",
  "Наоборот, бакалавр учится дольше": "Au contraire, le bachelor étudie plus longtemps",
  "Сроки одинаковые": "Les durées sont les mêmes",
  "По специалитету учатся, например, врачи. После бакалавриата можно пойти в магистратуру ещё на два года.":
    "Les médecins, par exemple, suivent le cursus de spécialiste. Après le bachelor, on peut faire un master de deux ans de plus.",
  "По какому принципу принимают детей в школу?":
    "Selon quel principe les enfants sont-ils admis à l'école ?",
  "По результатам вступительного тестирования": "D'après les résultats d'un test d'entrée",
  "По очереди подачи заявления, без учёта адреса":
    "Dans l'ordre de dépôt des demandes, sans tenir compte de l'adresse",
  "По выбору директора школы": "Au choix du directeur de l'école",
  "По территориальному: за школой закреплён участок, и живущим на нём место гарантировано":
    "Selon le territoire : un secteur est rattaché à l'école, et ceux qui y habitent ont une place garantie",
  "Оставшиеся после закреплённых места распределяются между всеми остальными желающими.":
    "Les places qui restent une fois le secteur servi se répartissent entre tous les autres candidats.",
  "Какой документ является основным у ребёнка до четырнадцати лет?":
    "Quel est le document principal d'un enfant de moins de quatorze ans ?",
  "Справка из школы": "Une attestation de l'école",
  "Свидетельство о рождении": "L'acte de naissance",
  "Паспорт родителя с записью о ребёнке": "Le passeport d'un parent portant mention de l'enfant",
  "Полис медицинского страхования": "La police d'assurance maladie",
  "Паспорт выдаётся в четырнадцать лет, и с этого момента основным документом становится он.":
    "Le passeport est délivré à quatorze ans, et à partir de là c'est lui le document principal.",
  "Какой номер является единым для всех экстренных служб?":
    "Quel numéro est commun à tous les services d'urgence ?",
  "01": "01",
  "Со 112 можно позвонить без денег на счету, без сим-карты и с заблокированного телефона.":
    "On peut appeler le 112 sans crédit sur son compte, sans carte SIM et depuis un téléphone verrouillé.",
  "Что скрывается за вывеской «Мои документы»?": "Que cache l'enseigne « Mes papiers » ?",
  "Многофункциональный центр государственных услуг":
    "Le centre multiservices des prestations publiques",
  "Архив": "Les archives",
  "Отделение полиции": "Un commissariat de police",
  "Нотариальная контора": "Une étude de notaire",
  "Одно окно почти для всего: паспорт, регистрация, справки, выписки, пособия.":
    "Un guichet pour presque tout : passeport, enregistrement, attestations, extraits, allocations.",
  "По какому номеру вызывают полицию?": "À quel numéro appelle-t-on la police ?",
  "101 — пожарные и спасатели, 103 — скорая помощь, 104 — аварийная газовая служба.":
    "101, les pompiers et les secouristes ; 103, les secours médicaux ; 104, le service d'urgence du gaz.",
  "Что пришло на смену прописке в 1993 году?": "Qu'est-ce qui a remplacé la propiska en 1993 ?",
  "Отметка в трудовой книжке": "Une mention dans le livret de travail",
  "Ничего, прописка сохранилась под другим названием":
    "Rien : la propiska a subsisté sous un autre nom",
  "Регистрационный учёт, носящий уведомительный характер":
    "L'enregistrement, qui a valeur de simple information",
  "Разрешение на проживание, выдаваемое городом":
    "Une autorisation de résidence délivrée par la ville",
  "Прописка разрешала жить в городе, регистрация лишь уведомляет государство об адресе. Конституционный Суд указывал, что она не может быть условием осуществления прав.":
    "La propiska donnait l'autorisation d'habiter en ville ; l'enregistrement se borne à informer l'État de l'adresse. La Cour constitutionnelle a indiqué qu'il ne peut être une condition de l'exercice des droits.",
  "Чем регистрация по месту жительства отличается от регистрации по месту пребывания?":
    "Quelle différence y a-t-il entre l'enregistrement au lieu de résidence et l'enregistrement au lieu de séjour ?",
  "Между ними нет разницы": "Il n'y a pas de différence entre les deux",
  "Первая постоянна и ставится штампом, вторая временна и оформляется свидетельством":
    "Le premier est permanent et se marque d'un cachet, le second est temporaire et donne lieu à une attestation",
  "Первая для граждан, вторая для иностранцев":
    "Le premier est pour les citoyens, le second pour les étrangers",
  "Первая бесплатна, вторая платна": "Le premier est gratuit, le second payant",
  "Одна другую не отменяет: временная регистрация не лишает человека постоянной.":
    "L'un n'annule pas l'autre : un enregistrement temporaire ne prive personne de son enregistrement permanent.",
  "Что регистрируют органы записи актов гражданского состояния?":
    "Qu'enregistrent les services de l'état civil ?",
  "Только брак и развод": "Seulement le mariage et le divorce",
  "Сделки с недвижимостью": "Les transactions immobilières",
  "Место жительства": "Le lieu de résidence",
  "Рождение, брак, развод, отцовство, перемену имени и смерть":
    "La naissance, le mariage, le divorce, la paternité, le changement de nom et le décès",
  "Место жительства регистрируют другие органы, а сделки с недвижимостью — Росреестр.":
    "Le lieu de résidence est enregistré par d'autres services, et les transactions immobilières par le Rosreestr.",
  "Каков брачный возраст?": "Quel est l'âge du mariage ?",
  "18 лет, при уважительных причинах может быть снижен до 16":
    "18 ans, abaissable à 16 pour motifs valables",
  "21 год без исключений": "21 ans, sans exception",
  "18 лет без исключений": "18 ans, sans exception",
  "16 лет для всех": "16 ans pour tout le monde",
  "В отдельных регионах региональный закон допускает и более ранний возраст. Между заявлением и регистрацией обычно проходит месяц.":
    "Dans certaines régions, la loi régionale admet même un âge plus précoce. Entre la demande et l'enregistrement, il s'écoule d'ordinaire un mois.",
  "На какой срок выдают заграничный паспорт?":
    "Pour quelle durée délivre-t-on le passeport pour l'étranger ?",
  "Обычный на пять лет, биометрический на десять":
    "L'ordinaire pour cinq ans, le biométrique pour dix",
  "Оба на пять лет": "Les deux pour cinq ans",
  "Оба на десять лет": "Les deux pour dix ans",
  "Внутренний паспорт за пределами страны не действует, поэтому загранпаспорт оформляется отдельно.":
    "Le passeport intérieur ne vaut pas hors du pays : c'est pourquoi le passeport pour l'étranger s'établit à part.",
  "Какой возраст охватывает призыв на военную службу?":
    "Quelle tranche d'âge la conscription concerne-t-elle ?",
  "От 16 до 25 лет": "De 16 à 25 ans",
  "От 20 до 35 лет": "De 20 à 35 ans",
  "От 18 до 30 лет": "De 18 à 30 ans",
  "От 18 до 27 лет": "De 18 à 27 ans",
  "Верхняя граница поднята с 27 до 30 лет с 2024 года. Мужчины при этом состоят на воинском учёте.":
    "La limite supérieure est passée de 27 à 30 ans en 2024. Les hommes sont par ailleurs inscrits au registre militaire.",
  "Что даёт подтверждённая учётная запись на портале государственных услуг?":
    "Qu'apporte un compte vérifié sur le portail des services publics ?",
  "Возможность подать большинство заявлений и записаться на приём, не выходя из дома":
    "La possibilité de déposer la plupart des demandes et de prendre rendez-vous sans sortir de chez soi",
  "Освобождение от государственных пошлин": "L'exonération des droits d'État",
  "Право не иметь регистрации": "Le droit de ne pas avoir d'enregistrement",
  "Замену паспорта в электронном виде":
    "Le remplacement du passeport par une version électronique",
  "Портал и приложение заменяют очередь, но не сам документ: паспорт по-прежнему бумажный.":
    "Le portail et l'application remplacent la file d'attente, mais pas le document lui-même : le passeport reste en papier.",
  "Лишает ли отсутствие регистрации права на медицинскую помощь?":
    "L'absence d'enregistrement prive-t-elle du droit aux soins ?",
  "Да, и школа ребёнку тоже недоступна": "Oui, et l'école est également fermée à l'enfant",
  "Нет, и никакой ответственности не наступает": "Non, et cela n'entraîne aucune sanction",
  "Нет, но за проживание без неё дольше срока предусмотрен штраф":
    "Non, mais habiter sans lui au-delà du délai est passible d'une amende",
  "Да, без регистрации помощь платная": "Oui, sans enregistrement les soins sont payants",
  "Регистрация — обязанность, а не разрешение: прав она не даёт и не отнимает, но не оформить её нельзя.":
    "L'enregistrement est une obligation, non une autorisation : il ne donne ni ne retire de droits, mais on ne peut pas se dispenser de le faire.",
  "Что такое альтернативная гражданская служба?":
    "Qu'est-ce que le service civil de remplacement ?",
  "Отсрочка от призыва на время учёбы": "Un sursis d'incorporation pendant les études",
  "Замена военной службы для тех, чьим убеждениям она противоречит":
    "Le remplacement du service militaire pour ceux dont il heurte les convictions",
  "Служба по контракту за деньги": "Le service sous contrat, rémunéré",
  "Работа в военных учреждениях без оружия":
    "Un travail dans des établissements militaires, sans arme",
  "Право на неё даёт Конституция. Такая служба дольше обычной и проходит, как правило, в гражданских учреждениях.":
    "C'est la Constitution qui y donne droit. Ce service est plus long que le service ordinaire et s'accomplit en règle générale dans des établissements civils.",
  "Чем занимается Социальный фонд?": "De quoi s'occupe le Fonds social ?",
  "Медицинским страхованием": "De l'assurance maladie",
  "Сбором налогов": "De la collecte des impôts",
  "Выдачей паспортов": "De la délivrance des passeports",
  "Пенсиями, пособиями, номером СНИЛС и сведениями о стаже":
    "Des retraites, des allocations, du numéro SNILS et des périodes travaillées",
  "Он образован объединением прежних пенсионного и социального фондов. Налоги собирает налоговая служба.":
    "Il est né de la fusion des anciens fonds de retraite et social. Les impôts, eux, sont collectés par le service des impôts.",
  "От чего образуется отчество?": "Sur quoi se forme le patronyme ?",
  "От имени крёстного": "Sur le prénom du parrain",
  "От имени отца": "Sur le prénom du père",
  "От фамилии рода": "Sur le nom de la lignée",
  "От места рождения": "Sur le lieu de naissance",
  "Иванович и Ивановна, Сергеевич и Сергеевна. Обращение по имени и отчеству считается уважительным.":
    "Ivanovitch et Ivanovna, Sergueïevitch et Sergueïevna. S'adresser à quelqu'un par le prénom et le patronyme est la forme respectueuse.",
  "Что принято делать, входя в квартиру?":
    "Que fait-on d'ordinaire en entrant dans un appartement ?",
  "Ничего особенного": "Rien de particulier",
  "Снимать верхнюю одежду только по просьбе хозяев":
    "N'ôter son manteau que si les hôtes le demandent",
  "Разуваться в прихожей": "Se déchausser dans l'entrée",
  "Оставлять обувь на лестничной площадке": "Laisser ses chaussures sur le palier",
  "Гостю обычно дают тапочки. Зимой улицы посыпают реагентами, и хозяева берегут пол.":
    "On donne d'ordinaire des chaussons à l'invité. L'hiver, on répand des produits de déneigement dans les rues, et les hôtes ménagent leur plancher.",
  "Что такое борщ?": "Qu'est-ce que le bortsch ?",
  "Суп со свёклой": "Une soupe à la betterave",
  "Каша из гречки": "Une kacha de sarrasin",
  "Пирог с мясом": "Une tourte à la viande",
  "Кисломолочный напиток": "Une boisson lactée fermentée",
  "Щи варят из капусты, уху — из рыбы. Суп здесь не закуска, а полноценное первое блюдо.":
    "Les chtchi se font au chou, l'oukha au poisson. La soupe n'est pas ici une entrée mais un plat à part entière.",
  "Какой праздник считается главным семейным праздником года?":
    "Quelle fête est tenue pour la grande fête familiale de l'année ?",
  "Рождество": "Noël",
  "Пасха": "Pâques",
  "Новый год": "Le Nouvel An",
  "Ставят ёлку, ждут Деда Мороза и Снегурочку, под бой курантов провожают старый год. Каникулы длятся с 1 по 8 января.":
    "On dresse un sapin, on attend Ded Moroz et Snegourotchka, et l'on prend congé de l'année écoulée au carillon de minuit. Les vacances durent du 1er au 8 janvier.",
  "К кому обращаются по имени и отчеству?": "À qui s'adresse-t-on par le prénom et le patronyme ?",
  "Только к государственным служащим": "Uniquement aux fonctionnaires",
  "К близким друзьям": "Aux amis proches",
  "К преподавателю, врачу, начальнику, к человеку старше себя":
    "À un enseignant, à un médecin, à un supérieur, à quelqu'un de plus âgé que soi",
  "К любому незнакомому на улице": "À n'importe quel inconnu dans la rue",
  "Между знакомыми ровесниками обычно достаточно имени, часто уменьшительного.":
    "Entre gens du même âge qui se connaissent, le prénom suffit d'ordinaire, souvent dans sa forme familière.",
  "Кто предлагает перейти на «ты»?": "Qui propose de passer au tutoiement ?",
  "Переход происходит сам собой": "Le passage se fait de lui-même",
  "Старший или тот, кто выше по положению": "L'aîné, ou celui qui est le plus haut placé",
  "Младший, в знак доверия": "Le plus jeune, en signe de confiance",
  "Тот, кто заговорил первым": "Celui qui a parlé le premier",
  "И предложение это обычно произносят вслух. К незнакомому, к старшему и к должностному лицу — только «вы».":
    "Et cette proposition se dit d'ordinaire à voix haute. À un inconnu, à un aîné et à un représentant de l'autorité, on dit « vous » et rien d'autre.",
  "Что означает выражение «шесть соток»?": "Que signifie l'expression « six ares » ?",
  "Площадь типовой квартиры": "La surface d'un appartement type",
  "Норму жилья на человека": "La norme de logement par personne",
  "Размер огорода при деревенском доме": "La taille du potager attenant à une maison de village",
  "Размер дачного участка, какие раздавали в советское время":
    "La taille des parcelles de datcha distribuées à l'époque soviétique",
  "Участки давали работникам предприятий, и дом на них строили своими руками. Летом города по выходным заметно пустеют именно поэтому.":
    "Les parcelles étaient données aux employés des entreprises, et l'on y bâtissait la maison de ses propres mains. C'est bien pour cela que les villes se vident sensiblement le week-end en été.",
  "Чем парятся в бане?": "Avec quoi se fouette-t-on à la banya ?",
  "Веником из берёзовых или дубовых веток": "Avec un venik de branches de bouleau ou de chêne",
  "Горячими камнями": "Avec des pierres brûlantes",
  "Полотенцем, смоченным в кипятке": "Avec une serviette trempée dans l'eau bouillante",
  "Ничем, просто сидят в жаре": "Avec rien : on reste simplement assis dans la chaleur",
  "Ходят компанией, между заходами пьют чай. Суббота — традиционный банный день.":
    "On y va en groupe et l'on boit du thé entre les passages. Le samedi est le jour traditionnel de la banya.",
  "Из чего состоит полный обед?": "De quoi se compose un repas complet ?",
  "Из одного основного блюда": "D'un seul plat principal",
  "Из первого, второго и третьего": "D'un premier, d'un deuxième et d'un troisième",
  "Из закуски и горячего": "D'une entrée et d'un plat chaud",
  "Из супа и десерта": "D'une soupe et d'un dessert",
  "Первое — суп, второе — основное блюдо, третье — напиток: компот, кисель или чай.":
    "Le premier, c'est la soupe ; le deuxième, le plat principal ; le troisième, la boisson : kompot, kissel ou thé.",
  "Сколько длятся новогодние каникулы?": "Combien de temps durent les vacances du Nouvel An ?",
  "Две недели": "Deux semaines",
  "Это самый длинный нерабочий период в году, и на него приходится и Рождество 7 января.":
    "C'est la plus longue période chômée de l'année, et Noël, le 7 janvier, tombe dedans.",
  "Что такое маршрутка?": "Qu'est-ce qu'une marchroutka ?",
  "Микроавтобус по фиксированному маршруту, останавливающийся по просьбе":
    "Un minibus sur une ligne fixe, qui s'arrête à la demande",
  "Городской автобус большой вместимости": "Un autobus urbain de grande capacité",
  "Такси с несколькими пассажирами": "Un taxi à plusieurs passagers",
  "Пригородный поезд": "Un train de banlieue",
  "Платят при входе или при выходе. Пригородный поезд называется электричкой.":
    "On paie en montant ou en descendant. Le train de banlieue, lui, s'appelle elektritchka.",
  "Сочетается ли уменьшительное имя с отчеством?":
    "La forme familière du prénom se combine-t-elle avec le patronyme ?",
  "Да, в неофициальной обстановке": "Oui, dans un cadre informel",
  "Сочетается только у женских имён": "Elle ne se combine que pour les prénoms féminins",
  "Нет: с отчеством идёт только полное имя":
    "Non : avec le patronyme, seul le prénom complet s'emploie",
  "Да, так говорят с молодыми коллегами": "Oui, c'est ainsi qu'on parle aux jeunes collègues",
  "Уменьшительное имя между знакомыми — норма, а не фамильярность, но рядом с отчеством оно не стоит.":
    "La forme familière entre gens qui se connaissent est la norme et non une familiarité, mais elle ne se place pas à côté du patronyme.",
  "В скольких российских городах работает метро?":
    "Dans combien de villes russes le métro fonctionne-t-il ?",
  "В каждом городе-миллионнике": "Dans chaque ville de plus d'un million d'habitants",
  "В семи": "Dans sept",
  "Только в Москве и Санкт-Петербурге": "Seulement à Moscou et à Saint-Pétersbourg",
  "В двадцати с лишним": "Dans une vingtaine et plus",
  "Москва, Санкт-Петербург, Нижний Новгород, Новосибирск, Самара, Екатеринбург и Казань. В остальных городах ходят автобусы, троллейбусы и трамваи.":
    "Moscou, Saint-Pétersbourg, Nijni Novgorod, Novossibirsk, Samara, Iekaterinbourg et Kazan. Dans les autres villes circulent des autobus, des trolleybus et des tramways.",
  "Почему жильцы не включают отопление в квартире сами?":
    "Pourquoi les habitants n'allument-ils pas eux-mêmes le chauffage dans leur appartement ?",
  "Это запрещено правилами дома": "Le règlement de l'immeuble l'interdit",
  "Отопление включают только по заявлению жильцов":
    "Le chauffage ne s'allume que sur demande des habitants",
  "Каждая квартира отапливается своим котлом":
    "Chaque appartement est chauffé par sa propre chaudière",
  "Тепло идёт из общей котельной сразу на весь район":
    "La chaleur vient d'une chaufferie commune, d'un coup pour tout le quartier",
  "Поэтому и решение о начале сезона принимается по погоде: когда среднесуточная температура пять дней держится ниже +8 °C.":
    "C'est pourquoi l'ouverture de la saison se décide selon le temps qu'il fait : quand la température moyenne du jour reste sous +8 °C cinq jours de suite.",
};
