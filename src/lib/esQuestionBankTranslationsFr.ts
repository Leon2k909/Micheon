/**
 * French for the Vivir en Espana practice questions.
 *
 * The lesson cards are answered by VIVIR_EN_ESPANA_FR. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in French and then asked its
 * questions in Spanish.
 *
 * Keyed on the SPANISH source text exactly as it appears in esQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an n for
 * an ñ or a plain question mark where the sentence opens with ¿, and the
 * lookup misses in silence. The question renders in Spanish, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS SPANISH follows VIVIR_EN_ESPANA_FR exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - an institution French has a settled name for takes it — the Congreso de
 *     los Diputados is the Congrès des députés, the Tribunal Supremo le
 *     Tribunal suprême;
 *   - the Cortes keep their own name, which French uses as it is;
 *   - where the word IS the answer and French has nothing for it — DNI, NIE,
 *     Seguridad Social, empadronamiento, padrón, arraigo, DELE, CCSE, ESO —
 *     the French gives the meaning and keeps the Spanish word beside it, so
 *     the reader learns the term they will actually meet on the form.
 *
 * The keep list in check-fr-bank-translation was measured against this table
 * before it was written down. TIE, IRPF, SEPE, Cl@ve and selectividad are
 * each in fewer than three keys and sit under the threshold the gate fires
 * at, so listing them would only be decoration.
 *
 * Seventy-five of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that VIVIR_EN_ESPANA_FR already
 * answers. Every French table is spread into one object, so a key present in
 * two of them would lose one silently — the later spread would decide both.
 * check-fr-bank-translation measures coverage through translateCourseText,
 * the lookup a reader's tap actually goes through, so those count as answered
 * and are not duplicated here.
 */
