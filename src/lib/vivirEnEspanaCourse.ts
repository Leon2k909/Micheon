import type { Course } from "@/lib/courses";

/**
 * Vivir en España.
 *
 * El sexto curso de la sección Country studies, construido sobre el mismo
 * modelo que Life in the UK, Leben in Deutschland, Vivre en France, Życie w
 * Polsce y Vivere in Italia: los mismos tipos de bloque, la misma forma de
 * lección, la misma estructura de examen. Cambia el contenido — y la lengua,
 * porque cada uno de estos cursos está escrito en la de su país.
 *
 * ESTA VEZ SÍ HAY UN EXAMEN QUE IMITAR. A diferencia de Polonia e Italia,
 * España exige para la nacionalidad la prueba CCSE, de Conocimientos
 * Constitucionales y Socioculturales de España, que elabora y administra el
 * Instituto Cervantes. Los números del campo `exam` son los suyos:
 *
 *   25 preguntas · 45 minutos · 15 aciertos para aprobar (60 %)
 *
 * La prueba reparte esas 25 preguntas en dos bloques — 15 de «Gobierno,
 * legislación y participación ciudadana en España» y 10 de «Cultura, historia
 * y sociedad españolas» — y las extrae de un manual de 300 preguntas que se
 * publica por adelantado. El manual vigente es el de 2026, en vigor desde
 * enero de ese año, con una cuarta parte de las preguntas renovadas respecto
 * al anterior. Comprobado en examenes.cervantes.es en septiembre de 2026.
 *
 * DOS DIFERENCIAS CONSCIENTES con la prueba real. La primera: allí cada
 * pregunta ofrece tres opciones, o es de verdadero y falso; aquí son cuatro,
 * como en los otros cinco cursos, para que quien pase de un país a otro
 * encuentre siempre la misma forma de pregunta. La segunda: este curso no
 * copia el manual. Las 300 preguntas publicadas son suyas; las de aquí están
 * escritas para este curso.
 *
 * Y NO ES UN CURSO DE TRÁMITES. Cómo inscribirse, qué documentos llevar,
 * cuánto se espera por la cita: nada de eso entra, igual que no entra en los
 * otros cinco. Lo que se aprende aquí es el país.
 *
 * CINCO CAPÍTULOS:
 *   1. Símbolos y Constitución
 *   2. Las instituciones del Estado
 *   3. Historia de España
 *   4. El Estado autonómico, el territorio y las lenguas
 *   5. Sociedad y vida cotidiana
 *
 * LAS FUENTES son públicas: la Constitución española de 1978, las webs del
 * Congreso, el Senado, la Casa Real y el Tribunal Constitucional, el BOE, el
 * Instituto Nacional de Estadística y las especificaciones de la prueba CCSE
 * publicadas por el Instituto Cervantes. Se toman los hechos — fechas,
 * instituciones, cifras. Las formulaciones, las preguntas y las explicaciones
 * se escriben aquí; ningún catálogo se copia.
 */
