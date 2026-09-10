/**
 * Russian for the Leben in Deutschland practice questions.
 *
 * The lesson cards are answered by LEBEN_IN_DEUTSCHLAND_RU. These are the
 * other body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in Russian and then asked its
 * questions in German.
 *
 * This is the bank a Russian reader is most likely to sit down with: someone
 * taking the German citizenship test, reading in Russian. It is also the
 * largest of the six.
 *
 * Keyed on the GERMAN source text exactly as it appears in deQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an ss for
 * a ß or a hyphen for an en dash, and the lookup misses in silence. The
 * question renders in German, the tap works, and nothing anywhere reports it.
 *
 * WHAT STAYS GERMAN follows LEBEN_IN_DEUTSCHLAND_RU exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The line runs where Russian itself
 * draws it:
 *
 *   - an institution Russian has a name for gets that name — Основной закон,
 *     федеральный канцлер, федеральный президент, Федеральный конституционный
 *     суд, федеральное правительство, земли, ведомство по делам иностранцев;
 *   - the two chambers and the army keep their own name in Cyrillic letters —
 *     Бундестаг, Бундесрат, бундесвер;
 *   - the words a reader will meet printed on a form and nowhere else keep
 *     their German and gain the Russian meaning beside them — Standesamt,
 *     Kindergeld, Elterngeld, Bürgergeld.
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
export const DE_QUESTION_BANK_RU: Record<string, string> = {
  "Wie heißt die Verfassung der Bundesrepublik Deutschland?":
    "Как называется конституция Федеративной Республики Германия?",
  "Bundesverfassung": "Союзная конституция",
  "Grundgesetz": "Основной закон",
  "Reichsverfassung": "Имперская конституция",
  "Staatsvertrag": "Государственный договор",
  "Sie heißt Grundgesetz. Der Name war 1949 als Provisorium gedacht — bis zur Wiedervereinigung wollte man sich das Wort „Verfassung“ aufheben.":
    "Он называется Основным законом. В 1949 году это название задумывали как временное — слово «конституция» хотели приберечь до воссоединения.",
  "Seit wann gilt das Grundgesetz?": "С какого времени действует Основной закон?",
  "Seit dem 8. Mai 1945": "С 8 мая 1945 года",
  "Seit dem 23. Mai 1949": "С 23 мая 1949 года",
  "Seit dem 7. Oktober 1949": "С 7 октября 1949 года",
  "Seit dem 3. Oktober 1990": "С 3 октября 1990 года",
  "23. Mai 1949. Der 7. Oktober 1949 ist die Gründung der DDR, der 3. Oktober 1990 die Wiedervereinigung.":
    "С 23 мая 1949 года. 7 октября 1949 года — основание ГДР, 3 октября 1990 года — воссоединение.",
  "Welches Recht gehört zu den Grundrechten im Grundgesetz?":
    "Какое право относится к основным правам в Основном законе?",
  "Das Recht auf ein eigenes Auto": "Право на собственный автомобиль",
  "Die Meinungsfreiheit": "Свобода мнения",
  "Das Recht auf einen Arbeitsplatz beim Staat": "Право на рабочее место у государства",
  "Das Recht auf ein Studium ohne Abschluss": "Право учиться в вузе без получения диплома",
  "Die Meinungsfreiheit steht in Artikel 5. Die anderen drei sind keine Grundrechte.":
    "Свобода мнения стоит в статье 5. Остальные три основными правами не являются.",
  "Was sagt Artikel 3 des Grundgesetzes?": "Что говорит статья 3 Основного закона?",
  "Die Würde des Menschen ist unantastbar": "Достоинство человека неприкосновенно",
  "Alle Menschen sind vor dem Gesetz gleich": "Все люди равны перед законом",
  "Jeder hat das Recht auf Leben": "Каждый имеет право на жизнь",
  "Die Kunst ist frei": "Искусство свободно",
  "Artikel 3 ist der Gleichheitssatz. Die Menschenwürde steht in Artikel 1, die Kunstfreiheit in Artikel 5.":
    "Статья 3 — это положение о равенстве. Достоинство человека стоит в статье 1, свобода искусства — в статье 5.",
  "Welche Aussage über die Meinungsfreiheit in Deutschland ist richtig?":
    "Какое утверждение о свободе мнения в Германии верно?",
  "Man darf alles sagen, ohne jede Grenze": "Говорить можно всё что угодно, без всяких границ",
  "Sie endet dort, wo Volksverhetzung oder Beleidigung beginnt":
    "Она кончается там, где начинается разжигание ненависти или оскорбление",
  "Sie gilt nur für deutsche Staatsangehörige": "Она действует только для граждан Германии",
  "Sie gilt nur in privaten Gesprächen": "Она действует только в частных разговорах",
  "Meinungsfreiheit ist weit, aber nicht grenzenlos: Volksverhetzung, Beleidigung und Holocaustleugnung sind Straftaten.":
    "Свобода мнения широка, но не безгранична: разжигание ненависти, оскорбление и отрицание Холокоста являются преступлениями.",
  "Wie viele Fragen umfasst der Einbürgerungstest, und wie viele davon betreffen das Bundesland?":
    "Сколько вопросов в тесте на гражданство и сколько из них о своей земле?",
  "30 Fragen, davon 3 zum Bundesland": "30 вопросов, из них 3 о своей земле",
  "33 Fragen, davon 3 zum Bundesland": "33 вопроса, из них 3 о своей земле",
  "33 Fragen, davon 10 zum Bundesland": "33 вопроса, из них 10 о своей земле",
  "25 Fragen, davon 5 zum Bundesland": "25 вопросов, из них 5 о своей земле",
  "33 Fragen insgesamt: 30 aus dem bundesweiten Katalog und 3 zum Bundesland, in dem der Test geschrieben wird.":
    "Всего 33 вопроса: 30 из общефедерального перечня и 3 о той земле, где пишут тест.",
  "Von wem geht in Deutschland alle Staatsgewalt aus?":
    "От кого в Германии исходит вся государственная власть?",
  "Vom Bundespräsidenten": "От федерального президента",
  "Vom Volk": "От народа",
  "Von den Parteien": "От партий",
  "Von den Bundesländern": "От федеральных земель",
  "Artikel 20: „Alle Staatsgewalt geht vom Volke aus.“ Ausgeübt wird sie durch Wahlen und durch die drei Gewalten.":
    "Статья 20: «Вся государственная власть исходит от народа». Осуществляется она через выборы и через три ветви власти.",
  "Welche Staatsform hat Deutschland?": "Какая в Германии форма правления?",
  "Monarchie": "Монархия",
  "Diktatur": "Диктатура",
  "Kaiserreich": "Империя",
  "Eine Republik: Das Staatsoberhaupt wird gewählt, es gibt keinen König und keinen Kaiser.":
    "Республика: главу государства избирают, ни короля, ни императора нет.",
  "Was gehört zur Exekutive?": "Что относится к исполнительной власти?",
  "Die Polizei": "Полиция",
  "Die Polizei führt Gesetze aus und gehört damit zur Exekutive. Bundestag und Bundesrat sind Legislative, die Gerichte Judikative.":
    "Полиция исполняет законы и потому относится к исполнительной власти. Бундестаг и Бундесрат — законодательная, суды — судебная.",
  "Was bedeutet „Rechtsstaat“?": "Что означает «правовое государство»?",
  "Der Staat kann tun, was er für richtig hält":
    "Государство может делать то, что считает правильным",
  "Auch der Staat ist an Gesetze gebunden": "Законам подчинено и само государство",
  "Nur Juristen dürfen Politik machen": "Заниматься политикой могут только юристы",
  "Es gibt besonders viele Gesetze": "Законов особенно много",
  "Im Rechtsstaat gilt das Gesetz auch für den Staat selbst — und gegen jede staatliche Entscheidung kann man klagen.":
    "В правовом государстве закон действует и для самого государства — и на любое его решение можно подать в суд.",
  "Was bedeutet „wehrhafte Demokratie“?": "Что означает «обороноспособная демократия»?",
  "Deutschland hat eine starke Armee": "У Германии сильная армия",
  "Die Demokratie schützt sich vor denen, die sie abschaffen wollen":
    "Демократия защищается от тех, кто хочет её упразднить",
  "Bürger dürfen sich mit Waffen verteidigen": "Граждане могут защищаться с оружием",
  "Der Staat wehrt sich gegen Kritik": "Государство обороняется от критики",
  "Verfassungsfeindliche Parteien können verboten werden, und der Kern der Verfassung ist unabänderlich. Mit der Armee hat der Begriff nichts zu tun.":
    "Партии, враждебные конституции, могут быть запрещены, а ядро конституции неизменяемо. К армии это понятие отношения не имеет.",
  "Warum sind die Gewalten in Deutschland getrennt?": "Почему власти в Германии разделены?",
  "Damit die Arbeit schneller geht": "Чтобы работа шла быстрее",
  "Damit keine Stelle allein über alles bestimmen kann":
    "Чтобы ни одно место не решало всё в одиночку",
  "Weil es die EU vorschreibt": "Потому что этого требует Европейский союз",
  "Weil es in der Weimarer Verfassung so stand":
    "Потому что так стояло в Веймарской конституции",
  "Machtkontrolle ist der Zweck: Was die eine Gewalt beschließt, führt die zweite aus und überprüft die dritte.":
    "Смысл в надзоре за властью: что решает одна ветвь, исполняет вторая и проверяет третья.",
  "Welches Verfassungsorgan wird in Deutschland direkt vom Volk gewählt?":
    "Какой конституционный орган в Германии избирается прямо народом?",
  "Die Bundesregierung": "Федеральное правительство",
  "Nur der Bundestag wird direkt gewählt. Alle anderen Organe gehen mittelbar aus Wahlen hervor.":
    "Прямо избирается только Бундестаг. Все остальные органы выходят из выборов косвенно.",
  "Was ist eine Fraktion im Bundestag?": "Что такое фракция в Бундестаге?",
  "Ein Ausschuss für Finanzfragen": "Комитет по финансовым вопросам",
  "Der Zusammenschluss der Abgeordneten einer Partei": "Объединение депутатов одной партии",
  "Die Regierungsmannschaft des Kanzlers": "Команда канцлера в правительстве",
  "Eine Gruppe von Ministerien": "Группа министерств",
  "Abgeordnete derselben Partei schließen sich zur Fraktion zusammen. Fraktionen bestimmen den Arbeitsalltag des Parlaments.":
    "Депутаты одной партии объединяются во фракцию. Фракции определяют повседневную работу парламента.",
  "Wer darf einen Gesetzentwurf in den Bundestag einbringen?":
    "Кто может внести законопроект в Бундестаг?",
  "Nur die Bundesregierung": "Только федеральное правительство",
  "Bundesregierung, Bundestag oder Bundesrat":
    "Федеральное правительство, Бундестаг или Бундесрат",
  "Nur der Bundespräsident": "Только федеральный президент",
  "Jeder Bürger direkt": "Каждый гражданин напрямую",
  "Drei Wege führen zu einem Gesetzentwurf: aus der Regierung, aus der Mitte des Bundestages oder aus dem Bundesrat.":
    "К законопроекту ведут три пути: из правительства, из самого Бундестага или из Бундесрата.",
  "Was versteht man unter dem Budgetrecht des Bundestages?":
    "Что понимают под бюджетным правом Бундестага?",
  "Das Recht, die Steuern selbst einzuziehen": "Право самому собирать налоги",
  "Das Recht, über den Haushalt des Bundes zu entscheiden": "Право решать о бюджете федерации",
  "Das Recht der Abgeordneten auf ein Gehalt": "Право депутатов на жалованье",
  "Das Recht, Kredite privat aufzunehmen": "Право брать кредиты в частном порядке",
  "Das Parlament entscheidet, wofür der Staat Geld ausgibt. Deshalb gilt das Budgetrecht als Königsrecht des Bundestages.":
    "Парламент решает, на что государство тратит деньги. Поэтому бюджетное право считают главным правом Бундестага.",
  "Wie viele Stimmen hat ein Bundesland im Bundesrat?":
    "Сколько голосов у федеральной земли в Бундесрате?",
  "Jedes Land hat genau eine Stimme": "У каждой земли ровно один голос",
  "Je nach Einwohnerzahl drei bis sechs Stimmen":
    "От трёх до шести голосов в зависимости от числа жителей",
  "Jedes Land hat zehn Stimmen": "У каждой земли десять голосов",
  "Die Zahl wechselt jedes Jahr": "Число меняется каждый год",
  "Drei bis sechs Stimmen, gestaffelt nach Einwohnerzahl — und ein Land muss seine Stimmen einheitlich abgeben.":
    "От трёх до шести голосов, ступенями по числу жителей — и земля обязана подавать свои голоса единообразно.",
  "Was ist ein Untersuchungsausschuss?": "Что такое следственный комитет?",
  "Ein Gericht für Abgeordnete": "Суд для депутатов",
  "Ein Gremium des Bundestages, das Vorgänge aufklärt und die Regierung kontrolliert":
    "Орган Бундестага, который выясняет обстоятельства и надзирает за правительством",
  "Eine Behörde zur Prüfung von Gesetzen": "Ведомство для проверки законов",
  "Der Ausschuss, der den Haushalt aufstellt": "Комитет, который составляет бюджет",
  "Er gehört zur Kontrollfunktion des Parlaments: Der Bundestag klärt damit auf, was die Regierung lieber unerwähnt ließe.":
    "Он относится к надзорной работе парламента: Бундестаг выясняет с его помощью то, о чём правительство предпочло бы промолчать.",
  "Wer leitet die Bundesregierung?": "Кто возглавляет федеральное правительство?",
  "Der Bundestagspräsident": "Председатель Бундестага",
  "Der Präsident des Bundesrates": "Председатель Бундесрата",
  "Der Bundeskanzler führt die Regierung und bestimmt die Richtlinien der Politik. Der Bundespräsident regiert nicht.":
    "Федеральный канцлер ведёт правительство и определяет основные направления политики. Федеральный президент не правит.",
  "Wer wählt den Bundespräsidenten?": "Кто избирает федерального президента?",
  "Der Bundestag allein": "Один только Бундестаг",
  "Die Bundesversammlung — zur Hälfte Bundestagsabgeordnete, zur Hälfte Vertreter der Länder. Sie tritt nur zu diesem Zweck zusammen.":
    "Федеральное собрание — наполовину депутаты Бундестага, наполовину представители земель. Оно сходится только ради этого.",
  "Was bedeutet Richtlinienkompetenz?": "Что означает право определять направления политики?",
  "Der Kanzler bestimmt die Grundlinien der Politik":
    "Канцлер определяет основные линии политики",
  "Der Bundespräsident gibt die Gesetze vor": "Федеральный президент задаёт законы",
  "Die Ministerien schreiben eigene Richtlinien": "Министерства пишут собственные указания",
  "Der Bundesrat gibt den Ländern Richtlinien": "Бундесрат даёт землям указания",
  "Der Kanzler setzt die Leitlinien; innerhalb dieser Linien führt jeder Minister sein Haus eigenständig.":
    "Канцлер задаёт основные линии; внутри этих линий каждый министр ведёт своё ведомство самостоятельно.",
  "Wer ernennt die Bundesminister?": "Кто назначает федеральных министров?",
  "Der Bundestag durch Wahl": "Бундестаг голосованием",
  "Der Bundespräsident auf Vorschlag des Kanzlers":
    "Федеральный президент по предложению канцлера",
  "Der Kanzler allein, ohne weitere Beteiligung": "Канцлер один, без чьего-либо участия",
  "Vorschlagen darf der Kanzler, ernennen muss der Bundespräsident. Zwei Schritte, die gern zu einem verkürzt werden.":
    "Предлагать может канцлер, а назначать обязан федеральный президент. Два шага, которые охотно сводят к одному.",
  "Wie oft darf eine Person das Amt des Bundespräsidenten ausüben?":
    "Сколько раз один человек может занимать должность федерального президента?",
  "Nur einmal": "Только один раз",
  "Höchstens zweimal": "Не более двух раз",
  "Beliebig oft": "Сколько угодно раз",
  "Bis zum 70. Lebensjahr": "До 70 лет",
  "Zwei Amtszeiten zu je fünf Jahren, also höchstens zehn Jahre. Für den Kanzler gibt es keine solche Grenze.":
    "Два срока по пять лет, то есть не более десяти лет. Для канцлера такой границы нет.",
  "Wie nennt man Kanzler und Minister zusammen?": "Как называют канцлера и министров вместе?",
  "Bundesversammlung": "Федеральное собрание",
  "Bundesregierung oder Kabinett": "Федеральное правительство, или кабинет",
  "Bundesrat": "Бундесрат",
  "Bundestag": "Бундестаг",
  "Bundeskanzler und Bundesminister bilden gemeinsam die Bundesregierung, umgangssprachlich das Kabinett.":
    "Федеральный канцлер и федеральные министры вместе образуют федеральное правительство, в разговорной речи кабинет.",
  "Wie oft findet in Deutschland regulär eine Bundestagswahl statt?":
    "Как часто в Германии в обычном порядке проходят выборы в Бундестаг?",
  "Alle zwei Jahre": "Каждые два года",
  "Alle vier Jahre": "Каждые четыре года",
  "Alle fünf Jahre": "Каждые пять лет",
  "Alle sechs Jahre": "Каждые шесть лет",
  "Alle vier Jahre. Das Europäische Parlament wird alle fünf Jahre gewählt — daher die häufige Verwechslung.":
    "Каждые четыре года. Европейский парламент избирают каждые пять лет — отсюда частая путаница.",
  "Was bedeutet „freie Wahl“?": "Что означает «свободные выборы»?",
  "Die Wahl kostet nichts": "Выборы ничего не стоят",
  "Niemand darf zu einer bestimmten Entscheidung gezwungen werden":
    "Никого нельзя принудить к определённому решению",
  "Jeder kann sich aussuchen, wann er wählt": "Каждый может сам выбрать, когда голосовать",
  "Man kann mehrere Stimmen abgeben": "Можно подать несколько голосов",
  "Frei heißt: ohne Druck und ohne Zwang. Weder Staat noch Arbeitgeber noch Familie dürfen eine Stimme vorschreiben.":
    "Свободные значит: без давления и без принуждения. Ни государство, ни работодатель, ни семья не вправе предписать голос.",
  "Was ist die Fünf-Prozent-Hürde?": "Что такое пятипроцентный барьер?",
  "Eine Partei braucht mindestens fünf Prozent der Zweitstimmen, um in den Bundestag zu kommen":
    "Партии нужно не менее пяти процентов вторых голосов, чтобы попасть в Бундестаг",
  "Fünf Prozent der Wähler müssen zur Wahl gehen":
    "На выборы должны прийти пять процентов избирателей",
  "Ein Kandidat braucht fünf Prozent im Wahlkreis": "Кандидату нужно пять процентов в округе",
  "Fünf Prozent der Sitze bleiben immer frei": "Пять процентов мест всегда остаются свободными",
  "Sie hält Kleinstparteien draußen und soll das Parlament arbeitsfähig halten — eine Lehre aus der zersplitterten Weimarer Republik.":
    "Он держит мельчайшие партии снаружи и должен сохранять работоспособность парламента — урок раздробленной Веймарской республики.",
  "Wofür wird die Erststimme bei der Bundestagswahl verwendet?":
    "Для чего служит первый голос на выборах в Бундестаг?",
  "Für die Wahl einer Partei": "Для выбора партии",
  "Für die Wahl eines Kandidaten im eigenen Wahlkreis":
    "Для выбора кандидата в своём избирательном округе",
  "Für die Wahl des Bundeskanzlers": "Для выбора федерального канцлера",
  "Für die Wahl des Bundespräsidenten": "Для выбора федерального президента",
  "Die Erststimme gilt einer Person im Wahlkreis, die Zweitstimme einer Partei. Kanzler und Präsident wählt das Volk gar nicht.":
    "Первый голос отдают человеку в округе, второй — партии. Канцлера и президента народ не избирает вовсе.",
  "Wer darf in Deutschland bei Kommunalwahlen häufig mitwählen, ohne die deutsche Staatsangehörigkeit zu haben?":
    "Кто в Германии часто может голосовать на общинных выборах, не имея немецкого гражданства?",
  "Niemand": "Никто",
  "Bürger anderer EU-Staaten, die hier wohnen":
    "Граждане других государств Европейского союза, живущие здесь",
  "Alle Personen mit Aufenthaltstitel": "Все, у кого есть вид на жительство",
  "Nur Personen aus Nachbarländern": "Только люди из соседних стран",
  "EU-Bürger dürfen dort wählen, wo sie leben — bei Kommunal- und Europawahlen. Für die Bundestagswahl braucht es den deutschen Pass.":
    "Граждане Европейского союза голосуют там, где живут — на общинных и европейских выборах. Для выборов в Бундестаг нужен немецкий паспорт.",
  "Was ist die Opposition im Bundestag?": "Что такое оппозиция в Бундестаге?",
  "Die Parteien, die nicht die Regierung stellen": "Партии, которые не составляют правительство",
  "Die Minister ohne eigenes Ministerium": "Министры без собственного министерства",
  "Die Abgeordneten des Bundesrates": "Депутаты Бундесрата",
  "Die Verwaltung des Parlaments": "Управление делами парламента",
  "Sie kontrolliert die Regierung, stellt Alternativen zur Debatte und ist damit ein fester Bestandteil der Demokratie.":
    "Она надзирает за правительством, выносит на обсуждение иные пути и потому является прочной частью демократии.",
  "Wie heißt das Parlament eines Bundeslandes in den meisten Ländern?":
    "Как в большинстве земель называется парламент федеральной земли?",
  "Gemeinderat": "Общинный совет",
  "Landtag. In Hamburg und Bremen heißt es Bürgerschaft, in Berlin Abgeordnetenhaus.":
    "Ландтаг. В Гамбурге и Бремене он называется бюргершафтом, в Берлине — палатой депутатов.",
  "Wie heißt der Regierungschef eines Flächenlandes?":
    "Как называется глава правительства земли с обычной территорией?",
  "Bürgermeister": "Бургомистр",
  "Ministerpräsident": "Премьер-министр земли",
  "Landeskanzler": "Канцлер земли",
  "Landrat": "Ландрат",
  "Ministerpräsident. In den Stadtstaaten heißt das Amt Regierender Bürgermeister, Erster Bürgermeister oder Präsident des Senats.":
    "Премьер-министр земли. В городах-землях эта должность называется правящим бургомистром, первым бургомистром или председателем сената.",
  "Wofür ist der Bund und nicht das Bundesland zuständig?":
    "За что отвечает федерация, а не федеральная земля?",
  "Für die Schulen": "За школы",
  "Für die Außenpolitik": "За внешнюю политику",
  "Für die Landespolizei": "За полицию земли",
  "Für die Bauordnung": "За строительные правила",
  "Außenpolitik, Verteidigung, Staatsangehörigkeit und Währung sind Bundessache. Schule, Polizei und Bauordnung sind Ländersache.":
    "Внешняя политика, оборона, гражданство и валюта — дело федерации. Школа, полиция и строительные правила — дело земель.",
  "Welche Aussage über die Landesverfassungen ist richtig?":
    "Какое утверждение о конституциях земель верно?",
  "Es gibt keine, es gilt nur das Grundgesetz": "Их нет, действует только Основной закон",
  "Jedes Land hat eine eigene, die dem Grundgesetz nicht widersprechen darf":
    "У каждой земли своя, и она не вправе противоречить Основному закону",
  "Sie stehen über dem Grundgesetz": "Они стоят выше Основного закона",
  "Nur die alten Bundesländer haben eine": "Они есть только у старых федеральных земель",
  "Jedes Land hat eine eigene Verfassung — aber Bundesrecht bricht Landesrecht, und dem Grundgesetz darf keine widersprechen.":
    "У каждой земли своя конституция — но федеральное право ломает право земли, и ни одна не вправе противоречить Основному закону.",
  "Was entscheidet die Gemeinde selbst?": "Что община решает сама?",
  "Die Höhe der Einkommensteuer": "Размер подоходного налога",
  "Bebauungspläne, Kitas und die örtliche Müllabfuhr":
    "Планы застройки, детские сады и местный вывоз мусора",
  "Die Staatsangehörigkeit": "Гражданство",
  "Die kommunale Selbstverwaltung regelt, was direkt vor Ort anfällt. Steuersätze, Schulpflicht und Staatsangehörigkeit liegen höher.":
    "Общинное самоуправление ведает тем, что возникает прямо на месте. Ставки налогов, обязательное школьное обучение и гражданство лежат выше.",
  "Wie viele Flächenländer hat Deutschland?": "Сколько в Германии земель с обычной территорией?",
  "11": "11",
  "13": "13",
  "3": "3",
  "13 Flächenländer plus die drei Stadtstaaten Berlin, Hamburg und Bremen ergeben 16 Bundesländer.":
    "13 земель с обычной территорией плюс три города-земли Берлин, Гамбург и Бремен дают 16 федеральных земель.",
  "An welches Gericht wendest du dich bei einem Streit über eine Kündigung?":
    "В какой суд обращаются при споре об увольнении?",
  "An das Verwaltungsgericht": "В административный суд",
  "An das Arbeitsgericht": "В суд по трудовым делам",
  "An das Finanzgericht": "В финансовый суд",
  "An das Sozialgericht": "В социальный суд",
  "Arbeitsgerichte entscheiden über Streit zwischen Arbeitgeber und Arbeitnehmer, Kündigungen eingeschlossen.":
    "Суды по трудовым делам решают споры между работодателем и работником, включая увольнения.",
  "Wer klagt im Strafverfahren gegen einen Angeklagten?":
    "Кто выдвигает обвинение против подсудимого в уголовном процессе?",
  "Der Richter": "Судья",
  "Die Staatsanwaltschaft": "Прокуратура",
  "Der Verteidiger": "Защитник",
  "Die Staatsanwaltschaft erhebt Anklage. Der Richter entscheidet, die Polizei ermittelt, der Verteidiger vertritt den Angeklagten.":
    "Обвинение выдвигает прокуратура. Судья решает, полиция ведёт розыск, защитник представляет подсудимого.",
  "Was bedeutet die Unabhängigkeit der Richter?": "Что означает независимость судей?",
  "Richter dürfen selbst Gesetze machen": "Судьи могут сами создавать законы",
  "Richter sind nur an das Gesetz gebunden und erhalten keine Weisungen":
    "Судьи связаны только законом и не получают указаний",
  "Richter müssen nicht begründen, wie sie entscheiden":
    "Судьи не обязаны обосновывать свои решения",
  "Richter werden vom Volk gewählt": "Судей избирает народ",
  "Kein Minister und kein Vorgesetzter darf einem Richter vorschreiben, wie er zu entscheiden hat. Gebunden ist er allein an das Gesetz.":
    "Ни министр, ни начальник не вправе предписать судье, как ему решать. Связан он одним только законом.",
  "Wann kann eine Person Verfassungsbeschwerde erheben?":
    "Когда человек может подать конституционную жалобу?",
  "Sofort, bevor sie andere Gerichte anruft": "Сразу, ещё не обращаясь в другие суды",
  "Wenn sie sich in Grundrechten verletzt sieht und der übrige Rechtsweg ausgeschöpft ist":
    "Когда считает свои основные права нарушенными и остальные средства защиты исчерпаны",
  "Nur wenn der Bundestag zustimmt": "Только с согласия Бундестага",
  "Nur als Gruppe von mindestens 100 Personen": "Только группой не менее чем из 100 человек",
  "Zuerst der normale Rechtsweg, dann Karlsruhe. Die Verfassungsbeschwerde ist der letzte Schritt, nicht der erste.":
    "Сначала обычный путь через суды, потом Карлсруэ. Конституционная жалоба — последний шаг, а не первый.",
  "Was gilt, wenn jemand in Deutschland eine Straftat begeht, die zur Tatzeit noch nicht strafbar war?":
    "Что действует, если кто-то совершил в Германии деяние, которое на момент совершения не было наказуемым?",
  "Er wird nachträglich bestraft": "Его накажут задним числом",
  "Er kann dafür nicht bestraft werden": "Наказать его за это нельзя",
  "Das Gericht entscheidet frei": "Суд решает свободно",
  "Die Strafe wird halbiert": "Наказание уменьшают вдвое",
  "Keine Strafe ohne Gesetz: Bestraft werden kann nur, was zum Zeitpunkt der Tat bereits unter Strafe stand.":
    "Нет наказания без закона: наказать можно только за то, что уже было наказуемо в момент совершения.",
  "Wer bekommt in Deutschland einen Verteidiger, wenn er sich keinen leisten kann?":
    "Кто в Германии получает защитника, если не может его себе позволить?",
  "Niemand, ein Anwalt muss selbst bezahlt werden": "Никто, адвоката нужно оплачивать самому",
  "Jeder Angeklagte — der Staat hilft bei den Kosten":
    "Каждый подсудимый — государство помогает с расходами",
  "Nur deutsche Staatsangehörige": "Только граждане Германии",
  "Nur bei schweren Verbrechen und nur auf eigene Kosten":
    "Только при тяжких преступлениях и только за свой счёт",
  "Das Recht auf Verteidigung darf nicht am Geld scheitern; deshalb gibt es Pflichtverteidigung und Prozesskostenhilfe.":
    "Право на защиту не должно упираться в деньги; для этого есть защитник по назначению и помощь в судебных расходах.",
  "Welche Versicherung zahlt, wenn jemand seine Arbeit verliert?":
    "Какое страхование платит, если человек теряет работу?",
  "Die Rentenversicherung": "Пенсионное",
  "Die Arbeitslosenversicherung": "Страхование на случай безработицы",
  "Die Pflegeversicherung": "Страхование на случай потребности в уходе",
  "Die Unfallversicherung": "Страхование от несчастных случаев",
  "Die Arbeitslosenversicherung zahlt Arbeitslosengeld und finanziert Vermittlung und Weiterbildung.":
    "Страхование на случай безработицы платит пособие по безработице и оплачивает поиск работы и переобучение.",
  "Seit wann gibt es in Deutschland die Pflegeversicherung?":
    "С какого времени в Германии существует страхование на случай потребности в уходе?",
  "Seit 1995": "С 1995 года",
  "Seit 2005": "С 2005 года",
  "Seit 2015": "С 2015 года",
  "1995 kam sie als fünfte und jüngste Säule der Sozialversicherung hinzu.":
    "В 1995 году оно добавилось как пятая и самая молодая опора социального страхования.",
  "Wer zahlt Kindergeld, und wovon hängt es ab?": "Кто платит Kindergeld и от чего оно зависит?",
  "Der Arbeitgeber, abhängig vom Gehalt": "Работодатель, в зависимости от заработка",
  "Der Staat, unabhängig vom Einkommen der Eltern":
    "Государство, независимо от дохода родителей",
  "Die Krankenkasse, abhängig von den Beiträgen": "Медицинская касса, в зависимости от взносов",
  "Die Gemeinde, abhängig vom Wohnort": "Община, в зависимости от места жительства",
  "Kindergeld gibt es für jedes Kind, ohne Rücksicht auf das Einkommen der Eltern.":
    "Kindergeld, пособие на ребёнка, платят за каждого ребёнка, невзирая на доход родителей.",
  "Wie werden die Beiträge zur gesetzlichen Krankenversicherung berechnet?":
    "Как рассчитывают взносы в обязательное медицинское страхование?",
  "Nach dem Alter der versicherten Person": "По возрасту застрахованного",
  "Nach dem Einkommen": "По доходу",
  "Nach der Anzahl der Arztbesuche": "По числу посещений врача",
  "Für alle gleich hoch": "Одинаково для всех",
  "Nach dem Einkommen — das ist das Solidarprinzip. In der privaten Versicherung zählen dagegen Alter und Gesundheitszustand.":
    "По доходу — это начало солидарности. В частном страховании, наоборот, считают возраст и состояние здоровья.",
  "Was ist das Elterngeld?": "Что такое Elterngeld?",
  "Ein Zuschuss zur Miete für Familien": "Надбавка семьям на наём жилья",
  "Ein Ersatz für einen Teil des Einkommens nach der Geburt eines Kindes":
    "Возмещение части дохода после рождения ребёнка",
  "Das monatliche Geld für jedes Kind": "Ежемесячные деньги на каждого ребёнка",
  "Eine einmalige Zahlung zur Geburt": "Разовая выплата при рождении",
  "Elterngeld ersetzt Einkommen, wenn Eltern nach der Geburt zu Hause bleiben. Kindergeld dagegen ist die laufende Zahlung pro Kind.":
    "Elterngeld, родительское пособие, возмещает доход, когда родители остаются дома после рождения. Kindergeld, в отличие от него, — это текущая выплата на каждого ребёнка.",
  "Welche Behörde ist für Arbeitslosengeld und Arbeitsvermittlung zuständig?":
    "Какое ведомство отвечает за пособие по безработице и за поиск работы?",
  "Das Finanzamt": "Налоговое ведомство",
  "Die Bundesagentur für Arbeit": "Федеральное агентство по труду",
  "Das Bürgeramt": "Ведомство по делам граждан",
  "Die Krankenkasse": "Медицинская касса",
  "Die Bundesagentur für Arbeit mit ihren Agenturen und Jobcentern vor Ort.":
    "Федеральное агентство по труду со своими местными агентствами и джобцентрами.",
  "Wer war der erste Reichskanzler des Deutschen Kaiserreichs?":
    "Кто был первым рейхсканцлером Германской империи?",
  "Wilhelm II.": "Вильгельм II",
  "Otto von Bismarck": "Отто фон Бисмарк",
  "Friedrich Ebert": "Фридрих Эберт",
  "Bismarck ab 1871. Ebert wurde 1919 erster Reichspräsident, Adenauer 1949 erster Bundeskanzler.":
    "Бисмарк с 1871 года. Эберт в 1919 году стал первым рейхспрезидентом, Аденауэр в 1949 — первым федеральным канцлером.",
  "Wann endete der Erste Weltkrieg?": "Когда кончилась Первая мировая война?",
  "1914": "1914",
  "1933": "1933",
  "1918. Im selben Jahr dankte der Kaiser ab und die Republik wurde ausgerufen.":
    "В 1918 году. В том же году император отрёкся и была провозглашена республика.",
  "Was war der Versailler Vertrag?": "Что такое Версальский договор?",
  "Der Vertrag zur Gründung des Kaiserreichs": "Договор об основании Германской империи",
  "Der Friedensvertrag nach dem Ersten Weltkrieg": "Мирный договор после Первой мировой войны",
  "Der Vertrag über die Wiedervereinigung": "Договор о воссоединении",
  "Der Gründungsvertrag der EU": "Учредительный договор Европейского союза",
  "1919 geschlossen. Er verpflichtete Deutschland zu Reparationen und Gebietsabtretungen und belastete die junge Republik schwer.":
    "Заключён в 1919 году. Он обязал Германию к возмещениям и уступке земель и тяжело обременил молодую республику.",
  "Welche Neuerung brachte die Weimarer Republik für Frauen?":
    "Какую новость Веймарская республика принесла женщинам?",
  "Das Recht auf eigenes Vermögen": "Право на собственное имущество",
  "Das Wahlrecht": "Избирательное право",
  "Das Recht zu studieren": "Право учиться в вузе",
  "Den Mutterschutz": "Охрану материнства",
  "1919 durften Frauen erstmals wählen und gewählt werden — die wohl wichtigste demokratische Neuerung dieser Jahre.":
    "В 1919 году женщины впервые смогли избирать и быть избранными — пожалуй, самая важная демократическая новость тех лет.",
  "Welche Schwäche der Weimarer Republik beantwortet das Grundgesetz mit der Fünf-Prozent-Hürde?":
    "На какую слабость Веймарской республики Основной закон отвечает пятипроцентным барьером?",
  "Die hohe Arbeitslosigkeit": "На высокую безработицу",
  "Die Zersplitterung des Parlaments in viele kleine Parteien":
    "На раздробленность парламента на множество мелких партий",
  "Die Reparationszahlungen": "На выплаты возмещений",
  "Die Macht des Reichspräsidenten": "На власть рейхспрезидента",
  "Viele Kleinstparteien machten stabile Mehrheiten unmöglich. Die Hürde soll genau das verhindern.":
    "Множество мельчайших партий делало устойчивое большинство невозможным. Барьер должен помешать именно этому.",
  "Wofür ist Bismarck neben der Reichsgründung bekannt?":
    "Чем Бисмарк известен помимо основания империи?",
  "Für die Einführung der ersten Sozialversicherungen":
    "Введением первых видов социального страхования",
  "Für die Einführung des Frauenwahlrechts": "Введением избирательного права для женщин",
  "Für die Gründung der Bundeswehr": "Основанием бундесвера",
  "Für die Einführung des Euro": "Введением евро",
  "Kranken-, Unfall- und Rentenversicherung entstanden in den 1880er Jahren — der deutsche Sozialstaat ist älter als die Demokratie.":
    "Страхование на случай болезни, несчастного случая и по старости возникло в 1880-е годы — немецкое социальное государство старше немецкой демократии.",
  "Wann kamen die Nationalsozialisten in Deutschland an die Macht?":
    "Когда национал-социалисты пришли в Германии к власти?",
  "1939": "1939",
  "Am 30. Januar 1933 wurde Hitler Reichskanzler. 1939 begann der Krieg, 1945 endete er.":
    "30 января 1933 года Гитлер стал рейхсканцлером. В 1939 году началась война, в 1945 она кончилась.",
  "Was bewirkte das Ermächtigungsgesetz von 1933?":
    "К чему привёл закон о полномочиях 1933 года?",
  "Es gab dem Parlament mehr Rechte": "Он дал парламенту больше прав",
  "Es erlaubte der Regierung, Gesetze ohne das Parlament zu erlassen":
    "Он позволил правительству издавать законы без парламента",
  "Es führte das Frauenwahlrecht ein": "Он ввёл избирательное право для женщин",
  "Es begrenzte die Macht des Reichskanzlers": "Он ограничил власть рейхсканцлера",
  "Damit war die Gewaltenteilung beseitigt — der entscheidende Schritt von der Demokratie zur Diktatur.":
    "Разделение властей было этим устранено — решающий шаг от демократии к диктатуре.",
  "Welches Merkmal kennzeichnete den NS-Staat?":
    "Какая черта отличала национал-социалистическое государство?",
  "Mehrere Parteien im Wettbewerb": "Несколько партий в соперничестве",
  "Nur eine erlaubte Partei": "Только одна разрешённая партия",
  "Unabhängige Gerichte": "Независимые суды",
  "Freie Presse": "Свободная печать",
  "Ab Sommer 1933 war die NSDAP die einzige zugelassene Partei. Freie Presse und unabhängige Gerichte gab es nicht mehr.":
    "С лета 1933 года НСДАП была единственной допущенной партией. Свободной печати и независимых судов больше не было.",
  "Was geschah am 20. Juli 1944?": "Что произошло 20 июля 1944 года?",
  "Der Krieg endete": "Кончилась война",
  "Ein Attentat auf Hitler scheiterte": "Покушение на Гитлера не удалось",
  "Die Nürnberger Gesetze wurden erlassen": "Были изданы Нюрнбергские законы",
  "Die Mauer wurde gebaut": "Была построена стена",
  "Stauffenbergs Attentat scheiterte; die Beteiligten wurden hingerichtet. Der Tag steht für den militärischen Widerstand.":
    "Покушение Штауффенберга не удалось; участников казнили. Этот день стоит за военное сопротивление.",
  "Wann endete der Zweite Weltkrieg in Europa?":
    "Когда кончилась Вторая мировая война в Европе?",
  "Am 9. November 1945": "9 ноября 1945 года",
  "Mit der bedingungslosen Kapitulation am 8. Mai 1945. Der 1. September 1939 war der Kriegsbeginn.":
    "С безоговорочной капитуляцией 8 мая 1945 года. 1 сентября 1939 года было началом войны.",
  "Was waren die Nürnberger Gesetze von 1935?": "Что такое Нюрнбергские законы 1935 года?",
  "Gesetze zum Schutz von Arbeitnehmern": "Законы о защите работников",
  "Rassistische Gesetze, die jüdischen Deutschen ihre Bürgerrechte nahmen":
    "Расистские законы, отнявшие у немецких евреев гражданские права",
  "Die Verfassung des NS-Staates": "Конституция национал-социалистического государства",
  "Die Urteile gegen NS-Verbrecher": "Приговоры нацистским преступникам",
  "Sie entrechteten jüdische Deutsche systematisch. Die Nürnberger *Prozesse* nach 1945 sind etwas völlig anderes.":
    "Они последовательно лишали немецких евреев прав. Нюрнбергские *процессы* после 1945 года — нечто совершенно иное.",
  "Wie viele Juden wurden im Nationalsozialismus ermordet?":
    "Сколько евреев было убито при национал-социализме?",
  "Etwa 600.000": "Около 600 000",
  "Etwa sechs Millionen": "Около шести миллионов",
  "Etwa 60.000": "Около 60 000",
  "Etwa 16 Millionen": "Около 16 миллионов",
  "Etwa sechs Millionen europäische Juden. Ermordet wurden außerdem Sinti und Roma, Menschen mit Behinderung und viele andere Gruppen.":
    "Около шести миллионов европейских евреев. Убиты были также синти и рома, люди с ограниченными возможностями и многие другие группы.",
  "Welche Gruppen wurden im Nationalsozialismus neben den Juden verfolgt?":
    "Какие группы преследовали при национал-социализме помимо евреев?",
  "Nur politische Gegner": "Только политических противников",
  "Sinti und Roma, Menschen mit Behinderung, politische Gegner und weitere Gruppen":
    "Синти и рома, людей с ограниченными возможностями, политических противников и другие группы",
  "Ausschließlich Kriegsgefangene": "Исключительно военнопленных",
  "Niemand sonst": "Никого больше",
  "Die Verfolgung traf viele Gruppen — nach rassistischen, politischen und weltanschaulichen Kriterien.":
    "Преследование затронуло множество групп — по расовым, политическим и мировоззренческим признакам.",
  "Was ist in Deutschland strafbar?": "Что в Германии наказуемо?",
  "Die Regierung zu kritisieren": "Критиковать правительство",
  "Den Holocaust öffentlich zu leugnen": "Прилюдно отрицать Холокост",
  "An einer Demonstration teilzunehmen": "Участвовать в демонстрации",
  "Eine Partei zu gründen": "Основать партию",
  "Holocaustleugnung ist Volksverhetzung und strafbar. Regierungskritik, Demonstrationen und Parteigründungen sind dagegen Grundrechte.":
    "Отрицание Холокоста является разжиганием ненависти и наказуемо. Критика правительства, демонстрации и основание партий, напротив, суть основные права.",
  "Was war das Besondere an den Nürnberger Prozessen?":
    "Чем были особенны Нюрнбергские процессы?",
  "Sie fanden vor einem deutschen Gericht statt": "Они шли перед немецким судом",
  "Erstmals wurden Staatsführer persönlich für Kriegsverbrechen zur Verantwortung gezogen":
    "Впервые руководителей государства лично привлекли к ответу за военные преступления",
  "Alle Angeklagten wurden freigesprochen": "Все подсудимые были оправданы",
  "Sie führten zur Gründung der Bundesrepublik":
    "Они привели к основанию Федеративной Республики",
  "1945/46 klagten die Alliierten führende Nationalsozialisten an — die Geburtsstunde des modernen Völkerstrafrechts.":
    "В 1945–1946 годах союзники предъявили обвинение руководящим национал-социалистам — час рождения современного международного уголовного права.",
  "Was ist am 27. Januar in Deutschland?": "Что отмечают в Германии 27 января?",
  "Der Gedenktag für die Opfer des Nationalsozialismus": "День памяти жертв национал-социализма",
  "Der Tag des Grundgesetzes": "День Основного закона",
  "Am 27. Januar 1945 wurde Auschwitz befreit. Seitdem ist der Tag deutschlandweiter Gedenktag.":
    "27 января 1945 года был освобождён Освенцим. С тех пор этот день является общегерманским днём памяти.",
  "Wie verhält sich Deutschland heute zu seiner NS-Vergangenheit?":
    "Как Германия относится сегодня к своему национал-социалистическому прошлому?",
  "Sie wird nicht mehr thematisiert": "О нём больше не говорят",
  "Sie wird in Gedenkstätten, Schulen und Gedenktagen bewusst wachgehalten":
    "Его сознательно держат живым в мемориалах, школах и днях памяти",
  "Sie ist nur in Fachbüchern nachzulesen": "О нём можно прочесть только в специальных книгах",
  "Sie darf nicht öffentlich besprochen werden": "Обсуждать его прилюдно нельзя",
  "Erinnerungskultur ist Teil des Selbstverständnisses: Gedenkstätten, Unterricht, Gedenktage und eine besondere Verantwortung gegenüber Israel.":
    "Культура памяти — часть самопонимания страны: мемориалы, уроки, дни памяти и особая ответственность перед Израилем.",
  "Wann wurde die Bundesrepublik Deutschland gegründet?":
    "Когда была основана Федеративная Республика Германия?",
  "1949, mit dem Inkrafttreten des Grundgesetzes am 23. Mai. Im selben Jahr entstand im Osten die DDR.":
    "В 1949 году, со вступлением в силу Основного закона 23 мая. В том же году на востоке возникла ГДР.",
  "Wann wurde die DDR gegründet?": "Когда была основана ГДР?",
  "Am 7. Oktober 1949": "7 октября 1949 года",
  "7. Oktober 1949, rund viereinhalb Monate nach der Bundesrepublik.":
    "7 октября 1949 года, примерно через четыре с половиной месяца после Федеративной Республики.",
  "Was war das „Wirtschaftswunder“?": "Что такое «экономическое чудо»?",
  "Der schnelle wirtschaftliche Aufschwung der Bundesrepublik in den 1950er Jahren":
    "Быстрый хозяйственный подъём Федеративной Республики в 1950-е годы",
  "Die Einführung des Euro": "Введение евро",
  "Der Wiederaufbau der DDR": "Восстановление ГДР",
  "Die Entdeckung von Rohstoffen": "Открытие полезных ископаемых",
  "Nach der Zerstörung wuchs die westdeutsche Wirtschaft rasant; Vollbeschäftigung und steigender Wohlstand prägten das Jahrzehnt.":
    "После разрушений западногерманское хозяйство росло стремительно; полная занятость и растущее благосостояние определили это десятилетие.",
  "Warum kamen ab 1955 „Gastarbeiter“ nach Westdeutschland?":
    "Почему с 1955 года в Западную Германию приезжали «гастарбайтеры»?",
  "Weil Arbeitskräfte fehlten": "Потому что не хватало рабочих рук",
  "Weil die Bevölkerung zu groß geworden war": "Потому что население стало слишком большим",
  "Weil die DDR sie schickte": "Потому что их посылала ГДР",
  "Weil die Alliierten es verlangten": "Потому что этого требовали союзники",
  "Die wachsende Wirtschaft brauchte Arbeitskräfte. Angeworben wurde in Italien, Spanien, Griechenland, der Türkei und weiteren Ländern.":
    "Растущему хозяйству нужны были рабочие руки. Их набирали в Италии, Испании, Греции, Турции и других странах.",
  "Was war der Marshallplan?": "Что такое план Маршалла?",
  "Ein Plan zur Teilung Deutschlands": "План раздела Германии",
  "Ein amerikanisches Hilfsprogramm für den Wiederaufbau":
    "Американская программа помощи для восстановления",
  "Der Plan für die Berliner Mauer": "План берлинской стены",
  "Ein Abkommen über Reparationen": "Соглашение о возмещениях",
  "Ab 1948 halfen die USA westeuropäischen Staaten mit Krediten und Warenlieferungen beim Wiederaufbau.":
    "С 1948 года США помогали западноевропейским государствам кредитами и поставками товаров при восстановлении.",
  "Welche Wirtschaftsordnung galt in der Bundesrepublik?":
    "Какой хозяйственный строй действовал в Федеративной Республике?",
  "Die Planwirtschaft": "Плановое хозяйство",
  "Die soziale Marktwirtschaft": "Социальное рыночное хозяйство",
  "Die reine freie Marktwirtschaft ohne Regeln":
    "Чистое свободное рыночное хозяйство без правил",
  "Die Staatswirtschaft": "Государственное хозяйство",
  "Soziale Marktwirtschaft: freier Wettbewerb, aber mit sozialem Ausgleich. Die DDR hatte dagegen Planwirtschaft.":
    "Социальное рыночное хозяйство: свободное соперничество, но с социальным выравниванием. В ГДР, напротив, было плановое хозяйство.",
  "Welche Partei bestimmte in der DDR die Politik?": "Какая партия определяла политику в ГДР?",
  "Die CDU": "ХДС",
  "Die SED": "СЕПГ",
  "Die SPD": "СДПГ",
  "Die FDP": "СвДП",
  "Die Sozialistische Einheitspartei Deutschlands hatte den Führungsanspruch. Andere Parteien existierten nur ohne echte Macht.":
    "Социалистическая единая партия Германии притязала на руководство. Другие партии существовали, но без настоящей власти.",
  "Wie hieß das Parlament der DDR?": "Как назывался парламент ГДР?",
  "Volkskammer": "Народная палата",
  "Reichstag": "Рейхстаг",
  "Die Volkskammer. Frei gewählt wurde sie erst ein einziges Mal, im März 1990.":
    "Народная палата. Свободно её избрали лишь однажды, в марте 1990 года.",
  "Was geschah am 17. Juni 1953 in der DDR?": "Что произошло в ГДР 17 июня 1953 года?",
  "Ein Aufstand wurde mit sowjetischen Panzern niedergeschlagen":
    "Восстание было подавлено советскими танками",
  "Die DDR wurde gegründet": "Была основана ГДР",
  "Die ersten freien Wahlen fanden statt": "Прошли первые свободные выборы",
  "Aus Streiks gegen höhere Arbeitsnormen wurde ein Aufstand gegen die Regierung. Bis 1990 war der 17. Juni westdeutscher Nationalfeiertag.":
    "Из забастовок против повышенных норм выработки выросло восстание против правительства. До 1990 года 17 июня было западногерманским национальным праздником.",
  "Warum wurde die Berliner Mauer gebaut?": "Зачем была построена берлинская стена?",
  "Um Angriffe aus dem Westen abzuwehren": "Чтобы отражать нападения с запада",
  "Um die eigene Bevölkerung an der Flucht zu hindern":
    "Чтобы помешать бегству собственного населения",
  "Um die Stadt vor Hochwasser zu schützen": "Чтобы защитить город от наводнения",
  "Immer mehr Menschen verließen die DDR. Die Mauer hielt niemanden draußen, sondern die eigenen Bürger drinnen.":
    "Всё больше людей покидало ГДР. Стена никого не держала снаружи — она держала внутри собственных граждан.",
  "Was können Betroffene heute mit ihrer Stasi-Akte tun?":
    "Что пострадавшие могут сегодня сделать со своим делом в архиве Штази?",
  "Nichts, die Akten sind vernichtet": "Ничего, дела уничтожены",
  "Sie können Einsicht beantragen und ihre Akte lesen":
    "Они могут подать заявление и прочесть своё дело",
  "Nur Historiker dürfen sie einsehen": "Смотреть их могут только историки",
  "Sie sind bis 2050 gesperrt": "Они закрыты до 2050 года",
  "Wer überwacht wurde, darf die eigene Akte lesen. Die Aufarbeitung gehört zum Umgang mit der SED-Diktatur.":
    "Кто был под наблюдением, вправе прочесть собственное дело. Разбор прошлого входит в то, как обходятся с диктатурой СЕПГ.",
  "Wie wurde in der DDR gewählt?": "Как голосовали в ГДР?",
  "Frei zwischen mehreren Parteien": "Свободно, между несколькими партиями",
  "Mit einer Einheitsliste, ohne echte Auswahl": "По единому списку, без настоящего выбора",
  "Nur in den Städten": "Только в городах",
  "Es gab Wahlen, aber keine Alternativen: Die Einheitsliste stand fest, echte Auswahl gab es nicht.":
    "Выборы были, но выбора не было: единый список стоял заранее, настоящей возможности выбрать не существовало.",
  "Welcher Ruf prägte die Montagsdemonstrationen 1989?":
    "Какой возглас определил понедельничные демонстрации 1989 года?",
  "„Freiheit für alle“": "«Свободу всем»",
  "„Wir sind das Volk“": "«Мы — народ»",
  "„Nie wieder Krieg“": "«Больше никогда войны»",
  "„Einigkeit und Recht“": "«Единство и право»",
  "„Wir sind das Volk“ — wörtlich der Gedanke aus Artikel 20 des Grundgesetzes, den die DDR nur behauptete.":
    "«Мы — народ» — дословно мысль из статьи 20 Основного закона, на которую ГДР только притязала.",
  "In welcher Stadt waren die Montagsdemonstrationen 1989 besonders bedeutsam?":
    "В каком городе понедельничные демонстрации 1989 года были особенно значимы?",
  "Dresden": "Дрезден",
  "Rostock": "Росток",
  "Erfurt": "Эрфурт",
  "In Leipzig, ausgehend von den Friedensgebeten in der Nikolaikirche, wuchsen die Demonstrationen auf Hunderttausende an.":
    "В Лейпциге, где из молитв о мире в церкви святого Николая демонстрации выросли до сотен тысяч человек.",
  "Wer war zur Zeit der Wiedervereinigung Bundeskanzler?":
    "Кто был федеральным канцлером во время воссоединения?",
  "Helmut Schmidt": "Гельмут Шмидт",
  "Gerhard Schröder": "Герхард Шрёдер",
  "Helmut Kohl, Bundeskanzler von 1982 bis 1998, gilt deshalb als „Kanzler der Einheit“.":
    "Гельмут Коль, федеральный канцлер с 1982 по 1998 год, и потому его называют «канцлером единства».",
  "Was regelte der Zwei-plus-Vier-Vertrag?": "Что урегулировал договор «два плюс четыре»?",
  "Die Aufteilung Berlins in vier Sektoren": "Раздел Берлина на четыре сектора",
  "Die volle Souveränität des vereinten Deutschlands und die Bestätigung seiner Grenzen":
    "Полный суверенитет объединённой Германии и подтверждение её границ",
  "Den Beitritt zur NATO": "Вступление в НАТО",
  "Die beiden deutschen Staaten und die vier Siegermächte einigten sich 1990 darauf — die außenpolitische Voraussetzung der Einheit.":
    "Два немецких государства и четыре державы-победительницы договорились об этом в 1990 году — внешнеполитическое условие единства.",
  "Wann zogen Bundestag und Bundesregierung nach Berlin um?":
    "Когда Бундестаг и федеральное правительство переехали в Берлин?",
  "2005": "2005",
  "Sie sind in Bonn geblieben": "Они остались в Бонне",
  "1999. Berlin war schon 1990 wieder Hauptstadt, der Umzug von Parlament und Regierung folgte neun Jahre später.":
    "В 1999 году. Берлин снова стал столицей ещё в 1990 году, а переезд парламента и правительства последовал девятью годами позже.",
  "Wie kam die staatliche Einheit 1990 zustande?":
    "Как в 1990 году сложилось государственное единство?",
  "Durch einen Krieg": "Через войну",
  "Durch den Beitritt der DDR zur Bundesrepublik":
    "Через присоединение ГДР к Федеративной Республике",
  "Durch eine Entscheidung der Vereinten Nationen":
    "Через решение Организации Объединённых Наций",
  "Durch eine Volksabstimmung in beiden Staaten":
    "Через всенародное голосование в обоих государствах",
  "Die DDR trat der Bundesrepublik bei; das Grundgesetz galt fortan für ganz Deutschland.":
    "ГДР присоединилась к Федеративной Республике; Основной закон стал с тех пор действовать на всю Германию.",
  "Wie viele Mitgliedstaaten hat die Europäische Union heute?":
    "Сколько государств входит сегодня в Европейский союз?",
  "27": "27",
  "31": "31",
  "50": "50",
  "27 — seit dem Austritt des Vereinigten Königreichs im Jahr 2020.":
    "27 — после выхода Соединённого Королевства в 2020 году.",
  "Welche Währung galt in Deutschland vor dem Euro?":
    "Какая валюта действовала в Германии до евро?",
  "Der Schilling": "Шиллинг",
  "Die D-Mark": "Немецкая марка",
  "Der Franken": "Франк",
  "Die Reichsmark": "Рейхсмарка",
  "Die Deutsche Mark, eingeführt 1948 und 2002 vom Euro-Bargeld abgelöst.":
    "Немецкая марка, введённая в 1948 году и сменённая наличным евро в 2002-м.",
  "Was bedeutet Freizügigkeit in der EU?":
    "Что означает свобода передвижения в Европейском союзе?",
  "Waren sind zollfrei": "Товары не облагаются пошлиной",
  "EU-Bürger dürfen in jedem Mitgliedstaat leben und arbeiten":
    "Граждане Европейского союза могут жить и работать в любом государстве-члене",
  "Man darf überall Auto fahren": "Ездить на машине можно везде",
  "Es gibt keine Steuern zwischen den Ländern": "Между странами нет налогов",
  "Personenfreizügigkeit: leben und arbeiten, wo man möchte — eine der Grundfreiheiten des Binnenmarktes.":
    "Свобода передвижения людей: жить и работать там, где хочешь — одна из основных свобод общего рынка.",
  "Wie oft wird das Europäische Parlament gewählt?": "Как часто избирают Европейский парламент?",
  "Alle fünf Jahre, direkt von den Bürgerinnen und Bürgern. Der Bundestag wird dagegen alle vier Jahre gewählt.":
    "Каждые пять лет, прямым голосованием граждан. Бундестаг, напротив, избирают каждые четыре года.",
  "Welche Organisation ist ein Verteidigungsbündnis?":
    "Какая организация является оборонительным союзом?",
  "Der Europarat": "Совет Европы",
  "Die Vereinten Nationen": "Организация Объединённых Наций",
  "Die NATO ist das Verteidigungsbündnis. Die EU ist ein politischer und wirtschaftlicher Zusammenschluss, der Europarat kümmert sich um Menschenrechte.":
    "Оборонительный союз — это НАТО. Европейский союз есть политическое и хозяйственное объединение, а Совет Европы занимается правами человека.",
  "Was bedeutet es, dass die Bundeswehr eine „Parlamentsarmee“ ist?":
    "Что означает, что бундесвер является «парламентской армией»?",
  "Abgeordnete dienen als Soldaten": "Депутаты служат солдатами",
  "Über Auslandseinsätze entscheidet der Bundestag": "О заграничных походах решает Бундестаг",
  "Die Armee untersteht dem Bundespräsidenten": "Армия подчинена федеральному президенту",
  "Soldaten dürfen nicht wählen": "Солдатам нельзя голосовать",
  "Kein Auslandseinsatz ohne Zustimmung des Bundestages — die Kontrolle liegt beim Parlament, nicht allein bei der Regierung.":
    "Никакого заграничного похода без согласия Бундестага — надзор лежит на парламенте, а не на одном правительстве.",
  "Wie heißt die Hauptstadt Deutschlands?": "Как называется столица Германии?",
  "Bonn": "Бонн",
  "Hamburg": "Гамбург",
  "Berlin — seit 1990 wieder Hauptstadt, seit 1999 auch Sitz von Parlament und Regierung. Bonn war es bis dahin.":
    "Берлин — снова столица с 1990 года, а с 1999 и местопребывание парламента и правительства. До того им был Бонн.",
  "Welche Stadt ist nach Berlin die zweitgrößte Deutschlands?":
    "Какой город второй по величине в Германии после Берлина?",
  "Köln": "Кёльн",
  "Frankfurt am Main": "Франкфурт-на-Майне",
  "Hamburg, gefolgt von München und Köln.": "Гамбург, а за ним Мюнхен и Кёльн.",
  "An welche zwei Meere grenzt Deutschland?": "К каким двум морям выходит Германия?",
  "Nordsee und Ostsee": "К Северному и Балтийскому",
  "Nordsee und Mittelmeer": "К Северному и Средиземному",
  "Ostsee und Schwarzes Meer": "К Балтийскому и Чёрному",
  "Atlantik und Nordsee": "К Атлантике и Северному морю",
  "Im Nordwesten die Nordsee, im Nordosten die Ostsee.":
    "На северо-западе Северное море, на северо-востоке Балтийское.",
  "Welcher große deutsche Fluss fließt nach Osten ins Schwarze Meer?":
    "Какая большая немецкая река течёт на восток, в Чёрное море?",
  "Die Weser": "Везер",
  "Die Donau ist der einzige große Fluss Deutschlands, der nach Osten fließt. Rhein, Elbe und Weser münden in die Nordsee.":
    "Дунай — единственная большая река Германии, текущая на восток. Рейн, Эльба и Везер впадают в Северное море.",
  "Wie heißt das Wappentier der Bundesrepublik Deutschland?":
    "Какое животное изображено в гербе Федеративной Республики Германия?",
  "Der Löwe": "Лев",
  "Der Bundesadler": "Федеральный орёл",
  "Der Bär": "Медведь",
  "Das Pferd": "Конь",
  "Der Bundesadler. Der Bär ist das Wappentier Berlins, nicht des Bundes.":
    "Федеральный орёл. Медведь — герб Берлина, а не федерации.",
  "Wie viele Menschen leben ungefähr in Deutschland?":
    "Сколько примерно человек живёт в Германии?",
  "Etwa 50 Millionen": "Около 50 миллионов",
  "Etwa 84 Millionen": "Около 84 миллионов",
  "Etwa 120 Millionen": "Около 120 миллионов",
  "Etwa 30 Millionen": "Около 30 миллионов",
  "Rund 84 Millionen — damit ist Deutschland der bevölkerungsreichste Staat der Europäischen Union.":
    "Около 84 миллионов — тем самым Германия самое многолюдное государство Европейского союза.",
  "Welche zwei christlichen Kirchen sind in Deutschland am größten?":
    "Какие две христианские церкви самые большие в Германии?",
  "Die orthodoxe und die anglikanische": "Православная и англиканская",
  "Die katholische und die evangelische": "Католическая и евангелическая",
  "Die evangelische und die orthodoxe": "Евангелическая и православная",
  "Die katholische und die anglikanische": "Католическая и англиканская",
  "Die katholische und die evangelische Kirche. Etwa die Hälfte der Bevölkerung gehört heute gar keiner Religionsgemeinschaft an.":
    "Католическая и евангелическая церковь. Около половины населения сегодня не принадлежит ни к какой религиозной общине.",
  "Darf man in Deutschland aus der Kirche austreten?": "Можно ли в Германии выйти из церкви?",
  "Nein, die Mitgliedschaft ist lebenslang": "Нет, членство пожизненно",
  "Ja, jederzeit": "Да, в любое время",
  "Nur mit Zustimmung der Gemeinde": "Только с согласия общины",
  "Nur einmal im Leben": "Только один раз в жизни",
  "Der Austritt ist jederzeit möglich; danach entfällt auch die Kirchensteuer. Religionsfreiheit schließt die Freiheit ein, keiner Religion anzugehören.":
    "Выйти можно в любое время; после этого отпадает и церковный налог. Свобода вероисповедания включает свободу не принадлежать ни к какой религии.",
  "Wie ist der Staat in Deutschland gegenüber Religionen eingestellt?":
    "Как государство в Германии относится к религиям?",
  "Er bevorzugt die christlichen Kirchen": "Оно отдаёт предпочтение христианским церквям",
  "Er ist weltanschaulich neutral": "Оно мировоззренчески беспристрастно",
  "Er lehnt Religion ab": "Оно отвергает религию",
  "Er schreibt eine Staatsreligion vor": "Оно предписывает государственную религию",
  "Weltanschauliche Neutralität: Der Staat hat keine eigene Religion und bevorzugt keine Gemeinschaft.":
    "Мировоззренческая беспристрастность: у государства нет собственной религии и оно не отдаёт предпочтения ни одной общине.",
  "Wer zahlt Kirchensteuer?": "Кто платит церковный налог?",
  "Alle Steuerzahler": "Все налогоплательщики",
  "Nur Mitglieder einer steuererhebenden Religionsgemeinschaft":
    "Только члены религиозной общины, которая его взимает",
  "Nur Selbstständige": "Только работающие на себя",
  "Niemand, das ist abgeschafft": "Никто, он отменён",
  "Nur Mitglieder. Wer austritt oder keiner Gemeinschaft angehört, zahlt sie nicht.":
    "Только члены. Кто вышел или не принадлежит ни к какой общине, его не платит.",
  "Was gilt für religiöse Gemeinschaften in Deutschland?":
    "Что действует для религиозных общин в Германии?",
  "Sie dürfen eigene Gerichte mit verbindlichen Urteilen einrichten":
    "Они могут учреждать собственные суды с обязательными решениями",
  "Sie müssen sich an die staatlichen Gesetze halten":
    "Они обязаны соблюдать государственные законы",
  "Sie stehen über dem staatlichen Recht": "Они стоят выше государственного права",
  "Sie brauchen eine Erlaubnis des Bundespräsidenten":
    "Им нужно разрешение федерального президента",
  "Religionsausübung ist frei, aber das staatliche Recht gilt für alle. Parallele Rechtsprechung mit verbindlicher Wirkung gibt es nicht.":
    "Отправление религии свободно, но государственное право действует для всех. Параллельного правосудия с обязательной силой не существует.",
  "Welches Fach können Schüler wählen, die nicht am Religionsunterricht teilnehmen?":
    "Какой предмет могут выбрать ученики, не посещающие уроки религии?",
  "Ethik oder Philosophie": "Этику или философию",
  "Eine zweite Fremdsprache": "Второй иностранный язык",
  "Gar keins": "Никакого",
  "Als Alternative wird meist Ethik oder Philosophie angeboten. Die Teilnahme am Religionsunterricht ist freiwillig.":
    "Как замену чаще всего предлагают этику или философию. Посещение уроков религии добровольно.",
  "Ab welchem Alter darf man in Deutschland heiraten?":
    "С какого возраста в Германии можно вступать в брак?",
  "Es gibt keine Altersgrenze": "Возрастной границы нет",
  "Ab der Volljährigkeit mit 18. Ehen mit Minderjährigen werden in Deutschland nicht anerkannt.":
    "С наступлением совершеннолетия в 18 лет. Браки с несовершеннолетними в Германии не признают.",
  "Wo wird in Deutschland rechtsgültig geheiratet?":
    "Где в Германии заключают брак, имеющий силу?",
  "In der Kirche": "В церкви",
  "Beim Standesamt": "В Standesamt, отделе записи актов",
  "Beim Notar": "У нотариуса",
  "Beim Familiengericht": "В суде по семейным делам",
  "Nur die standesamtliche Eheschließung ist rechtsgültig. Eine religiöse Zeremonie kann hinzukommen, ersetzt sie aber nicht.":
    "Силу имеет только брак, заключённый в Standesamt. Религиозный обряд может добавиться, но его не заменяет.",
  "Was gilt in Deutschland vor einer Scheidung in der Regel?":
    "Что в Германии обычно требуется перед разводом?",
  "Eine Wartezeit von einem Monat": "Ожидание в один месяц",
  "Ein Trennungsjahr": "Год раздельного проживания",
  "Die Zustimmung beider Familien": "Согласие обеих семей",
  "Eine Genehmigung der Kirche": "Разрешение церкви",
  "Meist muss ein Trennungsjahr vergangen sein. Über die Scheidung entscheidet das Familiengericht.":
    "Чаще всего должен пройти год раздельного проживания. О разводе решает суд по семейным делам.",
  "Seit wann dürfen in Deutschland auch gleichgeschlechtliche Paare heiraten?":
    "С какого времени в Германии могут вступать в брак и однополые пары?",
  "Seit 2001": "С 2001 года",
  "Seit 2017": "С 2017 года",
  "Das ist nicht möglich": "Это невозможно",
  "Seit 2017 steht die Ehe allen Paaren offen. Zuvor gab es seit 2001 die eingetragene Lebenspartnerschaft.":
    "С 2017 года брак открыт всем парам. До того, с 2001 года, было зарегистрированное партнёрство.",
  "Welche Behörde hilft, wenn das Wohl eines Kindes gefährdet ist?":
    "Какое ведомство помогает, если благополучию ребёнка что-то угрожает?",
  "Das Ordnungsamt": "Ведомство общественного порядка",
  "Das Jugendamt": "Ведомство по делам молодёжи",
  "Das Standesamt": "Standesamt, отдел записи актов",
  "Das Einwohnermeldeamt": "Ведомство регистрации жителей",
  "Das Jugendamt unterstützt Familien und schützt Kinder vor Gewalt und Vernachlässigung.":
    "Ведомство по делам молодёжи поддерживает семьи и защищает детей от насилия и заброшенности.",
  "Eine Frau wird von ihrem Ehemann geschlagen. Was gilt in Deutschland?":
    "Женщину бьёт муж. Что действует в Германии?",
  "Das ist Privatsache der Familie": "Это частное дело семьи",
  "Das ist eine Straftat, und sie kann Hilfe und Schutz bekommen":
    "Это преступление, и она может получить помощь и защиту",
  "Nur bei schweren Verletzungen greift der Staat ein":
    "Государство вмешивается только при тяжких увечьях",
  "Sie muss zuerst die Scheidung einreichen": "Ей сначала нужно подать на развод",
  "Gewalt in der Ehe ist eine Straftat. Die Polizei kann den Täter der Wohnung verweisen; Frauenhäuser und das Hilfetelefon helfen sofort.":
    "Насилие в браке является преступлением. Полиция может выдворить виновного из жилья; приюты для женщин и телефон помощи помогают немедленно.",
  "Ab welchem Alter beginnt in Deutschland üblicherweise die Schulpflicht?":
    "С какого возраста в Германии обычно начинается обязательное школьное обучение?",
  "Mit vier Jahren": "С четырёх лет",
  "Mit sechs Jahren": "С шести лет",
  "Mit acht Jahren": "С восьми лет",
  "Mit zehn Jahren": "С десяти лет",
  "In der Regel mit sechs Jahren, und sie dauert mindestens neun Schuljahre.":
    "Как правило с шести лет, и длится оно не менее девяти школьных лет.",
  "Wie lange dauert die Grundschule in den meisten Bundesländern?":
    "Сколько длится начальная школа в большинстве федеральных земель?",
  "Zwei Jahre": "Два года",
  "Meist vier Jahre; in Berlin und Brandenburg sind es sechs. Auch das ist Ländersache.":
    "Чаще всего четыре года; в Берлине и Бранденбурге шесть. Это тоже дело земель.",
  "Was ist BAföG?": "Что такое BAföG?",
  "Eine Prüfung am Ende der Schule": "Экзамен в конце школы",
  "Eine staatliche Unterstützung für Schüler und Studierende":
    "Государственная поддержка школьников и студентов",
  "Ein Zuschuss für Auszubildende vom Betrieb": "Надбавка ученикам от предприятия",
  "Eine Gebühr für das Studium": "Плата за учёбу в вузе",
  "Staatliche Ausbildungsförderung für alle, deren Eltern die Ausbildung nicht finanzieren können.":
    "BAföG — государственная поддержка образования для всех, чьи родители не могут его оплатить.",
  "Wer nimmt am Ende einer dualen Ausbildung die Abschlussprüfung ab?":
    "Кто принимает выпускной экзамен в конце двойного профессионального обучения?",
  "Die Berufsschule allein": "Одна только профессиональная школа",
  "Die Industrie- und Handelskammer oder die Handwerkskammer":
    "Промышленно-торговая палата или ремесленная палата",
  "Das Kultusministerium": "Министерство просвещения земли",
  "Der Ausbildungsbetrieb selbst": "Само предприятие, где шло обучение",
  "Die Kammern prüfen — deshalb ist der Abschluss bundesweit vergleichbar und nicht vom einzelnen Betrieb abhängig.":
    "Экзамен принимают палаты — поэтому диплом сопоставим по всей стране и не зависит от отдельного предприятия.",
  "Du hast im Ausland einen Beruf erlernt. Was kannst du in Deutschland tun?":
    "Ты получил профессию за границей. Что можно сделать в Германии?",
  "Nichts, der Abschluss gilt hier nicht": "Ничего, здешней силы этот диплом не имеет",
  "Du kannst deinen Abschluss anerkennen lassen": "Можно добиться признания своего диплома",
  "Du musst die Ausbildung komplett wiederholen": "Нужно полностью пройти обучение заново",
  "Du darfst nur als Hilfskraft arbeiten": "Работать можно только подсобным работником",
  "Es gibt ein Anerkennungsverfahren. Gerade in Pflege, Handwerk und technischen Berufen ist es der Schlüssel zum Arbeitsmarkt.":
    "Существует порядок признания. Особенно в уходе, ремесле и технических профессиях это ключ к рынку труда.",
  "Ab wann haben Kinder in Deutschland einen Anspruch auf einen Kita-Platz?":
    "С какого времени у детей в Германии есть право на место в детском саду?",
  "Ab der Geburt": "С рождения",
  "Ab dem ersten Geburtstag": "С первого дня рождения",
  "Ab drei Jahren": "С трёх лет",
  "Es gibt keinen Anspruch": "Такого права нет",
  "Ab dem vollendeten ersten Lebensjahr besteht ein Rechtsanspruch auf einen Betreuungsplatz.":
    "С исполнения одного года есть закреплённое законом право на место в детском учреждении.",
  "Wie viele Urlaubstage stehen bei einer Fünf-Tage-Woche mindestens zu?":
    "Сколько дней отпуска полагается как минимум при пятидневной рабочей неделе?",
  "10 Tage": "10 дней",
  "20 Tage": "20 дней",
  "30 Tage": "30 дней",
  "Es gibt kein Minimum": "Минимума нет",
  "Das gesetzliche Minimum sind 20 Arbeitstage im Jahr. Viele Verträge und Tarifverträge geben mehr.":
    "Законный минимум — 20 рабочих дней в году. Многие договоры и тарифные соглашения дают больше.",
  "In welcher Form muss eine Kündigung erfolgen?":
    "В какой форме должно быть подано увольнение?",
  "Mündlich genügt": "Достаточно устно",
  "Schriftlich": "Письменно",
  "Per E-Mail": "По электронной почте",
  "Per Telefonanruf": "По телефону",
  "Nur schriftlich mit eigenhändiger Unterschrift. Eine mündliche Kündigung oder eine E-Mail ist unwirksam.":
    "Только письменно, с собственноручной подписью. Устное увольнение или письмо по электронной почте силы не имеет.",
  "Was ist Schwarzarbeit?": "Что такое работа без оформления?",
  "Arbeit in der Nachtschicht": "Работа в ночную смену",
  "Arbeit ohne Anmeldung und ohne Sozialabgaben":
    "Работа без регистрации и без социальных отчислений",
  "Arbeit im Ausland": "Работа за границей",
  "Ehrenamtliche Arbeit": "Работа на добровольных началах",
  "Sie ist strafbar — und wer so arbeitet, hat weder Kranken- noch Rentenversicherung noch Kündigungsschutz.":
    "Она наказуема — и у того, кто так работает, нет ни медицинского, ни пенсионного страхования, ни защиты от увольнения.",
  "Was ist ein Tarifvertrag?": "Что такое тарифное соглашение?",
  "Ein Vertrag zwischen Arbeitnehmer und Arbeitgeber":
    "Договор между работником и работодателем",
  "Eine Vereinbarung zwischen Gewerkschaft und Arbeitgeberseite über Löhne und Arbeitsbedingungen":
    "Соглашение между профсоюзом и стороной работодателей об оплате и условиях труда",
  "Der Vertrag über die Sozialversicherung": "Договор о социальном страховании",
  "Ein Vertrag über Stromtarife": "Договор о тарифах на электричество",
  "Gewerkschaften und Arbeitgeberverbände handeln ihn kollektiv aus. Der einzelne Arbeitsvertrag steht davon getrennt.":
    "Профсоюзы и союзы работодателей заключают его сообща. Отдельный трудовой договор стоит от него особняком.",
  "Darf ein Arbeitgeber jemandem kündigen, weil er sich an einem Streik beteiligt hat?":
    "Может ли работодатель уволить человека за участие в забастовке?",
  "Nein, das Streikrecht ist geschützt": "Нет, право на забастовку защищено",
  "Nur bei längeren Streiks": "Только при долгих забастовках",
  "Nur in kleinen Betrieben": "Только на малых предприятиях",
  "Wer sich an einem gewerkschaftlich getragenen Streik beteiligt, darf dafür nicht gekündigt werden.":
    "Того, кто участвует в забастовке, объявленной профсоюзом, за это увольнять нельзя.",
  "Was bleibt vom Bruttolohn nach Abzug von Steuern und Sozialabgaben?":
    "Что остаётся от заработка после вычета налогов и социальных отчислений?",
  "Der Tariflohn": "Тарифная плата",
  "Der Nettolohn": "Чистый заработок",
  "Der Mindestlohn": "Наименьшая оплата труда",
  "Der Grundlohn": "Основной оклад",
  "Das Netto ist der Betrag, der auf dem Konto ankommt. Brutto ist der Lohn vor allen Abzügen.":
    "Чистый — это сумма, которая приходит на счёт. Валовой — заработок до всех вычетов.",
  "Was gehört in Deutschland in die Biotonne?":
    "Что в Германии кладут в бак для биологических отходов?",
  "Verpackungen aus Plastik": "Пластиковую упаковку",
  "Küchen- und Gartenabfälle": "Кухонные и садовые отходы",
  "Altpapier": "Макулатуру",
  "Glasflaschen": "Стеклянные бутылки",
  "Mülltrennung ist Pflicht: Bioabfall, Papier, Verpackungen, Restmüll und Glas nach Farben getrennt.":
    "Разделять мусор обязательно: биологические отходы, бумага, упаковка, остаточный мусор и стекло по цветам.",
  "Was ist Pfand?": "Что такое залог за тару?",
  "Eine Steuer auf Getränke": "Налог на напитки",
  "Ein Betrag, den man beim Kauf zahlt und bei Rückgabe der Flasche zurückbekommt":
    "Сумма, которую платят при покупке и получают назад, вернув бутылку",
  "Die Gebühr für die Mülltonne": "Плата за мусорный бак",
  "Ein Rabatt beim Einkauf": "Скидка при покупке",
  "Auf viele Flaschen und Dosen wird Pfand erhoben. Bei der Rückgabe im Laden bekommt man das Geld zurück.":
    "За многие бутылки и банки берут залог. При возврате в магазине деньги отдают обратно.",
  "Darf ein Vermieter die Wohnung betreten, wann er möchte?":
    "Может ли наймодатель входить в жильё когда захочет?",
  "Ja, ihm gehört die Wohnung": "Да, жильё принадлежит ему",
  "Nein, nur nach Ankündigung und mit einem berechtigten Grund":
    "Нет, только предупредив и имея обоснованный повод",
  "Ja, wenn er einen Schlüssel hat": "Да, если у него есть ключ",
  "Nur zusammen mit der Polizei": "Только вместе с полицией",
  "Die Wohnung ist geschützt. Ohne Ankündigung und triftigen Grund darf auch der Eigentümer nicht hinein.":
    "Жилище защищено. Без предупреждения и веского повода внутрь не вправе войти и собственник.",
  "Wann musst du ein Ticket für Bus oder Bahn haben?":
    "Когда нужно иметь билет на автобус или поезд?",
  "Erst wenn kontrolliert wird": "Только когда проверяют",
  "Vor dem Einsteigen": "До посадки",
  "Am Ende der Fahrt": "В конце поездки",
  "Nur zu Stoßzeiten": "Только в часы пик",
  "Das gültige Ticket braucht man vor dem Einsteigen. Fahren ohne Fahrschein kostet ein erhöhtes Beförderungsentgelt.":
    "Действующий билет нужен до посадки. Проезд без билета обходится в повышенную плату за перевозку.",
  "Welche Behörde ist für Aufenthaltstitel und Einbürgerung zuständig?":
    "Какое ведомство отвечает за вид на жительство и за приём в гражданство?",
  "Die Ausländerbehörde": "Ведомство по делам иностранцев",
  "Die Agentur für Arbeit": "Агентство по труду",
  "Die Ausländerbehörde. Das Bürgeramt macht die Meldung, das Finanzamt die Steuer, das Standesamt Heirat und Geburt.":
    "Ведомство по делам иностранцев. Ведомство по делам граждан ведает регистрацией, налоговое — налогами, Standesamt — браком и рождением.",
  "Was solltest du tun, bevor du einen Miet- oder Handyvertrag unterschreibst?":
    "Что стоит сделать, прежде чем подписать договор найма жилья или на мобильную связь?",
  "Sofort unterschreiben, um das Angebot zu sichern":
    "Подписать сразу, чтобы не упустить предложение",
  "Ihn lesen und bei Unklarheiten nachfragen oder dich beraten lassen":
    "Прочесть его и при неясностях переспросить или взять совет",
  "Nur den Preis prüfen": "Проверить только цену",
  "Ihn von einem Nachbarn unterschreiben lassen": "Дать подписать его соседу",
  "Eine Unterschrift bindet. Die Verbraucherzentrale und Mietervereine beraten günstig, wenn etwas unklar ist.":
    "Подпись связывает. Общество защиты потребителей и союзы нанимателей жилья советуют недорого, если что-то неясно.",
  "Welche Nummer wählst du in Deutschland, wenn du die Polizei brauchst?":
    "Какой номер набирают в Германии, если нужна полиция?",
  "911": "911",
  "110 für die Polizei, 112 für Notarzt und Feuerwehr. Beide sind kostenlos.":
    "110 для полиции, 112 для скорой помощи и пожарных. Оба бесплатны.",
  "Wer ist in Deutschland krankenversichert?": "Кто в Германии имеет медицинское страхование?",
  "Nur Berufstätige": "Только работающие",
  "Alle Menschen — die Krankenversicherung ist Pflicht":
    "Все люди — медицинское страхование обязательно",
  "Nur wer sich freiwillig versichert": "Только тот, кто страхуется добровольно",
  "Versicherungspflicht für alle: gesetzlich oder privat, aber niemand bleibt ohne Versicherung.":
    "Страхование обязательно для всех: государственное или частное, но без страхования не остаётся никто.",
  "Welche Versicherung zahlt Schäden, die du anderen zufügst?":
    "Какое страхование оплачивает вред, причинённый тобой другим?",
  "Die Hausratversicherung": "Страхование домашнего имущества",
  "Die Haftpflichtversicherung": "Страхование ответственности",
  "Die private Haftpflicht ist freiwillig, aber dringend zu empfehlen — sie deckt Schäden an fremdem Eigentum und an Personen.":
    "Частное страхование ответственности добровольно, но настоятельно рекомендуется — оно покрывает вред чужому имуществу и людям.",
  "Welche Versicherung ist für jedes Auto gesetzlich vorgeschrieben?":
    "Какое страхование предписано законом для каждого автомобиля?",
  "Die Vollkaskoversicherung": "Полное автострахование",
  "Die Kfz-Haftpflichtversicherung": "Страхование автогражданской ответственности",
  "Die Rechtsschutzversicherung": "Страхование судебных расходов",
  "Ohne Kfz-Haftpflicht darf kein Fahrzeug bewegt werden. Kasko ist dagegen freiwillig.":
    "Без страхования автогражданской ответственности ни одну машину нельзя тронуть с места. Полное страхование, напротив, добровольно.",
  "An wen wendest du dich außerhalb der Sprechzeiten bei einem Problem, das kein Notfall ist?":
    "К кому обращаться вне часов приёма при неотложном деле, которое не является чрезвычайным?",
  "An die 110": "По номеру 110",
  "An den ärztlichen Bereitschaftsdienst unter 116117":
    "К врачебной дежурной службе по номеру 116117",
  "An das Gesundheitsamt": "В ведомство здравоохранения",
  "An die Krankenkasse": "В медицинскую кассу",
  "116117 ist der ärztliche Bereitschaftsdienst. Die 112 bleibt echten Notfällen vorbehalten.":
    "116117 — это врачебная дежурная служба. Номер 112 остаётся для настоящих чрезвычайных случаев.",
  "Was musst du beim Arztbesuch dabeihaben?": "Что нужно иметь при себе на приёме у врача?",
  "Den Personalausweis": "Удостоверение личности",
  "Die Gesundheitskarte der Krankenkasse": "Карту здоровья от медицинской кассы",
  "Den Arbeitsvertrag": "Трудовой договор",
  "Die Steuernummer": "Налоговый номер",
  "Ohne Gesundheitskarte kann die Praxis die Behandlung nicht abrechnen — dann musst du unter Umständen selbst zahlen.":
    "Без карты здоровья практика не сможет выставить счёт за лечение — и тогда при известных обстоятельствах платить придётся самому.",
  "An welchen Tagen ist in Deutschland Weihnachten gesetzlicher Feiertag?":
    "В какие дни Рождество в Германии является установленным законом праздником?",
  "Am 24. und 25. Dezember": "24 и 25 декабря",
  "Am 25. und 26. Dezember": "25 и 26 декабря",
  "Nur am 24. Dezember": "Только 24 декабря",
  "Vom 24. bis 31. Dezember": "С 24 по 31 декабря",
  "Der 25. und 26. Dezember sind gesetzliche Feiertage. Heiligabend am 24. ist ein normaler Arbeitstag, meist mit verkürzten Zeiten.":
    "25 и 26 декабря — установленные законом праздники. Сочельник 24-го является обычным рабочим днём, чаще всего с укороченным временем.",
  "Wie finanziert sich der öffentlich-rechtliche Rundfunk in Deutschland?":
    "Как в Германии оплачивается общественно-правовое вещание?",
  "Aus Steuern": "Из налогов",
  "Über den Rundfunkbeitrag der Haushalte":
    "Через взнос на вещание, который платят домохозяйства",
  "Allein durch Werbung": "Одной только рекламой",
  "Durch Spenden": "Пожертвованиями",
  "Jeder Haushalt zahlt den Rundfunkbeitrag. Diese Finanzierung soll ARD und ZDF unabhängig von Regierung und Werbekunden halten.":
    "Взнос на вещание платит каждое домохозяйство. Такое устройство должно держать ARD и ZDF независимыми от правительства и от рекламодателей.",
  "Welcher deutsche Dichter schrieb den „Faust“?": "Какой немецкий поэт написал «Фауста»?",
  "Heinrich Heine": "Генрих Гейне",
  "Goethe. Schiller schrieb unter anderem „Wilhelm Tell“ und „Die Räuber“.":
    "Гёте. Шиллер написал, среди прочего, «Вильгельма Телля» и «Разбойников».",
  "Wofür ist Johannes Gutenberg bekannt?": "Чем известен Иоганн Гутенберг?",
  "Für die Entdeckung der Radioaktivität": "Открытием радиоактивности",
  "Für den Buchdruck mit beweglichen Lettern": "Книгопечатанием подвижными литерами",
  "Für den Bau des ersten Automobils": "Постройкой первого автомобиля",
  "Für die Relativitätstheorie": "Теорией относительности",
  "Gutenberg druckte im 15. Jahrhundert mit beweglichen Lettern. Carl Benz baute das Auto, Einstein entwickelte die Relativitätstheorie.":
    "Гутенберг печатал в XV веке подвижными литерами. Автомобиль построил Карл Бенц, теорию относительности создал Эйнштейн.",
  "Was ist ein Ehrenamt?": "Что такое почётная должность?",
  "Ein besonders gut bezahltes Amt": "Особенно хорошо оплачиваемая должность",
  "Eine freiwillige, unbezahlte Tätigkeit für die Allgemeinheit":
    "Добровольная неоплачиваемая работа на общее благо",
  "Ein politisches Wahlamt": "Выборная политическая должность",
  "Ein Ehrentitel für Verdienste": "Почётное звание за заслуги",
  "Millionen Menschen engagieren sich unbezahlt in Vereinen, bei der Feuerwehr oder in der Nachbarschaftshilfe.":
    "Миллионы людей работают безвозмездно в обществах, в пожарной дружине или помогая соседям.",
  "In welcher Stadt findet das Oktoberfest statt?": "В каком городе проходит Октоберфест?",
  "In Köln": "В Кёльне",
  "In München": "В Мюнхене",
  "In Stuttgart": "В Штутгарте",
  "In Berlin": "В Берлине",
  "In München. Karneval wird dagegen vor allem im Rheinland gefeiert, etwa in Köln und Düsseldorf.":
    "В Мюнхене. Карнавал, напротив, празднуют прежде всего в Рейнской области, например в Кёльне и Дюссельдорфе.",
  "Für wen gelten die Grundrechte in Deutschland?":
    "На кого распространяются основные права в Германии?",
  "Für alle Menschen in Deutschland, einige Rechte allerdings nur für Deutsche":
    "На всех людей в Германии, но некоторые права только на немцев",
  "Nur für Erwachsene": "Только на взрослых",
  "Nur für Menschen mit einem Aufenthaltstitel": "Только на людей с видом на жительство",
  "Die Menschenwürde und die meisten Grundrechte gelten für jeden. Einige wenige — etwa das Wahlrecht zum Bundestag — sind an die deutsche Staatsangehörigkeit gebunden.":
    "Достоинство человека и большинство основных прав действуют для каждого. Немногие — например право избирать в Бундестаг — привязаны к немецкому гражданству.",
  "Was bedeutet die Versammlungsfreiheit?": "Что означает свобода собраний?",
  "Man darf sich überall aufhalten": "Находиться можно где угодно",
  "Man darf sich friedlich und ohne Waffen versammeln, auch zu Demonstrationen":
    "Можно собираться мирно и без оружия, в том числе на демонстрации",
  "Man darf jederzeit Straßen blockieren": "Можно в любое время перекрывать улицы",
  "Man darf nur mit Genehmigung der Polizei demonstrieren":
    "Демонстрировать можно только с разрешения полиции",
  "Artikel 8 schützt friedliche Versammlungen. Unter freiem Himmel muss eine Demonstration angemeldet, aber nicht genehmigt werden.":
    "Статья 8 защищает мирные собрания. Под открытым небом демонстрацию нужно заявить, но разрешения на неё не требуется.",
  "Was schützt Artikel 13 des Grundgesetzes?": "Что защищает статья 13 Основного закона?",
  "Das Eigentum": "Собственность",
  "Die Unverletzlichkeit der Wohnung": "Неприкосновенность жилища",
  "Das Briefgeheimnis": "Тайну переписки",
  "Die Berufsfreiheit": "Свободу выбора занятия",
  "Die Wohnung ist geschützt: Durchsuchungen brauchen in der Regel eine richterliche Anordnung.":
    "Жилище защищено: для обыска, как правило, нужно распоряжение судьи.",
  "Darf der Staat in Deutschland eine Zeitung verbieten, weil sie ihn kritisiert?":
    "Может ли государство в Германии запретить газету за критику в свой адрес?",
  "Ja, bei scharfer Kritik": "Да, при резкой критике",
  "Nein, es gilt die Pressefreiheit und eine Zensur findet nicht statt":
    "Нет, действует свобода печати, и цензуры не существует",
  "Nur mit Zustimmung des Bundeskanzlers": "Только с согласия федерального канцлера",
  "Artikel 5 verbietet die Zensur ausdrücklich. Kritik an der Regierung ist die Aufgabe freier Presse, nicht ihr Vergehen.":
    "Статья 5 запрещает цензуру прямо. Критика правительства есть задача свободной печати, а не её провинность.",
  "Wer darf in Deutschland ein Gesetz für verfassungswidrig erklären?":
    "Кто в Германии может объявить закон противоречащим конституции?",
  "Der Bundestag mit einfacher Mehrheit": "Бундестаг простым большинством",
  "Nur das Bundesverfassungsgericht. Der Bundespräsident prüft beim Unterschreiben lediglich, ob ein Gesetz ordnungsgemäß zustande gekommen ist.":
    "Только Федеральный конституционный суд. Федеральный президент при подписании проверяет лишь то, надлежащим ли образом закон появился на свет.",
  "Was bedeutet es, dass die Grundrechte den Staat binden?":
    "Что означает, что основные права связывают государство?",
  "Der Staat muss alle Bürger finanziell unterstützen":
    "Государство обязано материально поддерживать всех граждан",
  "Gesetzgebung, Verwaltung und Gerichte müssen die Grundrechte beachten":
    "Законодательство, управление и суды обязаны соблюдать основные права",
  "Nur die Polizei muss sich daran halten": "Соблюдать их обязана только полиция",
  "Die Grundrechte gelten ausschließlich zwischen Privatpersonen":
    "Основные права действуют исключительно между частными лицами",
  "Artikel 1 Absatz 3: Die Grundrechte binden alle drei Gewalten unmittelbar. Sie sind kein Programmsatz, sondern geltendes Recht.":
    "Статья 1, часть 3: основные права связывают все три власти напрямую. Это не заявление о намерениях, а действующее право.",
  "Was gehört NICHT zu den Grundrechten?": "Что НЕ относится к основным правам?",
  "Die Glaubensfreiheit": "Свобода веры",
  "Das Recht auf einen kostenlosen Führerschein": "Право на бесплатные водительские права",
  "Die Freiheit der Person": "Свобода личности",
  "Einen Anspruch auf einen kostenlosen Führerschein gibt es nicht. Glaube, Beruf und persönliche Freiheit sind dagegen Grundrechte.":
    "Права на бесплатные водительские права не существует. Вера, занятие и личная свобода, напротив, суть основные права.",
  "Wie lange hast du Zeit für den Einbürgerungstest?":
    "Сколько времени даётся на тест для получения гражданства?",
  "30 Minuten": "30 минут",
  "60 Minuten": "60 минут",
  "90 Minuten": "90 минут",
  "Es gibt kein Zeitlimit": "Ограничения по времени нет",
  "60 Minuten für 33 Fragen — knapp zwei Minuten pro Frage, also genug Zeit zum Nachdenken.":
    "60 минут на 33 вопроса — почти по две минуты на вопрос, то есть времени на раздумье хватает.",
  "Wer kontrolliert in Deutschland die Regierung?":
    "Кто в Германии надзирает за правительством?",
  "Das Parlament, die Gerichte, die Presse und die Wähler":
    "Парламент, суды, печать и избиратели",
  "Nur die Polizei": "Только полиция",
  "Mehrere Instanzen zugleich: der Bundestag durch Anfragen und Ausschüsse, die Gerichte durch Urteile, die Presse durch Öffentlichkeit und die Wähler durch die nächste Wahl.":
    "Сразу несколько сторон: Бундестаг запросами и комитетами, суды решениями, печать оглаской, а избиратели на следующих выборах.",
  "Was ist mit „Volkssouveränität“ gemeint?": "Что имеют в виду под «народным суверенитетом»?",
  "Das Volk kann jederzeit Gesetze aufheben": "Народ может в любое время отменять законы",
  "Alle Staatsgewalt geht vom Volk aus": "Вся государственная власть исходит от народа",
  "Das Volk verwaltet die Steuern selbst": "Народ сам распоряжается налогами",
  "Jeder darf selbst entscheiden, welche Gesetze für ihn gelten":
    "Каждый может сам решать, какие законы для него действуют",
  "Artikel 20: Die Macht kommt vom Volk und wird durch Wahlen und die drei Gewalten ausgeübt — nicht durch Einzelentscheidungen jedes Bürgers.":
    "Статья 20: власть идёт от народа и осуществляется через выборы и три ветви власти — а не через отдельные решения каждого гражданина.",
  "Was ist eine Diktatur?": "Что такое диктатура?",
  "Ein Staat mit vielen Parteien": "Государство со многими партиями",
  "Ein Staat, in dem eine Person oder Gruppe ohne Kontrolle herrscht":
    "Государство, где один человек или группа правит без надзора",
  "Ein Staat mit einem Königshaus": "Государство с королевским домом",
  "Ein Staat ohne Steuern": "Государство без налогов",
  "Kennzeichen sind fehlende freie Wahlen, keine Gewaltenteilung, keine unabhängigen Gerichte und keine Meinungsfreiheit.":
    "Её признаки: нет свободных выборов, нет разделения властей, нет независимых судов и нет свободы мнения.",
  "Welcher Grundsatz macht Deutschland zu einem Rechtsstaat?":
    "Какое начало делает Германию правовым государством?",
  "Staatliches Handeln ist an Gesetz und Recht gebunden und gerichtlich überprüfbar":
    "Действия государства связаны законом и правом и могут быть проверены судом",
  "Gerichte entscheiden nach eigenem Ermessen": "Суды решают по собственному усмотрению",
  "Entscheidend ist die Überprüfbarkeit: Gegen jede staatliche Entscheidung kann man vor Gericht ziehen.":
    "Решает возможность проверки: на любое решение государства можно пойти в суд.",
  "Was passiert, wenn eine Partei die freiheitliche demokratische Grundordnung beseitigen will?":
    "Что происходит, если партия хочет устранить свободный демократический строй?",
  "Nichts, das ist von der Meinungsfreiheit gedeckt": "Ничего, это покрыто свободой мнения",
  "Das Bundesverfassungsgericht kann sie verbieten":
    "Федеральный конституционный суд может её запретить",
  "Der Bundeskanzler löst sie auf": "Федеральный канцлер её распускает",
  "Sie verliert automatisch ihre Zulassung": "Она сама собой теряет допуск",
  "Ein Parteiverbot ist möglich, aber ausschließlich durch das Bundesverfassungsgericht — damit keine Regierung ihre Gegner ausschalten kann.":
    "Запрет партии возможен, но исключительно через Федеральный конституционный суд — чтобы ни одно правительство не могло убрать своих противников.",
  "Wer schreibt in Deutschland die Gesetze?": "Кто в Германии пишет законы?",
  "Die Gerichte": "Суды",
  "Bundestag und Bundesrat": "Бундестаг и Бундесрат",
  "Die Gesetzgebung liegt bei Bundestag und Bundesrat. Gerichte wenden Gesetze an, sie machen sie nicht.":
    "Законодательство лежит на Бундестаге и Бундесрате. Суды законы применяют, а не создают.",
  "Was bedeutet „Republik“?": "Что означает «республика»?",
  "Das Staatsoberhaupt wird gewählt und regiert nicht auf Lebenszeit":
    "Главу государства избирают, и правит он не пожизненно",
  "Es gibt mehrere Bundesländer": "Есть несколько федеральных земель",
  "Der Staat erhebt keine Steuern": "Государство не взимает налогов",
  "Die Kirche ist vom Staat getrennt": "Церковь отделена от государства",
  "In einer Republik gibt es keinen Monarchen; das Staatsoberhaupt wird auf Zeit gewählt.":
    "В республике нет монарха; главу государства избирают на срок.",
  "Warum ist die Unabhängigkeit der Gerichte für die Gewaltenteilung wichtig?":
    "Почему независимость судов важна для разделения властей?",
  "Damit Urteile schneller gefällt werden": "Чтобы решения выносились быстрее",
  "Damit Gerichte auch gegen die Regierung entscheiden können":
    "Чтобы суды могли решать и против правительства",
  "Damit Richter mehr verdienen": "Чтобы судьи больше зарабатывали",
  "Damit weniger Gesetze nötig sind": "Чтобы требовалось меньше законов",
  "Eine Justiz, die von der Regierung abhängt, kann sie nicht kontrollieren. Genau deshalb sind Richter nur dem Gesetz unterworfen.":
    "Правосудие, зависящее от правительства, надзирать за ним не может. Именно поэтому судьи подчинены одному лишь закону.",
  "Wo hat der Deutsche Bundestag seinen Sitz?": "Где находится Германский Бундестаг?",
  "In Bonn": "В Бонне",
  "In Frankfurt am Main": "Во Франкфурте-на-Майне",
  "Im Reichstagsgebäude in Berlin. Bonn war bis 1999 Regierungssitz und ist heute Bundesstadt.":
    "В здании рейхстага в Берлине. Бонн был местопребыванием правительства до 1999 года и сегодня носит звание федерального города.",
  "Was ist die Aufgabe der Opposition im Bundestag?": "В чём задача оппозиции в Бундестаге?",
  "Die Regierung zu unterstützen": "Поддерживать правительство",
  "Die Regierung zu kontrollieren und Alternativen vorzuschlagen":
    "Надзирать за правительством и предлагать иные пути",
  "Die Gesetze auszuführen": "Исполнять законы",
  "Die Wahlen zu organisieren": "Устраивать выборы",
  "Kontrolle und Alternative — deshalb hat die Opposition eigene Rechte, etwa beim Einsetzen von Untersuchungsausschüssen.":
    "Надзор и иной путь — поэтому у оппозиции есть собственные права, например при создании следственных комитетов.",
  "Wer leitet die Sitzungen des Bundestages?": "Кто ведёт заседания Бундестага?",
  "Der älteste Abgeordnete": "Самый старший депутат",
  "Der Bundestagspräsident führt die Sitzungen und wahrt die Ordnung des Hauses. Protokollarisch steht er an zweiter Stelle im Staat.":
    "Председатель Бундестага ведёт заседания и следит за порядком в палате. По протоколу он стоит в государстве на втором месте.",
  "Wann muss der Bundesrat einem Gesetz zwingend zustimmen?":
    "Когда Бундесрат обязан дать согласие на закон?",
  "Bei jedem Gesetz": "На каждый закон",
  "Bei Zustimmungsgesetzen, etwa wenn Interessen der Länder berührt sind":
    "На законы, требующие согласия, например когда затронуты интересы земель",
  "Nur bei Verfassungsänderungen": "Только при изменении конституции",
  "Nie, er kann nur Empfehlungen abgeben": "Никогда, он может лишь давать рекомендации",
  "Zustimmungsgesetze brauchen sein Ja. Bei Einspruchsgesetzen kann der Bundestag einen Einspruch überstimmen.":
    "Законам, требующим согласия, нужно его «да». При законах, допускающих возражение, Бундестаг может это возражение перевесить.",
  "Was ist der Vermittlungsausschuss?": "Что такое согласительный комитет?",
  "Ein Gericht für Streit zwischen Parteien": "Суд для споров между партиями",
  "Ein gemeinsames Gremium von Bundestag und Bundesrat, das bei Uneinigkeit einen Kompromiss sucht":
    "Общий орган Бундестага и Бундесрата, который при несогласии ищет соглашение",
  "Ein Ausschuss zur Vermittlung von Arbeitsplätzen": "Комитет по трудоустройству",
  "Der Ausschuss, der den Kanzler vorschlägt": "Комитет, который предлагает канцлера",
  "Wenn sich Bundestag und Bundesrat über ein Gesetz nicht einig werden, sucht dieser Ausschuss einen gemeinsamen Vorschlag.":
    "Когда Бундестаг и Бундесрат не сходятся по закону, этот комитет ищет общее предложение.",
  "Was bedeutet das freie Mandat eines Abgeordneten?": "Что означает свободный мандат депутата?",
  "Er muss immer so stimmen, wie seine Partei es beschließt":
    "Он всегда обязан голосовать так, как решила его партия",
  "Er ist nur seinem Gewissen verpflichtet und an Weisungen nicht gebunden":
    "Он обязан лишь своей совести и указаниями не связан",
  "Er darf beliebig oft fehlen": "Он может пропускать заседания сколько угодно",
  "Er braucht keine Wahl": "Ему не нужны выборы",
  "Artikel 38: Abgeordnete sind Vertreter des ganzen Volkes und an Aufträge nicht gebunden — auch nicht an die der eigenen Fraktion.":
    "Статья 38: депутаты представляют весь народ и поручениями не связаны — в том числе поручениями собственной фракции.",
  "Wie oft muss ein Gesetzentwurf im Bundestag beraten werden?":
    "Сколько раз законопроект должен обсуждаться в Бундестаге?",
  "Einmal": "Один раз",
  "In der Regel in drei Lesungen": "Как правило, в трёх чтениях",
  "Fünfmal": "Пять раз",
  "So oft die Regierung es wünscht": "Столько, сколько пожелает правительство",
  "Drei Lesungen, dazwischen die Arbeit in den Fachausschüssen — damit ein Gesetz nicht im Vorbeigehen beschlossen wird.":
    "Три чтения, а между ними работа в профильных комитетах — чтобы закон не приняли походя.",
  "Wer beschließt über die Einnahmen und Ausgaben des Bundes?":
    "Кто решает о доходах и расходах федерации?",
  "Der Bundesfinanzminister allein": "Один только федеральный министр финансов",
  "Der Bundestag mit dem Haushaltsgesetz": "Бундестаг законом о бюджете",
  "Die Bundesbank": "Федеральный банк",
  "Das Budgetrecht liegt beim Parlament. Die Regierung schlägt den Haushalt vor, beschließen muss ihn der Bundestag.":
    "Бюджетное право лежит на парламенте. Правительство бюджет предлагает, а принимать его должен Бундестаг.",
  "Wo hat der Bundespräsident seinen Amtssitz?":
    "Где находится резиденция федерального президента?",
  "Im Kanzleramt": "В ведомстве федерального канцлера",
  "Im Schloss Bellevue": "Во дворце Бельвю",
  "Im Reichstagsgebäude": "В здании рейхстага",
  "In der Villa Hammerschmidt in Bonn": "На вилле Хаммершмидт в Бонне",
  "Schloss Bellevue in Berlin. Die Villa Hammerschmidt in Bonn ist der zweite Amtssitz.":
    "Дворец Бельвю в Берлине. Вилла Хаммершмидт в Бонне — вторая резиденция.",
  "Wer ernennt und entlässt die Bundesminister?":
    "Кто назначает и увольняет федеральных министров?",
  "Der Bundespräsident auf Vorschlag des Bundeskanzlers":
    "Федеральный президент по предложению федерального канцлера",
  "Die Partei des Kanzlers": "Партия канцлера",
  "Der Kanzler schlägt vor, der Bundespräsident vollzieht. Beides gehört zusammen und wird gern zu einem Schritt verkürzt.":
    "Канцлер предлагает, федеральный президент исполняет. Одно связано с другим, и это охотно сводят к одному шагу.",
  "Was ist das Ressortprinzip?": "Что такое начало ведомственной самостоятельности?",
  "Jeder Minister leitet sein Ministerium eigenständig":
    "Каждый министр ведёт своё министерство самостоятельно",
  "Der Kanzler entscheidet alles allein": "Канцлер решает всё один",
  "Die Ministerien wechseln jedes Jahr": "Министерства меняются каждый год",
  "Jedes Bundesland bekommt ein Ministerium": "Каждая федеральная земля получает министерство",
  "Innerhalb der Richtlinien des Kanzlers führt jeder Minister sein Haus selbstständig und in eigener Verantwortung.":
    "Внутри направлений, заданных канцлером, каждый министр ведёт своё ведомство самостоятельно и под собственную ответственность.",
  "Was ist eine Koalition?": "Что такое коалиция?",
  "Ein Bündnis mehrerer Parteien, die gemeinsam regieren":
    "Союз нескольких партий, которые правят вместе",
  "Ein Zusammenschluss von Bundesländern": "Объединение федеральных земель",
  "Ein Vertrag mit anderen Staaten": "Договор с другими государствами",
  "Die Verbindung von Regierung und Gerichten": "Связь правительства и судов",
  "Weil eine Partei selten allein die Mehrheit hat, schließen sich mehrere zusammen und einigen sich auf einen Koalitionsvertrag.":
    "Поскольку одна партия редко имеет большинство сама по себе, несколько сходятся вместе и договариваются о коалиционном соглашении.",
  "Welche Aufgabe hat der Bundespräsident bei einem neuen Gesetz?":
    "Какая задача у федерального президента при новом законе?",
  "Er schreibt den Gesetzentwurf": "Он пишет законопроект",
  "Er fertigt das Gesetz aus und prüft dabei, ob es verfassungsgemäß zustande gekommen ist":
    "Он оформляет закон и проверяет при этом, надлежащим ли образом тот появился на свет",
  "Er stimmt im Bundestag mit ab": "Он голосует вместе с Бундестагом",
  "Er kann jedes Gesetz nach Belieben ablehnen":
    "Он может отклонить любой закон по своему усмотрению",
  "Er unterschreibt und prüft dabei das ordnungsgemäße Zustandekommen — eine politische Bewertung steht ihm nicht zu.":
    "Он подписывает и проверяет при этом надлежащее появление закона — политическая оценка ему не положена.",
  "Wie nennt man die gemeinsame Sitzung von Kanzler und Ministern?":
    "Как называют общее заседание канцлера и министров?",
  "Kabinettssitzung": "Заседание кабинета",
  "Plenarsitzung": "Пленарное заседание",
  "Bundesratssitzung": "Заседание Бундесрата",
  "Kanzler und Minister bilden das Kabinett; dort werden Gesetzentwürfe und Regierungsvorhaben beschlossen.":
    "Канцлер и министры образуют кабинет; там принимают законопроекты и правительственные замыслы.",
  "Wer vertritt Deutschland völkerrechtlich nach außen?":
    "Кто представляет Германию вовне по международному праву?",
  "Der Außenminister allein": "Один только министр иностранных дел",
  "Das Staatsoberhaupt vertritt Deutschland nach außen, etwa beim Empfang von Botschaftern. Die tägliche Außenpolitik macht die Regierung.":
    "Вовне Германию представляет глава государства, например при приёме послов. Повседневную внешнюю политику ведёт правительство.",
  "Was gilt für die Amtszeit des Bundeskanzlers?":
    "Что действует в отношении срока полномочий федерального канцлера?",
  "Höchstens zwei Amtszeiten": "Не более двух сроков",
  "Es gibt keine Begrenzung der Amtszeiten": "Ограничения по числу сроков нет",
  "Höchstens acht Jahre": "Не более восьми лет",
  "Höchstens eine Amtszeit": "Не более одного срока",
  "Anders als beim Bundespräsidenten gibt es keine Obergrenze — Helmut Kohl und Angela Merkel amtierten je sechzehn Jahre.":
    "В отличие от федерального президента, верхней границы нет — Гельмут Коль и Ангела Меркель занимали должность по шестнадцать лет.",
  "Was bekommst du vor einer Wahl per Post zugeschickt?":
    "Что присылают по почте перед выборами?",
  "Den Stimmzettel": "Избирательный бюллетень",
  "Die Wahlbenachrichtigung": "Извещение о выборах",
  "Eine Liste aller Kandidaten mit Adressen": "Список всех кандидатов с адресами",
  "Nichts": "Ничего",
  "Die Wahlbenachrichtigung nennt Wahllokal und Öffnungszeiten. Den Stimmzettel bekommst du erst im Wahllokal.":
    "Извещение о выборах называет участок и часы его работы. Бюллетень выдают только на участке.",
  "Was ist die Briefwahl?": "Что такое голосование по почте?",
  "Eine Wahl, bei der man dem Kandidaten schreibt": "Выборы, при которых пишут кандидату",
  "Die Möglichkeit, vorab per Post zu wählen statt im Wahllokal":
    "Возможность проголосовать заранее по почте вместо участка",
  "Eine Wahl nur für Auslandsdeutsche": "Выборы только для немцев за границей",
  "Eine Wahl per E-Mail": "Голосование по электронной почте",
  "Wer am Wahltag verhindert ist, kann die Unterlagen vorher anfordern und per Post wählen. Ein Grund muss nicht angegeben werden.":
    "Кто в день выборов занят, может заранее запросить документы и проголосовать по почте. Причину указывать не нужно.",
  "Was ist ein Wahlkreis?": "Что такое избирательный округ?",
  "Ein Bundesland": "Федеральная земля",
  "Ein regional abgegrenztes Gebiet, in dem ein Kandidat direkt gewählt wird":
    "Ограниченная область, в которой кандидата избирают напрямую",
  "Der Kreis der Wahlberechtigten einer Partei": "Круг избирателей одной партии",
  "Ein Raum im Wahllokal": "Помещение на избирательном участке",
  "Mit der Erststimme wird in jedem Wahlkreis eine Person direkt gewählt.":
    "Первым голосом в каждом округе напрямую избирают одного человека.",
  "Was passiert mit den Zweitstimmen einer Partei, die unter fünf Prozent bleibt?":
    "Что происходит со вторыми голосами партии, которая осталась ниже пяти процентов?",
  "Sie werden auf die anderen Parteien verteilt und die Partei zieht nicht ein":
    "Их распределяют между другими партиями, а сама партия в парламент не проходит",
  "Sie werden für die nächste Wahl aufgehoben": "Их сохраняют до следующих выборов",
  "Die Partei bekommt trotzdem Sitze": "Партия всё равно получает места",
  "Die Wahl wird wiederholt": "Выборы проводят заново",
  "Die Partei bleibt draußen; die Sitze verteilen sich unter denen, die die Hürde geschafft haben. Ausnahme: mehrere direkt gewonnene Wahlkreise.":
    "Партия остаётся снаружи; места распределяют между теми, кто барьер взял. Исключение: несколько выигранных напрямую округов.",
  "Wie finanzieren sich Parteien in Deutschland überwiegend?":
    "За счёт чего партии в Германии живут по большей части?",
  "Ausschließlich durch den Staat": "Исключительно за счёт государства",
  "Durch Mitgliedsbeiträge, Spenden und staatliche Teilfinanzierung":
    "За счёт членских взносов, пожертвований и частичного государственного содержания",
  "Ausschließlich durch Spenden von Unternehmen":
    "Исключительно за счёт пожертвований предприятий",
  "Durch Eintrittsgelder bei Veranstaltungen": "За счёт платы за вход на мероприятия",
  "Drei Quellen zusammen. Großspenden müssen veröffentlicht werden, damit Einfluss nachvollziehbar bleibt.":
    "Из трёх источников вместе. Крупные пожертвования подлежат огласке, чтобы влияние оставалось прослеживаемым.",
  "Wer darf in Deutschland eine Partei gründen?": "Кому в Германии можно основать партию?",
  "Nur der Bundestag": "Только Бундестагу",
  "Grundsätzlich jeder — die Parteigründung ist frei":
    "В основном каждому — основание партии свободно",
  "Nur wer schon Abgeordneter ist": "Только тому, кто уже депутат",
  "Nur mit Genehmigung des Bundespräsidenten": "Только с разрешения федерального президента",
  "Artikel 21: Die Gründung von Parteien ist frei. Verboten werden kann eine Partei nur vom Bundesverfassungsgericht.":
    "Статья 21: основание партий свободно. Запретить партию может только Федеральный конституционный суд.",
  "Was passiert mit deinem Stimmzettel, wenn du ihn falsch ausfüllst?":
    "Что происходит с бюллетенем, если заполнить его неправильно?",
  "Er wird trotzdem gezählt": "Его всё равно засчитают",
  "Er ist ungültig und zählt für keine Partei":
    "Он недействителен и не засчитывается ни одной партии",
  "Du darfst noch einmal wählen": "Можно проголосовать ещё раз",
  "Die Wahlhelfer korrigieren ihn": "Члены комиссии его исправят",
  "Ein ungültiger Stimmzettel zählt für niemanden. Wer sich verschreibt, kann im Wahllokal aber einen neuen verlangen.":
    "Недействительный бюллетень не засчитывается никому. Но тот, кто ошибся при заполнении, может попросить на участке новый.",
  "Warum gibt es in Deutschland keine Volksabstimmungen auf Bundesebene über einzelne Gesetze?":
    "Почему в Германии нет всенародных голосований об отдельных законах на федеральном уровне?",
  "Weil das Grundgesetz die Entscheidungen dem gewählten Parlament überträgt":
    "Потому что Основной закон передаёт решения избранному парламенту",
  "Weil es zu teuer wäre": "Потому что это было бы слишком дорого",
  "Weil die EU es verbietet": "Потому что это запрещает Европейский союз",
  "Weil es keine Wahllokale gibt": "Потому что нет избирательных участков",
  "Das Grundgesetz sieht auf Bundesebene die repräsentative Demokratie vor. In den Ländern und Gemeinden gibt es dagegen Volks- und Bürgerentscheide.":
    "Основной закон предусматривает на уровне федерации представительную демократию. В землях и общинах, напротив, народные и гражданские решения есть.",
  "Wie heißt die Hauptstadt von Bayern?": "Как называется столица Баварии?",
  "Nürnberg": "Нюрнберг",
  "Augsburg": "Аугсбург",
  "Regensburg": "Регенсбург",
  "München. Nürnberg und Augsburg sind große bayerische Städte, aber nicht die Landeshauptstadt.":
    "Мюнхен. Нюрнберг и Аугсбург — большие баварские города, но не столица земли.",
  "Welches Bundesland ist flächenmäßig das größte?":
    "Какая федеральная земля самая большая по площади?",
  "Nordrhein-Westfalen": "Северный Рейн — Вестфалия",
  "Bayern": "Бавария",
  "Niedersachsen": "Нижняя Саксония",
  "Baden-Württemberg": "Баден-Вюртемберг",
  "Bayern ist das flächengrößte Land, Nordrhein-Westfalen das bevölkerungsreichste.":
    "Бавария — самая большая по площади земля, Северный Рейн — Вестфалия самая многолюдная.",
  "Wer wählt den Ministerpräsidenten eines Bundeslandes?":
    "Кто избирает премьер-министра федеральной земли?",
  "Die Bürger direkt": "Граждане напрямую",
  "Der Landtag": "Ландтаг",
  "Das Landesparlament wählt ihn — wie der Bundestag den Kanzler. Direkt gewählt wird er nirgends.":
    "Его избирает парламент земли — как Бундестаг избирает канцлера. Напрямую его не избирают нигде.",
  "Was gilt, wenn Bundesrecht und Landesrecht sich widersprechen?":
    "Что действует, если федеральное право и право земли противоречат друг другу?",
  "Das Landesrecht gilt": "Действует право земли",
  "Bundesrecht bricht Landesrecht": "Федеральное право ломает право земли",
  "Das ältere Gesetz gilt": "Действует более старый закон",
  "Ein Gericht entscheidet jedes Mal neu": "Суд решает каждый раз заново",
  "Artikel 31 des Grundgesetzes: Bundesrecht bricht Landesrecht.":
    "Статья 31 Основного закона: федеральное право ломает право земли.",
  "Welche fünf Länder werden als „neue Bundesländer“ bezeichnet?":
    "Какие пять земель называют «новыми федеральными землями»?",
  "Die fünf kleinsten Länder": "Пять самых маленьких земель",
  "Die Länder, die 1990 auf dem Gebiet der DDR entstanden":
    "Земли, возникшие в 1990 году на территории ГДР",
  "Die Länder mit den jüngsten Landesverfassungen": "Земли с самыми молодыми конституциями",
  "Die fünf Länder mit Küstenzugang": "Пять земель с выходом к морю",
  "Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen — 1990 wiedergegründet.":
    "Бранденбург, Мекленбург — Передняя Померания, Саксония, Саксония-Анхальт и Тюрингия — вновь основанные в 1990 году.",
  "Wer leitet die Verwaltung einer Stadt oder Gemeinde?":
    "Кто возглавляет управление города или общины?",
  "Der Ministerpräsident": "Премьер-министр земли",
  "Der Bürgermeister": "Бургомистр",
  "Der Landrat des Kreises": "Ландрат района",
  "Der Innenminister": "Министр внутренних дел",
  "Der Bürgermeister, meist direkt von den Bürgern gewählt. Der Landrat steht dem Landkreis vor.":
    "Бургомистр, чаще всего избираемый гражданами напрямую. Ландрат стоит во главе сельского района.",
  "In welchem Bundesland liegt die Stadt Dresden?":
    "В какой федеральной земле лежит город Дрезден?",
  "Thüringen": "В Тюрингии",
  "Sachsen": "В Саксонии",
  "Brandenburg": "В Бранденбурге",
  "Sachsen-Anhalt": "В Саксонии-Анхальт",
  "Dresden ist die Landeshauptstadt von Sachsen. Erfurt gehört zu Thüringen, Magdeburg zu Sachsen-Anhalt.":
    "Дрезден — столица земли Саксония. Эрфурт относится к Тюрингии, Магдебург — к Саксонии-Анхальт.",
  "Woher bekommen Gemeinden hauptsächlich ihr Geld?":
    "Откуда общины получают деньги главным образом?",
  "Ausschließlich aus Spenden": "Исключительно из пожертвований",
  "Aus eigenen Steuern, Gebühren und Zuweisungen von Land und Bund":
    "Из собственных налогов, сборов и отчислений от земли и федерации",
  "Nur aus der Einkommensteuer ihrer Einwohner": "Только из подоходного налога своих жителей",
  "Sie dürfen kein eigenes Geld einnehmen": "Собственных доходов у них быть не может",
  "Gewerbe- und Grundsteuer, Gebühren für Leistungen und Zuweisungen der höheren Ebenen — ein Mischsystem.":
    "Промысловый и поземельный налог, сборы за услуги и отчисления с более высоких уровней — смешанное устройство.",
  "Was ist ein Schöffe?": "Кто такой шёффе?",
  "Ein Anwalt der Staatsanwaltschaft": "Адвокат прокуратуры",
  "Ein ehrenamtlicher Richter ohne juristische Ausbildung":
    "Судья на общественных началах без юридического образования",
  "Ein Protokollführer bei Gericht": "Секретарь суда, ведущий протокол",
  "Ein Gefängnisaufseher": "Надзиратель в тюрьме",
  "Bürger wirken als Schöffen an Strafurteilen mit und haben in der Hauptverhandlung dasselbe Stimmrecht wie Berufsrichter.":
    "Граждане участвуют как шёффены в вынесении приговоров и в главном разбирательстве имеют тот же голос, что и профессиональные судьи.",
  "Welches Gericht ist für Streit über eine Rente zuständig?":
    "Какой суд ведает спором о пенсии?",
  "Das Arbeitsgericht": "Суд по трудовым делам",
  "Das Sozialgericht": "Социальный суд",
  "Das Finanzgericht": "Финансовый суд",
  "Das Amtsgericht": "Участковый суд",
  "Sozialgerichte entscheiden über Rente, Krankenversicherung und Bürgergeld.":
    "Социальные суды решают дела о пенсии, медицинском страховании и Bürgergeld.",
  "Was bedeutet „rechtskräftig“?": "Что означает «вступивший в законную силу»?",
  "Das Urteil wurde verkündet": "Приговор был оглашён",
  "Das Urteil ist endgültig und kann nicht mehr mit normalen Rechtsmitteln angefochten werden":
    "Приговор окончателен и обычными средствами обжалован быть уже не может",
  "Der Angeklagte hat gestanden": "Подсудимый признался",
  "Das Urteil wurde von der Regierung bestätigt": "Приговор подтверждён правительством",
  "Erst mit der Rechtskraft steht ein Urteil endgültig fest — bis dahin gilt die Unschuldsvermutung weiter.":
    "Только со вступлением в законную силу приговор становится окончательным — до тех пор действует презумпция невиновности.",
  "Ein Vermieter kündigt dir und du hältst das für unrechtmäßig. Was kannst du tun?":
    "Наймодатель расторгает с тобой договор, а ты считаешь это неправомерным. Что можно сделать?",
  "Nichts, der Vermieter entscheidet": "Ничего, решает наймодатель",
  "Der Kündigung widersprechen und notfalls vor dem Amtsgericht klagen":
    "Возразить против расторжения и при необходимости подать иск в участковый суд",
  "Die Wohnung sofort räumen": "Немедленно освободить жильё",
  "Die Polizei rufen": "Вызвать полицию",
  "Mietstreitigkeiten gehören vor die ordentlichen Gerichte, in erster Instanz meist das Amtsgericht. Mietervereine beraten vorab.":
    "Споры о найме жилья идут в обычные суды, в первой инстанции чаще всего в участковый. Союзы нанимателей советуют заранее.",
  "Was ist der Unterschied zwischen Zivilrecht und Strafrecht?":
    "В чём разница между гражданским и уголовным правом?",
  "Zivilrecht gilt nur für Zivilisten": "Гражданское право действует только для гражданских лиц",
  "Zivilrecht regelt Streit zwischen Privaten, Strafrecht die Verfolgung von Straftaten durch den Staat":
    "Гражданское право ведает спорами между частными лицами, уголовное — преследованием преступлений государством",
  "Strafrecht gilt nur für Ausländer": "Уголовное право действует только для иностранцев",
  "Es gibt keinen Unterschied": "Разницы нет",
  "Im Zivilprozess streiten zwei Parteien, im Strafverfahren klagt der Staat durch die Staatsanwaltschaft an.":
    "В гражданском процессе спорят две стороны, в уголовном обвинение выдвигает государство через прокуратуру.",
  "Wer ermittelt bei einer Straftat?": "Кто ведёт розыск при совершении преступления?",
  "Das Gericht": "Суд",
  "Polizei und Staatsanwaltschaft": "Полиция и прокуратура",
  "Die Staatsanwaltschaft leitet das Ermittlungsverfahren, die Polizei führt es durch. Das Gericht kommt erst danach.":
    "Прокуратура руководит предварительным расследованием, полиция его ведёт. Суд приходит только после.",
  "Was ist eine Berufung?": "Что такое апелляция?",
  "Der Beruf des Angeklagten": "Занятие подсудимого",
  "Ein Rechtsmittel, mit dem ein Urteil von einem höheren Gericht überprüft wird":
    "Средство обжалования, которым приговор проверяет вышестоящий суд",
  "Die Ernennung eines Richters": "Назначение судьи",
  "Die Vorladung zum Gericht": "Вызов в суд",
  "Wer mit einem Urteil nicht einverstanden ist, kann es in der nächsten Instanz überprüfen lassen.":
    "Кто с приговором не согласен, может дать проверить его в следующей инстанции.",
  "Was passiert, wenn jemand kein Geld für einen Anwalt hat?":
    "Что происходит, если у человека нет денег на адвоката?",
  "Er muss sich selbst verteidigen": "Ему придётся защищаться самому",
  "Er kann Beratungs- oder Prozesskostenhilfe beantragen":
    "Он может подать заявление на помощь в оплате совета или судебных расходов",
  "Das Verfahren wird eingestellt": "Производство прекращают",
  "Er verliert automatisch": "Он проигрывает сам собой",
  "Der Zugang zum Recht darf nicht am Einkommen scheitern — dafür gibt es Beratungshilfe, Prozesskostenhilfe und Pflichtverteidigung.":
    "Доступ к праву не должен упираться в доход — для этого есть помощь в оплате совета, помощь в судебных расходах и защитник по назначению.",
  "Wer zahlt die Beiträge zur gesetzlichen Rentenversicherung?":
    "Кто платит взносы в обязательное пенсионное страхование?",
  "Nur der Arbeitnehmer": "Только работник",
  "Arbeitnehmer und Arbeitgeber je zur Hälfte": "Работник и работодатель поровну",
  "Nur der Arbeitgeber": "Только работодатель",
  "Der Staat": "Государство",
  "Wie bei Kranken-, Pflege- und Arbeitslosenversicherung teilen sich beide Seiten den Beitrag.":
    "Как и при страховании на случай болезни, потребности в уходе и безработицы, взнос делят обе стороны.",
  "Was ist das Umlageverfahren in der Rentenversicherung?":
    "Что такое распределительный порядок в пенсионном страховании?",
  "Jeder spart sein eigenes Geld an": "Каждый копит собственные деньги",
  "Die heutigen Beitragszahler finanzieren die heutigen Renten":
    "Сегодняшние плательщики взносов оплачивают сегодняшние пенсии",
  "Der Staat legt das Geld an der Börse an": "Государство вкладывает деньги на бирже",
  "Die Renten kommen aus der Mehrwertsteuer": "Пенсии идут из налога с оборота",
  "Ein Generationenvertrag: Wer heute arbeitet, zahlt die Renten von heute und erwirbt damit einen eigenen Anspruch für später.":
    "Договор поколений: кто работает сегодня, платит сегодняшние пенсии и приобретает тем самым собственное право на будущее.",
  "Wer hilft bei der Suche nach Arbeit und zahlt Arbeitslosengeld?":
    "Кто помогает в поиске работы и платит пособие по безработице?",
  "Das Jobcenter und die Agentur für Arbeit": "Джобцентр и агентство по труду",
  "Die Agentur für Arbeit zahlt Arbeitslosengeld, das Jobcenter betreut Bürgergeld-Empfänger.":
    "Агентство по труду платит пособие по безработице, джобцентр ведёт получателей Bürgergeld.",
  "Wofür ist die Berufsgenossenschaft zuständig?":
    "За что отвечает профессиональное товарищество?",
  "Für die Rente": "За пенсию",
  "Für die gesetzliche Unfallversicherung bei Arbeitsunfällen und Berufskrankheiten":
    "За обязательное страхование от несчастных случаев на работе и профессиональных болезней",
  "Für die Arbeitsvermittlung": "За поиск работы",
  "Für Tarifverhandlungen": "За тарифные переговоры",
  "Die Berufsgenossenschaften sind die Träger der Unfallversicherung — bezahlt allein vom Arbeitgeber.":
    "Профессиональные товарищества — носители страхования от несчастных случаев, и платит за него один работодатель.",
  "Was ist das Ziel des Bürgergeldes?": "В чём цель Bürgergeld?",
  "Ein Zuschuss für Besserverdienende": "Надбавка тем, кто зарабатывает лучше",
  "Die Grundsicherung des Lebensunterhalts für Erwerbsfähige ohne ausreichendes Einkommen":
    "Основное обеспечение средств к жизни для трудоспособных без достаточного дохода",
  "Eine zusätzliche Rente": "Дополнительная пенсия",
  "Ein Darlehen für Selbstständige": "Заём для работающих на себя",
  "Es sichert das Existenzminimum und unterstützt zugleich den Weg zurück in Arbeit.":
    "Оно обеспечивает прожиточный минимум и одновременно поддерживает возвращение к работе.",
  "Wie lange kann Elterngeld in der Grundvariante höchstens bezogen werden?":
    "Сколько времени можно получать Elterngeld в основном варианте самое большее?",
  "3 Monate": "3 месяца",
  "14 Monate zwischen beiden Elternteilen": "14 месяцев на обоих родителей вместе",
  "24 Monate": "24 месяца",
  "36 Monate": "36 месяцев",
  "Bis zu 14 Monate, wenn sich beide Elternteile die Zeit teilen; ein Elternteil allein kann höchstens 12 Monate beziehen.":
    "До 14 месяцев, если оба родителя делят это время между собой; один родитель может получать его самое большее 12 месяцев.",
  "Was ist der Unterschied zwischen Brutto und Netto?":
    "В чём разница между валовым и чистым заработком?",
  "Brutto ist der Lohn vor Abzügen, Netto der Betrag nach Steuern und Sozialabgaben":
    "Валовой — это заработок до вычетов, чистый — сумма после налогов и социальных отчислений",
  "Netto ist der Lohn vor Abzügen": "Чистый — это заработок до вычетов",
  "Brutto gilt nur für Selbstständige": "Валовой считают только для работающих на себя",
  "Es ist dasselbe": "Это одно и то же",
  "Vom Brutto gehen Lohnsteuer und Sozialabgaben ab; das Netto landet auf dem Konto.":
    "С валового уходят налог с заработка и социальные отчисления; чистый попадает на счёт.",
  "Was bedeutet Versicherungspflicht in der Krankenversicherung?":
    "Что означает обязательность медицинского страхования?",
  "Jeder darf sich freiwillig versichern": "Каждый может застраховаться добровольно",
  "Jede Person in Deutschland muss krankenversichert sein — gesetzlich oder privat":
    "Каждый человек в Германии обязан иметь медицинское страхование — государственное или частное",
  "Nur Arbeitnehmer müssen versichert sein": "Страховаться обязаны только наёмные работники",
  "Nur wer krank ist, muss sich versichern": "Страховаться обязан только тот, кто болен",
  "Seit 2009 gilt die allgemeine Versicherungspflicht. Niemand soll ohne Absicherung dastehen.":
    "С 2009 года действует всеобщая обязательность страхования. Никто не должен остаться без защиты.",
  "Wie hieß das Parlament im Deutschen Kaiserreich?":
    "Как назывался парламент в Германской империи?",
  "Der Reichstag wurde gewählt, konnte die Regierung aber nicht stürzen — der Kanzler war dem Kaiser verantwortlich.":
    "Рейхстаг избирался, но свалить правительство не мог — канцлер отвечал перед императором.",
  "Wann begann der Erste Weltkrieg?": "Когда началась Первая мировая война?",
  "1919": "1919",
  "1914, und er endete 1918 mit der deutschen Niederlage.":
    "В 1914 году, а кончилась она в 1918 поражением Германии.",
  "Wer war der erste Reichspräsident der Weimarer Republik?":
    "Кто был первым рейхспрезидентом Веймарской республики?",
  "Paul von Hindenburg": "Пауль фон Гинденбург",
  "Gustav Stresemann": "Густав Штреземан",
  "Friedrich Ebert ab 1919. Hindenburg folgte 1925 und ernannte 1933 Hitler zum Reichskanzler.":
    "Фридрих Эберт с 1919 года. Гинденбург последовал за ним в 1925 году и в 1933 назначил Гитлера рейхсканцлером.",
  "Welche Farben hatte die Flagge der Weimarer Republik?":
    "Какие цвета были у флага Веймарской республики?",
  "Schwarz-Weiß-Rot": "Чёрный, белый, красный",
  "Schwarz-Rot-Gold": "Чёрный, красный, золотой",
  "Schwarz-Rot-Weiß": "Чёрный, красный, белый",
  "Blau-Weiß-Rot": "Синий, белый, красный",
  "Schwarz-Rot-Gold, wie heute — im Kaiserreich war es Schwarz-Weiß-Rot. Um die Farben wurde in Weimar erbittert gestritten.":
    "Чёрный, красный, золотой, как и сегодня — в империи было чёрный, белый, красный. О цветах в Веймаре спорили ожесточённо.",
  "Was war der Reichstagsbrand von 1933 für die Nationalsozialisten?":
    "Чем стал для национал-социалистов поджог рейхстага в 1933 году?",
  "Ein Grund, Grundrechte per Notverordnung außer Kraft zu setzen":
    "Поводом отменить основные права чрезвычайным распоряжением",
  "Ein Anlass für Neuwahlen zum Kaiser": "Поводом для новых выборов императора",
  "Der Beginn des Zweiten Weltkriegs": "Началом Второй мировой войны",
  "Das Ende ihrer Herrschaft": "Концом их власти",
  "Unmittelbar danach wurden zentrale Grundrechte aufgehoben — ein entscheidender Schritt zur Diktatur.":
    "Сразу после этого ключевые основные права были отменены — решающий шаг к диктатуре.",
  "Was geschah am 9. November 1918?": "Что произошло 9 ноября 1918 года?",
  "Der Kaiser dankte ab und die Republik wurde ausgerufen":
    "Император отрёкся, и была провозглашена республика",
  "Der Erste Weltkrieg begann": "Началась Первая мировая война",
  "Die Weimarer Verfassung trat in Kraft": "Вступила в силу Веймарская конституция",
  "Das Ende der Monarchie. Der 9. November trägt in der deutschen Geschichte gleich mehrere schwere Daten.":
    "Конец монархии. На 9 ноября в немецкой истории приходится сразу несколько тяжёлых дат.",
  "Wie viele Jahre bestand die Weimarer Republik ungefähr?":
    "Сколько примерно лет просуществовала Веймарская республика?",
  "Etwa 5 Jahre": "Около 5 лет",
  "Etwa 14 Jahre": "Около 14 лет",
  "Etwa 30 Jahre": "Около 30 лет",
  "Etwa 50 Jahre": "Около 50 лет",
  "Von 1919 bis 1933, also rund vierzehn Jahre — die erste deutsche Demokratie.":
    "С 1919 по 1933 год, то есть около четырнадцати лет — первая немецкая демократия.",
  "Welche Rolle spielte Artikel 48 der Weimarer Verfassung?":
    "Какую роль играла статья 48 Веймарской конституции?",
  "Er sicherte das Frauenwahlrecht": "Она обеспечивала избирательное право женщин",
  "Er erlaubte dem Reichspräsidenten, mit Notverordnungen am Parlament vorbei zu regieren":
    "Она позволяла рейхспрезиденту править чрезвычайными распоряжениями в обход парламента",
  "Er regelte die Steuern": "Она ведала налогами",
  "Er verbot politische Parteien": "Она запрещала политические партии",
  "Das Notverordnungsrecht wurde ab 1930 zur Regel statt zur Ausnahme und höhlte das Parlament aus — deshalb kennt das Grundgesetz nichts Vergleichbares.":
    "Право на чрезвычайные распоряжения с 1930 года стало правилом вместо исключения и выхолостило парламент — потому Основной закон ничего подобного не знает.",
  "Wie viele Parteien waren im NS-Staat ab Sommer 1933 zugelassen?":
    "Сколько партий было допущено в национал-социалистическом государстве с лета 1933 года?",
  "Keine": "Ни одной",
  "Nur eine": "Только одна",
  "Zwei": "Две",
  "Alle wie vorher": "Все, как и прежде",
  "Nur die NSDAP. Alle anderen wurden verboten oder lösten sich auf.":
    "Только НСДАП. Все остальные были запрещены или распустились сами.",
  "Was bedeutet „Gleichschaltung“?": "Что означает «приведение к единому строю»?",
  "Die Angleichung der Löhne": "Выравнивание заработков",
  "Die Unterwerfung von Verwaltung, Verbänden und Medien unter die NSDAP":
    "Подчинение управления, союзов и средств печати НСДАП",
  "Die Vereinheitlichung der Stromnetze": "Объединение электрических сетей",
  "Die Gleichstellung von Mann und Frau": "Уравнение мужчины и женщины в правах",
  "Innerhalb weniger Monate wurde jede eigenständige Organisation entweder verboten oder auf Linie gebracht.":
    "За несколько месяцев каждая самостоятельная организация была либо запрещена, либо приведена к общей линии.",
  "Was waren Konzentrationslager?": "Что такое концентрационные лагеря?",
  "Schulungszentren der Partei": "Учебные центры партии",
  "Lager, in denen politische Gegner und verfolgte Gruppen eingesperrt, misshandelt und ermordet wurden":
    "Лагеря, где политических противников и преследуемые группы запирали, истязали и убивали",
  "Ferienlager für Jugendliche": "Лагеря отдыха для молодёжи",
  "Kasernen der Wehrmacht": "Казармы вермахта",
  "Schon 1933 eingerichtet, zunächst für politische Gegner. Später wurden sie Teil des Systems der Massenvernichtung.":
    "Устроены уже в 1933 году, сначала для политических противников. Позже они стали частью системы массового уничтожения.",
  "Wer war Sophie Scholl?": "Кто такая Софи Шолль?",
  "Eine Ministerin der Weimarer Republik": "Министр Веймарской республики",
  "Eine Studentin der Widerstandsgruppe Weiße Rose, 1943 hingerichtet":
    "Студентка из группы сопротивления «Белая роза», казнённая в 1943 году",
  "Die erste Bundeskanzlerin": "Первая женщина — федеральный канцлер",
  "Eine Widerstandskämpferin des 20. Juli 1944": "Участница сопротивления 20 июля 1944 года",
  "Sie verteilte mit ihrem Bruder Hans in München Flugblätter gegen das Regime. Der 20. Juli war der militärische Widerstand um Stauffenberg.":
    "Вместе с братом Гансом она раздавала в Мюнхене листовки против режима. 20 июля — это военное сопротивление вокруг Штауффенберга.",
  "Welches Land überfiel Deutschland am 1. September 1939?":
    "На какую страну Германия напала 1 сентября 1939 года?",
  "Frankreich": "Франция",
  "Polen": "Польша",
  "Die Sowjetunion": "Советский Союз",
  "Österreich": "Австрия",
  "Der Überfall auf Polen löste den Zweiten Weltkrieg aus. Der Angriff auf die Sowjetunion folgte 1941.":
    "Нападение на Польшу развязало Вторую мировую войну. Нападение на Советский Союз последовало в 1941 году.",
  "Was ist am 8. Mai 1945 geschehen?": "Что произошло 8 мая 1945 года?",
  "Der Krieg in Europa endete mit der bedingungslosen Kapitulation":
    "Война в Европе кончилась безоговорочной капитуляцией",
  "Die Bundesrepublik wurde gegründet": "Была основана Федеративная Республика",
  "Der Krieg begann": "Началась война",
  "Das Kriegsende in Europa. Heute ist der 8. Mai ein Tag des Gedenkens und der Befreiung.":
    "Конец войны в Европе. Сегодня 8 мая — день памяти и освобождения.",
  "Durften Menschen im NS-Staat frei ihre Meinung sagen?":
    "Могли ли люди в национал-социалистическом государстве свободно высказывать своё мнение?",
  "Ja, uneingeschränkt": "Да, без ограничений",
  "Nein, Kritik konnte Verfolgung, Haft oder den Tod bedeuten":
    "Нет, критика могла означать преследование, тюрьму или смерть",
  "Ja, aber nur schriftlich": "Да, но только письменно",
  "Nur Parteimitglieder durften kritisieren": "Критиковать могли только члены партии",
  "Presse und Rundfunk waren gleichgeschaltet, abweichende Meinungen wurden verfolgt.":
    "Печать и вещание были приведены к общей линии, а расходящиеся мнения преследовались.",
  "Warum ist das Ermächtigungsgesetz von 1933 so bedeutsam?":
    "Почему закон о полномочиях 1933 года так значим?",
  "Es führte die Todesstrafe ein": "Он ввёл смертную казнь",
  "Es übertrug der Regierung die Gesetzgebung und beseitigte damit die Gewaltenteilung":
    "Он передал законодательство правительству и устранил тем самым разделение властей",
  "Es verbot die Kirchen": "Он запретил церкви",
  "Es beendete den Ersten Weltkrieg": "Он закончил Первую мировую войну",
  "Von da an konnte die Regierung Gesetze ohne das Parlament erlassen — die entscheidende Weichenstellung zur Diktatur.":
    "С этого времени правительство могло издавать законы без парламента — решающий поворот к диктатуре.",
  "Was ist der Holocaust?": "Что такое Холокост?",
  "Eine Hungersnot im Ersten Weltkrieg": "Голод в Первую мировую войну",
  "Der staatlich organisierte Massenmord an den europäischen Juden":
    "Организованное государством массовое убийство европейских евреев",
  "Ein Luftangriff auf deutsche Städte": "Воздушный налёт на немецкие города",
  "Die Vertreibung nach 1945": "Изгнание после 1945 года",
  "Etwa sechs Millionen Juden wurden ermordet. Der hebräische Begriff dafür ist Schoah.":
    "Было убито около шести миллионов евреев. Еврейское слово для этого — Шоа.",
  "Wo befand sich das größte nationalsozialistische Vernichtungslager?":
    "Где находился самый большой национал-социалистический лагерь уничтожения?",
  "Dachau": "Дахау",
  "Auschwitz": "Освенцим",
  "Bergen-Belsen": "Берген-Бельзен",
  "Buchenwald": "Бухенвальд",
  "Auschwitz im besetzten Polen. Dachau, Buchenwald und Bergen-Belsen waren Konzentrationslager auf deutschem Boden.":
    "Освенцим в занятой Польше. Дахау, Бухенвальд и Берген-Бельзен были концентрационными лагерями на немецкой земле.",
  "Was steht in Berlin als zentrales Mahnmal für die ermordeten Juden Europas?":
    "Что стоит в Берлине как главный памятник убитым евреям Европы?",
  "Das Brandenburger Tor": "Бранденбургские ворота",
  "Das Denkmal für die ermordeten Juden Europas mit seinen Stelen":
    "Памятник убитым евреям Европы со своими стелами",
  "Die Siegessäule": "Колонна Победы",
  "Der Reichstag": "Рейхстаг",
  "Das Stelenfeld nahe dem Brandenburger Tor, eröffnet 2005.":
    "Поле стел близ Бранденбургских ворот, открытое в 2005 году.",
  "Was sind Stolpersteine?": "Что такое «камни преткновения»?",
  "Hindernisse auf Gehwegen": "Препятствия на тротуарах",
  "Kleine Gedenktafeln im Boden vor den letzten frei gewählten Wohnorten von NS-Opfern":
    "Небольшие памятные таблички в мостовой перед последними свободно выбранными жилищами жертв нацизма",
  "Grenzsteine zwischen Bundesländern": "Пограничные камни между федеральными землями",
  "Steine aus zerstörten Synagogen": "Камни из разрушенных синагог",
  "Messingtafeln im Pflaster, die Namen und Schicksal einzelner Opfer nennen — inzwischen über 100.000 in ganz Europa.":
    "Латунные таблички в мостовой, называющие имя и судьбу отдельной жертвы — их уже более 100 000 по всей Европе.",
  "Welche Folge hat die NS-Vergangenheit für die deutsche Außenpolitik?":
    "Какое следствие имеет национал-социалистическое прошлое для немецкой внешней политики?",
  "Deutschland hält sich aus allem heraus": "Германия держится в стороне от всего",
  "Eine besondere Verantwortung gegenüber Israel und für den Schutz von Menschenrechten":
    "Особую ответственность перед Израилем и за защиту прав человека",
  "Deutschland darf keine Verträge schließen": "Германии нельзя заключать договоры",
  "Deutschland ist von der UNO ausgeschlossen": "Германия исключена из ООН",
  "Aus der Geschichte folgt eine dauerhafte Verpflichtung — gegenüber Israel, gegenüber jüdischem Leben in Deutschland und für Menschenrechte allgemein.":
    "Из истории следует непреходящая обязанность — перед Израилем, перед еврейской жизнью в Германии и за права человека вообще.",
  "Was ist Antisemitismus?": "Что такое антисемитизм?",
  "Ablehnung aller Religionen": "Неприятие всех религий",
  "Feindschaft und Hass gegen Juden": "Вражда и ненависть к евреям",
  "Kritik an einer Regierung": "Критика правительства",
  "Eine politische Partei": "Политическая партия",
  "Judenfeindschaft in ihren verschiedenen Formen. In Deutschland wird sie strafrechtlich und gesellschaftlich entschieden bekämpft.":
    "Вражда к евреям в разных её видах. В Германии с ней решительно борются и уголовным законом, и силами общества.",
  "Ist es in Deutschland erlaubt, Hakenkreuze öffentlich zu zeigen?":
    "Разрешено ли в Германии прилюдно показывать свастику?",
  "Ja, das ist Kunstfreiheit": "Да, это свобода искусства",
  "Nein, das Verwenden von Kennzeichen verfassungswidriger Organisationen ist strafbar":
    "Нет, использование знаков противоконституционных организаций наказуемо",
  "Ja, auf Kleidung": "Да, на одежде",
  "Nur bei Demonstrationen": "Только на демонстрациях",
  "Strafbar nach § 86a StGB. Ausnahmen gelten nur für Bildung, Kunst und Wissenschaft in eindeutig ablehnendem Zusammenhang.":
    "Наказуемо по § 86a Уголовного кодекса. Исключения действуют только для обучения, искусства и науки в явно осуждающем окружении.",
  "Was bedeutet „Erinnerungskultur“?": "Что означает «культура памяти»?",
  "Das Sammeln alter Gegenstände": "Собирание старых предметов",
  "Der bewusste gesellschaftliche Umgang mit der eigenen Geschichte, besonders mit der NS-Zeit":
    "Сознательное обращение общества с собственной историей, особенно с нацистским временем",
  "Der Geschichtsunterricht an Universitäten": "Преподавание истории в университетах",
  "Das Feiern von Jahrestagen": "Празднование годовщин",
  "Gedenkstätten, Gedenktage, Unterricht und Forschung zusammen — die Vergangenheit wird nicht abgeschlossen, sondern wachgehalten.":
    "Мемориалы, дни памяти, уроки и исследования вместе — прошлое не закрывают, а держат живым.",
  "Welche Stadt war Hauptstadt der Bundesrepublik bis 1990?":
    "Какой город был столицей Федеративной Республики до 1990 года?",
  "Bonn. Berlin war geteilt und wurde erst 1990 wieder Hauptstadt.":
    "Бонн. Берлин был разделён и снова стал столицей только в 1990 году.",
  "Was war die Währungsreform von 1948 in den Westzonen?":
    "Что такое денежная реформа 1948 года в западных зонах?",
  "Die Einführung der D-Mark": "Введение немецкой марки",
  "Die Abschaffung des Bargelds": "Отмена наличных денег",
  "Die Einführung der Rentenmark": "Введение рентной марки",
  "Die D-Mark löste die Reichsmark ab. Die sowjetische Antwort darauf war die Berliner Blockade.":
    "Немецкая марка сменила рейхсмарку. Советским ответом на это стала блокада Берлина.",
  "Wie heißt das Wirtschaftsmodell der Bundesrepublik?":
    "Как называется хозяйственный образец Федеративной Республики?",
  "Planwirtschaft": "Плановое хозяйство",
  "Soziale Marktwirtschaft": "Социальное рыночное хозяйство",
  "Staatswirtschaft": "Государственное хозяйство",
  "Tauschwirtschaft": "Меновое хозяйство",
  "Freier Wettbewerb mit sozialem Ausgleich — verbunden mit dem Namen Ludwig Erhard.":
    "Свободное соперничество с социальным выравниванием — с этим связывают имя Людвига Эрхарда.",
  "Aus welchen Zonen entstand die Bundesrepublik Deutschland?":
    "Из каких зон возникла Федеративная Республика Германия?",
  "Aus der sowjetischen Zone": "Из советской зоны",
  "Aus der amerikanischen, britischen und französischen Zone":
    "Из американской, британской и французской зон",
  "Aus allen vier Zonen": "Из всех четырёх зон",
  "Aus der amerikanischen Zone allein": "Из одной американской зоны",
  "Die drei Westzonen wurden 1949 zur Bundesrepublik, die sowjetische Zone zur DDR.":
    "Три западные зоны стали в 1949 году Федеративной Республикой, советская зона — ГДР.",
  "Welche Bedeutung hatte das Anwerbeabkommen mit der Türkei von 1961?":
    "Какое значение имело соглашение о наборе рабочих с Турцией 1961 года?",
  "Es beendete den Krieg": "Оно закончило войну",
  "Es holte Arbeitskräfte nach Westdeutschland, von denen viele blieben":
    "Оно привезло в Западную Германию рабочие руки, и многие остались",
  "Es regelte den Handel mit Öl": "Оно урегулировало торговлю нефтью",
  "Es öffnete die Grenze zur DDR": "Оно открыло границу с ГДР",
  "Aus angeworbenen Arbeitskräften wurden Nachbarn, Kollegen und Familien — ein prägender Teil der Einwanderungsgeschichte.":
    "Из набранных работников выросли соседи, сослуживцы и семьи — определяющая часть истории переселения в страну.",
  "Was waren die „Trümmerfrauen“?": "Кто такие «женщины развалин»?",
  "Frauen, die nach dem Krieg beim Aufräumen der zerstörten Städte halfen":
    "Женщины, которые после войны помогали разбирать разрушенные города",
  "Eine Gewerkschaft": "Профсоюз",
  "Frauen, die in die Westzonen flohen": "Женщины, бежавшие в западные зоны",
  "Sie räumten Schutt und retteten Ziegel für den Wiederaufbau — ein Sinnbild für den Neuanfang nach 1945.":
    "Они разбирали щебень и спасали кирпич для восстановления — образ нового начала после 1945 года.",
  "Wie viele Besatzungszonen hatte Deutschland nach 1945?":
    "Сколько зон занятия было в Германии после 1945 года?",
  "Drei": "Три",
  "Vier": "Четыре",
  "Fünf": "Пять",
  "Vier — USA, Großbritannien, Frankreich und Sowjetunion. Berlin war zusätzlich in vier Sektoren geteilt.":
    "Четыре — США, Великобритании, Франции и Советского Союза. Берлин сверх того был разделён на четыре сектора.",
  "Was bedeutet „Kalter Krieg“?": "Что означает «холодная война»?",
  "Ein Krieg im Winter": "Война зимой",
  "Die jahrzehntelange Konfrontation zwischen Ost und West ohne offenen Krieg zwischen den Blöcken":
    "Десятилетия противостояния между Востоком и Западом без открытой войны между блоками",
  "Ein Krieg um Rohstoffe": "Война за полезные ископаемые",
  "Der Krieg um Berlin": "Война за Берлин",
  "Spannungen, Wettrüsten und Stellvertreterkonflikte — Deutschland lag genau an der Grenze zwischen beiden Blöcken.":
    "Напряжённость, гонка вооружений и войны через посредников — Германия лежала ровно на границе между обоими блоками.",
  "Wofür steht die Abkürzung DDR?": "Что означает сокращение ГДР?",
  "Deutsches Demokratisches Reich": "Германский демократический рейх",
  "Deutscher Demokratischer Rat": "Германский демократический совет",
  "Deutsche Demokratische Regierung": "Германское демократическое правительство",
  "Deutsche Demokratische Republik — der Name behauptete eine Demokratie, die es nicht gab.":
    "Германская Демократическая Республика — название притязало на демократию, которой не было.",
  "Wie hieß die Jugendorganisation der DDR?": "Как называлась молодёжная организация ГДР?",
  "Junge Pioniere und FDJ": "Юные пионеры и ССНМ",
  "Bundesjugendring": "Федеральное кольцо молодёжи",
  "Jungdemokraten": "Молодые демократы",
  "Pfadfinder": "Скауты",
  "Junge Pioniere für die Jüngeren, die Freie Deutsche Jugend für die Älteren — beide der SED unterstellt.":
    "Юные пионеры для младших, Союз свободной немецкой молодёжи для старших — оба подчинены СЕПГ.",
  "Was war die Nationale Volksarmee?": "Что такое Национальная народная армия?",
  "Die Polizei der DDR": "Полиция ГДР",
  "Der Geheimdienst": "Тайная служба",
  "Eine Jugendorganisation": "Молодёжная организация",
  "Die NVA war die Armee der DDR. Der Geheimdienst hieß Staatssicherheit.":
    "ННА была армией ГДР. Тайная служба называлась госбезопасностью.",
  "Was bedeutete „Republikflucht“ in der DDR?": "Что означало в ГДР «бегство из республики»?",
  "Ein Urlaub im Ausland": "Отпуск за границей",
  "Das Verlassen der DDR ohne Genehmigung — es war strafbar":
    "Оставление ГДР без разрешения — это было наказуемо",
  "Der Umzug in eine andere Stadt": "Переезд в другой город",
  "Die Ausbürgerung von Künstlern": "Лишение гражданства деятелей искусства",
  "Wer ohne Erlaubnis in den Westen ging, machte sich strafbar; an der Grenze wurde geschossen.":
    "Кто уходил на Запад без разрешения, совершал преступление; на границе стреляли.",
  "Was war ein „Inoffizieller Mitarbeiter“ der Stasi?":
    "Кто такой «неофициальный сотрудник» госбезопасности?",
  "Ein Angestellter ohne Vertrag": "Служащий без договора",
  "Eine Person, die heimlich Informationen über andere weitergab":
    "Человек, который тайно передавал сведения о других",
  "Ein Grenzsoldat": "Пограничник",
  "Ein Mitglied der Volkskammer": "Член Народной палаты",
  "Hunderttausende bespitzelten Nachbarn, Kollegen, Freunde und sogar die eigene Familie.":
    "Сотни тысяч доносили на соседей, сослуживцев, друзей и даже на собственную семью.",
  "Wie war die Wirtschaft der DDR organisiert?": "Как было устроено хозяйство ГДР?",
  "Als freie Marktwirtschaft": "Как свободное рыночное хозяйство",
  "Als Planwirtschaft mit staatlichen Betrieben":
    "Как плановое хозяйство с государственными предприятиями",
  "Als soziale Marktwirtschaft": "Как социальное рыночное хозяйство",
  "Ohne jede Planung": "Без всякого плана",
  "Der Staat gab Produktionsziele vor und besaß die Betriebe (VEB — Volkseigener Betrieb).":
    "Государство задавало задания по выпуску и владело предприятиями (VEB — народное предприятие).",
  "Konnten DDR-Bürger frei in den Westen reisen?":
    "Могли ли граждане ГДР свободно ездить на Запад?",
  "Nein, das war für die meisten nicht möglich": "Нет, для большинства это было невозможно",
  "Ja, einmal im Jahr": "Да, раз в год",
  "Nur mit einem Reisepass": "Только с заграничным паспортом",
  "Reisen in den Westen waren streng beschränkt — genau deshalb wurde die Mauer gebaut.":
    "Поездки на Запад были строго ограничены — именно поэтому и построили стену.",
  "Warum gab es in der DDR trotz Wahlen keine echte Auswahl?":
    "Почему в ГДР при наличии выборов не было настоящего выбора?",
  "Weil niemand wählen wollte": "Потому что голосовать никто не хотел",
  "Weil nur eine Einheitsliste zur Abstimmung stand":
    "Потому что на голосование выносился только единый список",
  "Weil es keine Wahllokale gab": "Потому что не было избирательных участков",
  "Weil nur Parteimitglieder wählen durften": "Потому что голосовать могли только члены партии",
  "Die Sitzverteilung stand vorher fest; man konnte der Liste zustimmen, aber nicht zwischen Alternativen wählen.":
    "Распределение мест было известно заранее; списку можно было сказать «да», но выбирать между возможностями было нельзя.",
  "In welchem Jahr wurde Deutschland wiedervereinigt?":
    "В каком году Германия была воссоединена?",
  "1991": "1991",
  "1993": "1993",
  "Am 3. Oktober 1990. Die Mauer fiel schon im November 1989.":
    "3 октября 1990 года. Стена пала ещё в ноябре 1989-го.",
  "Von welcher Kirche gingen die Leipziger Montagsdemonstrationen aus?":
    "От какой церкви пошли лейпцигские понедельничные демонстрации?",
  "Vom Kölner Dom": "От Кёльнского собора",
  "Von der Nikolaikirche": "От церкви святого Николая",
  "Von der Frauenkirche": "От Фрауэнкирхе",
  "Von der Marienkirche": "От церкви святой Марии",
  "Die Friedensgebete in der Leipziger Nikolaikirche waren der Ausgangspunkt der Montagsdemonstrationen.":
    "Молитвы о мире в лейпцигской церкви святого Николая были отправной точкой понедельничных демонстраций.",
  "Welcher sowjetische Staatschef ermöglichte durch seine Reformpolitik den Wandel im Osten?":
    "Какой советский глава государства своей политикой преобразований сделал возможными перемены на Востоке?",
  "Leonid Breschnew": "Леонид Брежнев",
  "Michail Gorbatschow": "Михаил Горбачёв",
  "Josef Stalin": "Иосиф Сталин",
  "Boris Jelzin": "Борис Ельцин",
  "Gorbatschows Glasnost und Perestroika machten den friedlichen Umbruch in Mittel- und Osteuropa möglich.":
    "Гласность и перестройка Горбачёва сделали возможным мирный перелом в Средней и Восточной Европе.",
  "Wie wurde die DDR Teil der Bundesrepublik?": "Как ГДР стала частью Федеративной Республики?",
  "Durch eine neue gemeinsame Verfassung": "Через новую общую конституцию",
  "Durch Beitritt der DDR zum Geltungsbereich des Grundgesetzes":
    "Через присоединение ГДР к области действия Основного закона",
  "Durch einen Beschluss der Vereinten Nationen": "Через решение Организации Объединённых Наций",
  "Durch eine Volksabstimmung im Westen": "Через всенародное голосование на Западе",
  "Der Beitrittsweg nach dem damaligen Artikel 23 — das Grundgesetz galt danach für ganz Deutschland.":
    "Путь присоединения по тогдашней статье 23 — после этого Основной закон действовал для всей Германии.",
  "Welche Rolle spielte die Währungsunion vom 1. Juli 1990?":
    "Какую роль сыграл валютный союз от 1 июля 1990 года?",
  "Sie führte den Euro ein": "Он ввёл евро",
  "Sie brachte die D-Mark in die DDR, noch vor der staatlichen Einheit":
    "Он принёс немецкую марку в ГДР ещё до государственного единства",
  "Sie schaffte das Bargeld ab": "Он отменил наличные деньги",
  "Sie war Teil des Zwei-plus-Vier-Vertrags": "Он был частью договора «два плюс четыре»",
  "Drei Monate vor der Vereinigung wurde die D-Mark auch im Osten gesetzliches Zahlungsmittel.":
    "За три месяца до объединения немецкая марка стала законным платёжным средством и на востоке.",
  "Welche vier Mächte unterzeichneten mit beiden deutschen Staaten den Zwei-plus-Vier-Vertrag?":
    "Какие четыре державы подписали с обоими немецкими государствами договор «два плюс четыре»?",
  "USA, Frankreich, Polen, Italien": "США, Франция, Польша, Италия",
  "USA, China, Frankreich, Sowjetunion": "США, Китай, Франция, Советский Союз",
  "Dieselben vier Siegermächte von 1945 — damit war die Nachkriegsordnung förmlich abgeschlossen.":
    "Те же четыре державы-победительницы 1945 года — этим послевоенный порядок был формально завершён.",
  "Wie wird der Umbruch von 1989 in der DDR genannt?": "Как называют перелом 1989 года в ГДР?",
  "Bürgerkrieg": "Гражданской войной",
  "Friedliche Revolution": "Мирной революцией",
  "Putsch": "Переворотом",
  "Reformation": "Реформацией",
  "Friedliche Revolution — sie kam ohne Gewalt der Demonstrierenden aus.":
    "Мирная революция — она обошлась без насилия со стороны демонстрантов.",
  "Was ist die Bedeutung des Brandenburger Tors für die deutsche Einheit?":
    "В чём значение Бранденбургских ворот для немецкого единства?",
  "Dort wurde die Verfassung unterschrieben": "Там была подписана конституция",
  "Es stand direkt an der Mauer und wurde zum Symbol der Teilung und dann der Einheit":
    "Они стояли прямо у стены и стали знаком сначала раздела, а потом единства",
  "Dort tagt der Bundestag": "Там заседает Бундестаг",
  "Es ist das älteste Gebäude Berlins": "Это самое старое здание Берлина",
  "Jahrzehntelang unzugänglich im Grenzstreifen, heute das Bild schlechthin für das wiedervereinigte Deutschland.":
    "Десятилетиями недоступные в пограничной полосе, сегодня они — главный образ воссоединённой Германии.",
  "Welche Farbe hat die Flagge der Europäischen Union?": "Какого цвета флаг Европейского союза?",
  "Blau mit zwölf goldenen Sternen im Kreis": "Синий с двенадцатью золотыми звёздами по кругу",
  "Grün mit weißem Kreuz": "Зелёный с белым крестом",
  "Gold mit blauem Adler": "Золотой с синим орлом",
  "Zwölf Sterne auf blauem Grund — die Zahl steht für Vollständigkeit, nicht für die Mitgliederzahl.":
    "Двенадцать звёзд на синем поле — число означает полноту, а не количество государств-членов.",
  "Wo hat das Europäische Parlament seinen Hauptsitz?":
    "Где находится главное местопребывание Европейского парламента?",
  "Brüssel": "В Брюсселе",
  "Straßburg": "В Страсбурге",
  "Luxemburg": "В Люксембурге",
  "Den Haag": "В Гааге",
  "Straßburg ist der Sitz; viele Ausschüsse tagen in Brüssel, das Generalsekretariat sitzt in Luxemburg.":
    "Местопребывание — Страсбург; многие комитеты заседают в Брюсселе, а генеральный секретариат сидит в Люксембурге.",
  "Was ist der Schengen-Raum?": "Что такое Шенгенское пространство?",
  "Ein Gebiet ohne Steuern": "Область без налогов",
  "Ein Gebiet, in dem an den Binnengrenzen normalerweise nicht kontrolliert wird":
    "Область, где на внутренних границах обычно не проверяют",
  "Der Sitz der EU-Kommission": "Местопребывание Европейской комиссии",
  "Die Zone der Euro-Länder": "Зона стран евро",
  "Reisen ohne Grenzkontrolle. Nicht dasselbe wie die Eurozone — die Mitgliederkreise überschneiden sich nur.":
    "Поездки без пограничной проверки. Это не то же самое, что зона евро — круги участников лишь пересекаются.",
  "Welches Land verließ die EU im Jahr 2020?":
    "Какая страна вышла из Европейского союза в 2020 году?",
  "Norwegen": "Норвегия",
  "Das Vereinigte Königreich": "Соединённое Королевство",
  "Die Schweiz": "Швейцария",
  "Island": "Исландия",
  "Der Brexit. Norwegen, die Schweiz und Island waren nie Mitglied der EU.":
    "Брексит. Норвегия, Швейцария и Исландия членами Европейского союза никогда не были.",
  "Wofür ist der Europarat zuständig — im Unterschied zur EU?":
    "За что отвечает Совет Европы — в отличие от Европейского союза?",
  "Für den Binnenmarkt": "За общий рынок",
  "Für Menschenrechte, Demokratie und Rechtsstaatlichkeit, mit deutlich mehr Mitgliedstaaten":
    "За права человека, демократию и правовое государство, и государств-членов у него заметно больше",
  "Für die gemeinsame Währung": "За общую валюту",
  "Für die Verteidigung": "За оборону",
  "Zum Europarat gehört auch der Europäische Gerichtshof für Menschenrechte. Er ist älter und größer als die EU.":
    "К Совету Европы относится и Европейский суд по правам человека. Он старше и больше Европейского союза.",
  "Was bedeutet die Unionsbürgerschaft?": "Что означает гражданство Союза?",
  "Sie ersetzt die nationale Staatsangehörigkeit": "Оно заменяет собственное гражданство страны",
  "Sie kommt zur nationalen Staatsangehörigkeit hinzu und bringt Rechte wie Freizügigkeit und das Kommunalwahlrecht":
    "Оно добавляется к гражданству страны и даёт права вроде свободы передвижения и права голоса на общинных выборах",
  "Sie gilt nur für Beamte der EU": "Оно действует только для служащих Европейского союза",
  "Sie muss beantragt werden": "О нём нужно подавать заявление",
  "Jeder Staatsangehörige eines Mitgliedstaates ist automatisch auch Unionsbürger.":
    "Каждый гражданин государства-члена сам собой является и гражданином Союза.",
  "Seit wann ist die Bundesrepublik Mitglied der NATO?":
    "С какого времени Федеративная Республика состоит в НАТО?",
  "1955": "1955",
  "1955, im Zuge der Westbindung. 1949 wurde die Bundesrepublik gegründet, 1973 trat sie den UN bei.":
    "С 1955 года, в ходе привязки к Западу. В 1949 году Федеративная Республика была основана, в 1973 она вступила в ООН.",
  "Welche deutsche Institution überwacht heute nicht mehr die Geldpolitik des Euro?":
    "Какое немецкое учреждение сегодня уже не ведает денежной политикой евро?",
  "Die Deutsche Bundesbank — die Geldpolitik macht die Europäische Zentralbank":
    "Немецкий федеральный банк — денежную политику ведёт Европейский центральный банк",
  "Das Bundesfinanzministerium": "Федеральное министерство финансов",
  "Der Bundesrechnungshof": "Федеральная счётная палата",
  "Die Bundesanstalt für Finanzdienstleistungsaufsicht":
    "Федеральное ведомство надзора за финансовыми услугами",
  "Seit der Währungsunion entscheidet die EZB in Frankfurt über die Geldpolitik; die Bundesbank wirkt dort mit.":
    "После валютного союза о денежной политике решает Европейский центральный банк во Франкфурте; федеральный банк в этом участвует.",
  "Welches Land grenzt NICHT an Deutschland?": "Какая страна НЕ граничит с Германией?",
  "Dänemark": "Дания",
  "Italien": "Италия",
  "Belgien": "Бельгия",
  "Italien hat keine gemeinsame Grenze mit Deutschland — dazwischen liegen Österreich und die Schweiz.":
    "У Италии нет общей границы с Германией — между ними лежат Австрия и Швейцария.",
  "Welcher Fluss fließt durch Köln?": "Какая река течёт через Кёльн?",
  "Der Rhein. Die Elbe fließt durch Dresden und Hamburg, die Weser durch Bremen.":
    "Рейн. Эльба течёт через Дрезден и Гамбург, Везер — через Бремен.",
  "Wie heißt das höchste Mittelgebirge Norddeutschlands mit dem Brocken?":
    "Как называется самое высокое среднегорье Северной Германии с горой Броккен?",
  "Der Schwarzwald": "Шварцвальд",
  "Der Harz": "Гарц",
  "Das Erzgebirge": "Рудные горы",
  "Der Thüringer Wald": "Тюрингенский лес",
  "Der Harz mit dem Brocken. Schwarzwald und Erzgebirge liegen im Süden beziehungsweise Osten.":
    "Гарц с Броккеном. Шварцвальд и Рудные горы лежат соответственно на юге и на востоке.",
  "Was bedeuten die Farben Schwarz-Rot-Gold historisch?":
    "Что исторически означают чёрный, красный и золотой цвета?",
  "Die drei Besatzungsmächte": "Три державы, занимавшие страну",
  "Sie stehen seit dem 19. Jahrhundert für Einheit und Freiheit":
    "С XIX века они означают единство и свободу",
  "Die drei größten Bundesländer": "Три самые большие федеральные земли",
  "Die drei Staatsgewalten": "Три ветви государственной власти",
  "Aus der Freiheitsbewegung des 19. Jahrhunderts, übernommen von der Paulskirche 1848 und der Weimarer Republik.":
    "Они идут от освободительного движения XIX века, их взяли Франкфуртское собрание 1848 года и Веймарская республика.",
  "Welche deutsche Stadt ist zugleich Bundesland und liegt an der Weser?":
    "Какой немецкий город является одновременно федеральной землёй и лежит на Везере?",
  "Bremen": "Бремен",
  "Kiel": "Киль",
  "Bremen liegt an der Weser, Hamburg an der Elbe — beide sind Stadtstaaten.":
    "Бремен лежит на Везере, Гамбург на Эльбе — оба являются городами-землями.",
  "Wer schrieb den Text der deutschen Nationalhymne?": "Кто написал слова немецкого гимна?",
  "August Heinrich Hoffmann von Fallersleben": "Август Генрих Гофман фон Фаллерслебен",
  "Joseph Haydn": "Йозеф Гайдн",
  "Hoffmann von Fallersleben schrieb den Text 1841, die Melodie stammt von Joseph Haydn.":
    "Гофман фон Фаллерслебен написал слова в 1841 году, а мелодия принадлежит Йозефу Гайдну.",
  "Welche Stadt ist die Hauptstadt von Nordrhein-Westfalen?":
    "Какой город является столицей земли Северный Рейн — Вестфалия?",
  "Düsseldorf": "Дюссельдорф",
  "Dortmund": "Дортмунд",
  "Essen": "Эссен",
  "Düsseldorf. Köln ist zwar größer, aber nicht die Landeshauptstadt.":
    "Дюссельдорф. Кёльн хотя и больше, но столицей земли не является.",
  "Welcher See bildet ein Dreiländereck mit Österreich und der Schweiz?":
    "Какое озеро образует стык границ с Австрией и Швейцарией?",
  "Der Chiemsee": "Кимзе",
  "Der Bodensee": "Боденское озеро",
  "Die Müritz": "Мюриц",
  "Der Starnberger See": "Штарнбергское озеро",
  "Der Bodensee. Die Müritz ist der größte See, der ganz in Deutschland liegt.":
    "Боденское озеро. Мюриц — самое большое озеро, целиком лежащее в Германии.",
  "Muss man in Deutschland einer Religion angehören?":
    "Обязан ли человек в Германии принадлежать к какой-нибудь религии?",
  "Ja, man muss sich entscheiden": "Да, нужно определиться",
  "Nein, niemand muss einer Religionsgemeinschaft angehören":
    "Нет, принадлежать к религиозной общине не обязан никто",
  "Ja, ab 18 Jahren": "Да, с 18 лет",
  "Nur für die Eheschließung": "Только для заключения брака",
  "Religionsfreiheit schließt die Freiheit ein, keiner Religion anzugehören — etwa die Hälfte der Bevölkerung gehört keiner an.":
    "Свобода вероисповедания включает свободу не принадлежать ни к какой религии — примерно половина населения не принадлежит ни к одной.",
  "Wie viele Menschen muslimischen Glaubens leben ungefähr in Deutschland?":
    "Сколько примерно людей мусульманского вероисповедания живёт в Германии?",
  "Etwa 100.000": "Около 100 000",
  "Etwa 5 Millionen": "Около 5 миллионов",
  "Etwa 20 Millionen": "Около 20 миллионов",
  "Etwa 500": "Около 500",
  "Rund fünf Millionen — der Islam ist die größte nichtchristliche Religion in Deutschland.":
    "Около пяти миллионов — ислам является самой большой нехристианской религией в Германии.",
  "Was passiert, wenn man aus der Kirche austritt?": "Что происходит при выходе из церкви?",
  "Man muss eine Strafe zahlen": "Приходится платить штраф",
  "Man zahlt keine Kirchensteuer mehr und verliert Rechte innerhalb der Kirche":
    "Церковный налог больше не платят, а права внутри церкви теряют",
  "Man verliert die Staatsangehörigkeit": "Теряют гражданство",
  "Nichts ändert sich": "Ничего не меняется",
  "Der Austritt wird beim Standesamt oder Amtsgericht erklärt; danach entfällt die Kirchensteuer.":
    "О выходе заявляют в Standesamt или в участковом суде; после этого церковный налог отпадает.",
  "Ein Vater will seine Tochter nicht am Schwimmunterricht teilnehmen lassen. Was gilt?":
    "Отец не хочет пускать дочь на уроки плавания. Что действует?",
  "Die Schulpflicht gilt auch für den Sportunterricht; die Schule sucht praktische Lösungen":
    "Обязательное школьное обучение распространяется и на физкультуру; школа ищет применимые решения",
  "Der Vater entscheidet allein": "Решает один отец",
  "Das Kind wird vom Unterricht befreit": "Ребёнка освобождают от занятий",
  "Die Schule muss den Unterricht abschaffen": "Школа обязана отменить эти уроки",
  "Die Schulpflicht steht über privaten Vorbehalten. Schulen ermöglichen etwa geeignete Badekleidung, ein Fernbleiben aber nicht.":
    "Обязательное школьное обучение стоит выше частных оговорок. Школы допускают, например, подходящую одежду для купания, но не отсутствие на уроке.",
  "Was bedeutet die weltanschauliche Neutralität des Staates?":
    "Что означает мировоззренческая беспристрастность государства?",
  "Der Staat verbietet Religion": "Государство запрещает религию",
  "Der Staat bevorzugt oder benachteiligt keine Religion und hat selbst keine":
    "Государство не отдаёт предпочтения ни одной религии и не ущемляет ни одну, а собственной не имеет",
  "Der Staat bestimmt die Religion der Bürger": "Государство определяет религию граждан",
  "Es gibt keine Staatskirche. Der Staat arbeitet mit Religionsgemeinschaften zusammen, ohne sich mit einer zu identifizieren.":
    "Государственной церкви нет. Государство работает вместе с религиозными общинами, не отождествляя себя ни с одной.",
  "Welches Fest feiern Christen zu Ostern?": "Какое событие христиане празднуют на Пасху?",
  "Die Geburt Jesu": "Рождение Иисуса",
  "Die Auferstehung Jesu": "Воскресение Иисуса",
  "Die Taufe Jesu": "Крещение Иисуса",
  "Das Ende des Fastenmonats": "Конец месяца поста",
  "Ostern ist das Fest der Auferstehung. Die Geburt wird zu Weihnachten gefeiert.":
    "Пасха — праздник Воскресения. Рождение празднуют на Рождество.",
  "Darf man in Deutschland die Religion wechseln?": "Можно ли в Германии сменить религию?",
  "Ja, jeder darf frei entscheiden": "Да, каждый решает свободно",
  "Der Wechsel des Glaubens und der Austritt sind ausdrücklich geschützt — auch gegen den Willen der Familie.":
    "Смена веры и выход из общины защищены прямо — в том числе против воли семьи.",
  "Welche Rolle haben die Kirchen in der sozialen Arbeit in Deutschland?":
    "Какова роль церквей в социальной работе в Германии?",
  "Sie dürfen keine sozialen Einrichtungen betreiben":
    "Им нельзя содержать социальные учреждения",
  "Caritas und Diakonie gehören zu den größten Trägern von Kitas, Krankenhäusern und Pflegeheimen":
    "«Каритас» и «Диакония» относятся к крупнейшим содержателям детских садов, больниц и домов ухода",
  "Sie betreiben nur Kirchen": "Они содержат только церкви",
  "Sie sind für die Sozialversicherung zuständig": "Они ведают социальным страхованием",
  "Die kirchlichen Wohlfahrtsverbände sind neben AWO, DRK und Paritätischem tragende Säulen der sozialen Infrastruktur.":
    "Церковные благотворительные союзы наряду с рабочей взаимопомощью, Красным Крестом и объединением равных являются несущими опорами социального устройства.",
  "Wer entscheidet in Deutschland, wen eine erwachsene Person heiratet?":
    "Кто в Германии решает, на ком женится или за кого выходит замуж взрослый человек?",
  "Die Eltern": "Родители",
  "Die Person selbst": "Сам человек",
  "Die Religionsgemeinschaft": "Религиозная община",
  "Jede volljährige Person entscheidet selbst. Zwangsheirat ist eine Straftat.":
    "Каждый совершеннолетний решает сам. Принуждение к браку является преступлением.",
  "Was ist das Sorgerecht?": "Что такое родительское попечение?",
  "Das Recht, für ein Kind zu sorgen und es zu vertreten":
    "Право заботиться о ребёнке и представлять его",
  "Das Recht auf Unterhalt": "Право на содержание",
  "Das Recht, die Wohnung zu behalten": "Право сохранить за собой жильё",
  "Das Recht auf Elternzeit": "Право на отпуск по уходу за ребёнком",
  "Es umfasst Erziehung, Aufenthaltsbestimmung und die rechtliche Vertretung des Kindes — nach einer Trennung oft gemeinsam.":
    "Оно охватывает воспитание, определение места жительства и правовое представительство ребёнка — после расставания чаще всего совместное.",
  "Wer muss nach einer Scheidung für die gemeinsamen Kinder Unterhalt zahlen?":
    "Кто после развода обязан платить содержание на общих детей?",
  "In der Regel der Elternteil, bei dem die Kinder nicht überwiegend leben":
    "Как правило тот родитель, с которым дети преимущественно не живут",
  "Immer der Vater": "Всегда отец",
  "Beide Eltern bleiben unterhaltspflichtig; wer betreut, leistet seinen Teil durch die Betreuung.":
    "Обязанность содержания остаётся на обоих родителях; тот, кто ухаживает, вносит свою часть уходом.",
  "Was kann die Polizei bei häuslicher Gewalt tun?":
    "Что может сделать полиция при насилии в семье?",
  "Nichts, das ist Privatsache": "Ничего, это частное дело",
  "Den Gewalttätigen aus der Wohnung verweisen und ein Kontaktverbot veranlassen":
    "Выдворить того, кто применяет насилие, из жилья и добиться запрета на приближение",
  "Nur ein Protokoll aufnehmen": "Только составить протокол",
  "Beide Beteiligten mitnehmen": "Забрать обоих участников",
  "Das Gewaltschutzgesetz erlaubt Wohnungsverweisung und Näherungsverbot — der Schutz geht vor dem Wohnrecht des Täters.":
    "Закон о защите от насилия допускает выдворение из жилья и запрет приближаться — защита идёт впереди права виновного на жильё.",
  "Ab welchem Alter gilt ein Mensch in Deutschland als volljährig?":
    "С какого возраста человек в Германии считается совершеннолетним?",
  "Mit 16": "С 16",
  "Mit 18": "С 18",
  "Mit 21": "С 21",
  "Mit der Heirat": "С вступлением в брак",
  "Mit 18 — damit gelten volle Geschäftsfähigkeit, Wahlrecht zum Bundestag und Ehefähigkeit.":
    "С 18 лет — с этого возраста наступают полная дееспособность, право избирать в Бундестаг и способность вступать в брак.",
  "Was ist eine Patchwork-Familie?": "Что такое лоскутная семья?",
  "Eine Familie mit vielen Kindern": "Семья со многими детьми",
  "Eine Familie, in der Partner mit Kindern aus früheren Beziehungen zusammenleben":
    "Семья, где вместе живут партнёры с детьми от прежних отношений",
  "Eine Familie ohne Kinder": "Семья без детей",
  "Eine Familie, die im Ausland lebt": "Семья, живущая за границей",
  "Eine von vielen anerkannten Familienformen neben Ehepaaren, Alleinerziehenden und gleichgeschlechtlichen Paaren.":
    "Одна из многих признанных форм семьи наряду с супружескими парами, одинокими родителями и однополыми парами.",
  "Dürfen Eltern in Deutschland ihre Kinder schlagen?":
    "Можно ли в Германии родителям бить своих детей?",
  "Ja, zur Erziehung": "Да, в воспитательных целях",
  "Nein, Kinder haben ein Recht auf gewaltfreie Erziehung":
    "Нет, у детей есть право на воспитание без насилия",
  "Nur leichte Strafen sind erlaubt": "Разрешены только лёгкие наказания",
  "Nur bis zum 6. Lebensjahr": "Только до 6 лет",
  "Körperliche Bestrafung ist verboten und kann strafbar sein — seit 2000 steht das ausdrücklich im Gesetz.":
    "Телесное наказание запрещено и может быть наказуемо — с 2000 года это прямо записано в законе.",
  "Was gilt für die Gleichberechtigung in der Ehe?":
    "Что действует в отношении равноправия в браке?",
  "Der Mann entscheidet über den Wohnort": "Место жительства определяет муж",
  "Beide Partner sind gleichberechtigt und entscheiden gemeinsam":
    "Оба супруга равноправны и решают вместе",
  "Die Frau muss den Haushalt führen": "Жена обязана вести хозяйство",
  "Der Hauptverdiener entscheidet": "Решает тот, кто зарабатывает больше",
  "Artikel 3 gilt auch in der Ehe. Aufgabenteilung ist Verhandlungssache, keine Vorschrift.":
    "Статья 3 действует и в браке. Разделение дел — предмет договорённости, а не предписание.",
  "Kostet der Besuch staatlicher Schulen in Deutschland Schulgeld?":
    "Берут ли в Германии плату за посещение государственных школ?",
  "Ja, monatlich": "Да, ежемесячно",
  "Nein, staatliche Schulen sind grundsätzlich kostenfrei":
    "Нет, государственные школы в основном бесплатны",
  "Nur ab der Oberstufe": "Только со старших классов",
  "Nur für Nichtdeutsche": "Только с ненемцев",
  "Der Unterricht ist kostenfrei. Für Ausflüge oder Material können kleine Beiträge anfallen.":
    "Уроки бесплатны. За поездки или материалы могут набегать небольшие взносы.",
  "Was ist ein Integrationskurs?": "Что такое интеграционный курс?",
  "Ein Sportkurs": "Курс физкультуры",
  "Ein Sprachkurs mit anschließendem Orientierungskurs zu Recht, Geschichte und Kultur":
    "Языковой курс, за которым следует ознакомительный курс о праве, истории и культуре",
  "Ein Kurs für Lehrer": "Курс для учителей",
  "Eine Berufsausbildung": "Профессиональное обучение",
  "Er endet mit der Sprachprüfung und dem Test „Leben in Deutschland“ — demselben Katalog wie beim Einbürgerungstest.":
    "Он кончается языковым экзаменом и тестом «Жизнь в Германии» — по тому же перечню вопросов, что и тест на гражданство.",
  "Wer entscheidet über die Lehrpläne an Schulen?": "Кто решает об учебных планах в школах?",
  "Die Schulen allein": "Сами школы",
  "Die EU": "Европейский союз",
  "Bildung ist Ländersache — deshalb unterscheiden sich Lehrpläne, Schulformen und Ferienzeiten.":
    "Образование — дело земель, поэтому учебные планы, виды школ и сроки каникул различаются.",
  "Was ist die Fachhochschulreife?": "Что такое зрелость для высшей школы прикладных наук?",
  "Ein Abschluss, der zum Studium an einer Fachhochschule berechtigt":
    "Свидетельство, дающее право учиться в высшей школе прикладных наук",
  "Ein Abschluss nach der 9. Klasse": "Свидетельство об окончании 9 класса",
  "Ein Zeugnis über einen Sprachkurs": "Справка о прохождении языкового курса",
  "Sie öffnet den Weg an Fachhochschulen; das Abitur berechtigt zusätzlich zum Universitätsstudium.":
    "Она открывает путь в высшие школы прикладных наук; аттестат зрелости даёт сверх того право учиться в университете.",
  "Wer trägt bei einer dualen Ausbildung die Kosten der Berufsschule?":
    "Кто при двойном профессиональном обучении несёт расходы на профессиональную школу?",
  "Der Auszubildende": "Сам ученик",
  "Das Bundesland als Schulträger": "Федеральная земля как содержатель школы",
  "Der Ausbildungsbetrieb allein": "Одно только предприятие, где идёт обучение",
  "Die Berufsschule ist eine staatliche Schule und damit Ländersache. Der Betrieb zahlt die Ausbildungsvergütung.":
    "Профессиональная школа является государственной и потому относится к делам земли. Предприятие платит содержание ученику.",
  "Was bietet eine Volkshochschule an?": "Что предлагает народная высшая школа?",
  "Nur Universitätsstudiengänge": "Только университетские программы",
  "Günstige Kurse für Erwachsene — Sprachen, Computer, Integrations- und Orientierungskurse":
    "Недорогие курсы для взрослых — языки, работа с компьютером, интеграционные и ознакомительные курсы",
  "Nur Sportkurse": "Только курсы физкультуры",
  "Ausschließlich Kurse für Jugendliche": "Исключительно курсы для подростков",
  "Die VHS ist die verbreitetste Einrichtung der Erwachsenenbildung; dort wird auch der Test „Leben in Deutschland“ abgenommen.":
    "Народная высшая школа — самое распространённое учреждение образования для взрослых; там же принимают тест «Жизнь в Германии».",
  "Wie lange dauert die Schulpflicht in Deutschland mindestens?":
    "Сколько лет в Германии длится обязательное школьное обучение как минимум?",
  "4 Jahre": "4 года",
  "9 Jahre": "9 лет",
  "12 Jahre": "12 лет",
  "13 Jahre": "13 лет",
  "Mindestens neun Schuljahre, in einigen Ländern zehn — dazu kommt oft die Berufsschulpflicht.":
    "Не менее девяти школьных лет, в некоторых землях десять — к этому часто добавляется обязанность посещать профессиональную школу.",
  "Wo lässt man einen im Ausland erworbenen Berufsabschluss anerkennen?":
    "Где добиваются признания профессионального диплома, полученного за границей?",
  "Beim Einwohnermeldeamt": "В ведомстве регистрации жителей",
  "Bei der zuständigen Stelle wie Kammer oder Landesbehörde, oft mit Beratung durch das IQ-Netzwerk":
    "В ведающем этим месте — палате или ведомстве земли, часто с советом от сети IQ",
  "Beim Finanzamt": "В налоговом ведомстве",
  "Bei der Krankenkasse": "В медицинской кассе",
  "Welche Stelle zuständig ist, hängt vom Beruf ab — Kammern für Handwerk und Industrie, Landesbehörden für reglementierte Berufe.":
    "Какое место этим ведает, зависит от профессии — палаты для ремесла и промышленности, ведомства земель для занятий, требующих допуска.",
  "Was ist eine Probezeit?": "Что такое испытательный срок?",
  "Die ersten Wochen ohne Bezahlung": "Первые недели без оплаты",
  "Eine Anfangszeit, in der beide Seiten mit kürzerer Frist kündigen können":
    "Начальное время, когда обе стороны могут расторгнуть договор с более коротким сроком предупреждения",
  "Eine unbezahlte Einarbeitung": "Неоплачиваемое вхождение в работу",
  "Die Zeit bis zur ersten Gehaltserhöhung": "Время до первого повышения оклада",
  "In der Probezeit — meist bis zu sechs Monate — gilt eine verkürzte Kündigungsfrist. Bezahlt wird ganz normal.":
    "На испытательном сроке — чаще всего до шести месяцев — действует укороченный срок предупреждения. Платят при этом совершенно обычно.",
  "Was ist eine Lohnsteuerbescheinigung?": "Что такое справка о налоге с заработка?",
  "Die Rechnung des Arbeitgebers": "Счёт от работодателя",
  "Eine jährliche Übersicht über Lohn und abgeführte Steuern, wichtig für die Steuererklärung":
    "Годовая сводка о заработке и удержанных налогах, важная для налоговой декларации",
  "Ein Antrag auf Arbeitslosengeld": "Заявление на пособие по безработице",
  "Der Arbeitgeber stellt sie am Jahresende aus; sie ist die Grundlage der Einkommensteuererklärung.":
    "Работодатель выдаёт её в конце года; она служит основой для декларации по подоходному налогу.",
  "Was regelt das Arbeitszeitgesetz unter anderem?":
    "Что среди прочего устанавливает закон о рабочем времени?",
  "Die Höhe des Lohns": "Размер заработка",
  "Höchstarbeitszeiten, Ruhepausen und die Ruhezeit zwischen zwei Arbeitstagen":
    "Наибольшее рабочее время, перерывы на отдых и время отдыха между двумя рабочими днями",
  "Die Urlaubsziele": "Места для отпуска",
  "Die Kleidung am Arbeitsplatz": "Одежду на рабочем месте",
  "In der Regel höchstens acht Stunden täglich, mit vorgeschriebenen Pausen und mindestens elf Stunden Ruhe bis zum nächsten Tag.":
    "Как правило не более восьми часов в день, с предписанными перерывами и не менее чем одиннадцатью часами отдыха до следующего дня.",
  "Was gilt für schwangere Arbeitnehmerinnen?": "Что действует в отношении беременных работниц?",
  "Sie können jederzeit gekündigt werden": "Их можно уволить в любое время",
  "Es gilt ein besonderer Kündigungsschutz und der Mutterschutz":
    "Действует особая защита от увольнения и охрана материнства",
  "Sie müssen sofort aufhören zu arbeiten": "Они обязаны немедленно прекратить работу",
  "Es gibt keine besonderen Regeln": "Особых правил нет",
  "Der Mutterschutz umfasst Kündigungsschutz, Schutzfristen vor und nach der Geburt und Beschäftigungsverbote bei Gefährdung.":
    "Охрана материнства включает защиту от увольнения, охранные сроки до и после родов и запрет на работу при опасности.",
  "Was ist Kurzarbeit?": "Что такое сокращённая работа?",
  "Eine Teilzeitstelle": "Работа на неполную ставку",
  "Vorübergehend verkürzte Arbeitszeit, bei der die Agentur für Arbeit einen Teil des Lohnausfalls ersetzt":
    "Временно укороченное рабочее время, при котором агентство по труду возмещает часть потерянного заработка",
  "Arbeit auf Abruf": "Работа по вызову",
  "Ein befristeter Vertrag": "Срочный договор",
  "Ein Instrument, um in Krisen Entlassungen zu vermeiden — in der Finanzkrise und in der Pandemie im großen Stil eingesetzt.":
    "Средство избежать увольнений в тяжёлые времена — в финансовый кризис и в пандемию его применяли широко.",
  "Wer vertritt die Interessen der Arbeitnehmer bei Tarifverhandlungen?":
    "Кто представляет интересы работников на тарифных переговорах?",
  "Der Betriebsrat": "Совет предприятия",
  "Die Gewerkschaft": "Профсоюз",
  "Tarifverträge handeln Gewerkschaften mit Arbeitgeberverbänden aus. Der Betriebsrat vertritt die Belegschaft im einzelnen Betrieb.":
    "Тарифные соглашения заключают профсоюзы с союзами работодателей. Совет предприятия представляет работников на отдельном предприятии.",
  "Was musst du tun, wenn du krank bist und nicht arbeiten kannst?":
    "Что нужно сделать, если ты заболел и работать не можешь?",
  "Nichts, der Arbeitgeber merkt es": "Ничего, работодатель сам заметит",
  "Dich unverzüglich beim Arbeitgeber melden": "Немедленно сообщить работодателю",
  "Erst nach drei Tagen Bescheid geben": "Дать знать только через три дня",
  "Nur die Krankenkasse informieren": "Известить одну лишь медицинскую кассу",
  "Die Krankmeldung erfolgt sofort. Ab wann ein ärztliches Attest nötig ist, steht im Arbeitsvertrag oder Tarifvertrag.":
    "О болезни сообщают сразу. С какого дня нужна справка от врача, стоит в трудовом договоре или тарифном соглашении.",
  "Was ist ein Minijob?": "Что такое минимальная подработка?",
  "Eine Beschäftigung mit geringem monatlichem Verdienst und besonderen Abgabenregeln":
    "Занятость с небольшим месячным заработком и особыми правилами отчислений",
  "Ein Job für Jugendliche unter 16": "Работа для подростков младше 16 лет",
  "Eine unbezahlte Tätigkeit": "Неоплачиваемая работа",
  "Ein Praktikum": "Практика",
  "Geringfügige Beschäftigung bis zu einer Verdienstgrenze; der Arbeitgeber führt Pauschalabgaben ab, Kündigungsschutz und Urlaub gelten trotzdem.":
    "Незначительная занятость до предела заработка; работодатель платит отчисления по общей ставке, а защита от увольнения и отпуск действуют всё равно.",
  "Wohin gehören leere Glasflaschen ohne Pfand?":
    "Куда девают пустые стеклянные бутылки без залога?",
  "In den Restmüll": "В остаточный мусор",
  "In den Altglascontainer, nach Farben getrennt": "В бак для стекла, разделив по цветам",
  "In die Biotonne": "В бак для биологических отходов",
  "In den Papiercontainer": "В бак для бумаги",
  "Weiß, grün und braun getrennt. Auf Pfandflaschen gibt es das Geld im Laden zurück.":
    "Белое, зелёное и коричневое раздельно. За залоговые бутылки деньги отдают в магазине.",
  "Was sind Nebenkosten bei einer Mietwohnung?":
    "Что такое дополнительные расходы при съёмном жилье?",
  "Die Miete selbst": "Сама плата за наём",
  "Kosten für Heizung, Wasser, Müll und ähnliche Betriebskosten":
    "Расходы на отопление, воду, вывоз мусора и подобные эксплуатационные затраты",
  "Die Kaution": "Залог",
  "Die Maklergebühr": "Плата посреднику",
  "Sie werden monatlich vorausgezahlt und einmal jährlich abgerechnet — mit Nachzahlung oder Guthaben.":
    "Их платят ежемесячно вперёд, а раз в год подводят счёт — с доплатой или с возвратом.",
  "Wo meldest du dich an, wenn du nach Deutschland ziehst?":
    "Где регистрируются при переезде в Германию?",
  "Beim Einwohnermeldeamt oder Bürgeramt":
    "В ведомстве регистрации жителей или в ведомстве по делам граждан",
  "Bei der Polizei": "В полиции",
  "Beim Arbeitgeber": "У работодателя",
  "Die Anmeldung erfolgt innerhalb von zwei Wochen beim Bürgeramt der Gemeinde.":
    "Регистрацию проходят в течение двух недель в ведомстве по делам граждан своей общины.",
  "Was ist der Rundfunkbeitrag?": "Что такое взнос на вещание?",
  "Eine freiwillige Spende": "Добровольное пожертвование",
  "Ein Beitrag pro Wohnung zur Finanzierung des öffentlich-rechtlichen Rundfunks":
    "Взнос с каждого жилья на содержание общественно-правового вещания",
  "Eine Steuer auf Fernsehgeräte": "Налог на телевизоры",
  "Eine Gebühr für das Internet": "Плата за интернет",
  "Er wird je Wohnung erhoben, unabhängig davon, wie viele Geräte vorhanden sind. Bei geringem Einkommen ist Befreiung möglich.":
    "Его берут с каждого жилья, независимо от числа имеющихся приборов. При малом доходе возможно освобождение.",
  "Was passiert, wenn du beim Fahren ohne gültiges Ticket erwischt wirst?":
    "Что происходит, если тебя поймают в транспорте без действующего билета?",
  "Du zahlst ein erhöhtes Beförderungsentgelt; bei Wiederholung droht eine Anzeige":
    "Придётся заплатить повышенную плату за перевозку; при повторе грозит заявление в полицию",
  "Du wirst sofort festgenommen": "Тебя немедленно задержат",
  "Du bekommst eine Verwarnung": "Ты получишь предупреждение",
  "Beim ersten Mal ein Entgelt, bei wiederholtem Schwarzfahren kann es strafrechtlich verfolgt werden.":
    "В первый раз плата, а при повторном безбилетном проезде дело может дойти до уголовного преследования.",
  "Wann ist in Deutschland üblicherweise Mittagsruhe in Wohngebieten?":
    "Когда в Германии в жилых кварталах обычно бывает послеобеденный покой?",
  "Es gibt keine": "Его не бывает",
  "Vielerorts zwischen 13 und 15 Uhr, je nach örtlicher Regelung":
    "Во многих местах между 13 и 15 часами, смотря по местным правилам",
  "Zwischen 10 und 12 Uhr": "Между 10 и 12 часами",
  "Den ganzen Nachmittag": "Всю вторую половину дня",
  "Die Zeiten legen Gemeinden und Hausordnungen fest. Sonntags gilt meist ganztägig Ruhe.":
    "Время устанавливают общины и домовые правила. По воскресеньям покой чаще всего действует весь день.",
  "Was brauchst du, um in Deutschland ein Bankkonto zu eröffnen?":
    "Что нужно, чтобы открыть в Германии счёт в банке?",
  "Nur eine Telefonnummer": "Только номер телефона",
  "Einen Ausweis und meist eine Meldebescheinigung":
    "Удостоверение личности и чаще всего справка о регистрации",
  "Einen Arbeitsvertrag": "Трудовой договор",
  "Die deutsche Staatsangehörigkeit": "Немецкое гражданство",
  "Ein Basiskonto steht jedem zu, auch ohne festes Einkommen. Ausweis und Anschrift werden benötigt.":
    "Основной счёт полагается каждому, в том числе без постоянного дохода. Нужны удостоверение и адрес.",
  "Wie lange ist ein ausländischer Führerschein aus einem Nicht-EU-Staat in Deutschland gültig?":
    "Сколько времени в Германии действуют водительские права из страны вне Европейского союза?",
  "In der Regel sechs Monate nach der Anmeldung, danach ist eine Umschreibung nötig":
    "Как правило шесть месяцев после регистрации, затем нужен обмен",
  "Er gilt gar nicht": "Они не действуют вовсе",
  "Nach sechs Monaten muss umgeschrieben werden; je nach Herkunftsland mit oder ohne Prüfung. EU-Führerscheine gelten weiter.":
    "Через шесть месяцев их нужно обменять; смотря по стране, с экзаменом или без. Права стран Европейского союза действуют дальше.",
  "Was ist eine Überweisung beim Arzt?": "Что такое направление у врача?",
  "Eine Zahlung an die Praxis": "Платёж в пользу практики",
  "Ein Schreiben, mit dem der Hausarzt zu einem Facharzt schickt":
    "Бумага, с которой домашний врач посылает к врачу-специалисту",
  "Ein Rezept": "Рецепт",
  "Die Krankmeldung": "Больничный лист",
  "Nicht zu verwechseln mit der Geldüberweisung — hier geht es um die Weiterleitung zur fachärztlichen Behandlung.":
    "Не путать с денежным переводом — здесь речь о передаче к лечению у специалиста.",
  "Wer zahlt in der Regel Medikamente auf Rezept?":
    "Кто, как правило, оплачивает лекарства по рецепту?",
  "Der Patient allein": "Один только больной",
  "Die Krankenkasse, meist mit einer Zuzahlung des Patienten":
    "Медицинская касса, чаще всего с доплатой со стороны больного",
  "Der Arbeitgeber": "Работодатель",
  "Die Kasse übernimmt den Großteil; es bleibt meist eine Zuzahlung, von der man sich bei geringem Einkommen befreien lassen kann.":
    "Касса берёт на себя большую часть; чаще всего остаётся доплата, от которой при малом доходе можно получить освобождение.",
  "Wozu dient eine Patientenverfügung?": "Для чего служит распоряжение пациента?",
  "Zur Anmeldung im Krankenhaus": "Для оформления в больницу",
  "Um im Voraus festzulegen, welche Behandlungen man möchte, wenn man selbst nicht mehr entscheiden kann":
    "Чтобы заранее установить, какого лечения человек хочет, если сам решать уже не сможет",
  "Zur Abrechnung mit der Krankenkasse": "Для расчётов с медицинской кассой",
  "Um einen Arzt zu wechseln": "Чтобы сменить врача",
  "Sie ist verbindlich und sollte schriftlich vorliegen. Ergänzend regelt eine Vorsorgevollmacht, wer für einen sprechen darf.":
    "Оно обязательно к исполнению и должно быть в письменном виде. В дополнение доверенность на попечение определяет, кто вправе говорить за человека.",
  "Welche Nummer erreicht den ärztlichen Bereitschaftsdienst außerhalb der Sprechzeiten?":
    "По какому номеру можно застать врачебную дежурную службу вне часов приёма?",
  "116117 für dringende, aber nicht lebensbedrohliche Fälle. Die 112 bleibt echten Notfällen vorbehalten, die 115 ist die Behördennummer.":
    "116117 для срочных, но не угрожающих жизни случаев. Номер 112 остаётся для настоящих чрезвычайных случаев, а 115 — номер ведомств.",
  "Was passiert, wenn du länger als sechs Wochen krank bist?":
    "Что происходит, если ты болен дольше шести недель?",
  "Du bekommst kein Geld mehr": "Денег больше не будет",
  "Die Krankenkasse zahlt Krankengeld": "Медицинская касса платит пособие по болезни",
  "Der Arbeitgeber zahlt unbegrenzt weiter": "Работодатель платит дальше без ограничения",
  "Du wirst automatisch gekündigt": "Тебя увольняют сами собой",
  "Nach sechs Wochen Lohnfortzahlung übernimmt die Krankenkasse mit dem Krankengeld.":
    "После шести недель, в течение которых заработок платит работодатель, дело берёт на себя медицинская касса с пособием по болезни.",
  "Was ist eine Vorsorgeuntersuchung?": "Что такое профилактическое обследование?",
  "Eine Untersuchung nach einem Unfall": "Обследование после несчастного случая",
  "Eine Untersuchung zur Früherkennung von Krankheiten, meist von der Kasse bezahlt":
    "Обследование для раннего выявления болезней, чаще всего оплачиваемое кассой",
  "Eine Untersuchung vor einer Operation": "Обследование перед операцией",
  "Eine Untersuchung beim Zahnarzt nach Schmerzen": "Осмотр у зубного врача при болях",
  "Früherkennung statt Behandlung — etwa Krebsvorsorge, Kinderuntersuchungen und der Gesundheits-Check-up.":
    "Раннее выявление вместо лечения — например проверка на рак, детские осмотры и общая проверка здоровья.",
  "Muss man in Deutschland für den Notruf 112 bezahlen?":
    "Нужно ли в Германии платить за вызов по номеру 112?",
  "Ja, pro Anruf": "Да, за каждый звонок",
  "Nein, der Notruf ist kostenlos": "Нет, вызов бесплатный",
  "Nur vom Handy": "Только с мобильного телефона",
  "Nur nachts": "Только ночью",
  "Der Anruf ist kostenlos und funktioniert von jedem Telefon, auch ohne Guthaben.":
    "Звонок бесплатен и проходит с любого телефона, в том числе без денег на счету.",
  "Wofür ist eine private Haftpflichtversicherung wichtig?":
    "Чем важно частное страхование ответственности?",
  "Für Schäden am eigenen Auto": "Оно покрывает вред собственному автомобилю",
  "Für Schäden, die man anderen zufügt — sie kann existenzsichernd sein":
    "Оно покрывает вред, причинённый другим — и может уберечь от разорения",
  "Für die eigene Gesundheit": "Оно покрывает собственное здоровье",
  "Für den Hausrat": "Оно покрывает домашнее имущество",
  "Wer fahrlässig einen großen Schaden verursacht, haftet unbegrenzt mit seinem Vermögen. Deshalb gilt sie als wichtigste freiwillige Versicherung.":
    "Кто по неосторожности причинил большой вред, отвечает всем своим имуществом без предела. Поэтому его считают самым важным из добровольных.",
  "Wann ist der Tag der Deutschen Einheit?": "Когда отмечают День немецкого единства?",
  "Am 1. Mai": "1 мая",
  "Am 3. Oktober": "3 октября",
  "Am 9. November": "9 ноября",
  "Am 23. Mai": "23 мая",
  "Der 3. Oktober, der Nationalfeiertag. Der 9. November ist der Tag des Mauerfalls, aber auch der Pogromnacht.":
    "3 октября, национальный праздник. 9 ноября — день падения стены, но и день погромной ночи.",
  "Welcher Komponist schrieb die Melodie der „Ode an die Freude“, der Europahymne?":
    "Какой сочинитель написал мелодию «Оды к радости», гимна Европы?",
  "Ludwig van Beethoven": "Людвиг ван Бетховен",
  "Richard Wagner": "Рихард Вагнер",
  "Aus Beethovens 9. Sinfonie. Der Text stammt von Friedrich Schiller.":
    "Из Девятой симфонии Бетховена. Слова принадлежат Фридриху Шиллеру.",
  "Was ist die Bundesliga?": "Что такое Бундеслига?",
  "Eine politische Vereinigung": "Политическое объединение",
  "Die höchste deutsche Fußballliga": "Высшая футбольная лига Германии",
  "Ein Fernsehsender": "Телевизионный канал",
  "Ein Zusammenschluss der Bundesländer": "Объединение федеральных земель",
  "Sie spielt von August bis Mai. Fußball ist die mit Abstand beliebteste Sportart in Deutschland.":
    "Она играет с августа по май. Футбол с большим отрывом самый любимый вид спорта в Германии.",
  "Wofür ist Konrad Zuse bekannt?": "Чем известен Конрад Цузе?",
  "Für den Buchdruck": "Книгопечатанием",
  "Für den Bau des ersten funktionsfähigen Computers":
    "Постройкой первой работоспособной вычислительной машины",
  "Für das Automobil": "Автомобилем",
  "Zuse baute 1941 die Z3. Gutenberg steht für den Buchdruck, Einstein für die Physik, Benz für das Auto.":
    "Цузе построил в 1941 году Z3. Гутенберг стоит за книгопечатанием, Эйнштейн за физикой, Бенц за автомобилем.",
  "Was ist ein eingetragener Verein (e. V.)?": "Что такое зарегистрированное общество?",
  "Ein Unternehmen": "Предприятие",
  "Ein Zusammenschluss von Menschen für einen gemeinsamen Zweck, ins Vereinsregister eingetragen":
    "Объединение людей ради общей цели, внесённое в реестр обществ",
  "Eine Behörde": "Ведомство",
  "Eine Partei": "Партия",
  "Sport, Musik, Feuerwehr, Naturschutz — Vereine sind für viele der einfachste Weg, Anschluss zu finden.":
    "Спорт, музыка, пожарная дружина, охрана природы — для многих общества самый простой способ найти своих.",
  "Wann wird in Deutschland Karneval oder Fasching gefeiert?":
    "Когда в Германии празднуют карнавал?",
  "Im Sommer": "Летом",
  "Im Winter, vor der Fastenzeit": "Зимой, перед Великим постом",
  "Immer im Dezember": "Всегда в декабре",
  "Zu Ostern": "На Пасху",
  "Höhepunkt sind die Tage vor Aschermittwoch, besonders im Rheinland und in Süddeutschland.":
    "Вершина приходится на дни перед пепельной средой, особенно в Рейнской области и на юге Германии.",
  "Wofür stehen die Buchstaben ARD und ZDF?": "Что означают буквы ARD и ZDF?",
  "Für private Fernsehsender": "Частные телевизионные каналы",
  "Für den öffentlich-rechtlichen Rundfunk": "Общественно-правовое вещание",
  "Für Zeitungen": "Газеты",
  "Für Radiosender der Bundesländer": "Радиостанции федеральных земель",
  "Beide werden über den Rundfunkbeitrag finanziert, damit sie unabhängig von Staat und Werbekunden berichten können.":
    "Оба содержатся на взнос на вещание, чтобы они могли сообщать независимо от государства и рекламодателей.",
  "Warum ist die Unabhängigkeit der Medien in einer Demokratie wichtig?":
    "Почему независимость средств печати важна в демократии?",
  "Damit die Regierung ihre Politik erklären kann":
    "Чтобы правительство могло объяснять свою политику",
  "Damit Machtausübung öffentlich überprüft und kritisiert werden kann":
    "Чтобы осуществление власти можно было прилюдно проверять и критиковать",
  "Damit es mehr Unterhaltung gibt": "Чтобы было больше развлечений",
  "Damit die Parteien gleich viel Sendezeit haben":
    "Чтобы у партий было одинаковое время в эфире",
  "Freie Medien sind eine Kontrollinstanz. Genau das unterschied sie von der gelenkten Presse im NS-Staat und in der DDR.":
    "Свободные средства печати — это надзорная сила. Именно этим они отличались от направляемой печати в национал-социалистическом государстве и в ГДР.",
};
