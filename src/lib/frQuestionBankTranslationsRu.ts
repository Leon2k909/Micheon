/**
 * Russian for the Vivre en France practice questions.
 *
 * The lesson cards are answered by VIVRE_EN_FRANCE_RU. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in Russian and then asked its
 * questions in French.
 *
 * Keyed on the FRENCH source text exactly as it appears in frQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an e for
 * an é or a straight apostrophe for a typographic one, and the lookup misses
 * in silence. The question renders in French, the tap works, and nothing
 * anywhere reports it.
 *
 * WHAT STAYS FRENCH follows VIVRE_EN_FRANCE_RU exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The line runs where Russian itself
 * draws it:
 *
 *   - an institution Russian has a name for gets that name — Сенат,
 *     Национальное собрание, Конституционный совет, Защитник прав, префект,
 *     Марианна, Елисейский дворец;
 *   - what a reader meets printed on a form, a card or a payslip keeps its
 *     French — laïcité, SMIC, Assurance maladie, Sécurité sociale, la carte
 *     Vitale, le baccalauréat;
 *   - where the Russian name is clear but the French word is the one on the
 *     door, the Russian leads and the French follows in brackets, the way the
 *     course table writes the labour court.
 *
 * Options are plain strings in this bank, not objects as in the lesson quiz
 * blocks, and the four of a question are only ever told apart by their text:
 * two options that come back the same Russian sentence make a question with
 * no answer. Each is translated so the four stay four.
 *
 * check-ru-bank-translation refuses a single missing string, a key that no
 * question contains, a key another Russian table already claims, and a
 * rendering that drops one of the counter-words above.
 */
