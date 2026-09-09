/**
 * Russian for the Life in the UK practice questions.
 *
 * The country packs carry two bodies of text. The lesson cards are one, and
 * LIFE_IN_THE_UK_RU answers those. These are the other: the practice bank,
 * reached through UkPracticeView and UkTestView — both named "Uk" but shared
 * by all seven packs — and folded into the stepped lesson by ukSessionQuizzes.
 * Until this table a lesson read in Russian and then asked its questions in
 * English.
 *
 * Keyed on the ENGLISH source text exactly as it appears in ukQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, a
 * straight quote for a typographic one or a hyphen for an en dash, and the
 * lookup misses in silence. The question renders in English, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS ENGLISH follows LIFE_IN_THE_UK_RU exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The line runs where Russian itself
 * draws it. An institution Russian has a name for gets that name — палата
 * общин, палата лордов, Великая хартия вольностей, Билль о правах, Церковь
 * Англии, премьер-министр, Содружество. What stays English is what a reader
 * meets printed on a form or a doorplate and nowhere else: the NHS, National
 * Insurance, council tax, GCSE, the Union Jack, and the two Acts the test
 * names outright — Equality Act 2010 and Human Rights Act 1998.
 *
 * That line is the opposite of the Polish table's for the same bank, and
 * deliberately so: Polish keeps the English names of the Acts and the Houses
 * because Polish has no settled forms for them, and Russian has.
 *
 * Options are plain strings in this bank, not objects as in the lesson quiz
 * blocks, and the four of a question are only ever told apart by their text:
 * two options that come back the same Russian sentence make a question with
 * no answer. Each is translated so the four stay four.
 *
 * check-ru-bank-translation refuses a single missing string, a key that no
 * question contains, a key another Russian table already claims, and a
 * rendering that drops one of the words above.
 */
