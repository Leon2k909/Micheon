/**
 * Russian for the Vivir en Espana practice questions.
 *
 * The lesson cards are answered by VIVIR_EN_ESPANA_RU. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in Russian and then asked its
 * questions in Spanish.
 *
 * Keyed on the SPANISH source text exactly as it appears in esQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an n for
 * an ñ or a plain question mark where the sentence opens with ¿, and the
 * lookup misses in silence. The question renders in Spanish, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS SPANISH follows VIVIR_EN_ESPANA_RU exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The line runs where Russian itself
 * draws it:
 *
 *   - an institution Russian has a name for gets that name — Конституция,
 *     Конгресс депутатов, Сенат, Конституционный суд, автономные сообщества,
 *     городская управа;
 *   - the words a reader will only ever meet printed on a form, a card or a
 *     doorplate lead in Spanish — DNI, NIE, empadronamiento, Seguridad
 *     Social, DELE, CCSE;
 *   - where a whole question turns on which Spanish word names a thing, the
 *     options carry the Spanish word with its Russian reading beside it. The
 *     almuerzo and the merienda are two different meals, not two adjectives,
 *     and answering in Russian alone would lose the question.
 *
 * The keep list in check-ru-bank-translation was measured against this table
 * before it was written down, not guessed: a term the gate watches has to be
 * one that is actually kept in three keys or more, and a needle short enough
 * to hide inside another word — tapa inside etapas — accuses the wrong rows.
 *
 * Seventy-five of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that VIVIR_EN_ESPANA_RU or
 * another Russian table already answers. Every Russian table is spread into
 * one object, so a key present in two of them would lose one silently — the
 * later spread would decide both. check-ru-bank-translation measures coverage
 * through translateCourseText, the lookup a reader's tap actually goes
 * through, so those count as answered and are not duplicated here.
 */
