import type { CountryTimelineEvent } from "@/lib/countryStudies";

/**
 * Лента времени курса «Жизнь в России».
 *
 * Построена по образцу британской, немецкой, французской, польской,
 * итальянской и испанской, с тем же правилом, что действует там: период
 * относится к своему ПОСЛЕДНЕМУ году, а не к первому. Советское время стоит
 * у 1991-го, а не у 1922-го — иначе лента читалась бы так, будто эпоха
 * кончается раньше, чем начинается.
 *
 * ВОСЕМЬ ЭПОХ, а не шесть, как у большинства остальных. Тысяча с лишним лет
 * от Киевской Руси до наших дней не укладывается в шесть отрезков без того,
 * чтобы какой-нибудь из них не стал вместилищем четырёх разных эпох. Русская
 * история ломается именно в этих восьми местах, и каждое из них меняет и
 * столицу, и устройство власти, и границы.
 *
 * Лента заканчивается там же, где заканчиваются остальные шесть: на
 * завершённых событиях, о которых спор уже не идёт.
 */

type RuEra =
  | "drevnyaya-rus"
  | "ordynskoe-vremya"
  | "moskovskoe-tsarstvo"
  | "imperiya"
  | "revolyutsiya"
  | "sovetskoe-vremya"
  | "poslevoennyi-sssr"
  | "rossiyskaya-federatsiya";

export const RU_ERA_LABELS: Record<RuEra, string> = {
  "drevnyaya-rus": "Древняя Русь",
  "ordynskoe-vremya": "Ордынское время и возвышение Москвы",
  "moskovskoe-tsarstvo": "Московское царство",
  imperiya: "Российская империя",
  revolyutsiya: "Революция и Гражданская война",
  "sovetskoe-vremya": "Советское время до 1945 года",
  "poslevoennyi-sssr": "Послевоенный СССР",
  "rossiyskaya-federatsiya": "Российская Федерация",
};

export const RU_ERA_ORDER: RuEra[] = [
  "drevnyaya-rus",
  "ordynskoe-vremya",
  "moskovskoe-tsarstvo",
  "imperiya",
  "revolyutsiya",
  "sovetskoe-vremya",
  "poslevoennyi-sssr",
  "rossiyskaya-federatsiya",
];

export const RU_TIMELINE: CountryTimelineEvent[] = [
];