export const UK_QUESTION_BANK_RU: Record<string, string> = {
  "What does the rule of law mean?": "Что означает верховенство права?",
  "The police may act outside the law when necessary":
    "Полиция может при необходимости действовать вне закона",
  "Everyone is subject to the law, including the government":
    "Закону подчинены все, включая правительство",
  "Only judges are bound by the law": "Законом связаны только судьи",
  "Laws apply only to citizens": "Законы касаются только граждан",
  "Nobody is above the law — not ministers, not the police, not the government itself. That is what makes it the rule of LAW rather than the rule of whoever is in charge.":
    "Никто не выше закона — ни министры, ни полиция, ни само правительство. Именно поэтому это верховенство ПРАВА, а не верховенство того, кто сейчас у власти.",
  "What does tolerance mean as a British value?":
    "Что означает терпимость как британская ценность?",
  "Agreeing with every religion": "Согласие с каждой религией",
  "Respect for people of different faiths and beliefs, and of none":
    "Уважение к людям иной веры и иных убеждений, а также к неверующим",
  "Keeping your opinions to yourself": "Держать своё мнение при себе",
  "Following the established church": "Следовать государственной церкви",
  "Tolerance is respect, not agreement — and it explicitly covers people with no religious belief as well as believers.":
    "Терпимость — это уважение, а не согласие, и она прямо распространяется как на верующих, так и на людей без религиозных убеждений.",
  "Membership of a church": "Принадлежность к церкви",
  "The rule of law means everyone is subject to the law, including those who govern. The others are not British values at all.":
    "Верховенство права означает, что закону подчинены все, включая тех, кто правит. Остальное британскими ценностями вообще не является.",
  "How many protected characteristics does the Equality Act 2010 list?":
    "Сколько защищаемых признаков перечисляет Equality Act 2010?",
  "Five": "Пять",
  "Seven": "Семь",
  "Nine": "Девять",
  "Twelve": "Двенадцать",
  "Nine: age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation.":
    "Девять: возраст, инвалидность, смена пола, брак и гражданское партнёрство, беременность и материнство, раса, религия или убеждения, пол и сексуальная ориентация.",
  "Which of these is NOT protected under the Equality Act 2010?":
    "Что из перечисленного НЕ защищено по Equality Act 2010?",
  "Pregnancy and maternity": "Беременность и материнство",
  "Political opinion is not a protected characteristic in Great Britain. The other three are among the nine that are.":
    "Политические взгляды защищаемым признаком в Великобритании не являются. Остальные три входят в число девяти.",
  "Is freedom of speech in the UK unlimited?":
    "Безгранична ли свобода слова в Соединённом Королевстве?",
  "Yes, nothing said may be prosecuted":
    "Да, ни за какие слова нельзя привлечь к ответственности",
  "No — inciting violence or racial hatred is a criminal offence":
    "Нет — подстрекательство к насилию или расовой ненависти является преступлением",
  "Yes, but only in private": "Да, но только в частной обстановке",
  "No — all criticism of the government is banned":
    "Нет — запрещена любая критика правительства",
  "Freedom of speech is a real right with a real boundary. Speech that incites violence or racial hatred is a crime.":
    "Свобода слова — настоящее право с настоящей границей. Речь, подстрекающая к насилию или расовой ненависти, является преступлением.",
  "Which law sets out the protected characteristics?":
    "Какой закон устанавливает защищаемые признаки?",
  "The Human Rights Act 1998": "Human Rights Act 1998",
  "The Equality Act 2010": "Equality Act 2010",
  "The Bill of Rights 1689": "Билль о правах 1689 года",
  "The Equality Act 2010. The Human Rights Act 1998 is the separate law that brought the European Convention on Human Rights into UK law.":
    "Equality Act 2010. Human Rights Act 1998 — это отдельный закон, который ввёл Европейскую конвенцию о правах человека в право Соединённого Королевства.",
  "A landlord refuses to rent to someone because of their religion. What is this?":
    "Домовладелец отказывается сдать жильё из-за религии человека. Что это?",
  "Lawful, as it is private property": "Законно, ведь это частная собственность",
  "Unlawful discrimination under the Equality Act 2010":
    "Незаконная дискриминация по Equality Act 2010",
  "Lawful if no contract was signed": "Законно, если договор не был подписан",
  "A civil matter with no legal protection": "Гражданское дело без правовой защиты",
  "Religion or belief is one of the nine protected characteristics, and housing is covered. Owning the property does not create an exemption.":
    "Религия или убеждения — один из девяти защищаемых признаков, и жильё под это подпадает. Собственность на помещение исключения не создаёт.",
  "Which of these is a responsibility rather than a right?":
    "Что из перечисленного является обязанностью, а не правом?",
  "Serving on a jury when summoned": "Быть присяжным по вызову",
  "Freedom from discrimination": "Свобода от дискриминации",
  "Jury service is a duty you must perform when called. The other three are rights you hold.":
    "Служба присяжного — это долг, который нужно исполнить по вызову. Остальные три — права, которыми ты обладаешь.",
  "What does democracy mean in the UK?": "Что означает демократия в Соединённом Королевстве?",
  "The monarch decides policy": "Монарх определяет политику",
  "Government by the people, through representatives they elect and can vote out":
    "Правление народа через представителей, которых он избирает и может голосованием убрать",
  "Every law is put to a public vote": "Каждый закон выносится на всенародное голосование",
  "The courts choose the government": "Правительство выбирают суды",
  "Representative democracy: you elect MPs, and you can remove them at the next election. Referendums happen but are the exception, not the system.":
    "Представительная демократия: ты избираешь членов парламента и можешь убрать их на следующих выборах. Референдумы бывают, но это исключение, а не система.",
  "Which of these is a right rather than a responsibility?":
    "Что из перечисленного является правом, а не обязанностью?",
  "Paying income tax": "Платить подоходный налог",
  "Freedom from unfair discrimination": "Свобода от несправедливой дискриминации",
  "Obeying the law": "Соблюдать закон",
  "Freedom from discrimination is a right you hold. Tax, jury service and obeying the law are duties owed in return.":
    "Свобода от дискриминации — право, которым ты обладаешь. Налоги, служба присяжного и соблюдение закона — обязанности, которыми за него платят.",
  "Freedom to live as you choose within the law":
    "Свобода жить так, как выберешь, в границах закона",
  "Which four nations make up the United Kingdom?":
    "Какие четыре страны составляют Соединённое Королевство?",
  "England, Scotland, Wales and Ireland": "Англия, Шотландия, Уэльс и Ирландия",
  "England, Scotland, Wales and Northern Ireland":
    "Англия, Шотландия, Уэльс и Северная Ирландия",
  "England, Scotland, Wales and the Isle of Man": "Англия, Шотландия, Уэльс и остров Мэн",
  "England, Wales, Northern Ireland and the Channel Islands":
    "Англия, Уэльс, Северная Ирландия и Нормандские острова",
  "Northern Ireland, not the whole of Ireland. The Republic of Ireland is a separate country.":
    "Северная Ирландия, а не вся Ирландия. Республика Ирландия — отдельная страна.",
  "What is the capital of Wales?": "Какая столица у Уэльса?",
  "Swansea": "Суонси",
  "Cardiff": "Кардифф",
  "Newport": "Ньюпорт",
  "Bangor": "Бангор",
  "Cardiff, home of the Senedd — the Welsh Parliament.":
    "Кардифф, где заседает Senedd — парламент Уэльса.",
  "What is the capital of Scotland?": "Какая столица у Шотландии?",
  "Glasgow": "Глазго",
  "Aberdeen": "Абердин",
  "Dundee": "Данди",
  "Edinburgh, where the Scottish Parliament sits at Holyrood. Glasgow is larger but is not the capital.":
    "Эдинбург, где шотландский парламент заседает в Холируде. Глазго больше, но столицей не является.",
  "Which is the largest city in Scotland?": "Какой город самый большой в Шотландии?",
  "Inverness": "Инвернесс",
  "Glasgow is the largest by population; Edinburgh is the capital. The test likes this split.":
    "Глазго — самый большой по числу жителей; Эдинбург — столица. Тест любит это расхождение.",
  "Which mountain is the highest in Wales?": "Какая гора самая высокая в Уэльсе?",
  "Ben Nevis": "Бен-Невис",
  "Scafell Pike": "Скофелл-Пайк",
  "Snowdon": "Сноудон",
  "Slieve Donard": "Слив-Донард",
  "Snowdon — Yr Wyddfa — at 1,085 m. Ben Nevis is Scotland's and the UK's highest.":
    "Сноудон — Yr Wyddfa — 1085 м. Бен-Невис — высшая точка Шотландии и всего Соединённого Королевства.",
  "Which is the highest mountain in England?": "Какая гора самая высокая в Англии?",
  "Helvellyn": "Хелвеллин",
  "Scafell Pike in the Lake District, 978 m — the lowest of the four national high points.":
    "Скофелл-Пайк в Озёрном крае, 978 м — самая низкая из четырёх высших точек.",
  "What is the largest freshwater lake by area in the whole UK?":
    "Какое пресноводное озеро самое большое по площади во всём Соединённом Королевстве?",
  "Loch Lomond": "Лох-Ломонд",
  "Windermere": "Уиндермир",
  "Lough Neagh": "Лох-Ней",
  "Loch Ness": "Лох-Несс",
  "Lough Neagh in Northern Ireland. Loch Lomond is the largest in Great Britain, and Windermere the largest in England.":
    "Лох-Ней в Северной Ирландии. Лох-Ломонд — самое большое в Великобритании, а Уиндермир — самое большое в Англии.",
  "Which sea lies to the east of Great Britain?":
    "Какое море лежит к востоку от Великобритании?",
  "The Irish Sea": "Ирландское море",
  "The North Sea": "Северное море",
  "The Atlantic Ocean": "Атлантический океан",
  "The English Channel": "Ла-Манш",
  "The North Sea to the east, the Channel to the south, the Irish Sea to the west.":
    "Северное море на востоке, Ла-Манш на юге, Ирландское море на западе.",
  "Which of these is a Crown Dependency rather than part of the UK?":
    "Что из перечисленного является коронным владением, а не частью Соединённого Королевства?",
  "Anglesey": "Англси",
  "The Isle of Wight": "Остров Уайт",
  "The Isles of Scilly": "Острова Силли",
  "The Isle of Man and the Channel Islands are Crown Dependencies with their own governments. The others are UK islands.":
    "Остров Мэн и Нормандские острова — коронные владения с собственными правительствами. Остальные — острова Соединённого Королевства.",
  "How many National Parks are there in the UK?":
    "Сколько в Соединённом Королевстве национальных парков?",
  "15, including the Lake District, Snowdonia, the Cairngorms and the Peak District.":
    "15, среди них Озёрный край, Сноудония, Кайрнгормс и Пик-Дистрикт.",
  "Which river flows through London?": "Какая река течёт через Лондон?",
  "The Mersey": "Мерси",
  "The Thames — the second longest river in the UK, after the Severn.":
    "Темза — вторая по длине река Соединённого Королевства после Северна.",
  "In which year did the Channel Tunnel open?": "В каком году открылся тоннель под Ла-Маншем?",
  "1984": "В 1984",
  "1990": "В 1990",
  "1994": "В 1994",
  "2000": "В 2000",
  "1994, linking Folkestone with Coquelles in France — the UK's only fixed land link to the continent.":
    "В 1994 году, соединив Фолкстон с Кокелем во Франции — единственная постоянная сухопутная связь Соединённого Королевства с континентом.",
  "Which of these is an official language in Wales?":
    "Какой язык является официальным в Уэльсе?",
  "Gaelic": "Гэльский",
  "Welsh": "Валлийский",
  "Cornish": "Корнский",
  "Irish": "Ирландский",
  "Welsh is official in Wales and taught in schools there. Gaelic is spoken in parts of Scotland, Irish in Northern Ireland.":
    "Валлийский официален в Уэльсе, и его там преподают в школах. На гэльском говорят в части Шотландии, на ирландском — в Северной Ирландии.",
  "How many counties does Northern Ireland have?": "Сколько графств в Северной Ирландии?",
  "Four": "Четыре",
  "Six": "Шесть",
  "Six: Antrim, Armagh, Down, Fermanagh, Londonderry and Tyrone.":
    "Шесть: Антрим, Арма, Даун, Фермана, Лондондерри и Тирон.",
  "What is the national flower of England?":
    "Какой цветок является национальным символом Англии?",
  "The rose — the red and white Tudor rose, from the end of the Wars of the Roses.":
    "Роза — красно-белая роза Тюдоров, оставшаяся от конца войны Алой и Белой розы.",
  "Which plant is the emblem of Scotland?": "Какое растение является эмблемой Шотландии?",
  "The leek": "Лук-порей",
  "The oak": "Дуб",
  "The thistle, a spiny purple flower, has been Scotland's emblem for centuries.":
    "Чертополох, колючий лиловый цветок, служит эмблемой Шотландии уже несколько веков.",
  "On what date is St Andrew's Day?": "Какого числа отмечают день святого Андрея?",
  "1 March": "1 марта",
  "17 March": "17 марта",
  "23 April": "23 апреля",
  "30 November": "30 ноября",
  "30 November, and it is a bank holiday in Scotland.":
    "30 ноября, и в Шотландии это выходной день.",
  "St George is the patron saint of which nation?": "Святой Георгий — покровитель какой страны?",
  "England, celebrated on 23 April. His red cross on white forms part of the Union Flag.":
    "Англии, и его день отмечают 23 апреля. Его красный крест на белом входит в состав флага Соединённого Королевства.",
  "Which patron saints' days both fall in March?":
    "Дни каких двух святых покровителей приходятся на март?",
  "St George and St Andrew": "Святого Георгия и святого Андрея",
  "St David and St Patrick": "Святого Давида и святого Патрика",
  "St Patrick and St George": "Святого Патрика и святого Георгия",
  "St David and St Andrew": "Святого Давида и святого Андрея",
  "St David on 1 March and St Patrick on 17 March. These two are the pair most often confused.":
    "Святого Давида 1 марта и святого Патрика 17 марта. Эту пару путают чаще всего.",
  "Which three crosses make up the Union Flag?":
    "Какие три креста составляют флаг Соединённого Королевства?",
  "St George, St Andrew and St David": "Святого Георгия, святого Андрея и святого Давида",
  "St George, St Andrew and St Patrick": "Святого Георгия, святого Андрея и святого Патрика",
  "St Patrick, St David and St Andrew": "Святого Патрика, святого Давида и святого Андрея",
  "St George, St David and St Patrick": "Святого Георгия, святого Давида и святого Патрика",
  "England's St George, Scotland's St Andrew and Ireland's St Patrick. Wales is not represented.":
    "Английский святого Георгия, шотландский святого Андрея и ирландский святого Патрика. Уэльс на нём не представлен.",
  "Why is Wales not represented on the Union Flag?":
    "Почему Уэльс не представлен на флаге Соединённого Королевства?",
  "Wales refused to join": "Уэльс отказался присоединиться",
  "Wales was already united with England when the flag was designed":
    "К моменту создания флага Уэльс уже был объединён с Англией",
  "The dragon was considered unsuitable": "Дракона сочли неподходящим",
  "Wales joined the UK only in 1900": "Уэльс вошёл в Соединённое Королевство только в 1900 году",
  "By 1606 Wales had already been joined to England, so it was not treated as a separate kingdom.":
    "К 1606 году Уэльс уже был присоединён к Англии, поэтому отдельным королевством его не считали.",
  "What is the national anthem of the UK?": "Какой гимн у Соединённого Королевства?",
  "Land of Hope and Glory": "Land of Hope and Glory",
  "God Save the King": "God Save the King",
  "Jerusalem": "Jerusalem",
  "Rule, Britannia!": "Rule, Britannia!",
  "God Save the King — God Save the Queen during a queen's reign. The words follow the monarch's gender.":
    "God Save the King — а в правление королевы God Save the Queen. Слова следуют за полом монарха.",
  "Which animal appears on the flag of Wales?": "Какое животное изображено на флаге Уэльса?",
  "A lion": "Лев",
  "A unicorn": "Единорог",
  "A dragon": "Дракон",
  "An eagle": "Орёл",
  "Which two animals support the Royal Coat of Arms?":
    "Какие два животных держат королевский герб?",
  "A lion and a unicorn": "Лев и единорог",
  "A lion and a dragon": "Лев и дракон",
  "An eagle and a lion": "Орёл и лев",
  "A unicorn and a stag": "Единорог и олень",
  "The lion for England and the unicorn for Scotland.": "Лев за Англию и единорог за Шотландию.",
  "Which flower is associated with Northern Ireland?":
    "Какое растение связывают с Северной Ирландией?",
  "The shamrock, the three-leaved clover associated with St Patrick.":
    "Трилистник, трёхлистный клевер, который связывают со святым Патриком.",
  "What does the Scottish flag, the Saltire, look like?":
    "Как выглядит флаг Шотландии, Сальтир?",
  "A red cross on white": "Красный крест на белом",
  "A white diagonal cross on blue": "Белый косой крест на синем",
  "A red diagonal cross on white": "Красный косой крест на белом",
  "A red dragon on green and white": "Красный дракон на зелёном и белом",
  "A white diagonal cross — St Andrew's saltire — on a blue background.":
    "Белый косой крест — сальтир святого Андрея — на синем поле.",
  "In which year did Claudius begin the Roman conquest of Britain?":
    "В каком году Клавдий начал римское завоевание Британии?",
  "AD 43 under Claudius. Caesar's earlier expedition in 55 BC failed to conquer anything.":
    "В 43 году нашей эры при Клавдии. Более ранний поход Цезаря в 55 году до нашей эры ничего не завоевал.",
  "What happened when Julius Caesar came to Britain in 55 BC?":
    "Что произошло, когда Юлий Цезарь пришёл в Британию в 55 году до нашей эры?",
  "He conquered the whole island": "Он завоевал весь остров",
  "His expedition failed and Britain was not conquered":
    "Его поход не удался, и Британия завоёвана не была",
  "He built Hadrian's Wall": "Он построил вал Адриана",
  "He was defeated by Boudicca": "Он был разбит Боудиккой",
  "Caesar came and left. The conquest began almost a century later under Claudius, in AD 43.":
    "Цезарь пришёл и ушёл. Завоевание началось почти столетием позже при Клавдии, в 43 году нашей эры.",
  "Who built a wall across northern England to keep out the tribes of the north?":
    "Кто построил вал через север Англии, чтобы не пускать северные племена?",
  "Julius Caesar": "Юлий Цезарь",
  "Emperor Hadrian": "Император Адриан",
  "Hadrian's Wall, begun around AD 122. The Romans never conquered what is now Scotland.":
    "Вал Адриана, начатый около 122 года нашей эры. Земли нынешней Шотландии римляне так и не завоевали.",
  "Who led a revolt against Roman rule in eastern England?":
    "Кто возглавил восстание против римского владычества на востоке Англии?",
  "Boudicca, queen of the Iceni. Her statue stands on Westminster Bridge in London.":
    "Боудикка, королева иценов. Её статуя стоит у Вестминстерского моста в Лондоне.",
  "In which year did the Romans leave Britain?": "В каком году римляне ушли из Британии?",
  "AD 597": "В 597 году нашей эры",
  "AD 410, when troops were withdrawn to defend Rome itself.":
    "В 410 году нашей эры, когда войска отозвали на защиту самого Рима.",
  "A Roman legal code": "Римский свод законов",
  "The law brought by the Normans in 1066": "Право, принесённое норманнами в 1066 году",
  "A tax paid to the Vikings": "Дань, которую платили викингам",
  "Alfred could not drive the Vikings out entirely, so a boundary was agreed. The north and east kept Danish law.":
    "Альфред не смог изгнать викингов полностью, и была согласована граница. Север и восток сохранили датское право.",
  "Which king defeated the Vikings and agreed the boundary that created the Danelaw?":
    "Какой король разбил викингов и согласовал границу, создавшую Данелаг?",
  "Harold": "Гарольд",
  "Canute": "Кнуд",
  "Edward the Confessor": "Эдуард Исповедник",
  "Alfred the Great, King of Wessex — the only English monarch called 'the Great'.":
    "Альфред Великий, король Уэссекса — единственный английский монарх, прозванный Великим.",
  "Which prehistoric monument stands in Wiltshire?":
    "Какой доисторический памятник стоит в Уилтшире?",
  "Hadrian's Wall": "Вал Адриана",
  "Stonehenge": "Стоунхендж",
  "Skara Brae": "Скара-Брей",
  "Maiden Castle": "Мейден-Касл",
  "Stonehenge, built in the Stone Age and still a World Heritage Site.":
    "Стоунхендж, построенный в каменном веке и по сей день входящий в список Всемирного наследия.",
  "Where is the Stone Age settlement of Skara Brae?":
    "Где находится поселение каменного века Скара-Брей?",
  "Cornwall": "В Корнуолле",
  "Orkney": "На Оркнейских островах",
  "Skara Brae is in Orkney, off the north coast of Scotland.":
    "Скара-Брей находится на Оркнейских островах, у северного берега Шотландии.",
  "The languages of which people gave rise to modern Welsh, Gaelic and Irish?":
    "Языки какого народа дали начало нынешним валлийскому, гэльскому и ирландскому?",
  "The Celts": "Кельтов",
  "The Vikings": "Викингов",
  "The Celts of the Iron Age. Their languages survive in Wales, Scotland and Ireland.":
    "Кельтов железного века. Их языки уцелели в Уэльсе, Шотландии и Ирландии.",
  "Where does the name 'England' come from?": "Откуда происходит название «Англия»?",
  "The Angles, one of the tribes who settled after the Romans":
    "От англов, одного из племён, осевших после римлян",
  "A Roman province called Anglia": "От римской провинции под названием Англия",
  "The Norman word for island": "От норманнского слова «остров»",
  "A Viking king named Engle": "От короля викингов по имени Энгле",
  "Angles, Saxons and Jutes settled after AD 410. 'Angle-land' became England.":
    "Англы, саксы и юты осели после 410 года. «Земля англов» стала Англией.",
  "In which year was the Battle of Hastings?": "В каком году произошла битва при Гастингсе?",
  "1066 — William of Normandy defeated Harold. It is the last successful invasion of Britain.":
    "В 1066 году — Вильгельм Нормандский разбил Гарольда. Это последнее удавшееся вторжение в Британию.",
  "Who founded a monastery on Iona and helped convert Scotland to Christianity?":
    "Кто основал монастырь на Ионе и помог обратить Шотландию в христианство?",
  "St Augustine": "Святой Августин",
  "St Columba in Scotland; St Augustine did the same in the south and became the first Archbishop of Canterbury.":
    "Святой Колумба в Шотландии; святой Августин сделал то же на юге и стал первым архиепископом Кентерберийским.",
  "In which year was Magna Carta agreed?":
    "В каком году была принята Великая хартия вольностей?",
  "1215 at Runnymede, forced on King John by his barons.":
    "В 1215 году в Раннимиде, вынужденно подписанная королём Иоанном под давлением баронов.",
  "What principle did Magna Carta establish?":
    "Какое начало установила Великая хартия вольностей?",
  "That everyone could vote": "Что голосовать может каждый",
  "That the king was subject to the law": "Что король подчинён закону",
  "That Parliament chose the monarch": "Что монарха выбирает парламент",
  "The king was bound by law and could not tax at will. It did not create Parliament or give anyone the vote.":
    "Король был связан законом и не мог облагать податями по своей воле. Парламента она не создавала и права голоса никому не давала.",
  "What was the Domesday Book?": "Чем была Книга Страшного суда?",
  "A record of church law": "Сводом церковного права",
  "A survey of land ownership and value across England":
    "Описью землевладения и его стоимости по всей Англии",
  "A list of English kings": "Списком английских королей",
  "The first English dictionary": "Первым английским словарём",
  "Ordered by William the Conqueror in 1086 to record who owned what and what it was worth.":
    "Она была составлена по приказу Вильгельма Завоевателя в 1086 году, чтобы записать, кто чем владеет и сколько это стоит.",
  "Who won the Battle of Bannockburn in 1314?":
    "Кто победил в битве при Бэннокберне в 1314 году?",
  "Henry V": "Генрих V",
  "Robert the Bruce, securing Scottish independence. Wallace had led the earlier resistance and was executed in 1305.":
    "Роберт Брюс, закрепив независимость Шотландии. Уоллес возглавлял более раннее сопротивление и был казнён в 1305 году.",
  "Which king conquered Wales and built a ring of castles there?":
    "Какой король завоевал Уэльс и построил там кольцо замков?",
  "Henry II": "Генрих II",
  "Richard I": "Ричард I",
  "King John": "Король Иоанн",
  "Edward I. The Statute of Rhuddlan of 1284 annexed Wales to the English Crown.":
    "Эдуард I. Ридланский статут 1284 года присоединил Уэльс к английской Короне.",
  "Roughly how much of Britain's population died in the Black Death?":
    "Примерно какая часть населения Британии умерла от чёрной смерти?",
  "A tenth": "Десятая",
  "A third": "Треть",
  "A half": "Половина",
  "Two thirds": "Две трети",
  "About a third, from 1348. The resulting shortage of labour helped end the feudal system.":
    "Около трети, начиная с 1348 года. Нехватка рабочих рук, к которой это привело, помогла покончить с феодальным строем.",
  "What triggered the Peasants' Revolt of 1381?":
    "Что вызвало крестьянское восстание 1381 года?",
  "A new poll tax": "Новая подушная подать",
  "The Black Death": "Чёрная смерть",
  "The loss of France": "Потеря Франции",
  "The murder of Thomas Becket": "Убийство Томаса Бекета",
  "A poll tax imposed after the Black Death. The revolt was led by Wat Tyler.":
    "Подушная подать, введённая после чёрной смерти. Восстание возглавил Уот Тайлер.",
  "How long did the Hundred Years War last?": "Сколько длилась Столетняя война?",
  "Exactly 100 years": "Ровно 100 лет",
  "From 1337 to 1453": "С 1337 по 1453 год",
  "From 1215 to 1315": "С 1215 по 1315 год",
  "From 1485 to 1585": "С 1485 по 1585 год",
  "1337 to 1453 — 116 years, on and off, despite the name.":
    "С 1337 по 1453 год — 116 лет с перерывами, вопреки названию.",
  "Which houses fought the Wars of the Roses?":
    "Какие дома сражались в войне Алой и Белой розы?",
  "Tudor and Stuart": "Тюдоры и Стюарты",
  "Lancaster and York": "Ланкастеры и Йорки",
  "York and Normandy": "Йорки и Нормандцы",
  "Wessex and Mercia": "Уэссекс и Мерсия",
  "Lancaster (red rose) and York (white rose). The Tudor rose combined both after 1485.":
    "Ланкастеры (алая роза) и Йорки (белая роза). Роза Тюдоров соединила обе после 1485 года.",
  "Which battle ended the Wars of the Roses in 1485?":
    "Какая битва закончила войну Алой и Белой розы в 1485 году?",
  "Agincourt": "При Азенкуре",
  "Bosworth Field": "При Босворте",
  "Bannockburn": "При Бэннокберне",
  "Hastings": "При Гастингсе",
  "Bosworth Field. Richard III was killed and Henry Tudor became Henry VII.":
    "При Босворте. Ричард III был убит, а Генрих Тюдор стал Генрихом VII.",
  "Who was murdered in Canterbury Cathedral in 1170?":
    "Кого убили в Кентерберийском соборе в 1170 году?",
  "Thomas Becket": "Томаса Бекета",
  "Wat Tyler": "Уота Тайлера",
  "Thomas Becket, Archbishop of Canterbury, after quarrelling with Henry II.":
    "Томаса Бекета, архиепископа Кентерберийского, после ссоры с Генрихом II.",
  "Which English king won the Battle of Agincourt in 1415?":
    "Какой английский король выиграл битву при Азенкуре в 1415 году?",
  "Edward III": "Эдуард III",
  "Henry V. Despite such victories, England ended the Hundred Years War holding only Calais.":
    "Генрих V. Несмотря на такие победы, Англия закончила Столетнюю войну, удержав один только Кале.",
  "Which king spent almost his entire reign abroad on crusade?":
    "Какой король провёл почти всё своё правление за морем в крестовом походе?",
  "Richard I, the Lionheart. His brother John succeeded him and was forced to accept Magna Carta.":
    "Ричард I Львиное Сердце. Ему наследовал брат Иоанн, вынужденный принять Великую хартию вольностей.",
  "How many wives did Henry VIII have?": "Сколько жён было у Генриха VIII?",
  "Six: divorced, beheaded, died; divorced, beheaded, survived.":
    "Шесть: развёлся, обезглавил, умерла; развёлся, обезглавил, пережила.",
  "He converted to Protestantism by conviction": "Он перешёл в протестантизм по убеждению",
  "Parliament voted to leave": "Парламент проголосовал за разрыв",
  "He was excommunicated for heresy": "Его отлучили от церкви за ересь",
  "The break began as a dispute over his first marriage. He made himself Head of the Church of England.":
    "Разрыв начался со спора о его первом браке. Он сделал себя главой Церкви Англии.",
  "In which year was the Spanish Armada defeated?":
    "В каком году была разбита Непобедимая армада?",
  "1558": "В 1558",
  "1588 — beaten off by the English navy and then scattered by storms.":
    "В 1588 году — её отбил английский флот, а затем разметали бури.",
  "Which of Henry VIII's wives was the mother of Elizabeth I?":
    "Какая из жён Генриха VIII была матерью Елизаветы I?",
  "Anne Boleyn, who was beheaded. Catherine of Aragon was Mary I's mother and Jane Seymour Edward VI's.":
    "Анна Болейн, которую обезглавили. Екатерина Арагонская была матерью Марии I, а Джейн Сеймур — Эдуарда VI.",
  "Oxford": "В Оксфорде",
  "Stratford-upon-Avon in 1564. He worked in London, at the Globe Theatre.":
    "В Стратфорде-на-Эйвоне в 1564 году. Работал он в Лондоне, в театре «Глобус».",
  "Which monarch was known as 'Bloody Mary'?": "Какого монарха прозвали Кровавой Мэри?",
  "Mary II": "Марию II",
  "Mary, Queen of Scots": "Марию Стюарт",
  "Mary I, a devout Catholic who reversed the Reformation and had Protestants executed.":
    "Марию I, ревностную католичку, которая повернула Реформацию вспять и казнила протестантов.",
  "What was the Dissolution of the Monasteries?": "Что такое роспуск монастырей?",
  "The closing of monasteries and seizure of their wealth by the Crown":
    "Закрытие монастырей и отход их богатств Короне",
  "A new set of monastic rules": "Новый свод монастырских правил",
  "The founding of new monasteries": "Основание новых монастырей",
  "A tax on the Church paid to Rome": "Подать с Церкви, которую платили Риму",
  "It followed Henry VIII's break with Rome and transferred great wealth to the Crown.":
    "Он последовал за разрывом Генриха VIII с Римом и передал Короне огромные богатства.",
  "How long did Elizabeth I reign?": "Сколько правила Елизавета I?",
  "About 20 years": "Около 20 лет",
  "About 45 years": "Около 45 лет",
  "About 60 years": "Около 60 лет",
  "About 70 years": "Около 70 лет",
  "45 years. She never married and found a religious middle way that largely held.":
    "45 лет. Она так и не вышла замуж и нашла в вере средний путь, который по большей части удержался.",
  "Which Tudor king ended the Wars of the Roses and founded the dynasty?":
    "Какой король из Тюдоров закончил войну Алой и Белой розы и основал династию?",
  "Henry VII": "Генрих VII",
  "Richard III": "Ричард III",
  "Henry VII won at Bosworth Field in 1485.": "Генрих VII победил при Босворте в 1485 году.",
  "Whose son became James VI of Scotland and then James I of England?":
    "Чей сын стал Иаковом VI Шотландским, а затем Иаковом I Английским?",
  "Mary, Queen of Scots, executed in 1587. Her son united the two crowns in 1603.":
    "Марии Стюарт, казнённой в 1587 году. Её сын соединил две короны в 1603 году.",
  "Which of these plays did Shakespeare write?": "Какую из этих пьес написал Шекспир?",
  "The Canterbury Tales": "«Кентерберийские рассказы»",
  "Macbeth": "«Макбет»",
  "Paradise Lost": "«Потерянный рай»",
  "Oliver Twist": "«Оливер Твист»",
  "Macbeth. The Canterbury Tales is Chaucer, Paradise Lost is Milton, Oliver Twist is Dickens.":
    "«Макбет». «Кентерберийские рассказы» — Чосер, «Потерянный рай» — Мильтон, «Оливер Твист» — Диккенс.",
  "Which Tudor monarch died at the age of 15?": "Какой монарх из Тюдоров умер в пятнадцать лет?",
  "Edward VI, Henry VIII's only surviving son. The Book of Common Prayer dates from his reign.":
    "Эдуард VI, единственный выживший сын Генриха VIII. Книга общих молитв появилась в его правление.",
  "What is remembered every year on 5 November?": "Что вспоминают каждый год 5 ноября?",
  "The failure of the Gunpowder Plot": "Провал Порохового заговора",
  "The execution of Charles I": "Казнь Карла I",
  "Guy Fawkes and his fellow plotters failed to blow up Parliament in 1605.":
    "Гай Фокс и его сообщники не сумели взорвать парламент в 1605 году.",
  "Who were the Cavaliers?": "Кто такие кавалеры?",
  "Members of the Gunpowder Plot": "Участники Порохового заговора",
  "Cavaliers, or Royalists, supported Charles I. The Roundheads supported Parliament.":
    "Кавалеры, они же роялисты, поддерживали Карла I. Круглоголовые поддерживали парламент.",
  "In which year was Charles I executed?": "В каком году казнили Карла I?",
  "1642": "В 1642",
  "1649 — the only English king put to death by his own subjects.":
    "В 1649 году — единственный английский король, преданный смерти собственными подданными.",
  "What title did Oliver Cromwell hold?": "Какой титул носил Оливер Кромвель?",
  "King of England": "Король Англии",
  "Lord Protector": "Лорд-протектор",
  "Prime Minister": "Премьер-министр",
  "Lord Chancellor": "Лорд-канцлер",
  "Lord Protector of the Commonwealth. He refused the crown.":
    "Лорд-протектор Содружества. От короны он отказался.",
  "What was the Restoration of 1660?": "Что такое Реставрация 1660 года?",
  "Parliament inviting Charles II back to the throne":
    "Парламент позвал Карла II обратно на престол",
  "The rebuilding of London after the fire": "Восстановление Лондона после пожара",
  "The return of Catholicism": "Возвращение католичества",
  "The reopening of the monasteries": "Открытие монастырей заново",
  "After Cromwell's death Parliament invited Charles II to return, ending the republic.":
    "После смерти Кромвеля парламент позвал Карла II вернуться, и республика кончилась.",
  "Votes for all men over 21": "Право голоса для всех мужчин старше 21 года",
  "The union of England and Scotland": "Объединение Англии и Шотландии",
  "Freedom of religion for Catholics": "Свобода вероисповедания для католиков",
  "It made the monarchy constitutional: no taxation or standing army without Parliament, regular parliaments, free elections.":
    "Он сделал монархию конституционной: никаких податей и постоянного войска без парламента, регулярные парламенты, свободные выборы.",
  "Why is the change of monarch in 1688 called the Glorious Revolution?":
    "Почему смену монарха в 1688 году называют Славной революцией?",
  "It gave ordinary people the vote": "Она дала простым людям право голоса",
  "It ended a war with France": "Она закончила войну с Францией",
  "James II fled rather than fight, so the throne changed hands without a battle in England.":
    "Иаков II бежал, а не стал сражаться, и потому престол в Англии перешёл в другие руки без битвы.",
  "Which two monarchs ruled jointly after the Glorious Revolution?":
    "Какие два монарха правили совместно после Славной революции?",
  "William III and Mary II": "Вильгельм III и Мария II",
  "Charles II and James II": "Карл II и Иаков II",
  "James I and Charles I": "Иаков I и Карл I",
  "Mary I and Elizabeth I": "Мария I и Елизавета I",
  "William of Orange and his wife Mary, James II's Protestant daughter.":
    "Вильгельм Оранский и его жена Мария, протестантская дочь Иакова II.",
  "In which year was the Great Fire of London?": "В каком году был Великий лондонский пожар?",
  "1665": "В 1665",
  "1666, the year after the Great Plague of 1665.":
    "В 1666 году, через год после Великой чумы 1665 года.",
  "What did Charles I believe about his authority?": "Что Карл I думал о своей власти?",
  "That it came from Parliament": "Что она идёт от парламента",
  "That it came from God — the divine right of kings":
    "Что она идёт от Бога — божественное право королей",
  "That it came from the Church of England": "Что она идёт от Церкви Англии",
  "That it could be voted on": "Что о ней можно голосовать",
  "The divine right of kings. He ruled eleven years without calling Parliament, and the quarrel became war in 1642.":
    "Божественное право королей. Он правил одиннадцать лет, не созывая парламента, и в 1642 году ссора стала войной.",
  "Which Bible translation was ordered by James I?":
    "Какой перевод Библии был заказан Иаковом I?",
  "The Book of Common Prayer": "Книга общих молитв",
  "The King James Bible": "Библия короля Иакова",
  "The Geneva Bible": "Женевская Библия",
  "The Great Bible": "Большая Библия",
  "The King James Bible, still the best-known English translation.":
    "Библия короля Иакова, и по сей день самый известный английский перевод.",
  "Which scientific institution was founded during the reign of Charles II?":
    "Какое научное учреждение было основано в правление Карла II?",
  "The Royal Society": "Королевское общество",
  "The British Museum": "Британский музей",
  "The National Gallery": "Национальная галерея",
  "The Royal Institution": "Королевский институт",
  "The Royal Society, Britain's oldest scientific institution, founded in the 1660s.":
    "Королевское общество, старейшее научное учреждение Британии, основанное в 1660-е годы.",
  "What did the Act of Union of 1707 create?": "Что создал Акт об унии 1707 года?",
  "The United Kingdom": "Соединённое Королевство",
  "The Kingdom of Great Britain": "Королевство Великобритания",
  "The Commonwealth": "Содружество",
  "The British Empire": "Британскую империю",
  "It joined the parliaments of England and Scotland as Great Britain. Ireland was added in 1801, creating the UK.":
    "Он соединил парламенты Англии и Шотландии в Великобританию. Ирландию добавили в 1801 году, и получилось Соединённое Королевство.",
  "Which Act of Union created the United Kingdom by adding Ireland?":
    "Какой Акт об унии создал Соединённое Королевство, добавив Ирландию?",
  "The Act of 1707": "Акт 1707 года",
  "The Act of 1801": "Акт 1801 года",
  "The Act of 1832": "Акт 1832 года",
  "The Act of 1922": "Акт 1922 года",
  "1707 made Great Britain; 1801 added Ireland and made it the United Kingdom.":
    "1707 год дал Великобританию; 1801 добавил Ирландию и сделал её Соединённым Королевством.",
  "Which battle in 1746 was the last fought on British soil?":
    "Какая битва 1746 года была последней на британской земле?",
  "Culloden": "При Каллодене",
  "Waterloo": "При Ватерлоо",
  "Trafalgar": "При Трафальгаре",
  "Culloden, where the Jacobite rising under Bonnie Prince Charlie was crushed.":
    "При Каллодене, где было разгромлено якобитское восстание под началом Красавчика принца Чарли.",
  "Which Act abolished slavery throughout the British Empire?":
    "Какой акт отменил рабство во всей Британской империи?",
  "1807 ended the slave trade; 1833 abolished slavery itself and freed those already enslaved.":
    "1807 год покончил с работорговлей; 1833 отменил само рабство и освободил тех, кто уже был в неволе.",
  "What did the Act of 1807 abolish?": "Что отменил акт 1807 года?",
  "Slavery itself throughout the Empire": "Само рабство во всей империи",
  "The slave trade — the buying and carrying of enslaved people":
    "Работорговлю — покупку и перевозку людей в неволе",
  "Child labour in factories": "Детский труд на фабриках",
  "The East India Company": "Ост-Индскую компанию",
  "1807 stopped the trade. Slavery itself continued until the Act of 1833.":
    "1807 год остановил торговлю. Само рабство продолжалось до акта 1833 года.",
  "Who led the parliamentary campaign against the slave trade?":
    "Кто возглавил в парламенте борьбу против работорговли?",
  "Robert Peel": "Роберт Пиль",
  "Wilberforce, supported by the Quakers among others.":
    "Уилберфорс, которого поддерживали в том числе квакеры.",
  "Who commanded the British fleet at Trafalgar in 1805?":
    "Кто командовал британским флотом при Трафальгаре в 1805 году?",
  "Captain Cook": "Капитан Кук",
  "Sir Francis Drake": "Сэр Фрэнсис Дрейк",
  "Nelson won and was killed in the battle. Nelson's Column stands in Trafalgar Square.":
    "Нельсон победил и погиб в этом сражении. Колонна Нельсона стоит на Трафальгарской площади.",
  "Who finally defeated Napoleon at Waterloo in 1815?":
    "Кто окончательно разбил Наполеона при Ватерлоо в 1815 году?",
  "William Pitt": "Уильям Питт",
  "George III": "Георг III",
  "Wellington beat Napoleon on land, ten years after Nelson had beaten the French at sea.":
    "Веллингтон разбил Наполеона на суше через десять лет после того, как Нельсон разбил французов на море.",
  "From 1760 to 1820": "С 1760 по 1820 год",
  "64 years — the second longest reign, after Elizabeth II.":
    "64 года — второе по длине правление после Елизаветы II.",
  "Who improved the steam engine and made industrial power practical?":
    "Кто усовершенствовал паровую машину и сделал промышленную силу применимой на деле?",
  "James Watt. Stephenson built the Rocket and the first passenger railways.":
    "Джеймс Уатт. Стефенсон построил «Ракету» и первые пассажирские железные дороги.",
  "Who founded modern nursing during the Crimean War?":
    "Кто основал современное сестринское дело во время Крымской войны?",
  "Elizabeth Fry": "Элизабет Фрай",
  "Mary Seacole": "Мэри Сикол",
  "Florence Nightingale, who set up the first nursing school at St Thomas' Hospital in London.":
    "Флоренс Найтингейл, открывшая первую школу сестёр при больнице святого Фомы в Лондоне.",
  "What did Charles Darwin publish in 1859?": "Что Чарльз Дарвин издал в 1859 году?",
  "Principia Mathematica": "«Математические начала»",
  "On the Origin of Species": "«Происхождение видов»",
  "The Wealth of Nations": "«Богатство народов»",
  "A Christmas Carol": "«Рождественскую песнь»",
  "On the Origin of Species, setting out evolution by natural selection.":
    "«Происхождение видов», где изложена эволюция путём естественного отбора.",
  "What was displayed at the Great Exhibition of 1851?":
    "Что показывали на Всемирной выставке 1851 года?",
  "British industrial and imperial achievement, in the Crystal Palace":
    "Британские промышленные и имперские достижения, в Хрустальном дворце",
  "The Crown Jewels": "Королевские регалии",
  "Paintings from the National Gallery": "Картины из Национальной галереи",
  "The first railway engines only": "Только первые паровозы",
  "It showcased Britain at the height of its industrial power, in the purpose-built Crystal Palace.":
    "Она показала Британию на вершине её промышленной мощи, в построенном для этого Хрустальном дворце.",
  "In which year did the American colonies declare independence?":
    "В каком году американские колонии объявили независимость?",
  "1776. Britain lost its most valuable settler colonies.":
    "В 1776 году. Британия потеряла самые ценные из своих переселенческих колоний.",
  "Which engineer built the Great Western Railway and the Clifton Suspension Bridge?":
    "Какой инженер построил Большую Западную железную дорогу и Клифтонский подвесной мост?",
  "Thomas Telford": "Томас Телфорд",
  "Brunel — railways, bridges, tunnels and pioneering steamships.":
    "Брюнель — железные дороги, мосты, тоннели и первые пароходы своего рода.",
  "On what date did the First World War end?": "Какого числа закончилась Первая мировая война?",
  "8 May 1918": "8 мая 1918 года",
  "11 November 1918": "11 ноября 1918 года",
  "1 September 1939": "1 сентября 1939 года",
  "6 June 1944": "6 июня 1944 года",
  "11 November 1918 — which is why Remembrance Day falls on that date.":
    "11 ноября 1918 года — потому и День памяти приходится на это число.",
  "In which year did women get the vote on the same terms as men?":
    "В каком году женщины получили право голоса на равных с мужчинами условиях?",
  "1918 gave the vote to women over 30 with a property qualification; 1928 brought full equality at 21.":
    "1918 год дал право голоса женщинам старше 30 лет с имущественным цензом; 1928 принёс полное равенство с 21 года.",
  "What did the Representation of the People Act of 1918 do for women?":
    "Что акт о народном представительстве 1918 года дал женщинам?",
  "Gave all women over 21 the vote": "Право голоса всем женщинам старше 21 года",
  "Gave women over 30 who met a property qualification the vote":
    "Право голоса женщинам старше 30 лет, отвечавшим имущественному цензу",
  "Gave no women the vote": "Не дал права голоса ни одной женщине",
  "Allowed women to stand for Parliament only":
    "Разрешил женщинам только выдвигаться в парламент",
  "Over 30, and with property. Equality with men at 21 waited another ten years, until 1928.":
    "Старше 30 и с имуществом. Равенства с мужчинами с 21 года пришлось ждать ещё десять лет, до 1928 года.",
  "Who led the suffragette campaign for votes for women?":
    "Кто возглавил движение суфражисток за право голоса для женщин?",
  "Emmeline Pankhurst. The campaign used protests, hunger strikes and imprisonment.":
    "Эммелин Панкхерст. Движение прибегало к протестам, голодовкам и шло на тюрьму.",
  "Who was Prime Minister for most of the Second World War?":
    "Кто был премьер-министром большую часть Второй мировой войны?",
  "Churchill became Prime Minister in 1940 and led Britain for the rest of the war.":
    "Черчилль стал премьер-министром в 1940 году и вёл Британию до конца войны.",
  "What was the Battle of Britain?": "Что такое битва за Британию?",
  "A naval battle in the Atlantic": "Морское сражение в Атлантике",
  "The RAF holding off the German air force in 1940":
    "Королевские ВВС сдержали немецкую авиацию в 1940 году",
  "The Allied landings in Normandy": "Высадка союзников в Нормандии",
  "The bombing of London": "Бомбардировки Лондона",
  "The air battle of 1940 that prevented invasion. The Blitz was the bombing of British cities.":
    "Воздушное сражение 1940 года, которое не дало состояться вторжению. Блиц — это бомбардировки британских городов.",
  "What happened on 6 June 1944?": "Что произошло 6 июня 1944 года?",
  "VE Day": "День Победы в Европе",
  "The D-Day landings in Normandy": "Высадка в Нормандии",
  "The start of the Blitz": "Начало Блица",
  "The evacuation from Dunkirk": "Эвакуация из Дюнкерка",
  "D-Day — the Allied landings that opened the campaign to liberate western Europe.":
    "День «Д» — высадка союзников, с которой началось освобождение Западной Европы.",
  "Bevan as Health Minister. Beveridge wrote the 1942 report; Attlee was the Prime Minister of the day.":
    "Бивен как министр здравоохранения. Беверидж написал доклад 1942 года; Эттли был тогдашним премьер-министром.",
  "What did the Beveridge Report of 1942 identify?": "Что назвал доклад Бевериджа 1942 года?",
  "Five giants: want, disease, ignorance, squalor and idleness":
    "Пять великанов: нужду, болезнь, невежество, убожество и праздность",
  "The causes of the war": "Причины войны",
  "A plan for decolonisation": "План освобождения колоний",
  "The structure of the Commonwealth": "Устройство Содружества",
  "Those five giants became the target of the post-war welfare state.":
    "Эти пять великанов стали целью послевоенного государства всеобщего благосостояния.",
  "Which ship gave its name to a generation of post-war arrivals from the Caribbean?":
    "Какое судно дало имя целому поколению послевоенных приезжих из Карибского бассейна?",
  "The Empire Windrush": "Empire Windrush",
  "The Mayflower": "«Мэйфлауэр»",
  "HMS Victory": "HMS Victory",
  "The Cutty Sark": "«Катти Сарк»",
  "The Empire Windrush arrived in 1948, the same year the NHS was founded.":
    "Empire Windrush пришёл в 1948 году, в тот же год, когда была основана NHS.",
  "The referendum was June 2016; the UK left on 31 January 2020, with a transition period to year end.":
    "Референдум был в июне 2016 года; Соединённое Королевство вышло 31 января 2020 года, с переходным сроком до конца года.",
  "In which year did the UK join the European Economic Community?":
    "В каком году Соединённое Королевство вступило в Европейское экономическое сообщество?",
  "1957": "В 1957",
  "1973. The EEC later became the European Union.":
    "В 1973 году. Позже ЕЭС стало Европейским союзом.",
  "Who became the first woman Prime Minister of the UK?":
    "Кто стала первой женщиной — премьер-министром Соединённого Королевства?",
  "Barbara Castle": "Барбара Касл",
  "Margaret Thatcher in 1979. Theresa May was the second, in 2016.":
    "Маргарет Тэтчер в 1979 году. Тереза Мэй была второй, в 2016 году.",
  "Which agreement of 1998 brought peace to Northern Ireland?":
    "Какое соглашение 1998 года принесло мир в Северную Ирландию?",
  "The Good Friday Agreement": "Соглашение Страстной пятницы",
  "The Anglo-Irish Agreement": "Англо-ирландское соглашение",
  "The Treaty of Rome": "Римский договор",
  "The Act of Union": "Акт об унии",
  "The Good Friday Agreement, which also created the power-sharing Northern Ireland Assembly.":
    "Соглашение Страстной пятницы, которое создало и Ассамблею Северной Ирландии с разделением власти.",
  "Which countries became independent in 1947, beginning decolonisation?":
    "Какие страны стали независимыми в 1947 году, положив начало распаду империи?",
  "Kenya and Nigeria": "Кения и Нигерия",
  "India and Pakistan": "Индия и Пакистан",
  "Australia and New Zealand": "Австралия и Новая Зеландия",
  "Jamaica and Barbados": "Ямайка и Барбадос",
  "India and Pakistan first, then most of Africa and the Caribbean. Many joined the Commonwealth.":
    "Сначала Индия и Пакистан, затем большая часть Африки и Карибского бассейна. Многие вошли в Содружество.",
  "Where did codebreakers work to break German ciphers in the Second World War?":
    "Где во время Второй мировой войны работали дешифровщики немецких шифров?",
  "Bletchley Park": "В Блетчли-парке",
  "Chequers": "В Чекерсе",
  "Portsmouth": "В Портсмуте",
  "Sandhurst": "В Сандхерсте",
  "Bletchley Park, where Alan Turing and others shortened the war.":
    "В Блетчли-парке, где Алан Тьюринг и другие сократили войну.",
  "Which came first: Magna Carta or the Battle of Hastings?":
    "Что было раньше: Великая хартия вольностей или битва при Гастингсе?",
  "The Battle of Hastings": "Битва при Гастингсе",
  "Magna Carta came first, by two centuries":
    "Великая хартия вольностей была раньше, на два века",
  "Hastings 1066, Magna Carta 1215 — the Conquest comes first, by about 150 years.":
    "Гастингс — 1066 год, Великая хартия — 1215: завоевание раньше примерно на 150 лет.",
  "Put these in order: the Spanish Armada, the Great Fire of London, the Act of Union with Scotland.":
    "Расставь по порядку: Непобедимая армада, Великий лондонский пожар, Акт об унии с Шотландией.",
  "Armada, Great Fire, Act of Union": "Армада, пожар, Акт об унии",
  "Great Fire, Armada, Act of Union": "Пожар, армада, Акт об унии",
  "Act of Union, Armada, Great Fire": "Акт об унии, армада, пожар",
  "Armada, Act of Union, Great Fire": "Армада, Акт об унии, пожар",
  "Armada 1588, Great Fire 1666, Act of Union 1707.":
    "Армада — 1588 год, пожар — 1666, Акт об унии — 1707.",
  "Which happened first: the founding of the NHS or the end of the Second World War?":
    "Что было раньше: основание NHS или конец Второй мировой войны?",
  "The end of the war": "Конец войны",
  "The same year": "В один и тот же год",
  "The NHS, by ten years": "NHS, на десять лет",
  "The war ended in 1945; the NHS opened in 1948, built by the government elected afterwards.":
    "Война кончилась в 1945 году; NHS открылась в 1948, и построило её правительство, избранное уже после.",
  "Which of these happened in 1689?": "Что из перечисленного произошло в 1689 году?",
  "The Glorious Revolution": "Славная революция",
  "The Glorious Revolution was 1688; the Bill of Rights that settled its terms was 1689.":
    "Славная революция была в 1688 году; Билль о правах, закрепивший её условия, — в 1689.",
  "In which year did the Romans first successfully invade Britain?":
    "В каком году римляне впервые успешно вторглись в Британию?",
  "AD 43 under Claudius. 55 BC was Caesar's failed expedition; AD 122 Hadrian's Wall; AD 410 the departure.":
    "В 43 году нашей эры при Клавдии. 55 год до нашей эры — неудавшийся поход Цезаря; 122 год — вал Адриана; 410 — уход.",
  "Which came first: the abolition of the slave trade or the Battle of Waterloo?":
    "Что было раньше: отмена работорговли или битва при Ватерлоо?",
  "The abolition of the slave trade, in 1807": "Отмена работорговли, в 1807 году",
  "Waterloo, in 1815": "Ватерлоо, в 1815 году",
  "They happened the same year": "Это случилось в один и тот же год",
  "Waterloo, by twenty years": "Ватерлоо, на двадцать лет",
  "The slave trade was abolished in 1807, eight years before Waterloo in 1815.":
    "Работорговлю отменили в 1807 году, за восемь лет до Ватерлоо в 1815-м.",
  "In which year did London most recently host the Olympic Games?":
    "В каком году Лондон последний раз принимал Олимпийские игры?",
  "2012. London has hosted three times — 1908, 1948 and 2012 — more than any other city.":
    "В 2012 году. Лондон принимал их трижды — в 1908, 1948 и 2012 годах, больше любого другого города.",
  "In which year did Queen Elizabeth II die?": "В каком году умерла королева Елизавета II?",
  "2021": "В 2021",
  "2023": "В 2023",
  "September 2022, after 70 years — the longest reign in British history. Charles III succeeded her.":
    "В сентябре 2022 года, после 70 лет на престоле — самое долгое правление в британской истории. Ей наследовал Карл III.",
  "Which came first: the Peasants' Revolt or the Black Death?":
    "Что было раньше: крестьянское восстание или чёрная смерть?",
  "The Peasants' Revolt": "Крестьянское восстание",
  "The Peasants' Revolt, by fifty years": "Крестьянское восстание, на пятьдесят лет",
  "The Black Death arrived in 1348; the revolt followed in 1381, triggered by a poll tax imposed afterwards.":
    "Чёрная смерть пришла в 1348 году; восстание последовало в 1381-м, вызванное введённой после неё подушной податью.",
  "In which year did the Scottish Parliament and the Welsh Assembly first sit?":
    "В каком году впервые собрались шотландский парламент и Ассамблея Уэльса?",
  "1999, after referendums in 1997.": "В 1999 году, после референдумов 1997 года.",
  "Which of these is the oldest?": "Что из перечисленного самое древнее?",
  "The Tower of London": "Лондонский Тауэр",
  "Edinburgh Castle": "Эдинбургский замок",
  "Stonehenge, from about 2500 BC — over two thousand years older than Hadrian's Wall.":
    "Стоунхендж, примерно с 2500 года до нашей эры — более чем на две тысячи лет старше вала Адриана.",
  "What kind of monarchy does the UK have?": "Какая монархия в Соединённом Королевстве?",
  "An absolute monarchy": "Абсолютная",
  "A constitutional monarchy": "Конституционная",
  "An elected monarchy": "Выборная",
  "No monarchy at all": "Монархии нет вовсе",
  "The monarch is Head of State but does not govern. Parliament makes the law.":
    "Монарх — глава государства, но не правит. Законы принимает парламент.",
  "The monarch's power to veto any law": "Право монарха наложить вето на любой закон",
  "The monarch's formal signature that turns a bill into an Act":
    "Формальная подпись монарха, превращающая законопроект в акт",
  "The ceremony crowning a monarch": "Обряд коронования монарха",
  "The final formal step in making a law. It has not been refused since 1708.":
    "Последний формальный шаг в принятии закона. В нём не отказывали с 1708 года.",
  "Who writes the speech the monarch reads at the State Opening of Parliament?":
    "Кто пишет речь, которую монарх читает на открытии сессии парламента?",
  "The government": "Правительство",
  "The Speaker of the Commons": "Спикер палаты общин",
  "The House of Lords": "Палата лордов",
  "The government writes it — it sets out their plans, not the monarch's views.":
    "Её пишет правительство — в ней изложены его планы, а не взгляды монарха.",
  "Who became monarch in September 2022?": "Кто стал монархом в сентябре 2022 года?",
  "King Charles III": "Король Карл III",
  "Prince William": "Принц Уильям",
  "Queen Camilla": "Королева Камилла",
  "King George VII": "Король Георг VII",
  "Charles III succeeded his mother, Elizabeth II, on her death.":
    "Карл III наследовал своей матери Елизавете II после её смерти.",
  "Where does a coronation take place?": "Где проходит коронация?",
  "St Paul's Cathedral": "В соборе святого Павла",
  "Westminster Abbey": "В Вестминстерском аббатстве",
  "Buckingham Palace": "В Букингемском дворце",
  "Westminster Abbey, conducted by the Archbishop of Canterbury.":
    "В Вестминстерском аббатстве, её совершает архиепископ Кентерберийский.",
  "Since the law changed in 2013, who inherits the throne?":
    "Кто наследует престол с тех пор, как в 2013 году изменили закон?",
  "The eldest son": "Старший сын",
  "The eldest child, regardless of sex": "Старший ребёнок, независимо от пола",
  "Whoever Parliament chooses": "Тот, кого выберет парламент",
  "The eldest male relative": "Старший родственник мужского пола",
  "The eldest child inherits. An older sister is no longer passed over for a younger brother.":
    "Наследует старший ребёнок. Старшую сестру больше не обходят ради младшего брата.",
  "Can the monarch express political opinions in public?":
    "Может ли монарх высказывать политические взгляды прилюдно?",
  "Yes, freely": "Да, свободно",
  "No — the monarch must remain politically neutral":
    "Нет — монарх обязан оставаться политически беспристрастным",
  "Only during elections": "Только во время выборов",
  "Only in the House of Lords": "Только в палате лордов",
  "Political neutrality is the whole point of the office. The monarch does not vote either.":
    "Политическая беспристрастность и есть весь смысл этой должности. Монарх и не голосует.",
  "How long did Queen Elizabeth II reign?": "Сколько правила королева Елизавета II?",
  "50 years": "50 лет",
  "64 years": "64 года",
  "70 years": "70 лет",
  "75 years": "75 лет",
  "70 years, from 1952 to 2022 — the longest in British history. Victoria's 64 years is second.":
    "70 лет, с 1952 по 2022 год — самое долгое правление в британской истории. 64 года Виктории — второе.",
  "Who is the heir to the throne?": "Кто наследник престола?",
  "Prince Harry": "Принц Гарри",
  "Princess Anne": "Принцесса Анна",
  "Prince Edward": "Принц Эдуард",
  "Prince William, Prince of Wales.": "Принц Уильям, принц Уэльский.",
  "What role does the monarch play in appointing a Prime Minister?":
    "Какова роль монарха в назначении премьер-министра?",
  "Chooses whoever they prefer": "Выбирает того, кто ему больше нравится",
  "Invites the leader who can command a majority in the Commons":
    "Приглашает вождя, способного опереться на большинство в палате общин",
  "Appoints the leader of the largest party in the Lords":
    "Назначает вождя крупнейшей партии в палате лордов",
  "Has no role at all": "Никакой роли не играет",
  "The monarch invites whoever can command a Commons majority — a formal act with no personal choice in practice.":
    "Монарх приглашает того, кто может опереться на большинство в палате общин — формальный шаг, где на деле нет личного выбора.",
  "How many MPs sit in the House of Commons?":
    "Сколько членов парламента заседает в палате общин?",
  "650, one for each constituency, each elected by first past the post.":
    "650, по одному от каждого избирательного округа, и каждый избран по мажоритарной системе.",
  "Elected by constituencies": "Избираются по округам",
  "Appointed, or sitting as hereditary peers or bishops":
    "Назначаются либо заседают как наследственные пэры или епископы",
  "Chosen by the House of Commons": "Выбираются палатой общин",
  "Selected at random": "Отбираются по жребию",
  "The Lords is not elected. Most are life peers, alongside some hereditary peers and senior Church of England bishops.":
    "Палата лордов не избирается. Большинство — пожизненные пэры, рядом с ними несколько наследственных пэров и старшие епископы Церкви Англии.",
  "Five years, though an election can be called sooner.":
    "Пять лет, хотя выборы могут назначить и раньше.",
  "Where does the Prime Minister live and work?": "Где премьер-министр живёт и работает?",
  "10 Downing Street": "Даунинг-стрит, 10",
  "The Palace of Westminster": "Вестминстерский дворец",
  "Chequers only": "Только Чекерс",
  "10 Downing Street in London.": "Даунинг-стрит, 10 в Лондоне.",
  "What voting system is used to elect MPs to the House of Commons?":
    "По какой избирательной системе выбирают членов парламента в палату общин?",
  "Proportional representation": "Пропорциональное представительство",
  "First past the post": "Мажоритарная система относительного большинства",
  "The single transferable vote": "Единый передаваемый голос",
  "A second ballot": "Второй тур",
  "First past the post — whoever gets the most votes in a constituency wins the seat.":
    "Относительное большинство — место в округе берёт тот, кто набрал больше всех голосов.",
  "What is a by-election?": "Что такое дополнительные выборы?",
  "A second round of a general election": "Второй тур всеобщих выборов",
  "An election in one constituency when its MP dies or resigns":
    "Выборы в одном округе, когда его член парламента умер или ушёл в отставку",
  "An election for the House of Lords": "Выборы в палату лордов",
  "A local council election": "Выборы в местный совет",
  "It fills a single seat between general elections.":
    "Они заполняют одно место между всеобщими выборами.",
  "Who chairs debates in the House of Commons?": "Кто ведёт прения в палате общин?",
  "The Leader of the Opposition": "Вождь оппозиции",
  "The Lord Chancellor": "Лорд-канцлер",
  "The Speaker, who is politically neutral and gives up party allegiance.":
    "Спикер, который политически беспристрастен и отказывается от партийной принадлежности.",
  "From what age can you vote in a UK general election?":
    "С какого возраста можно голосовать на всеобщих выборах в Соединённом Королевстве?",
  "18, and you must be on the electoral register. Photo ID is now required at polling stations in Great Britain.":
    "С 18 лет, и нужно быть в списке избирателей. На участках в Великобритании теперь требуется удостоверение с фотографией.",
  "What is the Cabinet?": "Что такое кабинет?",
  "All MPs of the governing party": "Все члены парламента от правящей партии",
  "About 20 senior ministers chosen by the Prime Minister":
    "Около 20 старших министров, выбранных премьер-министром",
  "The House of Lords committee": "Комитет палаты лордов",
  "The civil service leadership": "Руководство гражданской службы",
  "Senior ministers, each running a department — Chancellor of the Exchequer, Home Secretary, Foreign Secretary and so on.":
    "Старшие министры, каждый во главе своего ведомства — канцлер казначейства, министр внутренних дел, министр иностранных дел и так далее.",
  "What is the Opposition?": "Что такое оппозиция?",
  "Members of the Lords who vote against the government":
    "Члены палаты лордов, голосующие против правительства",
  "The largest party not in government": "Крупнейшая партия вне правительства",
  "Any MP who rebels": "Любой член парламента, идущий против своей партии",
  "The civil service": "Гражданская служба",
  "Its leader is Leader of the Opposition and heads a shadow cabinet challenging each minister.":
    "Её вождь является вождём оппозиции и возглавляет теневой кабинет, где каждому министру противостоит свой человек.",
  "Are civil servants politically neutral?":
    "Беспристрастны ли политически гражданские служащие?",
  "No — they change with each government": "Нет — они меняются с каждым правительством",
  "Yes — they carry out policy but stay in post when the government changes":
    "Да — они проводят политику, но остаются на местах при смене правительства",
  "Only senior ones": "Только старшие",
  "They are elected": "Они избираются",
  "Ministers come and go; the civil service stays and serves whichever government is in office.":
    "Министры приходят и уходят; гражданская служба остаётся и служит тому правительству, которое у власти.",
  "What are local council services funded by?":
    "За счёт чего оплачиваются услуги местных советов?",
  "National Insurance": "National Insurance",
  "Council tax and central government funding": "Council tax и денег центрального правительства",
  "Income tax only": "Только подоходного налога",
  "The Crown": "Короны",
  "Councils run schools, refuse collection, housing, roads and libraries, funded by council tax and central grants.":
    "Советы ведают школами, вывозом мусора, жильём, дорогами и библиотеками, а платят за это council tax и дотации из центра.",
  "What must happen before a bill becomes an Act of Parliament?":
    "Что должно произойти, прежде чем законопроект станет актом парламента?",
  "Only a Commons vote": "Только голосование в палате общин",
  "Debate and agreement in both Houses, then Royal Assent":
    "Прения и согласие обеих палат, затем королевская санкция",
  "A public referendum": "Всенародный референдум",
  "Approval by the Supreme Court": "Одобрение Верховного суда",
  "Commons, then Lords, back to the Commons if amended, then the monarch's Royal Assent.":
    "Палата общин, затем палата лордов, обратно в палату общин при поправках, затем королевская санкция монарха.",
  "Which of these is a national party in Scotland?":
    "Что из перечисленного является национальной партией в Шотландии?",
  "Plaid Cymru": "Plaid Cymru",
  "The SNP": "SNP",
  "Sinn Féin": "Sinn Féin",
  "The Liberal Democrats": "Либеральные демократы",
  "The Scottish National Party. Plaid Cymru is the Welsh national party.":
    "Шотландская национальная партия. Plaid Cymru — национальная партия Уэльса.",
  "MSPs in Scotland, MSs in the Senedd, MLAs in the Northern Ireland Assembly, MPs at Westminster.":
    "MSP в Шотландии, MS в Senedd, MLA в Ассамблее Северной Ирландии, MP в Вестминстере.",
  "What are members of the Northern Ireland Assembly called?":
    "Как называют членов Ассамблеи Северной Ирландии?",
  "TDs": "TD",
  "MLAs — Members of the Legislative Assembly, at Stormont.":
    "MLA — члены законодательной ассамблеи, в Стормонте.",
  "Which of these is a reserved matter kept by the UK Parliament?":
    "Что из перечисленного оставлено за парламентом Соединённого Королевства?",
  "Defence, foreign policy, immigration, the currency and national security are reserved. Health, education and housing are devolved.":
    "Оборона, внешняя политика, въезд в страну, валюта и государственная безопасность оставлены центру. Здравоохранение, образование и жильё переданы вниз.",
  "Where does the Scottish Parliament sit?": "Где заседает шотландский парламент?",
  "Stormont": "В Стормонте",
  "Holyrood": "В Холируде",
  "The Senedd": "В Senedd",
  "Westminster": "В Вестминстере",
  "Holyrood in Edinburgh. Stormont is Northern Ireland's, the Senedd is Wales'.":
    "В Холируде в Эдинбурге. Стормонт — североирландский, Senedd — уэльский.",
  "What is the Welsh Parliament called?": "Как называется парламент Уэльса?",
  "The Assembly": "Ассамблея",
  "Senedd Cymru. It was called the National Assembly for Wales until 2020.":
    "Senedd Cymru. До 2020 года он назывался Национальной ассамблеей Уэльса.",
  "Does England have its own devolved parliament?":
    "Есть ли у Англии собственный переданный вниз парламент?",
  "Yes, in Manchester": "Да, в Манчестере",
  "Yes, alongside the UK Parliament": "Да, рядом с парламентом Соединённого Королевства",
  "No — English matters are decided by the UK Parliament":
    "Нет — английские дела решает парламент Соединённого Королевства",
  "Yes, since 1999": "Да, с 1999 года",
  "England has no devolved parliament, which is why the UK Parliament and 'the English one' are easy to confuse.":
    "У Англии нет собственного парламента, и потому парламент Соединённого Королевства легко принять за английский.",
  "Which agreement created the Northern Ireland Assembly?":
    "Какое соглашение создало Ассамблею Северной Ирландии?",
  "The Good Friday Agreement of 1998": "Соглашение Страстной пятницы 1998 года",
  "The Scotland Act": "Акт о Шотландии",
  "The Good Friday Agreement, with power shared between communities.":
    "Соглашение Страстной пятницы, с разделением власти между общинами.",
  "Why do university fees and NHS rules differ across the UK?":
    "Почему плата за учёбу и правила NHS различаются по Соединённому Королевству?",
  "Each nation sets its own taxes entirely": "Каждая страна полностью сама устанавливает налоги",
  "Health and education are devolved matters": "Здравоохранение и образование переданы вниз",
  "The EU required it": "Этого требовал Европейский союз",
  "Local councils decide": "Решают местные советы",
  "Health and education are devolved, so each nation's government sets its own policy.":
    "Здравоохранение и образование переданы вниз, поэтому правительство каждой страны ведёт свою политику.",
  "How many people sit on a jury in Scotland?":
    "Сколько человек входит в жюри присяжных в Шотландии?",
  "15 — Scotland has its own legal system and differs from the rest of the UK here.":
    "15 — у Шотландии своя правовая система, и здесь она отличается от остального Соединённого Королевства.",
  "Crown Court judges with a jury": "Судьи Crown Court с присяжными",
  "Magistrates, usually unpaid volunteers": "Мировые судьи, обычно добровольцы без жалованья",
  "Barristers sitting as a panel": "Барристеры, заседающие коллегией",
  "Magistrates handle the great majority of criminal cases and are members of the local community.":
    "Мировые судьи ведут подавляющее большинство уголовных дел и сами принадлежат к местной общине.",
  "Theft": "Кража",
  "Civil law covers disputes between people and organisations. The other three are criminal offences.":
    "Гражданское право охватывает споры между людьми и организациями. Остальные три — уголовные преступления.",
  "What is the highest court of appeal in the UK?":
    "Какой суд в Соединённом Королевстве высший для обжалования?",
  "The Crown Court": "Crown Court",
  "The Court of Appeal": "Апелляционный суд",
  "The Supreme Court, which took over that role from the House of Lords in 2009.":
    "Верховный суд, принявший эту роль от палаты лордов в 2009 году.",
  "Between which ages can you be summoned for jury service?":
    "В каком возрасте могут вызвать в жюри присяжных?",
  "16 to 65": "С 16 до 65 лет",
  "18 to 70": "С 18 до 70 лет",
  "21 to 70": "С 21 до 70 лет",
  "18 to 65": "С 18 до 65 лет",
  "18 to 70, if you are on the electoral register. It is a legal duty.":
    "С 18 до 70 лет, если ты в списке избирателей. Это обязанность по закону.",
  "What is legal aid?": "Что такое legal aid?",
  "Free advice from the police": "Бесплатный совет от полиции",
  "Public funding for legal advice or representation for those who cannot afford it":
    "Оплата из казны правовой помощи или представительства для тех, кому это не по средствам",
  "A charity run by solicitors": "Благотворительность, которую ведут солиситоры",
  "Insurance against losing a case": "Страховка на случай проигрыша дела",
  "It exists so the right to a fair trial is real rather than theoretical.":
    "Она существует, чтобы право на справедливый суд было настоящим, а не только на бумаге.",
  "What is the difference between a solicitor and a barrister?":
    "В чём разница между солиситором и барристером?",
  "Solicitors advise and prepare cases; barristers argue in the higher courts":
    "Солиситоры советуют и готовят дела; барристеры выступают в высших судах",
  "Barristers advise; solicitors judge": "Барристеры советуют; солиситоры судят",
  "There is no difference": "Разницы нет",
  "Solicitors work only for the government": "Солиситоры работают только на правительство",
  "Solicitors give advice and represent clients in lower courts; barristers are specialist advocates in the higher courts.":
    "Солиситоры дают советы и представляют доверителей в низших судах; барристеры — особые ходатаи в высших.",
  "Who decides the sentence in a Crown Court trial?":
    "Кто определяет наказание в процессе в Crown Court?",
  "The jury": "Присяжные",
  "The judge": "Судья",
  "The magistrates": "Мировые судьи",
  "The prosecution": "Обвинение",
  "The jury decides guilt; the judge decides the law and the sentence.":
    "Присяжные решают вопрос о виновности; судья решает вопросы права и определяет наказание.",
  "Are judges independent of the government?": "Независимы ли судьи от правительства?",
  "No, they are appointed by ministers and follow their instructions":
    "Нет, их назначают министры, и они следуют их указаниям",
  "Yes — they interpret the law and can find government action unlawful":
    "Да — они толкуют закон и могут признать действия правительства незаконными",
  "Only in the Supreme Court": "Только в Верховном суде",
  "Only in civil cases": "Только по гражданским делам",
  "Judicial independence is central to the rule of law. A government act found unlawful must be put right.":
    "Независимость суда — сердцевина верховенства права. Действие правительства, признанное незаконным, приходится исправлять.",
  "What is the age of criminal responsibility in Scotland?":
    "С какого возраста в Шотландии наступает уголовная ответственность?",
  "12 in Scotland and 10 in England, Wales and Northern Ireland — a difference the test likes to ask about.":
    "С 12 лет в Шотландии и с 10 в Англии, Уэльсе и Северной Ирландии — это расхождение тест спрашивает охотно.",
  "Must the police obey the law themselves?": "Обязана ли сама полиция соблюдать закон?",
  "No, they are exempt while on duty": "Нет, при исполнении она от него свободна",
  "Yes — and complaints against them are investigated independently":
    "Да — и жалобы на неё разбирает независимый орган",
  "Only senior officers": "Только старшие чины",
  "Only in civil matters": "Только в гражданских делах",
  "Everyone is subject to the law, including the police. That is what the rule of law means.":
    "Закону подчинены все, включая полицию. В этом и состоит верховенство права.",
  "Local council services": "Услуги местного совета",
  "NI contributions build entitlement to the state pension and some benefits. Council tax pays for local services.":
    "Взносы National Insurance дают право на государственную пенсию и часть пособий. Council tax оплачивает местные услуги.",
  "How do most employees pay income tax?":
    "Как большинство наёмных работников платит подоходный налог?",
  "By annual cheque": "Ежегодным чеком",
  "Through PAYE, deducted by the employer": "Через PAYE, удержанием у работодателя",
  "Through Self Assessment": "Через Self Assessment",
  "At their local council": "В своём местном совете",
  "PAYE — Pay As You Earn. The self-employed complete a Self Assessment return instead.":
    "PAYE — удержание при выплате заработка. Работающие на себя вместо этого подают декларацию Self Assessment.",
  "Which body collects tax in the UK?":
    "Какое ведомство собирает налоги в Соединённом Королевстве?",
  "The Treasury": "Казначейство",
  "HM Revenue and Customs": "HM Revenue and Customs",
  "The Bank of England": "Банк Англии",
  "The Home Office": "Министерство внутренних дел",
  "HMRC collects income tax, National Insurance and other taxes.":
    "HMRC собирает подоходный налог, National Insurance и другие налоги.",
  "Which Act brought the European Convention on Human Rights into UK law?":
    "Какой акт ввёл Европейскую конвенцию о правах человека в право Соединённого Королевства?",
  "The Human Rights Act 1998.": "Human Rights Act 1998.",
  "Which of these is a responsibility of living in the UK?":
    "Что из перечисленного является обязанностью живущего в Соединённом Королевстве?",
  "Joining a political party": "Вступить в политическую партию",
  "Paying tax and National Insurance": "Платить налоги и National Insurance",
  "Attending church": "Ходить в церковь",
  "Owning property": "Владеть недвижимостью",
  "Tax and National Insurance fund the NHS, schools, roads, defence and the police.":
    "Налоги и National Insurance оплачивают NHS, школы, дороги, оборону и полицию.",
  "How is a vote cast in a UK election?":
    "Как подают голос на выборах в Соединённом Королевстве?",
  "Publicly, by show of hands": "Открыто, поднятием руки",
  "By secret ballot": "Тайным голосованием",
  "By declaring it to a returning officer": "Объявив его должностному лицу на участке",
  "Online only": "Только через интернет",
  "By secret ballot — your vote cannot be seen or traced.":
    "Тайным голосованием — твой голос нельзя увидеть или проследить.",
  "What should you do about a law you disagree with?":
    "Что делать с законом, с которым ты не согласен?",
  "Ignore it": "Не обращать на него внимания",
  "Campaign and vote to change it, while still obeying it":
    "Добиваться и голосовать за его изменение, продолжая при этом его соблюдать",
  "Take it to the monarch": "Обратиться к монарху",
  "Refuse to pay tax": "Отказаться платить налоги",
  "Obey the law while working to change it. That is the difference between liberty and lawlessness.":
    "Соблюдать закон, добиваясь его изменения. В этом и разница между свободой и беззаконием.",
  "Allowed with parental consent": "Разрешён с согласия родителей",
  "A criminal offence": "Уголовным преступлением",
  "Allowed over 21": "Разрешён после 21 года",
  "A civil matter only": "Только гражданским делом",
  "Forcing someone to marry is a crime. An arranged marriage both people freely accept is lawful; a forced one is not.":
    "Принуждать к браку — преступление. Брак по сговору, на который оба идут свободно, законен; брак по принуждению — нет.",
  "What is a civil partnership?": "Что такое civil partnership?",
  "A business agreement": "Деловое соглашение",
  "A legal alternative to marriage with similar rights":
    "Законная замена браку со схожими правами",
  "A form of employment contract": "Разновидность трудового договора",
  "A council housing arrangement": "Порядок получения муниципального жилья",
  "Open to both same-sex and opposite-sex couples, with rights similar to marriage.":
    "Открыто и для однополых, и для разнополых пар, с правами, схожими с брачными.",
  "When did same-sex marriage become legal in Northern Ireland?":
    "Когда однополый брак стал законным в Северной Ирландии?",
  "2014": "В 2014",
  "It is not legal there": "Он там не законен",
  "2020 in Northern Ireland; 2014 in England, Wales and Scotland.":
    "В 2020 году в Северной Ирландии; в 2014 — в Англии, Уэльсе и Шотландии.",
  "How is volunteering regarded in the UK?":
    "Как в Соединённом Королевстве смотрят на добровольчество?",
  "As unusual and discouraged": "Как на нечто необычное и нежелательное",
  "As a valued part of community life": "Как на ценную часть жизни общины",
  "As paid part-time work": "Как на оплачиваемую работу по совместительству",
  "As compulsory for citizens": "Как на обязанность граждан",
  "Charity shops, food banks, sports clubs, school governors — giving time is treated as valuable as giving money.":
    "Благотворительные лавки, продовольственные банки, спортивные клубы, попечители школ — отданное время ценят не меньше отданных денег.",
  "Roughly what share of the UK population belongs to a minority ethnic group?":
    "Примерно какая доля населения Соединённого Королевства принадлежит к этническим меньшинствам?",
  "About a fifth": "Около пятой части",
  "About a half": "Около половины",
  "About three quarters": "Около трёх четвертей",
  "Roughly a fifth, with the largest cities being the most diverse.":
    "Примерно пятая часть, и разнообразнее всего самые большие города.",
  "The monarch — a role dating from Henry VIII's break with Rome. The Archbishop of Canterbury is its senior bishop.":
    "Монарх — роль, идущая от разрыва Генриха VIII с Римом. Архиепископ Кентерберийский — её старший епископ.",
  "Which nation of the UK has a Presbyterian national church?":
    "У какой страны Соединённого Королевства национальная церковь пресвитерианская?",
  "The Church of Scotland. Wales and Northern Ireland have no established church at all.":
    "У Шотландии — Церковь Шотландии. В Уэльсе и Северной Ирландии государственной церкви нет вовсе.",
  "What is the second largest religion in the UK?":
    "Какая религия вторая по величине в Соединённом Королевстве?",
  "Islam. Christianity is the largest, and a large and growing share of people report no religion.":
    "Ислам. Христианство первое, и большая и растущая доля людей заявляет, что религии не придерживается.",
  "Which festival is known as the festival of lights?":
    "Какой праздник известен как праздник огней?",
  "Eid al-Fitr": "Ураза-байрам",
  "Diwali": "Дивали",
  "Vaisakhi": "Вайсакхи",
  "Hanukkah": "Ханука",
  "Diwali, the Hindu festival of lights, also marked by Sikhs and Jains.":
    "Дивали, индуистский праздник огней, который отмечают также сикхи и джайны.",
  "Who founded Sikhism?": "Кто основал сикхизм?",
  "Guru Nanak": "Гуру Нанак",
  "The Buddha": "Будда",
  "Guru Gobind Singh": "Гуру Гобинд Сингх",
  "Moses": "Моисей",
  "Guru Nanak. Vaisakhi is the major Sikh festival.":
    "Гуру Нанак. Вайсакхи — главный сикхский праздник.",
  "Does religious tolerance in the UK protect people with no religion?":
    "Защищает ли религиозная терпимость в Соединённом Королевстве неверующих?",
  "No, only believers": "Нет, только верующих",
  "Yes — belief and non-belief are both protected": "Да — защищены и вера, и её отсутствие",
  "Only in Scotland": "Только в Шотландии",
  "Only in schools": "Только в школах",
  "Religion or belief is a protected characteristic, and that includes having none.":
    "Религия или убеждения — защищаемый признак, и отсутствие религии сюда входит.",
  "Which senior clergy sit in the House of Lords?":
    "Какое старшее духовенство заседает в палате лордов?",
  "Roman Catholic bishops": "Католические епископы",
  "Church of England bishops": "Епископы Церкви Англии",
  "Church of Scotland ministers": "Служители Церкви Шотландии",
  "No clergy sit in the Lords": "Духовенство в палате лордов не заседает",
  "Senior Church of England bishops sit in the Lords — a consequence of it being the established church in England.":
    "В палате лордов заседают старшие епископы Церкви Англии — следствие того, что в Англии она государственная.",
  "What is celebrated on 26 December?": "Что отмечают 26 декабря?",
  "Christmas Eve": "Сочельник",
  "Boxing Day": "День подарков",
  "New Year's Eve": "Канун Нового года",
  "Twelfth Night": "Двенадцатую ночь",
  "Boxing Day, a public holiday throughout the UK.":
    "День подарков, выходной по всему Соединённому Королевству.",
  "A Northern Irish holiday in July": "Североирландский праздник в июле",
  "New Year's Eve in Scotland, celebrated on a larger scale than elsewhere. Scotland also takes 2 January as a holiday.":
    "Канун Нового года в Шотландии, который отмечают шире, чем где-либо ещё. В Шотландии выходным будет и 2 января.",
  "What is eaten on Shrove Tuesday?": "Что едят в Прощёный вторник?",
  "Hot cross buns": "Крестовые булочки",
  "Pancakes": "Блины",
  "Christmas pudding": "Рождественский пудинг",
  "Haggis": "Хаггис",
  "Pancake Day, the day before Lent begins. It is not a public holiday.":
    "Блинный день, канун Великого поста. Выходным он не является.",
  "What does Remembrance Day on 11 November mark?": "Что отмечает День памяти 11 ноября?",
  "The Gunpowder Plot": "Пороховой заговор",
  "The Battle of Britain": "Битву за Британию",
  "The armistice of 11 November 1918. Poppies are worn and there is a two-minute silence at 11am.":
    "Перемирие 11 ноября 1918 года. Носят мак, а в одиннадцать утра держат двухминутное молчание.",
  "Which two patron saints' days are public holidays in their nations?":
    "Дни каких двух святых покровителей являются выходными в своих странах?",
  "St George's and St David's": "Святого Георгия и святого Давида",
  "St Patrick's and St Andrew's": "Святого Патрика и святого Андрея",
  "St George's and St Andrew's": "Святого Георгия и святого Андрея",
  "All four are public holidays": "Выходными являются все четыре",
  "St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland. St George's and St David's are not.":
    "День святого Патрика в Северной Ирландии и день святого Андрея в Шотландии. Дни святого Георгия и святого Давида — нет.",
  "What are bank holidays?": "Что такое bank holidays?",
  "Days when only banks close": "Дни, когда закрыты только банки",
  "Public holidays when most businesses close":
    "Выходные дни, когда закрыто большинство заведений",
  "Days for paying taxes": "Дни уплаты налогов",
  "Religious festivals only": "Только религиозные праздники",
  "They differ between the four nations, and include days in early May, late May and August.":
    "В четырёх странах они разные и включают дни в начале мая, в конце мая и в августе.",
  "When is Burns Night?": "Когда отмечают ночь Бёрнса?",
  "1 January": "1 января",
  "25 January": "25 января",
  "25 January, celebrating Robert Burns, Scotland's national poet.":
    "25 января, в честь Роберта Бёрнса, национального поэта Шотландии.",
  "On what date is Halloween?": "Какого числа Хэллоуин?",
  "31 October": "31 октября",
  "5 November": "5 ноября",
  "1 November": "1 ноября",
  "11 November": "11 ноября",
  "31 October — an ancient festival, now marked with costumes and pumpkins. Bonfire Night follows on 5 November.":
    "31 октября — древний праздник, который теперь отмечают ряжеными и тыквами. Ночь костров идёт следом, 5 ноября.",
  "Which Easter days are public holidays in most of the UK?":
    "Какие пасхальные дни являются выходными на большей части Соединённого Королевства?",
  "Good Friday and Easter Monday": "Страстная пятница и пасхальный понедельник",
  "Easter Sunday only": "Только пасхальное воскресенье",
  "The whole Easter week": "Вся пасхальная неделя",
  "Maundy Thursday only": "Только Великий четверг",
  "Good Friday and Easter Monday. The date moves each year, falling in March or April.":
    "Страстная пятница и пасхальный понедельник. Дата подвижна и приходится на март или апрель.",
  "What is traditionally eaten for Christmas dinner in Britain?":
    "Что по обычаю едят в Британии на рождественский обед?",
  "Roast turkey": "Жареную индейку",
  "Fish and chips": "Рыбу с картошкой",
  "Roast lamb": "Жареную баранину",
  "Roast turkey with vegetables, followed by Christmas pudding.":
    "Жареную индейку с овощами, а после — рождественский пудинг.",
  "Wimbledon is a district of south-west London — the oldest tennis tournament in the world.":
    "Уимблдон — район на юго-западе Лондона, где проходит старейший теннисный турнир мира.",
  "Golf, with St Andrews as its historic home. Cricket and rugby originated in England.":
    "Гольф, чья историческая родина — Сент-Эндрюс. Крикет и регби появились в Англии.",
  "What is the Ashes?": "Что такое Ashes?",
  "A rugby tournament": "Турнир по регби",
  "A Test cricket series between England and Australia":
    "Серия тестовых матчей по крикету между Англией и Австралией",
  "A horse race at Aintree": "Скачки в Эйнтри",
  "A golf championship": "Первенство по гольфу",
  "The historic cricket series between England and Australia. Lord's in London is the most famous ground.":
    "Историческая серия матчей по крикету между Англией и Австралией. Самое известное поле — Lord's в Лондоне.",
  "Which nations compete in the Six Nations rugby championship?":
    "Какие сборные играют в регбийном турнире шести наций?",
  "Only the four UK nations": "Только четыре страны Соединённого Королевства",
  "England, Scotland, Wales, Ireland, France and Italy":
    "Англия, Шотландия, Уэльс, Ирландия, Франция и Италия",
  "The Commonwealth nations": "Страны Содружества",
  "England, Wales, Australia, France, Italy and Ireland":
    "Англия, Уэльс, Австралия, Франция, Италия и Ирландия",
  "The four home nations plus France and Italy — and Ireland competes as one team, north and south.":
    "Четыре домашние сборные плюс Франция и Италия — а Ирландия выступает одной командой, от севера и юга вместе.",
  "Where is the Grand National run?": "Где проходит Гранд-нэшнл?",
  "Ascot": "В Аскоте",
  "Aintree": "В Эйнтри",
  "Epsom": "В Эпсоме",
  "Cheltenham": "В Челтнеме",
  "Aintree, near Liverpool. Royal Ascot and the Derby at Epsom are the other famous meetings.":
    "В Эйнтри под Ливерпулем. Королевский Аскот и дерби в Эпсоме — другие знаменитые скачки.",
  "How do the UK nations compete at the Commonwealth Games?":
    "Как страны Соединённого Королевства выступают на Играх Содружества?",
  "As one British team": "Одной британской командой",
  "Each nation competes separately": "Каждая страна выступает отдельно",
  "Only England competes": "Выступает только Англия",
  "As two teams, Britain and Ireland": "Двумя командами, от Британии и от Ирландии",
  "England, Scotland, Wales and Northern Ireland each enter separately — unlike at the Olympics.":
    "Англия, Шотландия, Уэльс и Северная Ирландия выставляют отдельные команды — в отличие от Олимпийских игр.",
  "What is the oldest football competition in the world?":
    "Какое футбольное состязание самое старое в мире?",
  "The Premier League": "Премьер-лига",
  "The FA Cup": "Кубок Англии",
  "The World Cup": "Чемпионат мира",
  "The Champions League": "Лига чемпионов",
  "The FA Cup, an English competition and the oldest in the sport.":
    "Кубок Англии, английское состязание и старейшее в этом виде спорта.",
  "Which organisation cares for many historic houses, gardens and coastline in the UK?":
    "Какая организация заботится о множестве исторических домов, садов и участков побережья в Соединённом Королевстве?",
  "The National Trust": "National Trust",
  "English Heritage only": "Только English Heritage",
  "The National Trust, a charity that protects historic places and open countryside.":
    "National Trust, благотворительная организация, которая охраняет исторические места и открытые сельские просторы.",
  "Chaucer, in the fourteenth century — two hundred years before Shakespeare.":
    "Чосер, в четырнадцатом веке — за двести лет до Шекспира.",
  "Liverpool — the most commercially successful band in British history.":
    "Ливерпуль — самая коммерчески успешная группа в британской истории.",
  "Scotland's Bard. He wrote Auld Lang Syne, sung at New Year around the world.":
    "Бард Шотландии. Он написал Auld Lang Syne, которую поют на Новый год по всему миру.",
  "Who wrote Pride and Prejudice?": "Кто написал «Гордость и предубеждение»?",
  "Charlotte Brontë": "Шарлотта Бронте",
  "George Eliot": "Джордж Элиот",
  "Agatha Christie": "Агата Кристи",
  "Jane Austen, whose novels portray English social life in the early nineteenth century.":
    "Джейн Остин, чьи романы рисуют английскую общественную жизнь начала девятнадцатого века.",
  "Which novelist wrote Oliver Twist and Great Expectations?":
    "Какой романист написал «Оливера Твиста» и «Большие надежды»?",
  "Thomas Hardy": "Томас Гарди",
  "Rudyard Kipling": "Редьярд Киплинг",
  "George Orwell": "Джордж Оруэлл",
  "Charles Dickens, whose books exposed the poverty of industrial Britain.":
    "Чарльз Диккенс, чьи книги показали нищету промышленной Британии.",
  "Where is the National Gallery?": "Где находится Национальная галерея?",
  "Trafalgar Square, London": "На Трафальгарской площади в Лондоне",
  "Trafalgar Square in London. It holds the national collection of paintings and is free to enter.":
    "На Трафальгарской площади в Лондоне. Она хранит национальное собрание живописи, и вход в неё бесплатный.",
  "In which year was the British Museum founded?": "В каком году был основан Британский музей?",
  "1653": "В 1653",
  "1753": "В 1753",
  "1853": "В 1853",
  "1901": "В 1901",
  "1753 — the first national public museum in the world, and free to enter.":
    "В 1753 году — первый общедоступный государственный музей в мире, и вход в него бесплатный.",
  "Which prize for contemporary art is named after a British painter?":
    "Какая премия за современное искусство названа в честь британского живописца?",
  "The Booker Prize": "Букеровская премия",
  "The Turner Prize": "Премия Тёрнера",
  "The Mercury Prize": "Премия Mercury",
  "The Brit Award": "Премия Brit",
  "The Turner Prize, named after J. M. W. Turner, the painter of light and sea.":
    "Премия Тёрнера, названная в честь Уильяма Тёрнера, живописца света и моря.",
  "What are the Proms?": "Что такое Proms?",
  "A summer season of classical concerts at the Royal Albert Hall":
    "Летний сезон концертов классической музыки в Королевском Альберт-холле",
  "A rock festival in Somerset": "Рок-фестиваль в Сомерсете",
  "A poetry competition": "Состязание поэтов",
  "A dance tradition in Wales": "Танцевальный обычай Уэльса",
  "Running since 1895 and ending with the Last Night of the Proms.":
    "Он идёт с 1895 года и завершается последним вечером сезона.",
  "Which of these composers was British?": "Кто из этих сочинителей был британцем?",
  "Edward Elgar": "Эдуард Элгар",
  "Johann Sebastian Bach": "Иоганн Себастьян Бах",
  "Wolfgang Amadeus Mozart": "Вольфганг Амадей Моцарт",
  "Antonín Dvořák": "Антонин Дворжак",
  "Elgar, alongside Purcell, Holst, Vaughan Williams and Britten.":
    "Элгар, а рядом с ним Пёрселл, Холст, Воан-Уильямс и Бриттен.",
  "Fleming, a Scottish scientist, in 1928. It became the first widely used antibiotic.":
    "Флеминг, шотландский учёный, в 1928 году. Это стало первым широко применяемым противомикробным средством.",
  "Tim Berners-Lee, in 1989 while working at CERN.":
    "Тим Бернерс-Ли, в 1989 году, работая в ЦЕРН.",
  "Which scientist described gravity and the laws of motion?":
    "Какой учёный описал тяготение и законы движения?",
  "Newton, whose Principia Mathematica is one of the most important scientific books ever written.":
    "Ньютон, чьи «Математические начала» — одна из самых важных научных книг, когда-либо написанных.",
  "Who gave the first public demonstration of television?":
    "Кто первым прилюдно показал телевидение?",
  "John Logie Baird, a Scot. Bell developed the telephone.":
    "Джон Лоджи Бэрд, шотландец. Белл довёл до дела телефон.",
  "Whose X-ray work was essential to discovering the structure of DNA?":
    "Чьи рентгеновские работы были необходимы для открытия строения ДНК?",
  "Ada Lovelace": "Ады Лавлейс",
  "Dorothy Hodgkin": "Дороти Ходжкин",
  "Rosalind Franklin, alongside Crick and Watson.":
    "Розалинд Франклин, рядом с Криком и Уотсоном.",
  "Who discovered electromagnetic induction, the principle behind the electric motor?":
    "Кто открыл электромагнитную индукцию, начало, на котором держится электродвигатель?",
  "Michael Faraday — the principle behind both the motor and the generator.":
    "Майкл Фарадей — это начало лежит в основе и двигателя, и генератора.",
  "Where was Dolly the sheep, the first cloned mammal, created?":
    "Где вывели овечку Долли, первое клонированное млекопитающее?",
  "Scotland, in 1996.": "В Шотландии, в 1996 году.",
  "In which country did the first successful IVF birth take place?":
    "В какой стране родился первый ребёнок, зачатый в пробирке?",
  "The United States": "В Соединённых Штатах",
  "France": "Во Франции",
  "Australia": "В Австралии",
  "England, in 1978.": "В Англии, в 1978 году.",
  "Who laid the foundations of computer science and worked at Bletchley Park?":
    "Кто заложил основы науки о вычислениях и работал в Блетчли-парке?",
  "Alan Turing, whose codebreaking work shortened the Second World War.":
    "Алан Тьюринг, чья работа над шифрами сократила Вторую мировую войну.",
  "Margaret Thatcher, from 1979 to 1990. Theresa May was the second, from 2016.":
    "Маргарет Тэтчер, с 1979 по 1990 год. Тереза Мэй была второй, с 2016 года.",
  "Which Prime Minister's government built the welfare state and the NHS?":
    "Правительство какого премьер-министра построило государство всеобщего благосостояния и NHS?",
  "Attlee's government, elected in 1945. Bevan founded the NHS as his Health Minister.":
    "Правительство Эттли, избранное в 1945 году. NHS основал Бивен как его министр здравоохранения.",
  "Who opened Britain's first Indian restaurant and introduced shampooing?":
    "Кто открыл первый в Британии индийский ресторан и ввёл в обиход мытьё головы шампунем?",
  "Gandhi": "Ганди",
  "Sake Dean Mahomet, an early figure in Britain's multicultural history.":
    "Саке Дин Магомед, одна из ранних фигур многонациональной истории Британии.",
  "Which explorer's voyages mapped much of the Pacific?":
    "Чьи плавания положили на карту большую часть Тихого океана?",
  "Captain James Cook": "Капитана Джеймса Кука",
  "Sir Walter Raleigh": "Сэра Уолтера Рэли",
  "Ernest Shackleton": "Эрнеста Шеклтона",
  "Captain James Cook, in the eighteenth century.":
    "Капитана Джеймса Кука, в восемнадцатом веке.",
  "Who was voted the greatest Briton in a national poll?":
    "Кого признали величайшим британцем по итогам всенародного опроса?",
  "Winston Churchill, who led Britain through the Second World War.":
    "Уинстона Черчилля, который провёл Британию через Вторую мировую войну.",
  "Who led Scottish resistance to Edward I and was executed in 1305?":
    "Кто возглавил шотландское сопротивление Эдуарду I и был казнён в 1305 году?",
  "Rob Roy": "Роб Рой",
  "William Wallace. Robert the Bruce later won independence at Bannockburn in 1314.":
    "Уильям Уоллес. Независимость позже добыл Роберт Брюс при Бэннокберне в 1314 году.",
  "Which of these people campaigned to abolish the slave trade?":
    "Кто из этих людей боролся за отмену работорговли?",
  "Wilberforce led the parliamentary campaign that ended the trade in 1807.":
    "Уилберфорс возглавил в парламенте борьбу, которая покончила с торговлей в 1807 году.",
  "5 to 16 in England, Wales and Scotland; Northern Ireland starts at 4. In England you must stay in education or training until 18.":
    "С 5 до 16 лет в Англии, Уэльсе и Шотландии; в Северной Ирландии начинают с 4. В Англии до 18 лет нужно оставаться в учёбе или обучении ремеслу.",
  "111 is the NHS urgent advice line. 999 and 112 are emergencies; 101 is non-emergency police.":
    "111 — это линия срочных советов NHS. 999 и 112 — для чрезвычайных случаев; 101 — полиция не по срочному делу.",
  "Which numbers reach the emergency services in the UK?":
    "По каким номерам вызывают экстренные службы в Соединённом Королевстве?",
  "999 or 112": "999 или 112",
  "111 or 101": "111 или 101",
  "911 only": "Только 911",
  "100 or 200": "100 или 200",
  "Both 999 and 112 are free from any phone and reach police, ambulance, fire and coastguard.":
    "И 999, и 112 бесплатны с любого телефона и соединяют с полицией, скорой помощью, пожарными и береговой охраной.",
  "What does 'free at the point of use' mean for the NHS?":
    "Что означает для NHS «бесплатно в месте оказания»?",
  "You are not charged for treatment when you receive it, because it is funded by taxation":
    "С тебя не берут плату за лечение, когда ты его получаешь, потому что оно оплачено из налогов",
  "Only emergencies are free": "Бесплатны только чрезвычайные случаи",
  "Only citizens are treated free": "Бесплатно лечат только граждан",
  "Care is based on clinical need, not ability to pay, and is paid for through taxation.":
    "Помощь оказывают по врачебной необходимости, а не по способности заплатить, и оплачивают её из налогов.",
  "Who is normally your first point of contact for NHS healthcare?":
    "К кому обычно обращаются первым за помощью в NHS?",
  "A hospital consultant": "К больничному консультанту",
  "A pharmacist": "К фармацевту",
  "The ambulance service": "К скорой помощи",
  "A general practitioner. You need to be registered with a local practice to be referred onward for most care.":
    "К врачу общей практики. Чтобы получить направление дальше почти на любую помощь, нужно быть записанным в местную практику.",
  "Where are NHS prescriptions free?": "Где рецепты NHS бесплатны?",
  "Everywhere in the UK": "Повсюду в Соединённом Королевстве",
  "Scotland, Wales and Northern Ireland": "В Шотландии, Уэльсе и Северной Ирландии",
  "England only": "Только в Англии",
  "Nowhere": "Нигде",
  "Free in Scotland, Wales and Northern Ireland; charged in England, with many exemptions.":
    "Бесплатны в Шотландии, Уэльсе и Северной Ирландии; в Англии платны, но с множеством исключений.",
  "What are the main exams taken at 16 in England, Wales and Northern Ireland?":
    "Какие главные экзамены сдают в 16 лет в Англии, Уэльсе и Северной Ирландии?",
  "A levels": "A levels",
  "GCSEs": "GCSE",
  "Highers": "Highers",
  "Degrees": "Университетские степени",
  "GCSEs. Scotland has National Qualifications instead, and Highers in place of A levels.":
    "GCSE. В Шотландии вместо них National Qualifications, а вместо A levels — Highers.",
  "Which are the two oldest universities in the UK?":
    "Какие два университета самые старые в Соединённом Королевстве?",
  "Oxford and Cambridge": "Оксфорд и Кембридж",
  "Edinburgh and Glasgow": "Эдинбург и Глазго",
  "London and Durham": "Лондон и Дарем",
  "St Andrews and Aberdeen": "Сент-Эндрюс и Абердин",
  "Oxford and Cambridge. Tuition fees differ across the UK because education is devolved.":
    "Оксфорд и Кембридж. Плата за учёбу по Соединённому Королевству разная, потому что образование передано вниз.",
  "Is misusing the 999 emergency number an offence?":
    "Является ли злоупотребление экстренным номером 999 преступлением?",
  "No, it is simply discouraged": "Нет, это просто не приветствуется",
  "Yes, it is an offence": "Да, это преступление",
  "Only if repeated": "Только если повторяется",
  "Only for businesses": "Только для предприятий",
  "999 is for a life at risk, serious injury, a crime in progress or a fire. Misusing it is an offence — 111 exists for everything else urgent.":
    "999 — это угроза жизни, тяжёлое увечье, преступление на ходу или пожар. Злоупотребление им — преступление, а для всего остального срочного есть 111.",
};
