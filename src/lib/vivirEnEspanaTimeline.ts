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

export const ES_TIMELINE: CountryTimelineEvent[] = [
];
