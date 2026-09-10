/**
 * English for the Vivir en España practice questions.
 *
 * The lesson cards are answered by VIVIR_EN_ESPANA_EN. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in English then asked its questions
 * in Spanish.
 *
 * Keyed on the SPANISH source text exactly as it appears in esQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an a for
 * an á or a straight apostrophe where the sentence has a curly one, and the
 * lookup misses in silence. The question renders in Spanish, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS SPANISH follows VIVIR_EN_ESPANA_EN exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - the word printed on the form or the card keeps its own name, with the
 *     meaning beside it: DNI, NIE, Seguridad Social, padrón, arraigo, DELE,
 *     CCSE, finiquito, vida laboral, concierto, ESO, Bachillerato;
 *   - so does the custom that has no English twin: sobremesa, tapeo, siesta,
 *     almuerzo, jornada partida;
 *   - and the Constitution's own word for the language, castellano, which is
 *     Castilian and never Spanish: article 3 uses it precisely because the
 *     other languages of Spain are Spanish too;
 *   - what English already names takes its English name: the Congreso de los
 *     Diputados is the Congress, the Tribunal Supremo the Supreme Court, the
 *     Defensor del Pueblo the Ombudsman, a concejal a councillor and the
 *     presidente del Gobierno the prime minister.
 *
 * British spelling throughout, the same as the rest of the English catalogue:
 * offence, recognise, programme, defence, labour.
 *
 * Seventy-five of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that VIVIR_EN_ESPANA_EN already
 * answers. Every English table is spread into one object, so a key present in
 * two of them would lose one silently — the later spread would decide both.
 * check-en-bank-translation measures coverage through translateCourseText,
 * the lookup a reader's tap actually goes through, so those count as answered
 * and are not duplicated here.
 */
