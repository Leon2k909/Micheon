import type { CountryQuestion } from "@/lib/countryStudies";

/**
 * La colección de práctica del curso «Vivir en España».
 *
 * Construida como las británica, alemana, francesa, polaca e italiana, y
 * separada de los exámenes que cierran cada lección por la misma razón:
 * aquellos llegan con el texto todavía en pantalla, y estas vuelven en orden
 * desordenado mucho después de haber leído.
 *
 * Ninguna pregunta de una lección reaparece aquí. Nada sirve dos veces —
 * check-es-questions compara los dos conjuntos y detiene la compilación si se
 * solapan.
 *
 * Cada pregunta lleva el identificador de la lección que la enseña. El
 * capítulo se deduce de la lección, no de una segunda lista llevada a mano.
 *
 * NO SON LAS PREGUNTAS DEL CCSE. El Instituto Cervantes publica un manual de
 * 300 preguntas y esas son suyas: estas están escritas para este curso. Se
 * comparte el temario, no el texto.
 *
 * LA DIFICULTAD se asigna, no se calcula. «easy»: la respuesta está en la
 * lección de forma explícita. «medium»: hay que recordar un nombre, una fecha
 * o una cifra. «hard»: hay que juntar dos hechos, o la pregunta apunta a una
 * confusión frecuente — el Congreso y el Senado, el jefe del Estado y el del
 * Gobierno, la Constitución de 1812 y la de 1978.
 */

export const ES_QUESTIONS: CountryQuestion[] = [
];
