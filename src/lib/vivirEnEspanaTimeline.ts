import type { CountryTimelineEvent } from "@/lib/countryStudies";

/**
 * La línea del tiempo del curso «Vivir en España».
 *
 * Construida sobre el modelo británico, alemán, francés, polaco e italiano,
 * con la misma regla que rige allí: un periodo pertenece a su ÚLTIMO año, no
 * al primero. La dictadura se sitúa en 1975 y no en 1939 — de otro modo la
 * línea se leería como si una época terminara antes de empezar.
 *
 * Seis épocas, porque la historia de España se quiebra justo en estos puntos:
 * la herencia romana y visigoda, los ocho siglos en que al-Ándalus y los
 * reinos cristianos comparten la Península, la monarquía hispánica, el siglo
 * de las constituciones y las independencias americanas, el ciclo que va de
 * la República a la dictadura, y la democracia. Los nombres son los que usa
 * España para dividir su propia historia.
 */

type EsEra =
  | "hispania"
  | "al-andalus"
  | "monarquia-hispanica"
  | "siglo-xix"
  | "republica-dictadura"
  | "democracia";

export const ES_ERA_LABELS: Record<EsEra, string> = {
  hispania: "Hispania romana y visigoda",
  "al-andalus": "Al-Ándalus y los reinos cristianos",
  "monarquia-hispanica": "La monarquía hispánica",
  "siglo-xix": "El siglo XIX y las constituciones",
  "republica-dictadura": "República, guerra y dictadura",
  democracia: "La democracia",
};

export const ES_ERA_ORDER: EsEra[] = [
  "hispania",
  "al-andalus",
  "monarquia-hispanica",
  "siglo-xix",
  "republica-dictadura",
  "democracia",
];

