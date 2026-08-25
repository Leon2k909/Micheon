import type { CountryTimelineEvent } from "@/lib/countryStudies";

/**
 * La frise chronologique française.
 *
 * Bâtie sur le même modèle que la britannique et l'allemande, y compris la
 * règle qui y vaut : une période est classée à sa DERNIÈRE année, pas à la
 * première. La Troisième République appartient à la fin de ses soixante-dix
 * ans, sinon la frise se lit comme si elle était finie avant d'avoir commencé.
 *
 * Cinq époques, parce que l'histoire de France se coupe à ces ruptures-là :
 * avant la Révolution, la Révolution et l'Empire, le long XIXe siècle, les
 * républiques et les guerres, la Ve République.
 */

export type FrEra =
  | "ancien-regime"
  | "revolution"
  | "xixe"
  | "republiques"
  | "cinquieme";

export const FR_ERA_LABELS: Record<FrEra, string> = {
  "ancien-regime": "Ancien Régime",
  revolution: "Révolution et Empire",
  xixe: "Le XIXe siècle",
  republiques: "Républiques et guerres",
  cinquieme: "La Ve République",
};

export const FR_ERA_ORDER: FrEra[] = [
  "ancien-regime",
  "revolution",
  "xixe",
  "republiques",
  "cinquieme",
];

const event = (
  id: string,
  year: number,
  displayYear: string,
  era: FrEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "Histoire"
): CountryTimelineEvent => ({ id, year, displayYear, era, title, summary, detail, tags, category });

/** La même chose pour une période qui se termine à une année connue. */
const span = (
  id: string,
  year: number,
  endYear: number,
  displayYear: string,
  era: FrEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "Histoire"
): CountryTimelineEvent => ({ id, year, endYear, displayYear, era, title, summary, detail, tags, category });