export const ES_QUESTION_BANK_FR: Record<string, string> = {
  "¿Qué artículo de la Constitución describe la bandera?":
    "Quel article de la Constitution décrit le drapeau ?",
  "El artículo 1": "L'article 1",
  "El artículo 3": "L'article 3",
  "El artículo 4": "L'article 4",
  "El artículo 11": "L'article 11",
  "El artículo 4. El 3 se ocupa de las lenguas y el 11 de la nacionalidad: los tres están en el título preliminar y se confunden con facilidad.":
    "L'article 4. Le 3 traite des langues et le 11 de la nationalité : les trois se trouvent dans le titre préliminaire et se confondent aisément.",
  "¿En el reinado de quién se adoptaron el rojo y el amarillo?":
    "Sous le règne de qui le rouge et le jaune furent-ils adoptés ?",
  "De Felipe II": "De Philippe II",
  "De Carlos III": "De Charles III",
  "De Fernando VII": "De Ferdinand VII",
  "De Alfonso XIII": "D'Alphonse XIII",
  "Carlos III convocó en 1785 un concurso para dotar a la Armada de un pabellón distinguible. De la marina pasó al ejército y, ya en el siglo XIX, a bandera nacional.":
    "Charles III ouvrit en 1785 un concours pour donner à la flotte un pavillon reconnaissable. De la marine il passa à l'armée de terre et, au dix-neuvième siècle, au rang de drapeau national.",
  "¿Por qué se eligieron el rojo y el amarillo para el pabellón?":
    "Pourquoi le rouge et le jaune furent-ils choisis pour le pavillon ?",
  "Por ser los colores de la Casa Real": "Parce que ce sont les couleurs de la maison royale",
  "Para que la escuadra se distinguiera desde lejos en el mar":
    "Pour que l'escadre se distingue de loin en mer",
  "Por recordar el oro de América": "Parce qu'ils rappellent l'or d'Amérique",
  "Por imitar a la bandera francesa": "Pour imiter le drapeau français",
  "Casi todas las flotas europeas usaban fondos blancos con escudos y de lejos se confundían. El rojo y el amarillo se ven a mucha distancia: la razón fue práctica antes que simbólica.":
    "Presque toutes les flottes d'Europe portaient des fonds blancs à écusson et se confondaient de loin. Le rouge et le jaune se voient de très loin : la raison fut pratique avant d'être symbolique.",
  "¿Qué reino representa la granada situada al pie del escudo?":
    "Quel royaume la grenade placée au bas de l'écu représente-t-elle ?",
  "Navarra": "La Navarre",
  "Aragón": "L'Aragon",
  "León": "Le León",
  "La granada recuerda el reino nazarí incorporado en 1492, el último de la Península. Navarra aporta las cadenas y Aragón los cuatro palos.":
    "La grenade rappelle le royaume nasride incorporé en 1492, le dernier de la péninsule. La Navarre apporte les chaînes et l'Aragon les quatre pals.",
  "¿Qué lema llevan las columnas de Hércules del escudo?":
    "Quelle devise portent les colonnes d'Hercule de l'écu ?",
  "PLUS ULTRA": "PLUS ULTRA",
  "NON PLUS ULTRA": "NON PLUS ULTRA",
  "UNA GRANDE Y LIBRE": "UNA GRANDE Y LIBRE",
  "TANTO MONTA": "TANTO MONTA",
  "Plus ultra, más allá. Antes del descubrimiento de América el lema era el contrario, non plus ultra: nada más allá del estrecho. Se le quitó la negación.":
    "Plus ultra, plus loin. Avant la découverte de l'Amérique, la devise disait le contraire, non plus ultra : rien au-delà du détroit. On lui a ôté la négation.",
  "¿Cómo se llama el himno nacional español?": "Comment s'appelle l'hymne national espagnol ?",
  "Himno de Riego": "« Himno de Riego »",
  "Marcha Real": "« Marcha Real »",
  "La Marsellesa": "« La Marseillaise »",
  "Cara al sol": "« Cara al sol »",
  "La Marcha Real. El Himno de Riego fue el himno de la Segunda República, entre 1931 y 1939.":
    "La Marcha Real. L'Himno de Riego fut l'hymne de la Seconde République, entre 1931 et 1939.",
  "¿Desde qué año está documentado el himno español?":
    "Depuis quelle année l'hymne espagnol est-il attesté ?",
  "Desde 1492": "Depuis 1492",
  "Desde 1761": "Depuis 1761",
  "Desde 1812": "Depuis 1812",
  "Desde 1978": "Depuis 1978",
  "Aparece en 1761 como Marcha Granadera, lo que lo convierte en uno de los himnos más antiguos de Europa.":
    "Il paraît en 1761 sous le nom de Marcha Granadera, ce qui en fait l'un des plus anciens hymnes d'Europe.",
  "¿Qué se celebra el 6 de diciembre?": "Que célèbre-t-on le 6 décembre ?",
  "La Fiesta Nacional": "La fête nationale",
  "La proclamación del rey": "La proclamation du roi",
  "El Día de la Hispanidad": "Le jour de l'hispanité",
  "El Día de la Constitución, por el referéndum de 1978. La Fiesta Nacional es el 12 de octubre, y el Día de la Hispanidad es otro nombre para esa misma fecha.":
    "Le jour de la Constitution, en souvenir du référendum de 1978. La fête nationale tombe le 12 octobre, et le jour de l'hispanité est un autre nom pour cette même date.",
  "¿Qué se conmemora el 2 de mayo en la Comunidad de Madrid?":
    "Que commémore-t-on le 2 mai dans la communauté de Madrid ?",
  "La entrada de los Reyes Católicos en Granada": "L'entrée des Rois catholiques à Grenade",
  "El levantamiento de 1808 contra las tropas de Napoleón":
    "Le soulèvement de 1808 contre les troupes de Napoléon",
  "La proclamación de la Segunda República": "La proclamation de la Seconde République",
  "La aprobación del Estatuto de Autonomía": "L'adoption du statut d'autonomie",
  "El levantamiento del pueblo de Madrid en 1808, que abre la Guerra de la Independencia. Es fiesta de la comunidad, no nacional.":
    "Le soulèvement du peuple de Madrid en 1808, qui ouvre la guerre d'Indépendance. C'est une fête de la communauté, non une fête nationale.",
  "¿Qué lengua declara oficial del Estado el artículo 3?":
    "Quelle langue l'article 3 déclare-t-il officielle dans l'État ?",
  "El castellano": "Le castillan",
  "El español y el catalán": "L'espagnol et le catalan",
  "Todas las lenguas de España por igual": "Toutes les langues d'Espagne à égalité",
  "No lo dice ningún artículo": "Aucun article ne le dit",
  "El castellano es la lengua española oficial del Estado, y el mismo artículo añade que las demás lenguas españolas serán también oficiales en sus respectivas comunidades.":
    "Le castillan est la langue espagnole officielle de l'État, et le même article ajoute que les autres langues d'Espagne seront elles aussi officielles dans leurs communautés respectives.",
  "¿Cuál es la diferencia entre la bandera con escudo y la bandera sin escudo?":
    "Quelle est la différence entre le drapeau à écu et le drapeau sans écu ?",
  "La de los edificios oficiales lleva escudo; la de uso común normalmente no":
    "Celui des bâtiments officiels porte l'écu ; celui d'usage courant, d'ordinaire, non",
  "La del escudo solo puede usarla la Casa Real":
    "Seule la maison royale peut employer celui à l'écu",
  "La sin escudo está prohibida": "Celui sans écu est interdit",
  "Son banderas de dos épocas distintas": "Ce sont des drapeaux de deux époques différentes",
  "Ambas son correctas. La versión oficial, la de organismos y actos del Estado, incorpora el escudo; la que se cuelga de un balcón o se ve en un estadio suele ser la lisa.":
    "Les deux sont corrects. La version officielle, celle des organismes et des actes de l'État, porte l'écu ; celui qu'on accroche à un balcon ou qu'on voit dans un stade est d'ordinaire le drapeau uni.",
  "¿Qué figuras ocupan los dos primeros cuarteles del escudo?":
    "Quelles figures occupent les deux premiers quartiers de l'écu ?",
  "Un águila y una cruz": "Un aigle et une croix",
  "Un castillo y un león": "Un château et un lion",
  "Dos columnas": "Deux colonnes",
  "Una granada y unas cadenas": "Une grenade et des chaînes",
  "El castillo de Castilla y el león de León. Las cadenas son de Navarra, la granada del reino de Granada y las columnas enmarcan el conjunto.":
    "Le château de Castille et le lion du León. Les chaînes sont de Navarre, la grenade du royaume de Grenade, et les colonnes encadrent l'ensemble.",
  "¿Qué reino representan las cadenas del escudo?":
    "Quel royaume les chaînes de l'écu représentent-elles ?",
  "Castilla": "La Castille",
  "Portugal": "Le Portugal",
  "Las cadenas son el emblema de Navarra. Aragón aporta los cuatro palos rojos sobre fondo dorado, y Portugal nunca formó parte del escudo.":
    "Les chaînes sont l'emblème de la Navarre. L'Aragon apporte les quatre pals rouges sur fond d'or, et le Portugal n'a jamais figuré sur l'écu.",
  "¿Cuántos artículos tiene la Constitución española?":
    "Combien d'articles compte la Constitution espagnole ?",
  "Noventa y nueve": "Quatre-vingt-dix-neuf",
  "Ciento sesenta y nueve": "Cent soixante-neuf",
  "Ciento sesenta y nueve, repartidos en un título preliminar y diez títulos, más las disposiciones finales. Es un texto largo para los estándares europeos.":
    "Cent soixante-neuf, répartis en un titre préliminaire et dix titres, plus les dispositions finales. C'est un texte long à l'échelle européenne.",
  "¿Cuándo entró en vigor la Constitución?": "Quand la Constitution est-elle entrée en vigueur ?",
  "El 1 de enero de 1979": "Le 1er janvier 1979",
  "El 29 de diciembre, el día de su publicación en el Boletín Oficial del Estado. El 6 fue el referéndum y el 27 la sanción del rey.":
    "Le 29 décembre, jour de sa publication au journal officiel. Le 6 fut le référendum et le 27 la sanction du roi.",
  "¿Cómo se conoce a los siete diputados que redactaron el borrador?":
    "Comment appelle-t-on les sept députés qui rédigèrent l'avant-projet ?",
  "Los constituyentes": "Les constituants",
  "Los padres de la Constitución": "Les pères de la Constitution",
  "La comisión de notables": "La commission des notables",
  "El consejo de redacción": "Le comité de rédaction",
  "Se les llama los padres de la Constitución. Pertenecían a partidos distintos, lo que era el punto: el texto se escribió para que ninguna fuerza quedara fuera.":
    "On les appelle les pères de la Constitution. Ils appartenaient à des partis différents, et c'était bien là le propos : le texte fut écrit pour qu'aucune force ne reste dehors.",
  "¿Qué palabra resume el método con el que se redactó la Constitución?":
    "Quel mot résume la méthode avec laquelle la Constitution fut rédigée ?",
  "Imposición": "L'imposition",
  "Consenso": "Le consensus",
  "Plebiscito": "Le plébiscite",
  "Codificación": "La codification",
  "Consenso. Algunos artículos son deliberadamente amplios porque se acordó la frase precisamente por admitir más de una lectura: era el precio de que nadie quedara excluido.":
    "Le consensus. Certains articles sont volontairement larges parce que la phrase fut arrêtée précisément parce qu'elle admettait plus d'une lecture : c'était le prix à payer pour que personne ne soit exclu.",
  "¿Qué título de la Constitución trata de la organización territorial del Estado?":
    "Quel titre de la Constitution traite de l'organisation territoriale de l'État ?",
  "El título preliminar": "Le titre préliminaire",
  "El título I": "Le titre I",
  "El título VI": "Le titre VI",
  "El título VIII": "Le titre VIII",
  "El título VIII. De él nacen las comunidades autónomas, y por eso al modelo se le llama a veces Estado del título VIII.":
    "Le titre VIII. C'est de lui que naissent les communautés autonomes, et c'est pourquoi l'on appelle parfois ce modèle l'État du titre VIII.",
  "¿Qué artículos forman el título preliminar?": "Quels articles forment le titre préliminaire ?",
  "Del 1 al 9": "De 1 à 9",
  "Del 1 al 14": "De 1 à 14",
  "Del 10 al 55": "De 10 à 55",
  "Del 1 al 29": "De 1 à 29",
  "Del 1 al 9: qué es España, dónde reside la soberanía, las lenguas, la bandera, la capital. Del 10 al 55 va el título I, sobre derechos y deberes.":
    "De 1 à 9 : ce qu'est l'Espagne, où réside la souveraineté, les langues, le drapeau, la capitale. De 10 à 55 court le titre I, sur les droits et les devoirs.",
  "¿Qué dos afirmaciones contiene el artículo 2?":
    "Quelles deux affirmations l'article 2 contient-il ?",
  "La unidad de la Nación y el derecho a la autonomía de nacionalidades y regiones":
    "L'unité de la Nation et le droit à l'autonomie des nationalités et des régions",
  "La soberanía popular y la monarquía parlamentaria":
    "La souveraineté populaire et la monarchie parlementaire",
  "La oficialidad del castellano y de las demás lenguas":
    "Le caractère officiel du castillan et des autres langues",
  "La igualdad ante la ley y la prohibición de discriminación":
    "L'égalité devant la loi et l'interdiction de la discrimination",
  "Las dos mitades se acordaron juntas y ninguna se entiende sin la otra. Sobre ellas se construyó después todo el Estado autonómico.":
    "Les deux moitiés furent arrêtées ensemble et aucune ne se comprend sans l'autre. C'est sur elles que fut bâti ensuite tout l'État des autonomies.",
  "¿Qué artículo se reformó en 2011?": "Quel article fut révisé en 2011 ?",
  "El artículo 13": "L'article 13",
  "El artículo 135": "L'article 135",
  "El artículo 2": "L'article 2",
  "El artículo 168": "L'article 168",
  "El 135, sobre estabilidad presupuestaria, en plena crisis de deuda. La otra reforma, la de 1992, tocó el artículo 13.":
    "Le 135, sur l'équilibre budgétaire, en pleine crise de la dette. L'autre révision, celle de 1992, a touché l'article 13.",
  "¿Por qué se reformó la Constitución en 1992?":
    "Pourquoi la Constitution fut-elle révisée en 1992 ?",
  "Para permitir el voto de extranjeros en las elecciones municipales tras Maastricht":
    "Pour permettre le vote des étrangers aux élections municipales après Maastricht",
  "Para introducir el euro": "Pour introduire l'euro",
  "Para reformar el Senado": "Pour réformer le Sénat",
  "Para ampliar las competencias autonómicas": "Pour élargir les compétences des communautés",
  "El Tratado de Maastricht obligaba a reconocer el sufragio pasivo en las municipales a los ciudadanos comunitarios, y hubo que añadir dos palabras al artículo 13.":
    "Le traité de Maastricht obligeait à reconnaître aux citoyens de la Communauté l'éligibilité aux municipales, et il fallut ajouter deux mots à l'article 13.",
  "¿Qué procedimiento de reforma obliga a disolver las Cortes y convocar elecciones?":
    "Quelle procédure de révision oblige à dissoudre les Cortes et à convoquer des élections ?",
  "El del artículo 167": "Celle de l'article 167",
  "El del artículo 168": "Celle de l'article 168",
  "El del artículo 92": "Celle de l'article 92",
  "Ninguno lo exige": "Aucune ne l'exige",
  "El procedimiento agravado del artículo 168, que además exige dos tercios de ambas cámaras antes y después, y un referéndum obligatorio al final.":
    "La procédure renforcée de l'article 168, qui exige en outre les deux tiers des deux chambres avant et après, et un référendum obligatoire à la fin.",
  "¿Qué partes de la Constitución protege el procedimiento agravado?":
    "Quelles parties de la Constitution la procédure renforcée protège-t-elle ?",
  "Solo el título de la Corona": "Le seul titre sur la Couronne",
  "El título preliminar, los derechos fundamentales de la sección primera y el título de la Corona":
    "Le titre préliminaire, les droits fondamentaux de la première section et le titre sur la Couronne",
  "Todo el texto por igual": "Le texte entier, également",
  "Solo el título VIII": "Le seul titre VIII",
  "Son las tres partes que el constituyente quiso poner casi fuera de alcance. Todo lo demás se reforma por el procedimiento ordinario, con tres quintos de cada cámara.":
    "Ce sont les trois parties que le constituant a voulu mettre presque hors d'atteinte. Tout le reste se révise par la procédure ordinaire, aux trois cinquièmes de chaque chambre.",
  "¿Quién sancionó la Constitución en diciembre de 1978?":
    "Qui a sanctionné la Constitution en décembre 1978 ?",
  "El presidente del Gobierno": "Le président du gouvernement",
  "El rey": "Le roi",
  "El presidente de las Cortes": "Le président des Cortes",
  "El rey la sancionó el 27 de diciembre, después de que las Cortes la aprobaran y el pueblo la ratificara en referéndum.":
    "Le roi l'a sanctionnée le 27 décembre, après que les Cortes l'eurent adoptée et que le peuple l'eut ratifiée par référendum.",
  "¿Qué mayoría exige el procedimiento ordinario de reforma?":
    "Quelle majorité la procédure ordinaire de révision exige-t-elle ?",
  "Mayoría simple de cada cámara": "La majorité simple de chaque chambre",
  "Mayoría absoluta del Congreso": "La majorité absolue du Congrès",
  "Tres quintos de cada cámara": "Les trois cinquièmes de chaque chambre",
  "Dos tercios de cada cámara": "Les deux tiers de chaque chambre",
  "Tres quintos de Congreso y Senado. Los dos tercios corresponden al procedimiento agravado del artículo 168, que además obliga a disolver las Cortes.":
    "Les trois cinquièmes du Congrès et du Sénat. Les deux tiers relèvent de la procédure renforcée de l'article 168, qui oblige en outre à dissoudre les Cortes.",
  "¿Qué artículos están protegidos por el recurso de amparo?":
    "Quels articles le recours en amparo protège-t-il ?",
  "Del 14 al 29": "De 14 à 29",
  "Del 30 al 38": "De 30 à 38",
  "Del 39 al 52": "De 39 à 52",
  "Del 14 al 29: la igualdad y los derechos fundamentales y libertades públicas. Los de los artículos 39 a 52 son principios rectores y no llegan al amparo.":
    "De 14 à 29 : l'égalité, les droits fondamentaux et les libertés publiques. Ceux des articles 39 à 52 sont des principes directeurs et n'ouvrent pas l'amparo.",
  "¿Qué establece el artículo 14?": "Qu'établit l'article 14 ?",
  "El derecho a la vida": "Le droit à la vie",
  "La igualdad ante la ley sin discriminación alguna":
    "L'égalité devant la loi, sans aucune discrimination",
  "La libertad de expresión": "La liberté d'expression",
  "El derecho a la educación": "Le droit à l'instruction",
  "La igualdad ante la ley, sin que pueda prevalecer discriminación por nacimiento, raza, sexo, religión, opinión o cualquier otra condición personal o social.":
    "L'égalité devant la loi, sans que puisse prévaloir de discrimination pour la naissance, la race, le sexe, la religion, l'opinion ou toute autre condition personnelle ou sociale.",
  "¿Qué abolió el artículo 15?": "Qu'a aboli l'article 15 ?",
  "La esclavitud": "L'esclavage",
  "La pena de muerte": "La peine de mort",
  "La prisión por deudas": "La prison pour dettes",
  "La pena de muerte, con una salvedad inicial para las leyes penales militares en tiempo de guerra. Esa excepción se suprimió por ley en 1995.":
    "La peine de mort, avec une réserve initiale pour les lois pénales militaires en temps de guerre. Cette exception fut supprimée par une loi de 1995.",
  "¿Cuándo desapareció por completo la pena de muerte del ordenamiento español?":
    "Quand la peine de mort a-t-elle entièrement disparu du droit espagnol ?",
  "En 1985": "En 1985",
  "En 1995": "En 1995",
  "En 2005": "En 2005",
  "La Constitución la abolió en 1978 salvo para las leyes penales militares en tiempo de guerra, y esa última excepción se eliminó por ley en 1995.":
    "La Constitution l'a abolie en 1978, sauf pour les lois pénales militaires en temps de guerre, et cette dernière exception a été supprimée par une loi de 1995.",
  "¿Qué protege el artículo 18?": "Que protège l'article 18 ?",
  "El honor, la intimidad, el domicilio y el secreto de las comunicaciones":
    "L'honneur, la vie privée, le domicile et le secret des communications",
  "El derecho de huelga": "Le droit de grève",
  "La libertad de circulación": "La liberté de circulation",
  "El derecho de petición": "Le droit de pétition",
  "Es el artículo de la vida privada: honor, intimidad, propia imagen, inviolabilidad del domicilio y secreto de las comunicaciones.":
    "C'est l'article de la vie privée : honneur, intimité, image de soi, inviolabilité du domicile et secret des communications.",
  "¿En qué casos puede entrarse en un domicilio sin permiso del titular?":
    "Dans quels cas peut-on entrer dans un domicile sans la permission de celui qui l'occupe ?",
  "Nunca": "Jamais",
  "Con resolución judicial o en caso de delito flagrante":
    "Sur décision de justice ou en cas de flagrant délit",
  "Siempre que lo pida la policía": "Chaque fois que la police le demande",
  "Con autorización del ayuntamiento": "Avec l'autorisation de la municipalité",
  "El domicilio es inviolable. Solo caben el consentimiento del titular, la resolución judicial y el delito flagrante: fuera de esos tres supuestos, la entrada es ilegal.":
    "Le domicile est inviolable. Seuls valent le consentement de l'occupant, la décision de justice et le flagrant délit : hors de ces trois cas, l'entrée est illégale.",
  "¿Para qué sirve el habeas corpus?": "À quoi sert l'habeas corpus ?",
  "Para recurrir una sentencia firme": "À attaquer un jugement définitif",
  "Para llevar de inmediato ante un juez a quien esté detenido ilegalmente":
    "À conduire sans délai devant un juge celui qui est détenu illégalement",
  "Para pedir asistencia letrada gratuita": "À demander l'assistance gratuite d'un avocat",
  "Para impugnar una ley ante el Tribunal Constitucional":
    "À contester une loi devant le Tribunal constitutionnel",
  "Está previsto en el artículo 17 y sirve para poner sin demora a un detenido a disposición judicial. Es la garantía práctica del límite de las setenta y dos horas.":
    "Il est prévu à l'article 17 et sert à mettre sans délai une personne détenue à la disposition de la justice. C'est la garantie concrète de la limite de soixante-douze heures.",
  "¿Hace falta autorización para celebrar una manifestación en la vía pública?":
    "Faut-il une autorisation pour tenir une manifestation sur la voie publique ?",
  "Sí, la autoridad debe concederla": "Oui, l'autorité doit l'accorder",
  "No: basta comunicarla previamente a la autoridad":
    "Non : il suffit de la déclarer à l'avance à l'autorité",
  "Solo si participan más de mil personas": "Seulement si plus de mille personnes y prennent part",
  "Solo en las capitales de provincia": "Seulement dans les chefs-lieux de province",
  "El artículo 21 exige comunicación previa, no autorización. La autoridad solo puede prohibirla por razones fundadas de alteración del orden público con peligro para personas o bienes.":
    "L'article 21 exige une déclaration préalable, non une autorisation. L'autorité ne peut l'interdire que pour des raisons fondées de trouble à l'ordre public mettant en danger les personnes ou les biens.",
  "¿Qué prohíbe expresamente el artículo 20 en materia de prensa?":
    "Qu'interdit expressément l'article 20 en matière de presse ?",
  "La publicidad": "La publicité",
  "La censura previa": "La censure préalable",
  "Las publicaciones extranjeras": "Les publications étrangères",
  "El anonimato de las fuentes": "L'anonymat des sources",
  "La censura previa. El mismo artículo reconoce la libertad de expresión y el derecho a comunicar y recibir información veraz.":
    "La censure préalable. Le même article reconnaît la liberté d'expression et le droit de communiquer et de recevoir une information véridique.",
  "¿A qué deben orientarse las penas privativas de libertad?":
    "Vers quoi les peines privatives de liberté doivent-elles tendre ?",
  "A la retribución del daño causado": "Vers la réparation du dommage causé",
  "A la reeducación y la reinserción social": "Vers la rééducation et la réinsertion sociale",
  "A la disuasión de terceros": "Vers la dissuasion des autres",
  "Al resarcimiento de la víctima": "Vers le dédommagement de la victime",
  "El artículo 25 fija la reeducación y la reinserción como orientación de las penas y las medidas de seguridad. Es un mandato constitucional, no una recomendación.":
    "L'article 25 fixe la rééducation et la réinsertion comme fin des peines et des mesures de sûreté. C'est un ordre constitutionnel, non une recommandation.",
  "¿Dónde está reconocido el derecho a una vivienda digna?":
    "Où le droit à un logement digne est-il reconnu ?",
  "Entre los derechos fundamentales, con amparo": "Parmi les droits fondamentaux, avec l'amparo",
  "En el artículo 47, entre los principios rectores":
    "À l'article 47, parmi les principes directeurs",
  "En el título preliminar": "Dans le titre préliminaire",
  "No aparece en la Constitución": "Il ne figure pas dans la Constitution",
  "Está en el artículo 47, entre los principios rectores de la política social y económica: obliga al legislador, pero no se reclama directamente ante un juez como la libertad de expresión.":
    "Il se trouve à l'article 47, parmi les principes directeurs de la politique sociale et économique : il oblige le législateur, mais ne se réclame pas directement devant un juge comme la liberté d'expression.",
  "¿Cuál es la diferencia práctica entre un derecho fundamental y un principio rector?":
    "Quelle est la différence pratique entre un droit fondamental et un principe directeur ?",
  "Ninguna: los dos se alegan igual": "Aucune : les deux s'invoquent de la même façon",
  "El fundamental llega al amparo constitucional; el principio rector solo conforme a las leyes que lo desarrollen":
    "Le droit fondamental ouvre l'amparo constitutionnel ; le principe directeur ne vaut que par les lois qui le mettent en œuvre",
  "El principio rector obliga a las comunidades y el fundamental al Estado":
    "Le principe directeur oblige les communautés et le droit fondamental l'État",
  "El principio rector no aparece en el texto constitucional":
    "Le principe directeur ne figure pas dans le texte constitutionnel",
  "La diferencia es de protección, no de importancia. Los fundamentales exigen ley orgánica y llegan al Tribunal Constitucional por la vía del amparo.":
    "La différence tient à la protection, non à l'importance. Les droits fondamentaux exigent une loi organique et parviennent au Tribunal constitutionnel par la voie de l'amparo.",
  "¿Qué garantiza el artículo 24?": "Que garantit l'article 24 ?",
  "La tutela judicial efectiva y la presunción de inocencia":
    "La protection effective du juge et la présomption d'innocence",
  "La libertad religiosa": "La liberté religieuse",
  "El derecho al trabajo": "Le droit au travail",
  "La inviolabilidad del domicilio": "L'inviolabilité du domicile",
  "Juez ordinario predeterminado por la ley, defensa y asistencia de letrado, proceso sin dilaciones indebidas y presunción de inocencia. Es el artículo del proceso justo.":
    "Le juge ordinaire fixé d'avance par la loi, la défense et l'assistance d'un avocat, un procès sans retard indu et la présomption d'innocence. C'est l'article du procès équitable.",
  "¿Cuándo quedó suspendido el servicio militar obligatorio en España?":
    "Quand le service militaire obligatoire a-t-il été suspendu en Espagne ?",
  "En 2001": "En 2001",
  "Sigue vigente": "Il est toujours en vigueur",
  "En 2001. Desde entonces las Fuerzas Armadas son enteramente profesionales, aunque el artículo 30 mantiene el derecho y el deber de defender a España.":
    "En 2001. Depuis, les forces armées sont entièrement professionnelles, même si l'article 30 maintient le droit et le devoir de défendre l'Espagne.",
  "¿Qué artículo impone contribuir al sostenimiento de los gastos públicos?":
    "Quel article impose de contribuer aux dépenses publiques ?",
  "El artículo 30": "L'article 30",
  "El artículo 31": "L'article 31",
  "El artículo 35": "L'article 35",
  "El artículo 47": "L'article 47",
  "El artículo 31, según la capacidad económica de cada uno. El 30 trata de la defensa y el 35 del trabajo.":
    "L'article 31, selon les moyens de chacun. Le 30 traite de la défense et le 35 du travail.",
  "¿Qué carácter no puede tener nunca el sistema tributario?":
    "Quel caractère le système fiscal ne peut-il jamais avoir ?",
  "Progresivo": "Progressif",
  "Confiscatorio": "Confiscatoire",
  "Igualitario": "Égalitaire",
  "General": "Général",
  "El artículo 31 exige que sea justo, igual y progresivo, y prohíbe expresamente que tenga alcance confiscatorio: la carga no puede vaciar el patrimonio de quien la soporta.":
    "L'article 31 exige qu'il soit juste, égal et progressif, et interdit expressément qu'il ait une portée confiscatoire : la charge ne peut vider le patrimoine de qui la supporte.",
  "¿Cuál es la regla principal de la nacionalidad española de origen?":
    "Quelle est la règle principale de la nationalité espagnole d'origine ?",
  "Nacer en territorio español": "Naître sur le territoire espagnol",
  "Nacer de padre o madre españoles": "Naître de père ou de mère espagnols",
  "Residir cinco años en España": "Résider cinq ans en Espagne",
  "Estar inscrito en el padrón municipal": "Être inscrit au padrón, le registre de la commune",
  "Rige el criterio de la sangre: es español de origen quien nace de padre o madre españoles, nazca donde nazca. Nacer en España no basta por sí solo.":
    "C'est le droit du sang qui vaut : est espagnol d'origine celui qui naît de père ou de mère espagnols, où qu'il naisse. Naître en Espagne ne suffit pas à soi seul.",
  "¿Puede privarse de la nacionalidad a un español de origen?":
    "Peut-on priver de sa nationalité un Espagnol d'origine ?",
  "Sí, por sentencia judicial": "Oui, par décision de justice",
  "No: el artículo 11 lo prohíbe": "Non : l'article 11 l'interdit",
  "Sí, si adquiere otra nacionalidad": "Oui, s'il acquiert une autre nationalité",
  "Solo en tiempo de guerra": "Seulement en temps de guerre",
  "El artículo 11 lo prohíbe expresamente. Quien la ha adquirido por residencia sí puede perderla en supuestos tasados, pero el español de origen no.":
    "L'article 11 l'interdit expressément. Qui l'a acquise par résidence peut bien la perdre dans des cas énumérés, mais non l'Espagnol d'origine.",
  "¿Con qué países permite la Constitución tratados de doble nacionalidad?":
    "Avec quels pays la Constitution permet-elle des traités de double nationalité ?",
  "Con ninguno": "Avec aucun",
  "Con los países iberoamericanos y aquellos con vinculación particular con España":
    "Avec les pays ibéro-américains et ceux qui ont un lien particulier avec l'Espagne",
  "Solo con los Estados de la Unión Europea": "Seulement avec les États de l'Union européenne",
  "Con todos los países del mundo": "Avec tous les pays du monde",
  "El artículo 11 los prevé para los países iberoamericanos y para los que hayan tenido o tengan una vinculación particular con España, como Andorra, Filipinas, Guinea Ecuatorial y Portugal.":
    "L'article 11 les prévoit pour les pays ibéro-américains et pour ceux qui ont eu ou ont un lien particulier avec l'Espagne, comme Andorre, les Philippines, la Guinée équatoriale et le Portugal.",
  "¿Qué plazo de residencia se exige a quien ha obtenido la condición de refugiado?":
    "Quel délai de résidence exige-t-on de qui a obtenu le statut de réfugié ?",
  "Cinco años. Es un plazo intermedio entre el general de diez y el de dos que corresponde a los países con vínculo histórico.":
    "Cinq ans. C'est un délai intermédiaire entre le délai général de dix ans et celui de deux ans qui vaut pour les pays au lien historique.",
  "¿Qué plazo se aplica a quien nació en territorio español pero no es español de origen?":
    "Quel délai s'applique à qui est né sur le territoire espagnol sans être espagnol d'origine ?",
  "Un año, el plazo más corto, junto con supuestos como llevar un año casado con una persona española sin estar separado.":
    "Un an, le délai le plus court, comme dans le cas de qui est marié depuis un an à une personne espagnole sans être séparé.",
  "¿Qué dos pruebas acreditan el suficiente grado de integración?":
    "Quelles deux épreuves attestent un degré d'intégration suffisant ?",
  "Un examen de historia y otro de geografía": "Un examen d'histoire et un de géographie",
  "La prueba de lengua DELE A2 y la prueba CCSE": "L'épreuve de langue DELE A2 et l'épreuve CCSE",
  "Una entrevista en el ayuntamiento y un certificado de empadronamiento":
    "Un entretien à la mairie et une attestation d'empadronamiento",
  "Un examen del Ministerio de Justicia y una prueba médica":
    "Un examen du ministère de la Justice et une visite médicale",
  "Las dos las administra el Instituto Cervantes: el DELE A2 examina la lengua y la CCSE los conocimientos constitucionales y socioculturales.":
    "L'Instituto Cervantes fait passer les deux : le DELE A2 porte sur la langue et la CCSE sur la connaissance de la constitution et de la vie sociale.",
  "¿Quién está exento de la prueba de lengua DELE A2?":
    "Qui est dispensé de l'épreuve de langue DELE A2 ?",
  "Los mayores de sesenta y cinco años": "Les plus de soixante-cinq ans",
  "Quienes proceden de países donde el español es lengua oficial":
    "Ceux qui viennent de pays où l'espagnol est langue officielle",
  "Quienes llevan más de veinte años en España":
    "Ceux qui sont en Espagne depuis plus de vingt ans",
  "Nadie está exento": "Personne n'en est dispensé",
  "La exención alcanza a los nacionales de países hispanohablantes, que sí deben realizar en cambio la prueba CCSE.":
    "La dispense vaut pour les ressortissants des pays hispanophones, qui doivent en revanche passer l'épreuve CCSE.",
  "¿A qué edad se alcanza la mayoría de edad en España?":
    "À quel âge devient-on majeur en Espagne ?",
  "A los dieciséis": "À seize ans",
  "A los dieciocho": "À dix-huit ans",
  "A los veintiuno": "À vingt et un ans",
  "A los veinticinco": "À vingt-cinq ans",
  "A los dieciocho, y con ella llegan el derecho de voto y la plena capacidad de obrar.":
    "À dix-huit ans, et avec la majorité viennent le droit de vote et la pleine capacité juridique.",
  "¿A partir de qué edad es obligatorio tener el DNI?":
    "À partir de quel âge le DNI est-il obligatoire ?",
  "A los siete": "À sept ans",
  "A los catorce": "À quatorze ans",
  "No es obligatorio": "Il n'est pas obligatoire",
  "A partir de los catorce años, cuatro antes de la mayoría de edad. Puede solicitarse antes de forma voluntaria.":
    "À partir de quatorze ans, quatre ans avant la majorité. On peut le demander plus tôt si on le souhaite.",
  "¿Qué recoge el artículo 35 además del derecho al trabajo?":
    "Que porte l'article 35 outre le droit au travail ?",
  "El deber de trabajar": "Le devoir de travailler",
  "La jornada de cuarenta horas": "La semaine de quarante heures",
  "El artículo 35 enuncia a la vez el deber y el derecho al trabajo, junto con la libre elección de profesión y una remuneración suficiente. La huelga está en el artículo 28.":
    "L'article 35 énonce à la fois le devoir et le droit au travail, avec le libre choix du métier et une rémunération suffisante. La grève, elle, est à l'article 28.",
  "¿Cuántos festivos del calendario laboral fija el ayuntamiento?":
    "Combien de jours fériés du calendrier du travail la municipalité fixe-t-elle ?",
  "Ninguno": "Aucun",
  "Cuatro": "Quatre",
  "Seis": "Six",
  "Dos de los catorce son locales y los decide cada municipio, normalmente el día del patrón y la fiesta mayor. Por eso un festivo puede no serlo a treinta kilómetros.":
    "Deux des quatorze sont locaux et chaque commune en décide, d'ordinaire le jour du saint patron et la fête principale. C'est pourquoi un jour férié peut ne pas l'être à trente kilomètres de là.",
  "¿Qué día se celebra la fiesta de Cataluña?": "Quel jour se fête la Catalogne ?",
  "El 23 de abril": "Le 23 avril",
  "El 25 de julio": "Le 25 juillet",
  "El 11 de septiembre": "Le 11 septembre",
  "El 9 de octubre": "Le 9 octobre",
  "El 11 de septiembre, la Diada. El 25 de julio es Galicia, el 9 de octubre la Comunidad Valenciana y el 23 de abril Aragón y Castilla y León.":
    "Le 11 septembre, la Diada. Le 25 juillet, c'est la Galice, le 9 octobre la Communauté valencienne, et le 23 avril l'Aragon et la Castille-et-León.",
  "¿Qué día se celebra la fiesta de Galicia?": "Quel jour se fête la Galice ?",
  "El 28 de febrero": "Le 28 février",
  "El 6 de diciembre": "Le 6 décembre",
  "El 25 de julio, día de Santiago Apóstol, patrón de España y de Galicia.":
    "Le 25 juillet, jour de saint Jacques, patron de l'Espagne et de la Galice.",
  "¿Qué día se celebra la fiesta de Andalucía?": "Quel jour se fête l'Andalousie ?",
  "El 2 de mayo": "Le 2 mai",
  "El 28 de febrero, aniversario del referéndum autonómico de 1980. El 2 de mayo es Madrid y el 23 de abril Aragón y Castilla y León.":
    "Le 28 février, anniversaire du référendum d'autonomie de 1980. Le 2 mai, c'est Madrid, et le 23 avril l'Aragon et la Castille-et-León.",
  "¿Qué día llegan tradicionalmente los regalos a los niños en España?":
    "Quel jour les cadeaux arrivent-ils traditionnellement aux enfants en Espagne ?",
  "El 24 de diciembre": "Le 24 décembre",
  "El 25 de diciembre": "Le 25 décembre",
  "El 31 de diciembre": "Le 31 décembre",
  "El 6 de enero": "Le 6 janvier",
  "El 6 de enero, con los Reyes Magos, cuya cabalgata se celebra la tarde del día 5. En muchas casas conviven hoy ambas fechas, pero la de Reyes sigue siendo la principal.":
    "Le 6 janvier, avec les Rois mages, dont le cortège passe l'après-midi du 5. Dans bien des maisons les deux dates coexistent aujourd'hui, mais celle des Rois reste la principale.",
  "¿Qué día de Semana Santa es festivo en toda España?":
    "Quel jour de la Semaine sainte est férié dans toute l'Espagne ?",
  "El Domingo de Ramos": "Le dimanche des Rameaux",
  "El Jueves Santo": "Le Jeudi saint",
  "El Viernes Santo": "Le Vendredi saint",
  "El Lunes de Pascua": "Le lundi de Pâques",
  "El Viernes Santo lo es en todo el país. El Jueves Santo lo es en la mayoría de comunidades pero no en todas, y el Lunes de Pascua solo en algunas.":
    "Le Vendredi saint l'est dans tout le pays. Le Jeudi saint l'est dans la plupart des communautés mais non dans toutes, et le lundi de Pâques dans quelques-unes seulement.",
  "¿Desde qué lugar se retransmiten las campanadas de Nochevieja?":
    "D'où retransmet-on les douze coups de la Saint-Sylvestre ?",
  "Desde la Plaza Mayor de Madrid": "De la Plaza Mayor de Madrid",
  "Desde la Puerta del Sol de Madrid": "De la Puerta del Sol, à Madrid",
  "Desde la Sagrada Familia de Barcelona": "De la Sagrada Família, à Barcelone",
  "Desde la Giralda de Sevilla": "De la Giralda, à Séville",
  "Desde el reloj de la Puerta del Sol. La retransmisión es uno de los programas de televisión más vistos del año en España.":
    "De l'horloge de la Puerta del Sol. La retransmission est l'une des émissions les plus regardées de l'année en Espagne.",
  "¿En qué ciudad se celebran los San Fermines?":
    "Dans quelle ville se tiennent les San Fermines ?",
  "En Bilbao": "À Bilbao",
  "En Zaragoza": "À Saragosse",
  "En Logroño": "À Logroño",
  "En Pamplona, del 6 al 14 de julio, y los encierros de la mañana son su imagen más conocida fuera de España.":
    "À Pampelune, du 6 au 14 juillet, et les lâchers de taureaux du matin en sont l'image la plus connue hors d'Espagne.",
  "¿En qué ciudad se celebra la Feria de Abril?": "Dans quelle ville se tient la Feria de Abril ?",
  "En Málaga": "À Malaga",
  "En Córdoba": "À Cordoue",
  "En Granada": "À Grenade",
  "En Sevilla, dos semanas después de Semana Santa, con casetas, caballos y trajes de flamenca.":
    "À Séville, deux semaines après la Semaine sainte, avec ses tentes, ses chevaux et ses robes de flamenca.",
  "¿Qué son las chirigotas?": "Que sont les chirigotas ?",
  "Los monumentos que se queman en las Fallas": "Les monuments que l'on brûle aux Fallas",
  "Las agrupaciones que cantan con letras satíricas en el carnaval de Cádiz":
    "Les troupes qui chantent des couplets satiriques au carnaval de Cadix",
  "Los encierros de las fiestas de Pamplona": "Les lâchers de taureaux des fêtes de Pampelune",
  "Las casetas de la Feria de Abril": "Les tentes de la Feria de Abril",
  "Son la seña de identidad del carnaval gaditano: coplas de humor y crítica que se preparan durante todo el año y compiten en el Gran Teatro Falla.":
    "Elles sont la marque du carnaval de Cadix : des couplets drôles et critiques que l'on prépare toute l'année et qui concourent au Gran Teatro Falla.",
  "¿Qué es hacer puente?": "Qu'est-ce que faire le pont ?",
  "Trabajar en festivo para librar otro día": "Travailler un jour férié pour en prendre un autre",
  "Librar el lunes o el viernes contiguo a un festivo que cae en martes o jueves":
    "Prendre le lundi ou le vendredi qui touche un férié tombant un mardi ou un jeudi",
  "Cambiar un festivo local por uno nacional": "Échanger un férié local contre un férié national",
  "Acumular las vacaciones al final del año": "Garder ses congés pour la fin de l'année",
  "Cuando el festivo cae en martes o jueves, muchos toman también el día que lo separa del fin de semana. Si coinciden dos festivos cercanos se habla, medio en broma, de acueducto.":
    "Quand le férié tombe un mardi ou un jeudi, beaucoup prennent aussi le jour qui le sépare du week-end. Si deux fériés se suivent de près, on parle à demi pour rire d'aqueduc.",
  "¿Cuándo se queman los monumentos de las Fallas?": "Quand brûle-t-on les monuments des Fallas ?",
  "La noche del 19 de marzo": "La nuit du 19 mars",
  "La noche de San Juan, el 23 de junio": "La nuit de la Saint-Jean, le 23 juin",
  "El 15 de agosto": "Le 15 août",
  "El último día del carnaval": "Le dernier jour du carnaval",
  "La noche del 19 de marzo, la cremà. Los monumentos se levantan durante días por toda la ciudad y arden todos la misma noche.":
    "La nuit du 19 mars, la cremà. On dresse les monuments pendant des jours dans toute la ville et ils brûlent tous la même nuit.",
  "¿Puede una comunidad autónoma sustituir un festivo estatal por otro propio?":
    "Une communauté autonome peut-elle remplacer un férié national par un férié à elle ?",
  "No, la lista estatal es idéntica en todo el país":
    "Non, la liste nationale est la même dans tout le pays",
  "Sí, dentro de los límites que fija la ley": "Oui, dans les limites que fixe la loi",
  "Solo las comunidades con lengua propia": "Seules les communautés qui ont une langue propre",
  "Solo con autorización del Gobierno central":
    "Seulement avec l'autorisation du gouvernement central",
  "Las comunidades pueden sustituir algunos festivos estatales por fiestas propias, de modo que ni siquiera la lista del Estado se aplica igual en todas partes.":
    "Les communautés peuvent remplacer certains fériés nationaux par des fêtes à elles, si bien que la liste de l'État elle-même ne s'applique pas partout de la même façon.",
  "¿Qué cargo ocupa el rey en el Estado español?":
    "Quelle charge le roi occupe-t-il dans l'État espagnol ?",
  "Presidente del Gobierno": "Président du gouvernement",
  "Jefe del Estado": "Chef de l'État",
  "Presidente de las Cortes": "Président des Cortes",
  "Jefe de la Administración": "Chef de l'administration",
  "Jefe del Estado, símbolo de su unidad y permanencia. Quien dirige la política es el presidente del Gobierno, que es otro cargo y está en otro edificio.":
    "Chef de l'État, symbole de son unité et de sa permanence. Celui qui conduit la politique est le président du gouvernement, qui est une autre charge et se tient dans un autre bâtiment.",
  "¿Qué dos verbos emplea el artículo 56 para describir la función del rey?":
    "Quels deux verbes l'article 56 emploie-t-il pour décrire la fonction du roi ?",
  "Gobernar y administrar": "Gouverner et administrer",
  "Arbitrar y moderar": "Arbitrer et modérer",
  "Legislar y sancionar": "Légiférer et sanctionner",
  "Dirigir y coordinar": "Diriger et coordonner",
  "Arbitra y modera el funcionamiento regular de las instituciones. Ninguno de los dos verbos significa gobernar, y esa elección de palabras es deliberada.":
    "Il arbitre et modère le fonctionnement régulier des institutions. Aucun des deux verbes ne veut dire gouverner, et ce choix de mots est délibéré.",
  "¿Quién puede refrendar el nombramiento del presidente del Gobierno?":
    "Qui peut contresigner la nomination du président du gouvernement ?",
  "El presidente del Congreso": "Le président du Congrès",
  "El ministro de la Presidencia": "Le ministre de la Présidence",
  "El presidente del Tribunal Supremo": "Le président du Tribunal suprême",
  "Nadie: ese acto no se refrenda": "Personne : cet acte ne se contresigne pas",
  "La propuesta y el nombramiento del presidente del Gobierno, y la disolución de las Cortes prevista en el artículo 99, los refrenda el presidente del Congreso. Los demás actos, el Gobierno.":
    "La proposition et la nomination du président du gouvernement, ainsi que la dissolution des Cortes prévue à l'article 99, sont contresignées par le président du Congrès. Les autres actes le sont par le gouvernement.",
  "¿Por qué la Constitución declara inviolable la persona del rey?":
    "Pourquoi la Constitution déclare-t-elle la personne du roi inviolable ?",
  "Porque su cargo es vitalicio": "Parce que sa charge est à vie",
  "Porque todos sus actos los refrenda otro, que asume la responsabilidad":
    "Parce que tous ses actes sont contresignés par un autre, qui en assume la responsabilité",
  "Porque no interviene en ningún acto público": "Parce qu'il n'intervient dans aucun acte public",
  "Porque lo protege un tratado internacional": "Parce qu'un traité international le protège",
  "La irresponsabilidad del rey solo se sostiene sobre el refrendo: siempre hay alguien que firma con él y responde. Un acto sin refrendo carece de validez.":
    "L'irresponsabilité du roi ne tient que par le contreseing : quelqu'un signe toujours avec lui et en répond. Un acte sans contreseing est sans valeur.",
  "¿En qué plazo debe el rey sancionar las leyes aprobadas por las Cortes?":
    "Dans quel délai le roi doit-il sanctionner les lois adoptées par les Cortes ?",
  "En quince días": "En quinze jours",
  "En un mes": "En un mois",
  "En tres meses": "En trois mois",
  "No hay plazo": "Il n'y a pas de délai",
  "Quince días para sancionar y promulgar. Es un acto debido: no puede negarse ni retrasarlo a voluntad.":
    "Quinze jours pour sanctionner et promulguer. C'est un acte obligé : il ne peut ni le refuser ni le retarder à sa guise.",
  "¿Qué tipo de indultos prohíbe la ley española?":
    "Quel type de grâces la loi espagnole interdit-elle ?",
  "Los indultos generales": "Les grâces collectives",
  "Los indultos a extranjeros": "Les grâces aux étrangers",
  "Los indultos por delitos económicos": "Les grâces pour délits économiques",
  "El rey ejerce el derecho de gracia con arreglo a la ley, y esa ley prohíbe los indultos generales. Los individuales sí son posibles, a propuesta del Gobierno.":
    "Le roi exerce le droit de grâce dans les termes de la loi, et cette loi interdit les grâces collectives. Les grâces individuelles restent possibles, sur proposition du gouvernement.",
  "¿Qué criterio de sucesión establece todavía el artículo 57?":
    "Quel critère de succession l'article 57 pose-t-il encore ?",
  "Igualdad absoluta entre hombres y mujeres": "L'égalité absolue entre hommes et femmes",
  "Preferencia del varón sobre la mujer en el mismo grado":
    "La préférence du mâle sur la femme au même degré",
  "Elección por las Cortes entre los descendientes":
    "Le choix par les Cortes parmi les descendants",
  "Preferencia del hijo mayor sin distinción de sexo":
    "La préférence de l'aîné sans distinction de sexe",
  "Es la única preferencia por razón de sexo que queda en el texto. Cambiarla exigiría el procedimiento agravado del artículo 168, con disolución de las Cortes y referéndum.":
    "C'est la seule préférence de sexe qui subsiste dans le texte. La changer exigerait la procédure renforcée de l'article 168, avec dissolution des Cortes et référendum.",
  "¿En qué año fue proclamado rey Juan Carlos I?":
    "En quelle année Juan Carlos I fut-il proclamé roi ?",
  "En 1969": "En 1969",
  "En 1981": "En 1981",
  "En 1975, dos días después de la muerte de Franco. La Constitución llegaría tres años más tarde, en 1978.":
    "En 1975, deux jours après la mort de Franco. La Constitution viendrait trois ans plus tard, en 1978.",
  "¿En qué año fue proclamado Felipe VI?": "En quelle année Felipe VI fut-il proclamé ?",
  "En 2004": "En 2004",
  "En 2011": "En 2011",
  "En 2014": "En 2014",
  "En 2018": "En 2018",
  "El 19 de junio de 2014, tras la abdicación de su padre. La proclamación se celebró ante las Cortes Generales.":
    "Le 19 juin 2014, après l'abdication de son père. La proclamation eut lieu devant les Cortes Generales.",
  "¿Cuál es la residencia habitual de la familia real?":
    "Quelle est la résidence habituelle de la famille royale ?",
  "El Palacio Real": "Le Palais royal",
  "El Palacio de la Zarzuela": "Le palais de la Zarzuela",
  "El Palacio de la Moncloa": "Le palais de la Moncloa",
  "El Palacio de las Cortes": "Le palais des Cortes",
  "La Zarzuela es la residencia; el Palacio Real se reserva para actos oficiales. La Moncloa es del presidente del Gobierno.":
    "La Zarzuela est la résidence ; le Palais royal se réserve aux actes officiels. La Moncloa est au président du gouvernement.",
  "¿Qué hace el rey al ser proclamado ante las Cortes?":
    "Que fait le roi lors de sa proclamation devant les Cortes ?",
  "Presenta un programa de gobierno": "Il présente un programme de gouvernement",
  "Presta juramento de guardar y hacer guardar la Constitución":
    "Il prête serment de garder et de faire garder la Constitution",
  "Firma un pacto con los partidos": "Il signe un pacte avec les partis",
  "Nombra al presidente del Gobierno": "Il nomme le président du gouvernement",
  "Jura o promete guardar y hacer guardar la Constitución y las leyes, y respetar los derechos de los ciudadanos y de las comunidades autónomas.":
    "Il jure ou promet de garder et de faire garder la Constitution et les lois, et de respecter les droits des citoyens et des communautés autonomes.",
  "¿Quién tiene el mando supremo de las Fuerzas Armadas?":
    "Qui a le commandement suprême des forces armées ?",
  "El ministro de Defensa": "Le ministre de la Défense",
  "El jefe del Estado Mayor": "Le chef d'état-major",
  "El artículo 62 se lo atribuye al rey. La dirección efectiva de la defensa corresponde al Gobierno, según el artículo 97: el mando es simbólico y la política es del ejecutivo.":
    "L'article 62 l'attribue au roi. La conduite effective de la défense revient au gouvernement, selon l'article 97 : le commandement est symbolique et la politique appartient à l'exécutif.",
  "¿Qué ocurre con un acto del rey que no lleva refrendo?":
    "Qu'advient-il d'un acte du roi qui ne porte pas de contreseing ?",
  "Es válido pero recurrible": "Il est valable mais attaquable",
  "Carece de validez": "Il est sans valeur",
  "Debe ratificarlo el Congreso": "Le Congrès doit le ratifier",
  "Lo asume el Consejo de Ministros": "Le Conseil des ministres l'assume",
  "Sin refrendo el acto no vale. Es la pieza que hace compatibles un jefe del Estado irresponsable y un sistema en el que todo acto tiene un responsable.":
    "Sans contreseing, l'acte ne vaut pas. C'est la pièce qui rend compatibles un chef de l'État irresponsable et un système où tout acte a un responsable.",
  "¿Entre qué cifras permite la Constitución fijar el número de diputados?":
    "Entre quels chiffres la Constitution permet-elle de fixer le nombre de députés ?",
  "Entre 200 y 300": "Entre 200 et 300",
  "Entre 300 y 400": "Entre 300 et 400",
  "Entre 250 y 350": "Entre 250 et 350",
  "No fija ninguna horquilla": "Elle ne fixe aucune fourchette",
  "Entre trescientos y cuatrocientos. La ley electoral ha elegido siempre trescientos cincuenta, pero podría moverse dentro de ese margen sin reformar la Constitución.":
    "Entre trois cents et quatre cents. La loi électorale a toujours retenu trois cent cinquante, mais elle pourrait bouger dans cette marge sans réviser la Constitution.",
  "¿Cuál es la circunscripción electoral en las elecciones al Congreso?":
    "Quelle est la circonscription électorale aux élections au Congrès ?",
  "La comunidad autónoma": "La communauté autonome",
  "La provincia": "La province",
  "El municipio": "La commune",
  "Toda España como circunscripción única": "Toute l'Espagne en circonscription unique",
  "La provincia, más Ceuta y Melilla con un diputado cada una. La circunscripción única solo se usa en las elecciones europeas.":
    "La province, plus Ceuta et Melilla avec un député chacune. La circonscription unique ne sert qu'aux élections européennes.",
  "¿Qué mecanismo da a las provincias pequeñas más peso relativo?":
    "Quel mécanisme donne aux petites provinces un poids relatif plus grand ?",
  "El sistema D'Hondt": "La méthode d'Hondt",
  "El mínimo inicial de dos escaños por provincia":
    "Le minimum initial de deux sièges par province",
  "El umbral del tres por ciento": "Le seuil de trois pour cent",
  "Las listas cerradas": "Les listes bloquées",
  "Cada provincia parte de dos escaños antes de repartir el resto por población. Es un efecto distinto del que produce el D'Hondt, y suele atribuirse por error a este último.":
    "Chaque province part de deux sièges avant que le reste ne se répartisse selon la population. C'est un effet différent de celui de la méthode d'Hondt, à laquelle on l'attribue souvent à tort.",
  "¿Qué umbral debe superar una lista para obtener escaño?":
    "Quel seuil une liste doit-elle franchir pour obtenir un siège ?",
  "El uno por ciento nacional": "Un pour cent à l'échelle nationale",
  "El tres por ciento de los votos válidos de su circunscripción":
    "Trois pour cent des suffrages valables de sa circonscription",
  "El cinco por ciento nacional": "Cinq pour cent à l'échelle nationale",
  "No hay umbral": "Il n'y a pas de seuil",
  "El tres por ciento, y se calcula por circunscripción, no en el conjunto del país. En provincias pequeñas el umbral efectivo es en la práctica mucho más alto.":
    "Trois pour cent, et le calcul se fait par circonscription, non sur l'ensemble du pays. Dans les petites provinces, le seuil réel est en pratique bien plus haut.",
  "¿Qué significa que las listas sean cerradas y bloqueadas?":
    "Que veut dire que les listes soient fermées et bloquées ?",
  "Que solo pueden presentarlas los partidos con representación":
    "Que seuls les partis déjà représentés peuvent en présenter",
  "Que se vota la candidatura entera en el orden fijado por el partido":
    "Que l'on vote la liste entière, dans l'ordre fixé par le parti",
  "Que no se publican hasta el día de la votación":
    "Qu'elles ne sont publiées que le jour du scrutin",
  "Que no admiten candidatos independientes":
    "Qu'elles n'admettent pas de candidats sans étiquette",
  "Cerrada significa que no se pueden mezclar candidatos de listas distintas; bloqueada, que no se puede alterar el orden. El votante elige un partido, no personas.":
    "Fermée veut dire qu'on ne peut mêler des candidats de listes différentes ; bloquée, qu'on ne peut en changer l'ordre. L'électeur choisit un parti, non des personnes.",
  "¿Cuántos senadores elige directamente cada provincia peninsular?":
    "Combien de sénateurs chaque province de la péninsule élit-elle directement ?",
  "Depende de su población": "Cela dépend de sa population",
  "Cuatro por provincia peninsular, con independencia de la población. Las islas y las ciudades autónomas siguen reglas propias, y a todos ellos se suman los designados por las comunidades.":
    "Quatre par province péninsulaire, quelle que soit la population. Les îles et les villes autonomes suivent des règles propres, et à tous ceux-là s'ajoutent les sénateurs désignés par les communautés.",
  "¿Cómo designan las comunidades autónomas a sus senadores?":
    "Comment les communautés autonomes désignent-elles leurs sénateurs ?",
  "Uno por comunidad y otro más por cada millón de habitantes":
    "Un par communauté et un de plus par million d'habitants",
  "Cuatro por comunidad": "Quatre par communauté",
  "Uno por provincia": "Un par province",
  "En proporción a los escaños de su parlamento": "Au prorata des sièges de leur parlement",
  "Uno fijo por comunidad y otro adicional por cada millón de habitantes, designados por su asamblea legislativa. Es la vía territorial del Senado, junto a la provincial.":
    "Un fixe par communauté et un de plus par million d'habitants, désignés par leur assemblée législative. C'est la voie territoriale du Sénat, à côté de la voie provinciale.",
  "¿Cuánto dura una legislatura?": "Combien de temps dure une législature ?",
  "Seis años": "Six ans",
  "Cuatro años, salvo disolución anticipada, que en España ha sido frecuente: pocas legislaturas han llegado completas a su término.":
    "Quatre ans, sauf dissolution anticipée, qui a été fréquente en Espagne : peu de législatures sont allées jusqu'à leur terme.",
  "¿Cuánto tiempo debe pasar para que el Congreso levante un veto del Senado por mayoría simple?":
    "Combien de temps doit passer pour que le Congrès lève un veto du Sénat à la majorité simple ?",
  "Quince días": "Quinze jours",
  "Un mes": "Un mois",
  "Dos meses": "Deux mois",
  "Seis meses": "Six mois",
  "Dos meses. Antes de ese plazo también puede levantarlo, pero necesita mayoría absoluta: el tiempo rebaja la exigencia.":
    "Deux mois. Avant ce délai il peut aussi le lever, mais il lui faut la majorité absolue : le temps abaisse l'exigence.",
  "¿Qué es la Diputación Permanente?": "Qu'est-ce que la Diputación Permanente ?",
  "El grupo que vela por los poderes de la cámara cuando está disuelta o fuera de sesiones":
    "Le groupe qui veille sur les pouvoirs de la chambre quand elle est dissoute ou hors session",
  "La comisión que redacta los presupuestos": "La commission qui rédige le budget",
  "El órgano que dirige los debates": "L'organe qui conduit les débats",
  "El conjunto de diputados con más antigüedad": "L'ensemble des députés les plus anciens",
  "Cada cámara tiene la suya, presidida por su presidente. Es lo que impide que el Parlamento desaparezca del todo entre una disolución y las siguientes elecciones.":
    "Chaque chambre a la sienne, présidée par son président. C'est ce qui empêche le Parlement de disparaître tout à fait entre une dissolution et les élections suivantes.",
  "¿Qué tres funciones atribuye el artículo 66 a las Cortes Generales?":
    "Quelles trois fonctions l'article 66 attribue-t-il aux Cortes Generales ?",
  "Legislar, aprobar los presupuestos y controlar al Gobierno":
    "Légiférer, adopter le budget et contrôler le gouvernement",
  "Legislar, juzgar y gobernar": "Légiférer, juger et gouverner",
  "Elegir al rey, legislar y nombrar jueces": "Élire le roi, légiférer et nommer les juges",
  "Aprobar tratados, indultar y recaudar": "Approuver les traités, gracier et lever l'impôt",
  "Potestad legislativa, presupuestos y control de la acción del Gobierno. Juzgar corresponde al poder judicial y gobernar al ejecutivo.":
    "Le pouvoir législatif, le budget et le contrôle de l'action du gouvernement. Juger revient au pouvoir judiciaire et gouverner à l'exécutif.",
  "¿Cuántos diputados eligen Ceuta y Melilla?":
    "Combien de députés Ceuta et Melilla élisent-elles ?",
  "Uno cada una": "Un chacune",
  "Dos cada una": "Deux chacune",
  "Cuatro cada una": "Quatre chacune",
  "Un diputado cada una. Son circunscripciones propias, distintas de las provincias, y también eligen senadores con reglas específicas.":
    "Un député chacune. Ce sont des circonscriptions propres, distinctes des provinces, et elles élisent aussi des sénateurs selon des règles particulières.",
  "¿Por qué se dice que el bicameralismo español es imperfecto?":
    "Pourquoi dit-on que le bicamérisme espagnol est imparfait ?",
  "Porque el Senado tiene menos miembros": "Parce que le Sénat a moins de membres",
  "Porque las dos cámaras no tienen el mismo peso y el Congreso decide en última instancia":
    "Parce que les deux chambres n'ont pas le même poids et que le Congrès tranche en dernier ressort",
  "Porque el Senado no se elige por sufragio": "Parce que le Sénat n'est pas élu au suffrage",
  "Porque solo una de las dos aprueba los presupuestos":
    "Parce qu'une seule des deux adopte le budget",
  "El Congreso inviste al presidente, puede derribarlo y levanta los vetos del Senado. Imperfecto es aquí un término técnico, no un juicio de valor.":
    "Le Congrès investit le président, peut le renverser et lève les vetos du Sénat. Imparfait est ici un terme technique, non un jugement de valeur.",
  "¿Quiénes componen el Gobierno?": "Qui compose le gouvernement ?",
  "El presidente, los vicepresidentes y los ministros":
    "Le président, les vice-présidents et les ministres",
  "El rey y los ministros": "Le roi et les ministres",
  "Los diputados del partido más votado": "Les députés du parti arrivé en tête",
  "El presidente y los presidentes autonómicos": "Le président et les présidents des communautés",
  "Presidente, vicepresidentes en su caso y ministros, que reunidos forman el Consejo de Ministros. El rey no forma parte del Gobierno.":
    "Le président, les vice-présidents le cas échéant et les ministres, qui réunis forment le Conseil des ministres. Le roi ne fait pas partie du gouvernement.",
  "¿Qué artículo define las funciones del Gobierno?":
    "Quel article définit les fonctions du gouvernement ?",
  "El artículo 66": "L'article 66",
  "El artículo 97": "L'article 97",
  "El artículo 99": "L'article 99",
  "El artículo 117": "L'article 117",
  "El 97: política interior y exterior, Administración civil y militar, defensa, función ejecutiva y potestad reglamentaria. El 99 regula la investidura.":
    "Le 97 : politique intérieure et étrangère, administration civile et militaire, défense, fonction exécutive et pouvoir réglementaire. Le 99 règle l'investiture.",
  "¿Qué hace el rey antes de proponer un candidato a la presidencia?":
    "Que fait le roi avant de proposer un candidat à la présidence ?",
  "Consultar a los representantes designados por los grupos políticos":
    "Consulter les représentants désignés par les groupes politiques",
  "Consultar al Tribunal Constitucional": "Consulter le Tribunal constitutionnel",
  "Convocar un referéndum": "Convoquer un référendum",
  "Nombrar un gobierno provisional": "Nommer un gouvernement provisoire",
  "Las consultas son una ronda de reuniones con los grupos con representación, y sirven para saber quién puede reunir una mayoría antes de proponer un nombre.":
    "Les consultations sont une série d'entretiens avec les groupes représentés, et elles servent à savoir qui peut réunir une majorité avant d'avancer un nom.",
  "¿Qué ocurre si en dos meses nadie logra ser investido presidente?":
    "Que se passe-t-il si en deux mois personne n'obtient l'investiture ?",
  "Gobierna el partido más votado": "Le parti arrivé en tête gouverne",
  "El rey disuelve las Cortes y se convocan nuevas elecciones":
    "Le roi dissout les Cortes et de nouvelles élections sont convoquées",
  "Decide el Senado": "Le Sénat décide",
  "Se prorroga el gobierno anterior cuatro años":
    "Le gouvernement précédent est prorogé de quatre ans",
  "El plazo corre desde la primera votación de investidura. España ha llegado a repetir elecciones por esta vía en más de una ocasión.":
    "Le délai court à partir du premier vote d'investiture. L'Espagne en est venue à refaire des élections par cette voie plus d'une fois.",
  "¿Qué mayoría basta en la segunda votación de investidura?":
    "Quelle majorité suffit au second vote d'investiture ?",
  "La misma que en la primera": "La même qu'au premier",
  "Mayoría simple: más votos a favor que en contra. Se celebra cuarenta y ocho horas después de la primera, en la que se exigía mayoría absoluta.":
    "La majorité simple : plus de voix pour que contre. Il a lieu quarante-huit heures après le premier, où l'on exigeait la majorité absolue.",
  "¿Qué fracción de los diputados debe firmar una moción de censura?":
    "Quelle fraction des députés doit signer une motion de censure ?",
  "Una décima parte": "Un dixième",
  "Una cuarta parte": "Un quart",
  "Un tercio": "Un tiers",
  "La mayoría absoluta": "La majorité absolue",
  "Una décima parte del Congreso para presentarla. Para que prospere hace falta después la mayoría absoluta de la cámara.":
    "Un dixième du Congrès pour la déposer. Pour qu'elle aboutisse, il faut ensuite la majorité absolue de la chambre.",
  "¿Cuántas veces ha prosperado una moción de censura desde 1978?":
    "Combien de fois une motion de censure a-t-elle abouti depuis 1978 ?",
  "Una": "Une",
  "Una sola, en 2018. El carácter constructivo lo explica: es fácil reunir votos contra alguien y difícil reunirlos a favor de un sustituto concreto.":
    "Une seule, en 2018. Son caractère constructif l'explique : il est facile de réunir des voix contre quelqu'un et difficile d'en réunir pour un remplaçant précis.",
  "¿Qué mayoría exige una cuestión de confianza?":
    "Quelle majorité une question de confiance exige-t-elle ?",
  "Mayoría simple, a diferencia de la moción de censura, que exige mayoría absoluta. La plantea el propio presidente y perderla le obliga a dimitir.":
    "La majorité simple, à la différence de la motion de censure, qui exige la majorité absolue. C'est le président lui-même qui la pose, et la perdre l'oblige à démissionner.",
  "¿Cuándo NO puede el presidente disolver las Cortes?":
    "Quand le président ne peut-il PAS dissoudre les Cortes ?",
  "En el primer año de legislatura": "Pendant la première année de législature",
  "Mientras esté en trámite una moción de censura": "Tant qu'une motion de censure est en cours",
  "Durante el periodo de sesiones": "Pendant la session",
  "En año electoral europeo": "Une année d'élections européennes",
  "Ni con una moción de censura en trámite, ni antes de que haya pasado un año desde la disolución anterior. Las dos limitaciones están en el artículo 115.":
    "Ni avec une motion de censure en cours, ni avant qu'un an se soit écoulé depuis la dissolution précédente. Les deux limites figurent à l'article 115.",
  "¿Qué es la potestad reglamentaria?": "Qu'est-ce que le pouvoir réglementaire ?",
  "La facultad del Gobierno de dictar normas de rango inferior a la ley":
    "Le pouvoir du gouvernement de prendre des normes de rang inférieur à la loi",
  "El derecho del Gobierno a vetar leyes": "Le droit du gouvernement d'opposer son veto aux lois",
  "La capacidad de convocar referendos": "La faculté de convoquer des référendums",
  "El poder de nombrar jueces": "Le pouvoir de nommer les juges",
  "Los reglamentos desarrollan y aplican las leyes sin poder contradecirlas. Es una de las funciones que el artículo 97 atribuye al Gobierno.":
    "Les règlements déploient et appliquent les lois sans pouvoir les contredire. C'est l'une des fonctions que l'article 97 attribue au gouvernement.",
  "¿Cómo se llama el órgano colegiado que forman el presidente y los ministros?":
    "Comment s'appelle l'organe collégial que forment le président et les ministres ?",
  "El Consejo de Estado": "Le Conseil d'État",
  "El Consejo de Ministros": "Le Conseil des ministres",
  "El Consejo General": "Le Conseil général",
  "La Junta de Gobierno": "La Junte de gouvernement",
  "El Consejo de Ministros. El Consejo de Estado es otra cosa: el supremo órgano consultivo del Gobierno.":
    "Le Conseil des ministres. Le Conseil d'État est autre chose : le premier organe consultatif du gouvernement.",
  "¿Cuántos días deben pasar entre la presentación de una moción de censura y su votación?":
    "Combien de jours doivent passer entre le dépôt d'une motion de censure et son vote ?",
  "Cinco días, y en los dos primeros pueden presentarse mociones alternativas. El plazo da tiempo a negociar y a que aparezcan otros candidatos.":
    "Cinq jours, et pendant les deux premiers on peut déposer des motions concurrentes. Le délai laisse le temps de négocier et à d'autres candidats de se présenter.",
  "¿Qué le ocurre al candidato incluido en una moción de censura que prospera?":
    "Qu'arrive-t-il au candidat porté par une motion de censure qui aboutit ?",
  "Debe someterse después a una investidura ordinaria":
    "Il doit ensuite se soumettre à une investiture ordinaire",
  "Queda automáticamente investido presidente": "Il est automatiquement investi président",
  "Asume solo de forma interina hasta las elecciones":
    "Il ne prend ses fonctions qu'à titre provisoire jusqu'aux élections",
  "Debe ser ratificado por el Senado": "Il doit être confirmé par le Sénat",
  "La moción constructiva inviste y destituye en el mismo acto. Por eso no puede presentarse sin candidato: no serviría para nada dejar el país sin gobierno.":
    "La motion constructive investit et destitue d'un même geste. C'est pourquoi elle ne peut être déposée sans candidat : laisser le pays sans gouvernement ne servirait à rien.",
  "¿En nombre de quién se administra la justicia en España?":
    "Au nom de qui la justice est-elle rendue en Espagne ?",
  "Del pueblo": "Du peuple",
  "Del rey": "Du roi",
  "Del Estado": "De l'État",
  "De las Cortes": "Des Cortes",
  "El artículo 117 dice que la justicia emana del pueblo y se administra en nombre del rey. Las dos mitades de la frase van juntas y suelen citarse a medias.":
    "L'article 117 dit que la justice émane du peuple et se rend au nom du roi. Les deux moitiés de la phrase vont ensemble et on n'en cite souvent qu'une.",
  "¿Cómo se accede a la carrera judicial?": "Comment entre-t-on dans la magistrature ?",
  "Por nombramiento del Gobierno": "Par nomination du gouvernement",
  "Por oposición": "Par concours",
  "Por elección popular": "Par élection populaire",
  "Por designación del CGPJ": "Par désignation du CGPJ",
  "Por oposición, un examen público y competitivo. Es lo que mantiene el acceso fuera del alcance de la política, aunque el gobierno de la carrera lo lleve el CGPJ.":
    "Par concours, un examen public et ouvert. C'est ce qui tient l'entrée hors d'atteinte du politique, même si la gestion de la carrière revient au CGPJ.",
  "¿Cuántos vocales tiene el Consejo General del Poder Judicial?":
    "Combien de membres compte le Conseil général du pouvoir judiciaire ?",
  "Veinticinco": "Vingt-cinq",
  "Veinte vocales más su presidente, que lo es también del Tribunal Supremo, con mandato de cinco años. Doce son los magistrados del Tribunal Constitucional.":
    "Vingt membres plus son président, qui l'est aussi du Tribunal suprême, pour un mandat de cinq ans. Douze est le nombre des juges du Tribunal constitutionnel.",
  "¿Cuáles son los cuatro órdenes jurisdiccionales?":
    "Quels sont les quatre ordres de juridiction ?",
  "Civil, penal, contencioso-administrativo y social":
    "Civil, pénal, contentieux administratif et social",
  "Civil, penal, militar y mercantil": "Civil, pénal, militaire et commercial",
  "Constitucional, civil, penal y laboral": "Constitutionnel, civil, pénal et du travail",
  "Ordinario, especial, foral y autonómico": "Ordinaire, spécial, foral et des communautés",
  "El contencioso-administrativo resuelve los pleitos con la Administración y el social los laborales. La jurisdicción militar existe, pero no es uno de los cuatro órdenes ordinarios.":
    "Le contentieux administratif tranche les litiges avec l'administration et le social ceux du travail. La juridiction militaire existe, mais elle n'est pas l'un des quatre ordres ordinaires.",
  "¿Qué tribunal tiene competencia en toda España sobre delitos como el terrorismo?":
    "Quelle juridiction est compétente dans toute l'Espagne pour des délits comme le terrorisme ?",
  "La Audiencia Nacional": "L'Audiencia Nacional",
  "Las Audiencias Provinciales": "Les Audiencias Provinciales",
  "La Audiencia Nacional, con sede en Madrid y jurisdicción en todo el territorio para materias tasadas: terrorismo, delitos económicos de gran alcance, extradiciones.":
    "L'Audiencia Nacional, qui siège à Madrid et a compétence sur tout le territoire pour des matières énumérées : terrorisme, délits économiques de grande ampleur, extraditions.",
  "¿Cuántos Tribunales Superiores de Justicia hay?":
    "Combien y a-t-il de Tribunales Superiores de Justicia ?",
  "Uno por comunidad autónoma": "Un par communauté autonome",
  "Cuatro, uno por orden jurisdiccional": "Quatre, un par ordre de juridiction",
  "Uno por comunidad autónoma. Culminan la organización judicial en su territorio, pero no están por encima del Tribunal Supremo.":
    "Un par communauté autonome. Ils couronnent l'organisation judiciaire de leur territoire, mais ne se placent pas au-dessus du Tribunal suprême.",
  "¿Quién nombra al fiscal general del Estado?": "Qui nomme le procureur général de l'État ?",
  "El rey, a propuesta del Gobierno, oído el CGPJ":
    "Le roi, sur proposition du gouvernement, le CGPJ entendu",
  "El Congreso por tres quintos": "Le Congrès, aux trois cinquièmes",
  "El propio Ministerio Fiscal": "Le parquet lui-même",
  "Lo nombra el rey a propuesta del Gobierno, oído el Consejo General del Poder Judicial. Esa dependencia del ejecutivo es objeto de debate recurrente.":
    "Le roi le nomme sur proposition du gouvernement, le Conseil général du pouvoir judiciaire entendu. Cette dépendance à l'égard de l'exécutif fait l'objet d'un débat récurrent.",
  "¿Cuántos magistrados del Tribunal Constitucional propone el Congreso?":
    "Combien de juges du Tribunal constitutionnel le Congrès propose-t-il ?",
  "Ocho": "Huit",
  "Cuatro, por mayoría de tres quintos. Otros cuatro los propone el Senado, dos el Gobierno y dos el Consejo General del Poder Judicial.":
    "Quatre, à la majorité des trois cinquièmes. Le Sénat en propose quatre autres, le gouvernement deux et le Conseil général du pouvoir judiciaire deux.",
  "¿Cuánto dura el mandato de un magistrado del Tribunal Constitucional?":
    "Combien de temps dure le mandat d'un juge du Tribunal constitutionnel ?",
  "Nueve años": "Neuf ans",
  "Doce años": "Douze ans",
  "Nueve años, y el tribunal se renueva por terceras partes cada tres, de modo que nunca cambia entero de una vez.":
    "Neuf ans, et le tribunal se renouvelle par tiers tous les trois ans, si bien qu'il ne change jamais entièrement d'un coup.",
  "¿Cada cuánto se renueva por terceras partes el Tribunal Constitucional?":
    "Tous les combien le Tribunal constitutionnel se renouvelle-t-il par tiers ?",
  "Cada año": "Chaque année",
  "Cada tres años": "Tous les trois ans",
  "Cada cinco años": "Tous les cinq ans",
  "Cada nueve años": "Tous les neuf ans",
  "Cada tres años se renueva un tercio. El escalonamiento evita que una sola mayoría parlamentaria componga el tribunal entero.":
    "Un tiers se renouvelle tous les trois ans. L'échelonnement évite qu'une seule majorité parlementaire compose le tribunal entier.",
  "¿Cuál de estas NO es competencia del Tribunal Constitucional?":
    "Laquelle de ces attributions n'appartient PAS au Tribunal constitutionnel ?",
  "El recurso de inconstitucionalidad": "Le recours en inconstitutionnalité",
  "El recurso de amparo": "Le recours en amparo",
  "Los conflictos de competencia entre el Estado y las comunidades":
    "Les conflits de compétence entre l'État et les communautés",
  "El recurso de casación penal": "Le pourvoi en cassation pénale",
  "La casación es del Tribunal Supremo, que culmina la jurisdicción ordinaria. El Constitucional juzga leyes, derechos fundamentales y repartos de competencia.":
    "La cassation appartient au Tribunal suprême, qui couronne la juridiction ordinaire. Le Constitutionnel juge des lois, des droits fondamentaux et des partages de compétence.",
  "¿Qué orden jurisdiccional resuelve los pleitos con la Administración?":
    "Quel ordre de juridiction tranche les litiges avec l'administration ?",
  "El civil": "Le civil",
  "El penal": "Le pénal",
  "El contencioso-administrativo": "Le contentieux administratif",
  "El social": "Le social",
  "El contencioso-administrativo. El social ve los conflictos laborales y de Seguridad Social, y el civil los de particulares entre sí.":
    "Le contentieux administratif. Le social connaît des conflits du travail et de Seguridad Social, et le civil de ceux entre particuliers.",
  "¿Qué prevé el artículo 125 sobre la participación ciudadana en la justicia?":
    "Que prévoit l'article 125 sur la participation des citoyens à la justice ?",
  "El tribunal del jurado": "Le jury populaire",
  "La elección popular de los jueces": "L'élection des juges par le peuple",
  "El referéndum sobre sentencias": "Le référendum sur les jugements",
  "La mediación obligatoria": "La médiation obligatoire",
  "El artículo 125 abre la puerta a la acción popular y al jurado, que juzga determinados delitos. Los jueces profesionales no se eligen: se accede por oposición.":
    "L'article 125 ouvre la voie à l'action populaire et au jury, qui juge certains délits. Les juges de métier ne s'élisent pas : on y entre par concours.",
  "¿Desde qué edad se puede votar en España?": "À partir de quel âge peut-on voter en Espagne ?",
  "Desde los dieciséis": "À partir de seize ans",
  "Desde los dieciocho": "À partir de dix-huit ans",
  "Desde los veintiuno": "À partir de vingt et un ans",
  "Desde los veinticinco": "À partir de vingt-cinq ans",
  "Desde los dieciocho, que es también la mayoría de edad. El sufragio es universal, libre, igual, directo y secreto.":
    "À partir de dix-huit ans, qui est aussi l'âge de la majorité. Le suffrage est universel, libre, égal, direct et secret.",
  "¿Qué circunscripción se emplea en las elecciones europeas?":
    "Quelle circonscription emploie-t-on aux élections européennes ?",
  "Circunscripción única para todo el país, a diferencia de las generales, que se reparten por provincias.":
    "Une circonscription unique pour tout le pays, à la différence des législatives, qui se répartissent par province.",
  "Si ningún candidato reúne la mayoría absoluta de los concejales, ¿quién resulta elegido alcalde?":
    "Si aucun candidat ne réunit la majorité absolue des conseillers, qui est élu maire ?",
  "Se repiten las elecciones": "On refait les élections",
  "El cabeza de la lista más votada": "La tête de la liste arrivée en tête",
  "El concejal de más edad": "Le doyen des conseillers",
  "Decide el pleno por sorteo": "Le conseil tranche par tirage au sort",
  "La ley prevé esa salida automática para que ningún ayuntamiento quede sin alcalde. Es la razón de que gobiernen a veces listas que no tienen mayoría en el pleno.":
    "La loi prévoit cette issue automatique pour qu'aucune commune ne reste sans maire. C'est la raison pour laquelle gouvernent parfois des listes sans majorité au conseil.",
  "¿Qué exige el artículo 6 a los partidos políticos?":
    "Qu'exige l'article 6 des partis politiques ?",
  "Que tengan sede en Madrid": "Qu'ils aient leur siège à Madrid",
  "Que su estructura interna y su funcionamiento sean democráticos":
    "Que leur organisation interne et leur fonctionnement soient démocratiques",
  "Que presenten candidatos en todas las provincias":
    "Qu'ils présentent des candidats dans toutes les provinces",
  "Que se financien solo con cuotas": "Qu'ils se financent par les seules cotisations",
  "El mismo requisito que el artículo 7 impone a sindicatos y asociaciones empresariales. Es una exigencia poco frecuente en el derecho comparado.":
    "La même exigence que l'article 7 impose aux syndicats et aux organisations patronales. C'est une règle peu courante en droit comparé.",
  "¿Cuáles son los dos sindicatos mayoritarios en España?":
    "Quels sont les deux principaux syndicats d'Espagne ?",
  "Comisiones Obreras y la Unión General de Trabajadores":
    "Comisiones Obreras et l'Union générale des travailleurs",
  "La CNT y la UGT": "La CNT et l'UGT",
  "USO y CSIF": "USO et CSIF",
  "ELA y LAB": "ELA et LAB",
  "CCOO y UGT. Los convenios que negocian se aplican a todo el sector y no solo a sus afiliados, lo que explica que su peso sea mayor que su afiliación.":
    "CCOO et UGT. Les conventions qu'ils négocient s'appliquent à toute la branche et non aux seuls adhérents, ce qui explique que leur poids dépasse leurs effectifs.",
  "¿Qué materias quedan excluidas de la iniciativa legislativa popular?":
    "Quelles matières échappent à l'initiative législative populaire ?",
  "Los tributos, lo internacional, el derecho de gracia y las leyes orgánicas":
    "L'impôt, l'international, le droit de grâce et les lois organiques",
  "Solo la reforma constitucional": "La seule révision constitutionnelle",
  "Todo lo que afecte a las comunidades autónomas": "Tout ce qui touche aux communautés autonomes",
  "La exclusión es amplia y limita bastante el alcance del instrumento: quedan fuera precisamente algunas de las materias sobre las que más se pediría legislar.":
    "L'exclusion est large et borne beaucoup la portée de l'instrument : en restent dehors précisément quelques-unes des matières sur lesquelles on demanderait le plus de légiférer.",
  "¿De quién depende el Defensor del Pueblo?": "De qui le Defensor del Pueblo relève-t-il ?",
  "Del Gobierno": "Du gouvernement",
  "De las Cortes Generales": "Des Cortes Generales",
  "Del Tribunal Constitucional": "Du Tribunal constitutionnel",
  "Del Consejo General del Poder Judicial": "Du Conseil général du pouvoir judiciaire",
  "Es alto comisionado de las Cortes Generales, no del Gobierno. Esa dependencia parlamentaria es lo que le permite supervisar a la Administración.":
    "Il est haut commissaire des Cortes Generales, non du gouvernement. C'est ce rattachement au parlement qui lui permet de surveiller l'administration.",
  "¿Son ejecutivas las resoluciones del Defensor del Pueblo?":
    "Les décisions du Defensor del Pueblo sont-elles exécutoires ?",
  "Sí, obligan a la Administración": "Oui, elles s'imposent à l'administration",
  "No: recomienda y da publicidad, y puede recurrir leyes ante el Tribunal Constitucional":
    "Non : il recommande et rend public, et peut attaquer des lois devant le Tribunal constitutionnel",
  "Sí, si las ratifica el Congreso": "Oui, si le Congrès les confirme",
  "Solo en materia de extranjería": "Seulement en matière de séjour des étrangers",
  "Su fuerza es la del informe público y la del recurso. No anula actos ni impone sanciones: para eso están los tribunales.":
    "Sa force est celle du rapport public et du recours. Il n'annule pas d'actes et n'inflige pas de sanctions : les tribunaux sont là pour cela.",
  "¿Qué organismo fiscaliza las cuentas del Estado y del sector público?":
    "Quel organisme contrôle les comptes de l'État et du secteur public ?",
  "El Tribunal de Cuentas": "Le Tribunal des comptes",
  "El Banco de España": "La Banque d'Espagne",
  "La Agencia Tributaria": "L'administration fiscale",
  "El Tribunal de Cuentas, previsto en el artículo 136 y dependiente también de las Cortes. La Agencia Tributaria recauda, que es otra función.":
    "Le Tribunal des comptes, prévu à l'article 136 et rattaché lui aussi aux Cortes. L'administration fiscale, elle, lève l'impôt, ce qui est une autre fonction.",
  "¿Quién convoca un referéndum consultivo?": "Qui convoque un référendum consultatif ?",
  "El rey, a propuesta del presidente autorizada por el Congreso":
    "Le roi, sur proposition du président autorisée par le Congrès",
  "El Congreso por sí solo": "Le Congrès à lui seul",
  "El Gobierno por decreto": "Le gouvernement, par décret",
  "Las comunidades autónomas en su territorio": "Les communautés autonomes sur leur territoire",
  "Los tres pasos del artículo 92 son sucesivos: propone el presidente, autoriza el Congreso, convoca el rey. Y su resultado es consultivo, no vinculante en sentido jurídico.":
    "Les trois étapes de l'article 92 se suivent : le président propose, le Congrès autorise, le roi convoque. Et le résultat est consultatif, non contraignant au sens juridique.",
  "¿Qué se vota en unas elecciones municipales?": "Que vote-t-on à des élections municipales ?",
  "El alcalde": "Le maire",
  "Los concejales": "Les conseillers municipaux",
  "El presidente de la diputación": "Le président du conseil provincial",
  "Una lista de concejales. El alcalde lo elige después el pleno, y el presidente de la diputación provincial sale de entre los concejales electos.":
    "Une liste de conseillers. Le maire est ensuite élu par le conseil, et le président du conseil provincial sort des conseillers élus.",
  "¿Qué permite el derecho de petición del artículo 29?":
    "Que permet le droit de pétition de l'article 29 ?",
  "Dirigirse por escrito a los poderes públicos": "S'adresser par écrit aux pouvoirs publics",
  "Exigir una respuesta favorable de la Administración":
    "Exiger une réponse favorable de l'administration",
  "Convocar una manifestación": "Convoquer une manifestation",
  "Recurrir una ley ante el Tribunal Constitucional":
    "Attaquer une loi devant le Tribunal constitutionnel",
  "Es un derecho antiguo, sencillo y poco utilizado: permite dirigirse por escrito, individual o colectivamente, sin garantizar el contenido de la respuesta.":
    "C'est un droit ancien, simple et peu employé : il permet de s'adresser par écrit, seul ou à plusieurs, sans rien garantir du contenu de la réponse.",
  "¿Cómo se elige al presidente de una comunidad autónoma?":
    "Comment élit-on le président d'une communauté autonome ?",
  "Directamente por los ciudadanos": "Directement par les citoyens",
  "Por el parlamento autonómico, que lo inviste":
    "Par le parlement de la communauté, qui l'investit",
  "Por el Gobierno central": "Par le gouvernement central",
  "Por los alcaldes de la comunidad": "Par les maires de la communauté",
  "Igual que el presidente del Gobierno en las generales: se vota una cámara y la cámara inviste. La única elección directa de personas en España es la del Senado.":
    "Comme le président du gouvernement aux législatives : on élit une chambre et la chambre investit. La seule élection directe de personnes en Espagne est celle du Sénat.",
  "¿Qué ciudad se considera la más antigua de Europa occidental?":
    "Quelle ville passe pour la plus ancienne d'Europe occidentale ?",
  "Cádiz": "Cadix",
  "Tarragona": "Tarragone",
  "Cádiz, fundada por los fenicios como factoría comercial. Antes de Roma, la costa peninsular recibió a fenicios, griegos y cartagineses.":
    "Cadix, fondée par les Phéniciens comme comptoir de commerce. Avant Rome, la côte de la péninsule reçut Phéniciens, Grecs et Carthaginois.",
  "¿Dónde desembarcaron los romanos en el 218 antes de Cristo?":
    "Où les Romains ont-ils débarqué en 218 avant Jésus-Christ ?",
  "En Ampurias": "À Ampurias",
  "En Cartagena": "À Carthagène",
  "En Tarragona": "À Tarragone",
  "En Ampurias, en la costa catalana, durante la segunda guerra púnica. La conquista completa tardaría dos siglos, hasta las guerras cántabras.":
    "À Ampurias, sur la côte catalane, pendant la deuxième guerre punique. La conquête complète prendrait deux siècles, jusqu'aux guerres cantabres.",
  "¿Qué guerras cerraron la conquista romana de la Península?":
    "Quelles guerres ont clos la conquête romaine de la péninsule ?",
  "Las guerras púnicas": "Les guerres puniques",
  "Las guerras cántabras": "Les guerres cantabres",
  "Las guerras lusitanas": "Les guerres lusitaniennes",
  "Las guerras celtíberas": "Les guerres celtibères",
  "Las cántabras, hacia el 19 antes de Cristo, dirigidas en parte por el propio Augusto. La resistencia del norte fue la última en ceder.":
    "Les guerres cantabres, vers 19 avant Jésus-Christ, conduites en partie par Auguste lui-même. La résistance du nord fut la dernière à céder.",
  "¿Qué lenguas actuales de España proceden del latín?":
    "Quelles langues actuelles d'Espagne viennent du latin ?",
  "El castellano, el gallego y el catalán": "Le castillan, le galicien et le catalan",
  "El castellano y el euskera": "Le castillan et le basque",
  "Solo el castellano": "Le castillan seul",
  "El euskera y el gallego": "Le basque et le galicien",
  "Las tres son lenguas romances. El euskera no lo es: es anterior a la llegada de Roma y sin parentesco conocido con ninguna lengua viva.":
    "Les trois sont des langues romanes. Le basque ne l'est pas : il est antérieur à l'arrivée de Rome et sans parenté connue avec aucune langue vivante.",
  "¿Qué ocurrió en el III Concilio de Toledo, en el 589?":
    "Que s'est-il passé au troisième concile de Tolède, en 589 ?",
  "Se promulgó el Liber Iudiciorum": "Le Liber Iudiciorum fut promulgué",
  "Recaredo se convirtió al catolicismo": "Récarède se convertit au catholicisme",
  "Se fundó el reino de Asturias": "Le royaume des Asturies fut fondé",
  "Se dividió el reino visigodo": "Le royaume wisigoth fut partagé",
  "El rey abandonó el arrianismo, con lo que el reino quedó unificado en religión y la monarquía atada a la Iglesia. El Liber Iudiciorum llegaría en el 654.":
    "Le roi abandonna l'arianisme, ce qui unifia le royaume dans la religion et lia la monarchie à l'Église. Le Liber Iudiciorum viendrait en 654.",
  "¿Qué pueblos entraron en la Península en el 409?":
    "Quels peuples entrèrent dans la péninsule en 409 ?",
  "Suevos, vándalos y alanos": "Les Suèves, les Vandales et les Alains",
  "Normandos y sajones": "Les Normands et les Saxons",
  "Hunos y ostrogodos": "Les Huns et les Ostrogoths",
  "Bereberes y árabes": "Les Berbères et les Arabes",
  "Tras ellos llegaron los visigodos, que acabaron imponiéndose y estableciendo la capital en Toledo. Los ejércitos musulmanes no cruzarían hasta el 711.":
    "Après eux vinrent les Wisigoths, qui finirent par s'imposer et fixèrent la capitale à Tolède. Les armées musulmanes ne passeraient qu'en 711.",
  "¿En qué batalla fue derrotado el último rey visigodo?":
    "En quelle bataille le dernier roi wisigoth fut-il battu ?",
  "En Covadonga": "À Covadonga",
  "En Guadalete": "Au Guadalete",
  "En Las Navas de Tolosa": "À Las Navas de Tolosa",
  "En Numancia": "À Numance",
  "En Guadalete, en el 711. Covadonga fue en cambio la escaramuza en que la tradición sitúa el origen del reino de Asturias, once años después.":
    "Au Guadalete, en 711. Covadonga fut en revanche l'escarmouche où la tradition place l'origine du royaume des Asturies, onze ans plus tard.",
  "¿Quién proclamó el Califato de Córdoba?": "Qui a proclamé le califat de Cordoue ?",
  "Almanzor": "Almanzor",
  "Abderramán III": "Abd al-Rahman III",
  "Boabdil": "Boabdil",
  "Tariq": "Tariq",
  "Abderramán III, en el 929, con lo que el emirato se independizó también en lo religioso. Boabdil fue el último rey de Granada, cinco siglos después.":
    "Abd al-Rahman III, en 929, ce qui rendit l'émirat indépendant aussi en matière religieuse. Boabdil fut le dernier roi de Grenade, cinq siècles plus tard.",
  "¿Qué son los reinos de taifas?": "Que sont les royaumes de taïfas ?",
  "Los estados en que se fragmentó al-Ándalus tras 1031":
    "Les États en lesquels al-Andalus se morcela après 1031",
  "Los condados cristianos del Pirineo": "Les comtés chrétiens des Pyrénées",
  "Las provincias romanas de Hispania": "Les provinces romaines d'Hispanie",
  "Los territorios que Castilla cedió a Portugal":
    "Les territoires que la Castille céda au Portugal",
  "Más de veinte estados rivales surgidos del hundimiento del califato. Su debilidad les obligó a pagar tributos a los reinos del norte y a llamar en su auxilio a almorávides y almohades.":
    "Plus de vingt États rivaux nés de l'effondrement du califat. Leur faiblesse les obligea à payer tribut aux royaumes du nord et à appeler à leur secours Almoravides et Almohades.",
  "¿Qué ciudad tomó Alfonso VI en 1085?": "Quelle ville Alphonse VI a-t-il prise en 1085 ?",
  "Zaragoza": "Saragosse",
  "Toledo, la antigua capital visigoda, que se convirtió en el gran punto de contacto entre las culturas y sede de la Escuela de Traductores.":
    "Tolède, l'ancienne capitale wisigothe, qui devint le grand point de contact entre les cultures et le siège de l'École des traducteurs.",
  "¿Qué hacía la Escuela de Traductores de Toledo?":
    "Que faisait l'École des traducteurs de Tolède ?",
  "Enseñaba latín a los nobles castellanos": "Elle enseignait le latin aux nobles castillans",
  "Vertía al latín obras griegas y árabes que Europa había perdido":
    "Elle versait en latin des œuvres grecques et arabes que l'Europe avait perdues",
  "Traducía la Biblia a las lenguas peninsulares":
    "Elle traduisait la Bible dans les langues de la péninsule",
  "Formaba intérpretes para la corte": "Elle formait des interprètes pour la cour",
  "Cristianos, musulmanes y judíos trabajaron juntos en ella. Por esa vía volvieron a Europa Aristóteles, Euclides y buena parte de la ciencia griega, a través del árabe.":
    "Chrétiens, musulmans et juifs y travaillèrent ensemble. C'est par cette voie que revinrent en Europe Aristote, Euclide et une bonne part de la science grecque, en passant par l'arabe.",
  "¿Qué victoria de 1212 abrió el valle del Guadalquivir?":
    "Quelle victoire de 1212 a ouvert la vallée du Guadalquivir ?",
  "Guadalete": "Le Guadalete",
  "Las Navas de Tolosa": "Las Navas de Tolosa",
  "Covadonga": "Covadonga",
  "Lepanto": "Lépante",
  "Las Navas de Tolosa, con los reyes de Castilla, Aragón y Navarra combatiendo juntos. Córdoba caería en 1236 y Sevilla en 1248.":
    "Las Navas de Tolosa, où les rois de Castille, d'Aragon et de Navarre combattirent ensemble. Cordoue tomberait en 1236 et Séville en 1248.",
  "¿Qué quedaba de al-Ándalus después de la toma de Sevilla en 1248?":
    "Que restait-il d'al-Andalus après la prise de Séville en 1248 ?",
  "Nada: la conquista estaba completa": "Rien : la conquête était achevée",
  "El reino nazarí de Granada": "Le royaume nasride de Grenade",
  "El reino de Valencia": "Le royaume de Valence",
  "Las islas Baleares": "Les îles Baléares",
  "Granada sobrevivió como reino vasallo dos siglos y medio más, y en ese tiempo construyó la Alhambra. No caería hasta 1492.":
    "Grenade survécut comme royaume vassal deux siècles et demi de plus, et bâtit dans ce temps l'Alhambra. Elle ne tomberait qu'en 1492.",
  "¿En qué año se casaron Isabel de Castilla y Fernando de Aragón?":
    "En quelle année Isabelle de Castille et Ferdinand d'Aragon se sont-ils mariés ?",
  "En 1469": "En 1469",
  "En 1479": "En 1479",
  "En 1492": "En 1492",
  "En 1512": "En 1512",
  "En 1469. Fue una unión dinástica: cada reino conservó sus leyes, sus cortes, su moneda y sus aduanas durante dos siglos y medio más.":
    "En 1469. Ce fut une union dynastique : chaque royaume garda ses lois, ses cortes, sa monnaie et ses douanes deux siècles et demi de plus.",
  "¿Qué significa que la unión de Castilla y Aragón fue dinástica?":
    "Que veut dire que l'union de la Castille et de l'Aragon fut dynastique ?",
  "Que solo duró una generación": "Qu'elle ne dura qu'une génération",
  "Que compartieron corona pero siguieron siendo reinos distintos, con leyes propias":
    "Qu'ils partagèrent une couronne mais restèrent des royaumes distincts, avec leurs propres lois",
  "Que la decidieron las cortes de ambos reinos": "Que les cortes des deux royaumes en décidèrent",
  "Que fue reconocida por el papa": "Qu'elle fut reconnue par le pape",
  "Compartieron monarcas, no ordenamiento. La unificación jurídica llegó con los Decretos de Nueva Planta, ya en el siglo XVIII y con un rey Borbón.":
    "Ils partagèrent des souverains, non un ordre juridique. L'unification du droit vint avec les décrets de Nueva Planta, au dix-huitième siècle et sous un roi Bourbon.",
  "¿Qué obra publicó Nebrija en 1492?": "Quel ouvrage Nebrija a-t-il publié en 1492 ?",
  "El primer diccionario de la lengua": "Le premier dictionnaire de la langue",
  "La primera gramática de una lengua romance": "La première grammaire d'une langue romane",
  "La primera traducción de la Biblia al castellano":
    "La première traduction de la Bible en castillan",
  "El primer atlas del Nuevo Mundo": "Le premier atlas du Nouveau Monde",
  "La Gramática castellana, la primera de una lengua romance. Que apareciera el mismo año que Granada y América no fue casualidad: la lengua se pensaba ya como instrumento de gobierno.":
    "La Gramática castellana, la première d'une langue romane. Qu'elle paraisse l'année de Grenade et de l'Amérique n'est pas un hasard : on pensait déjà la langue comme un instrument de gouvernement.",
  "¿En qué año se incorporó Navarra a la corona?":
    "En quelle année la Navarre fut-elle rattachée à la couronne ?",
  "En 1580": "En 1580",
  "En 1512, conservando sus fueros e instituciones, que están en el origen del régimen foral que Navarra mantiene hoy.":
    "En 1512, en gardant ses fueros et ses institutions, à l'origine du régime foral que la Navarre conserve aujourd'hui.",
  "¿Por qué Carlos I es también conocido como Carlos V?":
    "Pourquoi Charles Ier est-il aussi connu comme Charles Quint ?",
  "Porque reinó dos veces": "Parce qu'il régna deux fois",
  "Porque fue el quinto rey de Castilla con ese nombre":
    "Parce qu'il fut le cinquième roi de Castille de ce nom",
  "Porque fue además emperador del Sacro Imperio":
    "Parce qu'il fut en outre empereur du Saint-Empire",
  "Porque cambió de nombre al abdicar": "Parce qu'il changea de nom en abdiquant",
  "Carlos I de España y V del Sacro Imperio Romano Germánico. Heredó Castilla, Aragón, Italia, Flandes, Austria y América, un conjunto sin precedentes.":
    "Charles Ier d'Espagne et Charles Quint du Saint-Empire romain germanique. Il hérita de la Castille, de l'Aragon, de l'Italie, des Flandres, de l'Autriche et de l'Amérique, un ensemble sans précédent.",
  "¿En qué año fijó Felipe II la capital en Madrid?":
    "En quelle année Philippe II a-t-il fixé la capitale à Madrid ?",
  "En 1516": "En 1516",
  "En 1561": "En 1561",
  "En 1605": "En 1605",
  "En 1561. Hasta entonces la corte era itinerante, y se eligió Madrid por su posición central más que por su tamaño, que era modesto.":
    "En 1561. Jusque-là la cour était itinérante, et l'on choisit Madrid pour sa position centrale plus que pour sa taille, qui était modeste.",
  "¿Entre qué años estuvo Portugal unido a la corona española?":
    "Entre quelles années le Portugal fut-il uni à la couronne d'Espagne ?",
  "Entre 1492 y 1512": "Entre 1492 et 1512",
  "Entre 1580 y 1640": "Entre 1580 et 1640",
  "Entre 1640 y 1713": "Entre 1640 et 1713",
  "Nunca lo estuvo": "Il ne l'a jamais été",
  "Sesenta años, desde Felipe II hasta la sublevación de 1640, simultánea a la de Cataluña. Portugal recuperó entonces su independencia de forma definitiva.":
    "Soixante ans, de Philippe II au soulèvement de 1640, en même temps que celui de la Catalogne. Le Portugal recouvra alors son indépendance pour de bon.",
  "¿Qué provocó las sublevaciones de Portugal y Cataluña en 1640?":
    "Qu'a provoqué les soulèvements du Portugal et de la Catalogne en 1640 ?",
  "Una epidemia de peste": "Une épidémie de peste",
  "Las exigencias fiscales y militares del conde-duque de Olivares":
    "Les exigences fiscales et militaires du comte-duc d'Olivares",
  "La expulsión de los moriscos": "L'expulsion des morisques",
  "El descubrimiento de la plata de Potosí": "La découverte de l'argent de Potosí",
  "El esfuerzo de guerra continuo agotó a los reinos periféricos y las dos revueltas estallaron el mismo año. Cataluña volvió a la corona tras doce años; Portugal, nunca.":
    "L'effort de guerre continu épuisa les royaumes périphériques et les deux révoltes éclatèrent la même année. La Catalogne revint à la couronne au bout de douze ans ; le Portugal, jamais.",
  "¿Quién pintó Las Meninas?": "Qui a peint Les Ménines ?",
  "El Greco": "Le Greco",
  "Velázquez": "Vélasquez",
  "Murillo": "Murillo",
  "Goya": "Goya",
  "Diego Velázquez, en 1656, y el cuadro está en el Museo del Prado. Goya es un siglo y medio posterior, ya en la época de la Guerra de la Independencia.":
    "Diego Vélasquez, en 1656, et le tableau est au musée du Prado. Goya vient un siècle et demi plus tard, à l'époque de la guerre d'Indépendance.",
  "¿Qué perdió España en el Tratado de Utrecht de 1713?":
    "Qu'a perdu l'Espagne au traité d'Utrecht de 1713 ?",
  "Cuba y Filipinas": "Cuba et les Philippines",
  "Sus territorios europeos y Gibraltar": "Ses territoires d'Europe et Gibraltar",
  "Navarra y el Rosellón": "La Navarre et le Roussillon",
  "Portugal y sus colonias": "Le Portugal et ses colonies",
  "Los territorios en Italia y Flandes, además de Menorca y Gibraltar, que sigue siendo británico. Cuba y Filipinas se perdieron en 1898.":
    "Les territoires d'Italie et des Flandres, ainsi que Minorque et Gibraltar, qui reste britannique. Cuba et les Philippines furent perdues en 1898.",
  "¿Qué hicieron los Decretos de Nueva Planta?": "Qu'ont fait les décrets de Nueva Planta ?",
  "Crear las provincias actuales": "Créer les provinces actuelles",
  "Suprimir las instituciones propias de la Corona de Aragón y extender el modelo castellano":
    "Supprimer les institutions propres de la couronne d'Aragon et étendre le modèle castillan",
  "Reformar el ejército tras el Desastre del 98": "Réformer l'armée après le désastre de 98",
  "Fundar las primeras universidades": "Fonder les premières universités",
  "Felipe V los impuso tras ganar la Guerra de Sucesión. Con ellos la unión dinástica de 1469 se convirtió, dos siglos y medio después, en un Estado unificado.":
    "Philippe V les imposa après avoir gagné la guerre de Succession. Avec eux, l'union dynastique de 1469 devint, deux siècles et demi plus tard, un État unifié.",
  "¿Cómo se llama el periodo cultural que va aproximadamente del siglo XVI al XVII?":
    "Comment s'appelle la période culturelle qui va environ du seizième au dix-septième siècle ?",
  "El Renacimiento": "La Renaissance",
  "La Ilustración": "Les Lumières",
  "El Modernismo": "Le modernisme",
  "El Siglo de Oro, que reúne a Cervantes, Lope, Calderón, Quevedo y Góngora en literatura y a El Greco, Velázquez y Murillo en pintura.":
    "Le Siècle d'or, qui réunit Cervantès, Lope, Calderón, Quevedo et Góngora en littérature, et le Greco, Vélasquez et Murillo en peinture.",
  "¿Qué ciudad conserva hoy Las Meninas y buena parte de la pintura del Siglo de Oro?":
    "Quelle ville conserve aujourd'hui Les Ménines et une bonne part de la peinture du Siècle d'or ?",
  "Madrid, en el Museo del Prado": "Madrid, au musée du Prado",
  "Barcelona, en el MNAC": "Barcelone, au MNAC",
  "Sevilla, en el Museo de Bellas Artes": "Séville, au musée des Beaux-Arts",
  "Toledo, en el Museo del Greco": "Tolède, au musée du Greco",
  "El Museo del Prado, en Madrid, reúne la colección real. El Greco tiene museo propio en Toledo, pero el grueso de la pintura de la época está en el Prado.":
    "Le musée du Prado, à Madrid, réunit la collection royale. Le Greco a son propre musée à Tolède, mais le gros de la peinture de l'époque est au Prado.",
  "¿A quién colocó Napoleón en el trono español?":
    "Qui Napoléon a-t-il placé sur le trône d'Espagne ?",
  "A Fernando VII": "Ferdinand VII",
  "A su hermano José I": "Son frère Joseph Ier",
  "A Amadeo de Saboya": "Amédée de Savoie",
  "A Carlos IV": "Charles IV",
  "A José Bonaparte, conocido como José I. El levantamiento del 2 de mayo de 1808 dio comienzo a la Guerra de la Independencia.":
    "Joseph Bonaparte, connu comme Joseph Ier. Le soulèvement du 2 mai 1808 ouvrit la guerre d'Indépendance.",
  "¿Qué palabra española de uso internacional nació en la Guerra de la Independencia?":
    "Quel mot espagnol d'usage international est né de la guerre d'Indépendance ?",
  "Fiesta": "Fiesta",
  "Guerrilla": "Guerrilla",
  "Siesta": "Siesta",
  "Armada": "Armada",
  "Guerrilla, por las partidas irregulares que hostigaban al ejército francés. Es uno de los préstamos españoles más extendidos en otras lenguas.":
    "Guerrilla, du nom des bandes irrégulières qui harcelaient l'armée française. C'est l'un des emprunts espagnols les plus répandus dans les autres langues.",
  "¿En qué ciudad se aprobó la primera Constitución española?":
    "Dans quelle ville la première Constitution espagnole fut-elle adoptée ?",
  "En Madrid": "À Madrid",
  "En Bayona": "À Bayonne",
  "En Cádiz, la ciudad que resistía mientras el resto del país estaba ocupado. Se aprobó el 19 de marzo de 1812.":
    "À Cadix, la ville qui résistait pendant que le reste du pays était occupé. Elle fut adoptée le 19 mars 1812.",
  "¿Qué principio proclamaba la Constitución de 1812?":
    "Quel principe la Constitution de 1812 proclamait-elle ?",
  "La soberanía nacional": "La souveraineté nationale",
  "El derecho divino de los reyes": "Le droit divin des rois",
  "El sufragio universal femenino": "Le suffrage universel des femmes",
  "El Estado autonómico": "L'État des autonomies",
  "Soberanía nacional, división de poderes y libertad de imprenta. Fernando VII la derogó en 1814 al regresar del cautiverio.":
    "Souveraineté nationale, séparation des pouvoirs et liberté de la presse. Ferdinand VII l'abrogea en 1814 à son retour de captivité.",
  "¿Qué rey derogó la Constitución de 1812 al volver al trono?":
    "Quel roi a abrogé la Constitution de 1812 en remontant sur le trône ?",
  "Carlos IV": "Charles IV",
  "José I": "Joseph Ier",
  "Fernando VII": "Ferdinand VII",
  "Alfonso XII": "Alphonse XII",
  "Fernando VII, en 1814, restaurando el absolutismo. El vaivén entre texto liberal y vuelta atrás se repetiría durante todo el siglo.":
    "Ferdinand VII, en 1814, rétablissant l'absolutisme. Le va-et-vient entre texte libéral et retour en arrière se répéterait tout au long du siècle.",
  "¿Entre qué años se independizó la América continental española?":
    "Entre quelles années l'Amérique continentale espagnole a-t-elle pris son indépendance ?",
  "Entre 1780 y 1800": "Entre 1780 et 1800",
  "Entre 1810 y 1824": "Entre 1810 et 1824",
  "Entre 1830 y 1850": "Entre 1830 et 1850",
  "Entre 1860 y 1880": "Entre 1860 et 1880",
  "El vacío de poder de 1808 fue el detonante, y la batalla de Ayacucho cerró el proceso en 1824. Quedaron solo Cuba, Puerto Rico y Filipinas.":
    "Le vide du pouvoir de 1808 fut l'étincelle, et la bataille d'Ayacucho close le mouvement en 1824. Ne restèrent que Cuba, Porto Rico et les Philippines.",
  "¿Qué enfrentaron en el fondo las guerras carlistas?":
    "Qu'opposaient au fond les guerres carlistes ?",
  "Dos ideas de país: liberalismo frente a absolutismo, centro frente a fueros":
    "Deux idées du pays : le libéralisme contre l'absolutisme, le centre contre les fueros",
  "Castilla contra Aragón": "La Castille contre l'Aragon",
  "La Iglesia contra el ejército": "L'Église contre l'armée",
  "El campo contra la ciudad exclusivamente": "La campagne contre la ville, et rien d'autre",
  "La disputa dinástica entre Isabel y su tío Carlos ocultaba un choque más hondo. Fueron tres guerras civiles a lo largo del siglo, con intervalos, hasta 1876.":
    "La querelle dynastique entre Isabelle et son oncle Charles cachait un choc plus profond. Ce furent trois guerres civiles au long du siècle, entrecoupées de trêves, jusqu'en 1876.",
  "¿Cómo se llamó la revolución de 1868?": "Comment s'est appelée la révolution de 1868 ?",
  "La Semana Trágica": "La Semaine tragique",
  "La Gloriosa, que abrió el Sexenio Democrático. La Pepa es la Constitución de 1812, y la Restauración empieza en 1875.":
    "La Gloriosa, qui ouvrit les six années démocratiques. La Pepa, c'est la Constitution de 1812, et la Restauration commence en 1875.",
  "¿Qué rey extranjero ocupó el trono español durante el Sexenio Democrático?":
    "Quel roi étranger a occupé le trône d'Espagne pendant les six années démocratiques ?",
  "Amadeo de Saboya": "Amédée de Savoie",
  "Leopoldo de Hohenzollern": "Léopold de Hohenzollern",
  "Fernando de Coburgo": "Ferdinand de Cobourg",
  "Luis de Orleans": "Louis d'Orléans",
  "Amadeo de Saboya, que reinó dos años y abdicó en 1873. Su marcha dio paso a la Primera República.":
    "Amédée de Savoie, qui régna deux ans et abdiqua en 1873. Son départ ouvrit la Première République.",
  "¿Quién diseñó el sistema de turno de la Restauración?":
    "Qui a conçu le système d'alternance de la Restauration ?",
  "Cánovas del Castillo": "Cánovas del Castillo",
  "Sagasta": "Sagasta",
  "Prim": "Prim",
  "Espartero": "Espartero",
  "Antonio Cánovas del Castillo, con Alfonso XII en el trono desde 1875. Los dos partidos se alternaban por acuerdo, sostenidos en el campo por el caciquismo.":
    "Antonio Cánovas del Castillo, avec Alphonse XII sur le trône à partir de 1875. Les deux partis s'alternaient par entente, soutenus dans les campagnes par le caciquisme.",
  "¿Qué era el caciquismo?": "Qu'était le caciquisme ?",
  "Un impuesto sobre la tierra": "Un impôt sur la terre",
  "El control de las elecciones en el campo por notables locales":
    "La mainmise des notables locaux sur les élections dans les campagnes",
  "Un sistema de gremios urbanos": "Un système de corporations urbaines",
  "El nombre del turno de partidos": "Le nom de l'alternance entre les partis",
  "Notables locales garantizaban el resultado que el turno había pactado de antemano. Es lo que permitía que la alternancia funcionara sin que las elecciones decidieran nada.":
    "Des notables locaux garantissaient le résultat que l'alternance avait arrêté d'avance. C'est ce qui permettait au système de tourner sans que les élections décident quoi que ce soit.",
  "¿Con qué país se enfrentó España en 1898?":
    "À quel pays l'Espagne s'est-elle heurtée en 1898 ?",
  "Con Francia": "À la France",
  "Con el Reino Unido": "Au Royaume-Uni",
  "Con Estados Unidos": "Aux États-Unis",
  "Con Alemania": "À l'Allemagne",
  "Con Estados Unidos, en una guerra breve que costó a España Cuba, Puerto Rico y Filipinas. Se lo llamó simplemente el Desastre.":
    "Aux États-Unis, dans une guerre brève qui coûta à l'Espagne Cuba, Porto Rico et les Philippines. On l'appela simplement le Désastre.",
  "¿Qué grupo de escritores surgió de la conmoción de 1898?":
    "Quel groupe d'écrivains est né de l'ébranlement de 1898 ?",
  "La Generación del 27": "La génération de 27",
  "La Generación del 98": "La génération de 98",
  "El Modernismo catalán": "Le modernisme catalan",
  "La Institución Libre de Enseñanza": "L'Institution libre d'enseignement",
  "Unamuno, Baroja, Azorín y Machado, entre otros, se preguntaron qué era España y qué debía hacer consigo misma. La Generación del 27 es tres décadas posterior.":
    "Unamuno, Baroja, Azorín et Machado, entre autres, se demandèrent ce qu'était l'Espagne et ce qu'elle devait faire d'elle-même. La génération de 27 vient trente ans plus tard.",
  "¿Entre qué años gobernó la dictadura de Primo de Rivera?":
    "Entre quelles années la dictature de Primo de Rivera a-t-elle gouverné ?",
  "Entre 1917 y 1920": "Entre 1917 et 1920",
  "Entre 1923 y 1930": "Entre 1923 et 1930",
  "Entre 1931 y 1936": "Entre 1931 et 1936",
  "Entre 1936 y 1939": "Entre 1936 et 1939",
  "Siete años con el consentimiento de Alfonso XIII. Su caída arrastró al rey: las municipales del año siguiente se leyeron como un plebiscito sobre la monarquía.":
    "Sept ans avec l'assentiment d'Alphonse XIII. Sa chute entraîna le roi : les municipales de l'année suivante furent lues comme un plébiscite sur la monarchie.",
  "¿Qué elecciones precipitaron la caída de Alfonso XIII?":
    "Quelles élections ont précipité la chute d'Alphonse XIII ?",
  "Unas generales": "Des législatives",
  "Unas municipales": "Des municipales",
  "Unas europeas": "Des européennes",
  "Un referéndum": "Un référendum",
  "Las municipales del 12 de abril de 1931. Las ciudades votaron republicano y el rey salió del país dos días después.":
    "Les municipales du 12 avril 1931. Les villes votèrent républicain et le roi quitta le pays deux jours plus tard.",
  "¿Qué introdujo la Constitución republicana de 1931?":
    "Qu'a introduit la Constitution républicaine de 1931 ?",
  "El Estado laico, el divorcio y el voto femenino":
    "L'État laïque, le divorce et le vote des femmes",
  "El Estado de las autonomías tal como existe hoy":
    "L'État des autonomies tel qu'il existe aujourd'hui",
  "El sufragio censitario": "Le suffrage censitaire",
  "Fue de las más avanzadas de su tiempo. También abrió la vía a los estatutos de autonomía: el de Cataluña se aprobó en 1932 y el del País Vasco en 1936.":
    "Elle fut l'une des plus avancées de son temps. Elle ouvrit aussi la voie aux statuts d'autonomie : celui de la Catalogne fut adopté en 1932 et celui du Pays basque en 1936.",
  "¿En qué año votaron las mujeres por primera vez en España?":
    "En quelle année les femmes ont-elles voté pour la première fois en Espagne ?",
  "En 1931": "En 1931",
  "En 1933": "En 1933",
  "En 1977": "En 1977",
  "El derecho se aprobó en 1931 y se ejerció en las elecciones de 1933. Clara Campoamor lo había defendido en las Cortes contra buena parte de su propio grupo.":
    "Le droit fut voté en 1931 et exercé aux élections de 1933. Clara Campoamor l'avait défendu aux Cortes contre une bonne part de son propre groupe.",
  "¿Qué diputada se opuso al voto femenino en el debate de 1931?":
    "Quelle députée s'est opposée au vote des femmes dans le débat de 1931 ?",
  "Margarita Nelken": "Margarita Nelken",
  "Victoria Kent, también republicana y también diputada, temía que el voto de las mujeres favoreciera a la derecha. El debate entre ambas es uno de los más citados de aquellas Cortes.":
    "Victoria Kent, républicaine et députée elle aussi, craignait que le vote des femmes ne serve la droite. Le débat entre les deux est l'un des plus cités de ces Cortes.",
  "¿Qué convirtió la sublevación de julio de 1936 en una guerra civil?":
    "Qu'est-ce qui a fait du soulèvement de juillet 1936 une guerre civile ?",
  "La intervención de Francia": "L'intervention de la France",
  "Que el golpe triunfó en unas zonas y fracasó en otras":
    "Que le coup d'État réussit dans certaines régions et échoua dans d'autres",
  "La negativa del rey a firmar": "Le refus du roi de signer",
  "Una huelga general": "Une grève générale",
  "El fracaso parcial partió el país en dos y ninguno de los bandos pudo imponerse rápido. Un golpe que triunfa del todo o fracasa del todo no produce tres años de guerra.":
    "L'échec partiel coupa le pays en deux et aucun camp ne put l'emporter vite. Un coup d'État qui réussit tout à fait ou échoue tout à fait ne produit pas trois ans de guerre.",
  "¿Qué países apoyaron al bando sublevado?": "Quels pays ont soutenu le camp des insurgés ?",
  "Francia y el Reino Unido": "La France et le Royaume-Uni",
  "Alemania e Italia": "L'Allemagne et l'Italie",
  "La Unión Soviética": "L'Union soviétique",
  "Estados Unidos y Portugal": "Les États-Unis et le Portugal",
  "Alemania e Italia apoyaron a los sublevados y la Unión Soviética a la República, mientras las democracias occidentales se mantenían en la no intervención.":
    "L'Allemagne et l'Italie soutinrent les insurgés et l'Union soviétique la République, tandis que les démocraties occidentales s'en tenaient à la non-intervention.",
  "¿Qué cuadro pintó Picasso a raíz del bombardeo de 1937?":
    "Quel tableau Picasso a-t-il peint après le bombardement de 1937 ?",
  "Las Meninas": "Les Ménines",
  "El Guernica": "Guernica",
  "Los fusilamientos del 3 de mayo": "Tres de Mayo, les fusillades du 3 mai",
  "El jardín de las delicias": "Le Jardin des délices",
  "El Guernica, hoy en el Museo Reina Sofía de Madrid. Los fusilamientos del 3 de mayo es de Goya y recuerda la represión francesa de 1808.":
    "Guernica, aujourd'hui au musée Reina Sofía de Madrid. Les fusillades du 3 mai sont de Goya et rappellent la répression française de 1808.",
  "¿Cuántos años duró la dictadura de Franco?": "Combien d'années a duré la dictature de Franco ?",
  "Veintiocho": "Vingt-huit",
  "Treinta y seis": "Trente-six",
  "Cuarenta y cinco": "Quarante-cinq",
  "De 1939 a 1975. La Segunda República había durado ocho años, de los cuales solo los tres últimos fueron de guerra.":
    "De 1939 à 1975. La Seconde République avait duré huit ans, dont seuls les trois derniers furent de guerre.",
  "¿Cómo se llamó la política económica de los años cuarenta?":
    "Comment s'est appelée la politique économique des années quarante ?",
  "La estabilización": "La stabilisation",
  "La reconversión": "La reconversion",
  "Autarquía: aislamiento, cartillas de racionamiento y hambre. Se los conoce como los años del hambre. El desarrollismo llegaría en los sesenta.":
    "L'autarcie : isolement, cartes de rationnement et faim. On les appelle les années de la faim. La croissance viendrait dans les années soixante.",
  "¿En qué año ingresó España en la ONU?": "En quelle année l'Espagne est-elle entrée à l'ONU ?",
  "En 1953": "En 1953",
  "En 1955": "En 1955",
  "En 1955, tras los acuerdos con Estados Unidos y el concordato con la Santa Sede, ambos de 1953, que rompieron el aislamiento de la posguerra.":
    "En 1955, après les accords avec les États-Unis et le concordat avec le Saint-Siège, tous deux de 1953, qui rompirent l'isolement d'après-guerre.",
  "¿A quién designó Franco como sucesor a título de rey?":
    "Qui Franco a-t-il désigné pour lui succéder à titre de roi ?",
  "A Alfonso XIII": "Alphonse XIII",
  "A Juan de Borbón": "Jean de Bourbon",
  "A Juan Carlos de Borbón": "Juan Carlos de Bourbon",
  "A Carrero Blanco": "Carrero Blanco",
  "A Juan Carlos, nieto de Alfonso XIII, en 1969, pasando por encima de su padre. Carrero Blanco era el sucesor previsto en la presidencia del Gobierno, no en la jefatura del Estado.":
    "Juan Carlos, petit-fils d'Alphonse XIII, en 1969, en passant par-dessus son père. Carrero Blanco était le successeur prévu à la présidence du gouvernement, non à la tête de l'État.",
  "¿Qué trajeron los años sesenta a la economía española?":
    "Qu'ont apporté les années soixante à l'économie espagnole ?",
  "Cartillas de racionamiento": "Des cartes de rationnement",
  "Industria, turismo y las divisas de la emigración a Europa":
    "L'industrie, le tourisme et les devises envoyées par les émigrés d'Europe",
  "La nacionalización de la banca": "La nationalisation des banques",
  "El ingreso en la Comunidad Económica Europea":
    "L'entrée dans la Communauté économique européenne",
  "Es lo que se llamó desarrollismo. Dos millones de españoles trabajaban en Europa y sus envíos, junto al turismo, sostuvieron la balanza de pagos.":
    "C'est ce qu'on a appelé le desarrollismo. Deux millions d'Espagnols travaillaient en Europe et leurs envois, avec le tourisme, ont soutenu la balance des paiements.",
  "¿Cuándo fue proclamado rey Juan Carlos I?": "Quand Juan Carlos I fut-il proclamé roi ?",
  "El 20 de noviembre de 1975": "Le 20 novembre 1975",
  "El 22 de noviembre de 1975": "Le 22 novembre 1975",
  "El 15 de junio de 1977": "Le 15 juin 1977",
  "Dos días después de la muerte de Franco, dentro de las reglas del propio régimen. Las primeras elecciones libres llegarían año y medio más tarde.":
    "Deux jours après la mort de Franco, selon les règles du régime lui-même. Les premières élections libres viendraient un an et demi plus tard.",
  "¿Qué norma abrió el paso a las elecciones libres?":
    "Quel texte a ouvert la voie aux élections libres ?",
  "La Ley para la Reforma Política": "La loi de réforme politique",
  "La Ley de Amnistía": "La loi d'amnistie",
  "Los Pactos de la Moncloa": "Les pactes de la Moncloa",
  "La Ley Orgánica del Estado": "La loi organique de l'État",
  "Aprobada por las propias Cortes del régimen y ratificada en referéndum en diciembre de 1976. De ahí la fórmula: se fue de la ley a la ley, sin ruptura formal.":
    "Adoptée par les Cortes du régime lui-même et ratifiée par référendum en décembre 1976. D'où la formule : on est allé de la loi à la loi, sans rupture formelle.",
  "¿Qué partido se legalizó un Sábado Santo de 1977?":
    "Quel parti fut légalisé un samedi saint de 1977 ?",
  "El PSOE": "Le PSOE",
  "El Partido Comunista": "Le Parti communiste",
  "Alianza Popular": "Alianza Popular",
  "UCD": "L'UCD",
  "El PCE, en la decisión más arriesgada del periodo. Se eligió un fin de semana largo precisamente para amortiguar la reacción.":
    "Le PCE, dans la décision la plus risquée de la période. On choisit un week-end prolongé précisément pour amortir la réaction.",
  "¿En qué fecha se celebraron las primeras elecciones libres desde 1936?":
    "À quelle date eurent lieu les premières élections libres depuis 1936 ?",
  "El 28 de octubre de 1982": "Le 28 octobre 1982",
  "El 23 de febrero de 1981": "Le 23 février 1981",
  "Cuarenta y un años después de las últimas. La Constitución llegaría año y medio más tarde, redactada por las Cortes salidas de esa votación.":
    "Quarante et un ans après les précédentes. La Constitution viendrait un an et demi plus tard, rédigée par les Cortes issues de ce scrutin.",
  "¿Qué fueron los Pactos de la Moncloa?": "Que furent les pactes de la Moncloa ?",
  "Un acuerdo entre el rey y los militares": "Un accord entre le roi et les militaires",
  "Un acuerdo económico y social entre gobierno y oposición":
    "Un accord économique et social entre le gouvernement et l'opposition",
  "El pacto que fijó las autonomías": "Le pacte qui a fixé les autonomies",
  "El tratado de adhesión a la CEE": "Le traité d'adhésion à la CEE",
  "Firmados en octubre de 1977 con una inflación superior al veinte por ciento. Permitieron afrontar la crisis mientras se redactaba la Constitución.":
    "Signés en octobre 1977 avec une inflation de plus de vingt pour cent. Ils permirent d'affronter la crise pendant que l'on rédigeait la Constitution.",
  "¿Qué se asaltó el 23 de febrero de 1981?": "Que prit-on d'assaut le 23 février 1981 ?",
  "La sede del Gobierno catalán": "Le siège du gouvernement catalan",
  "El Congreso, durante una votación de investidura, con el Gobierno y los diputados dentro. El golpe fracasó esa misma noche.":
    "Le Congrès, pendant un vote d'investiture, avec le gouvernement et les députés à l'intérieur. Le coup d'État échoua la nuit même.",
  "¿Qué partido ganó las elecciones de 1982 con mayoría absoluta?":
    "Quel parti a gagné les élections de 1982 avec la majorité absolue ?",
  "El PCE": "Le PCE",
  "El PSOE, con Felipe González, y gobernó hasta 1996. La alternancia demostró que el sistema funcionaba.":
    "Le PSOE, avec Felipe González, et il gouverna jusqu'en 1996. L'alternance montra que le système fonctionnait.",
  "¿Qué se decidió en el referéndum de 1986, además de la entrada en la CEE?":
    "Que décida-t-on au référendum de 1986, à côté de l'entrée dans la CEE ?",
  "La permanencia en la OTAN": "Le maintien dans l'OTAN",
  "La reforma del Senado": "La réforme du Sénat",
  "El mapa autonómico": "La carte des autonomies",
  "La adopción del euro": "L'adoption de l'euro",
  "La entrada en la CEE no se sometió a referéndum: fue un tratado. Lo que se votó ese año fue la permanencia en la OTAN, y ganó el sí.":
    "L'entrée dans la CEE ne fut pas soumise à référendum : c'était un traité. Ce qu'on vota cette année-là fut le maintien dans l'OTAN, et le oui l'emporta.",
  "¿Qué tres acontecimientos coincidieron en España en 1992?":
    "Quels trois événements ont coïncidé en Espagne en 1992 ?",
  "Los Juegos de Barcelona, la Expo de Sevilla y el primer AVE":
    "Les Jeux de Barcelone, l'Expo de Séville et le premier AVE",
  "La entrada en la CEE, el euro y la OTAN": "L'entrée dans la CEE, l'euro et l'OTAN",
  "La Constitución, el 23-F y las autonomías": "La Constitution, le 23 février et les autonomies",
  "El Mundial de fútbol, la Expo y la peseta":
    "La Coupe du monde de football, l'Expo et la peseta",
  "Doce meses en los que el país se enseñó al mundo. El Mundial de fútbol se había celebrado diez años antes, en 1982.":
    "Douze mois pendant lesquels le pays s'est montré au monde. La Coupe du monde de football avait eu lieu dix ans plus tôt, en 1982.",
  "¿Qué moneda sustituyó el euro en 2002?": "Quelle monnaie l'euro a-t-il remplacée en 2002 ?",
  "El real": "Le real",
  "La peseta": "La peseta",
  "El duro": "Le duro",
  "La peseta, que había circulado desde 1868. El duro era el nombre coloquial de la moneda de cinco pesetas, no una moneda distinta.":
    "La peseta, qui circulait depuis 1868. Le duro était le nom familier de la pièce de cinq pesetas, non une monnaie distincte.",
  "¿Qué ocurrió el 11 de marzo de 2004?": "Que s'est-il passé le 11 mars 2004 ?",
  "El intento de golpe de Estado": "La tentative de coup d'État",
  "Los atentados en trenes de cercanías de Madrid":
    "Les attentats dans les trains de banlieue de Madrid",
  "La abdicación de Juan Carlos I": "L'abdication de Juan Carlos I",
  "La entrada en el euro": "L'entrée dans l'euro",
  "Ciento noventa y tres muertos: el mayor atentado de la historia de España. El 23-F fue en 1981 y la abdicación en 2014.":
    "Cent quatre-vingt-treize morts : le plus grand attentat de l'histoire d'Espagne. Le 23 février, c'était 1981, et l'abdication 2014.",
  "¿En qué año anunció ETA su disolución?":
    "En quelle année l'ETA a-t-elle annoncé sa dissolution ?",
  "Anunció el fin de su actividad armada en 2011 y su disolución en 2018. Había causado más de ochocientas muertes desde los años sesenta.":
    "Elle a annoncé la fin de son activité armée en 2011 et sa dissolution en 2018. Elle avait causé plus de huit cents morts depuis les années soixante.",
  "¿Por qué se dice que la Transición fue una reforma y no una ruptura?":
    "Pourquoi dit-on que la Transition fut une réforme et non une rupture ?",
  "Porque la dirigió el ejército": "Parce que l'armée l'a conduite",
  "Porque las instituciones del régimen aprobaron su propia disolución":
    "Parce que les institutions du régime ont voté leur propre dissolution",
  "Porque no hubo elecciones": "Parce qu'il n'y a pas eu d'élections",
  "Porque la Constitución se copió de otro país":
    "Parce que la Constitution a été copiée sur un autre pays",
  "Las Cortes franquistas votaron la ley que las disolvía, y de ahí la fórmula de ir de la ley a la ley. Esa elección explica tanto la estabilidad posterior como los debates que siguen abiertos.":
    "Les Cortes franquistes ont voté la loi qui les dissolvait, d'où la formule d'aller de la loi à la loi. Ce choix explique autant la stabilité qui a suivi que les débats qui restent ouverts.",
  "¿Cuántas ciudades autónomas hay en España?": "Combien de villes autonomes compte l'Espagne ?",
  "Ceuta y Melilla, ambas desde 1995. No son comunidades autónomas, sino una categoría propia con estatuto y competencias más limitadas.":
    "Ceuta et Melilla, toutes deux depuis 1995. Ce ne sont pas des communautés autonomes, mais une catégorie à part, au statut et aux compétences plus limités.",
  "¿Qué título de la Constitución regula la organización territorial?":
    "Quel titre de la Constitution règle l'organisation territoriale ?",
  "El título VIII, que no enumera comunidades sino que establece cómo pueden constituirse. El mapa autonómico se hizo después, siguiendo ese procedimiento.":
    "Le titre VIII, qui n'énumère pas les communautés mais fixe comment elles peuvent se constituer. La carte des autonomies s'est faite ensuite, selon cette procédure.",
  "¿Qué comunidades accedieron a la autonomía por la vía rápida del artículo 151?":
    "Quelles communautés ont accédé à l'autonomie par la voie rapide de l'article 151 ?",
  "Cataluña, País Vasco, Galicia y Andalucía":
    "La Catalogne, le Pays basque, la Galice et l'Andalousie",
  "Madrid, Cataluña y el País Vasco": "Madrid, la Catalogne et le Pays basque",
  "Todas las que tienen lengua propia": "Toutes celles qui ont une langue propre",
  "Las siete uniprovinciales": "Les sept à province unique",
  "Las tres con estatuto plebiscitado durante la República, más Andalucía, que lo consiguió tras un referéndum en 1980. Las demás siguieron la vía más lenta del artículo 143.":
    "Les trois dont le statut avait été plébiscité sous la République, plus l'Andalousie, qui l'obtint après un référendum en 1980. Les autres ont suivi la voie plus lente de l'article 143.",
  "¿Con qué tipo de norma se aprueba un Estatuto de Autonomía?":
    "Par quel type de texte un statut d'autonomie est-il adopté ?",
  "Con un decreto del Gobierno": "Par un décret du gouvernement",
  "Con una ley orgánica": "Par une loi organique",
  "Con una ley ordinaria": "Par une loi ordinaire",
  "Con un reglamento autonómico": "Par un règlement de la communauté",
  "Ley orgánica de las Cortes Generales. Por eso su reforma exige el acuerdo de la comunidad y del Estado: pertenece a los dos ordenamientos a la vez.":
    "Une loi organique des Cortes Generales. C'est pourquoi sa révision exige l'accord de la communauté et de l'État : il appartient aux deux ordres juridiques à la fois.",
  "¿Cuántas provincias tiene España?": "Combien de provinces compte l'Espagne ?",
  "Treinta y ocho": "Trente-huit",
  "Ochenta y una": "Quatre-vingt-une",
  "Cincuenta provincias, agrupadas en diecisiete comunidades. Siete comunidades son uniprovinciales, como Madrid, Murcia o Asturias.":
    "Cinquante provinces, réunies en dix-sept communautés. Sept communautés n'ont qu'une province, comme Madrid, Murcie ou les Asturies.",
  "¿Qué ocurre en una comunidad uniprovincial?":
    "Qu'en est-il dans une communauté à province unique ?",
  "Tiene dos parlamentos": "Elle a deux parlements",
  "La comunidad absorbe las funciones de la diputación provincial":
    "La communauté reprend les fonctions du conseil provincial",
  "No tiene estatuto propio": "Elle n'a pas de statut propre",
  "Depende directamente del Gobierno central": "Elle relève directement du gouvernement central",
  "Al coincidir el territorio, no tiene sentido mantener dos administraciones. Madrid, Murcia, Asturias, Cantabria, La Rioja, Navarra y las Baleares están en ese caso.":
    "Le territoire étant le même, garder deux administrations n'a pas de sens. Madrid, Murcie, les Asturies, la Cantabrie, La Rioja, la Navarre et les Baléares sont dans ce cas.",
  "¿Qué artículo enumera las competencias exclusivas del Estado?":
    "Quel article énumère les compétences exclusives de l'État ?",
  "El artículo 143": "L'article 143",
  "El artículo 148": "L'article 148",
  "El artículo 149": "L'article 149",
  "El artículo 155": "L'article 155",
  "El 149 lista lo que es exclusivo del Estado y el 148 lo que las comunidades pueden asumir. El 143 es una de las vías de acceso a la autonomía y el 155 el mecanismo de última instancia.":
    "Le 149 liste ce qui est exclusif à l'État et le 148 ce que les communautés peuvent prendre en charge. Le 143 est l'une des voies d'accès à l'autonomie et le 155 le mécanisme de dernier recours.",
  "¿Cuál de estas materias es competencia exclusiva del Estado?":
    "Laquelle de ces matières est de la compétence exclusive de l'État ?",
  "El turismo": "Le tourisme",
  "El urbanismo": "L'urbanisme",
  "La administración de justicia": "L'administration de la justice",
  "La agricultura": "L'agriculture",
  "Justicia, defensa, relaciones internacionales y moneda están entre las exclusivas. Turismo, urbanismo y agricultura son de las que las comunidades pueden asumir.":
    "La justice, la défense, les relations internationales et la monnaie comptent parmi les exclusives. Le tourisme, l'urbanisme et l'agriculture sont de celles que les communautés peuvent prendre en charge.",
  "¿Cómo se llama el sistema de financiación del País Vasco?":
    "Comment s'appelle le régime de financement du Pays basque ?",
  "El convenio": "Le convenio",
  "El concierto": "Le concierto",
  "El cupo común": "Le cupo commun",
  "El fondo foral": "Le fonds foral",
  "El concierto económico vasco; el navarro se llama convenio. Ambos permiten recaudar los propios impuestos y pagar al Estado una cantidad por los servicios comunes.":
    "Le concierto económico basque ; celui de Navarre s'appelle convenio. Les deux permettent de lever ses propres impôts et de verser à l'État une somme pour les services communs.",
  "¿Qué mecanismo prevé el artículo 155?": "Quel mécanisme l'article 155 prévoit-il ?",
  "La disolución de un parlamento autonómico por el rey":
    "La dissolution d'un parlement de communauté par le roi",
  "Medidas del Gobierno, aprobadas por el Senado, si una comunidad incumple gravemente":
    "Des mesures du gouvernement, approuvées par le Sénat, si une communauté manque gravement à ses obligations",
  "La creación de nuevas comunidades": "La création de nouvelles communautés",
  "El reparto anual de los fondos europeos": "La répartition annuelle des fonds européens",
  "Requiere un requerimiento previo y la aprobación del Senado por mayoría absoluta. Se aplicó por primera vez en 2017, casi cuarenta años después de escribirse.":
    "Il exige une mise en demeure préalable et l'accord du Sénat à la majorité absolue. Il fut appliqué pour la première fois en 2017, près de quarante ans après avoir été écrit.",
  "¿Quién representa a la Administración del Estado en cada comunidad autónoma?":
    "Qui représente l'administration de l'État dans chaque communauté autonome ?",
  "El presidente autonómico": "Le président de la communauté",
  "El alcalde de la capital": "Le maire du chef-lieu",
  "El presidente del Tribunal Superior de Justicia":
    "Le président du Tribunal supérieur de justice",
  "El delegado del Gobierno, nombrado por el Gobierno central, con subdelegados en cada provincia. No es un cargo autonómico.":
    "Le délégué du gouvernement, nommé par le gouvernement central, avec des sous-délégués dans chaque province. Ce n'est pas une charge de la communauté.",
  "¿Para qué sirve el Fondo de Compensación Interterritorial?":
    "À quoi sert le Fonds de compensation interterritoriale ?",
  "Para financiar las lenguas cooficiales": "À financer les langues coofficielles",
  "Para corregir desequilibrios económicos entre territorios":
    "À corriger les déséquilibres économiques entre territoires",
  "Para pagar la deuda de las comunidades": "À payer la dette des communautés",
  "Para repartir los fondos europeos": "À répartir les fonds européens",
  "La Constitución garantiza la solidaridad entre territorios y prohíbe que las diferencias entre estatutos supongan privilegios económicos o sociales. Este fondo es el instrumento.":
    "La Constitution garantit la solidarité entre territoires et interdit que les différences entre statuts se traduisent par des privilèges économiques ou sociaux. Ce fonds en est l'instrument.",
  "¿Cómo se llama el parlamento de una comunidad autónoma?":
    "Comment s'appelle le parlement d'une communauté autonome ?",
  "Cortes Generales": "Cortes Generales",
  "Diputación": "Diputación",
  "Asamblea legislativa, con nombres propios en cada comunidad: Parlament, Cortes, Junta General, Asamblea. El Consejo de Gobierno es el ejecutivo, no el legislativo.":
    "L'assemblée législative, sous des noms propres à chaque communauté : Parlament, Cortes, Junta General, Asamblea. Le Consejo de Gobierno est l'exécutif, non le législatif.",
  "¿Qué extensión aproximada tiene España?": "Quelle est à peu près la superficie de l'Espagne ?",
  "300.000 km²": "300 000 km²",
  "400.000 km²": "400 000 km²",
  "505.000 km²": "505 000 km²",
  "700.000 km²": "700 000 km²",
  "Unos 505.000 kilómetros cuadrados, lo que la convierte en el segundo país más extenso de la Unión Europea, tras Francia.":
    "Quelque 505 000 kilomètres carrés, ce qui en fait le deuxième pays le plus vaste de l'Union européenne, après la France.",
  "¿Qué país europeo es más montañoso que España?":
    "Quel pays d'Europe est plus montagneux que l'Espagne ?",
  "Austria": "L'Autriche",
  "Suiza": "La Suisse",
  "Italia": "L'Italie",
  "Noruega": "La Norvège",
  "Solo Suiza tiene una altitud media mayor. La Meseta Central está por encima de los seiscientos metros, y eso explica los inviernos duros del interior pese a la latitud.":
    "Seule la Suisse a une altitude moyenne plus élevée. La Meseta centrale dépasse les six cents mètres, et cela explique les hivers rudes de l'intérieur malgré la latitude.",
  "¿Qué cordillera separa España de Francia?": "Quelle chaîne sépare l'Espagne de la France ?",
  "El Sistema Ibérico": "Le Système ibérique",
  "Sierra Morena": "La Sierra Morena",
  "Los Pirineos, de mar a mar, con Andorra encajada entre ambos países. La Cantábrica cierra el norte peninsular pero no es frontera.":
    "Les Pyrénées, d'une mer à l'autre, avec Andorre coincée entre les deux pays. La cordillère Cantabrique ferme le nord de la péninsule mais n'est pas une frontière.",
  "¿Cuál es el pico más alto de la Península?": "Quel est le plus haut sommet de la péninsule ?",
  "El Moncayo": "Le Moncayo",
  "El Mulhacén, en Sierra Nevada, con 3.479 metros. El Teide es más alto pero está en Tenerife, y el Aneto es el techo de los Pirineos.":
    "Le Mulhacén, dans la Sierra Nevada, avec 3 479 mètres. Le Teide est plus haut mais il se trouve à Tenerife, et l'Aneto est le toit des Pyrénées.",
  "¿Cuál es el río de mayor caudal de España?":
    "Quel est le fleuve d'Espagne au plus fort débit ?",
  "El Ebro, y es además el gran río de la vertiente mediterránea, la más seca. El Tajo es el más largo y el Guadalquivir el único navegable.":
    "L'Èbre, et c'est en outre le grand fleuve du versant méditerranéen, le plus sec. Le Tage est le plus long et le Guadalquivir le seul navigable.",
  "¿Qué río español es navegable hasta una ciudad del interior?":
    "Quel fleuve espagnol est navigable jusqu'à une ville de l'intérieur ?",
  "El Guadalquivir, hasta Sevilla": "Le Guadalquivir, jusqu'à Séville",
  "El Ebro, hasta Zaragoza": "L'Èbre, jusqu'à Saragosse",
  "El Duero, hasta Valladolid": "Le Douro, jusqu'à Valladolid",
  "El Tajo, hasta Toledo": "Le Tage, jusqu'à Tolède",
  "Sevilla es el único puerto fluvial de España, a ochenta kilómetros de la desembocadura. Fue lo que la convirtió en la puerta del comercio americano.":
    "Séville est le seul port fluvial d'Espagne, à quatre-vingts kilomètres de l'embouchure. C'est ce qui en fit la porte du commerce américain.",
  "¿Cuáles son las tres vertientes hidrográficas españolas?":
    "Quels sont les trois versants hydrographiques espagnols ?",
  "Cantábrica, atlántica y mediterránea": "Cantabrique, atlantique et méditerranéen",
  "Norte, centro y sur": "Nord, centre et sud",
  "Atlántica, africana y balear": "Atlantique, africain et baléare",
  "Pirenaica, ibérica y bética": "Pyrénéen, ibérique et bétique",
  "La cantábrica tiene ríos cortos y caudalosos, la atlántica los grandes ríos peninsulares y la mediterránea es la más seca salvo por el Ebro.":
    "Le cantabrique a des fleuves courts et abondants, l'atlantique les grands fleuves de la péninsule, et le méditerranéen est le plus sec, l'Èbre mis à part.",
  "¿En qué océano están las Islas Canarias?": "Dans quel océan se trouvent les îles Canaries ?",
  "En el Mediterráneo": "En Méditerranée",
  "En el Atlántico": "Dans l'Atlantique",
  "En el Cantábrico": "Dans la mer Cantabrique",
  "En el mar de Alborán": "Dans la mer d'Alboran",
  "En el Atlántico, frente a la costa africana y a unos mil quinientos kilómetros de la Península. Las Baleares son las mediterráneas.":
    "Dans l'Atlantique, face à la côte africaine et à quelque mille cinq cents kilomètres de la péninsule. Les Baléares, elles, sont en Méditerranée.",
  "¿Qué particularidad horaria tienen las Canarias?":
    "Quelle particularité horaire les Canaries ont-elles ?",
  "Tienen una hora menos que la Península": "Elles ont une heure de moins que la péninsule",
  "Tienen una hora más": "Elles ont une heure de plus",
  "No cambian la hora en verano": "Elles ne changent pas d'heure en été",
  "Ninguna: comparten horario con el resto del país":
    "Aucune : elles ont l'heure du reste du pays",
  "Una hora menos, y es la única parte de España en otro huso. Los avisos horarios de la televisión española lo recuerdan a diario.":
    "Une heure de moins, et c'est la seule partie de l'Espagne dans un autre fuseau. Les annonces horaires de la télévision espagnole le rappellent tous les jours.",
  "¿Cuál es el origen geológico de las Canarias?":
    "Quelle est l'origine géologique des Canaries ?",
  "Sedimentario": "Sédimentaire",
  "Volcánico": "Volcanique",
  "Coralino": "Corallienne",
  "Glaciar": "Glaciaire",
  "Volcánico, y el volcanismo sigue activo: la erupción de La Palma en 2021 lo recordó. El Teide es el mayor de esos edificios volcánicos.":
    "Volcanique, et le volcanisme reste actif : l'éruption de La Palma en 2021 l'a rappelé. Le Teide est le plus grand de ces édifices volcaniques.",
  "¿Con qué países y territorios limita España?":
    "Avec quels pays et territoires l'Espagne a-t-elle une frontière ?",
  "Portugal, Francia, Andorra, Gibraltar y Marruecos":
    "Le Portugal, la France, Andorre, Gibraltar et le Maroc",
  "Portugal y Francia solamente": "Le Portugal et la France seulement",
  "Portugal, Francia e Italia": "Le Portugal, la France et l'Italie",
  "Portugal, Francia, Andorra e Italia": "Le Portugal, la France, Andorre et l'Italie",
  "Con Marruecos por Ceuta y Melilla, y con el territorio británico de Gibraltar en el sur peninsular. Italia no comparte frontera terrestre con España.":
    "Avec le Maroc par Ceuta et Melilla, et avec le territoire britannique de Gibraltar au sud de la péninsule. L'Italie n'a pas de frontière terrestre avec l'Espagne.",
  "¿Qué tienen de singular Ceuta y Melilla en el conjunto de la Unión Europea?":
    "Qu'ont de singulier Ceuta et Melilla dans l'ensemble de l'Union européenne ?",
  "Son las únicas ciudades sin ayuntamiento": "Ce sont les seules villes sans municipalité",
  "Son las únicas fronteras terrestres de la Unión con África":
    "Ce sont les seules frontières terrestres de l'Union avec l'Afrique",
  "Son las únicas exentas de impuestos": "Ce sont les seules exemptes d'impôt",
  "Son las únicas fuera del espacio Schengen": "Ce sont les seules hors de l'espace Schengen",
  "Están en el norte de África y, por tanto, la Unión Europea tiene ahí su única frontera terrestre con el continente africano.":
    "Elles se trouvent en Afrique du Nord et l'Union européenne y a donc sa seule frontière terrestre avec le continent africain.",
  "¿Cómo se conoce a la franja húmeda del norte peninsular?":
    "Comment appelle-t-on la bande humide du nord de la péninsule ?",
  "La España seca": "L'Espagne sèche",
  "La España verde": "L'Espagne verte",
  "La España vaciada": "L'Espagne vidée",
  "La cornisa mediterránea": "La corniche méditerranéenne",
  "La España verde, de clima oceánico, con lluvias repartidas todo el año. La España vaciada designa en cambio el interior despoblado, que es otra cosa.":
    "L'Espagne verte, de climat océanique, avec des pluies réparties sur toute l'année. L'Espagne vidée désigne au contraire l'intérieur dépeuplé, ce qui est autre chose.",
  "¿Cuántos apartados tiene el artículo 3 de la Constitución?":
    "Combien d'alinéas l'article 3 de la Constitution compte-t-il ?",
  "Tres: el castellano como lengua oficial del Estado, la cooficialidad de las demás según los estatutos, y la protección de las modalidades lingüísticas como patrimonio.":
    "Trois : le castillan comme langue officielle de l'État, le caractère coofficiel des autres selon les statuts, et la protection des parlers comme patrimoine.",
  "¿En qué comunidades es oficial el catalán?":
    "Dans quelles communautés le catalan est-il officiel ?",
  "Solo en Cataluña": "En Catalogne seulement",
  "En Cataluña y las Illes Balears, y en la Comunidad Valenciana con la denominación de valenciano":
    "En Catalogne et aux Illes Balears, et dans la Communauté valencienne sous le nom de valencien",
  "En Cataluña y Aragón": "En Catalogne et en Aragon",
  "En toda la costa mediterránea": "Sur toute la côte méditerranéenne",
  "Tres comunidades, con la particularidad de la denominación que fija el estatuto valenciano. En Aragón hay hablantes en la franja oriental, pero sin oficialidad.":
    "Trois communautés, avec la particularité du nom que fixe le statut valencien. En Aragon il y a des locuteurs dans la frange orientale, mais sans caractère officiel.",
  "¿Con qué lengua comparte origen el gallego?":
    "Avec quelle langue le galicien partage-t-il son origine ?",
  "Con el castellano": "Avec le castillan",
  "Con el portugués": "Avec le portugais",
  "Con el catalán": "Avec le catalan",
  "Con el asturiano": "Avec l'asturien",
  "Ambos proceden del galaicoportugués medieval, y de ahí su proximidad. Todas las demás lenguas romances peninsulares vienen también del latín, pero por ramas distintas.":
    "Tous deux viennent du galaïco-portugais médiéval, d'où leur proximité. Les autres langues romanes de la péninsule viennent aussi du latin, mais par d'autres branches.",
  "¿En qué territorios es oficial el euskera?":
    "Sur quels territoires le basque est-il officiel ?",
  "En el País Vasco y en la zona vascófona de Navarra":
    "Au Pays basque et dans la zone bascophone de Navarre",
  "Solo en el País Vasco": "Au Pays basque seulement",
  "En el País Vasco, Navarra y La Rioja": "Au Pays basque, en Navarre et à La Rioja",
  "En todo el norte peninsular": "Dans tout le nord de la péninsule",
  "En Navarra el régimen lingüístico varía por comarcas, con una zona vascófona, una mixta y una no vascófona. En el País Vasco es oficial en toda la comunidad.":
    "En Navarre, le régime linguistique change selon les cantons : une zone bascophone, une mixte et une non bascophone. Au Pays basque, il est officiel dans toute la communauté.",
  "¿Qué es el euskera batua?": "Qu'est-ce que le basque batua ?",
  "Un dialecto del euskera hablado en Vizcaya": "Un dialecte du basque parlé en Biscaye",
  "El estándar escrito unificado, fijado desde los años sesenta":
    "La norme écrite unifiée, fixée depuis les années soixante",
  "El nombre vasco de la Constitución": "Le nom basque de la Constitution",
  "Un método de enseñanza para adultos": "Une méthode d'enseignement pour adultes",
  "Batua significa unificado. Antes de él el euskera tenía dialectos históricos sin una norma común escrita; el batua es lo que se enseña hoy en la escuela.":
    "Batua veut dire unifié. Avant lui, le basque avait des dialectes historiques sans norme écrite commune ; le batua est ce que l'on enseigne aujourd'hui à l'école.",
  "¿De qué lengua es una variedad el aranés?": "De quelle langue l'aranais est-il une variété ?",
  "Del catalán": "Du catalan",
  "Del occitano": "De l'occitan",
  "Del francés": "Du français",
  "Del aragonés": "De l'aragonais",
  "Del occitano, la lengua del sur de Francia. Es oficial en toda Cataluña desde 2006 y propia del Valle de Arán.":
    "De l'occitan, la langue du sud de la France. Il est officiel dans toute la Catalogne depuis 2006 et propre au val d'Aran.",
  "¿Qué protege el tercer apartado del artículo 3?":
    "Que protège le troisième alinéa de l'article 3 ?",
  "Las lenguas cooficiales": "Les langues coofficielles",
  "Las modalidades lingüísticas de España como patrimonio cultural":
    "Les parlers d'Espagne, comme patrimoine culturel",
  "El derecho a estudiar en la lengua materna": "Le droit d'étudier dans sa langue maternelle",
  "El uso del castellano en la Administración": "L'emploi du castillan dans l'administration",
  "Es el apartado que ampara hablas sin cooficialidad como el asturiano, el aragonés, el leonés o la fala extremeña, con grados de reconocimiento que fijan las leyes autonómicas.":
    "C'est l'alinéa qui abrite les parlers sans caractère coofficiel comme l'asturien, l'aragonais, le léonais ou la fala d'Estrémadure, avec des degrés de reconnaissance que fixent les lois des communautés.",
  "¿Cuál de estas hablas NO es cooficial en ninguna comunidad?":
    "Lequel de ces parlers n'est coofficiel dans AUCUNE communauté ?",
  "El asturiano": "L'asturien",
  "El asturiano, llamado también bable, está protegido por su estatuto pero no es lengua oficial. Las otras tres sí lo son en sus territorios.":
    "L'asturien, qu'on appelle aussi bable, est protégé par le statut de sa communauté mais n'est pas langue officielle. Les trois autres le sont sur leur territoire.",
  "¿Cuántas personas hablan español en el mundo, aproximadamente?":
    "Combien de personnes parlent l'espagnol dans le monde, à peu près ?",
  "Cien millones": "Cent millions",
  "Trescientos millones": "Trois cents millions",
  "Seiscientos millones": "Six cents millions",
  "Mil millones": "Un milliard",
  "Alrededor de seiscientos millones, lo que la sitúa como segunda lengua materna del mundo tras el chino mandarín. La mayoría de sus hablantes no vive en España.":
    "Environ six cents millions, ce qui en fait la deuxième langue maternelle du monde après le mandarin. La plupart de ceux qui la parlent ne vivent pas en Espagne.",
  "¿Qué país tiene más hispanohablantes?": "Quel pays compte le plus d'hispanophones ?",
  "España": "L'Espagne",
  "Argentina": "L'Argentine",
  "Colombia": "La Colombie",
  "México": "Le Mexique",
  "México, con mucha diferencia. Es la razón de que la norma del español no se decida solo en Madrid, sino en común con las academias americanas.":
    "Le Mexique, et de loin. C'est la raison pour laquelle la norme de l'espagnol ne se décide pas à Madrid seulement, mais en commun avec les académies d'Amérique.",
  "¿Cómo se llama la asociación que reúne a la RAE con las academias americanas?":
    "Comment s'appelle l'association qui réunit la RAE et les académies d'Amérique ?",
  "La Asociación de Academias de la Lengua Española":
    "L'Association des académies de la langue espagnole",
  "La Organización de Estados Iberoamericanos": "L'Organisation des États ibéro-américains",
  "El Instituto Cervantes": "L'Instituto Cervantes",
  "La Unión Panhispánica": "L'Union panhispanique",
  "Con ella se publican en común diccionarios y gramáticas, en lo que se llama política panhispánica. El Instituto Cervantes se ocupa en cambio de difundir la lengua fuera.":
    "Avec elle se publient en commun dictionnaires et grammaires, dans ce qu'on appelle la politique panhispanique. L'Instituto Cervantes, lui, s'occupe de répandre la langue au dehors.",
  "¿Qué organismo administra las pruebas de lengua para la nacionalidad?":
    "Quel organisme fait passer les épreuves de langue pour la nationalité ?",
  "La Real Academia Española": "La Real Academia Española",
  "La Escuela Oficial de Idiomas": "L'École officielle de langues",
  "El Instituto Cervantes administra tanto el DELE como la prueba CCSE. El Ministerio de Justicia resuelve el expediente de nacionalidad, que es otra fase.":
    "L'Instituto Cervantes fait passer aussi bien le DELE que l'épreuve CCSE. Le ministère de la Justice tranche le dossier de nationalité, ce qui est une autre étape.",
  "¿Por qué la Constitución emplea la palabra castellano y no español?":
    "Pourquoi la Constitution emploie-t-elle le mot castillan et non espagnol ?",
  "Porque español es un término americano": "Parce qu'espagnol est un terme d'Amérique",
  "Porque las demás lenguas de España también son españolas":
    "Parce que les autres langues d'Espagne sont espagnoles elles aussi",
  "Porque castellano es más antiguo": "Parce que castillan est plus ancien",
  "Por un error de redacción nunca corregido": "À cause d'une erreur de rédaction jamais corrigée",
  "Llamar español solo a una de ellas dejaría fuera al catalán, al gallego y al euskera, que son igualmente lenguas de España. Fuera del país predomina el término español.":
    "Réserver le nom d'espagnol à l'une d'elles laisserait dehors le catalan, le galicien et le basque, qui sont tout autant des langues d'Espagne. Hors du pays, c'est le terme espagnol qui domine.",
  "¿Cuál es el sector económico más importante de España?":
    "Quel est le secteur économique le plus important d'Espagne ?",
  "La industria": "L'industrie",
  "Los servicios": "Les services",
  "La minería": "Les mines",
  "Los servicios, y dentro de ellos el turismo, que sitúa a España año tras año entre los primeros destinos del mundo por número de visitantes.":
    "Les services, et parmi eux le tourisme, qui place l'Espagne année après année parmi les premières destinations du monde par le nombre de visiteurs.",
  "¿Qué provincia abastece de hortalizas a buena parte de Europa en invierno?":
    "Quelle province fournit en légumes une bonne partie de l'Europe en hiver ?",
  "Almería": "Almería",
  "Valencia": "Valence",
  "Murcia": "Murcie",
  "Huelva": "Huelva",
  "El mar de invernaderos de Almería, en la zona más árida de Europa continental, produce fuera de temporada gracias al clima y a la tecnología de riego.":
    "La mer de serres d'Almería, dans la zone la plus aride d'Europe continentale, produit hors saison grâce au climat et aux techniques d'irrigation.",
  "¿Qué particularidad tiene la industria automovilística española?":
    "Quelle particularité a l'industrie automobile espagnole ?",
  "Es la mayor de Europa": "C'est la plus grande d'Europe",
  "Fabrica mucho pero sin marcas propias: las plantas son de grupos extranjeros":
    "Elle produit beaucoup mais sans marques à elle : les usines appartiennent à des groupes étrangers",
  "Se concentra en una sola región": "Elle se concentre dans une seule région",
  "Produce solo vehículos eléctricos": "Elle ne produit que des véhicules électriques",
  "España está entre los mayores fabricantes europeos, con plantas repartidas por varias comunidades, pero las marcas pertenecen a grupos con sede fuera del país.":
    "L'Espagne compte parmi les plus grands producteurs d'Europe, avec des usines réparties dans plusieurs communautés, mais les marques appartiennent à des groupes dont le siège est hors du pays.",
  "¿Qué energías renovables tienen más peso en España?":
    "Quelles énergies renouvelables pèsent le plus en Espagne ?",
  "La geotérmica y la mareomotriz": "La géothermie et l'énergie marémotrice",
  "La eólica y la solar": "L'éolien et le solaire",
  "La biomasa y el carbón": "La biomasse et le charbon",
  "La nuclear y la hidráulica": "Le nucléaire et l'hydraulique",
  "El viento del interior y las horas de sol favorecen a ambas. La nuclear no es renovable, aunque también aporta a la generación.":
    "Le vent de l'intérieur et les heures de soleil les favorisent l'un et l'autre. Le nucléaire n'est pas renouvelable, même s'il contribue aussi à la production.",
  "¿Cuál es el problema económico más persistente de España?":
    "Quel est le problème économique le plus tenace de l'Espagne ?",
  "La inflación": "L'inflation",
  "El paro": "Le chômage",
  "La deuda externa privada": "La dette extérieure privée",
  "La escasez de energía": "Le manque d'énergie",
  "La tasa de desempleo lleva décadas por encima de la media europea, con dos rasgos añadidos: el paro juvenil y la elevada temporalidad de los contratos.":
    "Le taux de chômage dépasse depuis des décennies la moyenne européenne, avec deux traits qui s'y ajoutent : le chômage des jeunes et la forte part des contrats courts.",
  "¿Qué es la temporalidad en el mercado laboral?":
    "Qu'est-ce que la temporalité sur le marché du travail ?",
  "El trabajo estacional en la agricultura": "Le travail saisonnier dans l'agriculture",
  "La proporción de contratos de duración limitada": "La part des contrats de durée limitée",
  "El número de horas extraordinarias": "Le nombre d'heures supplémentaires",
  "La rotación entre sectores": "Le passage d'un secteur à l'autre",
  "Es la parte del empleo que no es indefinida, y en España ha sido históricamente alta en comparación europea. Afecta sobre todo a los trabajadores jóvenes.":
    "C'est la part de l'emploi qui n'est pas à durée indéterminée, et elle a toujours été haute en Espagne à l'échelle européenne. Elle touche surtout les jeunes salariés.",
  "¿Qué caracteriza la demografía española actual?":
    "Qu'est-ce qui caractérise la démographie espagnole d'aujourd'hui ?",
  "Natalidad muy baja y esperanza de vida muy alta":
    "Une natalité très basse et une espérance de vie très haute",
  "Natalidad alta y población joven": "Une natalité haute et une population jeune",
  "Población estable desde 1980": "Une population stable depuis 1980",
  "Emigración masiva y despoblación general": "Une émigration massive et un dépeuplement général",
  "La combinación de las dos cosas es lo que tensiona el sistema de pensiones a largo plazo. La esperanza de vida española está entre las mayores del mundo.":
    "C'est la rencontre des deux qui met le système de retraites sous tension à long terme. L'espérance de vie espagnole est parmi les plus hautes du monde.",
  "¿Qué financiaron en España los fondos estructurales y de cohesión europeos?":
    "Qu'ont financé en Espagne les fonds structurels et de cohésion européens ?",
  "Las pensiones": "Les retraites",
  "Carreteras, depuradoras, universidades y trenes":
    "Des routes, des stations d'épuration, des universités et des trains",
  "La deuda pública": "La dette publique",
  "Las nóminas de los funcionarios": "Les salaires des fonctionnaires",
  "Transformaron las infraestructuras del país en poco más de una década tras la entrada en 1986. Es el efecto más visible de la integración europea.":
    "Ils ont transformé les infrastructures du pays en un peu plus d'une décennie après l'entrée de 1986. C'est l'effet le plus visible de l'intégration européenne.",
  "¿Cuántos años de residencia necesitan los nacionales iberoamericanos para pedir la nacionalidad?":
    "Combien d'années de résidence faut-il aux ressortissants ibéro-américains pour demander la nationalité ?",
  "Dos, frente a los diez del plazo general. El vínculo con América no es solo lingüístico: está también escrito en el Código Civil.":
    "Deux, contre dix pour le délai général. Le lien avec l'Amérique n'est pas seulement linguistique : il est aussi écrit dans le code civil.",
  "¿Qué reúnen periódicamente las Cumbres Iberoamericanas?":
    "Que réunissent régulièrement les sommets ibéro-américains ?",
  "A los jefes de Estado y de Gobierno de los países iberoamericanos":
    "Les chefs d'État et de gouvernement des pays ibéro-américains",
  "A los rectores de las universidades": "Les recteurs des universités",
  "A los ministros de Economía de la Unión Europea":
    "Les ministres de l'Économie de l'Union européenne",
  "A las academias de la lengua": "Les académies de la langue",
  "Son el marco institucional del vínculo con América Latina, junto con organismos comunes en educación y cultura.":
    "Ils sont le cadre institutionnel du lien avec l'Amérique latine, avec des organismes communs en matière d'éducation et de culture.",
  "¿Junto a qué país entró España en la Comunidad Económica Europea?":
    "Avec quel pays l'Espagne est-elle entrée dans la Communauté économique européenne ?",
  "Junto a Grecia": "Avec la Grèce",
  "Junto a Portugal": "Avec le Portugal",
  "Junto a Irlanda": "Avec l'Irlande",
  "Sola": "Seule",
  "Con Portugal, el 1 de enero de 1986. Grecia había entrado cinco años antes, en 1981.":
    "Avec le Portugal, le 1er janvier 1986. La Grèce était entrée cinq ans plus tôt, en 1981.",
  "¿De dónde proceden principalmente los residentes extranjeros en España?":
    "D'où viennent principalement les résidents étrangers en Espagne ?",
  "De América Latina, Europa del Este, Marruecos y la propia Unión Europea":
    "D'Amérique latine, d'Europe de l'Est, du Maroc et de l'Union européenne elle-même",
  "Solo de la Unión Europea": "De la seule Union européenne",
  "Sobre todo de Asia oriental": "Surtout d'Asie orientale",
  "Principalmente de América del Norte": "Principalement d'Amérique du Nord",
  "El país del que salieron millones de emigrantes en el siglo XX cuenta hoy con varios millones de residentes extranjeros, y esos cuatro orígenes son los mayores.":
    "Le pays d'où sont partis des millions d'émigrants au vingtième siècle compte aujourd'hui plusieurs millions de résidents étrangers, et ces quatre origines sont les plus nombreuses.",
  "¿Desde cuándo forma España parte del espacio Schengen?":
    "Depuis quand l'Espagne fait-elle partie de l'espace Schengen ?",
  "Desde su entrada en la CEE en 1986": "Depuis son entrée dans la CEE en 1986",
  "Desde los años noventa": "Depuis les années quatre-vingt-dix",
  "Desde la adopción del euro": "Depuis l'adoption de l'euro",
  "No forma parte de Schengen": "Elle n'en fait pas partie",
  "La adhesión al acuerdo se firmó en 1991 y su aplicación llegó en 1995. Entrar en la Comunidad y entrar en Schengen fueron dos pasos distintos y separados por años.":
    "L'adhésion à l'accord fut signée en 1991 et son application vint en 1995. Entrer dans la Communauté et entrer dans Schengen furent deux pas distincts, séparés par des années.",
  "¿Qué norma desarrolla los derechos laborales básicos en España?":
    "Quel texte déploie les droits du travail fondamentaux en Espagne ?",
  "El Código Civil": "Le code civil",
  "El Estatuto de los Trabajadores": "L'Estatuto de los Trabajadores",
  "La Ley de Bases": "La loi de bases",
  "El Reglamento de Empleo": "Le règlement de l'emploi",
  "El Estatuto de los Trabajadores. Por debajo de él están los convenios colectivos, que pueden mejorar sus mínimos pero nunca empeorarlos.":
    "L'Estatuto de los Trabajadores. Au-dessous de lui viennent les conventions collectives, qui peuvent améliorer ses minimums mais jamais les abaisser.",
  "¿Qué artículo de la Constitución garantiza el derecho de huelga?":
    "Quel article de la Constitution garantit le droit de grève ?",
  "El artículo 28": "L'article 28",
  "El artículo 37": "L'article 37",
  "El artículo 41": "L'article 41",
  "El 28, junto con la libertad sindical. El 35 recoge el derecho y deber de trabajar, el 37 la negociación colectiva y el 41 la Seguridad Social.":
    "Le 28, avec la liberté syndicale. Le 35 porte le droit et le devoir de travailler, le 37 la négociation collective et le 41 la Seguridad Social.",
  "¿Qué significan las siglas SMI?": "Que signifie le sigle SMI ?",
  "Sistema Mínimo de Ingresos": "Système minimum de revenus",
  "Salario mínimo interprofesional": "Salaire minimum interprofessionnel",
  "Seguro Mutuo Industrial": "Assurance mutuelle industrielle",
  "Subsidio por Movilidad Interior": "Allocation de mobilité intérieure",
  "El suelo salarial para la jornada completa, que el Gobierno actualiza cada año por real decreto tras consultar a sindicatos y empresarios.":
    "Le plancher salarial pour le temps plein, que le gouvernement réévalue chaque année par décret royal après avoir consulté syndicats et patronat.",
  "¿Cuál es la jornada máxima legal en España?":
    "Quelle est la durée légale maximale du travail en Espagne ?",
  "Treinta y cinco horas semanales": "Trente-cinq heures par semaine",
  "Cuarenta horas semanales de promedio anual": "Quarante heures par semaine en moyenne annuelle",
  "Cuarenta y ocho horas semanales": "Quarante-huit heures par semaine",
  "La que fije cada empresa": "Celle que fixe chaque entreprise",
  "Cuarenta horas de promedio en cómputo anual, lo que permite semanas más largas y más cortas siempre que la media se respete. Las horas extraordinarias tienen tope legal.":
    "Quarante heures en moyenne sur l'année, ce qui permet des semaines plus longues et plus courtes pourvu que la moyenne soit tenue. Les heures supplémentaires ont un plafond légal.",
  "¿Qué es un contrato fijo discontinuo?": "Qu'est-ce qu'un contrat fixe discontinu ?",
  "Un contrato temporal renovable cada año":
    "Un contrat à durée déterminée renouvelable chaque année",
  "Un contrato indefinido para trabajos estacionales o intermitentes":
    "Un contrat à durée indéterminée pour un travail saisonnier ou intermittent",
  "Un contrato a tiempo parcial": "Un contrat à temps partiel",
  "Un contrato de formación": "Un contrat de formation",
  "Es indefinido, aunque la prestación se concentre en determinadas temporadas: a la persona se la llama cada campaña y conserva su antigüedad.":
    "Il est à durée indéterminée, même si le travail se concentre sur certaines saisons : on rappelle la personne à chaque campagne et elle garde son ancienneté.",
  "¿Pueden sustituirse las vacaciones por una compensación económica?":
    "Les congés peuvent-ils être remplacés par une indemnité ?",
  "Sí, si lo acuerdan empresa y trabajador": "Oui, si l'entreprise et le salarié en conviennent",
  "No: el descanso es obligatorio": "Non : le repos est obligatoire",
  "Sí, hasta la mitad de los días": "Oui, jusqu'à la moitié des jours",
  "Solo en los contratos temporales": "Seulement dans les contrats à durée déterminée",
  "La ley no permite cambiar vacaciones por dinero mientras dura el contrato. Solo se compensan en metálico las no disfrutadas cuando la relación laboral termina.":
    "La loi ne permet pas d'échanger des congés contre de l'argent tant que le contrat dure. Seuls les jours non pris sont payés lorsque la relation de travail s'achève.",
  "¿Qué dos descuentos separan el salario bruto del neto?":
    "Quelles deux retenues séparent le salaire brut du net ?",
  "Las cotizaciones a la Seguridad Social y la retención del IRPF":
    "Les cotisations à la Seguridad Social et la retenue au titre de l'IRPF",
  "El IVA y el IRPF": "La TVA et l'IRPF",
  "La cuota sindical y el seguro médico": "La cotisation syndicale et l'assurance santé",
  "El impuesto de sociedades y la retención": "L'impôt sur les sociétés et la retenue",
  "La cotización financia la sanidad, el paro y las pensiones; la retención es un adelanto del impuesto sobre la renta que se ajusta en la declaración anual.":
    "La cotisation finance la santé, le chômage et les retraites ; la retenue est une avance sur l'impôt sur le revenu, que la déclaration annuelle vient ajuster.",
  "¿Cuántas pagas extraordinarias son habituales y cuándo se cobran?":
    "Combien de primes exceptionnelles sont d'usage et quand les touche-t-on ?",
  "Una, en diciembre": "Une, en décembre",
  "Dos, en junio y en diciembre": "Deux, en juin et en décembre",
  "Tres, repartidas por trimestres": "Trois, réparties par trimestre",
  "Ninguna: van siempre prorrateadas": "Aucune : elles sont toujours étalées",
  "Dos, aunque muchos convenios permiten prorratearlas en las doce mensualidades, con lo que el importe mensual sube y las extras desaparecen del calendario.":
    "Deux, même si bien des conventions permettent de les étaler sur les douze mois, ce qui relève le montant mensuel et fait disparaître les primes du calendrier.",
  "¿Qué organismo gestiona la prestación por desempleo?":
    "Quel organisme gère l'allocation de chômage ?",
  "El SEPE": "Le SEPE",
  "El Ministerio de Trabajo directamente": "Le ministère du Travail directement",
  "El Servicio Público de Empleo Estatal. Cobrar el paro exige haber cotizado un mínimo, y la duración depende de lo cotizado.":
    "Le service public de l'emploi. Toucher le chômage exige d'avoir cotisé un minimum, et la durée dépend de ce qu'on a cotisé.",
  "¿Qué documento resume todo lo que una persona ha cotizado?":
    "Quel document récapitule tout ce qu'une personne a cotisé ?",
  "El finiquito": "Le solde de tout compte",
  "La vida laboral": "Le relevé de carrière",
  "El certificado de empresa": "L'attestation de l'employeur",
  "El informe de vida laboral, que puede pedirse en cualquier momento a la Seguridad Social. La nómina refleja un solo mes.":
    "Le relevé de carrière, que l'on peut demander à tout moment à la Seguridad Social. La fiche de paie, elle, ne montre qu'un seul mois.",
  "¿Qué diferencia hay entre finiquito e indemnización?":
    "Quelle différence y a-t-il entre le solde de tout compte et l'indemnité ?",
  "Son dos nombres de lo mismo": "Ce sont deux noms de la même chose",
  "El finiquito liquida lo pendiente y se cobra siempre; la indemnización solo corresponde en determinados despidos":
    "Le solde de tout compte règle ce qui reste dû et se touche toujours ; l'indemnité n'est due que pour certains licenciements",
  "La indemnización se cobra siempre y el finiquito solo si hay despido":
    "L'indemnité se touche toujours et le solde de tout compte seulement en cas de licenciement",
  "El finiquito lo paga el SEPE y la indemnización la empresa":
    "Le solde de tout compte est payé par le SEPE et l'indemnité par l'entreprise",
  "El finiquito incluye vacaciones no disfrutadas y pagas pendientes al terminar cualquier contrato. La indemnización se suma a él solo cuando el despido da derecho a ella.":
    "Le solde de tout compte comprend les congés non pris et les sommes restant dues à la fin de tout contrat. L'indemnité s'y ajoute seulement quand le licenciement y donne droit.",
  "¿Qué es un convenio colectivo?": "Qu'est-ce qu'une convention collective ?",
  "Un contrato individual con la empresa": "Un contrat individuel avec l'entreprise",
  "Un acuerdo entre representantes de trabajadores y empresarios que fija condiciones para un sector o una empresa":
    "Un accord entre représentants des salariés et du patronat qui fixe les conditions pour une branche ou une entreprise",
  "Una norma dictada por el Gobierno": "Une norme édictée par le gouvernement",
  "Un pacto entre comunidades autónomas": "Un pacte entre communautés autonomes",
  "Puede ser de sector o de empresa, y mejora los mínimos legales: salarios, jornada, permisos. Se aplica a todo el ámbito que cubre, no solo a los afiliados.":
    "Elle peut être de branche ou d'entreprise, et elle améliore les minimums légaux : salaires, temps de travail, congés. Elle s'applique à tout le champ qu'elle couvre, non aux seuls adhérents.",
  "¿Qué número acompaña a un trabajador toda su vida laboral?":
    "Quel numéro accompagne un salarié toute sa vie de travail ?",
  "El número de afiliación a la Seguridad Social": "Le numéro d'affiliation à la Seguridad Social",
  "El número de nómina": "Le numéro de la fiche de paie",
  "El código del convenio": "Le code de la convention",
  "El número de contrato": "Le numéro du contrat",
  "Se obtiene con la primera alta y ya no cambia, aunque se cambie de empresa, de régimen o de comunidad.":
    "On l'obtient à la première inscription et il ne change plus, même si l'on change d'entreprise, de régime ou de communauté.",
  "¿Cómo se financia el Sistema Nacional de Salud?":
    "Comment le système national de santé se finance-t-il ?",
  "Con primas mensuales de los asegurados": "Par des primes mensuelles des assurés",
  "Con impuestos": "Par l'impôt",
  "Con las cuotas de las mutuas": "Par les cotisations des mutuelles",
  "Con los copagos farmacéuticos": "Par la participation aux frais de médicaments",
  "Se financia con impuestos y es universal: no hay primas ni cuotas mensuales. El copago farmacéutico cubre solo una parte del precio de los medicamentos.":
    "Il se finance par l'impôt et il est universel : ni primes ni cotisations mensuelles. La participation aux frais de médicaments ne couvre qu'une part de leur prix.",
  "¿Quién gestiona la sanidad pública en España?": "Qui gère la santé publique en Espagne ?",
  "El Estado": "L'État",
  "Los ayuntamientos": "Les municipalités",
  "Las diputaciones": "Les conseils provinciaux",
  "Las comunidades gestionan y el Estado fija las bases y coordina. De ahí que los tiempos de espera y la organización varíen de una a otra.":
    "Les communautés gèrent, l'État pose les bases et coordonne. D'où des délais d'attente et une organisation qui changent de l'une à l'autre.",
  "¿Cuál es la puerta de entrada habitual al sistema sanitario?":
    "Quelle est la porte d'entrée habituelle du système de santé ?",
  "El hospital": "L'hôpital",
  "El centro de salud y el médico de familia": "Le centre de santé et le médecin de famille",
  "La farmacia": "La pharmacie",
  "Urgencias": "Les urgences",
  "El médico de familia atiende, receta y deriva al especialista. A urgencias se puede acudir directamente, pero no es la vía ordinaria.":
    "Le médecin de famille examine, prescrit et adresse au spécialiste. On peut se rendre directement aux urgences, mais ce n'est pas la voie ordinaire.",
  "¿Qué ocurre con la tarjeta sanitaria al mudarse a otra comunidad autónoma?":
    "Qu'advient-il de la carte de santé quand on déménage dans une autre communauté autonome ?",
  "Nada: es la misma en toda España": "Rien : elle est la même dans toute l'Espagne",
  "Hay que cambiarla y asignarse un nuevo médico":
    "Il faut en changer et se voir attribuer un nouveau médecin",
  "Deja de tener validez durante seis meses": "Elle cesse d'être valable pendant six mois",
  "La emite entonces el Estado": "C'est alors l'État qui la délivre",
  "La emite cada comunidad, así que al cambiar de residencia hay que tramitar una nueva. La atención está garantizada en toda España, pero el trámite es autonómico.":
    "Chaque communauté la délivre, si bien qu'en changeant de résidence il faut en demander une autre. Les soins sont garantis dans toute l'Espagne, mais la démarche relève de la communauté.",
  "¿De qué depende el porcentaje del copago farmacéutico?":
    "De quoi dépend le taux de participation aux frais de médicaments ?",
  "De la edad": "De l'âge",
  "De la renta": "Du revenu",
  "De la comunidad autónoma": "De la communauté autonome",
  "Del tipo de farmacia": "Du type de pharmacie",
  "Se calcula en porcentaje según la renta, y los pensionistas tienen además topes mensuales que limitan lo que pueden llegar a pagar.":
    "Il se calcule en pourcentage selon le revenu, et les retraités ont en outre des plafonds mensuels qui bornent ce qu'ils peuvent avoir à payer.",
  "¿Entre qué edades es obligatoria la enseñanza en España?":
    "Entre quels âges l'instruction est-elle obligatoire en Espagne ?",
  "De 3 a 16 años": "De 3 à 16 ans",
  "De 6 a 16 años": "De 6 à 16 ans",
  "De 6 a 18 años": "De 6 à 18 ans",
  "De 5 a 15 años": "De 5 à 15 ans",
  "De los seis a los dieciséis, es decir, Primaria y ESO. Infantil no es obligatoria y Bachillerato o FP tampoco.":
    "De six à seize ans, c'est-à-dire le primaire et l'ESO. La maternelle n'est pas obligatoire, ni le bachillerato ni la formation professionnelle.",
  "¿Cuántos cursos tiene la Educación Primaria?":
    "Combien d'années compte l'enseignement primaire ?",
  "Seis cursos, de los seis a los doce años. La ESO tiene cuatro, de los doce a los dieciséis.":
    "Six années, de six à douze ans. L'ESO en compte quatre, de douze à seize.",
  "¿Qué significan las siglas ESO?": "Que signifie le sigle ESO ?",
  "Enseñanza Superior Obligatoria": "Enseignement supérieur obligatoire",
  "Educación Secundaria Obligatoria": "Enseignement secondaire obligatoire",
  "Escuela Secundaria Oficial": "École secondaire officielle",
  "Estudios Superiores Ordinarios": "Études supérieures ordinaires",
  "Cuatro cursos entre los doce y los dieciséis años, al término de los cuales se obtiene el título de Graduado en ESO.":
    "Quatre années entre douze et seize ans, au terme desquelles on obtient le diplôme de fin d'ESO.",
  "¿Qué alternativa al Bachillerato existe después de la ESO?":
    "Quelle autre voie que le bachillerato existe après l'ESO ?",
  "La Formación Profesional de grado medio":
    "La formation professionnelle de niveau intermédiaire",
  "El doctorado": "Le doctorat",
  "Ninguna: el Bachillerato es obligatorio": "Aucune : le bachillerato est obligatoire",
  "La FP de grado medio, y desde ella puede pasarse al grado superior y a la universidad. Ni el Bachillerato ni la FP son obligatorios.":
    "La formation professionnelle de niveau intermédiaire, d'où l'on peut passer au niveau supérieur puis à l'université. Ni le bachillerato ni la formation professionnelle ne sont obligatoires.",
  "¿Cuántos años dura un grado universitario en la mayoría de las carreras?":
    "Combien d'années dure une licence dans la plupart des filières ?",
  "Cuatro años en la mayoría, seguidos opcionalmente de máster y doctorado. Algunas carreras como Medicina son más largas.":
    "Quatre ans dans la plupart, suivis au choix d'un master et d'un doctorat. Certaines filières comme la médecine sont plus longues.",
  "¿A partir de qué nota se aprueba en el sistema educativo español?":
    "À partir de quelle note a-t-on la moyenne dans le système éducatif espagnol ?",
  "A partir del cuatro": "À partir de quatre",
  "A partir del cinco": "À partir de cinq",
  "A partir del seis": "À partir de six",
  "A partir del diez": "À partir de dix",
  "La escala va de cero a diez y se aprueba con cinco. En la universidad se usa la misma escala, con la mención de matrícula de honor para las mejores notas.":
    "L'échelle va de zéro à dix et l'on est reçu à cinq. L'université emploie la même échelle, avec la mention d'excellence pour les meilleures notes.",
  "¿Puede un centro concertado cobrar por la enseñanza en las etapas concertadas?":
    "Un établissement sous contrat peut-il faire payer l'enseignement des niveaux couverts par le contrat ?",
  "Sí, libremente": "Oui, librement",
  "No: recibe fondos públicos precisamente a cambio de no hacerlo":
    "Non : il reçoit des fonds publics précisément pour ne pas le faire",
  "Sí, hasta un tope fijado por la comunidad": "Oui, jusqu'à un plafond fixé par la communauté",
  "Solo en Bachillerato": "Seulement au bachillerato",
  "Ese es el trato del concierto: financiación pública a cambio de gratuidad en las etapas cubiertas. Las actividades complementarias sí pueden tener coste.":
    "C'est là le marché du contrat : de l'argent public contre la gratuité des niveaux couverts. Les activités complémentaires, elles, peuvent être payantes.",
  "¿Qué prueba hay que superar para acceder a la universidad?":
    "Quelle épreuve faut-il réussir pour entrer à l'université ?",
  "Una prueba de acceso conocida durante décadas como selectividad":
    "Une épreuve d'entrée connue depuis des décennies sous le nom de selectividad",
  "El título de Graduado en ESO": "Le diplôme de fin d'ESO",
  "Una entrevista en la facultad": "Un entretien à la faculté",
  "Ninguna: basta con el Bachillerato": "Aucune : le bachillerato suffit",
  "Además de superar el Bachillerato hay que aprobar la prueba de acceso, cuyas siglas han cambiado varias veces pero que todo el mundo sigue llamando selectividad.":
    "Outre le bachillerato, il faut réussir l'épreuve d'entrée, dont le sigle a changé plusieurs fois mais que tout le monde appelle encore selectividad.",
  "¿Puede empadronarse una persona sin permiso de residencia?":
    "Une personne sans titre de séjour peut-elle s'inscrire au registre de la commune ?",
  "No, hace falta autorización previa": "Non, il faut une autorisation préalable",
  "Sí: el padrón registra dónde se vive, no la situación administrativa":
    "Oui : le padrón enregistre où l'on vit, non la situation administrative",
  "Solo si tiene contrato de trabajo": "Seulement avec un contrat de travail",
  "Solo en los municipios grandes": "Seulement dans les grandes communes",
  "El padrón es un registro de residencia efectiva. De él dependen la tarjeta sanitaria y la escolarización, y por eso el acceso no se condiciona a la situación administrativa.":
    "Le padrón est un registre de résidence effective. En dépendent la carte de santé et la scolarisation, et c'est pourquoi l'accès n'est pas subordonné à la situation administrative.",
  "¿Qué acredita un certificado de empadronamiento?":
    "Qu'atteste un certificat d'empadronamiento ?",
  "El domicilio y el tiempo que se lleva residiendo en el municipio":
    "L'adresse et la durée de résidence dans la commune",
  "La situación laboral": "La situation professionnelle",
  "El nivel de renta": "Le niveau de revenu",
  "Es la prueba habitual del tiempo de residencia, y por eso lo piden después otros expedientes, incluidos los de arraigo y nacionalidad.":
    "C'est la preuve habituelle de la durée de résidence, et c'est pourquoi d'autres dossiers le demandent ensuite, ceux d'arraigo et de nationalité compris.",
  "¿Qué significan las siglas TIE?": "Que signifie le sigle TIE ?",
  "Tarjeta de identidad de extranjero": "Carte d'identité d'étranger",
  "Trámite de inscripción exterior": "Procédure d'inscription extérieure",
  "Título de ingreso especial": "Titre d'entrée spécial",
  "Tasa de identificación estatal": "Taxe d'identification de l'État",
  "Es el documento físico que acredita la autorización de residencia y lleva impreso el NIE. El NIE por sí solo es un número, no una tarjeta.":
    "C'est le document même qui atteste l'autorisation de séjour et qui porte le NIE imprimé. Le NIE à lui seul est un numéro, non une carte.",
  "¿Qué necesitan los ciudadanos de la Unión Europea para residir en España?":
    "De quoi les citoyens de l'Union européenne ont-ils besoin pour résider en Espagne ?",
  "Una autorización de residencia": "D'une autorisation de séjour",
  "Un certificado de registro en el Registro Central de Extranjeros":
    "D'un certificat d'inscription au registre central des étrangers",
  "Un visado renovable cada año": "D'un visa renouvelable chaque année",
  "Nada en absoluto": "De rien du tout",
  "No necesitan permiso, pero sí inscribirse y obtener un certificado de registro, que es un trámite mucho más ligero que una autorización de residencia.":
    "Ils n'ont pas besoin d'un titre, mais bien de s'inscrire et d'obtenir un certificat, ce qui est une démarche bien plus légère qu'une autorisation de séjour.",
  "¿Qué son las figuras de arraigo?": "Que sont les formes d'arraigo ?",
  "Ayudas económicas para familias numerosas": "Des aides financières aux familles nombreuses",
  "Vías de regularización para quien lleva tiempo en el país y acredita vínculos":
    "Des voies de régularisation pour qui est dans le pays depuis un temps et peut prouver des attaches",
  "Contratos agrícolas de temporada": "Des contrats agricoles saisonniers",
  "Programas de retorno voluntario": "Des programmes de retour volontaire",
  "Hay arraigo social, laboral, familiar y para la formación, cada uno con requisitos propios. Todos parten de la permanencia acreditada en España.":
    "Il y a l'arraigo social, professionnel, familial et pour la formation, chacun avec ses propres conditions. Tous partent d'un séjour en Espagne dûment prouvé.",
  "¿Qué permite la residencia de larga duración?": "Que permet le séjour de longue durée ?",
  "Votar en las elecciones generales": "De voter aux élections législatives",
  "Residir y trabajar de forma indefinida en las mismas condiciones que los españoles":
    "De résider et de travailler sans limite de temps, aux mêmes conditions que les Espagnols",
  "Obtener automáticamente la nacionalidad": "D'obtenir automatiquement la nationalité",
  "Viajar sin pasaporte por toda Europa": "De voyager sans passeport dans toute l'Europe",
  "Salvo en lo que la ley reserva a la nacionalidad, como el voto en las generales. Es un paso anterior y distinto al de hacerse español.":
    "Sauf pour ce que la loi réserve à la nationalité, comme le vote aux législatives. C'est une étape antérieure et distincte de celle qui fait devenir espagnol.",
  "¿Qué se necesita para hacer trámites con la Administración por internet?":
    "De quoi a-t-on besoin pour faire ses démarches administratives par internet ?",
  "Solo el NIE": "Du seul NIE",
  "Una identidad digital: Cl@ve o un certificado digital":
    "D'une identité numérique : Cl@ve ou un certificat électronique",
  "Una cuenta bancaria española": "D'un compte bancaire espagnol",
  "Un correo electrónico verificado": "D'une adresse électronique vérifiée",
  "Sin Cl@ve o certificado no se pide cita, no se descarga la vida laboral ni se presenta la declaración. Es hoy el requisito práctico para casi todo.":
    "Sans Cl@ve ni certificat, on ne prend pas rendez-vous, on ne télécharge pas son relevé de carrière et on ne dépose pas sa déclaration. C'est aujourd'hui la condition pratique de presque tout.",
  "¿Ante qué organismo se presenta la declaración de la renta?":
    "Auprès de quel organisme dépose-t-on la déclaration de revenus ?",
  "Ante la Seguridad Social": "Auprès de la Seguridad Social",
  "Ante la Agencia Tributaria": "Auprès de l'administration fiscale",
  "Ante el ayuntamiento": "Auprès de la municipalité",
  "Ante el Ministerio de Justicia": "Auprès du ministère de la Justice",
  "Ante la Agencia Tributaria, normalmente entre abril y junio. Regulariza lo que ya se retuvo en la nómina, y puede salir a pagar o a devolver.":
    "Auprès de l'administration fiscale, d'ordinaire entre avril et juin. Elle régularise ce qui a déjà été retenu sur la fiche de paie, et peut se solder par un versement ou un remboursement.",
  "¿Ante qué ministerio se tramita el expediente de nacionalidad?":
    "Auprès de quel ministère le dossier de nationalité est-il instruit ?",
  "Interior": "L'Intérieur",
  "Justicia": "La Justice",
  "Inclusión y Seguridad Social": "L'Inclusion et la Seguridad Social",
  "Asuntos Exteriores": "Les Affaires étrangères",
  "El Ministerio de Justicia resuelve el expediente. Interior se ocupa de extranjería y las pruebas las administra el Instituto Cervantes: tres organismos distintos en un mismo camino.":
    "Le ministère de la Justice tranche le dossier. L'Intérieur s'occupe du séjour des étrangers et l'Instituto Cervantes fait passer les épreuves : trois organismes différents sur un même chemin.",
  "¿Qué dos pruebas del Instituto Cervantes se exigen para la nacionalidad?":
    "Quelles deux épreuves de l'Instituto Cervantes exige-t-on pour la nationalité ?",
  "El DELE A2 y la CCSE": "Le DELE A2 et la CCSE",
  "El DELE B1 y una entrevista": "Le DELE B1 et un entretien",
  "La CCSE y un examen de historia": "La CCSE et un examen d'histoire",
  "Un examen médico y uno de lengua": "Une visite médicale et une épreuve de langue",
  "La de lengua a nivel A2, de la que están exentos los nacionales de países hispanohablantes, y la de conocimientos constitucionales y socioculturales.":
    "Celle de langue au niveau A2, dont les ressortissants des pays hispanophones sont dispensés, et celle de connaissance de la constitution et de la vie sociale.",
  "¿Con qué acto se cierra la concesión de la nacionalidad?":
    "Par quel acte l'octroi de la nationalité se clôt-il ?",
  "Con la entrega del DNI": "Par la remise du DNI",
  "Con la jura o promesa de fidelidad al Rey y obediencia a la Constitución, y la inscripción en el Registro Civil":
    "Par le serment ou la promesse de fidélité au roi et d'obéissance à la Constitution, et l'inscription à l'état civil",
  "Con una ceremonia en el ayuntamiento": "Par une cérémonie à la mairie",
  "Con el pago de una tasa": "Par le paiement d'une taxe",
  "El acto formal y la inscripción registral cierran el expediente. El DNI llega después, como consecuencia de ya ser español.":
    "L'acte solennel et l'inscription au registre closent le dossier. Le DNI vient après, comme conséquence du fait qu'on est déjà espagnol.",
  "¿Qué documento necesita un extranjero además del NIE para ser dado de alta en un empleo?":
    "De quel document un étranger a-t-il besoin, outre le NIE, pour être déclaré à l'embauche ?",
  "El certificado de empadronamiento": "Du certificat d'empadronamiento",
  "El carné de conducir": "Du permis de conduire",
  "El pasaporte en vigor únicamente": "Du seul passeport en cours de validité",
  "El número de la Seguridad Social es distinto del NIE y no lo sustituye: hace falta para el alta laboral y acompaña a la persona toda su vida.":
    "Le numéro de Seguridad Social n'est pas le NIE et ne le remplace pas : il faut l'avoir pour être déclaré et il accompagne la personne toute sa vie.",
  "¿Qué derecho da el empadronamiento a los ciudadanos de la Unión Europea?":
    "Quel droit l'empadronamiento donne-t-il aux citoyens de l'Union européenne ?",
  "Votar en las elecciones municipales": "Voter aux élections municipales",
  "Acceder a la función pública": "Entrer dans la fonction publique",
  "Obtener la nacionalidad en dos años": "Obtenir la nationalité en deux ans",
  "El voto municipal, tras la reforma constitucional de 1992 que lo permitió. Las generales siguen reservadas a quien tiene la nacionalidad española.":
    "Le vote aux municipales, après la révision constitutionnelle de 1992 qui l'a permis. Les législatives restent réservées à qui a la nationalité espagnole.",
  "¿A qué hora se come habitualmente en España?":
    "À quelle heure déjeune-t-on habituellement en Espagne ?",
  "Entre las doce y la una": "Entre midi et une heure",
  "Entre las dos y las tres": "Entre deux et trois heures",
  "A las cuatro": "À quatre heures",
  "Antes de las doce": "Avant midi",
  "La comida del mediodía es la principal del día y se hace entre las dos y las tres, más tarde que en casi toda Europa. La cena llega a partir de las nueve.":
    "Le repas de la mi-journée est le principal et se prend entre deux et trois heures, plus tard que dans presque toute l'Europe. Le dîner vient à partir de neuf heures.",
  "¿Qué explica en parte los horarios tardíos españoles?":
    "Qu'est-ce qui explique en partie les horaires tardifs des Espagnols ?",
  "El clima mediterráneo": "Le climat méditerranéen",
  "Que España usa la hora de Europa central pese a estar a la longitud de Londres":
    "Que l'Espagne vit à l'heure d'Europe centrale alors qu'elle se trouve à la longitude de Londres",
  "La duración de la jornada escolar": "La durée de la journée d'école",
  "Una ley de horarios comerciales": "Une loi sur les horaires du commerce",
  "El sol se pone más tarde de lo que marca el reloj, y las comidas se desplazan con él. La otra parte de la explicación es simple costumbre heredada.":
    "Le soleil se couche plus tard que ne le dit l'horloge, et les repas se décalent avec lui. L'autre moitié de l'explication est une simple habitude héritée.",
  "¿Cómo se llama el segundo desayuno de media mañana?":
    "Comment s'appelle le second petit-déjeuner du milieu de la matinée ?",
  "La merienda": "La merienda",
  "El almuerzo": "L'almuerzo",
  "La sobremesa": "La sobremesa",
  "El aperitivo": "L'aperitivo",
  "En España almuerzo designa a menudo ese tentempié de media mañana. La merienda es de media tarde y la sobremesa el rato de charla tras la comida.":
    "En Espagne, almuerzo désigne souvent cet en-cas du milieu de la matinée. La merienda est du milieu de l'après-midi, et la sobremesa le temps de conversation qui suit le repas.",
  "¿Qué es la jornada partida?": "Qu'est-ce que la jornada partida ?",
  "Trabajar solo por la mañana": "Ne travailler que le matin",
  "Cerrar a mediodía y reabrir por la tarde": "Fermer à midi et rouvrir l'après-midi",
  "Repartir la semana en cuatro días": "Répartir la semaine sur quatre jours",
  "Turnarse con otro empleado": "Alterner avec un autre employé",
  "Es más común cuanto más pequeño es el municipio. En las grandes ciudades muchos comercios ya no cierran a mediodía.":
    "Elle est d'autant plus courante que la commune est petite. Dans les grandes villes, bien des commerces ne ferment plus à midi.",
  "¿Qué papel tiene realmente la siesta en España?":
    "Quelle place la sieste occupe-t-elle vraiment en Espagne ?",
  "Es una práctica diaria generalizada": "C'est une pratique quotidienne et générale",
  "Es sobre todo una costumbre de fin de semana y de verano":
    "C'est surtout une habitude de week-end et d'été",
  "Está regulada por convenio en todos los sectores":
    "Elle est prévue par convention dans toutes les branches",
  "Desapareció por completo en los años ochenta":
    "Elle a entièrement disparu dans les années quatre-vingt",
  "La imagen internacional exagera su alcance: con jornadas y desplazamientos actuales, dormir a diario después de comer es minoritario entre semana.":
    "L'image qu'on s'en fait au dehors en exagère la portée : avec les horaires et les trajets d'aujourd'hui, dormir chaque jour après le repas reste minoritaire en semaine.",
  "¿Qué es el tapeo?": "Qu'est-ce que le tapeo ?",
  "Comer de pie en un restaurante": "Manger debout au restaurant",
  "Ir de bar en bar tomando algo pequeño con la bebida":
    "Aller de bar en bar en prenant une petite chose avec sa boisson",
  "Un menú infantil": "Un menu enfant",
  "Un tipo de cocina regional": "Un type de cuisine régionale",
  "En unas ciudades la tapa va incluida con la consumición y en otras se paga aparte. Es tanto una forma de comer como una forma de moverse por la calle.":
    "Dans certaines villes la tapa vient avec la consommation, dans d'autres elle se paie à part. C'est autant une façon de manger qu'une façon de circuler dans la rue.",
  "¿Qué es la sobremesa?": "Qu'est-ce que la sobremesa ?",
  "El postre": "Le dessert",
  "El rato de conversación que sigue a la comida, con la mesa ya recogida":
    "Le temps de conversation qui suit le repas, la table déjà desservie",
  "El mantel que se pone sobre la mesa": "La nappe que l'on met sur la table",
  "La cuenta que se pide al final": "L'addition que l'on demande à la fin",
  "Puede durar más que la propia comida, sobre todo en fin de semana, y es una de las costumbres que más llama la atención a quien llega de fuera.":
    "Elle peut durer plus longtemps que le repas lui-même, surtout le week-end, et c'est l'une des habitudes qui frappent le plus qui arrive de l'étranger.",
  "¿En qué contextos se usa el usted en España?":
    "Dans quels cas emploie-t-on le usted en Espagne ?",
  "Con casi todo el mundo, salvo la familia": "Avec presque tout le monde, sauf la famille",
  "Con personas mayores y en contextos muy formales":
    "Avec les personnes âgées et dans les situations très officielles",
  "Nunca: ha desaparecido del uso": "Jamais : il a disparu de l'usage",
  "Solo por escrito": "Seulement par écrit",
  "El tuteo está mucho más extendido en España que en el resto del mundo hispanohablante: se tutea a compañeros, camareros y desconocidos de edad parecida.":
    "Le tutoiement est bien plus répandu en Espagne que dans le reste du monde hispanophone : on tutoie collègues, serveurs et inconnus du même âge.",
  "¿Qué tipo de vivienda predomina en las ciudades españolas?":
    "Quel type de logement domine dans les villes espagnoles ?",
  "La casa unifamiliar": "La maison individuelle",
  "El piso en edificio": "L'appartement en immeuble",
  "La vivienda rural rehabilitada": "La maison de campagne restaurée",
  "El adosado": "La maison mitoyenne",
  "El piso es la forma dominante, y la propiedad está muy extendida: la proporción de hogares en vivienda propia es de las más altas de Europa, aunque el alquiler crece entre los jóvenes.":
    "L'appartement domine, et la propriété est très répandue : la part des ménages dans leur propre logement est l'une des plus hautes d'Europe, même si la location gagne chez les jeunes.",
  "¿Cómo se conoce a la selección española de fútbol?":
    "Sous quel nom connaît-on la sélection espagnole de football ?",
  "La Azzurra": "La Azzurra",
  "La Roja": "La Roja",
  "Los Azules": "Los Azules",
  "La Albiceleste": "La Albiceleste",
  "La Roja, por el color de la camiseta. La Azzurra es Italia y la Albiceleste Argentina.":
    "La Roja, du rouge de son maillot. La Azzurra, c'est l'Italie, et la Albiceleste l'Argentine.",
  "¿Cómo se llama la gran vuelta ciclista española?":
    "Comment s'appelle le grand tour cycliste espagnol ?",
  "El Giro": "Le Giro",
  "La Vuelta a España": "La Vuelta a España",
  "El Tour": "Le Tour",
  "La Ronda Ibérica": "La Ronda Ibérica",
  "La Vuelta a España, que se corre cada septiembre. El Giro es italiano y se corre en mayo, y el Tour francés en julio.":
    "La Vuelta a España, qui se court chaque septembre. Le Giro est italien et se court en mai, et le Tour français en juillet.",
  "¿Cómo se llama el partido entre los dos grandes clubes de fútbol españoles?":
    "Comment appelle-t-on le match entre les deux grands clubs de football espagnols ?",
  "El derbi": "Le derby",
  "El clásico": "Le clásico",
  "La final": "La finale",
  "El duelo": "Le duel",
  "El clásico. Derbi se reserva para los partidos entre equipos de la misma ciudad, como los dos de Madrid o los dos de Sevilla.":
    "Le clásico. Derby se réserve aux matchs entre équipes d'une même ville, comme les deux de Madrid ou les deux de Séville.",
  "¿Por qué razón principal se independizan tarde los jóvenes españoles?":
    "Pour quelle raison principale les jeunes Espagnols quittent-ils tard le foyer familial ?",
  "Por tradición familiar": "Par tradition familiale",
  "Por razones económicas: precios de la vivienda y empleo inestable":
    "Pour des raisons d'argent : le prix du logement et un emploi instable",
  "Porque la ley lo dificulta": "Parce que la loi le rend difficile",
  "Porque estudian más años que en otros países":
    "Parce qu'ils étudient plus d'années qu'ailleurs",
  "La edad media de emancipación es de las más altas de Europa, y las encuestas apuntan sobre todo al coste de la vivienda y a la inestabilidad del primer empleo.":
    "L'âge moyen du départ est parmi les plus élevés d'Europe, et les enquêtes désignent surtout le coût du logement et l'instabilité du premier emploi.",
};
