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
  ],
};