export const FR_QUESTION_BANK_RU: Record<string, string> = {
  "Quelle est la devise de la République française ?": "Каков девиз Французской Республики?",
  "Unité, Travail, Justice": "Единство, труд, справедливость",
  "Honneur et Patrie": "Честь и Отечество",
  "Paix, Travail, Progrès": "Мир, труд, прогресс",
  "Liberté, Égalité, Fraternité. Elle figure à l'article 2 de la Constitution et au fronton des bâtiments publics.":
    "Свобода, равенство, братство. Он стоит в статье 2 Конституции и на фронтонах общественных зданий.",
  "Lequel de ces symboles représente la République française ?":
    "Какой из этих знаков представляет Французскую Республику?",
  "L'aigle impérial": "Императорский орёл",
  "La fleur de lys": "Лилия",
  "Le lion couronné": "Коронованный лев",
  "Marianne. La fleur de lys était l'emblème de la monarchie et l'aigle celui de l'Empire.":
    "Марианна. Лилия была эмблемой монархии, а орёл — империи.",
  "Où peut-on voir la devise de la République ?": "Где можно увидеть девиз Республики?",
  "Au fronton des mairies et des écoles": "На фронтонах мэрий и школ",
  "Uniquement sur les passeports": "Только на паспортах",
  "Uniquement dans les églises": "Только в церквях",
  "Uniquement au Parlement européen": "Только в Европейском парламенте",
  "Sur les bâtiments publics — mairies, écoles, tribunaux — ainsi que sur les pièces de monnaie et les documents officiels.":
    "На общественных зданиях — мэриях, школах, судах — а также на монетах и в официальных документах.",
  "Sur quel document peut-on voir Marianne ?": "На каком документе можно увидеть Марианну?",
  "Sur les timbres-poste": "На почтовых марках",
  "Sur les factures d'électricité": "На счетах за электричество",
  "Sur les billets de train": "На железнодорожных билетах",
  "Sur les ordonnances médicales": "На врачебных рецептах",
  "Sur les timbres, sur les pièces d'euro françaises et sur les documents officiels. Son buste est aussi présent dans les mairies.":
    "На марках, на французских монетах евро и в официальных документах. Её бюст стоит также в мэриях.",
  "Quel symbole de la République peut-on voir sur les maillots de l'équipe de France de football ?":
    "Какой знак Республики можно увидеть на футболках сборной Франции по футболу?",
  "Le coq": "Петух",
  "La tour Eiffel": "Эйфелева башня",
  "Le coq gaulois. C'est un symbole populaire de la France, plus ancien que la République elle-même.":
    "Галльский петух. Это народный знак Франции, более старый, чем сама Республика.",
  "Que commémore la fête nationale du 14 juillet ?":
    "Что вспоминают в национальный праздник 14 июля?",
  "La prise de la Bastille et la Fête de la Fédération": "Взятие Бастилии и Праздник Федерации",
  "La fin de la Seconde Guerre mondiale": "Конец Второй мировой войны",
  "La signature du traité de Maastricht": "Подписание Маастрихтского договора",
  "L'abolition de l'esclavage": "Отмену рабства",
  "La prise de la Bastille du 14 juillet 1789 et la Fête de la Fédération du 14 juillet 1790, qui célébrait l'unité de la nation.":
    "Взятие Бастилии 14 июля 1789 года и Праздник Федерации 14 июля 1790 года, который отмечал единство нации.",
  "Complétez les paroles de La Marseillaise : « Allons enfants de la Patrie... »":
    "Дополни слова «Марсельезы»: «Вперёд, сыны Отечества...»",
  "« ...le jour de gloire est arrivé ! »": "«...день славы настал!»",
  "« ...la liberté nous appelle ! »": "«...свобода зовёт нас!»",
  "« ...le drapeau nous rassemble ! »": "«...знамя собирает нас!»",
  "« ...la République est en marche ! »": "«...Республика в пути!»",
  "« Allons enfants de la Patrie, le jour de gloire est arrivé ! » Ce sont les deux premiers vers de l'hymne national.":
    "«Вперёд, сыны Отечества, день славы настал!» Это первые два стиха государственного гимна.",
  "Peut-on brûler publiquement un drapeau français ?":
    "Можно ли прилюдно сжечь французский флаг?",
  "Non, c'est une infraction": "Нет, это правонарушение",
  "Oui, c'est protégé par la liberté d'expression": "Да, это защищено свободой слова",
  "Oui, lors d'une manifestation déclarée": "Да, на заявленной демонстрации",
  "Oui, si le drapeau vous appartient": "Да, если флаг принадлежит вам",
  "Non. L'outrage public au drapeau tricolore est une infraction, y compris lors d'une manifestation.":
    "Нет. Прилюдное надругательство над трёхцветным флагом является правонарушением, в том числе на демонстрации.",
  "Lequel de ces prénoms évoque un symbole de la République ?":
    "Какое из этих имён вызывает в памяти знак Республики?",
  "Joséphine": "Жозефина",
  "Adélaïde": "Аделаида",
  "Clotilde": "Клотильда",
  "Marianne est la figure allégorique de la République. Les trois autres sont des prénoms sans portée symbolique républicaine.":
    "Марианна — иносказательный образ Республики. Три остальных имени республиканского смысла не несут.",
  "Lesquels sont des symboles officiels de la République française ?":
    "Какие из них являются официальными знаками Французской Республики?",
  "Le drapeau tricolore, La Marseillaise et la devise": "Трёхцветный флаг, «Марсельеза» и девиз",
  "Le coq, le béret et la baguette": "Петух, берет и багет",
  "La tour Eiffel et le Louvre": "Эйфелева башня и Лувр",
  "Le lys, la couronne et le sceptre": "Лилия, корона и скипетр",
  "L'article 2 de la Constitution nomme le drapeau tricolore, l'hymne national et la devise. Le coq est populaire mais pas officiel.":
    "Статья 2 Конституции называет трёхцветный флаг, государственный гимн и девиз. Петух любим в народе, но официальным знаком не является.",
  "De quelles couleurs est le drapeau français ?": "Какого цвета французский флаг?",
  "Bleu, blanc, rouge": "Синий, белый, красный",
  "Rouge, jaune, noir": "Красный, жёлтый, чёрный",
  "Bleu, jaune, rouge": "Синий, жёлтый, красный",
  "Vert, blanc, rouge": "Зелёный, белый, красный",
  "Bleu, blanc, rouge, en trois bandes verticales. Le bleu et le rouge viennent de Paris, le blanc de la royauté.":
    "Синий, белый, красный, тремя отвесными полосами. Синий и красный идут от Парижа, белый — от королевской власти.",
  "Qu'est-ce qu'une liberté ?": "Что такое свобода?",
  "Le droit de faire ce que l'on veut sans nuire à autrui":
    "Право делать то, что не вредит другому",
  "Le droit de faire absolument tout ce que l'on veut":
    "Право делать решительно всё, что хочешь",
  "Une autorisation délivrée par la mairie": "Разрешение, выдаваемое мэрией",
  "Un avantage réservé aux citoyens français": "Преимущество, отведённое французским гражданам",
  "L'article 4 de la Déclaration de 1789 : « La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. »":
    "Статья 4 Декларации 1789 года: «Свобода состоит в возможности делать всё, что не вредит другому».",
  "La liberté d'association est :": "Свобода объединений:",
  "un droit garanti, sans autorisation préalable":
    "право, обеспеченное без предварительного разрешения",
  "soumise à l'accord du préfet": "требует согласия префекта",
  "réservée aux personnes de nationalité française": "отведена лицам французского гражданства",
  "interdite aux salariés": "запрещена наёмным работникам",
  "Depuis la loi de 1901, créer une association demande une simple déclaration. Aucune autorisation n'est nécessaire.":
    "С закона 1901 года создание объединения требует простого заявления. Никакого разрешения не нужно.",
  "La liberté d'expression sur les réseaux sociaux en France est :":
    "Свобода слова в социальных сетях во Франции:",
  "encadrée par la loi, comme partout ailleurs": "ограничена законом, как и везде",
  "totale et sans limite": "полная и без границ",
  "interdite aux personnes étrangères": "запрещена иностранцам",
  "soumise à une autorisation préalable": "требует предварительного разрешения",
  "La loi s'applique en ligne comme hors ligne : injure, diffamation, incitation à la haine et apologie du terrorisme restent des délits.":
    "Закон действует в сети так же, как вне её: оскорбление, клевета, разжигание ненависти и оправдание терроризма остаются преступлениями.",
  "En quoi consiste le devoir de solidarité ?": "В чём состоит долг солидарности?",
  "Contribuer à la vie collective et venir en aide aux autres":
    "Участвовать в общей жизни и приходить другим на помощь",
  "Adhérer à une association humanitaire": "Вступить в благотворительное объединение",
  "Donner de l'argent à une œuvre chaque année": "Каждый год отдавать деньги на доброе дело",
  "Travailler bénévolement pour la commune": "Работать на общину безвозмездно",
  "Il se traduit concrètement par l'impôt, les cotisations sociales et l'obligation de porter secours à une personne en danger.":
    "На деле он выражается в налогах, социальных взносах и обязанности прийти на помощь человеку в опасности.",
  "Que permet la liberté de circulation ?": "Что даёт свобода передвижения?",
  "Se déplacer et s'installer librement, quitter le pays et y revenir":
    "Свободно перемещаться и селиться, покидать страну и возвращаться в неё",
  "Circuler sans permis de conduire": "Ездить без водительских прав",
  "Entrer dans tout bâtiment public à toute heure":
    "Входить в любое общественное здание в любой час",
  "Choisir librement sa commune d'imposition": "Свободно выбирать общину, где платить налоги",
  "Elle couvre le déplacement à l'intérieur du territoire, le choix du domicile, la sortie du pays et le retour.":
    "Она охватывает перемещение внутри страны, выбор места жительства, выезд из страны и возвращение.",
  "Qu'est-ce que la liberté d'expression ?": "Что такое свобода слова?",
  "Le droit d'exprimer ses opinions dans les limites fixées par la loi":
    "Право высказывать свои мнения в границах, установленных законом",
  "Le droit de dire n'importe quoi sans conséquence":
    "Право говорить что угодно без последствий",
  "Le droit réservé aux journalistes de publier":
    "Право печататься, отведённое одним журналистам",
  "Le droit de manifester sans déclaration": "Право выходить на демонстрацию без заявления",
  "C'est un droit fondamental, mais encadré : l'injure, la diffamation et l'incitation à la haine ne sont pas des opinions, ce sont des délits.":
    "Это основное право, но ограниченное: оскорбление, клевета и разжигание ненависти не суть мнения, а преступления.",
  "Pour quel motif peut-on limiter la liberté d'expression ?":
    "По какому основанию можно ограничить свободу слова?",
  "La protection de l'ordre public et des droits d'autrui":
    "Защита общественного порядка и прав другого",
  "Le désaccord d'un ministre": "Несогласие министра",
  "La demande d'une entreprise privée": "Требование частного предприятия",
  "Le vote d'une assemblée de copropriété": "Решение собрания жильцов",
  "Seule la loi peut limiter cette liberté, et seulement pour protéger l'ordre public, la dignité et les droits des autres.":
    "Ограничить эту свободу может только закон, и только чтобы защитить общественный порядок, достоинство и права других.",
  "Que garantit la liberté de la presse ?": "Что обеспечивает свобода печати?",
  "Que les journalistes peuvent informer sans censure préalable":
    "Что журналисты могут сообщать без предварительной цензуры",
  "Que tous les journaux sont gratuits": "Что все газеты бесплатны",
  "Que l'État choisit les articles publiés": "Что государство выбирает публикуемые статьи",
  "Que seuls les journalistes peuvent s'exprimer": "Что высказываться могут только журналисты",
  "Elle protège le droit d'informer et celui d'être informé. Elle date de la loi de 1881 et n'autorise pas pour autant la diffamation.":
    "Она защищает право сообщать и право быть осведомлённым. Она идёт от закона 1881 года и клеветы при этом не разрешает.",
  "Quelle situation est une atteinte à la dignité humaine ?":
    "Какое положение является посягательством на человеческое достоинство?",
  "Loger des travailleurs dans un local insalubre en les payant au noir":
    "Селить работников в непригодном помещении, платя им без оформления",
  "Refuser une augmentation de salaire": "Отказать в прибавке к жалованью",
  "Demander une pièce d'identité à un guichet": "Попросить удостоверение личности у окошка",
  "Imposer un uniforme dans une entreprise": "Ввести на предприятии форменную одежду",
  "L'exploitation par le logement indigne et le travail dissimulé porte atteinte à la dignité, qui est un principe à valeur constitutionnelle.":
    "Пользование людьми через негодное жильё и работу без оформления посягает на достоинство, а это начало конституционного значения.",
  "L'article 4 de la Déclaration de 1789 affirme que la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. Qu'est-ce que cela signifie ?":
    "Статья 4 Декларации 1789 года утверждает, что свобода состоит в возможности делать всё, что не вредит другому. Что это значит?",
  "Ma liberté s'arrête là où commence celle des autres":
    "Моя свобода кончается там, где начинается свобода других",
  "Je peux tout faire tant que personne ne me voit":
    "Я могу делать всё, пока меня никто не видит",
  "La liberté n'existe que pour les citoyens": "Свобода существует только для граждан",
  "Seul l'État décide ce qui est permis": "Что дозволено, решает одно государство",
  "C'est la règle de partage : chacun est libre jusqu'au point où son action porte atteinte à autrui.":
    "Это правило раздела: каждый свободен до той черты, за которой его действие задевает другого.",
  "Tous les citoyens français ont-ils une religion ?":
    "У всех ли французских граждан есть религия?",
  "Non, chacun est libre de croire ou de ne pas croire":
    "Нет, каждый волен верить или не верить",
  "Oui, la loi impose d'en déclarer une": "Да, закон обязывает объявить о ней",
  "Oui, mais seulement à la naissance": "Да, но только при рождении",
  "Non, mais il faut le signaler à la mairie": "Нет, но об этом нужно сообщить в мэрию",
  "La liberté de conscience comprend le droit de n'avoir aucune religion. L'État ne tient d'ailleurs aucun registre des croyances.":
    "Свобода совести включает право не иметь никакой религии. Государство к тому же не ведёт никакого учёта верований.",
  "Qu'est-ce que la laïcité ?": "Что такое laïcité, светскость?",
  "La séparation des institutions publiques et des religions, avec la liberté de conscience":
    "Отделение общественных учреждений от религий вместе со свободой совести",
  "L'interdiction de toute religion en France": "Запрет всякой религии во Франции",
  "L'obligation d'être athée pour travailler dans le public":
    "Обязанность быть безбожником, чтобы работать в государственной службе",
  "La reconnaissance d'une religion officielle": "Признание официальной религии",
  "Trois idées : liberté de conscience, séparation de l'État et des cultes, égalité de tous quelles que soient leurs croyances.":
    "Три мысли: свобода совести, отделение государства от вероисповеданий и равенство всех, каковы бы ни были их верования.",
  "Que garantit le principe de laïcité ?": "Что обеспечивает начало laïcité?",
  "La liberté de croire, de ne pas croire et de changer de conviction":
    "Свободу верить, не верить и менять убеждения",
  "Que chaque religion reçoit une aide de l'État":
    "Что каждая религия получает помощь от государства",
  "Que les religions choisissent les programmes scolaires":
    "Что религии выбирают школьные программы",
  "Que les fêtes religieuses sont toutes fériées":
    "Что все религиозные праздники являются выходными",
  "Elle garantit la liberté de conscience et l'égalité de traitement, sans que l'État privilégie ou finance un culte.":
    "Оно обеспечивает свободу совести и равное обращение, причём государство ни одному вероисповеданию не отдаёт предпочтения и ни одного не оплачивает.",
  "Que dit la loi de 1905 ?": "Что говорит закон 1905 года?",
  "Que la République ne reconnaît ni ne salarie aucun culte":
    "Что Республика не признаёт и не оплачивает никакого вероисповедания",
  "Que les religions sont interdites dans l'espace public":
    "Что религии запрещены в общественном пространстве",
  "Que l'école devient gratuite": "Что школа становится бесплатной",
  "Que le clergé est nommé par l'État": "Что духовенство назначается государством",
  "Son article 1er garantit la liberté de conscience, son article 2 pose que la République ne reconnaît, ne salarie ni ne subventionne aucun culte.":
    "Его статья 1 обеспечивает свободу совести, а статья 2 полагает, что Республика не признаёт, не оплачивает и не содержит никакого вероисповедания.",
  "Quel texte est considéré comme le texte fondateur de la laïcité ?":
    "Какой текст считают основополагающим для laïcité?",
  "La Déclaration de 1789": "Декларация 1789 года",
  "La loi de séparation des Églises et de l'État du 9 décembre 1905. Les autres textes sont fondateurs, mais d'autre chose.":
    "Закон об отделении церквей от государства от 9 декабря 1905 года. Остальные тексты тоже основополагающие, но для другого.",
  "Quel jour célèbre-t-on officiellement la laïcité en France ?":
    "В какой день во Франции официально отмечают laïcité?",
  "Le 9 décembre": "9 декабря",
  "Le 1er mai": "1 мая",
  "Le 11 novembre": "11 ноября",
  "Le 9 décembre, date anniversaire de la loi de 1905.":
    "9 декабря, в годовщину закона 1905 года.",
  "Quelle institution française doit rester neutre en matière de religion ?":
    "Какое французское учреждение обязано оставаться беспристрастным в делах религии?",
  "L'État et ses services publics": "Государство и его общественные службы",
  "Les associations culturelles": "Культурные объединения",
  "Les entreprises privées": "Частные предприятия",
  "Les familles": "Семьи",
  "La neutralité s'impose à l'État et à ses agents. Les usagers, les familles et les associations restent libres.":
    "Беспристрастность обязательна для государства и его служащих. Посетители, семьи и объединения остаются свободны.",
  "Quel symbole religieux peut être porté dans une école publique dans le respect de la laïcité ?":
    "Какой религиозный знак можно носить в государственной школе, не нарушая laïcité?",
  "Un signe discret, non ostensible": "Неброский, не выставляемый напоказ",
  "N'importe quel signe, sans limite": "Любой знак, без ограничений",
  "Aucun signe, même invisible": "Никакой, даже незаметный",
  "Uniquement les signes chrétiens": "Только христианские",
  "La loi de 2004 interdit les signes ostensibles à l'école publique. Un bijou discret n'est pas concerné.":
    "Закон 2004 года запрещает в государственной школе знаки, выставляемые напоказ. Неброского украшения это не касается.",
  "À l'école, la charte de la laïcité permet de :": "В школе хартия laïcité позволяет:",
  "expliquer aux élèves et aux familles ce que la laïcité permet et interdit":
    "объяснить ученикам и семьям, что laïcité позволяет и что запрещает",
  "choisir un enseignement religieux": "выбрать религиозное обучение",
  "dispenser certains élèves des cours": "освободить некоторых учеников от уроков",
  "organiser des célébrations religieuses": "устраивать религиозные обряды",
  "Affichée dans les écoles depuis 2013, elle énonce en quinze articles ce que la laïcité signifie au quotidien scolaire.":
    "Вывешенная в школах с 2013 года, она излагает в пятнадцати статьях, что laïcité означает в школьной повседневности.",
  "En France, il est possible pour l'État de financer :":
    "Во Франции государство может оплачивать:",
  "l'entretien des édifices religieux construits avant 1905":
    "содержание религиозных зданий, построенных до 1905 года",
  "le salaire des ministres du culte": "жалованье служителям культа",
  "la construction de nouveaux lieux de culte": "постройку новых мест отправления культа",
  "les activités de propagande religieuse": "работу по распространению веры",
  "L'État est propriétaire des édifices antérieurs à 1905 et en assure l'entretien. Il ne salarie ni ne subventionne aucun culte.":
    "Государство владеет зданиями, построенными до 1905 года, и содержит их. Ни одного вероисповедания оно не оплачивает и не содержит.",
  "Quel terme désigne précisément la haine ou les préjugés contre les Juifs ?":
    "Какое слово точно обозначает ненависть или предубеждение против евреев?",
  "L'antisémitisme": "Антисемитизм",
  "La xénophobie": "Ксенофобия",
  "Le sexisme": "Женоненавистничество",
  "L'anticléricalisme": "Антиклерикализм",
  "L'antisémitisme. La xénophobie vise les étrangers en général ; l'anticléricalisme s'oppose au pouvoir du clergé.":
    "Антисемитизм. Ксенофобия направлена на иностранцев вообще; антиклерикализм противостоит власти духовенства.",
  "Un agent d'accueil d'une mairie peut-il porter un signe religieux visible pendant son service ?":
    "Может ли служащий в приёмной мэрии носить на службе видимый религиозный знак?",
  "Non : la neutralité s'impose aux agents publics":
    "Нет: беспристрастность обязательна для государственных служащих",
  "Oui, c'est sa liberté de conscience": "Да, это его свобода совести",
  "Oui, si son responsable l'autorise": "Да, если начальник разрешит",
  "Oui, en dehors des heures d'ouverture au public": "Да, вне часов приёма посетителей",
  "Un agent public représente l'État pendant son service et doit être neutre. L'usager qui vient au guichet, lui, reste libre.":
    "Государственный служащий на службе представляет государство и обязан быть беспристрастным. Посетитель у окошка, напротив, остаётся свободен.",
  "Qui a le droit de se syndiquer ?": "Кто имеет право вступать в профсоюз?",
  "Tout salarié, quelle que soit sa nationalité":
    "Любой наёмный работник, каково бы ни было его гражданство",
  "Seuls les salariés français": "Только французские работники",
  "Seuls les salariés en contrat à durée indéterminée":
    "Только работники с бессрочным договором",
  "Seuls les cadres": "Только руководящие работники",
  "La liberté syndicale vaut pour tous les salariés. Nul ne peut être sanctionné pour y avoir adhéré — ni pour ne pas l'avoir fait.":
    "Свобода профсоюзов действует для всех наёмных работников. Никого нельзя наказать за вступление — как и за невступление.",
  "En France, est-ce possible d'adhérer à un parti politique ?":
    "Можно ли во Франции вступить в политическую партию?",
  "Oui, librement": "Да, свободно",
  "Non, c'est réservé aux élus": "Нет, это отведено выборным лицам",
  "Oui, mais avec l'autorisation de la préfecture": "Да, но с разрешения префектуры",
  "Non, les partis sont interdits": "Нет, партии запрещены",
  "Les partis se forment et exercent leur activité librement. Adhérer, ou n'adhérer à aucun, est un choix personnel.":
    "Партии образуются и действуют свободно. Вступить или не вступать ни в одну — личный выбор.",
  "Une manifestation sur la voie publique doit-elle être signalée ?":
    "Нужно ли заявлять о демонстрации на улице?",
  "Oui, elle doit être déclarée en préfecture": "Да, о ней нужно заявить в префектуру",
  "Non, aucune formalité n'est nécessaire": "Нет, никаких формальностей не требуется",
  "Oui, elle doit être autorisée par le maire": "Да, её должен разрешить мэр",
  "Oui, elle doit être approuvée par un juge": "Да, её должен одобрить судья",
  "Une déclaration préalable, pas une autorisation : l'administration en est informée et peut l'interdire seulement en cas de risque avéré pour l'ordre public.":
    "Предварительное заявление, а не разрешение: власть о ней извещают, и запретить её она может только при доказанной угрозе общественному порядку.",
  "Un salarié peut-il être licencié parce qu'il a fait grève ?":
    "Можно ли уволить работника за участие в забастовке?",
  "Non, la grève est un droit constitutionnel": "Нет, забастовка есть конституционное право",
  "Oui, après deux jours d'absence": "Да, после двух дней отсутствия",
  "Oui, si l'entreprise perd de l'argent": "Да, если предприятие теряет деньги",
  "Oui, si le syndicat n'est pas représentatif": "Да, если профсоюз не представителен",
  "L'exercice normal du droit de grève ne peut justifier ni licenciement ni sanction. Seule une faute lourde commise pendant la grève le pourrait.":
    "Обычное пользование правом на забастовку не может оправдать ни увольнения, ни наказания. Это могла бы сделать только тяжкая вина, совершённая во время забастовки.",
  "Qu'est-ce que la liberté d'association permet exactement ?":
    "Что именно позволяет свобода объединений?",
  "Créer une association, y adhérer ou n'en rejoindre aucune":
    "Создать объединение, вступить в него или не вступать ни в одно",
  "Obliger ses collègues à rejoindre une association":
    "Заставить сослуживцев вступить в объединение",
  "Créer une association exemptée d'impôts": "Создать объединение, свободное от налогов",
  "Fonder un parti sans déclaration": "Основать партию без заявления",
  "Elle comprend la liberté négative : personne ne peut être contraint d'adhérer à une association.":
    "Она включает свободу отрицательную: никого нельзя принудить вступить в объединение.",
  "Dans quel cas une liberté peut-elle être restreinte en France ?":
    "В каком случае свободу во Франции можно ограничить?",
  "Lorsqu'une loi le prévoit pour protéger l'ordre public":
    "Когда это предусматривает закон ради защиты общественного порядка",
  "Lorsqu'une majorité de citoyens le souhaite": "Когда этого хочет большинство граждан",
  "Lorsqu'un ministre le décide": "Когда так решит министр",
  "Lorsque cela arrange une administration": "Когда это удобно ведомству",
  "La restriction doit être prévue par la loi, proportionnée et justifiée par l'ordre public — sécurité, santé publique, droits d'autrui.":
    "Ограничение должно быть предусмотрено законом, соразмерно и оправдано общественным порядком — безопасностью, здоровьем населения, правами других.",
  "Un message haineux publié sur un réseau social est :":
    "Сообщение, разжигающее ненависть, размещённое в социальной сети, есть:",
  "une infraction, comme s'il avait été dit en public":
    "правонарушение, как если бы оно было сказано прилюдно",
  "protégé par l'anonymat": "нечто защищённое безымянностью",
  "une simple opinion": "просто мнение",
  "sanctionné uniquement par la plateforme": "нечто, наказуемое одной лишь площадкой",
  "La loi s'applique en ligne. L'incitation à la haine, l'injure publique et le harcèlement sont punis, l'anonymat n'y change rien.":
    "Закон действует и в сети. Разжигание ненависти, прилюдное оскорбление и травля наказуемы, и безымянность здесь ничего не меняет.",
  "Un employeur peut-il interdire à un salarié d'adhérer à un syndicat ?":
    "Может ли работодатель запретить работнику вступать в профсоюз?",
  "Non, c'est une discrimination interdite": "Нет, это запрещённая дискриминация",
  "Oui, s'il l'écrit dans le contrat": "Да, если запишет это в договоре",
  "Oui, pendant la période d'essai": "Да, на испытательном сроке",
  "Oui, dans les petites entreprises": "Да, на малых предприятиях",
  "Toute mesure prise contre un salarié en raison de son activité syndicale est une discrimination sanctionnée par la loi.":
    "Любая мера против работника из-за его профсоюзной работы есть дискриминация, наказуемая по закону.",
  "La liberté de conscience comprend :": "Свобода совести включает:",
  "le droit de croire, de ne pas croire et de changer d'avis":
    "право верить, не верить и передумать",
  "le droit d'imposer sa croyance aux autres": "право навязывать свою веру другим",
  "le droit de refuser d'appliquer la loi": "право отказаться исполнять закон",
  "le droit d'être dispensé de l'école": "право быть освобождённым от школы",
  "Elle porte sur ce que l'on pense et croit, jamais sur le droit de se soustraire à la loi commune.":
    "Она касается того, что человек думает и во что верит, и никогда — права уклониться от общего закона.",
  "Quelle liberté la loi de 1881 a-t-elle établie ?": "Какую свободу установил закон 1881 года?",
  "La liberté de la presse": "Свободу печати",
  "La liberté d'association": "Свободу объединений",
  "La liberté de culte": "Свободу вероисповедания",
  "La liberté syndicale": "Свободу профсоюзов",
  "La loi du 29 juillet 1881 sur la liberté de la presse. Celle de 1901 concerne les associations, celle de 1905 la laïcité.":
    "Закон от 29 июля 1881 года о свободе печати. Закон 1901 года касается объединений, закон 1905 года — laïcité.",
  "Peut-on critiquer publiquement le gouvernement en France ?":
    "Можно ли во Франции прилюдно критиковать правительство?",
  "Non, c'est un outrage": "Нет, это оскорбление власти",
  "Oui, mais uniquement par écrit": "Да, но только письменно",
  "Oui, avec l'accord de la préfecture": "Да, с согласия префектуры",
  "Critiquer le pouvoir est le cœur même de la liberté d'expression. Les limites concernent l'injure, la diffamation et l'incitation à la haine, pas la critique politique.":
    "Критика власти есть само сердце свободы слова. Границы касаются оскорбления, клеветы и разжигания ненависти, а не политической критики.",
  "En France, les impôts permettent de financer les dépenses publiques. Quelle proposition est correcte ?":
    "Во Франции налоги позволяют оплачивать общественные расходы. Какое утверждение верно?",
  "Ils financent les écoles, les hôpitaux, la police et la justice":
    "Они оплачивают школы, больницы, полицию и правосудие",
  "Ils servent uniquement à payer les fonctionnaires": "Они идут только на жалованье чиновникам",
  "Ils sont versés aux entreprises privées": "Их отдают частным предприятиям",
  "Ils financent uniquement la défense": "Они оплачивают одну только оборону",
  "L'impôt paie l'ensemble des services publics : éducation, santé, sécurité, justice, transports, aides sociales.":
    "Налог оплачивает все общественные службы: образование, здравоохранение, безопасность, правосудие, транспорт, социальную помощь.",
  "Est-ce obligatoire de déclarer ses impôts chaque année en France ?":
    "Обязательно ли во Франции каждый год подавать налоговую декларацию?",
  "Oui, même si l'on n'est pas imposable": "Да, даже если налог платить не придётся",
  "Non, seulement si l'on gagne beaucoup": "Нет, только если много зарабатываешь",
  "Non, l'administration s'en charge seule": "Нет, ведомство делает это само",
  "Oui, mais une année sur deux": "Да, но раз в два года",
  "La déclaration est annuelle et obligatoire. Elle sert aussi à ouvrir des droits — aides au logement, bourses, tarifs sociaux.":
    "Декларация ежегодна и обязательна. Она же открывает права — помощь на жильё, стипендии, льготные тарифы.",
  "Quel est l'un des devoirs principaux d'un citoyen français ?":
    "Что относится к главным обязанностям французского гражданина?",
  "Payer ses impôts et respecter la loi": "Платить налоги и соблюдать закон",
  "Adhérer à un parti politique": "Состоять в политической партии",
  "Assister à toutes les commémorations": "Присутствовать на всех памятных торжествах",
  "Pratiquer une religion": "Исповедовать религию",
  "Respecter la loi, payer l'impôt, porter secours et répondre à une convocation comme juré sont des devoirs civiques.":
    "Соблюдать закон, платить налог, приходить на помощь и являться по вызову в качестве присяжного — вот гражданские обязанности.",
  "À quoi sert la Sécurité sociale ?": "Для чего служит Sécurité sociale?",
  "À couvrir la maladie, la vieillesse, la famille et les accidents du travail":
    "Чтобы покрывать болезнь, старость, семью и несчастные случаи на работе",
  "À financer les partis politiques": "Чтобы содержать политические партии",
  "À payer les impôts locaux": "Чтобы платить местные налоги",
  "À assurer les biens et les logements": "Чтобы страховать имущество и жильё",
  "Créée en 1945, elle mutualise les risques de la vie : santé, retraite, famille, accidents du travail.":
    "Созданная в 1945 году, она делит между всеми жизненные риски: здоровье, пенсию, семью, несчастные случаи на работе.",
  "Un service public doit traiter les usagers :":
    "Общественная служба обязана обращаться с посетителями:",
  "de la même façon, sans distinction d'origine ni de religion":
    "одинаково, без различия происхождения и религии",
  "en priorité selon leur ancienneté dans la commune":
    "в первую очередь по давности проживания в общине",
  "selon le montant de leurs impôts": "по размеру их налогов",
  "selon leur nationalité": "по их гражданству",
  "L'égalité de traitement est un principe du service public, avec la neutralité et la continuité.":
    "Равное обращение — начало общественной службы, наряду с беспристрастностью и непрерывностью.",
  "Où s'inscrit-on sur les listes électorales quand on n'a pas d'accès à internet ?":
    "Где вносят себя в списки избирателей, если нет доступа к интернету?",
  "À la mairie de son domicile": "В мэрии по месту жительства",
  "Au tribunal": "В суде",
  "En ligne ou, sans internet, directement à la mairie de la commune où l'on habite.":
    "В сети или, без интернета, прямо в мэрии той общины, где живёшь.",
  "Que se passe-t-il si l'on ne déclare pas ses revenus ?":
    "Что происходит, если не подать декларацию о доходах?",
  "On s'expose à des pénalités et, dans les cas graves, à des poursuites":
    "Человек навлекает на себя пени, а в тяжёлых случаях и преследование",
  "Rien, la déclaration est facultative": "Ничего, декларация необязательна",
  "On perd son droit de vote": "Человек теряет право голоса",
  "On est automatiquement exonéré": "Человека сами собой освобождают от налога",
  "Le défaut de déclaration entraîne des majorations, et la fraude fiscale est un délit.":
    "Неподача декларации влечёт надбавки, а налоговый обман является преступлением.",
  "Qui finance les écoles publiques, les hôpitaux et la police ?":
    "Кто оплачивает государственные школы, больницы и полицию?",
  "L'impôt payé par les contribuables": "Налог, который платят налогоплательщики",
  "Les dons des entreprises": "Пожертвования предприятий",
  "L'Union européenne seule": "Один Европейский союз",
  "Les cotisations des syndicats": "Взносы профсоюзов",
  "L'impôt et les cotisations sociales financent les services publics. C'est la traduction concrète de la fraternité.":
    "Общественные службы оплачивают налог и социальные взносы. Это и есть братство на деле.",
  "La continuité du service public signifie :": "Непрерывность общественной службы означает:",
  "qu'il fonctionne sans interruption, avec un service minimum si nécessaire":
    "что она работает без перерыва, при необходимости с наименьшим объёмом услуг",
  "qu'il ne change jamais ses horaires": "что она никогда не меняет часы работы",
  "que les agents ne peuvent pas faire grève": "что её служащие не могут бастовать",
  "que les tarifs restent identiques chaque année": "что тарифы каждый год остаются теми же",
  "La continuité justifie le service minimum dans certains secteurs, mais n'annule pas le droit de grève des agents.":
    "Непрерывность оправдывает наименьший объём услуг в отдельных отраслях, но права служащих на забастовку не отменяет.",
  "Quelle démarche ne se fait PAS à la mairie ?": "Какое дело НЕ решают в мэрии?",
  "La demande d'un titre de séjour": "Заявление на вид на жительство",
  "La déclaration d'une naissance": "Заявление о рождении",
  "L'inscription sur les listes électorales": "Внесение в списки избирателей",
  "La demande d'une carte d'identité": "Заявление на удостоверение личности",
  "Le titre de séjour relève de la préfecture. L'état civil, les listes électorales et les titres d'identité passent par la mairie.":
    "Вид на жительство относится к префектуре. Записи актов, списки избирателей и удостоверения личности идут через мэрию.",
  "Les cotisations sociales prélevées sur un salaire servent à :":
    "Социальные взносы, удерживаемые из заработка, служат:",
  "financer la santé, la retraite et les allocations familiales":
    "оплате здравоохранения, пенсий и семейных пособий",
  "payer l'impôt sur le revenu": "уплате подоходного налога",
  "rémunérer les élus locaux": "жалованью местным выборным лицам",
  "financer les campagnes électorales": "оплате предвыборных кампаний",
  "Elles alimentent la Sécurité sociale. L'impôt sur le revenu, lui, est distinct et se déclare une fois par an.":
    "Они питают Sécurité sociale. Подоходный налог, напротив, стоит отдельно и заявляется раз в год.",
  "Que dit l'article 1er de la Constitution française ?":
    "Что говорит статья 1 французской Конституции?",
  "La France est une République indivisible, laïque, démocratique et sociale":
    "Франция есть неделимая, светская, демократическая и социальная Республика",
  "La France est une monarchie constitutionnelle": "Франция есть конституционная монархия",
  "La France est un État fédéral": "Франция есть федеративное государство",
  "La France reconnaît une religion officielle": "Франция признаёт официальную религию",
  "Quatre adjectifs, dans cet ordre : indivisible, laïque, démocratique et sociale. L'article garantit aussi l'égalité devant la loi sans distinction d'origine, de race ou de religion.":
    "Четыре определения, именно в таком порядке: неделимая, светская, демократическая и социальная. Эта же статья обеспечивает равенство перед законом без различия происхождения, расы и религии.",
  "Qu'est-ce que l'État de droit ?": "Что такое правовое государство?",
  "Un système où tout le monde, y compris l'État, est soumis à la loi":
    "Устройство, при котором закону подчинены все, включая само государство",
  "Un système où l'État peut modifier la loi à tout moment":
    "Устройство, при котором государство может в любое время изменить закон",
  "Un système où seuls les citoyens sont soumis à la loi":
    "Устройство, при котором закону подчинены одни граждане",
  "Un système où le président décide seul": "Устройство, при котором президент решает один",
  "Personne n'est au-dessus des règles. Un citoyen peut faire annuler une décision de l'administration devant un juge.":
    "Никто не стоит выше правил. Гражданин может добиться отмены решения ведомства через суд.",
  "En quelle année la Constitution de la Ve République a-t-elle été adoptée ?":
    "В каком году была принята Конституция Пятой республики?",
  "1962": "1962",
  "Le 4 octobre 1958. La IVe République datait de 1946 ; 1962 est l'année du passage à l'élection du président au suffrage universel direct.":
    "4 октября 1958 года. Четвёртая республика шла от 1946 года; 1962 — год перехода к прямым всеобщим выборам президента.",
  "Quelle est l'une des voies possibles pour modifier la Constitution ?":
    "Каков один из возможных путей изменить Конституцию?",
  "Le référendum ou le vote du Congrès à la majorité des trois cinquièmes":
    "Референдум или голосование Конгресса большинством в три пятых",
  "Une décision du Premier ministre": "Решение премьер-министра",
  "Un vote du Conseil constitutionnel": "Голосование Конституционного совета",
  "Un décret du président de la République": "Указ президента Республики",
  "Après un vote identique des deux chambres, la révision est approuvée soit par référendum, soit par le Congrès réuni à Versailles.":
    "После одинакового голосования обеих палат пересмотр утверждают либо референдумом, либо Конгрессом, собранным в Версале.",
  "Que signifie le mot « indivisible » dans l'article 1er de la Constitution ?":
    "Что означает слово «неделимая» в статье 1 Конституции?",
  "Un seul peuple, un seul territoire, une même loi partout":
    "Один народ, одна земля, один и тот же закон повсюду",
  "Qu'aucune loi ne peut être abrogée": "Что ни один закон не может быть отменён",
  "Que les régions n'existent pas": "Что областей не существует",
  "Que le territoire ne peut pas être vendu": "Что землю нельзя продать",
  "Il n'existe pas de citoyenneté régionale ni de peuple particulier reconnu à l'intérieur de la République.":
    "Внутри Республики не существует ни областного гражданства, ни признанного особого народа.",
  "Que signifie « la France est une République sociale » ?":
    "Что означает «Франция есть социальная Республика»?",
  "L'État garantit une protection : santé, retraite, aide aux plus fragiles":
    "Государство обеспечивает защиту: здоровье, пенсию, помощь самым уязвимым",
  "Tous les revenus sont identiques": "Все доходы одинаковы",
  "L'État possède toutes les entreprises": "Государство владеет всеми предприятиями",
  "Les associations remplacent les services publics": "Объединения заменяют общественные службы",
  "Le caractère social se traduit par la Sécurité sociale, l'école gratuite et les aides aux personnes en difficulté.":
    "Социальный склад выражается в Sécurité sociale, бесплатной школе и помощи людям в затруднении.",
  "Qui a inspiré le principe de la séparation des pouvoirs ?":
    "Кто подсказал начало разделения властей?",
  "Montesquieu": "Монтескьё",
  "Voltaire": "Вольтер",
  "Napoléon Ier": "Наполеон I",
  "Montesquieu, dans De l'esprit des lois (1748). L'idée est de répartir les pouvoirs pour qu'aucun ne devienne absolu.":
    "Монтескьё, в книге «О духе законов» (1748). Мысль в том, чтобы разложить власть так, чтобы ни одна не стала безраздельной.",
  "Le pouvoir de faire la loi s'appelle :": "Власть создавать закон называется:",
  "le pouvoir législatif": "законодательной властью",
  "le pouvoir exécutif": "исполнительной властью",
  "le pouvoir judiciaire": "судебной властью",
  "le pouvoir administratif": "властью управления",
  "Législatif pour faire la loi, exécutif pour l'appliquer, judiciaire pour juger.":
    "Законодательная — чтобы создавать закон, исполнительная — чтобы его применять, судебная — чтобы судить.",
  "Qui a voulu la Constitution de la Ve République ?": "Кто хотел Конституции Пятой республики?",
  "Le général de Gaulle": "Генерал де Голль",
  "Georges Pompidou": "Жорж Помпиду",
  "Charles de Gaulle, appelé au pouvoir en 1958. La Constitution renforce le rôle du président pour sortir de l'instabilité de la IVe République.":
    "Шарль де Голль, призванный к власти в 1958 году. Конституция усиливает роль президента, чтобы выйти из шаткости Четвёртой республики.",
  "Un citoyen estime qu'une décision de l'administration est illégale. Que peut-il faire ?":
    "Гражданин считает решение ведомства незаконным. Что он может сделать?",
  "Saisir un juge pour en demander l'annulation": "Обратиться к судье и потребовать его отмены",
  "Refuser d'appliquer toute autre décision": "Отказаться исполнять любые другие решения",
  "Cesser de payer ses impôts": "Перестать платить налоги",
  "Rien : l'administration a toujours raison": "Ничего: ведомство всегда право",
  "C'est exactement ce que garantit l'État de droit : l'administration peut être jugée, et sa décision annulée.":
    "Именно это и обеспечивает правовое государство: ведомство можно судить, а его решение отменить.",
  "Le Congrès désigne :": "Конгресс означает:",
  "l'Assemblée nationale et le Sénat réunis à Versailles":
    "Национальное собрание и Сенат, собранные вместе в Версале",
  "une réunion du gouvernement": "заседание правительства",
  "un rassemblement des maires de France": "съезд мэров Франции",
  "le Parlement européen": "Европейский парламент",
  "Le Congrès réunit les deux chambres pour approuver une révision de la Constitution à la majorité des trois cinquièmes.":
    "Конгресс сводит обе палаты, чтобы одобрить пересмотр Конституции большинством в три пятых.",
  "Qui dirige l'action du gouvernement ?": "Кто направляет работу правительства?",
  "Le Premier ministre dirige l'action du gouvernement et fait appliquer les lois. Le président de la République est chef de l'État.":
    "Премьер-министр направляет работу правительства и обеспечивает применение законов. Президент Республики есть глава государства.",
  "Quel est le rôle du président de la République ?": "Какова роль президента Республики?",
  "Chef de l'État et chef des armées, il nomme le Premier ministre":
    "Глава государства и главнокомандующий, он назначает премьер-министра",
  "Il vote les lois à l'Assemblée nationale": "Он голосует за законы в Национальном собрании",
  "Il juge les crimes les plus graves": "Он судит самые тяжкие преступления",
  "Il gère les collèges et les lycées": "Он ведает средними школами и лицеями",
  "Il préside le Conseil des ministres, promulgue les lois, nomme le Premier ministre et peut dissoudre l'Assemblée nationale.":
    "Он председательствует в Совете министров, промульгирует законы, назначает премьер-министра и может распустить Национальное собрание.",
  "Quel est le rôle du Premier ministre ?": "Какова роль премьер-министра?",
  "Diriger l'action du gouvernement et faire appliquer les lois":
    "Направлять работу правительства и обеспечивать применение законов",
  "Représenter la France à l'étranger en toutes circonstances":
    "Представлять Францию за границей при всех обстоятельствах",
  "Présider le Conseil constitutionnel": "Председательствовать в Конституционном совете",
  "Élire le président de la République": "Избирать президента Республики",
  "Il propose les ministres, coordonne leur action et dispose de l'administration. Il est responsable devant l'Assemblée nationale.":
    "Он предлагает министров, согласует их работу и располагает управлением. Он ответственен перед Национальным собранием.",
  "Qui peut se présenter aux élections présidentielles ?":
    "Кто может выдвинуться на президентских выборах?",
  "Tout Français de 18 ans jouissant de ses droits civils et politiques, avec 500 parrainages":
    "Любой француз 18 лет, пользующийся гражданскими и политическими правами, с 500 поручительствами",
  "Tout résident en France depuis dix ans": "Любой, кто живёт во Франции десять лет",
  "Seuls les anciens ministres": "Только бывшие министры",
  "Seuls les députés en exercice": "Только действующие депутаты",
  "Nationalité française, 18 ans révolus, droits civils et politiques, inscription sur les listes électorales et 500 parrainages d'élus.":
    "Французское гражданство, полные 18 лет, гражданские и политические права, внесение в списки избирателей и 500 поручительств от выборных лиц.",
  "Quelle condition est obligatoire pour se présenter à l'élection présidentielle ?":
    "Какое условие обязательно, чтобы выдвинуться на президентских выборах?",
  "Être de nationalité française": "Иметь французское гражданство",
  "Avoir exercé un mandat local": "Занимать прежде выборную должность на местах",
  "Avoir fait des études de droit": "Учиться на юриста",
  "Résider à Paris": "Жить в Париже",
  "La nationalité française est indispensable. Le reste — expérience, diplômes, domicile — n'entre pas en compte.":
    "Французское гражданство необходимо. Остальное — опыт, дипломы, место жительства — в счёт не идёт.",
  "Le Défenseur des droits est :": "Защитник прав — это:",
  "une autorité indépendante que toute personne peut saisir":
    "независимая власть, к которой может обратиться любой человек",
  "un ministre du gouvernement": "министр правительства",
  "un tribunal spécialisé": "особый суд",
  "un service de la préfecture": "служба префектуры",
  "Son indépendance est ce qui lui permet de s'opposer à une administration. Il n'appartient ni au gouvernement ni à la justice.":
    "Именно независимость позволяет ему противостоять ведомству. Он не принадлежит ни правительству, ни правосудию.",
  "Le président de la République peut-il être renversé par une motion de censure ?":
    "Может ли президент Республики быть свергнут выражением недоверия?",
  "Non : la motion de censure vise le gouvernement, pas le président":
    "Нет: недоверие направлено против правительства, а не против президента",
  "Oui, par l'Assemblée nationale": "Да, Национальным собранием",
  "Oui, par le Sénat": "Да, Сенатом",
  "Oui, par le Conseil constitutionnel": "Да, Конституционным советом",
  "La motion de censure fait tomber le gouvernement. Le président, élu au suffrage universel, n'est pas responsable devant le Parlement.":
    "Выражение недоверия валит правительство. Президент, избранный всеобщим голосованием, перед парламентом не ответственен.",
  "Qui préside le Conseil des ministres ?": "Кто председательствует в Совете министров?",
  "Le ministre de l'Intérieur": "Министр внутренних дел",
  "Le président de la République, chaque semaine à l'Élysée. Le Premier ministre y assiste et peut le suppléer exceptionnellement.":
    "Президент Республики, каждую неделю в Елисейском дворце. Премьер-министр на нём присутствует и в исключительных случаях может его заменить.",
  "Les ministres sont :": "Министры:",
  "nommés par le président sur proposition du Premier ministre":
    "назначаются президентом по предложению премьер-министра",
  "élus par les citoyens": "избираются гражданами",
  "désignés par le Conseil constitutionnel": "назначаются Конституционным советом",
  "tirés au sort parmi les députés": "выбираются по жребию среди депутатов",
  "Ils ne sont jamais élus à leur fonction ministérielle, même lorsqu'ils sont par ailleurs élus locaux ou nationaux.":
    "На министерскую должность их не избирают никогда, даже когда они помимо того являются выборными лицами на местах или в стране.",
  "Combien de parrainages d'élus faut-il pour se présenter à l'élection présidentielle ?":
    "Сколько поручительств от выборных лиц нужно, чтобы выдвинуться на президентских выборах?",
  "1 000": "1000",
  "500 parrainages d'élus, provenant d'au moins trente départements ou collectivités différents.":
    "500 поручительств от выборных лиц, не менее чем из тридцати разных департаментов или образований.",
  "Qui est le chef des armées en France ?": "Кто во Франции главнокомандующий?",
  "Le ministre de la Défense": "Министр обороны",
  "Le chef d'état-major": "Начальник генерального штаба",
  "Le président de la République est chef des armées et garant de l'indépendance nationale.":
    "Президент Республики является главнокомандующим и порукой независимости страны.",
  "Qui vote les lois ?": "Кто голосует за законы?",
  "Le Parlement, c'est-à-dire l'Assemblée nationale et le Sénat":
    "Парламент, то есть Национальное собрание и Сенат",
  "Le gouvernement seul": "Одно правительство",
  "Le président de la République seul": "Один президент Республики",
  "Le Parlement vote la loi. Le gouvernement peut proposer un texte, mais il ne le vote pas.":
    "За закон голосует парламент. Правительство может предложить текст, но не голосует за него.",
  "Qui est élu lors des élections législatives ?":
    "Кого избирают на выборах в законодательный орган?",
  "Les députés de l'Assemblée nationale": "Депутатов Национального собрания",
  "Les sénateurs": "Сенаторов",
  "Les conseillers municipaux": "Общинных советников",
  "Les législatives élisent les députés. Les sénateurs sont élus au suffrage indirect par des grands électeurs.":
    "На этих выборах избирают депутатов. Сенаторов избирают косвенно большие выборщики.",
  "Quelle est la durée du mandat des sénateurs ?": "Каков срок полномочий сенаторов?",
  "Six ans, avec un renouvellement par moitié tous les trois ans. Les députés, eux, sont élus pour cinq ans.":
    "Шесть лет, с обновлением наполовину каждые три года. Депутатов же избирают на пять лет.",
  "Comment sont désignés les sénateurs ?": "Как определяют сенаторов?",
  "Au suffrage indirect, par des grands électeurs":
    "Косвенным голосованием, большими выборщиками",
  "Au suffrage universel direct": "Прямым всеобщим голосованием",
  "Par nomination du président": "Назначением президента",
  "Par tirage au sort": "По жребию",
  "Des grands électeurs — députés, conseillers régionaux et départementaux, délégués des conseils municipaux — les élisent.":
    "Их избирают большие выборщики — депутаты, областные и департаментские советники, посланцы общинных советов.",
  "En cas de désaccord persistant entre les deux chambres, qui a le dernier mot ?":
    "При стойком несогласии между двумя палатами за кем последнее слово?",
  "L'Assemblée nationale": "Национальное собрание",
  "Le Sénat": "Сенат",
  "Le gouvernement peut donner le dernier mot à l'Assemblée nationale, qui est élue au suffrage universel direct.":
    "Правительство может отдать последнее слово Национальному собранию, которое избирается прямым всеобщим голосованием.",
  "Un texte proposé par le gouvernement s'appelle :":
    "Текст, предложенный правительством, называется:",
  "un projet de loi": "правительственным законопроектом",
  "une proposition de loi": "депутатским законопредложением",
  "un décret": "указом",
  "une ordonnance": "ордонансом",
  "Projet de loi quand il vient du gouvernement, proposition de loi quand il vient de parlementaires.":
    "Правительственный законопроект — когда он идёт от правительства, депутатское законопредложение — когда от парламентариев.",
  "Que fait le président de la République une fois une loi votée ?":
    "Что делает президент Республики после того, как за закон проголосовали?",
  "Il la promulgue, puis elle est publiée au Journal officiel":
    "Он его промульгирует, и затем закон печатают в официальном вестнике",
  "Il la vote une dernière fois": "Он голосует за него в последний раз",
  "Il la transmet au Conseil constitutionnel pour approbation obligatoire":
    "Он передаёт его в Конституционный совет на обязательное одобрение",
  "Il la fait appliquer par les préfets sans la publier":
    "Он заставляет префектов применять его, не печатая",
  "La promulgation la rend exécutoire ; la publication au Journal officiel la rend opposable à tous.":
    "Промульгация делает закон подлежащим исполнению; печать в официальном вестнике делает его обязательным для всех.",
  "Combien y a-t-il de députés à l'Assemblée nationale ?":
    "Сколько депутатов в Национальном собрании?",
  "577": "577",
  "348": "348",
  "700": "700",
  "577 députés, un par circonscription. Le Sénat compte un peu plus de trois cents sénateurs.":
    "577 депутатов, по одному от округа. В Сенате немногим более трёхсот сенаторов.",
  "Où siège l'Assemblée nationale ?": "Где заседает Национальное собрание?",
  "Au Palais Bourbon": "В Бурбонском дворце",
  "Au Palais du Luxembourg": "В Люксембургском дворце",
  "À l'Élysée": "В Елисейском дворце",
  "À Matignon": "В Матиньонском дворце",
  "Palais Bourbon pour l'Assemblée, Palais du Luxembourg pour le Sénat. L'Élysée est la résidence du président, Matignon celle du Premier ministre.":
    "Бурбонский дворец для Собрания, Люксембургский для Сената. Елисейский дворец — резиденция президента, Матиньонский — премьер-министра.",
  "Laquelle de ces assemblées peut renverser le gouvernement ?":
    "Какое из этих собраний может свалить правительство?",
  "Seule l'Assemblée nationale peut voter une motion de censure et contraindre le gouvernement à démissionner.":
    "Только Национальное собрание может проголосовать за недоверие и вынудить правительство уйти в отставку.",
  "Les partis politiques en France :": "Политические партии во Франции:",
  "se forment et exercent leur activité librement": "образуются и действуют свободно",
  "doivent être autorisés par le ministère de l'Intérieur":
    "должны быть разрешены министерством внутренних дел",
  "sont limités à quatre": "ограничены четырьмя",
  "sont interdits aux personnes étrangères": "запрещены иностранцам",
  "La Constitution garantit leur liberté, dans le respect de la souveraineté nationale et de la démocratie.":
    "Конституция обеспечивает их свободу при соблюдении суверенитета страны и демократии.",
  "Être juré d'assises est :": "Быть присяжным в суде присяжных:",
  "obligatoire lorsqu'on est tiré au sort": "обязательно, если тебя выбрали по жребию",
  "un choix personnel": "личный выбор",
  "réservé aux juristes": "отведено юристам",
  "un métier rémunéré à plein temps": "оплачиваемая работа на полный день",
  "C'est un devoir civique. Ne pas répondre à la convocation sans motif légitime est sanctionné par une amende.":
    "Это гражданская обязанность. Неявка по вызову без уважительной причины наказуема денежным взысканием.",
  "Que doit faire un citoyen appelé à être juré dans un procès d'assises ?":
    "Что должен сделать гражданин, вызванный присяжным на процесс в суде присяжных?",
  "Se présenter à la date indiquée": "Явиться в указанный день",
  "Refuser s'il n'a pas de formation juridique":
    "Отказаться, если у него нет юридического образования",
  "Demander l'accord de son employeur avant de répondre":
    "Спросить согласия работодателя, прежде чем ответить",
  "Se faire remplacer par un proche": "Послать вместо себя близкого",
  "Il doit se présenter. L'employeur ne peut pas s'y opposer, et l'absence de formation juridique n'est pas un motif d'exemption.":
    "Он обязан явиться. Работодатель не может этому воспротивиться, а отсутствие юридического образования освобождением не является.",
  "Suite à une interpellation par la police, il est possible de :":
    "После задержания полицией можно:",
  "garder le silence, être assisté d'un avocat et prévenir un proche":
    "хранить молчание, пользоваться помощью адвоката и известить близкого",
  "quitter les lieux immédiatement": "немедленно уйти",
  "exiger d'être jugé sur place": "требовать, чтобы тебя судили на месте",
  "refuser de décliner son identité sans conséquence": "безнаказанно отказаться назвать себя",
  "Ce sont les droits notifiés au début d'une garde à vue : silence, avocat, examen médical, information d'un proche.":
    "Это права, о которых извещают в начале задержания: молчание, адвокат, врачебный осмотр, извещение близкого.",
  "Quelle aide permet aux personnes qui ont des difficultés financières d'avoir un avocat ?":
    "Какая помощь позволяет людям в денежном затруднении иметь адвоката?",
  "L'allocation de solidarité": "Пособие солидарности",
  "La prime d'activité": "Надбавка за труд",
  "L'aide juridictionnelle : l'État prend en charge tout ou partie des frais d'avocat et de procédure selon les revenus.":
    "Помощь в судебных расходах: государство берёт на себя расходы на адвоката и производство полностью или частично, смотря по доходу.",
  "Lequel de ces crimes ou délits peut entraîner la privation des droits civils et politiques par un juge ?":
    "Какое из этих преступлений может повлечь лишение гражданских и политических прав судьёй?",
  "Une condamnation pour corruption ou fraude électorale":
    "Осуждение за подкуп или обман на выборах",
  "Un excès de vitesse": "Превышение скорости",
  "Un retard de paiement d'impôts": "Просрочка уплаты налогов",
  "Un différend avec son propriétaire": "Спор с собственником жилья",
  "Certaines condamnations, notamment pour atteinte à la probité, permettent au juge de prononcer l'inéligibilité et la privation du droit de vote.":
    "Отдельные осуждения, особенно за посягательство на честность, позволяют судье объявить о лишении права быть избранным и права голоса.",
  "Une personne est privée de ses droits civils et politiques pendant 5 ans. Pendant cette période :":
    "Человек лишён гражданских и политических прав на 5 лет. В это время:",
  "elle ne peut ni voter ni être élue": "он не может ни голосовать, ни быть избранным",
  "elle perd la nationalité française": "он теряет французское гражданство",
  "elle ne peut plus travailler": "он больше не может работать",
  "elle n'est plus soumise à la loi": "он больше не подчинён закону",
  "La privation touche les droits politiques. La nationalité, le travail et les obligations légales ne sont pas concernés.":
    "Лишение касается политических прав. Гражданства, работы и обязанностей по закону оно не затрагивает.",
  "Quel tribunal juge les crimes les plus graves ?":
    "Какой суд судит самые тяжкие преступления?",
  "La cour d'assises": "Суд присяжных",
  "Le tribunal correctionnel": "Исправительный суд",
  "Le conseil de prud'hommes": "Совет prud'hommes, суд по трудовым спорам",
  "Le tribunal de police": "Полицейский суд",
  "La cour d'assises, avec des jurés citoyens. Le tribunal correctionnel juge les délits, le tribunal de police les contraventions.":
    "Суд присяжных, с присяжными из числа граждан. Исправительный суд судит проступки, полицейский — нарушения.",
  "Qui rend la justice en France ?": "Кто во Франции вершит правосудие?",
  "Des magistrats indépendants, au nom du peuple français":
    "Независимые судьи, от имени французского народа",
  "Le ministre de la Justice": "Министр юстиции",
  "Le préfet du département": "Префект департамента",
  "L'indépendance de la justice interdit à l'exécutif de dicter une décision. Les jugements sont rendus au nom du peuple français.":
    "Независимость правосудия запрещает исполнительной власти диктовать решение. Приговоры выносят от имени французского народа.",
  "Le Conseil constitutionnel contrôle également :": "Конституционный совет надзирает также за:",
  "la régularité des élections nationales et des référendums":
    "правильностью общенациональных выборов и референдумов",
  "les décisions des tribunaux correctionnels": "решениями исправительных судов",
  "les comptes des communes": "счетами общин",
  "les contrats de travail": "трудовыми договорами",
  "Il veille à la conformité des lois à la Constitution et à la régularité des scrutins nationaux.":
    "Он следит за соответствием законов Конституции и за правильностью общенациональных голосований.",
  "Un stationnement gênant est :": "Стоянка в неположенном месте есть:",
  "une contravention": "нарушение",
  "un délit": "проступок",
  "un crime": "преступление",
  "une faute civile sans sanction": "гражданская провинность без наказания",
  "C'est l'infraction la plus légère, sanctionnée par une amende.":
    "Это самое лёгкое правонарушение, наказуемое денежным взысканием.",
  "Peut-on faire appel d'une décision de justice ?": "Можно ли обжаловать судебное решение?",
  "Oui, la plupart des décisions peuvent être réexaminées":
    "Да, большинство решений может быть пересмотрено",
  "Non, un jugement est définitif": "Нет, приговор окончателен",
  "Oui, mais seulement en matière pénale": "Да, но только по уголовным делам",
  "Oui, uniquement avec l'accord du procureur": "Да, только с согласия прокурора",
  "Le double degré de juridiction permet de faire réexaminer l'affaire par une cour d'appel.":
    "Две ступени правосудия позволяют дать пересмотреть дело в апелляционном суде.",
  "À quel âge peut-on devenir électeur en France ?":
    "С какого возраста во Франции можно стать избирателем?",
  "25 ans": "25 лет",
  "18 ans, à condition d'être français, d'être inscrit sur les listes électorales et de jouir de ses droits civils et politiques.":
    "С 18 лет, при условии французского гражданства, внесения в списки избирателей и пользования гражданскими и политическими правами.",
  "L'inscription sur les listes électorales est :": "Внесение в списки избирателей:",
  "obligatoire": "обязательно",
  "facultative": "необязательно",
  "réservée aux propriétaires": "отведено собственникам жилья",
  "automatique pour toute personne résidant en France":
    "происходит само собой для всякого, кто живёт во Франции",
  "Elle est obligatoire. L'inscription est automatique à 18 ans pour les jeunes recensés, mais doit être refaite après un déménagement.":
    "Оно обязательно. В 18 лет для учтённых молодых людей оно происходит само собой, но после переезда его нужно сделать заново.",
  "Quelle condition est nécessaire pour voter aux élections présidentielles ?":
    "Какое условие необходимо, чтобы голосовать на президентских выборах?",
  "Avoir la nationalité française": "Иметь французское гражданство",
  "Résider en France depuis cinq ans": "Жить во Франции пять лет",
  "Payer des impôts locaux": "Платить местные налоги",
  "Être né en France": "Родиться во Франции",
  "Les présidentielles et les législatives sont réservées aux citoyens français. Les Européens résidant en France votent aux municipales et aux européennes.":
    "Президентские выборы и выборы в законодательный орган отведены французским гражданам. Европейцы, живущие во Франции, голосуют на общинных и европейских.",
  "Qui est élu lors des élections municipales ?": "Кого избирают на общинных выборах?",
  "Le maire directement": "Прямо мэра",
  "Les députés": "Депутатов",
  "Les habitants élisent le conseil municipal ; c'est ensuite le conseil qui élit le maire parmi ses membres.":
    "Жители избирают общинный совет; затем совет избирает мэра из своих членов.",
  "Quelle condition faut-il remplir pour être candidat aux élections municipales ?":
    "Какое условие нужно выполнить, чтобы выдвинуться на общинных выборах?",
  "Avoir 18 ans, ses droits civils et politiques, et un lien avec la commune":
    "Иметь 18 лет, гражданские и политические права и связь с общиной",
  "Habiter la commune depuis dix ans": "Жить в общине десять лет",
  "Être propriétaire d'un logement": "Владеть жильём",
  "Avoir déjà exercé un mandat": "Занимать прежде выборную должность",
  "Il faut être inscrit sur la liste électorale de la commune ou y être contribuable, et jouir de ses droits civils et politiques.":
    "Нужно быть внесённым в список избирателей общины или платить в ней налоги и пользоваться гражданскими и политическими правами.",
  "Parmi ces autorités, laquelle est élue ?": "Кто из этих должностных лиц является выборным?",
  "Le recteur d'académie": "Ректор учебного округа",
  "Le procureur de la République": "Прокурор Республики",
  "Le maire est élu par le conseil municipal, lui-même élu. Le préfet, le recteur et le procureur sont nommés.":
    "Мэра избирает общинный совет, сам избранный. Префекта, ректора и прокурора назначают.",
  "Un citoyen d'un autre pays de l'Union européenne résidant en France peut voter :":
    "Гражданин другой страны Европейского союза, живущий во Франции, может голосовать:",
  "aux élections municipales et européennes": "на общинных и европейских выборах",
  "à toutes les élections françaises": "на всех французских выборах",
  "aux élections législatives seulement": "только на выборах в законодательный орган",
  "à aucune élection en France": "ни на каких выборах во Франции",
  "La citoyenneté européenne ouvre le vote municipal et européen dans le pays de résidence, pas les scrutins nationaux.":
    "Гражданство Европейского союза открывает общинное и европейское голосование в стране проживания, но не общенациональные выборы.",
  "Quelles sont les durées du mandat du conseil municipal et du maire ?":
    "Каковы сроки полномочий общинного совета и мэра?",
  "6 ans pour les deux": "6 лет у обоих",
  "5 ans pour les deux": "5 лет у обоих",
  "6 ans pour le conseil, 5 ans pour le maire": "6 лет у совета, 5 лет у мэра",
  "5 ans pour le conseil, 6 ans pour le maire": "5 лет у совета, 6 лет у мэра",
  "Six ans dans les deux cas : le maire est élu par le conseil pour la durée du mandat de celui-ci.":
    "Шесть лет в обоих случаях: мэра избирает совет на срок собственных полномочий.",
  "Qui élit les députés européens ?": "Кто избирает европейских депутатов?",
  "Les citoyens des États membres, au suffrage universel direct":
    "Граждане государств-членов, прямым всеобщим голосованием",
  "Les gouvernements nationaux": "Правительства стран",
  "Les députés nationaux": "Депутаты своих стран",
  "La Commission européenne": "Европейская комиссия",
  "Depuis 1979, les députés européens sont élus directement par les citoyens de chaque État membre.":
    "С 1979 года европейских депутатов избирают прямо граждане каждого государства-члена.",
  "Le référendum permet aux citoyens :": "Референдум позволяет гражданам:",
  "de se prononcer directement sur une question posée":
    "прямо высказаться по поставленному вопросу",
  "d'élire un député supplémentaire": "избрать ещё одного депутата",
  "de destituer un maire": "сместить мэра",
  "d'annuler un jugement": "отменить приговор",
  "C'est l'exercice direct de la souveraineté, à côté de l'élection des représentants.":
    "Это прямое осуществление суверенитета, рядом с избранием представителей.",
  "Un électeur qui déménage doit :": "Избиратель, который переезжает, обязан:",
  "se réinscrire sur les listes électorales de sa nouvelle commune":
    "заново внести себя в списки избирателей своей новой общины",
  "ne rien faire, l'inscription suit automatiquement":
    "ничего не делать, запись переходит сама собой",
  "prévenir uniquement la préfecture": "известить одну только префектуру",
  "attendre la prochaine élection présidentielle": "дождаться следующих президентских выборов",
  "L'inscription est liée à la commune. Sans démarche, l'électeur reste inscrit là où il n'habite plus.":
    "Запись привязана к общине. Без обращения избиратель остаётся записанным там, где уже не живёт.",
  "Combien y a-t-il de départements en France ?": "Сколько во Франции департаментов?",
  "95": "95",
  "83": "83",
  "101 départements, dont cinq d'outre-mer. Mayotte est devenue le 101e en 2011.":
    "101 департамент, из них пять заморских. Майотта стала 101-м в 2011 году.",
  "Comment est organisé le découpage administratif de la France ?":
    "Как устроено административное деление Франции?",
  "En communes, départements et régions": "На общины, департаменты и области",
  "En cantons et provinces": "На кантоны и провинции",
  "En Länder et arrondissements": "На земли и округа",
  "En comtés et districts": "На графства и уезды",
  "Trois niveaux de collectivités territoriales : la commune, le département, la région.":
    "Три уровня местных образований: община, департамент, область.",
  "Qui représente l'État dans un département ?": "Кто представляет государство в департаменте?",
  "Le président du conseil départemental": "Председатель совета департамента",
  "Le député": "Депутат",
  "Le préfet est nommé par le président de la République et représente l'État. Les autres sont élus.":
    "Префекта назначает президент Республики, и он представляет государство. Остальные являются выборными.",
  "Qui gère les écoles primaires et maternelles publiques ?":
    "Кто ведает государственными начальными школами и детскими садами?",
  "La commune. Le département gère les collèges, la région les lycées.":
    "Община. Департамент ведает средними школами, область — лицеями.",
  "Quelle collectivité territoriale est responsable des transports régionaux ?":
    "Какое местное образование отвечает за областной транспорт?",
  "L'État": "Государство",
  "La région organise les transports régionaux, dont les TER, ainsi que les lycées et la formation professionnelle.":
    "Область устраивает областной транспорт, в том числе пригородные поезда, а также лицеи и профессиональное обучение.",
  "Quelles sont les fonctions du maire ?": "Каковы обязанности мэра?",
  "Diriger la commune, célébrer les mariages et tenir l'état civil":
    "Возглавлять общину, совершать браки и вести записи актов гражданского состояния",
  "Voter les lois nationales": "Голосовать за общенациональные законы",
  "Juger les litiges entre habitants": "Разрешать споры между жителями",
  "Le maire est à la fois exécutif de la commune, officier d'état civil et officier de police judiciaire.":
    "Мэр разом является исполнительной властью общины, должностным лицом записи актов и должностным лицом судебной полиции.",
  "Combien y a-t-il de régions en France métropolitaine ?":
    "Сколько областей в европейской Франции?",
  "22": "22",
  "13 régions métropolitaines depuis la réforme de 2016. Avec l'outre-mer, la France compte 18 régions.":
    "13 областей в европейской части после преобразования 2016 года. Вместе с заморскими у Франции 18 областей.",
  "Quel est le 101e département français depuis 2011 ?":
    "Какой департамент стал 101-м французским с 2011 года?",
  "Saint-Martin": "Сен-Мартен",
  "Mayotte, dans l'océan Indien. La Réunion et la Guyane étaient départements depuis 1946.":
    "Майотта, в Индийском океане. Реюньон и Гвиана были департаментами с 1946 года.",
  "Le conseil municipal est élu pour :": "Общинный совет избирают на:",
  "Six ans, comme le maire qu'il élit ensuite en son sein.":
    "Шесть лет, как и мэра, которого он затем избирает из своего состава.",
  "Un ressortissant d'un autre pays de l'Union européenne peut-il être maire en France ?":
    "Может ли выходец из другой страны Европейского союза быть мэром во Франции?",
  "Non, mais il peut être conseiller municipal": "Нет, но он может быть общинным советником",
  "Oui, sans condition": "Да, без условий",
  "Non, il ne peut pas non plus être conseiller": "Нет, и советником он тоже быть не может",
  "Oui, après dix ans de résidence": "Да, после десяти лет проживания",
  "Il peut siéger au conseil municipal, mais les fonctions de maire et d'adjoint sont réservées aux citoyens français.":
    "Он может заседать в общинном совете, но должности мэра и его заместителя отведены французским гражданам.",
  "Qui gère les lycées publics ?": "Кто ведает государственными лицеями?",
  "Le rectorat seul": "Одно управление учебного округа",
  "La région construit et entretient les lycées ; l'État reste responsable des enseignants et des programmes.":
    "Область строит и содержит лицеи; государство остаётся ответственным за учителей и программы.",
  "Où est le siège du Parlement européen ?": "Где местопребывание Европейского парламента?",
  "Strasbourg est le siège officiel du Parlement européen. La Commission siège à Bruxelles, la BCE à Francfort.":
    "Официальное местопребывание Европейского парламента — Страсбург. Комиссия сидит в Брюсселе, Европейский центральный банк во Франкфурте.",
  "Où est le siège de la Commission européenne ?": "Где местопребывание Европейской комиссии?",
  "Bruxelles. La Commission propose les textes européens et veille à leur application.":
    "Брюссель. Комиссия предлагает европейские тексты и следит за их применением.",
  "En quelle année le traité de Maastricht a-t-il été signé ?":
    "В каком году был подписан Маастрихтский договор?",
  "1992. Il fonde l'Union européenne et crée la citoyenneté européenne.":
    "В 1992. Он основывает Европейский союз и создаёт европейское гражданство.",
  "En quelle année la citoyenneté européenne a-t-elle été créée ?":
    "В каком году было создано европейское гражданство?",
  "En 1992, par le traité de Maastricht. Tout ressortissant d'un État membre est aussi citoyen de l'Union.":
    "В 1992 году, Маастрихтским договором. Всякий выходец из государства-члена является также гражданином Союза.",
  "Quand est célébrée la journée de l'Europe ?": "Когда отмечают День Европы?",
  "Le 9 mai": "9 мая",
  "Le 8 mai": "8 мая",
  "Le 9 novembre": "9 ноября",
  "Le 9 mai, anniversaire de la déclaration Schuman de 1950. Le 8 mai est la victoire de 1945.":
    "9 мая, в годовщину декларации Шумана 1950 года. 8 мая — победа 1945 года.",
  "De quoi est composé le drapeau européen ?": "Из чего состоит европейский флаг?",
  "De douze étoiles dorées en cercle sur fond bleu":
    "Из двенадцати золотых звёзд по кругу на синем поле",
  "De vingt-sept étoiles blanches": "Из двадцати семи белых звёзд",
  "De trois bandes bleu, blanc, jaune": "Из трёх полос — синей, белой, жёлтой",
  "D'une carte de l'Europe sur fond bleu": "Из карты Европы на синем поле",
  "Douze étoiles, qui ne comptent pas les États membres : le douze est un symbole d'unité et de perfection.":
    "Двенадцать звёзд, и они не считают государства-члены: двенадцать — знак единства и совершенства.",
  "Combien d'États font partie de l'Union européenne au 1er janvier 2025 ?":
    "Сколько государств входит в Европейский союз на 1 января 2025 года?",
  "28": "28",
  "30": "30",
  "27 depuis le départ du Royaume-Uni en 2020.":
    "27 после ухода Соединённого Королевства в 2020 году.",
  "Quelle est la première étape de la construction européenne, en 1951 ?":
    "Каков первый шаг европейского строительства, в 1951 году?",
  "La Communauté européenne du charbon et de l'acier": "Европейское объединение угля и стали",
  "Le traité de Rome": "Римский договор",
  "L'espace Schengen": "Шенгенское пространство",
  "La zone euro": "Зона евро",
  "La CECA, créée par le traité de Paris de 1951. Le traité de Rome date de 1957.":
    "Объединение угля и стали, созданное Парижским договором 1951 года. Римский договор идёт от 1957 года.",
  "Qui a composé l'hymne de l'Union européenne ?": "Кто написал гимн Европейского союза?",
  "Claude Debussy": "Клод Дебюсси",
  "L'Ode à la joie est extraite de la Neuvième Symphonie de Beethoven. Elle est jouée sans paroles.":
    "«Ода к радости» взята из Девятой симфонии Бетховена. Её играют без слов.",
  "Qui siège au Parlement européen ?": "Кто заседает в Европейском парламенте?",
  "Des députés élus par les citoyens des États membres":
    "Депутаты, избранные гражданами государств-членов",
  "Les ministres des États membres": "Министры государств-членов",
  "Les chefs d'État et de gouvernement": "Главы государств и правительств",
  "Des fonctionnaires nommés par la Commission": "Чиновники, назначенные Комиссией",
  "Des députés européens élus au suffrage universel direct. Les ministres siègent au Conseil de l'Union.":
    "Европейские депутаты, избранные прямым всеобщим голосованием. Министры заседают в Совете Союза.",
  "En quelle année l'euro est-il devenu la monnaie officielle en pièces et en billets en France ?":
    "В каком году евро стал во Франции официальной валютой в монетах и купюрах?",
  "Les pièces et les billets sont entrés en circulation le 1er janvier 2002. L'euro existait déjà comme monnaie de compte depuis 1999.":
    "Монеты и купюры вошли в обращение 1 января 2002 года. Как расчётная единица евро существовал уже с 1999 года.",
  "Quel traité concerne la construction de l'Union européenne ?":
    "Какой договор касается строительства Европейского союза?",
  "Le traité de Maastricht": "Маастрихтский договор",
  "Le traité de Versailles": "Версальский договор",
  "Le traité de Vienne": "Венский договор",
  "Le traité de Tordesillas": "Тордесильясский договор",
  "Maastricht (1992) fonde l'Union. Versailles (1919) mettait fin à la Première Guerre mondiale.":
    "Маастрихт (1992) основывает Союз. Версаль (1919) заканчивал Первую мировую войну.",
  "Quel est le texte fondateur établissant les droits et les devoirs de chaque citoyen ?":
    "Какой основополагающий текст устанавливает права и обязанности каждого гражданина?",
  "Adoptée le 26 août 1789, elle fait partie du bloc de constitutionnalité et a donc encore aujourd'hui valeur de droit.":
    "Принятая 26 августа 1789 года, она входит в конституционный блок и потому имеет силу права и сегодня.",
  "Laquelle de ces citations est inscrite dans la Déclaration des Droits de l'Homme et du Citoyen de 1789 ?":
    "Какое из этих изречений записано в Декларации прав человека и гражданина 1789 года?",
  "« Les hommes naissent et demeurent libres et égaux en droits »":
    "«Люди рождаются и остаются свободными и равными в правах»",
  "« La propriété, c'est le vol »": "«Собственность есть кража»",
  "« Liberté, Égalité, Fraternité »": "«Свобода, равенство, братство»",
  "« Travail, Famille, Patrie »": "«Труд, семья, отечество»",
  "C'est l'article 1er. La devise républicaine, elle, figure dans la Constitution, pas dans la Déclaration.":
    "Это статья 1. Республиканский же девиз стоит в Конституции, а не в Декларации.",
  "En quelle année la Déclaration des droits de l'homme et du citoyen a-t-elle été adoptée ?":
    "В каком году была принята Декларация прав человека и гражданина?",
  "1791": "1791",
  "Le 26 août 1789, quelques semaines après la prise de la Bastille.":
    "26 августа 1789 года, через несколько недель после взятия Бастилии.",
  "Quelle est la différence entre la Déclaration de 1789 et la Déclaration universelle des droits de l'homme ?":
    "В чём разница между Декларацией 1789 года и Всеобщей декларацией прав человека?",
  "La première est française et date de 1789, la seconde est celle de l'ONU et date de 1948":
    "Первая французская и идёт от 1789 года, вторая принадлежит ООН и идёт от 1948 года",
  "Ce sont deux noms du même texte": "Это два названия одного и того же текста",
  "La première date de 1948, la seconde de 1789": "Первая идёт от 1948 года, вторая от 1789",
  "La seconde n'a jamais été adoptée": "Вторая никогда не была принята",
  "Deux textes distincts. La Déclaration universelle a été adoptée par l'ONU en 1948, à Paris.":
    "Это два разных текста. Всеобщую декларацию приняла ООН в 1948 году, в Париже.",
  "Que signifie « la loi est l'expression de la volonté générale » ?":
    "Что означает «закон есть выражение общей воли»?",
  "La loi est faite par les représentants du peuple et vaut pour tous":
    "Закон создают представители народа, и он действует для всех",
  "La loi change selon l'opinion du moment": "Закон меняется по настроению дня",
  "La loi ne s'applique qu'aux citoyens": "Закон применяется только к гражданам",
  "La loi est décidée par le gouvernement seul": "Закон решает одно правительство",
  "C'est l'article 6 de la Déclaration : la loi doit être la même pour tous, qu'elle protège ou qu'elle punisse.":
    "Это статья 6 Декларации: закон должен быть один и тот же для всех, защищает он или наказывает.",
  "Les droits fondamentaux appartiennent :": "Основные права принадлежат:",
  "à toute personne, sans condition de nationalité": "всякому человеку, без условия гражданства",
  "aux seuls citoyens français": "одним французским гражданам",
  "aux seuls contribuables": "одним налогоплательщикам",
  "aux seules personnes majeures": "одним совершеннолетним",
  "Les droits fondamentaux tiennent à la personne humaine. Les droits politiques, eux, sont liés à la citoyenneté.":
    "Основные права держатся на человеке как таковом. Политические же права связаны с гражданством.",
  "Que garantit l'article 11 de la Déclaration de 1789 ?":
    "Что обеспечивает статья 11 Декларации 1789 года?",
  "La libre communication des pensées et des opinions": "Свободное сообщение мыслей и мнений",
  "Le droit au logement": "Право на жильё",
  "L'article 11 fonde la liberté d'expression, « un des droits les plus précieux de l'homme ».":
    "Статья 11 закладывает свободу слова, «одно из драгоценнейших прав человека».",
  "Que signifie être citoyen d'un État ?": "Что значит быть гражданином государства?",
  "Avoir sa nationalité, avec les droits politiques et les devoirs qui vont avec":
    "Иметь его гражданство, а вместе с ним политические права и обязанности",
  "Y résider depuis plus de cinq ans": "Прожить в нём более пяти лет",
  "Y payer ses impôts": "Платить в нём налоги",
  "Y être né": "Родиться в нём",
  "La citoyenneté ouvre le droit de vote, l'éligibilité et l'accès aux emplois publics, et impose les devoirs civiques.":
    "Гражданство открывает право голоса, право быть избранным и доступ к государственной службе и налагает гражданские обязанности.",
  "Le bloc de constitutionnalité comprend :": "Конституционный блок включает:",
  "la Constitution, la Déclaration de 1789 et le préambule de 1946":
    "Конституцию, Декларацию 1789 года и преамбулу 1946 года",
  "uniquement la Constitution de 1958": "одну лишь Конституцию 1958 года",
  "l'ensemble des lois votées depuis 1958": "все законы, принятые с 1958 года",
  "les traités européens": "европейские договоры",
  "C'est pourquoi un texte de 1789 peut encore aujourd'hui servir à faire annuler une loi.":
    "Именно поэтому текст 1789 года и сегодня может послужить основанием для отмены закона.",
  "Dans quelle ville la Déclaration universelle des droits de l'homme a-t-elle été adoptée en 1948 ?":
    "В каком городе в 1948 году была принята Всеобщая декларация прав человека?",
  "À New York": "В Нью-Йорке",
  "À Genève": "В Женеве",
  "À Paris, au palais de Chaillot, par l'Assemblée générale des Nations unies.":
    "В Париже, во дворце Шайо, Генеральной Ассамблеей Организации Объединённых Наций.",
  "La Déclaration de 1789 a-t-elle encore une valeur juridique aujourd'hui ?":
    "Имеет ли Декларация 1789 года юридическую силу сегодня?",
  "Oui, elle fait partie du bloc de constitutionnalité": "Да, она входит в конституционный блок",
  "Non, c'est un texte purement historique": "Нет, это чисто исторический текст",
  "Oui, mais seulement pour les débats parlementaires": "Да, но только для парламентских прений",
  "Non, elle a été remplacée en 1958": "Нет, её заменили в 1958 году",
  "Le Conseil constitutionnel s'appuie sur elle pour censurer des lois. Elle est du droit vivant, pas un souvenir.":
    "Конституционный совет опирается на неё, отменяя законы. Это живое право, а не память о прошлом.",
  "Qu'est-ce que la citoyenneté numérique ?": "Что такое цифровое гражданство?",
  "Appliquer en ligne les mêmes droits et devoirs qu'ailleurs":
    "Применять в сети те же права и обязанности, что и вне её",
  "Le droit d'accéder gratuitement à internet": "Право на бесплатный доступ к интернету",
  "Le fait de posséder un ordinateur": "Обладание вычислительной машиной",
  "Une carte d'identité électronique": "Электронное удостоверение личности",
  "S'informer, s'exprimer et participer en ligne, sans harceler, insulter ni diffuser de fausses informations.":
    "Узнавать, высказываться и участвовать в сети, не травя, не оскорбляя и не распространяя ложных сведений.",
  "Un mineur de 14 ans veut s'inscrire sur un réseau social. Que dit la loi ?":
    "Несовершеннолетний 14 лет хочет завести себе страницу в социальной сети. Что говорит закон?",
  "Il lui faut l'accord d'un parent": "Ему нужно согласие одного из родителей",
  "C'est totalement interdit": "Это полностью запрещено",
  "Il peut s'inscrire librement": "Он может завести её свободно",
  "Il doit attendre 18 ans": "Ему нужно дождаться 18 лет",
  "La majorité numérique est fixée à 15 ans. En dessous, l'accord d'un titulaire de l'autorité parentale est requis.":
    "Цифровое совершеннолетие установлено в 15 лет. Ниже этого возраста требуется согласие того, кто несёт родительские права.",
  "Quel est l'âge de la majorité civile en France ?":
    "Каков во Франции возраст гражданского совершеннолетия?",
  "À 18 ans on devient juridiquement responsable : on peut signer un contrat, voter et se marier sans autorisation.":
    "В 18 лет человек становится юридически ответственным: он может подписать договор, голосовать и вступить в брак без разрешения.",
  "Le droit à la sûreté signifie :": "Право на личную безопасность означает:",
  "qu'on ne peut être arrêté que dans les cas et les formes prévus par la loi":
    "что задержать человека можно только в случаях и в порядке, предусмотренных законом",
  "que l'État doit assurer la sécurité des biens":
    "что государство обязано обеспечить сохранность имущества",
  "qu'on a droit à une assurance": "что человек имеет право на страховку",
  "qu'on ne peut jamais être placé en garde à vue": "что человека никогда нельзя задержать",
  "C'est la protection contre l'arbitraire. Toute privation de liberté est encadrée et contrôlée par un juge.":
    "Это защита от произвола. Всякое лишение свободы ограничено рамками и проверяется судьёй.",
  "Une personne étrangère en situation régulière a-t-elle des droits fondamentaux en France ?":
    "Есть ли у иностранца, живущего во Франции законно, основные права?",
  "Oui, les droits fondamentaux valent pour toute personne":
    "Да, основные права действуют для всякого человека",
  "Non, ils sont réservés aux Français": "Нет, они отведены французам",
  "Oui, mais seulement après cinq ans de résidence": "Да, но только после пяти лет проживания",
  "Oui, uniquement le droit de propriété": "Да, одно лишь право собственности",
  "Dignité, sûreté, liberté de conscience, accès à la justice : ces droits tiennent à la personne, pas à la nationalité.":
    "Достоинство, личная безопасность, свобода совести, доступ к правосудию: эти права держатся на человеке, а не на гражданстве.",
  "Le droit d'être élu appartient :": "Право быть избранным принадлежит:",
  "aux citoyens jouissant de leurs droits civils et politiques":
    "гражданам, пользующимся гражданскими и политическими правами",
  "à toute personne résidant en France": "всякому, кто живёт во Франции",
  "aux seuls diplômés": "одним обладателям дипломов",
  "aux seuls membres d'un parti": "одним членам партии",
  "C'est un droit politique lié à la citoyenneté, et un juge peut le retirer par une peine d'inéligibilité.":
    "Это политическое право, связанное с гражданством, и судья может отнять его наказанием в виде лишения права быть избранным.",
  "Le harcèlement en ligne est :": "Травля в сети есть:",
  "un délit puni par la loi": "преступление, наказуемое по закону",
  "un comportement seulement sanctionné par les plateformes":
    "поведение, наказуемое одними лишь площадками",
  "autorisé entre adultes consentants": "дозволено между согласными взрослыми",
  "toléré s'il reste anonyme": "терпимо, пока остаётся безымянной",
  "Le harcèlement, y compris en ligne, est un délit. L'anonymat n'empêche ni l'enquête ni la condamnation.":
    "Травля, в том числе в сети, является преступлением. Безымянность не мешает ни розыску, ни осуждению.",
  "Le droit à un procès équitable comprend :": "Право на справедливый суд включает:",
  "être jugé par un tribunal indépendant et pouvoir se défendre":
    "быть судимым независимым судом и иметь возможность защищаться",
  "choisir son juge": "выбирать себе судью",
  "être jugé dans la journée": "быть судимым в тот же день",
  "refuser de comparaître": "отказаться явиться",
  "Indépendance du tribunal, droits de la défense, publicité des débats et possibilité de faire appel.":
    "Независимость суда, права защиты, открытость разбирательства и возможность обжалования.",
  "Qu'est-ce qui distingue un droit fondamental d'un droit politique ?":
    "Чем основное право отличается от политического?",
  "Le droit fondamental vaut pour toute personne, le droit politique pour les citoyens":
    "Основное право действует для всякого человека, политическое — для граждан",
  "Le droit fondamental est facultatif": "Основное право необязательно",
  "Le droit politique est plus ancien": "Политическое право старше",
  "Il n'y a aucune différence": "Никакой разницы нет",
  "Voter et être élu supposent la citoyenneté ; la dignité et la sûreté ne supposent rien d'autre qu'être une personne.":
    "Голосовать и быть избранным предполагает гражданство; достоинство и личная безопасность не предполагают ничего, кроме того, что ты человек.",
  "Une administration refuse un service à cause de l'origine d'une personne. C'est :":
    "Ведомство отказывает в услуге из-за происхождения человека. Это:",
  "une discrimination interdite par la loi": "дискриминация, запрещённая законом",
  "une décision de gestion normale": "обычное распорядительное решение",
  "autorisé si le service est saturé": "дозволено, если служба перегружена",
  "une simple erreur sans conséquence": "простая ошибка без последствий",
  "C'est une discrimination. Le Défenseur des droits peut être saisi gratuitement, et une plainte est possible.":
    "Это дискриминация. К Защитнику прав можно обратиться бесплатно, и подача жалобы тоже возможна.",
  "Diffuser une fausse information pour nuire à quelqu'un est :":
    "Распространять ложные сведения, чтобы навредить кому-то, есть:",
  "sanctionné par la loi": "нечто наказуемое по закону",
  "un exercice normal de la liberté d'expression": "обычное пользование свободой слова",
  "autorisé si la source est citée": "дозволено, если указан источник",
  "toléré sur les réseaux sociaux": "терпимо в социальных сетях",
  "Selon les cas, cela relève de la diffamation, de la dénonciation calomnieuse ou de la diffusion de fausse nouvelle.":
    "Смотря по обстоятельствам это подпадает под клевету, ложный донос или распространение ложных известий.",
  "Quel comportement est un devoir du citoyen ?":
    "Какое поведение является обязанностью гражданина?",
  "Respecter la loi et les valeurs de la République": "Соблюдать закон и ценности Республики",
  "Adhérer à un syndicat": "Состоять в профсоюзе",
  "Participer à toutes les manifestations": "Участвовать во всех демонстрациях",
  "Assister à la messe du dimanche": "Ходить на воскресную службу",
  "Respecter la loi, payer l'impôt, porter secours et répondre à une convocation de juré sont des devoirs.":
    "Соблюдать закон, платить налог, приходить на помощь и являться по вызову присяжным — вот обязанности.",
  "Un citoyen voit une personne s'effondrer dans la rue. Que doit-il faire ?":
    "Гражданин видит, как человек падает на улице. Что он должен сделать?",
  "Appeler les secours ou porter assistance s'il le peut sans risque":
    "Вызвать помощь или помочь самому, если может сделать это без опасности",
  "Continuer son chemin, ce n'est pas son affaire": "Идти своей дорогой, это не его дело",
  "Attendre qu'un professionnel passe": "Дождаться, пока пройдёт кто-нибудь сведущий",
  "Filmer la scène pour prévenir plus tard": "Снять происходящее, чтобы сообщить потом",
  "Ne rien faire est le délit de non-assistance à personne en danger. Appeler le 15 ou le 112 suffit à remplir l'obligation.":
    "Бездействие есть преступление — неоказание помощи человеку в опасности. Достаточно позвонить по номеру 15 или 112, чтобы обязанность была выполнена.",
  "À quel âge le recensement citoyen est-il obligatoire pour les jeunes Français ?":
    "В каком возрасте гражданский учёт обязателен для молодых французов?",
  "À 16 ans, en mairie. Il ouvre la convocation à la Journée défense et citoyenneté et l'inscription automatique sur les listes électorales.":
    "В 16 лет, в мэрии. Он открывает вызов на День обороны и гражданственности и внесение в списки избирателей само собой.",
  "Le devoir de solidarité se traduit concrètement par :":
    "Долг солидарности выражается на деле в:",
  "l'impôt, les cotisations sociales et l'obligation de porter secours":
    "налоге, социальных взносах и обязанности приходить на помощь",
  "l'obligation de donner à une association": "обязанности жертвовать объединению",
  "l'obligation de faire du bénévolat": "обязанности работать безвозмездно",
  "l'obligation d'héberger un proche": "обязанности приютить близкого",
  "Il n'impose ni don ni bénévolat : il passe par la contribution commune et par l'obligation légale d'assistance.":
    "Он не налагает ни пожертвования, ни безвозмездной работы: он проходит через общий вклад и через законную обязанность помочь.",
  "Un employeur peut-il empêcher un salarié d'exercer sa mission de juré d'assises ?":
    "Может ли работодатель помешать работнику исполнить обязанность присяжного в суде присяжных?",
  "Non, c'est une obligation légale que l'employeur doit respecter":
    "Нет, это законная обязанность, которую работодатель должен уважать",
  "Oui, s'il a besoin du salarié": "Да, если работник ему нужен",
  "Oui, en période de forte activité": "Да, в горячее время",
  "Oui, si le salarié est en période d'essai": "Да, если работник на испытательном сроке",
  "Être juré est un devoir civique. L'absence est justifiée de plein droit et ne peut pas être sanctionnée.":
    "Быть присяжным есть гражданская обязанность. Отсутствие оправдано по праву и наказано быть не может.",
  "Le devoir de mémoire concerne notamment :": "Долг памяти касается в частности:",
  "la Shoah, l'esclavage et les guerres mondiales": "Шоа, рабства и мировых войн",
  "l'obligation de conserver ses relevés bancaires":
    "обязанности хранить свои банковские выписки",
  "l'apprentissage par cœur de l'hymne national": "заучивания государственного гимна наизусть",
  "la fréquentation des musées": "посещения музеев",
  "Commémorations, enseignement et lieux de mémoire : nommer ce qui s'est passé pour que cela ne recommence pas.":
    "Памятные торжества, преподавание и места памяти: назвать случившееся, чтобы оно не повторилось.",
  "Voter en France est :": "Голосовать во Франции:",
  "un droit, alors que l'inscription sur les listes est une obligation":
    "право, тогда как внесение в списки является обязанностью",
  "une obligation sanctionnée par une amende": "обязанность, наказуемая денежным взысканием",
  "obligatoire seulement aux présidentielles": "обязательно только на президентских выборах",
  "L'inscription est obligatoire, l'acte de voter reste libre. Certains pays voisins font l'inverse ; pas la France.":
    "Внесение в списки обязательно, а само голосование остаётся свободным. В некоторых соседних странах наоборот; во Франции нет.",
  "Nul n'est censé ignorer la loi. Qu'est-ce que cela signifie ?":
    "Незнание закона не оправдывает. Что это значит?",
  "On ne peut pas invoquer son ignorance pour échapper à une sanction":
    "Нельзя сослаться на своё незнание, чтобы уйти от наказания",
  "Chacun doit connaître tous les textes par cœur": "Каждый обязан знать все тексты наизусть",
  "Seuls les juristes sont responsables": "Ответственны одни юристы",
  "La loi ne s'applique qu'après information personnelle":
    "Закон применяется только после личного извещения",
  "La publication au Journal officiel rend la loi opposable à tous, sans notification individuelle.":
    "Печать в официальном вестнике делает закон обязательным для всех, без извещения каждого в отдельности.",
  "La Journée défense et citoyenneté est :": "День обороны и гражданственности:",
  "obligatoire pour les jeunes Français recensés":
    "обязателен для молодых французов, состоящих на учёте",
  "réservée aux futurs militaires": "отведён будущим военным",
  "remplacée par le service militaire": "заменён военной службой",
  "Elle est obligatoire et son attestation est exigée pour passer certains examens, dont le baccalauréat et le permis de conduire.":
    "Он обязателен, и справку о нём требуют для сдачи некоторых экзаменов, в том числе на baccalauréat, аттестат зрелости, и на водительские права.",
  "Payer ses impôts est :": "Платить налоги:",
  "un devoir de tout contribuable": "обязанность всякого налогоплательщика",
  "un geste volontaire": "добровольный шаг",
  "réservé aux personnes nées en France": "отведено родившимся во Франции",
  "une contribution demandée tous les cinq ans": "вклад, требуемый раз в пять лет",
  "La contribution commune est répartie entre tous en raison de leurs facultés — l'article 13 de la Déclaration de 1789 le disait déjà.":
    "Общий вклад распределяется между всеми соразмерно их возможностям — статья 13 Декларации 1789 года говорила это уже тогда.",
  "Respecter les valeurs de la République signifie notamment :":
    "Уважать ценности Республики означает в частности:",
  "respecter la laïcité, l'égalité femmes-hommes et la dignité de chacun":
    "уважать laïcité, равенство женщин и мужчин и достоинство каждого",
  "adhérer aux idées du gouvernement": "разделять взгляды правительства",
  "pratiquer la religion majoritaire": "исповедовать религию большинства",
  "parler exclusivement français chez soi": "говорить дома исключительно по-французски",
  "Ce sont des principes juridiques : liberté de conscience, égalité, dignité, respect de la loi commune.":
    "Это правовые начала: свобода совести, равенство, достоинство, соблюдение общего закона.",
  "Dans lequel de ces endroits est-on autorisé à fumer ?":
    "В каком из этих мест разрешено курить?",
  "En terrasse ouverte d'un café": "На открытой веранде кафе",
  "Dans un restaurant": "В ресторане",
  "Dans une gare couverte": "На крытом вокзале",
  "Dans une cour d'école": "На школьном дворе",
  "Il est interdit de fumer dans tous les lieux fermés accueillant du public et dans les établissements scolaires.":
    "Курить запрещено во всех закрытых помещениях, куда допускается публика, и в учебных заведениях.",
  "En France, la conduite sans permis d'une moto est :":
    "Езда на мотоцикле без прав во Франции:",
  "une contravention légère": "лёгкое нарушение",
  "autorisée en dessous de 125 cm³": "разрешена при объёме до 125 куб. см",
  "sans conséquence si l'on est assuré": "не имеет последствий, если есть страховка",
  "C'est un délit, puni d'une amende importante et pouvant aller jusqu'à une peine d'emprisonnement.":
    "Это преступление, наказуемое крупным денежным взысканием и вплоть до лишения свободы.",
  "Le non-respect du code de la route est :": "Несоблюдение правил дорожного движения:",
  "une infraction sanctionnée": "наказуемое правонарушение",
  "toléré hors agglomération": "терпимо вне населённых пунктов",
  "sans conséquence pour les piétons": "не имеет последствий для пешеходов",
  "une simple recommandation": "простая рекомендация",
  "Selon la gravité, c'est une contravention ou un délit : amende, retrait de points, suspension du permis, voire prison.":
    "Смотря по тяжести это нарушение или преступление: денежное взыскание, снятие баллов, приостановка прав, а то и тюрьма.",
  "Est-ce légal d'être marié à plusieurs personnes en même temps ?":
    "Законно ли состоять в браке с несколькими людьми одновременно?",
  "Non, la polygamie est interdite": "Нет, многобрачие запрещено",
  "Oui, si le mariage a été célébré à l'étranger": "Да, если брак был заключён за границей",
  "Oui, avec l'accord des conjoints": "Да, с согласия супругов",
  "Oui, dans certaines communes": "Да, в некоторых общинах",
  "La bigamie est un délit. Un mariage contracté alors qu'on est déjà marié est nul en France.":
    "Двоебрачие является преступлением. Брак, заключённый при наличии другого, во Франции недействителен.",
  "Pour obtenir une carte d'identité, il faut :":
    "Чтобы получить удостоверение личности, нужно:",
  "en faire la demande en mairie avec un justificatif de domicile et une photo":
    "подать заявление в мэрию со справкой о месте жительства и фотографией",
  "s'adresser au commissariat": "обратиться в полицейский участок",
  "écrire à la préfecture de région": "написать в областную префектуру",
  "passer un examen": "сдать экзамен",
  "La demande se fait en mairie, dans une commune équipée du dispositif de recueil. La première demande est gratuite.":
    "Заявление подают в мэрию, в общине, где есть нужное оборудование. Первое заявление бесплатно.",
  "Le stationnement sur une place réservée aux personnes handicapées est :":
    "Стоянка на месте, отведённом для людей с ограниченными возможностями:",
  "une infraction lourdement sanctionnée": "правонарушение, наказуемое тяжело",
  "toléré pendant quelques minutes": "терпима на несколько минут",
  "autorisé le dimanche": "разрешена по воскресеньям",
  "autorisé si aucune autre place n'est libre": "разрешена, если свободных мест больше нет",
  "L'amende est de plusieurs centaines d'euros, et le véhicule peut être mis en fourrière. La place conditionne l'autonomie de quelqu'un.":
    "Взыскание составляет несколько сотен евро, а машину могут отправить на штрафную стоянку. От этого места зависит чья-то самостоятельность.",
  "À partir de quel âge peut-on acheter du tabac en France ?":
    "С какого возраста во Франции можно покупать табак?",
  "17 ans": "17 лет",
  "18 ans, comme pour l'alcool. Le commerçant doit demander une pièce d'identité en cas de doute.":
    "С 18 лет, как и спиртное. При сомнении торговец обязан попросить удостоверение личности.",
  "Quelle est la différence entre un délit et une contravention ?":
    "В чём разница между проступком и нарушением?",
  "Le délit est plus grave et relève du tribunal correctionnel":
    "Проступок тяжелее и относится к исправительному суду",
  "La contravention est plus grave": "Нарушение тяжелее",
  "Le délit ne concerne que les entreprises": "Проступок касается только предприятий",
  "Il n'y a aucune différence de gravité": "Разницы в тяжести нет",
  "Contravention, délit, crime, dans l'ordre croissant. Le tribunal de police, le tribunal correctionnel et la cour d'assises les jugent.":
    "Нарушение, проступок, преступление, в порядке возрастания. Их судят полицейский суд, исправительный суд и суд присяжных.",
  "À quel âge devient-on pénalement majeur en France ?":
    "С какого возраста во Франции наступает уголовное совершеннолетие?",
  "18 ans. En dessous, la justice des mineurs s'applique, avec des peines et une procédure adaptées.":
    "С 18 лет. Ниже действует правосудие для несовершеннолетних, со своими наказаниями и своим порядком.",
  "Dissimuler entièrement son visage dans l'espace public est :":
    "Полностью скрывать своё лицо в общественном пространстве:",
  "interdit depuis 2010": "запрещено с 2010 года",
  "autorisé partout": "разрешено везде",
  "interdit uniquement dans les administrations": "запрещено только в ведомствах",
  "autorisé pendant les manifestations": "разрешено во время демонстраций",
  "La loi de 2010 interdit la dissimulation du visage dans l'espace public, avec des exceptions prévues par le texte.":
    "Закон 2010 года запрещает скрывать лицо в общественном пространстве, с исключениями, предусмотренными самим текстом.",
  "La première demande d'une carte nationale d'identité est :":
    "Первое заявление на государственное удостоверение личности:",
  "gratuite": "бесплатно",
  "payante, quel que soit le cas": "платно в любом случае",
  "réservée aux personnes majeures": "отведено совершеннолетним",
  "faite en préfecture": "подаётся в префектуру",
  "Elle est gratuite. Seul un renouvellement après perte ou vol donne lieu à un timbre fiscal.":
    "Оно бесплатно. Только повторное после утраты или кражи требует уплаты пошлины.",
  "Un collègue tient des propos racistes pendant une réunion. Quelle est la bonne attitude ?":
    "Сослуживец допускает расистские высказывания на совещании. Как правильно поступить?",
  "Signaler les faits à la hiérarchie ou aux représentants du personnel":
    "Сообщить о случившемся начальству или представителям работников",
  "Ne rien dire, ce sont ses opinions": "Промолчать, это его взгляды",
  "Répondre par des insultes": "Ответить оскорблениями",
  "Quitter l'entreprise": "Уйти с предприятия",
  "Les propos racistes sont un délit, et l'employeur a l'obligation de protéger ses salariés. Le Défenseur des droits peut aussi être saisi.":
    "Расистские высказывания являются преступлением, и работодатель обязан защищать своих работников. К Защитнику прав тоже можно обратиться.",
  "Un voisin fait beaucoup de bruit tard le soir, régulièrement. Que faire d'abord ?":
    "Сосед часто сильно шумит поздно вечером. Что сделать сначала?",
  "Lui en parler calmement, puis saisir le syndic, le bailleur ou la mairie":
    "Спокойно с ним поговорить, а затем обратиться к управляющему домом, наймодателю или в мэрию",
  "Couper son électricité": "Отключить ему электричество",
  "Faire du bruit à son tour": "Шуметь в ответ",
  "Déménager sans rien dire": "Переехать, ничего не сказав",
  "On règle d'abord par le dialogue, puis par l'institution compétente. On ne se fait jamais justice soi-même.":
    "Сначала улаживают разговором, потом через ведающее этим учреждение. Правосудие своими руками не вершат никогда.",
  "Une entreprise refuse d'embaucher une candidate parce qu'elle est enceinte. Cette décision est :":
    "Предприятие отказывается взять на работу женщину, потому что она беременна. Это решение:",
  "un choix légitime de gestion": "законный распорядительный выбор",
  "autorisée dans les petites entreprises": "дозволено на малых предприятиях",
  "légale si le poste est physique": "законно, если работа тяжёлая",
  "La grossesse fait partie des critères de discrimination interdits. La candidate n'est même pas tenue de la mentionner.":
    "Беременность входит в число запрещённых признаков дискриминации. Соискательница даже не обязана о ней упоминать.",
  "Un agent de mairie refuse de célébrer un mariage parce que les époux ne partagent pas ses convictions. Que dit le droit ?":
    "Служащий мэрии отказывается совершить брак, потому что супруги не разделяют его убеждений. Что говорит право?",
  "Il doit célébrer le mariage : le service public est neutre et égal pour tous":
    "Он обязан совершить брак: общественная служба беспристрастна и равна для всех",
  "Il a le droit de refuser au nom de sa liberté de conscience":
    "Он вправе отказать во имя своей свободы совести",
  "Il doit demander l'avis du préfet": "Он должен спросить мнение префекта",
  "Il peut refuser si le maire l'y autorise": "Он может отказать, если мэр ему позволит",
  "La neutralité du service public interdit à un agent de faire dépendre un service de ses convictions personnelles.":
    "Беспристрастность общественной службы запрещает служащему ставить услугу в зависимость от своих личных убеждений.",
  "Un parent demande que sa fille soit dispensée du cours de natation. L'école :":
    "Родитель просит освободить дочь от уроков плавания. Школа:",
  "maintient l'obligation : les programmes s'appliquent à tous les élèves":
    "оставляет обязанность в силе: программы действуют для всех учеников",
  "doit accepter la demande": "обязана принять просьбу",
  "doit organiser un cours séparé": "обязана устроить отдельный урок",
  "doit demander l'avis de la mairie": "обязана спросить мнение мэрии",
  "Les motifs d'absence acceptés sont limités et ne comprennent pas les convictions personnelles. Seul un certificat médical peut dispenser.":
    "Уважительные причины отсутствия перечислены и личных убеждений не включают. Освободить может только справка от врача.",
  "Un propriétaire refuse de louer un logement à cause du nom de famille du candidat. C'est :":
    "Собственник отказывается сдать жильё из-за фамилии соискателя. Это:",
  "une discrimination punie par la loi": "дискриминация, наказуемая по закону",
  "une liberté du propriétaire": "свобода собственника",
  "légal si le logement est meublé": "законно, если жильё сдаётся с обстановкой",
  "légal si le candidat n'a pas de garant": "законно, если у соискателя нет поручителя",
  "Refuser pour un motif tenant à l'origine, réelle ou supposée, est un délit. Un refus doit reposer sur la solvabilité, pas sur le nom.":
    "Отказать по основанию, связанному с происхождением, действительным или мнимым, есть преступление. Отказ должен опираться на платёжеспособность, а не на фамилию.",
  "Un salarié constate qu'il est payé en dessous du SMIC. Que peut-il faire ?":
    "Работник обнаруживает, что ему платят ниже SMIC. Что он может сделать?",
  "Saisir l'inspection du travail ou le conseil de prud'hommes":
    "Обратиться в трудовую инспекцию или в совет prud'hommes",
  "Rien, le contrat a été signé": "Ничего, договор подписан",
  "Cesser de venir travailler sans prévenir": "Перестать приходить на работу, не предупредив",
  "Attendre la fin de son contrat": "Дождаться окончания договора",
  "Aucun contrat ne peut prévoir moins que le SMIC. L'inspection du travail contrôle, les prud'hommes tranchent le litige.":
    "Ни один договор не может предусматривать меньше SMIC. Трудовая инспекция проверяет, prud'hommes разрешают спор.",
  "Une personne est harcelée en ligne par un compte anonyme. Que peut-elle faire ?":
    "Человека травит в сети безымянная страница. Что он может сделать?",
  "Conserver les preuves et porter plainte": "Сохранить доказательства и подать заявление",
  "Rien, l'anonymat empêche toute action":
    "Ничего, безымянность делает любые действия невозможными",
  "Répondre sur le même ton": "Ответить тем же тоном",
  "Supprimer son compte et oublier": "Удалить свою страницу и забыть",
  "Le harcèlement en ligne est un délit. Les captures d'écran servent de preuves et l'enquête peut identifier l'auteur.":
    "Травля в сети является преступлением. Снимки с экрана служат доказательствами, а розыск может установить того, кто за этим стоит.",
  "Un usager estime qu'une administration l'a mal traité. Quel recours gratuit existe ?":
    "Посетитель считает, что ведомство обошлось с ним плохо. Какое бесплатное средство защиты существует?",
  "Saisir le Défenseur des droits": "Обратиться к Защитнику прав",
  "Écrire au président de la République": "Написать президенту Республики",
  "Engager un avocat obligatoirement": "Обязательно нанять адвоката",
  "Aucun recours n'existe": "Никакого средства защиты нет",
  "La saisine du Défenseur des droits est gratuite et se fait en ligne, par courrier ou auprès d'un délégué local.":
    "Обращение к Защитнику прав бесплатно и подаётся в сети, по почте или через его местного представителя.",
  "Dans une file d'attente à la préfecture, quelqu'un veut passer devant parce qu'il est pressé. Que dit le principe d'égalité ?":
    "В очереди в префектуре кто-то хочет пройти вперёд, потому что торопится. Что говорит начало равенства?",
  "Chacun est traité dans les mêmes conditions, sans passe-droit":
    "С каждым обращаются на одних и тех же условиях, без поблажек",
  "Le plus pressé passe en premier": "Кто больше торопится, проходит первым",
  "L'agent décide selon son humeur": "Служащий решает по настроению",
  "Les personnes âgées passent toujours après": "Пожилые проходят всегда последними",
  "L'égalité de traitement est un principe du service public. Des priorités existent, mais elles sont prévues, pas improvisées.":
    "Равное обращение — начало общественной службы. Право пройти раньше существует, но оно предусмотрено заранее, а не придумано на месте.",
  "Deux réponses semblent raisonnables dans une mise en situation. Laquelle choisir ?":
    "В задаче с положением два ответа кажутся разумными. Какой выбрать?",
  "Celle qui s'adresse à l'institution compétente et respecte l'égalité":
    "Тот, что обращается к ведающему этим учреждению и соблюдает равенство",
  "Celle qui règle l'affaire le plus vite": "Тот, что решает дело быстрее всего",
  "Celle qui évite le conflit à tout prix": "Тот, что любой ценой избегает ссоры",
  "Celle qui suit l'usage local": "Тот, что следует местному обыкновению",
  "La bonne réponse fait passer le droit commun avant l'arrangement privé, et l'institution avant la justice personnelle.":
    "Верный ответ ставит общее право впереди частной договорённости, а учреждение впереди правосудия своими руками.",
  "Quel roi de France a été guillotiné pendant la Révolution française ?":
    "Какой французский король был гильотинирован во время Французской революции?",
  "Louis XVI": "Людовик XVI",
  "Louis XIV": "Людовик XIV",
  "Charles X": "Карл X",
  "Henri IV": "Генрих IV",
  "Louis XVI, en 1793. Louis XIV, le Roi-Soleil, est mort en 1715 ; Henri IV a été assassiné en 1610.":
    "Людовик XVI, в 1793 году. Людовик XIV, король-солнце, умер в 1715 году; Генрих IV был убит в 1610-м.",
  "En quelle année Napoléon Ier est-il devenu empereur ?":
    "В каком году Наполеон I стал императором?",
  "1799": "1799",
  "En 1804, la même année que le Code civil. 1799 est le coup d'État du 18 Brumaire, 1815 la défaite de Waterloo.":
    "В 1804 году, в тот же год, что и Гражданский кодекс. 1799 — это переворот 18 брюмера, 1815 — поражение при Ватерлоо.",
  "Que signifie la date du 14 juillet pour les Français ?":
    "Что означает для французов дата 14 июля?",
  "La fête nationale, qui rappelle 1789 et 1790":
    "Национальный праздник, который напоминает о 1789 и 1790 годах",
  "L'entrée dans l'Union européenne": "Вступление в Европейский союз",
  "Prise de la Bastille le 14 juillet 1789, Fête de la Fédération le 14 juillet 1790. La fête nationale a été instituée en 1880.":
    "Взятие Бастилии 14 июля 1789 года, Праздник Федерации 14 июля 1790 года. Национальный праздник учредили в 1880 году.",
  "Quel château célèbre se trouve près de Paris et symbolise le pouvoir royal de Louis XIV ?":
    "Какой знаменитый дворец стоит под Парижем и олицетворяет королевскую власть Людовика XIV?",
  "Le château de Chambord": "Замок Шамбор",
  "Le château de Fontainebleau": "Замок Фонтенбло",
  "Le château d'Amboise": "Замок Амбуаз",
  "Versailles, où Louis XIV installe la cour en 1682 pour tenir la noblesse sous son regard.":
    "Версаль, куда Людовик XIV перевёл двор в 1682 году, чтобы держать знать у себя на глазах.",
  "Le Code civil est aussi appelé :": "Гражданский кодекс называют также:",
  "le Code Napoléon": "кодексом Наполеона",
  "le Code Louis": "кодексом Людовика",
  "le Code républicain": "республиканским кодексом",
  "le Code de la Révolution": "кодексом Революции",
  "Adopté en 1804 sous Napoléon Ier, il unifie le droit privé et reste la base du droit français.":
    "Принятый в 1804 году при Наполеоне I, он объединил частное право и остаётся основой французского права.",
  "En quelle année la Première République a-t-elle été proclamée ?":
    "В каком году была провозглашена Первая республика?",
  "En septembre 1792, après la chute de la monarchie. La Marseillaise a été écrite la même année.":
    "В сентябре 1792 года, после падения монархии. «Марсельезу» написали в том же году.",
  "Avant 1789, la société française était divisée en :":
    "До 1789 года французское общество делилось на:",
  "trois ordres : clergé, noblesse et tiers état":
    "три сословия: духовенство, знать и третье сословие",
  "deux classes : riches et pauvres": "два класса: богатых и бедных",
  "quatre régions autonomes": "четыре самостоятельные области",
  "cinq provinces royales": "пять королевских провинций",
  "Le tiers état représentait la très grande majorité de la population et payait l'essentiel des impôts.":
    "Третье сословие составляло подавляющее большинство населения и платило основную часть налогов.",
  "Qu'était la Bastille ?": "Чем была Бастилия?",
  "Une prison royale devenue symbole de l'arbitraire":
    "Королевской тюрьмой, ставшей знаком произвола",
  "Un palais du roi": "Дворцом короля",
  "Une cathédrale parisienne": "Парижским собором",
  "Un port militaire": "Военным портом",
  "Une forteresse-prison où l'on pouvait être enfermé sur simple ordre du roi. Sa prise, le 14 juillet 1789, a valeur de symbole.":
    "Крепость-тюрьма, куда можно было угодить по одному лишь приказу короля. Её взятие 14 июля 1789 года имеет значение знака.",
  "Qui étaient les penseurs des Lumières ?": "Кто были мыслители Просвещения?",
  "Voltaire, Rousseau, Diderot et Montesquieu": "Вольтер, Руссо, Дидро и Монтескьё",
  "Molière, Racine et Corneille": "Мольер, Расин и Корнель",
  "Monet, Renoir et Cézanne": "Моне, Ренуар и Сезанн",
  "Danton, Robespierre et Marat": "Дантон, Робеспьер и Марат",
  "Les philosophes du XVIIIe siècle qui défendent la raison, la tolérance et la séparation des pouvoirs, et préparent la Révolution.":
    "Философы XVIII века, которые отстаивали разум, терпимость и разделение властей и подготовили Революцию.",
  "La monarchie absolue signifie que :": "Безраздельная монархия означает, что:",
  "le roi détient tous les pouvoirs": "король держит всю власть",
  "le roi partage le pouvoir avec un parlement": "король делит власть с парламентом",
  "le roi est élu": "короля избирают",
  "le roi n'a qu'un rôle religieux": "у короля есть лишь религиозная роль",
  "Le roi de droit divin concentrait le pouvoir de faire la loi, de l'appliquer et de juger.":
    "Король божьей милостью сосредоточивал власть создавать закон, применять его и судить.",
  "Le Code civil de 1804 a servi à :": "Гражданский кодекс 1804 года послужил тому, чтобы:",
  "unifier le droit privé pour tout le pays": "объединить частное право для всей страны",
  "créer la Sécurité sociale": "создать Sécurité sociale",
  "instaurer la laïcité": "ввести laïcité",
  "organiser les élections": "устроить выборы",
  "Avant lui, le droit variait d'une province à l'autre. Il reste aujourd'hui le socle du droit de la famille, des contrats et de la propriété.":
    "До него право разнилось от провинции к провинции. Он и сегодня остаётся опорой права семьи, договоров и собственности.",
  "Quand a eu lieu la Première Guerre mondiale ?": "Когда шла Первая мировая война?",
  "De 1914 à 1918": "С 1914 по 1918 год",
  "De 1939 à 1945": "С 1939 по 1945 год",
  "De 1870 à 1871": "С 1870 по 1871 год",
  "De 1900 à 1910": "С 1900 по 1910 год",
  "1914-1918. L'armistice du 11 novembre 1918 y met fin, et le 11 novembre est resté férié.":
    "1914–1918. Перемирие 11 ноября 1918 года положило ей конец, и 11 ноября осталось выходным днём.",
  "Quand a eu lieu la Seconde Guerre mondiale ?": "Когда шла Вторая мировая война?",
  "De 1936 à 1940": "С 1936 по 1940 год",
  "De 1945 à 1950": "С 1945 по 1950 год",
  "1939-1945. Le 8 mai commémore la fin de la guerre en Europe.":
    "1939–1945. 8 мая вспоминают конец войны в Европе.",
  "Que célèbre-t-on le 8 mai ?": "Что отмечают 8 мая?",
  "La victoire des Alliés et la fin de la guerre en Europe en 1945":
    "Победу союзников и конец войны в Европе в 1945 году",
  "L'armistice de 1918": "Перемирие 1918 года",
  "La libération de Paris": "Освобождение Парижа",
  "La fête du Travail": "Праздник труда",
  "La capitulation de l'Allemagne nazie, le 8 mai 1945. Le 1er mai est la fête du Travail.":
    "Капитуляцию нацистской Германии 8 мая 1945 года. 1 мая — праздник труда.",
  "De quand date l'appel à la résistance du général de Gaulle ?":
    "Какого числа генерал де Голль призвал к сопротивлению?",
  "Du 18 juin 1940": "18 июня 1940 года",
  "Du 14 juillet 1940": "14 июля 1940 года",
  "Du 8 mai 1945": "8 мая 1945 года",
  "Du 6 juin 1944": "6 июня 1944 года",
  "L'appel du 18 juin 1940, prononcé depuis Londres sur les ondes de la BBC.":
    "Призыв 18 июня 1940 года, произнесённый из Лондона в эфире Би-би-си.",
  "Dans quelle région est située une partie des plages du débarquement de 1944 ?":
    "В какой области лежит часть пляжей высадки 1944 года?",
  "En Normandie": "В Нормандии",
  "En Bretagne": "В Бретани",
  "En Provence uniquement": "Только в Провансе",
  "Dans les Hauts-de-France": "В области О-де-Франс",
  "Le débarquement du 6 juin 1944 a eu lieu sur les plages normandes. Un second débarquement a suivi en Provence en août.":
    "Высадка 6 июня 1944 года произошла на нормандских пляжах. Вторая высадка последовала в Провансе в августе.",
  "À quelle date la ville de Paris a-t-elle été libérée ?": "Какого числа был освобождён Париж?",
  "Le 25 août 1944": "25 августа 1944 года",
  "Le 6 juin 1944": "6 июня 1944 года",
  "Le 8 mai 1945": "8 мая 1945 года",
  "Le 11 novembre 1944": "11 ноября 1944 года",
  "Le 25 août 1944, après une insurrection parisienne et l'arrivée de la 2e division blindée du général Leclerc.":
    "25 августа 1944 года, после восстания в Париже и прихода 2-й бронетанковой дивизии генерала Леклерка.",
  "Quelle organisation a été créée en 1945 après la Seconde Guerre mondiale ?":
    "Какая организация была создана в 1945 году после Второй мировой войны?",
  "L'Organisation des Nations unies": "Организация Объединённых Наций",
  "L'Union européenne": "Европейский союз",
  "L'OTAN": "НАТО",
  "Le Conseil de l'Europe": "Совет Европы",
  "L'ONU, en 1945. L'OTAN date de 1949, le Conseil de l'Europe de 1949 également, l'Union européenne de 1992.":
    "ООН, в 1945 году. НАТО идёт от 1949 года, Совет Европы тоже от 1949-го, Европейский союз от 1992-го.",
  "En 1944, qu'est-ce qui a changé pour les femmes en France ?":
    "Что изменилось для женщин во Франции в 1944 году?",
  "Elles ont obtenu le droit de vote": "Они получили право голоса",
  "Elles ont obtenu le droit de travailler": "Они получили право работать",
  "Elles ont obtenu le droit d'étudier": "Они получили право учиться",
  "Elles ont obtenu le droit de se marier librement":
    "Они получили право свободно вступать в брак",
  "L'ordonnance d'avril 1944 leur accorde le droit de vote et d'éligibilité. Elles votent pour la première fois en 1945.":
    "Ордонанс апреля 1944 года даёт им право избирать и быть избранными. Впервые они голосуют в 1945 году.",
  "Depuis quand les Français élisent-ils le président de la République au suffrage universel direct ?":
    "С какого времени французы избирают президента Республики прямым всеобщим голосованием?",
  "Depuis 1962": "С 1962 года",
  "Depuis 1946": "С 1946 года",
  "Depuis 1958": "С 1958 года",
  "Depuis 1981": "С 1981 года",
  "Le référendum de 1962 l'a instauré ; la première élection de ce type a eu lieu en 1965.":
    "Референдум 1962 года это установил; первые такие выборы прошли в 1965 году.",
  "Qui a été président de la Ve République ?": "Кто был президентом Пятой республики?",
  "Napoléon III": "Наполеон III",
  "Léon Blum": "Леон Блюм",
  "Jules Ferry": "Жюль Ферри",
  "Jacques Chirac a été président de 1995 à 2007. Napoléon III fut empereur, Léon Blum et Jules Ferry présidents du Conseil ou ministres.":
    "Жак Ширак был президентом с 1995 по 2007 год. Наполеон III был императором, Леон Блюм и Жюль Ферри — председателями совета или министрами.",
  "En quelle année la Constitution actuelle a-t-elle remplacé celle de la IVe République ?":
    "В каком году нынешняя Конституция сменила конституцию Четвёртой республики?",
  "La Constitution du 4 octobre 1958 fonde la Ve République, en réponse à l'instabilité gouvernementale de la IVe.":
    "Конституция от 4 октября 1958 года основывает Пятую республику в ответ на правительственную шаткость Четвёртой.",
  "Qui était une figure de la Résistance française pendant la Seconde Guerre mondiale ?":
    "Кто был видной фигурой французского Сопротивления во Вторую мировую войну?",
  "Émile Zola": "Эмиль Золя",
  "Gustave Eiffel": "Гюстав Эйфель",
  "Jean Moulin a unifié les mouvements de résistance en 1943 avant d'être arrêté et torturé à mort. Il repose au Panthéon.":
    "Жан Мулен объединил движения сопротивления в 1943 году, а затем был схвачен и замучен до смерти. Он покоится в Пантеоне.",
  "Qui a aboli l'esclavage en France ?": "Кто отменил рабство во Франции?",
  "Victor Schœlcher, en 1848": "Виктор Шёльшер, в 1848 году",
  "Napoléon Ier, en 1804": "Наполеон I, в 1804 году",
  "Jules Ferry, en 1881": "Жюль Ферри, в 1881 году",
  "Léon Gambetta, en 1870": "Леон Гамбетта, в 1870 году",
  "Victor Schœlcher a porté le décret d'abolition de 1848. Napoléon avait au contraire rétabli l'esclavage en 1802.":
    "Виктор Шёльшер провёл декрет об отмене 1848 года. Наполеон, напротив, восстановил рабство в 1802-м.",
  "Quel était le principal port français impliqué dans la traite négrière au XVIIIe siècle ?":
    "Какой французский порт был главным в работорговле XVIII века?",
  "Marseille": "Марсель",
  "Calais": "Кале",
  "Strasbourg": "Страсбург",
  "Nantes, devant Bordeaux et La Rochelle. La ville consacre aujourd'hui un mémorial à l'abolition de l'esclavage.":
    "Нант, впереди Бордо и Ла-Рошели. Сегодня город посвятил мемориал отмене рабства.",
  "Quel célèbre philosophe des Lumières a dénoncé l'esclavage ?":
    "Какой знаменитый философ Просвещения обличал рабство?",
  "Descartes": "Декарт",
  "Pascal": "Паскаль",
  "Machiavel": "Макиавелли",
  "Montesquieu, dans De l'esprit des lois, par une critique ironique restée célèbre. Descartes et Pascal sont antérieurs aux Lumières.":
    "Монтескьё, в книге «О духе законов», насмешливой отповедью, оставшейся знаменитой. Декарт и Паскаль жили до Просвещения.",
  "Quel pays a été une colonie française ?": "Какая страна была французской колонией?",
  "L'Algérie": "Алжир",
  "Le Brésil": "Бразилия",
  "L'Inde entière": "Вся Индия",
  "La Grèce": "Греция",
  "L'Algérie, jusqu'en 1962. Le Brésil était portugais ; l'Inde fut surtout britannique, la France n'y ayant que cinq comptoirs.":
    "Алжир, до 1962 года. Бразилия была португальской; Индия была прежде всего британской, а у Франции там было лишь пять факторий.",
  "En quelle année l'Algérie est-elle devenue indépendante ?":
    "В каком году Алжир стал независимым?",
  "1954": "1954",
  "1975": "1975",
  "En 1962, après huit ans de guerre commencée en 1954.":
    "В 1962 году, после восьми лет войны, начавшейся в 1954-м.",
  "Nier publiquement l'existence de la Shoah est :": "Прилюдно отрицать Шоа есть:",
  "une opinion protégée": "защищённое мнение",
  "une faute civile sans sanction pénale": "гражданская провинность без уголовного наказания",
  "autorisé dans un cadre universitaire": "дозволено в рамках научной работы",
  "La contestation de crimes contre l'humanité est un délit. C'est l'une des limites explicites de la liberté d'expression.":
    "Оспаривание преступлений против человечности является преступлением. Это одна из прямо названных границ свободы слова.",
  "Où repose Jean Moulin ?": "Где покоится Жан Мулен?",
  "Au Panthéon": "В Пантеоне",
  "Aux Invalides": "В Доме инвалидов",
  "À Notre-Dame de Paris": "В соборе Парижской Богоматери",
  "Au château de Versailles": "В Версальском дворце",
  "Au Panthéon depuis 1964. Les Invalides abritent notamment le tombeau de Napoléon Ier.":
    "В Пантеоне с 1964 года. В Доме инвалидов находится, в частности, гробница Наполеона I.",
  "Une première abolition de l'esclavage avait eu lieu en 1794. Que s'est-il passé ensuite ?":
    "Первая отмена рабства произошла в 1794 году. Что случилось потом?",
  "Napoléon l'a rétabli en 1802": "Наполеон восстановил его в 1802 году",
  "Elle a été maintenue sans interruption": "Она держалась без перерыва",
  "Elle a été étendue à toute l'Europe": "Её распространили на всю Европу",
  "Elle n'a jamais été appliquée nulle part": "Её нигде и никогда не применяли",
  "Rétabli en 1802, l'esclavage n'a été aboli définitivement qu'en 1848.":
    "Восстановленное в 1802 году, рабство было окончательно отменено только в 1848-м.",
  "Le 10 mai est en France :": "10 мая во Франции — это:",
  "la journée de commémoration de l'abolition de l'esclavage": "день памяти об отмене рабства",
  "la fête nationale": "национальный праздник",
  "la journée de la laïcité": "день laïcité",
  "la journée de l'Europe": "День Европы",
  "La journée nationale des mémoires de la traite, de l'esclavage et de leurs abolitions, en métropole.":
    "Общенациональный день памяти о работорговле, рабстве и их отмене, в европейской части страны.",
  "Le régime de Vichy pendant la Seconde Guerre mondiale a :":
    "Режим Виши во Вторую мировую войну:",
  "collaboré avec l'Allemagne nazie": "сотрудничал с нацистской Германией",
  "dirigé la Résistance": "возглавлял Сопротивление",
  "gouverné depuis Londres": "правил из Лондона",
  "refusé toute coopération avec l'occupant":
    "отказывался от всякого сотрудничества с занявшими страну",
  "Il a collaboré, notamment aux arrestations et aux déportations de Juifs. La République l'a officiellement reconnu en 1995.":
    "Он сотрудничал, в том числе в задержаниях и высылке евреев. Республика официально признала это в 1995 году.",
  "Quelle chaîne de montagnes est située entre la France et l'Italie ?":
    "Какая горная цепь лежит между Францией и Италией?",
  "Les Pyrénées": "Пиренеи",
  "Le Jura": "Юра",
  "Le Massif central": "Центральный массив",
  "Les Alpes. Les Pyrénées séparent la France de l'Espagne.":
    "Альпы. Пиренеи отделяют Францию от Испании.",
  "Quelle mer ou quel océan borde la France métropolitaine ?":
    "Какое море или океан омывает европейскую Францию?",
  "La mer Méditerranée": "Средиземное море",
  "La mer Noire": "Чёрное море",
  "La mer Baltique": "Балтийское море",
  "L'océan Pacifique": "Тихий океан",
  "La Manche, la mer du Nord, l'océan Atlantique et la mer Méditerranée bordent la métropole.":
    "Европейскую часть омывают Ла-Манш, Северное море, Атлантический океан и Средиземное море.",
  "Quelle est la population approximative de la France en 2025 ?":
    "Какова примерная численность населения Франции в 2025 году?",
  "Environ 68 millions d'habitants": "Около 68 миллионов жителей",
  "Environ 45 millions": "Около 45 миллионов",
  "Environ 90 millions": "Около 90 миллионов",
  "Environ 55 millions": "Около 55 миллионов",
  "Environ 68,6 millions au 1er janvier 2025 : 66,4 en métropole et 2,3 dans les cinq départements d'outre-mer.":
    "Около 68,6 миллиона на 1 января 2025 года: 66,4 в европейской части и 2,3 в пяти заморских департаментах.",
  "Quel est le principal port maritime de France ?": "Какой главный морской порт Франции?",
  "Bordeaux": "Бордо",
  "Marseille, sur la Méditerranée, est le premier port français par le tonnage traité.":
    "Марсель, на Средиземном море, первый французский порт по обработанному тоннажу.",
  "Quelle ville française fait partie des dix plus grandes métropoles du pays ?":
    "Какой французский город входит в десятку крупнейших в стране?",
  "Toulouse": "Тулуза",
  "Chartres": "Шартр",
  "Vannes": "Ванн",
  "Colmar": "Кольмар",
  "Paris, Lyon, Marseille, Toulouse, Lille, Bordeaux et Nice figurent parmi les plus grandes aires urbaines.":
    "Париж, Лион, Марсель, Тулуза, Лилль, Бордо и Ницца стоят среди крупнейших городских образований.",
  "Quel est le chef-lieu de la région Auvergne-Rhône-Alpes ?":
    "Какой главный город у области Овернь — Рона — Альпы?",
  "Lyon": "Лион",
  "Grenoble": "Гренобль",
  "Clermont-Ferrand": "Клермон-Ферран",
  "Saint-Étienne": "Сент-Этьен",
  "Lyon. Clermont-Ferrand était le chef-lieu de l'ancienne région Auvergne avant la fusion de 2016.":
    "Лион. Клермон-Ферран был главным городом прежней области Овернь до слияния 2016 года.",
  "Quel est le chef-lieu de la région Provence-Alpes-Côte d'Azur ?":
    "Какой главный город у области Прованс — Альпы — Лазурный берег?",
  "Nice": "Ницца",
  "Toulon": "Тулон",
  "Avignon": "Авиньон",
  "Marseille, qui est aussi la deuxième ville de France par la population.":
    "Марсель, который к тому же второй город Франции по числу жителей.",
  "Quelle région française est réputée pour ses stations de ski ?":
    "Какая французская область славится лыжными курортами?",
  "Centre-Val de Loire": "Центр — Долина Луары",
  "Les Alpes du Nord concentrent les plus grandes stations. Les Pyrénées, en Occitanie, en comptent également.":
    "Самые крупные курорты сосредоточены в Северных Альпах. В Пиренеях, в Окситании, их тоже немало.",
  "La Corse est :": "Корсика — это:",
  "une île de la Méditerranée qui fait partie de la métropole":
    "остров в Средиземном море, входящий в европейскую часть страны",
  "un département d'outre-mer": "заморский департамент",
  "un État indépendant": "независимое государство",
  "une collectivité située dans l'Atlantique": "образование в Атлантике",
  "La Corse est une collectivité de la France métropolitaine, en mer Méditerranée.":
    "Корсика есть образование европейской Франции, в Средиземном море.",
  "Où peut-on voir des peintures préhistoriques en France ?":
    "Где во Франции можно увидеть доисторическую живопись?",
  "Dans la grotte de Lascaux, en Dordogne": "В пещере Ласко, в Дордони",
  "Au château de Chambord": "В замке Шамбор",
  "Dans les catacombes de Paris": "В парижских катакомбах",
  "Au Mont-Saint-Michel": "На Мон-Сен-Мишель",
  "Lascaux, découverte en 1940, abrite des peintures vieilles d'environ 17 000 ans. La grotte Chauvet en Ardèche est plus ancienne encore.":
    "Ласко, открытая в 1940 году, хранит рисунки возрастом около 17 000 лет. Пещера Шове в Ардеше ещё старше.",
  "Quel fleuve français se jette dans la Méditerranée ?":
    "Какая французская река впадает в Средиземное море?",
  "Le Rhône. La Seine se jette dans la Manche, la Loire et la Garonne dans l'Atlantique.":
    "Рона. Сена впадает в Ла-Манш, Луара и Гаронна — в Атлантический океан.",
  "Qu'est-ce que la France d'outre-mer ?": "Что такое заморская Франция?",
  "L'ensemble des territoires français situés hors d'Europe":
    "Все французские земли, лежащие за пределами Европы",
  "Les anciennes colonies devenues indépendantes": "Бывшие колонии, ставшие независимыми",
  "Les régions frontalières de la métropole": "Пограничные области европейской части",
  "Les ambassades françaises à l'étranger": "Французские посольства за границей",
  "Leurs habitants sont français et citoyens de l'Union européenne, votent aux mêmes élections et relèvent des mêmes lois.":
    "Их жители — французы и граждане Европейского союза, голосуют на тех же выборах и подчинены тем же законам.",
  "Quelle île fait partie des Antilles françaises ?":
    "Какой остров входит во Французские Антильские острова?",
  "La Guadeloupe et la Martinique sont aux Antilles. La Réunion et Mayotte sont dans l'océan Indien.":
    "Гваделупа и Мартиника — на Антильских островах. Реюньон и Майотта — в Индийском океане.",
  "Quelle île est un département d'outre-mer français ?":
    "Какой остров является французским заморским департаментом?",
  "Madagascar": "Мадагаскар",
  "Maurice": "Маврикий",
  "Haïti": "Гаити",
  "La Martinique est un département d'outre-mer. Madagascar, Maurice et Haïti sont des États indépendants.":
    "Мартиника является заморским департаментом. Мадагаскар, Маврикий и Гаити — независимые государства.",
  "De quelle ville française décolle la fusée Ariane ?":
    "Из какого французского города взлетает ракета «Ариан»?",
  "Kourou, en Guyane": "Куру, в Гвиане",
  "Fort-de-France": "Фор-де-Франс",
  "Le port spatial européen est à Kourou, en Guyane. La proximité de l'équateur facilite les lancements.":
    "Европейский космодром находится в Куру, в Гвиане. Близость к экватору облегчает запуски.",
  "Quelle île française se trouve au sud-est du continent africain ?":
    "Какой французский остров лежит к юго-востоку от африканского материка?",
  "Saint-Pierre-et-Miquelon": "Сен-Пьер и Микелон",
  "La Nouvelle-Calédonie": "Новая Каледония",
  "La Réunion, dans l'océan Indien, près de Madagascar et de l'île Maurice.":
    "Реюньон, в Индийском океане, рядом с Мадагаскаром и островом Маврикий.",
  "Combien y a-t-il de départements d'outre-mer ?":
    "Сколько существует заморских департаментов?",
  "5": "5",
  "7": "7",
  "Guadeloupe, Martinique, Guyane, La Réunion et Mayotte.":
    "Гваделупа, Мартиника, Гвиана, Реюньон и Майотта.",
  "Les habitants des départements d'outre-mer :": "Жители заморских департаментов:",
  "sont français et citoyens de l'Union européenne":
    "являются французами и гражданами Европейского союза",
  "ont une nationalité distincte": "имеют отдельное гражданство",
  "ne votent pas aux élections nationales": "не голосуют на общенациональных выборах",
  "relèvent d'un droit entièrement séparé": "подчинены совершенно отдельному праву",
  "Mêmes droits, mêmes devoirs, mêmes élections, avec seulement des adaptations locales prévues par la loi.":
    "Те же права, те же обязанности, те же выборы, лишь с местными поправками, предусмотренными законом.",
  "La Nouvelle-Calédonie se trouve :": "Новая Каледония находится:",
  "dans l'océan Pacifique": "в Тихом океане",
  "dans l'océan Indien": "в Индийском океане",
  "dans la mer des Caraïbes": "в Карибском море",
  "en Atlantique Nord": "в Северной Атлантике",
  "Dans le Pacifique Sud, comme la Polynésie française et Wallis-et-Futuna.":
    "В южной части Тихого океана, как и Французская Полинезия и Уоллис и Футуна.",
  "Saint-Pierre-et-Miquelon se situe :": "Сен-Пьер и Микелон находятся:",
  "au large du Canada, dans l'Atlantique Nord": "у берегов Канады, в Северной Атлантике",
  "aux Antilles": "на Антильских островах",
  "en Méditerranée": "в Средиземном море",
  "Un archipel au sud de Terre-Neuve, dernier vestige de la Nouvelle-France en Amérique du Nord.":
    "Архипелаг к югу от Ньюфаундленда, последний след Новой Франции в Северной Америке.",
  "La Guyane est située :": "Гвиана находится:",
  "en Amérique du Sud": "в Южной Америке",
  "en Afrique": "в Африке",
  "en Asie": "в Азии",
  "en Océanie": "в Океании",
  "Sur le continent sud-américain, entre le Brésil et le Suriname. C'est le plus vaste département français.":
    "На южноамериканском материке, между Бразилией и Суринамом. Это самый обширный французский департамент.",
  "Combien d'habitants vivent dans les cinq départements d'outre-mer ?":
    "Сколько жителей живёт в пяти заморских департаментах?",
  "Environ 2,3 millions": "Около 2,3 миллиона",
  "Environ 500 000": "Около 500 000",
  "Environ 8 millions": "Около 8 миллионов",
  "Environ 15 millions": "Около 15 миллионов",
  "Environ 2,3 millions au 1er janvier 2025, sur 68,6 millions d'habitants au total.":
    "Около 2,3 миллиона на 1 января 2025 года, из 68,6 миллиона жителей всего.",
  "Dans quel grand musée parisien est exposée la Joconde ?":
    "В каком большом парижском музее выставлена «Джоконда»?",
  "Au Louvre": "В Лувре",
  "Au musée d'Orsay": "В музее Орсе",
  "Au Centre Pompidou": "В Центре Помпиду",
  "Au musée Rodin": "В музее Родена",
  "Au Louvre. Le tableau de Léonard de Vinci est entré dans les collections royales au XVIe siècle.":
    "В Лувре. Картина Леонардо да Винчи вошла в королевское собрание в XVI веке.",
  "Quel peintre célèbre a peint les Nymphéas ?":
    "Какой знаменитый живописец написал «Кувшинки»?",
  "Édouard Manet": "Эдуар Мане",
  "Claude Monet. Les grands panneaux sont exposés au musée de l'Orangerie, à Paris.":
    "Клод Моне. Большие полотна выставлены в музее Оранжери, в Париже.",
  "Qui était Molière ?": "Кем был Мольер?",
  "Un auteur de théâtre du XVIIe siècle": "Драматургом XVII века",
  "Un peintre impressionniste": "Живописцем-импрессионистом",
  "Un compositeur": "Сочинителем музыки",
  "Un homme politique de la Révolution": "Политиком времён Революции",
  "Le maître de la comédie française. On appelle le français « la langue de Molière ».":
    "Мастер французской комедии. Французский язык называют «языком Мольера».",
  "Qui était Charles Baudelaire ?": "Кем был Шарль Бодлер?",
  "Un poète du XIXe siècle": "Поэтом XIX века",
  "Un sculpteur": "Ваятелем",
  "Un roi de France": "Королём Франции",
  "Un scientifique": "Учёным",
  "Poète, auteur des Fleurs du mal, publié en 1857.":
    "Поэт, создатель «Цветов зла», изданных в 1857 году.",
  "Qui était George Sand ?": "Кем была Жорж Санд?",
  "Une romancière du XIXe siècle": "Романисткой XIX века",
  "Un peintre anglais": "Английским живописцем",
  "Un compositeur allemand": "Немецким сочинителем музыки",
  "Un général de l'Empire": "Генералом империи",
  "Une femme écrivain, de son vrai nom Aurore Dupin, qui avait choisi un pseudonyme masculin pour être publiée.":
    "Женщина-писательница, по-настоящему Аврора Дюпен, взявшая мужской псевдоним, чтобы её печатали.",
  "Qui était Marguerite Yourcenar ?": "Кем была Маргерит Юрсенар?",
  "La première femme élue à l'Académie française":
    "Первой женщиной, избранной во Французскую академию",
  "Une chanteuse d'opéra": "Оперной певицей",
  "Écrivaine, élue à l'Académie française en 1980, la première femme à y entrer.":
    "Писательница, избранная во Французскую академию в 1980 году, первая женщина, вошедшая в неё.",
  "Qui était Marie Curie ?": "Кем была Мария Кюри?",
  "Une scientifique, deux fois prix Nobel": "Учёной, дважды удостоенной Нобелевской премии",
  "Une reine de France": "Королевой Франции",
  "Physicienne et chimiste, prix Nobel de physique puis de chimie. Elle repose au Panthéon.":
    "Физик и химик, лауреат Нобелевской премии по физике, а затем по химии. Она покоится в Пантеоне.",
  "Qui était Auguste Rodin ?": "Кем был Огюст Роден?",
  "Un peintre": "Живописцем",
  "Un écrivain": "Писателем",
  "Un architecte": "Зодчим",
  "Sculpteur, auteur du Penseur et du Baiser. Un musée parisien lui est consacré.":
    "Ваятель, создатель «Мыслителя» и «Поцелуя». Ему посвящён парижский музей.",
  "Qui était un célèbre compositeur français ?":
    "Кто был знаменитым французским сочинителем музыки?",
  "Piotr Tchaïkovski": "Пётр Чайковский",
  "Debussy, comme Ravel et Berlioz. Beethoven était allemand, Verdi italien, Tchaïkovski russe.":
    "Дебюсси, как и Равель и Берлиоз. Бетховен был немцем, Верди итальянцем, Чайковский русским.",
  "Quel monument historique se trouve sur une île en Normandie ?":
    "Какой исторический памятник стоит на острове в Нормандии?",
  "Le pont du Gard": "Гарский мост",
  "La cité de Carcassonne": "Крепость Каркассон",
  "Le Mont-Saint-Michel, sur un îlot rocheux dans la baie, classé au patrimoine mondial.":
    "Мон-Сен-Мишель, на скалистом островке в заливе, внесённый в список всемирного наследия.",
  "Pendant quelles journées peut-on visiter gratuitement des lieux culturels en France ?":
    "В какие дни во Франции можно бесплатно посетить места культуры?",
  "Les Journées européennes du patrimoine": "В Европейские дни наследия",
  "Les vacances de Noël": "На рождественские каникулы",
  "Le 14 juillet uniquement": "Только 14 июля",
  "La Fête de la musique": "В Праздник музыки",
  "Le troisième week-end de septembre, des lieux habituellement fermés ouvrent gratuitement au public.":
    "В третьи выходные сентября места, обычно закрытые, бесплатно открываются для публики.",
  "Que symbolise le 1er mai en France ?": "Что означает во Франции 1 мая?",
  "La fête nationale": "Национальный праздник",
  "Le 1er mai est la fête du Travail, jour férié et chômé pour la plupart des salariés.":
    "1 мая — праздник труда, выходной и нерабочий день для большинства наёмных работников.",
  "Quel plat est une spécialité de la cuisine française ?":
    "Какое блюдо является особенностью французской кухни?",
  "Le pot-au-feu": "Пот-о-фё",
  "La paella": "Паэлья",
  "Le couscous royal marocain": "Марокканский королевский кускус",
  "Les spaghettis carbonara": "Спагетти карбонара",
  "Le pot-au-feu, comme le bœuf bourguignon ou le cassoulet. Le repas gastronomique des Français est inscrit au patrimoine de l'UNESCO.":
    "Пот-о-фё, как и говядина по-бургундски или кассуле. Французская гастрономическая трапеза внесена в наследие ЮНЕСКО.",
  "Qui était Albert Camus ?": "Кем был Альбер Камю?",
  "Un écrivain et philosophe du XXe siècle": "Писателем и философом XX века",
  "Un peintre du XIXe siècle": "Живописцем XIX века",
  "Un président de la République": "Президентом Республики",
  "Écrivain et philosophe, prix Nobel de littérature en 1957, auteur de L'Étranger et de La Peste.":
    "Писатель и философ, лауреат Нобелевской премии по литературе 1957 года, создатель «Постороннего» и «Чумы».",
  "Quel mariage est reconnu légalement en France ?":
    "Какой брак признаётся во Франции законным?",
  "Le mariage civil célébré en mairie": "Гражданский брак, заключённый в мэрии",
  "Le mariage religieux": "Религиозный брак",
  "Le mariage célébré chez un notaire": "Брак, заключённый у нотариуса",
  "Le mariage déclaré devant témoins": "Брак, объявленный при свидетелях",
  "Seul le mariage civil produit des effets juridiques. Une cérémonie religieuse ne peut avoir lieu qu'après lui.":
    "Юридические последствия имеет только гражданский брак. Религиозный обряд может пройти лишь после него.",
  "Dans quel cas faut-il déclarer son enfant au service d'état civil ?":
    "В каком случае ребёнка нужно заявить в органы записи актов гражданского состояния?",
  "Pour tout enfant né en France, quelle que soit la nationalité des parents":
    "Для всякого ребёнка, родившегося во Франции, каково бы ни было гражданство родителей",
  "Seulement si les deux parents sont français": "Только если оба родителя французы",
  "Seulement si l'enfant naît à l'hôpital": "Только если ребёнок родился в больнице",
  "Seulement si les parents sont mariés": "Только если родители состоят в браке",
  "Toute naissance survenue en France est déclarée à la mairie du lieu de naissance.":
    "Всякое рождение, случившееся во Франции, заявляют в мэрию по месту рождения.",
  "Quand faut-il déclarer son enfant au service d'état civil ?":
    "Когда нужно заявить ребёнка в органы записи актов гражданского состояния?",
  "Dans les cinq jours qui suivent la naissance": "В течение пяти дней после рождения",
  "Dans le mois": "В течение месяца",
  "Dans l'année": "В течение года",
  "Avant le premier anniversaire": "До первого дня рождения",
  "Cinq jours, le jour de l'accouchement n'étant pas compté. Passé ce délai, il faut un jugement pour régulariser.":
    "Пять дней, причём день родов не считается. По истечении этого срока для оформления нужно решение суда.",
  "Qui peut demander le divorce de personnes mariées ?":
    "Кто может потребовать развода состоящих в браке?",
  "L'un des deux époux, ou les deux d'un commun accord":
    "Один из супругов или оба по общему согласию",
  "Uniquement les deux ensemble": "Только оба вместе",
  "Uniquement l'époux qui travaille": "Только тот супруг, который работает",
  "La famille des époux": "Семья супругов",
  "Le divorce peut être demandé unilatéralement. L'accord de l'autre n'est pas nécessaire pour engager la procédure.":
    "Развода можно потребовать в одностороннем порядке. Согласие другого для начала производства не нужно.",
  "Quelle est la définition de l'autorité parentale ?": "Каково определение родительских прав?",
  "L'ensemble des droits et devoirs pour protéger l'enfant : sécurité, santé, éducation, moralité":
    "Совокупность прав и обязанностей ради защиты ребёнка: безопасность, здоровье, воспитание, нравственность",
  "Le droit de décider seul de la vie de l'enfant": "Право решать судьбу ребёнка в одиночку",
  "Le droit de punir physiquement un enfant": "Право наказывать ребёнка телесно",
  "Le pouvoir du parent le plus âgé": "Власть старшего из родителей",
  "C'est un ensemble de devoirs autant que de droits, exercé dans l'intérêt de l'enfant et sans violence.":
    "Это совокупность обязанностей не в меньшей мере, чем прав, осуществляемая в интересах ребёнка и без насилия.",
  "Quelle action peut réaliser le locataire d'un logement sans l'autorisation du propriétaire ?":
    "Что наниматель жилья может сделать без разрешения собственника?",
  "Repeindre les murs et meubler le logement": "Перекрасить стены и обставить жильё",
  "Abattre une cloison": "Снести перегородку",
  "Transformer un garage en chambre": "Превратить гараж в комнату",
  "Changer les fenêtres": "Заменить окна",
  "L'entretien et la décoration relèvent du locataire ; toute transformation demande l'accord écrit du propriétaire.":
    "Содержание и убранство лежат на нанимателе; всякая переделка требует письменного согласия собственника.",
  "Si la machine à laver fournie avec le logement tombe en panne, il est possible de :":
    "Если стиральная машина, сданная вместе с жильём, сломалась, можно:",
  "demander au propriétaire de la réparer ou de la remplacer":
    "потребовать от собственника починить её или заменить",
  "l'enlever et déduire son prix du loyer": "вынести её и вычесть её цену из платы за наём",
  "cesser de payer le loyer": "перестать платить за наём",
  "exiger un déménagement immédiat": "потребовать немедленного переезда",
  "Un équipement fourni avec le logement est à la charge du propriétaire, sauf si le locataire l'a détérioré.":
    "Оборудование, сданное вместе с жильём, лежит на собственнике, если только наниматель сам его не испортил.",
  "Le PACS est :": "PACS — это:",
  "un contrat d'union civile ouvert à tous les couples":
    "договор гражданского союза, открытый всем парам",
  "un contrat de travail": "трудовой договор",
  "un régime de retraite": "пенсионный порядок",
  "un type de bail d'habitation": "вид договора найма жилья",
  "Le pacte civil de solidarité organise la vie commune de deux personnes majeures, avec moins de formalités que le mariage.":
    "Гражданский договор солидарности устраивает совместную жизнь двух совершеннолетних людей, с меньшими формальностями, чем брак.",
  "Depuis quelle année le mariage entre personnes de même sexe est-il légal en France ?":
    "С какого года во Франции законен брак между людьми одного пола?",
  "2013": "2013",
  "Depuis la loi de 2013. Le PACS, ouvert aux couples de même sexe, existait depuis 1999.":
    "С закона 2013 года. PACS, открытый однополым парам, существовал с 1999 года.",
  "Un parent frappe régulièrement son enfant pour le punir. Que dit la loi depuis 2019 ?":
    "Родитель часто бьёт ребёнка в наказание. Что говорит закон с 2019 года?",
  "Les violences éducatives sont interdites, quelle que soit leur intensité":
    "Насилие в воспитании запрещено, какова бы ни была его сила",
  "C'est autorisé jusqu'à un certain âge": "Это дозволено до определённого возраста",
  "C'est autorisé si l'autre parent est d'accord":
    "Это дозволено, если другой родитель согласен",
  "C'est une affaire strictement privée": "Это строго частное дело",
  "L'autorité parentale s'exerce sans violence physique ni psychologique. Le principe figure dans le Code civil.":
    "Родительские права осуществляются без телесного и душевного насилия. Это начало стоит в Гражданском кодексе.",
  "Où obtient-on un acte de naissance ?": "Где получают свидетельство о рождении?",
  "À la mairie du lieu de naissance": "В мэрии по месту рождения",
  "La mairie tient les registres de l'état civil et délivre les actes de naissance, de mariage et de décès.":
    "Мэрия ведёт книги записи актов и выдаёт свидетельства о рождении, браке и смерти.",
  "Auprès de quel organisme faut-il demander le remboursement des frais de santé ?":
    "В какое учреждение нужно обратиться за возмещением расходов на лечение?",
  "L'Assurance maladie, par l'intermédiaire de la caisse primaire d'assurance maladie (CPAM).":
    "Assurance maladie, через местную кассу медицинского страхования (CPAM).",
  "L'inscription à l'Assurance maladie est :": "Причисление к Assurance maladie:",
  "réservée aux salariés": "отведено наёмным работникам",
  "renouvelable chaque année": "возобновляется каждый год",
  "C'est une affiliation obligatoire, pas un contrat que l'on choisit de signer ou non.":
    "Это обязательное причисление, а не договор, который сам решаешь подписывать или нет.",
  "À quoi sert une mutuelle santé ?": "Для чего служит дополнительная медицинская страховка?",
  "À rembourser ce que l'Assurance maladie ne couvre pas":
    "Чтобы возмещать то, что не покрывает Assurance maladie",
  "À remplacer l'Assurance maladie": "Чтобы заменить Assurance maladie",
  "À payer les médicaments à la place du patient": "Чтобы платить за лекарства вместо больного",
  "À financer les hôpitaux publics": "Чтобы содержать государственные больницы",
  "C'est une complémentaire santé, facultative. Beaucoup d'employeurs en proposent une à leurs salariés.":
    "Это дополнительное медицинское страхование, добровольное. Многие работодатели предлагают его своим работникам.",
  "La contraception en France est :": "Предохранение от беременности во Франции:",
  "libre, et gratuite pour les jeunes femmes": "свободно, а для молодых женщин бесплатно",
  "interdite aux mineures": "запрещено несовершеннолетним",
  "soumise à l'accord du conjoint": "требует согласия супруга",
  "réservée aux personnes mariées": "отведено состоящим в браке",
  "Elle est libre et confidentielle, et prise en charge intégralement pour les femmes jusqu'à 25 ans.":
    "Оно свободно и не подлежит огласке, а женщинам до 25 лет оплачивается полностью.",
  "L'interruption volontaire de grossesse est-elle possible en France ?":
    "Возможно ли во Франции добровольное прерывание беременности?",
  "Oui, elle est légale depuis 1975": "Да, оно законно с 1975 года",
  "Non, elle est interdite": "Нет, оно запрещено",
  "Oui, mais uniquement à l'étranger": "Да, но только за границей",
  "Oui, avec l'accord du conjoint": "Да, с согласия супруга",
  "Légale depuis la loi Veil de 1975. Depuis 2024, la liberté d'y recourir est garantie par la Constitution.":
    "Законно с закона Вейль 1975 года. С 2024 года свобода к нему прибегнуть обеспечена Конституцией.",
  "Le médecin traitant sert à :": "Лечащий врач служит тому, чтобы:",
  "coordonner les soins et donner droit au meilleur taux de remboursement":
    "согласовывать лечение и давать право на наилучшее возмещение",
  "délivrer la carte Vitale": "выдавать carte Vitale",
  "fixer le prix des consultations": "устанавливать цену приёма",
  "gérer la mutuelle du patient": "вести дополнительную страховку больного",
  "Le parcours de soins coordonné passe par lui. Consulter un spécialiste sans passer par lui réduit le remboursement.":
    "Согласованный путь лечения идёт через него. Приём у специалиста в обход него уменьшает возмещение.",
  "La carte Vitale sert-elle à payer les consultations ?":
    "Служит ли carte Vitale для оплаты приёмов?",
  "Non, elle atteste des droits et transmet les soins":
    "Нет, она удостоверяет права и передаёт сведения о лечении",
  "Oui, c'est une carte de paiement": "Да, это платёжная карта",
  "Oui, mais seulement à la pharmacie": "Да, но только в аптеке",
  "Oui, dans les hôpitaux publics": "Да, в государственных больницах",
  "Elle n'est ni un moyen de paiement ni une pièce d'identité : elle prouve les droits et transmet la feuille de soins.":
    "Она не является ни средством платежа, ни удостоверением личности: она доказывает права и передаёт лист лечения.",
  "Une personne aux revenus modestes peut bénéficier :":
    "Человек со скромным доходом может получить:",
  "de la complémentaire santé solidaire": "солидарное дополнительное медицинское покрытие",
  "d'une exonération d'impôts automatique": "освобождение от налогов само собой",
  "d'une carte Vitale gratuite en plus": "ещё одну carte Vitale бесплатно",
  "d'un médecin traitant imposé": "навязанного лечащего врача",
  "La complémentaire santé solidaire prend en charge, gratuitement ou à faible coût, ce que l'Assurance maladie ne rembourse pas.":
    "Солидарное дополнительное покрытие берёт на себя, бесплатно или за малую плату, то, что Assurance maladie не возмещает.",
  "En quelle année la loi légalisant l'IVG a-t-elle été votée ?":
    "В каком году был принят закон, разрешивший прерывание беременности?",
  "1965": "1965",
  "La loi Veil, portée par Simone Veil, alors ministre de la Santé.":
    "Закон Вейль, проведённый Симоной Вейль, бывшей тогда министром здравоохранения.",
  "Que couvre la Sécurité sociale ?": "Что покрывает Sécurité sociale?",
  "La maladie, la vieillesse, la famille et les accidents du travail":
    "Болезнь, старость, семью и несчастные случаи на работе",
  "Uniquement les hospitalisations": "Одну только больничную помощь",
  "Uniquement les retraites": "Одни только пенсии",
  "Les dommages causés à un logement": "Ущерб, причинённый жилью",
  "Quatre branches. Les dommages au logement relèvent d'une assurance privée, pas de la Sécurité sociale.":
    "Четыре ветви. Ущерб жилью относится к частному страхованию, а не к Sécurité sociale.",
  "Une jeune femme de 17 ans souhaite une contraception. Le professionnel de santé doit :":
    "Молодая женщина 17 лет хочет получить средство предохранения. Медицинский работник обязан:",
  "la lui délivrer de façon confidentielle": "выдать его ей, не разглашая",
  "prévenir ses parents": "известить её родителей",
  "refuser jusqu'à sa majorité": "отказать до её совершеннолетия",
  "demander l'autorisation de la mairie": "спросить разрешения мэрии",
  "La délivrance est confidentielle et gratuite pour les mineures. Le secret médical s'applique pleinement.":
    "Выдача не подлежит огласке и для несовершеннолетних бесплатна. Врачебная тайна действует полностью.",
  "Quelle est la durée légale du temps de travail par semaine ?":
    "Какова законная длительность рабочей недели?",
  "35 heures": "35 часов",
  "39 heures": "39 часов",
  "40 heures": "40 часов",
  "42 heures": "42 часа",
  "35 heures. Au-delà, ce sont des heures supplémentaires, qui donnent lieu à une majoration de salaire ou à un repos.":
    "35 часов. Сверх того идут сверхурочные, за которые полагается надбавка к заработку или отдых.",
  "Quelle est la première démarche à réaliser pour chercher un emploi ?":
    "С чего начинают поиск работы?",
  "S'inscrire à France Travail": "Записываются в France Travail",
  "Se rendre à la préfecture": "Идут в префектуру",
  "Attendre une offre par courrier": "Ждут предложения по почте",
  "L'inscription à France Travail — l'ancien Pôle emploi — ouvre l'accompagnement, les offres et, sous conditions, l'allocation chômage.":
    "Запись в France Travail — прежнее Pôle emploi — открывает сопровождение, предложения работы и, при известных условиях, пособие по безработице.",
  "Quels sont les textes qui définissent les règles au travail ?":
    "Какие тексты определяют правила на работе?",
  "Le Code du travail, les conventions collectives et le contrat de travail":
    "Кодекс труда, отраслевые соглашения и трудовой договор",
  "Le Code civil uniquement": "Один Гражданский кодекс",
  "Le règlement de la commune": "Правила общины",
  "Les statuts du syndicat": "Устав профсоюза",
  "Trois niveaux qui s'emboîtent, le plus favorable au salarié s'appliquant généralement.":
    "Три уровня, вложенные друг в друга, причём применяется, как правило, самый выгодный для работника.",
  "Qui peut demander un congé parental d'éducation ?":
    "Кто может попросить отпуск по уходу за ребёнком?",
  "Le père comme la mère": "И отец, и мать",
  "La mère uniquement": "Одна только мать",
  "Le parent qui gagne le moins": "Тот из родителей, кто зарабатывает меньше",
  "Les seuls salariés en contrat à durée indéterminée": "Одни работники с бессрочным договором",
  "Les deux parents y ont droit, sous condition d'ancienneté, à la naissance ou à l'adoption d'un enfant.":
    "Право на него имеют оба родителя, при условии выслуги, при рождении или усыновлении ребёнка.",
  "Une personne étrangère en situation régulière peut créer son entreprise :":
    "Может ли иностранец, живущий во Франции законно, создать своё предприятие?",
  "oui, comme toute personne remplissant les conditions":
    "да, как всякий, кто отвечает условиям",
  "non, c'est réservé aux Français": "нет, это отведено французам",
  "seulement après dix ans de résidence": "только после десяти лет проживания",
  "seulement avec un associé français": "только вместе с французским товарищем",
  "Le titre de séjour doit permettre l'activité envisagée, mais la nationalité n'est pas une condition en soi.":
    "Вид на жительство должен позволять задуманное занятие, но само по себе гражданство условием не является.",
  "Une femme peut-elle créer son entreprise ?": "Может ли женщина создать своё предприятие?",
  "Oui, dans les mêmes conditions qu'un homme": "Да, на тех же условиях, что и мужчина",
  "Non, sans l'accord de son conjoint": "Нет, без согласия супруга",
  "Seulement dans certains secteurs": "Только в некоторых отраслях",
  "Seulement si elle a plus de 25 ans": "Только если ей больше 25 лет",
  "L'égalité entre les femmes et les hommes vaut aussi pour l'entrepreneuriat. Aucune autorisation d'un tiers n'est requise.":
    "Равенство женщин и мужчин действует и в предпринимательстве. Разрешения от кого бы то ни было не требуется.",
  "Est-il possible de licencier une femme enceinte ou en congé maternité en raison de sa grossesse ?":
    "Можно ли уволить беременную женщину или женщину в отпуске по материнству из-за беременности?",
  "Non, c'est illégal": "Нет, это незаконно",
  "Oui, avec un préavis plus long": "Да, с более долгим предупреждением",
  "Oui, dans les entreprises de moins de dix salariés":
    "Да, на предприятиях менее чем с десятью работниками",
  "Oui, si le poste est supprimé": "Да, если должность упраздняют",
  "La grossesse et la maternité sont des motifs de licenciement expressément interdits, et la protection est renforcée pendant le congé.":
    "Беременность и материнство являются прямо запрещёнными основаниями для увольнения, а во время отпуска защита ещё сильнее.",
  "Depuis le 1er juillet 2021, quelle est la durée du congé paternité ?":
    "Какова с 1 июля 2021 года длительность отпуска для отца?",
  "25 jours, auxquels s'ajoutent 3 jours de naissance":
    "25 дней, к которым добавляются 3 дня по случаю рождения",
  "11 jours": "11 дней",
  "6 semaines": "6 недель",
  "3 jours seulement": "Всего 3 дня",
  "25 jours calendaires, portés à 32 pour des naissances multiples, plus les 3 jours de congé de naissance.":
    "25 календарных дней, доведённые до 32 при рождении нескольких детей, плюс 3 дня отпуска по случаю рождения.",
  "À quoi sert l'inspection du travail ?": "Для чего служит трудовая инспекция?",
  "À contrôler l'application du droit du travail dans les entreprises":
    "Для надзора за соблюдением трудового права на предприятиях",
  "À juger les licenciements": "Для рассмотрения дел об увольнении",
  "À payer les salaires en cas de faillite": "Для выплаты заработка при разорении предприятия",
  "À délivrer les contrats de travail": "Для выдачи трудовых договоров",
  "Elle contrôle et peut sanctionner. Les litiges individuels, eux, sont tranchés par le conseil de prud'hommes.":
    "Она надзирает и может наказывать. Отдельные же споры разрешает совет prud'hommes.",
  "Quelle conséquence a le travail dissimulé pour le salarié ?":
    "Какое последствие имеет для работника работа без оформления?",
  "Il perd ses droits à la retraite, au chômage et à la couverture accident":
    "Он теряет права на пенсию, на пособие по безработице и на покрытие при несчастном случае",
  "Il paie moins d'impôts sans risque": "Он безнаказанно платит меньше налогов",
  "Il conserve tous ses droits": "Он сохраняет все свои права",
  "Il ne peut plus être embauché légalement": "Его больше нельзя нанять законно",
  "Sans déclaration, il n'y a pas de cotisations — donc ni trimestres de retraite, ni allocation chômage, ni prise en charge d'un accident du travail.":
    "Без оформления нет и взносов — а значит, ни пенсионного стажа, ни пособия по безработице, ни покрытия несчастного случая на работе.",
  "Un employeur peut-il payer un salarié moins que le SMIC ?":
    "Может ли работодатель платить работнику меньше SMIC?",
  "Non, jamais": "Нет, никогда",
  "Oui, pour un temps partiel": "Да, при неполной занятости",
  "Oui, si le salarié est d'accord": "Да, если работник согласен",
  "Le SMIC est un plancher légal. Aucun accord, même signé par le salarié, ne peut y déroger.":
    "SMIC есть законная нижняя граница. Никакое соглашение, даже подписанное работником, отступить от неё не может.",
  "L'instruction des enfants est obligatoire de :": "Обучение детей обязательно с:",
  "3 à 16 ans": "3 до 16 лет",
  "6 à 16 ans": "6 до 16 лет",
  "3 à 18 ans": "3 до 18 лет",
  "6 à 18 ans": "6 до 18 лет",
  "De 3 à 16 ans depuis la rentrée 2019, complétée par une obligation de formation de 16 à 18 ans.":
    "С 3 до 16 лет начиная с учебного года 2019, дополнено обязанностью учиться или обучаться ремеслу с 16 до 18 лет.",
  "Jusqu'à quel âge l'école est-elle obligatoire ?": "До какого возраста школа обязательна?",
  "14 ans": "14 лет",
  "L'instruction est obligatoire jusqu'à 16 ans ; de 16 à 18 ans, le jeune doit être en formation, en emploi ou en accompagnement.":
    "Обучение обязательно до 16 лет; с 16 до 18 лет молодой человек должен учиться, работать или быть под сопровождением.",
  "Auprès de quelle institution les parents inscrivent-ils leurs enfants à l'école publique ?":
    "В какое учреждение родители записывают детей в государственную школу?",
  "Le rectorat": "Управление учебного округа",
  "Le conseil départemental": "Совет департамента",
  "La mairie procède à l'inscription et affecte l'enfant à une école de la commune.":
    "Запись ведёт мэрия и определяет ребёнка в школу своей общины.",
  "Quel motif d'absence est accepté par l'école ?":
    "Какая причина отсутствия принимается школой?",
  "La maladie de l'enfant": "Болезнь ребёнка",
  "Un voyage familial pendant la période scolaire": "Семейная поездка во время учебного года",
  "Le désaccord avec un enseignement": "Несогласие с преподаванием",
  "Le mauvais temps": "Плохая погода",
  "Maladie, maladie contagieuse dans la famille, réunion solennelle de famille, empêchement de transport, absence des responsables.":
    "Болезнь, заразная болезнь в семье, торжественное семейное собрание, невозможность добраться, отсутствие тех, кто отвечает за ребёнка.",
  "Des parents ne respectent pas l'obligation d'instruction. Quelle sanction maximale risquent-ils ?":
    "Родители не соблюдают обязанность дать образование. Какое наибольшее наказание им грозит?",
  "Une amende et, dans les cas les plus graves, une peine d'emprisonnement":
    "Денежное взыскание, а в самых тяжёлых случаях лишение свободы",
  "Un simple rappel à l'ordre": "Простое замечание",
  "La perte des allocations uniquement": "Одна лишь потеря пособий",
  "Aucune sanction": "Никакого наказания",
  "Le manquement à l'obligation d'instruction est un délit, sanctionné après des étapes de rappel et de mise en demeure.":
    "Нарушение обязанности дать образование является преступлением, наказуемым после ступеней напоминания и предупреждения.",
  "En tant que parent d'élève, il est possible de :": "Как родитель ученика можно:",
  "se faire élire au conseil d'école ou au conseil d'administration":
    "быть избранным в школьный совет или в совет учебного заведения",
  "choisir les enseignants de son enfant": "выбирать учителей своему ребёнку",
  "modifier les programmes scolaires": "менять школьные программы",
  "dispenser son enfant d'une matière": "освободить своего ребёнка от предмета",
  "Les parents élisent leurs représentants chaque année et participent aux instances de l'établissement.":
    "Родители каждый год избирают своих представителей и участвуют в органах учебного заведения.",
  "Quelle instruction est prévue pour les enfants qui ne parlent pas français ?":
    "Какое обучение предусмотрено для детей, не говорящих по-французски?",
  "Un accueil avec des cours de français adaptés, en suivant les autres enseignements":
    "Приём с приспособленными уроками французского при посещении остальных предметов",
  "Une scolarisation reportée d'un an": "Отсрочка обучения на год",
  "Un enseignement uniquement dans leur langue": "Обучение исключительно на их языке",
  "Aucun dispositif particulier": "Никакого особого устройства нет",
  "Des dispositifs d'accueil permettent d'apprendre le français tout en suivant le reste de la scolarité.":
    "Особый порядок приёма позволяет учить французский, посещая при этом остальные уроки.",
  "S'agissant de l'accueil des enfants en situation de handicap à l'école, laquelle de ces propositions est vraie ?":
    "Что верно в отношении приёма в школу детей с ограниченными возможностями?",
  "Ils ont droit à être scolarisés en milieu ordinaire avec les aménagements nécessaires":
    "Они имеют право учиться в обычной школе с необходимыми приспособлениями",
  "Ils doivent être scolarisés dans des établissements séparés":
    "Они обязаны учиться в отдельных заведениях",
  "Leur scolarisation dépend de l'accord des autres parents":
    "Их обучение зависит от согласия остальных родителей",
  "Ils sont dispensés d'instruction": "Они освобождены от обучения",
  "L'école inclusive est un droit : aménagements, matériel adapté et accompagnement humain quand c'est nécessaire.":
    "Школа для всех есть право: приспособления, подходящее оборудование и человек в помощь, когда это нужно.",
  "Depuis quelle année l'école publique est-elle gratuite ?":
    "С какого года государственная школа бесплатна?",
  "La loi Jules Ferry de 1881 rend l'école gratuite ; celle de 1882 la rend obligatoire et laïque.":
    "Закон Жюля Ферри 1881 года делает школу бесплатной; закон 1882 года — обязательной и светской.",
  "Le lycée mène à :": "Лицей ведёт:",
  "au baccalauréat": "к baccalauréat, аттестату зрелости",
  "au brevet": "к свидетельству об окончании средней школы",
  "au certificat d'études": "к свидетельству об обучении",
  "au doctorat": "к учёной степени",
  "Le baccalauréat s'obtient en fin de lycée ; le brevet marque la fin du collège.":
    "Baccalauréat получают в конце лицея; свидетельство об окончании средней школы отмечает конец коллежа.",
  "L'instruction obligatoire signifie que :": "Обязательность обучения означает, что:",
  "l'enfant doit être instruit, à l'école ou, sous conditions, dans la famille":
    "ребёнок должен получать образование — в школе или, при известных условиях, в семье",
  "l'enfant doit obligatoirement être scolarisé dans une école publique":
    "ребёнок обязательно должен учиться в государственной школе",
  "l'enfant peut choisir de ne pas apprendre à lire": "ребёнок может решить не учиться читать",
  "les parents doivent enseigner eux-mêmes": "родители обязаны учить его сами",
  "C'est l'instruction qui est obligatoire, pas l'établissement. L'instruction en famille est soumise à autorisation et à contrôle.":
    "Обязательно именно образование, а не заведение. Обучение в семье требует разрешения и подлежит проверке.",
  "Quel numéro d'urgence permet d'appeler la police ?": "По какому номеру вызывают полицию?",
  "119": "119",
  "Le 17 pour la police ou la gendarmerie, le 15 pour le SAMU, le 18 pour les pompiers.":
    "17 для полиции или жандармерии, 15 для скорой помощи, 18 для пожарных.",
  "Quel numéro d'urgence fonctionne dans toute l'Union européenne ?":
    "Какой номер вызова помощи работает во всём Европейском союзе?",
  "Le 112 est le numéro d'urgence européen, joignable gratuitement depuis n'importe quel téléphone.":
    "112 — европейский номер вызова помощи, бесплатный с любого телефона.",
  "Quel numéro appeler en cas d'incendie ?": "По какому номеру звонить при пожаре?",
  "114": "114",
  "Le 18 pour les pompiers. Le 114 est le numéro d'urgence par SMS pour les personnes sourdes ou malentendantes.":
    "18 для пожарных. 114 — номер вызова помощи через SMS для глухих и слабослышащих.",
  "Où demande-t-on un titre de séjour ?": "Где подают заявление на вид на жительство?",
  "À la CPAM": "В CPAM",
  "La préfecture, où le préfet représente l'État. La mairie s'occupe de l'état civil et des titres d'identité français.":
    "В префектуре, где префект представляет государство. Мэрия занимается записями актов и французскими удостоверениями личности.",
  "Une administration traite un usager différemment à cause de sa religion. Quel organisme peut-il saisir gratuitement ?":
    "Ведомство обходится с посетителем иначе из-за его религии. В какое учреждение он может обратиться бесплатно?",
  "La Cour des comptes": "Счётная палата",
  "Le Défenseur des droits est compétent pour les discriminations et les relations avec les services publics.":
    "Защитник прав ведает дискриминацией и отношениями с общественными службами.",
  "Quel numéro appeler pour signaler un enfant en danger ?":
    "По какому номеру сообщить о ребёнке в опасности?",
  "Le 119, joignable gratuitement et anonymement, 24 heures sur 24.":
    "119, бесплатно и без указания имени, круглые сутки.",
  "Un usager du service public peut :": "Посетитель общественной службы может:",
  "demander une information, obtenir un document et déposer une réclamation":
    "запросить сведения, получить документ и подать жалобу",
  "exiger d'être servi avant les autres": "требовать, чтобы его обслужили раньше других",
  "choisir l'agent qui le reçoit": "выбирать служащего, который его примет",
  "obtenir un document sans justificatif": "получить документ без подтверждающих бумаг",
  "Le service public doit l'information, le traitement égal et une voie de réclamation. Il ne doit pas de passe-droit.":
    "Общественная служба должна сведения, равное обращение и путь для жалобы. Поблажек она не должна.",
  "Le 114 sert à :": "Номер 114 служит тому, чтобы:",
  "joindre les secours par SMS pour les personnes sourdes ou malentendantes":
    "вызвать помощь через SMS для глухих и слабослышащих",
  "signaler une panne d'électricité": "сообщить об отключении электричества",
  "joindre un médecin de garde": "связаться с дежурным врачом",
  "déclarer un vol de téléphone": "заявить о краже телефона",
  "C'est le numéro d'urgence accessible par SMS et par visio, pour toute urgence médicale, policière ou incendie.":
    "Это номер вызова помощи через SMS и видеосвязь, при любой срочности — врачебной, полицейской или пожарной.",
  "Où s'adresser pour une demande de permis de conduire ?":
    "Куда обращаться за водительскими правами?",
  "Aux services de l'État, en ligne, sous l'autorité de la préfecture":
    "В государственные службы, через интернет, под началом префектуры",
  "Au conseil régional": "В областной совет",
  "Les démarches de permis et de carte grise relèvent de l'État et se font en ligne, la préfecture restant l'autorité compétente.":
    "Дела о правах и о регистрации машины относятся к государству и решаются в сети, а ведает ими префектура.",
  "France Travail s'occupe :": "France Travail занимается:",
  "de la recherche d'emploi et de l'accompagnement des demandeurs":
    "поиском работы и сопровождением тех, кто её ищет",
  "du remboursement des soins": "возмещением расходов на лечение",
  "de l'état civil": "записями актов гражданского состояния",
  "des titres de séjour": "видами на жительство",
  "C'est l'ancien Pôle emploi. L'inscription est la première démarche pour chercher un emploi.":
    "Это прежнее Pôle emploi. Запись туда — первый шаг в поиске работы.",
  "Un agent public refuse de recevoir un usager parce qu'il porte un signe religieux. Cette attitude est :":
    "Государственный служащий отказывается принять посетителя, потому что тот носит религиозный знак. Такое поведение:",
  "illégale : la neutralité s'impose à l'agent, pas à l'usager":
    "незаконно: беспристрастность обязательна для служащего, а не для посетителя",
  "conforme au principe de laïcité": "соответствует началу laïcité",
  "laissée à l'appréciation de l'agent": "оставлено на усмотрение служащего",
  "autorisée dans les mairies": "дозволено в мэриях",
  "La laïcité oblige l'agent à être neutre et à servir tout le monde. Elle n'impose rien à la tenue des usagers.":
    "Laïcité обязывает служащего быть беспристрастным и обслуживать всех. К одежде посетителей она не предъявляет ничего.",
};