export const ES_QUESTION_BANK_EN: Record<string, string> = {
  "¿Qué artículo de la Constitución describe la bandera?":
    "Which article of the Constitution describes the flag?",
  "El artículo 1": "Article 1",
  "El artículo 3": "Article 3",
  "El artículo 4": "Article 4",
  "El artículo 11": "Article 11",
  "El artículo 4. El 3 se ocupa de las lenguas y el 11 de la nacionalidad: los tres están en el título preliminar y se confunden con facilidad.":
    "Article 4. Article 3 deals with the languages and 11 with nationality: all three sit in the preliminary title and are easily muddled.",
  "¿En el reinado de quién se adoptaron el rojo y el amarillo?":
    "In whose reign were the red and yellow adopted?",
  "De Felipe II": "Philip II",
  "De Carlos III": "Charles III",
  "De Fernando VII": "Ferdinand VII",
  "De Alfonso XIII": "Alfonso XIII",
  "Carlos III convocó en 1785 un concurso para dotar a la Armada de un pabellón distinguible. De la marina pasó al ejército y, ya en el siglo XIX, a bandera nacional.":
    "In 1785 Charles III called a competition to give the navy a flag that could be told apart. It passed from the navy to the army and, in the nineteenth century, became the national flag.",
  "¿Por qué se eligieron el rojo y el amarillo para el pabellón?":
    "Why were red and yellow chosen for the flag?",
  "Por ser los colores de la Casa Real": "Because they were the colours of the royal house",
  "Para que la escuadra se distinguiera desde lejos en el mar":
    "So that the fleet could be told apart from far off at sea",
  "Por recordar el oro de América": "To recall the gold of the Americas",
  "Por imitar a la bandera francesa": "To copy the French flag",
  "Casi todas las flotas europeas usaban fondos blancos con escudos y de lejos se confundían. El rojo y el amarillo se ven a mucha distancia: la razón fue práctica antes que simbólica.":
    "Almost every European fleet used white grounds with coats of arms, and from a distance they looked alike. Red and yellow can be seen a long way off: the reason was practical before it was symbolic.",
  "¿Qué reino representa la granada situada al pie del escudo?":
    "Which kingdom does the pomegranate at the foot of the arms stand for?",
  "Navarra": "Navarre",
  "Aragón": "Aragon",
  "León": "León",
  "La granada recuerda el reino nazarí incorporado en 1492, el último de la Península. Navarra aporta las cadenas y Aragón los cuatro palos.":
    "The pomegranate recalls the Nasrid kingdom taken in 1492, the last on the Peninsula. Navarre gives the chains and Aragon the four bars.",
  "¿Qué lema llevan las columnas de Hércules del escudo?":
    "What motto do the pillars of Hercules on the arms carry?",
  "PLUS ULTRA": "PLUS ULTRA",
  "NON PLUS ULTRA": "NON PLUS ULTRA",
  "UNA GRANDE Y LIBRE": "UNA GRANDE Y LIBRE",
  "TANTO MONTA": "TANTO MONTA",
  "Plus ultra, más allá. Antes del descubrimiento de América el lema era el contrario, non plus ultra: nada más allá del estrecho. Se le quitó la negación.":
    "Plus ultra, further beyond. Before the Americas were reached the motto was the opposite, non plus ultra: nothing beyond the strait. The negative was taken away.",
  "¿Cómo se llama el himno nacional español?": "What is the Spanish national anthem called?",
  "Himno de Riego": "Himno de Riego, the anthem of the Republic",
  "Marcha Real": "Marcha Real, the royal march",
  "La Marsellesa": "La Marseillaise, the French anthem",
  "Cara al sol": "Cara al sol, the Falangist anthem",
  "La Marcha Real. El Himno de Riego fue el himno de la Segunda República, entre 1931 y 1939.":
    "The Marcha Real. The Himno de Riego was the anthem of the Second Republic, between 1931 and 1939.",
  "¿Desde qué año está documentado el himno español?":
    "From which year is the Spanish anthem documented?",
  "Desde 1492": "From 1492",
  "Desde 1761": "From 1761",
  "Desde 1812": "From 1812",
  "Desde 1978": "From 1978",
  "Aparece en 1761 como Marcha Granadera, lo que lo convierte en uno de los himnos más antiguos de Europa.":
    "It appears in 1761 as the Marcha Granadera, which makes it one of the oldest anthems in Europe.",
  "¿Qué se celebra el 6 de diciembre?": "What is celebrated on 6 December?",
  "La Fiesta Nacional": "The national day",
  "La proclamación del rey": "The proclamation of the king",
  "El Día de la Hispanidad": "The Día de la Hispanidad",
  "El Día de la Constitución, por el referéndum de 1978. La Fiesta Nacional es el 12 de octubre, y el Día de la Hispanidad es otro nombre para esa misma fecha.":
    "Constitution Day, for the referendum of 1978. The national day is 12 October, and the Día de la Hispanidad is another name for that same date.",
  "¿Qué se conmemora el 2 de mayo en la Comunidad de Madrid?":
    "What does 2 May commemorate in the Community of Madrid?",
  "La entrada de los Reyes Católicos en Granada":
    "The entry of the Catholic Monarchs into Granada",
  "El levantamiento de 1808 contra las tropas de Napoleón":
    "The rising of 1808 against Napoleon's troops",
  "La proclamación de la Segunda República": "The proclamation of the Second Republic",
  "La aprobación del Estatuto de Autonomía": "The passing of the Statute of Autonomy",
  "El levantamiento del pueblo de Madrid en 1808, que abre la Guerra de la Independencia. Es fiesta de la comunidad, no nacional.":
    "The rising of the people of Madrid in 1808, which opens the War of Independence. It is a holiday of the community, not a national one.",
  "¿Qué lengua declara oficial del Estado el artículo 3?":
    "Which language does Article 3 declare official for the state?",
  "El castellano": "Castilian",
  "El español y el catalán": "Spanish and Catalan",
  "Todas las lenguas de España por igual": "All the languages of Spain equally",
  "No lo dice ningún artículo": "No article says",
  "El castellano es la lengua española oficial del Estado, y el mismo artículo añade que las demás lenguas españolas serán también oficiales en sus respectivas comunidades.":
    "Castilian is the Spanish language official for the state, and the same article adds that the other Spanish languages are also official in their own communities.",
  "¿Cuál es la diferencia entre la bandera con escudo y la bandera sin escudo?":
    "What is the difference between the flag with the arms and the flag without?",
  "La de los edificios oficiales lleva escudo; la de uso común normalmente no":
    "The one on official buildings carries the arms; the everyday one usually does not",
  "La del escudo solo puede usarla la Casa Real":
    "Only the royal house may use the one with the arms",
  "La sin escudo está prohibida": "The one without the arms is forbidden",
  "Son banderas de dos épocas distintas": "They are flags of two different periods",
  "Ambas son correctas. La versión oficial, la de organismos y actos del Estado, incorpora el escudo; la que se cuelga de un balcón o se ve en un estadio suele ser la lisa.":
    "Both are correct. The official version, the one for state bodies and state occasions, carries the arms; the one hung from a balcony or seen in a stadium is usually the plain one.",
  "¿Qué figuras ocupan los dos primeros cuarteles del escudo?":
    "Which figures fill the first two quarters of the arms?",
  "Un águila y una cruz": "An eagle and a cross",
  "Un castillo y un león": "A castle and a lion",
  "Dos columnas": "Two pillars",
  "Una granada y unas cadenas": "A pomegranate and chains",
  "El castillo de Castilla y el león de León. Las cadenas son de Navarra, la granada del reino de Granada y las columnas enmarcan el conjunto.":
    "The castle of Castile and the lion of León. The chains belong to Navarre, the pomegranate to the kingdom of Granada, and the pillars frame the whole.",
  "¿Qué reino representan las cadenas del escudo?":
    "Which kingdom do the chains on the arms stand for?",
  "Castilla": "Castile",
  "Portugal": "Portugal",
  "Las cadenas son el emblema de Navarra. Aragón aporta los cuatro palos rojos sobre fondo dorado, y Portugal nunca formó parte del escudo.":
    "The chains are the emblem of Navarre. Aragon gives the four red bars on a golden ground, and Portugal was never part of the arms.",
  "¿Cuántos artículos tiene la Constitución española?":
    "How many articles does the Spanish Constitution have?",
  "Noventa y nueve": "Ninety-nine",
  "Ciento sesenta y nueve": "A hundred and sixty-nine",
  "Ciento sesenta y nueve, repartidos en un título preliminar y diez títulos, más las disposiciones finales. Es un texto largo para los estándares europeos.":
    "A hundred and sixty-nine, spread over a preliminary title and ten titles, plus the final provisions. It is a long text by European standards.",
  "¿Cuándo entró en vigor la Constitución?": "When did the Constitution come into force?",
  "El 1 de enero de 1979": "On 1 January 1979",
  "El 29 de diciembre, el día de su publicación en el Boletín Oficial del Estado. El 6 fue el referéndum y el 27 la sanción del rey.":
    "On 29 December, the day it appeared in the Boletín Oficial del Estado. The 6th was the referendum and the 27th the king's assent.",
  "¿Cómo se conoce a los siete diputados que redactaron el borrador?":
    "What are the seven members who drafted the text known as?",
  "Los constituyentes": "The constituent members",
  "Los padres de la Constitución": "The fathers of the Constitution",
  "La comisión de notables": "The commission of notables",
  "El consejo de redacción": "The drafting council",
  "Se les llama los padres de la Constitución. Pertenecían a partidos distintos, lo que era el punto: el texto se escribió para que ninguna fuerza quedara fuera.":
    "They are called the fathers of the Constitution. They belonged to different parties, which was the point: the text was written so that no force was left out.",
  "¿Qué palabra resume el método con el que se redactó la Constitución?":
    "Which word sums up the method by which the Constitution was drafted?",
  "Imposición": "Imposition",
  "Consenso": "Consensus",
  "Plebiscito": "Plebiscite",
  "Codificación": "Codification",
  "Consenso. Algunos artículos son deliberadamente amplios porque se acordó la frase precisamente por admitir más de una lectura: era el precio de que nadie quedara excluido.":
    "Consensus. Some articles are deliberately broad because the wording was agreed precisely for admitting more than one reading: that was the price of leaving nobody out.",
  "¿Qué título de la Constitución trata de la organización territorial del Estado?":
    "Which title of the Constitution deals with the territorial organisation of the state?",
  "El título preliminar": "The preliminary title",
  "El título I": "Title I",
  "El título VI": "Title VI",
  "El título VIII": "Title VIII",
  "El título VIII. De él nacen las comunidades autónomas, y por eso al modelo se le llama a veces Estado del título VIII.":
    "Title VIII. The autonomous communities are born from it, which is why the model is sometimes called the state of Title VIII.",
  "¿Qué artículos forman el título preliminar?": "Which articles make up the preliminary title?",
  "Del 1 al 9": "1 to 9",
  "Del 1 al 14": "1 to 14",
  "Del 10 al 55": "10 to 55",
  "Del 1 al 29": "1 to 29",
  "Del 1 al 9: qué es España, dónde reside la soberanía, las lenguas, la bandera, la capital. Del 10 al 55 va el título I, sobre derechos y deberes.":
    "1 to 9: what Spain is, where sovereignty lies, the languages, the flag, the capital. Title I, on rights and duties, runs from 10 to 55.",
  "¿Qué dos afirmaciones contiene el artículo 2?": "Which two statements does Article 2 contain?",
  "La unidad de la Nación y el derecho a la autonomía de nacionalidades y regiones":
    "The unity of the nation and the right of nationalities and regions to autonomy",
  "La soberanía popular y la monarquía parlamentaria":
    "Popular sovereignty and the parliamentary monarchy",
  "La oficialidad del castellano y de las demás lenguas":
    "The official standing of Castilian and of the other languages",
  "La igualdad ante la ley y la prohibición de discriminación":
    "Equality before the law and the ban on discrimination",
  "Las dos mitades se acordaron juntas y ninguna se entiende sin la otra. Sobre ellas se construyó después todo el Estado autonómico.":
    "The two halves were agreed together and neither makes sense without the other. On them the whole state of the autonomous communities was later built.",
  "¿Qué artículo se reformó en 2011?": "Which article was amended in 2011?",
  "El artículo 13": "Article 13",
  "El artículo 135": "Article 135",
  "El artículo 2": "Article 2",
  "El artículo 168": "Article 168",
  "El 135, sobre estabilidad presupuestaria, en plena crisis de deuda. La otra reforma, la de 1992, tocó el artículo 13.":
    "Article 135, on budget stability, in the middle of the debt crisis. The other amendment, that of 1992, touched Article 13.",
  "¿Por qué se reformó la Constitución en 1992?": "Why was the Constitution amended in 1992?",
  "Para permitir el voto de extranjeros en las elecciones municipales tras Maastricht":
    "To allow foreigners to vote in local elections after Maastricht",
  "Para introducir el euro": "To bring in the euro",
  "Para reformar el Senado": "To reform the Senate",
  "Para ampliar las competencias autonómicas": "To widen the powers of the communities",
  "El Tratado de Maastricht obligaba a reconocer el sufragio pasivo en las municipales a los ciudadanos comunitarios, y hubo que añadir dos palabras al artículo 13.":
    "The Treaty of Maastricht required that citizens of the Community be allowed to stand in local elections, and two words had to be added to Article 13.",
  "¿Qué procedimiento de reforma obliga a disolver las Cortes y convocar elecciones?":
    "Which procedure for amendment requires the Cortes to be dissolved and an election called?",
  "El del artículo 167": "That of Article 167",
  "El del artículo 168": "That of Article 168",
  "El del artículo 92": "That of Article 92",
  "Ninguno lo exige": "None requires it",
  "El procedimiento agravado del artículo 168, que además exige dos tercios de ambas cámaras antes y después, y un referéndum obligatorio al final.":
    "The heavier procedure of Article 168, which also requires two thirds of both chambers before and after, and a compulsory referendum at the end.",
  "¿Qué partes de la Constitución protege el procedimiento agravado?":
    "Which parts of the Constitution does the heavier procedure protect?",
  "Solo el título de la Corona": "The title on the Crown alone",
  "El título preliminar, los derechos fundamentales de la sección primera y el título de la Corona":
    "The preliminary title, the fundamental rights of the first section and the title on the Crown",
  "Todo el texto por igual": "The whole text equally",
  "Solo el título VIII": "Title VIII alone",
  "Son las tres partes que el constituyente quiso poner casi fuera de alcance. Todo lo demás se reforma por el procedimiento ordinario, con tres quintos de cada cámara.":
    "Those are the three parts the framers wanted almost out of reach. Everything else is amended by the ordinary procedure, with three fifths of each chamber.",
  "¿Quién sancionó la Constitución en diciembre de 1978?":
    "Who gave the Constitution its assent in December 1978?",
  "El presidente del Gobierno": "The prime minister",
  "El rey": "The king",
  "El presidente de las Cortes": "The president of the Cortes",
  "El rey la sancionó el 27 de diciembre, después de que las Cortes la aprobaran y el pueblo la ratificara en referéndum.":
    "The king gave his assent on 27 December, after the Cortes had passed it and the people had ratified it by referendum.",
  "¿Qué mayoría exige el procedimiento ordinario de reforma?":
    "What majority does the ordinary procedure for amendment require?",
  "Mayoría simple de cada cámara": "A simple majority of each chamber",
  "Mayoría absoluta del Congreso": "An absolute majority of the Congress",
  "Tres quintos de cada cámara": "Three fifths of each chamber",
  "Dos tercios de cada cámara": "Two thirds of each chamber",
  "Tres quintos de Congreso y Senado. Los dos tercios corresponden al procedimiento agravado del artículo 168, que además obliga a disolver las Cortes.":
    "Three fifths of the Congress and the Senate. Two thirds belong to the heavier procedure of Article 168, which also requires the Cortes to be dissolved.",
  "¿Qué artículos están protegidos por el recurso de amparo?":
    "Which articles does the recurso de amparo protect?",
  "Del 14 al 29": "14 to 29",
  "Del 30 al 38": "30 to 38",
  "Del 39 al 52": "39 to 52",
  "Del 14 al 29: la igualdad y los derechos fundamentales y libertades públicas. Los de los artículos 39 a 52 son principios rectores y no llegan al amparo.":
    "14 to 29: equality and the fundamental rights and public freedoms. Those in Articles 39 to 52 are guiding principles and do not reach the amparo.",
  "¿Qué establece el artículo 14?": "What does Article 14 lay down?",
  "El derecho a la vida": "The right to life",
  "La igualdad ante la ley sin discriminación alguna":
    "Equality before the law, with no discrimination of any kind",
  "La libertad de expresión": "Freedom of expression",
  "El derecho a la educación": "The right to education",
  "La igualdad ante la ley, sin que pueda prevalecer discriminación por nacimiento, raza, sexo, religión, opinión o cualquier otra condición personal o social.":
    "Equality before the law, with no discrimination prevailing on grounds of birth, race, sex, religion, opinion or any other personal or social condition.",
  "¿Qué abolió el artículo 15?": "What did Article 15 abolish?",
  "La esclavitud": "Slavery",
  "La pena de muerte": "The death penalty",
  "La prisión por deudas": "Imprisonment for debt",
  "La pena de muerte, con una salvedad inicial para las leyes penales militares en tiempo de guerra. Esa excepción se suprimió por ley en 1995.":
    "The death penalty, with an initial saving for the military criminal laws in time of war. That exception was removed by law in 1995.",
  "¿Cuándo desapareció por completo la pena de muerte del ordenamiento español?":
    "When did the death penalty disappear entirely from Spanish law?",
  "En 1985": "In 1985",
  "En 1995": "In 1995",
  "En 2005": "In 2005",
  "La Constitución la abolió en 1978 salvo para las leyes penales militares en tiempo de guerra, y esa última excepción se eliminó por ley en 1995.":
    "The Constitution abolished it in 1978 except for the military criminal laws in time of war, and that last exception was removed by law in 1995.",
  "¿Qué protege el artículo 18?": "What does Article 18 protect?",
  "El honor, la intimidad, el domicilio y el secreto de las comunicaciones":
    "Honour, privacy, the home and the secrecy of communications",
  "El derecho de huelga": "The right to strike",
  "La libertad de circulación": "Freedom of movement",
  "El derecho de petición": "The right of petition",
  "Es el artículo de la vida privada: honor, intimidad, propia imagen, inviolabilidad del domicilio y secreto de las comunicaciones.":
    "It is the article of private life: honour, privacy, one's own image, the inviolability of the home and the secrecy of communications.",
  "¿En qué casos puede entrarse en un domicilio sin permiso del titular?":
    "In which cases can a home be entered without the occupier's permission?",
  "Nunca": "Never",
  "Con resolución judicial o en caso de delito flagrante":
    "With a court order, or where an offence is being committed",
  "Siempre que lo pida la policía": "Whenever the police ask",
  "Con autorización del ayuntamiento": "With the town hall's authorisation",
  "El domicilio es inviolable. Solo caben el consentimiento del titular, la resolución judicial y el delito flagrante: fuera de esos tres supuestos, la entrada es ilegal.":
    "The home is inviolable. Only the occupier's consent, a court order and an offence in progress will do: outside those three cases, entering is unlawful.",
  "¿Para qué sirve el habeas corpus?": "What is habeas corpus for?",
  "Para recurrir una sentencia firme": "For appealing a final judgment",
  "Para llevar de inmediato ante un juez a quien esté detenido ilegalmente":
    "For bringing anyone unlawfully detained before a judge at once",
  "Para pedir asistencia letrada gratuita": "For asking for free legal assistance",
  "Para impugnar una ley ante el Tribunal Constitucional":
    "For challenging a law before the Constitutional Court",
  "Está previsto en el artículo 17 y sirve para poner sin demora a un detenido a disposición judicial. Es la garantía práctica del límite de las setenta y dos horas.":
    "It is provided for in Article 17 and serves to put a detainee before a judge without delay. It is the practical guarantee behind the seventy-two hour limit.",
  "¿Hace falta autorización para celebrar una manifestación en la vía pública?":
    "Is authorisation needed to hold a demonstration in a public street?",
  "Sí, la autoridad debe concederla": "Yes; the authority has to grant it",
  "No: basta comunicarla previamente a la autoridad":
    "No: notifying the authority beforehand is enough",
  "Solo si participan más de mil personas": "Only if more than a thousand people take part",
  "Solo en las capitales de provincia": "Only in provincial capitals",
  "El artículo 21 exige comunicación previa, no autorización. La autoridad solo puede prohibirla por razones fundadas de alteración del orden público con peligro para personas o bienes.":
    "Article 21 requires prior notice, not authorisation. The authority can ban it only on well-founded grounds of a breach of public order with danger to people or property.",
  "¿Qué prohíbe expresamente el artículo 20 en materia de prensa?":
    "What does Article 20 expressly forbid in matters of the press?",
  "La publicidad": "Advertising",
  "La censura previa": "Prior censorship",
  "Las publicaciones extranjeras": "Foreign publications",
  "El anonimato de las fuentes": "Anonymous sources",
  "La censura previa. El mismo artículo reconoce la libertad de expresión y el derecho a comunicar y recibir información veraz.":
    "Prior censorship. The same article recognises freedom of expression and the right to give and to receive truthful information.",
  "¿A qué deben orientarse las penas privativas de libertad?":
    "What must sentences of imprisonment be aimed at?",
  "A la retribución del daño causado": "At paying back the harm done",
  "A la reeducación y la reinserción social": "At re-education and a return to society",
  "A la disuasión de terceros": "At deterring other people",
  "Al resarcimiento de la víctima": "At compensating the victim",
  "El artículo 25 fija la reeducación y la reinserción como orientación de las penas y las medidas de seguridad. Es un mandato constitucional, no una recomendación.":
    "Article 25 sets re-education and a return to society as the aim of sentences and of preventive measures. It is a constitutional command, not a recommendation.",
  "¿Dónde está reconocido el derecho a una vivienda digna?":
    "Where is the right to decent housing recognised?",
  "Entre los derechos fundamentales, con amparo": "Among the fundamental rights, with the amparo",
  "En el artículo 47, entre los principios rectores":
    "In Article 47, among the guiding principles",
  "En el título preliminar": "In the preliminary title",
  "No aparece en la Constitución": "It does not appear in the Constitution",
  "Está en el artículo 47, entre los principios rectores de la política social y económica: obliga al legislador, pero no se reclama directamente ante un juez como la libertad de expresión.":
    "It is in Article 47, among the guiding principles of social and economic policy: it binds the legislator, but it is not claimed directly before a judge the way freedom of expression is.",
  "¿Cuál es la diferencia práctica entre un derecho fundamental y un principio rector?":
    "What is the practical difference between a fundamental right and a guiding principle?",
  "Ninguna: los dos se alegan igual": "None: both are pleaded the same way",
  "El fundamental llega al amparo constitucional; el principio rector solo conforme a las leyes que lo desarrollen":
    "The fundamental right reaches the constitutional amparo; the guiding principle only through the laws that give it shape",
  "El principio rector obliga a las comunidades y el fundamental al Estado":
    "The guiding principle binds the communities and the fundamental right the state",
  "El principio rector no aparece en el texto constitucional":
    "The guiding principle does not appear in the constitutional text",
  "La diferencia es de protección, no de importancia. Los fundamentales exigen ley orgánica y llegan al Tribunal Constitucional por la vía del amparo.":
    "The difference is one of protection, not of importance. Fundamental rights require an organic law and reach the Constitutional Court by way of the amparo.",
  "¿Qué garantiza el artículo 24?": "What does Article 24 guarantee?",
  "La tutela judicial efectiva y la presunción de inocencia":
    "Effective judicial protection and the presumption of innocence",
  "La libertad religiosa": "Freedom of religion",
  "El derecho al trabajo": "The right to work",
  "La inviolabilidad del domicilio": "The inviolability of the home",
  "Juez ordinario predeterminado por la ley, defensa y asistencia de letrado, proceso sin dilaciones indebidas y presunción de inocencia. Es el artículo del proceso justo.":
    "The ordinary judge laid down in advance by law, a defence and the help of a lawyer, a trial without undue delay and the presumption of innocence. It is the article of the fair trial.",
  "¿Cuándo quedó suspendido el servicio militar obligatorio en España?":
    "When was compulsory military service suspended in Spain?",
  "En 2001": "In 2001",
  "Sigue vigente": "It is still in force",
  "En 2001. Desde entonces las Fuerzas Armadas son enteramente profesionales, aunque el artículo 30 mantiene el derecho y el deber de defender a España.":
    "In 2001. Since then the armed forces have been entirely professional, though Article 30 keeps the right and the duty to defend Spain.",
  "¿Qué artículo impone contribuir al sostenimiento de los gastos públicos?":
    "Which article requires you to contribute to public spending?",
  "El artículo 30": "Article 30",
  "El artículo 31": "Article 31",
  "El artículo 35": "Article 35",
  "El artículo 47": "Article 47",
  "El artículo 31, según la capacidad económica de cada uno. El 30 trata de la defensa y el 35 del trabajo.":
    "Article 31, according to each person's means. Article 30 deals with defence and 35 with work.",
  "¿Qué carácter no puede tener nunca el sistema tributario?": "What can the tax system never be?",
  "Progresivo": "Progressive",
  "Confiscatorio": "Confiscatory",
  "Igualitario": "Equal",
  "General": "General",
  "El artículo 31 exige que sea justo, igual y progresivo, y prohíbe expresamente que tenga alcance confiscatorio: la carga no puede vaciar el patrimonio de quien la soporta.":
    "Article 31 requires it to be fair, equal and progressive, and expressly forbids it from reaching as far as confiscation: the burden may not empty the estate of the person who bears it.",
  "¿Cuál es la regla principal de la nacionalidad española de origen?":
    "What is the main rule for Spanish nationality by origin?",
  "Nacer en territorio español": "Being born on Spanish soil",
  "Nacer de padre o madre españoles": "Being born to a Spanish father or mother",
  "Residir cinco años en España": "Living five years in Spain",
  "Estar inscrito en el padrón municipal": "Being entered in the padrón of the municipality",
  "Rige el criterio de la sangre: es español de origen quien nace de padre o madre españoles, nazca donde nazca. Nacer en España no basta por sí solo.":
    "The rule is one of blood: a person born to a Spanish father or mother is Spanish by origin, wherever they are born. Being born in Spain is not enough by itself.",
  "¿Puede privarse de la nacionalidad a un español de origen?":
    "Can a Spaniard by origin be deprived of their nationality?",
  "Sí, por sentencia judicial": "Yes, by a court judgment",
  "No: el artículo 11 lo prohíbe": "No: Article 11 forbids it",
  "Sí, si adquiere otra nacionalidad": "Yes, if they take another nationality",
  "Solo en tiempo de guerra": "Only in time of war",
  "El artículo 11 lo prohíbe expresamente. Quien la ha adquirido por residencia sí puede perderla en supuestos tasados, pero el español de origen no.":
    "Article 11 forbids it expressly. Someone who gained it by residence can lose it in listed cases, but a Spaniard by origin cannot.",
  "¿Con qué países permite la Constitución tratados de doble nacionalidad?":
    "With which countries does the Constitution allow treaties of dual nationality?",
  "Con ninguno": "With none",
  "Con los países iberoamericanos y aquellos con vinculación particular con España":
    "With the Ibero-American countries and those with a particular tie to Spain",
  "Solo con los Estados de la Unión Europea": "Only with the states of the European Union",
  "Con todos los países del mundo": "With every country in the world",
  "El artículo 11 los prevé para los países iberoamericanos y para los que hayan tenido o tengan una vinculación particular con España, como Andorra, Filipinas, Guinea Ecuatorial y Portugal.":
    "Article 11 provides for them with the Ibero-American countries and with those that have had or still have a particular tie to Spain, such as Andorra, the Philippines, Equatorial Guinea and Portugal.",
  "¿Qué plazo de residencia se exige a quien ha obtenido la condición de refugiado?":
    "What length of residence is required of someone granted refugee status?",
  "Cinco años. Es un plazo intermedio entre el general de diez y el de dos que corresponde a los países con vínculo histórico.":
    "Five years. It sits between the general ten and the two that apply to countries with a historic tie.",
  "¿Qué plazo se aplica a quien nació en territorio español pero no es español de origen?":
    "What term applies to someone born on Spanish soil who is not Spanish by origin?",
  "Un año, el plazo más corto, junto con supuestos como llevar un año casado con una persona española sin estar separado.":
    "One year, the shortest term, alongside cases such as a year of marriage to a Spanish person without being separated.",
  "¿Qué dos pruebas acreditan el suficiente grado de integración?":
    "Which two tests show a sufficient degree of integration?",
  "Un examen de historia y otro de geografía":
    "An examination in history and another in geography",
  "La prueba de lengua DELE A2 y la prueba CCSE": "The DELE A2 language test and the CCSE test",
  "Una entrevista en el ayuntamiento y un certificado de empadronamiento":
    "An interview at the town hall and a padrón certificate",
  "Un examen del Ministerio de Justicia y una prueba médica":
    "An examination from the ministry of justice and a medical test",
  "Las dos las administra el Instituto Cervantes: el DELE A2 examina la lengua y la CCSE los conocimientos constitucionales y socioculturales.":
    "The Instituto Cervantes runs both: the DELE A2 tests the language and the CCSE knowledge of the constitution and of society and culture.",
  "¿Quién está exento de la prueba de lengua DELE A2?":
    "Who is exempt from the DELE A2 language test?",
  "Los mayores de sesenta y cinco años": "People over sixty-five",
  "Quienes proceden de países donde el español es lengua oficial":
    "People from countries where Spanish is an official language",
  "Quienes llevan más de veinte años en España":
    "People who have been in Spain more than twenty years",
  "Nadie está exento": "Nobody is exempt",
  "La exención alcanza a los nacionales de países hispanohablantes, que sí deben realizar en cambio la prueba CCSE.":
    "The exemption covers nationals of Spanish-speaking countries, who must still sit the CCSE.",
  "¿A qué edad se alcanza la mayoría de edad en España?":
    "At what age do you come of age in Spain?",
  "A los dieciséis": "At sixteen",
  "A los dieciocho": "At eighteen",
  "A los veintiuno": "At twenty-one",
  "A los veinticinco": "At twenty-five",
  "A los dieciocho, y con ella llegan el derecho de voto y la plena capacidad de obrar.":
    "At eighteen, and with it come the right to vote and full legal capacity.",
  "¿A partir de qué edad es obligatorio tener el DNI?":
    "From what age is holding a DNI compulsory?",
  "A los siete": "At seven",
  "A los catorce": "At fourteen",
  "No es obligatorio": "It is not compulsory",
  "A partir de los catorce años, cuatro antes de la mayoría de edad. Puede solicitarse antes de forma voluntaria.":
    "From the age of fourteen, four years before coming of age. It can be applied for earlier by choice.",
  "¿Qué recoge el artículo 35 además del derecho al trabajo?":
    "What does Article 35 set out besides the right to work?",
  "El deber de trabajar": "The duty to work",
  "La jornada de cuarenta horas": "The forty-hour week",
  "El artículo 35 enuncia a la vez el deber y el derecho al trabajo, junto con la libre elección de profesión y una remuneración suficiente. La huelga está en el artículo 28.":
    "Article 35 states the duty and the right to work at once, along with the free choice of a profession and sufficient pay. The strike is in Article 28.",
  "¿Cuántos festivos del calendario laboral fija el ayuntamiento?":
    "How many holidays in the working calendar does the town hall set?",
  "Ninguno": "None",
  "Cuatro": "Four",
  "Seis": "Six",
  "Dos de los catorce son locales y los decide cada municipio, normalmente el día del patrón y la fiesta mayor. Por eso un festivo puede no serlo a treinta kilómetros.":
    "Two of the fourteen are local and each municipality decides them, usually the patron saint's day and the main festival. That is why a holiday may not be one thirty kilometres away.",
  "¿Qué día se celebra la fiesta de Cataluña?": "On what day is the feast of Catalonia held?",
  "El 23 de abril": "On 23 April",
  "El 25 de julio": "On 25 July",
  "El 11 de septiembre": "On 11 September",
  "El 9 de octubre": "On 9 October",
  "El 11 de septiembre, la Diada. El 25 de julio es Galicia, el 9 de octubre la Comunidad Valenciana y el 23 de abril Aragón y Castilla y León.":
    "11 September, the Diada. 25 July is Galicia, 9 October the Valencian Community, and 23 April Aragon and Castile and León.",
  "¿Qué día se celebra la fiesta de Galicia?": "On what day is the feast of Galicia held?",
  "El 28 de febrero": "On 28 February",
  "El 6 de diciembre": "On 6 December",
  "El 25 de julio, día de Santiago Apóstol, patrón de España y de Galicia.":
    "25 July, the day of Saint James the Apostle, patron of Spain and of Galicia.",
  "¿Qué día se celebra la fiesta de Andalucía?": "On what day is the feast of Andalusia held?",
  "El 2 de mayo": "On 2 May",
  "El 28 de febrero, aniversario del referéndum autonómico de 1980. El 2 de mayo es Madrid y el 23 de abril Aragón y Castilla y León.":
    "28 February, the anniversary of the autonomy referendum of 1980. 2 May is Madrid and 23 April Aragon and Castile and León.",
  "¿Qué día llegan tradicionalmente los regalos a los niños en España?":
    "On what day do presents traditionally reach the children in Spain?",
  "El 24 de diciembre": "On 24 December",
  "El 25 de diciembre": "On 25 December",
  "El 31 de diciembre": "On 31 December",
  "El 6 de enero": "On 6 January",
  "El 6 de enero, con los Reyes Magos, cuya cabalgata se celebra la tarde del día 5. En muchas casas conviven hoy ambas fechas, pero la de Reyes sigue siendo la principal.":
    "6 January, with the Three Kings, whose procession is held on the evening of the 5th. In many homes both dates now live side by side, but the Kings' day remains the main one.",
  "¿Qué día de Semana Santa es festivo en toda España?":
    "Which day of Holy Week is a holiday throughout Spain?",
  "El Domingo de Ramos": "Palm Sunday",
  "El Jueves Santo": "Maundy Thursday",
  "El Viernes Santo": "Good Friday",
  "El Lunes de Pascua": "Easter Monday",
  "El Viernes Santo lo es en todo el país. El Jueves Santo lo es en la mayoría de comunidades pero no en todas, y el Lunes de Pascua solo en algunas.":
    "Good Friday is one across the whole country. Maundy Thursday is in most communities but not in all, and Easter Monday only in some.",
  "¿Desde qué lugar se retransmiten las campanadas de Nochevieja?":
    "From where are the New Year's Eve chimes broadcast?",
  "Desde la Plaza Mayor de Madrid": "From the Plaza Mayor in Madrid",
  "Desde la Puerta del Sol de Madrid": "From the Puerta del Sol in Madrid",
  "Desde la Sagrada Familia de Barcelona": "From the Sagrada Família in Barcelona",
  "Desde la Giralda de Sevilla": "From the Giralda in Seville",
  "Desde el reloj de la Puerta del Sol. La retransmisión es uno de los programas de televisión más vistos del año en España.":
    "From the clock on the Puerta del Sol. The broadcast is one of the most watched television programmes of the year in Spain.",
  "¿En qué ciudad se celebran los San Fermines?": "In which city are the San Fermines held?",
  "En Bilbao": "In Bilbao",
  "En Zaragoza": "In Zaragoza",
  "En Logroño": "In Logroño",
  "En Pamplona, del 6 al 14 de julio, y los encierros de la mañana son su imagen más conocida fuera de España.":
    "In Pamplona, from 6 to 14 July, and the morning bull runs are the image of them best known outside Spain.",
  "¿En qué ciudad se celebra la Feria de Abril?": "In which city is the Feria de Abril held?",
  "En Málaga": "In Málaga",
  "En Córdoba": "In Córdoba",
  "En Granada": "In Granada",
  "En Sevilla, dos semanas después de Semana Santa, con casetas, caballos y trajes de flamenca.":
    "In Seville, two weeks after Holy Week, with marquees, horses and flamenco dresses.",
  "¿Qué son las chirigotas?": "What are the chirigotas?",
  "Los monumentos que se queman en las Fallas": "The monuments burnt at the Fallas",
  "Las agrupaciones que cantan con letras satíricas en el carnaval de Cádiz":
    "The groups that sing satirical verses at the carnival of Cádiz",
  "Los encierros de las fiestas de Pamplona": "The bull runs of the Pamplona festival",
  "Las casetas de la Feria de Abril": "The marquees of the Feria de Abril",
  "Son la seña de identidad del carnaval gaditano: coplas de humor y crítica que se preparan durante todo el año y compiten en el Gran Teatro Falla.":
    "They are the mark of the carnival of Cádiz: comic and critical songs prepared all year round that compete in the Gran Teatro Falla.",
  "¿Qué es hacer puente?": "What is hacer puente, making a bridge?",
  "Trabajar en festivo para librar otro día": "Working on a holiday to take another day off",
  "Librar el lunes o el viernes contiguo a un festivo que cae en martes o jueves":
    "Taking off the Monday or Friday next to a holiday that falls on a Tuesday or Thursday",
  "Cambiar un festivo local por uno nacional": "Swapping a local holiday for a national one",
  "Acumular las vacaciones al final del año": "Saving your holiday up for the end of the year",
  "Cuando el festivo cae en martes o jueves, muchos toman también el día que lo separa del fin de semana. Si coinciden dos festivos cercanos se habla, medio en broma, de acueducto.":
    "When the holiday falls on a Tuesday or a Thursday, many people also take the day that separates it from the weekend. If two holidays fall close together, people speak, half in jest, of an aqueduct.",
  "¿Cuándo se queman los monumentos de las Fallas?": "When are the Fallas monuments burnt?",
  "La noche del 19 de marzo": "On the night of 19 March",
  "La noche de San Juan, el 23 de junio": "On the night of San Juan, 23 June",
  "El 15 de agosto": "On 15 August",
  "El último día del carnaval": "On the last day of the carnival",
  "La noche del 19 de marzo, la cremà. Los monumentos se levantan durante días por toda la ciudad y arden todos la misma noche.":
    "On the night of 19 March, the cremà. The monuments go up over days all across the city and all burn on the same night.",
  "¿Puede una comunidad autónoma sustituir un festivo estatal por otro propio?":
    "Can an autonomous community replace a state holiday with one of its own?",
  "No, la lista estatal es idéntica en todo el país":
    "No; the state list is the same across the whole country",
  "Sí, dentro de los límites que fija la ley": "Yes, within the limits the law sets",
  "Solo las comunidades con lengua propia": "Only the communities with a language of their own",
  "Solo con autorización del Gobierno central": "Only with the central government's authorisation",
  "Las comunidades pueden sustituir algunos festivos estatales por fiestas propias, de modo que ni siquiera la lista del Estado se aplica igual en todas partes.":
    "The communities can replace some state holidays with festivals of their own, so that not even the state's list applies the same way everywhere.",
  "¿Qué cargo ocupa el rey en el Estado español?":
    "What office does the king hold in the Spanish state?",
  "Presidente del Gobierno": "Prime minister",
  "Jefe del Estado": "Head of state",
  "Presidente de las Cortes": "President of the Cortes",
  "Jefe de la Administración": "Head of the administration",
  "Jefe del Estado, símbolo de su unidad y permanencia. Quien dirige la política es el presidente del Gobierno, que es otro cargo y está en otro edificio.":
    "Head of state, the symbol of its unity and its permanence. The one who directs policy is the prime minister, a different office in a different building.",
  "¿Qué dos verbos emplea el artículo 56 para describir la función del rey?":
    "Which two verbs does Article 56 use to describe the king's role?",
  "Gobernar y administrar": "To govern and to administer",
  "Arbitrar y moderar": "To arbitrate and to moderate",
  "Legislar y sancionar": "To legislate and to assent",
  "Dirigir y coordinar": "To direct and to coordinate",
  "Arbitra y modera el funcionamiento regular de las instituciones. Ninguno de los dos verbos significa gobernar, y esa elección de palabras es deliberada.":
    "He arbitrates and moderates the regular working of the institutions. Neither verb means to govern, and the choice of words is deliberate.",
  "¿Quién puede refrendar el nombramiento del presidente del Gobierno?":
    "Who can countersign the appointment of the prime minister?",
  "El presidente del Congreso": "The president of the Congress",
  "El ministro de la Presidencia": "The minister of the presidency",
  "El presidente del Tribunal Supremo": "The president of the Supreme Court",
  "Nadie: ese acto no se refrenda": "Nobody: that act is not countersigned",
  "La propuesta y el nombramiento del presidente del Gobierno, y la disolución de las Cortes prevista en el artículo 99, los refrenda el presidente del Congreso. Los demás actos, el Gobierno.":
    "The president of the Congress countersigns the proposal and appointment of the prime minister, and the dissolution of the Cortes provided for in Article 99. The government countersigns the rest.",
  "¿Por qué la Constitución declara inviolable la persona del rey?":
    "Why does the Constitution declare the king's person inviolable?",
  "Porque su cargo es vitalicio": "Because his office is for life",
  "Porque todos sus actos los refrenda otro, que asume la responsabilidad":
    "Because somebody else countersigns all his acts and takes the responsibility",
  "Porque no interviene en ningún acto público": "Because he takes no part in any public act",
  "Porque lo protege un tratado internacional": "Because an international treaty protects him",
  "La irresponsabilidad del rey solo se sostiene sobre el refrendo: siempre hay alguien que firma con él y responde. Un acto sin refrendo carece de validez.":
    "The king's freedom from liability rests entirely on the countersignature: there is always someone who signs with him and answers for it. An act without a countersignature has no validity.",
  "¿En qué plazo debe el rey sancionar las leyes aprobadas por las Cortes?":
    "Within what time must the king assent to laws passed by the Cortes?",
  "En quince días": "Within fifteen days",
  "En un mes": "Within a month",
  "En tres meses": "Within three months",
  "No hay plazo": "There is no time limit",
  "Quince días para sancionar y promulgar. Es un acto debido: no puede negarse ni retrasarlo a voluntad.":
    "Fifteen days to assent and promulgate. It is a duty: he cannot refuse or delay it at will.",
  "¿Qué tipo de indultos prohíbe la ley española?":
    "Which kind of pardon does Spanish law forbid?",
  "Los indultos generales": "General pardons",
  "Los indultos a extranjeros": "Pardons for foreigners",
  "Los indultos por delitos económicos": "Pardons for economic crimes",
  "El rey ejerce el derecho de gracia con arreglo a la ley, y esa ley prohíbe los indultos generales. Los individuales sí son posibles, a propuesta del Gobierno.":
    "The king exercises the right of pardon in accordance with the law, and that law forbids general pardons. Individual ones are possible, on the Government's proposal.",
  "¿Qué criterio de sucesión establece todavía el artículo 57?":
    "Which rule of succession does Article 57 still lay down?",
  "Igualdad absoluta entre hombres y mujeres": "Complete equality between men and women",
  "Preferencia del varón sobre la mujer en el mismo grado":
    "Preference for the male over the female in the same degree",
  "Elección por las Cortes entre los descendientes":
    "A choice by the Cortes among the descendants",
  "Preferencia del hijo mayor sin distinción de sexo":
    "Preference for the eldest child regardless of sex",
  "Es la única preferencia por razón de sexo que queda en el texto. Cambiarla exigiría el procedimiento agravado del artículo 168, con disolución de las Cortes y referéndum.":
    "It is the only preference by reason of sex left in the text. Changing it would need the heavier procedure of Article 168, with the Cortes dissolved and a referendum.",
  "¿En qué año fue proclamado rey Juan Carlos I?":
    "In which year was Juan Carlos I proclaimed king?",
  "En 1969": "In 1969",
  "En 1981": "In 1981",
  "En 1975, dos días después de la muerte de Franco. La Constitución llegaría tres años más tarde, en 1978.":
    "In 1975, two days after Franco's death. The Constitution would come three years later, in 1978.",
  "¿En qué año fue proclamado Felipe VI?": "In which year was Felipe VI proclaimed?",
  "En 2004": "In 2004",
  "En 2011": "In 2011",
  "En 2014": "In 2014",
  "En 2018": "In 2018",
  "El 19 de junio de 2014, tras la abdicación de su padre. La proclamación se celebró ante las Cortes Generales.":
    "On 19 June 2014, after his father's abdication. The proclamation took place before the Cortes Generales.",
  "¿Cuál es la residencia habitual de la familia real?":
    "Where does the royal family usually live?",
  "El Palacio Real": "The Palacio Real",
  "El Palacio de la Zarzuela": "The Palacio de la Zarzuela",
  "El Palacio de la Moncloa": "The Palacio de la Moncloa",
  "El Palacio de las Cortes": "The Palacio de las Cortes",
  "La Zarzuela es la residencia; el Palacio Real se reserva para actos oficiales. La Moncloa es del presidente del Gobierno.":
    "The Zarzuela is the residence; the Palacio Real is kept for official occasions. The Moncloa belongs to the prime minister.",
  "¿Qué hace el rey al ser proclamado ante las Cortes?":
    "What does the king do when he is proclaimed before the Cortes?",
  "Presenta un programa de gobierno": "He presents a programme of government",
  "Presta juramento de guardar y hacer guardar la Constitución":
    "He swears to keep the Constitution and to have it kept",
  "Firma un pacto con los partidos": "He signs a pact with the parties",
  "Nombra al presidente del Gobierno": "He appoints the prime minister",
  "Jura o promete guardar y hacer guardar la Constitución y las leyes, y respetar los derechos de los ciudadanos y de las comunidades autónomas.":
    "He swears or promises to keep the Constitution and the laws and to have them kept, and to respect the rights of the citizens and of the autonomous communities.",
  "¿Quién tiene el mando supremo de las Fuerzas Armadas?":
    "Who holds supreme command of the armed forces?",
  "El ministro de Defensa": "The minister of defence",
  "El jefe del Estado Mayor": "The chief of the general staff",
  "El artículo 62 se lo atribuye al rey. La dirección efectiva de la defensa corresponde al Gobierno, según el artículo 97: el mando es simbólico y la política es del ejecutivo.":
    "Article 62 gives it to the king. The actual direction of defence belongs to the Government, under Article 97: the command is symbolic and the policy is the executive's.",
  "¿Qué ocurre con un acto del rey que no lleva refrendo?":
    "What happens to an act of the king that carries no countersignature?",
  "Es válido pero recurrible": "It is valid but open to challenge",
  "Carece de validez": "It has no validity",
  "Debe ratificarlo el Congreso": "The Congress must ratify it",
  "Lo asume el Consejo de Ministros": "The Council of Ministers takes it on",
  "Sin refrendo el acto no vale. Es la pieza que hace compatibles un jefe del Estado irresponsable y un sistema en el que todo acto tiene un responsable.":
    "Without a countersignature the act is worth nothing. It is the piece that makes a head of state free from liability compatible with a system in which every act has someone answerable for it.",
  "¿Entre qué cifras permite la Constitución fijar el número de diputados?":
    "Between what figures does the Constitution allow the number of members to be set?",
  "Entre 200 y 300": "Between 200 and 300",
  "Entre 300 y 400": "Between 300 and 400",
  "Entre 250 y 350": "Between 250 and 350",
  "No fija ninguna horquilla": "It sets no range at all",
  "Entre trescientos y cuatrocientos. La ley electoral ha elegido siempre trescientos cincuenta, pero podría moverse dentro de ese margen sin reformar la Constitución.":
    "Between three hundred and four hundred. The electoral law has always chosen three hundred and fifty, but it could move within that margin without amending the Constitution.",
  "¿Cuál es la circunscripción electoral en las elecciones al Congreso?":
    "What is the constituency in elections to the Congress?",
  "La comunidad autónoma": "The autonomous community",
  "La provincia": "The province",
  "El municipio": "The municipality",
  "Toda España como circunscripción única": "The whole of Spain as one constituency",
  "La provincia, más Ceuta y Melilla con un diputado cada una. La circunscripción única solo se usa en las elecciones europeas.":
    "The province, plus Ceuta and Melilla with one member each. The single constituency is used only in European elections.",
  "¿Qué mecanismo da a las provincias pequeñas más peso relativo?":
    "Which mechanism gives the small provinces more relative weight?",
  "El sistema D'Hondt": "The D'Hondt system",
  "El mínimo inicial de dos escaños por provincia": "The starting minimum of two seats a province",
  "El umbral del tres por ciento": "The three per cent threshold",
  "Las listas cerradas": "The closed lists",
  "Cada provincia parte de dos escaños antes de repartir el resto por población. Es un efecto distinto del que produce el D'Hondt, y suele atribuirse por error a este último.":
    "Each province starts with two seats before the rest are shared out by population. It is a different effect from the one D'Hondt produces, and is often wrongly put down to it.",
  "¿Qué umbral debe superar una lista para obtener escaño?":
    "What threshold must a list pass to win a seat?",
  "El uno por ciento nacional": "One per cent nationally",
  "El tres por ciento de los votos válidos de su circunscripción":
    "Three per cent of the valid votes in its constituency",
  "El cinco por ciento nacional": "Five per cent nationally",
  "No hay umbral": "There is no threshold",
  "El tres por ciento, y se calcula por circunscripción, no en el conjunto del país. En provincias pequeñas el umbral efectivo es en la práctica mucho más alto.":
    "Three per cent, and it is worked out constituency by constituency, not across the country as a whole. In small provinces the effective threshold is in practice much higher.",
  "¿Qué significa que las listas sean cerradas y bloqueadas?":
    "What does it mean that the lists are closed and blocked?",
  "Que solo pueden presentarlas los partidos con representación":
    "That only parties that already hold seats can put them forward",
  "Que se vota la candidatura entera en el orden fijado por el partido":
    "That you vote for the whole list in the order the party set",
  "Que no se publican hasta el día de la votación":
    "That they are not published until polling day",
  "Que no admiten candidatos independientes": "That they take no independent candidates",
  "Cerrada significa que no se pueden mezclar candidatos de listas distintas; bloqueada, que no se puede alterar el orden. El votante elige un partido, no personas.":
    "Closed means that candidates from different lists cannot be mixed; blocked, that the order cannot be changed. The voter chooses a party, not people.",
  "¿Cuántos senadores elige directamente cada provincia peninsular?":
    "How many senators does each mainland province elect directly?",
  "Depende de su población": "It depends on its population",
  "Cuatro por provincia peninsular, con independencia de la población. Las islas y las ciudades autónomas siguen reglas propias, y a todos ellos se suman los designados por las comunidades.":
    "Four for each mainland province, whatever its population. The islands and the autonomous cities follow rules of their own, and to all of them are added the ones the communities designate.",
  "¿Cómo designan las comunidades autónomas a sus senadores?":
    "How do the autonomous communities designate their senators?",
  "Uno por comunidad y otro más por cada millón de habitantes":
    "One for each community and one more for every million inhabitants",
  "Cuatro por comunidad": "Four for each community",
  "Uno por provincia": "One for each province",
  "En proporción a los escaños de su parlamento": "In proportion to the seats in its parliament",
  "Uno fijo por comunidad y otro adicional por cada millón de habitantes, designados por su asamblea legislativa. Es la vía territorial del Senado, junto a la provincial.":
    "One fixed for each community and one more for every million inhabitants, designated by its legislative assembly. It is the Senate's territorial route, alongside the provincial one.",
  "¿Cuánto dura una legislatura?": "How long does a parliamentary term last?",
  "Seis años": "Six years",
  "Cuatro años, salvo disolución anticipada, que en España ha sido frecuente: pocas legislaturas han llegado completas a su término.":
    "Four years, unless it is dissolved early, which in Spain has been common: few terms have run their full length.",
  "¿Cuánto tiempo debe pasar para que el Congreso levante un veto del Senado por mayoría simple?":
    "How much time must pass before the Congress can lift a Senate veto by a simple majority?",
  "Quince días": "Fifteen days",
  "Un mes": "One month",
  "Dos meses": "Two months",
  "Seis meses": "Six months",
  "Dos meses. Antes de ese plazo también puede levantarlo, pero necesita mayoría absoluta: el tiempo rebaja la exigencia.":
    "Two months. It can lift it before that as well, but then it needs an absolute majority: time lowers the bar.",
  "¿Qué es la Diputación Permanente?":
    "What is the Diputación Permanente, the Standing Deputation?",
  "El grupo que vela por los poderes de la cámara cuando está disuelta o fuera de sesiones":
    "The body that safeguards the chamber's powers when it is dissolved or out of session",
  "La comisión que redacta los presupuestos": "The committee that drafts the budget",
  "El órgano que dirige los debates": "The body that chairs the debates",
  "El conjunto de diputados con más antigüedad": "The longest-serving deputies taken together",
  "Cada cámara tiene la suya, presidida por su presidente. Es lo que impide que el Parlamento desaparezca del todo entre una disolución y las siguientes elecciones.":
    "Each chamber has its own, chaired by its president. It is what keeps Parliament from disappearing altogether between a dissolution and the next election.",
  "¿Qué tres funciones atribuye el artículo 66 a las Cortes Generales?":
    "Which three functions does Article 66 give the Cortes Generales?",
  "Legislar, aprobar los presupuestos y controlar al Gobierno":
    "To legislate, to approve the budget and to scrutinise the Government",
  "Legislar, juzgar y gobernar": "To legislate, to judge and to govern",
  "Elegir al rey, legislar y nombrar jueces":
    "To elect the king, to legislate and to appoint judges",
  "Aprobar tratados, indultar y recaudar": "To approve treaties, to pardon and to collect taxes",
  "Potestad legislativa, presupuestos y control de la acción del Gobierno. Juzgar corresponde al poder judicial y gobernar al ejecutivo.":
    "Legislative power, the budget and scrutiny of the Government's action. Judging belongs to the judiciary and governing to the executive.",
  "¿Cuántos diputados eligen Ceuta y Melilla?": "How many deputies do Ceuta and Melilla elect?",
  "Uno cada una": "One each",
  "Dos cada una": "Two each",
  "Cuatro cada una": "Four each",
  "Un diputado cada una. Son circunscripciones propias, distintas de las provincias, y también eligen senadores con reglas específicas.":
    "One deputy each. They are constituencies in their own right, separate from the provinces, and they elect senators too under rules of their own.",
  "¿Por qué se dice que el bicameralismo español es imperfecto?":
    "Why is Spanish bicameralism called imperfect?",
  "Porque el Senado tiene menos miembros": "Because the Senate has fewer members",
  "Porque las dos cámaras no tienen el mismo peso y el Congreso decide en última instancia":
    "Because the two chambers do not weigh the same and the Congress decides in the last resort",
  "Porque el Senado no se elige por sufragio": "Because the Senate is not chosen by suffrage",
  "Porque solo una de las dos aprueba los presupuestos":
    "Because only one of the two approves the budget",
  "El Congreso inviste al presidente, puede derribarlo y levanta los vetos del Senado. Imperfecto es aquí un término técnico, no un juicio de valor.":
    "The Congress invests the prime minister, can bring them down and lifts the Senate's vetoes. Imperfect is a technical term here, not a judgement.",
  "¿Quiénes componen el Gobierno?": "Who makes up the Government?",
  "El presidente, los vicepresidentes y los ministros":
    "The prime minister, the deputy prime ministers and the ministers",
  "El rey y los ministros": "The king and the ministers",
  "Los diputados del partido más votado": "The deputies of the party with the most votes",
  "El presidente y los presidentes autonómicos": "The prime minister and the regional presidents",
  "Presidente, vicepresidentes en su caso y ministros, que reunidos forman el Consejo de Ministros. El rey no forma parte del Gobierno.":
    "The prime minister, the deputy prime ministers where there are any, and the ministers, who together form the Council of Ministers. The king is not part of the Government.",
  "¿Qué artículo define las funciones del Gobierno?":
    "Which article sets out the Government's functions?",
  "El artículo 66": "Article 66",
  "El artículo 97": "Article 97",
  "El artículo 99": "Article 99",
  "El artículo 117": "Article 117",
  "El 97: política interior y exterior, Administración civil y militar, defensa, función ejecutiva y potestad reglamentaria. El 99 regula la investidura.":
    "Article 97: domestic and foreign policy, the civil and military administration, defence, the executive function and the regulatory power. Article 99 governs the investiture.",
  "¿Qué hace el rey antes de proponer un candidato a la presidencia?":
    "What does the king do before proposing a candidate for prime minister?",
  "Consultar a los representantes designados por los grupos políticos":
    "He consults the representatives designated by the political groups",
  "Consultar al Tribunal Constitucional": "He consults the Constitutional Court",
  "Convocar un referéndum": "He calls a referendum",
  "Nombrar un gobierno provisional": "He appoints a provisional government",
  "Las consultas son una ronda de reuniones con los grupos con representación, y sirven para saber quién puede reunir una mayoría antes de proponer un nombre.":
    "The consultations are a round of meetings with the groups that hold seats, and they serve to find out who can gather a majority before a name is put forward.",
  "¿Qué ocurre si en dos meses nadie logra ser investido presidente?":
    "What happens if in two months nobody manages to be invested as prime minister?",
  "Gobierna el partido más votado": "The party with the most votes governs",
  "El rey disuelve las Cortes y se convocan nuevas elecciones":
    "The king dissolves the Cortes and a new election is called",
  "Decide el Senado": "The Senate decides",
  "Se prorroga el gobierno anterior cuatro años":
    "The previous government carries on for four years",
  "El plazo corre desde la primera votación de investidura. España ha llegado a repetir elecciones por esta vía en más de una ocasión.":
    "The clock runs from the first investiture vote. Spain has ended up repeating an election this way on more than one occasion.",
  "¿Qué mayoría basta en la segunda votación de investidura?":
    "What majority is enough in the second investiture vote?",
  "La misma que en la primera": "The same as in the first",
  "Mayoría simple: más votos a favor que en contra. Se celebra cuarenta y ocho horas después de la primera, en la que se exigía mayoría absoluta.":
    "A simple majority: more votes in favour than against. It is held forty-eight hours after the first, where an absolute majority was required.",
  "¿Qué fracción de los diputados debe firmar una moción de censura?":
    "What fraction of the deputies must sign a motion of censure?",
  "Una décima parte": "A tenth",
  "Una cuarta parte": "A quarter",
  "Un tercio": "A third",
  "La mayoría absoluta": "An absolute majority",
  "Una décima parte del Congreso para presentarla. Para que prospere hace falta después la mayoría absoluta de la cámara.":
    "A tenth of the Congress to table it. For it to succeed an absolute majority of the chamber is needed afterwards.",
  "¿Cuántas veces ha prosperado una moción de censura desde 1978?":
    "How many times has a motion of censure succeeded since 1978?",
  "Una": "Once",
  "Una sola, en 2018. El carácter constructivo lo explica: es fácil reunir votos contra alguien y difícil reunirlos a favor de un sustituto concreto.":
    "Only once, in 2018. Its constructive character explains that: it is easy to gather votes against somebody and hard to gather them for one particular replacement.",
  "¿Qué mayoría exige una cuestión de confianza?":
    "What majority does a question of confidence require?",
  "Mayoría simple, a diferencia de la moción de censura, que exige mayoría absoluta. La plantea el propio presidente y perderla le obliga a dimitir.":
    "A simple majority, unlike the motion of censure, which requires an absolute one. The prime minister puts it themselves, and losing it means resigning.",
  "¿Cuándo NO puede el presidente disolver las Cortes?":
    "When can the prime minister NOT dissolve the Cortes?",
  "En el primer año de legislatura": "In the first year of the term",
  "Mientras esté en trámite una moción de censura": "While a motion of censure is under way",
  "Durante el periodo de sesiones": "During the sitting period",
  "En año electoral europeo": "In a European election year",
  "Ni con una moción de censura en trámite, ni antes de que haya pasado un año desde la disolución anterior. Las dos limitaciones están en el artículo 115.":
    "Neither with a motion of censure under way, nor before a year has passed since the previous dissolution. Both limits are in Article 115.",
  "¿Qué es la potestad reglamentaria?": "What is the regulatory power?",
  "La facultad del Gobierno de dictar normas de rango inferior a la ley":
    "The Government's power to issue rules ranking below a law",
  "El derecho del Gobierno a vetar leyes": "The Government's right to veto laws",
  "La capacidad de convocar referendos": "The power to call referendums",
  "El poder de nombrar jueces": "The power to appoint judges",
  "Los reglamentos desarrollan y aplican las leyes sin poder contradecirlas. Es una de las funciones que el artículo 97 atribuye al Gobierno.":
    "Regulations develop and apply the laws without being able to contradict them. It is one of the functions Article 97 gives the Government.",
  "¿Cómo se llama el órgano colegiado que forman el presidente y los ministros?":
    "What is the collegiate body formed by the prime minister and the ministers called?",
  "El Consejo de Estado": "The Council of State",
  "El Consejo de Ministros": "The Council of Ministers",
  "El Consejo General": "The General Council",
  "La Junta de Gobierno": "The governing board",
  "El Consejo de Ministros. El Consejo de Estado es otra cosa: el supremo órgano consultivo del Gobierno.":
    "The Council of Ministers. The Council of State is something else: the Government's supreme advisory body.",
  "¿Cuántos días deben pasar entre la presentación de una moción de censura y su votación?":
    "How many days must pass between the tabling of a motion of censure and the vote on it?",
  "Cinco días, y en los dos primeros pueden presentarse mociones alternativas. El plazo da tiempo a negociar y a que aparezcan otros candidatos.":
    "Five days, and in the first two alternative motions may be tabled. The interval gives time to negotiate and for other candidates to appear.",
  "¿Qué le ocurre al candidato incluido en una moción de censura que prospera?":
    "What happens to the candidate named in a motion of censure that succeeds?",
  "Debe someterse después a una investidura ordinaria":
    "They must go through an ordinary investiture afterwards",
  "Queda automáticamente investido presidente":
    "They are automatically invested as prime minister",
  "Asume solo de forma interina hasta las elecciones":
    "They take over only on a caretaker basis until the election",
  "Debe ser ratificado por el Senado": "The Senate must ratify them",
  "La moción constructiva inviste y destituye en el mismo acto. Por eso no puede presentarse sin candidato: no serviría para nada dejar el país sin gobierno.":
    "The constructive motion invests and removes in one act. That is why it cannot be tabled without a candidate: leaving the country with no government would serve no purpose.",
  "¿En nombre de quién se administra la justicia en España?":
    "In whose name is justice administered in Spain?",
  "Del pueblo": "Of the people",
  "Del rey": "Of the king",
  "Del Estado": "Of the State",
  "De las Cortes": "Of the Cortes",
  "El artículo 117 dice que la justicia emana del pueblo y se administra en nombre del rey. Las dos mitades de la frase van juntas y suelen citarse a medias.":
    "Article 117 says that justice emanates from the people and is administered in the king's name. The two halves of the sentence belong together and are usually quoted one at a time.",
  "¿Cómo se accede a la carrera judicial?": "How do you enter the judicial career?",
  "Por nombramiento del Gobierno": "By appointment by the Government",
  "Por oposición": "By competitive examination",
  "Por elección popular": "By popular election",
  "Por designación del CGPJ": "By designation by the CGPJ",
  "Por oposición, un examen público y competitivo. Es lo que mantiene el acceso fuera del alcance de la política, aunque el gobierno de la carrera lo lleve el CGPJ.":
    "By competitive examination, a public contest open to all. It is what keeps entry out of the reach of politics, even though the CGPJ governs the career itself.",
  "¿Cuántos vocales tiene el Consejo General del Poder Judicial?":
    "How many members does the General Council of the Judiciary have?",
  "Veinticinco": "Twenty-five",
  "Veinte vocales más su presidente, que lo es también del Tribunal Supremo, con mandato de cinco años. Doce son los magistrados del Tribunal Constitucional.":
    "Twenty members plus its president, who is also president of the Supreme Court, with a five-year term. Twelve is the number of justices of the Constitutional Court.",
  "¿Cuáles son los cuatro órdenes jurisdiccionales?": "What are the four orders of jurisdiction?",
  "Civil, penal, contencioso-administrativo y social":
    "Civil, criminal, administrative and social",
  "Civil, penal, militar y mercantil": "Civil, criminal, military and commercial",
  "Constitucional, civil, penal y laboral": "Constitutional, civil, criminal and employment",
  "Ordinario, especial, foral y autonómico": "Ordinary, special, foral and regional",
  "El contencioso-administrativo resuelve los pleitos con la Administración y el social los laborales. La jurisdicción militar existe, pero no es uno de los cuatro órdenes ordinarios.":
    "The administrative order settles disputes with the administration and the social order employment cases. Military jurisdiction exists, but it is not one of the four ordinary orders.",
  "¿Qué tribunal tiene competencia en toda España sobre delitos como el terrorismo?":
    "Which court has jurisdiction across the whole of Spain over offences such as terrorism?",
  "La Audiencia Nacional": "The Audiencia Nacional",
  "Las Audiencias Provinciales": "The Audiencias Provinciales",
  "La Audiencia Nacional, con sede en Madrid y jurisdicción en todo el territorio para materias tasadas: terrorismo, delitos económicos de gran alcance, extradiciones.":
    "The Audiencia Nacional, seated in Madrid and with jurisdiction over the whole territory for a fixed list of matters: terrorism, large-scale economic crime, extraditions.",
  "¿Cuántos Tribunales Superiores de Justicia hay?": "How many High Courts of Justice are there?",
  "Uno por comunidad autónoma": "One for each autonomous community",
  "Cuatro, uno por orden jurisdiccional": "Four, one for each order of jurisdiction",
  "Uno por comunidad autónoma. Culminan la organización judicial en su territorio, pero no están por encima del Tribunal Supremo.":
    "One for each autonomous community. They top the judicial organisation in their territory, but they are not above the Supreme Court.",
  "¿Quién nombra al fiscal general del Estado?": "Who appoints the State Attorney General?",
  "El rey, a propuesta del Gobierno, oído el CGPJ":
    "The king, on the Government's proposal, after hearing the CGPJ",
  "El Congreso por tres quintos": "The Congress by three fifths",
  "El propio Ministerio Fiscal": "The Public Prosecution Service itself",
  "Lo nombra el rey a propuesta del Gobierno, oído el Consejo General del Poder Judicial. Esa dependencia del ejecutivo es objeto de debate recurrente.":
    "The king appoints them on the Government's proposal, after hearing the General Council of the Judiciary. That dependence on the executive is a recurring subject of debate.",
  "¿Cuántos magistrados del Tribunal Constitucional propone el Congreso?":
    "How many Constitutional Court justices does the Congress propose?",
  "Ocho": "Eight",
  "Cuatro, por mayoría de tres quintos. Otros cuatro los propone el Senado, dos el Gobierno y dos el Consejo General del Poder Judicial.":
    "Four, by a three-fifths majority. Another four are proposed by the Senate, two by the Government and two by the General Council of the Judiciary.",
  "¿Cuánto dura el mandato de un magistrado del Tribunal Constitucional?":
    "How long is a Constitutional Court justice's term?",
  "Nueve años": "Nine years",
  "Doce años": "Twelve years",
  "Nueve años, y el tribunal se renueva por terceras partes cada tres, de modo que nunca cambia entero de una vez.":
    "Nine years, and the court is renewed by thirds every three, so that it never changes entirely at once.",
  "¿Cada cuánto se renueva por terceras partes el Tribunal Constitucional?":
    "How often is the Constitutional Court renewed by thirds?",
  "Cada año": "Every year",
  "Cada tres años": "Every three years",
  "Cada cinco años": "Every five years",
  "Cada nueve años": "Every nine years",
  "Cada tres años se renueva un tercio. El escalonamiento evita que una sola mayoría parlamentaria componga el tribunal entero.":
    "A third is renewed every three years. The staggering keeps a single parliamentary majority from making up the whole court.",
  "¿Cuál de estas NO es competencia del Tribunal Constitucional?":
    "Which of these is NOT a power of the Constitutional Court?",
  "El recurso de inconstitucionalidad": "The appeal of unconstitutionality",
  "El recurso de amparo": "The amparo appeal",
  "Los conflictos de competencia entre el Estado y las comunidades":
    "Conflicts of competence between the State and the communities",
  "El recurso de casación penal": "The criminal appeal in cassation",
  "La casación es del Tribunal Supremo, que culmina la jurisdicción ordinaria. El Constitucional juzga leyes, derechos fundamentales y repartos de competencia.":
    "Cassation belongs to the Supreme Court, which tops the ordinary jurisdiction. The Constitutional Court judges laws, fundamental rights and the sharing-out of competences.",
  "¿Qué orden jurisdiccional resuelve los pleitos con la Administración?":
    "Which order of jurisdiction settles disputes with the administration?",
  "El civil": "The civil one",
  "El penal": "The criminal one",
  "El contencioso-administrativo": "The administrative one",
  "El social": "The social one",
  "El contencioso-administrativo. El social ve los conflictos laborales y de Seguridad Social, y el civil los de particulares entre sí.":
    "The administrative one. The social order hears employment and Seguridad Social disputes, and the civil order those between private parties.",
  "¿Qué prevé el artículo 125 sobre la participación ciudadana en la justicia?":
    "What does Article 125 provide for on citizens taking part in justice?",
  "El tribunal del jurado": "The jury court",
  "La elección popular de los jueces": "The popular election of judges",
  "El referéndum sobre sentencias": "A referendum on judgments",
  "La mediación obligatoria": "Compulsory mediation",
  "El artículo 125 abre la puerta a la acción popular y al jurado, que juzga determinados delitos. Los jueces profesionales no se eligen: se accede por oposición.":
    "Article 125 opens the door to the popular action and to the jury, which tries certain offences. Professional judges are not elected: entry is by competitive examination.",
  "¿Desde qué edad se puede votar en España?": "From what age can you vote in Spain?",
  "Desde los dieciséis": "From sixteen",
  "Desde los dieciocho": "From eighteen",
  "Desde los veintiuno": "From twenty-one",
  "Desde los veinticinco": "From twenty-five",
  "Desde los dieciocho, que es también la mayoría de edad. El sufragio es universal, libre, igual, directo y secreto.":
    "From eighteen, which is also the age of majority. Suffrage is universal, free, equal, direct and secret.",
  "¿Qué circunscripción se emplea en las elecciones europeas?":
    "Which constituency is used in European elections?",
  "Circunscripción única para todo el país, a diferencia de las generales, que se reparten por provincias.":
    "A single constituency for the whole country, unlike the general election, which is shared out by provinces.",
  "Si ningún candidato reúne la mayoría absoluta de los concejales, ¿quién resulta elegido alcalde?":
    "If no candidate gathers an absolute majority of the councillors, who is elected mayor?",
  "Se repiten las elecciones": "The election is held again",
  "El cabeza de la lista más votada": "The head of the most-voted list",
  "El concejal de más edad": "The oldest councillor",
  "Decide el pleno por sorteo": "The full council decides by lot",
  "La ley prevé esa salida automática para que ningún ayuntamiento quede sin alcalde. Es la razón de que gobiernen a veces listas que no tienen mayoría en el pleno.":
    "The law provides that automatic way out so that no town hall is left without a mayor. It is why lists that have no majority on the council sometimes govern.",
  "¿Qué exige el artículo 6 a los partidos políticos?":
    "What does Article 6 require of political parties?",
  "Que tengan sede en Madrid": "That they have their seat in Madrid",
  "Que su estructura interna y su funcionamiento sean democráticos":
    "That their internal structure and their working be democratic",
  "Que presenten candidatos en todas las provincias":
    "That they put up candidates in every province",
  "Que se financien solo con cuotas": "That they be funded from membership fees alone",
  "El mismo requisito que el artículo 7 impone a sindicatos y asociaciones empresariales. Es una exigencia poco frecuente en el derecho comparado.":
    "The same requirement Article 7 imposes on trade unions and employers' associations. It is an uncommon demand in comparative law.",
  "¿Cuáles son los dos sindicatos mayoritarios en España?":
    "Which are the two largest trade unions in Spain?",
  "Comisiones Obreras y la Unión General de Trabajadores":
    "Comisiones Obreras and the Unión General de Trabajadores",
  "La CNT y la UGT": "The CNT and the UGT",
  "USO y CSIF": "USO and CSIF",
  "ELA y LAB": "ELA and LAB",
  "CCOO y UGT. Los convenios que negocian se aplican a todo el sector y no solo a sus afiliados, lo que explica que su peso sea mayor que su afiliación.":
    "CCOO and UGT. The agreements they negotiate apply to a whole sector and not only to their members, which is why they weigh more than their membership does.",
  "¿Qué materias quedan excluidas de la iniciativa legislativa popular?":
    "Which matters are excluded from the popular legislative initiative?",
  "Los tributos, lo internacional, el derecho de gracia y las leyes orgánicas":
    "Taxes, international matters, the right of pardon and organic laws",
  "Solo la reforma constitucional": "Only constitutional amendment",
  "Todo lo que afecte a las comunidades autónomas":
    "Anything affecting the autonomous communities",
  "La exclusión es amplia y limita bastante el alcance del instrumento: quedan fuera precisamente algunas de las materias sobre las que más se pediría legislar.":
    "The exclusion is wide and limits the instrument's reach a good deal: it leaves out precisely some of the matters people would most ask for laws on.",
  "¿De quién depende el Defensor del Pueblo?": "Whom does the Ombudsman answer to?",
  "Del Gobierno": "The Government",
  "De las Cortes Generales": "The Cortes Generales",
  "Del Tribunal Constitucional": "The Constitutional Court",
  "Del Consejo General del Poder Judicial": "The General Council of the Judiciary",
  "Es alto comisionado de las Cortes Generales, no del Gobierno. Esa dependencia parlamentaria es lo que le permite supervisar a la Administración.":
    "They are the high commissioner of the Cortes Generales, not of the Government. That parliamentary footing is what lets them supervise the administration.",
  "¿Son ejecutivas las resoluciones del Defensor del Pueblo?":
    "Are the Ombudsman's rulings enforceable?",
  "Sí, obligan a la Administración": "Yes; they bind the administration",
  "No: recomienda y da publicidad, y puede recurrir leyes ante el Tribunal Constitucional":
    "No: they recommend and make things public, and can challenge laws before the Constitutional Court",
  "Sí, si las ratifica el Congreso": "Yes, if the Congress ratifies them",
  "Solo en materia de extranjería": "Only in immigration matters",
  "Su fuerza es la del informe público y la del recurso. No anula actos ni impone sanciones: para eso están los tribunales.":
    "Their strength is that of the public report and of the appeal. They annul no acts and impose no penalties: the courts are there for that.",
  "¿Qué organismo fiscaliza las cuentas del Estado y del sector público?":
    "Which body audits the accounts of the State and the public sector?",
  "El Tribunal de Cuentas": "The Court of Auditors",
  "El Banco de España": "The Bank of Spain",
  "La Agencia Tributaria": "The Tax Agency",
  "El Tribunal de Cuentas, previsto en el artículo 136 y dependiente también de las Cortes. La Agencia Tributaria recauda, que es otra función.":
    "The Court of Auditors, provided for in Article 136 and likewise answerable to the Cortes. The Tax Agency collects, which is another job.",
  "¿Quién convoca un referéndum consultivo?": "Who calls a consultative referendum?",
  "El rey, a propuesta del presidente autorizada por el Congreso":
    "The king, on the prime minister's proposal authorised by the Congress",
  "El Congreso por sí solo": "The Congress on its own",
  "El Gobierno por decreto": "The Government by decree",
  "Las comunidades autónomas en su territorio": "The autonomous communities in their territory",
  "Los tres pasos del artículo 92 son sucesivos: propone el presidente, autoriza el Congreso, convoca el rey. Y su resultado es consultivo, no vinculante en sentido jurídico.":
    "The three steps of Article 92 come one after another: the prime minister proposes, the Congress authorises, the king calls it. And its result is consultative, not binding in law.",
  "¿Qué se vota en unas elecciones municipales?": "What do you vote for in local elections?",
  "El alcalde": "The mayor",
  "Los concejales": "The councillors",
  "El presidente de la diputación": "The president of the provincial council",
  "Una lista de concejales. El alcalde lo elige después el pleno, y el presidente de la diputación provincial sale de entre los concejales electos.":
    "A list of councillors. The mayor is elected afterwards by the full council, and the president of the provincial council comes from among the elected councillors.",
  "¿Qué permite el derecho de petición del artículo 29?":
    "What does the right of petition in Article 29 allow?",
  "Dirigirse por escrito a los poderes públicos": "Addressing the public authorities in writing",
  "Exigir una respuesta favorable de la Administración":
    "Demanding a favourable answer from the administration",
  "Convocar una manifestación": "Calling a demonstration",
  "Recurrir una ley ante el Tribunal Constitucional":
    "Challenging a law before the Constitutional Court",
  "Es un derecho antiguo, sencillo y poco utilizado: permite dirigirse por escrito, individual o colectivamente, sin garantizar el contenido de la respuesta.":
    "It is an old, simple and little-used right: it lets you write in, alone or together with others, without any guarantee of what the answer will say.",
  "¿Cómo se elige al presidente de una comunidad autónoma?":
    "How is the president of an autonomous community chosen?",
  "Directamente por los ciudadanos": "Directly by the citizens",
  "Por el parlamento autonómico, que lo inviste": "By the regional parliament, which invests them",
  "Por el Gobierno central": "By the central government",
  "Por los alcaldes de la comunidad": "By the mayors of the community",
  "Igual que el presidente del Gobierno en las generales: se vota una cámara y la cámara inviste. La única elección directa de personas en España es la del Senado.":
    "Just as with the prime minister in a general election: a chamber is voted for and the chamber invests. The only direct election of people in Spain is the one for the Senate.",
  "¿Qué ciudad se considera la más antigua de Europa occidental?":
    "Which city is held to be the oldest in western Europe?",
  "Cádiz": "Cádiz",
  "Tarragona": "Tarragona",
  "Cádiz, fundada por los fenicios como factoría comercial. Antes de Roma, la costa peninsular recibió a fenicios, griegos y cartagineses.":
    "Cádiz, founded by the Phoenicians as a trading post. Before Rome, the coast of the peninsula took in Phoenicians, Greeks and Carthaginians.",
  "¿Dónde desembarcaron los romanos en el 218 antes de Cristo?":
    "Where did the Romans land in 218 BC?",
  "En Ampurias": "At Ampurias",
  "En Cartagena": "At Cartagena",
  "En Tarragona": "At Tarragona",
  "En Ampurias, en la costa catalana, durante la segunda guerra púnica. La conquista completa tardaría dos siglos, hasta las guerras cántabras.":
    "At Ampurias, on the Catalan coast, during the second Punic war. The full conquest would take two centuries, up to the Cantabrian wars.",
  "¿Qué guerras cerraron la conquista romana de la Península?":
    "Which wars closed the Roman conquest of the peninsula?",
  "Las guerras púnicas": "The Punic wars",
  "Las guerras cántabras": "The Cantabrian wars",
  "Las guerras lusitanas": "The Lusitanian wars",
  "Las guerras celtíberas": "The Celtiberian wars",
  "Las cántabras, hacia el 19 antes de Cristo, dirigidas en parte por el propio Augusto. La resistencia del norte fue la última en ceder.":
    "The Cantabrian ones, around 19 BC, led in part by Augustus himself. The resistance of the north was the last to give way.",
  "¿Qué lenguas actuales de España proceden del latín?":
    "Which of Spain's present-day languages come from Latin?",
  "El castellano, el gallego y el catalán": "Castilian, Galician and Catalan",
  "El castellano y el euskera": "Castilian and Basque",
  "Solo el castellano": "Castilian alone",
  "El euskera y el gallego": "Basque and Galician",
  "Las tres son lenguas romances. El euskera no lo es: es anterior a la llegada de Roma y sin parentesco conocido con ninguna lengua viva.":
    "All three are Romance languages. Basque is not: it is older than the arrival of Rome and has no known kinship with any living language.",
  "¿Qué ocurrió en el III Concilio de Toledo, en el 589?":
    "What happened at the Third Council of Toledo, in 589?",
  "Se promulgó el Liber Iudiciorum": "The Liber Iudiciorum was promulgated",
  "Recaredo se convirtió al catolicismo": "Reccared converted to Catholicism",
  "Se fundó el reino de Asturias": "The kingdom of Asturias was founded",
  "Se dividió el reino visigodo": "The Visigothic kingdom was divided",
  "El rey abandonó el arrianismo, con lo que el reino quedó unificado en religión y la monarquía atada a la Iglesia. El Liber Iudiciorum llegaría en el 654.":
    "The king abandoned Arianism, which left the kingdom united in religion and the monarchy tied to the Church. The Liber Iudiciorum would come in 654.",
  "¿Qué pueblos entraron en la Península en el 409?":
    "Which peoples came into the peninsula in 409?",
  "Suevos, vándalos y alanos": "Suebi, Vandals and Alans",
  "Normandos y sajones": "Normans and Saxons",
  "Hunos y ostrogodos": "Huns and Ostrogoths",
  "Bereberes y árabes": "Berbers and Arabs",
  "Tras ellos llegaron los visigodos, que acabaron imponiéndose y estableciendo la capital en Toledo. Los ejércitos musulmanes no cruzarían hasta el 711.":
    "After them came the Visigoths, who ended up prevailing and setting the capital at Toledo. The Muslim armies would not cross until 711.",
  "¿En qué batalla fue derrotado el último rey visigodo?":
    "In which battle was the last Visigothic king defeated?",
  "En Covadonga": "At Covadonga",
  "En Guadalete": "At Guadalete",
  "En Las Navas de Tolosa": "At Las Navas de Tolosa",
  "En Numancia": "At Numantia",
  "En Guadalete, en el 711. Covadonga fue en cambio la escaramuza en que la tradición sitúa el origen del reino de Asturias, once años después.":
    "At Guadalete, in 711. Covadonga was instead the skirmish where tradition places the origin of the kingdom of Asturias, eleven years later.",
  "¿Quién proclamó el Califato de Córdoba?": "Who proclaimed the Caliphate of Córdoba?",
  "Almanzor": "Almanzor",
  "Abderramán III": "Abd al-Rahman III",
  "Boabdil": "Boabdil",
  "Tariq": "Tariq",
  "Abderramán III, en el 929, con lo que el emirato se independizó también en lo religioso. Boabdil fue el último rey de Granada, cinco siglos después.":
    "Abd al-Rahman III, in 929, with which the emirate became independent in religion too. Boabdil was the last king of Granada, five centuries later.",
  "¿Qué son los reinos de taifas?": "What are the taifa kingdoms?",
  "Los estados en que se fragmentó al-Ándalus tras 1031":
    "The states al-Andalus broke up into after 1031",
  "Los condados cristianos del Pirineo": "The Christian counties of the Pyrenees",
  "Las provincias romanas de Hispania": "The Roman provinces of Hispania",
  "Los territorios que Castilla cedió a Portugal": "The territories Castile ceded to Portugal",
  "Más de veinte estados rivales surgidos del hundimiento del califato. Su debilidad les obligó a pagar tributos a los reinos del norte y a llamar en su auxilio a almorávides y almohades.":
    "More than twenty rival states thrown up by the collapse of the caliphate. Their weakness forced them to pay tribute to the northern kingdoms and to call in the Almoravids and the Almohads for help.",
  "¿Qué ciudad tomó Alfonso VI en 1085?": "Which city did Alfonso VI take in 1085?",
  "Zaragoza": "Zaragoza",
  "Toledo, la antigua capital visigoda, que se convirtió en el gran punto de contacto entre las culturas y sede de la Escuela de Traductores.":
    "Toledo, the old Visigothic capital, which became the great meeting point between the cultures and the seat of the School of Translators.",
  "¿Qué hacía la Escuela de Traductores de Toledo?":
    "What did the School of Translators of Toledo do?",
  "Enseñaba latín a los nobles castellanos": "It taught Latin to the Castilian nobles",
  "Vertía al latín obras griegas y árabes que Europa había perdido":
    "It put into Latin Greek and Arabic works that Europe had lost",
  "Traducía la Biblia a las lenguas peninsulares":
    "It translated the Bible into the languages of the peninsula",
  "Formaba intérpretes para la corte": "It trained interpreters for the court",
  "Cristianos, musulmanes y judíos trabajaron juntos en ella. Por esa vía volvieron a Europa Aristóteles, Euclides y buena parte de la ciencia griega, a través del árabe.":
    "Christians, Muslims and Jews worked in it together. That is how Aristotle, Euclid and much of Greek science came back to Europe, by way of Arabic.",
  "¿Qué victoria de 1212 abrió el valle del Guadalquivir?":
    "Which victory of 1212 opened the Guadalquivir valley?",
  "Guadalete": "Guadalete",
  "Las Navas de Tolosa": "Las Navas de Tolosa",
  "Covadonga": "Covadonga",
  "Lepanto": "Lepanto",
  "Las Navas de Tolosa, con los reyes de Castilla, Aragón y Navarra combatiendo juntos. Córdoba caería en 1236 y Sevilla en 1248.":
    "Las Navas de Tolosa, with the kings of Castile, Aragon and Navarre fighting together. Córdoba would fall in 1236 and Seville in 1248.",
  "¿Qué quedaba de al-Ándalus después de la toma de Sevilla en 1248?":
    "What was left of al-Andalus after the taking of Seville in 1248?",
  "Nada: la conquista estaba completa": "Nothing: the conquest was complete",
  "El reino nazarí de Granada": "The Nasrid kingdom of Granada",
  "El reino de Valencia": "The kingdom of Valencia",
  "Las islas Baleares": "The Balearic Islands",
  "Granada sobrevivió como reino vasallo dos siglos y medio más, y en ese tiempo construyó la Alhambra. No caería hasta 1492.":
    "Granada survived as a vassal kingdom for another two and a half centuries, and in that time it built the Alhambra. It would not fall until 1492.",
  "¿En qué año se casaron Isabel de Castilla y Fernando de Aragón?":
    "In which year did Isabella of Castile and Ferdinand of Aragon marry?",
  "En 1469": "In 1469",
  "En 1479": "In 1479",
  "En 1492": "In 1492",
  "En 1512": "In 1512",
  "En 1469. Fue una unión dinástica: cada reino conservó sus leyes, sus cortes, su moneda y sus aduanas durante dos siglos y medio más.":
    "In 1469. It was a dynastic union: each kingdom kept its laws, its cortes, its currency and its customs posts for another two and a half centuries.",
  "¿Qué significa que la unión de Castilla y Aragón fue dinástica?":
    "What does it mean that the union of Castile and Aragon was dynastic?",
  "Que solo duró una generación": "That it lasted only one generation",
  "Que compartieron corona pero siguieron siendo reinos distintos, con leyes propias":
    "That they shared a crown but stayed separate kingdoms, with laws of their own",
  "Que la decidieron las cortes de ambos reinos": "That the cortes of both kingdoms decided it",
  "Que fue reconocida por el papa": "That the pope recognised it",
  "Compartieron monarcas, no ordenamiento. La unificación jurídica llegó con los Decretos de Nueva Planta, ya en el siglo XVIII y con un rey Borbón.":
    "They shared monarchs, not a legal order. Legal unification came with the Nueva Planta decrees, already in the eighteenth century and under a Bourbon king.",
  "¿Qué obra publicó Nebrija en 1492?": "Which work did Nebrija publish in 1492?",
  "El primer diccionario de la lengua": "The first dictionary of the language",
  "La primera gramática de una lengua romance": "The first grammar of a Romance language",
  "La primera traducción de la Biblia al castellano":
    "The first translation of the Bible into Castilian",
  "El primer atlas del Nuevo Mundo": "The first atlas of the New World",
  "La Gramática castellana, la primera de una lengua romance. Que apareciera el mismo año que Granada y América no fue casualidad: la lengua se pensaba ya como instrumento de gobierno.":
    "The Gramática castellana, the first of a Romance language. That it appeared in the same year as Granada and America was no coincidence: the language was already thought of as an instrument of government.",
  "¿En qué año se incorporó Navarra a la corona?":
    "In which year was Navarre taken into the crown?",
  "En 1580": "In 1580",
  "En 1512, conservando sus fueros e instituciones, que están en el origen del régimen foral que Navarra mantiene hoy.":
    "In 1512, keeping its fueros and its institutions, which are the origin of the foral regime Navarre keeps today.",
  "¿Por qué Carlos I es también conocido como Carlos V?":
    "Why is Charles I also known as Charles V?",
  "Porque reinó dos veces": "Because he reigned twice",
  "Porque fue el quinto rey de Castilla con ese nombre":
    "Because he was the fifth king of Castile of that name",
  "Porque fue además emperador del Sacro Imperio": "Because he was Holy Roman Emperor as well",
  "Porque cambió de nombre al abdicar": "Because he changed his name when he abdicated",
  "Carlos I de España y V del Sacro Imperio Romano Germánico. Heredó Castilla, Aragón, Italia, Flandes, Austria y América, un conjunto sin precedentes.":
    "Charles I of Spain and V of the Holy Roman Empire. He inherited Castile, Aragon, Italy, Flanders, Austria and America, a collection without precedent.",
  "¿En qué año fijó Felipe II la capital en Madrid?":
    "In which year did Philip II settle the capital at Madrid?",
  "En 1516": "In 1516",
  "En 1561": "In 1561",
  "En 1605": "In 1605",
  "En 1561. Hasta entonces la corte era itinerante, y se eligió Madrid por su posición central más que por su tamaño, que era modesto.":
    "In 1561. Until then the court moved about, and Madrid was chosen for its central position rather than for its size, which was modest.",
  "¿Entre qué años estuvo Portugal unido a la corona española?":
    "Between which years was Portugal joined to the Spanish crown?",
  "Entre 1492 y 1512": "Between 1492 and 1512",
  "Entre 1580 y 1640": "Between 1580 and 1640",
  "Entre 1640 y 1713": "Between 1640 and 1713",
  "Nunca lo estuvo": "It never was",
  "Sesenta años, desde Felipe II hasta la sublevación de 1640, simultánea a la de Cataluña. Portugal recuperó entonces su independencia de forma definitiva.":
    "Sixty years, from Philip II to the rising of 1640, at the same time as Catalonia's. Portugal then recovered its independence for good.",
  "¿Qué provocó las sublevaciones de Portugal y Cataluña en 1640?":
    "What brought on the risings of Portugal and Catalonia in 1640?",
  "Una epidemia de peste": "An outbreak of plague",
  "Las exigencias fiscales y militares del conde-duque de Olivares":
    "The fiscal and military demands of the Count-Duke of Olivares",
  "La expulsión de los moriscos": "The expulsion of the Moriscos",
  "El descubrimiento de la plata de Potosí": "The discovery of the silver of Potosí",
  "El esfuerzo de guerra continuo agotó a los reinos periféricos y las dos revueltas estallaron el mismo año. Cataluña volvió a la corona tras doce años; Portugal, nunca.":
    "The unbroken war effort exhausted the outlying kingdoms and the two revolts broke out in the same year. Catalonia returned to the crown after twelve years; Portugal never did.",
  "¿Quién pintó Las Meninas?": "Who painted Las Meninas?",
  "El Greco": "El Greco",
  "Velázquez": "Velázquez",
  "Murillo": "Murillo",
  "Goya": "Goya",
  "Diego Velázquez, en 1656, y el cuadro está en el Museo del Prado. Goya es un siglo y medio posterior, ya en la época de la Guerra de la Independencia.":
    "Diego Velázquez, in 1656, and the painting hangs in the Prado Museum. Goya comes a century and a half later, already in the time of the War of Independence.",
  "¿Qué perdió España en el Tratado de Utrecht de 1713?":
    "What did Spain lose in the Treaty of Utrecht of 1713?",
  "Cuba y Filipinas": "Cuba and the Philippines",
  "Sus territorios europeos y Gibraltar": "Its European territories and Gibraltar",
  "Navarra y el Rosellón": "Navarre and Roussillon",
  "Portugal y sus colonias": "Portugal and its colonies",
  "Los territorios en Italia y Flandes, además de Menorca y Gibraltar, que sigue siendo británico. Cuba y Filipinas se perdieron en 1898.":
    "The territories in Italy and Flanders, as well as Menorca and Gibraltar, which is still British. Cuba and the Philippines were lost in 1898.",
  "¿Qué hicieron los Decretos de Nueva Planta?": "What did the Nueva Planta decrees do?",
  "Crear las provincias actuales": "They created the present-day provinces",
  "Suprimir las instituciones propias de la Corona de Aragón y extender el modelo castellano":
    "They abolished the institutions of the Crown of Aragon and extended the Castilian model",
  "Reformar el ejército tras el Desastre del 98":
    "They reformed the army after the Disaster of 1898",
  "Fundar las primeras universidades": "They founded the first universities",
  "Felipe V los impuso tras ganar la Guerra de Sucesión. Con ellos la unión dinástica de 1469 se convirtió, dos siglos y medio después, en un Estado unificado.":
    "Philip V imposed them after winning the War of Succession. With them the dynastic union of 1469 became, two and a half centuries later, a unified state.",
  "¿Cómo se llama el periodo cultural que va aproximadamente del siglo XVI al XVII?":
    "What is the cultural period running roughly from the sixteenth century to the seventeenth called?",
  "El Renacimiento": "The Renaissance",
  "La Ilustración": "The Enlightenment",
  "El Modernismo": "Modernism",
  "El Siglo de Oro, que reúne a Cervantes, Lope, Calderón, Quevedo y Góngora en literatura y a El Greco, Velázquez y Murillo en pintura.":
    "The Golden Age, which brings together Cervantes, Lope, Calderón, Quevedo and Góngora in literature and El Greco, Velázquez and Murillo in painting.",
  "¿Qué ciudad conserva hoy Las Meninas y buena parte de la pintura del Siglo de Oro?":
    "Which city keeps Las Meninas and much of the painting of the Golden Age today?",
  "Madrid, en el Museo del Prado": "Madrid, in the Prado Museum",
  "Barcelona, en el MNAC": "Barcelona, in the MNAC",
  "Sevilla, en el Museo de Bellas Artes": "Seville, in the Museum of Fine Arts",
  "Toledo, en el Museo del Greco": "Toledo, in the El Greco Museum",
  "El Museo del Prado, en Madrid, reúne la colección real. El Greco tiene museo propio en Toledo, pero el grueso de la pintura de la época está en el Prado.":
    "The Prado Museum, in Madrid, holds the royal collection. El Greco has a museum of his own in Toledo, but the bulk of the painting of the period is in the Prado.",
  "¿A quién colocó Napoleón en el trono español?": "Whom did Napoleon put on the Spanish throne?",
  "A Fernando VII": "Ferdinand VII",
  "A su hermano José I": "His brother Joseph I",
  "A Amadeo de Saboya": "Amadeo of Savoy",
  "A Carlos IV": "Charles IV",
  "A José Bonaparte, conocido como José I. El levantamiento del 2 de mayo de 1808 dio comienzo a la Guerra de la Independencia.":
    "Joseph Bonaparte, known as Joseph I. The rising of 2 May 1808 began the War of Independence.",
  "¿Qué palabra española de uso internacional nació en la Guerra de la Independencia?":
    "Which Spanish word now used worldwide was born in the War of Independence?",
  "Fiesta": "Fiesta",
  "Guerrilla": "Guerrilla",
  "Siesta": "Siesta",
  "Armada": "Armada",
  "Guerrilla, por las partidas irregulares que hostigaban al ejército francés. Es uno de los préstamos españoles más extendidos en otras lenguas.":
    "Guerrilla, from the irregular bands that harried the French army. It is one of the most widespread Spanish loanwords in other languages.",
  "¿En qué ciudad se aprobó la primera Constitución española?":
    "In which city was the first Spanish Constitution approved?",
  "En Madrid": "In Madrid",
  "En Bayona": "In Bayonne",
  "En Cádiz, la ciudad que resistía mientras el resto del país estaba ocupado. Se aprobó el 19 de marzo de 1812.":
    "In Cádiz, the city that was holding out while the rest of the country was occupied. It was approved on 19 March 1812.",
  "¿Qué principio proclamaba la Constitución de 1812?":
    "Which principle did the Constitution of 1812 proclaim?",
  "La soberanía nacional": "National sovereignty",
  "El derecho divino de los reyes": "The divine right of kings",
  "El sufragio universal femenino": "Universal suffrage for women",
  "El Estado autonómico": "The State of autonomies",
  "Soberanía nacional, división de poderes y libertad de imprenta. Fernando VII la derogó en 1814 al regresar del cautiverio.":
    "National sovereignty, the separation of powers and freedom of the press. Ferdinand VII repealed it in 1814 on returning from captivity.",
  "¿Qué rey derogó la Constitución de 1812 al volver al trono?":
    "Which king repealed the Constitution of 1812 on returning to the throne?",
  "Carlos IV": "Charles IV",
  "José I": "Joseph I",
  "Fernando VII": "Ferdinand VII",
  "Alfonso XII": "Alfonso XII",
  "Fernando VII, en 1814, restaurando el absolutismo. El vaivén entre texto liberal y vuelta atrás se repetiría durante todo el siglo.":
    "Ferdinand VII, in 1814, restoring absolutism. The swing between a liberal text and a step back would repeat throughout the century.",
  "¿Entre qué años se independizó la América continental española?":
    "Between which years did continental Spanish America become independent?",
  "Entre 1780 y 1800": "Between 1780 and 1800",
  "Entre 1810 y 1824": "Between 1810 and 1824",
  "Entre 1830 y 1850": "Between 1830 and 1850",
  "Entre 1860 y 1880": "Between 1860 and 1880",
  "El vacío de poder de 1808 fue el detonante, y la batalla de Ayacucho cerró el proceso en 1824. Quedaron solo Cuba, Puerto Rico y Filipinas.":
    "The power vacuum of 1808 was the trigger, and the battle of Ayacucho closed the process in 1824. Only Cuba, Puerto Rico and the Philippines were left.",
  "¿Qué enfrentaron en el fondo las guerras carlistas?":
    "What did the Carlist wars really set against each other?",
  "Dos ideas de país: liberalismo frente a absolutismo, centro frente a fueros":
    "Two ideas of the country: liberalism against absolutism, the centre against the fueros",
  "Castilla contra Aragón": "Castile against Aragon",
  "La Iglesia contra el ejército": "The Church against the army",
  "El campo contra la ciudad exclusivamente": "The countryside against the city and nothing else",
  "La disputa dinástica entre Isabel y su tío Carlos ocultaba un choque más hondo. Fueron tres guerras civiles a lo largo del siglo, con intervalos, hasta 1876.":
    "The dynastic dispute between Isabella and her uncle Carlos hid a deeper clash. They were three civil wars across the century, with gaps between them, until 1876.",
  "¿Cómo se llamó la revolución de 1868?": "What was the revolution of 1868 called?",
  "La Semana Trágica": "La Semana Trágica",
  "La Gloriosa, que abrió el Sexenio Democrático. La Pepa es la Constitución de 1812, y la Restauración empieza en 1875.":
    "La Gloriosa, which opened the Democratic Six Years. La Pepa is the Constitution of 1812, and the Restoration begins in 1875.",
  "¿Qué rey extranjero ocupó el trono español durante el Sexenio Democrático?":
    "Which foreign king occupied the Spanish throne during the Democratic Six Years?",
  "Amadeo de Saboya": "Amadeo of Savoy",
  "Leopoldo de Hohenzollern": "Leopold of Hohenzollern",
  "Fernando de Coburgo": "Ferdinand of Coburg",
  "Luis de Orleans": "Louis of Orléans",
  "Amadeo de Saboya, que reinó dos años y abdicó en 1873. Su marcha dio paso a la Primera República.":
    "Amadeo of Savoy, who reigned for two years and abdicated in 1873. His departure made way for the First Republic.",
  "¿Quién diseñó el sistema de turno de la Restauración?":
    "Who designed the Restoration's system of rotation?",
  "Cánovas del Castillo": "Cánovas del Castillo",
  "Sagasta": "Sagasta",
  "Prim": "Prim",
  "Espartero": "Espartero",
  "Antonio Cánovas del Castillo, con Alfonso XII en el trono desde 1875. Los dos partidos se alternaban por acuerdo, sostenidos en el campo por el caciquismo.":
    "Antonio Cánovas del Castillo, with Alfonso XII on the throne from 1875. The two parties took turns by agreement, propped up in the countryside by boss politics.",
  "¿Qué era el caciquismo?": "What was caciquismo?",
  "Un impuesto sobre la tierra": "A tax on land",
  "El control de las elecciones en el campo por notables locales":
    "The control of elections in the countryside by local notables",
  "Un sistema de gremios urbanos": "A system of urban guilds",
  "El nombre del turno de partidos": "The name of the rotation between the parties",
  "Notables locales garantizaban el resultado que el turno había pactado de antemano. Es lo que permitía que la alternancia funcionara sin que las elecciones decidieran nada.":
    "Local notables guaranteed the result the rotation had agreed in advance. It is what let the alternation work without the elections deciding anything.",
  "¿Con qué país se enfrentó España en 1898?": "Which country did Spain face in 1898?",
  "Con Francia": "France",
  "Con el Reino Unido": "The United Kingdom",
  "Con Estados Unidos": "The United States",
  "Con Alemania": "Germany",
  "Con Estados Unidos, en una guerra breve que costó a España Cuba, Puerto Rico y Filipinas. Se lo llamó simplemente el Desastre.":
    "The United States, in a short war that cost Spain Cuba, Puerto Rico and the Philippines. It was called simply the Disaster.",
  "¿Qué grupo de escritores surgió de la conmoción de 1898?":
    "Which group of writers came out of the shock of 1898?",
  "La Generación del 27": "The Generation of '27",
  "La Generación del 98": "The Generation of '98",
  "El Modernismo catalán": "Catalan Modernism",
  "La Institución Libre de Enseñanza": "The Institución Libre de Enseñanza",
  "Unamuno, Baroja, Azorín y Machado, entre otros, se preguntaron qué era España y qué debía hacer consigo misma. La Generación del 27 es tres décadas posterior.":
    "Unamuno, Baroja, Azorín and Machado, among others, asked what Spain was and what it should do with itself. The Generation of '27 comes three decades later.",
  "¿Entre qué años gobernó la dictadura de Primo de Rivera?":
    "Between which years did the dictatorship of Primo de Rivera govern?",
  "Entre 1917 y 1920": "Between 1917 and 1920",
  "Entre 1923 y 1930": "Between 1923 and 1930",
  "Entre 1931 y 1936": "Between 1931 and 1936",
  "Entre 1936 y 1939": "Between 1936 and 1939",
  "Siete años con el consentimiento de Alfonso XIII. Su caída arrastró al rey: las municipales del año siguiente se leyeron como un plebiscito sobre la monarquía.":
    "Seven years with Alfonso XIII's consent. Its fall dragged the king down with it: the local elections of the following year were read as a plebiscite on the monarchy.",
  "¿Qué elecciones precipitaron la caída de Alfonso XIII?":
    "Which elections brought on the fall of Alfonso XIII?",
  "Unas generales": "A general election",
  "Unas municipales": "A local election",
  "Unas europeas": "A European election",
  "Un referéndum": "A referendum",
  "Las municipales del 12 de abril de 1931. Las ciudades votaron republicano y el rey salió del país dos días después.":
    "The local elections of 12 April 1931. The cities voted republican and the king left the country two days later.",
  "¿Qué introdujo la Constitución republicana de 1931?":
    "What did the republican Constitution of 1931 bring in?",
  "El Estado laico, el divorcio y el voto femenino":
    "A secular state, divorce and votes for women",
  "El Estado de las autonomías tal como existe hoy": "The State of autonomies as it exists today",
  "El sufragio censitario": "Suffrage limited by property",
  "Fue de las más avanzadas de su tiempo. También abrió la vía a los estatutos de autonomía: el de Cataluña se aprobó en 1932 y el del País Vasco en 1936.":
    "It was among the most advanced of its time. It also opened the way to the statutes of autonomy: Catalonia's was approved in 1932 and the Basque Country's in 1936.",
  "¿En qué año votaron las mujeres por primera vez en España?":
    "In which year did women vote for the first time in Spain?",
  "En 1931": "In 1931",
  "En 1933": "In 1933",
  "En 1977": "In 1977",
  "El derecho se aprobó en 1931 y se ejerció en las elecciones de 1933. Clara Campoamor lo había defendido en las Cortes contra buena parte de su propio grupo.":
    "The right was passed in 1931 and exercised at the elections of 1933. Clara Campoamor had defended it in the Cortes against much of her own group.",
  "¿Qué diputada se opuso al voto femenino en el debate de 1931?":
    "Which woman deputy opposed votes for women in the debate of 1931?",
  "Margarita Nelken": "Margarita Nelken",
  "Victoria Kent, también republicana y también diputada, temía que el voto de las mujeres favoreciera a la derecha. El debate entre ambas es uno de los más citados de aquellas Cortes.":
    "Victoria Kent, also a republican and also a deputy, feared that women's votes would favour the right. The debate between the two of them is one of the most quoted of that Cortes.",
  "¿Qué convirtió la sublevación de julio de 1936 en una guerra civil?":
    "What turned the rising of July 1936 into a civil war?",
  "La intervención de Francia": "France's intervention",
  "Que el golpe triunfó en unas zonas y fracasó en otras":
    "That the coup succeeded in some areas and failed in others",
  "La negativa del rey a firmar": "The king's refusal to sign",
  "Una huelga general": "A general strike",
  "El fracaso parcial partió el país en dos y ninguno de los bandos pudo imponerse rápido. Un golpe que triunfa del todo o fracasa del todo no produce tres años de guerra.":
    "The partial failure split the country in two and neither side could prevail quickly. A coup that wholly succeeds or wholly fails does not produce three years of war.",
  "¿Qué países apoyaron al bando sublevado?": "Which countries backed the rebel side?",
  "Francia y el Reino Unido": "France and the United Kingdom",
  "Alemania e Italia": "Germany and Italy",
  "La Unión Soviética": "The Soviet Union",
  "Estados Unidos y Portugal": "The United States and Portugal",
  "Alemania e Italia apoyaron a los sublevados y la Unión Soviética a la República, mientras las democracias occidentales se mantenían en la no intervención.":
    "Germany and Italy backed the rebels and the Soviet Union the Republic, while the western democracies stayed with non-intervention.",
  "¿Qué cuadro pintó Picasso a raíz del bombardeo de 1937?":
    "Which painting did Picasso make after the bombing of 1937?",
  "Las Meninas": "Las Meninas",
  "El Guernica": "Guernica",
  "Los fusilamientos del 3 de mayo": "The Third of May",
  "El jardín de las delicias": "The Garden of Earthly Delights",
  "El Guernica, hoy en el Museo Reina Sofía de Madrid. Los fusilamientos del 3 de mayo es de Goya y recuerda la represión francesa de 1808.":
    "Guernica, today in the Reina Sofía Museum in Madrid. The Third of May is by Goya and recalls the French repression of 1808.",
  "¿Cuántos años duró la dictadura de Franco?": "How many years did Franco's dictatorship last?",
  "Veintiocho": "Twenty-eight",
  "Treinta y seis": "Thirty-six",
  "Cuarenta y cinco": "Forty-five",
  "De 1939 a 1975. La Segunda República había durado ocho años, de los cuales solo los tres últimos fueron de guerra.":
    "From 1939 to 1975. The Second Republic had lasted eight years, of which only the last three were of war.",
  "¿Cómo se llamó la política económica de los años cuarenta?":
    "What was the economic policy of the forties called?",
  "La estabilización": "Stabilisation",
  "La reconversión": "Restructuring",
  "Autarquía: aislamiento, cartillas de racionamiento y hambre. Se los conoce como los años del hambre. El desarrollismo llegaría en los sesenta.":
    "Autarky: isolation, ration books and hunger. They are known as the years of hunger. The development years would come in the sixties.",
  "¿En qué año ingresó España en la ONU?": "In which year did Spain join the UN?",
  "En 1953": "In 1953",
  "En 1955": "In 1955",
  "En 1955, tras los acuerdos con Estados Unidos y el concordato con la Santa Sede, ambos de 1953, que rompieron el aislamiento de la posguerra.":
    "In 1955, after the agreements with the United States and the concordat with the Holy See, both from 1953, which broke the isolation of the post-war years.",
  "¿A quién designó Franco como sucesor a título de rey?":
    "Whom did Franco name as his successor with the title of king?",
  "A Alfonso XIII": "Alfonso XIII",
  "A Juan de Borbón": "Juan de Borbón",
  "A Juan Carlos de Borbón": "Juan Carlos de Borbón",
  "A Carrero Blanco": "Carrero Blanco",
  "A Juan Carlos, nieto de Alfonso XIII, en 1969, pasando por encima de su padre. Carrero Blanco era el sucesor previsto en la presidencia del Gobierno, no en la jefatura del Estado.":
    "Juan Carlos, Alfonso XIII's grandson, in 1969, passing over his father. Carrero Blanco was the intended successor as head of government, not as head of state.",
  "¿Qué trajeron los años sesenta a la economía española?":
    "What did the sixties bring to the Spanish economy?",
  "Cartillas de racionamiento": "Ration books",
  "Industria, turismo y las divisas de la emigración a Europa":
    "Industry, tourism and the foreign currency of emigration to Europe",
  "La nacionalización de la banca": "The nationalisation of the banks",
  "El ingreso en la Comunidad Económica Europea": "Entry into the European Economic Community",
  "Es lo que se llamó desarrollismo. Dos millones de españoles trabajaban en Europa y sus envíos, junto al turismo, sostuvieron la balanza de pagos.":
    "It is what was called the development years. Two million Spaniards were working in Europe and what they sent home, together with tourism, held up the balance of payments.",
  "¿Cuándo fue proclamado rey Juan Carlos I?": "When was Juan Carlos I proclaimed king?",
  "El 20 de noviembre de 1975": "On 20 November 1975",
  "El 22 de noviembre de 1975": "On 22 November 1975",
  "El 15 de junio de 1977": "On 15 June 1977",
  "Dos días después de la muerte de Franco, dentro de las reglas del propio régimen. Las primeras elecciones libres llegarían año y medio más tarde.":
    "Two days after Franco's death, within the regime's own rules. The first free elections would come a year and a half later.",
  "¿Qué norma abrió el paso a las elecciones libres?":
    "Which law opened the way to free elections?",
  "La Ley para la Reforma Política": "The Law for Political Reform",
  "La Ley de Amnistía": "The Amnesty Law",
  "Los Pactos de la Moncloa": "The Moncloa Pacts",
  "La Ley Orgánica del Estado": "The Organic Law of the State",
  "Aprobada por las propias Cortes del régimen y ratificada en referéndum en diciembre de 1976. De ahí la fórmula: se fue de la ley a la ley, sin ruptura formal.":
    "Approved by the regime's own Cortes and ratified by referendum in December 1976. Hence the phrase: it went from law to law, with no formal break.",
  "¿Qué partido se legalizó un Sábado Santo de 1977?":
    "Which party was legalised on a Holy Saturday in 1977?",
  "El PSOE": "The PSOE",
  "El Partido Comunista": "The Communist Party",
  "Alianza Popular": "Alianza Popular",
  "UCD": "UCD",
  "El PCE, en la decisión más arriesgada del periodo. Se eligió un fin de semana largo precisamente para amortiguar la reacción.":
    "The PCE, in the riskiest decision of the period. A long weekend was chosen precisely to cushion the reaction.",
  "¿En qué fecha se celebraron las primeras elecciones libres desde 1936?":
    "On what date were the first free elections since 1936 held?",
  "El 28 de octubre de 1982": "On 28 October 1982",
  "El 23 de febrero de 1981": "On 23 February 1981",
  "Cuarenta y un años después de las últimas. La Constitución llegaría año y medio más tarde, redactada por las Cortes salidas de esa votación.":
    "Forty-one years after the last ones. The Constitution would come a year and a half later, drafted by the Cortes that came out of that vote.",
  "¿Qué fueron los Pactos de la Moncloa?": "What were the Moncloa Pacts?",
  "Un acuerdo entre el rey y los militares": "An agreement between the king and the military",
  "Un acuerdo económico y social entre gobierno y oposición":
    "An economic and social agreement between government and opposition",
  "El pacto que fijó las autonomías": "The pact that settled the autonomies",
  "El tratado de adhesión a la CEE": "The treaty of accession to the EEC",
  "Firmados en octubre de 1977 con una inflación superior al veinte por ciento. Permitieron afrontar la crisis mientras se redactaba la Constitución.":
    "Signed in October 1977 with inflation above twenty per cent. They made it possible to face the crisis while the Constitution was being drafted.",
  "¿Qué se asaltó el 23 de febrero de 1981?": "What was stormed on 23 February 1981?",
  "La sede del Gobierno catalán": "The seat of the Catalan government",
  "El Congreso, durante una votación de investidura, con el Gobierno y los diputados dentro. El golpe fracasó esa misma noche.":
    "The Congress, during an investiture vote, with the Government and the deputies inside. The coup failed that same night.",
  "¿Qué partido ganó las elecciones de 1982 con mayoría absoluta?":
    "Which party won the elections of 1982 with an absolute majority?",
  "El PCE": "The PCE",
  "El PSOE, con Felipe González, y gobernó hasta 1996. La alternancia demostró que el sistema funcionaba.":
    "The PSOE, with Felipe González, and it governed until 1996. The change of party showed that the system worked.",
  "¿Qué se decidió en el referéndum de 1986, además de la entrada en la CEE?":
    "What was decided in the referendum of 1986, apart from entry into the EEC?",
  "La permanencia en la OTAN": "Staying in NATO",
  "La reforma del Senado": "The reform of the Senate",
  "El mapa autonómico": "The map of the autonomies",
  "La adopción del euro": "The adoption of the euro",
  "La entrada en la CEE no se sometió a referéndum: fue un tratado. Lo que se votó ese año fue la permanencia en la OTAN, y ganó el sí.":
    "Joining the EEC was not put to a referendum: it was a treaty. What was voted on that year was staying in NATO, and the yes won.",
  "¿Qué tres acontecimientos coincidieron en España en 1992?":
    "Which three events came together in Spain in 1992?",
  "Los Juegos de Barcelona, la Expo de Sevilla y el primer AVE":
    "The Barcelona Olympics, the Seville Expo and the first AVE",
  "La entrada en la CEE, el euro y la OTAN": "Joining the EEC, the euro and NATO",
  "La Constitución, el 23-F y las autonomías": "The Constitution, 23-F and the autonomies",
  "El Mundial de fútbol, la Expo y la peseta": "The football World Cup, the Expo and the peseta",
  "Doce meses en los que el país se enseñó al mundo. El Mundial de fútbol se había celebrado diez años antes, en 1982.":
    "Twelve months in which the country showed itself to the world. The football World Cup had been held ten years earlier, in 1982.",
  "¿Qué moneda sustituyó el euro en 2002?": "Which currency did the euro replace in 2002?",
  "El real": "The real",
  "La peseta": "The peseta",
  "El duro": "The duro",
  "La peseta, que había circulado desde 1868. El duro era el nombre coloquial de la moneda de cinco pesetas, no una moneda distinta.":
    "The peseta, which had circulated since 1868. The duro was the everyday name of the five-peseta coin, not a separate currency.",
  "¿Qué ocurrió el 11 de marzo de 2004?": "What happened on 11 March 2004?",
  "El intento de golpe de Estado": "The attempted coup",
  "Los atentados en trenes de cercanías de Madrid": "The attacks on commuter trains in Madrid",
  "La abdicación de Juan Carlos I": "The abdication of Juan Carlos I",
  "La entrada en el euro": "The entry into the euro",
  "Ciento noventa y tres muertos: el mayor atentado de la historia de España. El 23-F fue en 1981 y la abdicación en 2014.":
    "A hundred and ninety-three dead: the largest attack in Spanish history. 23-F was in 1981 and the abdication in 2014.",
  "¿En qué año anunció ETA su disolución?": "In which year did ETA announce its dissolution?",
  "Anunció el fin de su actividad armada en 2011 y su disolución en 2018. Había causado más de ochocientas muertes desde los años sesenta.":
    "It announced the end of its armed activity in 2011 and its dissolution in 2018. It had caused more than eight hundred deaths since the sixties.",
  "¿Por qué se dice que la Transición fue una reforma y no una ruptura?":
    "Why is the Transition called a reform and not a break?",
  "Porque la dirigió el ejército": "Because the army led it",
  "Porque las instituciones del régimen aprobaron su propia disolución":
    "Because the regime's institutions approved their own dissolution",
  "Porque no hubo elecciones": "Because there were no elections",
  "Porque la Constitución se copió de otro país":
    "Because the Constitution was copied from another country",
  "Las Cortes franquistas votaron la ley que las disolvía, y de ahí la fórmula de ir de la ley a la ley. Esa elección explica tanto la estabilidad posterior como los debates que siguen abiertos.":
    "The Francoist Cortes voted the law that dissolved them, and hence the phrase about going from law to law. That choice explains both the stability that followed and the arguments still open.",
  "¿Cuántas ciudades autónomas hay en España?": "How many autonomous cities are there in Spain?",
  "Ceuta y Melilla, ambas desde 1995. No son comunidades autónomas, sino una categoría propia con estatuto y competencias más limitadas.":
    "Ceuta and Melilla, both since 1995. They are not autonomous communities but a category of their own, with a statute and more limited powers.",
  "¿Qué título de la Constitución regula la organización territorial?":
    "Which title of the Constitution governs the territorial organisation?",
  "El título VIII, que no enumera comunidades sino que establece cómo pueden constituirse. El mapa autonómico se hizo después, siguiendo ese procedimiento.":
    "Title VIII, which does not list communities but sets out how they may be constituted. The map of the autonomies was drawn afterwards, following that procedure.",
  "¿Qué comunidades accedieron a la autonomía por la vía rápida del artículo 151?":
    "Which communities reached autonomy by the fast route of Article 151?",
  "Cataluña, País Vasco, Galicia y Andalucía":
    "Catalonia, the Basque Country, Galicia and Andalusia",
  "Madrid, Cataluña y el País Vasco": "Madrid, Catalonia and the Basque Country",
  "Todas las que tienen lengua propia": "All those with a language of their own",
  "Las siete uniprovinciales": "The seven single-province ones",
  "Las tres con estatuto plebiscitado durante la República, más Andalucía, que lo consiguió tras un referéndum en 1980. Las demás siguieron la vía más lenta del artículo 143.":
    "The three whose statutes were put to a vote during the Republic, plus Andalusia, which got there after a referendum in 1980. The rest took the slower route of Article 143.",
  "¿Con qué tipo de norma se aprueba un Estatuto de Autonomía?":
    "What kind of law approves a Statute of Autonomy?",
  "Con un decreto del Gobierno": "A government decree",
  "Con una ley orgánica": "An organic law",
  "Con una ley ordinaria": "An ordinary law",
  "Con un reglamento autonómico": "A regional regulation",
  "Ley orgánica de las Cortes Generales. Por eso su reforma exige el acuerdo de la comunidad y del Estado: pertenece a los dos ordenamientos a la vez.":
    "An organic law of the Cortes Generales. That is why amending it needs the agreement of the community and of the State: it belongs to both legal orders at once.",
  "¿Cuántas provincias tiene España?": "How many provinces does Spain have?",
  "Treinta y ocho": "Thirty-eight",
  "Ochenta y una": "Eighty-one",
  "Cincuenta provincias, agrupadas en diecisiete comunidades. Siete comunidades son uniprovinciales, como Madrid, Murcia o Asturias.":
    "Fifty provinces, grouped into seventeen communities. Seven communities are single-province, like Madrid, Murcia or Asturias.",
  "¿Qué ocurre en una comunidad uniprovincial?": "What happens in a single-province community?",
  "Tiene dos parlamentos": "It has two parliaments",
  "La comunidad absorbe las funciones de la diputación provincial":
    "The community absorbs the provincial council's functions",
  "No tiene estatuto propio": "It has no statute of its own",
  "Depende directamente del Gobierno central": "It answers directly to the central government",
  "Al coincidir el territorio, no tiene sentido mantener dos administraciones. Madrid, Murcia, Asturias, Cantabria, La Rioja, Navarra y las Baleares están en ese caso.":
    "Since the territory is the same, there is no sense in keeping two administrations. Madrid, Murcia, Asturias, Cantabria, La Rioja, Navarre and the Balearics are in that position.",
  "¿Qué artículo enumera las competencias exclusivas del Estado?":
    "Which article lists the State's exclusive powers?",
  "El artículo 143": "Article 143",
  "El artículo 148": "Article 148",
  "El artículo 149": "Article 149",
  "El artículo 155": "Article 155",
  "El 149 lista lo que es exclusivo del Estado y el 148 lo que las comunidades pueden asumir. El 143 es una de las vías de acceso a la autonomía y el 155 el mecanismo de última instancia.":
    "Article 149 lists what belongs to the State alone and Article 148 what the communities may take on. Article 143 is one of the routes to autonomy and Article 155 the last-resort mechanism.",
  "¿Cuál de estas materias es competencia exclusiva del Estado?":
    "Which of these matters is an exclusive power of the State?",
  "El turismo": "Tourism",
  "El urbanismo": "Town planning",
  "La administración de justicia": "The administration of justice",
  "La agricultura": "Agriculture",
  "Justicia, defensa, relaciones internacionales y moneda están entre las exclusivas. Turismo, urbanismo y agricultura son de las que las comunidades pueden asumir.":
    "Justice, defence, international relations and currency are among the exclusive ones. Tourism, town planning and agriculture are among those the communities may take on.",
  "¿Cómo se llama el sistema de financiación del País Vasco?":
    "What is the Basque Country's funding system called?",
  "El convenio": "The convenio",
  "El concierto": "The concierto",
  "El cupo común": "The common quota",
  "El fondo foral": "The foral fund",
  "El concierto económico vasco; el navarro se llama convenio. Ambos permiten recaudar los propios impuestos y pagar al Estado una cantidad por los servicios comunes.":
    "The Basque concierto económico; the Navarrese one is called the convenio. Both let them collect their own taxes and pay the State a sum for shared services.",
  "¿Qué mecanismo prevé el artículo 155?": "What mechanism does Article 155 provide for?",
  "La disolución de un parlamento autonómico por el rey":
    "The dissolution of a regional parliament by the king",
  "Medidas del Gobierno, aprobadas por el Senado, si una comunidad incumple gravemente":
    "Measures by the Government, approved by the Senate, if a community fails seriously in its duties",
  "La creación de nuevas comunidades": "The creation of new communities",
  "El reparto anual de los fondos europeos": "The yearly share-out of the European funds",
  "Requiere un requerimiento previo y la aprobación del Senado por mayoría absoluta. Se aplicó por primera vez en 2017, casi cuarenta años después de escribirse.":
    "It requires a formal demand beforehand and the Senate's approval by an absolute majority. It was applied for the first time in 2017, almost forty years after it was written.",
  "¿Quién representa a la Administración del Estado en cada comunidad autónoma?":
    "Who represents the State administration in each autonomous community?",
  "El presidente autonómico": "The regional president",
  "El alcalde de la capital": "The mayor of the capital",
  "El presidente del Tribunal Superior de Justicia": "The president of the High Court of Justice",
  "El delegado del Gobierno, nombrado por el Gobierno central, con subdelegados en cada provincia. No es un cargo autonómico.":
    "The Government delegate, appointed by the central government, with sub-delegates in each province. It is not a regional office.",
  "¿Para qué sirve el Fondo de Compensación Interterritorial?":
    "What is the Inter-Territorial Compensation Fund for?",
  "Para financiar las lenguas cooficiales": "To fund the co-official languages",
  "Para corregir desequilibrios económicos entre territorios":
    "To correct economic imbalances between territories",
  "Para pagar la deuda de las comunidades": "To pay the communities' debt",
  "Para repartir los fondos europeos": "To share out the European funds",
  "La Constitución garantiza la solidaridad entre territorios y prohíbe que las diferencias entre estatutos supongan privilegios económicos o sociales. Este fondo es el instrumento.":
    "The Constitution guarantees solidarity between territories and forbids differences between statutes from meaning economic or social privileges. This fund is the instrument.",
  "¿Cómo se llama el parlamento de una comunidad autónoma?":
    "What is an autonomous community's parliament called?",
  "Cortes Generales": "Cortes Generales",
  "Diputación": "Provincial council",
  "Asamblea legislativa, con nombres propios en cada comunidad: Parlament, Cortes, Junta General, Asamblea. El Consejo de Gobierno es el ejecutivo, no el legislativo.":
    "A legislative assembly, with its own name in each community: Parlament, Cortes, Junta General, Asamblea. The Consejo de Gobierno is the executive, not the legislature.",
  "¿Qué extensión aproximada tiene España?": "Roughly what area does Spain cover?",
  "300.000 km²": "300,000 km²",
  "400.000 km²": "400,000 km²",
  "505.000 km²": "505,000 km²",
  "700.000 km²": "700,000 km²",
  "Unos 505.000 kilómetros cuadrados, lo que la convierte en el segundo país más extenso de la Unión Europea, tras Francia.":
    "About 505,000 square kilometres, which makes it the second largest country in the European Union, after France.",
  "¿Qué país europeo es más montañoso que España?":
    "Which European country is more mountainous than Spain?",
  "Austria": "Austria",
  "Suiza": "Switzerland",
  "Italia": "Italy",
  "Noruega": "Norway",
  "Solo Suiza tiene una altitud media mayor. La Meseta Central está por encima de los seiscientos metros, y eso explica los inviernos duros del interior pese a la latitud.":
    "Only Switzerland has a higher average altitude. The Central Plateau lies above six hundred metres, and that explains the hard winters of the interior despite the latitude.",
  "¿Qué cordillera separa España de Francia?": "Which mountain range separates Spain from France?",
  "El Sistema Ibérico": "The Iberian System",
  "Sierra Morena": "Sierra Morena",
  "Los Pirineos, de mar a mar, con Andorra encajada entre ambos países. La Cantábrica cierra el norte peninsular pero no es frontera.":
    "The Pyrenees, from sea to sea, with Andorra wedged in between the two countries. The Cantabrian Range closes off the north of the peninsula but is not a border.",
  "¿Cuál es el pico más alto de la Península?": "Which is the highest peak in the peninsula?",
  "El Moncayo": "Moncayo",
  "El Mulhacén, en Sierra Nevada, con 3.479 metros. El Teide es más alto pero está en Tenerife, y el Aneto es el techo de los Pirineos.":
    "Mulhacén, in the Sierra Nevada, at 3,479 metres. Teide is higher but it is on Tenerife, and Aneto is the roof of the Pyrenees.",
  "¿Cuál es el río de mayor caudal de España?": "Which river carries the most water in Spain?",
  "El Ebro, y es además el gran río de la vertiente mediterránea, la más seca. El Tajo es el más largo y el Guadalquivir el único navegable.":
    "The Ebro, and it is also the great river of the Mediterranean watershed, the driest one. The Tagus is the longest and the Guadalquivir the only navigable one.",
  "¿Qué río español es navegable hasta una ciudad del interior?":
    "Which Spanish river is navigable as far as an inland city?",
  "El Guadalquivir, hasta Sevilla": "The Guadalquivir, as far as Seville",
  "El Ebro, hasta Zaragoza": "The Ebro, as far as Zaragoza",
  "El Duero, hasta Valladolid": "The Douro, as far as Valladolid",
  "El Tajo, hasta Toledo": "The Tagus, as far as Toledo",
  "Sevilla es el único puerto fluvial de España, a ochenta kilómetros de la desembocadura. Fue lo que la convirtió en la puerta del comercio americano.":
    "Seville is Spain's only river port, eighty kilometres from the mouth. It is what made it the gateway of the American trade.",
  "¿Cuáles son las tres vertientes hidrográficas españolas?":
    "Which are Spain's three watersheds?",
  "Cantábrica, atlántica y mediterránea": "Cantabrian, Atlantic and Mediterranean",
  "Norte, centro y sur": "North, centre and south",
  "Atlántica, africana y balear": "Atlantic, African and Balearic",
  "Pirenaica, ibérica y bética": "Pyrenean, Iberian and Baetic",
  "La cantábrica tiene ríos cortos y caudalosos, la atlántica los grandes ríos peninsulares y la mediterránea es la más seca salvo por el Ebro.":
    "The Cantabrian one has short, full rivers, the Atlantic one the great rivers of the peninsula, and the Mediterranean one is the driest apart from the Ebro.",
  "¿En qué océano están las Islas Canarias?": "In which ocean are the Canary Islands?",
  "En el Mediterráneo": "In the Mediterranean",
  "En el Atlántico": "In the Atlantic",
  "En el Cantábrico": "In the Cantabrian Sea",
  "En el mar de Alborán": "In the Alboran Sea",
  "En el Atlántico, frente a la costa africana y a unos mil quinientos kilómetros de la Península. Las Baleares son las mediterráneas.":
    "In the Atlantic, off the African coast and some fifteen hundred kilometres from the peninsula. The Balearics are the Mediterranean ones.",
  "¿Qué particularidad horaria tienen las Canarias?":
    "What is unusual about the time in the Canaries?",
  "Tienen una hora menos que la Península": "They are an hour behind the peninsula",
  "Tienen una hora más": "They are an hour ahead",
  "No cambian la hora en verano": "They do not change the clocks in summer",
  "Ninguna: comparten horario con el resto del país":
    "Nothing: they keep the same time as the rest of the country",
  "Una hora menos, y es la única parte de España en otro huso. Los avisos horarios de la televisión española lo recuerdan a diario.":
    "An hour behind, and it is the only part of Spain in another time zone. Spanish television's time checks are a daily reminder of it.",
  "¿Cuál es el origen geológico de las Canarias?":
    "What is the geological origin of the Canaries?",
  "Sedimentario": "Sedimentary",
  "Volcánico": "Volcanic",
  "Coralino": "Coral",
  "Glaciar": "Glacial",
  "Volcánico, y el volcanismo sigue activo: la erupción de La Palma en 2021 lo recordó. El Teide es el mayor de esos edificios volcánicos.":
    "Volcanic, and the volcanism is still active: the La Palma eruption of 2021 was a reminder. Teide is the largest of those volcanic structures.",
  "¿Con qué países y territorios limita España?":
    "Which countries and territories does Spain border?",
  "Portugal, Francia, Andorra, Gibraltar y Marruecos":
    "Portugal, France, Andorra, Gibraltar and Morocco",
  "Portugal y Francia solamente": "Portugal and France only",
  "Portugal, Francia e Italia": "Portugal, France and Italy",
  "Portugal, Francia, Andorra e Italia": "Portugal, France, Andorra and Italy",
  "Con Marruecos por Ceuta y Melilla, y con el territorio británico de Gibraltar en el sur peninsular. Italia no comparte frontera terrestre con España.":
    "With Morocco through Ceuta and Melilla, and with the British territory of Gibraltar in the south of the peninsula. Italy shares no land border with Spain.",
  "¿Qué tienen de singular Ceuta y Melilla en el conjunto de la Unión Europea?":
    "What is singular about Ceuta and Melilla within the European Union?",
  "Son las únicas ciudades sin ayuntamiento": "They are the only cities with no town hall",
  "Son las únicas fronteras terrestres de la Unión con África":
    "They are the Union's only land borders with Africa",
  "Son las únicas exentas de impuestos": "They are the only ones free of taxes",
  "Son las únicas fuera del espacio Schengen": "They are the only ones outside the Schengen area",
  "Están en el norte de África y, por tanto, la Unión Europea tiene ahí su única frontera terrestre con el continente africano.":
    "They are in north Africa, and so it is there that the European Union has its only land border with the African continent.",
  "¿Cómo se conoce a la franja húmeda del norte peninsular?":
    "What is the damp strip of the north of the peninsula known as?",
  "La España seca": "Dry Spain",
  "La España verde": "Green Spain",
  "La España vaciada": "The emptied Spain",
  "La cornisa mediterránea": "The Mediterranean seaboard",
  "La España verde, de clima oceánico, con lluvias repartidas todo el año. La España vaciada designa en cambio el interior despoblado, que es otra cosa.":
    "Green Spain, of oceanic climate, with rain spread through the whole year. The emptied Spain names the depopulated interior instead, which is another matter.",
  "¿Cuántos apartados tiene el artículo 3 de la Constitución?":
    "How many paragraphs does Article 3 of the Constitution have?",
  "Tres: el castellano como lengua oficial del Estado, la cooficialidad de las demás según los estatutos, y la protección de las modalidades lingüísticas como patrimonio.":
    "Three: Castilian as the official language of the State, the co-official status of the others under their statutes, and the protection of the forms of speech as heritage.",
  "¿En qué comunidades es oficial el catalán?": "In which communities is Catalan official?",
  "Solo en Cataluña": "In Catalonia only",
  "En Cataluña y las Illes Balears, y en la Comunidad Valenciana con la denominación de valenciano":
    "In Catalonia and the Balearic Islands, and in the Valencian Community under the name of Valencian",
  "En Cataluña y Aragón": "In Catalonia and Aragon",
  "En toda la costa mediterránea": "Along the whole Mediterranean coast",
  "Tres comunidades, con la particularidad de la denominación que fija el estatuto valenciano. En Aragón hay hablantes en la franja oriental, pero sin oficialidad.":
    "Three communities, with the particular name the Valencian statute lays down. In Aragon there are speakers in the eastern strip, but with no official status.",
  "¿Con qué lengua comparte origen el gallego?":
    "Which language does Galician share an origin with?",
  "Con el castellano": "With Castilian",
  "Con el portugués": "With Portuguese",
  "Con el catalán": "With Catalan",
  "Con el asturiano": "With Asturian",
  "Ambos proceden del galaicoportugués medieval, y de ahí su proximidad. Todas las demás lenguas romances peninsulares vienen también del latín, pero por ramas distintas.":
    "Both come from medieval Galician-Portuguese, and hence their closeness. All the other Romance languages of the peninsula come from Latin too, but along different branches.",
  "¿En qué territorios es oficial el euskera?": "In which territories is Basque official?",
  "En el País Vasco y en la zona vascófona de Navarra":
    "In the Basque Country and in the Basque-speaking zone of Navarre",
  "Solo en el País Vasco": "In the Basque Country only",
  "En el País Vasco, Navarra y La Rioja": "In the Basque Country, Navarre and La Rioja",
  "En todo el norte peninsular": "Across the whole north of the peninsula",
  "En Navarra el régimen lingüístico varía por comarcas, con una zona vascófona, una mixta y una no vascófona. En el País Vasco es oficial en toda la comunidad.":
    "In Navarre the language regime varies from district to district, with a Basque-speaking zone, a mixed one and a non-Basque-speaking one. In the Basque Country it is official throughout the community.",
  "¿Qué es el euskera batua?": "What is euskera batua?",
  "Un dialecto del euskera hablado en Vizcaya": "A dialect of Basque spoken in Biscay",
  "El estándar escrito unificado, fijado desde los años sesenta":
    "The unified written standard, settled from the sixties on",
  "El nombre vasco de la Constitución": "The Basque name of the Constitution",
  "Un método de enseñanza para adultos": "A teaching method for adults",
  "Batua significa unificado. Antes de él el euskera tenía dialectos históricos sin una norma común escrita; el batua es lo que se enseña hoy en la escuela.":
    "Batua means unified. Before it Basque had historical dialects with no common written standard; batua is what is taught in schools today.",
  "¿De qué lengua es una variedad el aranés?": "Which language is Aranese a variety of?",
  "Del catalán": "Of Catalan",
  "Del occitano": "Of Occitan",
  "Del francés": "Of French",
  "Del aragonés": "Of Aragonese",
  "Del occitano, la lengua del sur de Francia. Es oficial en toda Cataluña desde 2006 y propia del Valle de Arán.":
    "Of Occitan, the language of the south of France. It has been official throughout Catalonia since 2006 and is native to the Aran Valley.",
  "¿Qué protege el tercer apartado del artículo 3?":
    "What does the third paragraph of Article 3 protect?",
  "Las lenguas cooficiales": "The co-official languages",
  "Las modalidades lingüísticas de España como patrimonio cultural":
    "Spain's forms of speech as cultural heritage",
  "El derecho a estudiar en la lengua materna": "The right to study in one's mother tongue",
  "El uso del castellano en la Administración": "The use of Castilian in the administration",
  "Es el apartado que ampara hablas sin cooficialidad como el asturiano, el aragonés, el leonés o la fala extremeña, con grados de reconocimiento que fijan las leyes autonómicas.":
    "It is the paragraph that shelters forms of speech without co-official status, such as Asturian, Aragonese, Leonese or the Extremaduran fala, with degrees of recognition that regional laws lay down.",
  "¿Cuál de estas hablas NO es cooficial en ninguna comunidad?":
    "Which of these forms of speech is NOT co-official in any community?",
  "El asturiano": "Asturian",
  "El asturiano, llamado también bable, está protegido por su estatuto pero no es lengua oficial. Las otras tres sí lo son en sus territorios.":
    "Asturian, also called bable, is protected by its statute but is not an official language. The other three are official in their territories.",
  "¿Cuántas personas hablan español en el mundo, aproximadamente?":
    "Roughly how many people speak Spanish in the world?",
  "Cien millones": "A hundred million",
  "Trescientos millones": "Three hundred million",
  "Seiscientos millones": "Six hundred million",
  "Mil millones": "A thousand million",
  "Alrededor de seiscientos millones, lo que la sitúa como segunda lengua materna del mundo tras el chino mandarín. La mayoría de sus hablantes no vive en España.":
    "Around six hundred million, which puts it second in the world as a mother tongue after Mandarin Chinese. Most of its speakers do not live in Spain.",
  "¿Qué país tiene más hispanohablantes?": "Which country has the most Spanish speakers?",
  "España": "Spain",
  "Argentina": "Argentina",
  "Colombia": "Colombia",
  "México": "Mexico",
  "México, con mucha diferencia. Es la razón de que la norma del español no se decida solo en Madrid, sino en común con las academias americanas.":
    "Mexico, by a long way. It is why the standard of Spanish is not settled in Madrid alone but jointly with the American academies.",
  "¿Cómo se llama la asociación que reúne a la RAE con las academias americanas?":
    "What is the association that brings the RAE together with the American academies called?",
  "La Asociación de Academias de la Lengua Española":
    "The Association of Academies of the Spanish Language",
  "La Organización de Estados Iberoamericanos": "The Organisation of Ibero-American States",
  "El Instituto Cervantes": "The Instituto Cervantes",
  "La Unión Panhispánica": "The Pan-Hispanic Union",
  "Con ella se publican en común diccionarios y gramáticas, en lo que se llama política panhispánica. El Instituto Cervantes se ocupa en cambio de difundir la lengua fuera.":
    "Through it dictionaries and grammars are published jointly, in what is called pan-Hispanic policy. The Instituto Cervantes takes care of spreading the language abroad instead.",
  "¿Qué organismo administra las pruebas de lengua para la nacionalidad?":
    "Which body administers the language tests for nationality?",
  "La Real Academia Española": "The Royal Spanish Academy",
  "La Escuela Oficial de Idiomas": "The Official Language School",
  "El Instituto Cervantes administra tanto el DELE como la prueba CCSE. El Ministerio de Justicia resuelve el expediente de nacionalidad, que es otra fase.":
    "The Instituto Cervantes administers both the DELE and the CCSE test. The Ministry of Justice decides the nationality file, which is another stage.",
  "¿Por qué la Constitución emplea la palabra castellano y no español?":
    "Why does the Constitution use the word Castilian and not Spanish?",
  "Porque español es un término americano": "Because Spanish is an American term",
  "Porque las demás lenguas de España también son españolas":
    "Because the other languages of Spain are Spanish too",
  "Porque castellano es más antiguo": "Because Castilian is older",
  "Por un error de redacción nunca corregido": "Because of a drafting error never put right",
  "Llamar español solo a una de ellas dejaría fuera al catalán, al gallego y al euskera, que son igualmente lenguas de España. Fuera del país predomina el término español.":
    "Calling only one of them Spanish would leave out Catalan, Galician and Basque, which are just as much languages of Spain. Outside the country the word Spanish prevails.",
  "¿Cuál es el sector económico más importante de España?":
    "Which is Spain's most important economic sector?",
  "La industria": "Industry",
  "Los servicios": "Services",
  "La minería": "Mining",
  "Los servicios, y dentro de ellos el turismo, que sitúa a España año tras año entre los primeros destinos del mundo por número de visitantes.":
    "Services, and within them tourism, which puts Spain year after year among the leading destinations in the world by number of visitors.",
  "¿Qué provincia abastece de hortalizas a buena parte de Europa en invierno?":
    "Which province supplies much of Europe with vegetables in winter?",
  "Almería": "Almería",
  "Valencia": "Valencia",
  "Murcia": "Murcia",
  "Huelva": "Huelva",
  "El mar de invernaderos de Almería, en la zona más árida de Europa continental, produce fuera de temporada gracias al clima y a la tecnología de riego.":
    "The sea of greenhouses in Almería, in the most arid area of continental Europe, produces out of season thanks to the climate and to irrigation technology.",
  "¿Qué particularidad tiene la industria automovilística española?":
    "What is particular about the Spanish car industry?",
  "Es la mayor de Europa": "It is the largest in Europe",
  "Fabrica mucho pero sin marcas propias: las plantas son de grupos extranjeros":
    "It builds a great deal but has no brands of its own: the plants belong to foreign groups",
  "Se concentra en una sola región": "It is concentrated in a single region",
  "Produce solo vehículos eléctricos": "It produces electric vehicles only",
  "España está entre los mayores fabricantes europeos, con plantas repartidas por varias comunidades, pero las marcas pertenecen a grupos con sede fuera del país.":
    "Spain is among the largest European manufacturers, with plants spread across several communities, but the brands belong to groups based outside the country.",
  "¿Qué energías renovables tienen más peso en España?":
    "Which renewable energies weigh most in Spain?",
  "La geotérmica y la mareomotriz": "Geothermal and tidal",
  "La eólica y la solar": "Wind and solar",
  "La biomasa y el carbón": "Biomass and coal",
  "La nuclear y la hidráulica": "Nuclear and hydroelectric",
  "El viento del interior y las horas de sol favorecen a ambas. La nuclear no es renovable, aunque también aporta a la generación.":
    "The wind of the interior and the hours of sunshine favour both. Nuclear power is not renewable, though it too contributes to generation.",
  "¿Cuál es el problema económico más persistente de España?":
    "Which is Spain's most persistent economic problem?",
  "La inflación": "Inflation",
  "El paro": "Unemployment",
  "La deuda externa privada": "Private external debt",
  "La escasez de energía": "Energy shortage",
  "La tasa de desempleo lleva décadas por encima de la media europea, con dos rasgos añadidos: el paro juvenil y la elevada temporalidad de los contratos.":
    "The unemployment rate has been above the European average for decades, with two added features: youth unemployment and the high share of fixed-term contracts.",
  "¿Qué es la temporalidad en el mercado laboral?":
    "What does temporary work mean in the labour market?",
  "El trabajo estacional en la agricultura": "Seasonal work in agriculture",
  "La proporción de contratos de duración limitada": "The share of contracts of limited duration",
  "El número de horas extraordinarias": "The amount of overtime",
  "La rotación entre sectores": "Movement between sectors",
  "Es la parte del empleo que no es indefinida, y en España ha sido históricamente alta en comparación europea. Afecta sobre todo a los trabajadores jóvenes.":
    "It is the part of employment that is not permanent, and in Spain it has historically been high by European comparison. It affects young workers above all.",
  "¿Qué caracteriza la demografía española actual?": "What marks Spain's present-day demography?",
  "Natalidad muy baja y esperanza de vida muy alta":
    "A very low birth rate and a very high life expectancy",
  "Natalidad alta y población joven": "A high birth rate and a young population",
  "Población estable desde 1980": "A stable population since 1980",
  "Emigración masiva y despoblación general": "Mass emigration and general depopulation",
  "La combinación de las dos cosas es lo que tensiona el sistema de pensiones a largo plazo. La esperanza de vida española está entre las mayores del mundo.":
    "The combination of the two is what strains the pension system in the long run. Spanish life expectancy is among the highest in the world.",
  "¿Qué financiaron en España los fondos estructurales y de cohesión europeos?":
    "What did the European structural and cohesion funds pay for in Spain?",
  "Las pensiones": "Pensions",
  "Carreteras, depuradoras, universidades y trenes":
    "Roads, water treatment plants, universities and trains",
  "La deuda pública": "Public debt",
  "Las nóminas de los funcionarios": "Civil servants' salaries",
  "Transformaron las infraestructuras del país en poco más de una década tras la entrada en 1986. Es el efecto más visible de la integración europea.":
    "They transformed the country's infrastructure in little more than a decade after it joined in 1986. It is the most visible effect of European integration.",
  "¿Cuántos años de residencia necesitan los nacionales iberoamericanos para pedir la nacionalidad?":
    "How many years of residence do Ibero-American nationals need to apply for nationality?",
  "Dos, frente a los diez del plazo general. El vínculo con América no es solo lingüístico: está también escrito en el Código Civil.":
    "Two, against the ten of the general rule. The tie with America is not only linguistic: it is written into the Civil Code as well.",
  "¿Qué reúnen periódicamente las Cumbres Iberoamericanas?":
    "Whom do the Ibero-American Summits bring together at intervals?",
  "A los jefes de Estado y de Gobierno de los países iberoamericanos":
    "The heads of state and government of the Ibero-American countries",
  "A los rectores de las universidades": "The heads of the universities",
  "A los ministros de Economía de la Unión Europea": "The economy ministers of the European Union",
  "A las academias de la lengua": "The academies of the language",
  "Son el marco institucional del vínculo con América Latina, junto con organismos comunes en educación y cultura.":
    "They are the institutional frame of the tie with Latin America, together with joint bodies in education and culture.",
  "¿Junto a qué país entró España en la Comunidad Económica Europea?":
    "Alongside which country did Spain join the European Economic Community?",
  "Junto a Grecia": "Alongside Greece",
  "Junto a Portugal": "Alongside Portugal",
  "Junto a Irlanda": "Alongside Ireland",
  "Sola": "On its own",
  "Con Portugal, el 1 de enero de 1986. Grecia había entrado cinco años antes, en 1981.":
    "With Portugal, on 1 January 1986. Greece had joined five years earlier, in 1981.",
  "¿De dónde proceden principalmente los residentes extranjeros en España?":
    "Where do foreign residents in Spain mainly come from?",
  "De América Latina, Europa del Este, Marruecos y la propia Unión Europea":
    "From Latin America, eastern Europe, Morocco and the European Union itself",
  "Solo de la Unión Europea": "From the European Union only",
  "Sobre todo de Asia oriental": "From east Asia above all",
  "Principalmente de América del Norte": "Mainly from North America",
  "El país del que salieron millones de emigrantes en el siglo XX cuenta hoy con varios millones de residentes extranjeros, y esos cuatro orígenes son los mayores.":
    "The country millions of emigrants left in the twentieth century now has several million foreign residents, and those four origins are the largest.",
  "¿Desde cuándo forma España parte del espacio Schengen?":
    "Since when has Spain been part of the Schengen area?",
  "Desde su entrada en la CEE en 1986": "Since it joined the EEC in 1986",
  "Desde los años noventa": "Since the nineties",
  "Desde la adopción del euro": "Since the adoption of the euro",
  "No forma parte de Schengen": "It is not part of Schengen",
  "La adhesión al acuerdo se firmó en 1991 y su aplicación llegó en 1995. Entrar en la Comunidad y entrar en Schengen fueron dos pasos distintos y separados por años.":
    "Accession to the agreement was signed in 1991 and it came into force in 1995. Joining the Community and joining Schengen were two separate steps, years apart.",
  "¿Qué norma desarrolla los derechos laborales básicos en España?":
    "Which law gives effect to the basic employment rights in Spain?",
  "El Código Civil": "The Civil Code",
  "El Estatuto de los Trabajadores": "The Workers' Statute",
  "La Ley de Bases": "The Framework Law",
  "El Reglamento de Empleo": "The Employment Regulation",
  "El Estatuto de los Trabajadores. Por debajo de él están los convenios colectivos, que pueden mejorar sus mínimos pero nunca empeorarlos.":
    "The Workers' Statute. Below it come the collective agreements, which can improve on its minimums but never worsen them.",
  "¿Qué artículo de la Constitución garantiza el derecho de huelga?":
    "Which article of the Constitution guarantees the right to strike?",
  "El artículo 28": "Article 28",
  "El artículo 37": "Article 37",
  "El artículo 41": "Article 41",
  "El 28, junto con la libertad sindical. El 35 recoge el derecho y deber de trabajar, el 37 la negociación colectiva y el 41 la Seguridad Social.":
    "Article 28, together with freedom of trade union association. Article 35 covers the right and the duty to work, Article 37 collective bargaining and Article 41 the Seguridad Social.",
  "¿Qué significan las siglas SMI?": "What do the initials SMI stand for?",
  "Sistema Mínimo de Ingresos": "Minimum income system",
  "Salario mínimo interprofesional": "Interprofessional minimum wage",
  "Seguro Mutuo Industrial": "Industrial mutual insurance",
  "Subsidio por Movilidad Interior": "Internal mobility allowance",
  "El suelo salarial para la jornada completa, que el Gobierno actualiza cada año por real decreto tras consultar a sindicatos y empresarios.":
    "The wage floor for full-time work, which the Government updates each year by royal decree after consulting the unions and the employers.",
  "¿Cuál es la jornada máxima legal en España?":
    "What is the maximum legal working week in Spain?",
  "Treinta y cinco horas semanales": "Thirty-five hours a week",
  "Cuarenta horas semanales de promedio anual": "Forty hours a week on average over the year",
  "Cuarenta y ocho horas semanales": "Forty-eight hours a week",
  "La que fije cada empresa": "Whatever each company sets",
  "Cuarenta horas de promedio en cómputo anual, lo que permite semanas más largas y más cortas siempre que la media se respete. Las horas extraordinarias tienen tope legal.":
    "Forty hours on average over the year, which allows longer and shorter weeks as long as the average is kept. Overtime has a legal ceiling.",
  "¿Qué es un contrato fijo discontinuo?": "What is a permanent seasonal contract?",
  "Un contrato temporal renovable cada año": "A temporary contract renewable each year",
  "Un contrato indefinido para trabajos estacionales o intermitentes":
    "A permanent contract for seasonal or intermittent work",
  "Un contrato a tiempo parcial": "A part-time contract",
  "Un contrato de formación": "A training contract",
  "Es indefinido, aunque la prestación se concentre en determinadas temporadas: a la persona se la llama cada campaña y conserva su antigüedad.":
    "It is permanent, even though the work falls in particular seasons: the person is called back each season and keeps their seniority.",
  "¿Pueden sustituirse las vacaciones por una compensación económica?":
    "Can holiday be replaced by a payment?",
  "Sí, si lo acuerdan empresa y trabajador": "Yes, if company and worker agree on it",
  "No: el descanso es obligatorio": "No: the rest is compulsory",
  "Sí, hasta la mitad de los días": "Yes, up to half the days",
  "Solo en los contratos temporales": "Only in temporary contracts",
  "La ley no permite cambiar vacaciones por dinero mientras dura el contrato. Solo se compensan en metálico las no disfrutadas cuando la relación laboral termina.":
    "The law does not allow holiday to be swapped for money while the contract lasts. Only the days not taken are paid in cash when the employment ends.",
  "¿Qué dos descuentos separan el salario bruto del neto?":
    "Which two deductions separate gross pay from net?",
  "Las cotizaciones a la Seguridad Social y la retención del IRPF":
    "Seguridad Social contributions and the IRPF withholding",
  "El IVA y el IRPF": "IVA and IRPF",
  "La cuota sindical y el seguro médico": "The union subscription and medical insurance",
  "El impuesto de sociedades y la retención": "Corporation tax and the withholding",
  "La cotización financia la sanidad, el paro y las pensiones; la retención es un adelanto del impuesto sobre la renta que se ajusta en la declaración anual.":
    "The contribution pays for health care, unemployment benefit and pensions; the withholding is an advance on income tax that is settled in the yearly return.",
  "¿Cuántas pagas extraordinarias son habituales y cuándo se cobran?":
    "How many extra payments are usual and when are they paid?",
  "Una, en diciembre": "One, in December",
  "Dos, en junio y en diciembre": "Two, in June and December",
  "Tres, repartidas por trimestres": "Three, spread over the quarters",
  "Ninguna: van siempre prorrateadas": "None: they are always spread over the months",
  "Dos, aunque muchos convenios permiten prorratearlas en las doce mensualidades, con lo que el importe mensual sube y las extras desaparecen del calendario.":
    "Two, though many agreements allow them to be spread across the twelve months, which raises the monthly figure and takes the extra payments off the calendar.",
  "¿Qué organismo gestiona la prestación por desempleo?": "Which body runs unemployment benefit?",
  "El SEPE": "The SEPE",
  "El Ministerio de Trabajo directamente": "The Ministry of Labour directly",
  "El Servicio Público de Empleo Estatal. Cobrar el paro exige haber cotizado un mínimo, y la duración depende de lo cotizado.":
    "The Servicio Público de Empleo Estatal, the state employment service. Drawing unemployment benefit requires a minimum of contributions, and how long it lasts depends on what was paid in.",
  "¿Qué documento resume todo lo que una persona ha cotizado?":
    "Which document sums up everything a person has contributed?",
  "El finiquito": "The finiquito",
  "La vida laboral": "The vida laboral",
  "El certificado de empresa": "The company certificate",
  "El informe de vida laboral, que puede pedirse en cualquier momento a la Seguridad Social. La nómina refleja un solo mes.":
    "The vida laboral report, the working life record, which can be asked of the Seguridad Social at any time. The payslip shows a single month.",
  "¿Qué diferencia hay entre finiquito e indemnización?":
    "What is the difference between the finiquito and a severance payment?",
  "Son dos nombres de lo mismo": "They are two names for the same thing",
  "El finiquito liquida lo pendiente y se cobra siempre; la indemnización solo corresponde en determinados despidos":
    "The finiquito settles what is outstanding and is always paid; severance is due only in certain dismissals",
  "La indemnización se cobra siempre y el finiquito solo si hay despido":
    "Severance is always paid and the finiquito only if there is a dismissal",
  "El finiquito lo paga el SEPE y la indemnización la empresa":
    "The finiquito is paid by the SEPE and severance by the company",
  "El finiquito incluye vacaciones no disfrutadas y pagas pendientes al terminar cualquier contrato. La indemnización se suma a él solo cuando el despido da derecho a ella.":
    "The finiquito includes holiday not taken and outstanding extra pay at the end of any contract. Severance is added to it only when the dismissal gives a right to it.",
  "¿Qué es un convenio colectivo?": "What is a collective agreement?",
  "Un contrato individual con la empresa": "An individual contract with the company",
  "Un acuerdo entre representantes de trabajadores y empresarios que fija condiciones para un sector o una empresa":
    "An agreement between workers' and employers' representatives that sets conditions for a sector or a company",
  "Una norma dictada por el Gobierno": "A rule issued by the Government",
  "Un pacto entre comunidades autónomas": "A pact between autonomous communities",
  "Puede ser de sector o de empresa, y mejora los mínimos legales: salarios, jornada, permisos. Se aplica a todo el ámbito que cubre, no solo a los afiliados.":
    "It may be by sector or by company, and it improves on the legal minimums: pay, hours, leave. It applies to everyone in its scope, not only to union members.",
  "¿Qué número acompaña a un trabajador toda su vida laboral?":
    "Which number stays with a worker for their whole working life?",
  "El número de afiliación a la Seguridad Social": "The Seguridad Social affiliation number",
  "El número de nómina": "The payroll number",
  "El código del convenio": "The agreement code",
  "El número de contrato": "The contract number",
  "Se obtiene con la primera alta y ya no cambia, aunque se cambie de empresa, de régimen o de comunidad.":
    "You get it when you are first registered and it never changes, however often you change company, regime or community.",
  "¿Cómo se financia el Sistema Nacional de Salud?": "How is the National Health System paid for?",
  "Con primas mensuales de los asegurados": "By monthly premiums from the insured",
  "Con impuestos": "By taxes",
  "Con las cuotas de las mutuas": "By the subscriptions of the mutual insurers",
  "Con los copagos farmacéuticos": "By the pharmaceutical co-payments",
  "Se financia con impuestos y es universal: no hay primas ni cuotas mensuales. El copago farmacéutico cubre solo una parte del precio de los medicamentos.":
    "It is paid for out of taxes and it is universal: there are no premiums and no monthly subscriptions. The pharmaceutical co-payment covers only part of the price of medicines.",
  "¿Quién gestiona la sanidad pública en España?": "Who runs the public health service in Spain?",
  "El Estado": "The State",
  "Los ayuntamientos": "The town halls",
  "Las diputaciones": "The provincial councils",
  "Las comunidades gestionan y el Estado fija las bases y coordina. De ahí que los tiempos de espera y la organización varíen de una a otra.":
    "The communities run it and the State sets the ground rules and coordinates. That is why waiting times and organisation vary from one to another.",
  "¿Cuál es la puerta de entrada habitual al sistema sanitario?":
    "What is the usual way into the health system?",
  "El hospital": "The hospital",
  "El centro de salud y el médico de familia": "The health centre and the family doctor",
  "La farmacia": "The pharmacy",
  "Urgencias": "Accident and emergency",
  "El médico de familia atiende, receta y deriva al especialista. A urgencias se puede acudir directamente, pero no es la vía ordinaria.":
    "The family doctor treats, prescribes and refers you to a specialist. You can go straight to accident and emergency, but it is not the ordinary route.",
  "¿Qué ocurre con la tarjeta sanitaria al mudarse a otra comunidad autónoma?":
    "What happens to the health card when you move to another autonomous community?",
  "Nada: es la misma en toda España": "Nothing: it is the same across Spain",
  "Hay que cambiarla y asignarse un nuevo médico":
    "You have to change it and be assigned a new doctor",
  "Deja de tener validez durante seis meses": "It stops being valid for six months",
  "La emite entonces el Estado": "The State issues it from then on",
  "La emite cada comunidad, así que al cambiar de residencia hay que tramitar una nueva. La atención está garantizada en toda España, pero el trámite es autonómico.":
    "Each community issues it, so on moving you have to apply for a new one. Care is guaranteed throughout Spain, but the paperwork is regional.",
  "¿De qué depende el porcentaje del copago farmacéutico?":
    "What does the pharmaceutical co-payment percentage depend on?",
  "De la edad": "On age",
  "De la renta": "On income",
  "De la comunidad autónoma": "On the autonomous community",
  "Del tipo de farmacia": "On the kind of pharmacy",
  "Se calcula en porcentaje según la renta, y los pensionistas tienen además topes mensuales que limitan lo que pueden llegar a pagar.":
    "It is worked out as a percentage according to income, and pensioners also have monthly ceilings that limit what they can end up paying.",
  "¿Entre qué edades es obligatoria la enseñanza en España?":
    "Between which ages is schooling compulsory in Spain?",
  "De 3 a 16 años": "From 3 to 16",
  "De 6 a 16 años": "From 6 to 16",
  "De 6 a 18 años": "From 6 to 18",
  "De 5 a 15 años": "From 5 to 15",
  "De los seis a los dieciséis, es decir, Primaria y ESO. Infantil no es obligatoria y Bachillerato o FP tampoco.":
    "From six to sixteen, that is, Primary and ESO. Infant school is not compulsory, and neither is the Bachillerato or vocational training.",
  "¿Cuántos cursos tiene la Educación Primaria?": "How many years does Primary education have?",
  "Seis cursos, de los seis a los doce años. La ESO tiene cuatro, de los doce a los dieciséis.":
    "Six years, from six to twelve. ESO has four, from twelve to sixteen.",
  "¿Qué significan las siglas ESO?": "What do the initials ESO stand for?",
  "Enseñanza Superior Obligatoria": "Compulsory higher education",
  "Educación Secundaria Obligatoria": "Compulsory secondary education",
  "Escuela Secundaria Oficial": "Official secondary school",
  "Estudios Superiores Ordinarios": "Ordinary higher studies",
  "Cuatro cursos entre los doce y los dieciséis años, al término de los cuales se obtiene el título de Graduado en ESO.":
    "Four years between twelve and sixteen, at the end of which you get the certificate of Graduate in ESO.",
  "¿Qué alternativa al Bachillerato existe después de la ESO?":
    "What alternative to the Bachillerato is there after ESO?",
  "La Formación Profesional de grado medio": "Intermediate vocational training",
  "El doctorado": "The doctorado",
  "Ninguna: el Bachillerato es obligatorio": "None: the Bachillerato is compulsory",
  "La FP de grado medio, y desde ella puede pasarse al grado superior y a la universidad. Ni el Bachillerato ni la FP son obligatorios.":
    "Intermediate vocational training, and from it you can move on to the higher grade and to university. Neither the Bachillerato nor vocational training is compulsory.",
  "¿Cuántos años dura un grado universitario en la mayoría de las carreras?":
    "How many years does a university grado last for most subjects?",
  "Cuatro años en la mayoría, seguidos opcionalmente de máster y doctorado. Algunas carreras como Medicina son más largas.":
    "Four years for most, optionally followed by a máster and a doctorado. Some subjects such as Medicine are longer.",
  "¿A partir de qué nota se aprueba en el sistema educativo español?":
    "From what mark do you pass in the Spanish education system?",
  "A partir del cuatro": "From four",
  "A partir del cinco": "From five",
  "A partir del seis": "From six",
  "A partir del diez": "From ten",
  "La escala va de cero a diez y se aprueba con cinco. En la universidad se usa la misma escala, con la mención de matrícula de honor para las mejores notas.":
    "The scale runs from zero to ten and five is a pass. The same scale is used at university, with the distinction of matrícula de honor for the best marks.",
  "¿Puede un centro concertado cobrar por la enseñanza en las etapas concertadas?":
    "Can a concertado school charge for teaching in the stages the concierto covers?",
  "Sí, libremente": "Yes, freely",
  "No: recibe fondos públicos precisamente a cambio de no hacerlo":
    "No: it receives public funds precisely in exchange for not doing so",
  "Sí, hasta un tope fijado por la comunidad": "Yes, up to a ceiling set by the community",
  "Solo en Bachillerato": "Only in the Bachillerato",
  "Ese es el trato del concierto: financiación pública a cambio de gratuidad en las etapas cubiertas. Las actividades complementarias sí pueden tener coste.":
    "That is the bargain of the concierto: public funding in exchange for free teaching in the stages covered. Extra activities may indeed have a cost.",
  "¿Qué prueba hay que superar para acceder a la universidad?":
    "Which test must be passed to enter university?",
  "Una prueba de acceso conocida durante décadas como selectividad":
    "An entrance exam known for decades as selectividad",
  "El título de Graduado en ESO": "The certificate of Graduate in ESO",
  "Una entrevista en la facultad": "An interview at the faculty",
  "Ninguna: basta con el Bachillerato": "None: the Bachillerato is enough",
  "Además de superar el Bachillerato hay que aprobar la prueba de acceso, cuyas siglas han cambiado varias veces pero que todo el mundo sigue llamando selectividad.":
    "Besides passing the Bachillerato you have to pass the entrance exam, whose initials have changed several times but which everybody still calls selectividad.",
  "¿Puede empadronarse una persona sin permiso de residencia?":
    "Can a person register on the padrón without a residence permit?",
  "No, hace falta autorización previa": "No, prior authorisation is needed",
  "Sí: el padrón registra dónde se vive, no la situación administrativa":
    "Yes: the padrón records where you live, not your administrative status",
  "Solo si tiene contrato de trabajo": "Only with an employment contract",
  "Solo en los municipios grandes": "Only in the large municipalities",
  "El padrón es un registro de residencia efectiva. De él dependen la tarjeta sanitaria y la escolarización, y por eso el acceso no se condiciona a la situación administrativa.":
    "The padrón is a record of where people actually live. The health card and school places depend on it, and that is why access is not made to depend on administrative status.",
  "¿Qué acredita un certificado de empadronamiento?": "What does a padrón certificate prove?",
  "El domicilio y el tiempo que se lleva residiendo en el municipio":
    "Your address and how long you have been living in the municipality",
  "La situación laboral": "Your employment situation",
  "El nivel de renta": "Your level of income",
  "Es la prueba habitual del tiempo de residencia, y por eso lo piden después otros expedientes, incluidos los de arraigo y nacionalidad.":
    "It is the usual proof of length of residence, and that is why other files ask for it later, including those for arraigo and for nationality.",
  "¿Qué significan las siglas TIE?": "What do the initials TIE stand for?",
  "Tarjeta de identidad de extranjero": "Foreigner's identity card",
  "Trámite de inscripción exterior": "External registration procedure",
  "Título de ingreso especial": "Special entry certificate",
  "Tasa de identificación estatal": "State identification fee",
  "Es el documento físico que acredita la autorización de residencia y lleva impreso el NIE. El NIE por sí solo es un número, no una tarjeta.":
    "It is the physical document that proves the residence authorisation and carries the NIE printed on it. The NIE on its own is a number, not a card.",
  "¿Qué necesitan los ciudadanos de la Unión Europea para residir en España?":
    "What do citizens of the European Union need in order to live in Spain?",
  "Una autorización de residencia": "A residence authorisation",
  "Un certificado de registro en el Registro Central de Extranjeros":
    "A registration certificate from the Central Register of Foreigners",
  "Un visado renovable cada año": "A visa renewable each year",
  "Nada en absoluto": "Nothing at all",
  "No necesitan permiso, pero sí inscribirse y obtener un certificado de registro, que es un trámite mucho más ligero que una autorización de residencia.":
    "They need no permit, but they do have to register and obtain a registration certificate, which is a much lighter step than a residence authorisation.",
  "¿Qué son las figuras de arraigo?": "What are the forms of arraigo?",
  "Ayudas económicas para familias numerosas": "Financial support for large families",
  "Vías de regularización para quien lleva tiempo en el país y acredita vínculos":
    "Routes to regularisation for those who have been in the country some time and can show ties",
  "Contratos agrícolas de temporada": "Seasonal agricultural contracts",
  "Programas de retorno voluntario": "Voluntary return programmes",
  "Hay arraigo social, laboral, familiar y para la formación, cada uno con requisitos propios. Todos parten de la permanencia acreditada en España.":
    "There is social, employment, family and training arraigo, each with its own requirements. All of them start from proven time spent in Spain.",
  "¿Qué permite la residencia de larga duración?": "What does long-term residence allow?",
  "Votar en las elecciones generales": "Voting in general elections",
  "Residir y trabajar de forma indefinida en las mismas condiciones que los españoles":
    "Living and working indefinitely on the same terms as Spaniards",
  "Obtener automáticamente la nacionalidad": "Getting nationality automatically",
  "Viajar sin pasaporte por toda Europa": "Travelling passport-free across Europe",
  "Salvo en lo que la ley reserva a la nacionalidad, como el voto en las generales. Es un paso anterior y distinto al de hacerse español.":
    "Except in what the law reserves to nationality, such as the vote in general elections. It is an earlier and separate step from becoming Spanish.",
  "¿Qué se necesita para hacer trámites con la Administración por internet?":
    "What do you need to deal with the administration online?",
  "Solo el NIE": "The NIE alone",
  "Una identidad digital: Cl@ve o un certificado digital":
    "A digital identity: Cl@ve or a digital certificate",
  "Una cuenta bancaria española": "A Spanish bank account",
  "Un correo electrónico verificado": "A verified email address",
  "Sin Cl@ve o certificado no se pide cita, no se descarga la vida laboral ni se presenta la declaración. Es hoy el requisito práctico para casi todo.":
    "Without Cl@ve or a certificate you cannot book an appointment, download your vida laboral or file your tax return. It is today the practical requirement for almost everything.",
  "¿Ante qué organismo se presenta la declaración de la renta?":
    "Which body is the tax return filed with?",
  "Ante la Seguridad Social": "With the Seguridad Social",
  "Ante la Agencia Tributaria": "With the Tax Agency",
  "Ante el ayuntamiento": "With the town hall",
  "Ante el Ministerio de Justicia": "With the Ministry of Justice",
  "Ante la Agencia Tributaria, normalmente entre abril y junio. Regulariza lo que ya se retuvo en la nómina, y puede salir a pagar o a devolver.":
    "With the Tax Agency, normally between April and June. It settles what was already withheld from the payslip, and it can end in a payment or a refund.",
  "¿Ante qué ministerio se tramita el expediente de nacionalidad?":
    "Which ministry handles the nationality file?",
  "Interior": "Interior",
  "Justicia": "Justice",
  "Inclusión y Seguridad Social": "Inclusion and Social Security",
  "Asuntos Exteriores": "Foreign Affairs",
  "El Ministerio de Justicia resuelve el expediente. Interior se ocupa de extranjería y las pruebas las administra el Instituto Cervantes: tres organismos distintos en un mismo camino.":
    "The Ministry of Justice decides the file. Interior deals with immigration and the Instituto Cervantes administers the tests: three different bodies on one road.",
  "¿Qué dos pruebas del Instituto Cervantes se exigen para la nacionalidad?":
    "Which two Instituto Cervantes tests are required for nationality?",
  "El DELE A2 y la CCSE": "The DELE A2 and the CCSE",
  "El DELE B1 y una entrevista": "The DELE B1 and an interview",
  "La CCSE y un examen de historia": "The CCSE and a history exam",
  "Un examen médico y uno de lengua": "A medical exam and a language one",
  "La de lengua a nivel A2, de la que están exentos los nacionales de países hispanohablantes, y la de conocimientos constitucionales y socioculturales.":
    "The language one at A2 level, from which nationals of Spanish-speaking countries are exempt, and the one on constitutional and sociocultural knowledge.",
  "¿Con qué acto se cierra la concesión de la nacionalidad?":
    "Which act closes the granting of nationality?",
  "Con la entrega del DNI": "The handing over of the DNI",
  "Con la jura o promesa de fidelidad al Rey y obediencia a la Constitución, y la inscripción en el Registro Civil":
    "The oath or promise of loyalty to the King and obedience to the Constitution, and registration in the Civil Registry",
  "Con una ceremonia en el ayuntamiento": "A ceremony at the town hall",
  "Con el pago de una tasa": "The payment of a fee",
  "El acto formal y la inscripción registral cierran el expediente. El DNI llega después, como consecuencia de ya ser español.":
    "The formal act and the entry in the register close the file. The DNI comes afterwards, as a consequence of already being Spanish.",
  "¿Qué documento necesita un extranjero además del NIE para ser dado de alta en un empleo?":
    "Which document does a foreigner need besides the NIE to be registered in a job?",
  "El certificado de empadronamiento": "The padrón certificate",
  "El carné de conducir": "The driving licence",
  "El pasaporte en vigor únicamente": "A valid passport only",
  "El número de la Seguridad Social es distinto del NIE y no lo sustituye: hace falta para el alta laboral y acompaña a la persona toda su vida.":
    "The Seguridad Social number is different from the NIE and does not replace it: it is needed to be registered in a job and stays with the person for life.",
  "¿Qué derecho da el empadronamiento a los ciudadanos de la Unión Europea?":
    "Which right does registering on the padrón give citizens of the European Union?",
  "Votar en las elecciones municipales": "Voting in local elections",
  "Acceder a la función pública": "Entering the civil service",
  "Obtener la nacionalidad en dos años": "Getting nationality in two years",
  "El voto municipal, tras la reforma constitucional de 1992 que lo permitió. Las generales siguen reservadas a quien tiene la nacionalidad española.":
    "The local vote, after the constitutional amendment of 1992 that allowed it. General elections stay reserved for those who hold Spanish nationality.",
  "¿A qué hora se come habitualmente en España?": "At what time is lunch usually eaten in Spain?",
  "Entre las doce y la una": "Between twelve and one",
  "Entre las dos y las tres": "Between two and three",
  "A las cuatro": "At four",
  "Antes de las doce": "Before twelve",
  "La comida del mediodía es la principal del día y se hace entre las dos y las tres, más tarde que en casi toda Europa. La cena llega a partir de las nueve.":
    "The midday meal is the main one of the day and is eaten between two and three, later than in almost all of Europe. Dinner comes from nine onwards.",
  "¿Qué explica en parte los horarios tardíos españoles?":
    "What partly explains the late Spanish timetable?",
  "El clima mediterráneo": "The Mediterranean climate",
  "Que España usa la hora de Europa central pese a estar a la longitud de Londres":
    "That Spain keeps central European time although it lies at the longitude of London",
  "La duración de la jornada escolar": "The length of the school day",
  "Una ley de horarios comerciales": "A law on shop opening hours",
  "El sol se pone más tarde de lo que marca el reloj, y las comidas se desplazan con él. La otra parte de la explicación es simple costumbre heredada.":
    "The sun sets later than the clock says, and meals move with it. The other half of the explanation is simple inherited habit.",
  "¿Cómo se llama el segundo desayuno de media mañana?":
    "What is the second breakfast of mid-morning called?",
  "La merienda": "La merienda",
  "El almuerzo": "El almuerzo",
  "La sobremesa": "La sobremesa",
  "El aperitivo": "El aperitivo",
  "En España almuerzo designa a menudo ese tentempié de media mañana. La merienda es de media tarde y la sobremesa el rato de charla tras la comida.":
    "In Spain almuerzo often names that mid-morning snack. La merienda is mid-afternoon and la sobremesa the spell of talk after the meal.",
  "¿Qué es la jornada partida?": "What is the jornada partida, the split day?",
  "Trabajar solo por la mañana": "Working mornings only",
  "Cerrar a mediodía y reabrir por la tarde": "Closing at midday and reopening in the afternoon",
  "Repartir la semana en cuatro días": "Spreading the week over four days",
  "Turnarse con otro empleado": "Taking turns with another employee",
  "Es más común cuanto más pequeño es el municipio. En las grandes ciudades muchos comercios ya no cierran a mediodía.":
    "It is more common the smaller the town. In the large cities many shops no longer close at midday.",
  "¿Qué papel tiene realmente la siesta en España?":
    "What part does the siesta really play in Spain?",
  "Es una práctica diaria generalizada": "It is a widespread daily practice",
  "Es sobre todo una costumbre de fin de semana y de verano":
    "It is above all a weekend and summer habit",
  "Está regulada por convenio en todos los sectores":
    "It is set by collective agreement in every sector",
  "Desapareció por completo en los años ochenta": "It disappeared altogether in the eighties",
  "La imagen internacional exagera su alcance: con jornadas y desplazamientos actuales, dormir a diario después de comer es minoritario entre semana.":
    "The picture abroad overstates how far it goes: with today's working hours and journeys, sleeping after lunch every day is a minority habit on weekdays.",
  "¿Qué es el tapeo?": "What is tapeo?",
  "Comer de pie en un restaurante": "Eating standing up in a restaurant",
  "Ir de bar en bar tomando algo pequeño con la bebida":
    "Going from bar to bar having something small with your drink",
  "Un menú infantil": "A children's menu",
  "Un tipo de cocina regional": "A kind of regional cooking",
  "En unas ciudades la tapa va incluida con la consumición y en otras se paga aparte. Es tanto una forma de comer como una forma de moverse por la calle.":
    "In some cities the tapa comes included with the drink and in others it is paid for separately. It is as much a way of moving about the street as a way of eating.",
  "¿Qué es la sobremesa?": "What is the sobremesa?",
  "El postre": "The dessert",
  "El rato de conversación que sigue a la comida, con la mesa ya recogida":
    "The stretch of conversation that follows the meal, with the table already cleared",
  "El mantel que se pone sobre la mesa": "The cloth put on the table",
  "La cuenta que se pide al final": "The bill asked for at the end",
  "Puede durar más que la propia comida, sobre todo en fin de semana, y es una de las costumbres que más llama la atención a quien llega de fuera.":
    "It can last longer than the meal itself, above all at weekends, and it is one of the customs that most strikes people arriving from abroad.",
  "¿En qué contextos se usa el usted en España?": "In which situations is usted used in Spain?",
  "Con casi todo el mundo, salvo la familia": "With almost everybody, apart from family",
  "Con personas mayores y en contextos muy formales":
    "With older people and in very formal settings",
  "Nunca: ha desaparecido del uso": "Never: it has gone out of use",
  "Solo por escrito": "In writing only",
  "El tuteo está mucho más extendido en España que en el resto del mundo hispanohablante: se tutea a compañeros, camareros y desconocidos de edad parecida.":
    "Tú is far more widespread in Spain than in the rest of the Spanish-speaking world: it is used with colleagues, with waiters and with strangers of a similar age.",
  "¿Qué tipo de vivienda predomina en las ciudades españolas?":
    "Which kind of home predominates in Spanish cities?",
  "La casa unifamiliar": "The detached house",
  "El piso en edificio": "The flat in a block",
  "La vivienda rural rehabilitada": "The restored country house",
  "El adosado": "The terraced house",
  "El piso es la forma dominante, y la propiedad está muy extendida: la proporción de hogares en vivienda propia es de las más altas de Europa, aunque el alquiler crece entre los jóvenes.":
    "The flat is the dominant form, and ownership is very widespread: the share of households in their own home is among the highest in Europe, though renting is growing among the young.",
  "¿Cómo se conoce a la selección española de fútbol?":
    "What is the Spanish football team known as?",
  "La Azzurra": "La Azzurra",
  "La Roja": "La Roja",
  "Los Azules": "Los Azules",
  "La Albiceleste": "La Albiceleste",
  "La Roja, por el color de la camiseta. La Azzurra es Italia y la Albiceleste Argentina.":
    "La Roja, from the colour of the shirt. La Azzurra is Italy and La Albiceleste Argentina.",
  "¿Cómo se llama la gran vuelta ciclista española?":
    "What is the great Spanish cycling tour called?",
  "El Giro": "The Giro",
  "La Vuelta a España": "The Vuelta a España",
  "El Tour": "The Tour",
  "La Ronda Ibérica": "The Ronda Ibérica",
  "La Vuelta a España, que se corre cada septiembre. El Giro es italiano y se corre en mayo, y el Tour francés en julio.":
    "The Vuelta a España, ridden each September. The Giro is Italian and is ridden in May, and the French Tour in July.",
  "¿Cómo se llama el partido entre los dos grandes clubes de fútbol españoles?":
    "What is the match between the two big Spanish football clubs called?",
  "El derbi": "El derbi",
  "El clásico": "El clásico",
  "La final": "La final",
  "El duelo": "El duelo",
  "El clásico. Derbi se reserva para los partidos entre equipos de la misma ciudad, como los dos de Madrid o los dos de Sevilla.":
    "El clásico. Derbi is kept for matches between teams from the same city, like the two in Madrid or the two in Seville.",
  "¿Por qué razón principal se independizan tarde los jóvenes españoles?":
    "What is the main reason young Spaniards leave home late?",
  "Por tradición familiar": "Family tradition",
  "Por razones económicas: precios de la vivienda y empleo inestable":
    "Economic reasons: housing prices and unstable work",
  "Porque la ley lo dificulta": "Because the law makes it hard",
  "Porque estudian más años que en otros países":
    "Because they study for more years than in other countries",
  "La edad media de emancipación es de las más altas de Europa, y las encuestas apuntan sobre todo al coste de la vivienda y a la inestabilidad del primer empleo.":
    "The average age of leaving home is among the highest in Europe, and surveys point above all to the cost of housing and to the instability of a first job.",
};