const event = (
  id: string,
  year: number,
  displayYear: string,
  era: EsEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "Historia"
): CountryTimelineEvent => ({ id, year, displayYear, era, title, summary, detail, tags, category });
export const ES_TIMELINE: CountryTimelineEvent[] = [
  event(
    "cadiz", -1100, "hacia 1100 a. C.", "hispania",
    "Fundación de Cádiz",
    "Los fenicios establecen la que se considera la ciudad más antigua de Europa occidental.",
    "Cádiz nace como factoría comercial fenicia en el extremo atlántico del Mediterráneo conocido. Antes de Roma, la Península ya era destino de fenicios, griegos y cartagineses, que venían por metales y dejaron ciudades en la costa.",
    ["Cádiz", "fenicios", "Tartessos"],
  ),
  event(
    "ampurias", -218, "218 a. C.", "hispania",
    "Los romanos desembarcan en Ampurias",
    "Empieza una conquista que tardará dos siglos en completarse.",
    "El desembarco se produce durante la segunda guerra púnica, para cortar a Cartago su base peninsular. La resistencia del norte no cederá hasta las guerras cántabras, dos siglos después: Hispania no se conquistó de una vez ni con facilidad.",
    ["218 a. C.", "Ampurias", "Roma", "guerras púnicas"],
  ),
  event(
    "cantabras", -19, "19 a. C.", "hispania",
    "Fin de las guerras cántabras",
    "Con la sumisión del norte, toda la Península queda bajo dominio romano.",
    "Augusto en persona dirigió parte de la campaña. A partir de aquí Hispania se romaniza a fondo: el latín, el derecho, las calzadas y las ciudades. De ese latín saldrán el castellano, el gallego y el catalán.",
    ["19 a. C.", "Augusto", "cántabros", "Hispania"],
  ),
  event(
    "trajano", 98, "98", "hispania",
    "Trajano, emperador",
    "Por primera vez el imperio tiene un emperador nacido fuera de Italia.",
    "Trajano nació en Itálica, junto a la actual Sevilla, y bajo su gobierno el imperio alcanzó su máxima extensión. Le sucedería Adriano, también hispano. Hispania dio además a Séneca y, más tarde, a Teodosio.",
    ["Trajano", "Itálica", "Adriano", "Séneca"],
    "Sociedad",
  ),
  event(
    "invasiones", 409, "409", "hispania",
    "Entran suevos, vándalos y alanos",
    "El orden romano se deshace y la Península se reparte entre pueblos germánicos.",
    "Tras ellos llegarán los visigodos, que acabarán imponiéndose y formando un reino con capital en Toledo. La ruptura no fue instantánea: durante décadas convivieron estructuras romanas y poderes nuevos.",
    ["409", "suevos", "vándalos", "visigodos"],
  ),
  event(
    "recaredo", 589, "589", "hispania",
    "Recaredo se convierte al catolicismo",
    "En el III Concilio de Toledo el rey visigodo abandona el arrianismo.",
    "La conversión unifica religiosamente el reino y ata la monarquía a la Iglesia, un vínculo que durará siglos. Toledo se convierte en el centro político y religioso de la Península.",
    ["589", "Recaredo", "Toledo", "visigodos"],
    "Sociedad",
  ),
  event(
    "liber", 654, "654", "hispania",
    "El Liber Iudiciorum",
    "Un solo código para godos e hispanorromanos.",
    "El rey Recesvinto promulga un cuerpo legal común que sustituye la doble legalidad anterior. Traducido siglos después como Fuero Juzgo, seguirá aplicándose en la Edad Media: es el puente jurídico entre Roma y los reinos cristianos.",
    ["654", "Recesvinto", "Fuero Juzgo", "derecho"],
    "Ordenamiento",
  ),
  event(
    "guadalete", 711, "711", "al-andalus",
    "La batalla de Guadalete",
    "Un ejército musulmán cruza el Estrecho y derrota al último rey visigodo.",
    "En pocos años el dominio se extiende sobre casi toda la Península, que pasa a llamarse al-Ándalus. El reino visigodo desaparece en una sola campaña, y empiezan casi ocho siglos de frontera interior.",
    ["711", "Guadalete", "Rodrigo", "al-Ándalus"],
  ),
  event(
    "covadonga", 722, "hacia 722", "al-andalus",
    "Covadonga",
    "La tradición sitúa aquí el origen del reino de Asturias.",
    "Fue una escaramuza en un valle de montaña, magnificada después por las crónicas. Su importancia es real de todos modos: en la franja cantábrica se forma el núcleo del que saldrán León y Castilla.",
    ["722", "Covadonga", "Pelayo", "Asturias"],
  ),
  event(
    "califato", 929, "929", "al-andalus",
    "Abderramán III proclama el Califato de Córdoba",
    "Córdoba llega a ser la ciudad más poblada de Europa occidental.",
    "El emirato se independiza también en lo religioso al proclamarse califato. Es el momento de mayor esplendor de al-Ándalus: bibliotecas, baños, la ampliación de la Mezquita y la ciudad palatina de Medina Azahara.",
    ["929", "Abderramán III", "Córdoba", "califato"],
    "Sociedad",
  ),
  event(
    "taifas", 1031, "1031", "al-andalus",
    "El califato se rompe en reinos de taifas",
    "Al-Ándalus se fragmenta en más de veinte estados rivales.",
    "La división debilita al conjunto frente a los reinos del norte y obliga a las taifas a pagar tributos y a llamar en su auxilio a los imperios norteafricanos, almorávides primero y almohades después.",
    ["1031", "taifas", "almorávides", "almohades"],
  ),
  event(
    "toledo-1085", 1085, "1085", "al-andalus",
    "Alfonso VI toma Toledo",
    "La antigua capital visigoda vuelve a manos cristianas.",
    "Toledo se convierte en el gran punto de contacto entre las dos culturas. En su Escuela de Traductores, cristianos, musulmanes y judíos verterán al latín obras griegas y árabes que Europa había perdido.",
    ["1085", "Alfonso VI", "Toledo", "traductores"],
  ),
  event(
    "corona-aragon", 1137, "1137", "al-andalus",
    "Nace la Corona de Aragón",
    "El reino de Aragón y los condados catalanes se unen por matrimonio.",
    "Petronila de Aragón y Ramón Berenguer IV de Barcelona unen sus territorios manteniendo cada uno sus instituciones. La Corona de Aragón se orientará al Mediterráneo, hasta Sicilia, Cerdeña y Nápoles.",
    ["1137", "Aragón", "Cataluña", "Mediterráneo"],
    "Ordenamiento",
  ),
  event(
    "navas", 1212, "1212", "al-andalus",
    "Las Navas de Tolosa",
    "La derrota almohade abre el valle del Guadalquivir.",
    "Los reyes de Castilla, Aragón y Navarra combaten juntos, algo poco frecuente. Tras la victoria el avance se acelera: Córdoba caerá en 1236 y Sevilla en 1248.",
    ["1212", "Las Navas de Tolosa", "almohades"],
  ),
  event(
    "sevilla-1248", 1248, "1248", "al-andalus",
    "Fernando III toma Sevilla",
    "Solo queda en pie el reino nazarí de Granada.",
    "Con Sevilla, al-Ándalus se reduce a Granada, que sobrevivirá dos siglos y medio más como reino vasallo y construirá la Alhambra. La frontera se queda quieta durante generaciones.",
    ["1248", "Fernando III", "Sevilla", "Granada"],
  ),
  event(
    "reyes-catolicos", 1469, "1469", "monarquia-hispanica",
    "Matrimonio de Isabel y Fernando",
    "Castilla y Aragón comparten corona sin dejar de ser reinos distintos.",
    "Es una unión dinástica, no de estados: cada reino conserva sus leyes, sus cortes, su moneda y sus aduanas. La unificación jurídica no llegará hasta los Decretos de Nueva Planta, dos siglos y medio después.",
    ["1469", "Isabel", "Fernando", "unión dinástica"],
    "Ordenamiento",
  ),
  event(
    "1492", 1492, "1492", "monarquia-hispanica",
    "Granada, la expulsión de los judíos y América",
    "Tres hechos en un solo año cambian el rumbo del país.",
    "El 2 de enero cae Granada, último reino nazarí. En marzo se decreta la expulsión de los judíos, cuya lengua conservarían los sefardíes durante siglos. El 12 de octubre Colón llega al Caribe. Ese mismo año se publica la primera gramática castellana.",
    ["1492", "Granada", "Colón", "sefardíes", "Nebrija"],
  ),
  event(
    "navarra", 1512, "1512", "monarquia-hispanica",
    "Incorporación de Navarra",
    "La Península queda bajo una sola corona, salvo Portugal.",
    "Navarra se integra conservando sus fueros e instituciones propias, que en buena medida han llegado hasta hoy: es la raíz del régimen foral que la comunidad mantiene todavía.",
    ["1512", "Navarra", "fueros"],
    "Ordenamiento",
  ),
  event(
    "carlos-i", 1516, "1516", "monarquia-hispanica",
    "Carlos I hereda un conjunto sin precedentes",
    "Castilla, Aragón, Italia, Flandes, Austria y América en unas mismas manos.",
    "Como Carlos V será además emperador del Sacro Imperio. La herencia trae poder y guerras sin fin: el reinado se sostiene sobre la plata americana y termina con las cuentas quebradas.",
    ["1516", "Carlos I", "Carlos V", "imperio"],
  ),
  event(
    "madrid-capital", 1561, "1561", "monarquia-hispanica",
    "Felipe II fija la capital en Madrid",
    "Una villa pequeña y central se convierte en sede permanente de la corte.",
    "Hasta entonces la corte era itinerante. Se eligió Madrid por su posición en el centro de la Península más que por su tamaño, y de esa decisión administrativa nace la capital de hoy.",
    ["1561", "Felipe II", "Madrid", "corte"],
    "Ordenamiento",
  ),
  event(
    "quijote", 1605, "1605", "monarquia-hispanica",
    "Se publica el Quijote",
    "Cervantes da a la literatura europea su primera novela moderna.",
    "La segunda parte llegará en 1615. El Siglo de Oro reúne en pocas décadas a Lope, Calderón, Quevedo y Góngora, y en pintura a El Greco, Velázquez y Murillo: la cultura alcanza su cumbre mientras el poder político se desgasta.",
    ["1605", "Cervantes", "Siglo de Oro"],
    "Cultura",
  ),
  event(
    "1640", 1640, "1640", "monarquia-hispanica",
    "Se sublevan Portugal y Cataluña",
    "El esfuerzo de guerra quiebra la monarquía por dentro.",
    "Las exigencias fiscales y militares del conde-duque de Olivares provocan dos levantamientos simultáneos. Portugal recupera su independencia definitivamente; Cataluña vuelve a la corona tras doce años de guerra.",
    ["1640", "Olivares", "Portugal", "Cataluña"],
  ),
  event(
    "utrecht", 1713, "1713", "monarquia-hispanica",
    "El Tratado de Utrecht",
    "Termina la Guerra de Sucesión: llegan los Borbones y se pierde Gibraltar.",
    "España pierde sus territorios europeos y Gibraltar, que sigue siendo británico. Felipe V impone después los Decretos de Nueva Planta, que suprimen las instituciones propias de la Corona de Aragón: la unión dinástica se vuelve Estado unificado.",
    ["1713", "Utrecht", "Felipe V", "Gibraltar", "Nueva Planta"],
    "Ordenamiento",
  ),
  event(
    "dos-de-mayo", 1808, "2 de mayo de 1808", "siglo-xix",
    "El levantamiento de Madrid",
    "Empieza la Guerra de la Independencia contra la ocupación napoleónica.",
    "Napoleón había colocado en el trono a su hermano José I. El levantamiento de Madrid se extiende a todo el país y da comienzo a seis años de guerra irregular: de aquellas partidas viene la palabra guerrilla, que el español prestó al mundo.",
    ["1808", "2 de mayo", "Napoleón", "guerrilla"],
  ),
  event(
    "pepa", 1812, "19 de marzo de 1812", "siglo-xix",
    "La Constitución de Cádiz",
    "La primera constitución española proclama la soberanía nacional.",
    "Se aprueba en una ciudad sitiada, mientras el resto del país está ocupado. Como el 19 de marzo es San José, se la conoce como La Pepa. Fernando VII la deroga en 1814: el vaivén entre texto liberal y vuelta atrás marcará todo el siglo.",
    ["1812", "Cádiz", "La Pepa", "soberanía nacional"],
    "Ordenamiento",
  ),
  event(
    "ayacucho", 1824, "1824", "siglo-xix",
    "Ayacucho y el fin del imperio americano",
    "La América continental completa su independencia.",
    "El vacío de poder de 1808 fue el detonante que las colonias esperaban, y entre 1810 y 1824 se independizan una tras otra. A España solo le quedan Cuba, Puerto Rico y Filipinas.",
    ["1824", "Ayacucho", "independencia", "América"],
  ),
  event(
    "carlistas", 1833, "1833", "siglo-xix",
    "Empieza la primera guerra carlista",
    "Tres guerras civiles enfrentarán dos ideas de país.",
    "A la muerte de Fernando VII se disputan el trono su hija Isabel y su hermano Carlos, pero detrás está algo mayor: liberalismo frente a absolutismo, centro frente a fueros. Las guerras se prolongarán, con intervalos, hasta 1876.",
    ["1833", "carlistas", "Isabel II", "fueros"],
  ),
  event(
    "psoe", 1879, "1879", "siglo-xix",
    "Se funda el PSOE",
    "La industrialización trae consigo el movimiento obrero organizado.",
    "El textil catalán y la siderurgia vasca crean las primeras grandes concentraciones obreras del país. De ahí salen los partidos y los sindicatos que llegarán al siglo XX, entre ellos la UGT, fundada nueve años después.",
    ["1879", "PSOE", "movimiento obrero", "UGT"],
    "Sociedad",
  ),
  event(
    "primera-republica", 1874, "1873–1874", "siglo-xix",
    "La Primera República",
    "Once meses y cuatro presidentes.",
    "Llega tras la abdicación de Amadeo de Saboya, el rey importado del Sexenio Democrático. Se plantea un Estado federal que no llega a aprobarse, y un golpe militar la termina a comienzos de 1874.",
    ["1873", "Primera República", "Amadeo de Saboya", "federalismo"],
    "Ordenamiento",
  ),
  event(
    "restauracion", 1875, "1875", "siglo-xix",
    "La Restauración",
    "Cánovas diseña un turno pactado entre dos partidos.",
    "Alfonso XII vuelve al trono y el sistema se estabiliza a costa de vaciar las elecciones: los dos partidos se alternan por acuerdo, sostenidos en el campo por el caciquismo. Durará hasta la dictadura de Primo de Rivera.",
    ["1875", "Cánovas", "turno", "caciquismo"],
    "Ordenamiento",
  ),
  event(
    "desastre", 1898, "1898", "siglo-xix",
    "El Desastre del 98",
    "España pierde Cuba, Puerto Rico y Filipinas.",
    "Tras una guerra breve con Estados Unidos desaparecen las últimas posesiones de ultramar. El golpe es más moral que militar: el país descubre que ya no es una potencia, y de esa conmoción sale la Generación del 98.",
    ["1898", "Cuba", "Filipinas", "Generación del 98"],
  ),
  event(
    "primo-rivera", 1923, "1923", "republica-dictadura",
    "La dictadura de Primo de Rivera",
    "Un golpe militar suspende el sistema de la Restauración.",
    "El general Primo de Rivera gobierna con el consentimiento de Alfonso XIII hasta 1930. Su caída arrastra al rey: las municipales del año siguiente se leerán como un plebiscito sobre la monarquía.",
    ["1923", "Primo de Rivera", "Alfonso XIII"],
    "Ordenamiento",
  ),
  event(
    "republica-1931", 1931, "14 de abril de 1931", "republica-dictadura",
    "Se proclama la Segunda República",
    "Alfonso XIII sale de España tras unas elecciones municipales.",
    "Las ciudades votan republicano el 12 de abril y el 14 se proclama la República. Su Constitución será de las más avanzadas del momento: Estado laico, divorcio, voto femenino y estatutos de autonomía.",
    ["1931", "Segunda República", "14 de abril"],
    "Ordenamiento",
  ),
  event(
    "voto-femenino", 1933, "1933", "republica-dictadura",
    "Las mujeres votan por primera vez",
    "El derecho lo defendió Clara Campoamor contra buena parte de su propio grupo.",
    "El debate de 1931 enfrentó a dos diputadas: Campoamor lo defendió y Victoria Kent se opuso, por temor a que el voto femenino favoreciera a la derecha. Se aprobó, y las mujeres votaron en las elecciones de 1933.",
    ["1933", "Clara Campoamor", "sufragio femenino"],
    "Sociedad",
  ),
  event(
    "guerra-civil", 1936, "18 de julio de 1936", "republica-dictadura",
    "Comienza la Guerra Civil",
    "El golpe triunfa en unas zonas y fracasa en otras, y esa mitad abre una guerra.",
    "Una parte del ejército se subleva contra el Gobierno de la República. El fracaso parcial del golpe es lo que convierte una sublevación en tres años de guerra, con Alemania e Italia apoyando a un bando y la Unión Soviética al otro.",
    ["1936", "18 de julio", "guerra civil", "sublevación"],
  ),
  event(
    "guernica", 1937, "26 de abril de 1937", "republica-dictadura",
    "El bombardeo de Guernica",
    "La aviación alemana destruye una villa vasca en día de mercado.",
    "Picasso pintó ese mismo año el cuadro que lleva su nombre, hoy en el Museo Reina Sofía de Madrid. Guernica fue además un ensayo de los bombardeos sobre población civil que marcarían la guerra europea.",
    ["1937", "Guernica", "Picasso", "Cóndor"],
    "Cultura",
  ),
  event(
    "fin-guerra", 1939, "1 de abril de 1939", "republica-dictadura",
    "Termina la Guerra Civil",
    "Cientos de miles de muertos y medio millón de personas en el exilio.",
    "El exilio se lleva a buena parte de los científicos, escritores y maestros del país. Cinco meses después comienza la Segunda Guerra Mundial, en la que España no participa formalmente.",
    ["1939", "exilio", "posguerra"],
  ),
  event(
    "onu-1955", 1955, "1955", "republica-dictadura",
    "España ingresa en la ONU",
    "Termina el aislamiento internacional de la posguerra.",
    "Los acuerdos con Estados Unidos y el concordato con la Santa Sede, ambos de 1953, habían abierto la puerta. En los sesenta llegarán el turismo, la industria y las divisas de dos millones de emigrantes en Europa.",
    ["1955", "ONU", "aislamiento", "desarrollismo"],
    "España en el mundo",
  ),
  event(
    "muerte-franco", 1975, "20 de noviembre de 1975", "republica-dictadura",
    "Muere Franco",
    "Treinta y seis años de dictadura terminan sin que nadie sepa qué viene después.",
    "Dos días más tarde Juan Carlos I es proclamado rey dentro de las reglas del propio régimen. Lo que ocurrirá a continuación no estaba escrito en ninguna parte, y podía haber terminado de muchas maneras.",
    ["1975", "Franco", "Juan Carlos I"],
  ),
  event(
    "elecciones-1977", 1977, "15 de junio de 1977", "democracia",
    "Primeras elecciones libres desde 1936",
    "Cuarenta y un años después, España vuelve a votar.",
    "Las precede la Ley para la Reforma Política, aprobada por las propias Cortes del régimen y ratificada en referéndum, y la legalización del Partido Comunista un Sábado Santo. La fórmula de la Transición fue ir de la ley a la ley.",
    ["1977", "elecciones", "Suárez", "Transición"],
    "Ordenamiento",
  ),
  event(
    "moncloa", 1977, "octubre de 1977", "democracia",
    "Los Pactos de la Moncloa",
    "Los partidos acuerdan un plan económico para que el sistema no salte por los aires.",
    "La inflación superaba el veinte por ciento y el paro crecía. El acuerdo, firmado por gobierno y oposición, permitió afrontar la crisis mientras se redactaba la Constitución.",
    ["1977", "Pactos de la Moncloa", "inflación"],
    "Sociedad",
  ),
  event(
    "constitucion-1978", 1978, "6 de diciembre de 1978", "democracia",
    "Se ratifica la Constitución",
    "Ciento sesenta y nueve artículos escritos para que ninguna fuerza quedara fuera.",
    "Aprobada por las Cortes el 31 de octubre y ratificada en referéndum el 6 de diciembre, entra en vigor el 29. Solo se ha reformado dos veces desde entonces, en 1992 y en 2011.",
    ["1978", "Constitución", "referéndum", "consenso"],
    "Ordenamiento",
  ),
  event(
    "23f", 1981, "23 de febrero de 1981", "democracia",
    "El intento de golpe de Estado",
    "Guardias civiles asaltan el Congreso durante una votación de investidura.",
    "El Gobierno y los diputados quedan secuestrados en el hemiciclo. El golpe fracasa esa misma noche y es el último intento de volver atrás por la fuerza. Al año siguiente el PSOE gana con mayoría absoluta.",
    ["1981", "23-F", "Congreso", "golpe"],
  ),
  event(
    "cee-1986", 1986, "1 de enero de 1986", "democracia",
    "España entra en la Comunidad Económica Europea",
    "Junto con Portugal, tras años de negociación.",
    "Ese mismo año un referéndum confirma la permanencia en la OTAN. La entrada en Europa transforma la economía, el campo y las infraestructuras del país en poco más de una década.",
    ["1986", "CEE", "OTAN", "Europa"],
    "España en el mundo",
  ),
  event(
    "1992", 1992, "1992", "democracia",
    "Barcelona, Sevilla y el primer AVE",
    "El año en que el país se enseña al mundo.",
    "Los Juegos Olímpicos de Barcelona, la Exposición Universal de Sevilla y la primera línea de alta velocidad entre Madrid y Sevilla coinciden en doce meses. España se ve a sí misma de otra manera a partir de entonces.",
    ["1992", "Barcelona", "Sevilla", "AVE"],
    "Sociedad",
  ),
  event(
    "euro-2002", 2002, "1 de enero de 2002", "democracia",
    "El euro sustituye a la peseta",
    "Tras tres años de existir solo en las cuentas, la moneda llega a los bolsillos.",
    "La peseta había circulado desde 1868. El cambio fue el efecto más visible y cotidiano de la integración europea, y durante años mucha gente siguió calculando mentalmente en pesetas.",
    ["2002", "euro", "peseta"],
    "España en el mundo",
  ),
  event(
    "11m", 2004, "11 de marzo de 2004", "democracia",
    "Los atentados de Madrid",
    "Ciento noventa y tres muertos en trenes de cercanías.",
    "Es el mayor atentado de la historia de España. Por su parte ETA, que había matado a más de ochocientas personas desde los años sesenta, anunciaría el fin de su actividad armada en 2011 y su disolución en 2018.",
    ["2004", "11-M", "Madrid", "atentado"],
  ),
  event(
    "felipe-vi", 2014, "19 de junio de 2014", "democracia",
    "Felipe VI es proclamado rey",
    "Juan Carlos I abdica tras treinta y nueve años en el trono.",
    "La proclamación se celebra ante las Cortes Generales, con el juramento de guardar y hacer guardar la Constitución. Es la primera sucesión de la monarquía parlamentaria española.",
    ["2014", "Felipe VI", "abdicación"],
    "Ordenamiento",
  ),
];