export const ES_QUESTION_BANK_RU: Record<string, string> = {
  "¿Qué artículo de la Constitución describe la bandera?":
    "Какая статья Конституции описывает знамя?",
  "El artículo 1": "Статья 1",
  "El artículo 3": "Статья 3",
  "El artículo 4": "Статья 4",
  "El artículo 11": "Статья 11",
  "El artículo 4. El 3 se ocupa de las lenguas y el 11 de la nacionalidad: los tres están en el título preliminar y se confunden con facilidad.":
    "Статья 4. Третья занимается языками, а одиннадцатая — гражданством: все три стоят во вводном разделе и легко путаются.",
  "¿En el reinado de quién se adoptaron el rojo y el amarillo?":
    "В чьё правление приняли красный и жёлтый?",
  "De Felipe II": "Филиппа II",
  "De Carlos III": "Карла III",
  "De Fernando VII": "Фердинанда VII",
  "De Alfonso XIII": "Альфонса XIII",
  "Carlos III convocó en 1785 un concurso para dotar a la Armada de un pabellón distinguible. De la marina pasó al ejército y, ya en el siglo XIX, a bandera nacional.":
    "Карл III объявил в 1785 году состязание, чтобы дать флоту заметный стяг. С флота он перешёл в войско, а уже в XIX веке стал народным знаменем.",
  "¿Por qué se eligieron el rojo y el amarillo para el pabellón?":
    "Почему для стяга выбрали красный и жёлтый?",
  "Por ser los colores de la Casa Real": "Потому что это цвета королевского дома",
  "Para que la escuadra se distinguiera desde lejos en el mar":
    "Чтобы эскадру было видно издалека в море",
  "Por recordar el oro de América": "Чтобы напоминать о золоте Америки",
  "Por imitar a la bandera francesa": "Чтобы подражать французскому знамени",
  "Casi todas las flotas europeas usaban fondos blancos con escudos y de lejos se confundían. El rojo y el amarillo se ven a mucha distancia: la razón fue práctica antes que simbólica.":
    "Почти все европейские флоты держали белые полотнища с гербами, и издали их путали. Красный и жёлтый видно очень далеко: причина была практической, а не символической.",
  "¿Qué reino representa la granada situada al pie del escudo?":
    "Какое королевство означает гранат внизу герба?",
  "Navarra": "Наварру",
  "Aragón": "Арагон",
  "León": "Леон",
  "La granada recuerda el reino nazarí incorporado en 1492, el último de la Península. Navarra aporta las cadenas y Aragón los cuatro palos.":
    "Гранат напоминает о Насридском королевстве, присоединённом в 1492 году, последнем на полуострове. Наварра даёт цепи, а Арагон — четыре столба.",
  "¿Qué lema llevan las columnas de Hércules del escudo?":
    "Какой девиз несут Геркулесовы столбы на гербе?",
  "PLUS ULTRA": "PLUS ULTRA",
  "NON PLUS ULTRA": "NON PLUS ULTRA",
  "UNA GRANDE Y LIBRE": "UNA GRANDE Y LIBRE",
  "TANTO MONTA": "TANTO MONTA",
  "Plus ultra, más allá. Antes del descubrimiento de América el lema era el contrario, non plus ultra: nada más allá del estrecho. Se le quitó la negación.":
    "Plus ultra — «дальше за предел». До открытия Америки девиз был обратным, non plus ultra: за проливом ничего. У него убрали отрицание.",
  "¿Cómo se llama el himno nacional español?": "Как называется государственный гимн Испании?",
  "Himno de Riego": "«Гимн Риего»",
  "Marcha Real": "«Королевский марш»",
  "La Marsellesa": "«Марсельеза»",
  "Cara al sol": "«Cara al sol»",
  "La Marcha Real. El Himno de Riego fue el himno de la Segunda República, entre 1931 y 1939.":
    "«Королевский марш». «Гимн Риего» был гимном Второй республики, между 1931 и 1939 годами.",
  "¿Desde qué año está documentado el himno español?":
    "С какого года документально известен испанский гимн?",
  "Desde 1492": "С 1492 года",
  "Desde 1761": "С 1761 года",
  "Desde 1812": "С 1812 года",
  "Desde 1978": "С 1978 года",
  "Aparece en 1761 como Marcha Granadera, lo que lo convierte en uno de los himnos más antiguos de Europa.":
    "Он появляется в 1761 году как «Марш гренадеров», что делает его одним из старейших гимнов Европы.",
  "¿Qué se celebra el 6 de diciembre?": "Что отмечают 6 декабря?",
  "La Fiesta Nacional": "Национальный праздник",
  "La proclamación del rey": "Провозглашение короля",
  "El Día de la Hispanidad": "День испанидад",
  "El Día de la Constitución, por el referéndum de 1978. La Fiesta Nacional es el 12 de octubre, y el Día de la Hispanidad es otro nombre para esa misma fecha.":
    "День Конституции, по референдуму 1978 года. Национальный праздник — это 12 октября, а День испанидад — другое имя той же даты.",
  "¿Qué se conmemora el 2 de mayo en la Comunidad de Madrid?":
    "Что отмечают 2 мая в Мадридском сообществе?",
  "La entrada de los Reyes Católicos en Granada": "Вход католических королей в Гранаду",
  "El levantamiento de 1808 contra las tropas de Napoleón":
    "Восстание 1808 года против войск Наполеона",
  "La proclamación de la Segunda República": "Провозглашение Второй республики",
  "La aprobación del Estatuto de Autonomía": "Принятие Статута автономии",
  "El levantamiento del pueblo de Madrid en 1808, que abre la Guerra de la Independencia. Es fiesta de la comunidad, no nacional.":
    "Восстание жителей Мадрида в 1808 году, которое открывает Войну за независимость. Это праздник сообщества, а не всей страны.",
  "¿Qué lengua declara oficial del Estado el artículo 3?":
    "Какой язык статья 3 объявляет официальным языком государства?",
  "El castellano": "Кастильский",
  "El español y el catalán": "Испанский и каталанский",
  "Todas las lenguas de España por igual": "Все языки Испании поровну",
  "No lo dice ningún artículo": "Этого не говорит ни одна статья",
  "El castellano es la lengua española oficial del Estado, y el mismo artículo añade que las demás lenguas españolas serán también oficiales en sus respectivas comunidades.":
    "Кастильский — испанский язык, официальный для государства, и та же статья добавляет, что остальные испанские языки тоже будут официальными в своих сообществах.",
  "¿Cuál es la diferencia entre la bandera con escudo y la bandera sin escudo?":
    "В чём разница между знаменем с гербом и знаменем без герба?",
  "La de los edificios oficiales lleva escudo; la de uso común normalmente no":
    "На официальных зданиях он с гербом; в обиходе обычно без",
  "La del escudo solo puede usarla la Casa Real":
    "Флагом с гербом может пользоваться только королевский дом",
  "La sin escudo está prohibida": "Флаг без герба запрещён",
  "Son banderas de dos épocas distintas": "Это знамёна двух разных эпох",
  "Ambas son correctas. La versión oficial, la de organismos y actos del Estado, incorpora el escudo; la que se cuelga de un balcón o se ve en un estadio suele ser la lisa.":
    "Оба правильны. Официальная версия, для учреждений и государственных актов, несёт герб; тот, что вешают с балкона или видят на стадионе, обычно гладкий.",
  "¿Qué figuras ocupan los dos primeros cuarteles del escudo?":
    "Какие фигуры занимают две первые четверти герба?",
  "Un águila y una cruz": "Орёл и крест",
  "Un castillo y un león": "Замок и лев",
  "Dos columnas": "Две колонны",
  "Una granada y unas cadenas": "Гранат и цепи",
  "El castillo de Castilla y el león de León. Las cadenas son de Navarra, la granada del reino de Granada y las columnas enmarcan el conjunto.":
    "Замок Кастилии и лев Леона. Цепи — от Наварры, гранат — от королевства Гранада, а колонны обрамляют всё целое.",
  "¿Qué reino representan las cadenas del escudo?": "Какое королевство означают цепи на гербе?",
  "Castilla": "Кастилию",
  "Portugal": "Португалию",
  "Las cadenas son el emblema de Navarra. Aragón aporta los cuatro palos rojos sobre fondo dorado, y Portugal nunca formó parte del escudo.":
    "Цепи — эмблема Наварры. Арагон даёт четыре красных столба на золотом поле, а Португалия никогда в герб не входила.",
  "¿Cuántos artículos tiene la Constitución española?": "Сколько статей в испанской Конституции?",
  "Noventa y nueve": "Девяносто девять",
  "Ciento sesenta y nueve": "Сто шестьдесят девять",
  "Ciento sesenta y nueve, repartidos en un título preliminar y diez títulos, más las disposiciones finales. Es un texto largo para los estándares europeos.":
    "Сто шестьдесят девять, разложенных по вводному разделу и десяти разделам, плюс заключительные положения. Для европейских мерок текст длинный.",
  "¿Cuándo entró en vigor la Constitución?": "Когда Конституция вступила в силу?",
  "El 1 de enero de 1979": "1 января 1979 года",
  "El 29 de diciembre, el día de su publicación en el Boletín Oficial del Estado. El 6 fue el referéndum y el 27 la sanción del rey.":
    "29 декабря, в день её публикации в Boletín Oficial del Estado. Шестого был референдум, а двадцать седьмого — санкция короля.",
  "¿Cómo se conoce a los siete diputados que redactaron el borrador?":
    "Как называют семерых депутатов, написавших проект?",
  "Los constituyentes": "Учредители",
  "Los padres de la Constitución": "Отцы Конституции",
  "La comisión de notables": "Комиссия именитых",
  "El consejo de redacción": "Редакционный совет",
  "Se les llama los padres de la Constitución. Pertenecían a partidos distintos, lo que era el punto: el texto se escribió para que ninguna fuerza quedara fuera.":
    "Их зовут отцами Конституции. Они принадлежали к разным партиям, и в этом был весь смысл: текст писали так, чтобы ни одна сила не осталась за бортом.",
  "¿Qué palabra resume el método con el que se redactó la Constitución?":
    "Каким словом описывают способ, которым писали Конституцию?",
  "Imposición": "Навязывание",
  "Consenso": "Согласие",
  "Plebiscito": "Плебисцит",
  "Codificación": "Кодификация",
  "Consenso. Algunos artículos son deliberadamente amplios porque se acordó la frase precisamente por admitir más de una lectura: era el precio de que nadie quedara excluido.":
    "Согласие. Некоторые статьи намеренно широки, потому что фразу согласовали именно за то, что она допускает больше одного прочтения: это была цена за то, чтобы никого не исключили.",
  "¿Qué título de la Constitución trata de la organización territorial del Estado?":
    "Какой раздел Конституции говорит о территориальном устройстве государства?",
  "El título preliminar": "Вводный раздел",
  "El título I": "Раздел I",
  "El título VI": "Раздел VI",
  "El título VIII": "Раздел VIII",
  "El título VIII. De él nacen las comunidades autónomas, y por eso al modelo se le llama a veces Estado del título VIII.":
    "Раздел VIII. Из него рождаются автономные сообщества, и поэтому модель иногда зовут государством раздела VIII.",
  "¿Qué artículos forman el título preliminar?": "Какие статьи образуют вводный раздел?",
  "Del 1 al 9": "С 1-й по 9-ю",
  "Del 1 al 14": "С 1-й по 14-ю",
  "Del 10 al 55": "С 10-й по 55-ю",
  "Del 1 al 29": "С 1-й по 29-ю",
  "Del 1 al 9: qué es España, dónde reside la soberanía, las lenguas, la bandera, la capital. Del 10 al 55 va el título I, sobre derechos y deberes.":
    "С 1-й по 9-ю: что такое Испания, где лежит суверенитет, языки, знамя, столица. С 10-й по 55-ю идёт раздел I, о правах и обязанностях.",
  "¿Qué dos afirmaciones contiene el artículo 2?": "Какие два утверждения содержит статья 2?",
  "La unidad de la Nación y el derecho a la autonomía de nacionalidades y regiones":
    "Единство нации и право народностей и областей на автономию",
  "La soberanía popular y la monarquía parlamentaria":
    "Народный суверенитет и парламентскую монархию",
  "La oficialidad del castellano y de las demás lenguas":
    "Официальность кастильского и остальных языков",
  "La igualdad ante la ley y la prohibición de discriminación":
    "Равенство перед законом и запрет дискриминации",
  "Las dos mitades se acordaron juntas y ninguna se entiende sin la otra. Sobre ellas se construyó después todo el Estado autonómico.":
    "Обе половины согласовали вместе, и ни одна не понятна без другой. На них потом построили всё автономное государство.",
  "¿Qué artículo se reformó en 2011?": "Какую статью изменили в 2011 году?",
  "El artículo 13": "Статью 13",
  "El artículo 135": "Статью 135",
  "El artículo 2": "Статью 2",
  "El artículo 168": "Статью 168",
  "El 135, sobre estabilidad presupuestaria, en plena crisis de deuda. La otra reforma, la de 1992, tocó el artículo 13.":
    "Сто тридцать пятую, о бюджетной устойчивости, в разгар долгового кризиса. Другая правка, 1992 года, тронула статью 13.",
  "¿Por qué se reformó la Constitución en 1992?": "Почему Конституцию правили в 1992 году?",
  "Para permitir el voto de extranjeros en las elecciones municipales tras Maastricht":
    "Чтобы после Маастрихта разрешить иностранцам голосовать на муниципальных выборах",
  "Para introducir el euro": "Чтобы ввести евро",
  "Para reformar el Senado": "Чтобы преобразовать Сенат",
  "Para ampliar las competencias autonómicas": "Чтобы расширить полномочия автономий",
  "El Tratado de Maastricht obligaba a reconocer el sufragio pasivo en las municipales a los ciudadanos comunitarios, y hubo que añadir dos palabras al artículo 13.":
    "Маастрихтский договор обязывал признать за гражданами Сообщества право быть избранными на муниципальных выборах, и в статью 13 пришлось добавить два слова.",
  "¿Qué procedimiento de reforma obliga a disolver las Cortes y convocar elecciones?":
    "Какая процедура изменения обязывает распустить кортесы и назначить выборы?",
  "El del artículo 167": "Процедура статьи 167",
  "El del artículo 168": "Процедура статьи 168",
  "El del artículo 92": "Процедура статьи 92",
  "Ninguno lo exige": "Ни одна этого не требует",
  "El procedimiento agravado del artículo 168, que además exige dos tercios de ambas cámaras antes y después, y un referéndum obligatorio al final.":
    "Усложнённая процедура статьи 168, которая к тому же требует двух третей обеих палат до и после и обязательного референдума в конце.",
  "¿Qué partes de la Constitución protege el procedimiento agravado?":
    "Какие части Конституции защищает усложнённая процедура?",
  "Solo el título de la Corona": "Только раздел о Короне",
  "El título preliminar, los derechos fundamentales de la sección primera y el título de la Corona":
    "Вводный раздел, основные права первой секции и раздел о Короне",
  "Todo el texto por igual": "Весь текст одинаково",
  "Solo el título VIII": "Только раздел VIII",
  "Son las tres partes que el constituyente quiso poner casi fuera de alcance. Todo lo demás se reforma por el procedimiento ordinario, con tres quintos de cada cámara.":
    "Это три части, которые учредитель захотел поставить почти вне досягаемости. Всё остальное меняют обычной процедурой, тремя пятыми каждой палаты.",
  "¿Quién sancionó la Constitución en diciembre de 1978?":
    "Кто санкционировал Конституцию в декабре 1978 года?",
  "El presidente del Gobierno": "Председатель правительства",
  "El rey": "Король",
  "El presidente de las Cortes": "Председатель кортесов",
  "El rey la sancionó el 27 de diciembre, después de que las Cortes la aprobaran y el pueblo la ratificara en referéndum.":
    "Король санкционировал её 27 декабря, после того как кортесы её приняли, а народ утвердил на референдуме.",
  "¿Qué mayoría exige el procedimiento ordinario de reforma?":
    "Какого большинства требует обычная процедура изменения?",
  "Mayoría simple de cada cámara": "Простого большинства каждой палаты",
  "Mayoría absoluta del Congreso": "Абсолютного большинства Конгресса",
  "Tres quintos de cada cámara": "Трёх пятых каждой палаты",
  "Dos tercios de cada cámara": "Двух третей каждой палаты",
  "Tres quintos de Congreso y Senado. Los dos tercios corresponden al procedimiento agravado del artículo 168, que además obliga a disolver las Cortes.":
    "Трёх пятых Конгресса и Сената. Две трети относятся к усложнённой процедуре статьи 168, которая к тому же обязывает распустить кортесы.",
  "¿Qué artículos están protegidos por el recurso de amparo?":
    "Какие статьи защищены жалобой ампаро?",
  "Del 14 al 29": "С 14-й по 29-ю",
  "Del 30 al 38": "С 30-й по 38-ю",
  "Del 39 al 52": "С 39-й по 52-ю",
  "Del 14 al 29: la igualdad y los derechos fundamentales y libertades públicas. Los de los artículos 39 a 52 son principios rectores y no llegan al amparo.":
    "С 14-й по 29-ю: равенство, основные права и публичные свободы. То, что в статьях с 39-й по 52-ю, — руководящие принципы, и до ампаро они не доходят.",
  "¿Qué establece el artículo 14?": "Что устанавливает статья 14?",
  "El derecho a la vida": "Право на жизнь",
  "La igualdad ante la ley sin discriminación alguna":
    "Равенство перед законом без всякой дискриминации",
  "La libertad de expresión": "Свободу выражения",
  "El derecho a la educación": "Право на образование",
  "La igualdad ante la ley, sin que pueda prevalecer discriminación por nacimiento, raza, sexo, religión, opinión o cualquier otra condición personal o social.":
    "Равенство перед законом, при котором не может возобладать дискриминация по рождению, расе, полу, вероисповеданию, убеждениям или любому другому личному или общественному признаку.",
  "¿Qué abolió el artículo 15?": "Что отменила статья 15?",
  "La esclavitud": "Рабство",
  "La pena de muerte": "Смертную казнь",
  "La prisión por deudas": "Тюрьму за долги",
  "La pena de muerte, con una salvedad inicial para las leyes penales militares en tiempo de guerra. Esa excepción se suprimió por ley en 1995.":
    "Смертную казнь, с первоначальной оговоркой для военных уголовных законов в военное время. Это исключение убрали законом в 1995 году.",
  "¿Cuándo desapareció por completo la pena de muerte del ordenamiento español?":
    "Когда смертная казнь полностью исчезла из испанского права?",
  "En 1985": "В 1985 году",
  "En 1995": "В 1995 году",
  "En 2005": "В 2005 году",
  "La Constitución la abolió en 1978 salvo para las leyes penales militares en tiempo de guerra, y esa última excepción se eliminó por ley en 1995.":
    "Конституция отменила её в 1978 году, кроме военных уголовных законов в военное время, и это последнее исключение убрали законом в 1995 году.",
  "¿Qué protege el artículo 18?": "Что защищает статья 18?",
  "El honor, la intimidad, el domicilio y el secreto de las comunicaciones":
    "Честь, частную жизнь, жилище и тайну сообщений",
  "El derecho de huelga": "Право на забастовку",
  "La libertad de circulación": "Свободу передвижения",
  "El derecho de petición": "Право на обращение",
  "Es el artículo de la vida privada: honor, intimidad, propia imagen, inviolabilidad del domicilio y secreto de las comunicaciones.":
    "Это статья о частной жизни: честь, личная тайна, собственный образ, неприкосновенность жилища и тайна сообщений.",
  "¿En qué casos puede entrarse en un domicilio sin permiso del titular?":
    "В каких случаях можно войти в жилище без разрешения хозяина?",
  "Nunca": "Никогда",
  "Con resolución judicial o en caso de delito flagrante":
    "По судебному решению или при преступлении, застигнутом на месте",
  "Siempre que lo pida la policía": "Всегда, когда этого требует полиция",
  "Con autorización del ayuntamiento": "С разрешения муниципального управления",
  "El domicilio es inviolable. Solo caben el consentimiento del titular, la resolución judicial y el delito flagrante: fuera de esos tres supuestos, la entrada es ilegal.":
    "Жилище неприкосновенно. Возможны только согласие хозяина, судебное решение и преступление, застигнутое на месте: вне этих трёх случаев вход незаконен.",
  "¿Para qué sirve el habeas corpus?": "Для чего служит habeas corpus?",
  "Para recurrir una sentencia firme": "Чтобы обжаловать вступивший в силу приговор",
  "Para llevar de inmediato ante un juez a quien esté detenido ilegalmente":
    "Чтобы немедленно доставить к судье того, кто задержан незаконно",
  "Para pedir asistencia letrada gratuita": "Чтобы просить бесплатную помощь адвоката",
  "Para impugnar una ley ante el Tribunal Constitucional":
    "Чтобы оспорить закон в Конституционном суде",
  "Está previsto en el artículo 17 y sirve para poner sin demora a un detenido a disposición judicial. Es la garantía práctica del límite de las setenta y dos horas.":
    "Он предусмотрен статьёй 17 и служит для того, чтобы без промедления передать задержанного суду. Это практическая гарантия предела в семьдесят два часа.",
  "¿Hace falta autorización para celebrar una manifestación en la vía pública?":
    "Нужно ли разрешение, чтобы провести демонстрацию на улице?",
  "Sí, la autoridad debe concederla": "Да, власть должна его дать",
  "No: basta comunicarla previamente a la autoridad": "Нет: достаточно заранее уведомить власть",
  "Solo si participan más de mil personas": "Только если участвует больше тысячи человек",
  "Solo en las capitales de provincia": "Только в столицах провинций",
  "El artículo 21 exige comunicación previa, no autorización. La autoridad solo puede prohibirla por razones fundadas de alteración del orden público con peligro para personas o bienes.":
    "Статья 21 требует предварительного уведомления, а не разрешения. Власть может запретить её только по обоснованным причинам нарушения общественного порядка с опасностью для людей или имущества.",
  "¿Qué prohíbe expresamente el artículo 20 en materia de prensa?":
    "Что статья 20 прямо запрещает в отношении печати?",
  "La publicidad": "Рекламу",
  "La censura previa": "Предварительную цензуру",
  "Las publicaciones extranjeras": "Иностранные издания",
  "El anonimato de las fuentes": "Анонимность источников",
  "La censura previa. El mismo artículo reconoce la libertad de expresión y el derecho a comunicar y recibir información veraz.":
    "Предварительную цензуру. Та же статья признаёт свободу выражения и право сообщать и получать правдивые сведения.",
  "¿A qué deben orientarse las penas privativas de libertad?":
    "На что должны быть направлены наказания в виде лишения свободы?",
  "A la retribución del daño causado": "На воздаяние за причинённый вред",
  "A la reeducación y la reinserción social": "На перевоспитание и возвращение в общество",
  "A la disuasión de terceros": "На устрашение третьих лиц",
  "Al resarcimiento de la víctima": "На возмещение потерпевшему",
  "El artículo 25 fija la reeducación y la reinserción como orientación de las penas y las medidas de seguridad. Es un mandato constitucional, no una recomendación.":
    "Статья 25 задаёт перевоспитание и возвращение в общество как направление наказаний и мер безопасности. Это конституционное предписание, а не совет.",
  "¿Dónde está reconocido el derecho a una vivienda digna?":
    "Где признано право на достойное жильё?",
  "Entre los derechos fundamentales, con amparo": "Среди основных прав, с защитой ампаро",
  "En el artículo 47, entre los principios rectores": "В статье 47, среди руководящих принципов",
  "En el título preliminar": "Во вводном разделе",
  "No aparece en la Constitución": "В Конституции его нет",
  "Está en el artículo 47, entre los principios rectores de la política social y económica: obliga al legislador, pero no se reclama directamente ante un juez como la libertad de expresión.":
    "Оно в статье 47, среди руководящих принципов социальной и экономической политики: оно обязывает законодателя, но его не требуют прямо у судьи, как свободу выражения.",
  "¿Cuál es la diferencia práctica entre un derecho fundamental y un principio rector?":
    "В чём практическая разница между основным правом и руководящим принципом?",
  "Ninguna: los dos se alegan igual": "Никакой: на оба ссылаются одинаково",
  "El fundamental llega al amparo constitucional; el principio rector solo conforme a las leyes que lo desarrollen":
    "Основное право доходит до конституционного ампаро; руководящий принцип — только через законы, которые его развивают",
  "El principio rector obliga a las comunidades y el fundamental al Estado":
    "Руководящий принцип обязывает сообщества, а основное право — государство",
  "El principio rector no aparece en el texto constitucional":
    "Руководящего принципа в тексте Конституции нет",
  "La diferencia es de protección, no de importancia. Los fundamentales exigen ley orgánica y llegan al Tribunal Constitucional por la vía del amparo.":
    "Разница в защите, а не в важности. Основные права требуют органического закона и доходят до Конституционного суда путём ампаро.",
  "¿Qué garantiza el artículo 24?": "Что гарантирует статья 24?",
  "La tutela judicial efectiva y la presunción de inocencia":
    "Действенную судебную защиту и презумпцию невиновности",
  "La libertad religiosa": "Свободу вероисповедания",
  "El derecho al trabajo": "Право на труд",
  "La inviolabilidad del domicilio": "Неприкосновенность жилища",
  "Juez ordinario predeterminado por la ley, defensa y asistencia de letrado, proceso sin dilaciones indebidas y presunción de inocencia. Es el artículo del proceso justo.":
    "Обычный судья, заранее определённый законом, защита и помощь адвоката, процесс без неоправданных задержек и презумпция невиновности. Это статья о справедливом суде.",
  "¿Cuándo quedó suspendido el servicio militar obligatorio en España?":
    "Когда в Испании приостановили обязательную военную службу?",
  "En 2001": "В 2001 году",
  "Sigue vigente": "Она действует до сих пор",
  "En 2001. Desde entonces las Fuerzas Armadas son enteramente profesionales, aunque el artículo 30 mantiene el derecho y el deber de defender a España.":
    "В 2001 году. С тех пор вооружённые силы полностью профессиональные, хотя статья 30 сохраняет право и обязанность защищать Испанию.",
  "¿Qué artículo impone contribuir al sostenimiento de los gastos públicos?":
    "Какая статья обязывает участвовать в покрытии государственных расходов?",
  "El artículo 30": "Статья 30",
  "El artículo 31": "Статья 31",
  "El artículo 35": "Статья 35",
  "El artículo 47": "Статья 47",
  "El artículo 31, según la capacidad económica de cada uno. El 30 trata de la defensa y el 35 del trabajo.":
    "Статья 31, по имущественной способности каждого. Тридцатая говорит об обороне, а тридцать пятая — о труде.",
  "¿Qué carácter no puede tener nunca el sistema tributario?":
    "Каким налоговая система не может быть никогда?",
  "Progresivo": "Прогрессивной",
  "Confiscatorio": "Конфискационной",
  "Igualitario": "Уравнительной",
  "General": "Общей",
  "El artículo 31 exige que sea justo, igual y progresivo, y prohíbe expresamente que tenga alcance confiscatorio: la carga no puede vaciar el patrimonio de quien la soporta.":
    "Статья 31 требует, чтобы она была справедливой, равной и прогрессивной, и прямо запрещает конфискационный размах: бремя не может опустошать имущество того, кто его несёт.",
  "¿Cuál es la regla principal de la nacionalidad española de origen?":
    "Каково главное правило испанского гражданства по происхождению?",
  "Nacer en territorio español": "Родиться на испанской земле",
  "Nacer de padre o madre españoles": "Родиться от отца или матери — испанцев",
  "Residir cinco años en España": "Прожить в Испании пять лет",
  "Estar inscrito en el padrón municipal": "Быть внесённым в муниципальный реестр жителей",
  "Rige el criterio de la sangre: es español de origen quien nace de padre o madre españoles, nazca donde nazca. Nacer en España no basta por sí solo.":
    "Действует принцип крови: испанец по происхождению тот, кто родился от отца или матери — испанцев, где бы он ни родился. Одного рождения в Испании не хватает.",
  "¿Puede privarse de la nacionalidad a un español de origen?":
    "Можно ли лишить гражданства испанца по происхождению?",
  "Sí, por sentencia judicial": "Да, по приговору суда",
  "No: el artículo 11 lo prohíbe": "Нет: статья 11 это запрещает",
  "Sí, si adquiere otra nacionalidad": "Да, если он получит другое гражданство",
  "Solo en tiempo de guerra": "Только в военное время",
  "El artículo 11 lo prohíbe expresamente. Quien la ha adquirido por residencia sí puede perderla en supuestos tasados, pero el español de origen no.":
    "Статья 11 прямо это запрещает. Тот, кто получил его по проживанию, может его потерять в перечисленных случаях, а испанец по происхождению — нет.",
  "¿Con qué países permite la Constitución tratados de doble nacionalidad?":
    "С какими странами Конституция разрешает договоры о двойном гражданстве?",
  "Con ninguno": "Ни с какими",
  "Con los países iberoamericanos y aquellos con vinculación particular con España":
    "Со странами Латинской Америки и теми, у кого особая связь с Испанией",
  "Solo con los Estados de la Unión Europea": "Только с государствами Европейского союза",
  "Con todos los países del mundo": "Со всеми странами мира",
  "El artículo 11 los prevé para los países iberoamericanos y para los que hayan tenido o tengan una vinculación particular con España, como Andorra, Filipinas, Guinea Ecuatorial y Portugal.":
    "Статья 11 предусматривает их для латиноамериканских стран и для тех, у кого была или есть особая связь с Испанией, — Андорры, Филиппин, Экваториальной Гвинеи и Португалии.",
  "¿Qué plazo de residencia se exige a quien ha obtenido la condición de refugiado?":
    "Какой срок проживания требуется от того, кто получил статус беженца?",
  "Cinco años. Es un plazo intermedio entre el general de diez y el de dos que corresponde a los países con vínculo histórico.":
    "Пять лет. Это срок между общим в десять лет и двухлетним, который положен странам с исторической связью.",
  "¿Qué plazo se aplica a quien nació en territorio español pero no es español de origen?":
    "Какой срок применяется к тому, кто родился на испанской земле, но не испанец по происхождению?",
  "Un año, el plazo más corto, junto con supuestos como llevar un año casado con una persona española sin estar separado.":
    "Один год — самый короткий срок, наравне с такими случаями, как год брака с испанцем или испанкой без раздельного проживания.",
  "¿Qué dos pruebas acreditan el suficiente grado de integración?":
    "Какие две проверки подтверждают достаточную степень интеграции?",
  "Un examen de historia y otro de geografía": "Экзамен по истории и экзамен по географии",
  "La prueba de lengua DELE A2 y la prueba CCSE": "Языковой экзамен DELE A2 и экзамен CCSE",
  "Una entrevista en el ayuntamiento y un certificado de empadronamiento":
    "Собеседование в муниципальном управлении и справка об empadronamiento",
  "Un examen del Ministerio de Justicia y una prueba médica":
    "Экзамен министерства юстиции и медицинская проверка",
  "Las dos las administra el Instituto Cervantes: el DELE A2 examina la lengua y la CCSE los conocimientos constitucionales y socioculturales.":
    "Оба проводит Институт Сервантеса: DELE A2 проверяет язык, а CCSE — знания о Конституции и об обществе и культуре.",
  "¿Quién está exento de la prueba de lengua DELE A2?":
    "Кто освобождён от языкового экзамена DELE A2?",
  "Los mayores de sesenta y cinco años": "Те, кому больше шестидесяти пяти",
  "Quienes proceden de países donde el español es lengua oficial":
    "Выходцы из стран, где испанский — официальный язык",
  "Quienes llevan más de veinte años en España": "Те, кто прожил в Испании больше двадцати лет",
  "Nadie está exento": "Не освобождён никто",
  "La exención alcanza a los nacionales de países hispanohablantes, que sí deben realizar en cambio la prueba CCSE.":
    "Освобождение распространяется на граждан испаноязычных стран, которым зато нужно сдать экзамен CCSE.",
  "¿A qué edad se alcanza la mayoría de edad en España?":
    "В каком возрасте в Испании наступает совершеннолетие?",
  "A los dieciséis": "В шестнадцать",
  "A los dieciocho": "В восемнадцать",
  "A los veintiuno": "В двадцать один",
  "A los veinticinco": "В двадцать пять",
  "A los dieciocho, y con ella llegan el derecho de voto y la plena capacidad de obrar.":
    "В восемнадцать, и вместе с ним приходят право голоса и полная дееспособность.",
  "¿A partir de qué edad es obligatorio tener el DNI?": "С какого возраста DNI обязателен?",
  "A los siete": "С семи",
  "A los catorce": "С четырнадцати",
  "No es obligatorio": "Он не обязателен",
  "A partir de los catorce años, cuatro antes de la mayoría de edad. Puede solicitarse antes de forma voluntaria.":
    "С четырнадцати лет, за четыре года до совершеннолетия. Раньше его можно получить по желанию.",
  "¿Qué recoge el artículo 35 además del derecho al trabajo?":
    "Что статья 35 закрепляет кроме права на труд?",
  "El deber de trabajar": "Обязанность трудиться",
  "La jornada de cuarenta horas": "Сорокачасовую рабочую неделю",
  "El artículo 35 enuncia a la vez el deber y el derecho al trabajo, junto con la libre elección de profesión y una remuneración suficiente. La huelga está en el artículo 28.":
    "Статья 35 провозглашает разом и обязанность, и право на труд, вместе со свободным выбором профессии и достаточной оплатой. Забастовка стоит в статье 28.",
  "¿Cuántos festivos del calendario laboral fija el ayuntamiento?":
    "Сколько праздников трудового календаря назначает муниципальное управление?",
  "Ninguno": "Ни одного",
  "Cuatro": "Четыре",
  "Seis": "Шесть",
  "Dos de los catorce son locales y los decide cada municipio, normalmente el día del patrón y la fiesta mayor. Por eso un festivo puede no serlo a treinta kilómetros.":
    "Два из четырнадцати местные, и их решает каждый муниципалитет — обычно день покровителя и главный престольный праздник. Поэтому нерабочий день в тридцати километрах может им и не быть.",
  "¿Qué día se celebra la fiesta de Cataluña?": "В какой день отмечают праздник Каталонии?",
  "El 23 de abril": "23 апреля",
  "El 25 de julio": "25 июля",
  "El 11 de septiembre": "11 сентября",
  "El 9 de octubre": "9 октября",
  "El 11 de septiembre, la Diada. El 25 de julio es Galicia, el 9 de octubre la Comunidad Valenciana y el 23 de abril Aragón y Castilla y León.":
    "11 сентября, la Diada. 25 июля — это Галисия, 9 октября — Валенсийское сообщество, а 23 апреля — Арагон и Кастилия-и-Леон.",
  "¿Qué día se celebra la fiesta de Galicia?": "В какой день отмечают праздник Галисии?",
  "El 28 de febrero": "28 февраля",
  "El 6 de diciembre": "6 декабря",
  "El 25 de julio, día de Santiago Apóstol, patrón de España y de Galicia.":
    "25 июля, день апостола Иакова, покровителя Испании и Галисии.",
  "¿Qué día se celebra la fiesta de Andalucía?": "В какой день отмечают праздник Андалусии?",
  "El 2 de mayo": "2 мая",
  "El 28 de febrero, aniversario del referéndum autonómico de 1980. El 2 de mayo es Madrid y el 23 de abril Aragón y Castilla y León.":
    "28 февраля, годовщина автономного референдума 1980 года. 2 мая — это Мадрид, а 23 апреля — Арагон и Кастилия-и-Леон.",
  "¿Qué día llegan tradicionalmente los regalos a los niños en España?":
    "В какой день в Испании по традиции приходят подарки детям?",
  "El 24 de diciembre": "24 декабря",
  "El 25 de diciembre": "25 декабря",
  "El 31 de diciembre": "31 декабря",
  "El 6 de enero": "6 января",
  "El 6 de enero, con los Reyes Magos, cuya cabalgata se celebra la tarde del día 5. En muchas casas conviven hoy ambas fechas, pero la de Reyes sigue siendo la principal.":
    "6 января, с королями-волхвами, чьё шествие проходит вечером пятого. Во многих домах сегодня уживаются обе даты, но день волхвов остаётся главным.",
  "¿Qué día de Semana Santa es festivo en toda España?":
    "Какой день Страстной недели нерабочий по всей Испании?",
  "El Domingo de Ramos": "Вербное воскресенье",
  "El Jueves Santo": "Великий четверг",
  "El Viernes Santo": "Великая пятница",
  "El Lunes de Pascua": "Пасхальный понедельник",
  "El Viernes Santo lo es en todo el país. El Jueves Santo lo es en la mayoría de comunidades pero no en todas, y el Lunes de Pascua solo en algunas.":
    "Великая пятница нерабочая по всей стране. Великий четверг нерабочий в большинстве сообществ, но не во всех, а пасхальный понедельник — лишь в некоторых.",
  "¿Desde qué lugar se retransmiten las campanadas de Nochevieja?":
    "Откуда передают новогодний бой часов?",
  "Desde la Plaza Mayor de Madrid": "С Пласа-Майор в Мадриде",
  "Desde la Puerta del Sol de Madrid": "С Пуэрта-дель-Соль в Мадриде",
  "Desde la Sagrada Familia de Barcelona": "От Саграда Фамилия в Барселоне",
  "Desde la Giralda de Sevilla": "С Хиральды в Севилье",
  "Desde el reloj de la Puerta del Sol. La retransmisión es uno de los programas de televisión más vistos del año en España.":
    "С часов на Пуэрта-дель-Соль. Эта передача — одна из самых смотримых в году в Испании.",
  "¿En qué ciudad se celebran los San Fermines?": "В каком городе празднуют Сан-Фермин?",
  "En Bilbao": "В Бильбао",
  "En Zaragoza": "В Сарагосе",
  "En Logroño": "В Логроньо",
  "En Pamplona, del 6 al 14 de julio, y los encierros de la mañana son su imagen más conocida fuera de España.":
    "В Памплоне, с 6 по 14 июля, и утренние забеги с быками — самый известный её образ за пределами Испании.",
  "¿En qué ciudad se celebra la Feria de Abril?": "В каком городе проходит Апрельская ярмарка?",
  "En Málaga": "В Малаге",
  "En Córdoba": "В Кордове",
  "En Granada": "В Гранаде",
  "En Sevilla, dos semanas después de Semana Santa, con casetas, caballos y trajes de flamenca.":
    "В Севилье, через две недели после Страстной недели, с шатрами, лошадьми и платьями фламенко.",
  "¿Qué son las chirigotas?": "Что такое chirigotas?",
  "Los monumentos que se queman en las Fallas": "Фигуры, которые сжигают на Фальяс",
  "Las agrupaciones que cantan con letras satíricas en el carnaval de Cádiz":
    "Коллективы, которые поют сатирические куплеты на карнавале в Кадисе",
  "Los encierros de las fiestas de Pamplona": "Забеги с быками на праздниках в Памплоне",
  "Las casetas de la Feria de Abril": "Шатры Апрельской ярмарки",
  "Son la seña de identidad del carnaval gaditano: coplas de humor y crítica que se preparan durante todo el año y compiten en el Gran Teatro Falla.":
    "Это отличительный знак кадисского карнавала: шуточные и едкие куплеты, которые готовят весь год и с которыми состязаются в Гран-театре Фалья.",
  "¿Qué es hacer puente?": "Что значит hacer puente, «делать мост»?",
  "Trabajar en festivo para librar otro día": "Работать в праздник, чтобы отгулять другой день",
  "Librar el lunes o el viernes contiguo a un festivo que cae en martes o jueves":
    "Взять выходной в понедельник или пятницу рядом с праздником, выпавшим на вторник или четверг",
  "Cambiar un festivo local por uno nacional": "Поменять местный праздник на общегосударственный",
  "Acumular las vacaciones al final del año": "Скопить отпуск к концу года",
  "Cuando el festivo cae en martes o jueves, muchos toman también el día que lo separa del fin de semana. Si coinciden dos festivos cercanos se habla, medio en broma, de acueducto.":
    "Когда праздник выпадает на вторник или четверг, многие берут и день, который отделяет его от выходных. Если рядом сходятся два праздника, полушутя говорят об «акведуке».",
  "¿Cuándo se queman los monumentos de las Fallas?": "Когда сжигают фигуры Фальяс?",
  "La noche del 19 de marzo": "В ночь на 19 марта",
  "La noche de San Juan, el 23 de junio": "В ночь святого Иоанна, 23 июня",
  "El 15 de agosto": "15 августа",
  "El último día del carnaval": "В последний день карнавала",
  "La noche del 19 de marzo, la cremà. Los monumentos se levantan durante días por toda la ciudad y arden todos la misma noche.":
    "В ночь на 19 марта, la cremà. Фигуры несколько дней ставят по всему городу, и горят они все в одну ночь.",
  "¿Puede una comunidad autónoma sustituir un festivo estatal por otro propio?":
    "Может ли автономное сообщество заменить государственный праздник своим?",
  "No, la lista estatal es idéntica en todo el país":
    "Нет, государственный список одинаков по всей стране",
  "Sí, dentro de los límites que fija la ley": "Да, в пределах, которые задаёт закон",
  "Solo las comunidades con lengua propia": "Только сообщества со своим языком",
  "Solo con autorización del Gobierno central": "Только с разрешения центрального правительства",
  "Las comunidades pueden sustituir algunos festivos estatales por fiestas propias, de modo que ni siquiera la lista del Estado se aplica igual en todas partes.":
    "Сообщества могут заменить некоторые государственные праздники своими, так что даже государственный список применяется не везде одинаково.",
  "¿Qué cargo ocupa el rey en el Estado español?":
    "Какую должность занимает король в испанском государстве?",
  "Presidente del Gobierno": "Председателя правительства",
  "Jefe del Estado": "Главы государства",
  "Presidente de las Cortes": "Председателя кортесов",
  "Jefe de la Administración": "Главы администрации",
  "Jefe del Estado, símbolo de su unidad y permanencia. Quien dirige la política es el presidente del Gobierno, que es otro cargo y está en otro edificio.":
    "Главы государства, символа его единства и постоянства. Политикой руководит председатель правительства — это другая должность и другое здание.",
  "¿Qué dos verbos emplea el artículo 56 para describir la función del rey?":
    "Какие два глагола использует статья 56, описывая роль короля?",
  "Gobernar y administrar": "Править и управлять",
  "Arbitrar y moderar": "Быть третейским судьёй и умерять",
  "Legislar y sancionar": "Законодательствовать и санкционировать",
  "Dirigir y coordinar": "Направлять и согласовывать",
  "Arbitra y modera el funcionamiento regular de las instituciones. Ninguno de los dos verbos significa gobernar, y esa elección de palabras es deliberada.":
    "Он выступает третейским судьёй и умеряет обычный ход работы учреждений. Ни один из двух глаголов не значит «править», и такой выбор слов сделан намеренно.",
  "¿Quién puede refrendar el nombramiento del presidente del Gobierno?":
    "Кто может контрасигновать назначение председателя правительства?",
  "El presidente del Congreso": "Председатель Конгресса",
  "El ministro de la Presidencia": "Министр при председателе правительства",
  "El presidente del Tribunal Supremo": "Председатель Верховного суда",
  "Nadie: ese acto no se refrenda": "Никто: этот акт не контрасигнуется",
  "La propuesta y el nombramiento del presidente del Gobierno, y la disolución de las Cortes prevista en el artículo 99, los refrenda el presidente del Congreso. Los demás actos, el Gobierno.":
    "Предложение и назначение председателя правительства, а также роспуск кортесов по статье 99 контрасигнует председатель Конгресса. Остальные акты — правительство.",
  "¿Por qué la Constitución declara inviolable la persona del rey?":
    "Почему Конституция объявляет личность короля неприкосновенной?",
  "Porque su cargo es vitalicio": "Потому что его должность пожизненная",
  "Porque todos sus actos los refrenda otro, que asume la responsabilidad":
    "Потому что все его акты контрасигнует другой, который берёт ответственность на себя",
  "Porque no interviene en ningún acto público":
    "Потому что он не участвует ни в одном публичном акте",
  "Porque lo protege un tratado internacional": "Потому что его защищает международный договор",
  "La irresponsabilidad del rey solo se sostiene sobre el refrendo: siempre hay alguien que firma con él y responde. Un acto sin refrendo carece de validez.":
    "Безответственность короля держится только на контрасигнатуре: всегда есть кто-то, кто подписывает вместе с ним и отвечает. Акт без контрасигнатуры силы не имеет.",
  "¿En qué plazo debe el rey sancionar las leyes aprobadas por las Cortes?":
    "В какой срок король должен санкционировать законы, принятые кортесами?",
  "En quince días": "За пятнадцать дней",
  "En un mes": "За месяц",
  "En tres meses": "За три месяца",
  "No hay plazo": "Срока нет",
  "Quince días para sancionar y promulgar. Es un acto debido: no puede negarse ni retrasarlo a voluntad.":
    "Пятнадцать дней на санкцию и обнародование. Это обязательный акт: он не может отказать или тянуть по своей воле.",
  "¿Qué tipo de indultos prohíbe la ley española?": "Какие помилования запрещает испанский закон?",
  "Los indultos generales": "Общие помилования",
  "Los indultos a extranjeros": "Помилования иностранцев",
  "Los indultos por delitos económicos": "Помилования за экономические преступления",
  "El rey ejerce el derecho de gracia con arreglo a la ley, y esa ley prohíbe los indultos generales. Los individuales sí son posibles, a propuesta del Gobierno.":
    "Король пользуется правом помилования по закону, а этот закон запрещает общие помилования. Отдельные возможны, по предложению правительства.",
  "¿Qué criterio de sucesión establece todavía el artículo 57?":
    "Какой порядок наследования всё ещё устанавливает статья 57?",
  "Igualdad absoluta entre hombres y mujeres": "Полное равенство мужчин и женщин",
  "Preferencia del varón sobre la mujer en el mismo grado":
    "Предпочтение мужчины перед женщиной в той же степени родства",
  "Elección por las Cortes entre los descendientes": "Выбор кортесами среди потомков",
  "Preferencia del hijo mayor sin distinción de sexo":
    "Предпочтение старшего ребёнка без различия пола",
  "Es la única preferencia por razón de sexo que queda en el texto. Cambiarla exigiría el procedimiento agravado del artículo 168, con disolución de las Cortes y referéndum.":
    "Это единственное предпочтение по признаку пола, оставшееся в тексте. Чтобы его изменить, понадобилась бы усложнённая процедура статьи 168, с роспуском кортесов и референдумом.",
  "¿En qué año fue proclamado rey Juan Carlos I?":
    "В каком году королём провозгласили Хуана Карлоса I?",
  "En 1969": "В 1969 году",
  "En 1981": "В 1981 году",
  "En 1975, dos días después de la muerte de Franco. La Constitución llegaría tres años más tarde, en 1978.":
    "В 1975 году, через два дня после смерти Франко. Конституция придёт тремя годами позже, в 1978-м.",
  "¿En qué año fue proclamado Felipe VI?": "В каком году провозгласили Филиппа VI?",
  "En 2004": "В 2004 году",
  "En 2011": "В 2011 году",
  "En 2014": "В 2014 году",
  "En 2018": "В 2018 году",
  "El 19 de junio de 2014, tras la abdicación de su padre. La proclamación se celebró ante las Cortes Generales.":
    "19 июня 2014 года, после отречения его отца. Провозглашение прошло перед Генеральными кортесами.",
  "¿Cuál es la residencia habitual de la familia real?": "Где обычно живёт королевская семья?",
  "El Palacio Real": "Королевский дворец",
  "El Palacio de la Zarzuela": "Дворец Сарсуэла",
  "El Palacio de la Moncloa": "Дворец Монклоа",
  "El Palacio de las Cortes": "Дворец кортесов",
  "La Zarzuela es la residencia; el Palacio Real se reserva para actos oficiales. La Moncloa es del presidente del Gobierno.":
    "Сарсуэла — жилая резиденция; Королевский дворец оставлен для официальных актов. Монклоа принадлежит председателю правительства.",
  "¿Qué hace el rey al ser proclamado ante las Cortes?":
    "Что делает король, когда его провозглашают перед кортесами?",
  "Presenta un programa de gobierno": "Представляет программу правительства",
  "Presta juramento de guardar y hacer guardar la Constitución":
    "Приносит присягу хранить Конституцию и требовать её соблюдения",
  "Firma un pacto con los partidos": "Подписывает соглашение с партиями",
  "Nombra al presidente del Gobierno": "Назначает председателя правительства",
  "Jura o promete guardar y hacer guardar la Constitución y las leyes, y respetar los derechos de los ciudadanos y de las comunidades autónomas.":
    "Он клянётся или обещает хранить Конституцию и законы и требовать их соблюдения и уважать права граждан и автономных сообществ.",
  "¿Quién tiene el mando supremo de las Fuerzas Armadas?":
    "Кому принадлежит верховное командование вооружёнными силами?",
  "El ministro de Defensa": "Министру обороны",
  "El jefe del Estado Mayor": "Начальнику генерального штаба",
  "El artículo 62 se lo atribuye al rey. La dirección efectiva de la defensa corresponde al Gobierno, según el artículo 97: el mando es simbólico y la política es del ejecutivo.":
    "Статья 62 отдаёт его королю. Действительное руководство обороной принадлежит правительству, по статье 97: командование символическое, а политика — за исполнительной властью.",
  "¿Qué ocurre con un acto del rey que no lleva refrendo?":
    "Что происходит с королевским актом без контрасигнатуры?",
  "Es válido pero recurrible": "Он действителен, но его можно обжаловать",
  "Carece de validez": "Он не имеет силы",
  "Debe ratificarlo el Congreso": "Его должен утвердить Конгресс",
  "Lo asume el Consejo de Ministros": "Его берёт на себя Совет министров",
  "Sin refrendo el acto no vale. Es la pieza que hace compatibles un jefe del Estado irresponsable y un sistema en el que todo acto tiene un responsable.":
    "Без контрасигнатуры акт недействителен. Это та деталь, которая примиряет не отвечающего главу государства и систему, где у каждого акта есть ответственный.",
  "¿Entre qué cifras permite la Constitución fijar el número de diputados?":
    "В каких пределах Конституция позволяет задать число депутатов?",
  "Entre 200 y 300": "Между 200 и 300",
  "Entre 300 y 400": "Между 300 и 400",
  "Entre 250 y 350": "Между 250 и 350",
  "No fija ninguna horquilla": "Она не задаёт никакого промежутка",
  "Entre trescientos y cuatrocientos. La ley electoral ha elegido siempre trescientos cincuenta, pero podría moverse dentro de ese margen sin reformar la Constitución.":
    "Между тремястами и четырьмястами. Избирательный закон всегда выбирал триста пятьдесят, но мог бы двигаться внутри этого промежутка, не меняя Конституцию.",
  "¿Cuál es la circunscripción electoral en las elecciones al Congreso?":
    "Что является избирательным округом на выборах в Конгресс?",
  "La comunidad autónoma": "Автономное сообщество",
  "La provincia": "Провинция",
  "El municipio": "Муниципалитет",
  "Toda España como circunscripción única": "Вся Испания как единый округ",
  "La provincia, más Ceuta y Melilla con un diputado cada una. La circunscripción única solo se usa en las elecciones europeas.":
    "Провинция, плюс Сеута и Мелилья с одним депутатом каждая. Единый округ используют только на европейских выборах.",
  "¿Qué mecanismo da a las provincias pequeñas más peso relativo?":
    "Какой механизм даёт маленьким провинциям больше относительного веса?",
  "El sistema D'Hondt": "Метод д'Ондта",
  "El mínimo inicial de dos escaños por provincia": "Начальный минимум в два места на провинцию",
  "El umbral del tres por ciento": "Трёхпроцентный порог",
  "Las listas cerradas": "Закрытые списки",
  "Cada provincia parte de dos escaños antes de repartir el resto por población. Es un efecto distinto del que produce el D'Hondt, y suele atribuirse por error a este último.":
    "Каждая провинция начинает с двух мест, прежде чем остальное делят по населению. Это иное действие, чем у метода д'Ондта, и его часто по ошибке приписывают ему.",
  "¿Qué umbral debe superar una lista para obtener escaño?":
    "Какой порог должен взять список, чтобы получить место?",
  "El uno por ciento nacional": "Один процент по стране",
  "El tres por ciento de los votos válidos de su circunscripción":
    "Три процента действительных голосов в своём округе",
  "El cinco por ciento nacional": "Пять процентов по стране",
  "No hay umbral": "Порога нет",
  "El tres por ciento, y se calcula por circunscripción, no en el conjunto del país. En provincias pequeñas el umbral efectivo es en la práctica mucho más alto.":
    "Три процента, и считают их по округу, а не по стране в целом. В маленьких провинциях действующий порог на деле куда выше.",
  "¿Qué significa que las listas sean cerradas y bloqueadas?":
    "Что значит, что списки закрытые и заблокированные?",
  "Que solo pueden presentarlas los partidos con representación":
    "Что выставлять их могут только партии, уже имеющие места",
  "Que se vota la candidatura entera en el orden fijado por el partido":
    "Что голосуют за весь список в том порядке, который задала партия",
  "Que no se publican hasta el día de la votación": "Что их не публикуют до дня голосования",
  "Que no admiten candidatos independientes": "Что они не берут независимых кандидатов",
  "Cerrada significa que no se pueden mezclar candidatos de listas distintas; bloqueada, que no se puede alterar el orden. El votante elige un partido, no personas.":
    "Закрытый значит, что нельзя смешивать кандидатов из разных списков; заблокированный — что нельзя менять порядок. Избиратель выбирает партию, а не людей.",
  "¿Cuántos senadores elige directamente cada provincia peninsular?":
    "Сколько сенаторов напрямую избирает каждая материковая провинция?",
  "Depende de su población": "Это зависит от её населения",
  "Cuatro por provincia peninsular, con independencia de la población. Las islas y las ciudades autónomas siguen reglas propias, y a todos ellos se suman los designados por las comunidades.":
    "По четыре от материковой провинции, независимо от населения. У островов и автономных городов свои правила, и ко всем ним прибавляются назначенные сообществами.",
  "¿Cómo designan las comunidades autónomas a sus senadores?":
    "Как автономные сообщества назначают своих сенаторов?",
  "Uno por comunidad y otro más por cada millón de habitantes":
    "По одному от сообщества и ещё по одному на каждый миллион жителей",
  "Cuatro por comunidad": "По четыре от сообщества",
  "Uno por provincia": "По одному от провинции",
  "En proporción a los escaños de su parlamento": "Пропорционально местам в их парламенте",
  "Uno fijo por comunidad y otro adicional por cada millón de habitantes, designados por su asamblea legislativa. Es la vía territorial del Senado, junto a la provincial.":
    "Один твёрдо от сообщества и ещё один на каждый миллион жителей, назначаемые его законодательным собранием. Это территориальный путь в Сенат, рядом с провинциальным.",
  "¿Cuánto dura una legislatura?": "Сколько длится созыв парламента?",
  "Seis años": "Шесть лет",
  "Cuatro años, salvo disolución anticipada, que en España ha sido frecuente: pocas legislaturas han llegado completas a su término.":
    "Четыре года, если не будет досрочного роспуска, а в Испании он случался часто: немногие созывы доживали до конца целиком.",
  "¿Cuánto tiempo debe pasar para que el Congreso levante un veto del Senado por mayoría simple?":
    "Сколько времени должно пройти, чтобы Конгресс снял вето Сената простым большинством?",
  "Quince días": "Пятнадцать дней",
  "Un mes": "Месяц",
  "Dos meses": "Два месяца",
  "Seis meses": "Шесть месяцев",
  "Dos meses. Antes de ese plazo también puede levantarlo, pero necesita mayoría absoluta: el tiempo rebaja la exigencia.":
    "Два месяца. До этого срока он тоже может его снять, но ему нужно абсолютное большинство: время снижает требование.",
  "¿Qué es la Diputación Permanente?": "Что такое Постоянная депутация?",
  "El grupo que vela por los poderes de la cámara cuando está disuelta o fuera de sesiones":
    "Группа, которая хранит полномочия палаты, когда та распущена или вне сессии",
  "La comisión que redacta los presupuestos": "Комиссия, которая пишет бюджет",
  "El órgano que dirige los debates": "Орган, который ведёт прения",
  "El conjunto de diputados con más antigüedad": "Собрание самых давних депутатов",
  "Cada cámara tiene la suya, presidida por su presidente. Es lo que impide que el Parlamento desaparezca del todo entre una disolución y las siguientes elecciones.":
    "У каждой палаты своя, под началом её председателя. Именно она не даёт парламенту исчезнуть совсем между роспуском и следующими выборами.",
  "¿Qué tres funciones atribuye el artículo 66 a las Cortes Generales?":
    "Какие три задачи статья 66 отводит Генеральным кортесам?",
  "Legislar, aprobar los presupuestos y controlar al Gobierno":
    "Законодательствовать, утверждать бюджет и контролировать правительство",
  "Legislar, juzgar y gobernar": "Законодательствовать, судить и править",
  "Elegir al rey, legislar y nombrar jueces":
    "Избирать короля, законодательствовать и назначать судей",
  "Aprobar tratados, indultar y recaudar": "Утверждать договоры, миловать и собирать налоги",
  "Potestad legislativa, presupuestos y control de la acción del Gobierno. Juzgar corresponde al poder judicial y gobernar al ejecutivo.":
    "Законодательная власть, бюджет и контроль за действиями правительства. Судить — дело судебной власти, править — исполнительной.",
  "¿Cuántos diputados eligen Ceuta y Melilla?": "Сколько депутатов избирают Сеута и Мелилья?",
  "Uno cada una": "По одному каждая",
  "Dos cada una": "По два каждая",
  "Cuatro cada una": "По четыре каждая",
  "Un diputado cada una. Son circunscripciones propias, distintas de las provincias, y también eligen senadores con reglas específicas.":
    "По одному депутату каждая. Это отдельные округа, не провинции, и сенаторов они тоже избирают по особым правилам.",
  "¿Por qué se dice que el bicameralismo español es imperfecto?":
    "Почему говорят, что испанская двухпалатность несовершенна?",
  "Porque el Senado tiene menos miembros": "Потому что в Сенате меньше членов",
  "Porque las dos cámaras no tienen el mismo peso y el Congreso decide en última instancia":
    "Потому что у двух палат разный вес и в последней инстанции решает Конгресс",
  "Porque el Senado no se elige por sufragio": "Потому что Сенат не избирают голосованием",
  "Porque solo una de las dos aprueba los presupuestos":
    "Потому что бюджет утверждает лишь одна из двух",
  "El Congreso inviste al presidente, puede derribarlo y levanta los vetos del Senado. Imperfecto es aquí un término técnico, no un juicio de valor.":
    "Конгресс утверждает председателя правительства, может его свалить и снимает вето Сената. «Несовершенная» здесь — технический термин, а не оценка.",
  "¿Quiénes componen el Gobierno?": "Из кого состоит правительство?",
  "El presidente, los vicepresidentes y los ministros": "Председатель, заместители и министры",
  "El rey y los ministros": "Король и министры",
  "Los diputados del partido más votado": "Депутаты партии, набравшей больше всех голосов",
  "El presidente y los presidentes autonómicos": "Председатель и главы автономий",
  "Presidente, vicepresidentes en su caso y ministros, que reunidos forman el Consejo de Ministros. El rey no forma parte del Gobierno.":
    "Председатель, при необходимости заместители и министры, которые вместе образуют Совет министров. Король в правительство не входит.",
  "¿Qué artículo define las funciones del Gobierno?":
    "Какая статья определяет задачи правительства?",
  "El artículo 66": "Статья 66",
  "El artículo 97": "Статья 97",
  "El artículo 99": "Статья 99",
  "El artículo 117": "Статья 117",
  "El 97: política interior y exterior, Administración civil y militar, defensa, función ejecutiva y potestad reglamentaria. El 99 regula la investidura.":
    "Девяносто седьмая: внутренняя и внешняя политика, гражданская и военная администрация, оборона, исполнительная функция и право издавать регламенты. Девяносто девятая регулирует утверждение председателя.",
  "¿Qué hace el rey antes de proponer un candidato a la presidencia?":
    "Что делает король, прежде чем предложить кандидата в председатели правительства?",
  "Consultar a los representantes designados por los grupos políticos":
    "Советуется с представителями, назначенными политическими группами",
  "Consultar al Tribunal Constitucional": "Советуется с Конституционным судом",
  "Convocar un referéndum": "Назначает референдум",
  "Nombrar un gobierno provisional": "Назначает временное правительство",
  "Las consultas son una ronda de reuniones con los grupos con representación, y sirven para saber quién puede reunir una mayoría antes de proponer un nombre.":
    "Консультации — это круг встреч с группами, имеющими места, и нужны они, чтобы понять, кто способен собрать большинство, прежде чем называть имя.",
  "¿Qué ocurre si en dos meses nadie logra ser investido presidente?":
    "Что происходит, если за два месяца никто не получает утверждения на пост председателя?",
  "Gobierna el partido más votado": "Правит партия, набравшая больше всех голосов",
  "El rey disuelve las Cortes y se convocan nuevas elecciones":
    "Король распускает кортесы и назначаются новые выборы",
  "Decide el Senado": "Решает Сенат",
  "Se prorroga el gobierno anterior cuatro años":
    "Прежнее правительство продлевают на четыре года",
  "El plazo corre desde la primera votación de investidura. España ha llegado a repetir elecciones por esta vía en más de una ocasión.":
    "Срок идёт с первого голосования об утверждении. Испания не раз доходила по этому пути до повторных выборов.",
  "¿Qué mayoría basta en la segunda votación de investidura?":
    "Какого большинства хватает во втором голосовании об утверждении?",
  "La misma que en la primera": "Того же, что и в первом",
  "Mayoría simple: más votos a favor que en contra. Se celebra cuarenta y ocho horas después de la primera, en la que se exigía mayoría absoluta.":
    "Простого большинства: голосов «за» больше, чем «против». Оно проходит через сорок восемь часов после первого, где требовалось абсолютное большинство.",
  "¿Qué fracción de los diputados debe firmar una moción de censura?":
    "Какая доля депутатов должна подписать вотум недоверия?",
  "Una décima parte": "Десятая часть",
  "Una cuarta parte": "Четверть",
  "Un tercio": "Треть",
  "La mayoría absoluta": "Абсолютное большинство",
  "Una décima parte del Congreso para presentarla. Para que prospere hace falta después la mayoría absoluta de la cámara.":
    "Десятая часть Конгресса, чтобы его внести. Чтобы он прошёл, потом нужно абсолютное большинство палаты.",
  "¿Cuántas veces ha prosperado una moción de censura desde 1978?":
    "Сколько раз с 1978 года вотум недоверия проходил?",
  "Una": "Один",
  "Una sola, en 2018. El carácter constructivo lo explica: es fácil reunir votos contra alguien y difícil reunirlos a favor de un sustituto concreto.":
    "Только один раз, в 2018 году. Объясняет это конструктивный характер: собрать голоса против кого-то легко, а за определённую замену — трудно.",
  "¿Qué mayoría exige una cuestión de confianza?": "Какого большинства требует вопрос о доверии?",
  "Mayoría simple, a diferencia de la moción de censura, que exige mayoría absoluta. La plantea el propio presidente y perderla le obliga a dimitir.":
    "Простого большинства, в отличие от вотума недоверия, где нужно абсолютное. Ставит его сам председатель правительства, и проигрыш обязывает его уйти в отставку.",
  "¿Cuándo NO puede el presidente disolver las Cortes?":
    "Когда председатель правительства НЕ может распустить кортесы?",
  "En el primer año de legislatura": "В первый год созыва",
  "Mientras esté en trámite una moción de censura": "Пока рассматривается вотум недоверия",
  "Durante el periodo de sesiones": "Во время сессии",
  "En año electoral europeo": "В год европейских выборов",
  "Ni con una moción de censura en trámite, ni antes de que haya pasado un año desde la disolución anterior. Las dos limitaciones están en el artículo 115.":
    "Ни пока рассматривается вотум недоверия, ни раньше, чем через год после прошлого роспуска. Оба ограничения стоят в статье 115.",
  "¿Qué es la potestad reglamentaria?": "Что такое право издавать регламенты?",
  "La facultad del Gobierno de dictar normas de rango inferior a la ley":
    "Возможность правительства издавать нормы рангом ниже закона",
  "El derecho del Gobierno a vetar leyes": "Право правительства налагать вето на законы",
  "La capacidad de convocar referendos": "Способность назначать референдумы",
  "El poder de nombrar jueces": "Власть назначать судей",
  "Los reglamentos desarrollan y aplican las leyes sin poder contradecirlas. Es una de las funciones que el artículo 97 atribuye al Gobierno.":
    "Регламенты развивают и применяют законы, не имея права им противоречить. Это одна из задач, которые статья 97 отводит правительству.",
  "¿Cómo se llama el órgano colegiado que forman el presidente y los ministros?":
    "Как называется коллегиальный орган, который образуют председатель и министры?",
  "El Consejo de Estado": "Государственный совет",
  "El Consejo de Ministros": "Совет министров",
  "El Consejo General": "Генеральный совет",
  "La Junta de Gobierno": "Правительственная хунта",
  "El Consejo de Ministros. El Consejo de Estado es otra cosa: el supremo órgano consultivo del Gobierno.":
    "Совет министров. Государственный совет — это другое: высший консультативный орган правительства.",
  "¿Cuántos días deben pasar entre la presentación de una moción de censura y su votación?":
    "Сколько дней должно пройти между внесением вотума недоверия и голосованием по нему?",
  "Cinco días, y en los dos primeros pueden presentarse mociones alternativas. El plazo da tiempo a negociar y a que aparezcan otros candidatos.":
    "Пять дней, и в первые два можно внести встречные вотумы. Срок даёт время договориться и появиться другим кандидатам.",
  "¿Qué le ocurre al candidato incluido en una moción de censura que prospera?":
    "Что происходит с кандидатом, включённым в прошедший вотум недоверия?",
  "Debe someterse después a una investidura ordinaria":
    "Он должен потом пройти обычное утверждение",
  "Queda automáticamente investido presidente":
    "Он автоматически становится утверждённым председателем правительства",
  "Asume solo de forma interina hasta las elecciones": "Он вступает только временно, до выборов",
  "Debe ser ratificado por el Senado": "Его должен утвердить Сенат",
  "La moción constructiva inviste y destituye en el mismo acto. Por eso no puede presentarse sin candidato: no serviría para nada dejar el país sin gobierno.":
    "Конструктивный вотум одним и тем же действием и утверждает, и смещает. Поэтому его нельзя внести без кандидата: оставлять страну без правительства было бы ни к чему.",
  "¿En nombre de quién se administra la justicia en España?":
    "От чьего имени в Испании отправляется правосудие?",
  "Del pueblo": "От имени народа",
  "Del rey": "От имени короля",
  "Del Estado": "От имени государства",
  "De las Cortes": "От имени кортесов",
  "El artículo 117 dice que la justicia emana del pueblo y se administra en nombre del rey. Las dos mitades de la frase van juntas y suelen citarse a medias.":
    "Статья 117 говорит, что правосудие исходит от народа и отправляется от имени короля. Обе половины фразы идут вместе, а цитируют их обычно наполовину.",
  "¿Cómo se accede a la carrera judicial?": "Как попадают в судейскую карьеру?",
  "Por nombramiento del Gobierno": "По назначению правительства",
  "Por oposición": "Через конкурсный экзамен",
  "Por elección popular": "Всенародными выборами",
  "Por designación del CGPJ": "По назначению CGPJ",
  "Por oposición, un examen público y competitivo. Es lo que mantiene el acceso fuera del alcance de la política, aunque el gobierno de la carrera lo lleve el CGPJ.":
    "Через oposición — открытый состязательный экзамен. Именно это держит вход вне досягаемости политики, хотя карьерой ведает CGPJ.",
  "¿Cuántos vocales tiene el Consejo General del Poder Judicial?":
    "Сколько членов в Генеральном совете судебной власти?",
  "Veinticinco": "Двадцать пять",
  "Veinte vocales más su presidente, que lo es también del Tribunal Supremo, con mandato de cinco años. Doce son los magistrados del Tribunal Constitucional.":
    "Двадцать членов плюс его председатель, он же председатель Верховного суда, со сроком в пять лет. Двенадцать — это судьи Конституционного суда.",
  "¿Cuáles son los cuatro órdenes jurisdiccionales?": "Каковы четыре ветви юрисдикции?",
  "Civil, penal, contencioso-administrativo y social":
    "Гражданская, уголовная, административная и трудовая",
  "Civil, penal, militar y mercantil": "Гражданская, уголовная, военная и торговая",
  "Constitucional, civil, penal y laboral": "Конституционная, гражданская, уголовная и трудовая",
  "Ordinario, especial, foral y autonómico": "Обычная, особая, фуэральная и автономная",
  "El contencioso-administrativo resuelve los pleitos con la Administración y el social los laborales. La jurisdicción militar existe, pero no es uno de los cuatro órdenes ordinarios.":
    "Административная разбирает споры с администрацией, а трудовая — трудовые. Военная юрисдикция существует, но в четвёрку обычных ветвей не входит.",
  "¿Qué tribunal tiene competencia en toda España sobre delitos como el terrorismo?":
    "Какой суд имеет полномочия по всей Испании по таким преступлениям, как терроризм?",
  "La Audiencia Nacional": "Национальный суд",
  "Las Audiencias Provinciales": "Провинциальные суды",
  "La Audiencia Nacional, con sede en Madrid y jurisdicción en todo el territorio para materias tasadas: terrorismo, delitos económicos de gran alcance, extradiciones.":
    "Национальный суд, со штаб-квартирой в Мадриде и юрисдикцией по всей стране по перечисленным делам: терроризм, крупные экономические преступления, выдача.",
  "¿Cuántos Tribunales Superiores de Justicia hay?": "Сколько существует Высших судов правосудия?",
  "Uno por comunidad autónoma": "По одному на автономное сообщество",
  "Cuatro, uno por orden jurisdiccional": "Четыре, по одному на ветвь юрисдикции",
  "Uno por comunidad autónoma. Culminan la organización judicial en su territorio, pero no están por encima del Tribunal Supremo.":
    "По одному на автономное сообщество. Они венчают судебное устройство на своей земле, но выше Верховного суда не стоят.",
  "¿Quién nombra al fiscal general del Estado?":
    "Кто назначает генерального прокурора государства?",
  "El rey, a propuesta del Gobierno, oído el CGPJ":
    "Король, по предложению правительства, выслушав CGPJ",
  "El Congreso por tres quintos": "Конгресс тремя пятыми",
  "El propio Ministerio Fiscal": "Сама прокуратура",
  "Lo nombra el rey a propuesta del Gobierno, oído el Consejo General del Poder Judicial. Esa dependencia del ejecutivo es objeto de debate recurrente.":
    "Его назначает король по предложению правительства, выслушав Генеральный совет судебной власти. Эта зависимость от исполнительной власти — предмет постоянного спора.",
  "¿Cuántos magistrados del Tribunal Constitucional propone el Congreso?":
    "Сколько судей Конституционного суда предлагает Конгресс?",
  "Ocho": "Восемь",
  "Cuatro, por mayoría de tres quintos. Otros cuatro los propone el Senado, dos el Gobierno y dos el Consejo General del Poder Judicial.":
    "Четырёх, большинством в три пятых. Ещё четверых предлагает Сенат, двоих — правительство и двоих — Генеральный совет судебной власти.",
  "¿Cuánto dura el mandato de un magistrado del Tribunal Constitucional?":
    "Сколько длится срок судьи Конституционного суда?",
  "Nueve años": "Девять лет",
  "Doce años": "Двенадцать лет",
  "Nueve años, y el tribunal se renueva por terceras partes cada tres, de modo que nunca cambia entero de una vez.":
    "Девять лет, и суд обновляется по трети каждые три года, так что целиком он не меняется никогда.",
  "¿Cada cuánto se renueva por terceras partes el Tribunal Constitucional?":
    "Как часто Конституционный суд обновляется по трети?",
  "Cada año": "Каждый год",
  "Cada tres años": "Каждые три года",
  "Cada cinco años": "Каждые пять лет",
  "Cada nueve años": "Каждые девять лет",
  "Cada tres años se renueva un tercio. El escalonamiento evita que una sola mayoría parlamentaria componga el tribunal entero.":
    "Каждые три года обновляется треть. Ступенчатость не даёт одному парламентскому большинству составить весь суд.",
  "¿Cuál de estas NO es competencia del Tribunal Constitucional?":
    "Что из этого НЕ входит в полномочия Конституционного суда?",
  "El recurso de inconstitucionalidad": "Жалоба о неконституционности",
  "El recurso de amparo": "Жалоба ампаро",
  "Los conflictos de competencia entre el Estado y las comunidades":
    "Споры о полномочиях между государством и сообществами",
  "El recurso de casación penal": "Уголовная кассационная жалоба",
  "La casación es del Tribunal Supremo, que culmina la jurisdicción ordinaria. El Constitucional juzga leyes, derechos fundamentales y repartos de competencia.":
    "Кассация — дело Верховного суда, который венчает обычную юрисдикцию. Конституционный судит законы, основные права и распределение полномочий.",
  "¿Qué orden jurisdiccional resuelve los pleitos con la Administración?":
    "Какая ветвь юрисдикции разбирает споры с администрацией?",
  "El civil": "Гражданская",
  "El penal": "Уголовная",
  "El contencioso-administrativo": "Административная",
  "El social": "Трудовая",
  "El contencioso-administrativo. El social ve los conflictos laborales y de Seguridad Social, y el civil los de particulares entre sí.":
    "Административная. Трудовая рассматривает трудовые споры и споры по Seguridad Social, а гражданская — споры частных лиц между собой.",
  "¿Qué prevé el artículo 125 sobre la participación ciudadana en la justicia?":
    "Что статья 125 предусматривает об участии граждан в правосудии?",
  "El tribunal del jurado": "Суд присяжных",
  "La elección popular de los jueces": "Всенародные выборы судей",
  "El referéndum sobre sentencias": "Референдум по приговорам",
  "La mediación obligatoria": "Обязательное посредничество",
  "El artículo 125 abre la puerta a la acción popular y al jurado, que juzga determinados delitos. Los jueces profesionales no se eligen: se accede por oposición.":
    "Статья 125 открывает дорогу народному обвинению и суду присяжных, который судит определённые преступления. Профессиональных судей не избирают: туда попадают через конкурсный экзамен.",
  "¿Desde qué edad se puede votar en España?": "С какого возраста в Испании можно голосовать?",
  "Desde los dieciséis": "С шестнадцати",
  "Desde los dieciocho": "С восемнадцати",
  "Desde los veintiuno": "С двадцати одного",
  "Desde los veinticinco": "С двадцати пяти",
  "Desde los dieciocho, que es también la mayoría de edad. El sufragio es universal, libre, igual, directo y secreto.":
    "С восемнадцати, это же и возраст совершеннолетия. Голосование всеобщее, свободное, равное, прямое и тайное.",
  "¿Qué circunscripción se emplea en las elecciones europeas?":
    "Какой округ используют на европейских выборах?",
  "Circunscripción única para todo el país, a diferencia de las generales, que se reparten por provincias.":
    "Единый округ на всю страну, в отличие от общенациональных выборов, которые делят по провинциям.",
  "Si ningún candidato reúne la mayoría absoluta de los concejales, ¿quién resulta elegido alcalde?":
    "Если ни один кандидат не соберёт абсолютного большинства советников, кого изберут мэром?",
  "Se repiten las elecciones": "Выборы повторяют",
  "El cabeza de la lista más votada": "Первого в списке, набравшем больше всех голосов",
  "El concejal de más edad": "Самого старшего советника",
  "Decide el pleno por sorteo": "Совет решает жребием",
  "La ley prevé esa salida automática para que ningún ayuntamiento quede sin alcalde. Es la razón de que gobiernen a veces listas que no tienen mayoría en el pleno.":
    "Закон предусматривает такой самоходный выход, чтобы ни одно муниципальное управление не осталось без мэра. Поэтому иногда правят списки, у которых нет большинства в совете.",
  "¿Qué exige el artículo 6 a los partidos políticos?":
    "Чего статья 6 требует от политических партий?",
  "Que tengan sede en Madrid": "Чтобы у них был офис в Мадриде",
  "Que su estructura interna y su funcionamiento sean democráticos":
    "Чтобы их внутреннее устройство и работа были демократическими",
  "Que presenten candidatos en todas las provincias":
    "Чтобы они выставляли кандидатов во всех провинциях",
  "Que se financien solo con cuotas": "Чтобы они кормились только членскими взносами",
  "El mismo requisito que el artículo 7 impone a sindicatos y asociaciones empresariales. Es una exigencia poco frecuente en el derecho comparado.":
    "То же требование статья 7 предъявляет профсоюзам и объединениям предпринимателей. В сравнительном праве такое требование встречается нечасто.",
  "¿Cuáles son los dos sindicatos mayoritarios en España?":
    "Какие два профсоюза в Испании самые крупные?",
  "Comisiones Obreras y la Unión General de Trabajadores":
    "«Рабочие комиссии» и Всеобщий союз трудящихся",
  "La CNT y la UGT": "CNT и UGT",
  "USO y CSIF": "USO и CSIF",
  "ELA y LAB": "ELA и LAB",
  "CCOO y UGT. Los convenios que negocian se aplican a todo el sector y no solo a sus afiliados, lo que explica que su peso sea mayor que su afiliación.":
    "CCOO и UGT. Договоры, которые они выторговывают, применяются ко всей отрасли, а не только к их членам, — этим и объясняется, что вес у них больше, чем численность.",
  "¿Qué materias quedan excluidas de la iniciativa legislativa popular?":
    "Какие предметы исключены из народной законодательной инициативы?",
  "Los tributos, lo internacional, el derecho de gracia y las leyes orgánicas":
    "Налоги, международные дела, право помилования и органические законы",
  "Solo la reforma constitucional": "Только изменение Конституции",
  "Todo lo que afecte a las comunidades autónomas": "Всё, что затрагивает автономные сообщества",
  "La exclusión es amplia y limita bastante el alcance del instrumento: quedan fuera precisamente algunas de las materias sobre las que más se pediría legislar.":
    "Исключение широкое и заметно сужает возможности этого средства: за бортом оказываются именно те предметы, о которых просили бы законов чаще всего.",
  "¿De quién depende el Defensor del Pueblo?": "Кому подчиняется Защитник народа?",
  "Del Gobierno": "Правительству",
  "De las Cortes Generales": "Генеральным кортесам",
  "Del Tribunal Constitucional": "Конституционному суду",
  "Del Consejo General del Poder Judicial": "Генеральному совету судебной власти",
  "Es alto comisionado de las Cortes Generales, no del Gobierno. Esa dependencia parlamentaria es lo que le permite supervisar a la Administración.":
    "Он высокий уполномоченный Генеральных кортесов, а не правительства. Именно эта парламентская подчинённость и позволяет ему надзирать за администрацией.",
  "¿Son ejecutivas las resoluciones del Defensor del Pueblo?":
    "Обязательны ли к исполнению решения Защитника народа?",
  "Sí, obligan a la Administración": "Да, они обязывают администрацию",
  "No: recomienda y da publicidad, y puede recurrir leyes ante el Tribunal Constitucional":
    "Нет: он рекомендует и предаёт огласке, а законы может обжаловать в Конституционном суде",
  "Sí, si las ratifica el Congreso": "Да, если их утвердит Конгресс",
  "Solo en materia de extranjería": "Только по делам иностранцев",
  "Su fuerza es la del informe público y la del recurso. No anula actos ni impone sanciones: para eso están los tribunales.":
    "Его сила — в открытом докладе и в жалобе. Он не отменяет актов и не налагает взысканий: для этого есть суды.",
  "¿Qué organismo fiscaliza las cuentas del Estado y del sector público?":
    "Какой орган проверяет счета государства и государственного сектора?",
  "El Tribunal de Cuentas": "Счётная палата",
  "El Banco de España": "Банк Испании",
  "La Agencia Tributaria": "Налоговое агентство",
  "El Tribunal de Cuentas, previsto en el artículo 136 y dependiente también de las Cortes. La Agencia Tributaria recauda, que es otra función.":
    "Счётная палата, предусмотренная статьёй 136 и тоже подчинённая кортесам. Налоговое агентство собирает налоги, а это другая задача.",
  "¿Quién convoca un referéndum consultivo?": "Кто назначает консультативный референдум?",
  "El rey, a propuesta del presidente autorizada por el Congreso":
    "Король, по предложению председателя правительства, разрешённому Конгрессом",
  "El Congreso por sí solo": "Конгресс сам по себе",
  "El Gobierno por decreto": "Правительство декретом",
  "Las comunidades autónomas en su territorio": "Автономные сообщества на своей земле",
  "Los tres pasos del artículo 92 son sucesivos: propone el presidente, autoriza el Congreso, convoca el rey. Y su resultado es consultivo, no vinculante en sentido jurídico.":
    "Три шага статьи 92 идут один за другим: предлагает председатель правительства, разрешает Конгресс, назначает король. А итог его совещательный, юридически необязательный.",
  "¿Qué se vota en unas elecciones municipales?": "За что голосуют на муниципальных выборах?",
  "El alcalde": "За мэра",
  "Los concejales": "За советников",
  "El presidente de la diputación": "За председателя провинциального собрания",
  "Una lista de concejales. El alcalde lo elige después el pleno, y el presidente de la diputación provincial sale de entre los concejales electos.":
    "За список советников. Мэра потом избирает совет, а председатель провинциального собрания выходит из числа избранных советников.",
  "¿Qué permite el derecho de petición del artículo 29?":
    "Что позволяет право на обращение по статье 29?",
  "Dirigirse por escrito a los poderes públicos": "Обращаться письменно к органам власти",
  "Exigir una respuesta favorable de la Administración":
    "Требовать от администрации благоприятного ответа",
  "Convocar una manifestación": "Созывать демонстрацию",
  "Recurrir una ley ante el Tribunal Constitucional": "Обжаловать закон в Конституционном суде",
  "Es un derecho antiguo, sencillo y poco utilizado: permite dirigirse por escrito, individual o colectivamente, sin garantizar el contenido de la respuesta.":
    "Это право старое, простое и мало используемое: оно позволяет обратиться письменно, поодиночке или сообща, но содержания ответа не гарантирует.",
  "¿Cómo se elige al presidente de una comunidad autónoma?":
    "Как избирают председателя автономного сообщества?",
  "Directamente por los ciudadanos": "Напрямую гражданами",
  "Por el parlamento autonómico, que lo inviste": "Парламентом автономии, который его утверждает",
  "Por el Gobierno central": "Центральным правительством",
  "Por los alcaldes de la comunidad": "Мэрами сообщества",
  "Igual que el presidente del Gobierno en las generales: se vota una cámara y la cámara inviste. La única elección directa de personas en España es la del Senado.":
    "Так же, как председателя правительства на общенациональных выборах: голосуют за палату, а палата утверждает. Единственные прямые выборы людей в Испании — сенатские.",
  "¿Qué ciudad se considera la más antigua de Europa occidental?":
    "Какой город считают самым старым в западной Европе?",
  "Cádiz": "Кадис",
  "Tarragona": "Таррагона",
  "Cádiz, fundada por los fenicios como factoría comercial. Antes de Roma, la costa peninsular recibió a fenicios, griegos y cartagineses.":
    "Кадис, основанный финикийцами как торговая фактория. До Рима побережье полуострова принимало финикийцев, греков и карфагенян.",
  "¿Dónde desembarcaron los romanos en el 218 antes de Cristo?":
    "Где римляне высадились в 218 году до нашей эры?",
  "En Ampurias": "В Ампуриасе",
  "En Cartagena": "В Картахене",
  "En Tarragona": "В Таррагоне",
  "En Ampurias, en la costa catalana, durante la segunda guerra púnica. La conquista completa tardaría dos siglos, hasta las guerras cántabras.":
    "В Ампуриасе, на каталонском побережье, во время второй Пунической войны. Полное завоевание займёт два века, до Кантабрийских войн.",
  "¿Qué guerras cerraron la conquista romana de la Península?":
    "Какие войны завершили римское завоевание полуострова?",
  "Las guerras púnicas": "Пунические войны",
  "Las guerras cántabras": "Кантабрийские войны",
  "Las guerras lusitanas": "Лузитанские войны",
  "Las guerras celtíberas": "Кельтиберские войны",
  "Las cántabras, hacia el 19 antes de Cristo, dirigidas en parte por el propio Augusto. La resistencia del norte fue la última en ceder.":
    "Кантабрийские, около 19 года до нашей эры, отчасти под началом самого Августа. Сопротивление севера уступило последним.",
  "¿Qué lenguas actuales de España proceden del latín?":
    "Какие нынешние языки Испании происходят от латыни?",
  "El castellano, el gallego y el catalán": "Кастильский, галисийский и каталанский",
  "El castellano y el euskera": "Кастильский и баскский",
  "Solo el castellano": "Только кастильский",
  "El euskera y el gallego": "Баскский и галисийский",
  "Las tres son lenguas romances. El euskera no lo es: es anterior a la llegada de Roma y sin parentesco conocido con ninguna lengua viva.":
    "Все три — романские языки. Баскский таковым не является: он старше прихода Рима, и известного родства ни с одним живым языком у него нет.",
  "¿Qué ocurrió en el III Concilio de Toledo, en el 589?":
    "Что произошло на Третьем Толедском соборе в 589 году?",
  "Se promulgó el Liber Iudiciorum": "Был обнародован Liber Iudiciorum",
  "Recaredo se convirtió al catolicismo": "Реккаред перешёл в католичество",
  "Se fundó el reino de Asturias": "Было основано королевство Астурия",
  "Se dividió el reino visigodo": "Вестготское королевство разделилось",
  "El rey abandonó el arrianismo, con lo que el reino quedó unificado en religión y la monarquía atada a la Iglesia. El Liber Iudiciorum llegaría en el 654.":
    "Король оставил арианство, и королевство стало единым по вере, а монархия оказалась привязана к церкви. Liber Iudiciorum придёт в 654 году.",
  "¿Qué pueblos entraron en la Península en el 409?":
    "Какие народы вошли на полуостров в 409 году?",
  "Suevos, vándalos y alanos": "Свевы, вандалы и аланы",
  "Normandos y sajones": "Норманны и саксы",
  "Hunos y ostrogodos": "Гунны и остготы",
  "Bereberes y árabes": "Берберы и арабы",
  "Tras ellos llegaron los visigodos, que acabaron imponiéndose y estableciendo la capital en Toledo. Los ejércitos musulmanes no cruzarían hasta el 711.":
    "За ними пришли вестготы, которые в итоге взяли верх и поставили столицу в Толедо. Мусульманские войска перейдут пролив только в 711 году.",
  "¿En qué batalla fue derrotado el último rey visigodo?":
    "В каком сражении был разбит последний вестготский король?",
  "En Covadonga": "При Ковадонге",
  "En Guadalete": "При Гвадалете",
  "En Las Navas de Tolosa": "При Лас-Навас-де-Толоса",
  "En Numancia": "При Нуманции",
  "En Guadalete, en el 711. Covadonga fue en cambio la escaramuza en que la tradición sitúa el origen del reino de Asturias, once años después.":
    "При Гвадалете, в 711 году. А Ковадонга — это стычка, в которой предание видит начало королевства Астурия, одиннадцать лет спустя.",
  "¿Quién proclamó el Califato de Córdoba?": "Кто провозгласил Кордовский халифат?",
  "Almanzor": "Альманзор",
  "Abderramán III": "Абдаррахман III",
  "Boabdil": "Боабдиль",
  "Tariq": "Тарик",
  "Abderramán III, en el 929, con lo que el emirato se independizó también en lo religioso. Boabdil fue el último rey de Granada, cinco siglos después.":
    "Абдаррахман III, в 929 году, и тем самым эмират обрёл самостоятельность ещё и в делах веры. Боабдиль был последним королём Гранады, пятью веками позже.",
  "¿Qué son los reinos de taifas?": "Что такое тайфы?",
  "Los estados en que se fragmentó al-Ándalus tras 1031":
    "Государства, на которые распался аль-Андалус после 1031 года",
  "Los condados cristianos del Pirineo": "Христианские графства Пиренеев",
  "Las provincias romanas de Hispania": "Римские провинции Испании",
  "Los territorios que Castilla cedió a Portugal": "Земли, которые Кастилия уступила Португалии",
  "Más de veinte estados rivales surgidos del hundimiento del califato. Su debilidad les obligó a pagar tributos a los reinos del norte y a llamar en su auxilio a almorávides y almohades.":
    "Больше двадцати соперничающих государств, возникших из крушения халифата. Слабость заставляла их платить дань северным королевствам и звать на помощь Альморавидов и Альмохадов.",
  "¿Qué ciudad tomó Alfonso VI en 1085?": "Какой город взял Альфонсо VI в 1085 году?",
  "Zaragoza": "Сарагосу",
  "Toledo, la antigua capital visigoda, que se convirtió en el gran punto de contacto entre las culturas y sede de la Escuela de Traductores.":
    "Толедо, старую вестготскую столицу, которая стала большой точкой соприкосновения культур и местом Школы переводчиков.",
  "¿Qué hacía la Escuela de Traductores de Toledo?":
    "Чем занималась Толедская школа переводчиков?",
  "Enseñaba latín a los nobles castellanos": "Учила кастильских дворян латыни",
  "Vertía al latín obras griegas y árabes que Europa había perdido":
    "Перекладывала на латынь греческие и арабские труды, которые Европа утратила",
  "Traducía la Biblia a las lenguas peninsulares": "Переводила Библию на языки полуострова",
  "Formaba intérpretes para la corte": "Готовила переводчиков для двора",
  "Cristianos, musulmanes y judíos trabajaron juntos en ella. Por esa vía volvieron a Europa Aristóteles, Euclides y buena parte de la ciencia griega, a través del árabe.":
    "Христиане, мусульмане и евреи работали в ней вместе. Этим путём в Европу вернулись Аристотель, Евклид и добрая часть греческой науки — через арабский.",
  "¿Qué victoria de 1212 abrió el valle del Guadalquivir?":
    "Какая победа 1212 года открыла долину Гвадалквивира?",
  "Guadalete": "Гвадалете",
  "Las Navas de Tolosa": "Лас-Навас-де-Толоса",
  "Covadonga": "Ковадонга",
  "Lepanto": "Лепанто",
  "Las Navas de Tolosa, con los reyes de Castilla, Aragón y Navarra combatiendo juntos. Córdoba caería en 1236 y Sevilla en 1248.":
    "Лас-Навас-де-Толоса, где короли Кастилии, Арагона и Наварры бились вместе. Кордова падёт в 1236 году, а Севилья в 1248-м.",
  "¿Qué quedaba de al-Ándalus después de la toma de Sevilla en 1248?":
    "Что оставалось от аль-Андалуса после взятия Севильи в 1248 году?",
  "Nada: la conquista estaba completa": "Ничего: завоевание было завершено",
  "El reino nazarí de Granada": "Насридское королевство Гранада",
  "El reino de Valencia": "Королевство Валенсия",
  "Las islas Baleares": "Балеарские острова",
  "Granada sobrevivió como reino vasallo dos siglos y medio más, y en ese tiempo construyó la Alhambra. No caería hasta 1492.":
    "Гранада прожила вассальным королевством ещё два с половиной века и за это время построила Альгамбру. Она падёт только в 1492 году.",
  "¿En qué año se casaron Isabel de Castilla y Fernando de Aragón?":
    "В каком году поженились Изабелла Кастильская и Фердинанд Арагонский?",
  "En 1469": "В 1469 году",
  "En 1479": "В 1479 году",
  "En 1492": "В 1492 году",
  "En 1512": "В 1512 году",
  "En 1469. Fue una unión dinástica: cada reino conservó sus leyes, sus cortes, su moneda y sus aduanas durante dos siglos y medio más.":
    "В 1469 году. Это был династический союз: каждое королевство ещё два с половиной века сохраняло свои законы, свои кортесы, свою монету и свои таможни.",
  "¿Qué significa que la unión de Castilla y Aragón fue dinástica?":
    "Что значит, что союз Кастилии и Арагона был династическим?",
  "Que solo duró una generación": "Что он продержался лишь одно поколение",
  "Que compartieron corona pero siguieron siendo reinos distintos, con leyes propias":
    "Что у них была общая корона, но они остались разными королевствами со своими законами",
  "Que la decidieron las cortes de ambos reinos": "Что его решили кортесы обоих королевств",
  "Que fue reconocida por el papa": "Что его признал папа",
  "Compartieron monarcas, no ordenamiento. La unificación jurídica llegó con los Decretos de Nueva Planta, ya en el siglo XVIII y con un rey Borbón.":
    "Общими у них были государи, а не правопорядок. Правовое объединение пришло с Декретами Новой основы, уже в XVIII веке и при короле из Бурбонов.",
  "¿Qué obra publicó Nebrija en 1492?": "Какой труд издал Небриха в 1492 году?",
  "El primer diccionario de la lengua": "Первый словарь языка",
  "La primera gramática de una lengua romance": "Первую грамматику романского языка",
  "La primera traducción de la Biblia al castellano": "Первый перевод Библии на кастильский",
  "El primer atlas del Nuevo Mundo": "Первый атлас Нового Света",
  "La Gramática castellana, la primera de una lengua romance. Que apareciera el mismo año que Granada y América no fue casualidad: la lengua se pensaba ya como instrumento de gobierno.":
    "«Кастильскую грамматику», первую для романского языка. То, что она вышла в один год с Гранадой и Америкой, не случайность: язык уже мыслили как орудие управления.",
  "¿En qué año se incorporó Navarra a la corona?": "В каком году Наварра вошла в корону?",
  "En 1580": "В 1580 году",
  "En 1512, conservando sus fueros e instituciones, que están en el origen del régimen foral que Navarra mantiene hoy.":
    "В 1512 году, сохранив свои фуэрос и учреждения, из которых вырос фуэральный порядок, который Наварра держит и сегодня.",
  "¿Por qué Carlos I es también conocido como Carlos V?": "Почему Карла I знают и как Карла V?",
  "Porque reinó dos veces": "Потому что он правил дважды",
  "Porque fue el quinto rey de Castilla con ese nombre":
    "Потому что он был пятым королём Кастилии с этим именем",
  "Porque fue además emperador del Sacro Imperio":
    "Потому что он был ещё и императором Священной Римской империи",
  "Porque cambió de nombre al abdicar": "Потому что при отречении он сменил имя",
  "Carlos I de España y V del Sacro Imperio Romano Germánico. Heredó Castilla, Aragón, Italia, Flandes, Austria y América, un conjunto sin precedentes.":
    "Карл I Испанский и V Священной Римской империи германской нации. Он унаследовал Кастилию, Арагон, Италию, Фландрию, Австрию и Америку — небывалое собрание земель.",
  "¿En qué año fijó Felipe II la capital en Madrid?":
    "В каком году Филипп II сделал столицей Мадрид?",
  "En 1516": "В 1516 году",
  "En 1561": "В 1561 году",
  "En 1605": "В 1605 году",
  "En 1561. Hasta entonces la corte era itinerante, y se eligió Madrid por su posición central más que por su tamaño, que era modesto.":
    "В 1561 году. До того двор кочевал, и Мадрид выбрали за срединное положение, а не за размер, который был скромным.",
  "¿Entre qué años estuvo Portugal unido a la corona española?":
    "В какие годы Португалия была соединена с испанской короной?",
  "Entre 1492 y 1512": "Между 1492 и 1512",
  "Entre 1580 y 1640": "Между 1580 и 1640",
  "Entre 1640 y 1713": "Между 1640 и 1713",
  "Nunca lo estuvo": "Она никогда ею не была",
  "Sesenta años, desde Felipe II hasta la sublevación de 1640, simultánea a la de Cataluña. Portugal recuperó entonces su independencia de forma definitiva.":
    "Шестьдесят лет, от Филиппа II до восстания 1640 года, одновременного с каталонским. Португалия тогда вернула себе независимость окончательно.",
  "¿Qué provocó las sublevaciones de Portugal y Cataluña en 1640?":
    "Что вызвало восстания Португалии и Каталонии в 1640 году?",
  "Una epidemia de peste": "Эпидемия чумы",
  "Las exigencias fiscales y militares del conde-duque de Olivares":
    "Налоговые и военные требования графа-герцога Оливареса",
  "La expulsión de los moriscos": "Изгнание морисков",
  "El descubrimiento de la plata de Potosí": "Открытие серебра Потоси",
  "El esfuerzo de guerra continuo agotó a los reinos periféricos y las dos revueltas estallaron el mismo año. Cataluña volvió a la corona tras doce años; Portugal, nunca.":
    "Непрерывное военное напряжение вымотало окраинные королевства, и оба мятежа вспыхнули в один год. Каталония вернулась к короне через двенадцать лет; Португалия — никогда.",
  "¿Quién pintó Las Meninas?": "Кто написал «Менин»?",
  "El Greco": "Эль Греко",
  "Velázquez": "Веласкес",
  "Murillo": "Мурильо",
  "Goya": "Гойя",
  "Diego Velázquez, en 1656, y el cuadro está en el Museo del Prado. Goya es un siglo y medio posterior, ya en la época de la Guerra de la Independencia.":
    "Диего Веласкес, в 1656 году, и картина висит в музее Прадо. Гойя на полтора века позже, уже во времена Войны за независимость.",
  "¿Qué perdió España en el Tratado de Utrecht de 1713?":
    "Что Испания потеряла по Утрехтскому договору 1713 года?",
  "Cuba y Filipinas": "Кубу и Филиппины",
  "Sus territorios europeos y Gibraltar": "Свои европейские владения и Гибралтар",
  "Navarra y el Rosellón": "Наварру и Руссильон",
  "Portugal y sus colonias": "Португалию и её колонии",
  "Los territorios en Italia y Flandes, además de Menorca y Gibraltar, que sigue siendo británico. Cuba y Filipinas se perdieron en 1898.":
    "Владения в Италии и Фландрии, а также Менорку и Гибралтар, который остаётся британским. Кубу и Филиппины потеряли в 1898 году.",
  "¿Qué hicieron los Decretos de Nueva Planta?": "Что сделали Декреты Новой основы?",
  "Crear las provincias actuales": "Создали нынешние провинции",
  "Suprimir las instituciones propias de la Corona de Aragón y extender el modelo castellano":
    "Упразднили собственные учреждения Арагонской короны и распространили кастильский образец",
  "Reformar el ejército tras el Desastre del 98":
    "Преобразовали армию после катастрофы 98-го года",
  "Fundar las primeras universidades": "Основали первые университеты",
  "Felipe V los impuso tras ganar la Guerra de Sucesión. Con ellos la unión dinástica de 1469 se convirtió, dos siglos y medio después, en un Estado unificado.":
    "Филипп V навязал их, выиграв Войну за испанское наследство. Ими династический союз 1469 года превратился, два с половиной века спустя, в единое государство.",
  "¿Cómo se llama el periodo cultural que va aproximadamente del siglo XVI al XVII?":
    "Как называется культурная эпоха примерно от XVI до XVII века?",
  "El Renacimiento": "Возрождение",
  "La Ilustración": "Просвещение",
  "El Modernismo": "Модернизм",
  "El Siglo de Oro, que reúne a Cervantes, Lope, Calderón, Quevedo y Góngora en literatura y a El Greco, Velázquez y Murillo en pintura.":
    "Золотой век, который собирает Сервантеса, Лопе, Кальдерона, Кеведо и Гонгору в словесности и Эль Греко, Веласкеса и Мурильо в живописи.",
  "¿Qué ciudad conserva hoy Las Meninas y buena parte de la pintura del Siglo de Oro?":
    "В каком городе сегодня хранятся «Менины» и добрая часть живописи Золотого века?",
  "Madrid, en el Museo del Prado": "В Мадриде, в музее Прадо",
  "Barcelona, en el MNAC": "В Барселоне, в MNAC",
  "Sevilla, en el Museo de Bellas Artes": "В Севилье, в Музее изящных искусств",
  "Toledo, en el Museo del Greco": "В Толедо, в музее Эль Греко",
  "El Museo del Prado, en Madrid, reúne la colección real. El Greco tiene museo propio en Toledo, pero el grueso de la pintura de la época está en el Prado.":
    "Музей Прадо в Мадриде собрал королевскую коллекцию. У Эль Греко свой музей в Толедо, но основная масса живописи той эпохи — в Прадо.",
  "¿A quién colocó Napoleón en el trono español?": "Кого Наполеон посадил на испанский трон?",
  "A Fernando VII": "Фердинанда VII",
  "A su hermano José I": "Своего брата Хосе I",
  "A Amadeo de Saboya": "Амадея Савойского",
  "A Carlos IV": "Карла IV",
  "A José Bonaparte, conocido como José I. El levantamiento del 2 de mayo de 1808 dio comienzo a la Guerra de la Independencia.":
    "Жозефа Бонапарта, известного как Хосе I. Восстание 2 мая 1808 года положило начало Войне за независимость.",
  "¿Qué palabra española de uso internacional nació en la Guerra de la Independencia?":
    "Какое испанское слово международного обихода родилось в Войне за независимость?",
  "Fiesta": "Fiesta",
  "Guerrilla": "Guerrilla — «герилья»",
  "Siesta": "Siesta",
  "Armada": "Armada",
  "Guerrilla, por las partidas irregulares que hostigaban al ejército francés. Es uno de los préstamos españoles más extendidos en otras lenguas.":
    "Guerrilla, по нерегулярным отрядам, которые донимали французскую армию. Это одно из самых распространённых испанских заимствований в других языках.",
  "¿En qué ciudad se aprobó la primera Constitución española?":
    "В каком городе приняли первую испанскую Конституцию?",
  "En Madrid": "В Мадриде",
  "En Bayona": "В Байонне",
  "En Cádiz, la ciudad que resistía mientras el resto del país estaba ocupado. Se aprobó el 19 de marzo de 1812.":
    "В Кадисе, городе, который держался, пока остальная страна была занята. Её приняли 19 марта 1812 года.",
  "¿Qué principio proclamaba la Constitución de 1812?":
    "Какой принцип провозглашала Конституция 1812 года?",
  "La soberanía nacional": "Национальный суверенитет",
  "El derecho divino de los reyes": "Божественное право королей",
  "El sufragio universal femenino": "Всеобщее избирательное право для женщин",
  "El Estado autonómico": "Автономное государство",
  "Soberanía nacional, división de poderes y libertad de imprenta. Fernando VII la derogó en 1814 al regresar del cautiverio.":
    "Национальный суверенитет, разделение властей и свободу печати. Фердинанд VII отменил её в 1814 году, вернувшись из плена.",
  "¿Qué rey derogó la Constitución de 1812 al volver al trono?":
    "Какой король отменил Конституцию 1812 года, вернувшись на трон?",
  "Carlos IV": "Карл IV",
  "José I": "Хосе I",
  "Fernando VII": "Фердинанд VII",
  "Alfonso XII": "Альфонсо XII",
  "Fernando VII, en 1814, restaurando el absolutismo. El vaivén entre texto liberal y vuelta atrás se repetiría durante todo el siglo.":
    "Фердинанд VII, в 1814 году, восстановив абсолютизм. Качание между либеральным текстом и откатом назад повторялось потом весь век.",
  "¿Entre qué años se independizó la América continental española?":
    "В какие годы материковая испанская Америка стала независимой?",
  "Entre 1780 y 1800": "Между 1780 и 1800",
  "Entre 1810 y 1824": "Между 1810 и 1824",
  "Entre 1830 y 1850": "Между 1830 и 1850",
  "Entre 1860 y 1880": "Между 1860 и 1880",
  "El vacío de poder de 1808 fue el detonante, y la batalla de Ayacucho cerró el proceso en 1824. Quedaron solo Cuba, Puerto Rico y Filipinas.":
    "Пустота власти 1808 года стала запалом, а битва при Аякучо закрыла этот путь в 1824-м. Остались только Куба, Пуэрто-Рико и Филиппины.",
  "¿Qué enfrentaron en el fondo las guerras carlistas?":
    "Что по сути столкнули карлистские войны?",
  "Dos ideas de país: liberalismo frente a absolutismo, centro frente a fueros":
    "Два представления о стране: либерализм против абсолютизма, центр против фуэрос",
  "Castilla contra Aragón": "Кастилию против Арагона",
  "La Iglesia contra el ejército": "Церковь против армии",
  "El campo contra la ciudad exclusivamente": "Только деревню против города",
  "La disputa dinástica entre Isabel y su tío Carlos ocultaba un choque más hondo. Fueron tres guerras civiles a lo largo del siglo, con intervalos, hasta 1876.":
    "Династический спор между Изабеллой и её дядей Карлосом скрывал более глубокое столкновение. Это были три гражданские войны на протяжении века, с перерывами, до 1876 года.",
  "¿Cómo se llamó la revolución de 1868?": "Как назвали революцию 1868 года?",
  "La Semana Trágica": "Трагическая неделя",
  "La Gloriosa, que abrió el Sexenio Democrático. La Pepa es la Constitución de 1812, y la Restauración empieza en 1875.":
    "«Славная», которая открыла Демократическое шестилетие. «Ла Пепа» — это Конституция 1812 года, а Реставрация начинается в 1875-м.",
  "¿Qué rey extranjero ocupó el trono español durante el Sexenio Democrático?":
    "Какой иностранный король занимал испанский трон во время Демократического шестилетия?",
  "Amadeo de Saboya": "Амадей Савойский",
  "Leopoldo de Hohenzollern": "Леопольд Гогенцоллерн",
  "Fernando de Coburgo": "Фердинанд Кобургский",
  "Luis de Orleans": "Луи Орлеанский",
  "Amadeo de Saboya, que reinó dos años y abdicó en 1873. Su marcha dio paso a la Primera República.":
    "Амадей Савойский, который правил два года и отрёкся в 1873-м. Его уход открыл дорогу Первой республике.",
  "¿Quién diseñó el sistema de turno de la Restauración?":
    "Кто придумал систему чередования во время Реставрации?",
  "Cánovas del Castillo": "Кановас дель Кастильо",
  "Sagasta": "Сагаста",
  "Prim": "Прим",
  "Espartero": "Эспартеро",
  "Antonio Cánovas del Castillo, con Alfonso XII en el trono desde 1875. Los dos partidos se alternaban por acuerdo, sostenidos en el campo por el caciquismo.":
    "Антонио Кановас дель Кастильо, при Альфонсо XII на троне с 1875 года. Две партии чередовались по уговору, опираясь в деревне на касикизм.",
  "¿Qué era el caciquismo?": "Что такое касикизм?",
  "Un impuesto sobre la tierra": "Налог на землю",
  "El control de las elecciones en el campo por notables locales":
    "Управление выборами в деревне местными заправилами",
  "Un sistema de gremios urbanos": "Система городских цехов",
  "El nombre del turno de partidos": "Название партийного чередования",
  "Notables locales garantizaban el resultado que el turno había pactado de antemano. Es lo que permitía que la alternancia funcionara sin que las elecciones decidieran nada.":
    "Местные заправилы обеспечивали тот итог, о котором чередование договорилось заранее. Именно это позволяло смене работать так, чтобы выборы ничего не решали.",
  "¿Con qué país se enfrentó España en 1898?": "С какой страной Испания столкнулась в 1898 году?",
  "Con Francia": "С Францией",
  "Con el Reino Unido": "С Великобританией",
  "Con Estados Unidos": "С Соединёнными Штатами",
  "Con Alemania": "С Германией",
  "Con Estados Unidos, en una guerra breve que costó a España Cuba, Puerto Rico y Filipinas. Se lo llamó simplemente el Desastre.":
    "С Соединёнными Штатами, в короткой войне, которая стоила Испании Кубы, Пуэрто-Рико и Филиппин. Её назвали просто Катастрофой.",
  "¿Qué grupo de escritores surgió de la conmoción de 1898?":
    "Какая группа писателей выросла из потрясения 1898 года?",
  "La Generación del 27": "Поколение 27-го года",
  "La Generación del 98": "Поколение 98-го года",
  "El Modernismo catalán": "Каталонский модернизм",
  "La Institución Libre de Enseñanza": "Свободный институт образования",
  "Unamuno, Baroja, Azorín y Machado, entre otros, se preguntaron qué era España y qué debía hacer consigo misma. La Generación del 27 es tres décadas posterior.":
    "Унамуно, Бароха, Асорин и Мачадо, среди прочих, спрашивали себя, что такое Испания и что ей делать с собой. Поколение 27-го года на три десятилетия позже.",
  "¿Entre qué años gobernó la dictadura de Primo de Rivera?":
    "В какие годы правила диктатура Примо де Риверы?",
  "Entre 1917 y 1920": "Между 1917 и 1920",
  "Entre 1923 y 1930": "Между 1923 и 1930",
  "Entre 1931 y 1936": "Между 1931 и 1936",
  "Entre 1936 y 1939": "Между 1936 и 1939",
  "Siete años con el consentimiento de Alfonso XIII. Su caída arrastró al rey: las municipales del año siguiente se leyeron como un plebiscito sobre la monarquía.":
    "Семь лет с согласия Альфонсо XIII. Её падение утянуло и короля: муниципальные выборы следующего года прочли как плебисцит о монархии.",
  "¿Qué elecciones precipitaron la caída de Alfonso XIII?":
    "Какие выборы ускорили падение Альфонсо XIII?",
  "Unas generales": "Общенациональные",
  "Unas municipales": "Муниципальные",
  "Unas europeas": "Европейские",
  "Un referéndum": "Референдум",
  "Las municipales del 12 de abril de 1931. Las ciudades votaron republicano y el rey salió del país dos días después.":
    "Муниципальные 12 апреля 1931 года. Города проголосовали за республику, и через два дня король покинул страну.",
  "¿Qué introdujo la Constitución republicana de 1931?":
    "Что ввела республиканская Конституция 1931 года?",
  "El Estado laico, el divorcio y el voto femenino":
    "Светское государство, развод и женское право голоса",
  "El Estado de las autonomías tal como existe hoy": "Государство автономий в нынешнем виде",
  "El sufragio censitario": "Цензовое избирательное право",
  "Fue de las más avanzadas de su tiempo. También abrió la vía a los estatutos de autonomía: el de Cataluña se aprobó en 1932 y el del País Vasco en 1936.":
    "Она была из самых передовых своего времени. Она же открыла дорогу статутам автономии: каталонский приняли в 1932 году, а баскский — в 1936-м.",
  "¿En qué año votaron las mujeres por primera vez en España?":
    "В каком году женщины впервые голосовали в Испании?",
  "En 1931": "В 1931 году",
  "En 1933": "В 1933 году",
  "En 1977": "В 1977 году",
  "El derecho se aprobó en 1931 y se ejerció en las elecciones de 1933. Clara Campoamor lo había defendido en las Cortes contra buena parte de su propio grupo.":
    "Право приняли в 1931 году, а воспользовались им на выборах 1933-го. Клара Кампоамор отстаивала его в кортесах против доброй части собственной фракции.",
  "¿Qué diputada se opuso al voto femenino en el debate de 1931?":
    "Какая депутатка выступила против женского голоса в споре 1931 года?",
  "Margarita Nelken": "Маргарита Нелькен",
  "Victoria Kent, también republicana y también diputada, temía que el voto de las mujeres favoreciera a la derecha. El debate entre ambas es uno de los más citados de aquellas Cortes.":
    "Виктория Кент, тоже республиканка и тоже депутатка, боялась, что женский голос сыграет на руку правым. Спор между ними — один из самых цитируемых в тех кортесах.",
  "¿Qué convirtió la sublevación de julio de 1936 en una guerra civil?":
    "Что превратило мятеж июля 1936 года в гражданскую войну?",
  "La intervención de Francia": "Вмешательство Франции",
  "Que el golpe triunfó en unas zonas y fracasó en otras":
    "То, что переворот победил в одних областях и провалился в других",
  "La negativa del rey a firmar": "Отказ короля подписать",
  "Una huelga general": "Всеобщая забастовка",
  "El fracaso parcial partió el país en dos y ninguno de los bandos pudo imponerse rápido. Un golpe que triunfa del todo o fracasa del todo no produce tres años de guerra.":
    "Частичный провал разрезал страну надвое, и ни одна сторона не смогла быстро взять верх. Переворот, который побеждает целиком или проваливается целиком, трёх лет войны не даёт.",
  "¿Qué países apoyaron al bando sublevado?": "Какие страны поддержали мятежную сторону?",
  "Francia y el Reino Unido": "Франция и Великобритания",
  "Alemania e Italia": "Германия и Италия",
  "La Unión Soviética": "Советский Союз",
  "Estados Unidos y Portugal": "Соединённые Штаты и Португалия",
  "Alemania e Italia apoyaron a los sublevados y la Unión Soviética a la República, mientras las democracias occidentales se mantenían en la no intervención.":
    "Германия и Италия поддержали мятежников, а Советский Союз — Республику, пока западные демократии держались невмешательства.",
  "¿Qué cuadro pintó Picasso a raíz del bombardeo de 1937?":
    "Какую картину написал Пикассо после бомбардировки 1937 года?",
  "Las Meninas": "«Менины»",
  "El Guernica": "«Гернику»",
  "Los fusilamientos del 3 de mayo": "«Расстрел 3 мая»",
  "El jardín de las delicias": "«Сад земных наслаждений»",
  "El Guernica, hoy en el Museo Reina Sofía de Madrid. Los fusilamientos del 3 de mayo es de Goya y recuerda la represión francesa de 1808.":
    "«Гернику», сегодня она в музее Королевы Софии в Мадриде. «Расстрел 3 мая» — работа Гойи, и он напоминает о французской расправе 1808 года.",
  "¿Cuántos años duró la dictadura de Franco?": "Сколько лет длилась диктатура Франко?",
  "Veintiocho": "Двадцать восемь",
  "Treinta y seis": "Тридцать шесть",
  "Cuarenta y cinco": "Сорок пять",
  "De 1939 a 1975. La Segunda República había durado ocho años, de los cuales solo los tres últimos fueron de guerra.":
    "С 1939 по 1975 год. Вторая республика продержалась восемь лет, из которых войной были только последние три.",
  "¿Cómo se llamó la política económica de los años cuarenta?":
    "Как называлась экономическая политика сороковых годов?",
  "La estabilización": "Стабилизация",
  "La reconversión": "Перестройка производства",
  "Autarquía: aislamiento, cartillas de racionamiento y hambre. Se los conoce como los años del hambre. El desarrollismo llegaría en los sesenta.":
    "Автаркия: замкнутость, карточки и голод. Эти годы так и зовут — годами голода. Десаррольизм, политика развития, придёт в шестидесятые.",
  "¿En qué año ingresó España en la ONU?": "В каком году Испания вошла в ООН?",
  "En 1953": "В 1953 году",
  "En 1955": "В 1955 году",
  "En 1955, tras los acuerdos con Estados Unidos y el concordato con la Santa Sede, ambos de 1953, que rompieron el aislamiento de la posguerra.":
    "В 1955 году, после соглашений с Соединёнными Штатами и конкордата со Святым престолом, оба 1953 года, которые разорвали послевоенную замкнутость.",
  "¿A quién designó Franco como sucesor a título de rey?":
    "Кого Франко назначил преемником в качестве короля?",
  "A Alfonso XIII": "Альфонсо XIII",
  "A Juan de Borbón": "Хуана Бурбона",
  "A Juan Carlos de Borbón": "Хуана Карлоса Бурбона",
  "A Carrero Blanco": "Карреро Бланко",
  "A Juan Carlos, nieto de Alfonso XIII, en 1969, pasando por encima de su padre. Carrero Blanco era el sucesor previsto en la presidencia del Gobierno, no en la jefatura del Estado.":
    "Хуана Карлоса, внука Альфонсо XIII, в 1969 году, перешагнув через его отца. Карреро Бланко был намеченным преемником на посту председателя правительства, а не главы государства.",
  "¿Qué trajeron los años sesenta a la economía española?":
    "Что шестидесятые принесли испанской экономике?",
  "Cartillas de racionamiento": "Карточки",
  "Industria, turismo y las divisas de la emigración a Europa":
    "Промышленность, туризм и валюту от эмиграции в Европу",
  "La nacionalización de la banca": "Национализацию банков",
  "El ingreso en la Comunidad Económica Europea":
    "Вступление в Европейское экономическое сообщество",
  "Es lo que se llamó desarrollismo. Dos millones de españoles trabajaban en Europa y sus envíos, junto al turismo, sostuvieron la balanza de pagos.":
    "Это и назвали десаррольизмом. Два миллиона испанцев работали в Европе, и их переводы вместе с туризмом держали платёжный баланс.",
  "¿Cuándo fue proclamado rey Juan Carlos I?": "Когда Хуана Карлоса I провозгласили королём?",
  "El 20 de noviembre de 1975": "20 ноября 1975 года",
  "El 22 de noviembre de 1975": "22 ноября 1975 года",
  "El 15 de junio de 1977": "15 июня 1977 года",
  "Dos días después de la muerte de Franco, dentro de las reglas del propio régimen. Las primeras elecciones libres llegarían año y medio más tarde.":
    "Через два дня после смерти Франко, по правилам самого режима. Первые свободные выборы придут через полтора года.",
  "¿Qué norma abrió el paso a las elecciones libres?":
    "Какая норма открыла дорогу свободным выборам?",
  "La Ley para la Reforma Política": "Закон о политической реформе",
  "La Ley de Amnistía": "Закон об амнистии",
  "Los Pactos de la Moncloa": "Пакты Монклоа",
  "La Ley Orgánica del Estado": "Органический закон о государстве",
  "Aprobada por las propias Cortes del régimen y ratificada en referéndum en diciembre de 1976. De ahí la fórmula: se fue de la ley a la ley, sin ruptura formal.":
    "Принят самими кортесами режима и утверждён на референдуме в декабре 1976 года. Отсюда и формула: шли от закона к закону, без формального разрыва.",
  "¿Qué partido se legalizó un Sábado Santo de 1977?":
    "Какую партию узаконили в Великую субботу 1977 года?",
  "El PSOE": "PSOE",
  "El Partido Comunista": "Коммунистическую партию",
  "Alianza Popular": "Народный альянс",
  "UCD": "UCD",
  "El PCE, en la decisión más arriesgada del periodo. Se eligió un fin de semana largo precisamente para amortiguar la reacción.":
    "PCE — самое рискованное решение того времени. Длинные выходные выбрали именно для того, чтобы смягчить отклик.",
  "¿En qué fecha se celebraron las primeras elecciones libres desde 1936?":
    "В какой день прошли первые свободные выборы с 1936 года?",
  "El 28 de octubre de 1982": "28 октября 1982 года",
  "El 23 de febrero de 1981": "23 февраля 1981 года",
  "Cuarenta y un años después de las últimas. La Constitución llegaría año y medio más tarde, redactada por las Cortes salidas de esa votación.":
    "Через сорок один год после предыдущих. Конституция придёт через полтора года, написанная кортесами, вышедшими из этого голосования.",
  "¿Qué fueron los Pactos de la Moncloa?": "Чем были Пакты Монклоа?",
  "Un acuerdo entre el rey y los militares": "Соглашением между королём и военными",
  "Un acuerdo económico y social entre gobierno y oposición":
    "Экономическим и общественным соглашением между правительством и оппозицией",
  "El pacto que fijó las autonomías": "Договором, который закрепил автономии",
  "El tratado de adhesión a la CEE": "Договором о вступлении в ЕЭС",
  "Firmados en octubre de 1977 con una inflación superior al veinte por ciento. Permitieron afrontar la crisis mientras se redactaba la Constitución.":
    "Подписаны в октябре 1977 года при инфляции выше двадцати процентов. Они позволили справляться с кризисом, пока писалась Конституция.",
  "¿Qué se asaltó el 23 de febrero de 1981?": "Что захватили 23 февраля 1981 года?",
  "La sede del Gobierno catalán": "Здание каталонского правительства",
  "El Congreso, durante una votación de investidura, con el Gobierno y los diputados dentro. El golpe fracasó esa misma noche.":
    "Конгресс, во время голосования об утверждении председателя правительства, вместе с правительством и депутатами внутри. Переворот провалился в ту же ночь.",
  "¿Qué partido ganó las elecciones de 1982 con mayoría absoluta?":
    "Какая партия выиграла выборы 1982 года с абсолютным большинством?",
  "El PCE": "PCE",
  "El PSOE, con Felipe González, y gobernó hasta 1996. La alternancia demostró que el sistema funcionaba.":
    "PSOE, с Фелипе Гонсалесом, и правила до 1996 года. Смена власти показала, что система работает.",
  "¿Qué se decidió en el referéndum de 1986, además de la entrada en la CEE?":
    "Что решили на референдуме 1986 года, кроме вступления в ЕЭС?",
  "La permanencia en la OTAN": "Оставаться ли в НАТО",
  "La reforma del Senado": "Преобразование Сената",
  "El mapa autonómico": "Карту автономий",
  "La adopción del euro": "Принятие евро",
  "La entrada en la CEE no se sometió a referéndum: fue un tratado. Lo que se votó ese año fue la permanencia en la OTAN, y ganó el sí.":
    "Вступление в ЕЭС на референдум не выносили: это был договор. В тот год голосовали о том, оставаться ли в НАТО, и победило «да».",
  "¿Qué tres acontecimientos coincidieron en España en 1992?":
    "Какие три события сошлись в Испании в 1992 году?",
  "Los Juegos de Barcelona, la Expo de Sevilla y el primer AVE":
    "Игры в Барселоне, выставка в Севилье и первый скоростной поезд AVE",
  "La entrada en la CEE, el euro y la OTAN": "Вступление в ЕЭС, евро и НАТО",
  "La Constitución, el 23-F y las autonomías": "Конституция, 23 февраля и автономии",
  "El Mundial de fútbol, la Expo y la peseta": "Чемпионат мира по футболу, выставка и песета",
  "Doce meses en los que el país se enseñó al mundo. El Mundial de fútbol se había celebrado diez años antes, en 1982.":
    "Двенадцать месяцев, за которые страна показала себя миру. Чемпионат мира по футболу прошёл десятью годами раньше, в 1982-м.",
  "¿Qué moneda sustituyó el euro en 2002?": "Какую валюту евро сменило в 2002 году?",
  "El real": "Реал",
  "La peseta": "Песету",
  "El duro": "Дуро",
  "La peseta, que había circulado desde 1868. El duro era el nombre coloquial de la moneda de cinco pesetas, no una moneda distinta.":
    "Песету, которая ходила с 1868 года. Дуро — это разговорное имя монеты в пять песет, а не отдельная валюта.",
  "¿Qué ocurrió el 11 de marzo de 2004?": "Что произошло 11 марта 2004 года?",
  "El intento de golpe de Estado": "Попытка государственного переворота",
  "Los atentados en trenes de cercanías de Madrid": "Теракты в пригородных поездах Мадрида",
  "La abdicación de Juan Carlos I": "Отречение Хуана Карлоса I",
  "La entrada en el euro": "Вступление в евро",
  "Ciento noventa y tres muertos: el mayor atentado de la historia de España. El 23-F fue en 1981 y la abdicación en 2014.":
    "Сто девяносто три погибших: крупнейший теракт в истории Испании. 23 февраля было в 1981 году, а отречение — в 2014-м.",
  "¿En qué año anunció ETA su disolución?": "В каком году ETA объявила о самороспуске?",
  "Anunció el fin de su actividad armada en 2011 y su disolución en 2018. Había causado más de ochocientas muertes desde los años sesenta.":
    "Она объявила о конце вооружённой деятельности в 2011 году, а о роспуске — в 2018-м. С шестидесятых годов она стала причиной больше восьмисот смертей.",
  "¿Por qué se dice que la Transición fue una reforma y no una ruptura?":
    "Почему говорят, что переход был реформой, а не разрывом?",
  "Porque la dirigió el ejército": "Потому что им руководила армия",
  "Porque las instituciones del régimen aprobaron su propia disolución":
    "Потому что учреждения режима сами приняли решение о собственном роспуске",
  "Porque no hubo elecciones": "Потому что выборов не было",
  "Porque la Constitución se copió de otro país": "Потому что Конституцию списали с другой страны",
  "Las Cortes franquistas votaron la ley que las disolvía, y de ahí la fórmula de ir de la ley a la ley. Esa elección explica tanto la estabilidad posterior como los debates que siguen abiertos.":
    "Франкистские кортесы проголосовали за закон, который их распускал, — отсюда и формула о переходе от закона к закону. Этот выбор объясняет и позднейшую устойчивость, и споры, которые остаются открытыми.",
  "¿Cuántas ciudades autónomas hay en España?": "Сколько в Испании автономных городов?",
  "Ceuta y Melilla, ambas desde 1995. No son comunidades autónomas, sino una categoría propia con estatuto y competencias más limitadas.":
    "Сеута и Мелилья, обе с 1995 года. Это не автономные сообщества, а особая ступень со своим статутом и более узкими полномочиями.",
  "¿Qué título de la Constitución regula la organización territorial?":
    "Какой раздел Конституции регулирует территориальное устройство?",
  "El título VIII, que no enumera comunidades sino que establece cómo pueden constituirse. El mapa autonómico se hizo después, siguiendo ese procedimiento.":
    "Раздел VIII, который не перечисляет сообщества, а устанавливает, как они могут возникнуть. Карту автономий составили потом, по этой самой процедуре.",
  "¿Qué comunidades accedieron a la autonomía por la vía rápida del artículo 151?":
    "Какие сообщества получили автономию быстрым путём статьи 151?",
  "Cataluña, País Vasco, Galicia y Andalucía": "Каталония, Страна Басков, Галисия и Андалусия",
  "Madrid, Cataluña y el País Vasco": "Мадрид, Каталония и Страна Басков",
  "Todas las que tienen lengua propia": "Все, у кого есть свой язык",
  "Las siete uniprovinciales": "Семь однопровинциальных",
  "Las tres con estatuto plebiscitado durante la República, más Andalucía, que lo consiguió tras un referéndum en 1980. Las demás siguieron la vía más lenta del artículo 143.":
    "Три, чей статут был утверждён плебисцитом при Республике, плюс Андалусия, которая добилась своего после референдума 1980 года. Остальные пошли более медленным путём статьи 143.",
  "¿Con qué tipo de norma se aprueba un Estatuto de Autonomía?":
    "Каким видом нормы принимают Статут автономии?",
  "Con un decreto del Gobierno": "Декретом правительства",
  "Con una ley orgánica": "Органическим законом",
  "Con una ley ordinaria": "Обычным законом",
  "Con un reglamento autonómico": "Регламентом автономии",
  "Ley orgánica de las Cortes Generales. Por eso su reforma exige el acuerdo de la comunidad y del Estado: pertenece a los dos ordenamientos a la vez.":
    "Органическим законом Генеральных кортесов. Поэтому его изменение требует согласия и сообщества, и государства: он принадлежит сразу двум правопорядкам.",
  "¿Cuántas provincias tiene España?": "Сколько в Испании провинций?",
  "Treinta y ocho": "Тридцать восемь",
  "Ochenta y una": "Восемьдесят одна",
  "Cincuenta provincias, agrupadas en diecisiete comunidades. Siete comunidades son uniprovinciales, como Madrid, Murcia o Asturias.":
    "Пятьдесят провинций, собранных в семнадцать сообществ. Семь сообществ однопровинциальные — Мадрид, Мурсия, Астурия.",
  "¿Qué ocurre en una comunidad uniprovincial?": "Что происходит в однопровинциальном сообществе?",
  "Tiene dos parlamentos": "У него два парламента",
  "La comunidad absorbe las funciones de la diputación provincial":
    "Сообщество вбирает в себя задачи провинциального собрания",
  "No tiene estatuto propio": "У него нет своего статута",
  "Depende directamente del Gobierno central": "Оно подчиняется прямо центральному правительству",
  "Al coincidir el territorio, no tiene sentido mantener dos administraciones. Madrid, Murcia, Asturias, Cantabria, La Rioja, Navarra y las Baleares están en ese caso.":
    "Раз территория совпадает, держать две администрации незачем. В таком положении Мадрид, Мурсия, Астурия, Кантабрия, Ла-Риоха, Наварра и Балеары.",
  "¿Qué artículo enumera las competencias exclusivas del Estado?":
    "Какая статья перечисляет исключительные полномочия государства?",
  "El artículo 143": "Статья 143",
  "El artículo 148": "Статья 148",
  "El artículo 149": "Статья 149",
  "El artículo 155": "Статья 155",
  "El 149 lista lo que es exclusivo del Estado y el 148 lo que las comunidades pueden asumir. El 143 es una de las vías de acceso a la autonomía y el 155 el mecanismo de última instancia.":
    "Сто сорок девятая перечисляет то, что принадлежит только государству, а сто сорок восьмая — то, что могут взять сообщества. Сто сорок третья — один из путей к автономии, а сто пятьдесят пятая — средство последней надежды.",
  "¿Cuál de estas materias es competencia exclusiva del Estado?":
    "Какой из этих предметов в исключительном ведении государства?",
  "El turismo": "Туризм",
  "El urbanismo": "Градостроительство",
  "La administración de justicia": "Отправление правосудия",
  "La agricultura": "Сельское хозяйство",
  "Justicia, defensa, relaciones internacionales y moneda están entre las exclusivas. Turismo, urbanismo y agricultura son de las que las comunidades pueden asumir.":
    "Правосудие, оборона, международные отношения и деньги — среди исключительных. Туризм, градостроительство и сельское хозяйство — из тех, что могут взять сообщества.",
  "¿Cómo se llama el sistema de financiación del País Vasco?":
    "Как называется система финансирования Страны Басков?",
  "El convenio": "Конвенио",
  "El concierto": "Консьерто",
  "El cupo común": "Общая квота",
  "El fondo foral": "Фуэральный фонд",
  "El concierto económico vasco; el navarro se llama convenio. Ambos permiten recaudar los propios impuestos y pagar al Estado una cantidad por los servicios comunes.":
    "Баскский экономический concierto; наваррский зовётся convenio. Оба позволяют собирать собственные налоги и платить государству сумму за общие услуги.",
  "¿Qué mecanismo prevé el artículo 155?": "Какое средство предусматривает статья 155?",
  "La disolución de un parlamento autonómico por el rey": "Роспуск парламента автономии королём",
  "Medidas del Gobierno, aprobadas por el Senado, si una comunidad incumple gravemente":
    "Меры правительства, одобренные Сенатом, если сообщество тяжко нарушает обязанности",
  "La creación de nuevas comunidades": "Создание новых сообществ",
  "El reparto anual de los fondos europeos": "Ежегодный делёж европейских фондов",
  "Requiere un requerimiento previo y la aprobación del Senado por mayoría absoluta. Se aplicó por primera vez en 2017, casi cuarenta años después de escribirse.":
    "Она требует предварительного требования и одобрения Сената абсолютным большинством. Впервые её применили в 2017 году, почти через сорок лет после того, как её написали.",
  "¿Quién representa a la Administración del Estado en cada comunidad autónoma?":
    "Кто представляет государственную администрацию в каждом автономном сообществе?",
  "El presidente autonómico": "Председатель автономии",
  "El alcalde de la capital": "Мэр столицы",
  "El presidente del Tribunal Superior de Justicia": "Председатель Высшего суда правосудия",
  "El delegado del Gobierno, nombrado por el Gobierno central, con subdelegados en cada provincia. No es un cargo autonómico.":
    "Уполномоченный правительства, назначенный центральным правительством, с заместителями в каждой провинции. Это не должность автономии.",
  "¿Para qué sirve el Fondo de Compensación Interterritorial?":
    "Для чего нужен Межтерриториальный компенсационный фонд?",
  "Para financiar las lenguas cooficiales": "Чтобы финансировать вторые официальные языки",
  "Para corregir desequilibrios económicos entre territorios":
    "Чтобы выправлять хозяйственные перекосы между территориями",
  "Para pagar la deuda de las comunidades": "Чтобы платить долги сообществ",
  "Para repartir los fondos europeos": "Чтобы делить европейские фонды",
  "La Constitución garantiza la solidaridad entre territorios y prohíbe que las diferencias entre estatutos supongan privilegios económicos o sociales. Este fondo es el instrumento.":
    "Конституция гарантирует солидарность между территориями и запрещает, чтобы различия между статутами оборачивались хозяйственными или общественными привилегиями. Этот фонд — её орудие.",
  "¿Cómo se llama el parlamento de una comunidad autónoma?":
    "Как называется парламент автономного сообщества?",
  "Cortes Generales": "Генеральные кортесы",
  "Diputación": "Депутация",
  "Asamblea legislativa, con nombres propios en cada comunidad: Parlament, Cortes, Junta General, Asamblea. El Consejo de Gobierno es el ejecutivo, no el legislativo.":
    "Законодательное собрание, со своим именем в каждом сообществе: Parlament, кортесы, Junta General, Asamblea. Правительственный совет — это исполнительная власть, а не законодательная.",
  "¿Qué extensión aproximada tiene España?": "Какова примерная площадь Испании?",
  "300.000 km²": "300 000 км²",
  "400.000 km²": "400 000 км²",
  "505.000 km²": "505 000 км²",
  "700.000 km²": "700 000 км²",
  "Unos 505.000 kilómetros cuadrados, lo que la convierte en el segundo país más extenso de la Unión Europea, tras Francia.":
    "Около 505 000 квадратных километров, что делает её второй по площади страной Европейского союза после Франции.",
  "¿Qué país europeo es más montañoso que España?":
    "Какая европейская страна более гориста, чем Испания?",
  "Austria": "Австрия",
  "Suiza": "Швейцария",
  "Italia": "Италия",
  "Noruega": "Норвегия",
  "Solo Suiza tiene una altitud media mayor. La Meseta Central está por encima de los seiscientos metros, y eso explica los inviernos duros del interior pese a la latitud.":
    "Только у Швейцарии средняя высота больше. Центральное плоскогорье лежит выше шестисот метров, и этим объясняются суровые зимы во внутренних областях, несмотря на широту.",
  "¿Qué cordillera separa España de Francia?": "Какая горная цепь отделяет Испанию от Франции?",
  "El Sistema Ibérico": "Иберийская система",
  "Sierra Morena": "Сьерра-Морена",
  "Los Pirineos, de mar a mar, con Andorra encajada entre ambos países. La Cantábrica cierra el norte peninsular pero no es frontera.":
    "Пиренеи, от моря до моря, с Андоррой, зажатой между двумя странами. Кантабрийские горы закрывают север полуострова, но границей не служат.",
  "¿Cuál es el pico más alto de la Península?": "Какая вершина самая высокая на полуострове?",
  "El Moncayo": "Монкайо",
  "El Mulhacén, en Sierra Nevada, con 3.479 metros. El Teide es más alto pero está en Tenerife, y el Aneto es el techo de los Pirineos.":
    "Мулясен, в Сьерра-Неваде, 3479 метров. Тейде выше, но он на Тенерифе, а Ането — крыша Пиренеев.",
  "¿Cuál es el río de mayor caudal de España?": "У какой реки Испании самый большой сток?",
  "El Ebro, y es además el gran río de la vertiente mediterránea, la más seca. El Tajo es el más largo y el Guadalquivir el único navegable.":
    "У Эбро, и она же большая река средиземноморского склона, самого сухого. Тахо самая длинная, а Гвадалквивир единственная судоходная.",
  "¿Qué río español es navegable hasta una ciudad del interior?":
    "Какая испанская река судоходна до города во внутренней части страны?",
  "El Guadalquivir, hasta Sevilla": "Гвадалквивир, до Севильи",
  "El Ebro, hasta Zaragoza": "Эбро, до Сарагосы",
  "El Duero, hasta Valladolid": "Дуэро, до Вальядолида",
  "El Tajo, hasta Toledo": "Тахо, до Толедо",
  "Sevilla es el único puerto fluvial de España, a ochenta kilómetros de la desembocadura. Fue lo que la convirtió en la puerta del comercio americano.":
    "Севилья — единственный речной порт Испании, в восьмидесяти километрах от устья. Именно это сделало её воротами американской торговли.",
  "¿Cuáles son las tres vertientes hidrográficas españolas?":
    "Каковы три испанских водосборных склона?",
  "Cantábrica, atlántica y mediterránea": "Кантабрийский, атлантический и средиземноморский",
  "Norte, centro y sur": "Северный, центральный и южный",
  "Atlántica, africana y balear": "Атлантический, африканский и балеарский",
  "Pirenaica, ibérica y bética": "Пиренейский, иберийский и бетийский",
  "La cantábrica tiene ríos cortos y caudalosos, la atlántica los grandes ríos peninsulares y la mediterránea es la más seca salvo por el Ebro.":
    "У кантабрийского реки короткие и полноводные, у атлантического — большие реки полуострова, а средиземноморский самый сухой, если не считать Эбро.",
  "¿En qué océano están las Islas Canarias?": "В каком океане лежат Канарские острова?",
  "En el Mediterráneo": "В Средиземном море",
  "En el Atlántico": "В Атлантическом",
  "En el Cantábrico": "В Кантабрийском море",
  "En el mar de Alborán": "В море Альборан",
  "En el Atlántico, frente a la costa africana y a unos mil quinientos kilómetros de la Península. Las Baleares son las mediterráneas.":
    "В Атлантическом, напротив африканского берега, примерно в полутора тысячах километров от полуострова. Средиземноморские — это Балеары.",
  "¿Qué particularidad horaria tienen las Canarias?":
    "Какая особенность со временем у Канарских островов?",
  "Tienen una hora menos que la Península": "У них на час меньше, чем на полуострове",
  "Tienen una hora más": "У них на час больше",
  "No cambian la hora en verano": "Они не переводят часы летом",
  "Ninguna: comparten horario con el resto del país":
    "Никакой: у них то же время, что и у всей страны",
  "Una hora menos, y es la única parte de España en otro huso. Los avisos horarios de la televisión española lo recuerdan a diario.":
    "На час меньше, и это единственная часть Испании в другом часовом поясе. Объявления времени на испанском телевидении напоминают об этом каждый день.",
  "¿Cuál es el origen geológico de las Canarias?":
    "Каково геологическое происхождение Канарских островов?",
  "Sedimentario": "Осадочное",
  "Volcánico": "Вулканическое",
  "Coralino": "Коралловое",
  "Glaciar": "Ледниковое",
  "Volcánico, y el volcanismo sigue activo: la erupción de La Palma en 2021 lo recordó. El Teide es el mayor de esos edificios volcánicos.":
    "Вулканическое, и вулканизм остаётся живым: извержение на Ла-Пальме в 2021 году об этом напомнило. Тейде — крупнейшая из этих вулканических построек.",
  "¿Con qué países y territorios limita España?":
    "С какими странами и территориями граничит Испания?",
  "Portugal, Francia, Andorra, Gibraltar y Marruecos":
    "Португалия, Франция, Андорра, Гибралтар и Марокко",
  "Portugal y Francia solamente": "Только Португалия и Франция",
  "Portugal, Francia e Italia": "Португалия, Франция и Италия",
  "Portugal, Francia, Andorra e Italia": "Португалия, Франция, Андорра и Италия",
  "Con Marruecos por Ceuta y Melilla, y con el territorio británico de Gibraltar en el sur peninsular. Italia no comparte frontera terrestre con España.":
    "С Марокко — через Сеуту и Мелилью, и с британской территорией Гибралтар на юге полуострова. Сухопутной границы с Испанией у Италии нет.",
  "¿Qué tienen de singular Ceuta y Melilla en el conjunto de la Unión Europea?":
    "Чем Сеута и Мелилья особенны в Европейском союзе?",
  "Son las únicas ciudades sin ayuntamiento":
    "Это единственные города без муниципального управления",
  "Son las únicas fronteras terrestres de la Unión con África":
    "Это единственные сухопутные границы Союза с Африкой",
  "Son las únicas exentas de impuestos": "Это единственные, освобождённые от налогов",
  "Son las únicas fuera del espacio Schengen": "Это единственные вне Шенгенского пространства",
  "Están en el norte de África y, por tanto, la Unión Europea tiene ahí su única frontera terrestre con el continente africano.":
    "Они на севере Африки, и потому именно там у Европейского союза единственная сухопутная граница с африканским материком.",
  "¿Cómo se conoce a la franja húmeda del norte peninsular?":
    "Как называют влажную полосу на севере полуострова?",
  "La España seca": "Сухая Испания",
  "La España verde": "Зелёная Испания",
  "La España vaciada": "Опустевшая Испания",
  "La cornisa mediterránea": "Средиземноморский карниз",
  "La España verde, de clima oceánico, con lluvias repartidas todo el año. La España vaciada designa en cambio el interior despoblado, que es otra cosa.":
    "Зелёная Испания, с океаническим климатом и дождями, разложенными по всему году. А «опустевшая Испания» обозначает обезлюдевшую внутреннюю часть, и это другое.",
  "¿Cuántos apartados tiene el artículo 3 de la Constitución?":
    "Сколько пунктов в статье 3 Конституции?",
  "Tres: el castellano como lengua oficial del Estado, la cooficialidad de las demás según los estatutos, y la protección de las modalidades lingüísticas como patrimonio.":
    "Три: кастильский как официальный язык государства, вторая официальность остальных по статутам и охрана языковых разновидностей как наследия.",
  "¿En qué comunidades es oficial el catalán?": "В каких сообществах официален каталанский?",
  "Solo en Cataluña": "Только в Каталонии",
  "En Cataluña y las Illes Balears, y en la Comunidad Valenciana con la denominación de valenciano":
    "В Каталонии и на Балеарских островах, а в Валенсийском сообществе — под именем валенсийского",
  "En Cataluña y Aragón": "В Каталонии и Арагоне",
  "En toda la costa mediterránea": "По всему средиземноморскому побережью",
  "Tres comunidades, con la particularidad de la denominación que fija el estatuto valenciano. En Aragón hay hablantes en la franja oriental, pero sin oficialidad.":
    "Три сообщества, с особенностью в названии, которую задаёт валенсийский статут. В Арагоне говорящие есть в восточной полосе, но официальности нет.",
  "¿Con qué lengua comparte origen el gallego?":
    "С каким языком у галисийского общее происхождение?",
  "Con el castellano": "С кастильским",
  "Con el portugués": "С португальским",
  "Con el catalán": "С каталанским",
  "Con el asturiano": "С астурийским",
  "Ambos proceden del galaicoportugués medieval, y de ahí su proximidad. Todas las demás lenguas romances peninsulares vienen también del latín, pero por ramas distintas.":
    "Оба происходят из средневекового галисийско-португальского, отсюда и их близость. Все прочие романские языки полуострова тоже идут от латыни, но по другим ветвям.",
  "¿En qué territorios es oficial el euskera?": "На каких землях официален баскский?",
  "En el País Vasco y en la zona vascófona de Navarra":
    "В Стране Басков и в баскоязычной части Наварры",
  "Solo en el País Vasco": "Только в Стране Басков",
  "En el País Vasco, Navarra y La Rioja": "В Стране Басков, Наварре и Ла-Риохе",
  "En todo el norte peninsular": "По всему северу полуострова",
  "En Navarra el régimen lingüístico varía por comarcas, con una zona vascófona, una mixta y una no vascófona. En el País Vasco es oficial en toda la comunidad.":
    "В Наварре языковой порядок меняется по районам: есть баскоязычная зона, смешанная и небаскоязычная. В Стране Басков он официален во всём сообществе.",
  "¿Qué es el euskera batua?": "Что такое euskera batua?",
  "Un dialecto del euskera hablado en Vizcaya": "Наречие баскского, на котором говорят в Бискайе",
  "El estándar escrito unificado, fijado desde los años sesenta":
    "Единый письменный стандарт, установленный с шестидесятых годов",
  "El nombre vasco de la Constitución": "Баскское название Конституции",
  "Un método de enseñanza para adultos": "Метод обучения взрослых",
  "Batua significa unificado. Antes de él el euskera tenía dialectos históricos sin una norma común escrita; el batua es lo que se enseña hoy en la escuela.":
    "Batua значит «единый». До него у баскского были исторические наречия без общей письменной нормы; batua — это то, чему сегодня учат в школе.",
  "¿De qué lengua es una variedad el aranés?": "Разновидностью какого языка является аранский?",
  "Del catalán": "Каталанского",
  "Del occitano": "Окситанского",
  "Del francés": "Французского",
  "Del aragonés": "Арагонского",
  "Del occitano, la lengua del sur de Francia. Es oficial en toda Cataluña desde 2006 y propia del Valle de Arán.":
    "Окситанского, языка юга Франции. Он официален во всей Каталонии с 2006 года и родной для долины Аран.",
  "¿Qué protege el tercer apartado del artículo 3?": "Что защищает третий пункт статьи 3?",
  "Las lenguas cooficiales": "Вторые официальные языки",
  "Las modalidades lingüísticas de España como patrimonio cultural":
    "Языковые разновидности Испании как культурное наследие",
  "El derecho a estudiar en la lengua materna": "Право учиться на родном языке",
  "El uso del castellano en la Administración": "Использование кастильского в администрации",
  "Es el apartado que ampara hablas sin cooficialidad como el asturiano, el aragonés, el leonés o la fala extremeña, con grados de reconocimiento que fijan las leyes autonómicas.":
    "Это пункт, который прикрывает говоры без второй официальности — астурийский, арагонский, леонский или эстремадурский fala, — со степенями признания, которые задают законы автономий.",
  "¿Cuál de estas hablas NO es cooficial en ninguna comunidad?":
    "Какой из этих говоров НЕ является вторым официальным ни в одном сообществе?",
  "El asturiano": "Астурийский",
  "El asturiano, llamado también bable, está protegido por su estatuto pero no es lengua oficial. Las otras tres sí lo son en sus territorios.":
    "Астурийский, который зовут ещё bable, защищён своим статутом, но официальным языком не является. Остальные три на своих землях официальны.",
  "¿Cuántas personas hablan español en el mundo, aproximadamente?":
    "Сколько примерно людей в мире говорит по-испански?",
  "Cien millones": "Сто миллионов",
  "Trescientos millones": "Триста миллионов",
  "Seiscientos millones": "Шестьсот миллионов",
  "Mil millones": "Миллиард",
  "Alrededor de seiscientos millones, lo que la sitúa como segunda lengua materna del mundo tras el chino mandarín. La mayoría de sus hablantes no vive en España.":
    "Около шестисот миллионов, что ставит его на второе место в мире по числу носителей после китайского. Большинство говорящих на нём живёт не в Испании.",
  "¿Qué país tiene más hispanohablantes?": "В какой стране больше всего говорящих по-испански?",
  "España": "Испания",
  "Argentina": "Аргентина",
  "Colombia": "Колумбия",
  "México": "Мексика",
  "México, con mucha diferencia. Es la razón de que la norma del español no se decida solo en Madrid, sino en común con las academias americanas.":
    "Мексика, с большим отрывом. Поэтому норму испанского решают не только в Мадриде, а сообща с американскими академиями.",
  "¿Cómo se llama la asociación que reúne a la RAE con las academias americanas?":
    "Как называется объединение, которое сводит RAE с американскими академиями?",
  "La Asociación de Academias de la Lengua Española": "Ассоциация академий испанского языка",
  "La Organización de Estados Iberoamericanos": "Организация иберо-американских государств",
  "El Instituto Cervantes": "Институт Сервантеса",
  "La Unión Panhispánica": "Паниспанский союз",
  "Con ella se publican en común diccionarios y gramáticas, en lo que se llama política panhispánica. El Instituto Cervantes se ocupa en cambio de difundir la lengua fuera.":
    "С ней сообща издают словари и грамматики — это называют паниспанской политикой. А Институт Сервантеса занимается распространением языка за границей.",
  "¿Qué organismo administra las pruebas de lengua para la nacionalidad?":
    "Какое учреждение проводит языковые экзамены для гражданства?",
  "La Real Academia Española": "Королевская испанская академия",
  "La Escuela Oficial de Idiomas": "Официальная школа языков",
  "El Instituto Cervantes administra tanto el DELE como la prueba CCSE. El Ministerio de Justicia resuelve el expediente de nacionalidad, que es otra fase.":
    "Институт Сервантеса проводит и DELE, и экзамен CCSE. Министерство юстиции решает по делу о гражданстве, а это другая ступень.",
  "¿Por qué la Constitución emplea la palabra castellano y no español?":
    "Почему Конституция говорит «кастильский», а не «испанский»?",
  "Porque español es un término americano": "Потому что «испанский» — американское слово",
  "Porque las demás lenguas de España también son españolas":
    "Потому что остальные языки Испании тоже испанские",
  "Porque castellano es más antiguo": "Потому что «кастильский» старше",
  "Por un error de redacción nunca corregido": "Из-за никогда не исправленной ошибки в тексте",
  "Llamar español solo a una de ellas dejaría fuera al catalán, al gallego y al euskera, que son igualmente lenguas de España. Fuera del país predomina el término español.":
    "Назвать испанским только один из них значило бы оставить за бортом каталанский, галисийский и баскский, которые точно так же языки Испании. За пределами страны чаще говорят «испанский».",
  "¿Cuál es el sector económico más importante de España?":
    "Какая отрасль хозяйства в Испании самая важная?",
  "La industria": "Промышленность",
  "Los servicios": "Услуги",
  "La minería": "Горная добыча",
  "Los servicios, y dentro de ellos el turismo, que sitúa a España año tras año entre los primeros destinos del mundo por número de visitantes.":
    "Услуги, а внутри них туризм, который год за годом ставит Испанию в первый ряд направлений мира по числу приезжих.",
  "¿Qué provincia abastece de hortalizas a buena parte de Europa en invierno?":
    "Какая провинция снабжает овощами добрую часть Европы зимой?",
  "Almería": "Альмерия",
  "Valencia": "Валенсия",
  "Murcia": "Мурсия",
  "Huelva": "Уэльва",
  "El mar de invernaderos de Almería, en la zona más árida de Europa continental, produce fuera de temporada gracias al clima y a la tecnología de riego.":
    "Море теплиц в Альмерии, в самой засушливой части материковой Европы, даёт урожай вне сезона благодаря климату и поливной технике.",
  "¿Qué particularidad tiene la industria automovilística española?":
    "Какая особенность у испанского автомобилестроения?",
  "Es la mayor de Europa": "Оно самое большое в Европе",
  "Fabrica mucho pero sin marcas propias: las plantas son de grupos extranjeros":
    "Оно много делает, но без своих марок: заводы принадлежат иностранным группам",
  "Se concentra en una sola región": "Оно сосредоточено в одной области",
  "Produce solo vehículos eléctricos": "Оно делает только электромобили",
  "España está entre los mayores fabricantes europeos, con plantas repartidas por varias comunidades, pero las marcas pertenecen a grupos con sede fuera del país.":
    "Испания среди крупнейших европейских производителей, с заводами по нескольким сообществам, но марки принадлежат группам со штаб-квартирами за границей.",
  "¿Qué energías renovables tienen más peso en España?":
    "Какие возобновляемые источники весят в Испании больше всего?",
  "La geotérmica y la mareomotriz": "Геотермальный и приливный",
  "La eólica y la solar": "Ветровой и солнечный",
  "La biomasa y el carbón": "Биомасса и уголь",
  "La nuclear y la hidráulica": "Атомный и гидравлический",
  "El viento del interior y las horas de sol favorecen a ambas. La nuclear no es renovable, aunque también aporta a la generación.":
    "Ветер внутренних областей и солнечные часы благоприятны обоим. Атомная энергия не возобновляема, хотя тоже вносит свою долю в выработку.",
  "¿Cuál es el problema económico más persistente de España?":
    "Какая хозяйственная беда в Испании самая упорная?",
  "La inflación": "Инфляция",
  "El paro": "Безработица",
  "La deuda externa privada": "Частный внешний долг",
  "La escasez de energía": "Нехватка энергии",
  "La tasa de desempleo lleva décadas por encima de la media europea, con dos rasgos añadidos: el paro juvenil y la elevada temporalidad de los contratos.":
    "Уровень безработицы десятилетиями держится выше европейского среднего, и к этому добавляются две черты: молодёжная безработица и высокая доля срочных договоров.",
  "¿Qué es la temporalidad en el mercado laboral?": "Что такое срочность на рынке труда?",
  "El trabajo estacional en la agricultura": "Сезонная работа в сельском хозяйстве",
  "La proporción de contratos de duración limitada": "Доля договоров с ограниченным сроком",
  "El número de horas extraordinarias": "Число сверхурочных часов",
  "La rotación entre sectores": "Переход работников между отраслями",
  "Es la parte del empleo que no es indefinida, y en España ha sido históricamente alta en comparación europea. Afecta sobre todo a los trabajadores jóvenes.":
    "Это та часть занятости, которая не бессрочна, и в Испании она исторически высока по европейским меркам. Задевает она прежде всего молодых работников.",
  "¿Qué caracteriza la demografía española actual?": "Что отличает нынешнюю испанскую демографию?",
  "Natalidad muy baja y esperanza de vida muy alta":
    "Очень низкая рождаемость и очень высокая продолжительность жизни",
  "Natalidad alta y población joven": "Высокая рождаемость и молодое население",
  "Población estable desde 1980": "Устойчивое население с 1980 года",
  "Emigración masiva y despoblación general": "Массовая эмиграция и общее обезлюдение",
  "La combinación de las dos cosas es lo que tensiona el sistema de pensiones a largo plazo. La esperanza de vida española está entre las mayores del mundo.":
    "Сочетание этих двух вещей и напрягает пенсионную систему в долгую. Испанская продолжительность жизни — из самых высоких в мире.",
  "¿Qué financiaron en España los fondos estructurales y de cohesión europeos?":
    "Что европейские структурные фонды и фонды сплочения финансировали в Испании?",
  "Las pensiones": "Пенсии",
  "Carreteras, depuradoras, universidades y trenes":
    "Дороги, очистные сооружения, университеты и поезда",
  "La deuda pública": "Государственный долг",
  "Las nóminas de los funcionarios": "Зарплаты чиновников",
  "Transformaron las infraestructuras del país en poco más de una década tras la entrada en 1986. Es el efecto más visible de la integración europea.":
    "Они преобразили инфраструктуру страны чуть больше чем за десятилетие после вступления в 1986 году. Это самое видимое действие европейской интеграции.",
  "¿Cuántos años de residencia necesitan los nacionales iberoamericanos para pedir la nacionalidad?":
    "Сколько лет проживания нужно гражданам иберо-американских стран, чтобы просить гражданство?",
  "Dos, frente a los diez del plazo general. El vínculo con América no es solo lingüístico: está también escrito en el Código Civil.":
    "Два, против десяти по общему сроку. Связь с Америкой не только языковая: она вписана и в Гражданский кодекс.",
  "¿Qué reúnen periódicamente las Cumbres Iberoamericanas?":
    "Кого периодически собирают Иберо-американские саммиты?",
  "A los jefes de Estado y de Gobierno de los países iberoamericanos":
    "Глав государств и правительств иберо-американских стран",
  "A los rectores de las universidades": "Ректоров университетов",
  "A los ministros de Economía de la Unión Europea": "Министров экономики Европейского союза",
  "A las academias de la lengua": "Языковые академии",
  "Son el marco institucional del vínculo con América Latina, junto con organismos comunes en educación y cultura.":
    "Это учрежденческая рамка связи с Латинской Америкой, вместе с общими органами в образовании и культуре.",
  "¿Junto a qué país entró España en la Comunidad Económica Europea?":
    "Вместе с какой страной Испания вошла в Европейское экономическое сообщество?",
  "Junto a Grecia": "Вместе с Грецией",
  "Junto a Portugal": "Вместе с Португалией",
  "Junto a Irlanda": "Вместе с Ирландией",
  "Sola": "Одна",
  "Con Portugal, el 1 de enero de 1986. Grecia había entrado cinco años antes, en 1981.":
    "С Португалией, 1 января 1986 года. Греция вошла пятью годами раньше, в 1981-м.",
  "¿De dónde proceden principalmente los residentes extranjeros en España?":
    "Откуда в основном приезжают иностранцы, живущие в Испании?",
  "De América Latina, Europa del Este, Marruecos y la propia Unión Europea":
    "Из Латинской Америки, Восточной Европы, Марокко и самого Европейского союза",
  "Solo de la Unión Europea": "Только из Европейского союза",
  "Sobre todo de Asia oriental": "Прежде всего из восточной Азии",
  "Principalmente de América del Norte": "Главным образом из Северной Америки",
  "El país del que salieron millones de emigrantes en el siglo XX cuenta hoy con varios millones de residentes extranjeros, y esos cuatro orígenes son los mayores.":
    "В стране, из которой в XX веке уехали миллионы, сегодня живёт несколько миллионов иностранцев, и эти четыре источника самые крупные.",
  "¿Desde cuándo forma España parte del espacio Schengen?":
    "С какого времени Испания входит в Шенгенское пространство?",
  "Desde su entrada en la CEE en 1986": "С вступления в ЕЭС в 1986 году",
  "Desde los años noventa": "С девяностых годов",
  "Desde la adopción del euro": "С принятия евро",
  "No forma parte de Schengen": "Она в Шенген не входит",
  "La adhesión al acuerdo se firmó en 1991 y su aplicación llegó en 1995. Entrar en la Comunidad y entrar en Schengen fueron dos pasos distintos y separados por años.":
    "Присоединение к соглашению подписали в 1991 году, а применять его начали в 1995-м. Войти в Сообщество и войти в Шенген были два разных шага, разделённых годами.",
  "¿Qué norma desarrolla los derechos laborales básicos en España?":
    "Какая норма развивает основные трудовые права в Испании?",
  "El Código Civil": "Гражданский кодекс",
  "El Estatuto de los Trabajadores": "Статут трудящихся",
  "La Ley de Bases": "Основной закон",
  "El Reglamento de Empleo": "Регламент о занятости",
  "El Estatuto de los Trabajadores. Por debajo de él están los convenios colectivos, que pueden mejorar sus mínimos pero nunca empeorarlos.":
    "Статут трудящихся. Ниже него стоят коллективные договоры, которые могут улучшить его минимумы, но никогда не ухудшить.",
  "¿Qué artículo de la Constitución garantiza el derecho de huelga?":
    "Какая статья Конституции гарантирует право на забастовку?",
  "El artículo 28": "Статья 28",
  "El artículo 37": "Статья 37",
  "El artículo 41": "Статья 41",
  "El 28, junto con la libertad sindical. El 35 recoge el derecho y deber de trabajar, el 37 la negociación colectiva y el 41 la Seguridad Social.":
    "Двадцать восьмая, вместе со свободой профсоюзов. Тридцать пятая закрепляет право и обязанность трудиться, тридцать седьмая — коллективные переговоры, а сорок первая — Seguridad Social.",
  "¿Qué significan las siglas SMI?": "Что означает сокращение SMI?",
  "Sistema Mínimo de Ingresos": "Минимальная система доходов",
  "Salario mínimo interprofesional": "Межотраслевая минимальная зарплата",
  "Seguro Mutuo Industrial": "Промышленное взаимное страхование",
  "Subsidio por Movilidad Interior": "Пособие за внутреннюю мобильность",
  "El suelo salarial para la jornada completa, que el Gobierno actualiza cada año por real decreto tras consultar a sindicatos y empresarios.":
    "Зарплатный пол для полного рабочего дня, который правительство каждый год обновляет королевским декретом, посоветовавшись с профсоюзами и предпринимателями.",
  "¿Cuál es la jornada máxima legal en España?":
    "Каков законный предел рабочего времени в Испании?",
  "Treinta y cinco horas semanales": "Тридцать пять часов в неделю",
  "Cuarenta horas semanales de promedio anual": "Сорок часов в неделю в среднем за год",
  "Cuarenta y ocho horas semanales": "Сорок восемь часов в неделю",
  "La que fije cada empresa": "Тот, который задаст каждая фирма",
  "Cuarenta horas de promedio en cómputo anual, lo que permite semanas más largas y más cortas siempre que la media se respete. Las horas extraordinarias tienen tope legal.":
    "Сорок часов в среднем при годовом подсчёте, что допускает недели подлиннее и покороче, лишь бы среднее соблюдалось. У сверхурочных есть законный потолок.",
  "¿Qué es un contrato fijo discontinuo?": "Что такое постоянный прерывистый договор?",
  "Un contrato temporal renovable cada año": "Срочный договор, продлеваемый каждый год",
  "Un contrato indefinido para trabajos estacionales o intermitentes":
    "Бессрочный договор для сезонной или прерывистой работы",
  "Un contrato a tiempo parcial": "Договор на неполное время",
  "Un contrato de formación": "Ученический договор",
  "Es indefinido, aunque la prestación se concentre en determinadas temporadas: a la persona se la llama cada campaña y conserva su antigüedad.":
    "Он бессрочный, хотя работа и приходится на определённые сезоны: человека зовут каждую кампанию, и стаж за ним сохраняется.",
  "¿Pueden sustituirse las vacaciones por una compensación económica?":
    "Можно ли заменить отпуск денежной выплатой?",
  "Sí, si lo acuerdan empresa y trabajador": "Да, если фирма и работник договорятся",
  "No: el descanso es obligatorio": "Нет: отдых обязателен",
  "Sí, hasta la mitad de los días": "Да, до половины дней",
  "Solo en los contratos temporales": "Только по срочным договорам",
  "La ley no permite cambiar vacaciones por dinero mientras dura el contrato. Solo se compensan en metálico las no disfrutadas cuando la relación laboral termina.":
    "Закон не позволяет менять отпуск на деньги, пока договор действует. Деньгами возмещают только неотгулянные дни, когда трудовые отношения кончаются.",
  "¿Qué dos descuentos separan el salario bruto del neto?":
    "Какие два вычета отделяют начисленную зарплату от полученной?",
  "Las cotizaciones a la Seguridad Social y la retención del IRPF":
    "Взносы в Seguridad Social и удержание IRPF",
  "El IVA y el IRPF": "НДС и IRPF",
  "La cuota sindical y el seguro médico": "Профсоюзный взнос и медицинская страховка",
  "El impuesto de sociedades y la retención": "Налог на прибыль компаний и удержание",
  "La cotización financia la sanidad, el paro y las pensiones; la retención es un adelanto del impuesto sobre la renta que se ajusta en la declaración anual.":
    "Взносы финансируют здравоохранение, пособия по безработице и пенсии; удержание — это аванс подоходного налога, который выравнивают в годовой декларации.",
  "¿Cuántas pagas extraordinarias son habituales y cuándo se cobran?":
    "Сколько дополнительных выплат бывает обычно и когда их получают?",
  "Una, en diciembre": "Одна, в декабре",
  "Dos, en junio y en diciembre": "Две, в июне и в декабре",
  "Tres, repartidas por trimestres": "Три, разложенные по кварталам",
  "Ninguna: van siempre prorrateadas": "Ни одной: их всегда распределяют по месяцам",
  "Dos, aunque muchos convenios permiten prorratearlas en las doce mensualidades, con lo que el importe mensual sube y las extras desaparecen del calendario.":
    "Две, хотя многие договоры позволяют разложить их на двенадцать месяцев, и тогда месячная сумма растёт, а дополнительные выплаты исчезают из календаря.",
  "¿Qué organismo gestiona la prestación por desempleo?":
    "Какое учреждение ведает пособием по безработице?",
  "El SEPE": "SEPE",
  "El Ministerio de Trabajo directamente": "Министерство труда напрямую",
  "El Servicio Público de Empleo Estatal. Cobrar el paro exige haber cotizado un mínimo, y la duración depende de lo cotizado.":
    "Государственная служба занятости. Чтобы получать пособие, нужно иметь минимальный стаж взносов, и срок зависит от того, сколько внесено.",
  "¿Qué documento resume todo lo que una persona ha cotizado?":
    "Какой документ сводит воедино всё, что человек внёс?",
  "El finiquito": "Расчётный лист при увольнении",
  "La vida laboral": "Трудовая биография",
  "El certificado de empresa": "Справка от фирмы",
  "El informe de vida laboral, que puede pedirse en cualquier momento a la Seguridad Social. La nómina refleja un solo mes.":
    "Отчёт о трудовой биографии, который в любой момент можно запросить в Seguridad Social. Расчётный листок показывает только один месяц.",
  "¿Qué diferencia hay entre finiquito e indemnización?":
    "В чём разница между расчётом и выходным пособием?",
  "Son dos nombres de lo mismo": "Это два имени одного и того же",
  "El finiquito liquida lo pendiente y se cobra siempre; la indemnización solo corresponde en determinados despidos":
    "Расчёт закрывает то, что осталось, и его получают всегда; выходное пособие полагается только при определённых увольнениях",
  "La indemnización se cobra siempre y el finiquito solo si hay despido":
    "Выходное пособие получают всегда, а расчёт — только при увольнении",
  "El finiquito lo paga el SEPE y la indemnización la empresa":
    "Расчёт платит SEPE, а выходное пособие — фирма",
  "El finiquito incluye vacaciones no disfrutadas y pagas pendientes al terminar cualquier contrato. La indemnización se suma a él solo cuando el despido da derecho a ella.":
    "В расчёт входят неотгулянный отпуск и невыплаченные суммы при окончании любого договора. Выходное пособие прибавляется к нему только когда увольнение даёт на него право.",
  "¿Qué es un convenio colectivo?": "Что такое коллективный договор?",
  "Un contrato individual con la empresa": "Личный договор с фирмой",
  "Un acuerdo entre representantes de trabajadores y empresarios que fija condiciones para un sector o una empresa":
    "Соглашение между представителями работников и предпринимателей, которое задаёт условия для отрасли или фирмы",
  "Una norma dictada por el Gobierno": "Норма, изданная правительством",
  "Un pacto entre comunidades autónomas": "Договор между автономными сообществами",
  "Puede ser de sector o de empresa, y mejora los mínimos legales: salarios, jornada, permisos. Se aplica a todo el ámbito que cubre, no solo a los afiliados.":
    "Он может быть отраслевым или заводским и улучшает законные минимумы: зарплату, рабочее время, отпуска. Он применяется ко всей области, которую покрывает, а не только к членам профсоюза.",
  "¿Qué número acompaña a un trabajador toda su vida laboral?":
    "Какой номер сопровождает работника всю трудовую жизнь?",
  "El número de afiliación a la Seguridad Social": "Номер учёта в Seguridad Social",
  "El número de nómina": "Номер в платёжной ведомости",
  "El código del convenio": "Код коллективного договора",
  "El número de contrato": "Номер договора",
  "Se obtiene con la primera alta y ya no cambia, aunque se cambie de empresa, de régimen o de comunidad.":
    "Его получают при первой постановке на учёт, и он больше не меняется, даже если сменить фирму, режим или сообщество.",
  "¿Cómo se financia el Sistema Nacional de Salud?":
    "Как финансируется Национальная система здравоохранения?",
  "Con primas mensuales de los asegurados": "Ежемесячными взносами застрахованных",
  "Con impuestos": "Налогами",
  "Con las cuotas de las mutuas": "Взносами страховых обществ",
  "Con los copagos farmacéuticos": "Соплатежами за лекарства",
  "Se financia con impuestos y es universal: no hay primas ni cuotas mensuales. El copago farmacéutico cubre solo una parte del precio de los medicamentos.":
    "Она финансируется налогами и всеобща: ни премий, ни месячных взносов нет. Соплатёж за лекарства покрывает лишь часть их цены.",
  "¿Quién gestiona la sanidad pública en España?":
    "Кто управляет государственным здравоохранением в Испании?",
  "El Estado": "Государство",
  "Los ayuntamientos": "Муниципальные управления",
  "Las diputaciones": "Провинциальные собрания",
  "Las comunidades gestionan y el Estado fija las bases y coordina. De ahí que los tiempos de espera y la organización varíen de una a otra.":
    "Управляют сообщества, а государство задаёт основы и согласовывает. Отсюда и разница в сроках ожидания и в устройстве от одного к другому.",
  "¿Cuál es la puerta de entrada habitual al sistema sanitario?":
    "Какова обычная дверь в систему здравоохранения?",
  "El hospital": "Больница",
  "El centro de salud y el médico de familia": "Поликлиника и семейный врач",
  "La farmacia": "Аптека",
  "Urgencias": "Приёмный покой",
  "El médico de familia atiende, receta y deriva al especialista. A urgencias se puede acudir directamente, pero no es la vía ordinaria.":
    "Семейный врач принимает, выписывает и направляет к специалисту. В приёмный покой можно прийти напрямую, но обычный путь не такой.",
  "¿Qué ocurre con la tarjeta sanitaria al mudarse a otra comunidad autónoma?":
    "Что происходит с медицинской картой при переезде в другое автономное сообщество?",
  "Nada: es la misma en toda España": "Ничего: она одинакова по всей Испании",
  "Hay que cambiarla y asignarse un nuevo médico":
    "Её нужно поменять и прикрепиться к новому врачу",
  "Deja de tener validez durante seis meses": "Она теряет силу на шесть месяцев",
  "La emite entonces el Estado": "Тогда её выдаёт государство",
  "La emite cada comunidad, así que al cambiar de residencia hay que tramitar una nueva. La atención está garantizada en toda España, pero el trámite es autonómico.":
    "Её выдаёт каждое сообщество, так что при смене места жительства нужно оформлять новую. Помощь гарантирована по всей Испании, но оформление — дело автономии.",
  "¿De qué depende el porcentaje del copago farmacéutico?":
    "От чего зависит доля соплатежа за лекарства?",
  "De la edad": "От возраста",
  "De la renta": "От дохода",
  "De la comunidad autónoma": "От автономного сообщества",
  "Del tipo de farmacia": "От вида аптеки",
  "Se calcula en porcentaje según la renta, y los pensionistas tienen además topes mensuales que limitan lo que pueden llegar a pagar.":
    "Её считают в процентах по доходу, а у пенсионеров есть ещё месячные потолки, которые ограничивают то, сколько они могут заплатить.",
  "¿Entre qué edades es obligatoria la enseñanza en España?":
    "В каком возрасте обучение в Испании обязательно?",
  "De 3 a 16 años": "С 3 до 16 лет",
  "De 6 a 16 años": "С 6 до 16 лет",
  "De 6 a 18 años": "С 6 до 18 лет",
  "De 5 a 15 años": "С 5 до 15 лет",
  "De los seis a los dieciséis, es decir, Primaria y ESO. Infantil no es obligatoria y Bachillerato o FP tampoco.":
    "С шести до шестнадцати, то есть начальная школа и ESO. Дошкольная ступень не обязательна, бакалавриат и профессиональное обучение тоже.",
  "¿Cuántos cursos tiene la Educación Primaria?": "Сколько классов в начальной школе?",
  "Seis cursos, de los seis a los doce años. La ESO tiene cuatro, de los doce a los dieciséis.":
    "Шесть классов, с шести до двенадцати лет. В ESO четыре, с двенадцати до шестнадцати.",
  "¿Qué significan las siglas ESO?": "Что означает сокращение ESO?",
  "Enseñanza Superior Obligatoria": "Обязательное высшее обучение",
  "Educación Secundaria Obligatoria": "Обязательное среднее образование",
  "Escuela Secundaria Oficial": "Официальная средняя школа",
  "Estudios Superiores Ordinarios": "Обычное высшее обучение",
  "Cuatro cursos entre los doce y los dieciséis años, al término de los cuales se obtiene el título de Graduado en ESO.":
    "Четыре класса между двенадцатью и шестнадцатью годами, по окончании которых получают свидетельство об окончании ESO.",
  "¿Qué alternativa al Bachillerato existe después de la ESO?":
    "Какая есть замена бакалавриату после ESO?",
  "La Formación Profesional de grado medio": "Профессиональное обучение среднего уровня",
  "El doctorado": "Докторантура",
  "Ninguna: el Bachillerato es obligatorio": "Никакой: бакалавриат обязателен",
  "La FP de grado medio, y desde ella puede pasarse al grado superior y a la universidad. Ni el Bachillerato ni la FP son obligatorios.":
    "Профессиональное обучение среднего уровня, а из него можно перейти на высший уровень и в университет. Ни бакалавриат, ни профессиональное обучение не обязательны.",
  "¿Cuántos años dura un grado universitario en la mayoría de las carreras?":
    "Сколько лет длится университетская степень на большинстве направлений?",
  "Cuatro años en la mayoría, seguidos opcionalmente de máster y doctorado. Algunas carreras como Medicina son más largas.":
    "Четыре года на большинстве, а дальше по желанию магистратура и докторантура. Некоторые направления, вроде медицины, длиннее.",
  "¿A partir de qué nota se aprueba en el sistema educativo español?":
    "С какой отметки в испанской школе считается «сдано»?",
  "A partir del cuatro": "С четвёрки",
  "A partir del cinco": "С пятёрки",
  "A partir del seis": "С шестёрки",
  "A partir del diez": "С десятки",
  "La escala va de cero a diez y se aprueba con cinco. En la universidad se usa la misma escala, con la mención de matrícula de honor para las mejores notas.":
    "Шкала идёт от нуля до десяти, и сдано с пяти. В университете шкала та же, с отметкой «с отличием» для лучших результатов.",
  "¿Puede un centro concertado cobrar por la enseñanza en las etapas concertadas?":
    "Может ли школа на договоре брать плату за обучение на охваченных договором ступенях?",
  "Sí, libremente": "Да, свободно",
  "No: recibe fondos públicos precisamente a cambio de no hacerlo":
    "Нет: она и получает государственные деньги именно за то, что этого не делает",
  "Sí, hasta un tope fijado por la comunidad": "Да, до потолка, который задаёт сообщество",
  "Solo en Bachillerato": "Только в бакалавриате",
  "Ese es el trato del concierto: financiación pública a cambio de gratuidad en las etapas cubiertas. Las actividades complementarias sí pueden tener coste.":
    "В этом и состоит сделка: государственные деньги в обмен на бесплатность на охваченных ступенях. А дополнительные занятия платными быть могут.",
  "¿Qué prueba hay que superar para acceder a la universidad?":
    "Какое испытание нужно пройти, чтобы попасть в университет?",
  "Una prueba de acceso conocida durante décadas como selectividad":
    "Вступительное испытание, которое десятилетиями звали selectividad",
  "El título de Graduado en ESO": "Свидетельство об окончании ESO",
  "Una entrevista en la facultad": "Собеседование на факультете",
  "Ninguna: basta con el Bachillerato": "Никакого: хватает бакалавриата",
  "Además de superar el Bachillerato hay que aprobar la prueba de acceso, cuyas siglas han cambiado varias veces pero que todo el mundo sigue llamando selectividad.":
    "Кроме бакалавриата нужно сдать вступительное испытание, сокращение для которого меняли не раз, но все по-прежнему зовут его selectividad.",
  "¿Puede empadronarse una persona sin permiso de residencia?":
    "Может ли человек без вида на жительство пройти empadronamiento?",
  "No, hace falta autorización previa": "Нет, нужно предварительное разрешение",
  "Sí: el padrón registra dónde se vive, no la situación administrativa":
    "Да: реестр записывает, где человек живёт, а не его положение по документам",
  "Solo si tiene contrato de trabajo": "Только если у него есть трудовой договор",
  "Solo en los municipios grandes": "Только в больших муниципалитетах",
  "El padrón es un registro de residencia efectiva. De él dependen la tarjeta sanitaria y la escolarización, y por eso el acceso no se condiciona a la situación administrativa.":
    "Реестр — это запись о действительном проживании. От него зависят медицинская карта и приём в школу, и поэтому доступ к нему не ставят в зависимость от положения по документам.",
  "¿Qué acredita un certificado de empadronamiento?":
    "Что подтверждает справка об empadronamiento?",
  "El domicilio y el tiempo que se lleva residiendo en el municipio":
    "Адрес и то, сколько человек живёт в этом муниципалитете",
  "La situación laboral": "Положение с работой",
  "El nivel de renta": "Уровень дохода",
  "Es la prueba habitual del tiempo de residencia, y por eso lo piden después otros expedientes, incluidos los de arraigo y nacionalidad.":
    "Это обычное доказательство срока проживания, и поэтому её потом просят в других делах, в том числе об укоренении и о гражданстве.",
  "¿Qué significan las siglas TIE?": "Что означает сокращение TIE?",
  "Tarjeta de identidad de extranjero": "Карта личности иностранца",
  "Trámite de inscripción exterior": "Внешняя регистрационная процедура",
  "Título de ingreso especial": "Особое свидетельство о въезде",
  "Tasa de identificación estatal": "Государственный опознавательный сбор",
  "Es el documento físico que acredita la autorización de residencia y lleva impreso el NIE. El NIE por sí solo es un número, no una tarjeta.":
    "Это сам документ, который подтверждает разрешение на проживание и несёт напечатанный NIE. Сам по себе NIE — это номер, а не карта.",
  "¿Qué necesitan los ciudadanos de la Unión Europea para residir en España?":
    "Что нужно гражданам Европейского союза, чтобы жить в Испании?",
  "Una autorización de residencia": "Разрешение на проживание",
  "Un certificado de registro en el Registro Central de Extranjeros":
    "Свидетельство о записи в Центральном реестре иностранцев",
  "Un visado renovable cada año": "Виза, продлеваемая каждый год",
  "Nada en absoluto": "Совсем ничего",
  "No necesitan permiso, pero sí inscribirse y obtener un certificado de registro, que es un trámite mucho más ligero que una autorización de residencia.":
    "Разрешение им не нужно, но записаться и получить свидетельство о регистрации надо, и это куда более лёгкая процедура, чем разрешение на проживание.",
  "¿Qué son las figuras de arraigo?": "Что такое формы arraigo, укоренения?",
  "Ayudas económicas para familias numerosas": "Денежная помощь многодетным семьям",
  "Vías de regularización para quien lleva tiempo en el país y acredita vínculos":
    "Пути легализации для того, кто давно в стране и может подтвердить связи",
  "Contratos agrícolas de temporada": "Сезонные сельскохозяйственные договоры",
  "Programas de retorno voluntario": "Программы добровольного возвращения",
  "Hay arraigo social, laboral, familiar y para la formación, cada uno con requisitos propios. Todos parten de la permanencia acreditada en España.":
    "Есть arraigo общественное, трудовое, семейное и учебное, у каждого свои требования. Все они исходят из подтверждённого пребывания в Испании.",
  "¿Qué permite la residencia de larga duración?": "Что даёт долгосрочное проживание?",
  "Votar en las elecciones generales": "Голосовать на общенациональных выборах",
  "Residir y trabajar de forma indefinida en las mismas condiciones que los españoles":
    "Жить и работать бессрочно на тех же условиях, что и испанцы",
  "Obtener automáticamente la nacionalidad": "Автоматически получить гражданство",
  "Viajar sin pasaporte por toda Europa": "Ездить по всей Европе без паспорта",
  "Salvo en lo que la ley reserva a la nacionalidad, como el voto en las generales. Es un paso anterior y distinto al de hacerse español.":
    "Кроме того, что закон оставляет за гражданством, например голоса на общенациональных выборах. Это шаг более ранний и не тот же самый, что стать испанцем.",
  "¿Qué se necesita para hacer trámites con la Administración por internet?":
    "Что нужно, чтобы вести дела с органами власти через интернет?",
  "Solo el NIE": "Только NIE",
  "Una identidad digital: Cl@ve o un certificado digital":
    "Цифровое удостоверение: Cl@ve или цифровой сертификат",
  "Una cuenta bancaria española": "Испанский банковский счёт",
  "Un correo electrónico verificado": "Подтверждённая электронная почта",
  "Sin Cl@ve o certificado no se pide cita, no se descarga la vida laboral ni se presenta la declaración. Es hoy el requisito práctico para casi todo.":
    "Без Cl@ve или сертификата не записаться на приём, не скачать трудовую биографию и не подать декларацию. Сегодня это на деле условие почти для всего.",
  "¿Ante qué organismo se presenta la declaración de la renta?":
    "В какое учреждение подают декларацию о доходах?",
  "Ante la Seguridad Social": "В Seguridad Social",
  "Ante la Agencia Tributaria": "В Налоговое управление",
  "Ante el ayuntamiento": "В городскую управу",
  "Ante el Ministerio de Justicia": "В Министерство юстиции",
  "Ante la Agencia Tributaria, normalmente entre abril y junio. Regulariza lo que ya se retuvo en la nómina, y puede salir a pagar o a devolver.":
    "В Налоговое управление, обычно с апреля по июнь. Она выравнивает то, что уже удержали из зарплаты, и по итогу можно как доплатить, так и получить возврат.",
  "¿Ante qué ministerio se tramita el expediente de nacionalidad?":
    "В каком министерстве ведут дело о гражданстве?",
  "Interior": "Внутренних дел",
  "Justicia": "Юстиции",
  "Inclusión y Seguridad Social": "Включённости и Seguridad Social",
  "Asuntos Exteriores": "Иностранных дел",
  "El Ministerio de Justicia resuelve el expediente. Interior se ocupa de extranjería y las pruebas las administra el Instituto Cervantes: tres organismos distintos en un mismo camino.":
    "Дело решает Министерство юстиции. Делами иностранцев ведает Министерство внутренних дел, а экзамены проводит Instituto Cervantes: три разных учреждения на одном пути.",
  "¿Qué dos pruebas del Instituto Cervantes se exigen para la nacionalidad?":
    "Какие два экзамена Instituto Cervantes требуются для гражданства?",
  "El DELE A2 y la CCSE": "DELE A2 и CCSE",
  "El DELE B1 y una entrevista": "DELE B1 и собеседование",
  "La CCSE y un examen de historia": "CCSE и экзамен по истории",
  "Un examen médico y uno de lengua": "Медицинский осмотр и языковой экзамен",
  "La de lengua a nivel A2, de la que están exentos los nacionales de países hispanohablantes, y la de conocimientos constitucionales y socioculturales.":
    "Языковой на уровне A2, от которого освобождены выходцы из испаноязычных стран, и экзамен по знанию конституции и общественной жизни.",
  "¿Con qué acto se cierra la concesión de la nacionalidad?":
    "Каким действием завершается предоставление гражданства?",
  "Con la entrega del DNI": "Вручением DNI",
  "Con la jura o promesa de fidelidad al Rey y obediencia a la Constitución, y la inscripción en el Registro Civil":
    "Присягой или обещанием верности королю и повиновения конституции и записью в книгу актов гражданского состояния",
  "Con una ceremonia en el ayuntamiento": "Торжеством в городской управе",
  "Con el pago de una tasa": "Уплатой пошлины",
  "El acto formal y la inscripción registral cierran el expediente. El DNI llega después, como consecuencia de ya ser español.":
    "Дело закрывают торжественное действие и запись в книге. DNI приходит потом, уже как следствие того, что человек стал испанцем.",
  "¿Qué documento necesita un extranjero además del NIE para ser dado de alta en un empleo?":
    "Какой документ нужен иностранцу кроме NIE, чтобы его оформили на работу?",
  "El certificado de empadronamiento": "Справка о empadronamiento",
  "El carné de conducir": "Водительское удостоверение",
  "El pasaporte en vigor únicamente": "Только действующий паспорт",
  "El número de la Seguridad Social es distinto del NIE y no lo sustituye: hace falta para el alta laboral y acompaña a la persona toda su vida.":
    "Номер Seguridad Social — это не NIE и его не заменяет: он нужен для оформления на работу и сопровождает человека всю жизнь.",
  "¿Qué derecho da el empadronamiento a los ciudadanos de la Unión Europea?":
    "Какое право даёт empadronamiento гражданам Европейского союза?",
  "Votar en las elecciones municipales": "Голосовать на муниципальных выборах",
  "Acceder a la función pública": "Поступать на государственную службу",
  "Obtener la nacionalidad en dos años": "Получить гражданство за два года",
  "El voto municipal, tras la reforma constitucional de 1992 que lo permitió. Las generales siguen reservadas a quien tiene la nacionalidad española.":
    "Голос на муниципальных выборах, после конституционной поправки 1992 года, которая это позволила. Общенациональные выборы по-прежнему только для тех, у кого испанское гражданство.",
  "¿A qué hora se come habitualmente en España?": "В какое время в Испании обычно обедают?",
  "Entre las doce y la una": "Между двенадцатью и часом",
  "Entre las dos y las tres": "Между двумя и тремя",
  "A las cuatro": "В четыре",
  "Antes de las doce": "До двенадцати",
  "La comida del mediodía es la principal del día y se hace entre las dos y las tres, más tarde que en casi toda Europa. La cena llega a partir de las nueve.":
    "Дневная еда — главная за день, и приходится она на время между двумя и тремя, позже, чем почти во всей Европе. Ужин начинается с девяти.",
  "¿Qué explica en parte los horarios tardíos españoles?":
    "Чем отчасти объясняется поздний испанский распорядок?",
  "El clima mediterráneo": "Средиземноморским климатом",
  "Que España usa la hora de Europa central pese a estar a la longitud de Londres":
    "Тем, что Испания живёт по среднеевропейскому времени, хотя лежит на долготе Лондона",
  "La duración de la jornada escolar": "Длиной школьного дня",
  "Una ley de horarios comerciales": "Законом о часах работы торговли",
  "El sol se pone más tarde de lo que marca el reloj, y las comidas se desplazan con él. La otra parte de la explicación es simple costumbre heredada.":
    "Солнце садится позже, чем показывают часы, и еда сдвигается вместе с ним. Вторая половина объяснения — просто унаследованная привычка.",
  "¿Cómo se llama el segundo desayuno de media mañana?":
    "Как называется второй завтрак в середине утра?",
  "La merienda": "Merienda, «мериенда»",
  "El almuerzo": "Almuerzo, «альмуэрсо»",
  "La sobremesa": "Sobremesa, «собремеса»",
  "El aperitivo": "Aperitivo, «аперитиво»",
  "En España almuerzo designa a menudo ese tentempié de media mañana. La merienda es de media tarde y la sobremesa el rato de charla tras la comida.":
    "В Испании словом almuerzo часто зовут именно этот перекус в середине утра. Merienda приходится на середину второй половины дня, а sobremesa — это время разговора за столом после еды.",
  "¿Qué es la jornada partida?": "Что такое jornada partida, разделённый рабочий день?",
  "Trabajar solo por la mañana": "Работать только утром",
  "Cerrar a mediodía y reabrir por la tarde":
    "Закрываться в полдень и снова открываться во второй половине дня",
  "Repartir la semana en cuatro días": "Разложить неделю на четыре дня",
  "Turnarse con otro empleado": "Меняться сменами с другим работником",
  "Es más común cuanto más pequeño es el municipio. En las grandes ciudades muchos comercios ya no cierran a mediodía.":
    "Чем меньше населённый пункт, тем это обычнее. В больших городах многие магазины в полдень уже не закрываются.",
  "¿Qué papel tiene realmente la siesta en España?":
    "Какое место на самом деле занимает сиеста в Испании?",
  "Es una práctica diaria generalizada": "Это повсеместный ежедневный обычай",
  "Es sobre todo una costumbre de fin de semana y de verano":
    "Это прежде всего обычай выходных и лета",
  "Está regulada por convenio en todos los sectores":
    "Она прописана в коллективных договорах всех отраслей",
  "Desapareció por completo en los años ochenta": "Она полностью исчезла в восьмидесятые годы",
  "La imagen internacional exagera su alcance: con jornadas y desplazamientos actuales, dormir a diario después de comer es minoritario entre semana.":
    "Заграничное представление о ней преувеличено: при нынешнем рабочем дне и нынешних поездках спать каждый день после еды в будни удаётся немногим.",
  "¿Qué es el tapeo?": "Что такое tapeo?",
  "Comer de pie en un restaurante": "Есть стоя в ресторане",
  "Ir de bar en bar tomando algo pequeño con la bebida":
    "Ходить из бара в бар, беря к напитку что-нибудь небольшое",
  "Un menú infantil": "Детское меню",
  "Un tipo de cocina regional": "Вид областной кухни",
  "En unas ciudades la tapa va incluida con la consumición y en otras se paga aparte. Es tanto una forma de comer como una forma de moverse por la calle.":
    "В одних городах tapa идёт вместе с напитком, в других её оплачивают отдельно. Это столько же способ есть, сколько способ передвигаться по улице.",
  "¿Qué es la sobremesa?": "Что такое sobremesa?",
  "El postre": "Сладкое в конце еды",
  "El rato de conversación que sigue a la comida, con la mesa ya recogida":
    "Время разговора после еды, когда со стола уже убрали",
  "El mantel que se pone sobre la mesa": "Скатерть, которую стелют на стол",
  "La cuenta que se pide al final": "Счёт, который просят в конце",
  "Puede durar más que la propia comida, sobre todo en fin de semana, y es una de las costumbres que más llama la atención a quien llega de fuera.":
    "Она может длиться дольше самой еды, особенно в выходные, и это один из обычаев, который сильнее всего бросается в глаза приезжему.",
  "¿En qué contextos se usa el usted en España?": "В каких случаях в Испании говорят usted?",
  "Con casi todo el mundo, salvo la familia": "Почти со всеми, кроме родных",
  "Con personas mayores y en contextos muy formales":
    "С пожилыми людьми и в очень строгой обстановке",
  "Nunca: ha desaparecido del uso": "Никогда: это ушло из обихода",
  "Solo por escrito": "Только на письме",
  "El tuteo está mucho más extendido en España que en el resto del mundo hispanohablante: se tutea a compañeros, camareros y desconocidos de edad parecida.":
    "Обращение на ты в Испании распространено куда шире, чем в остальном испаноязычном мире: на ты говорят с сослуживцами, с официантами и с незнакомыми людьми близкого возраста.",
  "¿Qué tipo de vivienda predomina en las ciudades españolas?":
    "Какое жильё преобладает в испанских городах?",
  "La casa unifamiliar": "Отдельный дом на одну семью",
  "El piso en edificio": "Квартира в доме",
  "La vivienda rural rehabilitada": "Восстановленное сельское жильё",
  "El adosado": "Дом в сомкнутом ряду",
  "El piso es la forma dominante, y la propiedad está muy extendida: la proporción de hogares en vivienda propia es de las más altas de Europa, aunque el alquiler crece entre los jóvenes.":
    "Квартира — преобладающий вид, и собственность распространена очень широко: доля семей в собственном жилье одна из самых высоких в Европе, хотя съём среди молодых растёт.",
  "¿Cómo se conoce a la selección española de fútbol?": "Как зовут испанскую сборную по футболу?",
  "La Azzurra": "«Адзурра»",
  "La Roja": "«Роха»",
  "Los Azules": "«Асулес»",
  "La Albiceleste": "«Альбиселесте»",
  "La Roja, por el color de la camiseta. La Azzurra es Italia y la Albiceleste Argentina.":
    "«Роха», по цвету футболки: la roja значит красная. «Адзурра» — это Италия, а «Альбиселесте» — Аргентина.",
  "¿Cómo se llama la gran vuelta ciclista española?":
    "Как называется большая испанская велогонка?",
  "El Giro": "«Джиро»",
  "La Vuelta a España": "«Вуэльта Испании»",
  "El Tour": "«Тур»",
  "La Ronda Ibérica": "«Иберийский круг»",
  "La Vuelta a España, que se corre cada septiembre. El Giro es italiano y se corre en mayo, y el Tour francés en julio.":
    "«Вуэльта Испании», её проводят каждый сентябрь. «Джиро» — итальянская и идёт в мае, а «Тур» — французский и идёт в июле.",
  "¿Cómo se llama el partido entre los dos grandes clubes de fútbol españoles?":
    "Как называется матч двух больших испанских футбольных клубов?",
  "El derbi": "Дерби",
  "El clásico": "Класико",
  "La final": "Финал",
  "El duelo": "Поединок",
  "El clásico. Derbi se reserva para los partidos entre equipos de la misma ciudad, como los dos de Madrid o los dos de Sevilla.":
    "Класико. Слово дерби оставляют для матчей команд из одного города, вроде двух мадридских или двух севильских.",
  "¿Por qué razón principal se independizan tarde los jóvenes españoles?":
    "По какой главной причине испанская молодёжь поздно отделяется от родителей?",
  "Por tradición familiar": "По семейному обычаю",
  "Por razones económicas: precios de la vivienda y empleo inestable":
    "По денежным причинам: цены на жильё и нестойкая занятость",
  "Porque la ley lo dificulta": "Потому что закон это затрудняет",
  "Porque estudian más años que en otros países":
    "Потому что они учатся больше лет, чем в других странах",
  "La edad media de emancipación es de las más altas de Europa, y las encuestas apuntan sobre todo al coste de la vivienda y a la inestabilidad del primer empleo.":
    "Средний возраст отделения от родителей один из самых высоких в Европе, и опросы указывают прежде всего на стоимость жилья и на нестойкость первой работы.",
};
