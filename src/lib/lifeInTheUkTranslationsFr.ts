/**
 * French for the Life in the UK course cards and headings.
 *
 * Keyed on the ENGLISH source text exactly as it appears in
 * lifeInTheUkCourse.ts. A missing key is not an error — the card simply shows
 * no translation and says so, which is why this can be filled in over time
 * rather than all at once. check-uk-translations fails on a key that matches
 * nothing in the course, because a typo there is silent otherwise.
 *
 * Names of institutions, laws and offices stay in English on purpose:
 * "House of Commons", "Magna Carta", "Royal Assent", "Bill of Rights". The
 * exam is sat in English and asks for those exact words — translating them
 * would teach the wrong answer. What gets translated is the explanation
 * around them. Place names follow the same rule: someone reading a road sign
 * in Britain needs "Edinburgh", not "Édimbourg", so the English form leads
 * and the French exonym is only used where French would never say anything
 * else — Londres, la Tamise, l'Écosse, le pays de Galles.
 */
export const LIFE_IN_THE_UK_FR: Record<string, string> = {
  // ── Lesson titles and chapter headings ──────────────────────────────────
  "Values and principles": "Valeurs et principes",
  "What is the UK?": "Qu'est-ce que le Royaume-Uni ?",
  "A long and illustrious history": "Une longue et illustre histoire",
  "Government, the law and your role": "L'État, la loi et votre rôle",
  "A modern, thriving society": "Une société moderne et dynamique",
  "British Values & Principles": "Valeurs et principes britanniques",
  "The UK & Geography": "Le Royaume-Uni et sa géographie",
  "National Identity & Symbols": "Identité nationale et symboles",
  "Early British History": "Les débuts de l'histoire britannique",
  "Medieval Britain": "La Bretagne médiévale",
  "The Tudors": "Les Tudors",
  "Stuarts & Civil War": "Les Stuarts et la guerre civile",
  "Britain 1700–1900": "La Grande-Bretagne de 1700 à 1900",
  "Britain 1900–Present": "La Grande-Bretagne de 1900 à nos jours",
  "Important Dates & Timeline": "Dates clés et chronologie",
  "The Monarchy": "La monarchie",
  "Government & Parliament": "Gouvernement et Parlement",
  // "Devolution" has no single French word; the short explanation is what
  // French needs anyway, and the English term stays because the exam uses it.
  "Devolution": "Devolution — le transfert de pouvoirs aux nations du Royaume-Uni",
  "Law & Justice": "Droit et justice",
  "Rights & Responsibilities": "Droits et devoirs",
  "British Society & Culture": "Société et culture britanniques",
  "Religion & Beliefs": "Religions et croyances",
  "British Traditions & Celebrations": "Traditions et fêtes britanniques",
  "Sports & Leisure": "Sports et loisirs",
  "Literature, Art & Music": "Littérature, art et musique",
  "Science & Inventions": "Sciences et inventions",
  "Famous British People": "Britanniques célèbres",
  "Education & Healthcare": "Éducation et santé",

  // ── The tagline under the course name ───────────────────────────────────
  "History, government and traditions — how life in the UK works.":
    "Histoire, institutions et traditions — comment fonctionne la vie au Royaume-Uni.",

  // ── British values ──────────────────────────────────────────────────────
  "The fundamental principles": "Les principes fondamentaux",
  "Equality: the nine protected characteristics": "Égalité : les neuf critères protégés",
  "Rights and responsibilities": "Droits et devoirs",
  "Democracy": "Démocratie",
  "Government by the people, through representatives you elect and can vote out.":
    "Le gouvernement par le peuple, à travers des représentants que vous élisez et que vous pouvez renvoyer.",
  "The rule of law": "L'État de droit",
  "Everyone is subject to the law — including ministers, the police and the government itself.":
    "Tout le monde est soumis à la loi — y compris les ministres, la police et le gouvernement lui-même.",
  "Individual liberty": "La liberté individuelle",
  "Freedom to live as you choose, within the law.":
    "La liberté de vivre comme on l'entend, dans le respect de la loi.",
  "Equality": "Égalité",
  "No one may be treated less favourably because of who they are. The Equality Act 2010 makes this law.":
    "Personne ne peut être moins bien traité en raison de ce qu'il est. L'Equality Act 2010 en fait une obligation légale.",
  "Tolerance": "Tolérance",
  "Respect for those of different faiths and beliefs, and of none.":
    "Le respect de ceux qui ont d'autres religions et convictions, et de ceux qui n'en ont aucune.",
  "Respect": "Respect",
  "For other people, for their property, and for the environment you share.":
    "Envers les autres, leurs biens et l'environnement que vous partagez.",
  "Participation": "Participation",
  "Taking part in community life — voting, volunteering, jury service.":
    "Prendre part à la vie collective — voter, être bénévole, siéger comme juré.",
  "Your rights": "Vos droits",
  "Freedom of speech and of the press. Freedom of religion and belief. Freedom from unfair discrimination. A fair trial. A vote in a free election.":
    "La liberté d'expression et de la presse. La liberté de religion et de conviction. La protection contre la discrimination. Un procès équitable. Le droit de vote lors d'élections libres.",
  "Your responsibilities": "Vos devoirs",
  "Obey the law. Pay tax and National Insurance. Serve on a jury when called. Respect the rights of others. Look after the area you live in.":
    "Respecter la loi. Payer l'impôt et la National Insurance. Siéger comme juré lorsqu'on est convoqué. Respecter les droits d'autrui. Prendre soin du quartier où l'on vit.",

  // ── Geography ───────────────────────────────────────────────────────────
  "The four nations and their capitals": "Les quatre nations et leurs capitales",
  "Other important cities": "Autres villes importantes",
  "Regions and counties": "Régions et comtés",
  "Rivers": "Fleuves et rivières",
  "Mountains and high ground": "Montagnes et reliefs",
  "Lakes and lochs": "Lacs et lochs",
  "Islands and surrounding seas": "Îles et mers environnantes",
  "National Parks and famous places": "Parcs nationaux et lieux célèbres",
  "Languages": "Langues",
  "England — London": "Angleterre — Londres",
  "Also the capital of the UK as a whole, and the seat of the UK Parliament. By far the largest nation by population.":
    "Également capitale de l'ensemble du Royaume-Uni et siège du UK Parliament. De loin la nation la plus peuplée.",
  "Scotland — Edinburgh": "Écosse — Edinburgh",
  "Home of the Scottish Parliament, at Holyrood. Glasgow is Scotland's largest city.":
    "Siège du Scottish Parliament, à Holyrood. Glasgow est la plus grande ville d'Écosse.",
  "Wales — Cardiff": "Pays de Galles — Cardiff",
  "Home of the Welsh Parliament, the Senedd. Swansea and Newport are the other large cities.":
    "Siège du parlement gallois, le Senedd. Swansea et Newport sont les autres grandes villes.",
  "Northern Ireland — Belfast": "Irlande du Nord — Belfast",
  "Home of the Northern Ireland Assembly, at Stormont. Londonderry/Derry is the second city.":
    "Siège de la Northern Ireland Assembly, à Stormont. Londonderry/Derry est la deuxième ville.",
  "England": "Angleterre",
  "Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle upon Tyne, Oxford and Cambridge.":
    "Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle upon Tyne, Oxford et Cambridge.",
  "Scotland": "Écosse",
  "Glasgow (the largest), Aberdeen, Dundee, Inverness and Stirling.":
    "Glasgow (la plus grande), Aberdeen, Dundee, Inverness et Stirling.",
  "Wales": "Pays de Galles",
  "Swansea, Newport, Bangor, and St Davids — the smallest city in Britain.":
    "Swansea, Newport, Bangor et St Davids — la plus petite ville de Grande-Bretagne.",
  "Northern Ireland": "Irlande du Nord",
  "Londonderry/Derry, Lisburn, Newry and Armagh.": "Londonderry/Derry, Lisburn, Newry et Armagh.",
  "Severn": "La Severn",
  "The longest river in the UK, at about 220 miles. It rises in Wales and reaches the sea through the Bristol Channel.":
    "Le plus long cours d'eau du Royaume-Uni, environ 220 miles. Il prend sa source au pays de Galles et rejoint la mer par le Bristol Channel.",
  "Thames": "La Tamise",
  "Flows through Oxford, Reading and London. The second longest, and the most famous.":
    "Traverse Oxford, Reading et Londres. Deuxième par la longueur, et la plus célèbre.",
  "Trent, Mersey, Tyne": "Trent, Mersey, Tyne",
  "Major English rivers — the Mersey at Liverpool, the Tyne at Newcastle upon Tyne.":
    "Principales rivières anglaises — la Mersey à Liverpool, la Tyne à Newcastle upon Tyne.",
  "Clyde, Tay and Bann": "Clyde, Tay et Bann",
  "The Clyde flows through Glasgow; the Tay is Scotland's longest. In Northern Ireland the Bann is the principal river.":
    "La Clyde traverse Glasgow ; la Tay est la plus longue d'Écosse. En Irlande du Nord, la Bann est la rivière principale.",
  "Ben Nevis — 1,345 m": "Ben Nevis — 1 345 m",
  "In the Scottish Highlands. The highest mountain in Scotland and in the whole UK.":
    "Dans les Scottish Highlands. Le plus haut sommet d'Écosse et de tout le Royaume-Uni.",
  "Snowdon (Yr Wyddfa) — 1,085 m": "Snowdon (Yr Wyddfa) — 1 085 m",
  "In Snowdonia (Eryri). The highest mountain in Wales.":
    "Dans le Snowdonia (Eryri). Le plus haut sommet du pays de Galles.",
  "Scafell Pike — 978 m": "Scafell Pike — 978 m",
  "In the Lake District. The highest mountain in England.":
    "Dans le Lake District. Le plus haut sommet d'Angleterre.",
  "Slieve Donard — 850 m": "Slieve Donard — 850 m",
  "In the Mourne Mountains. The highest in Northern Ireland.":
    "Dans les Mourne Mountains. Le plus haut d'Irlande du Nord.",
  "Islands": "Îles",
  "The Isle of Wight, the Isles of Scilly, Anglesey, the Hebrides, Orkney and Shetland.":
    "L'Isle of Wight, les Isles of Scilly, Anglesey, les Hébrides, les Orcades et les Shetland.",
  "Not UK islands": "Îles qui n'appartiennent pas au Royaume-Uni",
  "The Isle of Man and the Channel Islands are Crown Dependencies — self-governing and linked to the Crown, not part of the UK.":
    "L'Isle of Man et les Channel Islands sont des Crown Dependencies — elles s'administrent elles-mêmes et sont liées à la Couronne, sans faire partie du Royaume-Uni.",
  "Seas": "Mers",
  "The North Sea to the east, the English Channel to the south, the Irish Sea to the west, and the Atlantic Ocean to the north and west.":
    "La mer du Nord à l'est, la Manche au sud, la mer d'Irlande à l'ouest, et l'océan Atlantique au nord et à l'ouest.",
  "The Channel Tunnel": "Le tunnel sous la Manche",
  "Opened in 1994, linking Folkestone in England with Coquelles in France — the UK's only fixed land link to the continent.":
    "Ouvert en 1994, il relie Folkestone en Angleterre à Coquelles en France — la seule liaison terrestre fixe du Royaume-Uni avec le continent.",

  // ── National identity and symbols ───────────────────────────────────────
  "The Union Flag": "L'Union Flag",
  "The four national flags": "Les quatre drapeaux nationaux",
  "Patron saints and their days": "Les saints patrons et leurs fêtes",
  "National flowers and plants": "Fleurs et plantes nationales",
  "Other national symbols": "Autres symboles nationaux",
  "National anthem": "Hymne national",
  "St George's Cross — a red cross on a white background.":
    "St George's Cross — une croix rouge sur fond blanc.",
  "The Saltire — a white diagonal cross on a blue background.":
    "The Saltire — une croix diagonale blanche sur fond bleu.",
  "Y Ddraig Goch, the Red Dragon, on a green and white field.":
    "Y Ddraig Goch, le Dragon rouge, sur un champ vert et blanc.",
  "St Patrick's Cross — a red diagonal cross on white — is the element carried into the Union Flag.":
    "St Patrick's Cross — une croix diagonale rouge sur fond blanc — est l'élément repris dans l'Union Flag.",
  "St David — 1 March": "St David — 1er mars",
  "Wales. Dewi Sant in Welsh.": "Pays de Galles. Dewi Sant en gallois.",
  "St Patrick — 17 March": "St Patrick — 17 mars",
  "Northern Ireland. A bank holiday there.": "Irlande du Nord. Jour férié là-bas.",
  "St George — 23 April": "St George — 23 avril",
  "St Andrew — 30 November": "St Andrew — 30 novembre",
  "Scotland. St Andrew's Day is a bank holiday in Scotland.":
    "Écosse. La St Andrew's Day est un jour férié en Écosse.",
  "England — the Rose": "Angleterre — la rose",
  "The Tudor rose, red and white, dating from the end of the Wars of the Roses.":
    "La rose Tudor, rouge et blanche, née à la fin de la guerre des Deux-Roses.",
  "Scotland — the Thistle": "Écosse — le chardon",
  "A spiny purple flower, Scotland's emblem for centuries.":
    "Une fleur épineuse et violette, emblème de l'Écosse depuis des siècles.",
  "Wales — the Daffodil": "Pays de Galles — la jonquille",
  "Worn on St David's Day. The leek is also a Welsh emblem.":
    "Portée le jour de la St David. Le poireau est aussi un emblème gallois.",
  "Northern Ireland — the Shamrock": "Irlande du Nord — le trèfle",
  "The three-leaved clover, associated with St Patrick.":
    "Le trèfle à trois feuilles, associé à saint Patrick.",

  // ── Early history ───────────────────────────────────────────────────────
  "Stone Age, Bronze Age and Iron Age": "Âge de pierre, âge du bronze et âge du fer",
  "The Romans": "Les Romains",
  "The Anglo-Saxons": "Les Anglo-Saxons",
  "The Vikings and the Danelaw": "Les Vikings et le Danelaw",
  "The Norman Conquest": "La conquête normande",
  "Stone Age": "Âge de pierre",
  "Hunter-gatherers first, then the first farmers around 6,000 years ago. They built **Stonehenge** and the tombs at **Skara Brae** in Orkney.":
    "D'abord des chasseurs-cueilleurs, puis les premiers agriculteurs il y a environ 6 000 ans. Ils ont bâti **Stonehenge** et les tombes de **Skara Brae** dans les Orcades.",
  "Bronze Age": "Âge du bronze",
  "From about 4,000 years ago. People learned to make bronze, lived in roundhouses and buried their dead in barrows.":
    "Il y a environ 4 000 ans. On apprend à travailler le bronze, on vit dans des maisons rondes et on enterre les morts sous des tumulus.",
  "Iron Age": "Âge du fer",
  "Iron tools and weapons, hill forts such as **Maiden Castle**, and the first British coins. The people are known as the **Celts**.":
    "Outils et armes en fer, forteresses de hauteur comme **Maiden Castle**, et les premières monnaies britanniques. Ce peuple est appelé les **Celtes**.",

  // ── Medieval Britain ────────────────────────────────────────────────────
  "The Normans": "Les Normands",
  "Magna Carta": "Magna Carta",
  "Wales and Scotland": "Le pays de Galles et l'Écosse",
  "The Hundred Years War": "La guerre de Cent Ans",
  "The Black Death and the Peasants Revolt": "La peste noire et la révolte des paysans",
  "The Wars of the Roses": "La guerre des Deux-Roses",
  "William the Conqueror": "Guillaume le Conquérant",
  "Won the **Battle of Hastings** in **1066** and became William I. Built castles across England, including the Tower of London.":
    "Vainqueur de la **Battle of Hastings** en **1066**, il devient Guillaume Ier. Il fait construire des châteaux dans toute l'Angleterre, dont la Tower of London.",
  "The Domesday Book": "Le Domesday Book",
  "Ordered by William in **1086** — a survey of who owned what land, and what it was worth, across England.":
    "Ordonné par Guillaume en **1086** — un recensement de qui possède quelles terres, et de leur valeur, dans toute l'Angleterre.",
  "The feudal system": "Le système féodal",
  "The king owned all land and granted it to nobles in return for service; peasants worked it in return for protection.":
    "Le roi possédait toute la terre et la concédait aux nobles en échange de services ; les paysans la cultivaient en échange de protection.",
  "William Wallace": "William Wallace",
  "Led Scottish resistance to Edward I. Captured and executed in 1305, and remembered as a national hero.":
    "Il mena la résistance écossaise contre Édouard Ier. Capturé et exécuté en 1305, il reste un héros national.",
  "Robert the Bruce": "Robert Bruce",
  "Crowned King of Scots, he defeated the English at the **Battle of Bannockburn in 1314**, securing Scottish independence.":
    "Couronné roi des Écossais, il bat les Anglais à la **Battle of Bannockburn en 1314** et assure l'indépendance de l'Écosse.",
  "The result": "Le résultat",
  "Scotland stayed a separate kingdom for nearly 400 more years, until the Act of Union of 1707.":
    "L'Écosse resta un royaume distinct pendant près de 400 ans encore, jusqu'à l'Act of Union de 1707.",

  // ── The Tudors ──────────────────────────────────────────────────────────
  "Henry VII and Henry VIII": "Henri VII et Henri VIII",
  "The Reformation": "La Réforme",
  "Edward VI, Mary I and Elizabeth I": "Édouard VI, Marie Ire et Élisabeth Ire",
  "The Spanish Armada": "L'Invincible Armada",
  "Shakespeare": "Shakespeare",
  "Catherine of Aragon": "Catherine d'Aragon",
  "Divorced. Mother of Mary I. The refusal of the Pope to annul this marriage triggered the Reformation in England.":
    "Répudiée. Mère de Marie Ire. Le refus du pape d'annuler ce mariage déclencha la Réforme en Angleterre.",
  "Anne Boleyn": "Anne Boleyn",
  "Beheaded. Mother of Elizabeth I.": "Décapitée. Mère d'Élisabeth Ire.",
  "Jane Seymour": "Jane Seymour",
  "Died — shortly after giving birth to Edward VI, Henry's only surviving son.":
    "Morte — peu après avoir donné naissance à Édouard VI, le seul fils survivant d'Henri.",
  "Anne of Cleves": "Anne de Clèves",
  "Divorced. A political match that Henry disliked on sight.":
    "Répudiée. Un mariage politique qu'Henri détesta au premier regard.",
  "Catherine Howard": "Catherine Howard",
  "Beheaded.": "Décapitée.",
  "Catherine Parr": "Catherine Parr",
  "Survived him, and outlived Henry by a year.": "Elle lui survécut — d'un an.",
  "Edward VI": "Édouard VI",
  "Henry's young son. Strongly Protestant — the Book of Common Prayer dates from his reign. He died at 15.":
    "Le jeune fils d'Henri. Fervent protestant — le Book of Common Prayer date de son règne. Il mourut à 15 ans.",
  "Mary I": "Marie Ire",
  "A devout Catholic who reversed the Reformation and had Protestants executed, earning the name Bloody Mary.":
    "Catholique fervente, elle revint sur la Réforme et fit exécuter des protestants, ce qui lui valut le nom de Bloody Mary.",
  "Elizabeth I": "Élisabeth Ire",
  "Protestant, and reigned 45 years. She found a middle way in religion that largely held, and never married.":
    "Protestante, elle régna 45 ans. Elle trouva en matière religieuse une voie moyenne qui tint largement, et ne se maria jamais.",

  // ── Stuarts and the Civil War ───────────────────────────────────────────
  "James I and the Gunpowder Plot": "Jacques Ier et la conspiration des Poudres",
  "Charles I and the English Civil War": "Charles Ier et la guerre civile anglaise",
  "Cromwell and the Commonwealth": "Cromwell et le Commonwealth",
  "The Restoration": "La Restauration",
  "The Glorious Revolution and the Bill of Rights": "La Glorieuse Révolution et le Bill of Rights",
  "Cavaliers": "Cavaliers",
  "Supporters of the King. Also called Royalists.":
    "Les partisans du roi. Appelés aussi royalistes.",
  "Roundheads": "Roundheads",
  "Supporters of Parliament, named for their short haircuts. Also called Parliamentarians.":
    "Les partisans du Parlement, ainsi nommés pour leurs cheveux courts. Appelés aussi parlementaires.",
  "The outcome": "L'issue",
  "Parliament won. Charles I was tried and **executed in 1649** — the only English king ever put to death by his own subjects.":
    "Le Parlement l'emporta. Charles Ier fut jugé et **exécuté en 1649** — le seul roi d'Angleterre mis à mort par ses propres sujets.",

  // ── Britain 1700–1900 ───────────────────────────────────────────────────
  "The Act of Union and the Jacobites": "L'Act of Union et les jacobites",
  "The Industrial Revolution": "La révolution industrielle",
  "Empire, slavery and abolition": "Empire, esclavage et abolition",
  "Wars and revolutions": "Guerres et révolutions",
  "Victorian Britain": "La Grande-Bretagne victorienne",
  "Reform and reformers": "Réformes et réformateurs",
  "The steam engine": "La machine à vapeur",
  "**James Watt** improved it decisively. Steam powered factories, mines, ships and trains.":
    "**James Watt** l'améliora de façon décisive. La vapeur fit tourner usines, mines, navires et trains.",
  "Railways": "Les chemins de fer",
  "**George Stephenson** built the Rocket. Britain built the first passenger railways, and the network transformed travel and trade.":
    "**George Stephenson** construisit la Rocket. La Grande-Bretagne bâtit les premières lignes de voyageurs, et le réseau transforma les déplacements et le commerce.",
  "Factories": "Les usines",
  "Textiles led the way. Conditions were harsh, and child labour was common until reforming laws restricted it.":
    "Le textile ouvrit la voie. Les conditions étaient dures et le travail des enfants courant, jusqu'à ce que des lois le limitent.",
  "Engineering": "L'ingénierie",
  "**Isambard Kingdom Brunel** built the Great Western Railway, bridges, tunnels and steamships — the most famous engineer of the age.":
    "**Isambard Kingdom Brunel** construisit le Great Western Railway, des ponts, des tunnels et des navires à vapeur — l'ingénieur le plus célèbre de son temps.",
  "American Revolution": "La révolution américaine",
  "The thirteen American colonies declared independence in **1776** and won it. Britain lost its most valuable settler colonies.":
    "Les treize colonies américaines déclarèrent leur indépendance en **1776** et l'obtinrent. La Grande-Bretagne perdit ses colonies de peuplement les plus précieuses.",
  "Napoleonic Wars": "Les guerres napoléoniennes",
  "Britain fought France under Napoleon for over twenty years.":
    "La Grande-Bretagne combattit la France de Napoléon pendant plus de vingt ans.",
  "Trafalgar, 1805": "Trafalgar, 1805",
  "**Admiral Nelson** destroyed the French and Spanish fleets at sea and was killed in the battle. Nelson's Column stands in Trafalgar Square.":
    "**L'amiral Nelson** détruisit les flottes française et espagnole en mer et fut tué au combat. La Nelson's Column se dresse à Trafalgar Square.",
  "Waterloo, 1815": "Waterloo, 1815",
  "The **Duke of Wellington** finally defeated Napoleon on land, ending the wars.":
    "Le **Duke of Wellington** battit enfin Napoléon sur terre, mettant fin aux guerres.",
  "Florence Nightingale": "Florence Nightingale",
  "Founded modern nursing during the Crimean War and set up the first nursing school, at St Thomas' Hospital in London.":
    "Elle fonda les soins infirmiers modernes pendant la guerre de Crimée et créa la première école d'infirmières, au St Thomas' Hospital de Londres.",
  "Charles Darwin": "Charles Darwin",
  "Published *On the Origin of Species* in 1859, setting out evolution by natural selection.":
    "Il publia *On the Origin of Species* en 1859, exposant l'évolution par sélection naturelle.",
  "Charles Dickens": "Charles Dickens",
  "Novelist whose books — *Oliver Twist*, *Great Expectations* — exposed the poverty of industrial Britain.":
    "Romancier dont les livres — *Oliver Twist*, *Great Expectations* — révélèrent la misère de la Grande-Bretagne industrielle.",
  "Emmeline Pankhurst": "Emmeline Pankhurst",
  "Later in the century she began organising the campaign that became the suffragette movement.":
    "Plus tard dans le siècle, elle commença à organiser la campagne qui devint le mouvement des suffragettes.",

  // ── Britain 1900 to today ───────────────────────────────────────────────
  "The First World War": "La Première Guerre mondiale",
  "Votes for women": "Le droit de vote des femmes",
  "The Second World War": "La Seconde Guerre mondiale",
  "The Welfare State and the NHS": "L'État-providence et le NHS",
  "Empire to Commonwealth": "De l'Empire au Commonwealth",
  "Immigration and modern Britain": "L'immigration et la Grande-Bretagne d'aujourd'hui",
  "Europe and Brexit": "L'Europe et le Brexit",
  "Dunkirk, 1940": "Dunkerque, 1940",
  "British and Allied troops were evacuated from France by warships and hundreds of small civilian boats.":
    "Les troupes britanniques et alliées furent évacuées de France par des navires de guerre et des centaines de petits bateaux civils.",
  "The Battle of Britain, 1940": "La bataille d'Angleterre, 1940",
  "The RAF held off the German air force, preventing invasion. Churchill: never was so much owed by so many to so few.":
    "La RAF tint tête à l'aviation allemande et empêcha l'invasion. Churchill dira que jamais tant de gens n'ont dû autant à si peu.",
  "The Blitz": "Le Blitz",
  "German bombing of London and other cities — Coventry, Liverpool, Glasgow, Belfast — night after night.":
    "Les bombardements allemands sur Londres et d'autres villes — Coventry, Liverpool, Glasgow, Belfast — nuit après nuit.",
  "D-Day, 6 June 1944": "Le Jour J, 6 juin 1944",
  "Allied forces landed in Normandy, opening the campaign that liberated western Europe.":
    "Les forces alliées débarquèrent en Normandie, ouvrant la campagne qui libéra l'Europe de l'Ouest.",

  // ── The timeline ────────────────────────────────────────────────────────
  "Before the Norman Conquest": "Avant la conquête normande",
  "1066 to 1500": "De 1066 à 1500",
  "The Tudors and Stuarts": "Les Tudors et les Stuarts",
  "1700 to 1900": "De 1700 à 1900",
  "1900 to today": "De 1900 à nos jours",
  "c. 6000 BC": "vers 6000 av. J.-C.",
  "Britain is cut off from the continent as the land bridge floods.":
    "La Bretagne est coupée du continent lorsque le pont terrestre est submergé.",
  "c. 2500 BC": "vers 2500 av. J.-C.",
  "Stonehenge is built. Skara Brae in Orkney is occupied.":
    "Stonehenge est bâti. Skara Brae, dans les Orcades, est habité.",
  "55 BC": "55 av. J.-C.",
  "Julius Caesar's expedition — and it fails.":
    "L'expédition de Jules César — et son échec.",
  "AD 43": "43 apr. J.-C.",
  "Claudius invades. The Roman conquest of Britain begins.":
    "Claude envahit l'île. La conquête romaine de la Bretagne commence.",
  "AD 122": "122 apr. J.-C.",
  "Hadrian's Wall is begun across northern England.":
    "Le chantier du Hadrian's Wall commence dans le nord de l'Angleterre.",
  "AD 410": "410 apr. J.-C.",
  "The Romans leave Britain.": "Les Romains quittent la Bretagne.",
  "AD 789": "789 apr. J.-C.",
  "The first Viking raids.": "Les premiers raids vikings.",
  "AD 878": "878 apr. J.-C.",
  "Alfred the Great defeats the Vikings; the Danelaw is agreed.":
    "Alfred le Grand bat les Vikings ; le Danelaw est établi.",
  "1066": "1066",
  "Battle of Hastings. William the Conqueror takes the throne.":
    "Battle of Hastings. Guillaume le Conquérant monte sur le trône.",
  "1086": "1086",
  "The Domesday Book.": "Le Domesday Book.",
  "1215": "1215",
  "Magna Carta — King John accepts that the king is bound by law.":
    "Magna Carta — le roi Jean admet que le roi est lié par la loi.",
  "1284": "1284",
  "The Statute of Rhuddlan annexes Wales to the English Crown.":
    "Le Statute of Rhuddlan rattache le pays de Galles à la Couronne anglaise.",
  "1314": "1314",
  "Robert the Bruce wins at Bannockburn.": "Robert Bruce l'emporte à Bannockburn.",
  "1337–1453": "1337–1453",
  "The Hundred Years War with France.": "La guerre de Cent Ans contre la France.",
  "1348": "1348",
  "The Black Death reaches Britain.": "La peste noire atteint la Grande-Bretagne.",
  "1381": "1381",
  "The Peasants Revolt.": "La révolte des paysans.",
  "1415": "1415",
  "Henry V wins at Agincourt.": "Henri V l'emporte à Azincourt.",
  "1485": "1485",
  "Battle of Bosworth Field ends the Wars of the Roses. The Tudors begin.":
    "La Battle of Bosworth Field met fin à la guerre des Deux-Roses. Les Tudors commencent.",
  "1534": "1534",
  "Henry VIII breaks with Rome and becomes Head of the Church of England.":
    "Henri VIII rompt avec Rome et devient chef de la Church of England.",
  "1588": "1588",
  "The Spanish Armada is defeated.": "L'Invincible Armada est vaincue.",
  "1603": "1603",
  "James VI of Scotland becomes James I of England.":
    "Jacques VI d'Écosse devient Jacques Ier d'Angleterre.",
  "1605": "1605",
  "The Gunpowder Plot fails — remembered every 5 November.":
    "La conspiration des Poudres échoue — commémorée chaque 5 novembre.",
  "1642–1651": "1642–1651",
  "The English Civil War.": "La guerre civile anglaise.",
  "1649": "1649",
  "Charles I is executed. The Commonwealth begins under Cromwell.":
    "Charles Ier est exécuté. Le Commonwealth commence sous Cromwell.",
  "1660": "1660",
  "The Restoration — Charles II returns.": "La Restauration — retour de Charles II.",
  "1666": "1666",
  "The Great Fire of London.": "Le grand incendie de Londres.",
  "1688": "1688",
  "The Glorious Revolution. William and Mary take the throne.":
    "La Glorieuse Révolution. Guillaume et Marie montent sur le trône.",
  "1689": "1689",
  "The Bill of Rights makes the monarchy constitutional.":
    "Le Bill of Rights fait de la monarchie une monarchie constitutionnelle.",
  "1707": "1707",
  "The Act of Union joins England and Scotland as Great Britain.":
    "L'Act of Union réunit l'Angleterre et l'Écosse sous le nom de Great Britain.",
  "1746": "1746",
  "Battle of Culloden — the last battle fought on British soil.":
    "Battle of Culloden — la dernière bataille livrée sur le sol britannique.",
  "1776": "1776",
  "The American colonies declare independence.":
    "Les colonies américaines déclarent leur indépendance.",
  "1801": "1801",
  "The Act of Union with Ireland creates the United Kingdom.":
    "L'Act of Union avec l'Irlande crée le United Kingdom.",
  "1805": "1805",
  "Nelson wins at Trafalgar.": "Nelson l'emporte à Trafalgar.",
  "1807": "1807",
  "The slave trade is abolished.": "La traite des esclaves est abolie.",
  "1815": "1815",
  "Wellington defeats Napoleon at Waterloo.":
    "Wellington bat Napoléon à Waterloo.",
  "1832": "1832",
  "The Reform Act begins widening the vote.":
    "Le Reform Act commence à élargir le droit de vote.",
  "1833": "1833",
  "Slavery itself is abolished across the Empire.":
    "L'esclavage lui-même est aboli dans tout l'Empire.",
  "1837–1901": "1837–1901",
  "The reign of Queen Victoria.": "Le règne de la reine Victoria.",
  "1851": "1851",
  "The Great Exhibition.": "La Great Exhibition.",
  "1859": "1859",
  "Darwin publishes On the Origin of Species.":
    "Darwin publie On the Origin of Species.",
  "1914–1918": "1914–1918",
  "The First World War. It ends on 11 November 1918.":
    "La Première Guerre mondiale. Elle s'achève le 11 novembre 1918.",
  "1918": "1918",
  "Women over 30 with property win the vote.":
    "Les femmes de plus de 30 ans possédant des biens obtiennent le droit de vote.",
  "1928": "1928",
  "Women win the vote on equal terms with men, at 21.":
    "Les femmes obtiennent le droit de vote aux mêmes conditions que les hommes, à 21 ans.",
  "1939–1945": "1939–1945",
  "The Second World War. VE Day is 8 May 1945.":
    "La Seconde Guerre mondiale. Le VE Day tombe le 8 mai 1945.",
  "1940": "1940",
  "The Battle of Britain and the Blitz. Churchill becomes Prime Minister.":
    "La bataille d'Angleterre et le Blitz. Churchill devient Premier ministre.",
  "1944": "1944",
  "D-Day, 6 June — the Normandy landings.": "Le Jour J, 6 juin — le débarquement de Normandie.",
  "1947": "1947",
  "India and Pakistan become independent.": "L'Inde et le Pakistan accèdent à l'indépendance.",
  "1948": "1948",
  "The NHS is founded. The Empire Windrush arrives.":
    "Le NHS est fondé. L'Empire Windrush accoste.",
  "1973": "1973",
  "The UK joins the European Economic Community.":
    "Le Royaume-Uni entre dans la Communauté économique européenne.",
  "1979": "1979",
  "Margaret Thatcher becomes the first woman Prime Minister.":
    "Margaret Thatcher devient la première femme Premier ministre.",
  "1998": "1998",
  "The Good Friday Agreement.": "Le Good Friday Agreement.",
  "1999": "1999",
  "The Scottish Parliament and Welsh Assembly open.":
    "Le Scottish Parliament et la Welsh Assembly ouvrent leurs portes.",
  "2012": "2012",
  "London hosts the Olympic Games.": "Londres accueille les Jeux olympiques.",
  "2016": "2016",
  "The referendum votes to leave the EU.":
    "Le référendum se prononce pour la sortie de l'UE.",
  "2020": "2020",
  "The UK formally leaves the EU on 31 January.":
    "Le Royaume-Uni quitte officiellement l'UE le 31 janvier.",
  "2022": "2022",
  "Queen Elizabeth II dies; King Charles III succeeds.":
    "La reine Élisabeth II meurt ; le roi Charles III lui succède.",

  // ── The monarchy ────────────────────────────────────────────────────────
  "What the monarch actually does": "Ce que fait réellement le monarque",
  "Succession and coronation": "Succession et couronnement",
  "The Royal Family": "La famille royale",
  "Monarchs worth knowing": "Les monarques à connaître",
  "Royal Assent": "Royal Assent",
  "Every Act of Parliament needs the monarch's signature to become law. It has not been refused since 1708 — it is a formality.":
    "Tout Act of Parliament a besoin de la signature du monarque pour devenir loi. Elle n'a plus été refusée depuis 1708 — c'est une formalité.",
  "State Opening of Parliament": "State Opening of Parliament",
  "The monarch opens each parliamentary year and reads a speech setting out the government's plans. The speech is written by the government, not the monarch.":
    "Le monarque ouvre chaque année parlementaire et lit un discours exposant les projets du gouvernement. Ce discours est écrit par le gouvernement, non par le monarque.",
  "Appointing the Prime Minister": "La nomination du Premier ministre",
  "The monarch invites the leader who can command a majority in the House of Commons to form a government.":
    "Le monarque invite à former un gouvernement le chef de parti capable de réunir une majorité à la House of Commons.",
  "Ceremonial and representative": "Rôle protocolaire et représentatif",
  "State visits, honours, and representing the UK abroad. Also Head of the Commonwealth.":
    "Visites d'État, distinctions honorifiques et représentation du Royaume-Uni à l'étranger. Également Head of the Commonwealth.",
  "William I": "Guillaume Ier",
  "1066 — the Norman Conquest.": "1066 — la conquête normande.",
  "Henry VIII": "Henri VIII",
  "Six wives, and the break with Rome.": "Six épouses, et la rupture avec Rome.",
  "45 years, the Armada, and the Elizabethan age.":
    "45 ans de règne, l'Armada et l'époque élisabéthaine.",
  "Charles I": "Charles Ier",
  "Executed in 1649 after the Civil War.": "Exécuté en 1649 après la guerre civile.",
  "Victoria": "Victoria",
  "1837–1901, the height of empire.": "1837–1901, l'apogée de l'Empire.",
  "Elizabeth II": "Élisabeth II",
  "1952–2022, the longest reign in British history.":
    "1952–2022, le plus long règne de l'histoire britannique.",

  // ── Government and Parliament ───────────────────────────────────────────
  "The two Houses": "Les deux chambres",
  "Government, Cabinet and Opposition": "Gouvernement, Cabinet et opposition",
  "Elections and voting": "Élections et vote",
  "How a law is made": "Comment se fait une loi",
  "Local government": "Les collectivités locales",
  "House of Commons": "House of Commons",
  "**650 elected MPs**, one for each constituency. This is the chamber that matters: it makes law, controls tax and spending, and the government must hold its confidence.":
    "**650 MPs élus**, un par circonscription. C'est la chambre qui compte : elle fait la loi, contrôle l'impôt et les dépenses, et le gouvernement doit conserver sa confiance.",
  "House of Lords": "House of Lords",
  "**Not elected.** Members are appointed — life peers, some hereditary peers, and senior bishops of the Church of England. It revises and scrutinises bills and can delay them, but cannot block the Commons indefinitely.":
    "**Non élue.** Ses membres sont nommés — pairs à vie, quelques pairs héréditaires et les principaux évêques de la Church of England. Elle révise et examine les projets de loi et peut les retarder, mais ne peut bloquer indéfiniment les Commons.",
  "The Prime Minister": "Le Premier ministre",
  "The leader of the party that can command a majority in the Commons. Lives and works at **10 Downing Street**.":
    "Le chef du parti capable de réunir une majorité aux Commons. Il vit et travaille au **10 Downing Street**.",
  "The Cabinet": "Le Cabinet",
  "About 20 senior ministers chosen by the PM, each running a department — Chancellor of the Exchequer, Home Secretary, Foreign Secretary and so on.":
    "Une vingtaine de ministres choisis par le Premier ministre, chacun à la tête d'un département — Chancellor of the Exchequer, Home Secretary, Foreign Secretary, et ainsi de suite.",
  "The Opposition": "L'opposition",
  "The largest party not in government. Its leader is **Leader of the Opposition** and heads a shadow cabinet that challenges each minister.":
    "Le plus grand parti hors du gouvernement. Son chef est **Leader of the Opposition** et dirige un cabinet fantôme qui met chaque ministre à l'épreuve.",
  "The Speaker": "Le Speaker",
  "Chairs debates in the Commons, keeps order and is politically neutral — the Speaker gives up party allegiance.":
    "Il préside les débats aux Commons, y fait régner l'ordre et reste politiquement neutre — le Speaker renonce à toute appartenance partisane.",
  "Who can vote": "Qui peut voter",
  "You must be **18 or over** and on the **electoral register**. British, Irish and qualifying Commonwealth citizens may vote in general elections.":
    "Il faut avoir **18 ans ou plus** et figurer sur l'**electoral register**. Les citoyens britanniques, irlandais et certains ressortissants du Commonwealth peuvent voter aux élections générales.",
  "How to vote": "Comment voter",
  "In person at a polling station, by post, or by proxy. Photo ID is now required at polling stations in Great Britain.":
    "En personne dans un bureau de vote, par correspondance ou par procuration. Une pièce d'identité avec photo est désormais exigée dans les bureaux de vote en Grande-Bretagne.",
  "By-elections": "Élections partielles",
  "Held in a single constituency when its MP dies or resigns between general elections.":
    "Organisées dans une seule circonscription lorsque son MP meurt ou démissionne entre deux élections générales.",
  "Political parties": "Les partis politiques",
  "The main UK-wide parties are Conservative, Labour and the Liberal Democrats. There are also national parties such as the SNP in Scotland and Plaid Cymru in Wales.":
    "Les principaux partis à l'échelle du Royaume-Uni sont les Conservative, le Labour et les Liberal Democrats. Il existe aussi des partis nationaux comme le SNP en Écosse et Plaid Cymru au pays de Galles.",

  // ── Devolution ──────────────────────────────────────────────────────────
  "The three devolved bodies": "Les trois assemblées dévolues",
  "What the devolved governments control": "Ce que gèrent les gouvernements dévolus",
  "What stays with the UK Parliament": "Ce qui reste au UK Parliament",
  "Scottish Parliament": "Scottish Parliament",
  "At **Holyrood** in Edinburgh. Members are **MSPs**. It has the widest powers of the three, including some power over income tax.":
    "À **Holyrood**, à Edinburgh. Ses membres sont les **MSPs**. Il détient les compétences les plus larges des trois, dont une part de pouvoir sur l'impôt sur le revenu.",
  "Senedd Cymru": "Senedd Cymru",
  "The **Welsh Parliament**, in Cardiff. Members are **MSs**. It was called the National Assembly for Wales until 2020.":
    "Le **parlement gallois**, à Cardiff. Ses membres sont les **MSs**. Il s'appelait National Assembly for Wales jusqu'en 2020.",
  "Northern Ireland Assembly": "Northern Ireland Assembly",
  "At **Stormont** in Belfast. Members are **MLAs**. Created by the **Good Friday Agreement of 1998**, and power is shared between communities.":
    "À **Stormont**, à Belfast. Ses membres sont les **MLAs**. Créée par le **Good Friday Agreement de 1998**, elle repose sur un partage du pouvoir entre les communautés.",

  // ── Law and justice ─────────────────────────────────────────────────────
  "Criminal law and civil law": "Droit pénal et droit civil",
  "The courts": "Les tribunaux",
  "Who is who": "Qui est qui",
  "Jury service": "Le service de juré",
  "Legal aid": "L'aide juridictionnelle",
  "Criminal law": "Le droit pénal",
  "Offences against society — theft, assault, dangerous driving. The state prosecutes, and the punishment can be a fine, community service or prison.":
    "Les infractions contre la société — vol, agression, conduite dangereuse. C'est l'État qui poursuit, et la peine peut être une amende, un travail d'intérêt général ou la prison.",
  "Civil law": "Le droit civil",
  "Disputes between people or organisations — debt, employment, housing, discrimination. The remedy is usually compensation or an order, not punishment.":
    "Les litiges entre personnes ou organisations — dettes, travail, logement, discrimination. La réponse est en général une indemnisation ou une injonction, non une peine.",
  "Magistrates' Court": "Magistrates' Court",
  "Handles most criminal cases in England, Wales and Northern Ireland. **Magistrates** are usually unpaid volunteers from the local community, not professional judges. In Scotland the equivalent is the Justice of the Peace Court.":
    "Elle traite la plupart des affaires pénales en Angleterre, au pays de Galles et en Irlande du Nord. Les **magistrates** sont généralement des bénévoles non rémunérés issus de la communauté locale, et non des juges professionnels. En Écosse, l'équivalent est la Justice of the Peace Court.",
  "Crown Court": "Crown Court",
  "Serious criminal cases, heard before a **judge and a jury of 12**. In Scotland serious cases go to the Sheriff Court or the High Court, where a jury has 15 members.":
    "Les affaires pénales graves, jugées devant un **juge et un jury de 12 personnes**. En Écosse, elles vont à la Sheriff Court ou à la High Court, où le jury compte 15 membres.",
  "County Court": "County Court",
  "Civil cases — debt, contracts, personal injury, family matters.":
    "Les affaires civiles — dettes, contrats, dommages corporels, affaires familiales.",
  "The Supreme Court": "The Supreme Court",
  "The highest court of appeal in the UK, sitting in London. It replaced the House of Lords in that role in 2009.":
    "La plus haute juridiction d'appel du Royaume-Uni, siégeant à Londres. Elle a remplacé la House of Lords dans ce rôle en 2009.",
  "Judges": "Les juges",
  "Independent of government. They interpret the law and make sure trials are fair. A government act found unlawful by a judge must be put right.":
    "Indépendants du gouvernement. Ils interprètent la loi et veillent à l'équité des procès. Un acte du gouvernement jugé illégal doit être corrigé.",
  "Solicitors": "Solicitors",
  "Give legal advice, prepare cases and represent clients, usually in the lower courts.":
    "Ils donnent des conseils juridiques, préparent les dossiers et représentent leurs clients, généralement devant les juridictions inférieures.",
  "Barristers": "Barristers",
  "Specialist advocates who argue cases in the higher courts.":
    "Des avocats spécialisés qui plaident devant les juridictions supérieures.",
  "The police": "La police",
  "Keep order, prevent and investigate crime. They must obey the law themselves, and complaints are investigated independently.":
    "Elle maintient l'ordre, prévient les infractions et enquête. Elle est elle-même soumise à la loi, et les plaintes font l'objet d'enquêtes indépendantes.",

  // ── Rights and responsibilities ─────────────────────────────────────────
  "Tax and National Insurance": "Impôts et National Insurance",
  "Taking part": "Participer",
  "The vote": "Le droit de vote",
  "At 18, in free elections, by secret ballot. Your vote cannot be seen or traced.":
    "À 18 ans, lors d'élections libres, à bulletin secret. Votre vote ne peut être vu ni retracé.",
  "Freedom of speech": "La liberté d'expression",
  "To say and publish what you think — subject to laws against incitement, hatred and defamation.":
    "Dire et publier ce que l'on pense — sous réserve des lois contre l'incitation, la haine et la diffamation.",
  "Freedom of religion": "La liberté de religion",
  "To follow any religion or none, to change religion, and to worship openly.":
    "Suivre n'importe quelle religion ou aucune, en changer et pratiquer ouvertement.",
  "Protection from discrimination on any of the nine protected characteristics.":
    "La protection contre la discrimination fondée sur l'un des neuf critères protégés.",
  "A fair trial": "Un procès équitable",
  "Presumed innocent until proven guilty, with legal representation and an independent judge.":
    "Présumé innocent jusqu'à preuve du contraire, avec un avocat et un juge indépendant.",
  "Human rights": "Les droits de l'homme",
  "Set out in the Human Rights Act 1998, which brought the European Convention on Human Rights into UK law.":
    "Énoncés dans le Human Rights Act 1998, qui a intégré la Convention européenne des droits de l'homme au droit britannique.",
  "Obey the law": "Respecter la loi",
  "All of it, including laws you disagree with. Change them by campaigning and voting, not by ignoring them.":
    "Toute la loi, y compris celle avec laquelle on n'est pas d'accord. On la change en militant et en votant, pas en l'ignorant.",
  "Pay tax": "Payer l'impôt",
  "**Income tax** and **National Insurance** on what you earn. NI pays towards the state pension and some benefits.":
    "L'**income tax** et la **National Insurance** sur ce que l'on gagne. La NI finance la retraite publique et certaines prestations.",
  "Attend when summoned, between 18 and 70.":
    "Se présenter lorsqu'on est convoqué, entre 18 et 70 ans.",
  "Respect others": "Respecter autrui",
  "Their rights, their property, and their freedom to live differently from you.":
    "Leurs droits, leurs biens et leur liberté de vivre autrement que vous.",
  "Look after your area": "Prendre soin de son quartier",
  "Recycle, do not litter, and take part in the community.":
    "Trier ses déchets, ne pas jeter de détritus et participer à la vie du quartier.",

  // ── Society and culture ─────────────────────────────────────────────────
  "Family life": "La vie de famille",
  "Marriage and civil partnership": "Mariage et civil partnership",
  "Community and volunteering": "Vie collective et bénévolat",
  "Everyday social values": "Les usages du quotidien",
  "Marriage": "Le mariage",
  "You must be **16 or over** (18 in England, Wales and Northern Ireland since 2023) and both people must consent freely.":
    "Il faut avoir **16 ans ou plus** (18 en Angleterre, au pays de Galles et en Irlande du Nord depuis 2023), et les deux personnes doivent consentir librement.",
  "Same-sex marriage": "Le mariage entre personnes de même sexe",
  "Legal in England, Wales and Scotland since 2014, and in Northern Ireland since 2020.":
    "Légal en Angleterre, au pays de Galles et en Écosse depuis 2014, et en Irlande du Nord depuis 2020.",
  "Civil partnership": "Civil partnership",
  "A legal alternative to marriage with similar rights, open to both same-sex and opposite-sex couples.":
    "Une alternative légale au mariage, aux droits comparables, ouverte aux couples de même sexe comme de sexe différent.",
  "Forced marriage": "Le mariage forcé",
  "A **criminal offence**. Marriage requires the free consent of both people — arranged is not the same as forced.":
    "Un **délit**. Le mariage exige le libre consentement des deux personnes — arrangé n'est pas la même chose que forcé.",

  // ── Religion and beliefs ────────────────────────────────────────────────
  "The established churches": "Les Églises d'État",
  "The main faiths practised in the UK": "Les principales religions pratiquées au Royaume-Uni",
  "Tolerance in practice": "La tolérance en pratique",
  "Church of England": "Church of England",
  "The **established church** in England. The monarch is its Supreme Governor and the **Archbishop of Canterbury** its senior bishop. Its bishops sit in the House of Lords. Known as the Anglican Church or, in the US, Episcopal.":
    "L'**Église d'État** en Angleterre. Le monarque en est le Supreme Governor et l'**Archbishop of Canterbury** son principal évêque. Ses évêques siègent à la House of Lords. On l'appelle l'Église anglicane, ou épiscopalienne aux États-Unis.",
  "Church of Scotland": "Church of Scotland",
  "The national church of Scotland, **Presbyterian** in form. It is not governed by the monarch and has no bishops in the Lords.":
    "L'Église nationale d'Écosse, de forme **presbytérienne**. Elle n'est pas dirigée par le monarque et n'a pas d'évêques aux Lords.",
  "Wales and Northern Ireland": "Le pays de Galles et l'Irlande du Nord",
  "There is **no established church** in Wales or Northern Ireland.":
    "Il n'y a **pas d'Église d'État** au pays de Galles ni en Irlande du Nord.",
  "Christianity": "Le christianisme",
  "The largest faith. Includes Anglican, Roman Catholic, Presbyterian, Methodist, Baptist and Orthodox traditions.":
    "La religion la plus répandue. Elle regroupe les traditions anglicane, catholique romaine, presbytérienne, méthodiste, baptiste et orthodoxe.",
  "Islam": "L'islam",
  "The second largest religion in the UK. Major festivals include Eid al-Fitr and Eid al-Adha.":
    "La deuxième religion du Royaume-Uni. Parmi les grandes fêtes, l'Aïd el-Fitr et l'Aïd el-Adha.",
  "Hinduism": "L'hindouisme",
  "Festivals include Diwali, the festival of lights.":
    "Parmi les fêtes, Diwali, la fête des lumières.",
  "Sikhism": "Le sikhisme",
  "Founded by Guru Nanak. Vaisakhi is its major festival.":
    "Fondé par Guru Nanak. Vaisakhi en est la grande fête.",
  "Judaism": "Le judaïsme",
  "A long-established community. Festivals include Hanukkah, Passover and Yom Kippur.":
    "Une communauté implantée de longue date. Parmi les fêtes, Hanoucca, la Pâque juive et Yom Kippour.",
  "Buddhism": "Le bouddhisme",
  "Practised across the UK, with Wesak among its main observances.":
    "Pratiqué dans tout le Royaume-Uni ; Wesak compte parmi ses principales célébrations.",

  // ── Traditions and celebrations ─────────────────────────────────────────
  "The Christian calendar": "Le calendrier chrétien",
  "Other dates in the year": "Autres dates de l'année",
  "The patron saints' days": "Les fêtes des saints patrons",
  "Bank holidays": "Bank holidays",
  "Christmas Day — 25 December": "Noël — 25 décembre",
  "A public holiday throughout the UK. Families exchange presents and eat a Christmas dinner, traditionally roast turkey.":
    "Jour férié dans tout le Royaume-Uni. Les familles s'offrent des cadeaux et partagent un repas de Noël, traditionnellement une dinde rôtie.",
  "Boxing Day — 26 December": "Boxing Day — 26 décembre",
  "A public holiday, the day after Christmas.": "Jour férié, le lendemain de Noël.",
  "Good Friday": "Le Vendredi saint",
  "A public holiday. The Friday before Easter, marking the crucifixion.":
    "Jour férié. Le vendredi précédant Pâques, en mémoire de la crucifixion.",
  "Easter Sunday and Easter Monday": "Dimanche et lundi de Pâques",
  "Easter Monday is a public holiday in most of the UK. The date moves each year — Easter falls in March or April.":
    "Le lundi de Pâques est férié dans la majeure partie du Royaume-Uni. La date change chaque année — Pâques tombe en mars ou en avril.",
  "Pancake Day": "Pancake Day",
  "Shrove Tuesday, the day before Lent begins. Not a public holiday, but pancakes are eaten across the country.":
    "Mardi gras, la veille du début du Carême. Ce n'est pas un jour férié, mais on mange des crêpes dans tout le pays.",
  "New Year's Day — 1 January": "Jour de l'An — 1er janvier",
  "A public holiday. In Scotland **Hogmanay** on 31 December is the bigger celebration, and 2 January is also a holiday there.":
    "Jour férié. En Écosse, **Hogmanay**, le 31 décembre, est la plus grande fête, et le 2 janvier y est aussi férié.",
  "Valentine's Day — 14 February": "Saint-Valentin — 14 février",
  "Cards and gifts between couples. Not a holiday.":
    "Cartes et cadeaux entre amoureux. Ce n'est pas un jour férié.",
  "Mothering Sunday and Father's Day": "Fête des mères et fête des pères",
  "Mothering Sunday falls in March, three weeks before Easter; Father's Day is the third Sunday in June.":
    "Le Mothering Sunday tombe en mars, trois semaines avant Pâques ; la fête des pères, le troisième dimanche de juin.",
  "Halloween — 31 October": "Halloween — 31 octobre",
  "An ancient festival, now marked with costumes, pumpkins and trick-or-treating.":
    "Une fête ancienne, célébrée aujourd'hui avec déguisements, citrouilles et tournées de bonbons.",
  "Bonfire Night — 5 November": "Bonfire Night — 5 novembre",
  "Bonfires and fireworks marking the failure of the **Gunpowder Plot of 1605**. Also called Guy Fawkes Night.":
    "Feux de joie et feux d'artifice pour l'échec de la **conspiration des Poudres de 1605**. Aussi appelée Guy Fawkes Night.",
  "Remembrance Day — 11 November": "Remembrance Day — 11 novembre",
  "Marks the end of the First World War in 1918. Poppies are worn and there is a two-minute silence at 11am.":
    "Commémore la fin de la Première Guerre mondiale en 1918. On porte un coquelicot et l'on observe deux minutes de silence à 11 heures.",

  // ── Sport and leisure ───────────────────────────────────────────────────
  "The major sports": "Les grands sports",
  "Other sports and events": "Autres sports et événements",
  "Leisure": "Les loisirs",
  "Football": "Le football",
  "The most popular sport. Each nation has its own team and league; the **FA Cup** is the oldest football competition in the world.":
    "Le sport le plus populaire. Chaque nation a son équipe et son championnat ; la **FA Cup** est la plus ancienne compétition de football au monde.",
  "Rugby": "Le rugby",
  "Two codes, **rugby union** and **rugby league**. The **Six Nations** is contested by England, Scotland, Wales, Ireland, France and Italy.":
    "Deux codes, le **rugby union** et le **rugby league**. Le **Six Nations** oppose l'Angleterre, l'Écosse, le pays de Galles, l'Irlande, la France et l'Italie.",
  "Cricket": "Le cricket",
  "Originated in England. **The Ashes** is the historic Test series between England and Australia. **Lord's** in London is the most famous ground.":
    "Né en Angleterre. **The Ashes** est la série historique de Tests entre l'Angleterre et l'Australie. **Lord's**, à Londres, est le terrain le plus célèbre.",
  "Tennis": "Le tennis",
  "**Wimbledon**, held in London every summer, is the oldest tennis tournament in the world and the only Grand Slam still played on grass.":
    "**Wimbledon**, disputé chaque été à Londres, est le plus ancien tournoi de tennis au monde et le seul Grand Chelem encore joué sur gazon.",
  "Golf": "Le golf",
  "Originated in **Scotland**. **St Andrews** is its historic home and the Open Championship is the oldest golf major.":
    "Né en **Écosse**. **St Andrews** en est le berceau historique et l'Open Championship est le plus ancien majeur.",
  "Horse racing": "Les courses hippiques",
  "Long royal associations. The **Grand National** at Aintree and **Royal Ascot** are the best-known meetings; the Derby at Epsom is the classic flat race.":
    "Un long lien avec la Couronne. Le **Grand National** à Aintree et **Royal Ascot** sont les réunions les plus connues ; le Derby d'Epsom est la course de plat classique.",
  "The Olympics": "Les Jeux olympiques",
  "London has hosted the summer Games **three times** — 1908, 1948 and **2012**. The 2012 Games also included the Paralympics, whose modern origins are British, at Stoke Mandeville.":
    "Londres a accueilli les Jeux d'été **trois fois** — 1908, 1948 et **2012**. Les Jeux de 2012 comprenaient aussi les Paralympiques, dont les origines modernes sont britanniques, à Stoke Mandeville.",
  "Commonwealth Games": "Commonwealth Games",
  "Held every four years between Commonwealth nations. Each UK nation competes separately, rather than as one British team.":
    "Organisés tous les quatre ans entre les pays du Commonwealth. Chaque nation du Royaume-Uni y concourt séparément, et non comme une seule équipe britannique.",

  // ── Literature, art and music ───────────────────────────────────────────
  "Writers": "Les écrivains",
  "Art and museums": "Art et musées",
  "Music": "La musique",
  "Geoffrey Chaucer": "Geoffrey Chaucer",
  "Wrote *The Canterbury Tales* in the fourteenth century — among the earliest great works in English.":
    "Il écrivit *The Canterbury Tales* au XIVe siècle — l'une des premières grandes œuvres en anglais.",
  "William Shakespeare": "William Shakespeare",
  "Born in Stratford-upon-Avon, 1564. Plays and sonnets; the Globe Theatre in London.":
    "Né à Stratford-upon-Avon en 1564. Pièces et sonnets ; le Globe Theatre à Londres.",
  "Jane Austen": "Jane Austen",
  "*Pride and Prejudice*, *Sense and Sensibility* — novels of English social life in the early nineteenth century.":
    "*Pride and Prejudice*, *Sense and Sensibility* — des romans sur la vie sociale anglaise du début du XIXe siècle.",
  "*Oliver Twist*, *A Christmas Carol*, *Great Expectations* — the poverty of Victorian Britain, read by everyone.":
    "*Oliver Twist*, *A Christmas Carol*, *Great Expectations* — la misère de la Grande-Bretagne victorienne, lue par tous.",
  "Robert Burns": "Robert Burns",
  "Scotland's national poet, known as the Bard. Wrote *Auld Lang Syne*, sung at New Year. **Burns Night** is 25 January.":
    "Le poète national de l'Écosse, surnommé the Bard. Il écrivit *Auld Lang Syne*, chanté au Nouvel An. La **Burns Night** tombe le 25 janvier.",
  "Others to know": "Autres noms à connaître",
  "The Brontë sisters, Thomas Hardy, Rudyard Kipling, Agatha Christie, J. R. R. Tolkien, George Orwell, Dylan Thomas and J. K. Rowling.":
    "Les sœurs Brontë, Thomas Hardy, Rudyard Kipling, Agatha Christie, J. R. R. Tolkien, George Orwell, Dylan Thomas et J. K. Rowling.",
  "Artists": "Les artistes",
  "**Thomas Gainsborough** and **John Constable** for portraits and landscape, **J. M. W. Turner** for light and sea, **Henry Moore** for sculpture, **David Hockney** among the living.":
    "**Thomas Gainsborough** et **John Constable** pour le portrait et le paysage, **J. M. W. Turner** pour la lumière et la mer, **Henry Moore** pour la sculpture, **David Hockney** parmi les vivants.",
  "National Gallery": "National Gallery",
  "In **Trafalgar Square**, London. Holds the national collection of paintings. Free to enter.":
    "À **Trafalgar Square**, à Londres. Elle abrite la collection nationale de peintures. Entrée libre.",
  "British Museum": "British Museum",
  "In London, founded 1753 — the first national public museum in the world. Free to enter.":
    "À Londres, fondé en 1753 — le premier musée public national au monde. Entrée libre.",
  "Others": "Autres",
  "Tate Britain and Tate Modern in London, the National Museum of Scotland in Edinburgh, and the Turner Prize for contemporary art.":
    "Tate Britain et Tate Modern à Londres, le National Museum of Scotland à Edinburgh, et le Turner Prize pour l'art contemporain.",

  // ── Science and inventions ──────────────────────────────────────────────
  "Scientists": "Les scientifiques",
  "Inventors and engineers": "Inventeurs et ingénieurs",
  "Other British firsts": "Autres premières britanniques",
  "Isaac Newton": "Isaac Newton",
  "Gravity and the laws of motion. His *Principia Mathematica* is one of the most important scientific books ever written.":
    "La gravitation et les lois du mouvement. Ses *Principia Mathematica* comptent parmi les livres scientifiques les plus importants jamais écrits.",
  "*On the Origin of Species*, 1859 — evolution by natural selection.":
    "*On the Origin of Species*, 1859 — l'évolution par sélection naturelle.",
  "Alexander Fleming": "Alexander Fleming",
  "A Scot who discovered **penicillin** in 1928, the first true antibiotic.":
    "Un Écossais qui découvrit la **pénicilline** en 1928, le premier véritable antibiotique.",
  "Michael Faraday": "Michael Faraday",
  "Electromagnetic induction — the principle behind the electric motor and the generator.":
    "L'induction électromagnétique — le principe du moteur électrique et de la dynamo.",
  "Ernest Rutherford": "Ernest Rutherford",
  "Split the atom and established the structure of the atomic nucleus.":
    "Il fissionna l'atome et établit la structure du noyau atomique.",
  "Rosalind Franklin": "Rosalind Franklin",
  "Her X-ray work was essential to discovering the double-helix structure of DNA, alongside Crick and Watson.":
    "Ses travaux aux rayons X furent essentiels à la découverte de la double hélice de l'ADN, aux côtés de Crick et Watson.",
  "James Watt": "James Watt",
  "Transformed the steam engine and made industrial power practical.":
    "Il transforma la machine à vapeur et rendit la force motrice industrielle utilisable.",
  "George Stephenson": "George Stephenson",
  "The Rocket, and the first practical passenger railways.":
    "La Rocket, et les premières lignes de voyageurs réellement exploitables.",
  "Isambard Kingdom Brunel": "Isambard Kingdom Brunel",
  "The Great Western Railway, the Clifton Suspension Bridge, and pioneering steamships.":
    "Le Great Western Railway, le Clifton Suspension Bridge et des navires à vapeur pionniers.",
  "Alexander Graham Bell": "Alexander Graham Bell",
  "Born in Edinburgh; developed the **telephone**.":
    "Né à Edinburgh ; il mit au point le **téléphone**.",
  "John Logie Baird": "John Logie Baird",
  "A Scot who gave the first public demonstration of **television**.":
    "Un Écossais qui fit la première démonstration publique de la **télévision**.",
  "Tim Berners-Lee": "Tim Berners-Lee",
  "Invented the **World Wide Web** in 1989 while working at CERN.":
    "Il inventa le **World Wide Web** en 1989 alors qu'il travaillait au CERN.",

  // ── Famous British people ───────────────────────────────────────────────
  "Monarchs": "Les monarques",
  "Political figures": "Les figures politiques",
  "Scientists, engineers and reformers": "Scientifiques, ingénieurs et réformateurs",
  "Writers, artists and musicians": "Écrivains, artistes et musiciens",
  "Military and exploration": "Armée et explorations",
  "Won at Hastings in 1066 and became the first Norman king.":
    "Vainqueur à Hastings en 1066, il devint le premier roi normand.",
  "Six wives, and the break with Rome that created the Church of England.":
    "Six épouses, et la rupture avec Rome qui donna naissance à la Church of England.",
  "Reigned 45 years; the Armada was defeated in 1588.":
    "Elle régna 45 ans ; l'Armada fut vaincue en 1588.",
  "1837–1901, at the height of British industrial and imperial power.":
    "1837–1901, à l'apogée de la puissance industrielle et impériale britannique.",
  "Charles III": "Charles III",
  "The present monarch, since September 2022.":
    "Le monarque actuel, depuis septembre 2022.",
  "Oliver Cromwell": "Oliver Cromwell",
  "Led Parliament to victory in the Civil War and ruled as Lord Protector.":
    "Il mena le Parlement à la victoire pendant la guerre civile et gouverna comme Lord Protector.",
  "William Wilberforce": "William Wilberforce",
  "Led the parliamentary campaign to abolish the slave trade.":
    "Il mena au Parlement la campagne pour l'abolition de la traite des esclaves.",
  "Winston Churchill": "Winston Churchill",
  "Prime Minister through the Second World War, and voted the greatest Briton in a national poll.":
    "Premier ministre pendant la Seconde Guerre mondiale, élu plus grand Britannique lors d'un sondage national.",
  "Clement Attlee": "Clement Attlee",
  "Prime Minister from 1945; his government built the welfare state and the NHS.":
    "Premier ministre à partir de 1945 ; son gouvernement bâtit l'État-providence et le NHS.",
  "Margaret Thatcher": "Margaret Thatcher",
  "The first woman Prime Minister, from 1979 to 1990.":
    "La première femme Premier ministre, de 1979 à 1990.",
  "Led the suffragette campaign for votes for women.":
    "Elle mena la campagne des suffragettes pour le droit de vote des femmes.",
  "Gravity and the laws of motion.": "La gravitation et les lois du mouvement.",
  "Evolution by natural selection.": "L'évolution par sélection naturelle.",
  "Penicillin, 1928.": "La pénicilline, 1928.",
  "Railways, bridges and steamships.": "Chemins de fer, ponts et navires à vapeur.",
  "Founded modern nursing.": "Elle fonda les soins infirmiers modernes.",
  "Alan Turing": "Alan Turing",
  "Computing, and the codebreakers at Bletchley Park.":
    "L'informatique, et les décrypteurs de Bletchley Park.",
  "The most influential writer in the English language.":
    "L'écrivain le plus influent de la langue anglaise.",
  "Jane Austen and Charles Dickens": "Jane Austen et Charles Dickens",
  "The two most widely read English novelists of the nineteenth century.":
    "Les deux romanciers anglais les plus lus du XIXe siècle.",
  "Scotland's national poet.": "Le poète national de l'Écosse.",
  "J. M. W. Turner": "J. M. W. Turner",
  "Landscape and seascape painter; the Turner Prize is named after him.":
    "Peintre de paysages et de marines ; le Turner Prize porte son nom.",
  "The Beatles": "The Beatles",
  "From Liverpool — the most successful British band.":
    "Originaires de Liverpool — le groupe britannique le plus célèbre.",
  "Sake Dean Mahomet": "Sake Dean Mahomet",
  "Opened Britain's first Indian restaurant and introduced shampooing; an early figure in Britain's multicultural history.":
    "Il ouvrit le premier restaurant indien de Grande-Bretagne et introduisit le shampooing ; une figure précoce de l'histoire multiculturelle du pays.",

  // ── Education and healthcare ────────────────────────────────────────────
  "Education": "L'éducation",
  "The NHS": "Le NHS",
  "Emergency services": "Les services d'urgence",
  "Primary school": "L'école primaire",
  "From about age 5 to 11. One class teacher covers most subjects.":
    "De 5 à 11 ans environ. Un professeur des écoles assure la plupart des matières.",
  "Secondary school": "Le secondaire",
  "From about 11 to 16, ending with **GCSEs** in England, Wales and Northern Ireland, or **National Qualifications** in Scotland.":
    "De 11 à 16 ans environ, sanctionné par les **GCSEs** en Angleterre, au pays de Galles et en Irlande du Nord, ou les **National Qualifications** en Écosse.",
  "Further education": "L'enseignement post-obligatoire",
  "**A levels**, or Highers in Scotland, and vocational courses at sixth form or college, usually 16 to 18.":
    "Les **A levels**, ou Highers en Écosse, et des formations professionnelles en sixth form ou en college, généralement de 16 à 18 ans.",
  "Higher education": "L'enseignement supérieur",
  "Universities award degrees. **Oxford** and **Cambridge** are the oldest. Tuition fees and support differ between the four nations, because education is devolved.":
    "Les universités délivrent les diplômes. **Oxford** et **Cambridge** sont les plus anciennes. Les frais de scolarité et les aides diffèrent entre les quatre nations, l'éducation relevant de la devolution.",
  "Your GP": "Votre GP",
  "A **general practitioner** is your first point of contact. Register with a local practice; you need to be registered to be referred for most other care.":
    "Le **general practitioner** est votre premier interlocuteur. Inscrivez-vous dans un cabinet local ; sans inscription, pas d'orientation vers la plupart des autres soins.",
  "Hospitals": "Les hôpitaux",
  "You normally attend after a GP referral, except in an emergency.":
    "On s'y rend normalement sur orientation du GP, sauf en cas d'urgence.",
  "Prescriptions": "Les ordonnances",
  "Charged in England, with many exemptions. Free in Scotland, Wales and Northern Ireland.":
    "Payantes en Angleterre, avec de nombreuses exonérations. Gratuites en Écosse, au pays de Galles et en Irlande du Nord.",
  "Dentists and opticians": "Dentistes et opticiens",
  "NHS treatment is available but usually carries a charge.":
    "Les soins NHS existent, mais sont généralement payants.",

  // ── Study aids ──────────────────────────────────────────────────────────
  "What you must know": "Ce qu'il faut savoir",
  "Key names": "Les noms clés",
  "Key dates and numbers": "Dates et chiffres clés",
  "Key terms": "Termes clés",
  "Why this lesson first: the test does not only ask facts. Several questions ask what British society expects of you, and those answers come straight from the values below.":
    "Pourquoi cette leçon en premier : le test ne pose pas que des questions de faits. Plusieurs portent sur ce que la société britannique attend de vous, et les réponses viennent directement des valeurs ci-dessous.",
  "The UK sets out a short list of shared values. Learn them as a list — questions often ask you to pick which one is *not* included.":
    "Le Royaume-Uni énonce une courte liste de valeurs communes. Apprenez-la comme une liste — les questions demandent souvent laquelle n'en fait *pas* partie.",
  "It is unlawful to discriminate against someone on any of these grounds: **age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation**.":
    "Il est illégal de discriminer quelqu'un pour l'un de ces motifs : **l'âge, le handicap, le changement de genre, le mariage et le civil partnership, la grossesse et la maternité, l'origine, la religion ou les convictions, le sexe et l'orientation sexuelle**.",
  "The values cut both ways. Living in the UK gives you rights, and each one carries a matching duty.":
    "Les valeurs vont dans les deux sens. Vivre au Royaume-Uni vous donne des droits, et chacun s'accompagne d'un devoir correspondant.",
  "Freedom of speech is not unlimited. Speech that incites violence or racial hatred is a criminal offence. The test does ask about that boundary.":
    "La liberté d'expression n'est pas sans limites. Les propos qui incitent à la violence ou à la haine raciale sont un délit. Le test interroge bien sur cette frontière.",
  "No people to learn here — this lesson is about principles, not personalities.":
    "Aucun nom à retenir ici — cette leçon porte sur des principes, non sur des personnes.",
  "This trips people up constantly, and the test knows it. **The United Kingdom** is England, Scotland, Wales and Northern Ireland. **Great Britain** is only England, Scotland and Wales — it is the island, so Northern Ireland is not part of it.":
    "C'est une confusion permanente, et le test le sait. Le **United Kingdom**, c'est l'Angleterre, l'Écosse, le pays de Galles et l'Irlande du Nord. La **Great Britain**, c'est seulement l'Angleterre, l'Écosse et le pays de Galles — c'est l'île, donc l'Irlande du Nord n'en fait pas partie.",
  "The Channel Islands and the Isle of Man are Crown Dependencies. They are NOT part of the UK. They have their own governments and are linked to the Crown, not to Parliament in Westminster.":
    "Les Channel Islands et l'Isle of Man sont des Crown Dependencies. Elles ne font PAS partie du Royaume-Uni. Elles ont leurs propres gouvernements et sont liées à la Couronne, non au Parlement de Westminster.",
  "England is divided into **counties** — Kent, Yorkshire, Cornwall, Devon, Lancashire and dozens more — and into broader regions such as the **South East, the Midlands, the North West and East Anglia**. Scotland has council areas and historic regions such as the **Highlands, the Lowlands and the Borders**. Northern Ireland has six counties: Antrim, Armagh, Down, Fermanagh, Londonderry and Tyrone.":
    "L'Angleterre est divisée en **counties** — Kent, Yorkshire, Cornwall, Devon, Lancashire et des dizaines d'autres — et en régions plus larges comme le **South East, les Midlands, le North West et l'East Anglia**. L'Écosse a des council areas et des régions historiques comme les **Highlands, les Lowlands et les Borders**. L'Irlande du Nord compte six comtés : Antrim, Armagh, Down, Fermanagh, Londonderry et Tyrone.",
  "**Lough Neagh** in Northern Ireland is the largest freshwater lake in the whole UK by area. **Loch Ness** and **Loch Lomond** are the best-known Scottish lochs — Loch Lomond is the largest by surface area in Great Britain, while Loch Ness holds the most water. **Windermere** in the Lake District is the largest lake in England.":
    "**Lough Neagh**, en Irlande du Nord, est le plus grand lac d'eau douce du Royaume-Uni par sa superficie. **Loch Ness** et **Loch Lomond** sont les lochs écossais les plus connus — Loch Lomond a la plus grande surface de Grande-Bretagne, Loch Ness le plus grand volume d'eau. **Windermere**, dans le Lake District, est le plus grand lac d'Angleterre.",
  "There are **15 National Parks** across the UK. The best known are the **Lake District, Snowdonia (Eryri), the Peak District, the Yorkshire Dales, Dartmoor, the Cairngorms** and **Loch Lomond and the Trossachs**. Landmarks the test may mention include **Stonehenge**, **Hadrian's Wall**, the **Giant's Causeway** in County Antrim, the **Tower of London**, **Edinburgh Castle** and the **Lake District**.":
    "Le Royaume-Uni compte **15 parcs nationaux**. Les plus connus sont le **Lake District, le Snowdonia (Eryri), le Peak District, les Yorkshire Dales, Dartmoor, les Cairngorms** et **Loch Lomond and the Trossachs**. Parmi les sites que le test peut citer : **Stonehenge**, le **Hadrian's Wall**, la **Giant's Causeway** dans le comté d'Antrim, la **Tower of London**, **Edinburgh Castle** et le **Lake District**.",
  "English is spoken throughout. **Welsh** is an official language in Wales and is taught in schools there. **Gaelic** is spoken in parts of Scotland, and **Irish** is spoken in Northern Ireland. Scots and Ulster Scots are also recognised.":
    "L'anglais est parlé partout. Le **gallois** est une langue officielle au pays de Galles et y est enseigné à l'école. Le **gaélique** est parlé dans certaines régions d'Écosse, et l'**irlandais** en Irlande du Nord. Le scots et l'ulster scots sont également reconnus.",
  "In one line: Great Britain is the island — three nations. The UK is four. The Isle of Man and the Channel Islands are in neither.":
    "En une phrase : la Great Britain, c'est l'île — trois nations. Le Royaume-Uni en compte quatre. L'Isle of Man et les Channel Islands n'appartiennent ni à l'une ni à l'autre.",
  "Every nation of the UK carries its own saint, flower, flag and symbol — and the Union brings three of the four together in one flag. The test asks which belongs to which, so learn them as four sets rather than as one long list.":
    "Chaque nation du Royaume-Uni a son saint, sa fleur, son drapeau et son symbole — et l'Union en réunit trois sur quatre dans un seul drapeau. Le test demande ce qui appartient à qui : apprenez-les en quatre ensembles plutôt qu'en une longue liste.",
  "The **Union Flag** — often called the **Union Jack** — combines three crosses: the red cross of **St George** on white for England, the white diagonal cross (saltire) of **St Andrew** on blue for Scotland, and the red diagonal cross of **St Patrick** on white for Ireland.":
    "L'**Union Flag** — souvent appelé **Union Jack** — combine trois croix : la croix rouge de **St George** sur fond blanc pour l'Angleterre, la croix diagonale blanche (saltire) de **St Andrew** sur fond bleu pour l'Écosse, et la croix diagonale rouge de **St Patrick** sur fond blanc pour l'Irlande.",
  "Why Wales is missing: when the first Union Flag was designed in 1606, Wales had already been joined to England, so it was not treated as a separate kingdom. The Welsh dragon flies on its own flag instead.":
    "Pourquoi le pays de Galles manque : lorsque le premier Union Flag fut dessiné en 1606, il était déjà rattaché à l'Angleterre et n'était donc pas traité comme un royaume distinct. Le dragon gallois flotte sur son propre drapeau.",
  "Four saints, four dates. Two fall in March, and that is the pair people mix up.":
    "Quatre saints, quatre dates. Deux tombent en mars, et c'est cette paire que l'on confond.",
  "England.": "L'Angleterre.",
  "The **Welsh Dragon** appears on the flag of Wales. The **lion** and the **unicorn** support the Royal Coat of Arms — the lion for England, the unicorn for Scotland. The **oak tree** is a long-standing English symbol, and the **poppy** is worn nationally for Remembrance.":
    "Le **Welsh Dragon** figure sur le drapeau du pays de Galles. Le **lion** et la **licorne** soutiennent le Royal Coat of Arms — le lion pour l'Angleterre, la licorne pour l'Écosse. Le **chêne** est un symbole anglais de longue date, et le **coquelicot** se porte dans tout le pays pour le Remembrance.",
  "The national anthem of the UK is **God Save the King** (God Save the Queen during a queen's reign). It is played at state occasions and when the monarch appears in public. In sport each nation may use its own song — **Flower of Scotland** for Scotland, **Hen Wlad Fy Nhadau (Land of My Fathers)** for Wales, and **Jerusalem** or the national anthem for England.":
    "L'hymne national du Royaume-Uni est **God Save the King** (God Save the Queen sous le règne d'une reine). On le joue lors des cérémonies officielles et quand le monarque paraît en public. En sport, chaque nation peut avoir son propre chant — **Flower of Scotland** pour l'Écosse, **Hen Wlad Fy Nhadau (Land of My Fathers)** pour le pays de Galles, et **Jerusalem** ou l'hymne national pour l'Angleterre.",
  "Why the words change: they follow the monarch's gender, not the country. Nothing else in the song changes.":
    "Pourquoi les paroles changent : elles suivent le sexe du monarque, non le pays. Rien d'autre ne change dans le chant.",
  "In one line: Four saints, four flowers, four dates — and only three crosses in the flag, because Wales was already joined to England.":
    "En une phrase : quatre saints, quatre fleurs, quatre dates — et seulement trois croix dans le drapeau, parce que le pays de Galles était déjà rattaché à l'Angleterre.",
  "For most of prehistory Britain was not an island. It was joined to the continent by land, and people walked here. Around **10,000 years ago** the land bridge flooded and Britain was cut off.":
    "Pendant l'essentiel de la préhistoire, la Bretagne n'était pas une île. Elle tenait au continent par la terre ferme, et l'on y venait à pied. Il y a environ **10 000 ans**, le pont terrestre fut submergé et la Bretagne se retrouva isolée.",
  "The **Celts** spoke languages from which modern **Welsh, Gaelic and Irish** descend. **Stonehenge** in Wiltshire is the most famous prehistoric monument in Britain and is still a World Heritage Site.":
    "Les **Celtes** parlaient des langues dont descendent le **gallois, le gaélique et l'irlandais** d'aujourd'hui. **Stonehenge**, dans le Wiltshire, est le monument préhistorique le plus célèbre de Grande-Bretagne et reste inscrit au patrimoine mondial.",
  "**Julius Caesar** led an expedition in **55 BC** and it failed — he did not conquer Britain. The successful invasion came almost a century later, under the Emperor **Claudius in AD 43**.":
    "**Jules César** mena une expédition en **55 av. J.-C.** et elle échoua — il ne conquit pas la Bretagne. L'invasion réussie vint près d'un siècle plus tard, sous l'empereur **Claude, en 43 apr. J.-C.**",
  "55 BC and AD 43 are the pair the test loves. Caesar came and left; Claudius came and stayed. Do not swap them.":
    "55 av. J.-C. et 43 apr. J.-C. sont la paire préférée du test. César vint et repartit ; Claude vint et resta. Ne les intervertissez pas.",
  "**Boudicca**, queen of the Iceni in what is now East Anglia, led a famous revolt against Roman rule. Her statue stands on Westminster Bridge in London. The Romans never conquered what is now Scotland, and the Emperor **Hadrian** built **Hadrian's Wall** across the north of England to keep out the tribes he called the Picts. The Romans left Britain in **AD 410** to defend Rome itself.":
    "**Boudicca**, reine des Icènes dans l'actuelle East Anglia, mena une révolte célèbre contre la domination romaine. Sa statue se dresse sur le Westminster Bridge à Londres. Les Romains ne conquirent jamais l'actuelle Écosse, et l'empereur **Hadrien** fit bâtir le **Hadrian's Wall** dans le nord de l'Angleterre pour contenir les tribus qu'il appelait les Pictes. Les Romains quittèrent la Bretagne en **410 apr. J.-C.** pour défendre Rome elle-même.",
  "After the Romans left, tribes from northern Europe — the **Angles, Saxons and Jutes** — settled in Britain. Their language became the basis of modern English, and the country took its name from the Angles: *Angle-land*, England. The burial ship at **Sutton Hoo** in Suffolk dates from this period.":
    "Après le départ des Romains, des peuples du nord de l'Europe — les **Angles, les Saxons et les Jutes** — s'installèrent en Bretagne. Leur langue est à l'origine de l'anglais moderne, et le pays tira son nom des Angles : *Angle-land*, England. La sépulture-navire de **Sutton Hoo**, dans le Suffolk, date de cette époque.",
  "Christian missionaries arrived to convert the Anglo-Saxons — **St Augustine** in the south, who became the first Archbishop of Canterbury, and **St Columba** in Scotland, who founded a monastery on **Iona**.":
    "Des missionnaires chrétiens vinrent convertir les Anglo-Saxons — **St Augustine** au sud, qui devint le premier Archbishop of Canterbury, et **St Columba** en Écosse, qui fonda un monastère à **Iona**.",
  "Vikings from Denmark and Norway first raided in **AD 789** and later settled. **Alfred the Great**, King of Wessex, defeated them and agreed a boundary: the north and east of England became the **Danelaw**, under Danish law, while Wessex remained English.":
    "Les Vikings du Danemark et de Norvège lancèrent leurs premiers raids en **789 apr. J.-C.**, puis s'installèrent. **Alfred le Grand**, roi du Wessex, les battit et fixa une frontière : le nord et l'est de l'Angleterre devinrent le **Danelaw**, sous loi danoise, tandis que le Wessex restait anglais.",
  "In **1066** **William, Duke of Normandy**, defeated King Harold at the **Battle of Hastings** and became William I — William the Conqueror. It is the last time Britain was successfully invaded, and the date every schoolchild in Britain knows.":
    "En **1066**, **Guillaume, duc de Normandie**, battit le roi Harold à la **Battle of Hastings** et devint Guillaume Ier — Guillaume le Conquérant. C'est la dernière invasion réussie de la Bretagne, et la date que connaît chaque écolier britannique.",
  "In one line: Caesar came and left in 55 BC; Claudius came and stayed in AD 43. That pair is the trap this chapter is built around.":
    "En une phrase : César vint et repartit en 55 av. J.-C. ; Claude vint et resta en 43 apr. J.-C. C'est autour de cette paire qu'est bâti le piège de ce chapitre.",
  "The Middle Ages run from the Norman Conquest to the Tudors. Two themes carry most of the test questions: the slow limiting of the king's power, and the long wars with Wales, Scotland and France.":
    "Le Moyen Âge va de la conquête normande aux Tudors. Deux fils portent l'essentiel des questions du test : la limitation progressive du pouvoir royal, et les longues guerres contre le pays de Galles, l'Écosse et la France.",
  "**King John** was forced by his barons to agree to **Magna Carta** — the Great Charter — in **1215** at Runnymede. It established that the king was **not above the law** and could not tax as he pleased. It is the foundation of the rule of law in Britain.":
    "Le **roi Jean** fut contraint par ses barons d'accepter la **Magna Carta** — la Grande Charte — en **1215** à Runnymede. Elle établit que le roi n'est **pas au-dessus de la loi** et ne peut lever l'impôt à sa guise. C'est le fondement de l'État de droit en Grande-Bretagne.",
  "Why Magna Carta still matters: it is the first written statement that a ruler is bound by law. The principle behind it is one of the fundamental values you learned in lesson 1.":
    "Pourquoi la Magna Carta compte encore : c'est le premier texte écrit affirmant qu'un souverain est lié par la loi. Le principe qu'elle porte est l'une des valeurs fondamentales vues à la leçon 1.",
  "**Henry II** reformed the courts and quarrelled with **Thomas Becket**, Archbishop of Canterbury, who was murdered in Canterbury Cathedral in 1170. **Richard I**, the Lionheart, spent almost his whole reign abroad on crusade.":
    "**Henri II** réforma les tribunaux et se brouilla avec **Thomas Becket**, Archbishop of Canterbury, assassiné dans la cathédrale de Canterbury en 1170. **Richard Ier**, Cœur de Lion, passa presque tout son règne à l'étranger, en croisade.",
  "**Edward I** conquered **Wales** and built a ring of castles there; the **Statute of Rhuddlan (1284)** annexed Wales to the English Crown. He tried the same in **Scotland** and failed.":
    "**Édouard Ier** conquit le **pays de Galles** et y bâtit une ceinture de châteaux ; le **Statute of Rhuddlan (1284)** le rattacha à la Couronne anglaise. Il tenta la même chose en **Écosse** et échoua.",
  "England and France fought on and off from **1337 to 1453**. The English won famous victories at **Crécy (1346)** and **Agincourt (1415)** under **Henry V**, but by the end had lost all their French lands except Calais.":
    "L'Angleterre et la France s'affrontèrent par intermittence de **1337 à 1453**. Les Anglais remportèrent des victoires célèbres à **Crécy (1346)** et **Azincourt (1415)** sous **Henri V**, mais perdirent à la fin toutes leurs terres françaises sauf Calais.",
  "The **Black Death** reached Britain in **1348** and killed roughly a third of the population. So few labourers were left that survivors could demand better pay — the feudal system began to break down. When a poll tax was imposed, the **Peasants Revolt of 1381** broke out, led by **Wat Tyler**.":
    "La **peste noire** atteignit la Grande-Bretagne en **1348** et tua environ un tiers de la population. Il restait si peu de bras que les survivants purent exiger de meilleurs salaires — le système féodal commença à se défaire. Quand une taxe par tête fut imposée, la **révolte des paysans de 1381** éclata, menée par **Wat Tyler**.",
  "A civil war between the **House of Lancaster** (red rose) and the **House of York** (white rose), ending at the **Battle of Bosworth Field in 1485**. Richard III was killed, Henry Tudor won, and the **Tudor rose** — red and white together — was the emblem of the peace that followed.":
    "Une guerre civile entre la **House of Lancaster** (rose rouge) et la **House of York** (rose blanche), close à la **Battle of Bosworth Field en 1485**. Richard III fut tué, Henri Tudor l'emporta, et la **rose Tudor** — rouge et blanche réunies — devint l'emblème de la paix qui suivit.",
  "William the Conqueror · Henry II · Thomas Becket · Richard I · King John · Edward I · William Wallace · Robert the Bruce · Henry V · Wat Tyler.":
    "Guillaume le Conquérant · Henri II · Thomas Becket · Richard Ier · le roi Jean · Édouard Ier · William Wallace · Robert Bruce · Henri V · Wat Tyler.",
  "1066 Hastings · 1086 Domesday Book · 1215 Magna Carta · 1284 Statute of Rhuddlan · 1314 Bannockburn · 1337–1453 Hundred Years War · 1348 Black Death · 1381 Peasants' Revolt · 1415 Agincourt · 1485 Bosworth Field.":
    "1066 Hastings · 1086 Domesday Book · 1215 Magna Carta · 1284 Statute of Rhuddlan · 1314 Bannockburn · 1337–1453 guerre de Cent Ans · 1348 peste noire · 1381 révolte des paysans · 1415 Azincourt · 1485 Bosworth Field.",
  "Feudal system · Magna Carta · Domesday Book · Wars of the Roses · poll tax · barons.":
    "Système féodal · Magna Carta · Domesday Book · guerre des Deux-Roses · taxe par tête · barons.",
  "In one line: Magna Carta in 1215 is the first written statement that a ruler is bound by law — the root of the rule of law you learned in lesson 1.":
    "En une phrase : la Magna Carta de 1215 est le premier texte écrit affirmant qu'un souverain est lié par la loi — la racine de l'État de droit vu à la leçon 1.",
  "Five Tudor monarchs in 118 years, and between them they broke with Rome, changed the country's religion three times, and turned England into a naval power.":
    "Cinq monarques Tudor en 118 ans : ensemble, ils rompirent avec Rome, changèrent trois fois la religion du pays et firent de l'Angleterre une puissance navale.",
  "**Henry VII** ended the Wars of the Roses and founded the dynasty. His son **Henry VIII** is remembered for his **six wives** and for breaking with the Pope.":
    "**Henri VII** mit fin à la guerre des Deux-Roses et fonda la dynastie. On se souvient de son fils **Henri VIII** pour ses **six épouses** et pour sa rupture avec le pape.",
  "The rhyme British children learn: divorced, beheaded, died; divorced, beheaded, survived. It is the fastest way to keep the six in order.":
    "La comptine qu'apprennent les enfants britanniques : répudiée, décapitée, morte ; répudiée, décapitée, survivante. C'est le moyen le plus rapide de retenir l'ordre des six.",
  "When the Pope refused to annul his first marriage, Henry VIII broke with Rome and made himself **Head of the Church of England**. The **Dissolution of the Monasteries** followed: monasteries were closed and their wealth taken by the Crown. Wales was formally united with England by law during his reign.":
    "Quand le pape refusa d'annuler son premier mariage, Henri VIII rompit avec Rome et se fit **Head of the Church of England**. Suivit la **Dissolution of the Monasteries** : les monastères furent fermés et leurs biens saisis par la Couronne. C'est sous son règne que le pays de Galles fut officiellement uni à l'Angleterre par la loi.",
  "In **1588** Catholic Spain sent a great fleet, the **Armada**, to invade England. It was defeated by the English navy and scattered by storms. The victory made Elizabeth's reputation and established England as a serious naval power.":
    "En **1588**, l'Espagne catholique envoya une grande flotte, l'**Armada**, pour envahir l'Angleterre. La marine anglaise la battit et les tempêtes la dispersèrent. Cette victoire fit la réputation d'Élisabeth et installa l'Angleterre comme véritable puissance navale.",
  "**William Shakespeare (1564–1616)** was born in **Stratford-upon-Avon**. He wrote plays and poetry, worked at the **Globe Theatre** in London, and shaped the English language more than any other writer. Famous works include *Hamlet*, *Macbeth*, *Romeo and Juliet* and *A Midsummer Night's Dream*.":
    "**William Shakespeare (1564–1616)** naquit à **Stratford-upon-Avon**. Il écrivit des pièces et de la poésie, travailla au **Globe Theatre** à Londres et façonna la langue anglaise plus que tout autre écrivain. Parmi ses œuvres célèbres : *Hamlet*, *Macbeth*, *Romeo and Juliet* et *A Midsummer Night's Dream*.",
  "Also in this period: **Mary, Queen of Scots**, a Catholic cousin of Elizabeth, fled to England, was imprisoned for years and eventually executed in 1587. Her son became James VI of Scotland — and then James I of England.":
    "À la même époque : **Marie Stuart**, cousine catholique d'Élisabeth, se réfugia en Angleterre, fut emprisonnée des années durant et finalement exécutée en 1587. Son fils devint Jacques VI d'Écosse — puis Jacques Ier d'Angleterre.",
  "Henry VII · Henry VIII · his six wives · Edward VI · Mary I · Elizabeth I · Mary, Queen of Scots · William Shakespeare.":
    "Henri VII · Henri VIII · ses six épouses · Édouard VI · Marie Ire · Élisabeth Ire · Marie Stuart · William Shakespeare.",
  "1485 Tudors begin · 1534 break with Rome · 1587 Mary, Queen of Scots executed · 1588 Spanish Armada · 1564–1616 Shakespeare.":
    "1485 début des Tudors · 1534 rupture avec Rome · 1587 exécution de Marie Stuart · 1588 Invincible Armada · 1564–1616 Shakespeare.",
  "Reformation · Church of England · Dissolution of the Monasteries · annulment · Armada · the Globe Theatre.":
    "Réforme · Church of England · Dissolution of the Monasteries · annulation de mariage · Armada · le Globe Theatre.",
  "In one line: Divorced, beheaded, died; divorced, beheaded, survived. The break with Rome started as a marriage dispute, not a change of belief.":
    "En une phrase : répudiée, décapitée, morte ; répudiée, décapitée, survivante. La rupture avec Rome commença comme une querelle de mariage, non comme un changement de foi.",
  "The seventeenth century is where Parliament wins. A king is executed, a republic is tried and abandoned, and by 1689 it is settled law that the Crown rules with Parliament, not over it.":
    "Le XVIIe siècle est celui où le Parlement l'emporte. Un roi est exécuté, une république est tentée puis abandonnée, et en 1689 le droit établit que la Couronne gouverne avec le Parlement, non au-dessus de lui.",
  "When Elizabeth I died childless in 1603, **James VI of Scotland** became **James I of England** — the same man wearing two crowns, though the countries stayed separate. He ordered the **King James Bible**, still the best-known English translation.":
    "À la mort sans enfant d'Élisabeth Ire en 1603, **Jacques VI d'Écosse** devint **Jacques Ier d'Angleterre** — le même homme portant deux couronnes, les deux pays restant distincts. Il commanda la **King James Bible**, encore la traduction anglaise la plus connue.",
  "In **1605** a group of Catholics led by **Guy Fawkes** tried to blow up Parliament and the King. The **Gunpowder Plot** failed, and the country still marks it on **5 November** with bonfires and fireworks.":
    "En **1605**, un groupe de catholiques mené par **Guy Fawkes** tenta de faire sauter le Parlement et le roi. La **conspiration des Poudres** échoua, et le pays la commémore encore le **5 novembre** par des feux de joie et des feux d'artifice.",
  "**Charles I** believed in the **divine right of kings** — that his authority came from God and Parliament could not limit it. He ruled for eleven years without calling Parliament at all. The quarrel became war in **1642**.":
    "**Charles Ier** croyait au **droit divin des rois** — son autorité venait de Dieu et le Parlement ne pouvait la limiter. Il gouverna onze ans sans convoquer le Parlement. La querelle devint guerre en **1642**.",
  "England became a republic, the **Commonwealth**, with **Oliver Cromwell** as **Lord Protector**. His rule was strict and puritan — theatres closed, Christmas celebrations discouraged. He also campaigned brutally in Ireland. When he died his son could not hold the country together.":
    "L'Angleterre devint une république, le **Commonwealth**, avec **Oliver Cromwell** comme **Lord Protector**. Son régime fut strict et puritain — théâtres fermés, fêtes de Noël découragées. Il mena aussi une campagne brutale en Irlande. À sa mort, son fils ne put maintenir le pays uni.",
  "In **1660** Parliament invited **Charles II** back to the throne — the **Restoration**. His reign saw the **Great Plague of 1665** and the **Great Fire of London in 1666**, and the founding of the **Royal Society**, Britain's oldest scientific institution.":
    "En **1660**, le Parlement rappela **Charles II** sur le trône — la **Restauration**. Son règne connut la **grande peste de 1665** et le **grand incendie de Londres en 1666**, ainsi que la fondation de la **Royal Society**, la plus ancienne institution scientifique britannique.",
  "**James II** was Catholic, and Protestant leaders feared where he would take the country. They invited his Protestant daughter **Mary** and her Dutch husband **William of Orange** to take the throne. William landed in 1688 and James fled without a battle — hence **Glorious Revolution**, a revolution with almost no bloodshed in England.":
    "**Jacques II** était catholique, et les chefs protestants redoutaient où il mènerait le pays. Ils invitèrent sa fille protestante **Marie** et son mari néerlandais **Guillaume d'Orange** à prendre le trône. Guillaume débarqua en 1688 et Jacques s'enfuit sans combat — d'où **Glorieuse Révolution**, une révolution presque sans effusion de sang en Angleterre.",
  "**William III and Mary II** ruled jointly. In **1689** the **Bill of Rights** settled the terms: the monarch may not raise taxes or keep an army without Parliament, Parliament must meet regularly, and elections must be free.":
    "**Guillaume III et Marie II** régnèrent conjointement. En **1689**, le **Bill of Rights** fixa les règles : le monarque ne peut lever d'impôts ni entretenir d'armée sans le Parlement, le Parlement doit se réunir régulièrement, et les élections doivent être libres.",
  "Why 1689 is the hinge: everything after it is a constitutional monarchy. The monarch reigns, Parliament governs — the arrangement Britain still has.":
    "Pourquoi 1689 est la charnière : tout ce qui suit relève de la monarchie constitutionnelle. Le monarque règne, le Parlement gouverne — le dispositif que la Grande-Bretagne conserve aujourd'hui.",
  "James I · Guy Fawkes · Charles I · Oliver Cromwell · Charles II · James II · William III · Mary II.":
    "Jacques Ier · Guy Fawkes · Charles Ier · Oliver Cromwell · Charles II · Jacques II · Guillaume III · Marie II.",
  "1603 James I · 1605 Gunpowder Plot · 1642–1651 Civil War · 1649 Charles I executed · 1660 Restoration · 1665 Plague · 1666 Great Fire · 1688 Glorious Revolution · 1689 Bill of Rights.":
    "1603 Jacques Ier · 1605 conspiration des Poudres · 1642–1651 guerre civile · 1649 exécution de Charles Ier · 1660 Restauration · 1665 peste · 1666 grand incendie · 1688 Glorieuse Révolution · 1689 Bill of Rights.",
  "Divine right of kings · Cavaliers · Roundheads · Commonwealth · Lord Protector · Restoration · Bill of Rights.":
    "Droit divin des rois · Cavaliers · Roundheads · Commonwealth · Lord Protector · Restauration · Bill of Rights.",
  "In one line: 1689 is the hinge: after the Bill of Rights the monarch reigns and Parliament governs. Everything since is a constitutional monarchy.":
    "En une phrase : 1689 est la charnière — après le Bill of Rights, le monarque règne et le Parlement gouverne. Tout ce qui suit est une monarchie constitutionnelle.",
  "Two centuries in which Britain becomes one kingdom, then the first industrial nation, then the largest empire in history — and in which a long argument about slavery and about the vote begins to be won.":
    "Deux siècles pendant lesquels la Grande-Bretagne devient un royaume unique, puis la première nation industrielle, puis le plus vaste empire de l'histoire — et pendant lesquels un long débat sur l'esclavage et sur le droit de vote commence à être gagné.",
  "The **Act of Union in 1707** joined the parliaments of England and Scotland into the **Kingdom of Great Britain**, governed from Westminster. A second **Act of Union in 1801** added Ireland, creating the United Kingdom.":
    "L'**Act of Union de 1707** réunit les parlements d'Angleterre et d'Écosse dans le **Kingdom of Great Britain**, gouverné depuis Westminster. Un second **Act of Union, en 1801**, y ajouta l'Irlande et créa le United Kingdom.",
  "The **Jacobites** wanted the Stuart line restored. **Bonnie Prince Charlie** — Charles Edward Stuart — landed in Scotland in 1745, raised an army, and was crushed at the **Battle of Culloden in 1746**, the last battle fought on British soil.":
    "Les **jacobites** voulaient rétablir la lignée des Stuarts. **Bonnie Prince Charlie** — Charles Édouard Stuart — débarqua en Écosse en 1745, leva une armée et fut écrasé à la **Battle of Culloden en 1746**, la dernière bataille livrée sur le sol britannique.",
  "Britain was the first country to industrialise. Machines replaced hand tools, factories replaced workshops, and people moved from the countryside into fast-growing cities such as Manchester, Birmingham and Glasgow.":
    "La Grande-Bretagne fut le premier pays à s'industrialiser. Les machines remplacèrent les outils à main, les usines les ateliers, et les gens quittèrent la campagne pour des villes en pleine croissance comme Manchester, Birmingham et Glasgow.",
  "The **British Empire** grew until it covered around a quarter of the world. Its wealth came partly from the **slave trade**, in which British ships carried enslaved Africans to the colonies.":
    "Le **British Empire** s'étendit jusqu'à couvrir près d'un quart du monde. Sa richesse vint en partie de la **traite des esclaves**, où des navires britanniques transportaient des Africains réduits en esclavage vers les colonies.",
  "Two dates, often confused. **1807** abolished the slave TRADE — carrying and selling. **1833** abolished SLAVERY itself throughout the Empire. The Abolition Act freed those already enslaved.":
    "Deux dates souvent confondues. **1807** abolit la TRAITE — le transport et la vente. **1833** abolit l'ESCLAVAGE lui-même dans tout l'Empire. L'Abolition Act libéra ceux qui étaient déjà asservis.",
  "**William Wilberforce** led the parliamentary campaign against the trade, and the Quakers were prominent among the campaigners.":
    "**William Wilberforce** mena au Parlement la campagne contre la traite, et les quakers furent au premier rang des militants.",
  "**Queen Victoria** reigned from **1837 to 1901** — 64 years, the second longest reign in British history. Britain was at the height of its industrial and imperial power. The **Great Exhibition of 1851** in the Crystal Palace displayed it to the world.":
    "La **reine Victoria** régna de **1837 à 1901** — 64 ans, le deuxième plus long règne de l'histoire britannique. Le pays était à l'apogée de sa puissance industrielle et impériale. La **Great Exhibition de 1851**, au Crystal Palace, la montra au monde.",
  "The **Reform Act of 1832** began widening the vote, and further acts in 1867 and 1884 extended it — though at the end of Victoria's reign no woman could vote and many working men still could not. Laws limited working hours and child labour, and free primary schooling was introduced.":
    "Le **Reform Act de 1832** commença à élargir le droit de vote, et d'autres lois, en 1867 et 1884, l'étendirent encore — même si, à la fin du règne de Victoria, aucune femme ne votait et beaucoup d'ouvriers non plus. Des lois limitèrent le temps de travail et le travail des enfants, et l'école primaire gratuite fut instaurée.",
  "Bonnie Prince Charlie · James Watt · George Stephenson · Isambard Kingdom Brunel · William Wilberforce · Admiral Nelson · the Duke of Wellington · Queen Victoria · Florence Nightingale · Charles Darwin.":
    "Bonnie Prince Charlie · James Watt · George Stephenson · Isambard Kingdom Brunel · William Wilberforce · l'amiral Nelson · le Duke of Wellington · la reine Victoria · Florence Nightingale · Charles Darwin.",
  "1707 Act of Union · 1746 Culloden · 1776 American independence · 1801 Union with Ireland · 1805 Trafalgar · 1807 slave trade abolished · 1815 Waterloo · 1832 Reform Act · 1833 slavery abolished · 1837–1901 Victoria · 1851 Great Exhibition · 1859 Origin of Species.":
    "1707 Act of Union · 1746 Culloden · 1776 indépendance américaine · 1801 union avec l'Irlande · 1805 Trafalgar · 1807 abolition de la traite · 1815 Waterloo · 1832 Reform Act · 1833 abolition de l'esclavage · 1837–1901 Victoria · 1851 Great Exhibition · 1859 Origin of Species.",
  "Jacobites · Industrial Revolution · British Empire · abolition · Reform Act · Crystal Palace.":
    "Jacobites · révolution industrielle · British Empire · abolition · Reform Act · Crystal Palace.",
  "In one line: 1807 ended the trade in people; 1833 ended slavery itself. Two dates, twenty-six years apart, and the test asks which is which.":
    "En une phrase : 1807 mit fin au commerce des personnes ; 1833 mit fin à l'esclavage lui-même. Deux dates séparées de vingt-six ans, et le test demande laquelle est laquelle.",
  "Two world wars, votes for women, the founding of the NHS, the end of empire and the arrival of the Britain you live in now.":
    "Deux guerres mondiales, le droit de vote des femmes, la création du NHS, la fin de l'Empire et l'avènement de la Grande-Bretagne où vous vivez aujourd'hui.",
  "Britain entered the war in **1914** and it ended on **11 November 1918**. Around a million from Britain and its Empire were killed. That date is why **Remembrance Day** falls on 11 November and why poppies are worn.":
    "La Grande-Bretagne entra en guerre en **1914** et celle-ci s'acheva le **11 novembre 1918**. Environ un million de morts pour le pays et son Empire. C'est de cette date que vient le **Remembrance Day** du 11 novembre, et le port du coquelicot.",
  "The **suffragettes**, led by **Emmeline Pankhurst**, campaigned for the vote — with protests, hunger strikes and imprisonment.":
    "Les **suffragettes**, menées par **Emmeline Pankhurst**, firent campagne pour le droit de vote — manifestations, grèves de la faim et emprisonnements.",
  "Two dates again. **1918**: women over 30 who met a property qualification got the vote. **1928**: women got the vote on the same terms as men, at 21. The gap of ten years is a favourite question.":
    "Deux dates, là encore. **1918** : les femmes de plus de 30 ans remplissant une condition de propriété obtiennent le droit de vote. **1928** : les femmes votent aux mêmes conditions que les hommes, à 21 ans. L'écart de dix ans est une question de prédilection.",
  "Britain declared war on Germany in **1939** after the invasion of Poland. **Winston Churchill** became Prime Minister in 1940 and led the country through it.":
    "La Grande-Bretagne déclara la guerre à l'Allemagne en **1939** après l'invasion de la Pologne. **Winston Churchill** devint Premier ministre en 1940 et conduisit le pays à travers l'épreuve.",
  "The war in Europe ended on **VE Day, 8 May 1945**; the war against Japan ended that August. **Alan Turing** and the codebreakers at **Bletchley Park** broke German ciphers and shortened the war.":
    "La guerre en Europe s'acheva le **VE Day, 8 mai 1945** ; celle contre le Japon en août de la même année. **Alan Turing** et les décrypteurs de **Bletchley Park** cassèrent les codes allemands et raccourcirent la guerre.",
  "The **Beveridge Report of 1942** set out a plan to tackle what it called the five giants — want, disease, ignorance, squalor and idleness. After the war the Labour government built the **welfare state**, and in **1948 Aneurin Bevan** founded the **National Health Service**, free at the point of use.":
    "Le **Beveridge Report de 1942** proposa un plan contre ce qu'il appelait les cinq géants — le besoin, la maladie, l'ignorance, l'insalubrité et l'oisiveté. Après la guerre, le gouvernement travailliste bâtit l'**État-providence**, et en **1948, Aneurin Bevan** fonda le **National Health Service**, gratuit au moment du soin.",
  "After 1945 the colonies became independent, one after another — this is **decolonisation**. **India and Pakistan in 1947** came first, then most of Africa and the Caribbean. Many of the new countries joined the **Commonwealth**, a voluntary association of independent states, now around 56 members. The monarch is its Head, but the Commonwealth has no power over its members.":
    "Après 1945, les colonies accédèrent l'une après l'autre à l'indépendance — c'est la **décolonisation**. L'**Inde et le Pakistan, en 1947**, d'abord, puis l'essentiel de l'Afrique et des Caraïbes. Beaucoup de ces nouveaux pays rejoignirent le **Commonwealth**, association volontaire d'États indépendants, aujourd'hui environ 56 membres. Le monarque en est le chef, mais le Commonwealth n'a aucun pouvoir sur ses membres.",
  "Britain invited workers from the Caribbean, India, Pakistan and elsewhere to help rebuild after the war — the ship **Empire Windrush** arrived in **1948** and gave its name to that generation. Later arrivals came from Uganda, Eastern Europe and around the world. Britain today is a diverse, multi-faith society.":
    "La Grande-Bretagne fit venir des travailleurs des Caraïbes, d'Inde, du Pakistan et d'ailleurs pour reconstruire après la guerre — le navire **Empire Windrush** accosta en **1948** et donna son nom à cette génération. D'autres arrivèrent plus tard d'Ouganda, d'Europe de l'Est et du monde entier. La Grande-Bretagne est aujourd'hui une société diverse et pluriconfessionnelle.",
  "The UK joined the **European Economic Community in 1973**, which became the **European Union**. In a referendum in **June 2016** the UK voted to leave, and it formally left on **31 January 2020**.":
    "Le Royaume-Uni entra dans la **Communauté économique européenne en 1973**, devenue l'**Union européenne**. Lors d'un référendum en **juin 2016**, il vota pour en sortir, et la sortie fut effective le **31 janvier 2020**.",
  "Other landmarks: **Margaret Thatcher** became the first woman Prime Minister in **1979**; the **Good Friday Agreement of 1998** brought peace to Northern Ireland; devolved parliaments opened in Scotland and Wales in **1999**; London hosted the **Olympic Games in 2012**; **Queen Elizabeth II** died in **2022** after 70 years, and **King Charles III** succeeded her.":
    "Autres repères : **Margaret Thatcher** devint la première femme Premier ministre en **1979** ; le **Good Friday Agreement de 1998** ramena la paix en Irlande du Nord ; les parlements dévolus d'Écosse et du pays de Galles ouvrirent en **1999** ; Londres accueillit les **Jeux olympiques en 2012** ; la **reine Élisabeth II** mourut en **2022** après 70 ans de règne, et le **roi Charles III** lui succéda.",
  "Emmeline Pankhurst · Winston Churchill · Clement Attlee · William Beveridge · Aneurin Bevan · Alan Turing · Margaret Thatcher · Elizabeth II · Charles III.":
    "Emmeline Pankhurst · Winston Churchill · Clement Attlee · William Beveridge · Aneurin Bevan · Alan Turing · Margaret Thatcher · Élisabeth II · Charles III.",
  "1914–1918 First World War · 1918 and 1928 votes for women · 1939–1945 Second World War · 1940 Battle of Britain · 6 June 1944 D-Day · 8 May 1945 VE Day · 1947 India and Pakistan · 1948 NHS and Windrush · 1973 joined EEC · 1979 Thatcher · 1998 Good Friday Agreement · 1999 devolution · 2012 Olympics · 2016 referendum · 31 January 2020 left the EU · 2022 Charles III.":
    "1914–1918 Première Guerre mondiale · 1918 et 1928 droit de vote des femmes · 1939–1945 Seconde Guerre mondiale · 1940 bataille d'Angleterre · 6 juin 1944 Jour J · 8 mai 1945 VE Day · 1947 Inde et Pakistan · 1948 NHS et Windrush · 1973 entrée dans la CEE · 1979 Thatcher · 1998 Good Friday Agreement · 1999 devolution · 2012 Jeux olympiques · 2016 référendum · 31 janvier 2020 sortie de l'UE · 2022 Charles III.",
  "Suffragettes · the Blitz · welfare state · NHS · Commonwealth · decolonisation · Brexit.":
    "Suffragettes · le Blitz · État-providence · NHS · Commonwealth · décolonisation · Brexit.",
  "In one line: 1918 gave the vote to women over 30 with property; 1928 made it equal at 21. Ten years apart, and a favourite question.":
    "En une phrase : 1918 donna le vote aux femmes de plus de 30 ans possédant des biens ; 1928 l'égalisa à 21 ans. Dix ans d'écart, et une question de prédilection.",
  "Every date in the six history lessons, in one place and in order. Read this last, and then read it again the night before the test — most history questions are really date questions wearing a costume.":
    "Toutes les dates des six leçons d'histoire, au même endroit et dans l'ordre. À lire en dernier, puis à relire la veille du test — la plupart des questions d'histoire sont en réalité des questions de dates déguisées.",
  "Why a timeline earns its own lesson: the test rarely asks what happened. It asks WHEN, or which of two similar events came first. Order is the thing worth drilling.":
    "Pourquoi une chronologie mérite sa propre leçon : le test demande rarement ce qui s'est passé. Il demande QUAND, ou lequel de deux événements semblables est venu en premier. C'est l'ordre qu'il faut travailler.",
  "Every name in the six history lessons appears here in date order rather than by topic.":
    "Tous les noms des six leçons d'histoire figurent ici par ordre chronologique plutôt que par thème.",
  "The whole course in order: c. 2500 BC Stonehenge · 55 BC · AD 43 · AD 410 · 1066 · 1215 · 1314 · 1348 · 1485 · 1588 · 1649 · 1689 · 1707 · 1805 · 1833 · 1918 · 1928 · 1945 · 1948 · 2020 · 2022.":
    "Tout le cours dans l'ordre : vers 2500 av. J.-C. Stonehenge · 55 av. J.-C. · 43 apr. J.-C. · 410 apr. J.-C. · 1066 · 1215 · 1314 · 1348 · 1485 · 1588 · 1649 · 1689 · 1707 · 1805 · 1833 · 1918 · 1928 · 1945 · 1948 · 2020 · 2022.",
  "Chronology · century · BC and AD · reign · era.":
    "Chronologie · siècle · av. J.-C. et apr. J.-C. · règne · époque.",
  "In one line: Most history questions are really date questions. Learn the order and the 'which came first' questions answer themselves.":
    "En une phrase : la plupart des questions d'histoire sont des questions de dates. Apprenez l'ordre, et les questions « lequel vient en premier » se répondent d'elles-mêmes.",
  "The UK is a **constitutional monarchy**. The monarch is **Head of State**, but does not govern. Parliament makes the law and the Prime Minister runs the government. The monarch's role is formal, ceremonial and strictly non-political.":
    "Le Royaume-Uni est une **monarchie constitutionnelle**. Le monarque est **Head of State**, mais ne gouverne pas. Le Parlement fait la loi et le Premier ministre dirige le gouvernement. Le rôle du monarque est formel, protocolaire et strictement apolitique.",
  "The monarch must be politically neutral. They do not vote, do not express political opinions in public, and act on the advice of ministers. That neutrality is the whole point of the office.":
    "Le monarque doit rester politiquement neutre. Il ne vote pas, n'exprime pas d'opinions politiques en public et agit sur le conseil des ministres. Cette neutralité est la raison d'être de la fonction.",
  "The throne passes by **hereditary succession**. Since a change in the law in 2013, the eldest child inherits regardless of sex — an older sister is no longer passed over for a younger brother. A **coronation** is the ceremony that crowns a new monarch; it takes place at **Westminster Abbey** and is conducted by the **Archbishop of Canterbury**. The monarch succeeds immediately on the death of the previous one — the coronation comes later.":
    "Le trône se transmet par **succession héréditaire**. Depuis une réforme de 2013, c'est l'aîné des enfants qui hérite, quel que soit son sexe — une sœur aînée n'est plus écartée au profit d'un frère cadet. Le **couronnement** est la cérémonie qui couronne un nouveau monarque ; elle a lieu à **Westminster Abbey** et est conduite par l'**Archbishop of Canterbury**. Le monarque succède immédiatement à la mort du précédent — le couronnement vient plus tard.",
  "**King Charles III** became monarch in **September 2022** on the death of his mother, **Queen Elizabeth II**, who had reigned for **70 years** — the longest in British history. The heir to the throne is **Prince William, Prince of Wales**. Members of the Royal Family carry out public duties and support charities.":
    "Le **roi Charles III** devint monarque en **septembre 2022**, à la mort de sa mère, la **reine Élisabeth II**, qui avait régné **70 ans** — le plus long règne de l'histoire britannique. L'héritier du trône est le **prince William, Prince of Wales**. Les membres de la famille royale assurent des fonctions publiques et soutiennent des œuvres caritatives.",
  "Elizabeth II · Charles III · Prince William · the Archbishop of Canterbury.":
    "Élisabeth II · Charles III · le prince William · l'Archbishop of Canterbury.",
  "Elizabeth II reigned 1952–2022, 70 years. Charles III from September 2022. Royal Assent last refused 1708. Succession law changed 2013.":
    "Élisabeth II a régné de 1952 à 2022, 70 ans. Charles III depuis septembre 2022. Royal Assent refusé pour la dernière fois en 1708. Loi de succession modifiée en 2013.",
  "Constitutional monarchy · Head of State · Royal Assent · State Opening of Parliament · coronation · hereditary succession · Head of the Commonwealth.":
    "Monarchie constitutionnelle · Head of State · Royal Assent · State Opening of Parliament · couronnement · succession héréditaire · Head of the Commonwealth.",
  "In one line: The monarch reigns but does not govern, and must stay politically neutral. Royal Assent is a formality, not a veto.":
    "En une phrase : le monarque règne mais ne gouverne pas, et doit rester politiquement neutre. Le Royal Assent est une formalité, non un veto.",
  "Parliament sits at the **Palace of Westminster** in London. It has two chambers — the House of Commons and the House of Lords — and the monarch. Almost every test question about government comes down to knowing which of the two chambers does what.":
    "Le Parlement siège au **Palace of Westminster**, à Londres. Il comprend deux chambres — la House of Commons et la House of Lords — ainsi que le monarque. Presque toutes les questions du test sur les institutions reviennent à savoir laquelle des deux chambres fait quoi.",
  "A **general election** must be held at least every **five years**. The UK is divided into **constituencies**, and each elects one MP by **first past the post** — whoever gets the most votes wins the seat.":
    "Une **élection générale** doit avoir lieu au moins tous les **cinq ans**. Le Royaume-Uni est divisé en **constituencies**, et chacune élit un MP au scrutin **first past the post** — celui qui obtient le plus de voix emporte le siège.",
  "A proposal is a **bill**. It is debated and voted on in the Commons, then in the Lords, then returns to the Commons if the Lords amended it. Once both agree, it goes to the monarch for **Royal Assent** and becomes an **Act of Parliament**.":
    "Un projet s'appelle un **bill**. Il est débattu et voté aux Commons, puis aux Lords, puis revient aux Commons si les Lords l'ont amendé. Une fois les deux chambres d'accord, il est soumis au monarque pour le **Royal Assent** et devient un **Act of Parliament**.",
  "**Councils** run local services — schools, refuse collection, housing, roads, libraries and planning. Councillors are elected, usually for four years, and councils are funded by **council tax** and by central government. Many areas also elect a **mayor**.":
    "Les **councils** gèrent les services locaux — écoles, collecte des déchets, logement, voirie, bibliothèques et urbanisme. Les conseillers sont élus, généralement pour quatre ans, et les councils sont financés par la **council tax** et par l'État. Beaucoup de territoires élisent aussi un **maire**.",
  "Why the civil service is separate: civil servants carry out government policy but are politically neutral and stay in post when the government changes. Ministers come and go; the machine does not.":
    "Pourquoi la fonction publique est distincte : les fonctionnaires mettent en œuvre la politique du gouvernement mais restent politiquement neutres et demeurent en poste quand le gouvernement change. Les ministres passent ; la machine, non.",
  "The Prime Minister · the Chancellor of the Exchequer · the Home Secretary · the Speaker · the Leader of the Opposition.":
    "Le Premier ministre · le Chancellor of the Exchequer · le Home Secretary · le Speaker · le Leader of the Opposition.",
  "650 MPs. General elections at least every 5 years. Voting age 18. Councillors usually elected for 4 years.":
    "650 MPs. Élections générales au moins tous les 5 ans. Droit de vote à 18 ans. Conseillers élus généralement pour 4 ans.",
  "House of Commons · House of Lords · constituency · first past the post · by-election · Cabinet · shadow cabinet · bill · Act of Parliament · civil service · council tax.":
    "House of Commons · House of Lords · constituency · first past the post · élection partielle · Cabinet · cabinet fantôme · bill · Act of Parliament · fonction publique · council tax.",
  "In one line: The Commons is elected and holds the power; the Lords is appointed and can only revise and delay. That split answers most questions here.":
    "En une phrase : les Commons sont élus et détiennent le pouvoir ; les Lords sont nommés et ne peuvent que réviser et retarder. Ce partage répond à la plupart des questions de cette leçon.",
  "**Devolution** means powers handed from the UK Parliament in Westminster to elected bodies in Scotland, Wales and Northern Ireland. It began after referendums in the late 1990s, and the three bodies first sat in **1999**.":
    "La **devolution** désigne le transfert de compétences du UK Parliament de Westminster à des assemblées élues en Écosse, au pays de Galles et en Irlande du Nord. Elle a commencé après des référendums à la fin des années 1990, et les trois assemblées ont siégé pour la première fois en **1999**.",
  "Broadly the same list in each nation: **health, education, housing, transport, policing (in Scotland and Northern Ireland), the environment, agriculture** and local government. This is why the NHS, schools and university fees genuinely differ between the four nations.":
    "À peu près la même liste dans chaque nation : **santé, éducation, logement, transports, police (en Écosse et en Irlande du Nord), environnement, agriculture** et collectivités locales. C'est pourquoi le NHS, les écoles et les frais universitaires diffèrent réellement entre les quatre nations.",
  "Westminster keeps the matters that must be decided for the whole country — these are called **reserved matters**: **defence, foreign policy, immigration and nationality, the currency, most taxation, and national security**.":
    "Westminster conserve ce qui doit être décidé pour tout le pays — ce sont les **reserved matters** : **défense, politique étrangère, immigration et nationalité, monnaie, l'essentiel de la fiscalité et sécurité nationale**.",
  "England has no devolved parliament of its own. English matters are decided by the UK Parliament, which is why the two are easy to confuse.":
    "L'Angleterre n'a pas de parlement dévolu propre. Les affaires anglaises sont tranchées par le UK Parliament, d'où la confusion facile entre les deux.",
  "Holyrood · the Senedd · Stormont.": "Holyrood · le Senedd · Stormont.",
  "Referendums 1997. All three bodies first sat in 1999. Good Friday Agreement 1998. Senedd renamed 2020.":
    "Référendums en 1997. Les trois assemblées siègent pour la première fois en 1999. Good Friday Agreement en 1998. Le Senedd rebaptisé en 2020.",
  "Devolution · devolved matter · reserved matter · MSP · MS · MLA · power sharing.":
    "Devolution · compétence dévolue · compétence réservée · MSP · MS · MLA · partage du pouvoir.",
  "In one line: Health, education and housing are devolved; defence, foreign policy, immigration and the currency are reserved to Westminster. England has no devolved parliament.":
    "En une phrase : santé, éducation et logement sont dévolus ; défense, politique étrangère, immigration et monnaie sont réservés à Westminster. L'Angleterre n'a pas de parlement dévolu.",
  "The **rule of law** means everyone is subject to the law — including the government, the police and the monarch's ministers. Judges are independent of government, and no one may be punished except by a court.":
    "L'**État de droit** signifie que tout le monde est soumis à la loi — y compris le gouvernement, la police et les ministres du monarque. Les juges sont indépendants du gouvernement, et nul ne peut être puni autrement que par un tribunal.",
  "If you are on the electoral register and aged **18 to 70**, you may be summoned for **jury service**. It is a duty, not a request — you must attend unless you are excused. A jury decides the facts: whether the accused is guilty or not guilty. The judge decides the law and the sentence.":
    "Si vous figurez sur l'electoral register et avez entre **18 et 70 ans**, vous pouvez être convoqué comme **juré**. C'est un devoir, non une invitation — vous devez vous présenter sauf dispense. Le jury tranche les faits : l'accusé est coupable ou non. Le juge dit le droit et prononce la peine.",
  "**Legal aid** is public funding that pays for legal advice or representation for people who cannot afford it. It exists so that the right to a fair trial is real rather than theoretical.":
    "La **legal aid** est un financement public qui paie conseils et représentation juridiques à ceux qui n'en ont pas les moyens. Elle existe pour que le droit à un procès équitable soit réel et non théorique.",
  "Why juries are drawn at random: a jury of ordinary people, chosen by lot rather than appointed, is what stops the state deciding guilt on its own. That is the rule of law in practice.":
    "Pourquoi les jurys sont tirés au sort : un jury de citoyens ordinaires, tirés au sort plutôt que nommés, est ce qui empêche l'État de décider seul de la culpabilité. C'est l'État de droit en pratique.",
  "Magistrates · judges · solicitors · barristers · the Supreme Court.":
    "Magistrates · juges · solicitors · barristers · the Supreme Court.",
  "Jury of 12 in England, Wales and Northern Ireland; 15 in Scotland. Jury service 18–70. Supreme Court took over from the Lords in 2009. Age of criminal responsibility 12 in Scotland, 10 elsewhere.":
    "Jury de 12 personnes en Angleterre, au pays de Galles et en Irlande du Nord ; 15 en Écosse. Service de juré de 18 à 70 ans. La Supreme Court a succédé aux Lords en 2009. Âge de la responsabilité pénale : 12 ans en Écosse, 10 ailleurs.",
  "Rule of law · criminal law · civil law · Magistrates' Court · Crown Court · County Court · legal aid · jury service.":
    "État de droit · droit pénal · droit civil · Magistrates' Court · Crown Court · County Court · legal aid · service de juré.",
  "In one line: The jury decides the facts, the judge decides the law and the sentence — and everyone, including the government, is subject to both.":
    "En une phrase : le jury tranche les faits, le juge dit le droit et la peine — et tout le monde, gouvernement compris, est soumis aux deux.",
  "Lesson 1 introduced the values. This one is the practical side: what you are entitled to, and what is expected of you in return.":
    "La leçon 1 présentait les valeurs. Celle-ci en est le versant pratique : ce à quoi vous avez droit, et ce qu'on attend de vous en retour.",
  "Most people pay income tax through **PAYE** — deducted by an employer before wages are paid. The self-employed complete a **Self Assessment** tax return each year. Tax funds the NHS, schools, roads, defence and the police. **HM Revenue and Customs (HMRC)** collects it.":
    "La plupart des gens paient l'impôt sur le revenu par le **PAYE** — prélevé par l'employeur avant le versement du salaire. Les indépendants remplissent chaque année une déclaration **Self Assessment**. L'impôt finance le NHS, les écoles, les routes, la défense et la police. C'est **HM Revenue and Customs (HMRC)** qui le collecte.",
  "Volunteering, joining a school governing body, helping a charity, standing as a councillor, or simply voting — participation is treated as part of citizenship rather than an optional extra.":
    "Être bénévole, siéger au conseil d'une école, aider une association, se présenter comme conseiller ou simplement voter — la participation est considérée comme faisant partie de la citoyenneté, non comme un supplément facultatif.",
  "HM Revenue and Customs (HMRC).": "HM Revenue and Customs (HMRC) — le fisc britannique.",
  "Vote at 18. Jury service 18–70. Human Rights Act 1998. Equality Act 2010.":
    "Droit de vote à 18 ans. Service de juré de 18 à 70 ans. Human Rights Act 1998. Equality Act 2010.",
  "PAYE · Self Assessment · National Insurance · income tax · secret ballot · human rights · protected characteristics.":
    "PAYE · Self Assessment · National Insurance · impôt sur le revenu · scrutin secret · droits de l'homme · critères protégés.",
  "In one line: Every right carries a duty: the vote and the electoral register, the NHS and your taxes, a fair trial and jury service.":
    "En une phrase : chaque droit s'accompagne d'un devoir — le vote et l'electoral register, le NHS et vos impôts, le procès équitable et le service de juré.",
  "The UK is a diverse society of around **67 million** people. England is much the largest of the four nations. Roughly a fifth of people belong to a minority ethnic group, and the largest cities are the most diverse.":
    "Le Royaume-Uni est une société diverse d'environ **67 millions** d'habitants. L'Angleterre est de loin la plus peuplée des quatre nations. Près d'un cinquième de la population appartient à une minorité ethnique, et les grandes villes sont les plus diverses.",
  "Most households are small. Both parents commonly work, and children usually leave home in their late teens or twenties. Older relatives often live independently rather than with their children.":
    "Les foyers sont le plus souvent petits. Les deux parents travaillent couramment, et les enfants quittent en général la maison à la fin de l'adolescence ou dans la vingtaine. Les personnes âgées vivent souvent seules plutôt que chez leurs enfants.",
  "Volunteering is widespread and highly regarded — charity shops, food banks, sports clubs, school governors, the National Trust, hospital and mountain rescue volunteers. Charities are a large part of British life, and giving time is seen as valuable as giving money.":
    "Le bénévolat est répandu et très estimé — boutiques caritatives, banques alimentaires, clubs sportifs, conseils d'école, National Trust, bénévoles des hôpitaux et du secours en montagne. Les associations occupent une grande place dans la vie britannique, et donner de son temps vaut autant que donner de l'argent.",
  "Queuing, punctuality, saying please and thank you, and apologising readily are all noticed. Politeness matters more than formality, and small talk about the weather is genuinely a social convention rather than a joke about one.":
    "Faire la queue, être ponctuel, dire s'il vous plaît et merci, s'excuser volontiers : tout cela se remarque. La politesse compte plus que le formalisme, et parler du temps qu'il fait est une véritable convention sociale, pas une plaisanterie à son sujet.",
  "No names to memorise — this lesson is about how people live rather than who they were.":
    "Aucun nom à retenir — cette leçon porte sur la manière dont les gens vivent, non sur qui ils étaient.",
  "Population around 67 million. Same-sex marriage 2014 in England, Wales and Scotland; 2020 in Northern Ireland. Marriage age raised to 18 in England and Wales in 2023.":
    "Population d'environ 67 millions. Mariage entre personnes de même sexe en 2014 en Angleterre, au pays de Galles et en Écosse ; en 2020 en Irlande du Nord. Âge du mariage porté à 18 ans en Angleterre et au pays de Galles en 2023.",
  "Civil partnership · forced marriage · arranged marriage · volunteering · community · diversity.":
    "Civil partnership · mariage forcé · mariage arrangé · bénévolat · vie collective · diversité.",
  "In one line: An arranged marriage both people freely accept is lawful. A forced marriage is a crime. Consent is the whole distinction.":
    "En une phrase : un mariage arrangé que les deux personnes acceptent librement est légal. Un mariage forcé est un délit. Toute la différence tient au consentement.",
  "The UK is historically Christian but is now a multi-faith society, and a large and growing share of people report no religion at all. **Freedom of religion** is a legal right: you may practise any faith or none, and change your faith.":
    "Le Royaume-Uni est historiquement chrétien mais forme aujourd'hui une société pluriconfessionnelle, où une part importante et croissante de la population ne déclare aucune religion. La **liberté de religion** est un droit : on peut pratiquer n'importe quelle foi ou aucune, et en changer.",
  "Religious tolerance is one of the fundamental values. It protects believers of every faith **and** those with none, and it is unlawful to discriminate against someone for their religion or belief. Places of worship for all major faiths are found across the UK.":
    "La tolérance religieuse est l'une des valeurs fondamentales. Elle protège les croyants de toutes les religions **et** ceux qui n'en ont aucune, et il est illégal de discriminer quelqu'un pour sa religion ou ses convictions. On trouve des lieux de culte de toutes les grandes religions dans tout le pays.",
  "The Archbishop of Canterbury · Guru Nanak · the Church of England · the Church of Scotland.":
    "L'Archbishop of Canterbury · Guru Nanak · la Church of England · la Church of Scotland.",
  "Church of England established since Henry VIII's break with Rome in the 1530s.":
    "La Church of England est Église d'État depuis la rupture d'Henri VIII avec Rome, dans les années 1530.",
  "Established church · Supreme Governor · Anglican · Presbyterian · religious tolerance · freedom of belief.":
    "Église d'État · Supreme Governor · anglican · presbytérien · tolérance religieuse · liberté de conviction.",
  "In one line: England has an established church with the monarch at its head; Scotland's is Presbyterian; Wales and Northern Ireland have none.":
    "En une phrase : l'Angleterre a une Église d'État dont le monarque est le chef ; celle d'Écosse est presbytérienne ; le pays de Galles et l'Irlande du Nord n'en ont pas.",
  "Some of these are public holidays, some are simply widely marked. The test asks which is which, and it asks dates — so learn the date alongside the name.":
    "Certaines de ces dates sont fériées, d'autres simplement largement célébrées. Le test demande lesquelles, et il demande les dates — apprenez donc la date avec le nom.",
  "**St David's Day, 1 March** (Wales); **St Patrick's Day, 17 March** (Northern Ireland); **St George's Day, 23 April** (England); **St Andrew's Day, 30 November** (Scotland). Only St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland are public holidays.":
    "**St David's Day, 1er mars** (pays de Galles) ; **St Patrick's Day, 17 mars** (Irlande du Nord) ; **St George's Day, 23 avril** (Angleterre) ; **St Andrew's Day, 30 novembre** (Écosse). Seuls la St Patrick's Day en Irlande du Nord et la St Andrew's Day en Écosse sont fériés.",
  "**Bank holidays** are public holidays when most businesses close. They differ between the four nations — Scotland and Northern Ireland each have days the others do not. Besides Christmas and Easter there are holidays in early May, late May and August.":
    "Les **bank holidays** sont des jours fériés où la plupart des entreprises ferment. Ils diffèrent entre les quatre nations — l'Écosse et l'Irlande du Nord ont chacune des jours que les autres n'ont pas. Outre Noël et Pâques, il y en a début mai, fin mai et en août.",
  "Guy Fawkes · Robert Burns · the four patron saints.":
    "Guy Fawkes · Robert Burns · les quatre saints patrons.",
  "1 January · 25 January Burns Night · 1 March · 17 March · 23 April · 31 October · 5 November · 11 November · 30 November · 25 and 26 December. Gunpowder Plot 1605. Armistice 1918.":
    "1er janvier · 25 janvier Burns Night · 1er mars · 17 mars · 23 avril · 31 octobre · 5 novembre · 11 novembre · 30 novembre · 25 et 26 décembre. Conspiration des Poudres 1605. Armistice 1918.",
  "Bank holiday · Hogmanay · Shrove Tuesday · Remembrance · Boxing Day.":
    "Bank holiday · Hogmanay · Mardi gras · Remembrance · Boxing Day.",
  "In one line: Only St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland are public holidays. The other two saints' days are not.":
    "En une phrase : seuls la St Patrick's Day en Irlande du Nord et la St Andrew's Day en Écosse sont fériés. Les deux autres fêtes de saints ne le sont pas.",
  "Britain invented or codified a remarkable number of the world's sports, and the test asks about the events as much as the games — which tournament is played where.":
    "La Grande-Bretagne a inventé ou codifié un nombre remarquable de sports, et le test interroge autant sur les épreuves que sur les disciplines — quel tournoi se joue où.",
  "Gardening, walking, going to the pub, watching television and following a team are all common. The **National Trust** cares for historic houses, gardens and coastline, and public footpaths give a legal right of way across much of the countryside.":
    "Le jardinage, la marche, le pub, la télévision et le soutien à une équipe sont des habitudes répandues. Le **National Trust** veille sur les demeures historiques, les jardins et le littoral, et les sentiers publics donnent un droit de passage légal dans une grande partie de la campagne.",
  "Wimbledon · Lord's · St Andrews · Aintree · Ascot · the National Trust.":
    "Wimbledon · Lord's · St Andrews · Aintree · Ascot · le National Trust.",
  "London hosted the Olympics in 1908, 1948 and 2012. Commonwealth Games every four years.":
    "Londres a accueilli les Jeux olympiques en 1908, 1948 et 2012. Commonwealth Games tous les quatre ans.",
  "The Ashes · Six Nations · FA Cup · Grand National · rugby union and rugby league · Paralympics.":
    "The Ashes · Six Nations · FA Cup · Grand National · rugby union et rugby league · Jeux paralympiques.",
  "In one line: Golf is Scottish, cricket and rugby are English, and at the Commonwealth Games the four nations compete separately rather than as one team.":
    "En une phrase : le golf est écossais, le cricket et le rugby anglais, et aux Commonwealth Games les quatre nations concourent séparément plutôt qu'en une seule équipe.",
  "Names and one fact each. The test does not expect you to have read the books — it expects you to know who wrote what, and which nation claims them.":
    "Un nom, un fait. Le test n'attend pas que vous ayez lu les livres — il attend que vous sachiez qui a écrit quoi, et quelle nation le revendique.",
  "**The Beatles** — John Lennon, Paul McCartney, George Harrison and Ringo Starr — came from **Liverpool** and are the most successful British band ever. Also from Britain: the Rolling Stones, Queen, David Bowie, Elton John and Adele.":
    "**The Beatles** — John Lennon, Paul McCartney, George Harrison et Ringo Starr — venaient de **Liverpool** et sont le groupe britannique le plus célèbre de tous les temps. Également britanniques : les Rolling Stones, Queen, David Bowie, Elton John et Adele.",
  "In classical music, **Henry Purcell**, **Edward Elgar**, **Gustav Holst**, **Ralph Vaughan Williams** and **Benjamin Britten**. The **Proms** — a summer season of concerts at the Royal Albert Hall, ending with the Last Night — has run since 1895.":
    "En musique classique, **Henry Purcell**, **Edward Elgar**, **Gustav Holst**, **Ralph Vaughan Williams** et **Benjamin Britten**. Les **Proms** — une saison estivale de concerts au Royal Albert Hall, close par la Last Night — existent depuis 1895.",
  "Chaucer · Shakespeare · Jane Austen · Charles Dickens · Robert Burns · Turner · Constable · Gainsborough · Henry Moore · The Beatles · Elgar.":
    "Chaucer · Shakespeare · Jane Austen · Charles Dickens · Robert Burns · Turner · Constable · Gainsborough · Henry Moore · The Beatles · Elgar.",
  "Shakespeare 1564–1616. British Museum founded 1753. The Proms since 1895. Burns Night 25 January.":
    "Shakespeare 1564–1616. British Museum fondé en 1753. Les Proms depuis 1895. Burns Night le 25 janvier.",
  "The Globe Theatre · the Turner Prize · the National Gallery · the British Museum · the Last Night of the Proms.":
    "Le Globe Theatre · le Turner Prize · la National Gallery · le British Museum · la Last Night of the Proms.",
  "In one line: One name, one fact. Chaucer came before Shakespeare, Burns is Scotland's poet, and The Beatles came from Liverpool.":
    "En une phrase : un nom, un fait. Chaucer précède Shakespeare, Burns est le poète de l'Écosse, et les Beatles venaient de Liverpool.",
  "British science shows up repeatedly in the test, usually as one name attached to one discovery. Learn the pairs.":
    "La science britannique revient souvent dans le test, en général sous la forme d'un nom associé à une découverte. Apprenez-les par paires.",
  "**Alan Turing** laid the foundations of computer science and broke German codes at Bletchley Park. The first successful **IVF** birth took place in England in 1978. The **Royal Society**, founded in the 1660s, is the oldest scientific institution still in existence. **Dolly the sheep**, the first cloned mammal, was created in Scotland in 1996.":
    "**Alan Turing** posa les bases de l'informatique et cassa les codes allemands à Bletchley Park. La première naissance réussie par **fécondation in vitro** eut lieu en Angleterre en 1978. La **Royal Society**, fondée dans les années 1660, est la plus ancienne institution scientifique encore existante. **La brebis Dolly**, premier mammifère cloné, fut créée en Écosse en 1996.",
  "Isaac Newton · Charles Darwin · Alexander Fleming · Michael Faraday · Ernest Rutherford · Rosalind Franklin · James Watt · George Stephenson · Brunel · Alexander Graham Bell · John Logie Baird · Alan Turing · Tim Berners-Lee.":
    "Isaac Newton · Charles Darwin · Alexander Fleming · Michael Faraday · Ernest Rutherford · Rosalind Franklin · James Watt · George Stephenson · Brunel · Alexander Graham Bell · John Logie Baird · Alan Turing · Tim Berners-Lee.",
  "Origin of Species 1859 · penicillin 1928 · first IVF birth 1978 · World Wide Web 1989 · Dolly the sheep 1996. Royal Society founded in the 1660s.":
    "Origin of Species 1859 · pénicilline 1928 · première naissance par FIV 1978 · World Wide Web 1989 · la brebis Dolly 1996. Royal Society fondée dans les années 1660.",
  "Natural selection · antibiotic · electromagnetic induction · DNA · the World Wide Web · cloning.":
    "Sélection naturelle · antibiotique · induction électromagnétique · ADN · le World Wide Web · clonage.",
  "In one line: Learn these as pairs — one person, one discovery. That is exactly how the test asks about them.":
    "En une phrase : apprenez-les par paires — une personne, une découverte. C'est exactement ainsi que le test les interroge.",
  "One place to revise every name in the course, sorted by what they are known for. If a name here is unfamiliar, go back to the lesson it came from.":
    "Un seul endroit pour réviser tous les noms du cours, classés par ce pour quoi ils sont connus. Si l'un d'eux vous est inconnu, retournez à la leçon dont il vient.",
  "**Admiral Nelson** at Trafalgar in 1805, the **Duke of Wellington** at Waterloo in 1815, **Boudicca** against the Romans, **William Wallace** and **Robert the Bruce** for Scotland, and **Captain James Cook**, whose voyages mapped much of the Pacific.":
    "**L'amiral Nelson** à Trafalgar en 1805, le **Duke of Wellington** à Waterloo en 1815, **Boudicca** contre les Romains, **William Wallace** et **Robert Bruce** pour l'Écosse, et le **capitaine James Cook**, dont les voyages cartographièrent une grande partie du Pacifique.",
  "Every name in the course, grouped by what they are known for — monarchs, politicians, scientists, writers, artists and reformers.":
    "Tous les noms du cours, regroupés par ce pour quoi ils sont connus — monarques, hommes politiques, scientifiques, écrivains, artistes et réformateurs.",
  "The dates belong to the lessons these people came from; this one is for matching the person to the achievement.":
    "Les dates appartiennent aux leçons dont ces personnes proviennent ; celle-ci sert à associer la personne à son œuvre.",
  "Monarch · Prime Minister · reformer · abolitionist · suffragette · engineer · physicist.":
    "Monarque · Premier ministre · réformateur · abolitionniste · suffragette · ingénieur · physicien.",
  "In one line: If a name here is unfamiliar, go back to the lesson it came from rather than trying to learn it in isolation.":
    "En une phrase : si un nom vous est inconnu, retournez à la leçon dont il vient plutôt que de l'apprendre isolément.",
  "Two things you will use, and two things the test asks about in practical terms: how school works, and how to get medical help.":
    "Deux choses dont vous vous servirez, et deux choses que le test aborde concrètement : le fonctionnement de l'école, et la manière d'obtenir des soins.",
  "Education is **compulsory** for children aged **5 to 16** (4 to 16 in Northern Ireland). In England, young people must stay in education or training until 18. State schooling is free.":
    "L'instruction est **obligatoire** de **5 à 16 ans** (de 4 à 16 en Irlande du Nord). En Angleterre, les jeunes doivent rester en formation jusqu'à 18 ans. L'école publique est gratuite.",
  "Parents must make sure their children attend. Schools have **governing bodies** that parents can join, and there is a national curriculum in England.":
    "Les parents doivent veiller à ce que leurs enfants soient scolarisés. Les écoles ont des **governing bodies** auxquels les parents peuvent siéger, et l'Angleterre a un programme national.",
  "The **National Health Service** was founded in **1948** by **Aneurin Bevan**. Its principle is care **free at the point of use**, paid for through taxation, based on need rather than ability to pay.":
    "Le **National Health Service** fut fondé en **1948** par **Aneurin Bevan**. Son principe : des soins **gratuits au moment où l'on en a besoin**, financés par l'impôt, accordés selon le besoin et non les moyens.",
  "Dial **999** or **112** for police, ambulance, fire or coastguard. Both numbers are free from any phone. For urgent but non-life-threatening medical help call **111**; for non-emergency police matters call **101**.":
    "Composez le **999** ou le **112** pour la police, une ambulance, les pompiers ou les garde-côtes. Les deux numéros sont gratuits depuis n'importe quel téléphone. Pour un besoin médical urgent mais sans danger vital, appelez le **111** ; pour la police hors urgence, le **101**.",
  "999 is for emergencies only — a life at risk, a serious injury, a crime in progress or a fire. Misusing it is an offence, and 111 exists for everything urgent that is not an emergency.":
    "Le 999 est réservé aux urgences — vie en danger, blessure grave, délit en cours ou incendie. En abuser est une infraction, et le 111 existe pour tout ce qui est urgent sans être une urgence vitale.",
  "Aneurin Bevan · your GP · Oxford and Cambridge.":
    "Aneurin Bevan · votre GP · Oxford et Cambridge.",
  "School compulsory 5–16 (4–16 in Northern Ireland); education or training to 18 in England. NHS founded 1948. Emergency 999 or 112; urgent advice 111; non-emergency police 101.":
    "Scolarité obligatoire de 5 à 16 ans (de 4 à 16 en Irlande du Nord) ; formation jusqu'à 18 ans en Angleterre. NHS fondé en 1948. Urgences 999 ou 112 ; conseil urgent 111 ; police hors urgence 101.",
  "GCSE · A level · Highers · National Qualifications · further education · higher education · GP · free at the point of use · prescription charge.":
    "GCSE · A level · Highers · National Qualifications · enseignement post-obligatoire · enseignement supérieur · GP · gratuit au moment du soin · frais d'ordonnance.",
  "In one line: 999 is for emergencies only and misusing it is an offence. 111 is the number for everything urgent that is not one.":
    "En une phrase : le 999 est réservé aux urgences et en abuser est une infraction. Le 111 est le numéro pour tout ce qui est urgent sans en être une.",
  "Ben Nevis · Snowdon (Yr Wyddfa) · Scafell Pike · Slieve Donard · Severn · Thames · Lough Neagh · Loch Lomond · Windermere.":
    "Ben Nevis · Snowdon (Yr Wyddfa) · Scafell Pike · Slieve Donard · Severn · la Tamise · Lough Neagh · Loch Lomond · Windermere.",
  "Channel Tunnel opened 1994. 15 National Parks. Northern Ireland has 6 counties.":
    "Tunnel sous la Manche ouvert en 1994. 15 parcs nationaux. L'Irlande du Nord compte 6 comtés.",
  "United Kingdom vs Great Britain · Crown Dependency · county · region · saltire · devolved capital.":
    "United Kingdom et Great Britain · Crown Dependency · comté · région · saltire · capitale dévolue.",
  "St David · St Patrick · St George · St Andrew · Y Ddraig Goch (the Red Dragon).":
    "St David · St Patrick · St George · St Andrew · Y Ddraig Goch (le Dragon rouge).",
  "St David 1 March · St Patrick 17 March · St George 23 April · St Andrew 30 November. First Union Flag 1606.":
    "St David 1er mars · St Patrick 17 mars · St George 23 avril · St Andrew 30 novembre. Premier Union Flag en 1606.",
  "Union Flag / Union Jack · saltire · patron saint · Tudor rose · thistle · daffodil · leek · shamrock.":
    "Union Flag / Union Jack · saltire · saint patron · rose Tudor · chardon · jonquille · poireau · trèfle.",
  "Julius Caesar · Claudius · Hadrian · Boudicca · Alfred the Great · St Augustine · St Columba · William of Normandy.":
    "Jules César · Claude · Hadrien · Boudicca · Alfred le Grand · St Augustine · St Columba · Guillaume de Normandie.",
  "55 BC Caesar fails · AD 43 Claudius invades · AD 122 Hadrian's Wall · AD 410 Romans leave · AD 789 first Viking raids · 1066 Hastings.":
    "55 av. J.-C. échec de César · 43 apr. J.-C. invasion de Claude · 122 apr. J.-C. Hadrian's Wall · 410 apr. J.-C. départ des Romains · 789 apr. J.-C. premiers raids vikings · 1066 Hastings.",
  "Celts · Danelaw · Anglo-Saxons · Iceni · Picts · Norman Conquest.":
    "Celtes · Danelaw · Anglo-Saxons · Icènes · Pictes · conquête normande.",
  "British society rests on a short list of shared values. They are not decoration: they are what the law, the courts and everyday expectations are built on, and understanding them explains a great deal of what follows in this course.":
    "La société britannique repose sur une courte liste de valeurs communes. Ce ne sont pas des ornements : la loi, les tribunaux et les attentes du quotidien sont bâtis dessus, et les comprendre éclaire une grande partie de la suite du cours.",
  "Equality Act 2010 — the law that sets out the nine protected characteristics. Human Rights Act 1998.":
    "Equality Act 2010 — la loi qui énonce les neuf critères protégés. Human Rights Act 1998.",
  "Rule of law · individual liberty · tolerance · protected characteristics · discrimination · rights and responsibilities.":
    "État de droit · liberté individuelle · tolérance · critères protégés · discrimination · droits et devoirs.",
  "In one line: The values are a list you may be asked to complete or spot a gap in, and every right on it has a matching duty.":
    "En une phrase : les valeurs forment une liste qu'on peut vous demander de compléter ou dont il faut repérer le manque, et chaque droit qu'elle porte a un devoir correspondant.",
  "Now answer these": "À vous de répondre",
};