export const vivirEnEspanaCourse: Course = {
  id: "vivir-en-espana",
  kind: "citizenship",
  name: "Spain – Land and Culture",
  tagline: "Historia, instituciones y vida diaria: cómo funciona el país.",
  icon: "🇪🇸",
  available: true,
  lessons: [
    // ══ Capítulo 1: Símbolos y Constitución ═══════════════════════════════
    {
      id: "es-simbolos",
      title: "Símbolos nacionales",
      section: "Símbolos y Constitución",
      badge: "lección 1",
      blocks: [
        { type: "callout", variant: "why", text: "Por qué se empieza aquí: los símbolos se ven todos los días — en el ayuntamiento, en el pasaporte, en la camiseta de la selección — y son la puerta más fácil para entrar en todo lo demás." },
        { type: "h3", text: "La bandera" },
        { type: "p", text: "La bandera tiene tres franjas horizontales: **roja, amarilla y roja**. La amarilla es **el doble de ancha** que cada una de las rojas, de modo que ocupa la mitad de la bandera. Lo establece el **artículo 4** de la Constitución." },
        { type: "p", text: "Su origen es marinero. En **1785 Carlos III** convocó un concurso para dotar a la Armada de un pabellón que se distinguiera en el mar: casi todas las flotas europeas usaban entonces fondos blancos con escudos, y de lejos se confundían. El rojo y el amarillo se ven a mucha distancia. De ahí pasó al ejército y, en el siglo XIX, a bandera nacional." },
        { type: "h3", text: "El escudo" },
        { type: "p", text: "El escudo es un resumen de historia peninsular. Está **cuartelado**: cada cuartel corresponde a un reino que acabó formando parte de España." },
        { type: "cards", items: [
          { h4: "Castilla y León", p: "El castillo dorado y el león púrpura ocupan los dos primeros cuarteles." },
          { h4: "Aragón y Navarra", p: "Los cuatro palos rojos de Aragón y las cadenas de Navarra completan el cuartelado." },
          { h4: "Granada", p: "La granada al pie recuerda el último reino incorporado, en 1492." },
          { h4: "Las columnas", p: "Las columnas de Hércules, con el lema PLUS ULTRA: más allá, hacia el Atlántico. Antes del descubrimiento el lema era el contrario." },
        ] },
        { type: "quiz",
          q: "¿Cómo son las franjas de la bandera española?",
          options: [
            { text: "Tres franjas iguales: roja, amarilla y roja", correct: false },
            { text: "Roja, amarilla del doble de ancho, y roja", correct: true },
            { text: "Dos franjas: roja arriba y amarilla abajo", correct: false },
            { text: "Tres franjas verticales", correct: false },
          ],
          explanation: "La amarilla ocupa la mitad de la bandera y cada roja un cuarto. No son tres franjas iguales, y esa proporción está fijada en el artículo 4 de la Constitución.",
        },
        { type: "h3", text: "El himno" },
        { type: "p", text: "El himno se llama **Marcha Real** y tiene una rareza que lo distingue de casi todos los demás: **no tiene letra**. Se canta con la boca cerrada, o no se canta. Solo otros pocos países en el mundo están en la misma situación." },
        { type: "p", text: "Es además uno de los himnos más antiguos de Europa: aparece documentado ya en **1761** como Marcha Granadera. Se le han puesto letras en varias épocas, pero ninguna ha llegado a ser oficial, y los intentos de darle una han fracasado siempre." },
        { type: "quiz",
          q: "¿Qué particularidad tiene el himno nacional español?",
          options: [
            { text: "Que dura menos de treinta segundos", correct: false },
            { text: "Que no tiene letra oficial", correct: true },
            { text: "Que solo puede interpretarse en actos militares", correct: false },
            { text: "Que se compuso en el siglo XX", correct: false },
          ],
          explanation: "La Marcha Real carece de letra oficial. Se han propuesto varias a lo largo del tiempo y ninguna ha prosperado; es además uno de los himnos más antiguos de Europa, documentado desde 1761.",
        },
        { type: "h3", text: "Las fechas" },
        { type: "cards", items: [
          { h4: "12 de octubre", p: "Fiesta Nacional de España. Conmemora la llegada de Colón a América en 1492 y el desfile en Madrid es el acto central." },
          { h4: "6 de diciembre", p: "Día de la Constitución. Se celebra el referéndum de 1978, no la fecha en que entró en vigor." },
          { h4: "2 de mayo", p: "Fiesta de la Comunidad de Madrid: el levantamiento de 1808 contra las tropas de Napoleón. Es autonómica, no nacional." },
        ] },
        { type: "p", text: "La lengua oficial del Estado es el **castellano**, según el artículo 3, que añade que las demás lenguas españolas serán también oficiales en sus comunidades. Es el único artículo de los primeros que habla de lenguas, y en el capítulo cuarto se ve por qué importa tanto." },
        { type: "quiz",
          q: "¿Qué se celebra el 12 de octubre?",
          options: [
            { text: "El Día de la Constitución", correct: false },
            { text: "La Fiesta Nacional de España", correct: true },
            { text: "El aniversario de la proclamación del rey", correct: false },
            { text: "El fin de la Guerra Civil", correct: false },
          ],
          explanation: "El 12 de octubre es la Fiesta Nacional. El Día de la Constitución es el 6 de diciembre: dos fechas que se confunden con frecuencia porque ambas son festivos nacionales.",
        },
        { type: "callout", variant: "warn", text: "Bandera con escudo y bandera sin escudo son las dos correctas. La que llevan los edificios oficiales incluye el escudo; la que se ve en un balcón o en un estadio normalmente no." },
      ],
    },
    {
      id: "es-constitucion",
      title: "La Constitución de 1978",
      section: "Símbolos y Constitución",
      badge: "lección 2",
      blocks: [
        { type: "callout", variant: "why", text: "Por qué importa: casi todo lo que viene después — el rey, las Cortes, las autonomías, las lenguas — está en un texto de 1978 que se escribió deliberadamente para que nadie ganara del todo. Entender ese punto de partida explica su forma." },
        { type: "h3", text: "Cómo se hizo" },
        { type: "p", text: "Tras la muerte de Franco en 1975, las **elecciones de junio de 1977** dieron unas Cortes que asumieron la tarea de escribir una Constitución. La comisión encargó el borrador a **siete diputados** de partidos distintos, a los que se conoce como los **padres de la Constitución**." },
        { type: "p", text: "El calendario del final del año siguiente conviene tenerlo ordenado: las Cortes aprobaron el texto el **31 de octubre de 1978**, el pueblo lo ratificó en **referéndum el 6 de diciembre**, el rey lo sancionó el **27 de diciembre** y entró en vigor el **29 de diciembre**, el día de su publicación en el Boletín Oficial del Estado." },
        { type: "p", text: "La palabra que resume el método es **consenso**. El texto se redactó buscando que ninguna fuerza quedara fuera, y esa es la razón de que algunos artículos sean deliberadamente amplios: se acordó la frase precisamente porque admitía más de una lectura." },
        { type: "quiz",
          q: "¿En qué fecha se ratificó la Constitución en referéndum?",
          options: [
            { text: "El 31 de octubre de 1978", correct: false },
            { text: "El 6 de diciembre de 1978", correct: true },
            { text: "El 27 de diciembre de 1978", correct: false },
            { text: "El 29 de diciembre de 1978", correct: false },
          ],
          explanation: "Aprobación en las Cortes el 31 de octubre, referéndum el 6 de diciembre, sanción real el 27 y entrada en vigor el 29. El Día de la Constitución celebra el referéndum.",
        },
        { type: "h3", text: "Cómo está hecha" },
        { type: "p", text: "Tiene **169 artículos**, repartidos en un **título preliminar** y **diez títulos**, más disposiciones adicionales, transitorias, derogatoria y final. Es un texto largo comparado con otras constituciones europeas, y buena parte de esa extensión está en el título dedicado a los derechos." },
        { type: "cards", items: [
          { h4: "Título preliminar", p: "Artículos 1 a 9: qué es España, dónde reside la soberanía, las lenguas, la bandera, la capital." },
          { h4: "Título I", p: "Artículos 10 a 55: derechos y deberes fundamentales. Es el título más extenso." },
          { h4: "Títulos II a VI", p: "La Corona, las Cortes, el Gobierno y el poder judicial: quién hace qué." },
          { h4: "Título VIII", p: "La organización territorial del Estado. De aquí nacen las comunidades autónomas." },
        ] },
        { type: "h3", text: "Los primeros artículos" },
        { type: "p", text: "El **artículo 1** define España como un **Estado social y democrático de Derecho**, sitúa la soberanía en el pueblo español y establece que la **forma política del Estado es la Monarquía parlamentaria**. Las tres afirmaciones están en el mismo artículo y conviene no separarlas: la monarquía es la forma, no el fundamento." },
        { type: "p", text: "El **artículo 2** contiene la frase más discutida del texto: se fundamenta en la **indisoluble unidad de la Nación española** y a la vez reconoce y garantiza **el derecho a la autonomía de las nacionalidades y regiones** que la integran. Las dos mitades se acordaron juntas, y el capítulo cuarto de este curso explica qué se construyó sobre ellas." },
        { type: "quiz",
          q: "¿Qué forma política del Estado establece el artículo 1?",
          options: [
            { text: "La república parlamentaria", correct: false },
            { text: "La monarquía parlamentaria", correct: true },
            { text: "La monarquía absoluta", correct: false },
            { text: "El Estado federal", correct: false },
          ],
          explanation: "Monarquía parlamentaria: el rey es jefe del Estado pero no gobierna, y la soberanía reside en el pueblo. El mismo artículo define España como Estado social y democrático de Derecho.",
        },
        { type: "h3", text: "Cambiarla es difícil" },
        { type: "p", text: "Hay **dos procedimientos**. El **ordinario**, del artículo 167, exige tres quintos de cada cámara. El **agravado**, del artículo 168, se aplica a las partes más protegidas — el título preliminar, los derechos fundamentales de la sección primera y el título de la Corona — y es de una dureza poco común: dos tercios de ambas cámaras, **disolución de las Cortes**, elecciones, ratificación por las nuevas cámaras y **referéndum obligatorio**." },
        { type: "p", text: "El resultado se ve en la práctica: la Constitución solo se ha reformado **dos veces** en más de cuarenta años, ambas por el procedimiento ordinario y ambas por exigencias europeas. En **1992** se tocó el artículo 13 para permitir el voto de extranjeros en las municipales tras Maastricht, y en **2011** el artículo 135, sobre estabilidad presupuestaria." },
        { type: "quiz",
          q: "¿Cuántas veces se ha reformado la Constitución española?",
          options: [
            { text: "Ninguna", correct: false },
            { text: "Dos", correct: true },
            { text: "Siete", correct: false },
            { text: "Más de veinte", correct: false },
          ],
          explanation: "Dos: en 1992, para permitir el voto de extranjeros en elecciones municipales, y en 2011, sobre estabilidad presupuestaria. Ambas por el procedimiento ordinario del artículo 167.",
        },
        { type: "callout", variant: "warn", text: "El **29 de diciembre** entró en vigor, pero el festivo es el **6 de diciembre**, el del referéndum. Se celebra el día en que la gente votó, no el día en que el texto empezó a regir." },
      ],
    },
    {
      id: "es-derechos",
      title: "Derechos y libertades fundamentales",
      section: "Símbolos y Constitución",
      badge: "lección 3",
      blocks: [
        { type: "callout", variant: "why", text: "Por qué importa: el título I no es una lista uniforme. Unos derechos están protegidos con todo el aparato del Estado y otros son principios que orientan la política. Saber en qué grupo cae cada uno es la mitad de entenderlo." },
        { type: "h3", text: "Tres niveles de protección" },
        { type: "p", text: "La Constitución protege sus derechos con intensidad distinta, y el criterio es dónde está escrito cada uno." },
        { type: "cards", items: [
          { h4: "Artículos 15 a 29", p: "Derechos fundamentales y libertades públicas. Máxima protección: ley orgánica, procedimiento judicial preferente y recurso de amparo ante el Tribunal Constitucional." },
          { h4: "Artículos 30 a 38", p: "Derechos y deberes de los ciudadanos. Vinculan a los poderes públicos y se regulan por ley, pero sin amparo constitucional." },
          { h4: "Artículos 39 a 52", p: "Principios rectores de la política social y económica: vivienda, medio ambiente, tercera edad. Orientan al legislador y solo se alegan ante los tribunales conforme a las leyes que los desarrollen." },
        ] },
        { type: "p", text: "El **artículo 14** abre la lista fuera de esa clasificación: los españoles son iguales ante la ley, sin que pueda prevalecer discriminación alguna por nacimiento, raza, sexo, religión, opinión o cualquier otra condición personal o social." },
        { type: "h3", text: "La persona" },
        { type: "p", text: "El **artículo 15** reconoce el derecho a la vida y a la integridad física y moral, prohíbe la tortura y **abole la pena de muerte**, salvo lo que dispusieran las leyes penales militares en tiempo de guerra — excepción que fue suprimida por ley en 1995." },
        { type: "p", text: "El **artículo 16** garantiza la libertad ideológica y religiosa, y añade una frase decisiva: **ninguna confesión tendrá carácter estatal**. No es exactamente una separación al modo francés, porque el mismo artículo obliga a los poderes públicos a mantener relaciones de cooperación con la Iglesia católica y las demás confesiones. Es una aconfesionalidad con cooperación." },
        { type: "p", text: "El **artículo 17** protege la libertad personal: la **detención preventiva** no puede durar más de **setenta y dos horas**, pasadas las cuales el detenido debe ser puesto en libertad o a disposición judicial. El mismo artículo prevé el **habeas corpus**, el procedimiento para llevar de inmediato ante un juez a quien esté detenido ilegalmente." },
        { type: "quiz",
          q: "¿Cuál es la duración máxima de una detención preventiva?",
          options: [
            { text: "Veinticuatro horas", correct: false },
            { text: "Cuarenta y ocho horas", correct: false },
            { text: "Setenta y dos horas", correct: true },
            { text: "Cinco días", correct: false },
          ],
          explanation: "Setenta y dos horas, según el artículo 17. Cumplido el plazo, el detenido debe quedar en libertad o pasar a disposición judicial; el habeas corpus sirve para forzarlo si no ocurre.",
        },
        { type: "h3", text: "La vida en común" },
        { type: "p", text: "El **artículo 18** protege el honor, la intimidad y la propia imagen, declara **inviolable el domicilio** — no se entra sin consentimiento o resolución judicial, salvo delito flagrante — y garantiza el secreto de las comunicaciones. El **artículo 20** reconoce la libertad de expresión y el derecho a comunicar y recibir información veraz, y prohíbe la censura previa." },
        { type: "p", text: "Los **artículos 21 y 22** amparan la reunión y la asociación: para reunirse en lugares de tránsito público basta comunicarlo a la autoridad, no pedir permiso. El **artículo 23** reconoce el derecho a participar en los asuntos públicos y a acceder en condiciones de igualdad a las funciones y cargos públicos." },
        { type: "quiz",
          q: "¿Qué establece la Constitución sobre la religión del Estado?",
          options: [
            { text: "Que la religión católica es la oficial", correct: false },
            { text: "Que ninguna confesión tendrá carácter estatal", correct: true },
            { text: "Que se prohíbe toda relación entre Estado y confesiones", correct: false },
            { text: "Que cada comunidad autónoma decide su confesión", correct: false },
          ],
          explanation: "El artículo 16 dice que ninguna confesión tendrá carácter estatal, y a la vez obliga a mantener relaciones de cooperación con la Iglesia católica y las demás. Es aconfesionalidad, no separación estricta.",
        },
        { type: "h3", text: "Ante la justicia" },
        { type: "p", text: "El **artículo 24** reconoce la **tutela judicial efectiva**: derecho al juez ordinario predeterminado por la ley, a la defensa y a la asistencia de letrado, a un proceso público sin dilaciones indebidas y a la **presunción de inocencia**. El **artículo 25** añade que las penas privativas de libertad se orientarán a la reeducación y reinserción social." },
        { type: "p", text: "Cuando uno de los derechos de los artículos 14 a 29 se vulnera y los tribunales ordinarios no lo reparan, queda el **recurso de amparo** ante el **Tribunal Constitucional**. Es la última puerta interna, y solo se abre para ese grupo de derechos." },
        { type: "quiz",
          q: "¿Ante qué órgano se interpone el recurso de amparo?",
          options: [
            { text: "Ante el Tribunal Supremo", correct: false },
            { text: "Ante el Tribunal Constitucional", correct: true },
            { text: "Ante el Defensor del Pueblo", correct: false },
            { text: "Ante el Consejo General del Poder Judicial", correct: false },
          ],
          explanation: "El amparo se interpone ante el Tribunal Constitucional y solo protege los derechos de los artículos 14 a 29. El Tribunal Supremo es la cúspide de la jurisdicción ordinaria, que es otra cosa.",
        },
        { type: "callout", variant: "warn", text: "El derecho a una **vivienda digna** está en el artículo 47, entre los principios rectores. Es un mandato al legislador, no un derecho que pueda reclamarse directamente ante un juez como la libertad de expresión." },
      ],
    },
    {
      id: "es-deberes",
      title: "Deberes de los ciudadanos y la nacionalidad",
      section: "Símbolos y Constitución",
      badge: "lección 4",
      blocks: [
        { type: "callout", variant: "why", text: "Por qué importa: la Constitución no solo reparte derechos. Impone cuatro deberes, y uno de ellos se cumple todos los años. Y define quién es español, que es la puerta por la que se entra a todo lo demás." },
        { type: "h3", text: "Los deberes" },
        { type: "p", text: "El **artículo 30** establece el derecho y el deber de **defender a España**. La ley regulaba con él el servicio militar obligatorio, que quedó **suspendido en 2001**: desde entonces las Fuerzas Armadas son enteramente profesionales. El mismo artículo prevé la objeción de conciencia y, para casos de grave riesgo, deberes de protección civil." },
        { type: "p", text: "El **artículo 31** es el deber que se cumple cada año: todos contribuirán al sostenimiento de los gastos públicos **de acuerdo con su capacidad económica**, mediante un sistema tributario **justo**, inspirado en los principios de **igualdad y progresividad**, y que en ningún caso tendrá alcance **confiscatorio**. Progresividad significa que quien más gana no paga solo más dinero, sino un porcentaje mayor." },
        { type: "cards", items: [
          { h4: "Defender a España · art. 30", p: "Derecho y deber. El servicio militar obligatorio está suspendido desde 2001." },
          { h4: "Contribuir · art. 31", p: "Según la capacidad económica, con un sistema progresivo y no confiscatorio." },
          { h4: "Trabajar · art. 35", p: "Deber y derecho al trabajo, a la libre elección de profesión y a una remuneración suficiente." },
          { h4: "La enseñanza básica · art. 27", p: "Es obligatoria y gratuita. El deber recae sobre quien tiene la patria potestad." },
        ] },
        { type: "quiz",
          q: "¿Qué significa que el sistema tributario es progresivo?",
          options: [
            { text: "Que los impuestos suben cada año", correct: false },
            { text: "Que quien tiene más renta paga un porcentaje mayor", correct: true },
            { text: "Que todos pagan el mismo porcentaje", correct: false },
            { text: "Que se puede pagar a plazos", correct: false },
          ],
          explanation: "La progresividad del artículo 31 se refiere al porcentaje, no solo al importe. Un impuesto que cobrara a todos el mismo porcentaje sería proporcional, no progresivo.",
        },
        { type: "h3", text: "Quién es español" },
        { type: "p", text: "El **artículo 11** remite a la ley, y esa ley es el **Código Civil**. La regla principal es la de la **sangre**: es español de origen quien nace de padre o madre españoles, con independencia del lugar de nacimiento. Nacer en territorio español no basta por sí solo, aunque hay reglas que evitan que un niño quede sin nacionalidad alguna." },
        { type: "p", text: "El mismo artículo prohíbe privar de la nacionalidad a los españoles de origen y permite tratados de **doble nacionalidad** con los países iberoamericanos y con aquellos que hayan tenido o tengan una vinculación particular con España." },
        { type: "h3", text: "La nacionalidad por residencia" },
        { type: "p", text: "El plazo general es de **diez años** de residencia legal, continuada e inmediatamente anterior a la solicitud. Hay plazos abreviados, y responden a la historia de España más que a un criterio administrativo." },
        { type: "cards", items: [
          { h4: "Diez años", p: "El plazo general, para quien no encaja en ninguna de las categorías siguientes." },
          { h4: "Cinco años", p: "Para quienes hayan obtenido la condición de refugiado." },
          { h4: "Dos años", p: "Para nacionales de países iberoamericanos, Andorra, Filipinas, Guinea Ecuatorial y Portugal, y para los sefardíes." },
          { h4: "Un año", p: "Entre otros supuestos, para quien nació en territorio español, o lleva un año casado con española o español y no está separado." },
        ] },
        { type: "p", text: "Además de la residencia se exigen **buena conducta cívica** y un **suficiente grado de integración**, que se acredita con dos pruebas del Instituto Cervantes: la de **lengua DELE A2** y la **CCSE**, de conocimientos constitucionales y socioculturales. Quien procede de un país donde el español es lengua oficial queda exento de la primera." },
        { type: "quiz",
          q: "¿Cuántos años de residencia se exigen con carácter general para pedir la nacionalidad?",
          options: [
            { text: "Dos", correct: false },
            { text: "Cinco", correct: false },
            { text: "Diez", correct: true },
            { text: "Quince", correct: false },
          ],
          explanation: "Diez años de residencia legal y continuada. Cinco corresponde a los refugiados y dos a los nacionales de países iberoamericanos y a otros supuestos con vínculo histórico con España.",
        },
        { type: "quiz",
          q: "¿Qué plazo de residencia se aplica a los nacionales de países iberoamericanos?",
          options: [
            { text: "Un año", correct: false },
            { text: "Dos años", correct: true },
            { text: "Cinco años", correct: false },
            { text: "El mismo plazo general de diez años", correct: false },
          ],
          explanation: "Dos años, igual que para Andorra, Filipinas, Guinea Ecuatorial, Portugal y los sefardíes. El plazo de un año se reserva a supuestos como haber nacido en España o llevar un año casado con una persona española.",
        },
        { type: "callout", variant: "warn", text: "La **mayoría de edad** en España son los **dieciocho años**, y con ella llegan el voto y la plena capacidad de obrar. El **DNI** es obligatorio a partir de los catorce." },
      ],
    },
    {
      id: "es-fiestas",
      title: "Fiestas y calendario",
      section: "Símbolos y Constitución",
      badge: "lección 5",
      blocks: [
        { type: "callout", variant: "why", text: "Por qué importa: el calendario laboral español tiene tres capas — el Estado, la comunidad y el municipio — y por eso dos ciudades vecinas pueden trabajar en días distintos. Entender las capas evita más de un viaje en balde." },
        { type: "h3", text: "Catorce días" },
        { type: "p", text: "El calendario laboral tiene **catorce festivos** al año. **Doce** los fija el Estado o la comunidad autónoma, y **dos son locales**, decididos por cada ayuntamiento: el día del patrón, la fiesta mayor, la feria del pueblo." },
        { type: "p", text: "De ahí que un festivo pueda no serlo a treinta kilómetros. Las comunidades pueden además sustituir algunos festivos nacionales por otros propios, de modo que ni siquiera la lista estatal se aplica igual en todas partes." },
        { type: "cards", items: [
          { h4: "Fijos en todo el país", p: "1 de enero, 1 de mayo, 12 de octubre, 1 de noviembre, 6 y 8 de diciembre, y 25 de diciembre." },
          { h4: "Semana Santa", p: "El Viernes Santo es festivo en toda España. El Jueves Santo lo es en la mayoría de las comunidades, pero no en todas." },
          { h4: "Días de la comunidad", p: "El 11 de septiembre en Cataluña, el 25 de julio en Galicia, el 9 de octubre en la Comunidad Valenciana, el 28 de febrero en Andalucía." },
          { h4: "Los dos locales", p: "Los elige el ayuntamiento. Suelen coincidir con el patrón o con la fiesta grande del municipio." },
        ] },
        { type: "quiz",
          q: "¿Cuántos días festivos tiene el calendario laboral español?",
          options: [
            { text: "Diez", correct: false },
            { text: "Doce", correct: false },
            { text: "Catorce", correct: true },
            { text: "Dieciséis", correct: false },
          ],
          explanation: "Catorce: doce estatales o autonómicos y dos locales fijados por el ayuntamiento. Por eso dos municipios vecinos pueden tener días libres distintos.",
        },
        { type: "h3", text: "El invierno" },
        { type: "p", text: "La **Nochevieja** tiene un rito muy preciso: al sonar las doce campanadas se comen **doce uvas**, una por campanada. Quien las termina a tiempo tendrá un buen año. La costumbre se difundió a comienzos del siglo XX y hoy se retransmite en directo desde la Puerta del Sol de Madrid." },
        { type: "p", text: "Los regalos de invierno no llegan el 25 de diciembre sino el **6 de enero**, con los **Reyes Magos**. La tarde del día 5 se celebran las cabalgatas, y en Nochebuena y Navidad las familias se reúnen a comer. En muchas casas conviven ya ambas fechas, pero la de los Reyes sigue siendo la principal para los niños." },
        { type: "quiz",
          q: "¿Qué se hace tradicionalmente en Nochevieja al sonar las campanadas?",
          options: [
            { text: "Se comen doce uvas, una por campanada", correct: true },
            { text: "Se encienden doce velas", correct: false },
            { text: "Se reparten doce monedas", correct: false },
            { text: "Se cantan doce coplas", correct: false },
          ],
          explanation: "Una uva por campanada, doce en total. La costumbre se extendió a principios del siglo XX y se retransmite cada año desde la Puerta del Sol.",
        },
        { type: "h3", text: "Las fiestas populares" },
        { type: "p", text: "Junto al calendario oficial está el de las fiestas que dan fama a las ciudades, y que en muchos casos duran una semana entera." },
        { type: "cards", items: [
          { h4: "Las Fallas", p: "En Valencia, en marzo. Se levantan monumentos de cartón y madera por toda la ciudad y la noche del 19 se queman." },
          { h4: "La Feria de Abril", p: "En Sevilla, con casetas, caballos y trajes de flamenca, dos semanas después de Semana Santa." },
          { h4: "San Fermín", p: "En Pamplona, del 6 al 14 de julio. Los encierros de la mañana son su imagen más conocida." },
          { h4: "El Carnaval", p: "El de Santa Cruz de Tenerife y el de Cádiz son los mayores; el gaditano se recuerda sobre todo por sus chirigotas." },
        ] },
        { type: "quiz",
          q: "¿En qué ciudad se celebran las Fallas?",
          options: [
            { text: "En Sevilla", correct: false },
            { text: "En Pamplona", correct: false },
            { text: "En Valencia", correct: true },
            { text: "En Cádiz", correct: false },
          ],
          explanation: "Las Fallas son de Valencia y se queman en marzo. Sevilla tiene la Feria de Abril, Pamplona los San Fermines y Cádiz uno de los dos grandes carnavales.",
        },
        { type: "callout", variant: "warn", text: "Cuando un festivo cae en martes o jueves, muchos hacen **puente** y libran también el lunes o el viernes. Si caen dos cerca, se llama **acueducto**: no es una figura legal, pero explica por qué en esas semanas media España está cerrada." },
      ],
    },
  ],
};