export const FR_TIMELINE: CountryTimelineEvent[] = [
  // ── Ancien Régime ──────────────────────────────────────────────────────
  event("ft-lascaux", -17000, "vers 15000 av. J.-C.", "ancien-regime", "Les peintures de Lascaux",
    "Des chevaux et des taureaux peints sous terre en Dordogne.",
    "Découverte en 1940 par quatre adolescents, la grotte de Lascaux abrite des centaines de figures peintes il y a environ dix-sept mille ans. La grotte Chauvet, en Ardèche, est plus ancienne encore. Ces peintures sont la plus vieille trace d'art conservée sur le territoire français.",
    ["Lascaux", "préhistoire", "Dordogne", "grotte", "Chauvet"], "Culture"),
  event("ft-reims", 496, "vers 496", "ancien-regime", "Le baptême de Clovis à Reims",
    "Le premier roi des Francs devient chrétien.",
    "Clovis se fait baptiser à Reims. L'événement fonde le lien entre la royauté française et l'Église, et fait de Reims la ville du sacre : pendant plus de mille ans, les rois de France y seront couronnés.",
    ["Clovis", "Reims", "sacre", "Francs", "baptême"], "Histoire"),
  span("ft-cent-ans", 1337, 1453, "1337–1453", "ancien-regime", "La guerre de Cent Ans",
    "Un siècle de guerre entre la France et l'Angleterre.",
    "Le conflit oppose les royaumes de France et d'Angleterre pendant plus de cent ans. Jeanne d'Arc y joue un rôle décisif au siège d'Orléans en 1429 avant d'être brûlée à Rouen en 1431. La guerre s'achève en 1453 par la reconquête française.",
    ["guerre de Cent Ans", "Jeanne d'Arc", "Orléans", "Angleterre", "1453"]),
  event("ft-versailles", 1682, "1682", "ancien-regime", "Louis XIV installe la cour à Versailles",
    "Le pouvoir royal se donne un décor.",
    "Louis XIV, le Roi-Soleil, transfère la cour au château de Versailles. Le palais devient le symbole de la monarchie absolue : le roi y tient la noblesse sous son regard et concentre tous les pouvoirs. Versailles est aujourd'hui l'un des monuments les plus visités de France.",
    ["Louis XIV", "Versailles", "Roi-Soleil", "monarchie absolue", "cour"], "Culture"),
  event("ft-lumieres", 1748, "1748", "ancien-regime", "Montesquieu publie De l'esprit des lois",
    "La séparation des pouvoirs prend forme.",
    "Montesquieu propose de répartir les pouvoirs législatif, exécutif et judiciaire pour qu'aucun ne devienne absolu. Il y dénonce aussi l'esclavage. L'idée traverse la Révolution et se retrouve, deux siècles plus tard, dans la Constitution de 1958.",
    ["Montesquieu", "Lumières", "séparation des pouvoirs", "esclavage", "philosophie"], "Politique"),

  // ── Révolution et Empire ───────────────────────────────────────────────
  event("ft-bastille", 1789, "14 juillet 1789", "revolution", "La prise de la Bastille",
    "Le peuple de Paris prend la prison royale.",
    "La Bastille était une forteresse-prison où l'on pouvait être enfermé sur simple ordre du roi. Sa prise, le 14 juillet 1789, marque le début de la Révolution française. Avec la Fête de la Fédération de 1790, elle est ce que commémore la fête nationale.",
    ["Bastille", "1789", "Révolution", "14 juillet", "fête nationale"]),
  event("ft-ddhc", 1789, "26 août 1789", "revolution", "La Déclaration des droits de l'homme et du citoyen",
    "Les hommes naissent et demeurent libres et égaux en droits.",
    "Adoptée six semaines après la prise de la Bastille, elle énonce les droits naturels : liberté, propriété, sûreté, résistance à l'oppression. Elle fait partie du bloc de constitutionnalité et sert encore aujourd'hui à faire annuler des lois.",
    ["Déclaration", "1789", "droits de l'homme", "article 1er", "liberté"], "Politique"),
  event("ft-republique1", 1792, "1792", "revolution", "Proclamation de la Première République",
    "La monarchie tombe, La Marseillaise est écrite.",
    "La royauté est abolie en septembre 1792 et la République proclamée. La même année, Rouget de Lisle compose à Strasbourg le chant qui deviendra La Marseillaise et, en 1795, l'hymne national.",
    ["Première République", "1792", "Marseillaise", "Rouget de Lisle", "monarchie"], "Politique"),
  event("ft-louis16", 1793, "21 janvier 1793", "revolution", "Louis XVI est guillotiné",
    "Le roi est jugé, condamné et exécuté.",
    "Louis XVI est jugé par la Convention, condamné à mort et guillotiné place de la Révolution, aujourd'hui place de la Concorde. C'est le seul roi de France exécuté pendant la Révolution.",
    ["Louis XVI", "1793", "guillotine", "Convention", "Révolution"]),
  event("ft-code-civil", 1804, "1804", "revolution", "Napoléon Ier et le Code civil",
    "Un empereur et un code de lois valable partout.",
    "Napoléon Bonaparte devient empereur en 1804. La même année paraît le Code civil, dit Code Napoléon, qui unifie un droit privé jusque-là différent d'une province à l'autre. Il reste la base du droit français de la famille, des contrats et de la propriété.",
    ["Napoléon", "1804", "Code civil", "Empire", "droit"], "Politique"),
  event("ft-esclavage-retabli", 1802, "1802", "revolution", "Napoléon rétablit l'esclavage",
    "L'abolition de 1794 est annulée.",
    "La Convention avait aboli l'esclavage en 1794. Napoléon Bonaparte le rétablit en 1802 dans les colonies françaises. Il faudra attendre 1848 pour une abolition définitive.",
    ["esclavage", "1802", "Napoléon", "colonies", "abolition"]),

  // ── Le XIXe siècle ─────────────────────────────────────────────────────
  event("ft-delacroix", 1830, "1830", "xixe", "La Liberté guidant le peuple",
    "Delacroix peint la Révolution de Juillet.",
    "Eugène Delacroix peint une allégorie de la liberté brandissant le drapeau tricolore au-dessus des barricades. Le tableau, exposé au Louvre, est devenu l'une des images les plus reconnaissables de la République.",
    ["Delacroix", "1830", "Louvre", "Marianne", "peinture"], "Culture"),
  event("ft-abolition", 1848, "27 avril 1848", "xixe", "Abolition définitive de l'esclavage",
    "Victor Schœlcher fait signer le décret.",
    "Le décret d'abolition met fin à l'esclavage dans toutes les colonies françaises. Victor Schœlcher en est l'artisan. Le 10 mai est aujourd'hui la journée nationale de commémoration de la traite, de l'esclavage et de leurs abolitions.",
    ["esclavage", "1848", "Schœlcher", "abolition", "10 mai"], "Politique"),
  span("ft-troisieme", 1870, 1940, "1870–1940", "xixe", "La Troisième République",
    "Soixante-dix ans qui font la France républicaine.",
    "Née de la défaite de 1870, la Troisième République est le régime le plus durable depuis la Révolution. Elle donne au pays l'école gratuite et laïque, la liberté de la presse, la liberté d'association et la loi de séparation des Églises et de l'État.",
    ["Troisième République", "1870", "1940", "école", "laïcité"], "Politique"),
  event("ft-ferry", 1881, "1881", "xixe", "Les lois Jules Ferry",
    "L'école devient gratuite, puis obligatoire et laïque.",
    "La loi de 1881 rend l'école primaire publique gratuite ; celle de 1882 la rend obligatoire et laïque. C'est l'un des piliers de la République : l'instruction cesse d'être un privilège.",
    ["Jules Ferry", "1881", "1882", "école", "gratuité", "laïcité"], "Société"),
  event("ft-eiffel", 1889, "1889", "xixe", "La tour Eiffel",
    "Construite pour l'Exposition universelle.",
    "Élevée pour l'Exposition universelle de 1889, qui marquait le centenaire de la Révolution, la tour devait être démontée au bout de vingt ans. Elle est restée, et elle est aujourd'hui le monument payant le plus visité au monde.",
    ["tour Eiffel", "1889", "Exposition universelle", "Paris", "Gustave Eiffel"], "Culture"),
  event("ft-1901", 1901, "1901", "xixe", "La loi sur les associations",
    "Créer une association devient un droit.",
    "La loi de 1901 permet à toute personne de créer une association ou d'y adhérer par simple déclaration, sans autorisation. Plus d'un million d'associations existent aujourd'hui en France.",
    ["1901", "association", "liberté", "déclaration"], "Politique"),
  event("ft-1905", 1905, "9 décembre 1905", "xixe", "La séparation des Églises et de l'État",
    "Le texte fondateur de la laïcité.",
    "La loi garantit la liberté de conscience et le libre exercice des cultes, et pose que la République ne reconnaît, ne salarie ni ne subventionne aucun culte. Le 9 décembre est depuis la journée de la laïcité.",
    ["1905", "laïcité", "séparation", "cultes", "9 décembre"], "Politique"),

  // ── Républiques et guerres ─────────────────────────────────────────────
  span("ft-14-18", 1914, 1918, "1914–1918", "republiques", "La Première Guerre mondiale",
    "Quatre ans de guerre, l'armistice le 11 novembre.",
    "La guerre fait près d'un million et demi de morts français. L'armistice est signé le 11 novembre 1918 à Rethondes. Le 11 novembre est resté un jour férié de commémoration.",
    ["1914", "1918", "armistice", "11 novembre", "Grande Guerre"]),
  event("ft-appel", 1940, "18 juin 1940", "republiques", "L'appel du général de Gaulle",
    "Depuis Londres, un refus de la défaite.",
    "Le 18 juin 1940, Charles de Gaulle appelle depuis la BBC à poursuivre le combat. L'appel est l'acte fondateur de la France libre et de la Résistance organisée.",
    ["de Gaulle", "18 juin", "1940", "France libre", "Résistance"]),
  span("ft-vichy", 1940, 1944, "1940–1944", "republiques", "L'Occupation et le régime de Vichy",
    "La France occupée, un État qui collabore.",
    "Le régime de Vichy collabore avec l'Allemagne nazie, notamment aux arrestations et aux déportations de Juifs. La République a officiellement reconnu cette responsabilité en 1995. La Shoah a coûté la vie à environ six millions de Juifs d'Europe.",
    ["Vichy", "Occupation", "collaboration", "Shoah", "déportation"]),
  event("ft-moulin", 1943, "1943", "republiques", "Jean Moulin unifie la Résistance",
    "Les mouvements se rassemblent sous un même conseil.",
    "Envoyé par de Gaulle, Jean Moulin réunit les mouvements de résistance au sein du Conseil national de la Résistance. Arrêté quelques semaines plus tard, il meurt sous la torture. Il repose au Panthéon depuis 1964.",
    ["Jean Moulin", "1943", "Résistance", "Panthéon", "CNR"]),
  event("ft-debarquement", 1944, "6 juin 1944", "republiques", "Le débarquement de Normandie",
    "Les Alliés ouvrent la libération de la France.",
    "Le 6 juin 1944, les Alliés débarquent sur les plages de Normandie. Un second débarquement a lieu en Provence en août. Paris est libéré le 25 août 1944.",
    ["débarquement", "6 juin", "1944", "Normandie", "Libération"]),
  event("ft-vote-femmes", 1944, "21 avril 1944", "republiques", "Les femmes obtiennent le droit de vote",
    "Une ordonnance leur ouvre les urnes.",
    "L'ordonnance du 21 avril 1944 accorde aux femmes le droit de vote et l'éligibilité. Elles votent pour la première fois aux élections municipales de 1945.",
    ["1944", "droit de vote", "femmes", "égalité", "1945"], "Société"),
  event("ft-secu", 1945, "1945", "republiques", "La création de la Sécurité sociale",
    "Chacun cotise selon ses moyens, reçoit selon ses besoins.",
    "Les ordonnances de 1945 créent la Sécurité sociale : maladie, vieillesse, famille, accidents du travail. C'est la traduction concrète du caractère social de la République, inscrit plus tard à l'article 1er de la Constitution.",
    ["1945", "Sécurité sociale", "cotisation", "solidarité", "santé"], "Société"),
  event("ft-onu", 1945, "1945", "republiques", "La création de l'ONU",
    "Une organisation pour éviter une troisième guerre.",
    "L'Organisation des Nations unies est fondée en 1945. La France en est membre permanent du Conseil de sécurité. Trois ans plus tard, la Déclaration universelle des droits de l'homme est adoptée à Paris.",
    ["ONU", "1945", "Nations unies", "1948", "Déclaration universelle"], "Politique"),
  event("ft-ceca", 1951, "1951", "republiques", "La CECA, première pierre de l'Europe",
    "Mettre le charbon et l'acier en commun.",
    "Le traité de Paris crée la Communauté européenne du charbon et de l'acier, à la suite de la déclaration Schuman du 9 mai 1950. L'idée : rendre la guerre matériellement impossible entre la France et l'Allemagne.",
    ["CECA", "1951", "Schuman", "Europe", "traité de Paris"], "Politique"),

  // ── La Ve République ───────────────────────────────────────────────────
  event("ft-1958", 1958, "4 octobre 1958", "cinquieme", "La Constitution de la Ve République",
    "Un régime taillé pour un exécutif fort.",
    "Voulue par le général de Gaulle après l'instabilité de la IVe République, la Constitution du 4 octobre 1958 place le président de la République au centre des institutions. C'est le texte en vigueur aujourd'hui.",
    ["1958", "Constitution", "de Gaulle", "Ve République"], "Politique"),
  event("ft-1962-referendum", 1962, "1962", "cinquieme", "Le président élu au suffrage universel direct",
    "Un référendum change la façon de choisir le chef de l'État.",
    "Le référendum de 1962 instaure l'élection du président de la République au suffrage universel direct. La première élection de ce type a lieu en 1965. La même année, l'Algérie devient indépendante.",
    ["1962", "suffrage universel", "référendum", "Algérie", "indépendance"], "Politique"),
  event("ft-1975", 1975, "1975", "cinquieme", "La loi Veil",
    "L'interruption volontaire de grossesse est légalisée.",
    "Portée par Simone Veil, alors ministre de la Santé, la loi de 1975 dépénalise l'interruption volontaire de grossesse. En 2024, la liberté d'y recourir a été inscrite dans la Constitution.",
    ["1975", "loi Veil", "IVG", "Simone Veil", "2024"], "Société"),
  event("ft-1981", 1981, "1981", "cinquieme", "L'abolition de la peine de mort",
    "La France cesse d'exécuter.",
    "Sous la présidence de François Mitterrand, sur proposition du garde des Sceaux Robert Badinter, la peine de mort est abolie en 1981. L'interdiction a été inscrite dans la Constitution en 2007.",
    ["1981", "peine de mort", "Badinter", "Mitterrand", "abolition"], "Politique"),
  event("ft-maastricht", 1992, "1992", "cinquieme", "Le traité de Maastricht",
    "L'Union européenne et la citoyenneté européenne naissent.",
    "Signé en 1992, le traité fonde l'Union européenne et crée la citoyenneté européenne : tout ressortissant d'un État membre est aussi citoyen de l'Union et peut voter aux élections municipales et européennes de son pays de résidence.",
    ["Maastricht", "1992", "Union européenne", "citoyenneté européenne"], "Politique"),
  event("ft-euro", 2002, "1er janvier 2002", "cinquieme", "L'euro en pièces et en billets",
    "Le franc disparaît des porte-monnaie.",
    "Les pièces et les billets en euros entrent en circulation le 1er janvier 2002. L'euro existait déjà comme monnaie de compte depuis 1999. Les pièces françaises portent Marianne, l'arbre et la semeuse.",
    ["euro", "2002", "franc", "monnaie", "zone euro"], "Société"),
  event("ft-quinquennat", 2000, "2000", "cinquieme", "Le passage au quinquennat",
    "Le mandat présidentiel tombe de sept ans à cinq.",
    "Un référendum réduit le mandat du président de la République de sept à cinq ans. La première élection au quinquennat a lieu en 2002, la même année que le passage à l'euro.",
    ["quinquennat", "2000", "mandat", "référendum"], "Politique"),
  event("ft-2004", 2004, "2004", "cinquieme", "Les signes religieux à l'école",
    "Une loi précise ce que la laïcité interdit en classe.",
    "La loi de 2004 interdit le port de signes religieux ostensibles dans les écoles, collèges et lycées publics. Un signe discret reste possible. La charte de la laïcité à l'École est affichée dans les établissements depuis 2013.",
    ["2004", "laïcité", "école", "signes religieux", "charte"], "Société"),
  event("ft-2011", 2011, "2011", "cinquieme", "Mayotte devient le 101e département",
    "L'archipel de l'océan Indien rejoint le droit commun.",
    "À la suite d'un référendum local, Mayotte devient département français en 2011. La France compte depuis 101 départements, dont cinq d'outre-mer.",
    ["Mayotte", "2011", "département", "outre-mer", "101"], "Société"),
  event("ft-2013", 2013, "2013", "cinquieme", "Le mariage pour tous",
    "Le mariage est ouvert aux couples de même sexe.",
    "La loi de 2013 ouvre le mariage et l'adoption aux couples de personnes de même sexe. Le PACS, ouvert à tous les couples, existait depuis 1999.",
    ["2013", "mariage pour tous", "PACS", "égalité"], "Société"),
  event("ft-brexit", 2020, "2020", "cinquieme", "Le Royaume-Uni quitte l'Union européenne",
    "L'Union passe de vingt-huit à vingt-sept États.",
    "Le Royaume-Uni sort de l'Union européenne en 2020, seul État à l'avoir fait. Au 1er janvier 2025, l'Union compte vingt-sept États membres.",
    ["Brexit", "2020", "Royaume-Uni", "Union européenne", "27"], "Politique"),
  event("ft-2024-ivg", 2024, "2024", "cinquieme", "L'IVG inscrite dans la Constitution",
    "La liberté d'y recourir devient constitutionnelle.",
    "En 2024, le Congrès réuni à Versailles inscrit dans la Constitution la liberté garantie à la femme d'avoir recours à l'interruption volontaire de grossesse. La France est le premier pays à l'avoir fait.",
    ["2024", "IVG", "Constitution", "Congrès", "Versailles"], "Politique"),
  event("ft-examen-civique", 2026, "1er janvier 2026", "cinquieme", "L'examen civique devient obligatoire",
    "Quarante questions pour être naturalisé.",
    "Depuis le 1er janvier 2026, l'attestation de réussite à l'examen civique est exigée pour toute demande de naturalisation ou de réintégration dans la nationalité française. L'examen compte 40 questions en 45 minutes, et il faut 32 bonnes réponses pour le réussir.",
    ["examen civique", "2026", "naturalisation", "nationalité", "40 questions"], "Société"),
];

const sortYear = (entry: CountryTimelineEvent) => entry.endYear ?? entry.year;

/**
 * Chronologique, les périodes classées à leur fin.
 *
 * À année de tri égale, c'est l'année de début qui départage, pour qu'un
 * événement ponctuel précède une période qui se termine la même année.
 */
export function frTimelineSorted(): CountryTimelineEvent[] {
  return [...FR_TIMELINE].sort((a, b) => sortYear(a) - sortYear(b) || a.year - b.year);
}

export function frTimelineByEra(): { era: FrEra; label: string; events: CountryTimelineEvent[] }[] {
  const sorted = frTimelineSorted();
  return FR_ERA_ORDER.map((era) => ({
    era,
    label: FR_ERA_LABELS[era],
    events: sorted.filter((entry) => entry.era === era),
  })).filter((group) => group.events.length > 0);
}
